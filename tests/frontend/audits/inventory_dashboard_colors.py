
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

def inventory():
    with open('frontend/css/dashboard.css', 'r', encoding='utf-8') as f:
        content = f.read()

    # Split into dark theme (before line with [data-theme="light"]) and light theme
    parts = content.split('[data-theme="light"]')
    dark_section = parts[0]
    light_section = '[data-theme="light"]' + '[data-theme="light"]'.join(parts[1:])

    print("=== DARK THEME HEX COLORS ===")
    dark_matches = re.findall(r'([^{}]+)\{([^}]+)\}', dark_section)
    for sel, body in dark_matches:
        hexes = re.findall(r'#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b', body)
        if hexes:
            clean_sel = ' '.join(sel.strip().split())
            print(f"{clean_sel}")
            for line in body.splitlines():
                if any(h in line for h in hexes):
                    print(f"    {line.strip()}")

    print("\n" + "="*50 + "\n")
    print("=== LIGHT THEME OVERRIDES ===")
    light_matches = re.findall(r'([^{}]+)\{([^}]+)\}', light_section)
    for sel, body in light_matches:
        hexes = re.findall(r'#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b', body)
        if hexes:
            clean_sel = ' '.join(sel.strip().split())
            print(f"{clean_sel}")
            for line in body.splitlines():
                if any(h in line for h in hexes):
                    print(f"    {line.strip()}")

if __name__ == '__main__':
    inventory()

