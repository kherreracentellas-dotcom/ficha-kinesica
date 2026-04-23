document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#evaluation-form');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const progressFill = document.querySelector('#progress-fill');
    const progressText = document.querySelector('#progress-text');
    const currentSectionName = document.querySelector('#current-section-name');

    // ═══════════════════════════════════════════════════
    // 1. SCROLL SPY & SIDEBAR NAVIGATION
    // ═══════════════════════════════════════════════════
    const observerOptions = {
        root: null,
        rootMargin: '-15% 0px -75% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                        const label = link.textContent.trim().replace(/^\d+\s*/, '');
                        currentSectionName.textContent = label;
                    }
                });
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // Sidebar click: scroll without changing URL hash
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ═══════════════════════════════════════════════════
    // 2. CONDITIONAL VISIBILITY (Show/Hide)
    // ═══════════════════════════════════════════════════
    const conditionMap = {
        'mascotas': 'cond-mascotas-especificar',
        'tabaquismo': 'cond-tabaquismo-detalles',
        'biomasa': 'cond-biomasa-especificar',
        'alcohol_drogas': 'cond-alcohol-frecuencia',
        'actividad_fisica': 'cond-actividad-detalles',
        'muscultura_accesoria': 'cond-tiraje-detalles',
        'cianosis': 'cond-cianosis-detalles',
        'coriza': 'cond-coriza-detalles',
        'tos_presenta': 'cond-tos-detalles',
        'cardiaco_soplo': 'cond-soplo-detalles',
        'linfonodos': 'cond-linfonodos-ubicacion'
    };

    const handleConditional = (name, value) => {
        if (!conditionMap[name]) return;
        const el = document.getElementById(conditionMap[name]);
        if (!el) return;

        const isActive = value === 'si' || value === true;
        el.classList.toggle('hidden', !isActive);

        // Slide animation
        if (isActive) {
            el.style.maxHeight = el.scrollHeight + 'px';
            el.style.opacity = '1';
        } else {
            el.style.maxHeight = '0';
            el.style.opacity = '0';
        }
    };

    form.addEventListener('change', (e) => {
        const name = e.target.name;
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        handleConditional(name, value);

        // Tos Productiva → show secretion type
        if (name === 'tos_tipo') {
            const secEl = document.getElementById('cond-tos-secrecion');
            if (secEl) {
                const show = value === 'productiva';
                secEl.classList.toggle('hidden', !show);
            }
        }

        updateProgress();
        debouncedSave();
    });

    // Also listen to input events for progress + auto-save
    form.addEventListener('input', () => {
        updateProgress();
        debouncedSave();
    });

    // ═══════════════════════════════════════════════════
    // 3. AUTO-CALCULATIONS (Improved algorithms)
    // ═══════════════════════════════════════════════════

    // --- 3a. Índice Cajetilla-Año ---
    const updateTabacoIndex = () => {
        const cantEl = document.getElementById('tabaco-cantidad');
        const anosEl = document.getElementById('tabaco-anos');
        const indiceEl = document.getElementById('tabaco-indice');
        if (!cantEl || !anosEl || !indiceEl) return;

        const cant = parseFloat(cantEl.value);
        const anos = parseFloat(anosEl.value);

        if (!isNaN(cant) && !isNaN(anos) && cant > 0 && anos > 0) {
            const index = (cant / 20) * anos;
            indiceEl.value = index.toFixed(1);
        } else {
            indiceEl.value = '';
        }
    };

    // --- 3b. IMC (Body Mass Index) ---
    const updateIMC = () => {
        const peso = parseFloat(document.getElementById('peso_val')?.value);
        const talla = parseFloat(document.getElementById('talla_val')?.value);
        const imcEl = document.getElementById('imc_val');
        const statusEl = document.getElementById('imc_status');
        if (!imcEl || !statusEl) return;

        if (!isNaN(peso) && !isNaN(talla) && peso > 0 && talla > 0) {
            const tallaMt = talla / 100;
            const imc = peso / (tallaMt * tallaMt);
            imcEl.value = imc.toFixed(1);

            // WHO Classification
            let label, cls;
            if (imc < 16) { label = 'Delgadez severa'; cls = 'danger'; }
            else if (imc < 17) { label = 'Delgadez moderada'; cls = 'warning'; }
            else if (imc < 18.5) { label = 'Bajo peso'; cls = 'warning'; }
            else if (imc < 25) { label = 'Normal'; cls = 'success'; }
            else if (imc < 30) { label = 'Sobrepeso'; cls = 'warning'; }
            else if (imc < 35) { label = 'Obesidad I'; cls = 'danger'; }
            else if (imc < 40) { label = 'Obesidad II'; cls = 'danger'; }
            else { label = 'Obesidad III'; cls = 'danger'; }

            setIndicator(statusEl, label, cls);
        } else {
            imcEl.value = '';
            clearIndicator(statusEl);
        }
    };

    // --- 3c. PAM (Mean Arterial Pressure) ---
    const updatePAM = () => {
        const sis = parseFloat(document.getElementById('pa_sis')?.value);
        const dia = parseFloat(document.getElementById('pa_dia')?.value);
        const pamEl = document.getElementById('pam_val');
        const statusEl = document.getElementById('pam_status');
        if (!pamEl || !statusEl) return;

        if (!isNaN(sis) && !isNaN(dia) && sis > 0 && dia > 0) {
            // Validate: systolic must be > diastolic
            if (sis <= dia) {
                pamEl.value = 'Error: PAS ≤ PAD';
                setIndicator(statusEl, 'Revise valores', 'danger');
                return;
            }

            const pam = dia + ((sis - dia) / 3); // Equivalent to (PAS + 2*PAD) / 3
            pamEl.value = Math.round(pam) + ' mmHg';

            let label, cls;
            if (pam < 60) { label = 'Hipotensión severa'; cls = 'danger'; }
            else if (pam < 70) { label = 'Hipotensión'; cls = 'warning'; }
            else if (pam <= 105) { label = 'Normal'; cls = 'success'; }
            else if (pam < 120) { label = 'Elevada'; cls = 'warning'; }
            else { label = '⚠ SUSPENDER INTERVENCIÓN'; cls = 'danger'; }

            setIndicator(statusEl, label, cls);
        } else {
            pamEl.value = '';
            clearIndicator(statusEl);
        }
    };

    // --- 3d. Edad (Age) ---
    const updateEdad = () => {
        const fnacInput = form.querySelector('[name="fecha_nacimiento"]');
        const edadInput = form.querySelector('[name="edad"]');
        if (!fnacInput || !edadInput) return;

        const val = fnacInput.value;
        if (val) {
            const birthDate = new Date(val);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            edadInput.value = age > 0 ? age : 0;
            // Trigger recalculation of progress since we programmatically set a value
            setTimeout(updateProgress, 50);
        }
    };

    // --- 3e. Test de Marcha 6 Minutos (TM6M) Predicho ---
    const updateTM6M = () => {
        const sexoEl = document.getElementById('sexo_val');
        const edadEl = document.getElementById('edad_val');
        const pesoEl = document.getElementById('peso_val');
        const tallaEl = document.getElementById('talla_val');
        const recorridaEl = document.getElementById('tm6m_recorrida');
        const predichaEl = document.getElementById('tm6m_predicha');
        const porcEl = document.getElementById('tm6m_porc');
        
        if (!predichaEl || !porcEl) return;

        let pred = null;
        if (sexoEl && edadEl && pesoEl && tallaEl) {
            const sexo = sexoEl.value;
            const edad = parseFloat(edadEl.value);
            const peso = parseFloat(pesoEl.value);
            const talla = parseFloat(tallaEl.value);

            if (sexo && !isNaN(edad) && !isNaN(peso) && !isNaN(talla)) {
                // Enright & Sherrill (1998)
                if (sexo === 'm') {
                    pred = (7.57 * talla) - (5.02 * edad) - (1.76 * peso) - 309;
                } else if (sexo === 'f') {
                    pred = (2.11 * talla) - (2.29 * peso) - (5.78 * edad) + 667;
                }
            }
        }

        if (pred !== null && pred > 0) {
            predichaEl.value = Math.round(pred);
            if (recorridaEl && !isNaN(parseFloat(recorridaEl.value))) {
                const rec = parseFloat(recorridaEl.value);
                porcEl.value = ((rec / pred) * 100).toFixed(1);
            } else {
                porcEl.value = '';
            }
        } else {
            predichaEl.value = '';
            porcEl.value = '';
        }
    };

    // --- 3f. Clasificación GOLD (Espirometría EPOC) ---
    const updateGOLD = () => {
        const fev1fvcEl = form.querySelector('[name="fev1fvc_obs"]');
        const fev1porcEl = form.querySelector('[name="fev1_porc"]');
        const goldEl = document.getElementById('gold_severidad');
        
        if (!fev1fvcEl || !fev1porcEl || !goldEl) return;

        const fev1fvc = parseFloat(fev1fvcEl.value);
        const fev1 = parseFloat(fev1porcEl.value);

        if (!isNaN(fev1fvc) && !isNaN(fev1)) {
            if (fev1fvc < 70) {
                if (fev1 >= 80) goldEl.value = 'GOLD 1 (Leve)';
                else if (fev1 >= 50) goldEl.value = 'GOLD 2 (Mod)';
                else if (fev1 >= 30) goldEl.value = 'GOLD 3 (Sev)';
                else goldEl.value = 'GOLD 4 (Muy Sev)';
            } else {
                goldEl.value = 'Normal/Restric.';
            }
        } else {
            goldEl.value = '';
        }
    };

    // Bind calculation inputs
    const bindCalc = (id, fn) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', fn);
    };

    bindCalc('tabaco-cantidad', updateTabacoIndex);
    bindCalc('tabaco-anos', updateTabacoIndex);
    bindCalc('peso_val', updateIMC);
    bindCalc('talla_val', updateIMC);
    bindCalc('pa_sis', updatePAM);
    bindCalc('pa_dia', updatePAM);

    const fnacInput = form.querySelector('[name="fecha_nacimiento"]');
    if (fnacInput) {
        fnacInput.addEventListener('change', () => {
            updateEdad();
            updateTM6M();
        });
    }

    const edadId = document.getElementById('edad_val');
    const sexoId = document.getElementById('sexo_val');
    if (edadId) edadId.addEventListener('input', updateTM6M);
    if (sexoId) sexoId.addEventListener('change', updateTM6M);

    bindCalc('tm6m_recorrida', updateTM6M);
    bindCalc('peso_val', updateTM6M);
    bindCalc('talla_val', updateTM6M);

    bindCalc('fev1fvc_obs', updateGOLD);
    bindCalc('fev1_porc', updateGOLD);

    // ═══════════════════════════════════════════════════
    // 4. VITAL SIGNS VALIDATION (Corrected ranges)
    // ═══════════════════════════════════════════════════
    const vitalRanges = {
        fc:   { danger_low: 40,  warn_low: 60,  normal_low: 60,  normal_high: 100, warn_high: 120, danger_high: 150 },
        fr:   { danger_low: 8,   warn_low: 12,  normal_low: 12,  normal_high: 20,  warn_high: 25,  danger_high: 35 },
        spo2: { danger_low: 0,   warn_low: 90,  normal_low: 95,  normal_high: 100, warn_high: 100, danger_high: 101 },
        temp: { danger_low: 34,  warn_low: 36.1, normal_low: 36.1, normal_high: 37.2, warn_high: 38.5, danger_high: 41 }
    };

    const validateVital = (id, val) => {
        const statusEl = document.getElementById(`${id}_status`);
        if (!statusEl) return;
        if (isNaN(val) || val === null || val === undefined) {
            clearIndicator(statusEl);
            return;
        }

        const key = id.replace('_val', '');
        const r = vitalRanges[key];
        if (!r) return;

        let label, cls;
        if (val >= r.normal_low && val <= r.normal_high) {
            label = 'Normal'; cls = 'success';
        } else if (val < r.danger_low || val > r.danger_high) {
            label = 'Crítico'; cls = 'danger';
        } else if (val < r.warn_low || val > r.warn_high) {
            label = 'Alerta'; cls = 'danger';
        } else {
            label = 'Precaución'; cls = 'warning';
        }

        // SpO2: special labels
        if (key === 'spo2') {
            if (val >= 95) { label = 'Normal'; cls = 'success'; }
            else if (val >= 90) { label = 'Hipoxemia leve'; cls = 'warning'; }
            else if (val >= 80) { label = 'Hipoxemia moderada'; cls = 'danger'; }
            else { label = 'Hipoxemia severa'; cls = 'danger'; }
        }

        setIndicator(statusEl, label, cls);
    };

    ['fc_val', 'fr_val', 'spo2_val', 'temp_val'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', (e) => validateVital(id, parseFloat(e.target.value)));
        }
    });

    // ═══════════════════════════════════════════════════
    // 5. INDICATOR HELPERS
    // ═══════════════════════════════════════════════════
    function setIndicator(el, text, cls) {
        el.className = 'val-indicator ' + cls;
        el.textContent = text;
    }

    function clearIndicator(el) {
        el.className = 'val-indicator';
        el.textContent = '';
    }

    // ═══════════════════════════════════════════════════
    // 6. PROGRESS TRACKING (Accurate %)
    // ═══════════════════════════════════════════════════
    const updateProgress = () => {
        const allInputs = form.querySelectorAll('input:not([readonly]):not([type="hidden"]), select, textarea');
        let total = 0;
        let filled = 0;

        allInputs.forEach(input => {
            // Skip hidden conditional fields
            const parent = input.closest('.hidden');
            if (parent) return;

            // Skip N/A sections
            const naSection = input.closest('.na-active');
            if (naSection) return;

            if (input.type === 'checkbox' || input.type === 'radio') {
                // For radio groups, count group once
                const name = input.name;
                if (input.type === 'radio') {
                    const group = form.querySelectorAll(`input[name="${name}"]`);
                    const first = group[0];
                    if (input !== first) return; // only count first radio in group
                    total++;
                    if ([...group].some(r => r.checked)) filled++;
                } else {
                    // Checkbox: each is optional, count if checked
                    total++;
                    if (input.checked) filled++;
                }
            } else {
                total++;
                if (input.value.trim() !== '') filled++;
            }
        });

        const pct = total > 0 ? Math.round((filled / total) * 100) : 0;
        progressFill.style.width = pct + '%';
        progressText.textContent = pct + '%';

        // Color shift based on progress
        if (pct < 30) progressFill.style.background = 'var(--danger)';
        else if (pct < 70) progressFill.style.background = 'var(--warning)';
        else progressFill.style.background = 'var(--success)';
    };

    // ═══════════════════════════════════════════════════
    // 7. PERSISTENCE (LocalStorage with debounce)
    // ═══════════════════════════════════════════════════
    let saveTimeout;
    const debouncedSave = () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveToLocal, 1000);
    };

    const saveToLocal = () => {
        const data = {};
        // Collect all form data including checkboxes
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
        localStorage.setItem('kine_form_v2', JSON.stringify(data));
    };

    const loadFromLocal = () => {
        const saved = localStorage.getItem('kine_form_v2');
        if (!saved) return;

        try {
            const data = JSON.parse(saved);
            Object.keys(data).forEach(key => {
                const val = data[key];
                if (Array.isArray(val)) {
                    // Checkboxes
                    val.forEach(v => {
                        const el = form.querySelector(`input[name="${key}"][value="${v}"]`);
                        if (el) { el.checked = true; el.dispatchEvent(new Event('change', { bubbles: true })); }
                    });
                } else {
                    const els = form.querySelectorAll(`[name="${key}"]`);
                    els.forEach(el => {
                        if (el.type === 'radio') {
                            el.checked = (el.value === val);
                            if (el.checked) el.dispatchEvent(new Event('change', { bubbles: true }));
                        } else {
                            el.value = val;
                        }
                    });
                }
            });

            // Fire calculations
            ['peso_val', 'talla_val', 'pa_sis', 'pa_dia', 'tabaco-cantidad', 'tabaco-anos',
             'fc_val', 'fr_val', 'spo2_val', 'temp_val'].forEach(id => {
                const el = document.getElementById(id);
                if (el && el.value) el.dispatchEvent(new Event('input'));
            });
        } catch (e) {
            console.warn('Error loading saved data:', e);
        }
    };

    // ═══════════════════════════════════════════════════
    // 8. PRINT / EXPORT PDF
    // ═══════════════════════════════════════════════════
    // ═══════════════════════════════════════════════════
    // 8. PRINT / EXPORT PDF & WORD
    // ═══════════════════════════════════════════════════
    const generateReportHtml = () => {
        const name = form.querySelector('[name="nombre"]')?.value?.trim() || 'Desconocido';
        const rut = form.querySelector('[name="rut"]')?.value?.trim() || 'N/A';
        const dateStr = new Date().toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });

        let reportHtml = `
            <div id="dynamic-report">
                <div class="report-header">
                    <h1>INFORME KINÉSICO CARDIORRESPIRATORIO</h1>
                    <div class="patient-meta">
                        <span><strong>Paciente:</strong> ${name} &nbsp;&nbsp;|&nbsp;&nbsp; <strong>RUT:</strong> ${rut}</span>
                        <span><strong>Fecha:</strong> ${dateStr}</span>
                    </div>
                </div>
        `;

        let omittedSections = [];

        form.querySelectorAll('section').forEach(sec => {
            const h2 = sec.querySelector('h2')?.textContent || '';
            if (sec.classList.contains('na-active')) {
                omittedSections.push(h2.replace(/^[0-9IVX]+\.\s*/, ''));
                return;
            }

            let sectionContent = '';
            sec.querySelectorAll('.field-group').forEach(group => {
                if (group.closest('.hidden')) return;
                const label = group.querySelector('label')?.textContent || '';
                if (!label) return;

                const textInput = group.querySelector('input[type="text"], input[type="number"], input[type="date"], select, textarea');
                if (textInput && !textInput.closest('.checkbox-card')) {
                    let val = '';
                    if (textInput.tagName.toLowerCase() === 'select') {
                        if (textInput.selectedIndex >= 0) {
                            val = textInput.options[textInput.selectedIndex].text.trim();
                            if (val.toLowerCase().includes('seleccione') || textInput.value === '') val = '';
                        }
                    } else {
                        val = textInput.value.trim();
                    }

                    if (val) {
                        const isLong = textInput.tagName.toLowerCase() === 'textarea' || val.length > 50;
                        const unit = group.querySelector('.unit')?.textContent || '';
                        const formattedVal = val + (unit ? ' ' + unit : '');

                        sectionContent += `
                            <div class="data-row ${isLong ? 'long-text' : ''}">
                                <span class="data-label">${label}:</span>
                                <span class="data-value">${formattedVal.replace(/\n/g, '<br>')}</span>
                            </div>
                        `;
                    }
                    return;
                }

                const checks = group.querySelectorAll('input[type="checkbox"], input[type="radio"]');
                if (checks.length > 0) {
                    const selected = Array.from(checks).filter(c => c.checked).map(c => {
                        return c.closest('.checkbox-card')?.querySelector('span')?.textContent || c.value;
                    });
                    if (selected.length > 0) {
                        sectionContent += `
                            <div class="data-row checklist-row">
                                <span class="data-label">${label}:</span>
                                <span class="data-value">
                                    <ul class="checklist">
                                        ${selected.map(s => `<li>${s}</li>`).join('')}
                                    </ul>
                                </span>
                            </div>
                        `;
                    }
                }
            });

            if (sectionContent) {
                reportHtml += `<h2>${h2}</h2><div class="section-body">${sectionContent}</div>`;
            }
        });

        if (omittedSections.length > 0) {
            reportHtml += `
            <div class="omitted-tracing" style="margin-top: 2rem; padding: 1rem; background: rgba(0,0,0,0.03); border: 1px dashed #94a3b8; font-size: 0.85rem; border-radius: 6px;">
                <p style="margin:0 0 0.5rem 0; font-weight:bold; color: #475569;">Declaración de Hitos Clínicos No Aplicados / Omitidos:</p>
                <p style="margin:0; color: #64748b;">${omittedSections.join(', ')}</p>
            </div>`;
        }

        reportHtml += `
            <div class="signatures">
                <div class="sig-box">
                    <div class="sig-line"></div>
                    <p class="sig-name">Kinesiólogo Tratante</p>
                    <p class="sig-role">Nombre y Registro</p>
                </div>
                <div class="sig-box">
                    <div class="sig-line"></div>
                    <p class="sig-name">Paciente / Tutor</p>
                    <p class="sig-role">Firma Aceptación</p>
                </div>
            </div>
        </div>`;
        return reportHtml;
    };

    // PDF Export
    document.getElementById('btn-print').addEventListener('click', () => {
        if (!form.reportValidity()) return;
        
        const reportHtml = generateReportHtml();
        const existing = document.getElementById('dynamic-report');
        if (existing) existing.remove();
        
        document.body.insertAdjacentHTML('beforeend', reportHtml);

        const savedHash = window.location.hash;
        history.replaceState(null, '', window.location.pathname);

        setTimeout(() => {
            window.print();
            if (savedHash) history.replaceState(null, '', savedHash);
            document.getElementById('dynamic-report')?.remove();
        }, 100);
    });

    // Word Export
    document.getElementById('btn-word').addEventListener('click', () => {
        if (!form.reportValidity()) return;

        const name = form.querySelector('[name="nombre"]')?.value?.trim() || 'Paciente';
        const reportHtml = generateReportHtml();

        // Basic CSS for Word
        const css = `
            <style>
                body { font-family: 'Arial', sans-serif; }
                h1 { text-align: center; color: #0F2B46; font-size: 18pt; border-bottom: 2pt solid #0F2B46; padding-bottom: 10px; }
                .patient-meta { margin-bottom: 20pt; border-bottom: 1pt solid #ccc; padding-bottom: 10pt; }
                h2 { background: #F0F4F8; color: #1A3D5C; font-size: 14pt; padding: 5pt; margin-top: 20pt; }
                .data-row { margin-bottom: 5pt; }
                .data-label { font-weight: bold; color: #64748B; text-transform: uppercase; font-size: 9pt; }
                .data-value { font-size: 11pt; }
                .signatures { margin-top: 50pt; }
                .sig-box { width: 45%; float: left; text-align: center; }
                .sig-line { border-top: 1pt solid black; margin-top: 40pt; }
            </style>
        `;

        const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'>${css}</head><body>`;
        const footer = "</body></html>";
        const sourceHTML = header + reportHtml + footer;

        const blob = new Blob(['\ufeff', sourceHTML], {
            type: 'application/msword'
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Ficha_Kinesica_${name.replace(/\s+/g, '_')}.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });

    // ═══════════════════════════════════════════════════
    // 9. VISUAL: Checkbox/Radio card toggle
    // ═══════════════════════════════════════════════════
    form.addEventListener('change', (e) => {
        const card = e.target.closest('.checkbox-card');
        if (!card) return;

        if (e.target.type === 'radio') {
            const name = e.target.name;
            form.querySelectorAll(`input[name="${name}"]`).forEach(input => {
                const c = input.closest('.checkbox-card');
                if (c) c.classList.remove('selected');
            });
            card.classList.add('selected');
        } else if (e.target.type === 'checkbox') {
            card.classList.toggle('selected', e.target.checked);
        }
    });

    // ═══════════════════════════════════════════════════
    // 10. CLEAR FORM
    // ═══════════════════════════════════════════════════
    const btnClear = document.getElementById('btn-clear');
    if (btnClear) {
        btnClear.addEventListener('click', () => {
            if (confirm('¿Desea limpiar todo el formulario? Se perderán los datos no exportados.')) {
                form.reset();
                localStorage.removeItem('kine_form_v2');
                localStorage.removeItem('kine_na_sections');
                document.querySelectorAll('.checkbox-card.selected').forEach(c => c.classList.remove('selected'));
                document.querySelectorAll('.val-indicator').forEach(el => clearIndicator(el));
                document.querySelectorAll('[readonly]').forEach(el => el.value = '');
                document.querySelectorAll('.hidden').forEach(el => {
                    el.style.maxHeight = '0';
                    el.style.opacity = '0';
                });
                // Reset all N/A toggles
                sections.forEach(sec => {
                    sec.classList.remove('na-active');
                    const btn = sec.querySelector('.btn-na');
                    if (btn) btn.classList.remove('active');
                });
                updateProgress();
            }
        });
    }

    // ═══════════════════════════════════════════════════
    // 11. N/A SECTION TOGGLE
    // ═══════════════════════════════════════════════════
    const setupNAToggles = () => {
        // Inject a N/A button into every section-head
        sections.forEach(sec => {
            const head = sec.querySelector('.section-head');
            if (!head) return;

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn-na';
            btn.textContent = 'N/A';
            btn.title = 'Marcar sección como No Aplica';
            head.appendChild(btn);

            btn.addEventListener('click', () => {
                const isNA = sec.classList.toggle('na-active');
                btn.classList.toggle('active', isNA);
                
                const link = document.querySelector(`.nav-link[data-section="${sec.id}"]`);
                if (link) link.classList.toggle('na-omitted', isNA);

                saveNASections();
                updateProgress();
                debouncedSave();
            });
        });
    };

    const saveNASections = () => {
        const naIds = [];
        sections.forEach(sec => {
            if (sec.classList.contains('na-active')) {
                naIds.push(sec.id);
            }
        });
        localStorage.setItem('kine_na_sections', JSON.stringify(naIds));
    };

    const loadNASections = () => {
        const saved = localStorage.getItem('kine_na_sections');
        if (!saved) return;
        try {
            const naIds = JSON.parse(saved);
            naIds.forEach(id => {
                const sec = document.getElementById(id);
                if (sec) {
                    sec.classList.add('na-active');
                    const btn = sec.querySelector('.btn-na');
                    if (btn) btn.classList.add('active');
                    
                    const link = document.querySelector(`.nav-link[data-section="${id}"]`);
                    if (link) link.classList.add('na-omitted');
                }
            });
        } catch (e) { /* ignore parse errors */ }
    };

    // ═══════════════════════════════════════════════════
    // INIT
    // ═══════════════════════════════════════════════════
    setupNAToggles();
    loadFromLocal();
    loadNASections();
    updateProgress();
});

