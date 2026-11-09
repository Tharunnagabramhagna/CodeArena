package com.codearena.database;

import java.sql.Connection;

public class TestDBConnection {

    public static void main(String[] args) {

        Connection connection = DBConnection.getConnection();

        if (connection != null) {
            System.out.println("CodeArena database is connected!");

            try {
                connection.close();
                System.out.println("Database connection closed.");
            } catch (Exception e) {
                e.printStackTrace();
            }

        } else {
            System.out.println("Please check your database settings.");
        }
    }
}