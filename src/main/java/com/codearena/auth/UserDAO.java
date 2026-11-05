package com.codearena.auth;

import com.codearena.model.User;

import java.util.List;
import java.util.Optional;

/**
 * Data Access Object interface for user account persistence.
 */
public interface UserDAO {
    /**
     * Persists a new user account into MySQL.
     * @param user user entity with hashed password
     * @return persisted user with generated primary key id
     */
    User create(User user);

    /**
     * Finds a user by their unique email address.
     * @param email user email
     * @return Optional containing the User if found
     */
    Optional<User> findByEmail(String email);

    /**
     * Finds a user by their primary key ID.
     * @param id user ID
     * @return Optional containing the User if found
     */
    Optional<User> findById(int id);

    /**
     * Checks if an email is already registered in the system.
     * @param email email to check
     * @return true if exists, false otherwise
     */
    boolean existsByEmail(String email);

    /**
     * Updates a user's password hash.
     * @param userId user ID
     * @param newPasswordHash new BCrypt hash
     * @return true if updated
     */
    boolean updatePassword(int userId, String newPasswordHash);

    /**
     * Retrieves all active users.
     * @return list of users
     */
    List<User> findAll();
}

