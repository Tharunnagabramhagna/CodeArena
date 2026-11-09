-- ============================================================================
-- CodeArena Seed: 01_reference_data.sql
-- Description: Core reference and lookup datasets: roles, statuses, tracks,
--              categories, difficulties, languages, verdicts, and roadmap tiers.
-- Target Engine: MySQL 8.0+ / InnoDB
-- ============================================================================

USE codearena_db;

SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;

-- ----------------------------------------------------------------------------
-- 1. Roles
-- ----------------------------------------------------------------------------
INSERT INTO roles (id, name, description) VALUES
(1, 'STUDENT', 'Enrolled learner and coding practitioner'),
(2, 'INSTRUCTOR', 'Course mentor with problem authoring and review privileges'),
(3, 'ADMIN', 'Platform administrator with full system management')
ON DUPLICATE KEY UPDATE 
    name = VALUES(name), 
    description = VALUES(description);

-- ----------------------------------------------------------------------------
-- 2. Account Statuses
-- ----------------------------------------------------------------------------
INSERT INTO account_statuses (id, code, description) VALUES
(1, 'ACTIVE', 'Account in regular good standing'),
(2, 'PENDING_VERIFICATION', 'Awaiting email address verification'),
(3, 'SUSPENDED', 'Account temporarily suspended for policy violations'),
(4, 'DEACTIVATED', 'Account voluntarily closed by user')
ON DUPLICATE KEY UPDATE 
    code = VALUES(code), 
    description = VALUES(description);

-- ----------------------------------------------------------------------------
-- 3. Practice Tracks
-- ----------------------------------------------------------------------------
INSERT INTO tracks (id, slug, name, description, is_active, display_order) VALUES
(1, 'basic', 'Basic Java Programming', 'Beginner-friendly Java challenges structured across 13 core language pillars.', TRUE, 1),
(2, 'dsa', 'Data Structures & Algorithms', 'Comprehensive algorithmic problem-solving across 12 classical DSA domains with interactive animations.', TRUE, 2)
ON DUPLICATE KEY UPDATE 
    slug = VALUES(slug), 
    name = VALUES(name), 
    description = VALUES(description),
    display_order = VALUES(display_order);

-- ----------------------------------------------------------------------------
-- 4. Problem Categories (Basic Track 1..13, DSA Track 14..25)
-- ----------------------------------------------------------------------------
INSERT INTO categories (id, track_id, slug, name, description, icon_name, accent_color, display_order) VALUES
-- Basic Track Categories (13 pillars)
(1, 1, 'fundamentals', 'Java Fundamentals', 'Core syntax, variables, data types, standard output, and basic program structure.', 'terminal', '#3B82F6', 1),
(2, 1, 'io', 'Input and Output', 'Reading inputs with java.util.Scanner, buffered streams, and formatted printing.', 'keyboard', '#10B981', 2),
(3, 1, 'operators', 'Operators', 'Arithmetic, relational, logical, bitwise, assignment, and ternary operators.', 'plus', '#F59E0B', 3),
(4, 1, 'conditionals', 'Conditional Statements', 'Decision making with if-else ladders, nested conditions, and switch expressions.', 'shuffle', '#EC4899', 4),
(5, 1, 'loops', 'Loops', 'Repetition constructs: for, while, do-while, nested loops, break, and continue.', 'repeat', '#8B5CF6', 5),
(6, 1, 'numbers', 'Number Problems', 'Primes, Fibonacci, palindromes, factorials, digit extraction, and mathematical logic.', 'hash', '#06B6D4', 6),
(7, 1, 'patterns', 'Pattern Programming', 'Nested loop geometry: stars, triangles, pyramids, numbers, and Floyd patterns.', 'grid', '#F97316', 7),
(8, 1, 'arrays', 'Arrays', 'Fixed-size arrays, linear search, traversal, sorting, min/max, and in-place reversal.', 'align-justify', '#14B8A6', 8),
(9, 1, 'strings', 'Strings', 'Immutable strings, StringBuilder, character inspection, substrings, and palindromes.', 'type', '#6366F1', 9),
(10, 1, 'methods', 'Methods and Recursion', 'Function parameters, return types, method overloading, base cases, and call stacks.', 'code', '#3B82F6', 10),
(11, 1, 'oop', 'Object-Oriented Programming', 'Classes, objects, constructors, encapsulation, inheritance, and method overriding.', 'box', '#10B981', 11),
(12, 1, 'exceptions', 'Exception Handling', 'Try-catch blocks, throw, throws, finally, built-in and custom checked exceptions.', 'alert-triangle', '#EF4444', 12),
(13, 1, 'collections', 'Collections Basics', 'Dynamic collections: ArrayList, HashSet, HashMap, iterators, and generics.', 'layers', '#8B5CF6', 13),

