
package com.codearena.submission;

import com.codearena.database.DBConnection;
import com.codearena.model.Submission;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class SubmissionDAO {

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
        submission.setExecutionTime(resultSet.getLong("execution_time"));
        submission.setMemoryUsed(resultSet.getLong("memory_used"));

        return submission;
    }

    // 1. Save a new submission
    public boolean addSubmission(Submission submission) {

        String sql = "INSERT INTO submissions "
                + "(problem_id, user_id, source_code, language, status, verdict) "
                + "VALUES (?, ?, ?, ?, ?, ?)";

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            if (connection == null) {
                System.out.println("Database connection unavailable!");
                return false;
            }

            statement.setInt(1, submission.getProblemId());
            statement.setInt(2, submission.getUserId());
            statement.setString(3, submission.getSourceCode());
            statement.setString(4, submission.getLanguage());
            statement.setString(5, submission.getStatus());
            statement.setString(6, submission.getVerdict());

            return statement.executeUpdate() > 0;

        } catch (SQLException e) {
            System.out.println("Error saving submission!");
            e.printStackTrace();
            return false;
        }
    }

    // 2. Retrieve a submission using its ID
    public Submission getSubmissionById(int submissionId) {

        String sql = "SELECT * FROM submissions WHERE id = ?";

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

        String sql = "SELECT * FROM submissions "
                + "WHERE user_id = ? ORDER BY submitted_at DESC";

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

        String sql = "SELECT * FROM submissions "
                + "WHERE problem_id = ? ORDER BY submitted_at DESC";

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
                + "status = ?, verdict = ?, execution_time = ?, memory_used = ? "
                + "WHERE id = ?";

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            if (connection == null) {
                System.out.println("Database connection unavailable!");
                return false;
            }

            statement.setString(1, status);
            statement.setString(2, verdict);
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