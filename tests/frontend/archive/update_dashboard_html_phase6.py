# update_dashboard_html_phase6.py

with open('frontend/pages/dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update search suggestions container
target_search = '<input type="search" class="dash-search-input" id="dashSearchInput" placeholder="Search problems, topics, or anything..." aria-label="Search problems, topics, or anything">'
replacement_search = """<input type="search" class="dash-search-input" id="dashSearchInput" placeholder="Search problems, topics, or anything..." aria-label="Search problems, topics, or anything" autocomplete="off">
                        <div class="dash-search-suggestions" id="dashSearchSuggestions" role="listbox" aria-label="Search suggestions" style="display: none;"></div>"""

if target_search in content:
    content = content.replace(target_search, replacement_search, 1)
    print("Replaced target_search")
else:
    print("Warning: target_search not found")

# 2. Add notif badge
target_notif_btn = """                        <button class="notification-btn" id="notificationBtn" type="button" aria-expanded="false" aria-haspopup="true" aria-label="Notifications" title="Notifications">
                            <span class="notif-icon" aria-hidden="true">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                                </svg>
                            </span>
                        </button>"""

replacement_notif_btn = """                        <button class="notification-btn" id="notificationBtn" type="button" aria-expanded="false" aria-haspopup="true" aria-label="Notifications" title="Notifications" style="position: relative;">
                            <span class="notif-icon" aria-hidden="true">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                                </svg>
                            </span>
                            <span class="notif-badge" id="notifBadge">2</span>
                        </button>"""

if target_notif_btn in content:
    content = content.replace(target_notif_btn, replacement_notif_btn, 1)
    print("Replaced target_notif_btn")
else:
    print("Warning: target_notif_btn not found")

# 3. Update notification popover content
target_popover = """                        <div class="notification-popover" id="notificationPopover" role="dialog" aria-label="Notifications" style="display: none;">
                            <div class="notif-popover-header">
                                <h4 class="notif-popover-title">Notifications</h4>
                                <span class="notif-popover-tag">0 new</span>
                            </div>
                            <div class="notif-popover-body">
                                <div class="notif-empty-icon" aria-hidden="true">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                                        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                                    </svg>
                                </div>
                                <p class="notif-empty-title">No notifications yet</p>
                                <p class="notif-empty-desc">System announcements, contest alerts, and problem review updates will appear here once connected.</p>
                            </div>
                        </div>"""

replacement_popover = """                        <div class="notification-popover" id="notificationPopover" role="dialog" aria-label="Notifications" style="display: none;">
                            <div class="notif-popover-header">
                                <h4 class="notif-popover-title">Notifications</h4>
                                <span class="notif-popover-tag" id="notifHeaderTag">2 new</span>
                            </div>
                            <div class="notif-tabs" role="tablist">
                                <button type="button" class="notif-tab-btn active" data-tab="all" role="tab">All</button>
                                <button type="button" class="notif-tab-btn" data-tab="system" role="tab">System</button>
                                <button type="button" class="notif-tab-btn" data-tab="contests" role="tab">Contests</button>
                            </div>
                            <div class="notif-popover-body" id="notifListContainer">
                                <div class="notif-item unread" data-category="system">
                                    <div class="notif-item-title">Platform Update: Phase 6 Refinements Active</div>
                                    <div class="notif-item-desc">Advanced search suggestions, CodeMirror live preferences, and recently viewed problems are now live.</div>
                                    <div class="notif-item-time">Today, 10:45 AM</div>
                                </div>
                                <div class="notif-item unread" data-category="contests">
                                    <div class="notif-item-title">Weekly Java Contest #42 Open</div>
                                    <div class="notif-item-desc">Registration preview is open for the upcoming weekend tournament. Test your algorithmic speed!</div>
                                    <div class="notif-item-time">Yesterday, 4:20 PM</div>
                                </div>
                                <div class="notif-item" data-category="system">
                                    <div class="notif-item-title">Java 17 Curriculum Update</div>
                                    <div class="notif-item-desc">New interactive lessons on Java Lambdas and Streams are ready in the Learning Centre.</div>
                                    <div class="notif-item-time">2 days ago</div>
                                </div>
                            </div>
                            <div class="notif-footer-actions">
                                <button type="button" class="notif-action-link" id="btnMarkNotifsRead">Mark all as read</button>
                                <a href="contests.html" class="notif-action-link">View Contests &rarr;</a>
                            </div>
                        </div>"""

if target_popover in content:
    content = content.replace(target_popover, replacement_popover, 1)
    print("Replaced target_popover")
else:
    print("Warning: target_popover not found")

# 4. Add api.js and toast.js scripts
target_scripts = '<script src="../js/dashboard.js" defer></script>'
replacement_scripts = """<script src="../js/api.js"></script>
    <script src="../js/toast.js"></script>
    <script src="../js/dashboard.js" defer></script>"""

if target_scripts in content:
    content = content.replace(target_scripts, replacement_scripts, 1)
    print("Replaced target_scripts")
else:
    print("Warning: target_scripts not found")

with open('frontend/pages/dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("dashboard.html updated successfully")

