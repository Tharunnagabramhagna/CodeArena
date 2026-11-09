package com.codearena.student;

import com.codearena.model.Submission;
import com.codearena.model.SubmissionVerdict;
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
 * Servlet providing submission history and auditing:
 * GET  /api/student/submissions?limit=20&page=1
 * POST /api/student/submissions
 */
@WebServlet(name = "SubmissionHistoryServlet", urlPatterns = {"/api/student/submissions"})
public class SubmissionHistoryServlet extends HttpServlet {
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
            int limit = 20;
            int page = 1;

            String limitParam = request.getParameter("limit");
            if (limitParam != null && !limitParam.isBlank()) {
                limit = Integer.parseInt(limitParam);
            }

            String pageParam = request.getParameter("page");
            if (pageParam != null && !pageParam.isBlank()) {
                page = Integer.parseInt(pageParam);
            }

            Map<String, Object> history = studentService.getSubmissionHistory(sessionUser.getId(), limit, page);
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(JsonUtil.successResponse("Submission history retrieved.", history));

        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(JsonUtil.errorResponse("Invalid pagination parameter format.", HttpServletResponse.SC_BAD_REQUEST));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(JsonUtil.errorResponse("Failed to load submissions: " + e.getMessage(), HttpServletResponse.SC_INTERNAL_SERVER_ERROR));
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
            Submission sub = new Submission();
            sub.setUserId(sessionUser.getId());
            sub.setProblemId(json.has("problemId") ? json.get("problemId").getAsInt() : 1);
            sub.setProblemTitle(json.has("problemTitle") ? json.get("problemTitle").getAsString() : "Sample Problem");
            sub.setLanguage(json.has("language") ? json.get("language").getAsString() : "Java");
            sub.setCode(json.has("code") ? json.get("code").getAsString() : "");
            sub.setVerdict(json.has("verdict") ? SubmissionVerdict.fromString(json.get("verdict").getAsString()) : SubmissionVerdict.ACCEPTED);
            sub.setExecutionTimeMs(json.has("executionTimeMs") ? json.get("executionTimeMs").getAsInt() : 5);
            sub.setMemoryKb(json.has("memoryKb") ? json.get("memoryKb").getAsInt() : 40960);

            Submission saved = studentService.recordSubmission(sub);

            response.setStatus(HttpServletResponse.SC_CREATED);
            response.getWriter().write(JsonUtil.successResponse("Submission recorded successfully.", saved));

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(JsonUtil.errorResponse("Failed to record submission: " + e.getMessage(), HttpServletResponse.SC_INTERNAL_SERVER_ERROR));
        }
    }
}

