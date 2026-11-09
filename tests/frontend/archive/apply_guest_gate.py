# apply_guest_gate.py

with open('frontend/js/workspace.js', 'r', encoding='utf-8') as f:
    w_js = f.read()

# Add to cacheDom
old_cache = """            shortcutsModalOverlay: document.getElementById('shortcutsModalOverlay'),
            btnCloseShortcuts: document.getElementById('btnCloseShortcuts'),"""

new_cache = """            shortcutsModalOverlay: document.getElementById('shortcutsModalOverlay'),
            btnCloseShortcuts: document.getElementById('btnCloseShortcuts'),
            guestAuthModalOverlay: document.getElementById('guestAuthModalOverlay'),
            btnGuestCancel: document.getElementById('btnGuestCancel'),
            guestAuthModalDesc: document.getElementById('guestAuthModalDesc'),"""

assert old_cache in w_js, "old_cache not found in workspace.js"
w_js = w_js.replace(old_cache, new_cache)

# Add guest auth functions before runSampleTests
guest_funcs = '''    /**
     * Checks if the active user is a guest (unauthenticated).
     * In this frontend phase, real authentication connects in Phase 5.
     */
    function isGuestUser() {
        if (typeof window !== 'undefined' && window.__BYPASS_GUEST_GATE__) return false;
        try {
            const user = localStorage.getItem('codearena_auth_user') || sessionStorage.getItem('codearena_auth_user');
            if (user) {
                const parsed = JSON.parse(user);
                if (parsed && (parsed.token || parsed.isLoggedIn)) return false;
            }
        } catch (e) {}
        return true;
    }

    /**
     * Displays the authentication required gate prompt for practice tests/submissions.
     */
    function showGuestAuthPrompt(action) {
        if (!dom.guestAuthModalOverlay) return;
        if (dom.guestAuthModalDesc) {
            const verb = action === 'submit' ? 'submit practice solutions' : 'run sample tests';
            dom.guestAuthModalDesc.textContent = `Logging in is required to ${verb}. Sign in to your CodeArena account to execute Java code against practice test cases.`;
        }
        dom.guestAuthModalOverlay.style.display = 'flex';
        if (dom.btnGuestCancel) dom.btnGuestCancel.focus();
    }

    /**
     * Closes the guest authentication gate modal.
     */
    function hideGuestAuthPrompt() {
        if (dom.guestAuthModalOverlay) {
            dom.guestAuthModalOverlay.style.display = 'none';
        }
    }
'''

new_run = '''    async function runSampleTests() {
        if (isEvaluating) return;

        // Guest Access Restriction: Require login to execute practice solutions
        if (isGuestUser()) {
            showGuestAuthPrompt('run');
            return;
        }'''

assert '    async function runSampleTests() {\n        if (isEvaluating) return;' in w_js
w_js = w_js.replace('    async function runSampleTests() {\n        if (isEvaluating) return;', guest_funcs + '\n' + new_run)

# Add to handleSubmitSolution
target_submit = '    async function handleSubmitSolution() {\n        if (isEvaluating) return;'
assert target_submit in w_js, "target_submit not found in workspace.js"

new_submit = '''    async function handleSubmitSolution() {
        if (isEvaluating) return;

        // Guest Access Restriction: Require login to submit practice solutions
        if (isGuestUser()) {
            showGuestAuthPrompt('submit');
            return;
        }'''

w_js = w_js.replace(target_submit, new_submit)

# Bind modal dismissal events
old_bind_modal = """        if (dom.btnCloseShortcuts && dom.shortcutsModalOverlay) {
            dom.btnCloseShortcuts.addEventListener('click', function () {
                dom.shortcutsModalOverlay.classList.remove('active');
            });
        }"""

new_bind_modal = """        if (dom.btnCloseShortcuts && dom.shortcutsModalOverlay) {
            dom.btnCloseShortcuts.addEventListener('click', function () {
                dom.shortcutsModalOverlay.classList.remove('active');
            });
        }

        if (dom.btnGuestCancel) {
            dom.btnGuestCancel.addEventListener('click', function () {
                hideGuestAuthPrompt();
            });
        }

        if (dom.guestAuthModalOverlay) {
            dom.guestAuthModalOverlay.addEventListener('click', function (e) {
                if (e.target === dom.guestAuthModalOverlay) {
                    hideGuestAuthPrompt();
                }
            });
        }"""

assert old_bind_modal in w_js, "old_bind_modal not found in workspace.js"
w_js = w_js.replace(old_bind_modal, new_bind_modal)

# Bind Escape key
old_esc = """        // Esc closes open modals
        if (e.key === 'Escape') {
            if (dom.resetModalOverlay && dom.resetModalOverlay.classList.contains('active')) {
                dom.resetModalOverlay.classList.remove('active');
                return;
            }
            if (dom.shortcutsModalOverlay && dom.shortcutsModalOverlay.classList.contains('active')) {
                dom.shortcutsModalOverlay.classList.remove('active');
                return;
            }
        }"""

new_esc = """        // Esc closes open modals
        if (e.key === 'Escape') {
            if (dom.guestAuthModalOverlay && dom.guestAuthModalOverlay.style.display === 'flex') {
                hideGuestAuthPrompt();
                return;
            }
            if (dom.resetModalOverlay && dom.resetModalOverlay.classList.contains('active')) {
                dom.resetModalOverlay.classList.remove('active');
                return;
            }
            if (dom.shortcutsModalOverlay && dom.shortcutsModalOverlay.classList.contains('active')) {
                dom.shortcutsModalOverlay.classList.remove('active');
                return;
            }
        }"""

assert old_esc in w_js, "old_esc not found in workspace.js"
w_js = w_js.replace(old_esc, new_esc)

# Expose helpers in workspaceController
old_expose = "        getCurrentTheme: getCurrentThemeName,"
new_expose = """        getCurrentTheme: getCurrentThemeName,
        isGuestUser: isGuestUser,
        showGuestAuthPrompt: showGuestAuthPrompt,
        hideGuestAuthPrompt: hideGuestAuthPrompt,"""

assert old_expose in w_js, "old_expose not found in workspace.js"
w_js = w_js.replace(old_expose, new_expose)

with open('frontend/js/workspace.js', 'w', encoding='utf-8') as f:
    f.write(w_js)
print("workspace.js updated successfully with guest gate restrictions and modal dismissal")
