package com.codearena.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class TestDBOperations {

    public static void main(String[] args) {

        String insertSQL = """
                INSERT INTO problems
                (title, description, difficulty)
                VALUES (?, ?, ?)
                """;

        String selectSQL = """
                SELECT id, title, difficulty
                FROM problems
                """;

        try (Connection connection = DBConnection.getConnection()) {

            if (connection == null) {
                System.out.println("Database connection failed.");
                return;
            }

            // Insert a sample problem
            try (PreparedStatement insert =
                         connection.prepareStatement(insertSQL)) {

                insert.setString(1, "Java Basics Practice");
                insert.setString(2, "Write a program to learn Java basics.");
                insert.setString(3, "Easy");

                int rows = insert.executeUpdate();
                System.out.println("Inserted rows: " + rows);
            }

            // Retrieve problems
            try (PreparedStatement select =
                         connection.prepareStatement(selectSQL);
                 ResultSet result = select.executeQuery()) {

                System.out.println("\nProblems in CodeArena:");

                while (result.next()) {
                    System.out.println(
                            result.getInt("id") + " | " +
                            result.getString("title") + " | " +
                            result.getString("difficulty")
                    );
                }
            }

        } catch (SQLException e) {
            System.out.println("Database operation failed!");
            e.printStackTrace();
        }
    }
}