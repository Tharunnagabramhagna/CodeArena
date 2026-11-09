
package com.codearena.submission;

public class TestUpdateSubmissionResult {

    public static void main(String[] args) {

        SubmissionDAO submissionDAO = new SubmissionDAO();

        // Update the existing submission
        boolean result = submissionDAO.updateSubmissionResult(
                3,              // Submission ID
                "COMPLETED",    // New status
                "ACCEPTED",     // New verdict
                120,            // Execution time in milliseconds
                1024            // Memory used in KB
        );

        if (result) {
            System.out.println("TEST PASSED: Submission result updated!");
        } else {
            System.out.println("TEST FAILED: Submission result not updated!");
        }
    }
}
