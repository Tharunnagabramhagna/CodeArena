
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

def audit_css_components():
    css_files = sorted(glob.glob('frontend/css/*.css'))

    print("=== 1. BUTTON STYLING COMPARISON ===")
    btn_props = {}
    for c in css_files:
        with open(c, 'r', encoding='utf-8') as f:
            text = f.read()
        matches = re.finditer(r'(\.[a-zA-Z0-9_\-\.\s,]+(?:btn|button)[a-zA-Z0-9_\-\.\s,]*)\s*\{([^}]+)\}', text)
        for m in matches:
            sel = m.group(1).strip()
            body = m.group(2)
            height_m = re.search(r'(?<![a-z-])height:\s*([^;]+);', body)
            padding_m = re.search(r'padding:\s*([^;]+);', body)
            radius_m = re.search(r'border-radius:\s*([^;]+);', body)
            font_size_m = re.search(r'font-size:\s*([^;]+);', body)
            if height_m or padding_m or radius_m:
                btn_props.setdefault(c, []).append({
                    "selector": sel[:35],
                    "height": height_m.group(1).strip() if height_m else "auto",
                    "padding": padding_m.group(1).strip() if padding_m else "inherit",
                    "radius": radius_m.group(1).strip() if radius_m else "inherit",
                    "font_size": font_size_m.group(1).strip() if font_size_m else "inherit"
                })

    for c, items in btn_props.items():
        print(f"\nStylesheet: {c}")
        for item in items[:6]:
            print(f"  {item['selector']:<35} | h: {item['height']:<8} | pad: {item['padding']:<16} | r: {item['radius']:<18} | fs: {item['font_size']}")

    print("\n=== 2. INPUT & SELECT STYLING COMPARISON ===")
    input_props = {}
    for c in css_files:
        with open(c, 'r', encoding='utf-8') as f:
            text = f.read()
        matches = re.finditer(r'(\.[a-zA-Z0-9_\-\.\s,]+(?:input|select|search)[a-zA-Z0-9_\-\.\s,]*)\s*\{([^}]+)\}', text)
        for m in matches:
            sel = m.group(1).strip()
            body = m.group(2)
            h_m = re.search(r'(?<![a-z-])height:\s*([^;]+);', body)
            p_m = re.search(r'padding:\s*([^;]+);', body)
            r_m = re.search(r'border-radius:\s*([^;]+);', body)
            bg_m = re.search(r'background(?:-color)?:\s*([^;]+);', body)
            if h_m or p_m:
                input_props.setdefault(c, []).append({
                    "selector": sel[:35],
                    "height": h_m.group(1).strip() if h_m else "auto",
                    "padding": p_m.group(1).strip() if p_m else "inherit",
                    "radius": r_m.group(1).strip() if r_m else "inherit",
                    "bg": bg_m.group(1).strip() if bg_m else "inherit"
                })

    for c, items in input_props.items():
        print(f"\nStylesheet: {c}")
        for item in items[:6]:
            print(f"  {item['selector']:<35} | h: {item['height']:<8} | pad: {item['padding']:<16} | r: {item['radius']:<18} | bg: {item['bg']}")

    print("\n=== 3. HARDCODED COLORS AUDIT ===")
    for c in css_files:
        with open(c, 'r', encoding='utf-8') as f:
            text = f.read()
        # Find hex colors that are NOT inside :root variable declarations
        non_root_text = re.sub(r':root\s*\{[^}]+\}', '', text)
        non_root_text = re.sub(r'\[data-theme=["\']light["\']\]\s*\{[^}]+\}', '', non_root_text)
        hardcoded_hex = re.findall(r'#[0-9a-fA-F]{3,8}\b', non_root_text)
        unique_hex = set(hardcoded_hex)
        print(f"{c:<30} | Hardcoded hex occurrences: {len(hardcoded_hex):3} ({len(unique_hex)} unique)")
        if len(unique_hex) > 0:
            print(f"   Examples: {list(unique_hex)[:8]}")

if __name__ == '__main__':
    audit_css_components()

