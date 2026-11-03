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
        'merge k sorted lists': 'merge-k-sorted-lists'
    };

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
