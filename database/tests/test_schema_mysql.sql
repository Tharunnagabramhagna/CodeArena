-- ============================================================================
-- CodeArena Database Integration Test Suite
-- Script: test_schema_mysql.sql
-- Description: Executes standalone validation against a live MySQL 8.0 instance
--              to verify table structures, constraints, triggers, and foreign keys.
-- Target Engine: MySQL 8.0+ / InnoDB
-- Execution: mysql -u root -p < database/tests/test_schema_mysql.sql
-- ============================================================================

USE codearena_db;

DELIMITER $$

DROP PROCEDURE IF EXISTS RunSchemaVerificationTests$$
CREATE PROCEDURE RunSchemaVerificationTests()
BEGIN
    DECLARE v_table_count INT DEFAULT 0;
    DECLARE v_test_user_id BIGINT;
    DECLARE v_test_problem_id BIGINT;
    DECLARE v_duplicate_rejected BOOLEAN DEFAULT FALSE;
    DECLARE v_invalid_fk_rejected BOOLEAN DEFAULT FALSE;
    DECLARE v_self_prereq_rejected BOOLEAN DEFAULT FALSE;

    -- Error handler for duplicate key (Error 1062)
    DECLARE CONTINUE HANDLER FOR 1062 
    BEGIN
        SET v_duplicate_rejected = TRUE;
    END;

    -- Error handler for foreign key constraint violation (Error 1452)
    DECLARE CONTINUE HANDLER FOR 1452 
    BEGIN
        SET v_invalid_fk_rejected = TRUE;
    END;

    -- Error handler for check constraint violation (Error 3819)
    DECLARE CONTINUE HANDLER FOR 3819 
    BEGIN
        SET v_self_prereq_rejected = TRUE;
    END;

    SELECT '===================================================' AS 'Status';
    SELECT '    STARTING CODEARENA DATABASE TEST SUITE          ' AS 'Status';
    SELECT '===================================================' AS 'Status';

    -- ------------------------------------------------------------------------
    -- Test 1: Verify Table Count
    -- ------------------------------------------------------------------------
    SELECT COUNT(*) INTO v_table_count
    FROM information_schema.tables 
    WHERE table_schema = 'codearena_db' 
      AND table_type = 'BASE TABLE';

    IF v_table_count >= 20 THEN
        SELECT CONCAT('PASS: Core tables present (Found: ', v_table_count, ' tables)') AS Test_1_Table_Count;
    ELSE
        SELECT CONCAT('FAIL: Missing tables (Found only: ', v_table_count, ' tables)') AS Test_1_Table_Count;
    END IF;

    -- ------------------------------------------------------------------------
    -- Test 2: Verify Unique Constraint Enforcement (Users Email)
    -- ------------------------------------------------------------------------
    SET v_duplicate_rejected = FALSE;
    
    -- Insert base test user
    INSERT INTO users (username, email, password_hash, role_id, status_id)
    VALUES ('test_unique_user_1', 'unique_test@codearena.test', '$2a$12$dummyhash0000000000000000000000000000000000000000000000', 1, 1);
    SET v_test_user_id = LAST_INSERT_ID();

    -- Attempt to insert duplicate email
    INSERT INTO users (username, email, password_hash, role_id, status_id)
    VALUES ('test_unique_user_2', 'unique_test@codearena.test', '$2a$12$dummyhash0000000000000000000000000000000000000000000000', 1, 1);

    IF v_duplicate_rejected = TRUE THEN
        SELECT 'PASS: Duplicate email constraint successfully rejected' AS Test_2_Unique_Constraint;
    ELSE
        SELECT 'FAIL: Duplicate email was improperly accepted' AS Test_2_Unique_Constraint;
    END IF;

    -- ------------------------------------------------------------------------
    -- Test 3: Verify Foreign Key Referential Integrity (Invalid Role ID)
    -- ------------------------------------------------------------------------
    SET v_invalid_fk_rejected = FALSE;
    
    INSERT INTO users (username, email, password_hash, role_id, status_id)
    VALUES ('invalid_fk_user', 'invalid_fk@codearena.test', '$2a$12$dummyhash0000000000000000000000000000000000000000000000', 99999, 1);

    IF v_invalid_fk_rejected = TRUE THEN
        SELECT 'PASS: Foreign key rejection on invalid role_id verified' AS Test_3_FK_Integrity;
    ELSE
        SELECT 'FAIL: Invalid foreign key was accepted without error' AS Test_3_FK_Integrity;
    END IF;

    -- ------------------------------------------------------------------------
    -- Test 4: Verify Bookmark Uniqueness per User-Problem Pair
    -- ------------------------------------------------------------------------
    SET v_duplicate_rejected = FALSE;

    INSERT INTO user_bookmarks (user_id, problem_id, notes)
    VALUES (v_test_user_id, 1, 'First bookmark attempt');

    -- Attempt duplicate bookmark
    INSERT INTO user_bookmarks (user_id, problem_id, notes)
    VALUES (v_test_user_id, 1, 'Duplicate bookmark attempt');

    IF v_duplicate_rejected = TRUE THEN
        SELECT 'PASS: Composite uniqueness on user_bookmarks (user_id, problem_id) verified' AS Test_4_Bookmark_Uniqueness;
    ELSE
        SELECT 'FAIL: Duplicate bookmark was improperly accepted' AS Test_4_Bookmark_Uniqueness;
    END IF;

    -- ------------------------------------------------------------------------
    -- Test 5: Verify Self-Prerequisite Check Constraint
    -- ------------------------------------------------------------------------
    SET v_self_prereq_rejected = FALSE;

    INSERT INTO roadmap_prerequisites (topic_id, prerequisite_topic_id)
    VALUES (1, 1);

    IF v_self_prereq_rejected = TRUE THEN
        SELECT 'PASS: Check constraint chk_prereq_no_self prevented self-prerequisite' AS Test_5_Check_Constraint;
    ELSE
        SELECT 'FAIL: Self-prerequisite was improperly permitted' AS Test_5_Check_Constraint;
    END IF;

    -- ------------------------------------------------------------------------
    -- Test 6: Verify Cascade Deletion of User Profiles
    -- ------------------------------------------------------------------------
    INSERT INTO user_profiles (user_id, full_name, preferred_track)
    VALUES (v_test_user_id, 'Temp Test Student', 'basic');

    DELETE FROM users WHERE id = v_test_user_id;

    IF NOT EXISTS (SELECT 1 FROM user_profiles WHERE user_id = v_test_user_id) THEN
        SELECT 'PASS: ON DELETE CASCADE from users to user_profiles verified' AS Test_6_Cascade_Delete;
    ELSE
        SELECT 'FAIL: Orphaned user profile remained after user deletion' AS Test_6_Cascade_Delete;
        DELETE FROM user_profiles WHERE user_id = v_test_user_id;
    END IF;

    -- ------------------------------------------------------------------------
    -- Test 7: Verify user_oauth_accounts Composite Uniqueness on (provider, provider_user_id)
    -- ------------------------------------------------------------------------
    SET v_duplicate_rejected = FALSE;

    INSERT INTO users (username, email, password_hash, role_id, status_id)
    VALUES ('test_oauth_user_1', 'oauth_test_1@codearena.test', '$2a$12$dummyhash0000000000000000000000000000000000000000000000', 1, 1);
    SET v_test_user_id = LAST_INSERT_ID();

    INSERT INTO user_oauth_accounts (user_id, provider, provider_user_id, provider_email, email_verified)
    VALUES (v_test_user_id, 'GOOGLE', 'google_uid_1092837465', 'oauth_test_1@codearena.test', TRUE);

    -- Attempt duplicate provider + provider_user_id with another user
    INSERT INTO users (username, email, password_hash, role_id, status_id)
    VALUES ('test_oauth_user_2', 'oauth_test_2@codearena.test', '$2a$12$dummyhash0000000000000000000000000000000000000000000000', 1, 1);
    SET @v_test_user_id_2 = LAST_INSERT_ID();

    INSERT INTO user_oauth_accounts (user_id, provider, provider_user_id, provider_email, email_verified)
    VALUES (@v_test_user_id_2, 'GOOGLE', 'google_uid_1092837465', 'oauth_test_2@codearena.test', TRUE);

    IF v_duplicate_rejected = TRUE THEN
        SELECT 'PASS: Composite unique constraint uk_provider_user successfully rejected duplicate (provider, provider_user_id)' AS Test_7_OAuth_Uniqueness;
    ELSE
        SELECT 'FAIL: Duplicate OAuth provider user ID was improperly accepted' AS Test_7_OAuth_Uniqueness;
    END IF;

    -- ------------------------------------------------------------------------
    -- Test 8: Verify user_oauth_accounts Cascade Delete
    -- ------------------------------------------------------------------------
    DELETE FROM users WHERE id = v_test_user_id;
    DELETE FROM users WHERE id = @v_test_user_id_2;

    IF NOT EXISTS (SELECT 1 FROM user_oauth_accounts WHERE provider_user_id = 'google_uid_1092837465') THEN
        SELECT 'PASS: ON DELETE CASCADE from users to user_oauth_accounts verified' AS Test_8_OAuth_Cascade;
    ELSE
        SELECT 'FAIL: Orphaned user_oauth_accounts record remained after user deletion' AS Test_8_OAuth_Cascade;
        DELETE FROM user_oauth_accounts WHERE provider_user_id = 'google_uid_1092837465';
    END IF;

    SELECT '===================================================' AS 'Status';
    SELECT '    TEST SUITE EXECUTION COMPLETED                 ' AS 'Status';
    SELECT '===================================================' AS 'Status';

END$$

DELIMITER ;

CALL RunSchemaVerificationTests();
DROP PROCEDURE IF EXISTS RunSchemaVerificationTests;

