// api.js — CodeArena Centralized API Client & Service Layer
// Prepares frontend for upcoming Java Servlet + JDBC backend endpoints.
// Encapsulates network communication, JSON serialization, headers, and error handling.

const API_CONFIG = {
    // Default base URL; customizable via window.CODEARENA_API_BASE
    baseURL: (typeof window !== 'undefined' && window.CODEARENA_API_BASE) || '/api',
    timeoutMs: 6000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    // In Phase 3, frontend runs with isolated mock adapters until Java Servlet backend is connected
    useMockAdapter: true
};

/**
 * Low-level HTTP client with timeout, JSON parsing, and unified error handling.
 */
async function apiClient(endpoint, options = {}) {
    const url = `${API_CONFIG.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(function () { controller.abort(); }, API_CONFIG.timeoutMs);

    const config = Object.assign({
        method: options.method || 'GET',
        headers: Object.assign({}, API_CONFIG.headers, options.headers || {}),
        credentials: 'same-origin', // Preserves HTTP-only session cookies from Java Servlets
        signal: controller.signal
    }, options);

    if (options.body && typeof options.body === 'object') {
        config.body = JSON.stringify(options.body);
    }

    try {
        const response = await fetch(url, config);
        clearTimeout(timeoutId);

        let data = null;
        const contentType = response.headers.get('content-type') || '';
        if (contentType.indexOf('application/json') !== -1) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            const error = new Error((data && data.message) || ('HTTP error! Status: ' + response.status));
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return {
            success: true,
            status: response.status,
            data: data
        };
    } catch (err) {
        clearTimeout(timeoutId);
        const isNetworkFailure = err.name === 'AbortError' || err.name === 'TypeError' || !err.status;
        return {
            success: false,
            status: err.status || 0,
            isNetworkFailure: isNetworkFailure,
            message: isNetworkFailure
                ? 'Backend service is currently in preview mode. Java Servlet endpoints will be active in the upcoming backend phase.'
                : (err.message || 'An unexpected error occurred.')
        };
    }
}

/**
 * Authentication Service Layer
 * Prepared for real Java Servlet endpoints.
 */
const authService = {
    /**
     * POST /api/auth/login
     * @param {Object} credentials - { email, password, rememberMe }
     */
    async login(credentials) {
        return apiClient('/auth/login', {
            method: 'POST',
            body: {
                email: credentials.email,
                password: credentials.password,
                rememberMe: Boolean(credentials.rememberMe)
            }
        });
    },

    /**
     * POST /api/auth/register
     * @param {Object} userData - { fullName, email, password }
     */
    async register(userData) {
        return apiClient('/auth/register', {
            method: 'POST',
            body: {
                fullName: userData.fullName,
                email: userData.email,
                password: userData.password
            }
        });
    },

    /**
     * POST /api/auth/logout
     */
    async logout() {
        return apiClient('/auth/logout', {
            method: 'POST'
        });
    },

    /**
     * GET /api/users/me
     * Retrieves the authenticated user's session profile from the server.
     */
    async getCurrentUser() {
        return apiClient('/users/me', {
            method: 'GET'
        });
    }
};

/* ==========================================================================
   Phase 3: Domain Models & Constants
   ========================================================================== */

const EXECUTION_STATUS = Object.freeze({
    IDLE: 'IDLE',
    RUNNING: 'RUNNING',
    SUCCESS: 'SUCCESS',
    COMPILE_ERROR: 'COMPILE_ERROR',
    RUNTIME_ERROR: 'RUNTIME_ERROR',
    TIMEOUT: 'TIMEOUT'
});

const SUBMISSION_VERDICT = Object.freeze({
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    WRONG_ANSWER: 'WRONG_ANSWER',
    COMPILE_ERROR: 'COMPILE_ERROR',
    RUNTIME_ERROR: 'RUNTIME_ERROR',
    PREVIEW_PASSED: 'PREVIEW_PASSED'
});

const DIFFICULTIES = Object.freeze(['Easy', 'Medium', 'Hard']);

const TOPICS = Object.freeze([
    'Arrays',
    'Strings',
    'Linked Lists',
    'Trees',
    'Dynamic Programming',
    'Searching',
    'Math'
]);

const SUPPORTED_LANGUAGES = Object.freeze([
    {
        id: 'java',
        name: 'Java (OpenJDK 17)',
        extension: '.java',
        defaultClass: 'Main'
    }
]);

const DEFAULT_JAVA_TEMPLATE = `// CodeArena Online Java Compiler (OpenJDK 17)
// Write your code below and click "Run Code"

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, CodeArena!");
        System.out.println("Java compiler environment is ready.");
    }
}`;

/* ==========================================================================
   Phase 3: Isolated Mock Data Adapters
   Used exclusively during frontend development to demonstrate preview states.
   Never claims real remote compilation or arbitrary code execution.
   ========================================================================== */

const compilerMockAdapter = {
    /**
     * Simulates frontend preview compilation & execution.
     * @param {Object} payload - { sourceCode, language, stdin }
     */
    async run(payload) {
        // Simulated execution latency (400ms - 700ms)
        await new Promise(resolve => setTimeout(resolve, 450));

        // Language boundary check
        const lang = (payload && payload.language) ? String(payload.language).trim().toLowerCase() : 'java';
        if (lang !== 'java') {
            return {
                success: false,
                status: 400,
                message: `Unsupported language '${payload.language}'. Only Java (OpenJDK 17) is supported in this phase.`
            };
        }

        const source = (payload && payload.sourceCode) ? payload.sourceCode.trim() : '';
        const stdin = (payload && payload.stdin) ? payload.stdin.trim() : '';

        if (!source) {
            return {
                success: false,
                status: 400,
                message: 'Source code cannot be empty.'
            };
        }

        // Client-side preview structural checks (Never represented as genuine Java compilation)
        const openBraces = (source.match(/\{/g) || []).length;
        const closeBraces = (source.match(/\}/g) || []).length;

        if (openBraces !== closeBraces) {
            return {
                success: true,
                data: {
                    status: EXECUTION_STATUS.COMPILE_ERROR,
                    stdout: '',
                    stderr: `[Client-Side Preview Check] Syntactic notice: unmatched curly braces (found ${openBraces} '{' and ${closeBraces} '}'). Real Java compilation requires Phase 4 backend integration.`,
                    compileErrors: [
                        {
                            line: source.split('\n').length,
                            column: 1,
                            message: `[Client-Side Preview Check] Unmatched curly braces: found ${openBraces} '{' and ${closeBraces} '}'`
                        }
                    ],
                    executionTimeMs: 0,
                    memoryUsageKb: 0,
                    isSimulated: true,
                    isMockPreview: true,
                    diagnosticType: 'CLIENT_STRUCTURAL_CHECK',
                    notice: 'Simulated preview diagnostic — Client-side structural check only. Real Java compiler service connects in Phase 4.',
                    disclaimer: 'Note: This is a frontend preview demonstration. Arbitrary code is not executed on a remote server in this phase.'
                }
            };
        }

        // Check class declaration requirement in Java
        if (!source.includes('class Main') && !source.includes('class Solution')) {
            return {
                success: true,
                data: {
                    status: EXECUTION_STATUS.COMPILE_ERROR,
                    stdout: '',
                    stderr: '[Client-Side Preview Check] Java requires a class declaration (e.g. class Main or class Solution).',
                    compileErrors: [
                        {
                            line: 1,
                            column: 1,
                            message: "[Client-Side Preview Check] Expected 'class Main' or 'class Solution'."
                        }
                    ],
                    executionTimeMs: 0,
                    memoryUsageKb: 0,
                    isSimulated: true,
                    isMockPreview: true,
                    diagnosticType: 'CLIENT_STRUCTURAL_CHECK',
                    notice: 'Simulated preview diagnostic — Client-side structural check only. Real Java compiler service connects in Phase 4.',
                    disclaimer: 'Note: This is a frontend preview demonstration. Arbitrary code is not executed on a remote server in this phase.'
                }
            };
        }

        // Build realistic simulated output
        let simulatedStdout = 'Hello, CodeArena!\nJava compiler environment is ready.';
        if (stdin) {
            simulatedStdout += `\n[Standard Input Received]: ${stdin}`;
        }

        return {
            success: true,
            data: {
                status: EXECUTION_STATUS.SUCCESS,
                stdout: simulatedStdout,
                stderr: '',
                compileErrors: [],
                executionTimeMs: 118,
                memoryUsageKb: 14200,
                exitCode: 0,
                isSimulated: true,
                isMockPreview: true,
                notice: 'Simulated preview output — Java execution engine backend pending Phase 4 integration.',
                disclaimer: 'Note: This is a frontend preview demonstration. Arbitrary code is not executed on a remote server in this phase.'
            }
        };
    }
};

/**
 * Problem Catalogue Mock Dataset
 * 12 diverse Java coding challenges.
 * First 5 align exactly with the dashboard's "Featured Problems".
 */
const MOCK_PROBLEMS = [
    {
        id: 'two-sum',
        title: 'Two Sum',
        slug: 'two-sum',
        difficulty: 'Easy',
        topic: 'Arrays',
        snippet: 'Find two numbers in an array that add up to a target.',
        description: '<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return the indices of the two numbers such that they add up to <code>target</code>.</p><p>You may assume that each input has <strong>exactly one solution</strong>, and you may not use the same element twice. You can return the answer in any order.</p>',
        inputFormat: 'An integer array <code>nums</code> and an integer <code>target</code>.',
        outputFormat: 'An integer array <code>[i, j]</code> containing the indices of the two numbers.',
        constraints: [
            '2 <= nums.length <= 10^4',
            '-10^9 <= nums[i] <= 10^9',
            '-10^9 <= target <= 10^9',
            'Only one valid answer exists.'
        ],
        sampleTestCases: [
            {
                id: 1,
                input: 'nums = [2, 7, 11, 15], target = 9',
                expectedOutput: '[0, 1]',
                explanation: 'Because nums[0] + nums[1] == 2 + 7 == 9, we return [0, 1].'
            },
            {
                id: 2,
                input: 'nums = [3, 2, 4], target = 6',
                expectedOutput: '[1, 2]',
                explanation: 'Because nums[1] + nums[2] == 2 + 4 == 6, we return [1, 2].'
            }
        ],
        starterCode: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution below

        return new int[]{};
    }
}`,
        provisionalStats: {
            acceptanceRate: '49.2%',
            submissionsCount: 15420,
            isProvisional: true
        }
    },
    {
        id: 'reverse-a-string',
        title: 'Reverse a String',
        slug: 'reverse-a-string',
        difficulty: 'Medium',
        topic: 'Strings',
        snippet: 'Reverse the given string.',
        description: '<p>Write a function that reverses a character array <code>s</code> in-place.</p><p>You must modify the input array directly with <code>O(1)</code> extra memory without allocating a new array.</p>',
        inputFormat: 'A character array <code>s</code>.',
        outputFormat: 'None (modify <code>s</code> in-place).',
        constraints: [
            '1 <= s.length <= 10^5',
            's[i] is a printable ASCII character.'
        ],
        sampleTestCases: [
            {
                id: 1,
                input: 's = ["h","e","l","l","o"]',
                expectedOutput: '["o","l","l","e","h"]',
                explanation: 'Reversed order of elements.'
            },
            {
                id: 2,
                input: 's = ["H","a","n","n","a","h"]',
                expectedOutput: '["h","a","n","n","a","H"]',
                explanation: 'Reversed order preserving case.'
            }
        ],
        starterCode: `class Solution {
    public void reverseString(char[] s) {
        // Write your in-place solution below

    }
}`,
        provisionalStats: {
            acceptanceRate: '76.8%',
            submissionsCount: 11240,
            isProvisional: true
        }
    },
    {
        id: 'valid-parentheses',
        title: 'Valid Parentheses',
        slug: 'valid-parentheses',
        difficulty: 'Medium',
        topic: 'Strings',
        snippet: 'Check if the parentheses are valid.',
        description: '<p>Given a string <code>s</code> containing just the characters <code>\'(\'</code>, <code>\')\'</code>, <code>\'{\'</code>, <code>\'}\'</code>, <code>\'[\'</code>, and <code>\']\'</code>, determine if the input string is valid.</p><p>An input string is valid if open brackets are closed by the same type of brackets in the correct order, and every close bracket has a corresponding open bracket of the same type.</p>',
        inputFormat: 'A string <code>s</code> containing bracket characters.',
        outputFormat: 'Return <code>true</code> if <code>s</code> is valid, or <code>false</code> otherwise.',
        constraints: [
            '1 <= s.length <= 10^4',
            's consists of parentheses only: ()[]{}'
        ],
        sampleTestCases: [
            {
                id: 1,
                input: 's = "()"',
                expectedOutput: 'true',
                explanation: 'Single matching pair.'
            },
            {
                id: 2,
                input: 's = "()[]{}"',
                expectedOutput: 'true',
                explanation: 'Multiple valid pairs.'
            },
            {
                id: 3,
                input: 's = "(]"',
                expectedOutput: 'false',
                explanation: 'Mismatched closing bracket.'
            }
        ],
        starterCode: `import java.util.Stack;

class Solution {
    public boolean isValid(String s) {
        // Write your solution below

        return false;
    }
}`,
        provisionalStats: {
            acceptanceRate: '40.5%',
            submissionsCount: 18910,
            isProvisional: true
        }
    },
    {
        id: 'merge-k-sorted-lists',
        title: 'Merge K Sorted Lists',
        slug: 'merge-k-sorted-lists',
        difficulty: 'Hard',
        topic: 'Linked Lists',
        snippet: 'Merge k sorted linked lists into one sorted list.',
        description: '<p>You are given an array of <code>k</code> linked-lists <code>lists</code>, where each linked-list is sorted in ascending order.</p><p>Merge all the linked-lists into one sorted linked-list and return its head node.</p>',
        inputFormat: 'An array of <code>k</code> sorted singly-linked lists <code>lists</code>.',
        outputFormat: 'The head of the single merged sorted linked list.',
        constraints: [
            'k == lists.length',
            '0 <= k <= 10^4',
            '0 <= lists[i].length <= 500',
            '-10^4 <= lists[i][j] <= 10^4'
        ],
        sampleTestCases: [
            {
                id: 1,
                input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
                expectedOutput: '[1,1,2,3,4,4,5,6]',
                explanation: 'Lists merged into single sorted order.'
            }
        ],
        starterCode: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        // Write your solution below

        return null;
    }
}`,
        provisionalStats: {
            acceptanceRate: '51.4%',
            submissionsCount: 8430,
            isProvisional: true
        }
    },
    {
        id: 'binary-search',
        title: 'Binary Search',
        slug: 'binary-search',
        difficulty: 'Easy',
        topic: 'Searching',
        snippet: 'Find the target element using binary search.',
        description: '<p>Given an array of integers <code>nums</code> sorted in ascending order and an integer <code>target</code>, write a function to search for <code>target</code> in <code>nums</code>.</p><p>If <code>target</code> exists, return its index. Otherwise, return <code>-1</code>. Your solution must run in <code>O(log n)</code> time complexity.</p>',
        inputFormat: 'A sorted integer array <code>nums</code> and an integer <code>target</code>.',
        outputFormat: 'The 0-based index of <code>target</code> in <code>nums</code>, or <code>-1</code> if not found.',
        constraints: [
            '1 <= nums.length <= 10^4',
            '-10^4 < nums[i], target < 10^4',
            'All the integers in nums are unique.',
            'nums is sorted in ascending order.'
        ],
        sampleTestCases: [
            {
                id: 1,
                input: 'nums = [-1,0,3,5,9,12], target = 9',
                expectedOutput: '4',
                explanation: '9 exists in nums and its index is 4.'
            },
            {
                id: 2,
                input: 'nums = [-1,0,3,5,9,12], target = 2',
                expectedOutput: '-1',
                explanation: '2 does not exist in nums so return -1.'
            }
        ],
        starterCode: `class Solution {
    public int search(int[] nums, int target) {
        // Write your binary search solution below

        return -1;
    }
}`,
        provisionalStats: {
            acceptanceRate: '56.9%',
            submissionsCount: 14200,
            isProvisional: true
        }
    },
    {
        id: 'palindrome-number',
        title: 'Palindrome Number',
        slug: 'palindrome-number',
        difficulty: 'Easy',
        topic: 'Math',
        snippet: 'Determine whether an integer is a palindrome.',
        description: '<p>Given an integer <code>x</code>, return <code>true</code> if <code>x</code> is a <strong>palindrome</strong>, and <code>false</code> otherwise.</p><p>An integer is a palindrome when it reads the same forward and backward (for example, <code>121</code> is a palindrome, while <code>-121</code> is not).</p>',
        inputFormat: 'An integer <code>x</code>.',
        outputFormat: 'Return <code>true</code> if <code>x</code> is a palindrome, or <code>false</code> otherwise.',
        constraints: ['-2^31 <= x <= 2^31 - 1'],
        sampleTestCases: [
            { id: 1, input: 'x = 121', expectedOutput: 'true', explanation: '121 reads as 121 from left to right and from right to left.' },
            { id: 2, input: 'x = -121', expectedOutput: 'false', explanation: 'From left to right, it reads -121. From right to left, it becomes 121-.' }
        ],
        starterCode: `class Solution {
    public boolean isPalindrome(int x) {
        // Write your solution below

        return false;
    }
}`,
        provisionalStats: {
            acceptanceRate: '54.1%',
            submissionsCount: 19800,
            isProvisional: true
        }
    },
    {
        id: 'maximum-subarray',
        title: 'Maximum Subarray',
        slug: 'maximum-subarray',
        difficulty: 'Medium',
        topic: 'Dynamic Programming',
        snippet: 'Find the contiguous subarray with the largest sum.',
        description: '<p>Given an integer array <code>nums</code>, find the contiguous subarray (containing at least one number) which has the largest sum, and return its sum.</p>',
        inputFormat: 'An integer array <code>nums</code>.',
        outputFormat: 'An integer representing the maximum subarray sum.',
        constraints: [
            '1 <= nums.length <= 10^5',
            '-10^4 <= nums[i] <= 10^4'
        ],
        sampleTestCases: [
            { id: 1, input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' }
        ],
        starterCode: `class Solution {
    public int maxSubArray(int[] nums) {
        // Write Kadane's algorithm or dynamic programming below

        return 0;
    }
}`,
        provisionalStats: {
            acceptanceRate: '50.3%',
            submissionsCount: 16750,
            isProvisional: true
        }
    },
    {
        id: 'linked-list-cycle',
        title: 'Linked List Cycle',
        slug: 'linked-list-cycle',
        difficulty: 'Easy',
        topic: 'Linked Lists',
        snippet: 'Determine if a linked list contains a cycle.',
        description: '<p>Given <code>head</code>, the head of a linked list, determine if the linked list contains a cycle.</p><p>There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the <code>next</code> pointer.</p>',
        inputFormat: 'The head node of a singly-linked list <code>head</code>.',
        outputFormat: 'Return <code>true</code> if there is a cycle in the linked list, or <code>false</code> otherwise.',
        constraints: [
            'The number of the nodes in the list is in the range [0, 10^4].',
            '-10^5 <= Node.val <= 10^5'
        ],
        sampleTestCases: [
            { id: 1, input: 'head = [3,2,0,-4], pos = 1', expectedOutput: 'true', explanation: 'There is a cycle where tail connects to the 1st node (0-indexed).' }
        ],
        starterCode: `/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) {
 *         val = x;
 *         next = null;
 *     }
 * }
 */
