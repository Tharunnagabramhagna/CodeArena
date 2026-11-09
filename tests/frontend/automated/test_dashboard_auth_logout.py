"""
CodeArena — Dashboard Authentication State & Logout Verification Suite
Tests:
1. Unified frontend authentication source across Dashboard & AI Assistant
2. Dashboard guest state: Log In and Sign Up visible, profile menu hidden, logout hidden
3. Dashboard authenticated state: Log In and Sign Up hidden, user profile area visible, display name and email rendered
4. Compact account dropdown: Account name/email header, My Progress, Settings, Log Out
5. Dropdown accessibility: Escape key handling, outside click dismissal, keyboard navigation
6. Logout workflow: Confirmation modal, complete session cleanup (both canonical & legacy keys), immediate UI reversion to guest
7. AI Assistant integration: Unified auth check, same user identity, redirection on logout
8. CSS styling & responsive adaptivity: Dark & light theme tokens, mobile layout stability
"""

import os
import re
import unittest

WORKSPACE_ROOT = r"C:\CodeArena"
DASH_HTML_PATH = os.path.join(WORKSPACE_ROOT, "frontend", "pages", "dashboard.html")
DASH_JS_PATH = os.path.join(WORKSPACE_ROOT, "frontend", "js", "dashboard.js")
DASH_CSS_PATH = os.path.join(WORKSPACE_ROOT, "frontend", "css", "dashboard.css")
API_JS_PATH = os.path.join(WORKSPACE_ROOT, "frontend", "js", "api.js")
AI_JS_PATH = os.path.join(WORKSPACE_ROOT, "frontend", "js", "ai_assistant.js")
AUTH_JS_PATH = os.path.join(WORKSPACE_ROOT, "frontend", "js", "auth.js")

