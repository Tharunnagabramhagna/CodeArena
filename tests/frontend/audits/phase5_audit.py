# phase5_audit.py

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
import urllib.parse

PAGES = [
    'frontend/index.html',
    'frontend/pages/dashboard.html',
    'frontend/pages/login.html',
    'frontend/pages/signup.html',
    'frontend/pages/problems.html',
    'frontend/pages/practice.html',
    'frontend/pages/problem.html',
    'frontend/pages/compiler.html',
    'frontend/pages/ai_assistant.html',
    'frontend/pages/bookmarks.html',
    'frontend/pages/contests.html',
    'frontend/pages/learn.html',
    'frontend/pages/progress.html',
    'frontend/pages/settings.html',
    'frontend/pages/submissions.html'
]

CANONICAL_IDS = [
    'two-sum', 'reverse-string', 'valid-parentheses', 'merge-k-sorted-lists',
    'binary-search', 'palindrome-number', 'maximum-subarray', 'linked-list-cycle',
    'invert-binary-tree', 'climbing-stairs', 'longest-substring-without-repeating',
    'trapping-rain-water'
]

print("=" * 70)
print("PHASE 5: COMPREHENSIVE 15-PAGE INTEGRATION & LINK AUDIT")
print("=" * 70)

broken_links = []
broken_assets = []
broken_scripts = []
broken_stylesheets = []
invalid_problem_links = []
missing_theme_toggle = []
missing_theme_script = []

for page_path in PAGES:
    if not os.path.exists(page_path):
        print(f"[MISSING PAGE] {page_path}")
        continue
    
    with open(page_path, 'r', encoding='utf-8') as f:
        content = f.read()

    page_dir = os.path.dirname(page_path)

    # 1. Check Stylesheets
    css_matches = re.findall(r'<link[^>]+rel=["\']stylesheet["\'][^>]+href=["\']([^"\']+)["\']', content, re.I)
    css_matches += re.findall(r'<link[^>]+href=["\']([^"\']+)["\'][^>]+rel=["\']stylesheet["\']', content, re.I)
    for css in css_matches:
        if css.startswith(('http://', 'https://', '//')):
            continue
        clean_css = css.split('?')[0].split('#')[0]
        target = os.path.normpath(os.path.join(page_dir, clean_css))
        if not os.path.exists(target):
            broken_stylesheets.append((page_path, css, target))

    # 2. Check Scripts
    js_matches = re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', content, re.I)
    for js in js_matches:
        if js.startswith(('http://', 'https://', '//')):
            continue
        clean_js = js.split('?')[0].split('#')[0]
        target = os.path.normpath(os.path.join(page_dir, clean_js))
        if not os.path.exists(target):
            broken_scripts.append((page_path, js, target))

    # 3. Check Images
    img_matches = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', content, re.I)
    for img in img_matches:
        if img.startswith(('http://', 'https://', '//', 'data:')):
            continue
        clean_img = img.split('?')[0].split('#')[0]
        target = os.path.normpath(os.path.join(page_dir, clean_img))
        if not os.path.exists(target):
            broken_assets.append((page_path, img, target))

    # 4. Check Links (a href)
    link_matches = re.findall(r'<a[^>]+href=["\']([^"\']+)["\']', content, re.I)
    for link in link_matches:
        if link.startswith(('http://', 'https://', '//', 'mailto:', 'tel:', 'javascript:', '#')):
            continue
        # Check problem ID if link contains problem.html?id=
        if 'problem.html?id=' in link:
            parsed = urllib.parse.urlparse(link)
            qs = urllib.parse.parse_qs(parsed.query)
            pid = qs.get('id', [''])[0]
            if pid not in CANONICAL_IDS:
                invalid_problem_links.append((page_path, link, pid))

        clean_link = link.split('?')[0].split('#')[0]
        if not clean_link:
            continue
        target = os.path.normpath(os.path.join(page_dir, clean_link))
        if not os.path.exists(target):
            broken_links.append((page_path, link, target))

    # 5. Check Theme
    if 'theme.js' not in content:
        missing_theme_script.append(page_path)
    if 'theme-toggle' not in content and 'themeToggle' not in content:
        missing_theme_toggle.append(page_path)

print(f"\n1. Broken Stylesheets ({len(broken_stylesheets)}):")
for p, ref, tgt in broken_stylesheets:
    print(f"   [FAIL] In {p}: {ref} -> {tgt}")
if not broken_stylesheets:
    print("   [OK] Zero broken stylesheets.")

print(f"\n2. Broken Scripts ({len(broken_scripts)}):")
for p, ref, tgt in broken_scripts:
    print(f"   [FAIL] In {p}: {ref} -> {tgt}")
if not broken_scripts:
    print("   [OK] Zero broken scripts.")

print(f"\n3. Broken Image Assets ({len(broken_assets)}):")
for p, ref, tgt in broken_assets:
    print(f"   [FAIL] In {p}: {ref} -> {tgt}")
if not broken_assets:
    print("   [OK] Zero broken image assets.")

print(f"\n4. Broken Navigation Links ({len(broken_links)}):")
for p, ref, tgt in broken_links:
    print(f"   [FAIL] In {p}: {ref} -> {tgt}")
if not broken_links:
    print("   [OK] Zero broken navigation links.")

print(f"\n5. Invalid Problem ID Links ({len(invalid_problem_links)}):")
for p, ref, pid in invalid_problem_links:
    print(f"   [FAIL] In {p}: {ref} (Invalid ID: '{pid}')")
if not invalid_problem_links:
    print("   [OK] Zero invalid problem ID links.")

print(f"\n6. Missing Theme Script ({len(missing_theme_script)}):")
for p in missing_theme_script:
    print(f"   [FAIL] Missing theme.js: {p}")
if not missing_theme_script:
    print("   [OK] All 15 pages include theme.js.")

print(f"\n7. Missing Theme Toggle ({len(missing_theme_toggle)}):")
for p in missing_theme_toggle:
    print(f"   [FAIL] Missing theme toggle: {p}")
if not missing_theme_toggle:
    print("   [OK] All 15 pages include theme toggle.")

