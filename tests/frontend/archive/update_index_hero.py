# update_index_hero.py
with open('frontend/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_hero = """                <div class="hero-actions">
                    <a href="pages/dashboard.html" class="btn btn-primary btn-lg">
                        Start Coding <span aria-hidden="true">→</span>
                    </a>
                    <a href="pages/dashboard.html" class="btn btn-secondary btn-lg">
                        Explore Problems
                    </a>
                </div>
                <div class="hero-stats">
                    <div class="hero-stat">
                        <span class="hero-stat-number">150+</span>
                        <span class="hero-stat-label">Problems</span>
                    </div>
                    <div class="hero-stat">
                        <span class="hero-stat-number">12</span>
                        <span class="hero-stat-label">Topics</span>
                    </div>
                    <div class="hero-stat">
                        <span class="hero-stat-number">Free</span>
                        <span class="hero-stat-label">Forever</span>
                    </div>
                </div>"""

new_hero = """                <div class="hero-actions">
                    <a href="pages/dashboard.html" class="btn btn-primary btn-lg">
                        Start Coding <span aria-hidden="true">→</span>
                    </a>
                    <a href="pages/problems.html" class="btn btn-secondary btn-lg">
                        Explore Problems
                    </a>
                </div>
                <div class="hero-stats">
                    <div class="hero-stat">
                        <span class="hero-stat-number">12</span>
                        <span class="hero-stat-label">Problems</span>
                    </div>
                    <div class="hero-stat">
                        <span class="hero-stat-number">10</span>
                        <span class="hero-stat-label">Topics</span>
                    </div>
                    <div class="hero-stat">
                        <span class="hero-stat-number">Free</span>
                        <span class="hero-stat-label">Forever</span>
                    </div>
                </div>"""

assert old_hero in content, "old_hero not found in index.html"
content = content.replace(old_hero, new_hero)

with open('frontend/index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("index.html hero stats and Explore Problems link updated successfully")
