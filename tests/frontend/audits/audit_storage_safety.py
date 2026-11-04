
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

def audit_storage():
    js_files = glob.glob('frontend/js/*.js')
    
    for f in sorted(js_files):
        if os.path.getsize(f) == 0:
            continue
        with open(f, 'r', encoding='utf-8') as file:
            lines = file.readlines()
        
        for i, line in enumerate(lines):
            if 'localStorage.' in line or 'sessionStorage.' in line:
                surrounding = ''.join(lines[max(0, i-6):min(len(lines), i+6)])
                has_try = 'try' in surrounding or 'catch' in surrounding
                print(f"{os.path.basename(f):<15} Line {i+1:4} | has try/catch: {str(has_try):<5} | {line.strip()[:60]}")

if __name__ == '__main__':
    audit_storage()
