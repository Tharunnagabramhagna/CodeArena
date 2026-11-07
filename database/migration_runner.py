"""
CodeArena Database Migration Runner & Checksum Integrity Verifier
Manages execution of versioned MySQL migrations, calculates deterministic SHA-256
file content checksums, detects post-application modifications (tampering/drift),
and preserves immutable applied timestamps.
"""

import os
import sys
import hashlib
import time
import subprocess
import re

class MigrationIntegrityError(Exception):
    """Raised when an already-applied migration has been modified on disk."""
    pass

def calculate_file_checksum(filepath_or_content):
    """
    Calculates a deterministic lowercase SHA-256 hex digest of migration SQL contents.
    Normalizes CRLF to LF to ensure identical hashes across Windows, Linux, and macOS.
    """
    if isinstance(filepath_or_content, str) and os.path.exists(filepath_or_content):
        with open(filepath_or_content, 'r', encoding='utf-8') as f:
            content = f.read()
    else:
        content = filepath_or_content

    normalized = content.replace('\r\n', '\n').encode('utf-8')
    return hashlib.sha256(normalized).hexdigest().lower()

class MigrationPlan:
    """Represents a migration file with its metadata and calculated checksum."""
    def __init__(self, filepath):
        self.filepath = os.path.abspath(filepath)
        self.filename = os.path.basename(filepath)
        self.version = os.path.splitext(self.filename)[0]
        self.name = self._extract_name()
        self.checksum = calculate_file_checksum(self.filepath)

    def _extract_name(self):
        # Extract title from migration header comments or filename
        with open(self.filepath, 'r', encoding='utf-8') as f:
            content = f.read(1024)
        match = re.search(r'Description:\s*(.+)', content, re.IGNORECASE)
        if match:
            return match.group(1).strip()
        # Fallback to humanized filename
        parts = self.version.split('_', 1)
        return parts[1].replace('_', ' ').title() if len(parts) > 1 else self.version

    def read_sql(self, target_db=None):
        with open(self.filepath, 'r', encoding='utf-8') as f:
            sql = f.read()
        if target_db:
            sql = re.sub(r'\bcodearena_db\b', target_db, sql)
        return sql

