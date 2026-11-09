
package com.codearena.judge;

public class OutputComparator {

    public boolean compareOutputs(String expectedOutput, String actualOutput) {

        if (expectedOutput == null || actualOutput == null) {
            return false;
        }

        String expected = expectedOutput.trim();
        String actual = actualOutput.trim();

        return expected.equals(actual);
    }
}
