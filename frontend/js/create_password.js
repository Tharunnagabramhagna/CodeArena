/**
 * create_password.js — CodeArena OAuth Signup Password Creation Handler
 * Handles pending OAuth registration state, client-side policy validation,
 * password creation submission, and redirect to dashboard.
 */
(function () {
    'use strict';

    // SVG Icons for OAuth providers
    const GOOGLE_ICON_SVG = `
        <svg class="auth-social-icon icon-google" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
    `;

    const FACEBOOK_ICON_SVG = `
        <svg class="auth-social-icon icon-facebook" width="22" height="22" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
    `;

    document.addEventListener('DOMContentLoaded', initCreatePasswordPage);

    async function initCreatePasswordPage() {
        // Setup password show/hide toggles & live requirement checklist immediately
        setupPasswordToggles();
        setupRequirementChecklist();

        const loadingState = document.getElementById('loadingState');
        const errorState = document.getElementById('errorState');
        const formState = document.getElementById('formState');
        const sessionErrorMessage = document.getElementById('sessionErrorMessage');

        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const returnUrl = params.get('returnUrl') || '/pages/dashboard.html';

        if (!token || !token.trim()) {
            showState(errorState);
            sessionErrorMessage.textContent = 'No registration token provided. Please initiate sign up again.';
            return;
        }

        // Fetch pending registration data from backend
        try {
            const api = (window.CodeArenaAPI && window.CodeArenaAPI.authService) || (typeof authService !== 'undefined' ? authService : null);
            if (!api || typeof api.getOAuthPendingRegistration !== 'function') {
                throw new Error('CodeArena authentication service not loaded.');
            }

            const response = await api.getOAuthPendingRegistration(token);

            if (!response || !response.success || !response.data) {
                showState(errorState);
                const msg = (response && response.message) || 'Your registration session has expired. Please sign in again.';
                sessionErrorMessage.textContent = msg;
                return;
            }

            const pending = response.data;
            setupForm(pending, token, returnUrl, api);
            showState(formState);

        } catch (err) {
            console.error('Failed to load pending registration state:', err);
            showState(errorState);
            sessionErrorMessage.textContent = err.message || 'Unable to connect to authentication server. Please try again.';
        }
    }

    function showState(targetContainer) {
        document.querySelectorAll('.state-container').forEach(el => el.classList.remove('active'));
        if (targetContainer) {
            targetContainer.classList.add('active');
        }
    }

    function setupForm(pending, token, returnUrl, api) {
        const provider = pending.provider || 'Google';
        const providerLabel = document.getElementById('providerLabel');
        const verifiedEmailText = document.getElementById('verifiedEmailText');
        const providerIconContainer = document.getElementById('providerIconContainer');
        const registrationTokenInput = document.getElementById('registrationToken');
        const pageSubtitle = document.getElementById('pageSubtitle');

        registrationTokenInput.value = token;
        verifiedEmailText.textContent = pending.email || 'Verified Account';
        providerLabel.textContent = `${provider} Verified Account`;

        if (provider.toLowerCase() === 'facebook') {
            providerIconContainer.innerHTML = FACEBOOK_ICON_SVG;
        } else {
            providerIconContainer.innerHTML = GOOGLE_ICON_SVG;
        }

        if (pending.isExistingUser) {
            pageSubtitle.textContent = `Welcome back, ${pending.fullName || 'Learner'}! Set a local password to link your ${provider} login with your existing account.`;
        }

        // Setup form submission
        const form = document.getElementById('createPasswordForm');
        form.onsubmit = function (e) {
            handleFormSubmit(e, token, returnUrl, api);
        };
    }

    function setupPasswordToggles() {
        document.querySelectorAll('.toggle-password-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const targetId = this.getAttribute('data-target');
                const targetInput = document.getElementById(targetId);
                if (!targetInput) return;

                const isPassword = targetInput.type === 'password';
                targetInput.type = isPassword ? 'text' : 'password';
                this.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
                this.setAttribute('title', isPassword ? 'Hide password' : 'Show password');

                this.innerHTML = isPassword
                    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
                    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
            });
        });
    }

    function setupRequirementChecklist() {
        const passwordInput = document.getElementById('newPassword');
        const confirmInput = document.getElementById('confirmPassword');

        const reqMinLength = document.getElementById('reqMinLength');
        const reqLetters = document.getElementById('reqLetters');
        const reqSpecialOrNum = document.getElementById('reqSpecialOrNum');
        const reqMatch = document.getElementById('reqMatch');

        function updateChecklist() {
            const pwd = passwordInput.value || '';
            const confirm = confirmInput.value || '';

            const isMinLength = pwd.length >= 8;
            const hasLetters = /[a-zA-Z]/.test(pwd);
            const hasSpecialOrNum = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(pwd);
            const isMatching = isMinLength && pwd === confirm;

            setReqStatus(reqMinLength, isMinLength);
            setReqStatus(reqLetters, hasLetters);
            setReqStatus(reqSpecialOrNum, hasSpecialOrNum);
            setReqStatus(reqMatch, isMatching);
        }

        passwordInput.addEventListener('input', updateChecklist);
        confirmInput.addEventListener('input', updateChecklist);
    }

    function setReqStatus(element, isValid) {
        if (!element) return;
        const icon = element.querySelector('.req-icon');
        if (isValid) {
            element.classList.remove('invalid');
            element.classList.add('valid');
            if (icon) icon.textContent = '✓';
        } else {
            element.classList.remove('valid');
            element.classList.add('invalid');
            if (icon) icon.textContent = '✕';
        }
    }

    async function handleFormSubmit(e, token, returnUrl, api) {
        e.preventDefault();

        const passwordInput = document.getElementById('newPassword');
        const confirmInput = document.getElementById('confirmPassword');
        const submitBtn = document.getElementById('submitBtn');
        const btnText = document.getElementById('btnText');
        const feedback = document.getElementById('authFeedback');

        feedback.className = 'auth-feedback';
        feedback.style.display = 'none';
        feedback.textContent = '';
        passwordInput.classList.remove('input-error');
        confirmInput.classList.remove('input-error');

        const password = passwordInput.value || '';
        const confirmPassword = confirmInput.value || '';

        // Validation checks
        if (password.length < 8) {
            passwordInput.classList.add('input-error');
            showFeedback(feedback, 'Password must be at least 8 characters long.', 'error');
            passwordInput.focus();
            return;
        }

        if (password !== confirmPassword) {
            confirmInput.classList.add('input-error');
            showFeedback(feedback, 'Passwords do not match. Please re-enter identical passwords.', 'error');
            confirmInput.focus();
            return;
        }

        // Disable button & show spinner
        submitBtn.disabled = true;
        const originalText = btnText.textContent;
        btnText.textContent = 'Securing Account & Saving Password...';

        try {
            const result = await api.completeOAuthPasswordRegistration(token, password, confirmPassword);

            if (!result || !result.success) {
                submitBtn.disabled = false;
                btnText.textContent = originalText;
                const errMessage = (result && result.message) || 'Failed to create password. Please try again.';
                showFeedback(feedback, errMessage, 'error');
                return;
            }

            // Success!
            showFeedback(feedback, 'Password created successfully! Welcome to CodeArena.', 'info');
            btnText.textContent = 'Redirecting to Dashboard...';

            // Safe redirection
            let targetRedirect = (result.data && result.data.redirectUrl) || returnUrl || '/pages/dashboard.html';
            setTimeout(() => {
                window.location.href = targetRedirect;
            }, 600);

        } catch (err) {
            console.error('Password creation submission error:', err);
            submitBtn.disabled = false;
            btnText.textContent = originalText;
            showFeedback(feedback, err.message || 'An error occurred while creating your password. Please try again.', 'error');
        }
    }

    function showFeedback(el, message, type) {
        el.className = `auth-feedback feedback-${type}`;
        el.textContent = message;
        el.style.display = 'block';
    }

})();
