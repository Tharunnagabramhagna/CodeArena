
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

def audit_typography():
    css_files = sorted(glob.glob('frontend/css/*.css'))
    print("=== TYPOGRAPHY & FONT-FAMILY DECLARATIONS ===")
    for c in css_files:
        with open(c, 'r', encoding='utf-8') as f:
            text = f.read()
        fonts = re.findall(r'font-family:\s*([^;]+);', text)
        print(f"\n{c} ({len(fonts)} declarations):")
        for f in set(fonts):
            print(f"  {f.strip()}")

if __name__ == '__main__':
    audit_typography()

