
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

def audit_shared_components():
    files = {
        'styles': 'frontend/css/styles.css',
        'compiler': 'frontend/css/compiler.css',
        'problems': 'frontend/css/problems.css',
        'workspace': 'frontend/css/workspace.css',
        'dashboard': 'frontend/css/dashboard.css',
        'auth': 'frontend/css/auth.css'
    }

    print("=== 1. HEADER DIMENSIONS & DISPLAY ===")
    headers = [
        ('Landing', 'styles', r'\.landing-header\s*\{([^}]+)\}'),
        ('Dashboard', 'dashboard', r'\.dashboard-header\s*\{([^}]+)\}'),
        ('Compiler', 'compiler', r'\.compiler-header\s*\{([^}]+)\}'),
        ('Problems', 'problems', r'\.problems-header\s*\{([^}]+)\}'),
        ('Workspace', 'workspace', r'\.workspace-header\s*\{([^}]+)\}'),
        ('Auth', 'auth', r'\.auth-header\s*\{([^}]+)\}')
    ]
    for name, fkey, pattern in headers:
        with open(files[fkey], 'r', encoding='utf-8') as f:
            text = f.read()
        m = re.search(pattern, text)
        if m:
            body = m.group(1)
            h = re.search(r'(?<![a-z-])height:\s*([^;]+);', body)
            pad = re.search(r'padding:\s*([^;]+);', body)
            bg = re.search(r'background(?:-color)?:\s*([^;]+);', body)
            border = re.search(r'border-bottom:\s*([^;]+);', body)
            print(f"{name:<12} | h: {h.group(1).strip() if h else 'auto':<10} | pad: {pad.group(1).strip() if pad else 'none':<16} | bg: {bg.group(1).strip() if bg else 'none':<25} | border: {border.group(1).strip() if border else 'none'}")

    print("\n=== 2. MODAL DIALOGS COMPARISON ===")
    modals = [
        ('Compiler', 'compiler', r'\.compiler-modal-overlay\s*\{([^}]+)\}', r'\.compiler-modal-card\s*\{([^}]+)\}'),
        ('Workspace', 'workspace', r'\.workspace-modal-overlay\s*\{([^}]+)\}', r'\.workspace-modal-card\s*\{([^}]+)\}')
    ]
    for name, fkey, overlay_pat, card_pat in modals:
        with open(files[fkey], 'r', encoding='utf-8') as f:
            text = f.read()
        om = re.search(overlay_pat, text)
        cm = re.search(card_pat, text)
        bg = re.search(r'background(?:-color)?:\s*([^;]+);', om.group(1)) if om else None
        radius = re.search(r'border-radius:\s*([^;]+);', cm.group(1)) if cm else None
        shadow = re.search(r'box-shadow:\s*([^;]+);', cm.group(1)) if cm else None
        print(f"{name:<12} | overlay bg: {bg.group(1).strip() if bg else 'none':<22} | card radius: {radius.group(1).strip() if radius else 'none':<18} | card shadow: {shadow.group(1).strip() if shadow else 'none'}")

    print("\n=== 3. TOAST NOTIFICATIONS COMPARISON ===")
    toasts = [
        ('Compiler', 'compiler', r'\.compiler-toast\s*\{([^}]+)\}'),
        ('Workspace', 'workspace', r'\.workspace-toast\s*\{([^}]+)\}')
    ]
    for name, fkey, pat in toasts:
        with open(files[fkey], 'r', encoding='utf-8') as f:
            text = f.read()
        m = re.search(pat, text)
        if m:
            body = m.group(1)
            pos = re.search(r'bottom:\s*([^;]+);', body)
            pad = re.search(r'padding:\s*([^;]+);', body)
            radius = re.search(r'border-radius:\s*([^;]+);', body)
            shadow = re.search(r'box-shadow:\s*([^;]+);', body)
            print(f"{name:<12} | bottom: {pos.group(1).strip() if pos else 'none':<8} | pad: {pad.group(1).strip() if pad else 'none':<14} | radius: {radius.group(1).strip() if radius else 'none':<18} | shadow: {shadow.group(1).strip() if shadow else 'none'}")

    print("\n=== 4. THEME TOGGLE BUTTON COMPARISON ===")
    toggles = [
        ('Styles (Base)', 'styles', r'\.theme-toggle\s*\{([^}]+)\}'),
        ('Dashboard', 'dashboard', r'\.theme-toggle\s*\{([^}]+)\}'),
        ('Compiler', 'compiler', r'\.theme-toggle\s*\{([^}]+)\}'),
        ('Problems', 'problems', r'\.theme-toggle\s*\{([^}]+)\}'),
        ('Workspace', 'workspace', r'\.theme-toggle\s*\{([^}]+)\}')
    ]
    for name, fkey, pat in toggles:
        with open(files[fkey], 'r', encoding='utf-8') as f:
            text = f.read()
        m = re.search(pat, text)
        if m:
            body = m.group(1)
            w = re.search(r'(?<![a-z-])width:\s*([^;]+);', body)
            h = re.search(r'(?<![a-z-])height:\s*([^;]+);', body)
            radius = re.search(r'border-radius:\s*([^;]+);', body)
            fs = re.search(r'font-size:\s*([^;]+);', body)
            print(f"{name:<15} | w: {w.group(1).strip() if w else 'auto':<8} | h: {h.group(1).strip() if h else 'auto':<8} | radius: {radius.group(1).strip() if radius else 'none':<18} | fs: {fs.group(1).strip() if fs else 'inherit'}")
        else:
            print(f"{name:<15} | Inherits base .theme-toggle from styles.css")

if __name__ == '__main__':
    audit_shared_components()

