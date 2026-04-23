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
    },

    initRUTFormatter() {
        const rutInput = document.getElementById('paciente_rut');
        if (rutInput) {
            rutInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\./g, '').replace('-', '');
                if (value.length > 9) value = value.slice(0, 9);
                if (value.length > 1) {
                    let cuerpo = value.slice(0, -1);
                    let dv = value.slice(-1).toUpperCase();
                    let formatted = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + dv;
                    e.target.value = formatted;
                }
            });
        }
    },

    /**
     * Handles Section N/A toggling
     */
    initNAHandlers() {
        document.querySelectorAll('.btn-na').forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.closest('section');
                const sectionId = section.id;
                const isActive = btn.classList.toggle('active');
                section.classList.toggle('na-active', isActive);
                
                // Persistence
                let naSections = JSON.parse(localStorage.getItem('kine_na_sections') || '[]');
                if (isActive) {
                    if (!naSections.includes(sectionId)) naSections.push(sectionId);
                } else {
                    naSections = naSections.filter(s => s !== sectionId);
                }
                localStorage.setItem('kine_na_sections', JSON.stringify(naSections));
            });
        });
    },
    /**
     * Scroll Spy: Highlights sidebar links as you scroll
     */
    initScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px', // Trigger when section is in the top-middle
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href')?.replace('#', '');
                        if (href === id) {
                            link.classList.add('active');
                        } else if (!link.hasAttribute('@click')) { // Don't clear dashboard link if it's special
                            link.classList.remove('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }
};
