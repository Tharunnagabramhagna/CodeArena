-- ============================================================================
-- CodeArena Database Initialization
-- Script: 01_create_database.sql
-- Description: Creates the codearena_db database with strict utf8mb4 collation
--              and sets up the schema_migrations tracking table.
-- Target Engine: MySQL 8.0+ / InnoDB
-- ============================================================================

-- Create database with full 4-byte UTF-8 Unicode support
CREATE DATABASE IF NOT EXISTS codearena_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE codearena_db;

-- ----------------------------------------------------------------------------
-- Table: schema_migrations
-- Description: Records executed database migrations to guarantee idempotency,
--              track script checksums, and prevent duplicate executions.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(50) NOT NULL COMMENT 'Unique semantic migration version string, e.g. 001_initial_schema',
    name VARCHAR(150) NOT NULL COMMENT 'Descriptive title of the migration',
    applied_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT 'Exact microsecond timestamp when applied',
    checksum VARCHAR(64) NOT NULL COMMENT 'SHA-256 hash of the migration file content',
    execution_time_ms INT UNSIGNED NOT NULL COMMENT 'Total duration of execution in milliseconds',
    PRIMARY KEY (version)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_0900_ai_ci 
  COMMENT='System migration history log';

