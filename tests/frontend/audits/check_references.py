# check_references.py

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
import sys

html_files = [
    'frontend/index.html',
    'frontend/pages/ai_assistant.html',
    'frontend/pages/bookmarks.html',
    'frontend/pages/compiler.html',
    'frontend/pages/contests.html',
    'frontend/pages/dashboard.html',
    'frontend/pages/learn.html',
    'frontend/pages/login.html',
    'frontend/pages/practice.html',
    'frontend/pages/problem.html',
    'frontend/pages/problems.html',
    'frontend/pages/progress.html',
    'frontend/pages/settings.html',
    'frontend/pages/signup.html',
    'frontend/pages/submissions.html'
]

broken = 0
for hf in html_files:
    dir_path = os.path.dirname(hf)
    with open(hf, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # check src="..." and href="..."
    matches = re.findall(r'(?:src|href)=["\']([^"\']+)["\']', content)
    for ref in matches:
        # Ignore external links, mailto, javascript, fragments, templates
        if ref.startswith(('http://', 'https://', 'mailto:', 'javascript:', '#', 'data:')) or '${' in ref:
            continue
        # Strip query params
        clean_ref = ref.split('?')[0].split('#')[0]
        if not clean_ref:
            continue
        resolved_path = os.path.normpath(os.path.join(dir_path, clean_ref))
        if not os.path.exists(resolved_path):
            print(f"[BROKEN] In {hf}: {ref} -> {resolved_path} does not exist!")
            broken += 1

if broken == 0:
    print(f"All references across {len(html_files)} HTML pages resolved successfully!")
else:
    print(f"Found {broken} broken references!")
    sys.exit(1)

