package com.codearena.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {

    private static final String URL =
            "jdbc:mysql://localhost:3306/codearena";

    private static final String USERNAME = "root";

    private static final String PASSWORD = "88854@Desumohit";

    public static Connection getConnection() {

        try {
            Connection connection = DriverManager.getConnection(
                    URL, USERNAME, PASSWORD);

            System.out.println("Database connected successfully!");

            return connection;

        } catch (SQLException e) {
            System.out.println("Database connection failed!");
            e.printStackTrace();
            return null;
        }
    }
}