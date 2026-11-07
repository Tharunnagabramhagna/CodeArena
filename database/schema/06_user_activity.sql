-- ============================================================================
-- CodeArena User Activity Domain
-- Script: 06_user_activity.sql
-- Description: Manages user problem bookmarks, IDE editor & UI preferences,
--              and recently viewed problem history.
-- Target Engine: MySQL 8.0+ / InnoDB
-- ============================================================================

USE codearena_db;

-- ----------------------------------------------------------------------------
-- Table: user_bookmarks
-- Description: Saved problem challenges per user with optional personal notes.
--              Enforces unique constraint to prevent duplicate bookmarks.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_bookmarks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    problem_id BIGINT UNSIGNED NOT NULL,
    notes VARCHAR(255) NULL COMMENT 'Optional student memo or revision tag',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_bookmarks_user 
        FOREIGN KEY (user_id) REFERENCES users (id) 
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_bookmarks_problem 
        FOREIGN KEY (problem_id) REFERENCES problems (id) 
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT uk_user_problem_bookmark 
        UNIQUE (user_id, problem_id),

    INDEX idx_bookmarks_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='User problem bookmarks';

-- ----------------------------------------------------------------------------
-- Table: user_preferences
-- Description: Workspace configuration, theme choice, editor font size,
--              and accessibility flags per user.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id BIGINT UNSIGNED NOT NULL PRIMARY KEY,
    theme ENUM('dark', 'light', 'system') NOT NULL DEFAULT 'dark' COMMENT 'Active visual color palette',
    editor_font_size TINYINT UNSIGNED NOT NULL DEFAULT 14 COMMENT 'Monaco/CodeMirror font size in pixels (10-24)',
    editor_tab_size TINYINT UNSIGNED NOT NULL DEFAULT 4 COMMENT 'Indentation width (2 or 4 spaces)',
    editor_keymap VARCHAR(20) NOT NULL DEFAULT 'default' COMMENT 'Keymap mode: default, vim, emacs',
    auto_close_brackets BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Auto-pair matching quotes and brackets',
    reduced_motion BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Accessibility flag for CSS transitions',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_preferences_user 
        FOREIGN KEY (user_id) REFERENCES users (id) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='User IDE and accessibility preferences';

-- ----------------------------------------------------------------------------
-- Table: user_recently_viewed
-- Description: Tracks recent problem visits for quick resume on the student dashboard.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_recently_viewed (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    problem_id BIGINT UNSIGNED NOT NULL,
    viewed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_recent_user 
        FOREIGN KEY (user_id) REFERENCES users (id) 
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_recent_problem 
        FOREIGN KEY (problem_id) REFERENCES problems (id) 
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT uk_user_recent_problem 
        UNIQUE (user_id, problem_id),

    INDEX idx_recent_user_viewed (user_id, viewed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='User problem viewing history';

