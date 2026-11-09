import re

def refactor_dashboard_css():
    with open('frontend/css/dashboard.css', 'r', encoding='utf-8') as f:
        content = f.read()

    # Track replacements
    replacements = [
        # --- Section 1: Dashboard Variables ---
        (
            """:root {
  --sidebar-width-expanded: 250px;
  --sidebar-width-collapsed: 76px;
  --header-height: 64px;
  --transition-sidebar: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}""",
            """:root {
  --sidebar-width-expanded: 250px;
  --sidebar-width-collapsed: 76px;
  --header-height: 64px;
  --transition-sidebar: 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* Dashboard Surface & Chrome Tokens */
  --dash-sidebar-bg: var(--color-bg-primary);
  --dash-header-bg: var(--color-bg-primary);
}"""
        ),

        # --- Section 2: Sidebar ---
        (
            ".dashboard-sidebar {\n  position: fixed;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  width: var(--sidebar-width-expanded);\n  background-color: #070D19;\n  border-right: 1px solid var(--color-border);",
            ".dashboard-sidebar {\n  position: fixed;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  width: var(--sidebar-width-expanded);\n  background-color: var(--dash-sidebar-bg);\n  border-right: 1px solid var(--color-border);"
        ),
        (
            ".sidebar-link {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  padding: 10px 14px;\n  border-radius: 8px;\n  color: #94A3B8;\n  text-decoration: none;\n  font-size: 0.9rem;\n  font-weight: 500;",
            ".sidebar-link {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  padding: 10px 14px;\n  border-radius: 8px;\n  color: var(--color-text-muted);\n  text-decoration: none;\n  font-size: 0.9rem;\n  font-weight: 500;"
        ),
        (
            ".sidebar-link:hover {\n  background-color: var(--color-bg-hover);\n  color: #F8FAFC;",
            ".sidebar-link:hover {\n  background-color: var(--color-bg-hover);\n  color: var(--color-text-primary);"
        ),
        (
            ".sidebar-promo-card {\n  margin: auto 16px 20px 16px;\n  padding: 16px;\n  background: linear-gradient(135deg, #0D1B3E 0%, #102246 100%);\n  border: 1px solid #1D3B6F;",
            ".sidebar-promo-card {\n  margin: auto 16px 20px 16px;\n  padding: 16px;\n  background: linear-gradient(135deg, #0D1B3E 0%, #102246 100%);\n  border: 1px solid var(--color-border);"
        ),
        (
            ".promo-subtitle {\n  margin: 0 0 12px 0;\n  font-size: 0.78rem;\n  color: #94A3B8;",
            ".promo-subtitle {\n  margin: 0 0 12px 0;\n  font-size: 0.78rem;\n  color: var(--color-text-muted);"
        ),

        # --- Section 3: Header ---
        (
            ".dashboard-header {\n  height: var(--header-height);\n  background-color: #070D19;\n  border-bottom: 1px solid var(--color-border);",
            ".dashboard-header {\n  height: var(--header-height);\n  background-color: var(--dash-header-bg);\n  border-bottom: 1px solid var(--color-border);"
        ),
        (
            ".header-search {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  background-color: #0D1933;\n  border: 1px solid #1D3B6F;",
            ".header-search {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  background-color: var(--color-bg-secondary);\n  border: 1px solid var(--color-border);"
        ),
        (
            ".header-search:focus-within {\n  border-color: #3B82F6;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);",
            ".header-search:focus-within {\n  border-color: var(--color-border-hover);\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);"
        ),
        (
            ".notification-btn {\n  position: relative;\n  width: 38px;\n  height: 38px;\n  border-radius: 8px;\n  background: transparent;\n  border: 1px solid var(--color-border);\n  color: #94A3B8;",
            ".notification-btn {\n  position: relative;\n  width: 38px;\n  height: 38px;\n  border-radius: 8px;\n  background: transparent;\n  border: 1px solid var(--color-border);\n  color: var(--color-text-muted);"
        ),
        (
            ".notification-btn:hover {\n  background-color: var(--color-bg-hover);\n  color: #FFFFFF;",
            ".notification-btn:hover {\n  background-color: var(--color-bg-hover);\n  color: var(--color-text-primary);"
        ),

        # --- Section 4: Popovers ---
        (
            ".notification-popover {\n  position: absolute;\n  top: 60px;\n  right: 0;\n  width: 320px;\n  background-color: #0D1933;\n  border: 1px solid #1D3B6F;",
            ".notification-popover {\n  position: absolute;\n  top: 60px;\n  right: 0;\n  width: 320px;\n  background-color: var(--color-bg-secondary);\n  border: 1px solid var(--color-border);"
        ),
        (
            ".notif-popover-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 12px 16px;\n  border-bottom: 1px solid #1D3B6F;",
            ".notif-popover-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 12px 16px;\n  border-bottom: 1px solid var(--color-border);"
        ),
        (
            ".notif-popover-tag {\n  font-size: 0.72rem;\n  font-weight: 600;\n  color: #60A5FA;\n  background-color: rgba(59, 130, 246, 0.1);",
            ".notif-popover-tag {\n  font-size: 0.72rem;\n  font-weight: 600;\n  color: var(--color-secondary-hover);\n  background-color: rgba(59, 130, 246, 0.1);"
        ),
        (
            ".notif-empty-icon {\n  font-size: 1.8rem;\n  color: #60A5FA;",
            ".notif-empty-icon {\n  font-size: 1.8rem;\n  color: var(--color-secondary-hover);"
        ),
        (
            ".notif-empty-desc {\n  font-size: 0.8rem;\n  color: #94A3B8;\n  margin: 0;",
            ".notif-empty-desc {\n  font-size: 0.8rem;\n  color: var(--color-text-muted);\n  margin: 0;"
        ),
        (
            ".search-feedback-popover {\n  position: absolute;\n  top: calc(100% + 8px);\n  left: 0;\n  right: 0;\n  background-color: #0D1933;\n  border: 1px solid #1D3B6F;",
            ".search-feedback-popover {\n  position: absolute;\n  top: calc(100% + 8px);\n  left: 0;\n  right: 0;\n  background-color: var(--color-bg-secondary);\n  border: 1px solid var(--color-border);"
        ),
        (
            ".search-popover-text {\n  font-size: 0.82rem;\n  color: #93C5FD;",
            ".search-popover-text {\n  font-size: 0.82rem;\n  color: var(--color-focus-ring);"
        ),
        (
            ".section-badge-subtitle {\n  font-size: 0.82rem;\n  color: #94A3B8;\n  margin-top: 2px;",
            ".section-badge-subtitle {\n  font-size: 0.82rem;\n  color: var(--color-text-muted);\n  margin-top: 2px;"
        ),
        (
            ".notif-badge {\n  position: absolute;\n  top: 6px;\n  right: 6px;\n  width: 8px;\n  height: 8px;\n  background-color: #EF4444;\n  color: #FFFFFF;\n  border-radius: 50%;\n  font-size: 0;\n  border: 2px solid #070D19;",
            ".notif-badge {\n  position: absolute;\n  top: 6px;\n  right: 6px;\n  width: 8px;\n  height: 8px;\n  background-color: var(--color-error);\n  color: #FFFFFF;\n  border-radius: 50%;\n  font-size: 0;\n  border: 2px solid var(--dash-header-bg);"
        ),

        # --- Section 5: User Profile Trigger & Menu ---
        (
            ".user-profile-trigger {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  background-color: #0D1933;\n  border: 1px solid #1D3B6F;\n  border-radius: 8px;\n  padding: 5px 12px 5px 6px;\n  cursor: pointer;\n  transition: border-color 0.2s;\n}\n\n.user-profile-trigger:hover {\n  border-color: #3B82F6;\n}",
            ".user-profile-trigger {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  background-color: var(--color-bg-secondary);\n  border: 1px solid var(--color-border);\n  border-radius: 8px;\n  padding: 5px 12px 5px 6px;\n  cursor: pointer;\n  transition: border-color 0.2s;\n}\n\n.user-profile-trigger:hover {\n  border-color: var(--color-border-hover);\n}"
        ),
        (
            ".user-role {\n  font-size: 0.72rem;\n  color: #94A3B8;\n}\n\n.dropdown-chevron {\n  font-size: 0.65rem;\n  color: #94A3B8;\n  margin-left: 2px;\n}",
            ".user-role {\n  font-size: 0.72rem;\n  color: var(--color-text-muted);\n}\n\n.dropdown-chevron {\n  font-size: 0.65rem;\n  color: var(--color-text-muted);\n  margin-left: 2px;\n}"
        ),
        (
            ".user-profile-menu {\n  position: absolute;\n  top: 60px;\n  right: 0;\n  width: 220px;\n  background-color: #0D1933;\n  border: 1px solid #1D3B6F;",
            ".user-profile-menu {\n  position: absolute;\n  top: 60px;\n  right: 0;\n  width: 220px;\n  background-color: var(--color-bg-secondary);\n  border: 1px solid var(--color-border);"
        ),
        (
            ".menu-item {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 10px 16px;\n  color: #CBD5E1;\n  text-decoration: none;\n  font-size: 0.85rem;\n  transition: background-color 0.15s, color 0.15s;\n}\n\n.menu-item:hover {\n  background-color: var(--color-bg-hover);\n  color: #FFFFFF;\n}",
            ".menu-item {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 10px 16px;\n  color: var(--color-text-secondary);\n  text-decoration: none;\n  font-size: 0.85rem;\n  transition: background-color 0.15s, color 0.15s;\n}\n\n.menu-item:hover {\n  background-color: var(--color-bg-hover);\n  color: var(--color-text-primary);\n}"
        ),
        (
            ".menu-divider {\n  height: 1px;\n  background-color: #1D3B6F;\n  margin: 6px 0;\n}",
            ".menu-divider {\n  height: 1px;\n  background-color: var(--color-border);\n  margin: 6px 0;\n}"
        ),
        (
            ".section-badge-tag {\n  font-size: 0.72rem;\n  font-weight: 700;\n  letter-spacing: 0.08em;\n  color: #60A5FA;",
            ".section-badge-tag {\n  font-size: 0.72rem;\n  font-weight: 700;\n  letter-spacing: 0.08em;\n  color: var(--color-secondary-hover);"
        ),
        (
            ".empty-state-icon {\n  font-size: 2.2rem;\n  color: #60A5FA;\n  margin-bottom: 8px;\n}",
            ".empty-state-icon {\n  font-size: 2.2rem;\n  color: var(--color-secondary-hover);\n  margin-bottom: 8px;\n}"
        ),
        (
            ".welcome-icon {\n  font-size: 1.1rem;\n  color: #60A5FA;\n}",
            ".welcome-icon {\n  font-size: 1.1rem;\n  color: var(--color-secondary-hover);\n}"
        ),
        (
            ".welcome-subtitle {\n  margin: 0;\n  font-size: 0.9rem;\n  color: #94A3B8;\n}",
            ".welcome-subtitle {\n  margin: 0;\n  font-size: 0.9rem;\n  color: var(--color-text-muted);\n}"
        ),

        # --- Section 6: Stat Cards & Dash Panels ---
        (
            ".stat-card {\n  background-color: #0D1933;\n  border: 1px solid #1D3B6F;\n  border-radius: 12px;\n  padding: 20px;\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  box-shadow: 0 4px 12px var(--color-shadow);\n  transition: border-color 0.2s, transform 0.2s;\n}\n\n.stat-card:hover {\n  border-color: #3B82F6;\n  transform: translateY(-2px);\n}",
            ".stat-card {\n  background-color: var(--color-bg-secondary);\n  border: 1px solid var(--color-border);\n  border-radius: 12px;\n  padding: 20px;\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  box-shadow: 0 4px 12px var(--color-shadow);\n  transition: border-color 0.2s, transform 0.2s;\n}\n\n.stat-card:hover {\n  border-color: var(--color-border-hover);\n  transform: translateY(-2px);\n}"
        ),
        (
            ".stat-label {\n  font-size: 0.8rem;\n  color: #94A3B8;\n  margin-bottom: 4px;\n}",
            ".stat-label {\n  font-size: 0.8rem;\n  color: var(--color-text-muted);\n  margin-bottom: 4px;\n}"
        ),
        (
            ".stat-subtext {\n  font-size: 0.72rem;\n  color: #64748B;\n  margin-top: 2px;\n}",
            ".stat-subtext {\n  font-size: 0.72rem;\n  color: var(--color-text-muted);\n  margin-top: 2px;\n}"
        ),
        (
            ".dash-panel {\n  background-color: #0D1933;\n  border: 1px solid #1D3B6F;\n  border-radius: 12px;\n  padding: 24px;\n  box-shadow: 0 4px 12px var(--color-shadow);\n}",
            ".dash-panel {\n  background-color: var(--color-bg-secondary);\n  border: 1px solid var(--color-border);\n  border-radius: 12px;\n  padding: 24px;\n  box-shadow: 0 4px 12px var(--color-shadow);\n}"
        ),
        (
            ".panel-action {\n  font-size: 0.82rem;\n  color: #3B82F6;\n  text-decoration: none;\n  font-weight: 500;\n  transition: color 0.15s;\n}\n\n.panel-action:hover {\n  color: #60A5FA;\n}",
            ".panel-action {\n  font-size: 0.82rem;\n  color: var(--color-secondary);\n  text-decoration: none;\n  font-weight: 500;\n  transition: color 0.15s;\n}\n\n.panel-action:hover {\n  color: var(--color-secondary-hover);\n}"
        ),
        (
            ".problem-name {\n  font-weight: 600;\n  color: #F1F5F9;\n  margin-bottom: 4px;\n  font-size: 0.9rem;\n}\n\n.problem-topic {\n  color: #94A3B8;\n  margin-right: 8px;\n}\n\n.problem-acceptance {\n  color: #64748B;\n}\n\n.action-arrow {\n  color: #3B82F6;\n  transition: transform 0.2s;\n}",
            ".problem-name {\n  font-weight: 600;\n  color: var(--color-text-primary);\n  margin-bottom: 4px;\n  font-size: 0.9rem;\n}\n\n.problem-topic {\n  color: var(--color-text-muted);\n  margin-right: 8px;\n}\n\n.problem-acceptance {\n  color: var(--color-text-muted);\n}\n\n.action-arrow {\n  color: var(--color-secondary);\n  transition: transform 0.2s;\n}"
        ),
        (
            ".activity-title {\n  font-size: 0.86rem;\n  font-weight: 600;\n  color: #E2E8F0;\n  margin-bottom: 2px;\n}",
            ".activity-title {\n  font-size: 0.86rem;\n  font-weight: 600;\n  color: var(--color-text-primary);\n  margin-bottom: 2px;\n}"
        ),
        (
            ".activity-time {\n  font-size: 0.72rem;\n  color: #64748B;\n  white-space: nowrap;\n}",
            ".activity-time {\n  font-size: 0.72rem;\n  color: var(--color-text-muted);\n  white-space: nowrap;\n}"
        ),

        # --- Section 7: Light Theme Overrides Harmonisation ---
        (
            "[data-theme=\"light\"] .dashboard-sidebar {\n  background-color: #FFFFFF;\n  border-right-color: #CBD5E1;\n}",
            "[data-theme=\"light\"] .dashboard-sidebar {\n  background-color: var(--color-bg-secondary);\n  border-right-color: var(--color-border);\n}"
        ),
        (
            "[data-theme=\"light\"] .brand-text {\n  color: #0F172A;\n}",
            "[data-theme=\"light\"] .brand-text {\n  color: var(--color-text-primary);\n}"
        ),
        (
            "[data-theme=\"light\"] .sidebar-link {\n  color: #475569;\n}",
            "[data-theme=\"light\"] .sidebar-link {\n  color: var(--color-text-secondary);\n}"
        ),
        (
            "[data-theme=\"light\"] .sidebar-link:hover {\n  background-color: #F1F5F9;\n  color: #0F172A;\n}",
            "[data-theme=\"light\"] .sidebar-link:hover {\n  background-color: var(--color-bg-surface);\n  color: var(--color-text-primary);\n}"
        ),
        (
            "[data-theme=\"light\"] .sidebar-promo-card {\n  background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%);\n  border-color: #CBD5E1;\n}",
            "[data-theme=\"light\"] .sidebar-promo-card {\n  background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%);\n  border-color: var(--color-border);\n}"
        ),
        (
            "[data-theme=\"light\"] .promo-title {\n  color: #0F172A;\n}",
            "[data-theme=\"light\"] .promo-title {\n  color: var(--color-text-primary);\n}"
        ),
        (
            "[data-theme=\"light\"] .promo-subtitle {\n  color: #64748B;\n}",
            "[data-theme=\"light\"] .promo-subtitle {\n  color: var(--color-text-muted);\n}"
        ),
        (
            "[data-theme=\"light\"] .dashboard-header {\n  background-color: #FFFFFF;\n  border-bottom-color: #CBD5E1;\n}",
            "[data-theme=\"light\"] .dashboard-header {\n  background-color: var(--color-bg-secondary);\n  border-bottom-color: var(--color-border);\n}"
        ),
        (
            "[data-theme=\"light\"] .header-search {\n  background-color: #F8FAFC;\n  border-color: #CBD5E1;\n}",
            "[data-theme=\"light\"] .header-search {\n  background-color: var(--color-bg-primary);\n  border-color: var(--color-border);\n}"
        ),
        (
            "[data-theme=\"light\"] .dash-search-input {\n  color: #0F172A;\n}",
            "[data-theme=\"light\"] .dash-search-input {\n  color: var(--color-text-primary);\n}"
        ),
        (
            "[data-theme=\"light\"] .user-profile-badge {\n  background-color: #F1F5F9;\n  border-color: #CBD5E1;\n}",
            "[data-theme=\"light\"] .user-profile-badge {\n  background-color: var(--color-bg-surface);\n  border-color: var(--color-border);\n}"
        ),
        (
            "[data-theme=\"light\"] .user-name {\n  color: #0F172A;\n}",
            "[data-theme=\"light\"] .user-name {\n  color: var(--color-text-primary);\n}"
        ),
        (
            "[data-theme=\"light\"] .user-role {\n  color: #64748B;\n}",
            "[data-theme=\"light\"] .user-role {\n  color: var(--color-text-muted);\n}"
        ),
        (
            "[data-theme=\"light\"] .welcome-title {\n  color: #0F172A;\n}",
            "[data-theme=\"light\"] .welcome-title {\n  color: var(--color-text-primary);\n}"
        ),
        (
            "[data-theme=\"light\"] .welcome-subtitle {\n  color: #475569;\n}",
            "[data-theme=\"light\"] .welcome-subtitle {\n  color: var(--color-text-secondary);\n}"
        ),
        (
            "[data-theme=\"light\"] .stat-card, [data-theme=\"light\"] .dash-panel {\n  background-color: #FFFFFF;\n  border-color: #E2E8F0;\n}",
            "[data-theme=\"light\"] .stat-card, [data-theme=\"light\"] .dash-panel {\n  background-color: var(--color-bg-secondary);\n  border-color: var(--color-bg-hover);\n}"
        ),
        (
            "[data-theme=\"light\"] .stat-value, [data-theme=\"light\"] .panel-title, [data-theme=\"light\"] .problem-name, [data-theme=\"light\"] .activity-title {\n  color: #0F172A;\n}",
            "[data-theme=\"light\"] .stat-value, [data-theme=\"light\"] .panel-title, [data-theme=\"light\"] .problem-name, [data-theme=\"light\"] .activity-title {\n  color: var(--color-text-primary);\n}"
        ),
        (
            "[data-theme=\"light\"] .problem-item {\n  border-bottom-color: #E2E8F0;\n}",
            "[data-theme=\"light\"] .problem-item {\n  border-bottom-color: var(--color-bg-hover);\n}"
        ),
        (
            "[data-theme=\"light\"] .problem-item:hover {\n  background-color: #F8FAFC;\n}",
            "[data-theme=\"light\"] .problem-item:hover {\n  background-color: var(--color-bg-primary);\n}"
        ),
        (
            "[data-theme=\"light\"] .activity-row {\n  border-bottom-color: #E2E8F0;\n}",
            "[data-theme=\"light\"] .activity-row {\n  border-bottom-color: var(--color-bg-hover);\n}"
        ),
        (
            "[data-theme=\"light\"] .notification-btn {\n  border-color: #CBD5E1;\n  color: #475569;\n}",
            "[data-theme=\"light\"] .notification-btn {\n  border-color: var(--color-border);\n  color: var(--color-text-secondary);\n}"
        ),
        (
            "[data-theme=\"light\"] .notification-btn:hover {\n  background-color: #F1F5F9;\n  color: #0F172A;\n}",
            "[data-theme=\"light\"] .notification-btn:hover {\n  background-color: var(--color-bg-surface);\n  color: var(--color-text-primary);\n}"
        ),
        (
            "[data-theme=\"light\"] .notif-badge {\n  border-color: #FFFFFF;\n}",
            "[data-theme=\"light\"] .notif-badge {\n  border-color: var(--color-bg-secondary);\n}"
        ),
        (
            "[data-theme=\"light\"] .dash-auth-login {\n  color: #475569;\n  border-color: #CBD5E1;\n}",
            "[data-theme=\"light\"] .dash-auth-login {\n  color: var(--color-text-secondary);\n  border-color: var(--color-border);\n}"
        ),
        (
            "[data-theme=\"light\"] .dash-auth-login:hover {\n  color: #0F172A;\n  background-color: #F1F5F9;\n  border-color: #94A3B8;\n}",
            "[data-theme=\"light\"] .dash-auth-login:hover {\n  color: var(--color-text-primary);\n  background-color: var(--color-bg-surface);\n  border-color: var(--color-text-muted);\n}"
        ),
        (
            "[data-theme=\"light\"] .sidebar-toggle-btn {\n  background: #FFFFFF;\n  border-color: #CBD5E1;\n  color: #3B82F6;\n}",
            "[data-theme=\"light\"] .sidebar-toggle-btn {\n  background: var(--color-bg-secondary);\n  border-color: var(--color-border);\n  color: var(--color-secondary);\n}"
        ),
        (
            "[data-theme=\"light\"] .empty-state-title {\n  color: #0F172A;\n}",
            "[data-theme=\"light\"] .empty-state-title {\n  color: var(--color-text-primary);\n}"
        ),
        (
            "[data-theme=\"light\"] .empty-state-description {\n  color: #64748B;\n}",
            "[data-theme=\"light\"] .empty-state-description {\n  color: var(--color-text-muted);\n}"
        ),
        (
            "[data-theme=\"light\"] .notification-popover, [data-theme=\"light\"] .search-feedback-popover {\n  background-color: #FFFFFF;\n  border-color: #CBD5E1;\n}",
            "[data-theme=\"light\"] .notification-popover, [data-theme=\"light\"] .search-feedback-popover {\n  background-color: var(--color-bg-secondary);\n  border-color: var(--color-border);\n}"
        ),
        (
            "[data-theme=\"light\"] .notif-popover-header {\n  border-bottom-color: #E2E8F0;\n}",
            "[data-theme=\"light\"] .notif-popover-header {\n  border-bottom-color: var(--color-bg-hover);\n}"
        ),
        (
            "[data-theme=\"light\"] .notif-popover-title, [data-theme=\"light\"] .notif-empty-title {\n  color: #0F172A;\n}",
            "[data-theme=\"light\"] .notif-popover-title, [data-theme=\"light\"] .notif-empty-title {\n  color: var(--color-text-primary);\n}"
        ),
        (
            "[data-theme=\"light\"] .notif-empty-desc, [data-theme=\"light\"] .section-badge-subtitle {\n  color: #64748B;\n}",
            "[data-theme=\"light\"] .notif-empty-desc, [data-theme=\"light\"] .section-badge-subtitle {\n  color: var(--color-text-muted);\n}"
        ),
        (
            "[data-theme=\"light\"] .user-profile-trigger {\n  background-color: #F8FAFC;\n  border-color: #E2E8F0;\n}",
            "[data-theme=\"light\"] .user-profile-trigger {\n  background-color: var(--color-bg-primary);\n  border-color: var(--color-bg-hover);\n}"
        ),
        (
            "[data-theme=\"light\"] .user-profile-menu {\n  background-color: #FFFFFF;\n  border-color: #E2E8F0;\n}",
            "[data-theme=\"light\"] .user-profile-menu {\n  background-color: var(--color-bg-secondary);\n  border-color: var(--color-bg-hover);\n}"
        ),
        (
            "[data-theme=\"light\"] .menu-item:hover {\n  background-color: #F1F5F9;\n  color: #0F172A;\n}",
            "[data-theme=\"light\"] .menu-item:hover {\n  background-color: var(--color-bg-surface);\n  color: var(--color-text-primary);\n}"
        ),
        (
            "[data-theme=\"light\"] .menu-divider {\n  background-color: #E2E8F0;\n}",
            "[data-theme=\"light\"] .menu-divider {\n  background-color: var(--color-bg-hover);\n}"
        )
    ]

    matched = 0
    for target, rep in replacements:
        if target in content:
            content = content.replace(target, rep, 1)
            matched += 1
        else:
            print(f"[MISS] Could not find target:\n{target[:60]}...")

    print(f"Matched {matched} / {len(replacements)} replacements.")
    with open('scratch/dashboard_refactored.css', 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)

    # Count hexes after
    after_hexes = re.findall(r'#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b', content)
    print(f"Hexes after refactor: {len(after_hexes)}")

if __name__ == '__main__':
    refactor_dashboard_css()

