package com.codearena.util;

import com.codearena.exception.ValidationException;

public class TestValidationUtil {

    public static void main(String[] args) {

        // Test 1: Valid emails
        ValidationUtil.validateEmail("kavya@codearena.com");
        ValidationUtil.validateEmail("student.test+arena@domain.co.in");
        System.out.println("Test 1 (Valid emails): PASSED");

        // Test 2: Invalid emails
        boolean threw = false;
        try {
            ValidationUtil.validateEmail("not-an-email");
        } catch (ValidationException e) {
            threw = true;
        }
        if (!threw) {
            System.err.println("Test 2 Failed: Expected ValidationException for invalid email!");
            System.exit(1);
        }
        System.out.println("Test 2 (Invalid email rejection): PASSED");

        // Test 3: Short password rejection
        threw = false;
        try {
            ValidationUtil.validatePassword("12345");
        } catch (ValidationException e) {
            threw = true;
        }
        if (!threw) {
            System.err.println("Test 3 Failed: Expected ValidationException for short password!");
            System.exit(1);
        }
        ValidationUtil.validatePassword("123456");
        System.out.println("Test 3 (Password length boundary): PASSED");

        // Test 4: XSS input sanitization
        String input = "<script>alert('hack')</script>";
        String sanitized = ValidationUtil.sanitize(input);
        if (sanitized.contains("<") || sanitized.contains(">")) {
            System.err.println("Test 4 Failed: Sanitization did not escape tags!");
            System.exit(1);
        }
        System.out.println("Test 4 (XSS Sanitization): PASSED");

        System.out.println("ALL ValidationUtil tests PASSED successfully!");
    }
}
