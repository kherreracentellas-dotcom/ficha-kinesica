/**
 * app.js
 * Main entry point. Orchestrates modules and Alpine.js state.
 */

import { ClinicalCalculations } from './modules/clinical.js';
import { AuthModule } from './modules/auth.js';
import { UIModule } from './modules/ui.js';
import { PersistenceModule } from './modules/persistence.js';
import { PDFModule } from './modules/pdf.js';
import { Utils } from './modules/utils.js';
import { LoaderModule } from './modules/loader.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Carga Dinámica de Secciones
    // Se cargan los fragmentos HTML antes de inicializar la lógica
    await LoaderModule.loadSections('clinical-sections');

    // 2. Inicialización de Módulos UI
    UIModule.initNavigation();
    UIModule.initSidebarToggle();
    UIModule.initRUTFormatter();
    UIModule.initNAHandlers();
    // Note: ScrollSpy is called inside LoaderModule.postLoadInit()
    
    const form = document.getElementById('evaluation-form');
    const authForm = document.getElementById('auth-form');

    // Auth Logic
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('auth-username').value;
            const pass = document.getElementById('auth-password').value;
            const res = AuthModule.login(user, pass);
            if (res.success) {
                Utils.showToast(`Bienvenido, ${user}`, 'success');
                window.location.reload();
            } else {
                Utils.showToast(res.message, 'danger');
            }
        });
    }

    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) btnLogout.addEventListener('click', () => {
        if (confirm('¿Cerrar sesión?')) AuthModule.logout();
    });

    // Initialize Trends Chart
    const ctx = document.getElementById('trendsChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
                datasets: [{
                    label: 'Atenciones',
                    data: [12, 19, 15, 25, 22, 10, 8],
                    borderColor: '#2E86DE',
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(46, 134, 222, 0.1)'
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    // Load initial data
    if (form) {
        PersistenceModule.loadFromLocal(form, 'default_user'); // Use a default key if no user
    }
});

document.addEventListener('alpine:init', () => {
    Alpine.data('formState', () => ({
        currentView: 'dashboard',
        searchQuery: '',
        currentUser: AuthModule.getUser(),
        patients: JSON.parse(localStorage.getItem('kine_patients_list') || '[]'),
        
        formData: {
            paciente_nombre: '',
            paciente_rut: '',
            paciente_edad: '',
            paciente_peso: '',
            paciente_talla: '',
            paciente_sexo: 'masculino',
            presion_sistolica: '',
            presion_diastolica: '',
            fev1_obs: '',
            fev1_pred: '',
            fvc_obs: '',
            fvc_pred: '',
            tm6m_recorrida: '',
            mascotas: 'no',
            tabaquismo: 'no',
            biomasa: 'no',
            alcohol: 'no',
            actividad: 'no',
            tos_presenta: 'no',
            cianosis: 'no',
            coriza: 'no'
        },

        // Computeds
        get imc() { return ClinicalCalculations.calculateBMI(this.formData.paciente_peso, this.formData.paciente_talla); },
        get pam() { return ClinicalCalculations.calculateMAP(this.formData.presion_sistolica, this.formData.presion_diastolica); },
        get fvc_porc() { return ClinicalCalculations.calculatePercentage(this.formData.fvc_obs, this.formData.fvc_pred); },
        get fev1_porc() { return ClinicalCalculations.calculatePercentage(this.formData.fev1_obs, this.formData.fev1_pred); },
        get fev1fvc_ratio() { return ClinicalCalculations.calculateTiffeneau(this.formData.fev1_obs, this.formData.fvc_obs); },
        get goldGrade() { return ClinicalCalculations.getGOLDGrade(this.fev1_porc, this.fev1fvc_ratio); },
        get tm6m_predicha_calc() { 
            return ClinicalCalculations.calculateTM6MPredicted(
                this.formData.paciente_sexo, 
                this.formData.paciente_edad, 
                this.formData.paciente_peso, 
                this.formData.paciente_talla
            ); 
        },
        get tm6m_porc_calc() { return ClinicalCalculations.calculateTM6MPercentage(this.formData.tm6m_recorrida, this.tm6m_predicha_calc); },

        // Methods
        createNewPatient() {
            this.formData = { paciente_sexo: 'masculino', mascotas: 'no', tabaquismo: 'no' };
            this.currentView = 'form';
            Utils.showToast('Nueva ficha iniciada', 'info');
        },

        loadPatient(id) {
            const p = this.patients.find(x => x.id === id);
            if (p) {
                this.formData = { ...p.data };
                this.currentView = 'form';
                Utils.showToast(`Ficha de ${p.nombre} cargada`, 'success');
            }
        },

        saveCurrentPatient() {
            if (!this.formData.paciente_nombre || !this.formData.paciente_rut) {
                Utils.showToast('Nombre y RUT obligatorios', 'danger');
                return;
            }
            const p = {
                id: Date.now(),
                nombre: this.formData.paciente_nombre,
                rut: this.formData.paciente_rut,
                fecha: new Date().toLocaleDateString('es-CL'),
                data: { ...this.formData }
            };
            const index = this.patients.findIndex(x => x.rut === p.rut);
            if (index !== -1) this.patients[index] = p;
            else this.patients.unshift(p);
            
            localStorage.setItem('kine_patients_list', JSON.stringify(this.patients));
            this.currentView = 'dashboard';
            Utils.showToast('Guardado correctamente', 'success');
        }
    }));
});
