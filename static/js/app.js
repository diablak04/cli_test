// Inline SVG Icons definition for visual crispness and zero-dependency rendering
const ICONS = {
    refresh: `<svg class="spinner-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>`,
    spinner: `<svg class="spinner" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>`,
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    twitter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    externalLink: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
};

// Application State
let appData = {
    releases: [],
    selectedIds: new Set(),
    activeFilter: 'all',
    searchQuery: ''
};

// DOM Cache
const DOM = {
    timelineFeed: document.getElementById('timeline-feed'),
    refreshBtn: document.getElementById('refresh-btn'),
    refreshBtnText: document.getElementById('refresh-btn-text'),
    refreshBtnIcon: document.getElementById('refresh-btn-icon'),
    statusText: document.getElementById('status-text'),
    statusDot: document.getElementById('status-dot'),
    searchInput: document.getElementById('search-input'),
    filterTabs: document.querySelectorAll('.filter-tab'),
    floatingBar: document.getElementById('floating-bar'),
    selectedCountText: document.getElementById('selected-count-text'),
    tweetModal: document.getElementById('tweet-modal'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    cancelTweetBtn: document.getElementById('cancel-tweet-btn'),
    shareTweetBtn: document.getElementById('share-tweet-btn'),
    copyTweetBtn: document.getElementById('copy-tweet-btn'),
    tweetTextarea: document.getElementById('tweet-textarea'),
    charCounter: document.getElementById('char-counter'),
    progressRing: document.getElementById('progress-ring-circle'),
    charCounterWrapper: document.getElementById('char-counter-wrapper'),
    actionDraftBtn: document.getElementById('action-draft-btn'),
    actionClearBtn: document.getElementById('action-clear-btn'),
    toastContainer: document.getElementById('toast-container')
};

// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
    // Populate simple icons
    DOM.refreshBtnIcon.innerHTML = ICONS.refresh;
    document.getElementById('search-icon-container').innerHTML = ICONS.search;
    DOM.modalCloseBtn.innerHTML = ICONS.close;
    
    // Add Event Listeners
    DOM.refreshBtn.addEventListener('click', () => loadReleaseNotes(true));
    DOM.searchInput.addEventListener('input', handleSearchInput);
    
    DOM.filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            DOM.filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            appData.activeFilter = tab.dataset.type;
            renderTimeline();
        });
    });
    
    // Action bar buttons
    DOM.actionClearBtn.addEventListener('click', clearSelection);
    DOM.actionDraftBtn.addEventListener('click', openTweetComposer);
    
    // Modal buttons
    DOM.modalCloseBtn.addEventListener('click', closeTweetComposer);
    DOM.cancelTweetBtn.addEventListener('click', closeTweetComposer);
    DOM.shareTweetBtn.addEventListener('click', submitTweet);
    DOM.copyTweetBtn.addEventListener('click', copyTweetToClipboard);
    DOM.tweetTextarea.addEventListener('input', updateCharCounter);
    
    // Initial fetch
    loadReleaseNotes(false);
});

// Toast system
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconStr = ICONS.info;
    if (type === 'success') iconStr = ICONS.success;
    if (type === 'error') iconStr = ICONS.alert;
    
    toast.innerHTML = `
        <div style="width:20px;height:20px;display:flex;align-items:center;">${iconStr}</div>
        <div class="toast-message">${message}</div>
        <button class="toast-close">${ICONS.close}</button>
    `;
    
    DOM.toastContainer.appendChild(toast);
    
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
    });
    
    // Auto-remove after 4s
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'fadeOut 0.3s forwards';
            setTimeout(() => toast.remove(), 300);
        }
    }, 4000);
}

// Network Request: Load release notes
async function loadReleaseNotes(forceRefresh = false) {
    setLoadingState(true);
    clearSelection();
    
    try {
        const url = `/api/releases${forceRefresh ? '?refresh=true' : ''}`;
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.status === 'success') {
            appData.releases = result.releases;
            
            // Format status meta details
            let sourceLabel = 'Synced';
            if (result.source === 'cache') {
                sourceLabel = 'Cached';
            } else if (result.source === 'network_fallback') {
                sourceLabel = 'Network Fallback';
                showToast('Failed to connect to Google feed. Using cached data.', 'error');
            } else {
                showToast('Release notes fetched successfully!', 'success');
            }
            
            DOM.statusText.innerText = `${sourceLabel}: ${result.last_updated}`;
            DOM.statusDot.classList.remove('syncing');
            
            // Render content
            renderTimeline();
        } else {
            throw new Error(result.message || 'Unknown server error');
        }
    } catch (error) {
        console.error('Error fetching release notes:', error);
        showToast(`Error: ${error.message || 'Could not fetch release notes.'}`, 'error');
        renderErrorState(error.message);
    } finally {
        setLoadingState(false);
    }
}

