# update_dashboard_real_data.py

with open('frontend/pages/dashboard.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update Platform Overview section in dashboard.html
old_stats = """                    <div class="section-title-bar">
                        <div class="title-with-desc">
                            <h2 id="platformStatsHeading" class="section-badge-title">Platform Overview</h2>
                            <span class="section-badge-subtitle">Provisional catalogue figures · Dynamic database metrics synchronize in backend phase</span>
                        </div>
                        <span class="section-badge-tag">Provisional Catalogue Data</span>
                    </div>
                    <div class="stats-row">
                        <div class="stat-card">
                            <div class="stat-icon-wrapper stat-green" aria-hidden="true">
                                <span class="stat-icon-symbol">✓</span>
                            </div>
                            <div class="stat-details">
                                <span class="stat-label">Total Problems</span>
                                <span class="stat-value">150+</span>
                                <span class="stat-desc">Solve and improve</span>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon-wrapper stat-purple" aria-hidden="true">
                                <span class="stat-icon-symbol">📖</span>
                            </div>
                            <div class="stat-details">
                                <span class="stat-label">Topics</span>
                                <span class="stat-value">12</span>
                                <span class="stat-desc">Explore topics</span>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon-wrapper stat-amber" aria-hidden="true">
                                <span class="stat-icon-symbol">🏆</span>
                            </div>
                            <div class="stat-details">
                                <span class="stat-label">Contests</span>
                                <span class="stat-value">5</span>
                                <span class="stat-desc">Join and compete</span>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon-wrapper stat-blue" aria-hidden="true">
                                <span class="stat-icon-symbol">📊</span>
                            </div>
                            <div class="stat-details">
                                <span class="stat-label">Learning Resources</span>
                                <span class="stat-value">50+</span>
                                <span class="stat-desc">Guides &amp; tutorials</span>
                            </div>
                        </div>
                    </div>"""

new_stats = """                    <div class="section-title-bar">
                        <div class="title-with-desc">
                            <h2 id="platformStatsHeading" class="section-badge-title">Platform Overview</h2>
                            <span class="section-badge-subtitle">Canonical catalogue figures · Synchronized across active problem modules</span>
                        </div>
                        <span class="section-badge-tag">Canonical Catalogue Data</span>
                    </div>
                    <div class="stats-row">
                        <div class="stat-card">
                            <div class="stat-icon-wrapper stat-green" aria-hidden="true">
                                <span class="stat-icon-symbol">✓</span>
                            </div>
                            <div class="stat-details">
                                <span class="stat-label">Total Problems</span>
                                <span class="stat-value" id="dashStatProblems">12</span>
                                <span class="stat-desc">Canonical challenges</span>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon-wrapper stat-purple" aria-hidden="true">
                                <span class="stat-icon-symbol">📖</span>
                            </div>
                            <div class="stat-details">
                                <span class="stat-label">Topics</span>
                                <span class="stat-value" id="dashStatTopics">10</span>
                                <span class="stat-desc">Targeted categories</span>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon-wrapper stat-amber" aria-hidden="true">
                                <span class="stat-icon-symbol">🏆</span>
                            </div>
                            <div class="stat-details">
                                <span class="stat-label">Contests</span>
                                <span class="stat-value" id="dashStatContests">4</span>
                                <span class="stat-desc">Tournament schedules</span>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon-wrapper stat-blue" aria-hidden="true">
                                <span class="stat-icon-symbol">📊</span>
                            </div>
                            <div class="stat-details">
                                <span class="stat-label">Learning Paths</span>
                                <span class="stat-value" id="dashStatLearn">14</span>
                                <span class="stat-desc">Core curriculum paths</span>
                            </div>
                        </div>
                    </div>"""

assert old_stats in html, "old_stats not found in dashboard.html"
html = html.replace(old_stats, new_stats)

# 2. Add data-id attributes to problem articles
html = html.replace(
    '<article class="problem-item" tabindex="0" role="link" aria-label="Solve Two Sum">',
    '<article class="problem-item" tabindex="0" role="link" aria-label="Solve Two Sum" data-id="two-sum">'
)
html = html.replace(
    '<article class="problem-item" tabindex="0" role="link" aria-label="Solve Reverse a String">',
    '<article class="problem-item" tabindex="0" role="link" aria-label="Solve Reverse a String" data-id="reverse-string">'
)
html = html.replace(
    '<article class="problem-item" tabindex="0" role="link" aria-label="Solve Valid Parentheses">',
    '<article class="problem-item" tabindex="0" role="link" aria-label="Solve Valid Parentheses" data-id="valid-parentheses">'
)
html = html.replace(
    '<article class="problem-item" tabindex="0" role="link" aria-label="Solve Merge K Sorted Lists">',
    '<article class="problem-item" tabindex="0" role="link" aria-label="Solve Merge K Sorted Lists" data-id="merge-k-sorted-lists">'
)
html = html.replace(
    '<article class="problem-item" tabindex="0" role="link" aria-label="Solve Binary Search">',
    '<article class="problem-item" tabindex="0" role="link" aria-label="Solve Binary Search" data-id="binary-search">'
)

with open('frontend/pages/dashboard.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("dashboard.html updated with real catalogue stats and problem IDs")

# 3. Update dashboard.js
with open('frontend/js/dashboard.js', 'r', encoding='utf-8') as f:
    js = f.read()

old_prob_nav = """    const problemItems = document.querySelectorAll('.problem-item');
    problemItems.forEach(function (item) {
        function navigate() {
            window.location.href = 'problems.html';
        }

        item.addEventListener('click', navigate);
        item.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate();
            }
        });
    });"""

new_prob_nav = """    const problemItems = document.querySelectorAll('.problem-item');
    problemItems.forEach(function (item) {
        const problemId = item.getAttribute('data-id');
        function navigate() {
            if (problemId) {
                window.location.href = `problem.html?id=${encodeURIComponent(problemId)}`;
            } else {
                window.location.href = 'problems.html';
            }
        }

        item.addEventListener('click', navigate);
        item.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate();
            }
        });
    });

    // Populate dynamic stats from canonical API service if available
    try {
        if (window.CodeArenaAPI && window.CodeArenaAPI.problemService) {
            window.CodeArenaAPI.problemService.getProblems({ limit: 100 }).then(res => {
                if (res && res.success && res.data && res.data.problems) {
                    const el = document.getElementById('dashStatProblems');
                    if (el) el.textContent = res.data.problems.length;
                }
            }).catch(() => {});

            window.CodeArenaAPI.problemService.getTopics().then(res => {
                if (res && res.success && res.data && res.data.topics) {
                    const el = document.getElementById('dashStatTopics');
                    if (el) el.textContent = res.data.topics.length;
                }
            }).catch(() => {});
        }
    } catch (e) {}"""

assert old_prob_nav in js, "old_prob_nav not found in dashboard.js"
js = js.replace(old_prob_nav, new_prob_nav)

with open('frontend/js/dashboard.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("dashboard.js updated with problem workspace links and API stats sync")

