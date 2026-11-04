# apply_editor_enhancements.py

# 1. Update compiler.html
with open('frontend/pages/compiler.html', 'r', encoding='utf-8') as f:
    comp_html = f.read()

target_btn = """                    <button id="btnShortcutsHelp" class="compiler-header-btn" type="button" title="View Keyboard Shortcuts">
                        ⌨ Shortcuts
                    </button>"""

replacement_btns = """                    <button id="btnEditorFontDec" class="compiler-header-btn" type="button" title="Decrease editor font size" aria-label="Decrease font size">A-</button>
                    <span id="compilerFontSizeDisplay" style="font-size: 0.76rem; color: var(--color-text-muted); min-width: 28px; text-align: center;">14px</span>
                    <button id="btnEditorFontInc" class="compiler-header-btn" type="button" title="Increase editor font size" aria-label="Increase font size">A+</button>
                    <button id="btnCompilerCopyCode" class="compiler-header-btn" type="button" title="Copy code to clipboard">Copy</button>
                    <button id="btnShortcutsHelp" class="compiler-header-btn" type="button" title="View Keyboard Shortcuts">
                        ⌨ Shortcuts
                    </button>"""

if target_btn in comp_html:
    comp_html = comp_html.replace(target_btn, replacement_btns, 1)
    with open('frontend/pages/compiler.html', 'w', encoding='utf-8') as f:
        f.write(comp_html)
    print("Updated compiler.html toolbar buttons")
else:
    print("Warning: target_btn not found in compiler.html")

# 2. Update compiler.js
with open('frontend/js/compiler.js', 'r', encoding='utf-8') as f:
    comp_js = f.read()

# Add draft loading to initEditor
old_init_comp = "const initialCode = getDefaultTemplate();"
new_init_comp = """let initialCode = getDefaultTemplate();
        try {
            if (typeof window !== 'undefined' && window.sessionStorage) {
                const draft = window.sessionStorage.getItem('codearena_compiler_draft');
                if (draft && draft.trim()) {
                    initialCode = draft;
                }
            }
        } catch (e) {}"""

if old_init_comp in comp_js:
    comp_js = comp_js.replace(old_init_comp, new_init_comp, 1)
    print("Added draft loading to compiler.js")

# In initEditor, attach change listener to save draft
old_attach = "codeEditor = CodeMirror(dom.codeMirrorTarget,"
comp_js = comp_js.replace(old_attach, "codeEditor = CodeMirror(dom.codeMirrorTarget,", 1)

# Add draft save and font buttons logic in bindEvents
old_bind_comp = "if (dom.btnConfirmReset) {"
new_bind_comp = """// Draft auto-save on change
        if (codeEditor) {
            codeEditor.on('change', function () {
                try {
                    if (typeof window !== 'undefined' && window.sessionStorage) {
                        window.sessionStorage.setItem('codearena_compiler_draft', codeEditor.getValue());
                    }
                } catch (e) {}
            });
        }

        // Quick Font Size Controls
        const btnFontDec = document.getElementById('btnEditorFontDec');
        const btnFontInc = document.getElementById('btnEditorFontInc');
        const fontDisplay = document.getElementById('compilerFontSizeDisplay');
        const btnCopyCode = document.getElementById('btnCompilerCopyCode');

        function updateFontSizeDisplay(size) {
            if (fontDisplay) fontDisplay.textContent = size + 'px';
        }

        if (btnFontDec || btnFontInc) {
            let currentSize = 14;
            try {
                const raw = localStorage.getItem('codearena_user_settings');
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (parsed.editorFontSize) currentSize = parseInt(parsed.editorFontSize, 10) || 14;
                }
            } catch (e) {}
            updateFontSizeDisplay(currentSize);

            function setEditorFontSize(newSize) {
                newSize = Math.max(12, Math.min(22, newSize));
                currentSize = newSize;
                updateFontSizeDisplay(newSize);
                if (codeEditor && codeEditor.getWrapperElement()) {
                    codeEditor.getWrapperElement().style.fontSize = newSize + 'px';
                    codeEditor.refresh();
                }
                try {
                    const raw = localStorage.getItem('codearena_user_settings');
                    const settings = raw ? JSON.parse(raw) : {};
                    settings.editorFontSize = newSize + 'px';
                    localStorage.setItem('codearena_user_settings', JSON.stringify(settings));
                } catch (e) {}
                showToast(`Font size: ${newSize}px`, 'info');
            }

            if (btnFontDec) {
                btnFontDec.addEventListener('click', function () {
                    setEditorFontSize(currentSize - 2);
                });
            }
            if (btnFontInc) {
                btnFontInc.addEventListener('click', function () {
                    setEditorFontSize(currentSize + 2);
                });
            }
        }

        if (btnCopyCode) {
            btnCopyCode.addEventListener('click', function () {
                const code = codeEditor ? codeEditor.getValue() : '';
                if (!code || !code.trim()) {
                    showToast('Source code is empty.', 'warning');
                    return;
                }
                navigator.clipboard.writeText(code).then(function () {
                    showToast('Source code copied to clipboard!', 'success');
                }).catch(function () {
                    showToast('Failed to copy to clipboard.', 'error');
                });
            });
        }

        // Clear draft on confirm reset
        if (dom.btnConfirmReset) {
            dom.btnConfirmReset.addEventListener('click', function () {
                try {
                    if (typeof window !== 'undefined' && window.sessionStorage) {
                        window.sessionStorage.removeItem('codearena_compiler_draft');
                    }
                } catch (e) {}
            });
        }

        if (dom.btnConfirmReset) {"""

