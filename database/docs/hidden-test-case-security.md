# CodeArena — Hidden Test Case Security Specification

## 1. Objective & Security Mandate

In competitive programming and coding evaluation platforms, problem test suites are divided into two distinct classes:
1. **Public Sample Test Cases**: Rendered on the problem workspace UI to demonstrate expected input/output formatting and behavior to students.
2. **Hidden Evaluation Test Cases**: Kept confidential to assess solution correctness across edge cases, large inputs, memory stress limits, and boundary conditions.

If hidden test cases or their expected outputs are leaked via public REST endpoints, the integrity of the platform is compromised.

---

## 2. Relational Schema Architecture

The `problem_test_cases` table utilizes a boolean discriminator flag `is_sample`:

```sql
CREATE TABLE problem_test_cases (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    problem_id BIGINT UNSIGNED NOT NULL,
    is_sample BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'TRUE: Visible sample in UI; FALSE: Secret evaluation test case',
    input_data MEDIUMTEXT NOT NULL,
    expected_output MEDIUMTEXT NOT NULL,
    explanation TEXT NULL,
    display_order INT UNSIGNED NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_testcases_problem 
        FOREIGN KEY (problem_id) REFERENCES problems (id) 
        ON DELETE CASCADE ON UPDATE CASCADE,

    INDEX idx_testcases_problem_sample (problem_id, is_sample)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

---

## 3. Query Restrictions & Service Boundaries

### 3.1 Public Student-Facing Retrieval (Person 2 / Person 4)
When serving problem data to web browsers or client applications via endpoints such as `GET /api/problems/{id}` or `GET /api/basic-problems/{id}`:
- **Mandatory Filter**: The query MUST include `WHERE is_sample = TRUE`.
- **Query Specification**:
  ```sql
  SELECT 
      id,
      problem_id,
      input_data,
      expected_output,
      explanation,
      display_order
  FROM problem_test_cases
  WHERE problem_id = :problemId
    AND is_sample = TRUE
    AND is_active = TRUE
  ORDER BY display_order ASC;
  ```
- **Constraint**: Hidden test cases (`is_sample = FALSE`) must NEVER be included in public DTOs, JSON serialization, or cached client payloads.

### 3.2 Backend Judge Execution Retrieval (Person 1: Java Execution Engine)
Only the internal sandbox execution runner service is permitted to fetch hidden test cases:
- **Query Specification**:
  ```sql
  SELECT 
      id,
      is_sample,
      input_data,
      expected_output
  FROM problem_test_cases
  WHERE problem_id = :problemId
    AND is_active = TRUE
  ORDER BY display_order ASC;
  ```

### 3.3 Submission Result Privacy (Person 2: Judging Service)
When students inspect their submission history via `GET /api/submissions/{uid}`:
- For sample test cases (`is_sample = TRUE`), the API may return `actual_output` and `error_message`.
- For hidden test cases (`is_sample = FALSE`):
  - The API MUST NOT echo `expected_output` or `actual_output`.
  - Only the `verdict_code` (e.g. `WRONG_ANSWER` on test case 42), `execution_time_ms`, and `memory_used_kb` should be exposed.
  - This prevents students from reverse-engineering secret inputs or outputs via trial-and-error debugging.

