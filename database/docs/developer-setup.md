# CodeArena — Database Developer Setup Guide

This guide describes how to install, initialize, migrate, seed, and verify the CodeArena MySQL 8.0 database environment.

---

## 1. Prerequisites

- **MySQL Server**: Version 8.0.28 or later (Tested on MySQL Community Server 8.0.46 Win64 / Linux x86_64).
- **Default Port**: 3306.
- **Python**: 3.8+ (Used for offline schema validation).
- **Node.js**: 18+ (Optional, used if re-generating seeds from canonical data).

---

## 2. Quickstart: Automated Setup

### Step 2.1 — Run Schema Migrations in Sequence

Execute `001_initial_schema.sql` to create `codearena_db`, foundational 32 tables, foreign keys, and indexes, followed by `002_user_oauth_accounts.sql` for OAuth account linking:

```bash
# 1. Baseline Migration (32 tables)
mysql -u root -p < database/migrations/001_initial_schema.sql

# 2. OAuth Feature Migration (33rd table: user_oauth_accounts)
mysql -u root -p codearena_db < database/migrations/002_user_oauth_accounts.sql
```

*(Enter your MySQL root password when prompted)*

### Step 2.2 — Load Canonical Seed Data

Load the seeds in sequential order:

```bash
# 1. Reference Data (Roles, Statuses, Tracks, Categories, Difficulties, Languages, Levels)
mysql -u root -p codearena_db < database/seeds/01_reference_data.sql

# 2. 50 Canonical Basic Java Problems & Sample Test Cases
mysql -u root -p codearena_db < database/seeds/02_basic_problems_seed.sql

# 3. 200 Canonical DSA Problems, 600 Hints, Sample Test Cases & Tags
mysql -u root -p codearena_db < database/seeds/03_dsa_problems_seed.sql

# 4. 30 Guided Roadmap Topics, Prerequisite DAG Edges & Problem Links
mysql -u root -p codearena_db < database/seeds/04_roadmap_seed.sql

# 5. (Development Only) Dev Test Accounts, Profiles, Preferences & Sample Submissions
mysql -u root -p codearena_db < database/seeds/05_dev_sample_data.sql
```

---

## 3. Alternative: Step-by-Step Manual Schema Setup

If you prefer applying schemas individually from `database/schema/`:

```bash
mysql -u root -p < database/schema/01_create_database.sql
mysql -u root -p codearena_db < database/schema/02_users.sql
mysql -u root -p codearena_db < database/schema/03_problems.sql
mysql -u root -p codearena_db < database/schema/04_submissions.sql
mysql -u root -p codearena_db < database/schema/05_learning.sql
mysql -u root -p codearena_db < database/schema/06_user_activity.sql
mysql -u root -p codearena_db < database/schema/07_contests.sql
mysql -u root -p codearena_db < database/schema/08_ai_assistant.sql
```

---

## 4. Verification & Testing

### 4.1 Offline Structural Integrity Linter (Zero Credentials Required)

Run the Python verification test suite to validate all 32 tables, 40 foreign key references, and seed structures:

```bash
python database/tests/verify_schema_syntax.py
```

Expected output:
```
============================================================
 AUDIT RESULTS SUMMARY
============================================================
Warnings: 0

STATUS: ALL INTEGRITY CHECKS PASSED SUCCESSFULLY (24/24 Tables Validated).
```

### 4.2 Live MySQL Integration Test Suite

Once MySQL credentials are provided, run the live test suite to verify primary keys, foreign key rejections, check constraints, and cascading deletes:

```bash
mysql -u root -p codearena_db < database/tests/test_schema_mysql.sql
```

Expected output:
```
PASS: Core tables present (Found: 32 tables)
PASS: Duplicate email constraint successfully rejected
PASS: Foreign key rejection on invalid role_id verified
PASS: Composite uniqueness on user_bookmarks (user_id, problem_id) verified
PASS: Check constraint chk_prereq_no_self prevented self-prerequisite
PASS: ON DELETE CASCADE from users to user_profiles verified
```

---

## 5. Inspecting the Database

### 5.1 Using MySQL CLI

```sql
USE codearena_db;

-- Check problems count per track
SELECT t.name AS track, COUNT(p.id) AS total_problems
FROM tracks t
LEFT JOIN problems p ON p.track_id = t.id
GROUP BY t.id, t.name;

-- Verify 30 roadmap topics and prerequisite counts
SELECT rt.sequence_order, rt.title, COUNT(rp.prerequisite_topic_id) AS prereq_count
FROM roadmap_topics rt
LEFT JOIN roadmap_prerequisites rp ON rp.topic_id = rt.id
GROUP BY rt.id, rt.sequence_order, rt.title
ORDER BY rt.sequence_order ASC
LIMIT 10;
```

### 5.2 Connecting with GUI Tools
- **Host**: `127.0.0.1`
- **Port**: `3306`
- **Database**: `codearena_db`
- **Username**: `root` (or application user)
- **SSL**: Optional for local development

---

## 6. TiDB Cloud Serverless Setup & Deployment

CodeArena is fully compatible with **TiDB Cloud Starter / Serverless** (`8.0.11-TiDB-v8.5.3-serverless`).

### 6.1 Cluster & Database Specifications
- **Cluster**: `codearena-db`
- **Database**: `codearena_db`
- **Port**: `4000`
- **SSL/TLS**: Required (`--ssl-mode=VERIFY_IDENTITY`)

### 6.2 Turnkey Deployment via TiDB Cloud SQL Editor
1. In the TiDB Cloud Console, open the **SQL Editor** for cluster `codearena-db`.
2. Select database `codearena_db`.
3. Open and execute [`database/tidb/deploy_tidb_cloud.sql`](../tidb/deploy_tidb_cloud.sql) to initialize all 33 tables, OAuth accounts, and all 5 canonical seed datasets (reference data, 50 basic problems, 200 DSA problems + 600 hints, 520 test cases, 30 roadmap topics, and test fixtures).
4. Execute [`database/tests/test_schema_tidb.sql`](../tests/test_schema_tidb.sql) to audit the live cluster (zero stored procedures, 100% TiDB-compatible).

### 6.3 Deployment via MySQL CLI over TLS
```bash
export MYSQL_PWD="your_tidb_cloud_password"

# 1. Deploy schema and reference data
mysql -h gateway01.your-region.prod.aws.tidbcloud.com \
      -P 4000 \
      -u 'your_prefix.root' \
      --ssl-mode=VERIFY_IDENTITY \
      --default-character-set=utf8mb4 \
      codearena_db < database/tidb/deploy_tidb_cloud.sql

# 2. Run declarative TiDB validation test suite
mysql -h gateway01.your-region.prod.aws.tidbcloud.com \
      -P 4000 \
      -u 'your_prefix.root' \
      --ssl-mode=VERIFY_IDENTITY \
      --default-character-set=utf8mb4 \
      codearena_db < database/tests/test_schema_tidb.sql
```

### 6.4 Offline TiDB Compatibility Verification
Run the offline TiDB compatibility audit tool to verify DDL, collations, and constraint syntax without connecting to the cloud:
```bash
python database/tests/verify_tidb_compatibility.py
```

For complete technical specifications, review [**TiDB Cloud Compatibility Audit**](tidb-cloud-compatibility-audit.md).


