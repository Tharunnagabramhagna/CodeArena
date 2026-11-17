/**
 * CodeArena — Bookmarks Manager Controller (bookmarks.js)
 * Manages guest problem bookmarks with safe localStorage persistence,
 * in-memory fallback, search/filtering, and canonical workspace links.
 */

(function () {
    'use strict';

    // State
    const state = {
        authenticated: false,
        bookmarkedProblems: [],
        searchQuery: '',
        selectedDifficulty: 'All',
        selectedTopic: 'All',
        sortBy: 'title-asc'
    };

    // DOM Elements Cache
    let dom = {};

    async function init() {
        cacheElements();
        bindEvents();
        await loadData();
        renderBookmarks();
        document.addEventListener('codearena:auth-changed', async function () {
            await loadData();
            renderBookmarks();
        });
    }

    function cacheElements() {
        dom = {
            container: document.getElementById('bookmarksListGrid'),
            emptyState: document.getElementById('bookmarksEmptyState'),
            countBadge: document.getElementById('bookmarksCountBadge'),
            statusPill: document.getElementById('bookmarksStatusPill'),
            heroDesc: document.getElementById('bookmarksHeroDesc'),
            searchInput: document.getElementById('bookmarksSearchInput'),
            clearSearchBtn: document.getElementById('clearBookmarksSearch'),
            difficultySelect: document.getElementById('bookmarksDiffFilter'),
            topicSelect: document.getElementById('bookmarksTopicFilter'),
            sortSelect: document.getElementById('bookmarksSortSelect'),
            clearAllBtn: document.getElementById('clearAllBookmarksBtn')
        };
    }

    function bindEvents() {
        if (dom.searchInput) {
            dom.searchInput.addEventListener('input', function (e) {
                state.searchQuery = e.target.value.trim().toLowerCase();
                if (dom.clearSearchBtn) {
                    dom.clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
                }
                renderBookmarks();
            });
        }

        if (dom.clearSearchBtn) {
            dom.clearSearchBtn.addEventListener('click', function () {
                if (dom.searchInput) dom.searchInput.value = '';
                state.searchQuery = '';
                dom.clearSearchBtn.style.display = 'none';
                renderBookmarks();
            });
        }

        if (dom.difficultySelect) {
            dom.difficultySelect.addEventListener('change', function (e) {
                state.selectedDifficulty = e.target.value;
                renderBookmarks();
            });
        }

        if (dom.topicSelect) {
            dom.topicSelect.addEventListener('change', function (e) {
                state.selectedTopic = e.target.value;
                renderBookmarks();
            });
        }

        if (dom.sortSelect) {
            dom.sortSelect.addEventListener('change', function (e) {
                state.sortBy = e.target.value;
                renderBookmarks();
            });
        }

        if (dom.clearAllBtn) {
            dom.clearAllBtn.addEventListener('click', async function () {
                if (!state.authenticated) {
                    if (window.CodeArenaToast) window.CodeArenaToast.info('Log in to manage your account bookmarks.');
                    return;
                }
                if (confirm('Are you sure you want to remove all saved bookmarks?')) {
                    const res = await window.CodeArenaAPI.bookmarkService.clearAll();
                    if (res && res.success) {
                        state.bookmarkedProblems = [];
                        populateTopicFilter();
                        renderBookmarks();
                        if (window.CodeArenaToast) window.CodeArenaToast.info('All bookmarks cleared.');
                    } else if (window.CodeArenaToast) {
                        window.CodeArenaToast.error((res && res.message) || 'Unable to clear bookmarks.');
                    }
                }
            });
        }
    }

    async function loadData() {
        state.authenticated = false;
        state.bookmarkedProblems = [];

        if (!window.CodeArenaAPI || !window.CodeArenaAPI.authService) {
            return;
        }

        try {
            if (!window.CodeArenaAPI.authService.isAuthenticated()) {
                await window.CodeArenaAPI.authService.getCurrentUser().catch(() => null);
            }
            state.authenticated = window.CodeArenaAPI.authService.isAuthenticated();

            if (!state.authenticated) {
                if (dom.statusPill) dom.statusPill.textContent = 'Sign In Required';
                if (dom.heroDesc) dom.heroDesc.textContent = 'Log in to save problems and access your personal bookmarks from the CodeArena server.';
                populateTopicFilter();
                return;
            }

            if (dom.statusPill) dom.statusPill.textContent = 'Account Bookmarks';
            if (dom.heroDesc) dom.heroDesc.textContent = 'Problems saved to your CodeArena account for quick review and focused practice.';

            if (window.CodeArenaAPI.bookmarkService) {
                const res = await window.CodeArenaAPI.bookmarkService.list();
                if (res && res.success && Array.isArray(res.data)) {
                    state.bookmarkedProblems = res.data;
                }
            }
        } catch (err) {
            console.warn('[Bookmarks] Error loading account bookmarks:', err);
        }
        populateTopicFilter();
    }

    function populateTopicFilter() {
        if (!dom.topicSelect) return;
        const current = state.selectedTopic;
        const topics = Array.from(new Set(state.bookmarkedProblems.map(p => p.topic).filter(Boolean))).sort();
        dom.topicSelect.innerHTML = `<option value="All">All Topics</option>` +
            topics.map(t => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join('');
        dom.topicSelect.value = topics.includes(current) ? current : 'All';
        if (!topics.includes(current)) state.selectedTopic = 'All';
    }

    function renderBookmarks() {
        if (!state.authenticated) {
            if (dom.countBadge) dom.countBadge.textContent = '0';
            if (dom.container) dom.container.style.display = 'none';
            if (dom.emptyState) {
                dom.emptyState.style.display = 'block';
                dom.emptyState.innerHTML = `
                    <span class="feature-empty-icon" aria-hidden="true">🔒</span>
                    <h3 class="feature-empty-title">Log In to View Your Bookmarks</h3>
                    <p class="feature-empty-desc">
                        Bookmarks are stored persistently under your CodeArena account. Sign in or register to save challenges across sessions.
                    </p>
                    <a href="login.html?redirect=bookmarks.html" class="prob-btn-solve" style="margin: 0 auto; display: inline-flex;">
                        Log In to Continue <span aria-hidden="true">→</span>
                    </a>
                `;
            }
            return;
        }

        let bookmarkedProblems = state.bookmarkedProblems.slice();

        // Update count badge
        if (dom.countBadge) {
            dom.countBadge.textContent = `${bookmarkedProblems.length}`;
        }

        // Apply difficulty filter
        if (state.selectedDifficulty !== 'All') {
            bookmarkedProblems = bookmarkedProblems.filter(p =>
                (p.difficulty || '').toLowerCase() === state.selectedDifficulty.toLowerCase()
            );
        }

        // Apply topic filter
        if (state.selectedTopic !== 'All') {
            bookmarkedProblems = bookmarkedProblems.filter(p =>
                (p.topic || '').toLowerCase() === state.selectedTopic.toLowerCase()
            );
        }

        // Apply search query
        if (state.searchQuery) {
            bookmarkedProblems = bookmarkedProblems.filter(p => {
                const titleMatch = (p.title || '').toLowerCase().includes(state.searchQuery);
                const descMatch = (p.description || '').toLowerCase().includes(state.searchQuery);
                const topicMatch = (p.topic || '').toLowerCase().includes(state.searchQuery);
                return titleMatch || descMatch || topicMatch;
            });
        }

        // Apply sorting
        bookmarkedProblems.sort((a, b) => {
            if (state.sortBy === 'title-asc') {
                return (a.title || '').localeCompare(b.title || '');
            } else if (state.sortBy === 'title-desc') {
                return (b.title || '').localeCompare(a.title || '');
            } else if (state.sortBy === 'diff-asc') {
                const order = { 'easy': 1, 'medium': 2, 'hard': 3 };
                return (order[(a.difficulty || '').toLowerCase()] || 0) - (order[(b.difficulty || '').toLowerCase()] || 0);
            } else if (state.sortBy === 'diff-desc') {
                const order = { 'easy': 1, 'medium': 2, 'hard': 3 };
                return (order[(b.difficulty || '').toLowerCase()] || 0) - (order[(a.difficulty || '').toLowerCase()] || 0);
            }
            return 0;
        });

        // Render Empty State if no bookmarks match
        if (bookmarkedProblems.length === 0) {
            if (dom.container) dom.container.style.display = 'none';
            if (dom.emptyState) {
                dom.emptyState.style.display = 'block';
                dom.emptyState.innerHTML = `
                    <span class="feature-empty-icon" aria-hidden="true">🔖</span>
                    <h3 class="feature-empty-title">No Bookmarked Problems Found</h3>
                    <p class="feature-empty-desc">
                        You haven't bookmarked any challenges matching your filters. Open any problem and click Bookmark to save it here.
                    </p>
                    <a href="problems.html" class="prob-btn-solve" style="margin: 0 auto; display: inline-flex;">
                        Browse Problem Catalogue <span aria-hidden="true">→</span>
                    </a>
                `;
            }
            return;
        }

        if (dom.container) dom.container.style.display = 'grid';
        if (dom.emptyState) dom.emptyState.style.display = 'none';

        dom.container.innerHTML = bookmarkedProblems.map(p => {
            const targetKey = p.slug || p.id || p.problemId;
            return `
            <div class="practice-problem-card" id="bookmark-card-${escapeHtml(String(p.problemId || p.id))}">
                <div class="prob-card-header">
                    <div>
                        <a href="problem.html?id=${encodeURIComponent(targetKey)}" class="prob-card-title">${escapeHtml(p.title)}</a>
                        <div style="margin-top: 4px;">
                            <span class="topic-tag">${escapeHtml(p.topic || 'General')}</span>
                        </div>
                    </div>
                    <span class="diff-badge ${getDiffClass(p.difficulty)}">${escapeHtml(p.difficulty)}</span>
                </div>
                <div class="prob-card-desc">${renderSafeDescription(p.description || '')}</div>
                <div class="prob-card-footer">
                    <button type="button" class="secondary-header-btn btn-remove-bookmark" data-id="${escapeHtml(String(targetKey))}" data-num-id="${escapeHtml(String(p.problemId || p.id))}" title="Remove challenge from bookmarks" style="height: 30px; font-size: 0.78rem; color: #EF4444; border-color: rgba(239, 68, 68, 0.3);">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        <span>Remove</span>
                    </button>
                    <a href="problem.html?id=${encodeURIComponent(targetKey)}" class="prob-btn-solve">
                        Solve in Workspace <span aria-hidden="true">→</span>
                    </a>
                </div>
            </div>
        `;
        }).join('');

        // Bind remove actions
        dom.container.querySelectorAll('.btn-remove-bookmark').forEach(btn => {
            btn.addEventListener('click', async function () {
                const key = this.getAttribute('data-id');
                const numId = this.getAttribute('data-num-id');
                try {
                    const res = await window.CodeArenaAPI.bookmarkService.remove(key);
                    if (res && res.success) {
                        state.bookmarkedProblems = state.bookmarkedProblems.filter(
                            p => String(p.problemId || p.id) !== String(numId) && p.slug !== key
                        );
                        populateTopicFilter();
                        renderBookmarks();
                        if (window.CodeArenaToast) {
                            window.CodeArenaToast.info('Problem removed from bookmarks');
                        }
                    } else if (window.CodeArenaToast) {
                        window.CodeArenaToast.error((res && res.message) || 'Failed to remove bookmark');
                    }
                } catch (err) {
                    if (window.CodeArenaToast) window.CodeArenaToast.error('Failed to remove bookmark');
                }
            });
        });
    }

    function getDiffClass(diff) {
        const d = String(diff || '').toLowerCase();
        if (d === 'easy') return 'diff-easy';
        if (d === 'medium') return 'diff-medium';
        if (d === 'hard') return 'diff-hard';
        return 'diff-easy';
    }

        /**
     * Safely renders problem descriptions for bookmark cards.
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

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
