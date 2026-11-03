/**
 * CodeArena — Java Learning Centre Controller (learn.js)
 * Manages 14 structured educational Java learning paths, interactive lesson navigation,
 * runnable code demonstrations, and knowledge-check quizzes.
 */

(function () {
    'use strict';

    const PROGRESS_KEY = 'codearena_learning_progress';

    // The 14 Structured Learning Paths
    const LESSONS = [
        {
            id: 'java-fundamentals',
            title: '1. Java Fundamentals & JVM Architecture',
            category: 'Basics',
            level: 'Beginner',
            readTime: '6 min',
            summary: 'Learn how Java source code is compiled into bytecode and executed by the Java Virtual Machine across any platform.',
            content: `
                <p>Java is a high-level, class-based, object-oriented programming language designed around the philosophy of <em>"Write Once, Run Anywhere"</em> (WORA).</p>
                <h2>How Java Execution Works</h2>
                <ol style="padding-left: 20px; line-height: 1.6;">
                    <li><strong>Compilation:</strong> The Java Compiler (<code>javac</code>) compiles human-readable source code (<code>.java</code>) into platform-independent intermediate <strong>bytecode</strong> (<code>.class</code>).</li>
                    <li><strong>Execution:</strong> The <strong>Java Virtual Machine (JVM)</strong> loads the bytecode, verifies security and types, and uses the <strong>Just-In-Time (JIT)</strong> compiler to compile frequently executed bytecode into native machine code for maximum speed.</li>
                </ol>
                <h2>The Structure of a Java Program</h2>
                <p>Every Java application requires at least one class definition and an entry point method named <code>main</code>:</p>
            `,
            code: `public class Main {\n    // Entry point of every standalone Java program\n    public static void main(String[] args) {\n        System.out.println("Welcome to Java on CodeArena!");\n    }\n}`,
            quiz: {
                question: "What intermediate format does the Java Compiler (javac) produce from .java files?",
                options: [
                    "Native assembly machine code",
                    "Platform-independent bytecode (.class files)",
                    "JavaScript source code",
                    "A raw memory executable file"
                ],
                answer: 1,
                explanation: "javac compiles Java source code into portable bytecode (.class files), which is then interpreted or JIT-compiled by the Java Virtual Machine (JVM) on any supported operating system."
            }
        },
        {
            id: 'variables-datatypes',
            title: '2. Variables & Primitive Data Types',
            category: 'Basics',
            level: 'Beginner',
            readTime: '5 min',
            summary: 'Understand the 8 primitive data types in Java, type casting rules, and variable scoping.',
            content: `
                <p>Java is a strictly and statically typed language. Every variable must have an explicitly declared type before it can store data.</p>
                <h2>The 8 Primitive Types in Java</h2>
                <ul style="padding-left: 20px; line-height: 1.6;">
                    <li><strong>Integer Types:</strong> <code>byte</code> (8-bit), <code>short</code> (16-bit), <code>int</code> (32-bit), <code>long</code> (64-bit with suffix 'L').</li>
                    <li><strong>Floating-Point:</strong> <code>float</code> (32-bit with 'f'), <code>double</code> (64-bit standard decimal).</li>
                    <li><strong>Text & Logic:</strong> <code>char</code> (16-bit Unicode character enclosed in single quotes), <code>boolean</code> (<code>true</code> or <code>false</code>).</li>
                </ul>
            `,
            code: `public class DataPrimitives {\n    public static void main(String[] args) {\n        int count = 42;\n        double price = 19.99;\n        char grade = 'A';\n        boolean isActive = true;\n\n        // Type widening (implicit)\n        double widened = count;\n\n        System.out.println("Count: " + count + ", Widened: " + widened);\n    }\n}`,
            quiz: {
                question: "Which of the following is NOT a primitive data type in Java?",
                options: ["int", "boolean", "String", "double"],
                answer: 2,
                explanation: "String in Java is a reference object class provided by java.lang.String, whereas int, boolean, and double are built-in primitive types."
            }
        },
        {
            id: 'operators-control-flow',
            title: '3. Operators & Control Flow',
            category: 'Basics',
            level: 'Beginner',
            readTime: '7 min',
            summary: 'Master conditional branching (if/else, switch expressions) and iterative loops (for, while, do-while).',
            content: `
                <p>Control flow structures govern the decision-making and repetition pathways of your software.</p>
                <h2>Modern Switch Expressions (Java 14+)</h2>
                <p>Java supports arrow syntax for <code>switch</code> expressions that can return values without risk of accidental fall-through.</p>
            `,
            code: `public class ControlFlowDemo {\n    public static void main(String[] args) {\n        int dayOfWeek = 3;\n\n        // Modern switch expression returning a string\n        String dayName = switch (dayOfWeek) {\n            case 1 -> "Monday";\n            case 2 -> "Tuesday";\n            case 3 -> "Wednesday";\n            default -> "Weekend/Other";\n        };\n\n        System.out.println("Day: " + dayName);\n    }\n}`,
            quiz: {
                question: "In a standard while loop, when is the condition evaluated?",
                options: [
                    "After the loop body executes at least once",
                    "Before every iteration of the loop body",
                    "Only once when the program launches",
                    "Simultaneously while executing the body"
                ],
                answer: 1,
                explanation: "A while loop evaluates its boolean condition before executing each iteration. If the condition is initially false, the loop body does not run even once."
            }
        },
        {
            id: 'arrays-strings',
            title: '4. Arrays & String Manipulation',
            category: 'Data Structures',
            level: 'Beginner',
            readTime: '7 min',
            summary: 'Examine fixed-size primitive arrays, String immutability, and efficient mutations using StringBuilder.',
            content: `
                <p>Arrays are fixed-size sequential containers stored in contiguous heap memory. Strings in Java are immutable reference sequences of characters.</p>
                <h2>String Immutability</h2>
                <p>Because Strings cannot be modified after instantiation, modifying strings in loops creates many garbage objects. Use <code>StringBuilder</code> for high-throughput string construction.</p>
            `,
            code: `public class ArraysAndStrings {\n    public static void main(String[] args) {\n        int[] numbers = {10, 20, 30, 40, 50};\n\n        StringBuilder sb = new StringBuilder();\n        for (int n : numbers) {\n            sb.append("Num: ").append(n).append("; ");\n        }\n\n        System.out.println(sb.toString());\n    }\n}`,
            quiz: {
                question: "What happens when you reassign a String variable using string concatenation (e.g., str = str + \"!\")?",
                options: [
                    "The original String buffer is expanded in-place in memory",
                    "A new String object is allocated on the Heap",
                    "The string is converted to an int array",
                    "An OutOfMemoryError is thrown immediately"
                ],
                answer: 1,
                explanation: "Because String objects are immutable in Java, concatenation creates a brand-new String object on the heap, leaving the old string eligible for garbage collection."
            }
        },
        {
            id: 'methods-recursion',
            title: '5. Methods & Recursion',
            category: 'Algorithms',
            level: 'Intermediate',
            readTime: '8 min',
            summary: 'Structure reusable logic using parameter passing by value, method overloading, and recursive algorithms.',
            content: `
                <p>Java methods define reusable functional blocks. Java strictly uses <strong>pass-by-value</strong>: when passing object references, a copy of the reference address is passed.</p>
            `,
            code: `public class MethodRecursion {\n    // Method overloading\n    public static int add(int a, int b) { return a + b; }\n    public static double add(double a, double b) { return a + b; }\n\n    // Recursive Fibonacci\n    public static int fib(int n) {\n        if (n <= 1) return n;\n        return fib(n - 1) + fib(n - 2);\n    }\n\n    public static void main(String[] args) {\n        System.out.println("Fib(6) = " + fib(6)); // 8\n    }\n}`,
            quiz: {
                question: "What error occurs if a recursive function fails to hit its base case?",
                options: ["NullPointerException", "StackOverflowError", "ClassCastException", "IndexOutOfBoundsException"],
                answer: 1,
                explanation: "Infinite recursive calls keep pushing activation frames onto the thread's call stack until stack memory is exhausted, throwing a java.lang.StackOverflowError."
            }
        },
        {
            id: 'oop-fundamentals',
            title: '6. Object-Oriented Programming (Classes & Objects)',
            category: 'OOP',
            level: 'Beginner',
            readTime: '8 min',
            summary: 'Understand classes as blueprints, object instances on the heap, encapsulation, and constructors.',
            content: `
                <p>Object-Oriented Programming models real-world entities through state (fields) and behavior (methods). Encapsulation protects private state via getter and setter methods.</p>
            `,
            code: `public class BankAccount {\n    private String accountHolder;\n    private double balance;\n\n    public BankAccount(String holder, double initialDeposit) {\n        this.accountHolder = holder;\n        this.balance = Math.max(0, initialDeposit);\n    }\n\n    public void deposit(double amount) {\n        if (amount > 0) balance += amount;\n    }\n\n    public double getBalance() { return balance; }\n}`,
            quiz: {
                question: "Which keyword is used to refer to the current object instance within a class constructor or method?",
                options: ["super", "this", "self", "instance"],
                answer: 1,
                explanation: "The 'this' keyword in Java refers explicitly to the current invoking instance of the class, commonly used to distinguish field names from constructor parameters."
            }
        },
        {
            id: 'inheritance-polymorphism',
            title: '7. Inheritance & Polymorphism',
            category: 'OOP',
            level: 'Intermediate',
            readTime: '9 min',
            summary: 'Extend classes with the extends keyword, override methods with @Override, and achieve runtime polymorphism.',
            content: `
                <p>Inheritance promotes code reuse by allowing a subclass to inherit attributes and methods from a superclass. Polymorphism allows a subclass object to be treated through its superclass interface.</p>
            `,
            code: `class Animal {\n    public void speak() {\n        System.out.println("Animal sound");\n    }\n}\n\nclass Dog extends Animal {\n    @Override\n    public void speak() {\n        System.out.println("Woof!");\n    }\n}\n\npublic class PolyDemo {\n    public static void main(String[] args) {\n        Animal pet = new Dog(); // Runtime polymorphism\n        pet.speak(); // Prints: Woof!\n    }\n}`,
            quiz: {
                question: "Does Java allow multiple inheritance of classes (e.g., class C extends A, B)?",
                options: ["Yes, for all classes", "No, Java permits single class inheritance only", "Only if both superclasses are abstract", "Only in Java 17+"],
                answer: 1,
                explanation: "Java disallows multiple inheritance of state/classes to eliminate ambiguity (the Diamond Problem). Instead, classes can implement multiple interfaces."
            }
        },
        {
            id: 'abstraction-interfaces',
            title: '8. Abstraction & Interfaces',
            category: 'OOP',
            level: 'Intermediate',
            readTime: '8 min',
            summary: 'Design loose contracts with interfaces, abstract classes, default methods, and multiple interface implementation.',
            content: `
                <p>Abstraction hides internal implementation mechanics and exposes only clear contracts. A class can implement multiple interfaces.</p>
            `,
            code: `interface Playable {\n    void play();\n    default void pause() {\n        System.out.println("Paused");\n    }\n}\n\nclass VideoPlayer implements Playable {\n    @Override\n    public void play() {\n        System.out.println("Playing MP4 video stream");\n    }\n}`,
            quiz: {
                question: "Can an abstract class in Java have concrete methods with complete method bodies?",
                options: [
                    "No, all methods in an abstract class must be abstract",
                    "Yes, abstract classes can mix abstract and concrete methods",
                    "Only if declared as static",
                    "Only if the class has no fields"
                ],
                answer: 1,
                explanation: "Abstract classes can define concrete methods with full implementations alongside abstract methods that subclasses are required to implement."
            }
        },
        {
            id: 'exception-handling',
            title: '9. Exception Handling (try/catch/finally)',
            category: 'Core Java',
            level: 'Intermediate',
            readTime: '8 min',
            summary: 'Handle runtime anomalies gracefully using checked and unchecked exceptions, try-with-resources, and custom exceptions.',
            content: `
                <p>Exceptions disrupt the normal flow of instructions. Java distinguishes between <strong>Checked Exceptions</strong> (subclasses of <code>Exception</code> verified at compile-time) and <strong>Unchecked Exceptions</strong> (subclasses of <code>RuntimeException</code>).</p>
            `,
            code: `public class ExceptionDemo {\n    public static int divide(int a, int b) {\n        if (b == 0) {\n            throw new IllegalArgumentException("Divisor cannot be zero.");\n        }\n        return a / b;\n    }\n\n    public static void main(String[] args) {\n        try {\n            int res = divide(10, 0);\n        } catch (IllegalArgumentException ex) {\n            System.err.println("Handled: " + ex.getMessage());\n        } finally {\n            System.out.println("Cleanup executed.");\n        }\n    }\n}`,
            quiz: {
                question: "When does a finally block execute in a try-catch-finally statement?",
                options: [
                    "Only if an exception was thrown and caught",
                    "Only if no exception occurred",
                    "Always, regardless of whether an exception occurred or was handled",
                    "Only if the program exits normally"
                ],
                answer: 2,
                explanation: "The finally block always executes after try and catch blocks finish, ensuring resource release (unless System.exit() terminates the JVM)."
            }
        },
        {
            id: 'collections-framework',
            title: '10. Collections Framework (List, Set, Map)',
            category: 'Collections',
            level: 'Intermediate',
            readTime: '10 min',
            summary: 'Navigate java.util data structures: ArrayList, LinkedList, HashSet, TreeSet, HashMap, and PriorityQueue.',
            content: `
                <p>The Java Collections Framework provides standardized, high-performance data structure architectures.</p>
                <ul style="padding-left: 20px; line-height: 1.6;">
                    <li><strong>List (Ordered, Duplicates allowed):</strong> <code>ArrayList</code> (amortized O(1) random access), <code>LinkedList</code> (O(1) insertion/deletion at nodes).</li>
                    <li><strong>Set (No duplicates):</strong> <code>HashSet</code> (O(1) lookup), <code>TreeSet</code> (O(log n) ordered red-black tree).</li>
                    <li><strong>Map (Key-Value associations):</strong> <code>HashMap</code>, <code>TreeMap</code>.</li>
                </ul>
            `,
            code: `import java.util.*;\n\npublic class CollectionsDemo {\n    public static void main(String[] args) {\n        Set<String> uniqueTags = new HashSet<>(Arrays.asList("Java", "JVM", "Java"));\n        System.out.println("Unique size: " + uniqueTags.size()); // 2\n\n        Map<String, Integer> scores = new HashMap<>();\n        scores.put("Alice", 95);\n        System.out.println("Alice's score: " + scores.get("Alice"));\n    }\n}`,
            quiz: {
                question: "Which collection should you choose if you need fast O(1) index-based random access to elements?",
                options: ["LinkedList", "ArrayList", "TreeSet", "PriorityQueue"],
                answer: 1,
                explanation: "ArrayList is backed by a contiguous resizable array in memory, allowing instant O(1) random element access via array indices."
            }
        },
        {
            id: 'generics-type-safety',
            title: '11. Generics & Type Safety',
            category: 'Core Java',
            level: 'Intermediate',
            readTime: '8 min',
            summary: 'Eliminate runtime ClassCastExceptions and write flexible, reusable algorithms using type parameters and wildcards.',
            content: `
                <p>Generics enable types (classes and interfaces) to be parameters when defining classes, interfaces, and methods. Type erasure removes generic metadata at compile-time for backward compatibility.</p>
            `,
            code: `public class GenericBox<T> {\n    private T item;\n\n    public void set(T item) { this.item = item; }\n    public T get() { return this.item; }\n\n    public static void main(String[] args) {\n        GenericBox<String> box = new GenericBox<>();\n        box.set("Compile-time safe");\n        String text = box.get(); // No cast required!\n    }\n}`,
            quiz: {
                question: "What is type erasure in the Java compiler?",
                options: [
                    "A runtime error when casting types",
                    "The process where generic type parameters are removed and replaced with Object or bounds in bytecode",
                    "Deleting unused classes from memory",
                    "Converting primitive types to wrapper objects"
                ],
                answer: 1,
                explanation: "Type erasure removes generic type arguments during compilation so generated bytecode is fully compatible with pre-generics Java runtimes."
            }
        },
        {
            id: 'multithreading-concurrency',
            title: '12. Multithreading & Concurrency Basics',
            category: 'Advanced',
            level: 'Advanced',
            readTime: '10 min',
            summary: 'Coordinate parallel tasks using the Thread class, Runnable, synchronized blocks, and ExecutorService.',
            content: `
                <p>Multithreading allows multiple instruction streams to execute concurrently inside a single JVM process, maximizing multi-core CPU utilization.</p>
            `,
            code: `public class ThreadDemo {\n    public static void main(String[] args) {\n        Runnable task = () -> {\n            System.out.println("Running in thread: " + Thread.currentThread().getName());\n        };\n\n        Thread worker = new Thread(task, "Worker-1");\n        worker.start(); // Spawns OS thread\n    }\n}`,
            quiz: {
                question: "Which method starts an actual independent operating system thread in Java?",
                options: ["run()", "start()", "init()", "execute()"],
                answer: 1,
                explanation: "Calling start() registers the thread with the operating system scheduler and allocates call stack resources before invoking run(). Calling run() directly simply executes code on the current thread."
            }
        },
        {
            id: 'jdbc-database-connectivity',
            title: '13. JDBC & Database Connectivity',
            category: 'Enterprise',
            level: 'Advanced',
            readTime: '9 min',
            summary: 'Connect Java to relational databases (MySQL, PostgreSQL) using DriverManager, PreparedStatement, and ResultSet.',
            content: `
                <p>Java Database Connectivity (JDBC) is the industry standard API connecting Java code to relational SQL databases.</p>
                <h2>Security: Always Use PreparedStatement</h2>
                <p>Never concatenate user input directly into SQL strings. <code>PreparedStatement</code> pre-compiles queries and neutralizes SQL Injection vulnerabilities.</p>
            `,
            code: `import java.sql.*;\n\npublic class JdbcExample {\n    public static void main(String[] args) {\n        String url = "jdbc:mysql://localhost:3306/codearena_db";\n        String sql = "SELECT id, title FROM problems WHERE difficulty = ?";\n\n        // Try-with-resources auto-closes database connections\n        try (Connection conn = DriverManager.getConnection(url, "user", "pass");\n             PreparedStatement stmt = conn.prepareStatement(sql)) {\n            stmt.setString(1, "Easy");\n            ResultSet rs = stmt.executeQuery();\n            while (rs.next()) {\n                System.out.println("Problem: " + rs.getString("title"));\n            }\n        } catch (SQLException e) {\n            System.err.println("Database error: " + e.getMessage());\n        }\n    }\n}`,
            quiz: {
                question: "Why is PreparedStatement preferred over Statement for executing SQL queries?",
                options: [
                    "It prevents SQL injection through parameterized binding and improves query performance",
                    "It only works with NoSQL databases",
                    "It does not require database connection credentials",
                    "It automatically creates database tables"
                ],
                answer: 0,
                explanation: "PreparedStatement binds user variables as literal parameters rather than executable SQL code, preventing SQL Injection while allowing database engines to cache precompiled query plans."
            }
        },
        {
            id: 'servlets-web-fundamentals',
            title: '14. Servlets & Web Fundamentals',
            category: 'Enterprise',
            level: 'Advanced',
            readTime: '9 min',
            summary: 'Understand HTTP request handling in Java EE/Jakarta EE using HttpServlet, doGet/doPost, and web application lifecycle.',
            content: `
                <p>Java Servlets form the foundation of enterprise Java web frameworks (such as Spring MVC and Jakarta EE). Servlets intercept HTTP requests, process business logic, and construct HTTP responses.</p>
            `,
            code: `import java.io.IOException;\nimport javax.servlet.*;\nimport javax.servlet.http.*;\n\npublic class HealthCheckServlet extends HttpServlet {\n    @Override\n    protected void doGet(HttpServletRequest req, HttpServletResponse resp) \n            throws ServletException, IOException {\n        resp.setContentType("application/json");\n        resp.getWriter().write("{\\"status\\":\\"ONLINE\\",\\"server\\":\\"CodeArena\\"}");\n    }\n}`,
            quiz: {
                question: "In an HttpServlet, which method is typically overridden to process incoming HTTP GET requests?",
                options: ["doReceive()", "doGet()", "handleRequest()", "serviceGet()"],
                answer: 1,
                explanation: "The HttpServlet base class dispatches HTTP GET requests to the protected doGet(HttpServletRequest req, HttpServletResponse resp) method."
            }
        }
    ];

    // State
    const state = {
        currentIndex: 0
    };

    // DOM Elements Cache
    let dom = {};

    function init() {
        cacheElements();
        bindEvents();
        renderTopicsSidebar();
        renderCurrentLesson();
    }

    function cacheElements() {
        dom = {
            sidebar: document.getElementById('learnTopicsSidebar'),
            lessonCard: document.getElementById('lessonCardArea'),
            prevBtn: document.getElementById('btnPrevLesson'),
            nextBtn: document.getElementById('btnNextLesson'),
            progressText: document.getElementById('lessonProgressText')
        };
    }

    function bindEvents() {
        if (dom.prevBtn) {
            dom.prevBtn.addEventListener('click', function () {
                if (state.currentIndex > 0) {
                    state.currentIndex--;
                    renderTopicsSidebar();
                    renderCurrentLesson();
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                }
            });
        }

        if (dom.nextBtn) {
            dom.nextBtn.addEventListener('click', function () {
                if (state.currentIndex < LESSONS.length - 1) {
                    state.currentIndex++;
                    renderTopicsSidebar();
                    renderCurrentLesson();
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                }
            });
        }
    }

    function renderTopicsSidebar() {
        if (!dom.sidebar) return;

        dom.sidebar.innerHTML = `
            <div style="font-size: 0.76rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted); margin-bottom: 12px;">
                Learning Path Curriculum (14 Modules)
            </div>
            ${LESSONS.map((l, idx) => `
                <div class="learn-topic-item ${idx === state.currentIndex ? 'active' : ''}" data-index="${idx}">
                    <span style="font-size: 0.82rem; line-height: 1.3;">${escapeHtml(l.title)}</span>
                    <span style="font-size: 0.72rem; color: var(--color-text-muted);">${l.level}</span>
                </div>
            `).join('')}
        `;

        dom.sidebar.querySelectorAll('.learn-topic-item').forEach(item => {
            item.addEventListener('click', function () {
                const idx = parseInt(this.getAttribute('data-index'), 10);
                state.currentIndex = idx;
                renderTopicsSidebar();
                renderCurrentLesson();
                window.scrollTo({ top: 120, behavior: 'smooth' });
            });
        });
    }

    function renderCurrentLesson() {
        const lesson = LESSONS[state.currentIndex];
        if (!lesson || !dom.lessonCard) return;

        const completedList = getCompletedLessons();
        const isCompleted = completedList.includes(lesson.id);

        if (dom.progressText) {
            dom.progressText.textContent = `Module ${state.currentIndex + 1} of ${LESSONS.length} • ${completedList.length} Completed`;
        }

        if (dom.prevBtn) dom.prevBtn.disabled = state.currentIndex === 0;
        if (dom.nextBtn) dom.nextBtn.disabled = state.currentIndex === LESSONS.length - 1;

        dom.lessonCard.innerHTML = `
            <div class="lesson-meta-bar">
                <span class="preview-badge-pill">${escapeHtml(lesson.category)}</span>
                <span class="diff-badge ${lesson.level === 'Beginner' ? 'diff-easy' : (lesson.level === 'Intermediate' ? 'diff-medium' : 'diff-hard')}">${escapeHtml(lesson.level)}</span>
                <span style="font-size: 0.78rem; color: var(--color-text-muted);">⏱ ${escapeHtml(lesson.readTime)} read</span>
                ${isCompleted ? '<span style="font-size: 0.76rem; color: #22c55e; font-weight: 600; margin-left: auto;">✓ Completed</span>' : ''}
            </div>

            <h1 class="lesson-title">${escapeHtml(lesson.title)}</h1>
            <p style="font-size: 1rem; color: var(--color-text-muted); margin-bottom: 20px; line-height: 1.5;">${escapeHtml(lesson.summary)}</p>

            <!-- Table of Contents Navigation (Phase 6) -->
            <nav class="lesson-toc-nav" aria-label="Lesson sections">
                <span class="toc-title">Jump to:</span>
                <a href="#lessonOverview" class="toc-link">1. Concepts</a>
                <a href="#lessonCodeBlock" class="toc-link">2. Code Example</a>
                <a href="#lessonQuizBlock" class="toc-link">3. Knowledge Check</a>
            </nav>

            <div class="lesson-content-body" id="lessonOverview">
                ${lesson.content}
            </div>

            <div class="msg-code-block" id="lessonCodeBlock" style="margin-top: 24px;">
                <div class="code-block-header">
                    <span>Java 17 Code Demonstration</span>
                    <div style="display: flex; gap: 8px;">
                        <button type="button" class="code-copy-btn" id="btnCopyLessonCode">Copy Code</button>
                        <a href="compiler.html" class="code-copy-btn" style="text-decoration: none;">Try in Compiler &rarr;</a>
                    </div>
                </div>
                <pre><code id="lessonCodeSnippet">${escapeHtml(lesson.code)}</code></pre>
            </div>

            <!-- Interactive Knowledge Check Quiz (Phase 6 Enhanced) -->
            <div class="quiz-card" id="lessonQuizBlock">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-size: 0.76rem; font-weight: 700; text-transform: uppercase; color: var(--color-primary); letter-spacing: 0.04em;">Knowledge Check</span>
                    <span style="font-size: 0.72rem; color: var(--color-text-muted);">Self-Assessment</span>
                </div>
                <h3 class="quiz-question-title">${escapeHtml(lesson.quiz.question)}</h3>
                <div class="quiz-options-list" id="quizOptionsList">
                    ${lesson.quiz.options.map((opt, optIdx) => `
                        <label class="quiz-option-label" data-idx="${optIdx}">
                            <input type="radio" name="quizOpt" value="${optIdx}">
                            <span>${escapeHtml(opt)}</span>
                        </label>
                    `).join('')}
                </div>
                <div class="quiz-feedback-box" id="quizFeedbackBox"></div>
            </div>

            <!-- Lesson Completion Toggle Bar (Phase 6) -->
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; background: rgba(99, 102, 241, 0.06); border: 1px solid var(--color-border); border-radius: 8px; margin-top: 28px;">
                <div>
                    <div style="font-weight: 600; font-size: 0.88rem; color: var(--color-text-primary);">Lesson Progress</div>
                    <div style="font-size: 0.75rem; color: var(--color-text-muted);">Preview status stored locally in browser storage</div>
                </div>
                <button type="button" class="btn btn-sm ${isCompleted ? 'btn-success' : 'btn-outline'}" id="btnToggleLessonComplete">
                    ${isCompleted ? '✓ Completed' : 'Mark as Complete'}
                </button>
            </div>
        `;

        // Bind copy button
        const copyBtn = document.getElementById('btnCopyLessonCode');
        if (copyBtn) {
            copyBtn.addEventListener('click', function () {
                navigator.clipboard.writeText(lesson.code).then(() => {
                    this.textContent = 'Copied!';
                    if (window.CodeArenaToast) {
                        window.CodeArenaToast.success('Java snippet copied to clipboard');
                    }
                    setTimeout(() => { this.textContent = 'Copy Code'; }, 1800);
                }).catch(() => {
                    if (window.CodeArenaToast) {
                        window.CodeArenaToast.error('Failed to copy to clipboard');
                    }
                });
            });
        }

        // Bind quiz option radios with interactive feedback & retry
        const optLabels = dom.lessonCard.querySelectorAll('.quiz-option-label');
        const feedbackBox = document.getElementById('quizFeedbackBox');

        function bindQuizOptions() {
            optLabels.forEach(label => {
                label.addEventListener('click', function () {
                    const chosenIdx = parseInt(this.getAttribute('data-idx'), 10);
                    const isCorrect = chosenIdx === lesson.quiz.answer;

                    optLabels.forEach(l => l.style.borderColor = 'var(--color-border)');
                    this.style.borderColor = isCorrect ? '#22C55E' : '#EF4444';

                    if (feedbackBox) {
                        feedbackBox.className = 'quiz-feedback-box ' + (isCorrect ? 'correct' : 'incorrect');
                        feedbackBox.innerHTML = `
                            <strong>${isCorrect ? '✓ Correct Answer!' : '✗ Not quite right.'}</strong>
                            <div style="margin-top: 6px; line-height: 1.5;">${escapeHtml(lesson.quiz.explanation)}</div>
                            ${!isCorrect ? '<button type="button" class="btn-retry-quiz" id="btnRetryQuiz">Try Again</button>' : ''}
                        `;

                        const retryBtn = document.getElementById('btnRetryQuiz');
                        if (retryBtn) {
                            retryBtn.addEventListener('click', function (e) {
                                e.stopPropagation();
                                optLabels.forEach(l => {
                                    l.style.borderColor = 'var(--color-border)';
                                    const radio = l.querySelector('input[type="radio"]');
                                    if (radio) radio.checked = false;
                                });
                                feedbackBox.style.display = 'none';
                                feedbackBox.className = 'quiz-feedback-box';
                            });
                        }
                    }
                });
            });
        }
        bindQuizOptions();

        // Bind Lesson Completion Toggle
        const toggleBtn = document.getElementById('btnToggleLessonComplete');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function () {
                const nowCompleted = toggleLessonCompletion(lesson.id);
                renderTopicsSidebar();
                renderCurrentLesson();
                if (window.CodeArenaToast) {
                    window.CodeArenaToast.info(nowCompleted ? 'Lesson marked as complete' : 'Lesson marked as incomplete');
                }
            });
        }
    }

    function getCompletedLessons() {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const raw = window.localStorage.getItem(PROGRESS_KEY);
                if (raw) return JSON.parse(raw);
            }
        } catch (e) {}
        return [];
    }

    function toggleLessonCompletion(lessonId) {
        let list = getCompletedLessons();
        const idx = list.indexOf(lessonId);
        let completed = false;
        if (idx !== -1) {
            list.splice(idx, 1);
        } else {
            list.push(lessonId);
            completed = true;
        }
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(list));
            }
        } catch (e) {}
        return completed;
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
