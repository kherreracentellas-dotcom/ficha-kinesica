export const ClinicalCalculations = {
    calculateBMI(weight, heightCm) {
        const heightM = heightCm / 100;
        if (!weight || !heightM) return 0;
        return (weight / (heightM * heightM)).toFixed(1);
    },

    calculateMAP(systolic, diastolic) {
        if (!systolic || !diastolic) return 0;
        return Math.round((parseFloat(systolic) + (2 * parseFloat(diastolic))) / 3);
    },

    getGOLDGrade(fev1_porc, ratio) {
        if (!fev1_porc || ratio >= 70) return 'N/A';
        const p = parseFloat(fev1_porc);
        if (p >= 80) return 'GOLD 1 (Leve)';
        if (p >= 50) return 'GOLD 2 (Moderado)';
        if (p >= 30) return 'GOLD 3 (Severo)';
        return 'GOLD 4 (Muy Severo)';
    },

    calculateTM6MPredicted(sex, age, weight, height) {
        if (!age || !weight || !height) return 0;
        const a = parseFloat(age);
        const w = parseFloat(weight);
        const h = parseFloat(height);
        if (sex === 'masculino') {
            return Math.round((7.57 * h) - (5.02 * a) - (1.76 * w) - 309);
        } else {
            return Math.round((2.11 * h) - (2.29 * a) - (0.57 * w) + 667);
        }
    },

    calculateTM6MPercentage(walked, predicted) {
        if (!walked || !predicted) return 0;
        return ((walked / predicted) * 100).toFixed(1);
    },

    calculatePercentage(observed, predicted) {
        if (!observed || !predicted) return 0;
        return ((observed / predicted) * 100).toFixed(1);
    },

    calculateTiffeneau(fev1, fvc) {
        if (!fev1 || !fvc) return 0;
        return ((fev1 / fvc) * 100).toFixed(1);
    }
};
