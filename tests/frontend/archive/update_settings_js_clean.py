# update_settings_js_clean.py

with open('frontend/js/settings.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update cacheElements
old_cache = """            notifyContestsToggle: document.getElementById('settingNotifyContests'),
            notifyStreaksToggle: document.getElementById('settingNotifyStreaks'),
            saveBtn: document.getElementById('btnSaveSettings'),
            resetBtn: document.getElementById('btnResetSettings'),
            toast: document.getElementById('settingsToast')
        };"""

new_cache = """            notifyContestsToggle: document.getElementById('settingNotifyContests'),
            notifyStreaksToggle: document.getElementById('settingNotifyStreaks'),
            densitySelect: document.getElementById('settingDensitySelect'),
            reducedMotionToggle: document.getElementById('settingReducedMotion'),
            saveBtn: document.getElementById('btnSaveSettings'),
            resetBtn: document.getElementById('btnResetSettings'),
            toast: document.getElementById('settingsToast')
        };"""

if old_cache in text:
    text = text.replace(old_cache, new_cache, 1)
    print("Updated cacheElements in settings.js")
else:
    print("Warning: old_cache not found in settings.js")

# 2. Update applySettingsToUI
old_apply_ui = """        if (dom.notifyContestsToggle) dom.notifyContestsToggle.checked = currentSettings.notifyContests;
        if (dom.notifyStreaksToggle) dom.notifyStreaksToggle.checked = currentSettings.notifyStreaks;
    }"""

new_apply_ui = """        if (dom.notifyContestsToggle) dom.notifyContestsToggle.checked = currentSettings.notifyContests;
        if (dom.notifyStreaksToggle) dom.notifyStreaksToggle.checked = currentSettings.notifyStreaks;
        if (dom.densitySelect) dom.densitySelect.value = currentSettings.interfaceDensity || 'comfortable';
        if (dom.reducedMotionToggle) dom.reducedMotionToggle.checked = !!currentSettings.reducedMotion;
    }"""

if old_apply_ui in text:
    text = text.replace(old_apply_ui, new_apply_ui, 1)
    print("Updated applySettingsToUI in settings.js")
else:
    print("Warning: old_apply_ui not found in settings.js")

# 3. Update saveSettings (to apply data-density & data-reduced-motion)
old_save_settings = """        // Dispatch theme change event so all components adapt
        window.dispatchEvent(new CustomEvent('codearena-theme-changed', {
            detail: { theme: currentSettings.theme }
        }));"""

new_save_settings = """        // Dispatch theme change event so all components adapt
        window.dispatchEvent(new CustomEvent('codearena-theme-changed', {
            detail: { theme: currentSettings.theme }
        }));

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
        }"""

if old_save_settings in text:
    text = text.replace(old_save_settings, new_save_settings, 1)
    print("Updated saveSettings in settings.js")
else:
    print("Warning: old_save_settings not found in settings.js")

# 4. Update bindEvents save & reset
old_save_btn = """                if (dom.notifyContestsToggle) currentSettings.notifyContests = dom.notifyContestsToggle.checked;
                if (dom.notifyStreaksToggle) currentSettings.notifyStreaks = dom.notifyStreaksToggle.checked;

                saveSettings();
                showToast('Settings saved successfully!', 'success');"""

new_save_btn = """                if (dom.notifyContestsToggle) currentSettings.notifyContests = dom.notifyContestsToggle.checked;
                if (dom.notifyStreaksToggle) currentSettings.notifyStreaks = dom.notifyStreaksToggle.checked;
                if (dom.densitySelect) currentSettings.interfaceDensity = dom.densitySelect.value;
                if (dom.reducedMotionToggle) currentSettings.reducedMotion = dom.reducedMotionToggle.checked;

                saveSettings();
                showToast('Settings saved successfully!', 'success');
                if (window.CodeArenaToast) {
                    window.CodeArenaToast.success('Settings saved successfully!');
                }"""

if old_save_btn in text:
    text = text.replace(old_save_btn, new_save_btn, 1)
    print("Updated saveBtn in settings.js")
else:
    print("Warning: old_save_btn not found in settings.js")

old_reset_btn = """        if (dom.resetBtn) {
            dom.resetBtn.addEventListener('click', function () {
                currentSettings = Object.assign({}, DEFAULT_SETTINGS);
                applySettingsToUI();
                saveSettings();
                showToast('Settings reset to defaults', 'info');
            });
        }"""

new_reset_btn = """        if (dom.resetBtn) {
            dom.resetBtn.addEventListener('click', function () {
                if (confirm('Are you sure you want to reset all preferences to defaults?')) {
                    currentSettings = Object.assign({}, DEFAULT_SETTINGS);
                    applySettingsToUI();
                    saveSettings();
                    showToast('Settings reset to defaults', 'info');
                    if (window.CodeArenaToast) {
                        window.CodeArenaToast.info('Settings reset to defaults');
                    }
                }
            });
        }"""

if old_reset_btn in text:
    text = text.replace(old_reset_btn, new_reset_btn, 1)
    print("Updated resetBtn in settings.js")
else:
    print("Warning: old_reset_btn not found in settings.js")

with open('frontend/js/settings.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("settings.js updated successfully")

