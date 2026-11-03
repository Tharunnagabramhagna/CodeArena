/**
 * CodeArena — Individual Problem Workspace Controller (workspace.js)
 * Stage 3.4.7: Starter Return Control & Responsive Action Bar Refinement
 *
 * Handles:
 * - Problem loading from URL (?id=...) via window.CodeArenaAPI.problemService.getProblemById
 * - Polished Not-Found state when ID is missing or invalid
 * - Local CodeMirror 5 distribution initialization with Java mode and addons
 * - Robust styled textarea fallback when CodeMirror is unavailable
 * - Dark/light theme synchronization observing data-theme attribute
 * - Editor controls: Reset to starter code, Copy to clipboard with fallback, Cursor position tracking
 * - Public sample test case pills switching and console tabs (Test Cases, Test Results, Diagnostics)
 * - Run Sample Tests action with separate client-side structural validation via compilerService.runCode
 * - Critical technical honesty: Displays "Execution unavailable — frontend preview only." for actual output
 * - Never claims Java compilation, arbitrary execution, test pass/fail, or ACCEPTED verdicts
 * - Results clearing/resetting and modification tracking
 * - Submit Solution separation as a distinct preview-only action
 */

(function () {
    'use strict';

    // State Variables
    let currentProblem = null;
    let codeEditor = null;
    let isFallback = false;
    let activeCaseIndex = 0;
    let activeConsoleTab = 'cases';
    let isEvaluating = false;
    let lastEvaluationResult = null;
    let toastTimer = null;

    // Stage 3.4.6 Flexible Layout State & Constants
    const LAYOUT_STORAGE_KEY = 'codearena_workspace_layout';
    const DEFAULT_LAYOUT = Object.freeze({
        leftPaneWidthPercent: 46,
        consoleHeightPx: 260,
        isConsoleCollapsed: false,
        tabOrder: ['cases', 'results', 'diagnostics']
    });
    let currentLayout = {
        leftPaneWidthPercent: DEFAULT_LAYOUT.leftPaneWidthPercent,
        consoleHeightPx: DEFAULT_LAYOUT.consoleHeightPx,
        isConsoleCollapsed: DEFAULT_LAYOUT.isConsoleCollapsed,
        tabOrder: DEFAULT_LAYOUT.tabOrder.slice()
    };

    // Stage 3.4.7: Student-Controlled Return Statement Preference
    const RETURN_PREF_KEY = 'codearena_include_default_return';
    let includeDefaultReturn = true;

    // DOM Elements Cache
    let dom = {};

    /**
     * Initializes the problem workspace once DOM is ready.
     */
    async function init() {
        cacheElements();
        loadSavedLayout();
        loadReturnPreference();
        initSplittersAndLayout();
        bindGlobalEvents();
        await loadProblemFromUrl();
    }

    /**
     * Caches all required interactive DOM elements.
     */
    function cacheElements() {
        dom = {
            // Layout Containers & Panes
            problemNotFoundView: document.getElementById('problemNotFoundView'),
            notFoundMessage: document.getElementById('notFoundMessage'),
            problemReferencePane: document.getElementById('problemReferencePane'),
            codingWorkspacePane: document.getElementById('codingWorkspacePane'),
            breadcrumbProblemTitle: document.getElementById('breadcrumbProblemTitle'),

            // Left Pane Problem Metadata
            problemTitleText: document.getElementById('problemTitleText'),
            problemDiffBadge: document.getElementById('problemDiffBadge'),
            problemTopicTag: document.getElementById('problemTopicTag'),
            problemAccLabel: document.getElementById('problemAccLabel'),
            problemDescriptionHtml: document.getElementById('problemDescriptionHtml'),
            inputFormatText: document.getElementById('inputFormatText'),
            outputFormatText: document.getElementById('outputFormatText'),
            constraintsList: document.getElementById('constraintsList'),
            exampleCardsList: document.getElementById('exampleCardsList'),

            // Left Pane Tabs
            tabBtnDescription: document.getElementById('tabBtnDescription'),
            tabBtnSubmissions: document.getElementById('tabBtnSubmissions'),
            submissionsTabTag: document.getElementById('submissionsTabTag'),
            descriptionScrollContainer: document.getElementById('descriptionScrollContainer'),
            submissionsScrollView: document.getElementById('submissionsScrollView'),
            submissionsListContainer: document.getElementById('submissionsListContainer'),

            // Stage 3.4.7 Starter Return Statement Elements
            starterReturnToggleWrap: document.getElementById('starterReturnToggleWrap'),
            chkIncludeDefaultReturn: document.getElementById('chkIncludeDefaultReturn'),
            modalReturnOptionWrap: document.getElementById('modalReturnOptionWrap'),
            modalReturnToggleWrap: document.getElementById('modalReturnToggleWrap'),
            chkModalIncludeReturn: document.getElementById('chkModalIncludeReturn'),
            btnBookmarkProblem: document.getElementById('btnBookmarkProblem'),
            bookmarkBtnText: document.getElementById('bookmarkBtnText'),

            // Stage 3.4.6 Splitters & Dynamic Layout Elements
            workspaceSplitterV: document.getElementById('workspaceSplitterV'),
            workspaceSplitterH: document.getElementById('workspaceSplitterH'),
            consoleTabGroup: document.getElementById('consoleTabGroup'),
            testCaseConsoleArea: document.getElementById('testCaseConsoleArea'),
            btnLayoutExpandEditor: document.getElementById('btnLayoutExpandEditor'),
            btnLayoutExpandConsole: document.getElementById('btnLayoutExpandConsole'),
            btnLayoutReset: document.getElementById('btnLayoutReset'),

            // Right Pane Toolbar & Editor
            codeMirrorTarget: document.getElementById('codeMirrorTarget'),
            fallbackEditor: document.getElementById('fallbackEditor'),
            btnResetCode: document.getElementById('btnResetCode'),
            btnCopyCode: document.getElementById('btnCopyCode'),
            btnShortcutsHelp: document.getElementById('btnShortcutsHelp'),
            cursorPosDisplay: document.getElementById('cursorPosDisplay'),

            // Test Console Tabs & Panels
            tabBtnTestCases: document.getElementById('tabBtnTestCases'),
            tabBtnTestResults: document.getElementById('tabBtnTestResults'),
            tabBtnDiagnostics: document.getElementById('tabBtnDiagnostics'),
            panelTestCases: document.getElementById('panelTestCases'),
            panelTestResults: document.getElementById('panelTestResults'),
            panelDiagnostics: document.getElementById('panelDiagnostics'),

            // Test Cases Panel Elements
            testCasePillsRow: document.getElementById('testCasePillsRow'),
            testCaseInputDisplay: document.getElementById('testCaseInputDisplay'),
            testCaseExpectedDisplay: document.getElementById('testCaseExpectedDisplay'),

            // Test Results Panel Elements (Stage 3.4.4)
            resultsVerdictBanner: document.getElementById('resultsVerdictBanner'),
            verdictTitleText: document.getElementById('verdictTitleText'),
            verdictBadgeHonest: document.getElementById('verdictBadgeHonest'),
            verdictNoticeText: document.getElementById('verdictNoticeText'),
            btnClearResults: document.getElementById('btnClearResults'),
            resultsCasePillsRow: document.getElementById('resultsCasePillsRow'),
            resultsCaseDetail: document.getElementById('resultsCaseDetail'),
            resultsCaseNumText: document.getElementById('resultsCaseNumText'),
            resultsStatusBadge: document.getElementById('resultsStatusBadge'),
            resultsInputDisplay: document.getElementById('resultsInputDisplay'),
            resultsExpectedDisplay: document.getElementById('resultsExpectedDisplay'),
            resultsActualDisplay: document.getElementById('resultsActualDisplay'),
            resultsDisclaimerCard: document.getElementById('resultsDisclaimerCard'),

            // Diagnostics Panel Elements
            diagnosticsTerminalBox: document.getElementById('diagnosticsTerminalBox'),

            // Bottom Action Bar
            workspaceStatusIndicator: document.getElementById('workspaceStatusIndicator'),
            workspaceStatusText: document.getElementById('workspaceStatusText'),
            btnRunSampleTests: document.getElementById('btnRunSampleTests'),
            btnSubmitSolution: document.getElementById('btnSubmitSolution'),

            // Modals
            resetModalOverlay: document.getElementById('resetModalOverlay'),
            btnCancelReset: document.getElementById('btnCancelReset'),
            btnConfirmReset: document.getElementById('btnConfirmReset'),
            shortcutsModalOverlay: document.getElementById('shortcutsModalOverlay'),
            btnCloseShortcuts: document.getElementById('btnCloseShortcuts'),
            guestAuthModalOverlay: document.getElementById('guestAuthModalOverlay'),
            btnGuestCancel: document.getElementById('btnGuestCancel'),
            guestAuthModalDesc: document.getElementById('guestAuthModalDesc'),

            // Toast
            workspaceToast: document.getElementById('workspaceToast')
        };
    }

    /**
     * Reads the problem ID from query parameter (?id=...) and loads data.
     */
    async function loadProblemFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const problemId = params.get('id');

        if (!problemId || !problemId.trim()) {
            renderNotFound(null);
            return;
        }

        const cleanId = problemId.trim();

        if (!window.CodeArenaAPI || !window.CodeArenaAPI.problemService || typeof window.CodeArenaAPI.problemService.getProblemById !== 'function') {
            console.error('[CodeArena Workspace] problemService not available on window.CodeArenaAPI');
            renderNotFound(cleanId);
            return;
        }

        try {
            const res = await window.CodeArenaAPI.problemService.getProblemById(cleanId);
            if (res && res.success && res.data) {
                currentProblem = res.data;
                renderProblemData(currentProblem);
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
                saveRecentlyViewedProblem(currentProblem);
                bindEditorAndActionEvents();
                syncThemeWithEditor();
                observeThemeChanges();
                initResizeHandler();
            } else {
                renderNotFound(cleanId);
            }
        } catch (err) {
            console.error('[CodeArena Workspace] Error fetching problem:', err);
            renderNotFound(cleanId);
        }
    }

    /**
     * Renders a polished Not-Found state when an ID is missing or invalid.
     * Does NOT initialize an editor with unrelated problem code.
     */
    function renderNotFound(problemId) {
        currentProblem = null;
        document.title = 'Problem Not Found — CodeArena Workspace';

        if (dom.breadcrumbProblemTitle) {
            dom.breadcrumbProblemTitle.textContent = 'Problem Not Found';
        }

        if (dom.problemReferencePane) dom.problemReferencePane.style.display = 'none';
        if (dom.codingWorkspacePane) dom.codingWorkspacePane.style.display = 'none';

        if (dom.problemNotFoundView) {
            dom.problemNotFoundView.style.display = 'flex';
            if (dom.notFoundMessage) {
                if (problemId) {
                    dom.notFoundMessage.textContent = `The problem with ID "${problemId}" does not exist or has been removed from the catalogue.`;
                } else {
                    dom.notFoundMessage.textContent = 'No problem ID was specified in the URL. Please select a valid problem from the catalogue.';
                }
            }
        }
    }

    /**
     * Renders loaded problem metadata and specifications into the left pane & test console.
     */
    function renderProblemData(p) {
        // Document & Breadcrumb
        document.title = `${p.title} — CodeArena Workspace`;
        if (dom.breadcrumbProblemTitle) dom.breadcrumbProblemTitle.textContent = p.title;

        // Headline & Badges
        if (dom.problemTitleText) dom.problemTitleText.textContent = p.title;

        if (dom.problemDiffBadge) {
            dom.problemDiffBadge.textContent = p.difficulty;
            dom.problemDiffBadge.className = 'diff-badge diff-' + String(p.difficulty).toLowerCase();
        }

        if (dom.problemTopicTag) dom.problemTopicTag.textContent = p.topic;

        if (dom.problemAccLabel) {
            const accRate = (p.provisionalStats && p.provisionalStats.acceptanceRate)
                ? p.provisionalStats.acceptanceRate
                : 'N/A';
            dom.problemAccLabel.innerHTML = `Acceptance: <strong>${escapeHtml(accRate)}</strong> (Provisional)`;
        }

        // Rich Text Description
        if (dom.problemDescriptionHtml) {
            dom.problemDescriptionHtml.innerHTML = sanitizeInlineHtml(p.description || '<p>No description provided.</p>');
        }

        // Natural Input & Output Specifications (Render inline code styling properly)
        renderFormattedSpecification(p.inputFormat, dom.inputFormatText, 'Standard input specification.');
        renderFormattedSpecification(p.outputFormat, dom.outputFormatText, 'Standard output specification.');

        // Constraints List
        if (dom.constraintsList) {
            dom.constraintsList.innerHTML = '';
            if (Array.isArray(p.constraints) && p.constraints.length > 0) {
                p.constraints.forEach(function (c) {
                    const li = document.createElement('li');
                    let processed = String(c).replace(/`([^`]+)`/g, '<code class="spec-inline-code">$1</code>');
                    li.innerHTML = sanitizeInlineHtml(processed);
                    dom.constraintsList.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = 'None specified.';
                dom.constraintsList.appendChild(li);
            }
        }

        // Example Cards (Public Sample Test Cases)
        if (dom.exampleCardsList) {
            dom.exampleCardsList.innerHTML = '';
            if (Array.isArray(p.sampleTestCases) && p.sampleTestCases.length > 0) {
                p.sampleTestCases.forEach(function (tc, idx) {
                    const card = document.createElement('div');
                    card.className = 'example-card';
                    card.innerHTML = `
                        <div class="example-card-title">Example ${idx + 1}:</div>
                        <div class="example-row">
                            <span class="example-tag">Input:</span>
                            <span class="example-val">${escapeHtml(tc.input)}</span>
                        </div>
                        <div class="example-row">
                            <span class="example-tag">Output:</span>
                            <span class="example-val">${escapeHtml(tc.expectedOutput)}</span>
                        </div>
                        ${tc.explanation ? `
                        <div class="example-explanation">
                            <strong>Explanation:</strong> ${escapeHtml(tc.explanation)}
                        </div>` : ''}
                    `;
                    dom.exampleCardsList.appendChild(card);
                });
            }
        }

        // Populate Public Sample Test Cases in both Test Cases and Test Results tabs
        renderTestCasePills(p.sampleTestCases);
        renderResultsCasePills(p.sampleTestCases);

        // Load existing session submissions for this problem
        loadSubmissions(p.id);

        // Reset any prior results
        clearResults();
    }

    /**
     * Renders testcase selector pills for the Test Cases tab.
     */
    function renderTestCasePills(testCases) {
        if (!dom.testCasePillsRow) return;
        dom.testCasePillsRow.innerHTML = '';

        if (!Array.isArray(testCases) || testCases.length === 0) {
            dom.testCasePillsRow.innerHTML = '<span style="font-size: 0.8rem; color: var(--color-text-muted);">No sample test cases available.</span>';
            if (dom.testCaseInputDisplay) dom.testCaseInputDisplay.textContent = '—';
            if (dom.testCaseExpectedDisplay) dom.testCaseExpectedDisplay.textContent = '—';
            return;
        }

        testCases.forEach(function (tc, idx) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'testcase-pill-btn' + (idx === 0 ? ' active' : '');
            btn.textContent = `Case ${idx + 1}`;
            btn.addEventListener('click', function () {
                selectTestCase(idx);
            });
            dom.testCasePillsRow.appendChild(btn);
        });

        activeCaseIndex = 0;
        selectTestCase(0);
    }

    /**
     * Renders testcase selector pills for the Test Results tab.
     */
    function renderResultsCasePills(testCases) {
        if (!dom.resultsCasePillsRow) return;
        dom.resultsCasePillsRow.innerHTML = '';

        if (!Array.isArray(testCases) || testCases.length === 0) {
            dom.resultsCasePillsRow.innerHTML = '<span style="font-size: 0.8rem; color: var(--color-text-muted);">No sample test cases available.</span>';
            return;
        }

        testCases.forEach(function (tc, idx) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'testcase-pill-btn' + (idx === activeCaseIndex ? ' active' : '');
            btn.textContent = `Case ${idx + 1}`;
            btn.addEventListener('click', function () {
                selectTestCase(idx);
            });
            dom.resultsCasePillsRow.appendChild(btn);
        });
    }

    /**
     * Synchronizes active test case selection across Test Cases and Test Results tabs.
     */
    function selectTestCase(idx) {
        if (!currentProblem || !Array.isArray(currentProblem.sampleTestCases)) return;
        const testCase = currentProblem.sampleTestCases[idx];
        if (!testCase) return;

        activeCaseIndex = idx;

        // Synchronize pills in Test Cases tab
        if (dom.testCasePillsRow) {
            const pills = dom.testCasePillsRow.querySelectorAll('.testcase-pill-btn');
            pills.forEach((p, pIdx) => p.classList.toggle('active', pIdx === idx));
        }

        // Synchronize pills in Test Results tab
        if (dom.resultsCasePillsRow) {
            const rPills = dom.resultsCasePillsRow.querySelectorAll('.testcase-pill-btn');
            rPills.forEach((p, pIdx) => p.classList.toggle('active', pIdx === idx));
        }

        // Update Test Cases tab displays
        if (dom.testCaseInputDisplay) dom.testCaseInputDisplay.textContent = testCase.input || '';
        if (dom.testCaseExpectedDisplay) dom.testCaseExpectedDisplay.textContent = testCase.expectedOutput || '';

        // Update Test Results tab displays
        if (dom.resultsCaseNumText) dom.resultsCaseNumText.textContent = `Case ${idx + 1}`;
        if (dom.resultsInputDisplay) dom.resultsInputDisplay.textContent = testCase.input || '';
        if (dom.resultsExpectedDisplay) dom.resultsExpectedDisplay.textContent = testCase.expectedOutput || '';
        if (dom.resultsActualDisplay) {
            dom.resultsActualDisplay.textContent = 'Execution unavailable — frontend preview only.';
        }
    }

    /**
     * Initializes CodeMirror 5 with Java mode and addons, or falls back to styled textarea.
     */
    function initEditor(starterCode) {
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
                    value: starterCode || '',
                    mode: 'text/x-java',
                    theme: currentTheme,
                    lineNumbers: editorLineNumbers,
                    matchBrackets: true,
                    autoCloseBrackets: editorAutoClose,
                    styleActiveLine: true,
                    indentUnit: 4,
                    tabSize: 4,
                    indentWithTabs: false,
                    lineWrapping: false,
                    autofocus: true,
                    extraKeys: {
                        'Ctrl-Enter': function () {
                            runSampleTests();
                        },
                        'Cmd-Enter': function () {
                            runSampleTests();
                        },
                        'Ctrl-S': function () {
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
                        }
                    }
                });

                if (userSettings) {
                    if (userSettings.editorTabSize && typeof codeEditor.setOption === 'function') {
                        codeEditor.setOption('indentUnit', parseInt(userSettings.editorTabSize, 10));
                        codeEditor.setOption('tabSize', parseInt(userSettings.editorTabSize, 10));
                    }
                    if (userSettings.editorFontSize && codeEditor.getWrapperElement()) {
                        codeEditor.getWrapperElement().style.fontSize = userSettings.editorFontSize;
                    }
                    if (userSettings.compactToolbar) {
                        document.documentElement.setAttribute('data-compact-toolbar', 'true');
                    }
                }

                // Listen for cursor position updates
                codeEditor.on('cursorActivity', function () {
                    const pos = codeEditor.getCursor();
                    updateCursorPosition(pos.line + 1, pos.ch + 1);
                });

                // Listen for edits to mark results as stale
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
                });

                isFallback = false;
                if (dom.fallbackEditor) dom.fallbackEditor.style.display = 'none';

                // Initial refresh after render
                setTimeout(function () {
                    if (codeEditor) codeEditor.refresh();
                }, 100);

                updateCursorPosition(1, 1);
                return;
            } catch (err) {
                console.warn('[CodeArena Workspace] CodeMirror initialization failed, switching to fallback textarea:', err);
            }
        }

        // Activate styled textarea fallback
        isFallback = true;
        if (dom.codeMirrorTarget) dom.codeMirrorTarget.style.display = 'none';
        if (dom.fallbackEditor) {
            dom.fallbackEditor.style.display = 'block';
            dom.fallbackEditor.value = starterCode || '';

            dom.fallbackEditor.addEventListener('input', function () {
                updateFallbackCursor();
                if (lastEvaluationResult) markResultsStale();
            });
            dom.fallbackEditor.addEventListener('click', updateFallbackCursor);
            dom.fallbackEditor.addEventListener('keyup', updateFallbackCursor);

            // Handle Tab indentation & shortcut in fallback textarea
            dom.fallbackEditor.addEventListener('keydown', function (e) {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    const start = this.selectionStart;
                    const end = this.selectionEnd;
                    this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);
                    this.selectionStart = this.selectionEnd = start + 4;
                    updateFallbackCursor();
                    if (lastEvaluationResult) markResultsStale();
                } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    runSampleTests();
                }
            });
        }
        updateCursorPosition(1, 1);
    }

    /**
     * Determines active CodeMirror theme matching the document data-theme.
     */
    function getCurrentThemeName() {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        return isLight ? 'codearena-light' : 'codearena-dark';
    }

    /**
     * Synchronizes CodeMirror theme with the active page theme while preserving source code.
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
     * Ensures CodeMirror refreshes properly on window resize.
     */

    /* ==========================================================================
       Stage 3.4.6: Flexible Layout & Natural Specification Formatting
       ========================================================================== */

    /**
     * Safely sanitizes inline HTML allowing only safe formatting tags:
     * <code>, <em>, <strong>, <span>, <p>, <br>.
     */
    function sanitizeInlineHtml(html) {
        if (typeof html !== 'string') return '';
        return html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
            .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
            .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
            .replace(/\son\w+="[^"]*"/gi, '')
            .replace(/\son\w+='[^']*'/gi, '')
            .replace(/\son\w+=[^\s>]+/gi, '')
            .replace(/javascript:[^"']*/gi, '#');
    }

    /**
     * Renders natural technical specifications with true inline code tags
     * rather than raw literal HTML entities.
     */
    function renderFormattedSpecification(rawTextOrHtml, container, fallbackText) {
        if (!container) return;
        if (!rawTextOrHtml) {
            container.textContent = fallbackText || 'None specified.';
            return;
        }

        // If backticks are used like `target`, convert to <code class="spec-inline-code">target</code>
        let processed = String(rawTextOrHtml).replace(/`([^`]+)`/g, '<code class="spec-inline-code">$1</code>');

        // Sanitize and inject HTML allowing true <code> rendering
        container.innerHTML = sanitizeInlineHtml(processed);
    }

    /**
     * Validates layout preferences before applying to DOM or storage.
     */
    function validateLayoutSettings(saved) {
        if (!saved || typeof saved !== 'object') return null;

        let left = parseFloat(saved.leftPaneWidthPercent);
        if (isNaN(left) || left < 20 || left > 75) {
            left = DEFAULT_LAYOUT.leftPaneWidthPercent;
        }

        let consoleH = parseInt(saved.consoleHeightPx, 10);
        if (isNaN(consoleH) || consoleH < 36 || consoleH > 800) {
            consoleH = DEFAULT_LAYOUT.consoleHeightPx;
        }

        let collapsed = Boolean(saved.isConsoleCollapsed);

        const validTabs = ['cases', 'results', 'diagnostics'];
        let tabOrder = Array.isArray(saved.tabOrder)
            ? saved.tabOrder.filter(t => validTabs.includes(t))
            : validTabs.slice();

        if (tabOrder.length !== 3 || new Set(tabOrder).size !== 3) {
            tabOrder = validTabs.slice();
        }

        return {
            leftPaneWidthPercent: Math.round(left * 10) / 10,
            consoleHeightPx: consoleH,
            isConsoleCollapsed: collapsed,
            tabOrder: tabOrder
        };
    }

    /**
     * Loads layout settings from localStorage with default fallback.
     */
    function loadSavedLayout() {
        try {
            if (typeof localStorage !== 'undefined') {
                const raw = localStorage.getItem(LAYOUT_STORAGE_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    const validated = validateLayoutSettings(parsed);
                    if (validated) {
                        currentLayout = validated;
                        applyLayoutSettings(currentLayout, false);
                        return currentLayout;
                    }
                }
            }
        } catch (err) {
            console.warn('[CodeArena Workspace] Error loading saved layout, using default:', err);
        }

        currentLayout = {
            leftPaneWidthPercent: DEFAULT_LAYOUT.leftPaneWidthPercent,
            consoleHeightPx: DEFAULT_LAYOUT.consoleHeightPx,
            isConsoleCollapsed: DEFAULT_LAYOUT.isConsoleCollapsed,
            tabOrder: DEFAULT_LAYOUT.tabOrder.slice()
        };
        applyLayoutSettings(currentLayout, false);
        return currentLayout;
    }

    /**
     * Saves validated layout settings to localStorage.
     * Does NOT store source code or submission data.
     */
    function saveLayoutState() {
        try {
            if (typeof localStorage !== 'undefined') {
                const validated = validateLayoutSettings(currentLayout) || DEFAULT_LAYOUT;
                localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(validated));
            }
        } catch (err) {
            console.warn('[CodeArena Workspace] Could not save layout state:', err);
        }
    }

    /**
     * Applies layout settings to CSS custom properties and DOM elements.
     */
    function applyLayoutSettings(layout, refreshEditor) {
        if (!layout) return;

        // Apply vertical split width
        document.documentElement.style.setProperty('--split-left-width', `${layout.leftPaneWidthPercent}%`);

        // Apply horizontal console height
        const h = layout.isConsoleCollapsed ? 36 : layout.consoleHeightPx;
        document.documentElement.style.setProperty('--console-height', `${h}px`);

        // Update layout preset buttons active state
        if (dom.btnLayoutExpandEditor) {
            dom.btnLayoutExpandEditor.classList.toggle('active', layout.isConsoleCollapsed);
        }
        if (dom.btnLayoutExpandConsole) {
            dom.btnLayoutExpandConsole.classList.toggle('active', !layout.isConsoleCollapsed && layout.consoleHeightPx > 360);
        }

        // Reorder tabs if needed
        if (Array.isArray(layout.tabOrder)) {
            reorderConsoleTabsInDom(layout.tabOrder);
        }

        if (refreshEditor && codeEditor) {
            codeEditor.refresh();
        }
    }

    /**
     * Reorders the console tabs in the DOM to match the given tab order.
     */
    function reorderConsoleTabsInDom(tabOrder) {
        if (!dom.consoleTabGroup || !Array.isArray(tabOrder)) return;
        const tabsMap = {
            cases: dom.tabBtnTestCases,
            results: dom.tabBtnTestResults,
            diagnostics: dom.tabBtnDiagnostics
        };

        tabOrder.forEach(key => {
            const btn = tabsMap[key];
            if (btn && btn.parentNode === dom.consoleTabGroup) {
                dom.consoleTabGroup.appendChild(btn);
            }
        });
    }

    /**
     * Initializes splitters, movable tabs, and layout controls.
     */
    function initSplittersAndLayout() {
        initVerticalSplitter();
        initHorizontalSplitter();
        initDraggableConsoleTabs();
        initLayoutControls();
    }

    /**
     * Vertical Splitter: Drag to resize Problem Reference vs Code Workspace panes.
     */
    function initVerticalSplitter() {
        if (!dom.workspaceSplitterV) return;

        let isDragging = false;

        function onPointerDown(e) {
            if (window.innerWidth <= 960) return; // Disabled on stacked mobile/tablet view
            isDragging = true;
            document.body.classList.add('is-resizing-v');
            dom.workspaceSplitterV.classList.add('is-dragging');
            window.addEventListener('pointermove', onPointerMove);
            window.addEventListener('pointerup', onPointerUp);
            window.addEventListener('pointercancel', onPointerUp);
        }

        function onPointerMove(e) {
            if (!isDragging) return;
            const totalWidth = window.innerWidth;
            let percent = (e.clientX / totalWidth) * 100;
            // Boundary clamp: min 20%, max 75%
            percent = Math.max(20, Math.min(75, percent));
            percent = Math.round(percent * 10) / 10;
            currentLayout.leftPaneWidthPercent = percent;
            document.documentElement.style.setProperty('--split-left-width', `${percent}%`);
            if (codeEditor) codeEditor.refresh();
        }

        function onPointerUp() {
            if (!isDragging) return;
            isDragging = false;
            document.body.classList.remove('is-resizing-v');
            if (dom.workspaceSplitterV) dom.workspaceSplitterV.classList.remove('is-dragging');
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointercancel', onPointerUp);
            saveLayoutState();
            if (codeEditor) codeEditor.refresh();
        }

        dom.workspaceSplitterV.addEventListener('pointerdown', onPointerDown);

        // Keyboard arrow accessibility
        dom.workspaceSplitterV.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                currentLayout.leftPaneWidthPercent = Math.max(20, Math.round((currentLayout.leftPaneWidthPercent - 2) * 10) / 10);
                applyLayoutSettings(currentLayout, true);
                saveLayoutState();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                currentLayout.leftPaneWidthPercent = Math.min(75, Math.round((currentLayout.leftPaneWidthPercent + 2) * 10) / 10);
                applyLayoutSettings(currentLayout, true);
                saveLayoutState();
            }
        });
    }

    /**
     * Horizontal Splitter: Drag to resize Code Editor vs Test Console panes.
     */
    function initHorizontalSplitter() {
        if (!dom.workspaceSplitterH || !dom.codingWorkspacePane) return;

        let isDragging = false;

        function onPointerDown(e) {
            if (window.innerWidth <= 960) return;
            isDragging = true;
            document.body.classList.add('is-resizing-h');
            dom.workspaceSplitterH.classList.add('is-dragging');
            if (dom.testCaseConsoleArea) dom.testCaseConsoleArea.classList.add('no-transition');
            window.addEventListener('pointermove', onPointerMove);
            window.addEventListener('pointerup', onPointerUp);
            window.addEventListener('pointercancel', onPointerUp);
        }

        function onPointerMove(e) {
            if (!isDragging) return;
            const paneRect = dom.codingWorkspacePane.getBoundingClientRect();
            let newH = paneRect.bottom - e.clientY;
            // Bounds: min 90px, max (pane height - 160px)
            const maxH = Math.max(160, paneRect.height - 160);
            newH = Math.max(90, Math.min(maxH, newH));
            newH = Math.round(newH);
            currentLayout.consoleHeightPx = newH;
            currentLayout.isConsoleCollapsed = false;
            document.documentElement.style.setProperty('--console-height', `${newH}px`);
            if (codeEditor) codeEditor.refresh();
        }

        function onPointerUp() {
            if (!isDragging) return;
            isDragging = false;
            document.body.classList.remove('is-resizing-h');
            if (dom.workspaceSplitterH) dom.workspaceSplitterH.classList.remove('is-dragging');
            if (dom.testCaseConsoleArea) dom.testCaseConsoleArea.classList.remove('no-transition');
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointercancel', onPointerUp);
            saveLayoutState();
            if (codeEditor) codeEditor.refresh();
        }

        dom.workspaceSplitterH.addEventListener('pointerdown', onPointerDown);

        // Keyboard arrow accessibility
        dom.workspaceSplitterH.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                currentLayout.consoleHeightPx = Math.min(600, currentLayout.consoleHeightPx + 20);
                currentLayout.isConsoleCollapsed = false;
                applyLayoutSettings(currentLayout, true);
                saveLayoutState();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                currentLayout.consoleHeightPx = Math.max(90, currentLayout.consoleHeightPx - 20);
                currentLayout.isConsoleCollapsed = false;
                applyLayoutSettings(currentLayout, true);
                saveLayoutState();
            }
        });
    }

    /**
     * Draggable Console Tabs: Move and reorder Test Cases, Test Results, and Diagnostics.
     */
    function initDraggableConsoleTabs() {
        if (!dom.consoleTabGroup) return;

        let draggedTabKey = null;

        const tabs = dom.consoleTabGroup.querySelectorAll('.console-tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('dragstart', function (e) {
                draggedTabKey = this.dataset.tab;
                this.classList.add('is-dragging');
                if (e.dataTransfer) {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', draggedTabKey);
                }
            });

            tab.addEventListener('dragend', function () {
                this.classList.remove('is-dragging');
                tabs.forEach(t => {
                    t.classList.remove('drop-target-before', 'drop-target-after');
                });
                draggedTabKey = null;
            });

            tab.addEventListener('dragover', function (e) {
                e.preventDefault();
                if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
                const rect = this.getBoundingClientRect();
                const mid = rect.left + rect.width / 2;
                if (e.clientX < mid) {
                    this.classList.add('drop-target-before');
                    this.classList.remove('drop-target-after');
                } else {
                    this.classList.add('drop-target-after');
                    this.classList.remove('drop-target-before');
                }
            });

            tab.addEventListener('dragleave', function () {
                this.classList.remove('drop-target-before', 'drop-target-after');
            });

            tab.addEventListener('drop', function (e) {
                e.preventDefault();
                this.classList.remove('drop-target-before', 'drop-target-after');
                const targetKey = this.dataset.tab;
                if (!draggedTabKey || draggedTabKey === targetKey) return;

                const draggedEl = dom.consoleTabGroup.querySelector(`[data-tab="${draggedTabKey}"]`);
                if (!draggedEl) return;

                const rect = this.getBoundingClientRect();
                const isBefore = (e.clientX < (rect.left + rect.width / 2));

                if (isBefore) {
                    dom.consoleTabGroup.insertBefore(draggedEl, this);
                } else {
                    dom.consoleTabGroup.insertBefore(draggedEl, this.nextSibling);
                }

                // Update tabOrder in currentLayout
                const newOrder = Array.from(dom.consoleTabGroup.children).map(btn => btn.dataset.tab).filter(Boolean);
                currentLayout.tabOrder = newOrder;
                saveLayoutState();
                showToast('Console tabs reordered', 'info');
            });
        });
    }

    /**
     * Initializes toolbar layout presets: Expand Editor, Expand Console, and Reset Layout.
     */
    function initLayoutControls() {
        // Expand Editor (minimize console)
        if (dom.btnLayoutExpandEditor) {
            dom.btnLayoutExpandEditor.addEventListener('click', function () {
                currentLayout.isConsoleCollapsed = !currentLayout.isConsoleCollapsed;
                applyLayoutSettings(currentLayout, true);
                saveLayoutState();
                showToast(currentLayout.isConsoleCollapsed ? 'Editor expanded (Console collapsed)' : 'Editor restored', 'info');
            });
        }

        // Expand Console
        if (dom.btnLayoutExpandConsole) {
            dom.btnLayoutExpandConsole.addEventListener('click', function () {
                currentLayout.isConsoleCollapsed = false;
                if (currentLayout.consoleHeightPx < 380) {
                    currentLayout.consoleHeightPx = 420;
                    showToast('Console expanded', 'info');
                } else {
                    currentLayout.consoleHeightPx = DEFAULT_LAYOUT.consoleHeightPx;
                    showToast('Console height restored', 'info');
                }
                applyLayoutSettings(currentLayout, true);
                saveLayoutState();
            });
        }

        // Reset Layout
        if (dom.btnLayoutReset) {
            dom.btnLayoutReset.addEventListener('click', function () {
                resetLayoutToDefault();
            });
        }
    }

    /**
     * Restores the default layout and removes saved settings from localStorage.
     */
    function resetLayoutToDefault() {
        currentLayout = {
            leftPaneWidthPercent: DEFAULT_LAYOUT.leftPaneWidthPercent,
            consoleHeightPx: DEFAULT_LAYOUT.consoleHeightPx,
            isConsoleCollapsed: DEFAULT_LAYOUT.isConsoleCollapsed,
            tabOrder: DEFAULT_LAYOUT.tabOrder.slice()
        };
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem(LAYOUT_STORAGE_KEY);
            }
        } catch (e) {}
        applyLayoutSettings(currentLayout, true);
        showToast('Workspace layout reset to default', 'info');
    }

    function initResizeHandler() {
        let resizeTimer = null;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                if (codeEditor) codeEditor.refresh();
            }, 100);
        });
    }

    /**
     * Returns the current source code from the active editor.
     */

    /* ==========================================================================
       Stage 3.4.7: Student-Controlled Default Return Statement Logic
       ========================================================================== */

    /**
     * Loads the student's return-statement preference from localStorage.
     * Default: true (include placeholder return statement).
     */
    function loadReturnPreference() {
        try {
            if (typeof localStorage !== 'undefined') {
                const stored = localStorage.getItem(RETURN_PREF_KEY);
                if (stored !== null) {
                    includeDefaultReturn = (stored !== 'false');
                    return includeDefaultReturn;
                }
            }
        } catch (e) {
            console.warn('[CodeArena Workspace] Could not read return preference:', e);
        }
        includeDefaultReturn = true;
        return includeDefaultReturn;
    }

    /**
     * Saves the student's return-statement preference to localStorage.
     */
    function saveReturnPreference(val) {
        includeDefaultReturn = Boolean(val);
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(RETURN_PREF_KEY, includeDefaultReturn ? 'true' : 'false');
            }
        } catch (e) {
            console.warn('[CodeArena Workspace] Could not save return preference:', e);
        }
    }

    /**
     * Determines whether a problem method has a void return type.
     */
    function isVoidProblem(problem) {
        if (!problem || !problem.starterCode) return false;
        return /\bvoid\s+[a-zA-Z0-9_]+\s*\(/.test(problem.starterCode);
    }

    /**
     * Generates problem starter code with or without the default placeholder return statement.
     * Does NOT blindly strip return statements from arbitrary student code.
     */
    function getStarterCode(problem, withReturn) {
        if (!problem || !problem.starterCode) return '';
        const raw = problem.starterCode;

        if (isVoidProblem(problem)) {
            return raw;
        }

        if (withReturn) {
            return raw;
        }

        // Match only the placeholder return statement at the end of the method body before closing brace
        return raw.replace(/\n[ \t]*return\s+(new\s+[^;]+|false|true|null|-?\d+);\s*\n(\s*\})/g, '\n\n$2');
    }

    /**
     * Checks whether the student has modified the editor content beyond the default templates.
     */
    function isCodeModified(problem) {
        if (!problem) return false;
        const current = getCode().trim();
        const withRet = getStarterCode(problem, true).trim();
        const withoutRet = getStarterCode(problem, false).trim();
        return current !== withRet && current !== withoutRet;
    }

    /**
     * Synchronizes return toggle UI state with active problem & preference.
     */
    function updateReturnToggleUI() {
        if (dom.chkIncludeDefaultReturn) {
            dom.chkIncludeDefaultReturn.checked = includeDefaultReturn;
        }
        if (dom.chkModalIncludeReturn) {
            dom.chkModalIncludeReturn.checked = includeDefaultReturn;
        }

        if (currentProblem && isVoidProblem(currentProblem)) {
            if (dom.starterReturnToggleWrap) {
                dom.starterReturnToggleWrap.classList.add('is-disabled');
                dom.starterReturnToggleWrap.title = 'Method return type is void · Return statement not applicable';
            }
            if (dom.chkIncludeDefaultReturn) dom.chkIncludeDefaultReturn.disabled = true;
            if (dom.modalReturnOptionWrap) dom.modalReturnOptionWrap.style.display = 'none';
        } else {
            if (dom.starterReturnToggleWrap) {
                dom.starterReturnToggleWrap.classList.remove('is-disabled');
                dom.starterReturnToggleWrap.title = 'Toggle default placeholder return statement in starter code';
            }
            if (dom.chkIncludeDefaultReturn) dom.chkIncludeDefaultReturn.disabled = false;
            if (dom.modalReturnOptionWrap) dom.modalReturnOptionWrap.style.display = 'block';
        }
    }

    /**
     * Handles user toggling the default return statement control.
     * Protects student-written code: never deletes or overwrites existing user modifications!
     */
    function handleReturnToggleChange(newVal) {
        saveReturnPreference(newVal);

        if (dom.chkModalIncludeReturn) {
            dom.chkModalIncludeReturn.checked = includeDefaultReturn;
        }

        if (!currentProblem) return;

        if (isVoidProblem(currentProblem)) {
            showToast('Method return type is void · Return statement not applicable', 'info');
            return;
        }

        if (isCodeModified(currentProblem)) {
            // Student has already written code: protect their work!
            showToast('Preference saved. Use "Reset" to apply the updated template.', 'info');
        } else {
            // Editor still holds pristine starter template: update immediately
            const newStarter = getStarterCode(currentProblem, includeDefaultReturn);
            setCode(newStarter);
            showToast(`Default return statement ${includeDefaultReturn ? 'included' : 'omitted'} in starter code`, 'info');
        }
    }

    function getCode() {
        if (codeEditor && !isFallback) {
            return codeEditor.getValue();
        }
        if (dom.fallbackEditor) {
            return dom.fallbackEditor.value;
        }
        return '';
    }

    /**
     * Sets the source code in the active editor.
     */
    function setCode(code) {
        if (codeEditor && !isFallback) {
            codeEditor.setValue(code);
            codeEditor.refresh();
        } else if (dom.fallbackEditor) {
            dom.fallbackEditor.value = code;
        }
    }

    /**
     * Updates cursor line and column display.
     */
    function updateCursorPosition(line, col) {
        if (dom.cursorPosDisplay) {
            dom.cursorPosDisplay.textContent = `Ln ${line}, Col ${col}`;
        }
    }

    /**
     * Computes line and column in fallback textarea based on selectionStart.
     */
    function updateFallbackCursor() {
        if (!dom.fallbackEditor) return;
        const pos = dom.fallbackEditor.selectionStart || 0;
        const textBefore = dom.fallbackEditor.value.substring(0, pos);
        const lines = textBefore.split('\n');
        const line = lines.length;
        const col = lines[lines.length - 1].length + 1;
        updateCursorPosition(line, col);
    }

    /**
     * Binds global events that should exist even if no problem is loaded (e.g. modals, tabs).
     */
    function bindGlobalEvents() {
        // Left Pane Tabs (Description vs Submissions)
        if (dom.tabBtnDescription && dom.tabBtnSubmissions) {
            dom.tabBtnDescription.addEventListener('click', function () {
                dom.tabBtnDescription.classList.add('active');
                dom.tabBtnSubmissions.classList.remove('active');
                if (dom.descriptionScrollContainer) dom.descriptionScrollContainer.style.display = 'flex';
                if (dom.submissionsScrollView) dom.submissionsScrollView.style.display = 'none';
            });

            dom.tabBtnSubmissions.addEventListener('click', function () {
                dom.tabBtnSubmissions.classList.add('active');
                dom.tabBtnDescription.classList.remove('active');
                if (dom.descriptionScrollContainer) dom.descriptionScrollContainer.style.display = 'none';
                if (dom.submissionsScrollView) dom.submissionsScrollView.style.display = 'flex';
                if (currentProblem) {
                    loadSubmissions(currentProblem.id);
                }
            });
        }

        // Test Console Tabs (Test Cases vs Test Results vs Diagnostics)
        if (dom.tabBtnTestCases) dom.tabBtnTestCases.addEventListener('click', () => switchConsoleTab('cases'));
        if (dom.tabBtnTestResults) dom.tabBtnTestResults.addEventListener('click', () => switchConsoleTab('results'));
        if (dom.tabBtnDiagnostics) dom.tabBtnDiagnostics.addEventListener('click', () => switchConsoleTab('diagnostics'));

        // Starter Return Toggle Controls (Stage 3.4.7)
        if (dom.chkIncludeDefaultReturn) {
            dom.chkIncludeDefaultReturn.addEventListener('change', function () {
                handleReturnToggleChange(this.checked);
            });
        }
        if (dom.chkModalIncludeReturn) {
            dom.chkModalIncludeReturn.addEventListener('change', function () {
                saveReturnPreference(this.checked);
                if (dom.chkIncludeDefaultReturn) {
                    dom.chkIncludeDefaultReturn.checked = this.checked;
                }
            });
        }

        // Reset Modal Controls
        if (dom.btnResetCode && dom.resetModalOverlay) {
            dom.btnResetCode.addEventListener('click', function () {
                if (dom.chkModalIncludeReturn) {
                    dom.chkModalIncludeReturn.checked = includeDefaultReturn;
                }
                dom.resetModalOverlay.classList.add('active');
            });
        }
        if (dom.btnCancelReset && dom.resetModalOverlay) {
            dom.btnCancelReset.addEventListener('click', function () {
                dom.resetModalOverlay.classList.remove('active');
            });
        }
        if (dom.resetModalOverlay) {
            dom.resetModalOverlay.addEventListener('click', function (e) {
                if (e.target === dom.resetModalOverlay) {
                    dom.resetModalOverlay.classList.remove('active');
                }
            });
        }

        // Confirm Reset (applies template based on currently selected preference)
        // Workspace Quick Font Size Controls (Phase 6)
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

        if (dom.btnConfirmReset) {
            dom.btnConfirmReset.addEventListener('click', function () {
                if (currentProblem) {
                    if (dom.chkModalIncludeReturn && !isVoidProblem(currentProblem)) {
                        saveReturnPreference(dom.chkModalIncludeReturn.checked);
                        if (dom.chkIncludeDefaultReturn) {
                            dom.chkIncludeDefaultReturn.checked = includeDefaultReturn;
                        }
                    }
                    const codeToRestore = getStarterCode(currentProblem, includeDefaultReturn);
                    setCode(codeToRestore);
                    if (codeEditor && !isFallback) codeEditor.focus();
                    clearResults();
                    showToast('Starter code restored', 'info');
                }
                if (dom.resetModalOverlay) {
                    dom.resetModalOverlay.classList.remove('active');
                }
            });
        }

        // Shortcuts Modal Controls
        if (dom.btnShortcutsHelp && dom.shortcutsModalOverlay) {
            dom.btnShortcutsHelp.addEventListener('click', function () {
                dom.shortcutsModalOverlay.classList.add('active');
            });
        }
        if (dom.btnCloseShortcuts && dom.shortcutsModalOverlay) {
            dom.btnCloseShortcuts.addEventListener('click', function () {
                dom.shortcutsModalOverlay.classList.remove('active');
            });
        }

        if (dom.btnGuestCancel) {
            dom.btnGuestCancel.addEventListener('click', function () {
                hideGuestAuthPrompt();
            });
        }

        if (dom.guestAuthModalOverlay) {
            dom.guestAuthModalOverlay.addEventListener('click', function (e) {
                if (e.target === dom.guestAuthModalOverlay) {
                    hideGuestAuthPrompt();
                }
            });
        }
        if (dom.shortcutsModalOverlay) {
            dom.shortcutsModalOverlay.addEventListener('click', function (e) {
                if (e.target === dom.shortcutsModalOverlay) {
                    dom.shortcutsModalOverlay.classList.remove('active');
                }
            });
        }

        // Clear Results Button in Test Results Banner
        if (dom.btnClearResults) {
            dom.btnClearResults.addEventListener('click', function () {
                clearResults();
                showToast('Preview results cleared', 'info');
            });
        }

        // Global Keydown Listener
        window.addEventListener('keydown', handleGlobalKeydown);
    }

    /**
     * Binds editor toolbar, action bar, and copy buttons once problem is loaded.
     */
    function bindEditorAndActionEvents() {
        // Copy Code Button
        if (dom.btnCopyCode) {
            dom.btnCopyCode.addEventListener('click', function () {
                copyCodeToClipboard();
            });
        }

        // Run Sample Tests Button
        if (dom.btnRunSampleTests) {
            dom.btnRunSampleTests.addEventListener('click', function () {
                runSampleTests();
            });
        }

        // Submit Solution Button
        if (dom.btnSubmitSolution) {
            dom.btnSubmitSolution.addEventListener('click', function () {
                handleSubmitSolution();
            });
        }
    }

    /**
     * Switches between console tabs: 'cases' | 'results' | 'diagnostics'.
     */
    function switchConsoleTab(tabName) {
        activeConsoleTab = tabName;

        if (dom.tabBtnTestCases) dom.tabBtnTestCases.classList.toggle('active', tabName === 'cases');
        if (dom.tabBtnTestResults) dom.tabBtnTestResults.classList.toggle('active', tabName === 'results');
        if (dom.tabBtnDiagnostics) dom.tabBtnDiagnostics.classList.toggle('active', tabName === 'diagnostics');

        if (dom.panelTestCases) dom.panelTestCases.style.display = (tabName === 'cases') ? 'flex' : 'none';
        if (dom.panelTestResults) dom.panelTestResults.style.display = (tabName === 'results') ? 'flex' : 'none';
        if (dom.panelDiagnostics) dom.panelDiagnostics.style.display = (tabName === 'diagnostics') ? 'flex' : 'none';
    }

    /**
     * Sets the verdict banner title, class, notice text, and honest preview badge.
     */
    function setVerdictBanner(type, title, notice, badge) {
        if (!dom.resultsVerdictBanner) return;

        dom.resultsVerdictBanner.className = `results-verdict-banner banner-${type}`;

        if (dom.verdictTitleText) dom.verdictTitleText.textContent = title;
        if (dom.verdictNoticeText) dom.verdictNoticeText.textContent = notice;
        if (dom.verdictBadgeHonest) dom.verdictBadgeHonest.textContent = badge || 'Preview Only';
    }

    /**
     * Resets or clears the Test Results and Diagnostics panels back to initial state.
     */
    function clearResults() {
        lastEvaluationResult = null;

        setVerdictBanner('info', 'Ready for Sample Preview', 'Click "Run Sample Tests" (Ctrl+Enter)', 'Preview Only');

        if (dom.btnClearResults) dom.btnClearResults.style.display = 'none';

        if (dom.resultsStatusBadge) {
            dom.resultsStatusBadge.textContent = 'Not Executed — Preview Only';
            dom.resultsStatusBadge.className = 'results-status-badge';
        }

        if (dom.resultsActualDisplay) {
            dom.resultsActualDisplay.textContent = 'Execution unavailable — frontend preview only.';
        }

        if (dom.diagnosticsTerminalBox) {
            dom.diagnosticsTerminalBox.textContent = 'No syntax or structural issues detected.\nClient-side structural checks assist with brace matching and class declarations before submission.';
        }

        if (dom.workspaceStatusText) {
            dom.workspaceStatusText.textContent = 'Ready · Preview Mode';
        }
    }

    /**
     * Marks preview results as stale when code has been modified after execution.
     */
    function markResultsStale() {
        if (!lastEvaluationResult) return;
        lastEvaluationResult = null;

        if (dom.verdictNoticeText) {
            dom.verdictNoticeText.textContent = 'Source modified · Click "Run Sample Tests" to re-check';
        }

        if (dom.workspaceStatusText) {
            dom.workspaceStatusText.textContent = 'Source Modified · Ready to Test';
        }
    }

    /**
     * Core Action: Run Sample Tests (Stage 3.4.4)
     * Performs client-side structural validation via compilerService.runCode.
     * Upholds critical execution honesty:
     * - Does NOT execute Java.
     * - Does NOT claim compilation.
     * - Does NOT claim test case pass/fail.
     * - Displays "Execution unavailable — frontend preview only." for actual output.
     */
    /**
     * Checks if the active user is a guest (unauthenticated).
     * In this frontend phase, real authentication connects in Phase 5.
     */
    function isGuestUser() {
        if (typeof window !== 'undefined' && window.__BYPASS_GUEST_GATE__) return false;
        try {
            const user = localStorage.getItem('codearena_auth_user') || sessionStorage.getItem('codearena_auth_user');
            if (user) {
                const parsed = JSON.parse(user);
                if (parsed && (parsed.token || parsed.isLoggedIn)) return false;
            }
        } catch (e) {}
        return true;
    }

    /**
     * Displays the authentication required gate prompt for practice tests/submissions.
     */
    function showGuestAuthPrompt(action) {
        if (!dom.guestAuthModalOverlay) return;
        if (dom.guestAuthModalDesc) {
            const verb = action === 'submit' ? 'submit practice solutions' : 'run sample tests';
            dom.guestAuthModalDesc.textContent = `Logging in is required to ${verb}. Sign in to your CodeArena account to execute Java code against practice test cases.`;
        }
        dom.guestAuthModalOverlay.style.display = 'flex';
        if (dom.btnGuestCancel) dom.btnGuestCancel.focus();
    }

    /**
     * Closes the guest authentication gate modal.
     */
    function hideGuestAuthPrompt() {
        if (dom.guestAuthModalOverlay) {
            dom.guestAuthModalOverlay.style.display = 'none';
        }
    }

    async function runSampleTests() {
        if (isEvaluating) return;

        // Guest Access Restriction: Require login to execute practice solutions
        if (isGuestUser()) {
            showGuestAuthPrompt('run');
            return;
        }

        if (!currentProblem) {
            showToast('Please select a valid problem first', 'warning');
            return;
        }

        const sourceCode = getCode();

        // 1. Activate loading state & switch to Test Results tab
        isEvaluating = true;
        if (dom.btnRunSampleTests) dom.btnRunSampleTests.disabled = true;
        if (dom.btnSubmitSolution) dom.btnSubmitSolution.disabled = true;

        if (dom.btnRunSampleTests) {
            dom.btnRunSampleTests.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="spin-icon" aria-hidden="true" style="animation: spin 1s linear infinite;">
                    <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                    <path d="M12 2a10 10 0 0 1 10 10"></path>
                </svg>
                <span>Validating...</span>
            `;
        }

        if (dom.workspaceStatusText) {
            dom.workspaceStatusText.textContent = 'Validating Java Structure...';
        }

        switchConsoleTab('results');
        setVerdictBanner('info', 'Validating Java Structure...', 'Analyzing curly braces and class declarations...', 'Validating');

        // 2. Handle Empty Source Code
        if (!sourceCode || !sourceCode.trim()) {
            await new Promise(r => setTimeout(r, 260));

            setVerdictBanner('error', 'Empty Source Code', 'Source code cannot be empty · Please write Java code', 'Empty Source');

            if (dom.resultsStatusBadge) {
                dom.resultsStatusBadge.textContent = 'Empty Source — Cannot Execute';
                dom.resultsStatusBadge.className = 'results-status-badge status-issue';
            }

            if (dom.resultsActualDisplay) {
                dom.resultsActualDisplay.textContent = 'Execution unavailable — source code is empty.';
            }

            if (dom.diagnosticsTerminalBox) {
                dom.diagnosticsTerminalBox.textContent = '[Client-Side Structural Check: Empty Source]\nError: Source code cannot be empty.\nPlease provide a Java class declaration (e.g. class Solution) to validate structure.';
            }

            if (dom.workspaceStatusText) {
                dom.workspaceStatusText.textContent = 'Empty Source · Preview Mode';
            }

            if (dom.btnClearResults) dom.btnClearResults.style.display = 'inline-block';

            showToast('Source code cannot be empty', 'warning');
            finishEvaluating();
            return;
        }

        // 3. Run Structural Diagnostics via compilerService.runCode
        try {
            if (!window.CodeArenaAPI || !window.CodeArenaAPI.compilerService) {
                throw new Error('compilerService not available');
            }

            const res = await window.CodeArenaAPI.compilerService.runCode({
                sourceCode: sourceCode,
                language: 'java'
            });

            const data = (res && res.data) ? res.data : null;

            if (data && (data.status === 'COMPILE_ERROR' || (data.compileErrors && data.compileErrors.length > 0))) {
                // Structural issue detected (unmatched curly braces or missing class)
                const errorMsg = (data.compileErrors && data.compileErrors.length > 0)
                    ? data.compileErrors[0].message
                    : (data.stderr || 'Structural notice detected.');

                const lineNum = (data.compileErrors && data.compileErrors.length > 0) ? data.compileErrors[0].line : 1;
                const colNum = (data.compileErrors && data.compileErrors.length > 0) ? data.compileErrors[0].column : 1;

                setVerdictBanner('error', 'Structural Issue Detected', 'Client-side check: check curly braces or class declaration', 'Issue Detected');

                if (dom.resultsStatusBadge) {
                    dom.resultsStatusBadge.textContent = 'Structural Issue Detected — Preview Only';
                    dom.resultsStatusBadge.className = 'results-status-badge status-issue';
                }

                if (dom.resultsActualDisplay) {
                    dom.resultsActualDisplay.textContent = 'Execution unavailable — frontend preview only.';
                }

                if (dom.diagnosticsTerminalBox) {
                    dom.diagnosticsTerminalBox.textContent = `[Client-Side Structural Check: Issue Detected]\n${data.stderr || 'Syntax or structure error detected.'}\n\nLine ${lineNum}, Col ${colNum}: ${errorMsg}\n\nNote: Client-side structural checks assist with brace matching and class declarations before submission. Real remote Java compilation requires Phase 4 backend integration.`;
                }

                if (dom.workspaceStatusText) {
                    dom.workspaceStatusText.textContent = 'Structural Issue Detected · Preview Mode';
                }

                if (dom.btnClearResults) dom.btnClearResults.style.display = 'inline-block';

                lastEvaluationResult = { status: 'issue', details: data };
                showToast('Structural notice: please check braces or class declaration', 'error');

            } else {
                // Structural checks passed!
                setVerdictBanner('success', 'Structural Check Passed', 'Code structure is valid · Java execution engine connects in Phase 4', 'Preview Only');

                if (dom.resultsStatusBadge) {
                    dom.resultsStatusBadge.textContent = 'Not Executed — Preview Only';
                    dom.resultsStatusBadge.className = 'results-status-badge status-passed';
                }

                if (dom.resultsActualDisplay) {
                    dom.resultsActualDisplay.textContent = 'Execution unavailable — frontend preview only.';
                }

                if (dom.diagnosticsTerminalBox) {
                    dom.diagnosticsTerminalBox.textContent = `[Client-Side Structural Check: Passed]\nNo syntax or structural issues detected in editor source.\n• Class declaration verified (class Solution)\n• Curly braces balanced ({ ... })\n• Syntax mode: Java (OpenJDK 17)\n\nPreview Notice: Client-side structural checks assist with brace matching and class declarations before submission. Arbitrary Java compilation, System.in streaming, and test-case execution connect in Phase 4.`;
                }

                if (dom.workspaceStatusText) {
                    dom.workspaceStatusText.textContent = 'Structural Check Passed · Preview Only';
                }

                if (dom.btnClearResults) dom.btnClearResults.style.display = 'inline-block';

                lastEvaluationResult = { status: 'passed', details: data };
                showToast('Structural check passed (Preview Only)', 'success');
            }

        } catch (err) {
            console.error('[CodeArena Workspace] Structural validation failed:', err);
            setVerdictBanner('warning', 'Validation Offline', 'Could not run client-side structural validation', 'Offline');
            if (dom.workspaceStatusText) {
                dom.workspaceStatusText.textContent = 'Ready · Preview Mode';
            }
        } finally {
            finishEvaluating();
        }
    }

    /**
     * Restores action buttons and clears evaluating state.
     */
    function finishEvaluating() {
        if (dom.btnRunSampleTests) {
            dom.btnRunSampleTests.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <span>Run Sample Tests</span>
                <kbd class="key-badge">Ctrl+Enter</kbd>
            `;
            dom.btnRunSampleTests.disabled = false;
        }

        if (dom.btnSubmitSolution) {
            dom.btnSubmitSolution.disabled = false;
        }

        isEvaluating = false;
    }

    /**
     * Loads session-scoped submission history for the problem.
     */
    async function loadSubmissions(problemId) {
        if (!problemId) return;

        if (!window.CodeArenaAPI || !window.CodeArenaAPI.submissionService || typeof window.CodeArenaAPI.submissionService.getSubmissions !== 'function') {
            return;
        }

        try {
            const res = await window.CodeArenaAPI.submissionService.getSubmissions(problemId);
            if (res && res.success && res.data && Array.isArray(res.data.submissions)) {
                renderSubmissionsList(res.data.submissions);
            }
        } catch (err) {
            console.warn('[CodeArena Workspace] Failed to load session submissions:', err);
        }
    }

    /**
     * Renders the list of guest session submissions into the submissions panel.
     */
    function renderSubmissionsList(submissions) {
        if (dom.submissionsTabTag) {
            dom.submissionsTabTag.textContent = (submissions && submissions.length > 0)
                ? `Preview (${submissions.length})`
                : 'Preview';
        }

        if (!dom.submissionsListContainer) return;

        if (!submissions || submissions.length === 0) {
            dom.submissionsListContainer.innerHTML = `
                <div class="submissions-empty-state">
                    <div class="submissions-empty-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </div>
                    <p class="submissions-empty-title">No submissions yet for this problem</p>
                    <p class="submissions-empty-desc">Click &quot;Submit Solution&quot; to demonstrate simulated guest submission evaluation.</p>
                </div>
            `;
            return;
        }

        dom.submissionsListContainer.innerHTML = '';
        submissions.forEach(function (sub) {
            const card = document.createElement('div');
            card.className = 'submission-card-item';
            const timeStr = formatSubmissionTime(sub.submittedAt);
            const passedCases = sub.sampleTestCasesPassed || 0;
            const totalCases = sub.totalSampleTestCases || 0;

            card.innerHTML = `
                <div class="submission-card-header">
                    <div class="submission-verdict-tag verdict-preview-passed">
                        <span class="status-dot"></span>
                        <span>PREVIEW PASSED</span>
                    </div>
                    <span class="submission-time-label">${escapeHtml(timeStr)}</span>
                </div>
                <div class="submission-card-meta">
                    <span class="submission-meta-badge">Target: Java (OpenJDK 17)</span>
                    <span class="submission-meta-badge">Sample Cases: ${passedCases}/${totalCases} Preview</span>
                    <span class="submission-meta-pill session-pill">Temporary Session Record</span>
                </div>
                <div class="submission-card-notice">
                    <strong>Frontend Demonstration:</strong> Public sample cases demonstrated. Hidden backend test suite evaluation and persistent account history connect in Phase 4.
                </div>
            `;
            dom.submissionsListContainer.appendChild(card);
        });
    }

    /**
     * Formats submission ISO timestamp into user-friendly time string.
     */
    function formatSubmissionTime(iso) {
        if (!iso) return 'Just now';
        try {
            const d = new Date(iso);
            if (isNaN(d.getTime())) return 'Just now';
            const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
            if (diffSec < 45) return 'Just now';
            if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return 'Just now';
        }
    }

    /**
     * Handles Submit Solution action (Stage 3.4.5)
     * Calls window.CodeArenaAPI.submissionService.submitSolution({ problemId, sourceCode, language }).
     * Stores temporary session submission record and updates the Submissions preview list.
     * Preserves PREVIEW_PASSED semantics without claiming ACCEPTED or actual backend judging.
     */
    async function handleSubmitSolution() {
        if (isEvaluating) return;

        // Guest Access Restriction: Require login to submit practice solutions
        if (isGuestUser()) {
            showGuestAuthPrompt('submit');
            return;
        }

        if (!currentProblem) {
            showToast('Please select a valid problem first', 'warning');
            return;
        }

        const sourceCode = getCode();
        if (!sourceCode || !sourceCode.trim()) {
            showToast('Cannot submit empty source code', 'warning');
            return;
        }

        isEvaluating = true;
        if (dom.btnSubmitSolution) {
            dom.btnSubmitSolution.disabled = true;
            dom.btnSubmitSolution.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="spin-icon" aria-hidden="true" style="animation: spin 1s linear infinite;">
                    <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                    <path d="M12 2a10 10 0 0 1 10 10"></path>
                </svg>
                <span>Submitting...</span>
            `;
        }
        if (dom.btnRunSampleTests) dom.btnRunSampleTests.disabled = true;

        if (dom.workspaceStatusText) {
            dom.workspaceStatusText.textContent = 'Submitting Preview...';
        }

        try {
            if (!window.CodeArenaAPI || !window.CodeArenaAPI.submissionService) {
                throw new Error('submissionService not available');
            }

            await window.CodeArenaAPI.submissionService.submitSolution({
                problemId: currentProblem.id,
                sourceCode: sourceCode,
                language: 'java'
            });

            // Switch to Submissions tab in left panel to display updated record
            if (dom.tabBtnSubmissions && dom.tabBtnDescription) {
                dom.tabBtnSubmissions.classList.add('active');
                dom.tabBtnDescription.classList.remove('active');
                if (dom.descriptionScrollContainer) dom.descriptionScrollContainer.style.display = 'none';
                if (dom.submissionsScrollView) dom.submissionsScrollView.style.display = 'flex';
            }

            await loadSubmissions(currentProblem.id);

            if (dom.workspaceStatusText) {
                dom.workspaceStatusText.textContent = 'Preview Submission Recorded · Session Scope';
            }

            showToast('Solution submitted (Session Preview Recorded)', 'success');

        } catch (err) {
            console.error('[CodeArena Workspace] Submission failed:', err);
            showToast('Submission error — please retry', 'error');
        } finally {
            if (dom.btnSubmitSolution) {
                dom.btnSubmitSolution.innerHTML = `
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Submit Solution</span>
                `;
                dom.btnSubmitSolution.disabled = false;
            }
            if (dom.btnRunSampleTests) dom.btnRunSampleTests.disabled = false;
            isEvaluating = false;
        }
    }

    /**
     * Copies active editor code with modern clipboard API and fallback.
     */
    function copyCodeToClipboard() {
        const code = getCode();
        if (!code) {
            showToast('No code to copy', 'warning');
            return;
        }

        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            navigator.clipboard.writeText(code).then(function () {
                showToast('Solution code copied to clipboard', 'success');
            }).catch(function () {
                fallbackCopy(code);
            });
        } else {
            fallbackCopy(code);
        }
    }

    /**
     * Temporary textarea fallback for copying text.
     */
    function fallbackCopy(text) {
        try {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showToast('Solution code copied to clipboard', 'success');
        } catch (err) {
            console.error('[CodeArena Workspace] Copy failed:', err);
            showToast('Unable to copy code to clipboard', 'error');
        }
    }

    /**
     * Determines whether an unrelated form input or textarea is currently focused.
     */
    function isUnrelatedInputFocused() {
        const active = document.activeElement;
        if (!active) return false;
        const tag = active.tagName.toLowerCase();
        if (tag === 'input' || tag === 'select') return true;
        if (tag === 'textarea' && !active.classList.contains('code-fallback-editor') && !active.closest('.CodeMirror')) {
            return true;
        }
        return false;
    }

    /**
     * Global keydown handler enforcing shortcuts rules.
     */
    function handleGlobalKeydown(e) {
        // Esc closes open modals
        if (e.key === 'Escape') {
            if (dom.guestAuthModalOverlay && dom.guestAuthModalOverlay.style.display === 'flex') {
                hideGuestAuthPrompt();
                return;
            }
            if (dom.resetModalOverlay && dom.resetModalOverlay.classList.contains('active')) {
                dom.resetModalOverlay.classList.remove('active');
                return;
            }
            if (dom.shortcutsModalOverlay && dom.shortcutsModalOverlay.classList.contains('active')) {
                dom.shortcutsModalOverlay.classList.remove('active');
                return;
            }
        }

        // Ctrl+Enter or Cmd+Enter: Run Sample Tests
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            if (!isUnrelatedInputFocused() && currentProblem && !isEvaluating) {
                e.preventDefault();
                runSampleTests();
            }
        }
    }

    /**
     * Shows a brief notification toast.
     */
    function showToast(message, type) {
        if (!dom.workspaceToast) return;
        type = type || 'info';

        clearTimeout(toastTimer);
        dom.workspaceToast.textContent = message;
        dom.workspaceToast.className = `compiler-toast toast-${type} show`;

        toastTimer = setTimeout(function () {
            if (dom.workspaceToast) {
                dom.workspaceToast.classList.remove('show');
            }
        }, 3400);
    }

    /**
     * Safely escapes HTML special characters.
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

    // Alias for backwards-compatibility with Stage 3.4.3 inspection tests
    const runSampleTestsPreview = runSampleTests;

    // Expose workspace state for inspection & automated regression verification
    window.CodeArenaWorkspace = {
        getLoadedProblem: () => currentProblem,
        getCode: getCode,
        setCode: setCode,
        isCodeMirrorActive: () => (codeEditor !== null && !isFallback),
        getActiveCaseIndex: () => activeCaseIndex,
        selectTestCase: selectTestCase,
        switchConsoleTab: switchConsoleTab,
        runSampleTests: runSampleTests,
        runSampleTestsPreview: runSampleTests,
        clearResults: clearResults,
        handleSubmitSolution: handleSubmitSolution,
        loadSubmissions: loadSubmissions,
        getLastEvaluationResult: () => lastEvaluationResult,
        isEvaluating: () => isEvaluating,
        getCurrentTheme: getCurrentThemeName,
        isGuestUser: isGuestUser,
        showGuestAuthPrompt: showGuestAuthPrompt,
        hideGuestAuthPrompt: hideGuestAuthPrompt,
        renderNotFound: renderNotFound,
        getLayoutState: () => Object.assign({}, currentLayout),
        setLayoutState: (s) => {
            const val = validateLayoutSettings(s);
            if (val) {
                currentLayout = val;
                applyLayoutSettings(currentLayout, true);
                saveLayoutState();
            }
        },
        resetLayout: resetLayoutToDefault,
        reorderConsoleTabs: (order) => {
            const val = validateLayoutSettings({ ...currentLayout, tabOrder: order });
            if (val) {
                currentLayout.tabOrder = val.tabOrder;
                applyLayoutSettings(currentLayout, true);
                saveLayoutState();
            }
        },
        validateLayoutSettings: validateLayoutSettings,
        getStarterCode: (prob, withRet) => getStarterCode(prob, withRet),
        isVoidProblem: (prob) => isVoidProblem(prob),
        isCodeModified: () => isCodeModified(currentProblem),
        getReturnPreference: () => includeDefaultReturn,
        setReturnPreference: (val) => handleReturnToggleChange(val)
    };


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

})();
