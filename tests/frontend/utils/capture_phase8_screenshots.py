# tests/frontend/utils/capture_phase8_screenshots.py
"""
Captures real browser screenshots for Phase 8 Quality Verification using Chrome Headless.
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
        "name": "screenshot_p8_1_catalogue_pro_badges.png",
        "url": "file:///C:/CodeArena/frontend/pages/problems.html",
        "size": "1366,850",
        "desc": "Problem catalogue with Free/Pro indicators, lock icons, and access filter"
    },
    {
        "name": "screenshot_p8_2_pricing_modal.png",
        "url": "file:///C:/CodeArena/frontend/pages/problems.html?upgrade=true",
        "size": "1366,850",
        "desc": "CodeArena Pro upgrade modal open with transparent $5/mo and $199/yr plans"
    },
    {
        "name": "screenshot_p8_3_submissions_guest_locked.png",
        "url": "file:///C:/CodeArena/frontend/pages/submissions.html",
        "size": "1366,850",
        "desc": "Submissions history page in unauthenticated guest state with #submissionsAuthGate"
    },
    {
        "name": "screenshot_p8_4_submissions_auth_history.png",
        "url": "file:///C:/CodeArena/frontend/pages/submissions.html?auth=demo",
        "size": "1366,850",
        "desc": "Submissions history page in authenticated preview mode showing user session pill"
    },
    {
        "name": "screenshot_p8_5_workspace_free_access.png",
        "url": "file:///C:/CodeArena/frontend/pages/problem.html?id=two-sum",
        "size": "1366,850",
        "desc": "Free problem workspace (Two Sum) with full editor, test cases, and hint tabs"
    },
    {
        "name": "screenshot_p8_6_workspace_premium_lock.png",
        "url": "file:///C:/CodeArena/frontend/pages/problem.html?id=segment-tree-range-sum",
        "size": "1366,850",
        "desc": "Premium problem workspace (Range Sum Query) displaying Pro access gate"
    },
    {
        "name": "screenshot_p8_7_dashboard_intelligence.png",
        "url": "file:///C:/CodeArena/frontend/pages/dashboard.html",
        "size": "1366,950",
        "desc": "Student dashboard showing 6 platform statistics and Upcoming Activities section"
    },
    {
        "name": "screenshot_p8_8_standalone_compiler_unrestricted.png",
        "url": "file:///C:/CodeArena/frontend/pages/compiler.html",
        "size": "1366,850",
        "desc": "Standalone online Java compiler accessible 100% to guests without login"
    }
]

def capture_all():
    print(f"Starting Phase 8 Chrome browser capture into {OUTPUT_DIR}")
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
            "--virtual-time-budget=2500",
            url
        ]

        try:
            start_t = time.time()
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=20)
            elapsed = time.time() - start_t
            if res.returncode == 0 and os.path.exists(out_path):
                size = os.path.getsize(out_path)
                print(f"[{idx}/{len(TARGETS)}] [OK] {target['name']} ({size:,} bytes, {elapsed:.2f}s) - {desc}")
                results.append((target["name"], True, size, out_path))
            else:
                print(f"[{idx}/{len(TARGETS)}] [FAIL] {target['name']}: exit {res.returncode}")
                results.append((target["name"], False, 0, out_path))
        except Exception as e:
            print(f"[{idx}/{len(TARGETS)}] [ERROR] {target['name']}: {e}")
            results.append((target["name"], False, 0, out_path))

    successful = [r for r in results if r[1]]
    print(f"\nPhase 8 Capture summary: {len(successful)} of {len(TARGETS)} screenshots successfully captured.")
    return len(successful) == len(TARGETS)

if __name__ == "__main__":
    success = capture_all()
    sys.exit(0 if success else 1)

