# clean_eof.py

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

files_to_clean = [
    'frontend/css/compiler.css',
    'frontend/js/api.js',
    'frontend/pages/ai_assistant.html',
    'frontend/pages/compiler.html',
    'frontend/pages/learn.html',
    'frontend/pages/problems.html',
    'frontend/pages/progress.html'
]

for p in files_to_clean:
    with open(p, 'r', encoding='utf-8') as f:
        text = f.read()
    # strip all trailing newlines and whitespace at the end, then add single newline
    text = text.rstrip() + '\n'
    with open(p, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f"Fixed EOF in {p}")

