/**
 * CodeArena — Guided Java Learning Roadmap Controller
 * Handles interactive progression visualization, search & filtering,
 * topic detail inspection drawer, deep-link URL synchronization,
 * completion toggles, and modal confirmations.
 *
 * Fully client-side; zero external dependencies; zero emojis.
 */

(function () {
    'use strict';

    // Core references
    const Data = window.CodeArenaRoadmapData;
    const Service = window.CodeArenaRoadmapService;
    const BasicData = window.CodeArenaBasicData;

    if (!Data || !Service) {
        console.error('[Roadmap] Missing required RoadmapData or RoadmapService.');
        return;
    }

    // State
    let currentLevelFilter = 'all'; // 'all' | '1' | '2' | '3'
    let currentStatusFilter = 'all'; // 'all' | 'in-progress' | 'completed'
    let searchQuery = '';
    let activeTopicId = null;

    // DOM Elements
    let statOverallProgress = null;
    let statOverallFill = null;
    let statCompletedCount = null;
    let statCurrentLevelBadge = null;
    let recTopicContainer = null;
    let searchInput = null;
    let searchClearBtn = null;
    let statusFilterSelect = null;
    let levelsContainer = null;
    let detailOverlay = null;
    let detailDrawer = null;
    let resetModal = null;

    // SVG Icons (Zero emojis — standardized SVG vector library)
    const ICONS = {
        check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>',
        lock: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>',
        clock: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
        alert: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
        code: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',
        arrowRight: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',
        arrowLeft: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>',
        target: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>',
        book: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path><path d="M6 6h10"></path><path d="M6 10h10"></path></svg>',
        external: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>'
    };

    /**
     * Initialization entrypoint
     */
    function init() {
        cacheDom();
        bindEvents();
        renderOverviewStats();
        renderLevelsAndTopics();

        // Check URL parameters for deep-linked topic
        const urlParams = new URLSearchParams(window.location.search);
        const linkedTopic = urlParams.get('topic');
        if (linkedTopic) {
            openTopicDrawer(linkedTopic, false);
        }

        // Subscribe to Service changes
        Service.onChange(function () {
            renderOverviewStats();
            renderLevelsAndTopics();
            if (activeTopicId) {
                renderDrawerContent(activeTopicId);
            }
        });
    }

    function cacheDom() {
        statOverallProgress = document.getElementById('statOverallProgress');
        statOverallFill = document.getElementById('statOverallFill');
        statCompletedCount = document.getElementById('statCompletedCount');
        statCurrentLevelBadge = document.getElementById('statCurrentLevelBadge');
        recTopicContainer = document.getElementById('recTopicContainer');
        searchInput = document.getElementById('roadmapSearchInput');
        searchClearBtn = document.getElementById('searchClearBtn');
        statusFilterSelect = document.getElementById('statusFilterSelect');
        levelsContainer = document.getElementById('roadmapLevelsContainer');
        detailOverlay = document.getElementById('roadmapDetailOverlay');
        detailDrawer = document.getElementById('roadmapDetailDrawer');
        resetModal = document.getElementById('resetModal');
    }

    function bindEvents() {
        // Search input
        if (searchInput) {
            searchInput.addEventListener('input', function (e) {
                searchQuery = (e.target.value || '').trim().toLowerCase();
                if (searchClearBtn) {
                    if (searchQuery.length > 0) {
                        searchClearBtn.classList.add('visible');
                    } else {
                        searchClearBtn.classList.remove('visible');
                    }
                }
                renderLevelsAndTopics();
            });
        }

        // Clear search
        if (searchClearBtn) {
            searchClearBtn.addEventListener('click', function () {
                if (searchInput) {
                    searchInput.value = '';
                    searchQuery = '';
                    searchClearBtn.classList.remove('visible');
                    renderLevelsAndTopics();
                }
            });
        }

        // Filter pills (Level tabs)
        const filterPills = document.querySelectorAll('.filter-pill-btn[data-level]');
        filterPills.forEach(function (pill) {
            pill.addEventListener('click', function () {
                filterPills.forEach(function (p) { p.classList.remove('active'); });
                pill.classList.add('active');
                currentLevelFilter = pill.getAttribute('data-level');
                renderLevelsAndTopics();
            });
        });

        // Status select
        if (statusFilterSelect) {
            statusFilterSelect.addEventListener('change', function (e) {
                currentStatusFilter = e.target.value;
                renderLevelsAndTopics();
            });
        }

        // Reset progress modal buttons
        const btnOpenReset = document.getElementById('btnResetProgress');
        if (btnOpenReset) {
            btnOpenReset.addEventListener('click', function () {
                if (resetModal) resetModal.classList.add('active');
            });
        }

        const btnCancelReset = document.getElementById('btnCancelReset');
        if (btnCancelReset) {
            btnCancelReset.addEventListener('click', function () {
                if (resetModal) resetModal.classList.remove('active');
            });
        }

        const btnConfirmReset = document.getElementById('btnConfirmReset');
        if (btnConfirmReset) {
            btnConfirmReset.addEventListener('click', function () {
                Service.resetProgress();
                if (resetModal) resetModal.classList.remove('active');
            });
        }

        // Close drawer handlers
        const btnCloseDrawer = document.getElementById('btnCloseDrawer');
        if (btnCloseDrawer) {
            btnCloseDrawer.addEventListener('click', closeTopicDrawer);
        }

        if (detailOverlay) {
            detailOverlay.addEventListener('click', function (e) {
                if (e.target === detailOverlay) {
                    closeTopicDrawer();
                }
            });
        }

        // Keyboard handler (Escape key)
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                if (resetModal && resetModal.classList.contains('active')) {
                    resetModal.classList.remove('active');
                } else if (detailOverlay && detailOverlay.classList.contains('active')) {
                    closeTopicDrawer();
                }
            }
        });

        // Browser Back/Forward navigation
        window.addEventListener('popstate', function (e) {
            const urlParams = new URLSearchParams(window.location.search);
            const topic = urlParams.get('topic');
            if (topic) {
                openTopicDrawer(topic, false);
            } else {
                closeTopicDrawer(false);
            }
        });
    }

    /**
     * Update Overview Metrics & Recommended Next Topic
     */
    function renderOverviewStats() {
        const stats = Service.getOverallStats();

        if (statOverallProgress) {
            statOverallProgress.textContent = stats.percent + '%';
        }
        if (statOverallFill) {
            statOverallFill.style.width = stats.percent + '%';
        }
        if (statCompletedCount) {
            statCompletedCount.textContent = stats.completed + ' of ' + stats.total;
        }
        if (statCurrentLevelBadge) {
            statCurrentLevelBadge.textContent = 'Level ' + stats.currentLevel;
        }

        // Render Recommended Topic
        if (recTopicContainer) {
            const rec = Service.getRecommendedNextTopic();
            if (rec) {
                recTopicContainer.innerHTML = `
                    <div class="rec-title-wrap">
                        <div class="rec-topic-name">${rec.number}. ${escapeHtml(rec.title)}</div>
                        <p class="rec-topic-desc">${escapeHtml(rec.shortDesc)}</p>
                    </div>
                    <button type="button" class="rec-action-btn" data-topic-id="${rec.id}">
                        <span>Continue Learning</span>
                        ${ICONS.arrowRight}
                    </button>
                `;

                const btn = recTopicContainer.querySelector('.rec-action-btn');
                if (btn) {
                    btn.addEventListener('click', function () {
                        openTopicDrawer(rec.id);
                    });
                }
            } else {
                recTopicContainer.innerHTML = `
                    <div class="rec-title-wrap">
                        <div class="rec-topic-name" style="color: #10b981;">Roadmap Completed!</div>
                        <p class="rec-topic-desc">You have successfully mastered all 30 foundational topics and algorithms.</p>
                    </div>
                `;
            }
        }
    }

    /**
     * Render Level Containers and Topic Cards
     */
    function renderLevelsAndTopics() {
        if (!levelsContainer) return;

        const levels = Data.getLevels();
        let html = '';

        levels.forEach(function (level) {
            // Check level filter
            if (currentLevelFilter !== 'all' && currentLevelFilter !== String(level.id)) {
                return;
            }

            const topics = Data.getTopicsByLevel(level.id);
            const levelStats = Service.getLevelStats(level.id);

            // Filter topics by search and status
            const filteredTopics = topics.filter(function (topic) {
                const status = Service.getTopicStatus(topic.id);

                // Status filter
                if (currentStatusFilter === 'completed' && status !== 'completed') {
                    return false;
                }
                if (currentStatusFilter === 'in-progress' && status === 'completed') {
                    return false;
                }

                // Search query filter
                if (searchQuery.length > 0) {
                    const matchTitle = topic.title.toLowerCase().indexOf(searchQuery) !== -1;
                    const matchCategory = topic.category.toLowerCase().indexOf(searchQuery) !== -1;
                    const matchDesc = topic.shortDesc.toLowerCase().indexOf(searchQuery) !== -1;
                    const matchConcepts = (topic.coreConcepts || '').toLowerCase().indexOf(searchQuery) !== -1;
                    if (!matchTitle && !matchCategory && !matchDesc && !matchConcepts) {
                        return false;
                    }
                }

                return true;
            });

            // If searching and this level has no matching topics, hide section
            if (filteredTopics.length === 0 && (searchQuery.length > 0 || currentStatusFilter !== 'all')) {
                return;
            }

            const statusClass = 'level-status-' + levelStats.status;
            let statusLabel = 'In Progress';
            if (levelStats.status === 'completed') statusLabel = 'Completed';
            if (levelStats.status === 'locked') statusLabel = 'Locked';

            html += `
                <section class="roadmap-level-section" id="level-section-${level.id}" aria-labelledby="level-heading-${level.id}">
                    <div class="level-header-banner">
                        <div class="level-meta-left">
                            <span class="level-tier-badge level-tier-${level.id}">${escapeHtml(level.badge)}</span>
                            <div class="level-title-wrap">
                                <h2 id="level-heading-${level.id}">${escapeHtml(level.title)}</h2>
                                <p>${escapeHtml(level.description)}</p>
                            </div>
                        </div>
                        <div class="level-progress-summary">
                            <div class="level-progress-text">
                                <div class="level-count-info">${levelStats.completed} / ${levelStats.total} Topics</div>
                                <div class="level-percent-info">${levelStats.percent}% Mastered</div>
                            </div>
                            <span class="level-status-pill ${statusClass}">
                                ${levelStats.status === 'completed' ? ICONS.check : (levelStats.status === 'locked' ? ICONS.lock : ICONS.target)}
                                <span>${statusLabel}</span>
                            </span>
                        </div>
                    </div>
                    <div class="level-topics-grid">
            `;

            if (filteredTopics.length === 0) {
                html += `
                    <div style="grid-column: 1 / -1; padding: 24px; text-align: center; color: var(--color-text-muted);">
                        No topics match the selected search or filter criteria.
                    </div>
                `;
            } else {
                filteredTopics.forEach(function (topic) {
                    html += buildTopicCardHtml(topic);
                });
            }

            html += `
                    </div>
                </section>
            `;
        });

        levelsContainer.innerHTML = html;

        // Attach event listeners to newly rendered cards
        const topicCards = levelsContainer.querySelectorAll('.roadmap-topic-card');
        topicCards.forEach(function (card) {
            const topicId = card.getAttribute('data-topic-id');
            card.addEventListener('click', function (e) {
                // Ignore click if clicking direct mark completed toggle
                if (e.target.closest('.quick-toggle-btn')) return;
                openTopicDrawer(topicId);
            });

            const quickToggleBtn = card.querySelector('.quick-toggle-btn');
            if (quickToggleBtn) {
                quickToggleBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    Service.toggleTopicCompleted(topicId);
                });
            }
        });
    }

    /**
     * Build HTML markup for a single topic card
     */
    function buildTopicCardHtml(topic) {
        const isCompleted = Service.isTopicCompleted(topic.id);
        const isUnlocked = Service.isTopicUnlocked(topic.id);
        const status = Service.getTopicStatus(topic.id);

        let statusClass = 'status-' + status;
        let badgeHtml = '';

        if (status === 'completed') {
            badgeHtml = `<span class="topic-status-badge status-badge-completed">${ICONS.check} Completed</span>`;
        } else if (status === 'in-progress') {
            badgeHtml = `<span class="topic-status-badge status-badge-available">${ICONS.clock} Available</span>`;
        } else {
            badgeHtml = `<span class="topic-status-badge status-badge-locked">${ICONS.lock} Locked</span>`;
        }

        // Prerequisites badges
        let prereqsHtml = '';
        if (topic.prerequisites && topic.prerequisites.length > 0) {
            prereqsHtml += '<div class="topic-prereqs-bar"><span class="prereq-label">Requires:</span>';
            topic.prerequisites.forEach(function (prereqId) {
                const isMet = Service.isTopicCompleted(prereqId);
                const prereqTopic = Data.getTopicById(prereqId);
                const title = prereqTopic ? prereqTopic.title : prereqId;
                prereqsHtml += `
                    <span class="prereq-chip ${isMet ? 'met' : 'pending'}" title="${isMet ? 'Prerequisite completed' : 'Prerequisite pending'}">
                        ${isMet ? ICONS.check : ICONS.lock}
                        <span>${escapeHtml(title)}</span>
                    </span>
                `;
            });
            prereqsHtml += '</div>';
        }

        const totalProblems = (topic.basicProblemIds ? topic.basicProblemIds.length : 0) +
                              (topic.dsaProblemIds ? topic.dsaProblemIds.length : 0);

        return `
            <article class="roadmap-topic-card ${statusClass}" data-topic-id="${topic.id}" tabindex="0" role="button" aria-label="Topic ${topic.number}: ${escapeHtml(topic.title)}">
                <div class="topic-card-header">
                    <span class="topic-seq-tag">#${topic.number}</span>
                    <span class="topic-category-pill">${escapeHtml(topic.category)}</span>
                </div>
                
                <h3 class="topic-title">${escapeHtml(topic.title)}</h3>
                <p class="topic-desc">${escapeHtml(topic.shortDesc)}</p>
                
                ${prereqsHtml}
                
                <div class="topic-card-footer">
                    <span class="topic-problem-count">
                        ${ICONS.code}
                        <span>${totalProblems} Challenges</span>
                    </span>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        ${badgeHtml}
                        <button type="button" class="quick-toggle-btn secondary-header-btn" style="height: 28px; padding: 0 8px; font-size: 0.72rem;" title="${isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}" aria-label="${isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}">
                            ${isCompleted ? 'Uncheck' : 'Done'}
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    /**
     * Open Topic Detail Inspection Drawer
     */
    function openTopicDrawer(topicId, updateHistory = true) {
        const topic = Data.getTopicById(topicId);
        if (!topic) return;

        activeTopicId = topicId;
        Service.setLastVisitedTopic(topicId);

        renderDrawerContent(topicId);

        if (detailOverlay) {
            detailOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        if (updateHistory) {
            const url = new URL(window.location.href);
            url.searchParams.set('topic', topicId);
            window.history.pushState({ topic: topicId }, '', url.toString());
        }
    }

    /**
     * Close Topic Detail Drawer
     */
    function closeTopicDrawer(updateHistory = true) {
        activeTopicId = null;
        if (detailOverlay) {
            detailOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        if (updateHistory) {
            const url = new URL(window.location.href);
            url.searchParams.delete('topic');
            window.history.pushState({}, '', url.toString());
        }
    }

    /**
     * Populate Topic Detail Content
     */
    function renderDrawerContent(topicId) {
        const topic = Data.getTopicById(topicId);
        if (!topic) return;

        const drawerHeading = document.getElementById('drawerHeading');
        const drawerBody = document.getElementById('drawerBody');
        const drawerToggleBtn = document.getElementById('drawerToggleCompleteBtn');
        const drawerPrevBtn = document.getElementById('drawerPrevBtn');
        const drawerNextBtn = document.getElementById('drawerNextBtn');

        const isCompleted = Service.isTopicCompleted(topicId);
        const level = Data.getLevels().find(function (l) { return l.id === topic.levelId; });

        // Update Header
        if (drawerHeading) {
            drawerHeading.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                    <span class="level-tier-badge level-tier-${topic.levelId}">${escapeHtml(level ? level.badge : 'Level ' + topic.levelId)}</span>
                    <span class="topic-category-pill">${escapeHtml(topic.category)}</span>
                </div>
                <h1>${topic.number}. ${escapeHtml(topic.title)}</h1>
                <p>${escapeHtml(topic.shortDesc)}</p>
            `;
        }

        // Update Toggle Completion button
        if (drawerToggleBtn) {
            if (isCompleted) {
                drawerToggleBtn.className = 'drawer-toggle-complete-btn is-completed';
                drawerToggleBtn.innerHTML = `${ICONS.check} <span>Completed</span>`;
                drawerToggleBtn.title = 'Click to mark incomplete';
            } else {
                drawerToggleBtn.className = 'drawer-toggle-complete-btn mark-completed';
                drawerToggleBtn.innerHTML = `${ICONS.check} <span>Mark Completed</span>`;
                drawerToggleBtn.title = 'Mark as completed';
            }

            drawerToggleBtn.onclick = function () {
                Service.toggleTopicCompleted(topicId);
                renderDrawerContent(topicId);
                renderOverviewStats();
                renderLevelsAndTopics();
            };
        }

        // Build Sections inside Drawer Body
        let bodyHtml = '';

        // 1. Learning Objectives
        if (topic.objectives && topic.objectives.length > 0) {
            bodyHtml += `
                <div class="drawer-section">
                    <span class="section-label">${ICONS.target} Learning Objectives</span>
                    <ul class="objectives-list">
            `;
            topic.objectives.forEach(function (obj) {
                bodyHtml += `
                    <li>
                        <span class="objective-check-icon">${ICONS.check}</span>
                        <span>${escapeHtml(obj)}</span>
                    </li>
                `;
            });
            bodyHtml += `
                    </ul>
                </div>
            `;
        }

        // 2. Prerequisites
        if (topic.prerequisites && topic.prerequisites.length > 0) {
            bodyHtml += `
                <div class="drawer-section">
                    <span class="section-label">${ICONS.lock} Prerequisite Concepts</span>
                    <div class="drawer-prereqs-box">
            `;
            topic.prerequisites.forEach(function (prereqId) {
                const isMet = Service.isTopicCompleted(prereqId);
                const prereq = Data.getTopicById(prereqId);
                const title = prereq ? prereq.title : prereqId;
                bodyHtml += `
                    <button type="button" class="prereq-link-chip ${isMet ? 'status-met' : 'status-unmet'}" data-nav-topic="${prereqId}">
                        ${isMet ? ICONS.check : ICONS.lock}
                        <span>${escapeHtml(title)}</span>
                    </button>
                `;
            });
            bodyHtml += `
                    </div>
                </div>
            `;
        }

        // 3. Core Concepts
        bodyHtml += `
            <div class="drawer-section">
                <span class="section-label">${ICONS.book} Core Engineering Concepts</span>
                <div class="concepts-prose">
                    ${topic.coreConcepts}
                </div>
            </div>
        `;

        // 4. Runnable Java Code Example
        bodyHtml += `
            <div class="drawer-section">
                <span class="section-label">${ICONS.code} Canonical Java Implementation</span>
                <div class="code-example-container">
                    <div class="code-header-bar">
                        <span>Main.java (OpenJDK 17)</span>
                        <span>Runnable Example</span>
                    </div>
                    <pre class="code-block-pre"><code>${escapeHtml(topic.codeExample)}</code></pre>
                </div>
                
                <div class="console-output-box">
                    <div class="console-output-header">Standard Output (stdout)</div>
                    <pre class="console-output-content">${escapeHtml(topic.expectedOutput)}</pre>
                </div>
            </div>
        `;

        // 5. Common Pitfalls & Traps
        if (topic.commonMistakes && topic.commonMistakes.length > 0) {
            bodyHtml += `
                <div class="drawer-section">
                    <div class="pitfalls-callout">
                        <div class="pitfalls-callout-header">
                            ${ICONS.alert}
                            <span>Common Traps & Implementation Pitfalls</span>
                        </div>
                        <ul class="pitfalls-list">
            `;
            topic.commonMistakes.forEach(function (trap) {
                bodyHtml += `<li>${escapeHtml(trap)}</li>`;
            });
            bodyHtml += `
                        </ul>
                    </div>
                </div>
            `;
        }

        // 6. Curated Practice Challenges
        bodyHtml += `
            <div class="drawer-section">
                <span class="section-label">${ICONS.code} Curated Hands-on Challenges</span>
                <div class="drawer-practice-grid">
        `;

        // Basic Problems
        if (topic.basicProblemIds && topic.basicProblemIds.length > 0) {
            topic.basicProblemIds.forEach(function (pid) {
                const prob = getBasicProblem(pid);
                const title = prob ? prob.title : formatProblemSlug(pid);
                const diff = prob ? prob.difficulty : 'Easy';
                const diffClass = 'diff-' + diff.toLowerCase();

                bodyHtml += `
                    <div class="practice-problem-item">
                        <div class="problem-item-info">
                            <div class="problem-item-top">
                                <span class="problem-type-tag problem-type-basic">Basic Track</span>
                                <span class="problem-diff-badge ${diffClass}">${diff}</span>
                            </div>
                            <h4 class="problem-item-title">${escapeHtml(title)}</h4>
                            <p class="problem-item-category">Beginner Java Challenge</p>
                        </div>
                        <a href="basic-problem.html?id=${pid}" class="problem-action-btn" target="_blank" rel="noopener">
                            <span>Solve Challenge</span>
                            ${ICONS.external}
                        </a>
                    </div>
                `;
            });
        }

        // DSA Problems
        if (topic.dsaProblemIds && topic.dsaProblemIds.length > 0) {
            topic.dsaProblemIds.forEach(function (pid) {
                const title = formatProblemSlug(pid);

                bodyHtml += `
                    <div class="practice-problem-item">
                        <div class="problem-item-info">
                            <div class="problem-item-top">
                                <span class="problem-type-tag problem-type-dsa">DSA Track</span>
                                <span class="problem-diff-badge diff-medium">Medium</span>
                            </div>
                            <h4 class="problem-item-title">${escapeHtml(title)}</h4>
                            <p class="problem-item-category">Algorithmic Problem Solving</p>
                        </div>
                        <a href="problem.html?id=${pid}" class="problem-action-btn" target="_blank" rel="noopener">
                            <span>Solve DSA</span>
                            ${ICONS.external}
                        </a>
                    </div>
                `;
            });
        }

        bodyHtml += `
                </div>
            </div>
        `;

        if (drawerBody) {
            drawerBody.innerHTML = bodyHtml;

            // Bind click handlers to prerequisite links in drawer
            const prereqLinks = drawerBody.querySelectorAll('.prereq-link-chip[data-nav-topic]');
            prereqLinks.forEach(function (link) {
                link.addEventListener('click', function () {
                    const navId = link.getAttribute('data-nav-topic');
                    openTopicDrawer(navId);
                });
            });
        }

        // Update Prev / Next Buttons in Footer
        const allTopics = Data.getTopics();
        const currentIndex = allTopics.findIndex(function (t) { return t.id === topicId; });

        if (drawerPrevBtn) {
            if (currentIndex > 0) {
                const prevTopic = allTopics[currentIndex - 1];
                drawerPrevBtn.disabled = false;
                drawerPrevBtn.onclick = function () {
                    openTopicDrawer(prevTopic.id);
                };
            } else {
                drawerPrevBtn.disabled = true;
                drawerPrevBtn.onclick = null;
            }
        }

        if (drawerNextBtn) {
            if (currentIndex < allTopics.length - 1) {
                const nextTopic = allTopics[currentIndex + 1];
                drawerNextBtn.disabled = false;
                drawerNextBtn.onclick = function () {
                    openTopicDrawer(nextTopic.id);
                };
            } else {
                drawerNextBtn.disabled = true;
                drawerNextBtn.onclick = null;
            }
        }
    }

    function getBasicProblem(pid) {
        if (!BasicData) return null;
        if (typeof BasicData.getProblemById === 'function') {
            return BasicData.getProblemById(pid);
        }
        if (Array.isArray(BasicData.PROBLEMS)) {
            return BasicData.PROBLEMS.find(function (p) { return p.id === pid; }) || null;
        }
        return null;
    }

    /**
     * Helper to humanize problem slug (e.g., 'two-sum' -> 'Two Sum')
     */
    function formatProblemSlug(slug) {
        if (!slug) return '';
        return slug.split('-').map(function (w) {
            return w.charAt(0).toUpperCase() + w.slice(1);
        }).join(' ');
    }

    /**
     * Helper to prevent XSS in text interpolation
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

    window.CodeArenaRoadmap = {
        openTopicDrawer: openTopicDrawer,
        closeTopicDrawer: closeTopicDrawer
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
