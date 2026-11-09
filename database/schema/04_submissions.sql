-- ============================================================================
-- CodeArena Submissions Domain
-- Script: 04_submissions.sql
-- Description: Records code submissions, compilation/runtime verdicts, resource
--              utilization, and granular test-case results.
-- Architectural Note:
--              The is_preview column explicitly distinguishes client-side preview
--              test runs from genuine backend OpenJDK judge executions.
-- Target Engine: MySQL 8.0+ / InnoDB
-- ============================================================================

USE codearena_db;

-- ----------------------------------------------------------------------------
-- Table: submission_statuses
-- Description: State of the submission in the execution pipeline.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS submission_statuses (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE COMMENT 'QUEUED, COMPILING, RUNNING, COMPLETED, SYSTEM_ERROR',
    description VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Submission pipeline lifecycle states';

-- ----------------------------------------------------------------------------
-- Table: submission_verdicts
-- Description: Final grading verdict assigned to a submission.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS submission_verdicts (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE COMMENT 'ACCEPTED, WRONG_ANSWER, TIME_LIMIT_EXCEEDED, MEMORY_LIMIT_EXCEEDED, COMPILATION_ERROR, RUNTIME_ERROR, PENDING',
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) NULL,
    is_success BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'TRUE if submission meets all acceptance criteria'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Grading verdicts lookup';

-- ----------------------------------------------------------------------------
-- Table: submissions
-- Description: User code submissions with verification metadata and judge outputs.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS submissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    submission_uid VARCHAR(64) NOT NULL UNIQUE COMMENT 'Public UUID / NanoID reference for REST APIs',
    user_id BIGINT UNSIGNED NOT NULL COMMENT 'Author of the submission',
    problem_id BIGINT UNSIGNED NOT NULL COMMENT 'Target problem',
    language_id INT UNSIGNED NOT NULL COMMENT 'Language environment used',
    status_id INT UNSIGNED NOT NULL COMMENT 'Pipeline execution state',
    verdict_id INT UNSIGNED NOT NULL COMMENT 'Grading verdict',
    source_code MEDIUMTEXT NOT NULL COMMENT 'Submitted program source code',
    is_preview BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'CRITICAL: Distinguishes client-side preview runs from genuine remote judge executions',
    execution_time_ms INT UNSIGNED NULL COMMENT 'Peak execution time across test cases in milliseconds',
    memory_used_kb INT UNSIGNED NULL COMMENT 'Peak resident memory footprint in kilobytes',
    test_cases_passed INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Count of passed test cases',
    test_cases_total INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Total count of test cases evaluated',
    compiler_output MEDIUMTEXT NULL COMMENT 'Compiler diagnostic output or error messages',
    runtime_error_log TEXT NULL COMMENT 'Stack traces or exception logs during execution',
    submitted_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT 'Submission timestamp with millisecond precision',
    judged_at DATETIME(3) NULL COMMENT 'Timestamp when judging completed',

    CONSTRAINT fk_submissions_user 
        FOREIGN KEY (user_id) REFERENCES users (id) 
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_submissions_problem 
        FOREIGN KEY (problem_id) REFERENCES problems (id) 
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT fk_submissions_language 
        FOREIGN KEY (language_id) REFERENCES languages (id) 
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT fk_submissions_status 
        FOREIGN KEY (status_id) REFERENCES submission_statuses (id) 
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT fk_submissions_verdict 
        FOREIGN KEY (verdict_id) REFERENCES submission_verdicts (id) 
        ON DELETE RESTRICT ON UPDATE CASCADE,

    INDEX idx_sub_user_problem (user_id, problem_id),
    INDEX idx_sub_problem_verdict (problem_id, verdict_id),
    INDEX idx_sub_submitted_at (submitted_at),
    INDEX idx_sub_preview (is_preview)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='User code submissions and judge records';

-- ----------------------------------------------------------------------------
-- Table: submission_test_case_results
-- Description: Detailed per-test-case execution breakdown for fine-grained debugging.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS submission_test_case_results (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    submission_id BIGINT UNSIGNED NOT NULL COMMENT 'Parent submission record',
    test_case_id BIGINT UNSIGNED NOT NULL COMMENT 'Evaluated test case',
    verdict_id INT UNSIGNED NOT NULL COMMENT 'Per-case verdict',
    execution_time_ms INT UNSIGNED NULL COMMENT 'Duration for this test case',
    memory_used_kb INT UNSIGNED NULL COMMENT 'Memory used for this test case',
    actual_output MEDIUMTEXT NULL COMMENT 'Actual standard output produced by the program',
    error_message TEXT NULL COMMENT 'Per-case error message if failed',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_stcr_submission 
        FOREIGN KEY (submission_id) REFERENCES submissions (id) 
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_stcr_testcase 
        FOREIGN KEY (test_case_id) REFERENCES problem_test_cases (id) 
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT fk_stcr_verdict 
        FOREIGN KEY (verdict_id) REFERENCES submission_verdicts (id) 
        ON DELETE RESTRICT ON UPDATE CASCADE,

    INDEX idx_stcr_submission (submission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Per-test-case execution breakdown';

