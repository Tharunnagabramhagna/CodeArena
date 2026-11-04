# update_ai_assistant.py

# 1. Update ai_assistant.html
with open('frontend/pages/ai_assistant.html', 'r', encoding='utf-8') as f:
    ai_html = f.read()

ai_html = ai_html.replace(
    '<div class="secondary-container">',
    '<div class="secondary-container ai-page-container">'
)

with open('frontend/pages/ai_assistant.html', 'w', encoding='utf-8') as f:
    f.write(ai_html)
print("ai_assistant.html updated")

# 2. Update secondary.css
with open('frontend/css/secondary.css', 'r', encoding='utf-8') as f:
    sec_css = f.read()

old_ai_css = """.ai-layout-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  min-height: calc(100vh - 180px);
}

.ai-sidebar {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}"""

new_ai_css = """.ai-page-container {
  max-width: 1400px;
  width: 100%;
}

.ai-layout-container {
  display: grid;
  grid-template-columns: 310px 1fr;
  gap: 20px;
  height: calc(100vh - 140px);
  min-height: 620px;
}

.ai-sidebar {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}"""

assert old_ai_css in sec_css, "old_ai_css not found in secondary.css"
sec_css = sec_css.replace(old_ai_css, new_ai_css)

# Update chat window and messages
old_win_css = """.ai-chat-window {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: calc(100vh - 180px);
}

.ai-chat-header {
  padding: 14px 20px;
  background-color: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ai-chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.chat-msg {
  display: flex;
  gap: 12px;
  max-width: 85%;
}

.chat-msg.user-msg {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.chat-msg.assistant-msg {
  align-self: flex-start;
}

.msg-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  flex-shrink: 0;
}

.user-msg .msg-avatar {
  background-color: var(--color-primary);
  color: #FFFFFF;
}

.msg-bubble {
  padding: 12px 16px;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  line-height: 1.55;
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
}

.user-msg .msg-bubble {
  background-color: rgba(79, 70, 229, 0.15);
  border-color: rgba(79, 70, 229, 0.3);
}"""

new_win_css = """.ai-chat-window {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  box-sizing: border-box;
}

.ai-chat-header {
  padding: 14px 24px;
  background-color: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.ai-chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  scroll-behavior: smooth;
}

.chat-msg {
  display: flex;
  gap: 14px;
  max-width: 92%;
  animation: fadeIn 0.15s ease-out;
}

.chat-msg.user-msg {
  align-self: flex-end;
  flex-direction: row-reverse;
  max-width: 80%;
}

.chat-msg.assistant-msg {
  align-self: flex-start;
  max-width: 94%;
}

.msg-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.user-msg .msg-avatar {
  background: linear-gradient(135deg, var(--color-primary), #6366F1);
  color: #FFFFFF;
  border-color: transparent;
}

.msg-bubble {
  padding: 16px 22px;
  border-radius: var(--radius-md);
  font-size: 0.92rem;
  line-height: 1.6;
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  max-width: 100%;
}

.user-msg .msg-bubble {
  background-color: rgba(79, 70, 229, 0.16);
  border-color: rgba(79, 70, 229, 0.35);
  border-bottom-right-radius: 4px;
}

.assistant-msg .msg-bubble {
  border-bottom-left-radius: 4px;
}"""

assert old_win_css in sec_css, "old_win_css not found in secondary.css"
sec_css = sec_css.replace(old_win_css, new_win_css)

with open('frontend/css/secondary.css', 'w', encoding='utf-8') as f:
    f.write(sec_css)
print("secondary.css AI assistant styling updated")

# 3. Update ai_assistant.js
with open('frontend/js/ai_assistant.js', 'r', encoding='utf-8') as f:
    ai_js = f.read()

old_load_history = """        if (history.length === 0) {
            // Seed with welcome preview message
            history = [{
                sender: 'assistant',
                text: "Hello! I am your CodeArena Java Learning Assistant. Ask me questions about core Java syntax, object-oriented concepts, algorithms, or common compiler errors. All responses are generated as simulated preview guidance for learning.",
                code: null,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }];
            saveHistory(history);
        }"""

new_load_history = """        if (history.length === 0) {
            // Seed with comprehensive welcome & orientation message
            history = [{
                sender: 'assistant',
                text: "### Welcome to CodeArena Java Mentor\\n\\nI am your interactive Java learning assistant. I can help explain algorithmic concepts, walk through data structures, analyze time and space complexity, or debug tricky syntax patterns.\\n\\nSelect one of the suggested inquiries on the left, or ask any question in the composer below to begin!\\n\\n*Note: All responses are generated locally as simulated educational preview guidance.*",
                code: null,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }];
            saveHistory(history);
        }"""

assert old_load_history in ai_js, "old_load_history not found in ai_assistant.js"
ai_js = ai_js.replace(old_load_history, new_load_history)

# Improve formatMessageText
old_format = """    function formatMessageText(text) {
        if (!text) return '';
        // Safe basic markdown parsing (bold, code, lists)
        return escapeHtml(text)
            .replace(/^### (.*$)/gim, '<h4 style="margin: 0 0 6px 0; font-size: 1rem; color: var(--color-text-primary);">$1</h4>')
            .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
            .replace(/`([^`]+)`/g, '<code style="font-family: var(--font-family-mono); background: var(--color-bg-primary); padding: 1px 5px; border-radius: 4px; font-size: 0.82rem; color: var(--color-primary);">$1</code>')
            .replace(/\\n/g, '<br>');
    }"""

new_format = """    function formatMessageText(text) {
        if (!text) return '';
        // Safe basic markdown parsing (headings, bold, italics, code, lists, paragraphs)
        return escapeHtml(text)
            .replace(/^### (.*$)/gim, '<h4 style="margin: 0 0 8px 0; font-size: 1.05rem; font-weight: 700; color: var(--color-text-primary);">$1</h4>')
            .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
            .replace(/\\*(.*?)\\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code style="font-family: var(--font-family-mono); background: var(--color-bg-primary); padding: 2px 6px; border-radius: 4px; font-size: 0.84rem; color: var(--color-primary); border: 1px solid var(--color-border);">$1</code>')
            .replace(/^(\\d+\\.\\s+.*$)/gim, '<div style="margin: 4px 0 4px 12px; line-height: 1.55;">$1</div>')
            .replace(/^- (.*$)/gim, '<div style="margin: 4px 0 4px 12px; line-height: 1.55;">• $1</div>')
            .replace(/\\n\\n/g, '<div style="height: 8px;"></div>')
            .replace(/\\n/g, '<br>');
    }"""

assert old_format in ai_js, "old_format not found in ai_assistant.js"
ai_js = ai_js.replace(old_format, new_format)

# Improve auto-scroll
old_scroll = """        // Scroll to bottom
        dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;"""

new_scroll = """        // Scroll to bottom smoothly
        setTimeout(() => {
            if (dom.chatMessages) {
                dom.chatMessages.scrollTo({ top: dom.chatMessages.scrollHeight, behavior: 'smooth' });
            }
        }, 30);"""

assert old_scroll in ai_js, "old_scroll not found in ai_assistant.js"
ai_js = ai_js.replace(old_scroll, new_scroll)

with open('frontend/js/ai_assistant.js', 'w', encoding='utf-8') as f:
    f.write(ai_js)
print("ai_assistant.js updated successfully")

