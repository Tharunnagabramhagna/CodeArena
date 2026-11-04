with open('frontend/js/settings.js', 'r', encoding='utf-8') as f:
    text = f.read()

target = "showToast('\u21ba Settings reset to default configuration.', 'info');"
replacement = "showToast('\u21ba Settings reset to default configuration.', 'info');\n                    if (window.CodeArenaToast) {\n                        window.CodeArenaToast.info('Settings reset to defaults');\n                    }"

if target in text:
    text = text.replace(target, replacement, 1)
    with open('frontend/js/settings.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print("resetBtn toast added successfully")
else:
    print("Warning: target not found")

