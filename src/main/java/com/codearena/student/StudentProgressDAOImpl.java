package com.codearena.student;

import com.codearena.config.DatabaseConfig;
import com.codearena.exception.DatabaseException;
import com.codearena.model.ProficiencyLevel;
import com.codearena.model.StudentProgress;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * JDBC implementation of StudentProgressDAO.
 */
public class StudentProgressDAOImpl implements StudentProgressDAO {
    private static final Logger logger = LoggerFactory.getLogger(StudentProgressDAOImpl.class);

    private static final String[] DEFAULT_TOPICS = {
            "Arrays & Hashing",
            "Object-Oriented Programming",
            "Strings & Parsing",
            "Two Pointers & Sliding Window",
            "Recursion & Backtracking",
            "Data Structures (Stack, Queue, LinkedList)",
            "Trees & Graphs",
            "Dynamic Programming"
    };

    @Override
    public List<StudentProgress> findByUserId(int userId) {
        String sql = "SELECT id, user_id, topic, problems_attempted, problems_solved, proficiency_level, last_activity " +
                     "FROM student_progress WHERE user_id = ? ORDER BY problems_solved DESC, topic ASC";
        List<StudentProgress> list = new ArrayList<>();

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, userId);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToProgress(rs));
                }
            }
            return list;

        } catch (SQLException e) {
            logger.error("Error fetching progress for userId {}: {}", userId, e.getMessage(), e);
            throw new DatabaseException("Failed to load progress records: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<StudentProgress> findByUserAndTopic(int userId, String topic) {
        String sql = "SELECT id, user_id, topic, problems_attempted, problems_solved, proficiency_level, last_activity " +
                     "FROM student_progress WHERE user_id = ? AND topic = ?";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, userId);
            stmt.setString(2, topic);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapResultSetToProgress(rs));
                }
            }
            return Optional.empty();

        } catch (SQLException e) {
            logger.error("Error fetching progress for userId {} topic {}: {}", userId, topic, e.getMessage(), e);
            throw new DatabaseException("Failed to find topic progress: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean recordProgress(int userId, String topic, boolean solved) {
        String sql = "INSERT INTO student_progress (user_id, topic, problems_attempted, problems_solved, proficiency_level) " +
                     "VALUES (?, ?, 1, ?, ?) " +
                     "ON DUPLICATE KEY UPDATE " +
                     "problems_attempted = problems_attempted + 1, " +
                     "problems_solved = problems_solved + ?, " +
                     "proficiency_level = CASE " +
                     "    WHEN (problems_solved + ?) >= 10 THEN 'ADVANCED' " +
                     "    WHEN (problems_solved + ?) >= 4 THEN 'INTERMEDIATE' " +
                     "    ELSE 'BEGINNER' " +
                     "END, " +
                     "last_activity = CURRENT_TIMESTAMP";

        int solvedInc = solved ? 1 : 0;
        ProficiencyLevel initialLevel = solved ? ProficiencyLevel.INTERMEDIATE : ProficiencyLevel.BEGINNER;

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, userId);
            stmt.setString(2, topic);
            stmt.setInt(3, solvedInc);
            stmt.setString(4, initialLevel.name());
            stmt.setInt(5, solvedInc);
            stmt.setInt(6, solvedInc);
            stmt.setInt(7, solvedInc);

            return stmt.executeUpdate() > 0;

        } catch (SQLException e) {
            logger.error("Error recording progress for user {}: {}", userId, e.getMessage(), e);
            throw new DatabaseException("Failed to record progress: " + e.getMessage(), e);
        }
    }

    @Override
    public void initializeDefaultTopics(int userId) {
        String sql = "INSERT IGNORE INTO student_progress (user_id, topic, problems_attempted, problems_solved, proficiency_level) " +
                     "VALUES (?, ?, 0, 0, 'BEGINNER')";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            for (String topic : DEFAULT_TOPICS) {
                stmt.setInt(1, userId);
                stmt.setString(2, topic);
                stmt.addBatch();
            }
            stmt.executeBatch();

        } catch (SQLException e) {
            logger.warn("Could not batch initialize default topics for user {}: {}", userId, e.getMessage());
        }
    }

    private StudentProgress mapResultSetToProgress(ResultSet rs) throws SQLException {
        StudentProgress p = new StudentProgress();
        p.setId(rs.getInt("id"));
        p.setUserId(rs.getInt("user_id"));
        p.setTopic(rs.getString("topic"));
        p.setProblemsAttempted(rs.getInt("problems_attempted"));
        p.setProblemsSolved(rs.getInt("problems_solved"));
        p.setProficiencyLevel(ProficiencyLevel.fromString(rs.getString("proficiency_level")));
        p.setLastActivity(rs.getTimestamp("last_activity"));
        return p;
    }
}

