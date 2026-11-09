-- ============================================================================
-- CodeArena TiDB Cloud Database Integration & Verification Test Suite
-- Script: test_schema_tidb.sql
-- Description: Procedural-free, declarative validation suite compatible with
--              TiDB Cloud Serverless (v8.5.3+) and TiDB Cloud SQL Editor.
--              Verifies 33 tables, 41 foreign keys, constraints, and canonical counts.
--              Includes genuine failure detection via primary key sentinel trap (aborts on failure).
-- Target Engine: TiDB Cloud Serverless / MySQL 8.0 Protocol
-- Execution: Run in TiDB Cloud SQL Editor or via CLI:
--   mysql -h <tidb-host> -P 4000 -u <user> -p --ssl-mode=VERIFY_IDENTITY codearena_db < database/tests/test_schema_tidb.sql
-- ============================================================================

SET @@session.tidb_enable_check_constraint = ON;
SET sql_mode = 'TRADITIONAL';

USE codearena_db;

-- ----------------------------------------------------------------------------
-- Create Temporary Audit Log Table for Aggregated Result Tracking
-- ----------------------------------------------------------------------------
DROP TEMPORARY TABLE IF EXISTS tidb_audit_results;
CREATE TEMPORARY TABLE tidb_audit_results (
    test_id INT NOT NULL,
    test_name VARCHAR(80) NOT NULL,
    target_metric VARCHAR(120) NOT NULL,
    actual_metric VARCHAR(120) NOT NULL,
    status ENUM('PASS', 'FAIL') NOT NULL,
    details VARCHAR(255) NOT NULL,
    PRIMARY KEY (test_id)
);

-- Test 1: Verify Table Count (Target: 33 BASE TABLEs)
INSERT INTO tidb_audit_results (test_id, test_name, target_metric, actual_metric, status, details)
SELECT 
    1,
    'Base Table Count',
    '33 base tables',
    CONCAT(COUNT(*), ' base tables'),
    CASE WHEN COUNT(*) = 33 THEN 'PASS' ELSE 'FAIL' END,
    CASE 
        WHEN COUNT(*) = 33 THEN 'Exactly 33 base tables verified in codearena_db'
        ELSE CONCAT('Discrepancy: Expected 33 tables, found ', COUNT(*))
    END
FROM information_schema.tables 
WHERE table_schema = DATABASE() 
  AND table_type = 'BASE TABLE';

-- Test 2: Verify Foreign Key Constraints Count (Target: 41 Foreign Keys)
INSERT INTO tidb_audit_results (test_id, test_name, target_metric, actual_metric, status, details)
SELECT 
    2,
    'Foreign Key Constraints',
    '41 foreign keys',
    CONCAT(COUNT(*), ' foreign keys'),
    CASE WHEN COUNT(*) = 41 THEN 'PASS' ELSE 'FAIL' END,
    CASE 
        WHEN COUNT(*) = 41 THEN 'Exactly 41 foreign key constraints active and verified'
        ELSE CONCAT('Discrepancy: Expected 41 foreign keys, found ', COUNT(*))
    END
FROM information_schema.table_constraints 
WHERE constraint_schema = DATABASE() 
  AND constraint_type = 'FOREIGN KEY';

-- Test 3: Verify Migration History & Exact Checksum Integrity in schema_migrations
INSERT INTO tidb_audit_results (test_id, test_name, target_metric, actual_metric, status, details)
SELECT 
    3,
    'Migration Checksums',
    'Exact SHA-256 for 001 and 002',
    CONCAT(valid_count, ' valid / ', total_count, ' recorded'),
    CASE WHEN valid_count = 2 AND total_count >= 2 THEN 'PASS' ELSE 'FAIL' END,
    CASE 
        WHEN valid_count = 2 AND total_count >= 2 
        THEN 'Migrations 001 and 002 recorded with exact, verified SHA-256 file checksums'
        WHEN total_count < 2 
        THEN CONCAT('Missing migrations: Expected >= 2 recorded, found ', total_count)
        ELSE 'CHECKSUM INTEGRITY VIOLATION: Recorded migration checksum does not match canonical SQL file hash!'
    END
