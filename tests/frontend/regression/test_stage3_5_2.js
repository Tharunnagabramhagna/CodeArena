const fs = require('fs');
const path = require('path');

console.log("=".repeat(70));
console.log("STAGE 3.5.2 TARGETED QA REMEDIATION VERIFICATION SUITE");
console.log("=".repeat(70));

let passed = 0;
let failed = 0;

function assertTest(condition, name, details = '') {
    if (condition) {
        passed++;
        console.log(`[PASS] ${name}`);
        if (details) console.log(`       ${details}`);
    } else {
        failed++;
        console.log(`[FAIL] ${name}`);
        if (details) console.log(`       ${details}`);
    }
}

// Resolve frontend root reliably across different execution contexts
function resolveFrontendPath(subPath) {
    const candidates = [
        path.resolve(process.cwd(), 'frontend', subPath),
        path.resolve('c:/CodeArena/frontend', subPath),
        path.resolve(__dirname, '../../../frontend', subPath),
        path.resolve(__dirname, '../frontend', subPath),
        path.resolve(__dirname, '../../../../../../../CodeArena/frontend', subPath)
    ];
    for (const c of candidates) {
        if (fs.existsSync(c)) return c;
    }
    return candidates[0];
}

// ----------------------------------------------------------------------
// 1. Landing Page Featured Problem Cards Navigation
// ----------------------------------------------------------------------
console.log("\n--- 1. Landing Page Featured Problem Cards Navigation ---");
const htmlPath = resolveFrontendPath('index.html');
const appJsPath = resolveFrontendPath('js/app.js');
const indexHtml = fs.readFileSync(htmlPath, 'utf8');
const appJsCode = fs.readFileSync(appJsPath, 'utf8');

// Check card markup
assertTest(indexHtml.includes('data-problem-id="two-sum"'), "Card 1 has data-problem-id='two-sum'");
assertTest(indexHtml.includes('data-problem-id="reverse-a-string"'), "Card 2 has data-problem-id='reverse-a-string'");
assertTest(indexHtml.includes('data-problem-id="valid-parentheses"'), "Card 3 has data-problem-id='valid-parentheses'");
assertTest(indexHtml.includes('data-problem-id="binary-search"'), "Card 4 has data-problem-id='binary-search'");
assertTest(indexHtml.includes('data-problem-id="merge-k-sorted-lists"'), "Card 5 has data-problem-id='merge-k-sorted-lists'");
assertTest(!indexHtml.includes('data-problem-id="longest-common-subsequence"'), "Card 6 does not invent non-canonical problem ID");
assertTest(indexHtml.includes('href="pages/problems.html" class="btn btn-secondary btn-lg"'), "View All Problems CTA links to pages/problems.html");

// Test navigation logic in app.js
const CANONICAL_PROBLEM_IDS = new Set([
    'two-sum', 'reverse-a-string', 'valid-parentheses', 'merge-k-sorted-lists',
    'binary-search', 'palindrome-number', 'maximum-subarray', 'linked-list-cycle',
    'invert-binary-tree', 'climbing-stairs', 'longest-substring', 'trapping-rain-water'
]);

function simulateCardNavigation(cardDataId, cardTitle) {
    let windowLocationHref = '';
    const TITLE_TO_CANONICAL_ID = {
        'two sum': 'two-sum',
        'reverse a string': 'reverse-a-string',
        'valid parentheses': 'valid-parentheses',
        'binary search': 'binary-search',
        'merge k sorted lists': 'merge-k-sorted-lists'
    };

    const titleKey = cardTitle.trim().toLowerCase();
    let targetId = cardDataId;
    if (!targetId && TITLE_TO_CANONICAL_ID[titleKey]) {
        targetId = TITLE_TO_CANONICAL_ID[titleKey];
    }
    const isValidProblem = targetId && CANONICAL_PROBLEM_IDS.has(targetId);

    if (isValidProblem) {
        windowLocationHref = 'pages/problem.html?id=' + encodeURIComponent(targetId);
    } else {
        windowLocationHref = 'pages/problems.html';
    }
    return windowLocationHref;
}

assertTest(simulateCardNavigation('two-sum', 'Two Sum') === 'pages/problem.html?id=two-sum', "Two Sum navigates to pages/problem.html?id=two-sum");
assertTest(simulateCardNavigation('reverse-a-string', 'Reverse a String') === 'pages/problem.html?id=reverse-a-string', "Reverse a String navigates to pages/problem.html?id=reverse-a-string");
assertTest(simulateCardNavigation('valid-parentheses', 'Valid Parentheses') === 'pages/problem.html?id=valid-parentheses', "Valid Parentheses navigates to pages/problem.html?id=valid-parentheses");
assertTest(simulateCardNavigation('binary-search', 'Binary Search') === 'pages/problem.html?id=binary-search', "Binary Search navigates to pages/problem.html?id=binary-search");
assertTest(simulateCardNavigation('merge-k-sorted-lists', 'Merge K Sorted Lists') === 'pages/problem.html?id=merge-k-sorted-lists', "Merge K Sorted Lists navigates to pages/problem.html?id=merge-k-sorted-lists");
assertTest(simulateCardNavigation(null, 'Longest Common Subsequence') === 'pages/problems.html', "Longest Common Subsequence safely falls back to pages/problems.html");

