-- ============================================================
-- SEED: 2.7 Cuestionario Endocrinología (10 preguntas)
-- Cap_1_OR_Jul_2026 — 2.7. Cuestionario Endocrinología
-- Requiere: schema.sql ya ejecutado, examen "2.7 Cuestionario Endocrinología" existente
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
      'Un paciente de 60 años asintomático se realiza exámenes de control, que muestran hemograma normal, perfil lipídico normal, TSH: 5,0 UI/L y T4 8,0 ug/ml (VN: 4,5 – 12,5 ug/ml). Su examen físico es normal. La conducta más adecuada es:',
      'Observar evolución',
      'Iniciar levotiroxina oral',
      'Solicitar cintigrafía tiroidea',
      'Realizar ecografía cervical',
      'Solicitar anticuerpos TRAB',
      'a',
      'Hipotiroidismo subclínico (TSH elevada, T4 normal). Sin comorbilidad (dislipidemia, depresión, demencia) ni TSH >10 ni embarazo: observar. Si T4 libre baja sería hipotiroidismo clínico y sí tratar.',
      'medium'
    ),
    (
      'Un paciente de 56 años consulta por astenia, intolerancia al calor y palpitaciones. Al examen físico se aprecia piel fina y sudorosa, por lo que se solicita una TSH y una T4 libre, que resultan ambas elevadas. ¿Qué diagnóstico es más probable?',
      'Tiroiditis de Hashimoto',
      'Enfermedad de Basedow Graves',
      'Tiroiditis subaguda de Quervein',
      'Hipertiroidismo por aporte exógeno de levotiroxina',
      'Tumor hipofisiario productor de TSH',
      'e',
      'Hipertiroidismo secundario: T4 libre elevada (hipertiroidismo) y TSH elevada (única opción = tumor hipofisario productor de TSH). Hashimoto: TSH alta + T4 baja. EBG, Quervain y T4 exógena: TSH suprimida + T4 alta.',
      'hard'
    ),
    (
      'Un niño de 3 meses de vida, con mal incremento ponderal, presenta deterioro del estado general, por lo que es llevado a urgencia. Ahí se constata que está hipotenso. En su examen físico se aprecia escroto hiperpigmentado. En sus exámenes se constata hiponatremia e hiperkalemia. El diagnóstico más probable es:',
      'Enfermedad de Addison',
      'Enfermedad de Cushing',
      'Hiperplasia suprarrenal congénita',
      'Hipotiroidismo congénito',
      'Agenesia hipofisiaria',
      'c',
      'Insuficiencia suprarrenal (hipotensión, hiperkalemia, hiponatremia) + hiperpigmentación = primaria. En lactante = hiperplasia suprarrenal congénita. Estudiar con 17-OH progesterona. En adulto sería Addison. Screening neonatal con 17-OH-progesterona en muchos países.',
      'medium'
    ),
    (
      'Un paciente de 40 años sufre una fractura de muñeca, por una caída a nivel. Se solicita una densitometría ósea, que muestra Z-score de -2,1 y T-score de -2,7. El diagnóstico más probable es:',
      'Osteopenia primaria',
      'Osteopenia secundaria',
      'Osteoporosis primaria',
      'Osteoporosis secundaria',
      'Sana',
      'd',
      'T-score ≤ -2,5 = osteoporosis. Z-score ≤ -2 = causa secundaria. Requiere calcio, vitamina D y bifosfonatos (o en casos graves anabólicos/denosumab) más estudio de causa secundaria.',
      'medium'
    ),
    (
      'La causa más frecuente de la insuficiencia suprarrenal en lactantes es:',
      'Genética',
      'Infecciosa',
      'Neoplásica',
      'Iatrogénica',
      'Autoinmune',
      'a',
      'En niños la causa más frecuente es la hiperplasia suprarrenal congénita (genética, autosómica recesiva, déficit 21-hidroxilasa). En adultos: adrenalitis autoinmune, luego tuberculosis suprarrenal.',
      'easy'
    ),
    (
      '¿Cuál es el primer examen que debe solicitarse a un paciente con bocio difuso?',
      'Anticuerpos anti-TPO y TRAB',
      'Ecografía cervical',
      'TSH',
      'Cintigrafía con yodo radiactivo',
      'Tiroglobulina',
      'c',
      'En bocio difuso lo prioritario es la función tiroidea: TSH. Complementar con anti-TPO (Hashimoto). Ecografía en bocio nodular o de crecimiento rápido; la TSH sigue siendo fundamental.',
      'easy'
    ),
    (
      'Un paciente de 50 años se realiza un perfil bioquímico, en el que destaca calcemia 13,6 mg/dl, albuminemia: 4,5 g/dl y fosfemia: 3,5 mg/dl. La conducta más adecuada es:',
      'Observar evolución',
      'Solicitar PTH',
      'Solicitar cintigrafía ósea',
      'Solicitar densitometría ósea',
      'Iniciar vitamina D',
      'b',
      'Hipercalcemia (corregida por albúmina sigue >10,5). Estudio: PTH. PTH elevada = hiperparatiroidismo primario; PTH baja = probablemente cáncer.',
      'easy'
    ),
    (
      '¿Cuál de las siguientes alteraciones es MENOS sugerente de una enfermedad de Addison?',
      'Hiperglicemia',
      'Hiponatremia',
      'Hipercalcemia',
      'Eosinofilia',
      'Hiperkalemia',
      'a',
      'Addison: hiponatremia, hiperkalemia, hipoglicemia (cortisol deficiente). Puede cursar con hipercalcemia, eosinofilia, linfocitosis. No hiperglicemia.',
      'easy'
    ),
    (
      'Un hombre de 29 años consulta por infertilidad. Lleva dos años intentando tener hijos, sin conseguirlo. Al examen físico se aprecia distribución ginecoide del vello corporal, testículos de tamaño pequeño y en sus exámenes destaca espermiograma con azoospermia, testosterona baja y FSH y LH elevadas. El estudio debe proseguir con:',
      'TAC de silla turca',
      'Niveles plasmáticos de GnRH',
      'Ecografía testicular',
      'Cariograma',
      'Niveles plasmáticos de 17-hidroxiprogesterona',
      'd',
      'Hipogonadismo hipergonadotrópico + testículos pequeños + azoospermia = síndrome de Klinefelter. Diagnóstico: cariograma (47 XXY). Tratamiento: testosterona; infertilidad: adopción, donante o técnicas de reproducción asistida si se obtienen espermatozoides.',
      'medium'
    ),
    (
      'El síndrome de secreción inadecuada de ADH se caracteriza por:',
      'Hipernatremia, hipokalemia e hipertensión arterial',
      'Hipernatremia, con orinas concentradas',
      'Hiponatremia, con orinas diluidas',
      'Hipernatremia, con orinas diluidas',
      'Hiponatremia, con orinas concentradas',
      'e',
      'SSIADH: exceso de ADH → reabsorción de agua en túbulo colector → retención de agua, hiponatremia y orinas concentradas.',
      'easy'
    )
  ) AS q(stem, a, b, c, d, e, correct, explanation, diff)
  WHERE s.code = 'endocrinologia'
  RETURNING id
),
exam_2_7 AS (
  SELECT id FROM exams WHERE title = '2.7 Cuestionario Endocrinología' LIMIT 1
)
INSERT INTO exam_questions (exam_id, question_id, order_index)
SELECT
  e.id,
  ins.id,
  ROW_NUMBER() OVER (ORDER BY ins.id) AS order_index
FROM inserted ins
CROSS JOIN exam_2_7 e;

-- Confirmar
SELECT COUNT(*) AS preguntas_2_7
FROM exam_questions
WHERE exam_id = (SELECT id FROM exams WHERE title = '2.7 Cuestionario Endocrinología' LIMIT 1);
