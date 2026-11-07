package com.codearena.service;

import com.codearena.model.Submission;
import com.codearena.submission.SubmissionDAO;

import java.util.ArrayList;
import java.util.List;

public class SubmissionService {

    private final SubmissionDAO submissionDAO;

    // Constructor
    public SubmissionService() {
        this.submissionDAO = new SubmissionDAO();
    }

    // 1. Validate and save a new submission
    public boolean addSubmission(Submission submission) {

        if (submission == null) {
            System.out.println("Submission cannot be empty!");
            return false;
        }

        if (submission.getProblemId() <= 0) {
            System.out.println("Invalid problem ID!");
            return false;
        }

        if (submission.getUserId() <= 0) {
            System.out.println("Invalid user ID!");
            return false;
        }

        if (submission.getSourceCode() == null
                || submission.getSourceCode().trim().isEmpty()) {
            System.out.println("Source code cannot be empty!");
            return false;
        }

        if (submission.getLanguage() == null
                || submission.getLanguage().trim().isEmpty()) {
            System.out.println("Programming language is required!");
            return false;
        }

        if (!submission.getLanguage().equalsIgnoreCase("Java")) {
            System.out.println("Currently, only Java is supported!");
            return false;
        }

        // Set initial status
        submission.setStatus("PENDING");
        submission.setVerdict("PENDING");

        return submissionDAO.addSubmission(submission);
    }

    // 2. Retrieve submission by ID
    public Submission getSubmissionById(int submissionId) {

        if (submissionId <= 0) {
            System.out.println("Invalid submission ID!");
            return null;
        }

        return submissionDAO.getSubmissionById(submissionId);
    }

    // 3. Retrieve submissions by user ID
    public List<Submission> getSubmissionsByUserId(int userId) {

        if (userId <= 0) {
            System.out.println("Invalid user ID!");
            return new ArrayList<>();
        }

        return submissionDAO.getSubmissionsByUserId(userId);
    }

    // 4. Retrieve submissions by problem ID
    public List<Submission> getSubmissionsByProblemId(int problemId) {

        if (problemId <= 0) {
            System.out.println("Invalid problem ID!");
            return new ArrayList<>();
        }

        return submissionDAO.getSubmissionsByProblemId(problemId);
    }
}