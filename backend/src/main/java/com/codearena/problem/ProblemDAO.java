
package com.codearena.problem;

import com.codearena.database.DBConnection;
import com.codearena.model.Problem;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class ProblemDAO {

    // 1. Add a new problem
    public boolean addProblem(Problem problem) {

        String sql = "INSERT INTO problems "
                + "(title, description, difficulty, constraints_text, "
                + "input_format, output_format, sample_input, sample_output) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, problem.getTitle());
            statement.setString(2, problem.getDescription());
            statement.setString(3, problem.getDifficulty());
            statement.setString(4, problem.getConstraints());
            statement.setString(5, problem.getInputFormat());
            statement.setString(6, problem.getOutputFormat());
            statement.setString(7, problem.getSampleInput());
            statement.setString(8, problem.getSampleOutput());

            int rows = statement.executeUpdate();
            return rows > 0;

        } catch (SQLException e) {
            System.out.println("Error adding problem!");
            e.printStackTrace();
            return false;
        }
    }

    // 2. Retrieve all active problems
    public List<Problem> getAllProblems() {

        List<Problem> problems = new ArrayList<>();

        String sql = "SELECT * FROM problems WHERE active = TRUE";

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet result = statement.executeQuery()) {

            while (result.next()) {

                Problem problem = new Problem();

                problem.setId(result.getInt("id"));
                problem.setTitle(result.getString("title"));
                problem.setDescription(result.getString("description"));
                problem.setDifficulty(result.getString("difficulty"));
                problem.setConstraints(result.getString("constraints_text"));
                problem.setInputFormat(result.getString("input_format"));
                problem.setOutputFormat(result.getString("output_format"));
                problem.setSampleInput(result.getString("sample_input"));
                problem.setSampleOutput(result.getString("sample_output"));
                problem.setCreatedAt(result.getString("created_at"));
                problem.setActive(result.getBoolean("active"));

                problems.add(problem);
            }

        } catch (SQLException e) {
            System.out.println("Error retrieving problems!");
            e.printStackTrace();
        }

        return problems;
    }

    // 3. Retrieve one active problem by ID
    public Problem getProblemById(int id) {

        String sql = "SELECT * FROM problems WHERE id = ? AND active = TRUE";

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, id);

            try (ResultSet result = statement.executeQuery()) {

                if (result.next()) {

                    Problem problem = new Problem();

                    problem.setId(result.getInt("id"));
                    problem.setTitle(result.getString("title"));
                    problem.setDescription(result.getString("description"));
                    problem.setDifficulty(result.getString("difficulty"));
                    problem.setConstraints(result.getString("constraints_text"));
                    problem.setInputFormat(result.getString("input_format"));
                    problem.setOutputFormat(result.getString("output_format"));
                    problem.setSampleInput(result.getString("sample_input"));
                    problem.setSampleOutput(result.getString("sample_output"));
                    problem.setCreatedAt(result.getString("created_at"));
                    problem.setActive(result.getBoolean("active"));

                    return problem;
                }
            }

        } catch (SQLException e) {
            System.out.println("Error retrieving problem by ID!");
            e.printStackTrace();
        }

        return null;
    }

    // 4. Update an existing problem
    public boolean updateProblem(Problem problem) {

        String sql = "UPDATE problems SET title = ?, description = ?, "
                + "difficulty = ?, constraints_text = ?, input_format = ?, "
                + "output_format = ?, sample_input = ?, sample_output = ? "
                + "WHERE id = ? AND active = TRUE";

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, problem.getTitle());
            statement.setString(2, problem.getDescription());
            statement.setString(3, problem.getDifficulty());
            statement.setString(4, problem.getConstraints());
            statement.setString(5, problem.getInputFormat());
            statement.setString(6, problem.getOutputFormat());
            statement.setString(7, problem.getSampleInput());
            statement.setString(8, problem.getSampleOutput());
            statement.setInt(9, problem.getId());

            int rows = statement.executeUpdate();
            return rows > 0;

        } catch (SQLException e) {
            System.out.println("Error updating problem!");
            e.printStackTrace();
            return false;
        }
    }

    // 5. Deactivate an existing problem
    public boolean deactivateProblem(int id) {

        String sql = "UPDATE problems SET active = FALSE "
                + "WHERE id = ? AND active = TRUE";

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, id);

            int rows = statement.executeUpdate();
            return rows > 0;

        } catch (SQLException e) {
            System.out.println("Error deactivating problem!");
            e.printStackTrace();
            return false;
        }
    }
}
