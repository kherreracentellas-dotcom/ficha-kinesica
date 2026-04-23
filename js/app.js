/* global Alpine, Chart */
/**
 * app.js
 * Main entry point. Orchestrates modules and Alpine.js state.
 */

import { ClinicalCalculations } from './modules/clinical.js';
import { AuthModule } from './modules/auth.js';
import { UIModule } from './modules/ui.js';
import { Utils } from './modules/utils.js';
import { LoaderModule } from './modules/loader.js';

// 1. Función de Inicialización Principal
async function initializeApp() {
    console.log("Iniciando aplicación...");

    // Auth Form Logic - Inicializar primero para evitar bloqueos
    const authForm = document.getElementById('auth-form');
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('auth-username').value;
            const pass = document.getElementById('auth-password').value;
            const res = AuthModule.login(user, pass);
            if (res.success) {
                Utils.showToast(`Bienvenido, ${user}`, 'success');
                setTimeout(() => window.location.reload(), 500);
            } else {
                Utils.showToast(res.message, 'danger');
            }
        });
    }

    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) btnLogout.addEventListener('click', () => {
        if (confirm('¿Cerrar sesión?')) AuthModule.logout();
    });

    // Carga Dinámica de Secciones
    try {
        console.log("Cargando secciones...");
        await LoaderModule.loadSections('clinical-sections');

        // Inicialización de Módulos UI post-carga
        UIModule.initNavigation();
        UIModule.initSidebarToggle();
        UIModule.initRUTFormatter();
        UIModule.initNAHandlers();
        console.log("Secciones cargadas y UI inicializada.");
    } catch (err) {
        console.error("Error crítico cargando secciones:", err);
        Utils.showToast('Error crítico al cargar módulos', 'danger');
    }
}

// Ejecutar inicialización según el estado del documento
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}



