package com.codearena.student;

import com.codearena.exception.ResourceNotFoundException;
import com.codearena.model.StudentProfile;
import com.codearena.model.StudentProgress;
import com.codearena.model.Submission;
import com.codearena.model.SubmissionVerdict;
import com.codearena.util.AsyncActivityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

/**
 * Implementation of StudentService orchestrating student profile, topic progress,
 * and submission audits.
 */
public class StudentServiceImpl implements StudentService {
    private static final Logger logger = LoggerFactory.getLogger(StudentServiceImpl.class);

    private final StudentProfileDAO profileDAO;
    private final StudentProgressDAO progressDAO;
    private final SubmissionHistoryDAO submissionDAO;

    public StudentServiceImpl() {
        this.profileDAO = new StudentProfileDAOImpl();
        this.progressDAO = new StudentProgressDAOImpl();
        this.submissionDAO = new SubmissionHistoryDAOImpl();
    }

    public StudentServiceImpl(StudentProfileDAO profileDAO, StudentProgressDAO progressDAO, SubmissionHistoryDAO submissionDAO) {
        this.profileDAO = profileDAO;
        this.progressDAO = progressDAO;
        this.submissionDAO = submissionDAO;
    }

    @Override
    public StudentProfile getProfile(int userId) {
        return profileDAO.findByUserId(userId)
                .orElseGet(() -> {
                    // Create default profile if not exists
                    StudentProfile p = new StudentProfile(userId);
                    return profileDAO.create(p);
                });
    }

    @Override
    public StudentProfile updateProfile(int userId, StudentProfile update) {
        StudentProfile existing = getProfile(userId);

        if (update.getBio() != null) existing.setBio(update.getBio());
        if (update.getGithubUrl() != null) existing.setGithubUrl(update.getGithubUrl());
        if (update.getLinkedinUrl() != null) existing.setLinkedinUrl(update.getLinkedinUrl());
        if (update.getPreferredLanguage() != null) existing.setPreferredLanguage(update.getPreferredLanguage());
        if (update.getAvatarUrl() != null) existing.setAvatarUrl(update.getAvatarUrl());

        profileDAO.updateProfile(existing);
        AsyncActivityService.logActivityAsync(userId, "PROFILE_UPDATED", "Student profile details updated", "0.0.0.0");
        return existing;
    }

    @Override
    public Map<String, Object> getProgressOverview(int userId) {
        List<StudentProgress> topics = progressDAO.findByUserId(userId);
        if (topics.isEmpty()) {
            progressDAO.initializeDefaultTopics(userId);
            topics = progressDAO.findByUserId(userId);
        }

        StudentProfile profile = getProfile(userId);

        int totalAttempted = 0;
        int totalSolved = 0;
        for (StudentProgress p : topics) {
            totalAttempted += p.getProblemsAttempted();
            totalSolved += p.getProblemsSolved();
        }

        double overallAccuracy = totalAttempted > 0 ? ((double) totalSolved / totalAttempted) * 100.0 : 0.0;

        Map<String, Object> overview = new LinkedHashMap<>();
        overview.put("userId", userId);
        overview.put("rankingScore", profile.getRankingScore());
        overview.put("streakDays", profile.getStreakDays());
        overview.put("totalAttempted", totalAttempted);
        overview.put("totalSolved", Math.max(totalSolved, profile.getProblemsSolved()));
        overview.put("accuracyRate", Math.round(overallAccuracy * 10.0) / 10.0);
        overview.put("topics", topics);

        return overview;
    }

    @Override
    public List<StudentProgress> getTopicProgressList(int userId) {
        return progressDAO.findByUserId(userId);
    }

    @Override
    public Map<String, Object> getSubmissionHistory(int userId, int limit, int page) {
        int safeLimit = (limit > 0 && limit <= 100) ? limit : 20;
        int safePage = Math.max(page, 1);
        int offset = (safePage - 1) * safeLimit;

        List<Submission> submissions = submissionDAO.findByUserId(userId, safeLimit, offset);
        int totalCount = submissionDAO.countByUserId(userId);
        Map<SubmissionVerdict, Integer> verdictStats = submissionDAO.getVerdictStatistics(userId);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("submissions", submissions);
        response.put("totalCount", totalCount);
        response.put("currentPage", safePage);
        response.put("pageSize", safeLimit);
        response.put("totalPages", (int) Math.ceil((double) totalCount / safeLimit));
        response.put("verdictStats", verdictStats);

        return response;
    }

    @Override
    public Submission recordSubmission(Submission submission) {
        Submission saved = submissionDAO.create(submission);

        // If accepted, increment problem count and ranking points
        boolean isAccepted = submission.getVerdict() == SubmissionVerdict.ACCEPTED;
        if (isAccepted) {
            profileDAO.incrementProblemsSolved(submission.getUserId(), 10);
        }

        // Asynchronously update topic progress and streak
        AsyncActivityService.updateStreakAsync(submission.getUserId());

        return saved;
    }
}

