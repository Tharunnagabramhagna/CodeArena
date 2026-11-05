package com.codearena.model;

/**
 * Defines system roles for users within the CodeArena platform.
 */
public enum Role {
    STUDENT,
    ADMIN,
    INSTRUCTOR;

    public static Role fromString(String role) {
        if (role == null) return STUDENT;
        try {
            return Role.valueOf(role.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return STUDENT;
        }
    }
}

