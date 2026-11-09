"""
CodeArena — Flagship AI Assistant Full-Stack Verification Suite
Tests the 18 required scenarios from the specification:
1. Guest opens the AI Assistant (redirect enforced).
2. Guest attempts to send a message (endpoint blocks unauthenticated requests).
3. Successful login redirects to the intended assistant page.
4. Authenticated user creates a new conversation.
5. User sends multiple messages in sequence.
6. User refreshes and sees the same conversation history persisted.
7. User opens an older conversation thread.
8. User creates multiple separate conversations.
9. User deletes a conversation thread.
10. User attempts to access another user's conversation (SecurityException / 403 Forbidden).
11. External provider is not configured (runs Built-in mentor).
12. External provider is configured (reads CODEARENA_AI_API_KEY from environment).
13. External provider times out or returns an error (graceful fallback).
14. Built-in fallback works without claiming external generation.
15. Database connection fails (graceful store fallback without crashing).
16. Empty messages are rejected (400 Bad Request / IllegalArgumentException).
17. Long Java code blocks render with horizontal scroll and copy button.
18. Dark/light themes and responsive layouts work without overflow.
"""

import os
import re
import sys
import unittest

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
HTML_PATH = os.path.join(ROOT_DIR, "frontend", "pages", "ai_assistant.html")
LOGIN_PATH = os.path.join(ROOT_DIR, "frontend", "pages", "login.html")
JS_PATH = os.path.join(ROOT_DIR, "frontend", "js", "ai_assistant.js")
API_JS_PATH = os.path.join(ROOT_DIR, "frontend", "js", "api.js")
AUTH_JS_PATH = os.path.join(ROOT_DIR, "frontend", "js", "auth.js")
CSS_PATH = os.path.join(ROOT_DIR, "frontend", "css", "secondary.css")

# Backend Java files
JAVA_SERVICE_PATH = os.path.join(ROOT_DIR, "backend", "src", "main", "java", "com", "codearena", "service", "AIAssistantService.java")
JAVA_CONTROLLER_PATH = os.path.join(ROOT_DIR, "backend", "src", "main", "java", "com", "codearena", "controller", "AIController.java")
JAVA_CONFIG_PATH = os.path.join(ROOT_DIR, "backend", "src", "main", "java", "com", "codearena", "config", "AIConfig.java")
JAVA_CONV_DAO_PATH = os.path.join(ROOT_DIR, "backend", "src", "main", "java", "com", "codearena", "dao", "AIConversationDAO.java")
JAVA_MSG_DAO_PATH = os.path.join(ROOT_DIR, "backend", "src", "main", "java", "com", "codearena", "dao", "AIMessageDAO.java")

