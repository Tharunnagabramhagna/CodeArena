-- ============================================================================
-- CodeArena Seed: 02_basic_problems_seed.sql
-- Description: Canonical 50 Basic Java problems, starter code, sample test cases,
--              constraints, and concept tags from frontend/js/basic_problems_data.js.
-- Target Engine: MySQL 8.0+ / InnoDB
-- ============================================================================

USE codearena_db;

SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;

-- ----------------------------------------------------------------------------
-- 1. Insert 50 Basic Problems (IDs 1..50)
-- ----------------------------------------------------------------------------
INSERT INTO problems (
    id, track_id, category_id, difficulty_id, canonical_id, slug,
    problem_number, title, description, input_format, output_format,
    constraints, explanation, starter_code, is_premium, is_active,
    time_limit_ms, memory_limit_mb
) VALUES
(1, 1, 1, 1, 'hello-world', 'hello-world', 1, 'Hello World', 'Write a Java program that outputs the canonical greeting <code>Hello, World!</code> to standard output.', 'No input provided.', 'Print <code>Hello, World!</code> followed by a newline.', 'None.', 'In Java, standard console output is accomplished using System.out.println().', 'public class Main {
    public static void main(String[] args) {
        // Print Hello, World! below
        
    }
}', FALSE, TRUE, 2000, 256),
(2, 1, 1, 1, 'swap-two-numbers', 'swap-two-numbers', 2, 'Swap Two Numbers', 'Given two integers <code>a</code> and <code>b</code> from standard input, swap their values and print the swapped pair separated by a space.', 'Two space-separated integers a and b.', 'Print swapped integers <code>b a</code> separated by a space.', '-10^4 <= a, b <= 10^4', 'A temporary variable holds value a while b is assigned to a, then the temporary value is assigned to b.', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        
        // Swap a and b here
        
        System.out.println(a + " " + b);
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(3, 1, 1, 1, 'celsius-to-fahrenheit', 'celsius-to-fahrenheit', 3, 'Celsius to Fahrenheit', 'Convert a given temperature in Celsius <code>C</code> to Fahrenheit using the formula <code>F = (C * 9/5) + 32</code>. Print the result rounded to 2 decimal places.', 'A double representing Celsius temperature.', 'A double formatted to 2 decimal places.', '-273.15 <= C <= 1000.0', '(25.0 * 9 / 5) + 32 = 45.0 + 32 = 77.00', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double c = sc.nextDouble();
        
        // Compute Fahrenheit here
        
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(4, 1, 1, 1, 'simple-interest-calculator', 'simple-interest-calculator', 4, 'Simple Interest Calculator', 'Compute the Simple Interest given Principal <code>P</code>, Rate <code>R</code> (in %), and Time <code>T</code> (in years). Formula: <code>SI = (P * R * T) / 100</code>.', 'Three space-separated numbers: P (double), R (double), and T (double).', 'Print Simple Interest formatted to 2 decimal places.', '1 <= P <= 10^7, 0.1 <= R <= 100.0, 0.1 <= T <= 50.0', 'SI = (10000 * 5 * 2) / 100 = 1000.00', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double p = sc.nextDouble();
        double r = sc.nextDouble();
        double t = sc.nextDouble();
        
        double si = (p * r * t) / 100.0;
        System.out.printf("%.2f\\n", si);
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(5, 1, 2, 1, 'read-and-print-user-details', 'read-and-print-user-details', 5, 'Read and Print User Details', 'Read a user''s name (String), age (int), and GPA (double) from standard input. Output them in the format: <code>Name: <name>, Age: <age>, GPA: <gpa></code>.', 'Three lines: String name, int age, double gpa.', 'Print formatted profile string with GPA to 2 decimal places.', 'Name contains letters only. 1 <= age <= 120. 0.0 <= gpa <= 4.0.', 'Read using sc.nextLine(), sc.nextInt(), sc.nextDouble().', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.nextLine();
        int age = sc.nextInt();
        double gpa = sc.nextDouble();
        
        System.out.printf("Name: %s, Age: %d, GPA: %.2f\\n", name, age, gpa);
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(6, 1, 2, 1, 'sum-of-two-numbers', 'sum-of-two-numbers', 6, 'Sum of Two Numbers', 'Given two integers <code>A</code> and <code>B</code>, calculate and print their sum.', 'Two space-separated integers A and B.', 'Single integer representing A + B.', '-10^9 <= A, B <= 10^9', '15 + 27 = 42.', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long a = sc.nextLong();
        long b = sc.nextLong();
        System.out.println(a + b);
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(7, 1, 2, 2, 'formatted-receipt-printer', 'formatted-receipt-printer', 7, 'Formatted Receipt Printer', 'Read an item name (String), quantity (int), and price per unit (double). Output a formatted line showing: <code>Item: <name> | Qty: <qty> | Total: $<total></code> (total formatted to 2 decimal places).', 'One line containing: String itemName, int qty, double price.', 'Formatted receipt line.', '1 <= qty <= 1000, 0.01 <= price <= 10000.0', '3 units at $4.50 = $13.50.', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String item = sc.next();
        int qty = sc.nextInt();
        double price = sc.nextDouble();
        
        double total = qty * price;
        System.out.printf("Item: %s | Qty: %d | Total: $%.2f\\n", item, qty, total);
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(8, 1, 3, 1, 'arithmetic-operations', 'arithmetic-operations', 8, 'Arithmetic Operations', 'Read two positive integers <code>a</code> and <code>b</code>. Print on separate lines their: Sum, Difference (a - b), Product, Quotient (a / b integer division), and Remainder (a % b).', 'Two space-separated positive integers a and b.', 'Five lines corresponding to: +, -, *, /, %.', '1 <= a, b <= 10^5', '8+3=11, 8-3=5, 8*3=24, 8/3=2, 8%3=2.', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        
        System.out.println(a + b);
        System.out.println(a - b);
        System.out.println(a * b);
        System.out.println(a / b);
        System.out.println(a % b);
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(9, 1, 3, 2, 'bitwise-operators-demo', 'bitwise-operators-demo', 9, 'Bitwise AND, OR, and XOR', 'Given two integers <code>a</code> and <code>b</code>, print the result of bitwise operations on separate lines: <code>a & b</code>, <code>a | b</code>, and <code>a ^ b</code>.', 'Two space-separated non-negative integers a and b.', 'Three lines representing bitwise AND, OR, and XOR.', '0 <= a, b <= 10^6', '5 (101) & 3 (011) = 1 (001). 5 | 3 = 7 (111). 5 ^ 3 = 6 (110).', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        
        System.out.println(a & b);
        System.out.println(a | b);
        System.out.println(a ^ b);
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(10, 1, 3, 1, 'ternary-operator-maximum', 'ternary-operator-maximum', 10, 'Maximum of Two via Ternary', 'Given two integers <code>a</code> and <code>b</code>, find and print the maximum value using the Java ternary operator <code>? :</code>.', 'Two space-separated integers a and b.', 'Print the larger of the two integers.', '-10^6 <= a, b <= 10^6', '14 < 29, so ternary condition evaluates to 29.', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        
        int max = (a >= b) ? a : b;
        System.out.println(max);
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(11, 1, 4, 1, 'even-or-odd', 'even-or-odd', 11, 'Even or Odd', 'Given an integer <code>n</code>, print <code>Even</code> if the number is divisible by 2, or <code>Odd</code> otherwise.', 'A single integer n.', 'Print <code>Even</code> or <code>Odd</code>.', '-10^9 <= n <= 10^9', '7 % 2 != 0, so the number is Odd.', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        if (n % 2 == 0) {
            System.out.println("Even");
        } else {
            System.out.println("Odd");
        }
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(12, 1, 4, 1, 'largest-of-three-numbers', 'largest-of-three-numbers', 12, 'Largest of Three Numbers', 'Given three distinct integers <code>a</code>, <code>b</code>, and <code>c</code>, determine and print the largest among them.', 'Three space-separated integers a, b, and c.', 'Print the maximum integer.', '-10^6 <= a, b, c <= 10^6', '45 is greater than both 12 and 32.', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        
        int max = a;
        if (b > max) max = b;
        if (c > max) max = c;
        
        System.out.println(max);
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(13, 1, 4, 2, 'leap-year-checker', 'leap-year-checker', 13, 'Leap Year Checker', 'Determine whether a given year <code>Y</code> is a leap year. A year is a leap year if it is divisible by 4, except for century years which must be divisible by 400. Print <code>Leap Year</code> or <code>Not Leap Year</code>.', 'A single positive integer Y.', 'Print <code>Leap Year</code> or <code>Not Leap Year</code>.', '1 <= Y <= 9999', '2024 is divisible by 4 and not a century year, hence a leap year.', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int year = sc.nextInt();
        
        boolean isLeap = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
        if (isLeap) {
            System.out.println("Leap Year");
        } else {
            System.out.println("Not Leap Year");
        }
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(14, 1, 4, 1, 'grade-calculator', 'grade-calculator', 14, 'Grade Calculator', 'Read an integer score <code>M</code> (0 to 100). Output the letter grade: 90-100: A, 80-89: B, 70-79: C, 60-69: D, <60: F.', 'A single integer M.', 'A single character grade (A, B, C, D, or F).', '0 <= M <= 100', '85 falls in the 80-89 range, so grade is B.', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int score = sc.nextInt();
        
        if (score >= 90) System.out.println("A");
        else if (score >= 80) System.out.println("B");
        else if (score >= 70) System.out.println("C");
        else if (score >= 60) System.out.println("D");
        else System.out.println("F");
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(15, 1, 5, 1, 'multiplication-table', 'multiplication-table', 15, 'Multiplication Table', 'Given an integer <code>N</code>, print its multiplication table from 1 to 10 in the format: <code>N x i = <result></code>.', 'A single positive integer N.', '10 lines showing multiplication table products.', '1 <= N <= 1000', 'Iterate from i = 1 to 10 and print N * i.', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        for (int i = 1; i <= 10; i++) {
            System.out.println(n + " x " + i + " = " + (n * i));
        }
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(16, 1, 5, 1, 'sum-of-first-n-numbers', 'sum-of-first-n-numbers', 16, 'Sum of First N Natural Numbers', 'Compute and print the sum of the first <code>N</code> positive integers: <code>1 + 2 + ... + N</code>.', 'A single positive integer N.', 'Print the total sum.', '1 <= N <= 10^5', 'Sum = 1+2+3+4+5+6+7+8+9+10 = 55.', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        
        long sum = 0;
        for (long i = 1; i <= n; i++) {
            sum += i;
        }
        System.out.println(sum);
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(17, 1, 5, 1, 'factorial-of-a-number', 'factorial-of-a-number', 17, 'Factorial of a Number', 'Given an integer <code>N</code>, compute its factorial <code>N!</code>. Note that 0! = 1.', 'A non-negative integer N.', 'Print N! as a long integer.', '0 <= N <= 20', '5! = 5 * 4 * 3 * 2 * 1 = 120.', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        long fact = 1;
        for (int i = 2; i <= n; i++) {
            fact *= i;
        }
        System.out.println(fact);
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(18, 1, 5, 1, 'count-digits-in-number', 'count-digits-in-number', 18, 'Count Digits in an Integer', 'Given an integer <code>N</code>, count and print the total number of digits in N. For 0, the digit count is 1.', 'A single integer N.', 'Total number of digits.', '-10^18 <= N <= 10^18', '12345 has 5 digits.', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = Math.abs(sc.nextLong());
        
        if (n == 0) {
            System.out.println(1);
        } else {
            int count = 0;
            while (n > 0) {
                count++;
                n /= 10;
            }
            System.out.println(count);
        }
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(19, 1, 6, 2, 'prime-number-checker', 'prime-number-checker', 19, 'Prime Number Checker', 'Determine whether a given positive integer <code>N</code> is prime. Print <code>Prime</code> or <code>Not Prime</code>.', 'A single positive integer N.', 'Print <code>Prime</code> or <code>Not Prime</code>.', '1 <= N <= 10^9', '17 is only divisible by 1 and 17.', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        
        if (n <= 1) {
            System.out.println("Not Prime");
            sc.close();
            return;
        }
        boolean isPrime = true;
        for (long i = 2; i * i <= n; i++) {
            if (n % i == 0) {
                isPrime = false;
                break;
            }
        }
        System.out.println(isPrime ? "Prime" : "Not Prime");
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(20, 1, 6, 2, 'fibonacci-series', 'fibonacci-series', 20, 'Fibonacci Sequence Generator', 'Generate the first <code>N</code> terms of the Fibonacci sequence starting with 0 and 1. Print the sequence separated by spaces.', 'A positive integer N (number of terms).', 'First N Fibonacci numbers separated by spaces.', '1 <= N <= 40', '0, 1, 0+1=1, 1+1=2, 1+2=3, 2+3=5, 3+5=8.', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        long a = 0, b = 1;
        for (int i = 0; i < n; i++) {
            System.out.print(a + (i == n - 1 ? "" : " "));
            long next = a + b;
            a = b;
            b = next;
        }
        System.out.println();
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(21, 1, 6, 1, 'reverse-a-number', 'reverse-a-number', 21, 'Reverse a Number', 'Given a non-negative integer <code>N</code>, reverse its digits mathematically and print the resulting number.', 'A non-negative integer N.', 'The reversed integer.', '0 <= N <= 10^9', '1234 reversed is 4321.', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        int rev = 0;
        while (n > 0) {
            rev = rev * 10 + (n % 10);
            n /= 10;
        }
        System.out.println(rev);
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(22, 1, 6, 1, 'number-palindrome', 'number-palindrome', 22, 'Palindrome Number Checker', 'Determine if an integer <code>N</code> is a palindrome (reads identically forwards and backwards). Print <code>Palindrome</code> or <code>Not Palindrome</code>.', 'An integer N.', 'Print <code>Palindrome</code> or <code>Not Palindrome</code>.', '0 <= N <= 10^9', '1221 backwards is 1221.', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        int original = n;
        int rev = 0;
        while (n > 0) {
            rev = rev * 10 + (n % 10);
            n /= 10;
        }
        System.out.println(original == rev ? "Palindrome" : "Not Palindrome");
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(23, 1, 6, 2, 'armstrong-number', 'armstrong-number', 23, 'Armstrong Number Validator', 'An Armstrong number of <code>k</code> digits is an integer such that the sum of its digits raised to the power of k equals the number itself. Determine if N is an Armstrong number.', 'A non-negative integer N.', 'Print <code>Armstrong</code> or <code>Not Armstrong</code>.', '0 <= N <= 10^7', '153 has 3 digits: 1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153.', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        int temp = n;
        int digits = String.valueOf(n).length();
        int sum = 0;
        while (temp > 0) {
            int d = temp % 10;
            sum += Math.pow(d, digits);
            temp /= 10;
        }
        System.out.println(sum == n ? "Armstrong" : "Not Armstrong");
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(24, 1, 6, 2, 'gcd-and-lcm', 'gcd-and-lcm', 24, 'GCD and LCM of Two Numbers', 'Given two integers <code>A</code> and <code>B</code>, compute their Greatest Common Divisor (GCD) and Least Common Multiple (LCM). Print GCD and LCM separated by a space.', 'Two space-separated positive integers A and B.', 'Print <code><GCD> <LCM></code> on a single line.', '1 <= A, B <= 10^6', 'GCD(12, 18) = 6. LCM(12, 18) = (12 * 18) / 6 = 36.', 'import java.util.Scanner;

public class Main {
    public static long gcd(long a, long b) {
        while (b != 0) {
            long t = b;
            b = a % b;
            a = t;
        }
        return a;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long a = sc.nextLong();
        long b = sc.nextLong();
        
        long g = gcd(a, b);
        long l = (a * b) / g;
        System.out.println(g + " " + l);
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(25, 1, 7, 1, 'right-triangle-star-pattern', 'right-triangle-star-pattern', 25, 'Right Triangle Star Pattern', 'Print a right-angled triangle pattern of asterisks <code>*</code> of height <code>N</code>, where the i-th row contains i asterisks.', 'A single positive integer N.', 'N lines representing the star pattern.', '1 <= N <= 20', 'Row 1 has 1 star, row 2 has 2 stars, up to row 4 with 4 stars.', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print("*");
            }
            System.out.println();
        }
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(26, 1, 7, 1, 'inverted-triangle-pattern', 'inverted-triangle-pattern', 26, 'Inverted Triangle Pattern', 'Print an inverted triangle of asterisks of height <code>N</code>. Row 1 has N stars, row 2 has N-1 stars, down to 1 star.', 'A positive integer N.', 'N lines representing the inverted triangle.', '1 <= N <= 20', 'Row 1 has 3 stars, row 2 has 2, row 3 has 1.', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        for (int i = n; i >= 1; i--) {
            for (int j = 1; j <= i; j++) {
                System.out.print("*");
            }
            System.out.println();
        }
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(27, 1, 7, 2, 'number-pyramid', 'number-pyramid', 27, 'Number Pyramid', 'Print a number pyramid of height <code>N</code>. In row <code>i</code>, print numbers from 1 to i separated by a space.', 'A single positive integer N.', 'N lines showing increasing number sequence.', '1 <= N <= 15', 'Each line prints numbers from 1 up to current line number.', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print(j + (j == i ? "" : " "));
            }
            System.out.println();
        }
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(28, 1, 7, 2, 'floyds-triangle', 'floyds-triangle', 28, 'Floyd''s Triangle', 'Print Floyd''s Triangle of <code>N</code> rows, filled with consecutive natural numbers starting from 1.', 'A single positive integer N.', 'N lines showing Floyd''s Triangle.', '1 <= N <= 10', 'Numbers increment continually across rows: row 1 (1), row 2 (2 3), row 3 (4 5 6), row 4 (7 8 9 10).', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        int num = 1;
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print(num + (j == i ? "" : " "));
                num++;
            }
            System.out.println();
        }
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(29, 1, 8, 1, 'array-sum-and-average', 'array-sum-and-average', 29, 'Array Sum and Average', 'Read an array of <code>N</code> integers. Calculate and print the sum and average (rounded to 2 decimal places) on separate lines.', 'First line: integer N. Second line: N space-separated integers.', 'Line 1: Sum. Line 2: Average formatted to 2 decimals.', '1 <= N <= 10^5, -10^4 <= elements <= 10^4', 'Sum = 150. Average = 150 / 5 = 30.00.', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long sum = 0;
        for (int i = 0; i < n; i++) {
            sum += sc.nextInt();
        }
        double avg = (double) sum / n;
        System.out.println(sum);
        System.out.printf("%.2f\\n", avg);
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(30, 1, 8, 1, 'find-maximum-and-minimum', 'find-maximum-and-minimum', 30, 'Find Maximum and Minimum in Array', 'Given an array of <code>N</code> integers, find and print the maximum and minimum elements separated by a space.', 'First line: integer N. Second line: N space-separated integers.', 'Print <code><max> <min></code>.', '1 <= N <= 10^5, -10^9 <= elements <= 10^9', 'Max element is 9, min element is 1.', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int max = Integer.MIN_VALUE;
        int min = Integer.MAX_VALUE;
        
        for (int i = 0; i < n; i++) {
            int val = sc.nextInt();
            if (val > max) max = val;
            if (val < min) min = val;
        }
        System.out.println(max + " " + min);
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(31, 1, 8, 2, 'second-largest-element', 'second-largest-element', 31, 'Second Largest Element in Array', 'Find the second distinct largest element in an array of <code>N</code> integers. If no second largest exists, print -1.', 'First line: integer N. Second line: N space-separated integers.', 'The second largest distinct integer or -1.', '2 <= N <= 10^5', 'Distinct elements are 1, 10, 12, 34, 35. Second largest is 34.', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int first = Integer.MIN_VALUE, second = Integer.MIN_VALUE;
        
        for (int i = 0; i < n; i++) {
            int v = sc.nextInt();
            if (v > first) {
                second = first;
                first = v;
            } else if (v > second && v != first) {
                second = v;
            }
        }
        System.out.println(second == Integer.MIN_VALUE ? -1 : second);
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(32, 1, 8, 2, 'reverse-an-array', 'reverse-an-array', 32, 'Reverse an Array in Place', 'Given an array of <code>N</code> integers, reverse it in place using two pointers and print the reversed array.', 'First line: integer N. Second line: N space-separated integers.', 'The reversed array elements separated by spaces.', '1 <= N <= 10^5', 'Swap elements from outside in: 1<->5, 2<->4.', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        
        int left = 0, right = n - 1;
        while (left < right) {
            int temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }
        
        for (int i = 0; i < n; i++) {
            System.out.print(arr[i] + (i == n - 1 ? "" : " "));
        }
        System.out.println();
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(33, 1, 9, 1, 'reverse-a-string-basic', 'reverse-a-string-basic', 33, 'Reverse a String', 'Given a string <code>S</code>, output the reversed string.', 'A single line containing string S.', 'The reversed string.', '1 <= length(S) <= 10^4', 'Characters are output from last to first.', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        
        StringBuilder sb = new StringBuilder(s);
        System.out.println(sb.reverse().toString());
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(34, 1, 9, 1, 'count-vowels-and-consonants', 'count-vowels-and-consonants', 34, 'Count Vowels and Consonants', 'Count the total number of vowels and consonants in a given alphabetic string <code>S</code> (case-insensitive). Print: <code>Vowels: <v>, Consonants: <c></code>.', 'A single line string S.', 'Print <code>Vowels: <v>, Consonants: <c></code>.', '1 <= S.length() <= 10^5, contains letters only', 'Vowels: e, o, o (3). Consonants: H, l, l, W, r, l, d (7).', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().toLowerCase();
        
        int vowels = 0, consonants = 0;
        for (char ch : s.toCharArray()) {
            if (ch >= ''a'' && ch <= ''z'') {
                if ("aeiou".indexOf(ch) != -1) vowels++;
                else consonants++;
            }
        }
        System.out.printf("Vowels: %d, Consonants: %d\\n", vowels, consonants);
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(35, 1, 9, 1, 'palindrome-string-check', 'palindrome-string-check', 35, 'Palindrome String Checker', 'Determine whether a string <code>S</code> is a palindrome (ignoring case). Print <code>Palindrome</code> or <code>Not Palindrome</code>.', 'A single line containing string S.', 'Print <code>Palindrome</code> or <code>Not Palindrome</code>.', '1 <= S.length() <= 10^4', '"radar" reversed is "radar".', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().toLowerCase();
        
        int left = 0, right = s.length() - 1;
        boolean isPal = true;
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) {
                isPal = false;
                break;
            }
            left++;
            right--;
        }
        System.out.println(isPal ? "Palindrome" : "Not Palindrome");
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(36, 1, 9, 2, 'character-frequency-counter', 'character-frequency-counter', 36, 'Character Frequency in String', 'Count the frequency of each lowercase character in string <code>S</code>. Output characters that appear at least once in alphabetical order formatted as: <code><char>:<count></code> on a single line separated by spaces.', 'A single string of lowercase alphabets.', 'Space-separated char:count pairs.', '1 <= S.length() <= 10^5', 'a appears 3 times, b appears 1 time, n appears 2 times.', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        
        int[] count = new int[26];
        for (char ch : s.toCharArray()) {
            if (ch >= ''a'' && ch <= ''z'') {
                count[ch - ''a'']++;
            }
        }
        boolean first = true;
        for (int i = 0; i < 26; i++) {
            if (count[i] > 0) {
                if (!first) System.out.print(" ");
                System.out.print((char)(''a'' + i) + ":" + count[i]);
                first = false;
            }
        }
        System.out.println();
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(37, 1, 10, 1, 'method-overloading-demo', 'method-overloading-demo', 37, 'Method Overloading: Geometry Area', 'Implement overloaded methods <code>area(double radius)</code> for a circle and <code>area(double length, double width)</code> for a rectangle. Compute and print circle area then rectangle area.', 'Line 1: radius (double). Line 2: length and width (two doubles).', 'Two lines: circle area then rectangle area, formatted to 2 decimals.', '1 <= radius, length, width <= 1000.0', 'Circle area = Math.PI * 5^2 = 78.54. Rectangle area = 4 * 6 = 24.00.', 'import java.util.Scanner;

public class Main {
    public static double area(double r) {
        return Math.PI * r * r;
    }
    
    public static double area(double l, double w) {
        return l * w;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double r = sc.nextDouble();
        double l = sc.nextDouble();
        double w = sc.nextDouble();
        
        System.out.printf("%.2f\\n", area(r));
        System.out.printf("%.2f\\n", area(l, w));
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(38, 1, 10, 2, 'recursive-factorial', 'recursive-factorial', 38, 'Recursive Factorial', 'Compute <code>N!</code> recursively. Ensure base case <code>N <= 1</code> returns 1.', 'A non-negative integer N.', 'The factorial value.', '0 <= N <= 20', 'fact(5) = 5 * fact(4) = 5 * 24 = 120.', 'import java.util.Scanner;

public class Main {
    public static long factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(factorial(n));
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(39, 1, 10, 2, 'recursive-fibonacci', 'recursive-fibonacci', 39, 'Recursive N-th Fibonacci', 'Given <code>N</code>, compute the N-th Fibonacci number recursively (0-indexed: F(0)=0, F(1)=1).', 'A non-negative integer N.', 'The N-th Fibonacci number.', '0 <= N <= 30', 'F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3, F(5)=5, F(6)=8.', 'import java.util.Scanner;

public class Main {
    public static int fib(int n) {
        if (n <= 0) return 0;
        if (n == 1) return 1;
        return fib(n - 1) + fib(n - 2);
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(fib(n));
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(40, 1, 10, 2, 'sum-of-digits-recursion', 'sum-of-digits-recursion', 40, 'Recursive Sum of Digits', 'Calculate the sum of digits of a given positive integer <code>N</code> using recursion.', 'A positive integer N.', 'Single integer sum of digits.', '1 <= N <= 10^9', 'sumDigits(987) = 7 + sumDigits(98) = 7 + 8 + 9 = 24.', 'import java.util.Scanner;

public class Main {
    public static int sumDigits(int n) {
        if (n == 0) return 0;
        return (n % 10) + sumDigits(n / 10);
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(sumDigits(n));
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(41, 1, 11, 1, 'class-and-object-creation', 'class-and-object-creation', 41, 'Student Record Class', 'Define a <code>Student</code> class with attributes <code>name</code> and <code>rollNo</code>. Instantiate the object from input and print <code>Roll: <rollNo>, Name: <name></code>.', 'Line 1: int rollNo. Line 2: String name.', 'Print <code>Roll: <rollNo>, Name: <name></code>.', '1 <= rollNo <= 1000', 'Encapsulate state inside a Student instance and call display method.', 'import java.util.Scanner;

class Student {
    int rollNo;
    String name;
    
    Student(int rollNo, String name) {
        this.rollNo = rollNo;
        this.name = name;
    }
    
    void display() {
        System.out.println("Roll: " + rollNo + ", Name: " + name);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int roll = sc.nextInt();
        String name = sc.next();
        Student s = new Student(roll, name);
        s.display();
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(42, 1, 11, 1, 'constructor-demonstration', 'constructor-demonstration', 42, 'Constructor Overloading: Book Class', 'Create a <code>Book</code> class with default and parameterized constructors. Print book title and price.', 'Line 1: String title. Line 2: double price.', 'Print <code>Book: <title> | Price: $<price></code>.', 'Price > 0', 'Constructors initialize object state upon instantiation.', 'import java.util.Scanner;

class Book {
    String title;
    double price;
    
    Book() {
        this.title = "Untitled";
        this.price = 0.0;
    }
    
    Book(String title, double price) {
        this.title = title;
        this.price = price;
    }
    
    void display() {
        System.out.printf("Book: %s | Price: $%.2f\\n", title, price);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String title = sc.next();
        double price = sc.nextDouble();
        Book b = new Book(title, price);
        b.display();
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(43, 1, 11, 2, 'inheritance-example', 'inheritance-example', 43, 'Vehicle and Car Inheritance', 'Demonstrate inheritance by creating a base class <code>Vehicle</code> with <code>brand</code> and subclass <code>Car</code> with <code>doors</code>. Call <code>drive()</code> to print: <code>Driving <brand> with <doors> doors.</code>.', 'String brand, int doors.', 'Print <code>Driving <brand> with <doors> doors.</code>.', 'doors >= 1', 'Subclass inherits fields from superclass using extends and super().', 'import java.util.Scanner;

class Vehicle {
    String brand;
    Vehicle(String brand) {
        this.brand = brand;
    }
}

class Car extends Vehicle {
    int doors;
    Car(String brand, int doors) {
        super(brand);
        this.doors = doors;
    }
    void drive() {
        System.out.println("Driving " + brand + " with " + doors + " doors.");
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String brand = sc.next();
        int doors = sc.nextInt();
        Car c = new Car(brand, doors);
        c.drive();
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(44, 1, 11, 2, 'encapsulation-example', 'encapsulation-example', 44, 'Bank Account Encapsulation', 'Implement a <code>BankAccount</code> class with private <code>balance</code>. Provide public methods: <code>deposit(amount)</code>, <code>withdraw(amount)</code>, and <code>getBalance()</code>. Process a sequence of deposit and withdrawal operations.', 'Line 1: initialBalance (double). Line 2: depositAmount (double). Line 3: withdrawAmount (double).', 'Print final balance formatted to 2 decimals.', 'Amounts >= 0', '1000 + 500 - 200 = 1300.00.', 'import java.util.Scanner;

class BankAccount {
    private double balance;
    
    public BankAccount(double initial) {
        this.balance = initial;
    }
    public void deposit(double amount) {
        if (amount > 0) balance += amount;
    }
    public void withdraw(double amount) {
        if (amount > 0 && amount <= balance) balance -= amount;
    }
    public double getBalance() {
        return balance;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double init = sc.nextDouble();
        double dep = sc.nextDouble();
        double with = sc.nextDouble();
        
        BankAccount acc = new BankAccount(init);
        acc.deposit(dep);
        acc.withdraw(with);
        System.out.printf("Balance: $%.2f\\n", acc.getBalance());
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(45, 1, 12, 1, 'divide-by-zero-handling', 'divide-by-zero-handling', 45, 'Safe Integer Division', 'Read two integers <code>a</code> and <code>b</code>. Divide a by b within a <code>try-catch</code> block. If ArithmeticException occurs, print <code>Error: Division by zero is undefined.</code> otherwise print the integer quotient.', 'Two space-separated integers a and b.', 'Integer quotient or the error message.', '-10^6 <= a, b <= 10^6', 'Dividing by zero throws ArithmeticException caught by try-catch.', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        
        try {
            int res = a / b;
            System.out.println(res);
        } catch (ArithmeticException e) {
            System.out.println("Error: Division by zero is undefined.");
        }
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(46, 1, 12, 2, 'custom-exception-age-validator', 'custom-exception-age-validator', 46, 'Custom InvalidAgeException', 'Define custom exception <code>InvalidAgeException extends Exception</code>. If age < 18, throw the exception and catch it to print <code>Caught: Age must be at least 18</code>, otherwise print <code>Access Granted</code>.', 'A single integer age.', 'Print <code>Access Granted</code> or <code>Caught: Age must be at least 18</code>.', '0 <= age <= 120', '15 is less than 18, triggering the custom exception.', 'import java.util.Scanner;

class InvalidAgeException extends Exception {
    public InvalidAgeException(String msg) {
        super(msg);
    }
}

public class Main {
    public static void checkAge(int age) throws InvalidAgeException {
        if (age < 18) {
            throw new InvalidAgeException("Age must be at least 18");
        }
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int age = sc.nextInt();
        try {
            checkAge(age);
            System.out.println("Access Granted");
        } catch (InvalidAgeException e) {
            System.out.println("Caught: " + e.getMessage());
        }
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(47, 1, 12, 1, 'number-format-exception-handling', 'number-format-exception-handling', 47, 'Safe String to Integer Parser', 'Given a string <code>S</code>, parse it to an integer using <code>Integer.parseInt</code>. Catch <code>NumberFormatException</code> and print <code>Invalid Integer</code> if parsing fails, else print <code>Parsed: <int></code>.', 'A single string S.', 'Print <code>Parsed: <int></code> or <code>Invalid Integer</code>.', '1 <= S.length() <= 20', '"abc" is not a valid number representation, throwing NumberFormatException.', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        
        try {
            int val = Integer.parseInt(s.trim());
            System.out.println("Parsed: " + val);
        } catch (NumberFormatException e) {
            System.out.println("Invalid Integer");
        }
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(48, 1, 13, 1, 'arraylist-basic-operations', 'arraylist-basic-operations', 48, 'ArrayList CRUD Operations', 'Read <code>N</code> strings into a <code>java.util.ArrayList</code>. Remove the element at index 0, and print the remaining elements separated by commas.', 'Line 1: integer N (N >= 2). Line 2: N space-separated strings.', 'Remaining elements separated by <code>, </code>.', '2 <= N <= 100', 'Index 0 (Apple) is removed. Remaining are Banana, Cherry, Date.', 'import java.util.Scanner;
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        ArrayList<String> list = new ArrayList<>();
        for (int i = 0; i < n; i++) list.add(sc.next());
        
        list.remove(0);
        System.out.println(String.join(", ", list));
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(49, 1, 13, 2, 'hashmap-frequency-counter', 'hashmap-frequency-counter', 49, 'Word Frequency Counter with Map', 'Read <code>N</code> words and count the occurrences of each word using <code>java.util.LinkedHashMap</code> (preserving insertion order). Print each entry in format: <code><word>=<count></code> on a single line separated by spaces.', 'Line 1: integer N. Line 2: N space-separated words.', 'Space-separated word=count pairs.', '1 <= N <= 1000', 'apple appears 2 times, orange appears 2 times, banana appears 1 time.', 'import java.util.Scanner;
import java.util.LinkedHashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Map<String, Integer> map = new LinkedHashMap<>();
        for (int i = 0; i < n; i++) {
            String w = sc.next();
            map.put(w, map.getOrDefault(w, 0) + 1);
        }
        boolean first = true;
        for (Map.Entry<String, Integer> entry : map.entrySet()) {
            if (!first) System.out.print(" ");
            System.out.print(entry.getKey() + "=" + entry.getValue());
            first = false;
        }
        System.out.println();
        sc.close();
    }
}', FALSE, TRUE, 2000, 256),
(50, 1, 13, 1, 'hashset-duplicate-remover', 'hashset-duplicate-remover', 50, 'Remove Duplicates via HashSet', 'Read <code>N</code> integers. Insert them into a <code>java.util.LinkedHashSet</code> to remove duplicates while preserving first insertion order. Print the unique elements separated by spaces.', 'Line 1: integer N. Line 2: N space-separated integers.', 'Space-separated unique integers.', '1 <= N <= 10^5', 'Duplicates of 2 and 1 are ignored, maintaining first-seen order.', 'import java.util.Scanner;
import java.util.LinkedHashSet;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        LinkedHashSet<Integer> set = new LinkedHashSet<>();
        for (int i = 0; i < n; i++) set.add(sc.nextInt());
        
        boolean first = true;
        for (int v : set) {
            if (!first) System.out.print(" ");
            System.out.print(v);
            first = false;
        }
        System.out.println();
        sc.close();
    }
}', FALSE, TRUE, 2000, 256)
ON DUPLICATE KEY UPDATE
    category_id = VALUES(category_id),
    difficulty_id = VALUES(difficulty_id),
    title = VALUES(title),
    description = VALUES(description),
    input_format = VALUES(input_format),
    output_format = VALUES(output_format),
    constraints = VALUES(constraints),
    explanation = VALUES(explanation),
    starter_code = VALUES(starter_code);

-- ----------------------------------------------------------------------------
-- 2. Insert Public Sample Test Cases for Basic Problems
-- ----------------------------------------------------------------------------
INSERT INTO problem_test_cases (
    problem_id, is_sample, input_data, expected_output, explanation, display_order, is_active
) VALUES
(1, TRUE, '', 'Hello, World!', 'Sample case 1', 1, TRUE),
(2, TRUE, '10 20', '20 10', 'Sample case 1', 1, TRUE),
(2, TRUE, '-5 42', '42 -5', 'Sample case 2', 2, TRUE),
(2, TRUE, '0 0', '0 0', 'Sample case 3', 3, TRUE),
(3, TRUE, '25.0', '77.00', 'Sample case 1', 1, TRUE),
(3, TRUE, '0.0', '32.00', 'Sample case 2', 2, TRUE),
(3, TRUE, '100.0', '212.00', 'Sample case 3', 3, TRUE),
(4, TRUE, '10000 5 2', '1000.00', 'Sample case 1', 1, TRUE),
(4, TRUE, '5000 7.5 3', '1125.00', 'Sample case 2', 2, TRUE),
(5, TRUE, 'Alice
20
3.85', 'Name: Alice, Age: 20, GPA: 3.85', 'Sample case 1', 1, TRUE),
(5, TRUE, 'Bob
22
4.0', 'Name: Bob, Age: 22, GPA: 4.00', 'Sample case 2', 2, TRUE),
(6, TRUE, '15 27', '42', 'Sample case 1', 1, TRUE),
(6, TRUE, '-10 20', '10', 'Sample case 2', 2, TRUE),
(6, TRUE, '1000000000 2000000000', '3000000000', 'Sample case 3', 3, TRUE),
(7, TRUE, 'Notebook 3 4.50', 'Item: Notebook | Qty: 3 | Total: $13.50', 'Sample case 1', 1, TRUE),
(7, TRUE, 'Pen 10 1.25', 'Item: Pen | Qty: 10 | Total: $12.50', 'Sample case 2', 2, TRUE),
(8, TRUE, '8 3', '11
5
24
2
2', 'Sample case 1', 1, TRUE),
(8, TRUE, '20 5', '25
15
100
4
0', 'Sample case 2', 2, TRUE),
(9, TRUE, '5 3', '1
7
6', 'Sample case 1', 1, TRUE),
(9, TRUE, '12 25', '8
29
21', 'Sample case 2', 2, TRUE),
(10, TRUE, '14 29', '29', 'Sample case 1', 1, TRUE),
(10, TRUE, '50 20', '50', 'Sample case 2', 2, TRUE),
(10, TRUE, '-5 -1', '-1', 'Sample case 3', 3, TRUE),
(11, TRUE, '7', 'Odd', 'Sample case 1', 1, TRUE),
(11, TRUE, '42', 'Even', 'Sample case 2', 2, TRUE),
(11, TRUE, '0', 'Even', 'Sample case 3', 3, TRUE),
(12, TRUE, '12 45 32', '45', 'Sample case 1', 1, TRUE),
(12, TRUE, '100 5 20', '100', 'Sample case 2', 2, TRUE),
(12, TRUE, '-10 -5 -20', '-5', 'Sample case 3', 3, TRUE),
(13, TRUE, '2024', 'Leap Year', 'Sample case 1', 1, TRUE),
(13, TRUE, '1900', 'Not Leap Year', 'Sample case 2', 2, TRUE),
(13, TRUE, '2000', 'Leap Year', 'Sample case 3', 3, TRUE),
(14, TRUE, '85', 'B', 'Sample case 1', 1, TRUE),
(14, TRUE, '95', 'A', 'Sample case 2', 2, TRUE),
(14, TRUE, '55', 'F', 'Sample case 3', 3, TRUE),
(15, TRUE, '5', '5 x 1 = 5
5 x 2 = 10
5 x 3 = 15
5 x 4 = 20
5 x 5 = 25
5 x 6 = 30
5 x 7 = 35
5 x 8 = 40
5 x 9 = 45
5 x 10 = 50', 'Sample case 1', 1, TRUE),
(15, TRUE, '2', '2 x 1 = 2
2 x 2 = 4
2 x 3 = 6
2 x 4 = 8
2 x 5 = 10
2 x 6 = 12
2 x 7 = 14
2 x 8 = 16
2 x 9 = 18
2 x 10 = 20', 'Sample case 2', 2, TRUE),
(16, TRUE, '10', '55', 'Sample case 1', 1, TRUE),
(16, TRUE, '100', '5050', 'Sample case 2', 2, TRUE),
(16, TRUE, '1', '1', 'Sample case 3', 3, TRUE),
(17, TRUE, '5', '120', 'Sample case 1', 1, TRUE),
(17, TRUE, '0', '1', 'Sample case 2', 2, TRUE),
(17, TRUE, '6', '720', 'Sample case 3', 3, TRUE),
(18, TRUE, '12345', '5', 'Sample case 1', 1, TRUE),
(18, TRUE, '0', '1', 'Sample case 2', 2, TRUE),
(18, TRUE, '-9876', '4', 'Sample case 3', 3, TRUE),
(19, TRUE, '17', 'Prime', 'Sample case 1', 1, TRUE),
(19, TRUE, '4', 'Not Prime', 'Sample case 2', 2, TRUE),
(19, TRUE, '1', 'Not Prime', 'Sample case 3', 3, TRUE),
(19, TRUE, '97', 'Prime', 'Sample case 4', 4, TRUE),
(20, TRUE, '7', '0 1 1 2 3 5 8', 'Sample case 1', 1, TRUE),
(20, TRUE, '1', '0', 'Sample case 2', 2, TRUE),
(20, TRUE, '4', '0 1 1 2', 'Sample case 3', 3, TRUE),
(21, TRUE, '1234', '4321', 'Sample case 1', 1, TRUE),
(21, TRUE, '500', '5', 'Sample case 2', 2, TRUE),
(21, TRUE, '7', '7', 'Sample case 3', 3, TRUE),
(22, TRUE, '1221', 'Palindrome', 'Sample case 1', 1, TRUE),
(22, TRUE, '1234', 'Not Palindrome', 'Sample case 2', 2, TRUE),
(22, TRUE, '7', 'Palindrome', 'Sample case 3', 3, TRUE),
(23, TRUE, '153', 'Armstrong', 'Sample case 1', 1, TRUE),
(23, TRUE, '370', 'Armstrong', 'Sample case 2', 2, TRUE),
(23, TRUE, '123', 'Not Armstrong', 'Sample case 3', 3, TRUE),
(24, TRUE, '12 18', '6 36', 'Sample case 1', 1, TRUE),
(24, TRUE, '7 5', '1 35', 'Sample case 2', 2, TRUE),
(24, TRUE, '20 40', '20 40', 'Sample case 3', 3, TRUE),
(25, TRUE, '4', '*
**
***
****', 'Sample case 1', 1, TRUE),
(25, TRUE, '2', '*
**', 'Sample case 2', 2, TRUE),
(26, TRUE, '3', '***
**
*', 'Sample case 1', 1, TRUE),
(26, TRUE, '1', '*', 'Sample case 2', 2, TRUE),
(27, TRUE, '4', '1
1 2
1 2 3
1 2 3 4', 'Sample case 1', 1, TRUE),
(27, TRUE, '2', '1
1 2', 'Sample case 2', 2, TRUE),
(28, TRUE, '4', '1
2 3
4 5 6
7 8 9 10', 'Sample case 1', 1, TRUE),
(28, TRUE, '2', '1
2 3', 'Sample case 2', 2, TRUE),
(29, TRUE, '5
10 20 30 40 50', '150
30.00', 'Sample case 1', 1, TRUE),
(29, TRUE, '3
4 5 6', '15
5.00', 'Sample case 2', 2, TRUE),
(30, TRUE, '6
3 8 1 9 2 5', '9 1', 'Sample case 1', 1, TRUE),
(30, TRUE, '1
42', '42 42', 'Sample case 2', 2, TRUE),
(31, TRUE, '5
12 35 1 10 34', '34', 'Sample case 1', 1, TRUE),
(31, TRUE, '3
10 10 10', '-1', 'Sample case 2', 2, TRUE),
(32, TRUE, '5
1 2 3 4 5', '5 4 3 2 1', 'Sample case 1', 1, TRUE),
(32, TRUE, '2
10 20', '20 10', 'Sample case 2', 2, TRUE),
(33, TRUE, 'CodeArena', 'anerAedoC', 'Sample case 1', 1, TRUE),
(33, TRUE, 'Java', 'avaJ', 'Sample case 2', 2, TRUE),
(34, TRUE, 'Hello World', 'Vowels: 3, Consonants: 7', 'Sample case 1', 1, TRUE),
(34, TRUE, 'Java', 'Vowels: 2, Consonants: 2', 'Sample case 2', 2, TRUE),
(35, TRUE, 'Radar', 'Palindrome', 'Sample case 1', 1, TRUE),
(35, TRUE, 'Hello', 'Not Palindrome', 'Sample case 2', 2, TRUE),
(36, TRUE, 'banana', 'a:3 b:1 n:2', 'Sample case 1', 1, TRUE),
(36, TRUE, 'java', 'a:2 j:1 v:1', 'Sample case 2', 2, TRUE),
(37, TRUE, '5.0
4.0 6.0', '78.54
24.00', 'Sample case 1', 1, TRUE),
(37, TRUE, '1.0
2.0 3.0', '3.14
6.00', 'Sample case 2', 2, TRUE),
(38, TRUE, '5', '120', 'Sample case 1', 1, TRUE),
(38, TRUE, '0', '1', 'Sample case 2', 2, TRUE),
(38, TRUE, '4', '24', 'Sample case 3', 3, TRUE),
(39, TRUE, '6', '8', 'Sample case 1', 1, TRUE),
(39, TRUE, '0', '0', 'Sample case 2', 2, TRUE),
(39, TRUE, '1', '1', 'Sample case 3', 3, TRUE),
(40, TRUE, '987', '24', 'Sample case 1', 1, TRUE),
(40, TRUE, '1234', '10', 'Sample case 2', 2, TRUE),
(41, TRUE, '101
Grace', 'Roll: 101, Name: Grace', 'Sample case 1', 1, TRUE),
(41, TRUE, '42
Alan', 'Roll: 42, Name: Alan', 'Sample case 2', 2, TRUE),
(42, TRUE, 'EffectiveJava 45.00', 'Book: EffectiveJava | Price: $45.00', 'Sample case 1', 1, TRUE),
(43, TRUE, 'Tesla 4', 'Driving Tesla with 4 doors.', 'Sample case 1', 1, TRUE),
(43, TRUE, 'Porsche 2', 'Driving Porsche with 2 doors.', 'Sample case 2', 2, TRUE),
(44, TRUE, '1000.00 500.00 200.00', 'Balance: $1300.00', 'Sample case 1', 1, TRUE),
(45, TRUE, '10 0', 'Error: Division by zero is undefined.', 'Sample case 1', 1, TRUE),
(45, TRUE, '20 4', '5', 'Sample case 2', 2, TRUE),
(46, TRUE, '15', 'Caught: Age must be at least 18', 'Sample case 1', 1, TRUE),
(46, TRUE, '21', 'Access Granted', 'Sample case 2', 2, TRUE),
(47, TRUE, 'abc', 'Invalid Integer', 'Sample case 1', 1, TRUE),
(47, TRUE, '1234', 'Parsed: 1234', 'Sample case 2', 2, TRUE),
(48, TRUE, '4
Apple Banana Cherry Date', 'Banana, Cherry, Date', 'Sample case 1', 1, TRUE),
(49, TRUE, '5
apple orange apple banana orange', 'apple=2 orange=2 banana=1', 'Sample case 1', 1, TRUE),
(50, TRUE, '6
1 2 2 3 1 4', '1 2 3 4', 'Sample case 1', 1, TRUE);

-- ----------------------------------------------------------------------------
-- 3. Insert Concept Tags & Mappings for Basic Problems
-- ----------------------------------------------------------------------------
INSERT INTO problem_tags (id, name, slug) VALUES
(1, 'System.out.println', 'system-out-println'),
(2, 'Main Method', 'main-method'),
(3, 'Class Structure', 'class-structure'),
(4, 'Variable Assignment', 'variable-assignment'),
(5, 'Temporary Variables', 'temporary-variables'),
(6, 'Scanner', 'scanner'),
(7, 'Floating Point Arithmetic', 'floating-point-arithmetic'),
(8, 'System.out.printf', 'system-out-printf'),
(9, 'Type Casting', 'type-casting'),
(10, 'Math Operators', 'math-operators'),
(11, 'Format Specifiers', 'format-specifiers'),
(12, 'Scanner Tokenization', 'scanner-tokenization'),
(13, 'Data Types', 'data-types'),
(14, 'String Concatenation', 'string-concatenation'),
(15, 'Addition', 'addition'),
(16, 'Long vs Int Range', 'long-vs-int-range'),
(17, 'printf Formatting', 'printf-formatting'),
(18, 'Multiplication', 'multiplication'),
(19, 'Arithmetic Operators', 'arithmetic-operators'),
(20, 'Integer Division', 'integer-division'),
(21, 'Modulo Operator', 'modulo-operator'),
(22, 'Bitwise Operators', 'bitwise-operators'),
(23, 'Binary Representations', 'binary-representations'),
(24, 'Bit Manipulation', 'bit-manipulation'),
(25, 'Ternary Operator', 'ternary-operator'),
(26, 'Inline Condition', 'inline-condition'),
(27, 'Evaluation', 'evaluation'),
(28, 'If-Else', 'if-else'),
(29, 'Parity Check', 'parity-check'),
(30, 'Nested If Statements', 'nested-if-statements'),
(31, 'Logical AND (&&)', 'logical-and'),
(32, 'Comparison', 'comparison'),
(33, 'Compound Boolean Logic', 'compound-boolean-logic'),
(34, 'Century Year Exceptions', 'century-year-exceptions'),
(35, 'Modulo', 'modulo'),
(36, 'Else-If Ladder', 'else-if-ladder'),
(37, 'Relational Operators', 'relational-operators'),
(38, 'Input Range Validation', 'input-range-validation'),
(39, 'For Loop', 'for-loop'),
(40, 'Loop Index', 'loop-index'),
(41, 'String Formatting', 'string-formatting'),
(42, 'Accumulator Pattern', 'accumulator-pattern'),
(43, 'While / For Loop', 'while-for-loop'),
(44, 'Sum Formula', 'sum-formula'),
(45, 'Iterative Multiplication', 'iterative-multiplication'),
(46, 'Boundary Value 0!', 'boundary-value-0'),
(47, 'Long Integer Type', 'long-integer-type'),
(48, 'While Loop', 'while-loop'),
(49, 'Math.abs', 'math-abs'),
(50, 'Primality Test', 'primality-test'),
(51, 'Sqrt(N) Optimization', 'sqrt-n-optimization'),
(52, 'Loop Termination', 'loop-termination'),
(53, 'Sequence Generation', 'sequence-generation'),
(54, 'Previous State Caching', 'previous-state-caching'),
(55, 'Loops', 'loops'),
(56, 'Modulo Extraction', 'modulo-extraction'),
(57, 'Base 10 Accumulator', 'base-10-accumulator'),
(58, 'Palindrome Logic', 'palindrome-logic'),
(59, 'Digit Reversal', 'digit-reversal'),
(60, 'Math.pow', 'math-pow'),
(61, 'Digit Power Sum', 'digit-power-sum'),
(62, 'Integer Analysis', 'integer-analysis'),
(63, 'Euclidean Algorithm', 'euclidean-algorithm'),
(64, 'GCD Property', 'gcd-property'),
(65, 'LCM = (a*b)/gcd', 'lcm-a-b-gcd'),
(66, 'Nested Loops', 'nested-loops'),
(67, 'Loop Invariants', 'loop-invariants'),
(68, 'Pattern Output', 'pattern-output'),
(69, 'Decreasing Inner Loops', 'decreasing-inner-loops'),
(70, 'Nested Iteration', 'nested-iteration'),
(71, 'Console Patterns', 'console-patterns'),
(72, 'Number Patterns', 'number-patterns'),
(73, 'Row Tracking', 'row-tracking'),
(74, 'Spacing', 'spacing'),
(75, 'Continuous Counter', 'continuous-counter'),
(76, 'Formatting', 'formatting'),
(77, 'Array Traversal', 'array-traversal'),
(78, 'Accumulator', 'accumulator'),
(79, 'Double Division', 'double-division'),
(80, 'Linear Scan', 'linear-scan'),
(81, 'Single-Pass Min/Max', 'single-pass-min-max'),
(82, 'Boundary Comparison', 'boundary-comparison'),
(83, 'Single-Pass Two Variables', 'single-pass-two-variables'),
(84, 'Distinct Filtering', 'distinct-filtering'),
(85, 'Edge Cases', 'edge-cases'),
(86, 'Two-Pointer Swapping', 'two-pointer-swapping'),
(87, 'In-Place Invariant', 'in-place-invariant'),
(88, 'O(1) Memory', 'o-1-memory'),
(89, 'StringBuilder.reverse', 'stringbuilder-reverse'),
(90, 'Character Array', 'character-array'),
(91, 'Strings', 'strings'),
(92, 'Character.toLowerCase', 'character-tolowercase'),
(93, 'Vowel Matching', 'vowel-matching'),
(94, 'Char Classification', 'char-classification'),
(95, 'Two Pointers', 'two-pointers'),
(96, 'Case Insensitivity', 'case-insensitivity'),
(97, 'String Comparison', 'string-comparison'),
(98, 'Frequency Array (int[26])', 'frequency-array-int-26'),
(99, 'Char Indexing', 'char-indexing'),
(100, 'Lexicographic Output', 'lexicographic-output'),
(101, 'Compile-Time Polymorphism', 'compile-time-polymorphism'),
(102, 'Method Signatures', 'method-signatures'),
(103, 'Method Overloading', 'method-overloading'),
(104, 'Base Cases', 'base-cases'),
(105, 'Recursion Tree', 'recursion-tree'),
(106, 'Call Stack', 'call-stack'),
(107, 'Branching Recursion', 'branching-recursion'),
(108, 'Base Conditions', 'base-conditions'),
(109, 'Recursive Reduction', 'recursive-reduction'),
(110, 'Modulo Arithmetic', 'modulo-arithmetic'),
(111, 'Class Definition', 'class-definition'),
(112, 'Object Instantiation', 'object-instantiation'),
(113, 'State Encapsulation', 'state-encapsulation'),
(114, 'Constructor Overloading', 'constructor-overloading'),
(115, 'this Keyword', 'this-keyword'),
(116, 'Initialization', 'initialization'),
(117, 'Single Inheritance', 'single-inheritance'),
(118, 'super Keyword', 'super-keyword'),
(119, 'Subclassing', 'subclassing'),
(120, 'Access Modifiers', 'access-modifiers'),
(121, 'Getters & Setters', 'getters-setters'),
(122, 'Data Hiding', 'data-hiding'),
(123, 'Try-Catch', 'try-catch'),
(124, 'ArithmeticException', 'arithmeticexception'),
(125, 'Graceful Error Handling', 'graceful-error-handling'),
(126, 'Custom Checked Exceptions', 'custom-checked-exceptions'),
(127, 'throw vs throws', 'throw-vs-throws'),
(128, 'Exception Subclassing', 'exception-subclassing'),
(129, 'NumberFormatException', 'numberformatexception'),
(130, 'Integer.parseInt', 'integer-parseint'),
(131, 'Defensive Programming', 'defensive-programming'),
(132, 'ArrayList.add', 'arraylist-add'),
(133, 'ArrayList.remove', 'arraylist-remove'),
(134, 'Collections', 'collections'),
(135, 'Map Interface', 'map-interface'),
(136, 'LinkedHashMap', 'linkedhashmap'),
(137, 'getOrDefault', 'getordefault'),
(138, 'Set Interface', 'set-interface'),
(139, 'LinkedHashSet', 'linkedhashset'),
(140, 'Uniqueness Property', 'uniqueness-property')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO problem_tag_mappings (problem_id, tag_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 4),
(2, 5),
(2, 6),
(3, 7),
(3, 8),
(3, 9),
(4, 10),
(4, 11),
(4, 6),
(5, 12),
(5, 13),
(5, 14),
(6, 6),
(6, 15),
(6, 16),
(7, 17),
(7, 18),
(7, 6),
(8, 19),
(8, 20),
(8, 21),
(9, 22),
(9, 23),
(9, 24),
(10, 25),
(10, 26),
(10, 27),
(11, 28),
(11, 21),
(11, 29),
(12, 30),
(12, 31),
(12, 32),
(13, 33),
(13, 34),
(13, 35),
(14, 36),
(14, 37),
(14, 38),
(15, 39),
(15, 40),
(15, 41),
(16, 42),
(16, 43),
(16, 44),
(17, 45),
(17, 46),
(17, 47),
(18, 48),
(18, 20),
(18, 49),
(19, 50),
(19, 51),
(19, 52),
(20, 53),
(20, 54),
(20, 55),
(21, 56),
(21, 57),
(21, 48),
(22, 58),
(22, 59),
(22, 32),
(23, 60),
(23, 61),
(23, 62),
(24, 63),
(24, 64),
(24, 65),
(25, 66),
(25, 67),
(25, 68),
(26, 69),
(26, 70),
(26, 71),
(27, 72),
(27, 73),
(27, 74),
(28, 75),
(28, 66),
(28, 76),
(29, 77),
(29, 78),
(29, 79),
(30, 80),
(30, 81),
(30, 82),
(31, 83),
(31, 84),
(31, 85),
(32, 86),
(32, 87),
(32, 88),
(33, 89),
(33, 90),
(33, 91),
(34, 92),
(34, 93),
(34, 94),
(35, 95),
(35, 96),
(35, 97),
(36, 98),
(36, 99),
(36, 100),
(37, 101),
(37, 102),
(37, 103),
(38, 104),
(38, 105),
(38, 106),
(39, 107),
(39, 108),
(39, 105),
(40, 109),
(40, 110),
(40, 104),
(41, 111),
(41, 112),
(41, 113),
(42, 114),
(42, 115),
(42, 116),
(43, 117),
(43, 118),
(43, 119),
(44, 120),
(44, 121),
(44, 122),
(45, 123),
(45, 124),
(45, 125),
(46, 126),
(46, 127),
(46, 128),
(47, 129),
(47, 130),
(47, 131),
(48, 132),
(48, 133),
(48, 134),
(49, 135),
(49, 136),
(49, 137),
(50, 138),
(50, 139),
(50, 140)
ON DUPLICATE KEY UPDATE problem_id = VALUES(problem_id);

SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
