# tests/frontend/utils/update_problem_workspace.py
import os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
PROB_HTML = os.path.join(ROOT, "frontend", "pages", "problem.html")
PROB_JS = os.path.join(ROOT, "frontend", "js", "workspace.js")

# 1. Update problem.html
with open(PROB_HTML, "r", encoding="utf-8") as f:
    h = f.read().replace("\r\n", "\n")

target_not_found = """        <!-- Problem Not Found State (Activated when ID is missing or invalid) -->
        <div id="problemNotFoundView" class="problem-not-found-container" style="display: none;">"""

replacement_lock_view = """        <!-- Problem Premium Lock State (Activated when problem requires Pro and user is not Pro) -->
        <div id="problemPremiumLockView" class="problem-not-found-container" style="display: none;">
            <div class="problem-not-found-card" style="max-width: 720px; padding: 36px 28px;">
                <div class="auth-gate-icon" style="background: rgba(234, 179, 8, 0.15); color: #facc15; border-color: rgba(234, 179, 8, 0.4);" aria-hidden="true">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                </div>
                <div style="margin-bottom: 10px;">
                    <span class="badge-pro" style="font-size: 0.75rem;">⭐ CodeArena Pro Challenge</span>
                </div>
                <h2 class="not-found-title" id="lockProblemTitle" style="font-size: 1.6rem; margin-bottom: 8px;">Challenge Title</h2>
                <div style="display: flex; gap: 8px; justify-content: center; margin-bottom: 16px; flex-wrap: wrap;">
                    <span class="diff-badge" id="lockProblemDiff">Hard</span>
                    <span class="topic-tag-pill" id="lockProblemTopic">Topic</span>
                </div>
                <p class="not-found-desc" style="max-width: 560px; margin: 0 auto 24px; line-height: 1.6;">
                    This challenge is part of the 50 curated CodeArena Pro problems. To access the complete problem statement, Java starter code, sample test cases, and progressive hints, activate a CodeArena Pro Preview membership.
                </p>

                <!-- Pricing Plans Grid -->
                <div class="pricing-plans-grid" style="text-align: left; margin-bottom: 24px;">
                    <div class="pricing-card-preview" style="padding: 20px;">
                        <h4 class="pricing-plan-name" style="font-size: 1.05rem;">Monthly Plan</h4>
                        <div class="pricing-price-row">
                            <span class="pricing-currency-amount" style="font-size: 1.8rem;">$5</span>
                            <span class="pricing-period">/ month</span>
                        </div>
                        <div class="pricing-billing-terms" style="font-size: 0.75rem; min-height: auto;">Billed monthly ($5/mo). Cancel anytime.</div>
                        <div class="pricing-note" style="margin-bottom: 12px;">Annualized equivalent: $60/yr</div>
                        <button type="button" class="pricing-action-btn btn-plan-select" id="btnLockUpgradeMonthly" style="height: 38px;">
                            Activate Monthly ($5/mo)
                        </button>
                    </div>
                    <div class="pricing-card-preview" style="padding: 20px;">
                        <h4 class="pricing-plan-name" style="font-size: 1.05rem;">Annual Plan</h4>
                        <div class="pricing-price-row">
                            <span class="pricing-currency-amount" style="font-size: 1.8rem;">$199</span>
                            <span class="pricing-period">/ year</span>
                        </div>
                        <div class="pricing-billing-terms" style="font-size: 0.75rem; min-height: auto;">Billed annually ($199/yr). Standard rate.</div>
                        <div class="pricing-note" style="margin-bottom: 12px;">Note: Standard annual rate ($199/yr) vs monthly ($5/mo).</div>
                        <button type="button" class="pricing-action-btn btn-plan-select" id="btnLockUpgradeAnnual" style="height: 38px;">
                            Activate Annual ($199/yr)
                        </button>
                    </div>
                </div>

                <div class="not-found-actions">
                    <a href="problems.html" class="btn-workspace-action" style="display: inline-flex; text-decoration: none; align-items: center; gap: 8px;">
                        <span>← Return to Problem Catalogue</span>
                    </a>
                </div>
            </div>
        </div>

        <!-- Problem Not Found State (Activated when ID is missing or invalid) -->
        <div id="problemNotFoundView" class="problem-not-found-container" style="display: none;">"""

if "problemPremiumLockView" not in h:
    assert target_not_found in h, "target_not_found not in problem.html"
    h = h.replace(target_not_found, replacement_lock_view, 1)
    with open(PROB_HTML, "w", encoding="utf-8") as f:
        f.write(h)
    print("problem.html updated with problemPremiumLockView.")

# 2. Update workspace.js
with open(PROB_JS, "r", encoding="utf-8") as f:
    js = f.read().replace("\r\n", "\n")

# Update cacheElements
target_js_cache = """            problemNotFoundView: document.getElementById('problemNotFoundView'),
            notFoundMessage: document.getElementById('notFoundMessage'),"""