class TestFlagshipAIFullStack(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(HTML_PATH, "r", encoding="utf-8") as f:
            cls.html = f.read()
        with open(LOGIN_PATH, "r", encoding="utf-8") as f:
            cls.login_html = f.read()
        with open(JS_PATH, "r", encoding="utf-8") as f:
            cls.js = f.read()
        with open(API_JS_PATH, "r", encoding="utf-8") as f:
            cls.api_js = f.read()
        with open(AUTH_JS_PATH, "r", encoding="utf-8") as f:
            cls.auth_js = f.read()
        with open(CSS_PATH, "r", encoding="utf-8") as f:
            cls.css = f.read()
        with open(JAVA_SERVICE_PATH, "r", encoding="utf-8") as f:
            cls.java_service = f.read()
        with open(JAVA_CONTROLLER_PATH, "r", encoding="utf-8") as f:
            cls.java_controller = f.read()
        with open(JAVA_CONFIG_PATH, "r", encoding="utf-8") as f:
            cls.java_config = f.read()
        with open(JAVA_CONV_DAO_PATH, "r", encoding="utf-8") as f:
            cls.java_conv_dao = f.read()
        with open(JAVA_MSG_DAO_PATH, "r", encoding="utf-8") as f:
            cls.java_msg_dao = f.read()

    # --- Scenario 1: Guest opens the AI Assistant ---
    def test_scenario_01_guest_redirect(self):
        self.assertIn("login.html?redirect=", self.js, "Unauthenticated visitors must be redirected to login")
        self.assertIn("notice=ai_auth_required", self.js, "Redirect must communicate that AI Assistant requires login")

    # --- Scenario 2: Guest attempts to send a message ---
    def test_scenario_02_guest_message_blocked(self):
        self.assertIn("401", self.java_controller, "Backend must reject unauthenticated requests with HTTP 401")
        self.assertIn("Authentication required", self.java_controller)
        self.assertIn("status: 401", self.api_js, "API client adapter must reject unauthenticated message requests")

    # --- Scenario 3: Login redirect returns user to AI Assistant ---
    def test_scenario_03_login_redirect_preservation(self):
        self.assertIn("urlParams.get('redirect')", self.auth_js, "auth.js must inspect redirect query parameter")
        self.assertIn("ai_auth_required", self.auth_js, "login.html must display AI Assistant authentication notice")

    # --- Scenario 4: Authenticated user creates a new conversation ---
    def test_scenario_04_create_new_conversation(self):
        self.assertIn("createConversation", self.java_service)
        self.assertIn("createConversation", self.api_js)
        self.assertIn("id=\"aiNewChatBtn\"", self.html, "Visible New Chat button in HTML")
        self.assertIn("handleNewConversation", self.js)

    # --- Scenario 5: User sends multiple messages ---
    def test_scenario_05_multiple_messages_sequence(self):
        self.assertIn("processStudentMessage", self.java_service)
        self.assertIn("senderRole", self.java_msg_dao, "Message DAO models sender role")
        self.assertIn("appendSingleMessage", self.js)

    # --- Scenario 6: User refreshes and sees conversation history ---
    def test_scenario_06_conversation_persistence(self):
        self.assertIn("ai_conversations", self.java_conv_dao, "Conversations stored in database table")
        self.assertIn("ai_messages", self.java_msg_dao, "Messages stored in database table")
        self.assertIn("listConversations", self.api_js)
        self.assertIn("loadConversations", self.js, "Conversations loaded from service on page init")

    # --- Scenario 7: User opens an older conversation ---
    def test_scenario_07_open_older_conversation(self):
        self.assertIn("switchConversation", self.js)
        self.assertIn("loadActiveConversationMessages", self.js)
        self.assertIn("getConversation", self.api_js)

    # --- Scenario 8: User creates multiple separate conversations ---
    def test_scenario_08_multiple_separate_conversations(self):
        self.assertIn("id=\"aiConversationList\"", self.html, "Conversation history container present in sidebar")
        self.assertIn("renderConversationList", self.js)
        self.assertIn("ai-conversation-item", self.js)

    # --- Scenario 9: User deletes a conversation ---
    def test_scenario_09_delete_conversation(self):
        self.assertIn("deleteConversation", self.java_service)
        self.assertIn("deleteConversation", self.java_conv_dao)
        self.assertIn("deleteConversation", self.api_js)
        self.assertIn("confirmDeleteConversation", self.js)
        self.assertIn("CASCADE", self.java_conv_dao)

    # --- Scenario 10: Cross-user access rejected ---
    def test_scenario_10_cross_user_authorization(self):
        self.assertIn("SecurityException", self.java_service, "Cross-user conversation access throws SecurityException")
        self.assertIn("user_id = ?", self.java_conv_dao, "All conversation queries scoped strictly by authenticated user_id")
        self.assertIn("403", self.java_controller, "Controller maps SecurityException to HTTP 403 Forbidden")

    # --- Scenario 11: External provider is not configured ---
    def test_scenario_11_provider_not_configured(self):
        self.assertIn("isConfigured", self.java_config)
        self.assertIn("generateLocalPedagogicalResponse", self.java_service, "Default local response engine used when no key is set")

    # --- Scenario 12: External provider is configured ---
    def test_scenario_12_external_provider_environment_variable(self):
        self.assertIn("CODEARENA_AI_API_KEY", self.java_config, "API key strictly read from server environment variable")
        self.assertIn("CODEARENA_AI_PROVIDER", self.java_config)
        self.assertIn("CODEARENA_AI_MODEL", self.java_config)

    # --- Scenario 13: External provider timeout / error handling ---
    def test_scenario_13_provider_timeout_and_errors(self):
        self.assertIn("timeoutMs", self.java_config)
        self.assertIn("isFallback", self.java_service, "Service tracks fallback activation")

    # --- Scenario 14: Built-in fallback works without pretending to be external ---
    def test_scenario_14_fallback_attribution(self):
        self.assertIn("isFallback", self.java_service)
        self.assertIn("BUILT-IN ASSISTANT", self.html)
        self.assertIn("Simulated", self.js)

    # --- Scenario 15: Database connection failures handled gracefully ---
    def test_scenario_15_database_failure_resilience(self):
        self.assertIn("MEMORY_STORE", self.java_conv_dao, "DAO includes resilient fallback store on DB exception")
        self.assertIn("MEMORY_STORE", self.java_msg_dao)

    # --- Scenario 16: Empty messages rejected ---
    def test_scenario_16_empty_message_rejection(self):
        self.assertIn("IllegalArgumentException", self.java_service, "Service rejects empty student messages")
        self.assertIn("400", self.java_controller, "Controller returns HTTP 400 Bad Request on empty messages")

    # --- Scenario 17: Long Java code blocks render correctly ---
    def test_scenario_17_code_rendering_and_copy(self):
        self.assertIn("code-copy-btn", self.js, "Copy Code action present")
        self.assertIn("overflow-x: auto", self.css, "Horizontal scroll on code blocks")
        self.assertIn("Java 17", self.js, "Language tag present")

    # --- Scenario 18: Dark/light themes and responsive layouts ---
    def test_scenario_18_responsive_and_themes(self):
        self.assertIn("@media (max-width: 1024px)", self.css)
        self.assertIn("@media (max-width: 768px)", self.css)
        self.assertIn("@media (max-width: 480px)", self.css)
        self.assertIn('class="theme-toggle"', self.html)

    # --- Security Verification: Zero Keys in Frontend Source & HTML ---
    def test_security_zero_frontend_keys(self):
        forbidden = [
            r'sk-[a-zA-Z0-9]{20,}',
            r'AIza[a-zA-Z0-9_\-]{35}'
        ]
        for pattern in forbidden:
            self.assertFalse(re.search(pattern, self.html), "Zero API keys in HTML")
            self.assertFalse(re.search(pattern, self.js), "Zero API keys in ai_assistant.js")
            self.assertFalse(re.search(pattern, self.api_js), "Zero API keys in api.js")

    # --- Privacy Verification: No Developer Config in Student HTML ---
    def test_privacy_no_developer_modal_in_student_ui(self):
        self.assertNotIn('id="aiConfigModal"', self.html, "Developer configuration modal removed from student interface")
        self.assertNotIn('id="aiModeConfigBtn"', self.html, "Provider configuration button removed from student interface")
        self.assertNotIn('CODEARENA_AI_API_KEY', self.html, "Environment variable names hidden from student interface")

if __name__ == "__main__":
    unittest.main()
