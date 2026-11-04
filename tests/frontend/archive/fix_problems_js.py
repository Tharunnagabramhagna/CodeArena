# fix_problems_js.py
with open('frontend/js/problems.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """    function renderTable(problems, startNumber) {
        if (!dom.tableBody) return;
        dom.tableBody.innerHTML = '';

        problems.forEach(function (problem, index) {"""

replacement = """    function renderTable(problems, startNumber) {
        if (!dom.tableBody) return;
        dom.tableBody.innerHTML = '';

        let bookmarkedIds = [];
        try {
            const bmRaw = localStorage.getItem('codearena_guest_bookmarks');
            if (bmRaw) {
                const parsed = JSON.parse(bmRaw);
                if (Array.isArray(parsed)) bookmarkedIds = parsed;
            }
        } catch (e) {}

        problems.forEach(function (problem, index) {
            const isBookmarked = bookmarkedIds.includes(problem.id) || bookmarkedIds.includes(problem.slug);
            const bookmarkIconHtml = isBookmarked
                ? `<span class="catalogue-bookmark-indicator" title="Bookmarked in your challenges" style="color: #F59E0B; margin-left: 6px; font-size: 0.85rem;" aria-label="Bookmarked">🔖</span>`
                : '';"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced renderTable in problems.js")
else:
    print("Warning: target not found in problems.js")

with open('frontend/js/problems.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Saved problems.js")

