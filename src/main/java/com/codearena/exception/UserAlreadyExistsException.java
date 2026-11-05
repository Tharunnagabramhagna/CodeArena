package com.codearena.exception;

/**
 * Thrown during registration if the email is already registered.
 */
public class UserAlreadyExistsException extends CodeArenaException {
    private static final long serialVersionUID = 1L;

    public UserAlreadyExistsException(String message) {
        super(message, 409);
    }
}

