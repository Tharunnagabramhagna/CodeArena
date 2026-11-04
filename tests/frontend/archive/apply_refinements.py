# apply_refinements.py
import os
import re

def update_bookmarks_js():
    path = 'frontend/js/bookmarks.js'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. inMemoryBookmarks empty
    content = re.sub(
        r"let inMemoryBookmarks\s*=\s*\[[^\]]*\];",
        "let inMemoryBookmarks = [];",
        content
    )

    # 2. BookmarkStorage.get() logic - do not seed demo bookmarks
    old_get = """        get() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) return parsed;
                } else {
                    // Seed initial demo bookmarks on first visit
                    this.set(inMemoryBookmarks);
                    return inMemoryBookmarks;
                }
            } catch (e) {
                console.warn('[Bookmarks] localStorage unavailable, using in-memory store:', e);
            }
            return inMemoryBookmarks;
        },"""

    new_get = """        get() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (raw !== null) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) return parsed;
                }
            } catch (e) {
                console.warn('[Bookmarks] localStorage unavailable, using in-memory store:', e);
            }
            return inMemoryBookmarks.slice();
        },"""

    if old_get in content:
        content = content.replace(old_get, new_get)
        print("Updated BookmarkStorage.get() in bookmarks.js")
    else:
        print("Warning: old_get not found in bookmarks.js")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Saved bookmarks.js")


def update_problems_js():
    path = 'frontend/js/problems.js'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # In renderTableRows, load bookmarkedIds and show indicator
    target = """    function renderTableRows(problems) {
        dom.tableBody.innerHTML = '';

        problems.forEach(function (problem, index) {"""

    replacement = """    function renderTableRows(problems) {
        dom.tableBody.innerHTML = '';

        let bookmarkedIds = [];
        try {
            const bmRaw = localStorage.getItem('codearena_guest_bookmarks');
            if (bmRaw) {
                const parsed = JSON.parse(bmRaw);
                if (Array.isArray(parsed)) bookmarkedIds = parsed;
            }
        } catch (e) {}

        problems.forEach(function (problem, index) {
            const isBookmarked = bookmarkedIds.includes(problem.id) || bookmarkedIds.includes(problem.slug);
            const bookmarkIconHtml = isBookmarked
                ? `<span class="catalogue-bookmark-indicator" title="Bookmarked in your challenges" style="color: #F59E0B; margin-left: 6px; font-size: 0.85rem;" aria-label="Bookmarked">🔖</span>`
                : '';"""

    if target in content and replacement not in content:
        content = content.replace(target, replacement)
        print("Added bookmarkedIds check to renderTableRows in problems.js")

    old_title_link = """                        <a href="problem.html?id=${encodeURIComponent(problem.id)}" class="problem-link-title" title="Open ${escapeHtml(problem.title)}">
                            <span>${escapeHtml(problem.title)}</span>
                        </a>"""

    new_title_link = """                        <a href="problem.html?id=${encodeURIComponent(problem.id)}" class="problem-link-title" title="Open ${escapeHtml(problem.title)}">
                            <span>${escapeHtml(problem.title)}</span>
                        </a>${bookmarkIconHtml}"""

    if old_title_link in content and bookmarkIconHtml not in content if 'bookmarkIconHtml' in locals() else True:
        if new_title_link not in content:
            content = content.replace(old_title_link, new_title_link)
            print("Added bookmarkIconHtml to title cell in problems.js")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Saved problems.js")


