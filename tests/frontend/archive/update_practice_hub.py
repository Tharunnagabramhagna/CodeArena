# tests/frontend/utils/update_practice_hub.py
import os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
PRAC_HTML = os.path.join(ROOT, "frontend", "pages", "practice.html")
PRAC_JS = os.path.join(ROOT, "frontend", "js", "practice_hub.js")

# 1. Update practice.html with subscription modal
with open(PRAC_HTML, "r", encoding="utf-8") as f:
    h = f.read().replace("\r\n", "\n")

modal_markup = """    <!-- CodeArena Pro Subscription Upgrade Modal -->
    <div class="subscription-modal-overlay" id="subscriptionModalOverlay" style="display: none;" role="dialog" aria-modal="true" aria-labelledby="subModalTitle">
        <div class="subscription-modal">
            <div class="sub-modal-header">
                <button type="button" class="sub-modal-close-btn" id="btnCloseSubModal" aria-label="Close modal">✕</button>
                <span class="sub-modal-tag">⭐ CodeArena Pro Membership</span>
                <h2 id="subModalTitle" class="sub-modal-title">Unlock Premium Challenges</h2>
                <p class="sub-modal-subtitle">
                    This challenge is part of the 50 curated CodeArena Pro problems covering advanced algorithms, segment trees, interval DP, and complex graph patterns.
                </p>
            </div>

            <!-- Problem preview card -->
            <div class="sub-preview-card" id="subModalProblemPreview">
                <div class="sub-preview-info">
                    <span class="badge-pro">PRO</span>
                    <span class="sub-preview-title" id="subModalPreviewTitle">Challenge Title</span>
                    <span class="diff-badge" id="subModalPreviewDiff">Hard</span>
                    <span style="font-size: 0.8rem; color: var(--color-text-muted);" id="subModalPreviewTopic">Topic</span>
                </div>
                <span style="font-size: 0.82rem; color: var(--color-primary); font-weight: 600;">Requires Pro Access</span>
            </div>

            <!-- Subscription Plans (Transparent Pricing) -->
            <div class="pricing-plans-grid">
                <!-- Monthly Plan -->
                <div class="pricing-card-preview" id="cardPlanMonthly">
                    <div class="pricing-card-header">
                        <h3 class="pricing-plan-name">Monthly Plan</h3>
                        <div class="pricing-price-row">
                            <span class="pricing-currency-amount">$5</span>
                            <span class="pricing-period">/ month</span>
                        </div>
                        <div class="pricing-billing-terms">Billed monthly ($5/month). Flexible month-to-month access. Cancel anytime.</div>
                        <div class="pricing-note">Annualized equivalent: $60 per year</div>
                    </div>
                    <ul class="pricing-benefits">
                        <li class="pricing-benefit-item"><span class="pricing-benefit-check">✓</span> 50 Curated Premium DSA Problems</li>
                        <li class="pricing-benefit-item"><span class="pricing-benefit-check">✓</span> Advanced Graph, DP & Tree Challenges</li>
                        <li class="pricing-benefit-item"><span class="pricing-benefit-check">✓</span> Progressive 3-Level Problem Hints</li>
                        <li class="pricing-benefit-item"><span class="pricing-benefit-check">✓</span> Priority Test Case Execution Preview</li>
                    </ul>
                    <button type="button" class="pricing-action-btn btn-plan-select" data-plan="monthly" id="btnSelectMonthly">
                        Activate Monthly ($5/mo)
                    </button>
                </div>

                <!-- Annual Plan -->
                <div class="pricing-card-preview" id="cardPlanAnnual">
                    <div class="pricing-card-header">
                        <h3 class="pricing-plan-name">Annual Plan</h3>
                        <div class="pricing-price-row">
                            <span class="pricing-currency-amount">$199</span>
                            <span class="pricing-period">/ year</span>
                        </div>
                        <div class="pricing-billing-terms">Billed annually ($199/year). Single annual payment commitment.</div>
                        <div class="pricing-note">Note: Standard annual rate ($199/yr) vs monthly billing ($5/mo).</div>
                    </div>
                    <ul class="pricing-benefits">
                        <li class="pricing-benefit-item"><span class="pricing-benefit-check">✓</span> 50 Curated Premium DSA Problems</li>
                        <li class="pricing-benefit-item"><span class="pricing-benefit-check">✓</span> Advanced Graph, DP & Tree Challenges</li>
                        <li class="pricing-benefit-item"><span class="pricing-benefit-check">✓</span> Progressive 3-Level Problem Hints</li>
                        <li class="pricing-benefit-item"><span class="pricing-benefit-check">✓</span> 12-Month Pro Preview Membership</li>
                    </ul>
                    <button type="button" class="pricing-action-btn btn-plan-select" data-plan="annual" id="btnSelectAnnual">
                        Activate Annual ($199/yr)
                    </button>
                </div>
            </div>

            <div class="sub-modal-footer-disclaimer">
                <span>ℹ️ Client-side preview membership. No real credit card or payment processing is executed. Clicking an activation button toggles your local session state to Pro preview.</span>
            </div>
        </div>
    </div>
"""

