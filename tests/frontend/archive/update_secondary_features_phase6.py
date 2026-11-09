# update_secondary_features_phase6.py

# 1. Update bookmarks.html
with open('frontend/pages/bookmarks.html', 'r', encoding='utf-8') as f:
    b_html = f.read()

# Add topic filter to bookmarks.html
diff_filter_target = """                    <select id="bookmarksDiffFilter" class="secondary-select" aria-label="Filter by Difficulty">
                        <option value="All">All Difficulties</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>"""

diff_and_topic_filter = """                    <select id="bookmarksDiffFilter" class="secondary-select" aria-label="Filter by Difficulty">
                        <option value="All">All Difficulties</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                    <select id="bookmarksTopicFilter" class="secondary-select" aria-label="Filter by Topic">
                        <option value="All">All Topics</option>
                    </select>"""

if diff_filter_target in b_html and 'bookmarksTopicFilter' not in b_html:
    b_html = b_html.replace(diff_filter_target, diff_and_topic_filter, 1)
    print("Added bookmarksTopicFilter to bookmarks.html")

# Add toast.js to bookmarks.html
if '<script src="../js/toast.js"></script>' not in b_html:
    b_html = b_html.replace('<script src="../js/bookmarks.js"></script>', '<script src="../js/toast.js"></script>\n    <script src="../js/bookmarks.js"></script>')
    print("Added toast.js to bookmarks.html")

with open('frontend/pages/bookmarks.html', 'w', encoding='utf-8') as f:
    f.write(b_html)

# 2. Update bookmarks.js
with open('frontend/js/bookmarks.js', 'r', encoding='utf-8') as f:
    b_js = f.read()

# Add selectedTopic to state
if "selectedTopic: 'All'" not in b_js:
    b_js = b_js.replace("selectedDifficulty: 'All',", "selectedDifficulty: 'All',\n        selectedTopic: 'All',", 1)

# Cache bookmarksTopicFilter
if "topicFilter: document.getElementById('bookmarksTopicFilter')" not in b_js:
    b_js = b_js.replace("diffFilter: document.getElementById('bookmarksDiffFilter'),", "diffFilter: document.getElementById('bookmarksDiffFilter'),\n            topicFilter: document.getElementById('bookmarksTopicFilter'),", 1)

# Bind topicFilter and add toast on remove & clear all
old_bind_b = """        if (dom.diffFilter) {
            dom.diffFilter.addEventListener('change', function (e) {
                state.selectedDifficulty = e.target.value;
                renderBookmarks();
            });
        }"""

new_bind_b = """        if (dom.diffFilter) {
            dom.diffFilter.addEventListener('change', function (e) {
                state.selectedDifficulty = e.target.value;
                renderBookmarks();
            });
        }

        if (dom.topicFilter) {
            dom.topicFilter.addEventListener('change', function (e) {
                state.selectedTopic = e.target.value;
                renderBookmarks();
            });
        }"""

if old_bind_b in b_js and 'dom.topicFilter.addEventListener' not in b_js:
    b_js = b_js.replace(old_bind_b, new_bind_b, 1)

# Populate topic options in loadData
old_load_data = """        if (window.CodeArenaAPI && window.CodeArenaAPI.problemService) {
            const res = await window.CodeArenaAPI.problemService.getProblems({ limit: 100 });
            state.canonicalProblems = (res && res.data) ? res.data : [];
        }"""

new_load_data = """        if (window.CodeArenaAPI && window.CodeArenaAPI.problemService) {
            const res = await window.CodeArenaAPI.problemService.getProblems({ limit: 100 });
            state.canonicalProblems = (res && res.data) ? res.data : [];

            if (dom.topicFilter && typeof window.CodeArenaAPI.problemService.getTopics === 'function') {
                const topicsRes = await window.CodeArenaAPI.problemService.getTopics();
                const topics = (topicsRes && topicsRes.data) ? topicsRes.data : [];
                dom.topicFilter.innerHTML = '<option value="All">All Topics</option>' + 
                    topics.map(t => `<option value="${escapeHtml(t.name)}">${escapeHtml(t.name)}</option>`).join('');
            }
        }"""

if old_load_data in b_js and 'dom.topicFilter.innerHTML' not in b_js:
    b_js = b_js.replace(old_load_data, new_load_data, 1)

# Filter by selectedTopic in renderBookmarks
old_filter_logic = """            if (state.selectedDifficulty !== 'All' && (p.difficulty || '').toLowerCase() !== state.selectedDifficulty.toLowerCase()) {
                return false;
            }"""

new_filter_logic = """            if (state.selectedDifficulty !== 'All' && (p.difficulty || '').toLowerCase() !== state.selectedDifficulty.toLowerCase()) {
                return false;
            }
            if (state.selectedTopic !== 'All' && (p.topic || '').toLowerCase() !== state.selectedTopic.toLowerCase()) {
                return false;
            }"""

if old_filter_logic in b_js and "state.selectedTopic !== 'All'" not in b_js:
    b_js = b_js.replace(old_filter_logic, new_filter_logic, 1)

# Toast on remove
old_remove_bind = """            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                BookmarkStorage.remove(id);
                renderBookmarks();
            });"""

