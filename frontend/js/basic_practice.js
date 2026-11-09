/**
 * CodeArena — Basic Practice Track Controller (basic_practice.js)
 * Manages category cards grid, catalogue filtering, search, pagination,
 * and direct links to basic problem workspaces.
 */

(function () {
    'use strict';

    const state = {
        category: 'All',
        difficulty: 'All',
        search: '',
        sort: 'number-asc',
        page: 1,
        limit: 12
    };

    let dom = {};

    function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function init() {
        cacheElements();
        parseUrlParams();
        populateCategoryDropdown();
        bindEvents();
        renderStats();
        renderCategoryCards();
        renderCatalogue();
    }

    function cacheElements() {
        dom = {
            categoriesGrid: document.getElementById('basicCategoriesGrid'),
            problemsContainer: document.getElementById('basicProblemsContainer'),
            searchInput: document.getElementById('basicSearchInput'),
            clearSearchBtn: document.getElementById('basicClearSearchBtn'),
            categorySelect: document.getElementById('basicCategorySelect'),
            diffTabs: document.querySelectorAll('.basic-diff-tab'),
            resultsCount: document.getElementById('basicResultsCount'),
            emptyState: document.getElementById('basicEmptyState'),
            paginationWrap: document.getElementById('basicPaginationWrap'),
            activeFilterBar: document.getElementById('basicActiveFilterBar'),
            lblActiveFilterName: document.getElementById('lblActiveFilterName'),
            btnResetCategoryFilter: document.getElementById('btnResetCategoryFilter'),
            btnResetBasicFilters: document.getElementById('btnResetBasicFilters'),
            statTotal: document.getElementById('statBasicTotal'),
            statCats: document.getElementById('statBasicCats'),
            statEasy: document.getElementById('statBasicEasy'),
            statMed: document.getElementById('statBasicMed')
        };
    }

    function parseUrlParams() {
        try {
            const params = new URLSearchParams(window.location.search);
            const cat = params.get('category');
            if (cat) state.category = cat;
            const diff = params.get('difficulty');
            if (diff) state.difficulty = diff;
            const q = params.get('q') || params.get('search');
            if (q) state.search = q;
        } catch (e) {
            console.warn('URL parsing error:', e);
        }
    }

    function bindEvents() {
        if (dom.searchInput) {
            dom.searchInput.addEventListener('input', function (e) {
                state.search = e.target.value;
                state.page = 1;
                renderCatalogue();
            });
        }

        if (dom.clearSearchBtn) {
            dom.clearSearchBtn.addEventListener('click', function () {
                if (dom.searchInput) dom.searchInput.value = '';
                state.search = '';
                state.page = 1;
                renderCatalogue();
            });
        }

        if (dom.categorySelect) {
            dom.categorySelect.addEventListener('change', function (e) {
                selectCategory(e.target.value);
            });
        }

        if (dom.diffTabs) {
            dom.diffTabs.forEach(btn => {
                btn.addEventListener('click', function () {
                    dom.diffTabs.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    state.difficulty = btn.getAttribute('data-diff') || 'All';
                    state.page = 1;
                    renderCatalogue();
                });
            });
        }

        if (dom.btnResetCategoryFilter) {
            dom.btnResetCategoryFilter.addEventListener('click', function () {
                selectCategory('All');
            });
        }

        if (dom.btnResetBasicFilters) {
            dom.btnResetBasicFilters.addEventListener('click', function () {
                state.category = 'All';
                state.difficulty = 'All';
                state.search = '';
                state.page = 1;
                if (dom.searchInput) dom.searchInput.value = '';
                if (dom.categorySelect) dom.categorySelect.value = 'All';
                dom.diffTabs.forEach(b => {
                    if (b.getAttribute('data-diff') === 'All') b.classList.add('active');
                    else b.classList.remove('active');
                });
                renderCategoryCards();
                renderCatalogue();
            });
        }
    }

    function selectCategory(categoryName, shouldScroll = false) {
        state.category = categoryName;
        state.page = 1;

        if (dom.categorySelect) {
            dom.categorySelect.value = categoryName;
        }

        // Highlight category card
        document.querySelectorAll('.basic-cat-card').forEach(card => {
            const cat = card.getAttribute('data-category');
            if (cat && cat.toLowerCase() === categoryName.toLowerCase()) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        renderCatalogue();

        if (shouldScroll) {
            const anchor = document.getElementById('catalogueAnchor');
            if (anchor) {
                anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    function renderStats() {
        if (!window.CodeArenaBasicPractice) return;
        const stats = window.CodeArenaBasicPractice.getStats();
        if (dom.statTotal) dom.statTotal.textContent = stats.totalProblems;
        if (dom.statCats) dom.statCats.textContent = stats.totalCategories;
        if (dom.statEasy) dom.statEasy.textContent = stats.easyCount;
        if (dom.statMed) dom.statMed.textContent = stats.mediumCount;
    }

    function populateCategoryDropdown() {
        if (!dom.categorySelect || !window.CodeArenaBasicPractice) return;
        const categories = window.CodeArenaBasicPractice.getCategories();
        let optionsHtml = '<option value="All">All Categories (13)</option>';
        categories.forEach(c => {
            optionsHtml += `<option value="${escapeHtml(c.name)}">${escapeHtml(c.name)} (${c.problemCount})</option>`;
        });
        dom.categorySelect.innerHTML = optionsHtml;
        if (state.category !== 'All') {
            dom.categorySelect.value = state.category;
        }
    }

    const CATEGORY_SVGS = {
        'fundamentals': '<svg class="cat-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',
        'io': '<svg class="cat-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="6" y1="8" x2="6.01" y2="8"></line><line x1="10" y1="8" x2="10.01" y2="8"></line><line x1="14" y1="8" x2="14.01" y2="8"></line><line x1="18" y1="8" x2="18.01" y2="8"></line><line x1="8" y1="12" x2="8.01" y2="12"></line><line x1="12" y1="12" x2="12.01" y2="12"></line><line x1="16" y1="12" x2="16.01" y2="12"></line><line x1="7" y1="16" x2="17" y2="16"></line></svg>',
        'operators': '<svg class="cat-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="18"></line><line x1="16" y1="10" x2="16" y2="10.01"></line><line x1="12" y1="10" x2="12" y2="10.01"></line><line x1="8" y1="10" x2="8" y2="10.01"></line><line x1="12" y1="14" x2="12" y2="14.01"></line><line x1="8" y1="14" x2="8" y2="14.01"></line><line x1="12" y1="18" x2="12" y2="18.01"></line><line x1="8" y1="18" x2="8" y2="18.01"></line></svg>',
        'conditionals': '<svg class="cat-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>',
        'loops': '<svg class="cat-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>',
        'numbers': '<svg class="cat-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>',
        'patterns': '<svg class="cat-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
        'arrays': '<svg class="cat-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
        'strings': '<svg class="cat-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>',
        'methods-recursion': '<svg class="cat-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M6 21V9a9 9 0 0 0 9 9"></path></svg>',
        'oop': '<svg class="cat-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>',
        'exceptions': '<svg class="cat-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
        'collections': '<svg class="cat-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>'
    };

    function getCategorySvg(id, name) {
        if (id && CATEGORY_SVGS[id]) return CATEGORY_SVGS[id];
        // Fallback by name lookup
        const key = String(name || '').toLowerCase();
        if (key.includes('fundamental')) return CATEGORY_SVGS['fundamentals'];
        if (key.includes('input') || key.includes('output') || key.includes('io')) return CATEGORY_SVGS['io'];
        if (key.includes('operator')) return CATEGORY_SVGS['operators'];
        if (key.includes('conditional')) return CATEGORY_SVGS['conditionals'];
        if (key.includes('loop')) return CATEGORY_SVGS['loops'];
        if (key.includes('number')) return CATEGORY_SVGS['numbers'];
        if (key.includes('pattern')) return CATEGORY_SVGS['patterns'];
        if (key.includes('array')) return CATEGORY_SVGS['arrays'];
        if (key.includes('string')) return CATEGORY_SVGS['strings'];
        if (key.includes('method') || key.includes('recursion')) return CATEGORY_SVGS['methods-recursion'];
        if (key.includes('object') || key.includes('oop')) return CATEGORY_SVGS['oop'];
        if (key.includes('exception')) return CATEGORY_SVGS['exceptions'];
        if (key.includes('collection')) return CATEGORY_SVGS['collections'];
        return CATEGORY_SVGS['fundamentals'];
    }

    function renderCategoryCards() {
        if (!dom.categoriesGrid || !window.CodeArenaBasicPractice) return;
        const categories = window.CodeArenaBasicPractice.getCategories();

        dom.categoriesGrid.innerHTML = categories.map(cat => {
            const isActive = state.category.toLowerCase() === cat.name.toLowerCase();
            const total = cat.problemCount || 1;
            const easyPct = Math.round(((cat.difficultyDist.easy || 0) / total) * 100);
            const medPct = Math.round(((cat.difficultyDist.medium || 0) / total) * 100);
            const hardPct = Math.round(((cat.difficultyDist.hard || 0) / total) * 100);
            const svgIcon = getCategorySvg(cat.id, cat.name);

            return `
                <div class="basic-cat-card ${isActive ? 'active' : ''}" data-category="${escapeHtml(cat.name)}" role="button" tabindex="0">
                    <div class="basic-cat-header">
                        <span class="basic-cat-icon" aria-hidden="true">${svgIcon}</span>
                        <span class="basic-cat-count">${cat.problemCount} ${cat.problemCount === 1 ? 'Challenge' : 'Challenges'}</span>
                    </div>
                    <h3 class="basic-cat-title">${escapeHtml(cat.name)}</h3>
                    <p class="basic-cat-desc">${escapeHtml(cat.description)}</p>
                    <div class="basic-cat-diff-bars" title="Difficulty breakdown: ${cat.difficultyDist.easy} Easy, ${cat.difficultyDist.medium} Medium, ${cat.difficultyDist.hard} Hard">
                        <div class="cat-diff-bar easy" style="width: ${easyPct}%;"></div>
                        <div class="cat-diff-bar medium" style="width: ${medPct}%;"></div>
                        <div class="cat-diff-bar hard" style="width: ${hardPct}%;"></div>
                    </div>
                </div>
            `;
        }).join('');

        // Bind click on category cards
        dom.categoriesGrid.querySelectorAll('.basic-cat-card').forEach(card => {
            card.addEventListener('click', function () {
                const catName = this.getAttribute('data-category');
                selectCategory(catName, true);
            });
            card.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const catName = this.getAttribute('data-category');
                    selectCategory(catName, true);
                }
            });
        });
    }

    function renderCatalogue() {
        if (!dom.problemsContainer || !window.CodeArenaBasicPractice) return;

        const res = window.CodeArenaBasicPractice.getProblems({
            category: state.category,
            difficulty: state.difficulty,
            search: state.search,
            sort: state.sort,
            page: state.page,
            limit: state.limit
        });

        // Update Results Count
        if (dom.resultsCount) {
            dom.resultsCount.textContent = `Showing ${res.problems.length} of ${res.total} challenges`;
        }

        // Active Filter Bar
        if (dom.activeFilterBar) {
            if (state.category !== 'All') {
                dom.activeFilterBar.style.display = 'block';
                if (dom.lblActiveFilterName) dom.lblActiveFilterName.textContent = state.category;
            } else {
                dom.activeFilterBar.style.display = 'none';
            }
        }

        // Empty State handling
        if (res.total === 0) {
            dom.problemsContainer.style.display = 'none';
            if (dom.emptyState) dom.emptyState.style.display = 'block';
            if (dom.paginationWrap) dom.paginationWrap.style.display = 'none';
            return;
        }

        dom.problemsContainer.style.display = 'flex';
        if (dom.emptyState) dom.emptyState.style.display = 'none';
        if (dom.paginationWrap) dom.paginationWrap.style.display = 'flex';

        // Render Problems List
        dom.problemsContainer.innerHTML = res.problems.map(p => {
            const diffClass = `diff-${p.difficulty.toLowerCase()}`;
            const numStr = String(p.number).padStart(2, '0');

            let statusPill = '';
            if (p.status === 'solved') {
                statusPill = '<span class="status-badge status-solved" style="display: inline-flex; align-items: center; gap: 4px; color: #34D399; font-size: 0.74rem; font-weight: 700;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg> Solved</span>';
            } else if (p.status === 'attempted') {
                statusPill = '<span class="status-badge status-attempted" style="display: inline-flex; align-items: center; gap: 4px; color: #60A5FA; font-size: 0.74rem; font-weight: 700;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> Attempted</span>';
            }

            return `
                <div class="basic-problem-item">
                    <span class="basic-prob-num">#${numStr}</span>
                    <div class="basic-prob-info">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <a href="basic-problem.html?id=${encodeURIComponent(p.id)}" class="basic-prob-title">${escapeHtml(p.title)}</a>
                            ${statusPill}
                        </div>
                        <p class="basic-prob-desc">${escapeHtml(p.description.replace(/<[^>]+>/g, ''))}</p>
                    </div>
                    <span class="basic-prob-category">${escapeHtml(p.category)}</span>
                    <span class="basic-prob-diff-badge ${diffClass}">${escapeHtml(p.difficulty)}</span>
                    <a href="basic-problem.html?id=${encodeURIComponent(p.id)}" class="basic-btn-solve">
                        <span>Open Problem</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </a>
                </div>
            `;
        }).join('');

        renderPagination(res.page, res.totalPages);
    }

    function renderPagination(curPage, totalPages) {
        if (!dom.paginationWrap) return;
        if (totalPages <= 1) {
            dom.paginationWrap.innerHTML = '';
            return;
        }

        let buttonsHtml = '';
        buttonsHtml += `
            <button type="button" class="secondary-header-btn btn-pag" data-page="${curPage - 1}" ${curPage === 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                ← Previous
            </button>
        `;

        for (let i = 1; i <= totalPages; i++) {
            const isCur = i === curPage;
            buttonsHtml += `
                <button type="button" class="secondary-header-btn btn-pag ${isCur ? 'active' : ''}" data-page="${i}" style="${isCur ? 'background: var(--color-primary); color: #FFF; font-weight: 800;' : ''}">
                    ${i}
                </button>
            `;
        }

        buttonsHtml += `
            <button type="button" class="secondary-header-btn btn-pag" data-page="${curPage + 1}" ${curPage === totalPages ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                Next →
            </button>
        `;

        dom.paginationWrap.innerHTML = buttonsHtml;

        dom.paginationWrap.querySelectorAll('.btn-pag').forEach(btn => {
            btn.addEventListener('click', function () {
                const targetPage = parseInt(this.getAttribute('data-page'), 10);
                if (targetPage >= 1 && targetPage <= totalPages && targetPage !== curPage) {
                    state.page = targetPage;
                    renderCatalogue();
                    const anchor = document.getElementById('catalogueAnchor');
                    if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

