# Script to apply Phase 4 final verification and remediation
import os
import re

def update_problem_html():
    path = os.path.join('frontend', 'pages', 'problem.html')
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add btnBookmarkProblem in .problem-headline-row
    old_row = """                    <div class="problem-headline-row">
                        <h1 class="problem-title-text" id="problemTitleText">Loading problem...</h1>
                    </div>"""
    
    new_row = """                    <div class="problem-headline-row" style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                        <h1 class="problem-title-text" id="problemTitleText">Loading problem...</h1>
                        <button id="btnBookmarkProblem" class="workspace-header-btn" type="button" title="Bookmark this challenge" aria-label="Bookmark this challenge" style="height: 28px; font-size: 0.78rem; flex-shrink: 0;">
                            <span class="bookmark-icon" aria-hidden="true">🔖</span>
                            <span id="bookmarkBtnText">Bookmark</span>
                        </button>
                    </div>"""

    if 'id="btnBookmarkProblem"' not in content:
        if old_row in content:
            content = content.replace(old_row, new_row)
        else:
            old_row_crlf = old_row.replace('\n', '\r\n')
            new_row_crlf = new_row.replace('\n', '\r\n')
            if old_row_crlf in content:
                content = content.replace(old_row_crlf, new_row_crlf)

        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Added btnBookmarkProblem to problem.html")
    else:
        print("btnBookmarkProblem already in problem.html")


def update_workspace_js():
    path = os.path.join('frontend', 'js', 'workspace.js')
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Cache bookmark elements in cacheElements
    cache_target = "chkModalIncludeReturn: document.getElementById('chkModalIncludeReturn'),"
    cache_replacement = cache_target + "\n            btnBookmarkProblem: document.getElementById('btnBookmarkProblem'),\n            bookmarkBtnText: document.getElementById('bookmarkBtnText'),"
    
    if 'btnBookmarkProblem: document.getElementById' not in content:
        if cache_target in content:
            content = content.replace(cache_target, cache_replacement)
        else:
            cache_target_crlf = cache_target.replace('\n', '\r\n')
            cache_replacement_crlf = cache_replacement.replace('\n', '\r\n')
            if cache_target_crlf in content:
                content = content.replace(cache_target_crlf, cache_replacement_crlf)

    # Apply user settings in initEditor
    editor_target = """        if (typeof CodeMirror !== 'undefined' && dom.codeMirrorTarget) {
            try {
                codeEditor = CodeMirror(dom.codeMirrorTarget, {
                    value: starterCode || '',
                    mode: 'text/x-java',
                    theme: currentTheme,
                    lineNumbers: true,
                    matchBrackets: true,
                    autoCloseBrackets: true,
                    styleActiveLine: true,
                    indentUnit: 4,
                    tabSize: 4,"""

    editor_replacement = """        // Read user editor preferences from localStorage (Phase 4 Settings Integration)
        let userSettings = null;
        try {
            const raw = localStorage.getItem('codearena_user_settings');
            if (raw) userSettings = JSON.parse(raw);
        } catch (e) {}

        const editorTabSize = (userSettings && userSettings.editorTabSize) ? parseInt(userSettings.editorTabSize, 10) : 4;
        const editorLineNumbers = (userSettings && typeof userSettings.showLineNumbers === 'boolean') ? userSettings.showLineNumbers : true;
        const editorAutoClose = (userSettings && typeof userSettings.autoCloseBrackets === 'boolean') ? userSettings.autoCloseBrackets : true;

        if (typeof CodeMirror !== 'undefined' && dom.codeMirrorTarget) {
            try {
                codeEditor = CodeMirror(dom.codeMirrorTarget, {
                    value: starterCode || '',
                    mode: 'text/x-java',
                    theme: currentTheme,
                    lineNumbers: editorLineNumbers,
                    matchBrackets: true,
                    autoCloseBrackets: editorAutoClose,
                    styleActiveLine: true,
                    indentUnit: editorTabSize,
                    tabSize: editorTabSize,"""

    if 'codearena_user_settings' not in content:
        if editor_target in content:
            content = content.replace(editor_target, editor_replacement)
        else:
            editor_target_crlf = editor_target.replace('\n', '\r\n')
            editor_replacement_crlf = editor_replacement.replace('\n', '\r\n')
            if editor_target_crlf in content:
                content = content.replace(editor_target_crlf, editor_replacement_crlf)

        # Apply font size right after codeEditor creation
        post_cm_target = """                // Listen for cursor position updates
                codeEditor.on('cursorActivity', function () {"""
        post_cm_replacement = """                if (userSettings && userSettings.editorFontSize && codeEditor.getWrapperElement()) {
                    codeEditor.getWrapperElement().style.fontSize = userSettings.editorFontSize;
                }

                // Listen for cursor position updates
                codeEditor.on('cursorActivity', function () {"""
        if post_cm_target in content:
            content = content.replace(post_cm_target, post_cm_replacement)
        else:
            post_cm_target_crlf = post_cm_target.replace('\n', '\r\n')
            post_cm_replacement_crlf = post_cm_replacement.replace('\n', '\r\n')
            if post_cm_target_crlf in content:
                content = content.replace(post_cm_target_crlf, post_cm_replacement_crlf)

    # Add initBookmarkButton logic
    if 'function initBookmarkButton()' not in content:
        bookmark_logic = """
    /**
     * Initializes the Bookmark button for the currently loaded problem.
     * Integrates with codearena_guest_bookmarks for cross-page consistency with bookmarks.html.
     */
    function initBookmarkButton() {
        if (!dom.btnBookmarkProblem || !currentProblem) return;
        const probId = currentProblem.id || currentProblem.slug;

        function getBookmarks() {
            try {
                const raw = localStorage.getItem('codearena_guest_bookmarks');
                if (raw) return JSON.parse(raw);
            } catch (e) {}
            return [];
        }

        function isBookmarked() {
            return getBookmarks().includes(probId);
        }

        function updateBookmarkBtn() {
            const bookmarked = isBookmarked();
            if (dom.bookmarkBtnText) {
                dom.bookmarkBtnText.textContent = bookmarked ? 'Bookmarked' : 'Bookmark';
            }
            if (bookmarked) {
                dom.btnBookmarkProblem.style.color = '#F59E0B';
                dom.btnBookmarkProblem.style.borderColor = 'rgba(245, 158, 11, 0.5)';
                dom.btnBookmarkProblem.title = 'Saved to your Bookmarks (click to remove)';
            } else {
                dom.btnBookmarkProblem.style.color = '';
                dom.btnBookmarkProblem.style.borderColor = '';
                dom.btnBookmarkProblem.title = 'Bookmark this challenge for later';
            }
        }

        updateBookmarkBtn();

        dom.btnBookmarkProblem.onclick = function () {
            let bms = getBookmarks();
            if (bms.includes(probId)) {
                bms = bms.filter(id => id !== probId);
                showToast('Bookmark removed', 'info');
            } else {
                bms.push(probId);
                showToast('Challenge added to Bookmarks! 🔖', 'success');
            }
            try {
                localStorage.setItem('codearena_guest_bookmarks', JSON.stringify(bms));
            } catch (e) {}
            updateBookmarkBtn();
        };
    }
"""
        # Call inside renderProblemDetails
        call_target = "updateStarterReturnToggleUI();"
        call_replacement = "updateStarterReturnToggleUI();\n        initBookmarkButton();"
        if call_target in content:
            content = content.replace(call_target, call_replacement)
        else:
            call_target_crlf = call_target.replace('\n', '\r\n')
            call_replacement_crlf = call_replacement.replace('\n', '\r\n')
            if call_target_crlf in content:
                content = content.replace(call_target_crlf, call_replacement_crlf)

        # Append function before closing IIFE
        content = content.replace("})();", bookmark_logic + "\n})();")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated workspace.js with settings integration and bookmarking functionality")