def update_workspace_js():
    path = 'frontend/js/workspace.js'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add missing function saveRecentlyViewedProblem
    func_code = """
    /**
     * Records visited problem to Recently Viewed list (Phase 6)
     * Strict deduplication, capped at 5 problems, called exclusively
     * when a valid problem workspace is loaded.
     */
    function saveRecentlyViewedProblem(problem) {
        if (!problem || !problem.id) return;
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const raw = window.localStorage.getItem('codearena_recently_viewed');
                let list = [];
                if (raw) {
                    try { list = JSON.parse(raw); } catch (e) { list = []; }
                }
                if (!Array.isArray(list)) list = [];
                list = list.filter(function (item) { return item && item.id && item.id !== problem.id; });
                list.unshift({
                    id: problem.id,
                    title: problem.title || problem.id,
                    difficulty: problem.difficulty || 'Easy',
                    topic: problem.topic || 'General',
                    timestamp: Date.now()
                });
                list = list.slice(0, 5);
                window.localStorage.setItem('codearena_recently_viewed', JSON.stringify(list));
            }
        } catch (e) {}
    }
"""
    if "function saveRecentlyViewedProblem" not in content:
        idx = content.rfind('})();')
        if idx != -1:
            content = content[:idx] + func_code + "\n" + content[idx:]
            print("Appended function saveRecentlyViewedProblem to workspace.js")

    # 2. Auto-save draft on editor change and support autoRunSampleTests
    target_change = """                // Listen for edits to mark results as stale
                codeEditor.on('change', function () {
                    if (lastEvaluationResult) {
                        markResultsStale();
                    }
                });"""

    new_change = """                // Listen for edits to mark results as stale
                codeEditor.on('change', function () {
                    if (lastEvaluationResult) {
                        markResultsStale();
                    }
                });

                // Auto-save per-problem draft to sessionStorage (Phase 6 Code Draft Isolation)
                codeEditor.on('change', function () {
                    try {
                        if (typeof window !== 'undefined' && window.sessionStorage && currentProblem) {
                            const pId = currentProblem.id || currentProblem.slug;
                            if (pId) {
                                window.sessionStorage.setItem('codearena_draft_problem_' + pId, codeEditor.getValue());
                            }
                        }
                    } catch (e) {}
                });"""

    if target_change in content and 'setItem(\'codearena_draft_problem_\'' not in content:
        content = content.replace(target_change, new_change)
        print("Added codeEditor change event for draft auto-save in workspace.js")

    # 3. Add autoRunSampleTests on Ctrl-S / Cmd-S
    target_ctrl_s = """                        'Ctrl-S': function () {
                            showToast('Ready! Press Ctrl + Enter to run sample tests.', 'info');
                        },
                        'Cmd-S': function () {
                            showToast('Ready! Press Cmd + Enter to run sample tests.', 'info');
                        }"""

    new_ctrl_s = """                        'Ctrl-S': function () {
                            if (userSettings && userSettings.autoRunSampleTests) {
                                runSampleTests();
                            } else {
                                showToast('Ready! Press Ctrl + Enter to run sample tests.', 'info');
                            }
                        },
                        'Cmd-S': function () {
                            if (userSettings && userSettings.autoRunSampleTests) {
                                runSampleTests();
                            } else {
                                showToast('Ready! Press Cmd + Enter to run sample tests.', 'info');
                            }
                        }"""

    if target_ctrl_s in content:
        content = content.replace(target_ctrl_s, new_ctrl_s)
        print("Updated Ctrl-S/Cmd-S autoRun in workspace.js")

    # 4. Support compactToolbar in workspace.js
    target_user_settings_apply = """                    if (userSettings.editorFontSize && codeEditor.getWrapperElement()) {
                        codeEditor.getWrapperElement().style.fontSize = userSettings.editorFontSize;
                    }"""

    new_user_settings_apply = """                    if (userSettings.editorFontSize && codeEditor.getWrapperElement()) {
                        codeEditor.getWrapperElement().style.fontSize = userSettings.editorFontSize;
                    }
                    if (userSettings.compactToolbar) {
                        document.documentElement.setAttribute('data-compact-toolbar', 'true');
                    }"""

    if target_user_settings_apply in content and 'data-compact-toolbar' not in content:
        content = content.replace(target_user_settings_apply, new_user_settings_apply)
        print("Added compactToolbar check to workspace.js")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Saved workspace.js")


