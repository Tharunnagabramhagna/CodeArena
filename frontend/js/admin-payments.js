/**
 * CodeArena — Administrative Payment Verification Controller
 */

(function () {
    'use strict';

    let currentOrders = [];
    let currentFilter = 'PENDING_VERIFICATION';
    let targetOrder = null;

    document.addEventListener('DOMContentLoaded', function () {
        initAdminPaymentsPage();
    });

    async function initAdminPaymentsPage() {
        // Enforce admin access
        const hasAccess = await verifyAdminAccess();
        if (!hasAccess) return;

        setupTabListeners();
        setupModalListeners();
        await loadOrders();

        const btnRefresh = document.getElementById('btnRefreshOrders');
        if (btnRefresh) {
            btnRefresh.addEventListener('click', loadOrders);
        }
    }

    async function verifyAdminAccess() {
        if (!window.CodeArenaAPI || !window.CodeArenaAPI.authService) {
            showError('API client not available.');
            return false;
        }

        try {
            const userRes = await window.CodeArenaAPI.authService.getCurrentUser();
            const user = (userRes && userRes.data) ? userRes.data : userRes;
            if (!user || (!user.id && !user.userId)) {
                renderAccessDenied('You must be signed in with administrator credentials.');
                return false;
            }

            const isAdmin = user.role === 'ADMIN' || user.role_id === 3 || user.roleId === 3;
            if (!isAdmin) {
                renderAccessDenied('Administrator privileges are required to view this verification portal.');
                return false;
            }

            return true;
        } catch (err) {
            renderAccessDenied('Failed to authenticate administrative session.');
            return false;
        }
    }

    function renderAccessDenied(msg) {
        const wrap = document.querySelector('.admin-page-wrap');
        if (wrap) {
            wrap.innerHTML = `
                <div style="text-align: center; padding: 60px 20px;">
                    <div style="font-size: 3rem; margin-bottom: 16px;">🔒</div>
                    <h2 style="font-size: 1.8rem; margin-bottom: 8px; color: var(--color-text-primary);">Access Restricted</h2>
                    <p style="color: var(--color-text-secondary); max-width: 500px; margin: 0 auto 24px;">${escapeHtml(msg)}</p>
                    <a href="dashboard.html" class="btn btn-primary" style="padding: 10px 24px; text-decoration: none; border-radius: 8px;">Return to Dashboard</a>
                </div>
            `;
        }
    }

    function setupTabListeners() {
        const tabs = document.querySelectorAll('.admin-tab-btn');
        tabs.forEach(btn => {
            btn.addEventListener('click', function () {
                tabs.forEach(t => t.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.filter || 'ALL';
                renderTable();
            });
        });
    }

    async function loadOrders() {
        const tbody = document.getElementById('ordersTableBody');
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="8" class="empty-state">Loading payment records...</td></tr>`;
        }

        try {
            const res = await window.CodeArenaAPI.paymentService.adminGetAllOrders(100, 0, '');
            if (res && res.success && Array.isArray(res.data)) {
                currentOrders = res.data;
                updateStats();
                renderTable();
            } else {
                tbody.innerHTML = `<tr><td colspan="8" class="empty-state">No payment orders found.</td></tr>`;
            }
        } catch (err) {
            console.error('[AdminPayments] Failed to fetch orders:', err);
            tbody.innerHTML = `<tr><td colspan="8" class="empty-state" style="color: #ef4444;">Failed to load orders: ${escapeHtml(err.message)}</td></tr>`;
        }
    }

    function updateStats() {
        const pending = currentOrders.filter(o => o.status === 'PENDING_VERIFICATION').length;
        const approved = currentOrders.filter(o => o.status === 'APPROVED').length;
        const rejected = currentOrders.filter(o => o.status === 'REJECTED').length;

        const statPendingEl = document.getElementById('statPending');
        const statApprovedEl = document.getElementById('statApproved');
        const statRejectedEl = document.getElementById('statRejected');
        const tabCountPending = document.getElementById('tabCountPending');

        if (statPendingEl) statPendingEl.textContent = String(pending);
        if (statApprovedEl) statApprovedEl.textContent = String(approved);
        if (statRejectedEl) statRejectedEl.textContent = String(rejected);
        if (tabCountPending) tabCountPending.textContent = String(pending);
    }

    function renderTable() {
        const tbody = document.getElementById('ordersTableBody');
        if (!tbody) return;

        let filtered = currentOrders;
        if (currentFilter !== 'ALL') {
            filtered = currentOrders.filter(o => o.status === currentFilter);
        }

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="empty-state">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <div>No orders in "${escapeHtml(currentFilter)}" state.</div>
                    </td>
                </tr>
            `;
            return;
        }

        let html = '';
        filtered.forEach(order => {
            const planDisplay = order.planId === 'annual' ? 'Annual Pro' : 'Monthly Pro';
            const amountDisplay = `₹${order.amountInr}`;
            const userName = order.userFullName || order.userUsername || ('User #' + order.userId);
            const userEmail = order.userEmail || '-';

            const statusBadge = getStatusBadge(order.status);
            const submittedDate = order.submittedAt ? formatDate(order.submittedAt) : (order.createdAt ? formatDate(order.createdAt) : '-');

            const hasReceipt = Boolean(order.receiptStoredPath || order.receiptFilename);
            const receiptCell = hasReceipt ? `
                <button type="button" class="btn-receipt btn-view-receipt" data-order-id="${order.id}" data-order-ref="${escapeHtml(order.orderReference)}">
                    📎 View Receipt
                </button>
            ` : `<span style="color: var(--color-text-muted); font-size: 0.78rem;">None</span>`;

            let actionCell = '';
            if (order.status === 'PENDING_VERIFICATION') {
                actionCell = `
                    <button type="button" class="btn-table-action btn-approve btn-action-approve" data-order-id="${order.id}">Approve</button>
                    <button type="button" class="btn-table-action btn-reject btn-action-reject" data-order-id="${order.id}">Reject</button>
                `;
            } else if (order.status === 'APPROVED') {
                actionCell = `<span style="color: #10b981; font-size: 0.78rem; font-weight: 600;">✓ Approved</span>`;
            } else if (order.status === 'REJECTED') {
                actionCell = `<span style="color: #ef4444; font-size: 0.78rem; font-weight: 600;">✕ Rejected</span>`;
            } else {
                actionCell = `<span style="color: var(--color-text-muted); font-size: 0.78rem;">Awaiting UTR</span>`;
            }

            html += `
                <tr data-order-id="${order.id}">
                    <td>
                        <div class="user-col-name">${escapeHtml(userName)}</div>
                        <div class="user-col-email">${escapeHtml(userEmail)}</div>
                    </td>
                    <td>
                        <div><code style="color: #60a5fa; font-size: 0.82rem;">${escapeHtml(order.orderReference)}</code></div>
                        <div style="color: var(--color-text-muted); font-size: 0.75rem;">ID: #${order.id}</div>
                    </td>
                    <td>
                        <strong>${escapeHtml(planDisplay)}</strong>
                        <div style="color: #10b981; font-size: 0.8rem; font-weight: 600;">${escapeHtml(amountDisplay)}</div>
                    </td>
                    <td>
                        ${order.utrNumber ? `<code style="color: #f59e0b; font-weight: 600;">${escapeHtml(order.utrNumber)}</code>` : '<span style="color: var(--color-text-muted);">-</span>'}
                    </td>
                    <td>${receiptCell}</td>
                    <td style="font-size: 0.8rem; color: var(--color-text-secondary);">${escapeHtml(submittedDate)}</td>
                    <td>${statusBadge}</td>
                    <td>${actionCell}</td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
        attachTableActionListeners();
    }

    function attachTableActionListeners() {
        // Approve buttons
        document.querySelectorAll('.btn-action-approve').forEach(btn => {
            btn.addEventListener('click', function () {
                const orderId = Number(btn.dataset.orderId);
                const order = currentOrders.find(o => o.id === orderId);
                if (order) openApproveModal(order);
            });
        });

        // Reject buttons
        document.querySelectorAll('.btn-action-reject').forEach(btn => {
            btn.addEventListener('click', function () {
                const orderId = Number(btn.dataset.orderId);
                const order = currentOrders.find(o => o.id === orderId);
                if (order) openRejectModal(order);
            });
        });

        // View receipt buttons
        document.querySelectorAll('.btn-view-receipt').forEach(btn => {
            btn.addEventListener('click', function () {
                const orderId = Number(btn.dataset.orderId);
                const orderRef = btn.dataset.orderRef;
                openReceiptModal(orderId, orderRef);
            });
        });
    }

    function setupModalListeners() {
        // Approve modal
        const btnCancelApprove = document.getElementById('btnCancelApprove');
        if (btnCancelApprove) {
            btnCancelApprove.addEventListener('click', () => {
                document.getElementById('adminApproveModal').style.display = 'none';
            });
        }

        const btnConfirmApprove = document.getElementById('btnConfirmApprove');
        if (btnConfirmApprove) {
            btnConfirmApprove.addEventListener('click', executeApproval);
        }

        // Reject modal
        const btnCancelReject = document.getElementById('btnCancelReject');
        if (btnCancelReject) {
            btnCancelReject.addEventListener('click', () => {
                document.getElementById('adminRejectModal').style.display = 'none';
            });
        }

        const btnConfirmReject = document.getElementById('btnConfirmReject');
        if (btnConfirmReject) {
            btnConfirmReject.addEventListener('click', executeRejection);
        }

        // Receipt modal
        const btnCloseReceipt = document.getElementById('btnCloseReceiptPreview');
        if (btnCloseReceipt) {
            btnCloseReceipt.addEventListener('click', () => {
                document.getElementById('receiptPreviewModal').style.display = 'none';
            });
        }
    }

    function openApproveModal(order) {
        targetOrder = order;
        const modal = document.getElementById('adminApproveModal');
        if (!modal) return;

        const userName = order.userFullName || order.userUsername || ('User #' + order.userId);
        const userEmail = order.userEmail ? ` (${order.userEmail})` : '';

        document.getElementById('approveModalOrderRef').textContent = `${order.orderReference} (ID: #${order.id})`;
        document.getElementById('approveModalUser').textContent = `${userName}${userEmail}`;
        document.getElementById('approveModalPlan').textContent = order.planId === 'annual' ? 'Annual Pro' : 'Monthly Pro';
        document.getElementById('approveModalAmount').textContent = `₹${order.amountInr}`;
        document.getElementById('approveModalUtr').textContent = order.utrNumber || 'None';
        document.getElementById('approveModalDate').textContent = order.submittedAt ? formatDate(order.submittedAt) : (order.createdAt ? formatDate(order.createdAt) : '-');
        document.getElementById('approveAdminNotes').value = '';

        const receiptRow = document.getElementById('approveModalReceiptRow');
        const receiptVal = document.getElementById('approveModalReceiptVal');
        if (receiptRow && receiptVal) {
            if (order.receiptStoredPath || order.receiptFilename) {
                receiptRow.style.display = 'flex';
                receiptVal.innerHTML = `<button type="button" class="btn-receipt btn-modal-view-receipt" data-order-id="${order.id}" data-order-ref="${escapeHtml(order.orderReference)}">📎 View Receipt</button>`;
                receiptVal.querySelector('.btn-modal-view-receipt').addEventListener('click', () => {
                    openReceiptModal(order.id, order.orderReference);
                });
            } else {
                receiptRow.style.display = 'none';
            }
        }

        modal.style.display = 'flex';
    }

    async function executeApproval() {
        if (!targetOrder) return;
        const notes = document.getElementById('approveAdminNotes').value.trim();
        const btn = document.getElementById('btnConfirmApprove');
        btn.classList.add('btn-loading');

        try {
            const res = await window.CodeArenaAPI.paymentService.adminApproveOrder(targetOrder.id, notes);
            if (!res || !res.success) {
                throw new Error((res && (res.message || res.error)) || 'Failed to approve order.');
            }

            showSuccess('Payment order approved! Pro subscription activated.');
            document.getElementById('adminApproveModal').style.display = 'none';
            await loadOrders();
        } catch (err) {
            console.error('[AdminPayments] Approval failure:', err);
            showError(err.message || 'Error approving order.');
        } finally {
            btn.classList.remove('btn-loading');
        }
    }

    function openRejectModal(order) {
        targetOrder = order;
        const modal = document.getElementById('adminRejectModal');
        if (!modal) return;

        const userName = order.userFullName || order.userUsername || ('User #' + order.userId);
        const userEmail = order.userEmail ? ` (${order.userEmail})` : '';
        const planName = order.planId === 'annual' ? 'Annual Pro' : 'Monthly Pro';

        document.getElementById('rejectModalOrderRef').textContent = `${order.orderReference} (ID: #${order.id})`;
        document.getElementById('rejectModalUser').textContent = `${userName}${userEmail}`;
        document.getElementById('rejectModalPlanAmount').textContent = `${planName} — ₹${order.amountInr}`;
        document.getElementById('rejectModalUtr').textContent = order.utrNumber || 'None';
        document.getElementById('rejectModalDate').textContent = order.submittedAt ? formatDate(order.submittedAt) : (order.createdAt ? formatDate(order.createdAt) : '-');
        document.getElementById('rejectReasonInput').value = '';

        modal.style.display = 'flex';
    }

    async function executeRejection() {
        if (!targetOrder) return;
        const reasonInput = document.getElementById('rejectReasonInput');
        const reason = reasonInput ? reasonInput.value.trim() : '';

        if (!reason) {
            showError('Please provide a reason for rejecting the payment.');
            if (reasonInput) reasonInput.focus();
            return;
        }

        const btn = document.getElementById('btnConfirmReject');
        btn.classList.add('btn-loading');

        try {
            const res = await window.CodeArenaAPI.paymentService.adminRejectOrder(targetOrder.id, reason);
            if (!res || !res.success) {
                throw new Error((res && (res.message || res.error)) || 'Failed to reject order.');
            }

            showSuccess('Payment order rejected.');
            document.getElementById('adminRejectModal').style.display = 'none';
            await loadOrders();
        } catch (err) {
            console.error('[AdminPayments] Rejection failure:', err);
            showError(err.message || 'Error rejecting order.');
        } finally {
            btn.classList.remove('btn-loading');
        }
    }

    function openReceiptModal(orderId, orderRef) {
        const modal = document.getElementById('receiptPreviewModal');
        const img = document.getElementById('receiptPreviewImage');
        const sub = document.getElementById('receiptPreviewSubtitle');
        if (!modal || !img) return;

        sub.textContent = `Order: ${orderRef}`;
        img.src = window.CodeArenaAPI.paymentService.adminGetReceiptUrl(orderId);
        modal.style.display = 'flex';
    }

    function getStatusBadge(status) {
        switch (status) {
            case 'PENDING_VERIFICATION':
                return `<span class="receipt-badge-pending">PENDING</span>`;
            case 'APPROVED':
                return `<span class="receipt-badge-active">APPROVED</span>`;
            case 'REJECTED':
                return `<span class="receipt-badge-rejected">REJECTED</span>`;
            default:
                return `<span style="font-size:0.75rem; color:var(--color-text-muted); font-weight:600;">CREATED</span>`;
        }
    }

    function formatDate(ts) {
        try {
            const d = new Date(ts);
            return d.toLocaleString(undefined, {
                month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
        } catch (e) {
            return String(ts);
        }
    }

    function showSuccess(msg) {
        if (window.CodeArenaToast && typeof window.CodeArenaToast.success === 'function') {
            window.CodeArenaToast.success(msg);
        } else {
            console.log('[Toast Success]', msg);
            fallbackToast(msg, 'success');
        }
    }

    function showError(msg) {
        if (window.CodeArenaToast && typeof window.CodeArenaToast.error === 'function') {
            window.CodeArenaToast.error(msg);
        } else {
            console.error('[Toast Error]', msg);
            fallbackToast(msg, 'error');
        }
    }

    function fallbackToast(msg, type) {
        let container = document.getElementById('codearenaToastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'codearenaToastContainer';
            container.className = 'codearena-toast-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = `codearena-toast toast-${type} show`;
        toast.innerHTML = `<span class="toast-message">${escapeHtml(msg)}</span>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 250);
        }, 3500);
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
})();
