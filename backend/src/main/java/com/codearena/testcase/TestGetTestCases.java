
package com.codearena.testcase;

import com.codearena.model.TestCase;
import java.util.List;

public class TestGetTestCases {

    public static void main(String[] args) {

        TestCaseDAO testCaseDAO = new TestCaseDAO();

        // Retrieve test cases for Problem ID 2
        int problemId = 2;

        List<TestCase> testCases =
                testCaseDAO.getTestCasesByProblemId(problemId);

        if (testCases.isEmpty()) {

            System.out.println("No test cases found!");

        } else {

            System.out.println("===== TEST CASES =====");

            for (TestCase testCase : testCases) {

                System.out.println("Test Case ID: " + testCase.getId());
                System.out.println("Problem ID: " + testCase.getProblemId());
                System.out.println("Input: " + testCase.getInput());
                System.out.println("Expected Output: "
                        + testCase.getExpectedOutput());

                if (testCase.isSample()) {
                    System.out.println("Type: Sample Test Case");
                } else {
                    System.out.println("Type: Hidden Test Case");
                }

                System.out.println("--------------------------");
            }

            System.out.println("Total Test Cases: " + testCases.size());
        }
    }
}