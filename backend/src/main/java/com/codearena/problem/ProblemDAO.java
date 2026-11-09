
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

    private int resolveDifficultyId(String difficulty) {
        if (difficulty == null)
            return 1;
        if ("Medium".equalsIgnoreCase(difficulty.trim()))
            return 2;
        if ("Hard".equalsIgnoreCase(difficulty.trim()))
            return 3;
        return 1; // Default to Easy
    }

    private Problem mapProblem(ResultSet result) throws SQLException {

        Problem problem = new Problem();

        problem.setId(result.getInt("id"));
        problem.setTitle(result.getString("title"));
        problem.setDescription(result.getString("description"));
        problem.setDifficulty(result.getString("difficulty"));
        problem.setConstraints(result.getString("constraints"));
        problem.setInputFormat(result.getString("input_format"));
        problem.setOutputFormat(result.getString("output_format"));
        problem.setCreatedAt(result.getString("created_at"));
        problem.setActive(result.getBoolean("is_active"));

        problem.setTopic(result.getString("topic"));
        problem.setPremium(result.getBoolean("is_premium"));
        problem.setSnippet(result.getString("snippet"));

        return problem;
    }

    public boolean addProblem(Problem problem) {

        String sql = "INSERT INTO problems "
                + "(track_id, category_id, difficulty_id, canonical_id, slug, problem_number, "
                + "title, description, constraints, input_format, output_format, starter_code, is_premium, is_active) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)";

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            if (connection == null) {
                System.out.println("Database connection unavailable!");
                return false;
            }

            // Generate clean slug and canonical_id
            String baseSlug = problem.getTitle() != null
                    ? problem.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "")
                    : "problem";
            if (baseSlug.isEmpty()) baseSlug = "problem";
            String uniqueSuffix = String.valueOf(System.currentTimeMillis() % 1000000);
            String slug = baseSlug + "-" + uniqueSuffix;
            String canonicalId = slug;

            // Auto-assign problem number
            int nextNum = (int) (System.currentTimeMillis() % 900000) + 1000;

            statement.setInt(1, 1); // track_id = 1 (Core Java)
            statement.setInt(2, 1); // category_id = 1 (Basics)
            statement.setInt(3, resolveDifficultyId(problem.getDifficulty()));
            statement.setString(4, canonicalId);
            statement.setString(5, slug);
            statement.setInt(6, nextNum);
            statement.setString(7, problem.getTitle());
            statement.setString(8, problem.getDescription());
            statement.setString(9, problem.getConstraints());
            statement.setString(10, problem.getInputFormat());
            statement.setString(11, problem.getOutputFormat());
            statement.setString(12, problem.getSnippet());
            statement.setBoolean(13, problem.isPremium());

            return statement.executeUpdate() > 0;

        } catch (SQLException e) {
            System.out.println("Error adding problem!");
            e.printStackTrace();
            return false;
        }
    }

    public List<Problem> getAllProblems() {

        List<Problem> problems = new ArrayList<>();

        String sql = "SELECT p.id, p.title, p.description, "
                + "COALESCE(d.name, 'Easy') AS difficulty, "
                + "p.constraints, p.input_format, p.output_format, "
                + "p.starter_code AS snippet, "
                + "p.is_premium, p.is_active, p.created_at, "
                + "COALESCE(c.name, 'Core Java') AS topic "
                + "FROM problems p "
                + "LEFT JOIN difficulties d ON p.difficulty_id = d.id "
                + "LEFT JOIN categories c ON p.category_id = c.id "
                + "WHERE p.is_active = TRUE "
                + "ORDER BY p.id ASC";

        try (Connection connection = DBConnection.getConnection();
                PreparedStatement statement = connection.prepareStatement(sql);
                ResultSet result = statement.executeQuery()) {

            while (result.next()) {
                problems.add(mapProblem(result));
            }

        } catch (SQLException e) {
            System.out.println("Error retrieving problems!");
            e.printStackTrace();
        }

        return problems;
    }

    public Problem getProblemById(int id) {

        String sql = "SELECT p.id, p.title, p.description, "
                + "COALESCE(d.name, 'Easy') AS difficulty, "
                + "p.constraints, p.input_format, p.output_format, "
                + "p.starter_code AS snippet, "
                + "p.is_premium, p.is_active, p.created_at, "
                + "COALESCE(c.name, 'Core Java') AS topic "
                + "FROM problems p "
                + "LEFT JOIN difficulties d ON p.difficulty_id = d.id "
                + "LEFT JOIN categories c ON p.category_id = c.id "
                + "WHERE p.id = ? AND p.is_active = TRUE";

        try (Connection connection = DBConnection.getConnection();
                PreparedStatement statement = connection.prepareStatement(sql)) {

            if (connection == null) {
                return null;
            }

            statement.setInt(1, id);

            try (ResultSet result = statement.executeQuery()) {

                if (result.next()) {
                    return mapProblem(result);
                }
            }

        } catch (SQLException e) {
            System.out.println("Error retrieving problem by ID!");
            e.printStackTrace();
        }

        return null;
    }

    public boolean updateProblem(Problem problem) {

        String sql = "UPDATE problems SET "
                + "title = ?, description = ?, difficulty_id = ?, "
                + "constraints = ?, input_format = ?, "
                + "output_format = ?, starter_code = ?, is_premium = ? "
                + "WHERE id = ? AND is_active = TRUE";

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            if (connection == null) {
                System.out.println("Database connection unavailable!");
                return false;
            }

            statement.setString(1, problem.getTitle());
            statement.setString(2, problem.getDescription());
            statement.setInt(3, resolveDifficultyId(problem.getDifficulty()));
            statement.setString(4, problem.getConstraints());
            statement.setString(5, problem.getInputFormat());
            statement.setString(6, problem.getOutputFormat());
            statement.setString(7, problem.getSnippet());
            statement.setBoolean(8, problem.isPremium());
            statement.setInt(9, problem.getId());

            return statement.executeUpdate() > 0;

        } catch (SQLException e) {
            System.out.println("Error updating problem!");
            e.printStackTrace();
            return false;
        }
    }

    public boolean deactivateProblem(int id) {

        String sql = "UPDATE problems SET is_active = FALSE "
                + "WHERE id = ? AND is_active = TRUE";

        try (Connection connection = DBConnection.getConnection();
                PreparedStatement statement = connection.prepareStatement(sql)) {

            if (connection == null) {
                System.out.println("Database connection unavailable!");
                return false;
            }

            statement.setInt(1, id);

            return statement.executeUpdate() > 0;

        } catch (SQLException e) {
            System.out.println("Error deactivating problem!");
            e.printStackTrace();
            return false;
        }
    }
}
