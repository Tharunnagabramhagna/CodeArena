
package com.codearena.judge;

public class TestAutomaticJudging {

    public static void main(String[] args) {

        ExecutionEngine engine = new CodeExecutorAdapter();

        JudgeService judgeService = new JudgeService(engine);

        int submissionId = 5;

        System.out.println("Starting automatic judging...");
        System.out.println("Submission ID: " + submissionId);

        boolean result = judgeService.judgeSubmission(submissionId);

        System.out.println("Judging completed: " + result);
    }
}
