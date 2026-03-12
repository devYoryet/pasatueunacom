#!/usr/bin/env python3

"""
Transcripción masiva de audios en español usando faster-whisper (optimizado CPU).

Requisitos previos en el servidor:
  sudo apt-get update && sudo apt-get install -y ffmpeg
  pip install -U faster-whisper

Uso:
  cd /var/www/html/pasatueunacom/pasatueunacom
  python3 transcribir_audios_faster.py

Genera, para cada .mp3:
  archivo.mp3.txt  → texto continuo
  archivo.mp3.srt  → subtítulos con marcas de tiempo
"""

from pathlib import Path
from datetime import timedelta

from faster_whisper import WhisperModel


# Modelo de alta calidad optimizado CPU.
# Si el servidor es muy justo de RAM, cambiar a "medium".
MODEL_SIZE = "large-v3"
LANG = "es"

SECCIONES = [
    "01 Diabetes",
    "02 Endocrinologia",
    "03 Cardiologia",
    "04 Reumatologia",
    "05 Gastroenterologia",
    "06 Hematologia",
    "07 Nefrologia",
    "08 Infectologia",
    "09 Respiratorio",
    "10 Neurologia",
    "11 Geriatria",
]


def format_timestamp(seconds: float) -> str:
    """Convierte segundos a formato SRT HH:MM:SS,mmm."""
    if seconds is None:
        seconds = 0.0
    td = timedelta(seconds=float(seconds))
    total_seconds = int(td.total_seconds())
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    secs = total_seconds % 60
    millis = int(td.microseconds / 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"


def transcribir_audio(model: WhisperModel, audio_path: Path) -> None:
    base = str(audio_path)
    txt_path = Path(base + ".txt")
    srt_path = Path(base + ".srt")

    if txt_path.exists() and srt_path.exists():
        print(f"Ya existe transcripción para: {audio_path} → {txt_path.name} / {srt_path.name} (se omite)")
        return

    print(f"Transcribiendo: {audio_path}")

    segments, info = model.transcribe(
        str(audio_path),
        language=LANG,
        beam_size=5,
        vad_filter=True,
    )

    txt_lines = []
    srt_blocks = []

    for idx, seg in enumerate(segments, start=1):
        text = (seg.text or "").strip()
        if not text:
            continue
        txt_lines.append(text)

        start = format_timestamp(seg.start)
        end = format_timestamp(seg.end)
        srt_blocks.append(f"{idx}\n{start} --> {end}\n{text}\n")

    if not txt_lines:
        print(f"  [WARN] No se generó texto para: {audio_path}")
        return

    txt_path.write_text("\n\n".join(txt_lines), encoding="utf-8")
    srt_path.write_text("\n".join(srt_blocks), encoding="utf-8")
    print(f"  → OK: {txt_path.name} / {srt_path.name}")


def main() -> None:
    root = Path(__file__).resolve().parent

    print(f"Cargando modelo '{MODEL_SIZE}' (CPU, int8)…")
    model = WhisperModel(
        MODEL_SIZE,
        device="cpu",
        compute_type="int8",  # mucho más rápido en CPU manteniendo buena calidad
    )

    for carpeta in SECCIONES:
        dir_path = root / carpeta
        if not dir_path.is_dir():
            print(f"Saltando {carpeta} (no existe)")
            continue

        print("\n" + "=" * 40)
        print(f"Procesando carpeta: {dir_path}")
        print("=" * 40)

        for audio in sorted(dir_path.glob("*.mp3")):
            transcribir_audio(model, audio)

    print("\n✅ Transcripción masiva finalizada.")


if __name__ == "__main__":
    main()

