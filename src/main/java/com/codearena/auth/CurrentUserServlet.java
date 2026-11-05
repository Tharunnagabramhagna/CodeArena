package com.codearena.auth;

import com.codearena.model.User;
import com.codearena.security.SessionManager;
import com.codearena.util.JsonUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Servlet providing current authenticated session user details: GET /api/users/me
 */
@WebServlet(name = "CurrentUserServlet", urlPatterns = {"/api/users/me"})
public class CurrentUserServlet extends HttpServlet {
    private final AuthService authService = new AuthServiceImpl();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json;charset=UTF-8");

        User sessionUser = SessionManager.getAuthenticatedUser(request);
        if (sessionUser == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write(JsonUtil.errorResponse("No active session found.", HttpServletResponse.SC_UNAUTHORIZED));
            return;
        }

        try {
            // Load fresh state from database
            User freshUser = authService.getUserWithProfile(sessionUser.getId());
            SessionManager.updateSessionUser(request, freshUser);

            Map<String, Object> data = new HashMap<>();
            data.put("id", freshUser.getId());
            data.put("fullName", freshUser.getFullName());
            data.put("email", freshUser.getEmail());
            data.put("role", freshUser.getRole());
            data.put("profile", freshUser.getProfile());

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(JsonUtil.successResponse("Current user session retrieved.", data));

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(JsonUtil.errorResponse("Failed to load user profile: " + e.getMessage(), HttpServletResponse.SC_INTERNAL_SERVER_ERROR));
        }
    }
}

