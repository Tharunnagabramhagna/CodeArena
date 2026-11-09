
package com.codearena.submission;

import com.codearena.database.DBConnection;
import com.codearena.model.Submission;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class SubmissionDAO {

    private int resolveLanguageId(String language) {
        if (language == null)
            return 1;
        String lower = language.toLowerCase();
        if (lower.contains("python"))
            return 2;
        if (lower.contains("cpp") || lower.contains("c++"))
            return 3;
        return 1; // Default to Java 17
    }

    private int resolveStatusId(String status) {
        if (status == null)
            return 1;
        switch (status.toUpperCase()) {
            case "COMPILING":
                return 2;
            case "RUNNING":
                return 3;
            case "COMPLETED":
                return 4;
            case "SYSTEM_ERROR":
                return 5;
            case "QUEUED":
            case "PENDING":
            default:
                return 1;
        }
    }

    private int resolveVerdictId(String verdict) {
        if (verdict == null)
            return 1;
        switch (verdict.toUpperCase()) {
            case "ACCEPTED":
                return 2;
            case "WRONG_ANSWER":
                return 3;
            case "TIME_LIMIT_EXCEEDED":
                return 4;
            case "MEMORY_LIMIT_EXCEEDED":
                return 5;
            case "COMPILATION_ERROR":
                return 6;
            case "RUNTIME_ERROR":
                return 7;
            case "PENDING":
            default:
                return 1;
        }
    }

    // Convert database result into Submission object
    private Submission mapSubmission(ResultSet resultSet)
            throws SQLException {

        Submission submission = new Submission();

        submission.setId(resultSet.getInt("id"));
        submission.setProblemId(resultSet.getInt("problem_id"));
        submission.setUserId(resultSet.getInt("user_id"));
        submission.setSourceCode(resultSet.getString("source_code"));
        submission.setLanguage(resultSet.getString("language"));
        submission.setStatus(resultSet.getString("status"));
        submission.setVerdict(resultSet.getString("verdict"));
        submission.setSubmittedAt(resultSet.getString("submitted_at"));
        submission.setExecutionTime(resultSet.getLong("execution_time_ms"));
        submission.setMemoryUsed(resultSet.getLong("memory_used_kb"));

        try {
            submission.setSubmissionUid(resultSet.getString("submission_uid"));
        } catch (SQLException ignored) {
        }

        return submission;
    }

    // 1. Save a new submission
    public boolean addSubmission(Submission submission) {

        String sql = "INSERT INTO submissions "
                + "(submission_uid, problem_id, user_id, language_id, status_id, verdict_id, source_code, is_preview) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            if (connection == null) {
                System.out.println("Database connection unavailable!");
                return false;
            }

            String uid = submission.getSubmissionUid();
            if (uid == null || uid.isBlank()) {
                uid = UUID.randomUUID().toString();
                submission.setSubmissionUid(uid);
            }

            int userId = submission.getUserId() > 0 ? submission.getUserId() : 1001;

            statement.setString(1, uid);
            statement.setInt(2, submission.getProblemId());
            statement.setInt(3, userId);
            statement.setInt(4, resolveLanguageId(submission.getLanguage()));
            statement.setInt(5, resolveStatusId(submission.getStatus()));
            statement.setInt(6, resolveVerdictId(submission.getVerdict()));
            statement.setString(7, submission.getSourceCode());
            statement.setBoolean(8, false);

            return statement.executeUpdate() > 0;

        } catch (SQLException e) {
            System.out.println("Error saving submission!");
            e.printStackTrace();
            return false;
        }
    }

    // 2. Retrieve a submission using its ID
    public Submission getSubmissionById(int submissionId) {

        String sql = "SELECT s.id, s.submission_uid, s.problem_id, s.user_id, s.source_code, "
                + "COALESCE(l.name, 'Java') AS language, "
                + "COALESCE(st.code, 'QUEUED') AS status, "
                + "COALESCE(sv.code, 'PENDING') AS verdict, "
                + "s.submitted_at, s.execution_time_ms, s.memory_used_kb "
                + "FROM submissions s "
                + "LEFT JOIN languages l ON s.language_id = l.id "
                + "LEFT JOIN submission_statuses st ON s.status_id = st.id "
                + "LEFT JOIN submission_verdicts sv ON s.verdict_id = sv.id "
                + "WHERE s.id = ?";

        try (Connection connection = DBConnection.getConnection();
                PreparedStatement statement = connection.prepareStatement(sql)) {

            if (connection == null) {
                return null;
            }

            statement.setInt(1, submissionId);

            try (ResultSet resultSet = statement.executeQuery()) {

                if (resultSet.next()) {
                    return mapSubmission(resultSet);
                }
            }

        } catch (SQLException e) {
            System.out.println("Error retrieving submission!");
            e.printStackTrace();
        }

        return null;
    }

    // 3. Retrieve all submissions made by a particular user
    public List<Submission> getSubmissionsByUserId(int userId) {

        List<Submission> submissions = new ArrayList<>();

        String sql = "SELECT s.id, s.submission_uid, s.problem_id, s.user_id, s.source_code, "
                + "COALESCE(l.name, 'Java') AS language, "
                + "COALESCE(st.code, 'QUEUED') AS status, "
                + "COALESCE(sv.code, 'PENDING') AS verdict, "
                + "s.submitted_at, s.execution_time_ms, s.memory_used_kb "
                + "FROM submissions s "
                + "LEFT JOIN languages l ON s.language_id = l.id "
                + "LEFT JOIN submission_statuses st ON s.status_id = st.id "
                + "LEFT JOIN submission_verdicts sv ON s.verdict_id = sv.id "
                + "WHERE s.user_id = ? ORDER BY s.submitted_at DESC";

        try (Connection connection = DBConnection.getConnection();
                PreparedStatement statement = connection.prepareStatement(sql)) {

            if (connection == null) {
                return submissions;
            }

            statement.setInt(1, userId);

            try (ResultSet resultSet = statement.executeQuery()) {

                while (resultSet.next()) {
                    submissions.add(mapSubmission(resultSet));
                }
            }

        } catch (SQLException e) {
            System.out.println("Error retrieving user submissions!");
            e.printStackTrace();
        }

        return submissions;
    }

    // 4. Retrieve all submissions for a particular problem
    public List<Submission> getSubmissionsByProblemId(int problemId) {

        List<Submission> submissions = new ArrayList<>();

        String sql = "SELECT s.id, s.submission_uid, s.problem_id, s.user_id, s.source_code, "
                + "COALESCE(l.name, 'Java') AS language, "
                + "COALESCE(st.code, 'QUEUED') AS status, "
                + "COALESCE(sv.code, 'PENDING') AS verdict, "
                + "s.submitted_at, s.execution_time_ms, s.memory_used_kb "
                + "FROM submissions s "
                + "LEFT JOIN languages l ON s.language_id = l.id "
                + "LEFT JOIN submission_statuses st ON s.status_id = st.id "
                + "LEFT JOIN submission_verdicts sv ON s.verdict_id = sv.id "
                + "WHERE s.problem_id = ? ORDER BY s.submitted_at DESC";

        try (Connection connection = DBConnection.getConnection();
                PreparedStatement statement = connection.prepareStatement(sql)) {

            if (connection == null) {
                return submissions;
            }

            statement.setInt(1, problemId);

            try (ResultSet resultSet = statement.executeQuery()) {

                while (resultSet.next()) {
                    submissions.add(mapSubmission(resultSet));
                }
            }

        } catch (SQLException e) {
            System.out.println("Error retrieving problem submissions!");
            e.printStackTrace();
        }

        return submissions;
    }

    // 5. Update submission status, verdict and resource usage
    public boolean updateSubmissionResult(
            int submissionId,
            String status,
            String verdict,
            long executionTime,
            long memoryUsed) {

        String sql = "UPDATE submissions SET "
                + "status_id = ?, verdict_id = ?, execution_time_ms = ?, memory_used_kb = ?, "
                + "judged_at = CURRENT_TIMESTAMP(3) "
                + "WHERE id = ?";

        try (Connection connection = DBConnection.getConnection();
                PreparedStatement statement = connection.prepareStatement(sql)) {

            if (connection == null) {
                System.out.println("Database connection unavailable!");
                return false;
            }

            statement.setInt(1, resolveStatusId(status));
            statement.setInt(2, resolveVerdictId(verdict));
            statement.setLong(3, executionTime);
            statement.setLong(4, memoryUsed);
            statement.setInt(5, submissionId);

            return statement.executeUpdate() > 0;

        } catch (SQLException e) {
            System.out.println("Error updating submission result!");
            e.printStackTrace();
            return false;
        }
    }
}