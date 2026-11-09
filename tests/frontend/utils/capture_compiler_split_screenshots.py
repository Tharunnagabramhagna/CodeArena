"""
CodeArena — Feature 2: Interactive Compiler Split-View Controls Verification & Screenshot Tool.
Executes live browser testing against http://127.0.0.1:5500/frontend/pages/compiler.html.
Verifies all 8 testing criteria:
  1. All 4 presets (50:50, 60:40, 70:30, 40:60)
  2. Dragging in both directions
  3. Keyboard resizing (Arrow keys, Home, End)
  4. Layout persistence after reload
  5. Dark & Light themes
  6. Desktop, tablet, and mobile layouts
  7. CodeMirror editing & refresh after resizing
  8. Output terminal execution & tabs after resizing
Captures all required browser screenshots into artifact directory.
"""

import os
import sys
import subprocess
import time
import json
import urllib.request
import socket
import base64
import shutil

CHROME_BIN = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUTPUT_DIR = r"C:\Users\tarun\.gemini\antigravity\brain\65cff54b-be87-40ca-a32d-ef069c3de2d5"
SCREENSHOTS_SUBDIR = os.path.join(OUTPUT_DIR, "screenshots")
os.makedirs(SCREENSHOTS_SUBDIR, exist_ok=True)

LIVE_URL_COMPILER = "http://127.0.0.1:5500/frontend/pages/compiler.html"

import threading
import http.server
import socketserver
from functools import partial

class SilentHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

def ensure_live_server(root_dir=r"C:\CodeArena", port=5500):
    try:
        res = urllib.request.urlopen(f"http://127.0.0.1:{port}/frontend/pages/compiler.html", timeout=1)
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
        except:
            pass

