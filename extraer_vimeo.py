#!/usr/bin/env python3
# Requiere: pip install requests beautifulsoup4 browser-cookie3

import re
import requests
from bs4 import BeautifulSoup
import browser_cookie3

BASE_URL = "https://cursosonline.doctorguevara.cl"
REFERER  = BASE_URL + "/"
PAGE_IDS = {
    149286: "01_Endocrino_Patologia_hipofisis",
    149287: "02_Endocrino_Acromegalia",
    149288: "03_Endocrino_Hiperprolactinemia",
    149289: "04_Endocrino_Diabetes_insipida",
    149290: "05_Endocrino_Hipotiroidismo",
    149291: "06_Endocrino_Hipertiroidismo",
    149292: "07_Endocrino_Tiroiditis",
    149293: "08_Endocrino_Nodulo_tiroideo_cancer",
    149294: "09_Endocrino_Hipercalcemia",
    149295: "10_Endocrino_Hiperparatiroidismo",
    149296: "11_Endocrino_Osteoporosis",
    149297: "12_Endocrino_Hiperaldosteronismo",
    149298: "13_Endocrino_Insuficiencia_suprarrenal",
    149299: "14_Endocrino_Sindrome_Cushing",
    149300: "15_Endocrino_Feocromocitoma",
    149301: "16_Endocrino_Neoplasia_endocrina_multiple",
    149302: "17_Endocrino_Hipocalcemia_hipoparatiroidismo",
    149303: "18_Endocrino_Hiponatremia",
    149304: "19_Endocrino_Hipernatremia",
    149305: "20_Endocrino_Hipercalemia_hipocalemia",
    149306: "21_Endocrino_Hipogonadismo",
    149307: "22_Endocrino_Desarrollo_puberal_adrenarquia",
    149308: "23_Endocrino_SOP",
    149309: "24_Endocrino_Menopausia_climaterio",
    149310: "25_Endocrino_Terapia_reemplazo_hormonal",
    149311: "26_Endocrino_Amenorrea",
    149312: "27_Endocrino_Anticonceptivos_I",
    149313: "28_Endocrino_Anticonceptivos_II",
    149314: "29_Endocrino_Anticonceptivos_III",
    149315: "30_Endocrino_Anticonceptivos_IV",
    149316: "31_Endocrino_Anticonceptivos_V",
}
'''
# IDs de página del curso (sección Diabetes, del HTML del curso)
PAGE_IDS = {
    149256: "1_Tipos_de_diabetes",
    149257: "2_Diagnostico_de_diabetes",
    149258: "3_Diagnostico_diabetes_embarazo",
    149259: "4_Generalidades_insulinoterapia",
    149260: "5_Ajustes_insulinoterapia",
    149261: "6_Objetivos_manejo_diabetes",
    149262: "7_Hipoglicemiantes_orales_DM2",
    149263: "8_Tratamiento_DM2",
    149264: "9_Tratamiento_DMG_control_glicemico",
    149265: "10_Tratamiento_DMG_control_obstetrico",
    149266: "11_Indicaciones_insulina",
    149267: "12_Ejercicios_tratamiento_diabetes",
    149268: "13_Manejo_HTA_diabeticos",
    149269: "14_Nefropatia_diabetica",
    149270: "15_Retinopatia_diabetica",
    149271: "16_Pie_diabetico",
    149272: "17_Neuropatia_diabetica",
    149273: "18_Cetoacidosis_vs_HGHO",
    149274: "19_Tratamiento_CAD_HGHO",
    149275: "20_Generalidades_hipoglicemia",
    149276: "21_Causas_estudio_hipoglicemia",
    149277: "22_Tratamiento_dislipidemias",
    149278: "23_Miopatia_estatinas",
    149279: "24_Dislipidemias_geneticas",
}'''

# Tomar cookies de Chrome (debe estar logueado)
cookies = browser_cookie3.chrome(domain_name="cursosonline.doctorguevara.cl")
session = requests.Session()
session.cookies.update(cookies)
session.headers.update({"Referer": REFERER, "User-Agent": "Mozilla/5.0"})

results = []
for page_id, name in PAGE_IDS.items():
    url = f"{BASE_URL}/mod/page/view.php?id={page_id}"
    resp = session.get(url)
    soup = BeautifulSoup(resp.text, "html.parser")
    
    # Buscar iframe de Vimeo
    iframe = soup.find("iframe", src=re.compile(r"player\.vimeo\.com/video/(\d+)"))
    if iframe:
        vimeo_id = re.search(r"/video/(\d+)", iframe["src"]).group(1)
        results.append((name, vimeo_id))
        print(f"✓ {name} → {vimeo_id}")
    else:
        print(f"✗ {name} → no encontrado")

# Generar script de descarga
with open("descargar_audios.sh", "w") as f:
    f.write("#!/bin/bash\n")
    f.write(f'REFERER="{REFERER}"\n\n')
    for name, vimeo_id in results:
        f.write(f'yt-dlp --referer "$REFERER" -f "bestaudio" --extract-audio --audio-format mp3 --audio-quality 0 -o "{name}.%(ext)s" "https://player.vimeo.com/video/{vimeo_id}"\n')

print(f"\n✅ Script generado: descargar_audios.sh ({len(results)} videos)")
