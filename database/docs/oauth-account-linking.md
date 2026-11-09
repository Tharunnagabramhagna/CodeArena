# CodeArena — OAuth Account Linking Specification (Google & Facebook)

## 1. Architectural Purpose & Overview

This specification establishes the architectural, database, and security foundation for integrating external OAuth 2.0 / OpenID Connect identity providers (**Google** and **Facebook**) into CodeArena.

Rather than fragmenting user identity into isolated social accounts, CodeArena utilizes an **Identity Association Model**:
- A single canonical `users` record represents the student or developer on CodeArena.
- External social identities are linked as credentials in the dedicated `user_oauth_accounts` table.
- A user can authenticate using traditional credentials (email/password), external providers (Google, Facebook), or link both to a single account profile.

---

## 2. Relational Schema Architecture

The `user_oauth_accounts` table isolates provider-specific claims from core user identity:

```sql
CREATE TABLE IF NOT EXISTS user_oauth_accounts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL COMMENT 'Foreign key to users.id',
    provider ENUM('GOOGLE', 'FACEBOOK') NOT NULL COMMENT 'External OAuth provider (GOOGLE or FACEBOOK)',
    provider_user_id VARCHAR(255) NOT NULL COMMENT 'Unique external subject/user ID returned by provider (Google sub, Facebook id)',
    provider_email VARCHAR(255) NULL COMMENT 'Email address reported by provider claim',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Whether provider asserted email verification',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_oauth_user 
        FOREIGN KEY (user_id) REFERENCES users (id) 
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT uk_provider_user 
        UNIQUE (provider, provider_user_id),

    INDEX idx_oauth_user (user_id),
    INDEX idx_oauth_provider_email (provider, provider_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='External OAuth identity provider associations';
```

---

## 3. Core Security & Identity Verification Protocols

To guarantee absolute account integrity, CodeArena enforces strict cryptographic verification and identity demarcation rules.

```
+---------------------------------------------------------------------------------------------------+
|                                  IDENTITY VERIFICATION TAXONOMY                                   |
+------------------------------------+--------------------------------------------------------------+
| Mechanism                          | Purpose & Verification Level                                 |
+------------------------------------+--------------------------------------------------------------+
| 1. Google ID Token Validation      | Cryptographic OIDC JWT signature & claim verification (RS256)|
| 2. Facebook Identity Verification  | Graph API identity call secured with HMAC-SHA256 App Secret  |
| 3. Provider Email Verification     | Provider-asserted flag (NOT sufficient for account linking)   |
| 4. Explicit Session Account Link   | Authenticated CodeArena session binds new OAuth provider     |
+------------------------------------+--------------------------------------------------------------+
```

### 3.1 Google ID Token Validation (OpenID Connect JWT)
- **Token Type**: Cryptographically signed JSON Web Token (JWT).
- **Backend Verification**:
  1. The Java backend fetches Google's public JSON Web Key Set (JWKS) from `https://www.googleapis.com/oauth2/v3/certs`.
  2. Validates the `RS256` asymmetric signature against Google's public certificates.
  3. Validates standard JWT claims:
     - `iss` (Issuer): Must equal `accounts.google.com` or `https://accounts.google.com`.
     - `aud` (Audience): Must exactly match CodeArena's registered Google Client ID.
     - `exp` (Expiration): Current epoch timestamp must be strictly earlier than expiration.
  4. Extracts `sub` (Subject): The permanent, non-reassignable string identifier (e.g. `109283746592837465192`). This is stored as `provider_user_id`.

