"""
======================================================================
CODEARENA — PHASE 6 COMPLETE ADVANCED FRONTEND AUTOMATED TEST SUITE
======================================================================
Comprehensive verification of all Phase 6 deliverables:
1. Strict Scope Boundaries & Zero Backend Modifications
2. Dashboard Experience Enhancement (Search Suggestions & Notifications)
3. Advanced Problem Catalogue & Practice (Recently Viewed, Multi-Filter)
4. Advanced Java Code Editor (Toolbar, Font Controls, Session Drafts)
5. Advanced Java Learning Experience (TOC, Completion Tracking, Quiz Explanations)
6. AI Assistant Interface Improvements (SVG Avatars, Prompt Chips, Clear Chat)
7. Bookmarks, Contests & Submissions Refinements
8. Settings & Personalisation (Density, Reduced Motion, Live Binding)
9. Unified Toast Notification System (Accessibility, Styles, Integration)
10. Cross-Page Cleanliness & Zero Inline Event Handlers
"""


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
import subprocess
import sys

passed = 0
failed = 0

def test(description, condition, details=""):
    global passed, failed
    if condition:
        print(f"[PASS] {description}")
        passed += 1
    else:
        print(f"[FAIL] {description}")
        if details:
            print(f"       {details}")
        failed += 1

def read_file(path):
    with open(path, "r", encoding="utf-8", errors="replace") as f:
        return f.read()

print("=" * 70)
print("CODEARENA — PHASE 6 ADVANCED FEATURES VERIFICATION SUITE")
print("=" * 70)

# ----------------------------------------------------------------------
# 1. Strict Scope Boundaries & Git Status Integrity
# ----------------------------------------------------------------------
print("\n--- 1. Strict Scope Boundaries ---")
test("backend/ directory exists untouched", os.path.isdir("backend"))
test("database/ directory exists untouched", os.path.isdir("database"))

git_status = subprocess.run(["git", "status", "--short"], capture_output=True, text=True).stdout
backend_touched = any("backend" in l or "database" in l for l in git_status.splitlines())
test("STRICT SCOPE BOUNDARY: Exactly 0 backend/database files modified", not backend_touched)

# ----------------------------------------------------------------------
# 2. Unified Toast Notification System
# ----------------------------------------------------------------------
print("\n--- 2. Unified Toast Notification System ---")
test("toast.js exists on disk", os.path.isfile("frontend/js/toast.js"))
toast_js = read_file("frontend/js/toast.js")
test("toast.js defines window.CodeArenaToast", "window.CodeArenaToast =" in toast_js)
test("toast.js provides accessible ARIA live attributes", 'role="status"' in toast_js or 'role\', \'status\'' in toast_js)
test("toast.js supports success, error, warning, and info toasts", 
     all(fn in toast_js for fn in ["success", "error", "warning", "info"]))

styles_css = read_file("frontend/css/styles.css")
test("styles.css defines .codearena-toast-container", ".codearena-toast-container" in styles_css)
test("styles.css defines semantic toast colors (success, error, warning, info)",
     all(f".codearena-toast.toast-{t}" in styles_css for t in ["success", "error", "warning", "info"]))

# ----------------------------------------------------------------------
# 3. Dashboard Experience Enhancement
# ----------------------------------------------------------------------
print("\n--- 3. Dashboard Experience Enhancement ---")
dash_html = read_file("frontend/pages/dashboard.html")
dash_js = read_file("frontend/js/dashboard.js")
dash_css = read_file("frontend/css/dashboard.css")

test("dashboard.html defines #dashSearchSuggestions dropdown container", 'id="dashSearchSuggestions"' in dash_html)
test("dashboard.html includes api.js for problem querying", '<script src="../js/api.js"></script>' in dash_html)
test("dashboard.html includes toast.js", '<script src="../js/toast.js"></script>' in dash_html)
test("dashboard.html defines notification badge counter #notifBadge", 'id="notifBadge"' in dash_html)
test("dashboard.html defines notification tabs (All, System, Contests)", 'class="notif-tabs"' in dash_html)
test("dashboard.html defines mark all as read action #btnMarkNotifsRead", 'id="btnMarkNotifsRead"' in dash_html)

test("dashboard.js indexes platformPages", "const platformPages =" in dash_js)
test("dashboard.js queries canonical problemService for search suggestions", "window.CodeArenaAPI.problemService.getProblems()" in dash_js)
test("dashboard.js implements ArrowDown / ArrowUp keyboard navigation", 
     "e.key === 'ArrowDown'" in dash_js and "e.key === 'ArrowUp'" in dash_js)
test("dashboard.js implements Enter navigation and Escape dismissal", 
     "e.key === 'Enter'" in dash_js and "e.key === 'Escape'" in dash_js)
