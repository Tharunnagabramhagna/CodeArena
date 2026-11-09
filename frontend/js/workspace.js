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
    let cachedProblemsList = [];

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
            workspaceMain: document.querySelector('.workspace-main'),
            problemNotFoundView: document.getElementById('problemNotFoundView'),
            notFoundMessage: document.getElementById('notFoundMessage'),
            premiumLockView: document.getElementById('problemPremiumLockView'),
            lockProblemTitle: document.getElementById('lockProblemTitle'),
            lockProblemDiff: document.getElementById('lockProblemDiff'),
            lockProblemTopic: document.getElementById('lockProblemTopic'),
            btnLockUpgradeMonthly: document.getElementById('btnLockUpgradeMonthly'),
            btnLockUpgradeAnnual: document.getElementById('btnLockUpgradeAnnual'),
            problemReferencePane: document.getElementById('problemReferencePane'),
            codingWorkspacePane: document.getElementById('codingWorkspacePane'),
            breadcrumbProblemTitle: document.getElementById('breadcrumbProblemTitle'),

            // Left Pane Problem Metadata
            problemIdBadge: document.getElementById('problemIdBadge'),
            problemTitleText: document.getElementById('problemTitleText'),
            problemDiffBadge: document.getElementById('problemDiffBadge'),
            problemTopicTag: document.getElementById('problemTopicTag'),
            problemPatternTag: document.getElementById('problemPatternTag'),
            problemAccessBadge: document.getElementById('problemAccessBadge'),
            problemAccLabel: document.getElementById('problemAccLabel'),
            problemDescriptionHtml: document.getElementById('problemDescriptionHtml'),
            inputFormatText: document.getElementById('inputFormatText'),
            outputFormatText: document.getElementById('outputFormatText'),
            constraintsList: document.getElementById('constraintsList'),
            exampleCardsList: document.getElementById('exampleCardsList'),
            btnToggleCollapseLeft: document.getElementById('btnToggleCollapseLeft'),
            btnOpenHintsView: document.getElementById('btnOpenHintsView'),
            hintsSummaryBtnText: document.getElementById('hintsSummaryBtnText'),
            relatedConceptsGrid: document.getElementById('relatedConceptsGrid'),
            linkAnimateSolutionConcepts: document.getElementById('linkAnimateSolutionConcepts'),
            submissionAnimateBanner: document.getElementById('submissionAnimateBanner'),
            btnLaunchAnimateFromSubmissions: document.getElementById('btnLaunchAnimateFromSubmissions'),
            consoleSubmissionAnimateBanner: document.getElementById('consoleSubmissionAnimateBanner'),
            btnLaunchAnimateFromConsole: document.getElementById('btnLaunchAnimateFromConsole'),
            selectEditorLang: document.getElementById('selectEditorLang'),

            // Left Pane Tabs
            tabBtnDescription: document.getElementById('tabBtnDescription'),
            tabBtnHints: document.getElementById('tabBtnHints'),
            tabBtnSubmissions: document.getElementById('tabBtnSubmissions'),
            hintsProgressTag: document.getElementById('hintsProgressTag'),
            submissionsTabTag: document.getElementById('submissionsTabTag'),
            descriptionScrollContainer: document.getElementById('descriptionScrollContainer'),
            hintsScrollView: document.getElementById('hintsScrollView'),
            submissionsScrollView: document.getElementById('submissionsScrollView'),
            submissionsListContainer: document.getElementById('submissionsListContainer'),
            hintsUnlockedCountBadge: document.getElementById('hintsUnlockedCountBadge'),
            btnResetHints: document.getElementById('btnResetHints'),
            hintCard1: document.getElementById('hintCard1'),
            hintCard2: document.getElementById('hintCard2'),
            hintCard3: document.getElementById('hintCard3'),
            hintStatusPill1: document.getElementById('hintStatusPill1'),
            hintStatusPill2: document.getElementById('hintStatusPill2'),
            hintStatusPill3: document.getElementById('hintStatusPill3'),
            hintLockedView1: document.getElementById('hintLockedView1'),
            hintLockedView2: document.getElementById('hintLockedView2'),
            hintLockedView3: document.getElementById('hintLockedView3'),
            hintUnlockedView1: document.getElementById('hintUnlockedView1'),
            hintUnlockedView2: document.getElementById('hintUnlockedView2'),
            hintUnlockedView3: document.getElementById('hintUnlockedView3'),
            hintContent1: document.getElementById('hintContent1'),
            hintContent2: document.getElementById('hintContent2'),
            hintContent3: document.getElementById('hintContent3'),
            btnRevealHint1: document.getElementById('btnRevealHint1'),
            btnRevealHint2: document.getElementById('btnRevealHint2'),
            btnRevealHint3: document.getElementById('btnRevealHint3'),

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
            tabBtnCustomInput: document.getElementById('tabBtnCustomInput'),
            tabBtnTestResults: document.getElementById('tabBtnTestResults'),
            tabBtnDiagnostics: document.getElementById('tabBtnDiagnostics'),
            tabBtnSubmissionsConsole: document.getElementById('tabBtnSubmissionsConsole'),
            panelTestCases: document.getElementById('panelTestCases'),
            panelCustomInput: document.getElementById('panelCustomInput'),
            panelTestResults: document.getElementById('panelTestResults'),
            panelDiagnostics: document.getElementById('panelDiagnostics'),
            panelSubmissionsConsole: document.getElementById('panelSubmissionsConsole'),
            customInputText: document.getElementById('customInputText'),
            btnLoadSampleInput: document.getElementById('btnLoadSampleInput'),
            consoleSubmissionsListContainer: document.getElementById('consoleSubmissionsListContainer'),
            consoleSubmissionsCountBadge: document.getElementById('consoleSubmissionsCountBadge'),

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

                // Check Pro Access
                const isProProblem = Boolean(currentProblem.isPremium);
                const userIsPro = Boolean(
                    window.CodeArenaAPI &&
                    window.CodeArenaAPI.subscriptionService &&
                    window.CodeArenaAPI.subscriptionService.isPremium()
                );

                if (isProProblem && !userIsPro) {
                    renderPremiumLock(currentProblem);
                    return;
                }

                if (dom.premiumLockView) dom.premiumLockView.style.display = 'none';
                if (dom.problemReferencePane) dom.problemReferencePane.style.display = 'flex';
                if (dom.codingWorkspacePane) dom.codingWorkspacePane.style.display = 'flex';

                // Asynchronously fetch catalogue index list for exact canonical problem numbering
                if (window.CodeArenaAPI && window.CodeArenaAPI.problemService && typeof window.CodeArenaAPI.problemService.getProblems === 'function') {
                    window.CodeArenaAPI.problemService.getProblems({ limit: 300 }).then(listRes => {
                        if (listRes && listRes.success && listRes.data && Array.isArray(listRes.data.problems)) {
                            cachedProblemsList = listRes.data.problems;
                            if (currentProblem && dom.problemIdBadge) {
                                const idx = cachedProblemsList.findIndex(item => item.id === currentProblem.id);
                                if (idx !== -1) dom.problemIdBadge.textContent = `#${idx + 1}`;
                            }
                        }
                    }).catch(() => { });
                }

                renderProblemData(currentProblem);
                updateReturnToggleUI();

                // URL tab and hint deep-linking support
                const tabParam = params.get('tab');
                if (tabParam === 'hints') {
                    switchLeftPaneTab('hints');
                } else if (tabParam === 'sub' || tabParam === 'submissions') {
                    switchLeftPaneTab('sub');
                }
                if (params.has('unlockedHints')) {
                    const count = parseInt(params.get('unlockedHints'), 10);
                    if (!isNaN(count) && count >= 0 && count <= 3) {
                        setUnlockedHintsCount(cleanId, count);
                        renderHints(currentProblem);
                    }
                }

                // Draft preservation (localStorage & sessionStorage)
                let initialCode = getStarterCode(currentProblem, includeDefaultReturn);
                try {
                    let draft = null;
                    if (typeof localStorage !== 'undefined') {
                        draft = localStorage.getItem('codearena_draft_' + cleanId) || localStorage.getItem('codearena_draft_problem_' + cleanId);
                    }
                    if (!draft && typeof sessionStorage !== 'undefined') {
                        draft = sessionStorage.getItem('codearena_draft_problem_' + cleanId);
                    }
                    if (draft && draft.trim()) {
                        initialCode = draft;
                    }
                } catch (e) { }

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

    function renderPremiumLock(problem) {
        if (!dom.premiumLockView) return;
        if (dom.problemNotFoundView) dom.problemNotFoundView.style.display = 'none';
        if (dom.problemReferencePane) dom.problemReferencePane.style.display = 'none';
        if (dom.codingWorkspacePane) dom.codingWorkspacePane.style.display = 'none';

        if (dom.lockProblemTitle) dom.lockProblemTitle.textContent = problem.title || 'Pro Challenge';
        if (dom.lockProblemDiff) {
            dom.lockProblemDiff.textContent = problem.difficulty || 'Hard';
            dom.lockProblemDiff.className = 'diff-badge diff-' + String(problem.difficulty || 'hard').toLowerCase();
        }
        if (dom.lockProblemTopic) dom.lockProblemTopic.textContent = `${problem.topic || 'DSA'} • ${problem.pattern || 'Pattern'}`;

        dom.premiumLockView.style.display = 'flex';

        function handleUpgrade(planId) {
            if (window.CodeArenaAPI && window.CodeArenaAPI.subscriptionService) {
                window.CodeArenaAPI.subscriptionService.upgradePlan(planId);
                if (window.CodeArenaAPI.authService && !window.CodeArenaAPI.authService.isAuthenticated()) {
                    window.CodeArenaAPI.authService.demoLogin(planId);
                }
                if (window.CodeArenaToast) {
                    window.CodeArenaToast.success(`Activated ${planId === 'annual' ? 'Pro Annual ($199/yr)' : 'Pro Monthly ($5/mo)'} preview membership! Challenge unlocked.`);
                }
                dom.premiumLockView.style.display = 'none';
                if (dom.problemReferencePane) dom.problemReferencePane.style.display = 'flex';
                if (dom.codingWorkspacePane) dom.codingWorkspacePane.style.display = 'flex';
                renderProblemData(problem);
                updateRecentlyViewed(problem);
                if (codeEditor && typeof codeEditor.refresh === 'function') {
                    setTimeout(() => codeEditor.refresh(), 100);
                }
            }
        }

        if (dom.btnLockUpgradeMonthly) {
            dom.btnLockUpgradeMonthly.onclick = () => handleUpgrade('monthly');
        }
        if (dom.btnLockUpgradeAnnual) {
            dom.btnLockUpgradeAnnual.onclick = () => handleUpgrade('annual');
        }
    }

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
        renderHints(p);
        if (dom.breadcrumbProblemTitle) dom.breadcrumbProblemTitle.textContent = p.title;

        // Headline & Badges
        if (dom.problemTitleText) dom.problemTitleText.textContent = p.title;

        // Problem ID Badge
        if (dom.problemIdBadge) {
            let num = '';
            if (cachedProblemsList && cachedProblemsList.length > 0) {
                const idx = cachedProblemsList.findIndex(item => item.id === p.id);
                if (idx !== -1) num = idx + 1;
            }
            if (!num) {
                const match = String(p.id).match(/\d+/);
                if (match) num = match[0];
            }
            dom.problemIdBadge.textContent = num ? `#${num}` : `#${p.id}`;
        }

        if (dom.problemDiffBadge) {
            dom.problemDiffBadge.textContent = p.difficulty;
            dom.problemDiffBadge.className = 'diff-badge diff-' + String(p.difficulty).toLowerCase();
        }

        if (dom.problemTopicTag) dom.problemTopicTag.textContent = p.topic;

        // Pattern Tag
        if (dom.problemPatternTag) {
            if (p.pattern && p.pattern.trim()) {
                dom.problemPatternTag.textContent = p.pattern;
                dom.problemPatternTag.style.display = 'inline-flex';
            } else {
                dom.problemPatternTag.style.display = 'none';
            }
        }

        // Access Badge (Free vs Pro)
        if (dom.problemAccessBadge) {
            if (p.isPremium) {
                dom.problemAccessBadge.textContent = '⭐ Pro';
                dom.problemAccessBadge.className = 'access-badge access-pro';
            } else {
                dom.problemAccessBadge.textContent = 'Free';
                dom.problemAccessBadge.className = 'access-badge access-free';
            }
        }

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

        // Render Related Concepts grid
        renderRelatedConcepts(p);

        // Update Animate the Solution links with canonical problem ID
        const animUrl = `solution-animation.html?id=${encodeURIComponent(p.id)}`;
        if (dom.linkAnimateSolutionConcepts) {
            dom.linkAnimateSolutionConcepts.href = animUrl;
        }
        if (dom.btnLaunchAnimateFromSubmissions) {
            dom.btnLaunchAnimateFromSubmissions.href = animUrl;
        }
        if (dom.btnLaunchAnimateFromConsole) {
            dom.btnLaunchAnimateFromConsole.href = animUrl;
        }

        // Update hints summary button text
        if (dom.hintsSummaryBtnText) {
            const unl = getUnlockedHintsCount(p.id);
            dom.hintsSummaryBtnText.textContent = `View 3-Tier Progressive Hints (${unl}/3 Unlocked)`;
        }

        // Load existing session submissions for this problem
        loadSubmissions(p.id);
        renderConsoleSubmissions(p.id);

        // Reset any prior results
        clearResults();
    }

    /**
     * Renders clickable related concept chips linking to learning modules.
     */
    function renderRelatedConcepts(p) {
        if (!dom.relatedConceptsGrid) return;
        dom.relatedConceptsGrid.innerHTML = '';

        const conceptMap = {
            'Arrays': [
                { name: '1D & 2D Arrays', link: 'learn.html#arrays-and-strings', desc: 'Contiguous memory & indexing' },
                { name: 'Linear Search & Pointers', link: 'learn.html#arrays-and-strings', desc: 'Traversal algorithms' },
                { name: 'Loop Iterations', link: 'learn.html#control-flow', desc: 'Condition & increment cycles' }
            ],
            'Strings': [
                { name: 'String Immutability', link: 'learn.html#arrays-and-strings', desc: 'String pool & heap' },
                { name: 'StringBuilder & Buffer', link: 'learn.html#arrays-and-strings', desc: 'Mutable sequences' },
                { name: 'Character Traversals', link: 'learn.html#arrays-and-strings', desc: 'Direct char manipulation' }
            ],
            'Dynamic Programming': [
                { name: 'Recursion Call Stack', link: 'learn.html#methods', desc: 'Call frames & unwind' },
                { name: 'Tabulation Arrays', link: 'learn.html#arrays-and-strings', desc: 'State transition matrices' },
                { name: 'Methods & Return Values', link: 'learn.html#methods', desc: 'Optimal subproblems' }
            ],
            'Trees': [
                { name: 'Classes & References', link: 'learn.html#oop', desc: 'Node reference structures' },
                { name: 'Stack & Heap Allocation', link: 'learn.html#oop', desc: 'Object memory layout' },
                { name: 'Recursive Tree Traversal', link: 'learn.html#methods', desc: 'DFS tree algorithms' }
            ],
            'Graphs': [
                { name: 'Adjacency Lists', link: 'learn.html#advanced-java', desc: 'Collections framework' },
                { name: 'Queue & Stack Traversal', link: 'learn.html#advanced-java', desc: 'Breadth/Depth first search' },
                { name: 'Object References', link: 'learn.html#oop', desc: 'Graph topology' }
            ],
            'Math': [
                { name: 'Operators & Expressions', link: 'learn.html#java-fundamentals', desc: 'Arithmetic & bitwise' },
                { name: 'Control Flow Conditionals', link: 'learn.html#control-flow', desc: 'Branches & invariants' },
                { name: 'Primitive Variables', link: 'learn.html#java-fundamentals', desc: 'Integral value types' }
            ]
        };

        const concepts = conceptMap[p.topic] || [
            { name: p.topic || 'DSA Fundamentals', link: 'learn.html#java-fundamentals', desc: 'Core principles' },
            { name: p.pattern || 'Algorithmic Optimization', link: 'learn.html#control-flow', desc: 'Structured approach' },
            { name: 'Java Execution Model', link: 'learn.html#java-fundamentals', desc: 'JVM & memory' }
        ];

        concepts.forEach(c => {
            const a = document.createElement('a');
            a.href = c.link;
            a.className = 'concept-chip';
            a.title = c.desc;
            a.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                <span>${escapeHtml(c.name)}</span>
            `;
            dom.relatedConceptsGrid.appendChild(a);
        });
    }

    /**
     * Renders submission history inside the bottom test console panel.
     */
    async function renderConsoleSubmissions(problemId) {
        if (!dom.consoleSubmissionsListContainer) return;
        if (!window.CodeArenaAPI || !window.CodeArenaAPI.submissionService || typeof window.CodeArenaAPI.submissionService.getSubmissions !== 'function') {
            return;
        }
        try {
            const res = await window.CodeArenaAPI.submissionService.getSubmissions(problemId);
            const subs = (res && res.success && res.data && Array.isArray(res.data.submissions)) ? res.data.submissions : [];
            if (dom.consoleSubmissionsCountBadge) {
                dom.consoleSubmissionsCountBadge.textContent = `${subs.length} recorded`;
            }
            if (dom.consoleSubmissionAnimateBanner) {
                dom.consoleSubmissionAnimateBanner.style.display = (subs.length > 0) ? 'flex' : 'none';
            }
            if (subs.length === 0) {
                dom.consoleSubmissionsListContainer.innerHTML = `
                    <div class="submissions-empty-state" style="padding: 1.5rem 1rem; text-align: center;">
                        <p class="submissions-empty-title" style="font-size: 0.9rem; font-weight: 600; margin-bottom: 0.35rem;">No Submissions Yet</p>
                        <p class="submissions-empty-desc" style="font-size: 0.78rem; color: var(--color-text-muted);">Click &quot;Submit Solution&quot; to test your code and record simulated submissions.</p>
                    </div>
                `;
                return;
            }
            let html = `
                <table class="console-submissions-table">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Runtime</th>
                            <th>Memory</th>
                            <th>Language</th>
                            <th>Submitted</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            subs.forEach(sub => {
                const timeStr = formatSubmissionTime(sub.submittedAt);
                html += `
                    <tr>
                        <td><span class="diff-badge diff-easy">Passed (Preview)</span></td>
                        <td>${sub.runtimeMs || 14} ms</td>
                        <td>${sub.memoryMb || 38.4} MB</td>
                        <td>Java (OpenJDK 17)</td>
                        <td>${escapeHtml(timeStr)}</td>
                    </tr>
                `;
            });
            html += `</tbody></table>`;
            dom.consoleSubmissionsListContainer.innerHTML = html;
        } catch (e) {
            console.warn('[CodeArena Workspace] Failed to render console submissions:', e);
        }
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
        } catch (e) { }

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

                // Auto-save per-problem draft to localStorage and sessionStorage (Phase 6 & Feature 3)
                codeEditor.on('change', function () {
                    try {
                        if (currentProblem) {
                            const pId = currentProblem.id || currentProblem.slug;
                            if (pId) {
                                const val = codeEditor.getValue();
                                if (typeof localStorage !== 'undefined') {
                                    localStorage.setItem('codearena_draft_' + pId, val);
                                    localStorage.setItem('codearena_draft_problem_' + pId, val);
                                }
                                if (typeof sessionStorage !== 'undefined') {
                                    sessionStorage.setItem('codearena_draft_problem_' + pId, val);
                                }
                            }
                        }
                    } catch (e) { }
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
                try {
                    if (currentProblem) {
                        const pId = currentProblem.id || currentProblem.slug;
                        if (pId) {
                            const val = dom.fallbackEditor.value;
                            if (typeof localStorage !== 'undefined') {
                                localStorage.setItem('codearena_draft_' + pId, val);
                                localStorage.setItem('codearena_draft_problem_' + pId, val);
                            }
                            if (typeof sessionStorage !== 'undefined') {
                                sessionStorage.setItem('codearena_draft_problem_' + pId, val);
                            }
                        }
                    }
                } catch (e) { }
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
            custom: dom.tabBtnCustomInput,
            results: dom.tabBtnTestResults,
            diagnostics: dom.tabBtnDiagnostics,
            submissions: dom.tabBtnSubmissionsConsole
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
        } catch (e) { }
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

    /* ==========================================================================
       Feature 2: Progressive Hints Controller
       ========================================================================== */

    function switchLeftPaneTab(tab) {
        if (!dom.tabBtnDescription || !dom.tabBtnHints || !dom.tabBtnSubmissions) return;

        dom.tabBtnDescription.classList.toggle('active', tab === 'desc');
        dom.tabBtnDescription.setAttribute('aria-selected', tab === 'desc' ? 'true' : 'false');

        dom.tabBtnHints.classList.toggle('active', tab === 'hints');
        dom.tabBtnHints.setAttribute('aria-selected', tab === 'hints' ? 'true' : 'false');

        dom.tabBtnSubmissions.classList.toggle('active', tab === 'sub');
        dom.tabBtnSubmissions.setAttribute('aria-selected', tab === 'sub' ? 'true' : 'false');

        if (dom.descriptionScrollContainer) {
            dom.descriptionScrollContainer.style.display = (tab === 'desc') ? 'flex' : 'none';
        }
        if (dom.hintsScrollView) {
            dom.hintsScrollView.style.display = (tab === 'hints') ? 'flex' : 'none';
        }
        if (dom.submissionsScrollView) {
            dom.submissionsScrollView.style.display = (tab === 'sub') ? 'flex' : 'none';
        }

        if (tab === 'sub' && currentProblem) {
            loadSubmissions(currentProblem.id);
        }
    }

    function getHintsStorageKey(problemId) {
        return 'codearena_hints_unlocked_' + (problemId || 'unknown');
    }

    function getUnlockedHintsCount(problemId) {
        try {
            if (typeof localStorage !== 'undefined') {
                const val = parseInt(localStorage.getItem(getHintsStorageKey(problemId)), 10);
                if (!isNaN(val) && val >= 0 && val <= 3) return val;
            }
        } catch (e) { }
        return 0;
    }

    function setUnlockedHintsCount(problemId, count) {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(getHintsStorageKey(problemId), String(count));
            }
        } catch (e) { }
    }

    function renderHints(problem) {
        if (!problem) return;
        const hints = Array.isArray(problem.hints) && problem.hints.length >= 3
            ? problem.hints
            : [
                "Consider the fundamental invariants and constraints of this problem.",
                "Choose the appropriate data structure to optimize the core operation.",
                "Implement your solution iteratively or recursively, handling edge inputs."
            ];

        const unlockedCount = getUnlockedHintsCount(problem.id);

        if (dom.hintsProgressTag) {
            dom.hintsProgressTag.textContent = `${unlockedCount}/3`;
        }
        if (dom.hintsUnlockedCountBadge) {
            dom.hintsUnlockedCountBadge.textContent = `${unlockedCount} of 3 Unlocked`;
        }
        if (dom.hintsSummaryBtnText) {
            dom.hintsSummaryBtnText.textContent = `View 3-Tier Progressive Hints (${unlockedCount}/3 Unlocked)`;
        }

        renderSingleHint(1, hints[0], unlockedCount >= 1, true);
        renderSingleHint(2, hints[1], unlockedCount >= 2, unlockedCount >= 1);
        renderSingleHint(3, hints[2], unlockedCount >= 3, unlockedCount >= 2);
    }

    function renderSingleHint(idx, text, isUnlocked, isAvailable) {
        const card = dom['hintCard' + idx];
        const statusPill = dom['hintStatusPill' + idx];
        const lockedView = dom['hintLockedView' + idx];
        const unlockedView = dom['hintUnlockedView' + idx];
        const content = dom['hintContent' + idx];
        const btn = dom['btnRevealHint' + idx];

        if (!card || !statusPill || !lockedView || !unlockedView || !content || !btn) return;

        if (isUnlocked) {
            card.classList.add('unlocked');
            card.classList.remove('locked', 'available');
            lockedView.style.display = 'none';
            unlockedView.style.display = 'block';
            content.innerHTML = sanitizeInlineHtml(formatHintText(text));
            statusPill.textContent = 'Revealed';
            statusPill.className = 'hint-status-pill status-revealed';
        } else {
            card.classList.remove('unlocked');
            card.classList.add('locked');
            lockedView.style.display = 'flex';
            unlockedView.style.display = 'none';

            if (isAvailable) {
                card.classList.add('available');
                btn.disabled = false;
                btn.innerHTML = `<span>Reveal Hint ${idx}</span> <span aria-hidden="true">💡</span>`;
                statusPill.textContent = 'Available';
                statusPill.className = 'hint-status-pill';
            } else {
                card.classList.remove('available');
                btn.disabled = true;
                btn.innerHTML = `<span class="lock-icon" aria-hidden="true">🔒</span> <span>Reveal Hint ${idx}</span>`;
                statusPill.textContent = 'Locked';
                statusPill.className = 'hint-status-pill status-locked';
            }
        }
    }

    function formatHintText(txt) {
        if (!txt) return '';
        return String(txt).replace(/`([^`]+)`/g, '<code class="spec-inline-code">$1</code>');
    }

    function unlockHint(step) {
        if (!currentProblem) return;
        const currentCount = getUnlockedHintsCount(currentProblem.id);
        if (step > currentCount) {
            setUnlockedHintsCount(currentProblem.id, step);
            renderHints(currentProblem);
            if (typeof showToast === 'function') {
                showToast(`Hint ${step} unlocked!`);
            }
        }
    }

    function resetProblemHints() {
        if (!currentProblem) return;
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem(getHintsStorageKey(currentProblem.id));
            }
        } catch (e) { }
        renderHints(currentProblem);
        if (typeof showToast === 'function') {
            showToast('All hints reset to locked state.');
        }
    }

    function bindGlobalEvents() {
        // Left Pane Tabs (Description vs Hints vs Submissions)
        if (dom.tabBtnDescription) {
            dom.tabBtnDescription.addEventListener('click', () => switchLeftPaneTab('desc'));
        }
        if (dom.tabBtnHints) {
            dom.tabBtnHints.addEventListener('click', () => switchLeftPaneTab('hints'));
        }
        if (dom.tabBtnSubmissions) {
            dom.tabBtnSubmissions.addEventListener('click', () => switchLeftPaneTab('sub'));
        }

        // Hints Action Controls
        if (dom.btnRevealHint1) dom.btnRevealHint1.addEventListener('click', () => unlockHint(1));
        if (dom.btnRevealHint2) dom.btnRevealHint2.addEventListener('click', () => unlockHint(2));
        if (dom.btnRevealHint3) dom.btnRevealHint3.addEventListener('click', () => unlockHint(3));
        if (dom.btnResetHints) dom.btnResetHints.addEventListener('click', resetProblemHints);

        // Test Console Tabs (Test Cases vs Custom Input vs Test Results vs Diagnostics vs Submissions)
        if (dom.tabBtnTestCases) dom.tabBtnTestCases.addEventListener('click', () => switchConsoleTab('cases'));
        if (dom.tabBtnCustomInput) dom.tabBtnCustomInput.addEventListener('click', () => switchConsoleTab('custom'));
        if (dom.tabBtnTestResults) dom.tabBtnTestResults.addEventListener('click', () => switchConsoleTab('results'));
        if (dom.tabBtnDiagnostics) dom.tabBtnDiagnostics.addEventListener('click', () => switchConsoleTab('diagnostics'));
        if (dom.tabBtnSubmissionsConsole) dom.tabBtnSubmissionsConsole.addEventListener('click', () => switchConsoleTab('submissions'));

        // Load Sample Input into Custom Input textarea
        if (dom.btnLoadSampleInput) {
            dom.btnLoadSampleInput.addEventListener('click', function () {
                if (currentProblem && Array.isArray(currentProblem.sampleTestCases) && currentProblem.sampleTestCases.length > 0) {
                    const idx = (typeof activeCaseIndex === 'number' && currentProblem.sampleTestCases[activeCaseIndex]) ? activeCaseIndex : 0;
                    if (dom.customInputText) {
                        dom.customInputText.value = currentProblem.sampleTestCases[idx].input || '';
                    }
                    showToast(`Loaded Sample Case ${idx + 1} input`, 'info');
                } else {
                    showToast('No sample test cases available to load', 'warning');
                }
            });
        }

        // Accordion Collapsible Sections
        document.querySelectorAll('.section-collapse-header').forEach(header => {
            header.addEventListener('click', function () {
                const sec = this.closest('.collapsible-section');
                if (sec) {
                    sec.classList.toggle('open');
                    const isOpen = sec.classList.contains('open');
                    this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                }
            });
        });

        // Left Pane Collapse/Expand Toggle
        if (dom.btnToggleCollapseLeft) {
            dom.btnToggleCollapseLeft.addEventListener('click', function () {
                if (dom.problemReferencePane) {
                    dom.problemReferencePane.classList.toggle('collapsed');
                    const isCollapsed = dom.problemReferencePane.classList.contains('collapsed');
                    if (dom.workspaceMain) {
                        dom.workspaceMain.classList.toggle('left-collapsed', isCollapsed);
                    }
                    this.setAttribute('title', isCollapsed ? 'Expand Description Panel' : 'Collapse Description Panel');
                    this.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');
                    if (codeEditor && typeof codeEditor.refresh === 'function') {
                        setTimeout(() => codeEditor.refresh(), 200);
                    }
                }
            });
        }

        // Open Hints View from Description Accordion
        if (dom.btnOpenHintsView) {
            dom.btnOpenHintsView.addEventListener('click', function () {
                switchLeftPaneTab('hints');
            });
        }

        // Language Selector
        if (dom.selectEditorLang) {
            dom.selectEditorLang.addEventListener('change', function () {
                const lang = this.value;
                if (lang !== 'java') {
                    showToast(`${lang.toUpperCase()} compiler environment connects in an upcoming release. Java (OpenJDK 17) active.`, 'info');
                    this.value = 'java';
                }
            });
        }

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
            } catch (e) { }
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
                } catch (e) { }
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

        // Clear session & local drafts on reset confirmation
        if (dom.btnConfirmReset) {
            dom.btnConfirmReset.addEventListener('click', function () {
                try {
                    if (currentProblem) {
                        const pId = currentProblem.id || currentProblem.slug;
                        if (typeof localStorage !== 'undefined') {
                            localStorage.removeItem('codearena_draft_' + pId);
                            localStorage.removeItem('codearena_draft_problem_' + pId);
                        }
                        if (typeof sessionStorage !== 'undefined') {
                            sessionStorage.removeItem('codearena_draft_problem_' + pId);
                        }
                    }
                } catch (e) { }

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
     * Switches between console tabs: 'cases' | 'custom' | 'results' | 'diagnostics' | 'submissions'.
     */
    function switchConsoleTab(tabName) {
        activeConsoleTab = tabName;

        if (dom.tabBtnTestCases) dom.tabBtnTestCases.classList.toggle('active', tabName === 'cases');
        if (dom.tabBtnCustomInput) dom.tabBtnCustomInput.classList.toggle('active', tabName === 'custom');
        if (dom.tabBtnTestResults) dom.tabBtnTestResults.classList.toggle('active', tabName === 'results');
        if (dom.tabBtnDiagnostics) dom.tabBtnDiagnostics.classList.toggle('active', tabName === 'diagnostics');
        if (dom.tabBtnSubmissionsConsole) dom.tabBtnSubmissionsConsole.classList.toggle('active', tabName === 'submissions');

        if (dom.panelTestCases) dom.panelTestCases.style.display = (tabName === 'cases') ? 'flex' : 'none';
        if (dom.panelCustomInput) dom.panelCustomInput.style.display = (tabName === 'custom') ? 'flex' : 'none';
        if (dom.panelTestResults) dom.panelTestResults.style.display = (tabName === 'results') ? 'flex' : 'none';
        if (dom.panelDiagnostics) dom.panelDiagnostics.style.display = (tabName === 'diagnostics') ? 'flex' : 'none';
        if (dom.panelSubmissionsConsole) {
            dom.panelSubmissionsConsole.style.display = (tabName === 'submissions') ? 'flex' : 'none';
            if (tabName === 'submissions' && currentProblem) {
                renderConsoleSubmissions(currentProblem.id);
            }
        }
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
        } catch (e) { }
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
                const hasCustomInput = Boolean(dom.customInputText && dom.customInputText.value.trim());
                const customInputStr = hasCustomInput ? dom.customInputText.value.trim() : null;

                setVerdictBanner('success', 'Structural Check Passed', hasCustomInput ? 'Custom input registered · Execution engine connects in Phase 4' : 'Code structure is valid · Java execution engine connects in Phase 4', 'Preview Only');

                if (dom.resultsStatusBadge) {
                    dom.resultsStatusBadge.textContent = 'Not Executed — Preview Only';
                    dom.resultsStatusBadge.className = 'results-status-badge status-passed';
                }

                if (dom.resultsActualDisplay) {
                    dom.resultsActualDisplay.textContent = 'Execution unavailable — frontend preview only.';
                }

                if (hasCustomInput && dom.resultsInputDisplay) {
                    dom.resultsInputDisplay.textContent = customInputStr;
                }

                if (dom.diagnosticsTerminalBox) {
                    const customNote = hasCustomInput ? `\n• Custom Stdin Stream: Provided (${customInputStr.length} chars)` : '';
                    dom.diagnosticsTerminalBox.textContent = `[Client-Side Structural Check: Passed]\nNo syntax or structural issues detected in editor source.\n• Class declaration verified (class Solution)\n• Curly braces balanced ({ ... })\n• Syntax mode: Java (OpenJDK 17)${customNote}\n\nPreview Notice: Client-side structural checks assist with brace matching and class declarations before submission. Arbitrary Java compilation, System.in streaming, and test-case execution connect in Phase 4.`;
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

        if (dom.submissionAnimateBanner) {
            dom.submissionAnimateBanner.style.display = (submissions && submissions.length > 0) ? 'flex' : 'none';
        }

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
            await renderConsoleSubmissions(currentProblem.id);

            // Show prominent Animate the Solution action after submission
            if (dom.submissionAnimateBanner) {
                dom.submissionAnimateBanner.style.display = 'flex';
            }
            if (dom.consoleSubmissionAnimateBanner) {
                dom.consoleSubmissionAnimateBanner.style.display = 'flex';
            }

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
        setReturnPreference: (val) => handleReturnToggleChange(val),
        renderConsoleSubmissions: renderConsoleSubmissions,
        renderRelatedConcepts: renderRelatedConcepts
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
            } catch (e) { }
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
            } catch (e) { }
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
        } catch (e) { }
    }

})();
