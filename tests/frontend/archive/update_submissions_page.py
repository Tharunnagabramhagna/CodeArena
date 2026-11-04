# tests/frontend/utils/update_submissions_page.py
import os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
SUB_PATH = os.path.join(ROOT, "frontend", "pages", "submissions.html")

with open(SUB_PATH, "r", encoding="utf-8") as f:
    c = f.read().replace("\r\n", "\n")

# 1. Add user pill in header
target_header = """        <div class="secondary-header-actions">
            <a href="problems.html" class="secondary-header-btn" title="Problem Catalogue">"""

replacement_header = """        <div class="secondary-header-actions">
            <!-- User Session Pill (Visible when authenticated) -->
            <div class="sub-user-pill" id="subUserPill" style="display: none;">
                <span class="user-avatar-small" id="subUserAvatar">U</span>
                <span class="sub-user-name" id="subUserName">Student</span>
                <span class="badge-plan-tag" id="subUserPlanTag">Free</span>
                <button type="button" class="sub-logout-btn" id="btnSubLogout" title="Log out of preview session">Log Out</button>
            </div>

            <a href="problems.html" class="secondary-header-btn" title="Problem Catalogue">"""

assert target_header in c, "Could not find target_header in submissions.html"
c = c.replace(target_header, replacement_header, 1)

# 2. Add auth-gate container before table card
target_main = """            <!-- Hero Banner -->
            <section class="feature-hero" aria-labelledby="submissions-heading">
                <div class="feature-hero-text">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <span class="preview-badge-pill">Guest Session Records</span>
                    </div>"""

replacement_main = """            <!-- Authentication Required Gate (Visible for Guests) -->
            <section class="auth-gate-container" id="submissionsAuthGate" style="display: none;" aria-labelledby="authGateHeading">
                <div class="auth-gate-card">
                    <div class="auth-gate-icon" aria-hidden="true">
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                    </div>
                    <div class="auth-gate-badge">
                        <span>Preview Authentication Gate · Registered Access Only</span>
                    </div>
                    <h2 id="authGateHeading" class="auth-gate-title">Authentication Required</h2>
                    <p class="auth-gate-desc">
                        Problem submission history, evaluation verdicts on test cases, and code revision logs are reserved for registered CodeArena members. Log in or create a free account to track your submissions.
                    </p>
                    <div class="auth-gate-actions">
                        <a href="login.html?redirect=submissions.html" class="btn btn-primary auth-gate-btn">Log In →</a>
                        <a href="signup.html?redirect=submissions.html" class="btn btn-secondary auth-gate-btn">Create Free Account</a>
                        <button type="button" class="btn btn-demo-auth auth-gate-btn" id="btnSubDemoLogin">⚡ Demo One-Click Login (Preview)</button>
                    </div>
                    <div class="auth-gate-disclaimer">
                        <span>ℹ️ Client-side preview state. Persistent user authentication via Java Servlets & JDBC connects in Phase 4.</span>
                    </div>
                </div>
            </section>

            <!-- Hero Banner -->
            <section class="feature-hero" id="submissionsHero" aria-labelledby="submissions-heading">
                <div class="feature-hero-text">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <span class="preview-badge-pill" id="subSessionPill">Guest Session Records</span>
                    </div>"""

assert target_main in c, "Could not find target_main in submissions.html"
c = c.replace(target_main, replacement_main, 1)

with open(SUB_PATH, "w", encoding="utf-8") as f:
    f.write(c)

print("submissions.html updated with Auth Gate & User Pill successfully.")

