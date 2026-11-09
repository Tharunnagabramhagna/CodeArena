
package com.codearena.submission;

import com.codearena.model.Submission;
import com.codearena.service.SubmissionService;

public class TestSubmissionService {

    public static void main(String[] args) {

        SubmissionService submissionService = new SubmissionService();

        // Create a valid Java submission
        Submission submission = new Submission(
                0,
                2,  // Valid Problem ID
                1,  // Existing test User ID
                "public class Main { " +
                "public static void main(String[] args) { " +
                "System.out.println(100); " +
                "} }",
                "Java",
                "PENDING",
                "PENDING",
                null,
                0,
                0
        );

        boolean result = submissionService.addSubmission(submission);

        if (result) {
            System.out.println("TEST PASSED: Valid Java submission saved successfully!");
        } else {
            System.out.println("TEST FAILED: Valid Java submission could not be saved!");
        }
    }
}
