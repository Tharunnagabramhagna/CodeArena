/**
 * CodeArena — Premium Split-Panel Glassmorphism Authentication Modal (auth_modal.js)
 * Provides an industry-level, two-column floating glassmorphism authentication
 * experience with rich branding, dual-view switching (Login & Sign Up),
 * 4-tier live password strength calculation, accessible keyboard trapping,
 * and seamless integration with window.CodeArenaAPI.authService.
 */

(function () {
    'use strict';

    let modalOverlay = null;
    let modalCard = null;
    let activeTriggerElement = null;
    let currentView = 'login'; // 'login' | 'signup'

    // Premium Vector SVGs
    const ICONS = {
        eye: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
        eyeOff: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
        spinner: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="auth-spin" aria-hidden="true" style="animation: authSpin 0.8s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`,
        check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`,
        google: `<svg class="auth-social-icon icon-google" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>`,
        facebook: `<svg class="auth-social-icon icon-facebook" width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`
    };

    /**
     * Resolves the correct relative path for assets depending on page depth.
     */
    function getAssetBasePath() {
        if (typeof window === 'undefined' || !window.location) return 'assets/';
        const path = window.location.pathname.toLowerCase();
        return (path.includes('/pages/') || (path.endsWith('.html') && !path.endsWith('/index.html') && !path.endsWith('index.html')))
            ? '../assets/'
            : 'assets/';
    }

    /**
     * Injects the Split-Panel Glassmorphism template into document.body.
     */
    function ensureModalInDOM() {
        if (document.getElementById('codeArenaAuthModalOverlay')) {
            modalOverlay = document.getElementById('codeArenaAuthModalOverlay');
            modalCard = document.getElementById('codeArenaAuthModalCard');
            return;
        }

        const logoSrc = getAssetBasePath() + 'images/codearena-full-icon.png';

        const template = `
        <div class="auth-modal-overlay" id="codeArenaAuthModalOverlay" role="dialog" aria-modal="true" aria-labelledby="authModalTitle" aria-describedby="authModalSubtitle">
            <div class="auth-modal-card" id="codeArenaAuthModalCard">
                
                <!-- LEFT PANEL: CodeArena Branding & Value Proposition -->
                <div class="auth-modal-brand-panel" id="authModalBrandPanel">
                    <div class="auth-brand-glow-orb" aria-hidden="true"></div>
                    <div class="auth-brand-glow-orb-secondary" aria-hidden="true"></div>

                    <!-- Brand Top -->
                    <div class="auth-brand-top">
                        <div class="auth-brand-logo-wrap">
                            <img src="${logoSrc}" alt="CodeArena" class="brand-full-logo auth-modal-brand-logo">
                        </div>
                        <h3 class="auth-brand-headline">Your Next Coding Breakthrough Starts Here.</h3>
                        <p class="auth-brand-desc">Master data structures and algorithms with interactive Java challenges, AI-guided hints, and real-time execution.</p>
                    </div>

                    <!-- Code Motif Card -->
                    <div class="auth-code-motif" aria-hidden="true">
                        <div class="auth-code-motif-header">
                            <div class="auth-code-dots">
                                <span class="auth-code-dot dot-red"></span>
                                <span class="auth-code-dot dot-amber"></span>
                                <span class="auth-code-dot dot-green"></span>
                            </div>
                            <span class="auth-code-file">Solution.java</span>
                            <span class="auth-code-badge">Java 17</span>
                        </div>
                        <pre class="auth-code-snippet"><code><span class="c-kw">public class</span> <span class="c-type">Solution</span> {
    <span class="c-kw">public boolean</span> <span class="c-fn">isBreakthrough</span>() {
        <span class="c-kw">return</span> <span class="c-type">CodeArena</span>.<span class="c-fn">masterDSA</span>();
    }
}</code></pre>
                    </div>

                    <!-- 3 Feature Highlights -->
                    <div class="auth-brand-highlights">
                        <div class="auth-highlight-item">
                            <div class="auth-highlight-icon">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <polyline points="16 18 22 12 16 6"></polyline>
                                    <polyline points="8 6 2 12 8 18"></polyline>
                                </svg>
                            </div>
                            <div class="auth-highlight-text">
                                <strong>Master Java &amp; DSA</strong>
                                <span>Algorithmic patterns &amp; structured roadmaps</span>
                            </div>
                        </div>

                        <div class="auth-highlight-item">
                            <div class="auth-highlight-icon">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="m4.93 4.93 4.24 4.24"></path>
                                    <path d="m14.83 9.17 4.24-4.24"></path>
                                    <path d="m14.83 14.83 4.24 4.24"></path>
                                    <path d="m9.17 14.83-4.24 4.24"></path>
                                    <circle cx="12" cy="12" r="4"></circle>
                                </svg>
                            </div>
                            <div class="auth-highlight-text">
                                <strong>Practice Real-World Challenges</strong>
                                <span>200 canonical problems with 3-tier hints</span>
                            </div>
                        </div>

                        <div class="auth-highlight-item">
                            <div class="auth-highlight-icon">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <line x1="18" y1="20" x2="18" y2="10"></line>
                                    <line x1="12" y1="20" x2="12" y2="4"></line>
                                    <line x1="6" y1="20" x2="6" y2="14"></line>
                                </svg>
                            </div>
                            <div class="auth-highlight-text">
                                <strong>Track Your Learning Journey</strong>
                                <span>Submission analytics &amp; problem progression</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- RIGHT PANEL: Authentication Form -->
                <div class="auth-modal-form-panel">
                    <!-- Close Button -->
                    <button type="button" class="auth-modal-close-btn" id="btnAuthModalClose" aria-label="Close authentication modal">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>

                    <!-- Segmented View Switcher -->
                    <div class="auth-modal-tabs" role="tablist" aria-label="Authentication mode">
                        <button type="button" class="auth-tab-btn active" id="tabBtnLogin" role="tab" aria-selected="true" aria-controls="paneAuthLogin">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                                <polyline points="10 17 15 12 10 7"></polyline>
                                <line x1="15" y1="12" x2="3" y2="12"></line>
                            </svg>
                            <span>Log In</span>
                        </button>
                        <button type="button" class="auth-tab-btn" id="tabBtnSignup" role="tab" aria-selected="false" aria-controls="paneAuthSignup">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="8.5" cy="7" r="4"></circle>
                                <line x1="20" y1="8" x2="20" y2="14"></line>
                                <line x1="23" y1="11" x2="17" y2="11"></line>
                            </svg>
                            <span>Sign Up</span>
                        </button>
                    </div>

                    <!-- Header Description -->
                    <div class="auth-form-header">
                        <h2 class="auth-modal-title" id="authModalTitle">Welcome back</h2>
                        <p class="auth-modal-subtitle" id="authModalSubtitle">Enter your credentials to access your CodeArena workspace.</p>
                    </div>

                    <!-- Feedback Alert Container -->
                    <div class="auth-modal-feedback" id="modalAuthFeedback" role="alert" aria-live="polite"></div>

                    <!-- Panes Scroll Container -->
                    <div class="auth-panes-scroll-wrap">
                        
                        <!-- PANE 1: LOGIN VIEW -->
                        <div class="auth-view-pane active" id="paneAuthLogin" role="tabpanel" aria-labelledby="tabBtnLogin">
                            <form class="auth-modal-form" id="modalLoginForm" novalidate>
                                <!-- Email field -->
                                <div class="auth-field-group">
                                    <label class="auth-field-label" for="modalLoginEmail">Email address</label>
                                    <div class="auth-input-wrapper">
                                        <span class="auth-input-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                                <polyline points="22,6 12,13 2,6"></polyline>
                                            </svg>
                                        </span>
                                        <input type="email" id="modalLoginEmail" name="email" class="auth-glass-input" placeholder="name@example.com" required autocomplete="email">
                                    </div>
                                    <div class="auth-field-error" id="errorModalLoginEmail"></div>
                                </div>

                                <!-- Password field -->
                                <div class="auth-field-group">
                                    <label class="auth-field-label" for="modalLoginPassword">Password</label>
                                    <div class="auth-input-wrapper">
                                        <span class="auth-input-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                            </svg>
                                        </span>
                                        <input type="password" id="modalLoginPassword" name="password" class="auth-glass-input" placeholder="Enter your password" required autocomplete="current-password">
                                        <button type="button" class="auth-toggle-pwd-btn" data-target="modalLoginPassword" aria-label="Show password" title="Show password">
                                            ${ICONS.eye}
                                        </button>
                                    </div>
                                    <div class="auth-field-error" id="errorModalLoginPassword"></div>
                                </div>

                                <!-- Remember Me & Forgot Password -->
                                <div class="auth-options-row">
                                    <label class="auth-checkbox-label">
                                        <input type="checkbox" id="modalLoginRememberMe" name="rememberMe" checked>
                                        <span>Remember me</span>
                                    </label>
                                    <a href="#" class="auth-link-forgot" id="modalForgotPasswordLink">Forgot password?</a>
                                </div>

                                <!-- Submit Button -->
                                <button type="submit" class="btn-auth-submit" id="btnModalLoginSubmit">
                                    <span>Log In</span>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </button>
                            </form>

                            <!-- Social Divider -->
                            <div class="auth-social-divider" role="separator" aria-label="Or continue with social providers">
                                <span>OR CONTINUE WITH</span>
                            </div>

                            <!-- Social Sign-in Buttons -->
                            <div class="auth-social-buttons">
                                <button type="button" class="btn-auth-social btn-auth-google" id="btnLoginGoogle" data-provider="Google" aria-label="Continue with Google">
                                    ${ICONS.google}
                                    <span>Continue with Google</span>
                                </button>
                                <button type="button" class="btn-auth-social btn-auth-facebook" id="btnLoginFacebook" data-provider="Facebook" aria-label="Continue with Facebook">
                                    ${ICONS.facebook}
                                    <span>Continue with Facebook</span>
                                </button>
                            </div>

                            <div class="auth-modal-footer">
                                <span>Don't have an account?</span>
                                <button type="button" class="auth-modal-switch-btn" id="btnSwitchToSignup">Sign up</button>
                            </div>
                        </div>

                        <!-- PANE 2: SIGN UP VIEW -->
                        <div class="auth-view-pane" id="paneAuthSignup" role="tabpanel" aria-labelledby="tabBtnSignup">
                            <form class="auth-modal-form" id="modalSignupForm" novalidate>
                                <!-- Full Name field -->
                                <div class="auth-field-group">
                                    <label class="auth-field-label" for="modalSignupName">Full name</label>
                                    <div class="auth-input-wrapper">
                                        <span class="auth-input-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                <circle cx="12" cy="7" r="4"></circle>
                                            </svg>
                                        </span>
                                        <input type="text" id="modalSignupName" name="fullName" class="auth-glass-input" placeholder="e.g. Alex Morgan" required autocomplete="name">
                                    </div>
                                    <div class="auth-field-error" id="errorModalSignupName"></div>
                                </div>

                                <!-- Email field -->
                                <div class="auth-field-group">
                                    <label class="auth-field-label" for="modalSignupEmail">Email address</label>
                                    <div class="auth-input-wrapper">
                                        <span class="auth-input-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                                <polyline points="22,6 12,13 2,6"></polyline>
                                            </svg>
                                        </span>
                                        <input type="email" id="modalSignupEmail" name="email" class="auth-glass-input" placeholder="name@example.com" required autocomplete="email">
                                    </div>
                                    <div class="auth-field-error" id="errorModalSignupEmail"></div>
                                </div>

                                <!-- Password field -->
                                <div class="auth-field-group">
                                    <label class="auth-field-label" for="modalSignupPassword">Password</label>
                                    <div class="auth-input-wrapper">
                                        <span class="auth-input-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                            </svg>
                                        </span>
                                        <input type="password" id="modalSignupPassword" name="password" class="auth-glass-input" placeholder="At least 8 characters" minlength="8" required autocomplete="new-password">
                                        <button type="button" class="auth-toggle-pwd-btn" data-target="modalSignupPassword" aria-label="Show password" title="Show password">
                                            ${ICONS.eye}
                                        </button>
                                    </div>
                                    <!-- Password Strength Meter -->
                                    <div class="auth-pwd-strength-container" id="signupPwdStrengthContainer">
                                        <div class="auth-pwd-strength-bars">
                                            <span class="auth-pwd-strength-bar" id="pwdBar1"></span>
                                            <span class="auth-pwd-strength-bar" id="pwdBar2"></span>
                                            <span class="auth-pwd-strength-bar" id="pwdBar3"></span>
                                            <span class="auth-pwd-strength-bar" id="pwdBar4"></span>
                                        </div>
                                        <div class="auth-pwd-strength-text">
                                            <span id="pwdStrengthLabel">Password strength</span>
                                            <span id="pwdStrengthStatus">—</span>
                                        </div>
                                    </div>
                                    <div class="auth-field-error" id="errorModalSignupPassword"></div>
                                </div>

                                <!-- Confirm Password field -->
                                <div class="auth-field-group">
                                    <label class="auth-field-label" for="modalSignupConfirmPassword">Confirm password</label>
                                    <div class="auth-input-wrapper">
                                        <span class="auth-input-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                            </svg>
                                        </span>
                                        <input type="password" id="modalSignupConfirmPassword" name="confirmPassword" class="auth-glass-input" placeholder="Re-enter your password" minlength="8" required autocomplete="new-password">
                                        <button type="button" class="auth-toggle-pwd-btn" data-target="modalSignupConfirmPassword" aria-label="Show password" title="Show password">
                                            ${ICONS.eye}
                                        </button>
                                    </div>
                                    <div class="auth-field-error" id="errorModalSignupConfirm"></div>
                                </div>

                                <!-- Terms Checkbox -->
                                <div class="auth-field-group" style="gap: 2px;">
                                    <label class="auth-checkbox-label">
                                        <input type="checkbox" id="modalTermsAgree" name="termsAgree" required>
                                        <span>I agree to the <a href="#" class="auth-link-inline" id="modalTermsLink">Terms</a> &amp; <a href="#" class="auth-link-inline" id="modalPrivacyLink">Privacy</a></span>
                                    </label>
                                    <div class="auth-field-error" id="errorModalTerms"></div>
                                </div>

                                <!-- Submit Button -->
                                <button type="submit" class="btn-auth-submit" id="btnModalSignupSubmit">
                                    <span>Create Account</span>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </button>
                            </form>

                            <!-- Social Divider -->
                            <div class="auth-social-divider" role="separator" aria-label="Or continue with social providers">
                                <span>OR CONTINUE WITH</span>
                            </div>

                            <!-- Social Sign-in Buttons -->
                            <div class="auth-social-buttons">
                                <button type="button" class="btn-auth-social btn-auth-google" id="btnSignupGoogle" data-provider="Google" aria-label="Continue with Google">
                                    ${ICONS.google}
                                    <span>Continue with Google</span>
                                </button>
                                <button type="button" class="btn-auth-social btn-auth-facebook" id="btnSignupFacebook" data-provider="Facebook" aria-label="Continue with Facebook">
                                    ${ICONS.facebook}
                                    <span>Continue with Facebook</span>
                                </button>
                            </div>

                            <div class="auth-modal-footer">
                                <span>Already have an account?</span>
                                <button type="button" class="auth-modal-switch-btn" id="btnSwitchToLogin">Log in</button>
                            </div>
                        </div>
                    </div>

                    <!-- Preview Notice Footer -->
                    <div class="auth-modal-preview-notice">
                        <span>ℹ️ Client-side preview session. Real authentication with Java Servlets, BCrypt &amp; JDBC connects in upcoming phase.</span>
                    </div>
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', template);
        modalOverlay = document.getElementById('codeArenaAuthModalOverlay');
        modalCard = document.getElementById('codeArenaAuthModalCard');
    }

    /**
     * Calculates password strength on a scale of 0 to 4.
     */
    function computePasswordStrength(pwd) {
        if (!pwd) return { score: 0, label: '—', cls: '' };

        let score = 0;
        if (pwd.length >= 8) score += 1;
        if (pwd.length >= 12) score += 1;
        if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 1;
        if (/\d/.test(pwd)) score += 1;
        if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;

        if (score > 4) score = 4;
        if (score === 0 && pwd.length > 0) score = 1;

        if (score === 1) return { score: 1, label: 'Weak (add numbers & symbols)', cls: 'active-weak' };
        if (score === 2) return { score: 2, label: 'Fair (add uppercase & symbols)', cls: 'active-medium' };
        if (score === 3) return { score: 3, label: 'Good (almost strong)', cls: 'active-strong' };
        return { score: 4, label: 'Strong password', cls: 'active-strong' };
    }

    /**
     * Updates the password strength meter UI.
     */
    function updatePasswordStrengthUI(val) {
        const result = computePasswordStrength(val);
        const bars = [
            document.getElementById('pwdBar1'),
            document.getElementById('pwdBar2'),
            document.getElementById('pwdBar3'),
            document.getElementById('pwdBar4')
        ];
        const label = document.getElementById('pwdStrengthStatus');

        if (label) {
            label.textContent = result.label;
        }

        bars.forEach((bar, idx) => {
            if (!bar) return;
            bar.className = 'auth-pwd-strength-bar';
            if (val && idx < result.score) {
                bar.classList.add(result.cls);
            }
        });
    }

    /**
     * Switches between Login and Sign Up views inside the modal.
     */
    function switchView(view) {
        currentView = view === 'signup' ? 'signup' : 'login';
        clearValidationErrors();

        const tabLogin = document.getElementById('tabBtnLogin');
        const tabSignup = document.getElementById('tabBtnSignup');
        const paneLogin = document.getElementById('paneAuthLogin');
        const paneSignup = document.getElementById('paneAuthSignup');
        const title = document.getElementById('authModalTitle');
        const subtitle = document.getElementById('authModalSubtitle');

        if (currentView === 'login') {
            if (tabLogin) {
                tabLogin.classList.add('active');
                tabLogin.setAttribute('aria-selected', 'true');
            }
            if (tabSignup) {
                tabSignup.classList.remove('active');
                tabSignup.setAttribute('aria-selected', 'false');
            }
            if (paneLogin) paneLogin.classList.add('active');
            if (paneSignup) paneSignup.classList.remove('active');

            if (title) title.textContent = 'Welcome back';
            if (subtitle) subtitle.textContent = 'Enter your credentials to access your CodeArena workspace.';

            setTimeout(() => {
                const emailInp = document.getElementById('modalLoginEmail');
                if (emailInp) emailInp.focus();
            }, 60);
        } else {
            if (tabSignup) {
                tabSignup.classList.add('active');
                tabSignup.setAttribute('aria-selected', 'true');
            }
            if (tabLogin) {
                tabLogin.classList.remove('active');
                tabLogin.setAttribute('aria-selected', 'false');
            }
            if (paneSignup) paneSignup.classList.add('active');
            if (paneLogin) paneLogin.classList.remove('active');

            if (title) title.textContent = 'Create your account';
            if (subtitle) subtitle.textContent = 'Join CodeArena to practice algorithms and level up your Java skills.';

            setTimeout(() => {
                const nameInp = document.getElementById('modalSignupName');
                if (nameInp) nameInp.focus();
            }, 60);
        }
    }

    /**
     * Shows modal feedback alert (error, info, success).
     */
    function showModalFeedback(msg, type = 'error') {
        const box = document.getElementById('modalAuthFeedback');
        if (!box) return;

        let iconSvg = '';
        if (type === 'error') {
            iconSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
        } else if (type === 'success') {
            iconSvg = ICONS.check;
        } else {
            iconSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
        }

        box.innerHTML = `<span>${iconSvg}</span><span>${msg}</span>`;
        box.className = `auth-modal-feedback feedback-${type}`;
        box.style.display = 'flex';
    }

    /**
     * Hides modal feedback.
     */
    function hideModalFeedback() {
        const box = document.getElementById('modalAuthFeedback');
        if (box) {
            box.style.display = 'none';
            box.textContent = '';
        }
    }

    /**
     * Clears all validation errors and red outlines.
     */
    function clearValidationErrors() {
        hideModalFeedback();
        document.querySelectorAll('.auth-glass-input').forEach(inp => inp.classList.remove('input-error'));
        document.querySelectorAll('.auth-field-error').forEach(err => {
            err.textContent = '';
            err.classList.remove('visible');
        });
    }

    /**
     * Sets error for a specific field.
     */
    function setFieldError(inputId, errorId, message) {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        if (input) input.classList.add('input-error');
        if (error) {
            error.textContent = message;
            error.classList.add('visible');
        }
    }

    /**
     * Opens the modal.
     */
    function openModal(view = 'login', triggerElem = null) {
        ensureModalInDOM();
        activeTriggerElement = triggerElem || document.activeElement;

        switchView(view);

        document.body.style.overflow = 'hidden';
        modalOverlay.classList.add('active');

        setTimeout(() => {
            const firstInp = currentView === 'login'
                ? document.getElementById('modalLoginEmail')
                : document.getElementById('modalSignupName');
            if (firstInp) firstInp.focus();
        }, 120);
    }

    /**
     * Closes the modal.
     */
    function closeModal() {
        if (!modalOverlay || !modalOverlay.classList.contains('active')) return;

        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        clearValidationErrors();

        if (activeTriggerElement && typeof activeTriggerElement.focus === 'function') {
            try {
                activeTriggerElement.focus();
            } catch (e) {}
        }
    }

    /**
     * Traps keyboard tab navigation inside modal.
     */
    function handleKeydown(e) {
        if (!modalOverlay || !modalOverlay.classList.contains('active')) return;

        if (e.key === 'Escape') {
            e.preventDefault();
            closeModal();
            return;
        }

        if (e.key === 'Tab') {
            const focusables = modalOverlay.querySelectorAll(
                'button:not([disabled]), input:not([disabled]), a[href], [tabindex="0"]'
            );
            const visibleFocusables = Array.from(focusables).filter(el => {
                const pane = el.closest('.auth-view-pane');
                return !pane || pane.classList.contains('active');
            });

            if (visibleFocusables.length === 0) return;

            const first = visibleFocusables[0];
            const last = visibleFocusables[visibleFocusables.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }
    }

    /**
     * Handles password visibility toggling.
     */
    function setupPasswordToggles() {
        document.querySelectorAll('.auth-toggle-pwd-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = btn.getAttribute('data-target');
                const inp = document.getElementById(targetId);
                if (!inp) return;

                const isPassword = inp.type === 'password';
                inp.type = isPassword ? 'text' : 'password';

                btn.innerHTML = isPassword ? ICONS.eyeOff : ICONS.eye;
                const label = isPassword ? 'Hide password' : 'Show password';
                btn.setAttribute('aria-label', label);
                btn.setAttribute('title', label);
            });
        });
    }

    /**
     * Handles live validation for password strength.
     */
    function setupPasswordStrength() {
        const signupPwd = document.getElementById('modalSignupPassword');
        if (signupPwd) {
            signupPwd.addEventListener('input', function () {
                updatePasswordStrengthUI(this.value);
            });
        }
    }

    /**
     * Submits the Login form.
     */
    async function handleLoginSubmit(e) {
        e.preventDefault();
        clearValidationErrors();

        const emailInp = document.getElementById('modalLoginEmail');
        const pwdInp = document.getElementById('modalLoginPassword');
        const rememberInp = document.getElementById('modalLoginRememberMe');
        const submitBtn = document.getElementById('btnModalLoginSubmit');

        const email = emailInp ? emailInp.value.trim() : '';
        const password = pwdInp ? pwdInp.value : '';
        const rememberMe = rememberInp ? rememberInp.checked : true;

        let hasError = false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            setFieldError('modalLoginEmail', 'errorModalLoginEmail', 'Please enter your email address.');
            hasError = true;
        } else if (!emailRegex.test(email)) {
            setFieldError('modalLoginEmail', 'errorModalLoginEmail', 'Please enter a valid email address.');
            hasError = true;
        }

        if (!password) {
            setFieldError('modalLoginPassword', 'errorModalLoginPassword', 'Please enter your password.');
            hasError = true;
        } else if (password.length < 6) {
            setFieldError('modalLoginPassword', 'errorModalLoginPassword', 'Password must be at least 6 characters.');
            hasError = true;
        }

        if (hasError) {
            showModalFeedback('Please correct the highlighted fields before signing in.', 'error');
            return;
        }

        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `${ICONS.spinner} <span>Signing in...</span>`;

        try {
            let res = null;
            if (window.CodeArenaAPI && window.CodeArenaAPI.authService) {
                res = await window.CodeArenaAPI.authService.login({ email, password, rememberMe });
            } else {
                const fallbackUser = {
                    id: 'usr_' + Date.now(),
                    name: email.split('@')[0],
                    email: email,
                    role: 'Student',
                    plan: 'free',
                    isMockSession: true
                };
                try {
                    localStorage.setItem('codearena_auth_user', JSON.stringify(fallbackUser));
                } catch (e) {}
                res = { success: true, data: { user: fallbackUser } };
            }

            if (res && res.success) {
                showModalFeedback('Signed in successfully (Preview Session)!', 'success');
                submitBtn.innerHTML = `${ICONS.check} <span>Signed In!</span>`;

                document.dispatchEvent(new CustomEvent('codearena:auth-changed', {
                    detail: { user: (res.data && res.data.user) || { email }, action: 'login' }
                }));

                const urlParams = new URLSearchParams(window.location.search);
                const redirect = urlParams.get('redirect');

                setTimeout(() => {
                    closeModal();
                    if (redirect) {
                        window.location.href = redirect;
                    } else if (window.location.pathname.endsWith('submissions.html')) {
                        window.location.reload();
                    }
                }, 600);
            } else {
                showModalFeedback(res.message || 'Authentication failed. Please verify credentials.', 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        } catch (err) {
            showModalFeedback('An error occurred during authentication preview.', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    /**
     * Submits the Sign Up form.
     */
    async function handleSignupSubmit(e) {
        e.preventDefault();
        clearValidationErrors();

        const nameInp = document.getElementById('modalSignupName');
        const emailInp = document.getElementById('modalSignupEmail');
        const pwdInp = document.getElementById('modalSignupPassword');
        const confirmInp = document.getElementById('modalSignupConfirmPassword');
        const termsInp = document.getElementById('modalTermsAgree');
        const submitBtn = document.getElementById('btnModalSignupSubmit');

        const name = nameInp ? nameInp.value.trim() : '';
        const email = emailInp ? emailInp.value.trim() : '';
        const password = pwdInp ? pwdInp.value : '';
        const confirmPassword = confirmInp ? confirmInp.value : '';
        const termsAgreed = termsInp ? termsInp.checked : false;

        let hasError = false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name || name.length < 2) {
            setFieldError('modalSignupName', 'errorModalSignupName', 'Please enter your full name (at least 2 characters).');
            hasError = true;
        }

        if (!email) {
            setFieldError('modalSignupEmail', 'errorModalSignupEmail', 'Please enter your email address.');
            hasError = true;
        } else if (!emailRegex.test(email)) {
            setFieldError('modalSignupEmail', 'errorModalSignupEmail', 'Please enter a valid email address.');
            hasError = true;
        }

        if (!password) {
            setFieldError('modalSignupPassword', 'errorModalSignupPassword', 'Please choose a password.');
            hasError = true;
        } else if (password.length < 8) {
            setFieldError('modalSignupPassword', 'errorModalSignupPassword', 'Password must be at least 8 characters long.');
            hasError = true;
        }

        if (password && confirmPassword && password !== confirmPassword) {
            setFieldError('modalSignupConfirmPassword', 'errorModalSignupConfirm', 'Passwords do not match. Please re-enter.');
            hasError = true;
        } else if (!confirmPassword) {
            setFieldError('modalSignupConfirmPassword', 'errorModalSignupConfirm', 'Please confirm your password.');
            hasError = true;
        }

        if (!termsAgreed) {
            setFieldError('modalTermsAgree', 'errorModalTerms', 'You must agree to the Terms of Service to create an account.');
            hasError = true;
        }

        if (hasError) {
            showModalFeedback('Please correct the highlighted fields to continue.', 'error');
            return;
        }

        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `${ICONS.spinner} <span>Creating account...</span>`;

        try {
            let res = null;
            if (window.CodeArenaAPI && window.CodeArenaAPI.authService) {
                res = await window.CodeArenaAPI.authService.register({ fullName: name, email, password });
            } else {
                const fallbackUser = {
                    id: 'usr_' + Date.now(),
                    name: name,
                    email: email,
                    role: 'Student',
                    plan: 'free',
                    isMockSession: true
                };
                try {
                    localStorage.setItem('codearena_auth_user', JSON.stringify(fallbackUser));
                } catch (e) {}
                res = { success: true, data: { user: fallbackUser } };
            }

            if (res && res.success) {
                showModalFeedback('Account created successfully (Preview Session)!', 'success');
                submitBtn.innerHTML = `${ICONS.check} <span>Account Created!</span>`;

                document.dispatchEvent(new CustomEvent('codearena:auth-changed', {
                    detail: { user: (res.data && res.data.user) || { name, email }, action: 'register' }
                }));

                const urlParams = new URLSearchParams(window.location.search);
                const redirect = urlParams.get('redirect');

                setTimeout(() => {
                    closeModal();
                    if (redirect) {
                        window.location.href = redirect;
                    } else if (window.location.pathname.endsWith('submissions.html')) {
                        window.location.reload();
                    }
                }, 600);
            } else {
                showModalFeedback(res.message || 'Registration failed. Please try again.', 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        } catch (err) {
            showModalFeedback('An error occurred during account registration preview.', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    /**
     * Binds event listeners for modal interactions.
     */
    function bindEvents() {
        const closeBtn = document.getElementById('btnAuthModalClose');
        if (closeBtn) closeBtn.addEventListener('click', closeModal);

        if (modalOverlay) {
            modalOverlay.addEventListener('click', function (e) {
                if (e.target === modalOverlay) closeModal();
            });
        }

        document.addEventListener('keydown', handleKeydown);

        // Tab buttons
        const tabLogin = document.getElementById('tabBtnLogin');
        const tabSignup = document.getElementById('tabBtnSignup');
        if (tabLogin) tabLogin.addEventListener('click', () => switchView('login'));
        if (tabSignup) tabSignup.addEventListener('click', () => switchView('signup'));

        // Switch buttons at footer
        const btnSwitchSignup = document.getElementById('btnSwitchToSignup');
        const btnSwitchLogin = document.getElementById('btnSwitchToLogin');
        if (btnSwitchSignup) btnSwitchSignup.addEventListener('click', () => switchView('signup'));
        if (btnSwitchLogin) btnSwitchLogin.addEventListener('click', () => switchView('login'));

        // Forms
        const loginForm = document.getElementById('modalLoginForm');
        const signupForm = document.getElementById('modalSignupForm');
        if (loginForm) loginForm.addEventListener('submit', handleLoginSubmit);
        if (signupForm) signupForm.addEventListener('submit', handleSignupSubmit);

        // Forgot password link (preview notification)
        const forgotLink = document.getElementById('modalForgotPasswordLink');
        if (forgotLink) {
            forgotLink.addEventListener('click', function (e) {
                e.preventDefault();
                showModalFeedback('Password recovery will connect to SMTP email microservice in backend phase.', 'info');
            });
        }

        // Terms and Privacy links
        const termsLink = document.getElementById('modalTermsLink');
        const privacyLink = document.getElementById('modalPrivacyLink');
        [termsLink, privacyLink].forEach(link => {
            if (link) {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    showModalFeedback('CodeArena Terms of Service & Privacy Policy preview agreement active.', 'info');
                });
            }
        });

        // Social Sign-in buttons (Google & Facebook)
        document.querySelectorAll('.btn-auth-social').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const provider = btn.getAttribute('data-provider') || 'Social';
                showModalFeedback(`${provider} authentication will be available when the authentication backend is integrated.`, 'info');
            });
        });

        setupPasswordToggles();
        setupPasswordStrength();
    }

    /**
     * Scans document for links/buttons that point to login or signup
     * and binds modal opening interceptors.
     */
    function bindAuthTriggers() {
        if (typeof window !== 'undefined' && window.location && window.location.pathname) {
            const p = window.location.pathname.toLowerCase();
            if (p.endsWith('login.html') || p.endsWith('signup.html')) {
                return;
            }
        }

        const selector = [
            'a[href$="login.html"]',
            'a[href*="login.html?"]',
            'a[href$="signup.html"]',
            'a[href*="signup.html?"]',
            '.login-link',
            '.signup-link',
            '.dash-auth-login',
            '.dash-auth-signup',
            '[data-auth-modal]',
            '#btnSubLogin',
            '#btnSubSignup'
        ].join(', ');

        document.querySelectorAll(selector).forEach(elem => {
            if (elem.dataset.authModalBound === 'true') return;
            elem.dataset.authModalBound = 'true';

            elem.addEventListener('click', function (e) {
                if (e.ctrlKey || e.metaKey || e.button === 1) return;

                e.preventDefault();
                e.stopPropagation();

                const href = (elem.getAttribute('href') || '').toLowerCase();
                const dataVal = (elem.getAttribute('data-auth-modal') || '').toLowerCase();
                const cls = (elem.className || '').toLowerCase();
                const text = (elem.textContent || '').toLowerCase();

                let targetView = 'login';
                if (dataVal === 'signup' || href.includes('signup') || cls.includes('signup') || text.includes('sign up') || text.includes('create account') || text.includes('create free account')) {
                    targetView = 'signup';
                }

                openModal(targetView, elem);
            });
        });
    }

    /**
     * Initializes the modal component once DOM is ready.
     */
    function init() {
        ensureModalInDOM();
        bindEvents();
        bindAuthTriggers();

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('auth')) {
            const authParam = urlParams.get('auth');
            if (authParam === 'signup' || authParam === 'register') {
                openModal('signup');
                if (urlParams.has('sample')) {
                    const pwdInp = document.getElementById('modalSignupPassword');
                    if (pwdInp) {
                        pwdInp.value = 'CodeArena#2026!Dev';
                        updatePasswordStrengthUI(pwdInp.value);
                    }
                }
            } else if (authParam === 'login' || authParam === 'signin' || authParam === 'modal') {
                openModal('login');
            }

            if (urlParams.has('social')) {
                const prov = urlParams.get('social');
                const provName = prov.toLowerCase() === 'facebook' ? 'Facebook' : 'Google';
                showModalFeedback(`${provName} sign-in will be available when authentication integration is enabled.`, 'info');
            }
        }

        if (!document.getElementById('authModalKeyframes')) {
            const style = document.createElement('style');
            style.id = 'authModalKeyframes';
            style.textContent = `
                @keyframes authSpin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose Public API
    window.CodeArenaAuthModal = {
        open: openModal,
        close: closeModal,
        switchView: switchView,
        isOpen: function () {
            return Boolean(modalOverlay && modalOverlay.classList.contains('active'));
        },
        rebindTriggers: bindAuthTriggers
    };

})();
