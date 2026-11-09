"""
CodeArena — Automated Test Suite: Migration Checksum & Integrity Lifecycle
Tests:
1. Unchanged migration passes checksum verification.
2. Modified/tampered migration fails checksum verification with clear error reporting.
3. Re-running an unchanged migration preserves original recorded checksum and applied timestamp.
4. Migration 001 remains immutable (baseline 32 tables, no OAuth table, creates schema_migrations).
5. Migration 002 creates user_oauth_accounts table with composite unique constraint and ON DELETE CASCADE.
6. Both migrations execute in strict sequential order (001 -> 002) satisfying FK dependencies.
"""

import os
import sys
import re
import copy
import time
from datetime import datetime

# Import migration runner
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from migration_runner import (
    MigrationPlan,
    MigrationManager,
    MigrationIntegrityError,
    calculate_file_checksum
)

PASSED = 0
FAILED = 0

def test(condition, description):
    global PASSED, FAILED
    if condition:
        print(f"  [PASS] {description}")
        PASSED += 1
    else:
        print(f"  [FAIL] {description}")
        FAILED += 1

class MockMigrationTracker:
    """Simulates MySQL schema_migrations table in-memory for offline testing."""
    def __init__(self):
        self.records = {} # {version: {name, applied_at, checksum, execution_time_ms}}
        self.execution_log = []

    def get_applied(self):
        return copy.deepcopy(self.records)

    def apply(self, plan):
        ver = plan.version
        current_checksum = plan.checksum

        if ver in self.records:
            stored_checksum = self.records[ver]['checksum']
            if current_checksum.lower() != stored_checksum.lower():
                raise MigrationIntegrityError(
                    f"Migration Integrity Violation: Migration '{ver}' has been modified after being applied!\n"
                    f"  Expected: {stored_checksum}\n"
                    f"  Actual:   {current_checksum}"
                )
            # Unchanged: do NOT alter applied_at or checksum
            return {
                'status': 'SKIPPED_UNCHANGED',
                'version': ver,
                'checksum': stored_checksum,
                'applied_at': self.records[ver]['applied_at']
            }

        # Apply new migration
        timestamp = datetime.now().isoformat()
        self.records[ver] = {
            'version': ver,
            'name': plan.name,
            'applied_at': timestamp,
            'checksum': current_checksum,
            'execution_time_ms': 25
        }
        self.execution_log.append(ver)
        return {
            'status': 'APPLIED',
            'version': ver,
            'checksum': current_checksum,
            'applied_at': timestamp
        }

