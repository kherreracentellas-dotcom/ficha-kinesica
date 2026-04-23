/**
 * loader.js
 * Handles dynamic loading of clinical sections to keep index.html clean.
 * Siempre agrega comentarios en español a cada bloque de codigo.
 */

import { UIModule } from './ui.js';
import { Utils } from './utils.js';

export const LoaderModule = {
    /**
     * Carga todas las secciones clínicas asincrónicamente
     * @param {string} containerId - El ID del elemento donde se inyectarán las secciones
     */
    async loadSections(containerId = 'clinical-sections') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contenedor ${containerId} no encontrado`);
            return;
        }

        // Lista de secciones a cargar (orden correlativo)
        const sections = [
            'dashboard.html',
            '01-personales.html',
            '02-biopsicosociales.html',
            '03-morbidos.html',
            '04-vitales.html',
            '05-inspeccion.html',
            '06-palpacion.html',
            '07-auscultacion.html',
            '08-examenes.html',
            '09-mecanica.html',
            '10-pruebas.html',
            '11-capacidad.html',
            '12-fuerza.html',
            '13-seguridad.html',
            '14-diagnostico.html'
        ];

        // Mostrar un loader visual si es necesario
        container.innerHTML = '<div class="loader-spinner">Cargando secciones clínicas...</div>';

        try {
            const loadPromises = sections.map(async (section) => {
                const response = await fetch(`sections/${section}`);
                if (!response.ok) throw new Error(`No se pudo cargar ${section}`);
                return await response.text();
            });

            const htmlContents = await Promise.all(loadPromises);
            
            // Limpiar container e inyectar contenido
            container.innerHTML = '';
            htmlContents.forEach(html => {
                container.insertAdjacentHTML('beforeend', html);
            });

            // Reinicializar componentes que dependen del DOM inyectado
            this.reinitializeComponents();
            
            console.log('Todas las secciones cargadas exitosamente');
        } catch (error) {
            console.error('Error al cargar secciones:', error);
            Utils.showToast('Error al cargar módulos clínicos', 'danger');
        }
    },

    /**
     * Reinicializa librerías y listeners después de la carga dinámica
     */
    reinitializeComponents() {
        // Reinicializar iconos de Lucide
        if (window.lucide) {
            window.lucide.createIcons();
        }

        // Reinicializar Scroll Spy para incluir las nuevas secciones
        UIModule.initScrollSpy();

        // Reinicializar manejadores de N/A
        UIModule.initNAHandlers();

        // Disparar evento personalizado para otros módulos que necesiten saber que el DOM cambió
        document.dispatchEvent(new CustomEvent('sections-loaded'));
    }
};
