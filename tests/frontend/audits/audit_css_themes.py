
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

def check_themes_and_css():
    with open('frontend/css/styles.css', 'r', encoding='utf-8') as f:
        styles = f.read()

    has_light_theme = '[data-theme="light"]' in styles or "[data-theme='light']" in styles
    print(f"styles.css has data-theme='light': {has_light_theme}")

    # Check each css file for light theme overrides
    css_files = glob.glob('frontend/css/*.css')
    for c in css_files:
        with open(c, 'r', encoding='utf-8') as f:
            code = f.read()
        lt = code.count('data-theme="light"') + code.count("data-theme='light'")
        dk = code.count('data-theme="dark"') + code.count("data-theme='dark'")
        print(f"{c:<30} | Light theme rules: {lt:2} | Dark theme rules: {dk:2}")

if __name__ == '__main__':
    check_themes_and_css()

