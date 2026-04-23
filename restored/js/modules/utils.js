/**
 * utils.js
 * Common utility functions for notifications and UI feedback.
 */

export const Utils = {
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = 'ℹ️';
        if (type === 'success') icon = '✅';
        if (type === 'warning') icon = '⚠️';
        if (type === 'danger') icon = '❌';

        toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    setIndicator(el, text, cls, inputEl) {
        if (el) {
            el.className = 'val-indicator ' + cls;
            el.textContent = text;
        }
        
        const card = inputEl?.closest('.vital-card');
        if (card) {
            card.classList.remove('vital-alert-danger', 'vital-alert-success', 'vital-alert-warning');
            card.classList.add('vital-alert-' + cls);
        }
    },

    async confirmAction(title, text, icon = 'warning') {
        const result = await Swal.fire({
            title,
            text,
            icon,
            showCancelButton: true,
            confirmButtonColor: '#2E86DE',
            cancelButtonColor: '#E74C3C',
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar',
            background: document.documentElement.dataset.theme === 'dark' ? '#1E293B' : '#FFFFFF',
            color: document.documentElement.dataset.theme === 'dark' ? '#F1F5F9' : '#1E293B'
        });
        return result.isConfirmed;
    },

    showAlert(title, text, icon = 'success') {
        Swal.fire({
            title,
            text,
            icon,
            timer: 2000,
            showConfirmButton: false
        });
    }
};
