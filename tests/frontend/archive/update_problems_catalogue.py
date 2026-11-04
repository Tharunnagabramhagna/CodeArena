# tests/frontend/utils/update_problems_catalogue.py
import os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
CAT_HTML = os.path.join(ROOT, "frontend", "pages", "problems.html")

with open(CAT_HTML, "r", encoding="utf-8") as f:
    c = f.read().replace("\r\n", "\n")

# 1. Update Hero stats
target_stats = """                <div class="catalogue-hero-stats" aria-label="Catalogue Overview Stats">
                    <div class="hero-stat-pill">
                        <span class="hero-stat-val" id="heroTotalProblems">192</span>
                        <span class="hero-stat-lbl">DSA Problems</span>
                    </div>
                    <div class="hero-stat-pill">
                        <span class="hero-stat-val" id="heroTotalTopics">12</span>
                        <span class="hero-stat-lbl">Core Topics</span>
                    </div>
                    <div class="hero-stat-pill">
                        <span class="hero-stat-val" id="heroTotalPatterns">63</span>
                        <span class="hero-stat-lbl">Algorithmic Patterns</span>
                    </div>
                </div>"""

replacement_stats = """                <div class="catalogue-hero-stats" aria-label="Catalogue Overview Stats">
                    <div class="hero-stat-pill">
                        <span class="hero-stat-val" id="heroTotalProblems">200</span>
                        <span class="hero-stat-lbl">DSA Problems</span>
                    </div>
                    <div class="hero-stat-pill">
                        <span class="hero-stat-val" id="heroFreeProblems">150</span>
                        <span class="hero-stat-lbl">Free Challenges</span>
                    </div>
                    <div class="hero-stat-pill">
                        <span class="hero-stat-val" id="heroPremiumProblems">50</span>
                        <span class="hero-stat-lbl">Pro Challenges</span>
                    </div>
                    <div class="hero-stat-pill">
                        <span class="hero-stat-val" id="heroTotalTopics">12</span>
                        <span class="hero-stat-lbl">Core Topics</span>
                    </div>
                    <div class="hero-stat-pill">
                        <span class="hero-stat-val" id="heroTotalPatterns">63</span>
                        <span class="hero-stat-lbl">Patterns</span>
                    </div>
                </div>"""

assert target_stats in c, "Could not find target_stats in problems.html"
c = c.replace(target_stats, replacement_stats, 1)

# 2. Add access filter in controls
target_pattern_filter = """                        <!-- Pattern (Populated dynamically) -->
                        <div class="catalogue-select-control">
                            <select id="patternFilter" class="filter-select" aria-label="Filter by Algorithmic Pattern">
                                <option value="All">All Patterns</option>
                            </select>
                            <svg class="select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                        </div>"""

replacement_pattern_filter = """                        <!-- Pattern (Populated dynamically) -->
                        <div class="catalogue-select-control">
                            <select id="patternFilter" class="filter-select" aria-label="Filter by Algorithmic Pattern">
                                <option value="All">All Patterns</option>
                            </select>
                            <svg class="select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                        </div>

                        <!-- Access Filter (All, Free, Premium) -->
                        <div class="catalogue-select-control">
                            <select id="accessFilter" class="filter-select" aria-label="Filter by Access Level">
                                <option value="All">All Access</option>
                                <option value="Free">Free Only</option>
                                <option value="Premium">Premium (Pro)</option>
                            </select>
                            <svg class="select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                        </div>"""

assert target_pattern_filter in c, "Could not find target_pattern_filter in problems.html"
c = c.replace(target_pattern_filter, replacement_pattern_filter, 1)

# 3. Add Subscription Upgrade Modal markup before closing main or body
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

target_closing = "    <!-- Scripts: CodeArena API & Problems Controller -->"
assert target_closing in c, "Could not find closing scripts in problems.html"
c = c.replace(target_closing, modal_markup + "\n" + target_closing, 1)

with open(CAT_HTML, "w", encoding="utf-8") as f:
    f.write(c)

print("problems.html updated with access filter, hero stats, and Pro modal successfully.")
