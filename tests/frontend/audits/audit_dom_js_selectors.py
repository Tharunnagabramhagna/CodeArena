
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

def audit_dom_selectors():
    # Map of HTML files and the scripts they load
    html_files = sorted(glob.glob("frontend/**/*.html", recursive=True) + glob.glob("frontend/*.html"))
    html_files = list(dict.fromkeys(html_files))

    # Read each JS file and find document.getElementById, querySelector, etc.
    js_files = glob.glob("frontend/js/*.js")
    js_selectors = {}
    for js_path in js_files:
        with open(js_path, 'r', encoding='utf-8') as f:
            code = f.read()

        # Find document.getElementById('...')
        get_elem_ids = re.findall(r'document\.getElementById\([\'"]([a-zA-Z0-9_\-]+)[\'"]\)', code)
        # Find document.querySelector('#...')
        query_ids = re.findall(r'querySelector\([\'"]#([a-zA-Z0-9_\-]+)[\'"]\)', code)
        all_ids = set(get_elem_ids + query_ids)

        js_selectors[os.path.basename(js_path)] = {
            "ids": all_ids,
            "path": js_path,
            "size": len(code)
        }

    print("=== JS FILES & SIZES ===")
    for js_name, data in sorted(js_selectors.items()):
        print(f"{js_name:15} | Size: {data['size']:5} bytes | Queries {len(data['ids'])} unique IDs")

    # Now check for each HTML file: which scripts are loaded, and are all queried IDs present?
    print("\n=== HTML PAGE SCRIPT & ID AUDIT ===")
    for html_file in html_files:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Find all script src in this html
        scripts_loaded = re.findall(r'<script\s+[^>]*src=[\'"]([^\'"]+)[\'"]', content)
        
        # Find all IDs defined in this html
        defined_ids = set(re.findall(r'\bid=[\'"]([a-zA-Z0-9_\-]+)[\'"]', content))

        # Check duplicate IDs in HTML
        all_id_matches = re.findall(r'\bid=[\'"]([a-zA-Z0-9_\-]+)[\'"]', content)
        dup_ids = [item for item in set(all_id_matches) if all_id_matches.count(item) > 1]

        missing_by_script = {}
        for script_src in scripts_loaded:
            js_name = os.path.basename(script_src.split('?')[0])
            if js_name in js_selectors:
                expected_ids = js_selectors[js_name]["ids"]
                missing = [id_name for id_name in expected_ids if id_name not in defined_ids]
                if missing:
                    missing_by_script[js_name] = missing

        print(f"\nPage: {html_file}")
        print(f"  Scripts Loaded: {', '.join([os.path.basename(s) for s in scripts_loaded])}")
        print(f"  Defined IDs: {len(defined_ids)} | Duplicate IDs: {dup_ids if dup_ids else 'None'}")
        if missing_by_script:
            for sname, m_ids in missing_by_script.items():
                print(f"  WARNING: Script '{sname}' queries {len(m_ids)} IDs not in this page:")
                print(f"    Missing IDs: {m_ids[:10]}{'...' if len(m_ids) > 10 else ''}")

if __name__ == '__main__':
    audit_dom_selectors()

