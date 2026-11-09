"""
CodeArena — AI Assistant UI & Architecture Automated Verification Test
Tests the enhanced AI Assistant interface, two-mode architecture, knowledge base,
security posture, and responsive styling.
"""

import os
import re
import unittest

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
HTML_PATH = os.path.join(ROOT_DIR, "frontend", "pages", "ai_assistant.html")
JS_PATH = os.path.join(ROOT_DIR, "frontend", "js", "ai_assistant.js")
API_JS_PATH = os.path.join(ROOT_DIR, "frontend", "js", "api.js")
CSS_PATH = os.path.join(ROOT_DIR, "frontend", "css", "secondary.css")

class TestAIAssistantRevamp(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(HTML_PATH, "r", encoding="utf-8") as f:
            cls.html = f.read()
        with open(JS_PATH, "r", encoding="utf-8") as f:
            cls.js = f.read()
        with open(API_JS_PATH, "r", encoding="utf-8") as f:
            cls.api_js = f.read()
        with open(CSS_PATH, "r", encoding="utf-8") as f:
            cls.css = f.read()

    # --- 1. Layout & Chat Interface Structure ---
    def test_html_structural_elements(self):
        self.assertIn('class="ai-layout-container"', self.html)
        self.assertIn('class="ai-sidebar"', self.html)
        self.assertIn('class="ai-chat-window"', self.html)
        self.assertIn('id="aiChatMessages"', self.html)
        self.assertIn('id="aiMessageInput"', self.html)
        self.assertIn('id="aiSendBtn"', self.html)
        self.assertIn('id="aiNewChatBtn"', self.html)
        self.assertIn('id="aiClearChatBtn"', self.html)
        self.assertIn('id="aiConversationList"', self.html)

    def test_thinking_indicator_defined(self):
        self.assertIn('aiThinkingIndicator', self.js, "JS must create thinking indicator element")
        self.assertIn('.thinking-indicator-msg', self.css, "CSS must style thinking indicator")
        self.assertIn('.thinking-dots', self.css, "CSS must animate thinking dots")

    def test_no_interface_emojis(self):
        # UI buttons should use SVGs, not raw emoji characters as interface icons
        button_matches = re.findall(r'<button[^>]*>(.*?)</button>', self.html, re.DOTALL)
        for btn in button_matches:
            if "ai-new-chat-btn" in btn or "ai-send-btn" in btn or "ai-rename-btn" in btn:
                self.assertIn("<svg", btn, "Interactive AI buttons must use SVG icons")

    def test_svg_avatars_present(self):
        self.assertIn('<svg', self.js, "JS must render clean SVG avatars")
        self.assertIn('class="msg-avatar"', self.js)

    # --- 2. Two-Mode Architecture & Security ---
    def test_zero_client_api_keys(self):
        # Frontend must never contain hardcoded API keys
        forbidden_patterns = [
            r'sk-[a-zA-Z0-9]{20,}',
            r'AIza[a-zA-Z0-9_\-]{35}',
            r'api[_-]?key\s*[:=]\s*["\'][a-zA-Z0-9]{16,}["\']'
        ]
        for pattern in forbidden_patterns:
            self.assertFalse(re.search(pattern, self.html, re.IGNORECASE), "No API keys in HTML")
            self.assertFalse(re.search(pattern, self.js, re.IGNORECASE), "No API keys in JS")
            self.assertFalse(re.search(pattern, self.api_js, re.IGNORECASE), "No API keys in api.js")

    def test_zero_forbidden_network_calls_in_ui(self):
        # ai_assistant.js must not directly invoke fetch or http://
        self.assertNotIn("fetch(", self.js, "No direct fetch calls in ai_assistant.js")
        self.assertNotIn("http://", self.js, "No unencrypted or direct external URLs in ai_assistant.js")

    def test_student_interface_privacy(self):
        # Student interface hides developer/admin modals and raw API key configs
        self.assertNotIn('id="aiConfigModal"', self.html)
        self.assertIn('BUILT-IN ASSISTANT', self.html)
        self.assertIn('id="aiStudentStatusBadge"', self.html)

    def test_session_storage_isolation(self):
        self.assertIn('sessionStorage', self.js)

    # --- 3. Knowledge Base & Response Richness ---
    def test_knowledge_base_topics(self):
        required_topics = [
            "streams",
            "exceptions",
            "recursion",
            "hashmap",
            "complexity"
        ]
        for topic in required_topics:
            self.assertIn(topic, self.js.lower(), f"Knowledge base must cover {topic}")

    def test_simulated_preview_attribution(self):
        # Clear attribution that built-in assistant is local
        self.assertIn("Simulated", self.js)
        self.assertIn("BUILT-IN ASSISTANT", self.html)

    # --- 4. Coding-Focused Features ---
    def test_code_block_copy_support(self):
        self.assertIn("code-copy-btn", self.js)
        self.assertIn("navigator.clipboard", self.js)

    def test_markdown_rendering(self):
        self.assertIn("formatMessageText", self.js)
        self.assertIn("language-java", self.js)

    def test_enter_to_send_shift_enter_newline(self):
        self.assertIn("e.key === 'Enter'", self.js)
        self.assertIn("!e.shiftKey", self.js)

    # --- 5. CSS & Proportions ---
    def test_css_proportions(self):
        self.assertIn(".ai-layout-container", self.css)
        self.assertIn(".ai-sidebar", self.css)
        self.assertIn(".ai-chat-window", self.css)
        self.assertIn(".chat-msg.user-msg", self.css)
        self.assertIn(".chat-msg.assistant-msg", self.css)
        self.assertIn("max-width: 78%", self.css)
        self.assertIn("max-width: 88%", self.css)

    def test_code_horizontal_scroll(self):
        self.assertIn("overflow-x: auto", self.css)

    def test_responsive_media_queries(self):
        self.assertIn("@media (max-width: 1024px)", self.css)
        self.assertIn("@media (max-width: 768px)", self.css)
        self.assertIn("@media (max-width: 480px)", self.css)

if __name__ == "__main__":
    unittest.main()
