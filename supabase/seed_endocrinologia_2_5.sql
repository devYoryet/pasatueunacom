-- ============================================================
-- SEED: 2.5 Cuestionario Endocrinología (20 preguntas)
-- Cap_1_OR_Jul_2026 — 2.5. Cuestionario Endocrinología
-- Requiere: schema.sql ya ejecutado, examen "2.5 Cuestionario Endocrinología" existente
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
      'Una paciente de 34 años es diagnosticada de hipotiroidismo mediante niveles plasmáticos de TSH y T4. Se inicia tratamiento con levotiroxina 100 ug/día. ¿Cómo y cuándo debe controlarse?',
      'En 2 semanas con niveles plasmáticos de T4',
      'En 2 semanas con niveles plasmáticos de TSH',
      'En 6 semanas con niveles plasmáticos de T4 libre',
      'En 6 semanas con niveles plasmáticos de TSH',
      'En 3 meses con niveles plasmáticos de T4 libre',
      'd',
      'La TSH demora unas 6 semanas en estabilizarse. Control con TSH cada 6 semanas (4-6 aceptable) hasta normalizar; luego cada 3 meses. Si estable, cada 6-12 meses.',
      'easy'
    ),
    (
      'Una paciente de 43 años sufre un accidente de tránsito, con golpe en la cabeza. Evoluciona con hiponatremia de 128 mEq/L. Se solicitan pruebas de función renal, que resultan normales y además se constata una osmolaridad urinaria de 300. ¿Cuál es la conducta más adecuada?',
      'Iniciar una tiazida',
      'Indicar restricción de agua libre a 800 cc al día',
      'Solicitar niveles plasmáticos de ADH',
      'Solicitar TAC de silla turca',
      'Iniciar tratamiento con furosemida',
      'b',
      'SSIADH (post TEC): restricción de agua. Hiponatremia leve (>120, asintomática) en SSIADH, edema o IRC se maneja así.',
      'medium'
    ),
    (
      'Una paciente de 30 años consulta por malestar general y astenia. Al examen físico se aprecian algunas melanoplaquias en la cavidad oral. Se solicitan exámenes generales, en los que destaca hiperkalemia de 5,5 mEq/L. La conducta más adecuada es:',
      'Solicitar TAC de silla turca',
      'Solicitar TAC abdominal',
      'Solicitar cortisol basal y post dexametasona',
      'Solicitar cortisol basal y post ACTH',
      'Solicitar cortisol libre en orina, de 24 horas',
      'd',
      'Sospecha de Addison. Confirmación: prueba de estimulación con ACTH (cortisol basal y post-ACTH). Cortisol basal muy bajo (<80) confirma; muy alto (>500) descarta. Entre 80-500 se hace el test con ACTH.',
      'medium'
    ),
    (
      '¿Qué marcador es más útil para el seguimiento de un cáncer folicular de tiroides, luego de haber completado exitosamente el tratamiento, de modo de detectar precozmente una recidiva?',
      'Niveles plasmáticos de calcitonina',
      'Niveles plasmáticos de triyodotironina',
      'Niveles plasmáticos de tiroglobulina',
      'Niveles plasmáticos de tiroxina',
      'Cintigrafía con yodo radiactivo',
      'c',
      'Cáncer diferenciado (papilar y folicular): seguimiento con tiroglobulina (y ecografía cervical). Si Tg se eleva, cintigrafía para localizar recidiva. Cáncer medular: seguimiento con calcitonina.',
      'medium'
    ),
    (
      'Una paciente de 18 años presenta astenia, constipación, ánimo bajo y somnolencia, por lo que se realiza exámenes generales (hemograma y perfil bioquímico) que muestran cierto grado de anemia e hipercolesterolemia. Además, se palpa un bocio difuso de tamaño moderado y se constata macroglosia. El diagnóstico es:',
      'Enfermedad de Basedow Graves',
      'Tiroiditis de Quervein',
      'Cáncer de tiroides',
      'Tiroiditis de Hashimoto',
      'Tiroiditis de Riedel',
      'd',
      'Hipotiroidismo (astenia, anemia, dislipidemia) + bocio difuso = Hashimoto (causa más frecuente). Quervain: bocio doloroso + hiperT4. Riedel: bocio leñoso. EBG: hiperT4. Cáncer: nodular.',
      'medium'
    ),
    (
      '¿Cuál de las siguientes alteraciones en MENOS probable de ser hallada en un paciente con enfermedad de Cushing?',
      'Elevación de la ACTH',
      'Elevación de la glicemia de ayuno',
      'Hipotensión arterial',
      'Atrofia muscular',
      'Mayor susceptibilidad a contraer infecciones',
      'c',
      'Cushing (tumor hipofisario productor de ACTH): ACTH elevada, diabetes/glucosa alta, HTA (cortisol/aldosterona), atrofia muscular, inmunodepresión/infecciones. No hipotensión.',
      'medium'
    ),
    (
      'Una paciente consulta por otalgia, por lo que se realiza otoscopía, que resulta normal. Al examen físico se aprecia bocio moderado, doloroso a la palpación. Se solicita una TSH que resulta disminuida y una T4, que resulta elevada. El tratamiento más adecuado para la patología descrita es:',
      'Quirúrgico',
      'Levotiroxina',
      'Prednisona',
      'Ibuprofeno',
      'Propiltiouracilo',
      'd',
      'Tiroiditis subaguda de Quervain: AINEs (ibuprofeno). Si muchos síntomas hipertiroideos, agregar betabloqueante; no antitiroideos. Si no responde, agregar prednisona. Fase hipotiroidea suele no requerir tratamiento.',
      'medium'
    ),
    (
      'Un paciente de 35 años presenta un nódulo tiroideo, que es puncionado con una aguja fina, demostrándose la presencia de un cáncer papilar de tiroides. La conducta más adecuada, en este momento, es:',
      'Iniciar levotiroxina',
      'Iniciar tratamiento con yodo radiactivo',
      'Iniciar tratamiento con propiltiouracilo',
      'Resolver mediante tiroidectomía total',
      'Solicitar cintigrafía con yodo radiactivo',
      'd',
      'Cáncer papilar/folicular: tiroidectomía total. Luego cintigrafía para definir dosis de I131 postcirugía. Después levotiroxina (objetivo TSH bajo, ej. 0,1-0,5 según riesgo).',
      'medium'
    ),
    (
      'Una paciente de 50 años presenta astenia, asociada a amenorrea de 5 meses de evolución, por lo que acude al policlínico. Al examen físico se constata que presenta una cuadrantopsia bitemporal inferior. El diagnóstico más probable es:',
      'Lesión hipotalámica',
      'Tumor hipofisiario',
      'Climaterio',
      'Síndrome poliglandular',
      'Apoplejía hipofisiaria',
      'b',
      'Defecto bitemporal del campo visual = compresión del quiasma por tumor hipofisario. Sin cefalea aguda ni HTEC sería tumor de crecimiento lento, no apoplejía.',
      'medium'
    ),
    (
      'Una mujer de 25 años inicia oligomenorrea, con ciclos menstruales cada 2 a 3 meses, a lo que se le agregan acné. Se solicitan exámenes, que muestran elevación de la LH y del estradiol ¿Cuál es el diagnóstico más probable?',
      'Falla ovárica',
      'Insuficiencia hipofisiaria',
      'Falla hipotalámica',
      'Síndrome de ovario poliquístico',
      'Hiperprolactinemia',
      'd',
      'SOP: oligomenorrea + hiperandrogenismo (acné). En laboratorio suele elevarse testosterona, estradiol, LH e insulina; baja progesterona por anovulación.',
      'medium'
    ),
    (
      'Paciente de 57 años, cursando síndrome nefrótico, secundario a nefropatía membranosa. En sus exámenes destaca hipercolesterolemia, albúmina: 2,0 g/dl, creatinina: 1,1 mg/dl, Ca: 7,5 mg/dl, con sodio, potasio y cloro normales. La causa más probable de su hipocalcemia es:',
      'Hipercalciuria primaria',
      'Hipocalcemia por insuficiencia renal crónica',
      'Hipocalcemia ficticia',
      'Hipovitaminosis D',
      'Hipocalcemia por diuréticos',
      'c',
      'Calcio corregido = Calcio + 0,8 x (4 - albúmina) = 7,5 + 0,8 x 2 = 9,1. No hay hipocalcemia real; la albúmina baja falsea el valor. Calcio iónico no requiere corrección.',
      'medium'
    ),
    (
      'La asociación de bocio difuso, con soplo y síntomas de hipertiroidismo es característica de:',
      'Adenoma tóxico',
      'Tiroiditis de Quervain',
      'Tiroiditis de Riedel',
      'Enfermedad de Basedow Graves',
      'Tiroiditis de Hashimoto',
      'd',
      'EBG: hipertiroidismo + bocio difuso + soplo tiroideo. Adenoma tóxico: nodular, sin soplo. Quervain: difuso doloroso, sin soplo. Riedel y Hashimoto: hipotiroidismo.',
      'easy'
    ),
    (
      'Una paciente de 50 años, asintomático, se detecta un aumento de volumen cervical, ubicado en la línea media. Al examen físico se aprecia un nódulo supraesternal de 2 cm de diámetro, que asciende con la deglución. Se solicita una ecografía que demuestra un nódulo sólidoquístico de 21 mm de diámetro. La TSH resulta 6,3 UI/L. La conducta más adecuada es:',
      'Realizar punción con aguja fina del nódulo',
      'Administrar yodo radiactivo en dosis terapéutica',
      'Solicitar cintigrafía con yodo radiactivo',
      'Realizar tiroidectomía total',
      'Indicar una dosis baja de levotiroxina y observar evolución',
      'a',
      'Nódulo >10 mm: PAAF (TSH no suprimida). Cintigrafía solo si TSH suprimida (hipertiroidismo). Además manejar el hipotiroidismo. Quistes simples Ti-Rads 2 se pueden observar; Ti-Rads 5 puncionar siempre.',
      'medium'
    ),
    (
      '¿Qué examen es más adecuado para determinar el origen central o nefrogénico de una diabetes insípida?',
      'Osmolaridad urinaria basal y postprivación de agua',
      'Prueba de respuesta a desmopresina',
      'Sodio urinario de 24 horas',
      'Niveles plasmáticos de ADH',
      'TAC de silla turca',
      'b',
      'DI se diagnostica con test de la sed (orina diluida + hipernatremia). Clasificación central vs nefrogénica: test de desmopresina (respuesta = central; no respuesta = nefrogénica). ADH no se pide por errático.',
      'medium'
    ),
    (
      '¿Cuál de las siguientes alteraciones es MENOS probable en una mujer luego de la menupausia?',
      'Disminución de la densidad ósea',
      'Disminución de los niveles plasmáticos de estrógenos',
      'Disminución de los niveles plasmáticos de progesterona',
      'Disminución de los niveles plasmáticos de gonadotropinas',
      'Disminución de la masa muscular',
      'd',
      'Menopausia = hipogonadismo hipergonadotrópico (baja estrógeno y progesterona; FSH y LH elevadas). FSH >25 sugiere; >40 casi seguro. Las gonadotropinas aumentan, no disminuyen.',
      'medium'
    ),
    (
      'Una paciente de 33 años, esquizofrénica, presenta galactorrea. Refiere ausencia de menstruaciones desde hace 4 meses, por lo que se realiza un test de embarazo, que resulta negativo. El diagnóstico más probable es:',
      'Hipogonadismo hipogonadotrópico',
      'Prolactinoma hipofisiario',
      'Hipogonadismo hipergonadotrópico',
      'Síndrome de ovario poliquístico',
      'Hiperprolactinemia secundaria a fármacos',
      'e',
      'Síndrome galactorrea-amenorrea = hiperprolactinemia. Esquizofrénica en antipsicóticos (antidopaminérgicos) = causa frecuente. Siempre descartar embarazo primero.',
      'medium'
    ),
    (
      'Un paciente consulta por palpitaciones y diarrea. Al examen físico se constata retracción palpebral, temblor fino, piel húmeda y caliente, sin alteraciones a la palpación de la glándula tiroides. Se solicita TSH que resulta suprimida y T4 que está aumentada. Los anticuerpos anti-TPO y TRAB resultan negativos, la tiroglobulina plasmática es indetectable y la captación de yodo radiactivo muestra captación menor al 1%. El diagnóstico más probable es:',
      'Tiroiditis de Riedel',
      'Tiroiditis silente',
      'Tiroiditis de Quervain',
      'Struma Ovari',
      'Uso de tiroxina exógena',
      'e',
      'Hipertiroidismo con captación muy baja y tiroglobulina indetectable = consumo exógeno de T4 (única con Tg baja). Quervain tendría Tg elevada. Struma ovari: tumor ovárico.',
      'hard'
    ),
    (
      '¿En qué condición es preferible solicitar T4 libre en lugar de T4 corriente?',
      'Tiroiditis subaguda',
      'Tiroiditis de Hashimoto',
      'Hipotiroidismo congénito',
      'Embarazo',
      'Insuficiencia cardíaca',
      'd',
      'T4 total varía con TBG. Embarazo y ACO elevan TBG; hepatopatía, síndrome nefrótico, desnutrición y andrógenos la disminuyen. En esos casos usar T4 libre. Hoy suele pedirse T4 libre siempre.',
      'easy'
    ),
    (
      'Mujer de 38 años, puérpera hace 6 meses. Durante el parto presentó importante hemorragia, secundaria a inercia uterina. Desde el comienzo presentó agalactia, por lo que debió alimentar exclusivamente con fórmula a su hijo. A pesar de lo anterior, persiste en amenorrea y se ha agregado astenia y adinamia importante. El diagnóstico más probable es:',
      'Síndrome de Sheehan',
      'Apoplejía apofisiaria',
      'Tiroiditis postparto',
      'Hiperprolactinemia',
      'Hipogonadismo hipergonadotrófico',
      'a',
      'Sheehan: hipopituitarismo por infarto hipofisario tras hemorragia puerperal (hipófisis aumentada en embarazo, irrigación portal). Clínica: astenia, amenorrea, agalactia. RMN: silla turca vacía. Tratamiento: suplementación hormonal.',
      'medium'
    ),
    (
      'Un niño diagnosticado de hiperplasia suprarrenal congénita, en tratamiento, presenta un cuadro de malestar general marcado e hipotensión. Al examen se constata desorientado, taquicárdico, con signos de hipoperfusión periférica. La conducta más adecuada es:',
      'Administrar suero fisiológico endovenoso hasta normalizar la',
      'Administrar corticoides endovenosos y cristaloides',
      'Administrar suero hipertónico endovenoso',
      'Administrar cristaloides y noradrenalina endovenosa por bomba de infusión continua',
      'Administrar suero glucosado al 30% y adrenalina subcutánea',
      'b',
      'HSRC puede cursar con crisis suprarrenal. Ante hipotensión y malestar en niño con HSRC: corticoides ev + cristaloides (suero fisiológico) de inmediato.',
      'medium'
    )
  ) AS q(stem, a, b, c, d, e, correct, explanation, diff)
  WHERE s.code = 'endocrinologia'
  RETURNING id
),
exam_2_5 AS (
  SELECT id FROM exams WHERE title = '2.5 Cuestionario Endocrinología' LIMIT 1
)
INSERT INTO exam_questions (exam_id, question_id, order_index)
SELECT
  e.id,
  ins.id,
  ROW_NUMBER() OVER (ORDER BY ins.id) AS order_index
FROM inserted ins
CROSS JOIN exam_2_5 e;

-- Confirmar
SELECT COUNT(*) AS preguntas_2_5
FROM exam_questions
WHERE exam_id = (SELECT id FROM exams WHERE title = '2.5 Cuestionario Endocrinología' LIMIT 1);
