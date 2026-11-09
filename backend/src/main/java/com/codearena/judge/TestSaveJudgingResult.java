
package com.codearena.judge;

public class TestSaveJudgingResult {

    public static void main(String[] args) {

        JudgeService judgeService = new JudgeService();

        boolean result = judgeService.saveJudgingResult(
                3,      // Submission ID
                2,      // Total test cases
                1,      // Passed test cases
                180,    // Sample execution time
                2048    // Sample memory usage
        );

        System.out.println("Test result: " + result);
    }
}
