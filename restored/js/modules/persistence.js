/**
 * persistence.js
 * Handles saving and loading form data from localStorage.
 */

import { Utils } from './utils.js';

export const PersistenceModule = {
    saveToLocal(form, currentUser = 'default_user') {
        const key = currentUser || 'default_user';
        const data = {};
        form.querySelectorAll('input, select, textarea').forEach(el => {
            if (!el.name) return;
            if (el.type === 'checkbox') {
                if (!data[el.name]) data[el.name] = [];
                if (el.checked) data[el.name].push(el.value);
            } else if (el.type === 'radio') {
                if (el.checked) data[el.name] = el.value;
            } else {
                data[el.name] = el.value;
            }
        });
        
        // Signatures
        const sigKine = document.getElementById('sig-kine');
        const sigPatient = document.getElementById('sig-patient');
        if (sigKine) data['sig_kine'] = sigKine.toDataURL();
        if (sigPatient) data['sig_patient'] = sigPatient.toDataURL();

        localStorage.setItem(`kine_form_${key}`, JSON.stringify(data));
    },

    loadFromLocal(form, currentUser = 'default_user') {
        const key = currentUser || 'default_user';
        const saved = localStorage.getItem(`kine_form_${key}`);
        if (!saved) return;

        try {
            const data = JSON.parse(saved);
            Object.keys(data).forEach(key => {
                const val = data[key];
                if (key === 'sig_kine' || key === 'sig_patient') {
                    const canvas = document.getElementById(key === 'sig_kine' ? 'sig-kine' : 'sig-patient');
                    if (canvas) {
                        const img = new Image();
                        img.onload = () => canvas.getContext('2d').drawImage(img, 0, 0);
                        img.src = val;
                    }
                    return;
                }
                const els = form.querySelectorAll(`[name="${key}"]`);
                els.forEach(el => {
                    if (el.type === 'checkbox') {
                        if (Array.isArray(val)) el.checked = val.includes(el.value);
                    } else if (el.type === 'radio') {
                        el.checked = (el.value === val);
                    } else {
                        el.value = val;
                    }
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                });
            });
            Utils.showToast('Progreso cargado', 'info');
        } catch (e) {
            console.warn('Error loading saved data:', e);
        }
    }
};
