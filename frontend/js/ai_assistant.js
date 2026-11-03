/**
 * CodeArena — AI Learning Assistant Controller (ai_assistant.js)
 * Provides simulated educational mentoring for Java programming.
 * All responses are generated locally as preview guidance.
 * NEVER connects to live external AI services or transmits student code.
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'codearena_ai_chat_session_history';

    // In-memory fallback if sessionStorage is unavailable
    let memoryHistory = [,
        {
            keywords: ['stream', 'streams', 'lambda', 'lambdas', 'filter', 'map'],
            title: 'Java 8 Streams and Lambda Expressions',
            response: `Java 8 introduced the Stream API and lambda expressions to enable functional programming styles on collections.\n\nA stream is a sequence of elements supporting sequential and parallel aggregate operations. Key pipeline stages:\n1. **Source:** Collections, arrays, or I/O channels.\n2. **Intermediate Operations:** Return a new Stream (e.g., \`filter()\`, \`map()\`, \`sorted()\`). These are lazy.\n3. **Terminal Operations:** Produce a non-stream result or side-effect (e.g., \`collect()\`, \`forEach()\`, \`reduce()\`).`,
            code: `import java.util.*;\nimport java.util.stream.Collectors;\n\npublic class StreamsDemo {\n    public static void main(String[] args) {\n        List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David", "Andrew");\n\n        // Filter names starting with 'A' and transform to uppercase\n        List<String> filtered = names.stream()\n                .filter(name -> name.startsWith("A"))\n                .map(String::toUpperCase)\n                .collect(Collectors.toList());\n\n        System.out.println(filtered); // Output: [ALICE, ANDREW]\n    }\n}`
        },
        {
            keywords: ['exception', 'exceptions', 'checked', 'unchecked', 'runtimeexception', 'throwable'],
            title: 'Checked vs Unchecked Exceptions in Java',
            response: `In Java, all exceptions inherit from \`java.lang.Throwable\`. The two main categories are:\n\n- **Checked Exceptions (inherit from \`Exception\`, but not \`RuntimeException\`):** Verified at compile time. Methods must either handle them via \`try-catch\` or declare them using \`throws\`. Examples: \`IOException\`, \`SQLException\`.\n- **Unchecked Exceptions (inherit from \`RuntimeException\`):** Occur during program execution due to logical defects. The compiler does not enforce explicit handling. Examples: \`NullPointerException\`, \`ArrayIndexOutOfBoundsException\`, \`IllegalArgumentException\`.`,
            code: `import java.io.*;\n\npublic class ExceptionDemo {\n    // Checked exception: must be declared or caught\n    public static void readFile(String path) throws IOException {\n        BufferedReader reader = new BufferedReader(new FileReader(path));\n        reader.close();\n    }\n\n    // Unchecked exception: logical check\n    public static int divide(int a, int b) {\n        if (b == 0) {\n            throw new IllegalArgumentException("Divisor cannot be zero");\n        }\n        return a / b;\n    }\n}`
        }
    ];

    // Pre-programmed educational knowledge base for common Java concepts
    const KNOWLEDGE_BASE = [
        {
            keywords: ['recursion', 'recursive', 'base case'],
            title: 'Understanding Recursion in Java',
            response: `Recursion is a programming technique where a method calls itself to solve a smaller subproblem of the original problem.\n\nEvery recursive solution requires two critical components:\n1. **Base Case:** The condition under which the recursion terminates without making another recursive call.\n2. **Recursive Step:** The logic that breaks the problem into a smaller instance and invokes the method again.`,
            code: `public class RecursionExample {\n    // Computes factorial: n! = n * (n - 1)!\n    public static int factorial(int n) {\n        // Base case: 0! = 1\n        if (n <= 1) {\n            return 1;\n        }\n        // Recursive step\n        return n * factorial(n - 1);\n    }\n\n    public static void main(String[] args) {\n        System.out.println("5! = " + factorial(5)); // Output: 120\n    }\n}`
        },
        {
            keywords: ['hashmap', 'collision', 'hashcode', 'equals'],
            title: 'How Java HashMaps Handle Collisions',
            response: `In Java, a \`HashMap\` uses array buckets and hashing to achieve average O(1) lookups.\n\nWhen two distinct keys produce the same array index (a hash collision):\n1. **Separate Chaining:** Java stores colliding entries as a linked list in that bucket.\n2. **Treeification (Java 8+):** If a single bucket exceeds 8 entries (\`TREEIFY_THRESHOLD\`) and the table capacity is at least 64, the linked list transforms into a balanced red-black tree, reducing worst-case lookup from O(n) to O(log n).\n3. **Contract:** Always override \`hashCode()\` whenever you override \`equals()\`.`,
            code: `import java.util.HashMap;\nimport java.util.Map;\n\npublic class MapCollisionExample {\n    public static void main(String[] args) {\n        Map<String, Integer> map = new HashMap<>();\n        map.put("Java", 17);\n        map.put("Spring", 3);\n\n        // Average O(1) lookup\n        System.out.println("Version: " + map.get("Java"));\n    }\n}`
        },
        {
            keywords: ['comparable', 'comparator', 'sort', 'sorting'],
            title: 'Comparable vs Comparator in Java',
            response: `Both interfaces enable sorting in Java, but serve different design purposes:\n\n- **\`Comparable<T>\` (Natural Ordering):** Implemented directly by the class whose objects are being sorted via \`compareTo(T other)\`. Example: \`String\` or \`Integer\`.\n- **\`Comparator<T>\` (Custom Ordering):** Implemented as a separate class or lambda via \`compare(T o1, T o2)\`. Enables multiple sorting strategies without modifying the original class.`,
            code: `import java.util.*;\n\nclass Student implements Comparable<Student> {\n    String name;\n    int score;\n\n    public Student(String name, int score) {\n        this.name = name;\n        this.score = score;\n    }\n\n    // Natural ordering: highest score first\n    @Override\n    public int compareTo(Student other) {\n        return Integer.compare(other.score, this.score);\n    }\n}\n\npublic class SortDemo {\n    public static void main(String[] args) {\n        List<Student> list = new ArrayList<>();\n        list.add(new Student("Alice", 85));\n        list.add(new Student("Bob", 92));\n        Collections.sort(list); // Uses Comparable\n    }\n}`
        },
        {
            keywords: ['stringbuilder', 'stringbuffer', 'concatenation', 'string'],
            title: 'Why Use StringBuilder Instead of String Concatenation',
            response: `In Java, \`String\` objects are **immutable**. Every time you concatenate strings using the \`+\` operator inside a loop, Java creates a new \`String\` object in memory, leading to O(n²) time complexity and excessive garbage collection overhead.\n\n\`StringBuilder\` maintains a mutable char buffer, appending characters in amortized O(1) time.`,
            code: `public class StringBuilderDemo {\n    public static void main(String[] args) {\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < 5; i++) {\n            sb.append("Iteration ").append(i).append("\\n");\n        }\n        String result = sb.toString();\n        System.out.print(result);\n    }\n}`
        },
        {
            keywords: ['garbage collection', 'gc', 'memory', 'heap'],
            title: 'Java Garbage Collection & Heap Memory',
            response: `Java manages heap memory automatically through Garbage Collection (GC).\n\n- Objects are created on the **Heap**.\n- When an object has no reachable references from any active thread (unreachable from GC Roots), it becomes eligible for GC.\n- Modern JVM collectors (G1, ZGC) partition the heap into generations (Young Generation for short-lived objects, Old Generation for surviving long-lived objects) to minimize pause times.`,
            code: `public class MemoryNote {\n    public void demo() {\n        String temp = new String("Temporary object");\n        // Once demo() finishes, the object referenced by temp\n        // has no remaining roots and is eligible for garbage collection.\n    }\n}`
        }
    ];

    // DOM Elements Cache
    let dom = {};

    function init() {
        cacheElements();
        bindEvents();
        loadHistory();
        renderHistory();
    }

    function cacheElements() {
        dom = {
            chatMessages: document.getElementById('aiChatMessages'),
            messageInput: document.getElementById('aiMessageInput'),
            sendBtn: document.getElementById('aiSendBtn'),
            clearChatBtn: document.getElementById('aiClearChatBtn'),
            promptChips: document.querySelectorAll('.prompt-chip-btn')
        };
    }

    function bindEvents() {
        if (dom.sendBtn) {
            dom.sendBtn.addEventListener('click', handleSendMessage);
        }

        if (dom.messageInput) {
            dom.messageInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                }
            });
        }

        if (dom.clearChatBtn) {
            dom.clearChatBtn.addEventListener('click', handleClearChat);
        }

        if (dom.promptChips) {
            dom.promptChips.forEach(chip => {
                chip.addEventListener('click', function () {
                    const promptText = this.getAttribute('data-prompt') || this.textContent.trim();
                    if (dom.messageInput) {
                        dom.messageInput.value = promptText;
                        handleSendMessage();
                    }
                });
            });
        }
    }

    function getHistory() {
        try {
            const raw = sessionStorage.getItem(STORAGE_KEY);
            if (raw) return JSON.parse(raw);
        } catch (e) {
            // Use fallback
        }
        return memoryHistory;
    }

    function saveHistory(history) {
        memoryHistory = history;
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        } catch (e) {
            // SessionStorage fallback handled gracefully
        }
    }

    function loadHistory() {
        let history = getHistory();
        if (history.length === 0) {
            // Seed with comprehensive welcome & orientation message
            history = [{
                sender: 'assistant',
                text: "### Welcome to CodeArena Java Mentor\n\nI am your interactive Java learning assistant. I can help explain algorithmic concepts, walk through data structures, analyze time and space complexity, or debug tricky syntax patterns.\n\nSelect one of the suggested inquiries on the left, or ask any question in the composer below to begin!\n\n*Note: All responses are generated locally as simulated educational preview guidance.*",
                code: null,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }];
            saveHistory(history);
        }
    }

    function renderHistory() {
        if (!dom.chatMessages) return;
        const history = getHistory();

        dom.chatMessages.innerHTML = history.map((msg, index) => {
            const isUser = msg.sender === 'user';
            return `
                <div class="chat-msg ${isUser ? 'user-msg' : 'assistant-msg'}">
                    <div class="msg-avatar" aria-hidden="true">
                        ${isUser
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8.01" y2="16"/><line x1="16" y1="16" x2="16.01" y2="16"/></svg>'
}
                    </div>
                    <div class="msg-bubble">
                        ${!isUser ? '<div style="margin-bottom: 6px;"><span class="preview-badge-pill">Simulated Preview Response</span></div>' : ''}
                        <div>${formatMessageText(msg.text)}</div>
                        ${msg.code ? `
                            <div class="msg-code-block">
                                <div class="code-block-header">
                                    <span>Java 17 Example</span>
                                    <button type="button" class="code-copy-btn" data-index="${index}">Copy Code</button>
                                </div>
                                <pre><code>${escapeHtml(msg.code)}</code></pre>
                            </div>
                        ` : ''}
                        <div style="font-size: 0.72rem; color: var(--color-text-muted); margin-top: 6px; text-align: ${isUser ? 'right' : 'left'};">
                            ${escapeHtml(msg.timestamp || '')}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Bind copy buttons
        dom.chatMessages.querySelectorAll('.code-copy-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const idx = parseInt(this.getAttribute('data-index'), 10);
                const history = getHistory();
                if (history[idx] && history[idx].code) {
                    navigator.clipboard.writeText(history[idx].code).then(() => {
                        this.textContent = 'Copied!';
                        setTimeout(() => { this.textContent = 'Copy Code'; }, 1800);
                    }).catch(() => {
                        this.textContent = 'Selected';
                    });
                }
            });
        });

        // Scroll to bottom smoothly
        setTimeout(() => {
            if (dom.chatMessages) {
                dom.chatMessages.scrollTo({ top: dom.chatMessages.scrollHeight, behavior: 'smooth' });
            }
        }, 30);
            dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
    }

    function handleSendMessage() {
        if (!dom.messageInput) return;
        const text = dom.messageInput.value.trim();
        if (!text) return;

        const history = getHistory();
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Add user message
        history.push({
            sender: 'user',
            text: text,
            code: null,
            timestamp: now
        });
        saveHistory(history);
        dom.messageInput.value = '';
        renderHistory();

        // Simulate typing delay
        simulateAssistantResponse(text);
    }

    function simulateAssistantResponse(userPrompt) {
        const lowerPrompt = userPrompt.toLowerCase();
        let matched = null;

        for (const item of KNOWLEDGE_BASE) {
            if (item.keywords.some(kw => lowerPrompt.includes(kw))) {
                matched = item;
                break;
            }
        }

        setTimeout(() => {
            const history = getHistory();
            const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            if (matched) {
                history.push({
                    sender: 'assistant',
                    text: `### ${matched.title}\n\n${matched.response}`,
                    code: matched.code,
                    timestamp: now
                });
            } else {
                history.push({
                    sender: 'assistant',
                    text: `Great question regarding: **"${escapeHtml(userPrompt)}"**.\n\nIn Java development, approach this problem systematically:\n1. **Verify Types & Signatures:** Check parameter types and return contracts.\n2. **Handle Edge Cases:** Test empty arrays, \`null\` pointers, and boundary numbers (0, negative).\n3. **Measure Time & Space Complexity:** Identify whether nested loops can be optimized using hash structures.\n\n*Note: This is a simulated learning response demonstrating CodeArena's upcoming AI mentoring assistant.*`,
                    code: `// Sample Java skeleton to test your logic\npublic class Solution {\n    public static void main(String[] args) {\n        System.out.println("Testing hypothesis...");\n    }\n}`,
                    timestamp: now
                });
            }
            saveHistory(history);
            renderHistory();
        }, 500);
    }

    function handleClearChat() {
        if (confirm('Clear your current conversation history? (This will reset the session chat)')) {
            const resetHistory = [{
                sender: 'assistant',
                text: "Chat cleared. Ask me any Java concept, interview question, or debugging query!",
                code: null,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }];
            saveHistory(resetHistory);
            renderHistory();
            if (window.CodeArenaToast) {
                window.CodeArenaToast.info('Simulated conversation cleared');
            }
        }
    }

    function formatMessageText(text) {
        if (!text) return '';
        // Safe basic markdown parsing (headings, bold, italics, code, lists, paragraphs)
        return escapeHtml(text)
            .replace(/^### (.*$)/gim, '<h4 style="margin: 0 0 8px 0; font-size: 1.05rem; font-weight: 700; color: var(--color-text-primary);">$1</h4>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code style="font-family: var(--font-family-mono); background: var(--color-bg-primary); padding: 2px 6px; border-radius: 4px; font-size: 0.84rem; color: var(--color-primary); border: 1px solid var(--color-border);">$1</code>')
            .replace(/^(\d+\.\s+.*$)/gim, '<div style="margin: 4px 0 4px 12px; line-height: 1.55;">$1</div>')
            .replace(/^- (.*$)/gim, '<div style="margin: 4px 0 4px 12px; line-height: 1.55;">• $1</div>')
            .replace(/\n\n/g, '<div style="height: 8px;"></div>')
            .replace(/\n/g, '<br>');
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
