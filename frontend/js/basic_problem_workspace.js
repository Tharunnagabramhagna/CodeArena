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
    let isRunning = false;
    let isBasicAnimationUnlocked = false;

    async function initWorkspace() {
        const params = new URLSearchParams(window.location.search);
        const problemId = params.get('id') || 'hello-world';

        if (!window.CodeArenaAPI || !window.CodeArenaAPI.problemService) {
            showProblemLoadError('CodeArena API client is unavailable.');
            return;
        }

        if (window.CodeArenaAPI.authService && typeof window.CodeArenaAPI.authService.getCurrentUser === 'function') {
            await window.CodeArenaAPI.authService.getCurrentUser().catch(() => null);
        }

        checkSandboxStatus();

        const res = await window.CodeArenaAPI.problemService.getProblemById(problemId);
        if (!res || !res.success || !res.data) {
            showProblemLoadError((res && res.message) || `Problem "${problemId}" could not be loaded from the server.`);
            return;
        }

        currentProblem = normalizeProblem(res.data);

        // Determine attempted vs solved if authenticated
        if (window.CodeArenaAPI.authService && window.CodeArenaAPI.authService.isAuthenticated() && window.CodeArenaAPI.submissionService) {
            try {
                const subRes = await window.CodeArenaAPI.submissionService.getSubmissions(currentProblem.id);
                const subs = (subRes && subRes.success && subRes.data && Array.isArray(subRes.data.submissions)) ? subRes.data.submissions : [];
                if (subs.some(s => String(s.verdict || '').toUpperCase() === 'ACCEPTED')) {
                    currentProblem.status = 'solved';
                } else if (subs.length > 0 && currentProblem.status === 'unattempted') {
                    currentProblem.status = 'attempted';
                }
            } catch (e) { }
        }

        renderProblemDetails(currentProblem);
        setupCodeMirror(currentProblem);
        setupConsoleTabs();
        setupEditorActions();
        setupExecutionActions();

        if (window.CodeArenaAPI.authService && window.CodeArenaAPI.authService.isAuthenticated() && window.CodeArenaAPI.studentService) {
            window.CodeArenaAPI.studentService.recordRecentlyViewed(currentProblem.id).catch(() => { });
        }
    }

    function normalizeProblem(p) {
        const samples = Array.isArray(p.sampleTestCases) ? p.sampleTestCases : [];
        const firstSample = samples[0] || {};
        const key = p.slug || String(p.id);
        let savedDraft = null;
        try {
            const rawDrafts = localStorage.getItem('codearena_basic_practice_drafts');
            if (rawDrafts) {
                const map = JSON.parse(rawDrafts);
                savedDraft = map[key] || map[p.id] || null;
            }
            if (savedDraft) {
                const isStalePrewritten = (
                    (key === 'sum-of-two-numbers' && savedDraft.includes('System.out.println(a + b)')) ||
                    (key === 'swap-two-numbers' && savedDraft.includes('System.out.println(a + " " + b)')) ||
                    (savedDraft.includes('long a = sc.nextLong();') && savedDraft.includes('System.out.println(a + b)')) ||
                    (savedDraft.includes('sc.close();') && savedDraft.length < 350 && !savedDraft.includes('// Write your solution here'))
                );
                if (isStalePrewritten) {
                    savedDraft = null;
                    if (rawDrafts) {
                        try {
                            const map = JSON.parse(rawDrafts);
                            delete map[key];
                            delete map[p.id];
                            localStorage.setItem('codearena_basic_practice_drafts', JSON.stringify(map));
                        } catch (e) {}
                    }
                }
            }
        } catch (e) { }

        const defaultStarter = 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}\n';

        return {
            id: p.id,
            slug: p.slug || String(p.id),
            number: p.problemNumber || p.id,
            title: p.title || key,
            category: p.topic || 'Fundamentals',
            difficulty: p.difficulty || 'Easy',
            description: p.description || '',
            inputFormat: p.inputFormat || 'None',
            outputFormat: p.outputFormat || 'None',
            constraints: Array.isArray(p.constraints) ? p.constraints.join('\n') : (p.constraints || ''),
            sampleInput: firstSample.input || '',
            sampleOutput: firstSample.expectedOutput || '',
            sampleTestCases: samples,
            explanation: p.explanation || '',
            relatedConcepts: Array.isArray(p.tags) ? p.tags : [],
            starterCode: p.starterCode || defaultStarter,
            savedDraft: savedDraft,
            status: p.solvedByUser ? 'solved' : 'unattempted'
        };
    }

    function showProblemLoadError(msg) {
        const titleEl = document.getElementById('basicProblemTitle');
        const descEl = document.getElementById('basicProblemDesc');
        if (titleEl) titleEl.textContent = 'Problem Unavailable';
        if (descEl) descEl.innerHTML = `<p style="color: #F87171;">${escapeHtml(msg)}</p><p><a href="basic-practice.html" style="color: #818CF8;">Return to Basic Problems</a></p>`;
    }

    async function checkSandboxStatus() {
        const pill = document.getElementById('basicSandboxPill');
        if (!pill || !window.CodeArenaAPI || !window.CodeArenaAPI.compilerService) return;
        try {
            const res = await window.CodeArenaAPI.compilerService.getStatus();
            const span = pill.querySelector('span');
            if (res && res.success && res.data && res.data.sandboxAvailable) {
                if (span) span.textContent = 'OpenJDK Sandbox Online';
            } else {
                if (span) span.textContent = 'Sandbox Offline (503)';
                pill.title = (res && res.data && res.data.reason) || 'Docker Java container runtime is not running on this host.';
            }
        } catch (e) { }
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

        // Authoritative server-side animation unlock verification
        checkBasicAnimationUnlockStatus(problem.id || problem.canonicalId || problem.slug);
    }

    function updateBasicAnimationUnlockState(isUnlocked, problemId) {
        isBasicAnimationUnlocked = !!isUnlocked;
        const targetId = problemId || (currentProblem ? (currentProblem.id || currentProblem.slug) : '');
        const animUrl = `solution-animation.html?id=${encodeURIComponent(targetId)}`;

        const entry = document.getElementById('basicWorkspaceAnimateEntry');
        const link = document.getElementById('linkBasicAnimateSolution');
        const icon = document.getElementById('basicAnimateIcon');
        const tag = document.getElementById('basicAnimateTag');
        const headline = document.getElementById('basicAnimateHeadline');
        const desc = document.getElementById('basicAnimateDesc');
        const actionText = document.getElementById('basicAnimateActionText');

        if (entry) {
            if (isUnlocked) {
                entry.classList.remove('animate-entry-locked');
                entry.classList.add('animate-entry-unlocked');
            } else {
                entry.classList.remove('animate-entry-unlocked');
                entry.classList.add('animate-entry-locked');
            }
        }

        if (link) {
            if (isUnlocked) {
                link.classList.remove('link-disabled');
                link.setAttribute('aria-disabled', 'false');
                link.title = 'Explore interactive algorithm execution walkthrough';
                link.href = animUrl;
            } else {
                link.classList.add('link-disabled');
                link.setAttribute('aria-disabled', 'true');
                link.title = 'Solve this problem successfully to unlock its interactive algorithm walkthrough.';
                link.href = '#';
            }
        }

        if (icon) {
            if (isUnlocked) {
                icon.className = 'animate-entry-icon animate-entry-icon-unlocked';
                icon.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
            } else {
                icon.className = 'animate-entry-icon animate-entry-icon-locked';
                icon.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`;
            }
        }

        if (tag) {
            if (isUnlocked) {
                tag.className = 'animate-entry-tag animate-tag-unlocked';
                tag.textContent = 'Visual Execution Walkthrough';
            } else {
                tag.className = 'animate-entry-tag animate-tag-locked';
                tag.textContent = 'Animation Locked';
            }
        }

        if (headline) {
            headline.textContent = isUnlocked ? 'Animate the Solution →' : 'Animation Locked';
        }

        if (desc) {
            desc.textContent = isUnlocked
                ? 'Explore step-by-step interactive algorithm execution, pointer states & complexity analysis on a dedicated stage.'
                : 'Solve this problem successfully to unlock its interactive algorithm walkthrough.';
        }

        if (actionText) {
            actionText.textContent = isUnlocked ? 'Launch Animation →' : 'Locked 🔒';
        }
    }

    async function checkBasicAnimationUnlockStatus(problemId) {
        updateBasicAnimationUnlockState(false, problemId);
        if (!problemId) return;

        try {
            if (window.CodeArenaAPI && window.CodeArenaAPI.problemService && typeof window.CodeArenaAPI.problemService.getAnimationUnlockStatus === 'function') {
                const res = await window.CodeArenaAPI.problemService.getAnimationUnlockStatus(problemId);
                const isUnlocked = !!(res && (res.unlocked === true || (res.data && res.data.unlocked === true)));
                updateBasicAnimationUnlockState(isUnlocked, problemId);
            }
        } catch (err) {
            console.warn('[BasicWorkspace] Could not verify animation unlock status:', err);
            updateBasicAnimationUnlockState(false, problemId);
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
                    'Ctrl-Enter': function () { runCodeLive(); },
                    'Cmd-Enter': function () { runCodeLive(); }
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
                    if (window.CodeArenaBasicPractice) {
                        window.CodeArenaBasicPractice.saveDraft(problem.slug || problem.id, code);
                    }
                }, 800);
            });
        } else {
            textarea.classList.remove('sr-only');
            textarea.value = initialCode;
            textarea.addEventListener('input', () => {
                clearTimeout(draftSaveTimeout);
                draftSaveTimeout = setTimeout(() => {
                    if (window.CodeArenaBasicPractice) {
                        window.CodeArenaBasicPractice.saveDraft(problem.slug || problem.id, textarea.value);
                    }
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
            diagnostics: 'panelDiagnostics',
            submissions: 'panelBasicSubmissions'
        };

        Object.keys(panelMap).forEach(key => {
            const panel = document.getElementById(panelMap[key]);
            if (panel) {
                panel.style.display = key === tabKey ? 'block' : 'none';
            }
        });

        if (tabKey === 'submissions' && currentProblem) {
            loadBasicSubmissions(currentProblem.id);
        }
    }

    let activeBasicPollSubId = null;

    async function pollBasicSubmissionUntilTerminal(submissionId, problemId) {
        if (!submissionId || submissionId <= 0) return null;
        if (activeBasicPollSubId === submissionId) return null; // Deduplication
        activeBasicPollSubId = submissionId;

        const diagPre = document.getElementById('basicDiagnosticsPre');
        let delayMs = 1000;
        let consecutiveErrors = 0;
        const startTime = Date.now();
        let sub = null;

        try {
            while (true) {
                await new Promise(r => setTimeout(r, delayMs));
                const elapsed = Math.round((Date.now() - startTime) / 1000);
                if (diagPre) {
                    diagPre.textContent = `Evaluating solution against judge suite in OpenJDK 17 sandbox...\nStatus: ${sub ? (sub.status || 'RUNNING') : 'RUNNING'} (${elapsed}s elapsed)`;
                }

                try {
                    const poll = await window.CodeArenaAPI.submissionService.getSubmissionById(submissionId);
                    if (poll && poll.success && poll.data) {
                        consecutiveErrors = 0;
                        sub = poll.data;
                        const isTerm = sub.status === 'COMPLETED' || sub.status === 'SYSTEM_ERROR' ||
                            (sub.verdict && sub.verdict !== 'PENDING' && sub.verdict !== 'QUEUED' && sub.verdict !== 'RUNNING');
                        if (isTerm) break;

                        if (elapsed > 25) delayMs = 2000;
                        else if (elapsed > 10) delayMs = 1500;
                        else delayMs = 1000;
                    } else if (poll && (poll.status === 401 || poll.status === 403)) {
                        break;
                    } else {
                        consecutiveErrors++;
                        delayMs = Math.min(3000, delayMs + 500);
                    }
                } catch (err) {
                    consecutiveErrors++;
                    delayMs = Math.min(3000, delayMs + 500);
                }
            }
        } finally {
            if (activeBasicPollSubId === submissionId) {
                activeBasicPollSubId = null;
            }
        }
        return sub;
    }

    async function loadBasicSubmissions(problemId) {
        const container = document.getElementById('basicSubmissionsContainer');
        if (!container || !problemId || !window.CodeArenaAPI || !window.CodeArenaAPI.submissionService) return;
        try {
            const res = await window.CodeArenaAPI.submissionService.getSubmissions(problemId);
            const subs = (res && res.success && res.data && res.data.submissions) || [];
            if (subs.length === 0) {
                container.innerHTML = '<p style="color: #94A3B8; margin: 0; font-size: 0.85rem;">No submissions recorded yet for this problem.</p>';
                return;
            }
            container.innerHTML = '';

            // Auto-reconnect background polling if most recent submission is still in-flight
            const latest = subs[0];
            const isPendingLatest = latest && (latest.status === 'QUEUED' || latest.status === 'RUNNING' || latest.verdict === 'PENDING');
            if (isPendingLatest && activeBasicPollSubId !== latest.id && !isRunning) {
                resumeBasicPolling(latest.id, problemId);
            }
            subs.forEach(s => {
                const card = document.createElement('div');
                card.style.cssText = 'background: rgba(15,23,42,0.6); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 10px 12px; cursor: pointer; transition: all 0.15s ease; display: flex; flex-direction: column; gap: 6px;';
                card.addEventListener('mouseenter', () => { card.style.borderColor = '#3B82F6'; card.style.background = 'rgba(30,41,59,0.8)'; });
                card.addEventListener('mouseleave', () => { card.style.borderColor = 'rgba(255,255,255,0.08)'; card.style.background = 'rgba(15,23,42,0.6)'; });
                card.title = 'Click to inspect submitted code or load into editor';
                card.addEventListener('click', () => {
                    openSubmissionModal(s);
                });

                const v = String(s.verdict || s.status || 'PENDING').toUpperCase();
                const isAcc = v === 'ACCEPTED';
                const isPending = (v === 'QUEUED' || v === 'RUNNING' || v === 'PENDING');
                const badgeColor = isAcc ? '#34D399' : (isPending ? '#F59E0B' : (v.includes('ERROR') ? '#F87171' : '#FBBF24'));
                const passed = s.testCasesPassed !== undefined ? s.testCasesPassed : (s.passedCount || 0);
                const total = s.testCasesTotal !== undefined ? s.testCasesTotal : (s.totalCount || 0);
                const runtime = isPending ? 'Evaluating...' : ((s.executionTime || s.executionTimeMs || 0) + ' ms');
                const timeStr = s.submittedAt ? new Date(s.submittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Recent';

                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 600; font-size: 0.85rem; color: ${badgeColor}; display: inline-flex; align-items: center; gap: 4px;">
                            ${isAcc ? '✓' : (isPending ? '⟳' : '✗')} ${isPending ? 'Judging...' : v.replace(/_/g, ' ')}
                        </span>
                        <span style="font-size: 0.78rem; color: #94A3B8;">${timeStr}</span>
                    </div>
                    <div style="display: flex; gap: 10px; font-size: 0.78rem; color: #94A3B8;">
                        ${total > 0 ? `<span>Cases: ${passed}/${total}</span>` : '<span>Cases: Judging...</span>'}
                        <span>Runtime: ${runtime}</span>
                        <span>Java (OpenJDK 17)</span>
                    </div>
                `;
                container.appendChild(card);
            });
        } catch (e) {
            console.warn('[BasicWorkspace] load submissions error:', e);
        }
    }

    async function resumeBasicPolling(submissionId, problemId) {
        const diagPre = document.getElementById('basicDiagnosticsPre');
        const testCasesDiv = document.getElementById('basicTestCasesContainer');
        const finalSub = await pollBasicSubmissionUntilTerminal(submissionId, problemId);
        if (finalSub && currentProblem && (currentProblem.id === problemId || currentProblem.slug === problemId)) {
            const verdict = String(finalSub.verdict || finalSub.status || 'UNKNOWN').toUpperCase();
            const isAccepted = verdict === 'ACCEPTED';
            if (isAccepted) {
                currentProblem.status = 'solved';
                updateStatusBadge('solved');
                updateBasicAnimationUnlockState(true, currentProblem.id);
            } else if (currentProblem.status === 'unattempted') {
                currentProblem.status = 'attempted';
                updateStatusBadge('attempted');
            }
            if (Array.isArray(finalSub.testCaseResults) && finalSub.testCaseResults.length > 0) {
                renderTestCases(finalSub.testCaseResults, testCasesDiv);
            }
            if (diagPre) {
                const summary = [
                    `Verdict: ${verdict.replace(/_/g, ' ')}`,
                    finalSub.testCasesTotal ? `Test Cases Passed: ${finalSub.testCasesPassed || 0}/${finalSub.testCasesTotal}` : '',
                    finalSub.executionTime ? `Runtime: ${finalSub.executionTime} ms` : '',
                    finalSub.compilerOutput ? `\nCompiler Output:\n${finalSub.compilerOutput}` : '',
                    finalSub.runtimeErrorLog ? `\nRuntime Log:\n${finalSub.runtimeErrorLog}` : ''
                ].filter(Boolean).join('\n');
                diagPre.textContent = summary;
                diagPre.style.color = isAccepted ? '#34D399' : '#F87171';
            }
            await loadBasicSubmissions(problemId);
            showToast(`Submission Verdict: ${verdict.replace(/_/g, ' ')} (${finalSub.testCasesPassed || 0}/${finalSub.testCasesTotal || 0} passed)`, isAccepted ? 'success' : 'error');
        }
    }

    function openSubmissionModal(s) {
        let modal = document.getElementById('basicSubModalOverlay');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'basicSubModalOverlay';
            modal.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px;';
            document.body.appendChild(modal);
        }
        const v = String(s.verdict || s.status || 'PENDING').toUpperCase();
        const isAcc = v === 'ACCEPTED';
        const badgeColor = isAcc ? '#34D399' : '#F87171';
        const code = s.sourceCode || s.code || '';
        const passed = s.testCasesPassed !== undefined ? s.testCasesPassed : (s.passedCount || 0);
        const total = s.testCasesTotal !== undefined ? s.testCasesTotal : (s.totalCount || 0);
        const runtime = (s.executionTime || s.executionTimeMs || 0) + ' ms';

        modal.innerHTML = `
            <div style="background: #0F172A; border: 1px solid #1E293B; border-radius: 12px; max-width: 680px; width: 100%; padding: 20px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); display: flex; flex-direction: column; gap: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <h3 style="margin: 0; color: #F8FAFC; font-size: 1.1rem;">Submitted Solution</h3>
                        <span style="font-size: 0.8rem; font-weight: 600; padding: 2px 8px; border-radius: 4px; background: rgba(${isAcc ? '52,211,153' : '248,113,113'},0.15); color: ${badgeColor}; border: 1px solid ${badgeColor};">${v.replace(/_/g, ' ')}</span>
                    </div>
                    <button type="button" id="btnBasicCloseSubModal" style="background: none; border: none; color: #94A3B8; font-size: 22px; cursor: pointer; line-height: 1;">&times;</button>
                </div>
                <div style="display: flex; gap: 14px; font-size: 0.82rem; color: #94A3B8;">
                    <span><strong>Cases Passed:</strong> ${passed}/${total}</span>
                    <span><strong>Runtime:</strong> ${runtime}</span>
                    <span><strong>Language:</strong> Java 17</span>
                </div>
                <pre style="background: #020617; border: 1px solid #1E293B; border-radius: 8px; padding: 14px; max-height: 320px; overflow-y: auto; color: #E2E8F0; font-family: monospace; font-size: 0.85rem; white-space: pre-wrap; margin: 0;"><code>${escapeHtml(code)}</code></pre>
                <div style="display: flex; justify-content: flex-end; gap: 10px;">
                    <button type="button" id="btnBasicCopySubCode" style="padding: 7px 14px; border-radius: 6px; background: #1E293B; color: #F8FAFC; border: 1px solid #334155; cursor: pointer;">Copy Code</button>
                    <button type="button" id="btnBasicLoadSubCode" style="padding: 7px 14px; border-radius: 6px; background: #3B82F6; color: #FFF; border: none; cursor: pointer;">Load into Editor</button>
                </div>
            </div>
        `;
        modal.style.display = 'flex';

        document.getElementById('btnBasicCloseSubModal').onclick = () => { modal.style.display = 'none'; };
        modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
        document.getElementById('btnBasicCopySubCode').onclick = () => {
            navigator.clipboard.writeText(code).then(() => showToast('Code copied to clipboard', 'success'));
        };
        document.getElementById('btnBasicLoadSubCode').onclick = () => {
            setEditorCode(code);
            modal.style.display = 'none';
            showToast('Loaded submission into editor', 'info');
        };
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
                    if (window.CodeArenaBasicPractice) {
                        window.CodeArenaBasicPractice.saveDraft(currentProblem.slug || currentProblem.id, currentProblem.starterCode);
                    }
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
            runBtn.addEventListener('click', runCodeLive);
        }

        const submitBtn = document.getElementById('btnSubmitBasicSolution');
        if (submitBtn) {
            submitBtn.addEventListener('click', submitSolutionLive);
        }

        const linkBasic = document.getElementById('linkBasicAnimateSolution');
        if (linkBasic) {
            linkBasic.addEventListener('click', (e) => {
                if (!isBasicAnimationUnlocked || linkBasic.classList.contains('link-disabled') || linkBasic.getAttribute('aria-disabled') === 'true') {
                    e.preventDefault();
                    e.stopPropagation();
                    showToast('Animation Locked: Solve this problem successfully to unlock its algorithm walkthrough.', 'warning');
                }
            });
        }

        document.addEventListener('codearena:auth-changed', () => {
            if (currentProblem) {
                checkBasicAnimationUnlockStatus(currentProblem.id || currentProblem.canonicalId || currentProblem.slug);
            }
        });

        // Global keyboard shortcut: Ctrl+Enter
        window.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                runCodeLive();
            }
        });
    }

    async function ensureAuthenticatedForAction(actionName) {
        if (!window.CodeArenaAPI || !window.CodeArenaAPI.authService) return false;
        if (!window.CodeArenaAPI.authService.isAuthenticated()) {
            await window.CodeArenaAPI.authService.getCurrentUser().catch(() => null);
        }
        if (window.CodeArenaAPI.authService.isAuthenticated()) {
            return true;
        }
        showToast(`Please log in to ${actionName}.`, 'warning');
        if (window.CodeArenaAuthModal && typeof window.CodeArenaAuthModal.open === 'function') {
            window.CodeArenaAuthModal.open('login');
        }
        return false;
    }

    async function runCodeLive() {
        if (isRunning || !currentProblem) return;
        const code = getEditorCode();
        const customInputEl = document.getElementById('basicCustomInput');
        const customInputRaw = customInputEl ? customInputEl.value : '';
        const hasCustomInput = Boolean(customInputRaw && customInputRaw.trim());

        const stdoutPre = document.getElementById('basicStdoutPre');
        const diagPre = document.getElementById('basicDiagnosticsPre');
        const testCasesDiv = document.getElementById('basicTestCasesContainer');

        if (!code || !code.trim()) {
            if (stdoutPre) { stdoutPre.textContent = 'Source code cannot be empty.'; stdoutPre.style.color = '#F87171'; }
            if (diagPre) { diagPre.textContent = 'Error: Source code cannot be empty.'; diagPre.style.color = '#F87171'; }
            switchTab('diagnostics');
            showToast('Write your Java code before running.', 'warning');
            return;
        }

        if (!(await ensureAuthenticatedForAction('run Java code'))) return;

        isRunning = true;
        const runBtn = document.getElementById('btnRunBasicCode');
        const submitBtn = document.getElementById('btnSubmitBasicSolution');
        if (runBtn) runBtn.disabled = true;
        if (submitBtn) submitBtn.disabled = true;

        if (stdoutPre) { stdoutPre.textContent = 'Compiling and executing inside OpenJDK sandbox...'; stdoutPre.style.color = '#94A3B8'; }
        switchTab('output');

        try {
            const res = await window.CodeArenaAPI.compilerService.runCode({
                problemId: currentProblem.id,
                sourceCode: code,
                language: 'java',
                stdin: hasCustomInput ? customInputRaw : undefined,
                runSamples: !hasCustomInput
            });

            if (res && (res.status === 401 || res.status === 403)) {
                showToast('Please log in to execute code.', 'warning');
                if (window.CodeArenaAuthModal) window.CodeArenaAuthModal.open('login');
                return;
            }

            const data = (res && res.data) ? res.data : null;

            if (res && (res.status === 503 || res.isUnavailable || (data && data.sandboxAvailable === false))) {
                const reason = (res && res.message) || 'Isolated Docker Java execution runtime is unavailable on this server.';
                if (stdoutPre) { stdoutPre.textContent = `[503 Sandbox Unavailable]\n${reason}`; stdoutPre.style.color = '#FBBF24'; }
                if (diagPre) { diagPre.textContent = `[503 Sandbox Unavailable]\n${reason}`; diagPre.style.color = '#FBBF24'; }
                showToast('Java execution sandbox offline (503)', 'warning');
                return;
            }

            if (!res || !res.success || !data) {
                const err = (res && res.message) || 'Execution failed on server.';
                if (stdoutPre) { stdoutPre.textContent = err; stdoutPre.style.color = '#F87171'; }
                if (diagPre) { diagPre.textContent = err; diagPre.style.color = '#F87171'; }
                showToast(err, 'error');
                return;
            }

            if (data.status === 'COMPILATION_ERROR' || (data.compileErrors && data.compileErrors.length > 0)) {
                const msg = data.stderr || 'Compilation failed.';
                if (stdoutPre) { stdoutPre.textContent = msg; stdoutPre.style.color = '#F87171'; }
                if (diagPre) { diagPre.textContent = `[javac Compilation Error]\n${msg}`; diagPre.style.color = '#F87171'; }
                switchTab('diagnostics');
                showToast('Compilation error — see Diagnostics.', 'error');
                return;
            }

            if (Array.isArray(data.sampleResults) && data.sampleResults.length > 0) {
                renderTestCases(data.sampleResults, testCasesDiv);
                const passedCount = Number(data.passedCount || 0);
                const totalCount = Number(data.totalCount || data.sampleResults.length);
                if (stdoutPre) {
                    stdoutPre.textContent = data.stdout ? data.stdout : '(No stdout produced)';
                    stdoutPre.style.color = passedCount === totalCount ? '#E2E8F0' : '#F87171';
                }
                if (diagPre) {
                    diagPre.textContent = data.sampleResults.map(r =>
                        `Case ${r.caseNumber}: ${r.passed ? 'PASSED' : r.status} (${r.executionTimeMs || 0} ms)${r.stderr ? '\n  ' + r.stderr : ''}`
                    ).join('\n');
                    diagPre.style.color = passedCount === totalCount ? '#34D399' : '#FBBF24';
                }
                if (currentProblem.status === 'unattempted') {
                    currentProblem.status = 'attempted';
                    updateStatusBadge('attempted');
                }
                switchTab('testcases');
                showToast(
                    passedCount === totalCount ? `Passed all ${totalCount} sample case(s)!` : `${passedCount}/${totalCount} sample case(s) passed`,
                    passedCount === totalCount ? 'success' : 'warning'
                );
            } else {
                const isOk = data.status === 'SUCCESS';
                if (stdoutPre) {
                    stdoutPre.textContent = data.stdout ? data.stdout : (data.stderr ? data.stderr : '(No output)');
                    stdoutPre.style.color = isOk ? '#E2E8F0' : '#F87171';
                }
                if (diagPre) {
                    diagPre.textContent = data.stderr
                        ? `[${data.status}]\n${data.stderr}`
                        : `Completed cleanly in ${data.executionTimeMs || 0} ms (exit code ${data.exitCode ?? 0}).`;
                    diagPre.style.color = isOk ? '#34D399' : '#F87171';
                }
                switchTab('output');
                showToast(isOk ? 'Execution completed' : `Execution status: ${data.status}`, isOk ? 'success' : 'warning');
            }
        } catch (err) {
            console.error('[BasicWorkspace] Run failed:', err);
            if (diagPre) { diagPre.textContent = (err && err.message) || 'Network error while running code.'; diagPre.style.color = '#F87171'; }
            switchTab('diagnostics');
            showToast('Failed to contact server', 'error');
        } finally {
            isRunning = false;
            if (runBtn) runBtn.disabled = false;
            if (submitBtn) submitBtn.disabled = false;
        }
    }

    async function submitSolutionLive() {
        if (isRunning || !currentProblem) return;
        const code = getEditorCode();
        const testCasesDiv = document.getElementById('basicTestCasesContainer');
        const diagPre = document.getElementById('basicDiagnosticsPre');

        if (!code || !code.trim()) {
            showToast('Cannot submit empty source code', 'warning');
            return;
        }
        if (!(await ensureAuthenticatedForAction('submit solutions'))) return;

        isRunning = true;
        const runBtn = document.getElementById('btnRunBasicCode');
        const submitBtn = document.getElementById('btnSubmitBasicSolution');
        const stdoutPre = document.getElementById('basicStdoutPre');
        if (runBtn) runBtn.disabled = true;
        if (submitBtn) submitBtn.disabled = true;

        // Clear stale sample outputs so they do not masquerade as submission results
        if (stdoutPre) {
            stdoutPre.textContent = 'Evaluating solution against complete judge suite (all test cases in OpenJDK 17 sandbox)...';
            stdoutPre.style.color = '#94A3B8';
        }
        if (diagPre) {
            diagPre.textContent = 'Submitting solution to judge server...\nEvaluating in isolated OpenJDK 17 container against test suite...';
            diagPre.style.color = '#94A3B8';
        }
        switchTab('diagnostics');

        try {
            const res = await window.CodeArenaAPI.submissionService.submitSolution({
                problemId: currentProblem.id,
                problemSlug: currentProblem.slug,
                sourceCode: code,
                language: 'java'
            });

            if (res && (res.status === 401 || res.status === 403)) {
                showToast('Please log in to submit.', 'warning');
                if (window.CodeArenaAuthModal) window.CodeArenaAuthModal.open('login');
                return;
            }
            if (!res || !res.success || !res.data) {
                const msg = (res && res.message) || 'Submission failed.';
                if (diagPre) { diagPre.textContent = msg; diagPre.style.color = '#F87171'; }
                showToast(msg, 'error');
                return;
            }

            let sub = await pollBasicSubmissionUntilTerminal(res.data.id, currentProblem.id);
            if (!sub) sub = res.data;

            const verdict = String(sub.verdict || sub.status || 'UNKNOWN').toUpperCase();
            const isAccepted = verdict === 'ACCEPTED';

            if (isAccepted) {
                currentProblem.status = 'solved';
                updateStatusBadge('solved');
                updateBasicAnimationUnlockState(true, currentProblem.id);
            } else if (currentProblem.status === 'unattempted') {
                currentProblem.status = 'attempted';
                updateStatusBadge('attempted');
            }

            if (Array.isArray(sub.testCaseResults) && sub.testCaseResults.length > 0) {
                renderTestCases(sub.testCaseResults, testCasesDiv);
            }

            if (diagPre) {
                const summary = [
                    `Verdict: ${verdict.replace(/_/g, ' ')}`,
                    sub.testCasesTotal ? `Test Cases Passed: ${sub.testCasesPassed || 0}/${sub.testCasesTotal}` : '',
                    sub.executionTime ? `Runtime: ${sub.executionTime} ms` : '',
                    sub.compilerOutput ? `\nCompiler Output:\n${sub.compilerOutput}` : '',
                    sub.runtimeErrorLog ? `\nRuntime Log:\n${sub.runtimeErrorLog}` : ''
                ].filter(Boolean).join('\n');
                diagPre.textContent = summary;
                diagPre.style.color = isAccepted ? '#34D399' : '#F87171';
            }

            await loadBasicSubmissions(currentProblem.id);
            switchTab(Array.isArray(sub.testCaseResults) && sub.testCaseResults.length > 0 ? 'testcases' : 'diagnostics');
            showToast(`Submission Verdict: ${verdict.replace(/_/g, ' ')} (${sub.testCasesPassed || 0}/${sub.testCasesTotal || 0} passed)`, isAccepted ? 'success' : 'error');
        } catch (err) {
            console.error('[BasicWorkspace] Submit failed:', err);
            if (diagPre) { diagPre.textContent = (err && err.message) || 'Submission error.'; diagPre.style.color = '#F87171'; }
            showToast('Submission request failed', 'error');
        } finally {
            isRunning = false;
            if (runBtn) runBtn.disabled = false;
            if (submitBtn) submitBtn.disabled = false;
        }
    }

    function renderTestCases(results, container) {
        if (!container) return;
        if (!results || results.length === 0) {
            container.innerHTML = '<p style="color: #94A3B8;">No test case details available.</p>';
            return;
        }

        let html = '<div style="display: flex; flex-direction: column; gap: 12px;">';
        results.forEach((r, idx) => {
            const passed = Boolean(r.passed);
            const caseNum = r.caseNumber || r.caseIndex || (idx + 1);
            const statusText = passed ? 'Passed' : String(r.status || 'Failed').replace(/_/g, ' ');
            const badgeColor = passed ? '#34D399' : '#F87171';
            const badgeBg = passed ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.14)';
            const isHidden = Boolean(r.hidden);
            html += `
                <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 10px 14px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                        <span style="font-weight: 700; font-size: 0.82rem; color: #F1F5F9;">${isHidden ? `Hidden Case ${caseNum}` : `Sample Case ${caseNum}`}</span>
                        <span style="font-size: 0.76rem; font-weight: 700; color: ${badgeColor}; background: ${badgeBg}; padding: 2px 8px; border-radius: 4px;">${escapeHtml(statusText)}</span>
                    </div>
                    ${!isHidden ? `
                        <div style="font-size: 0.8rem; color: #94A3B8; margin-bottom: 2px;">Input: <code style="color: #E2E8F0;">${escapeHtml(r.input || '(empty)')}</code></div>
                        <div style="font-size: 0.8rem; color: #94A3B8; margin-bottom: 2px;">Expected: <code style="color: #E2E8F0;">${escapeHtml(r.expectedOutput || '')}</code></div>
                        ${r.actualOutput !== undefined ? `<div style="font-size: 0.8rem; color: #94A3B8;">Actual: <code style="color: ${passed ? '#34D399' : '#F87171'};">${escapeHtml(r.actualOutput || '')}</code></div>` : ''}
                    ` : `<div style="font-size: 0.78rem; color: #94A3B8;">Hidden test case details remain protected on the server.</div>`}
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

