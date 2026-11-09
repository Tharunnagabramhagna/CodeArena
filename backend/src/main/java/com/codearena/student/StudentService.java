package com.codearena.student;

import com.codearena.model.StudentProfile;
import com.codearena.model.StudentProgress;
import com.codearena.model.Submission;

import java.util.List;
import java.util.Map;

/**
 * Service for student operations: profile management, progress tracking, and submission history.
 */
public interface StudentService {
    StudentProfile getProfile(int userId);

    StudentProfile updateProfile(int userId, StudentProfile profileUpdate);

    Map<String, Object> getProgressOverview(int userId);

    List<StudentProgress> getTopicProgressList(int userId);

    Map<String, Object> getSubmissionHistory(int userId, int limit, int page);

    Submission recordSubmission(Submission submission);
}

