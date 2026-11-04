# tests/frontend/utils/append_phase8_styles.py
import os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
CSS_PATH = os.path.join(ROOT, "frontend", "css", "styles.css")

phase8_css = """

/* ==========================================================================
   Phase 8: User Access, Pro Badges, Auth Gates & Subscription Pricing
   ========================================================================== */

/* 1. Pro & Free Problem Badges */
.badge-pro {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: 4px;
  background: linear-gradient(135deg, rgba(234, 179, 8, 0.18), rgba(245, 158, 11, 0.28));
  color: #facc15;
  border: 1px solid rgba(234, 179, 8, 0.45);
  line-height: 1.2;
}

[data-theme="light"] .badge-pro {
  background: linear-gradient(135deg, rgba(202, 138, 4, 0.12), rgba(217, 119, 6, 0.2));
  color: #b45309;
  border-color: rgba(202, 138, 4, 0.4);
}

.badge-free {
  display: inline-flex;
  align-items: center;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(16, 185, 129, 0.12);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.25);
  line-height: 1.2;
}

[data-theme="light"] .badge-free {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border-color: rgba(16, 185, 129, 0.3);
}

.pro-lock-icon {
  display: inline-block;
  margin-right: 4px;
  font-size: 0.85em;
  opacity: 0.9;
  vertical-align: baseline;
}

/* 2. Submissions Authentication Gate Card */
.auth-gate-container {
  max-width: 640px;
  margin: 40px auto;
  padding: 0 16px;
}

.auth-gate-card {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg, 12px);
  padding: 40px 32px;
  text-align: center;
  box-shadow: 0 8px 30px var(--color-shadow, rgba(0, 0, 0, 0.3));
}

.auth-gate-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(99, 102, 241, 0.18));
  color: var(--color-primary, #60a5fa);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.auth-gate-badge {
  display: inline-block;
  margin-bottom: 12px;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 3px 10px;
  border-radius: 9999px;
  background: rgba(59, 130, 246, 0.12);
  color: var(--color-primary, #60a5fa);
  border: 1px solid rgba(59, 130, 246, 0.25);
}

.auth-gate-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 12px;
}

.auth-gate-desc {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
  max-width: 500px;
  margin: 0 auto 28px;
}

.auth-gate-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}

.auth-gate-btn {
  height: 42px;
  padding: 0 20px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  border-radius: var(--radius-md, 8px);
}

.btn-demo-auth {
  background: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.35);
  cursor: pointer;
  transition: all var(--transition-fast, 0.15s ease);
}

.btn-demo-auth:hover {
  background: rgba(245, 158, 11, 0.22);
  border-color: #f59e0b;
  transform: translateY(-1px);
}

.auth-gate-disclaimer {
  font-size: 0.76rem;
  color: var(--color-text-muted);
  line-height: 1.5;
  padding: 10px 14px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.15);
  border: 1px dashed var(--color-border);
}

[data-theme="light"] .auth-gate-disclaimer {
  background: rgba(0, 0, 0, 0.04);
}

/* 3. Header User Pill */
.sub-user-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 3px 10px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: 9999px;
  font-size: 0.8rem;
}

.user-avatar-small {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
}

.sub-user-name {
  color: var(--color-text-primary);
  font-weight: 600;
}

.badge-plan-tag {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 1px 6px;
  border-radius: 4px;
}

.badge-plan-tag.plan-pro {
  background: rgba(234, 179, 8, 0.2);
  color: #facc15;
  border: 1px solid rgba(234, 179, 8, 0.4);
}

.badge-plan-tag.plan-free {
  background: rgba(148, 163, 184, 0.15);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.sub-logout-btn {
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0 4px;
  text-decoration: underline;
  transition: color var(--transition-fast, 0.15s ease);
}

.sub-logout-btn:hover {
  color: #ef4444;
}

/* 4. Pro Subscription Pricing Modal */
.subscription-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow-y: auto;
}

.subscription-modal {
  background: var(--color-bg-secondary, #0f172a);
  border: 1px solid var(--color-border, #1e293b);
  border-radius: var(--radius-lg, 12px);
  width: 100%;
  max-width: 820px;
  padding: 32px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  position: relative;
  box-sizing: border-box;
}

.sub-modal-header {
  text-align: center;
  margin-bottom: 28px;
  position: relative;
}

.sub-modal-close-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: all var(--transition-fast, 0.15s ease);
}

.sub-modal-close-btn:hover {
  color: var(--color-text-primary);
  border-color: var(--color-text-primary);
}

.sub-modal-tag {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 9999px;
  background: linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(245, 158, 11, 0.3));
  color: #facc15;
  border: 1px solid rgba(234, 179, 8, 0.5);
  margin-bottom: 10px;
}

.sub-modal-title {
  font-size: 1.7rem;
  font-weight: 800;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.sub-modal-subtitle {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  max-width: 580px;
  margin: 0 auto;
  line-height: 1.5;
}

.sub-preview-card {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 14px 18px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.sub-preview-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.sub-preview-title {
  font-weight: 700;
  color: var(--color-text-primary);
}

.pricing-plans-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

@media (max-width: 680px) {
  .pricing-plans-grid {
    grid-template-columns: 1fr;
  }
}

.pricing-card-preview {
  background: var(--color-bg-surface, #1e293b);
  border: 1px solid var(--color-border, #334155);
  border-radius: var(--radius-md, 10px);
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all var(--transition-fast, 0.15s ease);
  position: relative;
}

.pricing-card-preview:hover {
  border-color: rgba(234, 179, 8, 0.5);
  transform: translateY(-2px);
}

.pricing-card-header {
  margin-bottom: 16px;
}

.pricing-plan-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 6px;
}

.pricing-price-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 6px;
}

.pricing-currency-amount {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--color-text-primary);
}

.pricing-period {
  font-size: 0.88rem;
  color: var(--color-text-muted);
}

.pricing-billing-terms {
  font-size: 0.78rem;
  color: var(--color-text-secondary);
  line-height: 1.4;
  min-height: 34px;
}

.pricing-note {
  font-size: 0.73rem;
  color: var(--color-text-muted);
  font-style: italic;
  margin-top: 4px;
}

.pricing-benefits {
  list-style: none;
  padding: 0;
  margin: 16px 0 20px;
  border-top: 1px solid var(--color-border);
  padding-top: 16px;
}

.pricing-benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.82rem;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
  line-height: 1.4;
}

.pricing-benefit-check {
  color: #10b981;
  font-weight: bold;
}

.pricing-action-btn {
  width: 100%;
  height: 42px;
  border-radius: var(--radius-md, 8px);
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all var(--transition-fast, 0.15s ease);
}

.btn-plan-select {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #ffffff;
  border: none;
}

.btn-plan-select:hover {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  transform: translateY(-1px);
}

.sub-modal-footer-disclaimer {
  text-align: center;
  font-size: 0.74rem;
  color: var(--color-text-muted);
  line-height: 1.5;
  border-top: 1px dashed var(--color-border);
  padding-top: 16px;
}

/* 5. Upcoming Activities Section (Dashboard) */
.upcoming-activities-panel {
  margin-top: 24px;
}

.activities-list-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.activity-card {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md, 8px);
  padding: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all var(--transition-fast, 0.15s ease);
}

.activity-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--color-shadow);
}

.activity-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.activity-category-badge {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 2px 7px;
  border-radius: 4px;
}

.activity-category-badge.cat-contest {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.activity-category-badge.cat-practice {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.activity-category-badge.cat-curriculum {
  background: rgba(168, 85, 247, 0.15);
  color: #c084fc;
  border: 1px solid rgba(168, 85, 247, 0.3);
}

.activity-category-badge.cat-pro {
  background: rgba(234, 179, 8, 0.18);
  color: #facc15;
  border: 1px solid rgba(234, 179, 8, 0.4);
}

.activity-date-tag {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.activity-title {
  font-size: 0.98rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 6px;
  line-height: 1.35;
}

.activity-desc {
  font-size: 0.82rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin-bottom: 16px;
  flex-grow: 1;
}

.activity-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--color-border);
  padding-top: 12px;
}

.activity-demo-tag {
  font-size: 0.65rem;
  color: var(--color-text-muted);
  font-style: italic;
}

.activity-action-link {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: color var(--transition-fast, 0.15s ease);
}

.activity-action-link:hover {
  color: var(--color-primary-hover, #93c5fd);
}
"""

with open(CSS_PATH, "a", encoding="utf-8") as f:
    f.write(phase8_css)

print("Phase 8 styles appended to styles.css successfully.")

