-- ============================================================
-- SEED: 1.1 Cuestionario Diabetes (15 preguntas)
-- Requiere: schema.sql ya ejecutado
-- ============================================================

-- Inserta las 15 preguntas y las vincula al examen ya existente
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
      'Un paciente de 20 años, diabético tipo 1, en tratamiento con Lantus nocturna y tres dosis de insulina cristalina preprandial, presenta glicemias preprandiales normales y postalmuerzo 190, postcena 210. Su HbA1c es 8%. La conducta más adecuada es:',
      'Aumentar la dosis de Lantus',
      'Aumentar la insulina cristalina del desayuno y del almuerzo',
      'Aumentar la insulina cristalina del almuerzo y cena',
      'Aumentar la dosis de Lantus y de las 3 insulinas cristalinas',
      'Agregar una dosis matinal de Lantus',
      'c',
      'Las glicemias preprandiales dependen de la insulina lenta (glargina): están bien. Las postprandiales dependen de la rápida (cristalina). Solo postalmuerzo y postcena están elevadas → aumentar cristalina en esos horarios. La Lantus se subiría si las glicemias precomidas estuvieran elevadas.',
      'medium'
    ),
    (
      'Un paciente diabético de 50 años, en tratamiento con dieta, presenta: LDL 120 mg/dl, TG 600 mg/dl, HDL 30 mg/dl. La conducta más adecuada es:',
      'Manejar con dieta',
      'Iniciar insulina',
      'Iniciar una estatina',
      'Iniciar un fibrato',
      'Iniciar ácido nicotínico',
      'd',
      'Por ser diabético, meta LDL <70 (elevado). Tiene TG >500 y HDL bajo: dislipidemia mixta. Con TG >500 la hipertrigliceridemia pasa a ser la prioridad → fibrato. Si TG hubiesen sido <500, la respuesta habría sido la estatina.',
      'medium'
    ),
    (
      'Un paciente de 60 años con glicemia de ayuno de 120 mg/dl, sin síntomas. ¿Qué examen es más adecuado para proseguir el estudio?',
      'Test de tolerancia a la glucosa',
      'Glicemia de ayuno',
      'Índice de HOMA',
      'Hemoglobina glicosilada',
      'Insulinemia basal',
      'a',
      'Glicemia <100 = normal. Entre 100-125 mg/dl → TTGO. Mayor a 125 → repetir para confirmar DM. En embarazo, glicemias ≥100 se repiten directamente.',
      'medium'
    ),
    (
      'Una paciente de 65 años sin antecedentes presenta episodios de palpitaciones, malestar y sudoración en ayuno, con HGT de 45 mg/dl. ¿Qué examen determina la etiología de la hipoglicemia?',
      'Glicemia de ayuno',
      'Test de tolerancia a la glucosa',
      'Niveles plasmáticos de insulina',
      'Niveles plasmáticos de glucagón',
      'Niveles plasmáticos de péptido C',
      'e',
      'Hipoglicemias de ayuno (insulinoma, cáncer, autoinmune, IRC, DHC). El péptido C refleja producción de insulina endógena y es más estable. Alto = insulinoma; Bajo + insulina alta = insulina exógena (facticia). Hipoglicemias reactivas → prueba de tolerancia a comida mixta.',
      'hard'
    ),
    (
      '¿Qué tratamiento está indicado ante la aparición de microalbuminuria persistente en un paciente con diabetes mellitus tipo 2?',
      'Insulina',
      'Dieta hipoproteica',
      'Dieta hiperproteica',
      'iECAs',
      'Atorvastatina',
      'd',
      'Microalbuminuria (>30 mg/día o RAC >0,03) persistente (>3 meses) = nefropatía diabética inicial → IECA (enalapril, lisinopril). La insulina está indicada en nefropatía establecida con caída del clearence. Los ARA2 (losartán, valsartán) son alternativa válida.',
      'medium'
    ),
    (
      'Un paciente de 55 años, DM2 con metformina 500 mg c/12h, presenta HbA1c 8,5%, creatinina 1,8 mg/dl y proteinuria 24h de 500 mg. La conducta más adecuada es:',
      'Agregar glibenclamida',
      'Aumentar la dosis de metformina',
      'Iniciar insulina',
      'Iniciar hemodiálisis',
      'Reforzar dieta y controlar',
      'c',
      'Con IRC (creatinina >1,4), están contraindicados metformina y glibenclamida → de elección insulina (o GLP-1). Proteinuria → iniciar IECA. HbA1c 8,5% per sé no indica insulina, pero la IRC sí. Al iniciar insulina se suspende metformina por IRC.',
      'hard'
    ),
    (
      'Un paciente de 65 años, DM2 con tratamiento irregular, consulta por dolor neurálgico en dermátomo L4. Enflaquecido, disminución de sensibilidad distal, sin alteraciones motoras. HbA1c 9,9%. La conducta más adecuada es:',
      'Reforzar hipoglicemiantes orales y controlar en 3 meses',
      'Suspender glibenclamida y agregar insulina NPH nocturna',
      'Indicar zapatos adecuados y regularizar HGO',
      'Indicar ejercicio, reforzar adhesión y controlar en 7 días',
      'Hospitalizar, iniciar insulinoterapia y venlafaxina oral',
      'e',
      'Neuropatía diabética dolorosa → moduladores del dolor (venlafaxina, duloxetina, gabapentina, pregabalina, ADTC) + insulina (especialmente con dolor y atrofia). HbA1c >9% también indica insulina. Hospitalización recomendada para inicio cuidadoso.',
      'hard'
    ),
    (
      'Un DM2 con metformina 850 mg c/8h, aspirina y enalapril 20 mg c/12h. Creatinina 2,0 mg/dl, proteinuria 350 mg/dl, glicemia ayuno 140, HbA1c 8,5%. La conducta más adecuada es:',
      'Mantener el tratamiento y controlar en 3 meses',
      'Aumentar la dosis de metformina',
      'Agregar glibenclamida',
      'Reemplazar metformina por metformina de liberación prolongada',
      'Iniciar insulina',
      'e',
      'IRC (creatinina >1,4): contraindicados todos los HGO → indicada insulina o GLP-1. Proteinuria >300 mg/día requiere IECA, pero con clearence muy bajo ajustar dosis y monitorizar función renal e hiperkalemia.',
      'hard'
    ),
    (
      'Un paciente de 60 años, hipertenso, con IAM anterior hace 1 año (angioplastia), presenta: colesterol total 220, HDL 40, LDL 160, TG 100 mg/dl. Sin hipolipemiantes. La conducta más adecuada para el manejo de sus lípidos es:',
      'Observar evolución',
      'Indicar dieta baja en grasas y controlar en 3 meses',
      'Indicar dieta e iniciar una estatina',
      'Indicar dieta e iniciar un fibrato',
      'Indicar dieta, estatina y fibrato',
      'c',
      'IAM previo = riesgo cardiovascular máximo → meta LDL <70 mg/dl. LDL 160 muy elevado. HDL bajo, TG normales (<150). Prioridad: LDL → estatina de alta potencia. Médicos generales no deben combinar estatinas con fibratos (riesgo de rabdomiólisis).',
      'medium'
    ),
    (
      'Una paciente con 5 hipoglicemias hospitalizadas. Familiares sospechan autoinducción. En hospitalización: insulina 55 UI/L y péptido C elevado. ¿Cuál diagnóstico es más probable?',
      'Hipoglicemia facticia por insulina',
      'Hipoglicemia facticia por metformina',
      'Hipoglicemia facticia por glibenclamida',
      'Hipoglicemia facticia por pioglitazona',
      'Hipoglicemia de ayuno',
      'c',
      'Péptido C elevado = páncreas produciendo mucha insulina. Glibenclamida (sulfonilúrea) es secretagoga → insulina alta + péptido C alto. Insulina exógena: insulina alta + péptido C bajo. Metformina/pioglitazona no secretagogas → insulina y péptido C bajos en hipoglicemia.',
      'hard'
    ),
    (
      'Un niño de 8 años con astenia, baja de peso de 2 semanas, poliuria y polidipsia. Glicemia de ayuno: 220 mg/dl. La conducta más adecuada es:',
      'Repetir la glicemia en 7 días',
      'Iniciar insulina NPH en dos dosis',
      'Iniciar insulina en esquema intensificado (glargina + cristalina en 3 comidas)',
      'Solicitar test de tolerancia a la glucosa',
      'Iniciar dieta, ejercicio y metformina',
      'c',
      'Diagnóstico DM: glicemia ≥200 + síntomas (poliuria, polidipsia, baja de peso). En niño = DM tipo 1 → insulina en esquema intensificado (glargina + ultrarrápida): tratamiento de elección. En adulto con síntomas también se estabiliza con insulina.',
      'medium'
    ),
    (
      'Un paciente de 56 años con: colesterol total 348, HDL 30, LDL 190, TG 640 mg/dl. La conducta más adecuada es:',
      'Iniciar dieta y ejercicio',
      'Iniciar dieta y una estatina',
      'Iniciar dieta y un fibrato',
      'Iniciar dieta, estatina y fibrato',
      'Hospitalizar e iniciar insulina cristalina',
      'c',
      'LDL elevado, TG >500 (prioridad) y HDL bajo. Con TG >500 → fibrato primero (evitar pancreatitis). Médicos generales no deben combinar estatinas con fibratos. Solo especialistas pueden usar estatina + fenofibrato en casos seleccionados.',
      'medium'
    ),
    (
      'DM2 de 45 años con metformina en dosis máxima. HbA1c 7,5%, glicemias postalmuerzo 190, postcena 180, precena 135. Sin indicación de insulina ni contraindicación de HGO. La conducta más adecuada es:',
      'Agregar glibenclamida y mantener la metformina',
      'Iniciar glibenclamida y suspender la metformina',
      'Iniciar insulina NPH matinal',
      'Iniciar insulina NPH nocturna',
      'Iniciar insulina cristalina con las 3 comidas',
      'a',
      'Control insuficiente (HbA1c >7%). Solo con metformina en dosis máximas → agregar glibenclamida (o GLP-1, SGLT-2, DPP-4 si disponibles). En >75 años bien controlado se mantiene; si HbA1c >8% en anciano, preferir sitagliptina o liraglutide.',
      'medium'
    ),
    (
      'DM2 con dieta irregular, consulta por dolor urente en ambas EEII especialmente nocturno, con alodinia, sin focalidad neurológica ni lesiones cutáneas. La conducta más adecuada es:',
      'Iniciar metformina y AINEs',
      'Iniciar glibenclamida y clomipramina',
      'Iniciar metformina y gabapentina',
      'Iniciar insulina y pregabalina',
      'Iniciar insulina y AINEs',
      'd',
      'Neuropatía diabética dolorosa (dolor neuropático + alodinia). Tratamiento: insulina (solo ella acelera la desaparición del dolor) + moduladores: pregabalina, gabapentina (útiles en ancianos en que ADTC están contraindicados), venlafaxina, duloxetina o ADTC.',
      'hard'
    ),
    (
      'Un paciente de 50 años, DM2 con metformina 500 mg c/8h, trae HbA1c 10,3% y proteinuria 24h de 500 mg/dl. ¿Cuál es la conducta más adecuada para el control metabólico?',
      'Mantener la metformina y hacer hincapié en la dieta',
      'Aumentar la metformina a 850 mg c/8h y agregar enalapril',
      'Agregar glibenclamida 5 mg c/12h',
      'Agregar sitagliptina',
      'Iniciar insulina y valsartán',
      'e',
      'HbA1c ≥9% → indicación de insulina NPH nocturna. Sin IRC ni DHC → mantener metformina. Proteinuria implica nefropatía → IECA (enalapril) o ARA2 (valsartán). La opción E incluye insulina + valsartán (ARA2): correcta.',
      'medium'
    )
  ) AS q(stem, a, b, c, d, e, correct, explanation, diff)
  WHERE s.code = 'diabetes'
  RETURNING id
)
-- Vincula preguntas al examen 1.1 Cuestionario Diabetes
INSERT INTO exam_questions (exam_id, question_id, order_index)
SELECT
  e.id,
  ins.id,
  ROW_NUMBER() OVER (ORDER BY ins.id) AS order_index
FROM inserted ins
CROSS JOIN (
  SELECT id FROM exams WHERE title = '1.1 Cuestionario Diabetes' LIMIT 1
) e;

-- Confirmar
SELECT COUNT(*) as preguntas_insertadas FROM exam_questions
WHERE exam_id = (SELECT id FROM exams WHERE title = '1.1 Cuestionario Diabetes' LIMIT 1);