replacement_js_cache = """            problemNotFoundView: document.getElementById('problemNotFoundView'),
            notFoundMessage: document.getElementById('notFoundMessage'),
            premiumLockView: document.getElementById('problemPremiumLockView'),
            lockProblemTitle: document.getElementById('lockProblemTitle'),
            lockProblemDiff: document.getElementById('lockProblemDiff'),
            lockProblemTopic: document.getElementById('lockProblemTopic'),
            btnLockUpgradeMonthly: document.getElementById('btnLockUpgradeMonthly'),
            btnLockUpgradeAnnual: document.getElementById('btnLockUpgradeAnnual'),"""

if "premiumLockView:" not in js:
    assert target_js_cache in js, "target_js_cache not in workspace.js"
    js = js.replace(target_js_cache, replacement_js_cache, 1)

# Update loadProblemFromUrl
target_load_problem = """            const res = await window.CodeArenaAPI.problemService.getProblemById(cleanId);
            if (res && res.success && res.data) {
                currentProblem = res.data;
                renderProblemData(currentProblem);"""

replacement_load_problem = """            const res = await window.CodeArenaAPI.problemService.getProblemById(cleanId);
            if (res && res.success && res.data) {
                currentProblem = res.data;
                
                // Check Pro Access
                const isProProblem = Boolean(currentProblem.isPremium);
                const userIsPro = Boolean(
                    window.CodeArenaAPI &&
                    window.CodeArenaAPI.subscriptionService &&
                    window.CodeArenaAPI.subscriptionService.isPremium()
                );

                if (isProProblem && !userIsPro) {
                    renderPremiumLock(currentProblem);
                    return;
                }

                if (dom.premiumLockView) dom.premiumLockView.style.display = 'none';
                if (dom.problemReferencePane) dom.problemReferencePane.style.display = 'flex';
                if (dom.codingWorkspacePane) dom.codingWorkspacePane.style.display = 'flex';
                renderProblemData(currentProblem);"""

if "renderPremiumLock(" not in js:
    assert target_load_problem in js, "target_load_problem not in workspace.js"
    js = js.replace(target_load_problem, replacement_load_problem, 1)

# Add renderPremiumLock implementation
render_lock_fn = """
    function renderPremiumLock(problem) {
        if (!dom.premiumLockView) return;
        if (dom.problemNotFoundView) dom.problemNotFoundView.style.display = 'none';
        if (dom.problemReferencePane) dom.problemReferencePane.style.display = 'none';
        if (dom.codingWorkspacePane) dom.codingWorkspacePane.style.display = 'none';

        if (dom.lockProblemTitle) dom.lockProblemTitle.textContent = problem.title || 'Pro Challenge';
        if (dom.lockProblemDiff) {
            dom.lockProblemDiff.textContent = problem.difficulty || 'Hard';
            dom.lockProblemDiff.className = 'diff-badge diff-' + String(problem.difficulty || 'hard').toLowerCase();
        }
        if (dom.lockProblemTopic) dom.lockProblemTopic.textContent = `${problem.topic || 'DSA'} • ${problem.pattern || 'Pattern'}`;

        dom.premiumLockView.style.display = 'flex';

        function handleUpgrade(planId) {
            if (window.CodeArenaAPI && window.CodeArenaAPI.subscriptionService) {
                window.CodeArenaAPI.subscriptionService.upgradePlan(planId);
                if (window.CodeArenaAPI.authService && !window.CodeArenaAPI.authService.isAuthenticated()) {
                    window.CodeArenaAPI.authService.demoLogin(planId);
                }
                if (window.CodeArenaToast) {
                    window.CodeArenaToast.success(`Activated ${planId === 'annual' ? 'Pro Annual ($199/yr)' : 'Pro Monthly ($5/mo)'} preview membership! Challenge unlocked.`);
                }
                dom.premiumLockView.style.display = 'none';
                if (dom.problemReferencePane) dom.problemReferencePane.style.display = 'flex';
                if (dom.codingWorkspacePane) dom.codingWorkspacePane.style.display = 'flex';
                renderProblemData(problem);
                updateRecentlyViewed(problem);
                if (codeEditor && typeof codeEditor.refresh === 'function') {
                    setTimeout(() => codeEditor.refresh(), 100);
                }
            }
        }

        if (dom.btnLockUpgradeMonthly) {
            dom.btnLockUpgradeMonthly.onclick = () => handleUpgrade('monthly');
        }
        if (dom.btnLockUpgradeAnnual) {
            dom.btnLockUpgradeAnnual.onclick = () => handleUpgrade('annual');
        }
    }
"""

if "function renderPremiumLock(" not in js:
    js = js.replace("    function renderNotFound(", render_lock_fn + "\n    function renderNotFound(")

with open(PROB_JS, "w", encoding="utf-8") as f:
    f.write(js)

print("workspace.js updated with renderPremiumLock and Pro access gating.")
