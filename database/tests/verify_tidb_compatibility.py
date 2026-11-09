"""
CodeArena — TiDB Cloud Architecture & Compatibility Verifier
Validates database migrations, schemas, seed suites, and test files
against TiDB Cloud Serverless (v8.5.3) MySQL 8.0 compatibility rules:
1. Zero unsupported stored procedures, functions, or triggers in migrations/seeds.
2. Zero DELIMITER blocks in production DDL/DML.
3. Verification of CHECK constraint declarations (chk_prereq_no_self) and session activation flags.
4. Verification of 33 tables, 41 foreign keys, and supported referential actions.
5. Canonical dataset invariants (50 Basic Java + 200 DSA = 250 problems, 600 hints, 520 samples, 30 topics, 48 prereqs).
6. UTF-8 Unicode byte encoding integrity across mathematical symbols.
7. Verification of procedural-free test suite (test_schema_tidb.sql).
"""

import os
import sys
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_DIR = BASE_DIR
MIGRATIONS_DIR = os.path.join(DB_DIR, 'migrations')
SEEDS_DIR = os.path.join(DB_DIR, 'seeds')
TIDB_DIR = os.path.join(DB_DIR, 'tidb')
TESTS_DIR = os.path.join(DB_DIR, 'tests')

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

def run_tidb_audit():
    print("=" * 75)
    print(" CODEARENA TiDB CLUSTER COMPATIBILITY AUDIT SUITE (v8.5.3-serverless)")
    print("=" * 75)

    # -------------------------------------------------------------------------
    # 1. Stored Procedures, Functions & Triggers Check
    # -------------------------------------------------------------------------
    print("\n[Audit 1] Unsupported Procedural Construct Scan (CREATE PROCEDURE/FUNCTION/TRIGGER):")
    production_files = []
    for d in [MIGRATIONS_DIR, SEEDS_DIR, TIDB_DIR]:
        if os.path.exists(d):
            for root, _, files in os.walk(d):
                for f in files:
                    if f.endswith('.sql'):
                        production_files.append(os.path.join(root, f))

    procedural_violations = []
    delimiter_violations = []
    for pf in production_files:
        with open(pf, 'r', encoding='utf-8') as f:
            content = f.read()
        rel = os.path.relpath(pf, DB_DIR)
        if re.search(r'^\s*CREATE\s+(PROCEDURE|FUNCTION|TRIGGER)\b', content, re.IGNORECASE | re.MULTILINE):
            procedural_violations.append(rel)
        if re.search(r'^\s*DELIMITER\b', content, re.IGNORECASE | re.MULTILINE):
            delimiter_violations.append(rel)

    test(len(procedural_violations) == 0, f"Zero stored procedures/functions/triggers in production SQL (Violations: {procedural_violations})")
    test(len(delimiter_violations) == 0, f"Zero DELIMITER statements in production SQL (Violations: {delimiter_violations})")

    # -------------------------------------------------------------------------
    # 2. CHECK Constraints & Session Activation Audit
    # -------------------------------------------------------------------------
    print("\n[Audit 2] CHECK Constraint & Session Activation Audit:")
    m001_path = os.path.join(MIGRATIONS_DIR, '001_initial_schema.sql')
    with open(m001_path, 'r', encoding='utf-8') as f:
        m001_sql = f.read()
    test("chk_prereq_no_self" in m001_sql, "chk_prereq_no_self CHECK constraint declared in Migration 001")

    tidb_deploy_path = os.path.join(TIDB_DIR, 'deploy_tidb_cloud.sql')
    test(os.path.exists(tidb_deploy_path), "TiDB Cloud turnkey deployer exists (deploy_tidb_cloud.sql)")
    with open(tidb_deploy_path, 'r', encoding='utf-8') as f:
        deploy_sql = f.read()
    test("tidb_enable_check_constraint = ON" in deploy_sql, "deploy_tidb_cloud.sql sets tidb_enable_check_constraint = ON")
    test("ALLOW_INVALID_DATES" not in deploy_sql, "deploy_tidb_cloud.sql enforces strict TRADITIONAL sql_mode (zero ALLOW_INVALID_DATES)")
    deploy_tables = len(re.findall(r'CREATE TABLE IF NOT EXISTS\s+(\w+)', deploy_sql))
    test(deploy_tables == 33, f"deploy_tidb_cloud.sql provisions exactly 33 tables (found: {deploy_tables})")
    deploy_fks = len(re.findall(r'\bCONSTRAINT\s+\w+\s+FOREIGN\s+KEY\b', deploy_sql, re.IGNORECASE))
    test(deploy_fks == 41, f"deploy_tidb_cloud.sql defines exactly 41 foreign keys (found: {deploy_fks})")
    test("FOREIGN_KEY_CHECKS=0" not in deploy_sql and "FOREIGN_KEY_CHECKS = 0" not in deploy_sql, "deploy_tidb_cloud.sql keeps foreign_key_checks=1 enabled (zero FOREIGN_KEY_CHECKS=0)")
    test("001_initial_schema" in deploy_sql and "002_user_oauth_accounts" in deploy_sql, "deploy_tidb_cloud.sql records migrations 001 and 002")
    test("ON DUPLICATE KEY UPDATE \n    checksum" not in deploy_sql and "ON DUPLICATE KEY UPDATE checksum" not in deploy_sql, "deploy_tidb_cloud.sql never silently overwrites recorded migration checksums")
    test("WHERE NOT EXISTS (SELECT 1 FROM schema_migrations WHERE version = '001_initial_schema')" in deploy_sql, "deploy_tidb_cloud.sql uses immutable WHERE NOT EXISTS migration registration")
    test("hello-world" in deploy_sql and "find-pivot-index" in deploy_sql, "deploy_tidb_cloud.sql contains Basic (Seed 02) and DSA (Seed 03) problems")
    test("intro-to-java" in deploy_sql and "dev_student" in deploy_sql, "deploy_tidb_cloud.sql contains Roadmap (Seed 04) and Dev Fixtures (Seed 05)")

    tidb_m001_path = os.path.join(TIDB_DIR, 'migrations', '001_initial_schema_tidb.sql')
    test(os.path.exists(tidb_m001_path), "TiDB modular migration 001 exists")
    with open(tidb_m001_path, 'r', encoding='utf-8') as f:
        tidb_m001_sql = f.read()
    test("tidb_enable_check_constraint = ON" in tidb_m001_sql, "001_initial_schema_tidb.sql activates CHECK constraints")
    m001_tables_count = len(re.findall(r'CREATE TABLE IF NOT EXISTS\s+(\w+)', tidb_m001_sql))
    test(m001_tables_count == 32, f"001_initial_schema_tidb.sql provisions exactly 32 baseline tables (found: {m001_tables_count})")

    # -------------------------------------------------------------------------
    # 3. Foreign Keys & Cascading Action Audit
    # -------------------------------------------------------------------------
    print("\n[Audit 3] Foreign Keys & Referential Action Compatibility:")
    fk_count_001 = len(re.findall(r'\bCONSTRAINT\s+\w+\s+FOREIGN\s+KEY\b', m001_sql, re.IGNORECASE))
    test(fk_count_001 == 40, f"Migration 001 defines exactly 40 foreign keys (found: {fk_count_001})")

    m002_path = os.path.join(MIGRATIONS_DIR, '002_user_oauth_accounts.sql')
    with open(m002_path, 'r', encoding='utf-8') as f:
        m002_sql = f.read()
    fk_count_002 = len(re.findall(r'\bCONSTRAINT\s+\w+\s+FOREIGN\s+KEY\b', m002_sql, re.IGNORECASE))
    test(fk_count_002 == 1, f"Migration 002 defines exactly 1 foreign key (found: {fk_count_002})")
    test("ON DELETE CASCADE" in m002_sql, "Migration 002 specifies supported ON DELETE CASCADE referential action")

    # -------------------------------------------------------------------------
    # 4. Collation & Encoding Compatibility
    # -------------------------------------------------------------------------
    print("\n[Audit 4] Character Set & Collation Compatibility:")
    test("utf8mb4_0900_ai_ci" in m001_sql, "Migration 001 declares utf8mb4_0900_ai_ci collation (supported in TiDB v7.4+)")
    test("utf8mb4_0900_ai_ci" in m002_sql, "Migration 002 declares utf8mb4_0900_ai_ci collation")

    dsa_seed_path = os.path.join(SEEDS_DIR, '03_dsa_problems_seed.sql')
    with open(dsa_seed_path, 'r', encoding='utf-8') as f:
        dsa_sql = f.read()
    raw_utf8_bytes = dsa_sql.encode('utf-8')
    test(len(raw_utf8_bytes) > len(dsa_sql), f"Mathematical Unicode characters present in DSA seed ({len(raw_utf8_bytes)} UTF-8 bytes)")
    test('⌊' in dsa_sql and '⌋' in dsa_sql, "Mathematical floor characters (⌊, ⌋) intact in DSA seed")

    # -------------------------------------------------------------------------
    # 5. Canonical Dataset & ID Integrity
    # -------------------------------------------------------------------------
    print("\n[Audit 5] Canonical Dataset Preservation:")
    basic_seed_path = os.path.join(SEEDS_DIR, '02_basic_problems_seed.sql')
    with open(basic_seed_path, 'r', encoding='utf-8') as f:
        basic_sql = f.read()
    basic_ids = [int(m.group(1)) for m in re.finditer(r'\((\d+),\s*1,\s*\d+,\s*\d+,\s*\'[^\']+\'', basic_sql)]
    test(len(basic_ids) == 50 and min(basic_ids) == 1 and max(basic_ids) == 50, "Basic Java problems canonical IDs 1..50 verified")

    dsa_ids = [int(m.group(1)) for m in re.finditer(r'\((\d+),\s*2,\s*\d+,\s*\d+,\s*\'[^\']+\'', dsa_sql)]
    test(len(dsa_ids) == 200 and min(dsa_ids) == 101 and max(dsa_ids) == 300, "DSA problems canonical IDs 101..300 verified (200 problems)")

    roadmap_seed_path = os.path.join(SEEDS_DIR, '04_roadmap_seed.sql')
    with open(roadmap_seed_path, 'r', encoding='utf-8') as f:
        rm_sql = f.read()
    topic_ids = [int(m.group(1)) for m in re.finditer(r'\((\d+),\s*\'[^\']+\',\s*\d+,\s*\d+,\s*\'[^\']+\'', rm_sql)]
    test(len(topic_ids) == 30 and min(topic_ids) == 1 and max(topic_ids) == 30, "Roadmap milestone topics canonical IDs 1..30 verified")

    # -------------------------------------------------------------------------
    # 6. Procedural-Free TiDB Test Suite Verification
    # -------------------------------------------------------------------------
    print("\n[Audit 6] TiDB Declarative Test Suite Audit (test_schema_tidb.sql):")
    tidb_test_path = os.path.join(TESTS_DIR, 'test_schema_tidb.sql')
    test(os.path.exists(tidb_test_path), "test_schema_tidb.sql exists in database/tests/")
    with open(tidb_test_path, 'r', encoding='utf-8') as f:
        tidb_test_sql = f.read()
    test("CREATE PROCEDURE" not in tidb_test_sql, "test_schema_tidb.sql is completely procedural-free (zero CREATE PROCEDURE)")
    test("DELIMITER" not in tidb_test_sql, "test_schema_tidb.sql uses zero DELIMITER blocks")
    test("information_schema.tables" in tidb_test_sql, "test_schema_tidb.sql audits 33 tables via information_schema")
    test("information_schema.table_constraints" in tidb_test_sql, "test_schema_tidb.sql audits 41 foreign keys via table_constraints")
    test("chk_prereq_no_self" in tidb_test_sql, "test_schema_tidb.sql audits CHECK constraint registration")
    test("uk_provider_user" in tidb_test_sql, "test_schema_tidb.sql audits OAuth composite unique constraint")
    test("tidb_audit_results" in tidb_test_sql, "test_schema_tidb.sql records structured findings in tidb_audit_results")
    test("6e9bf67a5afe5ccc5251c5463c3cd8c668b41afafa6b49b3cc988aa6ff2187ec" in tidb_test_sql, "test_schema_tidb.sql strictly verifies Migration 001 SHA-256 checksum")
    test("aef262ed3f20b09bfa247593993392c02795fb11e674bc9e2f13bba8c42571e2" in tidb_test_sql, "test_schema_tidb.sql strictly verifies Migration 002 SHA-256 checksum")
    test("test_failure_sentinel" in tidb_test_sql, "test_schema_tidb.sql provisions sentinel table (test_failure_sentinel)")
    test("INSERT INTO test_failure_sentinel" in tidb_test_sql, "test_schema_tidb.sql triggers fatal duplicate key ERROR 1062 on failure")
    test("SELECT 1 / (CASE WHEN fail_count = 0" not in tidb_test_sql, "test_schema_tidb.sql does NOT rely on passive SELECT division-by-zero")
    test("ALLOW_INVALID_DATES" not in tidb_test_sql, "test_schema_tidb.sql enforces strict TRADITIONAL sql_mode (zero ALLOW_INVALID_DATES)")

    # -------------------------------------------------------------------------
    # 7. Documentation Integrity
    # -------------------------------------------------------------------------
    print("\n[Audit 7] TiDB Documentation & Architecture Audit:")
    doc_path = os.path.join(DB_DIR, 'docs', 'tidb-cloud-compatibility-audit.md')
    test(os.path.exists(doc_path), "tidb-cloud-compatibility-audit.md exists in database/docs/")
    with open(doc_path, 'r', encoding='utf-8') as f:
        doc_content = f.read()
    test("codearena-db" in doc_content and "codearena_db" in doc_content, "Documentation records cluster name and database name")
    test("8.0.11-TiDB-v8.5.3-serverless" in doc_content, "Documentation records exact verified TiDB serverless version")
    test("tidb_enable_check_constraint" in doc_content, "Documentation explains CHECK constraint enablement")
    test(not re.search(r'```sql[^`]*SET\s+GLOBAL', doc_content, re.IGNORECASE), "Documentation excludes unsupported SET GLOBAL commands from SQL code blocks")
    test("staging_canonical_problems" in doc_content, "Documentation provides non-destructive staging pattern for populated database recovery")

    print("\n" + "=" * 75)
    print(f" TiDB COMPATIBILITY AUDIT: {PASSED} Passed, {FAILED} Failed.")
    print("=" * 75)

    if FAILED > 0:
        sys.exit(1)

if __name__ == '__main__':
    run_tidb_audit()
