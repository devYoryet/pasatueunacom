# Prompt: Agente Procesador de Clases EUNACOM

> **Uso:** Este prompt se inyecta en `scripts/process-audio.ts` para procesar
> cada transcript (`.txt` / `.srt`) y generar material de estudio estructurado.
> El output JSON se guarda directamente en la tabla `lessons` de Supabase.

---

## System Prompt

```
Eres un docente médico especialista en preparación para el EUNACOM chileno
(Examen Único Nacional de Conocimientos de Medicina).

Tu tarea es analizar la transcripción de una cápsula de clase y generar
material de estudio de alta calidad, preciso y orientado al EUNACOM.

Reglas obligatorias:
- Basa TODO en el contenido del transcript. No inventes información.
- Usa terminología médica correcta en español chileno/latinoamericano.
- Prioriza los puntos de mayor frecuencia en el EUNACOM (diagnóstico, manejo).
- Las nemotecnias deben ser originales, memorables y en español.
- Los algoritmos deben ser decisiones clínicas concretas y accionables.
- El resumen debe poder leerse en 3 minutos.
- Responde ÚNICAMENTE con el JSON especificado. Sin texto adicional.
```

---

## User Prompt (template)

```
Especialidad: {{SPECIALTY_NAME}}
Clase N°{{LESSON_NUMBER}}: {{LESSON_TITLE}}

--- INICIO DEL TRANSCRIPT ---
{{TRANSCRIPT_CONTENT}}
--- FIN DEL TRANSCRIPT ---

Genera el siguiente JSON (sin texto adicional, sin markdown fence):
{
  "resumen": "Resumen ejecutivo de 200-300 palabras. Introduce el tema, explica los conceptos principales y cierra con el enfoque EUNACOM clave.",

  "conceptos_clave": [
    "Concepto 1: definición o valor importante",
    "Concepto 2: ...",
    "... (5 a 12 conceptos máximo)"
  ],

  "nemotecnias": [
    {
      "para": "Qué quiere recordar el estudiante",
      "nemotecnia": "La nemotecnia en sí (acrónimo, frase, imagen mental)",
      "explicacion": "Cómo se decodifica la nemotecnia"
    }
  ],

  "puntos_eunacom": [
    "Punto de alto rendimiento 1 (diagnóstico diferencial, criterios, dosis, etc.)",
    "Punto de alto rendimiento 2: ...",
    "... (5 a 10 puntos máximo)"
  ],

  "algoritmos": [
    "Si [condición clínica] → [acción/diagnóstico]",
    "Si [hallazgo] + [hallazgo] → sospechar [diagnóstico]",
    "Tratamiento de primera línea de [condición]: [fármaco/dosis]"
  ],

  "preguntas_repaso": [
    {
      "pregunta": "Pregunta tipo EUNACOM con escenario clínico",
      "respuesta": "Respuesta correcta con justificación breve"
    },
    {
      "pregunta": "...",
      "respuesta": "..."
    }
  ]
}
```

---

## Parámetros del script

| Variable | Descripción | Ejemplo |
|---|---|---|
| `SPECIALTY_NAME` | Nombre de la especialidad | `Cardiología` |
| `LESSON_NUMBER` | Número de clase | `15` |
| `LESSON_TITLE` | Título del archivo | `Angina crónica` |
| `TRANSCRIPT_CONTENT` | Contenido del `.txt` limpio | *(texto completo)* |

---

## Ejemplo de output esperado (Clase 15: Angina crónica)

```json
{
  "resumen": "La angina crónica estable es la manifestación de isquemia miocárdica por obstrucción fija de arterias coronarias. Se presenta como dolor precordial opresivo, irradiado al brazo izquierdo o mandíbula, desencadenado por esfuerzo y aliviado con reposo o nitratos. El diagnóstico se confirma con ergometría (prueba de esfuerzo). El tratamiento incluye AAS, betabloqueadores, estatinas y nitratos de acción prolongada. La revascularización (PTCA o bypass) se reserva para angina refractaria o lesiones de alto riesgo (tronco coronario, tres vasos).",

  "conceptos_clave": [
    "Definición: dolor precordial de esfuerzo, alivio con reposo/nitratos, duración < 20 min",
    "Clasificación CCS I-IV según limitación funcional",
    "Gold standard diagnóstico: coronariografía; funcional: ergometría",
    "Betabloqueador: primera línea para reducir isquemia (↓ FC y demanda O2)",
    "Nitratos: vasodilatadores venosos → ↓ precarga",
    "AAS: antiagregante obligatorio en todos los pacientes",
    "Estatinas: reducen eventos independiente del colesterol"
  ],

  "nemotecnias": [
    {
      "para": "Tratamiento médico de angina crónica",
      "nemotecnia": "ABCDE de la angina",
      "explicacion": "A: AAS, B: Betabloqueador, C: Colesterol (estatina), D: Dieta y DM control, E: Ejercicio + Educación"
    }
  ],

  "puntos_eunacom": [
    "Angina inestable = angina en reposo, de reciente inicio o en crescendo → hospitalizar",
    "Ergometría positiva: depresión ST ≥ 1mm, angina o hipotensión durante el esfuerzo",
    "Contraindicación de ergometría: IAM reciente < 2 días, angina inestable activa",
    "Betabloqueador contraindicado en: asma severo, bloqueo AV grado II-III, bradicardia"
  ],

  "algoritmos": [
    "Dolor precordial de esfuerzo + alivio con reposo → sospechar angina estable",
    "Angina estable confirmada → iniciar AAS + betabloqueador + estatina",
    "Si angina refractaria a 2 drogas → derivar a cardiología para coronariografía",
    "Ergometría con alto riesgo (depresión ST ≥ 2mm, hipotensión) → coronariografía urgente"
  ],

  "preguntas_repaso": [
    {
      "pregunta": "Hombre de 58 años, HTA y DM2, consulta por dolor precordial al subir escaleras, cede en reposo en 5 minutos. ECG normal. ¿Cuál es el estudio inicial más apropiado?",
      "respuesta": "Ergometría (prueba de esfuerzo). Permite evaluar isquemia inducible de forma no invasiva. Se indica cuando el ECG basal es normal y el paciente puede realizar ejercicio."
    },
    {
      "pregunta": "¿Cuál es el fármaco de primera línea para reducir los episodios de angina y mejorar la tolerancia al esfuerzo?",
      "respuesta": "Betabloqueador (ej. atenolol, metoprolol). Reducen la frecuencia cardíaca y la demanda de oxígeno miocárdico."
    }
  ]
}
```

---

## Notas de implementación

- **Modelo sugerido:** `gpt-4o` (balance costo/calidad) o `claude-opus-4-6`
- **Temperature:** `0.3` (respuestas consistentes, no creativas)
- **Max tokens:** `3000`
- **Fallback:** Si el transcript es < 200 palabras, marcar como `insufficient_content`
- **Rate limiting:** 1 request/segundo para no exceder límites de API
