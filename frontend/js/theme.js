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

// Progressive Mobile Navigation Drawer (active on viewports <= 768px via CSS)
(function() {
    function initMobileNavDrawer() {
        if (typeof document === 'undefined' || !document.body) return;
        // Dashboard already has its own responsive sidebar drawer
        if (document.querySelector('.dashboard-sidebar') || document.querySelector('.mobile-drawer-btn')) return;
        // Skip minimal auth pages
        if (document.querySelector('.auth-header')) return;
        if (document.getElementById('caMobileNavBtn')) return;

        const actionContainer = document.querySelector(
            '.landing-header-actions, .secondary-header-actions, .problems-header-actions, .compiler-header-actions, .workspace-header-actions, .anim-navbar-right'
        );
        if (!actionContainer) return;

        const rawPath = (window.location && window.location.pathname) ? window.location.pathname.toLowerCase() : '';
        const cleanPath = rawPath.replace(/\/+$/, '').replace(/\.html$/, '');
        const currentSlug = cleanPath === '' ? 'index' : cleanPath.split('/').pop();
        const inPagesDir = cleanPath.indexOf('/pages/') !== -1;
        const pagePrefix = inPagesDir ? '' : 'pages/';
        const homeHref = inPagesDir ? '../index.html' : 'index.html';

        const navSections = [
            {
                label: 'Core Platform',
                items: [
                    { name: 'Home', href: homeHref, slugs: ['index'] },
                    { name: 'Dashboard', href: pagePrefix + 'dashboard.html', slugs: ['dashboard'] },
                    { name: 'DSA Problems', href: pagePrefix + 'problems.html', slugs: ['problems', 'problem'] },
                    { name: 'Basic Practice', href: pagePrefix + 'basic-practice.html', slugs: ['basic-practice', 'basic-problem'] },
                    { name: 'Practice Hub', href: pagePrefix + 'practice.html', slugs: ['practice'] },
                    { name: 'Java Compiler', href: pagePrefix + 'compiler.html', slugs: ['compiler'] }
                ]
            },
            {
                label: 'Learn & Grow',
                items: [
                    { name: 'Java Learning Centre', href: pagePrefix + 'learn.html', slugs: ['learn'] },
                    { name: 'Java Roadmap', href: pagePrefix + 'roadmap.html', slugs: ['roadmap'] },
                    { name: 'AI Assistant', href: pagePrefix + 'ai_assistant.html', slugs: ['ai_assistant'] },
                    { name: 'Contests', href: pagePrefix + 'contests.html', slugs: ['contests'] }
                ]
            },
            {
                label: 'Account',
                items: [
                    { name: 'Submissions', href: pagePrefix + 'submissions.html', slugs: ['submissions'] },
                    { name: 'Bookmarks', href: pagePrefix + 'bookmarks.html', slugs: ['bookmarks'] },
                    { name: 'Progress', href: pagePrefix + 'progress.html', slugs: ['progress'] },
                    { name: 'Upgrade Pro', href: pagePrefix + 'upgrade.html', slugs: ['upgrade'] },
                    { name: 'Settings', href: pagePrefix + 'settings.html', slugs: ['settings'] }
                ]
            }
        ];

        const menuBtn = document.createElement('button');
        menuBtn.type = 'button';
        menuBtn.id = 'caMobileNavBtn';
        menuBtn.className = 'ca-mobile-nav-btn';
        menuBtn.setAttribute('aria-label', 'Open navigation menu');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-controls', 'caMobileNavDrawer');
        menuBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
        actionContainer.appendChild(menuBtn);

        const backdrop = document.createElement('div');
        backdrop.className = 'ca-mobile-nav-backdrop';
        backdrop.setAttribute('aria-hidden', 'true');

        const drawer = document.createElement('nav');
        drawer.id = 'caMobileNavDrawer';
        drawer.className = 'ca-mobile-nav-drawer';
        drawer.setAttribute('role', 'dialog');
        drawer.setAttribute('aria-modal', 'true');
        drawer.setAttribute('aria-label', 'Site navigation');
        drawer.setAttribute('aria-hidden', 'true');
        drawer.setAttribute('inert', '');
        drawer.inert = true;

        const header = document.createElement('div');
        header.className = 'ca-mobile-nav-header';

        const title = document.createElement('span');
        title.className = 'ca-mobile-nav-title';
        title.textContent = 'CodeArena Navigation';

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'ca-mobile-nav-close';
        closeBtn.setAttribute('aria-label', 'Close navigation menu');
        closeBtn.textContent = '\u2715';

        header.appendChild(title);
        header.appendChild(closeBtn);
        drawer.appendChild(header);

        const list = document.createElement('div');
        list.className = 'ca-mobile-nav-list';

        navSections.forEach(function(section) {
            const label = document.createElement('div');
            label.className = 'ca-mobile-nav-group-label';
            label.textContent = section.label;
            list.appendChild(label);

            section.items.forEach(function(item) {
                const a = document.createElement('a');
                a.href = item.href;
                a.className = 'ca-mobile-nav-link';
                a.textContent = item.name;

                const isActive = item.slugs.indexOf(currentSlug) !== -1;
                if (isActive) {
                    a.classList.add('active');
                    a.setAttribute('aria-current', 'page');
                }
                list.appendChild(a);
            });
        });

        drawer.appendChild(list);
        document.body.appendChild(backdrop);
        document.body.appendChild(drawer);

        function openDrawer() {
            drawer.inert = false;
            drawer.removeAttribute('inert');
            drawer.classList.add('open');
            backdrop.classList.add('open');
            drawer.setAttribute('aria-hidden', 'false');
            backdrop.setAttribute('aria-hidden', 'false');
            menuBtn.setAttribute('aria-expanded', 'true');
            document.body.classList.add('ca-mobile-nav-open');
            closeBtn.focus();
        }

        function closeDrawer() {
            if (!drawer.classList.contains('open')) return;
            drawer.classList.remove('open');
            backdrop.classList.remove('open');
            drawer.setAttribute('aria-hidden', 'true');
            backdrop.setAttribute('aria-hidden', 'true');
            drawer.setAttribute('inert', '');
            drawer.inert = true;
            menuBtn.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('ca-mobile-nav-open');
            menuBtn.focus();
        }

        menuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (drawer.classList.contains('open')) closeDrawer();
            else openDrawer();
        });

        closeBtn.addEventListener('click', closeDrawer);
        backdrop.addEventListener('click', closeDrawer);

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && drawer.classList.contains('open')) {
                closeDrawer();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileNavDrawer);
    } else {
        initMobileNavDrawer();
    }
})();
