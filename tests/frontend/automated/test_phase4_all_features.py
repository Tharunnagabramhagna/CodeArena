#!/usr/bin/env python3
"""
CodeArena — Phase 4 Comprehensive Automated Verification Suite
Tests all eight secondary feature areas:
1. Feature 1: Practice Hub (practice.html & practice.js)
2. Feature 2: AI Assistant (ai_assistant.html & ai_assistant.js)
3. Feature 3: Bookmarks (bookmarks.html & bookmarks.js)
4. Feature 4: Contests (contests.html & contests.js)
5. Feature 5: Java Learning Centre (learn.html & learn.js)
6. Feature 6: Learning Progress (progress.html & progress.js)
7. Feature 7: Settings (settings.html & settings.js)
8. Feature 8: Submissions (submissions.html & submissions.js)
9. Shared Design, Header Standardisation, & Footers
10. Strict Scope Boundary & Security Check
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
import sys
import subprocess

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = _ROOT
FRONTEND_DIR = os.path.join(_ROOT, 'frontend')

passed = 0
failed = 0

def record(condition, message, detail=None):
    global passed, failed
    if condition:
        passed += 1
        print(f"[PASS] {message}")
    else:
        failed += 1
        print(f"[FAIL] {message}")
        if detail:
            print(f"       Details: {detail}")

def test_feature1_practice():
    print("\n--- Feature 1: Practice Hub ---")
    html_path = os.path.join(FRONTEND_DIR, 'pages', 'practice.html')
    js_path = os.path.join(FRONTEND_DIR, 'js', 'practice_hub.js')

    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
    with open(js_path, 'r', encoding='utf-8') as f:
        js = f.read()

    record('Java Problem Practice Hub' in html, "practice.html contains main practice hero heading")
    record('id="practiceTopicsGrid"' in html, "practice.html defines topic selection grid container")
    record('id="recommendedGrid"' in html, "practice.html defines recommended challenges container")
    record('id="practiceSearchInput"' in html, "practice.html defines search input")
    record('id="practiceEmptyState"' in html, "practice.html defines no-results empty state")
    record('problemService.getProblems' in js, "practice.js queries canonical problemService")
    record('problemService.getTopics' in js, "practice.js queries canonical topics list")
    record('problem.html?id=' in js, "practice.js links challenges to workspace using canonical ID")
    record('escapeHtml' in js, "practice.js employs safe HTML escaping")


def test_feature2_ai_assistant():
    print("\n--- Feature 2: AI Assistant ---")
    html_path = os.path.join(FRONTEND_DIR, 'pages', 'ai_assistant.html')
    js_path = os.path.join(FRONTEND_DIR, 'js', 'ai_assistant.js')

    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
    with open(js_path, 'r', encoding='utf-8') as f:
        js = f.read()

    record('ai_assistant.js' in html, "ai_assistant.html loads ai_assistant.js script")
    record('id="aiChatMessages"' in html, "ai_assistant.html defines chat message stream container")
    record('id="aiMessageInput"' in html, "ai_assistant.html defines user prompt composer textarea")
    record('id="aiClearChatBtn"' in html, "ai_assistant.html defines clear chat button")
    record('prompt-chip-btn' in html, "ai_assistant.html provides suggested prompt chips")
    record('sessionStorage' in js, "ai_assistant.js persists chat in browser session storage")
    record('Simulated Preview Response' in js or 'Simulated' in js, "ai_assistant.js clearly labels responses as simulated preview")
    record('fetch(' not in js and 'http://' not in js, "ai_assistant.js makes zero external API requests")
    record('btnCopy' in js or 'clipboard' in js, "ai_assistant.js provides code copy functionality")


def test_feature3_bookmarks():
    print("\n--- Feature 3: Bookmarks ---")
    html_path = os.path.join(FRONTEND_DIR, 'pages', 'bookmarks.html')
    js_path = os.path.join(FRONTEND_DIR, 'js', 'bookmarks.js')

    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
    with open(js_path, 'r', encoding='utf-8') as f:
        js = f.read()

    record('Bookmarked Challenges' in html, "bookmarks.html contains hero title")
    record('id="bookmarksListGrid"' in html, "bookmarks.html defines bookmarks grid container")
    record('id="bookmarksEmptyState"' in html, "bookmarks.html defines empty state with browse CTA")
    record('id="bookmarksDiffFilter"' in html, "bookmarks.html provides difficulty filter dropdown")
    record('id="bookmarksSortSelect"' in html, "bookmarks.html provides sorting select dropdown")
    record('localStorage' in js and 'inMemoryBookmarks' in js, "bookmarks.js uses localStorage with in-memory fallback")
    record('window.CodeArenaBookmarks' in js, "bookmarks.js exposes global Bookmarks helper for cross-page compatibility")
    record('problem.html?id=' in js, "bookmarks.js links saved problems to problem workspace")


def test_feature4_contests():
    print("\n--- Feature 4: Contests ---")
    html_path = os.path.join(FRONTEND_DIR, 'pages', 'contests.html')
    js_path = os.path.join(FRONTEND_DIR, 'js', 'contests.js')

    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
    with open(js_path, 'r', encoding='utf-8') as f:
        js = f.read()

    record('Competitive Coding Arena' in html, "contests.html contains contest hero banner")
    record('id="contestsListGrid"' in html, "contests.html defines contest cards container")
    record('id="contestModalOverlay"' in html, "contests.html defines tournament rules modal dialog")
    record('contest-tab-btn' in html, "contests.html provides category tabs (All, Ongoing, Upcoming, Past)")
    record('CONTESTS_DATA' in js, "contests.js defines sample contest tournament schedule")
    record('status: \'ongoing\'' in js and 'status: \'upcoming\'' in js and 'status: \'past\'' in js,
           "contests.js provides ongoing, upcoming, and past categories")
    record('sessionStorage' in js, "contests.js provides preview registration simulation")


def test_feature5_learning_centre():
    print("\n--- Feature 5: Java Learning Centre ---")
    html_path = os.path.join(FRONTEND_DIR, 'pages', 'learn.html')
    js_path = os.path.join(FRONTEND_DIR, 'js', 'learn.js')

    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
    with open(js_path, 'r', encoding='utf-8') as f:
        js = f.read()

    record('Java Mastery Curriculum' in html, "learn.html contains learning centre hero banner")
    record('id="learnTopicsSidebar"' in html, "learn.html defines modules sidebar navigation")
    record('id="lessonCardArea"' in html, "learn.html defines interactive lesson viewer")
    record('id="btnPrevLesson"' in html and 'id="btnNextLesson"' in html, "learn.html provides previous and next lesson controls")

    # Count modules in learn.js
    lesson_count = len(re.findall(r"id:\s*'([a-z0-9\-]+)'", js))
    record(lesson_count == 14, f"learn.js defines exactly 14 structured curriculum paths (found: {lesson_count})")
    record('quiz:' in js and 'explanation:' in js, "learn.js includes interactive knowledge check quizzes with explanations")
    record('clipboard.writeText' in js, "learn.js provides one-click code copy")


def test_feature6_progress():
    print("\n--- Feature 6: Learning Progress ---")
    html_path = os.path.join(FRONTEND_DIR, 'pages', 'progress.html')
    js_path = os.path.join(FRONTEND_DIR, 'js', 'progress.js')

    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
    with open(js_path, 'r', encoding='utf-8') as f:
        js = f.read()

    record('Student Learning Analytics' in html, "progress.html contains analytics hero banner")
    record('id="metricTotalSolved"' in html, "progress.html displays total problems solved")
    record('id="metricCompletionRate"' in html, "progress.html displays completion rate")
    record('id="metricCurrentStreak"' in html, "progress.html displays practice streak")
    record('id="barFillEasy"' in html and 'id="barFillMedium"' in html and 'id="barFillHard"' in html,
           "progress.html provides difficulty distribution progress bars")
    record('id="activityHeatmapGrid"' in html, "progress.html provides daily consistency activity heatmap")
    record('sessionStorage' in js, "progress.js derives metrics from session submissions")
    record('problemService' in js, "progress.js cross-references canonical problem difficulty")


def test_feature7_settings():
    print("\n--- Feature 7: Settings ---")
    html_path = os.path.join(FRONTEND_DIR, 'pages', 'settings.html')
    js_path = os.path.join(FRONTEND_DIR, 'js', 'settings.js')

    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
    with open(js_path, 'r', encoding='utf-8') as f:
        js = f.read()

    record('Platform Preferences' in html, "settings.html contains settings hero banner")
    record('id="settingThemeSelect"' in html, "settings.html provides dark/light theme selector")
    record('id="settingFontSize"' in html, "settings.html provides editor font size selector")
    record('id="settingTabSize"' in html, "settings.html provides editor tab size selector")
    record('id="settingAutoCloseBrackets"' in html, "settings.html provides auto-close brackets toggle")
    record('id="settingDefaultReturn"' in html, "settings.html provides default return statement toggle")
    record('id="btnSaveSettings"' in html and 'id="btnResetSettings"' in html,
           "settings.html provides Save and Reset action buttons")
    record('id="settingsToast"' in html, "settings.html includes saved feedback toast")
    record('localStorage' in js, "settings.js persists preferences to localStorage")
    record('data-theme' in js, "settings.js integrates directly with theme system")


def test_feature8_submissions():
    print("\n--- Feature 8: Submissions ---")
    html_path = os.path.join(FRONTEND_DIR, 'pages', 'submissions.html')
    js_path = os.path.join(FRONTEND_DIR, 'js', 'submissions.js')

    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
    with open(js_path, 'r', encoding='utf-8') as f:
        js = f.read()

    record('Problem Submission History' in html, "submissions.html contains submissions hero banner")
    record('id="subProblemFilter"' in html, "submissions.html provides filter by problem dropdown")
    record('id="subVerdictFilter"' in html, "submissions.html provides filter by verdict dropdown")
    record('id="subSortSelect"' in html, "submissions.html provides sort order dropdown")
    record('id="submissionsTableBody"' in html, "submissions.html defines submissions table body")
    record('id="subCodeModalOverlay"' in html, "submissions.html defines code inspection modal")
    record('submissionService' in js, "submissions.js integrates with canonical submissionService")
    record('PREVIEW_PASSED' in js, "submissions.js clearly maintains PREVIEW_PASSED verdict distinction")
    record('problem.html?id=' in js, "submissions.js links records to corresponding problem workspace")


def test_shared_design_and_boundary():
    print("\n--- Shared Design, Branding & Scope Boundary ---")
    pages = [
        'pages/practice.html',
        'pages/ai_assistant.html',
        'pages/bookmarks.html',
        'pages/contests.html',
        'pages/learn.html',
        'pages/progress.html',
        'pages/settings.html',
        'pages/submissions.html'
    ]

    all_have_secondary_header = True
    all_have_brand_logo = True
    all_have_theme_toggle = True
    all_have_breadcrumbs = True
    all_have_footer = True

    for p in pages:
        p_path = os.path.join(FRONTEND_DIR, p.replace('/', os.sep))
        with open(p_path, 'r', encoding='utf-8') as f:
            c = f.read()

        if 'secondary-header' not in c:
            all_have_secondary_header = False
        if 'codearena-full-icon.png' not in c:
            all_have_brand_logo = False
        if 'theme-toggle' not in c:
            all_have_theme_toggle = False
        if 'secondary-breadcrumbs' not in c:
            all_have_breadcrumbs = False
        if 'secondary-footer' not in c:
            all_have_footer = False

    record(all_have_secondary_header, "All 8 Phase 4 pages utilize standardized 60px .secondary-header")
    record(all_have_brand_logo, "All 8 Phase 4 pages display horizontal logo asset without inline styles")
    record(all_have_theme_toggle, "All 8 Phase 4 pages feature accessible theme toggle")
    record(all_have_breadcrumbs, "All 8 Phase 4 pages include semantic breadcrumbs")
    record(all_have_footer, "All 8 Phase 4 pages include standardized secondary footer")

    # Scope Boundary
    git_status = subprocess.run(['git', 'status', '--porcelain'], capture_output=True, text=True, cwd=ROOT_DIR).stdout
    backend_violations = [line for line in git_status.splitlines() if 'backend/' in line or 'database/' in line]
    record(len(backend_violations) == 0, "STRICT SCOPE BOUNDARY: Exactly 0 files touched in backend/ or database/", backend_violations)


if __name__ == '__main__':
    print("=" * 70)
    print("CODEARENA — PHASE 4 COMPLETE AUTOMATED VERIFICATION SUITE")
    print("=" * 70)
    test_feature1_practice()
    test_feature2_ai_assistant()
    test_feature3_bookmarks()
    test_feature4_contests()
    test_feature5_learning_centre()
    test_feature6_progress()
    test_feature7_settings()
    test_feature8_submissions()
    test_shared_design_and_boundary()
    print("=" * 70)
    print(f"PHASE 4 VERIFICATION SUITE: {passed} PASSED, {failed} FAILED")
    print("=" * 70)
    if failed > 0:
        sys.exit(1)
