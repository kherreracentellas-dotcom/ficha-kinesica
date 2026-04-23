/**
 * app.js
 * Entry point for the application. Initializes modules and Alpine.js state.
 */

import { ClinicalCalculations } from './modules/clinical.js';
import { AuthModule } from './modules/auth.js';
import { UIModule } from './modules/ui.js';

document.addEventListener('DOMContentLoaded', () => {
    UIModule.initNavigation();
    UIModule.initSidebarToggle();
});

document.addEventListener('alpine:init', () => {
    Alpine.data('formState', () => ({
        // View State
        currentView: 'dashboard',
        searchQuery: '',
        
        // Global State
        currentUser: AuthModule.getUser(),
        progress: 0,
        
        // Data Persistence
        patients: JSON.parse(localStorage.getItem('kine_patients_list') || '[]'),
        
        // Form Data
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
            actividad: 'no'
        },

        // Computed calculations (using ClinicalCalculations module)
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

        // Dashboard Methods
        get filteredPatients() {
            if (!this.searchQuery) return this.patients;
            const q = this.searchQuery.toLowerCase();
            return this.patients.filter(p => 
                (p.nombre && p.nombre.toLowerCase().includes(q)) || 
                (p.rut && p.rut.toLowerCase().includes(q))
            );
        },

        createNewPatient() {
            this.formData = { paciente_sexo: 'masculino', mascotas: 'no', tabaquismo: 'no' }; // Reset
            this.currentView = 'form';
        },

        loadPatient(id) {
            const patient = this.patients.find(p => p.id === id);
            if (patient) {
                this.formData = { ...patient.data };
                this.currentView = 'form';
            }
        },

        saveCurrentPatient() {
            if (!this.formData.paciente_nombre || !this.formData.paciente_rut) return;
            const newPatient = {
                id: Date.now(),
                nombre: this.formData.paciente_nombre,
                rut: this.formData.paciente_rut,
                fecha: new Date().toLocaleDateString('es-CL'),
                data: { ...this.formData }
            };
            const index = this.patients.findIndex(p => p.rut === newPatient.rut);
            if (index !== -1) this.patients[index] = newPatient;
            else this.patients.unshift(newPatient);
            
            localStorage.setItem('kine_patients_list', JSON.stringify(this.patients));
            this.currentView = 'dashboard';
        }
    }));
});
