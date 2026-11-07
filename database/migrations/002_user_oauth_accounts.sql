-- ============================================================================
-- CodeArena Database Migration: 002_user_oauth_accounts.sql
-- Version: 002_user_oauth_accounts
-- Description: External OAuth account linking table for Google and Facebook sign-in.
--              Associates verified external identity claims with CodeArena user accounts.
-- Target Engine: MySQL 8.0+ / InnoDB / utf8mb4
-- ============================================================================

USE codearena_db;

-- ----------------------------------------------------------------------------
-- Table: user_oauth_accounts
-- Description: Stores linked external identity provider accounts (Google, Facebook).
--              Enforces composite uniqueness on (provider, provider_user_id).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_oauth_accounts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL COMMENT 'Foreign key to users.id',
    provider ENUM('GOOGLE', 'FACEBOOK') NOT NULL COMMENT 'External OAuth provider (GOOGLE or FACEBOOK)',
    provider_user_id VARCHAR(255) NOT NULL COMMENT 'Unique external subject/user ID returned by provider (Google sub, Facebook id)',
    provider_email VARCHAR(255) NULL COMMENT 'Email address reported by provider claim',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Whether provider asserted email verification',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_oauth_user 
        FOREIGN KEY (user_id) REFERENCES users (id) 
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT uk_provider_user 
        UNIQUE (provider, provider_user_id),

    INDEX idx_oauth_user (user_id),
    INDEX idx_oauth_provider_email (provider, provider_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='External OAuth identity provider associations';

-- ----------------------------------------------------------------------------
-- Migration Tracking:
-- Migration execution, SHA-256 file content checksum calculation, and tracking
-- record registration into `schema_migrations` are managed by the CodeArena migration runner.
-- ----------------------------------------------------------------------------