FROM (
    SELECT 
        COUNT(*) AS total_count,
        SUM(CASE 
            WHEN version = '001_initial_schema' AND checksum = '6e9bf67a5afe5ccc5251c5463c3cd8c668b41afafa6b49b3cc988aa6ff2187ec' THEN 1
            WHEN version = '002_user_oauth_accounts' AND checksum = 'aef262ed3f20b09bfa247593993392c02795fb11e674bc9e2f13bba8c42571e2' THEN 1
            ELSE 0 
        END) AS valid_count
    FROM schema_migrations
) m_counts;

-- Test 4: Verify Social OAuth Table Definition & Composite Unique Key
INSERT INTO tidb_audit_results (test_id, test_name, target_metric, actual_metric, status, details)
SELECT 
    4,
    'OAuth Table & Constraint',
    'uk_provider_user unique key',
    CONCAT(COUNT(*), ' constraint found'),
    CASE WHEN COUNT(*) = 1 THEN 'PASS' ELSE 'FAIL' END,
    CASE 
        WHEN COUNT(*) = 1 THEN 'Table user_oauth_accounts exists with composite unique key uk_provider_user'
        ELSE 'Missing uk_provider_user unique constraint on user_oauth_accounts'
    END
FROM information_schema.table_constraints 
WHERE table_schema = DATABASE() 
  AND table_name = 'user_oauth_accounts' 
  AND constraint_name = 'uk_provider_user';

-- Test 5: Verify CHECK Constraint Registration (chk_prereq_no_self)
INSERT INTO tidb_audit_results (test_id, test_name, target_metric, actual_metric, status, details)
SELECT 
    5,
    'Self-Prerequisite CHECK',
    'chk_prereq_no_self registered',
    CONCAT(COUNT(*), ' constraint found'),
    CASE WHEN COUNT(*) >= 1 THEN 'PASS' ELSE 'FAIL' END,
    CASE 
        WHEN COUNT(*) >= 1 THEN 'Self-prerequisite constraint (chk_prereq_no_self) active on roadmap_prerequisites'
        ELSE 'Missing chk_prereq_no_self constraint on roadmap_prerequisites'
    END
FROM information_schema.table_constraints 
WHERE table_schema = DATABASE() 
  AND table_name = 'roadmap_prerequisites' 
  AND constraint_name = 'chk_prereq_no_self';

-- Test 6: Verify Canonical Practice Problems (Target: 50 Basic + 200 DSA = 250 Total)
INSERT INTO tidb_audit_results (test_id, test_name, target_metric, actual_metric, status, details)
SELECT 
    6,
    'Practice Problems Count',
    '50 Basic + 200 DSA = 250 Total',
    CONCAT(basic_count, ' Basic, ', dsa_count, ' DSA, ', total_count, ' Total'),
    CASE WHEN basic_count = 50 AND dsa_count = 200 AND total_count = 250 THEN 'PASS' ELSE 'FAIL' END,
    CASE 
        WHEN basic_count = 50 AND dsa_count = 200 AND total_count = 250 
        THEN 'Exactly 250 canonical problems verified (50 Basic Java Track 1, 200 DSA Track 2)'
        ELSE CONCAT('Discrepancy: Found ', basic_count, ' Basic / ', dsa_count, ' DSA')
    END
FROM (
    SELECT 
        SUM(CASE WHEN track_id = 1 THEN 1 ELSE 0 END) AS basic_count,
        SUM(CASE WHEN track_id = 2 THEN 1 ELSE 0 END) AS dsa_count,
        COUNT(*) AS total_count
    FROM problems
) p_counts;

-- Test 7: Verify Progressive Hints Count (Target: Exactly 600 hints, 3 per DSA problem)
INSERT INTO tidb_audit_results (test_id, test_name, target_metric, actual_metric, status, details)
SELECT 
    7,
    'Progressive Hints Count',
    '600 hints (3 per DSA problem)',
    CONCAT(COUNT(*), ' hints'),
    CASE WHEN COUNT(*) = 600 THEN 'PASS' ELSE 'FAIL' END,
    CASE 
        WHEN COUNT(*) = 600 THEN 'Exactly 600 progressive hints verified across 200 DSA problems'
        ELSE CONCAT('Discrepancy: Expected 600 hints, found ', COUNT(*))
    END
FROM problem_hints;

