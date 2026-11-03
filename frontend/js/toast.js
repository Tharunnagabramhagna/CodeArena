/**
 * CodeArena — Unified Toast Notification System (toast.js)
 * Provides accessible, lightweight toast notifications across all CodeArena pages.
 * Fully accessible with ARIA live regions and keyboard dismiss.
 */
(function () {
    'use strict';

    let container = null;

    function getContainer() {
        if (!container) {
            container = document.getElementById('codearenaToastContainer');
            if (!container) {
                container = document.createElement('div');
                container.id = 'codearenaToastContainer';
                container.className = 'codearena-toast-container';
                container.setAttribute('role', 'region');
                container.setAttribute('aria-label', 'Notifications');
                document.body.appendChild(container);
            }
        }
        return container;
    }

    function show(message, type = 'info', duration = 3000) {
        if (!message) return;
        const parent = getContainer();

        const toast = document.createElement('div');
        toast.className = `codearena-toast toast-${type}`;
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');

        // SVG icon based on type
        let iconSvg = '';
        if (type === 'success') {
            iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';
        } else if (type === 'error') {
            iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
        } else if (type === 'warning') {
            iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
        } else {
            iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
        }

        toast.innerHTML = `
            <span class="toast-icon">${iconSvg}</span>
            <span class="toast-message">${escapeHtml(message)}</span>
            <button type="button" class="toast-close-btn" aria-label="Dismiss notification">&times;</button>
        `;

        const closeBtn = toast.querySelector('.toast-close-btn');
        let timer = null;

        function dismiss() {
            clearTimeout(timer);
            toast.classList.remove('show');
            toast.classList.add('hide');
            setTimeout(function () {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 250);
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', dismiss);
        }

        parent.appendChild(toast);
        // Force reflow
        void toast.offsetWidth;
        toast.classList.add('show');

        if (duration > 0) {
            timer = setTimeout(dismiss, duration);
        }

        return dismiss;
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

    window.CodeArenaToast = {
        show: show,
        success: function (msg, dur) { return show(msg, 'success', dur); },
        error: function (msg, dur) { return show(msg, 'error', dur); },
        warning: function (msg, dur) { return show(msg, 'warning', dur); },
        info: function (msg, dur) { return show(msg, 'info', dur); }
    };
})();
