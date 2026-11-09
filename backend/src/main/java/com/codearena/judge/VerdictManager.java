
package com.codearena.judge;

public class VerdictManager {

    // Determine verdict based on test-case results
    public String determineVerdict(
            int totalTestCases,
            int passedTestCases) {

        if (totalTestCases <= 0) {
            return "NO_TEST_CASES";
        }

        if (passedTestCases < 0 ||
                passedTestCases > totalTestCases) {
            return "INVALID_RESULT";
        }

        if (passedTestCases == totalTestCases) {
            return "ACCEPTED";
        }

        return "WRONG_ANSWER";
    }
}
