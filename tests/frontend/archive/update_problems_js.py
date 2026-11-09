# tests/frontend/utils/update_problems_js.py
import os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
PROB_JS = os.path.join(ROOT, "frontend", "js", "problems.js")

with open(PROB_JS, "r", encoding="utf-8") as f:
    c = f.read().replace("\r\n", "\n")

# 1. Update state
target_state = """    // Catalogue State
    const state = {
        search: '',
        difficulty: 'All',
        topic: 'All',
        pattern: 'All',
        sortBy: 'default',
        page: 1,
        limit: 8
    };"""

replacement_state = """    // Catalogue State
    const state = {
        search: '',
        difficulty: 'All',
        topic: 'All',
        pattern: 'All',
        access: 'All',
        sortBy: 'default',
        page: 1,
        limit: 8
    };"""

assert target_state in c, "Could not find target_state in problems.js"
c = c.replace(target_state, replacement_state, 1)

# 2. Update init query params
target_init_params = """        if (urlParams.has('pattern')) {
            state.pattern = urlParams.get('pattern');
        }"""

replacement_init_params = """        if (urlParams.has('pattern')) {
            state.pattern = urlParams.get('pattern');
        }
        if (urlParams.has('access')) {
            state.access = urlParams.get('access');
            if (dom.accessFilter) dom.accessFilter.value = state.access;
        }"""

assert target_init_params in c, "Could not find target_init_params in problems.js"
c = c.replace(target_init_params, replacement_init_params, 1)

# 3. Update cacheElements
target_cache = """            patternFilter: document.getElementById('patternFilter'),
            sortBySelect: document.getElementById('sortBySelect'),
            clearFiltersBtn: document.getElementById('clearFiltersBtn'),
            heroTotalProblems: document.getElementById('heroTotalProblems'),
            heroTotalTopics: document.getElementById('heroTotalTopics'),
            heroTotalPatterns: document.getElementById('heroTotalPatterns'),"""

replacement_cache = """            patternFilter: document.getElementById('patternFilter'),
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
            btnSelectAnnual: document.getElementById('btnSelectAnnual'),"""

assert target_cache in c, "Could not find target_cache in problems.js"
c = c.replace(target_cache, replacement_cache, 1)

# 4. Update updateHeroStats
target_herostats = """    async function updateHeroStats() {
        try {
            if (window.CodeArenaAPI && window.CodeArenaAPI.problemService) {
                const pRes = await window.CodeArenaAPI.problemService.getProblems({ limit: 1000 });
                const tRes = await window.CodeArenaAPI.problemService.getTopics();
                const ptRes = await window.CodeArenaAPI.problemService.getPatterns('All');

                if (pRes.success && pRes.data && dom.heroTotalProblems) {
                    dom.heroTotalProblems.textContent = String(pRes.data.total || (pRes.data.problems && pRes.data.problems.length) || 154);
                }
                if (tRes.success && Array.isArray(tRes.data) && dom.heroTotalTopics) {
                    dom.heroTotalTopics.textContent = String(tRes.data.length);
                }
                if (ptRes.success && Array.isArray(ptRes.data) && dom.heroTotalPatterns) {
                    dom.heroTotalPatterns.textContent = String(ptRes.data.length);
                }
            }
        } catch (err) {
            // Graceful fallback to static figures
        }
    }"""

replacement_herostats = """    async function updateHeroStats() {
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
    }"""

assert target_herostats in c, "Could not find target_herostats in problems.js"
c = c.replace(target_herostats, replacement_herostats, 1)

# 5. Bind events for accessFilter & subscription modal
target_bind_pattern = """        // Pattern Filter
        if (dom.patternFilter) {
            dom.patternFilter.addEventListener('change', function () {
                state.pattern = dom.patternFilter.value;
                state.page = 1;
                loadProblems();
            });
        }"""

replacement_bind_pattern = """        // Pattern Filter
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
        }"""

assert target_bind_pattern in c, "Could not find target_bind_pattern in problems.js"
c = c.replace(target_bind_pattern, replacement_bind_pattern, 1)

# 6. Update loadProblems to pass access
target_call_problems = """            if (state.pattern !== 'All') params.pattern = state.pattern;"""

replacement_call_problems = """            if (state.pattern !== 'All') params.pattern = state.pattern;
            if (state.access !== 'All') params.access = state.access;"""

assert target_call_problems in c, "Could not find target_call_problems in problems.js"
c = c.replace(target_call_problems, replacement_call_problems, 1)

# 7. Update renderTable for Pro badges and Lock handling
target_rendertable_row = """            tr.innerHTML = `
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
            `;"""

replacement_rendertable_row = """            const isPro = Boolean(problem.isPremium);
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
            if (linkTitle) linkTitle.addEventListener('click', handleProblemClick);"""

assert target_rendertable_row in c, "Could not find target_rendertable_row in problems.js"
c = c.replace(target_rendertable_row, replacement_rendertable_row, 1)

# 8. Add modal helpers: openSubscriptionModal, closeSubscriptionModal, activatePlanAndRefresh
modal_helpers = """
    let pendingModalProblem = null;

    function openSubscriptionModal(problem) {
        pendingModalProblem = problem;
        if (dom.subModalPreviewTitle) dom.subModalPreviewTitle.textContent = problem.title || 'Advanced Challenge';
        if (dom.subModalPreviewDiff) {
            dom.subModalPreviewDiff.textContent = problem.difficulty || 'Hard';
            dom.subModalPreviewDiff.className = 'diff-badge ' + getDifficultyClass(problem.difficulty);
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
            loadProblems(); // re-render unlocked state
            if (targetProb) {
                setTimeout(function () {
                    window.location.href = `problem.html?id=${encodeURIComponent(targetProb.id)}`;
                }, 400);
            }
        }
    }
"""

c = c.replace("    // --- Recently Viewed Problems Controller (Phase 6) ---", modal_helpers + "\n    // --- Recently Viewed Problems Controller (Phase 6) ---")

with open(PROB_JS, "w", encoding="utf-8") as f:
    f.write(c)

print("problems.js updated with access filtering, lock interaction, and subscription modal.")