-- DSA Track Categories (12 canonical topics matching MOCK_PROBLEMS)
(14, 2, 'dsa-arrays', 'Arrays', 'Array manipulation, prefix sums, two pointers, and in-place transformations.', 'align-justify', '#3B82F6', 1),
(15, 2, 'dsa-strings', 'Strings', 'String parsing, anagrams, palindromes, and substring patterns.', 'type', '#6366F1', 2),
(16, 2, 'dsa-hashing', 'Hashing', 'Hash tables, frequency maps, two-sum lookups, and counting sets.', 'database', '#EC4899', 3),
(17, 2, 'dsa-linked-lists', 'Linked Lists', 'Singly and doubly linked lists, reversals, and cycle detection.', 'git-commit', '#10B981', 4),
(18, 2, 'dsa-stacks-queues', 'Stacks and Queues', 'LIFO/FIFO structures, monotonic stacks, circular buffers, and sliding deques.', 'layers', '#F59E0B', 5),
(19, 2, 'dsa-binary-search', 'Binary Search', 'Logarithmic search on sorted intervals and answer boundaries.', 'search', '#3B82F6', 6),
(20, 2, 'dsa-recursion-backtracking', 'Recursion and Backtracking', 'Exhaustive state-space search, permutations, subsets, and N-Queens.', 'corner-down-right', '#F59E0B', 7),
(21, 2, 'dsa-trees', 'Trees', 'Binary trees, BST traversal, diameter, and path sum validations.', 'git-branch', '#14B8A6', 8),
(22, 2, 'dsa-heaps', 'Heaps and Priority Queues', 'Min/Max heaps, top-K frequent elements, and median stream processing.', 'sliders', '#F97316', 9),
(23, 2, 'dsa-graphs', 'Graphs', 'Graph traversal, BFS, DFS, shortest path, and topological sort.', 'share-2', '#8B5CF6', 10),
(24, 2, 'dsa-greedy', 'Greedy Algorithms', 'Locally optimal choice paradigms, interval scheduling, and jump games.', 'trending-up', '#06B6D4', 11),
(25, 2, 'dsa-dynamic-programming', 'Dynamic Programming', 'Optimal substructure, memoization, tabular knapsacks, and paths.', 'cpu', '#EF4444', 12)
ON DUPLICATE KEY UPDATE 
    name = VALUES(name), 
    description = VALUES(description),
    icon_name = VALUES(icon_name),
    accent_color = VALUES(accent_color),
    display_order = VALUES(display_order);

-- ----------------------------------------------------------------------------
-- 5. Standard Difficulties
-- ----------------------------------------------------------------------------
INSERT INTO difficulties (id, name, level_rank, color_hex) VALUES
(1, 'Easy', 1, '#10B981'),
(2, 'Medium', 2, '#F59E0B'),
(3, 'Hard', 3, '#EF4444')
ON DUPLICATE KEY UPDATE 
    name = VALUES(name), 
    level_rank = VALUES(level_rank), 
    color_hex = VALUES(color_hex);

-- ----------------------------------------------------------------------------
-- 6. Supported Programming Languages
-- ----------------------------------------------------------------------------
INSERT INTO languages (id, code, name, version, is_active, compiler_flags) VALUES
(1, 'java', 'Java 17 (OpenJDK)', '17.0.9', TRUE, '--enable-preview'),
(2, 'python', 'Python 3', '3.11.0', FALSE, NULL),
(3, 'cpp', 'C++ 20 (GCC)', '13.2.0', FALSE, '-std=c++20')
ON DUPLICATE KEY UPDATE 
    name = VALUES(name), 
    version = VALUES(version), 
    is_active = VALUES(is_active), 
    compiler_flags = VALUES(compiler_flags);

-- ----------------------------------------------------------------------------
-- 7. Submission Pipeline Lifecycle States
-- ----------------------------------------------------------------------------
INSERT INTO submission_statuses (id, code, description) VALUES
(1, 'QUEUED', 'Awaiting worker execution in queue'),
(2, 'COMPILING', 'Compiling source code with javac'),
(3, 'RUNNING', 'Executing against sandbox test suite'),
(4, 'COMPLETED', 'Execution and evaluation finished'),
(5, 'SYSTEM_ERROR', 'Judge environment or runtime container malfunction')
ON DUPLICATE KEY UPDATE 
    code = VALUES(code), 
    description = VALUES(description);

-- ----------------------------------------------------------------------------
-- 8. Grading Verdicts
-- ----------------------------------------------------------------------------
INSERT INTO submission_verdicts (id, code, name, description, is_success) VALUES
(1, 'PENDING', 'Pending Evaluation', 'Submission is currently being graded', FALSE),
(2, 'ACCEPTED', 'Accepted', 'Program produced expected output for all test cases within limits', TRUE),
(3, 'WRONG_ANSWER', 'Wrong Answer', 'Output differs from the expected solution', FALSE),
(4, 'TIME_LIMIT_EXCEEDED', 'Time Limit Exceeded', 'Program exceeded execution time ceiling', FALSE),
(5, 'MEMORY_LIMIT_EXCEEDED', 'Memory Limit Exceeded', 'Program exceeded allocated heap limit', FALSE),
(6, 'COMPILATION_ERROR', 'Compilation Error', 'Program failed javac compilation', FALSE),
(7, 'RUNTIME_ERROR', 'Runtime Error', 'Program threw an unhandled exception or terminated non-zero', FALSE)
ON DUPLICATE KEY UPDATE 
    code = VALUES(code), 
    name = VALUES(name), 
    description = VALUES(description), 
    is_success = VALUES(is_success);

-- ----------------------------------------------------------------------------
-- 9. Roadmap Tiers / Levels
-- ----------------------------------------------------------------------------
INSERT INTO roadmap_levels (id, slug, title, badge, description, display_order) VALUES
(1, 'fundamentals', 'Level 1: Java Fundamentals', 'Beginner Foundations', 'Master core syntax, primitive types, operator precedence, I/O streams, control flow, loops, and fundamental mathematical programming.', 1),
(2, 'core-java', 'Level 2: Core Java Programming', 'Object-Oriented Architecture', 'Master arrays, strings, methods, recursion, classes, inheritance, polymorphism, interfaces, exceptions, and Java Collections.', 2),
(3, 'dsa', 'Level 3: Data Structures & Algorithms', 'Algorithmic Mastery', 'Master algorithmic complexity, linear data structures, trees, graphs, sorting, searching, hashing, dynamic programming, and interview patterns.', 3)
ON DUPLICATE KEY UPDATE 
    slug = VALUES(slug), 
    title = VALUES(title), 
    badge = VALUES(badge), 
    description = VALUES(description), 
    display_order = VALUES(display_order);

SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
