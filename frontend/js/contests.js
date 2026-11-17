/**
 * CodeArena — Contest Discovery & Preview Controller (contests.js)
 * Manages upcoming, ongoing, and past contest discovery, detail inspection,
 * and preview-safe registration simulation.
 */

(function () {
    'use strict';

    // State
    const state = {
        contests: [],
        loadError: null,
        selectedTab: 'all',
        searchQuery: ''
    };

    // DOM Elements Cache
    let dom = {};

    async function init() {
        cacheElements();
        bindEvents();
        await loadContests();
        renderContests();
        document.addEventListener('codearena:auth-changed', async function () {
            await loadContests();
            renderContests();
        });
    }

    function cacheElements() {
        dom = {
            container: document.getElementById('contestsListGrid'),
            emptyState: document.getElementById('contestsEmptyState'),
            searchInput: document.getElementById('contestSearchInput'),
            clearSearchBtn: document.getElementById('clearContestSearch'),
            tabs: document.querySelectorAll('.contest-tab-btn'),
            statActive: document.getElementById('statContestsActive'),
            statUpcoming: document.getElementById('statContestsUpcoming'),
            modalOverlay: document.getElementById('contestModalOverlay'),
            modalTitle: document.getElementById('modalContestTitle'),
            modalDesc: document.getElementById('modalContestDesc'),
            modalRules: document.getElementById('modalContestRules'),
            modalDuration: document.getElementById('modalContestDuration'),
            modalProblems: document.getElementById('modalContestProblems'),
            modalTime: document.getElementById('modalContestTime'),
            modalExtra: document.getElementById('modalContestDetailsExtra'),
            modalRegisterBtn: document.getElementById('modalRegisterBtn'),
            closeModalBtn: document.getElementById('closeContestModalBtn'),
            closeModalFooterBtn: document.getElementById('closeContestModalFooterBtn')
        };
    }

    function bindEvents() {
        if (dom.searchInput) {
            dom.searchInput.addEventListener('input', function (e) {
                state.searchQuery = e.target.value.trim().toLowerCase();
                if (dom.clearSearchBtn) {
                    dom.clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
                }
                renderContests();
            });
        }

        if (dom.clearSearchBtn) {
            dom.clearSearchBtn.addEventListener('click', function () {
                if (dom.searchInput) dom.searchInput.value = '';
                state.searchQuery = '';
                dom.clearSearchBtn.style.display = 'none';
                renderContests();
            });
        }

        if (dom.tabs) {
            dom.tabs.forEach(tab => {
                tab.addEventListener('click', function () {
                    dom.tabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    state.selectedTab = this.getAttribute('data-status') || 'all';
                    renderContests();
                });
            });
        }

        if (dom.closeModalBtn) {
            dom.closeModalBtn.addEventListener('click', closeModal);
        }
        if (dom.closeModalFooterBtn) {
            dom.closeModalFooterBtn.addEventListener('click', closeModal);
        }

        if (dom.modalOverlay) {
            dom.modalOverlay.addEventListener('click', function (e) {
                if (e.target === dom.modalOverlay) closeModal();
            });
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && dom.modalOverlay && dom.modalOverlay.style.display === 'flex') {
                closeModal();
            }
        });
    }

    async function loadContests() {
        if (!window.CodeArenaAPI || !window.CodeArenaAPI.contestService) {
            state.loadError = 'Contest service is unavailable.';
            state.contests = [];
            return;
        }
        try {
            if (window.CodeArenaAPI.authService && typeof window.CodeArenaAPI.authService.getCurrentUser === 'function') {
                await window.CodeArenaAPI.authService.getCurrentUser().catch(() => null);
            }
            const res = await window.CodeArenaAPI.contestService.list();
            if (res && res.success && Array.isArray(res.data)) {
                state.contests = res.data;
                state.loadError = null;
            } else {
                state.contests = [];
                state.loadError = (res && res.message) || 'Unable to load contests from server.';
            }
        } catch (err) {
            state.contests = [];
            state.loadError = 'Unable to connect to the contests server.';
        }

        if (dom.statActive) {
            dom.statActive.textContent = String(state.contests.filter(c => c.status === 'ongoing').length);
        }
        if (dom.statUpcoming) {
            dom.statUpcoming.textContent = String(state.contests.filter(c => c.status === 'upcoming').length);
        }
    }

    function formatScheduleTime(raw) {
        if (!raw) return 'TBD';
        const d = new Date(String(raw).replace(' ', 'T'));
        if (isNaN(d.getTime())) return String(raw);
        return d.toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    async function toggleRegistration(contest) {
        if (!contest) return;
        const isAuthed = Boolean(window.CodeArenaAPI && window.CodeArenaAPI.authService && window.CodeArenaAPI.authService.isAuthenticated());
        if (!isAuthed) {
            if (window.CodeArenaToast) window.CodeArenaToast.info('Log in to register for CodeArena contests.');
            if (window.CodeArenaAuthModal && typeof window.CodeArenaAuthModal.open === 'function') {
                window.CodeArenaAuthModal.open('login');
            }
            return;
        }
        const slug = contest.slug || contest.id;
        try {
            const res = contest.isRegistered
                ? await window.CodeArenaAPI.contestService.unregister(slug)
                : await window.CodeArenaAPI.contestService.register(slug);
            if (res && res.success) {
                if (window.CodeArenaToast) {
                    window.CodeArenaToast.success(contest.isRegistered ? `Unregistered from ${contest.title}` : `Registered for ${contest.title}!`);
                }
                await loadContests();
                renderContests();
                return true;
            } else {
                if (window.CodeArenaToast) window.CodeArenaToast.error((res && res.message) || 'Registration update failed.');
            }
        } catch (err) {
            if (window.CodeArenaToast) window.CodeArenaToast.error('Server error updating registration.');
        }
        return false;
    }

    function renderContests() {
        if (!dom.container) return;

        if (state.loadError) {
            dom.container.style.display = 'none';
            if (dom.emptyState) {
                dom.emptyState.style.display = 'block';
                dom.emptyState.innerHTML = `<h3 class="feature-empty-title">Contests Unavailable</h3><p class="feature-empty-desc">${escapeHtml(state.loadError)}</p>`;
            }
            return;
        }

        let filtered = state.contests.filter(c => {
            if (state.selectedTab !== 'all' && c.status !== state.selectedTab) {
                return false;
            }
            if (state.searchQuery) {
                const titleMatch = (c.title || '').toLowerCase().includes(state.searchQuery);
                const descMatch = (c.description || '').toLowerCase().includes(state.searchQuery);
                return titleMatch || descMatch;
            }
            return true;
        });

        if (filtered.length === 0) {
            dom.container.style.display = 'none';
            if (dom.emptyState) dom.emptyState.style.display = 'block';
            return;
        }

        dom.container.style.display = 'grid';
        if (dom.emptyState) dom.emptyState.style.display = 'none';

        dom.container.innerHTML = filtered.map(c => {
            const slug = c.slug || c.id;
            const isRegistered = Boolean(c.isRegistered);
            const statusClass = c.status === 'ongoing' ? 'ongoing' : (c.status === 'upcoming' ? 'upcoming' : 'past');
            const statusLabel = c.status === 'ongoing' ? '● Live Now' : (c.status === 'upcoming' ? 'Upcoming' : 'Past Contest');
            const firstProblemSlug = Array.isArray(c.problems) && c.problems.length > 0 ? (c.problems[0].slug || c.problems[0].problemId) : null;
            const arenaHref = firstProblemSlug ? `problem.html?id=${encodeURIComponent(firstProblemSlug)}` : 'problems.html';

            return `
                <div class="contest-card" id="contest-${escapeHtml(slug)}">
                    <div>
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <span class="contest-status-badge ${statusClass}">${statusLabel}</span>
                            <span style="font-size: 0.76rem; color: var(--color-text-muted);">${c.participantsCount || 0} participants</span>
                        </div>
                        <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--color-text-primary); margin: 0 0 6px 0;">
                            ${escapeHtml(c.title)}
                        </h3>
                        <p style="font-size: 0.84rem; color: var(--color-text-muted); margin: 0; line-height: 1.45;">
                            ${escapeHtml(c.description)}
                        </p>
                    </div>

                    <div>
                        <div class="contest-meta-grid">
                            <div class="contest-meta-item">
                                <span class="meta-label">Schedule</span>
                                <span class="meta-value">${escapeHtml(formatScheduleTime(c.startTime))}</span>
                            </div>
                            <div class="contest-meta-item">
                                <span class="meta-label">Duration</span>
                                <span class="meta-value">${escapeHtml(c.duration || '90 Minutes')}</span>
                            </div>
                        </div>

                        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 12px;">
                            <button type="button" class="secondary-header-btn btn-view-rules" data-id="${escapeHtml(slug)}" style="font-size: 0.8rem;">
                                Details &amp; Leaderboard
                            </button>
                            ${c.status === 'upcoming' ? `
                                <button type="button" class="prob-btn-solve btn-toggle-reg" data-id="${escapeHtml(slug)}" style="background-color: ${isRegistered ? '#16A34A' : 'var(--color-primary)'};">
                                    ${isRegistered ? '✓ Registered' : 'Register'}
                                </button>
                            ` : (c.status === 'ongoing' ? `
                                <a href="${arenaHref}" class="prob-btn-solve" style="background-color: #22C55E;">
                                    Enter Arena <span aria-hidden="true">→</span>
                                </a>
                            ` : `
                                <a href="${arenaHref}" class="secondary-header-btn" style="font-size: 0.8rem;">
                                    Virtual Practice
                                </a>
                            `)}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Bind Details & Leaderboard button
        dom.container.querySelectorAll('.btn-view-rules').forEach(btn => {
            btn.addEventListener('click', function () {
                const slug = this.getAttribute('data-id');
                const contest = state.contests.find(c => (c.slug || c.id) === slug);
                if (contest) openModal(contest);
            });
        });

        // Bind Register button
        dom.container.querySelectorAll('.btn-toggle-reg').forEach(btn => {
            btn.addEventListener('click', async function () {
                const slug = this.getAttribute('data-id');
                const contest = state.contests.find(c => (c.slug || c.id) === slug);
                await toggleRegistration(contest);
            });
        });
    }

    async function openModal(contest) {
        if (!dom.modalOverlay) return;
        const slug = contest.slug || contest.id;

        if (dom.modalTitle) dom.modalTitle.textContent = contest.title;
        if (dom.modalDesc) dom.modalDesc.textContent = contest.description;
        if (dom.modalTime) dom.modalTime.textContent = formatScheduleTime(contest.startTime);
        if (dom.modalDuration) dom.modalDuration.textContent = contest.duration || '90 Minutes';
        if (dom.modalProblems) dom.modalProblems.textContent = `${contest.problemCount || 0} Java Problems`;
        if (dom.modalExtra) dom.modalExtra.innerHTML = '<div style="font-size: 0.8rem; color: var(--color-text-muted);">Loading contest problems & leaderboard...</div>';

        const rules = Array.isArray(contest.rules) ? contest.rules : [];
        if (dom.modalRules) {
            dom.modalRules.innerHTML = rules.map(r => `<li>${escapeHtml(r)}</li>`).join('');
        }

        if (dom.modalRegisterBtn) {
            if (contest.status === 'upcoming' || contest.status === 'ongoing') {
                dom.modalRegisterBtn.style.display = 'inline-flex';
                dom.modalRegisterBtn.textContent = contest.isRegistered ? '✓ Registered' : 'Register';
                dom.modalRegisterBtn.onclick = async function () {
                    const updated = await toggleRegistration(contest);
                    if (updated) {
                        const fresh = state.contests.find(c => (c.slug || c.id) === slug);
                        if (fresh) openModal(fresh);
                    }
                };
            } else {
                dom.modalRegisterBtn.style.display = 'none';
            }
        }

        dom.modalOverlay.style.display = 'flex';

        try {
            const detailRes = await window.CodeArenaAPI.contestService.getDetail(slug);
            if (detailRes && detailRes.success && detailRes.data && dom.modalExtra) {
                const detail = detailRes.data;
                const probs = Array.isArray(detail.problems) ? detail.problems : [];
                const lb = Array.isArray(detail.leaderboard) ? detail.leaderboard : [];
                let extraHtml = '';
                if (probs.length > 0) {
                    extraHtml += `<h4 style="font-size: 0.86rem; font-weight: 700; margin: 0 0 6px 0;">Contest Problems</h4>`;
                    extraHtml += `<div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px;">`;
                    probs.forEach(p => {
                        const target = p.slug || p.problemId;
                        extraHtml += `<a href="problem.html?id=${encodeURIComponent(target)}" style="display: flex; justify-content: space-between; font-size: 0.8rem; padding: 6px 10px; border: 1px solid var(--color-border); border-radius: 6px; color: var(--color-text-primary); text-decoration: none;">
                            <span>${escapeHtml(p.label ? p.label + '. ' : '')}${escapeHtml(p.title || target)}</span>
                            <span style="color: var(--color-text-muted);">${escapeHtml(p.difficulty || '')}${p.points ? ' · ' + p.points + ' pts' : ''}</span>
                        </a>`;
                    });
                    extraHtml += `</div>`;
                }
                extraHtml += `<h4 style="font-size: 0.86rem; font-weight: 700; margin: 0 0 6px 0;">Leaderboard</h4>`;
                if (lb.length === 0) {
                    extraHtml += `<p style="font-size: 0.78rem; color: var(--color-text-muted); margin: 0;">No ranked submissions recorded for this contest yet.</p>`;
                } else {
                    extraHtml += `<div style="display: flex; flex-direction: column; gap: 4px;">`;
                    lb.slice(0, 10).forEach((row, i) => {
                        extraHtml += `<div style="display: flex; justify-content: space-between; font-size: 0.78rem; padding: 4px 8px; background: rgba(255,255,255,0.03); border-radius: 4px;">
                            <span>#${i + 1} ${escapeHtml(row.username || row.fullName || 'Learner')}</span>
                            <span>${row.totalScore || 0} pts · ${row.solvedCount || 0} solved</span>
                        </div>`;
                    });
                    extraHtml += `</div>`;
                }
                dom.modalExtra.innerHTML = extraHtml;
            }
        } catch (e) { }
    }

    function closeModal() {
        if (dom.modalOverlay) dom.modalOverlay.style.display = 'none';
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
