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
        pattern: 'All',
        access: 'All',
        sortBy: 'default',
        page: 1,
        limit: 8
    };

    // DOM Elements Cache
    let dom = {};

    /**
     * Initializes the problem catalogue once the DOM is loaded.
     */
    async function init() {
        cacheElements();
        bindEvents();

        // Read query parameters for deep linking
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('search')) {
            state.search = urlParams.get('search');
            if (dom.searchInput) dom.searchInput.value = state.search;
            if (dom.searchClearBtn) dom.searchClearBtn.style.display = 'block';
        }
        if (urlParams.has('difficulty')) {
            state.difficulty = urlParams.get('difficulty');
            if (dom.difficultyFilter) dom.difficultyFilter.value = state.difficulty;
        }
        if (urlParams.has('topic')) {
            state.topic = urlParams.get('topic');
        }
        if (urlParams.has('pattern')) {
            state.pattern = urlParams.get('pattern');
        }
        if (urlParams.has('access')) {
            state.access = urlParams.get('access');
            if (dom.accessFilter) dom.accessFilter.value = state.access;
        }

        await loadTopics();
        await loadPatterns(state.topic);
        await loadProblems();
        initRecentlyViewed();
        initSearchSuggestions();
        updateHeroStats();

        if (urlParams.has('upgrade') || urlParams.has('modal')) {
            setTimeout(function () {
                openSubscriptionModal({
                    id: 'alien-dictionary',
                    title: 'Alien Dictionary',
                    difficulty: 'Hard',
                    topic: 'Graphs',
                    pattern: 'Topological Sort'
                });
            }, 100);
        }
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
            patternFilter: document.getElementById('patternFilter'),
            accessFilter: document.getElementById('accessFilter'),
            sortBySelect: document.getElementById('sortBySelect'),
            clearFiltersBtn: document.getElementById('clearFiltersBtn'),
            heroTotalProblems: document.getElementById('heroTotalProblems'),
            heroFreeProblems: document.getElementById('heroFreeProblems'),
            heroPremiumProblems: document.getElementById('heroPremiumProblems'),
            heroTotalTopics: document.getElementById('heroTotalTopics'),
            heroTotalPatterns: document.getElementById('heroTotalPatterns'),

            // Subscription Modal
            subModal: document.getElementById('subscriptionModalOverlay'),
            closeSubModalBtn: document.getElementById('btnCloseSubModal'),
            subModalPreviewTitle: document.getElementById('subModalPreviewTitle'),
            subModalPreviewDiff: document.getElementById('subModalPreviewDiff'),
            subModalPreviewTopic: document.getElementById('subModalPreviewTopic'),
            btnSelectMonthly: document.getElementById('btnSelectMonthly'),
            btnSelectAnnual: document.getElementById('btnSelectAnnual'),

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
                        if (topic === state.topic) opt.selected = true;
                        dom.topicFilter.appendChild(opt);
                    });
                    if (state.topic !== 'All') dom.topicFilter.value = state.topic;
                }
            }
        } catch (err) {
            console.error('[CodeArena Catalogue] Failed to load topics:', err);
        }
    }

    /**
     * Populates algorithmic patterns dynamically based on selected topic.
     */
    async function loadPatterns(selectedTopic) {
        if (!dom.patternFilter) return;

        try {
            if (window.CodeArenaAPI && window.CodeArenaAPI.problemService && window.CodeArenaAPI.problemService.getPatterns) {
                const res = await window.CodeArenaAPI.problemService.getPatterns(selectedTopic || 'All');
                if (res.success && Array.isArray(res.data)) {
                    dom.patternFilter.innerHTML = '<option value="All">All Patterns</option>';
                    res.data.forEach(function (pattern) {
                        const opt = document.createElement('option');
                        opt.value = pattern;
                        opt.textContent = pattern;
                        if (pattern === state.pattern) opt.selected = true;
                        dom.patternFilter.appendChild(opt);
                    });
                    // If current state pattern is not available in new list, reset to All
                    if (state.pattern !== 'All' && !res.data.includes(state.pattern)) {
                        state.pattern = 'All';
                        dom.patternFilter.value = 'All';
                    }
                }
            }
        } catch (err) {
            console.error('[CodeArena Catalogue] Failed to load patterns:', err);
        }
    }

    /**
     * Updates hero header statistic counters dynamically from canonical data.
     */
    async function updateHeroStats() {
        try {
            if (window.CodeArenaAPI && window.CodeArenaAPI.problemService && window.CodeArenaAPI.problemService.getStats) {
                const sRes = await window.CodeArenaAPI.problemService.getStats();
                if (sRes.success && sRes.data) {
                    const st = sRes.data;
                    if (dom.heroTotalProblems) dom.heroTotalProblems.textContent = String(st.totalProblems || 200);
                    if (dom.heroFreeProblems) dom.heroFreeProblems.textContent = String(st.freeProblems || 150);
                    if (dom.heroPremiumProblems) dom.heroPremiumProblems.textContent = String(st.premiumProblems || 50);
                    if (dom.heroTotalTopics) dom.heroTotalTopics.textContent = String(st.topicsCount || 12);
                    if (dom.heroTotalPatterns) dom.heroTotalPatterns.textContent = String(st.patternsCount || 63);
                    return;
                }
            }
        } catch (err) {}
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

        // Topic Filter (dynamically reloads pattern options)
        if (dom.topicFilter) {
            dom.topicFilter.addEventListener('change', async function () {
                state.topic = dom.topicFilter.value;
                state.pattern = 'All';
                state.page = 1;
                await loadPatterns(state.topic);
                loadProblems();
            });
        }

        // Pattern Filter
        if (dom.patternFilter) {
            dom.patternFilter.addEventListener('change', function () {
                state.pattern = dom.patternFilter.value;
                state.page = 1;
                loadProblems();
            });
        }

        // Access Filter (All, Free, Premium)
        if (dom.accessFilter) {
            dom.accessFilter.addEventListener('change', function () {
                state.access = dom.accessFilter.value;
                state.page = 1;
                loadProblems();
            });
        }

        // Subscription Modal actions
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
            dom.btnSelectMonthly.addEventListener('click', function () {
                activatePlanAndRefresh('monthly');
            });
        }
        if (dom.btnSelectAnnual) {
            dom.btnSelectAnnual.addEventListener('click', function () {
                activatePlanAndRefresh('annual');
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
            if (state.pattern !== 'All') params.pattern = state.pattern;
            if (state.access !== 'All') params.access = state.access;
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

            const isPro = Boolean(problem.isPremium);
            const userIsPro = Boolean(
                window.CodeArenaAPI &&
                window.CodeArenaAPI.subscriptionService &&
                window.CodeArenaAPI.subscriptionService.isPremium()
            );
            const isLocked = isPro && !userIsPro;

            const accessBadgeHtml = isPro
                ? `<span class="badge-pro" title="CodeArena Pro Challenge">PRO</span>`
                : `<span class="badge-free" title="Free Community Challenge">FREE</span>`;

            const lockIconHtml = isLocked
                ? `<span class="pro-lock-icon" title="CodeArena Pro Subscription Required" aria-label="Locked">🔒</span>`
                : '';

            const solveLabel = isLocked ? '🔒 Unlock Pro' : 'Solve →';
            const solveTitle = isLocked ? `Unlock Pro Challenge: ${escapeHtml(problem.title)}` : `Solve ${escapeHtml(problem.title)}`;

            tr.innerHTML = `
                <td class="col-num">${rowNumber}</td>
                <td class="col-title">
                    <div class="problem-title-cell">
                        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                            ${lockIconHtml}
                            <a href="problem.html?id=${encodeURIComponent(problem.id)}" class="problem-link-title ${isLocked ? 'link-locked' : ''}" data-id="${escapeHtml(problem.id)}" title="${solveTitle}">
                                <span>${escapeHtml(problem.title)}</span>
                            </a>
                            ${accessBadgeHtml}
                            ${bookmarkIconHtml}
                        </div>
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
                    <button type="button" class="btn-solve-problem ${isLocked ? 'btn-solve-locked' : ''}" data-id="${escapeHtml(problem.id)}" title="${solveTitle}">
                        <span>${solveLabel}</span>
                    </button>
                </td>
            `;

            // Attach click interceptors for locked problems
            const solveBtn = tr.querySelector('.btn-solve-problem');
            const linkTitle = tr.querySelector('.problem-link-title');

            function handleProblemClick(e) {
                if (isLocked) {
                    e.preventDefault();
                    e.stopPropagation();
                    openSubscriptionModal(problem);
                } else {
                    window.location.href = `problem.html?id=${encodeURIComponent(problem.id)}`;
                }
            }

            if (solveBtn) solveBtn.addEventListener('click', handleProblemClick);
            if (linkTitle) linkTitle.addEventListener('click', handleProblemClick);

            dom.tableBody.appendChild(tr);
        });
    }

    let pendingModalProblem = null;

    /**
     * Opens the subscription upgrade modal for locked premium challenges.
     */
    function openSubscriptionModal(problem) {
        pendingModalProblem = problem || null;
        if (problem) {
            if (dom.subModalPreviewTitle) dom.subModalPreviewTitle.textContent = problem.title || 'Premium Challenge';
            if (dom.subModalPreviewDiff) {
                dom.subModalPreviewDiff.textContent = problem.difficulty || 'Hard';
                dom.subModalPreviewDiff.className = `diff-badge ${getDifficultyClass(problem.difficulty)}`;
            }
            if (dom.subModalPreviewTopic) dom.subModalPreviewTopic.textContent = `${problem.topic || 'Advanced DSA'}${problem.pattern ? ' • ' + problem.pattern : ''}`;
        }
        if (dom.subModal) {
            dom.subModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Closes the subscription upgrade modal.
     */
    function closeSubscriptionModal() {
        if (dom.subModal) {
            dom.subModal.style.display = 'none';
            document.body.style.overflow = '';
        }
        pendingModalProblem = null;
    }

    /**
     * Activates the selected preview membership plan and reloads the problem list.
     */
    function activatePlanAndRefresh(planId) {
        if (window.CodeArenaAPI && window.CodeArenaAPI.subscriptionService) {
            window.CodeArenaAPI.subscriptionService.upgradePlan(planId);
            if (window.CodeArenaAPI.authService && !window.CodeArenaAPI.authService.isAuthenticated()) {
                window.CodeArenaAPI.authService.demoLogin(planId);
            }
            if (window.CodeArenaToast && typeof window.CodeArenaToast.success === 'function') {
                window.CodeArenaToast.success(`Activated ${planId === 'annual' ? 'Pro Annual ($199/yr)' : 'Pro Monthly ($5/mo)'} preview membership!`);
            }
            const targetProb = pendingModalProblem;
            closeSubscriptionModal();
            loadProblems();
            if (targetProb) {
                setTimeout(function () {
                    window.location.href = `problem.html?id=${encodeURIComponent(targetProb.id || targetProb.slug)}`;
                }, 350);
            }
        }
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
                clear: async function () {
                    state.topic = 'All';
                    if (dom.topicFilter) dom.topicFilter.value = 'All';
                    await loadPatterns('All');
                }
            });
        }

        if (state.pattern !== 'All') {
            activeFilters.push({
                label: `Pattern: ${state.pattern}`,
                clear: function () {
                    state.pattern = 'All';
                    if (dom.patternFilter) dom.patternFilter.value = 'All';
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

        // Numeric Page Buttons with smart windowing for larger collections
        const pagesToRender = [];
        if (totalPages <= 7) {
            for (let p = 1; p <= totalPages; p++) pagesToRender.push(p);
        } else {
            pagesToRender.push(1);
            if (currentPage > 3) pagesToRender.push('...');
            const startWindow = Math.max(2, currentPage - 1);
            const endWindow = Math.min(totalPages - 1, currentPage + 1);
            for (let p = startWindow; p <= endWindow; p++) {
                if (!pagesToRender.includes(p)) pagesToRender.push(p);
            }
            if (currentPage < totalPages - 2) pagesToRender.push('...');
            if (!pagesToRender.includes(totalPages)) pagesToRender.push(totalPages);
        }

        pagesToRender.forEach(function (item) {
            if (item === '...') {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '…';
                ellipsis.style.padding = '0 6px';
                ellipsis.style.color = 'var(--color-text-muted)';
                dom.paginationNav.appendChild(ellipsis);
            } else {
                const p = item;
                const pageBtn = document.createElement('button');
                pageBtn.type = 'button';
                pageBtn.className = 'page-btn' + (p === currentPage ? ' active' : '');
                pageBtn.textContent = String(p);
                pageBtn.setAttribute('aria-label', `Go to page ${p}`);
                if (p === currentPage) {
                    pageBtn.setAttribute('aria-current', 'page');
                }
                pageBtn.addEventListener('click', function () {
                    if (state.page !== p) {
                        state.page = p;
                        loadProblems();
                        scrollToCatalogue();
                    }
                });
                dom.paginationNav.appendChild(pageBtn);
            }
        });

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

        state.pattern = 'All';

        if (dom.searchInput) dom.searchInput.value = '';
        if (dom.searchClearBtn) dom.searchClearBtn.style.display = 'none';
        if (dom.difficultyFilter) dom.difficultyFilter.value = 'All';
        if (dom.topicFilter) dom.topicFilter.value = 'All';
        if (dom.patternFilter) dom.patternFilter.value = 'All';
        if (dom.sortBySelect) dom.sortBySelect.value = 'default';

        loadPatterns('All');
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
