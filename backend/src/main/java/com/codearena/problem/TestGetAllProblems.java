
package com.codearena.problem;

import com.codearena.model.Problem;
import java.util.List;

public class TestGetAllProblems {

    public static void main(String[] args) {

        ProblemDAO problemDAO = new ProblemDAO();

        // Retrieve all active problems
        List<Problem> problems = problemDAO.getAllProblems();

        if (problems.isEmpty()) {

            System.out.println("No active problems found!");

        } else {

            System.out.println("===== CODEARENA PROBLEMS =====");

            for (Problem problem : problems) {

                System.out.println("ID: " + problem.getId());
                System.out.println("Title: " + problem.getTitle());
                System.out.println("Description: " + problem.getDescription());
                System.out.println("Difficulty: " + problem.getDifficulty());

                System.out.println("Constraints: " + problem.getConstraints());
                System.out.println("Input Format: " + problem.getInputFormat());
                System.out.println("Output Format: " + problem.getOutputFormat());

                System.out.println("Sample Input: " + problem.getSampleInput());
                System.out.println("Sample Output: " + problem.getSampleOutput());

                System.out.println("Topic: " + problem.getTopic());
                System.out.println("Pattern: " + problem.getPattern());
                System.out.println("Premium: " + problem.isPremium());
                System.out.println("Snippet: " + problem.getSnippet());

                System.out.println("Active: " + problem.isActive());
                System.out.println("Created At: " + problem.getCreatedAt());

                System.out.println("----------------------------------------");
            }

            System.out.println("Total Active Problems: " + problems.size());
        }
    }
}
