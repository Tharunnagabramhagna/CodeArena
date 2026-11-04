# Comprehensive script to apply Tasks A, B, D, E
import os
import re

def update_problems_css():
    path = os.path.join('frontend', 'css', 'problems.css')
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Footer styles to add
    footer_css = """

/* --------------------------------------------------------------------------
   8. Problem Catalogue Footer (Stage 3.5.3.2)
   -------------------------------------------------------------------------- */

.catalogue-footer {
  margin-top: auto;
  background-color: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);
  padding: 22px 24px;
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

.catalogue-footer-container {
  max-width: 1360px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.catalogue-footer-brand-wrap {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.catalogue-footer-brand {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}

.catalogue-footer-brand .footer-full-logo {
  height: 28px;
  width: auto;
  object-fit: contain;
  display: block;
}

.catalogue-footer-tagline {
  font-size: 0.82rem;
  color: var(--color-text-muted);
}

.catalogue-footer-nav {
  display: flex;
  align-items: center;
  gap: 18px;
}

.catalogue-footer-link {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.catalogue-footer-link:hover {
  color: var(--color-primary);
}

.catalogue-footer-bottom {
  display: flex;
  align-items: center;
}

.catalogue-footer-copyright {
  margin: 0;
  font-size: 0.82rem;
  color: var(--color-text-muted);
}
"""

    # Replace 768px + 580px + 640px block with harmonized responsive block
    old_responsive_pattern = re.compile(
        r'@media\s*\(max-width:\s*768px\)\s*\{.*?\.col-num\s*\{\s*display:\s*none;\s*\}\s*\}\s*'
        r'@media\s*\(max-width:\s*580px\)\s*\{.*?\}\s*'
        r'@media\s*\(max-width:\s*640px\)\s*\{.*?\}',
        re.DOTALL
    )

    new_responsive_css = """@media (max-width: 768px) {
  .catalogue-hero {
    flex-direction: column;
    padding: 18px;
  }

  .catalogue-hero-stats {
    align-self: flex-start;
  }

  .catalogue-controls-row {
    flex-direction: column;
    align-items: stretch;
  }

  .catalogue-filters-wrap {
    width: 100%;
    justify-content: space-between;
  }

  .filter-select {
    flex: 1;
    min-width: 110px;
  }

  .col-num {
    display: none;
  }

  .catalogue-footer-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .catalogue-footer-brand-wrap {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .catalogue-footer-nav {
    flex-wrap: wrap;
    gap: 16px;
  }
}

@media (max-width: 640px) {
  .problems-header {
    padding: 0 12px;
    gap: 8px;
  }

  .problems-breadcrumbs {
    font-size: 0.8rem;
    gap: 6px;
  }

  .problems-breadcrumbs .crumb-current {
    max-width: 140px;
  }

  .col-topic,
  .col-acc {
    display: none;
  }

  .catalogue-pagination-bar {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .problems-header-actions .problems-header-btn span {
    display: none;
  }

  .catalogue-footer {
    padding: 18px 16px;
  }
}"""

    if '.catalogue-footer' not in content:
        # Check if old responsive pattern matches
        if old_responsive_pattern.search(content):
            content = old_responsive_pattern.sub(new_responsive_css + footer_css, content)
        else:
            # Fallback append
            content = content + footer_css
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Updated problems.css with footer and harmonized breakpoints")
    else:
        print("problems.css already contains .catalogue-footer")


def update_styles_css():
    path = os.path.join('frontend', 'css', 'styles.css')
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Update font-family-mono definition
    content = content.replace(
        "--font-family-mono: 'Consolas', 'Courier New', monospace;",
        "--font-family-mono: 'Cascadia Code', 'Fira Code', 'JetBrains Mono', Consolas, 'Courier New', monospace;"
    )

    # Add code, kbd, samp, pre base rule if not present
    if 'code, kbd, samp, pre' not in content:
        target = "/* ========================================\n   3. Typography\n   ======================================== */"
        replacement = target + """\n\ncode,\nkbd,\nsamp,\npre {\n  font-family: var(--font-family-mono);\n}"""
        if target in content:
            content = content.replace(target, replacement)
        else:
            # Try CRLF
            target_crlf = "/* ========================================\r\n   3. Typography\r\n   ======================================== */"
            replacement_crlf = target_crlf + """\r\n\r\ncode,\r\nkbd,\r\nsamp,\r\npre {\r\n  font-family: var(--font-family-mono);\r\n}"""
            if target_crlf in content:
                content = content.replace(target_crlf, replacement_crlf)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated styles.css with enhanced --font-family-mono and base typography")