// UI State Management for Loading
function setLoadingState(isLoading) {
    if (isLoading) {
        DOM.refreshBtn.disabled = true;
        DOM.refreshBtnIcon.innerHTML = ICONS.spinner;
        DOM.statusDot.classList.add('syncing');
        
        // Show loading skeleton inside container
        DOM.timelineFeed.innerHTML = `
            <div class="loading-state">
                <div style="display:inline-flex;justify-content:center;align-items:center;">
                    ${ICONS.spinner}
                </div>
                <h3 style="margin-top: 10px; font-weight: 500;">Fetching BigQuery release notes...</h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">Connecting to Google Cloud RSS feeds...</p>
            </div>
        `;
    } else {
        DOM.refreshBtn.disabled = false;
        DOM.refreshBtnIcon.innerHTML = ICONS.refresh;
    }
}

// UI State Management for Errors
function renderErrorState(errorMessage) {
    DOM.timelineFeed.innerHTML = `
        <div class="empty-state">
            <div style="display:inline-flex;justify-content:center;align-items:center;color:var(--type-issue-color);">
                ${ICONS.alert}
            </div>
            <h3 style="margin-top:10px;">Failed to load release notes</h3>
            <p>${errorMessage || 'Please check your connection and try again.'}</p>
            <button class="btn btn-primary" style="margin-top:20px;" onclick="loadReleaseNotes(true)">
                ${ICONS.refresh} Try Again
            </button>
        </div>
    `;
}

// Search input debouncer / handler
let searchTimeout;
function handleSearchInput() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        appData.searchQuery = DOM.searchInput.value.toLowerCase().trim();
        renderTimeline();
    }, 250);
}

