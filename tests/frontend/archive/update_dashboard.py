# tests/frontend/utils/update_dashboard.py
import os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
DASH_HTML = os.path.join(ROOT, "frontend", "pages", "dashboard.html")
DASH_JS = os.path.join(ROOT, "frontend", "js", "dashboard.js")

# 1. Update dashboard.html
with open(DASH_HTML, "r", encoding="utf-8") as f:
    h = f.read().replace("\r\n", "\n")

target_stats_row = """                    <div class="stats-row">
                        <div class="stat-card">
                            <div class="stat-icon-wrapper stat-green" aria-hidden="true">
                                <span class="stat-icon-symbol">✓</span>
                            </div>
                            <div class="stat-details">
                                <span class="stat-label">Total Problems</span>
                                <span class="stat-value" id="dashStatProblems">12</span>
                                <span class="stat-desc">Canonical challenges</span>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon-wrapper stat-purple" aria-hidden="true">
                                <span class="stat-icon-symbol">📖</span>
                            </div>
                            <div class="stat-details">
                                <span class="stat-label">Topics</span>
                                <span class="stat-value" id="dashStatTopics">10</span>
                                <span class="stat-desc">Targeted categories</span>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon-wrapper stat-amber" aria-hidden="true">
                                <span class="stat-icon-symbol">🏆</span>
                            </div>
                            <div class="stat-details">
                                <span class="stat-label">Contests</span>
                                <span class="stat-value" id="dashStatContests">4</span>
                                <span class="stat-desc">Tournament schedules</span>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon-wrapper stat-blue" aria-hidden="true">
                                <span class="stat-icon-symbol">📊</span>
                            </div>
                            <div class="stat-details">
                                <span class="stat-label">Learning Paths</span>
                                <span class="stat-value" id="dashStatLearn">14</span>
                                <span class="stat-desc">Core curriculum paths</span>
                            </div>
                        </div>
                    </div>"""

replacement_stats_row = """                    <div class="stats-row" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
                        <div class="stat-card">
                            <div class="stat-icon-wrapper stat-green" aria-hidden="true">
                                <span class="stat-icon-symbol">✓</span>
                            </div>
                            <div class="stat-details">
                                <span class="stat-label">Total Problems</span>
                                <span class="stat-value" id="dashStatProblems">200</span>
                                <span class="stat-desc">Canonical collection</span>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon-wrapper" style="background: rgba(16, 185, 129, 0.15); color: #10b981;" aria-hidden="true">
                                <span class="stat-icon-symbol">🔓</span>
                            </div>
                            <div class="stat-details">
                                <span class="stat-label">Free Challenges</span>
                                <span class="stat-value" id="dashStatFree">150</span>
                                <span class="stat-desc">Community accessible</span>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon-wrapper" style="background: rgba(234, 179, 8, 0.18); color: #facc15;" aria-hidden="true">
                                <span class="stat-icon-symbol">⭐</span>
                            </div>
                            <div class="stat-details">
                                <span class="stat-label">Pro Challenges</span>
                                <span class="stat-value" id="dashStatPremium">50</span>
                                <span class="stat-desc">Advanced algorithms</span>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon-wrapper stat-purple" aria-hidden="true">
                                <span class="stat-icon-symbol">📖</span>
                            </div>
                            <div class="stat-details">
                                <span class="stat-label">Supported Topics</span>
                                <span class="stat-value" id="dashStatTopics">12</span>
                                <span class="stat-desc">Core DSA domains</span>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon-wrapper stat-blue" aria-hidden="true">
                                <span class="stat-icon-symbol">⚡</span>
                            </div>
                            <div class="stat-details">
                                <span class="stat-label">Algorithmic Patterns</span>
                                <span class="stat-value" id="dashStatPatterns">63</span>
                                <span class="stat-desc">Pattern categories</span>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon-wrapper stat-amber" aria-hidden="true">
                                <span class="stat-icon-symbol">🏆</span>
                            </div>
                            <div class="stat-details">
                                <span class="stat-label">Upcoming Contests</span>
                                <span class="stat-value" id="dashStatContests">4</span>
                                <span class="stat-desc">Preview tournaments</span>
                            </div>
                        </div>
                    </div>"""

assert target_stats_row in h, "target_stats_row not found in dashboard.html"
h = h.replace(target_stats_row, replacement_stats_row, 1)

