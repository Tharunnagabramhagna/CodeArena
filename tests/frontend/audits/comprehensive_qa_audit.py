
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
import re
import glob

def run_comprehensive_audit():
    findings = {
        "critical": [],
        "high": [],
        "medium": [],
        "low": [],
        "informational": []
    }

    # 1. Check all HTML pages
    html_files = sorted(glob.glob("frontend/**/*.html", recursive=True) + glob.glob("frontend/*.html"))
    html_files = list(dict.fromkeys(html_files))

    js_files = glob.glob("frontend/js/*.js")
    css_files = glob.glob("frontend/css/*.css")

    # -------------------------------------------------------------
    # AUDIT: Orphaned / Empty Files
    # -------------------------------------------------------------
    for f in js_files + css_files:
        if os.path.getsize(f) == 0:
            findings["low"].append({
                "file": f,
                "scope": "File System / Asset Architecture",
                "issue": f"File '{f}' is completely empty (0 bytes).",
                "impact": "Unused orphaned file clutters the frontend tree and may confuse developers.",
                "recommendation": "Remove or properly populate when implemented."
            })

    # -------------------------------------------------------------
    # AUDIT: Script loading order & dependencies in HTML
    # -------------------------------------------------------------
    for html_file in html_files:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()

        scripts = re.findall(r'<script\s+[^>]*src=[\'"]([^\'"]+)[\'"]', content)
        script_basenames = [os.path.basename(s.split('?')[0]) for s in scripts]

        # In compiler.html and problem.html, CodeMirror must be loaded BEFORE compiler.js / workspace.js
        if 'compiler.html' in html_file:
            if 'codemirror.js' in script_basenames and 'compiler.js' in script_basenames:
                cm_idx = script_basenames.index('codemirror.js')
                comp_idx = script_basenames.index('compiler.js')
                if cm_idx > comp_idx:
                    findings["critical"].append({
                        "file": html_file,
                        "scope": "Script Loading Order",
                        "issue": "compiler.js is loaded before codemirror.js.",
                        "impact": "CodeMirror constructor will fail with ReferenceError at runtime.",
                        "recommendation": "Load codemirror.js before compiler.js."
                    })
            if 'api.js' in script_basenames and 'compiler.js' in script_basenames:
                api_idx = script_basenames.index('api.js')
                comp_idx = script_basenames.index('compiler.js')
                if api_idx > comp_idx:
                    findings["critical"].append({
                        "file": html_file,
                        "scope": "Script Loading Order",
                        "issue": "compiler.js is loaded before api.js.",
                        "impact": "CodeArenaAPI is undefined when compiler.js initializes.",
                        "recommendation": "Load api.js before compiler.js."
                    })

        if 'problem.html' in html_file:
            if 'api.js' in script_basenames and 'workspace.js' in script_basenames:
                api_idx = script_basenames.index('api.js')
                ws_idx = script_basenames.index('workspace.js')
                if api_idx > ws_idx:
                    findings["critical"].append({
                        "file": html_file,
                        "scope": "Script Loading Order",
                        "issue": "workspace.js is loaded before api.js.",
                        "impact": "CodeArenaAPI will be undefined when workspace.js attempts to fetch problem.",
                        "recommendation": "Load api.js before workspace.js."
                    })

    # -------------------------------------------------------------
    # AUDIT: Security - innerHTML usage and unescaped injections
    # -------------------------------------------------------------
    for js_path in js_files:
        if os.path.getsize(js_path) == 0:
            continue
        with open(js_path, 'r', encoding='utf-8') as f:
            js_code = f.read()

        inner_html_matches = re.finditer(r'([a-zA-Z0-9_\.]+)\.innerHTML\s*=\s*([^;\n]+);', js_code)
        for match in inner_html_matches:
            target = match.group(1)
            assignment = match.group(2).strip()
            # Check if assignment includes variable interpolation or template literals with potentially unsanitized data
            if '${' in assignment and not 'escapeHtml' in assignment and not 'sanitize' in assignment:
                # Find line number
                line_no = js_code[:match.start()].count('\n') + 1
                findings["medium"].append({
                    "file": js_path,
                    "scope": f"Security / DOM Injection (Line {line_no})",
                    "issue": f"`{target}.innerHTML = {assignment[:60]}...` uses template literal interpolation without explicit escapeHtml() wrapper.",
                    "impact": "Potential Cross-Site Scripting (XSS) if input contains user-generated or un-sanitized content.",
                    "recommendation": "Ensure all dynamic parameters interpolated into innerHTML pass through escapeHtml() or use textContent."
                })

    # -------------------------------------------------------------
    # AUDIT: LocalStorage and SessionStorage key consistency
    # -------------------------------------------------------------
    storage_keys = {}
    for js_path in js_files:
        if os.path.getsize(js_path) == 0:
            continue
        with open(js_path, 'r', encoding='utf-8') as f:
            js_code = f.read()

        # Find localStorage.getItem/setItem
        local_keys = re.findall(r'localStorage\.(?:getItem|setItem|removeItem)\([\'"]([a-zA-Z0-9_\-]+)[\'"]', js_code)
        session_keys = re.findall(r'sessionStorage\.(?:getItem|setItem|removeItem)\([\'"]([a-zA-Z0-9_\-]+)[\'"]', js_code)

        for k in set(local_keys):
            storage_keys.setdefault(f"local:{k}", []).append(os.path.basename(js_path))
        for k in set(session_keys):
            storage_keys.setdefault(f"session:{k}", []).append(os.path.basename(js_path))

    # -------------------------------------------------------------
    # AUDIT: Accessibility - Form labels, headings, buttons
    # -------------------------------------------------------------
    for html_file in html_files:
        with open(html_file, 'r', encoding='utf-8') as f:
            html = f.read()

        # Check for inputs without id or without corresponding label
        inputs = re.findall(r'<input\s+([^>]+)>', html)
        for inp_attrs in inputs:
            type_m = re.search(r'type=[\'"]([^\'"]+)[\'"]', inp_attrs)
            inp_type = type_m.group(1) if type_m else 'text'
            if inp_type in ['hidden', 'submit', 'button']:
                continue
            id_m = re.search(r'id=[\'"]([^\'"]+)[\'"]', inp_attrs)
            aria_lbl_m = re.search(r'aria-label=[\'"]([^\'"]+)[\'"]', inp_attrs)
            if not id_m and not aria_lbl_m:
                findings["medium"].append({
                    "file": html_file,
                    "scope": "Accessibility (WCAG 2.1)",
                    "issue": f"Input `<input {inp_attrs[:50]}...>` lacks both `id` and `aria-label`.",
                    "impact": "Screen readers cannot announce the purpose of the input control.",
                    "recommendation": "Add an `id` with associated `<label for='...'>` or provide `aria-label`."
                })
            elif id_m:
                inp_id = id_m.group(1)
                # Check if there is a <label for="inp_id">
                if not re.search(r'<label\s+[^>]*for=[\'"]' + re.escape(inp_id) + r'[\'"]', html) and not aria_lbl_m:
                    # check if enclosed in <label>
                    label_enclosed = re.search(r'<label\b[^>]*>(?:(?!</label>).)*?' + re.escape(inp_id), html, re.DOTALL)
                    if not label_enclosed:
                        findings["low"].append({
                            "file": html_file,
                            "scope": "Accessibility (WCAG 2.1)",
                            "issue": f"Input `#{inp_id}` has no matching `<label for='{inp_id}'>` and no `aria-label`.",
                            "impact": "Assistive technologies may fail to label the field properly.",
                            "recommendation": "Add a corresponding `<label for='{inp_id}'>` or `aria-label`."
                        })

    # -------------------------------------------------------------
    # AUDIT: CSS Rules - Fixed widths, high z-indices, overflow
    # -------------------------------------------------------------
    for css_path in css_files:
        if os.path.getsize(css_path) == 0:
            continue
        with open(css_path, 'r', encoding='utf-8') as f:
            css_code = f.read()

        # Check for hardcoded fixed pixel widths on major containers
        fixed_container_matches = re.findall(r'(\.[a-zA-Z0-9_\-]+)\s*\{[^}]*width:\s*(\d{4,}px);[^}]*\}', css_code)
        for selector, width_val in fixed_container_matches:
            findings["high"].append({
                "file": css_path,
                "scope": "Responsive Layout",
                "issue": f"Selector `{selector}` has hardcoded fixed width `{width_val}`.",
                "impact": "Causes horizontal viewport overflow on screens narrower than `{width_val}`.",
                "recommendation": "Use `max-width: {width_val}; width: 100%;`."
            })

        # Check for extreme z-indexes (> 10000)
        extreme_z = re.findall(r'(\.[a-zA-Z0-9_\-]+)\s*\{[^}]*z-index:\s*(\d{5,});[^}]*\}', css_code)
        for selector, z_val in extreme_z:
            findings["low"].append({
                "file": css_path,
                "scope": "CSS Stacking Context",
                "issue": f"Selector `{selector}` uses extreme z-index `{z_val}`.",
                "impact": "Creates uncontrolled stacking battles and modal bleed-through.",
                "recommendation": "Use standardized z-index tokens (e.g., dropdown: 100, header: 500, modal: 1000)."
            })

    return findings, storage_keys

if __name__ == '__main__':
    findings, storage_keys = run_comprehensive_audit()
    print("=== AUDIT SUMMARY ===")
    for sev in ["critical", "high", "medium", "low", "informational"]:
        print(f"{sev.upper()}: {len(findings[sev])} issues found")
    
    print("\n=== STORAGE KEYS INVENTORY ===")
    for k, files in sorted(storage_keys.items()):
        print(f"  {k:<35} accessed in: {', '.join(files)}")

    print("\n=== DETAILED FINDINGS ===")
    for sev in ["critical", "high", "medium", "low"]:
        if findings[sev]:
            print(f"\n--- {sev.upper()} ({len(findings[sev])}) ---")
            for item in findings[sev]:
                print(f"[{item['scope']}] {item['file']}: {item['issue']}")
                print(f"  Impact: {item['impact']}")
                print(f"  Fix: {item['recommendation']}\n")

