/**
 * CodeArena — Learning Progress Analytics Controller (progress.js)
 * Manages problem-solving analytics, difficulty distribution bars,
 * topic mastery breakdown, and coding activity heatmaps.
 * All metrics are derived from current session interactions and sample baselines.
 */

(function () {
    'use strict';

    // State
    const state = {
        submissions: [],
        canonicalProblems: [],
        stats: {
            totalSolved: 0,
            easySolved: 0,
            medSolved: 0,
            hardSolved: 0,
            totalEasy: 6,
            totalMed: 4,
            totalHard: 2,
            streakDays: 3,
            completionRate: 0
        }
    };

    // DOM Elements Cache
    let dom = {};

    function init() {
        cacheElements();
        loadData();
        calculateMetrics();
        renderAnalytics();
    }

    function cacheElements() {
        dom = {
            totalSolvedVal: document.getElementById('metricTotalSolved'),
            completionRateVal: document.getElementById('metricCompletionRate'),
            currentStreakVal: document.getElementById('metricCurrentStreak'),
            easyBarFill: document.getElementById('barFillEasy'),
            easyBarText: document.getElementById('barTextEasy'),
            medBarFill: document.getElementById('barFillMedium'),
            medBarText: document.getElementById('barTextMedium'),
            hardBarFill: document.getElementById('barFillHard'),
            hardBarText: document.getElementById('barTextHard'),
            topicBarsContainer: document.getElementById('topicMasteryContainer'),
            heatmapGrid: document.getElementById('activityHeatmapGrid'),
            recentActivityList: document.getElementById('recentActivityList')
        };
    }

    function loadData() {
        try {
            const raw = sessionStorage.getItem('codearena_guest_preview_submissions');
            if (raw) {
                state.submissions = JSON.parse(raw);
            }
        } catch (e) {
            state.submissions = [];
        }

        if (window.CodeArenaAPI && window.CodeArenaAPI.problemService) {
            window.CodeArenaAPI.problemService.getProblems({ limit: 100 }).then(res => {
                if (res && res.success && res.data && res.data.problems) {
                    state.canonicalProblems = res.data.problems;
                    calculateMetrics();
                    renderAnalytics();
                }
            }).catch(() => {});
        }
    }

    function calculateMetrics() {
        // Collect solved problem IDs from successful session submissions
        const solvedIds = new Set();
        state.submissions.forEach(sub => {
            if (sub.verdict === 'PREVIEW_PASSED' || sub.verdict === 'ACCEPTED') {
                solvedIds.add(sub.problemId);
            }
        });

        // Only genuinely solved session submissions are counted

        state.stats.totalSolved = solvedIds.size;

        // Categorize by difficulty
        let easy = 0, med = 0, hard = 0;
        let totalEasy = 0, totalMed = 0, totalHard = 0;

        state.canonicalProblems.forEach(p => {
            const diff = (p.difficulty || '').toLowerCase();
            if (diff === 'easy') totalEasy++;
            else if (diff === 'medium') totalMed++;
            else if (diff === 'hard') totalHard++;

            if (solvedIds.has(p.id) || solvedIds.has(p.slug)) {
                if (diff === 'easy') easy++;
                else if (diff === 'medium') med++;
                else if (diff === 'hard') hard++;
            }
        });

        state.stats.easySolved = easy;
        state.stats.medSolved = med;
        state.stats.hardSolved = hard;
        state.stats.totalEasy = Math.max(totalEasy, 6);
        state.stats.totalMed = Math.max(totalMed, 4);
        state.stats.totalHard = Math.max(totalHard, 2);

        const totalProbs = state.canonicalProblems.length || 12;
        state.stats.completionRate = Math.round((state.stats.totalSolved / totalProbs) * 100);
    }

    function renderAnalytics() {
        if (dom.totalSolvedVal) dom.totalSolvedVal.textContent = state.stats.totalSolved;
        if (dom.completionRateVal) dom.completionRateVal.textContent = `${state.stats.completionRate}%`;
        if (dom.currentStreakVal) {
            dom.currentStreakVal.textContent = state.stats.totalSolved > 0 ? `${state.stats.streakDays} Days` : '0 Days';
        }

        // Render Difficulty Bars
        const easyPct = Math.round((state.stats.easySolved / state.stats.totalEasy) * 100);
        const medPct = Math.round((state.stats.medSolved / state.stats.totalMed) * 100);
        const hardPct = Math.round((state.stats.hardSolved / state.stats.totalHard) * 100);

        if (dom.easyBarFill) dom.easyBarFill.style.width = `${easyPct}%`;
        if (dom.easyBarText) dom.easyBarText.textContent = `${state.stats.easySolved} / ${state.stats.totalEasy} (${easyPct}%)`;

        if (dom.medBarFill) dom.medBarFill.style.width = `${medPct}%`;
        if (dom.medBarText) dom.medBarText.textContent = `${state.stats.medSolved} / ${state.stats.totalMed} (${medPct}%)`;

        if (dom.hardBarFill) dom.hardBarFill.style.width = `${hardPct}%`;
        if (dom.hardBarText) dom.hardBarText.textContent = `${state.stats.hardSolved} / ${state.stats.totalHard} (${hardPct}%)`;

        renderTopicMastery();
        renderActivityHeatmap();
        renderRecentActivity();
    }

    function renderTopicMastery() {
        if (!dom.topicBarsContainer) return;

        const topicBreakdown = [
            { name: 'Arrays & Hashing', completed: 1, total: 3, pct: 33 },
            { name: 'Strings', completed: 0, total: 2, pct: 0 },
            { name: 'Linked Lists', completed: 0, total: 2, pct: 0 },
            { name: 'Binary Search', completed: 0, total: 2, pct: 0 },
            { name: 'Dynamic Programming', completed: 0, total: 2, pct: 0 },
            { name: 'Trees & Graphs', completed: 0, total: 1, pct: 0 }
        ];

        dom.topicBarsContainer.innerHTML = topicBreakdown.map(t => `
            <div class="progress-bar-wrap">
                <div class="bar-meta">
                    <span style="color: var(--color-text-primary); font-weight: 500;">${t.name}</span>
                    <span style="color: var(--color-text-muted); font-size: 0.76rem;">${t.completed}/${t.total} (${t.pct}%)</span>
                </div>
                <div class="bar-track">
                    <div class="bar-fill primary" style="width: ${t.pct}%;"></div>
                </div>
            </div>
        `).join('');
    }

    function renderActivityHeatmap() {
        if (!dom.heatmapGrid) return;

        // Generate 64 cells representing past 8-9 weeks of daily activity
        const cells = [];
        for (let i = 0; i < 64; i++) {
            let level = 0;
            // Seed a few active days in recent weeks
            if (i === 63 || i === 62 || i === 60 || i === 54 || i === 48 || i === 35 || i === 22) {
                level = (i % 3) + 1;
            }
            cells.push(`<div class="heatmap-cell ${level > 0 ? 'level-' + level : ''}" title="Day ${64 - i}: ${level * 2} challenges practiced" aria-label="Day activity level ${level}"></div>`);
        }
        dom.heatmapGrid.innerHTML = cells.join('');
    }

    function renderRecentActivity() {
        if (!dom.recentActivityList) return;

        if (state.submissions.length === 0) {
            dom.recentActivityList.innerHTML = `
                <div style="padding: 16px; text-align: center; color: var(--color-text-muted); font-size: 0.84rem;">
                    No recent problem submissions recorded in this session.
                    <div style="margin-top: 8px;">
                        <a href="problems.html" class="prob-btn-solve" style="font-size: 0.78rem; padding: 4px 10px;">Solve First Challenge</a>
                    </div>
                </div>
            `;
            return;
        }

        dom.recentActivityList.innerHTML = state.submissions.slice(0, 5).map(sub => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--color-border); font-size: 0.82rem;">
                <div>
                    <a href="problem.html?id=${encodeURIComponent(sub.problemId)}" style="color: var(--color-text-primary); font-weight: 600; text-decoration: none;">
                        ${escapeHtml(sub.problemTitle || sub.problemId)}
                    </a>
                    <div style="font-size: 0.74rem; color: var(--color-text-muted); margin-top: 2px;">
                        ${escapeHtml(sub.submittedAt ? new Date(sub.submittedAt).toLocaleTimeString() : 'Just now')} · Java 17
                    </div>
                </div>
                <span class="verdict-tag ${sub.verdict === 'PREVIEW_PASSED' ? 'passed' : 'failed'}">
                    ${escapeHtml(sub.verdict || 'PREVIEW_PASSED')}
                </span>
            </div>
        `).join('');
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
