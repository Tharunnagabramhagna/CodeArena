-- ============================================================================
-- CodeArena Database Seed Data
-- Provides demo users, initial profiles, topic progress, and submission history.
-- Passwords below are hashed using BCrypt for 'Password@123'
-- Hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- ============================================================================

USE codearena_db;

-- 1. Insert Demo Users (Kavya Student & Demo Admin)
INSERT INTO users (id, email, password_hash, full_name, role, is_active) VALUES
(1, 'kavya@codearena.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Kavya Sharma', 'STUDENT', TRUE),
(2, 'tharun@codearena.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Tharun N', 'STUDENT', TRUE),
(3, 'admin@codearena.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'System Administrator', 'ADMIN', TRUE)
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

-- 2. Insert Student Profiles
INSERT INTO student_profiles (id, user_id, bio, github_url, linkedin_url, preferred_language, ranking_score, problems_solved, streak_days, last_active_date) VALUES
(1, 1, 'Passionate Java and algorithmic problem solver building scalable backend systems.', 'https://github.com/kavya-coder', 'https://linkedin.com/in/kavya-codearena', 'Java', 1420, 28, 7, CURRENT_DATE()),
(2, 2, 'Full-stack software developer exploring Java servlets, JDBC, and competitive programming.', 'https://github.com/tharun-dev', 'https://linkedin.com/in/tharun-codearena', 'Java', 980, 15, 3, CURRENT_DATE())
ON DUPLICATE KEY UPDATE bio = VALUES(bio);

-- 3. Insert Student Progress Topics
INSERT INTO student_progress (user_id, topic, problems_attempted, problems_solved, proficiency_level) VALUES
(1, 'Arrays & Hashing', 12, 10, 'ADVANCED'),
(1, 'Object-Oriented Programming', 8, 8, 'ADVANCED'),
(1, 'Two Pointers & Sliding Window', 7, 5, 'INTERMEDIATE'),
(1, 'Recursion & Backtracking', 6, 3, 'INTERMEDIATE'),
(1, 'Trees & Graphs', 4, 2, 'BEGINNER'),
(2, 'Arrays & Hashing', 8, 6, 'INTERMEDIATE'),
(2, 'Object-Oriented Programming', 6, 5, 'INTERMEDIATE'),
(2, 'Data Structures', 5, 4, 'INTERMEDIATE')
ON DUPLICATE KEY UPDATE problems_solved = VALUES(problems_solved);

-- 4. Insert Submissions History
INSERT INTO submissions (user_id, problem_id, problem_title, language, code, verdict, execution_time_ms, memory_kb, submitted_at) VALUES
(1, 101, 'Two Sum', 'Java', 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        java.util.Map<Integer, Integer> map = new java.util.HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) return new int[] { map.get(comp), i };\n            map.put(nums[i], i);\n        }\n        return new int[0];\n    }\n}', 'ACCEPTED', 2, 42100, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(1, 102, 'Valid Palindrome', 'Java', 'class Solution {\n    public boolean isPalindrome(String s) {\n        int i = 0, j = s.length() - 1;\n        while (i < j) {\n            while (i < j && !Character.isLetterOrDigit(s.charAt(i))) i++;\n            while (i < j && !Character.isLetterOrDigit(s.charAt(j))) j--;\n            if (Character.toLowerCase(s.charAt(i)) != Character.toLowerCase(s.charAt(j))) return false;\n            i++; j--;\n        }\n        return true;\n    }\n}', 'ACCEPTED', 3, 38900, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, 103, 'Binary Search', 'Java', 'class Solution {\n    public int search(int[] nums, int target) {\n        int l = 0, r = nums.length - 1;\n        while (l <= r) {\n            int m = l + (r - l) / 2;\n            if (nums[m] == target) return m;\n            if (nums[m] < target) l = m + 1;\n            else r = m - 1;\n        }\n        return -1;\n    }\n}', 'ACCEPTED', 0, 41200, NOW()),
(1, 104, 'LRU Cache Design', 'Java', '// Incomplete submission\nclass LRUCache {}', 'WRONG_ANSWER', 15, 52300, DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(2, 101, 'Two Sum', 'Java', '// Brute force approach\nclass Solution {}', 'TIME_LIMIT_EXCEEDED', 1200, 64200, DATE_SUB(NOW(), INTERVAL 1 DAY));

