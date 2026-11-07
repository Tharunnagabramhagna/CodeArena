
package com.codearena.submission;

import com.codearena.model.Submission;

public class TestGetSubmissionById {

    public static void main(String[] args) {

        // Create SubmissionDAO object
        SubmissionDAO submissionDAO = new SubmissionDAO();

        // Retrieve submission with ID 1
        Submission submission = submissionDAO.getSubmissionById(1);

        if (submission != null) {

            System.out.println("Submission retrieved successfully!");

            System.out.println("Submission ID: " + submission.getId());
            System.out.println("Problem ID: " + submission.getProblemId());
            System.out.println("User ID: " + submission.getUserId());
            System.out.println("Source Code: " + submission.getSourceCode());
            System.out.println("Language: " + submission.getLanguage());
            System.out.println("Status: " + submission.getStatus());
            System.out.println("Verdict: " + submission.getVerdict());
            System.out.println("Submitted At: " + submission.getSubmittedAt());
            System.out.println("Execution Time: " + submission.getExecutionTime());
            System.out.println("Memory Used: " + submission.getMemoryUsed());

        } else {

            System.out.println("Submission not found!");
        }
    }
}
