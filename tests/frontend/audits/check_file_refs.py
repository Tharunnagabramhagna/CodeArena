
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

def search_repo_for_files():
    targets = ['components.css', 'practice.js']
    found_refs = {t: [] for t in targets}
    
    for root, dirs, files in os.walk('.'):
        # skip .git, scratch, node_modules
        if '.git' in root or 'scratch' in root or 'node_modules' in root:
            continue
        for f in files:
            path = os.path.join(root, f)
            try:
                with open(path, 'r', encoding='utf-8', errors='ignore') as file:
                    content = file.read()
                for t in targets:
                    if t in content:
                        found_refs[t].append(path)
            except Exception:
                pass

    for t, refs in found_refs.items():
        print(f"References to '{t}': {len(refs)}")
        for r in refs:
            print(f"  in {r}")

if __name__ == '__main__':
    search_repo_for_files()

