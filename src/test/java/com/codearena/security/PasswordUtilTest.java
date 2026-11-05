package com.codearena.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class PasswordUtilTest {

    @Test
    @DisplayName("Should correctly hash and verify password with BCrypt")
    public void testHashAndVerifyPassword() {
        String plain = "SecretP@ssword123";
        String hash = PasswordUtil.hashPassword(plain);

        assertNotNull(hash);
        assertTrue(hash.startsWith("$2a$") || hash.startsWith("$2b$"));
        assertTrue(PasswordUtil.checkPassword(plain, hash));
        assertFalse(PasswordUtil.checkPassword("WrongP@ssword", hash));
    }

    @Test
    @DisplayName("Should generate random secure salts")
    public void testGenerateSalt() {
        String salt1 = PasswordUtil.generateRandomSalt();
        String salt2 = PasswordUtil.generateRandomSalt();

        assertNotNull(salt1);
        assertNotNull(salt2);
        assertNotEquals(salt1, salt2);
    }
}

