# update_recently_viewed_and_drafts.py

# 1. Update problems.js
with open('frontend/js/problems.js', 'r', encoding='utf-8') as f:
    prob_js = f.read()

# Add recently viewed cache elements
old_cache = """            // Pagination
            paginationBar: document.getElementById('cataloguePaginationBar'),
            paginationInfo: document.getElementById('paginationInfo'),
            paginationNav: document.getElementById('paginationNav')
        };"""

new_cache = """            // Pagination
            paginationBar: document.getElementById('cataloguePaginationBar'),
            paginationInfo: document.getElementById('paginationInfo'),
            paginationNav: document.getElementById('paginationNav'),

            // Search Suggestions & Recently Viewed (Phase 6)
            searchSuggestions: document.getElementById('catalogueSearchSuggestions'),
            recentlyViewedSection: document.getElementById('recentlyViewedSection'),
            recentlyViewedGrid: document.getElementById('recentlyViewedGrid'),
            btnClearRecentlyViewed: document.getElementById('btnClearRecentlyViewed')
        };"""

if old_cache in prob_js:
    prob_js = prob_js.replace(old_cache, new_cache, 1)
    print("Updated cacheElements in problems.js")
else:
    print("Warning: old_cache not found in problems.js")

# Add recently viewed rendering and search suggestions to problems.js
rv_functions = """
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
"""

if 'renderRecentlyViewed()' not in prob_js:
    # insert before init function closing or at end
    idx = prob_js.rfind('})();')
    prob_js = prob_js[:idx] + rv_functions + "\n" + prob_js[idx:]
    print("Appended recently viewed & suggestions functions to problems.js")

# In init() of problems.js, call initRecentlyViewed() and initSearchSuggestions()
old_init = """        await loadTopics();
        await loadProblems();
    }"""
new_init = """        await loadTopics();
        await loadProblems();
        initRecentlyViewed();
        initSearchSuggestions();
    }"""

if old_init in prob_js:
    prob_js = prob_js.replace(old_init, new_init, 1)
    print("Updated init() in problems.js")
else:
    print("Warning: old_init not found in problems.js")

with open('frontend/js/problems.js', 'w', encoding='utf-8') as f:
    f.write(prob_js)

# 2. Update practice_hub.js
with open('frontend/js/practice_hub.js', 'r', encoding='utf-8') as f:
    hub_js = f.read()

practice_rv_functions = """
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
"""

if 'renderRecentlyViewed()' not in hub_js:
    idx = hub_js.rfind('})();')
    hub_js = hub_js[:idx] + practice_rv_functions + "\n" + hub_js[idx:]
    print("Appended recently viewed function to practice_hub.js")

old_hub_init = """        renderTopicGrid();
        renderRecommended();
        renderAllChallenges();
    }"""
new_hub_init = """        renderTopicGrid();
        renderRecommended();
        renderAllChallenges();
        renderRecentlyViewed();
    }"""

if old_hub_init in hub_js:
    hub_js = hub_js.replace(old_hub_init, new_hub_init, 1)
    print("Updated init() in practice_hub.js")
else:
    print("Warning: old_hub_init not found in practice_hub.js")

with open('frontend/js/practice_hub.js', 'w', encoding='utf-8') as f:
    f.write(hub_js)

print("Updated problems.js and practice_hub.js successfully")

