-- ============================================================
-- SEED: 1.3 Cuestionario Diabetes (14 preguntas)
-- Cap_1_OR_Jul_2026 — 1.3. Cuestionario Diabetes
-- Requiere: schema.sql ya ejecutado, examen "1.3 Cuestionario Diabetes" existente
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
      'Usted atiende a un paciente de 67 años, con antecedente de insuficiencia cardíaca CF II, como secuela de un infarto agudo al miocardio, que sufrió hace 5 meses. Actualmente es usuario de aspirina, atorvastatina y metformina en dosis máxima. Se realiza HbA1c, que resulta 7,5%. ¿Qué medida es más adecuada para su control metabólico?',
      'Agregar empaglifozina',
      'Reemplazar la metformina por sitagliptina',
      'Mantener el tratamiento',
      'Reemplazar la metformina por pioglitazona',
      'Agregar glibenclamida',
      'a',
      'HbA1c >7% obliga a avanzar. Por enfermedad coronaria e insuficiencia cardíaca está indicado SGLT-2 (empaglifozina) o GLP-1 (liraglutide, semaglutide). También insulina. Debe mantener aspirina, estatinas, enalapril y betabloqueantes.',
      'medium'
    ),
    (
      'Un paciente de 66 años, diabético tipo 2, en tratamiento con metformina 850 mg c/12 horas e insulina NPH 12 UI cada noche, se realiza exámenes de control, que muestran hemoglobina glicosilada de 7,8%, perfil lipídico adecuado. Además, se realiza controles frecuentes de glicemia capilar, que muestran que sus glicemias matinales tanto antes como después del desayuno están elevadas, mientras que las glicemias de la tarde y noche están normales. ¿Cuál es la conducta más adecuada desde el punto de vista metabólico?',
      'Cambiar el horario de la insulina NPH a la mañana',
      'Agregar una dosis de insulina NPH matinal',
      'Mantener el tratamiento sin cambios',
      'Agregar insulina cristalina matinal',
      'Aumentar la dosis de NPH nocturna',
      'e',
      'HbA1c >7% obliga a avanzar. Glicemias de ayuno y postdesayuno elevadas se corrigen aumentando la NPH nocturna (determina predesayuno y así postdesayuno). Si >75 años (objetivo HbA1c 8%) o HbA1c <7% podría mantenerse.',
      'medium'
    ),
    (
      'Un paciente de 34 años es ingresado al servicio de urgencia, debido a un cuadro de cetoacidosis diabética, el que es manejado adecuadamente. No tenía diagnóstico previo de diabetes y como antecedentes solo tomaba levotiroxina, con buen control y polivitamínicos. Al quinto día de hospitalización, su examen físico es normal y se mantiene con glicemias normales, con bajas dosis de insulina cristalina c/6 horas, por lo que se encuentra en condiciones de ser dado de alta. ¿Cuál es la conducta más adecuada para su manejo glicémico al alta?',
      'Indicar insulina NPH nocturna',
      'Indicar insulina glargina más 3 dosis de insulina cristalina',
      'Indicar metformina oral en dosis máxima',
      'Indicar metformina y sitagliptina en dosis altas',
      'Indicar insulina cristalina cada 6 horas',
      'b',
      'Hipotiroidismo autoinmune y debut con cetoacidosis sugieren diabetes autoinmune/LADA. Se debe iniciar insulina en esquema intensificado (glargina + 3 cristalinas) y solicitar anticuerpos. Además HbA1c, perfil lipídico y exámenes de daño a órgano blanco.',
      'medium'
    ),
    (
      'Un paciente de 10 años presenta un cuadro de dolor abdominal y vómitos, asociado a deterioro del estado general y desorientación. Su madre refiere que desde hace 4 días que ha estado decaído, con náuseas y que el día de hoy comenzó con vómitos, desorientación y tendencia al sopor. Al examen físico, está desorientado en el tiempo y espacio, pero no tiene focalidad neurológica; se observa taquicárdico a 110x'', con FR: 23x'', PA: 90/60 mmHg y Tº: 37,0ºC. Su examen cardiopulmonar muestra ritmo regular en 2 tonos, sin soplos y murmullo pulmonar presente sin otros ruidos. Su examen abdominal muestra abdomen blando, sin signos peritoneales. Se instala una vía venosa, para reposición de fluidos y administración de fármacos. ¿Qué examen es más adecuado para iniciar su estudio?',
      'Radiografía de tórax y abdomen, en posición de pie',
      'TAC de abdomen y pelvis',
      'Glicemia',
      'Laparotomía exploradora',
      'Endoscopía digestiva alta',
      'c',
      'Sospecha de cetoacidosis diabética. La glicemia es el primer examen en cualquier paciente con compromiso de conciencia.',
      'medium'
    ),
    (
      'Un paciente de 56 años, diabético tipo 2, mal controlado, se realiza un fondo de ojo, que muestra exudados céreos bilaterales y periféricos, con algunas microhemorragias, exudados algodonosos y vasos de neoformación. El paciente refiere que ve perfectamente y que está dispuesto a mejorar su adherencia a tratamiento, admitiendo que olvida tomar sus medicamentos (metformina 850 mg c/8 horas y glibenclamida 5 mg c/12 horas) la gran mayoría de los días. Su hemoglobina glicosilada es 8,5%. Además de insistir en la importancia de seguir las indicaciones médicas, ¿cuál es la conducta más adecuada?',
      'Reemplazar los hipoglicemiantes por insulina glargina más 3 refuerzos de insulina cristalina',
      'Realizar evaluación del rojo pupilar',
      'Solicitar un nuevo fondo de ojo en 3 meses',
      'Derivar a oftalmología para fotocoagulación láser e inicio de fármacos antiangiogénicos',
      'Reemplazar los hipoglicemiantes orales por insulina NPH',
      'd',
      'Retinopatía diabética proliferativa (neovasos) requiere con urgencia fotocoagulación más antiangiogénicos por riesgo de hemorragia vítrea. No esperar 3 meses. Rojo pupilar no aporta si ya hay fondo de ojo. HbA1c <9% no indica insulina por ahora; primero asegurar adherencia.',
      'medium'
    ),
    (
      'Un paciente de 55 años, diabético tipo 2, diagnosticado hace 6 meses, está en tratamiento con metformina 850 mg XR c/12 horas. Su HbA1c resulta 6,5%, sin embargo, refiere que, desde el diagnóstico, presenta diarrea y náuseas que le son muy molestas. ¿Cuál es la conducta más adecuada?',
      'Reemplazar la metformina por otro hipoglicemiante oral',
      'Indicar dieta baja en fibra',
      'Reemplazar la metformina por insulina',
      'Solicitar colonoscopía, endoscopía digestiva alta, anticuerpos anti-TGR, ASCA y ANCA.',
      'Disminuir la dosis de metformina',
      'a',
      'Los síntomas gastrointestinales son efectos adversos frecuentes de la metformina. Ya está con XR; si persisten, reemplazar por otro hipoglicemiante. Control está bien (cercano a 7%); no se puede bajar dosis. Colonoscopía a >50 años es screening, no por estos síntomas.',
      'medium'
    ),
    (
      'Un paciente de 55 años, obeso y diabético tipo 2, diagnosticado hace un año, acude a su segundo control. Está en tratamiento con metformina XR 850 mg cada 12 horas y dieta. Su IMC se ha mantenido en 37 desde que fue diagnosticado. Su hemoglobina glicosilada resulta 9,5%, su glicemia de ayuno: 105 mg/dl, su fondo de ojo es normal, al igual que sus pruebas de función renal. Niega cualquier síntoma y su examen físico es normal. Además de reforzar las medidas no farmacológicas, la conducta más adecuada es:',
      'Agregar sitagliptina al tratamiento',
      'Agregar insulina NPH nocturna al tratamiento',
      'Agregar glibenclamida al tratamiento',
      'Explicar que no es necesario hacer cambios en su tratamiento farmacológico',
      'Aumentar la metformina XR a 850 mg cada 8 horas',
      'b',
      'HbA1c >9% indica pésimo control; está indicada insulinoterapia. En DM2 se inicia con NPH en una dosis (habitualmente nocturna). La glicemia de ayuno aceptable es irrelevante frente a la HbA1c de los últimos 2-3 meses.',
      'medium'
    ),
    (
      'Un paciente de 66 años, con antecedente de diabetes mellitus 2, hipertensión arterial, pie diabético y cirugía de revascularización femoropoplíteo se realiza exámenes de control, que muestran colesterol HDL: 30 mg/dl, colesterol LDL:100 mg/dl, triglicéridos: 490 mg/dl y colesterol total: 228 mg/dl, glicemia de ayuno: 120 mg/dl, hemoglobina glicosilada: 6,9%, relación albuminuria / creatininuria: 0,02, creatinina: 1,1 mg/dl, BUN: 18 mg/dl. Actualmente utiliza metformina en dosis máxima, aspirina, enalapril 10 mg c/12 horas y amlodipino 10 mg/dl. Su presión arterial promedio es 128/78 mg/dl. ¿Qué conducta es la más adecuada?',
      'Agregar un segundo hipoglicemiante oral',
      'Agregar atorvastatina 20 mg/día',
      'Reemplazar el amlodipino por hidroclorotiazida',
      'Agregar gemfibrozilo 600 mg/día',
      'Reemplazar el enalapril por atenolol',
      'b',
      'Dislipidemia: HDL bajo, LDL alto para riesgo CV (meta <70 en diabético), TG altos pero <500. Prioridad: estatina. HTA bien manejada (<130/80). RAC normal (microalbuminuria >0,03). Evitar tiazidas y betabloqueantes en diabéticos cuando sea posible.',
      'medium'
    ),
    (
      'Un paciente de 67 años, diabético tipo 2, con mal control, consulta por parestesias y dolor urente en las extremidades inferiores. Al examen físico tiene disminución de la sensibilidad termalgésica distal y presenta alodina importante. ¿Qué fármaco es más adecuado para el manejo del dolor?',
      'Paracetamol',
      'Prednisona',
      'Celecoxib',
      'Tramadol',
      'Venlafaxina',
      'e',
      'Neuropatía diabética dolorosa. Además de optimizar control (idealmente insulina), indicar modulador del dolor neuropático: antidepresivos duales (venlafaxina, duloxetina), gabapentina, pregabalina o ADTC en jóvenes. Alodinia = dolor por estímulos no dolorosos.',
      'medium'
    ),
    (
      'Un paciente de 60 años ha presentado varios cuadros de palpitaciones y sudoración, que han sido catalogados como arritmias o crisis de pánico. Se ha realizado holter de arritmias, TSH y exámenes generales, que han resultado normales. En el último episodio, se tomó la glicemia capilar, dado que su esposa es diabética y, para su sorpresa, marcó 45 mg/dl, por lo que tomó agua con azúcar, desapareciendo los síntomas a los pocos minutos. Su examen físico es normal. Además de una anamnesis detallada, ¿qué examen es el más adecuado para proseguir el estudio de este paciente?',
      'Niveles plasmáticos de insulina y péptido C',
      'Glicemia de ayuno de 24 horas',
      'Hemoglobina glicosilada',
      'Anticuerpos anti-insulina, anti-GAD, anti-tirosinfosfoquinasa 2 y anti-transportador de Zinc 8',
      'Test de tolerancia a la glucosa oral',
      'a',
      'Hipoglicemia con triada de Whipple (síntomas + glicemia baja objetivada + mejoría con azúcar). Insulinemia y péptido C ayudan a identificar causa. Repetir desencadenantes y glicemias seriadas. HbA1c es para diabetes; anticuerpos para LADA/DM1.',
      'medium'
    ),
    (
      'Una paciente de 36 años, cursando embarazo de 10 semanas, se realiza una glicemia de ayuno que resulta 128 mg/dl, por lo que se repite, obteniéndose el mismo valor. Su diagnóstico más probable es:',
      'Glicemia de ayuno alterada',
      'Embarazo normal',
      'Intolerancia a la glucosa oral',
      'Diabetes gestacional',
      'Diabetes pregestacional',
      'e',
      'Dos glicemias ≥126 en las primeras 12 semanas = diabetes pregestacional (DMPG). DMG sería 100-125 antes de 12 sem o diagnosticada después con otro criterio. Fuera del embarazo también sería DM (probablemente tipo 2).',
      'medium'
    ),
    (
      'Un paciente de 18 años, diabético tipo 1, en tratamiento, presenta compromiso de conciencia, de 20 minutos de evolución. Previo a esto presentó un cuadro de malestar general de 2 días de evolución, en contexto de una infección respiratoria. Al examen físico está en sopor profundo, con FR: 25x'', saturación: 99%, FC: 120x'' y PA: 100/60 mmHg. Su hemoglucotest resulta 450 mg/dl y se solicitan exámenes de laboratorio, que están pendientes. La primera medida es:',
      'Administrar suero glucosado endovenoso',
      'Administrar insulina endovenosa',
      'Administrar oxígeno por mascarilla',
      'Administrar suero fisiológico endovenoso',
      'Administrar bicarbonato endovenoso',
      'd',
      'Sospecha de cetoacidosis diabética (HGT elevado descarta hipoglicemia). Primera medida en CAD y Sd. HGHO: suero fisiológico ev. No dar insulina ni potasio hasta tener resultado de potasemia.',
      'medium'
    ),
    (
      'Un paciente de 35 años, con antecedente de hipotiroidismo es diagnosticado de diabetes mellitus, mediante dos glicemias de ayuno, de 205 y 224 mg/dl, respectivamente. Inicia tratamiento con dieta y metformina 500 mg cada 8 horas, con empeoramiento de sus glicemias en los 3 meses siguientes. Sus niveles de HbA1c resultan 9,9% y su péptido C está muy disminuido. La conducta más adecuada es:',
      'Aumentar la dosis de metformina a 1 g cada 8 horas',
      'Agregar glibenclamida 10 mg c/12 horas',
      'Reemplazar la metformina por sitagliptina',
      'Agregar insulina NPH nocturna',
      'Reemplazar el tratamiento por insulinoterapia en esquema intensificado',
      'e',
      'Sospecha de LADA (severidad, autoinmunidad, péptido C bajo). Se trata como DM1: insulina en esquema intensificado. Habitualmente HbA1c >9% indica agregar NPH, pero aquí el contexto obliga a esquema intensificado.',
      'medium'
    ),
    (
      'Un paciente de 66 años es hospitalizado por una pielonefritis aguda. En su hemoglucotest de ingreso, se constata una glicemia capilar de 356 mg/dl. Además, se solicita una glicemia en sangre venosa, con un resultado de 230 mg/dl y hemoglobina glicosilada de 8,5%. ¿Cuál es la conducta más adecuada para el manejo de la hiperglicemia en este momento (durante su hospitalización)?',
      'Debe manejarse con insulina NPH, en dos dosis diarias',
      'Debe manejarse con insulina cristalina, en cuatro dosis diarias',
      'Debe manejarse con metformina más glibenclamida, por vía oral',
      'Dado que solo tiene una glicemia venosa elevada y no tenía síntomas de diabetes, lo más adecuado es indicar solo dieta',
      'Debe manejarse con metformina sola',
      'b',
      'Diabetes en contexto de infección grave: manejo con insulina cristalina cada 6 horas (4 dosis/día). La glicemia en infección no diagnostica DM; la HbA1c ≥6,5% sí (refleja últimos 3 meses).',
      'medium'
    )
  ) AS q(stem, a, b, c, d, e, correct, explanation, diff)
  WHERE s.code = 'diabetes'
  RETURNING id
),
exam_1_3 AS (
  SELECT id FROM exams WHERE title = '1.3 Cuestionario Diabetes' LIMIT 1
)
INSERT INTO exam_questions (exam_id, question_id, order_index)
SELECT
  e.id,
  ins.id,
  ROW_NUMBER() OVER (ORDER BY ins.id) AS order_index
FROM inserted ins
CROSS JOIN exam_1_3 e;

-- Confirmar
SELECT COUNT(*) AS preguntas_1_3
FROM exam_questions
WHERE exam_id = (SELECT id FROM exams WHERE title = '1.3 Cuestionario Diabetes' LIMIT 1);
