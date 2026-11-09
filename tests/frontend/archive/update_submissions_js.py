# tests/frontend/utils/update_submissions_js.py
import os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
SUB_JS = os.path.join(ROOT, "frontend", "js", "submissions.js")

with open(SUB_JS, "r", encoding="utf-8") as f:
    c = f.read().replace("\r\n", "\n")

# Update cacheElements
target_cache = """            countBadge: document.getElementById('subCountBadge'),
            codeModalOverlay: document.getElementById('subCodeModalOverlay'),"""

replacement_cache = """            countBadge: document.getElementById('subCountBadge'),
            heroSection: document.getElementById('submissionsHero'),
            authGate: document.getElementById('submissionsAuthGate'),
            controlsRow: document.querySelector('.feature-controls-row'),
            demoLoginBtn: document.getElementById('btnSubDemoLogin'),
            userPill: document.getElementById('subUserPill'),
            userAvatar: document.getElementById('subUserAvatar'),
            userName: document.getElementById('subUserName'),
            userPlanTag: document.getElementById('subUserPlanTag'),
            logoutBtn: document.getElementById('btnSubLogout'),
            sessionPill: document.getElementById('subSessionPill'),
            codeModalOverlay: document.getElementById('subCodeModalOverlay'),"""

assert target_cache in c, "Could not find target_cache in submissions.js"
c = c.replace(target_cache, replacement_cache, 1)

# Update init and loadData
target_init_load = """    function init() {
        cacheElements();
        bindEvents();
        loadData();
    }"""

replacement_init_load = """    function init() {
        cacheElements();
        bindEvents();
        checkAuthAndRender();
    }

    function checkAuthAndRender() {
        const isAuth = Boolean(
            window.CodeArenaAPI &&
            window.CodeArenaAPI.authService &&
            window.CodeArenaAPI.authService.isAuthenticated()
        );

        if (!isAuth) {
            // Guest mode: enforce authentication required gate
            if (dom.authGate) dom.authGate.style.display = 'block';
            if (dom.heroSection) dom.heroSection.style.display = 'none';
            if (dom.controlsRow) dom.controlsRow.style.display = 'none';
            if (dom.tableCard) dom.tableCard.style.display = 'none';
            if (dom.emptyState) dom.emptyState.style.display = 'none';
            if (dom.userPill) dom.userPill.style.display = 'none';
            return;
        }

        // Authenticated preview mode
        if (dom.authGate) dom.authGate.style.display = 'none';
        if (dom.heroSection) dom.heroSection.style.display = 'flex';
        if (dom.controlsRow) dom.controlsRow.style.display = 'block';

        // Render user session pill in header
        renderUserHeader();

        // Load submission records
        loadData();
    }

    async function renderUserHeader() {
        if (!dom.userPill) return;
        try {
            if (window.CodeArenaAPI && window.CodeArenaAPI.authService) {
                const res = await window.CodeArenaAPI.authService.getCurrentUser();
                const user = (res && res.data) || { name: 'Student', plan: 'free' };
                if (dom.userName) dom.userName.textContent = user.name || 'Student';
                if (dom.userAvatar) dom.userAvatar.textContent = (user.name || 'U').charAt(0).toUpperCase();
                if (dom.userPlanTag) {
                    const isPro = (user.plan === 'monthly' || user.plan === 'annual' || user.plan === 'pro');
                    dom.userPlanTag.textContent = isPro ? 'Pro Member' : 'Free Tier';
                    dom.userPlanTag.className = 'badge-plan-tag ' + (isPro ? 'plan-pro' : 'plan-free');
                }
                dom.userPill.style.display = 'inline-flex';
            }
        } catch (e) {
            dom.userPill.style.display = 'inline-flex';
        }

        if (dom.sessionPill) {
            dom.sessionPill.textContent = 'Authenticated Preview Session';
        }
    }"""

assert target_init_load in c, "Could not find target_init_load in submissions.js"
c = c.replace(target_init_load, replacement_init_load, 1)

# Remove seeded fake submission from loadData
target_seed = """        // If session has no submissions yet, seed a demonstration record for Two Sum
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
                sourceCode: `class Solution {\\n    public int[] twoSum(int[] nums, int target) {\\n        java.util.Map<Integer, Integer> map = new java.util.HashMap<>();\\n        for (int i = 0; i < nums.length; i++) {\\n            int comp = target - nums[i];\\n            if (map.containsKey(comp)) {\\n                return new int[]{map.get(comp), i};\\n            }\\n            map.put(nums[i], i);\\n        }\\n        return new int[]{};\\n    }\\n}`
            }];
        }"""

replacement_seed = """        // Honest session: zero submissions initially until user runs solutions in workspace"""

assert target_seed in c, "Could not find target_seed in submissions.js"
c = c.replace(target_seed, replacement_seed, 1)

# Add event listeners for demo login & logout
target_binds = """        if (dom.closeModalBtn) {
            dom.closeModalBtn.addEventListener('click', closeCodeModal);
        }"""

replacement_binds = """        if (dom.demoLoginBtn) {
            dom.demoLoginBtn.addEventListener('click', function () {
                if (window.CodeArenaAPI && window.CodeArenaAPI.authService) {
                    window.CodeArenaAPI.authService.demoLogin('free');
                    if (window.CodeArenaToast) {
                        window.CodeArenaToast.success('Logged in as Demo Student (Preview Session).');
                    }
                    checkAuthAndRender();
                }
            });
        }

        if (dom.logoutBtn) {
            dom.logoutBtn.addEventListener('click', function () {
                if (window.CodeArenaAPI && window.CodeArenaAPI.authService) {
                    window.CodeArenaAPI.authService.logout();
                    if (window.CodeArenaToast) {
                        window.CodeArenaToast.info('Logged out. Guest restrictions restored.');
                    }
                    checkAuthAndRender();
                }
            });
        }

        if (dom.closeModalBtn) {
            dom.closeModalBtn.addEventListener('click', closeCodeModal);
        }"""

assert target_binds in c, "Could not find target_binds in submissions.js"
c = c.replace(target_binds, replacement_binds, 1)

with open(SUB_JS, "w", encoding="utf-8") as f:
    f.write(c)

print("submissions.js updated with Auth Gate, Logout, and honest empty state.")

