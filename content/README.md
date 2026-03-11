# Contenido del Curso — Estructura de Archivos

## Regla principal
| Tipo de archivo | ¿Va en el repo? | Destino |
|---|---|---|
| `.srt` / `.txt` | ✅ SÍ | `content/transcripts/<specialty>/` |
| `.mp3` | ❌ NO | Vimeo / Cloudflare R2 / YouTube (privado) |

---

## Estructura de carpetas

```
content/
  transcripts/
    01-diabetes/
      01-generalidades-diabetes.srt
      01-generalidades-diabetes.txt
      02-diabetes-tipo-1.srt
      02-diabetes-tipo-1.txt
      ...
    02-endocrinologia/
      01-tiroides-generalidades.srt
      ...
    03-cardiologia/
      01-manejo-urgencia-arritmias.srt
      01-manejo-urgencia-arritmias.txt
      02-paro-cardiorespiratorio.srt
      ...
    04-reumatologia/
    05-gastroenterologia/
    06-hematologia/
    07-nefrologia/
    08-infectologia/
    09-respiratorio/
    10-neurologia/
    11-geriatria/
```

---

## Convención de nombres de archivos

```
[número]–[nombre-kebab-case].[ext]
```

Ejemplos:
- `01-manejo-urgencia-arritmias.srt`
- `15-angina-cronica.txt`
- `48-insuficiencia-venosa.srt`

**Nota:** El número corresponde al orden dentro de la especialidad.

---

## Cómo agregar los archivos al repo

1. Copia los `.srt` y `.txt` desde tus carpetas locales al directorio correspondiente:
   ```bash
   cp "ruta/03 Cardiologia/*.srt" content/transcripts/03-cardiologia/
   cp "ruta/03 Cardiologia/*.txt" content/transcripts/03-cardiologia/
   ```

2. Renombra según la convención (número + kebab-case)

3. Haz commit:
   ```bash
   git add content/transcripts/
   git commit -m "content: add cardiologia transcripts (48 lessons)"
   ```

---

## Procesamiento con IA

Una vez que los SRT/TXT estén en el repo, usa el script de procesamiento:

```bash
npx ts-node scripts/process-audio.ts --specialty cardiologia
```

Esto leerá cada `.txt`, llamará a la API de OpenAI con el prompt especializado, y guardará el material generado en la base de datos (tabla `lessons`).

Ver: `prompts/process-audio-transcript.md` para el prompt base.

---

## Dónde guardar los MP3

**Opción recomendada: Vimeo**
- Sube los videos como "privados" en Vimeo
- Obtén el embed URL
- Guárdalo en `lessons.video_url` en la DB
- La plataforma reproduce via iframe embebido (nadie puede descargar)

**Opción 2: Cloudflare R2 + Stream**
- Ideal para escala mayor (100+ alumnos)
- Más económico que Vimeo a volumen

**Opción 3: YouTube (no listado)**
- Gratuito, pero Google indexa el contenido
- Solo como última opción

---

## Estadísticas de contenido

| Especialidad | Videos | Duración aprox |
|---|---|---|
| Cardiología | 48 | ~14 horas |
| Diabetes | ~15 | ~3 horas |
| Endocrinología | ~20 | ~5 horas |
| Reumatología | ~15 | ~3 horas |
| ... | | |
| **Total Cap.1** | ~300 | ~60 horas |
