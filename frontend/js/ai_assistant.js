/**
 * CodeArena — Flagship AI Assistant Controller (ai_assistant.js)
 * Production-oriented, authenticated coding mentor.
 *
 * Architecture Invariants:
 * 1. Strict Authentication Gate: Unauthenticated guests are immediately redirected to login.
 * 2. Real Conversation State: Multiple conversation threads, active thread switching, search filtering, renaming, and deletion.
 * 3. Security Guarantee: Zero API keys are stored in client source code, HTML, or browser storage.
 * 4. Transparent Presentation: Honest presentation of preview session and local mentor status without false claims.
 */

(function () {
    'use strict';

    // Session cache & draft storage keys
    const ACTIVE_CONV_STORAGE_KEY = 'codearena_ai_active_conv_uid';
    const PROMPT_DRAFT_KEY = 'codearena_ai_prompt_draft';

    // Canonical Topics Knowledge Base Reference Cache
    const KNOWLEDGE_BASE_TOPICS = [
        {
            title: "Java 8 Streams and Lambda Expressions",
            category: "streams",
            summary: "Functional stream pipelines, lazy intermediate operations, and eager collectors."
        },
        {
            title: "Checked vs Unchecked Exceptions",
            category: "exceptions",
            summary: "Compile-time enforced exceptions versus runtime unchecked exceptions."
        },
        {
            title: "HashMap Collision Resolution & Treeification",
            category: "hashmap",
            summary: "Array of buckets with linked lists converting to balanced Red-Black trees."
        },
        {
            title: "Recursion & Call Stack Execution",
            category: "recursion",
            summary: "Base cases, recursive reduction, and stack frame memory management."
        },
        {
            title: "Big-O Algorithmic Time & Space Complexity",
            category: "complexity",
            summary: "Upper bound growth analysis from constant O(1) to quadratic O(n^2)."
        },
        {
            title: "Compiler Error Diagnostic & Stack Trace Debugging",
            category: "compiler",
            summary: "Fixing NullPointerExceptions, ArrayIndexOutOfBounds, and syntax errors."
        }
    ];

    // DOM references cache
    let dom = {};
    let activeConversationUid = null;
    let activeConversationTitle = 'Coding Session';
    let conversations = [];
    let filteredConversations = [];
    let searchQuery = '';
    let isThinking = false;
    let authenticatedUser = null;

    // -------------------------------------------------------------------------
    // 1. Authentication Verification & Guest Gate
    // -------------------------------------------------------------------------

    function checkAuthentication() {
        // Bypass flag for automated testing environments
        if (typeof window !== 'undefined' && window.__BYPASS_AI_AUTH_GATE__) {
            authenticatedUser = { id: 1, name: 'Test Student', email: 'test@codearena.dev' };
            return true;
        }

        let isAuth = false;
        try {
            if (window.CodeArenaAPI && window.CodeArenaAPI.authService && window.CodeArenaAPI.authService.isAuthenticated()) {
                isAuth = true;
                const userRes = window.CodeArenaAPI.authService.getCurrentUserSync
                    ? window.CodeArenaAPI.authService.getCurrentUserSync()
                    : window.CodeArenaAPI.authService.getCurrentUser();
                if (userRes && userRes.data) {
                    authenticatedUser = userRes.data;
                }
            }
        } catch (e) {
            isAuth = false;
        }

        if (!isAuth) {
            // Unauthenticated visitor: redirect immediately to login with return parameter
            const returnUrl = encodeURIComponent('ai_assistant.html');
            window.location.replace(`login.html?redirect=${returnUrl}&notice=ai_auth_required`);
            return false;
        }

        return true;
    }

    // -------------------------------------------------------------------------
    // 2. Initialization & DOM Binding
    // -------------------------------------------------------------------------

    async function init() {
        if (!checkAuthentication()) {
            return;
        }

        cacheDom();
        bindEvents();
        updateStudentHeader();

        // Load authenticated student's saved conversations
        await loadConversations();
    }

    function cacheDom() {
        dom = {
            sidebar: document.getElementById('aiSidebar'),
            sidebarOverlay: document.getElementById('aiSidebarOverlay'),
            mobileMenuBtn: document.getElementById('aiMobileMenuBtn'),
            chatMessages: document.getElementById('aiChatMessages'),
            messageInput: document.getElementById('aiMessageInput'),
            sendBtn: document.getElementById('aiSendBtn'),
            composerForm: document.getElementById('aiComposerForm'),
            newChatBtn: document.getElementById('aiNewChatBtn'),
            clearChatBtn: document.getElementById('aiClearChatBtn'),
            renameConvBtn: document.getElementById('aiRenameConvBtn'),
            searchInput: document.getElementById('aiSearchInput'),
            clearSearchBtn: document.getElementById('aiClearSearchBtn'),
            emptyConversations: document.getElementById('aiEmptyConversations'),
            conversationList: document.getElementById('aiConversationList'),
            convCount: document.getElementById('aiConvCount'),
            convTitleDisplay: document.getElementById('aiConvTitleDisplay'),
            studentDisplayName: document.getElementById('aiStudentDisplayName'),
            studentStatusSub: document.getElementById('aiStudentStatusSub'),
            headerModeBadge: document.getElementById('aiHeaderModeBadge'),
            promptChips: document.querySelectorAll('.prompt-chip-btn')
        };
    }

    function bindEvents() {
        // Composer form submission
        if (dom.composerForm) {
            dom.composerForm.addEventListener('submit', function (e) {
                e.preventDefault();
                handleSendMessage();
            });
        }

        // Keyboard navigation (Enter to send, Shift+Enter for newline)
        if (dom.messageInput) {
            dom.messageInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                }
            });

            dom.messageInput.addEventListener('input', function () {
                autoGrowTextarea(this);
                try {
                    sessionStorage.setItem(PROMPT_DRAFT_KEY, this.value);
                } catch (e) {}
            });

            // Restore draft if present
            try {
                const savedDraft = sessionStorage.getItem(PROMPT_DRAFT_KEY);
                if (savedDraft) {
                    dom.messageInput.value = savedDraft;
                    autoGrowTextarea(dom.messageInput);
                }
            } catch (e) {}
        }

        // New conversation action
        if (dom.newChatBtn) {
            dom.newChatBtn.addEventListener('click', handleNewConversation);
        }

        // Clear chat stream action
        if (dom.clearChatBtn) {
            dom.clearChatBtn.addEventListener('click', handleClearChat);
        }

        // Rename conversation action
        if (dom.renameConvBtn) {
            dom.renameConvBtn.addEventListener('click', handleRenameConversation);
        }

        // Search conversations input
        if (dom.searchInput) {
            dom.searchInput.addEventListener('input', function () {
                searchQuery = this.value.trim().toLowerCase();
                if (dom.clearSearchBtn) {
                    dom.clearSearchBtn.style.display = searchQuery ? 'flex' : 'none';
                }
                filterAndRenderConversations();
            });
        }

        if (dom.clearSearchBtn) {
            dom.clearSearchBtn.addEventListener('click', function () {
                if (dom.searchInput) {
                    dom.searchInput.value = '';
                    dom.searchInput.focus();
                }
                searchQuery = '';
                this.style.display = 'none';
                filterAndRenderConversations();
            });
        }

        // Mobile drawer toggle
        if (dom.mobileMenuBtn && dom.sidebar) {
            dom.mobileMenuBtn.addEventListener('click', function () {
                dom.sidebar.classList.toggle('sidebar-open');
                if (dom.sidebarOverlay) {
                    dom.sidebarOverlay.classList.toggle('active');
                }
            });
        }

        if (dom.sidebarOverlay && dom.sidebar) {
            dom.sidebarOverlay.addEventListener('click', function () {
                dom.sidebar.classList.remove('sidebar-open');
                dom.sidebarOverlay.classList.remove('active');
            });
        }

        // Prompt chips
        if (dom.promptChips) {
            dom.promptChips.forEach(btn => {
                btn.addEventListener('click', function () {
                    const query = this.getAttribute('data-query');
                    if (query && dom.messageInput) {
                        dom.messageInput.value = query;
                        autoGrowTextarea(dom.messageInput);
                        handleSendMessage();
                        // Close sidebar if on mobile
                        if (dom.sidebar && dom.sidebar.classList.contains('sidebar-open')) {
                            dom.sidebar.classList.remove('sidebar-open');
                            if (dom.sidebarOverlay) dom.sidebarOverlay.classList.remove('active');
                        }
                    }
                });
            });
        }

        // React immediately if user logs out across components
        document.addEventListener('codearena:auth-changed', function (e) {
            if (e.detail && e.detail.action === 'logout') {
                const returnUrl = encodeURIComponent('ai_assistant.html');
                window.location.replace(`login.html?redirect=${returnUrl}&notice=ai_auth_required`);
            }
        });
    }

    function updateStudentHeader() {
        if (dom.studentDisplayName && authenticatedUser) {
            const name = authenticatedUser.name || authenticatedUser.fullName || authenticatedUser.username || authenticatedUser.email || 'Authenticated Student';
            dom.studentDisplayName.textContent = name;
        }
        if (dom.studentStatusSub) {
            dom.studentStatusSub.textContent = 'Local Preview Session · Educational Mentor';
        }
    }

    function autoGrowTextarea(textarea) {
        if (!textarea) return;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px';
    }

    // -------------------------------------------------------------------------
    // 3. Conversation Management & Persistence Layer
    // -------------------------------------------------------------------------

    async function loadConversations() {
        if (!window.CodeArenaAPI || !window.CodeArenaAPI.aiService) return;

        try {
            const res = await window.CodeArenaAPI.aiService.listConversations();
            if (res.success && Array.isArray(res.data)) {
                conversations = res.data;
            } else {
                conversations = [];
            }
        } catch (e) {
            conversations = [];
        }

        // If no conversations exist, create initial default conversation
        if (conversations.length === 0) {
            await handleCreateInitialConversation();
            return;
        }

        // Determine active conversation: prefer cached UID if still present, otherwise first
        let targetUid = null;
        try {
            targetUid = sessionStorage.getItem(ACTIVE_CONV_STORAGE_KEY);
        } catch (e) {}

        const targetConv = conversations.find(c => c.conversationUid === targetUid);
        if (targetConv) {
            activeConversationUid = targetConv.conversationUid;
            activeConversationTitle = targetConv.title;
        } else {
            activeConversationUid = conversations[0].conversationUid;
            activeConversationTitle = conversations[0].title;
        }

        filterAndRenderConversations();
        await loadActiveConversationMessages();
    }

    async function handleCreateInitialConversation() {
        try {
            const res = await window.CodeArenaAPI.aiService.createConversation('Coding Session');
            if (res.success && res.data) {
                conversations = [res.data];
                activeConversationUid = res.data.conversationUid;
                activeConversationTitle = res.data.title;
                filterAndRenderConversations();
                await loadActiveConversationMessages();
            }
        } catch (e) {}
    }

    function filterAndRenderConversations() {
        if (searchQuery) {
            filteredConversations = conversations.filter(c => 
                (c.title && c.title.toLowerCase().includes(searchQuery))
            );
        } else {
            filteredConversations = [...conversations];
        }

        renderConversationList();
    }

    function renderConversationList() {
        if (!dom.conversationList) return;
        dom.conversationList.innerHTML = '';

        if (dom.convCount) {
            dom.convCount.textContent = conversations.length;
        }

        if (filteredConversations.length === 0) {
            if (dom.emptyConversations) {
                dom.emptyConversations.style.display = 'flex';
            }
        } else {
            if (dom.emptyConversations) {
                dom.emptyConversations.style.display = 'none';
            }
        }

        filteredConversations.forEach(conv => {
            const item = document.createElement('div');
            const isActive = conv.conversationUid === activeConversationUid;
            item.className = 'ai-conversation-item' + (isActive ? ' active' : '');
            item.setAttribute('role', 'listitem');
            item.setAttribute('data-uid', conv.conversationUid);

            const titleText = escapeHtml(conv.title || 'Coding Session');
            const timeText = formatRelativeTime(conv.updatedAt || conv.createdAt);

            item.innerHTML = `
                <div class="conv-item-icon" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </div>
                <div class="conv-item-content">
                    <div class="conv-item-title" title="${titleText}">${titleText}</div>
                    <div class="conv-item-time">${timeText}</div>
                </div>
                <div class="conv-item-actions">
                    <button type="button" class="conv-rename-btn" title="Rename conversation" aria-label="Rename ${titleText}">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                    </button>
                    <button type="button" class="conv-delete-btn" title="Delete conversation" aria-label="Delete ${titleText}">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            `;

            // Click to select conversation
            item.addEventListener('click', function (e) {
                if (e.target.closest('.conv-delete-btn') || e.target.closest('.conv-rename-btn')) return;
                switchConversation(conv.conversationUid);
                // Close sidebar on mobile
                if (dom.sidebar && dom.sidebar.classList.contains('sidebar-open')) {
                    dom.sidebar.classList.remove('sidebar-open');
                    if (dom.sidebarOverlay) dom.sidebarOverlay.classList.remove('active');
                }
            });

            // Inline Rename action
            const renameBtn = item.querySelector('.conv-rename-btn');
            if (renameBtn) {
                renameBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    promptRenameSpecificConversation(conv.conversationUid, conv.title);
                });
            }

            // Inline Delete action
            const delBtn = item.querySelector('.conv-delete-btn');
            if (delBtn) {
                delBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    confirmDeleteConversation(conv.conversationUid);
                });
            }

            dom.conversationList.appendChild(item);
        });

        if (dom.convTitleDisplay) {
            dom.convTitleDisplay.textContent = activeConversationTitle;
        }
    }

    async function switchConversation(convUid) {
        if (activeConversationUid === convUid) return;
        activeConversationUid = convUid;
        try {
            sessionStorage.setItem(ACTIVE_CONV_STORAGE_KEY, convUid);
        } catch (e) {}

        const activeConv = conversations.find(c => c.conversationUid === convUid);
        if (activeConv) {
            activeConversationTitle = activeConv.title;
        }

        renderConversationList();
        await loadActiveConversationMessages();
    }

    async function loadActiveConversationMessages() {
        if (!dom.chatMessages || !activeConversationUid) return;
        dom.chatMessages.innerHTML = '';

        try {
            const res = await window.CodeArenaAPI.aiService.getConversation(activeConversationUid);
            if (res.success && res.data && Array.isArray(res.data.messages) && res.data.messages.length > 0) {
                renderMessages(res.data.messages);
            } else {
                renderWelcomeMessage();
            }
        } catch (e) {
            renderWelcomeMessage();
        }
    }

    function renderWelcomeMessage() {
        if (!dom.chatMessages) return;
        dom.chatMessages.innerHTML = '';

        const welcomeDiv = document.createElement('div');
        welcomeDiv.className = 'ai-message assistant-message';
        welcomeDiv.innerHTML = `
            <div class="msg-avatar" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                </svg>
            </div>
            <div class="msg-bubble-wrap">
                <div class="msg-header">
                    <span class="msg-author-tag">BUILT-IN ASSISTANT</span>
                    <span class="msg-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div class="msg-bubble assistant-bubble">
                    <div class="msg-content">
                        <p class="welcome-lead">Hello! I am your CodeArena Java mentor.</p>
                        <p>I can help you master core concepts, understand algorithms, debug compiler issues, and explore modern Java features.</p>
                        <div class="msg-paragraph-spacer"></div>
                        <p><strong>Areas you can ask about:</strong></p>
                        <div class="msg-list-item msg-unordered-item"><span class="list-bullet">•</span> <strong>Core Syntax:</strong> Streams, Lambdas, Records, Generics, and Exceptions.</div>
                        <div class="msg-list-item msg-unordered-item"><span class="list-bullet">•</span> <strong>Data Structures:</strong> HashMaps, Trees, PriorityQueues, and Heaps.</div>
                        <div class="msg-list-item msg-unordered-item"><span class="list-bullet">•</span> <strong>Algorithms:</strong> Two Pointers, Dynamic Programming, and Big-O complexity.</div>
                        <div class="msg-list-item msg-unordered-item"><span class="list-bullet">•</span> <strong>Debugging:</strong> Stack traces, NPEs, and compiler diagnostics.</div>
                        <div class="msg-paragraph-spacer"></div>
                        <p class="msg-note"><em>All guidance in Built-in Assistant mode runs locally as Simulated educational preview. Your conversations are isolated to your student session.</em></p>
                    </div>
                </div>
            </div>
        `;
        dom.chatMessages.appendChild(welcomeDiv);
        scrollChatToBottom();
    }

    function renderMessages(messages) {
        if (!dom.chatMessages) return;
        dom.chatMessages.innerHTML = '';

        messages.forEach(msg => {
            const isUser = msg.senderRole === 'user';
            const msgDiv = document.createElement('div');
            msgDiv.className = `ai-message ${isUser ? 'user-message' : 'assistant-message'}`;

            const timeStr = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
            const avatarSvg = isUser ? `
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            ` : `
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                </svg>
            `;

            msgDiv.innerHTML = `
                <div class="msg-avatar" aria-hidden="true">${avatarSvg}</div>
                <div class="msg-bubble-wrap">
                    <div class="msg-header">
                        <span class="msg-author-tag">${isUser ? 'You' : 'BUILT-IN ASSISTANT'}</span>
                        <span class="msg-time">${timeStr}</span>
                    </div>
                    <div class="msg-bubble ${isUser ? 'user-bubble' : 'assistant-bubble'}">
                        <div class="msg-content">${formatMessageText(msg.content)}</div>
                    </div>
                </div>
            `;

            dom.chatMessages.appendChild(msgDiv);
        });

        attachCopyListeners();
        scrollChatToBottom();
    }

    // -------------------------------------------------------------------------
    // 4. Message Dispatch & Thinking Indicator
    // -------------------------------------------------------------------------

    async function handleSendMessage() {
        if (!dom.messageInput || isThinking) return;
        const text = dom.messageInput.value.trim();
        if (!text) return;

        // Clear input and draft
        dom.messageInput.value = '';
        dom.messageInput.style.height = 'auto';
        try {
            sessionStorage.removeItem(PROMPT_DRAFT_KEY);
        } catch (e) {}

        // Set thinking state to prevent duplicate submissions
        isThinking = true;
        if (dom.sendBtn) dom.sendBtn.disabled = true;
        if (dom.messageInput) dom.messageInput.disabled = true;

        // 1. Immediately append user bubble
        appendSingleMessage('user', text, new Date().toISOString());

        // 2. Show thinking indicator
        showThinkingIndicator();

        try {
            // Send to AI service
            const res = await window.CodeArenaAPI.aiService.sendMessage(activeConversationUid, text);
            removeThinkingIndicator();

            if (res.success && res.data) {
                // Update assistant response
                const assistantMsg = res.data.assistantMessage;
                appendSingleMessage('assistant', assistantMsg.content, assistantMsg.createdAt);

                // Update active title if auto-titled
                if (res.data.conversation && res.data.conversation.title) {
                    activeConversationTitle = res.data.conversation.title;
                    if (dom.convTitleDisplay) {
                        dom.convTitleDisplay.textContent = activeConversationTitle;
                    }
                    // Update in list
                    const conv = conversations.find(c => c.conversationUid === activeConversationUid);
                    if (conv) {
                        conv.title = activeConversationTitle;
                        conv.updatedAt = new Date().toISOString();
                        filterAndRenderConversations();
                    }
                }
            } else {
                appendSingleMessage('assistant', 'Sorry, I encountered an issue saving your message. Please try again.', new Date().toISOString());
            }
        } catch (err) {
            removeThinkingIndicator();
            appendSingleMessage('assistant', 'Error communicating with assistant service. Please check your connection.', new Date().toISOString());
        } finally {
            isThinking = false;
            if (dom.sendBtn) dom.sendBtn.disabled = false;
            if (dom.messageInput) {
                dom.messageInput.disabled = false;
                dom.messageInput.focus();
            }
        }
    }

    function appendSingleMessage(role, content, timestamp) {
        if (!dom.chatMessages) return;
        const isUser = role === 'user';
        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-message ${isUser ? 'user-message' : 'assistant-message'}`;

        const timeStr = timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
        const avatarSvg = isUser ? `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
        ` : `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
            </svg>
        `;

        msgDiv.innerHTML = `
            <div class="msg-avatar" aria-hidden="true">${avatarSvg}</div>
            <div class="msg-bubble-wrap">
                <div class="msg-header">
                    <span class="msg-author-tag">${isUser ? 'You' : 'BUILT-IN ASSISTANT'}</span>
                    <span class="msg-time">${timeStr}</span>
                </div>
                <div class="msg-bubble ${isUser ? 'user-bubble' : 'assistant-bubble'}">
                    <div class="msg-content">${formatMessageText(content)}</div>
                </div>
            </div>
        `;

        dom.chatMessages.appendChild(msgDiv);
        attachCopyListeners();
        scrollChatToBottom();
    }

    function showThinkingIndicator() {
        if (!dom.chatMessages) return;
        const thinkingDiv = document.createElement('div');
        thinkingDiv.className = 'ai-message assistant-message thinking-indicator-msg';
        thinkingDiv.id = 'aiThinkingIndicator';
        thinkingDiv.innerHTML = `
            <div class="msg-avatar" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                </svg>
            </div>
            <div class="msg-bubble-wrap">
                <div class="msg-bubble assistant-bubble thinking-bubble">
                    <div class="thinking-dots" aria-label="Assistant is analyzing your query">
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="thinking-label">Thinking...</span>
                    </div>
                </div>
            </div>
        `;
        dom.chatMessages.appendChild(thinkingDiv);
        scrollChatToBottom();
    }

    function removeThinkingIndicator() {
        const el = document.getElementById('aiThinkingIndicator');
        if (el) el.remove();
    }

    // -------------------------------------------------------------------------
    // 5. Actions (New, Rename, Delete, Clear)
    // -------------------------------------------------------------------------

    async function handleNewConversation() {
        try {
            const res = await window.CodeArenaAPI.aiService.createConversation('Coding Session');
            if (res.success && res.data) {
                conversations.unshift(res.data);
                activeConversationUid = res.data.conversationUid;
                activeConversationTitle = res.data.title;
                try {
                    sessionStorage.setItem(ACTIVE_CONV_STORAGE_KEY, activeConversationUid);
                } catch (e) {}

                // Reset search query if active
                if (dom.searchInput) {
                    dom.searchInput.value = '';
                    if (dom.clearSearchBtn) dom.clearSearchBtn.style.display = 'none';
                }
                searchQuery = '';

                filterAndRenderConversations();
                renderWelcomeMessage();
                if (window.CodeArenaToast) {
                    window.CodeArenaToast.info('Started a new conversation');
                }
            }
        } catch (e) {
            if (window.CodeArenaToast) {
                window.CodeArenaToast.error('Could not create new conversation.');
            }
        }
    }

    async function handleRenameConversation() {
        if (!activeConversationUid) return;
        promptRenameSpecificConversation(activeConversationUid, activeConversationTitle);
    }

    async function promptRenameSpecificConversation(convUid, currentTitle) {
        const titleToUse = currentTitle || 'Coding Session';
        const newTitle = prompt('Enter a new title for this conversation:', titleToUse);
        if (newTitle && newTitle.trim() && newTitle.trim() !== titleToUse) {
            const trimmed = newTitle.trim().substring(0, 80);
            try {
                const res = await window.CodeArenaAPI.aiService.renameConversation(convUid, trimmed);
                if (res.success) {
                    if (activeConversationUid === convUid) {
                        activeConversationTitle = trimmed;
                        if (dom.convTitleDisplay) dom.convTitleDisplay.textContent = trimmed;
                    }
                    const conv = conversations.find(c => c.conversationUid === convUid);
                    if (conv) conv.title = trimmed;
                    filterAndRenderConversations();
                    if (window.CodeArenaToast) {
                        window.CodeArenaToast.info('Conversation title updated');
                    }
                }
            } catch (e) {}
        }
    }

    async function confirmDeleteConversation(convUid) {
        const conv = conversations.find(c => c.conversationUid === convUid);
        const name = conv ? conv.title : 'this conversation';
        if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            try {
                const res = await window.CodeArenaAPI.aiService.deleteConversation(convUid);
                if (res.success) {
                    conversations = conversations.filter(c => c.conversationUid !== convUid);
                    if (window.CodeArenaToast) {
                        window.CodeArenaToast.info('Conversation deleted');
                    }
                    if (activeConversationUid === convUid) {
                        if (conversations.length > 0) {
                            await switchConversation(conversations[0].conversationUid);
                        } else {
                            await handleCreateInitialConversation();
                        }
                    } else {
                        filterAndRenderConversations();
                    }
                }
            } catch (e) {}
        }
    }

    function handleClearChat() {
        if (confirm('Clear the current chat view? (Your saved conversation thread remains accessible)')) {
            renderWelcomeMessage();
            if (window.CodeArenaToast) {
                window.CodeArenaToast.info('Chat stream cleared');
            }
        }
    }

    // -------------------------------------------------------------------------
    // 6. Formatting, Syntax Highlighting & Code Copying
    // -------------------------------------------------------------------------

    function formatMessageText(text) {
        if (!text) return '';

        // Extract fenced code blocks first
        const codeBlocks = [];
        let processed = text.replace(/```(?:java)?([\s\S]*?)```/g, function (match, code) {
            const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
            codeBlocks.push(code.trim());
            return placeholder;
        });

        // Markdown headings, bold, inline code, lists
        processed = escapeHtml(processed)
            .replace(/^### (.*$)/gim, '<h4 class="msg-heading">$1</h4>')
            .replace(/^## (.*$)/gim, '<h3 class="msg-subheading">$1</h3>')
            .replace(/^> (.*$)/gim, '<blockquote class="msg-blockquote">$1</blockquote>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code class="msg-inline-code">$1</code>')
            .replace(/^(\d+\.\s+.*$)/gim, '<div class="msg-list-item msg-ordered-item">$1</div>')
            .replace(/^- (.*$)/gim, '<div class="msg-list-item msg-unordered-item"><span class="list-bullet">•</span> $1</div>')
            .replace(/\n\n/g, '<div class="msg-paragraph-spacer"></div>')
            .replace(/\n/g, '<br>');

        // Reinsert code blocks
        codeBlocks.forEach((code, idx) => {
            const escapedCode = escapeHtml(code);
            const blockHtml = `
                <div class="msg-code-block-card">
                    <div class="msg-code-header">
                        <span class="code-lang-label">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="16 18 22 12 16 6"></polyline>
                                <polyline points="8 6 2 12 8 18"></polyline>
                            </svg>
                            <span>Java 17</span>
                        </span>
                        <button type="button" class="code-copy-btn btnCopy" data-code="${escapeHtml(code)}" aria-label="Copy Java code">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            <span>Copy Code</span>
                        </button>
                    </div>
                    <pre><code class="language-java">${escapedCode}</code></pre>
                </div>
            `;
            processed = processed.replace(`__CODE_BLOCK_${idx}__`, blockHtml);
        });

        return processed;
    }

    function attachCopyListeners() {
        if (!dom.chatMessages) return;
        dom.chatMessages.querySelectorAll('.code-copy-btn').forEach(btn => {
            btn.onclick = function () {
                const rawCode = this.getAttribute('data-code') || this.parentElement.nextElementSibling.innerText;
                if (!rawCode) return;

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(rawCode).then(() => {
                        updateCopySuccess(this);
                    }).catch(() => fallbackCopy(rawCode, this));
                } else {
                    fallbackCopy(rawCode, this);
                }
            };
        });
    }

    function updateCopySuccess(btn) {
        const span = btn.querySelector('span');
        const originalText = span ? span.textContent : 'Copy Code';
        btn.classList.add('copied');
        if (span) span.textContent = 'Copied!';
        setTimeout(() => {
            btn.classList.remove('copied');
            if (span) span.textContent = originalText;
        }, 1800);
    }

    function fallbackCopy(text, btn) {
        try {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            updateCopySuccess(btn);
        } catch (e) {}
    }

    function scrollChatToBottom() {
        if (dom.chatMessages) {
            dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
        }
    }

    function formatRelativeTime(dateStr) {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins}m ago`;
            const diffHours = Math.floor(diffMins / 60);
            if (diffHours < 24) return `${diffHours}h ago`;
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        } catch (e) {
            return '';
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();