// 2. Registro de Alpine.js
document.addEventListener('alpine:init', () => {
    Alpine.data('formState', () => {
        console.log('Inicializando Alpine formState...');
        const user = AuthModule.getUser();
        console.log('Usuario actual:', user);

        return {
            currentView: 'dashboard',
            searchQuery: '',
            currentUser: AuthModule.getUser() || '',
            filteredPatients: [],
            patients: JSON.parse(localStorage.getItem('kine_patients_list') || '[]'),

            init() {
                this.filteredPatients = [...this.patients];
                this.$watch('patients', (val) => {
                    this.filteredPatients = [...val];
                });

                // Inicializar gráfico de tendencias
                setTimeout(() => this.initTrendsChart(), 500);
            },

            logout() {
                AuthModule.logout();
            },

            toggleNA(sectionId) {
                if (this.formData.naSections.includes(sectionId)) {
                    this.formData.naSections = this.formData.naSections.filter(id => id !== sectionId);
                } else {
                    this.formData.naSections.push(sectionId);
                }
            },

            // Se eliminaron getters duplicados de pam e imc aquí para usar los que utilizan ClinicalCalculations más abajo.


            formData: {
                naSections: [], // Lista de IDs de secciones marcadas como N/A
                // I. Antecedentes Personales
                paciente_nombre: '',
                paciente_rut: '',
                paciente_edad: '',
                paciente_fecha_nacimiento: '',
                paciente_sexo: 'masculino',
                ocupacion: '',
                prevision: '',
                nivel_educacional: '',
                fono: '',
                fono_emergencia: '',

                // II. Biopsicosociales
                nucleo_familiar: '',
                nucleo_especificar: '',
                tipo_vivienda: '',
                mascotas: 'no',
                mascotas_especificar: '',
                tabaquismo: 'no',
                tabaco_cantidad: '',
                tabaco_anos: '',
                biomasa: 'no',
                biomasa_especificar: '',
                alcohol: 'no',
                alcohol_frecuencia: '',
                actividad: 'no',
                ejercicio_tipo: '',
                ejercicio_frecuencia: '',
                ejercicio_tiempo: '',
                ejercicio_intensidad: '',
                ejercicio_disnea: 'no',

                // III. Mórbidos
                motivo_consulta: '',
                medico_tratante: '',
                diagnostico_medico: '',
                enfermedades_cronicas: '',
                cirugias_previas: '',
                alergias: '',
                antecedentes_familiares: '',
                farmacos_continuo: '',
                farmacos_rescate: '',
                adherencia: 'si',
                farmaco_dosis: '',

                // IV. Vitales
                presion_sistolica: '',
                presion_diastolica: '',
                fc: '',
                fr: '',
                spo2: '',
                fio2: '',
                temp: '',
                paciente_peso: '',
                paciente_talla: '',

                // V. Inspección (Tos y Otros)
                tipo_torax: 'normotorax',
                patron_respiratorio: 'costal',
                muscultura_accesoria: 'no',
                tiraje: [],
                tos_presenta: 'no',
                tos_horario: 'diurna',
                tos_tipo: 'seca',
                tos_secrecion_tipo: '',
                cianosis: 'no',
                cianosis_tipo: '',
                coriza: 'no',
                coriza_tipo: '',
                disnea_repo_esfuer: 'reposo',
                mmrc: '',
                fatiga_escala: '',
                cat_score: '',

                // VI. Palpación
                linfonodos: 'no',
                linfo_ubic: [],
                traquea: '',
                expansibilidad: '',
                fremitos: 'normales',
                llenado_capilar: 'normal',
                ingurgitacion: 'no',
                reflujo_hepato: 'negativo',
                pulsos: 'simetricos',
                edema: 'ausente',

                // VII. Auscultación
                percusion_izq: 'sonoridad',
                percusion_der: 'sonoridad',
                murmullo: 'normal',
                ruido_laringe: 'normal',
                resonancia_vocal: 'normal',
                mv_presente: 'si',
                ruidos_cont: [],
                ruidos_disc: [],
                ruidos_obs: '',
                cardiaco_ritmico: true,
                cardiaco_soplo: false,
                cardiaco_r3: false,
                levine_grado: '',
                soplo_foco: '',


                // VIII. Exámenes
                imagenologia: '',
                gas_ph: '',
                gas_pco2: '',
                gas_po2: '',
                gas_hco3: '',
                gas_be: '',
                gas_pafi: '',
                otros_examenes: '',

                // IX. Mecánica Respiratoria
                uso_vm: false,
                mecanica_pip: '',
                mecanica_plateau: '',
                mecanica_peep: '',
                mecanica_distensibilidad: '',
                mecanica_resistencia: '',

                // X. Pruebas Funcionales

                fev1_obs: '',
                fev1_pred: '',
                fvc_obs: '',
                fvc_pred: '',
                fev1fvc_obs: '',
                fev1fvc_pred: '',
                fvc_diagnostico: '',
                pim_val: '',
                pem_val: '',
                pef_obs: '',
                pef_pred: '',
                tm6m_recorrida: '',
                tm6m_borg: '',
                tm6m_spo2: '',
                tm6m_fc: '',
                fuerza_handgrip: '',
                fuerza_cuadriceps: '5',
                safe_indicacion: false,
                safe_vias: false,
                safe_alimento: false,
                safe_clinica: false,

                // XIV. Diagnóstico y Plan

                diagnostico_kinesico: '',
                objetivo_general: '',
                objetivos_especificos: '',
                plan_tratamiento: ''
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
                    id: this.formData.id || Date.now(),
                    nombre: this.formData.paciente_nombre,
                    rut: this.formData.paciente_rut,
                    fecha: new Date().toLocaleDateString('es-CL'),
                    data: { ...this.formData }
                };
                const index = this.patients.findIndex(x => x.rut === p.rut);
                if (index !== -1) {
                    this.patients[index] = p;
                } else {
                    this.patients.unshift(p);
                }

                this.saveToStorage();
                this.currentView = 'dashboard';
                Utils.showToast('Guardado correctamente', 'success');
            },

            deletePatient(id) {
                if (confirm('¿Está seguro de eliminar esta ficha?')) {
                    this.patients = this.patients.filter(x => x.id !== id);
                    this.saveToStorage();
                    Utils.showToast('Ficha eliminada', 'success');
                }
            },

            filterPatients() {
                const query = this.searchQuery.toLowerCase();
                this.filteredPatients = this.patients.filter(p =>
                    p.nombre.toLowerCase().includes(query) ||
                    p.rut.toLowerCase().includes(query)
                );
            },

            saveToStorage() {
                localStorage.setItem('kine_patients_list', JSON.stringify(this.patients));
                this.filterPatients();
            },

            initTrendsChart() {
                const ctx = document.getElementById('trendsChart');
                if (!ctx) return;

                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                        datasets: [{
                            label: 'Atenciones',
                            data: [12, 19, 15, 8, 22, 10, 5],
                            borderColor: '#2E86DE',
                            backgroundColor: 'rgba(46, 134, 222, 0.1)',
                            fill: true,
                            tension: 0.4,
                            borderWidth: 3,
                            pointBackgroundColor: '#2E86DE'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false }
                        },
                        scales: {
                            y: { beginAtZero: true, grid: { display: false } },
                            x: { grid: { display: false } }
                        }
                    }
                });
            }
        };
    });
});
