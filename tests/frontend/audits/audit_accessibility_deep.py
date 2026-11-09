
import os
import sys

# Ensure repository root is in sys.path and is the working directory
_CUR_DIR = os.path.dirname(os.path.abspath(__file__)) if '__file__' in globals() else os.getcwd()
_ROOT = _CUR_DIR
while _ROOT and not (os.path.isdir(os.path.join(_ROOT, 'frontend')) and (os.path.exists(os.path.join(_ROOT, '.git')) or os.path.exists(os.path.join(_ROOT, '.gitignore')))):
    _PARENT = os.path.dirname(_ROOT)
    if _PARENT == _ROOT:
        break
    _ROOT = _PARENT

if os.path.isdir(os.path.join(_ROOT, 'frontend')):
    os.chdir(_ROOT)
    BASE_DIR = _ROOT
    ROOT_DIR = _ROOT
    FRONTEND_DIR = os.path.join(_ROOT, 'frontend')

import os
import glob
import re

def audit_accessibility():
    html_files = sorted(glob.glob('frontend/**/*.html', recursive=True) + glob.glob('frontend/*.html'))
    html_files = list(dict.fromkeys(html_files))

    issues = []

    for h in html_files:
        with open(h, 'r', encoding='utf-8') as f:
            content = f.read()

        fname = os.path.basename(h)

        # 1. Check for <h1>
        h1s = re.findall(r'<h1\b[^>]*>(.*?)</h1>', content, re.DOTALL)
        if len(h1s) == 0:
            issues.append((fname, "Low", "Heading Hierarchy", "Page lacks a top-level <h1> element."))
        elif len(h1s) > 1:
            issues.append((fname, "Low", "Heading Hierarchy", f"Page contains multiple ({len(h1s)}) <h1> elements."))

        # 2. Check for button without accessible name or aria-label
        buttons = re.findall(r'<button\b([^>]*)>(.*?)</button>', content, re.DOTALL)
        for attrs, inner in buttons:
            clean_inner = re.sub(r'<[^>]+>', '', inner).strip()
            aria_lbl = re.search(r'aria-label=[\'"]([^\'"]+)[\'"]', attrs)
            title = re.search(r'title=[\'"]([^\'"]+)[\'"]', attrs)
            if not clean_inner and not aria_lbl and not title:
                issues.append((fname, "Medium", "WCAG 2.1 4.1.2 Name, Role, Value", f"Button `<button {attrs.strip()[:40]}...>` has no text, aria-label, or title."))

        # 3. Check for modal dialogs lacking aria-modal or role="dialog"
        if 'modal' in content:
            modals = re.findall(r'<div\b[^>]*class=[\'"][^\'"]*modal-overlay[^\'"]*[\'"][^>]*>', content)
            for m in modals:
                if 'role="dialog"' not in m and "role='dialog'" not in m:
                    issues.append((fname, "Low", "Accessible Modals", f"Modal overlay lacks role='dialog' or aria-modal='true': {m[:50]}"))

    print(f"=== ACCESSIBILITY DEEP SCAN ({len(issues)} findings) ===")
    for fname, sev, cat, msg in issues:
        print(f"[{sev}] {fname:<15} | {cat:<25} | {msg}")

if __name__ == '__main__':
    audit_accessibility()

