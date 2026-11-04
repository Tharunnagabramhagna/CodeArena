# append_dashboard_phase6.py

css_to_append = """

/* ==========================================================================
   Phase 6: Dashboard Search Suggestions & Notification Improvements
   ========================================================================== */

.dash-search-wrapper {
  position: relative;
}

.dash-search-suggestions {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background-color: var(--color-bg-secondary, #0d1527);
  border: 1px solid var(--color-border, #1e293b);
  border-radius: 10px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6);
  z-index: 250;
  max-height: 380px;
  overflow-y: auto;
  padding: 6px;
}

.search-suggestion-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  color: var(--color-text-primary, #f8fafc);
  transition: background-color 0.15s ease;
  outline: none;
}

.search-suggestion-item:hover,
.search-suggestion-item.active,
.search-suggestion-item:focus {
  background-color: rgba(99, 102, 241, 0.15);
  color: #fff;
}

.search-suggestion-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.search-suggestion-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
}

.search-suggestion-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.search-suggestion-title {
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-suggestion-desc {
  font-size: 0.75rem;
  color: var(--color-text-muted, #94a3b8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-suggestion-badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
  text-transform: capitalize;
  flex-shrink: 0;
}

.search-badge-easy {
  background-color: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.search-badge-medium {
  background-color: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.search-badge-hard {
  background-color: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.search-badge-page {
  background-color: rgba(99, 102, 241, 0.15);
  color: #818cf8;
}

.search-empty-state {
  padding: 16px;
  text-align: center;
  color: var(--color-text-muted, #94a3b8);
  font-size: 0.85rem;
}

.search-empty-link {
  display: inline-block;
  margin-top: 8px;
  color: var(--color-primary, #6366f1);
  font-weight: 500;
  text-decoration: none;
}

.search-empty-link:hover {
  text-decoration: underline;
}

.notif-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background-color: #ef4444;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.notif-tabs {
  display: flex;
  border-bottom: 1px solid var(--color-border);
  padding: 0 12px;
  gap: 8px;
}

.notif-tab-btn {
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--color-text-muted);
  font-size: 0.78rem;
  font-weight: 600;
  padding: 8px 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.notif-tab-btn.active {
  color: var(--color-primary, #6366f1);
  border-bottom-color: var(--color-primary, #6366f1);
}

.notif-item {
  padding: 10px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background-color 0.15s ease;
}

.notif-item.unread {
  background-color: rgba(99, 102, 241, 0.08);
}

.notif-item-title {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 3px;
}

.notif-item-desc {
  font-size: 0.74rem;
  color: var(--color-text-muted);
  line-height: 1.35;
}

.notif-item-time {
  font-size: 0.68rem;
  color: var(--color-text-muted);
  margin-top: 4px;
}

.notif-footer-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: rgba(0, 0, 0, 0.15);
  border-top: 1px solid var(--color-border);
}

.notif-action-link {
  background: transparent;
  border: none;
  font-size: 0.72rem;
  color: var(--color-primary, #6366f1);
  cursor: pointer;
  padding: 2px 4px;
}

.notif-action-link:hover {
  text-decoration: underline;
}
"""

with open('frontend/css/dashboard.css', 'r', encoding='utf-8') as f:
    content = f.read()

if 'Phase 6: Dashboard Search Suggestions' not in content:
    with open('frontend/css/dashboard.css', 'a', encoding='utf-8') as f:
        f.write(css_to_append)
    print("Appended Phase 6 dashboard styles.")
else:
    print("Phase 6 dashboard styles already present.")