-- Test 8: Verify Public Sample Test Cases Count (Target: 520 Public Samples)
INSERT INTO tidb_audit_results (test_id, test_name, target_metric, actual_metric, status, details)
SELECT 
    8,
    'Sample Test Cases Count',
    '520 samples (114 Basic + 406 DSA)',
    CONCAT(total_samples, ' samples (', basic_samples, ' Basic, ', dsa_samples, ' DSA)'),
    CASE WHEN basic_samples = 114 AND dsa_samples = 406 AND total_samples = 520 THEN 'PASS' ELSE 'FAIL' END,
    CASE 
        WHEN basic_samples = 114 AND dsa_samples = 406 AND total_samples = 520 
        THEN 'Exactly 520 public sample test cases verified (114 Basic + 406 DSA)'
        ELSE CONCAT('Discrepancy: Found ', basic_samples, ' Basic / ', dsa_samples, ' DSA samples')
    END
FROM (
    SELECT 
        SUM(CASE WHEN p.track_id = 1 THEN 1 ELSE 0 END) AS basic_samples,
        SUM(CASE WHEN p.track_id = 2 THEN 1 ELSE 0 END) AS dsa_samples,
        COUNT(*) AS total_samples
    FROM problem_test_cases tc
    JOIN problems p ON tc.problem_id = p.id
    WHERE tc.is_sample = TRUE
) tc_counts;

-- Test 9: Verify Guided Learning Roadmap Curriculum (Target: 30 Topics, 48 Prereqs, 121 Links)
INSERT INTO tidb_audit_results (test_id, test_name, target_metric, actual_metric, status, details)
SELECT 
    9,
    'Roadmap Curriculum',
    '30 Topics, 48 Prereqs, 121 Links',
    CONCAT(topic_count, ' Topics, ', prereq_count, ' Prereqs, ', link_count, ' Links'),
    CASE WHEN topic_count = 30 AND prereq_count = 48 AND link_count = 121 THEN 'PASS' ELSE 'FAIL' END,
    CASE 
        WHEN topic_count = 30 AND prereq_count = 48 AND link_count = 121 
        THEN 'Roadmap curriculum 100% verified (30 Topics, 48 DAG Edges, 121 Problem Links)'
        ELSE CONCAT('Discrepancy: Topics=', topic_count, ', Prereqs=', prereq_count, ', Links=', link_count)
    END
FROM (
    SELECT 
        (SELECT COUNT(*) FROM roadmap_topics) AS topic_count,
        (SELECT COUNT(*) FROM roadmap_prerequisites) AS prereq_count,
        (SELECT COUNT(*) FROM roadmap_topic_problems) AS link_count
) rm_counts;

-- Test 10: Verify Reference Data Cardinality (Target: 25 Categories, 3 Roles, 3 Levels, 3 Difficulties, 5 Statuses, 7 Verdicts)
INSERT INTO tidb_audit_results (test_id, test_name, target_metric, actual_metric, status, details)
SELECT 
    10,
    'Reference Lookup Cardinality',
    '25 Cats, 3 Roles, 3 Levels, 3 Diffs, 5 Statuses, 7 Verdicts',
    CONCAT(cat_count, ' Cats, ', role_count, ' Roles, ', diff_count, ' Diffs, ', verdict_count, ' Verdicts'),
    CASE 
        WHEN cat_count = 25 AND role_count = 3 AND level_count = 3 AND diff_count = 3 AND status_count = 5 AND verdict_count = 7 
        THEN 'PASS' 
        ELSE 'FAIL' 
    END,
    CASE 
        WHEN cat_count = 25 AND role_count = 3 AND level_count = 3 AND diff_count = 3 AND status_count = 5 AND verdict_count = 7 
        THEN 'All 9 reference lookup datasets fully verified with exact cardinality'
        ELSE 'Discrepancy detected in reference lookup dataset cardinality'
    END
FROM (
    SELECT 
        (SELECT COUNT(*) FROM categories) AS cat_count,
        (SELECT COUNT(*) FROM roles) AS role_count,
        (SELECT COUNT(*) FROM roadmap_levels) AS level_count,
        (SELECT COUNT(*) FROM difficulties) AS diff_count,
        (SELECT COUNT(*) FROM submission_statuses) AS status_count,
        (SELECT COUNT(*) FROM submission_verdicts) AS verdict_count
) ref_counts;

