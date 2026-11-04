
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
import glob
import re

def audit_headers_and_nav():
    pages = sorted(glob.glob('frontend/**/*.html', recursive=True) + glob.glob('frontend/*.html'))
    pages = list(dict.fromkeys(pages))

    print(f"{'Page':<25} | {'Header Class':<25} | {'Logo Img Src':<35} | {'Logo Img Height':<15} | {'Theme Toggle':<15} | {'Footer':<10}")
    print("-" * 135)

    for p in pages:
        with open(p, 'r', encoding='utf-8') as f:
            html = f.read()

        p_name = os.path.basename(p)

        # 1. Header
        header_m = re.search(r'<header\b[^>]*class=[\'"]([^\'"]+)[\'"]', html)
        header_cls = header_m.group(1) if header_m else "None"

        # 2. Logo image
        logo_img_m = re.search(r'<img\s+[^>]*src=[\'"]([^\'"]+)[\'"][^>]*class=[\'"]([^\'"]+)[\'"][^>]*>', html)
        if not logo_img_m:
            logo_img_m = re.search(r'<img\s+[^>]*class=[\'"]([^\'"]+)[\'"][^>]*src=[\'"]([^\'"]+)[\'"][^>]*>', html)
            if logo_img_m:
                logo_src = logo_img_m.group(2)
                logo_cls = logo_img_m.group(1)
            else:
                logo_src = "None"
                logo_cls = "None"
        else:
            logo_src = logo_img_m.group(1)
            logo_cls = logo_img_m.group(2)

        # Logo height style or attribute
        logo_tag_m = re.search(r'<img\s+[^>]*' + re.escape(logo_src) + r'[^>]*>', html) if logo_src != "None" else None
        logo_tag = logo_tag_m.group(0) if logo_tag_m else ""
        style_h = re.search(r'height:\s*([^;\'"]+)', logo_tag)
        height_val = style_h.group(1) if style_h else f"class:{logo_cls}"

        # 3. Theme toggle
        has_theme_toggle = 'class="theme-toggle"' in html or "class='theme-toggle'" in html

        # 4. Footer
        has_footer = '<footer' in html

        print(f"{p_name:<25} | {header_cls:<25} | {logo_src:<35} | {height_val:<15} | {str(has_theme_toggle):<15} | {str(has_footer):<10}")

if __name__ == '__main__':
    audit_headers_and_nav()

