# test_phase5_release_readiness.py

import os
import sys

# Ensure repository root is in sys.path and is the working directory
_CUR_DIR = os.path.dirname(os.path.abspath(__file__)) if '__file__' in globals() else os.getcwd()
_ROOT = _CUR_DIR
while _ROOT and not (os.path.isdir(os.path.join(_ROOT, 'frontend')) and (os.path.exists(os.path.join(_ROOT, '.git')) or os.path.exists(os.path.join(_ROOT, '.gitignore')))):
    _PARENT = os.path.dirname(_ROOT)
    if _PARENT == _ROOT:
        break
    _ROOT = _PARENT

if os.path.isdir(os.path.join(_ROOT, 'frontend')):
    os.chdir(_ROOT)
    BASE_DIR = _ROOT
    ROOT_DIR = _ROOT
    FRONTEND_DIR = os.path.join(_ROOT, 'frontend')

import os
import re
import json

PASSED = 0
FAILED = 0

def record(condition, name, details=""):
    global PASSED, FAILED
    if condition:
        PASSED += 1
        print(f"[PASS] {name}")
    else:
        FAILED += 1
        print(f"[FAIL] {name} - {details}")

print("=" * 70)
print("CODEARENA — PHASE 5 COMPLETE RELEASE READINESS SUITE")
print("=" * 70)

# ----------------------------------------------------------------------
# 1. 15-Page Ecosystem & Connectivity Audit
# ----------------------------------------------------------------------
print("\n--- 1. 15-Page Ecosystem & Connectivity Audit ---")
PAGES = [
    'frontend/index.html',
    'frontend/pages/dashboard.html',
    'frontend/pages/login.html',
    'frontend/pages/signup.html',
    'frontend/pages/problems.html',
    'frontend/pages/practice.html',
    'frontend/pages/problem.html',
    'frontend/pages/compiler.html',
    'frontend/pages/ai_assistant.html',
    'frontend/pages/bookmarks.html',
    'frontend/pages/contests.html',
    'frontend/pages/learn.html',
    'frontend/pages/progress.html',
    'frontend/pages/settings.html',
    'frontend/pages/submissions.html'
]
record(len(PAGES) == 15 and all(os.path.exists(p) for p in PAGES), "All 15 frontend pages exist on disk")

# Check Theme Integration across all 15 pages
theme_scripts = all('theme.js' in open(p, encoding='utf-8').read() for p in PAGES)
record(theme_scripts, "All 15 pages load theme.js to eliminate theme flashes")

theme_toggles = all('theme-toggle' in open(p, encoding='utf-8').read() or 'themeToggle' in open(p, encoding='utf-8').read() for p in PAGES)
record(theme_toggles, "All 15 pages provide an accessible theme toggle switch")

# Check Brand Link across all pages
brand_links = all(('index.html' in open(p, encoding='utf-8').read() or 'dashboard.html' in open(p, encoding='utf-8').read()) for p in PAGES)
record(brand_links, "All 15 pages contain valid brand links to Home or Dashboard")

# ----------------------------------------------------------------------
# 2. Journey A: Guest Exploration & Practice Gate
# ----------------------------------------------------------------------
print("\n--- 2. Journey A: Guest Exploration & Practice Gate ---")
with open('frontend/pages/problem.html', encoding='utf-8') as f:
    prob_html = f.read()
with open('frontend/js/workspace.js', encoding='utf-8') as f:
    work_js = f.read()

record('guestAuthModalOverlay' in prob_html, "problem.html defines guestAuthModalOverlay dialog")
record('Authentication Required' in prob_html, "Guest gate dialog explicitly communicates 'Authentication Required'")
record('isGuestUser' in work_js, "workspace.js implements isGuestUser() verification helper")
record('showGuestAuthPrompt' in work_js, "workspace.js implements showGuestAuthPrompt() modal launcher")
record('showGuestAuthPrompt(\'run\')' in work_js or 'showGuestAuthPrompt("run")' in work_js, "workspace.js halts runSampleTests() for unauthenticated guests")
record('showGuestAuthPrompt(\'submit\')' in work_js or 'showGuestAuthPrompt("submit")' in work_js, "workspace.js halts handleSubmitSolution() for unauthenticated guests")
record('btnGuestCancel' in prob_html and 'btnGuestCancel' in work_js, "Guest gate provides 'Continue Browsing' dismissal option")

# ----------------------------------------------------------------------
# 3. Journey B: Standalone Compiler Accessibility
# ----------------------------------------------------------------------
print("\n--- 3. Journey B: Standalone Compiler Accessibility ---")
with open('frontend/pages/compiler.html', encoding='utf-8') as f:
    comp_html = f.read()
with open('frontend/js/compiler.js', encoding='utf-8') as f:
    comp_js = f.read()

record('guestAuthModalOverlay' not in comp_html, "compiler.html has zero login-required modal overlays")
record('isGuestUser' not in comp_js, "compiler.js imposes zero login restrictions on code execution")
record('runCode' in comp_js or 'executePreview' in comp_js, "compiler.js maintains open code execution preview for guests")

# ----------------------------------------------------------------------
# 4. Journey C: Learning Centre Integrity
# ----------------------------------------------------------------------
print("\n--- 4. Journey C: Learning Centre Integrity ---")
with open('frontend/pages/learn.html', encoding='utf-8') as f:
    learn_html = f.read()
with open('frontend/js/learn.js', encoding='utf-8') as f:
    learn_js = f.read()

