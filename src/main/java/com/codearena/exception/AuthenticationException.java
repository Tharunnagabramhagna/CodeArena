package com.codearena.exception;

/**
 * Thrown when credentials fail or authentication is invalid.
 */
public class AuthenticationException extends CodeArenaException {
    private static final long serialVersionUID = 1L;

    public AuthenticationException(String message) {
        super(message, 401);
    }
}

