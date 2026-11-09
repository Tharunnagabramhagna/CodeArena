-- ============================================================================
-- CodeArena Contest System Domain (Future Ready)
-- Script: 07_contests.sql
-- Description: Competitive programming contests, problem sets with letter
--              designations (A, B, C, D), user registrations, and score metrics.
-- Target Engine: MySQL 8.0+ / InnoDB
-- ============================================================================

USE codearena_db;

-- ----------------------------------------------------------------------------
-- Table: contests
-- Description: Competitive programming events with scheduling and status tracking.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contests (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE COMMENT 'URL slug for contest lobby: weekly-challenge-42',
    title VARCHAR(200) NOT NULL COMMENT 'Display title: CodeArena Weekly Contest #42',
    description TEXT NULL COMMENT 'Rules, prize pool, or topic focus',
    start_time DATETIME NOT NULL COMMENT 'Contest commencement timestamp (UTC)',
    end_time DATETIME NOT NULL COMMENT 'Contest conclusion timestamp (UTC)',
    status ENUM('UPCOMING', 'ACTIVE', 'ENDED', 'CANCELLED') NOT NULL DEFAULT 'UPCOMING',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_contests_time (start_time, end_time, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Competitive coding tournaments';

-- ----------------------------------------------------------------------------
-- Table: contest_problems
-- Description: Maps catalog problems into contests with problem letters (A, B, C)
--              and point weightings.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contest_problems (
    contest_id BIGINT UNSIGNED NOT NULL,
    problem_id BIGINT UNSIGNED NOT NULL,
    letter_code VARCHAR(8) NOT NULL COMMENT 'Problem code within contest: A, B, C, D',
    score_weight INT UNSIGNED NOT NULL DEFAULT 100 COMMENT 'Max points awarded for accepted verdict',
    PRIMARY KEY (contest_id, problem_id),

    CONSTRAINT fk_cp_contest 
        FOREIGN KEY (contest_id) REFERENCES contests (id) 
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_cp_problem 
        FOREIGN KEY (problem_id) REFERENCES problems (id) 
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT uk_contest_letter 
        UNIQUE (contest_id, letter_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Contest problem set mappings';

-- ----------------------------------------------------------------------------
-- Table: contest_registrations
-- Description: User entries and registration timestamps for upcoming contests.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contest_registrations (
    contest_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    registered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (contest_id, user_id),

    CONSTRAINT fk_cr_contest 
        FOREIGN KEY (contest_id) REFERENCES contests (id) 
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_cr_user 
        FOREIGN KEY (user_id) REFERENCES users (id) 
        ON DELETE CASCADE ON UPDATE CASCADE,

    INDEX idx_cr_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Contest participant registrations';

-- ----------------------------------------------------------------------------
-- Table: contest_submissions
-- Description: Extends standard submissions with contest-specific scoring and penalty minutes.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contest_submissions (
    submission_id BIGINT UNSIGNED NOT NULL PRIMARY KEY COMMENT 'Foreign key to submissions table',
    contest_id BIGINT UNSIGNED NOT NULL COMMENT 'Parent contest',
    points_awarded INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Score points granted based on verdict',
    penalty_seconds INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Time penalty for wrong submissions (standard ICPC rules)',

    CONSTRAINT fk_cs_submission 
        FOREIGN KEY (submission_id) REFERENCES submissions (id) 
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_cs_contest 
        FOREIGN KEY (contest_id) REFERENCES contests (id) 
        ON DELETE CASCADE ON UPDATE CASCADE,

    INDEX idx_cs_contest_points (contest_id, points_awarded)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Contest-specific submission score records';

