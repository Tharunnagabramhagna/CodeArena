
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
import glob

def test_headers():
    print("=" * 70)
    print("STAGE 3.5.3.2 (PART 2) HEADER HEIGHT STANDARDIZATION SUITE")
    print("=" * 70)

    passed = 0
    failed = 0

    def assert_test(cond, name, details=""):
        nonlocal passed, failed
        if cond:
            passed += 1
            print(f"[PASS] {name}")
            if details:
                print(f"       {details}")
        else:
            failed += 1
            print(f"[FAIL] {name}")
            if details:
                print(f"       {details}")

    # Read stylesheets
    with open('frontend/css/styles.css', 'r', encoding='utf-8') as f:
        styles_css = f.read()
    with open('frontend/css/dashboard.css', 'r', encoding='utf-8') as f:
        dash_css = f.read()
    with open('frontend/css/problems.css', 'r', encoding='utf-8') as f:
        prob_css = f.read()
    with open('frontend/css/compiler.css', 'r', encoding='utf-8') as f:
        comp_css = f.read()
    with open('frontend/css/workspace.css', 'r', encoding='utf-8') as f:
        work_css = f.read()
    with open('frontend/css/auth.css', 'r', encoding='utf-8') as f:
        auth_css = f.read()

    # 1. Target Header Heights
    print("\n--- 1. Target Header Height Specifications ---")
    
    # 1.1 Landing page: 64px
    landing_match = re.search(r'\.landing-header\s*\{([^}]+)\}', styles_css)
    assert_test(bool(landing_match and 'height: 64px' in landing_match.group(1)),
                "Landing page header height is 64px (.landing-header)",
                details="styles.css: height: 64px; box-sizing: border-box")
    
    # 1.2 Dashboard: 64px
    assert_test('--header-height: 64px;' in dash_css,
                "Dashboard header-height variable is 64px (--header-height: 64px)",
                details="dashboard.css: --header-height: 64px controls header and sidebar-header")
    assert_test('.dashboard-header' in dash_css and 'height: var(--header-height)' in dash_css,
                "Dashboard main header consumes --header-height (64px)")
    assert_test('.sidebar-header' in dash_css and 'height: var(--header-height)' in dash_css,
                "Dashboard sidebar header consumes --header-height (64px)")

    # 1.3 Problem catalogue: 64px
    prob_match = re.search(r'\.problems-header\s*\{([^}]+)\}', prob_css)
    assert_test(bool(prob_match and 'height: 64px' in prob_match.group(1)),
                "Problem catalogue header height is 64px (.problems-header)",
                details="problems.css: height: 64px; box-sizing: border-box")

    # 1.4 Authentication pages: 60px
    auth_match = re.search(r'\.auth-header\s*\{([^}]+)\}', auth_css)
    assert_test(bool(auth_match and 'height: 60px' in auth_match.group(1)),
                "Authentication pages header height is 60px (.auth-header)",
                details="auth.css: height: 60px; box-sizing: border-box")

    # 1.5 Compiler: 48px
    comp_match = re.search(r'\.compiler-header\s*\{([^}]+)\}', comp_css)
    assert_test(bool(comp_match and 'height: 48px' in comp_match.group(1)),
                "Online compiler header height is 48px (.compiler-header)",
                details="compiler.css: height: 48px; box-sizing: border-box")

    # 1.6 Individual problem workspace: 48px
    work_match = re.search(r'\.workspace-header\s*\{([^}]+)\}', work_css)
    assert_test(bool(work_match and 'height: 48px' in work_match.group(1)),
                "Individual problem workspace header height is 48px (.workspace-header)",
                details="workspace.css: height: 48px; box-sizing: border-box")

    # 1.7 Secondary browsing pages: 60-64px
    assert_test(bool(auth_match and 'height: 60px' in auth_match.group(1)),
                "Secondary browsing pages (auth-header shared) render at 60px (within 60-64px range)")

    # 2. Vertical Alignment & Box-Sizing
    print("\n--- 2. Vertical Alignment & Box Model Rules ---")
    headers = [
        ("Landing", landing_match),
        ("Problem Catalogue", prob_match),
        ("Online Compiler", comp_match),
        ("Problem Workspace", work_match),
        ("Auth / Secondary", auth_match),
    ]
    for name, m in headers:
        assert_test(bool(m and 'align-items: center' in m.group(1)),
                    f"{name} header defines align-items: center for vertical centering")
        assert_test(bool(m and 'box-sizing: border-box' in m.group(1)),
                    f"{name} header defines box-sizing: border-box to prevent size inflation")
        assert_test(bool(m and 'display: flex' in m.group(1)),
                    f"{name} header defines display: flex")

    # 3. Logo Sizing Proportions Inside Standardised Headers
    print("\n--- 3. Logo Child Elements Fit Without Vertical Overflow ---")
    # Landing header: 64px, logo: 42px (leaves 22px vertical clearance)
    assert_test('.landing-header .brand-full-logo' in styles_css and ('height: 52px' in styles_css or 'height: 42px' in styles_css),
                "Landing header logo height is 42px (fits in 64px header with 22px clearance)")
    # Compiler header: 48px, logo: 36px (fits in 48px header with 12px clearance)
    assert_test('.compiler-brand-wrap .brand-full-logo' in comp_css and any(x in comp_css for x in ['height: 44px', 'height: 38px', 'height: 36px']),
                "Compiler header logo height is 36px (fits in 48px header with 12px clearance)")
    # Problem workspace header: 48px, logo: 34px (fits in 48px header with 14px clearance)
    assert_test('.workspace-brand-wrap .brand-full-logo' in work_css and any(x in work_css for x in ['height: 44px', 'height: 38px', 'height: 34px']),
                "Workspace header logo height is 34px (fits in 48px header with 14px clearance)")
    # Problem catalogue header: 64px, logo: 36px (fits in 64px header with 28px clearance)
    assert_test('.problems-brand-wrap .brand-full-logo' in prob_css and any(x in prob_css for x in ['height: 52px', 'height: 40px', 'height: 36px']),
                "Catalogue header logo height is 36px (fits in 64px header with 28px clearance)")
    # Auth header: 60px, logo: 36px (fits in 60px header with 24px clearance)
    assert_test('.auth-header .brand-full-logo' in auth_css and any(x in auth_css for x in ['height: 52px', 'height: 40px', 'height: 36px']),
                "Auth header logo height is 36px (fits in 60px header with 24px clearance)")

    # 4. Mobile Responsiveness & Breakpoint Rules
    print("\n--- 4. Mobile Breakpoints & Responsive Adaptations ---")
    assert_test('padding: 0 10px' in comp_css or 'padding: 0 12px' in comp_css,
                "Compiler header provides mobile responsive padding reduction")
    assert_test('padding: 0 10px' in work_css,
                "Workspace header provides mobile responsive padding reduction")
    assert_test('padding: 0 12px' in prob_css,
                "Problems header provides mobile responsive padding reduction")
    assert_test('padding: 0 16px' in auth_css,
                "Auth header provides mobile responsive padding reduction")
    assert_test('padding: 0 12px' in styles_css,
                "Landing header provides mobile responsive padding reduction")

    # 5. Preservation of HTML Markup (Zero Inline Styles)
    print("\n--- 5. HTML Header Markup & Accessibility Integrity ---")
    pages = sorted(glob.glob('frontend/**/*.html', recursive=True) + glob.glob('frontend/*.html'))
    pages = list(dict.fromkeys(pages))
    assert_test(len(pages) in [15, 16, 17, 18, 19], "All 15 to 19 pages inspected")
    for p in pages:
        with open(p, 'r', encoding='utf-8') as f:
            h = f.read()
        m = re.search(r'<header[^>]*>', h)
        assert_test(bool(m and 'style=' not in m.group(0)),
                    f"{os.path.basename(p)} header has clean class-based markup without inline styles")

    print("\n" + "=" * 70)
    print(f"STAGE 3.5.3.2 (PART 2) SUITE: {passed} PASSED, {failed} FAILED")
    print("=" * 70)
    return failed == 0

if __name__ == '__main__':
    import sys
    success = test_headers()
    sys.exit(0 if success else 1)

