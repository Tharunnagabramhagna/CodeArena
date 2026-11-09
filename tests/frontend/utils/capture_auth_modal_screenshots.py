"""
Captures real browser screenshots for Glassmorphism Auth Modal in dark/light themes and mobile.
Uses DevTools Protocol (CDP) for mobile emulation to guarantee true 390x844 viewport rendering.
"""

import os
import sys
import subprocess
import time
import json
import urllib.request
from urllib.parse import urlparse
import socket
import base64
import shutil

CHROME_BIN = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUTPUT_DIR = r"C:\Users\tarun\.gemini\antigravity\brain\65cff54b-be87-40ca-a32d-ef069c3de2d5"
SCREENSHOTS_SUBDIR = os.path.join(OUTPUT_DIR, "screenshots")
os.makedirs(SCREENSHOTS_SUBDIR, exist_ok=True)

TARGETS = [
    {
        "name": "screenshot_auth_modal_login_desktop_dark.png",
        "alt_names": ["screenshot_auth_modal_login_dark.png"],
        "url": "file:///C:/CodeArena/frontend/index.html?auth=login",
        "size": (1366, 850),
        "mobile": False,
        "desc": "Desktop Landing Page with Split-Panel Glassmorphism Login Modal (Dark Theme)"
    },
    {
        "name": "screenshot_auth_modal_signup_desktop_dark.png",
        "alt_names": ["screenshot_auth_modal_signup_dark.png"],
        "url": "file:///C:/CodeArena/frontend/index.html?auth=signup&sample=true",
        "size": (1366, 850),
        "mobile": False,
        "desc": "Desktop Landing Page with Split-Panel Glassmorphism Sign Up Modal & Live Strength Meter (Dark Theme)"
    },
    {
        "name": "screenshot_auth_modal_login_desktop_light.png",
        "alt_names": ["screenshot_auth_modal_login_light.png"],
        "url": "file:///C:/CodeArena/frontend/pages/dashboard.html?auth=login&theme=light",
        "size": (1366, 850),
        "mobile": False,
        "desc": "Desktop Dashboard with Split-Panel Glassmorphism Login Modal (Light Theme)"
    },
    {
        "name": "screenshot_auth_modal_signup_desktop_light.png",
        "alt_names": ["screenshot_auth_modal_signup_light.png"],
        "url": "file:///C:/CodeArena/frontend/pages/dashboard.html?auth=signup&theme=light&sample=true",
        "size": (1366, 850),
        "mobile": False,
        "desc": "Desktop Dashboard with Split-Panel Glassmorphism Sign Up Modal & Live Strength Meter (Light Theme)"
    },
    {
        "name": "screenshot_auth_modal_login_mobile_390.png",
        "alt_names": ["screenshot_auth_modal_mobile_390.png"],
        "url": "file:///C:/CodeArena/frontend/index.html?auth=login",
        "size": (390, 844),
        "mobile": True,
        "desc": "Mobile Viewport (390x844) responsive single-column Login Modal"
    },
    {
        "name": "screenshot_auth_modal_signup_mobile_390.png",
        "alt_names": [],
        "url": "file:///C:/CodeArena/frontend/index.html?auth=signup&sample=true",
        "size": (390, 844),
        "mobile": True,
        "desc": "Mobile Viewport (390x844) responsive single-column Sign Up Modal"
    },
    {
        "name": "screenshot_auth_modal_social_feedback.png",
        "alt_names": [],
        "url": "file:///C:/CodeArena/frontend/pages/dashboard.html?auth=login&theme=light&social=google",
        "size": (1366, 850),
        "mobile": False,
        "desc": "Desktop Dashboard in Light Theme displaying Google Sign-In Informational Feedback Alert"
    }
]

class SimpleWebSocket:
    def __init__(self, host, port, path):
        self.sock = socket.create_connection((host, port), timeout=15)
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
        buf = bytearray()
        while True:
            chunk = self.sock.recv(65536)
            if not chunk:
                break
            buf.extend(chunk)
            if len(buf) >= 2:
                b2 = buf[1]
                payload_len = b2 & 0x7F
                offset = 2
                if payload_len == 126:
                    if len(buf) < 4:
                        continue
                    payload_len = int.from_bytes(buf[2:4], "big")
                    offset = 4
                elif payload_len == 127:
                    if len(buf) < 10:
                        continue
                    payload_len = int.from_bytes(buf[2:10], "big")
                    offset = 10
                if len(buf) >= offset + payload_len:
                    payload = buf[offset:offset+payload_len]
                    return payload.decode("utf-8", errors="ignore")
        return ""

    def close(self):
        try:
            self.sock.close()
        except:
            pass

