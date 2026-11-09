package com.codearena.student;

import com.codearena.model.Submission;
import com.codearena.model.SubmissionVerdict;

import java.util.List;
import java.util.Map;

/**
 * Data Access Object for student past submissions and judging verdict audits.
 */
public interface SubmissionHistoryDAO {
    /**
     * Persists a newly evaluated code submission.
     */
    Submission create(Submission submission);

    /**
     * Retrieves paginated submission history for a student.
     */
    List<Submission> findByUserId(int userId, int limit, int offset);

    /**
     * Counts total submissions for a user.
     */
    int countByUserId(int userId);

    /**
     * Generates a breakdown of verdict counts (ACCEPTED, WRONG_ANSWER, etc.)
     */
    Map<SubmissionVerdict, Integer> getVerdictStatistics(int userId);
}

