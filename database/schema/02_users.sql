-- ============================================================================
-- CodeArena User Management Domain
-- Script: 02_users.sql
-- Description: Normalized user identity, security roles, lifecycle statuses,
--              and developer student profile metadata.
-- Target Engine: MySQL 8.0+ / InnoDB
-- ============================================================================

USE codearena_db;

-- ----------------------------------------------------------------------------
-- Table: roles
-- Description: System-wide access control roles (e.g. STUDENT, INSTRUCTOR, ADMIN).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE COMMENT 'Unique role key: STUDENT, INSTRUCTOR, ADMIN',
    description VARCHAR(255) NULL COMMENT 'Human-readable explanation of privileges',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='User authorization roles';

-- ----------------------------------------------------------------------------
-- Table: account_statuses
-- Description: Account lifecycle state (e.g. ACTIVE, PENDING_VERIFICATION, SUSPENDED).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS account_statuses (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE COMMENT 'Status code: ACTIVE, PENDING_VERIFICATION, SUSPENDED, DEACTIVATED',
    description VARCHAR(255) NULL COMMENT 'Explanation of the state',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Account state lookup';

-- ----------------------------------------------------------------------------
-- Table: users
-- Description: Core authentication entity.
-- Security Note: NEVER store plaintext passwords. The password_hash column is
--                sized at VARCHAR(255) to accommodate modern cryptographic hashing
--                algorithms (BCrypt $2a$/$2b$, Argon2id $argon2id$).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT 'Unique alphanumeric handle',
    email VARCHAR(255) NOT NULL UNIQUE COMMENT 'Validated electronic mail address',
    password_hash VARCHAR(255) NOT NULL COMMENT 'BCrypt or Argon2id cryptographic hash (>= 60 chars). No plaintext.',
    role_id INT UNSIGNED NOT NULL DEFAULT 1 COMMENT 'Foreign key to roles table',
    status_id INT UNSIGNED NOT NULL DEFAULT 1 COMMENT 'Foreign key to account_statuses table',
    is_verified BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Email address verification flag',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Account creation timestamp',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Timestamp of last modification',
    last_login_at DATETIME NULL COMMENT 'Most recent authentication timestamp',

    CONSTRAINT fk_users_role 
        FOREIGN KEY (role_id) REFERENCES roles (id) 
        ON UPDATE CASCADE ON DELETE RESTRICT,

    CONSTRAINT fk_users_status 
        FOREIGN KEY (status_id) REFERENCES account_statuses (id) 
        ON UPDATE CASCADE ON DELETE RESTRICT,

    INDEX idx_users_role (role_id),
    INDEX idx_users_status (status_id),
    INDEX idx_users_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Registered user accounts';

-- ----------------------------------------------------------------------------
-- Table: user_profiles
-- Description: Extended 1-to-1 profile attributes, social links, preferences,
--              and platform reputation points.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id BIGINT UNSIGNED NOT NULL PRIMARY KEY COMMENT 'Primary key and foreign key to users.id',
    full_name VARCHAR(100) NULL COMMENT 'Display name of the student or instructor',
    avatar_url VARCHAR(512) NULL COMMENT 'URL or asset path for the user avatar image',
    bio TEXT NULL COMMENT 'Personal biography or university / company affiliation',
    github_username VARCHAR(100) NULL COMMENT 'Linked GitHub account handle',
    linkedin_url VARCHAR(255) NULL COMMENT 'Linked LinkedIn profile URL',
    preferred_track ENUM('basic', 'dsa') NOT NULL DEFAULT 'basic' COMMENT 'Default landing track preference',
    reputation_points INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Gamification score earned from accepted challenges',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_profiles_user 
        FOREIGN KEY (user_id) REFERENCES users (id) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Extended user profile and gamification metadata';

-- ----------------------------------------------------------------------------
-- Table: user_oauth_accounts
-- Description: Linked external OAuth identity accounts (Google, Facebook).
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

