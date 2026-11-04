
package com.codearena.problem;

import com.codearena.model.Problem;

public class TestUpdateProblem {

    public static void main(String[] args) {

        ProblemDAO problemDAO = new ProblemDAO();

        // Update the problem with ID 3
        Problem problem = problemDAO.getProblemById(3);

        if (problem != null) {

            problem.setTitle("Find Maximum of Two Numbers - Updated");
            problem.setDescription(
                    "Given two integers, find and print the larger number."
            );
            problem.setDifficulty("Easy");

            boolean result = problemDAO.updateProblem(problem);

            if (result) {
                System.out.println("Problem updated successfully!");
            } else {
                System.out.println("Failed to update problem.");
            }

        } else {
            System.out.println("Problem with ID 3 not found!");
        }
    }
}
