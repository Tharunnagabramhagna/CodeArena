# fix_remaining_three.py

# 1. Update ai_assistant.html
with open('frontend/pages/ai_assistant.html', 'r', encoding='utf-8') as f:
    ai_html = f.read()

target_chip = 'data-prompt="How does Java Garbage Collection work on the Heap?">'
idx = ai_html.find(target_chip)
if idx != -1:
    btn_end = ai_html.find('</button>', idx)
    if btn_end != -1:
        insert_pos = btn_end + len('</button>')
        new_buttons = """
                            <button type="button" class="prompt-chip-btn" data-prompt="Explain Java 8 Streams and Lambdas with an example.">
                                🌊 Java 8 Streams & Lambdas
                            </button>
                            <button type="button" class="prompt-chip-btn" data-prompt="What is the difference between Checked and Unchecked Exceptions in Java?">
                                ⚠️ Checked vs Unchecked Exceptions
                            </button>"""
        ai_html = ai_html[:insert_pos] + new_buttons + ai_html[insert_pos:]
        with open('frontend/pages/ai_assistant.html', 'w', encoding='utf-8') as f:
            f.write(ai_html)
        print("Updated prompt chips in ai_assistant.html")
    else:
        print("Warning: </button> not found in ai_assistant.html")
else:
    print("Warning: target_chip not found in ai_assistant.html")

# 2. Update bookmarks.html
with open('frontend/pages/bookmarks.html', 'r', encoding='utf-8') as f:
    b_html = f.read()

diff_sel_end = '</select>'
diff_idx = b_html.find('id="bookmarksDiffFilter"')
if diff_idx != -1:
    close_idx = b_html.find(diff_sel_end, diff_idx)
    if close_idx != -1:
        insert_pos = close_idx + len(diff_sel_end)
        topic_select = """
                    <select id="bookmarksTopicFilter" class="feature-select" aria-label="Filter bookmarks by topic">
                        <option value="All">All Topics</option>
                    </select>"""
        b_html = b_html[:insert_pos] + topic_select + b_html[insert_pos:]
        with open('frontend/pages/bookmarks.html', 'w', encoding='utf-8') as f:
            f.write(b_html)
        print("Added bookmarksTopicFilter to bookmarks.html")
    else:
        print("Warning: </select> not found for bookmarksDiffFilter")
else:
    print("Warning: bookmarksDiffFilter not found in bookmarks.html")

# 3. Update contests.js
with open('frontend/js/contests.js', 'r', encoding='utf-8') as f:
    c_js = f.read()

old_toggle = """            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                if (state.registeredContests.includes(id)) {
                    state.registeredContests = state.registeredContests.filter(cid => cid !== id);
                } else {
                    state.registeredContests.push(id);
                }
                saveRegistrations();
                renderContests();
            });"""

new_toggle = """            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                const contestObj = CONTESTS_DATA.find(item => item.id === id);
                const title = contestObj ? contestObj.title : 'Contest';
                if (state.registeredContests.includes(id)) {
                    state.registeredContests = state.registeredContests.filter(cid => cid !== id);
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

if old_toggle in c_js:
    c_js = c_js.replace(old_toggle, new_toggle, 1)
    with open('frontend/js/contests.js', 'w', encoding='utf-8') as f:
        f.write(c_js)
    print("Updated contests.js registration with CodeArenaToast")
else:
    print("Warning: old_toggle not found in contests.js")

