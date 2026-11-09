"""
CodeArena — Dashboard Authentication State & Logout Visual Inspection Tool
Captures screenshots across Scenarios A through I using Chrome DevTools Protocol.
"""

import os
import sys
import subprocess
import time
import json
import urllib.request
import urllib.parse
import socket
import base64
import threading
import http.server
import socketserver
from functools import partial

CHROME_BIN = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUTPUT_DIR = r"C:\Users\tarun\.gemini\antigravity\brain\65cff54b-be87-40ca-a32d-ef069c3de2d5"
SCREENSHOTS_SUBDIR = os.path.join(OUTPUT_DIR, "screenshots")
os.makedirs(SCREENSHOTS_SUBDIR, exist_ok=True)

class SilentHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    def copyfile(self, source, outputfile):
        try:
            super().copyfile(source, outputfile)
        except Exception:
            pass

class RobustThreadingServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    daemon_threads = True
    allow_reuse_address = True

    def handle_error(self, request, client_address):
        # Ignore client disconnects / connection resets typical on Windows
        pass

def start_local_server(root_dir=r"C:\CodeArena"):
    handler = partial(SilentHandler, directory=root_dir)
    httpd = RobustThreadingServer(("127.0.0.1", 0), handler)
    port = httpd.server_address[1]
    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()
    print(f"Spawned local HTTP server on http://127.0.0.1:{port}/ (serving {root_dir})")
    return httpd, port

def find_free_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('127.0.0.1', 0))
        return s.getsockname()[1]

class SimpleWebSocket:
    def __init__(self, host, port, path):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.settimeout(15.0)
        self.sock.connect((host, port))
        key = base64.b64encode(os.urandom(16)).decode("ascii")
        headers = (
            f"GET {path} HTTP/1.1\r\n"
            f"Host: {host}:{port}\r\n"
            f"Upgrade: websocket\r\n"
            f"Connection: Upgrade\r\n"
            f"Sec-WebSocket-Key: {key}\r\n"
            f"Sec-WebSocket-Version: 13\r\n\r\n"
        )
        self.sock.sendall(headers.encode("ascii"))
        res = self.sock.recv(4096)
        if b"101" not in res:
            raise RuntimeError(f"WebSocket upgrade failed: {res[:200]}")

    def send_frame(self, text):
        data = text.encode("utf-8")
        frame = bytearray([0x81])
        length = len(data)
        if length <= 125:
            frame.append(0x80 | length)
        elif length <= 65535:
            frame.append(0x80 | 126)
            frame.extend(length.to_bytes(2, "big"))
        else:
            frame.append(0x80 | 127)
            frame.extend(length.to_bytes(8, "big"))
        mask = os.urandom(4)
        frame.extend(mask)
        masked_data = bytearray(b ^ mask[i % 4] for i, b in enumerate(data))
        frame.extend(masked_data)
        self.sock.sendall(frame)

    def recv_frame(self):
        head = self.sock.recv(2)
        if not head:
            return ""
        b1, b2 = head[0], head[1]
        length = b2 & 0x7F
        if length == 126:
            length = int.from_bytes(self.sock.recv(2), "big")
        elif length == 127:
            length = int.from_bytes(self.sock.recv(8), "big")

        payload = bytearray()
        while len(payload) < length:
            chunk = self.sock.recv(min(length - len(payload), 65536))
            if not chunk:
                break
            payload.extend(chunk)
        return payload.decode("utf-8", errors="replace")

    def close(self):
        try:
            self.sock.close()
        except Exception:
            pass

