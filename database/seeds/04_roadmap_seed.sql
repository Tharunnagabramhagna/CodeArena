-- ============================================================================
-- CodeArena Seed: 04_roadmap_seed.sql
-- Description: Canonical 30 Guided Java Learning Roadmap topics, prerequisite
--              DAG edges, learning objectives, and curated problem mappings.
-- Target Engine: MySQL 8.0+ / InnoDB
-- ============================================================================

USE codearena_db;

SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;

-- ----------------------------------------------------------------------------
-- 1. Insert 30 Roadmap Topics
-- ----------------------------------------------------------------------------
INSERT INTO roadmap_topics (
    id, slug, level_id, sequence_order, title, estimated_hours, summary, core_concepts, code_example
) VALUES
(1, 'intro-to-java', 1, 1, 'Introduction to Java', 2, 'JVM architecture, bytecode compilation, class structure, and console output.', '["Understand the compilation lifecycle from source code (.java) to bytecode (.class) and JVM execution.","Identify the mandatory entrypoint: public static void main(String[] args).","Print formatted text and diagnostics to standard output using System.out.println().","Understand naming conventions for public classes, files, and package declarations."]', 'public class Main {
    public static void main(String[] args) {
        // Canonical first program
        System.out.println("Welcome to CodeArena Java Mastery!");
        
        // JVM runtime details
        String version = System.getProperty("java.version");
        System.out.println("Running on OpenJDK runtime version: " + version);
    }
}'),
(2, 'variables-datatypes', 1, 2, 'Variables and Data Types', 2, 'Primitive types, memory footprint, variable declaration, initialization, and type casting.', '["Distinguish the 8 primitive types: byte, short, int, long, float, double, char, and boolean.","Understand memory footprint, minimum/maximum range limits, and default values.","Perform implicit widening conversions and explicit narrowing type casting safely.","Manage variable scoping within method blocks and avoid uninitialized local variable reads."]', 'public class DataTypesDemo {
    public static void main(String[] args) {
        int count = 42;
        double price = 19.99;
        char grade = ''A'';
        boolean isAvailable = true;
        
        // Explicit narrowing cast
        int truncatedPrice = (int) price;
        
        // Swapping two variables using temporary memory
        int a = 10, b = 25;
        int temp = a;
        a = b;
        b = temp;
        
        System.out.println("Swapped: a = " + a + ", b = " + b);
        System.out.println("Truncated price: " + truncatedPrice);
    }
}'),
(3, 'operators-expressions', 1, 3, 'Operators and Expressions', 2, 'Arithmetic, relational, logical, bitwise, assignment, and ternary operators.', '["Evaluate compound arithmetic expressions respecting operator precedence and associativity.","Apply short-circuit evaluation in logical operators (&& and ||).","Execute bitwise transformations using AND (&), OR (|), XOR (^), and bit shifts (<<, >>).","Write concise conditional assignments using the ternary operator (? :)."]', 'public class OperatorsDemo {
    public static void main(String[] args) {
        int x = 14, y = 5;
        
        System.out.println("Integer division: " + (x / y));     // 2
        System.out.println("Modulo remainder: " + (x % y));     // 4
        
        // Ternary operator: max of two values
        int maxVal = (x > y) ? x : y;
        System.out.println("Maximum: " + maxVal);
        
        // Bitwise XOR swap property
        int bitA = 6;  // 0110 in binary
        int bitB = 3;  // 0011 in binary
        int xorResult = bitA ^ bitB; // 0101 = 5
        System.out.println("Bitwise XOR: " + xorResult);
    }
}'),
(4, 'input-output', 1, 4, 'Input and Output', 2, 'Console input parsing with Scanner, fast streams with BufferedReader, and formatted printing.', '["Read primitive tokens using java.util.Scanner (nextInt(), nextDouble(), nextLine()).","Avoid common newline consumption traps when combining token reads with full line reads.","Produce formatted tabular output with System.out.printf() using specifiers (%d, %f, %s, %n).","Properly close I/O streams to avoid resource leaks."]', 'import java.util.Scanner;

public class InputOutputDemo {
    public static void main(String[] args) {
        String simulatedInput = "CodeArena\\n42\\n99.50\\n";
        Scanner sc = new Scanner(simulatedInput);
        
        String platform = sc.nextLine();
        int rank = sc.nextInt();
        double score = sc.nextDouble();
        
        // Formatted printing with specifiers
        System.out.printf("Platform: %-10s | Rank: #%04d | Score: %.2f%%%n", 
                          platform, rank, score);
        sc.close();
    }
}'),
(5, 'conditionals', 1, 5, 'Conditional Statements', 2, 'Decision making using if, if-else ladders, nested conditions, and switch expressions.', '["Construct multi-way decision trees using if, else if, and else blocks.","Evaluate nested conditions and optimize early-exit branching.","Use switch statements and modern switch expressions with arrow syntax (->).","Correctly identify leap years and handle multiple interdependent constraints."]', 'public class ConditionalsDemo {
    public static void main(String[] args) {
        int year = 2024;
        boolean isLeap = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
        
        if (isLeap) {
            System.out.println(year + " is a Leap Year.");
        } else {
            System.out.println(year + " is not a Leap Year.");
        }
        
        int dayOfWeek = 3;
        String dayType = switch (dayOfWeek) {
            case 1, 2, 3, 4, 5 -> "Weekday";
            case 6, 7 -> "Weekend";
            default -> "Invalid Day";
        };
        System.out.println("Day 3 is a: " + dayType);
    }
}'),
(6, 'loops', 1, 6, 'Loops and Iteration', 2, 'Repetition constructs: for, while, do-while, break, continue, and termination safety.', '["Select the appropriate loop construct based on whether iteration bounds are predetermined or condition-based.","Formulate accurate termination criteria to guarantee convergence and prevent infinite loops.","Differentiate pre-tested loops (for, while) from post-tested loops (do-while).","Control iteration flow using break (early termination) and continue (step skipping)."]', 'public class LoopsDemo {
    public static void main(String[] args) {
        // Calculate factorial of 5
        int n = 5;
        long factorial = 1;
        for (int i = 1; i <= n; i++) {
            factorial *= i;
        }
        System.out.println(n + "! = " + factorial);
        
        // Counting digits with while
        int number = 987654;
        int digitCount = 0;
        int temp = number;
        while (temp > 0) {
            digitCount++;
            temp /= 10;
        }
        System.out.println(number + " has " + digitCount + " digits.");
    }
}'),
(7, 'number-problems', 1, 7, 'Number-Based Problems', 2, 'Digit extraction, primality tests, palindromes, Armstrong numbers, and Euclidean GCD/LCM.', '["Extract individual digits of an integer using modulo (% 10) and integer division (/ 10).","Implement primality testing in O(sqrt(n)) time by examining factors up to the square root.","Reverse integers and determine numerical palindromes without string conversion.","Compute Greatest Common Divisor (GCD) using Euclid''s subtraction/division algorithm."]', 'public class NumberLogicDemo {
    public static void main(String[] args) {
        int num = 29;
        boolean isPrime = num > 1;
        for (int i = 2; i * i <= num; i++) {
            if (num % i == 0) {
                isPrime = false;
                break;
            }
        }
        System.out.println(num + " is prime: " + isPrime);
        
        // Euclidean GCD
        int a = 48, b = 18;
        int x = a, y = b;
        while (y != 0) {
            int rem = x % y;
            x = y;
            y = rem;
        }
        System.out.println("GCD(" + a + ", " + b + ") = " + x);
    }
}'),
(8, 'pattern-programming', 1, 8, 'Pattern Programming', 2, 'Nested loop geometry: stars, triangles, pyramids, numbers, and Floyd patterns.', '["Model 2D geometric matrices using outer row loops (i) and inner column loops (j).","Formulate relationships between row indices and symbol repetitions.","Coordinate leading spaces and trailing symbols to align symmetric pyramids.","Generate consecutive sequence grids such as Floyd''s Triangle."]', 'public class PatternsDemo {
    public static void main(String[] args) {
        int rows = 4;
        
        // Centered pyramid pattern
        for (int i = 1; i <= rows; i++) {
            // Leading spaces
            for (int s = 1; s <= rows - i; s++) {
                System.out.print(" ");
            }
            // Star symbols
            for (int j = 1; j <= (2 * i - 1); j++) {
                System.out.print("*");
            }
            System.out.println();
        }
    }
}'),
(9, 'methods', 2, 9, 'Methods and Modularity', 2, 'Function parameters, return types, pass-by-value semantics, and method overloading.', '["Decompose monolithic procedural code into cohesive, reusable functions.","Understand Java''s strict pass-by-value semantics for both primitive and reference variables.","Implement method overloading by varying parameter counts or data types.","Design clean public application interfaces with clear contracts."]', 'public class MethodsDemo {
    // Method Overloading: Area calculations
    public static double calculateArea(double radius) {
        return Math.PI * radius * radius; // Circle
    }
    
    public static double calculateArea(double length, double width) {
        return length * width; // Rectangle
    }
    
    public static void main(String[] args) {
        double circleArea = calculateArea(5.0);
        double rectArea = calculateArea(4.0, 6.0);
        
        System.out.printf("Circle Area: %.2f%n", circleArea);
        System.out.printf("Rectangle Area: %.2f%n", rectArea);
    }
}'),
(10, 'recursion', 2, 10, 'Recursion and Call Stacks', 2, 'Base cases, recursive breakdown, call stack mechanics, and stack overflow prevention.', '["Identify fundamental recurrence relations and non-negotiable base cases.","Trace execution frames on the JVM method call stack.","Evaluate recursion depth to prevent StackOverflowError on large inputs.","Formulate recursive solutions for factorial, Fibonacci, and digit sums."]', 'public class RecursionDemo {
    // Recursive sum of digits: 1234 -> 1 + 2 + 3 + 4 = 10
    public static int sumOfDigits(int n) {
        if (n == 0) {
            return 0; // Base case
        }
        return (n % 10) + sumOfDigits(n / 10); // Recursive step
    }
    
    public static void main(String[] args) {
        int val = 12345;
        System.out.println("Sum of digits for " + val + " = " + sumOfDigits(val));
    }
}'),
(11, 'arrays', 2, 11, 'Arrays in Java', 2, 'Contiguous memory, 0-based indexing, array traversal, memory bounds, and multi-dimensional matrices.', '["Allocate and initialize fixed-size contiguous memory blocks in heap storage.","Safely navigate array indices within the legal range [0, length - 1].","Perform linear scans, find minimum/maximum elements, and reverse arrays in place.","Manipulate 2D grids (matrices) for coordinate and tabular processing."]', 'public class ArraysDemo {
    public static void main(String[] args) {
        int[] nums = {12, 45, 7, 89, 23};
        
        // Find maximum element
        int maxVal = nums[0];
        int sum = 0;
        for (int x : nums) {
            if (x > maxVal) maxVal = x;
            sum += x;
        }
        
        System.out.println("Maximum: " + maxVal);
        System.out.println("Average: " + ((double) sum / nums.length));
    }
}'),
(12, 'strings', 2, 12, 'Strings and StringBuilder', 2, 'String immutability, the string pool, character manipulation, and efficient buffer mutations.', '["Understand the mechanics of String immutability and the JVM String Constant Pool.","Prevent quadratic O(n^2) time complexity by replacing string concatenation loops with StringBuilder.","Perform character inspection, vowel/consonant classification, and frequency counting.","Validate palindromic strings using character comparisons from both ends."]', 'public class StringsDemo {
    public static void main(String[] args) {
        String original = "CodeArena";
        
        // Efficient reversal via StringBuilder
        StringBuilder sb = new StringBuilder(original);
        String reversed = sb.reverse().toString();
        
        System.out.println("Original: " + original);
        System.out.println("Reversed: " + reversed);
        
        // Case-insensitive palindrome check
        String test = "Radar";
        boolean isPalin = test.equalsIgnoreCase(new StringBuilder(test).reverse().toString());
        System.out.println(test + " is palindrome: " + isPalin);
    }
}'),
(13, 'oop-basics', 2, 13, 'Object-Oriented Programming Basics', 2, 'Classes, objects, instance vs static members, state-behavior modeling, and this reference.', '["Model domain concepts using classes as blueprints and objects as active heap instances.","Differentiate instance variables (per object) from static variables (per class).","Utilize the this keyword to disambiguate field names from parameters.","Create and manage multiple object instances with distinct state."]', 'public class Student {
    private String name;
    private int rollNo;
    private static int totalStudents = 0;
    
    public Student(String name, int rollNo) {
        this.name = name;
        this.rollNo = rollNo;
        totalStudents++;
    }
    
    public void display() {
        System.out.println("Student: " + name + " (Roll #" + rollNo + ")");
    }
    
    public static int getTotalCount() {
        return totalStudents;
    }
    
    public static void main(String[] args) {
        Student s1 = new Student("Alice", 101);
        Student s2 = new Student("Bob", 102);
        
        s1.display();
        s2.display();
        System.out.println("Total enrolled: " + Student.getTotalCount());
    }
}'),
(14, 'constructors-encapsulation', 2, 14, 'Constructors and Encapsulation', 2, 'Constructor initialization, chaining, access modifiers, data hiding, and getters/setters.', '["Implement default, parameterized, and overloaded constructors.","Apply constructor chaining using this() to avoid redundant initialization code.","Enforce strict data hiding by declaring instance variables private.","Author validation logic inside public accessor and mutator methods (getters and setters)."]', 'public class BankAccount {
    private final String accountNumber;
    private double balance;
    
    public BankAccount(String accountNumber, double initialBalance) {
        this.accountNumber = accountNumber;
        this.balance = Math.max(0.0, initialBalance);
    }
    
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }
    
    public boolean withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            return true;
        }
        return false;
    }
    
    public double getBalance() {
        return balance;
    }
    
    public static void main(String[] args) {
        BankAccount acc = new BankAccount("CA-9081", 1000.0);
        acc.deposit(250.0);
        acc.withdraw(100.0);
        System.out.printf("Verified Balance: $%.2f%n", acc.getBalance());
    }
}'),
(15, 'inheritance-polymorphism', 2, 15, 'Inheritance and Polymorphism', 2, 'Class hierarchies with extends, super, method overriding (@Override), and dynamic method dispatch.', '["Derive specialized child classes from common parent classes using extends.","Delegate initialization to parent constructors using super().","Override parent methods with @Override and execute runtime dynamic method dispatch.","Code against parent abstractions rather than concrete subclasses."]', 'class Vehicle {
    protected String brand;
    public Vehicle(String brand) { this.brand = brand; }
    public void start() { System.out.println(brand + " vehicle engine started."); }
}