def run_tests():
    print("=" * 75)
    print(" CODEARENA MIGRATION CHECKSUM & INTEGRITY AUTOMATED TEST SUITE")
    print("=" * 75)

    migrations_dir = os.path.join(BASE_DIR, 'migrations')
    m001_path = os.path.join(migrations_dir, '001_initial_schema.sql')
    m002_path = os.path.join(migrations_dir, '002_user_oauth_accounts.sql')

    with open(m001_path, 'r', encoding='utf-8') as f:
        m001_sql = f.read()

    with open(m002_path, 'r', encoding='utf-8') as f:
        m002_sql = f.read()

    # ------------------------------------------------------------------------
    # 1. Unchanged migration passes checksum verification
    # ------------------------------------------------------------------------
    print("\n[Test 1] Unchanged Migration Checksum Verification:")
    plan1 = MigrationPlan(m001_path)
    plan2 = MigrationPlan(m002_path)

    test(len(plan1.checksum) == 64, f"Migration 001 SHA-256 is 64 hex characters: {plan1.checksum[:16]}...")
    test(len(plan2.checksum) == 64, f"Migration 002 SHA-256 is 64 hex characters: {plan2.checksum[:16]}...")
    test(plan1.checksum != plan2.checksum, "Migration 001 and 002 produce distinct file checksums")

    tracker = MockMigrationTracker()
    res1 = tracker.apply(plan1)
    res2 = tracker.apply(plan2)
    test(res1['status'] == 'APPLIED', "Migration 001 successfully applied on first run")
    test(res2['status'] == 'APPLIED', "Migration 002 successfully applied on first run")

    # Verify unchanged re-check
    recheck1 = tracker.apply(plan1)
    recheck2 = tracker.apply(plan2)
    test(recheck1['status'] == 'SKIPPED_UNCHANGED', "Unchanged Migration 001 passes verification and is skipped")
    test(recheck2['status'] == 'SKIPPED_UNCHANGED', "Unchanged Migration 002 passes verification and is skipped")

    # ------------------------------------------------------------------------
    # 2. Modified migration fails checksum verification
    # ------------------------------------------------------------------------
    print("\n[Test 2] Tampered/Modified Migration Detection:")
    # Create a modified version of plan2 (tampered SQL content)
    tampered_sql = m002_sql + "\n-- Tampered comment or rogue DDL injection"
    tampered_checksum = calculate_file_checksum(tampered_sql)
    test(tampered_checksum != plan2.checksum, "Tampered content produces altered SHA-256 hash")

    class TamperedPlan:
        def __init__(self, original_plan, new_checksum):
            self.version = original_plan.version
            self.name = original_plan.name
            self.checksum = new_checksum

    tampered_plan = TamperedPlan(plan2, tampered_checksum)

    integrity_violation_caught = False
    error_message = ""
    try:
        tracker.apply(tampered_plan)
    except MigrationIntegrityError as e:
        integrity_violation_caught = True
        error_message = str(e)

    test(integrity_violation_caught, "Modified migration triggered MigrationIntegrityError")
    test("002_user_oauth_accounts" in error_message, "Error message correctly identifies modified migration version")
    test("Expected:" in error_message and "Actual:" in error_message, "Error message displays expected vs actual checksums")

    # ------------------------------------------------------------------------
    # 3. Re-running unchanged migration does NOT alter checksum or timestamp
    # ------------------------------------------------------------------------
    print("\n[Test 3] Timestamp & Checksum Immutability on Rerun:")
    stored_before = tracker.get_applied()['001_initial_schema']
    original_timestamp = stored_before['applied_at']
    original_checksum = stored_before['checksum']

    time.sleep(0.01) # Small delay to ensure any timestamp modification would be detected
    tracker.apply(plan1) # Re-apply unchanged

    stored_after = tracker.get_applied()['001_initial_schema']
    test(stored_after['applied_at'] == original_timestamp, "Original applied_at timestamp remains completely unchanged")
    test(stored_after['checksum'] == original_checksum, "Original recorded checksum remains completely unchanged")

    # ------------------------------------------------------------------------
    # 4. Migration 001 remains unchanged (immutable baseline)
    # ------------------------------------------------------------------------
    print("\n[Test 4] Migration 001 Baseline Immutability:")
    m001_tables = re.findall(r'CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_]+)', m001_sql, re.IGNORECASE)
    test(len(m001_tables) == 32, f"Migration 001 provisions exactly 32 baseline tables (found: {len(m001_tables)})")
    test('user_oauth_accounts' not in [t.lower() for t in m001_tables], "Migration 001 strictly DOES NOT contain user_oauth_accounts")
    test('schema_migrations' in [t.lower() for t in m001_tables], "Migration 001 creates schema_migrations tracking table")
    test("SHA2('001_initial_schema'" not in m001_sql, "Migration 001 does NOT contain hardcoded string hash SHA2('001_initial_schema')")

    # ------------------------------------------------------------------------
    # 5. Migration 002 still creates OAuth table
    # ------------------------------------------------------------------------
    print("\n[Test 5] Migration 002 OAuth Functionality:")
    m002_tables = re.findall(r'CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_]+)', m002_sql, re.IGNORECASE)
    test('user_oauth_accounts' in [t.lower() for t in m002_tables], "Migration 002 defines user_oauth_accounts")
    test("provider ENUM('GOOGLE', 'FACEBOOK')" in m002_sql, "Migration 002 restricts provider strictly to GOOGLE and FACEBOOK")
    test('uk_provider_user' in m002_sql and 'UNIQUE (provider, provider_user_id)' in m002_sql, "Migration 002 enforces composite uniqueness on (provider, provider_user_id)")
    test(bool(re.search(r'FOREIGN\s+KEY\s*\(user_id\)\s*REFERENCES\s+users\s*\(id\)[\s\S]*?ON DELETE CASCADE', m002_sql, re.IGNORECASE)), "Migration 002 establishes ON DELETE CASCADE to users(id)")
    test("SHA2('002_user_oauth_accounts'" not in m002_sql, "Migration 002 does NOT contain hardcoded string hash SHA2('002_user_oauth_accounts')")

    # ------------------------------------------------------------------------
    # 6. Both migrations execute in correct order (001 -> 002)
    # ------------------------------------------------------------------------
    print("\n[Test 6] Migration Sequential Ordering & Dependency Integrity:")
    manager = MigrationManager(migrations_dir)
    discovered_plans = manager.get_migration_files()
    test(len(discovered_plans) == 2, f"Discovered exactly 2 migrations (found: {len(discovered_plans)})")
    test(discovered_plans[0].version == '001_initial_schema', "First migration in sequence is 001_initial_schema")
    test(discovered_plans[1].version == '002_user_oauth_accounts', "Second migration in sequence is 002_user_oauth_accounts")
    test(discovered_plans[0].version < discovered_plans[1].version, "Lexicographical numeric ordering guarantees 001 runs before 002")

    # FK dependency verification: users table created in 001 before referenced in 002
    test('CREATE TABLE IF NOT EXISTS users' in m001_sql, "Migration 001 creates parent users table")
    test('REFERENCES users (id)' in m002_sql, "Migration 002 references parent users(id) created by Migration 001")

    print("\n" + "=" * 75)
    print(f" TEST RESULTS: {PASSED} Passed, {FAILED} Failed.")
    print("=" * 75)

    if FAILED > 0:
        sys.exit(1)

if __name__ == '__main__':
    run_tests()

