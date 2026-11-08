
package com.codearena.judge;

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
                        "10",
                        "",
                        false,
                        true,
                        0,
                        100,
                        1024
                );
            }
        };

        ExecutionRequest request = new ExecutionRequest(
                "public class Main { public static void main(String[] args) { System.out.println(10); } }",
                "5 5",
                "Java"
        );

        ExecutionResult result = engine.execute(request);

        System.out.println("Execution successful: " + result.isSuccessful());
        System.out.println("Program output: " + result.getOutput());
    }
}
