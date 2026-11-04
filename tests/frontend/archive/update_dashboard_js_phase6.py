# update_dashboard_js_phase6.py

with open('frontend/js/dashboard.js', 'r', encoding='utf-8') as f:
    code = f.read()

old_section = """    // --------------------------------------------------------------------------
    // 5. Notification Popover Toggle (Honest Non-Fabricated State)
    // --------------------------------------------------------------------------
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationPopover = document.getElementById('notificationPopover');

    if (notificationBtn && notificationPopover) {
        notificationBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const isVisible = notificationPopover.style.display === 'block';
            notificationPopover.style.display = isVisible ? 'none' : 'block';
            notificationBtn.setAttribute('aria-expanded', isVisible ? 'false' : 'true');
        });

        document.addEventListener('click', function (e) {
            if (!notificationBtn.contains(e.target) && !notificationPopover.contains(e.target)) {
                notificationPopover.style.display = 'none';
                notificationBtn.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && notificationPopover.style.display === 'block') {
                notificationPopover.style.display = 'none';
                notificationBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --------------------------------------------------------------------------
    // 6. Search Input Feedback (Informs user of Phase 3 search indexing)
    // --------------------------------------------------------------------------
    const dashSearchInput = document.getElementById('dashSearchInput');
    const searchFeedbackPopover = document.getElementById('searchFeedbackPopover');

    if (dashSearchInput && searchFeedbackPopover) {
        let searchTimer = null;

        function showSearchNotice() {
            searchFeedbackPopover.style.display = 'block';
            clearTimeout(searchTimer);
            searchTimer = setTimeout(function () {
                searchFeedbackPopover.style.display = 'none';
            }, 4000);
        }

        dashSearchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                showSearchNotice();
            }
        });

        document.addEventListener('click', function (e) {
            if (!dashSearchInput.contains(e.target) && !searchFeedbackPopover.contains(e.target)) {
                searchFeedbackPopover.style.display = 'none';
            }
        });
    }
});"""