def update_compiler_js():
    path = os.path.join('frontend', 'js', 'compiler.js')
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    editor_target = """        if (typeof CodeMirror !== 'undefined' && dom.codeMirrorTarget) {
            try {
                codeEditor = CodeMirror(dom.codeMirrorTarget, {
                    value: initialCode,
                    mode: 'text/x-java',
                    theme: currentTheme,
                    lineNumbers: true,
                    matchBrackets: true,
                    autoCloseBrackets: true,
                    styleActiveLine: true,
                    indentUnit: 4,
                    tabSize: 4,"""

    editor_replacement = """        // Read user editor preferences from localStorage (Phase 4 Settings Integration)
        let userSettings = null;
        try {
            const raw = localStorage.getItem('codearena_user_settings');
            if (raw) userSettings = JSON.parse(raw);
        } catch (e) {}

        const editorTabSize = (userSettings && userSettings.editorTabSize) ? parseInt(userSettings.editorTabSize, 10) : 4;
        const editorLineNumbers = (userSettings && typeof userSettings.showLineNumbers === 'boolean') ? userSettings.showLineNumbers : true;
        const editorAutoClose = (userSettings && typeof userSettings.autoCloseBrackets === 'boolean') ? userSettings.autoCloseBrackets : true;

        if (typeof CodeMirror !== 'undefined' && dom.codeMirrorTarget) {
            try {
                codeEditor = CodeMirror(dom.codeMirrorTarget, {
                    value: initialCode,
                    mode: 'text/x-java',
                    theme: currentTheme,
                    lineNumbers: editorLineNumbers,
                    matchBrackets: true,
                    autoCloseBrackets: editorAutoClose,
                    styleActiveLine: true,
                    indentUnit: editorTabSize,
                    tabSize: editorTabSize,"""

    if 'codearena_user_settings' not in content:
        if editor_target in content:
            content = content.replace(editor_target, editor_replacement)
        else:
            editor_target_crlf = editor_target.replace('\n', '\r\n')
            editor_replacement_crlf = editor_replacement.replace('\n', '\r\n')
            if editor_target_crlf in content:
                content = content.replace(editor_target_crlf, editor_replacement_crlf)

        # Apply font size right after codeEditor creation
        post_cm_target = """                // Listen for cursor position updates
                codeEditor.on('cursorActivity', function () {"""
        post_cm_replacement = """                if (userSettings && userSettings.editorFontSize && codeEditor.getWrapperElement()) {
                    codeEditor.getWrapperElement().style.fontSize = userSettings.editorFontSize;
                }

                // Listen for cursor position updates
                codeEditor.on('cursorActivity', function () {"""
        if post_cm_target in content:
            content = content.replace(post_cm_target, post_cm_replacement)
        else:
            post_cm_target_crlf = post_cm_target.replace('\n', '\r\n')
            post_cm_replacement_crlf = post_cm_replacement.replace('\n', '\r\n')
            if post_cm_target_crlf in content:
                content = content.replace(post_cm_target_crlf, post_cm_replacement_crlf)

        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Updated compiler.js with settings integration")
    else:
        print("compiler.js already has settings integration")


