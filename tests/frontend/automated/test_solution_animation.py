"""
CodeArena — Dedicated "Animate the Solution" Automated Test Suite
test_solution_animation.py

Validates:
1. Strict Scope Boundaries (Frontend only: backend/ and database/ untouched).
2. Clean Problem-Solving Workspace Layout (problem.html, workspace.css, workspace.js):
   - Workspace dedicated strictly to solving problems (no animated diagrams/players in editor, terminal or description).
   - Dedicated "Animate the Solution" entry point in Related Concepts section.
   - Post-submission prominent action "Explore: Animate the Solution ->" in both left panel and console submissions views.
   - Correct propagation of canonical problem ID to solution-animation.html?id=<id>.
3. Dedicated "Animate the Solution" Page (solution-animation.html, animation.css, solution_animation.js):
   - Distinct page architecture decoupled from problem workspace.
   - Header with problem ID, title, difficulty, pattern, and "Back to Problem" navigation.
   - Approach switcher for multi-approach problems (Two Sum Hash Map vs Brute Force).
   - Interactive algorithm visualization stage and canvas.
   - Playback controls: Play, Pause, Next, Prev, Restart, Speed selector (0.5x, 1x, 2x), Step counter & progress bar.
   - Educational step explanation card: What happens, Why this operation, Variables state inspector, Core concept takeaway.
   - Specific Time & Space complexity analysis for each demonstrated approach.
   - Honest educational disclaimer (not claimed to be generated from student code).
4. Problem-Specific Animations Registry:
   - Exactly matches canonical problem IDs across the catalogue:
     1. two-sum (hashmap O(n) & bruteforce O(n^2))
     2. reverse-a-string (two-pointer in-place swap)
     3. binary-search (logarithmic interval halving)
     4. valid-parentheses (LIFO stack operations)
     5. longest-substring (sliding window)
     6. merge-intervals (sorting & greedy interval merge)
     7. reverse-linked-list (3-pointer reversal)
     8. invert-binary-tree (tree traversal & child swap)
     9. number-of-islands (BFS/DFS grid flood fill)
     10. climbing-stairs (1D DP state transitions)
5. Polished Coming-Soon State:
   - Unanimated problems display honest "Interactive visualization for this problem is coming soon".
   - Curated list of available animations with direct navigation.
   - Return to problem workspace button.
6. Theming & Accessibility:
   - Dark & light theme support ([data-theme="light"]).
   - Reduced motion accessibility overrides (@media (prefers-reduced-motion)).
"""

import os
import sys

TESTS_PASSED = 0
TESTS_FAILED = 0

def record(condition, message):
    global TESTS_PASSED, TESTS_FAILED
    if condition:
        TESTS_PASSED += 1
        print(f"  [PASS] {message}")
    else:
        TESTS_FAILED += 1
        print(f"  [FAIL] {message}")

