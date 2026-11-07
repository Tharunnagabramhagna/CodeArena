# CodeArena — Complete Data Dictionary

This document details every table, column, data type, constraint, default, and business rule within the CodeArena database.

---

## 1. Domain: Schema Versioning

### `schema_migrations`
Tracks applied database migrations to guarantee reproducible execution.

| Column | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `version` | `VARCHAR(50)` | NO | None | PRIMARY KEY | Unique version identifier (e.g. `001_initial_schema`) |
| `name` | `VARCHAR(150)` | NO | None | | Descriptive name of the migration |
| `applied_at` | `DATETIME(3)` | NO | `CURRENT_TIMESTAMP(3)` | | High-precision timestamp when migration ran |
| `checksum` | `VARCHAR(64)` | NO | None | | SHA-256 hash of the migration file |
| `execution_time_ms` | `INT UNSIGNED` | NO | None | | Duration of script execution in milliseconds |

---

## 2. Domain: Security & User Management

### `roles`
System access control levels.

| Column | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `INT UNSIGNED` | NO | Auto | PRIMARY KEY | Role identifier |
| `name` | `VARCHAR(50)` | NO | None | UNIQUE | Role title (`STUDENT`, `INSTRUCTOR`, `ADMIN`) |
| `description` | `VARCHAR(255)` | YES | NULL | | Human-readable explanation of privileges |
| `created_at` | `DATETIME` | NO | `CURRENT_TIMESTAMP` | | Creation timestamp |

### `account_statuses`
User account lifecycle states.

| Column | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `INT UNSIGNED` | NO | Auto | PRIMARY KEY | Status identifier |
| `code` | `VARCHAR(50)` | NO | None | UNIQUE | State code (`ACTIVE`, `PENDING_VERIFICATION`, `SUSPENDED`, `DEACTIVATED`) |
| `description` | `VARCHAR(255)` | YES | NULL | | State description |
| `created_at` | `DATETIME` | NO | `CURRENT_TIMESTAMP` | | Creation timestamp |

### `users`
Core user identity and authentication credentials.

| Column | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | NO | Auto | PRIMARY KEY | Unique user surrogate ID |
| `username` | `VARCHAR(50)` | NO | None | UNIQUE | Alphanumeric handle |
| `email` | `VARCHAR(255)` | NO | None | UNIQUE | Electronic mail address |
| `password_hash` | `VARCHAR(255)` | NO | None | | BCrypt or Argon2id cryptographic hash (never plaintext) |
| `role_id` | `INT UNSIGNED` | NO | `1` | FK -> `roles(id)` | Authorization role |
| `status_id` | `INT UNSIGNED` | NO | `1` | FK -> `account_statuses(id)` | Account lifecycle state |
| `is_verified` | `BOOLEAN` | NO | `FALSE` | | Email verification flag |
| `created_at` | `DATETIME` | NO | `CURRENT_TIMESTAMP` | INDEX | Timestamp of account registration |
| `updated_at` | `DATETIME` | NO | `CURRENT_TIMESTAMP` | | Auto-updated on row change |
| `last_login_at` | `DATETIME` | YES | NULL | | Timestamp of most recent authentication |

### `user_profiles`
Extended profile information and gamification points.

| Column | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `user_id` | `BIGINT UNSIGNED` | NO | None | PRIMARY KEY, FK -> `users(id)` ON DELETE CASCADE | 1-to-1 link to user account |
| `full_name` | `VARCHAR(100)` | YES | NULL | | Student or mentor display name |
| `avatar_url` | `VARCHAR(512)` | YES | NULL | | Profile avatar image link |
| `bio` | `TEXT` | YES | NULL | | User bio or university affiliation |
| `github_username` | `VARCHAR(100)` | YES | NULL | | GitHub public profile |
| `linkedin_url` | `VARCHAR(255)` | YES | NULL | | LinkedIn profile URL |
| `preferred_track` | `ENUM('basic','dsa')` | NO | `'basic'` | | Default practice track |
| `reputation_points` | `INT UNSIGNED` | NO | `0` | | Gamified problem-solving points |
| `created_at` | `DATETIME` | NO | `CURRENT_TIMESTAMP` | | Creation timestamp |
| `updated_at` | `DATETIME` | NO | `CURRENT_TIMESTAMP` | | Auto-updated timestamp |

