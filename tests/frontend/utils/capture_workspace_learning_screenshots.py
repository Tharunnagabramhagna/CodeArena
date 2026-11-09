"""
CodeArena — Feature 3: Professional Problem-Solving Workspace & Interactive Java Learning
Browser Verification & Screenshot Tool.
Uses headless Chrome with CDP to capture high-resolution screenshots into the artifact directory.
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

LIVE_URL_PROBLEM = "http://127.0.0.1:5500/frontend/pages/problem.html?id=two-sum"
LIVE_URL_LEARN = "http://127.0.0.1:5500/frontend/pages/learn.html"

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
        self.sock = socket.create_connection((host, port), timeout=15)
        self.buf = bytearray()
        key = base64.b64encode(os.urandom(16)).decode()
        req = (
            f"GET {path} HTTP/1.1\r\n"
            f"Host: {host}:{port}\r\n"
            "Upgrade: websocket\r\n"
            "Connection: Upgrade\r\n"
            f"Sec-WebSocket-Key: {key}\r\n"
            "Sec-WebSocket-Version: 13\r\n\r\n"
        )
        self.sock.sendall(req.encode())
        res = self.sock.recv(4096)
        if b"101 " not in res:
            raise RuntimeError(f"WebSocket upgrade failed: {res[:200]}")
        self.sock.settimeout(2.0)

    def send(self, data_str):
        data = data_str.encode("utf-8")
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
        self.tmp_profile = os.path.join(os.path.dirname(__file__), f".tmp_profile_feat3_{self.port}")

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

        start_t = time.time()
        while time.time() - start_t < 15:
            res_raw = self.ws.recv()
            if not res_raw:
                continue
            try:
                res = json.loads(res_raw)
                if res.get("id") == cid:
                    if "error" in res:
                        raise RuntimeError(f"CDP Error ({method}): {res['error']}")
                    return res.get("result", {})
            except json.JSONDecodeError:
                pass
        raise TimeoutError(f"Timeout waiting for CDP method: {method}")

    def eval_js(self, expression):
        res = self.call("Runtime.evaluate", {
            "expression": expression,
            "returnByValue": True,
            "awaitPromise": True
        })
        val = res.get("result", {})
        if "value" in val:
            return val["value"]
        if val.get("type") == "undefined":
            return None
        return val

    def navigate(self, url, wait_seconds=1.2):
        self.call("Page.navigate", {"url": url})
        time.sleep(wait_seconds)

    def set_viewport(self, width, height, mobile=False):
        self.call("Emulation.setDeviceMetricsOverride", {
            "width": width,
            "height": height,
            "deviceScaleFactor": 1,
            "mobile": mobile
        })
        time.sleep(0.3)

    def take_screenshot(self, filename):
        res = self.call("Page.captureScreenshot", {"format": "png"})
        b64 = res.get("data", "")
        if not b64:
            raise RuntimeError("Page.captureScreenshot returned empty data")
        img_bytes = base64.b64decode(b64)
        out_root = os.path.join(OUTPUT_DIR, filename)
        out_sub = os.path.join(SCREENSHOTS_SUBDIR, filename)
        with open(out_root, "wb") as f:
            f.write(img_bytes)
        shutil.copy2(out_root, out_sub)
        print(f"Captured: {filename} ({len(img_bytes)} bytes)")
        return out_root

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

def main():
    print("=" * 72)
    print("FEATURE 3: WORKSPACE & INTERACTIVE JAVA LEARNING VISUAL CAPTURE")
    print("=" * 72)

    ensure_live_server()
    session = LiveBrowserSession()

    try:
        session.start()
        print("Connected to headless Chrome via CDP session.")

        # -------------------------------------------------------------
        # Part 1: Problem-Solving Workspace Screenshots
        # -------------------------------------------------------------
        print("\n--- Capturing Problem Workspace ---")
        session.set_viewport(1440, 900, mobile=False)
        session.navigate(LIVE_URL_PROBLEM, wait_seconds=1.6)

        # 1. Workspace Desktop 50:50 Dark
        session.eval_js("document.documentElement.setAttribute('data-theme', 'dark');")
        time.sleep(0.4)
        session.take_screenshot("screenshot_problem_workspace_desktop_dark.png")

        # 2. Workspace Custom Input Active
        session.eval_js("window.CodeArenaWorkspace.switchConsoleTab('custom');")
        session.eval_js("document.getElementById('btnLoadSampleInput') && document.getElementById('btnLoadSampleInput').click();")
        time.sleep(0.4)
        session.take_screenshot("screenshot_problem_workspace_custom_input_dark.png")

        # 3. Workspace Collapsed Left Pane (Maximized Editor)
        session.eval_js("document.getElementById('btnToggleCollapseLeft') && document.getElementById('btnToggleCollapseLeft').click();")
        time.sleep(0.4)
        session.take_screenshot("screenshot_problem_workspace_collapsed_pane.png")

        # 4. Workspace Light Theme
        session.eval_js("document.getElementById('btnToggleCollapseLeft') && document.getElementById('btnToggleCollapseLeft').click();")
        session.eval_js("document.documentElement.setAttribute('data-theme', 'light');")
        session.eval_js("window.CodeArenaWorkspace.switchConsoleTab('cases');")
        time.sleep(0.4)
        session.take_screenshot("screenshot_problem_workspace_light.png")

        # -------------------------------------------------------------
        # Part 2: Interactive Java Learning Centre & Animations
        # -------------------------------------------------------------
        print("\n--- Capturing Interactive Java Learning Centre ---")
        session.navigate(LIVE_URL_LEARN, wait_seconds=1.6)

        # 5. Concept Curriculum Dark
        session.eval_js("document.documentElement.setAttribute('data-theme', 'dark');")
        time.sleep(0.4)
        session.take_screenshot("screenshot_learn_curriculum_dark.png")

        # 6. Animation Studio: 1. Java Program Execution Lifecycle
        session.eval_js("window.CodeArenaLearn.switchMode('animations');")
        session.eval_js("window.CodeArenaLearn.loadAnimationById('java-execution');")
        session.eval_js("window.CodeArenaLearn.nextAnimStep(); window.CodeArenaLearn.nextAnimStep();") # Step 3 (Bytecode)
        time.sleep(0.4)
        session.take_screenshot("screenshot_learn_animation_execution.png")

        # 7. Animation Studio: 5. Stack & Heap Memory Architecture
        session.eval_js("window.CodeArenaLearn.loadAnimationById('stack-heap');")
        session.eval_js("window.CodeArenaLearn.nextAnimStep(); window.CodeArenaLearn.nextAnimStep();") # Step 3 (deposit frame)
        time.sleep(0.4)
        session.take_screenshot("screenshot_learn_animation_stack_heap.png")

        # 8. Animation Studio: 8. Recursion Call Stack & Base Case Unwinding
        session.eval_js("window.CodeArenaLearn.loadAnimationById('recursion-stack');")
        session.eval_js("window.CodeArenaLearn.nextAnimStep(); window.CodeArenaLearn.nextAnimStep();") # Step 3 (Base Case reached)
        time.sleep(0.4)
        session.take_screenshot("screenshot_learn_animation_recursion.png")

        # 9. Animation Studio Light Theme
        session.eval_js("document.documentElement.setAttribute('data-theme', 'light');")
        time.sleep(0.4)
        session.take_screenshot("screenshot_learn_animation_studio_light.png")

        print("\nAll 9 verification screenshots captured successfully!")

    finally:
        session.stop()

if __name__ == "__main__":
    main()
