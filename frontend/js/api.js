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
const AUTH_STORAGE_KEY = 'codearena_preview_auth_user';
const PLAN_STORAGE_KEY = 'codearena_preview_plan';

// Safe storage helper with memory fallback for Node.js / test environments
const _memStore = {};
function _storageGet(k) {
    try {
        if (typeof window !== 'undefined' && window.localStorage) return window.localStorage.getItem(k);
        return _memStore[k] || null;
    } catch (e) {
        return _memStore[k] || null;
    }
}
function _storageSet(k, v) {
    try {
        if (typeof window !== 'undefined' && window.localStorage) window.localStorage.setItem(k, String(v));
    } catch (e) {}
    _memStore[k] = String(v);
}
function _storageRemove(k) {
    try {
        if (typeof window !== 'undefined' && window.localStorage) window.localStorage.removeItem(k);
    } catch (e) {}
    delete _memStore[k];
}

/**
 * Preview Authentication Mock Adapter
 */
const authMockAdapter = {
    isAuthenticated() {
        try {
            return _storageGet(AUTH_STORAGE_KEY) !== null;
        } catch (e) {
            return false;
        }
    },

    getCurrentUser() {
        try {

            const raw = _storageGet(AUTH_STORAGE_KEY);
            if (!raw) return { success: false, data: null };
            return { success: true, data: JSON.parse(raw) };
        } catch (e) {
            return { success: false, data: null };
        }
    },

    login(credentials = {}) {
        const email = (credentials.email || 'student@codearena.dev').trim();
        const user = {
            id: 'usr_prev_' + Math.random().toString(36).substring(2, 8),
            name: credentials.fullName || (email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)),
            email: email,
            role: 'Student',
            plan: typeof subscriptionService !== 'undefined' ? subscriptionService.getCurrentPlan() : 'free',
            loginTime: new Date().toISOString(),
            isMockSession: true
        };
        try {
            _storageSet(AUTH_STORAGE_KEY, JSON.stringify(user));
        } catch (e) {}
        return { success: true, data: { user } };
    },

    register(userData = {}) {
        return this.login(userData);
    },

    logout() {
        try {
            _storageRemove(AUTH_STORAGE_KEY);
        } catch (e) {}
        return { success: true };
    },

    demoLogin(plan = 'free') {
        const user = {
            id: 'usr_demo_student',
            name: 'Demo Student',
            email: 'student.demo@codearena.dev',
            role: 'Student',
            plan: plan,
            loginTime: new Date().toISOString(),
            isMockSession: true
        };
        try {
            _storageSet(AUTH_STORAGE_KEY, JSON.stringify(user));
            _storageSet(PLAN_STORAGE_KEY, plan);
        } catch (e) {}
        return { success: true, data: { user } };
    }
};

/**
 * Authentication Service Layer
 * Dispatches to backend when active, uses mock adapter in preview mode.
 */
const authService = {
    isAuthenticated() {
        return authMockAdapter.isAuthenticated();
    },

    async login(credentials) {
        if (API_CONFIG.useMockAdapter) {
            return authMockAdapter.login(credentials);
        }
        const res = await apiClient('/auth/login', {
            method: 'POST',
            body: {
                email: credentials.email,
                password: credentials.password,
                rememberMe: Boolean(credentials.rememberMe)
            }
        });
        if (!res.success && res.isNetworkFailure) {
            return authMockAdapter.login(credentials);
        }
        return res;
    },

    async register(userData) {
        if (API_CONFIG.useMockAdapter) {
            return authMockAdapter.register(userData);
        }
        const res = await apiClient('/auth/register', {
            method: 'POST',
            body: {
                fullName: userData.fullName,
                email: userData.email,
                password: userData.password
            }
        });
        if (!res.success && res.isNetworkFailure) {
            return authMockAdapter.register(userData);
        }
        return res;
    },

    async logout() {
        if (API_CONFIG.useMockAdapter) {
            return authMockAdapter.logout();
        }
        const res = await apiClient('/auth/logout', { method: 'POST' });
        authMockAdapter.logout();
        return res;
    },

    async getCurrentUser() {
        if (API_CONFIG.useMockAdapter) {
            return authMockAdapter.getCurrentUser();
        }
        const res = await apiClient('/users/me', { method: 'GET' });
        if (!res.success && res.isNetworkFailure) {
            return authMockAdapter.getCurrentUser();
        }
        return res;
    },

    demoLogin(plan = 'free') {
        return authMockAdapter.demoLogin(plan);
    }
};

/**
 * Subscription Service (Client-Side Preview)
 * Transparent pricing: Monthly ($5/mo), Annual ($199/yr).
 * Note: $199/yr is standard annual rate ($199/yr); monthly is $5/mo ($60/yr). No deceptive discount claims.
 */
const subscriptionService = {
    getPlans() {
        return [
            {
                id: 'monthly',
                name: 'CodeArena Pro Monthly',
                price: 5,
                period: 'month',
                formattedPrice: '$5 / month',
                billingTerms: 'Billed monthly ($5/month). Cancel anytime.',
                comparisonNote: 'Flexible monthly billing ($60/year equivalent).',
                benefits: [
                    'Access to all 50 Curated Premium DSA Problems',
                    'Advanced Algorithmic Patterns (Segment Trees, Tarjan, Advanced DP)',
                    'In-Depth Progressive Hints (3 Levels per challenge)',
                    'Specialized Pro Problem Collections & Practice Sets'
                ]
            },
            {
                id: 'annual',
                name: 'CodeArena Pro Annual',
                price: 199,
                period: 'year',
                formattedPrice: '$199 / year',
                billingTerms: 'Billed annually ($199/year).',
                comparisonNote: 'Annual billing commitment ($199/yr). Standard rate.',
                benefits: [
                    'Access to all 50 Curated Premium DSA Problems',
                    'Advanced Algorithmic Patterns (Segment Trees, Tarjan, Advanced DP)',
                    'In-Depth Progressive Hints (3 Levels per challenge)',
                    'Specialized Pro Problem Collections & Practice Sets'
                ]
            }
        ];
    },

    getCurrentPlan() {
        try {
            return _storageGet(PLAN_STORAGE_KEY) || 'free';
        } catch (e) {
            return 'free';
        }
    },

    isPremium() {
        if (typeof authService !== 'undefined' && !authService.isAuthenticated()) {
            return false;
        }
        const plan = this.getCurrentPlan();
        return plan === 'monthly' || plan === 'annual' || plan === 'pro';
    },

    upgradePlan(planId) {
        const validPlan = (planId === 'annual') ? 'annual' : 'monthly';
        try {
            _storageSet(PLAN_STORAGE_KEY, validPlan);
            const userRes = authMockAdapter.getCurrentUser();
            if (userRes && userRes.success && userRes.data) {
                userRes.data.plan = validPlan;
                _storageSet(AUTH_STORAGE_KEY, JSON.stringify(userRes.data));
            }
        } catch (e) {}
        return { success: true, plan: validPlan };
    },

    downgradePlan() {
        try {
            _storageSet(PLAN_STORAGE_KEY, 'free');
            const userRes = authMockAdapter.getCurrentUser();
            if (userRes && userRes.success && userRes.data) {
                userRes.data.plan = 'free';
                _storageSet(AUTH_STORAGE_KEY, JSON.stringify(userRes.data));
            }
        } catch (e) {}
        return { success: true, plan: 'free' };
    },

    canAccessProblem(problemOrId) {
        if (!problemOrId) return true;
        let problem = problemOrId;
        if (typeof problemOrId === 'string') {
            problem = MOCK_PROBLEMS.find(p => p.id === problemOrId || p.slug === problemOrId);
        }
        if (!problem || !problem.isPremium) return true;
        return this.isPremium();
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
    'Hashing',
    'Linked Lists',
    'Stacks and Queues',
    'Binary Search',
    'Recursion and Backtracking',
    'Trees',
    'Heaps and Priority Queues',
    'Graphs',
    'Greedy Algorithms',
    'Dynamic Programming'
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
        "id": "find-pivot-index",
        "title": "Find Pivot Index",
        "slug": "find-pivot-index",
        "difficulty": "Easy",
        "topic": "Arrays",
        "pattern": "Traversal and basic operations",
        "snippet": "Calculate the pivot index where the sum of items to the left equals items to the right.",
        "description": "<p>Given an array of integers <code>nums</code>, calculate the pivot index of this array. The pivot index is the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the index's right. If no such index exists, return <code>-1</code>. If there are multiple pivot indexes, return the left-most pivot index.</p>",
        "inputFormat": "An array of integers <code>nums</code>.",
        "outputFormat": "The 0-based pivot index or <code>-1</code>.",
        "constraints": [
            "1 <= nums.length <= 10^4",
            "-1000 <= nums[i] <= 1000"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [1,7,3,6,5,6]",
                "expectedOutput": "3",
                "explanation": "The pivot index is 3. Left sum = nums[0] + nums[1] + nums[2] = 1 + 7 + 3 = 11. Right sum = nums[4] + nums[5] = 5 + 6 = 11."
            },
            {
                "id": 2,
                "input": "nums = [1,2,3]",
                "expectedOutput": "-1",
                "explanation": "There is no index that satisfies the conditions in the problem statement."
            }
        ],
        "hints": [
            "Think about computing the total sum of all elements upfront.",
            "As you traverse the array from left to right, maintain a running left sum. The right sum at any index is simply totalSum - leftSum - currentElement.",
            "Check if leftSum == totalSum - leftSum - nums[i]. If so, return index i immediately. Remember to update leftSum after checking."
        ],
        "starterCode": "class Solution {\n    public int pivotIndex(int[] nums) {\n        // Write your solution below\n\n        return -1;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "54.2%",
            "submissionsCount": 18450,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "plus-one",
        "title": "Plus One",
        "slug": "plus-one",
        "difficulty": "Easy",
        "topic": "Arrays",
        "pattern": "Traversal and basic operations",
        "snippet": "Increment the large integer represented as an array of digits by one.",
        "description": "<p>You are given a large integer represented as an integer array <code>digits</code>, where each <code>digits[i]</code> is the <code>i</code>-th digit of the integer. The digits are ordered from most significant to least significant in left-to-right order. The large integer does not contain any leading zeros. Increment the large integer by one and return the resulting array of digits.</p>",
        "inputFormat": "An integer array <code>digits</code>.",
        "outputFormat": "The resulting integer array after adding one.",
        "constraints": [
            "1 <= digits.length <= 100",
            "0 <= digits[i] <= 9",
            "digits does not contain leading 0s."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "digits = [1,2,3]",
                "expectedOutput": "[1,2,4]",
                "explanation": "The array represents the integer 123. Incrementing by one gives 124."
            },
            {
                "id": 2,
                "input": "digits = [9]",
                "expectedOutput": "[1,0]",
                "explanation": "The array represents 9. Incrementing by one gives 10."
            }
        ],
        "hints": [
            "Iterate from the least significant digit (end of the array) towards the beginning.",
            "If a digit is less than 9, increment it by 1 and return the array immediately.",
            "If a digit is 9, turn it into 0 and carry over 1 to the next iteration. If all digits were 9, create a new array with length + 1 and set the first digit to 1."
        ],
        "starterCode": "class Solution {\n    public int[] plusOne(int[] digits) {\n        // Write your solution below\n\n        return new int[]{};\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "45.1%",
            "submissionsCount": 22340,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "two-sum",
        "title": "Two Sum",
        "slug": "two-sum",
        "difficulty": "Easy",
        "topic": "Arrays",
        "pattern": "Two Pointers",
        "snippet": "Find two numbers in an array that add up to a target.",
        "description": "<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return the indices of the two numbers such that they add up to <code>target</code>. You may assume that each input has <strong>exactly one solution</strong>, and you may not use the same element twice. You can return the answer in any order.</p>",
        "inputFormat": "An integer array <code>nums</code> and an integer <code>target</code>.",
        "outputFormat": "An integer array <code>[i, j]</code> containing the indices of the two numbers.",
        "constraints": [
            "2 <= nums.length <= 10^4",
            "-10^9 <= nums[i] <= 10^9",
            "-10^9 <= target <= 10^9",
            "Only one valid answer exists."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [2, 7, 11, 15], target = 9",
                "expectedOutput": "[0, 1]",
                "explanation": "Because nums[0] + nums[1] == 2 + 7 == 9, we return [0, 1]."
            },
            {
                "id": 2,
                "input": "nums = [3, 2, 4], target = 6",
                "expectedOutput": "[1, 2]",
                "explanation": "Because nums[1] + nums[2] == 2 + 4 == 6, we return [1, 2]."
            }
        ],
        "hints": [
            "Consider how you can look up whether the complement (target - nums[i]) has already been seen.",
            "A hash map allows checking whether the complement exists in O(1) average time, mapping values to indices. Alternatively, on a sorted copy, two pointers can converge from both ends.",
            "In a single pass with HashMap, for each element check map.containsKey(target - nums[i]). If found, return new int[]{map.get(target - nums[i]), i}; otherwise put nums[i] into the map."
        ],
        "starterCode": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution below\n\n        return new int[]{};\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "49.2%",
            "submissionsCount": 15420,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "container-with-most-water",
        "title": "Container With Most Water",
        "slug": "container-with-most-water",
        "difficulty": "Medium",
        "topic": "Arrays",
        "pattern": "Two Pointers",
        "snippet": "Find two vertical lines that together with the x-axis form a container holding the most water.",
        "description": "<p>You are given an integer array <code>height</code> of length <code>n</code>. There are <code>n</code> vertical lines drawn such that the two endpoints of the <code>i</code>-th line are <code>(i, 0)</code> and <code>(i, height[i])</code>. Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.</p>",
        "inputFormat": "An array of integers <code>height</code>.",
        "outputFormat": "The maximum volume of water.",
        "constraints": [
            "n == height.length",
            "2 <= n <= 10^5",
            "0 <= height[i] <= 10^4"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "height = [1,8,6,2,5,4,8,3,7]",
                "expectedOutput": "49",
                "explanation": "The vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is 49."
            },
            {
                "id": 2,
                "input": "height = [1,1]",
                "expectedOutput": "1",
                "explanation": "The distance between the two lines is 1, and minimum height is 1, giving area 1."
            }
        ],
        "hints": [
            "The area is bounded by the shorter line: area = min(height[left], height[right]) * (right - left).",
            "Start two pointers at opposite ends of the array to maximize width.",
            "Always move the pointer that points to the shorter line inward. Moving the taller line inward could only reduce or match width without increasing height."
        ],
        "starterCode": "class Solution {\n    public int maxArea(int[] height) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "54.8%",
            "submissionsCount": 14200,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "trapping-rain-water",
        "title": "Trapping Rain Water",
        "slug": "trapping-rain-water",
        "difficulty": "Hard",
        "topic": "Arrays",
        "pattern": "Two Pointers",
        "snippet": "Compute how much water an elevation map can trap after raining.",
        "description": "<p>Given <code>n</code> non-negative integers representing an elevation map where the width of each bar is <code>1</code>, compute how much water it can trap after raining.</p>",
        "inputFormat": "An array of non-negative integers <code>height</code>.",
        "outputFormat": "Total volume of trapped rainwater.",
        "constraints": [
            "n == height.length",
            "1 <= n <= 2 * 10^4",
            "0 <= height[i] <= 10^5"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
                "expectedOutput": "6",
                "explanation": "The elevation map [0,1,0,2,1,0,1,3,2,1,2,1] can trap 6 units of rain water."
            },
            {
                "id": 2,
                "input": "height = [4,2,0,3,2,5]",
                "expectedOutput": "9",
                "explanation": "Water trapped is 9 units between the high walls."
            }
        ],
        "hints": [
            "At any index i, the water trapped above it equals max(0, min(maxLeft, maxRight) - height[i]).",
            "Instead of precomputing left and right arrays in O(N) space, use two pointers moving towards each other while maintaining leftMax and rightMax.",
            "If height[left] < height[right], process left: update leftMax and add max(0, leftMax - height[left]) to result, then left++. Otherwise process right similarly."
        ],
        "starterCode": "class Solution {\n    public int trap(int[] height) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "60.4%",
            "submissionsCount": 9850,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "three-sum",
        "title": "3Sum",
        "slug": "three-sum",
        "difficulty": "Medium",
        "topic": "Arrays",
        "pattern": "Two Pointers",
        "snippet": "Find all unique triplets in the array which gives the sum of zero.",
        "description": "<p>Given an integer array <code>nums</code>, return all the triplets <code>[nums[i], nums[j], nums[k]]</code> such that <code>i != j</code>, <code>i != k</code>, and <code>j != k</code>, and <code>nums[i] + nums[j] + nums[k] == 0</code>. Notice that the solution set must not contain duplicate triplets.</p>",
        "inputFormat": "An integer array <code>nums</code>.",
        "outputFormat": "A list of unique integer triplets summing to zero.",
        "constraints": [
            "3 <= nums.length <= 3000",
            "-10^5 <= nums[i] <= 10^5"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [-1,0,1,2,-1,-4]",
                "expectedOutput": "[[-1,-1,2],[-1,0,1]]",
                "explanation": "The distinct triplets are [-1,0,1] and [-1,-1,2]."
            },
            {
                "id": 2,
                "input": "nums = [0,1,1]",
                "expectedOutput": "[]",
                "explanation": "The only possible triplet does not sum up to 0."
            }
        ],
        "hints": [
            "Sorting the array first makes it easier to navigate sums and skip duplicates.",
            "For each element nums[i], reduce the problem to Two Sum II with target = -nums[i] using two pointers (left = i + 1, right = n - 1).",
            "When a valid triplet is found, remember to advance both left and right while skipping duplicate values to prevent duplicate triplets in the output."
        ],
        "starterCode": "class Solution {\n    public java.util.List<java.util.List<Integer>> threeSum(int[] nums) {\n        // Write your solution below\n\n        return new java.util.ArrayList<>();\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "33.9%",
            "submissionsCount": 16700,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "maximum-average-subarray",
        "title": "Maximum Average Subarray I",
        "slug": "maximum-average-subarray",
        "difficulty": "Easy",
        "topic": "Arrays",
        "pattern": "Sliding Window",
        "snippet": "Find a contiguous subarray whose length is equal to k that has the maximum average value.",
        "description": "<p>You are given an integer array <code>nums</code> consisting of <code>n</code> elements, and an integer <code>k</code>. Find a contiguous subarray whose length is equal to <code>k</code> that has the maximum average value and return this value. Any answer with a calculation error less than <code>10^-5</code> will be accepted.</p>",
        "inputFormat": "An integer array <code>nums</code> and integer <code>k</code>.",
        "outputFormat": "Maximum average as a double.",
        "constraints": [
            "n == nums.length",
            "1 <= k <= n <= 10^5",
            "-10^4 <= nums[i] <= 10^4"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [1,12,-5,-6,50,3], k = 4",
                "expectedOutput": "12.75000",
                "explanation": "Maximum average is (12 - 5 - 6 + 50) / 4 = 51 / 4 = 12.75."
            },
            {
                "id": 2,
                "input": "nums = [5], k = 1",
                "expectedOutput": "5.00000",
                "explanation": "The single element has average 5."
            }
        ],
        "hints": [
            "Since k is fixed, finding the maximum average is equivalent to finding the maximum sum of a window of size k.",
            "Calculate the sum of the first k elements as the initial window sum.",
            "Slide the window one element at a time from k to n - 1 by adding nums[i] and subtracting nums[i - k]. Track the maximum sum found and divide by (double)k at the end."
        ],
        "starterCode": "class Solution {\n    public double findMaxAverage(int[] nums, int k) {\n        // Write your solution below\n\n        return 0.0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "44.7%",
            "submissionsCount": 12100,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "minimum-size-subarray-sum",
        "title": "Minimum Size Subarray Sum",
        "slug": "minimum-size-subarray-sum",
        "difficulty": "Medium",
        "topic": "Arrays",
        "pattern": "Sliding Window",
        "snippet": "Find the minimal length of a contiguous subarray of which the sum is greater than or equal to target.",
        "description": "<p>Given an array of positive integers <code>nums</code> and a positive integer <code>target</code>, return the minimal length of a contiguous subarray <code>[nums[l], nums[l+1], ..., nums[r-1], nums[r]]</code> of which the sum is greater than or equal to <code>target</code>. If there is no such subarray, return <code>0</code> instead.</p>",
        "inputFormat": "A positive integer <code>target</code> and positive integer array <code>nums</code>.",
        "outputFormat": "Minimum length of subarray, or <code>0</code>.",
        "constraints": [
            "1 <= target <= 10^9",
            "1 <= nums.length <= 10^5",
            "1 <= nums[i] <= 10^4"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "target = 7, nums = [2,3,1,2,4,3]",
                "expectedOutput": "2",
                "explanation": "The subarray [4,3] has the minimal length under the problem constraint."
            },
            {
                "id": 2,
                "input": "target = 4, nums = [1,4,4]",
                "expectedOutput": "1",
                "explanation": "The subarray [4] satisfies the condition."
            }
        ],
        "hints": [
            "Because all numbers are positive, expanding the right end always increases the sum, and shrinking the left end always decreases the sum.",
            "Use a dynamic sliding window with two pointers left and right.",
            "Expand right to add elements to currentSum. Whenever currentSum >= target, update minLen = min(minLen, right - left + 1), then subtract nums[left] and increment left until sum < target."
        ],
        "starterCode": "class Solution {\n    public int minSubArrayLen(int target, int[] nums) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "46.2%",
            "submissionsCount": 11800,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "range-sum-query-immutable",
        "title": "Range Sum Query - Immutable",
        "slug": "range-sum-query-immutable",
        "difficulty": "Easy",
        "topic": "Arrays",
        "pattern": "Prefix Sum",
        "snippet": "Calculate the sum of the elements of nums between indices left and right inclusive.",
        "description": "<p>Given an integer array <code>nums</code>, handle multiple queries of the following type: calculate the sum of the elements of <code>nums</code> between indices <code>left</code> and <code>right</code> inclusive where <code>left <= right</code>. Implement the <code>NumArray</code> class with a <code>sumRange(int left, int right)</code> method that runs in <code>O(1)</code> time per query.</p>",
        "inputFormat": "An array of integers <code>nums</code> and query bounds <code>left, right</code>.",
        "outputFormat": "Sum of elements between <code>left</code> and <code>right</code>.",
        "constraints": [
            "1 <= nums.length <= 10^4",
            "-10^5 <= nums[i] <= 10^5",
            "0 <= left <= right < nums.length"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [-2, 0, 3, -5, 2, -1], left = 0, right = 2",
                "expectedOutput": "1",
                "explanation": "sumRange(0, 2) -> (-2) + 0 + 3 = 1."
            },
            {
                "id": 2,
                "input": "nums = [-2, 0, 3, -5, 2, -1], left = 2, right = 5",
                "expectedOutput": "-1",
                "explanation": "sumRange(2, 5) -> 3 + (-5) + 2 + (-1) = -1."
            }
        ],
        "hints": [
            "Precompute prefix sums so range sums can be answered in O(1) time without iterating repeatedly.",
            "Build a prefix array of size n + 1 where prefix[i] stores the sum of elements from index 0 up to i - 1.",
            "The range sum from left to right is simply prefix[right + 1] - prefix[left]."
        ],
        "starterCode": "class Solution {\n    public int sumRange(int[] nums, int left, int right) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "61.3%",
            "submissionsCount": 14900,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "subarray-sum-equals-k",
        "title": "Subarray Sum Equals K",
        "slug": "subarray-sum-equals-k",
        "difficulty": "Medium",
        "topic": "Arrays",
        "pattern": "Prefix Sum",
        "snippet": "Find the total number of continuous subarrays whose sum equals to k.",
        "description": "<p>Given an array of integers <code>nums</code> and an integer <code>k</code>, return the total number of subarrays whose sum equals to <code>k</code>. A subarray is a contiguous non-empty sequence of elements within an array.</p>",
        "inputFormat": "An integer array <code>nums</code> and target sum <code>k</code>.",
        "outputFormat": "Number of continuous subarrays summing to <code>k</code>.",
        "constraints": [
            "1 <= nums.length <= 2 * 10^4",
            "-1000 <= nums[i] <= 1000",
            "-10^7 <= k <= 10^7"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [1,1,1], k = 2",
                "expectedOutput": "2",
                "explanation": "The subarrays [nums[0], nums[1]] and [nums[1], nums[2]] sum to 2."
            },
            {
                "id": 2,
                "input": "nums = [1,2,3], k = 3",
                "expectedOutput": "2",
                "explanation": "Subarrays [1, 2] and [3] sum to 3."
            }
        ],
        "hints": [
            "Can you express the sum of any subarray from index i to j in terms of prefix sums?",
            "subarraySum(i, j) = prefixSum[j] - prefixSum[i - 1] == k => prefixSum[i - 1] = prefixSum[j] - k.",
            "Use a HashMap to store the frequencies of prefix sums observed so far. Initialize map with (0: 1). For each element, add currentSum, check if (currentSum - k) is in map, and update count."
        ],
        "starterCode": "class Solution {\n    public int subarraySum(int[] nums, int k) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "44.1%",
            "submissionsCount": 15600,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "maximum-subarray",
        "title": "Maximum Subarray",
        "slug": "maximum-subarray",
        "difficulty": "Medium",
        "topic": "Arrays",
        "pattern": "Kadane's Algorithm",
        "snippet": "Find the contiguous subarray with the largest sum.",
        "description": "<p>Given an integer array <code>nums</code>, find the subarray with the largest sum, and return its sum. A subarray is a contiguous non-empty sequence of elements within an array.</p>",
        "inputFormat": "An integer array <code>nums</code>.",
        "outputFormat": "Maximum sum of a contiguous subarray.",
        "constraints": [
            "1 <= nums.length <= 10^5",
            "-10^4 <= nums[i] <= 10^4"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [-2,1,-3,4,-1,2,1,-5,4]",
                "expectedOutput": "6",
                "explanation": "The subarray [4,-1,2,1] has the largest sum 6."
            },
            {
                "id": 2,
                "input": "nums = [5,4,-1,7,8]",
                "expectedOutput": "23",
                "explanation": "The entire array has the largest sum 23."
            }
        ],
        "hints": [
            "If the current running sum becomes negative, would keeping it benefit future elements?",
            "At each index i, the maximum subarray ending at i is max(nums[i], currentSum + nums[i]). This is Kadane's algorithm.",
            "Maintain currentSum = nums[0] and maxSum = nums[0]. Iterate from index 1: currentSum = Math.max(nums[i], currentSum + nums[i]) and maxSum = Math.max(maxSum, currentSum)."
        ],
        "starterCode": "class Solution {\n    public int maxSubArray(int[] nums) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "50.4%",
            "submissionsCount": 19800,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "maximum-sum-circular-subarray",
        "title": "Maximum Sum Circular Subarray",
        "slug": "maximum-sum-circular-subarray",
        "difficulty": "Medium",
        "topic": "Arrays",
        "pattern": "Kadane's Algorithm",
        "snippet": "Find the maximum possible sum of a non-empty subarray of the circular array.",
        "description": "<p>Given a circular integer array <code>nums</code> of length <code>n</code>, return the maximum possible sum of a non-empty subarray of <code>nums</code>. A circular array means the end of the array connects to the beginning.</p>",
        "inputFormat": "An integer array <code>nums</code>.",
        "outputFormat": "Maximum subarray sum in circular array.",
        "constraints": [
            "n == nums.length",
            "1 <= n <= 3 * 10^4",
            "-3 * 10^4 <= nums[i] <= 3 * 10^4"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [1,-2,3,-2]",
                "expectedOutput": "3",
                "explanation": "Subarray [3] has maximum sum 3."
            },
            {
                "id": 2,
                "input": "nums = [5,-3,5]",
                "expectedOutput": "10",
                "explanation": "Subarray [5,5] has maximum sum 5 + 5 = 10."
            }
        ],
        "hints": [
            "A circular maximum subarray is either non-wrapping (standard Kadane) or wrapping (totalSum minus minimum subarray).",
            "Run Kadane's algorithm once for max subarray, and once for min subarray, while calculating totalSum.",
            "If maxSubarraySum > 0, return max(maxSubarraySum, totalSum - minSubarraySum). If all elements are negative, return maxSubarraySum directly."
        ],
        "starterCode": "class Solution {\n    public int maxSubarraySumCircular(int[] nums) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "43.8%",
            "submissionsCount": 9200,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "merge-sorted-array",
        "title": "Merge Sorted Array",
        "slug": "merge-sorted-array",
        "difficulty": "Easy",
        "topic": "Arrays",
        "pattern": "Sorting and Searching",
        "snippet": "Merge two sorted integer arrays nums1 and nums2 into nums1 as one sorted array.",
        "description": "<p>You are given two integer arrays <code>nums1</code> and <code>nums2</code>, sorted in non-decreasing order, and two integers <code>m</code> and <code>n</code>, representing the number of elements in <code>nums1</code> and <code>nums2</code> respectively. Merge <code>nums1</code> and <code>nums2</code> into a single array sorted in non-decreasing order. The array <code>nums1</code> has a length of <code>m + n</code>, where the last <code>n</code> elements are set to <code>0</code>.</p>",
        "inputFormat": "Arrays <code>nums1</code> (size m+n), <code>nums2</code> (size n), and integers <code>m, n</code>.",
        "outputFormat": "None (modify <code>nums1</code> in-place).",
        "constraints": [
            "nums1.length == m + n",
            "nums2.length == n",
            "0 <= m, n <= 200",
            "-10^9 <= nums1[i], nums2[j] <= 10^9"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3",
                "expectedOutput": "[1,2,2,3,5,6]",
                "explanation": "The arrays we are merging are [1,2,3] and [2,5,6]."
            },
            {
                "id": 2,
                "input": "nums1 = [1], m = 1, nums2 = [], n = 0",
                "expectedOutput": "[1]",
                "explanation": "nums2 is empty, nums1 remains [1]."
            }
        ],
        "hints": [
            "If you fill from the front, you will overwrite existing elements in nums1. Can you fill from the back?",
            "Use three pointers: p1 = m - 1 (end of valid nums1), p2 = n - 1 (end of nums2), and p = m + n - 1 (end of buffer).",
            "Compare nums1[p1] and nums2[p2], place the larger at nums1[p] and decrement p. If elements remain in nums2, copy them over."
        ],
        "starterCode": "class Solution {\n    public void merge(int[] nums1, int m, int[] nums2, int n) {\n        // Write your solution below\n\n        return ;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "47.9%",
            "submissionsCount": 21500,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "sort-colors",
        "title": "Sort Colors",
        "slug": "sort-colors",
        "difficulty": "Medium",
        "topic": "Arrays",
        "pattern": "Sorting and Searching",
        "snippet": "Sort an array with 0s, 1s, and 2s in-place without using library sort.",
        "description": "<p>Given an array <code>nums</code> with <code>n</code> objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue. We will use the integers <code>0</code>, <code>1</code>, and <code>2</code> to represent the color red, white, and blue respectively. You must solve this problem without using the library's sort function.</p>",
        "inputFormat": "An array <code>nums</code> containing 0, 1, and 2.",
        "outputFormat": "None (sort <code>nums</code> in-place).",
        "constraints": [
            "n == nums.length",
            "1 <= n <= 300",
            "nums[i] is either 0, 1, or 2."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [2,0,2,1,1,0]",
                "expectedOutput": "[0,0,1,1,2,2]",
                "explanation": "Sorted colors in-place."
            },
            {
                "id": 2,
                "input": "nums = [2,0,1]",
                "expectedOutput": "[0,1,2]",
                "explanation": "Sorted colors in-place."
            }
        ],
        "hints": [
            "This is the classic Dutch National Flag partitioning problem.",
            "Maintain three pointers: low = 0 (boundary for 0s), mid = 0 (current element), and high = n - 1 (boundary for 2s).",
            "While mid <= high: if nums[mid] == 0, swap(nums[low++], nums[mid++]); if nums[mid] == 1, mid++; if nums[mid] == 2, swap(nums[mid], nums[high--])."
        ],
        "starterCode": "class Solution {\n    public void sortColors(int[] nums) {\n        // Write your solution below\n\n        return ;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "60.1%",
            "submissionsCount": 15400,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "majority-element",
        "title": "Majority Element",
        "slug": "majority-element",
        "difficulty": "Easy",
        "topic": "Arrays",
        "pattern": "Frequency Counting",
        "snippet": "Find the element that appears more than floor(n / 2) times in the array.",
        "description": "<p>Given an array <code>nums</code> of size <code>n</code>, return the majority element. The majority element is the element that appears more than <code>floor(n / 2)</code> times. You may assume that the majority element always exists in the array.</p>",
        "inputFormat": "An array of integers <code>nums</code>.",
        "outputFormat": "The majority integer.",
        "constraints": [
            "n == nums.length",
            "1 <= n <= 5 * 10^4",
            "-10^9 <= nums[i] <= 10^9"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [3,2,3]",
                "expectedOutput": "3",
                "explanation": "3 appears 2 times, which is more than 3/2 = 1."
            },
            {
                "id": 2,
                "input": "nums = [2,2,1,1,1,2,2]",
                "expectedOutput": "2",
                "explanation": "2 appears 4 times, which is more than 7/2 = 3."
            }
        ],
        "hints": [
            "While a HashMap can count frequencies in O(N) space, Boyer-Moore Voting Algorithm solves it in O(1) space.",
            "Maintain a candidate and a count. When count is 0, pick current element as candidate.",
            "If current element matches candidate, increment count; otherwise decrement count. Since the majority appears > n/2 times, it will survive."
        ],
        "starterCode": "class Solution {\n    public int majorityElement(int[] nums) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "64.2%",
            "submissionsCount": 18900,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "find-all-duplicates-in-array",
        "title": "Find All Duplicates in an Array",
        "slug": "find-all-duplicates-in-array",
        "difficulty": "Medium",
        "topic": "Arrays",
        "pattern": "Frequency Counting",
        "snippet": "Find all the elements that appear twice in an array with integers from 1 to n.",
        "description": "<p>Given an integer array <code>nums</code> of length <code>n</code> where all the integers of <code>nums</code> are in the range <code>[1, n]</code> and each integer appears once or twice, return an array of all the integers that appears twice. You must write an algorithm that runs in <code>O(n)</code> time and uses only constant extra space.</p>",
        "inputFormat": "An integer array <code>nums</code>.",
        "outputFormat": "A list of integers that appear twice.",
        "constraints": [
            "n == nums.length",
            "1 <= n <= 10^5",
            "1 <= nums[i] <= n"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [4,3,2,7,8,2,3,1]",
                "expectedOutput": "[2,3]",
                "explanation": "2 and 3 both appear twice."
            },
            {
                "id": 2,
                "input": "nums = [1,1,2]",
                "expectedOutput": "[1]",
                "explanation": "1 appears twice."
            }
        ],
        "hints": [
            "The values range from 1 to n, which matches the valid index range 0 to n - 1.",
            "Use the array itself as a hash table by negating the value at the corresponding index (Math.abs(nums[i]) - 1).",
            "For each num, let idx = Math.abs(num) - 1. If nums[idx] < 0, then Math.abs(num) is a duplicate! Otherwise negate nums[idx]."
        ],
        "starterCode": "class Solution {\n    public java.util.List<Integer> findDuplicates(int[] nums) {\n        // Write your solution below\n\n        return new java.util.ArrayList<>();\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "73.5%",
            "submissionsCount": 12800,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "length-of-last-word",
        "title": "Length of Last Word",
        "slug": "length-of-last-word",
        "difficulty": "Easy",
        "topic": "Strings",
        "pattern": "String Traversal",
        "snippet": "Return the length of the last word in the string consisting of non-space characters.",
        "description": "<p>Given a string <code>s</code> consisting of words and spaces, return the length of the last word in the string. A word is a maximal substring consisting of non-space characters only.</p>",
        "inputFormat": "A string <code>s</code>.",
        "outputFormat": "Length of the last word.",
        "constraints": [
            "1 <= s.length <= 10^4",
            "s consists of only English letters and spaces ' '."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "s = 'Hello World'",
                "expectedOutput": "5",
                "explanation": "The last word is 'World' with length 5."
            },
            {
                "id": 2,
                "input": "s = '   fly me   to   the moon  '",
                "expectedOutput": "4",
                "explanation": "The last word is 'moon' with length 4."
            }
        ],
        "hints": [
            "Traversing from the back (end of string) is much faster than starting from the beginning.",
            "First, skip any trailing space characters by decrementing your pointer.",
            "Once you hit the first non-space character, count characters until you encounter the next space or the start of the string."
        ],
        "starterCode": "class Solution {\n    public int lengthOfLastWord(String s) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "48.2%",
            "submissionsCount": 24500,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "defanging-ip-address",
        "title": "Defanging an IP Address",
        "slug": "defanging-ip-address",
        "difficulty": "Easy",
        "topic": "Strings",
        "pattern": "String Traversal",
        "snippet": "Replace every period in an IPv4 IP address with [.]",
        "description": "<p>Given a valid (IPv4) IP <code>address</code>, return a defanged version of that IP address. A defanged IP address replaces every period <code>'.'</code> with <code>'[.]'</code>.</p>",
        "inputFormat": "A valid IPv4 <code>address</code> string.",
        "outputFormat": "The defanged IP address string.",
        "constraints": [
            "The given address is a valid IPv4 address."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "address = '1.1.1.1'",
                "expectedOutput": "'1[.]1[.]1[.]1'",
                "explanation": "Each '.' is replaced by '[.]'."
            },
            {
                "id": 2,
                "input": "address = '255.100.50.0'",
                "expectedOutput": "'255[.]100[.]50[.]0'",
                "explanation": "Each '.' is replaced by '[.]'."
            }
        ],
        "hints": [
            "You can construct the result by iterating through characters in the input string.",
            "A StringBuilder allows building the new string in O(N) time without allocating multiple intermediate String objects.",
            "For each character ch, if ch == '.', append '[.]'; otherwise append ch."
        ],
        "starterCode": "class Solution {\n    public String defangIPaddr(String address) {\n        // Write your solution below\n\n        return address;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "88.9%",
            "submissionsCount": 19200,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "reverse-a-string",
        "title": "Reverse a String",
        "slug": "reverse-a-string",
        "difficulty": "Easy",
        "topic": "Strings",
        "pattern": "Two Pointers",
        "snippet": "Reverse the given character array in-place.",
        "description": "<p>Write a function that reverses a character array <code>s</code> in-place. You must modify the input array directly with <code>O(1)</code> extra memory without allocating a new array.</p>",
        "inputFormat": "A character array <code>s</code>.",
        "outputFormat": "None (modify <code>s</code> in-place).",
        "constraints": [
            "1 <= s.length <= 10^5",
            "s[i] is a printable ASCII character."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "s = ['h','e','l','l','o']",
                "expectedOutput": "['o','l','l','e','h']",
                "explanation": "The reversed array has elements in reverse order."
            },
            {
                "id": 2,
                "input": "s = ['H','a','n','n','a','h']",
                "expectedOutput": "['h','a','n','n','a','H']",
                "explanation": "In-place swap produces reversed string."
            }
        ],
        "hints": [
            "Use two pointers, one starting at the beginning (0) and one at the end (length - 1).",
            "Swap characters at the left and right pointers, then move both pointers towards the center.",
            "Continue the while loop while left < right. Use a temporary char variable for the swap."
        ],
        "starterCode": "class Solution {\n    public void reverseString(char[] s) {\n        // Write your solution below\n\n        return ;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "76.8%",
            "submissionsCount": 25400,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "valid-palindrome",
        "title": "Valid Palindrome",
        "slug": "valid-palindrome",
        "difficulty": "Easy",
        "topic": "Strings",
        "pattern": "Two Pointers",
        "snippet": "Check if a string is a palindrome after converting all uppercase letters to lowercase and removing non-alphanumeric characters.",
        "description": "<p>A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string <code>s</code>, return <code>true</code> if it is a palindrome, or <code>false</code> otherwise.</p>",
        "inputFormat": "A string <code>s</code>.",
        "outputFormat": "Boolean <code>true</code> if palindrome, <code>false</code> otherwise.",
        "constraints": [
            "1 <= s.length <= 2 * 10^5",
            "s consists only of printable ASCII characters."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "s = 'A man, a plan, a canal: Panama'",
                "expectedOutput": "true",
                "explanation": "'amanaplanacanalpanama' is a palindrome."
            },
            {
                "id": 2,
                "input": "s = 'race a car'",
                "expectedOutput": "false",
                "explanation": "'raceacar' is not a palindrome."
            }
        ],
        "hints": [
            "Two pointers converging from both ends allow in-place verification without extra memory.",
            "Use Character.isLetterOrDigit(ch) to skip non-alphanumeric characters on both left and right sides.",
            "Compare Character.toLowerCase(s.charAt(left)) with Character.toLowerCase(s.charAt(right)). If they differ, return false immediately."
        ],
        "starterCode": "class Solution {\n    public boolean isPalindrome(String s) {\n        // Write your solution below\n\n        return false;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "45.8%",
            "submissionsCount": 27800,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "reverse-vowels-of-a-string",
        "title": "Reverse Vowels of a String",
        "slug": "reverse-vowels-of-a-string",
        "difficulty": "Easy",
        "topic": "Strings",
        "pattern": "Two Pointers",
        "snippet": "Reverse only the vowels in a given string and return it.",
        "description": "<p>Given a string <code>s</code>, reverse only all the vowels in the string and return it. The vowels are <code>'a'</code>, <code>'e'</code>, <code>'i'</code>, <code>'o'</code>, and <code>'u'</code>, and they can appear in both lower and upper cases, more than once.</p>",
        "inputFormat": "A string <code>s</code>.",
        "outputFormat": "String with vowels reversed.",
        "constraints": [
            "1 <= s.length <= 3 * 10^5",
            "s consists of printable ASCII characters."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "s = 'IceCreAm'",
                "expectedOutput": "'AceCreIm'",
                "explanation": "The vowels are ['I', 'e', 'e', 'A']. Reversing them gives ['A', 'e', 'e', 'I']."
            },
            {
                "id": 2,
                "input": "s = 'leetcode'",
                "expectedOutput": "'leotcede'",
                "explanation": "The vowels ['e', 'e', 'o', 'e'] reversed produce 'leotcede'."
            }
        ],
        "hints": [
            "Convert string to a char array so you can perform in-place swaps.",
            "Use two pointers left and right. Advance left until it points to a vowel, and decrement right until it points to a vowel.",
            "When both point to vowels, swap their characters, increment left, decrement right, and continue while left < right."
        ],
        "starterCode": "class Solution {\n    public String reverseVowels(String s) {\n        // Write your solution below\n\n        return s;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "52.4%",
            "submissionsCount": 16100,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "longest-substring",
        "title": "Longest Substring Without Repeating Characters",
        "slug": "longest-substring",
        "difficulty": "Medium",
        "topic": "Strings",
        "pattern": "Sliding Window",
        "snippet": "Find the length of the longest substring without repeating characters.",
        "description": "<p>Given a string <code>s</code>, find the length of the longest substring without duplicate characters.</p>",
        "inputFormat": "A string <code>s</code>.",
        "outputFormat": "The maximum length of a substring without repeating characters.",
        "constraints": [
            "0 <= s.length <= 5 * 10^4",
            "s consists of English letters, digits, symbols and spaces."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "s = 'abcabcbb'",
                "expectedOutput": "3",
                "explanation": "The answer is 'abc', with the length of 3."
            },
            {
                "id": 2,
                "input": "s = 'bbbbb'",
                "expectedOutput": "1",
                "explanation": "The answer is 'b', with the length of 1."
            }
        ],
        "hints": [
            "Think of a sliding window [left, right] where all characters inside the window are guaranteed to be unique.",
            "A hash map or array can store the most recent index where each character appeared.",
            "When right encounters a character already seen at index lastIdx >= left, jump left to lastIdx + 1. Update maxLen = max(maxLen, right - left + 1)."
        ],
        "starterCode": "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "34.5%",
            "submissionsCount": 31200,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "permutation-in-string",
        "title": "Permutation in String",
        "slug": "permutation-in-string",
        "difficulty": "Medium",
        "topic": "Strings",
        "pattern": "Sliding Window",
        "snippet": "Check if s2 contains a permutation of s1.",
        "description": "<p>Given two strings <code>s1</code> and <code>s2</code>, return <code>true</code> if <code>s2</code> contains a permutation of <code>s1</code>, or <code>false</code> otherwise. In other words, return <code>true</code> if one of <code>s1</code>'s permutations is the substring of <code>s2</code>.</p>",
        "inputFormat": "Two strings <code>s1</code> and <code>s2</code>.",
        "outputFormat": "Boolean <code>true</code> if permutation found.",
        "constraints": [
            "1 <= s1.length, s2.length <= 10^4",
            "s1 and s2 consist of lowercase English letters."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "s1 = 'ab', s2 = 'eidbaooo'",
                "expectedOutput": "true",
                "explanation": "s2 contains one permutation of s1 ('ba')."
            },
            {
                "id": 2,
                "input": "s1 = 'ab', s2 = 'eidboaoo'",
                "expectedOutput": "false",
                "explanation": "Neither 'ab' nor 'ba' exists as a contiguous substring."
            }
        ],
        "hints": [
            "A permutation has the exact same character frequencies as s1.",
            "Use a fixed-size sliding window of length s1.length() over string s2.",
            "Count character frequencies in s1 and in the current window of s2 using int[26]. If arrays match, return true. Update counts as window slides."
        ],
        "starterCode": "class Solution {\n    public boolean checkInclusion(String s1, String s2) {\n        // Write your solution below\n\n        return false;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "44.3%",
            "submissionsCount": 14900,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "minimum-window-substring",
        "title": "Minimum Window Substring",
        "slug": "minimum-window-substring",
        "difficulty": "Hard",
        "topic": "Strings",
        "pattern": "Sliding Window",
        "snippet": "Find the minimum window substring of s that contains all characters in t.",
        "description": "<p>Given two strings <code>s</code> and <code>t</code> of lengths <code>m</code> and <code>n</code> respectively, return the minimum window substring of <code>s</code> such that every character in <code>t</code> (including duplicates) is included in the window. If there is no such substring, return the empty string <code>''</code>.</p>",
        "inputFormat": "Two strings <code>s</code> and <code>t</code>.",
        "outputFormat": "Minimum window substring.",
        "constraints": [
            "m == s.length",
            "n == t.length",
            "1 <= m, n <= 10^5",
            "s and t consist of uppercase and lowercase English letters."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "s = 'ADOBECODEBANC', t = 'ABC'",
                "expectedOutput": "'BANC'",
                "explanation": "The minimum window substring 'BANC' includes 'A', 'B', and 'C' from string t."
            },
            {
                "id": 2,
                "input": "s = 'a', t = 'a'",
                "expectedOutput": "'a'",
                "explanation": "The entire string s is the minimum window."
            }
        ],
        "hints": [
            "Track the character requirements of t using a frequency map.",
            "Expand the right pointer to include characters until all requirements of t are satisfied (valid window).",
            "Once valid, shrink from left as much as possible while maintaining validity, updating minWindow. Repeat until right reaches end."
        ],
        "starterCode": "class Solution {\n    public String minWindow(String s, String t) {\n        // Write your solution below\n\n        return '';\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "41.6%",
            "submissionsCount": 11200,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "find-index-of-first-occurrence",
        "title": "Find Index of First Occurrence in a String",
        "slug": "find-index-of-first-occurrence",
        "difficulty": "Easy",
        "topic": "Strings",
        "pattern": "String Matching",
        "snippet": "Find the first occurrence of needle in haystack, or -1 if needle is not part of haystack.",
        "description": "<p>Given two strings <code>needle</code> and <code>haystack</code>, return the index of the first occurrence of <code>needle</code> in <code>haystack</code>, or <code>-1</code> if <code>needle</code> is not part of <code>haystack</code>.</p>",
        "inputFormat": "Two strings <code>haystack</code> and <code>needle</code>.",
        "outputFormat": "0-based index or -1.",
        "constraints": [
            "1 <= haystack.length, needle.length <= 10^4",
            "haystack and needle consist of only lowercase English characters."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "haystack = 'sadbutsad', needle = 'sad'",
                "expectedOutput": "0",
                "explanation": "'sad' occurs at index 0 and 6. The first occurrence is at index 0."
            },
            {
                "id": 2,
                "input": "haystack = 'leetcode', needle = 'leeto'",
                "expectedOutput": "-1",
                "explanation": "'leeto' did not occur in 'leetcode'."
            }
        ],
        "hints": [
            "Check every possible starting position i in haystack where needle could fit.",
            "For each position i from 0 up to haystack.length() - needle.length(), compare characters.",
            "If needle matches characters starting at i, return i. If loop completes with no match, return -1. (KMP can optimize to O(N))."
        ],
        "starterCode": "class Solution {\n    public int strStr(String haystack, String needle) {\n        // Write your solution below\n\n        return -1;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "40.2%",
            "submissionsCount": 21800,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "repeated-dna-sequences",
        "title": "Repeated DNA Sequences",
        "slug": "repeated-dna-sequences",
        "difficulty": "Medium",
        "topic": "Strings",
        "pattern": "String Matching",
        "snippet": "Find all 10-letter-long sequences that occur more than once in a DNA molecule.",
        "description": "<p>The DNA sequence is composed of a series of nucleotides abbreviated as <code>'A'</code>, <code>'C'</code>, <code>'G'</code>, and <code>'T'</code>. When studying DNA, it is useful to identify repeated sequences within the DNA. Given a string <code>s</code> that represents a DNA sequence, return all the <code>10</code>-letter-long sequences (substrings) that occur more than once in a DNA molecule.</p>",
        "inputFormat": "A DNA string <code>s</code>.",
        "outputFormat": "List of 10-letter substrings occurring more than once.",
        "constraints": [
            "1 <= s.length <= 10^5",
            "s[i] is either 'A', 'C', 'G', or 'T'."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "s = 'AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT'",
                "expectedOutput": "['AAAAACCCCC','CCCCCAAAAA']",
                "explanation": "Both sequences appear more than once."
            },
            {
                "id": 2,
                "input": "s = 'AAAAAAAAAAAAA'",
                "expectedOutput": "['AAAAAAAAAA']",
                "explanation": "'AAAAAAAAAA' appears 4 times."
            }
        ],
        "hints": [
            "Every target sequence has a fixed length of exactly 10 characters.",
            "Maintain a HashSet of seen 10-letter substrings, and a second HashSet of repeated substrings.",
            "Iterate i from 0 to s.length() - 10. Extract sub = s.substring(i, i + 10). If !seen.add(sub), repeated.add(sub). Return new ArrayList<>(repeated)."
        ],
        "starterCode": "class Solution {\n    public java.util.List<String> findRepeatedDnaSequences(String s) {\n        // Write your solution below\n\n        return new java.util.ArrayList<>();\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "47.8%",
            "submissionsCount": 9700,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "palindrome-number",
        "title": "Palindrome Number",
        "slug": "palindrome-number",
        "difficulty": "Easy",
        "topic": "Strings",
        "pattern": "Palindrome Patterns",
        "snippet": "Determine whether an integer is a palindrome without converting to string.",
        "description": "<p>Given an integer <code>x</code>, return <code>true</code> if <code>x</code> is a palindrome, and <code>false</code> otherwise. An integer is a palindrome when it reads the same forward and backward.</p>",
        "inputFormat": "An integer <code>x</code>.",
        "outputFormat": "Boolean <code>true</code> if palindrome, <code>false</code> otherwise.",
        "constraints": [
            "-2^31 <= x <= 2^31 - 1"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "x = 121",
                "expectedOutput": "true",
                "explanation": "121 reads as 121 from left to right and from right to left."
            },
            {
                "id": 2,
                "input": "x = -121",
                "expectedOutput": "false",
                "explanation": "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome."
            }
        ],
        "hints": [
            "Negative numbers cannot be palindromes because of the minus sign.",
            "Also, numbers ending in 0 (except 0 itself) cannot be palindromes.",
            "Revert half of the number by extracting digits: reverted = reverted * 10 + x % 10; x /= 10. Stop when x <= reverted. Return x == reverted || x == reverted / 10."
        ],
        "starterCode": "class Solution {\n    public boolean isPalindrome(int x) {\n        // Write your solution below\n\n        return false;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "54.1%",
            "submissionsCount": 29400,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "longest-palindromic-substring",
        "title": "Longest Palindromic Substring",
        "slug": "longest-palindromic-substring",
        "difficulty": "Medium",
        "topic": "Strings",
        "pattern": "Palindrome Patterns",
        "snippet": "Find the longest palindromic substring in s.",
        "description": "<p>Given a string <code>s</code>, return the longest palindromic substring in <code>s</code>.</p>",
        "inputFormat": "A string <code>s</code>.",
        "outputFormat": "The longest palindromic substring.",
        "constraints": [
            "1 <= s.length <= 1000",
            "s consist of only digits and English letters."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "s = 'babad'",
                "expectedOutput": "'bab'",
                "explanation": "'aba' is also a valid answer."
            },
            {
                "id": 2,
                "input": "s = 'cbbd'",
                "expectedOutput": "'bb'",
                "explanation": "The longest palindrome is 'bb'."
            }
        ],
        "hints": [
            "A palindrome mirrors around its center. A string has 2n - 1 possible centers (single characters or pairs).",
            "For each index i, expand outwards for both odd-length (center i) and even-length (center i, i + 1) palindromes.",
            "Write a helper expand(s, left, right) that increments while bounds match and characters are equal. Track the longest window found."
        ],
        "starterCode": "class Solution {\n    public String longestPalindrome(String s) {\n        // Write your solution below\n\n        return s;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "33.2%",
            "submissionsCount": 18300,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "palindromic-substrings",
        "title": "Palindromic Substrings",
        "slug": "palindromic-substrings",
        "difficulty": "Medium",
        "topic": "Strings",
        "pattern": "Palindrome Patterns",
        "snippet": "Count how many palindromic substrings are in the string.",
        "description": "<p>Given a string <code>s</code>, return the number of palindromic substrings in it. A substring is a contiguous sequence of characters within the string.</p>",
        "inputFormat": "A string <code>s</code>.",
        "outputFormat": "Count of palindromic substrings.",
        "constraints": [
            "1 <= s.length <= 1000",
            "s consists of lowercase English letters."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "s = 'abc'",
                "expectedOutput": "3",
                "explanation": "Three palindromic strings: 'a', 'b', 'c'."
            },
            {
                "id": 2,
                "input": "s = 'aaa'",
                "expectedOutput": "6",
                "explanation": "Six palindromic strings: 'a', 'a', 'a', 'aa', 'aa', 'aaa'."
            }
        ],
        "hints": [
            "Every single character is a palindrome of length 1.",
            "Expand around each possible center. There are 2n - 1 centers (n odd centers and n - 1 even centers).",
            "For each center, expand outward as long as s.charAt(left) == s.charAt(right), incrementing total count and moving pointers."
        ],
        "starterCode": "class Solution {\n    public int countSubstrings(String s) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "67.8%",
            "submissionsCount": 13400,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "valid-anagram",
        "title": "Valid Anagram",
        "slug": "valid-anagram",
        "difficulty": "Easy",
        "topic": "Strings",
        "pattern": "Character Frequency",
        "snippet": "Determine if t is an anagram of s.",
        "description": "<p>Given two strings <code>s</code> and <code>t</code>, return <code>true</code> if <code>t</code> is an anagram of <code>s</code>, and <code>false</code> otherwise. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.</p>",
        "inputFormat": "Two strings <code>s</code> and <code>t</code>.",
        "outputFormat": "Boolean <code>true</code> if anagram.",
        "constraints": [
            "1 <= s.length, t.length <= 5 * 10^4",
            "s and t consist of lowercase English letters."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "s = 'anagram', t = 'nagaram'",
                "expectedOutput": "true",
                "explanation": "Both strings have the same character counts."
            },
            {
                "id": 2,
                "input": "s = 'rat', t = 'car'",
                "expectedOutput": "false",
                "explanation": "Characters do not match in frequency."
            }
        ],
        "hints": [
            "If lengths differ, they cannot be anagrams.",
            "An integer array count of size 26 can tally character frequencies in O(N) time and O(1) space.",
            "Increment count for each char in s, decrement for each char in t. At the end, every entry in count must be 0."
        ],
        "starterCode": "class Solution {\n    public boolean isAnagram(String s, String t) {\n        // Write your solution below\n\n        return false;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "63.7%",
            "submissionsCount": 26100,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "first-unique-character-in-string",
        "title": "First Unique Character in a String",
        "slug": "first-unique-character-in-string",
        "difficulty": "Easy",
        "topic": "Strings",
        "pattern": "Character Frequency",
        "snippet": "Find the first non-repeating character in a string and return its index.",
        "description": "<p>Given a string <code>s</code>, find the first non-repeating character in it and return its index. If it does not exist, return <code>-1</code>.</p>",
        "inputFormat": "A string <code>s</code>.",
        "outputFormat": "Index of first unique character or -1.",
        "constraints": [
            "1 <= s.length <= 10^5",
            "s consists of only lowercase English letters."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "s = 'leetcode'",
                "expectedOutput": "0",
                "explanation": "The character 'l' at index 0 is the first character that does not occur at any other index."
            },
            {
                "id": 2,
                "input": "s = 'loveleetcode'",
                "expectedOutput": "2",
                "explanation": "The character 'v' at index 2 is the first unique character."
            }
        ],
        "hints": [
            "Use a two-pass approach.",
            "In the first pass, count the frequency of each character using an int[26] array.",
            "In the second pass, iterate through the string from index 0 to length - 1. Return the first index where count[s.charAt(i) - 'a'] == 1."
        ],
        "starterCode": "class Solution {\n    public int firstUniqChar(String s) {\n        // Write your solution below\n\n        return -1;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "60.4%",
            "submissionsCount": 22900,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "group-anagrams",
        "title": "Group Anagrams",
        "slug": "group-anagrams",
        "difficulty": "Medium",
        "topic": "Strings",
        "pattern": "Character Frequency",
        "snippet": "Group an array of strings into anagram groups.",
        "description": "<p>Given an array of strings <code>strs</code>, group the anagrams together. You can return the answer in any order.</p>",
        "inputFormat": "An array of strings <code>strs</code>.",
        "outputFormat": "List of grouped anagram string lists.",
        "constraints": [
            "1 <= strs.length <= 10^4",
            "0 <= strs[i].length <= 100",
            "strs[i] consists of lowercase English letters."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "strs = ['eat','tea','tan','ate','nat','bat']",
                "expectedOutput": "[['bat'],['nat','tan'],['ate','eat','tea']]",
                "explanation": "Grouped anagrams together."
            },
            {
                "id": 2,
                "input": "strs = ['']",
                "expectedOutput": "[['']]",
                "explanation": "Single empty string."
            }
        ],
        "hints": [
            "Two strings are anagrams if and only if their sorted versions are identical, or their character frequency counts are identical.",
            "Use a HashMap<String, List<String>> where the key is the sorted character array (or frequency tuple).",
            "For each string, sort its chars to produce the key: char[] ca = s.toCharArray(); Arrays.sort(ca); String key = new String(ca); map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);"
        ],
        "starterCode": "class Solution {\n    public java.util.List<java.util.List<String>> groupAnagrams(String[] strs) {\n        // Write your solution below\n\n        return new java.util.ArrayList<>();\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "67.1%",
            "submissionsCount": 19800,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "string-to-integer-atoi",
        "title": "String to Integer (atoi)",
        "slug": "string-to-integer-atoi",
        "difficulty": "Medium",
        "topic": "Strings",
        "pattern": "String Manipulation",
        "snippet": "Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer.",
        "description": "<p>Implement the <code>myAtoi(string s)</code> function, which converts a string to a 32-bit signed integer. Read in and ignore any leading whitespace. Check if the next character is '-' or '+'. Read in next characters until the next non-digit character or end of input. Clamp to [-2^31, 2^31 - 1] if overflow occurs.</p>",
        "inputFormat": "A string <code>s</code>.",
        "outputFormat": "Parsed 32-bit signed integer.",
        "constraints": [
            "0 <= s.length <= 200",
            "s consists of English letters, digits, ' ', '+', '-', and '.'."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "s = '42'",
                "expectedOutput": "42",
                "explanation": "Leading digits form 42."
            },
            {
                "id": 2,
                "input": "s = '   -042'",
                "expectedOutput": "-42",
                "explanation": "Leading whitespace ignored, '-' read, produces -42."
            }
        ],
        "hints": [
            "Break the problem down into sequential steps: whitespace, sign, digits, overflow check.",
            "Use an int pointer i. Advance past spaces. Record sign if '+' or '-'.",
            "While s.charAt(i) is a digit, check for integer overflow before multiplying: if (res > Integer.MAX_VALUE / 10 || (res == Integer.MAX_VALUE / 10 && digit > 7)) return sign == 1 ? Integer.MAX_VALUE : Integer.MIN_VALUE."
        ],
        "starterCode": "class Solution {\n    public int myAtoi(String s) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "16.8%",
            "submissionsCount": 14200,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "longest-common-prefix",
        "title": "Longest Common Prefix",
        "slug": "longest-common-prefix",
        "difficulty": "Easy",
        "topic": "Strings",
        "pattern": "String Manipulation",
        "snippet": "Find the longest common prefix string amongst an array of strings.",
        "description": "<p>Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string <code>''</code>.</p>",
        "inputFormat": "An array of strings <code>strs</code>.",
        "outputFormat": "Longest common prefix string.",
        "constraints": [
            "1 <= strs.length <= 200",
            "0 <= strs[i].length <= 200",
            "strs[i] consists of only lowercase English letters."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "strs = ['flower','flow','flight']",
                "expectedOutput": "'fl'",
                "explanation": "'fl' is the common prefix of all three words."
            },
            {
                "id": 2,
                "input": "strs = ['dog','racecar','car']",
                "expectedOutput": "''",
                "explanation": "There is no common prefix among the input strings."
            }
        ],
        "hints": [
            "Take the first string as the initial prefix.",
            "Iterate through the remaining strings. While strs[i].indexOf(prefix) != 0, shorten prefix by removing its last character.",
            "If prefix becomes empty, return '' immediately. After checking all strings, return the remaining prefix."
        ],
        "starterCode": "class Solution {\n    public String longestCommonPrefix(String[] strs) {\n        // Write your solution below\n\n        return '';\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "41.8%",
            "submissionsCount": 27200,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "ransom-note",
        "title": "Ransom Note",
        "slug": "ransom-note",
        "difficulty": "Easy",
        "topic": "Hashing",
        "pattern": "HashMap",
        "snippet": "Check if ransomNote can be constructed by using the letters from magazine.",
        "description": "<p>Given two strings <code>ransomNote</code> and <code>magazine</code>, return <code>true</code> if <code>ransomNote</code> can be constructed by using the letters from <code>magazine</code> and <code>false</code> otherwise. Each letter in <code>magazine</code> can only be used once in <code>ransomNote</code>.</p>",
        "inputFormat": "Two strings <code>ransomNote</code> and <code>magazine</code>.",
        "outputFormat": "Boolean <code>true</code> if constructible.",
        "constraints": [
            "1 <= ransomNote.length, magazine.length <= 10^5",
            "ransomNote and magazine consist of lowercase English letters."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "ransomNote = 'a', magazine = 'b'",
                "expectedOutput": "false",
                "explanation": "'b' does not contain 'a'."
            },
            {
                "id": 2,
                "input": "ransomNote = 'aa', magazine = 'aab'",
                "expectedOutput": "true",
                "explanation": "'aab' contains two 'a's."
            }
        ],
        "hints": [
            "Count the available character counts in magazine.",
            "An int[26] array or HashMap can track available character counts.",
            "Iterate through ransomNote. For each character, decrement its count. If the count drops below 0, return false."
        ],
        "starterCode": "class Solution {\n    public boolean canConstruct(String ransomNote, String magazine) {\n        // Write your solution below\n\n        return false;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "59.3%",
            "submissionsCount": 21200,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "isomorphic-strings",
        "title": "Isomorphic Strings",
        "slug": "isomorphic-strings",
        "difficulty": "Easy",
        "topic": "Hashing",
        "pattern": "HashMap",
        "snippet": "Determine if two strings are isomorphic (characters in s can be replaced to get t).",
        "description": "<p>Given two strings <code>s</code> and <code>t</code>, determine if they are isomorphic. Two strings <code>s</code> and <code>t</code> are isomorphic if the characters in <code>s</code> can be replaced to get <code>t</code>. All occurrences of a character must be replaced with another character while preserving the order of characters. No two characters may map to the same character, but a character may map to itself.</p>",
        "inputFormat": "Two strings <code>s</code> and <code>t</code>.",
        "outputFormat": "Boolean <code>true</code> if isomorphic.",
        "constraints": [
            "1 <= s.length <= 5 * 10^4",
            "t.length == s.length",
            "s and t consist of any valid ASCII character."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "s = 'egg', t = 'add'",
                "expectedOutput": "true",
                "explanation": "'e' maps to 'a' and 'g' maps to 'd'."
            },
            {
                "id": 2,
                "input": "s = 'foo', t = 'bar'",
                "expectedOutput": "false",
                "explanation": "'o' cannot map to both 'a' and 'r'."
            }
        ],
        "hints": [
            "You need a bijection: each character in s maps uniquely to one in t, and vice versa.",
            "Use two maps (or two int[256] arrays) to record last-seen positions or bidirectional mappings.",
            "For each index i, if mapS[s.charAt(i)] != mapT[t.charAt(i)], return false. Then update both to i + 1."
        ],
        "starterCode": "class Solution {\n    public boolean isIsomorphic(String s, String t) {\n        // Write your solution below\n\n        return false;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "44.6%",
            "submissionsCount": 18300,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "word-pattern",
        "title": "Word Pattern",
        "slug": "word-pattern",
        "difficulty": "Easy",
        "topic": "Hashing",
        "pattern": "HashMap",
        "snippet": "Determine if a string s follows the pattern defined by characters.",
        "description": "<p>Given a <code>pattern</code> and a string <code>s</code>, find if <code>s</code> follows the same pattern. Here follow means a full match, such that there is a bijection between a letter in <code>pattern</code> and a non-empty word in <code>s</code>.</p>",
        "inputFormat": "A string <code>pattern</code> and a string <code>s</code>.",
        "outputFormat": "Boolean <code>true</code> if s follows pattern.",
        "constraints": [
            "1 <= pattern.length <= 300",
            "1 <= s.length <= 3000",
            "pattern contains only lowercase letters, s contains lowercase letters and spaces."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "pattern = 'abba', s = 'dog cat cat dog'",
                "expectedOutput": "true",
                "explanation": "'a' -> 'dog', 'b' -> 'cat'."
            },
            {
                "id": 2,
                "input": "pattern = 'abba', s = 'dog cat cat fish'",
                "expectedOutput": "false",
                "explanation": "'a' cannot map to both 'dog' and 'fish'."
            }
        ],
        "hints": [
            "Split s into an array of words using space as delimiter. If words.length != pattern.length(), return false.",
            "Use two HashMaps or a single map with unique values to check bijection between pattern character and word.",
            "Map char -> word and word -> char. If an existing mapping conflicts with the current pair, return false immediately."
        ],
        "starterCode": "class Solution {\n    public boolean wordPattern(String pattern, String s) {\n        // Write your solution below\n\n        return false;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "41.7%",
            "submissionsCount": 15100,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "contains-duplicate",
        "title": "Contains Duplicate",
        "slug": "contains-duplicate",
        "difficulty": "Easy",
        "topic": "Hashing",
        "pattern": "HashSet",
        "snippet": "Return true if any value appears at least twice in the array.",
        "description": "<p>Given an integer array <code>nums</code>, return <code>true</code> if any value appears at least twice in the array, and return <code>false</code> if every element is distinct.</p>",
        "inputFormat": "An integer array <code>nums</code>.",
        "outputFormat": "Boolean <code>true</code> if duplicate exists.",
        "constraints": [
            "1 <= nums.length <= 10^5",
            "-10^9 <= nums[i] <= 10^9"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [1,2,3,1]",
                "expectedOutput": "true",
                "explanation": "1 appears at index 0 and index 3."
            },
            {
                "id": 2,
                "input": "nums = [1,2,3,4]",
                "expectedOutput": "false",
                "explanation": "All elements are distinct."
            }
        ],
        "hints": [
            "A hash set stores unique elements and provides O(1) average lookup time.",
            "Iterate through nums. For each element, attempt to add it to a HashSet.",
            "If set.add(num) returns false, the element was already present\u2014return true! If loop finishes, return false."
        ],
        "starterCode": "class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        // Write your solution below\n\n        return false;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "61.5%",
            "submissionsCount": 32000,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "longest-consecutive-sequence",
        "title": "Longest Consecutive Sequence",
        "slug": "longest-consecutive-sequence",
        "difficulty": "Medium",
        "topic": "Hashing",
        "pattern": "HashSet",
        "snippet": "Find the length of the longest consecutive elements sequence in O(n) time.",
        "description": "<p>Given an unsorted array of integers <code>nums</code>, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in <code>O(n)</code> time.</p>",
        "inputFormat": "An integer array <code>nums</code>.",
        "outputFormat": "Length of the longest consecutive sequence.",
        "constraints": [
            "0 <= nums.length <= 10^5",
            "-10^9 <= nums[i] <= 10^9"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [100,4,200,1,3,2]",
                "expectedOutput": "4",
                "explanation": "The longest consecutive elements sequence is [1, 2, 3, 4]. Its length is 4."
            },
            {
                "id": 2,
                "input": "nums = [0,3,7,2,5,8,4,6,0,1]",
                "expectedOutput": "9",
                "explanation": "Sequence [0, 1, 2, 3, 4, 5, 6, 7, 8] has length 9."
            }
        ],
        "hints": [
            "Insert all numbers into a HashSet for O(1) lookup.",
            "A number x is the start of a sequence only if x - 1 is NOT in the set.",
            "For each num in the set, if !set.contains(num - 1), count how many consecutive numbers exist: num + 1, num + 2... Track max sequence length."
        ],
        "starterCode": "class Solution {\n    public int longestConsecutive(int[] nums) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "47.3%",
            "submissionsCount": 17600,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "top-k-frequent-elements",
        "title": "Top K Frequent Elements",
        "slug": "top-k-frequent-elements",
        "difficulty": "Medium",
        "topic": "Hashing",
        "pattern": "Frequency Maps",
        "snippet": "Return the k most frequent elements in an integer array.",
        "description": "<p>Given an integer array <code>nums</code> and an integer <code>k</code>, return the <code>k</code> most frequent elements. You may return the answer in any order.</p>",
        "inputFormat": "An integer array <code>nums</code> and integer <code>k</code>.",
        "outputFormat": "An array of the k most frequent integers.",
        "constraints": [
            "1 <= nums.length <= 10^5",
            "-10^4 <= nums[i] <= 10^4",
            "k is in the range [1, the number of unique elements in the array]."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [1,1,1,2,2,3], k = 2",
                "expectedOutput": "[1,2]",
                "explanation": "1 appears 3 times, 2 appears 2 times."
            },
            {
                "id": 2,
                "input": "nums = [1], k = 1",
                "expectedOutput": "[1]",
                "explanation": "Single element."
            }
        ],
        "hints": [
            "First, count frequencies of each element using a HashMap<Integer, Integer>.",
            "To achieve O(N) time without full sorting, use bucket sort where bucket[freq] holds all elements with that frequency.",
            "Iterate backwards from bucket[nums.length] down to 1, collecting elements until you have gathered k elements."
        ],
        "starterCode": "class Solution {\n    public int[] topKFrequent(int[] nums, int k) {\n        // Write your solution below\n\n        return new int[]{};\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "62.8%",
            "submissionsCount": 19100,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "sort-characters-by-frequency",
        "title": "Sort Characters By Frequency",
        "slug": "sort-characters-by-frequency",
        "difficulty": "Medium",
        "topic": "Hashing",
        "pattern": "Frequency Maps",
        "snippet": "Sort a string in decreasing order based on the frequency of the characters.",
        "description": "<p>Given a string <code>s</code>, sort it in decreasing order based on the frequency of the characters. The frequency of a character is the number of times it appears in the string. Return the sorted string. If there are multiple answers, return any of them.</p>",
        "inputFormat": "A string <code>s</code>.",
        "outputFormat": "String sorted by character frequencies.",
        "constraints": [
            "1 <= s.length <= 5 * 10^5",
            "s consists of uppercase and lowercase English letters and digits."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "s = 'tree'",
                "expectedOutput": "'eert'",
                "explanation": "'e' appears twice, 'r' and 't' appear once. 'eetr' is also valid."
            },
            {
                "id": 2,
                "input": "s = 'cccaaa'",
                "expectedOutput": "'aaaccc'",
                "explanation": "Both 'a' and 'c' appear 3 times. 'cccaaa' is also valid."
            }
        ],
        "hints": [
            "Count the frequency of every character using a frequency map.",
            "Create an array of buckets where index i holds characters that appear with frequency i.",
            "Iterate buckets from high frequency to low frequency, appending each character count times to a StringBuilder."
        ],
        "starterCode": "class Solution {\n    public String frequencySort(String s) {\n        // Write your solution below\n\n        return s;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "70.2%",
            "submissionsCount": 12400,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "find-duplicate-number",
        "title": "Find the Duplicate Number",
        "slug": "find-duplicate-number",
        "difficulty": "Medium",
        "topic": "Hashing",
        "pattern": "Duplicate Detection",
        "snippet": "Find the duplicate integer in an array containing n + 1 integers where each is between 1 and n.",
        "description": "<p>Given an array of integers <code>nums</code> containing <code>n + 1</code> integers where each integer is in the range <code>[1, n]</code> inclusive. There is only one repeated number in <code>nums</code>, return this repeated number. You must solve the problem without modifying the array <code>nums</code> and uses only constant extra space.</p>",
        "inputFormat": "An integer array <code>nums</code>.",
        "outputFormat": "The duplicate integer.",
        "constraints": [
            "1 <= n <= 10^5",
            "nums.length == n + 1",
            "1 <= nums[i] <= n",
            "All integers in nums appear only once except for precisely one integer which appears two or more times."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [1,3,4,2,2]",
                "expectedOutput": "2",
                "explanation": "2 is the repeated number."
            },
            {
                "id": 2,
                "input": "nums = [3,1,3,4,2]",
                "expectedOutput": "3",
                "explanation": "3 is the repeated number."
            }
        ],
        "hints": [
            "Think of the array as a linked list where nums[i] points to index nums[i].",
            "Because there is a duplicate number, multiple indices point to the same node, creating a cycle!",
            "Use Floyd's Tortoise and Hare algorithm. Move slow by 1 step (slow = nums[slow]) and fast by 2 steps (fast = nums[nums[fast]]). Once they meet, reset slow to 0 and move both by 1 step until they meet at the cycle entrance."
        ],
        "starterCode": "class Solution {\n    public int findDuplicate(int[] nums) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "59.1%",
            "submissionsCount": 18300,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "contains-duplicate-ii",
        "title": "Contains Duplicate II",
        "slug": "contains-duplicate-ii",
        "difficulty": "Easy",
        "topic": "Hashing",
        "pattern": "Duplicate Detection",
        "snippet": "Check if two duplicate values exist within index distance k.",
        "description": "<p>Given an integer array <code>nums</code> and an integer <code>k</code>, return <code>true</code> if there are two distinct indices <code>i</code> and <code>j</code> in the array such that <code>nums[i] == nums[j]</code> and <code>abs(i - j) <= k</code>.</p>",
        "inputFormat": "An integer array <code>nums</code> and integer <code>k</code>.",
        "outputFormat": "Boolean <code>true</code> if duplicate within distance k.",
        "constraints": [
            "1 <= nums.length <= 10^5",
            "-10^9 <= nums[i] <= 10^9",
            "0 <= k <= 10^5"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [1,2,3,1], k = 3",
                "expectedOutput": "true",
                "explanation": "nums[0] == nums[3] and abs(0 - 3) = 3 <= 3."
            },
            {
                "id": 2,
                "input": "nums = [1,2,3,1,2,3], k = 2",
                "expectedOutput": "false",
                "explanation": "Duplicate indices differ by 3 > 2."
            }
        ],
        "hints": [
            "You only need to track the elements within a sliding window of size k.",
            "Maintain a HashSet of size at most k.",
            "For each i, if set.contains(nums[i]), return true. Add nums[i]. If set.size() > k, remove nums[i - k]."
        ],
        "starterCode": "class Solution {\n    public boolean containsNearbyDuplicate(int[] nums, int k) {\n        // Write your solution below\n\n        return false;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "44.1%",
            "submissionsCount": 16200,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "two-sum-ii-input-array-is-sorted",
        "title": "Two Sum II - Input Array Is Sorted",
        "slug": "two-sum-ii-input-array-is-sorted",
        "difficulty": "Medium",
        "topic": "Hashing",
        "pattern": "Pair and Complement Lookup",
        "snippet": "Find two numbers in a 1-indexed sorted array that add up to target.",
        "description": "<p>Given a 1-indexed array of integers <code>numbers</code> that is already sorted in non-decreasing order, find two numbers such that they add up to a specific <code>target</code> number. Return the indices of the two numbers, <code>index1</code> and <code>index2</code>, added by one as an integer array <code>[index1, index2]</code> of length 2.</p>",
        "inputFormat": "A 1-indexed sorted array <code>numbers</code> and integer <code>target</code>.",
        "outputFormat": "Integer array [index1, index2] with 1-based indexing.",
        "constraints": [
            "2 <= numbers.length <= 3 * 10^4",
            "-1000 <= numbers[i] <= 1000",
            "numbers is sorted in non-decreasing order."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "numbers = [2,7,11,15], target = 9",
                "expectedOutput": "[1,2]",
                "explanation": "The sum of 2 and 7 is 9. Therefore, index1 = 1, index2 = 2. We return [1, 2]."
            },
            {
                "id": 2,
                "input": "numbers = [2,3,4], target = 6",
                "expectedOutput": "[1,3]",
                "explanation": "The sum of 2 and 4 is 6. Therefore index1 = 1, index2 = 3."
            }
        ],
        "hints": [
            "Because the array is already sorted, two pointers at the ends can converge in O(1) space.",
            "Let left = 0 and right = n - 1. Calculate sum = numbers[left] + numbers[right].",
            "If sum == target, return new int[]{left + 1, right + 1}. If sum < target, left++; if sum > target, right--."
        ],
        "starterCode": "class Solution {\n    public int[] twoSum(int[] numbers, int target) {\n        // Write your solution below\n\n        return new int[]{};\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "60.5%",
            "submissionsCount": 23400,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "four-sum",
        "title": "4Sum",
        "slug": "four-sum",
        "difficulty": "Medium",
        "topic": "Hashing",
        "pattern": "Pair and Complement Lookup",
        "snippet": "Find all unique quadruplets in the array which sum to target.",
        "description": "<p>Given an array <code>nums</code> of <code>n</code> integers, return an array of all the unique quadruplets <code>[nums[a], nums[b], nums[c], nums[d]]</code> such that <code>a, b, c, and d</code> are distinct and <code>nums[a] + nums[b] + nums[c] + nums[d] == target</code>. You may return the answer in any order.</p>",
        "inputFormat": "An integer array <code>nums</code> and integer <code>target</code>.",
        "outputFormat": "List of unique quadruplets.",
        "constraints": [
            "1 <= nums.length <= 200",
            "-10^9 <= nums[i] <= 10^9",
            "-10^9 <= target <= 10^9"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [1,0,-1,0,-2,2], target = 0",
                "expectedOutput": "[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]",
                "explanation": "Unique quadruplets that sum to 0."
            },
            {
                "id": 2,
                "input": "nums = [2,2,2,2,2], target = 8",
                "expectedOutput": "[[2,2,2,2]]",
                "explanation": "One unique quadruplet summing to 8."
            }
        ],
        "hints": [
            "Sort the array first to handle duplicate skipping easily.",
            "Use two nested loops for the first two elements (i and j), then use two pointers (left and right) for the remaining two elements.",
            "Watch out for 32-bit integer overflow when summing 4 numbers\u2014cast sum to long."
        ],
        "starterCode": "class Solution {\n    public java.util.List<java.util.List<Integer>> fourSum(int[] nums, int target) {\n        // Write your solution below\n\n        return new java.util.ArrayList<>();\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "35.8%",
            "submissionsCount": 11900,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "reverse-linked-list",
        "title": "Reverse Linked List",
        "slug": "reverse-linked-list",
        "difficulty": "Easy",
        "topic": "Linked Lists",
        "pattern": "Reversal",
        "snippet": "Reverse a singly linked list and return the reversed list.",
        "description": "<p>Given the <code>head</code> of a singly linked list, reverse the list, and return the reversed list.</p>",
        "inputFormat": "The head node of a singly linked list.",
        "outputFormat": "The head node of the reversed linked list.",
        "constraints": [
            "The number of nodes in the list is the range [0, 5000].",
            "-5000 <= Node.val <= 5000"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "head = [1,2,3,4,5]",
                "expectedOutput": "[5,4,3,2,1]",
                "explanation": "All node links are reversed."
            },
            {
                "id": 2,
                "input": "head = [1,2]",
                "expectedOutput": "[2,1]",
                "explanation": "Two nodes reversed."
            }
        ],
        "hints": [
            "Think about re-pointing each node's next pointer to its predecessor.",
            "Maintain three pointers: prev (initially null), curr (initially head), and nextTemp.",
            "Iterate while curr != null: save nextTemp = curr.next, set curr.next = prev, advance prev = curr, and curr = nextTemp. Return prev."
        ],
        "starterCode": "class Solution {\n    public ListNode reverseList(ListNode head) {\n        // Write your solution below\n\n        return null;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "74.1%",
            "submissionsCount": 31200,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "reverse-linked-list-ii",
        "title": "Reverse Linked List II",
        "slug": "reverse-linked-list-ii",
        "difficulty": "Medium",
        "topic": "Linked Lists",
        "pattern": "Reversal",
        "snippet": "Reverse the nodes of the list from position left to position right.",
        "description": "<p>Given the <code>head</code> of a singly linked list and two integers <code>left</code> and <code>right</code> where <code>left <= right</code>, reverse the nodes of the list from position <code>left</code> to position <code>right</code>, and return the reversed list.</p>",
        "inputFormat": "Head node of linked list and 1-based bounds <code>left, right</code>.",
        "outputFormat": "Head node of modified linked list.",
        "constraints": [
            "The number of nodes in the list is n.",
            "1 <= n <= 500",
            "-500 <= Node.val <= 500",
            "1 <= left <= right <= n"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "head = [1,2,3,4,5], left = 2, right = 4",
                "expectedOutput": "[1,4,3,2,5]",
                "explanation": "Nodes from position 2 to 4 are reversed."
            },
            {
                "id": 2,
                "input": "head = [5], left = 1, right = 1",
                "expectedOutput": "[5]",
                "explanation": "Single element reversed remains unchanged."
            }
        ],
        "hints": [
            "Use a dummy head node to simplify operations when left == 1.",
            "Advance a pointer prev to the node just before position left.",
            "Perform right - left in-place node shifts: curr = prev.next; move curr.next to the front of the reversed sublist."
        ],
        "starterCode": "class Solution {\n    public ListNode reverseBetween(ListNode head, int left, int right) {\n        // Write your solution below\n\n        return head;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "46.2%",
            "submissionsCount": 14200,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "reverse-nodes-in-k-group",
        "title": "Reverse Nodes in k-Group",
        "slug": "reverse-nodes-in-k-group",
        "difficulty": "Hard",
        "topic": "Linked Lists",
        "pattern": "Reversal",
        "snippet": "Reverse the nodes of a linked list k at a time and return its modified list.",
        "description": "<p>Given the <code>head</code> of a linked list, reverse the nodes of the list <code>k</code> at a time, and return the modified list. <code>k</code> is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a multiple of <code>k</code> then left-out nodes, in the end, should remain as it is.</p>",
        "inputFormat": "Head of list and integer <code>k</code>.",
        "outputFormat": "Modified linked list head.",
        "constraints": [
            "The number of nodes in the list is n.",
            "1 <= k <= n <= 5000",
            "0 <= Node.val <= 1000"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "head = [1,2,3,4,5], k = 2",
                "expectedOutput": "[2,1,4,3,5]",
                "explanation": "Nodes reversed in groups of 2."
            },
            {
                "id": 2,
                "input": "head = [1,2,3,4,5], k = 3",
                "expectedOutput": "[3,2,1,4,5]",
                "explanation": "First 3 nodes reversed, last 2 remain intact."
            }
        ],
        "hints": [
            "First check if there are at least k nodes remaining in the current group before reversing.",
            "If k nodes exist, reverse the group using standard iterative reversal.",
            "Connect the previous group's tail to the newly reversed group's head, and recursively or iteratively process subsequent groups."
        ],
        "starterCode": "class Solution {\n    public ListNode reverseKGroup(ListNode head, int k) {\n        // Write your solution below\n\n        return head;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "56.4%",
            "submissionsCount": 9800,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "linked-list-cycle",
        "title": "Linked List Cycle",
        "slug": "linked-list-cycle",
        "difficulty": "Easy",
        "topic": "Linked Lists",
        "pattern": "Fast and Slow Pointers",
        "snippet": "Determine if the linked list has a cycle in it.",
        "description": "<p>Given <code>head</code>, the head of a linked list, determine if the linked list has a cycle in it. There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the <code>next</code> pointer. Return <code>true</code> if there is a cycle in the linked list. Otherwise, return <code>false</code>.</p>",
        "inputFormat": "The head of a singly linked list.",
        "outputFormat": "Boolean <code>true</code> if a cycle exists, <code>false</code> otherwise.",
        "constraints": [
            "The number of the nodes in the list is in the range [0, 10^4].",
            "-10^5 <= Node.val <= 10^5"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "head = [3,2,0,-4], pos = 1",
                "expectedOutput": "true",
                "explanation": "There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed)."
            },
            {
                "id": 2,
                "input": "head = [1,2], pos = 0",
                "expectedOutput": "true",
                "explanation": "There is a cycle in the linked list, where the tail connects to the 0th node."
            }
        ],
        "hints": [
            "Think about two runners on a circular track running at different speeds.",
            "Initialize slow = head and fast = head. Advance slow by 1 step (slow = slow.next) and fast by 2 steps (fast = fast.next.next).",
            "If there is a cycle, fast will eventually catch up to slow (slow == fast). If fast reaches null, there is no cycle."
        ],
        "starterCode": "class Solution {\n    public boolean hasCycle(ListNode head) {\n        // Write your solution below\n\n        return false;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "48.7%",
            "submissionsCount": 24300,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "middle-of-the-linked-list",
        "title": "Middle of the Linked List",
        "slug": "middle-of-the-linked-list",
        "difficulty": "Easy",
        "topic": "Linked Lists",
        "pattern": "Fast and Slow Pointers",
        "snippet": "Return the middle node of the linked list. If two middle nodes, return the second.",
        "description": "<p>Given the <code>head</code> of a singly linked list, return the middle node of the linked list. If there are two middle nodes, return the second middle node.</p>",
        "inputFormat": "Head of a linked list.",
        "outputFormat": "The middle ListNode.",
        "constraints": [
            "The number of nodes in the list is in the range [1, 100].",
            "1 <= Node.val <= 100"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "head = [1,2,3,4,5]",
                "expectedOutput": "[3,4,5]",
                "explanation": "The middle node of the list is node 3."
            },
            {
                "id": 2,
                "input": "head = [1,2,3,4,5,6]",
                "expectedOutput": "[4,5,6]",
                "explanation": "Since the list has two middle nodes with values 3 and 4, we return the second one."
            }
        ],
        "hints": [
            "Use two pointers moving at different speeds.",
            "Advance slow by 1 step and fast by 2 steps in each iteration.",
            "When fast reaches the end (fast == null or fast.next == null), slow will be exactly at the middle node."
        ],
        "starterCode": "class Solution {\n    public ListNode middleNode(ListNode head) {\n        // Write your solution below\n\n        return null;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "77.2%",
            "submissionsCount": 27100,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "find-middle-node",
        "title": "Palindrome Linked List",
        "slug": "find-middle-node",
        "difficulty": "Easy",
        "topic": "Linked Lists",
        "pattern": "Fast and Slow Pointers",
        "snippet": "Check if a singly linked list is a palindrome in O(n) time and O(1) space.",
        "description": "<p>Given the <code>head</code> of a singly linked list, return <code>true</code> if it is a palindrome or <code>false</code> otherwise.</p>",
        "inputFormat": "Head of a linked list.",
        "outputFormat": "Boolean <code>true</code> if palindrome.",
        "constraints": [
            "The number of nodes in the list is in the range [1, 10^5].",
            "0 <= Node.val <= 9"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "head = [1,2,2,1]",
                "expectedOutput": "true",
                "explanation": "The list reads the same forward and backward."
            },
            {
                "id": 2,
                "input": "head = [1,2]",
                "expectedOutput": "false",
                "explanation": "Not a palindrome."
            }
        ],
        "hints": [
            "Combine fast/slow pointers to find the middle, then reverse the second half of the list.",
            "Use slow and fast to reach middle. Reverse list starting from slow.next.",
            "Compare values node-by-node from the front (head) and reversed half. If all match, it is a palindrome."
        ],
        "starterCode": "class Solution {\n    public boolean isPalindrome(ListNode head) {\n        // Write your solution below\n\n        return false;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "50.9%",
            "submissionsCount": 21400,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "linked-list-cycle-ii",
        "title": "Linked List Cycle II",
        "slug": "linked-list-cycle-ii",
        "difficulty": "Medium",
        "topic": "Linked Lists",
        "pattern": "Cycle Detection",
        "snippet": "Return the node where the cycle begins in a linked list, or null if no cycle.",
        "description": "<p>Given the <code>head</code> of a linked list, return the node where the cycle begins. If there is no cycle, return <code>null</code>. Do not modify the linked list.</p>",
        "inputFormat": "Head of a linked list.",
        "outputFormat": "ListNode at the start of cycle or null.",
        "constraints": [
            "The number of the nodes in the list is in the range [0, 10^4].",
            "-10^5 <= Node.val <= 10^5"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "head = [3,2,0,-4], pos = 1",
                "expectedOutput": "tail connects to node index 1",
                "explanation": "There is a cycle in the linked list, where tail connects to the second node."
            },
            {
                "id": 2,
                "input": "head = [1], pos = -1",
                "expectedOutput": "no cycle",
                "explanation": "There is no cycle in the linked list."
            }
        ],
        "hints": [
            "Use Floyd's cycle detection algorithm to find the meeting point first.",
            "Mathematical property: distance from head to cycle entrance equals distance from meeting point to cycle entrance.",
            "Once slow and fast meet, reset slow to head. Advance both slow and fast by 1 step at a time. The node where they meet is the cycle start!"
        ],
        "starterCode": "class Solution {\n    public ListNode detectCycle(ListNode head) {\n        // Write your solution below\n\n        return null;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "49.5%",
            "submissionsCount": 17200,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "happy-number",
        "title": "Happy Number",
        "slug": "happy-number",
        "difficulty": "Easy",
        "topic": "Linked Lists",
        "pattern": "Cycle Detection",
        "snippet": "Determine if a number n is happy (sum of squares of digits reaches 1 without cycling).",
        "description": "<p>Write an algorithm to determine if a number <code>n</code> is happy. A happy number is a number defined by the following process: Starting with any positive integer, replace the number by the sum of the squares of its digits. Repeat the process until the number equals 1, or it loops endlessly in a cycle which does not include 1.</p>",
        "inputFormat": "A positive integer <code>n</code>.",
        "outputFormat": "Boolean <code>true</code> if happy, <code>false</code> otherwise.",
        "constraints": [
            "1 <= n <= 2^31 - 1"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "n = 19",
                "expectedOutput": "true",
                "explanation": "1^2 + 9^2 = 82 -> 8^2 + 2^2 = 68 -> 6^2 + 8^2 = 100 -> 1^2 + 0^2 + 0^2 = 1."
            },
            {
                "id": 2,
                "input": "n = 2",
                "expectedOutput": "false",
                "explanation": "Enters an infinite cycle that does not include 1."
            }
        ],
        "hints": [
            "The transitions between numbers form an implicit linked list.",
            "If a number loops, fast and slow pointers (or a HashSet) can detect the cycle.",
            "Let slow = n, fast = getNext(n). While fast != 1 and slow != fast: slow = getNext(slow), fast = getNext(getNext(fast)). Return fast == 1."
        ],
        "starterCode": "class Solution {\n    public boolean isHappy(int n) {\n        // Write your solution below\n\n        return false;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "55.8%",
            "submissionsCount": 20100,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "merge-two-sorted-lists",
        "title": "Merge Two Sorted Lists",
        "slug": "merge-two-sorted-lists",
        "difficulty": "Easy",
        "topic": "Linked Lists",
        "pattern": "Merging Lists",
        "snippet": "Merge two sorted linked lists and return it as a sorted list.",
        "description": "<p>You are given the heads of two sorted linked lists <code>list1</code> and <code>list2</code>. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.</p>",
        "inputFormat": "Heads of two sorted linked lists <code>list1</code> and <code>list2</code>.",
        "outputFormat": "Head of the merged sorted linked list.",
        "constraints": [
            "The number of nodes in both lists is in the range [0, 50].",
            "-100 <= Node.val <= 100",
            "Both list1 and list2 are sorted in non-decreasing order."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "list1 = [1,2,4], list2 = [1,3,4]",
                "expectedOutput": "[1,1,2,3,4,4]",
                "explanation": "Merged list in sorted order."
            },
            {
                "id": 2,
                "input": "list1 = [], list2 = []",
                "expectedOutput": "[]",
                "explanation": "Both empty lists."
            }
        ],
        "hints": [
            "A dummy head node simplifies boundary cases when attaching the first node.",
            "Maintain a pointer curr starting at dummy. Compare list1.val and list2.val.",
            "Attach the smaller node to curr.next and advance that list's pointer and curr. When one list is exhausted, attach the remainder of the other list."
        ],
        "starterCode": "class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        // Write your solution below\n\n        return null;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "63.2%",
            "submissionsCount": 33400,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "merge-in-between-linked-lists",
        "title": "Merge In Between Linked Lists",
        "slug": "merge-in-between-linked-lists",
        "difficulty": "Medium",
        "topic": "Linked Lists",
        "pattern": "Merging Lists",
        "snippet": "Remove nodes from index a to b in list1, and put list2 in their place.",
        "description": "<p>You are given two linked lists: <code>list1</code> and <code>list2</code> of sizes <code>n</code> and <code>m</code> respectively. Remove <code>list1</code>'s nodes from the <code>a</code>-th node to the <code>b</code>-th node, and put <code>list2</code> in their place.</p>",
        "inputFormat": "Two linked lists <code>list1, list2</code> and integers <code>a, b</code>.",
        "outputFormat": "Head of modified list1.",
        "constraints": [
            "3 <= list1.length <= 10^4",
            "1 <= a <= b < list1.length - 1",
            "1 <= list2.length <= 10^4"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "list1 = [10,1,13,6,9,5], a = 3, b = 4, list2 = [1000000,1000001,1000002]",
                "expectedOutput": "[10,1,13,1000000,1000001,1000002,5]",
                "explanation": "Nodes 3 and 4 (values 6 and 9) replaced by list2."
            },
            {
                "id": 2,
                "input": "list1 = [0,1,2,3,4,5,6], a = 2, b = 5, list2 = [100,101]",
                "expectedOutput": "[0,1,100,101,6]",
                "explanation": "Sublist replaced."
            }
        ],
        "hints": [
            "Find the node at position a - 1 (before deletion) and position b + 1 (after deletion).",
            "Find the tail node of list2.",
            "Set nodeBeforeA.next = list2, and tailOfList2.next = nodeAfterB. Return list1."
        ],
        "starterCode": "class Solution {\n    public ListNode mergeInBetween(ListNode list1, int a, int b, ListNode list2) {\n        // Write your solution below\n\n        return list1;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "76.4%",
            "submissionsCount": 10800,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "remove-nth-node-from-end",
        "title": "Remove Nth Node From End of List",
        "slug": "remove-nth-node-from-end",
        "difficulty": "Medium",
        "topic": "Linked Lists",
        "pattern": "Node Manipulation",
        "snippet": "Remove the nth node from the end of the list and return its head.",
        "description": "<p>Given the <code>head</code> of a linked list, remove the <code>n</code>-th node from the end of the list and return its head.</p>",
        "inputFormat": "Head of linked list and integer <code>n</code>.",
        "outputFormat": "Head of modified list.",
        "constraints": [
            "The number of nodes in the list is sz.",
            "1 <= sz <= 30",
            "0 <= Node.val <= 100",
            "1 <= n <= sz"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "head = [1,2,3,4,5], n = 2",
                "expectedOutput": "[1,2,3,5]",
                "explanation": "4 is the 2nd node from the end and is removed."
            },
            {
                "id": 2,
                "input": "head = [1], n = 1",
                "expectedOutput": "[]",
                "explanation": "Removing only node returns empty list."
            }
        ],
        "hints": [
            "Use two pointers with a gap of n nodes between them.",
            "Attach a dummy head before head to handle removing the first node cleanly.",
            "Advance fast pointer by n + 1 steps. Then move both fast and slow together until fast is null. slow.next will be pointing to the target: set slow.next = slow.next.next."
        ],
        "starterCode": "class Solution {\n    public ListNode removeNthFromEnd(ListNode head, int n) {\n        // Write your solution below\n\n        return head;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "42.9%",
            "submissionsCount": 22100,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "reorder-list",
        "title": "Reorder List",
        "slug": "reorder-list",
        "difficulty": "Medium",
        "topic": "Linked Lists",
        "pattern": "Node Manipulation",
        "snippet": "Reorder the list to be L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2...",
        "description": "<p>You are given the head of a singly linked-list. The list can be represented as: <code>L0 -> L1 -> ... -> Ln-1 -> Ln</code>. Reorder the list to be: <code>L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ...</code>. You may not modify the values in the list's nodes. Only nodes themselves may be changed.</p>",
        "inputFormat": "Head of a linked list.",
        "outputFormat": "None (modify list in-place).",
        "constraints": [
            "The number of nodes in the list is in the range [1, 5 * 10^4].",
            "1 <= Node.val <= 1000"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "head = [1,2,3,4]",
                "expectedOutput": "[1,4,2,3]",
                "explanation": "Nodes reordered from outer ends inward."
            },
            {
                "id": 2,
                "input": "head = [1,2,3,4,5]",
                "expectedOutput": "[1,5,2,4,3]",
                "explanation": "Nodes reordered from outer ends inward."
            }
        ],
        "hints": [
            "This problem combines three fundamental linked list operations: middle finding, reversal, and merging.",
            "1. Find middle of list using fast/slow pointers. 2. Reverse the second half of the list.",
            "3. Interleave/merge the first half and the reversed second half node-by-node."
        ],
        "starterCode": "class Solution {\n    public void reorderList(ListNode head) {\n        // Write your solution below\n\n        return ;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "54.7%",
            "submissionsCount": 15900,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "daily-temperatures",
        "title": "Daily Temperatures",
        "slug": "daily-temperatures",
        "difficulty": "Medium",
        "topic": "Stacks and Queues",
        "pattern": "Monotonic Stack",
        "snippet": "Return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.",
        "description": "<p>Given an array of integers <code>temperatures</code> represents the daily temperatures, return an array <code>answer</code> such that <code>answer[i]</code> is the number of days you have to wait after the <code>i</code>-th day to get a warmer temperature. If there is no future day for which this is possible, keep <code>answer[i] == 0</code> instead.</p>",
        "inputFormat": "An integer array <code>temperatures</code>.",
        "outputFormat": "An integer array of wait days.",
        "constraints": [
            "1 <= temperatures.length <= 10^5",
            "30 <= temperatures[i] <= 100"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "temperatures = [73,74,75,71,69,72,76,73]",
                "expectedOutput": "[1,1,4,2,1,1,0,0]",
                "explanation": "Days until a warmer temperature occurs."
            },
            {
                "id": 2,
                "input": "temperatures = [30,40,50,60]",
                "expectedOutput": "[1,1,1,0]",
                "explanation": "Each day is followed immediately by a warmer temperature except the last."
            }
        ],
        "hints": [
            "A monotonic decreasing stack keeps track of indices of temperatures that haven't found a warmer day yet.",
            "Store indices in a stack. When a temperature higher than stack.peek() arrives, you found the warmer day for the peeked index!",
            "Iterate i from 0 to n - 1. While !stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]: int prev = stack.pop(); ans[prev] = i - prev. Then stack.push(i)."
        ],
        "starterCode": "class Solution {\n    public int[] dailyTemperatures(int[] temperatures) {\n        // Write your solution below\n\n        return new int[]{};\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "66.3%",
            "submissionsCount": 20100,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "next-greater-element-i",
        "title": "Next Greater Element I",
        "slug": "next-greater-element-i",
        "difficulty": "Easy",
        "topic": "Stacks and Queues",
        "pattern": "Monotonic Stack",
        "snippet": "Find the next greater element for each value in nums1 within nums2.",
        "description": "<p>The next greater element of some element <code>x</code> in an array is the first greater element that is to the right of <code>x</code> in the same array. You are given two distinct 0-indexed integer arrays <code>nums1</code> and <code>nums2</code>, where <code>nums1</code> is a subset of <code>nums2</code>. For each <code>0 <= i < nums1.length</code>, find the index <code>j</code> such that <code>nums1[i] == nums2[j]</code> and determine the next greater element of <code>nums2[j]</code> in <code>nums2</code>.</p>",
        "inputFormat": "Two integer arrays <code>nums1</code> and <code>nums2</code>.",
        "outputFormat": "Integer array of next greater elements.",
        "constraints": [
            "1 <= nums1.length <= nums2.length <= 1000",
            "0 <= nums1[i], nums2[i] <= 10^4",
            "All integers in nums1 and nums2 are unique."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums1 = [4,1,2], nums2 = [1,3,4,2]",
                "expectedOutput": "[-1,3,-1]",
                "explanation": "For 4, no greater element (-1). For 1, next greater is 3. For 2, no greater (-1)."
            },
            {
                "id": 2,
                "input": "nums1 = [2,4], nums2 = [1,2,3,4]",
                "expectedOutput": "[3,-1]",
                "explanation": "Next greater for 2 is 3, for 4 is -1."
            }
        ],
        "hints": [
            "Precompute the next greater element for all elements in nums2 first.",
            "Use a monotonic stack and a HashMap<Integer, Integer> to map each element in nums2 to its next greater element.",
            "Traverse nums2. While !stack.isEmpty() && num > stack.peek(): map.put(stack.pop(), num). Then push num. For remaining elements in stack, map to -1. Finally lookup nums1 in map."
        ],
        "starterCode": "class Solution {\n    public int[] nextGreaterElement(int[] nums1, int[] nums2) {\n        // Write your solution below\n\n        return new int[]{};\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "71.4%",
            "submissionsCount": 17400,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "largest-rectangle-in-histogram",
        "title": "Largest Rectangle in Histogram",
        "slug": "largest-rectangle-in-histogram",
        "difficulty": "Hard",
        "topic": "Stacks and Queues",
        "pattern": "Monotonic Stack",
        "snippet": "Find the area of the largest rectangle in the histogram.",
        "description": "<p>Given an array of integers <code>heights</code> representing the histogram's bar height where the width of each bar is <code>1</code>, return the area of the largest rectangle in the histogram.</p>",
        "inputFormat": "An integer array <code>heights</code>.",
        "outputFormat": "The maximum rectangle area.",
        "constraints": [
            "1 <= heights.length <= 10^5",
            "0 <= heights[i] <= 10^4"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "heights = [2,1,5,6,2,3]",
                "expectedOutput": "10",
                "explanation": "The largest rectangle has height 5 and width 2 (bars at index 2 and 3), giving area 10."
            },
            {
                "id": 2,
                "input": "heights = [2,4]",
                "expectedOutput": "4",
                "explanation": "Largest rectangle has height 4 width 1 or height 2 width 2."
            }
        ],
        "hints": [
            "For each bar of height h, how far can it extend to the left and to the right before hitting a shorter bar?",
            "A monotonic increasing stack can find the left and right boundaries for every bar in O(N) total time.",
            "Maintain a stack of indices with increasing heights. When a shorter bar is encountered, pop from stack: popped height * (i - stack.peek() - 1) is the rectangle area."
        ],
        "starterCode": "class Solution {\n    public int largestRectangleArea(int[] heights) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "43.1%",
            "submissionsCount": 12500,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "valid-parentheses",
        "title": "Valid Parentheses",
        "slug": "valid-parentheses",
        "difficulty": "Easy",
        "topic": "Stacks and Queues",
        "pattern": "Balanced Parentheses",
        "snippet": "Determine if the input string containing brackets is valid.",
        "description": "<p>Given a string <code>s</code> containing just the characters <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>, determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets, and in the correct order, and every close bracket has a corresponding open bracket of the same type.</p>",
        "inputFormat": "A string <code>s</code> containing bracket characters.",
        "outputFormat": "Boolean <code>true</code> if valid, <code>false</code> otherwise.",
        "constraints": [
            "1 <= s.length <= 10^4",
            "s consists of parentheses only '()[]{}'."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "s = '()[]{}'",
                "expectedOutput": "true",
                "explanation": "All bracket pairs open and close correctly."
            },
            {
                "id": 2,
                "input": "s = '(]'",
                "expectedOutput": "false",
                "explanation": "Mismatched bracket types."
            }
        ],
        "hints": [
            "A stack (LIFO) is the ideal data structure because the most recently opened bracket must be the first one closed.",
            "When encountering an opening bracket, push its expected closing bracket onto the stack.",
            "When encountering a closing bracket, check if stack is empty or if stack.pop() doesn't match the current character. At the end, stack must be empty."
        ],
        "starterCode": "class Solution {\n    public boolean isValid(String s) {\n        // Write your solution below\n\n        return false;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "40.3%",
            "submissionsCount": 35400,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "generate-parentheses",
        "title": "Generate Parentheses",
        "slug": "generate-parentheses",
        "difficulty": "Medium",
        "topic": "Stacks and Queues",
        "pattern": "Balanced Parentheses",
        "snippet": "Generate all combinations of well-formed parentheses for n pairs.",
        "description": "<p>Given <code>n</code> pairs of parentheses, write a function to generate all combinations of well-formed parentheses.</p>",
        "inputFormat": "An integer <code>n</code>.",
        "outputFormat": "A list of valid parentheses combinations.",
        "constraints": [
            "1 <= n <= 8"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "n = 3",
                "expectedOutput": "['((()))','(()())','(())()','()(())','()()()']",
                "explanation": "All 5 well-formed combinations of 3 pairs."
            },
            {
                "id": 2,
                "input": "n = 1",
                "expectedOutput": "['()']",
                "explanation": "Only one valid pair."
            }
        ],
        "hints": [
            "Think recursively: at each step, you can either add '(' or ')'.",
            "You can add '(' as long as count(open) < n. You can add ')' only if count(close) < count(open).",
            "Use backtracking with a StringBuilder. Base case: when string length == 2 * n, add to results. Backtrack after each recursive call."
        ],
        "starterCode": "class Solution {\n    public java.util.List<String> generateParenthesis(int n) {\n        // Write your solution below\n\n        return new java.util.ArrayList<>();\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "73.2%",
            "submissionsCount": 22800,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "minimum-remove-to-make-valid-parentheses",
        "title": "Minimum Remove to Make Valid Parentheses",
        "slug": "minimum-remove-to-make-valid-parentheses",
        "difficulty": "Medium",
        "topic": "Stacks and Queues",
        "pattern": "Balanced Parentheses",
        "snippet": "Remove the minimum number of parentheses to make string valid.",
        "description": "<p>Given a string <code>s</code> of <code>'('</code> , <code>')'</code> and lowercase English characters. Your task is to remove the minimum number of parentheses (<code>'('</code> or <code>')'</code>, in any positions) so that the resulting parentheses string is valid and return any valid string.</p>",
        "inputFormat": "A string <code>s</code>.",
        "outputFormat": "A valid parentheses string.",
        "constraints": [
            "1 <= s.length <= 10^5",
            "s[i] is either '(', ')', or lowercase English letter."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "s = 'lee(t(c)o)de)'",
                "expectedOutput": "'lee(t(c)o)de'",
                "explanation": "The last ')' is removed."
            },
            {
                "id": 2,
                "input": "s = 'a)b(c)d'",
                "expectedOutput": "'ab(c)d'",
                "explanation": "First ')' removed."
            }
        ],
        "hints": [
            "Keep track of the indices of invalid parentheses.",
            "Use a stack to record indices of unmatched '(' brackets. If a ')' has no matching '(' on the stack, mark its index for deletion.",
            "At the end of traversal, any '(' indices remaining in the stack must also be removed. Build the final string excluding marked indices."
        ],
        "starterCode": "class Solution {\n    public String minRemoveToMakeValid(String s) {\n        // Write your solution below\n\n        return s;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "66.5%",
            "submissionsCount": 13900,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "next-greater-element-ii",
        "title": "Next Greater Element II",
        "slug": "next-greater-element-ii",
        "difficulty": "Medium",
        "topic": "Stacks and Queues",
        "pattern": "Next Greater Element",
        "snippet": "Find the next greater element for each element in a circular array.",
        "description": "<p>Given a circular integer array <code>nums</code> (i.e., the next element of <code>nums[nums.length - 1]</code> is <code>nums[0]</code>), return the next greater number for every element in <code>nums</code>. The next greater number of a number <code>x</code> is the first greater number to its traversing-order next in the array, which means you could search circularly to find its next greater number.</p>",
        "inputFormat": "An integer array <code>nums</code>.",
        "outputFormat": "Integer array of next greater elements in circular order.",
        "constraints": [
            "1 <= nums.length <= 10^4",
            "-10^9 <= nums[i] <= 10^9"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [1,2,1]",
                "expectedOutput": "[2,-1,2]",
                "explanation": "For 1, next is 2. For 2, no greater (-1). For circular 1, next is 2."
            },
            {
                "id": 2,
                "input": "nums = [1,2,3,4,3]",
                "expectedOutput": "[2,3,4,-1,4]",
                "explanation": "Circular search resolves remaining elements."
            }
        ],
        "hints": [
            "To simulate a circular array without actual concatenation, loop up to 2 * n - 1 and access elements using i % n.",
            "Maintain a monotonic decreasing stack of indices.",
            "Loop i from 0 to 2 * n - 1. While !stack.isEmpty() && nums[i % n] > nums[stack.peek()]: res[stack.pop()] = nums[i % n]. If i < n, push i to stack."
        ],
        "starterCode": "class Solution {\n    public int[] nextGreaterElements(int[] nums) {\n        // Write your solution below\n\n        return new int[]{};\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "63.4%",
            "submissionsCount": 15100,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "online-stock-span",
        "title": "Online Stock Span",
        "slug": "online-stock-span",
        "difficulty": "Medium",
        "topic": "Stacks and Queues",
        "pattern": "Next Greater Element",
        "snippet": "Calculate the span of stock prices for consecutive days less than or equal to today.",
        "description": "<p>Design an algorithm that collects daily price quotes for some stock and returns the span of that stock's price for the current day. The span of the stock's price in one day is the maximum number of consecutive days (starting from today and going backward) for which the stock price was less than or equal to the price of that day.</p>",
        "inputFormat": "Method calls to <code>next(int price)</code>.",
        "outputFormat": "Span integer for today's price.",
        "constraints": [
            "1 <= price <= 10^5",
            "At most 10^4 calls will be made to next."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "prices = [100, 80, 60, 70, 60, 75, 85]",
                "expectedOutput": "[1, 1, 1, 2, 1, 4, 6]",
                "explanation": "Spans computed per day."
            },
            {
                "id": 2,
                "input": "prices = [31, 41, 48, 59, 79]",
                "expectedOutput": "[1, 2, 3, 4, 5]",
                "explanation": "Each strictly increasing day accumulates previous spans."
            }
        ],
        "hints": [
            "Instead of storing raw prices and scanning back, can you store price and accumulated span together?",
            "Use a monotonic decreasing stack where each entry is an [price, span] pair.",
            "When next(price) is called, initialize span = 1. While !stack.isEmpty() && stack.peek()[0] <= price: span += stack.pop()[1]. Push [price, span] and return span."
        ],
        "starterCode": "class Solution {\n    public int next(int price) {\n        // Write your solution below\n\n        return 1;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "65.1%",
            "submissionsCount": 11200,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "implement-queue-using-stacks",
        "title": "Implement Queue using Stacks",
        "slug": "implement-queue-using-stacks",
        "difficulty": "Easy",
        "topic": "Stacks and Queues",
        "pattern": "Queue Simulation",
        "snippet": "Implement a first in first out (FIFO) queue using only two stacks.",
        "description": "<p>Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (<code>push</code>, <code>peek</code>, <code>pop</code>, and <code>empty</code>).</p>",
        "inputFormat": "Operations on MyQueue.",
        "outputFormat": "Results of peek, pop, empty.",
        "constraints": [
            "1 <= x <= 9",
            "At most 100 calls will be made to push, pop, peek, and empty."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "operations = ['push 1', 'push 2', 'peek', 'pop', 'empty']",
                "expectedOutput": "[null, null, 1, 1, false]",
                "explanation": "FIFO behavior demonstrated."
            },
            {
                "id": 2,
                "input": "operations = ['push 5', 'empty']",
                "expectedOutput": "[null, false]",
                "explanation": "Queue not empty after push."
            }
        ],
        "hints": [
            "One stack is used for incoming pushes, and the second stack is used for outgoing pops.",
            "Keep pushStack for incoming elements and popStack for outgoing elements.",
            "In pop/peek: if popStack is empty, transfer all elements from pushStack to popStack (reversing their order to FIFO!). Then pop/peek from popStack."
        ],
        "starterCode": "class Solution {\n    public int pop() {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "64.1%",
            "submissionsCount": 23800,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "number-of-recent-calls",
        "title": "Number of Recent Calls",
        "slug": "number-of-recent-calls",
        "difficulty": "Easy",
        "topic": "Stacks and Queues",
        "pattern": "Queue Simulation",
        "snippet": "Count the number of recent requests within a 3000 milliseconds time frame.",
        "description": "<p>You have a <code>RecentCounter</code> class which counts the number of recent requests within a certain time frame. Implement the <code>RecentCounter</code> class: <code>int ping(int t)</code> adds a new request at time <code>t</code>, where <code>t</code> represents some time in milliseconds, and returns the number of requests that have happened in the past <code>3000</code> milliseconds (including the new request). Specifically, return the number of requests that have happened in the inclusive range <code>[t - 3000, t]</code>.</p>",
        "inputFormat": "Calls to <code>ping(int t)</code>.",
        "outputFormat": "Number of pings in [t - 3000, t].",
        "constraints": [
            "1 <= t <= 10^9",
            "Each test case will call ping with strictly increasing values of t."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "inputs = [1, 100, 3001, 3002]",
                "expectedOutput": "[1, 2, 3, 3]",
                "explanation": "At t=3002, t=1 is older than 3002 - 3000 = 2, so it is evicted, leaving 3 pings."
            },
            {
                "id": 2,
                "input": "inputs = [1, 2, 3]",
                "expectedOutput": "[1, 2, 3]",
                "explanation": "All pings within 3000ms window."
            }
        ],
        "hints": [
            "Because timestamps t are strictly increasing, a Queue (FIFO) is the natural fit.",
            "Add incoming timestamp t to the end of a Queue<Integer>.",
            "While queue.peek() < t - 3000, pop/poll elements from the front of the queue. Return queue.size()."
        ],
        "starterCode": "class Solution {\n    public int ping(int t) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "73.9%",
            "submissionsCount": 18700,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "sliding-window-maximum",
        "title": "Sliding Window Maximum",
        "slug": "sliding-window-maximum",
        "difficulty": "Hard",
        "topic": "Stacks and Queues",
        "pattern": "Deque Applications",
        "snippet": "Return the max sliding window of size k moving from very left to very right.",
        "description": "<p>You are given an array of integers <code>nums</code>, there is a sliding window of size <code>k</code> which is moving from the very left of the array to the very right. You can only see the <code>k</code> numbers in the window. Each time the sliding window moves right by one position. Return the max sliding window.</p>",
        "inputFormat": "An integer array <code>nums</code> and window size <code>k</code>.",
        "outputFormat": "An array of the maximum value in each window.",
        "constraints": [
            "1 <= nums.length <= 10^5",
            "-10^4 <= nums[i] <= 10^4",
            "1 <= k <= nums.length"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [1,3,-1,-3,5,3,6,7], k = 3",
                "expectedOutput": "[3,3,5,5,6,7]",
                "explanation": "Max values observed per window of size 3."
            },
            {
                "id": 2,
                "input": "nums = [1], k = 1",
                "expectedOutput": "[1]",
                "explanation": "Single element window."
            }
        ],
        "hints": [
            "We need an O(1) way to find the maximum in the window while elements are added and removed.",
            "A monotonic decreasing Deque storing indices can maintain the maximum element at deque.peekFirst().",
            "For each i: remove indices out of window (deque.peekFirst() <= i - k). Pop from back while nums[deque.peekLast()] <= nums[i]. Push i to back. If i >= k - 1, record nums[deque.peekFirst()]."
        ],
        "starterCode": "class Solution {\n    public int[] maxSlidingWindow(int[] nums, int k) {\n        // Write your solution below\n\n        return new int[]{};\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "46.5%",
            "submissionsCount": 14900,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "design-circular-deque",
        "title": "Design Circular Deque",
        "slug": "design-circular-deque",
        "difficulty": "Medium",
        "topic": "Stacks and Queues",
        "pattern": "Deque Applications",
        "snippet": "Design your implementation of the circular double-ended queue (deque).",
        "description": "<p>Design your implementation of the circular double-ended queue (deque). Implement the <code>MyCircularDeque</code> class with <code>insertFront</code>, <code>insertLast</code>, <code>deleteFront</code>, <code>deleteLast</code>, <code>getFront</code>, <code>getRear</code>, <code>isEmpty</code>, and <code>isFull</code>.</p>",
        "inputFormat": "Operations on MyCircularDeque of size k.",
        "outputFormat": "Return values per operation.",
        "constraints": [
            "1 <= k <= 1000",
            "0 <= value <= 1000",
            "At most 2000 calls will be made."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "ops = ['insertLast 1', 'insertLast 2', 'insertFront 3', 'getRear']",
                "expectedOutput": "[true, true, true, 2]",
                "explanation": "Double ended queue operations."
            },
            {
                "id": 2,
                "input": "ops = ['isEmpty', 'isFull']",
                "expectedOutput": "[true, false]",
                "explanation": "Initial empty state."
            }
        ],
        "hints": [
            "Use a fixed-size array of size k and maintain front and rear pointers.",
            "To handle circular wrapping, update indices using modulo arithmetic: (front - 1 + k) % k for front insertion and (rear + 1) % k for rear insertion.",
            "Track current size to differentiate between completely empty and completely full states."
        ],
        "starterCode": "class Solution {\n    public boolean insertFront(int value) {\n        // Write your solution below\n\n        return false;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "56.8%",
            "submissionsCount": 8700,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "binary-search",
        "title": "Binary Search",
        "slug": "binary-search",
        "difficulty": "Easy",
        "topic": "Binary Search",
        "pattern": "Basic Binary Search",
        "snippet": "Search a target in a sorted ascending integer array in O(log n) time.",
        "description": "<p>Given an array of integers <code>nums</code> which is sorted in ascending order, and an integer <code>target</code>, write a function to search <code>target</code> in <code>nums</code>. If <code>target</code> exists, then return its index. Otherwise, return <code>-1</code>. You must write an algorithm with <code>O(log n)</code> runtime complexity.</p>",
        "inputFormat": "A sorted integer array <code>nums</code> and an integer <code>target</code>.",
        "outputFormat": "The 0-based index of target, or <code>-1</code> if not found.",
        "constraints": [
            "1 <= nums.length <= 10^4",
            "-10^4 < nums[i], target < 10^4",
            "All the integers in nums are unique.",
            "nums is sorted in ascending order."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [-1,0,3,5,9,12], target = 9",
                "expectedOutput": "4",
                "explanation": "9 exists in nums and its index is 4."
            },
            {
                "id": 2,
                "input": "nums = [-1,0,3,5,9,12], target = 2",
                "expectedOutput": "-1",
                "explanation": "2 does not exist in nums so return -1."
            }
        ],
        "hints": [
            "Because the array is sorted, comparing the target against the middle element lets you eliminate half the search space.",
            "Calculate mid using left + (right - left) / 2 to prevent 32-bit integer overflow.",
            "If nums[mid] == target, return mid. If nums[mid] < target, search right half (left = mid + 1). If nums[mid] > target, search left half (right = mid - 1)."
        ],
        "starterCode": "class Solution {\n    public int search(int[] nums, int target) {\n        // Write your solution below\n\n        return -1;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "56.4%",
            "submissionsCount": 26400,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "guess-number-higher-or-lower",
        "title": "Guess Number Higher or Lower",
        "slug": "guess-number-higher-or-lower",
        "difficulty": "Easy",
        "topic": "Binary Search",
        "pattern": "Basic Binary Search",
        "snippet": "Guess the picked number between 1 and n using the pre-defined guess API.",
        "description": "<p>We are playing the Guess Game. The game will pick a number from <code>1</code> to <code>n</code>. You have to guess which number was picked. Every time you guess wrong, the API will tell you whether the number picked is higher or lower than your guess. Return the number that was picked.</p>",
        "inputFormat": "An integer <code>n</code>.",
        "outputFormat": "The picked number.",
        "constraints": [
            "1 <= n <= 2^31 - 1"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "n = 10, pick = 6",
                "expectedOutput": "6",
                "explanation": "Binary search finds 6 in log2(10) guesses."
            },
            {
                "id": 2,
                "input": "n = 1, pick = 1",
                "expectedOutput": "1",
                "explanation": "Single choice."
            }
        ],
        "hints": [
            "Binary search the range [1, n].",
            "Compute mid = left + (right - left) / 2.",
            "Call guess(mid). If guess returns 0, return mid. If -1, right = mid - 1. If 1, left = mid + 1."
        ],
        "starterCode": "class Solution {\n    public int guessNumber(int n) {\n        // Write your solution below\n\n        return 1;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "53.2%",
            "submissionsCount": 18700,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "search-insert-position",
        "title": "Search Insert Position",
        "slug": "search-insert-position",
        "difficulty": "Easy",
        "topic": "Binary Search",
        "pattern": "Lower and Upper Bound",
        "snippet": "Return the index if the target is found, or the index where it would be if inserted in order.",
        "description": "<p>Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order. You must write an algorithm with <code>O(log n)</code> runtime complexity.</p>",
        "inputFormat": "A sorted integer array <code>nums</code> and an integer <code>target</code>.",
        "outputFormat": "Index where target is found or should be inserted.",
        "constraints": [
            "1 <= nums.length <= 10^4",
            "-10^4 <= nums[i] <= 10^4",
            "nums contains distinct values sorted in ascending order."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [1,3,5,6], target = 5",
                "expectedOutput": "2",
                "explanation": "5 is found at index 2."
            },
            {
                "id": 2,
                "input": "nums = [1,3,5,6], target = 2",
                "expectedOutput": "1",
                "explanation": "2 should be inserted at index 1."
            }
        ],
        "hints": [
            "This is finding the lower bound (the first position where nums[i] >= target).",
            "Maintain left = 0 and right = nums.length - 1.",
            "If nums[mid] >= target, narrow right to mid - 1. Otherwise left = mid + 1. When loop terminates, left is the exact insertion index."
        ],
        "starterCode": "class Solution {\n    public int searchInsert(int[] nums, int target) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "45.8%",
            "submissionsCount": 28900,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "find-first-and-last-position",
        "title": "Find First and Last Position of Element in Sorted Array",
        "slug": "find-first-and-last-position",
        "difficulty": "Medium",
        "topic": "Binary Search",
        "pattern": "Lower and Upper Bound",
        "snippet": "Find the starting and ending position of a given target value in a sorted array.",
        "description": "<p>Given an array of integers <code>nums</code> sorted in non-decreasing order, find the starting and ending position of a given <code>target</code> value. If <code>target</code> is not found in the array, return <code>[-1, -1]</code>. You must write an algorithm with <code>O(log n)</code> runtime complexity.</p>",
        "inputFormat": "A sorted integer array <code>nums</code> and an integer <code>target</code>.",
        "outputFormat": "Integer array [firstIndex, lastIndex].",
        "constraints": [
            "0 <= nums.length <= 10^5",
            "-10^9 <= nums[i] <= 10^9",
            "nums is a non-decreasing array."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [5,7,7,8,8,10], target = 8",
                "expectedOutput": "[3,4]",
                "explanation": "8 first appears at index 3 and last at index 4."
            },
            {
                "id": 2,
                "input": "nums = [5,7,7,8,8,10], target = 6",
                "expectedOutput": "[-1,-1]",
                "explanation": "6 does not exist in nums."
            }
        ],
        "hints": [
            "Run binary search twice: once to find the leftmost (first) occurrence, and once to find the rightmost (last) occurrence.",
            "To find the leftmost index, when nums[mid] == target, continue searching left by setting right = mid - 1 while recording mid.",
            "To find the rightmost index, when nums[mid] == target, continue searching right by setting left = mid + 1 while recording mid."
        ],
        "starterCode": "class Solution {\n    public int[] searchRange(int[] nums, int target) {\n        // Write your solution below\n\n        return new int[]{-1, -1};\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "43.1%",
            "submissionsCount": 19400,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "search-in-rotated-sorted-array",
        "title": "Search in Rotated Sorted Array",
        "slug": "search-in-rotated-sorted-array",
        "difficulty": "Medium",
        "topic": "Binary Search",
        "pattern": "Search in Rotated Arrays",
        "snippet": "Search a target in a sorted array that was rotated at an unknown pivot in O(log n) time.",
        "description": "<p>There is an integer array <code>nums</code> sorted in ascending order (with distinct values). Prior to being passed to your function, <code>nums</code> is possibly rotated at an unknown pivot index <code>k</code>. Given the array <code>nums</code> after the possible rotation and an integer <code>target</code>, return the index of <code>target</code> if it is in <code>nums</code>, or <code>-1</code> if it is not in <code>nums</code>.</p>",
        "inputFormat": "A rotated sorted integer array <code>nums</code> and target integer.",
        "outputFormat": "Index of target or -1.",
        "constraints": [
            "1 <= nums.length <= 5000",
            "-10^4 <= nums[i] <= 10^4",
            "All values of nums are unique."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [4,5,6,7,0,1,2], target = 0",
                "expectedOutput": "4",
                "explanation": "0 is at index 4 in rotated array."
            },
            {
                "id": 2,
                "input": "nums = [4,5,6,7,0,1,2], target = 3",
                "expectedOutput": "-1",
                "explanation": "3 does not exist."
            }
        ],
        "hints": [
            "Notice that if you split a rotated sorted array in half, at least one of the two halves is always normally sorted!",
            "Check which half is sorted: if nums[left] <= nums[mid], the left half is sorted. Otherwise the right half is sorted.",
            "Check if target lies within the boundaries of the sorted half. If yes, search that half; otherwise search the other half."
        ],
        "starterCode": "class Solution {\n    public int search(int[] nums, int target) {\n        // Write your solution below\n\n        return -1;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "40.1%",
            "submissionsCount": 22800,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "find-minimum-in-rotated-sorted-array",
        "title": "Find Minimum in Rotated Sorted Array",
        "slug": "find-minimum-in-rotated-sorted-array",
        "difficulty": "Medium",
        "topic": "Binary Search",
        "pattern": "Search in Rotated Arrays",
        "snippet": "Find the minimum element in a sorted rotated array in O(log n) time.",
        "description": "<p>Suppose an array of length <code>n</code> sorted in ascending order is rotated between <code>1</code> and <code>n</code> times. Given the sorted rotated array <code>nums</code> of unique elements, return the minimum element of this array. You must write an algorithm that runs in <code>O(log n)</code> time.</p>",
        "inputFormat": "A rotated sorted array <code>nums</code>.",
        "outputFormat": "The minimum integer in the array.",
        "constraints": [
            "n == nums.length",
            "1 <= n <= 5000",
            "-5000 <= nums[i] <= 5000",
            "All the integers of nums are unique."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [3,4,5,1,2]",
                "expectedOutput": "1",
                "explanation": "The original array was [1,2,3,4,5] rotated 3 times."
            },
            {
                "id": 2,
                "input": "nums = [4,5,6,7,0,1,2]",
                "expectedOutput": "0",
                "explanation": "0 is the minimum element."
            }
        ],
        "hints": [
            "Compare nums[mid] with the last element nums[right].",
            "If nums[mid] > nums[right], the minimum must be in the right half (left = mid + 1).",
            "If nums[mid] <= nums[right], mid could be the minimum, so set right = mid. When left == right, nums[left] is the minimum."
        ],
        "starterCode": "class Solution {\n    public int findMin(int[] nums) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "49.8%",
            "submissionsCount": 18300,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "koko-eating-bananas",
        "title": "Koko Eating Bananas",
        "slug": "koko-eating-bananas",
        "difficulty": "Medium",
        "topic": "Binary Search",
        "pattern": "Binary Search on Answer",
        "snippet": "Find the minimum integer eating speed k such that Koko can eat all bananas within h hours.",
        "description": "<p>Koko loves to eat bananas. There are <code>n</code> piles of bananas, the <code>i</code>-th pile has <code>piles[i]</code> bananas. The guards have gone and will come back in <code>h</code> hours. Koko can decide her bananas-per-hour eating speed of <code>k</code>. Each hour, she chooses some pile of bananas and eats <code>k</code> bananas from that pile. If the pile has less than <code>k</code> bananas, she eats all of them instead and will not eat any more bananas during this hour. Return the minimum integer <code>k</code> such that she can eat all the bananas within <code>h</code> hours.</p>",
        "inputFormat": "An integer array <code>piles</code> and integer <code>h</code>.",
        "outputFormat": "Minimum integer eating speed k.",
        "constraints": [
            "1 <= piles.length <= 10^4",
            "piles.length <= h <= 10^9",
            "1 <= piles[i] <= 10^9"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "piles = [3,6,7,11], h = 8",
                "expectedOutput": "4",
                "explanation": "At speed 4, hours required is ceil(3/4)+ceil(6/4)+ceil(7/4)+ceil(11/4) = 1+2+2+3 = 8."
            },
            {
                "id": 2,
                "input": "piles = [30,11,23,4,20], h = 5",
                "expectedOutput": "30",
                "explanation": "Speed must equal max pile to finish in 5 hours."
            }
        ],
        "hints": [
            "The eating speed k ranges from 1 to max(piles). Notice that the hours required is monotonically decreasing with speed k.",
            "Binary search the speed k in the range [1, max(piles)].",
            "For a candidate speed mid, compute total hours = sum(ceil(pile / (double)mid)). If total <= h, try smaller speed (right = mid); otherwise left = mid + 1."
        ],
        "starterCode": "class Solution {\n    public int minEatingSpeed(int[] piles, int h) {\n        // Write your solution below\n\n        return 1;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "51.8%",
            "submissionsCount": 16400,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "capacity-to-ship-packages",
        "title": "Capacity To Ship Packages Within D Days",
        "slug": "capacity-to-ship-packages",
        "difficulty": "Medium",
        "topic": "Binary Search",
        "pattern": "Binary Search on Answer",
        "snippet": "Find the least weight capacity of the boat to ship all packages within days.",
        "description": "<p>A conveyor belt has packages that must be shipped from one port to another within <code>days</code> days. The <code>i</code>-th package on the conveyor belt has a weight of <code>weights[i]</code>. Each day, we load the ship with packages on the conveyor belt (in the order given by <code>weights</code>). We may not load more weight than the maximum weight capacity of the ship. Return the least weight capacity of the ship that will result in all the packages on the conveyor belt being shipped within <code>days</code> days.</p>",
        "inputFormat": "An integer array <code>weights</code> and integer <code>days</code>.",
        "outputFormat": "Minimum weight capacity.",
        "constraints": [
            "1 <= days <= weights.length <= 5 * 10^4",
            "1 <= weights[i] <= 500"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "weights = [1,2,3,4,5,6,7,8,9,10], days = 5",
                "expectedOutput": "15",
                "explanation": "A ship capacity of 15 allows shipping within 5 days."
            },
            {
                "id": 2,
                "input": "weights = [3,2,2,4,1,4], days = 3",
                "expectedOutput": "6",
                "explanation": "Capacity of 6 ships in 3 days."
            }
        ],
        "hints": [
            "The minimum possible capacity is max(weights) (can ship the heaviest item). The maximum is sum(weights) (ships everything in 1 day).",
            "Binary search the capacity in [max(weights), sum(weights)].",
            "Test if a capacity mid can ship within days: greedily accumulate weights until exceeding mid, then increment days. Adjust left/right accordingly."
        ],
        "starterCode": "class Solution {\n    public int shipWithinDays(int[] weights, int days) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "69.1%",
            "submissionsCount": 13200,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "split-array-largest-sum",
        "title": "Split Array Largest Sum",
        "slug": "split-array-largest-sum",
        "difficulty": "Hard",
        "topic": "Binary Search",
        "pattern": "Binary Search on Answer",
        "snippet": "Split nums into k non-empty subarrays to minimize the largest sum among these subarrays.",
        "description": "<p>Given an integer array <code>nums</code> and an integer <code>k</code>, split <code>nums</code> into <code>k</code> non-empty subarrays such that the largest sum of any subarray is minimized. Return the minimized largest sum of the split. A subarray is a contiguous part of the array.</p>",
        "inputFormat": "An integer array <code>nums</code> and integer <code>k</code>.",
        "outputFormat": "Minimized largest subarray sum.",
        "constraints": [
            "1 <= nums.length <= 1000",
            "0 <= nums[i] <= 10^6",
            "1 <= k <= min(50, nums.length)"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [7,2,5,10,8], k = 2",
                "expectedOutput": "18",
                "explanation": "Best split is [7,2,5] and [10,8], largest sum is 18."
            },
            {
                "id": 2,
                "input": "nums = [1,2,3,4,5], k = 2",
                "expectedOutput": "9",
                "explanation": "Best split is [1,2,3] and [4,5], max sum 9."
            }
        ],
        "hints": [
            "The answer must be between max(nums) and sum(nums). Can we binary search on the answer?",
            "If we guess that the maximum subarray sum is mid, we can count how many subarrays are required using a greedy pass.",
            "If count <= k, mid is achievable\u2014try smaller (right = mid). If count > k, mid is too small (left = mid + 1). Return left."
        ],
        "starterCode": "class Solution {\n    public int splitArray(int[] nums, int k) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "54.9%",
            "submissionsCount": 8900,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "fibonacci-number",
        "title": "Fibonacci Number",
        "slug": "fibonacci-number",
        "difficulty": "Easy",
        "topic": "Recursion and Backtracking",
        "pattern": "Basic Recursion",
        "snippet": "Calculate the nth Fibonacci number where F(n) = F(n-1) + F(n-2).",
        "description": "<p>The Fibonacci numbers, commonly denoted <code>F(n)</code> form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from <code>0</code> and <code>1</code>. That is, <code>F(0) = 0, F(1) = 1, F(n) = F(n - 1) + F(n - 2)</code> for <code>n > 1</code>. Given <code>n</code>, calculate <code>F(n)</code>.</p>",
        "inputFormat": "An integer <code>n</code>.",
        "outputFormat": "The nth Fibonacci number.",
        "constraints": [
            "0 <= n <= 30"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "n = 2",
                "expectedOutput": "1",
                "explanation": "F(2) = F(1) + F(0) = 1 + 0 = 1."
            },
            {
                "id": 2,
                "input": "n = 4",
                "expectedOutput": "3",
                "explanation": "F(4) = F(3) + F(2) = 2 + 1 = 3."
            }
        ],
        "hints": [
            "Identify base cases: if n <= 1, return n.",
            "Naive recursion recomputes states exponentially. Use memoization or two variables to compute iteratively in O(N) time.",
            "Maintain prev2 = 0, prev1 = 1. Loop from 2 to n: curr = prev1 + prev2, prev2 = prev1, prev1 = curr. Return prev1."
        ],
        "starterCode": "class Solution {\n    public int fib(int n) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "70.2%",
            "submissionsCount": 27800,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "power-of-three",
        "title": "Power of Three",
        "slug": "power-of-three",
        "difficulty": "Easy",
        "topic": "Recursion and Backtracking",
        "pattern": "Basic Recursion",
        "snippet": "Determine if an integer is a power of three using recursion.",
        "description": "<p>Given an integer <code>n</code>, return <code>true</code> if it is a power of three. Otherwise, return <code>false</code>. An integer <code>n</code> is a power of three, if there exists an integer <code>x</code> such that <code>n == 3^x</code>.</p>",
        "inputFormat": "An integer <code>n</code>.",
        "outputFormat": "Boolean <code>true</code> if power of three.",
        "constraints": [
            "-2^31 <= n <= 2^31 - 1"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "n = 27",
                "expectedOutput": "true",
                "explanation": "27 = 3^3."
            },
            {
                "id": 2,
                "input": "n = 0",
                "expectedOutput": "false",
                "explanation": "0 is not a power of three."
            }
        ],
        "hints": [
            "Any positive power of three must be strictly greater than 0.",
            "If n <= 0, return false. If n == 1, return true (3^0 = 1).",
            "If n % 3 == 0, recursively check isPowerOfThree(n / 3). Otherwise return false."
        ],
        "starterCode": "class Solution {\n    public boolean isPowerOfThree(int n) {\n        // Write your solution below\n\n        return false;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "45.9%",
            "submissionsCount": 19100,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "subsets",
        "title": "Subsets",
        "slug": "subsets",
        "difficulty": "Medium",
        "topic": "Recursion and Backtracking",
        "pattern": "Subsets",
        "snippet": "Return all possible subsets (the power set) of unique elements.",
        "description": "<p>Given an integer array <code>nums</code> of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.</p>",
        "inputFormat": "An integer array <code>nums</code>.",
        "outputFormat": "List of all subsets (list of lists).",
        "constraints": [
            "1 <= nums.length <= 10",
            "-10 <= nums[i] <= 10",
            "All the numbers of nums are unique."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [1,2,3]",
                "expectedOutput": "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]",
                "explanation": "All 2^3 = 8 subsets."
            },
            {
                "id": 2,
                "input": "nums = [0]",
                "expectedOutput": "[[],[0]]",
                "explanation": "Two subsets for single element."
            }
        ],
        "hints": [
            "For each element, you have two choices: include it in the current subset, or exclude it.",
            "Use a recursive helper backtrack(start, currentSubset, result).",
            "At each recursive call, add a copy of currentSubset to result. Then loop i from start to nums.length - 1: add nums[i], recurse with i + 1, and remove last element (backtrack)."
        ],
        "starterCode": "class Solution {\n    public java.util.List<java.util.List<Integer>> subsets(int[] nums) {\n        // Write your solution below\n\n        return new java.util.ArrayList<>();\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "76.4%",
            "submissionsCount": 24500,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "subsets-ii",
        "title": "Subsets II",
        "slug": "subsets-ii",
        "difficulty": "Medium",
        "topic": "Recursion and Backtracking",
        "pattern": "Subsets",
        "snippet": "Return all possible subsets of an array that may contain duplicates.",
        "description": "<p>Given an integer array <code>nums</code> that may contain duplicates, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.</p>",
        "inputFormat": "An integer array <code>nums</code>.",
        "outputFormat": "List of all unique subsets.",
        "constraints": [
            "1 <= nums.length <= 10",
            "-10 <= nums[i] <= 10"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [1,2,2]",
                "expectedOutput": "[[],[1],[1,2],[1,2,2],[2],[2,2]]",
                "explanation": "Unique subsets avoiding duplicates."
            },
            {
                "id": 2,
                "input": "nums = [0]",
                "expectedOutput": "[[],[0]]",
                "explanation": "Power set of [0]."
            }
        ],
        "hints": [
            "Sort nums first so that duplicate numbers are adjacent.",
            "In the backtrack loop over index i from start to nums.length - 1: skip duplicates if i > start && nums[i] == nums[i - 1].",
            "This ensures a duplicate element is only chosen once at the current decision level."
        ],
        "starterCode": "class Solution {\n    public java.util.List<java.util.List<Integer>> subsetsWithDup(int[] nums) {\n        // Write your solution below\n\n        return new java.util.ArrayList<>();\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "57.1%",
            "submissionsCount": 15600,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "permutations",
        "title": "Permutations",
        "slug": "permutations",
        "difficulty": "Medium",
        "topic": "Recursion and Backtracking",
        "pattern": "Permutations",
        "snippet": "Return all possible permutations of an array of distinct integers.",
        "description": "<p>Given an array <code>nums</code> of distinct integers, return all the possible permutations. You can return the answer in any order.</p>",
        "inputFormat": "An integer array <code>nums</code>.",
        "outputFormat": "List of all permutations.",
        "constraints": [
            "1 <= nums.length <= 6",
            "-10 <= nums[i] <= 10",
            "All the integers of nums are unique."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [1,2,3]",
                "expectedOutput": "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]",
                "explanation": "All 3! = 6 permutations."
            },
            {
                "id": 2,
                "input": "nums = [0,1]",
                "expectedOutput": "[[0,1],[1,0]]",
                "explanation": "2 permutations."
            }
        ],
        "hints": [
            "Every permutation must contain all n elements in some order.",
            "Maintain a boolean[] used array (or swap in-place) to track elements already included in the current branch.",
            "When currentList.size() == nums.length, add a copy to results. In loop i from 0 to n - 1: if (!used[i]) { used[i] = true; list.add(nums[i]); recurse; list.removeLast(); used[i] = false; }"
        ],
        "starterCode": "class Solution {\n    public java.util.List<java.util.List<Integer>> permute(int[] nums) {\n        // Write your solution below\n\n        return new java.util.ArrayList<>();\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "77.5%",
            "submissionsCount": 25100,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "permutations-ii",
        "title": "Permutations II",
        "slug": "permutations-ii",
        "difficulty": "Medium",
        "topic": "Recursion and Backtracking",
        "pattern": "Permutations",
        "snippet": "Return all unique permutations of a collection of numbers that might contain duplicates.",
        "description": "<p>Given a collection of numbers, <code>nums</code>, that might contain duplicates, return all possible unique permutations in any order.</p>",
        "inputFormat": "An integer array <code>nums</code>.",
        "outputFormat": "List of unique permutations.",
        "constraints": [
            "1 <= nums.length <= 8",
            "-10 <= nums[i] <= 10"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [1,1,2]",
                "expectedOutput": "[[1,1,2],[1,2,1],[2,1,1]]",
                "explanation": "3 unique permutations."
            },
            {
                "id": 2,
                "input": "nums = [1,2,3]",
                "expectedOutput": "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]",
                "explanation": "6 unique permutations."
            }
        ],
        "hints": [
            "Sort the array first so identical numbers are grouped together.",
            "Use a boolean[] used array to track which elements are active in current path.",
            "Skip duplicates when i > 0 && nums[i] == nums[i - 1] && !used[i - 1]. The !used[i-1] check enforces consistent order among duplicates."
        ],
        "starterCode": "class Solution {\n    public java.util.List<java.util.List<Integer>> permuteUnique(int[] nums) {\n        // Write your solution below\n\n        return new java.util.ArrayList<>();\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "58.2%",
            "submissionsCount": 13400,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "combination-sum",
        "title": "Combination Sum",
        "slug": "combination-sum",
        "difficulty": "Medium",
        "topic": "Recursion and Backtracking",
        "pattern": "Combination Generation",
        "snippet": "Find all unique combinations of candidates where the numbers sum to target.",
        "description": "<p>Given an array of distinct integers <code>candidates</code> and a target integer <code>target</code>, return a list of all unique combinations of <code>candidates</code> where the chosen numbers sum to <code>target</code>. You may return the combinations in any order. The same number may be chosen from <code>candidates</code> an unlimited number of times.</p>",
        "inputFormat": "An integer array <code>candidates</code> and integer <code>target</code>.",
        "outputFormat": "List of candidate combinations summing to target.",
        "constraints": [
            "1 <= candidates.length <= 30",
            "2 <= candidates[i] <= 40",
            "All elements of candidates are distinct.",
            "1 <= target <= 40"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "candidates = [2,3,6,7], target = 7",
                "expectedOutput": "[[2,2,3],[7]]",
                "explanation": "2 + 2 + 3 = 7 and 7 = 7."
            },
            {
                "id": 2,
                "input": "candidates = [2,3,5], target = 8",
                "expectedOutput": "[[2,2,2,2],[2,3,3],[3,5]]",
                "explanation": "Three unique combinations."
            }
        ],
        "hints": [
            "Sort candidates to enable early pruning when candidate > remaining target.",
            "Because an element can be reused, the recursive call keeps the same start index i instead of advancing to i + 1.",
            "Base cases: if remain == 0, add copy of current list to result. If remain < 0, return. Loop i from start to length: add, recurse with (i, remain - candidates[i]), backtrack."
        ],
        "starterCode": "class Solution {\n    public java.util.List<java.util.List<Integer>> combinationSum(int[] candidates, int target) {\n        // Write your solution below\n\n        return new java.util.ArrayList<>();\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "70.1%",
            "submissionsCount": 21200,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "letter-combinations-of-phone-number",
        "title": "Letter Combinations of a Phone Number",
        "slug": "letter-combinations-of-phone-number",
        "difficulty": "Medium",
        "topic": "Recursion and Backtracking",
        "pattern": "Combination Generation",
        "snippet": "Return all possible letter combinations that the number could represent on a phone dial pad.",
        "description": "<p>Given a string containing digits from <code>2-9</code> inclusive, return all possible letter combinations that the number could represent. Return the answer in any order. A mapping of digits to letters (just like on the telephone buttons) is given: 2->abc, 3->def, 4->ghi, 5->jkl, 6->mno, 7->pqrs, 8->tuv, 9->wxyz.</p>",
        "inputFormat": "A string of digits <code>digits</code>.",
        "outputFormat": "List of letter combinations.",
        "constraints": [
            "0 <= digits.length <= 4",
            "digits[i] is a digit in the range ['2', '9']."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "digits = '23'",
                "expectedOutput": "['ad','ae','af','bd','be','bf','cd','ce','cf']",
                "explanation": "All combinations from mapping '2' and '3'."
            },
            {
                "id": 2,
                "input": "digits = ''",
                "expectedOutput": "[]",
                "explanation": "Empty digits produces empty list."
            }
        ],
        "hints": [
            "Create an array mapping digit character to its corresponding letters: String[] map = {'', '', 'abc', 'def', ...}.",
            "If digits is empty, return an empty list immediately.",
            "Backtrack: at index idx, loop through each character mapped to digits.charAt(idx), append to path, recurse with idx + 1, and delete last char."
        ],
        "starterCode": "class Solution {\n    public java.util.List<String> letterCombinations(String digits) {\n        // Write your solution below\n\n        return new java.util.ArrayList<>();\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "59.4%",
            "submissionsCount": 22400,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "n-queens",
        "title": "N-Queens",
        "slug": "n-queens",
        "difficulty": "Hard",
        "topic": "Recursion and Backtracking",
        "pattern": "Constraint-Based Backtracking",
        "snippet": "Place n queens on an n x n chessboard such that no two queens attack each other.",
        "description": "<p>The n-queens puzzle is the problem of placing <code>n</code> queens on an <code>n x n</code> chessboard such that no two queens attack each other. Given an integer <code>n</code>, return all distinct solutions to the n-queens puzzle. You may return the answer in any order.</p>",
        "inputFormat": "An integer <code>n</code>.",
        "outputFormat": "List of board configurations where 'Q' is a queen and '.' is empty.",
        "constraints": [
            "1 <= n <= 9"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "n = 4",
                "expectedOutput": "['.Q..','...Q','Q...','..Q.'],['..Q.','Q...','...Q','.Q..']",
                "explanation": "Two distinct 4-queens board configurations."
            },
            {
                "id": 2,
                "input": "n = 1",
                "expectedOutput": "[['Q']]",
                "explanation": "Single queen."
            }
        ],
        "hints": [
            "Queens attack along columns, rows, and diagonals. Place one queen per row.",
            "Use three boolean sets/arrays to check conflicts in O(1): cols[c], diag1[r + c], diag2[r - c + n].",
            "Backtrack row by row from 0 to n - 1. For each col c, if safe, place queen, update tracking arrays, recurse to row + 1, then backtrack."
        ],
        "starterCode": "class Solution {\n    public java.util.List<java.util.List<String>> solveNQueens(int n) {\n        // Write your solution below\n\n        return new java.util.ArrayList<>();\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "66.5%",
            "submissionsCount": 10800,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "word-search",
        "title": "Word Search",
        "slug": "word-search",
        "difficulty": "Medium",
        "topic": "Recursion and Backtracking",
        "pattern": "Constraint-Based Backtracking",
        "snippet": "Find if the word exists in the 2D grid of characters.",
        "description": "<p>Given an <code>m x n</code> grid of characters <code>board</code> and a string <code>word</code>, return <code>true</code> if <code>word</code> exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.</p>",
        "inputFormat": "A 2D char array <code>board</code> and string <code>word</code>.",
        "outputFormat": "Boolean <code>true</code> if word found.",
        "constraints": [
            "m == board.length",
            "n = board[i].length",
            "1 <= m, n <= 6",
            "1 <= word.length <= 15"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word = 'ABCCED'",
                "expectedOutput": "true",
                "explanation": "The word 'ABCCED' exists following adjacent cells."
            },
            {
                "id": 2,
                "input": "board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word = 'ABCB'",
                "expectedOutput": "false",
                "explanation": "Cannot reuse cell 'B'."
            }
        ],
        "hints": [
            "Scan every cell (r, c) as a potential starting letter word.charAt(0).",
            "From (r, c), explore 4 neighbors (up, down, left, right) with DFS backtracking.",
            "Temporarily mark board[r][c] = '#' to prevent reuse in current path. Recurse for word.charAt(idx + 1). Restore character when backtracking."
        ],
        "starterCode": "class Solution {\n    public boolean exist(char[][] board, String word) {\n        // Write your solution below\n\n        return false;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "41.2%",
            "submissionsCount": 18700,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "sudoku-solver",
        "title": "Sudoku Solver",
        "slug": "sudoku-solver",
        "difficulty": "Hard",
        "topic": "Recursion and Backtracking",
        "pattern": "Constraint-Based Backtracking",
        "snippet": "Solve a Sudoku puzzle by filling the empty cells.",
        "description": "<p>Write a program to solve a Sudoku puzzle by filling the empty cells. A sudoku solution must satisfy all of the following rules: Each of the digits 1-9 must occur exactly once in each row, each column, and each of the 9 3x3 sub-boxes of the grid. The '.' character indicates empty cells.</p>",
        "inputFormat": "A 9x9 char array <code>board</code>.",
        "outputFormat": "None (modify <code>board</code> in-place).",
        "constraints": [
            "board.length == 9",
            "board[i].length == 9",
            "board[i][j] is a digit '1'-'9' or '.'."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "board = [['5','3','.','.','7','.','.','.','.'],['6','.','.','1','9','5','.','.','.'],...]",
                "expectedOutput": "solved board",
                "explanation": "All rows, columns, and 3x3 boxes filled validly."
            },
            {
                "id": 2,
                "input": "board = [['8','.','.','.','.','.','.','.','.'],...]",
                "expectedOutput": "solved board",
                "explanation": "Puzzle completed."
            }
        ],
        "hints": [
            "Find the first empty cell '.' on the board.",
            "Try placing digits '1' through '9'. Check if the placement is valid with respects to its row, column, and 3x3 subgrid.",
            "If valid, place digit and recursively call solve(). If solve() returns true, puzzle is solved! Otherwise reset cell to '.' and try next digit."
        ],
        "starterCode": "class Solution {\n    public void solveSudoku(char[][] board) {\n        // Write your solution below\n\n        return ;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "60.4%",
            "submissionsCount": 9200,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "invert-binary-tree",
        "title": "Invert Binary Tree",
        "slug": "invert-binary-tree",
        "difficulty": "Easy",
        "topic": "Trees",
        "pattern": "Tree Traversals",
        "snippet": "Invert a binary tree by swapping left and right subtrees recursively.",
        "description": "<p>Given the <code>root</code> of a binary tree, invert the tree, and return its root. Inverting a tree means swapping every left child with its right child.</p>",
        "inputFormat": "The root TreeNode of a binary tree.",
        "outputFormat": "The root TreeNode of the inverted binary tree.",
        "constraints": [
            "The number of nodes in the tree is in the range [0, 100].",
            "-100 <= Node.val <= 100"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "root = [4,2,7,1,3,6,9]",
                "expectedOutput": "[4,7,2,9,6,3,1]",
                "explanation": "Left and right subtrees are inverted at every node level."
            },
            {
                "id": 2,
                "input": "root = [2,1,3]",
                "expectedOutput": "[2,3,1]",
                "explanation": "Subtrees swapped."
            }
        ],
        "hints": [
            "Inversion requires swapping the left and right child of every node.",
            "This can be done with a postorder or preorder traversal.",
            "Base case: if root == null, return null. Swap root.left and root.right. Then recursively call invertTree on both children. Return root."
        ],
        "starterCode": "class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        // Write your solution below\n\n        return null;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "76.4%",
            "submissionsCount": 28100,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "binary-tree-inorder-traversal",
        "title": "Binary Tree Inorder Traversal",
        "slug": "binary-tree-inorder-traversal",
        "difficulty": "Easy",
        "topic": "Trees",
        "pattern": "Tree Traversals",
        "snippet": "Return the inorder traversal of its nodes' values.",
        "description": "<p>Given the <code>root</code> of a binary tree, return the inorder traversal of its nodes' values (Left -> Root -> Right).</p>",
        "inputFormat": "The root TreeNode of a binary tree.",
        "outputFormat": "A list of integers in inorder sequence.",
        "constraints": [
            "The number of nodes in the tree is in the range [0, 100].",
            "-100 <= Node.val <= 100"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "root = [1,null,2,3]",
                "expectedOutput": "[1,3,2]",
                "explanation": "Inorder visits left, then current, then right."
            },
            {
                "id": 2,
                "input": "root = []",
                "expectedOutput": "[]",
                "explanation": "Empty tree."
            }
        ],
        "hints": [
            "Inorder traversal visits nodes in the order: Left Subtree -> Current Node -> Right Subtree.",
            "Recursion is straightforward: traverse(node.left), list.add(node.val), traverse(node.right).",
            "Iterative solution uses an explicit Stack: push all left children to stack until null, pop, record value, and move to right child."
        ],
        "starterCode": "class Solution {\n    public java.util.List<Integer> inorderTraversal(TreeNode root) {\n        // Write your solution below\n\n        return new java.util.ArrayList<>();\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "75.1%",
            "submissionsCount": 29400,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "binary-tree-preorder-traversal",
        "title": "Binary Tree Preorder Traversal",
        "slug": "binary-tree-preorder-traversal",
        "difficulty": "Easy",
        "topic": "Trees",
        "pattern": "Tree Traversals",
        "snippet": "Return the preorder traversal of its nodes' values.",
        "description": "<p>Given the <code>root</code> of a binary tree, return the preorder traversal of its nodes' values (Root -> Left -> Right).</p>",
        "inputFormat": "Root TreeNode of a binary tree.",
        "outputFormat": "List of integers in preorder sequence.",
        "constraints": [
            "The number of nodes in the tree is in the range [0, 100].",
            "-100 <= Node.val <= 100"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "root = [1,null,2,3]",
                "expectedOutput": "[1,2,3]",
                "explanation": "Preorder visits root, then left, then right."
            },
            {
                "id": 2,
                "input": "root = [1]",
                "expectedOutput": "[1]",
                "explanation": "Single node tree."
            }
        ],
        "hints": [
            "Preorder visits: Current Node -> Left Subtree -> Right Subtree.",
            "For an iterative approach, use a Stack initialized with root.",
            "While stack is not empty: pop node, add node.val to result, push node.right (if not null), then push node.left (so left is processed first!)."
        ],
        "starterCode": "class Solution {\n    public java.util.List<Integer> preorderTraversal(TreeNode root) {\n        // Write your solution below\n\n        return new java.util.ArrayList<>();\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "69.8%",
            "submissionsCount": 21200,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "validate-binary-search-tree",
        "title": "Validate Binary Search Tree",
        "slug": "validate-binary-search-tree",
        "difficulty": "Medium",
        "topic": "Trees",
        "pattern": "Binary Search Trees",
        "snippet": "Determine if a binary tree is a valid binary search tree (BST).",
        "description": "<p>Given the <code>root</code> of a binary tree, determine if it is a valid binary search tree (BST). A valid BST is defined as follows: The left subtree of a node contains only nodes with keys strictly less than the node's key. The right subtree of a node contains only nodes with keys strictly greater than the node's key. Both the left and right subtrees must also be binary search trees.</p>",
        "inputFormat": "Root TreeNode of a binary tree.",
        "outputFormat": "Boolean <code>true</code> if valid BST, <code>false</code> otherwise.",
        "constraints": [
            "The number of nodes in the tree is in the range [1, 10^4].",
            "-2^31 <= Node.val <= 2^31 - 1"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "root = [2,1,3]",
                "expectedOutput": "true",
                "explanation": "Left child 1 < 2 < right child 3."
            },
            {
                "id": 2,
                "input": "root = [5,1,4,null,null,3,6]",
                "expectedOutput": "false",
                "explanation": "The root node's value is 5 but its right child's value is 4."
            }
        ],
        "hints": [
            "It is not enough that left < node < right; all nodes in the left subtree must be less than node.",
            "Pass a valid range (min, max) down the recursion tree. Use Long to avoid integer overflow.",
            "Helper: isValid(node, min, max): if node == null return true. If node.val <= min || node.val >= max return false. Return isValid(node.left, min, node.val) && isValid(node.right, node.val, max)."
        ],
        "starterCode": "class Solution {\n    public boolean isValidBST(TreeNode root) {\n        // Write your solution below\n\n        return false;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "32.8%",
            "submissionsCount": 20100,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "kth-smallest-element-in-bst",
        "title": "Kth Smallest Element in a BST",
        "slug": "kth-smallest-element-in-bst",
        "difficulty": "Medium",
        "topic": "Trees",
        "pattern": "Binary Search Trees",
        "snippet": "Find the kth smallest value (1-indexed) in a binary search tree.",
        "description": "<p>Given the <code>root</code> of a binary search tree, and an integer <code>k</code>, return the <code>k</code>-th smallest value (1-indexed) of all the values of the nodes in the tree.</p>",
        "inputFormat": "Root of BST and integer <code>k</code>.",
        "outputFormat": "The kth smallest value.",
        "constraints": [
            "The number of nodes in the tree is n.",
            "1 <= k <= n <= 10^4",
            "0 <= Node.val <= 10^4"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "root = [3,1,4,null,2], k = 1",
                "expectedOutput": "1",
                "explanation": "Inorder traversal is [1, 2, 3, 4], 1st smallest is 1."
            },
            {
                "id": 2,
                "input": "root = [5,3,6,2,4,null,null,1], k = 3",
                "expectedOutput": "3",
                "explanation": "3rd smallest element is 3."
            }
        ],
        "hints": [
            "An inorder traversal of a Binary Search Tree produces sorted values in strictly ascending order.",
            "Traverse inorder and stop as soon as you have visited k nodes.",
            "Use an iterative inorder traversal with a Stack. Each time you pop a node, decrement k. When k == 0, return the popped node's value."
        ],
        "starterCode": "class Solution {\n    public int kthSmallest(TreeNode root, int k) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "71.9%",
            "submissionsCount": 18300,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "insert-into-binary-search-tree",
        "title": "Insert into a Binary Search Tree",
        "slug": "insert-into-binary-search-tree",
        "difficulty": "Medium",
        "topic": "Trees",
        "pattern": "Binary Search Trees",
        "snippet": "Insert a new value into a BST and return the root of the modified BST.",
        "description": "<p>You are given the <code>root</code> node of a binary search tree (BST) and a <code>val</code> to insert into the tree. Return the root node of the BST after the insertion. It is guaranteed that the new value does not exist in the original BST.</p>",
        "inputFormat": "Root of BST and integer <code>val</code>.",
        "outputFormat": "Root of modified BST.",
        "constraints": [
            "The number of nodes in the tree will be in the range [0, 10^4].",
            "-10^8 <= Node.val <= 10^8",
            "val does not exist in original BST."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "root = [4,2,7,1,3], val = 5",
                "expectedOutput": "[4,2,7,1,3,5]",
                "explanation": "5 is inserted as left child of 7."
            },
            {
                "id": 2,
                "input": "root = [40,20,60,10,30,50,70], val = 25",
                "expectedOutput": "[40,20,60,10,30,50,70,null,null,25]",
                "explanation": "25 inserted."
            }
        ],
        "hints": [
            "A leaf position always exists where the new value can be inserted validly.",
            "If root is null, return new TreeNode(val).",
            "If val < root.val, root.left = insertIntoBST(root.left, val). If val > root.val, root.right = insertIntoBST(root.right, val). Return root."
        ],
        "starterCode": "class Solution {\n    public TreeNode insertIntoBST(TreeNode root, int val) {\n        // Write your solution below\n\n        return null;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "73.9%",
            "submissionsCount": 14100,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "maximum-depth-of-binary-tree",
        "title": "Maximum Depth of Binary Tree",
        "slug": "maximum-depth-of-binary-tree",
        "difficulty": "Easy",
        "topic": "Trees",
        "pattern": "Height and Depth",
        "snippet": "Find the maximum depth (number of nodes along longest path from root to leaf).",
        "description": "<p>Given the <code>root</code> of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.</p>",
        "inputFormat": "Root TreeNode of a binary tree.",
        "outputFormat": "Maximum depth as an integer.",
        "constraints": [
            "The number of nodes in the tree is in the range [0, 10^4].",
            "-100 <= Node.val <= 100"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "root = [3,9,20,null,null,15,7]",
                "expectedOutput": "3",
                "explanation": "Longest path is 3 -> 20 -> 15 (depth 3)."
            },
            {
                "id": 2,
                "input": "root = [1,null,2]",
                "expectedOutput": "2",
                "explanation": "Depth is 2."
            }
        ],
        "hints": [
            "The depth of a tree is 1 + max(depth(left), depth(right)).",
            "Base case: if root == null, return 0.",
            "Recursive case: return 1 + Math.max(maxDepth(root.left), maxDepth(root.right))."
        ],
        "starterCode": "class Solution {\n    public int maxDepth(TreeNode root) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "74.8%",
            "submissionsCount": 31200,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "diameter-of-binary-tree",
        "title": "Diameter of Binary Tree",
        "slug": "diameter-of-binary-tree",
        "difficulty": "Easy",
        "topic": "Trees",
        "pattern": "Height and Depth",
        "snippet": "Return the length of the longest path between any two nodes in a tree.",
        "description": "<p>Given the <code>root</code> of a binary tree, return the length of the diameter of the tree. The diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the root. The length of a path between two nodes is represented by the number of edges between them.</p>",
        "inputFormat": "Root of binary tree.",
        "outputFormat": "Integer diameter (number of edges).",
        "constraints": [
            "The number of nodes in the tree is in the range [1, 10^4].",
            "-100 <= Node.val <= 100"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "root = [1,2,3,4,5]",
                "expectedOutput": "3",
                "explanation": "Longest path is [4,2,1,3] or [5,2,1,3], which has length 3 edges."
            },
            {
                "id": 2,
                "input": "root = [1,2]",
                "expectedOutput": "1",
                "explanation": "1 edge between 1 and 2."
            }
        ],
        "hints": [
            "The longest path passing through any node is depth(leftSubtree) + depth(rightSubtree).",
            "Calculate the height of each node, and update a global maxDiameter at each step.",
            "Helper returns height: 1 + max(leftH, rightH). Before returning, update maxDiameter = Math.max(maxDiameter, leftH + rightH)."
        ],
        "starterCode": "class Solution {\n    public int diameterOfBinaryTree(TreeNode root) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "60.4%",
            "submissionsCount": 22300,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "balanced-binary-tree",
        "title": "Balanced Binary Tree",
        "slug": "balanced-binary-tree",
        "difficulty": "Easy",
        "topic": "Trees",
        "pattern": "Height and Depth",
        "snippet": "Determine if a binary tree is height-balanced.",
        "description": "<p>Given a binary tree, determine if it is height-balanced. A height-balanced binary tree is defined as a binary tree in which the left and right subtrees of every node differ in height by no more than 1.</p>",
        "inputFormat": "Root of binary tree.",
        "outputFormat": "Boolean <code>true</code> if balanced, <code>false</code> otherwise.",
        "constraints": [
            "The number of nodes in the tree is in the range [0, 5000].",
            "-10^4 <= Node.val <= 10^4"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "root = [3,9,20,null,null,15,7]",
                "expectedOutput": "true",
                "explanation": "Every subtree height differs by at most 1."
            },
            {
                "id": 2,
                "input": "root = [1,2,2,3,3,null,null,4,4]",
                "expectedOutput": "false",
                "explanation": "Not height-balanced."
            }
        ],
        "hints": [
            "A bottom-up recursion can compute height and check balance simultaneously in O(N) time.",
            "Return -1 from the helper if any subtree is unbalanced.",
            "In checkHeight(node): if left == -1 || right == -1 || abs(left - right) > 1 return -1. Otherwise return 1 + max(left, right). Tree is balanced if checkHeight(root) != -1."
        ],
        "starterCode": "class Solution {\n    public boolean isBalanced(TreeNode root) {\n        // Write your solution below\n\n        return false;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "51.2%",
            "submissionsCount": 18900,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "lowest-common-ancestor-of-bst",
        "title": "Lowest Common Ancestor of a BST",
        "slug": "lowest-common-ancestor-of-bst",
        "difficulty": "Medium",
        "topic": "Trees",
        "pattern": "Lowest Common Ancestor",
        "snippet": "Find the lowest common ancestor (LCA) node of two given nodes in a BST.",
        "description": "<p>Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST. According to the definition of LCA on Wikipedia: 'The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself).'</p>",
        "inputFormat": "Root of BST, and two target nodes <code>p</code> and <code>q</code>.",
        "outputFormat": "TreeNode representing the LCA.",
        "constraints": [
            "The number of nodes in the tree is in the range [2, 10^5].",
            "-10^9 <= Node.val <= 10^9",
            "All Node.val are unique.",
            "p != q",
            "p and q will exist in the BST."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8",
                "expectedOutput": "6",
                "explanation": "The LCA of nodes 2 and 8 is 6."
            },
            {
                "id": 2,
                "input": "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4",
                "expectedOutput": "2",
                "explanation": "The LCA of nodes 2 and 4 is 2 since a node can be descendant of itself."
            }
        ],
        "hints": [
            "Use the BST ordering property: nodes smaller than current are on the left, nodes larger are on the right.",
            "If both p.val and q.val are smaller than curr.val, the LCA must be in the left subtree.",
            "If both are greater than curr.val, LCA is in the right subtree. If they split (one is smaller, one is larger) or one equals curr, curr IS the LCA!"
        ],
        "starterCode": "class Solution {\n    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n        // Write your solution below\n\n        return null;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "63.8%",
            "submissionsCount": 20100,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "lowest-common-ancestor-of-binary-tree",
        "title": "Lowest Common Ancestor of a Binary Tree",
        "slug": "lowest-common-ancestor-of-binary-tree",
        "difficulty": "Medium",
        "topic": "Trees",
        "pattern": "Lowest Common Ancestor",
        "snippet": "Find the lowest common ancestor of two nodes in a general binary tree.",
        "description": "<p>Given a binary tree, find the lowest common ancestor (LCA) of two given nodes <code>p</code> and <code>q</code>.</p>",
        "inputFormat": "Root of binary tree, and nodes <code>p, q</code>.",
        "outputFormat": "TreeNode representing the LCA.",
        "constraints": [
            "The number of nodes in the tree is in the range [2, 10^5].",
            "-10^9 <= Node.val <= 10^9",
            "All Node.val are unique.",
            "p != q",
            "p and q exist in the tree."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1",
                "expectedOutput": "3",
                "explanation": "LCA of 5 and 1 is 3."
            },
            {
                "id": 2,
                "input": "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4",
                "expectedOutput": "5",
                "explanation": "LCA of 5 and 4 is 5."
            }
        ],
        "hints": [
            "Since this is a general binary tree (not BST), search both subtrees recursively.",
            "Base case: if root == null || root == p || root == q, return root.",
            "Recurse left and right. If both left and right return non-null, root is the split point (LCA!). If only one is non-null, return that non-null child."
        ],
        "starterCode": "class Solution {\n    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n        // Write your solution below\n\n        return null;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "61.2%",
            "submissionsCount": 22800,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "binary-tree-level-order-traversal",
        "title": "Binary Tree Level Order Traversal",
        "slug": "binary-tree-level-order-traversal",
        "difficulty": "Medium",
        "topic": "Trees",
        "pattern": "Level Order Traversal",
        "snippet": "Return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
        "description": "<p>Given the <code>root</code> of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).</p>",
        "inputFormat": "Root TreeNode of a binary tree.",
        "outputFormat": "List of lists of integers per level.",
        "constraints": [
            "The number of nodes in the tree is in the range [0, 2000].",
            "-1000 <= Node.val <= 1000"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "root = [3,9,20,null,null,15,7]",
                "expectedOutput": "[[3],[9,20],[15,7]]",
                "explanation": "Level 0: [3], Level 1: [9,20], Level 2: [15,7]."
            },
            {
                "id": 2,
                "input": "root = [1]",
                "expectedOutput": "[[1]]",
                "explanation": "Single node."
            }
        ],
        "hints": [
            "Level order traversal is Breadth-First Search (BFS).",
            "A Queue (FIFO) processes nodes level by level.",
            "While queue is not empty: get levelSize = queue.size(). Loop levelSize times: poll node, add value to current level list, enqueue left and right children."
        ],
        "starterCode": "class Solution {\n    public java.util.List<java.util.List<Integer>> levelOrder(TreeNode root) {\n        // Write your solution below\n\n        return new java.util.ArrayList<>();\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "67.4%",
            "submissionsCount": 26400,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "binary-tree-right-side-view",
        "title": "Binary Tree Right Side View",
        "slug": "binary-tree-right-side-view",
        "difficulty": "Medium",
        "topic": "Trees",
        "pattern": "Level Order Traversal",
        "snippet": "Return the values of the nodes you can see ordered from top to bottom standing on the right side.",
        "description": "<p>Given the <code>root</code> of a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.</p>",
        "inputFormat": "Root TreeNode of a binary tree.",
        "outputFormat": "List of integers visible from right side.",
        "constraints": [
            "The number of nodes in the tree is in the range [0, 100].",
            "-100 <= Node.val <= 100"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "root = [1,2,3,null,5,null,4]",
                "expectedOutput": "[1,3,4]",
                "explanation": "Rightmost visible nodes from top to bottom."
            },
            {
                "id": 2,
                "input": "root = [1,null,3]",
                "expectedOutput": "[1,3]",
                "explanation": "Nodes on right path."
            }
        ],
        "hints": [
            "Standing on the right side, you see the last node of each level in a level-order traversal.",
            "Run BFS level-order traversal with a Queue.",
            "At each level, loop for levelSize times. The last node polled (when index == levelSize - 1) is added to the result list."
        ],
        "starterCode": "class Solution {\n    public java.util.List<Integer> rightSideView(TreeNode root) {\n        // Write your solution below\n\n        return new java.util.ArrayList<>();\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "63.9%",
            "submissionsCount": 17900,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "binary-tree-zigzag-level-order",
        "title": "Binary Tree Zigzag Level Order Traversal",
        "slug": "binary-tree-zigzag-level-order",
        "difficulty": "Medium",
        "topic": "Trees",
        "pattern": "Level Order Traversal",
        "snippet": "Return the zigzag level order traversal of its nodes' values (alternate left-to-right and right-to-left).",
        "description": "<p>Given the <code>root</code> of a binary tree, return the zigzag level order traversal of its nodes' values. (i.e., from left to right, then right to left for the next level and alternate between).</p>",
        "inputFormat": "Root TreeNode of a binary tree.",
        "outputFormat": "List of lists of integers in zigzag order.",
        "constraints": [
            "The number of nodes in the tree is in the range [0, 2000].",
            "-1000 <= Node.val <= 1000"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "root = [3,9,20,null,null,15,7]",
                "expectedOutput": "[[3],[20,9],[15,7]]",
                "explanation": "Level 1 is left-to-right, level 2 is right-to-left, level 3 is left-to-right."
            },
            {
                "id": 2,
                "input": "root = [1]",
                "expectedOutput": "[[1]]",
                "explanation": "Single level."
            }
        ],
        "hints": [
            "Use BFS with a boolean flag leftToRight that toggles at each level.",
            "Use a LinkedList (or Deque) to store the values of each level.",
            "If leftToRight is true, append values to the end (list.addLast). If false, insert values at the front (list.addFirst). Toggle flag after each level."
        ],
        "starterCode": "class Solution {\n    public java.util.List<java.util.List<Integer>> zigzagLevelOrder(TreeNode root) {\n        // Write your solution below\n\n        return new java.util.ArrayList<>();\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "59.2%",
            "submissionsCount": 15800,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "kth-largest-element-in-array",
        "title": "Kth Largest Element in an Array",
        "slug": "kth-largest-element-in-array",
        "difficulty": "Medium",
        "topic": "Heaps and Priority Queues",
        "pattern": "Top K Elements",
        "snippet": "Find the kth largest element in an unsorted array without full sorting.",
        "description": "<p>Given an integer array <code>nums</code> and an integer <code>k</code>, return the <code>k</code>-th largest element in the array. Note that it is the <code>k</code>-th largest element in the sorted order, not the <code>k</code>-th distinct element. Can you solve it without sorting in O(N) average time?</p>",
        "inputFormat": "An integer array <code>nums</code> and integer <code>k</code>.",
        "outputFormat": "The kth largest integer.",
        "constraints": [
            "1 <= k <= nums.length <= 10^5",
            "-10^4 <= nums[i] <= 10^4"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [3,2,1,5,6,4], k = 2",
                "expectedOutput": "5",
                "explanation": "Sorted order is [1,2,3,4,5,6], 2nd largest is 5."
            },
            {
                "id": 2,
                "input": "nums = [3,2,3,1,2,4,5,5,6], k = 4",
                "expectedOutput": "4",
                "explanation": "4th largest element is 4."
            }
        ],
        "hints": [
            "A min-heap of size k keeps the k largest elements seen so far at all times.",
            "Initialize a PriorityQueue<Integer> (min-heap by default in Java).",
            "Offer each num to heap. If heap.size() > k, heap.poll(). At the end, heap.peek() is the kth largest element in O(N log k) time. (QuickSelect achieves O(N))."
        ],
        "starterCode": "class Solution {\n    public int findKthLargest(int[] nums, int k) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "67.1%",
            "submissionsCount": 25400,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "top-k-frequent-words",
        "title": "Top K Frequent Words",
        "slug": "top-k-frequent-words",
        "difficulty": "Medium",
        "topic": "Heaps and Priority Queues",
        "pattern": "Top K Elements",
        "snippet": "Return the k most frequent strings sorted by frequency from highest to lowest, breaking ties by alphabetical order.",
        "description": "<p>Given an array of strings <code>words</code> and an integer <code>k</code>, return the <code>k</code> most frequent strings. Return the answer sorted by the frequency from highest to lowest. Sort the words with the same frequency by their lexicographical order.</p>",
        "inputFormat": "An array of strings <code>words</code> and integer <code>k</code>.",
        "outputFormat": "List of top k frequent strings.",
        "constraints": [
            "1 <= words.length <= 500",
            "1 <= words[i].length <= 10",
            "words[i] consists of lowercase English letters.",
            "k is in the range [1, unique words]."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "words = ['i','love','leetcode','i','love','coding'], k = 2",
                "expectedOutput": "['i','love']",
                "explanation": "'i' and 'love' are the two most frequent words."
            },
            {
                "id": 2,
                "input": "words = ['the','day','is','sunny','the','the','the','sunny','is','is'], k = 4",
                "expectedOutput": "['the','is','sunny','day']",
                "explanation": "Ties broken alphabetically."
            }
        ],
        "hints": [
            "Count word frequencies with a HashMap first.",
            "Use a PriorityQueue with custom comparator: lower frequency comes first (so it gets polled out); for equal frequency, lexicographically greater comes first.",
            "Maintain heap size at k. Poll excess elements. Reverse the remaining heap elements to build the final list."
        ],
        "starterCode": "class Solution {\n    public java.util.List<String> topKFrequent(String[] words, int k) {\n        // Write your solution below\n\n        return new java.util.ArrayList<>();\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "58.4%",
            "submissionsCount": 12800,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "kth-largest-element-in-stream",
        "title": "Kth Largest Element in a Stream",
        "slug": "kth-largest-element-in-stream",
        "difficulty": "Easy",
        "topic": "Heaps and Priority Queues",
        "pattern": "Kth Largest/Smallest",
        "snippet": "Design a class to find the kth largest element in a stream.",
        "description": "<p>Design a class to find the <code>k</code>-th largest element in a stream. Note that it is the <code>k</code>-th largest element in the sorted order, not the <code>k</code>-th distinct element. Implement <code>KthLargest</code> class: <code>KthLargest(int k, int[] nums)</code> initializes the object and <code>int add(int val)</code> appends <code>val</code> and returns the <code>k</code>-th largest element.</p>",
        "inputFormat": "Constructor with <code>k, nums</code> and stream calls to <code>add(val)</code>.",
        "outputFormat": "Kth largest element per call.",
        "constraints": [
            "1 <= k <= 10^4",
            "0 <= nums.length <= 10^4",
            "-10^4 <= nums[i], val <= 10^4"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "k = 3, nums = [4, 5, 8, 2], adds = [3, 5, 10, 9, 4]",
                "expectedOutput": "[4, 5, 5, 8, 8]",
                "explanation": "Returns 3rd largest value at each step."
            },
            {
                "id": 2,
                "input": "k = 1, nums = [], adds = [-3, -2, -4, 0, 4]",
                "expectedOutput": "[-3, -2, -2, 0, 4]",
                "explanation": "Returns maximum at each step."
            }
        ],
        "hints": [
            "A min-heap of capacity k will always have the kth largest element right at the top (heap.peek()).",
            "In the constructor, add all elements into a min-heap PriorityQueue and poll until size is at most k.",
            "In add(val): offer val. If size > k, poll(). Return heap.peek()."
        ],
        "starterCode": "class Solution {\n    public int add(int val) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "57.8%",
            "submissionsCount": 17600,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "find-k-pairs-with-smallest-sums",
        "title": "Find K Pairs with Smallest Sums",
        "slug": "find-k-pairs-with-smallest-sums",
        "difficulty": "Medium",
        "topic": "Heaps and Priority Queues",
        "pattern": "Kth Largest/Smallest",
        "snippet": "Find the k pairs with the smallest sums from two non-decreasing sorted arrays.",
        "description": "<p>You are given two integer arrays <code>nums1</code> and <code>nums2</code> sorted in non-decreasing order and an integer <code>k</code>. Define a pair <code>(u, v)</code> which consists of one element from the first array and one element from the second array. Return the <code>k</code> pairs <code>(u1, v1), (u2, v2), ..., (uk, vk)</code> with the smallest sums.</p>",
        "inputFormat": "Two sorted arrays <code>nums1, nums2</code> and integer <code>k</code>.",
        "outputFormat": "List of k smallest sum pairs.",
        "constraints": [
            "1 <= nums1.length, nums2.length <= 10^5",
            "-10^9 <= nums1[i], nums2[i] <= 10^9",
            "1 <= k <= 10^4"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums1 = [1,7,11], nums2 = [2,4,6], k = 3",
                "expectedOutput": "[[1,2],[1,4],[1,6]]",
                "explanation": "The first 3 pairs are returned from the sequence."
            },
            {
                "id": 2,
                "input": "nums1 = [1,1,2], nums2 = [1,2,3], k = 2",
                "expectedOutput": "[[1,1],[1,1]]",
                "explanation": "Smallest sums are 1+1=2 and 1+1=2."
            }
        ],
        "hints": [
            "Since both arrays are sorted, the smallest pair is (nums1[0], nums2[0]).",
            "Use a min-heap storing tuples: [sum, indexInNums1, indexInNums2].",
            "Initialize heap with pairs (nums1[i], nums2[0]) for i in 0 to min(k, nums1.length - 1). Repeatedly poll min pair, and if indexInNums2 + 1 < nums2.length, push (nums1[i], nums2[indexInNums2 + 1])."
        ],
        "starterCode": "class Solution {\n    public java.util.List<java.util.List<Integer>> kSmallestPairs(int[] nums1, int[] nums2, int k) {\n        // Write your solution below\n\n        return new java.util.ArrayList<>();\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "40.9%",
            "submissionsCount": 11200,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "find-median-from-data-stream",
        "title": "Find Median from Data Stream",
        "slug": "find-median-from-data-stream",
        "difficulty": "Hard",
        "topic": "Heaps and Priority Queues",
        "pattern": "Two Heaps",
        "snippet": "Design a data structure that calculates the median of a stream of integers in O(log n) time.",
        "description": "<p>The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values. Implement the <code>MedianFinder</code> class: <code>addNum(int num)</code> adds the integer into the data structure, and <code>findMedian()</code> returns the median of all elements so far.</p>",
        "inputFormat": "Stream of <code>addNum</code> and <code>findMedian</code> calls.",
        "outputFormat": "Median as double.",
        "constraints": [
            "-10^5 <= num <= 10^5",
            "At most 5 * 10^4 calls will be made to addNum and findMedian."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "adds = [1, 2], findMedian, add 3, findMedian",
                "expectedOutput": "[1.5, 2.0]",
                "explanation": "Median of [1,2] is 1.5, median of [1,2,3] is 2.0."
            },
            {
                "id": 2,
                "input": "adds = [5], findMedian",
                "expectedOutput": "[5.0]",
                "explanation": "Single element median is 5.0."
            }
        ],
        "hints": [
            "Divide the numbers into two halves: the smaller half and the larger half.",
            "Use a max-heap for the smaller half and a min-heap for the larger half.",
            "Balance sizes: max-heap holds either equal size or 1 more element than min-heap. If total size is odd, median is maxHeap.peek(). If even, median is (maxHeap.peek() + minHeap.peek()) / 2.0."
        ],
        "starterCode": "class Solution {\n    public double findMedian() {\n        // Write your solution below\n\n        return 0.0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "52.4%",
            "submissionsCount": 15600,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "sliding-window-median",
        "title": "Sliding Window Median",
        "slug": "sliding-window-median",
        "difficulty": "Hard",
        "topic": "Heaps and Priority Queues",
        "pattern": "Two Heaps",
        "snippet": "Calculate the median of each sliding window of size k moving across the array.",
        "description": "<p>Given an integer array <code>nums</code> and an integer <code>k</code>. There is a sliding window of size <code>k</code> which is moving from the very left of the array to the very right. You can only see the <code>k</code> numbers in the window. Each time the sliding window moves right by one position. Return the median array for each window in the original array.</p>",
        "inputFormat": "An integer array <code>nums</code> and window size <code>k</code>.",
        "outputFormat": "An array of doubles representing medians.",
        "constraints": [
            "1 <= k <= nums.length <= 10^5",
            "-2^31 <= nums[i] <= 2^31 - 1"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [1,3,-1,-3,5,3,6,7], k = 3",
                "expectedOutput": "[1.00000,-1.00000,-1.00000,3.00000,5.00000,6.00000]",
                "explanation": "Medians of consecutive size 3 windows."
            },
            {
                "id": 2,
                "input": "nums = [1,2,3,4,2,3,1,4,2], k = 3",
                "expectedOutput": "[2.00000,3.00000,3.00000,3.00000,2.00000,3.00000,2.00000]",
                "explanation": "Medians per window."
            }
        ],
        "hints": [
            "Extend the Two Heaps approach with lazy deletion for elements falling out of the window.",
            "Maintain a max-heap for small values and a min-heap for large values, along with a hash map of delayed deletions.",
            "When removing an element out of the window, increment its count in the delayed deletion map and rebalance heaps lazily."
        ],
        "starterCode": "class Solution {\n    public double[] medianSlidingWindow(int[] nums, int k) {\n        // Write your solution below\n\n        return new double[]{};\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "40.9%",
            "submissionsCount": 7800,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "merge-k-sorted-lists",
        "title": "Merge K Sorted Lists",
        "slug": "merge-k-sorted-lists",
        "difficulty": "Hard",
        "topic": "Heaps and Priority Queues",
        "pattern": "Merge K Sorted Structures",
        "snippet": "Merge k sorted linked lists and return it as one sorted list.",
        "description": "<p>You are given an array of <code>k</code> linked-lists <code>lists</code>, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.</p>",
        "inputFormat": "An array of <code>k</code> sorted linked-list heads.",
        "outputFormat": "Head of the merged single sorted linked list.",
        "constraints": [
            "k == lists.length",
            "0 <= k <= 10^4",
            "0 <= lists[i].length <= 500",
            "-10^4 <= lists[i][j] <= 10^4",
            "lists[i] is sorted in ascending order."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "lists = [[1,4,5],[1,3,4],[2,6]]",
                "expectedOutput": "[1,1,2,3,4,4,5,6]",
                "explanation": "Merged sorted sequence."
            },
            {
                "id": 2,
                "input": "lists = []",
                "expectedOutput": "[]",
                "explanation": "Empty input."
            }
        ],
        "hints": [
            "At any moment, the next node in the merged list must be the smallest node among the current heads of the k lists.",
            "A min-heap (PriorityQueue) holding the current head of each non-empty list provides the minimum in O(log k) time.",
            "Add all initial heads to the heap. While heap is not empty, poll the smallest node, attach it to merged list, and if smallest.next != null, offer smallest.next to the heap."
        ],
        "starterCode": "class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        // Write your solution below\n\n        return null;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "52.8%",
            "submissionsCount": 18300,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "smallest-range-covering-elements-from-k-lists",
        "title": "Smallest Range Covering Elements from K Lists",
        "slug": "smallest-range-covering-elements-from-k-lists",
        "difficulty": "Hard",
        "topic": "Heaps and Priority Queues",
        "pattern": "Merge K Sorted Structures",
        "snippet": "Find the smallest range [a, b] that includes at least one number from each of the k lists.",
        "description": "<p>You have <code>k</code> lists of sorted integers in non-decreasing order. Find the smallest range that includes at least one number from each of the <code>k</code> lists. We define the range <code>[a, b]</code> is smaller than range <code>[c, d]</code> if <code>b - a < d - c</code> or <code>a < c</code> if <code>b - a == d - c</code>.</p>",
        "inputFormat": "A list of <code>k</code> sorted integer lists.",
        "outputFormat": "Array [start, end] of smallest range.",
        "constraints": [
            "nums.length == k",
            "1 <= k <= 3500",
            "1 <= nums[i].length <= 50",
            "-10^5 <= nums[i][j] <= 10^5",
            "nums[i] is sorted."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]",
                "expectedOutput": "[20,24]",
                "explanation": "Range [20, 24] covers 24 (list 1), 20 (list 2), 22 (list 3)."
            },
            {
                "id": 2,
                "input": "nums = [[1,2,3],[1,2,3],[1,2,3]]",
                "expectedOutput": "[1,1]",
                "explanation": "Range [1,1] covers all three lists."
            }
        ],
        "hints": [
            "Maintain one element from each of the k lists in a min-heap simultaneously.",
            "Track the current maximum value maxVal among the k elements, while heap.peek() gives the current minimum minVal. Current range is [minVal, maxVal].",
            "Poll the minimum element from the heap, update smallestRange if maxVal - minVal is smaller, and push the next element from that list. Stop when any list is exhausted."
        ],
        "starterCode": "class Solution {\n    public int[] smallestRange(java.util.List<java.util.List<Integer>> nums) {\n        // Write your solution below\n\n        return new int[]{};\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "62.7%",
            "submissionsCount": 8400,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "number-of-islands",
        "title": "Number of Islands",
        "slug": "number-of-islands",
        "difficulty": "Medium",
        "topic": "Graphs",
        "pattern": "BFS",
        "snippet": "Count the number of islands in a 2D binary grid.",
        "description": "<p>Given an <code>m x n</code> 2D binary grid <code>grid</code> which represents a map of <code>'1'</code>s (land) and <code>'0'</code>s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.</p>",
        "inputFormat": "A 2D char array <code>grid</code>.",
        "outputFormat": "Number of islands as an integer.",
        "constraints": [
            "m == grid.length",
            "n == grid[i].length",
            "1 <= m, n <= 300",
            "grid[i][j] is '0' or '1'."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "grid = [['1','1','1','1','0'],['1','1','0','1','0'],['1','1','0','0','0'],['0','0','0','0','0']]",
                "expectedOutput": "1",
                "explanation": "All adjacent lands merge into 1 island."
            },
            {
                "id": 2,
                "input": "grid = [['1','1','0','0','0'],['1','1','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']]",
                "expectedOutput": "3",
                "explanation": "Three disconnected islands."
            }
        ],
        "hints": [
            "Iterate over every cell. When you encounter '1', you have discovered a new island!",
            "Increment count and launch a BFS or DFS traversal starting at that cell to mark all connected '1's as visited.",
            "In BFS: enqueue (r, c), mark grid[r][c] = '0'. Dequeue and explore 4 neighbors (up, down, left, right). For each valid neighbor with '1', mark '0' and enqueue."
        ],
        "starterCode": "class Solution {\n    public int numIslands(char[][] grid) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "57.8%",
            "submissionsCount": 27400,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "rotting-oranges",
        "title": "Rotting Oranges",
        "slug": "rotting-oranges",
        "difficulty": "Medium",
        "topic": "Graphs",
        "pattern": "BFS",
        "snippet": "Find the minimum number of minutes that must elapse until no cell has a fresh orange.",
        "description": "<p>You are given an <code>m x n</code> grid where each cell can have one of three values: 0 representing an empty cell, 1 representing a fresh orange, or 2 representing a rotten orange. Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten. Return the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return <code>-1</code>.</p>",
        "inputFormat": "An <code>m x n</code> grid of integers.",
        "outputFormat": "Minimum minutes elapsed, or -1.",
        "constraints": [
            "m == grid.length",
            "n == grid[i].length",
            "1 <= m, n <= 10",
            "grid[i][j] is 0, 1, or 2."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "grid = [[2,1,1],[1,1,0],[0,1,1]]",
                "expectedOutput": "4",
                "explanation": "Oranges rot simultaneously level by level."
            },
            {
                "id": 2,
                "input": "grid = [[2,1,1],[0,1,1],[1,0,1]]",
                "expectedOutput": "-1",
                "explanation": "The bottom-left fresh orange cannot be reached."
            }
        ],
        "hints": [
            "This is a multi-source Breadth-First Search (BFS).",
            "First, enqueue all rotten oranges (cells with value 2) and count the total fresh oranges.",
            "Process BFS level by level. At each minute, rot all adjacent fresh oranges, decrement fresh count, and enqueue. If fresh count == 0 return minutes; otherwise -1."
        ],
        "starterCode": "class Solution {\n    public int orangesRotting(int[][] grid) {\n        // Write your solution below\n\n        return -1;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "54.1%",
            "submissionsCount": 19200,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "word-ladder",
        "title": "Word Ladder",
        "slug": "word-ladder",
        "difficulty": "Hard",
        "topic": "Graphs",
        "pattern": "BFS",
        "snippet": "Find the length of the shortest transformation sequence from beginWord to endWord.",
        "description": "<p>A transformation sequence from word <code>beginWord</code> to word <code>endWord</code> using a dictionary <code>wordList</code> is a sequence of words <code>beginWord -> s1 -> s2 -> ... -> sk</code> such that every adjacent pair of words differs by a single letter, and every <code>si</code> is in <code>wordList</code>. Given two words, <code>beginWord</code> and <code>endWord</code>, and a dictionary <code>wordList</code>, return the number of words in the shortest transformation sequence from <code>beginWord</code> to <code>endWord</code>, or <code>0</code> if no such sequence exists.</p>",
        "inputFormat": "Strings <code>beginWord, endWord</code> and list <code>wordList</code>.",
        "outputFormat": "Shortest sequence length, or 0.",
        "constraints": [
            "1 <= beginWord.length <= 10",
            "endWord.length == beginWord.length",
            "1 <= wordList.length <= 5000"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "beginWord = 'hit', endWord = 'cog', wordList = ['hot','dot','dog','lot','log','cog']",
                "expectedOutput": "5",
                "explanation": "Shortest transformation is 'hit' -> 'hot' -> 'dot' -> 'dog' -> 'cog' (5 words)."
            },
            {
                "id": 2,
                "input": "beginWord = 'hit', endWord = 'cog', wordList = ['hot','dot','dog','lot','log']",
                "expectedOutput": "0",
                "explanation": "'cog' is not in wordList."
            }
        ],
        "hints": [
            "Model this as an unweighted graph where words are vertices and single-letter transformations are edges.",
            "BFS finds the shortest path in an unweighted graph.",
            "Put wordList in a HashSet for O(1) existence checks. Start BFS queue with beginWord at distance 1. For each word, try changing all 26 letters at each character position to generate neighbors."
        ],
        "starterCode": "class Solution {\n    public int ladderLength(String beginWord, String endWord, java.util.List<String> wordList) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "38.2%",
            "submissionsCount": 11500,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "clone-graph",
        "title": "Clone Graph",
        "slug": "clone-graph",
        "difficulty": "Medium",
        "topic": "Graphs",
        "pattern": "DFS",
        "snippet": "Return a deep copy (clone) of a connected undirected graph.",
        "description": "<p>Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node in the graph contains a value (<code>int</code>) and a list (<code>List[Node]</code>) of its neighbors.</p>",
        "inputFormat": "A Node object.",
        "outputFormat": "Cloned deep-copy Node.",
        "constraints": [
            "The number of nodes in the graph is in the range [0, 100].",
            "1 <= Node.val <= 100",
            "Node.val is unique for each node."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "adjList = [[2,4],[1,3],[2,4],[1,3]]",
                "expectedOutput": "[[2,4],[1,3],[2,4],[1,3]]",
                "explanation": "Deep copy with all new Node instances."
            },
            {
                "id": 2,
                "input": "adjList = [[]]",
                "expectedOutput": "[[]]",
                "explanation": "Single isolated node."
            }
        ],
        "hints": [
            "Use a HashMap<Node, Node> to map original nodes to their cloned counterparts and prevent infinite recursion in cycles.",
            "If node == null, return null. If map contains node, return map.get(node).",
            "Create copy = new Node(node.val), put in map, then for each neighbor, copy.neighbors.add(cloneGraph(neighbor)). Return copy."
        ],
        "starterCode": "class Solution {\n    public Node cloneGraph(Node node) {\n        // Write your solution below\n\n        return null;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "55.8%",
            "submissionsCount": 16400,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "max-area-of-island",
        "title": "Max Area of Island",
        "slug": "max-area-of-island",
        "difficulty": "Medium",
        "topic": "Graphs",
        "pattern": "DFS",
        "snippet": "Return the maximum area of an island in a 2D binary grid.",
        "description": "<p>You are given an <code>m x n</code> binary matrix <code>grid</code>. An island is a group of <code>1</code>'s (representing land) connected 4-directionally (horizontal or vertical). You may assume all four edges of the grid are surrounded by water. The area of an island is the number of cells with a value <code>1</code> in the island. Return the maximum area of an island in <code>grid</code>. If there is no island, return <code>0</code>.</p>",
        "inputFormat": "A binary 2D integer array <code>grid</code>.",
        "outputFormat": "Maximum island area as integer.",
        "constraints": [
            "m == grid.length",
            "n == grid[i].length",
            "1 <= m, n <= 50",
            "grid[i][j] is either 0 or 1."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "grid = [[0,0,1,0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],...]",
                "expectedOutput": "6",
                "explanation": "Max area is 6."
            },
            {
                "id": 2,
                "input": "grid = [[0,0,0,0,0,0,0,0]]",
                "expectedOutput": "0",
                "explanation": "No islands present."
            }
        ],
        "hints": [
            "Use Depth-First Search (DFS) to compute the size of each connected component of 1s.",
            "When finding a 1, recursively visit its 4 neighbors, accumulating cell count.",
            "Sink visited land by setting grid[r][c] = 0. Helper dfs(r, c) returns 1 + dfs(up) + dfs(down) + dfs(left) + dfs(right)."
        ],
        "starterCode": "class Solution {\n    public int maxAreaOfIsland(int[][] grid) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "71.9%",
            "submissionsCount": 18300,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "surrounded-regions",
        "title": "Surrounded Regions",
        "slug": "surrounded-regions",
        "difficulty": "Medium",
        "topic": "Graphs",
        "pattern": "DFS",
        "snippet": "Capture all regions surrounded by 'X' by converting them to 'X'.",
        "description": "<p>Given an <code>m x n</code> matrix <code>board</code> containing <code>'X'</code> and <code>'O'</code>, capture all regions that are 4-directionally surrounded by <code>'X'</code>. A region is captured by flipping all <code>'O'</code>s into <code>'X'</code>s in that surrounded region.</p>",
        "inputFormat": "An m x n char array <code>board</code>.",
        "outputFormat": "None (modify <code>board</code> in-place).",
        "constraints": [
            "m == board.length",
            "n == board[i].length",
            "1 <= m, n <= 200",
            "board[i][j] is 'X' or 'O'."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "board = [['X','X','X','X'],['X','O','O','X'],['X','X','O','X'],['X','O','X','X']]",
                "expectedOutput": "[['X','X','X','X'],['X','X','X','X'],['X','X','X','X'],['X','O','X','X']]",
                "explanation": "Surrounded 'O's captured, border-connected 'O' survives."
            },
            {
                "id": 2,
                "input": "board = [['X']]",
                "expectedOutput": "[['X']]",
                "explanation": "Single cell."
            }
        ],
        "hints": [
            "Any 'O' on the border of the board (or connected to a border 'O') CANNOT be surrounded.",
            "Start DFS from all 'O' cells located on the 4 boundary borders.",
            "Mark border-connected 'O's temporarily as '#'. Finally, iterate whole board: change remaining 'O' to 'X', and restore '#' back to 'O'."
        ],
        "starterCode": "class Solution {\n    public void solve(char[][] board) {\n        // Write your solution below\n\n        return ;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "39.4%",
            "submissionsCount": 12900,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "number-of-connected-components",
        "title": "Number of Connected Components in an Undirected Graph",
        "slug": "number-of-connected-components",
        "difficulty": "Medium",
        "topic": "Graphs",
        "pattern": "Connected Components",
        "snippet": "Find the number of connected components in an undirected graph.",
        "description": "<p>You have a graph of <code>n</code> nodes. You are given an integer <code>n</code> and an array <code>edges</code> where <code>edges[i] = [ai, bi]</code> indicates that there is an edge between <code>ai</code> and <code>bi</code> in the graph. Return the number of connected components in the graph.</p>",
        "inputFormat": "Integer <code>n</code> and 2D integer array <code>edges</code>.",
        "outputFormat": "Number of connected components.",
        "constraints": [
            "1 <= n <= 2000",
            "0 <= edges.length <= 5000",
            "edges[i].length == 2",
            "0 <= ai <= bi < n"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "n = 5, edges = [[0,1],[1,2],[3,4]]",
                "expectedOutput": "2",
                "explanation": "Component 1: {0,1,2}, Component 2: {3,4}."
            },
            {
                "id": 2,
                "input": "n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]",
                "expectedOutput": "1",
                "explanation": "All nodes connected."
            }
        ],
        "hints": [
            "This can be solved using either Disjoint Set Union (Union-Find) or BFS/DFS.",
            "With Union-Find, start with n separate components. For each edge, if find(u) != find(v), union them and decrement component count.",
            "Return the remaining component count."
        ],
        "starterCode": "class Solution {\n    public int countComponents(int n, int[][] edges) {\n        // Write your solution below\n\n        return n;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "62.4%",
            "submissionsCount": 10800,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "number-of-provinces",
        "title": "Number of Provinces",
        "slug": "number-of-provinces",
        "difficulty": "Medium",
        "topic": "Graphs",
        "pattern": "Connected Components",
        "snippet": "Find the total number of connected provinces from an adjacency matrix.",
        "description": "<p>There are <code>n</code> cities. Some of them are connected, while some are not. If city <code>a</code> is connected directly with city <code>b</code>, and city <code>b</code> is connected directly with city <code>c</code>, then city <code>a</code> is connected indirectly with city <code>c</code>. A province is a group of directly or indirectly connected cities and no other cities outside of the group. Given an <code>n x n</code> matrix <code>isConnected</code> where <code>isConnected[i][j] = 1</code> if the <code>i</code>-th city and the <code>j</code>-th city are directly connected, and <code>isConnected[i][j] = 0</code> otherwise, return the total number of provinces.</p>",
        "inputFormat": "An n x n binary matrix <code>isConnected</code>.",
        "outputFormat": "Total number of provinces.",
        "constraints": [
            "1 <= n <= 200",
            "n == isConnected.length",
            "isConnected[i][j] is 1 or 0.",
            "isConnected[i][i] == 1",
            "isConnected[i][j] == isConnected[j][i]"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "isConnected = [[1,1,0],[1,1,0],[0,0,1]]",
                "expectedOutput": "2",
                "explanation": "Cities 0 and 1 form one province, city 2 forms another."
            },
            {
                "id": 2,
                "input": "isConnected = [[1,0,0],[0,1,0],[0,0,1]]",
                "expectedOutput": "3",
                "explanation": "Three disconnected provinces."
            }
        ],
        "hints": [
            "Track visited cities using a boolean[] visited array of size n.",
            "Iterate i from 0 to n - 1. If city i has not been visited, start a DFS/BFS to visit all cities connected to i, and increment provinces count.",
            "In DFS(city): mark visited[city] = true. For j from 0 to n - 1: if isConnected[city][j] == 1 && !visited[j], dfs(j)."
        ],
        "starterCode": "class Solution {\n    public int findCircleNum(int[][] isConnected) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "65.7%",
            "submissionsCount": 17200,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "course-schedule",
        "title": "Course Schedule",
        "slug": "course-schedule",
        "difficulty": "Medium",
        "topic": "Graphs",
        "pattern": "Cycle Detection",
        "snippet": "Determine if you can finish all courses given prerequisite dependencies (cycle detection in directed graph).",
        "description": "<p>There are a total of <code>numCourses</code> courses you have to take, labeled from <code>0</code> to <code>numCourses - 1</code>. You are given an array <code>prerequisites</code> where <code>prerequisites[i] = [ai, bi]</code> indicates that you must take course <code>bi</code> first if you want to take course <code>ai</code>. Return <code>true</code> if you can finish all courses. Otherwise, return <code>false</code>.</p>",
        "inputFormat": "Integer <code>numCourses</code> and 2D array <code>prerequisites</code>.",
        "outputFormat": "Boolean <code>true</code> if possible.",
        "constraints": [
            "1 <= numCourses <= 2000",
            "0 <= prerequisites.length <= 5000",
            "prerequisites[i].length == 2",
            "0 <= ai, bi < numCourses"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "numCourses = 2, prerequisites = [[1,0]]",
                "expectedOutput": "true",
                "explanation": "Take course 0 then course 1."
            },
            {
                "id": 2,
                "input": "numCourses = 2, prerequisites = [[1,0],[0,1]]",
                "expectedOutput": "false",
                "explanation": "Circular prerequisite cycle exists."
            }
        ],
        "hints": [
            "You can finish all courses if and only if the directed graph has NO directed cycles.",
            "Use Kahn's algorithm (topological sort via indegrees) or 3-state DFS (0 = unvisited, 1 = visiting, 2 = visited).",
            "With Kahn's: calculate inDegree for every course. Enqueue courses with inDegree == 0. Poll, decrement neighbors' inDegrees, enqueue if 0. Count processed nodes: return count == numCourses."
        ],
        "starterCode": "class Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        // Write your solution below\n\n        return false;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "46.8%",
            "submissionsCount": 24500,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "redundant-connection",
        "title": "Redundant Connection",
        "slug": "redundant-connection",
        "difficulty": "Medium",
        "topic": "Graphs",
        "pattern": "Cycle Detection",
        "snippet": "Return an edge that can be removed so that the resulting graph is a tree.",
        "description": "<p>In this problem, a tree is an undirected graph that is connected and has no cycles. You are given a graph that started as a tree with <code>n</code> nodes labeled from <code>1</code> to <code>n</code>, with one additional edge added. The added edge has two different vertices chosen from <code>1</code> to <code>n</code>, and was not an edge that already existed. Return an edge that can be removed so that the resulting graph is a tree of <code>n</code> nodes.</p>",
        "inputFormat": "2D array <code>edges</code>.",
        "outputFormat": "Edge [u, v] creating cycle.",
        "constraints": [
            "n == edges.length",
            "3 <= n <= 1000",
            "edges[i].length == 2",
            "1 <= ai < bi <= n"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "edges = [[1,2],[1,3],[2,3]]",
                "expectedOutput": "[2,3]",
                "explanation": "[2,3] closes a cycle."
            },
            {
                "id": 2,
                "input": "edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]",
                "expectedOutput": "[1,4]",
                "explanation": "Edge [1,4] creates redundant cycle."
            }
        ],
        "hints": [
            "A tree with n nodes has exactly n - 1 edges. The extra edge is the one that connects two nodes that are ALREADY connected.",
            "Use Disjoint Set Union (DSU / Union-Find).",
            "For each edge [u, v]: if find(u) == find(v), u and v already belong to the same component, so this edge creates a cycle! Return [u, v]. Otherwise union(u, v)."
        ],
        "starterCode": "class Solution {\n    public int[] findRedundantConnection(int[][] edges) {\n        // Write your solution below\n\n        return new int[]{};\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "62.8%",
            "submissionsCount": 14900,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "course-schedule-ii",
        "title": "Course Schedule II",
        "slug": "course-schedule-ii",
        "difficulty": "Medium",
        "topic": "Graphs",
        "pattern": "Topological Sorting",
        "snippet": "Return the ordering of courses you should take to finish all courses.",
        "description": "<p>There are a total of <code>numCourses</code> courses labeled from <code>0</code> to <code>numCourses - 1</code>. Given <code>prerequisites[i] = [ai, bi]</code>, return the ordering of courses you should take to finish all courses. If there are many valid answers, return any of them. If it is impossible to finish all courses, return an empty array.</p>",
        "inputFormat": "Integer <code>numCourses</code> and <code>prerequisites</code>.",
        "outputFormat": "Array representing valid course order.",
        "constraints": [
            "1 <= numCourses <= 2000",
            "0 <= prerequisites.length <= numCourses * (numCourses - 1)"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "numCourses = 2, prerequisites = [[1,0]]",
                "expectedOutput": "[0,1]",
                "explanation": "Course 0 must be taken before course 1."
            },
            {
                "id": 2,
                "input": "numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]",
                "expectedOutput": "[0,2,1,3]",
                "explanation": "Valid topological ordering."
            }
        ],
        "hints": [
            "This is finding a topological sort of a Directed Acyclic Graph (DAG).",
            "Use Kahn's algorithm: calculate indegree array and build adjacency list.",
            "Add courses with inDegree == 0 to a Queue. As each node is dequeued, append it to the order array and decrement its neighbors' indegrees. If processed count < numCourses, return empty array."
        ],
        "starterCode": "class Solution {\n    public int[] findOrder(int numCourses, int[][] prerequisites) {\n        // Write your solution below\n\n        return new int[]{};\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "50.1%",
            "submissionsCount": 19800,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "alien-dictionary-order",
        "title": "Verifying an Alien Dictionary",
        "slug": "alien-dictionary-order",
        "difficulty": "Easy",
        "topic": "Graphs",
        "pattern": "Topological Sorting",
        "snippet": "Verify if words are sorted lexicographically according to a new alien language alphabet order.",
        "description": "<p>In an alien language, surprisingly, they also use English lowercase letters, but possibly in a different <code>order</code>. The <code>order</code> of the alphabet is some permutation of lowercase letters. Given a sequence of <code>words</code> written in the alien language, and the <code>order</code> of the alphabet, return <code>true</code> if and only if the given <code>words</code> are sorted lexicographically in this alien language.</p>",
        "inputFormat": "Array of strings <code>words</code> and string <code>order</code>.",
        "outputFormat": "Boolean <code>true</code> if sorted.",
        "constraints": [
            "1 <= words.length <= 100",
            "1 <= words[i].length <= 20",
            "order.length == 26",
            "All characters are lowercase English letters."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "words = ['hello','leetcode'], order = 'hlabcdefgijkmnopqrstuvwxyz'",
                "expectedOutput": "true",
                "explanation": "'h' comes before 'l' in alien order."
            },
            {
                "id": 2,
                "input": "words = ['word','world','row'], order = 'worldabcefghijkmnpqstuvxyz'",
                "expectedOutput": "false",
                "explanation": "'d' comes after 'l' in this alien order."
            }
        ],
        "hints": [
            "Map each character to its 0-25 rank in the alien order.",
            "Compare adjacent words words[i] and words[i + 1] pair by pair.",
            "Find the first index where characters differ. If orderRank[w1] > orderRank[w2], return false. If w1 is a prefix of w2 and longer, return false."
        ],
        "starterCode": "class Solution {\n    public boolean isAlienSorted(String[] words, String order) {\n        // Write your solution below\n\n        return false;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "54.7%",
            "submissionsCount": 16100,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "network-delay-time",
        "title": "Network Delay Time",
        "slug": "network-delay-time",
        "difficulty": "Medium",
        "topic": "Graphs",
        "pattern": "Shortest Paths",
        "snippet": "Find the minimum time it takes for all n nodes to receive a signal sent from node k using Dijkstra's algorithm.",
        "description": "<p>You are given a network of <code>n</code> nodes, labeled from <code>1</code> to <code>n</code>. You are also given <code>times</code>, a list of travel times as directed edges <code>times[i] = (ui, vi, wi)</code>, where <code>ui</code> is the source node, <code>vi</code> is the target node, and <code>wi</code> is the time it takes for a signal to travel from source to target. We will send a signal from a given node <code>k</code>. Return the minimum time it takes for all the <code>n</code> nodes to receive the signal. If it is impossible for all the <code>n</code> nodes to receive the signal, return <code>-1</code>.</p>",
        "inputFormat": "2D array <code>times</code>, integer <code>n</code>, and starting node <code>k</code>.",
        "outputFormat": "Minimum delay time or -1.",
        "constraints": [
            "1 <= k <= n <= 100",
            "1 <= times.length <= 6000",
            "times[i].length == 3",
            "1 <= ui, vi <= n",
            "ui != vi",
            "0 <= wi <= 100"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2",
                "expectedOutput": "2",
                "explanation": "Signal reaches node 4 in 2 units of time."
            },
            {
                "id": 2,
                "input": "times = [[1,2,1]], n = 2, k = 1",
                "expectedOutput": "1",
                "explanation": "Reaches node 2 in 1 unit."
            }
        ],
        "hints": [
            "This is single-source shortest path with non-negative edge weights: Dijkstra's algorithm.",
            "Maintain a min-heap PriorityQueue storing [node, distance] pairs and an array dist[] initialized to infinity.",
            "Extract min-distance node. For each neighbor, if dist[u] + weight < dist[v], update dist[v] and offer to heap. Answer is max(dist); if any node is unreachable, return -1."
        ],
        "starterCode": "class Solution {\n    public int networkDelayTime(int[][] times, int n, int k) {\n        // Write your solution below\n\n        return -1;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "54.2%",
            "submissionsCount": 14200,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "cheapest-flights-within-k-stops",
        "title": "Cheapest Flights Within K Stops",
        "slug": "cheapest-flights-within-k-stops",
        "difficulty": "Medium",
        "topic": "Graphs",
        "pattern": "Shortest Paths",
        "snippet": "Find the cheapest price from src to dst with at most k stops.",
        "description": "<p>There are <code>n</code> cities connected by some number of flights. You are given an array <code>flights</code> where <code>flights[i] = [fromi, toi, pricei]</code> indicates that there is a flight from city <code>fromi</code> to city <code>toi</code> with cost <code>pricei</code>. You are also given three integers <code>src</code>, <code>dst</code>, and <code>k</code>, return the cheapest price from <code>src</code> to <code>dst</code> with at most <code>k</code> stops. If there is no such route, return <code>-1</code>.</p>",
        "inputFormat": "Array <code>flights</code>, integers <code>src, dst, k</code>.",
        "outputFormat": "Cheapest flight cost or -1.",
        "constraints": [
            "1 <= n <= 100",
            "0 <= flights.length <= (n * (n - 1) / 2)",
            "0 <= src, dst, k < n"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src = 0, dst = 3, k = 1",
                "expectedOutput": "700",
                "explanation": "The optimal path with at most 1 stop is 0 -> 1 -> 3 (cost 700)."
            },
            {
                "id": 2,
                "input": "n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 0",
                "expectedOutput": "500",
                "explanation": "Direct flight with 0 stops costs 500."
            }
        ],
        "hints": [
            "Because of the step constraint (k stops means at most k + 1 edges), Bellman-Ford algorithm is very clean.",
            "Run Bellman-Ford for k + 1 iterations.",
            "In each iteration, create a copy of the prices array. For each flight [u, v, cost], if prices[u] != inf, update tempPrices[v] = min(tempPrices[v], prices[u] + cost). After k + 1 passes, return prices[dst]."
        ],
        "starterCode": "class Solution {\n    public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {\n        // Write your solution below\n\n        return -1;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "38.9%",
            "submissionsCount": 11800,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "non-overlapping-intervals",
        "title": "Non-overlapping Intervals",
        "slug": "non-overlapping-intervals",
        "difficulty": "Medium",
        "topic": "Greedy Algorithms",
        "pattern": "Interval Scheduling",
        "snippet": "Given an array of intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the minimum number of intervals ...",
        "description": "<p>Given an array of intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.</p>",
        "inputFormat": "Standard input parameters as defined in function signature.",
        "outputFormat": "Return value matching the expected method return type.",
        "constraints": [
            "1 <= intervals.length <= 10^5",
            "intervals[i].length == 2",
            "-5 * 10^4 <= start_i < end_i <= 5 * 10^4"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "intervals = [[1,2],[2,3],[3,4],[1,3]]",
                "expectedOutput": "1",
                "explanation": "[1,3] can be removed and the rest of the intervals are non-overlapping."
            },
            {
                "id": 2,
                "input": "intervals = [[1,2],[1,2],[1,2]]",
                "expectedOutput": "2",
                "explanation": "You need to remove two [1,2] to model non-overlapping intervals."
            }
        ],
        "hints": [
            "This problem is equivalent to finding the maximum number of mutually compatible intervals (classic Interval Scheduling).",
            "Sort intervals by their ending times in ascending order. When choosing intervals greedily, picking the one that finishes earliest leaves the most room for subsequent intervals.",
            "Maintain the end time of the last accepted interval. If the current interval starts before this end time, it overlaps and must be removed (increment counter); otherwise, update the end time."
        ],
        "starterCode": "class Solution {\n    public int eraseOverlapIntervals(int[][] intervals) {\n        // Write your solution here\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "54.2%",
            "submissionsCount": 2897,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "meeting-rooms-ii",
        "title": "Meeting Rooms II",
        "slug": "meeting-rooms-ii",
        "difficulty": "Medium",
        "topic": "Greedy Algorithms",
        "pattern": "Interval Scheduling",
        "snippet": "Given an array of meeting time intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the minimum number ...",
        "description": "<p>Given an array of meeting time intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the minimum number of conference rooms required to accommodate all meetings.</p>",
        "inputFormat": "Standard input parameters as defined in function signature.",
        "outputFormat": "Return value matching the expected method return type.",
        "constraints": [
            "1 <= intervals.length <= 10^4",
            "0 <= start_i < end_i <= 10^6"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "intervals = [[0,30],[5,10],[15,20]]",
                "expectedOutput": "2",
                "explanation": "Room 1: [0,30]; Room 2: [5,10], [15,20]."
            },
            {
                "id": 2,
                "input": "intervals = [[7,10],[2,4]]",
                "expectedOutput": "1",
                "explanation": "Only one room is needed as intervals do not overlap."
            }
        ],
        "hints": [
            "Consider the timeline of events: each meeting start increases the required rooms by 1, and each meeting end frees up a room.",
            "You can extract and sort all start times and end times separately, or use a min-heap to keep track of end times of active meetings.",
            "Iterate through sorted start times. If the earliest ending meeting (heap top) has ended before the current start time, reuse that room (poll from heap). Otherwise, allocate a new room."
        ],
        "starterCode": "class Solution {\n    public int minMeetingRooms(int[][] intervals) {\n        // Write your solution here\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "51.8%",
            "submissionsCount": 2813,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "minimum-number-of-arrows-to-burst-balloons",
        "title": "Minimum Number of Arrows to Burst Balloons",
        "slug": "minimum-number-of-arrows-to-burst-balloons",
        "difficulty": "Medium",
        "topic": "Greedy Algorithms",
        "pattern": "Interval Scheduling",
        "snippet": "There are spherical balloons taped to a flat wall. You are given a 2D integer array `points` where `points[i] = [x_start...",
        "description": "<p>There are spherical balloons taped to a flat wall. You are given a 2D integer array `points` where `points[i] = [x_start, x_end]`. An arrow shot vertically upwards from x bursts all balloons with `x_start <= x <= x_end`. Return the minimum number of arrows that must be shot to burst all balloons.</p>",
        "inputFormat": "Standard input parameters as defined in function signature.",
        "outputFormat": "Return value matching the expected method return type.",
        "constraints": [
            "1 <= points.length <= 10^5",
            "points[i].length == 2",
            "-2^31 <= x_start < x_end <= 2^31 - 1"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "points = [[10,16],[2,8],[1,6],[7,12]]",
                "expectedOutput": "2",
                "explanation": "Shoot arrow at x=6 (bursts [2,8] and [1,6]) and x=11 (bursts [10,16] and [7,12])."
            },
            {
                "id": 2,
                "input": "points = [[1,2],[3,4],[5,6],[7,8]]",
                "expectedOutput": "4",
                "explanation": "One arrow is needed for each balloon."
            }
        ],
        "hints": [
            "Every arrow should hit as many overlapping balloons as possible. Greedily shooting at the end coordinate of the balloon that ends earliest maximizes chances of hitting others.",
            "Sort balloons by their end coordinate `x_end` in ascending order. Be cautious of integer overflow during comparison (`Integer.compare`).",
            "Initialize arrows = 1 and set arrowPos = points[0][1]. Iterate through points: if points[i][0] > arrowPos, increment arrows and set arrowPos = points[i][1]."
        ],
        "starterCode": "class Solution {\n    public int findMinArrowShots(int[][] points) {\n        // Write your solution here\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "57.5%",
            "submissionsCount": 3012,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "assign-cookies",
        "title": "Assign Cookies",
        "slug": "assign-cookies",
        "difficulty": "Easy",
        "topic": "Greedy Algorithms",
        "pattern": "Activity Selection",
        "snippet": "Assume you are an awesome parent and want to give your children some cookies. Each child `i` has a greed factor `g[i]`, ...",
        "description": "<p>Assume you are an awesome parent and want to give your children some cookies. Each child `i` has a greed factor `g[i]`, and each cookie `j` has a size `s[j]`. If `s[j] >= g[i]`, the child is content. Your goal is to maximize the number of your content children and output the maximum number.</p>",
        "inputFormat": "Standard input parameters as defined in function signature.",
        "outputFormat": "Return value matching the expected method return type.",
        "constraints": [
            "1 <= g.length <= 3 * 10^4",
            "0 <= s.length <= 3 * 10^4",
            "1 <= g[i], s[j] <= 2^31 - 1"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "g = [1,2,3], s = [1,1]",
                "expectedOutput": "1",
                "explanation": "You can only make child 1 content with cookie of size 1."
            },
            {
                "id": 2,
                "input": "g = [1,2], s = [1,2,3]",
                "expectedOutput": "2",
                "explanation": "You have 3 cookies and their sizes are big enough to gratify all 2 children."
            }
        ],
        "hints": [
            "To satisfy the maximum number of children, satisfy the least greedy children first using the smallest possible cookie that meets their threshold.",
            "Sort both the children's greed array `g` and the cookie sizes array `s` in ascending order.",
            "Use two pointers: childPtr and cookiePtr. If `s[cookiePtr] >= g[childPtr]`, increment childPtr. Always increment cookiePtr. Return childPtr."
        ],
        "starterCode": "class Solution {\n    public int findContentChildren(int[] g, int[] s) {\n        // Write your solution here\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "53.4%",
            "submissionsCount": 2869,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "lemonade-change",
        "title": "Lemonade Change",
        "slug": "lemonade-change",
        "difficulty": "Easy",
        "topic": "Greedy Algorithms",
        "pattern": "Activity Selection",
        "snippet": "At a lemonade stand, each lemonade costs `$5`. Customers are standing in a queue and order one at a time. Each customer ...",
        "description": "<p>At a lemonade stand, each lemonade costs `$5`. Customers are standing in a queue and order one at a time. Each customer will only buy one lemonade and pay with either a `$5`, `$10`, or `$20` bill. You must provide the correct change to each customer, starting with no change in hand. Return `true` if and only if you can provide every customer with correct change.</p>",
        "inputFormat": "Standard input parameters as defined in function signature.",
        "outputFormat": "Return value matching the expected method return type.",
        "constraints": [
            "1 <= bills.length <= 10^5",
            "bills[i] is either 5, 10, or 20"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "bills = [5,5,5,10,20]",
                "expectedOutput": "true",
                "explanation": "From the first 3 customers, we collect three $5 bills. For the 4th, we collect $10 and give $5 change. For the 5th, we give a $10 and a $5."
            },
            {
                "id": 2,
                "input": "bills = [5,5,10,10,20]",
                "expectedOutput": "false",
                "explanation": "For the last customer, we can't give change of $15 because we only have two $10 bills."
            }
        ],
        "hints": [
            "Track the count of $5 and $10 bills in hand. $20 bills are never given out as change, so counting them is unnecessary.",
            "When given a $10 bill, you must return a $5 bill. If you don't have one, return false.",
            "When given a $20 bill, you need $15 in change. Greedily prioritize giving one $10 and one $5 first, because $5 bills are more versatile than $10 bills."
        ],
        "starterCode": "class Solution {\n    public boolean lemonadeChange(int[] bills) {\n        // Write your solution here\n        return true;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "54.8%",
            "submissionsCount": 2918,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "gas-station",
        "title": "Gas Station",
        "slug": "gas-station",
        "difficulty": "Medium",
        "topic": "Greedy Algorithms",
        "pattern": "Activity Selection",
        "snippet": "There are `n` gas stations along a circular route, where the amount of gas at the `i-th` station is `gas[i]`. Traveling ...",
        "description": "<p>There are `n` gas stations along a circular route, where the amount of gas at the `i-th` station is `gas[i]`. Traveling from station `i` to `i + 1` costs `cost[i]` of gas. Return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return `-1`. If there exists a solution, it is guaranteed to be unique.</p>",
        "inputFormat": "Standard input parameters as defined in function signature.",
        "outputFormat": "Return value matching the expected method return type.",
        "constraints": [
            "n == gas.length == cost.length",
            "1 <= n <= 10^5",
            "0 <= gas[i], cost[i] <= 10^4"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "gas = [1,2,3,4,5], cost = [3,4,5,1,2]",
                "expectedOutput": "3",
                "explanation": "Start at station 3 (index 3). Tank = 4 - 1 + 5 - 2 + 1 - 3 + 2 - 4 + 3 - 5 = 0. Completed trip."
            },
            {
                "id": 2,
                "input": "gas = [2,3,4], cost = [3,4,3]",
                "expectedOutput": "-1",
                "explanation": "Total gas = 9 < total cost = 10, impossible to complete a full lap."
            }
        ],
        "hints": [
            "If the total sum of gas is less than the total sum of cost, completing the circuit is fundamentally impossible; return -1.",
            "If you start at station A and run out of gas before station B, no station between A and B can reach B either. The next potential starting point must be B + 1.",
            "Keep track of `totalGas - totalCost` and `currentTank`. When `currentTank < 0`, reset `currentTank = 0` and set `startStation = i + 1`."
        ],
        "starterCode": "class Solution {\n    public int canCompleteCircuit(int[] gas, int[] cost) {\n        // Write your solution here\n        return -1;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "45.6%",
            "submissionsCount": 2596,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "queue-reconstruction-by-height",
        "title": "Queue Reconstruction by Height",
        "slug": "queue-reconstruction-by-height",
        "difficulty": "Medium",
        "topic": "Greedy Algorithms",
        "pattern": "Sorting-Based Greedy",
        "snippet": "You are given an array of people, `people`, where `people[i] = [h_i, k_i]` represents the `i-th` person of height `h_i` ...",
        "description": "<p>You are given an array of people, `people`, where `people[i] = [h_i, k_i]` represents the `i-th` person of height `h_i` with exactly `k_i` other people in front who have a height greater than or equal to `h_i`. Reconstruct and return the queue that meets these attributes.</p>",
        "inputFormat": "Standard input parameters as defined in function signature.",
        "outputFormat": "Return value matching the expected method return type.",
        "constraints": [
            "1 <= people.length <= 2000",
            "0 <= h_i <= 10^6",
            "0 <= k_i < people.length"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "people = [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]",
                "expectedOutput": "[[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]",
                "explanation": "Person 0 has height 5 with no taller people in front. Person 1 has height 7 with 0 taller, etc."
            },
            {
                "id": 2,
                "input": "people = [[6,0],[5,0],[4,0],[3,2],[2,2],[1,4]]",
                "expectedOutput": "[[4,0],[5,0],[2,2],[3,2],[1,4],[6,0]]",
                "explanation": "Reconstructed queue matching all criteria."
            }
        ],
        "hints": [
            "Taller people do not care about shorter people in front of them because shorter people do not affect their `k` count.",
            "Sort people primarily by height descending. For ties in height, sort by `k` ascending.",
            "Insert each person into a dynamic list at index `k`. Since all previously inserted people are taller, inserting person `p` at index `p[1]` ensures exactly `p[1]` taller people precede them."
        ],
        "starterCode": "class Solution {\n    public int[][] reconstructQueue(int[][] people) {\n        // Write your solution here\n        return new int[0][0];\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "73.1%",
            "submissionsCount": 3558,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "task-scheduler",
        "title": "Task Scheduler",
        "slug": "task-scheduler",
        "difficulty": "Medium",
        "topic": "Greedy Algorithms",
        "pattern": "Sorting-Based Greedy",
        "snippet": "Given a characters array `tasks`, representing the tasks a CPU needs to do, and an integer `n` representing the cooldown...",
        "description": "<p>Given a characters array `tasks`, representing the tasks a CPU needs to do, and an integer `n` representing the cooldown interval between two identical tasks. Return the minimum number of units of times that the CPU will take to finish all the given tasks.</p>",
        "inputFormat": "Standard input parameters as defined in function signature.",
        "outputFormat": "Return value matching the expected method return type.",
        "constraints": [
            "1 <= tasks.length <= 10^4",
            "tasks[i] is uppercase English letter",
            "0 <= n <= 100"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "tasks = [\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], n = 2",
                "expectedOutput": "8",
                "explanation": "A -> B -> idle -> A -> B -> idle -> A -> B. Total units = 8."
            },
            {
                "id": 2,
                "input": "tasks = [\"A\",\"C\",\"A\",\"B\",\"D\",\"B\"], n = 1",
                "expectedOutput": "6",
                "explanation": "A -> B -> C -> D -> A -> B. No idle slots needed."
            }
        ],
        "hints": [
            "The execution time is bottlenecked by the task with the maximum frequency.",
            "Let `maxFreq` be the highest count of any single task, and `maxCount` be the number of distinct tasks having that exact maximum frequency.",
            "The formula for slots bounded by idle time is `(maxFreq - 1) * (n + 1) + maxCount`. The final answer is `Math.max(tasks.length, emptySlotsFormula)`."
        ],
        "starterCode": "class Solution {\n    public int leastInterval(char[] tasks, int n) {\n        // Write your solution here\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "59.3%",
            "submissionsCount": 3075,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "candy",
        "title": "Candy",
        "slug": "candy",
        "difficulty": "Hard",
        "topic": "Greedy Algorithms",
        "pattern": "Sorting-Based Greedy",
        "snippet": "There are `n` children standing in a line. Each child is assigned a rating value given in the integer array `ratings`. Y...",
        "description": "<p>There are `n` children standing in a line. Each child is assigned a rating value given in the integer array `ratings`. You must give each child at least 1 candy, and children with a higher rating than their immediate neighbors must get more candies than their neighbor. Return the minimum number of candies you need to have to distribute the candies to the children.</p>",
        "inputFormat": "Standard input parameters as defined in function signature.",
        "outputFormat": "Return value matching the expected method return type.",
        "constraints": [
            "n == ratings.length",
            "1 <= n <= 2 * 10^4",
            "0 <= ratings[i] <= 2 * 10^4"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "ratings = [1,0,2]",
                "expectedOutput": "5",
                "explanation": "You can allocate 2, 1, 2 candies respectively."
            },
            {
                "id": 2,
                "input": "ratings = [1,2,2]",
                "expectedOutput": "4",
                "explanation": "You can allocate 1, 2, 1 candies respectively. The third child gets 1 candy because it satisfies above conditions."
            }
        ],
        "hints": [
            "Each child has two neighbors: left and right. Consider decomposing the problem into two passes: left-to-right and right-to-left.",
            "Initialize an array `candies` filled with 1s. In the left-to-right pass, if `ratings[i] > ratings[i-1]`, set `candies[i] = candies[i-1] + 1`.",
            "In the right-to-left pass, if `ratings[i] > ratings[i+1]`, set `candies[i] = Math.max(candies[i], candies[i+1] + 1)`. The sum of `candies` is the optimal answer."
        ],
        "starterCode": "class Solution {\n    public int candy(int[] ratings) {\n        // Write your solution here\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "43.2%",
            "submissionsCount": 2512,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "jump-game",
        "title": "Jump Game",
        "slug": "jump-game",
        "difficulty": "Medium",
        "topic": "Greedy Algorithms",
        "pattern": "Local Optimal Choices",
        "snippet": "You are given an integer array `nums`. You are initially positioned at the array's first index, and each element in the ...",
        "description": "<p>You are given an integer array `nums`. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return `true` if you can reach the last index, or `false` otherwise.</p>",
        "inputFormat": "Standard input parameters as defined in function signature.",
        "outputFormat": "Return value matching the expected method return type.",
        "constraints": [
            "1 <= nums.length <= 10^4",
            "0 <= nums[i] <= 10^5"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [2,3,1,1,4]",
                "expectedOutput": "true",
                "explanation": "Jump 1 step from index 0 to 1, then 3 steps to the last index."
            },
            {
                "id": 2,
                "input": "nums = [3,2,1,0,4]",
                "expectedOutput": "false",
                "explanation": "You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index."
            }
        ],
        "hints": [
            "Think about the maximum reach you can achieve as you iterate across the array.",
            "Maintain `maxReach = 0`. At each index `i`, if `i > maxReach`, you are stranded and cannot proceed; return false.",
            "Update `maxReach = Math.max(maxReach, i + nums[i])`. If `maxReach >= nums.length - 1`, return true."
        ],
        "starterCode": "class Solution {\n    public boolean canJump(int[] nums) {\n        // Write your solution here\n        return false;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "38.7%",
            "submissionsCount": 2354,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "jump-game-ii",
        "title": "Jump Game II",
        "slug": "jump-game-ii",
        "difficulty": "Medium",
        "topic": "Greedy Algorithms",
        "pattern": "Local Optimal Choices",
        "snippet": "You are given a 0-indexed array of integers `nums` of length `n`. You are initially positioned at `nums[0]`. Each elemen...",
        "description": "<p>You are given a 0-indexed array of integers `nums` of length `n`. You are initially positioned at `nums[0]`. Each element `nums[i]` represents the maximum length of a forward jump from index `i`. Return the minimum number of jumps to reach `nums[n - 1]`. The test cases are generated such that you can reach `nums[n - 1]`.</p>",
        "inputFormat": "Standard input parameters as defined in function signature.",
        "outputFormat": "Return value matching the expected method return type.",
        "constraints": [
            "1 <= nums.length <= 10^4",
            "0 <= nums[i] <= 1000"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [2,3,1,1,4]",
                "expectedOutput": "2",
                "explanation": "The minimum number of jumps to reach the last index is 2. Jump 1 step from index 0 to 1, then 3 steps to the last index."
            },
            {
                "id": 2,
                "input": "nums = [2,3,0,1,4]",
                "expectedOutput": "2",
                "explanation": "Jump to index 1, then jump 3 steps to index 4."
            }
        ],
        "hints": [
            "This can be modeled as finding BFS levels on an implicit graph of reachable jump ranges.",
            "Maintain `curEnd` (the boundary of the current jump) and `farthest` (the furthest index reachable from any index in the current jump window).",
            "Iterate up to `nums.length - 2`. Update `farthest = Math.max(farthest, i + nums[i])`. When `i == curEnd`, increment jumps and set `curEnd = farthest`."
        ],
        "starterCode": "class Solution {\n    public int jump(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "45.1%",
            "submissionsCount": 2578,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "climbing-stairs",
        "title": "Climbing Stairs",
        "slug": "climbing-stairs",
        "difficulty": "Easy",
        "topic": "Dynamic Programming",
        "pattern": "1D DP",
        "snippet": "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how m...",
        "description": "<p>You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?</p>",
        "inputFormat": "Standard input parameters as defined in function signature.",
        "outputFormat": "Return value matching the expected method return type.",
        "constraints": [
            "1 <= n <= 45"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "n = 2",
                "expectedOutput": "2",
                "explanation": "There are two ways to climb to the top: 1. 1 step + 1 step, 2. 2 steps."
            },
            {
                "id": 2,
                "input": "n = 3",
                "expectedOutput": "3",
                "explanation": "There are three ways: 1. 1 + 1 + 1, 2. 1 + 2, 3. 2 + 1."
            }
        ],
        "hints": [
            "To reach step `i`, you must come from either step `i - 1` or step `i - 2`.",
            "This leads directly to the recurrence relation: `ways[i] = ways[i - 1] + ways[i - 2]` with base cases `ways[1] = 1` and `ways[2] = 2`.",
            "Notice this is the Fibonacci sequence. You only need two variables to store previous results in O(1) space."
        ],
        "starterCode": "class Solution {\n    public int climbStairs(int n) {\n        // Write your solution here\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "52.4%",
            "submissionsCount": 2834,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "house-robber",
        "title": "House Robber",
        "slug": "house-robber",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "pattern": "1D DP",
        "snippet": "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, t...",
        "description": "<p>You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night. Return the maximum amount of money you can rob tonight without alerting the police.</p>",
        "inputFormat": "Standard input parameters as defined in function signature.",
        "outputFormat": "Return value matching the expected method return type.",
        "constraints": [
            "1 <= nums.length <= 100",
            "0 <= nums[i] <= 400"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [1,2,3,1]",
                "expectedOutput": "4",
                "explanation": "Rob house 1 (money = 1) and then rob house 3 (money = 3). Total = 4."
            },
            {
                "id": 2,
                "input": "nums = [2,7,9,3,1]",
                "expectedOutput": "12",
                "explanation": "Rob house 1 (money = 2), house 3 (money = 9) and house 5 (money = 1). Total = 12."
            }
        ],
        "hints": [
            "For each house, you have two choices: rob it, or skip it.",
            "If you rob house `i`, you cannot rob house `i-1`, so your total is `nums[i] + dp[i-2]`. If you skip house `i`, your total is `dp[i-1]`.",
            "Recurrence: `dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i])`. You can optimize space to O(1) using two rolling variables `prev1` and `prev2`."
        ],
        "starterCode": "class Solution {\n    public int rob(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "51.1%",
            "submissionsCount": 2788,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "house-robber-ii",
        "title": "House Robber II",
        "slug": "house-robber-ii",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "pattern": "1D DP",
        "snippet": "You are a professional robber planning to rob houses along a street. All houses at this place are arranged in a circle. ...",
        "description": "<p>You are a professional robber planning to rob houses along a street. All houses at this place are arranged in a circle. That means the first house is the neighbor of the last one. Adjacent houses have security systems connected. Return the maximum amount of money you can rob tonight without alerting the police.</p>",
        "inputFormat": "Standard input parameters as defined in function signature.",
        "outputFormat": "Return value matching the expected method return type.",
        "constraints": [
            "1 <= nums.length <= 100",
            "0 <= nums[i] <= 1000"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [2,3,2]",
                "expectedOutput": "3",
                "explanation": "You cannot rob house 1 (money = 2) and then rob house 3 (money = 2), because they are adjacent houses."
            },
            {
                "id": 2,
                "input": "nums = [1,2,3,1]",
                "expectedOutput": "4",
                "explanation": "Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount you can rob = 1 + 3 = 4."
            }
        ],
        "hints": [
            "Since the houses are in a circle, house 0 and house `n - 1` are adjacent. You cannot rob both.",
            "Break the circular dependency into two linear House Robber subproblems: houses `0` to `n - 2`, and houses `1` to `n - 1`.",
            "Run the standard House Robber 1 algorithm on both slices and return `Math.max(robSlice(0, n-2), robSlice(1, n-1))` (handling `n == 1` as a base case)."
        ],
        "starterCode": "class Solution {\n    public int rob(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "42.0%",
            "submissionsCount": 2470,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "decode-ways",
        "title": "Decode Ways",
        "slug": "decode-ways",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "pattern": "1D DP",
        "snippet": "A message containing letters from A-Z can be encoded into numbers using 'A' -> '1', 'B' -> '2', ..., 'Z' -> '26'. Given ...",
        "description": "<p>A message containing letters from A-Z can be encoded into numbers using 'A' -> '1', 'B' -> '2', ..., 'Z' -> '26'. Given a string `s` containing only digits, return the number of ways to decode it.</p>",
        "inputFormat": "Standard input parameters as defined in function signature.",
        "outputFormat": "Return value matching the expected method return type.",
        "constraints": [
            "1 <= s.length <= 100",
            "s contains only digits and may contain leading zero(s)"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "s = \"12\"",
                "expectedOutput": "2",
                "explanation": "\"12\" could be decoded as \"AB\" (1 2) or \"L\" (12)."
            },
            {
                "id": 2,
                "input": "s = \"226\"",
                "expectedOutput": "3",
                "explanation": "\"226\" could be decoded as \"BZ\" (2 26), \"VF\" (22 6), or \"BBF\" (2 2 6)."
            },
            {
                "id": 3,
                "input": "s = \"06\"",
                "expectedOutput": "0",
                "explanation": "\"06\" cannot be mapped to \"F\" because \"6\" is different from \"06\"."
            }
        ],
        "hints": [
            "At each index `i`, we can either decode a single digit `s[i-1]` or a two-digit number `s[i-2...i-1]`.",
            "A single digit is valid if `s[i-1] != '0'`. A two-digit prefix is valid if it lies between `10` and `26`.",
            "Recurrence: `dp[i] = (valid single digit ? dp[i-1] : 0) + (valid two digits ? dp[i-2] : 0)`. Base cases: `dp[0] = 1`."
        ],
        "starterCode": "class Solution {\n    public int numDecodings(String s) {\n        // Write your solution here\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "34.6%",
            "submissionsCount": 2211,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "unique-paths",
        "title": "Unique Paths",
        "slug": "unique-paths",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "pattern": "2D DP",
        "snippet": "There is a robot on an `m x n` grid. The robot is initially located at the top-left corner `(0, 0)`. The robot tries to ...",
        "description": "<p>There is a robot on an `m x n` grid. The robot is initially located at the top-left corner `(0, 0)`. The robot tries to move to the bottom-right corner `(m - 1, n - 1)`. The robot can only move either down or right at any point in time. Given the two integers `m` and `n`, return the number of possible unique paths that the robot can take to reach the bottom-right corner.</p>",
        "inputFormat": "Standard input parameters as defined in function signature.",
        "outputFormat": "Return value matching the expected method return type.",
        "constraints": [
            "1 <= m, n <= 100"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "m = 3, n = 7",
                "expectedOutput": "28",
                "explanation": "28 paths to reach bottom-right corner."
            },
            {
                "id": 2,
                "input": "m = 3, n = 2",
                "expectedOutput": "3",
                "explanation": "1. Right -> Down -> Down; 2. Down -> Down -> Right; 3. Down -> Right -> Down."
            }
        ],
        "hints": [
            "To reach cell `(r, c)`, the robot must come from either cell `(r - 1, c)` or `(r, c - 1)`.",
            "Recurrence: `dp[r][c] = dp[r - 1][c] + dp[r][c - 1]`. Any cell in the first row or first column has only 1 unique path.",
            "You can optimize the 2D matrix into a 1D array of size `n`, iteratively accumulating columns."
        ],
        "starterCode": "class Solution {\n    public int uniquePaths(int m, int n) {\n        // Write your solution here\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "64.1%",
            "submissionsCount": 3243,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "unique-paths-ii",
        "title": "Unique Paths II",
        "slug": "unique-paths-ii",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "pattern": "2D DP",
        "snippet": "You are given an `m x n` integer array `grid`. There is a robot initially located at the top-left corner `(0, 0)`. The r...",
        "description": "<p>You are given an `m x n` integer array `grid`. There is a robot initially located at the top-left corner `(0, 0)`. The robot tries to move to the bottom-right corner `(m - 1, n - 1)`. The robot can only move either down or right at any point in time. An obstacle and space are marked as `1` or `0` respectively in `grid`. A path that the robot takes cannot include any square that is an obstacle. Return the number of possible unique paths.</p>",
        "inputFormat": "Standard input parameters as defined in function signature.",
        "outputFormat": "Return value matching the expected method return type.",
        "constraints": [
            "m == obstacleGrid.length",
            "n == obstacleGrid[i].length",
            "1 <= m, n <= 100",
            "obstacleGrid[i][j] is 0 or 1"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]",
                "expectedOutput": "2",
                "explanation": "There is one obstacle in the middle of the 3x3 grid. 2 unique paths."
            },
            {
                "id": 2,
                "input": "obstacleGrid = [[0,1],[0,0]]",
                "expectedOutput": "1",
                "explanation": "1 path around the obstacle."
            }
        ],
        "hints": [
            "Similar to Unique Paths, but whenever `obstacleGrid[r][c] == 1`, no paths can pass through it, so `dp[r][c] = 0`.",
            "If the starting cell `(0, 0)` or ending cell has an obstacle, return 0 immediately.",
            "Iterate row by row. If `grid[i][j] == 0`, `dp[j] += dp[j-1]`; otherwise, `dp[j] = 0`."
        ],
        "starterCode": "class Solution {\n    public int uniquePathsWithObstacles(int[][] obstacleGrid) {\n        // Write your solution here\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "41.5%",
            "submissionsCount": 2452,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "edit-distance",
        "title": "Edit Distance",
        "slug": "edit-distance",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "pattern": "2D DP",
        "snippet": "Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`. Y...",
        "description": "<p>Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`. You have the following three operations permitted on a word: Insert a character, Delete a character, Replace a character.</p>",
        "inputFormat": "Standard input parameters as defined in function signature.",
        "outputFormat": "Return value matching the expected method return type.",
        "constraints": [
            "0 <= word1.length, word2.length <= 500",
            "word1 and word2 consist of lowercase English letters"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "word1 = \"horse\", word2 = \"ros\"",
                "expectedOutput": "3",
                "explanation": "horse -> rorse (replace 'h' with 'r') -> rose (remove 'r') -> ros (remove 'e')."
            },
            {
                "id": 2,
                "input": "word1 = \"intention\", word2 = \"execution\"",
                "expectedOutput": "5",
                "explanation": "intention -> inention -> enention -> exention -> exection -> execution."
            }
        ],
        "hints": [
            "Let `dp[i][j]` be the minimum operations to convert `word1[0...i-1]` to `word2[0...j-1]`.",
            "If `word1[i-1] == word2[j-1]`, no operation is needed: `dp[i][j] = dp[i-1][j-1]`.",
            "Otherwise, consider the 3 operations: insert (`dp[i][j-1]`), delete (`dp[i-1][j]`), or replace (`dp[i-1][j-1]`). Take `1 + min` of these three."
        ],
        "starterCode": "class Solution {\n    public int minDistance(String word1, String word2) {\n        // Write your solution here\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "56.2%",
            "submissionsCount": 2967,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "partition-equal-subset-sum",
        "title": "Partition Equal Subset Sum",
        "slug": "partition-equal-subset-sum",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "pattern": "Knapsack Patterns",
        "snippet": "Given an integer array `nums`, return `true` if you can partition the array into two subsets such that the sum of the el...",
        "description": "<p>Given an integer array `nums`, return `true` if you can partition the array into two subsets such that the sum of the elements in both subsets is equal or `false` otherwise.</p>",
        "inputFormat": "Standard input parameters as defined in function signature.",
        "outputFormat": "Return value matching the expected method return type.",
        "constraints": [
            "1 <= nums.length <= 200",
            "1 <= nums[i] <= 100"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [1,5,11,5]",
                "expectedOutput": "true",
                "explanation": "The array can be partitioned as [1, 5, 5] and [11]."
            },
            {
                "id": 2,
                "input": "nums = [1,2,3,5]",
                "expectedOutput": "false",
                "explanation": "The array cannot be partitioned into equal sum subsets."
            }
        ],
        "hints": [
            "If the total sum of `nums` is odd, it cannot be divided into two equal integers; return false immediately.",
            "This transforms into the 0/1 Knapsack problem: can we find a subset of numbers that sum up to `target = sum / 2`?",
            "Use a 1D boolean array `dp` of size `target + 1` with `dp[0] = true`. Iterate numbers and update backwards from `target` down to `num` to ensure each item is used at most once."
        ],
        "starterCode": "class Solution {\n    public boolean canPartition(int[] nums) {\n        // Write your solution here\n        return false;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "47.3%",
            "submissionsCount": 2655,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "target-sum",
        "title": "Target Sum",
        "slug": "target-sum",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "pattern": "Knapsack Patterns",
        "snippet": "You are given an integer array `nums` and an integer `target`. You want to build an expression out of nums by adding one...",
        "description": "<p>You are given an integer array `nums` and an integer `target`. You want to build an expression out of nums by adding one of the symbols '+' and '-' before each integer in nums and then concatenate all the integers. Return the number of different expressions that you can build, which evaluates to `target`.</p>",
        "inputFormat": "Standard input parameters as defined in function signature.",
        "outputFormat": "Return value matching the expected method return type.",
        "constraints": [
            "1 <= nums.length <= 20",
            "0 <= nums[i] <= 1000",
            "0 <= sum(nums[i]) <= 1000",
            "-1000 <= target <= 1000"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [1,1,1,1,1], target = 3",
                "expectedOutput": "5",
                "explanation": "-1+1+1+1+1=3, +1-1+1+1+1=3, +1+1-1+1+1=3, +1+1+1-1+1=3, +1+1+1+1-1=3. 5 ways."
            },
            {
                "id": 2,
                "input": "nums = [1], target = 1",
                "expectedOutput": "1",
                "explanation": "+1 = 1."
            }
        ],
        "hints": [
            "Divide the elements into two subsets: P (positive signs) and N (negative signs). Then `sum(P) - sum(N) = target`.",
            "Adding `sum(P) + sum(N) = totalSum` gives `2 * sum(P) = target + totalSum`, meaning `sum(P) = (target + totalSum) / 2`.",
            "If `target + totalSum` is odd or negative, return 0. The problem is now equivalent to finding the number of subsets with sum `sum(P)` (Subset Sum DP)."
        ],
        "starterCode": "class Solution {\n    public int findTargetSumWays(int[] nums, int target) {\n        // Write your solution here\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "46.5%",
            "submissionsCount": 2627,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "coin-change",
        "title": "Coin Change",
        "slug": "coin-change",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "pattern": "Knapsack Patterns",
        "snippet": "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representin...",
        "description": "<p>You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`. You may assume that you have an infinite number of each kind of coin.</p>",
        "inputFormat": "Standard input parameters as defined in function signature.",
        "outputFormat": "Return value matching the expected method return type.",
        "constraints": [
            "1 <= coins.length <= 12",
            "1 <= coins[i] <= 2^31 - 1",
            "0 <= amount <= 10^4"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "coins = [1,2,5], amount = 11",
                "expectedOutput": "3",
                "explanation": "11 = 5 + 5 + 1"
            },
            {
                "id": 2,
                "input": "coins = [2], amount = 3",
                "expectedOutput": "-1",
                "explanation": "Cannot make 3 with 2."
            },
            {
                "id": 3,
                "input": "coins = [1], amount = 0",
                "expectedOutput": "0",
                "explanation": "0 coins for amount 0."
            }
        ],
        "hints": [
            "This is an unbounded knapsack problem. What is the subproblem?",
            "Let `dp[i]` be the minimum coins needed to make amount `i`.",
            "Recurrence: `dp[i] = min(dp[i], dp[i - coin] + 1)` for each coin in `coins` where `coin <= i`. Initialize `dp` with `amount + 1`."
        ],
        "starterCode": "class Solution {\n    public int coinChange(int[] coins, int amount) {\n        // Write your solution here\n        return -1;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "44.2%",
            "submissionsCount": 2547,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "coin-change-ii",
        "title": "Coin Change II",
        "slug": "coin-change-ii",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "pattern": "Knapsack Patterns",
        "snippet": "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representin...",
        "description": "<p>You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the number of combinations that make up that amount. If that amount of money cannot be made up by any combination of the coins, return `0`. You may assume that you have an infinite number of each kind of coin.</p>",
        "inputFormat": "Standard input parameters as defined in function signature.",
        "outputFormat": "Return value matching the expected method return type.",
        "constraints": [
            "1 <= coins.length <= 300",
            "1 <= coins[i] <= 5000",
            "0 <= amount <= 5000"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "amount = 5, coins = [1,2,5]",
                "expectedOutput": "4",
                "explanation": "Four ways: 5=5, 5=2+2+1, 5=2+1+1+1, 5=1+1+1+1+1."
            },
            {
                "id": 2,
                "input": "amount = 3, coins = [2]",
                "expectedOutput": "0",
                "explanation": "Cannot make 3 using only 2s."
            }
        ],
        "hints": [
            "Distinguish between combinations and permutations: here order of coins does not matter, so `[1, 2]` is the same as `[2, 1]`.",
            "To count unique combinations without permutations, loop through the coins outer-most, and amounts inner-most.",
            "Create `dp` array of size `amount + 1` with `dp[0] = 1`. For each coin: for `x` from `coin` to `amount`: `dp[x] += dp[x - coin]`."
        ],
        "starterCode": "class Solution {\n    public int change(int amount, int[] coins) {\n        // Write your solution here\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "63.2%",
            "submissionsCount": 3212,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "longest-increasing-subsequence",
        "title": "Longest Increasing Subsequence",
        "slug": "longest-increasing-subsequence",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "pattern": "Subsequence DP",
        "snippet": "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.",
        "description": "<p>Given an integer array `nums`, return the length of the longest strictly increasing subsequence.</p>",
        "inputFormat": "Standard input parameters as defined in function signature.",
        "outputFormat": "Return value matching the expected method return type.",
        "constraints": [
            "1 <= nums.length <= 2500",
            "-10^4 <= nums[i] <= 10^4"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [10,9,2,5,3,7,101,18]",
                "expectedOutput": "4",
                "explanation": "The longest increasing subsequence is [2, 3, 7, 101], therefore the length is 4."
            },
            {
                "id": 2,
                "input": "nums = [0,1,0,3,2,3]",
                "expectedOutput": "4",
                "explanation": "[0, 1, 2, 3] is an LIS of length 4."
            },
            {
                "id": 3,
                "input": "nums = [7,7,7,7,7,7,7]",
                "expectedOutput": "1",
                "explanation": "Only single elements can form strictly increasing subsequences."
            }
        ],
        "hints": [
            "A standard O(n^2) approach uses `dp[i]` as the length of the longest increasing subsequence ending at index `i`.",
            "`dp[i] = 1 + max(dp[j])` for all `j < i` where `nums[j] < nums[i]`.",
            "An optimal O(n log n) approach maintains an array `tails` where `tails[len]` is the smallest tail of all increasing subsequences of length `len+1`, found via binary search (`Arrays.binarySearch`)."
        ],
        "starterCode": "class Solution {\n    public int lengthOfLIS(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "54.8%",
            "submissionsCount": 2918,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "longest-common-subsequence",
        "title": "Longest Common Subsequence",
        "slug": "longest-common-subsequence",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "pattern": "Subsequence DP",
        "snippet": "Given two strings `text1` and `text2`, return the length of their longest common subsequence. If there is no common subs...",
        "description": "<p>Given two strings `text1` and `text2`, return the length of their longest common subsequence. If there is no common subsequence, return `0`. A subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.</p>",
        "inputFormat": "Standard input parameters as defined in function signature.",
        "outputFormat": "Return value matching the expected method return type.",
        "constraints": [
            "1 <= text1.length, text2.length <= 1000",
            "text1 and text2 consist of only lowercase English characters"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "text1 = \"abcde\", text2 = \"ace\"",
                "expectedOutput": "3",
                "explanation": "The longest common subsequence is \"ace\" and its length is 3."
            },
            {
                "id": 2,
                "input": "text1 = \"abc\", text2 = \"abc\"",
                "expectedOutput": "3",
                "explanation": "\"abc\" has length 3."
            },
            {
                "id": 3,
                "input": "text1 = \"abc\", text2 = \"def\"",
                "expectedOutput": "0",
                "explanation": "No common subsequence."
            }
        ],
        "hints": [
            "Let `dp[i][j]` be the length of the longest common subsequence of prefixes `text1[0...i-1]` and `text2[0...j-1]`.",
            "If `text1[i-1] == text2[j-1]`, this character contributes to the LCS: `dp[i][j] = 1 + dp[i-1][j-1]`.",
            "If they do not match, the character might come from one string or the other: `dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1])`."
        ],
        "starterCode": "class Solution {\n    public int longestCommonSubsequence(String text1, String text2) {\n        // Write your solution here\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "58.2%",
            "submissionsCount": 3037,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "word-break",
        "title": "Word Break",
        "slug": "word-break",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "pattern": "Subsequence DP",
        "snippet": "Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated ...",
        "description": "<p>Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words. Note that the same word in the dictionary may be reused multiple times in the segmentation.</p>",
        "inputFormat": "Standard input parameters as defined in function signature.",
        "outputFormat": "Return value matching the expected method return type.",
        "constraints": [
            "1 <= s.length <= 300",
            "1 <= wordDict.length <= 1000",
            "1 <= wordDict[i].length <= 20",
            "s and wordDict[i] consist of only lowercase English letters"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "s = \"leetcode\", wordDict = [\"leet\",\"code\"]",
                "expectedOutput": "true",
                "explanation": "Return true because \"leetcode\" can be segmented as \"leet code\"."
            },
            {
                "id": 2,
                "input": "s = \"applepenapple\", wordDict = [\"apple\",\"pen\"]",
                "expectedOutput": "true",
                "explanation": "Segmented as \"apple pen apple\"."
            },
            {
                "id": 3,
                "input": "s = \"catsandog\", wordDict = [\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]",
                "expectedOutput": "false",
                "explanation": "Cannot segment successfully."
            }
        ],
        "hints": [
            "Let `dp[i]` denote whether the prefix `s[0...i-1]` can be segmented into valid words from `wordDict`.",
            "Base case: `dp[0] = true` (empty string is always valid).",
            "For each `i` from 1 to `s.length()`, check every `j` from 0 to `i - 1`. If `dp[j] && wordDict.contains(s.substring(j, i))`, then `dp[i] = true`."
        ],
        "starterCode": "import java.util.List;\n\nclass Solution {\n    public boolean wordBreak(String s, List<String> wordDict) {\n        // Write your solution here\n        return false;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "46.7%",
            "submissionsCount": 2634,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "minimum-path-sum",
        "title": "Minimum Path Sum",
        "slug": "minimum-path-sum",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "pattern": "Grid DP",
        "snippet": "Given a `m x n` grid filled with non-negative numbers, find a path from top left to bottom right, which minimizes the su...",
        "description": "<p>Given a `m x n` grid filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path. Note: You can only move either down or right at any point in time.</p>",
        "inputFormat": "Standard input parameters as defined in function signature.",
        "outputFormat": "Return value matching the expected method return type.",
        "constraints": [
            "m == grid.length",
            "n == grid[i].length",
            "1 <= m, n <= 200",
            "0 <= grid[i][j] <= 200"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "grid = [[1,3,1],[1,5,1],[4,2,1]]",
                "expectedOutput": "7",
                "explanation": "Because the path 1 -> 3 -> 1 -> 1 -> 1 minimizes the sum."
            },
            {
                "id": 2,
                "input": "grid = [[1,2,3],[4,5,6]]",
                "expectedOutput": "12",
                "explanation": "Path 1 -> 2 -> 3 -> 6 = 12."
            }
        ],
        "hints": [
            "To reach cell `(i, j)`, we must come from `(i - 1, j)` (above) or `(i, j - 1)` (left).",
            "Recurrence relation: `dp[i][j] = grid[i][j] + Math.min(dp[i-1][j], dp[i][j-1])`.",
            "Initialize the first row and first column with cumulative sums, or solve in-place on `grid` to achieve O(1) extra space."
        ],
        "starterCode": "class Solution {\n    public int minPathSum(int[][] grid) {\n        // Write your solution here\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "63.7%",
            "submissionsCount": 3229,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "maximal-square",
        "title": "Maximal Square",
        "slug": "maximal-square",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "pattern": "Grid DP",
        "snippet": "Given an `m x n` binary matrix filled with '0's and '1's, find the largest square containing only 1's and return its are...",
        "description": "<p>Given an `m x n` binary matrix filled with '0's and '1's, find the largest square containing only 1's and return its area.</p>",
        "inputFormat": "Standard input parameters as defined in function signature.",
        "outputFormat": "Return value matching the expected method return type.",
        "constraints": [
            "m == matrix.length",
            "n == matrix[i].length",
            "1 <= m, n <= 300",
            "matrix[i][j] is '0' or '1'"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "matrix = [[\"1\",\"0\",\"1\",\"0\",\"0\"],[\"1\",\"0\",\"1\",\"1\",\"1\"],[\"1\",\"1\",\"1\",\"1\",\"1\"],[\"1\",\"0\",\"0\",\"1\",\"0\"]]",
                "expectedOutput": "4",
                "explanation": "The maximum square has side length 2, area = 4."
            },
            {
                "id": 2,
                "input": "matrix = [[\"0\",\"1\"],[\"1\",\"0\"]]",
                "expectedOutput": "1",
                "explanation": "Maximum square area is 1."
            },
            {
                "id": 3,
                "input": "matrix = [[\"0\"]]",
                "expectedOutput": "0",
                "explanation": "No 1s, area is 0."
            }
        ],
        "hints": [
            "Let `dp[i][j]` represent the side length of the maximum square whose bottom-right corner is `(i, j)`.",
            "If `matrix[i][j] == '1'`, it forms a square bounded by its top, left, and top-left neighbors: `dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])`.",
            "Maintain `maxSide` across all cells and return `maxSide * maxSide`."
        ],
        "starterCode": "class Solution {\n    public int maximalSquare(char[][] matrix) {\n        // Write your solution here\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "46.0%",
            "submissionsCount": 2610,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "min-cost-climbing-stairs",
        "title": "Min Cost Climbing Stairs",
        "slug": "min-cost-climbing-stairs",
        "difficulty": "Easy",
        "topic": "Dynamic Programming",
        "pattern": "Memoization and Tabulation",
        "snippet": "You are given an integer array `cost` where `cost[i]` is the cost of `i-th` step on a staircase. Once you pay the cost, ...",
        "description": "<p>You are given an integer array `cost` where `cost[i]` is the cost of `i-th` step on a staircase. Once you pay the cost, you can either climb one or two steps. You can either start from the step with index 0, or the step with index 1. Return the minimum cost to reach the top of the floor.</p>",
        "inputFormat": "Standard input parameters as defined in function signature.",
        "outputFormat": "Return value matching the expected method return type.",
        "constraints": [
            "2 <= cost.length <= 1000",
            "0 <= cost[i] <= 999"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "cost = [10,15,20]",
                "expectedOutput": "15",
                "explanation": "You will start at index 1. Pay 15 and climb two steps to reach the top. Total cost is 15."
            },
            {
                "id": 2,
                "input": "cost = [1,100,1,1,1,100,1,1,100,1]",
                "expectedOutput": "6",
                "explanation": "Start at index 0. Pick index 0 -> 2 -> 4 -> 6 -> 7 -> 9 -> top. Cost = 6."
            }
        ],
        "hints": [
            "To reach step `i`, you could have jumped from `i - 1` or `i - 2`.",
            "Recurrence relation: `minCost[i] = cost[i] + Math.min(minCost[i - 1], minCost[i - 2])`.",
            "The top of the floor is at index `n`. Thus, the answer is `Math.min(minCost[n - 1], minCost[n - 2])` with O(1) rolling space."
        ],
        "starterCode": "class Solution {\n    public int minCostClimbingStairs(int[] cost) {\n        // Write your solution here\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "66.5%",
            "submissionsCount": 3327,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "counting-bits",
        "title": "Counting Bits",
        "slug": "counting-bits",
        "difficulty": "Easy",
        "topic": "Dynamic Programming",
        "pattern": "Memoization and Tabulation",
        "snippet": "Given an integer `n`, return an array `ans` of length `n + 1` such that for each `i` (0 <= i <= n), `ans[i]` is the numb...",
        "description": "<p>Given an integer `n`, return an array `ans` of length `n + 1` such that for each `i` (0 <= i <= n), `ans[i]` is the number of 1's in the binary representation of `i`.</p>",
        "inputFormat": "Standard input parameters as defined in function signature.",
        "outputFormat": "Return value matching the expected method return type.",
        "constraints": [
            "0 <= n <= 10^5"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "n = 2",
                "expectedOutput": "[0,1,1]",
                "explanation": "0 --> 0 (0 ones), 1 --> 1 (1 one), 2 --> 10 (1 one)."
            },
            {
                "id": 2,
                "input": "n = 5",
                "expectedOutput": "[0,1,1,2,1,2]",
                "explanation": "0: 0, 1: 1, 2: 1, 3: 2, 4: 1, 5: 2."
            }
        ],
        "hints": [
            "Notice how bit patterns repeat. Dividing an integer by 2 (`i >> 1`) shifts all bits right by one.",
            "The number of set bits in `i` is the number of set bits in `i >> 1` plus the lowest bit `i & 1`.",
            "Recurrence: `ans[i] = ans[i >> 1] + (i & 1)`. Calculate in a single pass from 1 to `n` in O(n) linear time."
        ],
        "starterCode": "class Solution {\n    public int[] countBits(int n) {\n        // Write your solution here\n        return new int[n + 1];\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "77.9%",
            "submissionsCount": 3726,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "richest-customer-wealth",
        "title": "Richest Customer Wealth",
        "slug": "richest-customer-wealth",
        "difficulty": "Easy",
        "topic": "Arrays",
        "pattern": "Traversal and basic operations",
        "snippet": "You are given an m x n integer grid accounts where accounts[i][j] is the money customer i has in bank j. Return the wealth of the richest customer.",
        "description": "<p>You are given an <code>m x n</code> integer grid <code>accounts</code> where <code>accounts[i][j]</code> is the amount of money the <code>i-th</code> customer has in the <code>j-th</code> bank. Return the wealth that the richest customer has. A customer's wealth is the amount of money they have in all their bank accounts.</p>",
        "inputFormat": "A 2D integer array accounts.",
        "outputFormat": "A single integer representing the maximum wealth.",
        "constraints": [
            "m == accounts.length",
            "n == accounts[i].length",
            "1 <= m, n <= 50",
            "1 <= accounts[i][j] <= 100"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "[[1,2,3],[3,2,1]]",
                "expectedOutput": "6",
                "explanation": "Customer 1 has wealth 6, customer 2 has wealth 6."
            },
            {
                "id": 2,
                "input": "[[1,5],[7,3],[3,5]]",
                "expectedOutput": "10",
                "explanation": "Customer 2 has wealth 10, which is the maximum."
            }
        ],
        "hints": [
            "The problem requires iterating through each customer (each row) and finding the maximum row sum.",
            "Use a nested loop. The outer loop traverses customers, and the inner loop sums up the accounts for that customer.",
            "Maintain a maxWealth variable initialized to 0. After summing each row, update maxWealth = Math.max(maxWealth, currentSum)."
        ],
        "starterCode": "class Solution {\n    public int maximumWealth(int[][] accounts) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "88.2%",
            "submissionsCount": 1540,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "fruit-into-baskets",
        "title": "Fruit Into Baskets",
        "slug": "fruit-into-baskets",
        "difficulty": "Medium",
        "topic": "Arrays",
        "pattern": "Sliding Window",
        "snippet": "You are visiting a farm that has a single row of fruit trees. You have two baskets, and each basket can only hold a single type of fruit.",
        "description": "<p>You are visiting a farm that has a single row of fruit trees arranged from left to right. You are given an integer array <code>fruits</code> where <code>fruits[i]</code> is the type of fruit the <code>i-th</code> tree produces. You have two baskets, and each basket can only hold a single type of fruit. Return the maximum number of fruits you can pick.</p>",
        "inputFormat": "An integer array fruits.",
        "outputFormat": "An integer representing the maximum number of fruits.",
        "constraints": [
            "1 <= fruits.length <= 10^5",
            "0 <= fruits[i] < fruits.length"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "[1,2,1]",
                "expectedOutput": "3",
                "explanation": "We can pick from all 3 trees since there are only 2 distinct types [1, 2]."
            },
            {
                "id": 2,
                "input": "[0,1,2,2]",
                "expectedOutput": "3",
                "explanation": "We can pick from [1,2,2]. If we started at 0, we'd stop at 2."
            }
        ],
        "hints": [
            "This is equivalent to finding the length of the longest contiguous subarray that contains at most 2 distinct integers.",
            "Use a sliding window with a HashMap tracking the frequency of each fruit type in the current window.",
            "Expand right pointer adding fruits[right]. While map.size() > 2, shrink left pointer decrementing frequency and removing types with count 0. Update maxFruits = Math.max(maxFruits, right - left + 1)."
        ],
        "starterCode": "class Solution {\n    public int totalFruit(int[] fruits) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "44.6%",
            "submissionsCount": 1350,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "contiguous-array",
        "title": "Contiguous Array",
        "slug": "contiguous-array",
        "difficulty": "Medium",
        "topic": "Arrays",
        "pattern": "Prefix Sum",
        "snippet": "Given a binary array nums, return the maximum length of a contiguous subarray with an equal number of 0 and 1.",
        "description": "<p>Given a binary array <code>nums</code>, return the maximum length of a contiguous subarray with an equal number of <code>0</code> and <code>1</code>.</p>",
        "inputFormat": "A binary array nums containing only 0s and 1s.",
        "outputFormat": "An integer representing the maximum length.",
        "constraints": [
            "1 <= nums.length <= 10^5",
            "nums[i] is either 0 or 1"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "[0,1]",
                "expectedOutput": "2",
                "explanation": "[0, 1] is the longest contiguous subarray with an equal number of 0 and 1."
            },
            {
                "id": 2,
                "input": "[0,1,0]",
                "expectedOutput": "2",
                "explanation": "[0, 1] (or [1, 0]) is a longest contiguous subarray with equal number."
            }
        ],
        "hints": [
            "Transform the array: treat 0 as -1 and 1 as +1. The problem then becomes finding the longest subarray with sum 0.",
            "Use prefix sum with a Hash Map storing the first occurrence index of each prefix sum.",
            "Initialize map with {0: -1}. If the current prefix sum has been seen before at index prevIndex, the subarray from prevIndex + 1 to i sums to 0. Length is i - prevIndex."
        ],
        "starterCode": "class Solution {\n    public int findMaxLength(int[] nums) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "47.5%",
            "submissionsCount": 1150,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "maximum-product-subarray",
        "title": "Maximum Product Subarray",
        "slug": "maximum-product-subarray",
        "difficulty": "Medium",
        "topic": "Arrays",
        "pattern": "Kadane's Algorithm",
        "snippet": "Given an integer array nums, find a contiguous non-empty subarray within the array that has the largest product, and return the product.",
        "description": "<p>Given an integer array <code>nums</code>, find a subarray that has the largest product, and return the product. The test cases are generated so that the answer will fit in a 32-bit integer.</p>",
        "inputFormat": "An integer array nums.",
        "outputFormat": "A 32-bit signed integer representing the maximum product.",
        "constraints": [
            "1 <= nums.length <= 2 * 10^4",
            "-10 <= nums[i] <= 10"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "[2,3,-2,4]",
                "expectedOutput": "6",
                "explanation": "[2,3] has the largest product 6."
            },
            {
                "id": 2,
                "input": "[-2,0,-1]",
                "expectedOutput": "0",
                "explanation": "The result cannot be 2, because [-2,-1] is not a contiguous subarray."
            }
        ],
        "hints": [
            "Unlike addition, multiplying two negative numbers yields a positive number. A negative current value can flip the minimum product into a maximum.",
            "At each index, track both the maximum product and the minimum product ending at that position.",
            "If nums[i] < 0, swap maxProd and minProd. Then update maxProd = Math.max(nums[i], maxProd * nums[i]) and minProd = Math.min(nums[i], minProd * nums[i]). Accumulate global max."
        ],
        "starterCode": "class Solution {\n    public int maxProduct(int[] nums) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "34.9%",
            "submissionsCount": 1620,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "majority-element-ii",
        "title": "Majority Element II",
        "slug": "majority-element-ii",
        "difficulty": "Medium",
        "topic": "Arrays",
        "pattern": "Frequency Counting",
        "snippet": "Given an integer array of size n, find all elements that appear more than \u230a n/3 \u230b times.",
        "description": "<p>Given an integer array of size <code>n</code>, find all elements that appear more than <code>\u230a n/3 \u230b</code> times. Solve in linear time and O(1) space.</p>",
        "inputFormat": "An integer array nums.",
        "outputFormat": "A list of integers that appear more than n/3 times.",
        "constraints": [
            "1 <= nums.length <= 5 * 10^4",
            "-10^9 <= nums[i] <= 10^9"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "[3,2,3]",
                "expectedOutput": "[3]",
                "explanation": "3 appears 2 times, which is more than 3/3 = 1."
            },
            {
                "id": 2,
                "input": "[1]",
                "expectedOutput": "[1]",
                "explanation": "1 appears once, which is more than 1/3 = 0."
            }
        ],
        "hints": [
            "Notice that there can be at most 2 elements that appear strictly more than n / 3 times.",
            "Use Boyer-Moore Voting Algorithm extended to two candidates (cand1, cand2) with two counters (count1, count2).",
            "First pass finds the two most frequent candidates. Second pass verifies whether their actual counts strictly exceed n / 3."
        ],
        "starterCode": "class Solution {\n    public java.util.List<Integer> majorityElement(int[] nums) {\n        // Write your solution below\n\n        return new java.util.ArrayList<>();\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "47.1%",
            "submissionsCount": 1420,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "merge-intervals",
        "title": "Merge Intervals",
        "slug": "merge-intervals",
        "difficulty": "Medium",
        "topic": "Arrays",
        "pattern": "Sorting and Searching",
        "snippet": "Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals.",
        "description": "<p>Given an array of <code>intervals</code> where <code>intervals[i] = [start_i, end_i]</code>, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.</p>",
        "inputFormat": "A 2D integer array intervals.",
        "outputFormat": "A 2D integer array of merged intervals.",
        "constraints": [
            "1 <= intervals.length <= 10^4",
            "intervals[i].length == 2",
            "0 <= start_i <= end_i <= 10^4"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "[[1,3],[2,6],[8,10],[15,18]]",
                "expectedOutput": "[[1,6],[8,10],[15,18]]",
                "explanation": "Since [1,3] and [2,6] overlap, merge them into [1,6]."
            },
            {
                "id": 2,
                "input": "[[1,4],[4,5]]",
                "expectedOutput": "[[1,5]]",
                "explanation": "Intervals [1,4] and [4,5] are considered overlapping."
            }
        ],
        "hints": [
            "Sorting the intervals by their start times ensures overlapping intervals are placed next to each other.",
            "Sort intervals using Arrays.sort with a comparator comparing interval[0].",
            "Iterate through sorted intervals: if current interval overlaps with the last added interval (current.start <= last.end), merge by updating last.end = Math.max(last.end, current.end). Otherwise, append current."
        ],
        "starterCode": "class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Write your solution below\n\n        return new int[0][0];\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "47.2%",
            "submissionsCount": 1980,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "jewels-and-stones",
        "title": "Jewels and Stones",
        "slug": "jewels-and-stones",
        "difficulty": "Easy",
        "topic": "Strings",
        "pattern": "String Traversal",
        "snippet": "You're given strings jewels representing the types of stones that are jewels, and stones representing the stones you have. Find how many stones are jewels.",
        "description": "<p>You're given strings <code>jewels</code> representing the types of stones that are jewels, and <code>stones</code> representing the stones you have. Each character in <code>stones</code> is a type of stone you have. You want to know how many of the stones you have are also jewels. Letters are case sensitive.</p>",
        "inputFormat": "Two strings jewels and stones.",
        "outputFormat": "An integer count of jewels in stones.",
        "constraints": [
            "1 <= jewels.length, stones.length <= 50",
            "jewels and stones consist of only English letters.",
            "All the characters of jewels are unique."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "jewels = \"aA\", stones = \"aAAbbbb\"",
                "expectedOutput": "3",
                "explanation": "The jewels are 'a' and 'A'. stones contains one 'a' and two 'A's. Total 3."
            },
            {
                "id": 2,
                "input": "jewels = \"z\", stones = \"ZZ\"",
                "expectedOutput": "0",
                "explanation": "Case-sensitive, no 'z' present in stones."
            }
        ],
        "hints": [
            "We need to test membership of each stone character in the set of jewel characters.",
            "Use a boolean array boolean[128] or a HashSet<Character> to store jewel characters in O(1) lookup.",
            "Traverse stones: for each character c in stones, if isJewel[c] is true, increment the counter. Return count."
        ],
        "starterCode": "class Solution {\n    public int numJewelsInStones(String jewels, String stones) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "88.5%",
            "submissionsCount": 2400,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "reverse-words-in-a-string",
        "title": "Reverse Words in a String",
        "slug": "reverse-words-in-a-string",
        "difficulty": "Medium",
        "topic": "Strings",
        "pattern": "String Manipulation",
        "snippet": "Given an input string s, reverse the order of the words.",
        "description": "<p>Given an input string <code>s</code>, reverse the order of the words. A word is defined as a sequence of non-space characters. The words in <code>s</code> will be separated by at least one space. Return a string of the words in reverse order concatenated by a single space, with no leading or trailing spaces.</p>",
        "inputFormat": "A string s consisting of English letters, digits, and spaces.",
        "outputFormat": "A formatted string with words in reverse order.",
        "constraints": [
            "1 <= s.length <= 10^4",
            "s contains English letters, digits, and spaces ' '.",
            "There is at least one word in s."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "\"the sky is blue\"",
                "expectedOutput": "\"blue is sky the\"",
                "explanation": "Words reversed in sequence."
            },
            {
                "id": 2,
                "input": "\"  hello world  \"",
                "expectedOutput": "\"world hello\"",
                "explanation": "Redundant spaces reduced to single spaces."
            }
        ],
        "hints": [
            "Split words or iterate backwards from the end of the string to prepend words.",
            "Using StringBuilder: trim leading/trailing spaces, parse words by reading contiguous non-space substrings.",
            "Iterate from right to left: find the end of a word, find its beginning, extract word, append to StringBuilder followed by a space. Return sb.toString().trim()."
        ],
        "starterCode": "class Solution {\n    public String reverseWords(String s) {\n        // Write your solution below\n\n        return \"\";\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "38.7%",
            "submissionsCount": 1850,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "repeated-substring-pattern",
        "title": "Repeated Substring Pattern",
        "slug": "repeated-substring-pattern",
        "difficulty": "Easy",
        "topic": "Strings",
        "pattern": "String Matching",
        "snippet": "Given a string s, check if it can be constructed by taking a substring of it and appending multiple copies of the substring together.",
        "description": "<p>Given a string <code>s</code>, check if it can be constructed by taking a substring of it and appending multiple copies of the substring together.</p>",
        "inputFormat": "A string s consisting of lowercase English letters.",
        "outputFormat": "true if s can be constructed by repeating a substring, false otherwise.",
        "constraints": [
            "1 <= s.length <= 10^4",
            "s consists of lowercase English letters."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "\"abab\"",
                "expectedOutput": "true",
                "explanation": "It is the substring 'ab' twice."
            },
            {
                "id": 2,
                "input": "\"aba\"",
                "expectedOutput": "false",
                "explanation": "Cannot be formed by repeating a substring."
            }
        ],
        "hints": [
            "Consider concatenating s with itself: (s + s). If s has a repeating period, removing the first and last characters of (s + s) will still contain s.",
            "Or check potential pattern lengths L from 1 up to s.length() / 2 where s.length() % L == 0.",
            "Elegant one-liner: String doubled = (s + s).substring(1, 2 * s.length() - 1); return doubled.contains(s);"
        ],
        "starterCode": "class Solution {\n    public boolean repeatedSubstringPattern(String s) {\n        // Write your solution below\n\n        return false;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "46.2%",
            "submissionsCount": 1120,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "intersection-of-two-arrays",
        "title": "Intersection of Two Arrays",
        "slug": "intersection-of-two-arrays",
        "difficulty": "Easy",
        "topic": "Hashing",
        "pattern": "HashSet",
        "snippet": "Given two integer arrays nums1 and nums2, return an array of their intersection. Each element in the result must be unique.",
        "description": "<p>Given two integer arrays <code>nums1</code> and <code>nums2</code>, return an array of their intersection. Each element in the result must be unique and you may return the result in any order.</p>",
        "inputFormat": "Two integer arrays nums1 and nums2.",
        "outputFormat": "An integer array containing unique intersecting elements.",
        "constraints": [
            "1 <= nums1.length, nums2.length <= 1000",
            "0 <= nums1[i], nums2[i] <= 1000"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums1 = [1,2,2,1], nums2 = [2,2]",
                "expectedOutput": "[2]",
                "explanation": "2 is the only common unique element."
            },
            {
                "id": 2,
                "input": "nums1 = [4,9,5], nums2 = [9,4,9,8,4]",
                "expectedOutput": "[4,9]",
                "explanation": "4 and 9 are the common elements."
            }
        ],
        "hints": [
            "A HashSet provides O(1) average lookup and automatically enforces uniqueness.",
            "Add all elements of nums1 into a set1. Then iterate through nums2 and check set1.contains(x).",
            "Store matches in a resultSet to avoid duplicates. Convert resultSet to int[] and return."
        ],
        "starterCode": "class Solution {\n    public int[] intersection(int[] nums1, int[] nums2) {\n        // Write your solution below\n\n        return new int[0];\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "73.4%",
            "submissionsCount": 1560,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "single-number",
        "title": "Single Number",
        "slug": "single-number",
        "difficulty": "Easy",
        "topic": "Hashing",
        "pattern": "Duplicate Detection",
        "snippet": "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.",
        "description": "<p>Given a non-empty array of integers <code>nums</code>, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.</p>",
        "inputFormat": "An integer array nums.",
        "outputFormat": "The unique single integer.",
        "constraints": [
            "1 <= nums.length <= 3 * 10^4",
            "-3 * 10^4 <= nums[i] <= 3 * 10^4",
            "Each element appears twice except for one element which appears once."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "[2,2,1]",
                "expectedOutput": "1",
                "explanation": "1 appears once."
            },
            {
                "id": 2,
                "input": "[4,1,2,1,2]",
                "expectedOutput": "4",
                "explanation": "4 appears once."
            }
        ],
        "hints": [
            "While a HashSet can detect duplicates by tracking seen elements, XOR bitwise operation achieves O(1) space.",
            "Properties of XOR: a ^ a = 0 and a ^ 0 = a. XOR is commutative and associative.",
            "XOR all numbers in the array into an accumulator initialized to 0. All pairs cancel out to 0, leaving only the unique element."
        ],
        "starterCode": "class Solution {\n    public int singleNumber(int[] nums) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "72.8%",
            "submissionsCount": 2800,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "subarray-sums-divisible-by-k",
        "title": "Subarray Sums Divisible by K",
        "slug": "subarray-sums-divisible-by-k",
        "difficulty": "Medium",
        "topic": "Hashing",
        "pattern": "Pair and Complement Lookup",
        "snippet": "Given an integer array nums and an integer k, return the number of non-empty subarrays that have a sum divisible by k.",
        "description": "<p>Given an integer array <code>nums</code> and an integer <code>k</code>, return the number of non-empty subarrays that have a sum divisible by <code>k</code>. A subarray is a contiguous part of an array.</p>",
        "inputFormat": "An integer array nums and an integer k.",
        "outputFormat": "An integer representing the count of valid subarrays.",
        "constraints": [
            "1 <= nums.length <= 3 * 10^4",
            "-10^4 <= nums[i] <= 10^4",
            "2 <= k <= 10^4"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [4,5,0,-2,-3,1], k = 5",
                "expectedOutput": "7",
                "explanation": "There are 7 subarrays with sum divisible by 5."
            },
            {
                "id": 2,
                "input": "nums = [5], k = 9",
                "expectedOutput": "0",
                "explanation": "No subarray sum is divisible by 9."
            }
        ],
        "hints": [
            "If two prefix sums have the same remainder when divided by k, the subarray between them is divisible by k.",
            "Use a hash map or an array of size k to count remainder frequencies.",
            "Compute running remainder: (prefixSum % k + k) % k (handling negative modulo in Java). Add current remainder's frequency to count, then increment frequency."
        ],
        "starterCode": "class Solution {\n    public int subarraysDivByK(int[] nums, int k) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "54.1%",
            "submissionsCount": 1190,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "custom-sort-string",
        "title": "Custom Sort String",
        "slug": "custom-sort-string",
        "difficulty": "Medium",
        "topic": "Hashing",
        "pattern": "Frequency Maps",
        "snippet": "You are given two strings order and s. Permute the characters of s so that they match the order that order was sorted.",
        "description": "<p>You are given two strings <code>order</code> and <code>s</code>. All the characters of order are unique and were sorted in some custom order previously. Permute the characters of <code>s</code> so that they match the order that <code>order</code> was sorted. More specifically, if a character x occurs before a character y in order, then x should occur before y in the permuted string.</p>",
        "inputFormat": "Two strings order and s.",
        "outputFormat": "A permuted string.",
        "constraints": [
            "1 <= order.length <= 26",
            "1 <= s.length <= 200",
            "order and s consist of lowercase English letters.",
            "All characters of order are unique."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "order = \"cba\", s = \"abcd\"",
                "expectedOutput": "\"cbad\"",
                "explanation": "'c', 'b', and 'a' appear in order specified by order. 'd' is appended."
            },
            {
                "id": 2,
                "input": "order = \"bcafg\", s = \"abcd\"",
                "expectedOutput": "\"bcad\"",
                "explanation": "Matching characters appear first in specified order."
            }
        ],
        "hints": [
            "Count the frequency of each character in s, then reconstruct the string following the sequence in order.",
            "Use an int[26] frequency array to count all characters in s.",
            "Iterate through order: for each character c, append it to a StringBuilder count[c - 'a'] times, and reset count[c - 'a'] = 0. Finally, append any remaining characters from the frequency array."
        ],
        "starterCode": "class Solution {\n    public String customSortString(String order, String s) {\n        // Write your solution below\n\n        return \"\";\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "70.2%",
            "submissionsCount": 1150,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "circular-array-loop",
        "title": "Circular Array Loop",
        "slug": "circular-array-loop",
        "difficulty": "Medium",
        "topic": "Linked Lists",
        "pattern": "Cycle Detection",
        "snippet": "An array of non-zero integers nums represents a circular sequence. Determine if there is a loop in nums.",
        "description": "<p>An array of non-zero integers <code>nums</code> represents a circular sequence. Movement from index i jumps by nums[i] steps (modulo n). Determine if there is a cycle where every jump moves in the SAME direction (all positive or all negative) and the cycle length is strictly greater than 1.</p>",
        "inputFormat": "An integer array nums.",
        "outputFormat": "true if there is a valid unidirectional cycle, false otherwise.",
        "constraints": [
            "1 <= nums.length <= 5000",
            "-1000 <= nums[i] <= 1000",
            "nums[i] != 0"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "[2,-1,1,2,2]",
                "expectedOutput": "true",
                "explanation": "Loop 0 -> 2 -> 3 -> 0 has length 3 and moves purely forward."
            },
            {
                "id": 2,
                "input": "[-1,2]",
                "expectedOutput": "false",
                "explanation": "Moves forward then backward, invalid direction change."
            }
        ],
        "hints": [
            "This is an implicit linked list cycle detection problem. Each index points to nextIndex = ((i + nums[i]) % n + n) % n.",
            "Use Floyd's Cycle-Finding Algorithm (slow and fast pointers).",
            "For each starting index: verify that direction does not flip (nums[slow] * nums[next] > 0). If slow == next, cycle length is 1 (self-loop), which is invalid."
        ],
        "starterCode": "class Solution {\n    public boolean circularArrayLoop(int[] nums) {\n        // Write your solution below\n\n        return false;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "33.4%",
            "submissionsCount": 960,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "partition-list",
        "title": "Partition List",
        "slug": "partition-list",
        "difficulty": "Medium",
        "topic": "Linked Lists",
        "pattern": "Merging Lists",
        "snippet": "Given the head of a linked list and a value x, partition it such that all nodes less than x come before nodes greater than or equal to x.",
        "description": "<p>Given the head of a linked list and a value <code>x</code>, partition it such that all nodes less than <code>x</code> come before nodes greater than or equal to <code>x</code>. You should preserve the original relative order of the nodes in each of the two partitions.</p>",
        "inputFormat": "The head of a ListNode and an integer x.",
        "outputFormat": "The head of the partitioned linked list.",
        "constraints": [
            "The number of nodes in the list is in the range [0, 200].",
            "-100 <= Node.val <= 100",
            "-200 <= x <= 200"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "head = [1,4,3,2,5,2], x = 3",
                "expectedOutput": "[1,2,2,4,3,5]",
                "explanation": "Nodes < 3 come first, followed by nodes >= 3, preserving relative order."
            },
            {
                "id": 2,
                "input": "head = [2,1], x = 2",
                "expectedOutput": "[1,2]",
                "explanation": "1 comes before 2."
            }
        ],
        "hints": [
            "Decompose the list into two separate linked lists: one for nodes < x and one for nodes >= x.",
            "Use two dummy nodes: beforeHead and afterHead, with pointers before and after.",
            "Iterate through original list, appending nodes to before or after. Crucially, set after.next = null to avoid cycles, then connect before.next = afterHead.next."
        ],
        "starterCode": "class Solution {\n    public ListNode partition(ListNode head, int x) {\n        // Write your solution below\n\n        return null;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "56.2%",
            "submissionsCount": 1340,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "copy-list-with-random-pointer",
        "title": "Copy List with Random Pointer",
        "slug": "copy-list-with-random-pointer",
        "difficulty": "Medium",
        "topic": "Linked Lists",
        "pattern": "Node Manipulation",
        "snippet": "A linked list of length n is given such that each node contains an additional random pointer. Construct a deep copy of the list.",
        "description": "<p>Construct a deep copy of a linked list where each node has a <code>next</code> pointer and a <code>random</code> pointer pointing to any node in the list, or <code>null</code>.</p>",
        "inputFormat": "The head of a Node with next and random references.",
        "outputFormat": "The head of the cloned list.",
        "constraints": [
            "0 <= n <= 1000",
            "-10^4 <= Node.val <= 10^4",
            "Node.random is null or is pointing to some node in the linked list."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "[[7,null],[13,0],[11,4],[10,2],[1,0]]",
                "expectedOutput": "[[7,null],[13,0],[11,4],[10,2],[1,0]]",
                "explanation": "Deep copy with identical values and pointers."
            },
            {
                "id": 2,
                "input": "[[1,1],[2,1]]",
                "expectedOutput": "[[1,1],[2,1]]",
                "explanation": "Random points to self or other nodes."
            }
        ],
        "hints": [
            "Map original nodes to new nodes, or weave copied nodes directly beside original nodes.",
            "A HashMap<Node, Node> maps each original node to its clone. Pass 1 creates copies, Pass 2 sets next and random.",
            "For O(1) space: weave clones as cur.next = new Node(cur.val); set cur.next.random = cur.random != null ? cur.random.next : null; then unweave lists."
        ],
        "starterCode": "class Solution {\n    public Node copyRandomList(Node head) {\n        // Write your solution below\n\n        return null;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "55.8%",
            "submissionsCount": 1750,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "implement-stack-using-queues",
        "title": "Implement Stack using Queues",
        "slug": "implement-stack-using-queues",
        "difficulty": "Easy",
        "topic": "Stacks and Queues",
        "pattern": "Queue Simulation",
        "snippet": "Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support push, top, pop, and empty.",
        "description": "<p>Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support all the functions of a normal stack (<code>push</code>, <code>top</code>, <code>pop</code>, and <code>empty</code>).</p>",
        "inputFormat": "Sequence of stack operations.",
        "outputFormat": "Return values corresponding to top, pop, and empty operations.",
        "constraints": [
            "1 <= x <= 9",
            "At most 100 calls will be made to push, pop, top, and empty.",
            "All the calls to pop and top are valid."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "[\"MyStack\", \"push\", \"push\", \"top\", \"pop\", \"empty\"]",
                "expectedOutput": "[null, null, null, 2, 2, false]",
                "explanation": "Demonstrates LIFO behavior using FIFO primitives."
            },
            {
                "id": 2,
                "input": "[\"MyStack\", \"push\", \"pop\", \"empty\"]",
                "expectedOutput": "[null, 1, 1, true]",
                "explanation": "Basic push and pop."
            }
        ],
        "hints": [
            "In a queue, the newest element is at the back. To make it behave like a stack, the newest element must be moved to the front.",
            "You can use a single java.util.Queue (LinkedList or ArrayDeque).",
            "When push(x) is called: enqueue x. Then rotate the queue by taking queue.poll() and re-offering it size - 1 times. This puts x at the head of the queue!"
        ],
        "starterCode": "class Solution {\n    public void push(int x) {\n        // Write your solution below\n\n        return // in-place queue simulation;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "61.2%",
            "submissionsCount": 1850,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "final-prices-with-a-special-discount",
        "title": "Final Prices With a Special Discount",
        "slug": "final-prices-with-a-special-discount",
        "difficulty": "Easy",
        "topic": "Stacks and Queues",
        "pattern": "Next Greater Element",
        "snippet": "Given an integer array prices, apply a special discount from the next smaller or equal item.",
        "description": "<p>You are given an integer array <code>prices</code> where <code>prices[i]</code> is the price of the <code>i-th</code> item in a shop. There is a special discount: you will receive a discount equivalent to <code>prices[j]</code> where <code>j</code> is the minimum index such that <code>j > i</code> and <code>prices[j] <= prices[i]</code>. Return an integer array of the final prices.</p>",
        "inputFormat": "An integer array prices.",
        "outputFormat": "An integer array of final prices after discount.",
        "constraints": [
            "1 <= prices.length <= 500",
            "1 <= prices[i] <= 1000"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "[8,4,6,2,3]",
                "expectedOutput": "[4,2,4,2,3]",
                "explanation": "8 - 4 = 4; 4 - 2 = 2; 6 - 2 = 4; 2 has no discount = 2; 3 has no discount = 3."
            },
            {
                "id": 2,
                "input": "[1,2,3,4,5]",
                "expectedOutput": "[1,2,3,4,5]",
                "explanation": "No item receives a discount."
            }
        ],
        "hints": [
            "This is the Next Smaller or Equal Element problem.",
            "Use a monotonic stack storing indices of items waiting for a discount.",
            "Traverse prices with index i: while stack is not empty and prices[stack.peek()] >= prices[i], idx = stack.pop(); prices[idx] -= prices[i]. Then push i. Return prices."
        ],
        "starterCode": "class Solution {\n    public int[] finalPrices(int[] prices) {\n        // Write your solution below\n\n        return new int[0];\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "76.4%",
            "submissionsCount": 1250,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "shortest-subarray-with-sum-at-least-k",
        "title": "Shortest Subarray with Sum at Least K",
        "slug": "shortest-subarray-with-sum-at-least-k",
        "difficulty": "Hard",
        "topic": "Stacks and Queues",
        "pattern": "Deque Applications",
        "snippet": "Given an integer array nums and an integer k, return the length of the shortest non-empty subarray of nums with a sum of at least k.",
        "description": "<p>Given an integer array <code>nums</code> and an integer <code>k</code>, return the length of the shortest non-empty subarray of <code>nums</code> with a sum of at least <code>k</code>. If there is no such subarray, return <code>-1</code>.</p>",
        "inputFormat": "An integer array nums and an integer k.",
        "outputFormat": "An integer length or -1.",
        "constraints": [
            "1 <= nums.length <= 10^5",
            "-10^5 <= nums[i] <= 10^5",
            "1 <= k <= 10^9"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [1], k = 1",
                "expectedOutput": "1",
                "explanation": "Subarray [1] has sum 1 >= 1."
            },
            {
                "id": 2,
                "input": "nums = [1,2], k = 4",
                "expectedOutput": "-1",
                "explanation": "No subarray has sum >= 4."
            }
        ],
        "hints": [
            "Because nums contains negative values, standard two-pointer sliding window does NOT work monotonically. Prefix sum is required: P[j] - P[i] >= k.",
            "Use a Monotonic Deque storing prefix sum indices.",
            "1. While deque not empty and P[i] - P[deque.peekFirst()] >= k: update minLen = Math.min(minLen, i - deque.pollFirst()). 2. While deque not empty and P[i] <= P[deque.peekLast()]: deque.pollLast(). 3. deque.addLast(i)."
        ],
        "starterCode": "class Solution {\n    public int shortestSubarray(int[] nums, int k) {\n        // Write your solution below\n\n        return -1;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "26.3%",
            "submissionsCount": 950,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "first-bad-version",
        "title": "First Bad Version",
        "slug": "first-bad-version",
        "difficulty": "Easy",
        "topic": "Binary Search",
        "pattern": "Basic Binary Search",
        "snippet": "You are a product manager and currently leading a team to develop a new product. Find the first bad version using the isBadVersion API.",
        "description": "<p>You have <code>n</code> versions <code>[1, 2, ..., n]</code> and you want to find out the first bad one, which causes all the following ones to be bad. You are given an API <code>bool isBadVersion(version)</code> which returns whether version is bad. Implement a function to find the first bad version with the fewest API calls.</p>",
        "inputFormat": "An integer n.",
        "outputFormat": "The version number of the first bad version.",
        "constraints": [
            "1 <= k <= n <= 2^31 - 1"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "n = 5, bad = 4",
                "expectedOutput": "4",
                "explanation": "call isBadVersion(3) -> false, isBadVersion(5) -> true, isBadVersion(4) -> true. First bad is 4."
            },
            {
                "id": 2,
                "input": "n = 1, bad = 1",
                "expectedOutput": "1",
                "explanation": "First bad is 1."
            }
        ],
        "hints": [
            "Since versions are ordered [good, good, ..., good, bad, bad, ..., bad], this is a monotonic boolean search space.",
            "Use binary search. Calculate mid = left + (right - left) / 2 to prevent integer overflow.",
            "If isBadVersion(mid) is true, the first bad version is at mid or to the left (right = mid). Otherwise, it is strictly to the right (left = mid + 1). Return left when left == right."
        ],
        "starterCode": "class Solution {\n    public int firstBadVersion(int n) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "44.2%",
            "submissionsCount": 2600,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "find-peak-element",
        "title": "Find Peak Element",
        "slug": "find-peak-element",
        "difficulty": "Medium",
        "topic": "Binary Search",
        "pattern": "Lower and Upper Bound",
        "snippet": "A peak element is an element that is strictly greater than its neighbors. Given a 0-indexed integer array nums, find a peak element.",
        "description": "<p>A peak element is an element that is strictly greater than its neighbors. Given a 0-indexed integer array <code>nums</code>, find a peak element, and return its index. If the array contains multiple peaks, return the index to any of the peaks. You must write an algorithm that runs in O(log n) time.</p>",
        "inputFormat": "An integer array nums.",
        "outputFormat": "The index of any peak element.",
        "constraints": [
            "1 <= nums.length <= 1000",
            "-2^31 <= nums[i] <= 2^31 - 1",
            "nums[i] != nums[i + 1] for all valid i."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "[1,2,3,1]",
                "expectedOutput": "2",
                "explanation": "3 is a peak element and your function should return the index number 2."
            },
            {
                "id": 2,
                "input": "[1,2,1,3,5,6,4]",
                "expectedOutput": "5",
                "explanation": "Index 1 (value 2) or index 5 (value 6) are valid peaks."
            }
        ],
        "hints": [
            "If an element nums[mid] < nums[mid + 1], an increasing slope guarantees that at least one peak exists to the right.",
            "Binary search: set left = 0, right = nums.length - 1.",
            "If nums[mid] > nums[mid + 1], we are on a descending slope (or at a peak); search left: right = mid. Otherwise search right: left = mid + 1. Return left."
        ],
        "starterCode": "class Solution {\n    public int findPeakElement(int[] nums) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "46.1%",
            "submissionsCount": 1720,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "search-in-rotated-sorted-array-ii",
        "title": "Search in Rotated Sorted Array II",
        "slug": "search-in-rotated-sorted-array-ii",
        "difficulty": "Medium",
        "topic": "Binary Search",
        "pattern": "Search in Rotated Arrays",
        "snippet": "Given the array nums after being rotated at an unknown pivot and an integer target, return true if target is in nums, or false if not.",
        "description": "<p>There is an integer array <code>nums</code> sorted in non-decreasing order (not necessarily with distinct values). Given the array <code>nums</code> after being rotated and an integer <code>target</code>, return <code>true</code> if <code>target</code> is in <code>nums</code>, or <code>false</code> if it is not in <code>nums</code>.</p>",
        "inputFormat": "An integer array nums with duplicates and an integer target.",
        "outputFormat": "A boolean true or false.",
        "constraints": [
            "1 <= nums.length <= 5000",
            "-10^4 <= nums[i] <= 10^4",
            "-10^4 <= target <= 10^4"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [2,5,6,0,0,1,2], target = 0",
                "expectedOutput": "true",
                "explanation": "0 is present in the rotated array."
            },
            {
                "id": 2,
                "input": "nums = [2,5,6,0,0,1,2], target = 3",
                "expectedOutput": "false",
                "explanation": "3 is not present."
            }
        ],
        "hints": [
            "Duplicates create ambiguity when nums[left] == nums[mid] == nums[right], making it impossible to determine which half is sorted.",
            "When nums[left] == nums[mid] == nums[right], simply shrink the search window: left++ and right--.",
            "Otherwise, determine whether the left half or right half is normally sorted, check if target falls inside that sorted range, and adjust bounds accordingly."
        ],
        "starterCode": "class Solution {\n    public boolean search(int[] nums, int target) {\n        // Write your solution below\n\n        return false;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "37.5%",
            "submissionsCount": 1080,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "power-of-four",
        "title": "Power of Four",
        "slug": "power-of-four",
        "difficulty": "Easy",
        "topic": "Recursion and Backtracking",
        "pattern": "Basic Recursion",
        "snippet": "Given an integer n, return true if it is a power of four. Otherwise, return false.",
        "description": "<p>Given an integer <code>n</code>, return <code>true</code> if it is a power of four. Otherwise, return <code>false</code>. An integer n is a power of four if there exists an integer x such that n == 4^x.</p>",
        "inputFormat": "An integer n.",
        "outputFormat": "true if n is a power of four, false otherwise.",
        "constraints": [
            "-2^31 <= n <= 2^31 - 1"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "16",
                "expectedOutput": "true",
                "explanation": "16 = 4^2."
            },
            {
                "id": 2,
                "input": "5",
                "expectedOutput": "false",
                "explanation": "5 is not a power of four."
            }
        ],
        "hints": [
            "Base cases: n <= 0 is false, n == 1 is true.",
            "If n % 4 != 0, it cannot be a power of four.",
            "Recursion: return isPowerOfFour(n / 4). Alternatively, check (n > 0) && ((n & (n - 1)) == 0) && ((n & 0x55555555) != 0)."
        ],
        "starterCode": "class Solution {\n    public boolean isPowerOfFour(int n) {\n        // Write your solution below\n\n        return false;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "48.2%",
            "submissionsCount": 1320,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "letter-case-permutation",
        "title": "Letter Case Permutation",
        "slug": "letter-case-permutation",
        "difficulty": "Medium",
        "topic": "Recursion and Backtracking",
        "pattern": "Subsets",
        "snippet": "Given a string s, you can transform every letter individually to be lowercase or uppercase to create another string. Return a list of all possible strings.",
        "description": "<p>Given a string <code>s</code>, you can transform every letter individually to be lowercase or uppercase to create another string. Return a list of all possible strings we could create. Return the output in any order.</p>",
        "inputFormat": "A string s consisting of English letters and digits.",
        "outputFormat": "A list of all generated strings.",
        "constraints": [
            "1 <= s.length <= 12",
            "s consists of lowercase English letters, uppercase English letters, and digits."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "\"a1b2\"",
                "expectedOutput": "[\"a1b2\",\"a1B2\",\"A1b2\",\"A1B2\"]",
                "explanation": "All 4 combinations of letter cases."
            },
            {
                "id": 2,
                "input": "\"3z4\"",
                "expectedOutput": "[\"3z4\",\"3Z4\"]",
                "explanation": "Digits remain unchanged."
            }
        ],
        "hints": [
            "At each character, if it is a digit, you have 1 choice. If it is a letter, you have 2 branching choices: lowercase or uppercase.",
            "Use backtracking or BFS to build strings index by index.",
            "Base case: index == s.length(), add current char[] converted to String to results. If Character.isLetter, branch with Character.toLowerCase and Character.toUpperCase."
        ],
        "starterCode": "class Solution {\n    public java.util.List<String> letterCasePermutation(String s) {\n        // Write your solution below\n\n        return new java.util.ArrayList<>();\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "74.2%",
            "submissionsCount": 1250,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "next-permutation",
        "title": "Next Permutation",
        "slug": "next-permutation",
        "difficulty": "Medium",
        "topic": "Recursion and Backtracking",
        "pattern": "Permutations",
        "snippet": "A permutation of an array of integers is an arrangement of its members into a sequence. Find the next lexicographically greater permutation.",
        "description": "<p>A permutation of an array of integers is an arrangement of its members into a sequence or linear order. The next permutation of an array of integers is the next lexicographically greater permutation of its integer. If no greater permutation is possible, rearrange as the lowest possible order (sorted in ascending order). Must be solved in-place.</p>",
        "inputFormat": "An integer array nums.",
        "outputFormat": "None (modifies nums in-place).",
        "constraints": [
            "1 <= nums.length <= 100",
            "0 <= nums[i] <= 100"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "[1,2,3]",
                "expectedOutput": "[1,3,2]",
                "explanation": "The next lexicographical permutation is [1,3,2]."
            },
            {
                "id": 2,
                "input": "[3,2,1]",
                "expectedOutput": "[1,2,3]",
                "explanation": "Highest permutation wraps around to lowest sorted order."
            }
        ],
        "hints": [
            "Find the first decreasing element from the right: nums[i] < nums[i + 1].",
            "From the right, find the smallest element nums[j] that is strictly greater than nums[i].",
            "Swap nums[i] and nums[j]. Reverse the entire suffix from i + 1 to the end of the array to make it the smallest possible lexicographical tail."
        ],
        "starterCode": "class Solution {\n    public void nextPermutation(int[] nums) {\n        // Write your solution below\n\n        return // in-place;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "39.5%",
            "submissionsCount": 2100,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "combination-sum-ii",
        "title": "Combination Sum II",
        "slug": "combination-sum-ii",
        "difficulty": "Medium",
        "topic": "Recursion and Backtracking",
        "pattern": "Combination Generation",
        "snippet": "Given a collection of candidate numbers and a target number, find all unique combinations in candidates where the candidate numbers sum to target.",
        "description": "<p>Given a collection of candidate numbers (<code>candidates</code>) and a target number (<code>target</code>), find all unique combinations in <code>candidates</code> where the candidate numbers sum to <code>target</code>. Each number in candidates may only be used once in the combination. The solution set must not contain duplicate combinations.</p>",
        "inputFormat": "An integer array candidates and an integer target.",
        "outputFormat": "A list of lists containing unique combinations.",
        "constraints": [
            "1 <= candidates.length <= 100",
            "1 <= candidates[i] <= 50",
            "1 <= target <= 30"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "candidates = [10,1,2,7,6,1,5], target = 8",
                "expectedOutput": "[[1,1,6],[1,2,5],[1,7],[2,6]]",
                "explanation": "Duplicate combinations are excluded."
            },
            {
                "id": 2,
                "input": "candidates = [2,5,2,1,2], target = 5",
                "expectedOutput": "[[1,2,2],[5]]",
                "explanation": "Each candidate number is used at most once per branch."
            }
        ],
        "hints": [
            "Sort the candidates first so that duplicates are adjacent and we can prune duplicate branches.",
            "Backtracking: pass remaining target and start index. Advance index to i + 1 since each element is used at most once.",
            "Skip duplicates at the same decision level: if (i > start && candidates[i] == candidates[i - 1]) continue. If target < candidates[i], break early."
        ],
        "starterCode": "class Solution {\n    public java.util.List<java.util.List<Integer>> combinationSum2(int[] candidates, int target) {\n        // Write your solution below\n\n        return new java.util.ArrayList<>();\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "54.6%",
            "submissionsCount": 1600,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "lowest-common-ancestor-of-deepest-leaves",
        "title": "Lowest Common Ancestor of Deepest Leaves",
        "slug": "lowest-common-ancestor-of-deepest-leaves",
        "difficulty": "Medium",
        "topic": "Trees",
        "pattern": "Lowest Common Ancestor",
        "snippet": "Given the root of a binary tree, return the lowest common ancestor of its deepest leaves.",
        "description": "<p>Given the root of a binary tree, return the lowest common ancestor of its deepest leaves. A leaf is called deepest if it has the largest depth possible among any leaf in the entire tree.</p>",
        "inputFormat": "The root of a TreeNode.",
        "outputFormat": "The TreeNode that is the lowest common ancestor of deepest leaves.",
        "constraints": [
            "The number of nodes in the tree will be in the range [1, 1000].",
            "0 <= Node.val <= 1000"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "[3,5,1,6,2,0,8,null,null,7,4]",
                "expectedOutput": "[2,7,4]",
                "explanation": "7 and 4 are the deepest leaves, their LCA is node 2."
            },
            {
                "id": 2,
                "input": "[1]",
                "expectedOutput": "[1]",
                "explanation": "The root is the only leaf, so it is its own LCA."
            }
        ],
        "hints": [
            "Notice that if the left and right subtrees of a node have equal maximum depth, that node is the LCA of the deepest leaves in its subtree.",
            "Perform a post-order traversal returning both the subtree depth and the LCA node candidate (Pair<TreeNode, Integer>).",
            "If leftDepth == rightDepth, return (node, leftDepth + 1). If leftDepth > rightDepth, return (leftLCA, leftDepth + 1). Otherwise return (rightLCA, rightDepth + 1)."
        ],
        "starterCode": "class Solution {\n    public TreeNode lcaDeepestLeaves(TreeNode root) {\n        // Write your solution below\n\n        return null;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "72.4%",
            "submissionsCount": 980,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "k-closest-points-to-origin",
        "title": "K Closest Points to Origin",
        "slug": "k-closest-points-to-origin",
        "difficulty": "Medium",
        "topic": "Heaps and Priority Queues",
        "pattern": "Top K Elements",
        "snippet": "Given an array of points where points[i] = [x_i, y_i] and an integer k, return the k closest points to the origin (0, 0).",
        "description": "<p>Given an array of <code>points</code> where <code>points[i] = [x_i, y_i]</code> represents a point on the X-Y plane and an integer <code>k</code>, return the <code>k</code> closest points to the origin <code>(0, 0)</code>. Distance is calculated via Euclidean distance: x^2 + y^2.</p>",
        "inputFormat": "A 2D integer array points and an integer k.",
        "outputFormat": "A 2D integer array of the k closest points.",
        "constraints": [
            "1 <= k <= points.length <= 10^4",
            "-10^4 <= x_i, y_i <= 10^4"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "points = [[1,3],[-2,2]], k = 1",
                "expectedOutput": "[[-2,2]]",
                "explanation": "(-2,2) has distance sqrt(8) while (1,3) has distance sqrt(10)."
            },
            {
                "id": 2,
                "input": "points = [[3,3],[5,-1],[-2,4]], k = 2",
                "expectedOutput": "[[3,3],[-2,4]]",
                "explanation": "Both have smaller squared distances than [5,-1]."
            }
        ],
        "hints": [
            "We want to retain the k smallest distances. A Max-Heap of size k is the standard pattern.",
            "Compute squared distance dist = p[0]*p[0] + p[1]*p[1] (no need for Math.sqrt).",
            "Maintain a PriorityQueue sorted descending by distance. For each point, add it; if heap size > k, poll() the furthest point. At the end, dump heap contents."
        ],
        "starterCode": "class Solution {\n    public int[][] kClosest(int[][] points, int k) {\n        // Write your solution below\n\n        return new int[0][0];\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "66.5%",
            "submissionsCount": 1650,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "kth-smallest-element-in-a-bst",
        "title": "Kth Smallest Value in a BST",
        "slug": "kth-smallest-element-in-a-bst",
        "difficulty": "Medium",
        "topic": "Heaps and Priority Queues",
        "pattern": "Kth Largest/Smallest",
        "snippet": "Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.",
        "description": "<p>Given the root of a binary search tree, and an integer <code>k</code>, return the <code>k-th</code> smallest value (1-indexed) of all the values of the nodes in the tree.</p>",
        "inputFormat": "The root of a TreeNode and an integer k.",
        "outputFormat": "An integer representing the kth smallest value.",
        "constraints": [
            "The number of nodes in the tree is n.",
            "1 <= k <= n <= 10^4",
            "0 <= Node.val <= 10^4"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "root = [3,1,4,null,2], k = 1",
                "expectedOutput": "1",
                "explanation": "1 is the smallest element."
            },
            {
                "id": 2,
                "input": "root = [5,3,6,2,4,null,null,1], k = 3",
                "expectedOutput": "3",
                "explanation": "The elements in sorted order are [1, 2, 3, 4, 5, 6]. 3rd is 3."
            }
        ],
        "hints": [
            "An inorder traversal of a Binary Search Tree produces elements in strictly ascending sorted order.",
            "You can use an iterative stack or recursive traversal, decrementing k on visiting each node.",
            "When k reaches 0, the current node's value is the kth smallest. Stop traversal immediately and return it."
        ],
        "starterCode": "class Solution {\n    public int kthSmallest(TreeNode root, int k) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "71.9%",
            "submissionsCount": 2100,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "ipo-project-selection",
        "title": "IPO Project Capital Selection",
        "slug": "ipo-project-selection",
        "difficulty": "Hard",
        "topic": "Heaps and Priority Queues",
        "pattern": "Two Heaps",
        "snippet": "Given n projects with profits and capitals, pick at most k distinct projects to maximize your final capital.",
        "description": "<p>Suppose LeetCode will start its IPO soon. To generate capital, you are given <code>k</code> projects. You are given <code>n</code> projects where the <code>i-th</code> project has a pure profit <code>profits[i]</code> and a minimum capital <code>capital[i]</code> needed to start it. Initially, you have <code>w</code> capital. Choose at most <code>k</code> distinct projects to maximize your total capital.</p>",
        "inputFormat": "Integers k, w, and integer arrays profits and capital.",
        "outputFormat": "An integer representing the maximum possible final capital.",
        "constraints": [
            "1 <= k <= 10^5",
            "0 <= w <= 10^9",
            "n == profits.length == capital.length",
            "1 <= n <= 10^5",
            "0 <= profits[i] <= 10^4",
            "0 <= capital[i] <= 10^9"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "k = 2, w = 0, profits = [1,2,3], capital = [0,1,1]",
                "expectedOutput": "4",
                "explanation": "Pick project 0 (capital 0, profit 1) -> w=1. Then pick project 2 (capital 1, profit 3) -> w=4."
            },
            {
                "id": 2,
                "input": "k = 3, w = 0, profits = [1,2,3], capital = [0,1,2]",
                "expectedOutput": "6",
                "explanation": "Sequentially pick projects to reach total 6."
            }
        ],
        "hints": [
            "Sort all projects by required capital ascending. Then among all currently affordable projects, greedily pick the one with maximum profit.",
            "Use a Min-Heap (or sorted list) for projects by capital, and a Max-Heap for affordable projects by profit.",
            "Repeat k times: transfer all projects whose capital <= w into the Max-Heap. If Max-Heap is empty, break. Otherwise w += maxHeap.poll()."
        ],
        "starterCode": "class Solution {\n    public int findMaximizedCapital(int k, int w, int[] profits, int[] capital) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "50.8%",
            "submissionsCount": 920,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "kth-smallest-element-in-a-sorted-matrix",
        "title": "Kth Smallest Element in a Sorted Matrix",
        "slug": "kth-smallest-element-in-a-sorted-matrix",
        "difficulty": "Medium",
        "topic": "Heaps and Priority Queues",
        "pattern": "Merge K Sorted Structures",
        "snippet": "Given an n x n matrix where each of the rows and columns is sorted in ascending order, return the kth smallest element in the matrix.",
        "description": "<p>Given an <code>n x n</code> matrix where each of the rows and columns is sorted in ascending order, return the <code>k-th</code> smallest element in the matrix. Note that it is the kth smallest element in the sorted order, not the kth distinct element.</p>",
        "inputFormat": "An n x n 2D integer array matrix and an integer k.",
        "outputFormat": "The kth smallest integer.",
        "constraints": [
            "n == matrix.length == matrix[i].length",
            "1 <= n <= 300",
            "-10^9 <= matrix[i][j] <= 10^9",
            "All the rows and columns of matrix are guaranteed to be sorted in non-decreasing order.",
            "1 <= k <= n^2"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8",
                "expectedOutput": "13",
                "explanation": "The elements in the matrix are [1,5,9,10,11,12,13,13,15], and the 8th smallest number is 13."
            },
            {
                "id": 2,
                "input": "matrix = [[-5]], k = 1",
                "expectedOutput": "-5",
                "explanation": "Single element matrix."
            }
        ],
        "hints": [
            "Since each row is sorted, this problem is directly analogous to merging n sorted lists.",
            "Use a Min-Heap initialized with the first element of each row: (matrix[r][0], r, 0).",
            "Extract the minimum element k - 1 times. Each time an element (val, r, c) is polled, insert its right neighbor (matrix[r][c+1], r, c+1) if c + 1 < n. The k-th polled value is the answer."
        ],
        "starterCode": "class Solution {\n    public int kthSmallest(int[][] matrix, int k) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "62.1%",
            "submissionsCount": 1450,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "count-sub-islands",
        "title": "Count Sub Islands",
        "slug": "count-sub-islands",
        "difficulty": "Medium",
        "topic": "Graphs",
        "pattern": "Connected Components",
        "snippet": "You are given two m x n binary matrices grid1 and grid2. An island in grid2 is considered a sub-island if there is an island in grid1 that contains all the cells that make up this island in grid2.",
        "description": "<p>You are given two <code>m x n</code> binary matrices <code>grid1</code> and <code>grid2</code> containing only <code>0</code>'s (water) and <code>1</code>'s (land). Return the number of islands in <code>grid2</code> that are considered sub-islands.</p>",
        "inputFormat": "Two 2D integer arrays grid1 and grid2.",
        "outputFormat": "An integer count of sub-islands.",
        "constraints": [
            "m == grid1.length == grid2.length",
            "n == grid1[i].length == grid2[i].length",
            "1 <= m, n <= 500",
            "grid1[i][j] and grid2[i][j] are either 0 or 1."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "grid1 = [[1,1,1,0,0],[0,1,1,1,1],[0,0,0,0,0],[1,0,0,0,0],[1,1,0,1,1]], grid2 = [[1,1,1,0,0],[0,0,1,1,1],[0,1,0,0,0],[1,0,1,1,0],[0,1,0,1,0]]",
                "expectedOutput": "3",
                "explanation": "3 islands in grid2 are completely covered by land in grid1."
            },
            {
                "id": 2,
                "input": "grid1 = [[1,0,1,0,1],[1,1,1,1,1],[0,0,0,0,0],[1,1,1,1,1],[1,0,1,0,1]], grid2 = [[0,0,0,0,0],[1,1,1,1,1],[0,1,0,0,0],[1,0,1,1,0],[0,1,0,1,0]]",
                "expectedOutput": "2",
                "explanation": "2 valid sub-islands."
            }
        ],
        "hints": [
            "Traverse each connected component (island) in grid2 using DFS/BFS. Check whether every cell in that island is also land (1) in grid1.",
            "Launch DFS from every unvisited 1 in grid2. Sinking cells in grid2 (grid2[r][c] = 0) prevents re-visiting.",
            "Let isSub = (grid1[r][c] == 1). Traverse all 4 neighbors: isSub &= dfs(nr, nc). Only increment count if the entire component returned true."
        ],
        "starterCode": "class Solution {\n    public int countSubIslands(int[][] grid1, int[][] grid2) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "69.1%",
            "submissionsCount": 1200,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "graph-valid-tree",
        "title": "Graph Valid Tree",
        "slug": "graph-valid-tree",
        "difficulty": "Medium",
        "topic": "Graphs",
        "pattern": "Cycle Detection",
        "snippet": "Given n nodes labeled from 0 to n-1 and a list of undirected edges, determine if these edges make up a valid tree.",
        "description": "<p>Given <code>n</code> nodes labeled from <code>0</code> to <code>n - 1</code> and a list of undirected edges (each edge is a pair of nodes), write a function to check whether these edges make up a valid tree.</p>",
        "inputFormat": "An integer n and a 2D integer array edges.",
        "outputFormat": "true if the graph forms a valid tree, false otherwise.",
        "constraints": [
            "1 <= n <= 2000",
            "0 <= edges.length <= 5000",
            "edges[i].length == 2",
            "0 <= a_i, b_i < n"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]",
                "expectedOutput": "true",
                "explanation": "Forms a connected graph with no cycles."
            },
            {
                "id": 2,
                "input": "n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]",
                "expectedOutput": "false",
                "explanation": "Contains a cycle: 1-2-3-1."
            }
        ],
        "hints": [
            "A graph is a valid tree if and only if: 1. It has exactly n - 1 edges. 2. It is fully connected (no cycles).",
            "If edges.length != n - 1, return false immediately. Then use Union-Find or BFS/DFS.",
            "With Union-Find: for each edge [u, v], if find(u) == find(v), a cycle exists, return false. Union them. If loop completes, return true."
        ],
        "starterCode": "class Solution {\n    public boolean validTree(int n, int[][] edges) {\n        // Write your solution below\n\n        return false;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "48.2%",
            "submissionsCount": 1120,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "all-ancestors-of-a-node-in-a-dag",
        "title": "All Ancestors of a Node in a Directed Acyclic Graph",
        "slug": "all-ancestors-of-a-node-in-a-dag",
        "difficulty": "Medium",
        "topic": "Graphs",
        "pattern": "Topological Sorting",
        "snippet": "You are given a positive integer n representing the number of nodes of a Directed Acyclic Graph (DAG). Return a list where res[i] is the list of ancestors of node i.",
        "description": "<p>You are given a positive integer <code>n</code> representing the number of nodes of a Directed Acyclic Graph (DAG). Given a 2D integer array <code>edges</code> where <code>edges[i] = [from_i, to_i]</code>, return a list <code>res</code> where <code>res[i]</code> is the list of ancestors of the <code>i-th</code> node, sorted in ascending order.</p>",
        "inputFormat": "An integer n and a 2D integer array edges.",
        "outputFormat": "A list of lists of sorted integers.",
        "constraints": [
            "1 <= n <= 1000",
            "0 <= edges.length <= Math.min(2000, n * (n - 1) / 2)",
            "edges[i].length == 2",
            "0 <= from_i, to_i < n",
            "All pairs [from_i, to_i] are distinct.",
            "The graph is a DAG."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "n = 8, edges = [[0,3],[0,4],[1,3],[2,4],[2,7],[3,5],[3,6],[3,7],[4,6]]",
                "expectedOutput": "[[],[],[],[0,1],[0,2],[0,1,3],[0,1,2,3,4],[0,1,2,3]]",
                "explanation": "Ancestors for each node sorted ascending."
            },
            {
                "id": 2,
                "input": "n = 5, edges = [[0,1],[0,2],[0,3],[0,4],[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]",
                "expectedOutput": "[[],[0],[0,1],[0,1,2],[0,1,2,3]]",
                "explanation": "Linear dependency cascade."
            }
        ],
        "hints": [
            "Instead of searching backwards for ancestors of each node, consider reversing the perspective: DFS from each parent node i to find all descendants it can reach.",
            "Build adjacency list: parent -> children. If you start DFS from node u, every node v visited during this DFS has u as an ancestor.",
            "Iterate u from 0 to n - 1. Run DFS from u: for each reachable v != u, add u to v's ancestor list. Because u is looped in increasing order, ancestors are automatically sorted!"
        ],
        "starterCode": "class Solution {\n    public java.util.List<java.util.List<Integer>> getAncestors(int n, int[][] edges) {\n        // Write your solution below\n\n        return new java.util.ArrayList<>();\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "57.3%",
            "submissionsCount": 870,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "path-with-minimum-effort",
        "title": "Path With Minimum Effort",
        "slug": "path-with-minimum-effort",
        "difficulty": "Medium",
        "topic": "Graphs",
        "pattern": "Shortest Paths",
        "snippet": "You are a hiker preparing for an upcoming hike. A route's effort is the maximum absolute difference in heights between two consecutive cells. Find the minimum effort route.",
        "description": "<p>You are a hiker preparing for an upcoming hike. You are given <code>heights</code>, a 2D array of size <code>rows x columns</code>. A route's effort is the maximum absolute difference in heights between two consecutive cells of the route. Return the minimum effort required to travel from the top-left cell (0, 0) to the bottom-right cell (rows - 1, columns - 1).</p>",
        "inputFormat": "A 2D integer array heights.",
        "outputFormat": "An integer representing the minimum effort.",
        "constraints": [
            "rows == heights.length",
            "columns == heights[i].length",
            "1 <= rows, columns <= 100",
            "1 <= heights[i][j] <= 10^6"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "heights = [[1,2,2],[3,8,2],[5,3,5]]",
                "expectedOutput": "2",
                "explanation": "Route [1,1] -> [1,2] -> [2,2] -> [3,2] -> [3,3] has maximum consecutive difference of 2."
            },
            {
                "id": 2,
                "input": "heights = [[1,2,3],[3,8,4],[5,3,5]]",
                "expectedOutput": "1",
                "explanation": "Route has maximum consecutive difference of 1."
            }
        ],
        "hints": [
            "This is a shortest path problem where path cost is defined as max(edge_weights) rather than sum(edge_weights).",
            "Use Dijkstra's algorithm with a Min-Heap storing [effort, row, col].",
            "Initialize dist matrix with infinity, dist[0][0] = 0. Extract min-effort cell, relax 4 neighbors: nextEffort = Math.max(effort, Math.abs(heights[nr][nc] - heights[r][c])). Push if nextEffort < dist[nr][nc]."
        ],
        "starterCode": "class Solution {\n    public int minimumEffortPath(int[][] heights) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "59.2%",
            "submissionsCount": 1340,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "maximum-units-on-a-truck",
        "title": "Maximum Units on a Truck",
        "slug": "maximum-units-on-a-truck",
        "difficulty": "Easy",
        "topic": "Greedy Algorithms",
        "pattern": "Local Optimal Choices",
        "snippet": "You are assigned to put some amount of boxes onto one truck. Find the maximum total number of units that can be put on the truck.",
        "description": "<p>You are assigned to put some amount of boxes onto one truck. You are given a 2D array <code>boxTypes</code>, where <code>boxTypes[i] = [numberOfBoxes_i, numberOfUnitsPerBox_i]</code>. You are also given an integer <code>truckSize</code>, which is the maximum number of boxes that can be put on the truck. Return the maximum total number of units that can be put on the truck.</p>",
        "inputFormat": "A 2D integer array boxTypes and an integer truckSize.",
        "outputFormat": "An integer representing the maximum total units.",
        "constraints": [
            "1 <= boxTypes.length <= 1000",
            "1 <= numberOfBoxes_i, numberOfUnitsPerBox_i <= 1000",
            "1 <= truckSize <= 10^6"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "boxTypes = [[1,3],[2,2],[3,1]], truckSize = 4",
                "expectedOutput": "8",
                "explanation": "Pick 1 box of 3 units, 2 boxes of 2 units, and 1 box of 1 unit. Total = 3 + 4 + 1 = 8."
            },
            {
                "id": 2,
                "input": "boxTypes = [[5,10],[2,5],[4,7],[3,9]], truckSize = 10",
                "expectedOutput": "91",
                "explanation": "Greedily take the highest-unit boxes first."
            }
        ],
        "hints": [
            "To maximize total units, prioritize boxes that contain the greatest number of units per box (Fractional Knapsack greedy principle).",
            "Sort boxTypes descending by numberOfUnitsPerBox.",
            "Iterate through sorted box types: take takeBoxes = Math.min(truckSize, box[0]). Add takeBoxes * box[1] to totalUnits and decrement truckSize -= takeBoxes. Stop when truckSize == 0."
        ],
        "starterCode": "class Solution {\n    public int maximumUnits(int[][] boxTypes, int truckSize) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "74.1%",
            "submissionsCount": 1560,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "triangle",
        "title": "Triangle",
        "slug": "triangle",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "pattern": "Grid DP",
        "snippet": "Given a triangle array, return the minimum path sum from top to bottom. For each step, you may move to an adjacent number of the row below.",
        "description": "<p>Given a <code>triangle</code> array, return the minimum path sum from top to bottom. For each step, you may move to an adjacent number of the row below. More formally, if you are on index <code>i</code> on the current row, you may move to either index <code>i</code> or index <code>i + 1</code> on the next row.</p>",
        "inputFormat": "A list of lists of integers representing a triangle.",
        "outputFormat": "An integer representing the minimum path sum.",
        "constraints": [
            "1 <= triangle.length <= 200",
            "triangle[0].length == 1",
            "triangle[i].length == triangle[i - 1].length + 1",
            "-10^4 <= triangle[i][j] <= 10^4"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]",
                "expectedOutput": "11",
                "explanation": "Path: 2 -> 3 -> 5 -> 1. Sum = 11."
            },
            {
                "id": 2,
                "input": "triangle = [[-10]]",
                "expectedOutput": "-10",
                "explanation": "Single element triangle."
            }
        ],
        "hints": [
            "Bottom-up DP is cleaner than top-down because the answer naturally converges to the top cell (0, 0) without needing a min across the base.",
            "Start from the second to last row and work upwards to row 0.",
            "Recurrence: dp[j] = triangle.get(row).get(j) + Math.min(dp[j], dp[j + 1]). Using a 1D array of size N gives O(N) auxiliary space."
        ],
        "starterCode": "class Solution {\n    public int minimumTotal(java.util.List<java.util.List<Integer>> triangle) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "56.4%",
            "submissionsCount": 1520,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "n-th-tribonacci-number",
        "title": "N-th Tribonacci Number",
        "slug": "n-th-tribonacci-number",
        "difficulty": "Easy",
        "topic": "Dynamic Programming",
        "pattern": "Memoization and Tabulation",
        "snippet": "The Tribonacci sequence Tn is defined as: T0 = 0, T1 = 1, T2 = 1, and Tn+3 = Tn + Tn+1 + Tn+2 for n >= 0. Given n, return the value of Tn.",
        "description": "<p>The Tribonacci sequence Tn is defined as: <code>T0 = 0, T1 = 1, T2 = 1</code>, and <code>Tn+3 = Tn + Tn+1 + Tn+2</code> for <code>n >= 0</code>. Given <code>n</code>, return the value of <code>Tn</code>.</p>",
        "inputFormat": "An integer n.",
        "outputFormat": "The n-th Tribonacci number.",
        "constraints": [
            "0 <= n <= 37",
            "The answer is guaranteed to fit within a 32-bit integer, ie. answer <= 2^31 - 1."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "n = 4",
                "expectedOutput": "4",
                "explanation": "T_3 = 0 + 1 + 1 = 2, T_4 = 1 + 1 + 2 = 4."
            },
            {
                "id": 2,
                "input": "n = 25",
                "expectedOutput": "1389537",
                "explanation": "Value calculated by 25 iterations."
            }
        ],
        "hints": [
            "This is an extension of Fibonacci with three recurrence terms: T(n) = T(n-1) + T(n-2) + T(n-3).",
            "Base cases: n == 0 return 0; n == 1 or n == 2 return 1.",
            "Use three accumulator variables: a = 0, b = 1, c = 1. In a loop from 3 to n, next = a + b + c, shift a = b, b = c, c = next. Return c. Space complexity is O(1)."
        ],
        "starterCode": "class Solution {\n    public int tribonacci(int n) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "64.3%",
            "submissionsCount": 1750,
            "isProvisional": true
        },
        "isPremium": false
    },
    {
        "id": "segment-tree-range-sum",
        "title": "Range Sum Query - Mutable",
        "slug": "segment-tree-range-sum",
        "difficulty": "Hard",
        "topic": "Arrays",
        "pattern": "Prefix Sum",
        "snippet": "Given an integer array nums, handle multiple queries of updating array elements and calculating the sum of elements between indices left and right.",
        "description": "<p>Given an integer array <code>nums</code>, design a data structure that can handle multiple queries of updating an element at index <code>i</code> to a new value <code>val</code>, and querying the sum of elements between indices <code>left</code> and <code>right</code> inclusive. Both update and range sum queries must run in logarithmic time.</p>",
        "inputFormat": "An array of integers nums and query operations.",
        "outputFormat": "Results of range sum queries.",
        "constraints": [
            "1 <= nums.length <= 3 * 10^4",
            "-100 <= nums[i] <= 100",
            "0 <= index < nums.length",
            "0 <= left <= right < nums.length",
            "At most 3 * 10^4 calls will be made to update and sumRange."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [1, 3, 5], sumRange(0, 2), update(1, 2), sumRange(0, 2)",
                "expectedOutput": "[9, 8]",
                "explanation": "Initial sum of [1, 3, 5] is 9. After updating index 1 to 2, array is [1, 2, 5], sum is 8."
            },
            {
                "id": 2,
                "input": "nums = [7, 2, 7, 2, 0], update(4, 6), update(0, 2), update(0, 9), sumRange(4, 4)",
                "expectedOutput": "[6]",
                "explanation": "After updates, element at index 4 is 6."
            }
        ],
        "hints": [
            "A naive prefix sum array allows O(1) queries but requires O(N) time for every point update. A standard array allows O(1) updates but O(N) queries.",
            "Use a Segment Tree or a Binary Indexed Tree (Fenwick Tree) to achieve both O(log N) point updates and O(log N) range queries.",
            "Construct a tree array of size 4*N. For sumRange, query overlapping intervals. For update, recursively traverse to leaf node, update value, and re-sum internal parents."
        ],
        "starterCode": "class Solution {\n    public int[] processRangeQueries(int[] nums, int[][] queries) {\n        // Write your solution below\n\n        return new int[0];\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "40.8%",
            "submissionsCount": 2450,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "word-search-ii",
        "title": "Word Search II",
        "slug": "word-search-ii",
        "difficulty": "Hard",
        "topic": "Recursion and Backtracking",
        "pattern": "Constraint-Based Backtracking",
        "snippet": "Given an m x n board of characters and a list of strings words, return all words on the board.",
        "description": "<p>Given an <code>m x n</code> <code>board</code> of characters and a list of strings <code>words</code>, return all words on the board. Each word must be constructed from letters of sequentially adjacent cells (horizontally or vertically neighboring). The same letter cell may not be used more than once in a word.</p>",
        "inputFormat": "A 2D char array board and an array of String words.",
        "outputFormat": "A List of all matching words found on the board.",
        "constraints": [
            "m == board.length",
            "n == board[i].length",
            "1 <= m, n <= 12",
            "board[i][j] is a lowercase English letter",
            "1 <= words.length <= 3 * 10^4",
            "1 <= words[i].length <= 10"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "board = [['o','a','a','n'],['e','t','a','e'],['i','h','k','r'],['i','f','l','v']], words = ['oath','pea','eat','rain']",
                "expectedOutput": "['eat','oath']",
                "explanation": "Both 'eat' and 'oath' can be formed by adjacent cells."
            },
            {
                "id": 2,
                "input": "board = [['a','b'],['c','d']], words = ['abcb']",
                "expectedOutput": "[]",
                "explanation": "No valid path forms 'abcb' without reusing cell 'b'."
            }
        ],
        "hints": [
            "Searching each word individually across the entire grid leads to excessive repeated traversals. Instead, search all words simultaneously.",
            "Build a Prefix Tree (Trie) containing all words in the dictionary. Then perform DFS starting from each board cell, advancing through the Trie nodes simultaneously.",
            "When a Trie node marks the end of a word, add it to the result set and clear the word mark to prevent duplicate additions. Backtrack cell visits using an in-place character mask (e.g. board[r][c] = '#'). Prune exhausted Trie branches to optimize runtime."
        ],
        "starterCode": "class Solution {\n    public java.util.List<String> findWords(char[][] board, String[] words) {\n        // Write your solution below\n\n        return new java.util.ArrayList<>();\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "36.2%",
            "submissionsCount": 3120,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "longest-duplicate-substring",
        "title": "Longest Duplicate Substring",
        "slug": "longest-duplicate-substring",
        "difficulty": "Hard",
        "topic": "Strings",
        "pattern": "String Matching",
        "snippet": "Given a string s, consider all duplicated substrings: substrings of s that occur 2 or more times. Return any duplicated substring that has the longest possible length.",
        "description": "<p>Given a string <code>s</code>, consider all duplicated substrings: substrings of <code>s</code> that occur 2 or more times. The occurrences may overlap. Return any duplicated substring that has the longest possible length. If <code>s</code> does not have a duplicated substring, return <code>\"\"</code>.</p>",
        "inputFormat": "A string s consisting of lowercase English letters.",
        "outputFormat": "A string representing the longest duplicate substring.",
        "constraints": [
            "2 <= s.length <= 3 * 10^4",
            "s consists of lowercase English letters."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "s = 'banana'",
                "expectedOutput": "'ana'",
                "explanation": "'ana' appears at index 1 and index 3."
            },
            {
                "id": 2,
                "input": "s = 'abcd'",
                "expectedOutput": "''",
                "explanation": "No duplicate substrings exist in s."
            }
        ],
        "hints": [
            "If a duplicate substring of length L exists, duplicate substrings of any length less than L must also exist. This monotonic property allows binary search on the length.",
            "Binary search for the length L between 1 and s.length - 1. For a fixed length L, use Rabin-Karp rolling hash to detect whether any substring of length L appears at least twice in O(N) time.",
            "Compute hash of window using polynomial rolling hash modulo a large prime (e.g., 2^63 - 1 or dual modulos 10^9+7 and 10^9+9) to minimize hash collisions. Maintain a HashSet of computed hashes. Return the longest candidate found."
        ],
        "starterCode": "class Solution {\n    public String longestDupSubstring(String s) {\n        // Write your solution below\n\n        return \"\";\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "31.4%",
            "submissionsCount": 2890,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "count-of-smaller-numbers-after-self",
        "title": "Count of Smaller Numbers After Self",
        "slug": "count-of-smaller-numbers-after-self",
        "difficulty": "Hard",
        "topic": "Binary Search",
        "pattern": "Binary Search on Answer",
        "snippet": "Given an integer array nums, return an integer array counts where counts[i] is the number of smaller elements to the right of nums[i].",
        "description": "<p>Given an integer array <code>nums</code>, return an integer array <code>counts</code> where <code>counts[i]</code> is the number of smaller elements to the right of <code>nums[i]</code>.</p>",
        "inputFormat": "An integer array nums.",
        "outputFormat": "A List of integers representing counts of smaller elements to the right.",
        "constraints": [
            "1 <= nums.length <= 10^5",
            "-10^4 <= nums[i] <= 10^4"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [5,2,6,1]",
                "expectedOutput": "[2,1,1,0]",
                "explanation": "To the right of 5: 2 and 1 (2 smaller). Right of 2: 1 (1 smaller). Right of 6: 1 (1 smaller). Right of 1: none (0 smaller)."
            },
            {
                "id": 2,
                "input": "nums = [-1]",
                "expectedOutput": "[0]",
                "explanation": "Single element array has 0 elements to its right."
            }
        ],
        "hints": [
            "Traverse the array from right to left. At each element nums[i], count how many numbers previously processed are strictly smaller than nums[i].",
            "Coordinate compress the numbers and maintain a Fenwick Tree (Binary Indexed Tree) or use Merge Sort with index tracking to count inversions.",
            "Using BIT: rank each unique value from 1 to K. For each number from right to left, query prefix sum in BIT up to rank(nums[i]) - 1, record the count, then update BIT at rank(nums[i]) with +1."
        ],
        "starterCode": "class Solution {\n    public java.util.List<Integer> countSmaller(int[] nums) {\n        // Write your solution below\n\n        return new java.util.ArrayList<>();\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "42.5%",
            "submissionsCount": 3410,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "critical-connections-in-a-network",
        "title": "Critical Connections in a Network",
        "slug": "critical-connections-in-a-network",
        "difficulty": "Hard",
        "topic": "Graphs",
        "pattern": "DFS",
        "snippet": "There are n servers numbered from 0 to n - 1 connected by undirected server-to-server connections. Return all critical connections in the network.",
        "description": "<p>There are <code>n</code> servers numbered from <code>0</code> to <code>n - 1</code> connected by undirected server-to-server <code>connections</code> forming a network. A critical connection is a connection that, if removed, will make some servers unable to reach some other server. Return all critical connections in the network in any order.</p>",
        "inputFormat": "An integer n and a List of undirected edges connections.",
        "outputFormat": "A List of edges [u, v] representing bridges.",
        "constraints": [
            "2 <= n <= 10^5",
            "n - 1 <= connections.length <= 10^5",
            "0 <= u, v <= n - 1",
            "u != v",
            "There are no repeated connections.",
            "The network is connected."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "n = 4, connections = [[0,1],[1,2],[2,0],[1,3]]",
                "expectedOutput": "[[1,3]]",
                "explanation": "[[1,3]] is the only critical connection because removing [0,1], [1,2], or [2,0] still leaves the triangle 0-1-2 connected."
            },
            {
                "id": 2,
                "input": "n = 2, connections = [[0,1]]",
                "expectedOutput": "[[0,1]]",
                "explanation": "Removing [0,1] disconnects servers 0 and 1."
            }
        ],
        "hints": [
            "A critical connection in an undirected connected graph is also known as a 'bridge'. Bridges are edges that do not belong to any cycle.",
            "Use Tarjan's Bridge-Finding Algorithm based on Depth-First Search with discovery time and lowest reachable timestamp arrays (tin and low).",
            "Track timer during DFS. For edge (u, v): if v is parent, continue; if v is already visited, low[u] = Math.min(low[u], tin[v]); if unvisited, recurse on v, low[u] = Math.min(low[u], low[v]). If low[v] > tin[u], then edge (u, v) is a bridge."
        ],
        "starterCode": "class Solution {\n    public java.util.List<java.util.List<Integer>> criticalConnections(int n, java.util.List<java.util.List<Integer>> connections) {\n        // Write your solution below\n\n        return new java.util.ArrayList<>();\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "55.3%",
            "submissionsCount": 3890,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "burst-balloons",
        "title": "Burst Balloons",
        "slug": "burst-balloons",
        "difficulty": "Hard",
        "topic": "Dynamic Programming",
        "pattern": "2D DP",
        "snippet": "You are given n balloons, indexed from 0 to n - 1. Return the maximum coins you can collect by bursting the balloons wisely.",
        "description": "<p>You are given <code>n</code> balloons, indexed from <code>0</code> to <code>n - 1</code>. Each balloon is painted with a number on it represented by an array <code>nums</code>. You are asked to burst all the balloons. If you burst balloon <code>i</code>, you will get <code>nums[i - 1] * nums[i] * nums[i + 1]</code> coins. Return the maximum coins you can collect by bursting the balloons wisely.</p>",
        "inputFormat": "An integer array nums.",
        "outputFormat": "A 32-bit integer representing the maximum collected coins.",
        "constraints": [
            "n == nums.length",
            "1 <= n <= 300",
            "0 <= nums[i] <= 100"
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [3,1,5,8]",
                "expectedOutput": "167",
                "explanation": "Optimal order: burst 1, then 5, then 3, then 8. Coins: (3*1*5) + (3*5*8) + (1*3*8) + (1*8*1) = 15 + 120 + 24 + 8 = 167."
            },
            {
                "id": 2,
                "input": "nums = [1,5]",
                "expectedOutput": "10",
                "explanation": "Burst 1 then 5: (1*1*5) + (1*5*1) = 5 + 5 = 10."
            }
        ],
        "hints": [
            "Thinking about which balloon to burst FIRST divides the remaining array into dependent subarrays because adjacent neighbors shift. Instead, think about which balloon to burst LAST in an interval.",
            "If balloon k is burst LAST in interval [i, j], then its neighbors when it bursts are guaranteed to be nums[i-1] and nums[j+1]. This decouples the subproblems [i, k-1] and [k+1, j].",
            "Pad nums with 1 at both boundaries: padded = [1, ...nums, 1]. Define dp[i][j] as max coins from bursting all balloons strictly between i and j. Recurrence: dp[i][j] = max(dp[i][k] + dp[k][j] + padded[i] * padded[k] * padded[j]) for k from i+1 to j-1."
        ],
        "starterCode": "class Solution {\n    public int maxCoins(int[] nums) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "58.1%",
            "submissionsCount": 4120,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "single-number-ii",
        "title": "Single Number II",
        "slug": "single-number-ii",
        "difficulty": "Medium",
        "topic": "Hashing",
        "pattern": "Duplicate Detection",
        "snippet": "Given an integer array nums where every element appears three times except for one, which appears exactly once. Find the single element.",
        "description": "<p>Given an integer array <code>nums</code> where every element appears three times except for one, which appears exactly once. Find the single element and return it. You must implement a solution with a linear runtime complexity and use only constant extra space.</p>",
        "inputFormat": "An integer array nums.",
        "outputFormat": "The single integer appearing exactly once.",
        "constraints": [
            "1 <= nums.length <= 3 * 10^4",
            "-2^31 <= nums[i] <= 2^31 - 1",
            "Each element in nums appears exactly three times except for one element which appears once."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "nums = [2,2,3,2]",
                "expectedOutput": "3",
                "explanation": "3 appears once, 2 appears three times."
            },
            {
                "id": 2,
                "input": "nums = [0,1,0,1,0,1,99]",
                "expectedOutput": "99",
                "explanation": "99 appears once, 0 and 1 appear three times."
            }
        ],
        "hints": [
            "If every element appears 3 times, summing the i-th bit across all numbers will yield a multiple of 3 if the single number has bit 0, or (3*k + 1) if it has bit 1.",
            "Iterate through all 32 bit positions (0 to 31). Count the number of set bits at position i across all numbers. If bitCount % 3 != 0, set the i-th bit in the result.",
            "Alternatively, design a 2-bit finite state machine using bitwise operations: ones = (ones ^ num) & ~twos; twos = (twos ^ num) & ~ones. Returns ones in O(N) time and O(1) space."
        ],
        "starterCode": "class Solution {\n    public int singleNumber(int[] nums) {\n        // Write your solution below\n\n        return 0;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "60.4%",
            "submissionsCount": 2950,
            "isProvisional": true
        },
        "isPremium": true
    },
    {
        "id": "regular-expression-matching",
        "title": "Regular Expression Matching",
        "slug": "regular-expression-matching",
        "difficulty": "Hard",
        "topic": "Dynamic Programming",
        "pattern": "2D DP",
        "snippet": "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where '.' matches any single character and '*' matches zero or more of the preceding element.",
        "description": "<p>Given an input string <code>s</code> and a pattern <code>p</code>, implement regular expression matching with support for <code>'.'</code> and <code>'*'</code> where <code>'.'</code> matches any single character and <code>'*'</code> matches zero or more of the preceding element. The matching should cover the entire input string (not partial).</p>",
        "inputFormat": "Two strings s and p.",
        "outputFormat": "A boolean: true if pattern matches s, false otherwise.",
        "constraints": [
            "1 <= s.length <= 20",
            "1 <= p.length <= 20",
            "s contains only lowercase English letters.",
            "p contains only lowercase English letters, '.', and '*'.",
            "It is guaranteed for each appearance of the character '*', there will be a previous valid character to match."
        ],
        "sampleTestCases": [
            {
                "id": 1,
                "input": "s = 'aa', p = 'a*'",
                "expectedOutput": "true",
                "explanation": "'*' means zero or more of the preceding element 'a'. Therefore, by repeating 'a' once, it becomes 'aa'."
            },
            {
                "id": 2,
                "input": "s = 'ab', p = '.*'",
                "expectedOutput": "true",
                "explanation": "'.*' means 'zero or more (*) of any character (.)'."
            }
        ],
        "hints": [
            "A character followed by '*' provides two branching possibilities: match 0 times (ignore preceding character and '*') or match 1 or more times (if preceding character matches s[i]).",
            "Use 2D Dynamic Programming. Let dp[i][j] represent whether s[0...i-1] matches p[0...j-1].",
            "Base case: dp[0][0] = true. If p[j-1] == '*', dp[i][j] = dp[i][j-2] (zero occurrences) || (matches(s[i-1], p[j-2]) && dp[i-1][j]). If characters match or p[j-1] == '.', dp[i][j] = dp[i-1][j-1]."
        ],
        "starterCode": "class Solution {\n    public boolean isMatch(String s, String p) {\n        // Write your solution below\n\n        return false;\n    }\n}",
        "provisionalStats": {
            "acceptanceRate": "28.3%",
            "submissionsCount": 4850,
            "isProvisional": true
        },
        "isPremium": true
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

        // 2b. Algorithmic Pattern filter
        if (params.pattern && params.pattern !== 'All') {
            const targetPattern = String(params.pattern).trim().toLowerCase();
            results = results.filter(p => p.pattern && p.pattern.toLowerCase() === targetPattern);
        }

        // 2c. Access filter: 'All' | 'Free' | 'Premium'
        if (params.access && params.access !== 'All') {
            const targetAccess = String(params.access).trim().toLowerCase();
            if (targetAccess === 'free') {
                results = results.filter(p => !p.isPremium);
            } else if (targetAccess === 'premium' || targetAccess === 'pro') {
                results = results.filter(p => p.isPremium);
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
        const limit = (!isNaN(rawLimit) && rawLimit > 0) ? Math.min(rawLimit, 300) : 20;
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
    },

    /**
     * Get free problems only
     */
    async getFreeProblems() {
        return {
            success: true,
            data: MOCK_PROBLEMS.filter(p => !p.isPremium)
        };
    },

    /**
     * Get premium problems only
     */
    async getPremiumProblems() {
        return {
            success: true,
            data: MOCK_PROBLEMS.filter(p => p.isPremium)
        };
    },

    /**
     * Get platform canonical statistics derived from dataset
     */
    async getStats() {
        const total = MOCK_PROBLEMS.length;
        const premium = MOCK_PROBLEMS.filter(p => p.isPremium).length;
        const free = total - premium;
        const patternSet = new Set(MOCK_PROBLEMS.map(p => p.pattern).filter(Boolean));
        return {
            success: true,
            data: {
                totalProblems: total,
                freeProblems: free,
                premiumProblems: premium,
                topicsCount: TOPICS.length,
                patternsCount: patternSet.size,
                contestsCount: 4,
                learningPathsCount: 14
            }
        };
    },

    /**
     * Get upcoming platform preview activities with realistic future dates (Nov 2026)
     */
    async getUpcomingActivities() {
        return {
            success: true,
            data: [
                {
                    id: 'act-01',
                    category: 'Contest',
                    categoryBadge: 'contest',
                    title: 'Weekly Java Bi-Weekly Contest #43',
                    date: 'Nov 8, 2026 · 18:00 UTC',
                    formattedDate: 'Saturday, Nov 8, 2026',
                    description: 'Compete in a 90-minute timed contest solving 4 algorithmic Java challenges. Open to all students.',
                    actionLabel: 'View Contests',
                    actionUrl: 'contests.html',
                    isDemoSchedule: true
                },
                {
                    id: 'act-02',
                    category: 'Practice Sprint',
                    categoryBadge: 'practice',
                    title: 'Advanced Graph Patterns Sprint: Tarjan & Dijkstra',
                    date: 'Nov 12, 2026 · 14:00 UTC',
                    formattedDate: 'Thursday, Nov 12, 2026',
                    description: 'Focused problem session targeting bridges, articulation points, and shortest paths in directed graphs.',
                    actionLabel: 'Open Practice Hub',
                    actionUrl: 'practice.html',
                    isDemoSchedule: true
                },
                {
                    id: 'act-03',
                    category: 'Curriculum',
                    categoryBadge: 'curriculum',
                    title: 'Java 17 Concurrency & Virtual Threads Module',
                    date: 'Nov 15, 2026',
                    formattedDate: 'Sunday, Nov 15, 2026',
                    description: 'New interactive lesson suite covering Project Loom virtual threads, structured concurrency, and locks.',
                    actionLabel: 'Explore Learn',
                    actionUrl: 'learn.html',
                    isDemoSchedule: true
                },
                {
                    id: 'act-04',
                    category: 'Pro Collection',
                    categoryBadge: 'pro',
                    title: 'Top 50 Pro Algorithmic Patterns Spotlight',
                    date: 'Nov 20, 2026',
                    formattedDate: 'Friday, Nov 20, 2026',
                    description: 'Curated 50-problem collection highlighting segment trees, interval DP, and advanced string hashing.',
                    actionLabel: 'Explore Pro Challenges',
                    actionUrl: 'problems.html?access=Premium',
                    isDemoSchedule: true
                }
            ]
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
        const isAuth = authMockAdapter.isAuthenticated();
        if (!isAuth) {
            return {
                success: false,
                requiresAuth: true,
                message: 'Authentication required. Submission history is reserved for registered CodeArena members.',
                data: {
                    submissions: [],
                    requiresAuth: true
                }
            };
        }

        const allRecords = getSessionSubmissions();
        const filtered = problemId
            ? allRecords.filter(r => r.problemId === problemId)
            : allRecords;

        return {
            success: true,
            requiresAuth: false,
            data: {
                submissions: filtered,
                isGuestSession: false,
                storageType: 'SESSION_AUTHENTICATED_PREVIEW',
                notice: 'Preview submission history for authenticated demo session.'
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

    async getPatterns(topic) {
        if (API_CONFIG.useMockAdapter) {
            return problemMockAdapter.getPatterns(topic);
        }
        const query = topic ? ('?topic=' + encodeURIComponent(topic)) : '';
        const res = await apiClient('/problems/patterns' + query, { method: 'GET' });
        if (!res.success && res.isNetworkFailure) {
            return problemMockAdapter.getPatterns(topic);
        }
        return res;
    },

    async getFreeProblems() {
        if (API_CONFIG.useMockAdapter) {
            return problemMockAdapter.getFreeProblems();
        }
        const res = await apiClient('/problems?access=free', { method: 'GET' });
        if (!res.success && res.isNetworkFailure) {
            return problemMockAdapter.getFreeProblems();
        }
        return res;
    },

    async getPremiumProblems() {
        if (API_CONFIG.useMockAdapter) {
            return problemMockAdapter.getPremiumProblems();
        }
        const res = await apiClient('/problems?access=premium', { method: 'GET' });
        if (!res.success && res.isNetworkFailure) {
            return problemMockAdapter.getPremiumProblems();
        }
        return res;
    },

    async getStats() {
        if (API_CONFIG.useMockAdapter) {
            return problemMockAdapter.getStats();
        }
        const res = await apiClient('/problems/stats', { method: 'GET' });
        if (!res.success && res.isNetworkFailure) {
            return problemMockAdapter.getStats();
        }
        return res;
    },

    async getUpcomingActivities() {
        if (API_CONFIG.useMockAdapter) {
            return problemMockAdapter.getUpcomingActivities();
        }
        const res = await apiClient('/platform/activities', { method: 'GET' });
        if (!res.success && res.isNetworkFailure) {
            return problemMockAdapter.getUpcomingActivities();
        }
        return res;
    },

    canAccessProblem(problemOrId) {
        if (typeof subscriptionService !== 'undefined') {
            return subscriptionService.canAccessProblem(problemOrId);
        }
        return true;
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
        subscriptionService,
        subscriptionService: subscriptionService,
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
        subscriptionService,
        models
    };
}