class ChromeTabSession:
    def __init__(self, ws_url):
        u = urllib.parse.urlparse(ws_url)
        self.ws = SimpleWebSocket(u.hostname, u.port, u.path)
        self.msg_id = 1

    def call(self, method, params=None):
        mid = self.msg_id
        self.msg_id += 1
        req = {"id": mid, "method": method, "params": params or {}}
        self.ws.send_frame(json.dumps(req))

        while True:
            raw = self.ws.recv_frame()
            if not raw:
                raise RuntimeError("Empty response from CDP WebSocket")
            data = json.loads(raw)
            if data.get("id") == mid:
                if "error" in data:
                    raise RuntimeError(f"CDP Error in {method}: {data['error']}")
                return data

    def eval(self, expr):
        res = self.call("Runtime.evaluate", {
            "expression": expr,
            "returnByValue": True,
            "awaitPromise": True
        })
        val = res.get("result", {}).get("result", {}).get("value")
        if val is None and "value" in res.get("result", {}):
            val = res.get("result", {}).get("value")
        return val

    def navigate_to(self, url, wait_seconds=1.5):
        self.call("Page.navigate", {"url": url})
        time.sleep(0.5)
        start = time.time()
        while time.time() - start < 8.0:
            time.sleep(0.3)
            try:
                state = self.eval("document.readyState")
                if state == "complete":
                    break
            except Exception:
                pass
        time.sleep(wait_seconds)

    def capture_screenshot(self, filepath):
        res = self.call("Page.captureScreenshot", {"format": "png"})
        b64_data = res.get("result", {}).get("data", "")
        img_bytes = base64.b64decode(b64_data)
        with open(filepath, "wb") as f:
            f.write(img_bytes)
        basename = os.path.basename(filepath)
        sub_path = os.path.join(SCREENSHOTS_SUBDIR, basename)
        with open(sub_path, "wb") as f:
            f.write(img_bytes)
        print(f"  [SAVED] {basename} ({len(img_bytes)} bytes)")

    def close(self):
        self.ws.close()

