document.addEventListener('DOMContentLoaded', () => {
    
    // --- Configuration ---
    const mainTabsContainer = document.getElementById('mainTabs');
    const contentArea = document.querySelector('.content-area');

    // --- State Management ---
    // Function to activate a subtab
    function activateSubTab(subBtn) {
        if (!subBtn) return;

        const parentContent = subBtn.closest('.tab-content');
        const targetSubId = subBtn.dataset.sub;
        const targetSubContent = document.getElementById(targetSubId);

        // Deactivate siblings
        parentContent.querySelectorAll('.subtab-button').forEach(b => b.classList.remove('active'));
        parentContent.querySelectorAll('.subtab-content').forEach(c => c.classList.remove('active'));

        // Activate target
        subBtn.classList.add('active');
        if (targetSubContent) {
            targetSubContent.classList.add('active');
        }
    }

    // Function to activate a main tab
    function activateMainTab(tabBtn) {
        const targetId = tabBtn.dataset.tab;
        const targetContent = document.getElementById(targetId);

        if (!targetContent) return;

        // Visual updates for Tab Buttons
        document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
        tabBtn.classList.add('active');

        // Scroll active tab into view (UX improvement for mobile)
        tabBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

        // Hide all contents
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Show target content
        targetContent.classList.add('active');

        // Logic: Auto-select the first subtab if none is active
        const firstSubBtn = targetContent.querySelector('.subtab-button');
        const activeSubBtn = targetContent.querySelector('.subtab-button.active');
        
        if (!activeSubBtn && firstSubBtn) {
            activateSubTab(firstSubBtn);
        }
    }

    // --- Event Delegation (Performance) ---

    // 1. Handle Main Tab Clicks
    mainTabsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.tab-button');
        if (btn) {
            activateMainTab(btn);
        }
    });

    // 2. Handle Sub Tab Clicks (inside the content area)
    contentArea.addEventListener('click', (e) => {
        const btn = e.target.closest('.subtab-button');
        if (btn) {
            activateSubTab(btn);
        }
    });

    // --- Initialization ---
    // Ensure the default active tab behaves correctly on load
    const initialActiveTab = document.querySelector('.tab-button.active');
    if (initialActiveTab) {
        activateMainTab(initialActiveTab);
    }
});