class Car extends Vehicle {
    private int doors;
    public Car(String brand, int doors) {
        super(brand);
        this.doors = doors;
    }
    @Override
    public void start() {
        System.out.println(brand + " " + doors + "-door car humming smoothly.");
    }
}

public class InheritanceDemo {
    public static void main(String[] args) {
        Vehicle myRide = new Car("CodeArena", 4); // Polymorphic reference
        myRide.start(); // Dynamic dispatch calls Car.start()
    }
}'),
(16, 'exception-handling', 2, 16, 'Exception Handling', 2, 'try, catch, finally, throw, throws, checked vs unchecked exceptions, and custom exceptions.', '["Handle runtime anomalies cleanly using try, catch, and finally blocks.","Differentiate checked exceptions (compile-time enforced) from unchecked RuntimeExceptions.","Author and throw custom domain-specific exceptions extending Exception or RuntimeException.","Ensure critical resources are liberated reliably using try-with-resources."]', 'public class ExceptionDemo {
    public static int safeDivide(int numerator, int denominator) {
        try {
            return numerator / denominator;
        } catch (ArithmeticException ex) {
            System.err.println("Warning: Division by zero caught! Defaulting to 0.");
            return 0;
        } finally {
            System.out.println("safeDivide operation concluded.");
        }
    }
    
    public static void main(String[] args) {
        int res = safeDivide(100, 0);
        System.out.println("Result: " + res);
    }
}'),
(17, 'collections-basics', 2, 17, 'Java Collections Framework Basics', 2, 'Dynamic arrays (ArrayList), unique sets (HashSet), and key-value maps (HashMap).', '["Utilize dynamic resizable arrays with java.util.ArrayList.","Store unique distinct elements and test membership with java.util.HashSet.","Associate keys with values for constant-time lookups using java.util.HashMap.","Iterate through collections cleanly using enhanced for-each loops and Iterators."]', 'import java.util.*;

public class CollectionsDemo {
    public static void main(String[] args) {
        // Word frequency counter
        String[] words = {"java", "arena", "code", "java", "arena", "java"};
        Map<String, Integer> freq = new HashMap<>();
        
        for (String w : words) {
            freq.put(w, freq.getOrDefault(w, 0) + 1);
        }
        
        System.out.println("Frequency map: " + freq);
        
        // Remove duplicates
        Set<String> uniqueWords = new HashSet<>(Arrays.asList(words));
        System.out.println("Unique words: " + uniqueWords.size());
    }
}'),
(18, 'complexity-analysis', 3, 18, 'Time and Space Complexity Analysis', 2, 'Asymptotic notation, Big-O calculation, best/worst/average cases, and auxiliary memory tradeoffs.', '["Compute worst-case Big-O runtime of nested loops, sequential steps, and recursive branches.","Distinguish between auxiliary memory usage and overall space complexity.","Identify performance thresholds: O(1), O(log n), O(n), O(n log n), O(n^2), and O(2^n).","Anticipate code execution runtime against 10^8 operations per second CPU execution limits."]', 'public class ComplexityDemo {
    // O(n) Time | O(1) Auxiliary Space
    public static int linearScan(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) return i;
        }
        return -1;
    }
    
    // O(log n) Time | O(1) Auxiliary Space
    public static int binarySearch(int[] arr, int target) {
        int low = 0, high = arr.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return mid;
            else if (arr[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }
    
    public static void main(String[] args) {
        int[] sorted = {10, 20, 30, 40, 50};
        System.out.println("Index of 40: " + binarySearch(sorted, 40));
    }
}'),
(19, 'arrays-hashing', 3, 19, 'Arrays and Hashing Patterns', 2, 'Constant-time lookups, complement matching, frequency tables, and running prefix sums.', '["Replace quadratic O(n^2) nested lookups with O(n) single-pass hash lookups.","Apply complement arithmetic (target - current) for pair matching problems.","Construct prefix sum arrays for O(1) range sum queries.","Map anagram groupings using canonical sorted keys or frequency signatures."]', 'import java.util.*;

public class TwoSumPattern {
    // O(n) Time | O(n) Space
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
    
    public static void main(String[] args) {
        int[] indices = twoSum(new int[]{2, 7, 11, 15}, 9);
        System.out.println("Pair indices: " + Arrays.toString(indices));
    }
}'),
(20, 'two-pointers', 3, 20, 'Two Pointers Technique', 2, 'Converging pointers, opposite ends, sorted pair searching, and in-place array manipulation.', '["Coordinate two index pointers converging from opposite ends of a sorted array.","Solve target sum and boundary conditions in O(n) time with O(1) auxiliary space.","Implement palindrome verification with non-alphanumeric character filtering.","Calculate trapped water boundaries using bidirectional boundary maximization."]', 'public class TwoPointersDemo {
    // Maximize water container area: O(n) Time | O(1) Space
    public static int maxArea(int[] height) {
        int left = 0, right = height.length - 1;
        int maxWater = 0;
        
        while (left < right) {
            int width = right - left;
            int h = Math.min(height[left], height[right]);
            maxWater = Math.max(maxWater, width * h);
            
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return maxWater;
    }
    
    public static void main(String[] args) {
        int[] heights = {1, 8, 6, 2, 5, 4, 8, 3, 7};
        System.out.println("Max Water Area: " + maxArea(heights));
    }
}'),
(21, 'sliding-window', 3, 21, 'Sliding Window', 2, 'Fixed and dynamically resizable contiguous subarrays with incremental state maintenance.', '["Maintain running aggregate state across contiguous subarray windows without recalculating from scratch.","Apply fixed-size sliding windows for maximum/minimum average subarray calculations.","Construct dynamic variable-size windows using right-expansion and left-contraction loops.","Achieve linear O(n) time for substring search and minimum window constraints."]', 'public class SlidingWindowDemo {
    // Maximum sum of subarray of fixed size k: O(n) Time | O(1) Space
    public static int maxSubarraySum(int[] nums, int k) {
        int currentSum = 0;
        for (int i = 0; i < k; i++) {
            currentSum += nums[i];
        }
        int maxSum = currentSum;
        
        for (int i = k; i < nums.length; i++) {
            currentSum += nums[i] - nums[i - k]; // Slide window
            maxSum = Math.max(maxSum, currentSum);
        }
        return maxSum;
    }
    
    public static void main(String[] args) {
        int[] arr = {2, 1, 5, 1, 3, 2};
        System.out.println("Max window sum (k=3): " + maxSubarraySum(arr, 3));
    }
}'),
(22, 'linked-lists', 3, 22, 'Linked Lists', 2, 'Singly and doubly linked lists, pointer manipulation, dummy head sentinels, reversal, and cycle finding.', '["Safely manipulate dynamic node references without losing connections or causing memory leaks.","Employ dummy head sentinel nodes to eliminate special cases for head insertions and deletions.","Reverse singly linked lists iteratively in O(n) time with O(1) auxiliary space.","Detect cycles and locate loop entrypoints using Floyd''s Fast and Slow Pointer algorithm."]', 'class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

public class LinkedListDemo {
    // In-place iterative reversal: O(n) Time | O(1) Space
    public static ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode nextTemp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextTemp;
        }
        return prev;
    }
    
    public static void main(String[] args) {
        ListNode n1 = new ListNode(1);
        n1.next = new ListNode(2);
        n1.next.next = new ListNode(3);
        
        ListNode rev = reverseList(n1);
        System.out.print("Reversed list: ");
        while (rev != null) {
            System.out.print(rev.val + (rev.next != null ? " -> " : "\\n"));
            rev = rev.next;
        }
    }
}'),
(23, 'stacks-queues', 3, 23, 'Stacks and Queues', 2, 'LIFO and FIFO mechanics, balanced parentheses, monotonic stacks, and queue simulations.', '["Enforce Last-In First-Out (LIFO) and First-In First-Out (FIFO) semantics strictly.","Validate nested matched parentheses and expression grammars.","Construct monotonic increasing/decreasing stacks to solve Next Greater Element in linear O(n) time.","Simulate queues using two stacks and optimize amortized push/pop costs."]', 'import java.util.*;

public class StackDemo {
    // Valid parentheses check: O(n) Time | O(n) Space
    public static boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == ''('') stack.push('')'');
            else if (c == ''{'') stack.push(''}'');
            else if (c == ''['') stack.push('']'');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
    
    public static void main(String[] args) {
        System.out.println("()[]{} is valid: " + isValid("()[]{}"));
        System.out.println("([)] is valid: " + isValid("([)]"));
    }
}'),
(24, 'binary-search', 3, 24, 'Binary Search', 2, 'Divide and conquer on sorted ranges, boundary detection, rotated arrays, and binary search on answer spaces.', '["Halve search spaces reliably in logarithmic O(log n) time.","Prevent integer arithmetic overflow using mid = low + (high - low) / 2.","Pinpoint lower and upper bounds (first/last occurrences of duplicated elements).","Apply binary search across monotonic answer spaces (e.g. rate or capacity thresholds)."]', 'public class BinarySearchDemo {
    // Search Insert Position: O(log n) Time | O(1) Space
    public static int searchInsert(int[] nums, int target) {
        int low = 0, high = nums.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return low; // Target insertion point
    }
    
    public static void main(String[] args) {
        int[] arr = {1, 3, 5, 6};
        System.out.println("Insert 5 at: " + searchInsert(arr, 5));
        System.out.println("Insert 2 at: " + searchInsert(arr, 2));
    }
}'),
(25, 'trees-bst', 3, 25, 'Trees and Binary Search Trees', 2, 'Hierarchical node models, DFS traversals, BFS level-order scans, BST invariants, and LCA.', '["Implement recursive DFS traversals: pre-order, in-order, and post-order.","Execute breadth-first search (BFS) level-order scans using Queue data structures.","Validate and preserve Binary Search Tree (BST) ordering invariants: left < node < right.","Compute tree height, diameter, balance status, and Lowest Common Ancestors."]', 'class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

public class TreeDemo {
    // Invert Binary Tree: O(n) Time | O(h) Space
    public static TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        TreeNode temp = root.left;
        root.left = invertTree(root.right);
        root.right = invertTree(temp);
        return root;
    }
    
    public static void printInOrder(TreeNode root) {
        if (root == null) return;
        printInOrder(root.left);
        System.out.print(root.val + " ");
        printInOrder(root.right);
    }
    
    public static void main(String[] args) {
        TreeNode root = new TreeNode(4);
        root.left = new TreeNode(2);
        root.right = new TreeNode(7);
        
        System.out.print("In-order before invert: ");
        printInOrder(root);
        System.out.println();
        
        invertTree(root);
        System.out.print("In-order after invert: ");
        printInOrder(root);
        System.out.println();
    }
}'),
(26, 'heaps-priority-queues', 3, 26, 'Heaps and Priority Queues', 2, 'Complete binary trees, min/max heap properties, PriorityQueue API, Top-K elements, and stream medians.', '["Understand binary heap representation in contiguous arrays (parent at i/2, children at 2i and 2i+1).","Instantiate Java PriorityQueue with natural ordering (min-heap) and custom Comparators (max-heap).","Solve Top-K frequent/largest element problems in O(n log k) time using bounded size heaps.","Balance two heaps simultaneously to compute running medians from dynamic input streams."]', 'import java.util.*;

public class HeapDemo {
    // Kth largest element using bounded min-heap: O(n log k) Time | O(k) Space
    public static int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> minHeap = new PriorityQueue<>(k);
        for (int num : nums) {
            minHeap.offer(num);
            if (minHeap.size() > k) {
                minHeap.poll(); // Evict smallest element
            }
        }
        return minHeap.peek();
    }
    
    public static void main(String[] args) {
        int[] arr = {3, 2, 1, 5, 6, 4};
        System.out.println("2nd largest element: " + findKthLargest(arr, 2));
    }
}'),
(27, 'graphs', 3, 27, 'Graphs and Traversals', 2, 'Adjacency lists, BFS shortest paths, DFS connectivity, island flood-fills, and cycle detection.', '["Represent directed and undirected graphs using Adjacency Lists and 2D Grids.","Implement BFS with a visited set to find shortest paths in unweighted graphs.","Apply DFS flood-fill algorithms to identify and count connected components (island sinking).","Detect cycles in directed and undirected graphs, and compute topological sorts."]', 'public class GraphDemo {
    // DFS Flood-Fill: Sink Island
    public static void dfsSink(char[][] grid, int r, int c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != ''1'') {
            return;
        }
        grid[r][c] = ''0''; // Mark visited (sink)
        dfsSink(grid, r + 1, c);
        dfsSink(grid, r - 1, c);
        dfsSink(grid, r, c + 1);
        dfsSink(grid, r, c - 1);
    }
    
    public static int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int count = 0;
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == ''1'') {
                    count++;
                    dfsSink(grid, r, c);
                }
            }
        }
        return count;
    }
    
    public static void main(String[] args) {
        char[][] map = {
            {''1'', ''1'', ''0''},
            {''1'', ''0'', ''0''},
            {''0'', ''0'', ''1''}
        };
        System.out.println("Total Islands: " + numIslands(map));
    }
}'),
(28, 'backtracking', 3, 28, 'Backtracking', 2, 'Decision state-space trees, choice-constraint-goal paradigm, pruning, subsets, and permutations.', '["Systematically traverse state-space decision trees using the choose-explore-unchoose pattern.","Prune unviable branches early by asserting constraints before recursive calls.","Generate power sets (subsets), permutations, and combinations of collections.","Solve constraint satisfaction problems such as N-Queens and Word Search."]', 'import java.util.*;

public class BacktrackingDemo {
    // Generate all subsets: O(2^n) Time | O(n) Recursion Depth
    public static void generateSubsets(int[] nums, int index, List<Integer> current, List<List<Integer>> result) {
        result.add(new ArrayList<>(current));
        for (int i = index; i < nums.length; i++) {
            current.add(nums[i]); // Choose
            generateSubsets(nums, i + 1, current, result); // Explore
            current.remove(current.size() - 1); // Unchoose (backtrack)
        }
    }
    
    public static void main(String[] args) {
        List<List<Integer>> subsets = new ArrayList<>();
        generateSubsets(new int[]{1, 2}, 0, new ArrayList<>(), subsets);
        System.out.println("Subsets of [1, 2]: " + subsets);
    }
}'),
(29, 'dynamic-programming', 3, 29, 'Dynamic Programming', 2, 'Overlapping subproblems, optimal substructure, memoization, tabulation, 1D/2D DP, and knapsacks.', '["Recognize problems with overlapping subproblems and optimal substructure properties.","Convert exponential recursive algorithms into polynomial time via Top-Down Memoization.","Formulate iterative Bottom-Up Tabulation state transitions dp[i].","Optimize space complexity from O(n) to O(1) by maintaining rolling state variables."]', 'public class DPDemo {
    // Climbing Stairs: dp[i] = dp[i-1] + dp[i-2] with O(1) Space
    public static int climbStairs(int n) {
        if (n <= 2) return n;
        int prev2 = 1, prev1 = 2;
        for (int i = 3; i <= n; i++) {
            int current = prev1 + prev2;
            prev2 = prev1;
            prev1 = current;
        }
        return prev1;
    }
    
    public static void main(String[] args) {
        System.out.println("Ways to climb 5 stairs: " + climbStairs(5));
    }
}'),
(30, 'greedy-algorithms', 3, 30, 'Greedy Algorithms', 2, 'Locally optimal choices, greedy choice property, interval scheduling, and sorting-based strategies.', '["Evaluate whether locally optimal choices guarantee a globally optimal solution.","Sort intervals by end times to solve Activity Selection and Non-Overlapping intervals.","Analyze greedy exchange arguments to mathematically prove algorithm correctness.","Solve greedy resource allocation and capacity-constrained tasks."]', 'import java.util.*;

public class GreedyDemo {
    // Non-overlapping intervals: Maximize retained intervals
    public static int eraseOverlapIntervals(int[][] intervals) {
        if (intervals.length == 0) return 0;
        // Sort by end time
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
        
        int removals = 0;
        int end = intervals[0][1];
        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] < end) {
                removals++; // Overlap detected; remove current interval
            } else {
                end = intervals[i][1]; // Advance boundary
            }
        }
        return removals;
    }
    
    public static void main(String[] args) {
        int[][] intervals = {{1, 2}, {2, 3}, {3, 4}, {1, 3}};
        System.out.println("Minimum intervals to erase: " + eraseOverlapIntervals(intervals));
    }
}')
ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    level_id = VALUES(level_id),
    sequence_order = VALUES(sequence_order),
    estimated_hours = VALUES(estimated_hours),
    summary = VALUES(summary),
    core_concepts = VALUES(core_concepts),
    code_example = VALUES(code_example);

