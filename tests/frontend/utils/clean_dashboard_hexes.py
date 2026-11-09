
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

with open('frontend/css/dashboard.css', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('/* ==========================================================================\n   Phase 6: Dashboard Search Suggestions & Notification Improvements')
if idx != -1:
    main_part = text[:idx]
    phase6_part = text[idx:]
    
    # Replace hexes in phase6_part with CSS custom properties
    replacements = [
        ('#0d1527', 'var(--color-bg-secondary)'),
        ('#1e293b', 'var(--color-border)'),
        ('#f8fafc', 'var(--color-text-primary)'),
        ('#94a3b8', 'var(--color-text-muted)'),
        ('#6366f1', 'var(--color-primary)'),
        ('#818cf8', 'var(--color-primary)'),
        ('#22c55e', 'var(--color-success)'),
        ('#ef4444', 'var(--color-error)'),
        ('#f59e0b', 'var(--color-warning)'),
        ('#fff', 'var(--color-text-primary)'),
    ]
    for old_val, new_val in replacements:
        phase6_part = phase6_part.replace(old_val, new_val)
    
    with open('frontend/css/dashboard.css', 'w', encoding='utf-8') as f:
        f.write(main_part + phase6_part)
    print("Replaced hexes in Phase 6 section of dashboard.css")
else:
    print("Phase 6 section not found in dashboard.css")

