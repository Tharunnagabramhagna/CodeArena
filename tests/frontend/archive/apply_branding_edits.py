import re

# 1. Update frontend/css/workspace.css
with open('frontend/css/workspace.css', 'r', encoding='utf-8') as f:
    ws_css = f.read()

if '.workspace-brand-wrap .brand-full-logo' not in ws_css:
    target = '.workspace-brand-wrap {\n  display: inline-flex;\n  align-items: center;\n  text-decoration: none;\n}'
    replacement = '.workspace-brand-wrap {\n  display: inline-flex;\n  align-items: center;\n  text-decoration: none;\n}\n\n.workspace-brand-wrap .brand-full-logo {\n  height: 34px;\n  width: auto;\n  display: block;\n}'
    ws_css = ws_css.replace(target, replacement)
    with open('frontend/css/workspace.css', 'w', encoding='utf-8') as f:
        f.write(ws_css)
    print("Updated workspace.css with .workspace-brand-wrap .brand-full-logo")

# 2. Update frontend/css/auth.css
with open('frontend/css/auth.css', 'r', encoding='utf-8') as f:
    auth_css = f.read()

if '.auth-header .brand-full-logo' not in auth_css:
    target = '.auth-header .brand {'
    rule = '.auth-header .brand-full-logo {\n  height: 36px;\n  width: auto;\n  max-width: 200px;\n  object-fit: contain;\n  display: block;\n}\n\n.auth-header .brand {'
    auth_css = auth_css.replace(target, rule)
    with open('frontend/css/auth.css', 'w', encoding='utf-8') as f:
        f.write(auth_css)
    print("Updated auth.css with .auth-header .brand-full-logo")

# 3. Update the 10 auth/subpages:
pages_to_update = [
    'frontend/pages/login.html',
    'frontend/pages/signup.html',
    'frontend/pages/practice.html',
    'frontend/pages/ai_assistant.html',
    'frontend/pages/bookmarks.html',
    'frontend/pages/contests.html',
    'frontend/pages/learn.html',
    'frontend/pages/progress.html',
    'frontend/pages/settings.html',
    'frontend/pages/submissions.html'
]

pattern = re.compile(
    r'<a\s+href="(?:\.\./)?index\.html"\s+class="brand"[^>]*>\s*<img\s+src="(?:\.\./)?assets/logo/codearena-logo\.png"[^>]*>\s*<span\s+class="head-logo">CodeArena</span>\s*</a>',
    re.DOTALL
)

replacement_link = '<a href="../index.html" class="brand" title="Return to CodeArena Home" aria-label="CodeArena Home">\n            <img src="../assets/images/codearena-full-icon.png" alt="CodeArena" class="brand-full-logo">\n        </a>'

for p in pages_to_update:
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '<img src="../assets/logo/codearena-logo.png"' in content:
        # Replace the link
        new_content, count = pattern.subn(replacement_link, content)
        if count > 0:
            with open(p, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated brand logo in {p}")
        else:
            print(f"Warning: pattern didn't match in {p}")

