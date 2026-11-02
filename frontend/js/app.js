// app.js — CodeArena Public Homepage Interactions

document.addEventListener('DOMContentLoaded', function () {
    // Problem card click-through to problems page
    const problemCards = document.querySelectorAll('.problem-card');

    problemCards.forEach(function (card) {
        // Enhance accessibility for interactive cards
        const titleElement = card.querySelector('.problem-title');
        const titleText = titleElement ? titleElement.textContent.trim() : 'problem';

        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'link');
        card.setAttribute('aria-label', 'View challenge: ' + titleText);

        function navigateToProblems() {
            window.location.href = 'pages/dashboard.html';
        }

        card.addEventListener('click', navigateToProblems);

        // Keyboard navigation (Enter or Space key)
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigateToProblems();
            }
        });
    });
});

