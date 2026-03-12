-- ============================================================
-- SEED: 2.2 Cuestionario Endocrinología (20 preguntas)
-- Cap_1_OR_Jul_2026 — 2.2. Cuestionario Endocrinología
-- Requiere: schema.sql ya ejecutado, examen "2.2 Cuestionario Endocrinología" existente
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
      'Una paciente de 34 años hipotiroidea, en tratamiento con 100 ug al día de levotiroxina, se embaraza. Usted la controla al tercer mes de embarazo y trae una TSH de 3,5 UI/L. La conducta más adecuada es:',
      'Mantener indicaciones',
      'Aumentar la dosis de levotiroxina',
      'Solicitar T4 y T3 libres',
      'Disminuir la dosis de levotiroxina',
      'Reemplazar la levotiroxina por levotriyodotironina',
      'b',
      'En embarazo el objetivo de TSH es 0,4-2,5 UI/L. Subir dosis (ej. 125 ug/día) y controlar TSH en 4 semanas. Previo al embarazo intentar TSH 0,4-2,5; si ya embarazada sin ajuste previo, subir ~30%.',
      'medium'
    ),
    (
      'Una paciente de 43 años sufre un accidente de tránsito, con golpe en la cabeza. Evoluciona con poliuria y polidipsia. Se solicitan una glicemia, que resulta normal. ¿Cuál es la conducta más adecuada?',
      'Iniciar una tiazida',
      'Indicar restricción de agua libre a 800 cc al día',
      'Solicitar niveles plasmáticos de ADH',
      'Solicitar osmolaridades plasmática y urinaria',
      'Iniciar tratamiento con furosemida',
      'd',
      'Sospecha de diabetes insípida central (lesión hipofisiaria). Diagnóstico: sodio y osmolaridades plasmática y urinaria (basales y post-privación de agua). Si hipernatremia basal, se confirma sin privar. Tratamiento: desmopresina intranasal.',
      'medium'
    ),
    (
      'Una paciente de 30 años consulta por malestar general y síncopes, por hipotensión ortostática. Al examen físico está muy decaída, con FC: 130x'', regular, PA: 70/30 mmHg, mucosas con hiperpigmentación de lengua y cara interna de las mejillas. Se solicitan exámenes, que muestran hiponatremia, hiperkalemia y glicemia de 60 mg/dl. La conducta más adecuada es:',
      'Administrar suero fisiológico e iniciar noradrenalina endovenosa',
      'Administrar alfabloqueantes y luego betabloqueantes',
      'Solicitar test de supresión con dexametasona',
      'Administrar suero fisiológico e hidrocortisona por vía endovenosa',
      'Administrar suero fisiológico y solicitar resonancia magnética de silla turca',
      'd',
      'Crisis suprarrenal (hiperpigmentación = Addison). Ante la sospecha indicar corticoides ev (hidrocortisona) más SF. Opcional cortisol basal antes de hidrocortisona. En agudo tratar sin esperar confirmación.',
      'medium'
    ),
    (
      '¿Qué patología se asocia al cáncer medular de tiroides y debe ser descartada antes de tratarlo?',
      'Hipoparatiroidismo',
      'Feocromocitoma',
      'Enfermedad de Addison',
      'Enfermedad de Cushing',
      'Acromegalia',
      'b',
      'CMT se asocia a NEM2 (hiperparatiroidismo primario y feocromocitoma). El feocromocitoma debe descartarse antes de cirugía (metanefrinas/catecolaminas en orina; si elevadas, RMN/TAC suprarrenales). Prevención: alfabloqueantes, luego betabloqueantes, luego cirugía.',
      'medium'
    ),
    (
      'Una paciente de 18 años presenta astenia, sensación de calor y diarrea, desde hace algunas semanas. Además, ha sentido molestias en los ojos. Al examen físico se constata FC: 110x'', PA: 120/80, piel fina y húmeda. Se palpa un bocio difuso de tamaño moderado y se constata una ligera proptosis izquierda. El diagnóstico es:',
      'Enfermedad de Basedow Graves',
      'Tiroiditis de Quervein',
      'Cáncer de tiroides',
      'Tiroiditis de Hashimoto',
      'Tiroiditis de Riedel',
      'a',
      'Hipertiroidismo + bocio difuso + exoftalmo = enfermedad de Basedow Graves (clínico). TRAB confirman. Cintigrafía solo si TRAB negativos. Orbitopatía solo en EBG.',
      'medium'
    ),
    (
      'Un paciente de 60 años presenta astenia y debilidad muscular. Al examen físico se aprecia atrofia de la musculatura de las 4 extremidades, asociado a estrías abdominales y "cara de luna". Además, se solicitan exámenes generales, entre los que destaca glicemia de ayuno de 180 mg/dl. La conducta más adecuada es:',
      'Solicitar cortisol libre urinario de 24 horas',
      'Solicitar niveles plasmáticos de ACTH',
      'Solicitar test de tolerancia a la glucosa',
      'Solicitar radiografía de tórax',
      'Administrar cortisol',
      'a',
      'Síndrome de Cushing. Inicio del estudio: cortisol libre urinario 24h, cortisol salival nocturno o prueba de supresión corta (Nugent). Luego ACTH para localización; si duda, supresión larga. RMN hipófisis o TAC/RMN suprarrenales según causa.',
      'medium'
    ),
    (
      'Una paciente presenta dolor en el cuello, asociado a palpitaciones y temblor. Al examen físico se aprecia aumento de volumen tiroideo, que es muy doloroso al presionarlo con los dedos. El diagnóstico más probable es:',
      'Cáncer anaplásico',
      'Tiroiditis aguda',
      'Tiroiditis subaguda',
      'Enfermedad de Basedow Graves',
      'Quiste folicular roto',
      'c',
      'Tiroiditis subaguda de Quervain: bocio doloroso, fase hipertiroidea inicial. Tratamiento: AINEs; si muy hipertiroideo, betabloqueo. Captación de yodo disminuida si hay duda. Anti-TPO para pronóstico (riesgo de Hashimoto).',
      'medium'
    ),
    (
      'Un paciente de 35 años presenta un nódulo tiroideo, que se moviliza con la deglución. Se solicita una TSH, que resulta 4,0 UI/L y una ecografía cervical, que lo demuestra de aspecto sólido-quístico y de 2 cm x 1 cm de diámetro. La conducta más adecuada es:',
      'Iniciar levotiroxina',
      'Solicitar tiroglobulina',
      'Solicitar calcitonina',
      'Solicitar biopsia por punción con aguja fina',
      'Solicitar cintigrafía con yodo radiactivo',
      'd',
      'Estudio del nódulo: TSH + ecografía, luego PAAF si >10 mm (sólido-quístico suele ser TR3/TR4). Cintigrafía solo si hipertiroidismo.',
      'medium'
    ),
    (
      'Un paciente de 45 años consulta por impotencia. Refiere que ha disminuido su deseo sexual y que además se ha sentido más débil de lo habitual. Se solicitan exámenes, que demuestran disminución de la testosterona plasmática, por lo que se solicita LH, que resulta muy alta. ¿Cuál de las siguientes opciones es compatible con este cuadro?',
      'Lesión hipotalámica',
      'Tumor hipofisiario productor de LH',
      'Hiperprolactinemia',
      'Sección del tallo hipofisiario',
      'Daño testicular',
      'e',
      'Hipogonadismo hipergonadotrópico (testosterona baja, LH alta) = origen gonadal (trauma, orquitis, Klinefelter). Hipogonadismo hipogonadotrópico (LH baja) = hipotalámico/hipofisiario.',
      'medium'
    ),
    (
      'Una mujer de 45 años inicia oligomenorrea, con ciclos menstruales cada 2 a 3 meses, a lo que se le agregan bochornos. ¿Cuál de las siguientes opciones es la más adecuada para iniciar terapia de reemplazo hormonal?',
      'Estrógenos solos',
      'Progestágenos solos',
      'Estrógenos más progestágenos',
      'Raloxifeno',
      'Agonistas de la GnRH',
      'c',
      'TRH para síntomas vasomotores. Con útero: estrógenos + progestágenos. Solo si histerectomizada: estrógeno solo. Duración habitual 5 años. Contraindicada en cáncer de mama/endometrio, eventos CV/TVP-TEP.',
      'medium'
    ),
    (
      'Paciente de 56 años es traído al servicio de urgencias por cefalea intensa, vómitos y visión doble que se iniciaron hace 40 minutos. Al examen destaca estrabismo divergente y hemianopsia heterónima bitemporal. El diagnóstico más probable es:',
      'Apoplejía hipofisiaria',
      'Síndrome de Sheehan',
      'Síndrome de sección del tallo hipofisiario',
      'Síndrome de silla turca vacía',
      'Síndrome de compresión de tallo hipofisiario',
      'a',
      'Apoplejía hipofisiaria: cefalea súbita, hemianopsia bitemporal, puede evolucionar con HTEC. Por infarto/hemorragia de tumor hipofisario. Tratamiento: descompresión quirúrgica transesfenoidal + cortisol en agudo (hipopituitarismo súbito).',
      'medium'
    ),
    (
      'Un paciente de 60 años es diagnosticado de hipotiroidismo por una tiroiditis de Hashimoto por lo que se inicia tratamiento con levotiroxina 50 ug al día. Además de la evolución clínica, ¿Qué examen o exámenes es/son más adecuado(s) para controlar a este paciente?',
      'Niveles plasmáticos de hormona tiroestimulante',
      'Niveles plasmáticos de tiroxina',
      'Niveles plasmáticos de tiroxina libre',
      'Niveles plasmáticos de tiroglobulina',
      'Niveles plasmáticos de anticuerpos anti-peroxidasa tiroidea',
      'a',
      'Hipotiroidismo e hipertiroidismo se ajustan con TSH (objetivo 0,4-4,0; algunos 1-3). Excepciones: geriátrico TSH 3-6; embarazo TSH 0,4-2,5. En patología hipofisaria se ajusta por T4/T4 libre.',
      'easy'
    ),
    (
      'En una paciente con síndrome de Sheehan, la prueba de progesterona y la prueba de estrógeno + progesterona, serán respectivamente:',
      'Positiva y positiva',
      'Positiva y negativa',
      'Negativa y positiva',
      'Negativa y negativa',
      'Positiva y no interpretable',
      'c',
      'Sheehan = infarto hipofisario → hipogonadismo hipogonadotrópico. Prueba de progesterona sola: negativa (positiva solo en anovulación). Prueba E+P: positiva en hipogonadismo (ovárico o hipofisiario), negativa en problemas uterinos (Asherman).',
      'medium'
    ),
    (
      'Un paciente presenta hipercalcemia e hipofosfemia, asociadas a litiasis renal y osteoporosis. El diagnóstico más probable es:',
      'Insuficiencia renal crónica',
      'Hiperparatiroidismo primario',
      'Hipercalciuria primaria',
      'Hipercalcemia maligna',
      'Hipervitaminosis D',
      'b',
      'Hiperparatiroidismo primario: PTH elevada → hipercalcemia, hipofosfemia, osteoporosis, hipercalciuria (litiasis, nefrocalcinosis). IRC da hipocalcemia e hiperfosfemia. Hipercalcemia maligna suele dar fósforo elevado.',
      'medium'
    ),
    (
      'Un paciente de 26 años, con hipertensión arterial, se realiza exámenes generales, en los que destaca hipokalemia, por lo que se solicita índice de aldosterona/ARP, el que resulta 60 (VN: menor a 25). El tratamiento de la patología descrita es:',
      'Cirugía vascular de arterias renales',
      'Inhibidores de la enzima convertidora de angiotensiana',
      'Tiazidas',
      'Propanolol',
      'Espironolactona',
      'e',
      'Hiperaldosteronismo primario (índice aldosterona/renina >20-30). Tratamiento: antagonistas del receptor de aldosterona (espironolactona o eplerenona). Hiperplasia bilateral: médico. Adenoma unilateral: cirugía (adrenalectomía laparoscópica).',
      'medium'
    ),
    (
      'Una niña de 7 años presenta olor axilar adulto desde hace algunos días. Se puede afirmar que:',
      'Ha iniciado su pubertad de manera precoz',
      'Ha iniciado su pubertad normalmente',
      'Probablemente presentará talla baja',
      'Se debe descartar una hiperplasia suprarrenal congénita',
      'Es una variante normal del desarrollo',
      'e',
      'Olor axilar = adrenarquia (activación suprarrenal), no signo puberal. Pubertad: telarquia (niñas), orquidarquia (niños). Adrenarquia temprana puede ser normal; pubertad precoz sí riesgo de talla baja. Estudiar con edad ósea si hay duda.',
      'medium'
    ),
    (
      'Hombre de 50 años, fumador de 50 paquetes años, con antecedente de disnea de 3 meses de evolución, asociada a tos, sin estudio, acude a urgencias por deterioro progresivo de sus funciones cognitivas, incluyendo desorientación y sopor. No tiene antecedentes de trauma. La exploración física no muestra otras alteraciones. Sus exámenes de laboratorio muestran: Na+ plasmático 118 mEq/l, osmolalidad plasmática 240 mOsm/kg, glicemia 90 mg/dl, urea 22 mg/dl. Osmolalidad urinaria: 290 mOsm/kg, Na+ urinario: 35 mEq/l. ¿Cuál de los siguientes cuadros es el más probable?',
      'Insuficiencia suprarrenal crónica.',
      'Diabetes insípida central.',
      'Polidipsia compulsiva.',
      'Síndrome de secreción inadecuado de hormona antidiurética (SSIADH).',
      'Reajuste del osmostato.',
      'd',
      'SSIADH: hiponatremia + patología pulmonar/SNC. Osmolaridad urinaria >200 (orina concentrada para la natremia). Corregir sodio con límite ~8 mEq/L/día para evitar mielinolisis pontina.',
      'medium'
    ),
    (
      '¿En qué condición es preferible solicitar T4 libre en lugar de T4 corriente?',
      'Tiroiditis subaguda',
      'Tiroiditis de hashimoto',
      'Hipotiroidismo congénito',
      'Uso de anticonceptivos orales',
      'Insuficiencia cardíaca',
      'd',
      'T4 total varía con TBG. ACO y embarazo elevan TBG; hepatopatía, síndrome nefrótico, anabólicos la disminuyen. En esos casos usar T4 libre. Hoy la T4 libre suele usarse siempre por ser barata y disponible.',
      'easy'
    ),
    (
      'La hiperprolactinemia en hombres se manifiesta frecuentemente como:',
      'Ginecomastia aislada',
      'Galactorrea aislada',
      'Impotencia sexual y disminución de la libido',
      'Astenia y vómitos',
      'Ginecomastia y galactorrea',
      'c',
      'Hiperprolactinemia en hombres produce hipogonadismo hipogonadotrópico: clínica de hipogonadismo (impotencia, disminución de libido). No suele dar ginecomastia ni galactorrea (mama requiere estrogenización).',
      'medium'
    ),
    (
      'Hombre de 22 años, consulta por infertilidad. Al examen físico destacan testículos de tamaño pequeño. La testosterona plasmática está disminuida y la FSH aumentada. El espermiograma demuestra azoospermia. El diagnóstico más probable es:',
      'Síndrome de Klinefelter',
      'Disgenesia gonadal primaria',
      'Hipopituitarismo',
      'Hipogonadismo hipogonadotrópico',
      'Orquitis atrófica idiopática',
      'a',
      'Klinefelter: hipogonadismo hipergonadotrópico, testículos pequeños, azoospermia. Cariograma 47XXY. Tratamiento: testosterona. Infertilidad: adopción, donante o técnicas de fertilización asistida si se obtienen espermatozoides.',
      'medium'
    )
  ) AS q(stem, a, b, c, d, e, correct, explanation, diff)
  WHERE s.code = 'endocrinologia'
  RETURNING id
),
exam_2_2 AS (
  SELECT id FROM exams WHERE title = '2.2 Cuestionario Endocrinología' LIMIT 1
)
INSERT INTO exam_questions (exam_id, question_id, order_index)
SELECT
  e.id,
  ins.id,
  ROW_NUMBER() OVER (ORDER BY ins.id) AS order_index
FROM inserted ins
CROSS JOIN exam_2_2 e;

-- Confirmar
SELECT COUNT(*) AS preguntas_2_2
FROM exam_questions
WHERE exam_id = (SELECT id FROM exams WHERE title = '2.2 Cuestionario Endocrinología' LIMIT 1);
