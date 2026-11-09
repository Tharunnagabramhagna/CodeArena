/**
 * CodeArena — Practice Hub Controller (practice_hub.js)
 * Manages topic-based practice, difficulty navigation, recommended challenges,
 * and seamless links to individual problem workspaces.
 */

(function () {
    'use strict';

    // Practice Hub State
    const state = {
        problems: [],
        topics: [],
        selectedTopic: 'All',
        selectedDifficulty: 'All',
        searchQuery: ''
    };

    // DOM Elements Cache
    let dom = {};

    /**
     * Initializes the practice hub once DOM is ready.
     */
    async function init() {
        cacheElements();
        bindEvents();
        await loadPracticeData();
        renderPracticeHub();
        renderRecentlyViewed();
    }

    function cacheElements() {
        dom = {
            totalProblemsStat: document.getElementById('statTotalProblems'),
            totalTopicsStat: document.getElementById('statTotalTopics'),
            easyCountStat: document.getElementById('statEasyCount'),
            mediumCountStat: document.getElementById('statMediumCount'),
            hardCountStat: document.getElementById('statHardCount'),
            recommendedContainer: document.getElementById('recommendedGrid'),
            topicsContainer: document.getElementById('practiceTopicsGrid'),
            problemsContainer: document.getElementById('practiceProblemsGrid'),
            searchInput: document.getElementById('practiceSearchInput'),
            clearSearchBtn: document.getElementById('clearSearchBtn'),
            difficultyTabs: document.querySelectorAll('.practice-diff-tab'),
            emptyState: document.getElementById('practiceEmptyState'),
            resultsCount: document.getElementById('practiceResultsCount'),
            resetFiltersBtn: document.getElementById('resetPracticeFilters'),
            subModal: document.getElementById('subscriptionModalOverlay'),
            closeSubModalBtn: document.getElementById('btnCloseSubModal'),
            subModalPreviewTitle: document.getElementById('subModalPreviewTitle'),
            subModalPreviewDiff: document.getElementById('subModalPreviewDiff'),
            subModalPreviewTopic: document.getElementById('subModalPreviewTopic'),
            btnSelectMonthly: document.getElementById('btnSelectMonthly'),
            btnSelectAnnual: document.getElementById('btnSelectAnnual')
        };
    }

    function bindEvents() {
        if (dom.searchInput) {
            dom.searchInput.addEventListener('input', function (e) {
                state.searchQuery = e.target.value.trim().toLowerCase();
                if (dom.clearSearchBtn) {
                    dom.clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
                }
                filterAndRenderProblems();
            });
        }

        if (dom.clearSearchBtn) {
            dom.clearSearchBtn.addEventListener('click', function () {
                if (dom.searchInput) dom.searchInput.value = '';
                state.searchQuery = '';
                dom.clearSearchBtn.style.display = 'none';
                filterAndRenderProblems();
            });
        }

        if (dom.difficultyTabs) {
            dom.difficultyTabs.forEach(tab => {
                tab.addEventListener('click', function () {
                    dom.difficultyTabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    state.selectedDifficulty = this.getAttribute('data-diff') || 'All';
                    filterAndRenderProblems();
                });
            });
        }

        if (dom.resetFiltersBtn) {
            dom.resetFiltersBtn.addEventListener('click', function () {
                state.selectedTopic = 'All';
                state.selectedDifficulty = 'All';
                state.searchQuery = '';
                if (dom.searchInput) dom.searchInput.value = '';
                if (dom.clearSearchBtn) dom.clearSearchBtn.style.display = 'none';
                if (dom.difficultyTabs) {
                    dom.difficultyTabs.forEach(t => {
                        if (t.getAttribute('data-diff') === 'All') t.classList.add('active');
                        else t.classList.remove('active');
                    });
                }
                // Reset topic cards active class
                document.querySelectorAll('.practice-topic-card').forEach(c => c.classList.remove('active'));
                const allCard = document.querySelector('.practice-topic-card[data-topic="All"]');
                if (allCard) allCard.classList.add('active');
                filterAndRenderProblems();
            });
        }

        if (dom.closeSubModalBtn) {
            dom.closeSubModalBtn.addEventListener('click', closeSubscriptionModal);
        }
        if (dom.subModal) {
            dom.subModal.addEventListener('click', function (e) {
                if (e.target === dom.subModal) closeSubscriptionModal();
            });
        }
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && dom.subModal && dom.subModal.style.display === 'flex') {
                closeSubscriptionModal();
            }
        });
        if (dom.btnSelectMonthly) {
            dom.btnSelectMonthly.addEventListener('click', () => activatePlanAndRefresh('monthly'));
        }
        if (dom.btnSelectAnnual) {
            dom.btnSelectAnnual.addEventListener('click', () => activatePlanAndRefresh('annual'));
        }
    }

    async function loadPracticeData() {
        try {
            if (window.CodeArenaAPI && window.CodeArenaAPI.problemService) {
                const res = await window.CodeArenaAPI.problemService.getProblems({ limit: 250 });
                if (res && res.success && res.data && res.data.problems) {
                    state.problems = res.data.problems;
                }
                const topRes = await window.CodeArenaAPI.problemService.getTopics();
                if (topRes && topRes.success && topRes.data) {
                    state.topics = Array.isArray(topRes.data) ? topRes.data : ((topRes.data && topRes.data.topics) || []);
                }
            }
        } catch (err) {
            console.warn('[PracticeHub] Error loading problem data:', err);
        }
    }

    function renderPracticeHub() {
        const total = state.problems.length;
        const easy = state.problems.filter(p => (p.difficulty || '').toLowerCase() === 'easy').length;
        const med = state.problems.filter(p => (p.difficulty || '').toLowerCase() === 'medium').length;
        const hard = state.problems.filter(p => (p.difficulty || '').toLowerCase() === 'hard').length;

        if (dom.totalProblemsStat) dom.totalProblemsStat.textContent = total;
        if (dom.totalTopicsStat) dom.totalTopicsStat.textContent = state.topics.length || 10;
        if (dom.easyCountStat) dom.easyCountStat.textContent = easy;
        if (dom.mediumCountStat) dom.mediumCountStat.textContent = med;
        if (dom.hardCountStat) dom.hardCountStat.textContent = hard;

        const lblBasic = document.getElementById('lblBasicCount');
        if (lblBasic && window.CodeArenaBasicPractice) {
            lblBasic.textContent = window.CodeArenaBasicPractice.getStats().totalProblems;
        }

        renderRecommendedSection();
        renderTopicsGrid();
        filterAndRenderProblems();
    }

    function renderRecommendedSection() {
        if (!dom.recommendedContainer) return;
        // Curate top 3 recommended starter challenges
        const recommendedIds = ['two-sum', 'valid-palindrome', 'reverse-linked-list'];
        const recList = state.problems.filter(p => recommendedIds.includes(p.id) || recommendedIds.includes(p.slug));
        const listToRender = recList.length > 0 ? recList : state.problems.slice(0, 3);

        dom.recommendedContainer.innerHTML = listToRender.map(p => `
            <div class="practice-problem-card" style="border-left: 3px solid var(--color-primary);">
                <div class="prob-card-header">
                    <div>
                        <div style="font-size: 0.72rem; color: var(--color-primary); font-weight: 600; text-transform: uppercase; margin-bottom: 2px;">★ Recommended Starter</div>
                        <a href="problem.html?id=${encodeURIComponent(p.id || p.slug)}" class="prob-card-title">${escapeHtml(p.title)}</a>
                    </div>
                    <span class="diff-badge ${getDiffClass(p.difficulty)}">${escapeHtml(p.difficulty)}</span>
                </div>
                <div class="prob-card-desc">${renderSafeDescription(p.description || '')}</div>
                <div class="prob-card-footer">
                    <span class="topic-tag">${escapeHtml(p.topic || 'General')}</span>
                    <a href="problem.html?id=${encodeURIComponent(p.id || p.slug)}" class="prob-btn-solve">
                        Solve Challenge <span aria-hidden="true">→</span>
                    </a>
                </div>
            </div>
        `).join('');
    }

    function renderTopicsGrid() {
        if (!dom.topicsContainer) return;

        // Count problems per topic
        const topicCounts = {};
        state.problems.forEach(p => {
            const t = p.topic || 'General';
            topicCounts[t] = (topicCounts[t] || 0) + 1;
        });

        const topics = ['All', ...state.topics];
        dom.topicsContainer.innerHTML = topics.map(t => {
            const count = t === 'All' ? state.problems.length : (topicCounts[t] || 0);
            const isActive = state.selectedTopic === t ? 'active' : '';
            return `
                <div class="practice-topic-card ${isActive}" data-topic="${escapeHtml(t)}">
                    <div class="topic-card-top">
                        <h3 class="topic-card-title">${escapeHtml(t === 'All' ? 'All Practice Challenges' : t)}</h3>
                        <span class="topic-card-count">${count} ${count === 1 ? 'prob' : 'probs'}</span>
                    </div>
                    <p class="topic-card-desc">
                        ${t === 'All' ? 'Practice across all algorithmic domains.' : `Targeted challenges in ${escapeHtml(t)}.`}
                    </p>
                </div>
            `;
        }).join('');

        // Bind clicks to topic cards
        dom.topicsContainer.querySelectorAll('.practice-topic-card').forEach(card => {
            card.addEventListener('click', function () {
                dom.topicsContainer.querySelectorAll('.practice-topic-card').forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                state.selectedTopic = this.getAttribute('data-topic') || 'All';
                filterAndRenderProblems();
            });
        });
    }

    function filterAndRenderProblems() {
        if (!dom.problemsContainer) return;

        let filtered = state.problems.filter(p => {
            // Topic filter
            if (state.selectedTopic !== 'All' && p.topic !== state.selectedTopic) {
                return false;
            }
            // Difficulty filter
            if (state.selectedDifficulty !== 'All' && (p.difficulty || '').toLowerCase() !== state.selectedDifficulty.toLowerCase()) {
                return false;
            }
            // Search query
            if (state.searchQuery) {
                const titleMatch = (p.title || '').toLowerCase().includes(state.searchQuery);
                const descMatch = (p.description || '').toLowerCase().includes(state.searchQuery);
                const topicMatch = (p.topic || '').toLowerCase().includes(state.searchQuery);
                if (!titleMatch && !descMatch && !topicMatch) return false;
            }
            return true;
        });

        if (dom.resultsCount) {
            dom.resultsCount.textContent = `Showing ${filtered.length} of ${state.problems.length} challenges`;
        }

        if (filtered.length === 0) {
            dom.problemsContainer.style.display = 'none';
            if (dom.emptyState) dom.emptyState.style.display = 'block';
            return;
        }

        dom.problemsContainer.style.display = 'grid';
        if (dom.emptyState) dom.emptyState.style.display = 'none';

        const userIsPro = Boolean(
            window.CodeArenaAPI &&
            window.CodeArenaAPI.subscriptionService &&
            window.CodeArenaAPI.subscriptionService.isPremium()
        );

        dom.problemsContainer.innerHTML = filtered.map(p => {
            const isPro = Boolean(p.isPremium);
            const isLocked = isPro && !userIsPro;
            const proBadge = isPro ? '<span class="badge-pro" style="margin-left: 6px;">PRO</span>' : '<span class="badge-free" style="margin-left: 6px;">FREE</span>';
            const lockIcon = isLocked ? '<span class="pro-lock-icon">🔒</span>' : '';
            const actionLabel = isLocked ? '🔒 Unlock Pro' : 'Practice →';
            const cardHref = isLocked ? '#' : `problem.html?id=${encodeURIComponent(p.id || p.slug)}`;

            return `
                <div class="practice-problem-card ${isLocked ? 'card-locked' : ''}">
                    <div class="prob-card-header">
                        <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                            ${lockIcon}
                            <a href="${cardHref}" class="prob-card-title ${isLocked ? 'link-locked' : ''}" data-id="${escapeHtml(p.id || p.slug)}">${escapeHtml(p.title)}</a>
                            ${proBadge}
                        </div>
                        <span class="diff-badge ${getDiffClass(p.difficulty)}">${escapeHtml(p.difficulty)}</span>
                    </div>
                    <div class="prob-card-desc">${renderSafeDescription(p.description || '')}</div>
                    <div class="prob-card-footer">
                        <span class="topic-tag">${escapeHtml(p.topic || 'General')}</span>
                        <a href="${cardHref}" class="prob-btn-solve ${isLocked ? 'btn-solve-locked' : ''}" data-id="${escapeHtml(p.id || p.slug)}">
                            ${actionLabel}
                        </a>
                    </div>
                </div>
            `;
        }).join('');

        // Intercept locked card clicks
        dom.problemsContainer.querySelectorAll('.btn-solve-locked, .link-locked').forEach(el => {
            el.addEventListener('click', function (e) {
                e.preventDefault();
                const pid = this.getAttribute('data-id');
                const prob = state.problems.find(x => (x.id === pid || x.slug === pid));
                if (prob) openSubscriptionModal(prob);
            });
        });
    }


    let pendingModalProblem = null;

    function openSubscriptionModal(problem) {
        pendingModalProblem = problem;
        if (dom.subModalPreviewTitle) dom.subModalPreviewTitle.textContent = problem.title || 'Advanced Challenge';
        if (dom.subModalPreviewDiff) {
            dom.subModalPreviewDiff.textContent = problem.difficulty || 'Hard';
            dom.subModalPreviewDiff.className = 'diff-badge ' + getDiffClass(problem.difficulty);
        }
        if (dom.subModalPreviewTopic) dom.subModalPreviewTopic.textContent = `${problem.topic || 'DSA'} • ${problem.pattern || 'Pattern'}`;
        if (dom.subModal) {
            dom.subModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    function closeSubscriptionModal() {
        if (dom.subModal) {
            dom.subModal.style.display = 'none';
            document.body.style.overflow = '';
        }
        pendingModalProblem = null;
    }

    function activatePlanAndRefresh(planId) {
        if (window.CodeArenaAPI && window.CodeArenaAPI.subscriptionService) {
            window.CodeArenaAPI.subscriptionService.upgradePlan(planId);
            if (window.CodeArenaAPI.authService && !window.CodeArenaAPI.authService.isAuthenticated()) {
                window.CodeArenaAPI.authService.demoLogin(planId);
            }
            if (window.CodeArenaToast) {
                window.CodeArenaToast.success(`Activated ${planId === 'annual' ? 'Pro Annual ($199/yr)' : 'Pro Monthly ($5/mo)'} preview membership!`);
            }
            const targetProb = pendingModalProblem;
            closeSubscriptionModal();
            filterAndRenderProblems();
            if (targetProb) {
                setTimeout(function () {
                    window.location.href = `problem.html?id=${encodeURIComponent(targetProb.id || targetProb.slug)}`;
                }, 350);
            }
        }
    }

    function getDiffClass(diff) {
        const d = String(diff || '').toLowerCase();
        if (d === 'easy') return 'diff-easy';
        if (d === 'medium') return 'diff-medium';
        if (d === 'hard') return 'diff-hard';
        return 'diff-easy';
    }

        /**
     * Safely renders problem descriptions for practice cards.
     * Prevents raw HTML tag leakage, strips dangerous scripts/constructs,
     * preserves safe semantic tags (p, code, strong, em, span, br),
     * and provides a clean, concise card preview.
     */
    function renderSafeDescription(rawDesc) {
        if (!rawDesc) return '<p>No description provided for this challenge.</p>';

        let clean = '';
        if (window.CodeArenaAPI && window.CodeArenaAPI.problemService && typeof window.CodeArenaAPI.problemService.sanitizeHtml === 'function') {
            clean = window.CodeArenaAPI.problemService.sanitizeHtml(rawDesc);
        } else {
            clean = String(rawDesc)
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
                .replace(/\son\w+="[^"]*"/gi, '')
                .replace(/\son\w+='[^']*'/gi, '');
        }

        clean = clean.replace(/<\/?([a-z0-9]+)\b([^>]*)>/gi, function (match, tag) {
            const allowed = ['p', 'code', 'strong', 'em', 'span', 'br', 'b', 'i'];
            const lower = tag.toLowerCase();
            if (!allowed.includes(lower)) return '';
            if (match.startsWith('</')) return '</' + lower + '>';
            if (lower === 'br') return '<br>';
            return '<' + lower + '>';
        });

        const pMatch = clean.match(/<p>([\s\S]*?)<\/p>/i);
        if (pMatch && pMatch[0]) {
            return pMatch[0];
        }
        return '<p>' + clean + '</p>';
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

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    /**
     * Renders Recently Viewed Challenges in Practice Hub (Phase 6)
     */
    function renderRecentlyViewed() {
        const section = document.getElementById('practiceRecentlyViewedSection');
        const grid = document.getElementById('practiceRecentlyViewedGrid');
        const clearBtn = document.getElementById('btnPracticeClearRecentlyViewed');
        if (!section || !grid) return;

        let items = [];
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const raw = window.localStorage.getItem('codearena_recently_viewed');
                if (raw) items = JSON.parse(raw);
            }
        } catch (e) {
            items = [];
        }

        if (!Array.isArray(items) || items.length === 0) {
            section.style.display = 'none';
            return;
        }

        section.style.display = 'block';
        grid.innerHTML = items.map(function (p) {
            const diffClass = (p.difficulty === 'Easy') ? 'diff-easy' : (p.difficulty === 'Medium' ? 'diff-medium' : 'diff-hard');
            return `
                <a href="problem.html?id=${encodeURIComponent(p.id)}" class="recently-viewed-item" title="Open ${escapeHtml(p.title)}">
                    <div class="recent-item-title">${escapeHtml(p.title)}</div>
                    <div class="recent-item-meta">
                        <span class="diff-badge ${diffClass}">${escapeHtml(p.difficulty)}</span>
                        <span class="recent-item-topic">${escapeHtml(p.topic || 'Practice')}</span>
                    </div>
                </a>
            `;
        }).join('');

        if (clearBtn && !clearBtn._bound) {
            clearBtn._bound = true;
            clearBtn.addEventListener('click', function () {
                try {
                    if (typeof window !== 'undefined' && window.localStorage) {
                        window.localStorage.removeItem('codearena_recently_viewed');
                    }
                } catch (e) {}
                renderRecentlyViewed();
                if (window.CodeArenaToast) {
                    window.CodeArenaToast.info('Recently viewed history cleared');
                }
            });
        }
    }

})();
