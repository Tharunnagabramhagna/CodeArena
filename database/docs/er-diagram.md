# CodeArena — Entity Relationship Diagram (ERD)

This document visualizes the complete entity-relationship model of CodeArena.

## Conceptual Diagram

```mermaid
erDiagram
    ROLES ||--o{ USERS : "assigned to"
    ACCOUNT_STATUSES ||--o{ USERS : "categorizes"
    USERS ||--|| USER_PROFILES : "extends"
    USERS ||--|| USER_PREFERENCES : "configures"
    USERS ||--o{ USER_OAUTH_ACCOUNTS : "authenticates via"
    USERS ||--o{ USER_BOOKMARKS : "saves"
    USERS ||--o{ USER_RECENTLY_VIEWED : "browses"
    USERS ||--o{ SUBMISSIONS : "authors"
    USERS ||--o{ USER_TOPIC_PROGRESS : "tracks"
    USERS ||--o{ CONTEST_REGISTRATIONS : "enters"
    USERS ||--o{ AI_CONVERSATIONS : "initiates"

    TRACKS ||--o{ CATEGORIES : "contains"
    CATEGORIES ||--o{ PROBLEMS : "classifies"
    DIFFICULTIES ||--o{ PROBLEMS : "rates"
    PROBLEMS ||--o{ PROBLEM_HINTS : "provides"
    PROBLEMS ||--o{ PROBLEM_TEST_CASES : "evaluates"
    PROBLEMS ||--o{ PROBLEM_TAG_MAPPINGS : "tagged by"
    PROBLEM_TAGS ||--o{ PROBLEM_TAG_MAPPINGS : "associates"

    LANGUAGES ||--o{ SUBMISSIONS : "compiles in"
    SUBMISSION_STATUSES ||--o{ SUBMISSIONS : "monitors"
    SUBMISSION_VERDICTS ||--o{ SUBMISSIONS : "grades"
    PROBLEMS ||--o{ SUBMISSIONS : "receives"
    SUBMISSIONS ||--o{ SUBMISSION_TEST_CASE_RESULTS : "details"
    PROBLEM_TEST_CASES ||--o{ SUBMISSION_TEST_CASE_RESULTS : "tested against"

    ROADMAP_LEVELS ||--o{ ROADMAP_TOPICS : "structures"
    ROADMAP_TOPICS ||--o{ ROADMAP_PREREQUISITES : "requires"
    ROADMAP_TOPICS ||--o{ ROADMAP_TOPIC_PROBLEMS : "curates"
    PROBLEMS ||--o{ ROADMAP_TOPIC_PROBLEMS : "mapped in"
    ROADMAP_TOPICS ||--o{ USER_TOPIC_PROGRESS : "recorded in"

    CONTESTS ||--o{ CONTEST_PROBLEMS : "includes"
    PROBLEMS ||--o{ CONTEST_PROBLEMS : "featured in"
    CONTESTS ||--o{ CONTEST_REGISTRATIONS : "lists"
    CONTESTS ||--o{ CONTEST_SUBMISSIONS : "scores"
    SUBMISSIONS ||--|| CONTEST_SUBMISSIONS : "qualifies"

    AI_CONVERSATIONS ||--o{ AI_MESSAGES : "contains"
    PROBLEMS ||--o{ AI_CONVERSATIONS : "contextualizes"
```

---

## Detailed Physical Relational Mapping

```mermaid
classDiagram
    direction TB
    class users {
        +BIGINT id PK
        +VARCHAR username UK
        +VARCHAR email UK
        +VARCHAR password_hash
        +INT role_id FK
        +INT status_id FK
        +BOOLEAN is_verified
        +DATETIME created_at
        +DATETIME updated_at
        +DATETIME last_login_at
    }

    class problems {
        +BIGINT id PK
        +INT track_id FK
        +INT category_id FK
        +INT difficulty_id FK
        +VARCHAR canonical_id UK
        +VARCHAR slug UK
        +INT problem_number UK
        +VARCHAR title
        +MEDIUMTEXT description
        +TEXT input_format
        +TEXT output_format
        +TEXT constraints
        +TEXT explanation
        +MEDIUMTEXT starter_code
        +BOOLEAN is_premium
        +BOOLEAN is_active
        +INT time_limit_ms
        +INT memory_limit_mb
    }

    class submissions {
        +BIGINT id PK
        +VARCHAR submission_uid UK
        +BIGINT user_id FK
        +BIGINT problem_id FK
        +INT language_id FK
        +INT status_id FK
        +INT verdict_id FK
        +MEDIUMTEXT source_code
        +BOOLEAN is_preview
        +INT execution_time_ms
        +INT memory_used_kb
        +INT test_cases_passed
        +INT test_cases_total
        +DATETIME submitted_at
        +DATETIME judged_at
    }

    class roadmap_topics {
        +BIGINT id PK
        +VARCHAR slug UK
        +INT level_id FK
        +INT sequence_order
        +VARCHAR title
        +DECIMAL estimated_hours
        +TEXT summary
        +JSON core_concepts
        +MEDIUMTEXT code_example
    }

    class user_bookmarks {
        +BIGINT id PK
        +BIGINT user_id FK
        +BIGINT problem_id FK
        +VARCHAR notes
        +DATETIME created_at
    }

    users "1" --> "*" submissions : authors
    problems "1" --> "*" submissions : tests
    users "1" --> "*" user_bookmarks : saves
    problems "1" --> "*" user_bookmarks : target
    problems "*" --> "1" roadmap_topics : links
```

