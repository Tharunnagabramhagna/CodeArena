// theme.js — CodeArena Theme Toggle

// Apply saved theme immediately to prevent flash
(function() {
    const saved = localStorage.getItem('codearena-theme');
    if (saved === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
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
            btn.textContent = theme === 'dark' ? '☀' : '☾';
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
            localStorage.setItem('codearena-theme', theme);
        } catch (e) {}
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
