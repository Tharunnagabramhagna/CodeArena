
package com.codearena.submission;

import com.codearena.model.Submission;
import com.codearena.service.SubmissionService;

public class TestSubmissionService {

    public static void main(String[] args) {

        // Create SubmissionService object
        SubmissionService submissionService = new SubmissionService();

        // Create submission with INVALID problem ID
        Submission submission = new Submission(
                0,
                0,  // Invalid Problem ID
                1,
                "public class Main { public static void main(String[] args) { System.out.println(100); } }",
                "Java",
                "PENDING",
                "PENDING",
                null,
                0,
                0
        );

        // Validate and save submission
        boolean result = submissionService.addSubmission(submission);

        if (result) {
            System.out.println("Submission validated and saved successfully!");
        } else {
            System.out.println("Submission rejected successfully!");
        }
    }
}
