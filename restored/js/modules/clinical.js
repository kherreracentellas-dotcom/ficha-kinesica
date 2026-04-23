/**
 * clinical.js
 * Centralizes all medical calculations and clinical formulas.
 */

export const ClinicalCalculations = {
    /**
     * Body Mass Index (BMI / IMC)
     */
    calculateBMI(weight, heightCm) {
        const heightM = heightCm / 100;
        if (!weight || !heightM) return 0;
        return (weight / (heightM * heightM)).toFixed(1);
    },

    /**
     * Mean Arterial Pressure (MAP / PAM)
     */
    calculateMAP(systolic, diastolic) {
        if (!systolic || !diastolic) return 0;
        return Math.round((systolic + (2 * diastolic)) / 3);
    },

    /**
     * GOLD Severity Grade for COPD
     */
    getGOLDGrade(fev1_porc, ratio) {
        if (!fev1_porc || ratio >= 70) return 'N/A';
        if (fev1_porc >= 80) return 'GOLD 1 (Leve)';
        if (fev1_porc >= 50) return 'GOLD 2 (Moderado)';
        if (fev1_porc >= 30) return 'GOLD 3 (Severo)';
        return 'GOLD 4 (Muy Severo)';
    },

    /**
     * Predicted distance for 6-Minute Walk Test (Enright 1998)
     */
    calculateTM6MPredicted(sex, age, weight, height) {
        if (!age || !weight || !height) return 0;
        if (sex === 'masculino') {
            return Math.round((7.57 * height) - (5.02 * age) - (1.76 * weight) - 309);
        } else {
            return Math.round((2.11 * height) - (2.29 * age) - (0.57 * weight) + 667);
        }
    },

    /**
     * Percentage of Predicted for TM6M
     */
    calculateTM6MPercentage(walked, predicted) {
        if (!walked || !predicted) return 0;
        return ((walked / predicted) * 100).toFixed(1);
    },

    /**
     * Respiratory Percentages
     */
    calculatePercentage(observed, predicted) {
        if (!observed || !predicted) return 0;
        return ((observed / predicted) * 100).toFixed(1);
    },

    /**
     * Tiffeneau Index (FEV1/FVC)
     */
    calculateTiffeneau(fev1, fvc) {
        if (!fev1 || !fvc) return 0;
        return ((fev1 / fvc) * 100).toFixed(1);
    }
};
