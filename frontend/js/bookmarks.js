/**
 * CodeArena — Bookmarks Manager Controller (bookmarks.js)
 * Manages guest problem bookmarks with safe localStorage persistence,
 * in-memory fallback, search/filtering, and canonical workspace links.
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'codearena_guest_bookmarks';

    // In-memory fallback if localStorage fails or is blocked
    let inMemoryBookmarks = [];

    // State
    const state = {
        bookmarkedIds: [],
        canonicalProblems: [],
        searchQuery: '',
        selectedDifficulty: 'All',
        selectedTopic: 'All',
        sortBy: 'title-asc'
    };

    // DOM Elements Cache
    let dom = {};

    /**
     * Safe LocalStorage Bookmarks Accessor
     */
    const BookmarkStorage = {
        get() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (raw !== null) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) return parsed;
                }
            } catch (e) {
                console.warn('[Bookmarks] localStorage unavailable, using in-memory store:', e);
            }
            return inMemoryBookmarks.slice();
        },

        set(list) {
            inMemoryBookmarks = Array.from(new Set(list));
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryBookmarks));
            } catch (e) {
                console.warn('[Bookmarks] Error saving to localStorage:', e);
            }
        },

        add(problemId) {
            const current = this.get();
            if (!current.includes(problemId)) {
                current.push(problemId);
                this.set(current);
            }
        },

        remove(problemId) {
            const current = this.get().filter(id => id !== problemId);
            this.set(current);
        },

        has(problemId) {
            return this.get().includes(problemId);
        }
    };

    // Expose on window for cross-page compatibility
    if (typeof window !== 'undefined') {
        window.CodeArenaBookmarks = BookmarkStorage;
    }

    async function init() {
        cacheElements();
        bindEvents();
        await loadData();
        renderBookmarks();
    }

    function cacheElements() {
        dom = {
            container: document.getElementById('bookmarksListGrid'),
            emptyState: document.getElementById('bookmarksEmptyState'),
            countBadge: document.getElementById('bookmarksCountBadge'),
            searchInput: document.getElementById('bookmarksSearchInput'),
            clearSearchBtn: document.getElementById('clearBookmarksSearch'),
            difficultySelect: document.getElementById('bookmarksDiffFilter'),
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

        if (dom.sortSelect) {
            dom.sortSelect.addEventListener('change', function (e) {
                state.sortBy = e.target.value;
                renderBookmarks();
            });
        }

        if (dom.clearAllBtn) {
            dom.clearAllBtn.addEventListener('click', function () {
                if (confirm('Are you sure you want to remove all saved bookmarks?')) {
                    BookmarkStorage.set([]);
                    state.bookmarkedIds = [];
                    renderBookmarks();
                }
            });
        }
    }

    async function loadData() {
        state.bookmarkedIds = BookmarkStorage.get();

        try {
            if (window.CodeArenaAPI && window.CodeArenaAPI.problemService) {
                const res = await window.CodeArenaAPI.problemService.getProblems({ limit: 100 });
                if (res && res.success && res.data && res.data.problems) {
                    state.canonicalProblems = res.data.problems;
                }
            }
        } catch (err) {
            console.warn('[Bookmarks] Error loading canonical problems:', err);
        }
    }

    function renderBookmarks() {
        state.bookmarkedIds = BookmarkStorage.get();

        // Match bookmarked IDs to canonical problems
        let bookmarkedProblems = state.canonicalProblems.filter(p =>
            state.bookmarkedIds.includes(p.id) || state.bookmarkedIds.includes(p.slug)
        );

        // Update count badge
        if (dom.countBadge) {
            dom.countBadge.textContent = `${bookmarkedProblems.length} ${bookmarkedProblems.length === 1 ? 'saved challenge' : 'saved challenges'}`;
        }

        // Apply difficulty filter
        if (state.selectedDifficulty !== 'All') {
            bookmarkedProblems = bookmarkedProblems.filter(p =>
                (p.difficulty || '').toLowerCase() === state.selectedDifficulty.toLowerCase()
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
            if (dom.emptyState) dom.emptyState.style.display = 'block';
            return;
        }

        if (dom.container) dom.container.style.display = 'grid';
        if (dom.emptyState) dom.emptyState.style.display = 'none';

        dom.container.innerHTML = bookmarkedProblems.map(p => `
            <div class="practice-problem-card" id="bookmark-card-${p.id}">
                <div class="prob-card-header">
                    <div>
                        <a href="problem.html?id=${encodeURIComponent(p.id || p.slug)}" class="prob-card-title">${escapeHtml(p.title)}</a>
                        <div style="margin-top: 4px;">
                            <span class="topic-tag">${escapeHtml(p.topic || 'General')}</span>
                        </div>
                    </div>
                    <span class="diff-badge ${getDiffClass(p.difficulty)}">${escapeHtml(p.difficulty)}</span>
                </div>
                <div class="prob-card-desc">${renderSafeDescription(p.description || '')}</div>
                <div class="prob-card-footer">
                    <button type="button" class="secondary-header-btn btn-remove-bookmark" data-id="${p.id}" title="Remove challenge from bookmarks" style="height: 30px; font-size: 0.78rem; color: #EF4444; border-color: rgba(239, 68, 68, 0.3);">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        <span>Remove</span>
                    </button>
                    <a href="problem.html?id=${encodeURIComponent(p.id || p.slug)}" class="prob-btn-solve">
                        Solve in Workspace <span aria-hidden="true">→</span>
                    </a>
                </div>
            </div>
        `).join('');

        // Bind remove actions
        dom.container.querySelectorAll('.btn-remove-bookmark').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                BookmarkStorage.remove(id);
                renderBookmarks();
                if (window.CodeArenaToast) {
                    window.CodeArenaToast.info('Problem removed from bookmarks');
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
