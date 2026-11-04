
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

def audit_navigation_journeys():
    pages = sorted(glob.glob('frontend/**/*.html', recursive=True) + glob.glob('frontend/*.html'))
    pages = list(dict.fromkeys(pages))

    journeys = [
        ("Landing page to Dashboard", "frontend/index.html", "dashboard.html"),
        ("Landing page to Login", "frontend/index.html", "login.html"),
        ("Landing page to Sign Up", "frontend/index.html", "signup.html"),
        ("Dashboard to Compiler", "frontend/pages/dashboard.html", "compiler.html"),
        ("Dashboard to Problems", "frontend/pages/dashboard.html", "problems.html"),
        ("Dashboard to Practice", "frontend/pages/dashboard.html", "practice.html"),
        ("Problems catalogue to Workspace", "frontend/pages/problems.html", "problem.html"),
        ("Problem workspace back to Problems", "frontend/pages/problem.html", "problems.html"),
        ("Logo back to Homepage", "ALL_PAGES", "index.html")
    ]

    print("=== NAVIGATION JOURNEY VERIFICATION ===")
    for desc, source, target in journeys:
        if source == "ALL_PAGES":
            pages_to_test = pages
        else:
            pages_to_test = [source]

        for p in pages_to_test:
            if not os.path.exists(p):
                print(f"[FAIL] Source page not found: {p}")
                continue
            with open(p, 'r', encoding='utf-8') as f:
                content = f.read()

            # Find links containing target
            links = re.findall(r'<a\s+[^>]*href=[\'"]([^\'"]+)[\'"]', content)
            matched = [l for l in links if target in l]
            if matched:
                # verify that the relative path actually resolves
                p_dir = os.path.dirname(p)
                for m in matched:
                    clean = m.split('?')[0].split('#')[0]
                    resolved = os.path.normpath(os.path.join(p_dir, clean))
                    if not os.path.exists(resolved):
                        print(f"[FAIL] {desc} from {p}: link '{m}' resolves to nonexistent '{resolved}'")
                    else:
                        pass
            else:
                if source != "ALL_PAGES":
                    print(f"[WARN] {desc} from {p}: no link containing '{target}' found!")

    print("All specific navigation journeys checked.")

if __name__ == '__main__':
    audit_navigation_journeys()

