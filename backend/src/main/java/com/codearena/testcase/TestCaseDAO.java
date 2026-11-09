
package com.codearena.testcase;

import com.codearena.database.DBConnection;
import com.codearena.model.TestCase;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class TestCaseDAO {

    // 1. Add a test case to a problem
    public boolean addTestCase(TestCase testCase) {

        String sql = "INSERT INTO problem_test_cases "
                + "(problem_id, input_data, expected_output, is_sample) "
                + "VALUES (?, ?, ?, ?)";

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            if (connection == null) {
                System.out.println("Database connection unavailable!");
                return false;
            }

            statement.setInt(1, testCase.getProblemId());
            statement.setString(2, testCase.getInput());
            statement.setString(3, testCase.getExpectedOutput());
            statement.setBoolean(4, testCase.isSample());

            int rows = statement.executeUpdate();

            return rows > 0;

        } catch (SQLException e) {
            System.out.println("Error adding test case!");
            e.printStackTrace();
            return false;
        }
    }

    // 2. Retrieve all test cases for a problem
    public List<TestCase> getTestCasesByProblemId(int problemId) {

        List<TestCase> testCases = new ArrayList<>();

        String sql = "SELECT id, problem_id, input_data, expected_output, is_sample, created_at "
                + "FROM problem_test_cases WHERE problem_id = ? AND is_active = TRUE ORDER BY display_order ASC, id ASC";

        try (Connection connection = DBConnection.getConnection();
                PreparedStatement statement = connection.prepareStatement(sql)) {

            if (connection == null) {
                return testCases;
            }

            statement.setInt(1, problemId);

            try (ResultSet result = statement.executeQuery()) {

                while (result.next()) {

                    TestCase testCase = new TestCase();

                    testCase.setId(result.getInt("id"));
                    testCase.setProblemId(result.getInt("problem_id"));
                    testCase.setInput(result.getString("input_data"));
                    testCase.setExpectedOutput(result.getString("expected_output"));
                    testCase.setSample(result.getBoolean("is_sample"));
                    testCase.setCreatedAt(result.getString("created_at"));

                    testCases.add(testCase);
                }
            }

        } catch (SQLException e) {
            System.out.println("Error retrieving test cases!");
            e.printStackTrace();
        }

        return testCases;
    }
}
