-- ============================================================
-- SEED: 1.2 Cuestionario Diabetes (15 preguntas)
-- Cap_1_OR_Jul_2026 — 1.2. Cuestionario Diabetes
-- Requiere: schema.sql ya ejecutado, examen "1.2 Cuestionario Diabetes" existente
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
      'Un paciente de 72 años, diabético tipo 2, en tratamiento con metformina, el que cumple de manera irregular, es traído al servicio de urgencia, por compromiso de conciencia. Los familiares refieren que desde hace 2 días está con tos con expectoración mucopurulenta y fiebre, pero que hoy empezó a decir palabras sin sentido y luego presentó tendencia a dormir. Al examen está en sopor profundo, sin signos focales, con signos de deshidratación, FC: 106x'', PA: 100/60 mmHg, T°: 38,7°C y saturación arterial de oxígeno de 96%. Al examen pulmonar se auscultan crepitaciones en la base izquierda. Sus exámenes muestran hematocrito: 49%, blancos: 16.000 por mm3, plaquetas: 400.000 por mm3, glicemia 816 mg/dl, sodio: 143 mEq/L, potasio: 4,0 mEq/L, pH: 7,38 y bicarbonato: 23 mEq/L. La radiografía de tórax portátil muestra signos de condensación en el lóbulo inferior izquierdo. La conducta más adecuada es:',
      'Administrar 1 litro de suero fisiológico + 1g de KCl endovenoso, iniciar insulina endovenosa y administrar bicarbonato por vía endovenosa',
      'Administrar 1 litro de suero glucosado al 5% + 2g de NaCl + 1g de KCl, iniciar insulina endovenosa y administrar antibióticos endovenosos',
      'Administrar 1 litro de suero fisiológico + 1g de KCl endovenoso, iniciar insulina endovenosa y administrar antibióticos por vía endovenosa',
      'Administrar 1 litro de suero glucosado al 5% + 2g de NaCl + 1g de KCl, iniciar insulina endovenosa y administrar bicarbonato y antibióticos endovenosos',
      'Administrar 1 litro de suero fisiológico, iniciar insulina endovenosa y administrar antibióticos por vía endovenosa',
      'c',
      'Tiene un síndrome hiperglicémico hiperosmolar (glicemia mayor a 600 mg/dl y osmolaridad plasmática mayor a 320 mOsm/L). Se trata con suero fisiológico, insulina cristalina endovenosa y KCl. El Sd. HGHO no requiere bicarbonato (solo CAD con pH < 6,9). Se debe tratar la causa: neumonía con ceftriaxona endovenosa.',
      'medium'
    ),
    (
      'Un paciente diabético tipo 1, presenta un cuadro de desorientación y luego convulsiones, que fue precedido por palpitaciones y temblor de las extremidades superiores. El diagnóstico más probable es:',
      'Mielinolisis pontina',
      'Accidente vascular encefálico',
      'Encefalopatía de Wernicke',
      'Cetoacidosis diabética',
      'Hipoglicemia',
      'e',
      'Es una hipoglicemia clásica: síntomas simpaticomiméticos (palpitaciones y temblor), seguidos de síntomas neuroglucopénicos (convulsiones y compromiso de conciencia).',
      'medium'
    ),
    (
      '¿Cuál de los siguientes pacientes tiene diagnóstico de diabetes mellitus?',
      'Paciente asintomático, con glicemia de ayuno de 290 mg/dl',
      'Paciente con glicemia de ayuno de 198, que se repite a los dos días, resultando 138',
      'Paciente con test de tolerancia a la glucosa, con glicemia basal de 110 mg/dl, que llega a los 180 mg/dl a las 2 horas postingesta de 75 gramos de glucosa',
      'Paciente con hemoglobina glicosilada de 6%',
      'Paciente con un hemoglucotest de 400 mg/dl',
      'b',
      'Dos glicemias de ayuno mayores o iguales a 126 mg/dl confirman el diagnóstico. La opción con 198 y 138 cumple. La hemoglobina glicosilada ≥6,5% es diagnóstica pero en Chile se usa más para seguimiento. El hemoglucotest no es aceptado para diagnóstico.',
      'medium'
    ),
    (
      'El hipotiroidismo suele presentar la siguiente alteración en el perfil lipídico:',
      'Colesterol LDL aumentado',
      'Colesterol HDL aumentado',
      'Colesterol HDL bajo',
      'Triglicéridos aumentados',
      'Colesterol LDL pequeño y denso',
      'a',
      'El hipotiroidismo se asocia a LDL aumentado. La diabetes se asocia a HDL bajo, TG aumentados y LDL pequeño y denso (más aterogénico).',
      'easy'
    ),
    (
      'Un paciente de 18 años, diabético tipo 1, en tratamiento con insulina es esquema intensificado con dos dosis de insulina NPH y tres refuerzos con insulina cristalina, presenta los siguientes controles promedio con Hemoglucotest: Predesayuno: 150, Postdesayuno: 210, Prealmuerzo: 90, Postalmuerzo: 120, Precena: 80, Postcena: 100. La conducta más adecuada es:',
      'Aumentar la dosis de insulina NPH matinal',
      'Aumentar la dosis de insulina NPH nocturna',
      'Aumentar la dosis de insulina cristalina predesayuno',
      'Aumentar la dosis de insulina cristalina prealmuerzo',
      'Aumentar la dosis de insulina cristalina precena',
      'b',
      'Las glicemias preprandiales dependen de la insulina lenta (NPH recibida horas antes). Predesayuno y postdesayuno elevados → aumentar NPH nocturna para normalizar predesayuno y así postdesayuno.',
      'medium'
    ),
    (
      'Un paciente indigente, en situación de calle, ingresa al servicio de urgencia por un cuadro de desorientación y dificultades para caminar. Al examen físico se constata estrabismo divergente, por parálisis del tercer nervio craneal izquierdo, ataxia de la marcha y desorientación temporoespacial, sin otras alteraciones. El diagnóstico más probable es:',
      'Hipoglicemia',
      'Hipofosfemia',
      'Síndrome hiperglicémico hiperosmolar',
      'Encefalopatía de Wernicke',
      'Encefalopatía de Korsakoff',
      'd',
      'Encefalopatía de Wernicke clásica por déficit de tiamina (B1), frecuente en alcohólicos. Diagnóstico clínico: COCA (coma, oftalmoplejía, confusión y ataxia de la marcha).',
      'medium'
    ),
    (
      'Un paciente de 50 años, diabético tipo 2, en tratamiento con metformina 500 mg cada 8 horas, acude a control. Trae una hemoglobina glicosilada de 6,3% y una proteinuria de 24 horas en 200 mg/dl. Sin embargo, refiere que desde que inició la metformina, presenta diarrea y dolor abdominal ¿Cuál es la conducta más adecuada para el control metabólico de este paciente?',
      'Mantener la metformina y hacer hincapié en el cumplimiento de la dieta',
      'Aumentar la dosis de metformina a 850 mg cada 8 horas',
      'Agregar glibenclamida 5 mg cada 12 horas',
      'Reemplazar la metformina por rosiglitazona',
      'Reemplazar la metformina por glibenclamida',
      'e',
      'Buen control metabólico (HbA1c <7%). La diarrea y dolor abdominal son efectos adversos de la metformina. Se recomienda reemplazarla (primero probar metformina XR). Glitazonas están obsoletas; alternativa aceptable: glibenclamida; idealmente DPP-4, GLP-1 o SGLT-2.',
      'medium'
    ),
    (
      'Una paciente de 12 años, diabética tipo 1, en tratamiento con insulina, es traída al servicio de urgencia, por compromiso de conciencia. Los familiares refieren que desde hace 2 días está cursando con una infección urinaria, pero que hoy empezó a decir palabras sin sentido y luego presentó tendencia a dormir. Al examen está en sopor profundo, deshidratada, FC: 100x'', PA: 90/60 mmHg, T°: 38,7°C y saturación arterial de oxígeno de 98%. Al examen pulmonar se aprecia polipnea. Sus exámenes muestran, glicemia 416 mg/dl, cetonas +++ en orina, sodio: 130 mEq/L, potasio: 4,6 mEq/L, pH: 7,18 y bicarbonato: 13 mEq/L. La conducta más adecuada es:',
      'Administrar suero fisiológico + 1g de KCl endovenoso, iniciar insulina endovenosa y administrar bicarbonato por vía endovenosa',
      'Administrar suero glucosado al 5% + KCl endovenoso e iniciar insulina endovenosa',
      'Administrar suero fisiológico + KCl endovenoso e iniciar insulina endovenosa',
      'Administrar suero glucosalino + KCl, iniciar insulina endovenosa y administrar bicarbonato endovenoso',
      'Administrar suero fisiológico + bicarbonato e iniciar insulina endovenosa',
      'c',
      'Cetoacidosis diabética (cetonas positivas, acidosis, glicemia elevada). Suero fisiológico 20 cc/kg en 1 hora, luego insulina y KCl. Bicarbonato solo si pH < 6,9; aquí pH 7,18 por tanto no se indica.',
      'medium'
    ),
    (
      'Un paciente diabético tipo 1, presenta un cuadro de desorientación y luego coma, que fue precedido por marcado malestar general, náuseas y dolor abdominal. El diagnóstico más probable es:',
      'Síndrome hiperglicémico hiperosmolar',
      'Encefalopatía de Korsakov',
      'Encefalopatía de Wernicke',
      'Cetoacidosis diabética',
      'Hipoglicemia',
      'd',
      'Cetoacidosis clásica: diabético tipo 1, síntomas abdominales (dolor y náuseas/vómitos), evolución a compromiso de conciencia y polipnea.',
      'medium'
    ),
    (
      'Un paciente de 58 años, obeso, presenta un perfil lipídico con triglicéridos de 210 mg/dl, colesterol LDL: 180 mg/dl, colesterol HDL: 35 mg/dl y colesterol total: 257. Se inicia dieta y ejercicios y se controla tres meses después, sin lograr cambios. Su glicemia de ayunas es de 110 mg/dl y su TTGO resulta 150 mg/dl a las 2 horas postcarga de glucosa. La conducta más adecuada es:',
      'Iniciar una estatina y metformina',
      'Iniciar un fibrato y metformina',
      'Iniciar un fibrato y una estatina',
      'Iniciar metformina',
      'Mantener las indicaciones',
      'a',
      'Tiene hipertrigliceridemia, LDL elevado, HDL bajo, GAA, IGO, obesidad y síndrome metabólico. Prioridad en lípidos: LDL (TG <500) → estatina. GAA/IGO/síndrome metabólico: dieta y metformina.',
      'medium'
    ),
    (
      'Un paciente de 60 años, diabético tipo 2, en tratamiento con metformina 850 mg/8 horas y glibenclamida 5 mg en la mañana, acude a control, constatándose creatinina 1,0 mg/dl y hemoglobina glicosilada de 7,5%. La conducta más adecuada es:',
      'Reemplazar la metformina por una glitazona',
      'Subir la dosis de glibenclamida',
      'Iniciar insulina',
      'Mantener el tratamiento y controlar en 3 meses',
      'Solicitar un test de tolerancia a la glucosa oral',
      'b',
      'Control insuficiente (HbA1c >7%). Metformina en dosis alta; glibenclamida aún puede subirse (máximo 10 mg c/12h). Aceptable subir glibenclamida; también se pueden usar otros HGO más seguros.',
      'medium'
    ),
    (
      'Un paciente de 58 años, diabético tipo 2 en tratamiento con glibenclamida y metformina en dosis máximas, acude a control. Presenta hemoglobina glicosilada de 6,8% y glicemias de ayuno entre 90 y 140 mg/dl. Su examen físico es normal y el resto de sus exámenes son normales. La conducta más adecuada es:',
      'Iniciar insulina NPH',
      'Solicitar test de tolerancia a la glucosa',
      'Suspender los hipoglicemiantes orales e iniciar insulina en esquema intensificado',
      'Mantener el tratamiento',
      'Agregar rosiglitazona al tratamiento',
      'd',
      'Está bien controlado (HbA1c <7%). No es necesario cambiar el tratamiento. El objetivo principal es la hemoglobina glicosilada.',
      'easy'
    ),
    (
      'Un paciente de 45 años, con antecedente de lupus eritematoso sistémico, en tratamiento con prednisona, presenta glicemia de ayuno 180 mg/dl y glicemias postprandiales sobre 210 mg/dl, siendo diagnosticada de diabetes mellitus. ¿Cuál es el tratamiento inicial en esta paciente?',
      'Metformina',
      'Glibenclamida',
      'Pioglitazona',
      'Sitagliptina',
      'Insulina',
      'e',
      'Diabetes asociada a corticoides con glicemias >200 mg/dl. El tratamiento de elección es insulina.',
      'medium'
    ),
    (
      'Paciente de 40 años, con antecedente de hipotiroidismo, presenta un cuadro de cetoacidosis diabética. No presenta antecedentes familiares de diabetes, sin antecedentes de importancia. Al examen físico, se encuentra IMC de 20,5. ¿Cuál es el diagnóstico más probable?',
      'Diabetes mellitus 1',
      'Diabetes mellitus 2',
      'Diabetes mellitus LADA',
      'Diabetes mellitus MODY',
      'Cetoacidosis congénita',
      'c',
      'Cetoacidosis sugiere DM1 o LADA (autoinmunes). Antecedente de hipotiroidismo sugiere causa autoinmune. Peso normal hace poco probable DM2. DM LADA es diabetes autoinmune de aparición tardía.',
      'medium'
    ),
    (
      'Paciente de 28 años, con diagnóstico de anorexia, desnutrida, que pesa 45 kilos y mide 1,75 metros, es hospitalizada para inicio de su alimentación por sonda nasogástrica, recibiendo una dosis de 2.000 calorías al día, en el primer día. Inicia con arritmia ventricular por torsión de puntas. ¿Cuál es el diagnóstico más probable?',
      'Déficit de vitamina B1',
      'Déficit de vitamina B12',
      'Síndrome de realimentación',
      'Hipercalcemia',
      'Hipoglicemia severa',
      'c',
      'Síndrome de realimentación: depleción aguda de oligoelementos (hipomagnesemia, hipocalemia, hipofosfemia), alarga QT y torsión de puntas. Causa: alimentación agresiva en paciente crónicamente desnutrido. Iniciar con ~10 kcal/kg/día más oligoelementos y subir progresivamente.',
      'medium'
    )
  ) AS q(stem, a, b, c, d, e, correct, explanation, diff)
  WHERE s.code = 'diabetes'
  RETURNING id
),
exam_1_2 AS (
  SELECT id FROM exams WHERE title = '1.2 Cuestionario Diabetes' LIMIT 1
)
INSERT INTO exam_questions (exam_id, question_id, order_index)
SELECT
  e.id,
  ins.id,
  ROW_NUMBER() OVER (ORDER BY ins.id) AS order_index
FROM inserted ins
CROSS JOIN exam_1_2 e;

-- Confirmar
SELECT COUNT(*) AS preguntas_1_2
FROM exam_questions
WHERE exam_id = (SELECT id FROM exams WHERE title = '1.2 Cuestionario Diabetes' LIMIT 1);