if old_bind_comp in comp_js:
    comp_js = comp_js.replace(old_bind_comp, new_bind_comp, 1)
    print("Added font controls and draft listeners to compiler.js")
else:
    print("Warning: old_bind_comp not found in compiler.js")

with open('frontend/js/compiler.js', 'w', encoding='utf-8') as f:
    f.write(comp_js)

# 3. Update problem.html
with open('frontend/pages/problem.html', 'r', encoding='utf-8') as f:
    prob_html = f.read()

target_pref_group = """                <!-- Group C: Code Preferences -->
                <div class="toolbar-group toolbar-group-pref" role="group" aria-label="Code Preferences">
                    <label class="starter-return-toggle" id="starterReturnToggleWrap" title="Toggle default placeholder return statement in starter code">
                        <input type="checkbox" id="chkIncludeDefaultReturn" checked>
                        <span class="return-toggle-switch" aria-hidden="true"></span>
                        <span class="return-toggle-label">Default Return</span>
                        <span class="return-toggle-label-compact">Return</span>
                    </label>
                </div>"""

replacement_pref_group = """                <!-- Group C: Code Preferences -->
                <div class="toolbar-group toolbar-group-pref" role="group" aria-label="Code Preferences">
                    <label class="starter-return-toggle" id="starterReturnToggleWrap" title="Toggle default placeholder return statement in starter code">
                        <input type="checkbox" id="chkIncludeDefaultReturn" checked>
                        <span class="return-toggle-switch" aria-hidden="true"></span>
                        <span class="return-toggle-label">Default Return</span>
                        <span class="return-toggle-label-compact">Return</span>
                    </label>
                    <div class="editor-quick-font" style="display: inline-flex; align-items: center; gap: 4px; margin-left: 8px;">
                        <button id="btnWorkspaceFontDec" class="btn-editor-tool" type="button" title="Decrease font size" aria-label="Decrease font size" style="padding: 2px 8px; font-size: 0.75rem;">A-</button>
                        <span id="workspaceFontSizeDisplay" style="font-size: 0.72rem; color: var(--color-text-muted); min-width: 26px; text-align: center;">14px</span>
                        <button id="btnWorkspaceFontInc" class="btn-editor-tool" type="button" title="Increase font size" aria-label="Increase font size" style="padding: 2px 8px; font-size: 0.75rem;">A+</button>
                    </div>
                </div>"""

if target_pref_group in prob_html:
    prob_html = prob_html.replace(target_pref_group, replacement_pref_group, 1)
    with open('frontend/pages/problem.html', 'w', encoding='utf-8') as f:
        f.write(prob_html)
    print("Updated problem.html toolbar preferences")
else:
    print("Warning: target_pref_group not found in problem.html")

# 4. Update workspace.js
with open('frontend/js/workspace.js', 'r', encoding='utf-8') as f:
    work_js = f.read()

# In loadProblemFromUrl:
old_load_editor = """                renderProblemData(currentProblem);
                updateReturnToggleUI();
                initEditor(getStarterCode(currentProblem, includeDefaultReturn));"""

new_load_editor = """                renderProblemData(currentProblem);
                updateReturnToggleUI();
                
                // Draft preservation (Phase 6)
                let initialCode = getStarterCode(currentProblem, includeDefaultReturn);
                try {
                    if (typeof window !== 'undefined' && window.sessionStorage) {
                        const draft = window.sessionStorage.getItem('codearena_draft_problem_' + cleanId);
                        if (draft && draft.trim()) {
                            initialCode = draft;
                        }
                    }
                } catch (e) {}

                initEditor(initialCode);
                saveRecentlyViewedProblem(currentProblem);"""

