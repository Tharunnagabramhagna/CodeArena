
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

def audit_truth_in_advertising():
    files = glob.glob('frontend/**/*.html', recursive=True) + glob.glob('frontend/js/*.js')
    
    honest_phrases = [
        "Provisional",
        "Preview",
        "Frontend Demonstration",
        "Temporary Session",
        "Structural Syntax Check",
        "Phase 4",
        "Phase 3",
        "Phase 5",
        "Guest Session"
    ]

    print("=== TRUTH IN ADVERTISING / HONEST MESSAGING AUDIT ===")
    for f in sorted(files):
        with open(f, 'r', encoding='utf-8') as file:
            text = file.read()
        
        found = [p for p in honest_phrases if p.lower() in text.lower()]
        if found:
            print(f"{f:<35} | Honest indicators present: {', '.join(found)}")

if __name__ == '__main__':
    audit_truth_in_advertising()

