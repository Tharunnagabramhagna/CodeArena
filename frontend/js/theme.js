// theme.js — CodeArena Theme Toggle & Preferences Loader

// Apply saved theme and display preferences immediately to prevent flash (safely guarded against storage exceptions)
(function() {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            const saved = window.localStorage.getItem('codearena-theme');
            const urlParams = (typeof window !== 'undefined' && window.location) ? new URLSearchParams(window.location.search) : null;
            if ((urlParams && urlParams.get('theme') === 'light') || saved === 'light') {
                document.documentElement.setAttribute('data-theme', 'light');
            }
            const settingsRaw = window.localStorage.getItem('codearena_user_settings');
            if (settingsRaw) {
                const settings = JSON.parse(settingsRaw);
                if (settings.interfaceDensity === 'compact') {
                    document.documentElement.setAttribute('data-density', 'compact');
                }
                if (settings.reducedMotion === true) {
                    document.documentElement.setAttribute('data-reduced-motion', 'true');
                }
                if (settings.compactToolbar === true) {
                    document.documentElement.setAttribute('data-compact-toolbar', 'true');
                }
            }
        }
    } catch (e) {
        // Fall back gracefully to default dark theme if storage is disabled or throws SecurityError
    }
})();

(function() {
    const SUN_SVG = '<svg class="theme-icon theme-icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>';
    const MOON_SVG = '<svg class="theme-icon theme-icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';

    function getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    }

    function updateToggleButtons(theme) {
        const toggleBtns = document.querySelectorAll('.theme-toggle');
        if (!toggleBtns || toggleBtns.length === 0) return;
        toggleBtns.forEach(function(btn) {
            btn.innerHTML = theme === 'dark' ? SUN_SVG : MOON_SVG;
            const label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
            btn.setAttribute('aria-label', label);
            btn.setAttribute('title', label);
            btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
        });
    }

    function setTheme(theme) {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem('codearena-theme', theme);
                const settingsRaw = window.localStorage.getItem('codearena_user_settings');
                let settings = settingsRaw ? JSON.parse(settingsRaw) : {};
                settings.theme = theme;
                window.localStorage.setItem('codearena_user_settings', JSON.stringify(settings));
            }
        } catch (e) {
            // Silently fallback if storage is restricted or quotas exceeded
        }
        updateToggleButtons(theme);
    }

    function initTheme() {
        const toggleBtns = document.querySelectorAll('.theme-toggle');
        if (!toggleBtns || toggleBtns.length === 0) return;

        // Initialize button state immediately
        updateToggleButtons(getCurrentTheme());

        // Attach click handlers without duplicates
        toggleBtns.forEach(function(btn) {
            if (btn._themeListenerAttached) return;
            btn._themeListenerAttached = true;
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const current = getCurrentTheme();
                setTheme(current === 'dark' ? 'light' : 'dark');
            });
        });
    }

    // Expose toggleTheme globally for programmatic control
    window.CodeArenaTheme = {
        getTheme: getCurrentTheme,
        setTheme: setTheme,
        toggle: function() {
            setTheme(getCurrentTheme() === 'dark' ? 'light' : 'dark');
        },
        init: initTheme
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
})();