new_section = """    // --------------------------------------------------------------------------
    // 5. Notification Popover Interactions (Phase 6 Enhanced)
    // --------------------------------------------------------------------------
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationPopover = document.getElementById('notificationPopover');
    const notifBadge = document.getElementById('notifBadge');
    const notifHeaderTag = document.getElementById('notifHeaderTag');
    const btnMarkNotifsRead = document.getElementById('btnMarkNotifsRead');
    const notifTabBtns = document.querySelectorAll('.notif-tab-btn');
    const notifItems = document.querySelectorAll('.notif-item');

    if (notificationBtn && notificationPopover) {
        notificationBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const isVisible = notificationPopover.style.display === 'block';
            notificationPopover.style.display = isVisible ? 'none' : 'block';
            notificationBtn.setAttribute('aria-expanded', isVisible ? 'false' : 'true');
        });

        // Tab switching
        if (notifTabBtns) {
            notifTabBtns.forEach(function (tab) {
                tab.addEventListener('click', function () {
                    notifTabBtns.forEach(function (t) { t.classList.remove('active'); });
                    this.classList.add('active');
                    const category = this.getAttribute('data-tab');

                    notifItems.forEach(function (item) {
                        if (category === 'all' || item.getAttribute('data-category') === category) {
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                });
            });
        }

        // Mark all as read
        if (btnMarkNotifsRead) {
            btnMarkNotifsRead.addEventListener('click', function () {
                notifItems.forEach(function (item) {
                    item.classList.remove('unread');
                });
                if (notifBadge) notifBadge.style.display = 'none';
                if (notifHeaderTag) notifHeaderTag.textContent = '0 new';
                if (window.CodeArenaToast) {
                    window.CodeArenaToast.info('All notifications marked as read');
                }
            });
        }

        document.addEventListener('click', function (e) {
            if (!notificationBtn.contains(e.target) && !notificationPopover.contains(e.target)) {
                notificationPopover.style.display = 'none';
                notificationBtn.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && notificationPopover.style.display === 'block') {
                notificationPopover.style.display = 'none';
                notificationBtn.setAttribute('aria-expanded', 'false');
                notificationBtn.focus();
            }
        });
    }

    // --------------------------------------------------------------------------
    // 6. Global Search Suggestions & Keyboard Navigation (Phase 6)
    // --------------------------------------------------------------------------
    const dashSearchInput = document.getElementById('dashSearchInput');
    const dashSearchSuggestions = document.getElementById('dashSearchSuggestions');
    const searchFeedbackPopover = document.getElementById('searchFeedbackPopover');

    // Built-in Platform Pages Index
    const platformPages = [
        { title: 'Online Java Compiler', category: 'Tool', url: 'compiler.html', desc: 'In-browser Java editor, syntax runner & diagnostics', badge: 'Tool' },
        { title: 'Problem Catalogue', category: 'Practice', url: 'problems.html', desc: 'Browse all 12 canonical Java algorithm problems', badge: 'Practice' },
        { title: 'Practice Problem Hub', category: 'Practice', url: 'practice.html', desc: 'Topic-based challenge tracks and starter problems', badge: 'Practice' },
        { title: 'Java Learning Centre', category: 'Learn', url: 'learn.html', desc: '14 interactive lessons, JVM architecture & quizzes', badge: 'Learn' },
        { title: 'AI Learning Assistant', category: 'Mentor', url: 'ai_assistant.html', desc: 'Simulated AI guidance, Java concepts & explanations', badge: 'AI' },
        { title: 'Coding Contests', category: 'Competitions', url: 'contests.html', desc: 'Scheduled Java tournaments and leaderboards', badge: 'Contest' },
        { title: 'Learning Progress & Analytics', category: 'Analytics', url: 'progress.html', desc: 'Activity heatmap, solve streaks & distribution', badge: 'Progress' },
        { title: 'Bookmarked Problems', category: 'Saved', url: 'bookmarks.html', desc: 'Quickly access your saved Java challenges', badge: 'Bookmarks' },
        { title: 'My Submissions', category: 'History', url: 'submissions.html', desc: 'Inspect past code submissions and review verdicts', badge: 'History' },
        { title: 'Settings & Editor Preferences', category: 'Preferences', url: 'settings.html', desc: 'Configure theme, font size, tabs & density', badge: 'Settings' }
    ];

    if (dashSearchInput && dashSearchSuggestions) {
        let activeIndex = -1;
        let currentSuggestions = [];

        function getCanonicalProblems() {
            try {
                if (window.CodeArenaAPI && window.CodeArenaAPI.problemService) {
                    return window.CodeArenaAPI.problemService.getProblems() || [];
                }
            } catch (err) {
                console.warn('Unable to query problemService:', err);
            }
            return [];
        }

        function queryIndex(keyword) {
            const term = keyword.trim().toLowerCase();
            if (!term) return [];

            const results = [];
            const problems = getCanonicalProblems();

            // Match problems
            problems.forEach(function (p) {
                const titleMatch = (p.title || '').toLowerCase().includes(term);
                const topicMatch = (p.topic || '').toLowerCase().includes(term);
                const diffMatch = (p.difficulty || '').toLowerCase() === term;
                const descMatch = (p.description || '').toLowerCase().includes(term);

                if (titleMatch || topicMatch || diffMatch || descMatch) {
                    results.push({
                        type: 'problem',
                        title: p.title,
                        desc: `${p.topic} • ${p.difficulty}`,
                        url: `problem.html?id=${encodeURIComponent(p.id)}`,
                        badge: p.difficulty,
                        badgeClass: `search-badge-${(p.difficulty || 'easy').toLowerCase()}`
                    });
                }
            });

            // Match pages
            platformPages.forEach(function (pg) {
                const titleMatch = pg.title.toLowerCase().includes(term);
                const descMatch = pg.desc.toLowerCase().includes(term);
                const catMatch = pg.category.toLowerCase().includes(term);

                if (titleMatch || descMatch || catMatch) {
                    results.push({
                        type: 'page',
                        title: pg.title,
                        desc: pg.desc,
                        url: pg.url,
                        badge: pg.badge,
                        badgeClass: 'search-badge-page'
                    });
                }
            });

            return results.slice(0, 8); // Top 8 matches
        }

        function renderSuggestions(items, query) {
            currentSuggestions = items;
            activeIndex = -1;

            if (items.length === 0) {
                dashSearchSuggestions.innerHTML = `
                    <div class="search-empty-state">
                        <div>No matching problems or pages found for "<strong>${escapeHtml(query)}</strong>"</div>
                        <a href="problems.html" class="search-empty-link">Browse Problem Catalogue &rarr;</a>
                    </div>
                `;
                dashSearchSuggestions.style.display = 'block';
                return;
            }

            dashSearchSuggestions.innerHTML = items.map(function (item, idx) {
                return `
                    <div class="search-suggestion-item" data-index="${idx}" role="option" tabindex="-1">
                        <div class="search-suggestion-left">
                            <div class="search-suggestion-icon" aria-hidden="true">
                                ${item.type === 'problem' 
                                    ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>'
                                    : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="12 8 8 12 12 16 12 8"/></svg>'}
                            </div>
                            <div class="search-suggestion-info">
                                <div class="search-suggestion-title">${escapeHtml(item.title)}</div>
                                <div class="search-suggestion-desc">${escapeHtml(item.desc)}</div>
                            </div>
                        </div>
                        <span class="search-suggestion-badge ${item.badgeClass}">${escapeHtml(item.badge)}</span>
                    </div>
                `;
            }).join('');

            dashSearchSuggestions.style.display = 'block';

            // Bind click handlers to suggestion items
            const itemEls = dashSearchSuggestions.querySelectorAll('.search-suggestion-item');
            itemEls.forEach(function (el) {
                el.addEventListener('click', function () {
                    const idx = parseInt(this.getAttribute('data-index'), 10);
                    navigateToSuggestion(idx);
                });
            });
        }

        function navigateToSuggestion(index) {
            if (index >= 0 && index < currentSuggestions.length) {
                const target = currentSuggestions[index];
                window.location.href = target.url;
            }
        }

        function updateActiveSuggestion() {
            const itemEls = dashSearchSuggestions.querySelectorAll('.search-suggestion-item');
            itemEls.forEach(function (el, idx) {
                if (idx === activeIndex) {
                    el.classList.add('active');
                    el.scrollIntoView({ block: 'nearest' });
                } else {
                    el.classList.remove('active');
                }
            });
        }

        function escapeHtml(str) {
            if (!str) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
        }

        // Input listener with debounce
        let debounceTimer = null;
        dashSearchInput.addEventListener('input', function () {
            const query = this.value.trim();
            clearTimeout(debounceTimer);
            if (!query) {
                dashSearchSuggestions.style.display = 'none';
                currentSuggestions = [];
                return;
            }

            debounceTimer = setTimeout(function () {
                const matches = queryIndex(query);
                renderSuggestions(matches, query);
            }, 120);
        });

        // Keyboard navigation
        dashSearchInput.addEventListener('keydown', function (e) {
            if (dashSearchSuggestions.style.display !== 'block') {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const q = this.value.trim();
                    if (q) {
                        window.location.href = `problems.html?search=${encodeURIComponent(q)}`;
                    }
                }
                return;
            }

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (currentSuggestions.length > 0) {
                    activeIndex = (activeIndex + 1) % currentSuggestions.length;
                    updateActiveSuggestion();
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (currentSuggestions.length > 0) {
                    activeIndex = (activeIndex - 1 + currentSuggestions.length) % currentSuggestions.length;
                    updateActiveSuggestion();
                }
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (activeIndex >= 0) {
                    navigateToSuggestion(activeIndex);
                } else {
                    const q = this.value.trim();
                    if (q) {
                        window.location.href = `problems.html?search=${encodeURIComponent(q)}`;
                    }
                }
            } else if (e.key === 'Escape') {
                dashSearchSuggestions.style.display = 'none';
            }
        });

        // Close on outside click
        document.addEventListener('click', function (e) {
            if (!dashSearchInput.contains(e.target) && !dashSearchSuggestions.contains(e.target)) {
                dashSearchSuggestions.style.display = 'none';
            }
        });
    }
});"""

if old_section in code:
    code = code.replace(old_section, new_section, 1)
    with open('frontend/js/dashboard.js', 'w', encoding='utf-8') as f:
        f.write(code)
    print("dashboard.js updated successfully")
else:
    print("Error: old_section not found in dashboard.js")

