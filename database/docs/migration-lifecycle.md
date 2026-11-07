# CodeArena — Migration Architecture & Lifecycle Guide

## 1. Canonical Source of Truth

To eliminate ambiguity between modular domain schemas and versioned deployment migrations, the CodeArena architecture establishes a strict hierarchy:

- **Primary Runtime Source of Truth**: Sequential versioned migrations in [`database/migrations/`](file:///c:/CodeArena/database/migrations).
  - [`001_initial_schema.sql`](file:///c:/CodeArena/database/migrations/001_initial_schema.sql): Provisions the foundational 32 tables, core relationships, indexes, and initial system state.
  - [`002_user_oauth_accounts.sql`](file:///c:/CodeArena/database/migrations/002_user_oauth_accounts.sql): Forward migration adding external OAuth account linking for Google and Facebook (bringing total schema to 33 tables and 41 foreign keys).
  - Each migration records its version, descriptive name, execution timestamp, and SHA-256 checksum in the `schema_migrations` tracking table.
- **Architectural Reference Blueprints**: [`database/schema/*.sql`](file:///c:/CodeArena/database/schema).
  - These files provide modular domain-driven reference definitions for the 7 architectural domains.
  - They are maintained in exact parity with the accumulated migrations.

---

## 2. Technical Reality: MySQL DDL Implicit Commits & Immutability

### 2.1 Why Migrations Must Remain Immutable
Once a migration script has been published, tested, or executed in any environment (CI/CD, staging, developer machines), **it must never be modified retrospectively**. 
- Retroactively modifying `001_initial_schema.sql` creates database drift: machines that ran `001` previously will not have the new tables unless dropped and recreated.
- Future schema evolutions must always be implemented as **new sequential migrations** (e.g. `002_user_oauth_accounts.sql`).

### 2.2 MySQL DDL Implicit Commits
Unlike databases that support transactional DDL (such as PostgreSQL), **MySQL 8.0 automatically executes an implicit commit before and after every DDL statement** (`CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`, `CREATE INDEX`, etc.).

> [!WARNING]
> In MySQL, multi-table DDL migrations are **NOT transactionally atomic**. If an error occurs on statement 20 of a migration script, statements 1 through 19 remain permanently committed in the database and will NOT be rolled back.

### 2.3 CodeArena's Idempotent Design Strategy
Because MySQL DDL cannot be rolled back transactionally, CodeArena achieves migration reliability through **structural idempotency**:
1. All table creation statements strictly utilize `CREATE TABLE IF NOT EXISTS`.
2. All foreign key constraints and indexes are declared within their respective `CREATE TABLE` blocks.
3. Reference data and seeds utilize `ON DUPLICATE KEY UPDATE` or `INSERT IGNORE`.
4. Migration completion logging in `schema_migrations` is executed as the **final operation** in each migration script.

---

## 3. Migration Execution Sequence

### 3.1 Fresh Database Initialization
For a brand new environment, migrations are applied in numeric sequence:

```bash
# 1. Baseline Migration: Creates codearena_db, 32 core tables, schema_migrations
mysql -u root -p < database/migrations/001_initial_schema.sql

# 2. OAuth Feature Migration: Creates user_oauth_accounts table (33rd table)
mysql -u root -p codearena_db < database/migrations/002_user_oauth_accounts.sql
```

### 3.2 Upgrading an Existing Database
For an existing database that already executed `001_initial_schema.sql`:
- Applying `002_user_oauth_accounts.sql` is completely non-destructive:
  - It creates `user_oauth_accounts` referencing `users(id)`.
  - It does not modify, lock, or recreate existing user records or problems.
  - It logs version `002_user_oauth_accounts` into `schema_migrations`.

---

## 4. Partial Failure Recovery Protocol

If a migration fails partway through execution (e.g. syntax typo, disk exhaustion, or permission error):

### Step 4.1 — Inspect Applied State
Check which tables were committed before the failure:
```sql
USE codearena_db;

-- List all tables created so far
SELECT table_name, engine, table_rows 
FROM information_schema.tables 
WHERE table_schema = 'codearena_db' 
ORDER BY create_time ASC;

-- Verify migration status
SELECT * FROM schema_migrations;
```
If the migration encountered an error before completion, `schema_migrations` will have no record for that version.

### Step 4.2 — Rectify the Defect & Safe Rerun
1. Resolve the syntax or environment error in the migration script.
2. Re-run the migration directly:
   ```bash
   mysql -u root -p codearena_db < database/migrations/002_user_oauth_accounts.sql
   ```
3. Because all preceding statements use `IF NOT EXISTS`, MySQL will safely skip already-created tables, execute the remaining statements, and write the final record into `schema_migrations`.

---

## 5. Rebuilding a Clean Database from Scratch

For local development or testing, developers can rebuild a completely clean database using this procedure:

```bash
# 1. Drop existing database (Development Only)
mysql -u root -p -e "DROP DATABASE IF EXISTS codearena_db;"

# 2. Re-apply baseline migration
mysql -u root -p < database/migrations/001_initial_schema.sql

# 3. Apply OAuth account linking migration
mysql -u root -p codearena_db < database/migrations/002_user_oauth_accounts.sql

# 4. Re-apply seeds in sequence
mysql -u root -p codearena_db < database/seeds/01_reference_data.sql
mysql -u root -p codearena_db < database/seeds/02_basic_problems_seed.sql
mysql -u root -p codearena_db < database/seeds/03_dsa_problems_seed.sql
mysql -u root -p codearena_db < database/seeds/04_roadmap_seed.sql
mysql -u root -p codearena_db < database/seeds/05_dev_sample_data.sql
```

---

## 6. Actual File Checksum Verification & Anti-Drift Mechanism

### 6.1 Why SQL Cannot Calculate File Checksums
Standard MySQL DDL statements cannot read external `.sql` files or compute their hashes. Relying on MySQL expressions like `SHA2('001_initial_schema', 256)` merely hashes the hardcoded version string, failing to detect alterations to the actual SQL migration file.

To solve this, CodeArena delegates checksum calculation to the **migration runner** ([`database/migration_runner.py`](file:///c:/CodeArena/database/migration_runner.py) and [`database/tests/run_live_mysql_validation.py`](file:///c:/CodeArena/database/tests/run_live_mysql_validation.py)).

### 6.2 Checksum Verification Algorithm
For every migration in sequential order:
1. **Compute File SHA-256**: The runner reads the `.sql` file, normalizes line endings (`\r\n` $\rightarrow$ `\n`), and computes the SHA-256 hex digest.
2. **Query `schema_migrations`**:
   ```sql
   SELECT checksum, applied_at FROM schema_migrations WHERE version = '001_initial_schema';
   ```
3. **Branch Logic**:
   - **Case A: Migration Already Applied**:
     - Compare `calculated_checksum` with `stored_checksum`.
     - **Match**: Migration is verified unchanged. Execution is **skipped**, preserving the original `applied_at` timestamp and stored checksum immutably.
     - **Mismatch**: Raises `MigrationIntegrityError`. Halts the entire pipeline immediately, identifying the tampered migration version and expected vs. actual checksums.
   - **Case B: Migration Not Yet Applied**:
     - Executes the migration SQL statements.
     - Measures elapsed execution time.
     - Inserts the record into `schema_migrations` with the actual calculated file checksum:
       ```sql
       INSERT INTO schema_migrations (version, name, applied_at, checksum, execution_time_ms)
       VALUES ('001_initial_schema', 'Initial CodeArena Schema Foundation', CURRENT_TIMESTAMP(3), 'fc17d8126b1aff5e...', 45);
       ```

### 6.3 Canonical File Checksums
| Migration Version | Description | Target Engine | Actual File SHA-256 Checksum |
| :--- | :--- | :--- | :--- |
| `001_initial_schema` | Baseline 32 tables, relationships, indexes | MySQL 8.0+ | `6e9bf67a5afe5ccc5251c5463c3cd8c668b41afafa6b49b3cc988aa6ff2187ec` |
| `002_user_oauth_accounts` | External OAuth linking table (Google, Facebook) | MySQL 8.0+ | `aef262ed3f20b09bfa247593993392c02795fb11e674bc9e2f13bba8c42571e2` |

### 6.4 Viewing Applied Migrations on a Live Database
```sql
USE codearena_db;

SELECT 
    version,
    name,
    applied_at,
    checksum,
    execution_time_ms
FROM schema_migrations
ORDER BY applied_at ASC;
```
