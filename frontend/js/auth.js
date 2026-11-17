// auth.js — CodeArena Authentication UI & Validation Helper
// IMPORTANT: Backend authentication via Java Servlets & JDBC is implemented in a future phase.
// This script provides client-side form validation, password visibility toggle,
// and clean API service layer communication via window.CodeArenaAPI.
// It DOES NOT store passwords, DOES NOT fabricate auth sessions, and DOES NOT mock successful login.

document.addEventListener('DOMContentLoaded', function () {
    // --------------------------------------------------------------------------
    // 1. Password Visibility Toggle (Show / Hide)
    // --------------------------------------------------------------------------
    const passwordToggles = document.querySelectorAll('.toggle-password-btn');

    passwordToggles.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const targetInputId = btn.getAttribute('data-target');
            const targetInput = document.getElementById(targetInputId);
            if (!targetInput) return;

            const isPassword = targetInput.type === 'password';
            targetInput.type = isPassword ? 'text' : 'password';

            btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
            btn.setAttribute('title', isPassword ? 'Hide password' : 'Show password');

            // Toggle SVG icon paths (Eye vs Eye-Off)
            btn.innerHTML = isPassword
                ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
                : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
        });
    });

    // --------------------------------------------------------------------------
    // 2. Login Form Client-Side Validation & API Service Dispatch
    // --------------------------------------------------------------------------
    const loginForm = document.getElementById('loginForm');
    const loginFeedback = document.getElementById('authFeedback');

    // Check URL parameters for authentication notices (e.g. AI Assistant gate)
    const urlParams = new URLSearchParams(window.location.search);
    const authNotice = urlParams.get('notice');
    if ((authNotice === 'ai_auth_required' || authNotice === 'auth_required') && loginFeedback) {
        showFeedback(loginFeedback, 'Authentication is required to use the CodeArena AI Assistant. Please sign in or register to continue to your coding sessions.', 'info');
    }

    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function (e) {
            e.preventDefault();
            if (window.CodeArenaAuthModal && typeof window.CodeArenaAuthModal.open === 'function') {
                window.CodeArenaAuthModal.open('forgot');
            } else {
                window.location.href = '../pages/dashboard.html?auth=forgot';
            }
        });
    }

    if (loginForm && loginFeedback) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const emailInput = document.getElementById('loginEmail');
            const passwordInput = document.getElementById('loginPassword');
            const rememberMeInput = document.getElementById('rememberMe');
            const submitBtn = loginForm.querySelector('button[type="submit"]');

            const email = emailInput ? emailInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value : '';
            const rememberMe = rememberMeInput ? rememberMeInput.checked : false;

            // Basic client-side format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                showFeedback(loginFeedback, 'Please enter a valid email address.', 'error');
                if (emailInput) emailInput.classList.add('input-error');
                return;
            } else if (emailInput) {
                emailInput.classList.remove('input-error');
            }

            if (!password || password.length < 6) {
                showFeedback(loginFeedback, 'Password must be at least 6 characters.', 'error');
                if (passwordInput) passwordInput.classList.add('input-error');
                return;
            } else if (passwordInput) {
                passwordInput.classList.remove('input-error');
            }

            // Set loading presentation state
            const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Log In';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Signing in...';
            }

            try {
                // Dispatch through service layer
                if (window.CodeArenaAPI && window.CodeArenaAPI.authService) {
                    const result = await window.CodeArenaAPI.authService.login({ email, password, rememberMe });
                    if (result.success) {
                        showFeedback(loginFeedback, 'Signed in successfully! Redirecting...', 'info');
                        const urlParams = new URLSearchParams(window.location.search);
                        const redirectUrl = urlParams.get('redirect') || 'dashboard.html';
                        setTimeout(function () {
                            window.location.href = redirectUrl;
                        }, 500);
                    } else {
                        showFeedback(loginFeedback, result.message || 'Authentication failed. Please check your credentials.', 'error');
                    }
                } else {
                    showFeedback(
                        loginFeedback,
                        'CodeArena authentication service failed to load. Please refresh the page.',
                        'error'
                    );
                }
            } catch (err) {
                showFeedback(loginFeedback, 'Network communication failed. Please check connection.', 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
            }
        });
    }

    // --------------------------------------------------------------------------
    // 3. Signup Form Client-Side Validation & API Service Dispatch
    // --------------------------------------------------------------------------
    const signupForm = document.getElementById('signupForm');
    const signupFeedback = document.getElementById('authFeedback');

    if (signupForm && signupFeedback) {
        signupForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const nameInput = document.getElementById('signupName');
            const emailInput = document.getElementById('signupEmail');
            const passwordInput = document.getElementById('signupPassword');
            const confirmInput = document.getElementById('signupConfirmPassword');
            const submitBtn = signupForm.querySelector('button[type="submit"]');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value : '';
            const confirmPassword = confirmInput ? confirmInput.value : '';

            // Reset error highlights
            [nameInput, emailInput, passwordInput, confirmInput].forEach(function (inp) {
                if (inp) inp.classList.remove('input-error');
            });

            if (!name || name.length < 2) {
                showFeedback(signupFeedback, 'Please enter your full name (minimum 2 characters).', 'error');
                if (nameInput) nameInput.classList.add('input-error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                showFeedback(signupFeedback, 'Please enter a valid email address.', 'error');
                if (emailInput) emailInput.classList.add('input-error');
                return;
            }

            if (!password || password.length < 8) {
                showFeedback(signupFeedback, 'Password must be at least 8 characters.', 'error');
                if (passwordInput) passwordInput.classList.add('input-error');
                return;
            }

            if (password !== confirmPassword) {
                showFeedback(signupFeedback, 'Passwords do not match. Please re-enter carefully.', 'error');
                if (confirmInput) confirmInput.classList.add('input-error');
                return;
            }

            // Set loading presentation state
            const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Create Account';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Creating account...';
            }

            try {
                // Dispatch through service layer
                if (window.CodeArenaAPI && window.CodeArenaAPI.authService) {
                    const result = await window.CodeArenaAPI.authService.register({ fullName: name, email, password });
                    if (result.success) {
                        showFeedback(signupFeedback, 'Account created successfully! Redirecting...', 'info');
                        const urlParams = new URLSearchParams(window.location.search);
                        const redirectUrl = urlParams.get('redirect') || 'dashboard.html';
                        setTimeout(function () {
                            window.location.href = redirectUrl;
                        }, 500);
                    } else {
                        showFeedback(signupFeedback, result.message || 'Registration failed. Please review your details.', 'error');
                    }
                } else {
                    showFeedback(
                        signupFeedback,
                        'CodeArena registration service failed to load. Please refresh the page.',
                        'error'
                    );
                }
            } catch (err) {
                showFeedback(signupFeedback, 'Network communication failed. Please check connection.', 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
            }
        });
    }

    // --------------------------------------------------------------------------
    // 4. Social Authentication Handlers (Google & Facebook)
    // --------------------------------------------------------------------------
    let oauthConfig = { google: { enabled: false }, facebook: { enabled: false } };

    // Check for callback errors in URL (reuses urlParams initialized on line 39)
    const errParam = urlParams.get('error');
    if (errParam) {
        const feedbackEl = document.getElementById('authFeedback') || document.getElementById('signupFeedback');
        if (feedbackEl) {
            showFeedback(feedbackEl, decodeURIComponent(errParam), 'error');
        }
    }

    // Fetch OAuth server status
    async function loadOAuthConfig() {
        try {
            if (window.CodeArenaAPI && window.CodeArenaAPI.authService && window.CodeArenaAPI.authService.getOAuthConfig) {
                const res = await window.CodeArenaAPI.authService.getOAuthConfig();
                if (res && res.success && res.data) {
                    oauthConfig = res.data;
                    updateOAuthUI();
                    return;
                }
            }
            const apiBase = (typeof resolveDefaultApiBase === 'function') ? resolveDefaultApiBase() : '/api';
            const res = await fetch(apiBase + '/auth/oauth/config');
            const data = await res.json();
            if (data && data.success && data.data) {
                oauthConfig = data.data;
            }
        } catch (e) {
            // Keep graceful fallback
        } finally {
            updateOAuthUI();
        }
    }
    loadOAuthConfig();

    function updateOAuthUI() {
        const socialButtons = document.querySelectorAll('.btn-auth-social');
        socialButtons.forEach(function (btn) {
            const provider = (btn.getAttribute('data-provider') || '').toLowerCase();
            const isConfigured = oauthConfig && oauthConfig[provider] && oauthConfig[provider].enabled;
            if (!isConfigured) {
                btn.style.opacity = '0.65';
                btn.title = (btn.getAttribute('data-provider') || 'Social') + ' sign-in is not configured on this server.';
            } else {
                btn.style.opacity = '1';
                btn.title = 'Continue with ' + (btn.getAttribute('data-provider') || 'Social');
            }
        });
    }

    const socialButtons = document.querySelectorAll('.btn-auth-social');
    socialButtons.forEach(function (btn) {
        btn.addEventListener('click', async function (e) {
            e.preventDefault();
            const providerName = btn.getAttribute('data-provider') || 'Social';
            const provider = providerName.toLowerCase();
            const feedbackEl = document.getElementById('authFeedback') || document.getElementById('signupFeedback');

            let isConfigured = oauthConfig && oauthConfig[provider] && oauthConfig[provider].enabled;
            if (!isConfigured) {
                try {
                    await loadOAuthConfig();
                    isConfigured = oauthConfig && oauthConfig[provider] && oauthConfig[provider].enabled;
                } catch (ignored) { }
            }
            if (!isConfigured) {
                if (feedbackEl) {
                    const msg = `${providerName} OAuth sign-in is not configured on this server. Please register or log in with email and password.`;
                    showFeedback(feedbackEl, msg, 'info');
                    feedbackEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
                return;
            }

            try {
                btn.disabled = true;
                const returnDest = (typeof window !== 'undefined' && window.location) ? window.location.href : '/pages/dashboard.html';
                let data = null;
                if (window.CodeArenaAPI && window.CodeArenaAPI.authService && window.CodeArenaAPI.authService.getOAuthUrl) {
                    data = await window.CodeArenaAPI.authService.getOAuthUrl(provider, returnDest);
                } else {
                    const apiBase = (typeof resolveDefaultApiBase === 'function') ? resolveDefaultApiBase() : '/api';
                    const res = await fetch(`${apiBase}/auth/oauth/${provider}/url?returnUrl=` + encodeURIComponent(returnDest));
                    data = await res.json();
                }

                const authUrl = data && data.data && data.data.authorizationUrl;
                if (data && data.success && authUrl) {
                    window.location.href = authUrl;
                } else {
                    if (feedbackEl) {
                        showFeedback(feedbackEl, (data && data.message) ? data.message : `Failed to initiate ${providerName} sign-in.`, 'error');
                    }
                }
            } catch (err) {
                if (feedbackEl) {
                    showFeedback(feedbackEl, `Unable to reach OAuth service. Please try again.`, 'error');
                }
            } finally {
                btn.disabled = false;
            }
        });
    });

    // --------------------------------------------------------------------------
    // Helper: Display Feedback Message
    // --------------------------------------------------------------------------
    function showFeedback(element, message, type) {
        element.textContent = message;
        element.className = 'auth-feedback ' + (type === 'error' ? 'feedback-error' : 'feedback-info');
        element.style.display = 'block';
    }
});