-- ----------------------------------------------------------------------------
-- 2. Insert Roadmap Prerequisite DAG Edges
-- ----------------------------------------------------------------------------
INSERT INTO roadmap_prerequisites (topic_id, prerequisite_topic_id) VALUES
(2, 1),
(3, 2),
(4, 2),
(4, 3),
(5, 3),
(5, 4),
(6, 5),
(7, 6),
(8, 6),
(9, 7),
(10, 9),
(11, 9),
(11, 6),
(12, 11),
(13, 9),
(14, 13),
(15, 14),
(16, 13),
(17, 13),
(17, 11),
(18, 6),
(18, 10),
(18, 11),
(19, 18),
(19, 17),
(20, 18),
(20, 11),
(20, 12),
(21, 20),
(21, 19),
(22, 18),
(22, 13),
(23, 18),
(23, 11),
(24, 18),
(24, 11),
(25, 10),
(25, 23),
(26, 25),
(26, 18),
(27, 23),
(27, 25),
(27, 17),
(28, 10),
(29, 10),
(29, 11),
(30, 18),
(30, 11)
ON DUPLICATE KEY UPDATE topic_id = VALUES(topic_id);

-- ----------------------------------------------------------------------------
-- 3. Insert Curated Problem Mappings for Roadmap Topics
-- ----------------------------------------------------------------------------
INSERT INTO roadmap_topic_problems (topic_id, problem_id, sequence_order) VALUES
(1, 1, 1),
(2, 2, 1),
(2, 3, 2),
(3, 8, 1),
(3, 9, 2),
(3, 10, 3),
(4, 5, 1),
(4, 6, 2),
(4, 7, 3),
(5, 11, 1),
(5, 12, 2),
(5, 13, 3),
(5, 14, 4),
(6, 15, 1),
(6, 16, 2),
(6, 17, 3),
(6, 18, 4),
(7, 19, 1),
(7, 20, 2),
(7, 21, 3),
(7, 22, 4),
(7, 23, 5),
(7, 24, 6),
(8, 25, 1),
(8, 26, 2),
(8, 27, 3),
(8, 28, 4),
(9, 37, 1),
(9, 4, 2),
(10, 38, 1),
(10, 39, 2),
(10, 40, 3),
(10, 179, 4),
(10, 180, 5),
(10, 277, 6),
(11, 29, 1),
(11, 30, 2),
(11, 31, 3),
(11, 32, 4),
(11, 101, 5),
(11, 102, 6),
(11, 255, 7),
(12, 33, 1),
(12, 34, 2),
(12, 35, 3),
(12, 36, 4),
(12, 117, 5),
(12, 118, 6),
(12, 261, 7),
(13, 41, 1),
(14, 42, 1),
(14, 44, 2),
(15, 43, 1),
(16, 45, 1),
(16, 46, 2),
(16, 47, 3),
(17, 48, 1),
(17, 49, 2),
(17, 50, 3),
(17, 138, 4),
(17, 265, 5),
(18, 113, 1),
(18, 114, 2),
(19, 103, 1),
(19, 138, 2),
(19, 135, 3),
(19, 132, 4),
(19, 109, 5),
(20, 104, 1),
(20, 120, 2),
(20, 144, 3),
(20, 105, 4),
(21, 107, 1),
(21, 108, 2),
(21, 122, 3),
(21, 123, 4),
(21, 124, 5),
(22, 146, 1),
(22, 149, 2),
(22, 154, 3),
(22, 156, 4),
(22, 270, 5),
(23, 161, 1),
(23, 158, 2),
(23, 159, 3),
(23, 160, 4),
(23, 166, 5),
(24, 170, 1),
(24, 172, 2),
(24, 173, 3),
(24, 174, 4),
(24, 176, 5),
(25, 190, 1),
(25, 191, 2),
(25, 193, 3),
(25, 201, 4),
(25, 196, 5),
(26, 204, 1),
(26, 205, 2),
(26, 208, 3),
(26, 210, 4),
(27, 212, 1),
(27, 213, 2),
(27, 215, 3),
(27, 220, 4),
(27, 224, 5),
(28, 181, 1),
(28, 183, 2),
(28, 185, 3),
(28, 187, 4),
(28, 188, 5),
(29, 237, 1),
(29, 238, 2),
(29, 241, 3),
(29, 246, 4),
(29, 248, 5),
(30, 229, 1),
(30, 226, 2),
(30, 235, 3),
(30, 231, 4),
(30, 233, 5)
ON DUPLICATE KEY UPDATE sequence_order = VALUES(sequence_order);
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
