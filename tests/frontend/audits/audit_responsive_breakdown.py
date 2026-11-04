
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

import glob
import re

def audit_responsive():
    css_files = {
        'styles': 'frontend/css/styles.css',
        'pages': 'frontend/css/pages.css',
        'dashboard': 'frontend/css/dashboard.css',
        'compiler': 'frontend/css/compiler.css',
        'problems': 'frontend/css/problems.css',
        'workspace': 'frontend/css/workspace.css',
        'auth': 'frontend/css/auth.css'
    }

    viewports = [1440, 1366, 1280, 1024, 768, 640, 390]

    # Collect all media queries per file
    all_mq = {}
    for key, path in css_files.items():
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        mqs = re.finditer(r'@media\s*\(([^{]+)\)\s*\{', content)
        for m in mqs:
            all_mq.setdefault(key, []).append(m.group(1).strip())

    print("=== MEDIA QUERIES DEFINED PER STYLESHEET ===")
    for key, mqs in all_mq.items():
        print(f"\nStylesheet: {key}.css")
        for q in sorted(set(mqs)):
            print(f"  @media ({q})")

if __name__ == '__main__':
    audit_responsive()

