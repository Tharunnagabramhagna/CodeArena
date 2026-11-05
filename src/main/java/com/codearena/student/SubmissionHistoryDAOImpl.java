package com.codearena.student;

import com.codearena.config.DatabaseConfig;
import com.codearena.exception.DatabaseException;
import com.codearena.model.Submission;
import com.codearena.model.SubmissionVerdict;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

/**
 * JDBC implementation of SubmissionHistoryDAO.
 */
public class SubmissionHistoryDAOImpl implements SubmissionHistoryDAO {
    private static final Logger logger = LoggerFactory.getLogger(SubmissionHistoryDAOImpl.class);

    @Override
    public Submission create(Submission sub) {
        String sql = "INSERT INTO submissions (user_id, problem_id, problem_title, language, code, verdict, execution_time_ms, memory_kb) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setInt(1, sub.getUserId());
            stmt.setInt(2, sub.getProblemId());
            stmt.setString(3, sub.getProblemTitle() != null ? sub.getProblemTitle() : "Problem " + sub.getProblemId());
            stmt.setString(4, sub.getLanguage() != null ? sub.getLanguage() : "Java");
            stmt.setString(5, sub.getCode());
            stmt.setString(6, sub.getVerdict() != null ? sub.getVerdict().name() : SubmissionVerdict.PENDING.name());
            stmt.setInt(7, sub.getExecutionTimeMs());
            stmt.setInt(8, sub.getMemoryKb());

            stmt.executeUpdate();

            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    sub.setId(rs.getInt(1));
                }
            }
            return sub;

        } catch (SQLException e) {
            logger.error("Error saving submission for userId {}: {}", sub.getUserId(), e.getMessage(), e);
            throw new DatabaseException("Failed to save submission: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Submission> findByUserId(int userId, int limit, int offset) {
        String sql = "SELECT id, user_id, problem_id, problem_title, language, code, verdict, execution_time_ms, memory_kb, submitted_at " +
                     "FROM submissions WHERE user_id = ? ORDER BY submitted_at DESC LIMIT ? OFFSET ?";
        List<Submission> list = new ArrayList<>();

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, userId);
            stmt.setInt(2, limit > 0 ? limit : 20);
            stmt.setInt(3, Math.max(offset, 0));

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToSubmission(rs));
                }
            }
            return list;

        } catch (SQLException e) {
            logger.error("Error fetching submissions for user {}: {}", userId, e.getMessage(), e);
            throw new DatabaseException("Failed to fetch submission history: " + e.getMessage(), e);
        }
    }

    @Override
    public int countByUserId(int userId) {
        String sql = "SELECT COUNT(*) FROM submissions WHERE user_id = ?";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, userId);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1);
                }
            }
            return 0;

        } catch (SQLException e) {
            logger.error("Error counting submissions for user {}: {}", userId, e.getMessage(), e);
            throw new DatabaseException("Failed to count submissions: " + e.getMessage(), e);
        }
    }

    @Override
    public Map<SubmissionVerdict, Integer> getVerdictStatistics(int userId) {
        String sql = "SELECT verdict, COUNT(*) as cnt FROM submissions WHERE user_id = ? GROUP BY verdict";
        Map<SubmissionVerdict, Integer> stats = new EnumMap<>(SubmissionVerdict.class);

        // Prepopulate with zeroes
        for (SubmissionVerdict v : SubmissionVerdict.values()) {
            stats.put(v, 0);
        }

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, userId);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    SubmissionVerdict v = SubmissionVerdict.fromString(rs.getString("verdict"));
                    stats.put(v, rs.getInt("cnt"));
                }
            }
            return stats;

        } catch (SQLException e) {
            logger.error("Error fetching verdict stats for user {}: {}", userId, e.getMessage(), e);
            throw new DatabaseException("Failed to fetch verdict statistics: " + e.getMessage(), e);
        }
    }

    private Submission mapResultSetToSubmission(ResultSet rs) throws SQLException {
        Submission s = new Submission();
        s.setId(rs.getInt("id"));
        s.setUserId(rs.getInt("user_id"));
        s.setProblemId(rs.getInt("problem_id"));
        s.setProblemTitle(rs.getString("problem_title"));
        s.setLanguage(rs.getString("language"));
        s.setCode(rs.getString("code"));
        s.setVerdict(SubmissionVerdict.fromString(rs.getString("verdict")));
        s.setExecutionTimeMs(rs.getInt("execution_time_ms"));
        s.setMemoryKb(rs.getInt("memory_kb"));
        s.setSubmittedAt(rs.getTimestamp("submitted_at"));
        return s;
    }
}

