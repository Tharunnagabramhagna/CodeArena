
package com.codearena.judge;

public class TestExecutionResult {

    public static void main(String[] args) {

        ExecutionResult result = new ExecutionResult(
                "Hello World",
                "",
                false,
                true,
                0,
                100,
                1024
        );

        System.out.println("Output: " + result.getOutput());
        System.out.println("Error: " + result.getError());
        System.out.println("Compilation Error: " + result.isCompilationError());
        System.out.println("Successful: " + result.isSuccessful());
        System.out.println("Exit Code: " + result.getExitCode());
        System.out.println("Execution Time: " + result.getExecutionTime());
        System.out.println("Memory Used: " + result.getMemoryUsed());
    }
}
