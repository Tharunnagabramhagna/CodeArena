
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
import glob
from html.parser import HTMLParser

class LinkExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.scripts = []
        self.stylesheets = []
        self.images = []
        self.ids = set()
        self.classes = set()
        self.inputs = []
        self.buttons = []
        self.forms = []
        self.headings = []
        self.aria_elements = []

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        if 'id' in attr_dict:
            self.ids.add(attr_dict['id'])
        if 'class' in attr_dict:
            for c in attr_dict['class'].split():
                self.classes.add(c)
        if tag == 'a' and 'href' in attr_dict:
            self.links.append((attr_dict['href'], attr_dict.get('aria-label', ''), attr_dict))
        elif tag == 'script' and 'src' in attr_dict:
            self.scripts.append(attr_dict['src'])
        elif tag == 'link' and attr_dict.get('rel') == 'stylesheet' and 'href' in attr_dict:
            self.stylesheets.append(attr_dict['href'])
        elif tag == 'img' and 'src' in attr_dict:
            self.images.append((attr_dict['src'], attr_dict.get('alt', '')))
        elif tag in ['input', 'select', 'textarea']:
            self.inputs.append((tag, attr_dict))
        elif tag == 'button':
            self.buttons.append(attr_dict)
        elif tag == 'form':
            self.forms.append(attr_dict)
        elif tag in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
            self.headings.append((tag, attr_dict))
        
        aria_keys = [k for k in attr_dict if k.startswith('aria-') or k == 'role']
        if aria_keys:
            self.aria_elements.append((tag, {k: attr_dict[k] for k in aria_keys}))

def analyze_html_files():
    html_files = sorted(glob.glob("frontend/**/*.html", recursive=True) + glob.glob("frontend/*.html"))
    html_files = list(dict.fromkeys(html_files)) # dedupe
    
    findings = {
        "broken_internal_links": [],
        "missing_stylesheets": [],
        "missing_scripts": [],
        "missing_images": [],
        "accessibility_inputs_without_labels": [],
        "buttons_without_accessible_name": [],
        "images_without_alt": [],
        "page_details": {}
    }

    for html_file in html_files:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()

        parser = LinkExtractor()
        try:
            parser.feed(content)
        except Exception as e:
            print(f"Error parsing {html_file}: {e}")
            continue

        file_dir = os.path.dirname(html_file)

        # 1. Check stylesheets
        for sheet in parser.stylesheets:
            # strip query strings if any
            clean_sheet = sheet.split('?')[0].split('#')[0]
            if clean_sheet.startswith('http'):
                continue
            resolved = os.path.normpath(os.path.join(file_dir, clean_sheet))
            if not os.path.isfile(resolved):
                findings["missing_stylesheets"].append((html_file, sheet, resolved))

        # 2. Check scripts
        for script in parser.scripts:
            clean_script = script.split('?')[0].split('#')[0]
            if clean_script.startswith('http'):
                continue
            resolved = os.path.normpath(os.path.join(file_dir, clean_script))
            if not os.path.isfile(resolved):
                findings["missing_scripts"].append((html_file, script, resolved))

        # 3. Check images
        for img_src, alt in parser.images:
            if not alt.strip():
                findings["images_without_alt"].append((html_file, img_src))
            clean_img = img_src.split('?')[0].split('#')[0]
            if clean_img.startswith('http') or clean_img.startswith('data:'):
                continue
            resolved = os.path.normpath(os.path.join(file_dir, clean_img))
            if not os.path.isfile(resolved):
                findings["missing_images"].append((html_file, img_src, resolved))

        # 4. Check internal links
        for href, aria_label, attrs in parser.links:
            if href.startswith('http') or href.startswith('#') or href.startswith('javascript:') or href.startswith('mailto:'):
                continue
            clean_href = href.split('?')[0].split('#')[0]
            if not clean_href:
                continue
            resolved = os.path.normpath(os.path.join(file_dir, clean_href))
            if not os.path.isfile(resolved):
                findings["broken_internal_links"].append((html_file, href, resolved))

        findings["page_details"][html_file] = {
            "ids_count": len(parser.ids),
            "classes_count": len(parser.classes),
            "links_count": len(parser.links),
            "scripts_count": len(parser.scripts),
            "stylesheets_count": len(parser.stylesheets),
            "inputs_count": len(parser.inputs),
            "buttons_count": len(parser.buttons),
            "headings": [h[0] for h in parser.headings]
        }

    return findings

if __name__ == '__main__':
    res = analyze_html_files()
    print("--- HTML AUDIT RESULTS ---")
    print(f"Missing Stylesheets: {len(res['missing_stylesheets'])}")
    for item in res['missing_stylesheets']:
        print(f"  {item[0]} -> {item[1]} (resolved: {item[2]})")
    
    print(f"\nMissing Scripts: {len(res['missing_scripts'])}")
    for item in res['missing_scripts']:
        print(f"  {item[0]} -> {item[1]} (resolved: {item[2]})")

    print(f"\nMissing Images: {len(res['missing_images'])}")
    for item in res['missing_images']:
        print(f"  {item[0]} -> {item[1]} (resolved: {item[2]})")

    print(f"\nBroken Internal Links: {len(res['broken_internal_links'])}")
    for item in res['broken_internal_links']:
        print(f"  {item[0]} -> {item[1]} (resolved: {item[2]})")

    print(f"\nImages Without Alt Text: {len(res['images_without_alt'])}")
    for item in res['images_without_alt']:
        print(f"  {item[0]} -> {item[1]}")
