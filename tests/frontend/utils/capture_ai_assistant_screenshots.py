"""
CodeArena — Flagship AI Assistant Visual Verification & Inspection Tool
Captures screenshots of ai_assistant.html and guest gate login flow across:
1. Guest Gate Redirect (login.html with authentication notice)
2. Desktop Dark Theme with student conversations sidebar & search
3. Desktop Light Theme
4. Conversational natural interaction ("hi how are you" natural greeting)
5. Multi-turn Java code block & copy button
6. Tablet Viewport (768x1024)
7. Mobile Viewport (390x844) with mobile drawer
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

def ensure_live_server(root_dir=r"C:\CodeArena", port=5500):
    try:
        res = urllib.request.urlopen(f"http://127.0.0.1:{port}/frontend/pages/ai_assistant.html", timeout=1)
        if res.getcode() == 200:
            print(f"Existing server detected on port {port}.")
            return None
    except Exception:
        pass

    try:
        handler = partial(SilentHandler, directory=root_dir)
        httpd = socketserver.TCPServer(("127.0.0.1", port), handler)
        thread = threading.Thread(target=httpd.serve_forever, daemon=True)
        thread.start()
        print(f"Spawned local HTTP server on http://127.0.0.1:{port}/ (serving {root_dir})")
        return httpd
    except Exception as e:
        print(f"Could not bind port {port}: {e}")
        return None

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
        length = head[1] & 0x7F
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

    def call(self, method, params=None, msg_id=1):
        payload = {"id": msg_id, "method": method, "params": params or {}}
        self.send_frame(json.dumps(payload))
        while True:
            raw = self.recv_frame()
            if not raw:
                return {}
            try:
                msg = json.loads(raw)
                if msg.get("id") == msg_id:
                    return msg
            except Exception:
                continue

    def close(self):
        try:
            self.sock.close()
        except Exception:
            pass

def capture_view(ws, msg_id, filename, width=1280, height=800):
    ws.call("Emulation.setDeviceMetricsOverride", {
        "width": width,
        "height": height,
        "deviceScaleFactor": 1,
        "mobile": (width < 768)
    }, msg_id=msg_id)
    time.sleep(0.4)
    res = ws.call("Page.captureScreenshot", {"format": "png", "captureBeyondViewport": False}, msg_id=msg_id + 1)
    b64 = res.get("result", {}).get("data", "")
    if b64:
        sub_path = os.path.join(SCREENSHOTS_SUBDIR, filename)
        root_path = os.path.join(OUTPUT_DIR, filename)
        data = base64.b64decode(b64)
        with open(sub_path, "wb") as f:
            f.write(data)
        with open(root_path, "wb") as f:
            f.write(data)
        print(f"Captured: {filename} ({width}x{height})")
    return msg_id + 2

def run_inspection():
    ensure_live_server()
    cdp_port = find_free_port()
    user_data_dir = os.path.join(r"C:\Users\tarun\AppData\Local\Temp", f"chrome_cdp_ai_flagship_{cdp_port}")

    cmd = [
        CHROME_BIN,
        f"--remote-debugging-port={cdp_port}",
        f"--user-data-dir={user_data_dir}",
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-background-networking",
        "about:blank"
    ]
    proc = subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.2)

    try:
        targets_raw = urllib.request.urlopen(f"http://127.0.0.1:{cdp_port}/json", timeout=5).read()
        targets = json.loads(targets_raw)
        page_target = next(t for t in targets if t.get("type") == "page")
        ws_url = page_target["webSocketDebuggerUrl"]
        parsed = urllib.parse.urlparse(ws_url)
        ws = SimpleWebSocket(parsed.hostname, parsed.port, parsed.path)

        msg_id = 1
        ws.call("Page.enable", msg_id=msg_id); msg_id += 1
        ws.call("Runtime.enable", msg_id=msg_id); msg_id += 1

        # 1. First scenario: Guest attempts to open AI Assistant (unauthenticated)
        print("\n--- 1. Testing Guest Access (Redirect to login) ---")
        ws.call("Page.navigate", {"url": "http://127.0.0.1:5500/frontend/pages/ai_assistant.html"}, msg_id=msg_id); msg_id += 1
        time.sleep(1.5)
        # Should be redirected to login.html?redirect=ai_assistant.html&notice=ai_auth_required
        msg_id = capture_view(ws, msg_id, "screenshot_ai_assistant_guest_gate.png", 1280, 800)

        # 2. Authenticate student session in browser
        print("\n--- 2. Setting Authenticated Student Session ---")
        ws.call("Runtime.evaluate", {
            "expression": """
            (function() {
                const demoUser = {
                    id: 1,
                    name: 'Alex Mercer',
                    email: 'alex.mercer@codearena.dev',
                    role: 'Student',
                    isLoggedIn: true
                };
                localStorage.setItem('codearena_auth_user', JSON.stringify(demoUser));
                localStorage.setItem('codearena_preview_auth_user', JSON.stringify(demoUser));
            })();
            """
        }, msg_id=msg_id); msg_id += 1
        time.sleep(0.3)

        # 3. Navigate back to AI Assistant as authenticated student
        print("\n--- 3. Navigating as Authenticated Student (Dark Theme) ---")
        ws.call("Page.navigate", {"url": "http://127.0.0.1:5500/frontend/pages/ai_assistant.html"}, msg_id=msg_id); msg_id += 1
        time.sleep(1.5)
        msg_id = capture_view(ws, msg_id, "screenshot_ai_assistant_dark.png", 1280, 800)

        # 4. Light Theme Desktop
        print("\n--- 4. Toggling Light Theme ---")
        ws.call("Runtime.evaluate", {
            "expression": "document.documentElement.setAttribute('data-theme', 'light'); localStorage.setItem('codearena_theme', 'light');"
        }, msg_id=msg_id); msg_id += 1
        time.sleep(0.5)
        msg_id = capture_view(ws, msg_id, "screenshot_ai_assistant_light.png", 1280, 800)

        # Restore Dark Theme
        ws.call("Runtime.evaluate", {
            "expression": "document.documentElement.setAttribute('data-theme', 'dark'); localStorage.setItem('codearena_theme', 'dark');"
        }, msg_id=msg_id); msg_id += 1
        time.sleep(0.3)

        # 5. Natural conversation test: "hi how are you"
        print("\n--- 5. Testing Natural Conversation ('hi how are you') ---")
        ws.call("Runtime.evaluate", {
            "expression": """
            (function() {
                const inp = document.getElementById('aiMessageInput');
                if (inp) {
                    inp.value = 'hi how are you';
                    const form = document.getElementById('aiComposerForm');
                    if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
                }
            })();
            """
        }, msg_id=msg_id); msg_id += 1
        time.sleep(1.2)
        msg_id = capture_view(ws, msg_id, "screenshot_ai_assistant_natural_chat.png", 1280, 800)

        # 6. Multi-turn Java code block (Streams Query)
        print("\n--- 6. Interacting with AI Mentor (Streams Query) ---")
        ws.call("Runtime.evaluate", {
            "expression": """
            (function() {
                const chip = document.querySelector('.prompt-chip-btn');
                if (chip) chip.click();
            })();
            """
        }, msg_id=msg_id); msg_id += 1
        time.sleep(1.2)

        # Scroll so both bubbles and code block are visible
        ws.call("Runtime.evaluate", {
            "expression": "document.getElementById('aiChatMessages').scrollTop = 300;"
        }, msg_id=msg_id); msg_id += 1
        time.sleep(0.3)
        msg_id = capture_view(ws, msg_id, "screenshot_ai_assistant_active_chat.png", 1280, 800)

        # 7. Tablet Viewport (768x1024)
        print("\n--- 7. Tablet Viewport ---")
        msg_id = capture_view(ws, msg_id, "screenshot_ai_assistant_tablet.png", 768, 1024)

        # 8. Mobile Viewport (390x844)
        print("\n--- 8. Mobile Viewport ---")
        msg_id = capture_view(ws, msg_id, "screenshot_ai_assistant_mobile.png", 390, 844)

        # Check horizontal overflow
        eval_res = ws.call("Runtime.evaluate", {
            "expression": """
            (function() {
                var w = window.innerWidth;
                var sw = document.documentElement.scrollWidth;
                var bad = [];
                var all = document.querySelectorAll('*');
                for (var i = 0; i < all.length; i++) {
                    var el = all[i];
                    var r = el.getBoundingClientRect();
                    if (r.right > w + 1 || r.width > w + 1) {
                        bad.push((el.tagName + (el.id ? '#' + el.id : '') + (el.className ? '.' + String(el.className).replace(/\\s+/g, '.') : '')).substring(0, 80) + ' (w=' + Math.round(r.width) + ', r=' + Math.round(r.right) + ')');
                    }
                }
                return JSON.stringify({ ok: sw <= w, sw: sw, w: w, bad: bad.slice(0, 8) });
            })()
            """
        }, msg_id=msg_id); msg_id += 1
        raw_val = eval_res.get("result", {}).get("result", {}).get("value", "{}")
        try:
            res_val = json.loads(raw_val) if isinstance(raw_val, str) else raw_val
        except Exception:
            res_val = {}
        no_overflow = res_val.get("ok", False)
        print(f"Mobile Overflow Audit: {'No horizontal overflow detected [PASS]' if no_overflow else 'Horizontal overflow present [FAIL]'}")
        if not no_overflow:
            print("Overflow debug:", res_val)

        ws.close()
        print("\nAll inspection screenshots captured successfully!")

    finally:
        try:
            proc.terminate()
            proc.wait(timeout=2)
        except Exception:
            pass

if __name__ == "__main__":
    run_inspection()
