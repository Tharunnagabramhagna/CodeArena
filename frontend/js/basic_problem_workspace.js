/**
 * CodeArena — Basic Problem Workspace Controller
 * Manages the two-pane workspace for beginner Java challenges:
 * CodeMirror 5 integration, description rendering, console tabs,
 * client-side preview execution, and draft persistence.
 */

(function () {
    'use strict';

    let currentProblem = null;
    let editorInstance = null;
    let currentFontSize = 14;
    let draftSaveTimeout = null;

    function initWorkspace() {
        const params = new URLSearchParams(window.location.search);
        const problemId = params.get('id') || 'hello-world';

        if (!window.CodeArenaBasicPractice) {
            console.error('CodeArenaBasicPractice service is not loaded.');
            return;
        }

        currentProblem = window.CodeArenaBasicPractice.getProblemById(problemId);
        if (!currentProblem) {
            currentProblem = window.CodeArenaBasicPractice.getProblemById('hello-world');
        }

        if (!currentProblem) {
            console.error('Problem not found:', problemId);
            return;
        }

        renderProblemDetails(currentProblem);
        setupCodeMirror(currentProblem);
        setupConsoleTabs();
        setupEditorActions();
        setupExecutionActions();
    }

    function renderProblemDetails(problem) {
        document.title = `${problem.title} — Basic Java Track — CodeArena`;

        const breadcrumb = document.getElementById('basicBreadcrumbTitle');
        if (breadcrumb) breadcrumb.textContent = problem.title;

        const numEl = document.getElementById('basicProbNumber');
        if (numEl) numEl.textContent = `#${problem.number}`;

        const catEl = document.getElementById('basicProbCategory');
        if (catEl) catEl.textContent = problem.category;

        const diffEl = document.getElementById('basicProbDifficulty');
        if (diffEl) {
            diffEl.textContent = problem.difficulty;
            diffEl.className = 'basic-prob-diff-badge ' + problem.difficulty.toLowerCase();
        }

        updateStatusBadge(problem.status);

        const titleEl = document.getElementById('basicProblemTitle');
        if (titleEl) titleEl.textContent = problem.title;

        const descEl = document.getElementById('basicProblemDesc');
        if (descEl) descEl.innerHTML = problem.description;

        const inFormatEl = document.getElementById('basicInputFormat');
        if (inFormatEl) inFormatEl.innerHTML = problem.inputFormat || 'None';

        const outFormatEl = document.getElementById('basicOutputFormat');
        if (outFormatEl) outFormatEl.innerHTML = problem.outputFormat || 'None';

        const constrEl = document.getElementById('basicConstraints');
        if (constrEl) constrEl.textContent = problem.constraints || 'Standard memory and time limits apply.';

        const sampleInEl = document.getElementById('basicSampleInput');
        if (sampleInEl) sampleInEl.textContent = problem.sampleInput ? problem.sampleInput : '(No Input)';

        const sampleOutEl = document.getElementById('basicSampleOutput');
        if (sampleOutEl) sampleOutEl.textContent = problem.sampleOutput || '';

        const expSection = document.getElementById('basicExplanationSection');
        const expEl = document.getElementById('basicExplanation');
        if (expEl && expSection) {
            if (problem.explanation) {
                expEl.textContent = problem.explanation;
                expSection.style.display = 'block';
            } else {
                expSection.style.display = 'none';
            }
        }

        const conceptsRow = document.getElementById('basicConceptsRow');
        if (conceptsRow) {
            conceptsRow.innerHTML = '';
            (problem.relatedConcepts || []).forEach(concept => {
                const pill = document.createElement('span');
                pill.className = 'concept-pill';
                pill.textContent = concept;
                conceptsRow.appendChild(pill);
            });
        }
    }

    function updateStatusBadge(status) {
        const statusEl = document.getElementById('basicProbStatus');
        if (!statusEl) return;
        if (status === 'solved') {
            statusEl.innerHTML = '<span style="display: inline-flex; align-items: center; gap: 4px; color: #34D399;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg> Solved</span>';
        } else if (status === 'attempted') {
            statusEl.innerHTML = '<span style="display: inline-flex; align-items: center; gap: 4px; color: #60A5FA;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> Attempted</span>';
        } else {
            statusEl.textContent = 'Unattempted';
            statusEl.style.color = '#94A3B8';
        }
    }

    function getCurrentCMTheme() {
        return document.documentElement.getAttribute('data-theme') === 'light'
            ? 'codearena-light'
            : 'codearena-dark';
    }

    function setupCodeMirror(problem) {
        const textarea = document.getElementById('basicCodeTextarea');
        const initialCode = problem.savedDraft || problem.starterCode || '// Write your Java solution here\n';

        if (window.CodeMirror) {
            editorInstance = window.CodeMirror.fromTextArea(textarea, {
                lineNumbers: true,
                mode: 'text/x-java',
                theme: getCurrentCMTheme(),
                lineWrapping: true,
                matchBrackets: true,
                autoCloseBrackets: true,
                styleActiveLine: true,
                indentUnit: 4,
                tabSize: 4,
                extraKeys: {
                    'Ctrl-Enter': function () { runCodePreview(); },
                    'Cmd-Enter': function () { runCodePreview(); }
                }
            });

            editorInstance.setValue(initialCode);

            // Dynamically synchronize theme changes
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                        if (editorInstance) {
                            editorInstance.setOption('theme', getCurrentCMTheme());
                        }
                    }
                });
            });
            observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

            editorInstance.on('change', () => {
                clearTimeout(draftSaveTimeout);
                draftSaveTimeout = setTimeout(() => {
                    const code = editorInstance.getValue();
                    window.CodeArenaBasicPractice.saveDraft(problem.id, code);
                }, 800);
            });
        } else {
            textarea.classList.remove('sr-only');
            textarea.value = initialCode;
            textarea.addEventListener('input', () => {
                clearTimeout(draftSaveTimeout);
                draftSaveTimeout = setTimeout(() => {
                    window.CodeArenaBasicPractice.saveDraft(problem.id, textarea.value);
                }, 800);
            });
        }
    }

    function getEditorCode() {
        if (editorInstance) {
            return editorInstance.getValue();
        }
        const textarea = document.getElementById('basicCodeTextarea');
        return textarea ? textarea.value : '';
    }

    function setEditorCode(val) {
        if (editorInstance) {
            editorInstance.setValue(val);
        } else {
            const textarea = document.getElementById('basicCodeTextarea');
            if (textarea) textarea.value = val;
        }
    }

    function setupConsoleTabs() {
        const tabs = document.querySelectorAll('.basic-console-tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                switchTab(tab.getAttribute('data-tab'));
            });
        });
    }

    function switchTab(tabKey) {
        const tabs = document.querySelectorAll('.basic-console-tab-btn');
        tabs.forEach(t => {
            const isMatch = t.getAttribute('data-tab') === tabKey;
            t.classList.toggle('active', isMatch);
            t.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        });

        const panelMap = {
            output: 'panelOutput',
            input: 'panelInput',
            testcases: 'panelTestCases',
            diagnostics: 'panelDiagnostics'
        };

        Object.keys(panelMap).forEach(key => {
            const panel = document.getElementById(panelMap[key]);
            if (panel) {
                panel.style.display = key === tabKey ? 'block' : 'none';
            }
        });
    }

    function setupEditorActions() {
        // Copy Sample Input
        const copySampleBtn = document.getElementById('btnCopySampleInput');
        if (copySampleBtn) {
            copySampleBtn.addEventListener('click', () => {
                const text = currentProblem.sampleInput || '';
                navigator.clipboard.writeText(text).then(() => {
                    showToast('Sample input copied to clipboard');
                }).catch(() => {
                    showToast('Unable to copy sample input');
                });
            });
        }

        // Copy Code
        const copyCodeBtn = document.getElementById('btnCopyCode');
        if (copyCodeBtn) {
            copyCodeBtn.addEventListener('click', () => {
                const code = getEditorCode();
                navigator.clipboard.writeText(code).then(() => {
                    showToast('Solution code copied to clipboard');
                }).catch(() => {
                    showToast('Unable to copy code');
                });
            });
        }

        // Reset Code
        const resetBtn = document.getElementById('btnResetCode');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (currentProblem && currentProblem.starterCode) {
                    setEditorCode(currentProblem.starterCode);
                    window.CodeArenaBasicPractice.saveDraft(currentProblem.id, currentProblem.starterCode);
                    showToast('Restored initial Java starter code');
                }
            });
        }

        // Font Size Controls
        const btnDec = document.getElementById('btnFontDec');
        const btnInc = document.getElementById('btnFontInc');
        const fontLabel = document.getElementById('fontSizeLabel');

        function applyFontSize(size) {
            currentFontSize = Math.max(12, Math.min(22, size));
            if (fontLabel) fontLabel.textContent = `${currentFontSize}px`;
            const cmEl = document.querySelector('.basic-cm-container .CodeMirror');
            if (cmEl) {
                cmEl.style.fontSize = `${currentFontSize}px`;
                if (editorInstance) editorInstance.refresh();
            }
        }

        if (btnDec) {
            btnDec.addEventListener('click', () => applyFontSize(currentFontSize - 1));
        }
        if (btnInc) {
            btnInc.addEventListener('click', () => applyFontSize(currentFontSize + 1));
        }
    }

    function setupExecutionActions() {
        const runBtn = document.getElementById('btnRunBasicCode');
        if (runBtn) {
            runBtn.addEventListener('click', runCodePreview);
        }

        const submitBtn = document.getElementById('btnSubmitBasicSolution');
        if (submitBtn) {
            submitBtn.addEventListener('click', submitSolutionPreview);
        }

        // Global keyboard shortcut: Ctrl+Enter
        window.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                runCodePreview();
            }
        });
    }

    function runCodePreview() {
        const code = getEditorCode();
        const customInputEl = document.getElementById('basicCustomInput');
        const customInput = customInputEl ? customInputEl.value : null;

        const res = window.CodeArenaBasicPractice.validateCodePreview(currentProblem, code, customInput);

        const stdoutPre = document.getElementById('basicStdoutPre');
        const diagPre = document.getElementById('basicDiagnosticsPre');
        const testCasesDiv = document.getElementById('basicTestCasesContainer');

        if (res.success) {
            if (stdoutPre) {
                stdoutPre.textContent = currentProblem.sampleOutput || 'Execution completed with return code 0.\n(Client-side preview check passed)';
                stdoutPre.style.color = '#E2E8F0';
            }
            if (diagPre) {
                diagPre.textContent = `Structure Validated\n• Class & method definitions detected.\n• Balanced braces confirmed.\n• Client-side preview check passed.\n\nNote: Educational Preview Mode.`;
                diagPre.style.color = '#34D399';
            }

            renderTestCases(res.results, testCasesDiv);
            switchTab('output');
            showToast('Preview code execution completed');

            // Mark as attempted if unattempted
            if (currentProblem.status === 'unattempted') {
                window.CodeArenaBasicPractice.saveProgress(currentProblem.id, false);
                currentProblem.status = 'attempted';
                updateStatusBadge('attempted');
            }
        } else {
            if (stdoutPre) {
                stdoutPre.textContent = `Execution Warning:\n${res.message}`;
                stdoutPre.style.color = '#F87171';
            }
            if (diagPre) {
                diagPre.textContent = `Syntax & Structural Warning:\n${res.message}`;
                diagPre.style.color = '#F87171';
            }
            switchTab('diagnostics');
            showToast(res.message, 'error');
        }
    }

    function submitSolutionPreview() {
        const code = getEditorCode();
        const res = window.CodeArenaBasicPractice.validateCodePreview(currentProblem, code);

        const testCasesDiv = document.getElementById('basicTestCasesContainer');
        const diagPre = document.getElementById('basicDiagnosticsPre');

        if (res.success) {
            window.CodeArenaBasicPractice.saveProgress(currentProblem.id, true);
            currentProblem.status = 'solved';
            updateStatusBadge('solved');

            renderTestCases(res.results, testCasesDiv);
            if (diagPre) {
                diagPre.textContent = `Solution Accepted in Preview Mode!\nAll ${res.results.length} preview test case(s) passed successfully.\nYour progress has been saved locally.`;
                diagPre.style.color = '#34D399';
            }
            switchTab('testcases');
            showToast('Solution accepted in local preview');
        } else {
            if (diagPre) {
                diagPre.textContent = `Submission Check Failed:\n${res.message}`;
                diagPre.style.color = '#F87171';
            }
            switchTab('diagnostics');
            showToast('Submission check failed. See diagnostics.', 'error');
        }
    }

    function renderTestCases(results, container) {
        if (!container) return;
        if (!results || results.length === 0) {
            container.innerHTML = '<p style="color: #94A3B8;">No test cases defined for this preview.</p>';
            return;
        }

        let html = '<div style="display: flex; flex-direction: column; gap: 12px;">';
        results.forEach((r) => {
            html += `
                <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 10px 14px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                        <span style="font-weight: 700; font-size: 0.82rem; color: #F1F5F9;">Case ${r.caseIndex}</span>
                        <span style="font-size: 0.76rem; font-weight: 700; color: #34D399; background: rgba(16, 185, 129, 0.12); padding: 2px 8px; border-radius: 4px;">Passed</span>
                    </div>
                    <div style="font-size: 0.8rem; color: #94A3B8; margin-bottom: 2px;">Input: <code style="color: #E2E8F0;">${escapeHtml(r.input || '(empty)')}</code></div>
                    <div style="font-size: 0.8rem; color: #94A3B8;">Expected: <code style="color: #E2E8F0;">${escapeHtml(r.expectedOutput || '')}</code></div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function showToast(msg, type = 'info') {
        if (window.CodeArenaToast && typeof window.CodeArenaToast.show === 'function') {
            window.CodeArenaToast.show(msg, type);
        } else {
            console.log(`[Toast] [${type}] ${msg}`);
        }
    }

    // Window resize listener to keep CodeMirror properly dimensioned
    window.addEventListener('resize', () => {
        if (editorInstance) {
            editorInstance.refresh();
        }
    });

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWorkspace);
    } else {
        initWorkspace();
    }
})();

