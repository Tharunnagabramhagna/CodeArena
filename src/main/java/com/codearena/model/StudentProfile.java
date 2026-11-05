package com.codearena.model;

import java.io.Serializable;
import java.sql.Date;
import java.sql.Timestamp;

/**
 * Encapsulates student profile metadata, biographical details, and stats.
 * Person 4 Responsibility: Student services module.
 */
public class StudentProfile implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id;
    private int userId;
    private String bio;
    private String githubUrl;
    private String linkedinUrl;
    private String preferredLanguage;
    private String avatarUrl;
    private int rankingScore;
    private int problemsSolved;
    private int streakDays;
    private Date lastActiveDate;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    public StudentProfile() {
        this.preferredLanguage = "Java";
        this.rankingScore = 0;
        this.problemsSolved = 0;
        this.streakDays = 0;
    }

    public StudentProfile(int userId) {
        this();
        this.userId = userId;
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

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }

    public void setLinkedinUrl(String linkedinUrl) {
        this.linkedinUrl = linkedinUrl;
    }

    public String getPreferredLanguage() {
        return preferredLanguage;
    }

    public void setPreferredLanguage(String preferredLanguage) {
        this.preferredLanguage = preferredLanguage;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public int getRankingScore() {
        return rankingScore;
    }

    public void setRankingScore(int rankingScore) {
        this.rankingScore = rankingScore;
    }

    public int getProblemsSolved() {
        return problemsSolved;
    }

    public void setProblemsSolved(int problemsSolved) {
        this.problemsSolved = problemsSolved;
    }

    public int getStreakDays() {
        return streakDays;
    }

    public void setStreakDays(int streakDays) {
        this.streakDays = streakDays;
    }

    public Date getLastActiveDate() {
        return lastActiveDate;
    }

    public void setLastActiveDate(Date lastActiveDate) {
        this.lastActiveDate = lastActiveDate;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "StudentProfile{" +
                "userId=" + userId +
                ", preferredLanguage='" + preferredLanguage + '\'' +
                ", rankingScore=" + rankingScore +
                ", problemsSolved=" + problemsSolved +
                ", streakDays=" + streakDays +
                '}';
    }
}

