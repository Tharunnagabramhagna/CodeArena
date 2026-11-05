// dashboard.js — CodeArena Student Dashboard Interactions
// Person 4 (Kavya): Integrated authenticated session checks, profile binding, and logout.

document.addEventListener('DOMContentLoaded', function () {
    const dashboardLayout = document.getElementById('dashboardLayout');
    const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
    const mobileDrawerBtn = document.getElementById('mobileDrawerBtn');
    const dashboardSidebar = document.getElementById('dashboardSidebar');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');

    // --------------------------------------------------------------------------
    // 1. Sidebar Collapse / Expand Persistence & Toggle
    // --------------------------------------------------------------------------
    const STORAGE_KEY = 'codearena-sidebar-collapsed';

    function setSidebarState(isCollapsed) {
        if (!dashboardLayout || !sidebarToggleBtn) return;

        if (isCollapsed) {
            dashboardLayout.classList.add('sidebar-collapsed');
            sidebarToggleBtn.setAttribute('aria-expanded', 'false');
            sidebarToggleBtn.setAttribute('aria-label', 'Expand sidebar');
            sidebarToggleBtn.title = 'Expand sidebar';
        } else {
            dashboardLayout.classList.remove('sidebar-collapsed');
            sidebarToggleBtn.setAttribute('aria-expanded', 'true');
            sidebarToggleBtn.setAttribute('aria-label', 'Collapse sidebar');
            sidebarToggleBtn.title = 'Collapse sidebar';
        }

        try {
            localStorage.setItem(STORAGE_KEY, isCollapsed ? 'true' : 'false');
        } catch (e) {
        }
    }

    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState === 'true') {
        setSidebarState(true);
    } else {
        setSidebarState(false);
    }
    document.documentElement.classList.remove('sidebar-preload-collapsed');

    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const currentlyCollapsed = dashboardLayout.classList.contains('sidebar-collapsed');
            setSidebarState(!currentlyCollapsed);
        });

        sidebarToggleBtn.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                const currentlyCollapsed = dashboardLayout.classList.contains('sidebar-collapsed');
                setSidebarState(!currentlyCollapsed);
            }
        });
    }

    // --------------------------------------------------------------------------
    // 2. Mobile Drawer Navigation
    // --------------------------------------------------------------------------
    function openMobileDrawer() {
        if (!dashboardSidebar || !sidebarBackdrop) return;
        dashboardSidebar.classList.add('mobile-open');
        sidebarBackdrop.classList.add('active');
        if (mobileDrawerBtn) {
            mobileDrawerBtn.setAttribute('aria-expanded', 'true');
        }
    }

    function closeMobileDrawer() {
        if (!dashboardSidebar || !sidebarBackdrop) return;
        dashboardSidebar.classList.remove('mobile-open');
        sidebarBackdrop.classList.remove('active');
        if (mobileDrawerBtn) {
            mobileDrawerBtn.setAttribute('aria-expanded', 'false');
        }
    }

    if (mobileDrawerBtn) {
        mobileDrawerBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (dashboardSidebar.classList.contains('mobile-open')) {
                closeMobileDrawer();
            } else {
                openMobileDrawer();
            }
        });
    }

    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', closeMobileDrawer);
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeMobileDrawer();
        }
    });

    if (dashboardSidebar) {
        const sidebarLinks = dashboardSidebar.querySelectorAll('.sidebar-link');
        sidebarLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                if (window.innerWidth <= 768) {
                    closeMobileDrawer();
                }
            });
        });
    }

    // --------------------------------------------------------------------------
    // 3. Problem Items Click Navigation
    // --------------------------------------------------------------------------
    const problemItems = document.querySelectorAll('.problem-item');
    problemItems.forEach(function (item) {
        function navigate() {
            window.location.href = 'problems.html';
        }

        item.addEventListener('click', navigate);
        item.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate();
            }
        });
    });

    // --------------------------------------------------------------------------
    // 4. Authenticated User Profile Menu Toggle & Live Session Sync
    // --------------------------------------------------------------------------
    const userProfileTrigger = document.getElementById('userProfileTrigger');
    const userProfileMenu = document.getElementById('userProfileMenu');
    const userProfileArea = document.getElementById('userProfileArea');
    const guestAuthActions = document.getElementById('guestAuthActions');
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    const userRole = document.getElementById('userRole');
    const logoutBtn = document.getElementById('logoutBtn');

    if (userProfileTrigger && userProfileMenu) {
        userProfileTrigger.addEventListener('click', function (e) {
            e.stopPropagation();
            const isOpen = userProfileMenu.classList.contains('menu-open');
            userProfileMenu.classList.toggle('menu-open', !isOpen);
            userProfileTrigger.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
        });

        document.addEventListener('click', function (e) {
            if (!userProfileTrigger.contains(e.target) && !userProfileMenu.contains(e.target)) {
                userProfileMenu.classList.remove('menu-open');
                userProfileTrigger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Check backend session for current user
    async function syncSession() {
        if (!window.CodeArenaAPI || !window.CodeArenaAPI.authService) return;

        try {
            const res = await window.CodeArenaAPI.authService.getCurrentUser();
            if (res.success && res.data) {
                const user = res.data;
                if (guestAuthActions) guestAuthActions.style.display = 'none';
                if (userProfileArea) {
                    userProfileArea.style.display = 'flex';
                    userProfileArea.classList.remove('auth-hidden');
                    userProfileArea.setAttribute('aria-hidden', 'false');
                }
                if (userName) userName.textContent = user.fullName || 'Student';
                if (userRole) userRole.textContent = user.role || 'Student';
                if (userAvatar) userAvatar.textContent = (user.fullName ? user.fullName.charAt(0) : 'U').toUpperCase();

                // Update welcome heading if present
                const welcomeName = document.querySelector('.welcome-banner h2');
                if (welcomeName && user.fullName) {
                    welcomeName.textContent = `Welcome back, ${user.fullName.split(' ')[0]}!`;
                }
            }
        } catch (err) {
            // Keep guest actions visible
        }
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function () {
            if (window.CodeArenaAPI && window.CodeArenaAPI.authService) {
                await window.CodeArenaAPI.authService.logout();
                window.location.reload();
            }
        });
    }

    syncSession();

    // --------------------------------------------------------------------------
    // 5. Notification Popover Toggle
    // --------------------------------------------------------------------------
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationPopover = document.getElementById('notificationPopover');

    if (notificationBtn && notificationPopover) {
        notificationBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const isVisible = notificationPopover.style.display === 'block';
            notificationPopover.style.display = isVisible ? 'none' : 'block';
            notificationBtn.setAttribute('aria-expanded', isVisible ? 'false' : 'true');
        });

        document.addEventListener('click', function (e) {
            if (!notificationBtn.contains(e.target) && !notificationPopover.contains(e.target)) {
                notificationPopover.style.display = 'none';
                notificationBtn.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && notificationPopover.style.display === 'block') {
                notificationPopover.style.display = 'none';
                notificationBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --------------------------------------------------------------------------
    // 6. Search Input Feedback
    // --------------------------------------------------------------------------
    const dashSearchInput = document.getElementById('dashSearchInput');
    const searchFeedbackPopover = document.getElementById('searchFeedbackPopover');

    if (dashSearchInput && searchFeedbackPopover) {
        let searchTimer = null;

        function showSearchNotice() {
            searchFeedbackPopover.style.display = 'block';
            clearTimeout(searchTimer);
            searchTimer = setTimeout(function () {
                searchFeedbackPopover.style.display = 'none';
            }, 4000);
        }

        dashSearchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                showSearchNotice();
            }
        });

        document.addEventListener('click', function (e) {
            if (!dashSearchInput.contains(e.target) && !searchFeedbackPopover.contains(e.target)) {
                searchFeedbackPopover.style.display = 'none';
            }
        });
    }
});