test("dashboard.js provides search empty state with catalogue link", "search-empty-state" in dash_js)
test("dashboard.js implements notification tab switching", "data-tab" in dash_js)
test("dashboard.js wires mark-all-read with CodeArenaToast", "All notifications marked as read" in dash_js)
test("dashboard.css styles .dash-search-suggestions dropdown", ".dash-search-suggestions" in dash_css)

# ----------------------------------------------------------------------
# 4. Advanced Catalogue & Practice Hub
# ----------------------------------------------------------------------
print("\n--- 4. Advanced Problem Catalogue & Practice ---")
prob_html = read_file("frontend/pages/problems.html")
prob_js = read_file("frontend/js/problems.js")
prac_html = read_file("frontend/pages/practice.html")
prac_js = read_file("frontend/js/practice_hub.js")

test("problems.html defines catalogueSearchSuggestions container", 'id="catalogueSearchSuggestions"' in prob_html)
test("problems.html defines recentlyViewedSection container", 'id="recentlyViewedSection"' in prob_html)
test("problems.html provides clear history button #btnClearRecentlyViewed", 'id="btnClearRecentlyViewed"' in prob_html)
test("problems.js implements renderRecentlyViewed() reading codearena_recently_viewed", "codearena_recently_viewed" in prob_js)
test("problems.js implements live catalogue search suggestions", "initSearchSuggestions" in prob_js)
test("problems.js maintains active filter chip indicators", "renderActiveFilterChips" in prob_js)

test("practice.html defines practiceRecentlyViewedSection container", 'id="practiceRecentlyViewedSection"' in prac_html)
test("practice.html provides clear history button #btnPracticeClearRecentlyViewed", 'id="btnPracticeClearRecentlyViewed"' in prac_html)
test("practice_hub.js renders recently viewed challenges", "renderRecentlyViewed" in prac_js)
test("practice_hub.js safely escapes problem descriptions", "renderSafeDescription" in prac_js)

# ----------------------------------------------------------------------
# 5. Advanced Java Code Editor & Draft Preservation
# ----------------------------------------------------------------------
print("\n--- 5. Advanced Java Code Editor & Drafts ---")
comp_html = read_file("frontend/pages/compiler.html")
comp_js = read_file("frontend/js/compiler.js")
work_html = read_file("frontend/pages/problem.html")
work_js = read_file("frontend/js/workspace.js")

test("compiler.html provides quick font size controls (A- / A+)", 
     'id="btnEditorFontDec"' in comp_html and 'id="btnEditorFontInc"' in comp_html)
test("compiler.html provides Copy Code action button #btnCompilerCopyCode", 'id="btnCompilerCopyCode"' in comp_html)
test("compiler.js loads saved session draft on startup", "codearena_compiler_draft" in comp_js)
test("compiler.js auto-saves editor changes to sessionStorage", "sessionStorage.setItem('codearena_compiler_draft'" in comp_js)
test("compiler.js clears draft when reset confirmed", "sessionStorage.removeItem('codearena_compiler_draft')" in comp_js)

test("problem.html provides quick font size controls in Group C", 
     'id="btnWorkspaceFontDec"' in work_html and 'id="btnWorkspaceFontInc"' in work_html)
test("workspace.js preserves problem session draft", "codearena_draft_problem_" in work_js)
test("workspace.js records visited problem in saveRecentlyViewedProblem()", "saveRecentlyViewedProblem" in work_js)
test("workspace.js clears draft on confirmed starter code reset", "sessionStorage.removeItem('codearena_draft_problem_'" in work_js)
test("workspace.js enforces guest login gate for practice solve executions", "isGuestUser" in work_js and "guestAuthModalOverlay" in work_js)

# ----------------------------------------------------------------------
# 6. Advanced Java Learning Experience
# ----------------------------------------------------------------------
print("\n--- 6. Advanced Java Learning Experience ---")
learn_html = read_file("frontend/pages/learn.html")
learn_js = read_file("frontend/js/learn.js")
sec_css = read_file("frontend/css/secondary.css")

test("learn.html includes toast.js", '<script src="../js/toast.js"></script>' in learn_html)
test("learn.js renders dynamic lesson Table of Contents (.lesson-toc-nav)", "lesson-toc-nav" in learn_js)
test("learn.js provides interactive lesson completion toggle #btnToggleLessonComplete", 'id="btnToggleLessonComplete"' in learn_js)
test("learn.js persists completed lessons in localStorage codearena_learning_progress", "codearena_learning_progress" in learn_js)
test("learn.js provides self-assessment quiz feedback with retry button", 'id="btnRetryQuiz"' in learn_js)
test("learn.js provides one-click Java code copy with feedback", "btnCopyLessonCode" in learn_js)
test("secondary.css styles .lesson-toc-nav and .btn-retry-quiz", 
     ".lesson-toc-nav" in sec_css and ".btn-retry-quiz" in sec_css)

# ----------------------------------------------------------------------
# 7. AI Assistant Interface Improvements
# ----------------------------------------------------------------------
print("\n--- 7. AI Assistant Interface Improvements ---")
ai_html = read_file("frontend/pages/ai_assistant.html")
ai_js = read_file("frontend/js/ai_assistant.js")

