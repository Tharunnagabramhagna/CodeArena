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

                        const totalAll = st.totalProblems !== undefined ? st.totalProblems : ((st.dsaProblems || 200) + (st.basicProblems || 50));
                        const premCount = st.premiumProblems !== undefined ? st.premiumProblems : 50;
                        const freeCount = st.freeProblems !== undefined ? st.freeProblems : Math.max(0, totalAll - premCount);

                        if (elProb) elProb.textContent = String(totalAll);
                        if (elFree) elFree.textContent = String(freeCount);
                        if (elPrem) elPrem.textContent = String(premCount);
                        if (elTopics) elTopics.textContent = String(st.topicsCount || 25);
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
                        <span class="activity-demo-tag">${escapeHtml(act.status || 'Scheduled')}</span>
                        <a href="${escapeHtml(act.actionUrl || '#')}" class="activity-action-link">
                            ${escapeHtml(act.actionLabel || 'View Details')} &rarr;
                        </a>
                    </div>
                </div>
            `;
        }).join('');
    }

    async function updateAuthStateUI() {
        const isAuth = Boolean(
            window.CodeArenaAPI &&
            window.CodeArenaAPI.authService &&
            window.CodeArenaAPI.authService.isAuthenticated()
        );
        let userRes = null;
        if (isAuth && window.CodeArenaAPI && window.CodeArenaAPI.authService) {
            userRes = window.CodeArenaAPI.authService.getCurrentUserSync
                ? window.CodeArenaAPI.authService.getCurrentUserSync()
                : (window.CodeArenaAPI.authService.getCurrentUser ? window.CodeArenaAPI.authService.getCurrentUser() : null);
        }

        const guestAuthActions = document.getElementById('guestAuthActions');
        const userProfileArea = document.getElementById('userProfileArea');
        const userNameEl = document.getElementById('userName');
        const userRoleEl = document.getElementById('userRole');
        const userAvatarEl = document.getElementById('userAvatar');
        const menuUserNameEl = document.getElementById('menuUserName');
        const menuUserEmailEl = document.getElementById('menuUserEmail');
        const menuUserTierEl = document.getElementById('menuUserTier');
        const menuUserExpiryEl = document.getElementById('menuUserExpiry');
        const menuUpgradeTextEl = document.getElementById('menuUpgradeText');
        const promoCard = document.querySelector('.sidebar-promo-card');
        const bannerContainer = document.getElementById('dashSubscriptionBannerContainer');

        if (!isAuth) {
            // Guest mode
            if (guestAuthActions) guestAuthActions.style.display = 'flex';
            if (userProfileArea) {
                userProfileArea.style.display = 'none';
                userProfileArea.classList.add('auth-hidden');
                userProfileArea.setAttribute('aria-hidden', 'true');
            }
            if (bannerContainer) bannerContainer.innerHTML = '';
            const userProfileMenu = document.getElementById('userProfileMenu');
            if (userProfileMenu) userProfileMenu.classList.remove('menu-open');
            const userProfileTrigger = document.getElementById('userProfileTrigger');
            if (userProfileTrigger) userProfileTrigger.setAttribute('aria-expanded', 'false');

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
            return;
        }

        // Authenticated mode
        if (guestAuthActions) guestAuthActions.style.display = 'none';
        if (userProfileArea) {
            userProfileArea.style.display = 'flex';
            userProfileArea.classList.remove('auth-hidden');
            userProfileArea.setAttribute('aria-hidden', 'false');
        }

        let userData = null;
        if (userRes && typeof userRes.then === 'function') {
            const r = await userRes.catch(() => null);
            userData = r && r.data ? r.data : r;
        } else if (userRes && userRes.data) {
            userData = userRes.data;
        } else if (userRes) {
            userData = userRes;
        }

        if (!userData && window.CodeArenaAPI && window.CodeArenaAPI.authService) {
            const r = await window.CodeArenaAPI.authService.getCurrentUser().catch(() => null);
            userData = r && r.data ? r.data : r;
        }

        if (!userData) return;

        const displayName = userData.name || userData.fullName || userData.username || (userData.email ? userData.email.split('@')[0] : 'Student');
        const displayEmail = userData.email || 'student@codearena.dev';
        const initial = displayName.charAt(0).toUpperCase() || 'U';

        if (userNameEl) userNameEl.textContent = displayName;
        if (userAvatarEl) userAvatarEl.textContent = initial;
        if (menuUserNameEl) menuUserNameEl.textContent = displayName;
        if (menuUserEmailEl) menuUserEmailEl.textContent = displayEmail;

        const isAdmin = userData.role === 'ADMIN' || userData.role_id === 3 || userData.roleId === 3;
        const adminPaymentsLink = document.getElementById('sidebarAdminPayments');
        if (adminPaymentsLink) {
            adminPaymentsLink.style.display = isAdmin ? 'block' : 'none';
        }

        // Fetch authoritative live subscription and order records from backend database
        let subData = null;
        let orders = [];
        try {
            if (window.CodeArenaAPI && window.CodeArenaAPI.paymentService) {
                const [subRes, ordersRes] = await Promise.allSettled([
                    window.CodeArenaAPI.paymentService.getSubscription(),
                    window.CodeArenaAPI.paymentService.getMyOrders()
                ]);
                if (subRes.status === 'fulfilled' && subRes.value && subRes.value.success && subRes.value.data) {
                    subData = subRes.value.data;
                }
                if (ordersRes.status === 'fulfilled' && ordersRes.value && ordersRes.value.success && Array.isArray(ordersRes.value.data)) {
                    orders = ordersRes.value.data;
                }
            }
        } catch (e) {
            console.warn('[Dashboard] Error querying payment subscription data:', e);
        }

        const isPro = Boolean(subData && subData.hasActiveSubscription) ||
                      Boolean(userData.isPro) ||
                      (userData.plan && userData.plan !== 'free');

        const currentPlan = (subData && subData.plan) || userData.plan || 'free';
        const isAnnual = currentPlan === 'annual';
        const planDisplayName = isAnnual ? 'Annual Pro' : 'Monthly Pro';
        const tierText = isPro ? `Pro Member (${isAnnual ? 'Annual' : 'Monthly'})` : 'Free Tier';

        if (userRoleEl) userRoleEl.textContent = tierText;
        if (menuUserTierEl) menuUserTierEl.textContent = tierText;

        // Subscription Expiry
        let expiryFormatted = '';
        const rawEndDate = (subData && subData.endDate) || userData.subscriptionEndDate;
        if (rawEndDate) {
            try {
                const d = new Date(rawEndDate);
                if (!isNaN(d.getTime())) {
                    expiryFormatted = d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
                }
            } catch (ignored) {}
        }

        if (menuUserExpiryEl) {
            if (isPro && expiryFormatted) {
                menuUserExpiryEl.textContent = 'Active until ' + expiryFormatted;
                menuUserExpiryEl.style.display = 'block';
            } else {
                menuUserExpiryEl.style.display = 'none';
                menuUserExpiryEl.textContent = '';
            }
        }

        if (menuUpgradeTextEl) {
            menuUpgradeTextEl.textContent = isPro ? 'Manage Subscription' : 'Upgrade to Pro';
        }

        // Sidebar promo card
        if (promoCard) {
            if (isPro) {
                promoCard.innerHTML = `
                    <div class="promo-icon" style="color: var(--color-primary, #60a5fa);" aria-hidden="true">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                    </div>
                    <h4 class="promo-title">CodeArena Pro Active</h4>
                    <p class="promo-subtitle">${planDisplayName} &middot; All 250 Challenges</p>
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
                    <a href="upgrade.html" class="btn btn-primary promo-btn" id="btnSidebarUpgrade">Upgrade for $5/mo &rarr;</a>
                `;
            }
        }

        // Dashboard Subscription Banner Container
        if (bannerContainer) {
            if (isPro) {
                bannerContainer.innerHTML = `
                    <div class="dash-subscription-banner" style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 10px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(16, 185, 129, 0.2); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0;">⭐</div>
                            <div>
                                <h3 style="margin: 0; font-size: 0.95rem; font-weight: 700; color: #10b981;">CodeArena Pro Active (${escapeHtml(planDisplayName)})</h3>
                                <p style="margin: 3px 0 0; font-size: 0.8rem; color: var(--color-text-secondary);">Your subscription is active and verified server-side${expiryFormatted ? ' &bull; Active until ' + escapeHtml(expiryFormatted) : ''}. All 50 curated Pro challenges and progressive hints are unlocked.</p>
                            </div>
                        </div>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <a href="upgrade.html" class="btn btn-sm btn-secondary" style="font-size: 0.78rem; padding: 6px 12px; text-decoration: none;">Billing Details</a>
                            <a href="problems.html" class="btn btn-sm btn-primary" style="background: linear-gradient(135deg, #10b981, #059669); border: none; font-size: 0.78rem; padding: 6px 14px; text-decoration: none;">Solve Pro Challenges &rarr;</a>
                        </div>
                    </div>
                `;
            } else {
                const pendingOrder = orders.find(o => o.status === 'PENDING_VERIFICATION');
                const latestOrder = orders.length > 0 ? orders[0] : null;
                const isLatestRejected = latestOrder && latestOrder.status === 'REJECTED';

                if (pendingOrder) {
                    bannerContainer.innerHTML = `
                        <div class="dash-subscription-banner" style="background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 10px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(245, 158, 11, 0.2); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0;">⏳</div>
                                <div>
                                    <h3 style="margin: 0; font-size: 0.95rem; font-weight: 700; color: #f59e0b;">Payment Verification in Progress</h3>
                                    <p style="margin: 3px 0 0; font-size: 0.8rem; color: var(--color-text-secondary);">Order <strong>${escapeHtml(pendingOrder.orderReference)}</strong> (Submitted UTR: <code>${escapeHtml(pendingOrder.utrNumber || 'Submitted')}</code>) is awaiting manual administrator verification. Pro access activates immediately upon approval.</p>
                                </div>
                            </div>
                            <a href="upgrade.html" class="btn btn-sm btn-secondary" style="font-size: 0.78rem; padding: 6px 12px; text-decoration: none;">Check Verification Status &rarr;</a>
                        </div>
                    `;
                } else if (isLatestRejected) {
                    const rejReason = latestOrder.adminNotes || latestOrder.rejectionReason || 'Transaction could not be verified in bank records';
                    bannerContainer.innerHTML = `
                        <div class="dash-subscription-banner" style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.35); border-radius: 10px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(239, 68, 68, 0.2); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; color: #ef4444;">✕</div>
                                <div>
                                    <h3 style="margin: 0; font-size: 0.95rem; font-weight: 700; color: #ef4444;">Payment Verification Unsuccessful</h3>
                                    <p style="margin: 3px 0 0; font-size: 0.8rem; color: var(--color-text-secondary);">Order <strong>${escapeHtml(latestOrder.orderReference)}</strong> (UTR: <code>${escapeHtml(latestOrder.utrNumber || 'N/A')}</code>) was rejected. Administrator Reason: <strong style="color: #ef4444;">${escapeHtml(rejReason)}</strong></p>
                                </div>
                            </div>
                            <a href="upgrade.html" class="btn btn-sm btn-danger" style="font-size: 0.78rem; padding: 6px 12px; text-decoration: none;">Review &amp; Retry &rarr;</a>
                        </div>
                    `;
                } else {
                    bannerContainer.innerHTML = '';
                }
            }
        }
    }

    async function loadRecentActivityPanel() {
        const container = document.getElementById('dashRecentActivityBody');
        if (!container || !window.CodeArenaAPI || !window.CodeArenaAPI.authService) return;
        const isAuth = window.CodeArenaAPI.authService.isAuthenticated();
        if (!isAuth || !window.CodeArenaAPI.studentService) return;
        try {
            const res = await window.CodeArenaAPI.studentService.getAnalytics();
            if (res && res.success && res.data && Array.isArray(res.data.recentActivity) && res.data.recentActivity.length > 0) {
                container.innerHTML = res.data.recentActivity.slice(0, 5).map(item => {
                    const verdict = String(item.verdict || item.status || 'PENDING').toUpperCase();
                    const isAccepted = verdict === 'ACCEPTED';
                    const href = item.track === 'basic'
                        ? `basic-problem.html?id=${encodeURIComponent(item.problemSlug || item.problemId)}`
                        : `problem.html?id=${encodeURIComponent(item.problemSlug || item.problemId)}`;
                    const timeStr = item.submittedAt ? new Date(item.submittedAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent';
                    return `
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 4px; border-bottom: 1px solid var(--color-border); font-size: 0.84rem;">
                            <div>
                                <a href="${href}" style="color: var(--color-text-primary); font-weight: 600; text-decoration: none;">
                                    ${escapeHtml(item.problemTitle || ('Problem #' + item.problemId))}
                                </a>
                                <div style="font-size: 0.74rem; color: var(--color-text-muted); margin-top: 2px;">
                                    ${escapeHtml(timeStr)}${item.executionTimeMs ? ` · ${item.executionTimeMs} ms` : ''}
                                </div>
                            </div>
                            <span class="diff-badge ${isAccepted ? 'diff-easy' : 'diff-hard'}" style="font-size: 0.7rem;">
                                ${escapeHtml(verdict.replace(/_/g, ' '))}
                            </span>
                        </div>
                    `;
                }).join('');
            }
        } catch (e) { }
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    async function initAuthAndActivity() {
        if (window.CodeArenaAPI && window.CodeArenaAPI.authService && typeof window.CodeArenaAPI.authService.getCurrentUser === 'function') {
            await window.CodeArenaAPI.authService.getCurrentUser().catch(() => null);
        }
        await updateAuthStateUI();
        await loadRecentActivityPanel();
    }

    loadPlatformIntelligence();
    initAuthAndActivity();

    document.addEventListener('codearena:auth-changed', function () {
        updateAuthStateUI();
        loadRecentActivityPanel();
    });

    // --------------------------------------------------------------------------
    // 4. Authenticated User Profile Menu & Logout Controller
    // --------------------------------------------------------------------------
    const userProfileTrigger = document.getElementById('userProfileTrigger');
    const userProfileMenu = document.getElementById('userProfileMenu');
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutModalOverlay = document.getElementById('logoutModalOverlay');
    const btnCancelLogout = document.getElementById('btnCancelLogout');
    const btnConfirmLogout = document.getElementById('btnConfirmLogout');

    function closeUserProfileMenu() {
        if (userProfileMenu) userProfileMenu.classList.remove('menu-open');
        if (userProfileTrigger) userProfileTrigger.setAttribute('aria-expanded', 'false');
    }

    function openLogoutModal() {
        closeUserProfileMenu();
        if (logoutModalOverlay) {
            logoutModalOverlay.style.display = 'flex';
            if (btnCancelLogout) btnCancelLogout.focus();
        }
    }

    function closeLogoutModal() {
        if (logoutModalOverlay) {
            logoutModalOverlay.style.display = 'none';
        }
        if (userProfileTrigger) userProfileTrigger.focus();
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            openLogoutModal();
        });
    }

    if (btnCancelLogout) {
        btnCancelLogout.addEventListener('click', function () {
            closeLogoutModal();
        });
    }

    if (btnConfirmLogout) {
        btnConfirmLogout.addEventListener('click', async function () {
            btnConfirmLogout.disabled = true;
            btnConfirmLogout.textContent = 'Logging out...';
            try {
                if (window.CodeArenaAPI && window.CodeArenaAPI.authService) {
                    const res = await window.CodeArenaAPI.authService.logout();
                    if (res && res.success !== false) {
                        closeLogoutModal();
                        document.dispatchEvent(new CustomEvent('codearena:auth-changed', {
                            detail: { user: null, action: 'logout' }
                        }));
                        updateAuthStateUI();
                        if (window.CodeArenaToast) {
                            window.CodeArenaToast.info('Logged out successfully. Returned to guest mode.');
                        }
                    } else {
                        if (window.CodeArenaToast) {
                            window.CodeArenaToast.error(res.message || 'Logout failed on server.');
                        }
                    }
                }
            } catch (err) {
                if (window.CodeArenaToast) {
                    window.CodeArenaToast.error('An error occurred during logout.');
                }
            } finally {
                btnConfirmLogout.disabled = false;
                btnConfirmLogout.textContent = 'Log Out';
            }
        });
    }

    if (logoutModalOverlay) {
        logoutModalOverlay.addEventListener('click', function (e) {
            if (e.target === logoutModalOverlay) {
                closeLogoutModal();
            }
        });
    }

    if (userProfileTrigger && userProfileMenu) {
        userProfileTrigger.addEventListener('click', function (e) {
            e.stopPropagation();
            const isOpen = userProfileMenu.classList.contains('menu-open');
            userProfileMenu.classList.toggle('menu-open', !isOpen);
            userProfileTrigger.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
            if (!isOpen) {
                const firstItem = userProfileMenu.querySelector('.menu-item');
                if (firstItem) firstItem.focus();
            }
        });

        // Close on clicking outside
        document.addEventListener('click', function (e) {
            if (!userProfileTrigger.contains(e.target) && !userProfileMenu.contains(e.target)) {
                closeUserProfileMenu();
            }
        });

        // Keyboard navigation and Escape dismissal
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                if (logoutModalOverlay && logoutModalOverlay.style.display === 'flex') {
                    closeLogoutModal();
                    return;
                }
                if (userProfileMenu.classList.contains('menu-open')) {
                    closeUserProfileMenu();
                    userProfileTrigger.focus();
                }
            }
        });

        userProfileMenu.addEventListener('keydown', function (e) {
            const items = Array.from(userProfileMenu.querySelectorAll('.menu-item'));
            if (!items.length) return;
            const currentIndex = items.indexOf(document.activeElement);

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % items.length;
                items[nextIndex].focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + items.length) % items.length;
                items[prevIndex].focus();
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
                if (notifHeaderTag) notifHeaderTag.textContent = '0 unread';
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
        { title: 'AI Learning Assistant', category: 'Mentor', url: 'ai_assistant.html', desc: 'Java coding mentor, concept explanations & debugging help', badge: 'AI' },
        { title: 'Coding Contests', category: 'Competitions', url: 'contests.html', desc: 'Scheduled Java tournaments and leaderboards', badge: 'Contest' },
        { title: 'Learning Progress & Analytics', category: 'Analytics', url: 'progress.html', desc: 'Activity heatmap, solve streaks & distribution', badge: 'Progress' },
        { title: 'Bookmarked Problems', category: 'Saved', url: 'bookmarks.html', desc: 'Quickly access your saved Java challenges', badge: 'Bookmarks' },
        { title: 'My Submissions', category: 'History', url: 'submissions.html', desc: 'Inspect past code submissions and review verdicts', badge: 'History' },
        { title: 'Settings & Editor Preferences', category: 'Preferences', url: 'settings.html', desc: 'Configure theme, font size, tabs & density', badge: 'Settings' }
    ];

    if (dashSearchInput && dashSearchSuggestions) {
        let activeIndex = -1;
        let currentSuggestions = [];
        let cachedProblems = [];
        let cachedRoadmapTopics = [];

        async function prefetchSearchIndex() {
            try {
                if (window.CodeArenaAPI && window.CodeArenaAPI.problemService) {
                    // window.CodeArenaAPI.problemService.getProblems()
                    const res = await window.CodeArenaAPI.problemService.getProblems({ track: 'all', limit: 300 });
                    if (res && res.success && res.data) {
                        cachedProblems = Array.isArray(res.data.problems)
                            ? res.data.problems
                            : (Array.isArray(res.data) ? res.data : []);
                    }
                }
                if (window.CodeArenaAPI && window.CodeArenaAPI.roadmapService) {
                    const rRes = await window.CodeArenaAPI.roadmapService.getRoadmap();
                    if (rRes && rRes.success && rRes.data && Array.isArray(rRes.data.topics)) {
                        cachedRoadmapTopics = rRes.data.topics;
                    }
                }
            } catch (err) {
                console.warn('Unable to prefetch dashboard search index:', err);
            }
        }
        prefetchSearchIndex();

        function queryIndex(keyword) {
            const term = keyword.trim().toLowerCase();
            if (!term) return [];

            const results = [];

            // 1. Match all seeded Basic & DSA problems from backend
            cachedProblems.forEach(function (p) {
                const titleMatch = (p.title || '').toLowerCase().includes(term);
                const topicMatch = (p.topic || '').toLowerCase().includes(term);
                const diffMatch = (p.difficulty || '').toLowerCase() === term;
                const descMatch = (p.description || '').toLowerCase().includes(term);

                if (titleMatch || topicMatch || diffMatch || descMatch) {
                    const isBasic = String(p.track || '').toLowerCase() === 'basic';
                    const targetKey = p.slug || p.id;
                    results.push({
                        type: isBasic ? 'basic' : 'problem',
                        title: p.title,
                        desc: isBasic ? `Basic Java · ${p.topic || 'Fundamentals'}` : `DSA · ${p.topic} · ${p.difficulty}`,
                        url: isBasic ? `basic-problem.html?id=${encodeURIComponent(targetKey)}` : `problem.html?id=${encodeURIComponent(targetKey)}`,
                        badge: isBasic ? 'Basic' : p.difficulty,
                        badgeClass: isBasic ? 'search-badge-basic' : `search-badge-${(p.difficulty || 'easy').toLowerCase()}`
                    });
                }
            });

            // 2. Match Roadmap topics from backend
            cachedRoadmapTopics.forEach(function (tp) {
                const titleMatch = (tp.title || '').toLowerCase().includes(term);
                const descMatch = (tp.description || '').toLowerCase().includes(term);
                if (titleMatch || descMatch) {
                    results.push({
                        type: 'roadmap',
                        title: tp.title,
                        desc: `Milestone #${tp.id} · Level ${tp.level || 1}`,
                        url: `roadmap.html?topic=${encodeURIComponent(tp.slug || tp.id)}`,
                        badge: 'Roadmap',
                        badgeClass: 'search-badge-roadmap'
                    });
                }
            });

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

    // --------------------------------------------------------------------------
    // 7. Mouse / Pointer Focus Normalization
    // Immediately blur clickable elements (buttons, links, action cards, pills)
    // after mouse click so they do not retain unwanted focus outlines or highlights,
    // while preserving 100% keyboard accessibility and :focus-visible outlines.
    // --------------------------------------------------------------------------
    document.addEventListener('mouseup', function (e) {
        if (e.button !== 0) return; // Only primary mouse clicks
        const interactive = e.target.closest('button, a, .shortcut-pill, .action-card, .dash-track-card, .problem-item, .stat-card, [role="button"], [role="link"], [tabindex="0"]');
        if (interactive && !interactive.matches('input, textarea, select')) {
            setTimeout(function () {
                if (document.activeElement === interactive) {
                    interactive.blur();
                }
            }, 0);
        }
    });
});

