package com.codearena.exception;

/**
 * Thrown when client payload fails business validation checks.
 */
public class ValidationException extends CodeArenaException {
    private static final long serialVersionUID = 1L;

    public ValidationException(String message) {
        super(message, 400);
    }
}

