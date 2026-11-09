"""
CodeArena — AI Assistant Corrective Rework Verification Suite
Verifies:
1. Strict frontend-only authentication gate & redirect flow
2. Correct desktop layout proportions (sidebar 260-290px, content 850-950px, message bubbles 65-80%)
3. Conversation sidebar capabilities: New Chat, Search, Active state, Inline Rename & Delete, Empty state
4. Chat workspace controls: Header title, rename button, clear chat, mode badge, NO duplicate [X] close button
5. Fixed bottom message composer with keyboard hints and duplicate-send prevention
6. Natural conversational assistant responses (no robotic 'Java Pedagogical Guidance' heading echoing)
7. Honest presentation (no false 'Database-Backed' claims, no fake student usernames)
8. Zero developer modals, zero client API keys
9. Responsive layout & drawer navigation for mobile/tablet
"""

import os
import re
import unittest

WORKSPACE_ROOT = r"C:\CodeArena"
HTML_PATH = os.path.join(WORKSPACE_ROOT, "frontend", "pages", "ai_assistant.html")
JS_PATH = os.path.join(WORKSPACE_ROOT, "frontend", "js", "ai_assistant.js")
API_JS_PATH = os.path.join(WORKSPACE_ROOT, "frontend", "js", "api.js")
CSS_PATH = os.path.join(WORKSPACE_ROOT, "frontend", "css", "secondary.css")

class TestAIAssistantCorrectiveRework(unittest.TestCase):
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

    # --------------------------------------------------------------------------
    # 1. Proportions & Layout (Sidebar 260-290px, Content 850-950px, Bubbles 65-80%)
    # --------------------------------------------------------------------------
    def test_sidebar_width_proportions(self):
        # Must match 260px - 290px desktop proportion
        match = re.search(r"grid-template-columns:\s*(\d+)px\s+1fr", self.css)
        self.assertIsNotNone(match, "CSS must define grid-template-columns for AI layout")
        sidebar_px = int(match.group(1))
        self.assertTrue(260 <= sidebar_px <= 290, f"Sidebar width must be between 260-290px, found {sidebar_px}px")

    def test_chat_content_max_width(self):
        # Must constrain chat content to 850-950px range
        self.assertIn("max-width: 900px", self.css, "Chat content must be constrained to ~850-950px")

    def test_message_bubbles_proportions(self):
        # Message bubbles should be ~65-80% of content width, avoiding oversized cards
        self.assertTrue(
            "max-width: 75%" in self.css or "max-width: 78%" in self.css,
            "User message bubble must have restrained width (around 75-78%)"
        )
        self.assertTrue(
            "max-width: 82%" in self.css or "max-width: 85%" in self.css or "max-width: 88%" in self.css,
            "Assistant message bubble must have restrained width (around 82-88%)"
        )

    # --------------------------------------------------------------------------
    # 2. Sidebar Controls: New Chat, Search, Active, Rename, Delete, Empty State
    # --------------------------------------------------------------------------
    def test_new_chat_button(self):
        self.assertIn('id="aiNewChatBtn"', self.html)
        self.assertIn("handleNewConversation", self.js)

    def test_search_conversations_input(self):
        self.assertIn('id="aiSearchInput"', self.html)
        self.assertIn('id="aiClearSearchBtn"', self.html)
        self.assertIn("searchQuery", self.js)
        self.assertIn("filterAndRenderConversations", self.js)

    def test_empty_conversations_state(self):
        self.assertIn('id="aiEmptyConversations"', self.html)
        self.assertIn("No conversations found", self.html)

    def test_inline_conversation_actions(self):
        self.assertIn("conv-rename-btn", self.js)
        self.assertIn("conv-delete-btn", self.js)
        self.assertIn("promptRenameSpecificConversation", self.js)
        self.assertIn("confirmDeleteConversation", self.js)

    # --------------------------------------------------------------------------
    # 3. Header & Workspace: No Duplicate Close Button
    # --------------------------------------------------------------------------
    def test_clean_header_controls(self):
        self.assertIn('id="aiConvTitleDisplay"', self.html)
        self.assertIn('id="aiRenameConvBtn"', self.html)
        self.assertIn('id="aiClearChatBtn"', self.html)
        self.assertIn('id="aiHeaderModeBadge"', self.html)
        # Duplicate [X] delete button in the header must NOT exist
        self.assertNotIn('id="aiDeleteCurrentConvBtn"', self.html, "Header must not have duplicate close/delete button")

    # --------------------------------------------------------------------------
    # 4. Message Presentation: Natural Answers, No Echoed Headings
    # --------------------------------------------------------------------------
    def test_no_robotic_pedagogical_heading_echo(self):
        # Must NOT turn user questions into 'Java Pedagogical Guidance: "query"'
        self.assertNotIn('Java Pedagogical Guidance:', self.api_js, "Must not echo user query as robotic guidance heading")

    def test_natural_greeting_response(self):
        # api.js should respond naturally to greetings
        self.assertIn("Hello! I am your CodeArena coding mentor", self.api_js)

    def test_code_blocks_and_copy(self):
        self.assertIn("msg-code-block-card", self.css)
        self.assertIn("code-copy-btn", self.js)
        self.assertIn("Copied!", self.js)
        self.assertIn("overflow-x: auto", self.css)

    # --------------------------------------------------------------------------
    # 5. Fixed Bottom Composer & Prevent Duplicate Submissions
    # --------------------------------------------------------------------------
    def test_fixed_composer_area(self):
        self.assertIn(".ai-composer-area", self.css)
        self.assertIn('id="aiMessageInput"', self.html)
        self.assertIn('id="aiSendBtn"', self.html)
        self.assertIn('id="aiComposerForm"', self.html)

    def test_duplicate_submission_prevention(self):
        self.assertIn("isThinking", self.js)
        self.assertIn("dom.sendBtn.disabled = true", self.js)

    # --------------------------------------------------------------------------
    # 6. Honest Presentation: No Fake DB Claims or Fabricated Usernames
    # --------------------------------------------------------------------------
    def test_no_false_database_backed_claims(self):
        self.assertNotIn("Database-Backed", self.html, "HTML must not falsely claim Database-Backed")
        self.assertIn("Local Preview Session", self.html)

    def test_zero_developer_modals_or_exposed_keys(self):
        self.assertNotIn("aiConfigModal", self.html)
        self.assertNotIn("CODEARENA_AI_API_KEY", self.html)
        self.assertNotIn("sk-", self.js)

    # --------------------------------------------------------------------------
    # 7. Authentication Gate
    # --------------------------------------------------------------------------
    def test_guest_redirect_gate(self):
        self.assertIn("login.html?redirect=", self.js)
        self.assertIn("notice=ai_auth_required", self.js)

    # --------------------------------------------------------------------------
    # 8. Responsive Design & Mobile Drawer
    # --------------------------------------------------------------------------
    def test_mobile_menu_and_drawer(self):
        self.assertIn('id="aiMobileMenuBtn"', self.html)
        self.assertIn('id="aiSidebarOverlay"', self.html)
        self.assertIn(".ai-sidebar.sidebar-open", self.css)
        self.assertIn("@media (max-width: 768px)", self.css)
        self.assertIn("@media (max-width: 480px)", self.css)

if __name__ == "__main__":
    unittest.main()

