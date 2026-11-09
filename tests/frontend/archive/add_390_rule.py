with open('frontend/css/styles.css', 'r', encoding='utf-8') as f:
    text = f.read()

rule_390 = """

/* ========================================
   Phase 6: Ultra-Compact Mobile Viewport (<= 390px)
   ======================================== */

@media (max-width: 390px) {
  :root {
    --space-md: 0.75rem;
    --space-lg: 1rem;
  }
  .container {
    padding-left: 12px;
    padding-right: 12px;
  }
}
"""

if 'Phase 6: Ultra-Compact Mobile Viewport' not in text:
    with open('frontend/css/styles.css', 'a', encoding='utf-8') as f:
        f.write(rule_390)
    print("Added 390px mobile rule to styles.css")