new_remove_bind = """            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                BookmarkStorage.remove(id);
                renderBookmarks();
                if (window.CodeArenaToast) {
                    window.CodeArenaToast.info('Problem removed from bookmarks');
                }
            });"""

if old_remove_bind in b_js:
    b_js = b_js.replace(old_remove_bind, new_remove_bind, 1)

# Confirmation & toast on clearAllBtn
old_clear_all = """        if (dom.clearAllBtn) {
            dom.clearAllBtn.addEventListener('click', function () {
                BookmarkStorage.set([]);
                renderBookmarks();
            });
        }"""

new_clear_all = """        if (dom.clearAllBtn) {
            dom.clearAllBtn.addEventListener('click', function () {
                if (confirm('Are you sure you want to remove all saved bookmarks?')) {
                    BookmarkStorage.set([]);
                    renderBookmarks();
                    if (window.CodeArenaToast) {
                        window.CodeArenaToast.info('All bookmarks cleared');
                    }
                }
            });
        }"""

if old_clear_all in b_js:
    b_js = b_js.replace(old_clear_all, new_clear_all, 1)

with open('frontend/js/bookmarks.js', 'w', encoding='utf-8') as f:
    f.write(b_js)
print("Updated bookmarks.html and bookmarks.js")

# 3. Update contests.html and contests.js
with open('frontend/pages/contests.html', 'r', encoding='utf-8') as f:
    c_html = f.read()

if '<script src="../js/toast.js"></script>' not in c_html:
    c_html = c_html.replace('<script src="../js/contests.js"></script>', '<script src="../js/toast.js"></script>\n    <script src="../js/contests.js"></script>')
    with open('frontend/pages/contests.html', 'w', encoding='utf-8') as f:
        f.write(c_html)
    print("Added toast.js to contests.html")

with open('frontend/js/contests.js', 'r', encoding='utf-8') as f:
    c_js = f.read()

old_reg_toggle = """            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                if (state.registeredContests.includes(id)) {
                    state.registeredContests = state.registeredContests.filter(cId => cId !== id);
                } else {
                    state.registeredContests.push(id);
                }
                saveRegistrations();
                renderContests();
            });"""

new_reg_toggle = """            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                const contestObj = CONTESTS_DATA.find(item => item.id === id);
                const title = contestObj ? contestObj.title : 'Contest';
                if (state.registeredContests.includes(id)) {
                    state.registeredContests = state.registeredContests.filter(cId => cId !== id);
                    if (window.CodeArenaToast) {
                        window.CodeArenaToast.info(`Unregistered from ${title}`);
                    }
                } else {
                    state.registeredContests.push(id);
                    if (window.CodeArenaToast) {
                        window.CodeArenaToast.success(`Simulated preview registration confirmed for ${title}!`);
                    }
                }
                saveRegistrations();
                renderContests();
            });"""

if old_reg_toggle in c_js:
    c_js = c_js.replace(old_reg_toggle, new_reg_toggle, 1)
    with open('frontend/js/contests.js', 'w', encoding='utf-8') as f:
        f.write(c_js)
    print("Added toast to contests.js registration")

# 4. Update submissions.html and submissions.js
with open('frontend/pages/submissions.html', 'r', encoding='utf-8') as f:
    sub_html = f.read()

if '<script src="../js/toast.js"></script>' not in sub_html:
    sub_html = sub_html.replace('<script src="../js/submissions.js"></script>', '<script src="../js/toast.js"></script>\n    <script src="../js/submissions.js"></script>')
    with open('frontend/pages/submissions.html', 'w', encoding='utf-8') as f:
        f.write(sub_html)
    print("Added toast.js to submissions.html")

with open('frontend/js/submissions.js', 'r', encoding='utf-8') as f:
    sub_js = f.read()

old_copy_sub = """        if (dom.copyCodeBtn) {
            dom.copyCodeBtn.onclick = function () {
                if (submission.sourceCode) {
                    navigator.clipboard.writeText(submission.sourceCode).then(() => {
                        this.textContent = 'Copied!';
                        setTimeout(() => { this.textContent = 'Copy Code'; }, 1800);
                    });
                }
            };
        }"""

new_copy_sub = """        if (dom.copyCodeBtn) {
            dom.copyCodeBtn.onclick = function () {
                if (submission.sourceCode) {
                    navigator.clipboard.writeText(submission.sourceCode).then(() => {
                        this.textContent = 'Copied!';
                        if (window.CodeArenaToast) {
                            window.CodeArenaToast.success('Submission source code copied to clipboard');
                        }
                        setTimeout(() => { this.textContent = 'Copy Code'; }, 1800);
                    }).catch(() => {
                        if (window.CodeArenaToast) {
                            window.CodeArenaToast.error('Failed to copy code to clipboard');
                        }
                    });
                }
            };
        }"""

if old_copy_sub in sub_js:
    sub_js = sub_js.replace(old_copy_sub, new_copy_sub, 1)
    with open('frontend/js/submissions.js', 'w', encoding='utf-8') as f:
        f.write(sub_js)
    print("Added toast to submissions.js copyCode")

print("Secondary features updates completed.")

