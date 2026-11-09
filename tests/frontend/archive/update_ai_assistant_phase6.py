# update_ai_assistant_phase6.py

# 1. Update ai_assistant.html
with open('frontend/pages/ai_assistant.html', 'r', encoding='utf-8') as f:
    ai_html = f.read()

# Add toast.js
if '<script src="../js/toast.js"></script>' not in ai_html:
    ai_html = ai_html.replace('<script src="../js/ai_assistant.js"></script>', '<script src="../js/toast.js"></script>\n    <script src="../js/ai_assistant.js"></script>')
    print("Added toast.js to ai_assistant.html")

# Add new suggested prompt chips
old_chips = """                            <button type="button" class="prompt-chip-btn" data-prompt="How does Java manage garbage collection on the heap?">
                                🧪 Garbage collection on Heap
                            </button>"""

new_chips = """                            <button type="button" class="prompt-chip-btn" data-prompt="How does Java manage garbage collection on the heap?">
                                🧪 Garbage collection on Heap
                            </button>
                            <button type="button" class="prompt-chip-btn" data-prompt="Explain Java 8 Streams and Lambdas with an example.">
                                🌊 Java 8 Streams & Lambdas
                            </button>
                            <button type="button" class="prompt-chip-btn" data-prompt="What is the difference between Checked and Unchecked Exceptions in Java?">
                                ⚠️ Checked vs Unchecked Exceptions
                            </button>"""

if old_chips in ai_html and 'Java 8 Streams' not in ai_html:
    ai_html = ai_html.replace(old_chips, new_chips, 1)
    print("Added new chips to ai_assistant.html")

with open('frontend/pages/ai_assistant.html', 'w', encoding='utf-8') as f:
    f.write(ai_html)

# 2. Update ai_assistant.js
with open('frontend/js/ai_assistant.js', 'r', encoding='utf-8') as f:
    ai_js = f.read()

# Add new knowledge base entries
new_kb_entries = """,
        {
            keywords: ['stream', 'streams', 'lambda', 'lambdas', 'filter', 'map'],
            title: 'Java 8 Streams and Lambda Expressions',
            response: `Java 8 introduced the Stream API and lambda expressions to enable functional programming styles on collections.\\n\\nA stream is a sequence of elements supporting sequential and parallel aggregate operations. Key pipeline stages:\\n1. **Source:** Collections, arrays, or I/O channels.\\n2. **Intermediate Operations:** Return a new Stream (e.g., \`filter()\`, \`map()\`, \`sorted()\`). These are lazy.\\n3. **Terminal Operations:** Produce a non-stream result or side-effect (e.g., \`collect()\`, \`forEach()\`, \`reduce()\`).`,
            code: `import java.util.*;\\nimport java.util.stream.Collectors;\\n\\npublic class StreamsDemo {\\n    public static void main(String[] args) {\\n        List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David", "Andrew");\\n\\n        // Filter names starting with 'A' and transform to uppercase\\n        List<String> filtered = names.stream()\\n                .filter(name -> name.startsWith("A"))\\n                .map(String::toUpperCase)\\n                .collect(Collectors.toList());\\n\\n        System.out.println(filtered); // Output: [ALICE, ANDREW]\\n    }\\n}`
        },
        {
            keywords: ['exception', 'exceptions', 'checked', 'unchecked', 'runtimeexception', 'throwable'],
            title: 'Checked vs Unchecked Exceptions in Java',
            response: `In Java, all exceptions inherit from \`java.lang.Throwable\`. The two main categories are:\\n\\n- **Checked Exceptions (inherit from \`Exception\`, but not \`RuntimeException\`):** Verified at compile time. Methods must either handle them via \`try-catch\` or declare them using \`throws\`. Examples: \`IOException\`, \`SQLException\`.\\n- **Unchecked Exceptions (inherit from \`RuntimeException\`):** Occur during program execution due to logical defects. The compiler does not enforce explicit handling. Examples: \`NullPointerException\`, \`ArrayIndexOutOfBoundsException\`, \`IllegalArgumentException\`.`,
            code: `import java.io.*;\\n\\npublic class ExceptionDemo {\\n    // Checked exception: must be declared or caught\\n    public static void readFile(String path) throws IOException {\\n        BufferedReader reader = new BufferedReader(new FileReader(path));\\n        reader.close();\\n    }\\n\\n    // Unchecked exception: logical check\\n    public static int divide(int a, int b) {\\n        if (b == 0) {\\n            throw new IllegalArgumentException("Divisor cannot be zero");\\n        }\\n        return a / b;\\n    }\\n}`
        }"""

old_kb_end = """            title: 'Java Garbage Collection & Heap Management',"""
if 'Java 8 Streams' not in ai_js:
    # insert before the closing bracket of KNOWLEDGE_BASE
    idx = ai_js.find('];\n\n    let memoryHistory = [];')
    if idx == -1:
        idx = ai_js.find('];\n\n    // State')
    if idx == -1:
        # find the end of KNOWLEDGE_BASE
        idx = ai_js.find('];\n\n')
    if idx != -1:
        ai_js = ai_js[:idx] + new_kb_entries + "\n    " + ai_js[idx:]
        print("Added new knowledge base entries to ai_assistant.js")

# Replace emoji avatars with SVGs in renderHistory
old_avatar = "${isUser ? '👤' : '🤖'}"
new_avatar = """${isUser 
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8.01" y2="16"/><line x1="16" y1="16" x2="16.01" y2="16"/></svg>'
}"""

if old_avatar in ai_js:
    ai_js = ai_js.replace(old_avatar, new_avatar, 1)
    print("Replaced emoji avatars with SVGs in ai_assistant.js")

# Update handleClearChat with confirmation and toast
old_clear = """    function handleClearChat() {
        const welcome = {
            sender: 'assistant',
            text: 'Chat cleared. Ask me any Java concept, interview question, or debugging query!',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        saveHistory([welcome]);
        renderHistory();
    }"""

new_clear = """    function handleClearChat() {
        if (!confirm('Are you sure you want to clear your current simulated conversation?')) {
            return;
        }
        const welcome = {
            sender: 'assistant',
            text: 'Chat cleared. Ask me any Java concept, interview question, or debugging query!',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        saveHistory([welcome]);
        renderHistory();
        if (window.CodeArenaToast) {
            window.CodeArenaToast.info('Simulated conversation cleared');
        }
    }"""

if old_clear in ai_js:
    ai_js = ai_js.replace(old_clear, new_clear, 1)
    print("Updated handleClearChat with confirmation and toast in ai_assistant.js")

# In renderHistory, ensure auto-scrolling
old_scroll = "dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;"
if old_scroll not in ai_js:
    idx_render_end = ai_js.find("dom.chatMessages.querySelectorAll('.code-copy-btn')")
    if idx_render_end != -1:
        # scroll at end of renderHistory
        idx_brace = ai_js.find("}\n\n    function handleSendMessage", idx_render_end)
        if idx_brace != -1:
            ai_js = ai_js[:idx_brace] + "        dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;\n    " + ai_js[idx_brace:]
            print("Added auto-scroll to renderHistory")

with open('frontend/js/ai_assistant.js', 'w', encoding='utf-8') as f:
    f.write(ai_js)

print("ai_assistant phase 6 updates completed.")

