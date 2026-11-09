
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

pages = sorted(glob.glob('frontend/**/*.html', recursive=True) + glob.glob('frontend/*.html'))
pages = list(dict.fromkeys(pages))
for p in pages:
    with open(p, 'r', encoding='utf-8') as f:
        text = f.read()
    links = re.findall(r'<link[^>]*rel=["\']stylesheet["\'][^>]*href=["\']([^"\']*)["\']', text)
    print(f'{p}: {links}')

