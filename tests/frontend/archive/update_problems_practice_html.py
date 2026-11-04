# update_problems_practice_html.py

# 1. Update problems.html
with open('frontend/pages/problems.html', 'r', encoding='utf-8') as f:
    p_html = f.read()

# Add wrapper & suggestions around catalogueSearchInput
search_old = '<input type="search" id="catalogueSearchInput" class="catalogue-search-input" placeholder="Search by title, topic, or keyword..." aria-label="Search problems">'
search_new = """<div class="catalogue-search-wrapper">
                        <input type="search" id="catalogueSearchInput" class="catalogue-search-input" placeholder="Search by title, topic, or keyword..." aria-label="Search problems" autocomplete="off">
                        <div class="catalogue-search-suggestions" id="catalogueSearchSuggestions" role="listbox" aria-label="Search suggestions" style="display: none;"></div>
                    </div>"""

if search_old in p_html:
    p_html = p_html.replace(search_old, search_new, 1)
    print("Replaced catalogueSearchInput in problems.html")
else:
    print("Warning: search_old not found in problems.html")

# Add recently viewed section before catalogueLoadingState
loading_old = '<!-- Loading Spinner State -->'
recent_section_problems = """<!-- Recently Viewed Problems Section (Phase 6) -->
            <section class="recently-viewed-card" id="recentlyViewedSection" style="display: none;" aria-label="Recently Viewed Problems">
                <div class="recently-viewed-header">
                    <div class="recently-viewed-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span>Recently Viewed Problems</span>
                    </div>
                    <button type="button" class="btn-clear-history" id="btnClearRecentlyViewed">Clear History</button>
                </div>
                <div class="recently-viewed-grid" id="recentlyViewedGrid"></div>
            </section>

            <!-- Loading Spinner State -->"""

if loading_old in p_html:
    p_html = p_html.replace(loading_old, recent_section_problems, 1)
    print("Added recently viewed section to problems.html")
else:
    print("Warning: loading_old not found in problems.html")

# Add toast.js
if '<script src="../js/toast.js"></script>' not in p_html:
    p_html = p_html.replace('<script src="../js/problems.js"></script>', '<script src="../js/toast.js"></script>\n    <script src="../js/problems.js"></script>')
    print("Added toast.js to problems.html")

with open('frontend/pages/problems.html', 'w', encoding='utf-8') as f:
    f.write(p_html)

# 2. Update practice.html
with open('frontend/pages/practice.html', 'r', encoding='utf-8') as f:
    pr_html = f.read()

rec_old = '<section class="practice-recommended-section"'
recent_section_practice = """<!-- Recently Viewed Challenges Section (Phase 6) -->
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

            <section class="practice-recommended-section\""""

if rec_old in pr_html:
    pr_html = pr_html.replace(rec_old, recent_section_practice, 1)
    print("Added recently viewed section to practice.html")
else:
    print("Warning: rec_old not found in practice.html")

if '<script src="../js/toast.js"></script>' not in pr_html:
    pr_html = pr_html.replace('<script src="../js/practice_hub.js"></script>', '<script src="../js/toast.js"></script>\n    <script src="../js/practice_hub.js"></script>')
    print("Added toast.js to practice.html")

with open('frontend/pages/practice.html', 'w', encoding='utf-8') as f:
    f.write(pr_html)

print("HTML updates for problems & practice completed.")

