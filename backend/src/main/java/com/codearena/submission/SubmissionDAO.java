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

    // Save a new submission
    public boolean addSubmission(Submission submission) {

        String sql = "INSERT INTO submissions "
                + "(problem_id, user_id, source_code, language, status, verdict) "
                + "VALUES (?, ?, ?, ?, ?, ?)";

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, submission.getProblemId());
            statement.setInt(2, submission.getUserId());
            statement.setString(3, submission.getSourceCode());
            statement.setString(4, submission.getLanguage());
            statement.setString(5, submission.getStatus());
            statement.setString(6, submission.getVerdict());

            int rows = statement.executeUpdate();

            return rows > 0;

        } catch (SQLException e) {
            System.out.println("Error saving submission!");
            e.printStackTrace();
            return false;
        }
    }

    // Retrieve a submission using its ID
    public Submission getSubmissionById(int submissionId) {

        String sql = "SELECT * FROM submissions WHERE id = ?";

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, submissionId);

            try (ResultSet resultSet = statement.executeQuery()) {

                if (resultSet.next()) {

                    Submission submission = new Submission();

                    submission.setId(resultSet.getInt("id"));
                    submission.setProblemId(resultSet.getInt("problem_id"));
                    submission.setUserId(resultSet.getInt("user_id"));
                    submission.setSourceCode(resultSet.getString("source_code"));
                    submission.setLanguage(resultSet.getString("language"));
                    submission.setStatus(resultSet.getString("status"));
                    submission.setVerdict(resultSet.getString("verdict"));
                    submission.setSubmittedAt(
                            resultSet.getString("submitted_at"));
                    submission.setExecutionTime(
                            resultSet.getLong("execution_time"));
                    submission.setMemoryUsed(
                            resultSet.getLong("memory_used"));

                    return submission;
                }
            }

        } catch (SQLException e) {
            System.out.println("Error retrieving submission!");
            e.printStackTrace();
        }

        return null;
    }

    // Retrieve all submissions made by a particular user
    public List<Submission> getSubmissionsByUserId(int userId) {

        List<Submission> submissions = new ArrayList<>();

        String sql = "SELECT * FROM submissions WHERE user_id = ?";

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, userId);

            try (ResultSet resultSet = statement.executeQuery()) {

                while (resultSet.next()) {

                    Submission submission = new Submission();

                    submission.setId(resultSet.getInt("id"));
                    submission.setProblemId(resultSet.getInt("problem_id"));
                    submission.setUserId(resultSet.getInt("user_id"));
                    submission.setSourceCode(resultSet.getString("source_code"));
                    submission.setLanguage(resultSet.getString("language"));
                    submission.setStatus(resultSet.getString("status"));
                    submission.setVerdict(resultSet.getString("verdict"));
                    submission.setSubmittedAt(
                            resultSet.getString("submitted_at"));
                    submission.setExecutionTime(
                            resultSet.getLong("execution_time"));
                    submission.setMemoryUsed(
                            resultSet.getLong("memory_used"));

                    submissions.add(submission);
                }
            }

        } catch (SQLException e) {
            System.out.println("Error retrieving user submissions!");
            e.printStackTrace();
        }

        return submissions;
    }
}