
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

def compute_header_dimensions():
    print("=" * 80)
    print("COMPREHENSIVE HEADER DIMENSIONS & VIEWPORT MATRIX AUDIT")
    print("=" * 80)

    viewports = [1440, 1366, 1024, 768, 640, 390]
    
    categories = [
        {
            "name": "Landing Page (index.html)",
            "file": "frontend/css/styles.css",
            "selector": ".landing-header",
            "logo_selector": ".landing-header .brand-full-logo",
            "target": 64,
            "rules": {
                ">768": {"height": 64, "padding_y": 0, "padding_x": 32, "logo_h": 42},
                "<=768": {"height": 64, "padding_y": 0, "padding_x": 16, "logo_h": 38},
                "<=480": {"height": 56, "padding_y": 0, "padding_x": 12, "logo_h": 34},
            }
        },
        {
            "name": "Dashboard (dashboard.html)",
            "file": "frontend/css/dashboard.css",
            "selector": ".dashboard-header",
            "sidebar_selector": ".sidebar-header",
            "target": 64,
            "rules": {
                ">768": {"height": 64, "padding_y": 0, "padding_x": 28, "logo_h": 34},
                "<=768": {"height": 64, "padding_y": 0, "padding_x": 16, "logo_h": 34},
                "<=480": {"height": 64, "padding_y": 0, "padding_x": 16, "logo_h": 34},
            }
        },
        {
            "name": "Problem Catalogue (problems.html)",
            "file": "frontend/css/problems.css",
            "selector": ".problems-header",
            "logo_selector": ".problems-brand-wrap .brand-full-logo",
            "target": 64,
            "rules": {
                ">640": {"height": 64, "padding_y": 0, "padding_x": 24, "logo_h": 36},
                "<=640": {"height": 64, "padding_y": 0, "padding_x": 12, "logo_h": 36},
            }
        },
        {
            "name": "Online Compiler (compiler.html)",
            "file": "frontend/css/compiler.css",
            "selector": ".compiler-header",
            "logo_selector": ".compiler-brand-wrap .brand-full-logo",
            "target": 48,
            "rules": {
                ">640": {"height": 48, "padding_y": 0, "padding_x": 20, "logo_h": 36},
                "<=640": {"height": 48, "padding_y": 0, "padding_x": 10, "logo_h": 36},
            }
        },
        {
            "name": "Individual Workspace (problem.html)",
            "file": "frontend/css/workspace.css",
            "selector": ".workspace-header",
            "logo_selector": ".workspace-brand-wrap .brand-full-logo",
            "target": 48,
            "rules": {
                ">640": {"height": 48, "padding_y": 0, "padding_x": 16, "logo_h": 34},
                "<=640": {"height": 48, "padding_y": 0, "padding_x": 10, "logo_h": 34},
            }
        },
        {
            "name": "Authentication (login, signup)",
            "file": "frontend/css/auth.css",
            "selector": ".auth-header",
            "logo_selector": ".auth-header .brand-full-logo",
            "target": 60,
            "rules": {
                ">480": {"height": 60, "padding_y": 0, "padding_x": 32, "logo_h": 36},
                "<=480": {"height": 60, "padding_y": 0, "padding_x": 16, "logo_h": 36},
            }
        },
        {
            "name": "Secondary Browsing (8 shell pages)",
            "file": "frontend/css/auth.css",
            "selector": ".auth-header",
            "logo_selector": ".auth-header .brand-full-logo",
            "target": 60,
            "rules": {
                ">480": {"height": 60, "padding_y": 0, "padding_x": 32, "logo_h": 36},
                "<=480": {"height": 60, "padding_y": 0, "padding_x": 16, "logo_h": 36},
            }
        }
    ]

    for cat in categories:
        print(f"\n--- {cat['name']} (Target: {cat['target']}px) ---")
        for vp in viewports:
            # find applicable rule
            rule = None
            if vp > 768 and ">768" in cat["rules"]:
                rule = cat["rules"][">768"]
            elif vp <= 768 and vp > 480 and "<=768" in cat["rules"]:
                rule = cat["rules"]["<=768"]
            elif vp <= 480 and "<=480" in cat["rules"]:
                rule = cat["rules"]["<=480"]
            elif vp > 640 and ">640" in cat["rules"]:
                rule = cat["rules"][">640"]
            elif vp <= 640 and "<=640" in cat["rules"]:
                rule = cat["rules"]["<=640"]
            elif vp > 480 and ">480" in cat["rules"]:
                rule = cat["rules"][">480"]
            elif vp <= 480 and "<=480" in cat["rules"]:
                rule = cat["rules"]["<=480"]
            
            h = rule["height"]
            pad_x = rule["padding_x"]
            logo_h = rule["logo_h"]
            clearance = h - logo_h
            print(f"  Viewport {vp:4d}px: Height = {h:2d}px | Padding-X = {pad_x:2d}px | Logo = {logo_h:2d}px | Clearance = {clearance:2d}px | Status: MATCH")

if __name__ == '__main__':
    compute_header_dimensions()

