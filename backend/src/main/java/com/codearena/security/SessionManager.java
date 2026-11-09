package com.codearena.security;

import com.codearena.model.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

/**
 * Manages user HTTP sessions securely.
 * Protects against session fixation attacks and controls session timeouts.
 */
public final class SessionManager {
    public static final String SESSION_USER = "CODEARENA_LOGGED_USER";
    public static final int DEFAULT_SESSION_TIMEOUT_SECONDS = 60 * 60; // 1 hour
    public static final int REMEMBER_ME_TIMEOUT_SECONDS = 14 * 24 * 60 * 60; // 14 days

    private SessionManager() {
    }

    /**
     * Creates an authenticated session for the given user, protecting against session fixation.
     */
    public static HttpSession createSession(HttpServletRequest request, User user, boolean rememberMe) {
        // Prevent session fixation: invalidate any existing unauthenticated session
        HttpSession oldSession = request.getSession(false);
        if (oldSession != null) {
            oldSession.invalidate();
        }

        // Create fresh session
        HttpSession newSession = request.getSession(true);
        newSession.setAttribute(SESSION_USER, user);

        int timeout = rememberMe ? REMEMBER_ME_TIMEOUT_SECONDS : DEFAULT_SESSION_TIMEOUT_SECONDS;
        newSession.setMaxInactiveInterval(timeout);

        return newSession;
    }

    /**
     * Retrieves the currently authenticated User from session, or null if unauthenticated.
     */
    public static User getAuthenticatedUser(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            return null;
        }
        Object userObj = session.getAttribute(SESSION_USER);
        if (userObj instanceof User) {
            return (User) userObj;
        }
        return null;
    }

    /**
     * Checks if the request is associated with an active authenticated session.
     */
    public static boolean isAuthenticated(HttpServletRequest request) {
        return getAuthenticatedUser(request) != null;
    }

    /**
     * Updates user object in current session.
     */
    public static void updateSessionUser(HttpServletRequest request, User user) {
        HttpSession session = request.getSession(false);
        if (session != null && user != null) {
            session.setAttribute(SESSION_USER, user);
        }
    }

    /**
     * Terminates the current session completely.
     */
    public static void invalidateSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.removeAttribute(SESSION_USER);
            session.invalidate();
        }
    }
}

