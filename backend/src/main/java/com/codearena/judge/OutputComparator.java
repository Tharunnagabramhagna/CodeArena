
package com.codearena.judge;

public class OutputComparator {

    // Compare actual output with expected output
    public boolean compareOutputs(
            String expectedOutput,
            String actualOutput) {

        if (expectedOutput == null || actualOutput == null) {
            return false;
        }

        // Remove leading and trailing whitespace
        String expected = expectedOutput.trim();
        String actual = actualOutput.trim();

        return expected.equals(actual);
    }
}

