package com.codearena.util;

import com.codearena.exception.ValidationException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class ValidationUtilTest {

    @Test
    @DisplayName("Should accept valid email addresses")
    public void testValidEmail() {
        assertDoesNotThrow(() -> ValidationUtil.validateEmail("kavya@codearena.com"));
        assertDoesNotThrow(() -> ValidationUtil.validateEmail("student.test+arena@domain.co.in"));
    }

    @Test
    @DisplayName("Should reject invalid email addresses")
    public void testInvalidEmail() {
        assertThrows(ValidationException.class, () -> ValidationUtil.validateEmail("not-an-email"));
        assertThrows(ValidationException.class, () -> ValidationUtil.validateEmail("missing@tld"));
        assertThrows(ValidationException.class, () -> ValidationUtil.validateEmail(""));
        assertThrows(ValidationException.class, () -> ValidationUtil.validateEmail(null));
    }

    @Test
    @DisplayName("Should reject passwords shorter than 6 characters")
    public void testPasswordLength() {
        assertThrows(ValidationException.class, () -> ValidationUtil.validatePassword("12345"));
        assertDoesNotThrow(() -> ValidationUtil.validatePassword("123456"));
    }

    @Test
    @DisplayName("Should sanitize HTML special characters against XSS")
    public void testSanitize() {
        String input = "<script>alert('hack')</script>";
        String sanitized = ValidationUtil.sanitize(input);
        assertFalse(sanitized.contains("<"));
        assertFalse(sanitized.contains(">"));
    }
}

