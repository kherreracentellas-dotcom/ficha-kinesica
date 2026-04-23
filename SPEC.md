# Especificación del Proyecto: Ficha Kinésica Cardiorrespiratoria

## 1. Visión General
Plataforma médica de alta gama diseñada para profesionales de kinesiología, enfocada en la evaluación cardiorrespiratoria integral. La aplicación prioriza la precisión clínica, la automatización de cálculos y una experiencia de usuario premium.

## 2. Stack Tecnológico
- **Frontend**: React 19 + Vite.
- **Iconografía**: Lucide React.
- **Estilos**: Vanilla CSS con variables modernas (Design System).
- **Animaciones**: Framer Motion.
- **Persistencia**: LocalStorage (con miras a IndexedDB).
- **Exportación**: html2pdf.js (PDF) y Blobs (Word).

## 3. Arquitectura de Datos (FormContext)
Toda la aplicación se rige por un objeto `formData` centralizado:
- `paciente`: Datos básicos + Antropometría (Peso, Talla, IMC calculado).
- `morbidos`: Antecedentes médicos y farmacología.
- `vitales`: Signos vitales + PAM (calculado).
- `inspeccion`: Observación clínica, tirajes, tos.
- `palpacion`: Edema, pulsos, expansibilidad.
- `auscultacion`: Ruidos pulmonares y cardíacos (Levine Scale).
- `escalas`: Scores clínicos (Tal, Wood, BODE) y Exámenes (Gasometría, Espirometría).
- `diagnostico`: Diagnóstico CIF y Plan de tratamiento.

## 4. Design System (Medical Premium)
- **Colores**: Indigo (#4f46e5) para acentos, Slate (#64748b) para textos, Blanco (#ffffff) para superficies.
- **Tipografía**: Outfit para encabezados, Inter para cuerpo de texto.
- **Componentes**: 
  - `clinical-section`: Tarjetas con bordes redondeados y sombras suaves.
  - `vital-card`: Visualizadores de alto impacto para datos críticos.
  - `btn-na`: Sistema para anular secciones no aplicables.

## 5. Reglas de Desarrollo (IA Spec-Driven)
- **Comentarios**: Todos los comentarios de código deben estar en **español**.
- **Consistencia**: Mantener el tamaño de fuente y espaciado consistente en todos los formularios.
- **Automatización**: Cualquier cálculo clínico (IMC, PAM, IPA, Edad) debe ser automático y reactivo.
- **Validación**: Los campos técnicos deben usar selectores (select) en lugar de texto libre siempre que sea posible para estandarizar datos.

## 6. Roadmap Completado
- [x] Refactorización de UI a estilo Premium.
- [x] Implementación de cálculos automáticos (IMC, PAM, Edad, IPA).
- [x] Sistema de exportación PDF y Word.
- [x] Validación de datos con Zod (Estricta).
- [x] Sistema de historial de pacientes con búsqueda avanzada.
- [x] Firma digital manuscrita en el canvas.
- [x] Corrección de selectores de ruidos agregados.

## 7. Plan de Mejoras (Fase 2)
1.  **Navegación Secuencial**: Añadir botones de "Siguiente" y "Anterior" al final de cada sección para guiar al profesional en el flujo clínico.
2.  **Integridad de Datos**: Reemplazar campos de texto libre por selectores predefinidos en Antecedentes Mórbidos (Enfermedades comunes, Alergias frecuentes).
3.  **Visualización de Tendencias**: Implementar gráficos simples para visualizar la evolución del paciente si se cargan múltiples fichas del mismo RUT.
4.  **Soporte Multi-Usuario**: Preparar la arquitectura para un backend con autenticación y almacenamiento en la nube.
5.  **Refinamiento de PDF**: Optimizar el layout del PDF para que ocupe exactamente 1 o 2 páginas A4 sin cortes de sección incómodos.
