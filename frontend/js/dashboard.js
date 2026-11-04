// dashboard.js — CodeArena Student Dashboard Interactions

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
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem(STORAGE_KEY, isCollapsed ? 'true' : 'false');
            }
        } catch (e) {
            // Silently handle storage limits or private browsing restrictions
        }
    }

    // Initialize sidebar state safely from localStorage (defaults to expanded on desktop)
    let savedState = null;
    try {
        savedState = (typeof window !== 'undefined' && window.localStorage)
            ? window.localStorage.getItem(STORAGE_KEY)
            : null;
    } catch (e) {
        // Fall back gracefully to expanded sidebar if storage is restricted or throws SecurityError
    }

    if (savedState === 'true') {
        setSidebarState(true);
    } else {
        setSidebarState(false);
    }
    // Remove preload class now that dynamic state is active
    document.documentElement.classList.remove('sidebar-preload-collapsed');

    // Toggle sidebar on button click or keyboard trigger
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

    // Close mobile drawer when pressing Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeMobileDrawer();
        }
    });

    // Close mobile drawer when selecting any navigation link
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
        const problemId = item.getAttribute('data-id');
        function navigate() {
            if (problemId) {
                window.location.href = `problem.html?id=${encodeURIComponent(problemId)}`;
            } else {
                window.location.href = 'problems.html';
            }
        }

        item.addEventListener('click', navigate);
        item.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate();
            }
        });
    });

    // Populate dynamic stats & upcoming activities from canonical API service
    async function loadPlatformIntelligence() {
        try {
            if (window.CodeArenaAPI && window.CodeArenaAPI.problemService) {
                // 1. Load canonical statistics without limit truncation
                if (typeof window.CodeArenaAPI.problemService.getStats === 'function') {
                    const sRes = await window.CodeArenaAPI.problemService.getStats();
                    if (sRes.success && sRes.data) {
                        const st = sRes.data;
                        const elProb = document.getElementById('dashStatProblems');
                        const elFree = document.getElementById('dashStatFree');
                        const elPrem = document.getElementById('dashStatPremium');
                        const elTopics = document.getElementById('dashStatTopics');
                        const elPatterns = document.getElementById('dashStatPatterns');
                        const elContests = document.getElementById('dashStatContests');
                        if (elProb) elProb.textContent = String(st.totalProblems);
                        if (elFree) elFree.textContent = String(st.freeProblems);
                        if (elPrem) elPrem.textContent = String(st.premiumProblems);
                        if (elTopics) elTopics.textContent = String(st.topicsCount);
                        if (elPatterns) elPatterns.textContent = String(st.patternsCount);
                        if (elContests) elContests.textContent = String(st.contestsCount);
                    }
                }

                // 2. Load and render upcoming activities
                if (typeof window.CodeArenaAPI.problemService.getUpcomingActivities === 'function') {
                    const actRes = await window.CodeArenaAPI.problemService.getUpcomingActivities();
                    if (actRes.success && Array.isArray(actRes.data)) {
                        renderUpcomingActivities(actRes.data);
                    }
                }
            }
        } catch (e) {
            console.warn('[Dashboard] Error loading platform intelligence:', e);
        }
    }

    function renderUpcomingActivities(activities) {
        const grid = document.getElementById('upcomingActivitiesGrid');
        if (!grid) return;

        grid.innerHTML = activities.map(act => {
            const catBadgeClass = act.categoryBadge ? `cat-${act.categoryBadge}` : 'cat-contest';
            return `
                <div class="activity-card">
                    <div>
                        <div class="activity-card-top">
                            <span class="activity-category-badge ${catBadgeClass}">${escapeHtml(act.category || 'Event')}</span>
                            <span class="activity-date-tag">${escapeHtml(act.date || '')}</span>
                        </div>
                        <h3 class="activity-title">${escapeHtml(act.title)}</h3>
                        <p class="activity-desc">${escapeHtml(act.description)}</p>
                    </div>
                    <div class="activity-card-footer">
                        <span class="activity-demo-tag">Sample Preview Event</span>
                        <a href="${escapeHtml(act.actionUrl || '#')}" class="activity-action-link">
                            ${escapeHtml(act.actionLabel || 'View Details')} &rarr;
                        </a>
                    </div>
                </div>
            `;
        }).join('');
    }

    function updateAuthStateUI() {
        const isAuth = Boolean(
            window.CodeArenaAPI &&
            window.CodeArenaAPI.authService &&
            window.CodeArenaAPI.authService.isAuthenticated()
        );
        const userRes = (isAuth && window.CodeArenaAPI.authService.getCurrentUser)
            ? window.CodeArenaAPI.authService.getCurrentUser()
            : null;
        const user = (userRes && userRes.data) || null;
        const isPro = Boolean(
            window.CodeArenaAPI &&
            window.CodeArenaAPI.subscriptionService &&
            window.CodeArenaAPI.subscriptionService.isPremium()
        );

        const guestAuthActions = document.getElementById('guestAuthActions');
        const userProfileArea = document.getElementById('userProfileArea');
        const userNameEl = document.getElementById('userName');
        const userRoleEl = document.getElementById('userRole');
        const userAvatarEl = document.getElementById('userAvatar');
        const promoCard = document.querySelector('.sidebar-promo-card');

        if (!isAuth) {
            // Guest preview mode
            if (guestAuthActions) guestAuthActions.style.display = 'flex';
            if (userProfileArea) userProfileArea.style.display = 'none';
            if (promoCard) {
                promoCard.innerHTML = `
                    <div class="promo-icon" aria-hidden="true">✦</div>
                    <h4 class="promo-title">Unlock your coding potential</h4>
                    <p class="promo-subtitle">Practice. Learn. Grow.</p>
                    <a href="practice.html" class="btn btn-primary promo-btn">Get Started →</a>
                `;
            }
        } else {
            // Authenticated preview mode
            if (guestAuthActions) guestAuthActions.style.display = 'none';
            if (userProfileArea) {
                userProfileArea.style.display = 'flex';
                userProfileArea.classList.remove('auth-hidden');
            }
            if (userNameEl && user) userNameEl.textContent = user.name || 'Student';
            if (userRoleEl) userRoleEl.textContent = isPro ? 'Pro Member' : 'Free Tier';
            if (userAvatarEl && user) userAvatarEl.textContent = (user.name || 'U').charAt(0).toUpperCase();

            if (promoCard) {
                if (isPro) {
                    promoCard.innerHTML = `
                        <div class="promo-icon" style="color: #facc15;" aria-hidden="true">⭐</div>
                        <h4 class="promo-title">CodeArena Pro Active</h4>
                        <p class="promo-subtitle">All 200 Challenges Unlocked</p>
                        <a href="problems.html?access=Premium" class="btn btn-primary promo-btn" style="background: linear-gradient(135deg, #f59e0b, #d97706); border: none;">Explore Pro →</a>
                    `;
                } else {
                    promoCard.innerHTML = `
                        <div class="promo-icon" style="color: #facc15;" aria-hidden="true">💎</div>
                        <h4 class="promo-title">Upgrade to Pro</h4>
                        <p class="promo-subtitle">50 Advanced DSA Challenges</p>
                        <a href="problems.html" class="btn btn-primary promo-btn" id="btnSidebarUpgrade">Upgrade for $5/mo →</a>
                    `;
                }
            }
        }
    }

    loadPlatformIntelligence();
    updateAuthStateUI();

    // --------------------------------------------------------------------------
    // 4. Future Authenticated User Profile Menu Toggle (Ready for Backend)
    // --------------------------------------------------------------------------
    const userProfileTrigger = document.getElementById('userProfileTrigger');
    const userProfileMenu = document.getElementById('userProfileMenu');
    const logoutBtn = document.getElementById('logoutBtn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            if (window.CodeArenaAPI && window.CodeArenaAPI.authService) {
                window.CodeArenaAPI.authService.logout();
                if (window.CodeArenaToast) {
                    window.CodeArenaToast.info('Logged out of preview session. Guest mode restored.');
                }
                updateAuthStateUI();
            }
        });
    }

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

    // --------------------------------------------------------------------------
    // 5. Notification Popover Interactions (Phase 6 Enhanced)
    // --------------------------------------------------------------------------
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationPopover = document.getElementById('notificationPopover');
    const notifBadge = document.getElementById('notifBadge');
    const notifHeaderTag = document.getElementById('notifHeaderTag');
    const btnMarkNotifsRead = document.getElementById('btnMarkNotifsRead');
    const notifTabBtns = document.querySelectorAll('.notif-tab-btn');
    const notifItems = document.querySelectorAll('.notif-item');

    if (notificationBtn && notificationPopover) {
        notificationBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const isVisible = notificationPopover.style.display === 'block';
            notificationPopover.style.display = isVisible ? 'none' : 'block';
            notificationBtn.setAttribute('aria-expanded', isVisible ? 'false' : 'true');
        });

        // Tab switching
        if (notifTabBtns) {
            notifTabBtns.forEach(function (tab) {
                tab.addEventListener('click', function () {
                    notifTabBtns.forEach(function (t) { t.classList.remove('active'); });
                    this.classList.add('active');
                    const category = this.getAttribute('data-tab');

                    notifItems.forEach(function (item) {
                        if (category === 'all' || item.getAttribute('data-category') === category) {
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                });
            });
        }

        // Mark all as read
        if (btnMarkNotifsRead) {
            btnMarkNotifsRead.addEventListener('click', function () {
                notifItems.forEach(function (item) {
                    item.classList.remove('unread');
                });
                if (notifBadge) notifBadge.style.display = 'none';
                if (notifHeaderTag) notifHeaderTag.textContent = '0 new (Sample)';
                if (window.CodeArenaToast) {
                    window.CodeArenaToast.info('All notifications marked as read');
                }
            });
        }

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
                notificationBtn.focus();
            }
        });
    }

    // --------------------------------------------------------------------------
    // 6. Global Search Suggestions & Keyboard Navigation (Phase 6)
    // --------------------------------------------------------------------------
    const dashSearchInput = document.getElementById('dashSearchInput');
    const dashSearchSuggestions = document.getElementById('dashSearchSuggestions');
    const searchFeedbackPopover = document.getElementById('searchFeedbackPopover');

    // Built-in Platform Pages Index
    const platformPages = [
        { title: 'Online Java Compiler', category: 'Tool', url: 'compiler.html', desc: 'In-browser Java editor, syntax runner & diagnostics', badge: 'Tool' },
        { title: 'Problem Catalogue', category: 'Practice', url: 'problems.html', desc: 'Browse all 12 canonical Java algorithm problems', badge: 'Practice' },
        { title: 'Practice Problem Hub', category: 'Practice', url: 'practice.html', desc: 'Topic-based challenge tracks and starter problems', badge: 'Practice' },
        { title: 'Java Learning Centre', category: 'Learn', url: 'learn.html', desc: '14 interactive lessons, JVM architecture & quizzes', badge: 'Learn' },
        { title: 'AI Learning Assistant', category: 'Mentor', url: 'ai_assistant.html', desc: 'Simulated AI guidance, Java concepts & explanations', badge: 'AI' },
        { title: 'Coding Contests', category: 'Competitions', url: 'contests.html', desc: 'Scheduled Java tournaments and leaderboards', badge: 'Contest' },
        { title: 'Learning Progress & Analytics', category: 'Analytics', url: 'progress.html', desc: 'Activity heatmap, solve streaks & distribution', badge: 'Progress' },
        { title: 'Bookmarked Problems', category: 'Saved', url: 'bookmarks.html', desc: 'Quickly access your saved Java challenges', badge: 'Bookmarks' },
        { title: 'My Submissions', category: 'History', url: 'submissions.html', desc: 'Inspect past code submissions and review verdicts', badge: 'History' },
        { title: 'Settings & Editor Preferences', category: 'Preferences', url: 'settings.html', desc: 'Configure theme, font size, tabs & density', badge: 'Settings' }
    ];

    if (dashSearchInput && dashSearchSuggestions) {
        let activeIndex = -1;
        let currentSuggestions = [];

        function getCanonicalProblems() {
            try {
                if (window.CodeArenaAPI && window.CodeArenaAPI.problemService) {
                    return window.CodeArenaAPI.problemService.getProblems() || [];
                }
            } catch (err) {
                console.warn('Unable to query problemService:', err);
            }
            return [];
        }

        function queryIndex(keyword) {
            const term = keyword.trim().toLowerCase();
            if (!term) return [];

            const results = [];
            const problems = getCanonicalProblems();

            // Match problems
            problems.forEach(function (p) {
                const titleMatch = (p.title || '').toLowerCase().includes(term);
                const topicMatch = (p.topic || '').toLowerCase().includes(term);
                const diffMatch = (p.difficulty || '').toLowerCase() === term;
                const descMatch = (p.description || '').toLowerCase().includes(term);

                if (titleMatch || topicMatch || diffMatch || descMatch) {
                    results.push({
                        type: 'problem',
                        title: p.title,
                        desc: `${p.topic} • ${p.difficulty}`,
                        url: `problem.html?id=${encodeURIComponent(p.id)}`,
                        badge: p.difficulty,
                        badgeClass: `search-badge-${(p.difficulty || 'easy').toLowerCase()}`
                    });
                }
            });

            // Match pages
            platformPages.forEach(function (pg) {
                const titleMatch = pg.title.toLowerCase().includes(term);
                const descMatch = pg.desc.toLowerCase().includes(term);
                const catMatch = pg.category.toLowerCase().includes(term);

                if (titleMatch || descMatch || catMatch) {
                    results.push({
                        type: 'page',
                        title: pg.title,
                        desc: pg.desc,
                        url: pg.url,
                        badge: pg.badge,
                        badgeClass: 'search-badge-page'
                    });
                }
            });

            return results.slice(0, 8); // Top 8 matches
        }

        function renderSuggestions(items, query) {
            currentSuggestions = items;
            activeIndex = -1;

            if (items.length === 0) {
                dashSearchSuggestions.innerHTML = `
                    <div class="search-empty-state">
                        <div>No matching problems or pages found for "<strong>${escapeHtml(query)}</strong>"</div>
                        <a href="problems.html" class="search-empty-link">Browse Problem Catalogue &rarr;</a>
                    </div>
                `;
                dashSearchSuggestions.style.display = 'block';
                return;
            }

            dashSearchSuggestions.innerHTML = items.map(function (item, idx) {
                return `
                    <div class="search-suggestion-item" data-index="${idx}" role="option" tabindex="-1">
                        <div class="search-suggestion-left">
                            <div class="search-suggestion-icon" aria-hidden="true">
                                ${item.type === 'problem'
                                    ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>'
                                    : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="12 8 8 12 12 16 12 8"/></svg>'}
                            </div>
                            <div class="search-suggestion-info">
                                <div class="search-suggestion-title">${escapeHtml(item.title)}</div>
                                <div class="search-suggestion-desc">${escapeHtml(item.desc)}</div>
                            </div>
                        </div>
                        <span class="search-suggestion-badge ${item.badgeClass}">${escapeHtml(item.badge)}</span>
                    </div>
                `;
            }).join('');

            dashSearchSuggestions.style.display = 'block';

            // Bind click handlers to suggestion items
            const itemEls = dashSearchSuggestions.querySelectorAll('.search-suggestion-item');
            itemEls.forEach(function (el) {
                el.addEventListener('click', function () {
                    const idx = parseInt(this.getAttribute('data-index'), 10);
                    navigateToSuggestion(idx);
                });
            });
        }

        function navigateToSuggestion(index) {
            if (index >= 0 && index < currentSuggestions.length) {
                const target = currentSuggestions[index];
                window.location.href = target.url;
            }
        }

        function updateActiveSuggestion() {
            const itemEls = dashSearchSuggestions.querySelectorAll('.search-suggestion-item');
            itemEls.forEach(function (el, idx) {
                if (idx === activeIndex) {
                    el.classList.add('active');
                    el.scrollIntoView({ block: 'nearest' });
                } else {
                    el.classList.remove('active');
                }
            });
        }

        function escapeHtml(str) {
            if (!str) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
        }

        // Input listener with debounce
        let debounceTimer = null;
        dashSearchInput.addEventListener('input', function () {
            const query = this.value.trim();
            clearTimeout(debounceTimer);
            if (!query) {
                dashSearchSuggestions.style.display = 'none';
                currentSuggestions = [];
                return;
            }

            debounceTimer = setTimeout(function () {
                const matches = queryIndex(query);
                renderSuggestions(matches, query);
            }, 120);
        });

        // Keyboard navigation
        dashSearchInput.addEventListener('keydown', function (e) {
            if (dashSearchSuggestions.style.display !== 'block') {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const q = this.value.trim();
                    if (q) {
                        window.location.href = `problems.html?search=${encodeURIComponent(q)}`;
                    }
                }
                return;
            }

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (currentSuggestions.length > 0) {
                    activeIndex = (activeIndex + 1) % currentSuggestions.length;
                    updateActiveSuggestion();
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (currentSuggestions.length > 0) {
                    activeIndex = (activeIndex - 1 + currentSuggestions.length) % currentSuggestions.length;
                    updateActiveSuggestion();
                }
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (activeIndex >= 0) {
                    navigateToSuggestion(activeIndex);
                } else {
                    const q = this.value.trim();
                    if (q) {
                        window.location.href = `problems.html?search=${encodeURIComponent(q)}`;
                    }
                }
            } else if (e.key === 'Escape') {
                dashSearchSuggestions.style.display = 'none';
            }
        });

        // Close on outside click
        document.addEventListener('click', function (e) {
            if (!dashSearchInput.contains(e.target) && !dashSearchSuggestions.contains(e.target)) {
                dashSearchSuggestions.style.display = 'none';
            }
        });
    }
});

