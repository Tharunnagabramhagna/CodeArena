
package com.codearena.service;

import com.codearena.model.Submission;
import com.codearena.submission.SubmissionDAO;

public class SubmissionService {

    private final SubmissionDAO submissionDAO;

    // Constructor
    public SubmissionService() {
        this.submissionDAO = new SubmissionDAO();
    }

    // Validate and save a new submission
    public boolean addSubmission(Submission submission) {

        // Check whether submission is null
        if (submission == null) {
            System.out.println("Submission cannot be empty!");
            return false;
        }

        // Check problem ID
        if (submission.getProblemId() <= 0) {
            System.out.println("Invalid problem ID!");
            return false;
        }

        // Check user ID
        if (submission.getUserId() <= 0) {
            System.out.println("Invalid user ID!");
            return false;
        }

        // Check source code
        if (submission.getSourceCode() == null
                || submission.getSourceCode().trim().isEmpty()) {
            System.out.println("Source code cannot be empty!");
            return false;
        }

        // Check programming language
        if (submission.getLanguage() == null
                || submission.getLanguage().trim().isEmpty()) {
            System.out.println("Programming language is required!");
            return false;
        }

        // Check supported language
        if (!submission.getLanguage().equalsIgnoreCase("Java")) {
            System.out.println("Currently, only Java is supported!");
            return false;
        }

        // Set initial submission status
        submission.setStatus("PENDING");
        submission.setVerdict("PENDING");

        // Save submission through DAO
        return submissionDAO.addSubmission(submission);
    }

    // Retrieve submission by ID
    public Submission getSubmissionById(int submissionId) {

        if (submissionId <= 0) {
            System.out.println("Invalid submission ID!");
            return null;
        }

        return submissionDAO.getSubmissionById(submissionId);
    }
}
