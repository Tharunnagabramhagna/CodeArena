
package com.codearena.judge;

import com.codearena.model.Submission;
import com.codearena.model.TestCase;
import com.codearena.submission.SubmissionDAO;
import com.codearena.service.SubmissionService;
import com.codearena.testcase.TestCaseDAO;

import java.util.List;

public class JudgeService {

    private final SubmissionDAO submissionDAO;
    private final TestCaseDAO testCaseDAO;
    private final SubmissionService submissionService;
    private final OutputComparator outputComparator;
    private final VerdictManager verdictManager;
    private final ExecutionEngine executionEngine;

    // Constructor for existing judging operations
    public JudgeService() {
        this(null);
    }

    // Constructor for future execution-engine integration
    public JudgeService(ExecutionEngine executionEngine) {
        this.submissionDAO = new SubmissionDAO();
        this.testCaseDAO = new TestCaseDAO();
        this.submissionService = new SubmissionService();
        this.outputComparator = new OutputComparator();
        this.verdictManager = new VerdictManager();
        this.executionEngine = executionEngine;
    }

    public boolean validateSubmissionForJudging(int submissionId) {

        if (submissionId <= 0) {
            System.out.println("Invalid submission ID!");
            return false;
        }

        Submission submission =
                submissionDAO.getSubmissionById(submissionId);

        if (submission == null) {
            System.out.println("Submission not found!");
            return false;
        }

        List<TestCase> testCases =
                testCaseDAO.getTestCasesByProblemId(
                        submission.getProblemId());

        if (testCases == null || testCases.isEmpty()) {
            System.out.println("No test cases found!");
            return false;
        }

        System.out.println("Submission is ready for judging.");
        System.out.println("Submission ID: " + submission.getId());
        System.out.println("Problem ID: " + submission.getProblemId());
        System.out.println("Language: " + submission.getLanguage());
        System.out.println("Total test cases: " + testCases.size());

        return true;
    }

    public boolean compareTestCaseOutput(
            String expectedOutput,
            String actualOutput) {

        return outputComparator.compareOutputs(
                expectedOutput, actualOutput);
    }

    // Execute one test case using the supplied execution engine
    public boolean executeAndCompareTestCase(
            Submission submission,
            TestCase testCase) {

        if (executionEngine == null) {
            System.out.println("Execution engine is not connected!");
            return false;
        }

        if (submission == null || testCase == null) {
            System.out.println("Invalid submission or test case!");
            return false;
        }

        ExecutionRequest request = new ExecutionRequest(
                submission.getSourceCode(),
                testCase.getInput(),
                submission.getLanguage()
        );

        ExecutionResult result = executionEngine.execute(request);

        if (result == null) {
            System.out.println("Execution engine returned no result!");
            return false;
        }

        if (result.isCompilationError()) {
            System.out.println("Compilation error: " + result.getError());
            return false;
        }

        if (!result.isSuccessful()) {
            System.out.println("Execution failed: " + result.getError());
            return false;
        }

        return outputComparator.compareOutputs(
                testCase.getExpectedOutput(),
                result.getOutput()
        );
    }

    public boolean saveJudgingResult(
            int submissionId,
            int totalTestCases,
            int passedTestCases,
            long executionTime,
            long memoryUsed) {

        if (totalTestCases <= 0) {
            System.out.println("No test cases available.");
            return false;
        }

        String verdict = verdictManager.determineVerdict(
                totalTestCases, passedTestCases);

        if ("INVALID_RESULT".equals(verdict)
                || "NO_TEST_CASES".equals(verdict)) {
            System.out.println("Invalid judging result.");
            return false;
        }

        boolean updated = submissionService.updateSubmissionResult(
                submissionId,
                "COMPLETED",
                verdict,
                executionTime,
                memoryUsed);

        if (updated) {
            System.out.println("Judging result saved successfully.");
            System.out.println("Verdict: " + verdict);
        } else {
            System.out.println("Failed to save judging result.");
        }

        return updated;
    }
}
