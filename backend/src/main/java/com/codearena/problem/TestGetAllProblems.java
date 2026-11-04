
package com.codearena.problem;

import com.codearena.model.Problem;
import java.util.List;

public class TestGetAllProblems {

    public static void main(String[] args) {

        ProblemDAO problemDAO = new ProblemDAO();

        List<Problem> problems = problemDAO.getAllProblems();

        if (problems.isEmpty()) {
            System.out.println("No active problems found!");
        } else {
            System.out.println("===== CODEARENA PROBLEMS =====");

            for (Problem problem : problems) {
                System.out.println("ID: " + problem.getId());
                System.out.println("Title: " + problem.getTitle());
                System.out.println("Difficulty: " + problem.getDifficulty());
                System.out.println("------------------------------");
            }

            System.out.println("Total Problems: " + problems.size());
        }
    }
}
