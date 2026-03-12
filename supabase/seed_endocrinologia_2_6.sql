-- ============================================================
-- SEED: 2.6 Cuestionario Endocrinología (10 preguntas)
-- Cap_1_OR_Jul_2026 — 2.6. Cuestionario Endocrinología
-- Requiere: schema.sql ya ejecutado, examen "2.6 Cuestionario Endocrinología" existente
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
      'Un paciente de 60 años, cirrótico por consumo de alcohol, se realiza pruebas tiroideas como parte de un chequeo médico, que muestran TSH: 1,8 UI/L (VN: 0,4-4,0) y T4: 4,0 ug/dl (VN: 4,5 – 12,5 ug/dl). El diagnóstico más probable es:',
      'Eutiroideo',
      'Hipotiroidismo subclínico',
      'Tiroiditis de Hashimoto',
      'Cáncer de tiroides',
      'Hepatocarcinoma',
      'a',
      'TSH normal = eutiroideo. T4 baja por disminución de TBG en daño hepático crónico; T4 libre suele ser normal. Si TSH normal y sin síntomas, solo pedir TSH.',
      'medium'
    ),
    (
      'Una paciente de 50 años presenta un cuadro de astenia y malestar general, de 4 semanas de evolución, asociado a náuseas. Al examen físico se aprecian algunas máculas hiperpigmentadas en las manos y la cara. En sus exámenes generales destaca hiponatremia y potasio de 5,5 mEq/L. La conducta diagnóstica más adecuada es:',
      'Solicitar ACTH y cortisol basales',
      'Solicitar ACTH y MSH',
      'Solicitar RMN de silla turca',
      'Solicitar cortisol basal y post-dexametasona',
      'Solicitar cortisol basal y post-ACTH',
      'e',
      'Sospecha de Addison (hiperpigmentación + hiperkalemia, hiponatremia, astenia, náuseas). Confirmación: prueba de estimulación con ACTH (cortisol basal y post-ACTH). Cortisol basal muy bajo confirma sin estimular.',
      'medium'
    ),
    (
      'Un paciente de 75 años, fumador importante, presenta un cuadro de malestar general y debilidad muscular progresiva, asociado a náuseas y constipación, que luego se acompaña de compromiso de conciencia. Al examen físico se aprecia deshidratado, sin signos focales. El diagnóstico más probable es:',
      'SSIADH',
      'Síndrome de secreción ectópica de ACTH',
      'Hipercalcemia',
      'Enfermedad de Addison',
      'Coma mixedematoso',
      'c',
      'Hipercalcemia maligna (constipación, malestar, deshidratación, compromiso de conciencia), frecuente en cáncer de pulmón. SSIADH daría hiponatremia. ACTH ectópica = Cushing. Addison = hiperpigmentación. Coma mixedematoso = edema, no deshidratación.',
      'medium'
    ),
    (
      'Un paciente es diagnosticado de hipotiroidismo por una tiroiditis crónica, por lo que se inicia suplementación hormonal con levotiroxina. ¿Qué examen es el más adecuado para seguir la evolución de este paciente?',
      'Hormona tiroestimulante',
      'Tiroxina',
      'Anticuerpos antiperoxidasa tiroidea',
      'Triyodotironina',
      'Tiroglobulina',
      'a',
      'Hipotiroidismo se ajusta según TSH: cada 4-6 semanas hasta normalizar, luego cada 3 meses hasta estabilidad, después cada 6-12 meses.',
      'easy'
    ),
    (
      '¿Cuál de las siguientes fracturas puede ser considerada como osteoporótica?',
      'Fractura de columna',
      'Fractura de diáfisis humeral',
      'Fractura de pierna',
      'Fractura de rodilla',
      'Fracturas costales',
      'a',
      'Fracturas osteoporóticas típicas: vertebrales (más frecuentes), cadera, muñeca y húmero proximal (huesos esponjosos).',
      'easy'
    ),
    (
      'La diabetes insípida se caracteriza por:',
      'Poliuria, polidipsia, hiponatremia, hiperkalemia y acidosis metabólica',
      'Poliuria, polidipsia, orinas concentradas y tendencia a la hiponatremia',
      'Poliuria, polidipsia, orinas concentradas y tendencia a la hipernatremia',
      'Poliuria, polidipsia, orinas diluidas y tendencia a la hiponatremia',
      'Poliuria, polidipsia, orinas diluidas y tendencia a la hipernatremia',
      'e',
      'DI: déficit de ADH (central) o falla de acción (nefrogénica). Pérdida renal de agua → orinas diluidas, hipernatremia; compensación con poliuria y polidipsia.',
      'easy'
    ),
    (
      'Una mujer de 40 años presenta amenorrea hace 4 meses. Al examen físico no tiene alteraciones y su prueba de embarazo resulta negativa. La conducta inicial más adecuada es:',
      'Observar evolución',
      'Solicitar niveles de estradiol, progesterona y ecografía transvaginal',
      'Solicitar niveles de LH, estradiol y hormona antimülleriana',
      'Solicitar niveles de FSH y LH',
      'Solicitar niveles de TSH, prolactina, FSH, estradiol y progesterona',
      'e',
      'Estudio de amenorrea: descartar embarazo; luego TSH y prolactina (causas frecuentes). A los 40 años descartar menopausia con FSH (y estradiol, progesterona). Suele pedirse panel hormonal simultáneo.',
      'medium'
    ),
    (
      'Un paciente de 40 años consulta por astenia y aumento de peso. Al examen físico se aprecia atrofia de las masas musculares de las extremidades, con obesidad central, tungo y cara de luna. Además, presenta presión arterial 150/90 mmHg y glicemia basal de 150 mg/dl. Se solicita cortisol libre urinario de 24 horas, que resulta elevado. Adicionalmente, se solicita prueba de supresión larga que muestra una supresión parcial y niveles plasmáticos de ACTH que resultan elevados. El diagnóstico más probable es:',
      'Síndrome de Cushing por corticoides exógenos',
      'Tumor productor de ACTH',
      'Enfermedad de Addison',
      'Hiperplasia suprarrenal',
      'Tumor adrenal productor de cortisol',
      'b',
      'Cushing confirmado (cortisol libre 24h elevado). ACTH elevada + supresión larga que suprime = causa hipofisaria (enfermedad de Cushing / tumor productor de ACTH). Corticoides exógenos, hiperplasia y tumor adrenal tendrían ACTH baja y no suprimirían.',
      'medium'
    ),
    (
      'Una paciente de 40 años se realiza una TAC de cerebro, por un TEC, que descarta lesiones traumáticas, pero que muestra un tumor hipofisiario de 4 mm de diámetro. No presenta síntomas su examen físico es normal. Se solicita TSH, T4, prolactina y somatomedina 1, que resultan normales. La conducta más adecuada es:',
      'Observar evolución',
      'Realizar cateterismo de senos petrosos',
      'Solicitar prueba de supresión con dexametasona y prueba de estimulación con clonidina',
      'Solicitar niveles plasmáticos de SHBG y TBG',
      'Resolver quirúrgicamente',
      'a',
      'Adenoma hipofisario no funcionante (incidentaloma): asintomático y no hiperproductor. Se observa. Si sintomático o hiperproductor se opera (prolactinomas: agonistas dopaminérgicos primero).',
      'medium'
    ),
    (
      '¿Cuál de las siguientes opciones es más sugerente de una tiroiditis aguda bacteriana?',
      'Bocio difuso, asociado a exoftalmo y síntomas de hipertiroidismo',
      'Bocio difuso asociado a síntomas de hipotiroidismo',
      'Bocio multinodular con síntomas de hipertiroidismo',
      'Bocio, asociado a intenso localizado en el lóbulo tiroideo izquierdo y fiebre alta',
      'Bocio difuso, doloroso, asociado a síntomas leves de hipertiroidismo',
      'd',
      'Tiroiditis aguda bacteriana: inicio súbito, fiebre alta, dolor intenso (a menudo en un lóbulo). Signos inflamatorios marcados. Diagnóstico clínico + ecografía + PAAF para cultivo. Tratamiento: antibióticos ev; drenaje si absceso. A: EBG. B: Hashimoto. C: bocio multinodular tóxico. E: Quervain.',
      'medium'
    )
  ) AS q(stem, a, b, c, d, e, correct, explanation, diff)
  WHERE s.code = 'endocrinologia'
  RETURNING id
),
exam_2_6 AS (
  SELECT id FROM exams WHERE title = '2.6 Cuestionario Endocrinología' LIMIT 1
)
INSERT INTO exam_questions (exam_id, question_id, order_index)
SELECT
  e.id,
  ins.id,
  ROW_NUMBER() OVER (ORDER BY ins.id) AS order_index
FROM inserted ins
CROSS JOIN exam_2_6 e;

-- Confirmar
SELECT COUNT(*) AS preguntas_2_6
FROM exam_questions
WHERE exam_id = (SELECT id FROM exams WHERE title = '2.6 Cuestionario Endocrinología' LIMIT 1);
