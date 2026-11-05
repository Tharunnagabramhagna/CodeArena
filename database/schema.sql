-- ============================================================================
-- CodeArena Database Schema Definition
-- Project: CodeArena - Online Coding Platform
-- Assigned Ownership: Person 4 (Kavya) - Authentication & Student Services
-- Tables: users, student_profiles, student_progress, submissions, activity_logs
-- Target DBMS: MySQL 8.0+
-- ============================================================================

CREATE DATABASE IF NOT EXISTS codearena_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE codearena_db;

-- ----------------------------------------------------------------------------
-- Table 1: users
-- Core authentication credentials, identity, and role-based permissions
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(64) DEFAULT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('STUDENT', 'ADMIN', 'INSTRUCTOR') NOT NULL DEFAULT 'STUDENT',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table 2: student_profiles
-- Extended biographical, social, and cumulative coding statistics for students
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS student_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    bio TEXT,
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    preferred_language VARCHAR(50) NOT NULL DEFAULT 'Java',
    avatar_url VARCHAR(255),
    ranking_score INT NOT NULL DEFAULT 0,
    problems_solved INT NOT NULL DEFAULT 0,
    streak_days INT NOT NULL DEFAULT 0,
    last_active_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_profiles_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    INDEX idx_profiles_user_id (user_id),
    INDEX idx_profiles_ranking (ranking_score DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table 3: student_progress
-- Topic-wise mastery tracking (Arrays, OOP, Recursion, Trees, DP, etc.)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS student_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    topic VARCHAR(100) NOT NULL,
    problems_attempted INT NOT NULL DEFAULT 0,
    problems_solved INT NOT NULL DEFAULT 0,
    proficiency_level ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED') NOT NULL DEFAULT 'BEGINNER',
    last_activity TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_progress_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT uq_user_topic UNIQUE (user_id, topic),
    INDEX idx_progress_user (user_id),
    INDEX idx_progress_topic (topic)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table 4: submissions
-- Historical audit of all code submissions, verdicts, and runtime metrics
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    problem_id INT NOT NULL DEFAULT 1,
    problem_title VARCHAR(255) NOT NULL,
    language VARCHAR(50) NOT NULL DEFAULT 'Java',
    code MEDIUMTEXT NOT NULL,
    verdict ENUM('ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'COMPILATION_ERROR', 'RUNTIME_ERROR', 'PENDING') NOT NULL DEFAULT 'PENDING',
    execution_time_ms INT NOT NULL DEFAULT 0,
    memory_kb INT NOT NULL DEFAULT 0,
    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_submissions_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    INDEX idx_submissions_user_time (user_id, submitted_at DESC),
    INDEX idx_submissions_verdict (verdict)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table 5: activity_logs
-- Asynchronous audit trail for security events and activity streaks
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_activity_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    INDEX idx_activity_user_time (user_id, created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

