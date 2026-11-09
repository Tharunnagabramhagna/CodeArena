package com.codearena.auth;

import com.codearena.exception.AuthenticationException;
import com.codearena.exception.ResourceNotFoundException;
import com.codearena.exception.UserAlreadyExistsException;
import com.codearena.exception.ValidationException;
import com.codearena.model.Role;
import com.codearena.model.StudentProfile;
import com.codearena.model.User;
import com.codearena.security.PasswordUtil;
import com.codearena.student.StudentProfileDAO;
import com.codearena.student.StudentProfileDAOImpl;
import com.codearena.student.StudentProgressDAO;
import com.codearena.student.StudentProgressDAOImpl;
import com.codearena.util.AsyncActivityService;
import com.codearena.util.ValidationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Implementation of AuthService incorporating password hashing, validation,
 * automatic profile creation, and asynchronous audit trails.
 */
public class AuthServiceImpl implements AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserDAO userDAO;
    private final StudentProfileDAO profileDAO;
    private final StudentProgressDAO progressDAO;

    public AuthServiceImpl() {
        this.userDAO = new UserDAOImpl();
        this.profileDAO = new StudentProfileDAOImpl();
        this.progressDAO = new StudentProgressDAOImpl();
    }

    public AuthServiceImpl(UserDAO userDAO, StudentProfileDAO profileDAO, StudentProgressDAO progressDAO) {
        this.userDAO = userDAO;
        this.profileDAO = profileDAO;
        this.progressDAO = progressDAO;
    }

    @Override
    public User register(String fullName, String email, String password) {
        ValidationUtil.validateRegistration(fullName, email, password);

        String normalizedEmail = email.trim().toLowerCase();
        if (userDAO.existsByEmail(normalizedEmail)) {
            throw new UserAlreadyExistsException("An account with this email address already exists.");
        }

        // Secure password hashing with BCrypt
        String hashedPassword = PasswordUtil.hashPassword(password);
        String salt = PasswordUtil.generateRandomSalt();

        User newUser = new User(normalizedEmail, hashedPassword, fullName.trim(), Role.STUDENT);
        newUser.setSalt(salt);

        User createdUser = userDAO.create(newUser);

        // Auto-create initial student profile
        try {
            StudentProfile profile = new StudentProfile(createdUser.getId());
            profile.setBio("Student coder at CodeArena");
            profile.setPreferredLanguage("Java");
            StudentProfile createdProfile = profileDAO.create(profile);
            createdUser.setProfile(createdProfile);

            // Seed default topic learning progress
            progressDAO.initializeDefaultTopics(createdUser.getId());
        } catch (Exception e) {
            logger.warn("Could not initialize student profile for newly registered user {}: {}", createdUser.getId(), e.getMessage());
        }

        // Asynchronous audit logging
        AsyncActivityService.logActivityAsync(
                createdUser.getId(),
                "USER_REGISTERED",
                "New account registered: " + createdUser.getEmail(),
                "0.0.0.0"
        );

        logger.info("Student successfully registered: {} (ID: {})", createdUser.getEmail(), createdUser.getId());
        return createdUser;
    }

    @Override
    public User login(String email, String plainPassword, String clientIp) {
        if (email == null || email.isBlank() || plainPassword == null || plainPassword.isEmpty()) {
            throw new ValidationException("Email and password cannot be empty.");
        }

        String normalizedEmail = email.trim().toLowerCase();
        User user = userDAO.findByEmail(normalizedEmail)
                .orElseThrow(() -> new AuthenticationException("Invalid email address or password."));

        if (!user.isActive()) {
            throw new AuthenticationException("Your account has been deactivated. Please contact support.");
        }

        // Verify password against stored hash
        boolean passwordValid = PasswordUtil.checkPassword(plainPassword, user.getPasswordHash());
        if (!passwordValid) {
            logger.warn("Failed login attempt for user: {}", normalizedEmail);
            throw new AuthenticationException("Invalid email address or password.");
        }

        // Load profile
        profileDAO.findByUserId(user.getId()).ifPresent(user::setProfile);

        // Multithreaded asynchronous background operations:
        // 1. Audit log
        AsyncActivityService.logActivityAsync(user.getId(), "USER_LOGIN", "Successful login", clientIp);
        // 2. Daily streak tracking
        AsyncActivityService.updateStreakAsync(user.getId());

        logger.info("Successful login for user: {} (ID: {})", user.getEmail(), user.getId());
        return user;
    }

    @Override
    public User getUserWithProfile(int userId) {
        User user = userDAO.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        profileDAO.findByUserId(userId).ifPresent(user::setProfile);
        return user;
    }

    @Override
    public boolean changePassword(int userId, String oldPassword, String newPassword) {
        ValidationUtil.validatePassword(newPassword);

        User user = userDAO.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!PasswordUtil.checkPassword(oldPassword, user.getPasswordHash())) {
            throw new AuthenticationException("Current password does not match.");
        }

        String newHash = PasswordUtil.hashPassword(newPassword);
        boolean updated = userDAO.updatePassword(userId, newHash);
        if (updated) {
            AsyncActivityService.logActivityAsync(userId, "PASSWORD_CHANGED", "Password successfully updated", "0.0.0.0");
        }
        return updated;
    }
}

