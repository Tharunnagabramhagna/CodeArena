-- ============================================================================
-- CodeArena TiDB Cloud Deployment: Batch 02 of 06
-- Domain: Problem Management & Catalog
-- Target Engine: TiDB Cloud Serverless (v8.5.3+) / MySQL 8.0 Protocol
-- Database: codearena_db
-- Batch Tables: 9 (tracks, categories, difficulties, languages, problems,
--                  problem_hints, problem_test_cases, problem_tags, problem_tag_mappings)
-- Cumulative Tables: 14 / 32
-- Prerequisites: Batch 01 (01_core_user_management.sql)
-- ============================================================================

-- Session configuration for TiDB Cloud Serverless
SET foreign_key_checks = 1;
SET sql_mode = 'TRADITIONAL';
SET NAMES utf8mb4;

USE codearena_db;

-- ----------------------------------------------------------------------------
-- 1. Tracks Lookup
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

-- ----------------------------------------------------------------------------
-- 2. Problem Categories
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- 3. Difficulties Lookup
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS difficulties (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    level_rank TINYINT UNSIGNED NOT NULL UNIQUE,
    color_hex VARCHAR(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- 4. Programming Languages Lookup
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS languages (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(32) NOT NULL UNIQUE,
    name VARCHAR(64) NOT NULL,
    version VARCHAR(32) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    compiler_flags VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- 5. Problems Master Table
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- 6. Problem Hints
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- 7. Problem Test Cases
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- 8. Problem Tags
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS problem_tags (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64) NOT NULL UNIQUE,
    slug VARCHAR(64) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- 9. Problem Tag Mappings (Many-to-Many)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS problem_tag_mappings (
    problem_id BIGINT UNSIGNED NOT NULL,
    tag_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (problem_id, tag_id),

    CONSTRAINT fk_ptm_problem FOREIGN KEY (problem_id) REFERENCES problems (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ptm_tag FOREIGN KEY (tag_id) REFERENCES problem_tags (id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_ptm_tag (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Verification Query for Batch 02
-- Confirms the 9 tables are registered as BASE TABLEs and reports count
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
  AND table_name IN ('tracks', 'categories', 'difficulties', 'languages', 'problems',
                     'problem_hints', 'problem_test_cases', 'problem_tags', 'problem_tag_mappings')
ORDER BY table_name ASC;