### `user_oauth_accounts`
External OAuth identity provider associations (Google, Facebook).

| Column | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | NO | Auto | PRIMARY KEY | Surrogate identifier |
| `user_id` | `BIGINT UNSIGNED` | NO | None | FK -> `users(id)` ON DELETE CASCADE | Associated CodeArena account |
| `provider` | `ENUM('GOOGLE','FACEBOOK')` | NO | None | | External identity provider |
| `provider_user_id` | `VARCHAR(255)` | NO | None | UNIQUE composite (`provider`, `provider_user_id`) | Stable subject ID from provider |
| `provider_email` | `VARCHAR(255)` | YES | NULL | INDEX (`provider`, `provider_email`) | Email returned by provider claim |
| `email_verified` | `BOOLEAN` | NO | `FALSE` | | Email verification status assertion |
| `created_at` | `DATETIME` | NO | `CURRENT_TIMESTAMP` | | Linked timestamp |
| `updated_at` | `DATETIME` | NO | `CURRENT_TIMESTAMP` | | Auto-updated timestamp |

---

## 3. Domain: Problem Management & Catalog

### `tracks`
Primary learning tracks (Basic Java vs DSA).

| Column | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `INT UNSIGNED` | NO | Auto | PRIMARY KEY | Track identifier |
| `slug` | `VARCHAR(32)` | NO | None | UNIQUE | Identifier slug (`basic`, `dsa`) |
| `name` | `VARCHAR(100)` | NO | None | | Display name |
| `description` | `TEXT` | YES | NULL | | Curriculum summary |
| `is_active` | `BOOLEAN` | NO | `TRUE` | | Track visibility toggle |
| `display_order` | `INT UNSIGNED` | NO | `1` | | Sorting order on practice hub |
| `created_at` | `DATETIME` | NO | `CURRENT_TIMESTAMP` | | Creation timestamp |

### `categories`
Sub-topic modules within tracks (Loops, Arrays, Linked Lists, etc.).

| Column | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `INT UNSIGNED` | NO | Auto | PRIMARY KEY | Category identifier |
| `track_id` | `INT UNSIGNED` | NO | None | FK -> `tracks(id)` | Parent track |
| `slug` | `VARCHAR(64)` | NO | None | UNIQUE | Category URL slug |
| `name` | `VARCHAR(100)` | NO | None | | Category display title |
| `description` | `TEXT` | YES | NULL | | Pedagogical description |
| `icon_name` | `VARCHAR(50)` | NO | `'terminal'` | | Vector icon name |
| `accent_color` | `VARCHAR(30)` | YES | NULL | | Color token hex code |
| `display_order` | `INT UNSIGNED` | NO | `1` | | Sorting sequence |
| `created_at` | `DATETIME` | NO | `CURRENT_TIMESTAMP` | | Creation timestamp |

### `difficulties`
Standard problem difficulty classifications.

| Column | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `INT UNSIGNED` | NO | Auto | PRIMARY KEY | Difficulty identifier |
| `name` | `VARCHAR(20)` | NO | None | UNIQUE | Difficulty label (`Easy`, `Medium`, `Hard`) |
| `level_rank` | `TINYINT UNSIGNED` | NO | None | UNIQUE | Ordinal level (`1`, `2`, `3`) |
| `color_hex` | `VARCHAR(20)` | NO | None | | UI badge color hex |

### `languages`
Execution runtime targets.

| Column | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `INT UNSIGNED` | NO | Auto | PRIMARY KEY | Language identifier |
| `code` | `VARCHAR(32)` | NO | None | UNIQUE | Short language code (`java`, `python`, `cpp`) |
| `name` | `VARCHAR(64)` | NO | None | | Display name (`Java 17 (OpenJDK)`) |
| `version` | `VARCHAR(32)` | NO | None | | Runtime compiler version |
| `is_active` | `BOOLEAN` | NO | `TRUE` | | Available for execution |
| `compiler_flags` | `VARCHAR(255)` | YES | NULL | | Sandbox compilation flags |
| `created_at` | `DATETIME` | NO | `CURRENT_TIMESTAMP` | | Creation timestamp |

