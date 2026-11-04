package com.codearena.service;

import com.codearena.model.Problem;
import com.codearena.problem.ProblemDAO;

public class ProblemService {

    private final ProblemDAO problemDAO;

    // Constructor
    public ProblemService() {
        this.problemDAO = new ProblemDAO();
    }

    // Add a new problem
    public boolean addProblem(Problem problem) {

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

        return problemDAO.addProblem(problem);
    }
}