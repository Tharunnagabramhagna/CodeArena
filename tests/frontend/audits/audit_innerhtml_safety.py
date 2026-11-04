
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

def audit_inner_html_safety():
    js_files = ['frontend/js/auth.js', 'frontend/js/compiler.js', 'frontend/js/problems.js', 'frontend/js/workspace.js']
    for f in js_files:
        with open(f, 'r', encoding='utf-8') as file:
            lines = file.readlines()
        print(f"\n=== {f} ===")
        for i, line in enumerate(lines):
            if '.innerHTML' in line:
                print(f"Line {i+1:4}: {line.strip()[:100]}")

if __name__ == '__main__':
    audit_inner_html_safety()

