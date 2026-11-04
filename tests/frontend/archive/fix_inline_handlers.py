# fix_inline_handlers.py

# 1. Update contests.html
with open('frontend/pages/contests.html', 'r', encoding='utf-8') as f:
    cont_html = f.read()

old_cont_btn = '<button type="button" class="secondary-header-btn" onclick="document.getElementById(\'contestModalOverlay\').style.display=\'none\'">'
new_cont_btn = '<button type="button" class="secondary-header-btn" id="closeContestModalBtn">'

assert old_cont_btn in cont_html, "old_cont_btn not found in contests.html"
cont_html = cont_html.replace(old_cont_btn, new_cont_btn)

with open('frontend/pages/contests.html', 'w', encoding='utf-8') as f:
    f.write(cont_html)
print("contests.html inline handler replaced with ID closeContestModalBtn")

# 2. Update submissions.html
with open('frontend/pages/submissions.html', 'r', encoding='utf-8') as f:
    sub_html = f.read()

old_sub_btn = '<button type="button" class="secondary-header-btn" onclick="document.getElementById(\'subCodeModalOverlay\').style.display=\'none\'">'
new_sub_btn = '<button type="button" class="secondary-header-btn" id="btnCloseSubModal">'

assert old_sub_btn in sub_html, "old_sub_btn not found in submissions.html"
sub_html = sub_html.replace(old_sub_btn, new_sub_btn)

with open('frontend/pages/submissions.html', 'w', encoding='utf-8') as f:
    f.write(sub_html)
print("submissions.html inline handler replaced with ID btnCloseSubModal")

# 3. Update login.html and auth.js
with open('frontend/pages/login.html', 'r', encoding='utf-8') as f:
    login_html = f.read()

old_forgot = '<a href="#" class="forgot-link" onclick="alert(\'Password reset functionality will be enabled with backend email services.\'); return false;">Forgot password?</a>'
new_forgot = '<a href="#" class="forgot-link" id="forgotPasswordLink">Forgot password?</a>'

assert old_forgot in login_html, "old_forgot not found in login.html"
login_html = login_html.replace(old_forgot, new_forgot)

with open('frontend/pages/login.html', 'w', encoding='utf-8') as f:
    f.write(login_html)
print("login.html inline handler replaced with ID forgotPasswordLink")

with open('frontend/js/auth.js', 'r', encoding='utf-8') as f:
    auth_js = f.read()

forgot_handler = '''    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    if (forgotPasswordLink && loginFeedback) {
        forgotPasswordLink.addEventListener('click', function (e) {
            e.preventDefault();
            showFeedback(loginFeedback, 'Password reset will be enabled when backend email service is connected.', 'info');
        });
    }'''

auth_js = auth_js.replace(
    "    const loginForm = document.getElementById('loginForm');",
    forgot_handler + "\n\n    const loginForm = document.getElementById('loginForm');"
)

with open('frontend/js/auth.js', 'w', encoding='utf-8') as f:
    f.write(auth_js)
print("auth.js updated with forgotPasswordLink handler")

