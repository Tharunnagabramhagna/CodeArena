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
        authenticated: false,
        analytics: null,
        catalogStats: null
    };

    // DOM Elements Cache
    let dom = {};

    async function init() {
        cacheElements();
        await loadData();
        renderAnalytics();
        document.addEventListener('codearena:auth-changed', async function () {
            await loadData();
            renderAnalytics();
        });
    }

    function cacheElements() {
        dom = {
            statusPill: document.getElementById('progressStatusPill'),
            heroDesc: document.getElementById('progressHeroDesc'),
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

    async function loadData() {
        state.authenticated = false;
        state.analytics = null;

        if (!window.CodeArenaAPI) return;

        try {
            if (window.CodeArenaAPI.authService) {
                if (!window.CodeArenaAPI.authService.isAuthenticated()) {
                    await window.CodeArenaAPI.authService.getCurrentUser().catch(() => null);
                }
                state.authenticated = window.CodeArenaAPI.authService.isAuthenticated();
            }

            if (state.authenticated && window.CodeArenaAPI.studentService) {
                const aRes = await window.CodeArenaAPI.studentService.getAnalytics();
                if (aRes && aRes.success && aRes.data) {
                    state.analytics = aRes.data;
                }
            } else if (window.CodeArenaAPI.problemService && window.CodeArenaAPI.problemService.getStats) {
                const sRes = await window.CodeArenaAPI.problemService.getStats();
                if (sRes && sRes.success && sRes.data) {
                    state.catalogStats = sRes.data;
                }
            }
        } catch (err) {
            console.warn('[Progress] Error loading analytics:', err);
        }
    }

    function renderAnalytics() {
        const data = state.analytics;
        if (!state.authenticated || !data) {
            if (dom.statusPill) dom.statusPill.textContent = 'Sign In for Personal Metrics';
            if (dom.heroDesc) dom.heroDesc.textContent = 'Log in to track solved problems, difficulty breakdowns, topic mastery, and your 64-day activity heatmap.';
            const totalProbs = (state.catalogStats && state.catalogStats.totalProblems) || 250;
            if (dom.totalSolvedVal) dom.totalSolvedVal.textContent = '0';
            if (dom.completionRateVal) dom.completionRateVal.textContent = '0%';
            if (dom.currentStreakVal) dom.currentStreakVal.textContent = '0 Days';

            if (dom.easyBarFill) dom.easyBarFill.style.width = '0%';
            if (dom.easyBarText) dom.easyBarText.textContent = '0 / 0 (0%)';
            if (dom.medBarFill) dom.medBarFill.style.width = '0%';
            if (dom.medBarText) dom.medBarText.textContent = '0 / 0 (0%)';
            if (dom.hardBarFill) dom.hardBarFill.style.width = '0%';
            if (dom.hardBarText) dom.hardBarText.textContent = '0 / 0 (0%)';

            renderTopicMastery([]);
            renderActivityHeatmap([]);
            renderRecentActivity([], false, totalProbs);
            return;
        }

        if (dom.statusPill) dom.statusPill.textContent = 'Verified Account Analytics';
        if (dom.heroDesc) dom.heroDesc.textContent = 'Metrics reflect your verified CodeArena judging history across all tracks.';

        const totalSolved = Number(data.totalSolved || 0);
        const totalProbs = Number(data.totalProblems || 250);
        const completionRate = totalProbs > 0 ? Math.round((totalSolved / totalProbs) * 100) : 0;
        const streakDays = Number(data.streakDays || 0);

        if (dom.totalSolvedVal) dom.totalSolvedVal.textContent = String(totalSolved);
        if (dom.completionRateVal) dom.completionRateVal.textContent = `${completionRate}%`;
        if (dom.currentStreakVal) dom.currentStreakVal.textContent = `${streakDays} ${streakDays === 1 ? 'Day' : 'Days'}`;

        const easySolved = Number(data.easySolved || 0);
        const medSolved = Number(data.mediumSolved || 0);
        const hardSolved = Number(data.hardSolved || 0);
        const totalEasy = Number(data.totalEasy || 0);
        const totalMed = Number(data.totalMedium || 0);
        const totalHard = Number(data.totalHard || 0);

        const easyPct = totalEasy > 0 ? Math.round((easySolved / totalEasy) * 100) : 0;
        const medPct = totalMed > 0 ? Math.round((medSolved / totalMed) * 100) : 0;
        const hardPct = totalHard > 0 ? Math.round((hardSolved / totalHard) * 100) : 0;

        if (dom.easyBarFill) dom.easyBarFill.style.width = `${easyPct}%`;
        if (dom.easyBarText) dom.easyBarText.textContent = `${easySolved} / ${totalEasy} (${easyPct}%)`;

        if (dom.medBarFill) dom.medBarFill.style.width = `${medPct}%`;
        if (dom.medBarText) dom.medBarText.textContent = `${medSolved} / ${totalMed} (${medPct}%)`;

        if (dom.hardBarFill) dom.hardBarFill.style.width = `${hardPct}%`;
        if (dom.hardBarText) dom.hardBarText.textContent = `${hardSolved} / ${totalHard} (${hardPct}%)`;

        renderTopicMastery(Array.isArray(data.topicBreakdown) ? data.topicBreakdown : []);
        renderActivityHeatmap(Array.isArray(data.heatmap) ? data.heatmap : []);
        renderRecentActivity(Array.isArray(data.recentActivity) ? data.recentActivity : [], true, totalProbs);
    }

    function renderTopicMastery(topicBreakdown) {
        if (!dom.topicBarsContainer) return;

        if (!topicBreakdown || topicBreakdown.length === 0) {
            dom.topicBarsContainer.innerHTML = `
                <div style="padding: 16px; text-align: center; color: var(--color-text-muted); font-size: 0.84rem;">
                    ${state.authenticated ? 'No topic mastery data recorded yet.' : 'Log in to view your per-topic problem mastery breakdown.'}
                </div>
            `;
            return;
        }

        dom.topicBarsContainer.innerHTML = topicBreakdown.slice(0, 10).map(t => {
            const name = t.topic || t.name || 'Core Java';
            const completed = Number(t.solved || 0);
            const total = Number(t.total || 0);
            const pct = Number(t.percent !== undefined ? t.percent : (total > 0 ? Math.round((completed / total) * 100) : 0));
            return `
                <div class="progress-bar-wrap">
                    <div class="bar-meta">
                        <span style="color: var(--color-text-primary); font-weight: 500;">${escapeHtml(name)}</span>
                        <span style="color: var(--color-text-muted); font-size: 0.76rem;">${completed}/${total} (${pct}%)</span>
                    </div>
                    <div class="bar-track">
                        <div class="bar-fill primary" style="width: ${pct}%;"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderActivityHeatmap(heatmap) {
        if (!dom.heatmapGrid) return;

        if (!heatmap || heatmap.length === 0) {
            const cells = [];
            for (let i = 0; i < 64; i++) {
                cells.push(`<div class="heatmap-cell" title="No submissions recorded" aria-label="No activity"></div>`);
            }
            dom.heatmapGrid.innerHTML = cells.join('');
            return;
        }

        dom.heatmapGrid.innerHTML = heatmap.map(cell => {
            const level = Number(cell.level || 0);
            const count = Number(cell.count || 0);
            const dateStr = cell.date || '';
            return `<div class="heatmap-cell ${level > 0 ? 'level-' + Math.min(3, level) : ''}" title="${escapeHtml(dateStr)}: ${count} submission${count === 1 ? '' : 's'}" aria-label="${escapeHtml(dateStr)}: ${count} submissions"></div>`;
        }).join('');
    }

    function renderRecentActivity(items, isAuthed) {
        if (!dom.recentActivityList) return;

        if (!isAuthed) {
            dom.recentActivityList.innerHTML = `
                <div style="padding: 16px; text-align: center; color: var(--color-text-muted); font-size: 0.84rem;">
                    Log in to inspect your real submission timeline and verified progress.
                    <div style="margin-top: 10px;">
                        <a href="login.html?redirect=progress.html" class="prob-btn-solve" style="font-size: 0.78rem; padding: 6px 12px;">Log In →</a>
                    </div>
                </div>
            `;
            return;
        }

        if (!items || items.length === 0) {
            dom.recentActivityList.innerHTML = `
                <div style="padding: 16px; text-align: center; color: var(--color-text-muted); font-size: 0.84rem;">
                    No submissions recorded on your account yet.
                    <div style="margin-top: 8px;">
                        <a href="problems.html" class="prob-btn-solve" style="font-size: 0.78rem; padding: 4px 10px;">Solve First Challenge</a>
                    </div>
                </div>
            `;
            return;
        }

        dom.recentActivityList.innerHTML = items.slice(0, 6).map(sub => {
            const verdict = String(sub.verdict || sub.status || 'PENDING').toUpperCase();
            const isAccepted = verdict === 'ACCEPTED';
            const targetUrl = sub.track === 'basic'
                ? `basic-problem.html?id=${encodeURIComponent(sub.problemSlug || sub.problemId)}`
                : `problem.html?id=${encodeURIComponent(sub.problemSlug || sub.problemId)}`;
            const timeLabel = sub.submittedAt ? new Date(sub.submittedAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent';
            return `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--color-border); font-size: 0.82rem;">
                    <div>
                        <a href="${targetUrl}" style="color: var(--color-text-primary); font-weight: 600; text-decoration: none;">
                            ${escapeHtml(sub.problemTitle || ('Problem #' + sub.problemId))}
                        </a>
                        <div style="font-size: 0.74rem; color: var(--color-text-muted); margin-top: 2px;">
                            ${escapeHtml(timeLabel)}${sub.executionTimeMs ? ` · ${sub.executionTimeMs} ms` : ''}
                        </div>
                    </div>
                    <span class="verdict-tag ${isAccepted ? 'passed' : 'failed'}">
                        ${escapeHtml(verdict.replace(/_/g, ' '))}
                    </span>
                </div>
            `;
        }).join('');
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
