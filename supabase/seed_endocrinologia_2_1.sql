-- ============================================================
-- SEED: 2.1 Cuestionario Endocrinología (10 preguntas)
-- Cap_1_OR_Jul_2026 — 2.1. Cuestionario Endocrinología
-- Requiere: schema.sql ya ejecutado, examen "2.1 Cuestionario Endocrinología" existente
-- ============================================================

WITH inserted AS (
  INSERT INTO questions
    (stem, option_a, option_b, option_c, option_d, option_e, correct_option, explanation, difficulty, specialty_id, is_active)
  SELECT
    q.stem, q.a, q.b, q.c, q.d, q.e,
    q.correct::char(1),
    q.explanation,
    q.diff::difficulty,
    s.id,
    true
  FROM specialties s
  CROSS JOIN (VALUES
    (
      'Un paciente de 70 años consulta por un cuadro de astenia y malestar general. Se solicitan exámenes que muestran calcemia: 14,8 mg/dl, albúmina plasmática: 3,6 g/dl, PTH: disminuida, fosfatasas alcalinas: elevadas. El diagnóstico más probable es:',
      'Hiperparatiroidismo primario',
      'Cáncer medular de tiroides',
      'Hipercalcemia maligna',
      'Hipercalcemia ficticia',
      'Insuficiencia suprarrenal',
      'c',
      'Corregir calcemia por albúmina; si sigue alta, ver PTH. PTH alta = hiperparatiroidismo primario. PTH baja = hipercalcemia maligna. FA elevada en ambas. Fórmula: Calcio corregido = Calcio + 0,8 x (4 - albúmina).',
      'medium'
    ),
    (
      'Un paciente de 40 años presenta aumento de volumen cervical. Al examen físico se palpa un nódulo de 2 cm de diámetro, en relación a la glándula tiroides, que asciende con la deglución. Se solicita una ecografía cervical, que lo visualiza de aspecto sólido-quístico, sin adenopatías y una TSH que resulta 1,0 UI/L. La conducta más adecuada es:',
      'Resolver quirúrgicamente de inmediato',
      'Solicitar TAC de cuello',
      'Realizar punción aspiración con aguja fina',
      'Solicitar cintigrafía con yodo radiactivo',
      'Solicitar niveles plasmáticos de calcitonina y tiroglobulina',
      'c',
      'Estudio del nódulo: 1) TSH y ecografía, 2) PAAF si >10 mm (o >15 mm si quístico). Cintigrafía solo si hipertiroidismo (nódulo caliente vs frío). Guías Tirrads estratifican por aspecto ecográfico.',
      'medium'
    ),
    (
      'Una paciente de 30 años presenta un bocio de tamaño moderado, difuso. No presenta síntomas y su examen físico es normal. ¿Cuál es la conducta más adecuada?',
      'Iniciar levotiroxina en dosis bajas',
      'Solicitar TAC de cuello',
      'Solicitar cintigrafía con yodo radiactivo',
      'Solicitar TSH y anticuerpos anti-TPO',
      'Solicitar T4 y tiroglobulina',
      'd',
      'Estudio inicial del bocio difuso: TSH (más importante) y anticuerpos anti-TPO (Hashimoto es causa frecuente). Ecografía solo si bocio nodular o crecimiento rápido. Cintigrafía solo si TSH suprimida (hiperT4).',
      'medium'
    ),
    (
      '¿Cuál de las siguientes afirmaciones es FALSA respecto al cáncer papilar de tiroides?',
      'Es el cáncer de tiroides más frecuente',
      'Se disemina por vía linfática',
      'Su tratamiento es la tiroidectomía total',
      'Se beneficia del uso de yodo radiactivo',
      'Una vez tratado, debe seguirse periódicamente con triyodotironina plasmática, para detectar precozmente las recidivas',
      'e',
      'El papilar es el más frecuente (~85%). Se trata con tiroidectomía total más yodo radiactivo. Seguimiento con tiroglobulina (Tg), no con T3. Papilar: diseminación linfática; folicular: hematógena.',
      'medium'
    ),
    (
      'La asociación de amenorrea secundaria e hirsutismo es muy sugerente de:',
      'Hiperplasia suprarrenal congénita',
      'Climaterio',
      'Hipogonadismo hipergonadotrópico',
      'Síndrome de ovario poliquístico',
      'Hipogonadismo hipogonadotrópico',
      'd',
      'Amenorrea + hirsutismo = criterio menstrual + hiperandrogenismo clínico → SOP. Con un solo criterio se pide ecografía TV o andrógenos. HSRC: desde infancia. Climaterio e hipogonadismos no dan hirsutismo.',
      'medium'
    ),
    (
      'Una mujer de 23 años, asintomática, acude a chequeo médico, donde se le solicita una TSH que resulta 3,1 UI/L (VN: 0,4 – 4,0 UI/L) y una T4, que resulta 13,5 ug/ml (VN: 4,5 – 12,5 ug/ml). No tiene patologías conocidas, pero usa anticonceptivos orales. La conducta más adecuada es:',
      'Solicitar anticuerpos anti-TPO y solicitar ecografía cervical',
      'Solicitar anticuerpos TRAB y solicitar contigrafía tiroidea',
      'Iniciar levotiroixina oral',
      'Derivar para inicio de yodo radiactivo',
      'Explicar normalidad de su situación y observar evolución',
      'e',
      'TSH normal = eutiroidea. T4 alta por ACO (elevación TBG). Opcional pedir T4 libre. En asintomáticos el screening es solo TSH. Con ACO/embarazo/THR no pedir T4 total; usar T4 libre.',
      'medium'
    ),
    (
      '¿Cuál de las siguientes patologías es causa de hiponatremia?',
      'Diabetes insípida',
      'Enfermedad de Cushing',
      'Hipogonadismo hipogonadotrópico',
      'Síndrome de secreción inadecuada de hormona antidiurética',
      'Hipertiroidismo',
      'd',
      'Exceso de ADH → retención de agua → hiponatremia. Otras causas endocrinas: hipotiroidismo e insuficiencia suprarrenal. Diabetes insípida produce hipernatremia.',
      'easy'
    ),
    (
      'Una paciente de 30 años consulta por un cuadro de marcado malestar general y ortostatismo. Al examen físico está sudorosa, con FC: 110x'' y PA: 90/60 mmHg, que no aumenta, luego de administrar un litro de suero fisiológico. Se aprecia hiperpigmentación de las manos y la mucosa oral y su hemoglucotest es de 63 mg/dl. La conducta más adecuada es:',
      'Solicitar cortisol libre urinario de 24 horas',
      'Solicitar metanefrinas urinarias',
      'Administrar levotiroxina oral',
      'Administrar corticoides endovenosos',
      'Solicitar resonancia magnética nuclear de silla turca',
      'd',
      'Sospecha de crisis suprarrenal (hipotensión refractaria + hiperpigmentación = Addison). Ante la sospecha, indicar corticoides. Opcional tomar muestra para cortisol antes de hidrocortisona. ACTH y aldosterona diferencian primaria de hipofisiaria.',
      'medium'
    ),
    (
      'Un paciente presenta un cuadro de 3 meses de evolución de astenia, asociado a disminución de las masas musculares, con obesidad de predominio central. Al examen físico se aprecian estrías abdominales, "cara de luna" y tungo. Se solicita una prueba de supresión corta, que resulta alterada, por lo que se realiza una prueba de supresión larga, la que no suprime y se piden niveles de ACTH, que resultan indetectables. ¿Qué examen es más adecuado para proseguir el estudio en este paciente?',
      'Resonancia magnética nuclear de silla turca',
      'Metanefrinas en orina',
      'TAC de abdomen',
      'Niveles plasmáticos de cortisol y DHEAs',
      'Radiografía de tórax',
      'c',
      'Síndrome de Cushing confirmado (supresión corta alterada). ACTH indetectable + supresión larga no suprime = causa suprarrenal. Siguiente paso: TAC de suprarrenales. Si ACTH elevada y larga suprimiera → RMN de silla turca.',
      'medium'
    ),
    (
      'Una paciente de 50 años consulta por astenia y dificultad para ver de un mes de evolución, que ha ido en aumento. Al examen físico presenta aumento de tamaño de las manos y pies, la nariz y los labios. Además, se aprecia un defecto campimétrico, compatible con una hemianopsia heterónima bitemporal. En sus exámenes generales destaca glicemia de ayuno de 180 mg/dl. ¿Cuál de es el diagnóstico más probable?',
      'Tumor hipofisiario productor de TSH',
      'Síndrome de compresión del tallo hipofisiario',
      'Tumor hipofisiario productor de GH',
      'Neoplasia endocrina múltiple tipo 2',
      'Síndrome poliglandular',
      'c',
      'Hemianopsia bitemporal → lesión quiasma óptico → tumor hipofisario. Clínica de acromegalia (manos, pies, nariz, labios) + diabetes secundaria (GH contrarregula insulina). Diagnóstico: IGF-1 elevada; RMN de hipófisis (también por la hemianopsia).',
      'medium'
    )
  ) AS q(stem, a, b, c, d, e, correct, explanation, diff)
  WHERE s.code = 'endocrinologia'
  RETURNING id
),
exam_2_1 AS (
  SELECT id FROM exams WHERE title = '2.1 Cuestionario Endocrinología' LIMIT 1
)
INSERT INTO exam_questions (exam_id, question_id, order_index)
SELECT
  e.id,
  ins.id,
  ROW_NUMBER() OVER (ORDER BY ins.id) AS order_index
FROM inserted ins
CROSS JOIN exam_2_1 e;

-- Confirmar
SELECT COUNT(*) AS preguntas_2_1
FROM exam_questions
WHERE exam_id = (SELECT id FROM exams WHERE title = '2.1 Cuestionario Endocrinología' LIMIT 1);
