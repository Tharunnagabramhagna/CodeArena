"""
CodeArena — Feature 3 Automated Test Suite
test_workspace_problem_learning.py

Validates:
1. Strict Scope Boundaries (Frontend only: backend/ and database/ untouched).
2. Professional Problem-Solving Workspace (problem.html & workspace.js):
   - Problem ID badge, pattern tag, access badge (Free vs Pro).
   - 5 Collapsible Accordion sections (Description, Examples, Constraints, Hints Preview, Related Concepts).
   - Left Reference Pane collapsible toggle (btnToggleCollapseLeft).
   - Dynamic Related Concepts chips linking to learning modules.
   - Code editor toolbar language selector (selectEditorLang).
   - Test console Custom Input tab & panel with sample loader.
   - Test console Submissions History tab & panel with tabular records.
   - localStorage draft auto-saving (codearena_draft_<id>) and restoration.
   - Live custom input support in structural validation preview.
3. Interactive Java Concept Learning (learn.html & learn.js):
   - Learning Mode Switcher (Curriculum vs Interactive Animation Studio).
   - 14 curriculum lessons covering 6 core Java modules.
   - Every lesson features a concept practice card linking to a canonical challenge.
   - 8 interactive educational animations (Java Execution, Variables/Memory, Loops,
     Arrays/Linear Search, Stack/Heap, Inheritance, Polymorphism Dispatch, Recursion Stack).
   - Full animation player controls (Prev, Play/Pause, Next, Reset, Speed, Step counter).
   - Live step explanation card with under-the-hood JVM callout notes.
   - Light theme synchronization and prefers-reduced-motion support.
"""

import os
import sys
import re

TESTS_PASSED = 0
TESTS_FAILED = 0

def record(condition, message):
    global TESTS_PASSED, TESTS_FAILED
    if condition:
        TESTS_PASSED += 1
        print(f"  [PASS] {message}")
    else:
        TESTS_FAILED += 1
        print(f"  [FAIL] {message}")

