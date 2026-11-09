# CodeArena — Database Architecture & Design Specification

## 1. System Overview & Architectural Vision

CodeArena is a dual-track Java coding and competitive learning platform supporting beginner Java programming challenges, advanced Data Structures & Algorithms (DSA), a guided 30-milestone learning roadmap, interactive algorithmic animations, and competitive contests.

This database architecture provides a normalized, high-performance relational foundation in **MySQL 8.0+** using the **InnoDB** storage engine with strict **`utf8mb4`** Unicode encoding (`utf8mb4_0900_ai_ci`).

---

## 2. Core Architectural Principles

### 2.1 Relational Normalization & Identity Strategy
- **Surrogate Primary Keys**: All core entity tables utilize unsigned auto-incrementing integer or 64-bit integer (`BIGINT UNSIGNED AUTO_INCREMENT`) primary keys to optimize B-Tree index traversal, clustered index compactness, and JDBC/ORM primary-key lookup performance.
- **Natural / Canonical Key Preservation**: Real-world identifiers present in the client applications (e.g., `'two-sum'`, `'hello-world'`, `'intro-to-java'`, username, email) are maintained as immutable `VARCHAR` natural keys with strict `UNIQUE` constraints.
- **Third Normal Form (3NF)**: Redundancy is minimized across domains. Junction tables (`roadmap_prerequisites`, `roadmap_topic_problems`, `problem_tag_mappings`, `contest_problems`, `contest_registrations`) decouple many-to-many associations.
- **Deliberate Denormalization**: Aggregate metrics like `test_cases_passed` and `test_cases_total` in `submissions` are stored directly alongside the parent record to eliminate expensive aggregation queries across millions of test-case results during high-throughput judging bursts.

### 2.2 Concurrency & Storage Engine
- **Engine**: Exclusively **InnoDB**, providing ACID compliance, row-level locking, foreign key enforcement, and crash recovery.
- **Charset & Collation**: `utf8mb4` with `utf8mb4_0900_ai_ci`. Guarantees full support for multi-byte Unicode (including technical notation, foreign character sets, and math symbols).

### 2.3 Strict Separation of Execution Modes
- The `submissions.is_preview` boolean flag strictly separates client-side simulated preview test runs from genuine backend OpenJDK 17 judge executions.
- Public sample test cases (`is_sample = TRUE`) are decoupled from hidden judge evaluation test cases (`is_sample = FALSE`).

---

## 3. Domain Model Architecture

The 32 relational tables are organized into 7 distinct functional domains plus migration metadata:

```
+------------------------------------------------------------------------------------+
|                                 CODEARENA DATABASE                                  |
+------------------------------------------------------------------------------------+
|  1. Security & Identity      |  2. Problem Catalog         |  3. Submissions & Judge|
|     - roles                  |     - tracks                |     - submission_status|
|     - account_statuses       |     - categories            |     - submission_verdict
|     - users                  |     - difficulties          |     - submissions      |
|     - user_profiles          |     - languages             |     - submission_tests |
|     - user_oauth_accounts    |     - problems              |                        |
|                              |     - problem_hints         |                        |
|                              |     - problem_test_cases    |                        |
|                              |     - problem_tags          |                        |
|                              |     - problem_tag_mappings  |                        |
+------------------------------+-----------------------------+------------------------+
|  4. Learning & Roadmap       |  5. User Activity & IDE     |  6. Contests & Tourneys|
|     - roadmap_levels         |     - user_bookmarks        |     - contests         |
|     - roadmap_topics         |     - user_preferences      |     - contest_problems |
|     - roadmap_prerequisites  |     - user_recently_viewed  |     - contest_regists  |
|     - roadmap_topic_problems |                             |     - contest_submits  |
|     - user_topic_progress    |                             |                        |
+------------------------------+-----------------------------+------------------------+
|  7. AI Assistant Support     |  0. Migration Tracker                                |
|     - ai_conversations       |     - schema_migrations                              |
|     - ai_messages            |                                                      |
+------------------------------------------------------------------------------------+
```

---

## 4. Security & Cryptographic Standards

1. **Password Storage**: Plaintext passwords are NEVER accepted or stored. The `users.password_hash` column is sized at `VARCHAR(255)` to support BCrypt (cost factor $\ge 12$) or Argon2id.
2. **Access Control**: Roles (`STUDENT`, `INSTRUCTOR`, `ADMIN`) provide a foundation for role-based authorization in future backend filters.
3. **Cascading Safety**:
   - Critical audit and core problem records use `ON DELETE RESTRICT` (e.g. deleting a problem will not silently erase submissions or categories).
   - User-owned volatile preferences, profiles, and bookmarks use `ON DELETE CASCADE` to support GDPR-compliant right-to-erasure account purges.

---

## 5. Indexing Strategy & Query Optimization

- **Composite Indexes**:
  - `(user_id, problem_id)` on `submissions` for fast student history lookups.
  - `(problem_id, verdict_id)` on `submissions` for acceptance rate calculations.
  - `(track_id, difficulty_id)` on `problems` for instant catalog filtering.
  - `(start_time, end_time, status)` on `contests` for active tournament scheduling.
- **Prefix Matching & Slug Lookups**:
  - All natural slugs (`canonical_id`, `slug`, `username`, `email`) have individual unique indexes.

