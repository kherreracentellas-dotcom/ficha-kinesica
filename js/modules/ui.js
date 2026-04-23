/**
 * ui.js
 * Handles sidebar navigation, scroll spy, and other UI interactions.
 */

export const UIModule = {
    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const id = link.getAttribute('href').replace('#', '');
                const target = document.getElementById(id);
                if (target) {
                    // Switch to form if needed
                    if (window.Alpine) {
                        const state = Alpine.$data(document.body);
                        state.currentView = 'form';
                    }
                    
                    setTimeout(() => {
                        target.scrollIntoView({ behavior: 'smooth' });
                        navLinks.forEach(l => l.classList.remove('active'));
                        link.classList.add('active');
                    }, 50);
                }
            });
        });
    },

    initSidebarToggle() {
        const btnMenu = document.getElementById('btn-menu');
        const sidebar = document.querySelector('aside.sidebar');
        if (btnMenu && sidebar) {
            btnMenu.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }
    }
};
