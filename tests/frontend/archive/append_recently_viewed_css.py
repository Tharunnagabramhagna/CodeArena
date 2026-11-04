# append_recently_viewed_css.py

css_rules = """

/* ==========================================================================
   Phase 6: Recently Viewed Problems & Catalogue Search Suggestions
   ========================================================================== */

.recently-viewed-card {
  background-color: var(--color-surface, #1e293b);
  border: 1px solid var(--color-border, #334155);
  border-radius: var(--radius-lg, 12px);
  padding: 16px 20px;
  margin-bottom: 24px;
}

.recently-viewed-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.recently-viewed-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-text, #f8fafc);
}

.btn-clear-history {
  background: transparent;
  border: none;
  font-size: 0.75rem;
  color: var(--color-text-muted, #94a3b8);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.15s ease;
}

.btn-clear-history:hover {
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
}

.recently-viewed-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}

.recently-viewed-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px 14px;
  background-color: var(--color-bg, #0f172a);
  border: 1px solid var(--color-border, #334155);
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.recently-viewed-item:hover {
  transform: translateY(-2px);
  border-color: var(--color-primary, #6366f1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.recent-item-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text, #f8fafc);
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recent-item-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 0.72rem;
}

.recent-item-topic {
  color: var(--color-text-muted, #94a3b8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.catalogue-search-wrapper {
  position: relative;
  flex: 1;
}

.catalogue-search-suggestions {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background-color: var(--color-surface, #1e293b);
  border: 1px solid var(--color-border, #334155);
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.45);
  z-index: 100;
  max-height: 280px;
  overflow-y: auto;
  padding: 4px;
}

.catalogue-suggestion-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  color: var(--color-text, #f8fafc);
  font-size: 0.85rem;
  transition: background-color 0.12s ease;
}

.catalogue-suggestion-item:hover,
.catalogue-suggestion-item.active {
  background-color: rgba(99, 102, 241, 0.15);
}
"""

for filepath in ['frontend/css/problems.css', 'frontend/css/secondary.css']:
    with open(filepath, 'r', encoding='utf-8') as f:
        c = f.read()
    if 'Recently Viewed Problems' not in c:
        with open(filepath, 'a', encoding='utf-8') as f:
            f.write(css_rules)
        print(f"Appended recently viewed CSS to {filepath}")
    else:
        print(f"Recently viewed CSS already present in {filepath}")

