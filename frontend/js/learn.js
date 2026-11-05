/**
 * CodeArena — Java Learning Centre Controller (learn.js)
 * Manages 14 structured educational Java learning paths, interactive lesson navigation,
 * runnable code demonstrations, knowledge-check quizzes, and 8 Interactive Educational
 * Animations with step-by-step visualizers and player controls (Feature 3).
 */

(function () {
    'use strict';

    const PROGRESS_KEY = 'codearena_learning_progress';

    // 1. The 14 Structured Learning Paths with Practice Challenge Mappings
    const LESSONS = [
        {
            id: 'java-fundamentals',
            title: '1. Java Fundamentals & JVM Architecture',
            category: 'Basics',
            level: 'Beginner',
            readTime: '6 min',
            practiceProblem: { problemId: 'two-sum', title: 'Two Sum' },
            animationId: 'java-execution',
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
            practiceProblem: { problemId: 'reverse-integer', title: 'Reverse Integer' },
            animationId: 'variables-memory',
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
            practiceProblem: { problemId: 'fizz-buzz', title: 'Fizz Buzz' },
            animationId: 'loops-iteration',
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
            practiceProblem: { problemId: 'valid-anagram', title: 'Valid Anagram' },
            animationId: 'arrays-traversal',
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
            practiceProblem: { problemId: 'fibonacci-number', title: 'Fibonacci Number' },
            animationId: 'recursion-stack',
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
            practiceProblem: { problemId: 'lru-cache', title: 'LRU Cache' },
            animationId: 'stack-heap',
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
            practiceProblem: { problemId: 'valid-parentheses', title: 'Valid Parentheses' },
            animationId: 'inheritance-hierarchy',
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
            practiceProblem: { problemId: 'merge-k-sorted-lists', title: 'Merge k Sorted Lists' },
            animationId: 'polymorphism-dispatch',
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
            practiceProblem: { problemId: 'string-to-integer-atoi', title: 'String to Integer (atoi)' },
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
            practiceProblem: { problemId: 'group-anagrams', title: 'Group Anagrams' },
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
            practiceProblem: { problemId: 'implement-queue-using-stacks', title: 'Implement Queue using Stacks' },
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
            practiceProblem: { problemId: 'print-in-order', title: 'Print in Order' },
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
            practiceProblem: { problemId: 'department-top-three-salaries', title: 'Top Salaries' },
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
            practiceProblem: { problemId: 'design-hit-counter', title: 'Design Hit Counter' },
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

    // 2. The 8 Interactive Educational Animations Specifications (Feature 3)
    const ANIMATIONS = [
        {
            animId: 'java-execution',
            title: '1. Java Program Execution Lifecycle',
            category: 'Core JVM Architecture',
            practiceProblem: { problemId: 'two-sum', title: 'Two Sum' },
            steps: [
                {
                    title: '1. Source Code Creation (Main.java)',
                    narration: 'Programmers write human-readable Java source statements in .java files containing class declarations and main methods.',
                    technicalNote: 'Source files are UTF-8 or ASCII plain text processed by lexical and syntactic parsers.',
                    highlight: 0
                },
                {
                    title: '2. javac Compiler Translation',
                    narration: 'The javac compiler parses syntax, checks static typing, and transforms source statements into portable intermediate instructions.',
                    technicalNote: 'Performs syntax analysis, constant folding, and produces binary bytecode without generating machine-specific assembly.',
                    highlight: 1
                },
                {
                    title: '3. Bytecode Generation (Main.class)',
                    narration: 'The output is a portable binary .class file starting with magic bytes 0xCAFEBABE, containing JVM bytecode instructions.',
                    technicalNote: 'Bytecode instructions (e.g., getstatic, ldc, invokevirtual) are strictly 1-byte opcodes followed by operands.',
                    highlight: 2
                },
                {
                    title: '4. JVM ClassLoader & Execution Engine',
                    narration: 'The Java Virtual Machine (JVM) loads bytecode into memory, verifies security constraints, and JIT-compiles frequent paths into CPU machine code.',
                    technicalNote: 'Tiered compilation (C1 Client & C2 Server JIT) compiles hot bytecode into native x86_64/ARM machine instructions.',
                    highlight: 3
                },
                {
                    title: '5. Native OS & Hardware Output',
                    narration: 'The host CPU executes native machine instructions directly against hardware registers, streaming output to stdout in the terminal.',
                    technicalNote: 'Output string "Hello, CodeArena!" is flushed through OS system call write() to file descriptor 1.',
                    highlight: 4
                }
            ],
            render: function (stepIdx) {
                const nodes = [
                    { title: 'Main.java', sub: 'Source Code', icon: '📄' },
                    { title: 'javac', sub: 'Compiler Engine', icon: '⚙️' },
                    { title: 'Main.class', sub: 'Bytecode (0xCAFE)', icon: '📦' },
                    { title: 'JVM & JIT', sub: 'Execution Engine', icon: '☕' },
                    { title: 'Console Out', sub: 'Native Stdout', icon: '💻' }
                ];
                let html = '<div class="anim-pipeline">';
                nodes.forEach((n, idx) => {
                    const isActive = idx === stepIdx;
                    const isCompleted = idx < stepIdx;
                    html += `
                        <div class="anim-node ${isActive ? 'active' : (isCompleted ? 'completed' : '')}">
                            <div class="anim-node-icon">${n.icon}</div>
                            <div class="anim-node-title">${escapeHtml(n.title)}</div>
                            <div class="anim-node-sub">${escapeHtml(n.sub)}</div>
                        </div>
                    `;
                    if (idx < nodes.length - 1) {
                        html += `<div class="anim-arrow ${idx < stepIdx ? 'active' : ''}">→</div>`;
                    }
                });
                html += '</div>';
                return html;
            }
        },
        {
            animId: 'variables-memory',
            title: '2. Primitive Variables & Memory Allocation',
            category: 'Memory & Data Types',
            practiceProblem: { problemId: 'reverse-integer', title: 'Reverse Integer' },
            steps: [
                {
                    title: '1. Declaration: int count',
                    narration: 'JVM reserves a 32-bit slot in the current stack frame. The variable slot is named count.',
                    technicalNote: 'Local variable array slot 1 reserved. In Java, local variables are not default-initialized and must be assigned before read.',
                    stepState: 'decl'
                },
                {
                    title: '2. Initialization: count = 42',
                    narration: 'Binary integer value 42 (0x0000002A) is stored into the 32-bit memory cell.',
                    technicalNote: 'Opcode bipush 42 pushes constant onto operand stack; istore_1 moves it to local variable slot 1.',
                    stepState: 'init'
                },
                {
                    title: '3. Reassignment: count = 43',
                    narration: 'The ALU fetches 42, adds 1, and overwrites the memory slot with the updated value 43.',
                    technicalNote: 'Opcode iinc 1, 1 directly increments local variable slot 1 without consuming operand stack space.',
                    stepState: 'reassign'
                },
                {
                    title: '4. Widening Conversion: double price = count',
                    narration: 'Value 43 is converted to a 64-bit IEEE 754 floating point number (43.0) and stored in a 2-slot double cell.',
                    technicalNote: 'Opcode i2d performs widening conversion without loss of magnitude; occupies 64 bits across slots 2 and 3.',
                    stepState: 'widen'
                }
            ],
            render: function (stepIdx) {
                const s = stepIdx;
                return `
                    <div class="anim-mem-grid">
                        <div class="anim-mem-box">
                            <div class="anim-mem-title">
                                <span>Stack Frame: main()</span>
                                <span style="font-size: 0.7rem; color: #94a3b8;">32-bit Slots</span>
                            </div>
                            <div class="anim-mem-cells-list">
                                <div class="anim-mem-cell ${s >= 0 ? 'active' : ''}">
                                    <span>slot 1: int count</span>
                                    <strong style="color: ${s >= 1 ? '#22c55e' : '#f59e0b'};">
                                        ${s === 0 ? '[uninitialized]' : (s === 1 ? '42 (0x2A)' : '43 (0x2B)')}
                                    </strong>
                                </div>
                                <div class="anim-mem-cell ${s >= 3 ? 'highlight active' : ''}">
                                    <span>slots 2-3: double price</span>
                                    <strong style="color: ${s >= 3 ? '#6ee7b7' : '#64748b'};">
                                        ${s >= 3 ? '43.0 (64-bit float)' : '[empty]'}
                                    </strong>
                                </div>
                            </div>
                        </div>
                        <div class="anim-mem-box">
                            <div class="anim-mem-title">
                                <span>CPU Arithmetic Register</span>
                                <span style="font-size: 0.7rem; color: #94a3b8;">ALU Operation</span>
                            </div>
                            <div style="font-family: monospace; font-size: 0.85rem; padding: 12px; background: #0f172a; border-radius: 6px; border: 1px solid #334155; line-height: 1.6;">
                                ${s === 0 ? '// Variable declared on stack frame\nint count;' :
                                  s === 1 ? '// Constant loaded into slot 1\nbipush 42\nistore_1' :
                                  s === 2 ? '// Increment in-place\niinc 1, 1  // count becomes 43' :
                                  '// Widening cast int -> double\niload_1\ni2d\ndstore_2   // price = 43.0'}
                            </div>
                        </div>
                    </div>
                `;
            }
        },
        {
            animId: 'loops-iteration',
            title: '3. Loop Iterations & State Changes',
            category: 'Control Flow Execution',
            practiceProblem: { problemId: 'fizz-buzz', title: 'Fizz Buzz' },
            steps: [
                {
                    title: '1. Loop Initialization: int i = 0',
                    narration: 'The loop counter i is allocated on the stack and initialized to 0. Condition 0 < 4 evaluates to TRUE.',
                    technicalNote: 'Branch comparison if_icmpge tests loop condition before body execution.',
                    iteration: 0
                },
                {
                    title: '2. Iteration 1: i = 0 (Body Execution)',
                    narration: 'Loop body executes with i = 0. Output logs value 0. Increment i++ increases counter to 1.',
                    technicalNote: 'Local variable table updates i from 0 to 1. Jump back to condition branch.',
                    iteration: 1
                },
                {
                    title: '3. Iteration 2: i = 1 (Body Execution)',
                    narration: 'Condition 1 < 4 is TRUE. Loop body executes with i = 1. Output logs value 1. i++ increases counter to 2.',
                    technicalNote: 'Condition check succeeds. Output buffer appends element.',
                    iteration: 2
                },
                {
                    title: '4. Iteration 3: i = 2 (Body Execution)',
                    narration: 'Condition 2 < 4 is TRUE. Loop body executes with i = 2. Output logs value 2. i++ increases counter to 3.',
                    technicalNote: 'Third iteration complete. State counter ready for final pass.',
                    iteration: 3
                },
                {
                    title: '5. Loop Termination: i = 4 (Condition False)',
                    narration: 'Counter increments to 4. Condition 4 < 4 evaluates to FALSE! Loop terminates immediately and jumps to exit block.',
                    technicalNote: 'Branch if_icmpge evaluates false. Program counter jumps past the loop boundary block.',
                    iteration: 4
                }
            ],
            render: function (stepIdx) {
                const iVal = stepIdx;
                const isTerminated = stepIdx === 4;
                const condTrue = stepIdx < 4;
                return `
                    <div style="display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 600px;">
                        <div style="display: flex; gap: 12px; align-items: center; justify-content: space-around; background: #1e293b; padding: 14px 20px; border-radius: 10px; border: 1px solid #334155;">
                            <div style="text-align: center;">
                                <div style="font-size: 0.72rem; color: #94a3b8; text-transform: uppercase;">Variable i</div>
                                <div style="font-size: 1.4rem; font-weight: bold; color: #818cf8; font-family: monospace;">${iVal}</div>
                            </div>
                            <div style="font-size: 1.2rem; color: #64748b;">→</div>
                            <div style="text-align: center;">
                                <div style="font-size: 0.72rem; color: #94a3b8; text-transform: uppercase;">Condition: i &lt; 4</div>
                                <div style="font-size: 1rem; font-weight: bold; color: ${condTrue ? '#22c55e' : '#ef4444'}; font-family: monospace;">
                                    ${iVal} &lt; 4 (${condTrue ? 'TRUE' : 'FALSE'})
                                </div>
                            </div>
                            <div style="font-size: 1.2rem; color: #64748b;">→</div>
                            <div style="text-align: center;">
                                <div style="font-size: 0.72rem; color: #94a3b8; text-transform: uppercase;">Loop Status</div>
                                <div style="font-size: 0.85rem; font-weight: 700; color: ${isTerminated ? '#ef4444' : '#38bdf8'};">
                                    ${isTerminated ? 'TERMINATED' : 'EXECUTING'}
                                </div>
                            </div>
                        </div>

                        <div style="background: #0f172a; padding: 12px 18px; border-radius: 8px; border: 1px solid #334155; font-family: monospace; font-size: 0.82rem;">
                            <span style="color: #94a3b8;">Printed Output Buffer:</span>
                            <span style="color: #38bdf8; font-weight: bold; margin-left: 8px;">
                                [ ${Array.from({ length: Math.min(stepIdx, 4) }, (_, idx) => `"Item ${idx}"`).join(', ')} ]
                            </span>
                        </div>
                    </div>
                `;
            }
        },
        {
            animId: 'arrays-traversal',
            title: '4. Array Contiguous Indexing & Linear Search',
            category: 'Data Structures',
            practiceProblem: { problemId: 'binary-search', title: 'Binary Search' },
            steps: [
                {
                    title: '1. Array Allocation & Search Target',
                    narration: 'Array {12, 45, 78, 23, 56} is allocated in contiguous heap memory. Search target is 23.',
                    technicalNote: 'Contiguous block of 5 int slots. Direct offset indexing formula: base + (index * 4 bytes).',
                    ptrIdx: -1
                },
                {
                    title: '2. Inspect Index 0: nums[0] = 12',
                    narration: 'Pointer points to slot 0. Compare nums[0] (12) with target (23). 12 != 23. Move forward.',
                    technicalNote: 'Memory read at base + 0. Comparison fails, increment index pointer to 1.',
                    ptrIdx: 0
                },
                {
                    title: '3. Inspect Index 1: nums[1] = 45',
                    narration: 'Pointer advances to slot 1. Compare nums[1] (45) with target (23). 45 != 23. Move forward.',
                    technicalNote: 'Memory read at base + 4. Comparison fails, increment index pointer to 2.',
                    ptrIdx: 1
                },
                {
                    title: '4. Inspect Index 2: nums[2] = 78',
                    narration: 'Pointer advances to slot 2. Compare nums[2] (78) with target (23). 78 != 23. Move forward.',
                    technicalNote: 'Memory read at base + 8. Comparison fails, increment index pointer to 3.',
                    ptrIdx: 2
                },
                {
                    title: '5. Target Found at Index 3: nums[3] = 23!',
                    narration: 'Pointer reaches slot 3. Compare nums[3] (23) with target (23). Match found! Search returns index 3.',
                    technicalNote: 'O(n) worst-case linear search completes successfully in 4 comparisons.',
                    ptrIdx: 3
                }
            ],
            render: function (stepIdx) {
                const arr = [12, 45, 78, 23, 56];
                const activePtr = stepIdx - 1;
                const isFound = stepIdx === 4;
                let html = '<div class="anim-array-track">';
                arr.forEach((val, idx) => {
                    const isCurrent = idx === activePtr;
                    const foundThis = isFound && idx === 3;
                    html += `
                        <div class="anim-array-slot-wrap">
                            <div class="anim-array-slot ${foundThis ? 'found' : (isCurrent ? 'active' : '')}">
                                ${val}
                            </div>
                            <span class="anim-array-idx">[${idx}]</span>
                            <span class="anim-array-ptr-label">${isCurrent ? '▲ PTR' : ''}</span>
                        </div>
                    `;
                });
                html += '</div>';
                return html;
            }
        },
        {
            animId: 'stack-heap',
            title: '5. Stack Frames & Heap Memory Architecture',
            category: 'JVM Memory Model',
            practiceProblem: { problemId: 'lru-cache', title: 'LRU Cache' },
            steps: [
                {
                    title: '1. Main Thread Stack Frame',
                    narration: 'JVM allocates main() activation frame on thread stack. Reference variable Account acc is declared (null).',
                    technicalNote: 'Stack frames store operand stack, local variable table, and runtime constant pool reference.',
                    stage: 1
                },
                {
                    title: '2. Heap Object Allocation: new Account("Alice")',
                    narration: 'JVM allocates memory on Garbage-Collected Heap at address 0x4F1A. Stack variable acc stores reference pointer 0x4F1A.',
                    technicalNote: 'Heap stores object fields (holder="Alice", balance=0.0). Stack stores only 64-bit reference address.',
                    stage: 2
                },
                {
                    title: '3. Method Call: acc.deposit(100.0)',
                    narration: 'JVM pushes deposit() stack frame on top of main(). this pointer references 0x4F1A. Heap balance updated to 100.0.',
                    technicalNote: 'Each method invocation creates an independent stack frame with isolated local variables.',
                    stage: 3
                },
                {
                    title: '4. Method Return & Frame Popped',
                    narration: 'deposit() finishes and its stack frame is popped from the stack. Heap object retains updated state (balance = 100.0).',
                    technicalNote: 'Stack unwinding is instantaneous (O(1)). Heap object remains alive because acc in main() holds active reference.',
                    stage: 4
                }
            ],
            render: function (stepIdx) {
                const s = stepIdx;
                return `
                    <div class="anim-mem-grid">
                        <div class="anim-mem-box">
                            <div class="anim-mem-title">
                                <span>Thread Call Stack</span>
                                <span style="font-size: 0.7rem; color: #94a3b8;">LIFO Frames</span>
                            </div>
                            <div class="anim-stack-col">
                                <div class="anim-stack-frame ${s === 0 ? 'active' : ''}">
                                    <span>main() frame</span>
                                    <strong style="color: #818cf8;">acc = ${s === 0 ? 'null' : '0x4F1A'}</strong>
                                </div>
                                ${s === 2 ? `
                                <div class="anim-stack-frame active" style="border-color: #22c55e;">
                                    <span>deposit(100.0)</span>
                                    <strong style="color: #22c55e;">this = 0x4F1A</strong>
                                </div>` : ''}
                            </div>
                        </div>

                        <div class="anim-mem-box">
                            <div class="anim-mem-title">
                                <span>Garbage-Collected Heap</span>
                                <span style="font-size: 0.7rem; color: #94a3b8;">Shared Dynamic Objects</span>
                            </div>
                            <div style="flex: 1; display: flex; align-items: center; justify-content: center;">
                                ${s === 0 ? '<span style="font-size: 0.8rem; color: #64748b;">[No objects allocated on Heap yet]</span>' : `
                                <div style="background: #0f172a; border: 2px solid ${s >= 2 ? '#22c55e' : '#6366f1'}; border-radius: 8px; padding: 12px 16px; width: 100%; font-family: monospace; font-size: 0.82rem;">
                                    <div style="color: #818cf8; font-weight: bold; margin-bottom: 6px;">Account @ 0x4F1A</div>
                                    <div style="color: #cbd5e1;">holder: "Alice"</div>
                                    <div style="color: #cbd5e1;">balance: <strong style="color: ${s >= 2 ? '#22c55e' : '#f59e0b'};">${s >= 2 ? '100.0' : '0.0'}</strong></div>
                                </div>`}
                            </div>
                        </div>
                    </div>
                `;
            }
        },
        {
            animId: 'inheritance-hierarchy',
            title: '6. Inheritance Hierarchy & Code Reuse',
            category: 'Object-Oriented Design',
            practiceProblem: { problemId: 'valid-parentheses', title: 'Valid Parentheses' },
            steps: [
                {
                    title: '1. Superclass Definition: Animal',
                    narration: 'Superclass Animal defines shared attributes (species, age) and base behavior eat().',
                    technicalNote: 'All classes in Java implicitly extend java.lang.Object as root of class hierarchy.',
                    stage: 1
                },
                {
                    title: '2. Subclass Extension: class Dog extends Animal',
                    narration: 'Subclass Dog inherits all accessible fields and methods from Animal via extends keyword.',
                    technicalNote: 'Dog inherits eat() and superclass constructor chaining through super() call.',
                    stage: 2
                },
                {
                    title: '3. Specialization & Overriding: makeSound() & fetch()',
                    narration: 'Dog overrides makeSound() with specialized implementation ("Woof!") and adds unique method fetch().',
                    technicalNote: '@Override annotation ensures compiler validates signature matches superclass declaration.',
                    stage: 3
                },
                {
                    title: '4. Subclass Instantiation: new Dog("Buddy")',
                    narration: 'Heap object created containing merged layout: Animal base fields + Dog specialized fields.',
                    technicalNote: 'Subclass instance can be assigned to Animal reference type with zero casting.',
                    stage: 4
                }
            ],
            render: function (stepIdx) {
                const s = stepIdx;
                return `
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 14px; width: 100%; max-width: 520px;">
                        <div style="width: 100%; background: #1e293b; border: 2px solid ${s === 0 ? '#6366f1' : '#334155'}; border-radius: 8px; padding: 12px 18px; font-family: monospace; font-size: 0.84rem;">
                            <div style="color: #818cf8; font-weight: bold;">class Animal (Superclass)</div>
                            <div style="color: #94a3b8; font-size: 0.76rem;">Fields: String species, int age</div>
                            <div style="color: #94a3b8; font-size: 0.76rem;">Methods: void eat(), void makeSound()</div>
                        </div>

                        <div style="color: #818cf8; font-weight: bold; font-size: 1.2rem;">▲ extends</div>

                        <div style="width: 100%; background: #0f172a; border: 2px solid ${s >= 1 ? '#22c55e' : '#334155'}; border-radius: 8px; padding: 12px 18px; font-family: monospace; font-size: 0.84rem;">
                            <div style="color: #22c55e; font-weight: bold;">class Dog extends Animal (Subclass)</div>
                            <div style="color: #cbd5e1; font-size: 0.76rem;">Inherited: species, age, eat()</div>
                            <div style="color: #cbd5e1; font-size: 0.76rem;">Specialized: void fetch()</div>
                            <div style="color: #38bdf8; font-size: 0.76rem;">@Override: void makeSound() { "Woof!" }</div>
                        </div>
                    </div>
                `;
            }
        },
        {
            animId: 'polymorphism-dispatch',
            title: '7. Runtime Polymorphism & Dynamic Method Dispatch',
            category: 'OOP Architecture',
            practiceProblem: { problemId: 'merge-k-sorted-lists', title: 'Merge k Sorted Lists' },
            steps: [
                {
                    title: '1. Declare Reference: Animal a',
                    narration: 'Variable a is declared with compile-time type Animal. Compiler checks available methods against Animal class.',
                    technicalNote: 'Static type checking ensures type safety before execution begins.',
                    stage: 1
                },
                {
                    title: '2. Assign Subclass Instance: a = new Dog()',
                    narration: 'Dynamic runtime type of object in Heap is Dog. Polymorphic assignment allows flexible abstractions.',
                    technicalNote: 'Upcasting is implicit and safe because Dog is an Animal.',
                    stage: 2
                },
                {
                    title: '3. Method Invocation: a.makeSound()',
                    narration: 'Code calls a.makeSound(). Compiler verifies makeSound() exists on Animal class.',
                    technicalNote: 'Bytecode emits invokevirtual Animal.makeSound:()V.',
                    stage: 3
                },
                {
                    title: '4. Dynamic Dispatch via vtable: Dog.makeSound() Runs!',
                    narration: 'At runtime, JVM inspects the actual object type in Heap (Dog), checks Dog vtable, and calls Dog.makeSound(). Prints "Woof!".',
                    technicalNote: 'vtable lookup resolves method pointer at runtime, enabling true runtime polymorphism.',
                    stage: 4
                }
            ],
            render: function (stepIdx) {
                const s = stepIdx;
                return `
                    <div class="anim-mem-grid">
                        <div class="anim-mem-box">
                            <div class="anim-mem-title">
                                <span>Compile-Time View</span>
                                <span style="font-size: 0.7rem; color: #94a3b8;">Static Type</span>
                            </div>
                            <div style="background: #0f172a; padding: 12px; border-radius: 6px; border: 1px solid #334155; font-family: monospace; font-size: 0.82rem; line-height: 1.6;">
                                <div style="color: #94a3b8;">// Static reference type</div>
                                <div style="color: #818cf8; font-weight: bold;">Animal a;</div>
                                <div style="color: #94a3b8; margin-top: 6px;">// Method checked by javac</div>
                                <div style="color: ${s >= 2 ? '#38bdf8' : '#64748b'};">a.makeSound();</div>
                            </div>
                        </div>

                        <div class="anim-mem-box">
                            <div class="anim-mem-title">
                                <span>Runtime Dynamic Dispatch (vtable)</span>
                                <span style="font-size: 0.7rem; color: #94a3b8;">JVM Dynamic Binding</span>
                            </div>
                            <div style="background: #0f172a; padding: 12px; border-radius: 6px; border: 1px solid ${s === 3 ? '#22c55e' : '#334155'}; font-family: monospace; font-size: 0.82rem; line-height: 1.6;">
                                <div style="color: #94a3b8;">// Actual Heap Instance:</div>
                                <div style="color: #22c55e; font-weight: bold;">Instance: Dog @ 0x8A10</div>
                                <div style="color: #94a3b8; margin-top: 6px;">// vtable Resolution:</div>
                                <div style="color: ${s === 3 ? '#22c55e' : '#94a3b8'};">
                                    ${s === 3 ? '→ Resolved: Dog.makeSound() => "Woof!"' : 'Waiting for dispatch...'}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        },
        {
            animId: 'recursion-stack',
            title: '8. Recursive Call Stack & Base Case Unwinding',
            category: 'Algorithmic Recursion',
            practiceProblem: { problemId: 'climbing-stairs', title: 'Climbing Stairs' },
            steps: [
                {
                    title: '1. Initial Call: factorial(3)',
                    narration: 'Initial call pushes fact(3) frame onto call stack. Condition n <= 1 is false. Suspends to evaluate 3 * fact(2).',
                    technicalNote: 'Activation record for n=3 allocated on stack. Program counter saved.',
                    depth: 1
                },
                {
                    title: '2. Nested Call: factorial(2)',
                    narration: 'Pushes fact(2) frame onto call stack. Condition n <= 1 is false. Suspends to evaluate 2 * fact(1). Stack depth: 2.',
                    technicalNote: 'Stack grows upwards. Frame 1 waits for return value of Frame 2.',
                    depth: 2
                },
                {
                    title: '3. Base Case Reached: factorial(1)',
                    narration: 'Pushes fact(1) frame. Condition n <= 1 is TRUE! Base case reached. Returns 1 immediately without further recursion.',
                    technicalNote: 'Peak stack depth = 3 frames. Base case stops infinite recursion and prevents StackOverflowError.',
                    depth: 3
                },
                {
                    title: '4. Unwind Frame 2: fact(2) = 2 * 1 = 2',
                    narration: 'fact(1) frame is popped. fact(2) receives 1, calculates 2 * 1 = 2, and returns 2 to caller.',
                    technicalNote: 'Stack unwinding begins. Memory for completed frame is released immediately.',
                    depth: 2
                },
                {
                    title: '5. Unwind Frame 1: fact(3) = 3 * 2 = 6',
                    narration: 'fact(2) frame is popped. fact(3) receives 2, calculates 3 * 2 = 6, and returns final answer 6 to main(). Stack is clear!',
                    technicalNote: 'Recursion complete. Final computation evaluated in O(n) space and O(n) time.',
                    depth: 1
                }
            ],
            render: function (stepIdx) {
                const s = stepIdx;
                return `
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; width: 100%; max-width: 440px;">
                        <div style="font-size: 0.74rem; font-weight: 700; color: #818cf8; text-transform: uppercase;">
                            ${s < 3 ? 'Stack Growth (Pushing)' : 'Stack Unwinding (Popping)'}
                        </div>
                        <div class="anim-stack-col" style="width: 100%;">
                            <div class="anim-stack-frame ${s === 0 || s === 4 ? 'active' : ''}">
                                <span>factorial(n=3)</span>
                                <strong style="color: ${s === 4 ? '#22c55e' : '#818cf8'};">
                                    ${s === 4 ? 'return 3 * 2 = 6' : 'waits for fact(2)'}
                                </strong>
                            </div>
                            ${s >= 1 && s <= 3 ? `
                            <div class="anim-stack-frame ${s === 1 || s === 3 ? 'active' : ''}">
                                <span>factorial(n=2)</span>
                                <strong style="color: ${s === 3 ? '#22c55e' : '#818cf8'};">
                                    ${s === 3 ? 'return 2 * 1 = 2' : 'waits for fact(1)'}
                                </strong>
                            </div>` : ''}
                            ${s === 2 ? `
                            <div class="anim-stack-frame active base-case">
                                <span>factorial(n=1) [BASE CASE]</span>
                                <strong style="color: #6ee7b7;">returns 1</strong>
                            </div>` : ''}
                        </div>
                    </div>
                `;
            }
        }
    ];

    // State
    const state = {
        currentIndex: 0,
        activeMode: 'curriculum', // 'curriculum' | 'animations'
        activeAnimationIndex: 0,
        activeStepIndex: 0,
        isPlaying: false,
        playSpeed: 1.0,
        playTimer: null
    };

    // DOM Elements Cache
    let dom = {};

    function init() {
        cacheElements();
        bindEvents();
        renderTopicsSidebar();
        renderCurrentLesson();
        renderAnimationPills();
        loadAnimationByIndex(0, 0);
        checkUrlDeepLinking();
    }

    function cacheElements() {
        dom = {
            btnModeCurriculum: document.getElementById('btnModeCurriculum'),
            btnModeAnimations: document.getElementById('btnModeAnimations'),
            viewCurriculum: document.getElementById('viewCurriculum'),
            viewAnimationStudio: document.getElementById('viewAnimationStudio'),
            sidebar: document.getElementById('learnTopicsSidebar'),
            lessonCard: document.getElementById('lessonCardArea'),
            prevBtn: document.getElementById('btnPrevLesson'),
            nextBtn: document.getElementById('btnNextLesson'),
            progressText: document.getElementById('lessonProgressText'),
            // Animation Studio Elements
            animPillsBar: document.getElementById('animPillsBar'),
            animCategoryBadge: document.getElementById('animCategoryBadge'),
            animTitle: document.getElementById('animTitle'),
            btnAnimPracticeProblem: document.getElementById('btnAnimPracticeProblem'),
            animStage: document.getElementById('animStage'),
            btnAnimPrev: document.getElementById('btnAnimPrev'),
            btnAnimPlayPause: document.getElementById('btnAnimPlayPause'),
            animPlayBtnLabel: document.getElementById('animPlayBtnLabel'),
            btnAnimNext: document.getElementById('btnAnimNext'),
            btnAnimReset: document.getElementById('btnAnimReset'),
            animStepIndicator: document.getElementById('animStepIndicator'),
            selectAnimSpeed: document.getElementById('selectAnimSpeed'),
            animStepNumberPill: document.getElementById('animStepNumberPill'),
            animStepTitle: document.getElementById('animStepTitle'),
            animStepNarration: document.getElementById('animStepNarration'),
            animStepTechnicalNote: document.getElementById('animStepTechnicalNote')
        };
    }

    function bindEvents() {
        // Mode Switcher Controls
        if (dom.btnModeCurriculum) {
            dom.btnModeCurriculum.addEventListener('click', () => switchMode('curriculum'));
        }
        if (dom.btnModeAnimations) {
            dom.btnModeAnimations.addEventListener('click', () => switchMode('animations'));
        }

        // Lesson Navigation Controls
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

        // Animation Player Controls
        if (dom.btnAnimPrev) {
            dom.btnAnimPrev.addEventListener('click', () => prevAnimStep());
        }
        if (dom.btnAnimNext) {
            dom.btnAnimNext.addEventListener('click', () => nextAnimStep());
        }
        if (dom.btnAnimPlayPause) {
            dom.btnAnimPlayPause.addEventListener('click', () => togglePlay());
        }
        if (dom.btnAnimReset) {
            dom.btnAnimReset.addEventListener('click', () => resetAnimation());
        }
        if (dom.selectAnimSpeed) {
            dom.selectAnimSpeed.addEventListener('change', function () {
                setPlaySpeed(parseFloat(this.value) || 1.0);
            });
        }

        // Global Keyboard Controls for Animation Playback
        window.addEventListener('keydown', function (e) {
            if (state.activeMode !== 'animations') return;
            const target = e.target;
            if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
                return;
            }
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevAnimStep();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextAnimStep();
            } else if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                togglePlay();
            }
        });
    }

    /**
     * Checks URL hash or parameters to support direct navigation.
     */
    function checkUrlDeepLinking() {
        const hash = window.location.hash ? window.location.hash.replace('#', '') : '';
        const params = new URLSearchParams(window.location.search);

        if (params.get('mode') === 'animations' || hash.startsWith('anim-')) {
            switchMode('animations');
            const targetId = params.get('anim') || hash.replace('anim-', '');
            if (targetId) {
                const idx = ANIMATIONS.findIndex(a => (a.animId || a.id) === targetId);
                if (idx !== -1) {
                    loadAnimationByIndex(idx, 0);
                }
            }
            return;
        }

        if (hash) {
            const lessonIdx = LESSONS.findIndex(l => l.id === hash);
            if (lessonIdx !== -1) {
                state.currentIndex = lessonIdx;
                renderTopicsSidebar();
                renderCurrentLesson();
            }
        }
    }

    /**
     * Toggles between Curriculum and Animation Studio modes.
     */
    function switchMode(mode) {
        state.activeMode = mode;
        pause();

        if (dom.btnModeCurriculum) {
            dom.btnModeCurriculum.classList.toggle('active', mode === 'curriculum');
            dom.btnModeCurriculum.setAttribute('aria-selected', mode === 'curriculum' ? 'true' : 'false');
        }
        if (dom.btnModeAnimations) {
            dom.btnModeAnimations.classList.toggle('active', mode === 'animations');
            dom.btnModeAnimations.setAttribute('aria-selected', mode === 'animations' ? 'true' : 'false');
        }

        if (dom.viewCurriculum) {
            dom.viewCurriculum.style.display = (mode === 'curriculum') ? 'block' : 'none';
        }
        if (dom.viewAnimationStudio) {
            dom.viewAnimationStudio.style.display = (mode === 'animations') ? 'block' : 'none';
            if (mode === 'animations') {
                renderAnimationStage();
            }
        }
    }

    // -------------------------------------------------------------------------
    // Concept Curriculum Rendering
    // -------------------------------------------------------------------------

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

            <!-- Concept Practice Card (Feature 3) -->
            ${lesson.practiceProblem ? `
            <div class="concept-practice-card">
                <div class="concept-practice-info">
                    <span class="concept-practice-badge">🎯 Applied Problem Solving</span>
                    <span class="concept-practice-title">Reinforce concept with: ${escapeHtml(lesson.practiceProblem.title)}</span>
                    <span class="concept-practice-desc">Solve canonical algorithmic challenge in the competitive problem-solving workspace</span>
                </div>
                <div class="concept-practice-actions">
                    <a href="problem.html?id=${encodeURIComponent(lesson.practiceProblem.id)}" class="btn-concept-practice">
                        <span>Practice This Concept &rarr;</span>
                    </a>
                    ${lesson.animationId ? `
                    <button type="button" class="btn-concept-anim" data-anim-id="${lesson.animationId}">
                        <span>Watch Animation ⚡</span>
                    </button>` : ''}
                </div>
            </div>` : ''}

            <!-- Table of Contents Navigation -->
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

            <!-- Interactive Knowledge Check Quiz -->
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

            <!-- Lesson Completion Toggle Bar -->
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; background: rgba(99, 102, 241, 0.06); border: 1px solid var(--color-border); border-radius: 8px; margin-top: 28px;">
                <div>
                    <div style="font-weight: 600; font-size: 0.88rem; color: var(--color-text-primary);">Lesson Progress</div>
                    <div style="font-size: 0.75rem; color: var(--color-text-muted);">Status stored locally in browser storage</div>
                </div>
                <button type="button" class="btn btn-sm ${isCompleted ? 'btn-success' : 'btn-outline'}" id="btnToggleLessonComplete">
                    ${isCompleted ? '✓ Completed' : 'Mark as Complete'}
                </button>
            </div>
        `;

        // Bind animation quick-switch buttons inside lessons
        dom.lessonCard.querySelectorAll('.btn-concept-anim').forEach(btn => {
            btn.addEventListener('click', function () {
                const animId = this.getAttribute('data-anim-id');
                const animIdx = ANIMATIONS.findIndex(a => (a.animId || a.id) === animId);
                if (animIdx !== -1) {
                    switchMode('animations');
                    loadAnimationByIndex(animIdx, 0);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                }
            });
        });

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

    // -------------------------------------------------------------------------
    // Animation Studio Controller & Player Engine (Feature 3)
    // -------------------------------------------------------------------------

    function renderAnimationPills() {
        if (!dom.animPillsBar) return;
        dom.animPillsBar.innerHTML = '';

        ANIMATIONS.forEach((anim, idx) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `anim-pill-btn ${idx === state.activeAnimationIndex ? 'active' : ''}`;
            btn.textContent = anim.title;
            btn.setAttribute('role', 'tab');
            btn.setAttribute('aria-selected', idx === state.activeAnimationIndex ? 'true' : 'false');
            btn.addEventListener('click', () => {
                loadAnimationByIndex(idx, 0);
            });
            dom.animPillsBar.appendChild(btn);
        });
    }

    function loadAnimationByIndex(animIndex, stepIndex) {
        pause();
        state.activeAnimationIndex = animIndex;
        state.activeStepIndex = stepIndex || 0;

        const anim = ANIMATIONS[state.activeAnimationIndex];
        if (!anim) return;

        // Synchronize pills
        if (dom.animPillsBar) {
            const pills = dom.animPillsBar.querySelectorAll('.anim-pill-btn');
            pills.forEach((p, idx) => {
                p.classList.toggle('active', idx === animIndex);
                p.setAttribute('aria-selected', idx === animIndex ? 'true' : 'false');
            });
        }

        // Header info
        if (dom.animCategoryBadge) dom.animCategoryBadge.textContent = anim.category;
        if (dom.animTitle) dom.animTitle.textContent = anim.title;

        // Practice button
        if (dom.btnAnimPracticeProblem) {
            if (anim.practiceProblem) {
                const probId = anim.practiceProblem.problemId || anim.practiceProblem.id;
                dom.btnAnimPracticeProblem.href = `problem.html?id=${encodeURIComponent(probId)}`;
                dom.btnAnimPracticeProblem.style.display = 'inline-flex';
                dom.btnAnimPracticeProblem.title = `Practice ${anim.practiceProblem.title} on CodeArena`;
            } else {
                dom.btnAnimPracticeProblem.style.display = 'none';
            }
        }

        renderAnimationStage();
    }

    function renderAnimationStage() {
        const anim = ANIMATIONS[state.activeAnimationIndex];
        if (!anim) return;

        const currentStep = anim.steps[state.activeStepIndex] || anim.steps[0];
        const totalSteps = anim.steps.length;

        // Update visual stage
        if (dom.animStage && typeof anim.render === 'function') {
            dom.animStage.innerHTML = anim.render(state.activeStepIndex);
        }

        // Update step controls
        if (dom.btnAnimPrev) dom.btnAnimPrev.disabled = state.activeStepIndex === 0;
        if (dom.btnAnimNext) dom.btnAnimNext.disabled = state.activeStepIndex === totalSteps - 1;

        // Update step badge
        if (dom.animStepIndicator) {
            dom.animStepIndicator.textContent = `Step ${state.activeStepIndex + 1} of ${totalSteps}`;
        }

        // Update live narration card
        if (dom.animStepNumberPill) {
            dom.animStepNumberPill.textContent = `Step ${state.activeStepIndex + 1}`;
        }
        if (dom.animStepTitle) {
            dom.animStepTitle.textContent = currentStep.title;
        }
        if (dom.animStepNarration) {
            dom.animStepNarration.textContent = currentStep.narration;
        }
        if (dom.animStepTechnicalNote) {
            dom.animStepTechnicalNote.textContent = currentStep.technicalNote;
        }
    }

    function nextAnimStep() {
        const anim = ANIMATIONS[state.activeAnimationIndex];
        if (!anim) return;
        if (state.activeStepIndex < anim.steps.length - 1) {
            state.activeStepIndex++;
            renderAnimationStage();
        } else if (state.isPlaying) {
            pause();
        }
    }

    function prevAnimStep() {
        if (state.activeStepIndex > 0) {
            state.activeStepIndex--;
            renderAnimationStage();
        }
    }

    function resetAnimation() {
        pause();
        state.activeStepIndex = 0;
        renderAnimationStage();
        if (window.CodeArenaToast) {
            window.CodeArenaToast.info('Animation reset to Step 1');
        }
    }

    function togglePlay() {
        if (state.isPlaying) {
            pause();
        } else {
            play();
        }
    }

    function play() {
        const anim = ANIMATIONS[state.activeAnimationIndex];
        if (!anim) return;

        // If at the end, restart to step 0
        if (state.activeStepIndex >= anim.steps.length - 1) {
            state.activeStepIndex = 0;
            renderAnimationStage();
        }

        state.isPlaying = true;
        updatePlayButtonUI(true);

        clearInterval(state.playTimer);
        const baseInterval = 2400;
        const intervalTime = Math.max(700, Math.round(baseInterval / state.playSpeed));

        state.playTimer = setInterval(() => {
            if (state.activeStepIndex < anim.steps.length - 1) {
                state.activeStepIndex++;
                renderAnimationStage();
            } else {
                pause();
            }
        }, intervalTime);
    }

    function pause() {
        state.isPlaying = false;
        clearInterval(state.playTimer);
        state.playTimer = null;
        updatePlayButtonUI(false);
    }

    function setPlaySpeed(speed) {
        state.playSpeed = speed;
        if (state.isPlaying) {
            // Restart interval with new speed
            play();
        }
    }

    function updatePlayButtonUI(isPlaying) {
        if (!dom.btnAnimPlayPause) return;
        if (isPlaying) {
            dom.btnAnimPlayPause.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
                <span>Pause</span>
            `;
            dom.btnAnimPlayPause.title = 'Pause Animation';
            dom.btnAnimPlayPause.setAttribute('aria-label', 'Pause animation');
        } else {
            dom.btnAnimPlayPause.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <span>Play</span>
            `;
            dom.btnAnimPlayPause.title = 'Play Animation (Spacebar)';
            dom.btnAnimPlayPause.setAttribute('aria-label', 'Play animation');
        }
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

    // Expose controller for inspection and automated tests
    window.CodeArenaLearn = {
        getLessons: () => LESSONS.slice(),
        getCurrentLesson: () => LESSONS[state.currentIndex],
        getAnimations: () => ANIMATIONS.slice(),
        getActiveAnimation: () => ANIMATIONS[state.activeAnimationIndex],
        getActiveStep: () => (ANIMATIONS[state.activeAnimationIndex] ? ANIMATIONS[state.activeAnimationIndex].steps[state.activeStepIndex] : null),
        getActiveMode: () => state.activeMode,
        switchMode: switchMode,
        loadAnimationByIndex: loadAnimationByIndex,
        loadAnimationById: (id) => {
            const idx = ANIMATIONS.findIndex(a => (a.animId || a.id) === id);
            if (idx !== -1) loadAnimationByIndex(idx, 0);
        },
        nextAnimStep: nextAnimStep,
        prevAnimStep: prevAnimStep,
        resetAnimation: resetAnimation,
        play: play,
        pause: pause,
        togglePlay: togglePlay,
        setPlaySpeed: setPlaySpeed,
        isPlaying: () => state.isPlaying
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
