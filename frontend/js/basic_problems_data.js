/**
 * CodeArena — Canonical Basic Java Problems Dataset
 * Dedicated beginner Java programming challenges categorized across 13 core topics.
 * Kept strictly isolated from the 200 DSA algorithm dataset.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.CodeArenaBasicData = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const BASIC_CATEGORIES = [
        {
            id: 'fundamentals',
            name: 'Java Fundamentals',
            icon: 'terminal',
            description: 'Core syntax, variables, data types, standard output, and basic program structure.',
            accentColor: '#3B82F6'
        },
        {
            id: 'io',
            name: 'Input and Output',
            icon: 'keyboard',
            description: 'Reading inputs with java.util.Scanner, buffered streams, and formatted printing.',
            accentColor: '#06B6D4'
        },
        {
            id: 'operators',
            name: 'Operators',
            icon: 'calculator',
            description: 'Arithmetic, relational, logical, bitwise, assignment, and ternary operators.',
            accentColor: '#8B5CF6'
        },
        {
            id: 'conditionals',
            name: 'Conditional Statements',
            icon: 'git-branch',
            description: 'Decision making with if-else ladders, nested conditions, and switch expressions.',
            accentColor: '#EC4899'
        },
        {
            id: 'loops',
            name: 'Loops',
            icon: 'repeat',
            description: 'Repetition constructs: for, while, do-while, nested loops, break, and continue.',
            accentColor: '#F59E0B'
        },
        {
            id: 'numbers',
            name: 'Number Problems',
            icon: 'hash',
            description: 'Primes, Fibonacci, palindromes, factorials, digit extraction, and mathematical logic.',
            accentColor: '#10B981'
        },
        {
            id: 'patterns',
            name: 'Pattern Programming',
            icon: 'grid',
            description: 'Nested loop geometry: stars, triangles, pyramids, numbers, and Floyd patterns.',
            accentColor: '#6366F1'
        },
        {
            id: 'arrays',
            name: 'Arrays',
            icon: 'layers',
            description: 'Fixed-size arrays, linear search, traversal, sorting, min/max, and in-place reversal.',
            accentColor: '#3B82F6'
        },
        {
            id: 'strings',
            name: 'Strings',
            icon: 'type',
            description: 'Immutable strings, StringBuilder, character inspection, substrings, and palindromes.',
            accentColor: '#14B8A6'
        },
        {
            id: 'methods-recursion',
            name: 'Methods and Recursion',
            icon: 'workflow',
            description: 'Function parameters, return types, method overloading, base cases, and call stacks.',
            accentColor: '#8B5CF6'
        },
        {
            id: 'oop',
            name: 'Object-Oriented Programming',
            icon: 'boxes',
            description: 'Classes, objects, constructors, encapsulation, inheritance, and method overriding.',
            accentColor: '#F97316'
        },
        {
            id: 'exceptions',
            name: 'Exception Handling',
            icon: 'shield-alert',
            description: 'Try-catch blocks, throw, throws, finally, built-in and custom checked exceptions.',
            accentColor: '#EF4444'
        },
        {
            id: 'collections',
            name: 'Collections Basics',
            icon: 'database',
            description: 'Dynamic collections: ArrayList, HashSet, HashMap, and Queue fundamentals.',
            accentColor: '#0EA5E9'
        }
    ];

    const BASIC_PROBLEMS = [
        // =========================================================================
        // 1. Java Fundamentals
        // =========================================================================
        {
            id: 'hello-world',
            number: 1,
            title: 'Hello World',
            category: 'Java Fundamentals',
            difficulty: 'Easy',
            description: 'Write a Java program that outputs the canonical greeting <code>Hello, World!</code> to standard output.',
            inputFormat: 'No input provided.',
            outputFormat: 'Print <code>Hello, World!</code> followed by a newline.',
            constraints: 'None.',
            sampleInput: '',
            sampleOutput: 'Hello, World!',
            explanation: 'In Java, standard console output is accomplished using System.out.println().',
            relatedConcepts: ['System.out.println', 'Main Method', 'Class Structure'],
            starterCode: 'public class Main {\n    public static void main(String[] args) {\n        // Print Hello, World! below\n        \n    }\n}',
            previewTestCases: [
                { input: '', expectedOutput: 'Hello, World!' }
            ]
        },
        {
            id: 'swap-two-numbers',
            number: 2,
            title: 'Swap Two Numbers',
            category: 'Java Fundamentals',
            difficulty: 'Easy',
            description: 'Given two integers <code>a</code> and <code>b</code> from standard input, swap their values and print the swapped pair separated by a space.',
            inputFormat: 'Two space-separated integers a and b.',
            outputFormat: 'Print swapped integers <code>b a</code> separated by a space.',
            constraints: '-10^4 <= a, b <= 10^4',
            sampleInput: '10 20',
            sampleOutput: '20 10',
            explanation: 'A temporary variable holds value a while b is assigned to a, then the temporary value is assigned to b.',
            relatedConcepts: ['Variable Assignment', 'Temporary Variables', 'Scanner'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        \n        // Swap a and b here\n        \n        System.out.println(a + " " + b);\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '10 20', expectedOutput: '20 10' },
                { input: '-5 42', expectedOutput: '42 -5' },
                { input: '0 0', expectedOutput: '0 0' }
            ]
        },
        {
            id: 'celsius-to-fahrenheit',
            number: 3,
            title: 'Celsius to Fahrenheit',
            category: 'Java Fundamentals',
            difficulty: 'Easy',
            description: 'Convert a given temperature in Celsius <code>C</code> to Fahrenheit using the formula <code>F = (C * 9/5) + 32</code>. Print the result rounded to 2 decimal places.',
            inputFormat: 'A double representing Celsius temperature.',
            outputFormat: 'A double formatted to 2 decimal places.',
            constraints: '-273.15 <= C <= 1000.0',
            sampleInput: '25.0',
            sampleOutput: '77.00',
            explanation: '(25.0 * 9 / 5) + 32 = 45.0 + 32 = 77.00',
            relatedConcepts: ['Floating Point Arithmetic', 'System.out.printf', 'Type Casting'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        double c = sc.nextDouble();\n        \n        // Compute Fahrenheit here\n        \n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '25.0', expectedOutput: '77.00' },
                { input: '0.0', expectedOutput: '32.00' },
                { input: '100.0', expectedOutput: '212.00' }
            ]
        },
        {
            id: 'simple-interest-calculator',
            number: 4,
            title: 'Simple Interest Calculator',
            category: 'Java Fundamentals',
            difficulty: 'Easy',
            description: 'Compute the Simple Interest given Principal <code>P</code>, Rate <code>R</code> (in %), and Time <code>T</code> (in years). Formula: <code>SI = (P * R * T) / 100</code>.',
            inputFormat: 'Three space-separated numbers: P (double), R (double), and T (double).',
            outputFormat: 'Print Simple Interest formatted to 2 decimal places.',
            constraints: '1 <= P <= 10^7, 0.1 <= R <= 100.0, 0.1 <= T <= 50.0',
            sampleInput: '10000 5 2',
            sampleOutput: '1000.00',
            explanation: 'SI = (10000 * 5 * 2) / 100 = 1000.00',
            relatedConcepts: ['Math Operators', 'Format Specifiers', 'Scanner'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        double p = sc.nextDouble();\n        double r = sc.nextDouble();\n        double t = sc.nextDouble();\n        \n        double si = (p * r * t) / 100.0;\n        System.out.printf("%.2f\\n", si);\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '10000 5 2', expectedOutput: '1000.00' },
                { input: '5000 7.5 3', expectedOutput: '1125.00' }
            ]
        },

        // =========================================================================
        // 2. Input and Output
        // =========================================================================
        {
            id: 'read-and-print-user-details',
            number: 5,
            title: 'Read and Print User Details',
            category: 'Input and Output',
            difficulty: 'Easy',
            description: 'Read a user\'s name (String), age (int), and GPA (double) from standard input. Output them in the format: <code>Name: <name>, Age: <age>, GPA: <gpa></code>.',
            inputFormat: 'Three lines: String name, int age, double gpa.',
            outputFormat: 'Print formatted profile string with GPA to 2 decimal places.',
            constraints: 'Name contains letters only. 1 <= age <= 120. 0.0 <= gpa <= 4.0.',
            sampleInput: 'Alice\n20\n3.85',
            sampleOutput: 'Name: Alice, Age: 20, GPA: 3.85',
            explanation: 'Read using sc.nextLine(), sc.nextInt(), sc.nextDouble().',
            relatedConcepts: ['Scanner Tokenization', 'Data Types', 'String Concatenation'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String name = sc.nextLine();\n        int age = sc.nextInt();\n        double gpa = sc.nextDouble();\n        \n        System.out.printf("Name: %s, Age: %d, GPA: %.2f\\n", name, age, gpa);\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: 'Alice\n20\n3.85', expectedOutput: 'Name: Alice, Age: 20, GPA: 3.85' },
                { input: 'Bob\n22\n4.0', expectedOutput: 'Name: Bob, Age: 22, GPA: 4.00' }
            ]
        },
        {
            id: 'sum-of-two-numbers',
            number: 6,
            title: 'Sum of Two Numbers',
            category: 'Input and Output',
            difficulty: 'Easy',
            description: 'Given two integers <code>A</code> and <code>B</code>, calculate and print their sum.',
            inputFormat: 'Two space-separated integers A and B.',
            outputFormat: 'Single integer representing A + B.',
            constraints: '-10^9 <= A, B <= 10^9',
            sampleInput: '15 27',
            sampleOutput: '42',
            explanation: '15 + 27 = 42.',
            relatedConcepts: ['Scanner', 'Addition', 'Long vs Int Range'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long a = sc.nextLong();\n        long b = sc.nextLong();\n        System.out.println(a + b);\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '15 27', expectedOutput: '42' },
                { input: '-10 20', expectedOutput: '10' },
                { input: '1000000000 2000000000', expectedOutput: '3000000000' }
            ]
        },
        {
            id: 'formatted-receipt-printer',
            number: 7,
            title: 'Formatted Receipt Printer',
            category: 'Input and Output',
            difficulty: 'Medium',
            description: 'Read an item name (String), quantity (int), and price per unit (double). Output a formatted line showing: <code>Item: <name> | Qty: <qty> | Total: $<total></code> (total formatted to 2 decimal places).',
            inputFormat: 'One line containing: String itemName, int qty, double price.',
            outputFormat: 'Formatted receipt line.',
            constraints: '1 <= qty <= 1000, 0.01 <= price <= 10000.0',
            sampleInput: 'Notebook 3 4.50',
            sampleOutput: 'Item: Notebook | Qty: 3 | Total: $13.50',
            explanation: '3 units at $4.50 = $13.50.',
            relatedConcepts: ['printf Formatting', 'Multiplication', 'Scanner'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String item = sc.next();\n        int qty = sc.nextInt();\n        double price = sc.nextDouble();\n        \n        double total = qty * price;\n        System.out.printf("Item: %s | Qty: %d | Total: $%.2f\\n", item, qty, total);\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: 'Notebook 3 4.50', expectedOutput: 'Item: Notebook | Qty: 3 | Total: $13.50' },
                { input: 'Pen 10 1.25', expectedOutput: 'Item: Pen | Qty: 10 | Total: $12.50' }
            ]
        },

        // =========================================================================
        // 3. Operators
        // =========================================================================
        {
            id: 'arithmetic-operations',
            number: 8,
            title: 'Arithmetic Operations',
            category: 'Operators',
            difficulty: 'Easy',
            description: 'Read two positive integers <code>a</code> and <code>b</code>. Print on separate lines their: Sum, Difference (a - b), Product, Quotient (a / b integer division), and Remainder (a % b).',
            inputFormat: 'Two space-separated positive integers a and b.',
            outputFormat: 'Five lines corresponding to: +, -, *, /, %.',
            constraints: '1 <= a, b <= 10^5',
            sampleInput: '8 3',
            sampleOutput: '11\n5\n24\n2\n2',
            explanation: '8+3=11, 8-3=5, 8*3=24, 8/3=2, 8%3=2.',
            relatedConcepts: ['Arithmetic Operators', 'Integer Division', 'Modulo Operator'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        \n        System.out.println(a + b);\n        System.out.println(a - b);\n        System.out.println(a * b);\n        System.out.println(a / b);\n        System.out.println(a % b);\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '8 3', expectedOutput: '11\n5\n24\n2\n2' },
                { input: '20 5', expectedOutput: '25\n15\n100\n4\n0' }
            ]
        },
        {
            id: 'bitwise-operators-demo',
            number: 9,
            title: 'Bitwise AND, OR, and XOR',
            category: 'Operators',
            difficulty: 'Medium',
            description: 'Given two integers <code>a</code> and <code>b</code>, print the result of bitwise operations on separate lines: <code>a & b</code>, <code>a | b</code>, and <code>a ^ b</code>.',
            inputFormat: 'Two space-separated non-negative integers a and b.',
            outputFormat: 'Three lines representing bitwise AND, OR, and XOR.',
            constraints: '0 <= a, b <= 10^6',
            sampleInput: '5 3',
            sampleOutput: '1\n7\n6',
            explanation: '5 (101) & 3 (011) = 1 (001). 5 | 3 = 7 (111). 5 ^ 3 = 6 (110).',
            relatedConcepts: ['Bitwise Operators', 'Binary Representations', 'Bit Manipulation'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        \n        System.out.println(a & b);\n        System.out.println(a | b);\n        System.out.println(a ^ b);\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '5 3', expectedOutput: '1\n7\n6' },
                { input: '12 25', expectedOutput: '8\n29\n21' }
            ]
        },
        {
            id: 'ternary-operator-maximum',
            number: 10,
            title: 'Maximum of Two via Ternary',
            category: 'Operators',
            difficulty: 'Easy',
            description: 'Given two integers <code>a</code> and <code>b</code>, find and print the maximum value using the Java ternary operator <code>? :</code>.',
            inputFormat: 'Two space-separated integers a and b.',
            outputFormat: 'Print the larger of the two integers.',
            constraints: '-10^6 <= a, b <= 10^6',
            sampleInput: '14 29',
            sampleOutput: '29',
            explanation: '14 < 29, so ternary condition evaluates to 29.',
            relatedConcepts: ['Ternary Operator', 'Inline Condition', 'Evaluation'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        \n        int max = (a >= b) ? a : b;\n        System.out.println(max);\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '14 29', expectedOutput: '29' },
                { input: '50 20', expectedOutput: '50' },
                { input: '-5 -1', expectedOutput: '-1' }
            ]
        },

        // =========================================================================
        // 4. Conditional Statements
        // =========================================================================
        {
            id: 'even-or-odd',
            number: 11,
            title: 'Even or Odd',
            category: 'Conditional Statements',
            difficulty: 'Easy',
            description: 'Given an integer <code>n</code>, print <code>Even</code> if the number is divisible by 2, or <code>Odd</code> otherwise.',
            inputFormat: 'A single integer n.',
            outputFormat: 'Print <code>Even</code> or <code>Odd</code>.',
            constraints: '-10^9 <= n <= 10^9',
            sampleInput: '7',
            sampleOutput: 'Odd',
            explanation: '7 % 2 != 0, so the number is Odd.',
            relatedConcepts: ['If-Else', 'Modulo Operator', 'Parity Check'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        \n        if (n % 2 == 0) {\n            System.out.println("Even");\n        } else {\n            System.out.println("Odd");\n        }\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '7', expectedOutput: 'Odd' },
                { input: '42', expectedOutput: 'Even' },
                { input: '0', expectedOutput: 'Even' }
            ]
        },
        {
            id: 'largest-of-three-numbers',
            number: 12,
            title: 'Largest of Three Numbers',
            category: 'Conditional Statements',
            difficulty: 'Easy',
            description: 'Given three distinct integers <code>a</code>, <code>b</code>, and <code>c</code>, determine and print the largest among them.',
            inputFormat: 'Three space-separated integers a, b, and c.',
            outputFormat: 'Print the maximum integer.',
            constraints: '-10^6 <= a, b, c <= 10^6',
            sampleInput: '12 45 32',
            sampleOutput: '45',
            explanation: '45 is greater than both 12 and 32.',
            relatedConcepts: ['Nested If Statements', 'Logical AND (&&)', 'Comparison'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        int c = sc.nextInt();\n        \n        int max = a;\n        if (b > max) max = b;\n        if (c > max) max = c;\n        \n        System.out.println(max);\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '12 45 32', expectedOutput: '45' },
                { input: '100 5 20', expectedOutput: '100' },
                { input: '-10 -5 -20', expectedOutput: '-5' }
            ]
        },
        {
            id: 'leap-year-checker',
            number: 13,
            title: 'Leap Year Checker',
            category: 'Conditional Statements',
            difficulty: 'Medium',
            description: 'Determine whether a given year <code>Y</code> is a leap year. A year is a leap year if it is divisible by 4, except for century years which must be divisible by 400. Print <code>Leap Year</code> or <code>Not Leap Year</code>.',
            inputFormat: 'A single positive integer Y.',
            outputFormat: 'Print <code>Leap Year</code> or <code>Not Leap Year</code>.',
            constraints: '1 <= Y <= 9999',
            sampleInput: '2024',
            sampleOutput: 'Leap Year',
            explanation: '2024 is divisible by 4 and not a century year, hence a leap year.',
            relatedConcepts: ['Compound Boolean Logic', 'Century Year Exceptions', 'Modulo'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int year = sc.nextInt();\n        \n        boolean isLeap = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);\n        if (isLeap) {\n            System.out.println("Leap Year");\n        } else {\n            System.out.println("Not Leap Year");\n        }\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '2024', expectedOutput: 'Leap Year' },
                { input: '1900', expectedOutput: 'Not Leap Year' },
                { input: '2000', expectedOutput: 'Leap Year' }
            ]
        },
        {
            id: 'grade-calculator',
            number: 14,
            title: 'Grade Calculator',
            category: 'Conditional Statements',
            difficulty: 'Easy',
            description: 'Read an integer score <code>M</code> (0 to 100). Output the letter grade: 90-100: A, 80-89: B, 70-79: C, 60-69: D, <60: F.',
            inputFormat: 'A single integer M.',
            outputFormat: 'A single character grade (A, B, C, D, or F).',
            constraints: '0 <= M <= 100',
            sampleInput: '85',
            sampleOutput: 'B',
            explanation: '85 falls in the 80-89 range, so grade is B.',
            relatedConcepts: ['Else-If Ladder', 'Relational Operators', 'Input Range Validation'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int score = sc.nextInt();\n        \n        if (score >= 90) System.out.println("A");\n        else if (score >= 80) System.out.println("B");\n        else if (score >= 70) System.out.println("C");\n        else if (score >= 60) System.out.println("D");\n        else System.out.println("F");\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '85', expectedOutput: 'B' },
                { input: '95', expectedOutput: 'A' },
                { input: '55', expectedOutput: 'F' }
            ]
        },

        // =========================================================================
        // 5. Loops
        // =========================================================================
        {
            id: 'multiplication-table',
            number: 15,
            title: 'Multiplication Table',
            category: 'Loops',
            difficulty: 'Easy',
            description: 'Given an integer <code>N</code>, print its multiplication table from 1 to 10 in the format: <code>N x i = <result></code>.',
            inputFormat: 'A single positive integer N.',
            outputFormat: '10 lines showing multiplication table products.',
            constraints: '1 <= N <= 1000',
            sampleInput: '5',
            sampleOutput: '5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50',
            explanation: 'Iterate from i = 1 to 10 and print N * i.',
            relatedConcepts: ['For Loop', 'Loop Index', 'String Formatting'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        \n        for (int i = 1; i <= 10; i++) {\n            System.out.println(n + " x " + i + " = " + (n * i));\n        }\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '5', expectedOutput: '5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50' },
                { input: '2', expectedOutput: '2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n2 x 4 = 8\n2 x 5 = 10\n2 x 6 = 12\n2 x 7 = 14\n2 x 8 = 16\n2 x 9 = 18\n2 x 10 = 20' }
            ]
        },
        {
            id: 'sum-of-first-n-numbers',
            number: 16,
            title: 'Sum of First N Natural Numbers',
            category: 'Loops',
            difficulty: 'Easy',
            description: 'Compute and print the sum of the first <code>N</code> positive integers: <code>1 + 2 + ... + N</code>.',
            inputFormat: 'A single positive integer N.',
            outputFormat: 'Print the total sum.',
            constraints: '1 <= N <= 10^5',
            sampleInput: '10',
            sampleOutput: '55',
            explanation: 'Sum = 1+2+3+4+5+6+7+8+9+10 = 55.',
            relatedConcepts: ['Accumulator Pattern', 'While / For Loop', 'Sum Formula'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = sc.nextLong();\n        \n        long sum = 0;\n        for (long i = 1; i <= n; i++) {\n            sum += i;\n        }\n        System.out.println(sum);\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '10', expectedOutput: '55' },
                { input: '100', expectedOutput: '5050' },
                { input: '1', expectedOutput: '1' }
            ]
        },
        {
            id: 'factorial-of-a-number',
            number: 17,
            title: 'Factorial of a Number',
            category: 'Loops',
            difficulty: 'Easy',
            description: 'Given an integer <code>N</code>, compute its factorial <code>N!</code>. Note that 0! = 1.',
            inputFormat: 'A non-negative integer N.',
            outputFormat: 'Print N! as a long integer.',
            constraints: '0 <= N <= 20',
            sampleInput: '5',
            sampleOutput: '120',
            explanation: '5! = 5 * 4 * 3 * 2 * 1 = 120.',
            relatedConcepts: ['Iterative Multiplication', 'Boundary Value 0!', 'Long Integer Type'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        \n        long fact = 1;\n        for (int i = 2; i <= n; i++) {\n            fact *= i;\n        }\n        System.out.println(fact);\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '5', expectedOutput: '120' },
                { input: '0', expectedOutput: '1' },
                { input: '6', expectedOutput: '720' }
            ]
        },
        {
            id: 'count-digits-in-number',
            number: 18,
            title: 'Count Digits in an Integer',
            category: 'Loops',
            difficulty: 'Easy',
            description: 'Given an integer <code>N</code>, count and print the total number of digits in N. For 0, the digit count is 1.',
            inputFormat: 'A single integer N.',
            outputFormat: 'Total number of digits.',
            constraints: '-10^18 <= N <= 10^18',
            sampleInput: '12345',
            sampleOutput: '5',
            explanation: '12345 has 5 digits.',
            relatedConcepts: ['While Loop', 'Integer Division', 'Math.abs'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = Math.abs(sc.nextLong());\n        \n        if (n == 0) {\n            System.out.println(1);\n        } else {\n            int count = 0;\n            while (n > 0) {\n                count++;\n                n /= 10;\n            }\n            System.out.println(count);\n        }\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '12345', expectedOutput: '5' },
                { input: '0', expectedOutput: '1' },
                { input: '-9876', expectedOutput: '4' }
            ]
        },

        // =========================================================================
        // 6. Number Problems
        // =========================================================================
        {
            id: 'prime-number-checker',
            number: 19,
            title: 'Prime Number Checker',
            category: 'Number Problems',
            difficulty: 'Medium',
            description: 'Determine whether a given positive integer <code>N</code> is prime. Print <code>Prime</code> or <code>Not Prime</code>.',
            inputFormat: 'A single positive integer N.',
            outputFormat: 'Print <code>Prime</code> or <code>Not Prime</code>.',
            constraints: '1 <= N <= 10^9',
            sampleInput: '17',
            sampleOutput: 'Prime',
            explanation: '17 is only divisible by 1 and 17.',
            relatedConcepts: ['Primality Test', 'Sqrt(N) Optimization', 'Loop Termination'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = sc.nextLong();\n        \n        if (n <= 1) {\n            System.out.println("Not Prime");\n            sc.close();\n            return;\n        }\n        boolean isPrime = true;\n        for (long i = 2; i * i <= n; i++) {\n            if (n % i == 0) {\n                isPrime = false;\n                break;\n            }\n        }\n        System.out.println(isPrime ? "Prime" : "Not Prime");\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '17', expectedOutput: 'Prime' },
                { input: '4', expectedOutput: 'Not Prime' },
                { input: '1', expectedOutput: 'Not Prime' },
                { input: '97', expectedOutput: 'Prime' }
            ]
        },
        {
            id: 'fibonacci-series',
            number: 20,
            title: 'Fibonacci Sequence Generator',
            category: 'Number Problems',
            difficulty: 'Medium',
            description: 'Generate the first <code>N</code> terms of the Fibonacci sequence starting with 0 and 1. Print the sequence separated by spaces.',
            inputFormat: 'A positive integer N (number of terms).',
            outputFormat: 'First N Fibonacci numbers separated by spaces.',
            constraints: '1 <= N <= 40',
            sampleInput: '7',
            sampleOutput: '0 1 1 2 3 5 8',
            explanation: '0, 1, 0+1=1, 1+1=2, 1+2=3, 2+3=5, 3+5=8.',
            relatedConcepts: ['Sequence Generation', 'Previous State Caching', 'Loops'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        \n        long a = 0, b = 1;\n        for (int i = 0; i < n; i++) {\n            System.out.print(a + (i == n - 1 ? "" : " "));\n            long next = a + b;\n            a = b;\n            b = next;\n        }\n        System.out.println();\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '7', expectedOutput: '0 1 1 2 3 5 8' },
                { input: '1', expectedOutput: '0' },
                { input: '4', expectedOutput: '0 1 1 2' }
            ]
        },
        {
            id: 'reverse-a-number',
            number: 21,
            title: 'Reverse a Number',
            category: 'Number Problems',
            difficulty: 'Easy',
            description: 'Given a non-negative integer <code>N</code>, reverse its digits mathematically and print the resulting number.',
            inputFormat: 'A non-negative integer N.',
            outputFormat: 'The reversed integer.',
            constraints: '0 <= N <= 10^9',
            sampleInput: '1234',
            sampleOutput: '4321',
            explanation: '1234 reversed is 4321.',
            relatedConcepts: ['Modulo Extraction', 'Base 10 Accumulator', 'While Loop'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        \n        int rev = 0;\n        while (n > 0) {\n            rev = rev * 10 + (n % 10);\n            n /= 10;\n        }\n        System.out.println(rev);\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '1234', expectedOutput: '4321' },
                { input: '500', expectedOutput: '5' },
                { input: '7', expectedOutput: '7' }
            ]
        },
        {
            id: 'number-palindrome',
            number: 22,
            title: 'Palindrome Number Checker',
            category: 'Number Problems',
            difficulty: 'Easy',
            description: 'Determine if an integer <code>N</code> is a palindrome (reads identically forwards and backwards). Print <code>Palindrome</code> or <code>Not Palindrome</code>.',
            inputFormat: 'An integer N.',
            outputFormat: 'Print <code>Palindrome</code> or <code>Not Palindrome</code>.',
            constraints: '0 <= N <= 10^9',
            sampleInput: '1221',
            sampleOutput: 'Palindrome',
            explanation: '1221 backwards is 1221.',
            relatedConcepts: ['Palindrome Logic', 'Digit Reversal', 'Comparison'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        \n        int original = n;\n        int rev = 0;\n        while (n > 0) {\n            rev = rev * 10 + (n % 10);\n            n /= 10;\n        }\n        System.out.println(original == rev ? "Palindrome" : "Not Palindrome");\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '1221', expectedOutput: 'Palindrome' },
                { input: '1234', expectedOutput: 'Not Palindrome' },
                { input: '7', expectedOutput: 'Palindrome' }
            ]
        },
        {
            id: 'armstrong-number',
            number: 23,
            title: 'Armstrong Number Validator',
            category: 'Number Problems',
            difficulty: 'Medium',
            description: 'An Armstrong number of <code>k</code> digits is an integer such that the sum of its digits raised to the power of k equals the number itself. Determine if N is an Armstrong number.',
            inputFormat: 'A non-negative integer N.',
            outputFormat: 'Print <code>Armstrong</code> or <code>Not Armstrong</code>.',
            constraints: '0 <= N <= 10^7',
            sampleInput: '153',
            sampleOutput: 'Armstrong',
            explanation: '153 has 3 digits: 1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153.',
            relatedConcepts: ['Math.pow', 'Digit Power Sum', 'Integer Analysis'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        \n        int temp = n;\n        int digits = String.valueOf(n).length();\n        int sum = 0;\n        while (temp > 0) {\n            int d = temp % 10;\n            sum += Math.pow(d, digits);\n            temp /= 10;\n        }\n        System.out.println(sum == n ? "Armstrong" : "Not Armstrong");\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '153', expectedOutput: 'Armstrong' },
                { input: '370', expectedOutput: 'Armstrong' },
                { input: '123', expectedOutput: 'Not Armstrong' }
            ]
        },
        {
            id: 'gcd-and-lcm',
            number: 24,
            title: 'GCD and LCM of Two Numbers',
            category: 'Number Problems',
            difficulty: 'Medium',
            description: 'Given two integers <code>A</code> and <code>B</code>, compute their Greatest Common Divisor (GCD) and Least Common Multiple (LCM). Print GCD and LCM separated by a space.',
            inputFormat: 'Two space-separated positive integers A and B.',
            outputFormat: 'Print <code><GCD> <LCM></code> on a single line.',
            constraints: '1 <= A, B <= 10^6',
            sampleInput: '12 18',
            sampleOutput: '6 36',
            explanation: 'GCD(12, 18) = 6. LCM(12, 18) = (12 * 18) / 6 = 36.',
            relatedConcepts: ['Euclidean Algorithm', 'GCD Property', 'LCM = (a*b)/gcd'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static long gcd(long a, long b) {\n        while (b != 0) {\n            long t = b;\n            b = a % b;\n            a = t;\n        }\n        return a;\n    }\n    \n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long a = sc.nextLong();\n        long b = sc.nextLong();\n        \n        long g = gcd(a, b);\n        long l = (a * b) / g;\n        System.out.println(g + " " + l);\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '12 18', expectedOutput: '6 36' },
                { input: '7 5', expectedOutput: '1 35' },
                { input: '20 40', expectedOutput: '20 40' }
            ]
        },

        // =========================================================================
        // 7. Pattern Programming
        // =========================================================================
        {
            id: 'right-triangle-star-pattern',
            number: 25,
            title: 'Right Triangle Star Pattern',
            category: 'Pattern Programming',
            difficulty: 'Easy',
            description: 'Print a right-angled triangle pattern of asterisks <code>*</code> of height <code>N</code>, where the i-th row contains i asterisks.',
            inputFormat: 'A single positive integer N.',
            outputFormat: 'N lines representing the star pattern.',
            constraints: '1 <= N <= 20',
            sampleInput: '4',
            sampleOutput: '*\n**\n***\n****',
            explanation: 'Row 1 has 1 star, row 2 has 2 stars, up to row 4 with 4 stars.',
            relatedConcepts: ['Nested Loops', 'Loop Invariants', 'Pattern Output'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        \n        for (int i = 1; i <= n; i++) {\n            for (int j = 1; j <= i; j++) {\n                System.out.print("*");\n            }\n            System.out.println();\n        }\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '4', expectedOutput: '*\n**\n***\n****' },
                { input: '2', expectedOutput: '*\n**' }
            ]
        },
        {
            id: 'inverted-triangle-pattern',
            number: 26,
            title: 'Inverted Triangle Pattern',
            category: 'Pattern Programming',
            difficulty: 'Easy',
            description: 'Print an inverted triangle of asterisks of height <code>N</code>. Row 1 has N stars, row 2 has N-1 stars, down to 1 star.',
            inputFormat: 'A positive integer N.',
            outputFormat: 'N lines representing the inverted triangle.',
            constraints: '1 <= N <= 20',
            sampleInput: '3',
            sampleOutput: '***\n**\n*',
            explanation: 'Row 1 has 3 stars, row 2 has 2, row 3 has 1.',
            relatedConcepts: ['Decreasing Inner Loops', 'Nested Iteration', 'Console Patterns'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        \n        for (int i = n; i >= 1; i--) {\n            for (int j = 1; j <= i; j++) {\n                System.out.print("*");\n            }\n            System.out.println();\n        }\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '3', expectedOutput: '***\n**\n*' },
                { input: '1', expectedOutput: '*' }
            ]
        },
        {
            id: 'number-pyramid',
            number: 27,
            title: 'Number Pyramid',
            category: 'Pattern Programming',
            difficulty: 'Medium',
            description: 'Print a number pyramid of height <code>N</code>. In row <code>i</code>, print numbers from 1 to i separated by a space.',
            inputFormat: 'A single positive integer N.',
            outputFormat: 'N lines showing increasing number sequence.',
            constraints: '1 <= N <= 15',
            sampleInput: '4',
            sampleOutput: '1\n1 2\n1 2 3\n1 2 3 4',
            explanation: 'Each line prints numbers from 1 up to current line number.',
            relatedConcepts: ['Number Patterns', 'Row Tracking', 'Spacing'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        \n        for (int i = 1; i <= n; i++) {\n            for (int j = 1; j <= i; j++) {\n                System.out.print(j + (j == i ? "" : " "));\n            }\n            System.out.println();\n        }\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '4', expectedOutput: '1\n1 2\n1 2 3\n1 2 3 4' },
                { input: '2', expectedOutput: '1\n1 2' }
            ]
        },
        {
            id: 'floyds-triangle',
            number: 28,
            title: 'Floyd\'s Triangle',
            category: 'Pattern Programming',
            difficulty: 'Medium',
            description: 'Print Floyd\'s Triangle of <code>N</code> rows, filled with consecutive natural numbers starting from 1.',
            inputFormat: 'A single positive integer N.',
            outputFormat: 'N lines showing Floyd\'s Triangle.',
            constraints: '1 <= N <= 10',
            sampleInput: '4',
            sampleOutput: '1\n2 3\n4 5 6\n7 8 9 10',
            explanation: 'Numbers increment continually across rows: row 1 (1), row 2 (2 3), row 3 (4 5 6), row 4 (7 8 9 10).',
            relatedConcepts: ['Continuous Counter', 'Nested Loops', 'Formatting'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        \n        int num = 1;\n        for (int i = 1; i <= n; i++) {\n            for (int j = 1; j <= i; j++) {\n                System.out.print(num + (j == i ? "" : " "));\n                num++;\n            }\n            System.out.println();\n        }\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '4', expectedOutput: '1\n2 3\n4 5 6\n7 8 9 10' },
                { input: '2', expectedOutput: '1\n2 3' }
            ]
        },

        // =========================================================================
        // 8. Arrays
        // =========================================================================
        {
            id: 'array-sum-and-average',
            number: 29,
            title: 'Array Sum and Average',
            category: 'Arrays',
            difficulty: 'Easy',
            description: 'Read an array of <code>N</code> integers. Calculate and print the sum and average (rounded to 2 decimal places) on separate lines.',
            inputFormat: 'First line: integer N. Second line: N space-separated integers.',
            outputFormat: 'Line 1: Sum. Line 2: Average formatted to 2 decimals.',
            constraints: '1 <= N <= 10^5, -10^4 <= elements <= 10^4',
            sampleInput: '5\n10 20 30 40 50',
            sampleOutput: '150\n30.00',
            explanation: 'Sum = 150. Average = 150 / 5 = 30.00.',
            relatedConcepts: ['Array Traversal', 'Accumulator', 'Double Division'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        long sum = 0;\n        for (int i = 0; i < n; i++) {\n            sum += sc.nextInt();\n        }\n        double avg = (double) sum / n;\n        System.out.println(sum);\n        System.out.printf("%.2f\\n", avg);\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '5\n10 20 30 40 50', expectedOutput: '150\n30.00' },
                { input: '3\n4 5 6', expectedOutput: '15\n5.00' }
            ]
        },
        {
            id: 'find-maximum-and-minimum',
            number: 30,
            title: 'Find Maximum and Minimum in Array',
            category: 'Arrays',
            difficulty: 'Easy',
            description: 'Given an array of <code>N</code> integers, find and print the maximum and minimum elements separated by a space.',
            inputFormat: 'First line: integer N. Second line: N space-separated integers.',
            outputFormat: 'Print <code><max> <min></code>.',
            constraints: '1 <= N <= 10^5, -10^9 <= elements <= 10^9',
            sampleInput: '6\n3 8 1 9 2 5',
            sampleOutput: '9 1',
            explanation: 'Max element is 9, min element is 1.',
            relatedConcepts: ['Linear Scan', 'Single-Pass Min/Max', 'Boundary Comparison'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int max = Integer.MIN_VALUE;\n        int min = Integer.MAX_VALUE;\n        \n        for (int i = 0; i < n; i++) {\n            int val = sc.nextInt();\n            if (val > max) max = val;\n            if (val < min) min = val;\n        }\n        System.out.println(max + " " + min);\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '6\n3 8 1 9 2 5', expectedOutput: '9 1' },
                { input: '1\n42', expectedOutput: '42 42' }
            ]
        },
        {
            id: 'second-largest-element',
            number: 31,
            title: 'Second Largest Element in Array',
            category: 'Arrays',
            difficulty: 'Medium',
            description: 'Find the second distinct largest element in an array of <code>N</code> integers. If no second largest exists, print -1.',
            inputFormat: 'First line: integer N. Second line: N space-separated integers.',
            outputFormat: 'The second largest distinct integer or -1.',
            constraints: '2 <= N <= 10^5',
            sampleInput: '5\n12 35 1 10 34',
            sampleOutput: '34',
            explanation: 'Distinct elements are 1, 10, 12, 34, 35. Second largest is 34.',
            relatedConcepts: ['Single-Pass Two Variables', 'Distinct Filtering', 'Edge Cases'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int first = Integer.MIN_VALUE, second = Integer.MIN_VALUE;\n        \n        for (int i = 0; i < n; i++) {\n            int v = sc.nextInt();\n            if (v > first) {\n                second = first;\n                first = v;\n            } else if (v > second && v != first) {\n                second = v;\n            }\n        }\n        System.out.println(second == Integer.MIN_VALUE ? -1 : second);\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '5\n12 35 1 10 34', expectedOutput: '34' },
                { input: '3\n10 10 10', expectedOutput: '-1' }
            ]
        },
        {
            id: 'reverse-an-array',
            number: 32,
            title: 'Reverse an Array in Place',
            category: 'Arrays',
            difficulty: 'Medium',
            description: 'Given an array of <code>N</code> integers, reverse it in place using two pointers and print the reversed array.',
            inputFormat: 'First line: integer N. Second line: N space-separated integers.',
            outputFormat: 'The reversed array elements separated by spaces.',
            constraints: '1 <= N <= 10^5',
            sampleInput: '5\n1 2 3 4 5',
            sampleOutput: '5 4 3 2 1',
            explanation: 'Swap elements from outside in: 1<->5, 2<->4.',
            relatedConcepts: ['Two-Pointer Swapping', 'In-Place Invariant', 'O(1) Memory'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        \n        int left = 0, right = n - 1;\n        while (left < right) {\n            int temp = arr[left];\n            arr[left] = arr[right];\n            arr[right] = temp;\n            left++;\n            right--;\n        }\n        \n        for (int i = 0; i < n; i++) {\n            System.out.print(arr[i] + (i == n - 1 ? "" : " "));\n        }\n        System.out.println();\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '5\n1 2 3 4 5', expectedOutput: '5 4 3 2 1' },
                { input: '2\n10 20', expectedOutput: '20 10' }
            ]
        },

        // =========================================================================
        // 9. Strings
        // =========================================================================
        {
            id: 'reverse-a-string-basic',
            number: 33,
            title: 'Reverse a String',
            category: 'Strings',
            difficulty: 'Easy',
            description: 'Given a string <code>S</code>, output the reversed string.',
            inputFormat: 'A single line containing string S.',
            outputFormat: 'The reversed string.',
            constraints: '1 <= length(S) <= 10^4',
            sampleInput: 'CodeArena',
            sampleOutput: 'anerAedoC',
            explanation: 'Characters are output from last to first.',
            relatedConcepts: ['StringBuilder.reverse', 'Character Array', 'Strings'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        \n        StringBuilder sb = new StringBuilder(s);\n        System.out.println(sb.reverse().toString());\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: 'CodeArena', expectedOutput: 'anerAedoC' },
                { input: 'Java', expectedOutput: 'avaJ' }
            ]
        },
        {
            id: 'count-vowels-and-consonants',
            number: 34,
            title: 'Count Vowels and Consonants',
            category: 'Strings',
            difficulty: 'Easy',
            description: 'Count the total number of vowels and consonants in a given alphabetic string <code>S</code> (case-insensitive). Print: <code>Vowels: <v>, Consonants: <c></code>.',
            inputFormat: 'A single line string S.',
            outputFormat: 'Print <code>Vowels: <v>, Consonants: <c></code>.',
            constraints: '1 <= S.length() <= 10^5, contains letters only',
            sampleInput: 'Hello World',
            sampleOutput: 'Vowels: 3, Consonants: 7',
            explanation: 'Vowels: e, o, o (3). Consonants: H, l, l, W, r, l, d (7).',
            relatedConcepts: ['Character.toLowerCase', 'Vowel Matching', 'Char Classification'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine().toLowerCase();\n        \n        int vowels = 0, consonants = 0;\n        for (char ch : s.toCharArray()) {\n            if (ch >= \'a\' && ch <= \'z\') {\n                if ("aeiou".indexOf(ch) != -1) vowels++;\n                else consonants++;\n            }\n        }\n        System.out.printf("Vowels: %d, Consonants: %d\\n", vowels, consonants);\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: 'Hello World', expectedOutput: 'Vowels: 3, Consonants: 7' },
                { input: 'Java', expectedOutput: 'Vowels: 2, Consonants: 2' }
            ]
        },
        {
            id: 'palindrome-string-check',
            number: 35,
            title: 'Palindrome String Checker',
            category: 'Strings',
            difficulty: 'Easy',
            description: 'Determine whether a string <code>S</code> is a palindrome (ignoring case). Print <code>Palindrome</code> or <code>Not Palindrome</code>.',
            inputFormat: 'A single line containing string S.',
            outputFormat: 'Print <code>Palindrome</code> or <code>Not Palindrome</code>.',
            constraints: '1 <= S.length() <= 10^4',
            sampleInput: 'Radar',
            sampleOutput: 'Palindrome',
            explanation: '"radar" reversed is "radar".',
            relatedConcepts: ['Two Pointers', 'Case Insensitivity', 'String Comparison'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine().toLowerCase();\n        \n        int left = 0, right = s.length() - 1;\n        boolean isPal = true;\n        while (left < right) {\n            if (s.charAt(left) != s.charAt(right)) {\n                isPal = false;\n                break;\n            }\n            left++;\n            right--;\n        }\n        System.out.println(isPal ? "Palindrome" : "Not Palindrome");\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: 'Radar', expectedOutput: 'Palindrome' },
                { input: 'Hello', expectedOutput: 'Not Palindrome' }
            ]
        },
        {
            id: 'character-frequency-counter',
            number: 36,
            title: 'Character Frequency in String',
            category: 'Strings',
            difficulty: 'Medium',
            description: 'Count the frequency of each lowercase character in string <code>S</code>. Output characters that appear at least once in alphabetical order formatted as: <code><char>:<count></code> on a single line separated by spaces.',
            inputFormat: 'A single string of lowercase alphabets.',
            outputFormat: 'Space-separated char:count pairs.',
            constraints: '1 <= S.length() <= 10^5',
            sampleInput: 'banana',
            sampleOutput: 'a:3 b:1 n:2',
            explanation: 'a appears 3 times, b appears 1 time, n appears 2 times.',
            relatedConcepts: ['Frequency Array (int[26])', 'Char Indexing', 'Lexicographic Output'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        \n        int[] count = new int[26];\n        for (char ch : s.toCharArray()) {\n            if (ch >= \'a\' && ch <= \'z\') {\n                count[ch - \'a\']++;\n            }\n        }\n        boolean first = true;\n        for (int i = 0; i < 26; i++) {\n            if (count[i] > 0) {\n                if (!first) System.out.print(" ");\n                System.out.print((char)(\'a\' + i) + ":" + count[i]);\n                first = false;\n            }\n        }\n        System.out.println();\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: 'banana', expectedOutput: 'a:3 b:1 n:2' },
                { input: 'java', expectedOutput: 'a:2 j:1 v:1' }
            ]
        },

        // =========================================================================
        // 10. Methods and Recursion
        // =========================================================================
        {
            id: 'method-overloading-demo',
            number: 37,
            title: 'Method Overloading: Geometry Area',
            category: 'Methods and Recursion',
            difficulty: 'Easy',
            description: 'Implement overloaded methods <code>area(double radius)</code> for a circle and <code>area(double length, double width)</code> for a rectangle. Compute and print circle area then rectangle area.',
            inputFormat: 'Line 1: radius (double). Line 2: length and width (two doubles).',
            outputFormat: 'Two lines: circle area then rectangle area, formatted to 2 decimals.',
            constraints: '1 <= radius, length, width <= 1000.0',
            sampleInput: '5.0\n4.0 6.0',
            sampleOutput: '78.54\n24.00',
            explanation: 'Circle area = Math.PI * 5^2 = 78.54. Rectangle area = 4 * 6 = 24.00.',
            relatedConcepts: ['Compile-Time Polymorphism', 'Method Signatures', 'Method Overloading'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static double area(double r) {\n        return Math.PI * r * r;\n    }\n    \n    public static double area(double l, double w) {\n        return l * w;\n    }\n    \n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        double r = sc.nextDouble();\n        double l = sc.nextDouble();\n        double w = sc.nextDouble();\n        \n        System.out.printf("%.2f\\n", area(r));\n        System.out.printf("%.2f\\n", area(l, w));\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '5.0\n4.0 6.0', expectedOutput: '78.54\n24.00' },
                { input: '1.0\n2.0 3.0', expectedOutput: '3.14\n6.00' }
            ]
        },
        {
            id: 'recursive-factorial',
            number: 38,
            title: 'Recursive Factorial',
            category: 'Methods and Recursion',
            difficulty: 'Medium',
            description: 'Compute <code>N!</code> recursively. Ensure base case <code>N <= 1</code> returns 1.',
            inputFormat: 'A non-negative integer N.',
            outputFormat: 'The factorial value.',
            constraints: '0 <= N <= 20',
            sampleInput: '5',
            sampleOutput: '120',
            explanation: 'fact(5) = 5 * fact(4) = 5 * 24 = 120.',
            relatedConcepts: ['Base Cases', 'Recursion Tree', 'Call Stack'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static long factorial(int n) {\n        if (n <= 1) return 1;\n        return n * factorial(n - 1);\n    }\n    \n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(factorial(n));\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '5', expectedOutput: '120' },
                { input: '0', expectedOutput: '1' },
                { input: '4', expectedOutput: '24' }
            ]
        },
        {
            id: 'recursive-fibonacci',
            number: 39,
            title: 'Recursive N-th Fibonacci',
            category: 'Methods and Recursion',
            difficulty: 'Medium',
            description: 'Given <code>N</code>, compute the N-th Fibonacci number recursively (0-indexed: F(0)=0, F(1)=1).',
            inputFormat: 'A non-negative integer N.',
            outputFormat: 'The N-th Fibonacci number.',
            constraints: '0 <= N <= 30',
            sampleInput: '6',
            sampleOutput: '8',
            explanation: 'F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3, F(5)=5, F(6)=8.',
            relatedConcepts: ['Branching Recursion', 'Base Conditions', 'Recursion Tree'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static int fib(int n) {\n        if (n <= 0) return 0;\n        if (n == 1) return 1;\n        return fib(n - 1) + fib(n - 2);\n    }\n    \n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(fib(n));\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '6', expectedOutput: '8' },
                { input: '0', expectedOutput: '0' },
                { input: '1', expectedOutput: '1' }
            ]
        },
        {
            id: 'sum-of-digits-recursion',
            number: 40,
            title: 'Recursive Sum of Digits',
            category: 'Methods and Recursion',
            difficulty: 'Medium',
            description: 'Calculate the sum of digits of a given positive integer <code>N</code> using recursion.',
            inputFormat: 'A positive integer N.',
            outputFormat: 'Single integer sum of digits.',
            constraints: '1 <= N <= 10^9',
            sampleInput: '987',
            sampleOutput: '24',
            explanation: 'sumDigits(987) = 7 + sumDigits(98) = 7 + 8 + 9 = 24.',
            relatedConcepts: ['Recursive Reduction', 'Modulo Arithmetic', 'Base Cases'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static int sumDigits(int n) {\n        if (n == 0) return 0;\n        return (n % 10) + sumDigits(n / 10);\n    }\n    \n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(sumDigits(n));\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '987', expectedOutput: '24' },
                { input: '1234', expectedOutput: '10' }
            ]
        },

        // =========================================================================
        // 11. Object-Oriented Programming
        // =========================================================================
        {
            id: 'class-and-object-creation',
            number: 41,
            title: 'Student Record Class',
            category: 'Object-Oriented Programming',
            difficulty: 'Easy',
            description: 'Define a <code>Student</code> class with attributes <code>name</code> and <code>rollNo</code>. Instantiate the object from input and print <code>Roll: <rollNo>, Name: <name></code>.',
            inputFormat: 'Line 1: int rollNo. Line 2: String name.',
            outputFormat: 'Print <code>Roll: <rollNo>, Name: <name></code>.',
            constraints: '1 <= rollNo <= 1000',
            sampleInput: '101\nGrace',
            sampleOutput: 'Roll: 101, Name: Grace',
            explanation: 'Encapsulate state inside a Student instance and call display method.',
            relatedConcepts: ['Class Definition', 'Object Instantiation', 'State Encapsulation'],
            starterCode: 'import java.util.Scanner;\n\nclass Student {\n    int rollNo;\n    String name;\n    \n    Student(int rollNo, String name) {\n        this.rollNo = rollNo;\n        this.name = name;\n    }\n    \n    void display() {\n        System.out.println("Roll: " + rollNo + ", Name: " + name);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int roll = sc.nextInt();\n        String name = sc.next();\n        Student s = new Student(roll, name);\n        s.display();\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '101\nGrace', expectedOutput: 'Roll: 101, Name: Grace' },
                { input: '42\nAlan', expectedOutput: 'Roll: 42, Name: Alan' }
            ]
        },
        {
            id: 'constructor-demonstration',
            number: 42,
            title: 'Constructor Overloading: Book Class',
            category: 'Object-Oriented Programming',
            difficulty: 'Easy',
            description: 'Create a <code>Book</code> class with default and parameterized constructors. Print book title and price.',
            inputFormat: 'Line 1: String title. Line 2: double price.',
            outputFormat: 'Print <code>Book: <title> | Price: $<price></code>.',
            constraints: 'Price > 0',
            sampleInput: 'EffectiveJava 45.00',
            sampleOutput: 'Book: EffectiveJava | Price: $45.00',
            explanation: 'Constructors initialize object state upon instantiation.',
            relatedConcepts: ['Constructor Overloading', 'this Keyword', 'Initialization'],
            starterCode: 'import java.util.Scanner;\n\nclass Book {\n    String title;\n    double price;\n    \n    Book() {\n        this.title = "Untitled";\n        this.price = 0.0;\n    }\n    \n    Book(String title, double price) {\n        this.title = title;\n        this.price = price;\n    }\n    \n    void display() {\n        System.out.printf("Book: %s | Price: $%.2f\\n", title, price);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String title = sc.next();\n        double price = sc.nextDouble();\n        Book b = new Book(title, price);\n        b.display();\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: 'EffectiveJava 45.00', expectedOutput: 'Book: EffectiveJava | Price: $45.00' }
            ]
        },
        {
            id: 'inheritance-example',
            number: 43,
            title: 'Vehicle and Car Inheritance',
            category: 'Object-Oriented Programming',
            difficulty: 'Medium',
            description: 'Demonstrate inheritance by creating a base class <code>Vehicle</code> with <code>brand</code> and subclass <code>Car</code> with <code>doors</code>. Call <code>drive()</code> to print: <code>Driving <brand> with <doors> doors.</code>.',
            inputFormat: 'String brand, int doors.',
            outputFormat: 'Print <code>Driving <brand> with <doors> doors.</code>.',
            constraints: 'doors >= 1',
            sampleInput: 'Tesla 4',
            sampleOutput: 'Driving Tesla with 4 doors.',
            explanation: 'Subclass inherits fields from superclass using extends and super().',
            relatedConcepts: ['Single Inheritance', 'super Keyword', 'Subclassing'],
            starterCode: 'import java.util.Scanner;\n\nclass Vehicle {\n    String brand;\n    Vehicle(String brand) {\n        this.brand = brand;\n    }\n}\n\nclass Car extends Vehicle {\n    int doors;\n    Car(String brand, int doors) {\n        super(brand);\n        this.doors = doors;\n    }\n    void drive() {\n        System.out.println("Driving " + brand + " with " + doors + " doors.");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String brand = sc.next();\n        int doors = sc.nextInt();\n        Car c = new Car(brand, doors);\n        c.drive();\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: 'Tesla 4', expectedOutput: 'Driving Tesla with 4 doors.' },
                { input: 'Porsche 2', expectedOutput: 'Driving Porsche with 2 doors.' }
            ]
        },
        {
            id: 'encapsulation-example',
            number: 44,
            title: 'Bank Account Encapsulation',
            category: 'Object-Oriented Programming',
            difficulty: 'Medium',
            description: 'Implement a <code>BankAccount</code> class with private <code>balance</code>. Provide public methods: <code>deposit(amount)</code>, <code>withdraw(amount)</code>, and <code>getBalance()</code>. Process a sequence of deposit and withdrawal operations.',
            inputFormat: 'Line 1: initialBalance (double). Line 2: depositAmount (double). Line 3: withdrawAmount (double).',
            outputFormat: 'Print final balance formatted to 2 decimals.',
            constraints: 'Amounts >= 0',
            sampleInput: '1000.00 500.00 200.00',
            sampleOutput: 'Balance: $1300.00',
            explanation: '1000 + 500 - 200 = 1300.00.',
            relatedConcepts: ['Access Modifiers', 'Getters & Setters', 'Data Hiding'],
            starterCode: 'import java.util.Scanner;\n\nclass BankAccount {\n    private double balance;\n    \n    public BankAccount(double initial) {\n        this.balance = initial;\n    }\n    public void deposit(double amount) {\n        if (amount > 0) balance += amount;\n    }\n    public void withdraw(double amount) {\n        if (amount > 0 && amount <= balance) balance -= amount;\n    }\n    public double getBalance() {\n        return balance;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        double init = sc.nextDouble();\n        double dep = sc.nextDouble();\n        double with = sc.nextDouble();\n        \n        BankAccount acc = new BankAccount(init);\n        acc.deposit(dep);\n        acc.withdraw(with);\n        System.out.printf("Balance: $%.2f\\n", acc.getBalance());\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '1000.00 500.00 200.00', expectedOutput: 'Balance: $1300.00' }
            ]
        },

        // =========================================================================
        // 12. Exception Handling
        // =========================================================================
        {
            id: 'divide-by-zero-handling',
            number: 45,
            title: 'Safe Integer Division',
            category: 'Exception Handling',
            difficulty: 'Easy',
            description: 'Read two integers <code>a</code> and <code>b</code>. Divide a by b within a <code>try-catch</code> block. If ArithmeticException occurs, print <code>Error: Division by zero is undefined.</code> otherwise print the integer quotient.',
            inputFormat: 'Two space-separated integers a and b.',
            outputFormat: 'Integer quotient or the error message.',
            constraints: '-10^6 <= a, b <= 10^6',
            sampleInput: '10 0',
            sampleOutput: 'Error: Division by zero is undefined.',
            explanation: 'Dividing by zero throws ArithmeticException caught by try-catch.',
            relatedConcepts: ['Try-Catch', 'ArithmeticException', 'Graceful Error Handling'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        \n        try {\n            int res = a / b;\n            System.out.println(res);\n        } catch (ArithmeticException e) {\n            System.out.println("Error: Division by zero is undefined.");\n        }\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '10 0', expectedOutput: 'Error: Division by zero is undefined.' },
                { input: '20 4', expectedOutput: '5' }
            ]
        },
        {
            id: 'custom-exception-age-validator',
            number: 46,
            title: 'Custom InvalidAgeException',
            category: 'Exception Handling',
            difficulty: 'Medium',
            description: 'Define custom exception <code>InvalidAgeException extends Exception</code>. If age < 18, throw the exception and catch it to print <code>Caught: Age must be at least 18</code>, otherwise print <code>Access Granted</code>.',
            inputFormat: 'A single integer age.',
            outputFormat: 'Print <code>Access Granted</code> or <code>Caught: Age must be at least 18</code>.',
            constraints: '0 <= age <= 120',
            sampleInput: '15',
            sampleOutput: 'Caught: Age must be at least 18',
            explanation: '15 is less than 18, triggering the custom exception.',
            relatedConcepts: ['Custom Checked Exceptions', 'throw vs throws', 'Exception Subclassing'],
            starterCode: 'import java.util.Scanner;\n\nclass InvalidAgeException extends Exception {\n    public InvalidAgeException(String msg) {\n        super(msg);\n    }\n}\n\npublic class Main {\n    public static void checkAge(int age) throws InvalidAgeException {\n        if (age < 18) {\n            throw new InvalidAgeException("Age must be at least 18");\n        }\n    }\n    \n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int age = sc.nextInt();\n        try {\n            checkAge(age);\n            System.out.println("Access Granted");\n        } catch (InvalidAgeException e) {\n            System.out.println("Caught: " + e.getMessage());\n        }\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '15', expectedOutput: 'Caught: Age must be at least 18' },
                { input: '21', expectedOutput: 'Access Granted' }
            ]
        },
        {
            id: 'number-format-exception-handling',
            number: 47,
            title: 'Safe String to Integer Parser',
            category: 'Exception Handling',
            difficulty: 'Easy',
            description: 'Given a string <code>S</code>, parse it to an integer using <code>Integer.parseInt</code>. Catch <code>NumberFormatException</code> and print <code>Invalid Integer</code> if parsing fails, else print <code>Parsed: <int></code>.',
            inputFormat: 'A single string S.',
            outputFormat: 'Print <code>Parsed: <int></code> or <code>Invalid Integer</code>.',
            constraints: '1 <= S.length() <= 20',
            sampleInput: 'abc',
            sampleOutput: 'Invalid Integer',
            explanation: '"abc" is not a valid number representation, throwing NumberFormatException.',
            relatedConcepts: ['NumberFormatException', 'Integer.parseInt', 'Defensive Programming'],
            starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        \n        try {\n            int val = Integer.parseInt(s.trim());\n            System.out.println("Parsed: " + val);\n        } catch (NumberFormatException e) {\n            System.out.println("Invalid Integer");\n        }\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: 'abc', expectedOutput: 'Invalid Integer' },
                { input: '1234', expectedOutput: 'Parsed: 1234' }
            ]
        },

        // =========================================================================
        // 13. Collections Basics
        // =========================================================================
        {
            id: 'arraylist-basic-operations',
            number: 48,
            title: 'ArrayList CRUD Operations',
            category: 'Collections Basics',
            difficulty: 'Easy',
            description: 'Read <code>N</code> strings into a <code>java.util.ArrayList</code>. Remove the element at index 0, and print the remaining elements separated by commas.',
            inputFormat: 'Line 1: integer N (N >= 2). Line 2: N space-separated strings.',
            outputFormat: 'Remaining elements separated by <code>, </code>.',
            constraints: '2 <= N <= 100',
            sampleInput: '4\nApple Banana Cherry Date',
            sampleOutput: 'Banana, Cherry, Date',
            explanation: 'Index 0 (Apple) is removed. Remaining are Banana, Cherry, Date.',
            relatedConcepts: ['ArrayList.add', 'ArrayList.remove', 'Collections'],
            starterCode: 'import java.util.Scanner;\nimport java.util.ArrayList;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        ArrayList<String> list = new ArrayList<>();\n        for (int i = 0; i < n; i++) list.add(sc.next());\n        \n        list.remove(0);\n        System.out.println(String.join(", ", list));\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '4\nApple Banana Cherry Date', expectedOutput: 'Banana, Cherry, Date' }
            ]
        },
        {
            id: 'hashmap-frequency-counter',
            number: 49,
            title: 'Word Frequency Counter with Map',
            category: 'Collections Basics',
            difficulty: 'Medium',
            description: 'Read <code>N</code> words and count the occurrences of each word using <code>java.util.LinkedHashMap</code> (preserving insertion order). Print each entry in format: <code><word>=<count></code> on a single line separated by spaces.',
            inputFormat: 'Line 1: integer N. Line 2: N space-separated words.',
            outputFormat: 'Space-separated word=count pairs.',
            constraints: '1 <= N <= 1000',
            sampleInput: '5\napple orange apple banana orange',
            sampleOutput: 'apple=2 orange=2 banana=1',
            explanation: 'apple appears 2 times, orange appears 2 times, banana appears 1 time.',
            relatedConcepts: ['Map Interface', 'LinkedHashMap', 'getOrDefault'],
            starterCode: 'import java.util.Scanner;\nimport java.util.LinkedHashMap;\nimport java.util.Map;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        Map<String, Integer> map = new LinkedHashMap<>();\n        for (int i = 0; i < n; i++) {\n            String w = sc.next();\n            map.put(w, map.getOrDefault(w, 0) + 1);\n        }\n        boolean first = true;\n        for (Map.Entry<String, Integer> entry : map.entrySet()) {\n            if (!first) System.out.print(" ");\n            System.out.print(entry.getKey() + "=" + entry.getValue());\n            first = false;\n        }\n        System.out.println();\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '5\napple orange apple banana orange', expectedOutput: 'apple=2 orange=2 banana=1' }
            ]
        },
        {
            id: 'hashset-duplicate-remover',
            number: 50,
            title: 'Remove Duplicates via HashSet',
            category: 'Collections Basics',
            difficulty: 'Easy',
            description: 'Read <code>N</code> integers. Insert them into a <code>java.util.LinkedHashSet</code> to remove duplicates while preserving first insertion order. Print the unique elements separated by spaces.',
            inputFormat: 'Line 1: integer N. Line 2: N space-separated integers.',
            outputFormat: 'Space-separated unique integers.',
            constraints: '1 <= N <= 10^5',
            sampleInput: '6\n1 2 2 3 1 4',
            sampleOutput: '1 2 3 4',
            explanation: 'Duplicates of 2 and 1 are ignored, maintaining first-seen order.',
            relatedConcepts: ['Set Interface', 'LinkedHashSet', 'Uniqueness Property'],
            starterCode: 'import java.util.Scanner;\nimport java.util.LinkedHashSet;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        LinkedHashSet<Integer> set = new LinkedHashSet<>();\n        for (int i = 0; i < n; i++) set.add(sc.nextInt());\n        \n        boolean first = true;\n        for (int v : set) {\n            if (!first) System.out.print(" ");\n            System.out.print(v);\n            first = false;\n        }\n        System.out.println();\n        sc.close();\n    }\n}',
            previewTestCases: [
                { input: '6\n1 2 2 3 1 4', expectedOutput: '1 2 3 4' }
            ]
        }
    ];

    return {
        CATEGORIES: BASIC_CATEGORIES,
        PROBLEMS: BASIC_PROBLEMS,
        getProblems: function () { return BASIC_PROBLEMS; },
        getCategories: function () { return BASIC_CATEGORIES; },
        getProblemById: function (id) {
            return BASIC_PROBLEMS.find(function (p) { return p.id === id; }) || null;
        }
    };
}));

