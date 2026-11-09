-- ============================================================================
-- CodeArena TiDB Cloud Migration: 001_initial_schema_tidb.sql
-- Version: 001_initial_schema
-- Target Engine: TiDB Cloud Serverless (v8.5.3+) / MySQL 8.0 Protocol
-- Description: Complete initial schema deployment for TiDB Cloud.
--              Includes session activation for TiDB CHECK constraint enforcement.
-- ============================================================================

-- Activate TiDB CHECK constraint enforcement (disabled by default in TiDB v8.5)
SET @@session.tidb_enable_check_constraint = ON;
SET foreign_key_checks = 1;
SET sql_mode = 'TRADITIONAL';
SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS codearena_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE codearena_db;

CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    applied_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    checksum VARCHAR(64) NOT NULL,
    execution_time_ms INT UNSIGNED NOT NULL,
    PRIMARY KEY (version)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='System migration history log';

-- ----------------------------------------------------------------------------
-- 1. User Management Domain
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS account_statuses (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL COMMENT 'BCrypt/Argon2id cryptographic hash. Never plaintext.',
    role_id INT UNSIGNED NOT NULL DEFAULT 1,
    status_id INT UNSIGNED NOT NULL DEFAULT 1,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at DATETIME NULL,

    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_users_status FOREIGN KEY (status_id) REFERENCES account_statuses (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_users_role (role_id),
    INDEX idx_users_status (status_id),
    INDEX idx_users_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS user_profiles (
    user_id BIGINT UNSIGNED NOT NULL PRIMARY KEY,
    full_name VARCHAR(100) NULL,
    avatar_url VARCHAR(512) NULL,
    bio TEXT NULL,
    github_username VARCHAR(100) NULL,
    linkedin_url VARCHAR(255) NULL,
    preferred_track ENUM('basic', 'dsa') NOT NULL DEFAULT 'basic',
    reputation_points INT UNSIGNED NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_profiles_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- 2. Problem Management Domain
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tracks (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(32) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT UNSIGNED NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    track_id INT UNSIGNED NOT NULL,
    slug VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    icon_name VARCHAR(50) NOT NULL DEFAULT 'terminal',
    accent_color VARCHAR(30) NULL,
    display_order INT UNSIGNED NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_categories_track FOREIGN KEY (track_id) REFERENCES tracks (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_categories_track (track_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS difficulties (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    level_rank TINYINT UNSIGNED NOT NULL UNIQUE,
    color_hex VARCHAR(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS languages (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(32) NOT NULL UNIQUE,
    name VARCHAR(64) NOT NULL,
    version VARCHAR(32) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    compiler_flags VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS problems (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    track_id INT UNSIGNED NOT NULL,
    category_id INT UNSIGNED NOT NULL,
    difficulty_id INT UNSIGNED NOT NULL,
    canonical_id VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    problem_number INT UNSIGNED NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description MEDIUMTEXT NOT NULL,
    input_format TEXT NULL,
    output_format TEXT NULL,
    constraints TEXT NULL,
    explanation TEXT NULL,
    starter_code MEDIUMTEXT NULL,
    is_premium BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    time_limit_ms INT UNSIGNED NOT NULL DEFAULT 2000,
    memory_limit_mb INT UNSIGNED NOT NULL DEFAULT 256,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_problems_track FOREIGN KEY (track_id) REFERENCES tracks (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_problems_category FOREIGN KEY (category_id) REFERENCES categories (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_problems_difficulty FOREIGN KEY (difficulty_id) REFERENCES difficulties (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_problems_track_diff (track_id, difficulty_id),
    INDEX idx_problems_category (category_id),
    INDEX idx_problems_number (problem_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS problem_hints (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    problem_id BIGINT UNSIGNED NOT NULL,
    hint_level TINYINT UNSIGNED NOT NULL,
    hint_text TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_hints_problem FOREIGN KEY (problem_id) REFERENCES problems (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uk_problem_hint_level UNIQUE (problem_id, hint_level),
    INDEX idx_hints_problem (problem_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS problem_test_cases (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    problem_id BIGINT UNSIGNED NOT NULL,
    is_sample BOOLEAN NOT NULL DEFAULT FALSE,
    input_data MEDIUMTEXT NOT NULL,
    expected_output MEDIUMTEXT NOT NULL,
    explanation TEXT NULL,
    display_order INT UNSIGNED NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_testcases_problem FOREIGN KEY (problem_id) REFERENCES problems (id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_testcases_problem_sample (problem_id, is_sample)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS problem_tags (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64) NOT NULL UNIQUE,
    slug VARCHAR(64) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS problem_tag_mappings (
    problem_id BIGINT UNSIGNED NOT NULL,
    tag_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (problem_id, tag_id),

    CONSTRAINT fk_ptm_problem FOREIGN KEY (problem_id) REFERENCES problems (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ptm_tag FOREIGN KEY (tag_id) REFERENCES problem_tags (id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_ptm_tag (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- 3. Submissions Domain
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS submission_statuses (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS submission_verdicts (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) NULL,
    is_success BOOLEAN NOT NULL DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
-- 4. Learning & Roadmap Domain
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roadmap_levels (
    id INT UNSIGNED NOT NULL PRIMARY KEY,
    slug VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(100) NOT NULL,
    badge VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    display_order INT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS roadmap_topics (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(64) NOT NULL UNIQUE,
    level_id INT UNSIGNED NOT NULL,
    sequence_order INT UNSIGNED NOT NULL,
    title VARCHAR(150) NOT NULL,
    estimated_hours DECIMAL(4,1) NOT NULL DEFAULT 2.0,
    summary TEXT NOT NULL,
    core_concepts JSON NULL,
    code_example MEDIUMTEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_topics_level FOREIGN KEY (level_id) REFERENCES roadmap_levels (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_topics_level_seq (level_id, sequence_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS roadmap_prerequisites (
    topic_id BIGINT UNSIGNED NOT NULL,
    prerequisite_topic_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (topic_id, prerequisite_topic_id),

    CONSTRAINT fk_prereq_topic FOREIGN KEY (topic_id) REFERENCES roadmap_topics (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_prereq_required FOREIGN KEY (prerequisite_topic_id) REFERENCES roadmap_topics (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT chk_prereq_no_self CHECK (topic_id <> prerequisite_topic_id),
    INDEX idx_prereq_required (prerequisite_topic_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS roadmap_topic_problems (
    topic_id BIGINT UNSIGNED NOT NULL,
    problem_id BIGINT UNSIGNED NOT NULL,
    sequence_order INT UNSIGNED NOT NULL DEFAULT 1,
    PRIMARY KEY (topic_id, problem_id),

    CONSTRAINT fk_rtp_topic FOREIGN KEY (topic_id) REFERENCES roadmap_topics (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_rtp_problem FOREIGN KEY (problem_id) REFERENCES problems (id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_rtp_problem (problem_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS user_topic_progress (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    topic_id BIGINT UNSIGNED NOT NULL,
    status ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'NOT_STARTED',
    started_at DATETIME NULL,
    completed_at DATETIME NULL,
    last_accessed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_utp_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_utp_topic FOREIGN KEY (topic_id) REFERENCES roadmap_topics (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uk_user_topic UNIQUE (user_id, topic_id),
    INDEX idx_utp_user_status (user_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- 5. User Activity Domain
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_bookmarks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    problem_id BIGINT UNSIGNED NOT NULL,
    notes VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_bookmarks_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_bookmarks_problem FOREIGN KEY (problem_id) REFERENCES problems (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uk_user_problem_bookmark UNIQUE (user_id, problem_id),
    INDEX idx_bookmarks_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS user_preferences (
    user_id BIGINT UNSIGNED NOT NULL PRIMARY KEY,
    theme ENUM('dark', 'light', 'system') NOT NULL DEFAULT 'dark',
    editor_font_size TINYINT UNSIGNED NOT NULL DEFAULT 14,
    editor_tab_size TINYINT UNSIGNED NOT NULL DEFAULT 4,
    editor_keymap VARCHAR(20) NOT NULL DEFAULT 'default',
    auto_close_brackets BOOLEAN NOT NULL DEFAULT TRUE,
    reduced_motion BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_preferences_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS user_recently_viewed (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    problem_id BIGINT UNSIGNED NOT NULL,
    viewed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_recent_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_recent_problem FOREIGN KEY (problem_id) REFERENCES problems (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uk_user_recent_problem UNIQUE (user_id, problem_id),
    INDEX idx_recent_user_viewed (user_id, viewed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- 6. Contests Domain
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contests (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status ENUM('UPCOMING', 'ACTIVE', 'ENDED', 'CANCELLED') NOT NULL DEFAULT 'UPCOMING',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_contests_time (start_time, end_time, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS contest_problems (
    contest_id BIGINT UNSIGNED NOT NULL,
    problem_id BIGINT UNSIGNED NOT NULL,
    letter_code VARCHAR(8) NOT NULL,
    score_weight INT UNSIGNED NOT NULL DEFAULT 100,
    PRIMARY KEY (contest_id, problem_id),

    CONSTRAINT fk_cp_contest FOREIGN KEY (contest_id) REFERENCES contests (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_cp_problem FOREIGN KEY (problem_id) REFERENCES problems (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT uk_contest_letter UNIQUE (contest_id, letter_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS contest_registrations (
    contest_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    registered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (contest_id, user_id),

    CONSTRAINT fk_cr_contest FOREIGN KEY (contest_id) REFERENCES contests (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_cr_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_cr_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS contest_submissions (
    submission_id BIGINT UNSIGNED NOT NULL PRIMARY KEY,
    contest_id BIGINT UNSIGNED NOT NULL,
    points_awarded INT UNSIGNED NOT NULL DEFAULT 0,
    penalty_seconds INT UNSIGNED NOT NULL DEFAULT 0,

    CONSTRAINT fk_cs_submission FOREIGN KEY (submission_id) REFERENCES submissions (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_cs_contest FOREIGN KEY (contest_id) REFERENCES contests (id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_cs_contest_points (contest_id, points_awarded)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- 7. AI Assistant Domain
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_conversations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    conversation_uid VARCHAR(64) NOT NULL UNIQUE,
    user_id BIGINT UNSIGNED NOT NULL,
    problem_id BIGINT UNSIGNED NULL,
    title VARCHAR(200) NOT NULL DEFAULT 'Coding Session',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_ai_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ai_problem FOREIGN KEY (problem_id) REFERENCES problems (id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_ai_user_created (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS ai_messages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    conversation_id BIGINT UNSIGNED NOT NULL,
    sender_role ENUM('user', 'assistant', 'system') NOT NULL,
    content MEDIUMTEXT NOT NULL,
    prompt_tokens INT UNSIGNED NOT NULL DEFAULT 0,
    completion_tokens INT UNSIGNED NOT NULL DEFAULT 0,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    CONSTRAINT fk_aimsg_conv FOREIGN KEY (conversation_id) REFERENCES ai_conversations (id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_aimsg_conv_created (conversation_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Migration Tracking:
-- Migration execution, SHA-256 file content checksum calculation, and tracking
-- record registration into `schema_migrations` are managed by the CodeArena migration runner.
-- ----------------------------------------------------------------------------

-- ----------------------------------------------------------------------------
-- End of Migration 001_initial_schema_tidb.sql
-- ----------------------------------------------------------------------------
SELECT 'Migration 001_initial_schema_tidb applied successfully (32 core tables active)' AS status;

