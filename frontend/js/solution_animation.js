/**
 * CodeArena — Dedicated "Animate the Solution" Controller (solution_animation.js)
 * Provides interactive, step-by-step visual algorithm execution for canonical DSA problems.
 * Completely decoupled from the coding workspace to ensure maximum focus.
 */

(function () {
    'use strict';

    // -------------------------------------------------------------------------
    // 1. Problem Animations Registry
    // -------------------------------------------------------------------------
    const ANIMATIONS_REGISTRY = {
        'two-sum': {
            title: 'Two Sum',
            canonicalId: 'two-sum',
            approaches: [
                {
                    id: 'hashmap',
                    name: 'Hash Map (One-Pass) — Recommended',
                    timeComplexity: 'O(n)',
                    timeExplanation: 'Single linear traversal of array with O(1) average hash table lookups and insertions.',
                    spaceComplexity: 'O(n)',
                    spaceExplanation: 'Auxiliary hash map stores up to n elements in the worst case.',
                    steps: [
                        {
                            title: 'Initialize Hash Map & Target',
                            what: 'Initialize an empty Hash Map to store numbers and their indices. Target = 9. Pointer i starts at index 0.',
                            why: 'By storing previously seen numbers, we can verify if the required complement exists in O(1) time instead of using nested loops.',
                            variables: { i: 0, 'nums[0]': 2, target: 9, complement: '—', 'map': '{}' },
                            takeaway: 'Trade O(n) memory for dramatic time reduction from quadratic to linear.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label">Input Array (target = 9)</span>
                                    <div class="anim-array-wrap">
                                        <div class="anim-array-col">
                                            <span class="anim-pointer-pin">i=0</span>
                                            <div class="anim-array-cell active-examined">2</div>
                                            <span class="anim-index-sub">idx 0</span>
                                        </div>
                                        <div class="anim-array-col">
                                            <span class="anim-pointer-pin pin-hidden">·</span>
                                            <div class="anim-array-cell">7</div>
                                            <span class="anim-index-sub">idx 1</span>
                                        </div>
                                        <div class="anim-array-col">
                                            <span class="anim-pointer-pin pin-hidden">·</span>
                                            <div class="anim-array-cell">11</div>
                                            <span class="anim-index-sub">idx 2</span>
                                        </div>
                                        <div class="anim-array-col">
                                            <span class="anim-pointer-pin pin-hidden">·</span>
                                            <div class="anim-array-cell">15</div>
                                            <span class="anim-index-sub">idx 3</span>
                                        </div>
                                    </div>
                                    <div class="anim-aux-grid">
                                        <div class="anim-aux-card">
                                            <span class="anim-aux-title">Auxiliary Hash Map (Value → Index)</span>
                                            <div class="anim-hashmap-list">
                                                <span style="color: var(--color-text-muted); font-size: 0.76rem;">(Empty map)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `
                        },
                        {
                            title: 'Compute Complement for nums[0] = 2',
                            what: 'Calculate complement: target - nums[0] = 9 - 2 = 7. Check if 7 is in map: Not found. Store {2: 0} in map.',
                            why: 'Since 7 has not been seen yet, 2 cannot be paired with any earlier element. We store 2 so future numbers can pair with it.',
                            variables: { i: 0, 'nums[0]': 2, target: 9, complement: 7, 'map': '{2: 0}' },
                            takeaway: 'Every element is inserted into the hash table once as a potential complement for upcoming items.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label">Input Array (Checking Complement 9 - 2 = 7)</span>
                                    <div class="anim-array-wrap">
                                        <div class="anim-array-col">
                                            <span class="anim-pointer-pin">i=0</span>
                                            <div class="anim-array-cell active-swapped">2</div>
                                            <span class="anim-index-sub">idx 0</span>
                                        </div>
                                        <div class="anim-array-col">
                                            <span class="anim-pointer-pin pin-hidden">·</span>
                                            <div class="anim-array-cell">7</div>
                                            <span class="anim-index-sub">idx 1</span>
                                        </div>
                                        <div class="anim-array-col">
                                            <span class="anim-pointer-pin pin-hidden">·</span>
                                            <div class="anim-array-cell">11</div>
                                            <span class="anim-index-sub">idx 2</span>
                                        </div>
                                        <div class="anim-array-col">
                                            <span class="anim-pointer-pin pin-hidden">·</span>
                                            <div class="anim-array-cell">15</div>
                                            <span class="anim-index-sub">idx 3</span>
                                        </div>
                                    </div>
                                    <div class="anim-aux-grid">
                                        <div class="anim-aux-card">
                                            <span class="anim-aux-title">Auxiliary Hash Map (Value → Index)</span>
                                            <div class="anim-hashmap-list">
                                                <div class="anim-hashmap-row">
                                                    <span>Key: <strong>2</strong></span>
                                                    <span>Val: <strong>Index 0</strong></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `
                        },
                        {
                            title: 'Advance to nums[1] = 7 & Find Complement',
                            what: 'Advance pointer to i = 1 (nums[1] = 7). Calculate complement: 9 - 7 = 2. Check map: Key 2 IS in map at Index 0!',
                            why: 'The required value 2 was previously stored with index 0. We have successfully found the matching pair!',
                            variables: { i: 1, 'nums[1]': 7, target: 9, complement: 2, 'map': '{2: 0}', match: 'Found at idx 0' },
                            takeaway: 'The hash map instantly retrieves the complement index in O(1) time.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label">Target Match Found! (nums[0] + nums[1] = 2 + 7 = 9)</span>
                                    <div class="anim-array-wrap">
                                        <div class="anim-array-col">
                                            <span class="anim-pointer-pin pin-success">Match [0]</span>
                                            <div class="anim-array-cell active-matched">2</div>
                                            <span class="anim-index-sub">idx 0</span>
                                        </div>
                                        <div class="anim-array-col">
                                            <span class="anim-pointer-pin pin-success">i=1 [1]</span>
                                            <div class="anim-array-cell active-matched">7</div>
                                            <span class="anim-index-sub">idx 1</span>
                                        </div>
                                        <div class="anim-array-col">
                                            <span class="anim-pointer-pin pin-hidden">·</span>
                                            <div class="anim-array-cell cell-discarded">11</div>
                                            <span class="anim-index-sub">idx 2</span>
                                        </div>
                                        <div class="anim-array-col">
                                            <span class="anim-pointer-pin pin-hidden">·</span>
                                            <div class="anim-array-cell cell-discarded">15</div>
                                            <span class="anim-index-sub">idx 3</span>
                                        </div>
                                    </div>
                                    <div class="anim-aux-grid">
                                        <div class="anim-aux-card">
                                            <span class="anim-aux-title">Auxiliary Hash Map (Lookup 2)</span>
                                            <div class="anim-hashmap-list">
                                                <div class="anim-hashmap-row" style="border-color: #10B981; background: rgba(16, 185, 129, 0.1);">
                                                    <span>Key: <strong>2</strong> (Found!)</span>
                                                    <span>Val: <strong>Index 0</strong></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `
                        },
                        {
                            title: 'Return Solution Indices [0, 1]',
                            what: 'Construct result array with indices [0, 1] and return. Algorithmic execution terminates successfully.',
                            why: 'The problem requires the indices of the two numbers that add up to target. Elements nums[0] (2) + nums[1] (7) = 9.',
                            variables: { result: '[0, 1]', status: 'Completed', operations: 2 },
                            takeaway: 'Algorithm solved in exactly 2 element visits without checking remaining items.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label" style="color: #34D399;">Result Identified: return new int[]{0, 1}</span>
                                    <div class="anim-array-wrap">
                                        <div class="anim-array-col">
                                            <span class="anim-pointer-pin pin-success">Ans 0</span>
                                            <div class="anim-array-cell active-matched">2</div>
                                            <span class="anim-index-sub">idx 0</span>
                                        </div>
                                        <div class="anim-array-col">
                                            <span class="anim-pointer-pin pin-success">Ans 1</span>
                                            <div class="anim-array-cell active-matched">7</div>
                                            <span class="anim-index-sub">idx 1</span>
                                        </div>
                                    </div>
                                    <div style="font-family: var(--font-mono); font-size: 0.9rem; color: #10B981; font-weight: 700; margin-top: 14px;">
                                        ✓ Verified: nums[0] + nums[1] == 9
                                    </div>
                                </div>
                            `
                        }
                    ]
                },
                {
                    id: 'bruteforce',
                    name: 'Brute Force (Nested Loops)',
                    timeComplexity: 'O(n²)',
                    timeExplanation: 'Two nested loops examine all n*(n-1)/2 possible pairs in the array.',
                    spaceComplexity: 'O(1)',
                    spaceExplanation: 'Uses only two integer pointer variables without auxiliary collections.',
                    steps: [
                        {
                            title: 'Initialize Outer Loop i=0',
                            what: 'Fix pointer i at index 0 (nums[0] = 2). Prepare inner loop j to inspect subsequent elements starting at j = i + 1.',
                            why: 'Brute force checks every possible combination of two distinct indices (i, j) where i < j.',
                            variables: { i: 0, j: '—', 'nums[i]': 2, target: 9 },
                            takeaway: 'No memory is allocated, but checking every pair becomes prohibitively slow on large datasets.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label">Brute Force: Outer Loop i = 0</span>
                                    <div class="anim-array-wrap">
                                        <div class="anim-array-col">
                                            <span class="anim-pointer-pin">i=0</span>
                                            <div class="anim-array-cell active-examined">2</div>
                                            <span class="anim-index-sub">idx 0</span>
                                        </div>
                                        <div class="anim-array-col">
                                            <span class="anim-pointer-pin pin-hidden">·</span>
                                            <div class="anim-array-cell">7</div>
                                            <span class="anim-index-sub">idx 1</span>
                                        </div>
                                        <div class="anim-array-col">
                                            <span class="anim-pointer-pin pin-hidden">·</span>
                                            <div class="anim-array-cell">11</div>
                                            <span class="anim-index-sub">idx 2</span>
                                        </div>
                                        <div class="anim-array-col">
                                            <span class="anim-pointer-pin pin-hidden">·</span>
                                            <div class="anim-array-cell">15</div>
                                            <span class="anim-index-sub">idx 3</span>
                                        </div>
                                    </div>
                                </div>
                            `
                        },
                        {
                            title: 'Inspect Pair (i=0, j=1)',
                            what: 'Set inner pointer j = 1 (nums[1] = 7). Evaluate sum: nums[i] + nums[j] = 2 + 7 = 9. Compare with target 9.',
                            why: 'Testing the first candidate pair against the target sum condition.',
                            variables: { i: 0, j: 1, sum: 9, target: 9, match: 'true' },
                            takeaway: 'Checking sum == target. In this lucky test case, the first pair immediately matches!',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label">Checking Pair: nums[0] (2) + nums[1] (7) == 9</span>
                                    <div class="anim-array-wrap">
                                        <div class="anim-array-col">
                                            <span class="anim-pointer-pin pin-secondary">i=0</span>
                                            <div class="anim-array-cell active-matched">2</div>
                                            <span class="anim-index-sub">idx 0</span>
                                        </div>
                                        <div class="anim-array-col">
                                            <span class="anim-pointer-pin pin-secondary">j=1</span>
                                            <div class="anim-array-cell active-matched">7</div>
                                            <span class="anim-index-sub">idx 1</span>
                                        </div>
                                        <div class="anim-array-col">
                                            <span class="anim-pointer-pin pin-hidden">·</span>
                                            <div class="anim-array-cell cell-discarded">11</div>
                                            <span class="anim-index-sub">idx 2</span>
                                        </div>
                                        <div class="anim-array-col">
                                            <span class="anim-pointer-pin pin-hidden">·</span>
                                            <div class="anim-array-cell cell-discarded">15</div>
                                            <span class="anim-index-sub">idx 3</span>
                                        </div>
                                    </div>
                                </div>
                            `
                        },
                        {
                            title: 'Return Indices [0, 1]',
                            what: 'Sum matches target 9. Return result new int[]{0, 1}.',
                            why: 'Solution found. If it had not matched, j would advance to 2, 3, etc.',
                            variables: { result: '[0, 1]', status: 'Completed' },
                            takeaway: 'Notice that if the matching pair had been at the end of a 10,000-element array, brute force would perform 50 million checks.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label" style="color: #34D399;">Result: [0, 1]</span>
                                    <div class="anim-array-wrap">
                                        <div class="anim-array-col">
                                            <span class="anim-pointer-pin pin-success">Ans 0</span>
                                            <div class="anim-array-cell active-matched">2</div>
                                        </div>
                                        <div class="anim-array-col">
                                            <span class="anim-pointer-pin pin-success">Ans 1</span>
                                            <div class="anim-array-cell active-matched">7</div>
                                        </div>
                                    </div>
                                </div>
                            `
                        }
                    ]
                }
            ]
        },

        'reverse-a-string': {
            title: 'Reverse a String',
            canonicalId: 'reverse-a-string',
            approaches: [
                {
                    id: 'twopointers',
                    name: 'Two Pointers (In-Place Swap)',
                    timeComplexity: 'O(n)',
                    timeExplanation: 'Each character is visited once; loop runs n/2 times.',
                    spaceComplexity: 'O(1)',
                    spaceExplanation: 'Characters are swapped directly in-place without creating auxiliary buffers.',
                    steps: [
                        {
                            title: 'Initialize Left & Right Pointers',
                            what: 'String: "hello". Convert to char array [h, e, l, l, o]. Set left = 0, right = 4.',
                            why: 'Two pointers at opposing boundaries allow symmetrical convergence toward the center.',
                            variables: { left: 0, right: 4, 's[left]': 'h', 's[right]': 'o' },
                            takeaway: 'In-place reversal avoids memory reallocation.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label">Initial Character Array</span>
                                    <div class="anim-array-wrap">
                                        <div class="anim-array-col"><span class="anim-pointer-pin">L=0</span><div class="anim-array-cell active-examined">h</div><span class="anim-index-sub">0</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-hidden">·</span><div class="anim-array-cell">e</div><span class="anim-index-sub">1</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-hidden">·</span><div class="anim-array-cell">l</div><span class="anim-index-sub">2</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-hidden">·</span><div class="anim-array-cell">l</div><span class="anim-index-sub">3</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-secondary">R=4</span><div class="anim-array-cell active-examined">o</div><span class="anim-index-sub">4</span></div>
                                    </div>
                                </div>
                            `
                        },
                        {
                            title: 'Swap s[0] and s[4] (h ↔ o)',
                            what: 'Swap characters at left and right: s[0] becomes "o", s[4] becomes "h". Advance left to 1, decrement right to 3.',
                            why: 'Opposing characters swap places, establishing the reversed ordering at boundaries.',
                            variables: { left: 1, right: 3, swapped: "'h' ↔ 'o'" },
                            takeaway: 'Pointer increments ensure progressive narrowing of the unprocessed sub-array.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label">After First Swap ('h' ↔ 'o')</span>
                                    <div class="anim-array-wrap">
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-success">Done</span><div class="anim-array-cell active-matched">o</div><span class="anim-index-sub">0</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin">L=1</span><div class="anim-array-cell active-examined">e</div><span class="anim-index-sub">1</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-hidden">·</span><div class="anim-array-cell">l</div><span class="anim-index-sub">2</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-secondary">R=3</span><div class="anim-array-cell active-examined">l</div><span class="anim-index-sub">3</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-success">Done</span><div class="anim-array-cell active-matched">h</div><span class="anim-index-sub">4</span></div>
                                    </div>
                                </div>
                            `
                        },
                        {
                            title: 'Swap s[1] and s[3] (e ↔ l)',
                            what: 'Swap characters at left (1) and right (3): s[1] becomes "l", s[3] becomes "e". Advance left to 2, decrement right to 2.',
                            why: 'Continuing in-place swap toward center.',
                            variables: { left: 2, right: 2, swapped: "'e' ↔ 'l'" },
                            takeaway: 'Both pointers now point to index 2 (center character).',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label">After Second Swap ('e' ↔ 'l')</span>
                                    <div class="anim-array-wrap">
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-success">Done</span><div class="anim-array-cell active-matched">o</div><span class="anim-index-sub">0</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-success">Done</span><div class="anim-array-cell active-matched">l</div><span class="anim-index-sub">1</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin">L=R=2</span><div class="anim-array-cell active-swapped">l</div><span class="anim-index-sub">2</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-success">Done</span><div class="anim-array-cell active-matched">e</div><span class="anim-index-sub">3</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-success">Done</span><div class="anim-array-cell active-matched">h</div><span class="anim-index-sub">4</span></div>
                                    </div>
                                </div>
                            `
                        },
                        {
                            title: 'Pointers Meet (left >= right) — Complete',
                            what: 'left == right == 2. Loop condition (left < right) evaluates to false. Array is fully reversed: "olleh".',
                            why: 'The center element does not need swapping with itself.',
                            variables: { left: 2, right: 2, result: '"olleh"', status: 'Completed' },
                            takeaway: 'Reversal executed in exactly 2 swaps with zero extra allocations.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label" style="color: #34D399;">Reversal Complete: "olleh"</span>
                                    <div class="anim-array-wrap">
                                        <div class="anim-array-col"><div class="anim-array-cell active-matched">o</div></div>
                                        <div class="anim-array-col"><div class="anim-array-cell active-matched">l</div></div>
                                        <div class="anim-array-col"><div class="anim-array-cell active-matched">l</div></div>
                                        <div class="anim-array-col"><div class="anim-array-cell active-matched">e</div></div>
                                        <div class="anim-array-col"><div class="anim-array-cell active-matched">h</div></div>
                                    </div>
                                </div>
                            `
                        }
                    ]
                }
            ]
        },

        'binary-search': {
            title: 'Binary Search',
            canonicalId: 'binary-search',
            approaches: [
                {
                    id: 'iterative',
                    name: 'Iterative Interval Halving',
                    timeComplexity: 'O(log n)',
                    timeExplanation: 'Search interval is divided by 2 at every step; requires at most log₂(n) comparisons.',
                    spaceComplexity: 'O(1)',
                    spaceExplanation: 'Iterative state requires only three scalar pointer variables (low, mid, high).',
                    steps: [
                        {
                            title: 'Initialize Search Space [0..7]',
                            what: 'Sorted array of 8 elements. Target = 11. Set low = 0, high = 7.',
                            why: 'Binary search requires sorted data so it can guarantee that half of all elements can be discarded per step.',
                            variables: { low: 0, high: 7, target: 11 },
                            takeaway: 'Initial search space covers all 8 items.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label">Target = 11 | Range [0..7]</span>
                                    <div class="anim-array-wrap">
                                        <div class="anim-array-col"><span class="anim-pointer-pin">low=0</span><div class="anim-array-cell active-examined">1</div><span class="anim-index-sub">0</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-hidden">·</span><div class="anim-array-cell">3</div><span class="anim-index-sub">1</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-hidden">·</span><div class="anim-array-cell">5</div><span class="anim-index-sub">2</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-hidden">·</span><div class="anim-array-cell">7</div><span class="anim-index-sub">3</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-hidden">·</span><div class="anim-array-cell">9</div><span class="anim-index-sub">4</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-hidden">·</span><div class="anim-array-cell">11</div><span class="anim-index-sub">5</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-hidden">·</span><div class="anim-array-cell">13</div><span class="anim-index-sub">6</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-secondary">high=7</span><div class="anim-array-cell active-examined">15</div><span class="anim-index-sub">7</span></div>
                                    </div>
                                </div>
                            `
                        },
                        {
                            title: 'Calculate mid = 3, Discard Lower Half',
                            what: 'mid = 0 + (7 - 0)/2 = 3 (nums[3] = 7). Compare: 7 < 11. Target is strictly greater, so target must lie in [4..7]. Set low = mid + 1 = 4.',
                            why: 'Because the array is sorted, no value at or before index 3 can equal 11. We discard the entire left half.',
                            variables: { low: 4, mid: 3, high: 7, 'nums[mid]': 7, target: 11 },
                            takeaway: '4 out of 8 elements eliminated in a single comparison!',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label">nums[3]=7 &lt; 11: Discard [0..3], low = 4</span>
                                    <div class="anim-array-wrap">
                                        <div class="anim-array-col"><div class="anim-array-cell cell-discarded">1</div><span class="anim-index-sub">0</span></div>
                                        <div class="anim-array-col"><div class="anim-array-cell cell-discarded">3</div><span class="anim-index-sub">1</span></div>
                                        <div class="anim-array-col"><div class="anim-array-cell cell-discarded">5</div><span class="anim-index-sub">2</span></div>
                                        <div class="anim-array-col"><div class="anim-array-cell cell-discarded">7</div><span class="anim-index-sub">3</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin">low=4</span><div class="anim-array-cell active-examined">9</div><span class="anim-index-sub">4</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-hidden">·</span><div class="anim-array-cell">11</div><span class="anim-index-sub">5</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-hidden">·</span><div class="anim-array-cell">13</div><span class="anim-index-sub">6</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-secondary">high=7</span><div class="anim-array-cell active-examined">15</div><span class="anim-index-sub">7</span></div>
                                    </div>
                                </div>
                            `
                        },
                        {
                            title: 'Calculate mid = 5 & Match Target 11',
                            what: 'mid = 4 + (7 - 4)/2 = 5 (nums[5] = 11). Compare: nums[5] == 11. Target matched!',
                            why: 'The midpoint value equals the target. Search terminates immediately.',
                            variables: { low: 4, mid: 5, high: 7, 'nums[mid]': 11, match: 'Found!' },
                            takeaway: 'Matched in only 2 comparisons out of 8 elements.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label" style="color: #34D399;">Target Match: nums[5] == 11!</span>
                                    <div class="anim-array-wrap">
                                        <div class="anim-array-col"><div class="anim-array-cell cell-discarded">1</div><span class="anim-index-sub">0</span></div>
                                        <div class="anim-array-col"><div class="anim-array-cell cell-discarded">3</div><span class="anim-index-sub">1</span></div>
                                        <div class="anim-array-col"><div class="anim-array-cell cell-discarded">5</div><span class="anim-index-sub">2</span></div>
                                        <div class="anim-array-col"><div class="anim-array-cell cell-discarded">7</div><span class="anim-index-sub">3</span></div>
                                        <div class="anim-array-col"><div class="anim-array-cell cell-discarded">9</div><span class="anim-index-sub">4</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-success">mid=5</span><div class="anim-array-cell active-matched">11</div><span class="anim-index-sub">5</span></div>
                                        <div class="anim-array-col"><div class="anim-array-cell cell-discarded">13</div><span class="anim-index-sub">6</span></div>
                                        <div class="anim-array-col"><div class="anim-array-cell cell-discarded">15</div><span class="anim-index-sub">7</span></div>
                                    </div>
                                </div>
                            `
                        },
                        {
                            title: 'Return Index 5',
                            what: 'Return index 5 as the result. Search ends successfully.',
                            why: 'Problem requests target index.',
                            variables: { result: 5, status: 'Completed', comparisons: 2 },
                            takeaway: 'Logarithmic efficiency scales effortlessly even to millions of items.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label" style="color: #10B981;">Return Index: 5</span>
                                    <div class="anim-array-wrap">
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-success">Index 5</span><div class="anim-array-cell active-matched">11</div></div>
                                    </div>
                                </div>
                            `
                        }
                    ]
                }
            ]
        },

        'valid-parentheses': {
            title: 'Valid Parentheses',
            canonicalId: 'valid-parentheses',
            approaches: [
                {
                    id: 'stack',
                    name: 'Stack (LIFO Bracket Matching)',
                    timeComplexity: 'O(n)',
                    timeExplanation: 'Each character is pushed and popped from the stack at most once in O(1) time.',
                    spaceComplexity: 'O(n)',
                    spaceExplanation: 'Stack stores up to n opening brackets in the worst-case scenario (e.g., "((((").',
                    steps: [
                        {
                            title: 'Initialize Empty Stack & Inspect "{"',
                            what: 'Input: "{ [ ] ( ) }". Read "{". It is an opening bracket, so push "{" onto stack.',
                            why: 'LIFO (Last-In-First-Out) ensures the most recently opened bracket is the first to be closed.',
                            variables: { char: '{', type: 'Open', stack: "['{']" },
                            takeaway: 'Opening brackets wait on the stack for their corresponding closers.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label">Push '{' to Stack</span>
                                    <div class="anim-aux-grid">
                                        <div class="anim-aux-card">
                                            <span class="anim-aux-title">Call Stack (LIFO)</span>
                                            <div class="anim-stack-wrap">
                                                <div class="anim-stack-item">{</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `
                        },
                        {
                            title: 'Inspect "[" — Push to Stack',
                            what: 'Read "[". It is an opening bracket, so push "[" onto stack. Stack now has 2 items.',
                            why: 'Nested scopes require stacking openings in chronological sequence.',
                            variables: { char: '[', type: 'Open', stack: "['{', '[']" },
                            takeaway: 'Top of stack is always the active enclosing scope.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label">Push '[' to Stack</span>
                                    <div class="anim-aux-grid">
                                        <div class="anim-aux-card">
                                            <span class="anim-aux-title">Call Stack (LIFO)</span>
                                            <div class="anim-stack-wrap">
                                                <div class="anim-stack-item">{</div>
                                                <div class="anim-stack-item">[</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `
                        },
                        {
                            title: 'Inspect "]" — Match & Pop "["',
                            what: 'Read "]". Closing bracket encountered. Pop top of stack: "[". Matches "]" perfectly!',
                            why: 'The innermost opening bracket was closed validly.',
                            variables: { char: ']', popped: '[', match: 'Valid', stack: "['{']" },
                            takeaway: 'A matching pop removes the inner bracket, uncovering the outer scope.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label" style="color: #34D399;">Pop & Match '[' with ']'</span>
                                    <div class="anim-aux-grid">
                                        <div class="anim-aux-card">
                                            <span class="anim-aux-title">Call Stack (LIFO)</span>
                                            <div class="anim-stack-wrap">
                                                <div class="anim-stack-item">{</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `
                        },
                        {
                            title: 'Process "(", ")", and "}" — Empty Stack',
                            what: 'Process "(" (push), ")" (pop and match), then "}" (pop and match "{"). All brackets matched. Stack is completely empty!',
                            why: 'Every opening bracket received a valid closing partner in correct nested order.',
                            variables: { stack: '[]', result: 'true', status: 'Valid' },
                            takeaway: 'A valid string always leaves an empty stack at the end.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label" style="color: #10B981;">Validation Complete: return true</span>
                                    <div class="anim-aux-grid">
                                        <div class="anim-aux-card">
                                            <span class="anim-aux-title">Call Stack (Empty = Valid)</span>
                                            <div class="anim-stack-wrap" style="align-items: center; justify-content: center;">
                                                <span style="color: #10B981; font-weight: 700;">✓ Empty</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `
                        }
                    ]
                }
            ]
        },

        'longest-substring': {
            title: 'Longest Substring Without Repeating Characters',
            canonicalId: 'longest-substring',
            approaches: [
                {
                    id: 'slidingwindow',
                    name: 'Sliding Window (Hash Set)',
                    timeComplexity: 'O(n)',
                    timeExplanation: 'Both left and right pointers traverse the string at most once (2n steps total).',
                    spaceComplexity: 'O(min(m, n))',
                    spaceExplanation: 'Auxiliary hash set stores distinct characters bounded by alphabet size m.',
                    steps: [
                        {
                            title: 'Expand Window [0..2] with "abc"',
                            what: 'Input: "abcabcbb". Window expands from right=0 to 2 without duplicates. Set: {a, b, c}. Current maxLen = 3.',
                            why: 'As long as characters are distinct, expanding right increases the valid window length.',
                            variables: { left: 0, right: 2, window: '"abc"', maxLen: 3, set: '{a, b, c}' },
                            takeaway: 'The window represents the active contiguous non-repeating sequence.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label">Window: "abc" (Length 3)</span>
                                    <div class="anim-array-wrap">
                                        <div class="anim-array-col"><span class="anim-pointer-pin">L=0</span><div class="anim-array-cell active-matched">a</div><span class="anim-index-sub">0</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-hidden">·</span><div class="anim-array-cell active-matched">b</div><span class="anim-index-sub">1</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-secondary">R=2</span><div class="anim-array-cell active-matched">c</div><span class="anim-index-sub">2</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-hidden">·</span><div class="anim-array-cell">a</div><span class="anim-index-sub">3</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-hidden">·</span><div class="anim-array-cell">b</div><span class="anim-index-sub">4</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-hidden">·</span><div class="anim-array-cell">c</div><span class="anim-index-sub">5</span></div>
                                    </div>
                                </div>
                            `
                        },
                        {
                            title: 'Duplicate "a" at right=3 — Shrink Left',
                            what: 'At right=3, character is "a", which is already in set! Shrink window from left: remove s[0] ("a"), advance left to 1. Now add new "a". Window: "bca".',
                            why: 'When duplicate occurs, advancing left restores the unique character invariant.',
                            variables: { left: 1, right: 3, window: '"bca"', maxLen: 3, duplicate: "'a'" },
                            takeaway: 'Sliding window adjusts its left edge dynamically to discard duplicate elements.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label">Duplicate 'a' detected! Left advances to 1</span>
                                    <div class="anim-array-wrap">
                                        <div class="anim-array-col"><div class="anim-array-cell cell-discarded">a</div><span class="anim-index-sub">0</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin">L=1</span><div class="anim-array-cell active-examined">b</div><span class="anim-index-sub">1</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-hidden">·</span><div class="anim-array-cell active-examined">c</div><span class="anim-index-sub">2</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-secondary">R=3</span><div class="anim-array-cell active-examined">a</div><span class="anim-index-sub">3</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-hidden">·</span><div class="anim-array-cell">b</div><span class="anim-index-sub">4</span></div>
                                    </div>
                                </div>
                            `
                        },
                        {
                            title: 'Complete Traversal — Final maxLen = 3',
                            what: 'Traversing the rest of string yields no window larger than 3. Return maxLen = 3 ("abc").',
                            why: 'All substrings examined in single linear pass without re-scanning characters.',
                            variables: { maxLen: 3, result: 3, status: 'Completed' },
                            takeaway: 'Sliding window avoids quadratic O(n²) string slicing.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label" style="color: #34D399;">Result: Maximum Length = 3</span>
                                    <div class="anim-array-wrap">
                                        <div class="anim-array-col"><div class="anim-array-cell active-matched">a</div></div>
                                        <div class="anim-array-col"><div class="anim-array-cell active-matched">b</div></div>
                                        <div class="anim-array-col"><div class="anim-array-cell active-matched">c</div></div>
                                    </div>
                                </div>
                            `
                        }
                    ]
                }
            ]
        },

        'merge-intervals': {
            title: 'Merge Intervals',
            canonicalId: 'merge-intervals',
            approaches: [
                {
                    id: 'sort-greedy',
                    name: 'Sort & Greedy Merge',
                    timeComplexity: 'O(n log n)',
                    timeExplanation: 'Sorting intervals by starting point dominates; subsequent linear merge takes O(n).',
                    spaceComplexity: 'O(n)',
                    spaceExplanation: 'Result list stores the merged intervals.',
                    steps: [
                        {
                            title: 'Sort Intervals by Start Time',
                            what: 'Input: [[1,3], [2,6], [8,10], [15,18]]. Sort intervals by start time. Initialize result with first interval: [1, 3].',
                            why: 'Sorting guarantees that all intervals that could possibly overlap appear consecutively.',
                            variables: { current: '[1, 3]', next: '[2, 6]', merged: '[[1, 3]]' },
                            takeaway: 'Sorting converts an arbitrary pairing problem into an ordered linear consolidation.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label">Sorted Intervals & First Entry [1, 3]</span>
                                    <div class="anim-array-wrap">
                                        <div class="anim-array-col"><div class="anim-array-cell active-examined">[1, 3]</div></div>
                                        <div class="anim-array-col"><div class="anim-array-cell">[2, 6]</div></div>
                                        <div class="anim-array-col"><div class="anim-array-cell">[8, 10]</div></div>
                                        <div class="anim-array-col"><div class="anim-array-cell">[15, 18]</div></div>
                                    </div>
                                </div>
                            `
                        },
                        {
                            title: 'Overlap Detected: Merge [1, 3] & [2, 6] → [1, 6]',
                            what: 'Compare next interval [2, 6] with active interval [1, 3]. Start 2 <= 3 (overlap!). New end = max(3, 6) = 6. Active interval becomes [1, 6].',
                            why: 'Because 2 is before or at 3, the two intervals span continuously from 1 to 6.',
                            variables: { overlap: 'true', newEnd: 6, merged: '[[1, 6]]' },
                            takeaway: 'End boundary extends to the maximum of the overlapping ends.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label" style="color: #FBBF24;">Merged: [1, 3] + [2, 6] → [1, 6]</span>
                                    <div class="anim-array-wrap">
                                        <div class="anim-array-col"><div class="anim-array-cell active-swapped">[1, 6]</div></div>
                                        <div class="anim-array-col"><div class="anim-array-cell">[8, 10]</div></div>
                                        <div class="anim-array-col"><div class="anim-array-cell">[15, 18]</div></div>
                                    </div>
                                </div>
                            `
                        },
                        {
                            title: 'No Overlap: Append [8, 10] & [15, 18]',
                            what: '[8, 10] has start 8 > 6 (no overlap). Append [8, 10]. [15, 18] has start 15 > 10 (no overlap). Append [15, 18]. Result: [[1,6], [8,10], [15,18]].',
                            why: 'When no overlap occurs, the previous merged interval is final and the next starts a new boundary.',
                            variables: { result: '[[1,6], [8,10], [15,18]]', totalIntervals: 3 },
                            takeaway: 'Result returned in linear scan after sorting.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label" style="color: #34D399;">Final Merged Intervals: [[1,6], [8,10], [15,18]]</span>
                                    <div class="anim-array-wrap">
                                        <div class="anim-array-col"><div class="anim-array-cell active-matched">[1, 6]</div></div>
                                        <div class="anim-array-col"><div class="anim-array-cell active-matched">[8, 10]</div></div>
                                        <div class="anim-array-col"><div class="anim-array-cell active-matched">[15, 18]</div></div>
                                    </div>
                                </div>
                            `
                        }
                    ]
                }
            ]
        },

        'reverse-linked-list': {
            title: 'Reverse Linked List',
            canonicalId: 'reverse-linked-list',
            approaches: [
                {
                    id: 'iterative-pointers',
                    name: 'Iterative 3-Pointer Reversal',
                    timeComplexity: 'O(n)',
                    timeExplanation: 'Traverses each node in the linked list exactly once.',
                    spaceComplexity: 'O(1)',
                    spaceExplanation: 'Maintains only three pointer references (prev, curr, next) regardless of list size.',
                    steps: [
                        {
                            title: 'Initialize prev = null, curr = Node(1)',
                            what: 'List: 1 -> 2 -> 3 -> 4 -> null. Set prev = null, curr = head (1). Save next = curr.next (2).',
                            why: 'Reversing a unidirectional pointer requires caching the next node before overwriting .next.',
                            variables: { prev: 'null', curr: '1', next: '2' },
                            takeaway: 'Always save curr.next first so you never lose the remainder of the list.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label">Initial State: prev=null, curr=1</span>
                                    <div class="anim-ll-wrap">
                                        <div class="anim-ll-node active-examined"><span class="anim-ll-val">1</span><span class="anim-ll-ptr">next</span></div>
                                        <span class="anim-ll-arrow">→</span>
                                        <div class="anim-ll-node"><span class="anim-ll-val">2</span><span class="anim-ll-ptr">next</span></div>
                                        <span class="anim-ll-arrow">→</span>
                                        <div class="anim-ll-node"><span class="anim-ll-val">3</span><span class="anim-ll-ptr">next</span></div>
                                        <span class="anim-ll-arrow">→</span>
                                        <div class="anim-ll-node"><span class="anim-ll-val">4</span><span class="anim-ll-ptr">null</span></div>
                                    </div>
                                </div>
                            `
                        },
                        {
                            title: 'Reverse curr.next = prev (1 -> null)',
                            what: 'Set curr.next = prev (1.next = null). Advance prev = 1, curr = next (2).',
                            why: 'Node 1 now points backward to null (becoming the new tail).',
                            variables: { prev: '1', curr: '2', '1.next': 'null' },
                            takeaway: 'Pointer redirection happens one link at a time.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label">Reversed Node 1 (1 -> null)</span>
                                    <div class="anim-ll-wrap">
                                        <div class="anim-ll-node active-matched"><span class="anim-ll-val">1</span><span class="anim-ll-ptr">null</span></div>
                                        <div style="margin: 0 10px; color: var(--color-text-muted);">| curr=2:</div>
                                        <div class="anim-ll-node active-examined"><span class="anim-ll-val">2</span><span class="anim-ll-ptr">→3</span></div>
                                        <span class="anim-ll-arrow">→</span>
                                        <div class="anim-ll-node"><span class="anim-ll-val">3</span></div>
                                        <span class="anim-ll-arrow">→</span>
                                        <div class="anim-ll-node"><span class="anim-ll-val">4</span></div>
                                    </div>
                                </div>
                            `
                        },
                        {
                            title: 'Reverse Nodes 2, 3, and 4',
                            what: 'Repeat process for all nodes: 2.next = 1, 3.next = 2, 4.next = 3. Finally curr = null, prev = Node(4).',
                            why: 'When curr hits null, prev points to the new head of the reversed list.',
                            variables: { curr: 'null', prev: '4', newHead: '4' },
                            takeaway: 'Return prev as the new head: 4 -> 3 -> 2 -> 1 -> null.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label" style="color: #34D399;">Reversal Complete: 4 -> 3 -> 2 -> 1 -> null</span>
                                    <div class="anim-ll-wrap">
                                        <div class="anim-ll-node active-matched"><span class="anim-ll-val">4</span><span class="anim-ll-ptr">next</span></div>
                                        <span class="anim-ll-arrow">→</span>
                                        <div class="anim-ll-node active-matched"><span class="anim-ll-val">3</span><span class="anim-ll-ptr">next</span></div>
                                        <span class="anim-ll-arrow">→</span>
                                        <div class="anim-ll-node active-matched"><span class="anim-ll-val">2</span><span class="anim-ll-ptr">next</span></div>
                                        <span class="anim-ll-arrow">→</span>
                                        <div class="anim-ll-node active-matched"><span class="anim-ll-val">1</span><span class="anim-ll-ptr">null</span></div>
                                    </div>
                                </div>
                            `
                        }
                    ]
                }
            ]
        },

        'invert-binary-tree': {
            title: 'Invert Binary Tree',
            canonicalId: 'invert-binary-tree',
            approaches: [
                {
                    id: 'recursive-dfs',
                    name: 'Recursive Depth-First Swap',
                    timeComplexity: 'O(n)',
                    timeExplanation: 'Every node in the tree is visited once to invert its left and right children.',
                    spaceComplexity: 'O(h)',
                    spaceExplanation: 'Recursion stack depth is proportional to tree height h (O(log n) balanced, O(n) skewed).',
                    steps: [
                        {
                            title: 'Visit Root (4) & Inspect Children (2, 7)',
                            what: 'Root is 4. Left child is subtree rooted at 2, right child is subtree rooted at 7.',
                            why: 'Inverting a binary tree requires swapping the left and right pointers of every node.',
                            variables: { root: 4, left: 2, right: 7 },
                            takeaway: 'Root swap: 4.left becomes 7, 4.right becomes 2.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label">Original Tree: Root 4</span>
                                    <div class="anim-tree-wrap">
                                        <div class="anim-tree-row"><div class="anim-tree-node active-examined">4</div></div>
                                        <div class="anim-tree-row">
                                            <div class="anim-tree-node">2</div>
                                            <div class="anim-tree-node">7</div>
                                        </div>
                                    </div>
                                </div>
                            `
                        },
                        {
                            title: 'Swap Root Children (4.left ↔ 4.right)',
                            what: 'Swap pointers: 4.left now points to 7, 4.right now points to 2.',
                            why: 'Symmetrical reflection at root level.',
                            variables: { '4.left': 7, '4.right': 2, status: 'Root inverted' },
                            takeaway: 'Now recursively invert the left and right subtrees.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label" style="color: #FBBF24;">Children Swapped at Root 4</span>
                                    <div class="anim-tree-wrap">
                                        <div class="anim-tree-row"><div class="anim-tree-node active-matched">4</div></div>
                                        <div class="anim-tree-row">
                                            <div class="anim-tree-node active-swapped">7</div>
                                            <div class="anim-tree-node active-swapped">2</div>
                                        </div>
                                    </div>
                                </div>
                            `
                        },
                        {
                            title: 'Recurse on Subtrees & Complete',
                            what: 'Recurse on 7: swap its children (6, 9) → (9, 6). Recurse on 2: swap its children (1, 3) → (3, 1). Return root.',
                            why: 'Every level is inverted recursively.',
                            variables: { status: 'Fully inverted', result: 'root(4)' },
                            takeaway: 'Binary tree is now an exact mirror image of the original.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label" style="color: #34D399;">Inverted Binary Tree Complete</span>
                                    <div class="anim-tree-wrap">
                                        <div class="anim-tree-row"><div class="anim-tree-node active-matched">4</div></div>
                                        <div class="anim-tree-row">
                                            <div class="anim-tree-node active-matched">7</div>
                                            <div class="anim-tree-node active-matched">2</div>
                                        </div>
                                    </div>
                                </div>
                            `
                        }
                    ]
                }
            ]
        },

        'number-of-islands': {
            title: 'Number of Islands',
            canonicalId: 'number-of-islands',
            approaches: [
                {
                    id: 'bfs-floodfill',
                    name: 'BFS / DFS Grid Flood Fill',
                    timeComplexity: 'O(M × N)',
                    timeExplanation: 'Every cell in the M x N grid is visited at most a constant number of times.',
                    spaceComplexity: 'O(min(M, N))',
                    spaceExplanation: 'In BFS, queue stores boundary cells bounded by min(M, N).',
                    steps: [
                        {
                            title: 'Scan Grid & Detect Island 1 at (0, 0)',
                            what: '4x5 binary grid. Scan row by row. At (0, 0), find "1" (unvisited land). Increment islandsCount = 1.',
                            why: 'Finding an unvisited "1" marks the discovery of a distinct connected landmass.',
                            variables: { row: 0, col: 0, islandsCount: 1, action: 'Trigger flood fill' },
                            takeaway: 'Each unvisited land trigger increments the global island count.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label">Grid: Land Found at (0, 0) · islandsCount = 1</span>
                                    <div class="anim-matrix-grid" style="grid-template-columns: repeat(5, 36px);">
                                        <div class="anim-matrix-cell cell-visited">1</div><div class="anim-matrix-cell cell-land">1</div><div class="anim-matrix-cell cell-water">0</div><div class="anim-matrix-cell cell-water">0</div><div class="anim-matrix-cell cell-water">0</div>
                                        <div class="anim-matrix-cell cell-land">1</div><div class="anim-matrix-cell cell-land">1</div><div class="anim-matrix-cell cell-water">0</div><div class="anim-matrix-cell cell-water">0</div><div class="anim-matrix-cell cell-water">0</div>
                                        <div class="anim-matrix-cell cell-water">0</div><div class="anim-matrix-cell cell-water">0</div><div class="anim-matrix-cell cell-land">1</div><div class="anim-matrix-cell cell-water">0</div><div class="anim-matrix-cell cell-water">0</div>
                                        <div class="anim-matrix-cell cell-water">0</div><div class="anim-matrix-cell cell-water">0</div><div class="anim-matrix-cell cell-water">0</div><div class="anim-matrix-cell cell-land">1</div><div class="anim-matrix-cell cell-land">1</div>
                                    </div>
                                </div>
                            `
                        },
                        {
                            title: 'Flood Fill: Mark Connected Cells as Visited',
                            what: 'Run BFS/DFS from (0, 0): visit (0, 1), (1, 0), and (1, 1). Sink or mark cells with "#" so they are not re-counted.',
                            why: 'Sinking land cells prevents the scanner from counting the same island multiple times.',
                            variables: { marked: '4 cells', islandsCount: 1 },
                            takeaway: 'Connected components are completely absorbed in one flood fill.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label" style="color: #FBBF24;">Flood Fill Sinks Island 1</span>
                                    <div class="anim-matrix-grid" style="grid-template-columns: repeat(5, 36px);">
                                        <div class="anim-matrix-cell cell-visited">#</div><div class="anim-matrix-cell cell-visited">#</div><div class="anim-matrix-cell cell-water">0</div><div class="anim-matrix-cell cell-water">0</div><div class="anim-matrix-cell cell-water">0</div>
                                        <div class="anim-matrix-cell cell-visited">#</div><div class="anim-matrix-cell cell-visited">#</div><div class="anim-matrix-cell cell-water">0</div><div class="anim-matrix-cell cell-water">0</div><div class="anim-matrix-cell cell-water">0</div>
                                        <div class="anim-matrix-cell cell-water">0</div><div class="anim-matrix-cell cell-water">0</div><div class="anim-matrix-cell cell-land">1</div><div class="anim-matrix-cell cell-water">0</div><div class="anim-matrix-cell cell-water">0</div>
                                        <div class="anim-matrix-cell cell-water">0</div><div class="anim-matrix-cell cell-water">0</div><div class="anim-matrix-cell cell-water">0</div><div class="anim-matrix-cell cell-land">1</div><div class="anim-matrix-cell cell-land">1</div>
                                    </div>
                                </div>
                            `
                        },
                        {
                            title: 'Scan Next Islands — Final Count = 3',
                            what: 'Continue scanning: discover Island 2 at (2, 2) and Island 3 at (3, 3). Sink both. Return total islands = 3.',
                            why: 'All cells checked; 3 isolated components found.',
                            variables: { totalIslands: 3, status: 'Completed' },
                            takeaway: 'Result = 3 islands identified across the grid.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label" style="color: #34D399;">Scan Complete: 3 Islands Counted</span>
                                    <div class="anim-matrix-grid" style="grid-template-columns: repeat(5, 36px);">
                                        <div class="anim-matrix-cell cell-visited">#</div><div class="anim-matrix-cell cell-visited">#</div><div class="anim-matrix-cell cell-water">0</div><div class="anim-matrix-cell cell-water">0</div><div class="anim-matrix-cell cell-water">0</div>
                                        <div class="anim-matrix-cell cell-visited">#</div><div class="anim-matrix-cell cell-visited">#</div><div class="anim-matrix-cell cell-water">0</div><div class="anim-matrix-cell cell-water">0</div><div class="anim-matrix-cell cell-water">0</div>
                                        <div class="anim-matrix-cell cell-water">0</div><div class="anim-matrix-cell cell-water">0</div><div class="anim-matrix-cell cell-visited">#</div><div class="anim-matrix-cell cell-water">0</div><div class="anim-matrix-cell cell-water">0</div>
                                        <div class="anim-matrix-cell cell-water">0</div><div class="anim-matrix-cell cell-water">0</div><div class="anim-matrix-cell cell-water">0</div><div class="anim-matrix-cell cell-visited">#</div><div class="anim-matrix-cell cell-visited">#</div>
                                    </div>
                                </div>
                            `
                        }
                    ]
                }
            ]
        },

        'climbing-stairs': {
            title: 'Climbing Stairs',
            canonicalId: 'climbing-stairs',
            approaches: [
                {
                    id: 'dp-bottom-up',
                    name: 'Dynamic Programming (State Transitions)',
                    timeComplexity: 'O(n)',
                    timeExplanation: 'Calculates each state from 3 to n once in a single linear pass.',
                    spaceComplexity: 'O(1)',
                    spaceExplanation: 'Uses two rolling variables (prev1, prev2) instead of a full DP array.',
                    steps: [
                        {
                            title: 'Define Base Cases dp[1] = 1, dp[2] = 2',
                            what: 'Target: n = 5 steps. Base cases: 1 step has 1 way ([1]). 2 steps have 2 ways ([1,1] or [2]).',
                            why: 'To reach step i, you either take 1 step from (i-1) or 2 steps from (i-2): dp[i] = dp[i-1] + dp[i-2].',
                            variables: { n: 5, 'dp[1]': 1, 'dp[2]': 2 },
                            takeaway: 'This recurrence is structurally identical to the Fibonacci sequence.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label">Base States: dp[1]=1, dp[2]=2</span>
                                    <div class="anim-array-wrap">
                                        <div class="anim-array-col"><span class="anim-pointer-pin">Base 1</span><div class="anim-array-cell active-examined">1</div><span class="anim-index-sub">step 1</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin">Base 2</span><div class="anim-array-cell active-examined">2</div><span class="anim-index-sub">step 2</span></div>
                                        <div class="anim-array-col"><div class="anim-array-cell">?</div><span class="anim-index-sub">step 3</span></div>
                                        <div class="anim-array-col"><div class="anim-array-cell">?</div><span class="anim-index-sub">step 4</span></div>
                                        <div class="anim-array-col"><div class="anim-array-cell">?</div><span class="anim-index-sub">step 5</span></div>
                                    </div>
                                </div>
                            `
                        },
                        {
                            title: 'Compute dp[3] = dp[2] + dp[1] = 3',
                            what: 'dp[3] = 2 + 1 = 3 ways. Rolling variables advance: prev2 = 2, prev1 = 3.',
                            why: 'Optimal substructure allows building the solution from smaller subproblems.',
                            variables: { step: 3, 'dp[3]': 3, prev2: 2, prev1: 3 },
                            takeaway: 'dp[3] = 3 distinct routes to step 3.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label">dp[3] = dp[2] + dp[1] = 2 + 1 = 3</span>
                                    <div class="anim-array-wrap">
                                        <div class="anim-array-col"><div class="anim-array-cell cell-discarded">1</div><span class="anim-index-sub">step 1</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin">prev2</span><div class="anim-array-cell active-examined">2</div><span class="anim-index-sub">step 2</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-secondary">dp[3]</span><div class="anim-array-cell active-swapped">3</div><span class="anim-index-sub">step 3</span></div>
                                        <div class="anim-array-col"><div class="anim-array-cell">?</div><span class="anim-index-sub">step 4</span></div>
                                        <div class="anim-array-col"><div class="anim-array-cell">?</div><span class="anim-index-sub">step 5</span></div>
                                    </div>
                                </div>
                            `
                        },
                        {
                            title: 'Compute dp[4] = 5 and dp[5] = 8',
                            what: 'dp[4] = 3 + 2 = 5 ways. Finally dp[5] = 5 + 3 = 8 ways. Target step n = 5 reached!',
                            why: 'Linear transitions conclude at target stair n.',
                            variables: { n: 5, 'dp[5]': 8, result: 8, status: 'Completed' },
                            takeaway: 'Result: Exactly 8 distinct ways to climb 5 stairs.',
                            render: () => `
                                <div class="anim-visual-block">
                                    <span class="anim-block-label" style="color: #34D399;">Result: dp[5] = 8 Distinct Ways</span>
                                    <div class="anim-array-wrap">
                                        <div class="anim-array-col"><div class="anim-array-cell cell-discarded">1</div><span class="anim-index-sub">1</span></div>
                                        <div class="anim-array-col"><div class="anim-array-cell cell-discarded">2</div><span class="anim-index-sub">2</span></div>
                                        <div class="anim-array-col"><div class="anim-array-cell cell-discarded">3</div><span class="anim-index-sub">3</span></div>
                                        <div class="anim-array-col"><div class="anim-array-cell cell-discarded">5</div><span class="anim-index-sub">4</span></div>
                                        <div class="anim-array-col"><span class="anim-pointer-pin pin-success">Ans</span><div class="anim-array-cell active-matched">8</div><span class="anim-index-sub">step 5</span></div>
                                    </div>
                                </div>
                            `
                        }
                    ]
                }
            ]
        }
    };

    // -------------------------------------------------------------------------
    // 2. State & Controller
    // -------------------------------------------------------------------------
    let currentProblem = null;
    let currentAnimation = null;
    let activeApproach = null;
    let currentStepIndex = 0;
    let isPlaying = false;
    let playIntervalId = null;
    let playbackSpeed = 1.0;

    // DOM Cache
    const dom = {};

    function cacheDom() {
        dom.animProblemId = document.getElementById('animProblemId');
        dom.animProblemTitle = document.getElementById('animProblemTitle');
        dom.animDiffBadge = document.getElementById('animDiffBadge');
        dom.animTopicTag = document.getElementById('animTopicTag');
        dom.animPatternTag = document.getElementById('animPatternTag');

        dom.approachSelectorWrap = document.getElementById('approachSelectorWrap');
        dom.selectApproach = document.getElementById('selectApproach');

        dom.btnBackToProblem = document.getElementById('btnBackToProblem');
        dom.themeToggleBtn = document.getElementById('themeToggleBtn');

        dom.viewActiveAnimation = document.getElementById('viewActiveAnimation');
        dom.viewComingSoon = document.getElementById('viewComingSoon');

        dom.stageApproachHeading = document.getElementById('stageApproachHeading');
        dom.stageStepTagline = document.getElementById('stageStepTagline');
        dom.selectAnimSpeed = document.getElementById('selectAnimSpeed');
        dom.animCanvas = document.getElementById('animCanvas');

        dom.btnAnimPrev = document.getElementById('btnAnimPrev');
        dom.btnAnimPlayPause = document.getElementById('btnAnimPlayPause');
        dom.btnPlayText = document.getElementById('btnPlayText');
        dom.btnAnimNext = document.getElementById('btnAnimNext');
        dom.btnAnimRestart = document.getElementById('btnAnimRestart');
        dom.animStepCounter = document.getElementById('animStepCounter');
        dom.animProgressBar = document.getElementById('animProgressBar');

        dom.infoStepBadge = document.getElementById('infoStepBadge');
        dom.stepTitle = document.getElementById('stepTitle');
        dom.stepWhat = document.getElementById('stepWhat');
        dom.stepWhy = document.getElementById('stepWhy');
        dom.variablesGrid = document.getElementById('variablesGrid');
        dom.stepTakeaway = document.getElementById('stepTakeaway');

        dom.badgeTimeComplexity = document.getElementById('badgeTimeComplexity');
        dom.textTimeComplexity = document.getElementById('textTimeComplexity');
        dom.badgeSpaceComplexity = document.getElementById('badgeSpaceComplexity');
        dom.textSpaceComplexity = document.getElementById('textSpaceComplexity');

        dom.btnSidebarBack = document.getElementById('btnSidebarBack');

        dom.comingSoonTitle = document.getElementById('comingSoonTitle');
        dom.comingSoonDesc = document.getElementById('comingSoonDesc');
        dom.btnComingSoonBack = document.getElementById('btnComingSoonBack');
    }

    /**
     * Initializes the page by parsing URL query parameters and loading the problem.
     */
    async function init() {
        cacheDom();
        bindEvents();

        const urlParams = new URLSearchParams(window.location.search);
        const problemId = urlParams.get('id') || 'two-sum';
        const requestedApproach = urlParams.get('approach');

        await loadProblem(problemId, requestedApproach);
    }

    /**
     * Loads problem metadata and selects corresponding animation or shows coming soon.
     */
    async function loadProblem(problemId, requestedApproach) {
        // Fetch problem from CodeArena API service if available
        let prob = null;
        if (window.CodeArenaAPI && window.CodeArenaAPI.problemService && typeof window.CodeArenaAPI.problemService.getProblemById === 'function') {
            try {
                const res = await window.CodeArenaAPI.problemService.getProblemById(problemId);
                if (res && res.success && res.data) {
                    prob = res.data;
                }
            } catch (e) {
                console.warn('[Animate Solution] API fetch error:', e);
            }
        }

        if (!prob) {
            // Fallback problem metadata
            prob = {
                id: problemId,
                title: problemId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                difficulty: 'Medium',
                topic: 'Algorithms',
                pattern: 'DSA Problem'
            };
        }

        currentProblem = prob;

        // Update Header
        if (dom.animProblemId) dom.animProblemId.textContent = `#${prob.id}`;
        if (dom.animProblemTitle) dom.animProblemTitle.textContent = prob.title;
        if (dom.animDiffBadge) {
            dom.animDiffBadge.textContent = prob.difficulty || 'Medium';
            dom.animDiffBadge.className = `diff-badge diff-${(prob.difficulty || 'medium').toLowerCase()}`;
        }
        if (dom.animTopicTag) dom.animTopicTag.textContent = prob.topic || 'DSA';
        if (dom.animPatternTag) {
            dom.animPatternTag.textContent = prob.pattern || 'Pattern';
            dom.animPatternTag.style.display = prob.pattern ? 'inline-block' : 'none';
        }

        // Back to problem links
        const backUrl = `problem.html?id=${encodeURIComponent(prob.id)}`;
        if (dom.btnBackToProblem) dom.btnBackToProblem.href = backUrl;
        if (dom.btnSidebarBack) dom.btnSidebarBack.href = backUrl;
        if (dom.btnComingSoonBack) dom.btnComingSoonBack.href = backUrl;

        // Check if bespoke animation exists in registry
        const animDef = ANIMATIONS_REGISTRY[prob.id];

        if (animDef && Array.isArray(animDef.approaches) && animDef.approaches.length > 0) {
            currentAnimation = animDef;
            showActiveAnimationView();

            // Populate approaches
            setupApproaches(animDef.approaches, requestedApproach);
        } else {
            currentAnimation = null;
            showComingSoonView(prob);
        }
    }

    /**
     * Sets up the approach selector dropdown and loads the initial approach.
     */
    function setupApproaches(approaches, requestedApproachId) {
        if (!dom.selectApproach || !dom.approachSelectorWrap) return;

        dom.selectApproach.innerHTML = '';

        approaches.forEach((app, idx) => {
            const opt = document.createElement('option');
            opt.value = app.id;
            opt.textContent = app.name;
            dom.selectApproach.appendChild(opt);
        });

        // Show approach dropdown only if multiple approaches exist
        dom.approachSelectorWrap.style.display = (approaches.length > 1) ? 'flex' : 'none';

        // Choose requested approach or default to first
        let chosen = approaches[0];
        if (requestedApproachId) {
            const match = approaches.find(a => a.id === requestedApproachId);
            if (match) chosen = match;
        }

        dom.selectApproach.value = chosen.id;
        selectApproach(chosen);
    }

    /**
     * Selects an approach and resets step index to 0.
     */
    function selectApproach(app) {
        activeApproach = app;
        if (dom.selectApproach) dom.selectApproach.value = app.id;
        currentStepIndex = 0;
        pause();

        // Update complexity card
        if (dom.badgeTimeComplexity) dom.badgeTimeComplexity.textContent = app.timeComplexity;
        if (dom.textTimeComplexity) dom.textTimeComplexity.textContent = app.timeExplanation;
        if (dom.badgeSpaceComplexity) dom.badgeSpaceComplexity.textContent = app.spaceComplexity;
        if (dom.textSpaceComplexity) dom.textSpaceComplexity.textContent = app.spaceExplanation;

        if (dom.stageApproachHeading) {
            dom.stageApproachHeading.textContent = `${currentProblem.title} — ${app.name}`;
        }

        renderCurrentStep();
    }

    /**
     * Renders the current step on the canvas and in the explanation card.
     */
    function renderCurrentStep() {
        if (!activeApproach || !Array.isArray(activeApproach.steps) || activeApproach.steps.length === 0) return;

        const totalSteps = activeApproach.steps.length;
        if (currentStepIndex < 0) currentStepIndex = 0;
        if (currentStepIndex >= totalSteps) currentStepIndex = totalSteps - 1;

        const step = activeApproach.steps[currentStepIndex];

        // 1. Stage Header Tagline
        if (dom.stageStepTagline) {
            dom.stageStepTagline.textContent = `Step ${currentStepIndex + 1} of ${totalSteps} · ${step.title}`;
        }

        // 2. Canvas
        if (dom.animCanvas) {
            dom.animCanvas.innerHTML = step.render();
        }

        // 3. Playback Controls State
        if (dom.animStepCounter) {
            dom.animStepCounter.textContent = `Step ${currentStepIndex + 1} / ${totalSteps}`;
        }
        if (dom.animProgressBar) {
            const pct = ((currentStepIndex + 1) / totalSteps) * 100;
            dom.animProgressBar.style.width = `${pct}%`;
        }
        if (dom.btnAnimPrev) {
            dom.btnAnimPrev.disabled = (currentStepIndex === 0);
        }
        if (dom.btnAnimNext) {
            dom.btnAnimNext.disabled = (currentStepIndex === totalSteps - 1);
        }

        // 4. Sidebar Explanation Card
        if (dom.infoStepBadge) dom.infoStepBadge.textContent = `Step ${currentStepIndex + 1}`;
        if (dom.stepTitle) dom.stepTitle.textContent = step.title;
        if (dom.stepWhat) dom.stepWhat.textContent = step.what;
        if (dom.stepWhy) dom.stepWhy.textContent = step.why;
        if (dom.stepTakeaway) dom.stepTakeaway.textContent = step.takeaway;

        // 5. Variables Grid
        if (dom.variablesGrid) {
            dom.variablesGrid.innerHTML = '';
            if (step.variables) {
                Object.entries(step.variables).forEach(([key, val]) => {
                    const pill = document.createElement('div');
                    pill.className = 'var-pill';
                    pill.innerHTML = `
                        <span class="var-pill-name">${escapeHtml(key)}:</span>
                        <span class="var-pill-val">${escapeHtml(String(val))}</span>
                    `;
                    dom.variablesGrid.appendChild(pill);
                });
            }
        }
    }

    /**
     * Advances to the next step.
     */
    function nextStep() {
        if (!activeApproach) return;
        if (currentStepIndex < activeApproach.steps.length - 1) {
            currentStepIndex++;
            renderCurrentStep();
        } else {
            pause();
        }
    }

    /**
     * Returns to the previous step.
     */
    function prevStep() {
        if (!activeApproach) return;
        if (currentStepIndex > 0) {
            currentStepIndex--;
            renderCurrentStep();
        }
    }

    /**
     * Restarts the animation from step 0.
     */
    function restart() {
        pause();
        currentStepIndex = 0;
        renderCurrentStep();
    }

    /**
     * Toggles playback between playing and paused.
     */
    function togglePlay() {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    }

    function play() {
        if (!activeApproach) return;
        if (currentStepIndex >= activeApproach.steps.length - 1) {
            currentStepIndex = 0;
        }

        isPlaying = true;
        updatePlayButton();

        const intervalMs = Math.round(1800 / playbackSpeed);
        clearInterval(playIntervalId);
        playIntervalId = setInterval(() => {
            if (currentStepIndex < activeApproach.steps.length - 1) {
                nextStep();
            } else {
                pause();
            }
        }, intervalMs);
    }

    function pause() {
        isPlaying = false;
        clearInterval(playIntervalId);
        playIntervalId = null;
        updatePlayButton();
    }

    function updatePlayButton() {
        if (!dom.btnPlayText || !dom.btnAnimPlayPause) return;
        if (isPlaying) {
            dom.btnPlayText.textContent = 'Pause';
            dom.btnAnimPlayPause.classList.add('playing');
        } else {
            dom.btnPlayText.textContent = 'Play';
            dom.btnAnimPlayPause.classList.remove('playing');
        }
    }

    function setSpeed(speedVal) {
        playbackSpeed = parseFloat(speedVal) || 1.0;
        if (isPlaying) {
            // Restart interval with new speed
            play();
        }
    }

    /**
     * Displays the active animation stage and hides the coming soon view.
     */
    function showActiveAnimationView() {
        if (dom.viewActiveAnimation) dom.viewActiveAnimation.style.display = 'grid';
        if (dom.viewComingSoon) dom.viewComingSoon.style.display = 'none';
    }

    /**
     * Displays the honest coming soon view for problems awaiting animations.
     */
    function showComingSoonView(prob) {
        if (dom.viewActiveAnimation) dom.viewActiveAnimation.style.display = 'none';
        if (dom.viewComingSoon) dom.viewComingSoon.style.display = 'flex';

        if (dom.comingSoonTitle) {
            dom.comingSoonTitle.textContent = `Visualization for "${prob.title}" Coming Soon`;
        }
        if (dom.comingSoonDesc) {
            dom.comingSoonDesc.innerHTML = `
                The CodeArena educational curriculum team is currently developing an interactive, step-by-step visual animation for <strong>${escapeHtml(prob.title)}</strong> (${escapeHtml(prob.pattern || prob.topic || 'DSA')}).
            `;
        }
    }

    /**
     * Binds user interaction events and keyboard shortcuts.
     */
    function bindEvents() {
        if (dom.btnAnimPrev) dom.btnAnimPrev.addEventListener('click', prevStep);
        if (dom.btnAnimNext) dom.btnAnimNext.addEventListener('click', nextStep);
        if (dom.btnAnimPlayPause) dom.btnAnimPlayPause.addEventListener('click', togglePlay);
        if (dom.btnAnimRestart) dom.btnAnimRestart.addEventListener('click', restart);

        if (dom.selectAnimSpeed) {
            dom.selectAnimSpeed.addEventListener('change', (e) => {
                setSpeed(e.target.value);
            });
        }

        if (dom.selectApproach) {
            dom.selectApproach.addEventListener('change', (e) => {
                if (currentAnimation && Array.isArray(currentAnimation.approaches)) {
                    const found = currentAnimation.approaches.find(a => a.id === e.target.value);
                    if (found) selectApproach(found);
                }
            });
        }

        // Theme toggle synchronization with theme.js
        if (dom.themeToggleBtn) {
            dom.themeToggleBtn.addEventListener('click', () => {
                if (window.CodeArenaTheme && typeof window.CodeArenaTheme.toggle === 'function') {
                    window.CodeArenaTheme.toggle();
                } else {
                    const curr = document.documentElement.getAttribute('data-theme') || 'dark';
                    const next = (curr === 'dark') ? 'light' : 'dark';
                    document.documentElement.setAttribute('data-theme', next);
                    try { localStorage.setItem('codearena_theme', next); } catch (e) { }
                }
            });
        }

        // Keyboard navigation shortcuts
        document.addEventListener('keydown', (e) => {
            // Ignore when typing in select or inputs
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            if (e.code === 'Space') {
                e.preventDefault();
                togglePlay();
            } else if (e.code === 'ArrowRight') {
                e.preventDefault();
                nextStep();
            } else if (e.code === 'ArrowLeft') {
                e.preventDefault();
                prevStep();
            } else if (e.key === 'r' || e.key === 'R') {
                e.preventDefault();
                restart();
            }
        });
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

    // Initialize on DOM Ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose API for inspection and testing
    window.CodeArenaSolutionAnimation = {
        getLoadedProblem: () => currentProblem,
        getCurrentApproach: () => activeApproach,
        getStepIndex: () => currentStepIndex,
        getTotalSteps: () => activeApproach ? activeApproach.steps.length : 0,
        nextStep: nextStep,
        prevStep: prevStep,
        togglePlay: togglePlay,
        restart: restart,
        setSpeed: setSpeed,
        setApproach: (approachId) => {
            if (currentAnimation && Array.isArray(currentAnimation.approaches)) {
                const found = currentAnimation.approaches.find(a => a.id === approachId);
                if (found) selectApproach(found);
            }
        },
        isComingSoon: () => currentAnimation === null,
        getRegistry: () => ANIMATIONS_REGISTRY
    };

})();
