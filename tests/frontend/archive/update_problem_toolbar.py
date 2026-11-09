import re

file_path = "frontend/pages/problem.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Define the replacement block
new_toolbar = '''            <!-- Editor Toolbar Bar (Stage 3.4.8 Reorganized 4-Group Architecture) -->
            <div class="editor-toolbar-bar" role="toolbar" aria-label="Editor Controls">
                <!-- Group A: Editor Information -->
                <div class="toolbar-group toolbar-group-info" role="group" aria-label="Editor Information">
                    <div class="target-lang-badge" title="Target Language: Java (OpenJDK 17)">
                        <span class="lang-dot" aria-hidden="true"></span>
                        <span class="lang-text">Target: Java (OpenJDK 17)</span>
                        <span class="lang-text-compact">Java 17</span>
                    </div>
                    <span class="active-file-indicator" title="Current Active File">
                        <span aria-hidden="true">☕</span>
                        <span class="file-name">Solution.java</span>
                    </span>
                </div>

                <!-- Group B: Workspace Layout Presets -->
                <div class="toolbar-group toolbar-group-layout" role="group" aria-label="Workspace Layout Presets">
                    <button id="btnLayoutExpandEditor" class="btn-editor-tool btn-layout-tool" type="button" title="Expand Code Editor (Collapse Console)">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <polyline points="9 21 3 21 3 15"></polyline>
                            <line x1="21" y1="3" x2="14" y2="10"></line>
                            <line x1="3" y1="21" x2="10" y2="14"></line>
                        </svg>
                        <span class="toolbar-btn-text">Editor</span>
                    </button>
                    <button id="btnLayoutExpandConsole" class="btn-editor-tool btn-layout-tool" type="button" title="Expand Test Console">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <rect x="2" y="3" width="20" height="14" rx="2"></rect>
                            <line x1="8" y1="21" x2="16" y2="21"></line>
                            <line x1="12" y1="17" x2="12" y2="21"></line>
                        </svg>
                        <span class="toolbar-btn-text">Console</span>
                    </button>
                    <button id="btnLayoutReset" class="btn-editor-tool btn-layout-tool" type="button" title="Reset layout to default">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                            <path d="M21 3v5h-5"></path>
                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                            <path d="M3 21v-5h5"></path>
                        </svg>
                        <span class="toolbar-btn-text">Default</span>
                    </button>
                </div>

                <!-- Group C: Code Preferences -->
                <div class="toolbar-group toolbar-group-pref" role="group" aria-label="Code Preferences">
                    <label class="starter-return-toggle" id="starterReturnToggleWrap" title="Toggle default placeholder return statement in starter code">
                        <input type="checkbox" id="chkIncludeDefaultReturn" checked>
                        <span class="return-toggle-switch" aria-hidden="true"></span>
                        <span class="return-toggle-label">Default Return</span>
                        <span class="return-toggle-label-compact">Return</span>
                    </label>
                </div>

                <!-- Group D: Code Actions -->
                <div class="toolbar-group toolbar-group-actions" role="group" aria-label="Code Actions">
                    <button id="btnResetCode" class="btn-editor-tool" type="button" title="Reset to default starter template">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                        </svg>
                        <span class="toolbar-btn-text">Reset</span>
                    </button>
                    <button id="btnCopyCode" class="btn-editor-tool" type="button" title="Copy code to clipboard">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        <span class="toolbar-btn-text">Copy</span>
                    </button>
                    <button id="btnShortcutsHelp" class="btn-editor-tool" type="button" title="View Keyboard Shortcuts">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                            <path d="M6 8h.001M10 8h.001M14 8h.001M18 8h.001M8 12h.001M12 12h.001M16 12h.001M7 16h10"></path>
                        </svg>
                        <span class="toolbar-btn-text">Shortcuts</span>
                    </button>
                </div>
            </div>'''

# Match from <!-- Editor Toolbar Bar --> to the closing </div> before <!-- CodeMirror Editor Area / Fallback Container -->
pattern = r'<!-- Editor Toolbar Bar -->.*?</div>\s*</div>\s*(?=<!-- CodeMirror Editor Area)'
match = re.search(pattern, content, re.DOTALL)
if match:
    updated = content[:match.start()] + new_toolbar + "\n\n            " + content[match.end():]
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(updated)
    print("SUCCESS: Updated editor-toolbar-bar in problem.html")
else:
    print("ERROR: Pattern not matched")
