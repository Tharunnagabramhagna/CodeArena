package com.codearena.student;

import com.codearena.exception.CodeArenaException;
import com.codearena.model.StudentProfile;
import com.codearena.model.User;
import com.codearena.security.SessionManager;
import com.codearena.util.JsonUtil;
import com.codearena.util.ValidationUtil;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;

/**
 * Servlet handling student profile retrieval and updates:
 * GET  /api/student/profile
 * PUT  /api/student/profile
 * POST /api/student/profile
 */
@WebServlet(name = "StudentProfileServlet", urlPatterns = {"/api/student/profile"})
public class StudentProfileServlet extends HttpServlet {
    private final StudentService studentService = new StudentServiceImpl();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json;charset=UTF-8");

        User sessionUser = SessionManager.getAuthenticatedUser(request);
        if (sessionUser == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write(JsonUtil.errorResponse("Authentication required.", HttpServletResponse.SC_UNAUTHORIZED));
            return;
        }

        try {
            StudentProfile profile = studentService.getProfile(sessionUser.getId());
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(JsonUtil.successResponse("Student profile retrieved.", profile));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(JsonUtil.errorResponse("Failed to load profile: " + e.getMessage(), HttpServletResponse.SC_INTERNAL_SERVER_ERROR));
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        handleProfileUpdate(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        handleProfileUpdate(request, response);
    }

    private void handleProfileUpdate(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        response.setContentType("application/json;charset=UTF-8");

        User sessionUser = SessionManager.getAuthenticatedUser(request);
        if (sessionUser == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write(JsonUtil.errorResponse("Authentication required.", HttpServletResponse.SC_UNAUTHORIZED));
            return;
        }

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
                response.getWriter().write(JsonUtil.errorResponse("Empty update payload.", HttpServletResponse.SC_BAD_REQUEST));
                return;
            }

            JsonObject json = JsonParser.parseString(sb.toString()).getAsJsonObject();
            StudentProfile update = new StudentProfile();
            if (json.has("bio")) update.setBio(ValidationUtil.sanitize(json.get("bio").getAsString()));
            if (json.has("githubUrl")) update.setGithubUrl(json.get("githubUrl").getAsString().trim());
            if (json.has("linkedinUrl")) update.setLinkedinUrl(json.get("linkedinUrl").getAsString().trim());
            if (json.has("preferredLanguage")) update.setPreferredLanguage(json.get("preferredLanguage").getAsString().trim());
            if (json.has("avatarUrl")) update.setAvatarUrl(json.get("avatarUrl").getAsString().trim());

            StudentProfile updated = studentService.updateProfile(sessionUser.getId(), update);

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(JsonUtil.successResponse("Profile updated successfully.", updated));

        } catch (CodeArenaException e) {
            response.setStatus(e.getStatusCode());
            response.getWriter().write(JsonUtil.errorResponse(e.getMessage(), e.getStatusCode()));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(JsonUtil.errorResponse("Failed to update profile: " + e.getMessage(), HttpServletResponse.SC_INTERNAL_SERVER_ERROR));
        }
    }
}

