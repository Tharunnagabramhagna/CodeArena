-- ============================================================================
-- CodeArena Seed: 05_dev_sample_data.sql
-- Description: Isolated development environment test fixtures.
-- IMPORTANT:
--   1. Never deployed to production environments.
--   2. Passwords are cryptographically pre-hashed (standard BCrypt $2a$ format).
--      No plaintext passwords are ever stored.
--   3. Sample submissions are explicitly tagged as `is_preview = TRUE` to
--      clearly distinguish simulated preview runs from genuine judge executions.
-- Target Engine: MySQL 8.0+ / InnoDB
-- ============================================================================

USE codearena_db;

SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;

-- ----------------------------------------------------------------------------
-- 1. Development Accounts (Pre-hashed BCrypt strings; no plaintext)
-- Uses INSERT IGNORE so existing user accounts are NEVER overwritten or altered.
-- ----------------------------------------------------------------------------
INSERT IGNORE INTO users (id, username, email, password_hash, role_id, status_id, is_verified, created_at) VALUES
(1001, 'dev_student', 'student.dev@codearena.internal', '$2a$12$K8p5aHkW4Y4j8aE9dI1fGuE8Y8yO6q9iN1m2p3r4s5t6u7v8w9x0y', 1, 1, TRUE, '2026-01-10 10:00:00'),
(1002, 'dev_instructor', 'mentor.dev@codearena.internal', '$2a$12$M9q6bIlX5Z5k9bF0eJ2gHvF9Z9zP7r0jO2n3q4s5t6u7v8w9x0y1z', 2, 1, TRUE, '2026-01-10 10:00:00'),
(1003, 'dev_admin', 'admin.dev@codearena.internal', '$2a$12$N0r7cJmY6A6l0cG1fK3hIwG0A0aQ8s1kP3o4r5t6u7v8w9x0y1z2a', 3, 1, TRUE, '2026-01-10 10:00:00');

-- ----------------------------------------------------------------------------
-- 2. Development Profiles (Non-destructive)
-- ----------------------------------------------------------------------------
INSERT IGNORE INTO user_profiles (user_id, full_name, avatar_url, bio, github_username, preferred_track, reputation_points) VALUES
(1001, 'Alex Chen', 'https://assets.codearena.internal/avatars/student1.png', 'Computer Science student focusing on core Java and algorithmic systems.', 'alexchen-dev', 'basic', 140),
(1002, 'Dr. Sarah Lin', 'https://assets.codearena.internal/avatars/mentor1.png', 'Associate Professor of Computer Science; Data Structures and Algorithms instructor.', 'sarahlin-phd', 'dsa', 850),
(1003, 'Dev Ops Lead', 'https://assets.codearena.internal/avatars/admin1.png', 'System reliability and execution infrastructure administrator.', 'codearena-infra', 'dsa', 1200);

-- ----------------------------------------------------------------------------
-- 3. Development Preferences (Non-destructive)
-- ----------------------------------------------------------------------------
INSERT IGNORE INTO user_preferences (user_id, theme, editor_font_size, editor_tab_size, editor_keymap, auto_close_brackets, reduced_motion) VALUES
(1001, 'dark', 14, 4, 'default', TRUE, FALSE),
(1002, 'light', 16, 4, 'default', TRUE, FALSE),
(1003, 'dark', 14, 2, 'vim', TRUE, TRUE);

-- ----------------------------------------------------------------------------
-- 4. Sample Student Bookmarks (Non-destructive)
-- ----------------------------------------------------------------------------
INSERT IGNORE INTO user_bookmarks (user_id, problem_id, notes, created_at) VALUES
(1001, 1, 'Review standard System.out formatting for exam', '2026-01-15 14:30:00'),
(1001, 101, 'Classic prefix sum pattern - re-solve before technical interview', '2026-01-16 18:20:00');

-- ----------------------------------------------------------------------------
-- 5. Sample Preview Submissions (Explicitly marked is_preview = TRUE)
-- ----------------------------------------------------------------------------
INSERT IGNORE INTO submissions (
    id, submission_uid, user_id, problem_id, language_id, status_id, verdict_id,
    source_code, is_preview, execution_time_ms, memory_used_kb,
    test_cases_passed, test_cases_total, compiler_output, runtime_error_log,
    submitted_at, judged_at
) VALUES
(1001, 'sub_preview_test_001', 1001, 1, 1, 4, 2, 
'public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}', TRUE, 42, 14200, 1, 1, 'Compilation successful. Java 17 Preview Engine.', NULL, '2026-01-15 14:35:00', '2026-01-15 14:35:01'),

(1002, 'sub_preview_test_002', 1001, 101, 1, 4, 2, 
'class Solution {
    public int pivotIndex(int[] nums) {
        int totalSum = 0;
        for (int x : nums) totalSum += x;
        int leftSum = 0;
        for (int i = 0; i < nums.length; i++) {
            if (leftSum == totalSum - leftSum - nums[i]) return i;
            leftSum += nums[i];
        }
        return -1;
    }
}', TRUE, 55, 18400, 3, 3, 'Compilation successful. Local mock preview suite.', NULL, '2026-01-16 18:25:00', '2026-01-16 18:25:01');

-- ----------------------------------------------------------------------------
-- 6. Sample Upcoming Contest (Non-destructive)
-- ----------------------------------------------------------------------------
INSERT IGNORE INTO contests (id, slug, title, description, start_time, end_time, status) VALUES
(101, 'biweekly-contest-01', 'CodeArena Bi-Weekly Sprint #1', 'First competitive algorithmic tournament. 4 problems, 90 minutes. Open to all students.', '2026-12-01 14:00:00', '2026-12-01 15:30:00', 'UPCOMING');

INSERT IGNORE INTO contest_problems (contest_id, problem_id, letter_code, score_weight) VALUES
(101, 101, 'A', 100),
(101, 102, 'B', 200),
(101, 103, 'C', 300);

INSERT IGNORE INTO contest_registrations (contest_id, user_id, registered_at) VALUES
(101, 1001, '2026-01-20 09:15:00');

SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;

