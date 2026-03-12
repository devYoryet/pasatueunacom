# Capítulo 1: Diabetes Mellitus — Índice de Cápsulas de Audio

> **Especialidad:** Diabetes y Nutrición | **Código DB:** `diabetes`
> **Total cápsulas:** 24 | **Duración total estimada:** ~4 horas
> **Fuente:** Dr. Guevara — Cátedra EUNACOM

---

## Cómo usar este material

Cada cápsula es una unidad de estudio independiente. El flujo recomendado:

```
[Audio MP3] → [Guion / Texto] → [Resumen Clave] → [Nemotecnia] → [Pregunta de Autoevaluación]
```

En la plataforma EunacomGo cada cápsula corresponde a una **lesson** en la tabla `lessons`,
visible en `/app/specialties/diabetes`. Las primeras 3 son de **free preview**.

---

## Bloque 1: Clasificación y Diagnóstico

| N° | Archivo | Título | Estado |
|---|---|---|---|
| 01 | `capsula_01_tipos_diabetes.md` | Clasificación y Diferenciación de los Tipos de Diabetes Mellitus | ✅ Listo |
| 02 | `capsula_02_diagnostico_diabetes.md` | Diagnóstico de DM — Criterios, Screening y Estados Intermedios | ✅ Listo |
| 03 | `capsula_03_diagnostico_embarazo.md` | Diagnóstico de DM en el Embarazo — Gestacional y Pregestacional | ✅ Listo |

## Bloque 2: Insulinoterapia

| N° | Archivo | Título | Estado |
|---|---|---|---|
| 04 | `capsula_04_insulinoterapia_generalidades.md` | Insulinoterapia — Tipos, Características y Esquemas | ✅ Listo |
| 05 | `capsula_05_ajustes_insulinoterapia.md` | Ajustes de Insulinoterapia — Lógica Clínica y Casos Prácticos | ✅ Listo |

## Bloque 3: Objetivos y Tratamiento Oral

| N° | Archivo | Título | Estado |
|---|---|---|---|
| 06 | `capsula_06_objetivos_manejo.md` | Objetivos del Manejo — Metas Metabólicas y Cardiovasculares | ✅ Listo |
| 07 | `capsula_07_hipoglicemiantes_orales.md` | Hipoglicemiantes Orales en DM2 — Familias, Mecanismos e Indicaciones | ✅ Listo |
| 08 | `capsula_08_tratamiento_dm2.md` | Tratamiento Escalonado de la DM2 | 🔄 En proceso |

## Bloque 4: Diabetes en el Embarazo

| N° | Archivo | Título | Estado |
|---|---|---|---|
| 09 | `capsula_09_dmg_control_glicemico.md` | DMG — Control Glicémico y Metas | 🔄 En proceso |
| 10 | `capsula_10_dmg_control_obstetrico.md` | DMG — Control Obstétrico y Manejo Perinatal | 🔄 En proceso |
| 11 | `capsula_11_indicaciones_insulina.md` | Indicaciones de Insulina en Diabetes | 🔄 En proceso |
| 12 | `capsula_12_ejercicio_diabetes.md` | Ejercicio como Tratamiento en Diabetes | 🔄 En proceso |

## Bloque 5: Complicaciones Crónicas

| N° | Archivo | Título | Estado |
|---|---|---|---|
| 13 | `capsula_13_hta_diabeticos.md` | Manejo de la HTA en el Paciente Diabético | ✅ Listo |
| 14 | `capsula_14_nefropatia_diabetica.md` | Nefropatía Diabética — Diagnóstico y Manejo | ✅ Listo |
| 15 | `capsula_15_retinopatia_diabetica.md` | Retinopatía Diabética — Clasificación y Manejo | ✅ Listo |
| 16 | `capsula_16_pie_diabetico.md` | Pie Diabético — Prevención, Clasificación y Manejo | ✅ Listo |
| 17 | `capsula_17_neuropatia_diabetica.md` | Neuropatía Diabética — Formas Clínicas y Tratamiento | ✅ Listo |

## Bloque 6: Complicaciones Agudas

| N° | Archivo | Título | Estado |
|---|---|---|---|
| 18 | `capsula_18_cetoacidosis_vs_hgho.md` | CAD vs Síndrome Hiperosmolar — Diagnóstico Diferencial | ✅ Listo |
| 19 | `capsula_19_tratamiento_cad_hgho.md` | Tratamiento de CAD y HGHO | ✅ Listo |
| 20 | `capsula_20_hipoglicemia_generalidades.md` | Hipoglicemia — Generalidades, Clínica y Tratamiento | ✅ Listo |
| 21 | `capsula_21_causas_estudio_hipoglicemia.md` | Causas y Estudio Etiológico de la Hipoglicemia | ✅ Listo |

## Bloque 7: Dislipidemias

| N° | Archivo | Título | Estado |
|---|---|---|---|
| 22 | `capsula_22_tratamiento_dislipidemias.md` | Tratamiento de las Dislipidemias | 🔄 En proceso |
| 23 | `capsula_23_miopatia_estatinas.md` | Miopatía por Estatinas — Diagnóstico y Manejo | 🔄 En proceso |
| 24 | `capsula_24_dislipidemias_geneticas.md` | Dislipidemias Genéticas | 🔄 En proceso |

---

## Estructura de cada cápsula

```markdown
# Cápsula N: [Título]
## Guion para Audio       ← script listo para grabar
## Resumen Clave          → ai_key_concepts en DB
## Nemotecnia EUNACOM     → ai_mnemonics en DB
## Pregunta de Autoevaluación → ai_review_qs en DB
```

---

## Integración con la BD (Supabase)

```bash
# Generar SQL seed desde los archivos markdown:
npx ts-node --transpile-only --compiler-options '{"module":"commonjs","moduleResolution":"node"}' \
  scripts/seed-lessons-from-capsules.ts --output sql

# Insertar directo (requiere .env con SUPABASE_SERVICE_ROLE_KEY):
npx ts-node --transpile-only --compiler-options '{"module":"commonjs","moduleResolution":"node"}' \
  scripts/seed-lessons-from-capsules.ts --output db

# El SQL generado se guarda en:
# supabase/migrations/002_seed_lessons_diabetes.sql
```

---

## Para avanzar al siguiente capítulo

Cuando este capítulo esté completo (24/24 ✅), repetir el proceso con:

```
02 Endocrinologia/ → content/transcripts/02-endocrinologia/
03 Cardiologia/    → content/transcripts/03-cardiologia/
...
```

El script `seed-lessons-from-capsules.ts` se puede extender para cada especialidad.

---

## Estado actual

- ✅ **Transcripts listos:** `content/transcripts/01-diabetes/` (24 archivos)
- ✅ **Cápsulas generadas:** 21/24 (en proceso: 08, 09, 10, 11, 12, 22, 23, 24)
- ✅ **SQL seed:** `supabase/migrations/002_seed_lessons_diabetes.sql`
- ⏳ **Pendiente:** correr seed en Supabase SQL editor
- ⏳ **Pendiente:** subir MP3s a Vimeo/R2 y actualizar campo `video_url`
