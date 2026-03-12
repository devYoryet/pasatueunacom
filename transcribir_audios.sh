#!/bin/bash

# Script de transcripción masiva en español con Whisper
# Recorre las carpetas 01–11 y genera transcripciones profesionales
# Requisitos previos (ejecutar una vez en el servidor):
#   pip install -U openai-whisper
#   sudo apt-get update && sudo apt-get install -y ffmpeg
#
# Uso:
#   cd /var/www/html/pasatueunacom/pasatueunacom
#   chmod +x transcribir_audios.sh
#   ./transcribir_audios.sh

set -e

# Modelo de alta calidad (puedes bajar a "medium" si tu servidor es lento)
MODEL="medium"
LANG="es"

SECCIONES=(
  "01 Diabetes"
  "02 Endocrinologia"
  "03 Cardiologia"
  "04 Reumatologia"
  "05 Gastroenterologia"
  "06 Hematologia"
  "07 Nefrologia"
  "08 Infectologia"
  "09 Respiratorio"
  "10 Neurologia"
  "11 Geriatria"
)

for dir in "${SECCIONES[@]}"; do
  if [ ! -d "$dir" ]; then
    echo "Saltando $dir (no existe)"
    continue
  fi

  echo "==============================="
  echo "Procesando carpeta: $dir"
  echo "==============================="

  # Ordenar por nombre para que quede prolijo
  find "$dir" -maxdepth 1 -type f -name "*.mp3" | sort | while read -r audio; do
    base="${audio%.*}"
    txt="${base}.txt"
    srt="${base}.srt"

    # Si ya hay transcripción y subtítulos, no repetir
    if [ -f "$txt" ] && [ -f "$srt" ]; then
      echo "Ya existe transcripción para: $audio  →  $txt / $srt (se omite)"
      continue
    fi

    echo "Transcribiendo: $audio"
    # Genera todos los formatos útiles (txt, srt, vtt, json, etc.) en la misma carpeta del audio
    whisper "$audio" \
      --model "$MODEL" \
      --language "$LANG" \
      --task transcribe \
      --output_format all \
      --output_dir "$(dirname "$audio")" \
      --verbose False
  done
done

echo
echo "✅ Transcripción masiva finalizada."

