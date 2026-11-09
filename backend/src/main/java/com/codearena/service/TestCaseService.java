
package com.codearena.service;

import com.codearena.model.TestCase;
import com.codearena.testcase.TestCaseDAO;

import java.util.List;

public class TestCaseService {

    private final TestCaseDAO testCaseDAO;

    public TestCaseService() {
        this.testCaseDAO = new TestCaseDAO();
    }

    // 1. Add a test case
    public boolean addTestCase(TestCase testCase) {

        if (testCase == null) {
            return false;
        }

        if (testCase.getProblemId() <= 0) {
            return false;
        }

        if (testCase.getInput() == null ||
                testCase.getInput().trim().isEmpty()) {
            return false;
        }

        if (testCase.getExpectedOutput() == null ||
                testCase.getExpectedOutput().trim().isEmpty()) {
            return false;
        }

        return testCaseDAO.addTestCase(testCase);
    }

    // 2. Retrieve test cases by problem ID
    public List<TestCase> getTestCasesByProblemId(int problemId) {

        if (problemId <= 0) {
            return List.of();
        }

        return testCaseDAO.getTestCasesByProblemId(problemId);
    }
}
