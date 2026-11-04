# replace_dash_search.py

with open('frontend/pages/dashboard.html', 'r', encoding='utf-8') as f:
    dash_html = f.read()

# Match search icon
import re
old_search_pattern = r'<span class="search-icon" aria-hidden="true">.*?</span>'
new_search = '''<span class="search-icon" aria-hidden="true">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </span>'''

dash_html, count = re.subn(old_search_pattern, new_search, dash_html, count=1)
assert count == 1, f"Expected 1 match, found {count}"

with open('frontend/pages/dashboard.html', 'w', encoding='utf-8') as f:
    f.write(dash_html)
print("dashboard.html search icon updated successfully")

with open('frontend/css/dashboard.css', 'r', encoding='utf-8') as f:
    dash_css = f.read()

old_search_css = """.search-icon {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}"""

new_search_css = """.search-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.search-icon svg {
  width: 16px;
  height: 16px;
  display: block;
}"""

assert old_search_css in dash_css, "old_search_css not found in dashboard.css"
dash_css = dash_css.replace(old_search_css, new_search_css)

with open('frontend/css/dashboard.css', 'w', encoding='utf-8') as f:
    f.write(dash_css)
print("dashboard.css search icon updated successfully")