// Filter and Group Data, then Render
function renderTimeline() {
    const query = appData.searchQuery;
    const filter = appData.activeFilter;
    
    // Reset Timeline Element
    DOM.timelineFeed.innerHTML = '';
    
    let renderedCount = 0;
    
    appData.releases.forEach((dayGroup, groupIndex) => {
        // Filter updates inside the group
        const filteredUpdates = dayGroup.updates.filter(update => {
            // Type Match
            let typeMatch = false;
            const uType = update.type.toLowerCase();
            
            if (filter === 'all') {
                typeMatch = true;
            } else if (filter === 'feature' && uType.includes('feature')) {
                typeMatch = true;
            } else if (filter === 'changed' && (uType.includes('change') || uType.includes('update'))) {
                typeMatch = true;
            } else if (filter === 'announcement' && uType.includes('announc')) {
                typeMatch = true;
            } else if (filter === 'issue' && (uType.includes('issue') || uType.includes('deprecat') || uType.includes('fix') || uType.includes('resolved'))) {
                typeMatch = true;
            }
            
            if (!typeMatch) return false;
            
            // Search Query Match
            if (query) {
                const textMatch = update.text.toLowerCase().includes(query);
                const titleMatch = dayGroup.date.toLowerCase().includes(query);
                const tagMatch = update.type.toLowerCase().includes(query);
                return textMatch || titleMatch || tagMatch;
            }
            
            return true;
        });
        
        // If the group has matching updates, render it
        if (filteredUpdates.length > 0) {
            renderedCount += filteredUpdates.length;
            
            const groupEl = document.createElement('div');
            groupEl.className = 'timeline-group';
            
            const headerEl = document.createElement('div');
            headerEl.className = 'timeline-header';
            headerEl.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="timeline-date">${dayGroup.date}</div>
            `;
            groupEl.appendChild(headerEl);
            
            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'timeline-items';
            
            filteredUpdates.forEach((update, updateIndex) => {
                const cardId = `card-${groupIndex}-${updateIndex}`;
                const cardTypeClass = getCardTypeClass(update.type);
                const isSelected = appData.selectedIds.has(cardId);
                
                const cardEl = document.createElement('div');
                cardEl.className = `update-card ${cardTypeClass} ${isSelected ? 'selected' : ''}`;
                cardEl.id = cardId;
                
                // Store data details for Tweet composer
                cardEl.dataset.id = cardId;
                cardEl.dataset.date = dayGroup.date;
                cardEl.dataset.type = update.type;
                cardEl.dataset.plainText = update.text;
                cardEl.dataset.link = dayGroup.link;
                
                cardEl.innerHTML = `
                    <div class="select-indicator">${ICONS.check}</div>
                    <div class="card-meta">
                        <span class="type-badge ${update.type.toLowerCase().replace(/\s+/g, '-')}">${update.type}</span>
                        <div class="card-actions">
                            <button class="card-btn btn-tweet-action" title="Tweet about this specific update" data-action="tweet-direct">
                                ${ICONS.twitter}
                            </button>
                            <a href="${dayGroup.link}" target="_blank" class="card-btn" title="View original release notes link" data-action="link">
                                ${ICONS.externalLink}
                            </a>
                        </div>
                    </div>
                    <div class="card-content">
                        ${update.html}
                    </div>
                `;
                
                // Event Delegation within Card
                cardEl.addEventListener('click', (e) => {
                    // Prevent select toggle if user clicks on links or button
                    const target = e.target;
                    const actionBtn = target.closest('.card-btn');
                    const isLink = target.tagName === 'A' || target.closest('a');
                    
                    if (actionBtn && actionBtn.dataset.action === 'tweet-direct') {
                        e.stopPropagation();
                        // Open direct tweet composer with just this card
                        clearSelection();
                        toggleCardSelection(cardEl);
                        openTweetComposer();
                        return;
                    }
                    
                    if (isLink) {
                        e.stopPropagation();
                        return;
                    }
                    
                    toggleCardSelection(cardEl);
                });
                
                itemsContainer.appendChild(cardEl);
            });
            
            groupEl.appendChild(itemsContainer);
            DOM.timelineFeed.appendChild(groupEl);
        }
    });
    
    // Handle Empty Search Results
    if (renderedCount === 0) {
        DOM.timelineFeed.innerHTML = `
            <div class="empty-state">
                <div style="display:inline-flex;justify-content:center;align-items:center;">
                    ${ICONS.search}
                </div>
                <h3 style="margin-top:10px;">No updates found</h3>
                <p>We couldn't find any release notes matching your filters or search term "${query}".</p>
                <button class="btn" style="margin-top:16px;" onclick="clearFilters()">
                    Reset Filters
                </button>
            </div>
        `;
    }
}

// Help map category headings to css classes
function getCardTypeClass(type) {
    const t = type.toLowerCase();
    if (t.includes('feature')) return 'type-feature';
    if (t.includes('announc')) return 'type-announcement';
    if (t.includes('change') || t.includes('update')) return 'type-changed';
    if (t.includes('deprecat')) return 'type-deprecation';
    if (t.includes('issue') || t.includes('fix') || t.includes('resolved')) return 'type-issue';
    return 'type-default';
}

// Reset filters back to initial state
window.clearFilters = function() {
    DOM.searchInput.value = '';
    appData.searchQuery = '';
    appData.activeFilter = 'all';
    DOM.filterTabs.forEach(t => {
        if (t.dataset.type === 'all') t.classList.add('active');
        else t.classList.remove('active');
    });
    renderTimeline();
};

// Selection Handling
function toggleCardSelection(cardEl) {
    const cardId = cardEl.dataset.id;
    
    if (appData.selectedIds.has(cardId)) {
        appData.selectedIds.delete(cardId);
        cardEl.classList.remove('selected');
    } else {
        appData.selectedIds.add(cardId);
        cardEl.classList.add('selected');
    }
    
    updateFloatingBar();
}

function clearSelection() {
    appData.selectedIds.clear();
    document.querySelectorAll('.update-card.selected').forEach(card => {
        card.classList.remove('selected');
    });
    updateFloatingBar();
}

function updateFloatingBar() {
    const count = appData.selectedIds.size;
    if (count > 0) {
        DOM.selectedCountText.innerText = `${count} ${count === 1 ? 'update' : 'updates'} selected`;
        DOM.floatingBar.classList.add('active');
    } else {
        DOM.floatingBar.classList.remove('active');
    }
}

// Helper to grab selected DOM card elements
function getSelectedCardElements() {
    const els = [];
    appData.selectedIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) els.push(el);
    });
    // Sort selected items by layout order (index-based) so the compiled text is chronological
    return els.sort((a, b) => {
        const aParts = a.id.split('-').map(Number);
        const bParts = b.id.split('-').map(Number);
        if (aParts[1] !== bParts[1]) return aParts[1] - bParts[1];
        return aParts[2] - bParts[2];
    });
}

// Tweet Composer Logic
function generateTweetDraft(selectedCards) {
    if (selectedCards.length === 0) return '';
    
    if (selectedCards.length === 1) {
        const card = selectedCards[0];
        const date = card.dataset.date;
        const type = card.dataset.type;
        const text = card.dataset.plainText;
        const link = card.dataset.link;
        
        // Condense text spaces and clean HTML scraps
        let cleanText = text.replace(/\s+/g, ' ').trim();
        
        // Calculate max description length for Twitter 280-char limit
        // Intro: "BigQuery Update ([date]) - [type]:\n" (varies, ~35-45 chars)
        // Outro: "\n\nDetails: [link]\n#BigQuery" (varies, ~80 chars)
        // Leaving approx ~150 chars for description
        const templateStructure = `BigQuery Update (${date}) - [${type}]:\n\n\n\nDetails: ${link}\n#BigQuery #GoogleCloud`;
        const reservedLen = templateStructure.length;
        const allowedDescLen = Math.max(100, 280 - reservedLen - 5); // safety margin
        
        if (cleanText.length > allowedDescLen) {
            cleanText = cleanText.substring(0, allowedDescLen - 3) + '...';
        }
        
        return `BigQuery Update (${date}) - [${type}]:\n${cleanText}\n\nDetails: ${link}\n#BigQuery #GoogleCloud`;
    } else {
        // Multi-select summaries
        let draft = `BigQuery Updates:\n`;
        const link = selectedCards[0].dataset.link.split('#')[0]; // Root release page link
        
        selectedCards.forEach(card => {
            let cleanText = card.dataset.plainText.replace(/\s+/g, ' ').trim();
            if (cleanText.length > 55) {
                cleanText = cleanText.substring(0, 52) + '...';
            }
            draft += `• [${card.dataset.type}] ${cleanText}\n`;
        });
        
        const reservedLen = draft.length + `\nRelease Notes: \n#BigQuery #GoogleCloud`.length;
        // Check if overall text fits, else truncate the list items
        if (draft.length > 180) {
            draft = draft.substring(0, 175) + '...\n';
        }
        
        draft += `\nRelease Notes: ${link}\n#BigQuery #GoogleCloud`;
        return draft;
    }
}

function openTweetComposer() {
    const selectedCards = getSelectedCardElements();
    if (selectedCards.length === 0) return;
    
    const draftText = generateTweetDraft(selectedCards);
    DOM.tweetTextarea.value = draftText;
    
    updateCharCounter();
    
    // Show Modal
    DOM.tweetModal.classList.add('active');
    DOM.tweetTextarea.focus();
}

function closeTweetComposer() {
    DOM.tweetModal.classList.remove('active');
}

function updateCharCounter() {
    const count = DOM.tweetTextarea.value.length;
    const limit = 280;
    
    DOM.charCounter.innerText = `${count} / ${limit}`;
    
    // Manage CSS classes on indicator based on limit bounds
    DOM.charCounterWrapper.classList.remove('warning', 'danger');
    if (count > limit) {
        DOM.charCounterWrapper.classList.add('danger');
        DOM.shareTweetBtn.disabled = true;
    } else if (count >= limit - 20) {
        DOM.charCounterWrapper.classList.add('warning');
        DOM.shareTweetBtn.disabled = false;
    } else {
        DOM.shareTweetBtn.disabled = false;
    }
    
    // Animate Circular Progress Ring
    const radius = 9;
    const circumference = 2 * Math.PI * radius; // ~56.54
    DOM.progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
    
    const percentage = Math.min(100, (count / limit) * 100);
    const offset = circumference - (percentage / 100) * circumference;
    DOM.progressRing.style.strokeDashoffset = offset;
}

function submitTweet() {
    const text = DOM.tweetTextarea.value;
    if (text.length > 280) {
        showToast('Tweet text exceeds the 280 character limit!', 'error');
        return;
    }
    
    // Open Twitter Web Intent in new window
    const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(intentUrl, '_blank', 'width=550,height=420,referrerpolicy=no-referrer');
    
    closeTweetComposer();
    clearSelection();
    showToast('Redirected to Twitter/X compose web intent!', 'success');
}

async function copyTweetToClipboard() {
    const text = DOM.tweetTextarea.value;
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copied draft tweet to clipboard!', 'success');
    } catch (err) {
        console.error('Failed to copy text:', err);
        showToast('Failed to copy to clipboard.', 'error');
    }
}