def update_dashboard_html():
    path = 'frontend/pages/dashboard.html'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update header tag from '2 new' to 'Sample (2 new)'
    content = content.replace(
        '<span class="notif-popover-tag" id="notifHeaderTag">2 new</span>',
        '<span class="notif-popover-tag" id="notifHeaderTag">Sample (2 new)</span>'
    )

    # 2. Add disclaimer banner if not present
    disclaimer_html = """                            <div class="notif-preview-disclaimer" style="padding: 8px 14px; background: rgba(59, 130, 246, 0.08); border-bottom: 1px solid var(--border-color, #1e293b); font-size: 0.72rem; color: var(--color-text-muted, #94a3b8); display: flex; align-items: center; gap: 6px;">
                                <span aria-hidden="true">ℹ️</span>
                                <span>Sample platform announcements — live user alerts activate with backend integration.</span>
                            </div>"""

    if 'notif-preview-disclaimer' not in content:
        target_header_close = '</div>\n                            <div class="notif-tabs"'
        new_header_close = '</div>\n' + disclaimer_html + '\n                            <div class="notif-tabs"'
        content = content.replace(target_header_close, new_header_close)
        print("Added disclaimer banner to dashboard.html")

    # 3. Add sample badges and honest time labels
    old_item_1 = """                                <div class="notif-item unread" data-category="system">
                                    <div class="notif-item-title">Platform Update: Phase 6 Refinements Active</div>
                                    <div class="notif-item-desc">Advanced search suggestions, CodeMirror live preferences, and recently viewed problems are now live.</div>
                                    <div class="notif-item-time">Today, 10:45 AM</div>
                                </div>"""

    new_item_1 = """                                <div class="notif-item unread" data-category="system">
                                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 2px;">
                                        <div class="notif-item-title">Platform Update: Phase 6 Refinements Active</div>
                                        <span class="sample-data-badge" style="font-size: 0.65rem; padding: 1px 6px; border-radius: 4px; background: rgba(59, 130, 246, 0.15); color: var(--color-primary, #60a5fa); font-weight: 500;">Sample</span>
                                    </div>
                                    <div class="notif-item-desc">Advanced search suggestions, CodeMirror live preferences, and recently viewed problems are now live.</div>
                                    <div class="notif-item-time">Platform Announcement</div>
                                </div>"""

    old_item_2 = """                                <div class="notif-item unread" data-category="contests">
                                    <div class="notif-item-title">Weekly Java Contest #42 Open</div>
                                    <div class="notif-item-desc">Registration preview is open for the upcoming weekend tournament. Test your algorithmic speed!</div>
                                    <div class="notif-item-time">Yesterday, 4:20 PM</div>
                                </div>"""

    new_item_2 = """                                <div class="notif-item unread" data-category="contests">
                                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 2px;">
                                        <div class="notif-item-title">Weekly Java Contest #42 Open</div>
                                        <span class="sample-data-badge" style="font-size: 0.65rem; padding: 1px 6px; border-radius: 4px; background: rgba(59, 130, 246, 0.15); color: var(--color-primary, #60a5fa); font-weight: 500;">Sample</span>
                                    </div>
                                    <div class="notif-item-desc">Registration preview is open for the upcoming weekend tournament. Test your algorithmic speed!</div>
                                    <div class="notif-item-time">Platform Announcement</div>
                                </div>"""

    old_item_3 = """                                <div class="notif-item" data-category="system">
                                    <div class="notif-item-title">Java 17 Curriculum Update</div>
                                    <div class="notif-item-desc">New interactive lessons on Java Lambdas and Streams are ready in the Learning Centre.</div>
                                    <div class="notif-item-time">2 days ago</div>
                                </div>"""

    new_item_3 = """                                <div class="notif-item" data-category="system">
                                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 2px;">
                                        <div class="notif-item-title">Java 17 Curriculum Update</div>
                                        <span class="sample-data-badge" style="font-size: 0.65rem; padding: 1px 6px; border-radius: 4px; background: rgba(59, 130, 246, 0.15); color: var(--color-primary, #60a5fa); font-weight: 500;">Sample</span>
                                    </div>
                                    <div class="notif-item-desc">New interactive lessons on Java Lambdas and Streams are ready in the Learning Centre.</div>
                                    <div class="notif-item-time">Platform Announcement</div>
                                </div>"""

    if old_item_1 in content:
        content = content.replace(old_item_1, new_item_1)
        print("Updated notif item 1 in dashboard.html")
    if old_item_2 in content:
        content = content.replace(old_item_2, new_item_2)
        print("Updated notif item 2 in dashboard.html")
    if old_item_3 in content:
        content = content.replace(old_item_3, new_item_3)
        print("Updated notif item 3 in dashboard.html")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Saved dashboard.html")


