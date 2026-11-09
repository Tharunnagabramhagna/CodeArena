# tests/frontend/utils/capture_audit_screenshots.py
"""
Captures the 8 actual browser audit screenshots required for CodeArena Phase 7 Final Quality Audit.
Uses headless Google Chrome directly rendering the application files.
"""

import os
import sys
import subprocess
import time

CHROME_BIN = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUTPUT_DIR = r"C:\Users\tarun\.gemini\antigravity\brain\65cff54b-be87-40ca-a32d-ef069c3de2d5\screenshots"

os.makedirs(OUTPUT_DIR, exist_ok=True)

TARGETS = [
    {
        "name": "screenshot_1_catalogue_filters.png",
        "url": "file:///C:/CodeArena/frontend/pages/problems.html",
        "size": "1280,820",
        "desc": "Problem Catalogue with topic and pattern filters visible"
    },
    {
        "name": "screenshot_2_catalogue_topic_pattern_filtered.png",
        "url": "file:///C:/CodeArena/frontend/pages/problems.html?topic=Arrays&pattern=Sliding+Window",
        "size": "1280,820",
        "desc": "Problem Catalogue after selecting topic 'Arrays' and pattern 'Sliding Window'"
    },
    {
        "name": "screenshot_3_problem_workspace_hint1_available.png",
        "url": "file:///C:/CodeArena/frontend/pages/problem.html?id=two-sum&tab=hints&unlockedHints=0",
        "size": "1280,820",
        "desc": "Problem workspace with Hints tab selected and Hint 1 available"
    },
    {
        "name": "screenshot_4_problem_workspace_all_hints_unlocked.png",
        "url": "file:///C:/CodeArena/frontend/pages/problem.html?id=two-sum&tab=hints&unlockedHints=3",
        "size": "1280,820",
        "desc": "Problem workspace with all three progressive hints unlocked"
    },
    {
        "name": "screenshot_5_compiler_default_55_45.png",
        "url": "file:///C:/CodeArena/frontend/pages/compiler.html?ratio=55",
        "size": "1280,820",
        "desc": "Online Java Compiler at default 55:45 split ratio"
    },
    {
        "name": "screenshot_6_compiler_editor_expanded.png",
        "url": "file:///C:/CodeArena/frontend/pages/compiler.html?ratio=70",
        "size": "1280,820",
        "desc": "Online Java Compiler with editor expanded to 70%"
    },
    {
        "name": "screenshot_7_compiler_terminal_expanded.png",
        "url": "file:///C:/CodeArena/frontend/pages/compiler.html?ratio=35",
        "size": "1280,820",
        "desc": "Online Java Compiler with console/terminal expanded to 65% (editor at 35%)"
    },
    {
        "name": "screenshot_8_compiler_mobile_stacked.png",
        "url": "file:///C:/CodeArena/frontend/pages/compiler.html",
        "size": "375,812",
        "desc": "Online Java Compiler at mobile viewport (375x812) showing stacked layout"
    }
]

def capture_all():
    print(f"Starting browser screenshot capture using Chrome: {CHROME_BIN}")
    results = []

    for idx, target in enumerate(TARGETS, start=1):
        out_path = os.path.join(OUTPUT_DIR, target["name"])
        w_size = target["size"]
        url = target["url"]
        desc = target["desc"]

        cmd = [
            CHROME_BIN,
            "--headless=new",
            "--no-sandbox",
            "--disable-gpu",
            "--disable-software-rasterizer",
            f"--window-size={w_size}",
            f"--screenshot={out_path}",
            "--virtual-time-budget=2000",
            url
        ]

        try:
            start_t = time.time()
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
            elapsed = time.time() - start_t
            if res.returncode == 0 and os.path.exists(out_path):
                size = os.path.getsize(out_path)
                print(f"[{idx}/8] [OK] {target['name']} ({size:,} bytes, {elapsed:.2f}s) - {desc}")
                results.append((target["name"], True, size, out_path))
            else:
                print(f"[{idx}/8] [FAIL] {target['name']}: exit {res.returncode}")
                results.append((target["name"], False, 0, out_path))
        except Exception as e:
            print(f"[{idx}/8] [ERROR] {target['name']}: {e}")
            results.append((target["name"], False, 0, out_path))

    successful = [r for r in results if r[1]]
    print(f"\nCapture summary: {len(successful)} of {len(TARGETS)} screenshots successfully captured.")
    return len(successful) == len(TARGETS)

if __name__ == "__main__":
    success = capture_all()
    sys.exit(0 if success else 1)

