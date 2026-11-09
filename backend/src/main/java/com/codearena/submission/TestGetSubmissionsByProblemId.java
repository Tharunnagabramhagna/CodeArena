
package com.codearena.submission;

import com.codearena.model.Submission;
import java.util.List;

public class TestGetSubmissionsByProblemId {

    public static void main(String[] args) {

        SubmissionDAO submissionDAO = new SubmissionDAO();

        // Retrieve submissions for Problem ID 2
        List<Submission> submissions =
                submissionDAO.getSubmissionsByProblemId(2);

        if (submissions.isEmpty()) {

            System.out.println("No submissions found for this problem!");

        } else {

            System.out.println("===== PROBLEM SUBMISSIONS =====");

            for (Submission submission : submissions) {

                System.out.println("Submission ID: " + submission.getId());
                System.out.println("Problem ID: " + submission.getProblemId());
                System.out.println("User ID: " + submission.getUserId());
                System.out.println("Language: " + submission.getLanguage());
                System.out.println("Status: " + submission.getStatus());
                System.out.println("Verdict: " + submission.getVerdict());

                System.out.println("------------------------------");
            }

            System.out.println("Total Submissions: " + submissions.size());
        }
    }
}
