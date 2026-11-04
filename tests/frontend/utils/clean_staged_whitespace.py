# clean_staged_whitespace.py

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

import re

files_to_clean = [
    'frontend/js/ai_assistant.js',
    'frontend/js/bookmarks.js',
    'frontend/js/contests.js',
    'frontend/js/learn.js',
    'frontend/js/problems.js',
    'frontend/js/progress.js',
    'frontend/js/settings.js',
    'frontend/js/submissions.js',
    'frontend/js/toast.js',
    'frontend/js/workspace.js',
    'frontend/pages/problem.html',
    'frontend/vendor/codemirror/lib/codemirror.css'
]

for p in files_to_clean:
    with open(p, 'r', encoding='utf-8') as f:
        text = f.read()
    # Strip trailing whitespace on each line
    lines = [re.sub(r'[ \t]+$', '', line) for line in text.splitlines()]
    text = '\n'.join(lines).rstrip() + '\n'
    with open(p, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f"Cleaned {p}")

