package com.codearena.exception;

/**
 * Thrown when an entity (user, profile, submission) is not found.
 */
public class ResourceNotFoundException extends CodeArenaException {
    private static final long serialVersionUID = 1L;

    public ResourceNotFoundException(String message) {
        super(message, 404);
    }
}