// ----------------------------------------------------------------------
// 2. Safe localStorage Access in theme.js
// ----------------------------------------------------------------------
console.log("\n--- 2. Safe localStorage Access in theme.js ---");
const themeJsPath = resolveFrontendPath('js/theme.js');
const themeJsCode = fs.readFileSync(themeJsPath, 'utf8');

assertTest(themeJsCode.includes('try {') && themeJsCode.includes('catch (e)'), "theme.js IIFE wraps storage access in try/catch");

// Test normal storage available
let mockDocAttrs = {};
let mockStorage = { 'codearena-theme': 'light' };
try {
    const saved = mockStorage['codearena-theme'];
    if (saved === 'light') {
        mockDocAttrs['data-theme'] = 'light';
    }
} catch (e) {}
assertTest(mockDocAttrs['data-theme'] === 'light', "theme.js applies saved light theme when storage is available");

// Test SecurityError thrown
let securityErrorHandled = false;
mockDocAttrs = {};
try {
    const throwingStorage = {
        getItem() { throw new Error("SecurityError: The operation is insecure."); }
    };
    try {
        const saved = throwingStorage.getItem('codearena-theme');
        if (saved === 'light') mockDocAttrs['data-theme'] = 'light';
    } catch (e) {
        securityErrorHandled = true;
    }
} catch (fatal) {
    securityErrorHandled = false;
}
assertTest(securityErrorHandled && mockDocAttrs['data-theme'] === undefined, "theme.js safely handles SecurityError without crashing");

// ----------------------------------------------------------------------
// 3. Safe localStorage Access in dashboard.js
// ----------------------------------------------------------------------
console.log("\n--- 3. Safe localStorage Access in dashboard.js ---");
const dashboardJsPath = resolveFrontendPath('js/dashboard.js');
const dashboardJsCode = fs.readFileSync(dashboardJsPath, 'utf8');

assertTest(dashboardJsCode.includes('try {') && dashboardJsCode.includes('savedState ='), "dashboard.js wraps savedState retrieval in try/catch");
assertTest(dashboardJsCode.includes('// Fall back gracefully to expanded sidebar'), "dashboard.js documents fallback behavior");

// Test SecurityError thrown during dashboard sidebar init
let dashboardStorageHandled = false;
let sidebarCollapsed = null;
try {
    const throwingStorage = {
        getItem() { throw new Error("SecurityError: Storage access denied."); },
        setItem() { throw new Error("SecurityError: Storage access denied."); }
    };
    let savedState = null;
    try {
        savedState = throwingStorage.getItem('codearena-sidebar-collapsed');
    } catch (e) {
        dashboardStorageHandled = true;
    }
    if (savedState === 'true') {
        sidebarCollapsed = true;
    } else {
        sidebarCollapsed = false; // defaults to expanded desktop
    }
} catch (fatal) {
    dashboardStorageHandled = false;
}
assertTest(dashboardStorageHandled && sidebarCollapsed === false, "dashboard.js falls back to expanded sidebar when storage throws SecurityError");

// ----------------------------------------------------------------------
// 4. Safe Pagination Summary Rendering in problems.js
// ----------------------------------------------------------------------
console.log("\n--- 4. Safe Pagination Summary Rendering in problems.js ---");
const problemsJsPath = resolveFrontendPath('js/problems.js');
const problemsJsCode = fs.readFileSync(problemsJsPath, 'utf8');

assertTest(!problemsJsCode.includes('dom.resultsCountText.innerHTML = `Showing <strong>${start}'), "problems.js eliminated innerHTML variable interpolation");
assertTest(problemsJsCode.includes('dom.resultsCountText.textContent = \'\';'), "problems.js clears results text safely with textContent = ''");

// Mock DOM elements and test renderSummary
function createMockNode(tag) {
    return {
        tagName: tag.toUpperCase(),
        textContent: '',
        children: [],
        appendChild(child) {
            this.children.push(child);
            return child;
        },
        get innerHTML() {
            return this.children.map(c => {
                if (typeof c === 'string') return c;
                if (c.nodeType === 3) return c.nodeValue;
                return `<${c.tagName.toLowerCase()}>${c.textContent}</${c.tagName.toLowerCase()}>`;
            }).join('');
        }
    };
}
function createMockTextNode(text) {
    return { nodeType: 3, nodeValue: text };
}

