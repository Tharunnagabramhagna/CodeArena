
package com.codearena.problem;

import com.codearena.model.Problem;

public class TestUpdateProblemFields {

    public static void main(String[] args) {

        ProblemDAO dao = new ProblemDAO();

        // Retrieve existing active problem
        Problem problem = dao.getProblemById(4);

        if (problem != null) {

            problem.setTopic("Arrays");
            problem.setPattern("Two Pointers");
            problem.setPremium(false);
            problem.setSnippet(
                "public class Main {\n" +
                "    public static void main(String[] args) {\n" +
                "        // Updated starter code\n" +
                "    }\n" +
                "}"
            );

            boolean success = dao.updateProblem(problem);

            if (success) {
                System.out.println("Problem updated successfully!");
            } else {
                System.out.println("Problem update failed!");
            }

        } else {
            System.out.println("Problem not found!");
        }
    }
}
