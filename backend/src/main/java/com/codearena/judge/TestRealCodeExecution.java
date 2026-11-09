
package com.codearena.judge;

import com.codearena.model.ExecutionRequest;
import com.codearena.execution.ExecutionResult;

public class TestRealCodeExecution {

    public static void main(String[] args) {

        ExecutionEngine engine = new CodeExecutorAdapter();

        String sourceCode =
                "import java.util.Scanner; " +
                "public class Main { " +
                "public static void main(String[] args) { " +
                "Scanner sc = new Scanner(System.in); " +
                "int a = sc.nextInt(); " +
                "int b = sc.nextInt(); " +
                "System.out.println(a + b); " +
                "} " +
                "}";

        ExecutionRequest request = new ExecutionRequest(
                sourceCode,
                "Java",
                "5 10"
        );

        ExecutionResult result = engine.execute(request);

        System.out.println("Status: " + result.getStatus());
        System.out.println("Output: " + result.getOutput());
        System.out.println("Error: " + result.getError());
        System.out.println("Execution time: " + result.getExecutionTime());
    }
}
