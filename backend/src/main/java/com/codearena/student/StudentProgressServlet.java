package com.codearena.student;

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
import java.util.Map;

/**
 * Servlet handling saved learning progress & topic breakdown:
 * GET  /api/student/progress
 * POST /api/student/progress
 */
@WebServlet(name = "StudentProgressServlet", urlPatterns = {"/api/student/progress"})
public class StudentProgressServlet extends HttpServlet {
    private final StudentService studentService = new StudentServiceImpl();
    private final StudentProgressDAO progressDAO = new StudentProgressDAOImpl();

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
            Map<String, Object> progress = studentService.getProgressOverview(sessionUser.getId());
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(JsonUtil.successResponse("Progress overview retrieved.", progress));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(JsonUtil.errorResponse("Failed to load progress: " + e.getMessage(), HttpServletResponse.SC_INTERNAL_SERVER_ERROR));
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

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

            JsonObject json = JsonParser.parseString(sb.toString()).getAsJsonObject();
            String topic = json.has("topic") ? json.get("topic").getAsString() : "General";
            boolean solved = json.has("solved") && json.get("solved").getAsBoolean();

            boolean success = progressDAO.recordProgress(sessionUser.getId(), topic, solved);

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(JsonUtil.successResponse("Topic progress updated.", Map.of("updated", success)));

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(JsonUtil.errorResponse("Failed to update progress: " + e.getMessage(), HttpServletResponse.SC_INTERNAL_SERVER_ERROR));
        }
    }
}

