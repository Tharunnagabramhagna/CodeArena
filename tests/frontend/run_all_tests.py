"""
CodeArena — Master Frontend Test & Quality Verification Runner
Executes all automated test suites, regression test suites, and core static audits.
"""

import os
import sys
import subprocess
import time

# Locate repository root
CUR_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = CUR_DIR
while REPO_ROOT and not (os.path.isdir(os.path.join(REPO_ROOT, 'frontend')) and (os.path.exists(os.path.join(REPO_ROOT, '.git')) or os.path.exists(os.path.join(REPO_ROOT, '.gitignore')))):
    PARENT = os.path.dirname(REPO_ROOT)
    if PARENT == REPO_ROOT:
        break
    REPO_ROOT = PARENT

if os.path.isdir(os.path.join(REPO_ROOT, 'frontend')):
    os.chdir(REPO_ROOT)

TEST_SUITES = [
    # Automated Phase Suites
    ("Phase 4 All Features", os.path.join("tests", "frontend", "automated", "test_phase4_all_features.py")),
    ("Phase 5 Release Readiness", os.path.join("tests", "frontend", "automated", "test_phase5_release_readiness.py")),
    ("Phase 6 Advanced Features", os.path.join("tests", "frontend", "automated", "test_phase6_advanced_features.py")),
    ("Phase 6 Final Refinements", os.path.join("tests", "frontend", "automated", "test_phase6_refinement.py")),
    ("Phase 7 DSA Expansion and UI", os.path.join("tests", "frontend", "automated", "test_phase7_dsa_hints_splitter.py")),
    ("Phase 8 User Access and Premium", os.path.join("tests", "frontend", "automated", "test_phase8_user_access_premium_dashboard.py")),
    ("UI Refinements (Logo, Theme, CTA)", os.path.join("tests", "frontend", "automated", "test_ui_refinements.py")),

    # Regression Suites
    ("Branding Consistency", os.path.join("tests", "frontend", "regression", "test_branding_consistency.py")),
    ("Header Heights Standard", os.path.join("tests", "frontend", "regression", "test_header_heights.py")),
    ("Dashboard Color Tokens", os.path.join("tests", "frontend", "regression", "test_dashboard_color_tokens.py")),
    ("Stage 3.5.3.2 Final QA", os.path.join("tests", "frontend", "regression", "test_stage3_5_3_2_final.py")),
    ("Stage 3.5.2 Node Suite", os.path.join("tests", "frontend", "regression", "test_stage3_5_2.js")),
    ("Responsive Viewports", os.path.join("tests", "frontend", "regression", "test_responsive_and_journeys.py")),
]

AUDIT_SUITES = [
    ("HTML Reference Integrity", os.path.join("tests", "frontend", "audits", "check_references.py")),
    ("Accessibility Landmarks & Focus", os.path.join("tests", "frontend", "audits", "audit_accessibility_deep.py")),
    ("Storage Safety (try/catch)", os.path.join("tests", "frontend", "audits", "audit_storage_safety.py")),
    ("Honest Messaging & Disclaimer", os.path.join("tests", "frontend", "audits", "audit_honest_messaging.py")),
    ("DOM & JavaScript Selectors", os.path.join("tests", "frontend", "audits", "audit_dom_js_selectors.py")),
]

def run_suite(name, path_to_file):
    start = time.time()
    cmd = ["python", path_to_file]
    if path_to_file.endswith('.js'):
        cmd = ["node", path_to_file]
    
    res = subprocess.run(cmd, capture_output=True, text=True, cwd=REPO_ROOT)
    duration = time.time() - start
    success = (res.returncode == 0)
    return success, duration, res.stdout, res.stderr

def main():
    print("=" * 72)
    print("CODEARENA FRONTEND MASTER TEST RUNNER")
    print("=" * 72)
    print(f"Repository Root: {REPO_ROOT}")
    print(f"Frontend Target: {os.path.join(REPO_ROOT, 'frontend')}\n")

    all_passed = True
    passed_count = 0
    failed_count = 0

    print("--- 1. Automated & Regression Test Suites ---")
    for name, path_to_file in TEST_SUITES:
        success, duration, stdout, stderr = run_suite(name, path_to_file)
        if success:
            print(f"  [PASS] {name:<35} ({duration:.2f}s)")
            passed_count += 1
        else:
            print(f"  [FAIL] {name:<35} ({duration:.2f}s)")
            print("\n" + stderr[-400:] + "\n" + stdout[-400:])
            failed_count += 1
            all_passed = False

    print("\n--- 2. Core Static Audits & Integrity Verification ---")
    for name, path_to_file in AUDIT_SUITES:
        success, duration, stdout, stderr = run_suite(name, path_to_file)
        if success:
            print(f"  [PASS] {name:<35} ({duration:.2f}s)")
            passed_count += 1
        else:
            print(f"  [FAIL] {name:<35} ({duration:.2f}s)")
            print("\n" + stderr[-400:] + "\n" + stdout[-400:])
            failed_count += 1
            all_passed = False

    print("\n" + "=" * 72)
    print(f"FINAL RESULT: {passed_count} SUITES PASSED, {failed_count} FAILED")
    print("=" * 72)

    if not all_passed:
        sys.exit(1)
    else:
        print("All test suites and audits completed with 100% success!")

if __name__ == '__main__':
    main()