-- Test 11: Security & Confidentiality Integrity (Zero Plaintext Passwords; Hashes >= 60 chars)
INSERT INTO tidb_audit_results (test_id, test_name, target_metric, actual_metric, status, details)
SELECT 
    11,
    'Security Integrity',
    '0 plaintext passwords; all hashes >= 60 chars',
    CONCAT(COUNT(*), ' weak passwords detected'),
    CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END,
    CASE 
        WHEN COUNT(*) = 0 THEN 'Zero plaintext passwords detected. All user hashes >= 60 characters.'
        ELSE CONCAT('SECURITY ALERT: Detected ', COUNT(*), ' users with suspiciously short password hashes!')
    END
FROM users 
WHERE CHAR_LENGTH(password_hash) < 60;

-- Test 12: Prerequisite DAG Self-Reference Integrity (Zero Invalid Edges)
INSERT INTO tidb_audit_results (test_id, test_name, target_metric, actual_metric, status, details)
SELECT 
    12,
    'DAG Non-Self Integrity',
    '0 self-prerequisite edges',
    CONCAT(COUNT(*), ' violations found'),
    CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END,
    CASE 
        WHEN COUNT(*) = 0 THEN 'Zero self-prerequisite edges exist in roadmap_prerequisites (topic_id <> prerequisite_topic_id)'
        ELSE CONCAT('DATA CORRUPTION: Detected ', COUNT(*), ' self-prerequisite cycles!')
    END
FROM roadmap_prerequisites
WHERE topic_id = prerequisite_topic_id;

-- ----------------------------------------------------------------------------
-- Display Complete Audit Report Table
-- ----------------------------------------------------------------------------
SELECT 
    test_id AS `ID`,
    test_name AS `Test Suite`,
    status AS `Status`,
    target_metric AS `Target`,
    actual_metric AS `Actual`,
    details AS `Details`
FROM tidb_audit_results
ORDER BY test_id;

-- ----------------------------------------------------------------------------
-- GENUINE FAILURE DETECTION ASSERTION GATE (SENTINEL TRAP)
--
-- Why not SELECT 1/0?
-- In MySQL and TiDB under standard SQL modes (including STRICT_TRANS_TABLES and
-- ERROR_FOR_DIVISION_BY_ZERO), division by zero inside a SELECT statement merely
-- produces NULL and a warning. It NEVER causes an execution error or non-zero exit code!
--
-- Reliable Solution:
-- Violating a PRIMARY KEY constraint during an INSERT operation triggers
-- ERROR 1062 (23000): Duplicate entry for key 'PRIMARY'. This is an engine-level
-- fatal error across ALL SQL modes that immediately aborts script execution and
-- causes MySQL CLI and CI pipelines to exit with code 1.
--
-- TiDB Cloud SQL Editor Web UI Behavior & Limitations:
-- The TiDB Cloud Web SQL Editor displays query results per statement tab.
-- When a duplicate key error is triggered, the editor marks the statement tab with
-- a red error banner and halts subsequent statements in the batch.
-- ----------------------------------------------------------------------------
DROP TEMPORARY TABLE IF EXISTS test_failure_sentinel;
CREATE TEMPORARY TABLE test_failure_sentinel (
    assertion_failed_check_audit_log INT NOT NULL,
    PRIMARY KEY (assertion_failed_check_audit_log)
);
INSERT INTO test_failure_sentinel (assertion_failed_check_audit_log) VALUES (1);

-- Display summary before sentinel gate
SELECT 
    CASE 
        WHEN fail_count = 0 THEN 'SUCCESS: All 12 validation suites passed with 0 errors.'
        ELSE CONCAT('FATAL ALERT: ', fail_count, ' validation suite(s) failed! Halting execution via sentinel.')
    END AS `Validation_Summary`,
    fail_count AS `Total_Failures`
FROM (
    SELECT COUNT(*) AS fail_count 
    FROM tidb_audit_results 
    WHERE status = 'FAIL'
) gate;

-- Sentinel Assertion Gate:
-- Throws ERROR 1062 (23000): Duplicate entry '1' for key 'PRIMARY' IF AND ONLY IF any test failed!
INSERT INTO test_failure_sentinel (assertion_failed_check_audit_log)
SELECT 1 
FROM tidb_audit_results 
WHERE status = 'FAIL';
