document.addEventListener('DOMContentLoaded', () => {
    // ═══════════════════════════════════════════════════
    // 0. AUTHENTICATION LOGIC (Local Simulation)
    // ═══════════════════════════════════════════════════
    const authOverlay = document.getElementById('auth-overlay');
    const authForm = document.getElementById('auth-form');
    const displayUsername = document.getElementById('display-username');
    const userAvatar = document.getElementById('user-avatar');
    const btnLogout = document.getElementById('btn-logout');
    
    let currentUser = localStorage.getItem('kine_current_user');

    const updateAuthUI = () => {
        if (currentUser) {
            authOverlay.classList.add('hidden');
            displayUsername.textContent = currentUser;
            userAvatar.textContent = currentUser.charAt(0).toUpperCase();
            // Load data for this user
            loadFromLocal();
            loadNASections();
            updateProgress();
        } else {
            authOverlay.classList.remove('hidden');
        }
    };

    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('auth-username').value.trim();
        const pass = document.getElementById('auth-password').value; // Simple validation simulation

        if (user && pass.length >= 4) {
            currentUser = user;
            localStorage.setItem('kine_current_user', user);
            showToast(`Bienvenido/a, ${user}`, 'success');
            updateAuthUI();
        } else {
            showToast('Ingresa un usuario y clave (min 4 carac.)', 'danger');
        }
    });

    btnLogout.addEventListener('click', () => {
        if (confirm('¿Cerrar sesión? Los cambios locales se mantendrán.')) {
            currentUser = null;
            localStorage.removeItem('kine_current_user');
            window.location.reload(); // Refresh to clear state
        }
    });

    // Initialize Auth
    updateAuthUI();

    // ═══════════════════════════════════════════════════
    // 0.1. INPUT FORMATTERS
    // ═══════════════════════════════════════════════════
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


    const form = document.querySelector('#evaluation-form');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const progressFill = document.querySelector('#progress-fill');
    const progressText = document.querySelector('#progress-text');
    const currentSectionName = document.querySelector('#current-section-name');

    // ═══════════════════════════════════════════════════
    // 1. SCROLL SPY & SIDEBAR NAVIGATION
    // ═══════════════════════════════════════════════════
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const sidebar = document.querySelector('aside.sidebar');
    const btnMenu = document.getElementById('btn-menu');

    // Toggle Sidebar Mobile
    if (btnMenu) {
        btnMenu.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Close sidebar when clicking a link (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });
    });

    // Navigation Logic
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href').replace('#', '');
            const target = document.getElementById(id);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // Sidebar/Bottom Nav click: scroll without changing URL hash
    // Sidebar/Bottom Nav click: scroll without changing URL hash
    const allNavLinks = [...navLinks, ...mobileNavLinks];
    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.id === 'btn-mobile-print' || link.id === 'btn-sidebar-print') return; // Skip for print button
            e.preventDefault();
            const targetId = (link.getAttribute('href') || `#${link.getAttribute('data-section')}`).substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Mobile/Sidebar Print Buttons
    ['btn-mobile-print', 'btn-sidebar-print'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', () => {
                const desktopPrintBtn = document.getElementById('btn-print');
                if (desktopPrintBtn) desktopPrintBtn.click();
            });
        }
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

    // Real-time vital signs monitoring
    const vitalRanges = {
        'fc_val': [60, 100],
        'fr_val': [12, 20],
        'spo2_val': [94, 100],
        'temp_val': [36, 37.5],
        'pa_sis': [90, 140],
        'pa_dia': [60, 90]
    };

    Object.keys(vitalRanges).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                const [min, max] = vitalRanges[id];
                const statusEl = document.getElementById(`${id}_status`) || 
                               (id.includes('pa_') ? document.getElementById('pam_status') : null);
                
                if (isNaN(val)) {
                    clearIndicator(statusEl, el);
                    return;
                }

                let label = 'Normal', cls = 'success';
                if (val < min || val > max) {
                    label = 'Fuera de rango';
                    cls = 'danger';
                    
                    // Specific labels
                    if (id === 'fc_val') label = val < min ? 'Bradicardia' : 'Taquicardia';
                    if (id === 'fr_val') label = val < min ? 'Bradipnea' : 'Taquipnea';
                    if (id === 'spo2_val') label = 'Hipoxemia';
                    if (id === 'temp_val') label = val < min ? 'Hipotermia' : 'Fiebre';
                }

                setIndicator(statusEl, label, cls, el);
            });
        }
    });

    ['fc_val', 'fr_val', 'spo2_val', 'temp_val'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', (e) => validateVital(id, parseFloat(e.target.value)));
        }
    });

    // ═══════════════════════════════════════════════════
    // 5. INDICATOR HELPERS
    // ═══════════════════════════════════════════════════
    function setIndicator(el, text, cls, inputEl) {
        if (el) {
            el.className = 'val-indicator ' + cls;
            el.textContent = text;
        }
        
        const card = inputEl?.closest('.vital-card');
        if (card) {
            card.classList.remove('vital-alert-danger', 'vital-alert-success', 'vital-alert-warning');
            card.classList.add('vital-alert-' + cls);
        }
    }

    function clearIndicator(el, inputEl) {
        if (el) {
            el.className = 'val-indicator';
            el.textContent = '';
        }
        const card = inputEl?.closest('.vital-card');
        if (card) {
            card.classList.remove('vital-alert-danger', 'vital-alert-success', 'vital-alert-warning');
        }
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
        saveTimeout = setTimeout(() => {
            saveToLocal();
            showToast('Progreso guardado automáticamente', 'success');
        }, 2000); // 2s debounce for less noise
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
        
        // Add signatures
        data['sig_kine'] = document.getElementById('sig-kine').toDataURL();
        data['sig_patient'] = document.getElementById('sig-patient').toDataURL();

        if (currentUser) {
            localStorage.setItem(`kine_form_${currentUser}`, JSON.stringify(data));
        }
    };

    const loadFromLocal = () => {
        if (!currentUser) return;
        const saved = localStorage.getItem(`kine_form_${currentUser}`);
        if (!saved) return;

        try {
            const data = JSON.parse(saved);
            Object.keys(data).forEach(key => {
                const val = data[key];
                if (key === 'sig_kine' || key === 'sig_patient') {
                    const canvas = document.getElementById(key === 'sig_kine' ? 'sig-kine' : 'sig-patient');
                    const img = new Image();
                    img.onload = () => canvas.getContext('2d').drawImage(img, 0, 0);
                    img.src = val;
                    return;
                }
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

        // Signatures (Capturing from Canvas)
        const sigKine = document.getElementById('sig-kine').toDataURL();
        const sigPatient = document.getElementById('sig-patient').toDataURL();
        
        // Helper to check if canvas is empty (simplified)
        const isCanvasEmpty = (id) => {
            const canvas = document.getElementById(id);
            const blank = document.createElement('canvas');
            blank.width = canvas.width;
            blank.height = canvas.height;
            return canvas.toDataURL() === blank.toDataURL();
        };

        reportHtml += `
            <div class="signatures">
                <div class="sig-box">
                    ${!isCanvasEmpty('sig-kine') ? `<img src="${sigKine}" style="width:100%; max-height:80px;">` : '<div class="sig-line"></div>'}
                    <p class="sig-name">Kinesiólogo Tratante</p>
                    <p class="sig-role">Nombre y Registro</p>
                </div>
                <div class="sig-box">
                    ${!isCanvasEmpty('sig-patient') ? `<img src="${sigPatient}" style="width:100%; max-height:80px;">` : '<div class="sig-line"></div>'}
                    <p class="sig-name">Paciente / Tutor</p>
                    <p class="sig-role">Firma Aceptación</p>
                </div>
            </div>
        </div>`;
        return reportHtml;
    };

    // Exportación a PDF (Mejorado para evitar efecto 'screenshot')
    document.getElementById('btn-print').addEventListener('click', () => {
        if (!form.reportValidity()) return;
        
        const name = form.querySelector('[name="nombre"]')?.value?.trim() || 'Paciente';
        const reportHtml = generateReportHtml();
        
        // Crear un contenedor temporal para el reporte con estilos básicos
        const element = document.createElement('div');
        element.innerHTML = reportHtml;
        element.style.padding = '20px';
        element.style.background = 'white';

        // Configuración de html2pdf
        const opt = {
            margin:       [15, 15],
            filename:     `Ficha_Kinesica_${name.replace(/\s+/g, '_')}.pdf`,
            image:        { type: 'jpeg', quality: 1.0 },
            html2canvas:  { 
                scale: 3, // Alta resolución para nitidez
                useCORS: true,
                letterRendering: true,
                logging: false
            },
            jsPDF:        { unit: 'mm', format: 'letter', orientation: 'portrait' }
        };

        // Generar el PDF directamente
        showToast('Generando PDF de alta calidad...', 'success');
        html2pdf().set(opt).from(element).save().then(() => {
            showToast('PDF descargado con éxito', 'success');
        }).catch(err => {
            console.error('Error al generar PDF:', err);
            showToast('Error al generar el PDF', 'danger');
        });
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
                if (currentUser) {
                    localStorage.removeItem(`kine_form_${currentUser}`);
                    localStorage.removeItem(`kine_na_sections_${currentUser}`);
                }
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
        if (!currentUser) return;
        const naIds = [];
        sections.forEach(sec => {
            if (sec.classList.contains('na-active')) {
                naIds.push(sec.id);
            }
        });
        localStorage.setItem(`kine_na_sections_${currentUser}`, JSON.stringify(naIds));
    };

    const loadNASections = () => {
        if (!currentUser) return;
        const saved = localStorage.getItem(`kine_na_sections_${currentUser}`);
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

    // ═══════════════════════════════════════════════════
    // 12. THEME SWITCHER
    // ═══════════════════════════════════════════════════
    const btnTheme = document.getElementById('btn-theme');
    const savedTheme = localStorage.getItem('kine_theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    btnTheme.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('kine_theme', next);
        showToast(`Modo ${next === 'dark' ? 'oscuro' : 'claro'} activado`);
    });

    // ═══════════════════════════════════════════════════
    // 13. NOTIFICATIONS (TOASTS)
    // ═══════════════════════════════════════════════════
    function showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = '';
        if (type === 'success') icon = '✓';
        else if (type === 'danger') icon = '⚠';
        else icon = 'ℹ';

        toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // Expose for other buttons
    document.getElementById('btn-print').addEventListener('click', () => showToast('Generando PDF...'));
    document.getElementById('btn-word').addEventListener('click', () => showToast('Descargando archivo Word...'));

    // ═══════════════════════════════════════════════════
    // 14. SIGNATURE PAD LOGIC
    // ═══════════════════════════════════════════════════
    const setupSignature = (id) => {
        const canvas = document.getElementById(id);
        const ctx = canvas.getContext('2d');
        let drawing = false;

        const getPos = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: (clientX - rect.left) * (canvas.width / rect.width),
                y: (clientY - rect.top) * (canvas.height / rect.height)
            };
        };

        const start = (e) => {
            drawing = true;
            const pos = getPos(e);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            e.preventDefault();
        };

        const move = (e) => {
            if (!drawing) return;
            const pos = getPos(e);
            ctx.lineTo(pos.x, pos.y);
            ctx.strokeStyle = '#0F2B46';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.stroke();
            e.preventDefault();
        };

        const stop = () => {
            if (drawing) {
                drawing = false;
                debouncedSave();
            }
        };

        canvas.addEventListener('mousedown', start);
        canvas.addEventListener('mousemove', move);
        window.addEventListener('mouseup', stop);

        canvas.addEventListener('touchstart', start, { passive: false });
        canvas.addEventListener('touchmove', move, { passive: false });
        canvas.addEventListener('touchend', stop);
    };

    setupSignature('sig-kine');
    setupSignature('sig-patient');

    document.querySelectorAll('.btn-clear-sig').forEach(btn => {
        btn.addEventListener('click', () => {
            const canvas = document.getElementById(btn.dataset.target);
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            debouncedSave();
        });
    });
});