target_scripts = "    <!-- Scripts: Services & Practice Controller -->"
if "subscriptionModalOverlay" not in h:
    assert target_scripts in h, "target_scripts not in practice.html"
    h = h.replace(target_scripts, modal_markup + "\n" + target_scripts, 1)
    with open(PRAC_HTML, "w", encoding="utf-8") as f:
        f.write(h)
    print("practice.html updated with modal.")

# 2. Update practice_hub.js
with open(PRAC_JS, "r", encoding="utf-8") as f:
    js = f.read().replace("\r\n", "\n")

# Update cacheElements
target_js_cache = """            emptyState: document.getElementById('practiceEmptyState'),
            resultsCount: document.getElementById('practiceResultsCount'),
            resetFiltersBtn: document.getElementById('resetPracticeFilters')"""

replacement_js_cache = """            emptyState: document.getElementById('practiceEmptyState'),
            resultsCount: document.getElementById('practiceResultsCount'),
            resetFiltersBtn: document.getElementById('resetPracticeFilters'),
            subModal: document.getElementById('subscriptionModalOverlay'),
            closeSubModalBtn: document.getElementById('btnCloseSubModal'),
            subModalPreviewTitle: document.getElementById('subModalPreviewTitle'),
            subModalPreviewDiff: document.getElementById('subModalPreviewDiff'),
            subModalPreviewTopic: document.getElementById('subModalPreviewTopic'),
            btnSelectMonthly: document.getElementById('btnSelectMonthly'),
            btnSelectAnnual: document.getElementById('btnSelectAnnual')"""

if "subModal:" not in js:
    assert target_js_cache in js, "target_js_cache not in practice_hub.js"
    js = js.replace(target_js_cache, replacement_js_cache, 1)

# Update render card with Pro badge & lock
target_card = """        dom.problemsContainer.innerHTML = filtered.map(p => `
            <div class="practice-problem-card">
                <div class="prob-card-header">
                    <a href="problem.html?id=${encodeURIComponent(p.id || p.slug)}" class="prob-card-title">${escapeHtml(p.title)}</a>
                    <span class="diff-badge ${getDiffClass(p.difficulty)}">${escapeHtml(p.difficulty)}</span>
                </div>
                <div class="prob-card-desc">${renderSafeDescription(p.description || '')}</div>
                <div class="prob-card-footer">
                    <span class="topic-tag">${escapeHtml(p.topic || 'General')}</span>
                    <a href="problem.html?id=${encodeURIComponent(p.id || p.slug)}" class="prob-btn-solve">
                        Practice <span aria-hidden="true">→</span>
                    </a>
                </div>
            </div>
        `).join('');"""