class TestDashboardAuthLogout(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(DASH_HTML_PATH, "r", encoding="utf-8") as f:
            cls.dash_html = f.read()
        with open(DASH_JS_PATH, "r", encoding="utf-8") as f:
            cls.dash_js = f.read()
        with open(DASH_CSS_PATH, "r", encoding="utf-8") as f:
            cls.dash_css = f.read()
        with open(API_JS_PATH, "r", encoding="utf-8") as f:
            cls.api_js = f.read()
        with open(AI_JS_PATH, "r", encoding="utf-8") as f:
            cls.ai_js = f.read()
        with open(AUTH_JS_PATH, "r", encoding="utf-8") as f:
            cls.auth_js = f.read()

    # --------------------------------------------------------------------------
    # 1. Unified Authentication Architecture in api.js
    # --------------------------------------------------------------------------
    def test_api_js_storage_keys_synchronization(self):
        """api.js must support both canonical and legacy auth storage keys without discrepancy."""
        self.assertIn("codearena_preview_auth_user", self.api_js)
        self.assertIn("codearena_auth_user", self.api_js)
        self.assertIn("AUTH_STORAGE_KEY", self.api_js)
        self.assertIn("LEGACY_AUTH_STORAGE_KEY", self.api_js)

    def test_auth_mock_adapter_is_authenticated_checks_both(self):
        """authMockAdapter.isAuthenticated() must verify presence in either shared key."""
        self.assertIn("_storageGet(AUTH_STORAGE_KEY) || _storageGet(LEGACY_AUTH_STORAGE_KEY)", self.api_js)

    def test_auth_mock_adapter_logout_clears_all_storage(self):
        """authMockAdapter.logout() must purge both storage keys from local and session storage."""
        self.assertIn("_storageRemove(AUTH_STORAGE_KEY)", self.api_js)
        self.assertIn("_storageRemove(LEGACY_AUTH_STORAGE_KEY)", self.api_js)
        self.assertIn("removeItem(AUTH_STORAGE_KEY)", self.api_js)
        self.assertIn("removeItem(LEGACY_AUTH_STORAGE_KEY)", self.api_js)

    def test_auth_service_dispatches_auth_changed_event(self):
        """authService must dispatch codearena:auth-changed event on login and logout."""
        self.assertIn("codearena:auth-changed", self.api_js)
        self.assertIn("action: 'logout'", self.api_js)
        self.assertIn("action: 'login'", self.api_js)

    def test_auth_service_exposes_sync_getter(self):
        """authService must expose getCurrentUserSync for instant UI initialization."""
        self.assertIn("getCurrentUserSync", self.api_js)

    # --------------------------------------------------------------------------
    # 2. Dashboard HTML Structure & Controls
    # --------------------------------------------------------------------------
    def test_dashboard_guest_actions_present(self):
        """dashboard.html must contain #guestAuthActions with Log In and Sign Up."""
        self.assertIn('id="guestAuthActions"', self.dash_html)
        self.assertIn('dash-auth-login', self.dash_html)
        self.assertIn('dash-auth-signup', self.dash_html)

    def test_dashboard_user_profile_area_present(self):
        """dashboard.html must contain #userProfileArea and trigger controls."""
        self.assertIn('id="userProfileArea"', self.dash_html)
        self.assertIn('id="userProfileTrigger"', self.dash_html)
        self.assertIn('id="userAvatar"', self.dash_html)
        self.assertIn('id="userName"', self.dash_html)
        self.assertIn('id="userRole"', self.dash_html)

    def test_dashboard_user_profile_menu_structure(self):
        """#userProfileMenu must contain user header, existing destinations, and logout button."""
        self.assertIn('id="userProfileMenu"', self.dash_html)
        self.assertIn('id="menuUserHeader"', self.dash_html)
        self.assertIn('id="menuUserName"', self.dash_html)
        self.assertIn('id="menuUserEmail"', self.dash_html)
        self.assertIn('id="menuUserTier"', self.dash_html)
        self.assertIn('href="progress.html"', self.dash_html)
        self.assertIn('href="settings.html"', self.dash_html)
        self.assertIn('id="logoutBtn"', self.dash_html)

    def test_dashboard_logout_confirmation_modal(self):
        """dashboard.html must include accessible confirmation modal for logout."""
        self.assertIn('id="logoutModalOverlay"', self.dash_html)
        self.assertIn('id="btnCancelLogout"', self.dash_html)
        self.assertIn('id="btnConfirmLogout"', self.dash_html)
        self.assertIn('role="dialog"', self.dash_html)

    # --------------------------------------------------------------------------
    # 3. Dashboard JavaScript Controller
    # --------------------------------------------------------------------------
    def test_dashboard_update_auth_state_ui_logic(self):
        """dashboard.js must toggle guest vs authenticated displays accurately."""
        self.assertIn("function updateAuthStateUI()", self.dash_js)
        self.assertIn("guestAuthActions.style.display = 'flex'", self.dash_js)
        self.assertIn("guestAuthActions.style.display = 'none'", self.dash_js)
        self.assertIn("userProfileArea.style.display = 'flex'", self.dash_js)
        self.assertIn("userProfileArea.style.display = 'none'", self.dash_js)

    def test_dashboard_listens_to_auth_changed_event(self):
        """dashboard.js must listen for codearena:auth-changed to refresh immediately."""
        self.assertIn("codearena:auth-changed", self.dash_js)

    def test_dashboard_dropdown_dismissal_controls(self):
        """dashboard.js must support Escape key and outside click to close dropdown."""
        self.assertIn("e.key === 'Escape'", self.dash_js)
        self.assertIn("!userProfileTrigger.contains(e.target)", self.dash_js)
        self.assertIn("closeUserProfileMenu", self.dash_js)

    def test_dashboard_logout_workflow(self):
        """dashboard.js must show confirmation modal and invoke authService.logout()."""
        self.assertIn("openLogoutModal", self.dash_js)
        self.assertIn("authService.logout()", self.dash_js)

    # --------------------------------------------------------------------------
    # 4. AI Assistant Integration Consistency
    # --------------------------------------------------------------------------
    def test_ai_assistant_uses_unified_auth_service(self):
        """ai_assistant.js must use window.CodeArenaAPI.authService as canonical source."""
        self.assertIn("window.CodeArenaAPI.authService.isAuthenticated()", self.ai_js)
        # Separate ad-hoc localStorage fallback must NOT override or conflict
        self.assertNotIn("sessionStorage.getItem('codearena_auth_user')", self.ai_js)

    def test_ai_assistant_listens_for_logout(self):
        """ai_assistant.js must listen for codearena:auth-changed and redirect on logout."""
        self.assertIn("codearena:auth-changed", self.ai_js)
        self.assertIn("notice=ai_auth_required", self.ai_js)

    # --------------------------------------------------------------------------
    # 5. CSS Styles & Theming
    # --------------------------------------------------------------------------
    def test_css_user_profile_dropdown_and_modal_styles(self):
        """dashboard.css must style dropdown header, menu items, and logout modal."""
        self.assertIn(".menu-user-header", self.dash_css)
        self.assertIn(".menu-user-name", self.dash_css)
        self.assertIn(".menu-user-email", self.dash_css)
        self.assertIn(".logout-modal-overlay", self.dash_css)
        self.assertIn(".logout-modal-card", self.dash_css)

    def test_css_light_theme_overrides(self):
        """dashboard.css must provide light theme styling for user menu and modal."""
        self.assertIn('[data-theme="light"] .menu-user-name', self.dash_css)
        self.assertIn('[data-theme="light"] .logout-modal-card', self.dash_css)

    def test_css_mobile_header_adaptation(self):
        """dashboard.css must hide .user-info on small screens to prevent header overflow."""
        self.assertIn(".user-info", self.dash_css)
        match = re.search(r"@media\s*\([^)]*(?:768px|480px)[^)]*\)[\s\S]*?\.user-info\s*\{[^}]*display:\s*none", self.dash_css)
        self.assertIsNotNone(match, "CSS must hide .user-info on mobile screens to prevent overflow")

if __name__ == "__main__":
    unittest.main()
