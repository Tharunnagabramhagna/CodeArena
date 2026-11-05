package com.codearena.auth;

import com.codearena.exception.CodeArenaException;
import com.codearena.model.User;
import com.codearena.security.SessionManager;
import com.codearena.util.JsonUtil;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Servlet handling user authentication: POST /api/auth/login
 */
@WebServlet(name = "LoginServlet", urlPatterns = {"/api/auth/login"})
public class LoginServlet extends HttpServlet {
    private final AuthService authService = new AuthServiceImpl();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json;charset=UTF-8");

        try {
            StringBuilder sb = new StringBuilder();
            try (BufferedReader reader = request.getReader()) {
                String line;
                while ((line = reader.readLine()) != null) {
                    sb.append(line);
                }
            }

            if (sb.length() == 0) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write(JsonUtil.errorResponse("Empty login payload.", HttpServletResponse.SC_BAD_REQUEST));
                return;
            }

            JsonObject json = JsonParser.parseString(sb.toString()).getAsJsonObject();
            String email = json.has("email") ? json.get("email").getAsString() : null;
            String password = json.has("password") ? json.get("password").getAsString() : null;
            boolean rememberMe = json.has("rememberMe") && json.get("rememberMe").getAsBoolean();

            String clientIp = request.getHeader("X-Forwarded-For");
            if (clientIp == null || clientIp.isBlank()) {
                clientIp = request.getRemoteAddr();
            }

            User user = authService.login(email, password, clientIp);

            // Create fresh HTTP session (protects against session fixation)
            SessionManager.createSession(request, user, rememberMe);

            Map<String, Object> data = new HashMap<>();
            data.put("id", user.getId());
            data.put("fullName", user.getFullName());
            data.put("email", user.getEmail());
            data.put("role", user.getRole());
            data.put("profile", user.getProfile());

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(JsonUtil.successResponse("Login successful.", data));

        } catch (CodeArenaException e) {
            response.setStatus(e.getStatusCode());
            response.getWriter().write(JsonUtil.errorResponse(e.getMessage(), e.getStatusCode()));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(JsonUtil.errorResponse("An unexpected server error occurred.", HttpServletResponse.SC_INTERNAL_SERVER_ERROR));
        }
    }
}

