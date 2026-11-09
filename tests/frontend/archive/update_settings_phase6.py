# update_settings_phase6.py

# 1. Update settings.html
with open('frontend/pages/settings.html', 'r', encoding='utf-8') as f:
    s_html = f.read()

# Add density and reduced motion to sec-interface
target_row = """                <div class="settings-row">
                    <div class="settings-row-info">
                        <h4>Execution Timer</h4>"""

replacement_rows = """                <div class="settings-row">
                    <div class="settings-row-info">
                        <h4>Interface Density</h4>
                        <p>Adjust padding and spacing across tables, cards, and toolbars.</p>
                    </div>
                    <select id="settingDensitySelect" class="settings-select" aria-label="Interface Density">
                        <option value="comfortable">Comfortable (Default)</option>
                        <option value="compact">Compact (Power User)</option>
                    </select>
                </div>

                <div class="settings-row">
                    <div class="settings-row-info">
                        <h4>Reduced Motion Override</h4>
                        <p>Disable transitions and animations regardless of operating system defaults.</p>
                    </div>
                    <label class="switch-toggle" aria-label="Toggle reduced motion">
                        <input type="checkbox" id="settingReducedMotion">
                        <span class="switch-slider"></span>
                    </label>
                </div>

                <div class="settings-row">
                    <div class="settings-row-info">
                        <h4>Execution Timer</h4>"""

if target_row in s_html and 'settingDensitySelect' not in s_html:
    s_html = s_html.replace(target_row, replacement_rows, 1)
    print("Added density and reduced motion rows to settings.html")

if '<script src="../js/toast.js"></script>' not in s_html:
    s_html = s_html.replace('<script src="../js/settings.js"></script>', '<script src="../js/toast.js"></script>\n    <script src="../js/settings.js"></script>')
    print("Added toast.js to settings.html")

with open('frontend/pages/settings.html', 'w', encoding='utf-8') as f:
    f.write(s_html)

# 2. Update settings.js
with open('frontend/js/settings.js', 'r', encoding='utf-8') as f:
    s_js = f.read()

# Add to DEFAULT_SETTINGS
old_defaults = """        autoRunSampleTests: false,
        compactToolbar: false,"""

new_defaults = """        autoRunSampleTests: false,
        compactToolbar: false,
        interfaceDensity: 'comfortable',
        reducedMotion: false,"""

if old_defaults in s_js and 'interfaceDensity' not in s_js:
    s_js = s_js.replace(old_defaults, new_defaults, 1)
    print("Updated DEFAULT_SETTINGS in settings.js")

# Cache elements
old_cache = """            autoRun: document.getElementById('settingAutoRun'),
            compactToolbar: document.getElementById('settingCompactToolbar'),"""

new_cache = """            autoRun: document.getElementById('settingAutoRun'),
            compactToolbar: document.getElementById('settingCompactToolbar'),
            densitySelect: document.getElementById('settingDensitySelect'),
            reducedMotion: document.getElementById('settingReducedMotion'),"""

if old_cache in s_js and 'densitySelect' not in s_js:
    s_js = s_js.replace(old_cache, new_cache, 1)
    print("Updated cacheElements in settings.js")

# Populate form in populateForm()
old_populate = """        if (dom.compactToolbar) dom.compactToolbar.checked = !!currentSettings.compactToolbar;"""
new_populate = """        if (dom.compactToolbar) dom.compactToolbar.checked = !!currentSettings.compactToolbar;
        if (dom.densitySelect) dom.densitySelect.value = currentSettings.interfaceDensity || 'comfortable';
        if (dom.reducedMotion) dom.reducedMotion.checked = !!currentSettings.reducedMotion;"""

if old_populate in s_js and 'dom.densitySelect.value' not in s_js:
    s_js = s_js.replace(old_populate, new_populate, 1)
    print("Updated populateForm in settings.js")

# Read form in readForm()
old_read = """            compactToolbar: dom.compactToolbar ? dom.compactToolbar.checked : false,"""
new_read = """            compactToolbar: dom.compactToolbar ? dom.compactToolbar.checked : false,
            interfaceDensity: dom.densitySelect ? dom.densitySelect.value : 'comfortable',
            reducedMotion: dom.reducedMotion ? dom.reducedMotion.checked : false,"""

if old_read in s_js and 'interfaceDensity:' not in s_js:
    s_js = s_js.replace(old_read, new_read, 1)
    print("Updated readForm in settings.js")

# Apply live settings
old_apply = """        if (currentSettings.theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }"""

new_apply = """        if (currentSettings.theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }

        // Apply density
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

if old_apply in s_js and 'Apply density' not in s_js:
    s_js = s_js.replace(old_apply, new_apply, 1)
    print("Updated applySettings in settings.js")

# Enhance reset confirmation and toast in handleReset()
old_reset = """    function handleReset() {
        currentSettings = Object.assign({}, DEFAULT_SETTINGS);
        populateForm();
        applyLiveSettings();
        saveSettingsToStorage();
        showFeedbackToast('Settings reset to defaults');
    }"""

new_reset = """    function handleReset() {
        if (!confirm('Are you sure you want to reset all preferences to defaults?')) {
            return;
        }
        currentSettings = Object.assign({}, DEFAULT_SETTINGS);
        populateForm();
        applyLiveSettings();
        saveSettingsToStorage();
        showFeedbackToast('Settings reset to defaults');
        if (window.CodeArenaToast) {
            window.CodeArenaToast.info('Settings reset to defaults');
        }
    }"""

if old_reset in s_js:
    s_js = s_js.replace(old_reset, new_reset, 1)
    print("Updated handleReset in settings.js")

# Toast in handleSave()
old_save = """    function handleSave() {
        readFormIntoState();
        applyLiveSettings();
        saveSettingsToStorage();
        showFeedbackToast('Preferences saved successfully!');
    }"""

new_save = """    function handleSave() {
        readFormIntoState();
        applyLiveSettings();
        saveSettingsToStorage();
        showFeedbackToast('Preferences saved successfully!');
        if (window.CodeArenaToast) {
            window.CodeArenaToast.success('Preferences saved successfully!');
        }
    }"""

if old_save in s_js:
    s_js = s_js.replace(old_save, new_save, 1)
    print("Updated handleSave in settings.js")

with open('frontend/js/settings.js', 'w', encoding='utf-8') as f:
    f.write(s_js)

print("Settings Phase 6 updates completed.")

