-- ============================================================
-- SEED: 2.8 Cuestionario Endocrinología (6 preguntas)
-- Cap_1_OR_Jul_2026 — 2.8. Cuestionario Endocrinología
-- Requiere: schema.sql ya ejecutado, examen "2.8 Cuestionario Endocrinología" existente
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
      'Un paciente de 24 años presenta un cuadro de odinofagia y tos, que dura 4 días y luego mejora. Sin embargo, una semana después, inicia dolor cervical, asociado a malestar general y fatiga. El dolor aumenta con los movimientos del cuello y al examen físico se constata aumento de volumen, muy doloroso a la palpación, en relación a la zona supraesternal del cuello, en la línea media. ¿Cuál es la conducta más adecuada?',
      'Solicitar ecografía de cuello',
      'Iniciar naproxeno y solicitar pruebas tiroideas',
      'Solicitar TAC de cuello',
      'Iniciar prednisona',
      'Iniciar amoxicilina más ácido clavulánico',
      'b',
      'Tiroiditis subaguda de Quervain (infección viral previa frecuente). Diagnóstico clínico; complementar con pruebas tiroideas (T4, TSH, tiroglobulina, captación de yodo), hemograma y PCR. Tratamiento: AINEs; prednisona solo si no responde o síntomas sistémicos intensos. Fase hipertiroidea: betabloqueante si muchos síntomas; no antitiroideos. Fase hipo: suele no requerir tratamiento.',
      'medium'
    ),
    (
      'Un paciente de 6 años ha sido hospitalizado en 3 oportunidades por diarrea y malestar general, con requerimientos de hidratación endovenosa. Acude al servicio de urgencia por un cuadro de dolor abdominal intenso y deterioro del estado general, siendo evaluado y diagnosticado de apendicitis aguda, por lo que se llama al cirujano infantil. Al examen físico está hipotenso y desorientado. Se administran 2 bolos de suero fisiológico, sin respuesta y se inicia manejo con drogas vasoactivas, con respuesta parcial. En sus exámenes destaca leucocitosis: 12.000 por mm/3, sodio: 128 mEq/L, potasio: 5,9 mEq/L, creatinina: 1,8 mg/dl, proteína C reactiva: 40 mg/L. ¿Qué indicación es la más urgente, además de la resolución quirúrgica?',
      'Noradrenalina endovenosa',
      'Gluconato de calcio',
      'Ceftriaxona más metronidazol',
      'Hidrocortisona',
      'Adrenalina intramuscular',
      'd',
      'Sospecha de insuficiencia suprarrenal aguda (hiperkalemia, hiponatremia, shock refractario). Hidrocortisona ante la sola sospecha. Por edad puede ser HSRC o Addison. La patología aguda (ej. apendicitis) puede descompensar al paciente. Tratamiento urgente con corticoides ev.',
      'medium'
    ),
    (
      'Una paciente de 24 años, sexualmente activa con pareja estable, consulta por amenorrea de 4 meses de evolución. Refiere que previamente sus reglas eran irregulares, cada 2 a 3 meses. Al examen físico, presenta sobrepeso, piel de la cara con acné y seborrea, sin otras alteraciones. Se realiza test de embarazo, que resulta negativo. Ella refiere que no tiene intenciones de embarazarse en el corto y mediano plazo, por lo que usa preservativo como método anticonceptivo. Al preguntársele dirigidamente, responde que se depila el mentón ocasionalmente. ¿Cuál es la conducta más adecuada para su manejo?',
      'Iniciar anticonceptivos con levonorgestrel solo',
      'Iniciar anticonceptivos combinados con etinilestradiol y drospirenona',
      'Solicitar cortisol basal y postdexametasona',
      'Solicitar 17-OH progesterona, LH, testosterona y dihidroepiandrosterona plasmáticas',
      'Solicitar resonancia magnética nuclear de hipófisis y glándulas suprarrenales',
      'b',
      'SOP confirmado (alteración menstrual + hiperandrogenismo clínico: acné, depilación mentón). No requiere ecografía para diagnóstico. Tratamiento: ACO con acción antiandrogénica (etinilestradiol + drospirenona). Opcional estudio de resistencia a la insulina (TG, glicemia, insulina, HOMA).',
      'medium'
    ),
    (
      'Un paciente de 23 años es diagnosticado de enfermedad bipolar hace algunos meses, luego de presentar una manía severa y psicótica, por lo que está en tratamiento con litio y risperidona. Se logra mejoría significativa de sus síntomas psiquiátricos, sin embargo, presenta disfunción sexual, con dificultades para lograr y mantener la erección y disminución de la libido. Además, se ha sentido con menos energía y fuerza, a pesar que su estado de ánimo está estable. Su examen físico no muestra alteraciones. ¿Qué examen debe solicitarse para el estudio de su cuadro actual?',
      '17-hidroxiprogesterona',
      'Prolactina',
      'FSH, progesterona y estradiol',
      'Resonancia magnética nuclear de hipófisis',
      'TSH y T4 libre',
      'b',
      'Disfunción sexual en paciente con antipsicóticos: descartar hiperprolactinemia (causa frecuente con antidopaminérgicos). Suele pedirse también LH y testosterona. En hombres la hiperprolactinemia se presenta como hipogonadismo (impotencia, libido), no como ginecomastia ni galactorrea.',
      'medium'
    ),
    (
      'Un paciente se realiza un perfil bioquímico, entre los que destaca calcemia de 12 mg/dl. Se solicitan nuevos exámenes, que muestran calcemia 12,3 mg/dl, calcio iónico: 6,0 (VN: 4,5 a 5,0 mg/dl), paratohormona: 68 pg/ml (VN: 10 - 55 pg/ml) y albuminemia: 3,5 g/dl. ¿Cuál es el diagnóstico más probable?',
      'Hiperparatiroidismo primario',
      'Hiperparatiroidismo secundario',
      'Hipercalcemia ficticia',
      'Hipercalcemia facticia por uso de fármacos o vitamina D',
      'Hipercalcemia maligna',
      'a',
      'Hipercalcemia confirmada (calcio iónico y corregido elevados). PTH elevada = hiperparatiroidismo primario. Hipercalcemia ficticia descartada por calcio iónico alto. Calcio corregido = Calcio + 0,8 x (4 - albúmina).',
      'medium'
    ),
    (
      'Una paciente de 35 años es diagnosticada de diabetes mellitus hace 6 meses, con difícil control metabólico, a pesar de tener una buena adherencia a tratamiento. El día de hoy sufre una caída a nivel, resultando con una fractura de muñeca, cuya radiografía muestra, además, signos de osteoporosis. Al examen físico se aprecian signos de fractura de muñeca derecha y, además, FC: 70x'', PA: 150/100 mmHg, IMC: 36 y con atrofia muscular de cuádriceps, brazos y antebrazos. ¿Qué examen es el más adecuado para iniciar el estudio?',
      'FSH, LH, progesterona y estradiol plasmáticos',
      'Cortisol salival nocturno y cortisol en orina de 24 horas',
      'Resonancia magnética nuclear de silla turca',
      'Calcio y PTH plasmática',
      'Péptido C e insulina plasmática',
      'b',
      'Sospecha de síndrome de Cushing (obesidad, atrofia muscular, HTA, diabetes, osteoporosis). Estudio inicial: 1) cortisol libre urinario 24h, 2) cortisol salival nocturno, o 3) prueba de supresión corta con dexametasona (Nugent). Con mucha sospecha se piden 2 de ellos. Luego ACTH, supresión larga e imagen según causa.',
      'medium'
    )
  ) AS q(stem, a, b, c, d, e, correct, explanation, diff)
  WHERE s.code = 'endocrinologia'
  RETURNING id
),
exam_2_8 AS (
  SELECT id FROM exams WHERE title = '2.8 Cuestionario Endocrinología' LIMIT 1
)
INSERT INTO exam_questions (exam_id, question_id, order_index)
SELECT
  e.id,
  ins.id,
  ROW_NUMBER() OVER (ORDER BY ins.id) AS order_index
FROM inserted ins
CROSS JOIN exam_2_8 e;

-- Confirmar
SELECT COUNT(*) AS preguntas_2_8
FROM exam_questions
WHERE exam_id = (SELECT id FROM exams WHERE title = '2.8 Cuestionario Endocrinología' LIMIT 1);
