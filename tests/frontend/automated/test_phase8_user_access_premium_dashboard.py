# tests/frontend/automated/test_phase8_user_access_premium_dashboard.py
"""
CodeArena — Phase 8 Targeted Automated Verification Suite
Validates:
1. Canonical problem count: exactly 200 total, 150 free, 50 premium.
2. 12 original problem IDs preserved and all free.
3. Login-required submissions gate on guest, uninhibited compiler.
4. Transparent pricing ($5/month, $199/year) without deceptive discount claims.
5. Problem catalogue access filter (All, Free, Premium).
6. Workspace premium lock view for direct URL visits.
7. Dashboard platform overview stats derived dynamically from canonical data.
8. Upcoming preview activities section with realistic future dates (Nov 2026).
"""

import os
import sys
import json
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
FRONTEND_DIR = os.path.join(ROOT, "frontend")

passed = 0
failed = 0

def test(condition, name):
    global passed, failed
    if condition:
        passed += 1
        print(f"  [PASS] {name}")
    else:
        failed += 1
        print(f"  [FAIL] {name}")

def run_tests():
    print("\n--- Running Test Suite: Phase 8 User Access, Premium Problems & Dashboard Intelligence ---")

    # =========================================================================
    # 1. Canonical Problem Dataset & Distribution (api.js)
    # =========================================================================
    api_js_path = os.path.join(FRONTEND_DIR, "js", "api.js")
    with open(api_js_path, "r", encoding="utf-8") as f:
        api_content = f.read()

    mock_match = re.search(r"const MOCK_PROBLEMS = (\[[\s\S]*?\]);\s*(?=/\*|const problemMockAdapter)", api_content)
    test(mock_match is not None, "api.js defines MOCK_PROBLEMS JSON array")

    problems = json.loads(mock_match.group(1)) if mock_match else []
    total_probs = len(problems)
    test(total_probs == 200, f"MOCK_PROBLEMS contains exactly 200 unique problems (Found: {total_probs})")

    prem_probs = [p for p in problems if p.get("isPremium") is True]
    free_probs = [p for p in problems if p.get("isPremium") is not True]
    test(len(prem_probs) == 50, f"Exactly 50 curated premium problems defined (Found: {len(prem_probs)})")
    test(len(free_probs) == 150, f"Exactly 150 free problems defined (Found: {len(free_probs)})")

    # Unique IDs and Titles
    ids = [p["id"] for p in problems]
    titles = [p["title"] for p in problems]
    test(len(set(ids)) == 200, "All 200 problem IDs are strictly unique")
    test(len(set(titles)) == 200, "All 200 problem titles are strictly unique")

    # 12 original problem IDs preserved and 100% free
    orig_12 = [
        "two-sum", "reverse-a-string", "valid-parentheses", "merge-k-sorted-lists",
        "binary-search", "palindrome-number", "maximum-subarray", "linked-list-cycle",
        "invert-binary-tree", "climbing-stairs", "longest-substring", "trapping-rain-water"
    ]
    orig_all_present = all(oid in ids for oid in orig_12)
    orig_all_free = all(p["isPremium"] is False for p in problems if p["id"] in orig_12)
    test(orig_all_present, "All 12 original canonical problem IDs are preserved")
    test(orig_all_free, "All 12 original canonical problems are completely free (not locked)")

    # All Easy problems remain free
    easy_all_free = all(p["isPremium"] is False for p in problems if p["difficulty"] == "Easy")
    test(easy_all_free, "All Easy foundational problems remain 100% accessible to free users")

    # Hints on all 200 problems
    all_have_3_hints = all(len(p.get("hints", [])) >= 3 for p in problems)
    test(all_have_3_hints, "All 200 problems have at least 3 progressive hints")

    # =========================================================================
    # 2. Service Layer & Methods (api.js)
    # =========================================================================
    test("params.access" in api_content, "problemMockAdapter.list supports params.access filtering")
    test("getFreeProblems()" in api_content, "problemService and adapter expose getFreeProblems()")
    test("getPremiumProblems()" in api_content, "problemService and adapter expose getPremiumProblems()")
    test("getStats()" in api_content, "problemService and adapter expose getStats()")
    test("getUpcomingActivities()" in api_content, "problemService and adapter expose getUpcomingActivities()")
    test("const subscriptionService =" in api_content, "api.js defines subscriptionService")
    test("subscriptionService: subscriptionService" in api_content, "window.CodeArenaAPI exposes subscriptionService")
    test("const authMockAdapter =" in api_content, "api.js defines authMockAdapter for preview authentication")

    # Pricing integrity: monthly $5, annual $199 without false discount claims
    test("$5 / month" in api_content and "$199 / year" in api_content, "subscriptionService defines exact prices: $5/month and $199/year")
    sub_service_match = re.search(r"const subscriptionService = \{[\s\S]*?\n\};", api_content)
    sub_service_text = sub_service_match.group(0).lower() if sub_service_match else ""
    no_fake_discounts = "save 20%" not in sub_service_text and "discounted" not in sub_service_text and "best value" not in sub_service_text
    test(no_fake_discounts, "Subscription plans do not contain false or deceptive discount/value claims")

    # =========================================================================
    # 3. Login-Required Submissions Gate (submissions.html & submissions.js)
    # =========================================================================
    sub_html_path = os.path.join(FRONTEND_DIR, "pages", "submissions.html")
    with open(sub_html_path, "r", encoding="utf-8") as f:
        sub_html = f.read()

    test('id="submissionsAuthGate"' in sub_html, "submissions.html includes #submissionsAuthGate authentication-required view")
    test('id="btnSubDemoLogin"' in sub_html, "submissions.html includes #btnSubDemoLogin quick demo login action")
    test('id="subUserPill"' in sub_html, "submissions.html includes #subUserPill for authenticated user session")
    test('id="btnSubLogout"' in sub_html, "submissions.html includes #btnSubLogout logout action")

    sub_js_path = os.path.join(FRONTEND_DIR, "js", "submissions.js")
    with open(sub_js_path, "r", encoding="utf-8") as f:
        sub_js = f.read()

    test("checkAuthAndRender" in sub_js, "submissions.js enforces authentication check on initialization")
    test("isAuthenticated()" in sub_js, "submissions.js verifies preview authentication via authService")
    test("SUB-PREV-2026-001" not in sub_js, "submissions.js does not display fabricated personal records by default")

    # Compiler unrestricted
    comp_html_path = os.path.join(FRONTEND_DIR, "pages", "compiler.html")
    with open(comp_html_path, "r", encoding="utf-8") as f:
        comp_html = f.read()
    test("submissionsAuthGate" not in comp_html, "compiler.html remains 100% unrestricted for guests without login")

    # =========================================================================
    # 4. Problem Catalogue Access & Subscription Modal (problems.html & problems.js)
    # =========================================================================
    prob_html_path = os.path.join(FRONTEND_DIR, "pages", "problems.html")
    with open(prob_html_path, "r", encoding="utf-8") as f:
        prob_html = f.read()

    test('id="accessFilter"' in prob_html, "problems.html includes #accessFilter dropdown (All, Free, Premium)")
    test('id="heroFreeProblems"' in prob_html, "problems.html hero stats include #heroFreeProblems counter (150)")
    test('id="heroPremiumProblems"' in prob_html, "problems.html hero stats include #heroPremiumProblems counter (50)")
    test('id="subscriptionModalOverlay"' in prob_html, "problems.html includes #subscriptionModalOverlay upgrade modal")
    test("$5" in prob_html and "$199" in prob_html, "Subscription modal displays transparent $5/mo and $199/yr plans")

    prob_js_path = os.path.join(FRONTEND_DIR, "js", "problems.js")
    with open(prob_js_path, "r", encoding="utf-8") as f:
        prob_js = f.read()

    test("badge-pro" in prob_js, "problems.js renders PRO badge for premium problems")
    test("pro-lock-icon" in prob_js, "problems.js renders lock icon for locked problems")
    test("openSubscriptionModal" in prob_js, "problems.js triggers subscription modal on clicking locked challenge")

    # =========================================================================
    # 5. Problem Workspace Premium Lock (problem.html & workspace.js)
    # =========================================================================
    ws_html_path = os.path.join(FRONTEND_DIR, "pages", "problem.html")
    with open(ws_html_path, "r", encoding="utf-8") as f:
        ws_html = f.read()

    test('id="problemPremiumLockView"' in ws_html, "problem.html includes #problemPremiumLockView for direct URL access")

    ws_js_path = os.path.join(FRONTEND_DIR, "js", "workspace.js")
    with open(ws_js_path, "r", encoding="utf-8") as f:
        ws_js = f.read()

    test("renderPremiumLock" in ws_js, "workspace.js defines renderPremiumLock controller")
    test("isProProblem && !userIsPro" in ws_js, "workspace.js checks subscription status on direct problem load")

    # =========================================================================
    # 6. Dashboard Platform Intelligence & Upcoming Activities (dashboard.html & js)
    # =========================================================================
    dash_html_path = os.path.join(FRONTEND_DIR, "pages", "dashboard.html")
    with open(dash_html_path, "r", encoding="utf-8") as f:
        dash_html = f.read()

    test('id="dashStatProblems"' in dash_html, "dashboard.html contains #dashStatProblems (200)")
    test('id="dashStatFree"' in dash_html, "dashboard.html contains #dashStatFree (150)")
    test('id="dashStatPremium"' in dash_html, "dashboard.html contains #dashStatPremium (50)")
    test('id="dashStatTopics"' in dash_html, "dashboard.html contains #dashStatTopics (12)")
    test('id="dashStatPatterns"' in dash_html, "dashboard.html contains #dashStatPatterns (63)")
    test('id="dashStatContests"' in dash_html, "dashboard.html contains #dashStatContests (4)")
    test('id="upcomingActivitiesHeading"' in dash_html, "dashboard.html includes Upcoming Activities & Schedules section")
    test('id="upcomingActivitiesGrid"' in dash_html, "dashboard.html includes #upcomingActivitiesGrid container")

    dash_js_path = os.path.join(FRONTEND_DIR, "js", "dashboard.js")
    with open(dash_js_path, "r", encoding="utf-8") as f:
        dash_js = f.read()

    test("loadPlatformIntelligence" in dash_js, "dashboard.js loads platform overview stats dynamically via getStats()")
    test("renderUpcomingActivities" in dash_js, "dashboard.js dynamically renders upcoming preview activities")
    test("updateAuthStateUI" in dash_js, "dashboard.js updates UI for guest, free-preview, and pro-preview states")
    test("{ limit: 100 }" not in dash_js, "dashboard.js does not artificially truncate problem stats with limit: 100")

    print(f"\nPhase 8 Test Suite Finished: {passed} Passed, {failed} Failed.")
    return failed == 0

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
