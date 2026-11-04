import os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
API_PATH = os.path.join(ROOT, "frontend", "js", "api.js")

with open(API_PATH, "r", encoding="utf-8") as f:
    c = f.read()

# Replace if (typeof window !== 'undefined') { _storageSet... with direct _storageSet
c = c.replace("""        try {
            if (typeof window !== 'undefined') {
                _storageSet(AUTH_STORAGE_KEY, JSON.stringify(user));
            }
        } catch (e) {}""", """        try {
            _storageSet(AUTH_STORAGE_KEY, JSON.stringify(user));
        } catch (e) {}""")

c = c.replace("""        try {
            if (typeof window !== 'undefined') {
                _storageRemove(AUTH_STORAGE_KEY);
            }
        } catch (e) {}""", """        try {
            _storageRemove(AUTH_STORAGE_KEY);
        } catch (e) {}""")

c = c.replace("""        try {
            if (typeof window !== 'undefined') {
                _storageSet(AUTH_STORAGE_KEY, JSON.stringify(user));
                _storageSet(PLAN_STORAGE_KEY, plan);
            }
        } catch (e) {}""", """        try {
            _storageSet(AUTH_STORAGE_KEY, JSON.stringify(user));
            _storageSet(PLAN_STORAGE_KEY, plan);
        } catch (e) {}""")

c = c.replace("""        try {
            if (typeof window === 'undefined') return 'free';
            return _storageGet(PLAN_STORAGE_KEY) || 'free';
        } catch (e) {""", """        try {
            return _storageGet(PLAN_STORAGE_KEY) || 'free';
        } catch (e) {""")

c = c.replace("""        try {
            if (typeof window !== 'undefined') {
                _storageSet(PLAN_STORAGE_KEY, validPlan);
                const userRes = authMockAdapter.getCurrentUser();
                if (userRes && userRes.success && userRes.data) {
                    userRes.data.plan = validPlan;
                    _storageSet(AUTH_STORAGE_KEY, JSON.stringify(userRes.data));
                }
            }
        } catch (e) {}""", """        try {
            _storageSet(PLAN_STORAGE_KEY, validPlan);
            const userRes = authMockAdapter.getCurrentUser();
            if (userRes && userRes.success && userRes.data) {
                userRes.data.plan = validPlan;
                _storageSet(AUTH_STORAGE_KEY, JSON.stringify(userRes.data));
            }
        } catch (e) {}""")

c = c.replace("""        try {
            if (typeof window !== 'undefined') {
                _storageSet(PLAN_STORAGE_KEY, 'free');
                const userRes = authMockAdapter.getCurrentUser();
                if (userRes && userRes.success && userRes.data) {
                    userRes.data.plan = 'free';
                    _storageSet(AUTH_STORAGE_KEY, JSON.stringify(userRes.data));
                }
            }
        } catch (e) {}""", """        try {
            _storageSet(PLAN_STORAGE_KEY, 'free');
            const userRes = authMockAdapter.getCurrentUser();
            if (userRes && userRes.success && userRes.data) {
                userRes.data.plan = 'free';
                _storageSet(AUTH_STORAGE_KEY, JSON.stringify(userRes.data));
            }
        } catch (e) {}""")

with open(API_PATH, "w", encoding="utf-8") as f:
    f.write(c)

print("Direct storage calls enabled.")