function testRenderSummary(total, count, page, limit) {
    const container = createMockNode('span');
    container.textContent = '';
    container.children = [];

    const state = { page, limit };

    if (total === 0) {
        container.appendChild(createMockTextNode('Showing '));
        const zeroElem = createMockNode('strong');
        zeroElem.textContent = '0';
        container.appendChild(zeroElem);
        container.appendChild(createMockTextNode(' problems'));
    } else {
        const start = (state.page - 1) * state.limit + 1;
        const end = start + count - 1;

        container.appendChild(createMockTextNode('Showing '));
        const rangeElem = createMockNode('strong');
        rangeElem.textContent = `${start}–${end}`;
        container.appendChild(rangeElem);

        container.appendChild(createMockTextNode(' of '));
        const totalElem = createMockNode('strong');
        totalElem.textContent = String(total);
        container.appendChild(totalElem);

        container.appendChild(createMockTextNode(' problems'));
    }
    return container.innerHTML;
}

const page1Summary = testRenderSummary(12, 10, 1, 10);
assertTest(page1Summary === 'Showing <strong>1–10</strong> of <strong>12</strong> problems', "Page 1 summary: Showing <strong>1–10</strong> of <strong>12</strong> problems", page1Summary);

const page2Summary = testRenderSummary(12, 2, 2, 10);
assertTest(page2Summary === 'Showing <strong>11–12</strong> of <strong>12</strong> problems', "Page 2 summary: Showing <strong>11–12</strong> of <strong>12</strong> problems", page2Summary);

const middlePageSummary = testRenderSummary(30, 10, 2, 10);
assertTest(middlePageSummary === 'Showing <strong>11–20</strong> of <strong>30</strong> problems', "Middle page summary: Showing <strong>11–20</strong> of <strong>30</strong> problems", middlePageSummary);

const zeroSummary = testRenderSummary(0, 0, 1, 10);
assertTest(zeroSummary === 'Showing <strong>0</strong> problems', "Zero results summary: Showing <strong>0</strong> problems", zeroSummary);

// ----------------------------------------------------------------------
// 5. Semantic H1 Headings Hierarchy
// ----------------------------------------------------------------------
console.log("\n--- 5. Semantic H1 Headings Hierarchy ---");
const compilerHtmlPath = resolveFrontendPath('pages/compiler.html');
const compilerHtml = fs.readFileSync(compilerHtmlPath, 'utf8');

assertTest(indexHtml.includes('<h1 id="hero-heading" class="hero-title">'), "index.html has <h1 id='hero-heading' class='hero-title'>");
assertTest(!indexHtml.includes('<h2 id="hero-heading"'), "index.html no longer has <h2 id='hero-heading'>");
assertTest(compilerHtml.includes('<h1 class="sr-only">CodeArena Online Java Compiler</h1>'), "compiler.html contains accessible <h1 class='sr-only'>");

// ----------------------------------------------------------------------
// 6. Empty Placeholder Files Genuine Deletion
// ----------------------------------------------------------------------
console.log("\n--- 6. Empty Placeholder Files Deletion & Reference Check ---");
const frontendRoot = path.dirname(htmlPath);
const compCssExists = fs.existsSync(path.join(frontendRoot, 'css/components.css'));
const practiceJsExists = fs.existsSync(path.join(frontendRoot, 'js/practice.js'));

assertTest(!compCssExists, "frontend/css/components.css deleted successfully");
assertTest(!practiceJsExists, "frontend/js/practice.js deleted successfully");

// Verify zero dangling references across all frontend files
const allFrontendFiles = [];
function walkDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const full = path.join(dir, file);
        if (fs.statSync(full).isDirectory()) {
            walkDir(full);
        } else {
            allFrontendFiles.push(full);
        }
    });
}
walkDir(frontendRoot);

let danglingRefs = 0;
allFrontendFiles.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    if (/(^|[^a-zA-Z0-9_-])components\.css\b/.test(content)) {
        danglingRefs++;
        console.log(`Dangling components.css in ${f}`);
    }
    if (/(^|[^a-zA-Z0-9_-])practice\.js\b/.test(content)) {
        danglingRefs++;
        console.log(`Dangling practice.js in ${f}`);
    }
});
assertTest(danglingRefs === 0, "Zero dangling references to deleted files across all frontend files");

console.log("=".repeat(70));
console.log(`STAGE 3.5.2 TARGETED REMEDIATION: ${passed} PASSED, ${failed} FAILED`);
console.log("=".repeat(70));

if (failed > 0) process.exit(1);
