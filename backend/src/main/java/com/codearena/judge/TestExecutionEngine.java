
package com.codearena.judge;

import com.codearena.model.ExecutionRequest;
import com.codearena.execution.ExecutionResult;

public class TestExecutionEngine {

    public static void main(String[] args) {

        ExecutionEngine engine = new ExecutionEngine() {

            @Override
            public ExecutionResult execute(ExecutionRequest request) {

                System.out.println("Received source code:");
                System.out.println(request.getSourceCode());

                System.out.println("Received input:");
                System.out.println(request.getInput());

                return new ExecutionResult(
                        "SUCCESS",
                        "10",
                        "",
                        100,
                        0
                );
            }
        };

        ExecutionRequest request = new ExecutionRequest(
                "public class Main { public static void main(String[] args) { System.out.println(10); } }",
                "Java",
                "5 5"
        );

        ExecutionResult result = engine.execute(request);

        System.out.println("Execution status: " + result.getStatus());
        System.out.println("Program output: " + result.getOutput());
    }
}
