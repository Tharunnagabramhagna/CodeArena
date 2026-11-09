
package com.codearena.judge;

public class TestExecutionRequest {

    public static void main(String[] args) {

        ExecutionRequest request = new ExecutionRequest(
                "public class Main { public static void main(String[] args) { System.out.println(10); } }",
                "5 5",
                "Java"
        );

        System.out.println("Source Code: " + request.getSourceCode());
        System.out.println("Input: " + request.getInput());
        System.out.println("Language: " + request.getLanguage());
    }
}
