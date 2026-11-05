package com.codearena.exception;

/**
 * Base unchecked exception for CodeArena platform.
 */
public class CodeArenaException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    private final int statusCode;

    public CodeArenaException(String message) {
        super(message);
        this.statusCode = 500;
    }

    public CodeArenaException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public CodeArenaException(String message, Throwable cause) {
        super(message, cause);
        this.statusCode = 500;
    }

    public CodeArenaException(String message, int statusCode, Throwable cause) {
        super(message, cause);
        this.statusCode = statusCode;
    }

    public int getStatusCode() {
        return statusCode;
    }
}