def update_progress_js():
    path = os.path.join('frontend', 'js', 'progress.js')
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove fabricated solvedIds.add('two-sum')
    target = """        // Add 1 sample baseline solved problem (e.g. two-sum) so dashboard shows live preview data
        solvedIds.add('two-sum');"""
    
    if target in content:
        content = content.replace(target, "        // Only genuinely solved session submissions are counted")
    else:
        target_crlf = target.replace('\n', '\r\n')
        if target_crlf in content:
            content = content.replace(target_crlf, "        // Only genuinely solved session submissions are counted")

    # Update streak rendering if 0 solved
    streak_target = "if (dom.currentStreakVal) dom.currentStreakVal.textContent = `${state.stats.streakDays} Days`;"
    streak_replacement = """if (dom.currentStreakVal) {
            dom.currentStreakVal.textContent = state.stats.totalSolved > 0 ? `${state.stats.streakDays} Days` : '0 Days';
        }"""
    if streak_target in content:
        content = content.replace(streak_target, streak_replacement)
    else:
        streak_target_crlf = streak_target.replace('\n', '\r\n')
        streak_replacement_crlf = streak_replacement.replace('\n', '\r\n')
        if streak_target_crlf in content:
            content = content.replace(streak_target_crlf, streak_replacement_crlf)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated progress.js for 100% data integrity without fabricated baselines")


def update_settings_html():
    path = os.path.join('frontend', 'pages', 'settings.html')
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add active/demonstration badges
    content = content.replace(
        '<h2 id="sec-editor" class="settings-card-title">\n                    <span>⌨️</span>\n                    <span>Code Editor Configuration</span>\n                </h2>',
        '<h2 id="sec-editor" class="settings-card-title">\n                    <span>⌨️</span>\n                    <span>Code Editor Configuration</span>\n                    <span class="preview-badge-pill" style="margin-left: auto; font-size: 0.68rem; background-color: rgba(34, 197, 94, 0.12); color: #4ADE80; border-color: rgba(34, 197, 94, 0.3);">Active Live Configuration</span>\n                </h2>'
    )
    content = content.replace(
        '<h2 id="sec-interface" class="settings-card-title">\n                    <span>⚡</span>\n                    <span>Interface & Practice Workflow</span>\n                </h2>',
        '<h2 id="sec-interface" class="settings-card-title">\n                    <span>⚡</span>\n                    <span>Interface & Practice Workflow</span>\n                    <span class="preview-badge-pill warning" style="margin-left: auto; font-size: 0.68rem;">Demonstration Preview</span>\n                </h2>'
    )
    content = content.replace(
        '<h2 id="sec-notifications" class="settings-card-title">\n                    <span>🔔</span>\n                    <span>Notification Previews</span>\n                </h2>',
        '<h2 id="sec-notifications" class="settings-card-title">\n                    <span>🔔</span>\n                    <span>Notification Previews</span>\n                    <span class="preview-badge-pill warning" style="margin-left: auto; font-size: 0.68rem;">Demonstration Preview</span>\n                </h2>'
    )

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated settings.html with explicit active vs demonstration preview badges")


if __name__ == '__main__':
    update_problem_html()
    update_workspace_js()
    update_compiler_js()
    update_progress_js()
    update_settings_html()

