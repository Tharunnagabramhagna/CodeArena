package com.codearena.model;

/**
 * Mastery level for a student in a specific programming topic.
 */
public enum ProficiencyLevel {
    BEGINNER,
    INTERMEDIATE,
    ADVANCED;

    public static ProficiencyLevel fromString(String level) {
        if (level == null) return BEGINNER;
        try {
            return ProficiencyLevel.valueOf(level.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return BEGINNER;
        }
    }

    /**
     * Calculates recommended proficiency based on solved problems.
     */
    public static ProficiencyLevel calculate(int solved) {
        if (solved >= 10) return ADVANCED;
        if (solved >= 4) return INTERMEDIATE;
        return BEGINNER;
    }
}

