# append_styles_phase6.py
toast_and_preferences_css = """

/* ========================================
   Phase 6: Toast Notification System
   ======================================== */

.codearena-toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
  max-width: 420px;
  width: calc(100% - 48px);
}

.codearena-toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: var(--color-surface, #1e293b);
  color: var(--color-text, #f8fafc);
  border: 1px solid var(--color-border, #334155);
  border-radius: var(--radius-md, 8px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
  font-size: var(--font-size-sm, 0.875rem);
  font-weight: 500;
  line-height: 1.4;
  pointer-events: auto;
  opacity: 0;
  transform: translateY(16px) scale(0.96);
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.codearena-toast.show {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.codearena-toast.hide {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}

.codearena-toast .toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.codearena-toast.toast-success .toast-icon {
  color: #22c55e;
}

.codearena-toast.toast-error .toast-icon {
  color: #ef4444;
}

.codearena-toast.toast-warning .toast-icon {
  color: #f59e0b;
}

.codearena-toast.toast-info .toast-icon {
  color: #3b82f6;
}

.codearena-toast.toast-success {
  border-left: 4px solid #22c55e;
}

.codearena-toast.toast-error {
  border-left: 4px solid #ef4444;
}

.codearena-toast.toast-warning {
  border-left: 4px solid #f59e0b;
}

.codearena-toast.toast-info {
  border-left: 4px solid #3b82f6;
}

.codearena-toast .toast-message {
  flex: 1;
  word-break: break-word;
}

.codearena-toast .toast-close-btn {
  background: transparent;
  border: none;
  color: var(--color-text-muted, #94a3b8);
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 4px;
  border-radius: 4px;
  transition: color 0.15s ease;
}

.codearena-toast .toast-close-btn:hover {
  color: var(--color-text, #f8fafc);
}

/* ========================================
   Phase 6: Interface Density Preference
   ======================================== */

[data-density="compact"] {
  --space-md: 0.75rem;
  --space-lg: 1.125rem;
  --space-xl: 1.5rem;
}

[data-density="compact"] .btn {
  padding: 6px 12px;
  font-size: 0.8125rem;
}

[data-density="compact"] .catalogue-table td,
[data-density="compact"] .catalogue-table th,
[data-density="compact"] .submissions-table td,
[data-density="compact"] .submissions-table th {
  padding-top: 8px !important;
  padding-bottom: 8px !important;
}

/* ========================================
   Phase 6: Reduced Motion Override
   ======================================== */

[data-reduced-motion="true"] *,
[data-reduced-motion="true"] *::before,
[data-reduced-motion="true"] *::after {
  animation-duration: 0.001ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.001ms !important;
  scroll-behavior: auto !important;
}
"""

with open('frontend/css/styles.css', 'r', encoding='utf-8') as f:
    current = f.read()

if 'Phase 6: Toast Notification System' not in current:
    with open('frontend/css/styles.css', 'a', encoding='utf-8') as f:
        f.write(toast_and_preferences_css)
    print("Appended Phase 6 styles to frontend/css/styles.css")
else:
    print("Phase 6 styles already present in styles.css")