public class Solution {
    public boolean hasCycle(ListNode head) {
        // Write Floyd's cycle detection below

        return false;
    }
}`,
        provisionalStats: {
            acceptanceRate: '48.9%',
            submissionsCount: 13900,
            isProvisional: true
        }
    },
    {
        id: 'invert-binary-tree',
        title: 'Invert Binary Tree',
        slug: 'invert-binary-tree',
        difficulty: 'Easy',
        topic: 'Trees',
        snippet: 'Invert the given binary tree and return its root.',
        description: '<p>Given the <code>root</code> of a binary tree, invert the tree by swapping every left and right child, and return its root.</p>',
        inputFormat: 'The root node of a binary tree <code>root</code>.',
        outputFormat: 'The root node of the inverted binary tree.',
        constraints: [
            'The number of nodes in the tree is in the range [0, 100].',
            '-100 <= Node.val <= 100'
        ],
        sampleTestCases: [
            { id: 1, input: 'root = [4,2,7,1,3,6,9]', expectedOutput: '[4,7,2,9,6,3,1]', explanation: 'Every left and right child are swapped.' }
        ],
        starterCode: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public TreeNode invertTree(TreeNode root) {
        // Write your tree inversion below

        return null;
    }
}`,
        provisionalStats: {
            acceptanceRate: '75.2%',
            submissionsCount: 17200,
            isProvisional: true
        }
    },
    {
        id: 'climbing-stairs',
        title: 'Climbing Stairs',
        slug: 'climbing-stairs',
        difficulty: 'Easy',
        topic: 'Dynamic Programming',
        snippet: 'Count distinct ways to climb n stairs.',
        description: '<p>You are climbing a staircase. It takes <code>n</code> steps to reach the top. Each time you can either climb <code>1</code> step or <code>2</code> steps.</p><p>Return the number of distinct ways you can climb to the top.</p>',
        inputFormat: 'An integer <code>n</code> representing the total steps.',
        outputFormat: 'An integer representing the total number of distinct combinations to reach the top.',
        constraints: ['1 <= n <= 45'],
        sampleTestCases: [
            { id: 1, input: 'n = 2', expectedOutput: '2', explanation: '1. 1 step + 1 step, 2. 2 steps.' },
            { id: 2, input: 'n = 3', expectedOutput: '3', explanation: '1. 1+1+1, 2. 1+2, 3. 2+1.' }
        ],
        starterCode: `class Solution {
    public int climbStairs(int n) {
        // Write your dynamic programming solution below

        return 0;
    }
}`,
        provisionalStats: {
            acceptanceRate: '52.7%',
            submissionsCount: 15300,
            isProvisional: true
        }
    },
    {
        id: 'longest-substring',
        title: 'Longest Substring Without Repeating Characters',
        slug: 'longest-substring',
        difficulty: 'Medium',
        topic: 'Strings',
        snippet: 'Find the length of the longest substring without repeating characters.',
        description: '<p>Given a string <code>s</code>, find the length of the longest substring without repeating characters.</p>',
        inputFormat: 'A string <code>s</code>.',
        outputFormat: 'An integer representing the length of the longest substring without duplicate characters.',
        constraints: [
            '0 <= s.length <= 5 * 10^4',
            's consists of English letters, digits, symbols and spaces.'
        ],
        sampleTestCases: [
            { id: 1, input: 's = "abcabcbb"', expectedOutput: '3', explanation: 'The answer is "abc", with the length of 3.' }
        ],
        starterCode: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your sliding window solution below

        return 0;
    }
}`,
        provisionalStats: {
            acceptanceRate: '34.8%',
            submissionsCount: 22100,
            isProvisional: true
        }
    },
    {
        id: 'trapping-rain-water',
        title: 'Trapping Rain Water',
        slug: 'trapping-rain-water',
        difficulty: 'Hard',
        topic: 'Arrays',
        snippet: 'Calculate how much water can be trapped after raining.',
        description: '<p>Given <code>n</code> non-negative integers representing an elevation map where the width of each bar is <code>1</code>, compute how much water it can trap after raining.</p>',
        inputFormat: 'An integer array <code>height</code> representing elevation heights.',
        outputFormat: 'An integer representing the total units of trapped rain water.',
        constraints: [
            'n == height.length',
            '1 <= n <= 2 * 10^4',
            '0 <= height[i] <= 10^5'
        ],
        sampleTestCases: [
            { id: 1, input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6', explanation: 'The elevation map traps 6 units of rain water.' }
        ],
        starterCode: `class Solution {
    public int trap(int[] height) {
        // Write your two-pointer or stack solution below

        return 0;
    }
}`,
        provisionalStats: {
            acceptanceRate: '60.4%',
            submissionsCount: 7920,
            isProvisional: true
        }
    }
];

/**
 * Safe HTML Sanitizer
 * Strips script tags, iframes, inline event handlers, and dangerous protocols.
 * Allows safe semantic tags (p, code, em, strong, pre, ul, ol, li, br, blockquote).
 */
function sanitizeHtml(dirty) {
    if (typeof dirty !== 'string') return '';
    return dirty
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
        .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
        .replace(/\son\w+="[^"]*"/gi, '')
        .replace(/\son\w+='[^']*'/gi, '')
        .replace(/\son\w+=[^\s>]+/gi, '')
        .replace(/javascript:[^"']*/gi, '#');
}

// Session-scoped in-memory / sessionStorage temporary store for guest preview submissions
let memoryGuestSubmissions = [];

function getSessionSubmissions() {
    try {
        if (typeof sessionStorage !== 'undefined') {
            const raw = sessionStorage.getItem('codearena_guest_preview_submissions');
            return raw ? JSON.parse(raw) : [];
        }
    } catch (e) { /* ignore storage quota/sandbox limitations */ }
    return memoryGuestSubmissions.slice();
}

function saveSessionSubmission(record) {
    try {
        if (typeof sessionStorage !== 'undefined') {
            const list = getSessionSubmissions();
            list.unshift(record);
            sessionStorage.setItem('codearena_guest_preview_submissions', JSON.stringify(list.slice(0, 20)));
            return;
        }
    } catch (e) { /* ignore */ }
    memoryGuestSubmissions.unshift(record);
    if (memoryGuestSubmissions.length > 20) memoryGuestSubmissions.pop();
}

const problemMockAdapter = {
    /**
     * List problems with optional filtering, search, sorting and pagination.
     */
    async list(params = {}) {
        await new Promise(resolve => setTimeout(resolve, 80));

        let results = MOCK_PROBLEMS.slice();

        // 1. Difficulty filter (with boundary protection)
        if (params.difficulty && params.difficulty !== 'All') {
            const validDiff = DIFFICULTIES.some(d => d.toLowerCase() === String(params.difficulty).toLowerCase());
            if (!validDiff) {
                // Invalid difficulty returns empty results gracefully
                results = [];
            } else {
                results = results.filter(p => p.difficulty.toLowerCase() === String(params.difficulty).toLowerCase());
            }
        }

        // 2. Topic filter (with boundary protection)
        if (params.topic && params.topic !== 'All') {
            const validTopic = TOPICS.some(t => t.toLowerCase() === String(params.topic).toLowerCase());
            if (!validTopic) {
                // Invalid topic returns empty results gracefully
                results = [];
            } else {
                results = results.filter(p => p.topic.toLowerCase() === String(params.topic).toLowerCase());
            }
        }

        // 3. Search query (title + snippet + topic)
        if (params.search && typeof params.search === 'string') {
            const q = params.search.trim().toLowerCase();
            if (q) {
                results = results.filter(p =>
                    p.title.toLowerCase().includes(q) ||
                    p.snippet.toLowerCase().includes(q) ||
                    p.topic.toLowerCase().includes(q)
                );
            }
        }

        // 4. Sorting with boundary protection
        if (params.sortBy) {
            if (params.sortBy === 'title') {
                results.sort((a, b) => a.title.localeCompare(b.title));
            } else if (params.sortBy === 'difficulty') {
                const diffOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
                results.sort((a, b) => (diffOrder[a.difficulty] || 99) - (diffOrder[b.difficulty] || 99));
            } else if (params.sortBy === 'acceptance') {
                results.sort((a, b) => parseFloat(b.provisionalStats.acceptanceRate) - parseFloat(a.provisionalStats.acceptanceRate));
            }
            // Invalid sort key is safely ignored
        }

        // 5. Pagination with robust boundary clamping
        const rawLimit = parseInt(params.limit, 10);
        const limit = (!isNaN(rawLimit) && rawLimit > 0) ? Math.min(rawLimit, 100) : 20;
        const total = results.length;
        const totalPages = Math.max(1, Math.ceil(total / limit));
        const rawPage = parseInt(params.page, 10);
        const page = (!isNaN(rawPage) && rawPage > 0) ? rawPage : 1;

        const offset = (page - 1) * limit;
        const paginated = (offset < total) ? results.slice(offset, offset + limit) : [];

        return {
            success: true,
            data: {
                problems: paginated,
                total: total,
                page: page,
                limit: limit,
                totalPages: totalPages,
                isProvisionalData: true,
                notice: 'Catalogue statistics (acceptance rates, problem totals) are provisional sample data.'
            }
        };
    },

    /**
     * Get problem details by ID or slug.
     */
    async getById(id) {
        await new Promise(resolve => setTimeout(resolve, 60));
        const problem = MOCK_PROBLEMS.find(p => p.id === id || p.slug === id);
        if (!problem) {
            return {
                success: false,
                status: 404,
                message: `Problem with ID '${id}' not found in catalogue.`
            };
        }
        return {
            success: true,
            data: Object.assign({}, problem, {
                description: sanitizeHtml(problem.description),
                isProvisionalData: true,
                notice: 'Problem specification is preview catalogue data.'
            })
        };
    },

    /**
     * Get list of unique problem topics.
     */
    async getTopics() {
        return {
            success: true,
            data: TOPICS.slice()
        };
    }
};

const submissionMockAdapter = {
    /**
     * Simulates evaluation against sample test cases.
     * Never claims arbitrary user code has passed hidden remote test cases.
     */
    async submit(payload) {
        await new Promise(resolve => setTimeout(resolve, 650));

        const problemId = payload && payload.problemId;
        const problem = MOCK_PROBLEMS.find(p => p.id === problemId || p.slug === problemId);

        const record = {
            submissionId: 'sub_prev_' + Date.now().toString(36),
            problemId: problemId,
            problemTitle: problem ? problem.title : 'Challenge',
            status: SUBMISSION_VERDICT.PREVIEW_PASSED,
            verdictType: 'FRONTEND_SAMPLE_PREVIEW',
            verdictBadge: 'preview-passed',
            verdictText: 'Sample Tests Demonstrated (Frontend Preview)',
            sampleTestCasesPassed: problem ? problem.sampleTestCases.length : 2,
            totalSampleTestCases: problem ? problem.sampleTestCases.length : 2,
            submittedAt: new Date().toISOString(),
            isSimulated: true,
            isTemporaryGuestRecord: true,
            storageType: 'SESSION_TEMPORARY',
            notice: 'Demonstration preview verdict — Java backend judge engine pending Phase 4 integration.',
            disclaimer: 'Arbitrary user code has not been compiled or evaluated against a hidden backend test-case suite.'
        };

        saveSessionSubmission(record);

        return {
            success: true,
            data: record
        };
    },

    /**
     * Local guest session submission history (temporary session only).
     */
    async getHistory(problemId) {
        const allRecords = getSessionSubmissions();
        const filtered = problemId
            ? allRecords.filter(r => r.problemId === problemId)
            : allRecords;

        return {
            success: true,
            data: {
                submissions: filtered,
                isGuestSession: true,
                storageType: 'SESSION_TEMPORARY_ONLY',
                notice: 'These submission records are temporary and scoped to this browser tab session. Persistent submission history will be stored in MySQL once authenticated in Phase 4.'
            }
        };
    }
};

/* ==========================================================================
   Phase 3: Public Service Layer Interfaces
   ========================================================================== */

/**
 * Compiler Service
 * Dispatches to Java Servlet API when available, falls back cleanly to mock preview adapter.
 */
const compilerService = {
    async runCode(payload) {
        if (API_CONFIG.useMockAdapter) {
            return compilerMockAdapter.run(payload);
        }
        const res = await apiClient('/compiler/run', {
            method: 'POST',
            body: payload
        });
        if (!res.success && res.isNetworkFailure) {
            return compilerMockAdapter.run(payload);
        }
        return res;
    },

    getDefaultTemplate(language = 'java') {
        return DEFAULT_JAVA_TEMPLATE;
    }
};

/**
 * Problem Catalogue Service
 */
const problemService = {
    async getProblems(params = {}) {
        if (API_CONFIG.useMockAdapter) {
            return problemMockAdapter.list(params);
        }
        const query = new URLSearchParams(params).toString();
        const res = await apiClient(`/problems?${query}`, { method: 'GET' });
        if (!res.success && res.isNetworkFailure) {
            return problemMockAdapter.list(params);
        }
        return res;
    },

    async getProblemById(id) {
        if (API_CONFIG.useMockAdapter) {
            return problemMockAdapter.getById(id);
        }
        const res = await apiClient(`/problems/${id}`, { method: 'GET' });
        if (!res.success && res.isNetworkFailure) {
            return problemMockAdapter.getById(id);
        }
        return res;
    },

    async getTopics() {
        if (API_CONFIG.useMockAdapter) {
            return problemMockAdapter.getTopics();
        }
        const res = await apiClient('/problems/topics', { method: 'GET' });
        if (!res.success && res.isNetworkFailure) {
            return problemMockAdapter.getTopics();
        }
        return res;
    },

    sanitizeHtml(dirty) {
        return sanitizeHtml(dirty);
    }
};

/**
 * Submission Service
 */
const submissionService = {
    async submitSolution(payload) {
        if (API_CONFIG.useMockAdapter) {
            return submissionMockAdapter.submit(payload);
        }
        const res = await apiClient('/submissions', {
            method: 'POST',
            body: payload
        });
        if (!res.success && res.isNetworkFailure) {
            return submissionMockAdapter.submit(payload);
        }
        return res;
    },

    async getSubmissions(problemId) {
        if (API_CONFIG.useMockAdapter) {
            return submissionMockAdapter.getHistory(problemId);
        }
        const res = await apiClient(`/submissions?problemId=${encodeURIComponent(problemId)}`, {
            method: 'GET'
        });
        if (!res.success && res.isNetworkFailure) {
            return submissionMockAdapter.getHistory(problemId);
        }
        return res;
    }
};

const models = Object.freeze({
    EXECUTION_STATUS,
    SUBMISSION_VERDICT,
    DIFFICULTIES,
    TOPICS,
    SUPPORTED_LANGUAGES,
    DEFAULT_JAVA_TEMPLATE,
    sanitizeHtml
});

// Expose to window for vanilla JS application consumption
if (typeof window !== 'undefined') {
    window.CodeArenaAPI = {
        config: API_CONFIG,
        client: apiClient,
        authService: authService,
        compilerService: compilerService,
        problemService: problemService,
        submissionService: submissionService,
        models: models
    };
}

// Module export for test environments if applicable
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_CONFIG,
        apiClient,
        authService,
        compilerService,
        problemService,
        submissionService,
        models
    };
}
