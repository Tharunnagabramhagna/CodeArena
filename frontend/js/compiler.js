/**
 * CodeArena — Online Java Compiler Workspace Controller (compiler.js)
 * Manages CodeMirror 5 initialization, fallback editor, UI actions,
 * tabbed execution console, honest preview presentation, and compilerService integration.
 */

(function () {
    'use strict';

    // State Variables
    let codeEditor = null;
    let isFallback = false;
    let isRunning = false;

    // DOM Elements Cache
    let dom = {};

    /**
     * Initializes the compiler workspace once the DOM is ready.
     */
    function init() {
        cacheElements();
        initEditor();
        bindEvents();
        syncThemeWithEditor();
        observeThemeChanges();
        initResizeHandler();
        initCompilerSplitter();
    }

    /**
     * Caches all required interactive DOM elements.
     */
    function cacheElements() {
        dom = {
            // Header & Toolbar
            btnRunCode: document.getElementById('btnRunCode'),
            btnResetCode: document.getElementById('btnResetCode'),
            btnCopyCode: document.getElementById('btnCopyCode'),
            btnClearConsole: document.getElementById('btnClearConsole'),
            compilerStatusIndicator: document.getElementById('compilerStatusIndicator'),
            compilerStatusText: document.getElementById('compilerStatusText'),
            cursorPositionDisplay: document.getElementById('cursorPositionDisplay'),

            // Editor & Splitter
            codeMirrorTarget: document.getElementById('codeMirrorTarget'),
            fallbackEditor: document.getElementById('fallbackEditor'),
            btnShortcutsHelp: document.getElementById('btnShortcutsHelp'),
            btnResetSplit: document.getElementById('btnResetSplit'),
            compilerSplitter: document.getElementById('compilerSplitter'),
            compilerWorkspace: document.querySelector('.compiler-workspace'),
            editorPane: document.querySelector('.editor-pane'),

            // Console Tabs & Actions
            tabBtnStdout: document.getElementById('tabBtnStdout'),
            tabBtnStdin: document.getElementById('tabBtnStdin'),
            tabBtnStderr: document.getElementById('tabBtnStderr'),
            btnCopyConsoleOutput: document.getElementById('btnCopyConsoleOutput'),
            btnClearStdin: document.getElementById('btnClearStdin'),

            // Console Panels
            panelStdout: document.getElementById('panelStdout'),
            panelStdin: document.getElementById('panelStdin'),
            panelStderr: document.getElementById('panelStderr'),

            // Terminal Outputs & Stats
            stdoutTerminal: document.getElementById('stdoutTerminal'),
            stderrTerminal: document.getElementById('stderrTerminal'),
            stdinTextarea: document.getElementById('stdinTextarea'),
            terminalStatsBar: document.getElementById('terminalStatsBar'),
            statStatus: document.getElementById('statStatus'),
            diagnosticsErrorList: document.getElementById('diagnosticsErrorList'),
            stderrCountBadge: document.getElementById('stderrCountBadge'),

            // Modals & Overlays
            resetModalOverlay: document.getElementById('resetModalOverlay'),
            btnCancelReset: document.getElementById('btnCancelReset'),
            btnConfirmReset: document.getElementById('btnConfirmReset'),
            shortcutsModalOverlay: document.getElementById('shortcutsModalOverlay'),
            btnCloseShortcuts: document.getElementById('btnCloseShortcuts'),

            // Toast
            compilerToast: document.getElementById('compilerToast')
        };
    }

    /**
     * Retrieves the default Java template from the CodeArena API or fallback.
     */
    function getDefaultTemplate() {
        if (window.CodeArenaAPI && window.CodeArenaAPI.compilerService && typeof window.CodeArenaAPI.compilerService.getDefaultTemplate === 'function') {
            return window.CodeArenaAPI.compilerService.getDefaultTemplate('java');
        }
        return `public class Main {\n    public static void main(String[] args) {\n        // Welcome to CodeArena Online Java Compiler\n        System.out.println("Hello, CodeArena!");\n    }\n}`;
    }

    /**
     * Initializes CodeMirror 5 with Java mode and addons, or falls back to styled textarea.
     */
    function initEditor() {
        let initialCode = getDefaultTemplate();
        try {
            if (typeof window !== 'undefined' && window.sessionStorage) {
                const draft = window.sessionStorage.getItem('codearena_compiler_draft');
                if (draft && draft.trim()) {
                    initialCode = draft;
                }
            }
        } catch (e) {}
        const currentTheme = getCurrentThemeName();

        // Read user editor preferences from localStorage (Phase 4 Settings Integration)
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
                    tabSize: editorTabSize,
                    indentWithTabs: false,
                    lineWrapping: false,
                    autofocus: true,
                    extraKeys: {
                        'Ctrl-Enter': function () {
                            runCode();
                        },
                        'Cmd-Enter': function () {
                            runCode();
                        },
                        'Ctrl-S': function () {
                            showToast('Ready to run! Press Ctrl + Enter to execute.', 'info');
                        },
                        'Cmd-S': function () {
                            showToast('Ready to run! Press Cmd + Enter to execute.', 'info');
                        }
                    }
                });

                if (userSettings && userSettings.editorFontSize && codeEditor.getWrapperElement()) {
                    codeEditor.getWrapperElement().style.fontSize = userSettings.editorFontSize;
                }

                // Listen for cursor position updates
                codeEditor.on('cursorActivity', function () {
                    const pos = codeEditor.getCursor();
                    updateCursorPosition(pos.line + 1, pos.ch + 1);
                });

                isFallback = false;
                if (dom.fallbackEditor) dom.fallbackEditor.style.display = 'none';

                // Initial refresh after render
                setTimeout(function () {
                    if (codeEditor) codeEditor.refresh();
                }, 100);

                return;
            } catch (err) {
                console.warn('[CodeArena Compiler] CodeMirror instantiation failed, switching to fallback textarea:', err);
            }
        }

        // Activate styled textarea fallback
        isFallback = true;
        if (dom.codeMirrorTarget) dom.codeMirrorTarget.style.display = 'none';
        if (dom.fallbackEditor) {
            dom.fallbackEditor.style.display = 'block';
            dom.fallbackEditor.value = initialCode;

            dom.fallbackEditor.addEventListener('input', updateFallbackCursor);
            dom.fallbackEditor.addEventListener('click', updateFallbackCursor);
            dom.fallbackEditor.addEventListener('keyup', updateFallbackCursor);

            // Handle Tab indentation in fallback textarea
            dom.fallbackEditor.addEventListener('keydown', function (e) {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    const start = this.selectionStart;
                    const end = this.selectionEnd;
                    this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);
                    this.selectionStart = this.selectionEnd = start + 4;
                } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    runCode();
                }
            });
        }
    }

    /**
     * Determines the active CodeMirror theme based on the current data-theme attribute.
     */
    function getCurrentThemeName() {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        return isLight ? 'codearena-light' : 'codearena-dark';
    }

    /**
     * Synchronizes the CodeMirror theme with the active page theme.
     */
    function syncThemeWithEditor() {
        if (!codeEditor) return;
        const targetTheme = getCurrentThemeName();
        codeEditor.setOption('theme', targetTheme);
        codeEditor.refresh();
    }

    /**
     * Observes data-theme changes on <html> to update CodeMirror theme dynamically.
     */
    function observeThemeChanges() {
        const observer = new MutationObserver(function (mutations) {
            for (let i = 0; i < mutations.length; i++) {
                if (mutations[i].attributeName === 'data-theme') {
                    syncThemeWithEditor();
                    break;
                }
            }
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }

    /**
     * Ensures CodeMirror refreshes properly when the viewport changes.
     */
    function initResizeHandler() {
        let resizeTimer = null;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                if (codeEditor) codeEditor.refresh();
            }, 100);
        });
    }


    /* ==========================================================================
       Feature 3: Adjustable Editor & Output Screen Ratio (Draggable Splitter)
       ========================================================================== */

    function applySplitRatio(percentage, persist = true) {
        const clamped = Math.max(30, Math.min(75, percentage));
        if (dom.compilerWorkspace) {
            dom.compilerWorkspace.style.setProperty('--compiler-editor-width', clamped.toFixed(1) + '%');
        }
        if (dom.btnResetSplit) {
            dom.btnResetSplit.textContent = `⇋ ${Math.round(clamped)}:${Math.round(100 - clamped)}`;
        }
        if (persist) {
            try {
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem('codearena_compiler_split_ratio', clamped.toFixed(1));
                }
            } catch (e) {}
        }
        if (codeEditor) {
            codeEditor.refresh();
        }
    }

    function initCompilerSplitter() {
        if (!dom.compilerSplitter || !dom.compilerWorkspace) return;

        // Restore saved ratio or URL param on load
        let initialRatio = 55;
        try {
            if (typeof localStorage !== 'undefined') {
                const saved = parseFloat(localStorage.getItem('codearena_compiler_split_ratio'));
                if (!isNaN(saved) && saved >= 30 && saved <= 75) {
                    initialRatio = saved;
                }
            }
        } catch (e) {}

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('ratio')) {
            const r = parseFloat(urlParams.get('ratio'));
            if (!isNaN(r) && r >= 30 && r <= 75) {
                initialRatio = r;
            }
        }
        applySplitRatio(initialRatio, false);

        let isDragging = false;
        let startX = 0;
        let startWidthPct = 55;

        // Pointer down
        dom.compilerSplitter.addEventListener('pointerdown', function (e) {
            if (e.button !== 0) return;
            isDragging = true;
            try {
                dom.compilerSplitter.setPointerCapture(e.pointerId);
            } catch (err) {}
            dom.compilerSplitter.classList.add('is-dragging');
            document.body.classList.add('is-resizing');
            dom.compilerWorkspace.classList.add('is-resizing');

            const rect = dom.compilerWorkspace.getBoundingClientRect();
            const currentPx = dom.editorPane ? dom.editorPane.getBoundingClientRect().width : (rect.width * 0.55);
            startWidthPct = rect.width > 0 ? (currentPx / rect.width) * 100 : 55;
            startX = e.clientX;
            e.preventDefault();
        });

        // Pointer move
        dom.compilerSplitter.addEventListener('pointermove', function (e) {
            if (!isDragging) return;
            const rect = dom.compilerWorkspace.getBoundingClientRect();
            if (rect.width <= 0) return;

            const deltaX = e.clientX - startX;
            const deltaPct = (deltaX / rect.width) * 100;
            const newPct = Math.max(30, Math.min(75, startWidthPct + deltaPct));

            applySplitRatio(newPct, false);
        });

        // Pointer up / cancel
        function onPointerEnd(e) {
            if (!isDragging) return;
            isDragging = false;
            try {
                dom.compilerSplitter.releasePointerCapture(e.pointerId);
            } catch (err) {}
            dom.compilerSplitter.classList.remove('is-dragging');
            document.body.classList.remove('is-resizing');
            dom.compilerWorkspace.classList.remove('is-resizing');

            const rect = dom.compilerWorkspace.getBoundingClientRect();
            if (rect.width > 0 && dom.editorPane) {
                const finalPx = dom.editorPane.getBoundingClientRect().width;
                const finalPct = Math.max(30, Math.min(75, (finalPx / rect.width) * 100));
                applySplitRatio(finalPct, true);
            }
        }

        dom.compilerSplitter.addEventListener('pointerup', onPointerEnd);
        dom.compilerSplitter.addEventListener('pointercancel', onPointerEnd);

        // Double click resets to 55%
        dom.compilerSplitter.addEventListener('dblclick', function () {
            applySplitRatio(55, true);
            if (typeof showCompilerToast === 'function') {
                showCompilerToast('Workspace layout reset to 55:45 ratio');
            }
        });

        // Reset button
        if (dom.btnResetSplit) {
            dom.btnResetSplit.addEventListener('click', function () {
                applySplitRatio(55, true);
                if (typeof showCompilerToast === 'function') {
                    showCompilerToast('Workspace layout reset to 55:45 ratio');
                }
            });
        }

        // Keyboard arrow navigation
        dom.compilerSplitter.addEventListener('keydown', function (e) {
            const currentPct = parseFloat(getComputedStyle(dom.compilerWorkspace).getPropertyValue('--compiler-editor-width')) || 55;
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                applySplitRatio(currentPct - 2, true);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                applySplitRatio(currentPct + 2, true);
            } else if (e.key === 'Home' || e.key === 'Enter') {
                e.preventDefault();
                applySplitRatio(55, true);
            }
        });
    }

    /**
     * Updates the cursor position display in the editor footer.
     */
    function updateCursorPosition(line, col) {
        if (dom.cursorPositionDisplay) {
            dom.cursorPositionDisplay.textContent = `Ln ${line}, Col ${col}`;
        }
    }

    /**
     * Calculates cursor line and column for the fallback textarea.
     */
    function updateFallbackCursor() {
        if (!dom.fallbackEditor) return;
        const textBeforeCursor = dom.fallbackEditor.value.substring(0, dom.fallbackEditor.selectionStart);
        const lines = textBeforeCursor.split('\n');
        const line = lines.length;
        const col = lines[lines.length - 1].length + 1;
        updateCursorPosition(line, col);
    }

    /**
     * Gets the current editor source code.
     */
    function getEditorCode() {
        if (!isFallback && codeEditor) {
            return codeEditor.getValue();
        }
        return dom.fallbackEditor ? dom.fallbackEditor.value : '';
    }

    /**
     * Sets the editor source code.
     */
    function setEditorCode(code) {
        if (!isFallback && codeEditor) {
            codeEditor.setValue(code);
            codeEditor.focus();
        } else if (dom.fallbackEditor) {
            dom.fallbackEditor.value = code;
            dom.fallbackEditor.focus();
        }
    }

    /**
     * Binds all workspace user interaction events.
     */
    function bindEvents() {
        // Run Button
        if (dom.btnRunCode) {
            dom.btnRunCode.addEventListener('click', runCode);
        }

        // Reset Button & Modal
        if (dom.btnResetCode) {
            dom.btnResetCode.addEventListener('click', openResetModal);
        }
        if (dom.btnCancelReset) {
            dom.btnCancelReset.addEventListener('click', closeResetModal);
        }
        // Draft auto-save on change
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

        if (dom.btnConfirmReset) {
            dom.btnConfirmReset.addEventListener('click', function () {
                setEditorCode(getDefaultTemplate());
                closeResetModal();
                showToast('Default Java template restored.', 'success');
            });
        }
        if (dom.resetModalOverlay) {
            dom.resetModalOverlay.addEventListener('click', function (e) {
                if (e.target === dom.resetModalOverlay) closeResetModal();
            });
        }

        // Copy Code Button
        if (dom.btnCopyCode) {
            dom.btnCopyCode.addEventListener('click', function () {
                const code = getEditorCode();
                copyToClipboard(code, 'Java source code copied to clipboard!');
            });
        }

        // Clear Console Button
        if (dom.btnClearConsole) {
            dom.btnClearConsole.addEventListener('click', clearConsole);
        }

        // Console Tabs
        if (dom.tabBtnStdout) {
            dom.tabBtnStdout.addEventListener('click', function () {
                switchTab('stdout');
            });
        }
        if (dom.tabBtnStdin) {
            dom.tabBtnStdin.addEventListener('click', function () {
                switchTab('stdin');
            });
        }
        if (dom.tabBtnStderr) {
            dom.tabBtnStderr.addEventListener('click', function () {
                switchTab('stderr');
            });
        }

        // Copy Output Button
        if (dom.btnCopyConsoleOutput) {
            dom.btnCopyConsoleOutput.addEventListener('click', copyConsoleOutput);
        }

        // Clear Stdin Button
        if (dom.btnClearStdin) {
            dom.btnClearStdin.addEventListener('click', function () {
                if (dom.stdinTextarea) dom.stdinTextarea.value = '';
                showToast('Standard input cleared.', 'info');
            });
        }

        // Shortcuts Modal
        if (dom.btnShortcutsHelp) {
            dom.btnShortcutsHelp.addEventListener('click', openShortcutsModal);
        }
        if (dom.btnCloseShortcuts) {
            dom.btnCloseShortcuts.addEventListener('click', closeShortcutsModal);
        }
        if (dom.shortcutsModalOverlay) {
            dom.shortcutsModalOverlay.addEventListener('click', function (e) {
                if (e.target === dom.shortcutsModalOverlay) closeShortcutsModal();
            });
        }

        // Window-level Keyboard Shortcuts
        window.addEventListener('keydown', function (e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                runCode();
            } else if (e.key === 'Escape') {
                closeResetModal();
                closeShortcutsModal();
            }
        });
    }

    /**
     * Executes simulated preview via window.CodeArenaAPI.compilerService.
     */
    async function runCode() {
        if (isRunning) return;

        const sourceCode = getEditorCode();
        const stdin = dom.stdinTextarea ? dom.stdinTextarea.value : '';

        // Validation: Empty source code
        if (!sourceCode || !sourceCode.trim()) {
            setStatus('diagnostic', 'Empty Code');
            switchTab('stderr');
            renderStderr('Validation Notice: Source code cannot be empty. Enter Java code before running preview.', [
                { line: 1, column: 1, message: 'Source code cannot be empty.' }
            ]);
            showToast('Source code cannot be empty.', 'warning');
            return;
        }

        // Begin Running State
        isRunning = true;
        setRunningState(true);
        setStatus('running', 'Simulating Preview...');

        // Switch to Output Tab by default while simulating
        switchTab('stdout');
        renderStdout('Compiling Main.java...\nExecuting client-side simulated preview...\n');

        try {
            let result = null;
            if (window.CodeArenaAPI && window.CodeArenaAPI.compilerService) {
                result = await window.CodeArenaAPI.compilerService.runCode({
                    sourceCode: sourceCode,
                    language: 'java',
                    stdin: stdin
                });
            } else {
                result = {
                    success: false,
                    status: 500,
                    message: 'CodeArena compiler service is not initialized.'
                };
            }

            processExecutionResult(result, stdin);
        } catch (err) {
            console.error('[CodeArena Compiler] Preview execution failed:', err);
            setStatus('error', 'Execution Error');
            switchTab('stderr');
            renderStderr(`An unexpected error occurred during preview: ${err.message || err}`, []);
            showToast('Preview execution failed.', 'error');
        } finally {
            isRunning = false;
            setRunningState(false);
        }
    }

    /**
     * Processes and renders the execution response honestly as simulated preview.
     */
    function processExecutionResult(result, stdin) {
        if (!result) return;

        if (result.success && result.data) {
            const data = result.data;

            // Handle client-side structural / syntactic checks
            if (data.status === 'COMPILE_ERROR') {
                setStatus('diagnostic', 'Structural Syntax Notice');
                switchTab('stderr');
                renderStderr(data.stderr || 'Structural check notice.', data.compileErrors || []);
                renderStdoutEmpty();
                renderStatsBar('diagnostic');
                showToast('Structural syntax check flagged an issue. View Diagnostics.', 'warning');
                return;
            }

            // Successful Preview Execution (Honest labels, no fake runtime/memory/exit code)
            setStatus('success', 'Preview Completed');
            switchTab('stdout');

            let stdoutDisplay = data.stdout || '(Program completed with no output to stdout)';
            // Ensure any stdin in stdout is explicitly identified as simulated
            if (stdin && stdin.trim() && stdoutDisplay.includes('[Standard Input Received]')) {
                stdoutDisplay = stdoutDisplay.replace(/\[Standard Input Received\]/g, '[Simulated Standard Input]');
            }

            renderStdout(stdoutDisplay);
            renderStatsBar('preview');
            clearStderr();
            showToast('Simulated preview finished.', 'success');
        } else {
            // Service level error (e.g. 400 Bad Request)
            setStatus('error', 'Execution Error');
            switchTab('stderr');
            const errMsg = result.message || 'Preview execution request failed.';
            renderStderr(errMsg, []);
            renderStdoutEmpty();
            hideStatsBar();
            showToast(errMsg, 'error');
        }
    }

    /**
     * Updates the running state of the UI controls.
     */
    function setRunningState(running) {
        if (dom.btnRunCode) {
            dom.btnRunCode.disabled = running;
            const textSpan = dom.btnRunCode.querySelector('span');
            if (textSpan) {
                textSpan.textContent = running ? 'Running...' : 'Run Code';
            }
        }
    }

    /**
     * Updates the status indicator pill with honest, non-misleading labels.
     */
    function setStatus(type, text) {
        if (!dom.compilerStatusIndicator || !dom.compilerStatusText) return;
        dom.compilerStatusIndicator.className = 'compiler-status-indicator';

        if (type === 'running') {
            dom.compilerStatusIndicator.classList.add('status-running');
        } else if (type === 'success') {
            dom.compilerStatusIndicator.classList.add('status-success');
        } else if (type === 'diagnostic') {
            dom.compilerStatusIndicator.classList.add('status-diagnostic');
        } else if (type === 'error') {
            dom.compilerStatusIndicator.classList.add('status-error');
        }

        dom.compilerStatusText.textContent = text;
    }

    /**
     * Switches the active console tab.
     */
    function switchTab(tabName) {
        const tabs = [
            { btn: dom.tabBtnStdout, panel: dom.panelStdout, name: 'stdout' },
            { btn: dom.tabBtnStdin, panel: dom.panelStdin, name: 'stdin' },
            { btn: dom.tabBtnStderr, panel: dom.panelStderr, name: 'stderr' }
        ];

        tabs.forEach(function (tab) {
            if (!tab.btn || !tab.panel) return;
            const isActive = tab.name === tabName;
            tab.btn.classList.toggle('active', isActive);
            tab.btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
            tab.panel.classList.toggle('active', isActive);
        });
    }

    /**
     * Renders standard output in the stdout terminal.
     */
    function renderStdout(text) {
        if (!dom.stdoutTerminal) return;
        dom.stdoutTerminal.textContent = text;
    }

    /**
     * Resets standard output terminal to empty hint.
     */
    function renderStdoutEmpty() {
        if (!dom.stdoutTerminal) return;
        dom.stdoutTerminal.innerHTML = '<span class="terminal-empty">No output produced on stdout.</span>';
    }

    /**
     * Renders the honest preview metadata strip (no misleading milliseconds or memory usage).
     */
    function renderStatsBar(mode) {
        if (!dom.terminalStatsBar) return;
        dom.terminalStatsBar.style.display = 'flex';

        if (dom.statStatus) {
            if (mode === 'preview') {
                dom.statStatus.textContent = 'Preview Completed';
                dom.statStatus.className = 'stat-badge-preview';
            } else if (mode === 'diagnostic') {
                dom.statStatus.textContent = 'Diagnostic Notice';
                dom.statStatus.className = 'stat-badge-diagnostic';
            }
        }
    }

    /**
     * Hides execution stats bar.
     */
    function hideStatsBar() {
        if (dom.terminalStatsBar) {
            dom.terminalStatsBar.style.display = 'none';
        }
    }

    /**
     * Renders errors in the stderr panel and diagnostics list clearly labeled as structural checks.
     */
    function renderStderr(stderrText, compileErrors) {
        if (dom.stderrTerminal) {
            dom.stderrTerminal.textContent = stderrText;
        }

        if (dom.diagnosticsErrorList) {
            dom.diagnosticsErrorList.innerHTML = '';

            if (compileErrors && compileErrors.length > 0) {
                compileErrors.forEach(function (err) {
                    const card = document.createElement('div');
                    card.className = 'compile-error-card';
                    card.innerHTML = `
                        <div class="compile-error-title">
                            <span>⚠ Structural Syntax Check (Preview) · Line ${err.line || 1}${err.column ? `, Col ${err.column}` : ''}</span>
                        </div>
                        <p class="compile-error-message">${escapeHtml(err.message || 'Structural preview diagnostic notice')}</p>
                    `;
                    dom.diagnosticsErrorList.appendChild(card);
                });
            }
        }

        // Update badge counter
        if (dom.stderrCountBadge) {
            const count = (compileErrors && compileErrors.length > 0) ? compileErrors.length : (stderrText ? 1 : 0);
            if (count > 0) {
                dom.stderrCountBadge.textContent = String(count);
                dom.stderrCountBadge.style.display = 'inline-block';
            } else {
                dom.stderrCountBadge.style.display = 'none';
            }
        }
    }

    /**
     * Clears stderr panel and diagnostic counter.
     */
    function clearStderr() {
        if (dom.stderrTerminal) {
            dom.stderrTerminal.innerHTML = '<span class="terminal-empty">No structural issues detected in client preview. (Full Java compiler checks connect in Phase 4).</span>';
        }
        if (dom.diagnosticsErrorList) {
            dom.diagnosticsErrorList.innerHTML = '';
        }
        if (dom.stderrCountBadge) {
            dom.stderrCountBadge.style.display = 'none';
        }
    }

    /**
     * Clears all console terminals, stats, and resets status to Ready.
     */
    function clearConsole() {
        if (dom.stdoutTerminal) {
            dom.stdoutTerminal.innerHTML = '<span class="terminal-empty">Click &quot;Run Code&quot; or press Ctrl + Enter to compile and run your Java program.</span>';
        }
        clearStderr();
        hideStatsBar();
        setStatus('idle', 'Ready · Preview Mode');
        showToast('Console output cleared.', 'info');
    }

    /**
     * Copies the active console panel content to the clipboard.
     */
    function copyConsoleOutput() {
        let contentToCopy = '';
        const isStdoutActive = dom.panelStdout && dom.panelStdout.classList.contains('active');
        const isStderrActive = dom.panelStderr && dom.panelStderr.classList.contains('active');
        const isStdinActive = dom.panelStdin && dom.panelStdin.classList.contains('active');

        if (isStdoutActive && dom.stdoutTerminal) {
            contentToCopy = dom.stdoutTerminal.textContent;
        } else if (isStderrActive && dom.stderrTerminal) {
            contentToCopy = dom.stderrTerminal.textContent;
        } else if (isStdinActive && dom.stdinTextarea) {
            contentToCopy = dom.stdinTextarea.value;
        }

        if (!contentToCopy || contentToCopy.trim().startsWith('Click "Run Code"') || contentToCopy.trim().startsWith('No structural issues')) {
            showToast('No output to copy.', 'info');
            return;
        }

        copyToClipboard(contentToCopy, 'Console output copied to clipboard!');
    }

    /**
     * Clipboard copy utility with modern API and execCommand fallback.
     */
    function copyToClipboard(text, successMsg) {
        if (!text) {
            showToast('Nothing to copy.', 'info');
            return;
        }

        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            navigator.clipboard.writeText(text).then(function () {
                showToast(successMsg, 'success');
            }).catch(function () {
                fallbackClipboardCopy(text, successMsg);
            });
        } else {
            fallbackClipboardCopy(text, successMsg);
        }
    }

    /**
     * Fallback copy using hidden textarea.
     */
    function fallbackClipboardCopy(text, successMsg) {
        try {
            const temp = document.createElement('textarea');
            temp.value = text;
            temp.style.position = 'fixed';
            temp.style.opacity = '0';
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            document.body.removeChild(temp);
            showToast(successMsg, 'success');
        } catch (e) {
            showToast('Failed to copy to clipboard.', 'error');
        }
    }

    /**
     * Displays a transient notification toast message.
     */
    let toastTimeout = null;
    function showToast(message, type) {
        if (!dom.compilerToast) return;
        clearTimeout(toastTimeout);

        dom.compilerToast.textContent = message;
        dom.compilerToast.className = 'compiler-toast show';

        if (type === 'success') {
            dom.compilerToast.classList.add('toast-success');
        } else if (type === 'warning') {
            dom.compilerToast.classList.add('toast-warning');
        } else if (type === 'error') {
            dom.compilerToast.classList.add('toast-error');
        }

        toastTimeout = setTimeout(function () {
            dom.compilerToast.classList.remove('show');
        }, 3000);
    }

    /**
     * Opens the Reset Confirmation Modal.
     */
    function openResetModal() {
        if (dom.resetModalOverlay) {
            dom.resetModalOverlay.classList.add('active');
        }
    }

    /**
     * Closes the Reset Confirmation Modal.
     */
    function closeResetModal() {
        if (dom.resetModalOverlay) {
            dom.resetModalOverlay.classList.remove('active');
        }
    }

    /**
     * Opens the Keyboard Shortcuts Modal.
     */
    function openShortcutsModal() {
        if (dom.shortcutsModalOverlay) {
            dom.shortcutsModalOverlay.classList.add('active');
        }
    }

    /**
     * Closes the Keyboard Shortcuts Modal.
     */
    function closeShortcutsModal() {
        if (dom.shortcutsModalOverlay) {
            dom.shortcutsModalOverlay.classList.remove('active');
        }
    }

    /**
     * Helper to escape HTML characters in strings.
     */
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Initialize on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
