with open('frontend/js/settings.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update cacheElements
old_cache = """            notifyStreaksToggle: document.getElementById('settingNotifyStreaks'),
            saveBtn: document.getElementById('btnSaveSettings'),"""

new_cache = """            notifyStreaksToggle: document.getElementById('settingNotifyStreaks'),
            densitySelect: document.getElementById('settingDensitySelect'),
            reducedMotionToggle: document.getElementById('settingReducedMotion'),
            saveBtn: document.getElementById('btnSaveSettings'),"""

if old_cache in text:
    text = text.replace(old_cache, new_cache, 1)
    print("Updated cacheElements")

# 2. Update saveSettings
old_save_settings = """            // Dispatch theme change event so all components adapt
            window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: currentSettings.theme } }));
        }

        showToast('✓ Preferences saved successfully!');"""

new_save_settings = """            // Dispatch theme change event so all components adapt
            window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: currentSettings.theme } }));
        }

        // Apply interface density
        if (currentSettings.interfaceDensity === 'compact') {
            document.documentElement.setAttribute('data-density', 'compact');
        } else {
            document.documentElement.removeAttribute('data-density');
        }

        // Apply reduced motion
        if (currentSettings.reducedMotion) {
            document.documentElement.setAttribute('data-reduced-motion', 'true');
        } else {
            document.documentElement.removeAttribute('data-reduced-motion');
        }

        showToast('✓ Preferences saved successfully!');
        if (window.CodeArenaToast) {
            window.CodeArenaToast.success('Preferences saved successfully!');
        }"""

if old_save_settings in text:
    text = text.replace(old_save_settings, new_save_settings, 1)
    print("Updated saveSettings")

# 3. Update saveBtn in bindEvents
old_save_btn = """                if (dom.notifyStreaksToggle) currentSettings.notifyStreaks = dom.notifyStreaksToggle.checked;

                saveSettings();"""

new_save_btn = """                if (dom.notifyStreaksToggle) currentSettings.notifyStreaks = dom.notifyStreaksToggle.checked;
                if (dom.densitySelect) currentSettings.interfaceDensity = dom.densitySelect.value;
                if (dom.reducedMotionToggle) currentSettings.reducedMotion = dom.reducedMotionToggle.checked;

                saveSettings();"""

if old_save_btn in text:
    text = text.replace(old_save_btn, new_save_btn, 1)
    print("Updated saveBtn")

# 4. Update resetBtn in bindEvents
old_reset_btn = """                if (confirm('Reset all editor, appearance, and interface preferences to default?')) {
                    currentSettings = Object.assign({}, DEFAULT_SETTINGS);
                    saveSettings();
                    applySettingsToUI();
                    showToast('Settings reset to default configuration.', 'info');
                }"""

new_reset_btn = """                if (confirm('Reset all editor, appearance, and interface preferences to default?')) {
                    currentSettings = Object.assign({}, DEFAULT_SETTINGS);
                    saveSettings();
                    applySettingsToUI();
                    showToast('Settings reset to default configuration.', 'info');
                    if (window.CodeArenaToast) {
                        window.CodeArenaToast.info('Settings reset to defaults');
                    }
                }"""

if old_reset_btn in text:
    text = text.replace(old_reset_btn, new_reset_btn, 1)
    print("Updated resetBtn")

with open('frontend/js/settings.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("settings.js updated successfully")

