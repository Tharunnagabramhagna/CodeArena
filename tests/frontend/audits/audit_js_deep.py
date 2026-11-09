
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

def audit_javascript_deep():
    js_files = glob.glob('frontend/js/*.js')
    
    report = {
        "event_listeners": {},
        "global_variables": {},
        "null_check_issues": [],
        "try_catch_blocks": {},
        "inner_html_usages": {},
        "storage_usages": {}
    }

    for f in sorted(js_files):
        if os.path.getsize(f) == 0:
            continue
        with open(f, 'r', encoding='utf-8') as file:
            code = file.read()

        fname = os.path.basename(f)
        
        # 1. Count event listeners
        listeners = re.findall(r'\.addEventListener\([\'"]([a-zA-Z]+)[\'"]', code)
        remove_listeners = re.findall(r'\.removeEventListener\([\'"]([a-zA-Z]+)[\'"]', code)
        report["event_listeners"][fname] = {
            "add": len(listeners),
            "remove": len(remove_listeners),
            "events": set(listeners)
        }

        # 2. Check innerHTML assignments
        inners = re.findall(r'(\.innerHTML\s*=\s*[^;\n]+)', code)
        report["inner_html_usages"][fname] = len(inners)

        # 3. Check try-catch blocks
        trys = re.findall(r'\btry\s*\{', code)
        report["try_catch_blocks"][fname] = len(trys)

        # 4. Check getElementById without null-check right before use
        # e.g., document.getElementById('x').something
        direct_derefs = re.findall(r'document\.getElementById\([\'"]([^\'"]+)[\'"]\)\.([a-zA-Z]+)', code)
        if direct_derefs:
            report["null_check_issues"].append((fname, direct_derefs))

    return report

if __name__ == '__main__':
    r = audit_javascript_deep()
    print("=== JAVASCRIPT EVENT LISTENERS & LIFECYCLE ===")
    for fname, d in r["event_listeners"].items():
        print(f"{fname:<15} | addEventListener: {d['add']:2} | removeEventListener: {d['remove']:2} | Events: {', '.join(sorted(d['events']))}")

    print("\n=== DIRECT DEREFERENCES WITHOUT NULL CHECK ===")
    if not r["null_check_issues"]:
        print("None! All getElementById results are checked or properly guarded.")
    else:
        for fname, derefs in r["null_check_issues"]:
            print(f"{fname}: {derefs}")

    print("\n=== INNERHTML USAGE BY FILE ===")
    for fname, count in r["inner_html_usages"].items():
        print(f"{fname:<15} | innerHTML assignments: {count}")

    print("\n=== TRY/CATCH BLOCKS BY FILE ===")
    for fname, count in r["try_catch_blocks"].items():
        print(f"{fname:<15} | try/catch blocks: {count}")

