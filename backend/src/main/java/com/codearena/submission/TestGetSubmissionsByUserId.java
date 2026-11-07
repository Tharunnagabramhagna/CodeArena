
package com.codearena.submission;

import com.codearena.model.Submission;
import java.util.List;

public class TestGetSubmissionsByUserId {

    public static void main(String[] args) {

        // Create SubmissionDAO object
        SubmissionDAO submissionDAO = new SubmissionDAO();

        // Retrieve all submissions made by User ID 1
        List<Submission> submissions =
                submissionDAO.getSubmissionsByUserId(1);

        if (submissions.isEmpty()) {

            System.out.println("No submissions found for this user.");

        } else {

            System.out.println("Submissions retrieved successfully!");
            System.out.println("Total submissions: " + submissions.size());

            for (Submission submission : submissions) {

                System.out.println("------------------------------");

                System.out.println("Submission ID: " + submission.getId());
                System.out.println("Problem ID: " + submission.getProblemId());
                System.out.println("User ID: " + submission.getUserId());
                System.out.println("Language: " + submission.getLanguage());
                System.out.println("Status: " + submission.getStatus());
                System.out.println("Verdict: " + submission.getVerdict());
                System.out.println("Source Code: " + submission.getSourceCode());
            }
        }
    }
}
