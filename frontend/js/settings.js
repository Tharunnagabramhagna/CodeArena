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

    // DOM Elements Cache
    let dom = {};

    function init() {
        cacheElements();
        loadSettings();
        applySettingsToUI();
        bindEvents();
    }

    function cacheElements() {
        dom = {
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
            toastNotice: document.getElementById('settingsToast')
        };
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

    function saveSettings() {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(currentSettings));
        } catch (e) {
            console.warn('[Settings] Failed to save settings to localStorage:', e);
        }

        // Apply theme immediately if changed
        if (currentSettings.theme) {
            document.documentElement.setAttribute('data-theme', currentSettings.theme);
            try {
                localStorage.setItem('codearena_theme', currentSettings.theme);
                localStorage.setItem('codearena-theme', currentSettings.theme);
            } catch (e) {}
            // Dispatch theme change event so all components adapt
            window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: currentSettings.theme } }));
        }

        // Apply interface density
        if (currentSettings.interfaceDensity === 'compact') {
            document.documentElement.setAttribute('data-density', 'compact');
        } else {
            document.documentElement.removeAttribute('data-density');
        }

        // Apply reduced motion
        if (currentSettings.reducedMotion) {
            document.documentElement.setAttribute('data-reduced-motion', 'true');
        } else {
            document.documentElement.removeAttribute('data-reduced-motion');
        }

        // Apply compact workspace toolbar
        if (currentSettings.compactToolbar) {
            document.documentElement.setAttribute('data-compact-toolbar', 'true');
        } else {
            document.documentElement.removeAttribute('data-compact-toolbar');
        }

        // Sync default return preference
        try {
            localStorage.setItem('codearena_include_default_return', currentSettings.defaultReturnStatement ? 'true' : 'false');
        } catch (e) {}

        showToast('✓ Preferences saved successfully!');
        if (window.CodeArenaToast) {
            window.CodeArenaToast.success('Preferences saved successfully!');
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
