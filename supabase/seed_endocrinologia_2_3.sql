-- ============================================================
-- SEED: 2.3 Cuestionario Endocrinología (13 preguntas)
-- Cap_1_OR_Jul_2026 — 2.3. Cuestionario Endocrinología
-- Requiere: schema.sql ya ejecutado, examen "2.3 Cuestionario Endocrinología" existente
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
      'Una paciente de 50 años consulta por un cuadro de astenia y debilidad de 3 semanas de evolución. Refiere además náuseas y cambios en la coloración de las manos. Al examen físico se aprecia hiperpigmentación de las manos y la mucosa oral. El examen más adecuado para confirmar la sospecha diagnóstica es:',
      'Resonancia magnética de silla turca',
      'Cortisol libre urinario de 24 horas',
      'ACTH plasmática',
      'Prueba de supresión con dexametasona',
      'Prueba de estimulación con ACTH',
      'e',
      'Sospecha de enfermedad de Addison. Estudio: prueba de estimulación con ACTH. Si cortisol basal muy bajo, confirma sin estimulación. Tratamiento: cortisol oral + fludrocortisona. En crisis: corticoides ev ante la sospecha.',
      'medium'
    ),
    (
      'Una paciente de 34 años diagnosticada de hipotiroidismo, en tratamiento con 100 ug de levotiroxina al día, desde hace 6 semanas, se realiza una TSH de control, que resulta 7,2. La conducta más adecuada es:',
      'Solicitar T3 y decidir conducta según resultado',
      'Solicitar T4 libre y decidir conducta según resultado',
      'Mantener el tratamiento y controlar en 6 semanas más',
      'Aumentar la dosis de levotiroxina',
      'Disminuir la dosis de levotiroxina',
      'd',
      'Objetivo TSH en hipotiroidismo: 0,4-4,0 UI/L (algunos 1-3). TSH elevada = sigue hipotiroidea → subir dosis. Embarazo: 0,4-2,5; adultos mayores: 3-6.',
      'easy'
    ),
    (
      'Una mujer de 70 años se realiza una densitometría ósea como estudio de rutina, obteniéndose un Z-score de -0,3 y un T-score de -2,1. El diagnóstico más probable es:',
      'Sana',
      'Osteopetrosis',
      'Osteopenia',
      'Osteoporosis postmenopáusica',
      'Osteoporosis secundaria',
      'c',
      'T-score entre -1 y -2,5 = osteopenia. Osteoporosis: T-score ≤ -2,5. Z-score ≤ -2 sugiere causa secundaria y obliga a estudio (calcio, PTH, calciuria, hormonas, etc.).',
      'medium'
    ),
    (
      'Un paciente de 75 años, fumador de 40 paquetes-año, presenta un cuadro de baja de peso y malestar general, de 2 meses de evolución, al que hoy se le agregó compromiso de conciencia. En sus exámenes destaca una natremia de 120 mEq/L. El diagnóstico más probable es:',
      'Síndrome de secreción ectópica de ACTH',
      'Enfermedad de Cushing',
      'Enfermedad de Addison',
      'Síndrome de secreción inadecuada de hormona antidiurética',
      'Diabetes insípida',
      'd',
      'SSIADH: hiponatremia asociada a patología pulmonar o SNC. Probable cáncer pulmonar de base. Compromiso de conciencia por hiponatremia. Tratamiento: suero hipertónico ev a paso lento.',
      'medium'
    ),
    (
      'Un paciente de 65 años se realiza pruebas de función tiroidea, como parte de un chequeo médico, presentado los siguientes valores: TSH: 9,1 UI/L (VN: 0,4 – 4,0), T4 libre: 0,3 ng/dl (VN: 0,7 – 1,9), T3 libre: 0,4 pg/ml (VN: 0,8 – 4,1). La conducta más adecuada es:',
      'Solicitar anticuerpos anti-TPO y decidir conducta según resultados',
      'Solicitar perfil lipídico y decidir conducta según resultados',
      'Observar evolución y controlar con nuevos exámenes en 3 meses',
      'Iniciar levotiroxina (T4)',
      'Iniciar triyodotironina (T3)',
      'd',
      'Hipotiroidismo (TSH elevada + T4 libre baja). Tratamiento: levotiroxina (T4). No es subclínico (en subclínico T4 libre es normal); subclínico solo se trata si TSH >10, embarazo o síntomas atribuibles.',
      'medium'
    ),
    (
      'Un paciente de 70 años, sin antecedentes de importancia, presenta disfunción eréctil y disminución de la libido. Además, refiere astenia. Al preguntarle dirigidamente, refiere pérdida de las erecciones matinales. Al examen físico presenta disminución del vello corporal, sin otros hallazgos. La conducta más adecuada es:',
      'Solicitar niveles plasmáticos de prolactina, testosterona, FSH y LH',
      'Solicitar niveles plasmáticos de testosterona, dihidroepiandrosterona e inhibina',
      'Solicitar niveles plasmáticos de SHBG y DHEAs',
      'Solicitar niveles plasmáticos de FSH, LH y 17-OH-Progesterona',
      'Solicitar cariograma',
      'a',
      'Clínica de hipogonadismo. Estudio: hormonas sexuales, gonadotropinas (FSH, LH) y prolactina. Cariograma para Klinefelter pero se habría sospechado antes de los 70 años.',
      'medium'
    ),
    (
      'Un paciente de 34 años consulta por aumento de volumen cervical. Al examen físico se palpa un nódulo tiroideo de 2 cm de diámetro, duro, que asciende con la deglución. Se Solicita una ecografía que lo visualiza de aspecto sólido, sin adenopatías cervicales asociadas. Se realiza una punción aspirativa con aguja fina, obteniéndose una citología compatible con un carcinoma folicular (lesión folicular con displasias de alto grado). La conducta más adecuada es:',
      'Iniciar tratamiento con yodo radiactivo',
      'Realizar tiroidectomía total y seguir con niveles plasmáticos de calcitonina',
      'Realizar tiroidectomía total, con linfadenectomía cervical',
      'Realizar tiroidectomía total y en segunda instancia tratar con yodo radiactivo',
      'Realizar tiroidectomía parcial e iniciar levotiroxina en dosis altas',
      'd',
      'Cáncer diferenciado (papilar o folicular): tiroidectomía total + yodo radiactivo; seguimiento con tiroglobulina. Linfadenectomía solo si adenopatías clínicas/ecográficas. Cáncer medular: linfadenectomía, no I131, seguimiento con calcitonina.',
      'medium'
    ),
    (
      'Un paciente de 35 años acude a control médico, con un perfil bioquímico, que como única alteración muestra una calcemia de 12,5 mg/dl. La albúmina plasmática es de 4,0 g/dl. La conducta más adecuada es:',
      'Solicitar PTH',
      'Solicitar calcio iónico',
      'Solicitar colonoscopía, radiografía de tórax y TAC de abdomen y pelvis',
      'Iniciar furosemida y controlar en 3 meses',
      'Iniciar hidroclorotiazida y controlar en 3 meses',
      'a',
      'Hipercalcemia (calcio >10,5) se estudia con PTH. Con albúmina 4,0 la corrección no cambia el valor: Calcio corregido = Calcio + 0,8 x (4 - albúmina).',
      'easy'
    ),
    (
      'Una paciente de 50 años presenta una hipertensión arterial de difícil manejo, que inició hace cerca de un mes y que ha presentado varias crisis hipertensivas, a pesar de estar en tratamiento con enalapril e hidroclorotiazida en dosis máximas. Además, refiere crisis de pánico, durante una de las cuales, en su examen físico, destacó FC: 140 latidos por minuto y PA: 170/110 mmHg. Su electrocardiograma mostró una taquicardia sinusal. El diagnóstico de sospecha es:',
      'Hipertiroidismo',
      'Feocromocitoma',
      'Hiperaldosteronismo primario',
      'Tiroiditis subaguda',
      'Síndrome de secreción ectópica de ACTH',
      'b',
      'HTA refractaria + crisis hipertensivas y de pánico paroxísticas + taquicardia = sospecha de feocromocitoma. Hipertiroidismo no explica HTA severa ni crisis. Hiperaldosteronismo da HTA e hipokalemia, no crisis paroxísticas.',
      'medium'
    ),
    (
      'Después de la suspensión brusca de corticoides sistémicos, la causa más frecuente de insuficiencia suprarrenal en Chile es actualmente:',
      'Autoinmune',
      'Tuberculosis',
      'Postquirúrgica',
      'Congénita',
      'Viral',
      'a',
      'Causa más frecuente: adrenalitis autoinmune. Segunda: tuberculosis suprarrenal.',
      'easy'
    ),
    (
      'La asociación entre temblor, fiebre, taquicardia y dolor cervical, es sugerente de:',
      'Cáncer diferenciado de tiroides',
      'Cáncer anaplásico de tiroides',
      'Quiste del conducto tirogloso',
      'Enfermedad de Basedow graves',
      'Tiroiditis de Quervain',
      'e',
      'Tiroiditis subaguda de Quervain: bocio doloroso, fase inicial hipertiroidea. Cáncer: nódulo indoloro. Quiste tirogloso: línea media, moviliza con deglución, más en niños/adolescentes.',
      'medium'
    ),
    (
      'Un paciente de 35 años, sin enfermedades crónicas conocidas, se realiza un TAC de cerebro, por estudio de un traumatismo encéfalo-craneano, el que no visualiza fracturas ni hemorragias, sin embargo, demuestra la presencia de un tumor hipofisiario de 8 mm de diámetro. Su TSH, prolactina, cortisol basal y niveles de testosterona son normales. La conducta más adecuada es:',
      'Observar evolución',
      'Iniciar bromocriptina',
      'Resolver quirúrgicamente',
      'Solicitar niveles plasmáticos de ACTH, CRH y GnRH',
      'Solicitar test de la sed',
      'a',
      'Adenoma hipofisario no funcionante (incidentaloma): hallazgo en neuroimagen, asintomático y no hiperproductor. Se observa. Si sintomático o hiperproductor se opera; prolactinomas se tratan con agonistas dopaminérgicos (bromocriptina) salvo que no respondan.',
      'medium'
    ),
    (
      'Una mujer, sin antecedentes de importancia, presenta amenorrea desde hace 5 meses, asociado a galactorrea, a pesar de contar con una prueba de embarazo negativa. La conducta más adecuada para iniciar el estudio es:',
      'Prueba de estrógeno + progesterona',
      'Prueba de progesterona',
      'Niveles plasmáticos de LH y FSH',
      'Niveles plasmáticos de prolactina',
      'Niveles plasmáticos de progesterona y estradiol',
      'd',
      'Síndrome amenorrea-galactorrea = presentación frecuente de hiperprolactinemia. Primero descartar embarazo (beta HCG). Luego prolactina desde el inicio; por medicolegal puede pedirse beta HCG simultánea.',
      'medium'
    )
  ) AS q(stem, a, b, c, d, e, correct, explanation, diff)
  WHERE s.code = 'endocrinologia'
  RETURNING id
),
exam_2_3 AS (
  SELECT id FROM exams WHERE title = '2.3 Cuestionario Endocrinología' LIMIT 1
)
INSERT INTO exam_questions (exam_id, question_id, order_index)
SELECT
  e.id,
  ins.id,
  ROW_NUMBER() OVER (ORDER BY ins.id) AS order_index
FROM inserted ins
CROSS JOIN exam_2_3 e;

-- Confirmar
SELECT COUNT(*) AS preguntas_2_3
FROM exam_questions
WHERE exam_id = (SELECT id FROM exams WHERE title = '2.3 Cuestionario Endocrinología' LIMIT 1);
