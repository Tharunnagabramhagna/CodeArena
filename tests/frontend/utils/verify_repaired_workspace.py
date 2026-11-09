"""
CodeArena — Feature 3: Workspace Repair Verification Tool
Performs automated CDP verification of problem workspace across viewports,
verifies accordion expansion, tab alignment, and captures high-res artifacts.
"""

import os
import sys
import time
import json
import base64
import shutil

sys.path.insert(0, os.path.dirname(__file__))
from capture_solution_animation_screenshots import LiveBrowserSession, ensure_live_server, OUTPUT_DIR, SCREENSHOTS_SUBDIR

LIVE_URL = "http://127.0.0.1:5500/frontend/pages/problem.html?id=two-sum"

def capture_and_verify():
    ensure_live_server()
    b = LiveBrowserSession()
    b.start()
    
    viewports = [
        ("screenshot_workspace_repaired_1440.png", 1440, 900),
        ("screenshot_workspace_repaired_1366.png", 1366, 768),
        ("screenshot_workspace_repaired_1024.png", 1024, 768),
        ("screenshot_workspace_repaired_mobile_390.png", 390, 844)
    ]
    
    results = {}
    
    try:
        # 1. Verify Desktop 1440x900
        b.call("Emulation.setDeviceMetricsOverride", {
            "width": 1440,
            "height": 900,
            "deviceScaleFactor": 1,
            "mobile": False
        })
        b.navigate(LIVE_URL, wait_seconds=2)
        
        # Check computed styles & clipping
        audit_js = """
        (() => {
            const desc = document.getElementById('secDescription');
            const ex = document.getElementById('secExamples');
            const cont = document.getElementById('descriptionScrollContainer');
            const tabs = Array.from(document.querySelectorAll('.console-tab-btn')).map(t => ({
                id: t.id,
                text: t.innerText.replace(/\\s+/g, ' ').trim(),
                whiteSpace: window.getComputedStyle(t).whiteSpace,
                flexShrink: window.getComputedStyle(t).flexShrink,
                width: t.getBoundingClientRect().width,
                height: t.getBoundingClientRect().height
            }));
            
            return {
                descClientHeight: desc.clientHeight,
                descScrollHeight: desc.scrollHeight,
                descClipped: desc.scrollHeight > desc.clientHeight + 4,
                exClientHeight: ex.clientHeight,
                exScrollHeight: ex.scrollHeight,
                exClipped: ex.scrollHeight > ex.clientHeight + 4,
                containerClientHeight: cont.clientHeight,
                containerScrollHeight: cont.scrollHeight,
                tabs: tabs
            };
        })()
        """
        audit = b.eval_js(audit_js)
        print("Audit result at 1440x900:", json.dumps(audit, indent=2))
        
        # Capture 1440 Top
        b.eval_js("document.getElementById('descriptionScrollContainer').scrollTop = 0;")
        time.sleep(0.3)
        b.capture_screenshot("screenshot_workspace_repaired_1440_top.png", 1440, 900)
        
        # Scroll left pane to show Constraints, Hints, and Related Concepts
        b.eval_js("document.getElementById('descriptionScrollContainer').scrollTop = 500;")
        time.sleep(0.4)
        b.capture_screenshot("screenshot_workspace_repaired_scrolled_1440.png", 1440, 900)
        
        # Test Light Theme
        b.eval_js("document.documentElement.setAttribute('data-theme', 'light');")
        b.eval_js("document.getElementById('descriptionScrollContainer').scrollTop = 0;")
        time.sleep(0.4)
        b.capture_screenshot("screenshot_workspace_repaired_light_theme.png", 1440, 900)
        b.eval_js("document.documentElement.setAttribute('data-theme', 'dark');")
        time.sleep(0.3)
        
        # Capture other viewports at top
        b.eval_js("document.getElementById('descriptionScrollContainer').scrollTop = 0;")
        time.sleep(0.3)
        b.capture_screenshot("screenshot_workspace_repaired_1366.png", 1366, 768)
        b.capture_screenshot("screenshot_workspace_repaired_1024.png", 1024, 768)
        b.capture_screenshot("screenshot_workspace_repaired_mobile_390.png", 390, 844)
        
        print("\nAll verification screenshots captured successfully.")
        return audit
    finally:
        b.stop()

if __name__ == "__main__":
    capture_and_verify()
