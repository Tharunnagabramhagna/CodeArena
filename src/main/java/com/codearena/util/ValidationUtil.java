package com.codearena.util;

import com.codearena.exception.ValidationException;

import java.util.regex.Pattern;

/**
 * Validates and sanitizes incoming user input.
 */
public final class ValidationUtil {
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$"
    );

    private ValidationUtil() {
    }

    public static void validateRegistration(String fullName, String email, String password) {
        if (fullName == null || fullName.trim().length() < 2) {
            throw new ValidationException("Full name must be at least 2 characters long.");
        }
        if (fullName.trim().length() > 100) {
            throw new ValidationException("Full name cannot exceed 100 characters.");
        }
        validateEmail(email);
        validatePassword(password);
    }

    public static void validateEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new ValidationException("Email address is required.");
        }
        if (!EMAIL_PATTERN.matcher(email.trim()).matches()) {
            throw new ValidationException("Please provide a valid email address.");
        }
    }

    public static void validatePassword(String password) {
        if (password == null || password.length() < 6) {
            throw new ValidationException("Password must be at least 6 characters long.");
        }
        if (password.length() > 128) {
            throw new ValidationException("Password is too long (maximum 128 characters).");
        }
    }

    public static String sanitize(String input) {
        if (input == null) return null;
        return input.trim()
                .replace("<", "&lt;")
                .replace(">", "&gt;");
    }
}