def update_compiler_css():
    path = os.path.join('frontend', 'css', 'compiler.css')
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace hardcoded font stacks with var(--font-family-mono)
    hardcoded_mono = "'Cascadia Code', 'Fira Code', 'JetBrains Mono', Consolas, 'Courier New', monospace"
    content = content.replace(f"font-family: {hardcoded_mono};", "font-family: var(--font-family-mono);")

    # Breadcrumb consistency
    old_crumb = """.compiler-breadcrumbs .crumb-current {
  color: var(--color-text-primary);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}"""
    new_crumb = """.compiler-breadcrumbs .crumb-current {
  color: var(--color-text-primary);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}"""
    if old_crumb in content:
        content = content.replace(old_crumb, new_crumb)
    else:
        old_crumb_crlf = old_crumb.replace('\n', '\r\n')
        new_crumb_crlf = new_crumb.replace('\n', '\r\n')
        if old_crumb_crlf in content:
            content = content.replace(old_crumb_crlf, new_crumb_crlf)

    # Responsive 640px and 480px additions
    old_640 = """@media (max-width: 640px) {
  .compiler-header {
    padding: 0 10px;
    gap: 8px;
  }
}"""
    new_640 = """@media (max-width: 640px) {
  .compiler-header {
    padding: 0 10px;
    gap: 8px;
  }

  .compiler-breadcrumbs {
    font-size: 0.8rem;
    gap: 6px;
  }

  .compiler-breadcrumbs .crumb-current {
    max-width: 140px;
  }
}

@media (max-width: 480px) {
  .compiler-header-actions .compiler-header-btn span {
    display: none;
  }
}"""
    if old_640 in content:
        content = content.replace(old_640, new_640)
    else:
        old_640_crlf = old_640.replace('\n', '\r\n')
        new_640_crlf = new_640.replace('\n', '\r\n')
        if old_640_crlf in content:
            content = content.replace(old_640_crlf, new_640_crlf)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated compiler.css with var(--font-family-mono), breadcrumbs and responsive rules")


def update_workspace_css():
    path = os.path.join('frontend', 'css', 'workspace.css')
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace hardcoded font stacks with var(--font-family-mono)
    hardcoded_mono1 = "'Cascadia Code', 'Fira Code', 'JetBrains Mono', Consolas, 'Courier New', monospace"
    hardcoded_mono2 = "'Cascadia Code', 'Fira Code', 'JetBrains Mono', Consolas, monospace"
    content = content.replace(f"font-family: {hardcoded_mono1};", "font-family: var(--font-family-mono);")
    content = content.replace(f"font-family: {hardcoded_mono2};", "font-family: var(--font-family-mono);")

    # Breadcrumb alignment (Task E)
    old_bc = """.workspace-breadcrumbs {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  color: var(--color-text-muted);
}"""
    new_bc = """.workspace-breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.84rem;
  color: var(--color-text-muted);
}"""
    if old_bc in content:
        content = content.replace(old_bc, new_bc)
    else:
        old_bc_crlf = old_bc.replace('\n', '\r\n')
        new_bc_crlf = new_bc.replace('\n', '\r\n')
        if old_bc_crlf in content:
            content = content.replace(old_bc_crlf, new_bc_crlf)

    old_sep = """.workspace-breadcrumbs .crumb-sep {
  color: var(--color-border);
  user-select: none;
  font-size: 0.72rem;
}"""
    new_sep = """.workspace-breadcrumbs .crumb-sep {
  color: var(--color-border);
  user-select: none;
  font-size: 0.75rem;
}"""
    if old_sep in content:
        content = content.replace(old_sep, new_sep)
    else:
        old_sep_crlf = old_sep.replace('\n', '\r\n')
        new_sep_crlf = new_sep.replace('\n', '\r\n')
        if old_sep_crlf in content:
            content = content.replace(old_sep_crlf, new_sep_crlf)

    # Responsive 640px and 480px additions (Task D)
    old_640_ws = """@media (max-width: 640px) {
  .workspace-header {
    padding: 0 10px;
  }

  .editor-toolbar-bar {
    padding: 4px 8px;
    gap: 4px 6px;
    overflow-x: auto;
  }
}"""
    new_640_ws = """@media (max-width: 640px) {
  .workspace-header {
    padding: 0 10px;
    gap: 8px;
  }

  .workspace-breadcrumbs {
    font-size: 0.8rem;
    gap: 6px;
  }

  .workspace-breadcrumbs .crumb-current {
    max-width: 140px;
  }

  .editor-toolbar-bar {
    padding: 4px 8px;
    gap: 4px 6px;
    overflow-x: auto;
  }
}

@media (max-width: 480px) {
  .workspace-header-actions .workspace-header-btn span {
    display: none;
  }
}"""
    if old_640_ws in content:
        content = content.replace(old_640_ws, new_640_ws)
    else:
        old_640_ws_crlf = old_640_ws.replace('\n', '\r\n')
        new_640_ws_crlf = new_640_ws.replace('\n', '\r\n')
        if old_640_ws_crlf in content:
            content = content.replace(old_640_ws_crlf, new_640_ws_crlf)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated workspace.css with var(--font-family-mono), breadcrumbs and responsive rules")


if __name__ == '__main__':
    update_problems_css()
    update_styles_css()
    update_compiler_css()
    update_workspace_css()
