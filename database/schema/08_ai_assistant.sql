-- ============================================================================
-- CodeArena AI Assistant Domain (Future Ready)
-- Script: 08_ai_assistant.sql
-- Description: Conversation sessions and message persistence for the integrated
--              AI coding assistant and pedagogical tutor.
-- Target Engine: MySQL 8.0+ / InnoDB
-- ============================================================================

USE codearena_db;

-- ----------------------------------------------------------------------------
-- Table: ai_conversations
-- Description: Chat threads associated with a user and optionally tied to a problem workspace.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_conversations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    conversation_uid VARCHAR(64) NOT NULL UNIQUE COMMENT 'Public UUID / NanoID reference for frontend state',
    user_id BIGINT UNSIGNED NOT NULL COMMENT 'Student initiating dialogue',
    problem_id BIGINT UNSIGNED NULL COMMENT 'Optional problem context (NULL for general Java questions)',
    title VARCHAR(200) NOT NULL DEFAULT 'Coding Session' COMMENT 'Conversation thread topic summary',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_ai_user 
        FOREIGN KEY (user_id) REFERENCES users (id) 
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_ai_problem 
        FOREIGN KEY (problem_id) REFERENCES problems (id) 
        ON DELETE SET NULL ON UPDATE CASCADE,

    INDEX idx_ai_user_created (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='AI assistant interactive sessions';

-- ----------------------------------------------------------------------------
-- Table: ai_messages
-- Description: Granular chat messages within an AI conversation session,
--              including token usage tracking for quota and rate management.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_messages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    conversation_id BIGINT UNSIGNED NOT NULL COMMENT 'Parent conversation session',
    sender_role ENUM('user', 'assistant', 'system') NOT NULL COMMENT 'Role of message sender',
    content MEDIUMTEXT NOT NULL COMMENT 'Message body with markdown and code snippets',
    prompt_tokens INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'LLM input token count',
    completion_tokens INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'LLM output token count',
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT 'Timestamp with millisecond precision',

    CONSTRAINT fk_aimsg_conv 
        FOREIGN KEY (conversation_id) REFERENCES ai_conversations (id) 
        ON DELETE CASCADE ON UPDATE CASCADE,

    INDEX idx_aimsg_conv_created (conversation_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='AI chat messages and token telemetry';

