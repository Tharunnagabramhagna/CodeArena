-- ============================================================================
-- CodeArena Learning System & Guided Roadmap Domain
-- Script: 05_learning.sql
-- Description: Normalized schema for the 30-topic Guided Java Learning Roadmap,
--              3 tiers/levels, prerequisite DAG relationships, topic-problem
--              assignments, and student progress tracking.
-- Target Engine: MySQL 8.0+ / InnoDB
-- ============================================================================

USE codearena_db;

-- ----------------------------------------------------------------------------
-- Table: roadmap_levels
-- Description: Curated mastery tiers (Level 1: Fundamentals, Level 2: Core Java,
--              Level 3: Data Structures & Algorithms).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roadmap_levels (
    id INT UNSIGNED NOT NULL PRIMARY KEY COMMENT 'Tier identifier (1, 2, 3)',
    slug VARCHAR(50) NOT NULL UNIQUE COMMENT 'Level slug: fundamentals, core-java, dsa',
    title VARCHAR(100) NOT NULL COMMENT 'Display label: Level 1: Java Fundamentals',
    badge VARCHAR(100) NOT NULL COMMENT 'Level badge: Beginner Foundations',
    description TEXT NOT NULL COMMENT 'Comprehensive tier summary',
    display_order INT UNSIGNED NOT NULL COMMENT 'Display sequence order',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Roadmap pedagogical tiers';

-- ----------------------------------------------------------------------------
-- Table: roadmap_topics
-- Description: 30 structured learning milestones with learning objectives,
--              core concepts, code examples, and sequence ordering.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roadmap_topics (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(64) NOT NULL UNIQUE COMMENT 'Immutable topic slug matching frontend (e.g. intro-to-java, arrays-matrices)',
    level_id INT UNSIGNED NOT NULL COMMENT 'Parent curriculum level',
    sequence_order INT UNSIGNED NOT NULL COMMENT '1 to 30 sequential curriculum position',
    title VARCHAR(150) NOT NULL COMMENT 'Topic title: Introduction to Java, Array Manipulation',
    estimated_hours DECIMAL(4,1) NOT NULL DEFAULT 2.0 COMMENT 'Recommended study time in hours',
    summary TEXT NOT NULL COMMENT 'Overview of pedagogical goals',
    core_concepts JSON NULL COMMENT 'Array of core concept bullets in JSON format',
    code_example MEDIUMTEXT NULL COMMENT 'Canonical Java reference snippet',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_topics_level 
        FOREIGN KEY (level_id) REFERENCES roadmap_levels (id) 
        ON UPDATE CASCADE ON DELETE RESTRICT,

    INDEX idx_topics_level_seq (level_id, sequence_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Roadmap curriculum milestones';

-- ----------------------------------------------------------------------------
-- Table: roadmap_prerequisites
-- Description: Directed Acyclic Graph (DAG) edges modeling concept dependencies.
--              Enforces that a topic cannot be prerequisite to itself.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roadmap_prerequisites (
    topic_id BIGINT UNSIGNED NOT NULL COMMENT 'Topic that has a requirement',
    prerequisite_topic_id BIGINT UNSIGNED NOT NULL COMMENT 'Required prior topic',
    PRIMARY KEY (topic_id, prerequisite_topic_id),

    CONSTRAINT fk_prereq_topic 
        FOREIGN KEY (topic_id) REFERENCES roadmap_topics (id) 
        ON DELETE RESTRICT ON UPDATE RESTRICT,

    CONSTRAINT fk_prereq_required 
        FOREIGN KEY (prerequisite_topic_id) REFERENCES roadmap_topics (id) 
        ON DELETE RESTRICT ON UPDATE RESTRICT,

    CONSTRAINT chk_prereq_no_self 
        CHECK (topic_id <> prerequisite_topic_id),

    INDEX idx_prereq_required (prerequisite_topic_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Topic dependency DAG relationships';

-- ----------------------------------------------------------------------------
-- Table: roadmap_topic_problems
-- Description: Junction table linking practice challenges to roadmap topics.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roadmap_topic_problems (
    topic_id BIGINT UNSIGNED NOT NULL,
    problem_id BIGINT UNSIGNED NOT NULL,
    sequence_order INT UNSIGNED NOT NULL DEFAULT 1 COMMENT 'Recommended problem solving order within topic',
    PRIMARY KEY (topic_id, problem_id),

    CONSTRAINT fk_rtp_topic 
        FOREIGN KEY (topic_id) REFERENCES roadmap_topics (id) 
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_rtp_problem 
        FOREIGN KEY (problem_id) REFERENCES problems (id) 
        ON DELETE CASCADE ON UPDATE CASCADE,

    INDEX idx_rtp_problem (problem_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Curated problem mappings for roadmap topics';

-- ----------------------------------------------------------------------------
-- Table: user_topic_progress
-- Description: Tracks student progress across roadmap milestones.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_topic_progress (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    topic_id BIGINT UNSIGNED NOT NULL,
    status ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'NOT_STARTED',
    started_at DATETIME NULL COMMENT 'Timestamp when user started topic',
    completed_at DATETIME NULL COMMENT 'Timestamp when user satisfied all completion criteria',
    last_accessed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_utp_user 
        FOREIGN KEY (user_id) REFERENCES users (id) 
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_utp_topic 
        FOREIGN KEY (topic_id) REFERENCES roadmap_topics (id) 
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT uk_user_topic 
        UNIQUE (user_id, topic_id),

    INDEX idx_utp_user_status (user_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Student roadmap milestone progress';

