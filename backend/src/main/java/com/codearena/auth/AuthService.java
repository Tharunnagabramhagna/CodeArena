package com.codearena.auth;

import com.codearena.model.User;

/**
 * Service handling authentication operations, password verification, and registration workflows.
 */
public interface AuthService {
    /**
     * Registers a new student account.
     * @param fullName student full name
     * @param email unique email address
     * @param password plain text password (will be hashed)
     * @return created User entity
     */
    User register(String fullName, String email, String password);

    /**
     * Authenticates user credentials.
     * @param email user email
     * @param plainPassword plain text password
     * @param clientIp client IP address for audit logging
     * @return authenticated User entity with profile
     */
    User login(String email, String plainPassword, String clientIp);

    /**
     * Retrieves the current user along with their student profile.
     * @param userId user ID
     * @return User with linked StudentProfile
     */
    User getUserWithProfile(int userId);

    /**
     * Changes password for an authenticated user.
     */
    boolean changePassword(int userId, String oldPassword, String newPassword);
}

