package com.codearena.service;

public class TestAIAssistantService {

    public static void main(String[] args) {

        AIAssistantService service = new AIAssistantService();

        // Test 1: Empty question handling
        String r1 = service.generateResponse("");
        if (!r1.contains("Please enter a question")) {
            System.err.println("Test 1 Failed: " + r1);
            System.exit(1);
        }
        System.out.println("Test 1 (Empty question): PASSED");

        // Test 2: Recursion concept fallback
        String r2 = service.generateResponse("Can you explain recursion in Java?");
        if (!r2.contains("Recursion is a programming technique")) {
            System.err.println("Test 2 Failed: " + r2);
            System.exit(1);
        }
        System.out.println("Test 2 (Recursion fallback): PASSED");

        // Test 3: Array concept fallback
        String r3 = service.generateResponse("How do arrays work?");
        if (!r3.contains("array stores multiple values")) {
            System.err.println("Test 3 Failed: " + r3);
            System.exit(1);
        }
        System.out.println("Test 3 (Array fallback): PASSED");

        // Test 4: OOP concept fallback
        String r4 = service.generateResponse("What are the main principles of oops?");
        if (!r4.contains("OOP principles")) {
            System.err.println("Test 4 Failed: " + r4);
            System.exit(1);
        }
        System.out.println("Test 4 (OOP fallback): PASSED");

        // Test 5: HashMap concept fallback
        String r5 = service.generateResponse("How does a HashMap store elements?");
        if (!r5.contains("key-value pairs")) {
            System.err.println("Test 5 Failed: " + r5);
            System.exit(1);
        }
        System.out.println("Test 5 (HashMap fallback): PASSED");

        System.out.println("ALL AIAssistantService tests PASSED successfully!");
    }
}
