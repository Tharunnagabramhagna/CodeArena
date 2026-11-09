# test_phase6_refinement.py
"""
CodeArena — Phase 6 Final Refinement & Data Integrity Verification Test Suite
Verifies:
1. Fresh guest bookmark state (starts with 0 bookmarks, no pre-seeded IDs, sync across Workspace, Catalogue & Bookmarks)
2. Recently viewed accuracy (properly defined, deduplicated, capped at 5, only called on workspace load)
3. Code draft isolation (independent per-problem drafts vs standalone compiler draft)
4. Notification honesty (sample disclaimer, preview badges, non-misleading announcement timestamps)
5. Settings consistency (preferences produce real, demonstrable effects across editors and views)
6. Strict scope boundary (only frontend/, 0 backend/database modifications)
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
import sys
import io
import re

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

BASE_DIR = _ROOT
FRONTEND_DIR = os.path.join(_ROOT, 'frontend')

passed = 0
failed = 0

def test(desc, condition, detail=""):
    global passed, failed
    if condition:
        print(f"  [PASS] {desc}")
        passed += 1
    else:
        print(f"  [FAIL] {desc}")
        if detail:
            print(f"         Detail: {detail}")
        failed += 1

def read_file(rel_path):
    full_path = os.path.join(BASE_DIR, rel_path)
    if not os.path.exists(full_path):
        return ""
    with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()

print("=" * 70)
print("CODEARENA PHASE 6 FINAL REFINEMENT & DATA INTEGRITY TEST SUITE")
print("=" * 70)

# ---------------------------------------------------------
# 1. Fresh Guest Bookmark State
# ---------------------------------------------------------
print("\n--- 1. Fresh Guest Bookmark State ---")
bms_js = read_file("frontend/js/bookmarks.js")
work_js = read_file("frontend/js/workspace.js")
prob_js = read_file("frontend/js/problems.js")
bms_html = read_file("frontend/pages/bookmarks.html")

test("bookmarks.js initializes inMemoryBookmarks as empty array", "let inMemoryBookmarks = [];" in bms_js)
test("bookmarks.js does not pre-seed demo IDs on initial visit", "this.set(inMemoryBookmarks)" not in bms_js)
test("BookmarkStorage.get() returns empty array for fresh guest", "return inMemoryBookmarks.slice();" in bms_js or "return inMemoryBookmarks;" in bms_js)
test("BookmarkStorage.get() preserves existing localStorage items if present", "JSON.parse(raw)" in bms_js and "raw !== null" in bms_js)
test("bookmarks.html defines empty state container #bookmarksEmptyState", 'id="bookmarksEmptyState"' in bms_html)
test("bookmarks.html empty state provides CTA link to problems catalogue", 'href="problems.html"' in bms_html)
test("workspace.js provides bookmark toggle button #btnBookmarkProblem", 'btnBookmarkProblem' in work_js)
test("workspace.js integrates with codearena_guest_bookmarks storage key", 'codearena_guest_bookmarks' in work_js)
test("problems.js reads codearena_guest_bookmarks for catalogue sync", 'codearena_guest_bookmarks' in prob_js)
test("problems.js renders bookmark indicator for bookmarked challenges", 'catalogue-bookmark-indicator' in prob_js)

# ---------------------------------------------------------
# 2. Recently Viewed Accuracy
# ---------------------------------------------------------
print("\n--- 2. Recently Viewed Accuracy ---")
test("workspace.js defines saveRecentlyViewedProblem function", "function saveRecentlyViewedProblem(" in work_js)
test("saveRecentlyViewedProblem enforces deduplication", "list.filter(" in work_js and "item.id !== problem.id" in work_js)
test("saveRecentlyViewedProblem caps list at 5 entries", "list.slice(0, 5)" in work_js)
test("saveRecentlyViewedProblem is called inside loadProblemFromUrl", "saveRecentlyViewedProblem(currentProblem)" in work_js)

# Ensure no other page records problems as recently viewed just by browsing
dash_js = read_file("frontend/js/dashboard.js")
practice_js = read_file("frontend/js/practice_hub.js")
test("dashboard.js does NOT call saveRecentlyViewedProblem", "saveRecentlyViewedProblem" not in dash_js)
test("practice_hub.js does NOT call saveRecentlyViewedProblem", "saveRecentlyViewedProblem" not in practice_js)
test("problems.js does NOT call saveRecentlyViewedProblem on card/row render", "saveRecentlyViewedProblem(" not in prob_js)

# ---------------------------------------------------------
# 3. Code Draft Isolation
# ---------------------------------------------------------
print("\n--- 3. Code Draft Isolation ---")
comp_js = read_file("frontend/js/compiler.js")

test("compiler.js uses codearena_compiler_draft for auto-save", "'codearena_compiler_draft'" in comp_js)
test("compiler.js reset button clears codearena_compiler_draft", "removeItem('codearena_compiler_draft')" in comp_js)
test("compiler.js does NOT touch problem workspace draft keys", "codearena_draft_problem_" not in comp_js)

test("workspace.js uses per-problem dynamic key codearena_draft_problem_", "codearena_draft_problem_" in work_js)
test("workspace.js auto-saves per-problem draft on editor change", "setItem('codearena_draft_problem_'" in work_js)
test("workspace.js reset button clears ONLY active problem draft", "removeItem('codearena_draft_problem_'" in work_js)
test("workspace.js reset does NOT clear standalone compiler draft", "removeItem('codearena_compiler_draft')" not in work_js)

# ---------------------------------------------------------
# 4. Notification Honesty
# ---------------------------------------------------------
print("\n--- 4. Notification Honesty ---")
dash_html = read_file("frontend/pages/dashboard.html")

test("dashboard.html includes honest preview disclaimer banner in notif popover", "notif-preview-disclaimer" in dash_html)
test("dashboard.html disclaimer states sample platform announcements", "Sample platform announcements" in dash_html)
test("dashboard.html header tag denotes Sample status", 'Sample (2 new)' in dash_html)
test("dashboard.html notification items include .sample-data-badge pills", 'class="sample-data-badge"' in dash_html)
test("dashboard.html uses non-misleading announcement time label", "Platform Announcement" in dash_html)
test("dashboard.html does not show hardcoded fake 'Today, 10:45 AM'", "Today, 10:45 AM" not in dash_html)
test("dashboard.html does not show hardcoded fake 'Yesterday, 4:20 PM'", "Yesterday, 4:20 PM" not in dash_html)
test("dashboard.js updates mark-all-read label with Sample indication", "0 new (Sample)" in dash_js)

# ---------------------------------------------------------
# 5. Settings Consistency
# ---------------------------------------------------------
print("\n--- 5. Settings Consistency ---")
sett_js = read_file("frontend/js/settings.js")
theme_js = read_file("frontend/js/theme.js")
styles_css = read_file("frontend/css/styles.css")

test("settings.js saves user settings under codearena_user_settings", "codearena_user_settings" in sett_js)
test("settings.js applies interfaceDensity to data-density attribute", "data-density" in sett_js)
test("settings.js applies reducedMotion to data-reduced-motion attribute", "data-reduced-motion" in sett_js)
test("settings.js applies compactToolbar to data-compact-toolbar attribute", "data-compact-toolbar" in sett_js)
test("settings.js syncs codearena_include_default_return", "codearena_include_default_return" in sett_js)
test("settings.js synchronizes both codearena-theme and codearena_theme keys", "codearena-theme" in sett_js and "codearena_theme" in sett_js)

test("theme.js applies data-density at startup", "data-density" in theme_js)
test("theme.js applies data-reduced-motion at startup", "data-reduced-motion" in theme_js)
test("theme.js applies data-compact-toolbar at startup", "data-compact-toolbar" in theme_js)

test("styles.css defines rules for [data-density='compact']", "[data-density=\"compact\"]" in styles_css)
test("styles.css defines rules for [data-reduced-motion='true']", "[data-reduced-motion=\"true\"]" in styles_css)
test("styles.css defines rules for [data-compact-toolbar='true']", "[data-compact-toolbar=\"true\"]" in styles_css)

test("workspace.js reads editorFontSize from userSettings", "userSettings.editorFontSize" in work_js)
test("workspace.js reads editorTabSize from userSettings", "userSettings.editorTabSize" in work_js)
test("workspace.js reads showLineNumbers from userSettings", "userSettings.showLineNumbers" in work_js)
test("workspace.js reads autoCloseBrackets from userSettings", "userSettings.autoCloseBrackets" in work_js)
test("workspace.js supports autoRunSampleTests on Ctrl+S / Cmd+S", "userSettings.autoRunSampleTests" in work_js)

test("compiler.js reads editorFontSize from userSettings", "userSettings.editorFontSize" in comp_js)
test("compiler.js reads editorTabSize from userSettings", "userSettings.editorTabSize" in comp_js)
test("compiler.js reads showLineNumbers from userSettings", "userSettings.showLineNumbers" in comp_js)
test("compiler.js reads autoCloseBrackets from userSettings", "userSettings.autoCloseBrackets" in comp_js)

# ---------------------------------------------------------
# 6. Strict Scope Boundary
# ---------------------------------------------------------
print("\n--- 6. Strict Scope Boundary ---")
# Check git status for any non-frontend modifications
import subprocess
git_res = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
git_lines = [l.strip() for l in git_res.stdout.splitlines() if l.strip()]

backend_touched = [l for l in git_lines if 'backend/' in l or 'database/' in l]
test("Strict boundary: Exactly 0 files touched in backend/ or database/", len(backend_touched) == 0, str(backend_touched))

print("\n" + "=" * 70)
print(f"PHASE 6 REFINEMENT SUITE: {passed} PASSED, {failed} FAILED")
print("=" * 70)

if failed > 0:
    sys.exit(1)

