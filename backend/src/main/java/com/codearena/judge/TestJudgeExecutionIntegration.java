
package com.codearena.judge;

import com.codearena.model.Submission;
import com.codearena.model.TestCase;

public class TestJudgeExecutionIntegration {

    public static void main(String[] args) {

        ExecutionEngine mockEngine = new ExecutionEngine() {

            @Override
            public ExecutionResult execute(ExecutionRequest request) {

                System.out.println("Received Java code.");
                System.out.println("Received input: " + request.getInput());

                return new ExecutionResult(
                        "20",
                        "",
                        false,
                        true,
                        0,
                        100,
                        1024
                );
            }
        };

        JudgeService judgeService = new JudgeService(mockEngine);

        Submission submission = new Submission();
        submission.setSourceCode(
                "public class Main { public static void main(String[] args) { System.out.println(10); } }"
        );
        submission.setLanguage("Java");

        TestCase testCase = new TestCase();
        testCase.setInput("5 5");
        testCase.setExpectedOutput("10");

        boolean passed = judgeService.executeAndCompareTestCase(
                submission, testCase);

        System.out.println("Test case passed: " + passed);
    }
}