replacement_card = """        const userIsPro = Boolean(
            window.CodeArenaAPI &&
            window.CodeArenaAPI.subscriptionService &&
            window.CodeArenaAPI.subscriptionService.isPremium()
        );

        dom.problemsContainer.innerHTML = filtered.map(p => {
            const isPro = Boolean(p.isPremium);
            const isLocked = isPro && !userIsPro;
            const proBadge = isPro ? '<span class="badge-pro" style="margin-left: 6px;">PRO</span>' : '<span class="badge-free" style="margin-left: 6px;">FREE</span>';
            const lockIcon = isLocked ? '<span class="pro-lock-icon">🔒</span>' : '';
            const actionLabel = isLocked ? '🔒 Unlock Pro' : 'Practice →';
            const cardHref = isLocked ? '#' : `problem.html?id=${encodeURIComponent(p.id || p.slug)}`;

            return `
                <div class="practice-problem-card ${isLocked ? 'card-locked' : ''}">
                    <div class="prob-card-header">
                        <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                            ${lockIcon}
                            <a href="${cardHref}" class="prob-card-title ${isLocked ? 'link-locked' : ''}" data-id="${escapeHtml(p.id || p.slug)}">${escapeHtml(p.title)}</a>
                            ${proBadge}
                        </div>
                        <span class="diff-badge ${getDiffClass(p.difficulty)}">${escapeHtml(p.difficulty)}</span>
                    </div>
                    <div class="prob-card-desc">${renderSafeDescription(p.description || '')}</div>
                    <div class="prob-card-footer">
                        <span class="topic-tag">${escapeHtml(p.topic || 'General')}</span>
                        <a href="${cardHref}" class="prob-btn-solve ${isLocked ? 'btn-solve-locked' : ''}" data-id="${escapeHtml(p.id || p.slug)}">
                            ${actionLabel}
                        </a>
                    </div>
                </div>
            `;
        }).join('');

        // Intercept locked card clicks
        dom.problemsContainer.querySelectorAll('.btn-solve-locked, .link-locked').forEach(el => {
            el.addEventListener('click', function (e) {
                e.preventDefault();
                const pid = this.getAttribute('data-id');
                const prob = state.problems.find(x => (x.id === pid || x.slug === pid));
                if (prob) openSubscriptionModal(prob);
            });
        });"""

if "card-locked" not in js:
    assert target_card in js, "target_card not in practice_hub.js"
    js = js.replace(target_card, replacement_card, 1)

# Add modal handlers to practice_hub.js
modal_code = """
    let pendingModalProblem = null;

    function openSubscriptionModal(problem) {
        pendingModalProblem = problem;
        if (dom.subModalPreviewTitle) dom.subModalPreviewTitle.textContent = problem.title || 'Advanced Challenge';
        if (dom.subModalPreviewDiff) {
            dom.subModalPreviewDiff.textContent = problem.difficulty || 'Hard';
            dom.subModalPreviewDiff.className = 'diff-badge ' + getDiffClass(problem.difficulty);
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
            filterAndRenderProblems();
            if (targetProb) {
                setTimeout(function () {
                    window.location.href = `problem.html?id=${encodeURIComponent(targetProb.id || targetProb.slug)}`;
                }, 350);
            }
        }
    }
"""

if "function openSubscriptionModal(" not in js:
    js = js.replace("    function getDiffClass(", modal_code + "\n    function getDiffClass(")

# Add modal event listeners to bindEvents in practice_hub.js
target_bind_end = """                const allCard = document.querySelector('.practice-topic-card[data-topic="All"]');
                if (allCard) allCard.classList.add('active');
                filterAndRenderProblems();
            });
        }
    }"""

replacement_bind_end = """                const allCard = document.querySelector('.practice-topic-card[data-topic="All"]');
                if (allCard) allCard.classList.add('active');
                filterAndRenderProblems();
            });
        }

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
            dom.btnSelectMonthly.addEventListener('click', () => activatePlanAndRefresh('monthly'));
        }
        if (dom.btnSelectAnnual) {
            dom.btnSelectAnnual.addEventListener('click', () => activatePlanAndRefresh('annual'));
        }
    }"""

if "dom.closeSubModalBtn.addEventListener" not in js:
    assert target_bind_end in js, "target_bind_end not in practice_hub.js"
    js = js.replace(target_bind_end, replacement_bind_end, 1)

with open(PRAC_JS, "w", encoding="utf-8") as f:
    f.write(js)

print("practice_hub.js updated with Pro badges, modal, and subscription activation.")

