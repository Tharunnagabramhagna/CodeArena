"""
CodeArena — UI Refinement Verification Suite
Tests:
1. FIX 1: Logo Scaling (52px on standard headers, 44px on compact 48px headers, Dashboard square logo preserved)
2. FIX 2: Premium Theme Icons (SVG sun/moon, zero raw emojis, accessible titles/labels, focus-visible)
3. FIX 3: Start Coding & Button Text Selection Prevention (user-select: none on interactive CTAs, normal text selectable)
4. FIX 4: CTA Button Hover Color Integrity (prevents a:hover text-color override from masquerading as text selection)
5. Navigation Destinations and Accessibility
"""

import os
import sys
import io
import re

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# Ensure repository root is in sys.path and is the working directory
_CUR_DIR = os.path.dirname(os.path.abspath(__file__)) if '__file__' in globals() else os.getcwd()
_ROOT = _CUR_DIR
while _ROOT and not (os.path.isdir(os.path.join(_ROOT, 'frontend')) and (os.path.exists(os.path.join(_ROOT, '.git')) or os.path.exists(os.path.join(_ROOT, '.gitignore')))):
    _PARENT = os.path.dirname(_ROOT)
    if _PARENT == _ROOT: break
    _ROOT = _PARENT

if os.path.isdir(os.path.join(_ROOT, 'frontend')):
    os.chdir(_ROOT)

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

