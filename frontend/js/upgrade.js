/**
 * CodeArena — Direct UPI Payment & Manual Verification Flow
 * Discontinues Razorpay and handles:
 * - Dynamic QR code generation for UPI deep-links
 * - 12-digit UTR reference and receipt uploads
 * - Client-side state tracking for pending administrator approvals
 */

(function () {
    'use strict';

    let currentOrder = null;
    let upiConfig = null;
    let qrCodeInstance = null;

    document.addEventListener('DOMContentLoaded', function () {
        initUpgradePage();
    });

    async function initUpgradePage() {
        // Load UPI payment configuration
        await loadPaymentConfig();

        // Check active subscription status and render banner if Pro
        await checkAndRenderActiveSubscription();

        // Check and render payment history & order status
        await loadUserPaymentHistory();

        // Highlight plan from URL param if present
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const requestedPlan = urlParams.get('plan');
            if (requestedPlan === 'annual') {
                const annualCard = document.getElementById('cardPlanAnnual');
                if (annualCard) {
                    annualCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    annualCard.style.outline = '2px solid #f59e0b';
                }
            } else if (requestedPlan === 'monthly') {
                const monthlyCard = document.getElementById('cardPlanMonthly');
                if (monthlyCard) {
                    monthlyCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    monthlyCard.style.outline = '2px solid #3b82f6';
                }
            }
        } catch (ignored) {}

        // Attach plan selection listeners
        const btnMonthly = document.getElementById('btnSelectMonthly');
        const btnAnnual = document.getElementById('btnSelectAnnual');

        if (btnMonthly) {
            btnMonthly.addEventListener('click', function () {
                startUpiCheckout('monthly', btnMonthly);
            });
        }

        if (btnAnnual) {
            btnAnnual.addEventListener('click', function () {
                startUpiCheckout('annual', btnAnnual);
            });
        }

        const btnRefreshHist = document.getElementById('btnRefreshHistory');
        if (btnRefreshHist) {
            btnRefreshHist.addEventListener('click', function () {
                loadUserPaymentHistory();
                checkAndRenderActiveSubscription();
            });
        }

        // Attach modal action listeners
        setupModalListeners();
    }

    async function loadPaymentConfig() {
        if (!window.CodeArenaAPI || !window.CodeArenaAPI.paymentService) return;
        try {
            const res = await window.CodeArenaAPI.paymentService.getConfig();
            if (res && res.success && res.data) {
                upiConfig = res.data;
                const monthlyTag = document.getElementById('inrTagMonthly');
                const annualTag = document.getElementById('inrTagAnnual');
                if (monthlyTag && upiConfig.monthlyPriceInr) {
                    monthlyTag.textContent = `₹${upiConfig.monthlyPriceInr} (Direct UPI)`;
                }
                if (annualTag && upiConfig.annualPriceInr) {
                    annualTag.textContent = `₹${upiConfig.annualPriceInr.toLocaleString('en-IN')} (Direct UPI)`;
                }

                if (!upiConfig.upiConfigured) {
                    const configMsg = upiConfig.configurationMessage || 'Direct UPI payments are currently disabled: Merchant UPI ID is not configured. Please contact the administrator.';
                    renderUpiDisabledBanner(configMsg);
                    const btnMonthly = document.getElementById('btnSelectMonthly');
                    const btnAnnual = document.getElementById('btnSelectAnnual');
                    if (btnMonthly) {
                        btnMonthly.disabled = true;
                        btnMonthly.textContent = 'UPI Payments Disabled';
                        btnMonthly.title = configMsg;
                        btnMonthly.style.opacity = '0.6';
                        btnMonthly.style.cursor = 'not-allowed';
                    }
                    if (btnAnnual) {
                        btnAnnual.disabled = true;
                        btnAnnual.textContent = 'UPI Payments Disabled';
                        btnAnnual.title = configMsg;
                        btnAnnual.style.opacity = '0.6';
                        btnAnnual.style.cursor = 'not-allowed';
                    }
                }
            }
        } catch (err) {
            console.warn('[Upgrade] Failed to load payment configuration:', err);
        }
    }

    async function checkAndRenderActiveSubscription() {
        if (!window.CodeArenaAPI || !window.CodeArenaAPI.authService) return;

        try {
            const userRes = await window.CodeArenaAPI.authService.getCurrentUser();
            const user = (userRes && userRes.data) ? userRes.data : userRes;
            if (!user || (!user.id && !user.userId)) return;

            let subData = null;
            if (window.CodeArenaAPI.paymentService) {
                const subRes = await window.CodeArenaAPI.paymentService.getSubscription();
                if (subRes && subRes.success && subRes.data) {
                    subData = subRes.data;
                }
            }

            const isPro = (subData && subData.hasActiveSubscription) ||
                          (user.plan && (user.plan === 'monthly' || user.plan === 'annual' || user.plan === 'pro'));

            if (isPro) {
                renderProBanner(user, subData);
            }
        } catch (err) {
            console.warn('[Upgrade] Could not load subscription status:', err);
        }
    }

    function renderProBanner(user, subData) {
        const pricingWrap = document.querySelector('.pricing-section-wrap');
        if (!pricingWrap) return;

        const oldBanner = document.getElementById('proActiveBanner');
        if (oldBanner) oldBanner.remove();

        const isAnnual = (subData && subData.plan === 'annual') || user.plan === 'annual';
        const planName = isAnnual ? 'Annual Pro ($199/yr)' : 'Monthly Pro ($5/mo)';

        let expiryStr = '';
        const rawEndDate = (subData && subData.endDate) || (user && user.subscriptionEndDate);
        if (rawEndDate) {
            try {
                const d = new Date(rawEndDate);
                if (!isNaN(d.getTime())) {
                    expiryStr = ' • Active until ' + d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
                }
            } catch (ignored) {}
        }

        const banner = document.createElement('div');
        banner.id = 'proActiveBanner';
        banner.className = 'pro-active-banner';
        banner.innerHTML = `
            <div class="pro-active-info">
                <div class="pro-badge-crown">⭐</div>
                <div>
                    <h3 class="pro-active-title">CodeArena Pro Active (${escapeHtml(planName)})</h3>
                    <p class="pro-active-details">Your subscription is active and verified server-side${escapeHtml(expiryStr)}. All 50 curated Pro challenges and hints are unlocked.</p>
                </div>
            </div>
            <a href="problems.html" class="pro-active-action-btn">
                <span>Browse Pro Challenges →</span>
            </a>
        `;

        pricingWrap.parentNode.insertBefore(banner, pricingWrap);

        const activeBtn = isAnnual ? document.getElementById('btnSelectAnnual') : document.getElementById('btnSelectMonthly');
        if (activeBtn) {
            activeBtn.textContent = 'Current Plan (Active)';
            activeBtn.style.background = 'rgba(16, 185, 129, 0.2)';
            activeBtn.style.borderColor = 'rgba(16, 185, 129, 0.4)';
            activeBtn.style.color = '#10b981';
        }
    }

    async function loadUserPaymentHistory() {
        if (!window.CodeArenaAPI || !window.CodeArenaAPI.paymentService || !window.CodeArenaAPI.authService) return;
        const historySection = document.getElementById('userPaymentHistorySection');
        const tbody = document.getElementById('userOrdersTableBody');
        const pendingContainer = document.getElementById('upiPendingBannerContainer');

        try {
            const userRes = await window.CodeArenaAPI.authService.getCurrentUser();
            const user = (userRes && userRes.data) ? userRes.data : userRes;
            if (!user || (!user.id && !user.userId)) {
                if (historySection) historySection.style.display = 'none';
                return;
            }

            if (historySection) historySection.style.display = 'block';

            const res = await window.CodeArenaAPI.paymentService.getMyOrders();
            if (!res || !res.success || !Array.isArray(res.data) || res.data.length === 0) {
                if (tbody) {
                    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 24px; color: var(--color-text-secondary);">No previous payment orders found.</td></tr>`;
                }
                return;
            }

            const orders = res.data;

            // Check if there is an order pending verification
            const pending = orders.find(o => o.status === 'PENDING_VERIFICATION');
            // Check if most recent order was rejected (and no active subscription / pending)
            const latestOrder = orders[0];
            const isLatestRejected = latestOrder && latestOrder.status === 'REJECTED';

            if (pendingContainer) {
                if (pending) {
                    pendingContainer.innerHTML = `
                        <div class="upi-pending-banner">
                            <div class="upi-pending-info">
                                <div class="upi-pending-icon">⏳</div>
                                <div>
                                    <h4 class="upi-pending-title">Payment Verification in Progress</h4>
                                    <p class="upi-pending-desc">
                                        Order <strong>${escapeHtml(pending.orderReference)}</strong> (Submitted UTR: <code>${escapeHtml(pending.utrNumber || 'Submitted')}</code>) is awaiting manual administrator verification. Pro access will activate automatically once verified in our bank ledger.
                                    </p>
                                </div>
                            </div>
                        </div>
                    `;
                } else if (isLatestRejected && !user.isPro) {
                    const rejReason = latestOrder.adminNotes || latestOrder.rejectionReason || 'Transaction could not be verified in bank records';
                    pendingContainer.innerHTML = `
                        <div class="upi-pending-banner" style="background: rgba(239, 68, 68, 0.12); border-color: rgba(239, 68, 68, 0.35);">
                            <div class="upi-pending-info">
                                <div class="upi-pending-icon" style="background: rgba(239, 68, 68, 0.2); color: #ef4444;">✕</div>
                                <div>
                                    <h4 class="upi-pending-title" style="color: #ef4444;">Payment Verification Unsuccessful</h4>
                                    <p class="upi-pending-desc" style="color: var(--color-text-secondary);">
                                        Order <strong>${escapeHtml(latestOrder.orderReference)}</strong> (Submitted UTR: <code>${escapeHtml(latestOrder.utrNumber || 'N/A')}</code>) was rejected during verification.
                                        <br><strong>Administrator Reason:</strong> <span style="color: #ef4444; font-weight: 600;">${escapeHtml(rejReason)}</span>.
                                        <br>You may review payment details and initiate a new order anytime below.
                                    </p>
                                </div>
                            </div>
                        </div>
                    `;
                } else if (!upiConfig || upiConfig.upiConfigured !== false) {
                    pendingContainer.innerHTML = '';
                }
            }

            if (tbody) {
                let html = '';
                orders.forEach(order => {
                    const planName = order.planId === 'annual' ? 'Annual Pro' : 'Monthly Pro';
                    const amountDisplay = `₹${order.amountInr}`;
                    const dateDisplay = order.submittedAt ? formatDate(order.submittedAt) : (order.createdAt ? formatDate(order.createdAt) : '-');

                    let statusBadge = '';
                    let statusNote = '';
                    if (order.status === 'PENDING_VERIFICATION') {
                        statusBadge = `<span class="receipt-badge-pending">⏳ PENDING VERIFICATION</span>`;
                        statusNote = `<div style="font-size: 0.75rem; color: var(--color-text-secondary); margin-top: 3px;">Awaiting administrator bank ledger check</div>`;
                    } else if (order.status === 'APPROVED') {
                        statusBadge = `<span class="receipt-badge-active">✓ APPROVED &amp; ACTIVE</span>`;
                        statusNote = `<div style="font-size: 0.75rem; color: #10b981; margin-top: 3px;">Pro subscription active</div>`;
                    } else if (order.status === 'REJECTED') {
                        const reasonText = order.adminNotes || order.rejectionReason || 'Verification rejected';
                        statusBadge = `<span class="receipt-badge-rejected">✕ REJECTED</span>`;
                        statusNote = `<div style="font-size: 0.75rem; color: #ef4444; margin-top: 3px; font-weight: 500;">Reason: ${escapeHtml(reasonText)}</div>`;
                    } else {
                        statusBadge = `<span style="font-size: 0.75rem; color: var(--color-text-muted); font-weight: 600;">CREATED</span>`;
                        statusNote = `<div style="font-size: 0.75rem; color: var(--color-text-secondary); margin-top: 3px;">Awaiting UTR submission</div>`;
                    }

                    html += `
                        <tr style="border-bottom: 1px solid var(--color-border, #334155);">
                            <td style="padding: 12px 16px;">
                                <div><code style="color: #60a5fa; font-weight: 600; font-size: 0.82rem;">${escapeHtml(order.orderReference)}</code></div>
                                <div style="color: var(--color-text-muted); font-size: 0.74rem;">Order #${order.id}</div>
                            </td>
                            <td style="padding: 12px 16px;">
                                <div><strong>${escapeHtml(planName)}</strong></div>
                                <div style="color: #10b981; font-weight: 600; font-size: 0.8rem;">${escapeHtml(amountDisplay)}</div>
                            </td>
                            <td style="padding: 12px 16px;">
                                ${order.utrNumber ? `<code style="color: #f59e0b; font-weight: 600;">${escapeHtml(order.utrNumber)}</code>` : '<span style="color: var(--color-text-muted); font-size: 0.8rem;">-</span>'}
                            </td>
                            <td style="padding: 12px 16px; font-size: 0.8rem; color: var(--color-text-secondary);">
                                ${escapeHtml(dateDisplay)}
                            </td>
                            <td style="padding: 12px 16px;">
                                ${statusBadge}
                                ${statusNote}
                            </td>
                        </tr>
                    `;
                });
                tbody.innerHTML = html;
            }
        } catch (err) {
            console.warn('[Upgrade] Failed to load payment history:', err);
        }
    }

    function checkAndRenderPendingOrders() {
        return loadUserPaymentHistory();
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

    function renderUpiDisabledBanner(msg) {
        const container = document.getElementById('upiPendingBannerContainer');
        if (!container) return;
        container.innerHTML = `
            <div class="upi-pending-banner" style="background: rgba(239, 68, 68, 0.12); border-color: rgba(239, 68, 68, 0.35);">
                <div class="upi-pending-info">
                    <div class="upi-pending-icon" style="background: rgba(239, 68, 68, 0.2); color: #ef4444;">⚠️</div>
                    <div>
                        <h4 class="upi-pending-title" style="color: #ef4444;">Direct UPI Payments Disabled</h4>
                        <p class="upi-pending-desc" style="color: var(--color-text-secondary);">${escapeHtml(msg)}</p>
                    </div>
                </div>
            </div>
        `;
    }

    function selectPlanCard(planId) {
        const monthlyCard = document.getElementById('cardPlanMonthly');
        const annualCard = document.getElementById('cardPlanAnnual');
        if (planId === 'monthly') {
            if (monthlyCard) {
                monthlyCard.classList.add('card-selected-plan');
                monthlyCard.setAttribute('aria-selected', 'true');
            }
            if (annualCard) {
                annualCard.classList.remove('card-selected-plan');
                annualCard.setAttribute('aria-selected', 'false');
            }
        } else if (planId === 'annual') {
            if (annualCard) {
                annualCard.classList.add('card-selected-plan');
                annualCard.setAttribute('aria-selected', 'true');
            }
            if (monthlyCard) {
                monthlyCard.classList.remove('card-selected-plan');
                monthlyCard.setAttribute('aria-selected', 'false');
            }
        }
    }

    async function startUpiCheckout(planId, buttonEl) {
        selectPlanCard(planId);

        if (!window.CodeArenaAPI || !window.CodeArenaAPI.authService) {
            showToast('error', 'API client not initialized.');
            return;
        }

        const userRes = await window.CodeArenaAPI.authService.getCurrentUser();
        const user = (userRes && userRes.data) ? userRes.data : userRes;
        if (!user || (!user.id && !user.userId)) {
            showToast('warning', 'Please sign in or create an account to activate CodeArena Pro.');
            if (window.CodeArenaAuthModal && typeof window.CodeArenaAuthModal.open === 'function') {
                window.CodeArenaAuthModal.open('login');
            } else {
                window.location.href = 'login.html?redirect=upgrade.html';
            }
            return;
        }

        if (upiConfig && !upiConfig.upiConfigured) {
            const configMsg = upiConfig.configurationMessage || 'Direct UPI payments are currently disabled: Merchant UPI ID is not configured.';
            showToast('error', configMsg);
            renderUpiDisabledBanner(configMsg);
            return;
        }

        const originalText = buttonEl.textContent;
        buttonEl.classList.add('btn-loading');

        try {
            const orderRes = await window.CodeArenaAPI.paymentService.createOrder(planId);
            if (!orderRes || !orderRes.success || !orderRes.data) {
                throw new Error((orderRes && orderRes.message) || (orderRes && orderRes.error) || 'Failed to initialize UPI payment order.');
            }

            currentOrder = orderRes.data;
            openUpiModal(currentOrder, planId);

        } catch (err) {
            console.error('[Upgrade] Order creation failure:', err);
            showToast('error', err.message || 'Unable to start checkout.');
        } finally {
            buttonEl.classList.remove('btn-loading');
            buttonEl.textContent = originalText;
        }
    }

    function openUpiModal(order, planId) {
        const modal = document.getElementById('upiPaymentModal');
        if (!modal) return;

        const isAnnual = planId === 'annual';
        const planDisplayName = isAnnual ? 'Annual Pro ($199/yr)' : 'Monthly Pro ($5/mo)';
        const amountStr = `₹${order.amountInr}.00`;

        document.getElementById('upiModalSubtitle').textContent = `Upgrade to ${planDisplayName} via UPI.`;

        // Update selected plan banner inside modal
        const planNameEl = document.getElementById('modalPlanDisplayName');
        if (planNameEl) {
            planNameEl.textContent = isAnnual ? 'Annual Pro ($199/year)' : 'Monthly Pro ($5/month)';
        }
        const priceBadgeEl = document.getElementById('modalPlanPriceBadge');
        if (priceBadgeEl) {
            priceBadgeEl.textContent = `₹${order.amountInr.toLocaleString('en-IN')} via UPI`;
        }

        document.getElementById('modalAmountInr').textContent = amountStr;
        document.getElementById('modalMerchantVpa').textContent = order.merchantUpiId || 'codearena@upi';
        document.getElementById('modalOrderRef').textContent = order.orderReference;

        // Configure Deep Link
        const deepLinkBtn = document.getElementById('btnUpiDeepLink');
        if (deepLinkBtn && order.upiUri) {
            deepLinkBtn.href = order.upiUri;
        }

        // Render QR Code
        const qrContainer = document.getElementById('upiQrCodeContainer');
        if (qrContainer && typeof QRCode !== 'undefined') {
            qrContainer.innerHTML = '';
            qrCodeInstance = new QRCode(qrContainer, {
                text: order.upiUri,
                width: 180,
                height: 180,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.M
            });
        }

        // Reset form fields
        document.getElementById('inputUtrNumber').value = '';
        const receiptInput = document.getElementById('inputReceiptFile');
        if (receiptInput) receiptInput.value = '';
        const notesInput = document.getElementById('inputUserNotes');
        if (notesInput) notesInput.value = '';

        modal.style.display = 'flex';
    }

    function setupModalListeners() {
        const payModal = document.getElementById('upiPaymentModal');
        const submittedModal = document.getElementById('upiSubmittedModal');

        // Close UPI Modal
        const btnClose = document.getElementById('btnCloseUpiModal');
        if (btnClose) {
            btnClose.addEventListener('click', function () {
                if (payModal) payModal.style.display = 'none';
            });
        }

        // Close Submitted Modal
        const btnCloseSubmitted = document.getElementById('btnCloseSubmittedModal');
        if (btnCloseSubmitted) {
            btnCloseSubmitted.addEventListener('click', function () {
                if (submittedModal) submittedModal.style.display = 'none';
                checkAndRenderPendingOrders();
            });
        }

        // Close modal on outside backdrop click
        if (payModal) {
            payModal.addEventListener('click', function (e) {
                if (e.target === payModal) {
                    payModal.style.display = 'none';
                }
            });
        }
        if (submittedModal) {
            submittedModal.addEventListener('click', function (e) {
                if (e.target === submittedModal) {
                    submittedModal.style.display = 'none';
                    checkAndRenderPendingOrders();
                }
            });
        }

        // Close modal on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                if (payModal && payModal.style.display === 'flex') {
                    payModal.style.display = 'none';
                }
                if (submittedModal && submittedModal.style.display === 'flex') {
                    submittedModal.style.display = 'none';
                    checkAndRenderPendingOrders();
                }
            }
        });

        // Copy buttons
        const copyAmountBtn = document.getElementById('btnCopyAmount');
        if (copyAmountBtn) {
            copyAmountBtn.addEventListener('click', function () {
                if (currentOrder) {
                    copyToClipboard(String(currentOrder.amountInr), 'Amount copied to clipboard');
                }
            });
        }

        const copyVpaBtn = document.getElementById('btnCopyVpa');
        if (copyVpaBtn) {
            copyVpaBtn.addEventListener('click', function () {
                if (currentOrder) {
                    copyToClipboard(currentOrder.merchantUpiId || 'codearena@upi', 'Merchant UPI ID copied');
                }
            });
        }

        const copyRefBtn = document.getElementById('btnCopyRef');
        if (copyRefBtn) {
            copyRefBtn.addEventListener('click', function () {
                if (currentOrder) {
                    copyToClipboard(currentOrder.orderReference, 'Order reference copied');
                }
            });
        }

        // Submit UTR form
        const submitBtn = document.getElementById('btnSubmitUtr');
        if (submitBtn) {
            submitBtn.addEventListener('click', handleUtrSubmission);
        }
    }

    async function handleUtrSubmission(e) {
        if (e && e.preventDefault) e.preventDefault();
        if (!currentOrder) {
            showToast('error', 'No active payment order found.');
            return;
        }

        const utrInput = document.getElementById('inputUtrNumber');
        const utrVal = utrInput ? utrInput.value.trim() : '';

        if (!utrVal) {
            showToast('error', 'Please enter your 12-digit UPI Reference / UTR number.');
            if (utrInput) utrInput.focus();
            return;
        }

        if (utrVal.length < 10 || utrVal.length > 24) {
            showToast('error', 'UPI Transaction Reference must be between 10 and 24 characters.');
            if (utrInput) utrInput.focus();
            return;
        }

        const receiptInput = document.getElementById('inputReceiptFile');
        const receiptFile = receiptInput && receiptInput.files && receiptInput.files[0] ? receiptInput.files[0] : null;

        const notesInput = document.getElementById('inputUserNotes');
        const userNotes = notesInput ? notesInput.value.trim() : '';

        const submitBtn = document.getElementById('btnSubmitUtr');
        submitBtn.classList.add('btn-loading');

        try {
            const res = await window.CodeArenaAPI.paymentService.submitUtr(
                currentOrder.orderReference,
                utrVal,
                receiptFile,
                userNotes
            );

            if (!res || !res.success) {
                throw new Error((res && (res.message || res.error)) || 'Failed to submit transaction reference.');
            }

            // Close payment modal
            const payModal = document.getElementById('upiPaymentModal');
            if (payModal) payModal.style.display = 'none';

            // Show Submitted Modal
            const submittedModal = document.getElementById('upiSubmittedModal');
            if (submittedModal) {
                document.getElementById('submittedOrderRef').textContent = currentOrder.orderReference;
                document.getElementById('submittedUtrVal').textContent = utrVal;
                document.getElementById('submittedPlanVal').textContent = `${currentOrder.planId === 'annual' ? 'Annual Pro' : 'Monthly Pro'} (₹${currentOrder.amountInr})`;
                submittedModal.style.display = 'flex';
            }

            showToast('success', 'UTR submitted successfully! Awaiting administrator verification.');
            checkAndRenderPendingOrders();

        } catch (err) {
            console.error('[Upgrade] UTR submission error:', err);
            showToast('error', err.message || 'Error submitting UTR.');
        } finally {
            submitBtn.classList.remove('btn-loading');
        }
    }

    function copyToClipboard(text, successMsg) {
        if (!navigator.clipboard) {
            showToast('info', text);
            return;
        }
        navigator.clipboard.writeText(text).then(() => {
            showToast('success', successMsg);
        }).catch(() => {
            showToast('info', text);
        });
    }

    function showToast(type, message) {
        if (window.CodeArenaToast && typeof window.CodeArenaToast[type] === 'function') {
            window.CodeArenaToast[type](message);
        } else if (window.CodeArenaToast && typeof window.CodeArenaToast.show === 'function') {
            window.CodeArenaToast.show(message, type);
        } else {
            console.log(`[Notification ${type}]`, message);
            let container = document.getElementById('codearenaToastContainer');
            if (!container) {
                container = document.createElement('div');
                container.id = 'codearenaToastContainer';
                container.className = 'codearena-toast-container';
                document.body.appendChild(container);
            }
            const toast = document.createElement('div');
            toast.className = `codearena-toast toast-${type} show`;
            toast.innerHTML = `<span class="toast-message">${escapeHtml(message)}</span>`;
            container.appendChild(toast);
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 250);
            }, 3500);
        }
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
