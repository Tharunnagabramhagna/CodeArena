with open('frontend/js/ai_assistant.js', 'r', encoding='utf-8') as f:
    text = f.read()

target = """            saveHistory(resetHistory);
            renderHistory();"""

replacement = """            saveHistory(resetHistory);
            renderHistory();
            if (window.CodeArenaToast) {
                window.CodeArenaToast.info('Simulated conversation cleared');
            }"""

if target in text:
    text = text.replace(target, replacement, 1)
    with open('frontend/js/ai_assistant.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print("handleClearChat toast added successfully")
else:
    print("Warning: target not found in ai_assistant.js")

