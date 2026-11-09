-- ============================================================================
-- CodeArena TiDB Cloud Deployment: Batch 04 of 06
-- Domain: Guided Java Learning Roadmap
-- Target Engine: TiDB Cloud Serverless (v8.5.3+) / MySQL 8.0 Protocol
-- Database: codearena_db
-- Batch Tables: 5 (roadmap_levels, roadmap_topics, roadmap_prerequisites,
--                  roadmap_topic_problems, user_topic_progress)
-- Cumulative Tables: 23 / 32
-- Prerequisites: Batch 01 (users), Batch 02 (problems)
-- Note: Self-prerequisite prevention enforced at application & validation layer
--       to prevent MySQL/TiDB Error 3823 (FK referential action on CHECK column).
-- ============================================================================

-- Session configuration for TiDB Cloud Serverless
SET foreign_key_checks = 1;
SET sql_mode = 'TRADITIONAL';
SET NAMES utf8mb4;

USE codearena_db;

-- ----------------------------------------------------------------------------
-- 1. Roadmap Difficulty Levels
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

-- ----------------------------------------------------------------------------
-- 2. Roadmap Learning Topics
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- 3. Topic Prerequisites (DAG Relationship)
-- Note: Foreign keys fk_prereq_topic and fk_prereq_required enforce strict
--       relational referential integrity to roadmap_topics(id).
--       Self-prerequisite prevention (topic_id <> prerequisite_topic_id)
--       is enforced at application and seed-validation layers.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roadmap_prerequisites (
    topic_id BIGINT UNSIGNED NOT NULL,
    prerequisite_topic_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (topic_id, prerequisite_topic_id),

    CONSTRAINT fk_prereq_topic FOREIGN KEY (topic_id) REFERENCES roadmap_topics (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_prereq_required FOREIGN KEY (prerequisite_topic_id) REFERENCES roadmap_topics (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    INDEX idx_prereq_required (prerequisite_topic_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- 4. Roadmap Topic Problems Association
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roadmap_topic_problems (
    topic_id BIGINT UNSIGNED NOT NULL,
    problem_id BIGINT UNSIGNED NOT NULL,
    sequence_order INT UNSIGNED NOT NULL DEFAULT 1,
    PRIMARY KEY (topic_id, problem_id),

    CONSTRAINT fk_rtp_topic FOREIGN KEY (topic_id) REFERENCES roadmap_topics (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_rtp_problem FOREIGN KEY (problem_id) REFERENCES problems (id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_rtp_problem (problem_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- 5. Student Topic Learning Progress
-- ----------------------------------------------------------------------------
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
-- Verification Query for Batch 04
-- Confirms the 5 tables are registered as BASE TABLEs and reports count
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
  AND table_name IN ('roadmap_levels', 'roadmap_topics', 'roadmap_prerequisites',
                     'roadmap_topic_problems', 'user_topic_progress')
ORDER BY table_name ASC;
