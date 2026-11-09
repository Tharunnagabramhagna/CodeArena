package com.codearena.problem;

import com.codearena.model.Problem;
import com.codearena.service.ProblemService;

public class TestAddProblem {

    public static void main(String[] args) {

        Problem problem = new Problem(
                0,
                "Find Maximum Number",
                "Given two integers, find and print the maximum number.",
                "Easy"
        );

        problem.setConstraints("1 <= A, B <= 1000");
        problem.setInputFormat("Two integers A and B");
        problem.setOutputFormat("Print the maximum number");
        problem.setSampleInput("10 20");
        problem.setSampleOutput("20");

        ProblemService problemService = new ProblemService();

        boolean result = problemService.addProblem(problem);

        if (result) {
            System.out.println("Problem added successfully!");
        } else {
            System.out.println("Failed to add problem.");
        }
    }
}