def capture_with_cdp(target, port=9224):
    out_root = os.path.join(OUTPUT_DIR, target["name"])
    w, h = target["size"]
    tmp_profile = os.path.join(os.path.dirname(__file__), f".tmp_profile_{target['name'].replace('.', '_')}")
    if os.path.exists(tmp_profile):
        shutil.rmtree(tmp_profile, ignore_errors=True)
    os.makedirs(tmp_profile, exist_ok=True)

    cmd = [
        CHROME_BIN,
        "--headless=new",
        "--no-sandbox",
        "--disable-gpu",
        f"--user-data-dir={tmp_profile}",
        f"--remote-debugging-port={port}",
        "about:blank"
    ]
    proc = subprocess.Popen(cmd)
    try:
        time.sleep(1.0)
        with urllib.request.urlopen(f"http://127.0.0.1:{port}/json") as resp:
            targets = json.loads(resp.read().decode())
        page_target = next(t for t in targets if t.get("type") == "page")
        ws_url = page_target["webSocketDebuggerUrl"]
        u = urlparse(ws_url)
        ws = SimpleWebSocket(u.hostname, u.port, u.path)

        def call(method, params=None):
            msg_id = int(time.time() * 1000) % 1000000
            payload = json.dumps({"id": msg_id, "method": method, "params": params or {}})
            ws.send(payload)
            while True:
                resp_text = ws.recv()
                if resp_text:
                    resp_json = json.loads(resp_text)
                    if resp_json.get("id") == msg_id:
                        return resp_json.get("result", {})

        if target.get("mobile"):
            call("Emulation.setDeviceMetricsOverride", {
                "width": w,
                "height": h,
                "deviceScaleFactor": 1,
                "mobile": True
            })

        call("Page.navigate", {"url": target["url"]})
        time.sleep(1.2)

        res = call("Page.captureScreenshot", {"format": "png"})
        img_b64 = res.get("data", "")
        with open(out_root, "wb") as f:
            f.write(base64.b64decode(img_b64))

        ws.close()
        return True
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=3)
        except:
            proc.kill()
        shutil.rmtree(tmp_profile, ignore_errors=True)

def capture_all():
    print(f"Starting Chrome browser capture into {OUTPUT_DIR}")
    results = []

    for idx, target in enumerate(TARGETS, start=1):
        out_root = os.path.join(OUTPUT_DIR, target["name"])
        out_sub = os.path.join(SCREENSHOTS_SUBDIR, target["name"])
        w, h = target["size"]
        url = target["url"]
        desc = target["desc"]

        try:
            start_t = time.time()
            if target.get("mobile"):
                success = capture_with_cdp(target, port=9225 + idx)
            else:
                cmd = [
                    CHROME_BIN,
                    "--headless=new",
                    "--no-sandbox",
                    "--disable-gpu",
                    "--disable-software-rasterizer",
                    "--run-all-compositor-stages-before-draw",
                    f"--window-size={w},{h}",
                    f"--screenshot={out_root}",
                    "--virtual-time-budget=3000",
                    url
                ]
                res = subprocess.run(cmd, capture_output=True, text=True, timeout=20)
                success = (res.returncode == 0 and os.path.exists(out_root))

            elapsed = time.time() - start_t
            if success and os.path.exists(out_root):
                shutil.copy2(out_root, out_sub)
                for alt in target.get("alt_names", []):
                    shutil.copy2(out_root, os.path.join(OUTPUT_DIR, alt))
                    shutil.copy2(out_root, os.path.join(SCREENSHOTS_SUBDIR, alt))
                size = os.path.getsize(out_root)
                print(f"[{idx}/{len(TARGETS)}] [OK] {target['name']} ({size:,} bytes, {elapsed:.2f}s) - {desc}")
                results.append((target["name"], True, size))
            else:
                print(f"[{idx}/{len(TARGETS)}] [FAIL] {target['name']}")
                results.append((target["name"], False, 0))
        except Exception as e:
            print(f"[{idx}/{len(TARGETS)}] [ERROR] {target['name']}: {e}")
            results.append((target["name"], False, 0))

    successful = [r for r in results if r[1]]
    print(f"\nCapture summary: {len(successful)} of {len(TARGETS)} screenshots successfully captured.")
    return len(successful) == len(TARGETS)

if __name__ == "__main__":
    success = capture_all()
    sys.exit(0 if success else 1)
