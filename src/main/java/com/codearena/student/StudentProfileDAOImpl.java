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
        String sql = "INSERT INTO student_profiles (user_id, bio, github_url, linkedin_url, preferred_language, ranking_score, problems_solved, streak_days, last_active_date) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_DATE())";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setInt(1, profile.getUserId());
            stmt.setString(2, profile.getBio() != null ? profile.getBio() : "CodeArena Student & Developer");
            stmt.setString(3, profile.getGithubUrl());
            stmt.setString(4, profile.getLinkedinUrl());
            stmt.setString(5, profile.getPreferredLanguage() != null ? profile.getPreferredLanguage() : "Java");
            stmt.setInt(6, profile.getRankingScore());
            stmt.setInt(7, profile.getProblemsSolved());
            stmt.setInt(8, profile.getStreakDays());

            stmt.executeUpdate();

            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    profile.setId(rs.getInt(1));
                }
            }
            return profile;

        } catch (SQLException e) {
            logger.error("Error creating student profile: {}", e.getMessage(), e);
            throw new DatabaseException("Failed to create student profile: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<StudentProfile> findByUserId(int userId) {
        String sql = "SELECT id, user_id, bio, github_url, linkedin_url, preferred_language, avatar_url, ranking_score, problems_solved, streak_days, last_active_date, created_at, updated_at " +
                     "FROM student_profiles WHERE user_id = ?";

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
        String sql = "UPDATE student_profiles SET bio = ?, github_url = ?, linkedin_url = ?, preferred_language = ?, avatar_url = ? " +
                     "WHERE user_id = ?";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, profile.getBio());
            stmt.setString(2, profile.getGithubUrl());
            stmt.setString(3, profile.getLinkedinUrl());
            stmt.setString(4, profile.getPreferredLanguage());
            stmt.setString(5, profile.getAvatarUrl());
            stmt.setInt(6, profile.getUserId());

            return stmt.executeUpdate() > 0;

        } catch (SQLException e) {
            logger.error("Error updating student profile for userId {}: {}", profile.getUserId(), e.getMessage(), e);
            throw new DatabaseException("Failed to update student profile: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean incrementProblemsSolved(int userId, int scoreIncrement) {
        String sql = "UPDATE student_profiles SET problems_solved = problems_solved + 1, ranking_score = ranking_score + ? " +
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
        p.setId(rs.getInt("id"));
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

