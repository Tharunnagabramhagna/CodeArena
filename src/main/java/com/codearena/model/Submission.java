package com.codearena.model;

import java.io.Serializable;
import java.sql.Timestamp;

/**
 * Historical code submission entity.
 * Person 4 Responsibility: History module.
 */
public class Submission implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id;
    private int userId;
    private int problemId;
    private String problemTitle;
    private String language;
    private String code;
    private SubmissionVerdict verdict;
    private int executionTimeMs;
    private int memoryKb;
    private Timestamp submittedAt;

    public Submission() {
        this.language = "Java";
        this.verdict = SubmissionVerdict.PENDING;
    }

    public Submission(int userId, int problemId, String problemTitle, String language, String code) {
        this();
        this.userId = userId;
        this.problemId = problemId;
        this.problemTitle = problemTitle;
        this.language = language;
        this.code = code;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getProblemId() {
        return problemId;
    }

    public void setProblemId(int problemId) {
        this.problemId = problemId;
    }

    public String getProblemTitle() {
        return problemTitle;
    }

    public void setProblemTitle(String problemTitle) {
        this.problemTitle = problemTitle;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public SubmissionVerdict getVerdict() {
        return verdict;
    }

    public void setVerdict(SubmissionVerdict verdict) {
        this.verdict = verdict;
    }

    public int getExecutionTimeMs() {
        return executionTimeMs;
    }

    public void setExecutionTimeMs(int executionTimeMs) {
        this.executionTimeMs = executionTimeMs;
    }

    public int getMemoryKb() {
        return memoryKb;
    }

    public void setMemoryKb(int memoryKb) {
        this.memoryKb = memoryKb;
    }

    public Timestamp getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(Timestamp submittedAt) {
        this.submittedAt = submittedAt;
    }

    @Override
    public String toString() {
        return "Submission{" +
                "id=" + id +
                ", userId=" + userId +
                ", problemTitle='" + problemTitle + '\'' +
                ", verdict=" + verdict +
                ", executionTimeMs=" + executionTimeMs +
                '}';
    }
}

