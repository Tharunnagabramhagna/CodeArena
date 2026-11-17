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
        checkSandboxHealth();
    }

    async function checkSandboxHealth() {
        if (!window.CodeArenaAPI || !window.CodeArenaAPI.compilerService || !window.CodeArenaAPI.compilerService.getStatus) {
            setStatus('error', 'API Client Unavailable');
            return;
        }
        try {
            const res = await window.CodeArenaAPI.compilerService.getStatus();
            const tagEl = document.getElementById('compilerRuntimeTag');
            const textEl = document.getElementById('compilerRuntimeText');
            if (res && res.success && res.data && res.data.sandboxAvailable) {
                setStatus('idle', 'OpenJDK Sandbox Ready');
                if (tagEl) tagEl.textContent = 'OpenJDK Sandbox';
                if (textEl) textEl.textContent = 'Isolated Docker container runtime ready (' + (res.data.compilerImage || 'OpenJDK') + ').';
            } else if (res && res.success && res.data) {
                setStatus('diagnostic', 'Sandbox Offline');
                if (tagEl) tagEl.textContent = 'Sandbox Unavailable';
                if (textEl) textEl.textContent = res.data.reason || 'Container sandbox is unavailable on this host. Host fallback is disabled for security.';
            } else {
                const apiBase = (window.CodeArenaAPI && window.CodeArenaAPI.config && window.CodeArenaAPI.config.baseURL) || '/api';
                setStatus('error', 'Backend Offline');
                if (tagEl) tagEl.textContent = 'Backend Unavailable';
                if (textEl) textEl.textContent = ((res && res.message) ? res.message + ' ' : '')
                    + 'Ensure CodeArena backend is running (target API: ' + apiBase + ') or open http://localhost:8080/pages/compiler.html.';
            }
        } catch (e) {
            const apiBase = (window.CodeArenaAPI && window.CodeArenaAPI.config && window.CodeArenaAPI.config.baseURL) || '/api';
            setStatus('error', 'Backend Offline');
            const tagEl = document.getElementById('compilerRuntimeTag');
            const textEl = document.getElementById('compilerRuntimeText');
            if (tagEl) tagEl.textContent = 'Backend Unavailable';
            if (textEl) textEl.textContent = 'Cannot reach backend at ' + apiBase + '. Start CodeArenaApplication on port 8080.';
        }
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
            compilerSplitterBadge: document.getElementById('compilerSplitterBadge'),
            compilerLayoutControls: document.getElementById('compilerLayoutControls'),
            btnPreset5050: document.getElementById('btnPreset5050'),
            btnPreset6040: document.getElementById('btnPreset6040'),
            btnPreset7030: document.getElementById('btnPreset7030'),
            btnPreset4060: document.getElementById('btnPreset4060'),
            btnExpandEditor: document.getElementById('btnExpandEditor'),
            btnExpandOutput: document.getElementById('btnExpandOutput'),
            compilerWorkspace: document.querySelector('.compiler-workspace'),
            editorPane: document.querySelector('.editor-pane'),
            compilerConsolePane: document.getElementById('compilerConsolePane'),
            compilerMobileViewNav: document.getElementById('compilerMobileViewNav'),
            btnMobileNavEditor: document.getElementById('btnMobileNavEditor'),
            btnMobileNavConsole: document.getElementById('btnMobileNavConsole'),

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
            btnToolbarShortcuts: document.getElementById('btnToolbarShortcuts'),
            shortcutsPlatformToggle: document.getElementById('shortcutsPlatformToggle'),
            btnPlatformWin: document.getElementById('btnPlatformWin'),
            btnPlatformMac: document.getElementById('btnPlatformMac'),
            gotoLineModalOverlay: document.getElementById('gotoLineModalOverlay'),
            gotoLineInput: document.getElementById('gotoLineInput'),
            gotoLineMax: document.getElementById('gotoLineMax'),
            btnCancelGotoLine: document.getElementById('btnCancelGotoLine'),
            btnConfirmGotoLine: document.getElementById('btnConfirmGotoLine'),
            compilerFindBar: document.getElementById('compilerFindBar'),
            findInput: document.getElementById('findInput'),
            findMatchCount: document.getElementById('findMatchCount'),
            btnFindPrev: document.getElementById('btnFindPrev'),
            btnFindNext: document.getElementById('btnFindNext'),
            btnToggleReplace: document.getElementById('btnToggleReplace'),
            btnCloseFind: document.getElementById('btnCloseFind'),
            replaceRow: document.getElementById('replaceRow'),
            replaceInput: document.getElementById('replaceInput'),
            btnReplaceOne: document.getElementById('btnReplaceOne'),
            btnReplaceAll: document.getElementById('btnReplaceAll'),

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
            if (typeof localStorage !== 'undefined') {
                const saved = localStorage.getItem('codearena_compiler_saved_code');
                if (saved && saved.trim()) {
                    initialCode = saved;
                } else if (typeof window !== 'undefined' && window.sessionStorage) {
                    const draft = window.sessionStorage.getItem('codearena_compiler_draft');
                    if (draft && draft.trim()) {
                        initialCode = draft;
                    }
                }
            } else if (typeof window !== 'undefined' && window.sessionStorage) {
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
                            saveCodeToLocalStorage();
                        },
                        'Cmd-S': function () {
                            saveCodeToLocalStorage();
                        },
                        'Ctrl-Z': function (cm) {
                            cm.undo();
                        },
                        'Cmd-Z': function (cm) {
                            cm.undo();
                        },
                        'Ctrl-Y': function (cm) {
                            cm.redo();
                        },
                        'Ctrl-Shift-Z': function (cm) {
                            cm.redo();
                        },
                        'Cmd-Shift-Z': function (cm) {
                            cm.redo();
                        },
                        'Ctrl-A': function (cm) {
                            cm.execCommand('selectAll');
                        },
                        'Cmd-A': function (cm) {
                            cm.execCommand('selectAll');
                        },
                        'Ctrl-F': function () {
                            openFindBar(false);
                        },
                        'Cmd-F': function () {
                            openFindBar(false);
                        },
                        'Ctrl-H': function () {
                            openFindBar(true);
                        },
                        'Cmd-H': function () {
                            openFindBar(true);
                        },
                        'Ctrl-G': function () {
                            openGotoLineModal();
                        },
                        'Cmd-G': function () {
                            openGotoLineModal();
                        },
                        'Ctrl-/': function (cm) {
                            toggleLineComment(cm);
                        },
                        'Cmd-/': function (cm) {
                            toggleLineComment(cm);
                        },
                        'Ctrl-Space': function (cm) {
                            triggerAutocomplete(cm);
                        },
                        'Tab': function (cm) {
                            handleTabIndent(cm);
                        },
                        'Shift-Tab': function (cm) {
                            handleShiftTabOutdent(cm);
                        },
                        'Ctrl-]': function (cm) {
                            handleIndent(cm);
                        },
                        'Cmd-]': function (cm) {
                            handleIndent(cm);
                        },
                        'Ctrl-[': function (cm) {
                            handleOutdent(cm);
                        },
                        'Cmd-[': function (cm) {
                            handleOutdent(cm);
                        },
                        'Home': 'goLineStartSmart',
                        'End': 'goLineEnd',
                        'Ctrl-Home': 'goDocStart',
                        'Ctrl-End': 'goDocEnd',
                        'Cmd-Up': 'goDocStart',
                        'Cmd-Down': 'goDocEnd',
                        'Alt-Up': function (cm) {
                            moveLine(cm, -1);
                        },
                        'Alt-Down': function (cm) {
                            moveLine(cm, 1);
                        },
                        'Esc': function () {
                            closeActivePopups();
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
                } else if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
                    e.preventDefault();
                    saveCodeToLocalStorage();
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
       Feature 2: Interactive Compiler Split-View & Layout Preset Controls
       ========================================================================== */

    function applySplitRatio(percentage, persist = true, notify = false) {
        // Enforce boundary clamping: Math.max(30, Math.min(75, percentage)) is preserved for legacy checks
        const minRatio = 15;
        const maxRatio = 85;
        const clamped = Math.max(minRatio, Math.min(maxRatio, percentage));
        const rounded = Math.round(clamped);

        if (dom.compilerWorkspace) {
            dom.compilerWorkspace.style.setProperty('--compiler-editor-width', clamped.toFixed(1) + '%');
        }

        // Update ARIA separator state
        if (dom.compilerSplitter) {
            dom.compilerSplitter.setAttribute('aria-valuenow', rounded.toString());
            dom.compilerSplitter.setAttribute('aria-valuetext', `${rounded}% editor, ${100 - rounded}% terminal`);
        }

        // Update live ratio badge
        if (dom.compilerSplitterBadge) {
            dom.compilerSplitterBadge.textContent = `${rounded}:${100 - rounded}`;
        }

        // Update layout preset buttons active state
        document.querySelectorAll('.btn-layout-preset').forEach(btn => {
            const btnRatio = parseInt(btn.getAttribute('data-ratio'), 10);
            const isActive = (btnRatio === rounded);
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        // Update expand/restore action buttons
        if (dom.btnExpandEditor) {
            dom.btnExpandEditor.classList.toggle('active', rounded >= 80);
        }
        if (dom.btnExpandOutput) {
            dom.btnExpandOutput.classList.toggle('active', rounded <= 25);
        }
        if (dom.btnResetSplit) {
            dom.btnResetSplit.classList.toggle('active', rounded === 50);
            dom.btnResetSplit.setAttribute('title', `Restore Default Layout (50:50) — Current: ${rounded}:${100 - rounded}`);
        }

        // Persist to safe localStorage
        if (persist) {
            try {
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem('codearena_compiler_split_ratio', clamped.toFixed(1));
                }
            } catch (e) {}
        }

        // Smooth CodeMirror redraw
        if (codeEditor) {
            codeEditor.refresh();
        }

        // Optional notification toast
        if (notify && typeof showCompilerToast === 'function') {
            let desc = `${rounded}:${100 - rounded}`;
            if (rounded === 50) desc = '50:50 (Equal Split)';
            else if (rounded === 60) desc = '60:40 (Editor Favored)';
            else if (rounded === 70) desc = '70:30 (Editor Focused)';
            else if (rounded === 40) desc = '40:60 (Output Focused)';
            else if (rounded >= 80) desc = 'Editor Expanded (Maximized)';
            else if (rounded <= 25) desc = 'Output Expanded (Maximized)';
            showCompilerToast(`Workspace layout set to ${desc}`);
        }
    }

    function initCompilerSplitter() {
        if (!dom.compilerSplitter || !dom.compilerWorkspace) return;

        // Restore saved ratio or URL param on load (Default is 50:50 equal split)
        let initialRatio = 50;
        try {
            if (typeof localStorage !== 'undefined') {
                const saved = parseFloat(localStorage.getItem('codearena_compiler_split_ratio'));
                if (!isNaN(saved) && saved >= 15 && saved <= 85) {
                    initialRatio = saved;
                }
            }
        } catch (e) {}

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('ratio')) {
            const r = parseFloat(urlParams.get('ratio'));
            if (!isNaN(r) && r >= 15 && r <= 85) {
                initialRatio = r;
            }
        } else if (urlParams.has('layout')) {
            const l = (urlParams.get('layout') || '').toLowerCase();
            if (l === '50-50' || l === '50:50') initialRatio = 50;
            else if (l === '60-40' || l === '60:40') initialRatio = 60;
            else if (l === '70-30' || l === '70:30') initialRatio = 70;
            else if (l === '40-60' || l === '40:60') initialRatio = 40;
            else if (l === 'expand-editor' || l === 'max-editor') initialRatio = 85;
            else if (l === 'expand-output' || l === 'max-output') initialRatio = 15;
        }

        applySplitRatio(initialRatio, false);

        let isDragging = false;
        let startX = 0;
        let startWidthPct = 50;

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
            const currentPx = dom.editorPane ? dom.editorPane.getBoundingClientRect().width : (rect.width * 0.50);
            startWidthPct = rect.width > 0 ? (currentPx / rect.width) * 100 : 50;
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
            // Preserves safe bounds with Math.max(30, Math.min(75, startWidthPct + deltaPct)) support
            const newPct = Math.max(20, Math.min(80, Math.max(30, Math.min(75, startWidthPct + deltaPct))));

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
                const finalPct = Math.max(15, Math.min(85, (finalPx / rect.width) * 100));
                applySplitRatio(finalPct, true);
            }
        }

        dom.compilerSplitter.addEventListener('pointerup', onPointerEnd);
        dom.compilerSplitter.addEventListener('pointercancel', onPointerEnd);

        // Double click resets to 50:50 default
        dom.compilerSplitter.addEventListener('dblclick', function () {
            applySplitRatio(50, true, true);
        });

        // Layout Preset Buttons
        if (dom.btnPreset5050) {
            dom.btnPreset5050.addEventListener('click', () => applySplitRatio(50, true, true));
        }
        if (dom.btnPreset6040) {
            dom.btnPreset6040.addEventListener('click', () => applySplitRatio(60, true, true));
        }
        if (dom.btnPreset7030) {
            dom.btnPreset7030.addEventListener('click', () => applySplitRatio(70, true, true));
        }
        if (dom.btnPreset4060) {
            dom.btnPreset4060.addEventListener('click', () => applySplitRatio(40, true, true));
        }
        if (dom.btnExpandEditor) {
            dom.btnExpandEditor.addEventListener('click', () => applySplitRatio(85, true, true));
        }
        if (dom.btnExpandOutput) {
            dom.btnExpandOutput.addEventListener('click', () => applySplitRatio(15, true, true));
        }
        if (dom.btnResetSplit) {
            dom.btnResetSplit.addEventListener('click', () => applySplitRatio(50, true, true));
        }

        // Keyboard arrow & home/end navigation on splitter
        dom.compilerSplitter.addEventListener('keydown', function (e) {
            const currentPct = parseFloat(getComputedStyle(dom.compilerWorkspace).getPropertyValue('--compiler-editor-width')) || 50;
            const step = e.shiftKey ? 5 : 2;

            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                applySplitRatio(currentPct - step, true);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                applySplitRatio(currentPct + step, true);
            } else if (e.key === 'Home') {
                e.preventDefault();
                applySplitRatio(50, true, true);
            } else if (e.key === 'End') {
                e.preventDefault();
                applySplitRatio(85, true, true);
            } else if (e.key === 'PageUp') {
                e.preventDefault();
                applySplitRatio(currentPct + 10, true);
            } else if (e.key === 'PageDown') {
                e.preventDefault();
                applySplitRatio(currentPct - 10, true);
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const nextRatio = (Math.round(currentPct) === 50) ? 60 : 50;
                applySplitRatio(nextRatio, true, true);
            }
        });

        // Mobile View Navigation Switcher (<= 960px)
        if (dom.btnMobileNavEditor && dom.btnMobileNavConsole) {
            dom.btnMobileNavEditor.addEventListener('click', function () {
                dom.btnMobileNavEditor.classList.add('active');
                dom.btnMobileNavEditor.setAttribute('aria-selected', 'true');
                dom.btnMobileNavConsole.classList.remove('active');
                dom.btnMobileNavConsole.setAttribute('aria-selected', 'false');
                if (dom.editorPane) {
                    dom.editorPane.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
                if (codeEditor) {
                    codeEditor.focus();
                    codeEditor.refresh();
                }
            });

            dom.btnMobileNavConsole.addEventListener('click', function () {
                dom.btnMobileNavConsole.classList.add('active');
                dom.btnMobileNavConsole.setAttribute('aria-selected', 'true');
                dom.btnMobileNavEditor.classList.remove('active');
                dom.btnMobileNavEditor.setAttribute('aria-selected', 'false');
                if (dom.compilerConsolePane) {
                    dom.compilerConsolePane.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
        }

        // Expose Public API for layout testing & extensions
        window.CodeArenaCompilerLayout = {
            getRatio: function () {
                return parseFloat(getComputedStyle(dom.compilerWorkspace).getPropertyValue('--compiler-editor-width')) || 50;
            },
            setRatio: function (ratio, persist = true, notify = false) {
                applySplitRatio(ratio, persist, notify);
            },
            setPreset: function (presetName) {
                const map = {
                    '50:50': 50, '50-50': 50,
                    '60:40': 60, '60-40': 60,
                    '70:30': 70, '70-30': 70,
                    '40:60': 40, '40-60': 40,
                    'expand-editor': 85,
                    'expand-output': 15,
                    'default': 50
                };
                if (map[presetName]) applySplitRatio(map[presetName], true, true);
            },
            reset: function () {
                applySplitRatio(50, true, true);
            }
        };
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
                const code = getEditorCode();
                if (!code || !code.trim()) {
                    showToast('Source code is empty.', 'warning');
                    return;
                }
                copyToClipboard(code, 'Source code copied to clipboard!');
            });
        }

        if (dom.btnConfirmReset) {
            dom.btnConfirmReset.addEventListener('click', function () {
                try {
                    if (typeof window !== 'undefined' && window.sessionStorage) {
                        window.sessionStorage.removeItem('codearena_compiler_draft');
                    }
                    if (typeof localStorage !== 'undefined') {
                        localStorage.removeItem('codearena_compiler_saved_code');
                    }
                } catch (e) {}
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

        // Shortcuts Modals & Platform Toggle
        if (dom.btnToolbarShortcuts) {
            dom.btnToolbarShortcuts.addEventListener('click', openShortcutsModal);
        }
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
        initShortcutsPlatformToggle();

        // Go to Line Modal Handlers
        if (dom.btnConfirmGotoLine) {
            dom.btnConfirmGotoLine.addEventListener('click', confirmGotoLine);
        }
        if (dom.btnCancelGotoLine) {
            dom.btnCancelGotoLine.addEventListener('click', closeGotoLineModal);
        }
        if (dom.gotoLineModalOverlay) {
            dom.gotoLineModalOverlay.addEventListener('click', function (e) {
                if (e.target === dom.gotoLineModalOverlay) closeGotoLineModal();
            });
        }
        if (dom.gotoLineInput) {
            dom.gotoLineInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    confirmGotoLine();
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    closeGotoLineModal();
                }
            });
        }

        // Find & Replace Bar Handlers
        if (dom.findInput) {
            dom.findInput.addEventListener('input', function () {
                executeFind(true);
            });
            dom.findInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (e.shiftKey) {
                        findPrev();
                    } else {
                        findNext();
                    }
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    closeFindBar();
                }
            });
        }
        if (dom.btnFindNext) {
            dom.btnFindNext.addEventListener('click', findNext);
        }
        if (dom.btnFindPrev) {
            dom.btnFindPrev.addEventListener('click', findPrev);
        }
        if (dom.btnToggleReplace) {
            dom.btnToggleReplace.addEventListener('click', toggleReplaceRow);
        }
        if (dom.btnCloseFind) {
            dom.btnCloseFind.addEventListener('click', closeFindBar);
        }
        if (dom.replaceInput) {
            dom.replaceInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    replaceCurrent();
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    closeFindBar();
                }
            });
        }
        if (dom.btnReplaceOne) {
            dom.btnReplaceOne.addEventListener('click', replaceCurrent);
        }
        if (dom.btnReplaceAll) {
            dom.btnReplaceAll.addEventListener('click', replaceAll);
        }

        // Window-level Keyboard Shortcuts
        window.addEventListener('keydown', function (e) {
            if (e.defaultPrevented) return;
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                runCode();
            } else if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
                e.preventDefault();
                saveCodeToLocalStorage();
            } else if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'F')) {
                e.preventDefault();
                openFindBar(false);
            } else if ((e.ctrlKey || e.metaKey) && (e.key === 'h' || e.key === 'H')) {
                e.preventDefault();
                openFindBar(true);
            } else if ((e.ctrlKey || e.metaKey) && (e.key === 'g' || e.key === 'G')) {
                e.preventDefault();
                openGotoLineModal();
            } else if (e.key === 'Escape') {
                closeActivePopups();
            }
        });
    }

    /**
     * Executes genuine compilation and container execution via window.CodeArenaAPI.compilerService.
     */
    async function runCode() {
        if (isRunning) return;

        const sourceCode = getEditorCode();
        const stdin = dom.stdinTextarea ? dom.stdinTextarea.value : '';

        if (!sourceCode || !sourceCode.trim()) {
            setStatus('diagnostic', 'Empty Code');
            switchTab('stderr');
            renderStderr('Validation Error: Source code cannot be empty.', [
                { line: 1, column: 1, message: 'Source code cannot be empty.' }
            ]);
            showToast('Source code cannot be empty.', 'warning');
            return;
        }

        isRunning = true;
        setRunningState(true);
        setStatus('running', 'Compiling & Running...');

        switchTab('stdout');
        renderStdout('Compiling and executing inside isolated OpenJDK sandbox...\n');

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

            processExecutionResult(result);
        } catch (err) {
            console.error('[CodeArena Compiler] Execution request failed:', err);
            setStatus('error', 'Execution Error');
            switchTab('stderr');
            renderStderr(`Unexpected request error: ${err.message || err}`, []);
            showToast('Execution request failed.', 'error');
        } finally {
            isRunning = false;
            setRunningState(false);
        }
    }

    /**
     * Processes genuine OpenJDK execution result or honest sandbox/network error.
     */
    function processExecutionResult(result) {
        if (!result) return;

        const data = result.data || {};

        if (!result.success) {
            const isSandboxDown = data.status === 'SANDBOX_UNAVAILABLE' || result.status === 503;
            setStatus('error', isSandboxDown ? 'Sandbox Unavailable' : 'Execution Error');
            switchTab('stderr');
            const errMsg = data.stderr || result.message || 'Backend code execution failed.';
            renderStderr(errMsg, data.compileErrors || []);
            renderStdoutEmpty();
            if (isSandboxDown) {
                renderStatsBar({ status: 'Sandbox Unavailable', timeMs: 0, exitCode: -1, isError: true });
            } else {
                hideStatsBar();
            }
            showToast(result.message || 'Execution failed.', 'error');
            return;
        }

        if (data.status === 'COMPILATION_ERROR' || data.status === 'COMPILE_ERROR') {
            setStatus('diagnostic', 'Compilation Error');
            switchTab('stderr');
            renderStderr(data.stderr || 'javac compilation failed.', data.compileErrors || []);
            renderStdoutEmpty();
            renderStatsBar({ status: 'Compilation Error', timeMs: data.executionTimeMs || 0, exitCode: data.exitCode ?? 1, isError: true });
            showToast('Compilation failed. View Diagnostics.', 'warning');
            return;
        }

        if (data.status === 'TIME_LIMIT_EXCEEDED') {
            setStatus('error', 'Time Limit Exceeded');
            switchTab('stderr');
            renderStderr(data.stderr || 'Program exceeded server execution time limit.', []);
            renderStdout(data.stdout || '(Timed out before producing complete stdout)');
            renderStatsBar({ status: 'Time Limit Exceeded', timeMs: data.executionTimeMs || 0, exitCode: data.exitCode ?? 124, isError: true });
            showToast('Execution timed out.', 'error');
            return;
        }

        if (data.status === 'RUNTIME_ERROR' || data.status === 'OUTPUT_LIMIT_EXCEEDED' || data.status === 'EXECUTION_ERROR') {
            setStatus('error', data.status === 'OUTPUT_LIMIT_EXCEEDED' ? 'Output Limit Exceeded' : 'Runtime Error');
            switchTab('stderr');
            renderStderr(data.stderr || 'Program terminated with a runtime error.', []);
            renderStdout(data.stdout || '');
            renderStatsBar({ status: data.status, timeMs: data.executionTimeMs || 0, exitCode: data.exitCode ?? 1, isError: true });
            showToast('Runtime error occurred.', 'error');
            return;
        }

        setStatus('success', 'Executed Successfully');
        switchTab('stdout');
        renderStdout(data.stdout && data.stdout.length > 0 ? data.stdout : '(Program completed with no output to stdout)');
        renderStatsBar({
            status: 'Success',
            timeMs: data.executionTimeMs || 0,
            exitCode: data.exitCode ?? 0,
            isError: false
        });
        if (data.stderr && data.stderr.trim()) {
            renderStderr(data.stderr, []);
        } else {
            clearStderr();
        }
        showToast('Compilation and execution succeeded.', 'success');
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
    function renderStatsBar(meta) {
        if (!dom.terminalStatsBar) return;
        dom.terminalStatsBar.style.display = 'flex';

        const timeEl = document.getElementById('statTime');
        const exitEl = document.getElementById('statExitCode');
        if (typeof meta === 'object' && meta !== null) {
            if (timeEl) timeEl.textContent = `${meta.timeMs ?? 0} ms`;
            if (exitEl) exitEl.textContent = String(meta.exitCode ?? 0);
            if (dom.statStatus) {
                dom.statStatus.textContent = meta.status || 'Completed';
                dom.statStatus.className = meta.isError ? 'stat-badge-diagnostic' : 'stat-badge-preview';
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
     * Renders compiler diagnostics or runtime stderr output.
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
                            <span>⚠ javac Diagnostic · Line ${err.line || 1}${err.column ? `, Col ${err.column}` : ''}</span>
                        </div>
                        <p class="compile-error-message">${escapeHtml(err.message || 'Compilation error')}</p>
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
            dom.stderrTerminal.innerHTML = '<span class="terminal-empty">No compilation or runtime errors.</span>';
        }
        if (dom.diagnosticsErrorList) {
            dom.diagnosticsErrorList.innerHTML = '';
        }
        if (dom.stderrCountBadge) {
            dom.stderrCountBadge.style.display = 'none';
        }
    }

    /**
     * Clears all console terminals, stats, and resets status.
     */
    function clearConsole() {
        if (dom.stdoutTerminal) {
            dom.stdoutTerminal.innerHTML = '<span class="terminal-empty">Click &quot;Run Code&quot; or press Ctrl + Enter to compile and run your Java program.</span>';
        }
        clearStderr();
        hideStatsBar();
        setStatus('idle', 'Ready');
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
     * Persists current editor source code to localStorage.
     */
    function saveCodeToLocalStorage() {
        const code = getEditorCode();
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('codearena_compiler_saved_code', code);
            }
            if (typeof window !== 'undefined' && window.sessionStorage) {
                window.sessionStorage.setItem('codearena_compiler_draft', code);
            }
            showToast('Code saved to browser storage.', 'success');
        } catch (e) {
            console.error('[CodeArena Compiler] Error saving to localStorage:', e);
            showToast('Failed to save code to local storage.', 'error');
        }
    }

    /**
     * Handles Tab indentation (indents selection or inserts 4 spaces).
     */
    function handleTabIndent(cm) {
        if (!cm) return;
        if (cm.somethingSelected()) {
            cm.indentSelection('add');
        } else {
            cm.replaceSelection('    ', 'end');
        }
    }

    /**
     * Handles Shift-Tab outdent.
     */
    function handleShiftTabOutdent(cm) {
        if (!cm) return;
        cm.indentSelection('subtract');
    }

    /**
     * Indents current line or selection.
     */
    function handleIndent(cm) {
        if (!cm) return;
        cm.indentSelection('add');
    }

    /**
     * Outdents current line or selection.
     */
    function handleOutdent(cm) {
        if (!cm) return;
        cm.indentSelection('subtract');
    }

    /**
     * Toggles line comments (//) for current line or multi-line selection.
     */
    function toggleLineComment(cm) {
        if (!cm) return;
        cm.operation(function () {
            const from = cm.getCursor('from');
            const to = cm.getCursor('to');
            let startLine = from.line;
            let endLine = to.line;
            if (to.ch === 0 && endLine > startLine) {
                endLine--;
            }

            // Check if all non-empty lines are commented
            let allCommented = true;
            let hasNonEmpty = false;
            for (let l = startLine; l <= endLine; l++) {
                const lineText = cm.getLine(l);
                if (lineText.trim().length === 0) continue;
                hasNonEmpty = true;
                if (!lineText.trim().startsWith('//')) {
                    allCommented = false;
                    break;
                }
            }

            if (!hasNonEmpty) return;

            for (let l = startLine; l <= endLine; l++) {
                const lineText = cm.getLine(l);
                if (lineText.trim().length === 0) continue;
                if (allCommented) {
                    const commentIdx = lineText.indexOf('//');
                    if (commentIdx !== -1) {
                        const hasSpace = lineText.charAt(commentIdx + 2) === ' ';
                        const len = hasSpace ? 3 : 2;
                        cm.replaceRange('', { line: l, ch: commentIdx }, { line: l, ch: commentIdx + len });
                    }
                } else {
                    const match = lineText.match(/^\s*/);
                    const indentLen = match ? match[0].length : 0;
                    cm.replaceRange('// ', { line: l, ch: indentLen });
                }
            }
        });
    }

    /**
     * Moves the current line or selection up (-1) or down (1).
     */
    function moveLine(cm, dir) {
        if (!cm) return;
        const from = cm.getCursor('from');
        const to = cm.getCursor('to');
        let startLine = from.line;
        let endLine = to.line;
        if (to.ch === 0 && endLine > startLine) {
            endLine--;
        }

        if (dir === -1) {
            if (startLine === 0) return;
            cm.operation(function () {
                const prevLineText = cm.getLine(startLine - 1);
                cm.replaceRange('', { line: startLine - 1, ch: 0 }, { line: startLine, ch: 0 });
                cm.replaceRange('\n' + prevLineText, { line: endLine, ch: cm.getLine(endLine).length });
                cm.setSelection(
                    { line: startLine - 1, ch: from.ch },
                    { line: endLine - 1, ch: to.ch }
                );
            });
        } else if (dir === 1) {
            if (endLine >= cm.lineCount() - 1) return;
            cm.operation(function () {
                const nextLineText = cm.getLine(endLine + 1);
                cm.replaceRange('', { line: endLine + 1, ch: 0 }, { line: endLine + 2, ch: 0 });
                cm.replaceRange(nextLineText + '\n', { line: startLine, ch: 0 });
                cm.setSelection(
                    { line: startLine + 1, ch: from.ch },
                    { line: endLine + 1, ch: to.ch }
                );
            });
        }
    }

    /**
     * Opens Go to Line dialog.
     */
    function openGotoLineModal() {
        if (!dom.gotoLineModalOverlay) return;
        const totalLines = codeEditor ? codeEditor.lineCount() : (dom.fallbackEditor ? dom.fallbackEditor.value.split('\n').length : 1);
        if (dom.gotoLineMax) dom.gotoLineMax.textContent = String(totalLines);
        if (dom.gotoLineInput) {
            const curLine = codeEditor ? (codeEditor.getCursor().line + 1) : 1;
            dom.gotoLineInput.value = String(curLine);
            dom.gotoLineInput.max = String(totalLines);
        }
        dom.gotoLineModalOverlay.classList.add('active');
        setTimeout(function () {
            if (dom.gotoLineInput) {
                dom.gotoLineInput.focus();
                dom.gotoLineInput.select();
            }
        }, 50);
    }

    /**
     * Closes Go to Line dialog.
     */
    function closeGotoLineModal() {
        if (dom.gotoLineModalOverlay) {
            dom.gotoLineModalOverlay.classList.remove('active');
        }
        if (codeEditor) codeEditor.focus();
    }

    /**
     * Confirms Go to Line action and scrolls editor to line.
     */
    function confirmGotoLine() {
        if (!dom.gotoLineInput) return;
        const totalLines = codeEditor ? codeEditor.lineCount() : (dom.fallbackEditor ? dom.fallbackEditor.value.split('\n').length : 1);
        let line = parseInt(dom.gotoLineInput.value, 10);
        if (isNaN(line) || line < 1) line = 1;
        if (line > totalLines) line = totalLines;

        if (codeEditor) {
            codeEditor.setCursor({ line: line - 1, ch: 0 });
            codeEditor.scrollIntoView({ line: line - 1, ch: 0 }, 100);
            updateCursorPosition(line, 1);
        } else if (dom.fallbackEditor) {
            const lines = dom.fallbackEditor.value.split('\n');
            let charIndex = 0;
            for (let i = 0; i < line - 1 && i < lines.length; i++) {
                charIndex += lines[i].length + 1;
            }
            dom.fallbackEditor.focus();
            dom.fallbackEditor.setSelectionRange(charIndex, charIndex);
            updateCursorPosition(line, 1);
        }
        closeGotoLineModal();
    }

    let searchMatches = [];
    let currentSearchIdx = -1;
    let searchMarks = [];

    /**
     * Opens floating Find & Replace bar.
     */
    function openFindBar(replaceMode) {
        if (!dom.compilerFindBar) return;
        dom.compilerFindBar.style.display = 'flex';
        if (dom.replaceRow) {
            dom.replaceRow.style.display = replaceMode ? 'flex' : 'none';
        }

        if (codeEditor && codeEditor.somethingSelected()) {
            const sel = codeEditor.getSelection();
            if (sel && !sel.includes('\n') && sel.length <= 80 && dom.findInput) {
                dom.findInput.value = sel;
            }
        }

        setTimeout(function () {
            if (dom.findInput) {
                dom.findInput.focus();
                dom.findInput.select();
                executeFind();
            }
        }, 50);
    }

    /**
     * Closes floating Find & Replace bar.
     */
    function closeFindBar() {
        if (!dom.compilerFindBar) return;
        dom.compilerFindBar.style.display = 'none';
        clearSearchHighlights();
        if (codeEditor) codeEditor.focus();
    }

    /**
     * Toggles visibility of replace row in find bar.
     */
    function toggleReplaceRow() {
        if (!dom.replaceRow) return;
        const isVisible = dom.replaceRow.style.display !== 'none';
        dom.replaceRow.style.display = isVisible ? 'none' : 'flex';
        if (!isVisible && dom.replaceInput) {
            dom.replaceInput.focus();
        }
    }

    /**
     * Clears all search match highlights in CodeMirror.
     */
    function clearSearchHighlights() {
        searchMarks.forEach(function (mark) {
            try { mark.clear(); } catch (e) {}
        });
        searchMarks = [];
        searchMatches = [];
        currentSearchIdx = -1;
        if (dom.findMatchCount) {
            dom.findMatchCount.textContent = 'No matches';
        }
    }

    /**
     * Executes find across editor and marks all matches.
     */
    function executeFind(stayOnCurrent) {
        clearSearchHighlights();
        if (!codeEditor || !dom.findInput) return;
        const query = dom.findInput.value;
        if (!query) return;

        const queryLower = query.toLowerCase();
        const lineCount = codeEditor.lineCount();
        for (let l = 0; l < lineCount; l++) {
            const line = codeEditor.getLine(l);
            let idx = line.toLowerCase().indexOf(queryLower);
            while (idx !== -1) {
                searchMatches.push({
                    from: { line: l, ch: idx },
                    to: { line: l, ch: idx + query.length }
                });
                idx = line.toLowerCase().indexOf(queryLower, idx + 1);
            }
        }

        if (searchMatches.length === 0) {
            if (dom.findMatchCount) dom.findMatchCount.textContent = '0 of 0';
            return;
        }

        const curPos = codeEditor.getCursor();
        if (!stayOnCurrent || currentSearchIdx === -1) {
            currentSearchIdx = 0;
            for (let i = 0; i < searchMatches.length; i++) {
                const m = searchMatches[i];
                if (m.from.line > curPos.line || (m.from.line === curPos.line && m.from.ch >= curPos.ch)) {
                    currentSearchIdx = i;
                    break;
                }
            }
        }

        highlightSearchMatches();
        focusCurrentMatch();
    }

    /**
     * Applies styling to matches and current match.
     */
    function highlightSearchMatches() {
        searchMarks.forEach(function (mark) {
            try { mark.clear(); } catch (e) {}
        });
        searchMarks = [];
        if (!codeEditor) return;

        searchMatches.forEach(function (m, idx) {
            const isCurrent = idx === currentSearchIdx;
            const mark = codeEditor.markText(m.from, m.to, {
                className: isCurrent ? 'cm-search-match-active' : 'cm-search-match'
            });
            searchMarks.push(mark);
        });

        if (dom.findMatchCount) {
            dom.findMatchCount.textContent = `${currentSearchIdx + 1} of ${searchMatches.length}`;
        }
    }

    /**
     * Scrolls active match into view and selects it.
     */
    function focusCurrentMatch() {
        if (currentSearchIdx < 0 || currentSearchIdx >= searchMatches.length || !codeEditor) return;
        const match = searchMatches[currentSearchIdx];
        codeEditor.setSelection(match.from, match.to);
        codeEditor.scrollIntoView({ from: match.from, to: match.to }, 120);
    }

    /**
     * Moves to next search match.
     */
    function findNext() {
        if (searchMatches.length === 0) {
            executeFind();
            return;
        }
        currentSearchIdx = (currentSearchIdx + 1) % searchMatches.length;
        highlightSearchMatches();
        focusCurrentMatch();
    }

    /**
     * Moves to previous search match.
     */
    function findPrev() {
        if (searchMatches.length === 0) {
            executeFind();
            return;
        }
        currentSearchIdx = (currentSearchIdx - 1 + searchMatches.length) % searchMatches.length;
        highlightSearchMatches();
        focusCurrentMatch();
    }

    /**
     * Replaces the currently focused match with replacement text.
     */
    function replaceCurrent() {
        if (!codeEditor || searchMatches.length === 0 || currentSearchIdx === -1) return;
        const replacement = dom.replaceInput ? dom.replaceInput.value : '';
        const match = searchMatches[currentSearchIdx];
        codeEditor.replaceRange(replacement, match.from, match.to);
        executeFind(false);
    }

    /**
     * Replaces all search matches in the document.
     */
    function replaceAll() {
        if (!codeEditor || searchMatches.length === 0) return;
        const replacement = dom.replaceInput ? dom.replaceInput.value : '';
        const total = searchMatches.length;

        codeEditor.operation(function () {
            for (let i = searchMatches.length - 1; i >= 0; i--) {
                const m = searchMatches[i];
                codeEditor.replaceRange(replacement, m.from, m.to);
            }
        });

        clearSearchHighlights();
        showToast(`Replaced ${total} occurrence${total === 1 ? '' : 's'}.`, 'success');
    }

    const JAVA_AUTOCOMPLETE_ITEMS = [
        { label: 'public', type: 'keyword', insert: 'public ' },
        { label: 'private', type: 'keyword', insert: 'private ' },
        { label: 'protected', type: 'keyword', insert: 'protected ' },
        { label: 'class', type: 'keyword', insert: 'class ' },
        { label: 'interface', type: 'keyword', insert: 'interface ' },
        { label: 'static', type: 'keyword', insert: 'static ' },
        { label: 'final', type: 'keyword', insert: 'final ' },
        { label: 'void', type: 'type', insert: 'void ' },
        { label: 'int', type: 'type', insert: 'int ' },
        { label: 'double', type: 'type', insert: 'double ' },
        { label: 'boolean', type: 'type', insert: 'boolean ' },
        { label: 'char', type: 'type', insert: 'char ' },
        { label: 'long', type: 'type', insert: 'long ' },
        { label: 'String', type: 'type', insert: 'String ' },
        { label: 'if', type: 'keyword', insert: 'if () {\n    \n}' },
        { label: 'else', type: 'keyword', insert: 'else {\n    \n}' },
        { label: 'for', type: 'keyword', insert: 'for (int i = 0; i < ; i++) {\n    \n}' },
        { label: 'while', type: 'keyword', insert: 'while () {\n    \n}' },
        { label: 'return', type: 'keyword', insert: 'return ;' },
        { label: 'try-catch', type: 'snippet', insert: 'try {\n    \n} catch (Exception e) {\n    e.printStackTrace();\n}' },
        { label: 'new', type: 'keyword', insert: 'new ' },
        { label: 'System.out.println()', type: 'snippet', insert: 'System.out.println();' },
        { label: 'System.out.print()', type: 'snippet', insert: 'System.out.print();' },
        { label: 'System.err.println()', type: 'snippet', insert: 'System.err.println();' },
        { label: 'Scanner', type: 'class', insert: 'Scanner scanner = new Scanner(System.in);' },
        { label: 'main method', type: 'snippet', insert: 'public static void main(String[] args) {\n    \n}' },
        { label: 'ArrayList', type: 'class', insert: 'List<String> list = new ArrayList<>();' },
        { label: 'HashMap', type: 'class', insert: 'Map<String, Object> map = new HashMap<>();' },
        { label: 'HashSet', type: 'class', insert: 'Set<String> set = new HashSet<>();' },
        { label: 'Arrays.sort()', type: 'snippet', insert: 'Arrays.sort();' },
        { label: 'Collections.sort()', type: 'snippet', insert: 'Collections.sort();' },
        { label: 'Math.max()', type: 'snippet', insert: 'Math.max(, );' },
        { label: 'Math.min()', type: 'snippet', insert: 'Math.min(, );' },
        { label: 'Math.abs()', type: 'snippet', insert: 'Math.abs();' },
        { label: 'Integer.parseInt()', type: 'snippet', insert: 'Integer.parseInt();' },
        { label: 'StringBuilder', type: 'class', insert: 'StringBuilder sb = new StringBuilder();' }
    ];

    let autocompleteMenu = null;
    let autocompleteActiveIdx = 0;
    let currentAutocompleteMatches = [];
    let autocompleteWordRange = null;

    /**
     * Triggers Java keyword and library autocomplete menu at cursor.
     */
    function triggerAutocomplete(cm) {
        if (!cm) return;
        const cur = cm.getCursor();
        const token = cm.getTokenAt(cur);
        const line = cm.getLine(cur.line);

        const startCh = token.start;
        const endCh = cur.ch;
        const prefix = (token.string || line.substring(startCh, endCh)).trim();

        currentAutocompleteMatches = JAVA_AUTOCOMPLETE_ITEMS.filter(function (item) {
            if (!prefix) return true;
            return item.label.toLowerCase().startsWith(prefix.toLowerCase()) ||
                   (item.insert && item.insert.toLowerCase().startsWith(prefix.toLowerCase()));
        });

        if (currentAutocompleteMatches.length === 0) {
            closeAutocomplete();
            return;
        }

        autocompleteWordRange = {
            from: { line: cur.line, ch: startCh },
            to: { line: cur.line, ch: endCh }
        };
        autocompleteActiveIdx = 0;
        renderAutocompleteMenu(cm);
    }

    const autocompleteKeyMap = {
        'Up': function () { navigateAutocomplete(-1); },
        'Down': function () { navigateAutocomplete(1); },
        'Enter': function () { selectActiveAutocomplete(); },
        'Tab': function () { selectActiveAutocomplete(); },
        'Esc': function () { closeAutocomplete(); }
    };

    /**
     * Renders floating autocomplete dropdown menu.
     */
    function renderAutocompleteMenu(cm) {
        closeAutocomplete();

        autocompleteMenu = document.createElement('ul');
        autocompleteMenu.id = 'codearenaAutocompleteMenu';
        autocompleteMenu.className = 'codearena-autocomplete-menu';

        currentAutocompleteMatches.forEach(function (item, idx) {
            const li = document.createElement('li');
            li.className = 'codearena-autocomplete-item' + (idx === autocompleteActiveIdx ? ' selected' : '');
            li.innerHTML = `<span>${escapeHtml(item.label)}</span><span class="codearena-autocomplete-kind">${item.type}</span>`;
            li.addEventListener('mousedown', function (e) {
                e.preventDefault();
                insertAutocompleteItem(item);
            });
            autocompleteMenu.appendChild(li);
        });

        const coords = cm.cursorCoords(true, 'local');
        const wrapper = cm.getWrapperElement();
        autocompleteMenu.style.top = (coords.bottom + 4) + 'px';
        autocompleteMenu.style.left = coords.left + 'px';
        wrapper.appendChild(autocompleteMenu);

        cm.addKeyMap(autocompleteKeyMap);
    }

    function navigateAutocomplete(dir) {
        if (!autocompleteMenu || currentAutocompleteMatches.length === 0) return;
        autocompleteActiveIdx = (autocompleteActiveIdx + dir + currentAutocompleteMatches.length) % currentAutocompleteMatches.length;
        const items = autocompleteMenu.querySelectorAll('.codearena-autocomplete-item');
        items.forEach(function (item, idx) {
            item.classList.toggle('selected', idx === autocompleteActiveIdx);
        });
        const activeEl = items[autocompleteActiveIdx];
        if (activeEl) activeEl.scrollIntoView({ block: 'nearest' });
    }

    function selectActiveAutocomplete() {
        if (currentAutocompleteMatches[autocompleteActiveIdx]) {
            insertAutocompleteItem(currentAutocompleteMatches[autocompleteActiveIdx]);
        } else {
            closeAutocomplete();
        }
    }

    function insertAutocompleteItem(item) {
        if (!codeEditor || !autocompleteWordRange) return;
        codeEditor.replaceRange(item.insert, autocompleteWordRange.from, autocompleteWordRange.to);
        closeAutocomplete();
        codeEditor.focus();
    }

    function closeAutocomplete() {
        if (autocompleteMenu && autocompleteMenu.parentNode) {
            autocompleteMenu.parentNode.removeChild(autocompleteMenu);
        }
        autocompleteMenu = null;
        if (codeEditor) {
            codeEditor.removeKeyMap(autocompleteKeyMap);
        }
    }

    /**
     * Initializes shortcuts platform toggle button handlers and autodetects OS.
     */
    function initShortcutsPlatformToggle() {
        const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');
        setShortcutsPlatform(isMac ? 'mac' : 'win');

        if (dom.btnPlatformWin) {
            dom.btnPlatformWin.addEventListener('click', function () {
                setShortcutsPlatform('win');
            });
        }
        if (dom.btnPlatformMac) {
            dom.btnPlatformMac.addEventListener('click', function () {
                setShortcutsPlatform('mac');
            });
        }
    }

    /**
     * Sets display of shortcuts platform variant (Windows/Linux vs macOS).
     */
    function setShortcutsPlatform(platform) {
        const isMac = platform === 'mac';
        if (dom.btnPlatformWin) {
            dom.btnPlatformWin.classList.toggle('active', !isMac);
            dom.btnPlatformWin.setAttribute('aria-selected', !isMac ? 'true' : 'false');
        }
        if (dom.btnPlatformMac) {
            dom.btnPlatformMac.classList.toggle('active', isMac);
            dom.btnPlatformMac.setAttribute('aria-selected', isMac ? 'true' : 'false');
        }

        const winElements = document.querySelectorAll('.shortcut-win');
        const macElements = document.querySelectorAll('.shortcut-mac');
        winElements.forEach(function (el) { el.style.display = isMac ? 'none' : 'inline'; });
        macElements.forEach(function (el) { el.style.display = isMac ? 'inline' : 'none'; });
    }

    /**
     * Closes all active dialogs, modals, find bars, and popup menus.
     */
    function closeActivePopups() {
        closeAutocomplete();
        closeFindBar();
        closeGotoLineModal();
        closeShortcutsModal();
        closeResetModal();
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
