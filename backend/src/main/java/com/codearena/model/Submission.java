
package com.codearena.model;

public class Submission {

    // Submission details
    private int id;
    private int problemId;
    private int userId;
    private String sourceCode;
    private String language;
    private String status;
    private String verdict;
    private String submittedAt;
    private long executionTime;
    private long memoryUsed;

    // Default constructor
    public Submission() {
    }

    // Parameterized constructor
    public Submission(int id, int problemId, int userId, String sourceCode, String language,String status, String verdict, String submittedAt, long executionTime, long memoryUsed) {

        this.id = id;
        this.problemId = problemId;
        this.userId = userId;
        this.sourceCode = sourceCode;
        this.language = language;
        this.status = status;
        this.verdict = verdict;
        this.submittedAt = submittedAt;
        this.executionTime = executionTime;
        this.memoryUsed = memoryUsed;
    }

    // Getter and setter for id
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    // Getter and setter for problemId
    public int getProblemId() {
        return problemId;
    }

    public void setProblemId(int problemId) {
        this.problemId = problemId;
    }

    // Getter and setter for userId
    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    // Getter and setter for sourceCode
    public String getSourceCode() {
        return sourceCode;
    }

    public void setSourceCode(String sourceCode) {
        this.sourceCode = sourceCode;
    }

    // Getter and setter for language
    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    // Getter and setter for status
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // Getter and setter for verdict
    public String getVerdict() {
        return verdict;
    }

    public void setVerdict(String verdict) {
        this.verdict = verdict;
    }

    // Getter and setter for submittedAt
    public String getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(String submittedAt) {
        this.submittedAt = submittedAt;
    }

    // Getter and setter for executionTime
    public long getExecutionTime() {
        return executionTime;
    }

    public void setExecutionTime(long executionTime) {
        this.executionTime = executionTime;
    }

    // Getter and setter for memoryUsed
    public long getMemoryUsed() {
        return memoryUsed;
    }

    public void setMemoryUsed(long memoryUsed) {
        this.memoryUsed = memoryUsed;
    }
}
