-- ============================================================================
-- CodeArena TiDB Cloud Deployment: Batch 06 of 06
-- Domain: AI Assistant Domain & Full Core Schema Final Audit
-- Target Engine: TiDB Cloud Serverless (v8.5.3+) / MySQL 8.0 Protocol
-- Database: codearena_db
-- Batch Tables: 2 (ai_conversations, ai_messages)
-- Cumulative Tables: 32 / 32 (Complete Core Baseline)
-- Prerequisites: Batch 01 (users), Batch 02 (problems)
-- ============================================================================

-- Session configuration for TiDB Cloud Serverless
SET foreign_key_checks = 1;
SET sql_mode = 'TRADITIONAL';
SET NAMES utf8mb4;

USE codearena_db;

-- ----------------------------------------------------------------------------
-- 1. AI Conversations Master Table
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

-- ----------------------------------------------------------------------------
-- 2. AI Messages Thread
-- ----------------------------------------------------------------------------
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
-- Verification Query for Batch 06
-- Confirms ai_conversations and ai_messages are registered as BASE TABLEs
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
  AND table_name IN ('ai_conversations', 'ai_messages')
ORDER BY table_name ASC;

-- ----------------------------------------------------------------------------
-- Final Cumulative Verification Query for Complete Core Schema
-- Reports all active BASE TABLEs and total dynamic count in codearena_db
-- ----------------------------------------------------------------------------
SELECT 
    table_name,
    engine,
    table_collation
FROM information_schema.tables 
WHERE table_schema = 'codearena_db'
  AND table_type = 'BASE TABLE'
ORDER BY table_name ASC;

SELECT 
    COUNT(*) AS total_base_tables_in_codearena_db
FROM information_schema.tables 
WHERE table_schema = 'codearena_db'
  AND table_type = 'BASE TABLE';