### `problems`
Central problem definitions across both Basic and DSA tracks.

| Column | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | NO | Auto | PRIMARY KEY | Problem surrogate identifier |
| `track_id` | `INT UNSIGNED` | NO | None | FK -> `tracks(id)` | Parent track |
| `category_id` | `INT UNSIGNED` | NO | None | FK -> `categories(id)` | Problem category |
| `difficulty_id` | `INT UNSIGNED` | NO | None | FK -> `difficulties(id)` | Difficulty tier |
| `canonical_id` | `VARCHAR(100)` | NO | None | UNIQUE | Canonical frontend ID (`hello-world`, `find-pivot-index`) |
| `slug` | `VARCHAR(120)` | NO | None | UNIQUE | URL routing slug |
| `problem_number` | `INT UNSIGNED` | NO | None | UNIQUE | Catalog number (1..50 basic, 101..300 DSA) |
| `title` | `VARCHAR(200)` | NO | None | | Problem title |
| `description` | `MEDIUMTEXT` | NO | None | | Complete problem description (HTML/Markdown) |
| `input_format` | `TEXT` | YES | NULL | | Input specifications |
| `output_format` | `TEXT` | YES | NULL | | Output specifications |
| `constraints` | `TEXT` | YES | NULL | | Problem constraints |
| `explanation` | `TEXT` | YES | NULL | | Walkthrough and explanation |
| `starter_code` | `MEDIUMTEXT` | YES | NULL | | Boilerplate editor starter template |
| `is_premium` | `BOOLEAN` | NO | `FALSE` | | Pro subscription requirement |
| `is_active` | `BOOLEAN` | NO | `TRUE` | | Availability toggle |
| `time_limit_ms` | `INT UNSIGNED` | NO | `2000` | | CPU execution timeout in milliseconds |
| `memory_limit_mb` | `INT UNSIGNED` | NO | `256` | | Memory ceiling in megabytes |
| `created_at` | `DATETIME` | NO | `CURRENT_TIMESTAMP` | | Creation timestamp |
| `updated_at` | `DATETIME` | NO | `CURRENT_TIMESTAMP` | | Modification timestamp |

### `problem_hints`
Progressive 3-tier hints for guided solving.

| Column | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | NO | Auto | PRIMARY KEY | Hint identifier |
| `problem_id` | `BIGINT UNSIGNED` | NO | None | FK -> `problems(id)` ON DELETE CASCADE | Associated problem |
| `hint_level` | `TINYINT UNSIGNED` | NO | None | UNIQUE composite (`problem_id`, `hint_level`) | 1=Conceptual, 2=Approach, 3=Optimal Implementation |
| `hint_text` | `TEXT` | NO | None | | Pedagogical hint contents |
| `created_at` | `DATETIME` | NO | `CURRENT_TIMESTAMP` | | Creation timestamp |

### `problem_test_cases`
Test suites with strict isolation between sample UI cases and secret judge cases.

| Column | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | NO | Auto | PRIMARY KEY | Test case identifier |
| `problem_id` | `BIGINT UNSIGNED` | NO | None | FK -> `problems(id)` ON DELETE CASCADE | Associated problem |
| `is_sample` | `BOOLEAN` | NO | `FALSE` | INDEX (`problem_id`, `is_sample`) | `TRUE` = public sample case; `FALSE` = secret judge case |
| `input_data` | `MEDIUMTEXT` | NO | None | | Standard input stream |
| `expected_output` | `MEDIUMTEXT` | NO | None | | Expected standard output |
| `explanation` | `TEXT` | YES | NULL | | Explanation for sample cases |
| `display_order` | `INT UNSIGNED` | NO | `1` | | Display order in UI |
| `is_active` | `BOOLEAN` | NO | `TRUE` | | Active for evaluation |
| `created_at` | `DATETIME` | NO | `CURRENT_TIMESTAMP` | | Creation timestamp |