### 3.2 Facebook Identity Verification (OAuth 2.0 & Graph API Proof)
- **Token Type**: User Access Token (Facebook does not issue OIDC ID tokens by default).
- **Backend Verification**:
  1. Facebook access tokens cannot be validated solely via offline public keys; the backend must make a secure server-to-server TLS call to Facebook's Graph API:
     ```http
     GET https://graph.facebook.com/v19.0/me?fields=id,name,email&access_token={user_token}&appsecret_proof={proof}
     ```
  2. **Cryptographic Proof of App Secret (`appsecret_proof`)**:
     - The backend computes an HMAC-SHA256 hash using the Facebook App Secret as the cryptographic key and the user's access token as the message:
       $$\text{appsecret\_proof} = \text{HMAC-SHA256}(\text{access\_token}, \text{app\_secret})$$
     - This prevents token substitution attacks and ensures that the access token was issued specifically for CodeArena.
  3. Extracts Facebook App-Scoped User ID (`id`). This is stored as `provider_user_id`.

### 3.3 Provider Email Verification & Strict Anti-Hijacking Mandate
> [!CAUTION]
> **Account Hijacking Security Mandate**: Matching email addresses alone **MUST NEVER** be treated as proof of identity or permission to link accounts.

1. **Why Matching Emails Alone Cannot Be Trusted**:
   - An external provider's assertion that an email belongs to an OAuth profile does **not** prove that the user owns the existing CodeArena account registered with that same email.
   - Some social providers allow users to register with unverified emails or change their email addresses without re-verification.
   - If CodeArena automatically merged accounts based on email alone, an attacker could register an unverified social account using a victim's email address and immediately gain unauthorized access to the victim's CodeArena submissions, profile, and progress.
2. **Provider Verification Claims**:
   - Google asserts `email_verified: true/false` in its ID token payload.
   - Facebook returns an `email` field only if user permission was granted, but does not guarantee strict domain re-verification for all account types.
   - The database records this claim in `user_oauth_accounts.email_verified`, but this flag is strictly informational and is never used as a bypass for account ownership verification.

### 3.4 Explicit Account Linking from an Authenticated Session
CodeArena enforces two completely distinct workflows for OAuth interaction:

#### Workflow A: Registration & Login with Existing Linked OAuth
- **Scenario 1 (Existing Linked Account)**: User clicks "Continue with Google". Backend matches `(provider = 'GOOGLE', provider_user_id = sub)`. Authentication succeeds immediately; session is created.
- **Scenario 2 (New User Registration)**: User clicks "Continue with Google". No match for `provider_user_id`, and `provider_email` does **not** exist in the `users` table. Backend creates a new `users` record, provisions `user_profiles`, and inserts the `user_oauth_accounts` record.
- **Scenario 3 (Account Collision / Hijacking Prevention)**: User clicks "Continue with Google". No match for `provider_user_id`, but `provider_email` **already exists** in `users` (e.g. registered with password).
  - **Action**: Automatic linking is **strictly rejected**.
  - **User Feedback**: The backend returns an authentication challenge: *"An account with this email already exists. Please log in with your CodeArena password first to link this social account."*

#### Workflow B: Explicit Account Linking from an Authenticated Session
- When a user is **already logged into CodeArena** with an active, authenticated session (verified via HTTP-only session cookie):
  1. The user navigates to **Settings -> Linked Accounts**.
  2. The user clicks **"Connect Google Account"** or **"Connect Facebook Account"**.
  3. The browser initiates the OAuth flow.
  4. Upon callback, the backend validates the token, extracts `provider_user_id`, verifies that `(provider, provider_user_id)` is not linked to any other account, and binds it to `session.user_id`.
  5. Because the user is already authenticated with CodeArena, this explicit link is completely safe and authorized.

### 3.5 Duplicate Prevention via Composite Uniqueness
The unique constraint:
```sql
CONSTRAINT uk_provider_user UNIQUE (provider, provider_user_id)
```
guarantees that an external Google or Facebook identity can be bound to **at most one** CodeArena user. Attempting to link a Google account that is already associated with another student is rejected at the database engine level (MySQL Error 1062).

### 3.6 Strict Frontend vs. Backend Responsibility Boundary
> [!IMPORTANT]
> **No Frontend Provider Verification**: The frontend code handles **ZERO** provider verification, zero signature checking, and zero token exchange.