if old_load_editor in work_js:
    work_js = work_js.replace(old_load_editor, new_load_editor, 1)
    print("Updated loadProblemFromUrl in workspace.js")
else:
    print("Warning: old_load_editor not found in workspace.js")

# In initEditor, attach change listener to save draft
draft_listener_work = """        // Auto-save draft on edit (Phase 6)
        codeEditor.on('change', function () {
            try {
                if (typeof window !== 'undefined' && window.sessionStorage && currentProblem) {
                    window.sessionStorage.setItem('codearena_draft_problem_' + currentProblem.id, codeEditor.getValue());
                }
            } catch (e) {}
        });"""

old_editor_init_end = "codeEditor.setOption('readOnly', false);"
if old_editor_init_end in work_js and 'codearena_draft_problem_' not in work_js:
    work_js = work_js.replace(old_editor_init_end, old_editor_init_end + "\n" + draft_listener_work, 1)
    print("Added editor change draft listener to workspace.js")

# Clear draft on reset confirm in workspace.js
old_work_reset = "if (dom.btnConfirmReset) {"
new_work_reset = """// Workspace Quick Font Size Controls (Phase 6)
        const btnWorkFontDec = document.getElementById('btnWorkspaceFontDec');
        const btnWorkFontInc = document.getElementById('btnWorkspaceFontInc');
        const workFontDisplay = document.getElementById('workspaceFontSizeDisplay');

        function updateWorkFontDisplay(size) {
            if (workFontDisplay) workFontDisplay.textContent = size + 'px';
        }

        if (btnWorkFontDec || btnWorkFontInc) {
            let currentSize = 14;
            try {
                const raw = localStorage.getItem('codearena_user_settings');
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (parsed.editorFontSize) currentSize = parseInt(parsed.editorFontSize, 10) || 14;
                }
            } catch (e) {}
            updateWorkFontDisplay(currentSize);

            function setWorkspaceFontSize(newSize) {
                newSize = Math.max(12, Math.min(22, newSize));
                currentSize = newSize;
                updateWorkFontDisplay(newSize);
                if (codeEditor && codeEditor.getWrapperElement()) {
                    codeEditor.getWrapperElement().style.fontSize = newSize + 'px';
                    codeEditor.refresh();
                }
                try {
                    const raw = localStorage.getItem('codearena_user_settings');
                    const settings = raw ? JSON.parse(raw) : {};
                    settings.editorFontSize = newSize + 'px';
                    localStorage.setItem('codearena_user_settings', JSON.stringify(settings));
                } catch (e) {}
                showToast(`Editor font: ${newSize}px`, 'info');
            }

            if (btnWorkFontDec) {
                btnWorkFontDec.addEventListener('click', function () {
                    setWorkspaceFontSize(currentSize - 2);
                });
            }
            if (btnWorkFontInc) {
                btnWorkFontInc.addEventListener('click', function () {
                    setWorkspaceFontSize(currentSize + 2);
                });
            }
        }

        // Clear session draft on reset confirmation
        if (dom.btnConfirmReset) {
            dom.btnConfirmReset.addEventListener('click', function () {
                try {
                    if (typeof window !== 'undefined' && window.sessionStorage && currentProblem) {
                        window.sessionStorage.removeItem('codearena_draft_problem_' + currentProblem.id);
                    }
                } catch (e) {}
            });
        }

        if (dom.btnConfirmReset) {"""

if old_work_reset in work_js:
    work_js = work_js.replace(old_work_reset, new_work_reset, 1)
    print("Added font controls and reset draft clearing to workspace.js")

# Add saveRecentlyViewedProblem function to workspace.js
save_rv_func = """
    /**
     * Safely saves problem to Recently Viewed list (Phase 6)
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
                list = list.filter(function (item) { return item && item.id !== problem.id; });
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
        } catch (e) {
            // Silently fallback if storage is restricted
        }
    }
"""

if 'saveRecentlyViewedProblem' not in work_js:
    idx = work_js.rfind('})();')
    work_js = work_js[:idx] + save_rv_func + "\n" + work_js[idx:]
    print("Appended saveRecentlyViewedProblem to workspace.js")

with open('frontend/js/workspace.js', 'w', encoding='utf-8') as f:
    f.write(work_js)

print("Editor enhancements and draft persistence applied successfully.")

