-- ============================================================================
-- CodeArena Problem Management Domain
-- Script: 03_problems.sql
-- Description: Unified catalog schema supporting both Basic Java challenges (50)
--              and DSA problem sets (200), categories, difficulties, test cases,
--              progressive hints, tags, and runtime constraints.
-- Target Engine: MySQL 8.0+ / InnoDB
-- ============================================================================

USE codearena_db;

-- ----------------------------------------------------------------------------
-- Table: tracks
-- Description: Primary educational paths (e.g. 'basic' and 'dsa').
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tracks (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(32) NOT NULL UNIQUE COMMENT 'Track identifier slug: basic, dsa',
    name VARCHAR(100) NOT NULL COMMENT 'Display name: Basic Java Programming, Data Structures & Algorithms',
    description TEXT NULL COMMENT 'Overview of pedagogical focus',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Active flag for visibility in track selector',
    display_order INT UNSIGNED NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Curriculum tracks';

-- ----------------------------------------------------------------------------
-- Table: categories
-- Description: Topic groups within tracks (e.g. Loops, Arrays, Linked Lists, Trees).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    track_id INT UNSIGNED NOT NULL COMMENT 'Belongs to track',
    slug VARCHAR(64) NOT NULL UNIQUE COMMENT 'Unique category slug, e.g. loops, arrays, linked-lists',
    name VARCHAR(100) NOT NULL COMMENT 'Category title, e.g. Loops, Arrays',
    description TEXT NULL COMMENT 'Curriculum coverage details',
    icon_name VARCHAR(50) NOT NULL DEFAULT 'terminal' COMMENT 'Lucide icon identifier name',
    accent_color VARCHAR(30) NULL COMMENT 'Hex or CSS variable color token',
    display_order INT UNSIGNED NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_categories_track 
        FOREIGN KEY (track_id) REFERENCES tracks (id) 
        ON UPDATE CASCADE ON DELETE RESTRICT,

    INDEX idx_categories_track (track_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Problem classification categories';

-- ----------------------------------------------------------------------------
-- Table: difficulties
-- Description: Standardized difficulty levels (Easy, Medium, Hard).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS difficulties (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE COMMENT 'Name: Easy, Medium, Hard',
    level_rank TINYINT UNSIGNED NOT NULL UNIQUE COMMENT 'Ordinal value: 1=Easy, 2=Medium, 3=Hard',
    color_hex VARCHAR(20) NOT NULL COMMENT 'Theme color code, e.g. #10B981, #F59E0B, #EF4444'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Standard difficulty classifications';

-- ----------------------------------------------------------------------------
-- Table: languages
-- Description: Supported programming execution targets (Java 17 OpenJDK preview, etc.).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS languages (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(32) NOT NULL UNIQUE COMMENT 'Short language identifier: java, python, cpp',
    name VARCHAR(64) NOT NULL COMMENT 'Display label: Java 17 (OpenJDK)',
    version VARCHAR(32) NOT NULL COMMENT 'Runtime environment version, e.g. 17.0.9',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    compiler_flags VARCHAR(255) NULL COMMENT 'CLI arguments for execution sandbox',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Programming language environments';

-- ----------------------------------------------------------------------------
-- Table: problems
-- Description: Master problem entity storing challenge specifications, constraints,
--              starter templates, and performance thresholds.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS problems (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    track_id INT UNSIGNED NOT NULL COMMENT 'Foreign key to tracks',
    category_id INT UNSIGNED NOT NULL COMMENT 'Foreign key to categories',
    difficulty_id INT UNSIGNED NOT NULL COMMENT 'Foreign key to difficulties',
    canonical_id VARCHAR(100) NOT NULL UNIQUE COMMENT 'Canonical alphanumeric ID matching frontend: hello-world, find-pivot-index',
    slug VARCHAR(120) NOT NULL UNIQUE COMMENT 'URL slug for problem workspace routing',
    problem_number INT UNSIGNED NOT NULL UNIQUE COMMENT 'Sequential platform catalog index number',
    title VARCHAR(200) NOT NULL COMMENT 'Problem display title',
    description MEDIUMTEXT NOT NULL COMMENT 'Full problem statement (HTML or markdown formatted)',
    input_format TEXT NULL COMMENT 'Standard input specifications',
    output_format TEXT NULL COMMENT 'Standard output specifications',
    constraints TEXT NULL COMMENT 'Value and boundary limits (e.g. 1 <= n <= 10^5)',
    explanation TEXT NULL COMMENT 'Sample problem walkthrough and pedagogical hints',
    starter_code MEDIUMTEXT NULL COMMENT 'Language template presented to the student in editor',
    is_premium BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Flag for Pro subscription tier access',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Soft toggle for problem availability',
    time_limit_ms INT UNSIGNED NOT NULL DEFAULT 2000 COMMENT 'Execution time limit per test case (default 2000ms)',
    memory_limit_mb INT UNSIGNED NOT NULL DEFAULT 256 COMMENT 'Heap memory limit in Megabytes (default 256MB)',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_problems_track 
        FOREIGN KEY (track_id) REFERENCES tracks (id) 
        ON UPDATE CASCADE ON DELETE RESTRICT,

    CONSTRAINT fk_problems_category 
        FOREIGN KEY (category_id) REFERENCES categories (id) 
        ON UPDATE CASCADE ON DELETE RESTRICT,

    CONSTRAINT fk_problems_difficulty 
        FOREIGN KEY (difficulty_id) REFERENCES difficulties (id) 
        ON UPDATE CASCADE ON DELETE RESTRICT,

    INDEX idx_problems_track_diff (track_id, difficulty_id),
    INDEX idx_problems_category (category_id),
    INDEX idx_problems_number (problem_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Master problem catalogue';

-- ----------------------------------------------------------------------------
-- Table: problem_hints
-- Description: Progressive 3-tier hints per problem to guide student learning
--              without spoiling the full solution immediately.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS problem_hints (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    problem_id BIGINT UNSIGNED NOT NULL COMMENT 'Foreign key to problems',
    hint_level TINYINT UNSIGNED NOT NULL COMMENT 'Hint progression: 1=Conceptual, 2=Approach, 3=Optimal Implementation',
    hint_text TEXT NOT NULL COMMENT 'Pedagogical guidance text',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_hints_problem 
        FOREIGN KEY (problem_id) REFERENCES problems (id) 
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT uk_problem_hint_level 
        UNIQUE (problem_id, hint_level),

    INDEX idx_hints_problem (problem_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Progressive hint tiers';

-- ----------------------------------------------------------------------------
-- Table: problem_test_cases
-- Description: Evaluation test suites. Crucial separation:
--              is_sample = TRUE: Public test cases rendered in student UI.
--              is_sample = FALSE: Hidden test cases kept confidential for backend judging.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS problem_test_cases (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    problem_id BIGINT UNSIGNED NOT NULL COMMENT 'Foreign key to problems',
    is_sample BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'TRUE: Visible sample in UI; FALSE: Secret evaluation test case',
    input_data MEDIUMTEXT NOT NULL COMMENT 'Standard input feed (stdin) supplied to runner',
    expected_output MEDIUMTEXT NOT NULL COMMENT 'Expected standard output (stdout) for comparison',
    explanation TEXT NULL COMMENT 'Explanation rendered for sample cases',
    display_order INT UNSIGNED NOT NULL DEFAULT 1 COMMENT 'Display sequence in UI test cases panel',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Active toggle for test case execution',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_testcases_problem 
        FOREIGN KEY (problem_id) REFERENCES problems (id) 
        ON DELETE CASCADE ON UPDATE CASCADE,

    INDEX idx_testcases_problem_sample (problem_id, is_sample)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Problem evaluation test cases';

-- ----------------------------------------------------------------------------
-- Table: problem_tags
-- Description: Conceptual keywords and algorithmic pattern tags (e.g. Two Pointers, Sliding Window).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS problem_tags (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64) NOT NULL UNIQUE COMMENT 'Display tag name: Two Pointers, Math, Recursion',
    slug VARCHAR(64) NOT NULL UNIQUE COMMENT 'Tag URL slug: two-pointers, math, recursion'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Algorithmic and conceptual tags';

-- ----------------------------------------------------------------------------
-- Table: problem_tag_mappings
-- Description: Many-to-many relationship linking problems to tags.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS problem_tag_mappings (
    problem_id BIGINT UNSIGNED NOT NULL,
    tag_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (problem_id, tag_id),

    CONSTRAINT fk_ptm_problem 
        FOREIGN KEY (problem_id) REFERENCES problems (id) 
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_ptm_tag 
        FOREIGN KEY (tag_id) REFERENCES problem_tags (id) 
        ON DELETE CASCADE ON UPDATE CASCADE,

    INDEX idx_ptm_tag (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Problem to tag junction table';

