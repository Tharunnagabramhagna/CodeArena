/**
 * CodeArena — Problem Catalogue Controller (problems.js)
 * Manages problem catalogue discovery, live keyword searching,
 * difficulty/topic filtering, sorting, pagination, and navigation to problem workspace.
 */

(function () {
    'use strict';

    // Catalogue State
    const state = {
        search: '',
        difficulty: 'All',
        topic: 'All',
        sortBy: 'default',
        page: 1,
        limit: 6 // 6 items per page provides a balanced view and demonstrates pagination with 12 problems
    };

    // DOM Elements Cache
    let dom = {};

    /**
     * Initializes the problem catalogue once the DOM is loaded.
     */
    async function init() {
        cacheElements();
        bindEvents();
        await loadTopics();
        await loadProblems();
        initRecentlyViewed();
        initSearchSuggestions();
    }

    /**
     * Caches all required interactive elements.
     */
    function cacheElements() {
        dom = {
            // Search
            searchInput: document.getElementById('catalogueSearchInput'),
            searchClearBtn: document.getElementById('searchClearBtn'),

            // Filters & Sort
            difficultyFilter: document.getElementById('difficultyFilter'),
            topicFilter: document.getElementById('topicFilter'),
            sortBySelect: document.getElementById('sortBySelect'),
            clearFiltersBtn: document.getElementById('clearFiltersBtn'),

            // Summary & Chips
            resultsCountText: document.getElementById('resultsCountText'),
            activeFilterChips: document.getElementById('activeFilterChips'),

            // Main Listing
            tableCard: document.getElementById('catalogueTableCard'),
            tableBody: document.getElementById('problemsTableBody'),
            emptyState: document.getElementById('catalogueEmptyState'),
            resetEmptyBtn: document.getElementById('resetEmptyBtn'),
            loadingState: document.getElementById('catalogueLoadingState'),

            // Pagination
            paginationBar: document.getElementById('cataloguePaginationBar'),
            paginationInfo: document.getElementById('paginationInfo'),
            paginationNav: document.getElementById('paginationNav'),

            // Search Suggestions & Recently Viewed (Phase 6)
            searchSuggestions: document.getElementById('catalogueSearchSuggestions'),
            recentlyViewedSection: document.getElementById('recentlyViewedSection'),
            recentlyViewedGrid: document.getElementById('recentlyViewedGrid'),
            btnClearRecentlyViewed: document.getElementById('btnClearRecentlyViewed')
        };
    }

    /**
     * Populates topics dynamically from the canonical problemService.
     */
    async function loadTopics() {
        if (!dom.topicFilter) return;

        try {
            if (window.CodeArenaAPI && window.CodeArenaAPI.problemService) {
                const res = await window.CodeArenaAPI.problemService.getTopics();
                if (res.success && Array.isArray(res.data)) {
                    // Retain "All Topics" and append unique topics
                    dom.topicFilter.innerHTML = '<option value="All">All Topics</option>';
                    res.data.forEach(function (topic) {
                        const opt = document.createElement('option');
                        opt.value = topic;
                        opt.textContent = topic;
                        dom.topicFilter.appendChild(opt);
                    });
                }
            }
        } catch (err) {
            console.error('[CodeArena Catalogue] Failed to load topics:', err);
        }
    }

    /**
     * Binds UI events for search, filters, sorting, and pagination.
     */
    function bindEvents() {
        // Search Input with Debounce
        if (dom.searchInput) {
            let debounceTimer = null;
            dom.searchInput.addEventListener('input', function () {
                const query = dom.searchInput.value.trim();
                if (dom.searchClearBtn) {
                    dom.searchClearBtn.style.display = query ? 'block' : 'none';
                }
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(function () {
                    state.search = query;
                    state.page = 1;
                    loadProblems();
                }, 220);
            });
        }

        // Search Clear Button
        if (dom.searchClearBtn) {
            dom.searchClearBtn.addEventListener('click', function () {
                if (dom.searchInput) {
                    dom.searchInput.value = '';
                    dom.searchInput.focus();
                }
                dom.searchClearBtn.style.display = 'none';
                state.search = '';
                state.page = 1;
                loadProblems();
            });
        }

        // Difficulty Filter
        if (dom.difficultyFilter) {
            dom.difficultyFilter.addEventListener('change', function () {
                state.difficulty = dom.difficultyFilter.value;
                state.page = 1;
                loadProblems();
            });
        }

        // Topic Filter
        if (dom.topicFilter) {
            dom.topicFilter.addEventListener('change', function () {
                state.topic = dom.topicFilter.value;
                state.page = 1;
                loadProblems();
            });
        }

        // Sort By Filter
        if (dom.sortBySelect) {
            dom.sortBySelect.addEventListener('change', function () {
                state.sortBy = dom.sortBySelect.value;
                state.page = 1;
                loadProblems();
            });
        }

        // Clear Filters Buttons
        if (dom.clearFiltersBtn) {
            dom.clearFiltersBtn.addEventListener('click', clearAllFilters);
        }
        if (dom.resetEmptyBtn) {
            dom.resetEmptyBtn.addEventListener('click', clearAllFilters);
        }
    }

    /**
     * Fetches problem catalogue items via problemService.getProblems().
     */
    async function loadProblems() {
        showLoading(true);

        try {
            const params = {
                page: state.page,
                limit: state.limit
            };

            if (state.search) params.search = state.search;
            if (state.difficulty !== 'All') params.difficulty = state.difficulty;
            if (state.topic !== 'All') params.topic = state.topic;
            if (state.sortBy !== 'default') params.sortBy = state.sortBy;

            let response = null;
            if (window.CodeArenaAPI && window.CodeArenaAPI.problemService) {
                response = await window.CodeArenaAPI.problemService.getProblems(params);
            } else {
                response = { success: false, message: 'CodeArena problem service not found.' };
            }

            if (response.success && response.data) {
                const data = response.data;
                const problems = data.problems || [];
                const total = data.total !== undefined ? data.total : problems.length;

                renderSummary(total, problems.length);
                renderActiveFilterChips();

                if (total === 0) {
                    showEmptyState(true);
                } else {
                    showEmptyState(false);
                    const startNum = (data.page - 1) * data.limit + 1;
                    renderTable(problems, startNum);
                    renderPagination(data);
                }
            } else {
                showEmptyState(true, response.message || 'Unable to retrieve problems.');
            }
        } catch (err) {
            console.error('[CodeArena Catalogue] Error loading problems:', err);
            showEmptyState(true, 'An unexpected error occurred while loading catalogue data.');
        } finally {
            showLoading(false);
        }
    }

    /**
     * Renders the problem rows into the catalogue table body.
     */
    function renderTable(problems, startNumber) {
        if (!dom.tableBody) return;
        dom.tableBody.innerHTML = '';

        let bookmarkedIds = [];
        try {
            const bmRaw = localStorage.getItem('codearena_guest_bookmarks');
            if (bmRaw) {
                const parsed = JSON.parse(bmRaw);
                if (Array.isArray(parsed)) bookmarkedIds = parsed;
            }
        } catch (e) {}

        problems.forEach(function (problem, index) {
            const isBookmarked = bookmarkedIds.includes(problem.id) || bookmarkedIds.includes(problem.slug);
            const bookmarkIconHtml = isBookmarked
                ? `<span class="catalogue-bookmark-indicator" title="Bookmarked in your challenges" style="color: #F59E0B; margin-left: 6px; font-size: 0.85rem;" aria-label="Bookmarked">🔖</span>`
                : '';
            const rowNumber = startNumber + index;
            const diffClass = getDifficultyClass(problem.difficulty);
            const tr = document.createElement('tr');

            const acceptanceRate = (problem.provisionalStats && problem.provisionalStats.acceptanceRate)
                ? problem.provisionalStats.acceptanceRate
                : '—';

            tr.innerHTML = `
                <td class="col-num">${rowNumber}</td>
                <td class="col-title">
                    <div class="problem-title-cell">
                        <a href="problem.html?id=${encodeURIComponent(problem.id)}" class="problem-link-title" title="Open ${escapeHtml(problem.title)}">
                            <span>${escapeHtml(problem.title)}</span>
                        </a>${bookmarkIconHtml}
                        <p class="problem-snippet-text">${escapeHtml(problem.snippet || '')}</p>
                    </div>
                </td>
                <td class="col-diff">
                    <span class="diff-badge ${diffClass}">${escapeHtml(problem.difficulty)}</span>
                </td>
                <td class="col-topic">
                    <span class="topic-tag-pill">${escapeHtml(problem.topic)}</span>
                </td>
                <td class="col-acc">
                    <div class="acc-cell">
                        <span class="acc-rate-text">${acceptanceRate}</span>
                        <span class="acc-provisional-note">Provisional</span>
                    </div>
                </td>
                <td class="col-action">
                    <a href="problem.html?id=${encodeURIComponent(problem.id)}" class="btn-solve-problem" title="Solve ${escapeHtml(problem.title)}">
                        <span>Solve</span>
                        <span aria-hidden="true">→</span>
                    </a>
                </td>
            `;

            dom.tableBody.appendChild(tr);
        });
    }

    /**
     * Renders catalogue summary results counter using safe DOM construction.
     */
    function renderSummary(total, count) {
        if (!dom.resultsCountText) return;

        // Clear previous content safely without innerHTML
        dom.resultsCountText.textContent = '';

        if (total === 0) {
            dom.resultsCountText.appendChild(document.createTextNode('Showing '));
            const zeroElem = document.createElement('strong');
            zeroElem.textContent = '0';
            dom.resultsCountText.appendChild(zeroElem);
            dom.resultsCountText.appendChild(document.createTextNode(' problems'));
        } else {
            const start = (state.page - 1) * state.limit + 1;
            const end = start + count - 1;

            dom.resultsCountText.appendChild(document.createTextNode('Showing '));
            const rangeElem = document.createElement('strong');
            rangeElem.textContent = `${start}–${end}`;
            dom.resultsCountText.appendChild(rangeElem);

            dom.resultsCountText.appendChild(document.createTextNode(' of '));
            const totalElem = document.createElement('strong');
            totalElem.textContent = String(total);
            dom.resultsCountText.appendChild(totalElem);

            dom.resultsCountText.appendChild(document.createTextNode(' problems'));
        }
    }

    /**
     * Renders active filter tags with click-to-remove capability.
     */
    function renderActiveFilterChips() {
        if (!dom.activeFilterChips) return;
        dom.activeFilterChips.innerHTML = '';

        const activeFilters = [];

        if (state.search) {
            activeFilters.push({
                label: `Search: "${state.search}"`,
                clear: function () {
                    state.search = '';
                    if (dom.searchInput) dom.searchInput.value = '';
                    if (dom.searchClearBtn) dom.searchClearBtn.style.display = 'none';
                }
            });
        }

        if (state.difficulty !== 'All') {
            activeFilters.push({
                label: `Difficulty: ${state.difficulty}`,
                clear: function () {
                    state.difficulty = 'All';
                    if (dom.difficultyFilter) dom.difficultyFilter.value = 'All';
                }
            });
        }

        if (state.topic !== 'All') {
            activeFilters.push({
                label: `Topic: ${state.topic}`,
                clear: function () {
                    state.topic = 'All';
                    if (dom.topicFilter) dom.topicFilter.value = 'All';
                }
            });
        }

        if (state.sortBy !== 'default') {
            const sortLabels = {
                title: 'Title (A–Z)',
                difficulty: 'Difficulty',
                acceptance: 'Acceptance Rate'
            };
            activeFilters.push({
                label: `Sort: ${sortLabels[state.sortBy] || state.sortBy}`,
                clear: function () {
                    state.sortBy = 'default';
                    if (dom.sortBySelect) dom.sortBySelect.value = 'default';
                }
            });
        }

        activeFilters.forEach(function (filter) {
            const chip = document.createElement('span');
            chip.className = 'filter-chip';
            chip.innerHTML = `
                <span>${escapeHtml(filter.label)}</span>
                <button type="button" class="filter-chip-remove" title="Remove filter" aria-label="Remove filter">✕</button>
            `;
            chip.querySelector('.filter-chip-remove').addEventListener('click', function () {
                filter.clear();
                state.page = 1;
                loadProblems();
            });
            dom.activeFilterChips.appendChild(chip);
        });
    }

    /**
     * Renders interactive pagination buttons.
     */
    function renderPagination(data) {
        if (!dom.paginationBar || !dom.paginationNav || !dom.paginationInfo) return;

        const totalPages = data.totalPages || 1;
        const currentPage = data.page || 1;

        if (totalPages <= 1) {
            dom.paginationBar.style.display = 'none';
            return;
        }

        dom.paginationBar.style.display = 'flex';
        dom.paginationInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        dom.paginationNav.innerHTML = '';

        // Previous Button
        const prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.className = 'page-btn';
        prevBtn.textContent = '← Prev';
        prevBtn.disabled = currentPage <= 1;
        prevBtn.addEventListener('click', function () {
            if (state.page > 1) {
                state.page--;
                loadProblems();
                scrollToCatalogue();
            }
        });
        dom.paginationNav.appendChild(prevBtn);

        // Numeric Page Buttons
        for (let p = 1; p <= totalPages; p++) {
            const pageBtn = document.createElement('button');
            pageBtn.type = 'button';
            pageBtn.className = 'page-btn' + (p === currentPage ? ' active' : '');
            pageBtn.textContent = String(p);
            pageBtn.setAttribute('aria-label', `Go to page ${p}`);
            if (p === currentPage) {
                pageBtn.setAttribute('aria-current', 'page');
            }
            (function (pageNum) {
                pageBtn.addEventListener('click', function () {
                    if (state.page !== pageNum) {
                        state.page = pageNum;
                        loadProblems();
                        scrollToCatalogue();
                    }
                });
            })(p);
            dom.paginationNav.appendChild(pageBtn);
        }

        // Next Button
        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'page-btn';
        nextBtn.textContent = 'Next →';
        nextBtn.disabled = currentPage >= totalPages;
        nextBtn.addEventListener('click', function () {
            if (state.page < totalPages) {
                state.page++;
                loadProblems();
                scrollToCatalogue();
            }
        });
        dom.paginationNav.appendChild(nextBtn);
    }

    /**
     * Resets all search and filter controls to default state.
     */
    function clearAllFilters() {
        state.search = '';
        state.difficulty = 'All';
        state.topic = 'All';
        state.sortBy = 'default';
        state.page = 1;

        if (dom.searchInput) dom.searchInput.value = '';
        if (dom.searchClearBtn) dom.searchClearBtn.style.display = 'none';
        if (dom.difficultyFilter) dom.difficultyFilter.value = 'All';
        if (dom.topicFilter) dom.topicFilter.value = 'All';
        if (dom.sortBySelect) dom.sortBySelect.value = 'default';

        loadProblems();
    }

    /**
     * Toggles the loading spinner indicator.
     */
    function showLoading(loading) {
        if (dom.loadingState) {
            dom.loadingState.style.display = loading ? 'flex' : 'none';
        }
        if (loading) {
            if (dom.tableCard) dom.tableCard.style.opacity = '0.5';
        } else {
            if (dom.tableCard) dom.tableCard.style.opacity = '1';
        }
    }

    /**
     * Toggles empty state view when no problems match.
     */
    function showEmptyState(show, customMessage) {
        if (dom.emptyState) {
            dom.emptyState.style.display = show ? 'flex' : 'none';
            if (customMessage) {
                const msgEl = dom.emptyState.querySelector('.empty-state-message');
                if (msgEl) msgEl.textContent = customMessage;
            }
        }
        if (dom.tableCard) {
            dom.tableCard.style.display = show ? 'none' : 'block';
        }
    }

    /**
     * Smoothly scrolls to the top of the table on pagination.
     */
    function scrollToCatalogue() {
        if (dom.tableCard) {
            dom.tableCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    /**
     * Maps difficulty string to semantic CSS class.
     */
    function getDifficultyClass(difficulty) {
        const d = String(difficulty || '').toLowerCase();
        if (d === 'easy') return 'diff-easy';
        if (d === 'medium') return 'diff-medium';
        if (d === 'hard') return 'diff-hard';
        return 'diff-easy';
    }

    /**
     * Safe HTML escaping helper.
     */
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
     * Renders Recently Viewed Problems from localStorage (Phase 6)
     */
    function renderRecentlyViewed() {
        if (!dom.recentlyViewedSection || !dom.recentlyViewedGrid) return;

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
            dom.recentlyViewedSection.style.display = 'none';
            return;
        }

        dom.recentlyViewedSection.style.display = 'block';
        dom.recentlyViewedGrid.innerHTML = items.map(function (p) {
            const diffClass = getDifficultyClass(p.difficulty);
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
    }

    function initRecentlyViewed() {
        renderRecentlyViewed();
        if (dom.btnClearRecentlyViewed) {
            dom.btnClearRecentlyViewed.addEventListener('click', function () {
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

    /**
     * Initializes live search suggestions in the catalogue (Phase 6)
     */
    function initSearchSuggestions() {
        if (!dom.searchInput || !dom.searchSuggestions) return;

        let debounceTimer = null;
        let activeIdx = -1;
        let currentMatches = [];

        async function updateSuggestions(query) {
            const term = query.trim().toLowerCase();
            if (!term) {
                dom.searchSuggestions.style.display = 'none';
                return;
            }

            let allProblems = [];
            if (window.CodeArenaAPI && window.CodeArenaAPI.problemService) {
                const res = await window.CodeArenaAPI.problemService.getProblems({ limit: 100 });
                allProblems = (res && res.data) ? res.data : [];
            }

            currentMatches = allProblems.filter(function (p) {
                return (p.title || '').toLowerCase().includes(term) ||
                       (p.topic || '').toLowerCase().includes(term);
            }).slice(0, 5);

            if (currentMatches.length === 0) {
                dom.searchSuggestions.style.display = 'none';
                return;
            }

            dom.searchSuggestions.innerHTML = currentMatches.map(function (p, i) {
                return `
                    <div class="catalogue-suggestion-item" data-index="${i}">
                        <span>${escapeHtml(p.title)}</span>
                        <span class="diff-badge ${getDifficultyClass(p.difficulty)}" style="font-size: 0.7rem; padding: 2px 6px;">${escapeHtml(p.difficulty)}</span>
                    </div>
                `;
            }).join('');

            dom.searchSuggestions.style.display = 'block';

            dom.searchSuggestions.querySelectorAll('.catalogue-suggestion-item').forEach(function (el) {
                el.addEventListener('click', function () {
                    const idx = parseInt(this.getAttribute('data-index'), 10);
                    if (currentMatches[idx]) {
                        window.location.href = `problem.html?id=${encodeURIComponent(currentMatches[idx].id)}`;
                    }
                });
            });
        }

        dom.searchInput.addEventListener('input', function () {
            clearTimeout(debounceTimer);
            const val = this.value;
            debounceTimer = setTimeout(function () {
                updateSuggestions(val);
            }, 150);
        });

        document.addEventListener('click', function (e) {
            if (!dom.searchInput.contains(e.target) && !dom.searchSuggestions.contains(e.target)) {
                dom.searchSuggestions.style.display = 'none';
            }
        });
    }

})();
