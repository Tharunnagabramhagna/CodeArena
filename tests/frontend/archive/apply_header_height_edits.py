import os
import re

def update_styles_css():
    path = 'frontend/css/styles.css'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update .landing-header base rule
    target_1 = """.landing-header {
  min-height: 72px;
  padding: 8px var(--spacing-lg);
}"""
    replacement_1 = """.landing-header {
  height: 64px;
  min-height: 64px;
  box-sizing: border-box;
  padding: 0 var(--spacing-lg);
}

.landing-header .brand-full-logo {
  height: 42px;
  width: auto;
  display: block;
}"""
    assert target_1 in content, "target_1 not found in styles.css"
    content = content.replace(target_1, replacement_1, 1)

    # 2. Update 768px media query
    target_2 = """.landing-header {
    min-height: 64px;
    padding: 8px var(--spacing-md);
  }"""
    replacement_2 = """.landing-header {
    height: 64px;
    min-height: 64px;
    padding: 0 var(--spacing-md);
  }"""
    assert target_2 in content, "target_2 not found in styles.css"
    content = content.replace(target_2, replacement_2, 1)

    # 3. Update 480px media query
    target_3 = """.landing-header {
    min-height: 56px;
    padding: 6px 12px;
  }"""
    replacement_3 = """.landing-header {
    height: 56px;
    min-height: 56px;
    padding: 0 12px;
  }"""
    assert target_3 in content, "target_3 not found in styles.css"
    content = content.replace(target_3, replacement_3, 1)

    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)
    print("[OK] styles.css updated")


def update_dashboard_css():
    path = 'frontend/css/dashboard.css'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    target = "  --header-height: 68px;"
    replacement = "  --header-height: 64px;"
    assert target in content, "target not found in dashboard.css"
    content = content.replace(target, replacement, 1)

    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)
    print("[OK] dashboard.css updated")


def update_problems_css():
    path = 'frontend/css/problems.css'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    target = """.problems-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 24px;
  background-color: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  box-shadow: 0 1px 3px var(--color-shadow);
  gap: var(--spacing-md);
}

.problems-header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}"""
    replacement = """.problems-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 64px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background-color: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  box-shadow: 0 1px 3px var(--color-shadow);
  gap: var(--spacing-md);
  flex-shrink: 0;
}

.problems-header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: nowrap;
}"""
    assert target in content, "target not found in problems.css"
    content = content.replace(target, replacement, 1)

    # Add mobile padding if not present
    if '.problems-header {' not in content[content.find('@media (max-width: 580px)'):]:
        mobile_rule = """@media (max-width: 640px) {
  .problems-header {
    padding: 0 12px;
    gap: 8px;
  }
}

"""
        content += "\n" + mobile_rule

    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)
    print("[OK] problems.css updated")


def update_compiler_css():
    path = 'frontend/css/compiler.css'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    target = """.compiler-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 20px;
  background-color: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  box-shadow: 0 1px 3px var(--color-shadow);
  gap: var(--spacing-md);
}

.compiler-header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}"""
    replacement = """.compiler-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 48px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  box-shadow: 0 1px 3px var(--color-shadow);
  gap: var(--spacing-md);
  flex-shrink: 0;
}

.compiler-header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: nowrap;
}"""
    assert target in content, "target not found in compiler.css"
    content = content.replace(target, replacement, 1)

    mobile_rule = """@media (max-width: 640px) {
  .compiler-header {
    padding: 0 10px;
    gap: 8px;
  }
}

"""
    content += "\n" + mobile_rule

    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)
    print("[OK] compiler.css updated")


def update_auth_css():
    path = 'frontend/css/auth.css'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    target_1 = """.auth-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  background-color: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
}"""
    replacement_1 = """.auth-header {
  height: 60px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  background-color: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}"""
    assert target_1 in content, "target_1 not found in auth.css"
    content = content.replace(target_1, replacement_1, 1)

    target_2 = """@media (max-width: 480px) {
  .auth-header {
    padding: 12px 16px;
  }"""
    replacement_2 = """@media (max-width: 480px) {
  .auth-header {
    padding: 0 16px;
  }"""
    assert target_2 in content, "target_2 not found in auth.css"
    content = content.replace(target_2, replacement_2, 1)

    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)
    print("[OK] auth.css updated")


def update_workspace_css():
    path = 'frontend/css/workspace.css'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add :root definition at top if not present
    if '--workspace-header-height:' not in content:
        insert_marker = "/* --------------------------------------------------------------------------\n   1. Main Workspace Shell & Reset"
        root_decl = """:root {
  --workspace-header-height: 48px;
}

"""
        assert insert_marker in content, "insert_marker not found in workspace.css"
        content = content.replace(insert_marker, root_decl + insert_marker, 1)

    # Ensure box-sizing: border-box on .workspace-header
    target = """.workspace-header {
  height: 48px;
  display: flex;"""
    replacement = """.workspace-header {
  height: 48px;
  box-sizing: border-box;
  display: flex;"""
    if target in content:
        content = content.replace(target, replacement, 1)

    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)
    print("[OK] workspace.css updated")


if __name__ == '__main__':
    update_styles_css()
    update_dashboard_css()
    update_problems_css()
    update_compiler_css()
    update_auth_css()
    update_workspace_css()
    print("All header height updates applied successfully.")

