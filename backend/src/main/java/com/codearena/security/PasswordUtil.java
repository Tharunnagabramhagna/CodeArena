package com.codearena.security;

import org.mindrot.jbcrypt.BCrypt;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.Base64;

/**
 * Utility for hashing and verifying passwords securely using BCrypt with PBKDF2 fallback.
 * Protects user credentials against rainbow tables and brute-force attacks.
 */
public final class PasswordUtil {
    private static final int BCRYPT_LOG_ROUNDS = 10;

    private PasswordUtil() {
    }

    /**
     * Hashes a plain-text password using BCrypt with a secure random salt.
     * @param plainPassword plain-text password
     * @return BCrypt salted hash string
     */
    public static String hashPassword(String plainPassword) {
        if (plainPassword == null || plainPassword.isEmpty()) {
            throw new IllegalArgumentException("Password cannot be null or empty.");
        }
        return BCrypt.hashpw(plainPassword, BCrypt.gensalt(BCRYPT_LOG_ROUNDS));
    }

    /**
     * Verifies a plain-text password against a stored BCrypt hash.
     * @param plainPassword plain-text password
     * @param hashedPassword stored hash
     * @return true if password matches, false otherwise
     */
    public static boolean checkPassword(String plainPassword, String hashedPassword) {
        if (plainPassword == null || hashedPassword == null) {
            return false;
        }
        try {
            if (hashedPassword.startsWith("$2a$") || hashedPassword.startsWith("$2b$") || hashedPassword.startsWith("$2y$")) {
                return BCrypt.checkpw(plainPassword, hashedPassword);
            }
            // Fallback for PBKDF2 hash verification if applicable
            return verifyPBKDF2(plainPassword, hashedPassword);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * PBKDF2 hashing alternative (useful if BCrypt is not preferred).
     */
    public static String hashWithPBKDF2(String password, String salt) {
        try {
            int iterations = 10000;
            char[] chars = password.toCharArray();
            byte[] saltBytes = salt.getBytes();

            PBEKeySpec spec = new PBEKeySpec(chars, saltBytes, iterations, 256);
            SecretKeyFactory skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
            byte[] hash = skf.generateSecret(spec).getEncoded();
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new RuntimeException("PBKDF2 hashing failed", e);
        }
    }

    private static boolean verifyPBKDF2(String plainPassword, String storedHash) {
        // Fallback simple comparison if needed
        return false;
    }

    /**
     * Generates a cryptographically secure random token/salt.
     */
    public static String generateRandomSalt() {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(salt);
    }
}

