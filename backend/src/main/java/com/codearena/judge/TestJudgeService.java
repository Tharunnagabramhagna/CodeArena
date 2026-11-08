
package com.codearena.judge;

public class TestJudgeService {

    public static void main(String[] args) {

        JudgeService judgeService = new JudgeService();

        // Test 1: Matching outputs
        boolean test1 =
                judgeService.compareTestCaseOutput("30", "30");

        // Test 2: Different outputs
        boolean test2 =
                judgeService.compareTestCaseOutput("30", "40");

        // Test 3: Matching outputs with extra spaces
        boolean test3 =
                judgeService.compareTestCaseOutput("30", " 30 ");

        System.out.println("Test 1 - Matching output: " + test1);
        System.out.println("Test 2 - Different output: " + test2);
        System.out.println("Test 3 - Extra spaces: " + test3);

        if (test1 && !test2 && test3) {
            System.out.println(
                    "TEST PASSED: JudgeService comparison works!"
            );
        } else {
            System.out.println(
                    "TEST FAILED: JudgeService comparison needs fixing!"
            );
        }
    }
}
