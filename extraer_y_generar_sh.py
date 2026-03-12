#!/usr/bin/env python3
# extraer_y_generar_sh.py
# Lee vimeo_ids.json y genera descargar_audios.sh usando player.vimeo.com (como antes)

import json
from pathlib import Path

JSON_FILE = "vimeo_ids.json"
REFERER   = "https://cursosonline.doctorguevara.cl/"
OUTPUT_SH = "descargar_audios.sh"

with open(JSON_FILE, encoding="utf-8") as f:
    datos = json.load(f)

lineas = ["#!/bin/bash", f'REFERER="{REFERER}"', ""]

ok, sin_id = 0, []

for page_id, info in datos.items():
    vimeo_id = info.get("vimeo_id")
    name     = info["name"].replace("/", "_")  # ej: Cardiologia_01_Cardio_RCP

    if vimeo_id:
        lineas.append(
            f'yt-dlp --referer "$REFERER" -f "bestaudio" '
            f'--extract-audio --audio-format mp3 --audio-quality 0 '
            f'-o "{name}.%(ext)s" '
            f'"https://player.vimeo.com/video/{vimeo_id}"'
        )
        ok += 1
    else:
        lineas.append(f'# SIN VIMEO ID: [{page_id}] {name}')
        sin_id.append((page_id, name))

with open(OUTPUT_SH, "w", encoding="utf-8") as f:
    f.write("\n".join(lineas) + "\n")

Path(OUTPUT_SH).chmod(0o755)

print(f"✅ Generado: {OUTPUT_SH}")
print(f"   Videos a descargar : {ok}")
print(f"   Sin Vimeo ID       : {len(sin_id)}")
if sin_id:
    print("\n   Sin ID (revisar manualmente):")
    for pid, name in sin_id:
        print(f"     [{pid}] {name}")
