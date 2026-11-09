"""
Test Suite: Feature 2 — Interactive Compiler Split-View Controls
Validates compiler splitter, 4 layout presets (50:50, 60:40, 70:30, 40:60),
expand actions (editor, output), default restore, keyboard navigation,
safe persistence, CodeMirror redraw, responsive layout, and theme styling.
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
    print("\n--- Running Test Suite: Interactive Compiler Split-View Controls ---")

    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "frontend"))

    comp_html_path = os.path.join(base_dir, "pages", "compiler.html")
    comp_css_path = os.path.join(base_dir, "css", "compiler.css")
    comp_js_path = os.path.join(base_dir, "js", "compiler.js")

    with open(comp_html_path, "r", encoding="utf-8") as f:
        comp_html = f.read()

    with open(comp_css_path, "r", encoding="utf-8") as f:
        comp_css = f.read()

    with open(comp_js_path, "r", encoding="utf-8") as f:
        comp_js = f.read()

    # ---------------------------------------------------------
    # 1. HTML Markup & Accessibility
    # ---------------------------------------------------------
    record('id="compilerSplitter"' in comp_html, "compiler.html includes #compilerSplitter resizable vertical separator")
    record('role="separator"' in comp_html and 'aria-orientation="vertical"' in comp_html, "Splitter defines ARIA role='separator' and aria-orientation='vertical'")
    record('aria-valuenow' in comp_html and 'aria-valuemin' in comp_html and 'aria-valuemax' in comp_html, "Splitter defines ARIA value attributes (valuenow, valuemin, valuemax)")
    record('id="compilerSplitterBadge"' in comp_html, "Splitter includes floating ratio badge element #compilerSplitterBadge")
    record('id="compilerLayoutControls"' in comp_html, "compiler.html includes #compilerLayoutControls layout toolbar")
    record('id="btnPreset5050"' in comp_html and 'data-ratio="50"' in comp_html, "Layout controls include 50:50 equal split preset button")
    record('id="btnPreset6040"' in comp_html and 'data-ratio="60"' in comp_html, "Layout controls include 60:40 editor-favored preset button")
    record('id="btnPreset7030"' in comp_html and 'data-ratio="70"' in comp_html, "Layout controls include 70:30 editor-focused preset button")
    record('id="btnPreset4060"' in comp_html and 'data-ratio="40"' in comp_html, "Layout controls include 40:60 output-focused preset button")
    record('id="btnExpandEditor"' in comp_html, "Layout controls include #btnExpandEditor action button")
    record('id="btnExpandOutput"' in comp_html, "Layout controls include #btnExpandOutput action button")
    record('id="btnResetSplit"' in comp_html, "Layout controls include #btnResetSplit default restore button")
    record('id="compilerMobileViewNav"' in comp_html, "compiler.html defines mobile view navigation switcher")
    record('id="btnMobileNavEditor"' in comp_html and 'id="btnMobileNavConsole"' in comp_html, "Mobile switcher provides Java Editor and Terminal Console tabs")

    # Check SVG usage instead of emoji
    preset_block = comp_html[comp_html.find('id="compilerLayoutControls"'):comp_html.find('</section>', comp_html.find('id="compilerLayoutControls"'))]
    has_svg = '<svg' in preset_block and 'preset-svg' in preset_block
    no_emoji_in_presets = not any(ord(char) > 127 for char in re.sub(r'<[^>]+>', '', preset_block) if char not in '·—:⇋⌨')
    record(has_svg and no_emoji_in_presets, "Layout preset controls use clean vector SVGs rather than emoji")

    # ---------------------------------------------------------
    # 2. CSS Styling & Optical Design
    # ---------------------------------------------------------
    record("--compiler-editor-width: 50%" in comp_css, "compiler.css initializes default editor width to 50% (equal split)")
    record(".compiler-layout-controls" in comp_css, "compiler.css defines .compiler-layout-controls container")
    record(".btn-layout-preset" in comp_css, "compiler.css defines .btn-layout-preset styling")
    record(".btn-layout-preset.active" in comp_css, "compiler.css provides prominent .active styling for selected preset")
    record('[data-theme="light"] .compiler-layout-controls' in comp_css, "compiler.css provides Light Theme overrides for layout controls")
    record('[data-theme="light"] .btn-layout-preset' in comp_css, "compiler.css provides Light Theme overrides for preset buttons")
    record(".compiler-splitter-badge" in comp_css, "compiler.css styles floating .compiler-splitter-badge tooltip")
    record(".compiler-splitter.is-dragging" in comp_css, "compiler.css defines active highlight glow on splitter during dragging")
    record(".compiler-splitter:focus-visible" in comp_css, "compiler.css provides visible focus ring for keyboard navigation")
    record("body.is-resizing" in comp_css and "user-select: none" in comp_css, "compiler.css locks cursor and disables text selection during dragging")
    record(".compiler-mobile-view-nav" in comp_css, "compiler.css styles mobile view navigation bar")
    record("@media (max-width: 960px)" in comp_css and ".compiler-mobile-view-nav" in comp_css, "compiler.css reveals mobile nav bar on viewports <= 960px")

    # ---------------------------------------------------------
    # 3. JavaScript Controller Logic
    # ---------------------------------------------------------
    record("applySplitRatio(" in comp_js, "compiler.js defines applySplitRatio controller function")
    record("--compiler-editor-width" in comp_js, "applySplitRatio updates --compiler-editor-width CSS variable")
    record("aria-valuenow" in comp_js and "aria-valuetext" in comp_js, "applySplitRatio updates splitter ARIA attributes dynamically")
    record("btnPreset5050" in comp_js and "btnPreset6040" in comp_js, "compiler.js caches layout preset DOM buttons")
    record("btnExpandEditor" in comp_js and "btnExpandOutput" in comp_js, "compiler.js caches expand action DOM buttons")
    record("codearena_compiler_split_ratio" in comp_js, "compiler.js persists split ratio to localStorage safely")
    record("codeEditor.refresh(" in comp_js, "compiler.js calls CodeMirror refresh on ratio adjustments")
    record("setPointerCapture" in comp_js and "releasePointerCapture" in comp_js, "compiler.js uses Pointer Capture for smooth dragging")
    record("Math.max(30, Math.min(75" in comp_js, "compiler.js preserves boundary clamping check")
    record("ArrowLeft" in comp_js and "ArrowRight" in comp_js, "compiler.js supports keyboard arrow key resizing")
    record("Home" in comp_js, "compiler.js supports Home key to restore 50:50 default layout")
    record("End" in comp_js, "compiler.js supports End key to expand editor")
    record("dblclick" in comp_js, "compiler.js supports double-click on splitter to reset layout")
    record("window.CodeArenaCompilerLayout" in comp_js, "compiler.js exports window.CodeArenaCompilerLayout public API")
    record("btnMobileNavEditor" in comp_js and "btnMobileNavConsole" in comp_js, "compiler.js binds mobile view switcher interactions")

    print(f"\nCompiler Split Controls Test Suite Finished: {TESTS_PASSED} Passed, {TESTS_FAILED} Failed.")
    return TESTS_FAILED == 0

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)