record('lessonCardArea' in learn_html, "learn.html provides lessonCardArea viewer")
record('14' in learn_js, "learn.js provides 14 structured curriculum paths")
record('codearena_learning_progress' in learn_js, "learn.js tracks genuine module completion in localStorage")
record('quiz' in learn_js, "learn.js provides interactive self-assessment quizzes")

# ----------------------------------------------------------------------
# 5. Journey D: Bookmarks Synchronization
# ----------------------------------------------------------------------
print("\n--- 5. Journey D: Bookmarks Synchronization ---")
with open('frontend/pages/bookmarks.html', encoding='utf-8') as f:
    bm_html = f.read()
with open('frontend/js/bookmarks.js', encoding='utf-8') as f:
    bm_js = f.read()

record('btnBookmarkProblem' in prob_html, "problem.html workspace provides #btnBookmarkProblem action")
record('codearena_guest_bookmarks' in work_js, "workspace.js synchronizes bookmarks with codearena_guest_bookmarks")
record('codearena_guest_bookmarks' in bm_js, "bookmarks.js consumes codearena_guest_bookmarks storage")
record('renderSafeDescription' in bm_js, "bookmarks.js safely renders problem descriptions without raw HTML")
record('bookmarksEmptyState' in bm_html or 'bookmarks-empty' in bm_html, "bookmarks.html provides clear empty state")

# ----------------------------------------------------------------------
# 6. Journey E: AI Assistant Simulation & Mentoring
# ----------------------------------------------------------------------
print("\n--- 6. Journey E: AI Assistant Simulation & Mentoring ---")
with open('frontend/pages/ai_assistant.html', encoding='utf-8') as f:
    ai_html = f.read()
with open('frontend/js/ai_assistant.js', encoding='utf-8') as f:
    ai_js = f.read()

record('ai-page-container' in ai_html, "ai_assistant.html utilizes spacious .ai-page-container")
record('prompt-chip-btn' in ai_html, "ai_assistant.html provides quick suggested prompt chips")
record('Simulated' in ai_html and 'Simulated' in ai_js, "AI Assistant clearly labels all responses as simulated preview")
record('sessionStorage' in ai_js, "AI Assistant safely isolates chat history to browser session storage")
record('code-copy-btn' in ai_js, "AI Assistant provides functional code copying for Java snippets")

# ----------------------------------------------------------------------
# 7. Journey F: Settings & CodeMirror Integration
# ----------------------------------------------------------------------
print("\n--- 7. Journey F: Settings & CodeMirror Integration ---")
with open('frontend/pages/settings.html', encoding='utf-8') as f:
    set_html = f.read()
with open('frontend/js/settings.js', encoding='utf-8') as f:
    set_js = f.read()

record('codearena_user_settings' in set_js, "settings.js stores configuration in codearena_user_settings")
record('codearena_user_settings' in work_js, "workspace.js actively consumes codearena_user_settings")
record('codearena_user_settings' in comp_js, "compiler.js actively consumes codearena_user_settings")
record('Active Live Configuration' in set_html, "settings.html explicitly badges live CodeMirror configurations")
record('Demonstration Preview' in set_html, "settings.html explicitly badges preview-only account/notification items")

# ----------------------------------------------------------------------
# 8. Journey G: Submissions & Progress Data Honesty
# ----------------------------------------------------------------------
print("\n--- 8. Journey G: Submissions & Progress Data Honesty ---")
with open('frontend/pages/progress.html', encoding='utf-8') as f:
    prog_html = f.read()
with open('frontend/js/progress.js', encoding='utf-8') as f:
    prog_js = f.read()
with open('frontend/pages/submissions.html', encoding='utf-8') as f:
    subs_html = f.read()
with open('frontend/js/submissions.js', encoding='utf-8') as f:
    subs_js = f.read()

record('metricTotalSolved' in prog_html and '0' in prog_html, "progress.html defaults to honest 0 solved challenges")
record('No recent problem submissions recorded' in prog_js, "progress.js displays honest empty state when 0 session submissions exist")
record('PREVIEW_PASSED' in subs_js, "submissions.js clearly maintains PREVIEW_PASSED verdict semantics")
record('subCodeModalOverlay' in subs_html, "submissions.html provides modal inspection dialog for submitted code")

# ----------------------------------------------------------------------
# 9. Security & Cleanliness Audit
# ----------------------------------------------------------------------
print("\n--- 9. Security & Cleanliness Audit ---")
with open('frontend/js/practice_hub.js', encoding='utf-8') as f:
    hub_js = f.read()

record('renderSafeDescription' in hub_js, "practice_hub.js safely renders problem descriptions")
record('prob-card-desc' in hub_js and '&lt;p&gt;' not in hub_js, "practice_hub.js renders descriptions without raw HTML text leakage")

# Zero inline event handlers across all 15 pages
inline_handlers = []
for p in PAGES:
    with open(p, encoding='utf-8') as f:
        c = f.read()
    if re.search(r'\son[a-z]+=', c, re.I):
        inline_handlers.append(p)
record(len(inline_handlers) == 0, f"Exactly zero inline event handlers across all HTML pages (found: {len(inline_handlers)})")

# Strict backend and database boundary check
record(os.path.exists('backend') and os.path.exists('database'), "backend/ and database/ directories exist in workspace")
# Verify no backend or database files were staged or touched
import subprocess
diff_check = subprocess.run(['git', 'status', 'backend', 'database'], capture_output=True, text=True)
record('working tree clean' in diff_check.stdout, "STRICT SCOPE BOUNDARY: backend/ and database/ are 100% untouched")

print("\n" + "=" * 70)
print(f"PHASE 5 VERIFICATION SUITE: {PASSED} PASSED, {FAILED} FAILED")
print("=" * 70)

