#!/usr/bin/env python3
"""
CodeArena — Stage 3.5.3.2 Final QA & Consistency Verification Suite
Tests all remaining improvements:
- Task A: Problem Catalogue Footer
- Task B: Standardise Monospace Typography
- Task C: Final Logo & Branding Audit (15 HTML Pages)
- Task D: Responsive Breakpoint Harmonisation
- Task E: Compiler and Workspace Breadcrumb Consistency
- Task F: Cross-Page Visual & Theme Consistency
- Task G: Functional Regression Protection
- Task H: Security, Boundary, & Accessibility Verification
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

def check_task_a():
    print("\n--- Task A: Problem Catalogue Footer ---")
    html_path = os.path.join(FRONTEND_DIR, 'pages', 'problems.html')
    css_path = os.path.join(FRONTEND_DIR, 'css', 'problems.css')
    
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
    with open(css_path, 'r', encoding='utf-8') as f:
        css = f.read()

    # 1. Semantic footer element in problems.html
    has_footer = '<footer class="catalogue-footer" role="contentinfo">' in html
    record(has_footer, "problems.html contains semantic footer with role='contentinfo'")

    # 2. Brand, links, copyright
    has_brand = 'class="brand-full-logo footer-full-logo"' in html
    record(has_brand, "problems.html footer contains CodeArena full logo asset")
    
    has_links = 'compiler.html' in html and 'dashboard.html' in html and '../index.html' in html
    record(has_links, "problems.html footer contains links to Home, Compiler, Dashboard")

    has_copy = '&copy; 2026 CodeArena. Built for learners, by learners.' in html
    record(has_copy, "problems.html footer contains standardized 2026 copyright notice")

    # 3. CSS rules in problems.css
    has_margin_auto = 'margin-top: auto;' in css
    record(has_margin_auto, "problems.css declares margin-top: auto on .catalogue-footer for natural document flow")

    has_footer_tokens = 'var(--color-bg-secondary)' in css and 'var(--color-border)' in css and 'var(--color-text-muted)' in css
    record(has_footer_tokens, "problems.css uses semantic design tokens for footer surfaces, borders, and typography")

    has_footer_responsive = 'catalogue-footer-container' in css and '@media (max-width: 768px)' in css
    record(has_footer_responsive, "problems.css provides responsive container stacking at <= 768px")


def check_task_b():
    print("\n--- Task B: Monospace Typography Standardisation ---")
    styles_css = os.path.join(FRONTEND_DIR, 'css', 'styles.css')
    compiler_css = os.path.join(FRONTEND_DIR, 'css', 'compiler.css')
    workspace_css = os.path.join(FRONTEND_DIR, 'css', 'workspace.css')

    with open(styles_css, 'r', encoding='utf-8') as f:
        styles = f.read()
    with open(compiler_css, 'r', encoding='utf-8') as f:
        comp = f.read()
    with open(workspace_css, 'r', encoding='utf-8') as f:
        work = f.read()

    # Global token definition in styles.css
    has_global_token = "--font-family-mono: 'Cascadia Code', 'Fira Code', 'JetBrains Mono', Consolas, 'Courier New', monospace;" in styles
    record(has_global_token, "styles.css defines comprehensive modern monospace font stack in --font-family-mono")

    # Base typography rule in styles.css
    has_base_code = 'code,' in styles and 'pre' in styles and 'font-family: var(--font-family-mono);' in styles
    record(has_base_code, "styles.css assigns var(--font-family-mono) to base code/pre elements")

    # Zero hardcoded font stacks in compiler.css
    hardcoded_comp = re.findall(r'font-family:\s*[^;]*(?:Consolas|Courier|Cascadia|Fira|JetBrains)[^;]*;', comp)
    record(len(hardcoded_comp) == 0, f"compiler.css has zero hardcoded monospace stacks (found: {len(hardcoded_comp)})")

    # Zero hardcoded font stacks in workspace.css
    hardcoded_work = re.findall(r'font-family:\s*[^;]*(?:Consolas|Courier|Cascadia|Fira|JetBrains)[^;]*;', work)
    record(len(hardcoded_work) == 0, f"workspace.css has zero hardcoded monospace stacks (found: {len(hardcoded_work)})")

    # var(--font-family-mono) used in compiler.css
    comp_mono_refs = comp.count('var(--font-family-mono)')
    record(comp_mono_refs >= 5, f"compiler.css correctly references var(--font-family-mono) (count: {comp_mono_refs})")

    # var(--font-family-mono) used in workspace.css
    work_mono_refs = work.count('var(--font-family-mono)')
    record(work_mono_refs >= 10, f"workspace.css correctly references var(--font-family-mono) (count: {work_mono_refs})")


def check_task_c():
    print("\n--- Task C: 15-Page Logo & Branding Audit ---")
    pages = [
        'index.html',
        'pages/dashboard.html',
        'pages/compiler.html',
        'pages/problem.html',
        'pages/problems.html',
        'pages/login.html',
        'pages/signup.html',
        'pages/practice.html',
        'pages/contests.html',
        'pages/learn.html',
        'pages/ai_assistant.html',
        'pages/progress.html',
        'pages/bookmarks.html',
        'pages/settings.html',
        'pages/submissions.html'
    ]
    record(len(pages) == 15, "Auditing exactly 15 frontend pages")

    inline_logo_issues = []
    missing_alt = []
    broken_assets = []

    for p in pages:
        p_path = os.path.join(FRONTEND_DIR, p.replace('/', os.sep))
        with open(p_path, 'r', encoding='utf-8') as f:
            c = f.read()

        # Find img tags for logos
        img_tags = re.findall(r'<img[^>]*class="[^"]*(?:brand|logo)[^"]*"[^>]*>', c, re.IGNORECASE)
        for tag in img_tags:
            if 'style=' in tag and ('height' in tag or 'width' in tag):
                inline_logo_issues.append((p, tag))
            if 'alt=' not in tag or re.search(r'alt=["\']\s*["\']', tag):
                missing_alt.append((p, tag))
            
            # Asset exists
            src_match = re.search(r'src=["\']([^"\']+)["\']', tag)
            if src_match:
                rel_src = src_match.group(1)
                asset_dir = os.path.dirname(p_path)
                abs_asset = os.path.normpath(os.path.join(asset_dir, rel_src))
                if not os.path.exists(abs_asset):
                    broken_assets.append((p, rel_src))

    record(len(inline_logo_issues) == 0, "All 15 pages have zero inline height/width styles on logos", inline_logo_issues)
    record(len(missing_alt) == 0, "All logo images possess meaningful alt text across 15 pages", missing_alt)
    record(len(broken_assets) == 0, "All logo src attributes resolve to existing files on disk", broken_assets)


def check_task_d():
    print("\n--- Task D: Responsive Breakpoint Harmonisation ---")
    css_path = os.path.join(FRONTEND_DIR, 'css', 'problems.css')
    comp_css = os.path.join(FRONTEND_DIR, 'css', 'compiler.css')
    work_css = os.path.join(FRONTEND_DIR, 'css', 'workspace.css')

    with open(css_path, 'r', encoding='utf-8') as f:
        prob_css = f.read()
    with open(comp_css, 'r', encoding='utf-8') as f:
        c_css = f.read()
    with open(work_css, 'r', encoding='utf-8') as f:
        w_css = f.read()

    # Redundant 580px removed from problems.css
    has_580 = '580px' in prob_css
    record(not has_580, "Redundant 580px media query removed and harmonized into 640px in problems.css")

    # 640px and 480px in problems.css
    record('max-width: 640px' in prob_css, "problems.css defines standard 640px breakpoint for table and header compaction")
    record('max-width: 480px' in prob_css, "problems.css defines standard 480px breakpoint for mobile action bar")

    # 640px and 480px in compiler.css
    record('max-width: 640px' in c_css, "compiler.css defines standard 640px breakpoint for header and breadcrumbs")
    record('max-width: 480px' in c_css, "compiler.css defines standard 480px breakpoint for compact header actions")

    # 640px and 480px in workspace.css
    record('max-width: 640px' in w_css, "workspace.css defines standard 640px breakpoint for header, breadcrumbs, and toolbar")
    record('max-width: 480px' in w_css, "workspace.css defines standard 480px breakpoint for compact header actions")


def check_task_e():
    print("\n--- Task E: Breadcrumb Consistency ---")
    comp_css = os.path.join(FRONTEND_DIR, 'css', 'compiler.css')
    work_css = os.path.join(FRONTEND_DIR, 'css', 'workspace.css')
    prob_css = os.path.join(FRONTEND_DIR, 'css', 'problems.css')

    with open(comp_css, 'r', encoding='utf-8') as f:
        c_css = f.read()
    with open(work_css, 'r', encoding='utf-8') as f:
        w_css = f.read()
    with open(prob_css, 'r', encoding='utf-8') as f:
        p_css = f.read()

    # Breadcrumb container gap and font-size
    record('font-size: 0.84rem;' in c_css and 'gap: 8px;' in c_css, "compiler.css breadcrumbs use font-size: 0.84rem and gap: 8px")
    record('font-size: 0.84rem;' in w_css and 'gap: 8px;' in w_css, "workspace.css breadcrumbs aligned to font-size: 0.84rem and gap: 8px")
    record('font-size: 0.84rem;' in p_css and 'gap: 8px;' in p_css, "problems.css breadcrumbs match font-size: 0.84rem and gap: 8px")

    # Crumb separator font size
    record('.compiler-breadcrumbs .crumb-sep {\n  color: var(--color-border);\n  user-select: none;\n  font-size: 0.75rem;' in c_css or 'font-size: 0.75rem;' in c_css,
           "compiler.css breadcrumb separator is 0.75rem")
    record('font-size: 0.75rem;' in w_css and '.workspace-breadcrumbs .crumb-sep' in w_css,
           "workspace.css breadcrumb separator aligned to 0.75rem")

    # Crumb current styling (font-weight: 600, text ellipsis)
    record('max-width: 220px;' in c_css and 'text-overflow: ellipsis;' in c_css,
           "compiler.css current crumb has max-width: 220px and ellipsis")
    record('max-width: 220px;' in w_css and 'text-overflow: ellipsis;' in w_css,
           "workspace.css current crumb has max-width: 220px and ellipsis")


def check_task_f_and_g():
    print("\n--- Tasks F & G: Cross-Page Consistency & Functional Integrity ---")
    pages = [
        'index.html',
        'pages/dashboard.html',
        'pages/compiler.html',
        'pages/problem.html',
        'pages/problems.html',
        'pages/login.html',
        'pages/signup.html',
        'pages/practice.html',
        'pages/contests.html',
        'pages/learn.html',
        'pages/ai_assistant.html',
        'pages/progress.html',
        'pages/bookmarks.html',
        'pages/settings.html',
        'pages/submissions.html'
    ]

    all_have_theme_js = True
    all_have_theme_toggle = True
    for p in pages:
        p_path = os.path.join(FRONTEND_DIR, p.replace('/', os.sep))
        with open(p_path, 'r', encoding='utf-8') as f:
            c = f.read()
        if 'theme.js' not in c:
            all_have_theme_js = False
        if 'theme-toggle' not in c:
            all_have_theme_toggle = False

    record(all_have_theme_js, "All 15 frontend pages include theme.js in <head>")
    record(all_have_theme_toggle, "All 15 frontend pages include accessible .theme-toggle button")

    # Check JS integrity
    api_js = os.path.join(FRONTEND_DIR, 'js', 'api.js')
    with open(api_js, 'r', encoding='utf-8') as f:
        api = f.read()
    record('problemService' in api and 'MOCK_PROBLEMS' in api, "api.js canonical problem catalogue is intact")

    prob_js = os.path.join(FRONTEND_DIR, 'js', 'problems.js')
    with open(prob_js, 'r', encoding='utf-8') as f:
        pjs = f.read()
    record('catalogueSearchInput' in pjs and 'difficultyFilter' in pjs, "problems.js search and filter logic intact")

    work_js = os.path.join(FRONTEND_DIR, 'js', 'workspace.js')
    with open(work_js, 'r', encoding='utf-8') as f:
        wjs = f.read()
    record('starterReturnToggle' in wjs and 'runSampleTests' in wjs, "workspace.js return toggle and test runner intact")


def check_task_h():
    print("\n--- Task H: Security, Boundary, & Accessibility Verification ---")
    # 1. Strictly zero backend/database files modified
    import subprocess
    git_status = subprocess.run(['git', 'status', '--porcelain'], capture_output=True, text=True, cwd=ROOT_DIR).stdout
    backend_touches = [line for line in git_status.splitlines() if 'backend/' in line or 'database/' in line]
    record(len(backend_touches) == 0, "STRICT SCOPE BOUNDARY: Exactly 0 files touched in backend/ or database/", backend_touches)

    # 2. No live backend calls hardcoded in JS
    js_files = []
    for root, dirs, files in os.walk(os.path.join(FRONTEND_DIR, 'js')):
        for file in files:
            if file.endswith('.js'):
                js_files.append(os.path.join(root, file))

    live_api_calls = []
    for jf in js_files:
        with open(jf, 'r', encoding='utf-8') as f:
            code = f.read()
        if re.search(r'http://(?:localhost|127\.0\.0\.1):8080', code):
            live_api_calls.append(jf)

    record(len(live_api_calls) == 0, "Zero active backend HTTP connections in frontend code (preview-safe)", live_api_calls)

    # 3. No hidden test cases leaked in frontend
    hidden_test_leaks = []
    for jf in js_files:
        with open(jf, 'r', encoding='utf-8') as f:
            code = f.read()
        if 'hiddenTests' in code or 'hidden_test_cases' in code:
            hidden_test_leaks.append(jf)
    record(len(hidden_test_leaks) == 0, "Zero hidden test case leaks in client JavaScript", hidden_test_leaks)


if __name__ == '__main__':
    print("=" * 70)
    print("CODEARENA — STAGE 3.5.3.2 FINAL QA & CONSISTENCY VERIFICATION")
    print("=" * 70)
    check_task_a()
    check_task_b()
    check_task_c()
    check_task_d()
    check_task_e()
    check_task_f_and_g()
    check_task_h()
    print("=" * 70)
    print(f"STAGE 3.5.3.2 FINAL SUITE: {passed} PASSED, {failed} FAILED")
    print("=" * 70)
    if failed > 0:
        sys.exit(1)
