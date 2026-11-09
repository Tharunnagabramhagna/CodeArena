/**
 * CodeArena — Canonical Guided Java Learning Roadmap Dataset
 * Comprehensive 30-topic progressive curriculum spanning 3 major tiers:
 *   Level 1: Java Fundamentals (8 topics)
 *   Level 2: Core Java Programming (9 topics)
 *   Level 3: Data Structures and Algorithms (13 topics)
 *
 * Mapped strictly to canonical Basic Java (50) and DSA (200) problem datasets.
 * Zero emojis — strictly vector iconography and technical educator tone.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.CodeArenaRoadmapData = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const LEVELS = [
        {
            id: 1,
            title: 'Level 1: Java Fundamentals',
            slug: 'fundamentals',
            badge: 'Beginner Foundations',
            description: 'Master core syntax, primitive types, operator precedence, I/O streams, control flow, loops, and fundamental mathematical programming.',
            topicCount: 8,
            accentColor: '#3B82F6'
        },
        {
            id: 2,
            title: 'Level 2: Core Java Programming',
            slug: 'core-java',
            badge: 'Intermediate Engineering',
            description: 'Transition into modular programming: functional methods, recursion, arrays, strings, object-oriented principles, robust exception handling, and collections.',
            topicCount: 9,
            accentColor: '#10B981'
        },
        {
            id: 3,
            title: 'Level 3: Data Structures & Algorithms',
            slug: 'dsa',
            badge: 'Advanced Problem Solving',
            description: 'Develop asymptotic rigour and master algorithmic patterns: two pointers, sliding window, linked lists, stacks, trees, heaps, graphs, backtracking, and dynamic programming.',
            topicCount: 13,
            accentColor: '#8B5CF6'
        }
    ];

    const TOPICS = [
        // =========================================================================
        // LEVEL 1: JAVA FUNDAMENTALS (Topics 1 - 8)
        // =========================================================================
        {
            id: 'intro-to-java',
            number: 1,
            levelId: 1,
            title: 'Introduction to Java',
            shortDesc: 'JVM architecture, bytecode compilation, class structure, and console output.',
            category: 'Language Architecture',
            prerequisites: [],
            objectives: [
                'Understand the compilation lifecycle from source code (.java) to bytecode (.class) and JVM execution.',
                'Identify the mandatory entrypoint: public static void main(String[] args).',
                'Print formatted text and diagnostics to standard output using System.out.println().',
                'Understand naming conventions for public classes, files, and package declarations.'
            ],
            coreConcepts: '<p>Java is a statically typed, class-based, object-oriented language designed with the "Write Once, Run Anywhere" (WORA) philosophy. Source files are compiled by <code>javac</code> into platform-independent bytecode, which executes inside the Java Virtual Machine (JVM).</p><p>Every standalone executable Java application requires a class containing the exact entrypoint method signature: <code>public static void main(String[] args)</code>. Standard output streams write characters to the console via <code>System.out</code>.</p>',
            codeExample: 'public class Main {\n    public static void main(String[] args) {\n        // Canonical first program\n        System.out.println("Welcome to CodeArena Java Mastery!");\n        \n        // JVM runtime details\n        String version = System.getProperty("java.version");\n        System.out.println("Running on OpenJDK runtime version: " + version);\n    }\n}',
            expectedOutput: 'Welcome to CodeArena Java Mastery!\nRunning on OpenJDK runtime version: 17.0.x',
            commonMistakes: [
                'Mismatching the public class name with the source file name (e.g. naming class Main inside Solution.java).',
                'Omitting the static keyword in the main method signature, causing JVM launcher failures.',
                'Forgetting that Java is strictly case-sensitive (e.g. system.out.println vs System.out.println).'
            ],
            basicProblemIds: ['hello-world'],
            dsaProblemIds: []
        },
        {
            id: 'variables-datatypes',
            number: 2,
            levelId: 1,
            title: 'Variables and Data Types',
            shortDesc: 'Primitive types, memory footprint, variable declaration, initialization, and type casting.',
            category: 'Data Representation',
            prerequisites: ['intro-to-java'],
            objectives: [
                'Distinguish the 8 primitive types: byte, short, int, long, float, double, char, and boolean.',
                'Understand memory footprint, minimum/maximum range limits, and default values.',
                'Perform implicit widening conversions and explicit narrowing type casting safely.',
                'Manage variable scoping within method blocks and avoid uninitialized local variable reads.'
            ],
            coreConcepts: '<p>Java provides eight primitive data types stored directly on the stack with deterministic bit widths (e.g., <code>int</code> is 32-bit signed, <code>long</code> is 64-bit signed). All other types are reference types stored on the heap.</p><p>Widening conversions (e.g., <code>int</code> to <code>double</code>) happen automatically without precision loss. Narrowing conversions (e.g., <code>double</code> to <code>int</code>) require explicit casting <code>(int) value</code> and truncate fractional components or overflow if out of range.</p>',
            codeExample: 'public class DataTypesDemo {\n    public static void main(String[] args) {\n        int count = 42;\n        double price = 19.99;\n        char grade = \'A\';\n        boolean isAvailable = true;\n        \n        // Explicit narrowing cast\n        int truncatedPrice = (int) price;\n        \n        // Swapping two variables using temporary memory\n        int a = 10, b = 25;\n        int temp = a;\n        a = b;\n        b = temp;\n        \n        System.out.println("Swapped: a = " + a + ", b = " + b);\n        System.out.println("Truncated price: " + truncatedPrice);\n    }\n}',
            expectedOutput: 'Swapped: a = 25, b = 10\nTruncated price: 19',
            commonMistakes: [
                'Attempting to read an uninitialized local variable, which triggers a compile-time error.',
                'Integer overflow when computing large products (e.g., 100000 * 100000 exceeds 32-bit int max value ~2.14B).',
                'Confusing single quotes for char literals (\'A\') with double quotes for String objects ("A").'
            ],
            basicProblemIds: ['swap-two-numbers', 'celsius-to-fahrenheit'],
            dsaProblemIds: []
        },
        {
            id: 'operators-expressions',
            number: 3,
            levelId: 1,
            title: 'Operators and Expressions',
            shortDesc: 'Arithmetic, relational, logical, bitwise, assignment, and ternary operators.',
            category: 'Expression Evaluation',
            prerequisites: ['variables-datatypes'],
            objectives: [
                'Evaluate compound arithmetic expressions respecting operator precedence and associativity.',
                'Apply short-circuit evaluation in logical operators (&& and ||).',
                'Execute bitwise transformations using AND (&), OR (|), XOR (^), and bit shifts (<<, >>).',
                'Write concise conditional assignments using the ternary operator (? :).'
            ],
            coreConcepts: '<p>Operators transform operands into evaluated results. In Java, integer division truncates decimal fractions towards zero (e.g. <code>5 / 2 == 2</code>). Logical operators <code>&&</code> and <code>||</code> short-circuit: if the left-hand operand determines the final truth value, the right operand is never evaluated.</p><p>Bitwise operators operate directly on individual bits of integer types, providing optimal efficiency for masking, flags, and powers of two.</p>',
            codeExample: 'public class OperatorsDemo {\n    public static void main(String[] args) {\n        int x = 14, y = 5;\n        \n        System.out.println("Integer division: " + (x / y));     // 2\n        System.out.println("Modulo remainder: " + (x % y));     // 4\n        \n        // Ternary operator: max of two values\n        int maxVal = (x > y) ? x : y;\n        System.out.println("Maximum: " + maxVal);\n        \n        // Bitwise XOR swap property\n        int bitA = 6;  // 0110 in binary\n        int bitB = 3;  // 0011 in binary\n        int xorResult = bitA ^ bitB; // 0101 = 5\n        System.out.println("Bitwise XOR: " + xorResult);\n    }\n}',
            expectedOutput: 'Integer division: 2\nModulo remainder: 4\nMaximum: 14\nBitwise XOR: 5',
            commonMistakes: [
                'Confusing assignment = with equality comparison ==.',
                'Expecting floating-point results from integer division without casting at least one operand to double (e.g. 5 / 2 vs 5.0 / 2).',
                'Misunderstanding operator precedence: mixing bitwise operators with comparisons without parenthesization.'
            ],
            basicProblemIds: ['arithmetic-operations', 'bitwise-operators-demo', 'ternary-operator-maximum'],
            dsaProblemIds: []
        },
        {
            id: 'input-output',
            number: 4,
            levelId: 1,
            title: 'Input and Output',
            shortDesc: 'Console input parsing with Scanner, fast streams with BufferedReader, and formatted printing.',
            category: 'I/O Streams',
            prerequisites: ['variables-datatypes', 'operators-expressions'],
            objectives: [
                'Read primitive tokens using java.util.Scanner (nextInt(), nextDouble(), nextLine()).',
                'Avoid common newline consumption traps when combining token reads with full line reads.',
                'Produce formatted tabular output with System.out.printf() using specifiers (%d, %f, %s, %n).',
                'Properly close I/O streams to avoid resource leaks.'
            ],
            coreConcepts: '<p>Input parsing in competitive Java typically uses <code>java.util.Scanner</code> for standard tokenization and <code>java.io.BufferedReader</code> with <code>StringTokenizer</code> for high-throughput input. <code>Scanner.nextInt()</code> reads the integer but leaves the trailing newline character in the stream buffer.</p><p>Formatted output via <code>System.out.printf()</code> or <code>String.format()</code> allows exact control over decimal precision, padding, alignment, and locale-independent formatting.</p>',
            codeExample: 'import java.util.Scanner;\n\npublic class InputOutputDemo {\n    public static void main(String[] args) {\n        String simulatedInput = "CodeArena\\n42\\n99.50\\n";\n        Scanner sc = new Scanner(simulatedInput);\n        \n        String platform = sc.nextLine();\n        int rank = sc.nextInt();\n        double score = sc.nextDouble();\n        \n        // Formatted printing with specifiers\n        System.out.printf("Platform: %-10s | Rank: #%04d | Score: %.2f%%%n", \n                          platform, rank, score);\n        sc.close();\n    }\n}',
            expectedOutput: 'Platform: CodeArena  | Rank: #0042 | Score: 99.50%',
            commonMistakes: [
                'Calling nextLine() directly after nextInt() without an intermediate nextLine() to consume the leftover newline.',
                'Using Scanner for processing 100,000+ input lines in competitive environments, risking Time Limit Exceeded (TLE).',
                'Hardcoding Windows "\\r\\n" line breaks instead of using %n or System.lineSeparator().'
            ],
            basicProblemIds: ['read-and-print-user-details', 'sum-of-two-numbers', 'formatted-receipt-printer'],
            dsaProblemIds: []
        },
        {
            id: 'conditionals',
            number: 5,
            levelId: 1,
            title: 'Conditional Statements',
            shortDesc: 'Decision making using if, if-else ladders, nested conditions, and switch expressions.',
            category: 'Control Flow',
            prerequisites: ['operators-expressions', 'input-output'],
            objectives: [
                'Construct multi-way decision trees using if, else if, and else blocks.',
                'Evaluate nested conditions and optimize early-exit branching.',
                'Use switch statements and modern switch expressions with arrow syntax (->).',
                'Correctly identify leap years and handle multiple interdependent constraints.'
            ],
            coreConcepts: '<p>Conditionals direct execution flow along different code paths based on Boolean evaluations. When chaining conditions, order branches from most specific to most general to avoid unreachable cases.</p><p>Modern Java supports enhanced switch expressions with arrow syntax (<code>case X -> ...</code>), which prevent accidental fall-through bugs and can yield values directly.</p>',
            codeExample: 'public class ConditionalsDemo {\n    public static void main(String[] args) {\n        int year = 2024;\n        boolean isLeap = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);\n        \n        if (isLeap) {\n            System.out.println(year + " is a Leap Year.");\n        } else {\n            System.out.println(year + " is not a Leap Year.");\n        }\n        \n        int dayOfWeek = 3;\n        String dayType = switch (dayOfWeek) {\n            case 1, 2, 3, 4, 5 -> "Weekday";\n            case 6, 7 -> "Weekend";\n            default -> "Invalid Day";\n        };\n        System.out.println("Day 3 is a: " + dayType);\n    }\n}',
            expectedOutput: '2024 is a Leap Year.\nDay 3 is a: Weekday',
            commonMistakes: [
                'Omitting break statements in traditional switch blocks, resulting in unintended cascade execution.',
                'Using multiple independent if statements instead of an if-else if chain when cases are mutually exclusive.',
                'Placing a semicolon immediately after an if condition: if (condition); { ... }.'
            ],
            basicProblemIds: ['even-or-odd', 'largest-of-three-numbers', 'leap-year-checker', 'grade-calculator'],
            dsaProblemIds: []
        },
        {
            id: 'loops',
            number: 6,
            levelId: 1,
            title: 'Loops and Iteration',
            shortDesc: 'Repetition constructs: for, while, do-while, break, continue, and termination safety.',
            category: 'Iteration',
            prerequisites: ['conditionals'],
            objectives: [
                'Select the appropriate loop construct based on whether iteration bounds are predetermined or condition-based.',
                'Formulate accurate termination criteria to guarantee convergence and prevent infinite loops.',
                'Differentiate pre-tested loops (for, while) from post-tested loops (do-while).',
                'Control iteration flow using break (early termination) and continue (step skipping).'
            ],
            coreConcepts: '<p>Loops repeat a block of statements while a Boolean condition evaluates to true. A standard <code>for</code> loop encapsulates initialization, termination condition, and step increment in a single header.</p><p>A <code>while</code> loop is optimal when the loop count is unknown ahead of time and depends on runtime state. A <code>do-while</code> loop guarantees that the body executes at least once before checking the condition.</p>',
            codeExample: 'public class LoopsDemo {\n    public static void main(String[] args) {\n        // Calculate factorial of 5\n        int n = 5;\n        long factorial = 1;\n        for (int i = 1; i <= n; i++) {\n            factorial *= i;\n        }\n        System.out.println(n + "! = " + factorial);\n        \n        // Counting digits with while\n        int number = 987654;\n        int digitCount = 0;\n        int temp = number;\n        while (temp > 0) {\n            digitCount++;\n            temp /= 10;\n        }\n        System.out.println(number + " has " + digitCount + " digits.");\n    }\n}',
            expectedOutput: '5! = 120\n987654 has 6 digits.',
            commonMistakes: [
                'Off-by-one errors (using < when <= is required, or starting at index 1 instead of 0).',
                'Forgetting to update the loop invariant variable inside a while loop, leading to infinite CPU consumption.',
                'Modifying loop counter variables unexpectedly inside the loop body.'
            ],
            basicProblemIds: ['multiplication-table', 'sum-of-first-n-numbers', 'factorial-of-a-number', 'count-digits-in-number'],
            dsaProblemIds: []
        },
        {
            id: 'number-problems',
            number: 7,
            levelId: 1,
            title: 'Number-Based Problems',
            shortDesc: 'Digit extraction, primality tests, palindromes, Armstrong numbers, and Euclidean GCD/LCM.',
            category: 'Mathematical Logic',
            prerequisites: ['loops'],
            objectives: [
                'Extract individual digits of an integer using modulo (% 10) and integer division (/ 10).',
                'Implement primality testing in O(sqrt(n)) time by examining factors up to the square root.',
                'Reverse integers and determine numerical palindromes without string conversion.',
                'Compute Greatest Common Divisor (GCD) using Euclid\'s subtraction/division algorithm.'
            ],
            coreConcepts: '<p>Mathematical computing in Java requires careful attention to integer bounds and algorithmic efficiency. Primality testing can be bounded at $\\sqrt{n}$ because if $n = a \\times b$, at least one factor must be $\\le \\sqrt{n}$.</p><p>The Euclidean algorithm computes $\\text{GCD}(a, b)$ in $O(\\log(\\min(a, b)))$ steps by observing that $\\text{GCD}(a, b) = \\text{GCD}(b, a \\pmod b)$ until $b = 0$.</p>',
            codeExample: 'public class NumberLogicDemo {\n    public static void main(String[] args) {\n        int num = 29;\n        boolean isPrime = num > 1;\n        for (int i = 2; i * i <= num; i++) {\n            if (num % i == 0) {\n                isPrime = false;\n                break;\n            }\n        }\n        System.out.println(num + " is prime: " + isPrime);\n        \n        // Euclidean GCD\n        int a = 48, b = 18;\n        int x = a, y = b;\n        while (y != 0) {\n            int rem = x % y;\n            x = y;\n            y = rem;\n        }\n        System.out.println("GCD(" + a + ", " + b + ") = " + x);\n    }\n}',
            expectedOutput: '29 is prime: true\nGCD(48, 18) = 6',
            commonMistakes: [
                'Failing to handle negative inputs or 0 and 1 when validating prime numbers (primes are strictly > 1).',
                'Checking up to n instead of sqrt(n) for prime testing, making algorithms unnecessarily slow for large values.',
                'Overflowing integer bounds when computing LCM: (a * b) / gcd can overflow 32-bit int before division.'
            ],
            basicProblemIds: ['prime-number-checker', 'fibonacci-series', 'reverse-a-number', 'number-palindrome', 'armstrong-number', 'gcd-and-lcm'],
            dsaProblemIds: []
        },
        {
            id: 'pattern-programming',
            number: 8,
            levelId: 1,
            title: 'Pattern Programming',
            shortDesc: 'Nested loop geometry: stars, triangles, pyramids, numbers, and Floyd patterns.',
            category: 'Nested Loops',
            prerequisites: ['loops'],
            objectives: [
                'Model 2D geometric matrices using outer row loops (i) and inner column loops (j).',
                'Formulate relationships between row indices and symbol repetitions.',
                'Coordinate leading spaces and trailing symbols to align symmetric pyramids.',
                'Generate consecutive sequence grids such as Floyd\'s Triangle.'
            ],
            coreConcepts: '<p>Pattern programming exercises spatial reasoning and nested loop synchronization. The outer loop dictates the vertical coordinate (rows), while one or more inner loops dictate the horizontal coordinate (spaces, characters, numbers).</p><p>Formulating algebraic expressions for symbol counts (e.g. $2i - 1$ stars for row $i$) transforms visual designs into precise deterministic code.</p>',
            codeExample: 'public class PatternsDemo {\n    public static void main(String[] args) {\n        int rows = 4;\n        \n        // Centered pyramid pattern\n        for (int i = 1; i <= rows; i++) {\n            // Leading spaces\n            for (int s = 1; s <= rows - i; s++) {\n                System.out.print(" ");\n            }\n            // Star symbols\n            for (int j = 1; j <= (2 * i - 1); j++) {\n                System.out.print("*");\n            }\n            System.out.println();\n        }\n    }\n}',
            expectedOutput: '   *\n  ***\n *****\n*******',
            commonMistakes: [
                'Mixing up System.out.print() (inline) with System.out.println() (new line), corrupting the 2D layout.',
                'Confusing row-dependent loop limits with static constants.',
                'Off-by-one column spacing causing asymmetrical or jagged patterns.'
            ],
            basicProblemIds: ['right-triangle-star-pattern', 'inverted-triangle-pattern', 'number-pyramid', 'floyds-triangle'],
            dsaProblemIds: []
        },

        // =========================================================================
        // LEVEL 2: CORE JAVA PROGRAMMING (Topics 9 - 17)
        // =========================================================================
        {
            id: 'methods',
            number: 9,
            levelId: 2,
            title: 'Methods and Modularity',
            shortDesc: 'Function parameters, return types, pass-by-value semantics, and method overloading.',
            category: 'Modular Design',
            prerequisites: ['number-problems'],
            objectives: [
                'Decompose monolithic procedural code into cohesive, reusable functions.',
                'Understand Java\'s strict pass-by-value semantics for both primitive and reference variables.',
                'Implement method overloading by varying parameter counts or data types.',
                'Design clean public application interfaces with clear contracts.'
            ],
            coreConcepts: '<p>A method is a discrete block of statements that executes when called. Java is strictly <strong>pass-by-value</strong> at all times. When a primitive is passed, a copy of the primitive value is created. When an object reference is passed, a copy of the reference address is passed.</p><p>Method overloading enables multiple methods in the same class to share the same name, differentiated by parameter lists at compile time.</p>',
            codeExample: 'public class MethodsDemo {\n    // Method Overloading: Area calculations\n    public static double calculateArea(double radius) {\n        return Math.PI * radius * radius; // Circle\n    }\n    \n    public static double calculateArea(double length, double width) {\n        return length * width; // Rectangle\n    }\n    \n    public static void main(String[] args) {\n        double circleArea = calculateArea(5.0);\n        double rectArea = calculateArea(4.0, 6.0);\n        \n        System.out.printf("Circle Area: %.2f%n", circleArea);\n        System.out.printf("Rectangle Area: %.2f%n", rectArea);\n    }\n}',
            expectedOutput: 'Circle Area: 78.54\nRectangle Area: 24.00',
            commonMistakes: [
                'Attempting to overload methods by changing only the return type, which fails to compile.',
                'Believing that passing an object to a method allows the method to reassign the caller\'s reference variable.',
                'Creating excessively long methods with multiple conflicting responsibilities.'
            ],
            basicProblemIds: ['method-overloading-demo', 'simple-interest-calculator'],
            dsaProblemIds: []
        },
        {
            id: 'recursion',
            number: 10,
            levelId: 2,
            title: 'Recursion and Call Stacks',
            shortDesc: 'Base cases, recursive breakdown, call stack mechanics, and stack overflow prevention.',
            category: 'Algorithmic Paradigms',
            prerequisites: ['methods'],
            objectives: [
                'Identify fundamental recurrence relations and non-negotiable base cases.',
                'Trace execution frames on the JVM method call stack.',
                'Evaluate recursion depth to prevent StackOverflowError on large inputs.',
                'Formulate recursive solutions for factorial, Fibonacci, and digit sums.'
            ],
            coreConcepts: '<p>Recursion is a programming technique where a method solves a problem by calling copies of itself on smaller subproblems. Every valid recursive method must possess two components: at least one <strong>base case</strong> that halts recursion, and a <strong>recursive step</strong> that reduces the problem size.</p><p>Each recursive invocation pushes a new stack frame onto the JVM call stack storing local variables and execution markers.</p>',
            codeExample: 'public class RecursionDemo {\n    // Recursive sum of digits: 1234 -> 1 + 2 + 3 + 4 = 10\n    public static int sumOfDigits(int n) {\n        if (n == 0) {\n            return 0; // Base case\n        }\n        return (n % 10) + sumOfDigits(n / 10); // Recursive step\n    }\n    \n    public static void main(String[] args) {\n        int val = 12345;\n        System.out.println("Sum of digits for " + val + " = " + sumOfDigits(val));\n    }\n}',
            expectedOutput: 'Sum of digits for 12345 = 15',
            commonMistakes: [
                'Omitting the base case or creating a base case that is never reached, triggering StackOverflowError.',
                'Performing redundant recalculations in naive recursive Fibonacci, causing exponential O(2^n) explosion.',
                'Excessive stack memory allocation when an iterative loop would provide O(1) auxiliary space.'
            ],
            basicProblemIds: ['recursive-factorial', 'recursive-fibonacci', 'sum-of-digits-recursion'],
            dsaProblemIds: ['fibonacci-number', 'power-of-three', 'power-of-four']
        },
        {
            id: 'arrays',
            number: 11,
            levelId: 2,
            title: 'Arrays in Java',
            shortDesc: 'Contiguous memory, 0-based indexing, array traversal, memory bounds, and multi-dimensional matrices.',
            category: 'Data Structures',
            prerequisites: ['methods', 'loops'],
            objectives: [
                'Allocate and initialize fixed-size contiguous memory blocks in heap storage.',
                'Safely navigate array indices within the legal range [0, length - 1].',
                'Perform linear scans, find minimum/maximum elements, and reverse arrays in place.',
                'Manipulate 2D grids (matrices) for coordinate and tabular processing.'
            ],
            coreConcepts: '<p>In Java, arrays are dynamically created objects stored on the heap with a fixed length property (<code>arr.length</code>). Array elements reside in contiguous memory, enabling $O(1)$ random access by index.</p><p>Attempting to access an index outside valid boundaries throws an <code>ArrayIndexOutOfBoundsException</code> at runtime.</p>',
            codeExample: 'public class ArraysDemo {\n    public static void main(String[] args) {\n        int[] nums = {12, 45, 7, 89, 23};\n        \n        // Find maximum element\n        int maxVal = nums[0];\n        int sum = 0;\n        for (int x : nums) {\n            if (x > maxVal) maxVal = x;\n            sum += x;\n        }\n        \n        System.out.println("Maximum: " + maxVal);\n        System.out.println("Average: " + ((double) sum / nums.length));\n    }\n}',
            expectedOutput: 'Maximum: 89\nAverage: 35.2',
            commonMistakes: [
                'Accessing arr[arr.length] instead of arr[arr.length - 1], throwing ArrayIndexOutOfBoundsException.',
                'Assuming Java arrays resize automatically (arrays have fixed capacity upon instantiation).',
                'Copying an array by assignment arr2 = arr1, which only copies the reference pointer, not array elements.'
            ],
            basicProblemIds: ['array-sum-and-average', 'find-maximum-and-minimum', 'second-largest-element', 'reverse-an-array'],
            dsaProblemIds: ['find-pivot-index', 'plus-one', 'richest-customer-wealth']
        },
        {
            id: 'strings',
            number: 12,
            levelId: 2,
            title: 'Strings and StringBuilder',
            shortDesc: 'String immutability, the string pool, character manipulation, and efficient buffer mutations.',
            category: 'Data Structures',
            prerequisites: ['arrays'],
            objectives: [
                'Understand the mechanics of String immutability and the JVM String Constant Pool.',
                'Prevent quadratic O(n^2) time complexity by replacing string concatenation loops with StringBuilder.',
                'Perform character inspection, vowel/consonant classification, and frequency counting.',
                'Validate palindromic strings using character comparisons from both ends.'
            ],
            coreConcepts: '<p>In Java, <code>java.lang.String</code> objects are immutable: once allocated, their character contents cannot be altered. Concatenating strings inside a loop with <code>+</code> creates new intermediate String objects each iteration, degrading performance to $O(n^2)$.</p><p><code>StringBuilder</code> provides an extensible, mutable character buffer that achieves amortized $O(1)$ append operations, executing string construction in linear $O(n)$ time.</p>',
            codeExample: 'public class StringsDemo {\n    public static void main(String[] args) {\n        String original = "CodeArena";\n        \n        // Efficient reversal via StringBuilder\n        StringBuilder sb = new StringBuilder(original);\n        String reversed = sb.reverse().toString();\n        \n        System.out.println("Original: " + original);\n        System.out.println("Reversed: " + reversed);\n        \n        // Case-insensitive palindrome check\n        String test = "Radar";\n        boolean isPalin = test.equalsIgnoreCase(new StringBuilder(test).reverse().toString());\n        System.out.println(test + " is palindrome: " + isPalin);\n    }\n}',
            expectedOutput: 'Original: CodeArena\nReversed: anerAedoC\nRadar is palindrome: true',
            commonMistakes: [
                'Comparing String contents using == instead of .equals() (== compares memory addresses, not characters).',
                'Ignoring String immutability and forgetting that methods like .toUpperCase() return a new String rather than modifying in place.',
                'Using string concatenation in heavy loops instead of StringBuilder.'
            ],
            basicProblemIds: ['reverse-a-string-basic', 'count-vowels-and-consonants', 'palindrome-string-check', 'character-frequency-counter'],
            dsaProblemIds: ['length-of-last-word', 'defanging-ip-address', 'jewels-and-stones']
        },
        {
            id: 'oop-basics',
            number: 13,
            levelId: 2,
            title: 'Object-Oriented Programming Basics',
            shortDesc: 'Classes, objects, instance vs static members, state-behavior modeling, and this reference.',
            category: 'OOP Foundations',
            prerequisites: ['methods'],
            objectives: [
                'Model domain concepts using classes as blueprints and objects as active heap instances.',
                'Differentiate instance variables (per object) from static variables (per class).',
                'Utilize the this keyword to disambiguate field names from parameters.',
                'Create and manage multiple object instances with distinct state.'
            ],
            coreConcepts: '<p>Object-Oriented Programming (OOP) organizes software around data models and objects rather than pure actions and logic. A <strong>class</strong> defines the properties (fields) and capabilities (methods) shared by instances. An <strong>object</strong> is a concrete entity created in heap memory via the <code>new</code> operator.</p><p>The <code>static</code> modifier associates a member with the class itself rather than individual instances.</p>',
            codeExample: 'public class Student {\n    private String name;\n    private int rollNo;\n    private static int totalStudents = 0;\n    \n    public Student(String name, int rollNo) {\n        this.name = name;\n        this.rollNo = rollNo;\n        totalStudents++;\n    }\n    \n    public void display() {\n        System.out.println("Student: " + name + " (Roll #" + rollNo + ")");\n    }\n    \n    public static int getTotalCount() {\n        return totalStudents;\n    }\n    \n    public static void main(String[] args) {\n        Student s1 = new Student("Alice", 101);\n        Student s2 = new Student("Bob", 102);\n        \n        s1.display();\n        s2.display();\n        System.out.println("Total enrolled: " + Student.getTotalCount());\n    }\n}',
            expectedOutput: 'Student: Alice (Roll #101)\nStudent: Bob (Roll #102)\nTotal enrolled: 2',
            commonMistakes: [
                'Attempting to access non-static instance fields directly from a static method without an object reference.',
                'Treating class definitions as instances instead of instantiating with new.',
                'Failing to initialize reference fields, leading to unexpected NullPointerException.'
            ],
            basicProblemIds: ['class-and-object-creation'],
            dsaProblemIds: []
        },
        {
            id: 'constructors-encapsulation',
            number: 14,
            levelId: 2,
            title: 'Constructors and Encapsulation',
            shortDesc: 'Constructor initialization, chaining, access modifiers, data hiding, and getters/setters.',
            category: 'OOP Principles',
            prerequisites: ['oop-basics'],
            objectives: [
                'Implement default, parameterized, and overloaded constructors.',
                'Apply constructor chaining using this() to avoid redundant initialization code.',
                'Enforce strict data hiding by declaring instance variables private.',
                'Author validation logic inside public accessor and mutator methods (getters and setters).'
            ],
            coreConcepts: '<p>Constructors guarantee that objects start their lifecycle in a validated, consistent state. If no constructor is declared, Java provides a default no-argument constructor; declaring any constructor suppresses the automatic default.</p><p><strong>Encapsulation</strong> restricts direct external access to internal state, forcing modifications to pass through controlled public methods with business rule validation.</p>',
            codeExample: 'public class BankAccount {\n    private final String accountNumber;\n    private double balance;\n    \n    public BankAccount(String accountNumber, double initialBalance) {\n        this.accountNumber = accountNumber;\n        this.balance = Math.max(0.0, initialBalance);\n    }\n    \n    public void deposit(double amount) {\n        if (amount > 0) {\n            balance += amount;\n        }\n    }\n    \n    public boolean withdraw(double amount) {\n        if (amount > 0 && amount <= balance) {\n            balance -= amount;\n            return true;\n        }\n        return false;\n    }\n    \n    public double getBalance() {\n        return balance;\n    }\n    \n    public static void main(String[] args) {\n        BankAccount acc = new BankAccount("CA-9081", 1000.0);\n        acc.deposit(250.0);\n        acc.withdraw(100.0);\n        System.out.printf("Verified Balance: $%.2f%n", acc.getBalance());\n    }\n}',
            expectedOutput: 'Verified Balance: $1150.00',
            commonMistakes: [
                'Giving fields public visibility, allowing arbitrary external modification without validation.',
                'Placing a return type on a constructor signature (e.g. public void BankAccount()), turning it into a regular method.',
                'Failing to validate inputs in setters, allowing corrupted internal states (e.g., negative balances).'
            ],
            basicProblemIds: ['constructor-demonstration', 'encapsulation-example'],
            dsaProblemIds: []
        },
        {
            id: 'inheritance-polymorphism',
            number: 15,
            levelId: 2,
            title: 'Inheritance and Polymorphism',
            shortDesc: 'Class hierarchies with extends, super, method overriding (@Override), and dynamic method dispatch.',
            category: 'OOP Principles',
            prerequisites: ['constructors-encapsulation'],
            objectives: [
                'Derive specialized child classes from common parent classes using extends.',
                'Delegate initialization to parent constructors using super().',
                'Override parent methods with @Override and execute runtime dynamic method dispatch.',
                'Code against parent abstractions rather than concrete subclasses.'
            ],
            coreConcepts: '<p>Inheritance establishes an "IS-A" relationship between a base class and a derived subclass, enabling reuse of fields and methods. Java supports single class inheritance.</p><p><strong>Polymorphism</strong> allows an object of a derived class to be treated as an instance of its parent type. The JVM determines which implementation to invoke at runtime based on the actual object type (dynamic dispatch).</p>',
            codeExample: 'class Vehicle {\n    protected String brand;\n    public Vehicle(String brand) { this.brand = brand; }\n    public void start() { System.out.println(brand + " vehicle engine started."); }\n}\n\nclass Car extends Vehicle {\n    private int doors;\n    public Car(String brand, int doors) {\n        super(brand);\n        this.doors = doors;\n    }\n    @Override\n    public void start() {\n        System.out.println(brand + " " + doors + "-door car humming smoothly.");\n    }\n}\n\npublic class InheritanceDemo {\n    public static void main(String[] args) {\n        Vehicle myRide = new Car("CodeArena", 4); // Polymorphic reference\n        myRide.start(); // Dynamic dispatch calls Car.start()\n    }\n}',
            expectedOutput: 'CodeArena 4-door car humming smoothly.',
            commonMistakes: [
                'Trying to inherit from multiple classes with extends (Java disallows multiple class inheritance).',
                'Forgetting that constructors are not inherited: subclasses must invoke super() explicitly or implicitly.',
                'Confusing method overloading (compile-time) with method overriding (runtime).'
            ],
            basicProblemIds: ['inheritance-example'],
            dsaProblemIds: []
        },
        {
            id: 'exception-handling',
            number: 16,
            levelId: 2,
            title: 'Exception Handling',
            shortDesc: 'try, catch, finally, throw, throws, checked vs unchecked exceptions, and custom exceptions.',
            category: 'Robustness & Reliability',
            prerequisites: ['oop-basics'],
            objectives: [
                'Handle runtime anomalies cleanly using try, catch, and finally blocks.',
                'Differentiate checked exceptions (compile-time enforced) from unchecked RuntimeExceptions.',
                'Author and throw custom domain-specific exceptions extending Exception or RuntimeException.',
                'Ensure critical resources are liberated reliably using try-with-resources.'
            ],
            coreConcepts: '<p>Exceptions represent exceptional conditions that disrupt regular program execution. When an error occurs, an exception object is instantiated and thrown. If unhandled, it propagates up the call stack until terminating the thread.</p><p>The <code>finally</code> block executes regardless of whether an exception was thrown or caught, making it the canonical location for cleanup tasks.</p>',
            codeExample: 'public class ExceptionDemo {\n    public static int safeDivide(int numerator, int denominator) {\n        try {\n            return numerator / denominator;\n        } catch (ArithmeticException ex) {\n            System.err.println("Warning: Division by zero caught! Defaulting to 0.");\n            return 0;\n        } finally {\n            System.out.println("safeDivide operation concluded.");\n        }\n    }\n    \n    public static void main(String[] args) {\n        int res = safeDivide(100, 0);\n        System.out.println("Result: " + res);\n    }\n}',
            expectedOutput: 'Warning: Division by zero caught! Defaulting to 0.\nsafeDivide operation concluded.\nResult: 0',
            commonMistakes: [
                'Empty catch blocks that swallow errors silently, leaving systems in indeterminable broken states.',
                'Catching generic Throwable or Exception instead of specific subclasses.',
                'Using exceptions for ordinary control flow logic rather than exceptional error conditions.'
            ],
            basicProblemIds: ['divide-by-zero-handling', 'custom-exception-age-validator', 'number-format-exception-handling'],
            dsaProblemIds: []
        },
        {
            id: 'collections-basics',
            number: 17,
            levelId: 2,
            title: 'Java Collections Framework Basics',
            shortDesc: 'Dynamic arrays (ArrayList), unique sets (HashSet), and key-value maps (HashMap).',
            category: 'Collections & Generics',
            prerequisites: ['oop-basics', 'arrays'],
            objectives: [
                'Utilize dynamic resizable arrays with java.util.ArrayList.',
                'Store unique distinct elements and test membership with java.util.HashSet.',
                'Associate keys with values for constant-time lookups using java.util.HashMap.',
                'Iterate through collections cleanly using enhanced for-each loops and Iterators.'
            ],
            coreConcepts: '<p>The Java Collections Framework standardizes data structures under the <code>Collection</code> and <code>Map</code> interfaces. <code>ArrayList</code> backs elements with an array that expands dynamically when capacity is reached.</p><p><code>HashSet</code> guarantees uniqueness of elements using hashing. <code>HashMap</code> stores key-value associations with average $O(1)$ search, insertion, and deletion complexity.</p>',
            codeExample: 'import java.util.*;\n\npublic class CollectionsDemo {\n    public static void main(String[] args) {\n        // Word frequency counter\n        String[] words = {"java", "arena", "code", "java", "arena", "java"};\n        Map<String, Integer> freq = new HashMap<>();\n        \n        for (String w : words) {\n            freq.put(w, freq.getOrDefault(w, 0) + 1);\n        }\n        \n        System.out.println("Frequency map: " + freq);\n        \n        // Remove duplicates\n        Set<String> uniqueWords = new HashSet<>(Arrays.asList(words));\n        System.out.println("Unique words: " + uniqueWords.size());\n    }\n}',
            expectedOutput: 'Frequency map: {code=1, java=3, arena=2}\nUnique words: 3',
            commonMistakes: [
                'Using primitive types as generic type arguments (e.g. ArrayList<int> instead of ArrayList<Integer>).',
                'Modifying a Collection directly while iterating over it with a for-each loop, triggering ConcurrentModificationException.',
                'Forgetting to override hashCode() when overriding equals() in custom key classes stored inside HashMaps.'
            ],
            basicProblemIds: ['arraylist-basic-operations', 'hashmap-frequency-counter', 'hashset-duplicate-remover'],
            dsaProblemIds: ['contains-duplicate', 'single-number']
        },

        // =========================================================================
        // LEVEL 3: DATA STRUCTURES & ALGORITHMS (Topics 18 - 30)
        // =========================================================================
        {
            id: 'complexity-analysis',
            number: 18,
            levelId: 3,
            title: 'Time and Space Complexity Analysis',
            shortDesc: 'Asymptotic notation, Big-O calculation, best/worst/average cases, and auxiliary memory tradeoffs.',
            category: 'Complexity Foundations',
            prerequisites: ['loops', 'recursion', 'arrays'],
            objectives: [
                'Compute worst-case Big-O runtime of nested loops, sequential steps, and recursive branches.',
                'Distinguish between auxiliary memory usage and overall space complexity.',
                'Identify performance thresholds: O(1), O(log n), O(n), O(n log n), O(n^2), and O(2^n).',
                'Anticipate code execution runtime against 10^8 operations per second CPU execution limits.'
            ],
            coreConcepts: '<p>Asymptotic complexity characterizes algorithmic efficiency as input size $n$ scales towards infinity. <strong>Time complexity</strong> counts fundamental CPU instructions, while <strong>Space complexity</strong> measures total memory required.</p><p>In competitive coding, modern online judges process roughly $10^8$ operations per second. Algorithms with $O(n^2)$ complexity will time out when $n > 10^4$, necessitating $O(n \\log n)$ or $O(n)$ strategies.</p>',
            codeExample: 'public class ComplexityDemo {\n    // O(n) Time | O(1) Auxiliary Space\n    public static int linearScan(int[] arr, int target) {\n        for (int i = 0; i < arr.length; i++) {\n            if (arr[i] == target) return i;\n        }\n        return -1;\n    }\n    \n    // O(log n) Time | O(1) Auxiliary Space\n    public static int binarySearch(int[] arr, int target) {\n        int low = 0, high = arr.length - 1;\n        while (low <= high) {\n            int mid = low + (high - low) / 2;\n            if (arr[mid] == target) return mid;\n            else if (arr[mid] < target) low = mid + 1;\n            else high = mid - 1;\n        }\n        return -1;\n    }\n    \n    public static void main(String[] args) {\n        int[] sorted = {10, 20, 30, 40, 50};\n        System.out.println("Index of 40: " + binarySearch(sorted, 40));\n    }\n}',
            expectedOutput: 'Index of 40: 3',
            commonMistakes: [
                'Assuming fewer lines of code translates to lower time complexity.',
                'Ignoring implicit costs of built-in methods (e.g., String.substring() or contains() inside loops).',
                'Neglecting recursion call stack memory when computing space complexity.'
            ],
            basicProblemIds: [],
            dsaProblemIds: ['merge-sorted-array', 'sort-colors']
        },
        {
            id: 'arrays-hashing',
            number: 19,
            levelId: 3,
            title: 'Arrays and Hashing Patterns',
            shortDesc: 'Constant-time lookups, complement matching, frequency tables, and running prefix sums.',
            category: 'Hash Tables & Prefix Logic',
            prerequisites: ['complexity-analysis', 'collections-basics'],
            objectives: [
                'Replace quadratic O(n^2) nested lookups with O(n) single-pass hash lookups.',
                'Apply complement arithmetic (target - current) for pair matching problems.',
                'Construct prefix sum arrays for O(1) range sum queries.',
                'Map anagram groupings using canonical sorted keys or frequency signatures.'
            ],
            coreConcepts: '<p>The combination of arrays and hashing is the foundation of high-performance coding. By using a hash table as an associative memory cache, an algorithm records visited elements and tests for the existence of required complements in $O(1)$ amortized time.</p><p>Prefix sum arrays compute cumulative totals where any subarray sum between $L$ and $R$ evaluates instantly via $\\text{prefix}[R] - \\text{prefix}[L - 1]$.</p>',
            codeExample: 'import java.util.*;\n\npublic class TwoSumPattern {\n    // O(n) Time | O(n) Space\n    public static int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) {\n                return new int[]{map.get(complement), i};\n            }\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n    \n    public static void main(String[] args) {\n        int[] indices = twoSum(new int[]{2, 7, 11, 15}, 9);\n        System.out.println("Pair indices: " + Arrays.toString(indices));\n    }\n}',
            expectedOutput: 'Pair indices: [0, 1]',
            commonMistakes: [
                'Adding an element to the hash map before checking for its complement, which allows matching an element with itself.',
                'Recomputing prefix sums from scratch on every query instead of precomputing once.',
                'Overlooking hash collisions when designing custom hash codes.'
            ],
            basicProblemIds: [],
            dsaProblemIds: ['two-sum', 'contains-duplicate', 'ransom-note', 'group-anagrams', 'range-sum-query-immutable']
        },
        {
            id: 'two-pointers',
            number: 20,
            levelId: 3,
            title: 'Two Pointers Technique',
            shortDesc: 'Converging pointers, opposite ends, sorted pair searching, and in-place array manipulation.',
            category: 'Pointers & Sorting',
            prerequisites: ['complexity-analysis', 'arrays', 'strings'],
            objectives: [
                'Coordinate two index pointers converging from opposite ends of a sorted array.',
                'Solve target sum and boundary conditions in O(n) time with O(1) auxiliary space.',
                'Implement palindrome verification with non-alphanumeric character filtering.',
                'Calculate trapped water boundaries using bidirectional boundary maximization.'
            ],
            coreConcepts: '<p>The Two Pointers pattern utilizes two coordinate indices that traverse a sequential structure simultaneously. By examining conditions at both boundaries, the algorithm makes deterministic choices to advance one pointer, pruning half the remaining search space without allocating extra memory.</p><p>This technique turns $O(n^2)$ pair searches on sorted arrays into linear $O(n)$ time with $O(1)$ auxiliary space.</p>',
            codeExample: 'public class TwoPointersDemo {\n    // Maximize water container area: O(n) Time | O(1) Space\n    public static int maxArea(int[] height) {\n        int left = 0, right = height.length - 1;\n        int maxWater = 0;\n        \n        while (left < right) {\n            int width = right - left;\n            int h = Math.min(height[left], height[right]);\n            maxWater = Math.max(maxWater, width * h);\n            \n            if (height[left] < height[right]) {\n                left++;\n            } else {\n                right--;\n            }\n        }\n        return maxWater;\n    }\n    \n    public static void main(String[] args) {\n        int[] heights = {1, 8, 6, 2, 5, 4, 8, 3, 7};\n        System.out.println("Max Water Area: " + maxArea(heights));\n    }\n}',
            expectedOutput: 'Max Water Area: 49',
            commonMistakes: [
                'Applying two-pointer convergence to an unsorted array where monotonic order is required.',
                'Pointer collision index overflows when skipping non-alphanumeric characters in while loops.',
                'Moving both pointers simultaneously when only one boundary should advance.'
            ],
            basicProblemIds: [],
            dsaProblemIds: ['container-with-most-water', 'valid-palindrome', 'two-sum-ii-input-array-is-sorted', 'trapping-rain-water']
        },
        {
            id: 'sliding-window',
            number: 21,
            levelId: 3,
            title: 'Sliding Window',
            shortDesc: 'Fixed and dynamically resizable contiguous subarrays with incremental state maintenance.',
            category: 'Subarray Windows',
            prerequisites: ['two-pointers', 'arrays-hashing'],
            objectives: [
                'Maintain running aggregate state across contiguous subarray windows without recalculating from scratch.',
                'Apply fixed-size sliding windows for maximum/minimum average subarray calculations.',
                'Construct dynamic variable-size windows using right-expansion and left-contraction loops.',
                'Achieve linear O(n) time for substring search and minimum window constraints.'
            ],
            coreConcepts: '<p>The Sliding Window pattern observes a contiguous segment of an array or string that shifts over the data. Rather than recalculating window properties from scratch (an $O(n \\times k)$ operation), the window adjusts state by subtracting the element that exits on the left and adding the element that enters on the right, achieving amortized $O(1)$ updates per step.</p>',
            codeExample: 'public class SlidingWindowDemo {\n    // Maximum sum of subarray of fixed size k: O(n) Time | O(1) Space\n    public static int maxSubarraySum(int[] nums, int k) {\n        int currentSum = 0;\n        for (int i = 0; i < k; i++) {\n            currentSum += nums[i];\n        }\n        int maxSum = currentSum;\n        \n        for (int i = k; i < nums.length; i++) {\n            currentSum += nums[i] - nums[i - k]; // Slide window\n            maxSum = Math.max(maxSum, currentSum);\n        }\n        return maxSum;\n    }\n    \n    public static void main(String[] args) {\n        int[] arr = {2, 1, 5, 1, 3, 2};\n        System.out.println("Max window sum (k=3): " + maxSubarraySum(arr, 3));\n    }\n}',
            expectedOutput: 'Max window sum (k=3): 9',
            commonMistakes: [
                'Forgetting to decrement frequency counts when shrinking the left window boundary.',
                'Recalculating the entire window sum/map on every step instead of updating incrementally.',
                'Misidentifying when a window condition is satisfied vs when it becomes invalid.'
            ],
            basicProblemIds: [],
            dsaProblemIds: ['maximum-average-subarray', 'minimum-size-subarray-sum', 'longest-substring', 'permutation-in-string', 'minimum-window-substring']
        },
        {
            id: 'linked-lists',
            number: 22,
            levelId: 3,
            title: 'Linked Lists',
            shortDesc: 'Singly and doubly linked lists, pointer manipulation, dummy head sentinels, reversal, and cycle finding.',
            category: 'Node Data Structures',
            prerequisites: ['complexity-analysis', 'oop-basics'],
            objectives: [
                'Safely manipulate dynamic node references without losing connections or causing memory leaks.',
                'Employ dummy head sentinel nodes to eliminate special cases for head insertions and deletions.',
                'Reverse singly linked lists iteratively in O(n) time with O(1) auxiliary space.',
                'Detect cycles and locate loop entrypoints using Floyd\'s Fast and Slow Pointer algorithm.'
            ],
            coreConcepts: '<p>A Linked List is a linear collection of data elements called nodes, where each node points to the next node via a reference pointer. Unlike arrays, linked lists do not require contiguous memory, permitting $O(1)$ insertions and deletions once a node position is identified.</p><p>Dummy head nodes simplify list manipulation by ensuring that every node, including the real head, has a non-null predecessor.</p>',
            codeExample: 'class ListNode {\n    int val;\n    ListNode next;\n    ListNode(int val) { this.val = val; }\n}\n\npublic class LinkedListDemo {\n    // In-place iterative reversal: O(n) Time | O(1) Space\n    public static ListNode reverseList(ListNode head) {\n        ListNode prev = null;\n        ListNode curr = head;\n        while (curr != null) {\n            ListNode nextTemp = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = nextTemp;\n        }\n        return prev;\n    }\n    \n    public static void main(String[] args) {\n        ListNode n1 = new ListNode(1);\n        n1.next = new ListNode(2);\n        n1.next.next = new ListNode(3);\n        \n        ListNode rev = reverseList(n1);\n        System.out.print("Reversed list: ");\n        while (rev != null) {\n            System.out.print(rev.val + (rev.next != null ? " -> " : "\\n"));\n            rev = rev.next;\n        }\n    }\n}',
            expectedOutput: 'Reversed list: 3 -> 2 -> 1',
            commonMistakes: [
                'Overwriting curr.next before caching its original reference in a temporary variable, severing the remaining list.',
                'Dereferencing null pointer (e.g., fast.next.next when fast.next is already null).',
                'Failing to set the old head\'s next pointer to null, creating unintended cycles.'
            ],
            basicProblemIds: [],
            dsaProblemIds: ['reverse-linked-list', 'linked-list-cycle', 'merge-two-sorted-lists', 'remove-nth-node-from-end', 'copy-list-with-random-pointer']
        },
        {
            id: 'stacks-queues',
            number: 23,
            levelId: 3,
            title: 'Stacks and Queues',
            shortDesc: 'LIFO and FIFO mechanics, balanced parentheses, monotonic stacks, and queue simulations.',
            category: 'Linear Abstract Data Types',
            prerequisites: ['complexity-analysis', 'arrays'],
            objectives: [
                'Enforce Last-In First-Out (LIFO) and First-In First-Out (FIFO) semantics strictly.',
                'Validate nested matched parentheses and expression grammars.',
                'Construct monotonic increasing/decreasing stacks to solve Next Greater Element in linear O(n) time.',
                'Simulate queues using two stacks and optimize amortized push/pop costs.'
            ],
            coreConcepts: '<p>A <strong>Stack</strong> enforces Last-In First-Out (LIFO) operations (<code>push</code>, <code>pop</code>, <code>peek</code> in $O(1)$ time). It is the canonical data structure for backtracking, nested scopes, and parenthesis parsing.</p><p>A <strong>Monotonic Stack</strong> maintains its elements in strictly increasing or decreasing order. By popping elements that violate monotonicity, it finds the next greater or smaller element for every position in an array in overall $O(n)$ time.</p>',
            codeExample: 'import java.util.*;\n\npublic class StackDemo {\n    // Valid parentheses check: O(n) Time | O(n) Space\n    public static boolean isValid(String s) {\n        Deque<Character> stack = new ArrayDeque<>();\n        for (char c : s.toCharArray()) {\n            if (c == \'(\') stack.push(\')\');\n            else if (c == \'{\') stack.push(\'}\');\n            else if (c == \'[\') stack.push(\']\');\n            else if (stack.isEmpty() || stack.pop() != c) return false;\n        }\n        return stack.isEmpty();\n    }\n    \n    public static void main(String[] args) {\n        System.out.println("()[]{} is valid: " + isValid("()[]{}"));\n        System.out.println("([)] is valid: " + isValid("([)]"));\n    }\n}',
            expectedOutput: '()[]{} is valid: true\n([)] is valid: false',
            commonMistakes: [
                'Using legacy java.util.Stack (which synchronizes every method overhead) instead of modern ArrayDeque.',
                'Calling pop() or peek() on an empty stack without checking isEmpty() first.',
                'Failing to verify that the stack is completely empty at the end of expression evaluation.'
            ],
            basicProblemIds: [],
            dsaProblemIds: ['valid-parentheses', 'daily-temperatures', 'next-greater-element-i', 'largest-rectangle-in-histogram', 'implement-queue-using-stacks']
        },
        {
            id: 'binary-search',
            number: 24,
            levelId: 3,
            title: 'Binary Search',
            shortDesc: 'Divide and conquer on sorted ranges, boundary detection, rotated arrays, and binary search on answer spaces.',
            category: 'Search Algorithms',
            prerequisites: ['complexity-analysis', 'arrays'],
            objectives: [
                'Halve search spaces reliably in logarithmic O(log n) time.',
                'Prevent integer arithmetic overflow using mid = low + (high - low) / 2.',
                'Pinpoint lower and upper bounds (first/last occurrences of duplicated elements).',
                'Apply binary search across monotonic answer spaces (e.g. rate or capacity thresholds).'
            ],
            coreConcepts: '<p>Binary search eliminates half the remaining candidate elements on every comparison by checking the midpoint of a monotonic sequence. Beyond searching sorted arrays, binary search applies to any monotonic predicate function $P(x)$ where outputs transition definitively from <code>false</code> to <code>true</code>.</p><p>This enables binary searching directly on the answer space (e.g., minimum shipping capacity or minimum eating speed).</p>',
            codeExample: 'public class BinarySearchDemo {\n    // Search Insert Position: O(log n) Time | O(1) Space\n    public static int searchInsert(int[] nums, int target) {\n        int low = 0, high = nums.length - 1;\n        while (low <= high) {\n            int mid = low + (high - low) / 2;\n            if (nums[mid] == target) return mid;\n            else if (nums[mid] < target) low = mid + 1;\n            else high = mid - 1;\n        }\n        return low; // Target insertion point\n    }\n    \n    public static void main(String[] args) {\n        int[] arr = {1, 3, 5, 6};\n        System.out.println("Insert 5 at: " + searchInsert(arr, 5));\n        System.out.println("Insert 2 at: " + searchInsert(arr, 2));\n    }\n}',
            expectedOutput: 'Insert 5 at: 2\nInsert 2 at: 1',
            commonMistakes: [
                'Using (low + high) / 2, which overflows 32-bit signed integers when low + high > 2^31 - 1.',
                'Incorrect loop conditions (while (low < high) vs while (low <= high)) resulting in infinite loops or skipped elements.',
                'Setting low = mid instead of low = mid + 1, causing infinite loops when low and high differ by 1.'
            ],
            basicProblemIds: [],
            dsaProblemIds: ['binary-search', 'search-insert-position', 'find-first-and-last-position', 'search-in-rotated-sorted-array', 'koko-eating-bananas']
        },
        {
            id: 'trees-bst',
            number: 25,
            levelId: 3,
            title: 'Trees and Binary Search Trees',
            shortDesc: 'Hierarchical node models, DFS traversals, BFS level-order scans, BST invariants, and LCA.',
            category: 'Hierarchical Structures',
            prerequisites: ['recursion', 'stacks-queues'],
            objectives: [
                'Implement recursive DFS traversals: pre-order, in-order, and post-order.',
                'Execute breadth-first search (BFS) level-order scans using Queue data structures.',
                'Validate and preserve Binary Search Tree (BST) ordering invariants: left < node < right.',
                'Compute tree height, diameter, balance status, and Lowest Common Ancestors.'
            ],
            coreConcepts: '<p>A Binary Tree is a hierarchical structure where each node has at most two children. In-order traversal of a valid Binary Search Tree (BST) produces nodes in strictly non-decreasing sorted order.</p><p>Depth-First Search (DFS) traverses paths down to leaf nodes using the recursion call stack, whereas Breadth-First Search (BFS) processes nodes level-by-level using a FIFO queue.</p>',
            codeExample: 'class TreeNode {\n    int val;\n    TreeNode left, right;\n    TreeNode(int val) { this.val = val; }\n}\n\npublic class TreeDemo {\n    // Invert Binary Tree: O(n) Time | O(h) Space\n    public static TreeNode invertTree(TreeNode root) {\n        if (root == null) return null;\n        TreeNode temp = root.left;\n        root.left = invertTree(root.right);\n        root.right = invertTree(temp);\n        return root;\n    }\n    \n    public static void printInOrder(TreeNode root) {\n        if (root == null) return;\n        printInOrder(root.left);\n        System.out.print(root.val + " ");\n        printInOrder(root.right);\n    }\n    \n    public static void main(String[] args) {\n        TreeNode root = new TreeNode(4);\n        root.left = new TreeNode(2);\n        root.right = new TreeNode(7);\n        \n        System.out.print("In-order before invert: ");\n        printInOrder(root);\n        System.out.println();\n        \n        invertTree(root);\n        System.out.print("In-order after invert: ");\n        printInOrder(root);\n        System.out.println();\n    }\n}',
            expectedOutput: 'In-order before invert: 2 4 7 \nIn-order after invert: 7 4 2 ',
            commonMistakes: [
                'Checking only immediate children when validating BST invariants instead of maintaining min/max bounds across whole subtrees.',
                'Dereferencing child pointers on null nodes without a base case check.',
                'Forgetting that tree recursion space complexity is O(h), which becomes O(n) in degenerate skewed trees.'
            ],
            basicProblemIds: [],
            dsaProblemIds: ['invert-binary-tree', 'binary-tree-inorder-traversal', 'validate-binary-search-tree', 'binary-tree-level-order-traversal', 'maximum-depth-of-binary-tree']
        },
        {
            id: 'heaps-priority-queues',
            number: 26,
            levelId: 3,
            title: 'Heaps and Priority Queues',
            shortDesc: 'Complete binary trees, min/max heap properties, PriorityQueue API, Top-K elements, and stream medians.',
            category: 'Priority Structures',
            prerequisites: ['trees-bst', 'complexity-analysis'],
            objectives: [
                'Understand binary heap representation in contiguous arrays (parent at i/2, children at 2i and 2i+1).',
                'Instantiate Java PriorityQueue with natural ordering (min-heap) and custom Comparators (max-heap).',
                'Solve Top-K frequent/largest element problems in O(n log k) time using bounded size heaps.',
                'Balance two heaps simultaneously to compute running medians from dynamic input streams.'
            ],
            coreConcepts: '<p>A <strong>Binary Heap</strong> is a complete binary tree that satisfies the heap property: in a min-heap, every parent is less than or equal to its children, placing the global minimum at the root in $O(1)$ access time.</p><p>Insertion and removal take $O(\\log n)$ time via bubble-up and bubble-down rebalancing. In Java, <code>java.util.PriorityQueue</code> implements an unbounded priority heap.</p>',
            codeExample: 'import java.util.*;\n\npublic class HeapDemo {\n    // Kth largest element using bounded min-heap: O(n log k) Time | O(k) Space\n    public static int findKthLargest(int[] nums, int k) {\n        PriorityQueue<Integer> minHeap = new PriorityQueue<>(k);\n        for (int num : nums) {\n            minHeap.offer(num);\n            if (minHeap.size() > k) {\n                minHeap.poll(); // Evict smallest element\n            }\n        }\n        return minHeap.peek();\n    }\n    \n    public static void main(String[] args) {\n        int[] arr = {3, 2, 1, 5, 6, 4};\n        System.out.println("2nd largest element: " + findKthLargest(arr, 2));\n    }\n}',
            expectedOutput: '2nd largest element: 5',
            commonMistakes: [
                'Using a max-heap of size n to find the K-th largest element, which takes O(n log n) instead of optimal O(n log k) with a min-heap of size k.',
                'Modifying objects while they reside inside a PriorityQueue without re-inserting, breaking the heap invariant.',
                'Assuming PriorityQueue iteration order is sorted (only peek() and poll() guarantee heap order).'
            ],
            basicProblemIds: [],
            dsaProblemIds: ['kth-largest-element-in-array', 'top-k-frequent-words', 'find-median-from-data-stream', 'merge-k-sorted-lists']
        },
        {
            id: 'graphs',
            number: 27,
            levelId: 3,
            title: 'Graphs and Traversals',
            shortDesc: 'Adjacency lists, BFS shortest paths, DFS connectivity, island flood-fills, and cycle detection.',
            category: 'Graph Algorithms',
            prerequisites: ['stacks-queues', 'trees-bst', 'collections-basics'],
            objectives: [
                'Represent directed and undirected graphs using Adjacency Lists and 2D Grids.',
                'Implement BFS with a visited set to find shortest paths in unweighted graphs.',
                'Apply DFS flood-fill algorithms to identify and count connected components (island sinking).',
                'Detect cycles in directed and undirected graphs, and compute topological sorts.'
            ],
            coreConcepts: '<p>A <strong>Graph</strong> is a set of vertices (nodes) interconnected by edges. Many grid problems are implicit graphs where every cell $(r, c)$ connects to its 4 orthogonal neighbours.</p><p>Breadth-First Search (BFS) explores vertices layer by layer and is optimal for shortest paths in unweighted networks. Depth-First Search (DFS) explores paths deeply and is optimal for connectivity, flood-fills, and cycle detection.</p>',
            codeExample: 'public class GraphDemo {\n    // DFS Flood-Fill: Sink Island\n    public static void dfsSink(char[][] grid, int r, int c) {\n        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != \'1\') {\n            return;\n        }\n        grid[r][c] = \'0\'; // Mark visited (sink)\n        dfsSink(grid, r + 1, c);\n        dfsSink(grid, r - 1, c);\n        dfsSink(grid, r, c + 1);\n        dfsSink(grid, r, c - 1);\n    }\n    \n    public static int numIslands(char[][] grid) {\n        if (grid == null || grid.length == 0) return 0;\n        int count = 0;\n        for (int r = 0; r < grid.length; r++) {\n            for (int c = 0; c < grid[0].length; c++) {\n                if (grid[r][c] == \'1\') {\n                    count++;\n                    dfsSink(grid, r, c);\n                }\n            }\n        }\n        return count;\n    }\n    \n    public static void main(String[] args) {\n        char[][] map = {\n            {\'1\', \'1\', \'0\'},\n            {\'1\', \'0\', \'0\'},\n            {\'0\', \'0\', \'1\'}\n        };\n        System.out.println("Total Islands: " + numIslands(map));\n    }\n}',
            expectedOutput: 'Total Islands: 2',
            commonMistakes: [
                'Omitting a visited set or in-place mark, resulting in infinite recursive ping-pong between adjacent nodes.',
                'Adding a node to a BFS queue without marking it visited immediately, leading to duplicate queue insertions.',
                'Stale visited cache state across multiple invocations (as audited in Clone Graph DFS).'
            ],
            basicProblemIds: [],
            dsaProblemIds: ['number-of-islands', 'rotting-oranges', 'clone-graph', 'course-schedule', 'network-delay-time']
        },
        {
            id: 'backtracking',
            number: 28,
            levelId: 3,
            title: 'Backtracking',
            shortDesc: 'Decision state-space trees, choice-constraint-goal paradigm, pruning, subsets, and permutations.',
            category: 'Exhaustive Search',
            prerequisites: ['recursion'],
            objectives: [
                'Systematically traverse state-space decision trees using the choose-explore-unchoose pattern.',
                'Prune unviable branches early by asserting constraints before recursive calls.',
                'Generate power sets (subsets), permutations, and combinations of collections.',
                'Solve constraint satisfaction problems such as N-Queens and Word Search.'
            ],
            coreConcepts: '<p>Backtracking is an algorithmic approach for solving constraint satisfaction problems by incrementally building candidates toward solutions, abandoning ("backtracking" from) a candidate as soon as it is determined that it cannot possibly lead to a valid configuration.</p><p>The canonical template requires three phases: make a choice, explore recursively, and revert the choice (backtrack) to restore state.</p>',
            codeExample: 'import java.util.*;\n\npublic class BacktrackingDemo {\n    // Generate all subsets: O(2^n) Time | O(n) Recursion Depth\n    public static void generateSubsets(int[] nums, int index, List<Integer> current, List<List<Integer>> result) {\n        result.add(new ArrayList<>(current));\n        for (int i = index; i < nums.length; i++) {\n            current.add(nums[i]); // Choose\n            generateSubsets(nums, i + 1, current, result); // Explore\n            current.remove(current.size() - 1); // Unchoose (backtrack)\n        }\n    }\n    \n    public static void main(String[] args) {\n        List<List<Integer>> subsets = new ArrayList<>();\n        generateSubsets(new int[]{1, 2}, 0, new ArrayList<>(), subsets);\n        System.out.println("Subsets of [1, 2]: " + subsets);\n    }\n}',
            expectedOutput: 'Subsets of [1, 2]: [[], [1], [1, 2], [2]]',
            commonMistakes: [
                'Adding the mutable current list directly to the result list instead of adding a snapshot copy: new ArrayList<>(current).',
                'Forgetting to undo the choice at the end of the loop, corrupting subsequent decision paths.',
                'Missing branch pruning constraints, leading to combinatorial explosion and Time Limit Exceeded (TLE).'
            ],
            basicProblemIds: [],
            dsaProblemIds: ['subsets', 'permutations', 'combination-sum', 'n-queens', 'word-search']
        },
        {
            id: 'dynamic-programming',
            number: 29,
            levelId: 3,
            title: 'Dynamic Programming',
            shortDesc: 'Overlapping subproblems, optimal substructure, memoization, tabulation, 1D/2D DP, and knapsacks.',
            category: 'Optimal Substructure',
            prerequisites: ['recursion', 'arrays'],
            objectives: [
                'Recognize problems with overlapping subproblems and optimal substructure properties.',
                'Convert exponential recursive algorithms into polynomial time via Top-Down Memoization.',
                'Formulate iterative Bottom-Up Tabulation state transitions dp[i].',
                'Optimize space complexity from O(n) to O(1) by maintaining rolling state variables.'
            ],
            coreConcepts: '<p>Dynamic Programming (DP) solves complex optimization problems by breaking them into simpler overlapping subproblems and caching their results to avoid redundant work.</p><p>Top-Down DP augments recursion with a lookup memo table. Bottom-Up DP iteratively computes states starting from base cases, evaluating transitions systematically to populate the solution table.</p>',
            codeExample: 'public class DPDemo {\n    // Climbing Stairs: dp[i] = dp[i-1] + dp[i-2] with O(1) Space\n    public static int climbStairs(int n) {\n        if (n <= 2) return n;\n        int prev2 = 1, prev1 = 2;\n        for (int i = 3; i <= n; i++) {\n            int current = prev1 + prev2;\n            prev2 = prev1;\n            prev1 = current;\n        }\n        return prev1;\n    }\n    \n    public static void main(String[] args) {\n        System.out.println("Ways to climb 5 stairs: " + climbStairs(5));\n    }\n}',
            expectedOutput: 'Ways to climb 5 stairs: 8',
            commonMistakes: [
                'Failing to establish clear mathematical state definitions before writing code.',
                'Incorrect initialization of base cases (e.g. dp[0] or dp[1] set to incorrect values).',
                'Allocating full 2D tables when state transitions only depend on the previous row or column.'
            ],
            basicProblemIds: [],
            dsaProblemIds: ['climbing-stairs', 'house-robber', 'unique-paths', 'coin-change', 'longest-increasing-subsequence']
        },
        {
            id: 'greedy-algorithms',
            number: 30,
            levelId: 3,
            title: 'Greedy Algorithms',
            shortDesc: 'Locally optimal choices, greedy choice property, interval scheduling, and sorting-based strategies.',
            category: 'Heuristic Optimization',
            prerequisites: ['complexity-analysis', 'arrays'],
            objectives: [
                'Evaluate whether locally optimal choices guarantee a globally optimal solution.',
                'Sort intervals by end times to solve Activity Selection and Non-Overlapping intervals.',
                'Analyze greedy exchange arguments to mathematically prove algorithm correctness.',
                'Solve greedy resource allocation and capacity-constrained tasks.'
            ],
            coreConcepts: '<p>A <strong>Greedy Algorithm</strong> builds up a solution piece by piece, always choosing the next piece that offers the most immediate benefit (locally optimal) without reconsidering previous choices. It differs from Dynamic Programming because it commits to decisions permanently without backtracking.</p><p>Greedy strategies are only valid when the problem exhibits the <strong>greedy-choice property</strong> and <strong>optimal substructure</strong>.</p>',
            codeExample: 'import java.util.*;\n\npublic class GreedyDemo {\n    // Non-overlapping intervals: Maximize retained intervals\n    public static int eraseOverlapIntervals(int[][] intervals) {\n        if (intervals.length == 0) return 0;\n        // Sort by end time\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));\n        \n        int removals = 0;\n        int end = intervals[0][1];\n        for (int i = 1; i < intervals.length; i++) {\n            if (intervals[i][0] < end) {\n                removals++; // Overlap detected; remove current interval\n            } else {\n                end = intervals[i][1]; // Advance boundary\n            }\n        }\n        return removals;\n    }\n    \n    public static void main(String[] args) {\n        int[][] intervals = {{1, 2}, {2, 3}, {3, 4}, {1, 3}};\n        System.out.println("Minimum intervals to erase: " + eraseOverlapIntervals(intervals));\n    }\n}',
            expectedOutput: 'Minimum intervals to erase: 1',
            commonMistakes: [
                'Applying a greedy heuristic without verifying whether it yields a globally optimal solution (e.g. standard 0/1 knapsack is not greedy).',
                'Sorting intervals by start time instead of end time for activity selection.',
                'Ignoring edge cases where intervals share identical endpoints.'
            ],
            basicProblemIds: [],
            dsaProblemIds: ['assign-cookies', 'non-overlapping-intervals', 'jump-game', 'gas-station', 'task-scheduler']
        }
    ];

    return {
        getLevels: function () {
            return LEVELS;
        },
        getTopics: function () {
            return TOPICS;
        },
        getTopicById: function (id) {
            return TOPICS.find(function (t) { return t.id === id; }) || null;
        },
        getTopicsByLevel: function (levelId) {
            return TOPICS.filter(function (t) { return t.levelId === levelId; });
        },
        getPrerequisitesForTopic: function (topicId) {
            const topic = this.getTopicById(topicId);
            if (!topic || !topic.prerequisites) return [];
            return topic.prerequisites.map(function (prereqId) {
                return TOPICS.find(function (t) { return t.id === prereqId; }) || { id: prereqId, title: prereqId };
            });
        }
    };
}));

