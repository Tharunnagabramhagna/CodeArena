// api.js — CodeArena Centralized API Client & Service Layer
// Connects frontend to Java Servlet + JDBC backend endpoints.
// Encapsulates network communication, JSON serialization, headers, and error handling.

const API_CONFIG = {
    // Base URL; defaults to relative '/api' or can be set via window.CODEARENA_API_BASE
    baseURL: (typeof window !== 'undefined' && window.CODEARENA_API_BASE) || '/codearena/api',
    timeoutMs: 6000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// Fallback detection: if running standalone without context path, try '/api'
if (typeof window !== 'undefined' && !window.CODEARENA_API_BASE && window.location.pathname.indexOf('/codearena') === -1) {
    API_CONFIG.baseURL = '/api';
}

/**
 * Low-level HTTP client with timeout, JSON parsing, and unified error handling.
 */
async function apiClient(endpoint, options = {}) {
    const url = `${API_CONFIG.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(function () { controller.abort(); }, API_CONFIG.timeoutMs);

    const config = Object.assign({
        method: options.method || 'GET',
        headers: Object.assign({}, API_CONFIG.headers, options.headers || {}),
        credentials: 'include', // Preserves HTTP-only session cookies from Java Servlets
        signal: controller.signal
    }, options);

    if (options.body && typeof options.body === 'object') {
        config.body = JSON.stringify(options.body);
    }

    try {
        const response = await fetch(url, config);
        clearTimeout(timeoutId);

        let data = null;
        const contentType = response.headers.get('content-type') || '';
        if (contentType.indexOf('application/json') !== -1) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            const error = new Error((data && data.message) || ('HTTP error! Status: ' + response.status));
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return {
            success: true,
            status: response.status,
            data: data && data.data !== undefined ? data.data : data,
            raw: data
        };
    } catch (err) {
        clearTimeout(timeoutId);
        const isNetworkFailure = err.name === 'AbortError' || err.name === 'TypeError' || !err.status;
        return {
            success: false,
            status: err.status || 0,
            isNetworkFailure: isNetworkFailure,
            message: isNetworkFailure
                ? 'Backend service is connecting. Ensure Tomcat and MySQL are running.'
                : (err.message || 'An unexpected error occurred.')
        };
    }
}

/**
 * Authentication Service Layer (Person 4 - Kavya)
 */
const authService = {
    /**
     * POST /api/auth/login
     * @param {Object} credentials - { email, password, rememberMe }
     */
    async login(credentials) {
        return apiClient('/auth/login', {
            method: 'POST',
            body: {
                email: credentials.email,
                password: credentials.password,
                rememberMe: Boolean(credentials.rememberMe)
            }
        });
    },

    /**
     * POST /api/auth/register
     * @param {Object} userData - { fullName, email, password }
     */
    async register(userData) {
        return apiClient('/auth/register', {
            method: 'POST',
            body: {
                fullName: userData.fullName,
                email: userData.email,
                password: userData.password
            }
        });
    },

    /**
     * POST /api/auth/logout
     */
    async logout() {
        return apiClient('/auth/logout', {
            method: 'POST'
        });
    },

    /**
     * GET /api/users/me
     */
    async getCurrentUser() {
        return apiClient('/users/me', {
            method: 'GET'
        });
    }
};

/**
 * Student Services Layer (Person 4 - Kavya)
 */
const studentService = {
    /**
     * GET /api/student/profile
     */
    async getProfile() {
        return apiClient('/student/profile', {
            method: 'GET'
        });
    },

    /**
     * PUT /api/student/profile
     */
    async updateProfile(profileData) {
        return apiClient('/student/profile', {
            method: 'PUT',
            body: profileData
        });
    },

    /**
     * GET /api/student/progress
     */
    async getProgress() {
        return apiClient('/student/progress', {
            method: 'GET'
        });
    },

    /**
     * GET /api/student/submissions
     */
    async getSubmissions(page = 1, limit = 20) {
        return apiClient(`/student/submissions?page=${page}&limit=${limit}`, {
            method: 'GET'
        });
    },

    /**
     * POST /api/student/submissions
     */
    async recordSubmission(submissionData) {
        return apiClient('/student/submissions', {
            method: 'POST',
            body: submissionData
        });
    }
};

// Expose to window for frontend consumption
if (typeof window !== 'undefined') {
    window.CodeArenaAPI = {
        config: API_CONFIG,
        client: apiClient,
        authService: authService,
        studentService: studentService
    };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_CONFIG, apiClient, authService, studentService };
}
