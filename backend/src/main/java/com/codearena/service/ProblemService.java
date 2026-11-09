
package com.codearena.service;

import com.codearena.model.Problem;
import com.codearena.problem.ProblemDAO;

import java.util.List;

public class ProblemService {

    private final ProblemDAO problemDAO;

    public ProblemService() {
        this.problemDAO = new ProblemDAO();
    }

    // Validate problem details
    private boolean isValidProblem(Problem problem) {

        if (problem == null) {
            System.out.println("Problem cannot be empty!");
            return false;
        }

        if (problem.getTitle() == null ||
                problem.getTitle().trim().isEmpty()) {
            System.out.println("Problem title is required!");
            return false;
        }

        if (problem.getDescription() == null ||
                problem.getDescription().trim().isEmpty()) {
            System.out.println("Problem description is required!");
            return false;
        }

        if (problem.getDifficulty() == null ||
                !(problem.getDifficulty().equalsIgnoreCase("Easy")
                || problem.getDifficulty().equalsIgnoreCase("Medium")
                || problem.getDifficulty().equalsIgnoreCase("Hard"))) {
            System.out.println("Difficulty must be Easy, Medium, or Hard!");
            return false;
        }

        return true;
    }

    // 1. Add a problem
    public boolean addProblem(Problem problem) {
        if (!isValidProblem(problem)) {
            return false;
        }
        return problemDAO.addProblem(problem);
    }

    // 2. Get all active problems
    public List<Problem> getAllProblems() {
        return problemDAO.getAllProblems();
    }

    // 3. Get a problem by ID
    public Problem getProblemById(int id) {
        if (id <= 0) {
            return null;
        }
        return problemDAO.getProblemById(id);
    }

    // 4. Update a problem
    public boolean updateProblem(Problem problem) {
        if (!isValidProblem(problem)) {
            return false;
        }

        if (problem.getId() <= 0) {
            System.out.println("Valid problem ID is required!");
            return false;
        }

        return problemDAO.updateProblem(problem);
    }

    // 5. Deactivate a problem
    public boolean deactivateProblem(int id) {
        if (id <= 0) {
            return false;
        }
        return problemDAO.deactivateProblem(id);
    }
}
