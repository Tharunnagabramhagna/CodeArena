# fix_problems_practice_html.py

with open('frontend/pages/problems.html', 'r', encoding='utf-8') as f:
    p_html = f.read()

target = '                        <input type="text" id="catalogueSearchInput" class="catalogue-search-input" placeholder="Search by problem title, topic, or keyword..." aria-label="Search problems">'
replacement = """                        <div class="catalogue-search-wrapper">
                            <input type="text" id="catalogueSearchInput" class="catalogue-search-input" placeholder="Search by problem title, topic, or keyword..." aria-label="Search problems" autocomplete="off">
                            <div class="catalogue-search-suggestions" id="catalogueSearchSuggestions" role="listbox" aria-label="Search suggestions" style="display: none;"></div>
                        </div>"""

if target in p_html:
    p_html = p_html.replace(target, replacement, 1)
    with open('frontend/pages/problems.html', 'w', encoding='utf-8') as f:
        f.write(p_html)
    print("Fixed catalogueSearchInput in problems.html")
else:
    print("Warning: target not found in problems.html")

with open('frontend/pages/practice.html', 'r', encoding='utf-8') as f:
    pr_html = f.read()

target_pr = '            <!-- Recommended Starters Section -->'
replacement_pr = """            <!-- Recently Viewed Challenges Section (Phase 6) -->
            <section class="recently-viewed-card" id="practiceRecentlyViewedSection" style="display: none; margin-bottom: 24px;" aria-label="Recently Viewed Challenges">
                <div class="recently-viewed-header">
                    <div class="recently-viewed-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span>Recently Viewed Challenges</span>
                    </div>
                    <button type="button" class="btn-clear-history" id="btnPracticeClearRecentlyViewed">Clear History</button>
                </div>
                <div class="recently-viewed-grid" id="practiceRecentlyViewedGrid"></div>
            </section>

            <!-- Recommended Starters Section -->"""

if target_pr in pr_html:
    pr_html = pr_html.replace(target_pr, replacement_pr, 1)
    with open('frontend/pages/practice.html', 'w', encoding='utf-8') as f:
        f.write(pr_html)
    print("Fixed practiceRecentlyViewedSection in practice.html")
else:
    print("Warning: target_pr not found in practice.html")

