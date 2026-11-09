
package com.codearena.problem;

import com.codearena.model.Problem;

public class TestAddProblemWithFields {

    public static void main(String[] args) {

        ProblemDAO dao = new ProblemDAO();

        Problem problem = new Problem();

        problem.setTitle("Array Sum Practice");
        problem.setDescription("Write a Java program to calculate the sum of two integers.");
        problem.setDifficulty("Easy");

        problem.setConstraints("1 <= a, b <= 1000");
        problem.setInputFormat("Two space-separated integers");
        problem.setOutputFormat("Print their sum");

        problem.setSampleInput("10 20");
        problem.setSampleOutput("30");

        problem.setTopic("Arrays");
        problem.setPattern("Basic Array Operations");
        problem.setPremium(false);

        problem.setSnippet(
            "public class Main {\n" +
            "    public static void main(String[] args) {\n" +
            "        // Write your solution here\n" +
            "    }\n" +
            "}"
        );

        boolean success = dao.addProblem(problem);

        if (success) {
            System.out.println("Problem added successfully!");
        } else {
            System.out.println("Problem insertion failed!");
        }
    }
}
