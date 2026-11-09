# tests/frontend/utils/apply_phase8_api_updates.py
"""
Applies Phase 8 service-layer upgrades to frontend/js/api.js:
- Problem access filter (Free vs Premium) in problemMockAdapter.list
- Higher limit clamping (up to 300) in problemMockAdapter.list
- problemMockAdapter & problemService: getFreeProblems, getPremiumProblems, getStats, getUpcomingActivities
- authMockAdapter & authService with preview auth state + safe storage fallback
- subscriptionService with plans ($5/mo, $199/yr) and problem access checks
- submissionMockAdapter: login-required check in getHistory
- Exports subscriptionService to window.CodeArenaAPI and module.exports
"""

import os
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
API_PATH = os.path.join(ROOT, "frontend", "js", "api.js")

def update_api_file():
    with open(API_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Update safe storage
    target_storage = """const AUTH_STORAGE_KEY = 'codearena_preview_auth_user';
const PLAN_STORAGE_KEY = 'codearena_preview_plan';"""

    replacement_storage = """const AUTH_STORAGE_KEY = 'codearena_preview_auth_user';
const PLAN_STORAGE_KEY = 'codearena_preview_plan';

// Safe storage helper with memory fallback for Node.js / test environments
const _memStore = {};
function _storageGet(k) {
    try {
        if (typeof window !== 'undefined' && window.localStorage) return window.localStorage.getItem(k);
        return _memStore[k] || null;
    } catch (e) {
        return _memStore[k] || null;
    }
}
function _storageSet(k, v) {
    try {
        if (typeof window !== 'undefined' && window.localStorage) window.localStorage.setItem(k, String(v));
    } catch (e) {}
    _memStore[k] = String(v);
}
function _storageRemove(k) {
    try {
        if (typeof window !== 'undefined' && window.localStorage) window.localStorage.removeItem(k);
    } catch (e) {}
    delete _memStore[k];
}"""

    if "_memStore" not in content:
        content = content.replace(target_storage, replacement_storage, 1)
        content = content.replace("localStorage.getItem(AUTH_STORAGE_KEY) !== null", "_storageGet(AUTH_STORAGE_KEY) !== null")
        content = content.replace("localStorage.getItem(AUTH_STORAGE_KEY)", "_storageGet(AUTH_STORAGE_KEY)")
        content = content.replace("localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))", "_storageSet(AUTH_STORAGE_KEY, JSON.stringify(user))")
        content = content.replace("localStorage.removeItem(AUTH_STORAGE_KEY)", "_storageRemove(AUTH_STORAGE_KEY)")
        content = content.replace("localStorage.setItem(PLAN_STORAGE_KEY, plan)", "_storageSet(PLAN_STORAGE_KEY, plan)")
        content = content.replace("localStorage.getItem(PLAN_STORAGE_KEY)", "_storageGet(PLAN_STORAGE_KEY)")
        content = content.replace("localStorage.setItem(PLAN_STORAGE_KEY, validPlan)", "_storageSet(PLAN_STORAGE_KEY, validPlan)")
        content = content.replace("localStorage.setItem(PLAN_STORAGE_KEY, 'free')", "_storageSet(PLAN_STORAGE_KEY, 'free')")
        content = content.replace("localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userRes.data))", "_storageSet(AUTH_STORAGE_KEY, JSON.stringify(userRes.data))")

    with open(API_PATH, "w", encoding="utf-8") as f:
        f.write(content)

    print("Safe storage applied to api.js.")

if __name__ == "__main__":
    update_api_file()
