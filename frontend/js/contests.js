/**
 * CodeArena — Contest Discovery & Preview Controller (contests.js)
 * Manages upcoming, ongoing, and past contest discovery, detail inspection,
 * and preview-safe registration simulation.
 */

(function () {
    'use strict';

    const REGISTRATION_STORAGE_KEY = 'codearena_registered_contests';

    // Sample Contest Catalog Data
    const CONTESTS_DATA = [
        {
            id: 'weekly-sprint-42',
            title: 'CodeArena Weekly Sprint #42',
            status: 'ongoing',
            startTime: 'Today, 18:00 UTC',
            duration: '90 Minutes',
            problemCount: 4,
            participantsCount: 384,
            description: 'Fast-paced algorithmic challenge focusing on arrays, two pointers, and greedy approaches. Great for sharpening your competitive problem-solving reflexes.',
            rules: [
                'Language: Java (OpenJDK 17)',
                '4 canonical problems ranging from Easy to Hard',
                'ICPC-style penalty scoring: 20 minutes added for each failed submission',
                'Plagiarism detection and automated evaluation apply'
            ]
        },
        {
            id: 'java-masters-2026',
            title: 'Java Algorithmic Masters 2026',
            status: 'upcoming',
            startTime: 'Saturday, Nov 15, 2026 · 14:00 UTC',
            duration: '120 Minutes',
            problemCount: 5,
            participantsCount: 1240,
            description: 'Premier national competitive coding tournament. Test your mastery of graph algorithms, dynamic programming, and advanced tree data structures.',
            rules: [
                'Language: Java (OpenJDK 17)',
                'Individual competition; external code libraries prohibited',
                'Partial scoring enabled on subtasks',
                'Digital achievement certificates awarded to top 10%'
            ]
        },
        {
            id: 'biweekly-speed-18',
            title: 'Biweekly Speed Arena #18',
            status: 'upcoming',
            startTime: 'Wednesday, Nov 19, 2026 · 19:30 UTC',
            duration: '60 Minutes',
            problemCount: 3,
            participantsCount: 512,
            description: 'Speed-focused contest designed for rapid prototyping and clean coding under time pressure. Emphasizes string manipulation and binary search.',
            rules: [
                'Language: Java (OpenJDK 17)',
                '3 problems: 1 Easy, 1 Medium, 1 Hard',
                'Fastest correct submission wins ties',
                'Hidden test cases verified on submission'
            ]
        },
        {
            id: 'freshman-challenge-1',
            title: 'CodeArena Freshman Invitational',
            status: 'past',
            startTime: 'Completed · Oct 28, 2026',
            duration: '90 Minutes',
            problemCount: 4,
            participantsCount: 890,
            description: 'Introductory contest aimed at students learning core data structures. Practice with these problems in virtual contest mode anytime.',
            rules: [
                'Archived for virtual practice',
                'Problems accessible in problem catalogue',
                'Solution writeups available for review'
            ]
        },
        {
            id: 'dp-open-2026',
            title: 'Dynamic Programming Grand Prix',
            status: 'past',
            startTime: 'Completed · Oct 14, 2026',
            duration: '120 Minutes',
            problemCount: 4,
            participantsCount: 710,
            description: 'Specialized championship concentrating exclusively on 1D/2D memoization, knapsack variants, and interval dynamic programming.',
            rules: [
                'Archived for virtual practice',
                'Standard OpenJDK 17 execution'
            ]
        }
    ];

    // State
    const state = {
        selectedTab: 'all',
        searchQuery: '',
        registeredContests: []
    };

    // DOM Elements Cache
    let dom = {};

    function init() {
        cacheElements();
        bindEvents();
        loadRegistrations();
        renderContests();
    }

    function cacheElements() {
        dom = {
            container: document.getElementById('contestsListGrid'),
            emptyState: document.getElementById('contestsEmptyState'),
            searchInput: document.getElementById('contestSearchInput'),
            clearSearchBtn: document.getElementById('clearContestSearch'),
            tabs: document.querySelectorAll('.contest-tab-btn'),
            modalOverlay: document.getElementById('contestModalOverlay'),
            modalTitle: document.getElementById('modalContestTitle'),
            modalDesc: document.getElementById('modalContestDesc'),
            modalRules: document.getElementById('modalContestRules'),
            modalDuration: document.getElementById('modalContestDuration'),
            modalProblems: document.getElementById('modalContestProblems'),
            modalTime: document.getElementById('modalContestTime'),
            modalRegisterBtn: document.getElementById('modalRegisterBtn'),
            closeModalBtn: document.getElementById('closeContestModalBtn')
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

    function loadRegistrations() {
        try {
            const raw = sessionStorage.getItem(REGISTRATION_STORAGE_KEY);
            if (raw) state.registeredContests = JSON.parse(raw);
        } catch (e) {
            state.registeredContests = [];
        }
    }

    function saveRegistrations() {
        try {
            sessionStorage.setItem(REGISTRATION_STORAGE_KEY, JSON.stringify(state.registeredContests));
        } catch (e) {}
    }

    function renderContests() {
        if (!dom.container) return;

        let filtered = CONTESTS_DATA.filter(c => {
            if (state.selectedTab !== 'all' && c.status !== state.selectedTab) {
                return false;
            }
            if (state.searchQuery) {
                const titleMatch = c.title.toLowerCase().includes(state.searchQuery);
                const descMatch = c.description.toLowerCase().includes(state.searchQuery);
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
            const isRegistered = state.registeredContests.includes(c.id);
            const statusClass = c.status === 'ongoing' ? 'ongoing' : (c.status === 'upcoming' ? 'upcoming' : 'past');
            const statusLabel = c.status === 'ongoing' ? '● Live Now' : (c.status === 'upcoming' ? 'Upcoming' : 'Past Contest');

            return `
                <div class="contest-card" id="contest-${c.id}">
                    <div>
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <span class="contest-status-badge ${statusClass}">${statusLabel}</span>
                            <span style="font-size: 0.76rem; color: var(--color-text-muted);">${c.participantsCount} participants</span>
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
                                <span class="meta-value">${escapeHtml(c.startTime)}</span>
                            </div>
                            <div class="contest-meta-item">
                                <span class="meta-label">Duration</span>
                                <span class="meta-value">${escapeHtml(c.duration)}</span>
                            </div>
                        </div>

                        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 12px;">
                            <button type="button" class="secondary-header-btn btn-view-rules" data-id="${c.id}" style="font-size: 0.8rem;">
                                Rules & Details
                            </button>
                            ${c.status === 'upcoming' ? `
                                <button type="button" class="prob-btn-solve btn-toggle-reg" data-id="${c.id}" style="background-color: ${isRegistered ? '#16A34A' : 'var(--color-primary)'};">
                                    ${isRegistered ? '✓ Registered' : 'Register (Preview)'}
                                </button>
                            ` : (c.status === 'ongoing' ? `
                                <a href="problems.html" class="prob-btn-solve" style="background-color: #22C55E;">
                                    Enter Arena <span aria-hidden="true">→</span>
                                </a>
                            ` : `
                                <a href="problems.html" class="secondary-header-btn" style="font-size: 0.8rem;">
                                    Virtual Practice
                                </a>
                            `)}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Bind Rules button
        dom.container.querySelectorAll('.btn-view-rules').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                const contest = CONTESTS_DATA.find(c => c.id === id);
                if (contest) openModal(contest);
            });
        });

        // Bind Register button
        dom.container.querySelectorAll('.btn-toggle-reg').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                const contestObj = CONTESTS_DATA.find(item => item.id === id);
                const title = contestObj ? contestObj.title : 'Contest';
                if (state.registeredContests.includes(id)) {
                    state.registeredContests = state.registeredContests.filter(cid => cid !== id);
                    if (window.CodeArenaToast) {
                        window.CodeArenaToast.info(`Unregistered from ${title}`);
                    }
                } else {
                    state.registeredContests.push(id);
                    if (window.CodeArenaToast) {
                        window.CodeArenaToast.success(`Simulated preview registration confirmed for ${title}!`);
                    }
                }
                saveRegistrations();
                renderContests();
            });
        });
    }

    function openModal(contest) {
        if (!dom.modalOverlay) return;
        const isRegistered = state.registeredContests.includes(contest.id);

        if (dom.modalTitle) dom.modalTitle.textContent = contest.title;
        if (dom.modalDesc) dom.modalDesc.textContent = contest.description;
        if (dom.modalTime) dom.modalTime.textContent = contest.startTime;
        if (dom.modalDuration) dom.modalDuration.textContent = contest.duration;
        if (dom.modalProblems) dom.modalProblems.textContent = `${contest.problemCount} Java Problems`;

        if (dom.modalRules) {
            dom.modalRules.innerHTML = contest.rules.map(r => `<li>${escapeHtml(r)}</li>`).join('');
        }

        if (dom.modalRegisterBtn) {
            if (contest.status === 'upcoming') {
                dom.modalRegisterBtn.style.display = 'inline-flex';
                dom.modalRegisterBtn.textContent = isRegistered ? '✓ Registered (Preview)' : 'Register (Preview)';
                dom.modalRegisterBtn.onclick = function () {
                    if (state.registeredContests.includes(contest.id)) {
                        state.registeredContests = state.registeredContests.filter(cid => cid !== contest.id);
                    } else {
                        state.registeredContests.push(contest.id);
                    }
                    saveRegistrations();
                    openModal(contest);
                    renderContests();
                };
            } else {
                dom.modalRegisterBtn.style.display = 'none';
            }
        }

        dom.modalOverlay.style.display = 'flex';
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
