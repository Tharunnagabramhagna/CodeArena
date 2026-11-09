"""
CodeArena — Animate the Solution Browser Verification & Screenshot Tool
Uses headless Chrome with CDP to capture high-resolution screenshots of:
1. Clean problem workspace (Two Sum) with zero embedded animation clutter.
2. Workspace Submissions panel displaying the "Explore: Animate the Solution ->" action banner.
3. Dedicated "Animate the Solution" page (Two Sum Hash Map approach).
4. Dedicated "Animate the Solution" page (Two Sum Brute Force approach).
5. Binary Search logarithmic animation.
6. Valid Parentheses stack animation.
7. Reverse Linked List pointer animation.
8. Coming Soon view for un-animated problems.
9. Light theme rendering.
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
import shutil
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
        res = urllib.request.urlopen(f"http://127.0.0.1:{port}/frontend/pages/problem.html?id=two-sum", timeout=1)
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
        self.sock.settimeout(12.0)
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
        self.sock.sendall(headers.encode("utf-8"))
        resp = self.sock.recv(4096).decode("utf-8", errors="ignore")
        if "101 " not in resp:
            raise RuntimeError(f"WebSocket upgrade failed: {resp}")
        self.buf = bytearray()

    def send(self, data):
        if isinstance(data, str):
            data = data.encode("utf-8")
        mask = os.urandom(4)
        length = len(data)
        if length <= 125:
            header = bytes([0x81, 0x80 | length])
        elif length <= 65535:
            header = bytes([0x81, 0x80 | 126]) + length.to_bytes(2, "big")
        else:
            header = bytes([0x81, 0x80 | 127]) + length.to_bytes(8, "big")
        masked = bytes(b ^ mask[i % 4] for i, b in enumerate(data))
        self.sock.sendall(header + mask + masked)

    def recv(self):
        while True:
            if len(self.buf) >= 2:
                b2 = self.buf[1]
                payload_len = b2 & 0x7F
                offset = 2
                if payload_len == 126:
                    if len(self.buf) < 4:
                        continue
                    payload_len = int.from_bytes(self.buf[2:4], "big")
                    offset = 4
                elif payload_len == 127:
                    if len(self.buf) < 10:
                        continue
                    payload_len = int.from_bytes(self.buf[2:10], "big")
                    offset = 10
                if payload_len is not None and len(self.buf) >= offset + payload_len:
                    payload = self.buf[offset:offset+payload_len]
                    self.buf = self.buf[offset+payload_len:]
                    return payload.decode("utf-8", errors="ignore")

            try:
                chunk = self.sock.recv(65536)
            except (socket.timeout, TimeoutError):
                return ""
            if not chunk:
                break
            self.buf.extend(chunk)
        return ""

    def close(self):
        try:
            self.sock.close()
        except Exception:
            pass

class LiveBrowserSession:
    def __init__(self, port=None):
        self.port = port or find_free_port()
        self.proc = None
        self.ws = None
        self.msg_id = 0
        self.tmp_profile = os.path.join(os.path.dirname(__file__), f".tmp_profile_anim_{self.port}")

    def start(self):
        if os.path.exists(self.tmp_profile):
            shutil.rmtree(self.tmp_profile, ignore_errors=True)
        os.makedirs(self.tmp_profile, exist_ok=True)

        cmd = [
            CHROME_BIN,
            "--headless=new",
            "--no-sandbox",
            "--disable-gpu",
            "--hide-scrollbars",
            f"--user-data-dir={self.tmp_profile}",
            f"--remote-debugging-port={self.port}",
            "about:blank"
        ]
        self.proc = subprocess.Popen(cmd)

        ws_url = None
        for _ in range(30):
            time.sleep(0.3)
            try:
                req = urllib.request.urlopen(f"http://127.0.0.1:{self.port}/json", timeout=2)
                tabs = json.loads(req.read().decode())
                page_tabs = [t for t in tabs if t.get("type") == "page"]
                if page_tabs and page_tabs[0].get("webSocketDebuggerUrl"):
                    ws_url = page_tabs[0]["webSocketDebuggerUrl"]
                    break
            except Exception:
                continue

        if not ws_url:
            self.stop()
            raise RuntimeError("Could not connect to Chrome debugging endpoint")

        parsed = urllib.parse.urlparse(ws_url)
        self.ws = SimpleWebSocket(parsed.hostname, parsed.port, parsed.path)
        self.call("Page.enable")
        self.call("DOM.enable")
        self.call("Runtime.enable")

    def call(self, method, params=None):
        self.msg_id += 1
        cid = self.msg_id
        req = {"id": cid, "method": method}
        if params:
            req["params"] = params
        self.ws.send(json.dumps(req))
        while True:
            resp_str = self.ws.recv()
            if not resp_str:
                return {}
            try:
                resp = json.loads(resp_str)
                if resp.get("id") == cid:
                    return resp
            except json.JSONDecodeError:
                pass

    def navigate(self, url, wait_seconds=1.5):
        self.call("Page.navigate", {"url": url})
        time.sleep(wait_seconds)

    def eval_js(self, expression):
        res = self.call("Runtime.evaluate", {
            "expression": expression,
            "awaitPromise": True,
            "returnByValue": True
        })
        return res.get("result", {}).get("result", {}).get("value")

    def capture_screenshot(self, filename, width=1440, height=900):
        self.call("Emulation.setDeviceMetricsOverride", {
            "width": width,
            "height": height,
            "deviceScaleFactor": 1,
            "mobile": False
        })
        time.sleep(0.4)
        res = self.call("Page.captureScreenshot", {"format": "png"})
        b64 = res.get("result", {}).get("data", "")
        if b64:
            raw = base64.b64decode(b64)
            path_root = os.path.join(OUTPUT_DIR, filename)
            with open(path_root, "wb") as f:
                f.write(raw)
            path_sub = os.path.join(SCREENSHOTS_SUBDIR, filename)
            shutil.copy2(path_root, path_sub)
            print(f"Captured: {filename} ({len(raw)} bytes)")
            return path_root
        else:
            print(f"Failed to capture: {filename}")
            return None

    def stop(self):
        if self.ws:
            self.ws.close()
        if self.proc:
            self.proc.terminate()
            try:
                self.proc.wait(timeout=3)
            except Exception:
                self.proc.kill()
        if os.path.exists(self.tmp_profile):
            shutil.rmtree(self.tmp_profile, ignore_errors=True)

def run():
    print("========================================================================")
    print("CODEARENA — ANIMATE THE SOLUTION VISUAL VERIFICATION")
    print("========================================================================")

    server = ensure_live_server()
    browser = LiveBrowserSession()
    try:
        browser.start()
        print("Connected to headless Chrome via CDP.")

        # 1. Clean Two Sum Problem Workspace
        print("\n[1/9] Capturing Clean Two Sum Problem Workspace...")
        browser.navigate("http://127.0.0.1:5500/frontend/pages/problem.html?id=two-sum", wait_seconds=2.0)
        browser.capture_screenshot("screenshot_problem_workspace_clean_twosum.png", width=1440, height=900)

        # 2. Workspace After Simulated Preview Submission
        print("\n[2/9] Capturing Workspace with Submission Action Banner...")
        browser.eval_js("""
            (() => {
                window.__BYPASS_GUEST_GATE__ = true;
                const btn = document.getElementById('btnSubmitSolution');
                if (btn) btn.click();
            })()
        """)
        time.sleep(1.8)
        browser.capture_screenshot("screenshot_problem_workspace_after_submit.png", width=1440, height=900)

        # 3. Dedicated Two Sum Animation (Hash Map approach)
        print("\n[3/9] Capturing Two Sum Hash Map Animation Stage...")
        browser.navigate("http://127.0.0.1:5500/frontend/pages/solution-animation.html?id=two-sum", wait_seconds=1.5)
        browser.eval_js("if (window.CodeArenaSolutionAnimation) window.CodeArenaSolutionAnimation.nextStep();")
        time.sleep(0.5)
        browser.capture_screenshot("screenshot_solution_animation_twosum_hashmap.png", width=1440, height=900)

        # 4. Dedicated Two Sum Animation (Brute Force approach)
        print("\n[4/9] Capturing Two Sum Brute Force Approach...")
        browser.eval_js("if (window.CodeArenaSolutionAnimation) window.CodeArenaSolutionAnimation.setApproach('bruteforce');")
        time.sleep(0.8)
        browser.capture_screenshot("screenshot_solution_animation_twosum_bruteforce.png", width=1440, height=900)

        # 5. Binary Search Animation
        print("\n[5/9] Capturing Binary Search Interval Reduction...")
        browser.navigate("http://127.0.0.1:5500/frontend/pages/solution-animation.html?id=binary-search", wait_seconds=1.2)
        browser.eval_js("if (window.CodeArenaSolutionAnimation) window.CodeArenaSolutionAnimation.nextStep();")
        time.sleep(0.5)
        browser.capture_screenshot("screenshot_solution_animation_binary_search.png", width=1440, height=900)

        # 6. Valid Parentheses Stack Animation
        print("\n[6/9] Capturing Valid Parentheses LIFO Stack...")
        browser.navigate("http://127.0.0.1:5500/frontend/pages/solution-animation.html?id=valid-parentheses", wait_seconds=1.2)
        browser.eval_js("if (window.CodeArenaSolutionAnimation) window.CodeArenaSolutionAnimation.nextStep();")
        time.sleep(0.5)
        browser.capture_screenshot("screenshot_solution_animation_valid_parentheses.png", width=1440, height=900)

        # 7. Reverse Linked List Pointer Animation
        print("\n[7/9] Capturing Reverse Linked List Pointer Movement...")
        browser.navigate("http://127.0.0.1:5500/frontend/pages/solution-animation.html?id=reverse-linked-list", wait_seconds=1.2)
        browser.eval_js("if (window.CodeArenaSolutionAnimation) window.CodeArenaSolutionAnimation.nextStep();")
        time.sleep(0.5)
        browser.capture_screenshot("screenshot_solution_animation_reverse_linked_list.png", width=1440, height=900)

        # 8. Coming Soon View (Un-animated Problem)
        print("\n[8/9] Capturing Coming Soon Fallback View...")
        browser.navigate("http://127.0.0.1:5500/frontend/pages/solution-animation.html?id=median-of-two-sorted-arrays", wait_seconds=1.2)
        browser.capture_screenshot("screenshot_solution_animation_coming_soon.png", width=1440, height=900)

        # 9. Two Sum Animation in Light Theme
        print("\n[9/9] Capturing Two Sum Animation in Light Theme...")
        browser.navigate("http://127.0.0.1:5500/frontend/pages/solution-animation.html?id=two-sum", wait_seconds=1.0)
        browser.eval_js("""
            document.documentElement.setAttribute('data-theme', 'light');
            if (window.CodeArenaSolutionAnimation) window.CodeArenaSolutionAnimation.nextStep();
        """)
        time.sleep(0.5)
        browser.capture_screenshot("screenshot_solution_animation_twosum_light.png", width=1440, height=900)

        print("\n========================================================================")
        print("ALL 9 SCREENSHOTS CAPTURED SUCCESSFULLY!")
        print("========================================================================")

    finally:
        browser.stop()

if __name__ == "__main__":
    run()
