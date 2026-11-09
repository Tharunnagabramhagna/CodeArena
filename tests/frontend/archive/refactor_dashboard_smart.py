import re

def smart_refactor():
    with open('frontend/css/dashboard.css', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. First add variables in :root
    root_target = """:root {
  --sidebar-width-expanded: 250px;
  --sidebar-width-collapsed: 76px;
  --header-height: 64px;
  --transition-sidebar: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}"""
    root_replacement = """:root {
  --sidebar-width-expanded: 250px;
  --sidebar-width-collapsed: 76px;
  --header-height: 64px;
  --transition-sidebar: 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* Dashboard Surface & Chrome Tokens */
  --dash-sidebar-bg: var(--color-bg-primary);
  --dash-header-bg: var(--color-bg-primary);
}"""
    if root_target in content:
        content = content.replace(root_target, root_replacement, 1)
        print("[OK] :root variables added")

    rule_replacements = [
        # --- Sidebar ---
        (r'\.dashboard-sidebar\b[^{]*\{', 'background-color: #070D19;', 'background-color: var(--dash-sidebar-bg);'),
        (r'\.sidebar-link\b[^{]*\{', 'color: #94A3B8;', 'color: var(--color-text-muted);'),
        (r'\.sidebar-link:hover\b[^{]*\{', 'color: #F8FAFC;', 'color: var(--color-text-primary);'),
        (r'\.sidebar-promo-card\b[^{]*\{', 'border: 1px solid #1D3B6F;', 'border: 1px solid var(--color-border);'),
        (r'\.promo-subtitle\b[^{]*\{', 'color: #94A3B8;', 'color: var(--color-text-muted);'),
        
        # --- Header ---
        (r'\.dashboard-header\b[^{]*\{', 'background-color: #070D19;', 'background-color: var(--dash-header-bg);'),
        (r'\.header-search\b[^{]*\{', 'background-color: #0D1933;', 'background-color: var(--color-bg-secondary);'),
        (r'\.header-search\b[^{]*\{', 'border: 1px solid #1D3B6F;', 'border: 1px solid var(--color-border);'),
        (r'\.header-search:focus-within\b[^{]*\{', 'border-color: #3B82F6;', 'border-color: var(--color-border-hover);'),
        (r'\.notification-btn\b[^{]*\{', 'color: #94A3B8;', 'color: var(--color-text-muted);'),
        (r'\.notification-btn:hover\b[^{]*\{', 'color: #FFFFFF;', 'color: var(--color-text-primary);'),
        (r'\.notif-badge\b[^{]*\{', 'border: 2px solid #070D19;', 'border: 2px solid var(--dash-header-bg);'),
        (r'\.notif-badge\b[^{]*\{', 'background-color: #EF4444;', 'background-color: var(--color-error);'),
        
        # --- Popovers ---
        (r'\.notification-popover\b[^{]*\{', 'background-color: #0D1933;', 'background-color: var(--color-bg-secondary);'),
        (r'\.notification-popover\b[^{]*\{', 'border: 1px solid #1D3B6F;', 'border: 1px solid var(--color-border);'),
        (r'\.notif-popover-header\b[^{]*\{', 'border-bottom: 1px solid #1D3B6F;', 'border-bottom: 1px solid var(--color-border);'),
        (r'\.notif-popover-tag\b[^{]*\{', 'color: #60A5FA;', 'color: var(--color-secondary-hover);'),
        (r'\.notif-empty-icon\b[^{]*\{', 'color: #60A5FA;', 'color: var(--color-secondary-hover);'),
        (r'\.notif-empty-desc\b[^{]*\{', 'color: #94A3B8;', 'color: var(--color-text-muted);'),
        (r'\.search-feedback-popover\b[^{]*\{', 'background-color: #0D1933;', 'background-color: var(--color-bg-secondary);'),
        (r'\.search-feedback-popover\b[^{]*\{', 'border: 1px solid #1D3B6F;', 'border: 1px solid var(--color-border);'),
        (r'\.search-popover-text\b[^{]*\{', 'color: #93C5FD;', 'color: var(--color-focus-ring);'),
        (r'\.section-badge-subtitle\b[^{]*\{', 'color: #94A3B8;', 'color: var(--color-text-muted);'),
        (r'\.section-badge-tag\b[^{]*\{', 'color: #60A5FA;', 'color: var(--color-secondary-hover);'),
        (r'\.empty-state-icon\b[^{]*\{', 'color: #60A5FA;', 'color: var(--color-secondary-hover);'),
        
        # --- User Profile ---
        (r'\.user-profile-trigger\b[^{]*\{', 'background-color: #0D1933;', 'background-color: var(--color-bg-secondary);'),
        (r'\.user-profile-trigger\b[^{]*\{', 'border: 1px solid #1D3B6F;', 'border: 1px solid var(--color-border);'),
        (r'\.user-profile-trigger:hover\b[^{]*\{', 'border-color: #3B82F6;', 'border-color: var(--color-border-hover);'),
        (r'\.user-role\b[^{]*\{', 'color: #94A3B8;', 'color: var(--color-text-muted);'),
        (r'\.dropdown-chevron\b[^{]*\{', 'color: #94A3B8;', 'color: var(--color-text-muted);'),
        (r'\.user-profile-menu\b[^{]*\{', 'background-color: #0D1933;', 'background-color: var(--color-bg-secondary);'),
        (r'\.user-profile-menu\b[^{]*\{', 'border: 1px solid #1D3B6F;', 'border: 1px solid var(--color-border);'),
        (r'\.menu-item\b[^{]*\{', 'color: #CBD5E1;', 'color: var(--color-text-secondary);'),
        (r'\.menu-item:hover\b[^{]*\{', 'color: #FFFFFF;', 'color: var(--color-text-primary);'),
        (r'\.menu-divider\b[^{]*\{', 'background-color: #1D3B6F;', 'background-color: var(--color-border);'),
        
        # --- Welcome Banner ---
        (r'\.welcome-icon\b[^{]*\{', 'color: #60A5FA;', 'color: var(--color-secondary-hover);'),
        (r'\.welcome-subtitle\b[^{]*\{', 'color: #94A3B8;', 'color: var(--color-text-muted);'),
        
        # --- Stat Cards & Panels ---
        (r'\.stat-card\b[^{]*\{', 'background-color: #0D1933;', 'background-color: var(--color-bg-secondary);'),
        (r'\.stat-card\b[^{]*\{', 'border: 1px solid #1D3B6F;', 'border: 1px solid var(--color-border);'),
        (r'\.stat-card:hover\b[^{]*\{', 'border-color: #3B82F6;', 'border-color: var(--color-border-hover);'),
        (r'\.stat-label\b[^{]*\{', 'color: #94A3B8;', 'color: var(--color-text-muted);'),
        (r'\.stat-desc\b[^{]*\{', 'color: #64748B;', 'color: var(--color-text-muted);'),
        (r'\.dash-panel\b[^{]*\{', 'background-color: #0D1933;', 'background-color: var(--color-bg-secondary);'),
        (r'\.dash-panel\b[^{]*\{', 'border: 1px solid #1D3B6F;', 'border: 1px solid var(--color-border);'),
        (r'\.panel-link\b[^{]*\{', 'color: #3B82F6;', 'color: var(--color-secondary);'),
        (r'\.panel-link:hover\b[^{]*\{', 'color: #60A5FA;', 'color: var(--color-secondary-hover);'),
        
        # --- Problem List & Activity ---
        (r'\.problem-name\b[^{]*\{', 'color: #F1F5F9;', 'color: var(--color-text-primary);'),
        (r'\.problem-snippet\b[^{]*\{', 'color: #94A3B8;', 'color: var(--color-text-muted);'),
        (r'\.problem-arrow\b[^{]*\{', 'color: #64748B;', 'color: var(--color-text-muted);'),
        (r'\.problem-item:hover\s+\.problem-arrow\b[^{]*\{', 'color: #3B82F6;', 'color: var(--color-secondary);'),
        (r'\.activity-title\b[^{]*\{', 'color: #E2E8F0;', 'color: var(--color-text-primary);'),
        (r'\.status-solved\b[^{]*\{', 'color: #22C55E;', 'color: var(--color-success);'),
        (r'\.status-attempts\b[^{]*\{', 'color: #60A5FA;', 'color: var(--color-secondary-hover);'),
        (r'\.activity-time\b[^{]*\{', 'color: #64748B;', 'color: var(--color-text-muted);'),
        
        # --- Light Theme Overrides (Harmonised to use variables) ---
        (r'\[data-theme="light"\]\s+\.dashboard-sidebar\b[^{]*\{', 'background-color: #FFFFFF;', 'background-color: var(--color-bg-secondary);'),
        (r'\[data-theme="light"\]\s+\.dashboard-sidebar\b[^{]*\{', 'border-right-color: #CBD5E1;', 'border-right-color: var(--color-border);'),
        (r'\[data-theme="light"\]\s+\.sidebar-header\b[^{]*\{', 'border-bottom-color: #E2E8F0;', 'border-bottom-color: var(--color-bg-hover);'),
        (r'\[data-theme="light"\]\s+\.brand-text\b[^{]*\{', 'color: #0F172A;', 'color: var(--color-text-primary);'),
        (r'\[data-theme="light"\]\s+\.sidebar-link\b[^{]*\{', 'color: #475569;', 'color: var(--color-text-secondary);'),
        (r'\[data-theme="light"\]\s+\.sidebar-link:hover\b[^{]*\{', 'background-color: #F1F5F9;', 'background-color: var(--color-bg-surface);'),
        (r'\[data-theme="light"\]\s+\.sidebar-link:hover\b[^{]*\{', 'color: #0F172A;', 'color: var(--color-text-primary);'),
        (r'\[data-theme="light"\]\s+\.sidebar-promo-card\b[^{]*\{', 'border-color: #CBD5E1;', 'border-color: var(--color-border);'),
        (r'\[data-theme="light"\]\s+\.promo-title\b[^{]*\{', 'color: #0F172A;', 'color: var(--color-text-primary);'),
        (r'\[data-theme="light"\]\s+\.promo-subtitle\b[^{]*\{', 'color: #64748B;', 'color: var(--color-text-muted);'),
        (r'\[data-theme="light"\]\s+\.dashboard-header\b[^{]*\{', 'background-color: #FFFFFF;', 'background-color: var(--color-bg-secondary);'),
        (r'\[data-theme="light"\]\s+\.dashboard-header\b[^{]*\{', 'border-bottom-color: #CBD5E1;', 'border-bottom-color: var(--color-border);'),
        (r'\[data-theme="light"\]\s+\.header-search\b[^{]*\{', 'background-color: #F8FAFC;', 'background-color: var(--color-bg-primary);'),
        (r'\[data-theme="light"\]\s+\.header-search\b[^{]*\{', 'border-color: #CBD5E1;', 'border-color: var(--color-border);'),
        (r'\[data-theme="light"\]\s+\.dash-search-input\b[^{]*\{', 'color: #0F172A;', 'color: var(--color-text-primary);'),
        (r'\[data-theme="light"\]\s+\.user-profile-badge\b[^{]*\{', 'background-color: #F1F5F9;', 'background-color: var(--color-bg-surface);'),
        (r'\[data-theme="light"\]\s+\.user-profile-badge\b[^{]*\{', 'border-color: #CBD5E1;', 'border-color: var(--color-border);'),
        (r'\[data-theme="light"\]\s+\.user-name\b[^{]*\{', 'color: #0F172A;', 'color: var(--color-text-primary);'),
        (r'\[data-theme="light"\]\s+\.user-role\b[^{]*\{', 'color: #64748B;', 'color: var(--color-text-muted);'),
        (r'\[data-theme="light"\]\s+\.welcome-title\b[^{]*\{', 'color: #0F172A;', 'color: var(--color-text-primary);'),
        (r'\[data-theme="light"\]\s+\.welcome-subtitle\b[^{]*\{', 'color: #475569;', 'color: var(--color-text-secondary);'),
        (r'\[data-theme="light"\]\s+\.stat-card,\s*\[data-theme="light"\]\s+\.dash-panel\b[^{]*\{', 'background-color: #FFFFFF;', 'background-color: var(--color-bg-secondary);'),
        (r'\[data-theme="light"\]\s+\.stat-card,\s*\[data-theme="light"\]\s+\.dash-panel\b[^{]*\{', 'border-color: #E2E8F0;', 'border-color: var(--color-bg-hover);'),
        (r'\[data-theme="light"\]\s+\.stat-value,\s*\[data-theme="light"\]\s+\.panel-title,\s*\[data-theme="light"\]\s+\.problem-name,\s*\[data-theme="light"\]\s+\.activity-title\b[^{]*\{', 'color: #0F172A;', 'color: var(--color-text-primary);'),
        (r'\[data-theme="light"\]\s+\.problem-item\b[^{]*\{', 'border-bottom-color: #E2E8F0;', 'border-bottom-color: var(--color-bg-hover);'),
        (r'\[data-theme="light"\]\s+\.problem-item:hover\b[^{]*\{', 'background-color: #F8FAFC;', 'background-color: var(--color-bg-primary);'),
        (r'\[data-theme="light"\]\s+\.activity-row\b[^{]*\{', 'border-bottom-color: #E2E8F0;', 'border-bottom-color: var(--color-bg-hover);'),
        (r'\[data-theme="light"\]\s+\.notification-btn\b[^{]*\{', 'border-color: #CBD5E1;', 'border-color: var(--color-border);'),
        (r'\[data-theme="light"\]\s+\.notification-btn\b[^{]*\{', 'color: #475569;', 'color: var(--color-text-secondary);'),
        (r'\[data-theme="light"\]\s+\.notification-btn:hover\b[^{]*\{', 'background-color: #F1F5F9;', 'background-color: var(--color-bg-surface);'),
        (r'\[data-theme="light"\]\s+\.notification-btn:hover\b[^{]*\{', 'color: #0F172A;', 'color: var(--color-text-primary);'),
        (r'\[data-theme="light"\]\s+\.notif-badge\b[^{]*\{', 'border-color: #FFFFFF;', 'border-color: var(--color-bg-secondary);'),
        (r'\[data-theme="light"\]\s+\.dash-auth-login\b[^{]*\{', 'color: #475569;', 'color: var(--color-text-secondary);'),
        (r'\[data-theme="light"\]\s+\.dash-auth-login\b[^{]*\{', 'border-color: #CBD5E1;', 'border-color: var(--color-border);'),
        (r'\[data-theme="light"\]\s+\.dash-auth-login:hover\b[^{]*\{', 'color: #0F172A;', 'color: var(--color-text-primary);'),
        (r'\[data-theme="light"\]\s+\.dash-auth-login:hover\b[^{]*\{', 'background-color: #F1F5F9;', 'background-color: var(--color-bg-surface);'),
        (r'\[data-theme="light"\]\s+\.dash-auth-login:hover\b[^{]*\{', 'border-color: #94A3B8;', 'border-color: var(--color-text-muted);'),
        (r'\[data-theme="light"\]\s+\.sidebar-toggle-btn\b[^{]*\{', 'background: #FFFFFF;', 'background: var(--color-bg-secondary);'),
        (r'\[data-theme="light"\]\s+\.sidebar-toggle-btn\b[^{]*\{', 'border-color: #CBD5E1;', 'border-color: var(--color-border);'),
        (r'\[data-theme="light"\]\s+\.sidebar-toggle-btn\b[^{]*\{', 'color: #3B82F6;', 'color: var(--color-secondary);'),
        (r'\[data-theme="light"\]\s+\.empty-state-title\b[^{]*\{', 'color: #0F172A;', 'color: var(--color-text-primary);'),
        (r'\[data-theme="light"\]\s+\.empty-state-description\b[^{]*\{', 'color: #64748B;', 'color: var(--color-text-muted);'),
        (r'\[data-theme="light"\]\s+\.notification-popover,\s*\[data-theme="light"\]\s+\.search-feedback-popover\b[^{]*\{', 'background-color: #FFFFFF;', 'background-color: var(--color-bg-secondary);'),
        (r'\[data-theme="light"\]\s+\.notification-popover,\s*\[data-theme="light"\]\s+\.search-feedback-popover\b[^{]*\{', 'border-color: #CBD5E1;', 'border-color: var(--color-border);'),
        (r'\[data-theme="light"\]\s+\.notif-popover-header\b[^{]*\{', 'border-bottom-color: #E2E8F0;', 'border-bottom-color: var(--color-bg-hover);'),
        (r'\[data-theme="light"\]\s+\.notif-popover-title,\s*\[data-theme="light"\]\s+\.notif-empty-title\b[^{]*\{', 'color: #0F172A;', 'color: var(--color-text-primary);'),
        (r'\[data-theme="light"\]\s+\.notif-empty-desc,\s*\[data-theme="light"\]\s+\.section-badge-subtitle\b[^{]*\{', 'color: #64748B;', 'color: var(--color-text-muted);'),
        (r'\[data-theme="light"\]\s+\.user-profile-trigger\b[^{]*\{', 'background-color: #F8FAFC;', 'background-color: var(--color-bg-primary);'),
        (r'\[data-theme="light"\]\s+\.user-profile-trigger\b[^{]*\{', 'border-color: #E2E8F0;', 'border-color: var(--color-bg-hover);'),
        (r'\[data-theme="light"\]\s+\.user-profile-menu\b[^{]*\{', 'background-color: #FFFFFF;', 'background-color: var(--color-bg-secondary);'),
        (r'\[data-theme="light"\]\s+\.user-profile-menu\b[^{]*\{', 'border-color: #E2E8F0;', 'border-color: var(--color-bg-hover);'),
        (r'\[data-theme="light"\]\s+\.menu-item:hover\b[^{]*\{', 'background-color: #F1F5F9;', 'background-color: var(--color-bg-surface);'),
        (r'\[data-theme="light"\]\s+\.menu-item:hover\b[^{]*\{', 'color: #0F172A;', 'color: var(--color-text-primary);'),
        (r'\[data-theme="light"\]\s+\.menu-divider\b[^{]*\{', 'background-color: #E2E8F0;', 'background-color: var(--color-bg-hover);')
    ]

    matched_count = 0
    for sel_pattern, old_p, new_p in rule_replacements:
        pattern = '(' + sel_pattern + r'[^}]*?)(' + re.escape(old_p) + r')([^}]*?\})'
        regex = re.compile(pattern, re.DOTALL)
        m = regex.search(content)
        if m:
            content = content[:m.start(2)] + new_p + content[m.end(2):]
            matched_count += 1
        else:
            print(f"[MISS] Pattern not matched: {sel_pattern} with {old_p}")

    print(f"\nTotal replacements matched: {matched_count} / {len(rule_replacements)}")
    return content

if __name__ == '__main__':
    res = smart_refactor()
    with open('frontend/css/dashboard.css', 'w', encoding='utf-8', newline='\n') as f:
        f.write(res)
    before_hex = 237
    after_hex = len(re.findall(r'#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b', res))
    print(f"Hex count: Before={before_hex}, After={after_hex}, Reduced={before_hex - after_hex}")
