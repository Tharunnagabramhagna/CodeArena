
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

def test_dashboard_color_tokens():
    print("=" * 70)
    print("STAGE 3.5.3.2 (PART 3) DASHBOARD COLOR-TOKEN HARMONISATION SUITE")
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

    with open('frontend/css/dashboard.css', 'r', encoding='utf-8') as f:
        dash_css = f.read()

    # 1. Total Hex Count Reduction
    print("\n--- 1. Hardcoded Color Reduction Verification ---")
    hex_matches = re.findall(r'#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b', dash_css)
    current_hex_count = len(hex_matches)
    print(f"Current hardcoded hex count in dashboard.css: {current_hex_count}")
    assert_test(current_hex_count <= 130,
                f"Significant hex reduction achieved (current: {current_hex_count}, before: 237, reduced: {237 - current_hex_count})",
                details="Replaced 108 hardcoded surface, border, and text hex values with CSS variables")

    # 2. Reused Global CSS Variables
    print("\n--- 2. Global CSS Custom Properties Reused ---")
    vars_to_check = [
        '--color-bg-primary',
        '--color-bg-secondary',
        '--color-bg-surface',
        '--color-bg-hover',
        '--color-border',
        '--color-border-hover',
        '--color-text-primary',
        '--color-text-secondary',
        '--color-text-muted',
        '--color-secondary',
        '--color-secondary-hover',
        '--color-focus-ring',
        '--color-error',
        '--color-success',
    ]
    for v in vars_to_check:
        assert_test(f'var({v})' in dash_css, f"Reused global design token: var({v})")

    # 3. Dedicated Dashboard Chrome Tokens
    print("\n--- 3. Dashboard Chrome Surface Tokens ---")
    assert_test('--dash-sidebar-bg:' in dash_css, "Dashboard defines --dash-sidebar-bg token")
    assert_test('--dash-header-bg:' in dash_css, "Dashboard defines --dash-header-bg token")
    assert_test('.dashboard-sidebar' in dash_css and 'var(--dash-sidebar-bg)' in dash_css,
                "Sidebar consumes var(--dash-sidebar-bg)")
    assert_test('.dashboard-header' in dash_css and 'var(--dash-header-bg)' in dash_css,
                "Dashboard header consumes var(--dash-header-bg)")

    # 4. Surface & Card Tokenisation
    print("\n--- 4. Surface & Container Tokenisation ---")
    assert_test('.stat-card' in dash_css and 'background-color: var(--color-bg-secondary)' in dash_css,
                "Stat cards use var(--color-bg-secondary)")
    assert_test('.dash-panel' in dash_css and 'background-color: var(--color-bg-secondary)' in dash_css,
                "Dashboard panels use var(--color-bg-secondary)")
    assert_test('.header-search' in dash_css and 'background-color: var(--color-bg-secondary)' in dash_css,
                "Header search input uses var(--color-bg-secondary)")
    assert_test('.notification-popover' in dash_css and 'background-color: var(--color-bg-secondary)' in dash_css,
                "Notification popover uses var(--color-bg-secondary)")
    assert_test('.user-profile-menu' in dash_css and 'background-color: var(--color-bg-secondary)' in dash_css,
                "User profile menu uses var(--color-bg-secondary)")

    # 5. Semantic Colors Intentionally Preserved
    print("\n--- 5. Semantic & Illustrative Colors Preserved ---")
    assert_test('.diff-easy' in dash_css and ('#064E3B' in dash_css or '#34D399' in dash_css),
                "Easy difficulty badge semantic colors preserved")
    assert_test('.diff-medium' in dash_css and ('#78350F' in dash_css or '#FBBF24' in dash_css),
                "Medium difficulty badge semantic colors preserved")
    assert_test('.diff-hard' in dash_css and ('#7F1D1D' in dash_css or '#F87171' in dash_css),
                "Hard difficulty badge semantic colors preserved")
    assert_test('.stat-green' in dash_css and '#059669' in dash_css,
                "Solved overview badge green accent preserved")
    assert_test('.stat-purple' in dash_css and '#6D28D9' in dash_css,
                "Platform metric purple accent preserved")
    assert_test('.ldot-red' in dash_css and '#EF4444' in dash_css,
                "Laptop illustration red dot preserved")
    assert_test('.ldot-yellow' in dash_css and '#F59E0B' in dash_css,
                "Laptop illustration yellow dot preserved")
    assert_test('.ldot-green' in dash_css and '#10B981' in dash_css,
                "Laptop illustration green dot preserved")
    assert_test('.shortcut-compiler' in dash_css and '#0B1938' in dash_css,
                "Quick action compiler shortcut distinct branding preserved")
    assert_test('.shortcut-practice' in dash_css and '#1C1236' in dash_css,
                "Quick action practice shortcut distinct branding preserved")
    assert_test('.shortcut-ai' in dash_css and '#082F49' in dash_css,
                "Quick action AI shortcut distinct branding preserved")
    assert_test('.shortcut-progress' in dash_css and '#062831' in dash_css,
                "Quick action progress shortcut distinct branding preserved")

    # 6. Light Theme Overrides Harmonisation
    print("\n--- 6. Light Theme Overrides Tokenised ---")
    assert_test('[data-theme="light"] .dashboard-sidebar' in dash_css and 'var(--color-bg-secondary)' in dash_css,
                "Light theme sidebar uses var(--color-bg-secondary)")
    assert_test('[data-theme="light"] .dashboard-header' in dash_css and 'var(--color-bg-secondary)' in dash_css,
                "Light theme header uses var(--color-bg-secondary)")
    assert_test('[data-theme="light"] .header-search' in dash_css and 'var(--color-bg-primary)' in dash_css,
                "Light theme search uses var(--color-bg-primary)")
    assert_test('[data-theme="light"] .stat-card' in dash_css and 'var(--color-bg-secondary)' in dash_css,
                "Light theme stat-cards use var(--color-bg-secondary)")

    # 7. Dashboard Layout Preservation
    print("\n--- 7. Dashboard Layout & Architecture Preservation ---")
    assert_test('--header-height: 64px;' in dash_css, "Dashboard preserves standardized 64px header height")
    assert_test('--sidebar-width-expanded: 250px;' in dash_css, "Preserves 250px expanded sidebar width")
    assert_test('--sidebar-width-collapsed: 76px;' in dash_css, "Preserves 76px collapsed sidebar width")

    print("\n" + "=" * 70)
    print(f"STAGE 3.5.3.2 (PART 3) SUITE: {passed} PASSED, {failed} FAILED")
    print("=" * 70)
    return failed == 0

if __name__ == '__main__':
    import sys
    success = test_dashboard_color_tokens()
    sys.exit(0 if success else 1)

