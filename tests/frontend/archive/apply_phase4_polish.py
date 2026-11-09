# apply_phase4_polish.py
import re

# 1. Update secondary.css
with open('frontend/css/secondary.css', 'r', encoding='utf-8') as f:
    sec_css = f.read()

# Fix logo in secondary.css
old_sec_logo = """.secondary-brand-wrap .brand-full-logo {
  height: 36px;
  width: auto;
  display: block;
}"""

new_sec_logo = """.secondary-brand-wrap {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
}

.secondary-brand-wrap .brand-full-logo {
  height: 36px;
  width: auto;
  max-width: 130px;
  aspect-ratio: 2122 / 741;
  object-fit: contain;
  flex-shrink: 0;
  display: block;
}"""

if old_sec_logo in sec_css:
    sec_css = sec_css.replace(old_sec_logo, new_sec_logo)
    print("secondary.css logo updated")
else:
    print("Warning: old_sec_logo not matched")

# Fix prob-card-desc in secondary.css
old_desc = """.prob-card-desc {
  font-size: 0.84rem;
  color: var(--color-text-muted);
  line-height: 1.45;
  margin: 0 0 14px 0;
  flex: 1;
}"""

new_desc = """.prob-card-desc {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0 0 14px 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.prob-card-desc p {
  margin: 0 0 6px 0;
  line-height: 1.5;
}

.prob-card-desc p:last-child {
  margin-bottom: 0;
}

.prob-card-desc code {
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  padding: 1px 5px;
  border-radius: 4px;
  font-family: var(--font-family-mono);
  font-size: 0.82rem;
  color: var(--color-primary);
}

[data-theme="light"] .prob-card-desc code {
  color: #2563EB;
}

.prob-card-desc strong,
.prob-card-desc b {
  font-weight: 600;
  color: var(--color-text-primary);
}"""

if old_desc in sec_css:
    sec_css = sec_css.replace(old_desc, new_desc)
    print("secondary.css prob-card-desc updated")
else:
    print("Warning: old_desc not matched")

with open('frontend/css/secondary.css', 'w', encoding='utf-8') as f:
    f.write(sec_css)

# 2. Update compiler.css logo
with open('frontend/css/compiler.css', 'r', encoding='utf-8') as f:
    comp_css = f.read()

old_comp_logo = """.compiler-brand-wrap .brand-full-logo {
  height: 36px;
  width: auto;
  display: block;
}"""

new_comp_logo = """.compiler-brand-wrap {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
}

.compiler-brand-wrap .brand-full-logo {
  height: 36px;
  width: auto;
  max-width: 130px;
  aspect-ratio: 2122 / 741;
  object-fit: contain;
  flex-shrink: 0;
  display: block;
}"""

if old_comp_logo in comp_css:
    comp_css = comp_css.replace(old_comp_logo, new_comp_logo)
    with open('frontend/css/compiler.css', 'w', encoding='utf-8') as f:
        f.write(comp_css)
    print("compiler.css logo updated")

# 3. Update workspace.css logo
with open('frontend/css/workspace.css', 'r', encoding='utf-8') as f:
    work_css = f.read()

old_work_logo = """.workspace-brand-wrap .brand-full-logo {
  height: 34px;
  width: auto;
  display: block;
}"""

new_work_logo = """.workspace-brand-wrap {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
}

.workspace-brand-wrap .brand-full-logo {
  height: 34px;
  width: auto;
  max-width: 130px;
  aspect-ratio: 2122 / 741;
  object-fit: contain;
  flex-shrink: 0;
  display: block;
}"""

if old_work_logo in work_css:
    work_css = work_css.replace(old_work_logo, new_work_logo)
    with open('frontend/css/workspace.css', 'w', encoding='utf-8') as f:
        f.write(work_css)
    print("workspace.css logo updated")

# 4. Update problems.css logo
with open('frontend/css/problems.css', 'r', encoding='utf-8') as f:
    prob_css = f.read()

old_prob_logo = """.problems-brand-wrap .brand-full-logo {
  height: 36px;
  width: auto;
  display: block;
}"""

new_prob_logo = """.problems-brand-wrap {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
}

.problems-brand-wrap .brand-full-logo {
  height: 36px;
  width: auto;
  max-width: 130px;
  aspect-ratio: 2122 / 741;
  object-fit: contain;
  flex-shrink: 0;
  display: block;
}"""

if old_prob_logo in prob_css:
    prob_css = prob_css.replace(old_prob_logo, new_prob_logo)
    with open('frontend/css/problems.css', 'w', encoding='utf-8') as f:
        f.write(prob_css)
    print("problems.css logo updated")

