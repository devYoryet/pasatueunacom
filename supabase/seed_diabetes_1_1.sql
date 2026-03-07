-- ============================================================
-- SEED: 1.1 Cuestionario Diabetes (15 preguntas)
-- Especialidad: Diabetes y Nutrición (código DI en Medicina Interna)
-- ============================================================
-- 1. Verifica que exista el examen antes de insertar.
--    Ajusta exam_id si corresponde a otro valor en tu base.
-- ============================================================

-- Paso 1: Obtén el id de la especialidad
-- SELECT id FROM specialties WHERE code = 'DI';

-- Paso 2: Crea (o verifica) el examen
INSERT INTO exams (title, specialty_id, exam_type, question_count, order_index, is_active, description)
SELECT
  '1.1 Cuestionario Diabetes',
  s.id,
  'cuestionario',
  15,
  1,
  true,
  'Cuestionario de Diabetes - Capítulo 1. Temas: insulinoterapia, dislipidemias, diagnóstico, hipoglicemia, nefropatía, neuropatía.'
FROM specialties s
WHERE s.code = 'DI'
ON CONFLICT DO NOTHING;

-- Paso 3: Inserta las preguntas
WITH new_questions AS (
  INSERT INTO questions
    (body, option_a, option_b, option_c, option_d, option_e, correct_answer, explanation, difficulty, specialty_id, is_active)
  SELECT q.body, q.a, q.b, q.c, q.d, q.e, q.correct, q.explanation, q.diff, s.id, true
  FROM specialties s
  CROSS JOIN (VALUES
    (
      'Un paciente de 20 años, diabético tipo 1, en tratamiento con una dosis de Lantus (insulina glargina) en la noche y tres dosis de insulina cristalina, previas al desayuno, almuerzo y cena, presenta glicemias preprandiales normales y postprandiales elevadas en almuerzo (190) y cena (210). Su HbA1c es 8%. La conducta más adecuada es:',
      'Aumentar la dosis de Lantus',
      'Aumentar la insulina cristalina del desayuno y del almuerzo',
      'Aumentar la insulina cristalina del almuerzo y cena',
      'Aumentar la dosis de Lantus y de las 3 insulinas cristalinas',
      'Agregar una dosis matinal de Lantus',
      'C',
      'Las glicemias preprandiales dependen de la insulina lenta (glargina), que está bien controlada. Las glicemias postprandiales dependen de la insulina rápida (cristalina). Solo postalmuerzo y postcena están elevadas, por lo que se debe aumentar la cristalina en esos horarios. La Lantus se subiría si las glicemias precomidas estuvieran elevadas.',
      'medium'
    ),
    (
      'Un paciente diabético de 50 años, en tratamiento con dieta, presenta: LDL 120 mg/dl, TG 600 mg/dl, HDL 30 mg/dl. La conducta más adecuada es:',
      'Manejar con dieta',
      'Iniciar insulina',
      'Iniciar una estatina',
      'Iniciar un fibrato',
      'Iniciar ácido nicotínico',
      'D',
      'Por ser diabético, la meta de LDL es <70 (está elevado). Tiene TG elevados (>150) y HDL bajo (<40): dislipidemia mixta. Con TG >500, la hipertrigliceridemia pasa a ser la prioridad y se trata con fibrato. Si TG hubiesen sido <500, la estatina sería la respuesta.',
      'medium'
    ),
    (
      'Un paciente de 60 años se realiza una glicemia de ayuno que resulta 120 mg/dl. No ha presentado síntomas y su examen físico es normal. ¿Qué examen es más adecuado para proseguir el estudio?',
      'Test de tolerancia a la glucosa',
      'Glicemia de ayuno',
      'Índice de HOMA',
      'Hemoglobina glicosilada',
      'Insulinemia basal',
      'A',
      'Glicemia <100: normal, alta. Entre 100-125 mg/dl: pedir TTGO. >125 mg/dl: repetir para confirmar DM. En este caso 120 mg/dl (entre 100-125) → se solicita TTGO. En embarazo, glicemias ≥100 se repiten.',
      'medium'
    ),
    (
      'Una paciente de 65 años sin antecedentes presenta episodios de palpitaciones, malestar y sudoración en ayuno, con HGT de 45 mg/dl durante uno. ¿Qué examen es el más adecuado para determinar la etiología?',
      'Glicemia de ayuno',
      'Test de tolerancia a la glucosa',
      'Niveles plasmáticos de insulina',
      'Niveles plasmáticos de glucagón',
      'Niveles plasmáticos de péptido C',
      'E',
      'Hipoglicemias de ayuno (insulinomas, cáncer, autoinmune, IRC, DHC). El péptido C refleja la producción de insulina endógena y es más estable. Alto: insulinoma. Bajo con insulina alta: insulina exógena (facticia). Hipoglicemias reactivas (2-4 h postprandiales) → prueba de tolerancia a la comida mixta.',
      'hard'
    ),
    (
      '¿Qué tratamiento está indicado ante la aparición de microalbuminuria persistente en un paciente con diabetes mellitus tipo 2?',
      'Insulina',
      'Dieta hipoproteica',
      'Dieta hiperproteica',
      'iECAs',
      'Atorvastatina',
      'D',
      'Microalbuminuria (>30 mg/día o RAC >0,03) persistente (>3 meses) = nefropatía diabética inicial → IECA (enalapril, lisinopril). La insulina está indicada en nefropatía establecida con caída del clearence. Los ARA2 (losartán, valsartán) son alternativa válida.',
      'medium'
    ),
    (
      'Un paciente de 55 años, diabético tipo 2 con metformina 500 mg c/12h, presenta HbA1c 8,5%, creatinina 1,8 mg/dl y proteinuria 24h de 500 mg. La conducta más adecuada es:',
      'Agregar glibenclamida',
      'Aumentar la dosis de metformina',
      'Iniciar insulina',
      'Iniciar hemodiálisis',
      'Hacer énfasis en la dieta y controlar',
      'C',
      'Con IRC (creatinina >1,4), están contraindicados metformina y glibenclamida. De elección: insulina (también GLP-1 como semaglutida). Con proteinuria → iniciar IECA. HbA1c 8,5% per sé no indica insulina (se requeriría ≥9%), pero la IRC sí lo hace. Al iniciar insulina se suspende metformina por IRC.',
      'hard'
    ),
    (
      'Un paciente de 65 años, diabético tipo 2 con tratamiento irregular, consulta por dolor neurálgico en dermátomo L4. Al examen: enflaquecido, disminución de sensibilidad distal, sin alteraciones motoras. HbA1c 9,9%. La conducta más adecuada es:',
      'Reforzar hipoglicemiantes orales y controlar en 3 meses',
      'Suspender glibenclamida y agregar insulina NPH nocturna',
      'Indicar zapatos adecuados, revisión de pies y regularizar HGO',
      'Indicar ejercicio, reforzar adhesión y controlar en 7 días',
      'Hospitalizar, iniciar insulinoterapia y venlafaxina oral',
      'E',
      'Neuropatía diabética dolorosa → moduladores del dolor (antidepresivos duales: venlafaxina, duloxetina; gabapentinoides: gabapentina, pregabalina; ADTC) + insulina (especialmente con dolor y atrofia). HbA1c >9% también indica insulina. Hospitalización recomendada para inicio cuidadoso de insulinoterapia y evitar hipoglicemias.',
      'hard'
    ),
    (
      'Un paciente diabético tipo 2 en tratamiento con metformina 850 mg c/8h, aspirina y enalapril 20 mg c/12h. Exámenes: creatinina 2,0 mg/dl, proteinuria 350 mg/dl, glicemia ayuno 140, HbA1c 8,5%. La conducta más adecuada es:',
      'Mantener el tratamiento y controlar en 3 meses',
      'Aumentar la dosis de metformina',
      'Agregar glibenclamida',
      'Reemplazar metformina común por metformina de liberación prolongada',
      'Iniciar insulina',
      'E',
      'Con IRC (creatinina >1,4), están contraindicados los HGO (metformina, glibenclamida) → indicada la insulina o GLP-1. La proteinuria elevada (>300 mg/día) requiere IECA, pero con clearence muy bajo hay que ajustar y monitorizar función renal e hiperkalemia.',
      'hard'
    ),
    (
      'Un paciente de 60 años, hipertenso, con IAM de pared anterior hace 1 año (manejado con angioplastia), presenta: colesterol total 220, HDL 40, LDL 160, TG 100 mg/dl. Sin hipolipemiantes. La conducta más adecuada para el manejo de lípidos es:',
      'Observar evolución',
      'Indicar dieta baja en grasas y controlar en 3 meses',
      'Indicar dieta e iniciar una estatina',
      'Indicar dieta e iniciar un fibrato',
      'Indicar dieta e iniciar estatina + fibrato',
      'C',
      'IAM previo = riesgo cardiovascular máximo → meta LDL <70 mg/dl. LDL 160 está muy elevado. HDL bajo (<40) y TG normales (<150). Prioridad: LDL → estatina de alta potencia. Los médicos generales no deben combinar estatinas con fibratos (riesgo de rabdomiólisis).',
      'medium'
    ),
    (
      'Una paciente con 5 hipoglicemias que requirieron hospitalización. Familiares sospechan autoinducción. En hospitalización: insulina 55 UI/L y péptido C elevado. ¿Cuál diagnóstico es más probable?',
      'Hipoglicemia facticia por insulina',
      'Hipoglicemia facticia por metformina',
      'Hipoglicemia facticia por glibenclamida',
      'Hipoglicemia facticia por pioglitazona',
      'Hipoglicemia de ayuno',
      'C',
      'Péptido C elevado = páncreas produciendo mucha insulina. La glibenclamida (sulfonilúrea) es secretagoga, aumenta secreción de insulina → insulina alta + péptido C alto. Insulina exógena: insulina alta + péptido C bajo. Metformina/pioglitazona (no secretagogos) → insulina y péptido C bajos. Hipoglicemia de ayuno (insulinoma, etc.): péptido C e insulina también pueden estar elevados, pero el contexto facticio con familiar sospechoso apunta a glibenclamida.',
      'hard'
    ),
    (
      'Un niño de 8 años con astenia, baja de peso de 2 semanas, poliuria y polidipsia importante. Glicemia de ayuno: 220 mg/dl. La conducta más adecuada es:',
      'Repetir la glicemia en 7 días',
      'Iniciar insulina NPH en dos dosis',
      'Iniciar insulina en esquema intensificado (glargina + cristalina en 3 comidas)',
      'Solicitar test de tolerancia a la glucosa',
      'Iniciar dieta, ejercicio y metformina',
      'C',
      'Diagnóstico de DM: glicemia ≥200 + síntomas (poliuria, polidipsia, baja de peso). En niño = DM tipo 1 (autoinmune) → insulina en esquema intensificado (glargina + ultrarrápida/cristalina): tratamiento de elección. En adulto con síntomas también se estabiliza con insulina, aunque no necesariamente en esquema intensificado.',
      'medium'
    ),
    (
      'Un paciente de 56 años con: colesterol total 348, HDL 30, LDL 190, TG 640 mg/dl. La conducta más adecuada es:',
      'Iniciar dieta y ejercicio',
      'Iniciar dieta y una estatina',
      'Iniciar dieta y un fibrato',
      'Iniciar dieta y asociación estatina + fibrato',
      'Hospitalizar e iniciar insulina cristalina',
      'C',
      'LDL elevado, TG elevados (>500) y HDL bajo. Con TG >500 → prioridad: fibrato para evitar pancreatitis. Los médicos generales no deben combinar estatinas con fibratos. Solo especialistas pueden mezclar estatinas con fenofibrato (no gemfibrozilo) en casos seleccionados.',
      'medium'
    ),
    (
      'Un paciente de 45 años, diabético tipo 2, con metformina en dosis máxima, presenta glicemias pre y postprandiales levemente elevadas (postalmuerzo 190, postcena 180, precena 135) y HbA1c 7,5%. La conducta más adecuada es:',
      'Agregar glibenclamida y mantener la metformina',
      'Iniciar glibenclamida y suspender la metformina',
      'Iniciar insulina NPH matinal',
      'Iniciar insulina NPH nocturna',
      'Iniciar insulina cristalina junto con las 3 comidas',
      'A',
      'Control insuficiente (HbA1c >7%, varias glicemias elevadas). Sin indicación de insulina ni contraindicación de HGO. Solo con metformina en dosis máximas → agregar glibenclamida (o GLP-1, SGLT-2, DPP-4 si disponibles). En paciente >75 años bien controlado se mantiene; si >75 con HbA1c >8% se prefiere sitagliptina o liraglutide (menos hipoglicemias).',
      'medium'
    ),
    (
      'Un paciente diabético tipo 2 con dieta irregular, consulta por dolor urente en ambas EEII, especialmente nocturno, con alodinia, sin focalidad neurológica ni lesiones cutáneas. La conducta más adecuada es:',
      'Iniciar metformina y AINEs',
      'Iniciar glibenclamida y clomipramina',
      'Iniciar metformina y gabapentina',
      'Iniciar insulina y pregabalina',
      'Iniciar insulina y AINEs',
      'D',
      'Neuropatía diabética dolorosa (diagnóstico clínico: dolor neuropático urente + alodinia). Tratamiento: insulina (solo la insulina acelera la desaparición del dolor en neuropatía) + moduladores del dolor: pregabalina, gabapentina (útiles en adultos mayores en que ADTC están contraindicados), venlafaxina, duloxetina o ADTC. Los HGO solos son insuficientes.',
      'hard'
    ),
    (
      'Un paciente de 50 años, diabético tipo 2, con metformina 500 mg c/8h, trae HbA1c 10,3% y proteinuria 24h de 500 mg/dl. ¿Cuál es la conducta más adecuada para el control metabólico?',
      'Mantener la metformina y hacer hincapié en la dieta',
      'Aumentar la metformina a 850 mg c/8h y agregar enalapril',
      'Agregar glibenclamida 5 mg c/12h',
      'Agregar sitagliptina',
      'Iniciar insulina y valsartán',
      'E',
      'HbA1c ≥9% → indicación de insulina NPH nocturna (mantener metformina si no hay IRC). Sin IRC ni DHC que contraindique la metformina → mantener. La proteinuria implica nefropatía → IECA (enalapril) o ARA2 (valsartán). La opción E incluye insulina + valsartán (ARA2): correcta.',
      'medium'
    )
  ) AS q(body, a, b, c, d, e, correct, explanation, diff)
  WHERE s.code = 'DI'
  RETURNING id
)
-- Paso 4: Vincula preguntas al examen
INSERT INTO exam_questions (exam_id, question_id, order_index)
SELECT
  e.id,
  nq.id,
  ROW_NUMBER() OVER () AS order_index
FROM new_questions nq
CROSS JOIN exams e
JOIN specialties s ON e.specialty_id = s.id
WHERE e.title = '1.1 Cuestionario Diabetes'
  AND s.code = 'DI';