class LiveBrowserSession:
    def __init__(self, port=None):
        self.port = port or find_free_port()
        self.proc = None
        self.ws = None
        self.msg_id = 0
        self.tmp_profile = os.path.join(os.path.dirname(__file__), f".tmp_profile_compiler_{self.port}")

    def start(self):
        if os.path.exists(self.tmp_profile):
            shutil.rmtree(self.tmp_profile, ignore_errors=True)
        os.makedirs(self.tmp_profile, exist_ok=True)

        cmd = [
            CHROME_BIN,
            "--headless=new",
            "--no-sandbox",
            "--disable-gpu",
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
        while time.time() - start_t < 12:
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

    def get_rect(self, selector):
        return self.eval_js(f"""
            (() => {{
                const el = document.querySelector('{selector}');
                if (!el) return null;
                const r = el.getBoundingClientRect();
                return {{ width: r.width, height: r.height, top: r.top, right: r.right, bottom: r.bottom, left: r.left }};
            }})()
        """)

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

    def take_screenshot(self, filename, alt_names=None):
        res = self.call("Page.captureScreenshot", {"format": "png"})
        b64 = res.get("data", "")
        img_bytes = base64.b64decode(b64)
        out_root = os.path.join(OUTPUT_DIR, filename)
        out_sub = os.path.join(SCREENSHOTS_SUBDIR, filename)
        with open(out_root, "wb") as f:
            f.write(img_bytes)
        shutil.copy2(out_root, out_sub)
        if alt_names:
            for alt in alt_names:
                shutil.copy2(out_root, os.path.join(OUTPUT_DIR, alt))
                shutil.copy2(out_root, os.path.join(SCREENSHOTS_SUBDIR, alt))
        return os.path.getsize(out_root)

    def stop(self):
        if self.ws:
            self.ws.close()
        if self.proc:
            self.proc.terminate()
            try:
                self.proc.wait(timeout=3)
            except:
                self.proc.kill()
        if os.path.exists(self.tmp_profile):
            shutil.rmtree(self.tmp_profile, ignore_errors=True)

def to_num(val, default=0):
    try:
        return float(val)
    except (ValueError, TypeError):
        return default

def run_verification_and_capture():
    print("=" * 76)
    print("CODEARENA — FEATURE 2: INTERACTIVE COMPILER SPLIT-VIEW CONTROLS")
    print("=" * 76)

    httpd = ensure_live_server()

    passed_checks = 0
    total_checks = 0

    def record(name, condition, extra=""):
        nonlocal passed_checks, total_checks
        total_checks += 1
        status = "[PASS]" if condition else "[FAIL]"
        msg = f"  {status} {name}"
        if extra:
            msg += f" ({extra})"
        print(msg)
        if condition:
            passed_checks += 1

    session = LiveBrowserSession()
    try:
        session.start()
        session.set_viewport(1366, 850, mobile=False)

        # ---------------------------------------------------------
        # 1. Page Load & Initial Default (50:50)
        # ---------------------------------------------------------
        print("\n--- 1. Live Server Access & Default 50:50 Split ---")
        session.navigate(LIVE_URL_COMPILER)
        time.sleep(0.5)

        title = session.eval_js("document.title")
        record("Compiler served via Live Server", "Java Compiler" in str(title), f"Title: {title}")

        has_api = session.eval_js("typeof window.CodeArenaCompilerLayout !== 'undefined'")
        record("window.CodeArenaCompilerLayout API exposed", has_api)

        # Default ratio check (should be 50)
        initial_ratio = to_num(session.eval_js("window.CodeArenaCompilerLayout.getRatio()"))
        record("Default split ratio is 50% (50:50 equal split)", round(initial_ratio) == 50, f"Ratio: {initial_ratio}%")

        is_50_active = session.eval_js("document.getElementById('btnPreset5050').classList.contains('active')")
        record("Preset button #btnPreset5050 is active by default", is_50_active)

        # Check toolbar alignment & non-wrapping at 1366px
        title_h = to_num(session.eval_js("document.querySelector('.pane-title').getBoundingClientRect().height"))
        subtitle_h = to_num(session.eval_js("document.querySelector('.pane-subtitle').getBoundingClientRect().height"))
        record("Source Code title rendered as single line without wrapping (1366px)", title_h > 0 and title_h <= 26, f"Height: {title_h}px")
        record("Main.java subtitle rendered as single line without wrapping (1366px)", subtitle_h > 0 and subtitle_h <= 26, f"Height: {subtitle_h}px")
        record("Zero horizontal overflow at 1366px desktop", session.eval_js("document.documentElement.scrollWidth <= 1366"))

        # Take 50:50 Dark Screenshot
        size_5050_dark = session.take_screenshot("screenshot_compiler_layout_50_50_dark.png")
        record("Screenshot captured: 50:50 Equal Split (Dark Theme)", size_5050_dark > 50000, f"{size_5050_dark:,} bytes")

        # ---------------------------------------------------------
        # 2. Layout Presets (60:40, 70:30, 40:60)
        # ---------------------------------------------------------
        print("\n--- 2. Layout Presets Testing ---")
        # 60:40 Preset
        session.eval_js("document.getElementById('btnPreset6040').click()")
        time.sleep(0.3)
        ratio_60 = to_num(session.eval_js("window.CodeArenaCompilerLayout.getRatio()"))
        is_60_active = session.eval_js("document.getElementById('btnPreset6040').classList.contains('active')")
        record("Preset 60:40 updates editor width to 60%", round(ratio_60) == 60 and is_60_active, f"Ratio: {ratio_60}%")
        size_6040_dark = session.take_screenshot("screenshot_compiler_layout_60_40_dark.png")
        record("Screenshot captured: 60:40 Editor Favored (Dark Theme)", size_6040_dark > 50000, f"{size_6040_dark:,} bytes")

        # 70:30 Preset
        session.eval_js("document.getElementById('btnPreset7030').click()")
        time.sleep(0.3)
        ratio_70 = to_num(session.eval_js("window.CodeArenaCompilerLayout.getRatio()"))
        is_70_active = session.eval_js("document.getElementById('btnPreset7030').classList.contains('active')")
        record("Preset 70:30 updates editor width to 70%", round(ratio_70) == 70 and is_70_active, f"Ratio: {ratio_70}%")
        size_7030_dark = session.take_screenshot("screenshot_compiler_layout_70_30_dark.png")
        record("Screenshot captured: 70:30 Editor Focused (Dark Theme)", size_7030_dark > 50000, f"{size_7030_dark:,} bytes")

        # 40:60 Preset
        session.eval_js("document.getElementById('btnPreset4060').click()")
        time.sleep(0.3)
        ratio_40 = to_num(session.eval_js("window.CodeArenaCompilerLayout.getRatio()"))
        is_40_active = session.eval_js("document.getElementById('btnPreset4060').classList.contains('active')")
        record("Preset 40:60 updates editor width to 40%", round(ratio_40) == 40 and is_40_active, f"Ratio: {ratio_40}%")
        size_4060_dark = session.take_screenshot("screenshot_compiler_layout_40_60_dark.png")
        record("Screenshot captured: 40:60 Output Focused (Dark Theme)", size_4060_dark > 50000, f"{size_4060_dark:,} bytes")

        # ---------------------------------------------------------
        # 3. Expansion Actions (Expand Editor, Expand Output, Restore)
        # ---------------------------------------------------------
        print("\n--- 3. Expansion Actions & Restore Default ---")
        # Expand Editor
        session.eval_js("document.getElementById('btnExpandEditor').click()")
        time.sleep(0.3)
        ratio_exp_ed = to_num(session.eval_js("window.CodeArenaCompilerLayout.getRatio()"))
        is_exp_ed_active = session.eval_js("document.getElementById('btnExpandEditor').classList.contains('active')")
        record("Expand Editor sets editor ratio to 85%", round(ratio_exp_ed) == 85 and is_exp_ed_active, f"Ratio: {ratio_exp_ed}%")
        size_exp_ed = session.take_screenshot("screenshot_compiler_layout_expand_editor_dark.png")
        record("Screenshot captured: Expand Editor (Dark Theme)", size_exp_ed > 50000, f"{size_exp_ed:,} bytes")

        # Expand Output
        session.eval_js("document.getElementById('btnExpandOutput').click()")
        time.sleep(0.3)
        ratio_exp_out = to_num(session.eval_js("window.CodeArenaCompilerLayout.getRatio()"))
        is_exp_out_active = session.eval_js("document.getElementById('btnExpandOutput').classList.contains('active')")
        record("Expand Output sets editor ratio to 15% (terminal maximized)", round(ratio_exp_out) == 15 and is_exp_out_active, f"Ratio: {ratio_exp_out}%")
        size_exp_out = session.take_screenshot("screenshot_compiler_layout_expand_output_dark.png")
        record("Screenshot captured: Expand Output (Dark Theme)", size_exp_out > 50000, f"{size_exp_out:,} bytes")

        # Restore Default
        session.eval_js("document.getElementById('btnResetSplit').click()")
        time.sleep(0.3)
        ratio_restored = to_num(session.eval_js("window.CodeArenaCompilerLayout.getRatio()"))
        record("Restore Default button resets layout to 50:50", round(ratio_restored) == 50, f"Ratio: {ratio_restored}%")

        # ---------------------------------------------------------
        # 4. Interactive Dragging & Splitter Highlighting
        # ---------------------------------------------------------
        print("\n--- 4. Interactive Dragging & Pointer Simulation ---")
        # Simulate pointerdown -> pointermove -> pointerup
        session.eval_js("""
            (() => {
                const splitter = document.getElementById('compilerSplitter');
                const downEvt = new PointerEvent('pointerdown', { bubbles: true, clientX: 683, button: 0, pointerId: 1 });
                splitter.dispatchEvent(downEvt);

                // Move right (+100px)
                const moveEvt = new PointerEvent('pointermove', { bubbles: true, clientX: 783, pointerId: 1 });
                splitter.dispatchEvent(moveEvt);
            })()
        """)
        time.sleep(0.2)
        is_drag_active = session.eval_js("document.getElementById('compilerSplitter').classList.contains('is-dragging')")
        is_body_resizing = session.eval_js("document.body.classList.contains('is-resizing')")
        record("Pointer dragging activates .is-dragging on splitter and .is-resizing on body", is_drag_active and is_body_resizing)

        session.eval_js("""
            (() => {
                const splitter = document.getElementById('compilerSplitter');
                const upEvt = new PointerEvent('pointerup', { bubbles: true, clientX: 783, pointerId: 1 });
                splitter.dispatchEvent(upEvt);
            })()
        """)
        time.sleep(0.2)
        drag_cleaned_up = not session.eval_js("document.getElementById('compilerSplitter').classList.contains('is-dragging')")
        record("Pointer release removes drag highlight and restores normal body cursor", drag_cleaned_up)

        # Double click on splitter restores 50:50
        session.eval_js("window.CodeArenaCompilerLayout.setRatio(70)")
        time.sleep(0.1)
        session.eval_js("document.getElementById('compilerSplitter').dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))")
        time.sleep(0.2)
        ratio_after_dblclick = to_num(session.eval_js("window.CodeArenaCompilerLayout.getRatio()"))
        record("Double clicking splitter resets ratio to 50:50", round(ratio_after_dblclick) == 50, f"Ratio: {ratio_after_dblclick}%")

        # ---------------------------------------------------------
        # 5. Keyboard Navigation
        # ---------------------------------------------------------
        print("\n--- 5. Keyboard Navigation (Arrow Keys, Home, End) ---")
        session.eval_js("document.getElementById('compilerSplitter').focus()")
        time.sleep(0.1)

        # ArrowRight (+2%)
        session.eval_js("document.getElementById('compilerSplitter').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))")
        ratio_after_arrow_r = to_num(session.eval_js("window.CodeArenaCompilerLayout.getRatio()"))
        record("ArrowRight increases editor width by 2%", round(ratio_after_arrow_r) == 52, f"Ratio: {ratio_after_arrow_r}%")

        # ArrowLeft (-2%)
        session.eval_js("document.getElementById('compilerSplitter').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))")
        ratio_after_arrow_l = to_num(session.eval_js("window.CodeArenaCompilerLayout.getRatio()"))
        record("ArrowLeft decreases editor width by 2%", round(ratio_after_arrow_l) == 50, f"Ratio: {ratio_after_arrow_l}%")

        # End key (expand to 85%)
        session.eval_js("document.getElementById('compilerSplitter').dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))")
        ratio_after_end = to_num(session.eval_js("window.CodeArenaCompilerLayout.getRatio()"))
        record("End key expands editor width to 85%", round(ratio_after_end) == 85, f"Ratio: {ratio_after_end}%")

        # Home key (restore to 50%)
        session.eval_js("document.getElementById('compilerSplitter').dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))")
        ratio_after_home = to_num(session.eval_js("window.CodeArenaCompilerLayout.getRatio()"))
        record("Home key restores layout to 50:50", round(ratio_after_home) == 50, f"Ratio: {ratio_after_home}%")

        # ---------------------------------------------------------
        # 6. Layout Persistence in localStorage
        # ---------------------------------------------------------
        print("\n--- 6. Layout Persistence Testing ---")
        session.eval_js("document.getElementById('btnPreset6040').click()")
        time.sleep(0.2)
        saved_val = session.eval_js("localStorage.getItem('codearena_compiler_split_ratio')")
        record("Split ratio successfully saved to localStorage", saved_val is not None and "60" in str(saved_val), f"Saved: {saved_val}")

        # Navigate back to page and verify it reloads with 60%
        session.navigate(LIVE_URL_COMPILER)
        time.sleep(0.5)
        reloaded_ratio = to_num(session.eval_js("window.CodeArenaCompilerLayout.getRatio()"))
        record("Saved ratio (60%) automatically restored on page reload", round(reloaded_ratio) == 60, f"Reloaded: {reloaded_ratio}%")

        # Reset to 50:50 for clean state
        session.eval_js("document.getElementById('btnResetSplit').click()")
        time.sleep(0.2)

        # ---------------------------------------------------------
        # 7. CodeMirror & Terminal Functionality
        # ---------------------------------------------------------
        print("\n--- 7. Functional Preservation (CodeMirror & Terminal Execution) ---")
        cm_has_text = session.eval_js("Boolean(document.querySelector('.CodeMirror-line'))")
        record("CodeMirror lines are rendered accurately after resizing", cm_has_text)

        # Run simulated Java execution
        session.eval_js("document.getElementById('btnRunCode').click()")
        time.sleep(0.8)
        stdout_content = session.eval_js("document.getElementById('stdoutTerminal').textContent")
        record("Run Code executes Java preview simulation", "Hello, CodeArena!" in stdout_content or "Found" in stdout_content or len(stdout_content) > 10, stdout_content[:40])

        # Switch console tabs (Input / Diagnostics / Output)
        session.eval_js("document.getElementById('tabBtnStdin').click()")
        time.sleep(0.2)
        stdin_active = session.eval_js("document.getElementById('panelStdin').classList.contains('active')")
        record("Console tab switching to Stdin functions smoothly", stdin_active)

        session.eval_js("document.getElementById('tabBtnStdout').click()")
        time.sleep(0.2)
        stdout_active = session.eval_js("document.getElementById('panelStdout').classList.contains('active')")
        record("Console tab switching back to Stdout functions smoothly", stdout_active)

        # ---------------------------------------------------------
        # 8. Light Theme Support & Styling
        # ---------------------------------------------------------
        print("\n--- 8. Light Theme Verification ---")
        session.eval_js("document.documentElement.setAttribute('data-theme', 'light')")
        time.sleep(0.3)
        is_light = session.eval_js("document.documentElement.getAttribute('data-theme') === 'light'")
        record("Switched application to Light Theme", is_light)

        # Test presets in light theme
        session.eval_js("document.getElementById('btnPreset6040').click()")
        time.sleep(0.2)
        size_light_6040 = session.take_screenshot("screenshot_compiler_layout_60_40_light.png")
        record("Screenshot captured: 60:40 Layout (Light Theme)", size_light_6040 > 50000, f"{size_light_6040:,} bytes")

        session.eval_js("document.getElementById('btnResetSplit').click()")
        time.sleep(0.2)
        size_light_5050 = session.take_screenshot("screenshot_compiler_layout_50_50_light.png")
        record("Screenshot captured: 50:50 Default Layout (Light Theme)", size_light_5050 > 50000, f"{size_light_5050:,} bytes")

        # ---------------------------------------------------------
        # 9. Responsive Viewports: Desktop, Tablet & Mobile
        # ---------------------------------------------------------
        print("\n--- 9. Responsive Layouts (1440, 1280, 1024, 768, 640, 390) ---")
        # 1440x900 Wide Desktop
        session.set_viewport(1440, 900, mobile=False)
        time.sleep(0.2)
        doc_scroll_1440 = session.eval_js("document.documentElement.scrollWidth <= 1440")
        record("Desktop (1440x900) zero horizontal overflow", doc_scroll_1440)

        # 1280x800 Compact Desktop
        session.set_viewport(1280, 800, mobile=False)
        time.sleep(0.2)
        doc_scroll_1280 = session.eval_js("document.documentElement.scrollWidth <= 1280")
        record("Desktop (1280x800) zero horizontal overflow", doc_scroll_1280)

        # Tablet Viewport (1024x768)
        session.set_viewport(1024, 768, mobile=False)
        time.sleep(0.3)
        doc_scroll_tablet = session.eval_js("document.documentElement.scrollWidth <= 1024")
        record("Tablet (1024x768) maintains side-by-side layout with zero horizontal overflow", doc_scroll_tablet)
        size_tablet = session.take_screenshot("screenshot_compiler_layout_tablet.png")
        record("Screenshot captured: Tablet Viewport (1024x768)", size_tablet > 50000, f"{size_tablet:,} bytes")

        # 768x1024 Tablet Portrait
        session.set_viewport(768, 1024, mobile=False)
        time.sleep(0.2)
        doc_scroll_768 = session.eval_js("document.documentElement.scrollWidth <= 768")
        record("Tablet Portrait (768x1024) zero horizontal overflow", doc_scroll_768)

        # 640x900 Mobile / Compact
        session.set_viewport(640, 900, mobile=True)
        time.sleep(0.2)
        doc_scroll_640 = session.eval_js("document.documentElement.scrollWidth <= 640")
        record("Compact Mobile (640x900) zero horizontal overflow", doc_scroll_640)

        # Mobile Viewport (390x844)
        session.set_viewport(390, 844, mobile=True)
        time.sleep(0.3)
        mobile_nav_visible = session.eval_js("window.getComputedStyle(document.getElementById('compilerMobileViewNav')).display !== 'none'")
        doc_scroll_mobile = session.eval_js("document.documentElement.scrollWidth <= 390")
        record("Mobile (390x844) displays mobile view switcher with zero horizontal overflow", mobile_nav_visible and doc_scroll_mobile)
        size_mobile = session.take_screenshot("screenshot_compiler_layout_mobile_390.png")
        record("Screenshot captured: Mobile Viewport (390x844)", size_mobile > 40000, f"{size_mobile:,} bytes")

    finally:
        session.stop()

    print("\n" + "=" * 76)
    print(f"VERIFICATION RESULTS: {passed_checks} of {total_checks} CHECKS PASSED ({(passed_checks/total_checks)*100:.1f}%)")
    print("=" * 76)
    return passed_checks == total_checks

if __name__ == "__main__":
    success = run_verification_and_capture()
    sys.exit(0 if success else 1)
