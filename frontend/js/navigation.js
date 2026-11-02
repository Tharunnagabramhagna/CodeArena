// navigation.js — CodeArena Mobile Navigation

document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (!menuBtn || !navLinks) return;

    function closeMenu() {
        navLinks.classList.remove('active');
        menuBtn.textContent = '☰';
        menuBtn.setAttribute('aria-expanded', 'false');
    }

    function openMenu() {
        navLinks.classList.add('active');
        menuBtn.textContent = '✕';
        menuBtn.setAttribute('aria-expanded', 'true');
    }

    menuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (navLinks.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close when a nav link is clicked
    navLinks.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', closeMenu);
    });

    // Close when clicking outside
    document.addEventListener('click', function(e) {
        if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
            closeMenu();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });
});
