package com.codearena.auth;

import com.codearena.config.DatabaseConfig;
import com.codearena.exception.DatabaseException;
import com.codearena.model.Role;
import com.codearena.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * JDBC implementation of UserDAO.
 * Manages database interaction for users table with robust error handling and resource cleanup.
 */
public class UserDAOImpl implements UserDAO {
    private static final Logger logger = LoggerFactory.getLogger(UserDAOImpl.class);

    @Override
    public User create(User user) {
        String sql = "INSERT INTO users (email, password_hash, salt, full_name, role, is_active) " +
                     "VALUES (?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, user.getEmail().toLowerCase().trim());
            stmt.setString(2, user.getPasswordHash());
            stmt.setString(3, user.getSalt());
            stmt.setString(4, user.getFullName().trim());
            stmt.setString(5, user.getRole() != null ? user.getRole().name() : Role.STUDENT.name());
            stmt.setBoolean(6, user.isActive());

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new DatabaseException("Creating user failed, no rows affected.", null);
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    user.setId(generatedKeys.getInt(1));
                } else {
                    throw new DatabaseException("Creating user failed, no ID obtained.", null);
                }
            }

            logger.info("Created new user: {} (ID: {})", user.getEmail(), user.getId());
            return user;

        } catch (SQLException e) {
            logger.error("Error creating user: {}", e.getMessage(), e);
            throw new DatabaseException("Database error occurred while creating user: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<User> findByEmail(String email) {
        String sql = "SELECT id, email, password_hash, salt, full_name, role, is_active, created_at, updated_at " +
                     "FROM users WHERE email = ?";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, email.toLowerCase().trim());

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapResultSetToUser(rs));
                }
            }
            return Optional.empty();

        } catch (SQLException e) {
            logger.error("Error finding user by email: {}", e.getMessage(), e);
            throw new DatabaseException("Database error occurred while looking up user: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<User> findById(int id) {
        String sql = "SELECT id, email, password_hash, salt, full_name, role, is_active, created_at, updated_at " +
                     "FROM users WHERE id = ?";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapResultSetToUser(rs));
                }
            }
            return Optional.empty();

        } catch (SQLException e) {
            logger.error("Error finding user by ID: {}", e.getMessage(), e);
            throw new DatabaseException("Database error occurred while looking up user by ID: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean existsByEmail(String email) {
        String sql = "SELECT 1 FROM users WHERE email = ? LIMIT 1";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, email.toLowerCase().trim());

            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next();
            }

        } catch (SQLException e) {
            logger.error("Error checking email existence: {}", e.getMessage(), e);
            throw new DatabaseException("Database error occurred while checking email existence: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean updatePassword(int userId, String newPasswordHash) {
        String sql = "UPDATE users SET password_hash = ? WHERE id = ?";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, newPasswordHash);
            stmt.setInt(2, userId);

            return stmt.executeUpdate() > 0;

        } catch (SQLException e) {
            logger.error("Error updating user password: {}", e.getMessage(), e);
            throw new DatabaseException("Database error occurred while updating password: " + e.getMessage(), e);
        }
    }

    @Override
    public List<User> findAll() {
        String sql = "SELECT id, email, password_hash, salt, full_name, role, is_active, created_at, updated_at FROM users";
        List<User> list = new ArrayList<>();

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                list.add(mapResultSetToUser(rs));
            }
            return list;

        } catch (SQLException e) {
            logger.error("Error fetching all users: {}", e.getMessage(), e);
            throw new DatabaseException("Database error occurred while fetching users: " + e.getMessage(), e);
        }
    }

    private User mapResultSetToUser(ResultSet rs) throws SQLException {
        User user = new User();
        user.setId(rs.getInt("id"));
        user.setEmail(rs.getString("email"));
        user.setPasswordHash(rs.getString("password_hash"));
        user.setSalt(rs.getString("salt"));
        user.setFullName(rs.getString("full_name"));
        user.setRole(Role.fromString(rs.getString("role")));
        user.setActive(rs.getBoolean("is_active"));
        user.setCreatedAt(rs.getTimestamp("created_at"));
        user.setUpdatedAt(rs.getTimestamp("updated_at"));
        return user;
    }
}

