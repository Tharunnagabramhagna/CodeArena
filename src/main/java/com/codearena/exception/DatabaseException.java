package com.codearena.exception;

/**
 * Thrown when low-level JDBC SQL operations fail.
 */
public class DatabaseException extends CodeArenaException {
    private static final long serialVersionUID = 1L;

    public DatabaseException(String message, Throwable cause) {
        super(message, 500, cause);
    }
}