def update_dashboard_js():
    path = 'frontend/js/dashboard.js'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Update mark read label
    content = content.replace(
        "if (notifHeaderTag) notifHeaderTag.textContent = '0 new';",
        "if (notifHeaderTag) notifHeaderTag.textContent = '0 new (Sample)';"
    )

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Saved dashboard.js")


def update_settings_js():
    path = 'frontend/js/settings.js'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. saveSettings: set both codearena-theme and codearena_theme, compactToolbar attribute, and codearena_include_default_return
    old_save = """        // Apply theme immediately if changed
        if (currentSettings.theme) {
            document.documentElement.setAttribute('data-theme', currentSettings.theme);
            try {
                localStorage.setItem('codearena_theme', currentSettings.theme);
            } catch (e) {}
            // Dispatch theme change event so all components adapt
            window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: currentSettings.theme } }));
        }

        // Apply interface density
        if (currentSettings.interfaceDensity === 'compact') {
            document.documentElement.setAttribute('data-density', 'compact');
        } else {
            document.documentElement.removeAttribute('data-density');
        }

        // Apply reduced motion
        if (currentSettings.reducedMotion) {
            document.documentElement.setAttribute('data-reduced-motion', 'true');
        } else {
            document.documentElement.removeAttribute('data-reduced-motion');
        }"""

    new_save = """        // Apply theme immediately if changed
        if (currentSettings.theme) {
            document.documentElement.setAttribute('data-theme', currentSettings.theme);
            try {
                localStorage.setItem('codearena_theme', currentSettings.theme);
                localStorage.setItem('codearena-theme', currentSettings.theme);
            } catch (e) {}
            // Dispatch theme change event so all components adapt
            window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: currentSettings.theme } }));
        }

        // Apply interface density
        if (currentSettings.interfaceDensity === 'compact') {
            document.documentElement.setAttribute('data-density', 'compact');
        } else {
            document.documentElement.removeAttribute('data-density');
        }

        // Apply reduced motion
        if (currentSettings.reducedMotion) {
            document.documentElement.setAttribute('data-reduced-motion', 'true');
        } else {
            document.documentElement.removeAttribute('data-reduced-motion');
        }

        // Apply compact workspace toolbar
        if (currentSettings.compactToolbar) {
            document.documentElement.setAttribute('data-compact-toolbar', 'true');
        } else {
            document.documentElement.removeAttribute('data-compact-toolbar');
        }

        // Sync default return preference
        try {
            localStorage.setItem('codearena_include_default_return', currentSettings.defaultReturnStatement ? 'true' : 'false');
        } catch (e) {}"""

    if old_save in content:
        content = content.replace(old_save, new_save)
        print("Updated saveSettings in settings.js")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Saved settings.js")


def update_theme_js():
    path = 'frontend/js/theme.js'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Load compactToolbar attribute
    old_init = """                if (settings.reducedMotion === true) {
                    document.documentElement.setAttribute('data-reduced-motion', 'true');
                }"""

    new_init = """                if (settings.reducedMotion === true) {
                    document.documentElement.setAttribute('data-reduced-motion', 'true');
                }
                if (settings.compactToolbar === true) {
                    document.documentElement.setAttribute('data-compact-toolbar', 'true');
                }"""

    if old_init in content and 'data-compact-toolbar' not in content:
        content = content.replace(old_init, new_init)
        print("Added data-compact-toolbar to theme.js")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Saved theme.js")


def update_styles_css():
    path = 'frontend/css/styles.css'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    rule = """
/* ========================================
   Phase 6: Compact Workspace Toolbar Preference
   ======================================== */
[data-compact-toolbar="true"] .editor-toolbar-bar .toolbar-btn-text {
  display: none;
}
"""
    if '[data-compact-toolbar="true"]' not in content:
        content = content + "\n" + rule
        print("Added [data-compact-toolbar] rule to styles.css")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Saved styles.css")


if __name__ == '__main__':
    update_bookmarks_js()
    update_problems_js()
    update_workspace_js()
    update_dashboard_html()
    update_dashboard_js()
    update_settings_js()
    update_theme_js()
    update_styles_css()
    print("All refinements applied successfully.")

