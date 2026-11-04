# tests/frontend/utils/build_full_problems.py
"""
Compiles all 154 problems across 12 DSA topics from tests/frontend/utils/topics/
and updates frontend/js/api.js with TOPICS, MOCK_PROBLEMS, and pattern support.
"""

import os
import sys
import json
import re

# Ensure root is in python path
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from tests.frontend.utils.topics import (
    arrays, strings, hashing, linked_lists, stacks_queues,
    binary_search, backtracking, trees, heaps, graphs, greedy, dp, extensions
)

def compile_dataset():
    modules = [
        arrays, strings, hashing, linked_lists, stacks_queues,
        binary_search, backtracking, trees, heaps, graphs, greedy, dp
    ]

    all_problems = []
    for mod in modules:
        probs = mod.get_problems()
        all_problems.extend(probs)

    all_problems.extend(extensions.get_extension_problems())

    # =========================================================================
    # Phase 8: Exactly 50 Premium Problems & 150 Free Problems (Total 200)
    # =========================================================================
    PREMIUM_50_IDS = set([
        # 1. Advanced Segment Trees & Fenwick Trees (2)
        'segment-tree-range-sum', 'count-of-smaller-numbers-after-self',
        # 2. Trie & Advanced Backtracking (8)
        'word-search-ii', 'n-queens', 'sudoku-solver', 'letter-combinations-of-phone-number',
        'combination-sum-ii', 'next-permutation', 'permutations-ii', 'subsets-ii',
        # 3. String Algorithms & Rolling Hash (5)
        'longest-duplicate-substring', 'minimum-window-substring', 'repeated-dna-sequences',
        'split-array-largest-sum', 'permutation-in-string',
        # 4. Advanced Graph Algorithms & Tarjan\'s (11)
        'critical-connections-in-a-network', 'word-ladder', 'course-schedule',
        'network-delay-time', 'cheapest-flights-within-k-stops', 'path-with-minimum-effort',
        'course-schedule-ii', 'count-sub-islands', 'redundant-connection', 'graph-valid-tree',
        'all-ancestors-of-a-node-in-a-dag',
        # 5. Advanced Dynamic Programming (11)
        'burst-balloons', 'regular-expression-matching', 'edit-distance',
        'coin-change-ii', 'target-sum', 'partition-equal-subset-sum',
        'longest-increasing-subsequence', 'longest-common-subsequence',
        'unique-paths-ii', 'maximal-square', 'decode-ways',
        # 6. Advanced Heaps & Two Heaps (7)
        'find-median-from-data-stream', 'sliding-window-median',
        'smallest-range-covering-elements-from-k-lists', 'ipo-project-selection',
        'k-closest-points-to-origin', 'top-k-frequent-words', 'find-k-pairs-with-smallest-sums',
        # 7. Monotonic Structures & Greedy (4)
        'largest-rectangle-in-histogram', 'sliding-window-maximum',
        'shortest-subarray-with-sum-at-least-k', 'candy',
        # 8. Advanced Trees & Linked Lists & Bits (2)
        'single-number-ii', 'reverse-nodes-in-k-group'
    ])

    for p in all_problems:
        p["isPremium"] = (p["id"] in PREMIUM_50_IDS)

    print(f"Loaded {len(all_problems)} total problems.")

    # Validation
    orig_12 = [
        "two-sum", "reverse-a-string", "valid-parentheses", "merge-k-sorted-lists",
        "binary-search", "palindrome-number", "maximum-subarray", "linked-list-cycle",
        "invert-binary-tree", "climbing-stairs", "longest-substring", "trapping-rain-water"
    ]
    ids = [p["id"] for p in all_problems]
    assert len(all_problems) == 200, f"Expected 200 problems, got {len(all_problems)}"
    assert len(PREMIUM_50_IDS) == 50, f"Expected 50 premium problems, got {len(PREMIUM_50_IDS)}"
    
    prem_count = sum(1 for p in all_problems if p["isPremium"])
    free_count = sum(1 for p in all_problems if not p["isPremium"])
    assert prem_count == 50, f"Expected 50 premium, got {prem_count}"
    assert free_count == 150, f"Expected 150 free, got {free_count}"

    dup_ids = set([x for x in ids if ids.count(x) > 1])
    assert not dup_ids, f"Duplicate problem IDs found: {dup_ids}"

    missing_orig = [x for x in orig_12 if x not in ids]
    assert not missing_orig, f"Missing original 12 problems: {missing_orig}"

    for orig_id in orig_12:
        orig_p = next(p for p in all_problems if p["id"] == orig_id)
        assert not orig_p["isPremium"], f"Original problem {orig_id} must not be locked as premium!"

    for p in all_problems:
        assert p.get("id"), "Missing id"
        assert p.get("title"), f"Missing title for {p.get('id')}"
        assert p.get("topic"), f"Missing topic for {p.get('id')}"
        assert p.get("pattern"), f"Missing pattern for {p.get('id')}"
        assert p.get("hints") and len(p["hints"]) >= 3, f"Problem {p['id']} has fewer than 3 hints!"
        assert p.get("sampleTestCases") and len(p["sampleTestCases"]) >= 1, f"Problem {p['id']} has no test cases"

    print("All validation assertions passed successfully.")
    return all_problems