test("ai_assistant.html includes toast.js", '<script src="../js/toast.js"></script>' in ai_html)
test("ai_assistant.html defines suggested prompt chips for Streams & Exceptions", 
     "Java 8 Streams" in ai_html and "Checked vs Unchecked" in ai_html)
test("ai_assistant.js includes knowledge base entries for Streams and Exceptions", 
     "Java 8 Streams and Lambda Expressions" in ai_js and "Checked vs Unchecked Exceptions" in ai_js)
test("ai_assistant.js renders clean SVG avatars for user and bot", 
     '<svg width="16" height="16"' in ai_js)
test("ai_assistant.js auto-scrolls chat stream to bottom on new messages", 
     "dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight" in ai_js)
test("ai_assistant.js provides confirmation dialog and toast on handleClearChat", 
     "confirm(" in ai_js and "CodeArenaToast.info" in ai_js)

# ----------------------------------------------------------------------
# 8. Bookmarks, Contests & Submissions Refinements
# ----------------------------------------------------------------------
print("\n--- 8. Bookmarks, Contests & Submissions ---")
book_html = read_file("frontend/pages/bookmarks.html")
book_js = read_file("frontend/js/bookmarks.js")
cont_js = read_file("frontend/js/contests.js")
sub_js = read_file("frontend/js/submissions.js")

test("bookmarks.html provides topic filter dropdown #bookmarksTopicFilter", 'id="bookmarksTopicFilter"' in book_html)
test("bookmarks.js filters by selectedTopic", "selectedTopic" in book_js)
test("bookmarks.js provides toast notification on bookmark removal", "Problem removed from bookmarks" in book_js)
test("bookmarks.js asks confirmation on clear all bookmarks", "confirm('Are you sure you want to remove all saved bookmarks?')" in book_js)
test("contests.js provides toast notification on registration toggle", "CodeArenaToast" in cont_js)
test("submissions.js provides toast notification on code copy", "Submission source code copied to clipboard" in sub_js)

# ----------------------------------------------------------------------
# 9. Settings, Personalisation & Theme Synchronization
# ----------------------------------------------------------------------
print("\n--- 9. Settings & Personalisation ---")
sett_html = read_file("frontend/pages/settings.html")
sett_js = read_file("frontend/js/settings.js")
theme_js = read_file("frontend/js/theme.js")

test("settings.html provides Interface Density select #settingDensitySelect", 'id="settingDensitySelect"' in sett_html)
test("settings.html provides Reduced Motion checkbox #settingReducedMotion", 'id="settingReducedMotion"' in sett_html)
test("settings.js persists interfaceDensity in codearena_user_settings", "interfaceDensity:" in sett_js)
test("settings.js persists reducedMotion in codearena_user_settings", "reducedMotion:" in sett_js)
test("settings.js applies data-density attribute to documentElement", 'setAttribute(\'data-density\', \'compact\')' in sett_js)
test("settings.js applies data-reduced-motion attribute to documentElement", 'setAttribute(\'data-reduced-motion\', \'true\')' in sett_js)
test("theme.js applies saved density and reduced-motion at startup", 
     "data-density" in theme_js and "data-reduced-motion" in theme_js)
test("styles.css defines [data-density=\"compact\"] overrides", '[data-density="compact"]' in styles_css)
test("styles.css defines [data-reduced-motion=\"true\"] overrides", '[data-reduced-motion="true"]' in styles_css)

# ----------------------------------------------------------------------
# 10. Ecosystem Cleanliness & Accessibility
# ----------------------------------------------------------------------
print("\n--- 10. Ecosystem Cleanliness & Accessibility ---")
pages = [
    "frontend/index.html",
    "frontend/pages/dashboard.html",
    "frontend/pages/login.html",
    "frontend/pages/signup.html",
    "frontend/pages/compiler.html",
    "frontend/pages/problems.html",
    "frontend/pages/problem.html",
    "frontend/pages/practice.html",
    "frontend/pages/ai_assistant.html",
    "frontend/pages/bookmarks.html",
    "frontend/pages/contests.html",
    "frontend/pages/learn.html",
    "frontend/pages/progress.html",
    "frontend/pages/settings.html",
    "frontend/pages/submissions.html"
]

total_inline_handlers = 0
for p in pages:
    content = read_file(p)
    matches = re.findall(r'\s+on[a-z]+=', content, re.IGNORECASE)
    total_inline_handlers += len(matches)

test(f"Exactly zero inline event handlers across all 15 HTML pages (found: {total_inline_handlers})", total_inline_handlers == 0)

print("\n" + "=" * 70)
print(f"PHASE 6 ADVANCED FEATURES VERIFICATION SUITE: {passed} PASSED, {failed} FAILED")
print("=" * 70)

if failed > 0:
    sys.exit(1)

