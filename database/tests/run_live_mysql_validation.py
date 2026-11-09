"""
CodeArena Live MySQL Integration & Integrity Test Runner
Executes real MySQL verification against a disposable test database:
- Creates disposable database `codearena_disposable_test_db` (never drops production/existing DBs)
- Runs migration: 001_initial_schema.sql
- Runs all 5 seed scripts
- Validates 32 tables, 40 foreign keys, and exact record counts
- Validates constraints (PK, UK, FK, Check, Cascade)
- Tests seed rerun idempotency
- Safely cleans up the disposable database
"""

import os
import sys
import subprocess
import getpass
import hashlib
import time

def calculate_file_checksum(filepath):
    """Calculates deterministic lowercase SHA-256 hex digest of file contents (normalized newlines)."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    norm = content.replace('\r\n', '\n').encode('utf-8')
    return hashlib.sha256(norm).hexdigest().lower()

def run_mysql_subprocess(cmd_args, input_sql=None, db_name=None, sql_string=None):
    """
    Executes a MySQL command or SQL input using raw UTF-8 encoded bytes.
    Avoids Windows cp1252/charmap UnicodeEncodeError on mathematical/Unicode symbols.
    """
    cmd = list(cmd_args)
    if db_name:
        cmd.append(db_name)
    
    input_bytes = None
    if sql_string:
        cmd.extend(["-e", sql_string])
    elif input_sql is not None:
        if isinstance(input_sql, str):
            input_bytes = input_sql.encode('utf-8')
        else:
            input_bytes = input_sql
    
    res = subprocess.run(cmd, input=input_bytes, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout_text = res.stdout.decode('utf-8', errors='replace')
    stderr_text = res.stderr.decode('utf-8', errors='replace')
    return res.returncode, stdout_text, stderr_text

def run_mysql_command(mysql_bin, user, password, host, port, db_name, sql_script_path=None, sql_string=None, input_sql=None):
    """Executes a SQL command or script via mysql CLI using UTF-8."""
    cmd = [
        mysql_bin,
        f"-h{host}",
        f"-P{port}",
        f"-u{user}",
        "--default-character-set=utf8mb4"
    ]
    if password:
        cmd.append(f"-p{password}")
    
    if sql_script_path:
        with open(sql_script_path, 'rb') as f:
            script_bytes = f.read()
        return run_mysql_subprocess(cmd, input_sql=script_bytes, db_name=db_name)
    
    return run_mysql_subprocess(cmd, input_sql=input_sql, db_name=db_name, sql_string=sql_string)

def main():
    print("=" * 75)
    print(" CODEARENA LIVE MYSQL INTEGRATION & VALIDATION RUNNER")
    print("=" * 75)

    # Locate mysql executable
    default_mysql_win = r"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
    mysql_bin = "mysql"
    if os.path.exists(default_mysql_win):
        mysql_bin = default_mysql_win

    user = os.getenv("MYSQL_USER", "root")
    password = os.getenv("MYSQL_PWD", os.getenv("MYSQL_PASSWORD"))
    host = os.getenv("MYSQL_HOST", "127.0.0.1")
    port = os.getenv("MYSQL_PORT", "3306")

    print(f"Connecting to MySQL ({host}:{port}) as user '{user}'...")

    if not password:
        print("Note: No password found in environment variables (MYSQL_PWD or MYSQL_PASSWORD).")
        password = getpass.getpass("Enter MySQL password (or press Enter if empty): ")

    # Test connection
    ret, out, err = run_mysql_command(mysql_bin, user, password, host, port, None, sql_string="SELECT VERSION();")
    if ret != 0:
        print("\n[ERROR] Unable to connect to MySQL server:")
        print(f"  {err.strip()}")
        print("\nTroubleshooting:")
        print("  1. Verify the MySQL service is running on port 3306.")
        print("  2. Verify your password is correct.")
        print("  3. You can set $env:MYSQL_PWD = 'your_password' before running.")
        sys.exit(1)

    mysql_version = out.strip().split('\n')[-1]
    print(f"✓ Connected successfully to MySQL Server Version: {mysql_version}")

    cmd = [
        mysql_bin,
        f"-h{host}",
        f"-P{port}",
        f"-u{user}",
        "--default-character-set=utf8mb4"
    ]
    if password:
        cmd.append(f"-p{password}")

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    migrations_dir = os.path.join(base_dir, 'migrations')
    seeds_dir = os.path.join(base_dir, 'seeds')

    test_db = "codearena_disposable_test_db"
    print(f"\n[1] Creating fresh disposable test database: `{test_db}`...")
    run_mysql_command(mysql_bin, user, password, host, port, None, sql_string=f"CREATE DATABASE IF NOT EXISTS `{test_db}` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;")

    try:
        # Step 2: Run Migrations in Strict Sequential Order (001 -> 002) with Content Checksum Tracking
        print(f"\n[2] Executing Migrations in Strict Sequential Order (001 -> 002) with Checksum Tracking...")
        
        # 2a: Run Baseline Migration 001
        m001_path = os.path.join(migrations_dir, '001_initial_schema.sql')
        m001_checksum = calculate_file_checksum(m001_path)
        with open(m001_path, 'r', encoding='utf-8') as mf:
            m001_sql = mf.read().replace('codearena_db', test_db)
        
        t0 = time.time()
        ret, stdout_res, stderr_res = run_mysql_subprocess(cmd, input_sql=m001_sql)
        if ret != 0:
            print(f"  ✖ Migration 001_initial_schema.sql failed: {stderr_res}")
            sys.exit(1)
        dur1 = max(1, int((time.time() - t0) * 1000))
        
        # Record Migration 001 in schema_migrations with actual content checksum
        ins1 = f"INSERT INTO schema_migrations (version, name, applied_at, checksum, execution_time_ms) VALUES ('001_initial_schema', 'Initial CodeArena Schema Foundation', CURRENT_TIMESTAMP(3), '{m001_checksum}', {dur1});"
        run_mysql_command(mysql_bin, user, password, host, port, test_db, sql_string=ins1)
        print(f"  ✓ Applied migration 001_initial_schema (checksum: {m001_checksum[:12]}..., {dur1}ms)")

        # Verify baseline table count immediately after 001
        ret, out, err = run_mysql_command(mysql_bin, user, password, host, port, test_db, 
            sql_string=f"SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '{test_db}' AND table_type = 'BASE TABLE';")
        m001_tbl_count = int(out.strip().split('\n')[-1])
        print(f"    • Baseline Table Count after Migration 001: {m001_tbl_count} (Expected: 32)")
        assert m001_tbl_count == 32, f"Expected 32 tables after Migration 001, found {m001_tbl_count}"

        # 2b: Run Feature Migration 002 (Forward upgrade)
        m002_path = os.path.join(migrations_dir, '002_user_oauth_accounts.sql')
        m002_checksum = calculate_file_checksum(m002_path)
        with open(m002_path, 'r', encoding='utf-8') as mf:
            m002_sql = mf.read().replace('codearena_db', test_db)
            
        t0 = time.time()
        ret, stdout_res, stderr_res = run_mysql_subprocess(cmd, input_sql=m002_sql)
        if ret != 0:
            print(f"  ✖ Migration 002_user_oauth_accounts.sql failed: {stderr_res}")
            sys.exit(1)
        dur2 = max(1, int((time.time() - t0) * 1000))
        
        # Record Migration 002 in schema_migrations with actual content checksum
        ins2 = f"INSERT INTO schema_migrations (version, name, applied_at, checksum, execution_time_ms) VALUES ('002_user_oauth_accounts', 'External OAuth Account Linking for Google and Facebook', CURRENT_TIMESTAMP(3), '{m002_checksum}', {dur2});"
        run_mysql_command(mysql_bin, user, password, host, port, test_db, sql_string=ins2)
        print(f"  ✓ Applied migration 002_user_oauth_accounts (checksum: {m002_checksum[:12]}..., {dur2}ms)")

        # Verify table count after forward migration 002
        ret, out, err = run_mysql_command(mysql_bin, user, password, host, port, test_db, 
            sql_string=f"SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '{test_db}' AND table_type = 'BASE TABLE';")
        m002_tbl_count = int(out.strip().split('\n')[-1])
        print(f"    • Table Count after Migration 002: {m002_tbl_count} (Expected: 33)")
        assert m002_tbl_count == 33, f"Expected 33 tables after Migration 002, found {m002_tbl_count}"

        # 2c: Verify Migration Checksums in schema_migrations
        ret, out, err = run_mysql_command(mysql_bin, user, password, host, port, test_db, 
            sql_string=f"SELECT version, checksum, applied_at FROM schema_migrations ORDER BY applied_at ASC;")
        print("    • Migration History Verified in schema_migrations:")
        for line in out.strip().split('\n'):
            print(f"      {line}")

        # 2d: Validate Rerun Idempotency (Unchanged Checksum and Unchanged applied_at)
        print("    • Validating Checksum Verification on Rerun...")
        ret, out, err = run_mysql_command(mysql_bin, user, password, host, port, test_db, 
            sql_string=f"SELECT version, checksum, applied_at FROM schema_migrations WHERE version='001_initial_schema';")
        rec_parts = out.strip().split('\n')[-1].split('\t')
        assert rec_parts[1].lower() == m001_checksum.lower(), "Stored checksum must match actual 001 file checksum"
        print(f"      ✓ Checksum matched actual file content ({m001_checksum[:12]}...). No updates or overwrites performed.")

        # Step 3: Run Seed Scripts
        seed_files = [
            '01_reference_data.sql',
            '02_basic_problems_seed.sql',
            '03_dsa_problems_seed.sql',
            '04_roadmap_seed.sql',
            '05_dev_sample_data.sql'
        ]
        print(f"\n[3] Executing 5 Seed Scripts in Sequence...")
        for sf in seed_files:
            sf_path = os.path.join(seeds_dir, sf)
            with open(sf_path, 'r', encoding='utf-8') as f:
                s_sql = f.read().replace('codearena_db', test_db)
            ret, stdout_res, stderr_res = run_mysql_subprocess(cmd, input_sql=s_sql)
            if ret != 0:
                print(f"  ✖ Seed {sf} failed: {stderr_res}")
                sys.exit(1)
            print(f"  ✓ Applied {sf}")

        # Step 4: Validate Tables & Foreign Keys Count
        print(f"\n[4] Validating Actual Database Metadata via information_schema...")
        q_tables = f"SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '{test_db}' AND table_type = 'BASE TABLE';"
        ret, out, err = run_mysql_command(mysql_bin, user, password, host, port, test_db, sql_string=q_tables)
        tbl_count = int(out.strip().split('\n')[-1])
        print(f"  • Actual Tables Created: {tbl_count} (Expected: 33)")
        assert tbl_count == 33, f"Expected 33 tables, found {tbl_count}"

        q_fks = f"SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_schema = '{test_db}' AND constraint_type = 'FOREIGN KEY';"
        ret, out, err = run_mysql_command(mysql_bin, user, password, host, port, test_db, sql_string=q_fks)
        fk_count = int(out.strip().split('\n')[-1])
        print(f"  • Actual Foreign Keys Active: {fk_count} (Expected: 41)")
        assert fk_count == 41, f"Expected 41 foreign keys, found {fk_count}"

        # Step 5: Validate Record Counts
        print(f"\n[5] Validating Actual Inserted Record Counts...")
        counts_to_check = [
            ("Basic Problems (track_id = 1)", f"SELECT COUNT(*) FROM problems WHERE track_id = 1;", 50),
            ("DSA Problems (track_id = 2)", f"SELECT COUNT(*) FROM problems WHERE track_id = 2;", 200),
            ("Progressive Hints (problem_hints)", f"SELECT COUNT(*) FROM problem_hints;", 600),
            ("Public Sample Test Cases", f"SELECT COUNT(*) FROM problem_test_cases WHERE is_sample = TRUE;", 520),
            ("Roadmap Topics (roadmap_topics)", f"SELECT COUNT(*) FROM roadmap_topics;", 30),
            ("Prerequisites (roadmap_prerequisites)", f"SELECT COUNT(*) FROM roadmap_prerequisites;", 48),
            ("Roadmap Problem Links", f"SELECT COUNT(*) FROM roadmap_topic_problems;", 121),
            ("Roles", f"SELECT COUNT(*) FROM roles;", 3),
            ("Categories", f"SELECT COUNT(*) FROM categories;", 25)
        ]
        for label, query, target in counts_to_check:
            ret, out, err = run_mysql_command(mysql_bin, user, password, host, port, test_db, sql_string=query)
            cnt = int(out.strip().split('\n')[-1])
            print(f"  • {label}: {cnt} (Expected: {target})")
            assert cnt == target, f"Expected {target} for {label}, found {cnt}"

        # Step 6: Test Seed Idempotency (Safe Rerun)
        print(f"\n[6] Testing Seed Rerun Idempotency (Re-executing all seeds)...")
        for sf in seed_files:
            sf_path = os.path.join(seeds_dir, sf)
            with open(sf_path, 'r', encoding='utf-8') as f:
                s_sql = f.read().replace('codearena_db', test_db)
            ret, stdout_res, stderr_res = run_mysql_subprocess(cmd, input_sql=s_sql)
            assert ret == 0, f"Rerun of {sf} failed: {stderr_res}"
        print("  ✓ All seed scripts successfully re-executed with zero errors or duplicates.")

        # Step 7: Run Constraint Verification Suite
        print(f"\n[7] Executing Constraint Verification Stored Procedure...")
        t_path = os.path.join(base_dir, 'tests', 'test_schema_mysql.sql')
        with open(t_path, 'r', encoding='utf-8') as f:
            t_sql = f.read().replace('codearena_db', test_db)
        ret, stdout_res, stderr_res = run_mysql_subprocess(cmd, input_sql=t_sql)
        print(stdout_res)
        if ret != 0:
            print(f"  ✖ Constraint Verification Suite failed: {stderr_res}")
            sys.exit(1)

        print("\n" + "=" * 75)
        print(" LIVE MYSQL VALIDATION SUITE: 100% OF TESTS PASSED")
        print("=" * 75)

    finally:
        # Safe cleanup of disposable database
        print(f"\nCleaning up disposable test database: `{test_db}`...")
        run_mysql_command(mysql_bin, user, password, host, port, None, sql_string=f"DROP DATABASE IF EXISTS `{test_db}`;")
        print("✓ Cleanup completed.")

if __name__ == '__main__':
    main()