1. **Frontend Role (Strictly Presentation & Initiation)**:
   - Renders branded Google and Facebook sign-in and sign-up buttons.
   - Displays clear, non-deceptive status messages (in preview mode, informs users that authentication requires backend integration).
   - In production, directs the browser to the backend authorization endpoint (`/api/auth/oauth/google`) or provider consent URL.
   - Handles redirect responses and displays errors returned by the server.
   - **Never** handles `client_secret` or `app_secret`.
   - **Never** attempts to validate JWT signatures or call provider token endpoints directly.
2. **Backend Role (Java Servlets / Spring Security)**:
   - Securely stores OAuth `client_id`, `client_secret`, and Facebook `app_secret` in environment variables.
   - Executes server-to-server TLS calls to Google and Facebook token endpoints.
   - Validates cryptographic signatures, audiences, and expiration timestamps.
   - Executes atomic SQL transactions against `user_oauth_accounts` and `users`.
   - Issues secure, HTTP-only, SameSite session cookies.

### 3.7 Token Persistence Policy
- CodeArena requires OAuth **solely for identity verification and authentication**, not for ongoing third-party API operations.
- Long-lived access tokens, refresh tokens, and broad OAuth scopes are **not persisted** in `user_oauth_accounts`.
- This adheres to the **Principle of Least Privilege** and completely eliminates token leakage liabilities.

### 3.8 Account Lockout Prevention (Unlinking Rule)
- A user must NEVER be permitted to unlink their only authentication method.
- If a user registered via Google Sign-In and has no password hash set, they cannot unlink Google unless they first:
  a) Set a valid password through an authenticated password-creation flow, OR
  b) Link an alternative provider (e.g. Facebook).

---

## 4. End-to-End Authentication Flow (Java Backend Contract)

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student (Browser)
    participant Front as Frontend (CodeArena UI)
    participant OAuth as Identity Provider (Google / Facebook)
    participant Back as Java Auth Servlet (Person 4)
    participant DB as MySQL 8.0 (codearena_db)

    Student->>Front: Clicks "Continue with Google"
    Front->>Back: GET /api/auth/oauth/google/authorize
    Back-->>Student: 302 Redirect to Provider Consent with state & nonce
    Student->>OAuth: Grants Consent
    OAuth-->>Student: 302 Redirect to /api/auth/oauth/google/callback?code=XYZ&state=ABC
    Student->>Back: GET /api/auth/oauth/google/callback?code=XYZ
    Back->>OAuth: POST /token (Exchange code + client_secret via TLS)
    OAuth-->>Back: ID Token & Access Token
    Back->>Back: Verify RS256 signature via Google JWKS; validate iss, aud, exp
    Back->>Back: Extract sub, email, email_verified
    
    Back->>DB: SELECT user_id FROM user_oauth_accounts WHERE provider='GOOGLE' AND provider_user_id=sub
    alt Existing Linked Account Found
        DB-->>Back: Return user_id
        Back->>Back: Issue HTTP-only Session Cookie
    else No Link Found, Email Exists in users table
        Back-->>Student: 409 Conflict: Require Password Login to link accounts
    else Completely New User
        Back->>DB: INSERT INTO users (username, email, role_id=1, status_id=1)
        Back->>DB: INSERT INTO user_profiles (user_id, full_name, preferred_track)
        Back->>DB: INSERT INTO user_oauth_accounts (user_id, provider='GOOGLE', provider_user_id=sub, provider_email=email, email_verified=TRUE)
        Back->>Back: Issue HTTP-only Session Cookie
    end

    Back-->>Student: 302 Redirect to /dashboard.html
```

---

## 5. Summary of Schema Changes in Migration 002

- **Table Added**: `user_oauth_accounts`
- **Total Tables**: 33 tables in CodeArena schema
- **Total Foreign Keys**: 41 active constraints
- **Unique Indexes**: `uk_provider_user (provider, provider_user_id)`
- **Lookup Indexes**: `idx_oauth_user (user_id)`, `idx_oauth_provider_email (provider, provider_email)`
