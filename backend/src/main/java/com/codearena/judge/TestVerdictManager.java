
package com.codearena.judge;

public class TestVerdictManager {

    public static void main(String[] args) {

        VerdictManager verdictManager = new VerdictManager();

        // Test 1: All test cases passed
        String test1 = verdictManager.determineVerdict(2, 2);

        // Test 2: One test case failed
        String test2 = verdictManager.determineVerdict(2, 1);

        // Test 3: No test cases available
        String test3 = verdictManager.determineVerdict(0, 0);

        // Test 4: Invalid test result
        String test4 = verdictManager.determineVerdict(2, 3);

        System.out.println("Test 1: " + test1);
        System.out.println("Test 2: " + test2);
        System.out.println("Test 3: " + test3);
        System.out.println("Test 4: " + test4);

        if (test1.equals("ACCEPTED")
                && test2.equals("WRONG_ANSWER")
                && test3.equals("NO_TEST_CASES")
                && test4.equals("INVALID_RESULT")) {

            System.out.println("TEST PASSED: VerdictManager works correctly!");

        } else {

            System.out.println("TEST FAILED: VerdictManager needs fixing!");
        }
    }
}
