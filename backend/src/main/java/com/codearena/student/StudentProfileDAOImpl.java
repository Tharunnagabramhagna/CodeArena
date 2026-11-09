package com.codearena.student;

import com.codearena.config.DatabaseConfig;
import com.codearena.exception.DatabaseException;
import com.codearena.model.StudentProfile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;
import java.util.Optional;

/**
 * JDBC implementation of StudentProfileDAO.
 */
public class StudentProfileDAOImpl implements StudentProfileDAO {
    private static final Logger logger = LoggerFactory.getLogger(StudentProfileDAOImpl.class);

    @Override
    public StudentProfile create(StudentProfile profile) {
        String sql = "INSERT INTO user_profiles (user_id, bio, github_username, avatar_url, preferred_track, reputation_points) " +
                     "VALUES (?, ?, ?, ?, ?, ?) " +
                     "ON DUPLICATE KEY UPDATE bio = VALUES(bio), github_username = VALUES(github_username), reputation_points = VALUES(reputation_points)";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, profile.getUserId());
            stmt.setString(2, profile.getBio() != null ? profile.getBio() : "CodeArena Student & Developer");
            stmt.setString(3, profile.getGithubUrl());
            stmt.setString(4, profile.getAvatarUrl());
            stmt.setString(5, profile.getPreferredLanguage() != null ? profile.getPreferredLanguage() : "Java");
            stmt.setInt(6, profile.getRankingScore());

            stmt.executeUpdate();
            profile.setId(profile.getUserId());
            return profile;

        } catch (SQLException e) {
            logger.error("Error creating student profile: {}", e.getMessage(), e);
            throw new DatabaseException("Failed to create student profile: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<StudentProfile> findByUserId(int userId) {
        String sql = "SELECT user_id, bio, github_username AS github_url, NULL AS linkedin_url, " +
                     "preferred_track AS preferred_language, avatar_url, reputation_points AS ranking_score, " +
                     "0 AS problems_solved, 0 AS streak_days, CURRENT_DATE() AS last_active_date, " +
                     "created_at, updated_at " +
                     "FROM user_profiles WHERE user_id = ?";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, userId);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapResultSetToProfile(rs));
                }
            }
            return Optional.empty();

        } catch (SQLException e) {
            logger.error("Error finding student profile for userId {}: {}", userId, e.getMessage(), e);
            throw new DatabaseException("Failed to load student profile: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean updateProfile(StudentProfile profile) {
        String sql = "UPDATE user_profiles SET bio = ?, github_username = ?, avatar_url = ? " +
                     "WHERE user_id = ?";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, profile.getBio());
            stmt.setString(2, profile.getGithubUrl());
            stmt.setString(3, profile.getAvatarUrl());
            stmt.setInt(4, profile.getUserId());

            return stmt.executeUpdate() > 0;

        } catch (SQLException e) {
            logger.error("Error updating student profile for userId {}: {}", profile.getUserId(), e.getMessage(), e);
            throw new DatabaseException("Failed to update student profile: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean incrementProblemsSolved(int userId, int scoreIncrement) {
        String sql = "UPDATE user_profiles SET reputation_points = reputation_points + ? " +
                     "WHERE user_id = ?";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, scoreIncrement);
            stmt.setInt(2, userId);

            return stmt.executeUpdate() > 0;

        } catch (SQLException e) {
            logger.error("Error incrementing solved count for userId {}: {}", userId, e.getMessage(), e);
            throw new DatabaseException("Failed to update solved metrics: " + e.getMessage(), e);
        }
    }

    private StudentProfile mapResultSetToProfile(ResultSet rs) throws SQLException {
        StudentProfile p = new StudentProfile();
        p.setId(rs.getInt("user_id"));
        p.setUserId(rs.getInt("user_id"));
        p.setBio(rs.getString("bio"));
        p.setGithubUrl(rs.getString("github_url"));
        p.setLinkedinUrl(rs.getString("linkedin_url"));
        p.setPreferredLanguage(rs.getString("preferred_language"));
        p.setAvatarUrl(rs.getString("avatar_url"));
        p.setRankingScore(rs.getInt("ranking_score"));
        p.setProblemsSolved(rs.getInt("problems_solved"));
        p.setStreakDays(rs.getInt("streak_days"));
        p.setLastActiveDate(rs.getDate("last_active_date"));
        p.setCreatedAt(rs.getTimestamp("created_at"));
        p.setUpdatedAt(rs.getTimestamp("updated_at"));
        return p;
    }
}