def run_inspection():
    httpd, server_port = start_local_server()
    cdp_port = find_free_port()
    user_data_dir = os.path.join(r"C:\CodeArena\scratch", f"chrome_dash_auth_{int(time.time())}")
    os.makedirs(user_data_dir, exist_ok=True)

    cmd = [
        CHROME_BIN,
        f"--remote-debugging-port={cdp_port}",
        f"--user-data-dir={user_data_dir}",
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-background-networking",
        "about:blank"
    ]
    proc = subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(2.0)

    try:
        targets_raw = urllib.request.urlopen(f"http://127.0.0.1:{cdp_port}/json", timeout=5).read()
        targets = json.loads(targets_raw.decode("utf-8"))
        ws_url = None
        for t in targets:
            if t.get("type") == "page" and "webSocketDebuggerUrl" in t:
                ws_url = t["webSocketDebuggerUrl"]
                break
        if not ws_url:
            raise RuntimeError(f"No valid page debug target found: {targets}")

        session = ChromeTabSession(ws_url)
        session.call("Page.enable")
        session.call("DOM.enable")
        session.call("CSS.enable")
        session.call("Runtime.enable")

        # Set default desktop viewport
        session.call("Emulation.setDeviceMetricsOverride", {
            "width": 1440, "height": 900, "deviceScaleFactor": 1, "mobile": False
        })

        # ----------------------------------------------------------------------
        # SCENARIO A: Guest Opens Dashboard
        # ----------------------------------------------------------------------
        print("\n--- Scenario A: Guest opens Dashboard ---")
        session.navigate_to(f"http://127.0.0.1:{server_port}/frontend/pages/dashboard.html")
        session.eval("localStorage.clear(); sessionStorage.clear();")
        session.navigate_to(f"http://127.0.0.1:{server_port}/frontend/pages/dashboard.html")

        guest_check = session.eval("""
            (() => {
                const ga = document.getElementById('guestAuthActions');
                const pa = document.getElementById('userProfileArea');
                const isAuth = Boolean(window.CodeArenaAPI && window.CodeArenaAPI.authService && window.CodeArenaAPI.authService.isAuthenticated());
                return JSON.stringify({
                    guestDisplay: ga ? window.getComputedStyle(ga).display : 'none',
                    profileDisplay: pa ? window.getComputedStyle(pa).display : 'none',
                    isAuth: isAuth
                });
            })()
        """)
        print(f"  Guest state check: {guest_check}")
        session.capture_screenshot(os.path.join(OUTPUT_DIR, "screenshot_dash_guest.png"))

        # ----------------------------------------------------------------------
        # SCENARIO B: User Logs In (tharunnagabramhagna)
        # ----------------------------------------------------------------------
        print("\n--- Scenario B: User logs in (tharunnagabramhagna) ---")
        session.eval("""
            (() => {
                const user = {
                    id: 'usr_tharun_101',
                    name: 'tharunnagabramhagna',
                    fullName: 'tharunnagabramhagna',
                    email: 'tharunnagabramhagna@codearena.dev',
                    role: 'Student',
                    plan: 'free',
                    isMockSession: true
                };
                localStorage.setItem('codearena_auth_user', JSON.stringify(user));
                localStorage.setItem('codearena_preview_auth_user', JSON.stringify(user));
            })();
        """)
        session.navigate_to(f"http://127.0.0.1:{server_port}/frontend/pages/dashboard.html", wait_seconds=2.0)

        auth_check = session.eval("""
            (() => {
                const ga = document.getElementById('guestAuthActions');
                const pa = document.getElementById('userProfileArea');
                const un = document.getElementById('userName');
                const ua = document.getElementById('userAvatar');
                const ur = document.getElementById('userRole');
                const isAuth = Boolean(window.CodeArenaAPI && window.CodeArenaAPI.authService && window.CodeArenaAPI.authService.isAuthenticated());
                return JSON.stringify({
                    isAuth: isAuth,
                    guestDisplay: ga ? window.getComputedStyle(ga).display : 'none',
                    profileDisplay: pa ? window.getComputedStyle(pa).display : 'none',
                    userName: un ? un.textContent : '',
                    userAvatar: ua ? ua.textContent : '',
                    userRole: ur ? ur.textContent : ''
                });
            })()
        """)
        print(f"  Authenticated dashboard state: {auth_check}")
        session.capture_screenshot(os.path.join(OUTPUT_DIR, "screenshot_dash_authenticated_dark.png"))

        # ----------------------------------------------------------------------
        # SCENARIO C: Desktop Light Theme
        # ----------------------------------------------------------------------
        print("\n--- Scenario C: Desktop Light Theme ---")
        session.eval("document.documentElement.setAttribute('data-theme', 'light');")
        time.sleep(0.5)
        session.capture_screenshot(os.path.join(OUTPUT_DIR, "screenshot_dash_authenticated_light.png"))
        session.eval("document.documentElement.setAttribute('data-theme', 'dark');")
        time.sleep(0.3)

        # ----------------------------------------------------------------------
        # SCENARIO D: Account Dropdown Open
        # ----------------------------------------------------------------------
        print("\n--- Scenario D: Account Dropdown Open ---")
        session.eval("document.getElementById('userProfileTrigger').click();")
        time.sleep(0.5)

        dropdown_check = session.eval("""
            (() => {
                const menu = document.getElementById('userProfileMenu');
                const mun = document.getElementById('menuUserName');
                const mue = document.getElementById('menuUserEmail');
                const mut = document.getElementById('menuUserTier');
                return JSON.stringify({
                    menuOpen: menu ? menu.classList.contains('menu-open') : false,
                    menuUserName: mun ? mun.textContent : '',
                    menuUserEmail: mue ? mue.textContent : '',
                    menuUserTier: mut ? mut.textContent : ''
                });
            })()
        """)
        print(f"  Dropdown state check: {dropdown_check}")
        session.capture_screenshot(os.path.join(OUTPUT_DIR, "screenshot_dash_dropdown_open.png"))

        # ----------------------------------------------------------------------
        # SCENARIO E: Click Log Out (Confirmation Modal)
        # ----------------------------------------------------------------------
        print("\n--- Scenario E: Logout confirmation dialog ---")
        session.eval("document.getElementById('logoutBtn').click();")
        time.sleep(0.5)

        modal_check = session.eval("""
            (() => {
                const modal = document.getElementById('logoutModalOverlay');
                return JSON.stringify({
                    modalDisplay: modal ? window.getComputedStyle(modal).display : 'none'
                });
            })()
        """)
        print(f"  Logout modal check: {modal_check}")
        session.capture_screenshot(os.path.join(OUTPUT_DIR, "screenshot_dash_logout_modal.png"))

        # ----------------------------------------------------------------------
        # SCENARIO F: Confirm Log Out -> Revert to Guest
        # ----------------------------------------------------------------------
        print("\n--- Scenario F: Confirm Log Out ---")
        session.eval("document.getElementById('btnConfirmLogout').click();")
        time.sleep(0.8)

        post_logout_check = session.eval("""
            (() => {
                const ga = document.getElementById('guestAuthActions');
                const pa = document.getElementById('userProfileArea');
                const modal = document.getElementById('logoutModalOverlay');
                const isAuth = Boolean(window.CodeArenaAPI && window.CodeArenaAPI.authService && window.CodeArenaAPI.authService.isAuthenticated());
                return JSON.stringify({
                    isAuth: isAuth,
                    guestDisplay: ga ? window.getComputedStyle(ga).display : 'none',
                    profileDisplay: pa ? window.getComputedStyle(pa).display : 'none',
                    modalDisplay: modal ? window.getComputedStyle(modal).display : 'none',
                    hasStorageCanonical: localStorage.getItem('codearena_preview_auth_user') !== null,
                    hasStorageLegacy: localStorage.getItem('codearena_auth_user') !== null
                });
            })()
        """)
        print(f"  Post-logout check: {post_logout_check}")
        session.capture_screenshot(os.path.join(OUTPUT_DIR, "screenshot_dash_after_logout.png"))

        # ----------------------------------------------------------------------
        # SCENARIO G: Cross-Page AI Assistant Protection (Guest Rejection)
        # ----------------------------------------------------------------------
        print("\n--- Scenario G: Protected page guest redirect ---")
        session.navigate_to(f"http://127.0.0.1:{server_port}/frontend/pages/ai_assistant.html", wait_seconds=1.5)
        guest_nav_url = session.eval("window.location.href")
        print(f"  Guest attempted ai_assistant.html, resolved to: {guest_nav_url}")
        session.capture_screenshot(os.path.join(OUTPUT_DIR, "screenshot_ai_gate_after_logout.png"))

        # ----------------------------------------------------------------------
        # SCENARIO H: Cross-Page Identity Parity (Login & Check Both)
        # ----------------------------------------------------------------------
        print("\n--- Scenario H: Cross-page identity parity ---")
        # 1. Login user on the current origin
        session.eval("""
            (() => {
                const user = {
                    id: 'usr_tharun_101',
                    name: 'tharunnagabramhagna',
                    fullName: 'tharunnagabramhagna',
                    email: 'tharunnagabramhagna@codearena.dev',
                    role: 'Student',
                    plan: 'free',
                    isMockSession: true
                };
                localStorage.setItem('codearena_auth_user', JSON.stringify(user));
                localStorage.setItem('codearena_preview_auth_user', JSON.stringify(user));
            })();
        """)
        time.sleep(0.5)

        # 2. Navigate to AI Assistant
        session.navigate_to(f"http://127.0.0.1:{server_port}/frontend/pages/ai_assistant.html", wait_seconds=2.0)
        ai_url = session.eval("window.location.href")
        print(f"  Navigated to AI Assistant, current URL: {ai_url}")

        ai_auth_name = session.eval("""
            document.getElementById('aiStudentDisplayName') ? document.getElementById('aiStudentDisplayName').textContent : ''
        """)
        print(f"  AI Assistant student badge: '{ai_auth_name}'")
        session.capture_screenshot(os.path.join(OUTPUT_DIR, "screenshot_ai_assistant_same_identity.png"))

        # 3. Return to Dashboard
        session.navigate_to(f"http://127.0.0.1:{server_port}/frontend/pages/dashboard.html", wait_seconds=2.0)
        dash_auth_name = session.eval("""
            document.getElementById('userName') ? document.getElementById('userName').textContent : ''
        """)
        print(f"  Dashboard user header name: '{dash_auth_name}'")

        assert ai_auth_name == dash_auth_name, f"Identity mismatch: AI='{ai_auth_name}', Dash='{dash_auth_name}'"
        assert ai_auth_name == "tharunnagabramhagna", f"Expected 'tharunnagabramhagna', got '{ai_auth_name}'"
        print("  [PASS] Perfect identity parity confirmed: 'tharunnagabramhagna' matches across both pages!")

        # ----------------------------------------------------------------------
        # SCENARIO I: Responsive Testing (Tablet & Mobile)
        # ----------------------------------------------------------------------
        print("\n--- Scenario I: Responsive testing ---")
        # Tablet (768x1024)
        session.call("Emulation.setDeviceMetricsOverride", {
            "width": 768, "height": 1024, "deviceScaleFactor": 1, "mobile": True
        })
        time.sleep(0.5)
        session.capture_screenshot(os.path.join(OUTPUT_DIR, "screenshot_dash_tablet.png"))

        # Mobile (390x844 iPhone)
        session.call("Emulation.setDeviceMetricsOverride", {
            "width": 390, "height": 844, "deviceScaleFactor": 2, "mobile": True
        })
        time.sleep(0.5)
        overflow_check = session.eval("""
            JSON.stringify({
                scrollWidth: document.documentElement.scrollWidth,
                innerWidth: window.innerWidth,
                hasOverflow: document.documentElement.scrollWidth > window.innerWidth
            })
        """)
        print(f"  Mobile 390px overflow audit: {overflow_check}")
        session.capture_screenshot(os.path.join(OUTPUT_DIR, "screenshot_dash_mobile.png"))

        print("\n[SUCCESS] All inspection scenarios completed successfully!")

    finally:
        try:
            httpd.server_close()
        except Exception:
            pass
        try:
            session.close()
        except Exception:
            pass
        try:
            proc.terminate()
            proc.wait(timeout=3)
        except Exception:
            try:
                proc.kill()
            except Exception:
                pass

if __name__ == "__main__":
    run_inspection()
