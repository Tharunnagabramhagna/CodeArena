# CodeArena — Frontend Test & Quality Verification Suite

> **IMPORTANT RUNTIME NOTICE**
> 
> **The CodeArena frontend itself requires only HTML, CSS and JavaScript. Python is used exclusively for optional development and testing utilities.**
>
> The production application running in your browser has **zero dependencies on Python, Node.js, or external testing packages**.

---

## 1. Directory Structure & Organization

```text
tests/
└── frontend/
    ├── automated/              # Phase-level feature verification suites (Phases 4–8)
    │   ├── test_phase4_all_features.py
    │   ├── test_phase5_release_readiness.py
    │   ├── test_phase6_advanced_features.py
    │   ├── test_phase6_refinement.py
    │   ├── test_phase7_dsa_hints_splitter.py
    │   ├── test_phase8_user_access_premium_dashboard.py
    │   ├── test_ui_refinements.py
    │   ├── test_auth_modal_glassmorphism.py
    │   ├── test_compiler_split_controls.py
    │   ├── test_workspace_problem_learning.py
    │   └── test_solution_animation.py
    │
    ├── regression/             # Cross-cutting invariant & UI standard tests
    │   ├── test_branding_consistency.py
    │   ├── test_header_heights.py
    │   ├── test_dashboard_color_tokens.py
    │   ├── test_stage3_5_3_2_final.py
    │   ├── test_stage3_5_2.js
    │   ├── test_responsive_and_journeys.py
    │   └── test_replacements.py
    │
    ├── audits/                 # Static code analyzers & security scanners
    │   ├── check_references.py
    │   ├── audit_accessibility_deep.py
    │   ├── audit_storage_safety.py
    │   ├── audit_honest_messaging.py
    │   ├── audit_dom_js_selectors.py
    │   ├── audit_innerhtml_safety.py
    │   ├── audit_css_components.py
    │   ├── audit_css_themes.py
    │   ├── audit_frontend.py
    │   ├── comprehensive_qa_audit.py
    │   └── ...
    │
    ├── utils/                  # Formatting & repository maintenance utilities
    │   ├── clean_whitespace.py
    │   ├── clean_staged_whitespace.py
    │   ├── clean_eof.py
    │   └── clean_dashboard_hexes.py
    │
    ├── archive/                # Historical one-time transformation scripts (Phases 3–6)
    │   ├── apply_refinements.py
    │   ├── apply_editor_enhancements.py
    │   ├── apply_guest_gate.py
    │   ├── apply_header_height_edits.py
    │   ├── apply_branding_edits.py
    │   └── ...
    │
    ├── run_all_tests.py        # Master test runner (executes all suites with unified report)
    └── README.md               # This documentation
```

---

## 2. Test Suites Overview

### Automated Phase Suites (`tests/frontend/automated/`)
* **`test_phase4_all_features.py`** (73 tests): Validates the full implementation of all eight secondary feature pages (Practice Hub, AI Assistant, Bookmarks, Contests, Learn, Progress, Settings, Submissions).
* **`test_phase5_release_readiness.py`** (42 tests): Verifies guest authentication gate modals, single canonical service contract (`window.CodeArenaAPI`), and honest non-misleading preview labeling.
* **`test_phase6_advanced_features.py`** (72 tests): Tests advanced features: search suggestions, recently viewed problems tray, font zoom controls, interface density tokens, and reduced motion overrides.
* **`test_phase6_refinement.py`** (54 tests): Tests the final refinement invariants: fresh guest zero-bookmark state, workspace draft isolation, strictly deduplicated recently viewed tracking, honest sample announcements, and synchronized settings.
* **`test_ui_refinements.py`** (24 tests): Tests the UI refinements: horizontal logo scaling across all page categories (38–42px), premium vector SVG theme toggle icons with zero raw emojis, and interactive button text selection prevention (`user-select: none`).
* **`test_compiler_split_controls.py`** (46 tests): Validates the interactive compiler split-view controls, 4 layout presets (50:50, 60:40, 70:30, 40:60), expand editor/output toggles, reset default ratio, and CodeMirror redraw.
* **`test_workspace_problem_learning.py`** (98 tests): Validates Feature 3: Professional Problem-Solving Workspace (ID badge, pattern tag, Free/Pro access badge, 5 collapsible accordion sections, left pane collapse toggle, related concept chips, language selector, custom input panel with sample loader, console submissions history, localStorage draft auto-save) and Interactive Java Learning (mode switcher, 14 curriculum lessons with concept practice links, and 8 Interactive Educational Animations with step visualizers, play/pause, step controls, and live technical callouts).

### Cross-Cutting Regression Suites (`tests/frontend/regression/`)
* **`test_branding_consistency.py`** (106 tests): Asserts logo proportions, CSS-controlled sizing classes, and canonical asset paths across all 15 HTML pages.
* **`test_header_heights.py`** (50 tests): Verifies standard header heights (64px landing/dashboard/catalogue, 60px auth, 48px compiler/workspace, 60–64px secondary).
* **`test_dashboard_color_tokens.py`** (43 tests): Asserts dashboard color-token harmonisation (< 130 hex threshold, CSS custom properties, dark/light themes).
* **`test_stage3_5_3_2_final.py`** (39 tests): Verifies cross-page UI consistency, dark/light themes, and asserts 0 hidden test case leaks in client JavaScript.
* **`test_stage3_5_2.js`** (31 tests): Node.js regression suite verifying CodeMirror 5 configuration (`indentUnit: 4`) and storage exception guards.
* **`test_responsive_and_journeys.py`**: Verifies mobile (390px), tablet (768px), and desktop viewports.

### Static Code Audits (`tests/frontend/audits/`)
* **`check_references.py`**: Scans all 15 HTML files and asserts that every `<script src>`, `<link href>`, `<img>`, and `<a>` resolves to an existing file on disk.
* **`audit_accessibility_deep.py`**: Checks ARIA landmarks, `role`, `aria-label`, headings hierarchy, and screen-reader accessibility text.
* **`audit_storage_safety.py`**: Asserts that every `localStorage` and `sessionStorage` call is properly enclosed in `try/catch` exception handlers.
* **`audit_honest_messaging.py`**: Scans for misleading claims of Java remote execution, fake cloud synchronization, or fabricated benchmark timers.
* **`audit_dom_js_selectors.py`**: Ensures every element ID queried by JavaScript exists in the corresponding HTML document.

---

## 3. How to Run the Tests on Windows

All test suites can be executed from PowerShell or Command Prompt. You can run the entire test suite with the master runner or execute individual suites.

### Run All Test Suites and Audits (Recommended)
From the repository root:
```powershell
python tests/frontend/run_all_tests.py
```

### Run Individual Test Suites
```powershell
# Run Phase 6 Refinements suite
python tests/frontend/automated/test_phase6_refinement.py

# Run Phase 4 All Features suite
python tests/frontend/automated/test_phase4_all_features.py

# Run Branding Consistency regression test
python tests/frontend/regression/test_branding_consistency.py

# Run HTML Reference integrity audit
python tests/frontend/audits/check_references.py

# Run Node.js regression suite
node tests/frontend/regression/test_stage3_5_2.js
```

---

## 4. Path Resolution Mechanism

Every test and audit script is equipped with an automatic root locator:

```python
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
```

This guarantees that scripts can be executed seamlessly from **any directory** (repository root, `tests/frontend/`, or nested subdirectories) without broken path references.

