
package com.codearena.problem;

import com.codearena.model.Problem;

public class TestNewProblemFields {

    public static void main(String[] args) {

        ProblemDAO dao = new ProblemDAO();

        // Retrieve an existing active problem
        Problem problem = dao.getProblemById(2);

        if (problem != null) {

            System.out.println("Problem retrieved successfully!");

            System.out.println("ID: " + problem.getId());
            System.out.println("Title: " + problem.getTitle());
            System.out.println("Topic: " + problem.getTopic());
            System.out.println("Pattern: " + problem.getPattern());
            System.out.println("Premium: " + problem.isPremium());
            System.out.println("Snippet: " + problem.getSnippet());

        } else {
            System.out.println("Problem not found!");
        }
    }
}