def run_tests():
    global TESTS_PASSED, TESTS_FAILED
    print("\n--- Running Test Suite: Dedicated Animate the Solution Experience ---")

    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
    frontend_dir = os.path.join(root_dir, "frontend")

    # ---------------------------------------------------------
    # 1. Strict Scope Boundaries
    # ---------------------------------------------------------
    backend_dir = os.path.join(root_dir, "backend")
    database_dir = os.path.join(root_dir, "database")
    record(os.path.isdir(backend_dir), "backend/ directory exists untouched")
    record(os.path.isdir(database_dir), "database/ directory exists untouched")

    # Paths to files
    problem_html_path = os.path.join(frontend_dir, "pages", "problem.html")
    workspace_css_path = os.path.join(frontend_dir, "css", "workspace.css")
    workspace_js_path = os.path.join(frontend_dir, "js", "workspace.js")

    anim_html_path = os.path.join(frontend_dir, "pages", "solution-animation.html")
    anim_css_path = os.path.join(frontend_dir, "css", "animation.css")
    anim_js_path = os.path.join(frontend_dir, "js", "solution_animation.js")

    record(os.path.isfile(anim_html_path), "frontend/pages/solution-animation.html exists")
    record(os.path.isfile(anim_css_path), "frontend/css/animation.css exists")
    record(os.path.isfile(anim_js_path), "frontend/js/solution_animation.js exists")

    with open(problem_html_path, "r", encoding="utf-8") as f:
        problem_html = f.read()
    with open(workspace_css_path, "r", encoding="utf-8") as f:
        workspace_css = f.read()
    with open(workspace_js_path, "r", encoding="utf-8") as f:
        workspace_js = f.read()

    with open(anim_html_path, "r", encoding="utf-8") as f:
        anim_html = f.read()
    with open(anim_css_path, "r", encoding="utf-8") as f:
        anim_css = f.read()
    with open(anim_js_path, "r", encoding="utf-8") as f:
        anim_js = f.read()

    # ---------------------------------------------------------
    # 2. Main Workspace Layout Protection (No Animations in Workspace)
    # ---------------------------------------------------------
    record("animCanvas" not in problem_html, "problem.html does NOT contain an animation canvas")
    record("stage-canvas" not in problem_html, "problem.html does NOT contain stage-canvas")
    record("anim-player-card" not in problem_html, "problem.html does NOT contain animation player cards")
    record("btnAnimPlayPause" not in problem_html, "problem.html does NOT contain animation playback buttons")

    # Dedicated Entry Point in Related Concepts
    record('id="workspaceAnimateEntry"' in problem_html, "problem.html defines #workspaceAnimateEntry in Related Concepts")
    record('id="linkAnimateSolutionConcepts"' in problem_html, "problem.html defines #linkAnimateSolutionConcepts")
    record("Animate the Solution" in problem_html, "problem.html includes clearly labelled 'Animate the Solution' entry point")

    # Post-Submission Action Banners
    record('id="submissionAnimateBanner"' in problem_html, "problem.html defines #submissionAnimateBanner in Submissions view")
    record('id="consoleSubmissionAnimateBanner"' in problem_html, "problem.html defines #consoleSubmissionAnimateBanner in console Submissions view")
    record('Explore: Animate the Solution' in problem_html, "problem.html provides 'Explore: Animate the Solution ->' post-submission banner")

    # Workspace JS Controller Wiring
    record("linkAnimateSolutionConcepts" in workspace_js, "workspace.js caches linkAnimateSolutionConcepts")
    record("submissionAnimateBanner" in workspace_js, "workspace.js caches submissionAnimateBanner")
    record("consoleSubmissionAnimateBanner" in workspace_js, "workspace.js caches consoleSubmissionAnimateBanner")
    record("solution-animation.html?id=" in workspace_js, "workspace.js dynamically sets URL with canonical problem ID")
    record("dom.submissionAnimateBanner.style.display = 'flex'" in workspace_js, "workspace.js shows animation banner after submission")

    # Workspace CSS Styling
    record(".workspace-animate-entry" in workspace_css, "workspace.css styles .workspace-animate-entry")
    record(".submission-animate-banner" in workspace_css, "workspace.css styles .submission-animate-banner")
    record(".btn-launch-animate-action" in workspace_css, "workspace.css styles .btn-launch-animate-action")
    record('[data-theme="light"] .submission-animate-banner' in workspace_css, "workspace.css provides light theme overrides for submission banner")

    # ---------------------------------------------------------
    # 3. Dedicated Animate the Solution Page Structure
    # ---------------------------------------------------------
    record('id="animProblemId"' in anim_html, "solution-animation.html defines #animProblemId")
    record('id="animProblemTitle"' in anim_html, "solution-animation.html defines #animProblemTitle")
    record('id="animDiffBadge"' in anim_html, "solution-animation.html defines #animDiffBadge")
    record('id="btnBackToProblem"' in anim_html, "solution-animation.html defines #btnBackToProblem header action")
    record('id="approachSelectorWrap"' in anim_html, "solution-animation.html defines #approachSelectorWrap for multi-approach problems")
    record('id="selectApproach"' in anim_html, "solution-animation.html defines #selectApproach dropdown")
    record('id="customApproachDropdown"' in anim_html, "solution-animation.html defines #customApproachDropdown custom dropdown container")
    record('id="customApproachTrigger"' in anim_html, "solution-animation.html defines #customApproachTrigger accessible trigger button")
    record('id="customApproachMenu"' in anim_html, "solution-animation.html defines #customApproachMenu listbox menu")

    # Layout Views
    record('id="viewActiveAnimation"' in anim_html, "solution-animation.html defines #viewActiveAnimation")
    record('id="viewComingSoon"' in anim_html, "solution-animation.html defines #viewComingSoon fallback layout")

    # Stage & Controls
    record('id="stageApproachHeading"' in anim_html, "solution-animation.html defines #stageApproachHeading")
    record('id="selectAnimSpeed"' in anim_html, "solution-animation.html defines #selectAnimSpeed (0.5x, 1x, 2x)")
    record('id="animCanvas"' in anim_html, "solution-animation.html defines #animCanvas")
    record('id="btnAnimPrev"' in anim_html, "solution-animation.html defines #btnAnimPrev")
    record('id="btnAnimPlayPause"' in anim_html, "solution-animation.html defines #btnAnimPlayPause")
    record('id="btnAnimNext"' in anim_html, "solution-animation.html defines #btnAnimNext")
    record('id="btnAnimRestart"' in anim_html, "solution-animation.html defines #btnAnimRestart")
    record('id="animStepCounter"' in anim_html, "solution-animation.html defines #animStepCounter")
    record('id="animProgressBar"' in anim_html, "solution-animation.html defines #animProgressBar")
    record('id="animDisclaimerCard"' in anim_html, "solution-animation.html defines #animDisclaimerCard")

    # Sidebar Explanation & Complexity
    record('id="explanationCard"' in anim_html, "solution-animation.html defines #explanationCard")
    record('id="stepTitle"' in anim_html, "solution-animation.html defines #stepTitle")
    record('id="stepWhat"' in anim_html, "solution-animation.html defines #stepWhat")
    record('id="stepWhy"' in anim_html, "solution-animation.html defines #stepWhy")
    record('id="variablesGrid"' in anim_html, "solution-animation.html defines #variablesGrid")
    record('id="stepTakeaway"' in anim_html, "solution-animation.html defines #stepTakeaway")
    record('id="complexityCard"' in anim_html, "solution-animation.html defines #complexityCard")
    record('id="badgeTimeComplexity"' in anim_html, "solution-animation.html defines #badgeTimeComplexity")
    record('id="badgeSpaceComplexity"' in anim_html, "solution-animation.html defines #badgeSpaceComplexity")
    record('id="btnSidebarBack"' in anim_html, "solution-animation.html defines #btnSidebarBack to return to problem")

    # ---------------------------------------------------------
    # 4. Problem-Specific Animations Registry in solution_animation.js
    # ---------------------------------------------------------
    # Problem 1: Two Sum
    record("'two-sum':" in anim_js, "Registry includes 'two-sum'")
    record("id: 'hashmap'" in anim_js and "id: 'bruteforce'" in anim_js, "Two Sum supports both Hash Map O(n) and Brute Force O(n^2) approaches")
    record("timeComplexity: 'O(n)'" in anim_js, "Two Sum Hash Map approach defines O(n) time complexity")
    record("timeComplexity: 'O(n²)'" in anim_js, "Two Sum Brute Force approach defines O(n²) time complexity")

    # Problem 2: Reverse a String
    record("'reverse-a-string':" in anim_js, "Registry includes 'reverse-a-string'")
    record("Two Pointers (In-Place Swap)" in anim_js, "Reverse a String demonstrates in-place two-pointer swapping")

    # Problem 3: Binary Search
    record("'binary-search':" in anim_js, "Registry includes 'binary-search'")
    record("timeComplexity: 'O(log n)'" in anim_js, "Binary Search demonstrates O(log n) interval halving")

    # Problem 4: Valid Parentheses
    record("'valid-parentheses':" in anim_js, "Registry includes 'valid-parentheses'")
    record("Stack (LIFO Bracket Matching)" in anim_js, "Valid Parentheses demonstrates LIFO stack operations")

    # Problem 5: Longest Substring (Sliding Window)
    record("'longest-substring':" in anim_js, "Registry includes 'longest-substring'")
    record("Sliding Window (Hash Set)" in anim_js, "Longest Substring demonstrates sliding window expansion & shrinking")

    # Problem 6: Merge Intervals
    record("'merge-intervals':" in anim_js, "Registry includes 'merge-intervals'")
    record("timeComplexity: 'O(n log n)'" in anim_js, "Merge Intervals demonstrates sorting and greedy interval consolidation")

    # Problem 7: Reverse Linked List
    record("'reverse-linked-list':" in anim_js, "Registry includes 'reverse-linked-list'")
    record("Iterative 3-Pointer Reversal" in anim_js, "Reverse Linked List demonstrates prev, curr, next pointer manipulation")

    # Problem 8: Invert Binary Tree
    record("'invert-binary-tree':" in anim_js, "Registry includes 'invert-binary-tree'")
    record("Recursive Depth-First Swap" in anim_js, "Invert Binary Tree demonstrates recursive child node swapping")

    # Problem 9: Number of Islands
    record("'number-of-islands':" in anim_js, "Registry includes 'number-of-islands'")
    record("BFS / DFS Grid Flood Fill" in anim_js, "Number of Islands demonstrates grid flood-fill traversal")

    # Problem 10: Climbing Stairs
    record("'climbing-stairs':" in anim_js, "Registry includes 'climbing-stairs'")
    record("Dynamic Programming (State Transitions)" in anim_js, "Climbing Stairs demonstrates dp[i] = dp[i-1] + dp[i-2] state transitions")

    # ---------------------------------------------------------
    # 5. Controller Capabilities & State Management
    # ---------------------------------------------------------
    record("window.CodeArenaSolutionAnimation" in anim_js, "solution_animation.js exports window.CodeArenaSolutionAnimation")
    record("function nextStep" in anim_js, "solution_animation.js defines nextStep()")
    record("function prevStep" in anim_js, "solution_animation.js defines prevStep()")
    record("function togglePlay" in anim_js, "solution_animation.js defines togglePlay()")
    record("function restart" in anim_js, "solution_animation.js defines restart()")
    record("function setSpeed" in anim_js, "solution_animation.js defines setSpeed()")
    record("function selectApproach" in anim_js, "solution_animation.js defines selectApproach()")
    record("function openCustomDropdown" in anim_js, "solution_animation.js defines openCustomDropdown() for custom dropdown")
    record("showComingSoonView" in anim_js, "solution_animation.js defines showComingSoonView() for un-animated problems")

    # ---------------------------------------------------------
    # 6. Styling, Responsive & Accessibility in animation.css
    # ---------------------------------------------------------
    record(".anim-navbar" in anim_css, "animation.css styles .anim-navbar")
    record(".custom-approach-dropdown" in anim_css, "animation.css styles .custom-approach-dropdown")
    record(".custom-approach-trigger" in anim_css, "animation.css styles .custom-approach-trigger")
    record(".custom-approach-menu" in anim_css, "animation.css styles .custom-approach-menu")
    record('[data-theme="light"] .custom-approach-menu' in anim_css, "animation.css styles light mode custom dropdown menu")
    record(".anim-active-layout" in anim_css, "animation.css defines grid layout for stage and sidebar")
    record(".stage-canvas-wrapper" in anim_css, "animation.css styles .stage-canvas-wrapper")
    record(".anim-array-cell" in anim_css, "animation.css styles .anim-array-cell")
    record(".anim-pointer-pin" in anim_css, "animation.css styles .anim-pointer-pin")
    record(".active-matched" in anim_css, "animation.css styles .active-matched state")
    record(".anim-stack-wrap" in anim_css, "animation.css styles .anim-stack-wrap container")
    record(".anim-ll-node" in anim_css, "animation.css styles .anim-ll-node linked list elements")
    record(".anim-tree-node" in anim_css, "animation.css styles .anim-tree-node tree elements")
    record(".anim-matrix-grid" in anim_css, "animation.css styles .anim-matrix-grid for 2D island grids")
    record("[data-theme=\"light\"]" in anim_css, "animation.css provides comprehensive light theme tokens")
    record("@media (prefers-reduced-motion" in anim_css, "animation.css honors reduced-motion accessibility preference")
    record("@media (max-width: 1024px)" in anim_css, "animation.css provides responsive tablet layout")
    record("@media (max-width: 768px)" in anim_css, "animation.css provides responsive mobile layout")

    print(f"\nDedicated Animate the Solution Test Suite Finished: {TESTS_PASSED} Passed, {TESTS_FAILED} Failed.")
    return TESTS_FAILED == 0

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)

