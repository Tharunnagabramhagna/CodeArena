
package com.codearena.problem;

public class TestDeactivateProblem {

    public static void main(String[] args) {

        ProblemDAO problemDAO = new ProblemDAO();

        // Deactivate problem with ID 3
        int problemId = 3;

        boolean result = problemDAO.deactivateProblem(problemId);

        if (result) {
            System.out.println("Problem deactivated successfully!");
        } else {
            System.out.println("Failed to deactivate problem or problem not found!");
        }
    }
}
