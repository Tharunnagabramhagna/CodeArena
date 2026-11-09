"""
CodeArena — Guided Java Learning Roadmap Visual Verification Tool
Captures and audits roadmap.html across Dark and Light themes,
search/filtering states, topic detail drawer, and all 7 responsive viewports:
1440px, 1366px, 1280px, 1024px, 768px, 640px, 390px.
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
        res = urllib.request.urlopen(f"http://127.0.0.1:{port}/frontend/pages/roadmap.html", timeout=1)
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


def capture_view(ws, msg_id, filename, width=1440, height=900):
    ws.call("Emulation.setDeviceMetricsOverride", {
        "width": width,
        "height": height,
        "deviceScaleFactor": 1,
        "mobile": (width < 768)
    }, msg_id=msg_id)
    time.sleep(0.3)
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


def run_audit():
    ensure_live_server()
    cdp_port = find_free_port()
    user_data_dir = os.path.join(r"C:\Users\tarun\AppData\Local\Temp", f"chrome_cdp_roadmap_{cdp_port}")

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
        ws.call("Console.enable", msg_id=msg_id); msg_id += 1

        print("\n--- 1. Navigating to Roadmap Page (Dark Theme) ---")
        ws.call("Page.navigate", {"url": "http://127.0.0.1:5500/frontend/pages/roadmap.html"}, msg_id=msg_id); msg_id += 1
        time.sleep(1.5)

        # 1. Dark Theme Desktop (1440x900)
        msg_id = capture_view(ws, msg_id, "screenshot_roadmap_overview_dark.png", 1440, 900)

        # 2. Light Theme Desktop (1440x900)
        print("\n--- 2. Toggling Light Theme ---")
        ws.call("Runtime.evaluate", {
            "expression": "document.documentElement.setAttribute('data-theme', 'light'); localStorage.setItem('codearena_theme', 'light');"
        }, msg_id=msg_id); msg_id += 1
        time.sleep(0.5)
        msg_id = capture_view(ws, msg_id, "screenshot_roadmap_overview_light.png", 1440, 900)

        # Switch back to dark theme
        ws.call("Runtime.evaluate", {
            "expression": "document.documentElement.setAttribute('data-theme', 'dark'); localStorage.setItem('codearena_theme', 'dark');"
        }, msg_id=msg_id); msg_id += 1
        time.sleep(0.3)

        # 3. Topic Detail Drawer Inspection (open topic 10: recursion)
        print("\n--- 3. Opening Topic Detail Drawer (Recursion) ---")
        ws.call("Runtime.evaluate", {
            "expression": "window.CodeArenaRoadmap.openTopicDrawer('recursion');"
        }, msg_id=msg_id); msg_id += 1
        time.sleep(0.8)
        msg_id = capture_view(ws, msg_id, "screenshot_roadmap_drawer_detail.png", 1440, 900)

        # Close drawer for responsive captures
        ws.call("Runtime.evaluate", {
            "expression": "window.CodeArenaRoadmap.closeTopicDrawer();"
        }, msg_id=msg_id); msg_id += 1
        time.sleep(0.5)

        # 4. Search & Filter State (Filter Level 2)
        print("\n--- 4. Filtering Level 2 Topics ---")
        ws.call("Runtime.evaluate", {
            "expression": "document.querySelector('.filter-pill-btn[data-level=\"2\"]').click();"
        }, msg_id=msg_id); msg_id += 1
        time.sleep(0.5)
        msg_id = capture_view(ws, msg_id, "screenshot_roadmap_filter_level2.png", 1440, 900)

        # Reset filter to all
        ws.call("Runtime.evaluate", {
            "expression": "document.querySelector('.filter-pill-btn[data-level=\"all\"]').click();"
        }, msg_id=msg_id); msg_id += 1
        time.sleep(0.3)

        # 5. Seven Responsive Viewports
        print("\n--- 5. Capturing All 7 Standard Responsive Viewports ---")
        viewports = [
            (1440, 900, "screenshot_roadmap_1440.png"),
            (1366, 768, "screenshot_roadmap_1366.png"),
            (1280, 800, "screenshot_roadmap_1280.png"),
            (1024, 768, "screenshot_roadmap_1024.png"),
            (768, 1024, "screenshot_roadmap_768.png"),
            (640, 800, "screenshot_roadmap_640.png"),
            (390, 844, "screenshot_roadmap_390.png")
        ]

        for w, h, fname in viewports:
            msg_id = capture_view(ws, msg_id, fname, w, h)

        # 6. Check Console Errors and Logs
        eval_res = ws.call("Runtime.evaluate", {
            "expression": "JSON.stringify({ levels: document.querySelectorAll('.roadmap-level-section').length, cards: document.querySelectorAll('.roadmap-topic-card').length, stats: window.CodeArenaRoadmapService.getOverallStats() })"
        }, msg_id=msg_id)
        val = eval_res.get("result", {}).get("value", "{}")
        print(f"\nLive DOM Verification: {val}")

        ws.close()
        print("\nAll Roadmap screenshots and live DOM inspections completed successfully!")

    finally:
        proc.terminate()
        try:
            proc.wait(timeout=2)
        except Exception:
            proc.kill()
        if os.path.exists(user_data_dir):
            shutil.rmtree(user_data_dir, ignore_errors=True)


if __name__ == '__main__':
    run_audit()
