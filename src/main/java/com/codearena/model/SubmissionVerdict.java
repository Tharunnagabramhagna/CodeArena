package com.codearena.model;

/**
 * Outcome verdict for an automated code submission evaluation.
 */
public enum SubmissionVerdict {
    ACCEPTED,
    WRONG_ANSWER,
    TIME_LIMIT_EXCEEDED,
    COMPILATION_ERROR,
    RUNTIME_ERROR,
    PENDING;

    public static SubmissionVerdict fromString(String verdict) {
        if (verdict == null) return PENDING;
        try {
            return SubmissionVerdict.valueOf(verdict.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return PENDING;
        }
    }
}

