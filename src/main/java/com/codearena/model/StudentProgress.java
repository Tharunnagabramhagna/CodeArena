package com.codearena.model;

import java.io.Serializable;
import java.sql.Timestamp;

/**
 * Tracks a student's learning progress within a specific programming domain.
 * Person 4 Responsibility: Progress module.
 */
public class StudentProgress implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id;
    private int userId;
    private String topic;
    private int problemsAttempted;
    private int problemsSolved;
    private ProficiencyLevel proficiencyLevel;
    private Timestamp lastActivity;

    public StudentProgress() {
        this.problemsAttempted = 0;
        this.problemsSolved = 0;
        this.proficiencyLevel = ProficiencyLevel.BEGINNER;
    }

    public StudentProgress(int userId, String topic) {
        this();
        this.userId = userId;
        this.topic = topic;
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

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public int getProblemsAttempted() {
        return problemsAttempted;
    }

    public void setProblemsAttempted(int problemsAttempted) {
        this.problemsAttempted = problemsAttempted;
    }

    public int getProblemsSolved() {
        return problemsSolved;
    }

    public void setProblemsSolved(int problemsSolved) {
        this.problemsSolved = problemsSolved;
        this.proficiencyLevel = ProficiencyLevel.calculate(problemsSolved);
    }

    public ProficiencyLevel getProficiencyLevel() {
        return proficiencyLevel;
    }

    public void setProficiencyLevel(ProficiencyLevel proficiencyLevel) {
        this.proficiencyLevel = proficiencyLevel;
    }

    public Timestamp getLastActivity() {
        return lastActivity;
    }

    public void setLastActivity(Timestamp lastActivity) {
        this.lastActivity = lastActivity;
    }

    public double getCompletionRate() {
        if (problemsAttempted == 0) return 0.0;
        return ((double) problemsSolved / problemsAttempted) * 100.0;
    }

    @Override
    public String toString() {
        return "StudentProgress{" +
                "userId=" + userId +
                ", topic='" + topic + '\'' +
                ", attempted=" + problemsAttempted +
                ", solved=" + problemsSolved +
                ", level=" + proficiencyLevel +
                '}';
    }
}

