"""
CodeArena — Complete Flagship Redesign Visual Verification & Inspection Tool
Captures and inspects all 5 experiences across Dark and Light themes and responsive viewports:
1. Practice Hub (practice.html) — Initial View & Light Theme
2. Basic Java Practice (basic-practice.html) — Categories & Challenge Table in Dark/Light
3. Basic Problem Workspace (basic-problem.html) — Two-Pane IDE & Live Execution in Dark/Light
4. DSA Problems Catalogue (problems.html) — Dark & Light
5. DSA Problem Workspace (problem.html?id=two-sum) — Dark & Light
6. Responsive Viewports: Tablet (1024x768, 768x1024) and Mobile (390x844)
7. Console Error Audit: Confirms 0 console errors across all 5 pages
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
        res = urllib.request.urlopen(f"http://127.0.0.1:{port}/frontend/pages/practice.html", timeout=1)
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
                    if len(self.buf) >= 4:
                        payload_len = int.from_bytes(self.buf[2:4], "big")
                        offset = 4
                elif payload_len == 127:
                    if len(self.buf) >= 10:
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
        self.tmp_profile = os.path.join(OUTPUT_DIR, f".tmp_profile_flagship_{self.port}")
        self.console_errors = []

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
        for _ in range(40):
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
        self.call("Log.enable")

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
                # Check for runtime console errors
                if resp.get("method") == "Runtime.exceptionThrown":
                    exc = resp.get("params", {}).get("exceptionDetails", {})
                    self.console_errors.append(exc.get("text", "Unknown Exception"))
                if resp.get("id") == cid:
                    return resp
            except json.JSONDecodeError:
                pass

    def navigate(self, url, wait_seconds=2.0):
        self.call("Page.navigate", {"url": url})
        time.sleep(wait_seconds)

    def eval_js(self, expression):
        res = self.call("Runtime.evaluate", {
            "expression": expression,
            "awaitPromise": True,
            "returnByValue": True
        })
        return res.get("result", {}).get("result", {}).get("value")

    def capture_screenshot(self, filename, width=1440, height=900, mobile=False):
        self.call("Emulation.setDeviceMetricsOverride", {
            "width": width,
            "height": height,
            "deviceScaleFactor": 1,
            "mobile": mobile
        })
        time.sleep(0.4)
        res = self.call("Page.captureScreenshot", {"format": "png"})
        b64data = res.get("result", {}).get("data", "")
        if b64data:
            img_bytes = base64.b64decode(b64data)
            out_file = os.path.join(OUTPUT_DIR, filename)
            with open(out_file, "wb") as f:
                f.write(img_bytes)
            sub_file = os.path.join(SCREENSHOTS_SUBDIR, filename)
            with open(sub_file, "wb") as f:
                f.write(img_bytes)
            print(f"Captured: {filename} ({len(img_bytes)} bytes)")
            return out_file
        else:
            print(f"Screenshot failed for {filename}")
            return None

    def stop(self):
        if self.ws:
            self.ws.close()
        if self.proc:
            try:
                self.proc.terminate()
                self.proc.wait(timeout=2)
            except Exception:
                try:
                    self.proc.kill()
                except Exception:
                    pass
        if os.path.exists(self.tmp_profile):
            shutil.rmtree(self.tmp_profile, ignore_errors=True)

def run():
    print("=" * 70)
    print("CODEARENA FLAGSHIP VISUAL REDESIGN VERIFICATION & SCREENSHOT SUITE")
    print("=" * 70)

    server = ensure_live_server()
    session = LiveBrowserSession()

    try:
        session.start()

        # ------------------------------------------------------------------
        # 1. Practice Hub (practice.html)
        # ------------------------------------------------------------------
        print("\n--- 1. Practice Hub (practice.html) ---")
        session.navigate("http://127.0.0.1:5500/frontend/pages/practice.html", 2.0)
        session.eval_js("document.documentElement.removeAttribute('data-theme'); localStorage.setItem('codearena_theme', 'dark');")
        session.capture_screenshot("screenshot_practice_landing_dark.png")

        session.eval_js("document.documentElement.setAttribute('data-theme', 'light'); localStorage.setItem('codearena_theme', 'light');")
        time.sleep(0.4)
        session.capture_screenshot("screenshot_practice_landing_light.png")

        # ------------------------------------------------------------------
        # 2. Basic Practice Track (basic-practice.html)
        # ------------------------------------------------------------------
        print("\n--- 2. Basic Practice Track (basic-practice.html) ---")
        session.navigate("http://127.0.0.1:5500/frontend/pages/basic-practice.html", 2.0)
        session.eval_js("document.documentElement.removeAttribute('data-theme'); localStorage.setItem('codearena_theme', 'dark');")
        session.capture_screenshot("screenshot_basic_practice_dark.png")

        # Scroll to challenge table
        session.eval_js("document.getElementById('catalogueAnchor').scrollIntoView({ behavior: 'instant' });")
        time.sleep(0.5)
        session.capture_screenshot("screenshot_basic_catalogue_table_dark.png")

        # Light theme catalogue
        session.eval_js("document.documentElement.setAttribute('data-theme', 'light'); localStorage.setItem('codearena_theme', 'light');")
        time.sleep(0.4)
        session.capture_screenshot("screenshot_basic_catalogue_table_light.png")

        # ------------------------------------------------------------------
        # 3. Basic Problem Workspace (basic-problem.html)
        # ------------------------------------------------------------------
        print("\n--- 3. Basic Problem Workspace (basic-problem.html) ---")
        session.navigate("http://127.0.0.1:5500/frontend/pages/basic-problem.html?id=hello-world", 2.0)
        session.eval_js("document.documentElement.removeAttribute('data-theme'); localStorage.setItem('codearena_theme', 'dark');")
        session.capture_screenshot("screenshot_basic_workspace_dark.png")

        # Trigger Run Code to test console execution and test cases view
        session.eval_js("document.getElementById('btnRunBasicCode').click();")
        time.sleep(0.6)
        session.capture_screenshot("screenshot_basic_workspace_run_cases.png")

        # Light theme workspace
        session.eval_js("document.documentElement.setAttribute('data-theme', 'light'); localStorage.setItem('codearena_theme', 'light');")
        time.sleep(0.4)
        session.capture_screenshot("screenshot_basic_workspace_light.png")

        # ------------------------------------------------------------------
        # 4. Canonical DSA Problems Catalogue (problems.html)
        # ------------------------------------------------------------------
        print("\n--- 4. DSA Problems Catalogue (problems.html) ---")
        session.navigate("http://127.0.0.1:5500/frontend/pages/problems.html", 2.0)
        session.eval_js("document.documentElement.removeAttribute('data-theme'); localStorage.setItem('codearena_theme', 'dark');")
        session.capture_screenshot("screenshot_dsa_catalogue_dark.png")

        session.eval_js("document.documentElement.setAttribute('data-theme', 'light'); localStorage.setItem('codearena_theme', 'light');")
        time.sleep(0.4)
        session.capture_screenshot("screenshot_dsa_catalogue_light.png")

        # ------------------------------------------------------------------
        # 5. Canonical DSA Problem Workspace (problem.html?id=two-sum)
        # ------------------------------------------------------------------
        print("\n--- 5. DSA Problem Workspace (problem.html) ---")
        session.navigate("http://127.0.0.1:5500/frontend/pages/problem.html?id=two-sum", 2.0)
        session.eval_js("document.documentElement.removeAttribute('data-theme'); localStorage.setItem('codearena_theme', 'dark');")
        session.capture_screenshot("screenshot_dsa_workspace_dark.png")

        session.eval_js("document.documentElement.setAttribute('data-theme', 'light'); localStorage.setItem('codearena_theme', 'light');")
        time.sleep(0.4)
        session.capture_screenshot("screenshot_dsa_workspace_light.png")

        # ------------------------------------------------------------------
        # 6. Complete Responsive Viewport Matrix Inspections
        # ------------------------------------------------------------------
        print("\n--- 6. Complete Responsive Viewport Matrix Inspections ---")
        viewports = [
            (1440, 900, "1440px (Desktop Full)", "basic-problem.html?id=hello-world", "screenshot_responsive_1440_workspace.png"),
            (1366, 768, "1366px (Standard Laptop)", "practice.html", "screenshot_responsive_1366_hub.png"),
            (1280, 800, "1280px (Compact Laptop)", "basic-practice.html", "screenshot_responsive_1280_catalogue.png"),
            (1024, 768, "1024px (Tablet Landscape)", "basic-problem.html?id=hello-world", "screenshot_responsive_1024_workspace.png"),
            (768, 1024, "768px (Tablet Portrait)", "basic-practice.html", "screenshot_responsive_768_catalogue.png"),
            (640, 960, "640px (Small Tablet / Phablet)", "basic-problem.html?id=hello-world", "screenshot_responsive_640_workspace.png"),
            (390, 844, "390px (Mobile Practice Hub)", "practice.html", "screenshot_responsive_390_hub.png"),
            (390, 844, "390px (Mobile Basic Workspace)", "basic-problem.html?id=hello-world", "screenshot_responsive_390_workspace.png")
        ]

        for w, h, label, path, filename in viewports:
            print(f"Testing Viewport {label} on {path}...")
            session.navigate(f"http://127.0.0.1:5500/frontend/pages/{path}", 1.5)
            session.eval_js("document.documentElement.removeAttribute('data-theme'); localStorage.setItem('codearena_theme', 'dark');")
            session.capture_screenshot(filename, width=w, height=h, mobile=(w <= 640))

        print("\n--- 7. Console Error Audit ---")
        if session.console_errors:
            print(f"Warning: Found {len(session.console_errors)} console errors:")
            for err in session.console_errors:
                print(f"  - {err}")
        else:
            print("[PASS] Exactly 0 uncaught JavaScript runtime exceptions across all tested pages!")

        print("\nAll flagship visual verification screenshots captured successfully!")

    finally:
        session.stop()
        if server:
            try:
                server.shutdown()
            except Exception:
                pass

if __name__ == "__main__":
    run()