class MigrationManager:
    """
    Executes and verifies migrations against a MySQL database.
    Can also operate with an abstracted executor for testing and validation.
    """
    def __init__(self, migrations_dir=None, mysql_cmd=None, db_name="codearena_db"):
        if migrations_dir is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            migrations_dir = os.path.join(base_dir, "database", "migrations")
            if not os.path.exists(migrations_dir):
                migrations_dir = os.path.join(base_dir, "migrations")
        self.migrations_dir = migrations_dir
        self.mysql_cmd = mysql_cmd or ["mysql", "-uroot", "-p"]
        self.db_name = db_name

    def get_migration_files(self):
        """Returns sorted list of .sql migration files."""
        if not os.path.exists(self.migrations_dir):
            return []
        files = sorted([
            os.path.join(self.migrations_dir, f)
            for f in os.listdir(self.migrations_dir)
            if f.endswith('.sql') and re.match(r'^\d{3}_', f)
        ])
        return [MigrationPlan(f) for f in files]

    def execute_query(self, query):
        """Executes a query and returns stdout."""
        cmd = list(self.mysql_cmd)
        if "--default-character-set=utf8mb4" not in cmd:
            cmd.append("--default-character-set=utf8mb4")
        cmd.extend([self.db_name, "-e", query])
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if res.returncode != 0:
            err_msg = res.stderr.decode('utf-8', errors='replace').strip()
            raise RuntimeError(f"Query execution failed: {err_msg}")
        return res.stdout.decode('utf-8', errors='replace').strip()

    def execute_sql(self, sql_content):
        """Executes arbitrary SQL script content using raw UTF-8 bytes."""
        cmd = list(self.mysql_cmd)
        if "--default-character-set=utf8mb4" not in cmd:
            cmd.append("--default-character-set=utf8mb4")
        cmd.append(self.db_name)
        if isinstance(sql_content, str):
            input_bytes = sql_content.encode('utf-8')
        else:
            input_bytes = sql_content
        res = subprocess.run(cmd, input=input_bytes, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if res.returncode != 0:
            err_msg = res.stderr.decode('utf-8', errors='replace').strip()
            raise RuntimeError(f"SQL execution failed: {err_msg}")
        return res.returncode

    def get_applied_migrations(self):
        """
        Retrieves all applied migrations from schema_migrations table.
        Returns dict: {version: {'checksum': checksum, 'applied_at': applied_at, 'name': name}}
        """
        query = "SELECT version, checksum, applied_at, name FROM schema_migrations ORDER BY applied_at ASC;"
        try:
            out = self.execute_query(query)
        except RuntimeError as e:
            if "Table" in str(e) and "doesn't exist" in str(e):
                return {}
            raise

        lines = out.split('\n')
        if len(lines) <= 1:
            return {}

        applied = {}
        for line in lines[1:]:
            parts = line.split('\t')
            if len(parts) >= 2:
                ver = parts[0].strip()
                chk = parts[1].strip().lower()
                applied_at = parts[2].strip() if len(parts) > 2 else ""
                name = parts[3].strip() if len(parts) > 3 else ""
                applied[ver] = {
                    'checksum': chk,
                    'applied_at': applied_at,
                    'name': name
                }
        return applied

    def verify_and_apply(self, migration_plan):
        """
        Verifies or applies a single migration plan.
        1. If already applied:
           - Verifies checksum.
           - If checksum differs, raises MigrationIntegrityError.
           - If checksum matches, skips execution (leaves applied_at untouched).
        2. If not applied:
           - Applies SQL.
           - Records in schema_migrations with actual SHA-256 file checksum.
        """
        applied = self.get_applied_migrations()
        ver = migration_plan.version
        current_checksum = migration_plan.checksum

        if ver in applied:
            stored_checksum = applied[ver]['checksum']
            if current_checksum != stored_checksum:
                raise MigrationIntegrityError(
                    f"Migration Integrity Violation: Migration '{ver}' has been modified after being applied!\n"
                    f"  Expected (stored): {stored_checksum}\n"
                    f"  Actual   (current): {current_checksum}\n"
                    f"Aborting migration pipeline to prevent database drift."
                )
            # Unchanged: do not re-execute, do not overwrite checksum or timestamp
            return {
                'status': 'SKIPPED_UNCHANGED',
                'version': ver,
                'checksum': stored_checksum,
                'applied_at': applied[ver]['applied_at']
            }

        # Not yet applied: execute and record
        start_time = time.time()
        sql_content = migration_plan.read_sql(self.db_name)
        self.execute_sql(sql_content)
        duration_ms = max(1, int((time.time() - start_time) * 1000))

        # Record migration with actual calculated file checksum
        # Note: Do NOT use ON DUPLICATE KEY UPDATE applied_at to avoid overwriting applied_at
        escaped_name = migration_plan.name.replace("'", "''")
        insert_query = (
            f"INSERT INTO schema_migrations (version, name, applied_at, checksum, execution_time_ms) "
            f"VALUES ('{ver}', '{escaped_name}', CURRENT_TIMESTAMP(3), '{current_checksum}', {duration_ms});"
        )
        self.execute_query(insert_query)

        return {
            'status': 'APPLIED',
            'version': ver,
            'checksum': current_checksum,
            'duration_ms': duration_ms
        }

    def run_all(self):
        """Discovers, verifies, and applies all migrations in sequential order."""
        plans = self.get_migration_files()
        results = []
        for plan in plans:
            res = self.verify_and_apply(plan)
            results.append(res)
        return results

def main():
    print("=" * 70)
    print(" CODEARENA MIGRATION INTEGRITY & CHECKSUM RUNNER")
    print("=" * 70)

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    migrations_dir = os.path.join(base_dir, "database", "migrations")
    if not os.path.exists(migrations_dir):
        migrations_dir = os.path.join(base_dir, "migrations")

    print(f"Migrations Directory: {migrations_dir}")
    plans = [MigrationPlan(os.path.join(migrations_dir, f)) for f in sorted(os.listdir(migrations_dir)) if f.endswith('.sql')]

    print(f"Discovered {len(plans)} Migration(s):")
    for p in plans:
        print(f"  • {p.version}: {p.name}")
        print(f"    SHA-256 Checksum: {p.checksum}")

    print("\nTo apply migrations to a running MySQL instance, run:")
    print("  python database/tests/run_live_mysql_validation.py")

if __name__ == '__main__':
    main()