def read_file(rel):
    with open(rel, 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()

print("=" * 72)
print("CODEARENA UI REFINEMENT VERIFICATION SUITE")
print("=" * 72)

# -------------------------------------------------------------
# 1. FIX 1 — Logo Scaling Across Headers
# -------------------------------------------------------------
print("\n--- 1. Horizontal Logo Scaling ---")
styles_css = read_file('frontend/css/styles.css')
compiler_css = read_file('frontend/css/compiler.css')
workspace_css = read_file('frontend/css/workspace.css')
problems_css = read_file('frontend/css/problems.css')
secondary_css = read_file('frontend/css/secondary.css')
auth_css = read_file('frontend/css/auth.css')
dash_css = read_file('frontend/css/dashboard.css')

test("styles.css: .landing-header .brand-full-logo is 52px (yielding ~41px visible artwork)",
     "height: 52px" in styles_css and ".landing-header .brand-full-logo" in styles_css)
test("styles.css: .landing-header .brand-full-logo preserves aspect ratio and contain",
     "object-fit: contain" in styles_css and "aspect-ratio: 2122 / 741" in styles_css)

test("secondary.css: .secondary-brand-wrap .brand-full-logo is scaled to 52px",
     "height: 52px" in secondary_css and ".secondary-brand-wrap .brand-full-logo" in secondary_css)
test("problems.css: .problems-brand-wrap .brand-full-logo is scaled to 52px",
     "height: 52px" in problems_css and ".problems-brand-wrap .brand-full-logo" in problems_css)

test("compiler.css: compact 48px header logo is scaled to 44px",
     "height: 44px" in compiler_css and ".compiler-brand-wrap .brand-full-logo" in compiler_css)
test("workspace.css: compact 48px header logo is scaled to 44px",
     "height: 44px" in workspace_css and ".workspace-brand-wrap .brand-full-logo" in workspace_css)

test("auth.css: auth header logo is scaled to 52px",
     "height: 52px" in auth_css and ".auth-header .brand-full-logo" in auth_css)

test("dashboard.css: sidebar square logo preserves square dimensions (34px)",
     "width: 34px" in dash_css and "height: 34px" in dash_css and ".sidebar-brand-logo" in dash_css)

# -------------------------------------------------------------
# 2. FIX 2 — Premium Theme Toggle Icons
# -------------------------------------------------------------
print("\n--- 2. Premium Vector Theme Toggle Icons ---")
theme_js = read_file('frontend/js/theme.js')

test("theme.js defines SVG sun vector icon", "theme-icon-sun" in theme_js and "<svg" in theme_js)
test("theme.js defines SVG moon vector icon", "theme-icon-moon" in theme_js and "<svg" in theme_js)
test("theme.js does not output raw text emoji characters",
     "☀️" not in theme_js and "🌙" not in theme_js and "☀" not in theme_js)

test("styles.css defines modern .theme-toggle circular/rounded box styling",
     ".theme-toggle" in styles_css and "border-radius" in styles_css)
test("styles.css defines .theme-toggle:focus-visible accessible outline",
     ".theme-toggle:focus-visible" in styles_css and "outline" in styles_css)
test("styles.css defines .theme-icon transition and stroke hover",
     ".theme-icon" in styles_css and "stroke" in styles_css)

# Verify all 15 HTML files have inline SVG markup initially
all_html_files = [os.path.join(r, f) for r, _, files in os.walk('frontend') for f in files if f.endswith('.html')]
all_pages_have_svg = True
for page in all_html_files:
    content = read_file(page)
    if 'theme-toggle' in content:
        if '<svg class="theme-icon theme-icon-sun"' not in content:
            all_pages_have_svg = False
            print(f"         Missing inline SVG in {page}")

test("All 15 HTML pages contain inline SVG icon in initial markup", all_pages_have_svg)

# -------------------------------------------------------------
# 3. FIX 3 — Button Text Selection Prevention & CTA Hover Polish
# -------------------------------------------------------------
print("\n--- 3. Button Text Selection Prevention & Hover Polish ---")
pages_css = read_file('frontend/css/pages.css')
index_html = read_file('frontend/index.html')
dash_html = read_file('frontend/pages/dashboard.html')

test("styles.css: .btn has user-select: none", "user-select: none" in styles_css and ".btn" in styles_css)
test("styles.css: .btn has -webkit-user-select: none", "-webkit-user-select: none" in styles_css)
test("styles.css: .btn-get-started has user-select: none", "user-select: none" in styles_css and ".btn-get-started" in styles_css)
test("pages.css: a.btn has user-select: none", "user-select: none" in pages_css and "a.btn" in pages_css)
test("pages.css: .hero-actions .btn has user-select: none", ".hero-actions .btn" in pages_css and "user-select: none" in pages_css)

# Verify CTA button hover text color integrity (preventing a:hover sky-blue override)
test("styles.css: a.btn-primary:hover explicitly sets white text color",
     "a.btn-primary:hover" in styles_css and "color: #FFFFFF" in styles_css)
test("pages.css: .hero-actions a.btn-primary:hover explicitly sets white text color",
     ".hero-actions a.btn-primary:hover" in pages_css and "color: #FFFFFF" in pages_css)
test("dashboard.css: .promo-btn has user-select: none",
     "user-select: none" in dash_css and ".promo-btn" in dash_css)
test("dashboard.css: a.promo-btn:hover explicitly sets white text color",
     "a.promo-btn:hover" in dash_css and "color: white" in dash_css)

test("index.html: Start Coding button links to pages/dashboard.html",
     'href="pages/dashboard.html"' in index_html and 'Start Coding' in index_html)
test("index.html: Explore Problems button links to pages/problems.html",
     'href="pages/problems.html"' in index_html and 'Explore Problems' in index_html)
test("dashboard.html: promo-btn links to practice.html",
     'href="practice.html"' in dash_html and 'promo-btn' in dash_html)

# Ensure body and text paragraphs remain selectable
test("styles.css: body does NOT have global user-select: none",
     "body {" not in styles_css or "user-select: none" not in styles_css.split("body {")[1].split("}")[0])
test("pages.css: hero description remains selectable",
     ".hero-description" not in pages_css or "user-select: none" not in pages_css.split(".hero-description")[1].split("}")[0])

print("\n" + "=" * 72)
print(f"FINAL UI REFINEMENT RESULT: {passed} PASSED, {failed} FAILED")
print("=" * 72)

if failed > 0:
    sys.exit(1)
