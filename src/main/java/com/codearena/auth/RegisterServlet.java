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
 * Servlet handling student registration: POST /api/auth/register
 */
@WebServlet(name = "RegisterServlet", urlPatterns = {"/api/auth/register"})
public class RegisterServlet extends HttpServlet {
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
                response.getWriter().write(JsonUtil.errorResponse("Empty request payload.", HttpServletResponse.SC_BAD_REQUEST));
                return;
            }

            JsonObject json = JsonParser.parseString(sb.toString()).getAsJsonObject();
            String fullName = json.has("fullName") ? json.get("fullName").getAsString() : null;
            String email = json.has("email") ? json.get("email").getAsString() : null;
            String password = json.has("password") ? json.get("password").getAsString() : null;

            User createdUser = authService.register(fullName, email, password);

            // Establish authenticated session immediately
            SessionManager.createSession(request, createdUser, false);

            Map<String, Object> userData = new HashMap<>();
            userData.put("id", createdUser.getId());
            userData.put("fullName", createdUser.getFullName());
            userData.put("email", createdUser.getEmail());
            userData.put("role", createdUser.getRole());

            response.setStatus(HttpServletResponse.SC_CREATED);
            response.getWriter().write(JsonUtil.successResponse("Account created successfully.", userData));

        } catch (CodeArenaException e) {
            response.setStatus(e.getStatusCode());
            response.getWriter().write(JsonUtil.errorResponse(e.getMessage(), e.getStatusCode()));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(JsonUtil.errorResponse("An unexpected server error occurred.", HttpServletResponse.SC_INTERNAL_SERVER_ERROR));
        }
    }
}

