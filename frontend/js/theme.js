// theme.js — CodeArena Theme Toggle & Preferences Loader

// Apply saved theme and display preferences immediately to prevent flash (safely guarded against storage exceptions)
(function() {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            const saved = window.localStorage.getItem('codearena-theme');
            if (saved === 'light') {
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

document.addEventListener('DOMContentLoaded', function() {
    const toggleBtns = document.querySelectorAll('.theme-toggle');
    if (!toggleBtns || toggleBtns.length === 0) return;

    function getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    }

    function updateToggleButtons(theme) {
        toggleBtns.forEach(function(btn) {
            btn.textContent = theme === 'dark' ? '☀️' : '🌙';
            btn.setAttribute('aria-label',
                theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
            );
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
                // Also synchronize with user settings if present
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

    // Initialize button state
    updateToggleButtons(getCurrentTheme());

    // Toggle on click
    toggleBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const current = getCurrentTheme();
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    });
});
