"""
CodeArena — Automated Test Suite: Social Authentication Preparation (Google & Facebook)
Validates frontend Google & Facebook preview buttons, clean SVG iconography,
honest message handling, non-simulation of sessions, email/password validation preservation,
and database OAuth linking schema definitions.
"""

import os
import re
import sys

CUR_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = CUR_DIR
while REPO_ROOT and not (os.path.isdir(os.path.join(REPO_ROOT, 'frontend')) and (os.path.exists(os.path.join(REPO_ROOT, '.git')) or os.path.exists(os.path.join(REPO_ROOT, '.gitignore')))):
    PARENT = os.path.dirname(REPO_ROOT)
    if PARENT == REPO_ROOT:
        break
    REPO_ROOT = PARENT

PASSED = 0
FAILED = 0

def test(condition, description):
    global PASSED, FAILED
    if condition:
        print(f"  [PASS] {description}")
        PASSED += 1
    else:
        print(f"  [FAIL] {description}")
        FAILED += 1

def read_file(rel_path):
    with open(os.path.join(REPO_ROOT, rel_path), 'r', encoding='utf-8') as f:
        return f.read()

def main():
    print("=" * 70)
    print(" CODEARENA SOCIAL AUTH PREPARATION & INTEGRATION TEST SUITE")
    print("=" * 70)

    login_html = read_file('frontend/pages/login.html')
    signup_html = read_file('frontend/pages/signup.html')
    auth_js = read_file('frontend/js/auth.js')
    auth_modal_js = read_file('frontend/js/auth_modal.js')
    auth_css = read_file('frontend/css/auth.css')
    auth_modal_css = read_file('frontend/css/auth_modal.css')
    migration_sql = read_file('database/migrations/002_user_oauth_accounts.sql')
    doc_md = read_file('database/docs/oauth-account-linking.md')
    root_readme = read_file('README.md')

    # 1. Login Page Inspection
    print("\n[1] Standalone Login Page (frontend/pages/login.html):")
    test('id="btnLoginGoogle"' in login_html, "login.html defines Google sign-in button (id='btnLoginGoogle')")
    test('id="btnLoginFacebook"' in login_html, "login.html defines Facebook sign-in button (id='btnLoginFacebook')")
    test('class="auth-social-icon icon-google"' in login_html, "login.html embeds canonical Google vector SVG")
    test('class="auth-social-icon icon-facebook"' in login_html, "login.html embeds canonical Facebook vector SVG")
    test('auth-social-divider' in login_html, "login.html contains social divider ('Or continue with')")
    test('type="button"' in login_html, "Social buttons explicitly use type='button' to prevent premature form submit")
    test('loginEmail' in login_html and 'loginPassword' in login_html, "Standard email and password inputs remain intact")

    # 2. Signup Page Inspection
    print("\n[2] Standalone Signup Page (frontend/pages/signup.html):")
    test('id="btnSignupGoogle"' in signup_html, "signup.html defines Google sign-in button (id='btnSignupGoogle')")
    test('id="btnSignupFacebook"' in signup_html, "signup.html defines Facebook sign-in button (id='btnSignupFacebook')")
    test('class="auth-social-icon icon-google"' in signup_html, "signup.html embeds canonical Google vector SVG")
    test('class="auth-social-icon icon-facebook"' in signup_html, "signup.html embeds canonical Facebook vector SVG")
    test('auth-social-divider' in signup_html, "signup.html contains social divider ('Or continue with')")
    test('signupEmail' in signup_html and 'signupPassword' in signup_html, "Standard registration fields remain intact")

    # 3. Client-Side Script Click Handling & Honesty
    print("\n[3] Frontend Script Click Handling (auth.js & auth_modal.js):")
    test('.btn-auth-social' in auth_js, "auth.js attaches listeners to .btn-auth-social buttons")
    test('authentication will be available when the authentication backend is integrated' in auth_js, "auth.js displays honest, professional message on click")
    test('authentication will be available when the authentication backend is integrated' in auth_modal_js, "auth_modal.js displays consistent honest message on click")
    test('localStorage.setItem("authToken"' not in auth_js and 'localStorage.setItem("user"' not in auth_js, "auth.js DOES NOT fabricate fake OAuth user tokens or sessions")

    # 4. Styling & Theming
    print("\n[4] CSS Styling & Theme Support (auth.css):")
    test('.btn-auth-social' in auth_css, "auth.css defines .btn-auth-social base button styling")
    test('.btn-auth-social:hover' in auth_css, "auth.css defines hover transition effects")
    test('.btn-auth-social:focus-visible' in auth_css, "auth.css defines accessible focus-visible rings")
    test('[data-theme="light"] .btn-auth-social' in auth_css, "auth.css defines dedicated light theme overrides")
    test('.auth-social-divider' in auth_css, "auth.css styles the divider with subtle borders")

    # 5. Database Migration & Schema
    print("\n[5] Database Migration 002 (002_user_oauth_accounts.sql):")
    test('CREATE TABLE IF NOT EXISTS user_oauth_accounts' in migration_sql, "Migration 002 defines user_oauth_accounts table")
    test("provider ENUM('GOOGLE', 'FACEBOOK')" in migration_sql, "Provider column is restricted strictly to GOOGLE and FACEBOOK")
    test('provider_user_id VARCHAR(255) NOT NULL' in migration_sql, "Defines provider_user_id as non-null string anchor")
    test('CONSTRAINT uk_provider_user' in migration_sql and 'UNIQUE (provider, provider_user_id)' in migration_sql, "Enforces composite uniqueness on (provider, provider_user_id)")
    test(bool(re.search(r'FOREIGN KEY\s*\(user_id\)\s*REFERENCES\s*users\s*\(id\)[\s\S]*?ON DELETE CASCADE', migration_sql, re.IGNORECASE)), "Enforces ON DELETE CASCADE from users to user_oauth_accounts")
    test('schema_migrations' in migration_sql, "Migration registers version 002_user_oauth_accounts in schema_migrations")

    # 6. Documentation & Root README Integration
    print("\n[6] Documentation Parity & Root README:")
    test('oauth-account-linking.md' in root_readme, "Root README references oauth-account-linking.md")
    test('Social Authentication (Google & Facebook)' in root_readme, "Root README includes dedicated Social Authentication section")
    test('provider_user_id' in doc_md, "oauth-account-linking.md explains provider_user_id as stable identity anchor")
    test('Account Hijacking' in doc_md, "oauth-account-linking.md details hijacking prevention protocols")

    print("\n" + "=" * 70)
    print(f" TEST RESULTS: {PASSED} Passed, {FAILED} Failed.")
    print("=" * 70)
    if FAILED > 0:
        sys.exit(1)

if __name__ == '__main__':
    main()
