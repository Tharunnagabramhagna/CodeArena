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
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    if (forgotPasswordLink && loginFeedback) {
        forgotPasswordLink.addEventListener('click', function (e) {
            e.preventDefault();
            showFeedback(loginFeedback, 'Password reset will be enabled when backend email service is connected.', 'info');
        });
    }

    const loginForm = document.getElementById('loginForm');
    const loginFeedback = document.getElementById('authFeedback');

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
                        showFeedback(loginFeedback, 'Authentication successful.', 'info');
                    } else {
                        showFeedback(loginFeedback, result.message, 'info');
                    }
                } else {
                    showFeedback(
                        loginFeedback,
                        'Frontend validation passed. Backend authentication will be connected via Java Servlets & JDBC in the upcoming development phase.',
                        'info'
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
                        showFeedback(signupFeedback, 'Registration successful.', 'info');
                    } else {
                        showFeedback(signupFeedback, result.message, 'info');
                    }
                } else {
                    showFeedback(
                        signupFeedback,
                        'Frontend registration form validated successfully. User persistence to the MySQL database will be activated in the backend integration phase.',
                        'info'
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
    // Helper: Display Feedback Message
    // --------------------------------------------------------------------------
    function showFeedback(element, message, type) {
        element.textContent = message;
        element.className = 'auth-feedback ' + (type === 'error' ? 'feedback-error' : 'feedback-info');
        element.style.display = 'block';
    }
});
