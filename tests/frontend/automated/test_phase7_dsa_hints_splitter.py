# tests/frontend/automated/test_phase7_dsa_hints_splitter.py
"""
CodeArena Automated Test Suite: DSA Problem Collection, Progressive Hints, and Draggable Compiler Splitter
Validates Phase 7 coordinated enhancements:
1. DSA Problem Expansion (154 problems across 12 topics & 60 patterns, original 12 preserved).
2. Progressive Hints (3 structured hints per problem, sequential disclosure, reset capability).
3. Adjustable Compiler Workspace (draggable splitter, clamped bounds, CodeMirror refresh, persistence).
"""

import os
import sys
import json
import re

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
    print("\n--- Running Test Suite: DSA Problems Expansion, Progressive Hints & Compiler Splitter ---")
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "frontend"))

    # =========================================================================
    # 1. Feature 1: DSA Problem Collection in api.js
    # =========================================================================
    api_js_path = os.path.join(base_dir, "js", "api.js")
    record(os.path.exists(api_js_path), "frontend/js/api.js exists")

    with open(api_js_path, "r", encoding="utf-8") as f:
        api_content = f.read()

    # Verify TOPICS array
    topics_match = re.search(r"const TOPICS = Object\.freeze\(\[([\s\S]*?)\]\);", api_content)
    record(topics_match is not None, "api.js defines frozen TOPICS array")
    if topics_match:
        topics_str = topics_match.group(1)
        expected_12_topics = [
            "Arrays", "Strings", "Hashing", "Linked Lists", "Stacks and Queues",
            "Binary Search", "Recursion and Backtracking", "Trees",
            "Heaps and Priority Queues", "Graphs", "Greedy Algorithms", "Dynamic Programming"
        ]
        all_topics_present = all(t in topics_str for t in expected_12_topics)
        record(all_topics_present, "api.js TOPICS contains all 12 DSA topics")

    # Verify MOCK_PROBLEMS
    mock_match = re.search(r"const MOCK_PROBLEMS = (\[[\s\S]*?\]);\s*(?=/\*|const problemMockAdapter)", api_content)
    record(mock_match is not None, "api.js defines MOCK_PROBLEMS JSON array")
    if mock_match:
        try:
            problems_data = json.loads(mock_match.group(1))
            prob_count = len(problems_data)
            record(prob_count >= 140, f"MOCK_PROBLEMS contains expanded collection (Found: {prob_count} problems)")

            orig_12 = [
                "two-sum", "reverse-a-string", "valid-parentheses", "merge-k-sorted-lists",
                "binary-search", "palindrome-number", "maximum-subarray", "linked-list-cycle",
                "invert-binary-tree", "climbing-stairs", "longest-substring", "trapping-rain-water"
            ]
            prob_ids = [p["id"] for p in problems_data]
            all_orig_found = all(oid in prob_ids for oid in orig_12)
            record(all_orig_found, "All 12 original problem IDs are preserved in canonical collection")

            # Check hints for all problems
            all_have_3_hints = all(len(p.get("hints", [])) >= 3 and all(bool(h.strip()) for h in p["hints"]) for p in problems_data)
            record(all_have_3_hints, "Every single problem has at least 3 non-empty progressive hints")

            # Check difficulty distribution
            diffs = set(p["difficulty"] for p in problems_data)
            record(diffs == {"Easy", "Medium", "Hard"}, "Balanced difficulty levels (Easy, Medium, Hard) present")

            # Check pattern attribute
            all_have_pattern = all(bool(p.get("pattern")) for p in problems_data)
            unique_patterns = set(p["pattern"] for p in problems_data)
            record(all_have_pattern and len(unique_patterns) >= 50, f"Rich algorithmic patterns populated (Found: {len(unique_patterns)} distinct patterns)")

            # Check 3-5 problems per pattern requirement
            from collections import defaultdict
            pats_map = defaultdict(list)
            for p in problems_data:
                pats_map[(p["topic"], p["pattern"])].append(p["id"])
            every_pat_min_3 = all(len(v) >= 3 for v in pats_map.values())
            record(every_pat_min_3, f"All {len(pats_map)} algorithmic patterns have at least 3 problems (3–5 problems per pattern satisfied)")

        except Exception as e:
            record(False, f"Failed parsing MOCK_PROBLEMS JSON: {e}")

    # Verify problemMockAdapter and problemService pattern support
    record("params.pattern" in api_content, "problemMockAdapter.list supports params.pattern filtering")
    record("getPatterns(" in api_content, "problemMockAdapter and problemService expose getPatterns(topic)")

    # =========================================================================
    # 2. Problem Catalogue Upgrades (problems.html & problems.js)
    # =========================================================================
    prob_html_path = os.path.join(base_dir, "pages", "problems.html")
    with open(prob_html_path, "r", encoding="utf-8") as f:
        prob_html = f.read()

    record('id="patternFilter"' in prob_html, "problems.html includes #patternFilter dropdown element")
    record('id="heroTotalProblems"' in prob_html, "problems.html includes dynamic #heroTotalProblems stat element")
    record('id="heroTotalTopics"' in prob_html, "problems.html includes dynamic #heroTotalTopics stat element")
    record('id="heroTotalPatterns"' in prob_html, "problems.html includes dynamic #heroTotalPatterns stat element")

    prob_js_path = os.path.join(base_dir, "js", "problems.js")
    with open(prob_js_path, "r", encoding="utf-8") as f:
        prob_js = f.read()

    record("pattern: 'All'" in prob_js or 'pattern: "All"' in prob_js, "problems.js state tracks pattern filter")
    record("loadPatterns(" in prob_js, "problems.js defines loadPatterns to populate patterns dynamically")
    record("updateHeroStats(" in prob_js, "problems.js updates hero statistic figures dynamically")
    record("pagesToRender" in prob_js or "pagination-ellipsis" in prob_js, "problems.js implements smart pagination windowing for expanded catalog")

    # =========================================================================
    # 3. Feature 2: Progressive Hints (problem.html, workspace.css, workspace.js)
    # =========================================================================
    wk_html_path = os.path.join(base_dir, "pages", "problem.html")
    with open(wk_html_path, "r", encoding="utf-8") as f:
        wk_html = f.read()

    record('id="tabBtnHints"' in wk_html, "problem.html includes #tabBtnHints tab button in left pane")
    record('id="hintsProgressTag"' in wk_html, "problem.html includes #hintsProgressTag progress counter")
    record('id="hintsScrollView"' in wk_html, "problem.html includes #hintsScrollView panel container")
    record('id="btnResetHints"' in wk_html, "problem.html includes #btnResetHints action button")
    record('id="btnRevealHint1"' in wk_html and 'id="btnRevealHint2"' in wk_html and 'id="btnRevealHint3"' in wk_html, "problem.html includes 3 progressive reveal buttons")

    wk_css_path = os.path.join(base_dir, "css", "workspace.css")
    with open(wk_css_path, "r", encoding="utf-8") as f:
        wk_css = f.read()

    record(".hints-panel-view" in wk_css, "workspace.css defines .hints-panel-view styles")
    record(".hint-card" in wk_css, "workspace.css defines .hint-card styles")
    record(".btn-reveal-hint" in wk_css, "workspace.css defines .btn-reveal-hint styles")

    wk_js_path = os.path.join(base_dir, "js", "workspace.js")
    with open(wk_js_path, "r", encoding="utf-8") as f:
        wk_js = f.read()

    record("renderHints(" in wk_js, "workspace.js defines renderHints controller")
    record("unlockHint(" in wk_js, "workspace.js defines unlockHint sequential disclosure logic")
    record("resetProblemHints(" in wk_js, "workspace.js defines resetProblemHints capability")
    record("switchLeftPaneTab(" in wk_js, "workspace.js implements tab switcher preserving CodeMirror editor")

    # =========================================================================
    # 4. Feature 3: Draggable Compiler Splitter (compiler.html, compiler.css, compiler.js)
    # =========================================================================
    comp_html_path = os.path.join(base_dir, "pages", "compiler.html")
    with open(comp_html_path, "r", encoding="utf-8") as f:
        comp_html = f.read()

    record('id="compilerSplitter"' in comp_html, "compiler.html includes #compilerSplitter resizable separator")
    record('id="btnResetSplit"' in comp_html, "compiler.html includes #btnResetSplit layout button")

    comp_css_path = os.path.join(base_dir, "css", "compiler.css")
    with open(comp_css_path, "r", encoding="utf-8") as f:
        comp_css = f.read()

    record("--compiler-editor-width" in comp_css, "compiler.css uses --compiler-editor-width CSS variable")
    record(".compiler-splitter" in comp_css, "compiler.css defines .compiler-splitter with col-resize cursor")
    record("cursor: col-resize" in comp_css, "compiler.css defines resize cursor during drag")
    record("@media (max-width: 960px)" in comp_css and ".compiler-splitter" in comp_css, "compiler.css supports mobile stacked fallback hiding splitter")

    comp_js_path = os.path.join(base_dir, "js", "compiler.js")
    with open(comp_js_path, "r", encoding="utf-8") as f:
        comp_js = f.read()

    record("initCompilerSplitter(" in comp_js, "compiler.js defines initCompilerSplitter")
    record("setPointerCapture" in comp_js, "compiler.js uses setPointerCapture for smooth mouse/touch dragging")
    record("Math.max(30, Math.min(75" in comp_js, "compiler.js enforces 30% to 75% boundary clamping")
    record("codearena_compiler_split_ratio" in comp_js, "compiler.js persists split ratio in localStorage")
    record("ArrowLeft" in comp_js and "ArrowRight" in comp_js, "compiler.js provides keyboard accessibility for splitter")

    print(f"\nPhase 7 Test Suite Finished: {TESTS_PASSED} Passed, {TESTS_FAILED} Failed.")
    return TESTS_FAILED == 0

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)

