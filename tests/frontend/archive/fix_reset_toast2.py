with open('frontend/js/settings.js', 'r', encoding='utf-8') as f:
    text = f.read()

target = "showToast('\u21ba Preferences reset to defaults');"
replacement = "showToast('\u21ba Preferences reset to defaults');\n                    if (window.CodeArenaToast) {\n                        window.CodeArenaToast.info('Settings reset to defaults');\n                    }"

if target in text:
    text = text.replace(target, replacement, 1)
    with open('frontend/js/settings.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print("resetBtn toast added successfully!")
else:
    print("Target not found")

