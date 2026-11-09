
package com.codearena.testcase;

import com.codearena.model.TestCase;

public class TestAddTestCase {

    public static void main(String[] args) {

        TestCaseDAO testCaseDAO = new TestCaseDAO();

        // Add a sample test case to Problem ID 2
        TestCase sampleTest = new TestCase();

        sampleTest.setProblemId(2);
        sampleTest.setInput("5 10");
        sampleTest.setExpectedOutput("10");
        sampleTest.setSample(true);

        boolean sampleResult = testCaseDAO.addTestCase(sampleTest);

        if (sampleResult) {
            System.out.println("Sample test case added successfully!");
        } else {
            System.out.println("Failed to add sample test case.");
        }

        // Add a hidden test case to Problem ID 2
        TestCase hiddenTest = new TestCase();

        hiddenTest.setProblemId(2);
        hiddenTest.setInput("20 30");
        hiddenTest.setExpectedOutput("30");
        hiddenTest.setSample(false);

        boolean hiddenResult = testCaseDAO.addTestCase(hiddenTest);

        if (hiddenResult) {
            System.out.println("Hidden test case added successfully!");
        } else {
            System.out.println("Failed to add hidden test case.");
        }
    }
}