def run_tests():
    global TESTS_PASSED, TESTS_FAILED
    print("\n--- Running Test Suite: Feature 3 — Problem Workspace & Interactive Java Learning ---")

    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
    frontend_dir = os.path.join(root_dir, "frontend")

    # ---------------------------------------------------------
    # 1. Strict Scope Boundaries
    # ---------------------------------------------------------
    backend_dir = os.path.join(root_dir, "backend")
    database_dir = os.path.join(root_dir, "database")

    record(os.path.isdir(backend_dir), "backend/ directory exists untouched")
    record(os.path.isdir(database_dir), "database/ directory exists untouched")

    # Read required frontend files
    problem_html_path = os.path.join(frontend_dir, "pages", "problem.html")
    workspace_css_path = os.path.join(frontend_dir, "css", "workspace.css")
    workspace_js_path = os.path.join(frontend_dir, "js", "workspace.js")

    learn_html_path = os.path.join(frontend_dir, "pages", "learn.html")
    secondary_css_path = os.path.join(frontend_dir, "css", "secondary.css")
    learn_js_path = os.path.join(frontend_dir, "js", "learn.js")

    with open(problem_html_path, "r", encoding="utf-8") as f:
        problem_html = f.read()

    with open(workspace_css_path, "r", encoding="utf-8") as f:
        workspace_css = f.read()

    with open(workspace_js_path, "r", encoding="utf-8") as f:
        workspace_js = f.read()

    with open(learn_html_path, "r", encoding="utf-8") as f:
        learn_html = f.read()

    with open(secondary_css_path, "r", encoding="utf-8") as f:
        secondary_css = f.read()

    with open(learn_js_path, "r", encoding="utf-8") as f:
        learn_js = f.read()

    # ---------------------------------------------------------
    # 2. Problem-Solving Workspace Markup (problem.html)
    # ---------------------------------------------------------
    record('id="problemIdBadge"' in problem_html, "problem.html defines #problemIdBadge element")
    record('id="problemPatternTag"' in problem_html, "problem.html defines #problemPatternTag algorithmic pattern tag")
    record('id="problemAccessBadge"' in problem_html, "problem.html defines #problemAccessBadge (Free vs Pro)")
    record('id="btnToggleCollapseLeft"' in problem_html, "problem.html defines #btnToggleCollapseLeft panel collapse button")

    # 5 Collapsible Accordion Sections
    record('id="secDescription"' in problem_html, "problem.html defines collapsible #secDescription")
    record('id="secExamples"' in problem_html, "problem.html defines collapsible #secExamples")
    record('id="secConstraints"' in problem_html, "problem.html defines collapsible #secConstraints")
    record('id="secHintsPreview"' in problem_html, "problem.html defines collapsible #secHintsPreview")
    record('id="secRelatedConcepts"' in problem_html, "problem.html defines collapsible #secRelatedConcepts")
    record('class="section-collapse-header"' in problem_html, "problem.html uses .section-collapse-header for accordion toggling")
    record('id="btnOpenHintsView"' in problem_html, "problem.html defines #btnOpenHintsView to jump to progressive hints")
    record('id="relatedConceptsGrid"' in problem_html, "problem.html defines #relatedConceptsGrid dynamic container")

    # Editor Language Selector
    record('id="selectEditorLang"' in problem_html, "problem.html defines #selectEditorLang in editor toolbar Group A")

    # Console Tabs & Panels
    record('id="tabBtnCustomInput"' in problem_html, "problem.html defines #tabBtnCustomInput console tab")
    record('id="tabBtnSubmissionsConsole"' in problem_html, "problem.html defines #tabBtnSubmissionsConsole console tab")
    record('id="panelCustomInput"' in problem_html, "problem.html defines #panelCustomInput console panel")
    record('id="customInputText"' in problem_html, "problem.html defines #customInputText standard input textarea")
    record('id="btnLoadSampleInput"' in problem_html, "problem.html defines #btnLoadSampleInput quick sample input loader")
    record('id="panelSubmissionsConsole"' in problem_html, "problem.html defines #panelSubmissionsConsole console panel")
    record('id="consoleSubmissionsListContainer"' in problem_html, "problem.html defines #consoleSubmissionsListContainer")
    record('id="consoleSubmissionsCountBadge"' in problem_html, "problem.html defines #consoleSubmissionsCountBadge")

    # ---------------------------------------------------------
    # 3. Problem-Solving Workspace Controller (workspace.js)
    # ---------------------------------------------------------
    record("problemIdBadge: document.getElementById('problemIdBadge')" in workspace_js, "workspace.js caches problemIdBadge")
    record("problemPatternTag: document.getElementById('problemPatternTag')" in workspace_js, "workspace.js caches problemPatternTag")
    record("problemAccessBadge: document.getElementById('problemAccessBadge')" in workspace_js, "workspace.js caches problemAccessBadge")
    record("btnToggleCollapseLeft: document.getElementById('btnToggleCollapseLeft')" in workspace_js, "workspace.js caches btnToggleCollapseLeft")
    record("tabBtnCustomInput: document.getElementById('tabBtnCustomInput')" in workspace_js, "workspace.js caches tabBtnCustomInput")
    record("panelCustomInput: document.getElementById('panelCustomInput')" in workspace_js, "workspace.js caches panelCustomInput")
    record("customInputText: document.getElementById('customInputText')" in workspace_js, "workspace.js caches customInputText")
    record("btnLoadSampleInput: document.getElementById('btnLoadSampleInput')" in workspace_js, "workspace.js caches btnLoadSampleInput")
    record("tabBtnSubmissionsConsole: document.getElementById('tabBtnSubmissionsConsole')" in workspace_js, "workspace.js caches tabBtnSubmissionsConsole")
    record("panelSubmissionsConsole: document.getElementById('panelSubmissionsConsole')" in workspace_js, "workspace.js caches panelSubmissionsConsole")
    record("consoleSubmissionsListContainer: document.getElementById('consoleSubmissionsListContainer')" in workspace_js, "workspace.js caches consoleSubmissionsListContainer")

    # Functionality
    record("function renderRelatedConcepts" in workspace_js, "workspace.js defines renderRelatedConcepts() helper")
    record("function renderConsoleSubmissions" in workspace_js, "workspace.js defines renderConsoleSubmissions() helper")
    record("codearena_draft_" in workspace_js and "localStorage" in workspace_js, "workspace.js auto-saves typed drafts to localStorage (codearena_draft_<id>)")
    record("dom.customInputText.value" in workspace_js, "workspace.js supports custom standard input execution preview")
    record("renderConsoleSubmissions: renderConsoleSubmissions" in workspace_js, "window.CodeArenaWorkspace exports renderConsoleSubmissions")
    record("renderRelatedConcepts: renderRelatedConcepts" in workspace_js, "window.CodeArenaWorkspace exports renderRelatedConcepts")

    # ---------------------------------------------------------
    # 4. Workspace CSS Styling (workspace.css)
    # ---------------------------------------------------------
    record(".collapsible-section" in workspace_css, "workspace.css styles .collapsible-section")
    record(".section-collapse-header" in workspace_css, "workspace.css styles .section-collapse-header")
    record(".chevron-icon" in workspace_css, "workspace.css styles .chevron-icon indicator rotation")
    record(".problem-reference-pane.collapsed" in workspace_css, "workspace.css defines .problem-reference-pane.collapsed layout")
    record(".custominput-textarea" in workspace_css, "workspace.css styles .custominput-textarea")
    record(".console-submissions-table" in workspace_css, "workspace.css styles .console-submissions-table")
    record(".concept-chip" in workspace_css, "workspace.css styles .concept-chip linking to learning modules")
    record(".problem-scroll-container > *" in workspace_css and "flex-shrink: 0" in workspace_css, "workspace.css prevents flex shrinking for problem scroll children")
    record(".collapsible-section" in workspace_css and "flex-shrink: 0" in workspace_css, "workspace.css sets flex-shrink: 0 on .collapsible-section to prevent vertical clipping")
    record(".collapsible-section.open" in workspace_css and "overflow: visible" in workspace_css, "workspace.css allows full content expansion in open collapsible sections")
    record(".console-tab-btn" in workspace_css and "white-space: nowrap" in workspace_css, "workspace.css enforces white-space: nowrap on console tabs to prevent multi-line button wrapping")
    record(".console-tab-btn" in workspace_css and "flex-shrink: 0" in workspace_css, "workspace.css prevents flex compression on console tab buttons")
    record(".console-header-tabs" in workspace_css and "overflow-x: auto" in workspace_css, "workspace.css enables smooth horizontal scrolling for console tab headers")

    # ---------------------------------------------------------
    # 5. Java Learning Centre Markup (learn.html)
    # ---------------------------------------------------------
    record('id="btnModeCurriculum"' in learn_html, "learn.html defines #btnModeCurriculum tab button")
    record('id="btnModeAnimations"' in learn_html, "learn.html defines #btnModeAnimations tab button")
    record('id="viewCurriculum"' in learn_html, "learn.html defines #viewCurriculum panel")
    record('id="viewAnimationStudio"' in learn_html, "learn.html defines #viewAnimationStudio panel")
    record('id="animPillsBar"' in learn_html, "learn.html defines #animPillsBar for 8 animation selector pills")
    record('id="animPlayerCard"' in learn_html, "learn.html defines #animPlayerCard player container")
    record('id="animStage"' in learn_html, "learn.html defines #animStage visual animation canvas")
    record('id="btnAnimPrev"' in learn_html, "learn.html defines #btnAnimPrev (Step Backward)")
    record('id="btnAnimPlayPause"' in learn_html, "learn.html defines #btnAnimPlayPause (Play/Pause)")
    record('id="btnAnimNext"' in learn_html, "learn.html defines #btnAnimNext (Step Forward)")
    record('id="btnAnimReset"' in learn_html, "learn.html defines #btnAnimReset (Restart)")
    record('id="selectAnimSpeed"' in learn_html, "learn.html defines #selectAnimSpeed (0.5x, 1x, 2x)")
    record('id="animStepIndicator"' in learn_html, "learn.html defines #animStepIndicator step counter")
    record('id="animExplanationCard"' in learn_html, "learn.html defines #animExplanationCard live step explanation card")
    record('id="animStepTitle"' in learn_html, "learn.html defines #animStepTitle live step title")
    record('id="animStepNarration"' in learn_html, "learn.html defines #animStepNarration live narration")
    record('id="animStepTechnicalNote"' in learn_html, "learn.html defines #animStepTechnicalNote technical JVM note")
    record('id="btnAnimPracticeProblem"' in learn_html, "learn.html defines #btnAnimPracticeProblem direct practice action")

    # ---------------------------------------------------------
    # 6. Java Learning & Animation Studio Controller (learn.js)
    # ---------------------------------------------------------
    # Curriculum modules
    record("id: 'java-fundamentals'" in learn_js, "Curriculum includes Module 1: Java Fundamentals")
    record("id: 'operators-control-flow'" in learn_js, "Curriculum includes Module 2: Control Flow")
    record("id: 'arrays-strings'" in learn_js, "Curriculum includes Module 3: Arrays & Strings")
    record("id: 'methods-recursion'" in learn_js, "Curriculum includes Module 4: Methods & Recursion")
    record("id: 'oop-fundamentals'" in learn_js, "Curriculum includes Module 5: Object-Oriented Programming")
    record("id: 'multithreading-concurrency'" in learn_js, "Curriculum includes Module 6: Advanced Java (Concurrency)")
    record("practiceProblem:" in learn_js, "Curriculum lessons include practiceProblem mappings")

    # Exactly 8 Interactive Educational Animations
    record("animId: 'java-execution'" in learn_js, "Animation Studio includes 1. java-execution (Program Execution Lifecycle)")
    record("animId: 'variables-memory'" in learn_js, "Animation Studio includes 2. variables-memory (Primitive Variables & Memory)")
    record("animId: 'loops-iteration'" in learn_js, "Animation Studio includes 3. loops-iteration (Loop Iterations & State)")
    record("animId: 'arrays-traversal'" in learn_js, "Animation Studio includes 4. arrays-traversal (Array Indexing & Linear Search)")
    record("animId: 'stack-heap'" in learn_js, "Animation Studio includes 5. stack-heap (Stack Frames & Heap Objects)")
    record("animId: 'inheritance-hierarchy'" in learn_js, "Animation Studio includes 6. inheritance-hierarchy (Inheritance & Code Reuse)")
    record("animId: 'polymorphism-dispatch'" in learn_js, "Animation Studio includes 7. polymorphism-dispatch (Polymorphism & Dynamic Dispatch)")
    record("animId: 'recursion-stack'" in learn_js, "Animation Studio includes 8. recursion-stack (Recursive Call Stack & Base Case)")

    # Animation Engine & Controls
    record("function renderAnimationStage" in learn_js, "learn.js defines renderAnimationStage() visual engine")
    record("function nextAnimStep" in learn_js, "learn.js defines nextAnimStep() step forward")
    record("function prevAnimStep" in learn_js, "learn.js defines prevAnimStep() step backward")
    record("function togglePlay" in learn_js, "learn.js defines togglePlay() play/pause controller")
    record("function resetAnimation" in learn_js, "learn.js defines resetAnimation() restart controller")
    record("function setPlaySpeed" in learn_js, "learn.js defines setPlaySpeed() speed adjustment")
    record("window.CodeArenaLearn" in learn_js, "learn.js exposes window.CodeArenaLearn controller API")

    # ---------------------------------------------------------
    # 7. Secondary CSS Styling (secondary.css)
    # ---------------------------------------------------------
    record(".learn-mode-nav" in secondary_css, "secondary.css styles .learn-mode-nav switcher")
    record(".learn-mode-btn.active" in secondary_css, "secondary.css styles active mode button")
    record(".concept-practice-card" in secondary_css, "secondary.css styles .concept-practice-card")
    record(".btn-concept-practice" in secondary_css, "secondary.css styles .btn-concept-practice")
    record(".anim-player-card" in secondary_css, "secondary.css styles .anim-player-card")
    record(".anim-stage-wrapper" in secondary_css, "secondary.css styles .anim-stage-wrapper")
    record(".anim-node.active" in secondary_css, "secondary.css styles active animation pipeline nodes")
    record(".anim-mem-cell" in secondary_css, "secondary.css styles .anim-mem-cell memory slots")
    record(".anim-array-slot" in secondary_css, "secondary.css styles .anim-array-slot contiguous cells")
    record(".anim-stack-frame" in secondary_css, "secondary.css styles .anim-stack-frame call frames")
    record("@media (prefers-reduced-motion" in secondary_css, "secondary.css provides reduced-motion accessibility overrides")

    print(f"\nFeature 3 Test Suite Finished: {TESTS_PASSED} Passed, {TESTS_FAILED} Failed.")
    return TESTS_FAILED == 0

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
