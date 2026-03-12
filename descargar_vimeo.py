#!/usr/bin/env python3
# descargar_vimeo.py
# Lee vimeo_ids.json y descarga todos los videos con yt-dlp
# Uso: python3 descargar_vimeo.py [--audio-only] [--seccion Cardiologia]

import json
import subprocess
import argparse
import sys
import time
from pathlib import Path

JSON_FILE = "vimeo_ids.json"
OUTPUT_BASE = Path("videos_eunacom")
REFERER = "https://cursosonline.doctorguevara.cl/"

# Calidad: bestvideo+bestaudio para video, bestaudio para solo audio
VIDEO_FORMAT = "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best"
AUDIO_FORMAT = "bestaudio[ext=m4a]/bestaudio"


def cargar_json():
    if not Path(JSON_FILE).exists():
        print(f"[ERROR] No se encontró {JSON_FILE}")
        print("Primero ejecuta: python3 extraer_vimeo.py")
        sys.exit(1)
    with open(JSON_FILE, encoding="utf-8") as f:
        return json.load(f)


def descargar(vimeo_id, output_path, audio_only=False, cookies_file=None):
    url = f"https://vimeo.com/{vimeo_id}"
    fmt = AUDIO_FORMAT if audio_only else VIDEO_FORMAT
    ext = "%(ext)s" 

    cmd = [
        "yt-dlp",
        "--format", fmt,
        "--output", str(output_path) + f".{ext}",
        "--referer", REFERER,
        "--add-header", f"Origin:{REFERER.rstrip('/')}",
        "--retries", "5",
        "--fragment-retries", "5",
        "--no-overwrites",           # saltar si ya existe
        "--progress",
        "--no-playlist",
    ]

    if cookies_file and Path(cookies_file).exists():
        cmd += ["--cookies", cookies_file]

    if audio_only:
        cmd += ["--extract-audio", "--audio-format", "mp3", "--audio-quality", "0"]

    cmd.append(url)
    return subprocess.run(cmd, capture_output=False)


def main():
    parser = argparse.ArgumentParser(description="Descargador masivo Vimeo desde vimeo_ids.json")
    parser.add_argument("--audio-only", action="store_true", help="Descargar solo audio MP3")
    parser.add_argument("--seccion", type=str, help="Filtrar por sección (ej: Cardiologia)")
    parser.add_argument("--cookies", type=str, help="Archivo cookies.txt exportado de Chrome")
    parser.add_argument("--delay", type=float, default=1.5, help="Segundos entre descargas (default: 1.5)")
    parser.add_argument("--dry-run", action="store_true", help="Solo listar sin descargar")
    args = parser.parse_args()

    datos = cargar_json()

    # Filtrar entradas válidas
    items = [(pid, info) for pid, info in datos.items() if info.get("vimeo_id")]
    no_encontrados = [(pid, info) for pid, info in datos.items() if not info.get("vimeo_id")]

    # Filtrar por sección si se especificó
    if args.seccion:
        items = [(pid, info) for pid, info in items
                 if info["name"].startswith(args.seccion)]
        if not items:
            print(f"[ERROR] Sección '{args.seccion}' no encontrada o sin videos.")
            print("Secciones disponibles:", sorted({i["name"].split("/")[0] for _, i in datos.items()}))
            sys.exit(1)

    print(f"{'='*60}")
    print(f"  Videos a descargar : {len(items)}")
    print(f"  Sin Vimeo ID       : {len(no_encontrados)}")
    print(f"  Modo               : {'Solo audio MP3' if args.audio_only else 'Video MP4'}")
    if args.seccion:
        print(f"  Filtro sección     : {args.seccion}")
    print(f"{'='*60}\n")

    if args.dry_run:
        print("DRY RUN — listado de archivos a descargar:\n")
        for pid, info in items:
            print(f"  [{pid}] vimeo:{info['vimeo_id']}  →  {info['name']}")
        return

    ok, err = 0, []

    for i, (pid, info) in enumerate(items, 1):
        name = info["name"]          # ej: "Cardiologia/01_Cardio_RCP"
        vimeo_id = info["vimeo_id"]

        # Crear carpeta de sección
        parts = name.split("/")
        seccion_dir = OUTPUT_BASE / parts[0]
        seccion_dir.mkdir(parents=True, exist_ok=True)
        output_path = seccion_dir / parts[1]

        print(f"[{i}/{len(items)}] {name} (vimeo:{vimeo_id})")

        result = descargar(vimeo_id, output_path, args.audio_only, args.cookies)

        if result.returncode == 0:
            ok += 1
            print(f"  ✓ OK\n")
        else:
            err.append((pid, name, vimeo_id))
            print(f"  ✗ ERROR\n")

        time.sleep(args.delay)

    # Resumen final
    print(f"\n{'='*60}")
    print(f"  Completados : {ok}/{len(items)}")
    print(f"  Errores     : {len(err)}")
    if err:
        print("\n  Videos con error:")
        for pid, name, vid in err:
            print(f"    [{pid}] {name} → https://vimeo.com/{vid}")
    if no_encontrados:
        print(f"\n  Páginas sin Vimeo ID ({len(no_encontrados)}):")
        for pid, info in no_encontrados:
            print(f"    [{pid}] {info['name']}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
