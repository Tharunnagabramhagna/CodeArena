/**
 * CodeArena — Reusable Algorithm Visualizers Library (animation_visualizers.js)
 * High-performance, accessible DOM & SVG visualizer components supporting all 25+ DSA patterns.
 * Pure Vanilla JavaScript (ES6+), zero external dependencies.
 */

(function () {
    'use strict';

    function escapeHtml(str) {
        if (str === undefined || str === null) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    const Visualizers = {
        /**
         * 1. 1D Array & Indexing Visualizer
         */
        renderArray({ items = [], pointers = [], highlights = {}, label = 'Array State', subLabels = null }) {
            const cols = items.map((val, idx) => {
                const pointer = pointers.find(p => p.index === idx);
                const pinHtml = pointer
                    ? `<span class="anim-pointer-pin ${escapeHtml(pointer.className || '')}">${escapeHtml(pointer.name)}</span>`
                    : `<span class="anim-pointer-pin pin-hidden">·</span>`;
                const highlightClass = highlights[idx] || '';
                const sub = subLabels && subLabels[idx] !== undefined ? subLabels[idx] : `idx ${idx}`;
                return `
                    <div class="anim-array-col">
                        ${pinHtml}
                        <div class="anim-array-cell ${escapeHtml(highlightClass)}">${escapeHtml(val)}</div>
                        <span class="anim-index-sub">${escapeHtml(sub)}</span>
                    </div>
                `;
            }).join('');

            return `
                <div class="anim-visual-block">
                    <span class="anim-block-label">${escapeHtml(label)}</span>
                    <div class="anim-array-wrap">
                        ${cols}
                    </div>
                </div>
            `;
        },

        /**
         * 2. Two Pointers Visualizer (In-place or Converging)
         */
        renderTwoPointers({ items = [], left = 0, right = 0, leftLabel = 'L', rightLabel = 'R', highlights = {}, comparison = '', label = 'Two Pointers Traversal', subLabels = null }) {
            const isCompact = items.length > 12;
            const isMicro = items.length > 22;
            let wrapClass = 'anim-array-wrap anim-two-pointers-wrap';
            if (isMicro) wrapClass += ' anim-char-seq-micro';
            else if (isCompact) wrapClass += ' anim-char-seq-compact';

            const cols = items.map((val, idx) => {
                let pinHtml = '<span class="anim-pointer-pin pin-hidden">·</span>';
                let ptrLabel = '<span class="anim-ptr-label ptr-placeholder">&nbsp;</span>';

                if (idx === left && idx === right) {
                    pinHtml = `<span class="anim-pointer-pin pin-success">${escapeHtml(leftLabel)}=${escapeHtml(rightLabel)}=${idx}</span>`;
                    ptrLabel = `<span class="anim-ptr-label ptr-matched">▲ ${escapeHtml(leftLabel)}=${escapeHtml(rightLabel)}</span>`;
                } else if (idx === left) {
                    pinHtml = `<span class="anim-pointer-pin pin-primary">${escapeHtml(leftLabel)}=${idx}</span>`;
                    ptrLabel = `<span class="anim-ptr-label ptr-left">▲ ${escapeHtml(leftLabel)}</span>`;
                } else if (idx === right) {
                    pinHtml = `<span class="anim-pointer-pin pin-secondary">${escapeHtml(rightLabel)}=${idx}</span>`;
                    ptrLabel = `<span class="anim-ptr-label ptr-right">▲ ${escapeHtml(rightLabel)}</span>`;
                }

                let hl = highlights[idx] || '';
                if (!hl) {
                    if (idx === left || idx === right) hl = 'active-examined';
                    else if (idx < left || idx > right) hl = 'cell-discarded';
                }

                // Check for punctuation / whitespace to style distinctly
                const isChar = typeof val === 'string';
                const isPunct = isChar && !/^[a-zA-Z0-9]$/.test(val);
                if (isPunct) {
                    hl = (hl ? hl + ' ' : '') + 'cell-punct';
                }

                const displayVal = val === ' ' ? '␣' : escapeHtml(val);
                const sub = subLabels && subLabels[idx] !== undefined ? subLabels[idx] : `idx ${idx}`;

                return `
                    <div class="anim-array-col" data-idx="${idx}">
                        ${pinHtml}
                        <div class="anim-array-cell ${escapeHtml(hl)}" title="Index ${idx}: '${escapeHtml(val)}'">${displayVal}</div>
                        <span class="anim-index-sub">${escapeHtml(sub)}</span>
                        ${ptrLabel}
                    </div>
                `;
            }).join('');

            const compHtml = comparison ? `
                <div class="anim-status-banner">
                    <span class="anim-status-key">Character Evaluation:</span>
                    <strong class="anim-status-val">${escapeHtml(comparison)}</strong>
                </div>
            ` : '';

            const leftChar = items[left] !== undefined ? (items[left] === ' ' ? '␣ (space)' : `'${items[left]}'`) : '—';
            const rightChar = items[right] !== undefined ? (items[right] === ' ' ? '␣ (space)' : `'${items[right]}'`) : '—';
            const pointersTag = items.length > 0 ? `
                <div class="anim-pointers-status-tag">
                    <span>Left: <strong class="text-primary">${escapeHtml(leftLabel)} = ${left} (${leftChar})</strong></span>
                    <span class="tag-divider">|</span>
                    <span>Right: <strong class="text-secondary">${escapeHtml(rightLabel)} = ${right} (${rightChar})</strong></span>
                </div>
            ` : '';

            return `
                <div class="anim-visual-block anim-two-pointers-block">
                    <span class="anim-block-label">${escapeHtml(label)}</span>
                    ${pointersTag}
                    <div class="${wrapClass}">
                        ${cols}
                    </div>
                    ${compHtml}
                </div>
            `;
        },

        /**
         * 3. Sliding Window Visualizer
         */
        renderSlidingWindow({ items = [], winLeft = 0, winRight = 0, winMetric = '', highlights = {}, label = 'Sliding Window' }) {
            const cols = items.map((val, idx) => {
                const inWindow = idx >= winLeft && idx <= winRight;
                let pinHtml = '<span class="anim-pointer-pin pin-hidden">·</span>';
                if (idx === winLeft && idx === winRight) {
                    pinHtml = `<span class="anim-pointer-pin pin-success">L=R=${idx}</span>`;
                } else if (idx === winLeft) {
                    pinHtml = `<span class="anim-pointer-pin">L=${idx}</span>`;
                } else if (idx === winRight) {
                    pinHtml = `<span class="anim-pointer-pin pin-secondary">R=${idx}</span>`;
                }

                let hl = highlights[idx] || '';
                if (!hl && inWindow) hl = 'active-swapped';
                if (!inWindow && (idx < winLeft || idx > winRight)) hl = 'cell-discarded';

                return `
                    <div class="anim-array-col">
                        ${pinHtml}
                        <div class="anim-array-cell ${escapeHtml(hl)}">${escapeHtml(val)}</div>
                        <span class="anim-index-sub">${idx}</span>
                    </div>
                `;
            }).join('');

            return `
                <div class="anim-visual-block">
                    <span class="anim-block-label">${escapeHtml(label)} (Window: [${winLeft}..${winRight}], Size: ${Math.max(0, winRight - winLeft + 1)})</span>
                    <div class="anim-array-wrap anim-window-wrap">
                        ${cols}
                    </div>
                    ${winMetric ? `<div class="anim-window-metric-tag">${escapeHtml(winMetric)}</div>` : ''}
                </div>
            `;
        },

        /**
         * 4. Hash Map & Hash Set Visualizer
         */
        renderHashMap({ arrayItems = null, arrayPointers = [], arrayHighlights = {}, mapEntries = [], activeKey = null, label = 'Hash Map Lookup', mapTitle = 'Auxiliary Hash Map' }) {
            let arraySection = '';
            if (arrayItems && Array.isArray(arrayItems)) {
                const cols = arrayItems.map((val, idx) => {
                    const pointer = arrayPointers.find(p => p.index === idx);
                    const pinHtml = pointer
                        ? `<span class="anim-pointer-pin ${escapeHtml(pointer.className || '')}">${escapeHtml(pointer.name)}</span>`
                        : `<span class="anim-pointer-pin pin-hidden">·</span>`;
                    const hl = arrayHighlights[idx] || '';
                    return `
                        <div class="anim-array-col">
                            ${pinHtml}
                            <div class="anim-array-cell ${escapeHtml(hl)}">${escapeHtml(val)}</div>
                            <span class="anim-index-sub">idx ${idx}</span>
                        </div>
                    `;
                }).join('');
                arraySection = `
                    <div class="anim-array-wrap" style="margin-bottom: 16px;">
                        ${cols}
                    </div>
                `;
            }

            const entriesHtml = mapEntries.length === 0
                ? `<span class="anim-empty-note">(Empty map — 0 entries stored)</span>`
                : mapEntries.map(e => {
                    const isActive = String(e.key) === String(activeKey);
                    const statusClass = isActive ? (e.isMatch ? 'hash-entry-matched' : 'hash-entry-active') : '';
                    return `
                        <div class="anim-hashmap-row ${statusClass}">
                            <span class="hash-k">Key: <strong>${escapeHtml(e.key)}</strong></span>
                            <span class="hash-v">Val: <strong>${escapeHtml(e.val !== undefined ? e.val : e.value)}</strong></span>
                            ${e.note ? `<span class="hash-note">${escapeHtml(e.note)}</span>` : ''}
                        </div>
                    `;
                }).join('');

            return `
                <div class="anim-visual-block">
                    <span class="anim-block-label">${escapeHtml(label)}</span>
                    ${arraySection}
                    <div class="anim-aux-grid">
                        <div class="anim-aux-card">
                            <span class="anim-aux-title">${escapeHtml(mapTitle)}</span>
                            <div class="anim-hashmap-list">
                                ${entriesHtml}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        /**
         * 5. Linked List Visualizer (Horizontal Flow Architecture)
         */
        renderLinkedList({
            nodes = [],
            pointers = [],
            highlights = {},
            label = 'Linked List State',
            arrowDirections = {},
            nullLeft = false,
            showIndices = true,
            statusBadge = null
        }) {
            if (!Array.isArray(nodes) || nodes.length === 0) {
                return `
                    <div class="anim-visual-block anim-ll-block">
                        <span class="anim-block-label">${escapeHtml(label)}</span>
                        <div class="anim-ll-container">
                            <span class="anim-ll-null" title="Empty list (head = null)">null (empty list)</span>
                        </div>
                    </div>
                `;
            }

            const getNodeVal = (node) => (node !== null && typeof node === 'object' && node.val !== undefined) ? node.val : node;
            const getNodeLabel = (node, idx) => (node !== null && typeof node === 'object' && node.label) ? node.label : `[${idx}]`;

            // Optional Left Null Terminal (e.g. for pointer reversal tracking: prev -> null)
            const leftNullPointers = pointers.filter(p => p.index === -1 || p.index === 'null-left' || p.index === 'prev-null');
            let leftNullHtml = '';
            if (nullLeft || leftNullPointers.length > 0) {
                const leftNullPins = leftNullPointers.length > 0
                    ? leftNullPointers.map(p => `<span class="anim-pointer-pin ${escapeHtml(p.className || 'pin-warning')}">${escapeHtml(p.name)}</span>`).join('')
                    : `<span class="anim-pointer-pin pin-hidden" aria-hidden="true">·</span>`;
                
                const leftArrowDir = arrowDirections[-1] || 'left';
                const leftArrowSvg = leftArrowDir === 'left'
                    ? `<svg class="anim-ll-arrow-svg" viewBox="0 0 32 20" fill="none"><path d="M26 10H6M6 10L12 4M6 10L12 16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
                    : `<svg class="anim-ll-arrow-svg" viewBox="0 0 32 20" fill="none"><path d="M4 10H24M24 10L18 4M24 10L18 16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

                leftNullHtml = `
                    <div class="anim-ll-node-group anim-ll-left-null-group">
                        <div class="anim-ll-node-col anim-ll-null-col">
                            <div class="anim-ll-pin-slot">${leftNullPins}</div>
                            <span class="anim-ll-null" title="null reference">null</span>
                            ${showIndices ? '<span class="anim-ll-idx-label">null</span>' : ''}
                        </div>
                        <div class="anim-ll-arrow ${leftArrowDir === 'left' ? 'arrow-reversed' : ''}" aria-hidden="true" title="pointer to null">
                            ${leftArrowSvg}
                        </div>
                    </div>
                `;
            }

            // Main Nodes Chain
            const listHtml = nodes.map((node, idx) => {
                const matchingPointers = pointers.filter(p => p.index === idx);
                const pinHtml = matchingPointers.length > 0
                    ? matchingPointers.map(p => `<span class="anim-pointer-pin ${escapeHtml(p.className || '')}">${escapeHtml(p.name)}</span>`).join('')
                    : `<span class="anim-pointer-pin pin-hidden" aria-hidden="true">·</span>`;
                const hl = highlights[idx] || '';
                const isLast = idx === nodes.length - 1;
                const nodeVal = getNodeVal(node);
                const nodeSub = getNodeLabel(node, idx);

                // Arrow handling
                const arrowDir = arrowDirections[idx] || (node && node.arrowDir) || 'right';
                let arrowClass = '';
                let arrowPath = '';
                if (arrowDir === 'left') {
                    arrowClass = 'arrow-reversed';
                    arrowPath = '<path d="M26 10H6M6 10L12 4M6 10L12 16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';
                } else if (arrowDir === 'none' || arrowDir === 'broken') {
                    arrowClass = 'arrow-broken';
                    arrowPath = '<line x1="4" y1="10" x2="26" y2="10" stroke="currentColor" stroke-width="2.5" stroke-dasharray="4 3"/>';
                } else {
                    arrowPath = '<path d="M4 10H24M24 10L18 4M24 10L18 16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';
                }

                // Check for pointers on the tail null terminal
                const endNullPointers = pointers.filter(p => p.index === nodes.length || p.index === 'null' || p.index === 'tail-null');
                const endNullPins = endNullPointers.length > 0
                    ? endNullPointers.map(p => `<span class="anim-pointer-pin ${escapeHtml(p.className || 'pin-warning')}">${escapeHtml(p.name)}</span>`).join('')
                    : `<span class="anim-pointer-pin pin-hidden" aria-hidden="true">·</span>`;

                return `
                    <div class="anim-ll-node-group">
                        <div class="anim-ll-node-col">
                            <div class="anim-ll-pin-slot">
                                ${pinHtml}
                            </div>
                            <div class="anim-ll-node ${escapeHtml(hl)}" title="ListNode(val: ${escapeHtml(nodeVal)})">
                                <span class="anim-ll-val">${escapeHtml(nodeVal)}</span>
                                <span class="anim-ll-ptr" title="next pointer"><span class="anim-ll-bullet"></span></span>
                            </div>
                            ${showIndices ? `<span class="anim-ll-idx-label">${escapeHtml(nodeSub)}</span>` : ''}
                        </div>
                        ${!isLast ? `
                            <div class="anim-ll-arrow ${arrowClass}" aria-hidden="true" title="next pointer">
                                <svg class="anim-ll-arrow-svg" viewBox="0 0 32 20" fill="none">
                                    ${arrowPath}
                                </svg>
                            </div>
                        ` : `
                            <div class="anim-ll-arrow" aria-hidden="true" title="next -> null">
                                <svg class="anim-ll-arrow-svg" viewBox="0 0 32 20" fill="none">
                                    <path d="M4 10H24M24 10L18 4M24 10L18 16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            <div class="anim-ll-node-col anim-ll-null-col">
                                <div class="anim-ll-pin-slot">
                                    ${endNullPins}
                                </div>
                                <span class="anim-ll-null" title="Tail pointer points to null">null</span>
                                ${showIndices ? `<span class="anim-ll-idx-label">tail</span>` : ''}
                            </div>
                        `}
                    </div>
                `;
            }).join('');

            return `
                <div class="anim-visual-block anim-ll-block">
                    <span class="anim-block-label">${escapeHtml(label)}</span>
                    ${statusBadge ? `<div class="anim-status-badge">${escapeHtml(statusBadge)}</div>` : ''}
                    <div class="anim-ll-container">
                        ${leftNullHtml}
                        ${listHtml}
                    </div>
                </div>
            `;
        },

        /**
         * 6. Stack & Monotonic Stack Visualizer
         */
        renderStack({ stackItems = [], activeAction = '', activeItem = null, upcoming = [], label = 'LIFO Stack Execution' }) {
            const stackHtml = stackItems.length === 0
                ? `<div class="anim-stack-empty">Stack is empty (size = 0)</div>`
                : stackItems.slice().reverse().map((item, revIdx) => {
                    const actualIdx = stackItems.length - 1 - revIdx;
                    const isTop = revIdx === 0;
                    return `
                        <div class="anim-stack-item ${isTop ? 'stack-top-item' : ''}">
                            <span class="stack-item-val">${escapeHtml(item)}</span>
                            ${isTop ? '<span class="stack-top-badge">TOP</span>' : `<span class="stack-idx-badge">[${actualIdx}]</span>`}
                        </div>
                    `;
                }).join('');

            const upcomingHtml = upcoming.length > 0 ? `
                <div class="anim-stream-panel">
                    <span class="anim-aux-title">Remaining Input Stream</span>
                    <div class="anim-stream-chips">
                        ${upcoming.map(u => `<span class="stream-chip">${escapeHtml(u)}</span>`).join('')}
                    </div>
                </div>
            ` : '';

            return `
                <div class="anim-visual-block">
                    <span class="anim-block-label">${escapeHtml(label)}</span>
                    <div class="anim-stack-stage-grid">
                        <div class="anim-stack-bucket">
                            <div class="anim-stack-rim">Stack Top (LIFO Entry & Exit)</div>
                            <div class="anim-stack-inner">
                                ${stackHtml}
                            </div>
                            <div class="anim-stack-bottom">Stack Base</div>
                        </div>
                        <div class="anim-stack-action-panel">
                            ${activeAction ? `
                                <div class="anim-action-pill ${activeAction.includes('Pop') ? 'pill-danger' : 'pill-accent'}">
                                    <strong>${escapeHtml(activeAction)}</strong>
                                    ${activeItem !== null ? `<span>: ${escapeHtml(activeItem)}</span>` : ''}
                                </div>
                            ` : ''}
                            ${upcomingHtml}
                        </div>
                    </div>
                </div>
            `;
        },

        /**
         * 7. Queue & Deque Visualizer
         */
        renderQueue({ queueItems = [], activeAction = '', activeItem = null, label = 'FIFO Queue Execution' }) {
            const itemsHtml = queueItems.length === 0
                ? `<div class="anim-queue-empty">Queue is empty (front == rear)</div>`
                : queueItems.map((item, idx) => {
                    const isFront = idx === 0;
                    const isRear = idx === queueItems.length - 1;
                    return `
                        <div class="anim-queue-cell ${isFront ? 'queue-cell-front' : ''} ${isRear ? 'queue-cell-rear' : ''}">
                            <span class="queue-item-val">${escapeHtml(item)}</span>
                            <span class="queue-tag">${isFront ? 'FRONT' : (isRear ? 'REAR' : `[${idx}]`)}</span>
                        </div>
                    `;
                }).join('');

            return `
                <div class="anim-visual-block">
                    <span class="anim-block-label">${escapeHtml(label)}</span>
                    <div class="anim-queue-wrap">
                        <div class="anim-queue-flow-label">← Dequeue (Out)</div>
                        <div class="anim-queue-track">
                            ${itemsHtml}
                        </div>
                        <div class="anim-queue-flow-label">Enqueue (In) ←</div>
                    </div>
                    ${activeAction ? `
                        <div class="anim-status-banner" style="margin-top: 14px;">
                            <span class="anim-status-key">Queue Action:</span>
                            <strong class="anim-status-val">${escapeHtml(activeAction)} ${activeItem !== null ? `(${escapeHtml(activeItem)})` : ''}</strong>
                        </div>
                    ` : ''}
                </div>
            `;
        },

        /**
         * 8. Binary Tree & BST Visualizer (Scalable SVG)
         */
        renderTree({ nodes = [], activeId = null, visitedIds = [], traversalSequence = [], label = 'Binary Tree Visualization' }) {
            // Default 7-node balanced tree layout if coordinates are not supplied
            const defaultCoords = {
                1: { x: 260, y: 35 },
                2: { x: 140, y: 105 },
                3: { x: 380, y: 105 },
                4: { x: 80, y: 175 },
                5: { x: 200, y: 175 },
                6: { x: 320, y: 175 },
                7: { x: 440, y: 175 }
            };

            const processedNodes = nodes.map((node, i) => {
                const id = node.id || (i + 1);
                const coords = defaultCoords[id] || { x: 100 + (i * 60), y: 50 + (i * 30) };
                return {
                    id: id,
                    val: node.val !== undefined ? node.val : node,
                    left: node.left,
                    right: node.right,
                    x: node.x || coords.x,
                    y: node.y || coords.y
                };
            });

            const nodeMap = {};
            processedNodes.forEach(n => { nodeMap[n.id] = n; });

            // Generate SVG lines
            const lines = [];
            processedNodes.forEach(n => {
                if (n.left && nodeMap[n.left]) {
                    const child = nodeMap[n.left];
                    lines.push(`<line x1="${n.x}" y1="${n.y}" x2="${child.x}" y2="${child.y}" class="tree-edge" />`);
                }
                if (n.right && nodeMap[n.right]) {
                    const child = nodeMap[n.right];
                    lines.push(`<line x1="${n.x}" y1="${n.y}" x2="${child.x}" y2="${child.y}" class="tree-edge" />`);
                }
            });

            // Generate SVG circles
            const circles = processedNodes.map(n => {
                const isActive = n.id === activeId;
                const isVisited = visitedIds.includes(n.id);
                const cls = isActive ? 'tree-node-circle active' : (isVisited ? 'tree-node-circle visited' : 'tree-node-circle');
                return `
                    <g class="anim-tree-node-group" data-id="${n.id}">
                        <circle cx="${n.x}" cy="${n.y}" r="20" class="${cls}" />
                        <text x="${n.x}" y="${n.y + 5}" class="tree-node-text" text-anchor="middle">${escapeHtml(n.val)}</text>
                    </g>
                `;
            }).join('');

            const seqHtml = traversalSequence.length > 0 ? `
                <div class="anim-traversal-strip">
                    <span class="anim-aux-title">Visited Order:</span>
                    <div class="anim-traversal-chips">
                        ${traversalSequence.map((val, idx) => `<span class="traversal-chip">${idx + 1}. <strong>${escapeHtml(val)}</strong></span>`).join(' → ')}
                    </div>
                </div>
            ` : '';

            return `
                <div class="anim-visual-block">
                    <span class="anim-block-label">${escapeHtml(label)}</span>
                    <div class="anim-tree-canvas-wrap">
                        <svg class="anim-tree-svg" viewBox="0 0 520 220" width="100%" height="220" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="treeEdgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stop-color="#4F46E5" stop-opacity="0.6"/>
                                    <stop offset="100%" stop-color="#06B6D4" stop-opacity="0.6"/>
                                </linearGradient>
                            </defs>
                            <g class="tree-edges-layer">${lines.join('')}</g>
                            <g class="tree-nodes-layer">${circles}</g>
                        </svg>
                    </div>
                    ${seqHtml}
                </div>
            `;
        },

        /**
         * 9. Graph & BFS/DFS Traversal Visualizer (SVG)
         */
        renderGraph({ vertices = [], edges = [], activeNode = null, visitedNodes = [], frontierQueue = [], label = 'Graph Traversal State' }) {
            const vertexElements = vertices.map(v => {
                const isActive = v.id === activeNode;
                const isVisited = visitedNodes.includes(v.id);
                const isFrontier = frontierQueue.includes(v.id);
                let cls = 'graph-vertex';
                if (isActive) cls += ' active';
                else if (isVisited) cls += ' visited';
                else if (isFrontier) cls += ' frontier';

                return `
                    <g class="graph-vertex-group" data-id="${v.id}">
                        <circle cx="${v.x}" cy="${v.y}" r="22" class="${cls}" />
                        <text x="${v.x}" y="${v.y + 5}" class="graph-vertex-text" text-anchor="middle">${escapeHtml(v.label || v.id)}</text>
                    </g>
                `;
            }).join('');

            const edgeElements = edges.map(e => {
                const u = vertices.find(v => v.id === e.u);
                const v = vertices.find(v => v.id === e.v);
                if (!u || !v) return '';
                const isTraversed = (visitedNodes.includes(e.u) && visitedNodes.includes(e.v));
                const cls = isTraversed ? 'graph-edge traversed' : 'graph-edge';
                return `<line x1="${u.x}" y1="${u.y}" x2="${v.x}" y2="${v.y}" class="${cls}" />`;
            }).join('');

            return `
                <div class="anim-visual-block">
                    <span class="anim-block-label">${escapeHtml(label)}</span>
                    <div class="anim-graph-canvas-wrap">
                        <svg class="anim-graph-svg" viewBox="0 0 520 220" width="100%" height="220" xmlns="http://www.w3.org/2000/svg">
                            <g class="graph-edges-layer">${edgeElements}</g>
                            <g class="graph-nodes-layer">${vertexElements}</g>
                        </svg>
                    </div>
                    <div class="anim-graph-meta-grid">
                        <div class="anim-meta-box">
                            <span class="anim-aux-title">Active Frontier / Queue</span>
                            <div class="anim-meta-chips">
                                ${frontierQueue.length ? frontierQueue.map(f => `<span class="chip-frontier">${escapeHtml(f)}</span>`).join('') : '<span class="chip-empty">Empty</span>'}
                            </div>
                        </div>
                        <div class="anim-meta-box">
                            <span class="anim-aux-title">Visited Set</span>
                            <div class="anim-meta-chips">
                                ${visitedNodes.length ? visitedNodes.map(v => `<span class="chip-visited">${escapeHtml(v)}</span>`).join('') : '<span class="chip-empty">None</span>'}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        /**
         * 10. Dynamic Programming Table Visualizer (1D or 2D)
         */
        renderDPTable({ table = [], rowHeaders = [], colHeaders = [], activeRow = -1, activeCol = -1, dependencyCells = [], formula = '', label = 'DP State Tabulation' }) {
            // Check if 1D or 2D
            const is2D = Array.isArray(table[0]);
            let tableHtml = '';

            if (!is2D) {
                // 1D Table
                const cols = table.map((val, idx) => {
                    const isActive = idx === activeCol;
                    const isDep = dependencyCells.some(d => d.col === idx);
                    let cls = 'dp-cell';
                    if (isActive) cls += ' dp-active';
                    else if (isDep) cls += ' dp-dep';
                    return `
                        <div class="dp-col">
                            <span class="dp-header-label">${colHeaders[idx] !== undefined ? escapeHtml(colHeaders[idx]) : `i=${idx}`}</span>
                            <div class="${cls}">${val !== null && val !== undefined ? escapeHtml(val) : '—'}</div>
                        </div>
                    `;
                }).join('');
                tableHtml = `<div class="dp-1d-row">${cols}</div>`;
            } else {
                // 2D Table
                const headerRow = `
                    <div class="dp-2d-row dp-header-row">
                        <div class="dp-corner-cell"></div>
                        ${colHeaders.map(c => `<div class="dp-col-hdr">${escapeHtml(c)}</div>`).join('')}
                    </div>
                `;
                const rows = table.map((rowArr, r) => {
                    const rHdr = rowHeaders[r] !== undefined ? escapeHtml(rowHeaders[r]) : `r${r}`;
                    const cells = rowArr.map((val, c) => {
                        const isActive = (r === activeRow && c === activeCol);
                        const isDep = dependencyCells.some(d => d.row === r && d.col === c);
                        let cls = 'dp-cell';
                        if (isActive) cls += ' dp-active';
                        else if (isDep) cls += ' dp-dep';
                        return `<div class="${cls}">${val !== null && val !== undefined ? escapeHtml(val) : '—'}</div>`;
                    }).join('');
                    return `
                        <div class="dp-2d-row">
                            <div class="dp-row-hdr">${rHdr}</div>
                            ${cells}
                        </div>
                    `;
                }).join('');
                tableHtml = `<div class="dp-2d-grid">${headerRow}${rows}</div>`;
            }

            return `
                <div class="anim-visual-block">
                    <span class="anim-block-label">${escapeHtml(label)}</span>
                    <div class="dp-table-container">
                        ${tableHtml}
                    </div>
                    ${formula ? `
                        <div class="dp-formula-pill">
                            <span class="dp-formula-icon" aria-hidden="true">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="4 7 4 4 20 4 20 7"></polyline>
                                    <line x1="9" y1="20" x2="15" y2="20"></line>
                                    <line x1="12" y1="4" x2="12" y2="20"></line>
                                </svg>
                            </span>
                            <span>Recurrence: <strong>${escapeHtml(formula)}</strong></span>
                        </div>
                    ` : ''}
                </div>
            `;
        },

        /**
         * 11. 2D Matrix Grid Traversal Visualizer (Grid Flood-Fill / Pathfinding)
         */
        renderMatrix({ grid = [], activeRow = -1, activeCol = -1, visitedCells = [], pathCells = [], label = 'Matrix Traversal' }) {
            const rowsHtml = grid.map((row, r) => {
                const cells = row.map((val, c) => {
                    const isActive = (r === activeRow && c === activeCol);
                    const isVisited = visitedCells.some(v => v[0] === r && v[1] === c);
                    const isPath = pathCells.some(p => p[0] === r && p[1] === c);

                    let cls = 'anim-matrix-cell';
                    if (isActive) cls += ' active';
                    else if (isPath) cls += ' path';
                    else if (isVisited) cls += ' visited';

                    return `
                        <div class="${cls}" title="(${r}, ${c})">
                            <span class="matrix-cell-val">${escapeHtml(val)}</span>
                            <span class="matrix-coord">${r},${c}</span>
                        </div>
                    `;
                }).join('');
                return `<div class="anim-matrix-row">${cells}</div>`;
            }).join('');

            return `
                <div class="anim-visual-block">
                    <span class="anim-block-label">${escapeHtml(label)}</span>
                    <div class="anim-matrix-wrapper">
                        <div class="anim-matrix-grid">
                            ${rowsHtml}
                        </div>
                    </div>
                </div>
            `;
        },

        /**
         * 12. Interval Scheduling & Merging Visualizer (Horizontal Timeline)
         */
        renderIntervals({ intervals = [], activeIndex = -1, merged = [], label = 'Interval Timeline' }) {
            const minVal = Math.min(...intervals.map(i => i[0]), 0);
            const maxVal = Math.max(...intervals.map(i => i[1]), 20);
            const span = Math.max(1, maxVal - minVal);

            const intervalBars = intervals.map((iv, idx) => {
                const isActive = idx === activeIndex;
                const leftPct = ((iv[0] - minVal) / span) * 100;
                const widthPct = Math.max(6, ((iv[1] - iv[0]) / span) * 100);
                const cls = isActive ? 'interval-bar active' : 'interval-bar';

                return `
                    <div class="interval-track-row">
                        <span class="interval-label">[${iv[0]}, ${iv[1]}]</span>
                        <div class="interval-track">
                            <div class="${cls}" style="left: ${leftPct}%; width: ${widthPct}%;">
                                <span class="interval-bar-text">${iv[0]} → ${iv[1]}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            const mergedListHtml = merged.length > 0 ? `
                <div class="merged-intervals-box">
                    <span class="anim-aux-title">Consolidated Intervals So Far:</span>
                    <div class="merged-chips">
                        ${merged.map(m => `<span class="merged-chip">[${m[0]}, ${m[1]}]</span>`).join('')}
                    </div>
                </div>
            ` : '';

            return `
                <div class="anim-visual-block">
                    <span class="anim-block-label">${escapeHtml(label)}</span>
                    <div class="intervals-container">
                        ${intervalBars}
                    </div>
                    ${mergedListHtml}
                </div>
            `;
        },

        /**
         * 13. Bit Manipulation Visualizer (Registers & Masks)
         */
        renderBitwise({ num = 0, binaryStr = '', maskStr = '', operation = '', resultStr = '', resultNum = 0, label = 'Bitwise Register Operations' }) {
            const bin = binaryStr || (num >>> 0).toString(2).padStart(8, '0');
            const bits = bin.split('');

            const bitCells = bits.map((b, idx) => {
                const bitIndex = bits.length - 1 - idx;
                const isSet = b === '1';
                return `
                    <div class="bit-cell ${isSet ? 'bit-set' : 'bit-zero'}">
                        <span class="bit-val">${b}</span>
                        <span class="bit-pos">${bitIndex}</span>
                    </div>
                `;
            }).join('');

            return `
                <div class="anim-visual-block">
                    <span class="anim-block-label">${escapeHtml(label)}</span>
                    <div class="bitwise-register-wrap">
                        <div class="register-label">Input Value: <strong>${escapeHtml(num)}</strong></div>
                        <div class="bitwise-cells-row">
                            ${bitCells}
                        </div>
                    </div>
                    ${operation ? `
                        <div class="bitwise-op-banner">
                            <span>Operation: <strong>${escapeHtml(operation)}</strong></span>
                            ${maskStr ? `<span>Mask: <code>${escapeHtml(maskStr)}</code></span>` : ''}
                            ${resultStr ? `<span>Result: <code>${escapeHtml(resultStr)}</code> (${resultNum})</span>` : ''}
                        </div>
                    ` : ''}
                </div>
            `;
        },

        /**
         * 14. Binary Heap (Min/Max Heap) Visualizer
         */
        renderHeap({ heap = [], heapType = 'Min-Heap', activeIndices = [], swappedIndices = [], label = 'Binary Heap State' }) {
            const cells = heap.map((val, idx) => {
                let cls = 'heap-cell';
                if (activeIndices.includes(idx)) cls += ' active';
                if (swappedIndices.includes(idx)) cls += ' swapped';
                const parentIdx = idx > 0 ? Math.floor((idx - 1) / 2) : 'root';
                return `
                    <div class="heap-col">
                        <div class="${cls}">${escapeHtml(val)}</div>
                        <span class="heap-sub">i=${idx} (p:${parentIdx})</span>
                    </div>
                `;
            }).join('');

            return `
                <div class="anim-visual-block">
                    <span class="anim-block-label">${escapeHtml(label)} (${escapeHtml(heapType)})</span>
                    <div class="heap-array-wrap">
                        ${cells}
                    </div>
                    <div class="heap-property-note">
                        <span>Root Property: <strong>${heap.length ? heap[0] : 'empty'}</strong> is the current ${heapType.includes('Min') ? 'minimum' : 'maximum'} element in O(1).</span>
                    </div>
                </div>
            `;
        },

        /**
         * 15. Recursion & Backtracking Call Stack Visualizer
         */
        renderRecursion({ callStack = [], currentParams = {}, currentResult = null, decisionPath = [], label = 'Recursion Call Tree & Frames' }) {
            const framesHtml = callStack.map((frame, idx) => {
                const isCurrent = idx === callStack.length - 1;
                return `
                    <div class="recursion-frame ${isCurrent ? 'frame-current' : ''}">
                        <div class="frame-hdr">
                            <span class="frame-depth">Depth ${idx}</span>
                            <span class="frame-fn">${escapeHtml(frame.name || 'fn')}(${escapeHtml(frame.args || '')})</span>
                        </div>
                        <div class="frame-body">
                            <span>State: <strong>${escapeHtml(frame.state || 'evaluating')}</strong></span>
                            ${frame.returnVal !== undefined ? `<span>Return: <code>${escapeHtml(frame.returnVal)}</code></span>` : ''}
                        </div>
                    </div>
                `;
            }).join('');

            const pathHtml = decisionPath.length > 0 ? `
                <div class="decision-path-bar">
                    <span class="anim-aux-title">Decision Branch:</span>
                    <div class="decision-chips">
                        ${decisionPath.map((d, i) => `<span class="decision-chip">${i + 1}: ${escapeHtml(d)}</span>`).join(' → ')}
                    </div>
                </div>
            ` : '';

            return `
                <div class="anim-visual-block">
                    <span class="anim-block-label">${escapeHtml(label)}</span>
                    <div class="recursion-frames-container">
                        ${framesHtml}
                    </div>
                    ${pathHtml}
                </div>
            `;
        },

        /**
         * 16. Dual-Graph Clone Visualizer (Original Graph vs Cloned Deep Copy)
         * Supports BFS and DFS graph cloning with explicit mapping table and frontier tracking.
         */
        renderCloneGraph({
            originalNodes = [
                { id: 1, val: 1, x: 100, y: 75 },
                { id: 2, val: 2, x: 220, y: 75 },
                { id: 3, val: 3, x: 220, y: 175 },
                { id: 4, val: 4, x: 100, y: 175 }
            ],
            originalEdges = [
                { u: 1, v: 2 },
                { u: 2, v: 3 },
                { u: 3, v: 4 },
                { u: 4, v: 1 }
            ],
            clonedNodes = [],
            clonedEdges = [],
            activeOriginal = null,
            activeCloned = null,
            activeEdge = null,
            visitedMap = [],
            frontier = [],
            frontierType = 'Queue (FIFO)',
            actionBanner = '',
            label = 'Clone Graph: Dual Graph Construction & Mapping'
        }) {
            // Default layout coordinates for cloned nodes
            const defaultCloneCoords = {
                1: { x: 440, y: 75 },
                2: { x: 560, y: 75 },
                3: { x: 560, y: 175 },
                4: { x: 440, y: 175 }
            };

            // Original Edges
            const origEdgeElements = originalEdges.map(e => {
                const u = originalNodes.find(n => n.id === e.u);
                const v = originalNodes.find(n => n.id === e.v);
                if (!u || !v) return '';
                const isActive = activeEdge && ((activeEdge.u === e.u && activeEdge.v === e.v) || (activeEdge.u === e.v && activeEdge.v === e.u));
                const isTraversed = visitedMap.some(m => m.original === e.u) && visitedMap.some(m => m.original === e.v);
                let cls = 'graph-edge';
                if (isActive) cls += ' active-edge';
                else if (isTraversed) cls += ' traversed';
                return `<line x1="${u.x}" y1="${u.y}" x2="${v.x}" y2="${v.y}" class="${cls}" />`;
            }).join('');

            // Original Vertices
            const origVertexElements = originalNodes.map(v => {
                const isActive = v.id === activeOriginal;
                const isVisited = visitedMap.some(m => m.original === v.id);
                let cls = 'graph-vertex';
                if (isActive) cls += ' active';
                else if (isVisited) cls += ' visited';
                return `
                    <g class="graph-vertex-group" data-id="${v.id}">
                        <circle cx="${v.x}" cy="${v.y}" r="22" class="${cls}" />
                        <text x="${v.x}" y="${v.y + 6}" class="graph-vertex-text" text-anchor="middle">${escapeHtml(v.val || v.id)}</text>
                    </g>
                `;
            }).join('');

            // Cloned Edges
            const cloneEdgeElements = clonedEdges.map(e => {
                const uCoords = defaultCloneCoords[e.u];
                const vCoords = defaultCloneCoords[e.v];
                if (!uCoords || !vCoords) return '';
                return `<line x1="${uCoords.x}" y1="${uCoords.y}" x2="${vCoords.x}" y2="${vCoords.y}" class="graph-edge clone-edge traversed" />`;
            }).join('');

            // Cloned Vertices
            const cloneVertexElements = clonedNodes.map(cn => {
                const id = typeof cn === 'object' ? cn.id : cn;
                const val = typeof cn === 'object' && cn.val ? cn.val : `${id}'`;
                const coords = defaultCloneCoords[id] || { x: 440, y: 120 };
                const isActive = id === activeCloned;
                return `
                    <g class="graph-vertex-group clone-group" data-id="${id}">
                        <circle cx="${coords.x}" cy="${coords.y}" r="22" class="graph-vertex clone-vertex ${isActive ? 'active' : 'created'}" />
                        <text x="${coords.x}" y="${coords.y + 6}" class="graph-vertex-text clone-vertex-text" text-anchor="middle">${escapeHtml(val)}</text>
                    </g>
                `;
            }).join('');

            // Frontier chips
            const frontierChips = frontier.length > 0
                ? frontier.map(f => `<span class="chip-frontier">${escapeHtml(f)}</span>`).join('')
                : `<span class="chip-empty">Empty (${frontierType.includes('Queue') ? 'Queue depleted' : 'Stack unwound'})</span>`;

            // Visited map list
            const mapChips = visitedMap.length > 0
                ? visitedMap.map(m => {
                    const isActive = m.original === activeOriginal;
                    return `
                        <div class="clone-map-chip ${isActive ? 'map-chip-active' : ''}">
                            <span class="k-orig">Original Node ${escapeHtml(m.original)}</span>
                            <span class="map-arrow">➔</span>
                            <span class="v-clone">Clone Node ${escapeHtml(m.clone || m.original + "'")}</span>
                        </div>
                    `;
                }).join('')
                : `<span class="chip-empty">Empty map — 0 clones created</span>`;

            return `
                <div class="anim-visual-block anim-clone-graph-block">
                    <span class="anim-block-label">${escapeHtml(label)}</span>
                    <div class="anim-dual-graph-canvas-wrap">
                        <svg class="anim-dual-graph-svg" viewBox="0 0 660 230" width="100%" height="230" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="origEdgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stop-color="#4F46E5" stop-opacity="0.7"/>
                                    <stop offset="100%" stop-color="#06B6D4" stop-opacity="0.7"/>
                                </linearGradient>
                            </defs>

                            <!-- Left: Original Graph Panel -->
                            <g class="graph-panel-orig">
                                <text x="160" y="24" class="graph-panel-title" text-anchor="middle">Original Graph (G)</text>
                                <g class="graph-edges-layer">${origEdgeElements}</g>
                                <g class="graph-nodes-layer">${origVertexElements}</g>
                            </g>

                            <!-- Center: Divider & Flow Indicator -->
                            <g class="graph-panel-divider">
                                <line x1="330" y1="36" x2="330" y2="210" class="graph-divider-line" />
                                <rect x="290" y="105" width="80" height="26" rx="13" class="graph-divider-pill-bg" />
                                <text x="330" y="122" class="graph-divider-pill-text" text-anchor="middle">clone ➔</text>
                            </g>

                            <!-- Right: Cloned Graph Panel -->
                            <g class="graph-panel-clone">
                                <text x="500" y="24" class="graph-panel-title clone-title" text-anchor="middle">Cloned Deep Copy (G')</text>
                                <g class="graph-edges-layer">${cloneEdgeElements}</g>
                                <g class="graph-nodes-layer">${cloneVertexElements}</g>
                                ${clonedNodes.length === 0 ? '<text x="500" y="125" class="graph-empty-note" text-anchor="middle">(No clones created yet)</text>' : ''}
                            </g>
                        </svg>
                    </div>

                    <!-- Auxiliary Data Panels: Frontier & Visited HashMap -->
                    <div class="anim-clone-meta-grid">
                        <div class="anim-meta-box">
                            <span class="anim-aux-title">Active Frontier: ${escapeHtml(frontierType)}</span>
                            <div class="anim-meta-chips">
                                ${frontierChips}
                            </div>
                        </div>
                        <div class="anim-meta-box">
                            <span class="anim-aux-title">Auxiliary Registry: Map&lt;Node, Node&gt; visited (${visitedMap.length}/4)</span>
                            <div class="clone-map-chips-list">
                                ${mapChips}
                            </div>
                        </div>
                    </div>

                    ${actionBanner ? `
                        <div class="anim-status-banner">
                            <span class="anim-status-key">Step Operation:</span>
                            <strong class="anim-status-val">${escapeHtml(actionBanner)}</strong>
                        </div>
                    ` : ''}
                </div>
            `;
        },

        /**
         * 17. Educational Fallback Visualizer
         * Displays a clearly labelled educational card when a problem does not yet have
         * an authentic specialized visualizer or requires future curriculum synthesis.
         */
        renderFallback({
            title = 'Algorithm Visualization In Development',
            message = 'A specialized interactive animation for this problem is currently in progress by the CodeArena curriculum team.',
            topic = 'Algorithmic DSA',
            pattern = 'Standard Pattern',
            problemId = ''
        } = {}) {
            return `
                <div class="anim-visual-block anim-fallback-block">
                    <div class="anim-fallback-card">
                        <div class="anim-fallback-header">
                            <span class="anim-fallback-badge">Curriculum Transparency</span>
                            <span class="anim-fallback-phase">Category C · Honest Fallback</span>
                        </div>
                        <h3 class="anim-fallback-title">${escapeHtml(title)}</h3>
                        <p class="anim-fallback-description">${escapeHtml(message)}</p>
                        <div class="anim-fallback-metadata">
                            <div class="anim-fallback-chip">
                                <span class="chip-label">Domain:</span>
                                <span class="chip-val">${escapeHtml(topic)}</span>
                            </div>
                            <div class="anim-fallback-chip">
                                <span class="chip-label">Pattern:</span>
                                <span class="chip-val">${escapeHtml(pattern)}</span>
                            </div>
                            ${problemId ? `
                            <div class="anim-fallback-chip">
                                <span class="chip-label">Canonical ID:</span>
                                <span class="chip-val"><code>#${escapeHtml(problemId)}</code></span>
                            </div>
                            ` : ''}
                        </div>
                        <div class="anim-fallback-notice">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="notice-icon">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            <span>Algorithmic Integrity Guarantee: CodeArena never displays invented steps or misleading generic fallbacks for specialized challenges.</span>
                        </div>
                    </div>
                </div>
            `;
        }
    };

    window.CodeArenaVisualizers = Visualizers;
})();