### `problem_tags` & `problem_tag_mappings`
Algorithmic pattern and concept tags.

| Table | Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `problem_tags` | `id` | `INT UNSIGNED` | PRIMARY KEY | Tag identifier |
| `problem_tags` | `name` | `VARCHAR(64)` | UNIQUE | Display name (e.g. `Two Pointers`) |
| `problem_tags` | `slug` | `VARCHAR(64)` | UNIQUE | URL slug (`two-pointers`) |
| `problem_tag_mappings` | `problem_id` | `BIGINT UNSIGNED` | PK, FK -> `problems(id)` ON DELETE CASCADE | Mapped problem |
| `problem_tag_mappings` | `tag_id` | `INT UNSIGNED` | PK, FK -> `problem_tags(id)` ON DELETE CASCADE | Mapped tag |

---

## 4. Domain: Submissions & Judging

### `submissions`
All user code submissions and grading verdicts.

| Column | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | NO | Auto | PRIMARY KEY | Submission identifier |
| `submission_uid` | `VARCHAR(64)` | NO | None | UNIQUE | Public API UUID/NanoID |
| `user_id` | `BIGINT UNSIGNED` | NO | None | FK -> `users(id)` ON DELETE CASCADE | Author |
| `problem_id` | `BIGINT UNSIGNED` | NO | None | FK -> `problems(id)` ON DELETE RESTRICT | Problem solved |
| `language_id` | `INT UNSIGNED` | NO | None | FK -> `languages(id)` ON DELETE RESTRICT | Language used |
| `status_id` | `INT UNSIGNED` | NO | None | FK -> `submission_statuses(id)` | Execution status |
| `verdict_id` | `INT UNSIGNED` | NO | None | FK -> `submission_verdicts(id)` | Grading outcome |
| `source_code` | `MEDIUMTEXT` | NO | None | | Student source code |
| `is_preview` | `BOOLEAN` | NO | `FALSE` | INDEX | **CRITICAL: Distinguishes client-side preview runs from genuine remote judge runs** |
| `execution_time_ms` | `INT UNSIGNED` | YES | NULL | | Peak execution time in ms |
| `memory_used_kb` | `INT UNSIGNED` | YES | NULL | | Peak memory consumed in KB |
| `test_cases_passed` | `INT UNSIGNED` | NO | `0` | | Count of passed cases |
| `test_cases_total` | `INT UNSIGNED` | NO | `0` | | Total test cases in evaluation |
| `compiler_output` | `MEDIUMTEXT` | YES | NULL | | Compiler diagnostics or errors |
| `runtime_error_log` | `TEXT` | YES | NULL | | Runtime stack trace |
| `submitted_at` | `DATETIME(3)` | NO | `CURRENT_TIMESTAMP(3)` | INDEX | Submission timestamp |
| `judged_at` | `DATETIME(3)` | YES | NULL | | Judging completion timestamp |

---

## 5. Domain: Learning System & Roadmap

- `roadmap_levels`: 3 mastery tiers (`fundamentals`, `core-java`, `dsa`).
- `roadmap_topics`: 30 sequential curriculum milestones with learning objectives and code examples.
- `roadmap_prerequisites`: Directed Acyclic Graph edges enforcing prerequisites without self-loops (`chk_prereq_no_self`).
- `roadmap_topic_problems`: Junction linking problems to roadmap milestones.
- `user_topic_progress`: Tracks student progress (`NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`).

---

## 6. Domain: User Activity, Contests & AI Assistant

- `user_bookmarks`: Composite unique `(user_id, problem_id)` preventing duplicate bookmarks.
- `user_preferences`: Theme, font size, tab width, vim/default keymaps.
- `user_recently_viewed`: Recent problems viewed on dashboard.
- `contests`, `contest_problems`, `contest_registrations`, `contest_submissions`: Competitive coding tournaments, letter designations (A, B, C, D), ICPC penalty scoring.
- `ai_conversations`, `ai_messages`: AI tutor chat persistence, problem context, prompt/completion token tracking.

