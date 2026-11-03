/**
 * CodeArena — Submissions History Controller (submissions.js)
 * Manages guest preview submission history, filtering by problem and verdict,
 * code modal inspection, and workspace navigation.
 */

(function () {
    'use strict';

    // State
    const state = {
        submissions: [],
        canonicalProblems: [],
        selectedProblem: 'All',
        selectedVerdict: 'All',
        sortBy: 'newest'
    };

    // DOM Elements Cache
    let dom = {};

    function init() {
        cacheElements();
        bindEvents();
        loadData();
    }

    function cacheElements() {
        dom = {
            tableCard: document.getElementById('submissionsTableCard'),
            tableBody: document.getElementById('submissionsTableBody'),
            emptyState: document.getElementById('submissionsEmptyState'),
            problemSelect: document.getElementById('subProblemFilter'),
            verdictSelect: document.getElementById('subVerdictFilter'),
            sortSelect: document.getElementById('subSortSelect'),
            countBadge: document.getElementById('subCountBadge'),
            codeModalOverlay: document.getElementById('subCodeModalOverlay'),
            modalProblemTitle: document.getElementById('subModalProblemTitle'),
            modalVerdict: document.getElementById('subModalVerdict'),
            modalTime: document.getElementById('subModalTime'),
            modalCodeSnippet: document.getElementById('subModalCodeSnippet'),
            copyCodeBtn: document.getElementById('btnCopySubCode'),
            closeModalBtn: document.getElementById('btnCloseSubModal')
        };
    }

    function bindEvents() {
        if (dom.problemSelect) {
            dom.problemSelect.addEventListener('change', function (e) {
                state.selectedProblem = e.target.value;
                renderSubmissions();
            });
        }

        if (dom.verdictSelect) {
            dom.verdictSelect.addEventListener('change', function (e) {
                state.selectedVerdict = e.target.value;
                renderSubmissions();
            });
        }

        if (dom.sortSelect) {
            dom.sortSelect.addEventListener('change', function (e) {
                state.sortBy = e.target.value;
                renderSubmissions();
            });
        }

        if (dom.closeModalBtn) {
            dom.closeModalBtn.addEventListener('click', closeCodeModal);
        }

        if (dom.codeModalOverlay) {
            dom.codeModalOverlay.addEventListener('click', function (e) {
                if (e.target === dom.codeModalOverlay) closeCodeModal();
            });
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && dom.codeModalOverlay && dom.codeModalOverlay.style.display === 'flex') {
                closeCodeModal();
            }
        });
    }

    async function loadData() {
        // Load canonical problems for filter dropdown and titles
        try {
            if (window.CodeArenaAPI && window.CodeArenaAPI.problemService) {
                const pRes = await window.CodeArenaAPI.problemService.getProblems({ limit: 100 });
                if (pRes && pRes.success && pRes.data && pRes.data.problems) {
                    state.canonicalProblems = pRes.data.problems;
                    populateProblemDropdown();
                }
            }
        } catch (e) {
            console.warn('[Submissions] Error loading canonical problems:', e);
        }

        // Load submission records from submissionService
        try {
            if (window.CodeArenaAPI && window.CodeArenaAPI.submissionService) {
                const sRes = await window.CodeArenaAPI.submissionService.getSubmissions();
                if (sRes && sRes.success && sRes.data && Array.isArray(sRes.data.submissions)) {
                    state.submissions = sRes.data.submissions;
                }
            }
        } catch (e) {
            console.warn('[Submissions] Error loading submissions from service:', e);
        }

        // If session has no submissions yet, seed a demonstration record for Two Sum
        if (state.submissions.length === 0) {
            state.submissions = [{
                id: 'SUB-PREV-2026-001',
                problemId: 'two-sum',
                problemTitle: 'Two Sum',
                language: 'Java (OpenJDK 17)',
                verdict: 'PREVIEW_PASSED',
                passedCount: 2,
                totalCount: 2,
                submittedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
                sourceCode: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        java.util.Map<Integer, Integer> map = new java.util.HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) {\n                return new int[]{map.get(comp), i};\n            }\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}`
            }];
        }

        renderSubmissions();
    }

    function populateProblemDropdown() {
        if (!dom.problemSelect) return;
        const currentVal = dom.problemSelect.value;
        dom.problemSelect.innerHTML = `
            <option value="All">All Problems</option>
            ${state.canonicalProblems.map(p => `
                <option value="${escapeHtml(p.id)}">${escapeHtml(p.title)}</option>
            `).join('')}
        `;
        dom.problemSelect.value = currentVal || 'All';
    }

    function renderSubmissions() {
        if (!dom.tableBody) return;

        let filtered = state.submissions.filter(sub => {
            if (state.selectedProblem !== 'All' && sub.problemId !== state.selectedProblem) {
                return false;
            }
            if (state.selectedVerdict !== 'All' && sub.verdict !== state.selectedVerdict) {
                return false;
            }
            return true;
        });

        if (dom.countBadge) {
            dom.countBadge.textContent = `${filtered.length} ${filtered.length === 1 ? 'record' : 'records'}`;
        }

        // Apply sorting
        filtered.sort((a, b) => {
            const timeA = new Date(a.submittedAt || 0).getTime();
            const timeB = new Date(b.submittedAt || 0).getTime();
            return state.sortBy === 'newest' ? timeB - timeA : timeA - timeB;
        });

        if (filtered.length === 0) {
            if (dom.tableCard) dom.tableCard.style.display = 'none';
            if (dom.emptyState) dom.emptyState.style.display = 'block';
            return;
        }

        if (dom.tableCard) dom.tableCard.style.display = 'block';
        if (dom.emptyState) dom.emptyState.style.display = 'none';

        dom.tableBody.innerHTML = filtered.map(sub => {
            const dateStr = sub.submittedAt ? new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Recent';
            const isPassed = sub.verdict === 'PREVIEW_PASSED' || sub.verdict === 'ACCEPTED';
            const canonicalProb = state.canonicalProblems.find(p => p.id === sub.problemId || p.slug === sub.problemId);
            const title = sub.problemTitle || (canonicalProb ? canonicalProb.title : sub.problemId);

            return `
                <tr>
                    <td>
                        <span style="font-family: var(--font-family-mono); font-size: 0.78rem; color: var(--color-text-muted);">
                            ${escapeHtml(sub.id || 'SUB-001')}
                        </span>
                    </td>
                    <td>
                        <a href="problem.html?id=${encodeURIComponent(sub.problemId)}" style="color: var(--color-text-primary); font-weight: 600; text-decoration: none;">
                            ${escapeHtml(title)}
                        </a>
                    </td>
                    <td>
                        <span class="verdict-tag ${isPassed ? 'passed' : 'failed'}" title="Sample test preview verdict">
                            ${isPassed ? '✓ PREVIEW PASSED' : '✕ ' + escapeHtml(sub.verdict || 'ERROR')}
                        </span>
                        <div style="font-size: 0.72rem; color: var(--color-text-muted); margin-top: 2px;">
                            ${sub.passedCount || 2}/${sub.totalCount || 2} Sample Cases
                        </div>
                    </td>
                    <td>
                        <span style="font-size: 0.8rem; color: var(--color-text-secondary);">
                            ${escapeHtml(sub.language || 'Java 17')}
                        </span>
                    </td>
                    <td>
                        <span style="font-size: 0.8rem; color: var(--color-text-muted);">
                            ${escapeHtml(dateStr)}
                        </span>
                    </td>
                    <td style="text-align: right;">
                        <button type="button" class="secondary-header-btn btn-view-sub-code" data-id="${escapeHtml(sub.id)}" style="height: 28px; font-size: 0.76rem;">
                            View Code
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        // Bind code view buttons
        dom.tableBody.querySelectorAll('.btn-view-sub-code').forEach(btn => {
            btn.addEventListener('click', function () {
                const subId = this.getAttribute('data-id');
                const submission = state.submissions.find(s => s.id === subId);
                if (submission) openCodeModal(submission);
            });
        });
    }

    function openCodeModal(submission) {
        if (!dom.codeModalOverlay) return;

        const title = submission.problemTitle || submission.problemId;
        if (dom.modalProblemTitle) dom.modalProblemTitle.textContent = `${title} (${submission.id})`;
        if (dom.modalVerdict) {
            dom.modalVerdict.textContent = submission.verdict || 'PREVIEW_PASSED';
            dom.modalVerdict.className = 'verdict-tag ' + ((submission.verdict === 'PREVIEW_PASSED' || submission.verdict === 'ACCEPTED') ? 'passed' : 'failed');
        }
        if (dom.modalTime) dom.modalTime.textContent = submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'Just now';
        if (dom.modalCodeSnippet) dom.modalCodeSnippet.textContent = submission.sourceCode || '// No code recorded for this preview';

        if (dom.copyCodeBtn) {
            dom.copyCodeBtn.onclick = function () {
                if (submission.sourceCode) {
                    navigator.clipboard.writeText(submission.sourceCode).then(() => {
                        this.textContent = 'Copied!';
                        if (window.CodeArenaToast) {
                            window.CodeArenaToast.success('Submission source code copied to clipboard');
                        }
                        setTimeout(() => { this.textContent = 'Copy Code'; }, 1800);
                    }).catch(() => {
                        if (window.CodeArenaToast) {
                            window.CodeArenaToast.error('Failed to copy code to clipboard');
                        }
                    });
                }
            };
        }

        dom.codeModalOverlay.style.display = 'flex';
    }

    function closeCodeModal() {
        if (dom.codeModalOverlay) dom.codeModalOverlay.style.display = 'none';
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
