package com.codearena.security;

import com.codearena.util.JsonUtil;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Set;

/**
 * Authentication Filter intercepting secured API endpoints.
 * Validates session presence and rejects unauthenticated requests with HTTP 401 JSON.
 */
@WebFilter(filterName = "AuthFilter", urlPatterns = {"/api/*"})
public class AuthFilter implements Filter {

    // Public endpoints that do not require an existing session
    private static final Set<String> PUBLIC_ENDPOINTS = Set.of(
            "/api/auth/login",
            "/api/auth/register",
            "/api/auth/logout"
    );

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Initialization if needed
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) servletRequest;
        HttpServletResponse httpResponse = (HttpServletResponse) servletResponse;

        // Allow CORS preflight OPTIONS requests without auth check
        if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
            chain.doFilter(servletRequest, servletResponse);
            return;
        }

        String requestURI = httpRequest.getRequestURI();
        String contextPath = httpRequest.getContextPath();
        String relativePath = requestURI.substring(contextPath.length());

        // Check if endpoint is public
        if (isPublicEndpoint(relativePath)) {
            chain.doFilter(servletRequest, servletResponse);
            return;
        }

        // Validate session authentication
        if (SessionManager.isAuthenticated(httpRequest)) {
            chain.doFilter(servletRequest, servletResponse);
        } else {
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            httpResponse.setContentType("application/json;charset=UTF-8");
            httpResponse.getWriter().write(
                    JsonUtil.errorResponse("Authentication required. Please log in to access this resource.", HttpServletResponse.SC_UNAUTHORIZED)
            );
        }
    }

    private boolean isPublicEndpoint(String path) {
        if (PUBLIC_ENDPOINTS.contains(path)) {
            return true;
        }
        // Also allow root static assets or health checks
        return !path.startsWith("/api/student") && !path.startsWith("/api/users");
    }

    @Override
    public void destroy() {
        // Cleanup if needed
    }
}

