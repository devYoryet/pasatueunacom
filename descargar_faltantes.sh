#!/bin/bash
REFERER="https://cursosonline.doctorguevara.cl/"

yt-dlp --referer "$REFERER" -f "bestaudio" --extract-audio --audio-format mp3 --audio-quality 0 -o "Cardiologia_30_Cardio_Miocardiopatias.%(ext)s" "https://player.vimeo.com/video/936853623"
yt-dlp --referer "$REFERER" -f "bestaudio" --extract-audio --audio-format mp3 --audio-quality 0 -o "Cardiologia_31_Cardio_Foramen_oval.%(ext)s" "https://player.vimeo.com/video/936853707"