def update_api_js(problems):
    api_path = os.path.join(ROOT, "frontend", "js", "api.js")
    with open(api_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Update TOPICS list
    topics_list = [
        "Arrays",
        "Strings",
        "Hashing",
        "Linked Lists",
        "Stacks and Queues",
        "Binary Search",
        "Recursion and Backtracking",
        "Trees",
        "Heaps and Priority Queues",
        "Graphs",
        "Greedy Algorithms",
        "Dynamic Programming"
    ]
    topics_code = "const TOPICS = Object.freeze([\n" + ",\n".join(f"    '{t}'" for t in topics_list) + "\n]);"

    topics_pattern = re.compile(r"const TOPICS = Object\.freeze\(\[[\s\S]*?\]\);")
    assert topics_pattern.search(content), "Could not find TOPICS in api.js"
    content = topics_pattern.sub(topics_code, content, count=1)

    # 2. Update MOCK_PROBLEMS
    # Format problems as readable JavaScript array
    problems_json = json.dumps(problems, indent=4)
    # Ensure proper indent
    problems_code = f"const MOCK_PROBLEMS = {problems_json};"

    mock_pattern = re.compile(r"const MOCK_PROBLEMS = \[[\s\S]*?\];\s*(?=/\*|const problemMockAdapter|function|var|let)")
    assert mock_pattern.search(content), "Could not find MOCK_PROBLEMS in api.js"
    content = mock_pattern.sub(lambda m: problems_code + "\n\n", content, count=1)

    # 3. Ensure problemMockAdapter supports params.pattern and getPatterns
    # Check if pattern filtering already exists
    if "if (params.pattern" not in content:
        target_topic_filter = """        // 2. Topic filter (with boundary protection)
        if (params.topic && params.topic !== 'All') {
            const validTopic = TOPICS.some(t => t.toLowerCase() === String(params.topic).toLowerCase());
            if (!validTopic) {
                // Invalid topic returns empty results gracefully
                results = [];
            } else {
                results = results.filter(p => p.topic.toLowerCase() === String(params.topic).toLowerCase());
            }
        }"""

        replacement_with_pattern = """        // 2. Topic filter (with boundary protection)
        if (params.topic && params.topic !== 'All') {
            const validTopic = TOPICS.some(t => t.toLowerCase() === String(params.topic).toLowerCase());
            if (!validTopic) {
                // Invalid topic returns empty results gracefully
                results = [];
            } else {
                results = results.filter(p => p.topic.toLowerCase() === String(params.topic).toLowerCase());
            }
        }

        // 2b. Algorithmic Pattern filter
        if (params.pattern && params.pattern !== 'All') {
            const targetPattern = String(params.pattern).trim().toLowerCase();
            results = results.filter(p => p.pattern && p.pattern.toLowerCase() === targetPattern);
        }"""

        content = content.replace(target_topic_filter, replacement_with_pattern, 1)

    # Check if getPatterns exists in problemMockAdapter
    if "getPatterns(" not in content:
        target_get_topics = """    /**
     * Get list of unique problem topics.
     */
    async getTopics() {
        return {
            success: true,
            data: TOPICS.slice()
        };
    }"""

        replacement_with_patterns = """    /**
     * Get list of unique problem topics.
     */
    async getTopics() {
        return {
            success: true,
            data: TOPICS.slice()
        };
    },

    /**
     * Get list of unique algorithmic patterns, optionally filtered by topic.
     */
    async getPatterns(topic) {
        let pool = MOCK_PROBLEMS.slice();
        if (topic && topic !== 'All') {
            pool = pool.filter(p => p.topic.toLowerCase() === String(topic).toLowerCase());
        }
        const patternSet = new Set();
        pool.forEach(p => {
            if (p.pattern) patternSet.add(p.pattern);
        });
        return {
            success: true,
            data: Array.from(patternSet).sort()
        };
    }"""
        content = content.replace(target_get_topics, replacement_with_patterns, 1)

    # Check if getPatterns exists in problemService
    if "async getPatterns(topic)" not in content:
        target_service_get_topics = """    async getTopics() {
        if (API_CONFIG.useMockAdapter) {
            return problemMockAdapter.getTopics();
        }
        const res = await apiClient('/problems/topics', { method: 'GET' });
        if (!res.success && res.isNetworkFailure) {
            return problemMockAdapter.getTopics();
        }
        return res;
    },"""

        replacement_service_with_patterns = """    async getTopics() {
        if (API_CONFIG.useMockAdapter) {
            return problemMockAdapter.getTopics();
        }
        const res = await apiClient('/problems/topics', { method: 'GET' });
        if (!res.success && res.isNetworkFailure) {
            return problemMockAdapter.getTopics();
        }
        return res;
    },

    async getPatterns(topic) {
        if (API_CONFIG.useMockAdapter) {
            return problemMockAdapter.getPatterns(topic);
        }
        const query = topic ? `?topic=${encodeURIComponent(topic)}` : '';
        const res = await apiClient(`/problems/patterns${query}`, { method: 'GET' });
        if (!res.success && res.isNetworkFailure) {
            return problemMockAdapter.getPatterns(topic);
        }
        return res;
    },"""
        content = content.replace(target_service_get_topics, replacement_service_with_patterns, 1)

    with open(api_path, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"Successfully updated {api_path} with {len(problems)} problems.")

if __name__ == "__main__":
    probs = compile_dataset()
    update_api_js(probs)
