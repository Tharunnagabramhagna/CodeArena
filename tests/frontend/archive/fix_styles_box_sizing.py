with open('frontend/css/styles.css', 'r', encoding='utf-8') as f:
    content = f.read()

target = """header,
.site-header,
.landing-header {
  display: flex;"""

replacement = """header,
.site-header,
.landing-header {
  box-sizing: border-box;
  display: flex;"""

assert target in content, "target not found"
content = content.replace(target, replacement, 1)

with open('frontend/css/styles.css', 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)
print("[OK] styles.css box-sizing added to shared header")

