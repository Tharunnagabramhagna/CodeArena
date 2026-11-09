-- ============================================================================
-- CodeArena TiDB Cloud Deployment: Batch 03 of 06
-- Domain: Submission & Execution Pipeline
-- Target Engine: TiDB Cloud Serverless (v8.5.3+) / MySQL 8.0 Protocol
-- Database: codearena_db
-- Batch Tables: 4 (submission_statuses, submission_verdicts, submissions,
--                  submission_test_case_results)
-- Cumulative Tables: 18 / 32
-- Prerequisites: Batch 01 (users), Batch 02 (problems, languages, problem_test_cases)
-- ============================================================================

-- Session configuration for TiDB Cloud Serverless
SET foreign_key_checks = 1;
SET sql_mode = 'TRADITIONAL';
SET NAMES utf8mb4;

USE codearena_db;

-- ----------------------------------------------------------------------------
-- 1. Submission Statuses Lookup
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS submission_statuses (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- 2. Submission Verdicts Lookup
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS submission_verdicts (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) NULL,
    is_success BOOLEAN NOT NULL DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- 3. Submissions Master Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS submissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    submission_uid VARCHAR(64) NOT NULL UNIQUE,
    user_id BIGINT UNSIGNED NOT NULL,
    problem_id BIGINT UNSIGNED NOT NULL,
    language_id INT UNSIGNED NOT NULL,
    status_id INT UNSIGNED NOT NULL,
    verdict_id INT UNSIGNED NOT NULL,
    source_code MEDIUMTEXT NOT NULL,
    is_preview BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Distinguishes client-side preview execution from genuine remote judge executions',
    execution_time_ms INT UNSIGNED NULL,
    memory_used_kb INT UNSIGNED NULL,
    test_cases_passed INT UNSIGNED NOT NULL DEFAULT 0,
    test_cases_total INT UNSIGNED NOT NULL DEFAULT 0,
    compiler_output MEDIUMTEXT NULL,
    runtime_error_log TEXT NULL,
    submitted_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    judged_at DATETIME(3) NULL,

    CONSTRAINT fk_submissions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_submissions_problem FOREIGN KEY (problem_id) REFERENCES problems (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_submissions_language FOREIGN KEY (language_id) REFERENCES languages (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_submissions_status FOREIGN KEY (status_id) REFERENCES submission_statuses (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_submissions_verdict FOREIGN KEY (verdict_id) REFERENCES submission_verdicts (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_sub_user_problem (user_id, problem_id),
    INDEX idx_sub_problem_verdict (problem_id, verdict_id),
    INDEX idx_sub_submitted_at (submitted_at),
    INDEX idx_sub_preview (is_preview)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- 4. Submission Test Case Results
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS submission_test_case_results (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    submission_id BIGINT UNSIGNED NOT NULL,
    test_case_id BIGINT UNSIGNED NOT NULL,
    verdict_id INT UNSIGNED NOT NULL,
    execution_time_ms INT UNSIGNED NULL,
    memory_used_kb INT UNSIGNED NULL,
    actual_output MEDIUMTEXT NULL,
    error_message TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_stcr_submission FOREIGN KEY (submission_id) REFERENCES submissions (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_stcr_testcase FOREIGN KEY (test_case_id) REFERENCES problem_test_cases (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_stcr_verdict FOREIGN KEY (verdict_id) REFERENCES submission_verdicts (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_stcr_submission (submission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Verification Query for Batch 03
-- Confirms the 4 tables are registered as BASE TABLEs and reports count
-- ----------------------------------------------------------------------------
SELECT 
    table_name,
    table_type,
    engine,
    table_collation,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'codearena_db' AND table_type = 'BASE TABLE') AS cumulative_base_tables_in_db
FROM information_schema.tables 
WHERE table_schema = 'codearena_db'
  AND table_type = 'BASE TABLE'
  AND table_name IN ('submission_statuses', 'submission_verdicts', 'submissions', 'submission_test_case_results')
ORDER BY table_name ASC;
