import { z } from 'zod';

/**
 * Esquema de Validación para la Ficha Kinésica
 * Define las reglas de negocio y formatos esperados para cada sección.
 */

export const pacienteSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  rut: z.string().regex(/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/, "Formato de RUT inválido (ej: 12.345.678-9)"),
  edad: z.number().min(0, "La edad no puede ser negativa").max(120, "Edad fuera de rango"),
  sexo: z.enum(['M', 'F', 'I', 'NR'], { errorMap: () => ({ message: "Seleccione un sexo biológico" }) }),
  fecha_nacimiento: z.string().min(1, "Fecha de nacimiento es requerida"),
  ocupacion: z.string().optional(),
  prevision: z.string().optional(),
  peso: z.string().or(z.number()).optional(),
  talla: z.string().or(z.number()).optional(),
});

export const vitalesSchema = z.object({
  pa_sistolica: z.string().or(z.number()).refine(val => !val || (parseInt(val) > 40 && parseInt(val) < 250), "Presión sistólica fuera de rango fisiológico"),
  pa_diastolica: z.string().or(z.number()).refine(val => !val || (parseInt(val) > 30 && parseInt(val) < 150), "Presión diastólica fuera de rango fisiológico"),
  fc: z.string().or(z.number()).refine(val => !val || (parseInt(val) > 20 && parseInt(val) < 220), "FC fuera de rango"),
  fr: z.string().or(z.number()).refine(val => !val || (parseInt(val) > 4 && parseInt(val) < 60), "FR fuera de rango"),
  spo2: z.string().or(z.number()).refine(val => !val || (parseInt(val) >= 0 && parseInt(val) <= 100), "SpO2 debe estar entre 0 y 100%"),
});

export const fichaCompletaSchema = z.object({
  paciente: pacienteSchema,
  vitales: vitalesSchema,
  // Las demás secciones se pueden validar de forma más flexible o estricta según se requiera
});
