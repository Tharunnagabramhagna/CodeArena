-- ============================================================================
-- CodeArena TiDB Cloud Deployment: Batch 05 of 06
-- Domain: User Activity, Bookmarks & Contests
-- Target Engine: TiDB Cloud Serverless (v8.5.3+) / MySQL 8.0 Protocol
-- Database: codearena_db
-- Batch Tables: 7 (user_bookmarks, user_preferences, user_recently_viewed,
--                  contests, contest_problems, contest_registrations, contest_submissions)
-- Cumulative Tables: 30 / 32
-- Prerequisites: Batch 01 (users), Batch 02 (problems), Batch 03 (submissions)
-- ============================================================================

-- Session configuration for TiDB Cloud Serverless
SET foreign_key_checks = 1;
SET sql_mode = 'TRADITIONAL';
SET NAMES utf8mb4;

USE codearena_db;

-- ----------------------------------------------------------------------------
-- 1. User Bookmarks
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

-- ----------------------------------------------------------------------------
-- 2. User Preferences
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- 3. User Recently Viewed Problems
-- ----------------------------------------------------------------------------
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
-- 4. Contests Master Table
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

-- ----------------------------------------------------------------------------
-- 5. Contest Problems
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- 6. Contest Registrations
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contest_registrations (
    contest_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    registered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (contest_id, user_id),

    CONSTRAINT fk_cr_contest FOREIGN KEY (contest_id) REFERENCES contests (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_cr_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_cr_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- 7. Contest Submissions
-- ----------------------------------------------------------------------------
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
-- Verification Query for Batch 05
-- Confirms the 7 tables are registered as BASE TABLEs and reports count
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
  AND table_name IN ('user_bookmarks', 'user_preferences', 'user_recently_viewed',
                     'contests', 'contest_problems', 'contest_registrations', 'contest_submissions')
ORDER BY table_name ASC;
