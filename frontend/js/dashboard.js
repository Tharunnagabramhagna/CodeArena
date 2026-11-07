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
    // 3. Problem Items Click Navigation (Two Tracks Supported)
    // --------------------------------------------------------------------------
    const problemItems = document.querySelectorAll('.problem-item');
    problemItems.forEach(function (item) {
        const problemId = item.getAttribute('data-id');
        const track = item.getAttribute('data-track');
        function navigate() {
            if (track === 'basic' && problemId) {
                window.location.href = `basic-problem.html?id=${encodeURIComponent(problemId)}`;
            } else if (problemId) {
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

                        const basicCount = (window.CodeArenaBasicData && Array.isArray(window.CodeArenaBasicData.problems))
                            ? window.CodeArenaBasicData.problems.length
                            : 50;
                        const basicCategories = (window.CodeArenaBasicData && Array.isArray(window.CodeArenaBasicData.categories))
                            ? window.CodeArenaBasicData.categories.length
                            : 13;
                        const totalAll = (st.totalProblems || 200) + basicCount;
                        const totalFree = (st.freeProblems || 150) + basicCount;
                        const totalDomains = (st.topicsCount || 12) + basicCategories;

                        if (elProb) elProb.textContent = String(totalAll);
                        if (elFree) elFree.textContent = String(totalFree);
                        if (elPrem) elPrem.textContent = String(st.premiumProblems || 50);
                        if (elTopics) elTopics.textContent = String(totalDomains);
                        if (elPatterns) elPatterns.textContent = String(st.patternsCount || 63);
                        if (elContests) elContests.textContent = String(st.contestsCount || 4);
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
                    <div class="promo-icon" aria-hidden="true">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                        </svg>
                    </div>
                    <h4 class="promo-title">Guided Java Roadmap</h4>
                    <p class="promo-subtitle">30 Milestones &middot; 250 Challenges</p>
                    <a href="roadmap.html" class="btn btn-primary promo-btn">Explore Roadmap &rarr;</a>
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
                        <div class="promo-icon" style="color: var(--color-primary, #60a5fa);" aria-hidden="true">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                        </div>
                        <h4 class="promo-title">CodeArena Pro Active</h4>
                        <p class="promo-subtitle">All 250 Challenges Unlocked</p>
                        <a href="problems.html?access=Premium" class="btn btn-primary promo-btn" style="background: linear-gradient(135deg, #2563EB, #1D4ED8); border: none;">Explore Pro &rarr;</a>
                    `;
                } else {
                    promoCard.innerHTML = `
                        <div class="promo-icon" style="color: var(--color-primary, #60a5fa);" aria-hidden="true">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                        </div>
                        <h4 class="promo-title">Upgrade to Pro</h4>
                        <p class="promo-subtitle">50 Advanced DSA Challenges</p>
                        <a href="problems.html" class="btn btn-primary promo-btn" id="btnSidebarUpgrade">Upgrade for $5/mo &rarr;</a>
                    `;
                }
            }
        }
    }

    loadPlatformIntelligence();
    updateAuthStateUI();

    document.addEventListener('codearena:auth-changed', function () {
        updateAuthStateUI();
    });

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
        { title: 'Online Java Compiler', category: 'Tool', url: 'compiler.html', desc: 'In-browser OpenJDK 17 editor, runner & diagnostics', badge: 'Tool' },
        { title: 'Practice Problem Hub', category: 'Practice', url: 'practice.html', desc: 'Two practice tracks: Basic Java & Advanced DSA', badge: 'Practice' },
        { title: 'Basic Java Problems Track', category: 'Practice', url: 'basic-practice.html', desc: '50 beginner challenges across 13 core Java pillars', badge: 'Basic' },
        { title: 'Problem Catalogue (DSA)', category: 'Practice', url: 'problems.html', desc: 'Browse 200 canonical Java algorithmic problems', badge: 'DSA' },
        { title: 'Guided Java Roadmap', category: 'Roadmap', url: 'roadmap.html', desc: '30 milestones with prerequisite DAG & progress tracking', badge: 'Roadmap' },
        { title: 'Interactive Algorithm Visualizer', category: 'Visualizer', url: 'solution-animation.html?id=two-sum', desc: 'Step-by-step visual animation for 200 DSA problems', badge: 'Visualizer' },
        { title: 'Java Mastery Studio', category: 'Learn', url: 'learn.html', desc: '14 interactive lessons, JVM architecture & visualizers', badge: 'Learn' },
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
        let cachedDSAProblems = [];

        async function prefetchDSAProblems() {
            try {
                if (window.CodeArenaAPI && window.CodeArenaAPI.problemService) {
                    const res = await window.CodeArenaAPI.problemService.getProblems({ limit: 200 });
                    // canonical fallback check: window.CodeArenaAPI.problemService.getProblems()
                    if (res && res.success && res.data) {
                        if (Array.isArray(res.data.problems)) {
                            cachedDSAProblems = res.data.problems;
                        } else if (Array.isArray(res.data)) {
                            cachedDSAProblems = res.data;
                        }
                    }
                }
            } catch (err) {
                console.warn('Unable to prefetch problemService problems:', err);
            }
        }
        prefetchDSAProblems();

        function getCanonicalProblems() {
            return cachedDSAProblems;
        }

        function queryIndex(keyword) {
            const term = keyword.trim().toLowerCase();
            if (!term) return [];

            const results = [];

            // 1. Match Basic Java problems if loaded
            if (window.CodeArenaBasicData && Array.isArray(window.CodeArenaBasicData.problems)) {
                window.CodeArenaBasicData.problems.forEach(function (bp) {
                    const titleMatch = (bp.title || '').toLowerCase().includes(term);
                    const catMatch = (bp.categoryTitle || '').toLowerCase().includes(term);
                    const descMatch = (bp.description || '').toLowerCase().includes(term);
                    if (titleMatch || catMatch || descMatch) {
                        results.push({
                            type: 'basic',
                            title: bp.title,
                            desc: `Basic Java · ${bp.categoryTitle || 'Fundamentals'}`,
                            url: `basic-problem.html?id=${encodeURIComponent(bp.id)}`,
                            badge: 'Basic',
                            badgeClass: 'search-badge-basic'
                        });
                    }
                });
            }

            // 2. Match DSA problems
            const problems = getCanonicalProblems();
            problems.forEach(function (p) {
                const titleMatch = (p.title || '').toLowerCase().includes(term);
                const topicMatch = (p.topic || '').toLowerCase().includes(term);
                const diffMatch = (p.difficulty || '').toLowerCase() === term;
                const descMatch = (p.description || '').toLowerCase().includes(term);

                if (titleMatch || topicMatch || diffMatch || descMatch) {
                    results.push({
                        type: 'problem',
                        title: p.title,
                        desc: `DSA · ${p.topic} · ${p.difficulty}`,
                        url: `problem.html?id=${encodeURIComponent(p.id)}`,
                        badge: p.difficulty,
                        badgeClass: `search-badge-${(p.difficulty || 'easy').toLowerCase()}`
                    });
                }
            });

            // 3. Match Roadmap topics if loaded
            if (window.CodeArenaRoadmapData && Array.isArray(window.CodeArenaRoadmapData.topics)) {
                window.CodeArenaRoadmapData.topics.forEach(function (tp) {
                    const titleMatch = (tp.title || '').toLowerCase().includes(term);
                    const descMatch = (tp.description || '').toLowerCase().includes(term);
                    if (titleMatch || descMatch) {
                        results.push({
                            type: 'roadmap',
                            title: tp.title,
                            desc: `Milestone #${tp.id} · Level ${tp.level}`,
                            url: `roadmap.html?topic=${encodeURIComponent(tp.id)}`,
                            badge: 'Roadmap',
                            badgeClass: 'search-badge-roadmap'
                        });
                    }
                });
            }

            // 4. Match pages
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
                        <a href="practice.html" class="search-empty-link">Browse Practice Hub &rarr;</a>
                    </div>
                `;
                dashSearchSuggestions.style.display = 'block';
                return;
            }

            dashSearchSuggestions.innerHTML = items.map(function (item, idx) {
                let iconSvg = '';
                if (item.type === 'roadmap') {
                    iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>';
                } else if (item.type === 'basic' || item.type === 'problem') {
                    iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>';
                } else {
                    iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="12 8 8 12 12 16 12 8"/></svg>';
                }

                return `
                    <div class="search-suggestion-item" data-index="${idx}" role="option" tabindex="-1">
                        <div class="search-suggestion-left">
                            <div class="search-suggestion-icon" aria-hidden="true">
                                ${iconSvg}
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

