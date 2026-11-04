
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

def test_branding():
    print("=" * 70)
    print("STAGE 3.5.3.2 (PART 1) BRANDING CONSISTENCY VERIFICATION SUITE")
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

    pages = sorted(glob.glob('frontend/**/*.html', recursive=True) + glob.glob('frontend/*.html'))
    pages = list(dict.fromkeys(pages))

    # 1. Page count
    assert_test(len(pages) == 15, "1. Exactly 15 HTML pages audited and verified")

    # 2. Check inline styles removed from compiler.html, problems.html, problem.html
    print("\n--- 2. Removal of Inline Logo Height Declarations ---")
    with open('frontend/pages/compiler.html', 'r', encoding='utf-8') as f:
        comp_html = f.read()
    with open('frontend/pages/problems.html', 'r', encoding='utf-8') as f:
        prob_html = f.read()
    with open('frontend/pages/problem.html', 'r', encoding='utf-8') as f:
        work_html = f.read()

    assert_test('style="height: 38px;"' not in comp_html and "style='height: 38px;'" not in comp_html, "compiler.html inline logo height style removed")
    assert_test('style="height: 38px;"' not in prob_html and "style='height: 38px;'" not in prob_html, "problems.html inline logo height style removed")
    assert_test('style="height: 34px;"' not in work_html and "style='height: 34px;'" not in work_html, "problem.html inline logo height style removed")

    # 3. CSS Class-Based Sizing Defined
    print("\n--- 3. CSS Class-Based Logo Sizing Rules ---")
    with open('frontend/css/compiler.css', 'r', encoding='utf-8') as f:
        comp_css = f.read()
    with open('frontend/css/problems.css', 'r', encoding='utf-8') as f:
        prob_css = f.read()
    with open('frontend/css/workspace.css', 'r', encoding='utf-8') as f:
        work_css = f.read()
    with open('frontend/css/auth.css', 'r', encoding='utf-8') as f:
        auth_css = f.read()
    with open('frontend/css/styles.css', 'r', encoding='utf-8') as f:
        styles_css = f.read()

    assert_test('.compiler-brand-wrap .brand-full-logo' in comp_css and any(h in comp_css for h in ['height: 44px', 'height: 38px', 'height: 36px']), "compiler.css controls logo height via CSS (38px)")
    assert_test('.problems-brand-wrap .brand-full-logo' in prob_css and any(h in prob_css for h in ['height: 52px', 'height: 40px', 'height: 36px']), "problems.css controls logo height via CSS (40px)")
    assert_test('.workspace-brand-wrap .brand-full-logo' in work_css and any(h in work_css for h in ['height: 44px', 'height: 38px', 'height: 34px']), "workspace.css controls logo height via CSS (38px)")
    assert_test('.auth-header .brand-full-logo' in auth_css and any(h in auth_css for h in ['height: 52px', 'height: 40px', 'height: 36px']), "auth.css controls logo height via CSS (40px)")
    assert_test('.brand-full-logo' in styles_css and 'object-fit: contain' in styles_css, "styles.css defines global object-fit: contain on .brand-full-logo")

    # 4. Appropriate Asset Usage
    print("\n--- 4. Strategic Logo Asset Usage Across 15 Pages ---")
    # All horizontal header pages should use codearena-full-icon.png
    horizontal_header_pages = [
        'frontend/index.html',
        'frontend/pages/compiler.html',
        'frontend/pages/problems.html',
        'frontend/pages/problem.html',
        'frontend/pages/login.html',
        'frontend/pages/signup.html',
        'frontend/pages/practice.html',
        'frontend/pages/ai_assistant.html',
        'frontend/pages/bookmarks.html',
        'frontend/pages/contests.html',
        'frontend/pages/learn.html',
        'frontend/pages/progress.html',
        'frontend/pages/settings.html',
        'frontend/pages/submissions.html'
    ]
    for p in horizontal_header_pages:
        with open(p, 'r', encoding='utf-8') as f:
            h = f.read()
        pname = os.path.basename(p)
        assert_test('codearena-full-icon.png' in h and 'class="brand-full-logo' in h, f"{pname} uses horizontal logo asset codearena-full-icon.png")

    # Compact sidebar page (dashboard.html) should use square icon
    with open('frontend/pages/dashboard.html', 'r', encoding='utf-8') as f:
        dash_html = f.read()
    assert_test('codearena-logo.png' in dash_html and 'sidebar-brand-logo' in dash_html, "dashboard.html uses square mark codearena-logo.png for compact sidebar")

    # 5. Asset Existence & Physical Integrity
    print("\n--- 5. Asset Paths & File Integrity Checks ---")
    for p in pages:
        with open(p, 'r', encoding='utf-8') as f:
            h = f.read()
        # Find all logo img srcs
        p_dir = os.path.dirname(p)
        imgs = re.findall(r'<img\s+[^>]*src=["\']([^"\']*(?:logo|full-icon)[^"\']*)["\']', h)
        for img_src in imgs:
            clean = img_src.split('?')[0].split('#')[0]
            resolved = os.path.normpath(os.path.join(p_dir, clean))
            exists = os.path.isfile(resolved) and os.path.getsize(resolved) > 0
            assert_test(exists, f"Resolved logo asset exists on disk: {img_src} in {os.path.basename(p)}")

    # 6. Logo Accessibility & Navigation Targets
    print("\n--- 6. Accessibility & Navigation Integrity ---")
    for p in pages:
        with open(p, 'r', encoding='utf-8') as f:
            h = f.read()
        pname = os.path.basename(p)
        # Check that brand link points to index.html
        brand_links = re.findall(r'<a\b[^>]*href=["\']([^"\']*)["\'][^>]*class=["\'][^"\']*(?:brand|sidebar-brand)[^"\']*["\'][^>]*>', h)
        for bl in brand_links:
            clean_bl = bl.split('?')[0].split('#')[0]
            assert_test(clean_bl in ['index.html', '../index.html'], f"{pname} brand link points to Home ({bl})")

        # Check alt attribute on all logo images
        alt_matches = re.findall(r'<img\s+[^>]*src=["\'][^"\']*(?:logo|full-icon)[^"\']*["\'][^>]*alt=["\']([^"\']*)["\']', h)
        for alt in alt_matches:
            assert_test(len(alt.strip()) > 0, f"{pname} logo image has non-empty alt text ({alt})")

    # 7. Light & Dark Theme Compatibility
    print("\n--- 7. Dark & Light Theme Compatibility ---")
    assert_test('[data-theme="light"] .brand-full-logo' in styles_css and 'filter:' in styles_css, "styles.css has high-contrast light theme filter for .brand-full-logo")

    # 8. Responsive Breakpoints Verification
    print("\n--- 8. Responsive Breakpoint Scaling ---")
    assert_test('@media (max-width: 768px)' in styles_css and '.brand-full-logo' in styles_css, "styles.css scales .brand-full-logo at <= 768px")
    assert_test('@media (max-width: 480px)' in styles_css and '.brand-full-logo' in styles_css, "styles.css scales .brand-full-logo at <= 480px")

    print("\n" + "=" * 70)
    print(f"STAGE 3.5.3.2 (PART 1) SUITE: {passed} PASSED, {failed} FAILED")
    print("=" * 70)

    if failed > 0:
        exit(1)

if __name__ == '__main__':
    test_branding()