# Add Upcoming Activities section right after dashboard-columns-grid
target_grid_end = """                        <!-- Recent Activity Panel (Personal Progress - Empty State until real backend data) -->
                        <section class="dash-panel recent-activity-panel" aria-labelledby="activityHeading">
                            <div class="panel-header">
                                <h2 id="activityHeading" class="panel-title">Recent Activity</h2>
                                <a href="submissions.html" class="panel-link">View Submissions →</a>
                            </div>

                            <div class="panel-empty-state">
                                <div class="empty-state-icon" aria-hidden="true">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <polyline points="12 6 12 12 16 14"/>
                                    </svg>
                                </div>
                                <h3 class="empty-state-title">No activity yet</h3>
                                <p class="empty-state-description">
                                    Your problem submissions, evaluation results, and practice history will appear here once you start coding.
                                </p>
                                <a href="practice.html" class="btn btn-primary btn-sm empty-state-btn">
                                    Start Your First Challenge <span aria-hidden="true">→</span>
                                </a>
                            </div>
                        </section>
                    </div>
                </div>"""

upcoming_section = """                        <!-- Recent Activity Panel (Personal Progress - Empty State until real backend data) -->
                        <section class="dash-panel recent-activity-panel" aria-labelledby="activityHeading">
                            <div class="panel-header">
                                <h2 id="activityHeading" class="panel-title">Recent Activity</h2>
                                <a href="submissions.html" class="panel-link">View Submissions →</a>
                            </div>

                            <div class="panel-empty-state">
                                <div class="empty-state-icon" aria-hidden="true">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <polyline points="12 6 12 12 16 14"/>
                                    </svg>
                                </div>
                                <h3 class="empty-state-title">No activity yet</h3>
                                <p class="empty-state-description">
                                    Your problem submissions, evaluation results, and practice history will appear here once you start coding.
                                </p>
                                <a href="practice.html" class="btn btn-primary btn-sm empty-state-btn">
                                    Start Your First Challenge <span aria-hidden="true">→</span>
                                </a>
                            </div>
                        </section>
                    </div>
                </div>

                <!-- Row 4: Upcoming Activities Section -->
                <section class="dash-panel upcoming-activities-panel" aria-labelledby="upcomingActivitiesHeading" style="margin-top: 24px;">
                    <div class="panel-header" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                        <div>
                            <h2 id="upcomingActivitiesHeading" class="panel-title" style="display: flex; align-items: center; gap: 8px;">
                                <span>Upcoming Activities & Schedules</span>
                                <span class="section-badge-tag" style="font-size: 0.68rem; text-transform: uppercase;">Sample Preview Schedule</span>
                            </h2>
                            <p style="font-size: 0.8rem; color: var(--color-text-muted); margin: 4px 0 0 0;">
                                Upcoming tournaments, curated problem sprints, and interactive learning modules scheduled for November 2026.
                            </p>
                        </div>
                        <a href="contests.html" class="panel-link">View Contests →</a>
                    </div>

                    <div class="activities-list-grid" id="upcomingActivitiesGrid">
                        <!-- Populated dynamically by dashboard.js from problemService.getUpcomingActivities() -->
                    </div>
                </section>"""

assert target_grid_end in h, "target_grid_end not found in dashboard.html"
h = h.replace(target_grid_end, upcoming_section, 1)

with open(DASH_HTML, "w", encoding="utf-8") as f:
    f.write(h)

print("dashboard.html updated with Platform Overview (6 stats) and Upcoming Activities.")

# 2. Update dashboard.js
with open(DASH_JS, "r", encoding="utf-8") as f:
    js = f.read().replace("\r\n", "\n")

target_dynamic_stats = """    // Populate dynamic stats from canonical API service if available
    try {
        if (window.CodeArenaAPI && window.CodeArenaAPI.problemService) {
            window.CodeArenaAPI.problemService.getProblems({ limit: 100 }).then(res => {
                if (res && res.success && res.data && res.data.problems) {
                    const el = document.getElementById('dashStatProblems');
                    if (el) el.textContent = res.data.problems.length;
                }
            }).catch(() => {});

            window.CodeArenaAPI.problemService.getTopics().then(res => {
                if (res && res.success && res.data && res.data.topics) {
                    const el = document.getElementById('dashStatTopics');
                    if (el) el.textContent = res.data.topics.length;
                }
            }).catch(() => {});
        }
    } catch (e) {}"""

replacement_dynamic_stats = """    // Populate dynamic stats & upcoming activities from canonical API service
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
    updateAuthStateUI();"""

assert target_dynamic_stats in js, "target_dynamic_stats not found in dashboard.js"
js = js.replace(target_dynamic_stats, replacement_dynamic_stats, 1)

# Hook logout button in dashboard.js
target_logout = """    const userProfileTrigger = document.getElementById('userProfileTrigger');
    const userProfileMenu = document.getElementById('userProfileMenu');"""

replacement_logout = """    const userProfileTrigger = document.getElementById('userProfileTrigger');
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
    }"""

assert target_logout in js, "target_logout not found in dashboard.js"
js = js.replace(target_logout, replacement_logout, 1)

with open(DASH_JS, "w", encoding="utf-8") as f:
    f.write(js)

print("dashboard.js updated with dynamic platform intelligence, upcoming activities, and preview auth states.")

