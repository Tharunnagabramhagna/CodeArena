-- ============================================================================
-- CodeArena TiDB Cloud Repair Script: Batch 04 (Remaining 3 Tables)
-- Domain: Guided Java Learning Roadmap (Targeted Repair)
-- Target Engine: TiDB Cloud Serverless (v8.5.3+) / MySQL 8.0 Protocol
-- Database: codearena_db
-- Tables created by this repair: 3
--   1. roadmap_prerequisites
--   2. roadmap_topic_problems
--   3. user_topic_progress
-- Pre-existing tables preserved (NOT dropped or recreated):
--   - roadmap_levels (already exists)
--   - roadmap_topics (already exists)
-- Cumulative Tables after repair: 23 / 32
-- ============================================================================

-- Session configuration for TiDB Cloud Serverless
SET foreign_key_checks = 1;
SET sql_mode = 'TRADITIONAL';
SET NAMES utf8mb4;

USE codearena_db;

-- ----------------------------------------------------------------------------
-- 1. Topic Prerequisites (DAG Relationship)
-- Note: Foreign keys fk_prereq_topic and fk_prereq_required enforce strict
--       relational referential integrity to roadmap_topics(id).
--       Inline CHECK constraint chk_prereq_no_self is decoupled to resolve
--       TiDB/MySQL Error 3823 (CHECK constraint conflict on FK columns).
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
-- 2. Roadmap Topic Problems Association
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
-- 3. Student Topic Learning Progress
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
-- Verification Query: Audits all 5 roadmap tables and cumulative baseline count
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

