
package com.codearena.problem;

import com.codearena.model.Problem;

public class TestGetProblemById {

    public static void main(String[] args) {

        ProblemDAO problemDAO = new ProblemDAO();

        // Retrieve problem with ID 3
        int problemId = 3;

        Problem problem = problemDAO.getProblemById(problemId);

        if (problem != null) {

            System.out.println("===== PROBLEM DETAILS =====");
            System.out.println("ID: " + problem.getId());
            System.out.println("Title: " + problem.getTitle());
            System.out.println("Description: " + problem.getDescription());
            System.out.println("Difficulty: " + problem.getDifficulty());
            System.out.println("Constraints: " + problem.getConstraints());
            System.out.println("Input Format: " + problem.getInputFormat());
            System.out.println("Output Format: " + problem.getOutputFormat());
            System.out.println("Sample Input: " + problem.getSampleInput());
            System.out.println("Sample Output: " + problem.getSampleOutput());

        } else {
            System.out.println("Problem not found!");
        }
    }
}