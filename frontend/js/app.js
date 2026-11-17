// app.js — CodeArena Public Homepage Interactions

document.addEventListener('DOMContentLoaded', function () {
    // Problem card click-through to individual problem workspace or problem catalogue
    const problemCards = document.querySelectorAll('.problem-card');

    // Canonical problem IDs whitelist from CodeArena problemService
    const CANONICAL_PROBLEM_IDS = new Set([
        'two-sum',
        'reverse-a-string',
        'valid-parentheses',
        'merge-k-sorted-lists',
        'binary-search',
        'longest-common-subsequence',
        'palindrome-number',
        'maximum-subarray',
        'linked-list-cycle',
        'invert-binary-tree',
        'climbing-stairs',
        'longest-substring',
        'trapping-rain-water'
    ]);

    // Title to canonical ID mapping as a safe fallback
    const TITLE_TO_CANONICAL_ID = {
        'two sum': 'two-sum',
        'reverse a string': 'reverse-a-string',
        'valid parentheses': 'valid-parentheses',
        'binary search': 'binary-search',
        'merge k sorted lists': 'merge-k-sorted-lists',
        'longest common subsequence': 'longest-common-subsequence'
    };

    // Hydrate live landing stats & current session when API client is loaded
    if (window.CodeArenaAPI && window.CodeArenaAPI.problemService) {
        window.CodeArenaAPI.problemService.getStats().then(function (res) {
            if (res && res.success && res.data) {
                const pEl = document.getElementById('landingProblemsCount');
                const tEl = document.getElementById('landingTopicsCount');
                if (pEl && res.data.totalProblems) pEl.textContent = String(res.data.totalProblems);
                if (tEl && res.data.topicsCount) tEl.textContent = String(res.data.topicsCount);
            }
        }).catch(function () {});
    }

    // Synchronize Landing Page Navigation with Server-side Authenticated Session
    async function syncLandingAuthState() {
        const guestActions = document.getElementById('landingGuestActions');
        const userArea = document.getElementById('landingUserArea');
        const userAvatarEl = document.getElementById('landingUserAvatar');
        const userNameEl = document.getElementById('landingUserName');

        if (!guestActions || !userArea) return;

        try {
            if (!window.CodeArenaAPI || !window.CodeArenaAPI.authService || !window.CodeArenaAPI.authService.getCurrentUser) {
                guestActions.style.display = 'flex';
                userArea.style.display = 'none';
                userArea.setAttribute('aria-hidden', 'true');
                return;
            }

            const res = await window.CodeArenaAPI.authService.getCurrentUser();
            if (res && res.success && res.data) {
                const user = res.data;
                const displayName = user.name || user.fullName || user.username || (user.email ? user.email.split('@')[0] : 'Student');
                const initial = displayName.charAt(0).toUpperCase() || 'U';

                if (userNameEl) userNameEl.textContent = displayName;
                if (userAvatarEl) userAvatarEl.textContent = initial;

                guestActions.style.display = 'none';
                userArea.style.display = 'flex';
                userArea.setAttribute('aria-hidden', 'false');
            } else {
                guestActions.style.display = 'flex';
                userArea.style.display = 'none';
                userArea.setAttribute('aria-hidden', 'true');
            }
        } catch (e) {
            // Graceful fallback to unauthenticated state on network/server error
            guestActions.style.display = 'flex';
            userArea.style.display = 'none';
            userArea.setAttribute('aria-hidden', 'true');
        }
    }

    // Bind landing logout button
    const landingLogoutBtn = document.getElementById('landingLogoutBtn');
    if (landingLogoutBtn) {
        landingLogoutBtn.addEventListener('click', async function (e) {
            e.preventDefault();
            landingLogoutBtn.disabled = true;
            try {
                if (window.CodeArenaAPI && window.CodeArenaAPI.authService && window.CodeArenaAPI.authService.logout) {
                    await window.CodeArenaAPI.authService.logout();
                }
            } catch (err) {
            } finally {
                landingLogoutBtn.disabled = false;
                document.dispatchEvent(new CustomEvent('codearena:auth-changed', {
                    detail: { user: null, action: 'logout' }
                }));
                syncLandingAuthState();
            }
        });
    }

    // Run initial sync and subscribe to real-time auth changes
    syncLandingAuthState();
    document.addEventListener('codearena:auth-changed', syncLandingAuthState);
    window.addEventListener('pageshow', syncLandingAuthState);

    problemCards.forEach(function (card) {
        const titleElement = card.querySelector('.problem-title');
        const titleText = titleElement ? titleElement.textContent.trim() : 'problem';
        const titleKey = titleText.toLowerCase();

        // Determine problem ID from data attribute or title map
        let targetId = card.getAttribute('data-problem-id');
        if (!targetId && TITLE_TO_CANONICAL_ID[titleKey]) {
            targetId = TITLE_TO_CANONICAL_ID[titleKey];
        }

        // Validate targetId against canonical problem IDs
        const isValidProblem = targetId && CANONICAL_PROBLEM_IDS.has(targetId);

        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'link');
        card.setAttribute(
            'aria-label',
            isValidProblem ? 'Open challenge: ' + titleText : 'Browse challenges for: ' + titleText
        );

        function navigate() {
            if (isValidProblem) {
                window.location.href = 'pages/problem.html?id=' + encodeURIComponent(targetId);
            } else {
                window.location.href = 'pages/problems.html';
            }
        }

        card.addEventListener('click', navigate);

        // Keyboard navigation (Enter or Space key)
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate();
            }
        });
    });
});
