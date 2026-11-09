package com.codearena.auth;

import com.codearena.security.SessionManager;
import com.codearena.util.JsonUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

/**
 * Servlet handling session termination: POST /api/auth/logout
 */
@WebServlet(name = "LogoutServlet", urlPatterns = {"/api/auth/logout"})
public class LogoutServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json;charset=UTF-8");

        SessionManager.invalidateSession(request);

        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().write(JsonUtil.successResponse("Logged out successfully.", null));
    }
}

