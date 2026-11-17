/**
 * CodeArena — Application Settings Controller (settings.js)
 * Manages appearance, code editor, interface, and notification preferences
 * with safe localStorage persistence and theme system integration.
 */

(function () {
    'use strict';

    const SETTINGS_KEY = 'codearena_user_settings';

    // Default Configuration
    const DEFAULT_SETTINGS = {
        theme: 'dark',
        highContrast: false,
        editorFontSize: '14px',
        editorTabSize: '4',
        autoCloseBrackets: true,
        showLineNumbers: true,
        defaultReturnStatement: true,
        showExecutionTimer: true,
        autoRunSampleTests: false,
        compactToolbar: false,
        interfaceDensity: 'comfortable',
        reducedMotion: false,
        notifyContests: true,
        notifyStreaks: true
    };

    // State
    let currentSettings = Object.assign({}, DEFAULT_SETTINGS);
    let isAuthenticated = false;

    // DOM Elements Cache
    let dom = {};

    async function init() {
        cacheElements();
        loadSettings();
        applySettingsToUI();
        bindEvents();
        await syncFromServer();
        document.addEventListener('codearena:auth-changed', syncFromServer);
    }

    function cacheElements() {
        dom = {
            syncPill: document.getElementById('settingsSyncPill'),
            themeSelect: document.getElementById('settingThemeSelect'),
            highContrastToggle: document.getElementById('settingHighContrast'),
            fontSizeSelect: document.getElementById('settingFontSize'),
            tabSizeSelect: document.getElementById('settingTabSize'),
            autoCloseToggle: document.getElementById('settingAutoCloseBrackets'),
            lineNumbersToggle: document.getElementById('settingLineNumbers'),
            defaultReturnToggle: document.getElementById('settingDefaultReturn'),
            timerToggle: document.getElementById('settingExecutionTimer'),
            autoRunToggle: document.getElementById('settingAutoRun'),
            compactToolbarToggle: document.getElementById('settingCompactToolbar'),
            notifyContestsToggle: document.getElementById('settingNotifyContests'),
            notifyStreaksToggle: document.getElementById('settingNotifyStreaks'),
            densitySelect: document.getElementById('settingDensitySelect'),
            reducedMotionToggle: document.getElementById('settingReducedMotion'),
            saveBtn: document.getElementById('btnSaveSettings'),
            resetBtn: document.getElementById('btnResetSettings'),
            toastNotice: document.getElementById('settingsToast'),
            // Profile & security elements
            guestNotice: document.getElementById('settingsGuestNotice'),
            accountFormWrap: document.getElementById('settingsAccountFormWrap'),
            avatarInitial: document.getElementById('profileAvatarInitial'),
            headerName: document.getElementById('profileHeaderName'),
            headerEmail: document.getElementById('profileHeaderEmail'),
            fullNameInput: document.getElementById('profileFullName'),
            preferredTrackSelect: document.getElementById('profilePreferredTrack'),
            bioInput: document.getElementById('profileBio'),
            githubInput: document.getElementById('profileGithubUrl'),
            linkedinInput: document.getElementById('profileLinkedinUrl'),
            saveProfileBtn: document.getElementById('btnSaveProfile'),
            pwdCurrent: document.getElementById('pwdCurrent'),
            pwdNew: document.getElementById('pwdNew'),
            pwdConfirm: document.getElementById('pwdConfirm'),
            changePasswordBtn: document.getElementById('btnChangePassword')
        };
    }

    async function syncFromServer() {
        isAuthenticated = false;
        if (!window.CodeArenaAPI || !window.CodeArenaAPI.authService) {
            updateProfileSectionVisibility();
            return;
        }
        try {
            const userRes = await window.CodeArenaAPI.authService.getCurrentUser(true).catch(() => null);
            isAuthenticated = window.CodeArenaAPI.authService.isAuthenticated();
            updateProfileSectionVisibility(userRes && userRes.data);

            if (isAuthenticated && window.CodeArenaAPI.studentService) {
                if (dom.syncPill) dom.syncPill.textContent = 'Synced to Account';
                const [prefRes, profRes] = await Promise.all([
                    window.CodeArenaAPI.studentService.getPreferences(),
                    window.CodeArenaAPI.studentService.getProfile()
                ]);
                if (prefRes && prefRes.success && prefRes.data) {
                    const p = prefRes.data;
                    if (p.theme) currentSettings.theme = p.theme;
                    if (p.editorFontSize) currentSettings.editorFontSize = `${p.editorFontSize}px`;
                    if (p.editorTabSize) currentSettings.editorTabSize = String(p.editorTabSize);
                    if (typeof p.autoCloseBrackets === 'boolean') currentSettings.autoCloseBrackets = p.autoCloseBrackets;
                    if (typeof p.reducedMotion === 'boolean') currentSettings.reducedMotion = p.reducedMotion;
                    applySettingsToUI();
                    applyVisualPreferences();
                }
                if (profRes && profRes.success && profRes.data) {
                    populateProfileForm(profRes.data, userRes && userRes.data);
                }
            } else {
                if (dom.syncPill) dom.syncPill.textContent = 'Local Preferences';
            }
        } catch (e) {
            updateProfileSectionVisibility();
        }
    }

    function updateProfileSectionVisibility(userData) {
        if (isAuthenticated) {
            if (dom.guestNotice) dom.guestNotice.style.display = 'none';
            if (dom.accountFormWrap) dom.accountFormWrap.style.display = 'block';
            if (userData) populateProfileForm({}, userData);
        } else {
            if (dom.guestNotice) dom.guestNotice.style.display = 'block';
            if (dom.accountFormWrap) dom.accountFormWrap.style.display = 'none';
        }
    }

    function populateProfileForm(prof, user) {
        const displayName = (prof && prof.fullName) || (user && (user.fullName || user.name || user.username)) || 'Student';
        const email = (user && user.email) || '';
        if (dom.avatarInitial) dom.avatarInitial.textContent = displayName.charAt(0).toUpperCase();
        if (dom.headerName) dom.headerName.textContent = displayName;
        if (dom.headerEmail) dom.headerEmail.textContent = email;
        if (dom.fullNameInput && prof && prof.fullName !== undefined) dom.fullNameInput.value = prof.fullName || '';
        else if (dom.fullNameInput && !dom.fullNameInput.value && user) dom.fullNameInput.value = user.fullName || user.name || '';
        if (dom.preferredTrackSelect && prof && prof.preferredLanguage) {
            dom.preferredTrackSelect.value = prof.preferredLanguage === 'dsa' ? 'dsa' : 'basic';
        }
        if (dom.bioInput && prof && prof.bio !== undefined) dom.bioInput.value = prof.bio || '';
        if (dom.githubInput && prof && prof.githubUrl !== undefined) dom.githubInput.value = prof.githubUrl || '';
        if (dom.linkedinInput && prof && prof.linkedinUrl !== undefined) dom.linkedinInput.value = prof.linkedinUrl || '';
    }

    function applyVisualPreferences() {
        if (currentSettings.theme) {
            document.documentElement.setAttribute('data-theme', currentSettings.theme);
            try {
                localStorage.setItem('codearena_theme', currentSettings.theme);
                localStorage.setItem('codearena-theme', currentSettings.theme);
            } catch (e) {}
            window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: currentSettings.theme } }));
        }
        if (currentSettings.interfaceDensity === 'compact') {
            document.documentElement.setAttribute('data-density', 'compact');
        } else {
            document.documentElement.removeAttribute('data-density');
        }
        if (currentSettings.reducedMotion) {
            document.documentElement.setAttribute('data-reduced-motion', 'true');
        } else {
            document.documentElement.removeAttribute('data-reduced-motion');
        }
        if (currentSettings.compactToolbar) {
            document.documentElement.setAttribute('data-compact-toolbar', 'true');
        } else {
            document.documentElement.removeAttribute('data-compact-toolbar');
        }
        try {
            localStorage.setItem('codearena_include_default_return', currentSettings.defaultReturnStatement ? 'true' : 'false');
        } catch (e) {}
    }

    function loadSettings() {
        try {
            const raw = localStorage.getItem(SETTINGS_KEY);
            if (raw) {
                currentSettings = Object.assign({}, DEFAULT_SETTINGS, JSON.parse(raw));
            } else {
                // Check currently active theme
                const currentDocTheme = document.documentElement.getAttribute('data-theme') || 'dark';
                currentSettings.theme = currentDocTheme;
            }
        } catch (e) {
            console.warn('[Settings] Using in-memory settings store:', e);
        }
    }

    async function saveSettings() {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(currentSettings));
        } catch (e) {
            console.warn('[Settings] Failed to save settings to localStorage:', e);
        }

        applyVisualPreferences();

        if (isAuthenticated && window.CodeArenaAPI && window.CodeArenaAPI.studentService) {
            try {
                const res = await window.CodeArenaAPI.studentService.updatePreferences({
                    theme: currentSettings.theme,
                    editorFontSize: parseInt(String(currentSettings.editorFontSize).replace(/[^0-9]/g, ''), 10) || 14,
                    editorTabSize: parseInt(String(currentSettings.editorTabSize).replace(/[^0-9]/g, ''), 10) || 4,
                    autoCloseBrackets: Boolean(currentSettings.autoCloseBrackets),
                    reducedMotion: Boolean(currentSettings.reducedMotion)
                });
                if (!res || !res.success) {
                    showToast((res && res.message) || 'Failed to sync preferences to server.');
                    return;
                }
            } catch (e) {
                showToast('Saved locally; server sync failed.');
                return;
            }
        }

        showToast(isAuthenticated ? '✓ Preferences saved to account!' : '✓ Preferences saved locally!');
        if (window.CodeArenaToast) {
            window.CodeArenaToast.success(isAuthenticated ? 'Preferences saved to your account!' : 'Preferences saved locally!');
        }
    }

    function applySettingsToUI() {
        if (dom.themeSelect) dom.themeSelect.value = currentSettings.theme;
        if (dom.highContrastToggle) dom.highContrastToggle.checked = currentSettings.highContrast;
        if (dom.fontSizeSelect) dom.fontSizeSelect.value = currentSettings.editorFontSize;
        if (dom.tabSizeSelect) dom.tabSizeSelect.value = currentSettings.editorTabSize;
        if (dom.autoCloseToggle) dom.autoCloseToggle.checked = currentSettings.autoCloseBrackets;
        if (dom.lineNumbersToggle) dom.lineNumbersToggle.checked = currentSettings.showLineNumbers;
        if (dom.defaultReturnToggle) dom.defaultReturnToggle.checked = currentSettings.defaultReturnStatement;
        if (dom.timerToggle) dom.timerToggle.checked = currentSettings.showExecutionTimer;
        if (dom.autoRunToggle) dom.autoRunToggle.checked = currentSettings.autoRunSampleTests;
        if (dom.compactToolbarToggle) dom.compactToolbarToggle.checked = currentSettings.compactToolbar;
        if (dom.notifyContestsToggle) dom.notifyContestsToggle.checked = currentSettings.notifyContests;
        if (dom.notifyStreaksToggle) dom.notifyStreaksToggle.checked = currentSettings.notifyStreaks;
        if (dom.densitySelect) dom.densitySelect.value = currentSettings.interfaceDensity || 'comfortable';
        if (dom.reducedMotionToggle) dom.reducedMotionToggle.checked = !!currentSettings.reducedMotion;
    }

    function bindEvents() {
        if (dom.saveBtn) {
            dom.saveBtn.addEventListener('click', function () {
                // Read from UI
                if (dom.themeSelect) currentSettings.theme = dom.themeSelect.value;
                if (dom.highContrastToggle) currentSettings.highContrast = dom.highContrastToggle.checked;
                if (dom.fontSizeSelect) currentSettings.editorFontSize = dom.fontSizeSelect.value;
                if (dom.tabSizeSelect) currentSettings.editorTabSize = dom.tabSizeSelect.value;
                if (dom.autoCloseToggle) currentSettings.autoCloseBrackets = dom.autoCloseToggle.checked;
                if (dom.lineNumbersToggle) currentSettings.showLineNumbers = dom.lineNumbersToggle.checked;
                if (dom.defaultReturnToggle) currentSettings.defaultReturnStatement = dom.defaultReturnToggle.checked;
                if (dom.timerToggle) currentSettings.showExecutionTimer = dom.timerToggle.checked;
                if (dom.autoRunToggle) currentSettings.autoRunSampleTests = dom.autoRunToggle.checked;
                if (dom.compactToolbarToggle) currentSettings.compactToolbar = dom.compactToolbarToggle.checked;
                if (dom.notifyContestsToggle) currentSettings.notifyContests = dom.notifyContestsToggle.checked;
                if (dom.notifyStreaksToggle) currentSettings.notifyStreaks = dom.notifyStreaksToggle.checked;
                if (dom.densitySelect) currentSettings.interfaceDensity = dom.densitySelect.value;
                if (dom.reducedMotionToggle) currentSettings.reducedMotion = dom.reducedMotionToggle.checked;

                saveSettings();
            });
        }

        if (dom.resetBtn) {
            dom.resetBtn.addEventListener('click', function () {
                if (confirm('Reset all editor, appearance, and interface preferences to default?')) {
                    currentSettings = Object.assign({}, DEFAULT_SETTINGS);
                    saveSettings();
                    applySettingsToUI();
                    showToast('↺ Preferences reset to defaults');
                    if (window.CodeArenaToast) {
                        window.CodeArenaToast.info('Settings reset to defaults');
                    }
                }
            });
        }

        if (dom.themeSelect) {
            dom.themeSelect.addEventListener('change', function () {
                const val = this.value;
                document.documentElement.setAttribute('data-theme', val);
            });
        }

        if (dom.saveProfileBtn) {
            dom.saveProfileBtn.addEventListener('click', async function () {
                if (!isAuthenticated || !window.CodeArenaAPI || !window.CodeArenaAPI.studentService) return;
                dom.saveProfileBtn.disabled = true;
                try {
                    const payload = {
                        fullName: dom.fullNameInput ? dom.fullNameInput.value.trim() : '',
                        preferredTrack: dom.preferredTrackSelect ? dom.preferredTrackSelect.value : 'basic',
                        bio: dom.bioInput ? dom.bioInput.value.trim() : '',
                        githubUrl: dom.githubInput ? dom.githubInput.value.trim() : '',
                        linkedinUrl: dom.linkedinInput ? dom.linkedinInput.value.trim() : ''
                    };
                    const res = await window.CodeArenaAPI.studentService.updateProfile(payload);
                    if (res && res.success) {
                        populateProfileForm(res.data || payload, window.CodeArenaAPI.authService.getCurrentUserSync()?.data);
                        showToast('✓ Profile updated on server!');
                        if (window.CodeArenaToast) window.CodeArenaToast.success('Profile updated!');
                    } else {
                        const msg = (res && res.message) || 'Unable to save profile.';
                        showToast(msg);
                        if (window.CodeArenaToast) window.CodeArenaToast.error(msg);
                    }
                } catch (e) {
                    showToast('Error updating profile.');
                } finally {
                    dom.saveProfileBtn.disabled = false;
                }
            });
        }

        if (dom.changePasswordBtn) {
            dom.changePasswordBtn.addEventListener('click', async function () {
                if (!isAuthenticated || !window.CodeArenaAPI || !window.CodeArenaAPI.studentService) return;
                const currentPassword = dom.pwdCurrent ? dom.pwdCurrent.value : '';
                const newPassword = dom.pwdNew ? dom.pwdNew.value : '';
                const confirmPassword = dom.pwdConfirm ? dom.pwdConfirm.value : '';
                if (!currentPassword || !newPassword) {
                    showToast('Enter current and new password.');
                    return;
                }
                if (newPassword !== confirmPassword) {
                    showToast('New passwords do not match.');
                    return;
                }
                dom.changePasswordBtn.disabled = true;
                try {
                    const res = await window.CodeArenaAPI.studentService.changePassword({ currentPassword, newPassword });
                    if (res && res.success) {
                        if (dom.pwdCurrent) dom.pwdCurrent.value = '';
                        if (dom.pwdNew) dom.pwdNew.value = '';
                        if (dom.pwdConfirm) dom.pwdConfirm.value = '';
                        showToast('✓ Password updated successfully!');
                        if (window.CodeArenaToast) window.CodeArenaToast.success('Password updated!');
                    } else {
                        const msg = (res && res.message) || 'Password update failed.';
                        showToast(msg);
                        if (window.CodeArenaToast) window.CodeArenaToast.error(msg);
                    }
                } catch (e) {
                    showToast('Error updating password.');
                } finally {
                    dom.changePasswordBtn.disabled = false;
                }
            });
        }
    }

    function showToast(msg) {
        if (!dom.toastNotice) return;
        dom.toastNotice.textContent = msg;
        dom.toastNotice.style.display = 'block';
        dom.toastNotice.style.opacity = '1';
        setTimeout(() => {
            dom.toastNotice.style.opacity = '0';
            setTimeout(() => { dom.toastNotice.style.display = 'none'; }, 300);
        }, 2200);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
