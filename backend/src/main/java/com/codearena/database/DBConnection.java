package com.codearena.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {


    private static String getEnvOrDefault(String envName, String propName, String defaultValue) {
        String val = System.getenv(envName);
        if (val != null && !val.isBlank()) {
            return val.trim();
        }
        val = System.getProperty(propName);
        if (val != null && !val.isBlank()) {
            return val.trim();
        }
        return defaultValue;
    }


    public static String getUrl() {
        return getEnvOrDefault(
                "DB_URL",
                "db.url",
                "jdbc:mysql://localhost:3306/codearena_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC");
    }


    public static String getUsername() {
        return getEnvOrDefault("DB_USER", "db.user", "root");
    }

    public static String getPassword() {
        return getEnvOrDefault("DB_PASSWORD", "db.password", "");
    }

    public static Connection getConnection() {
        try {
            Connection connection = DriverManager.getConnection(
                    getUrl(),
                    getUsername(),
                    getPassword()
            );
            return connection;
        } catch (SQLException e) {
            System.err.println("[DBConnection] Database connection failed: " + e.getMessage());
            return null;
        }
    }
}