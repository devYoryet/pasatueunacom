-- ============================================================
-- SEED: 2.4 Cuestionario Endocrinología (14 preguntas)
-- Cap_1_OR_Jul_2026 — 2.4. Cuestionario Endocrinología
-- Requiere: schema.sql ya ejecutado, examen "2.4 Cuestionario Endocrinología" existente
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
      '¿Cuál de los siguientes casos clínicos es más sugerente de una enfermedad de Basedow-Graves?',
      'Mujer de 40 años con bocio difuso y exoftalmo, asociado a intolerancia al calor, nerviosismo y temblor',
      'Mujer de 65 años con bocio difuso de consistencia pétrea, asociado a astenia y elevación de la TSH',
      'Mujer de 40 años con bocio difuso, muy doloroso a la palpación, con temblor y disminución de la TSH',
      'Mujer de 30 años con bocio multinodular de gran tamaño, asociado a retracción palpebral, elevación de la T4 y disminución marcada de la TSH',
      'Mujer de 40 años con mixedema generalizado, bocio difuso y astenia',
      'a',
      'EBG: hipertiroidismo + bocio difuso + exoftalmo/orbitopatía (propia de EBG). Retracción palpebral y Graefe en cualquier hiperT4. B: Riedel. C: Quervain. D: bocio multinodular tóxico. E: hipotiroidismo/Hashimoto.',
      'medium'
    ),
    (
      'Un paciente de 70 años, que vive solo, es encontrado inconsciente en su casa. Al examen físico presenta FC: 45 x'', PA: 110/70 mmHg, t°: 34,0°C, facies edematosa y sopor profundo. No presenta focalidad neurológica, pero sus reflejos osteotendíneos están abolidos. En sus exámenes destaca anemia con hematocrito de 30%, plaquetas: 250.000, blancos: 5.000 por mm3, creatinina: 1,0 mg/dl, sodio: 130 mEq/L, potasio: 4,5 mEq/L y cloro: 98 mEq/L. El diagnóstico más probable es:',
      'Síndrome de secreción inadecuada de ADH',
      'Diabetes insípida',
      'Insuficiencia suprarrenal',
      'Enfermedad de Cushing',
      'Hipotiroidismo',
      'e',
      'Coma mixedematoso: bradicardia, hipotermia, arreflexia, anemia (a veces macrocítica), hiponatremia, mixedema. Tratamiento: T4 ev (+ T3 si disponible) y corticoides ev hasta descartar insuficiencia suprarrenal asociada.',
      'medium'
    ),
    (
      'Un paciente de 40 años consulta por aumento de volumen cervical, el que detectó hace cerca de un mes. Al examen físico se palpa un nódulo cervical de consistencia dura, ubicado en la línea media anterior, en la zona supraesternal, que asciende con la deglución, de cerca de 2 cm de diámetro. Se solicita TSH, la que resulta 3,8 UI/L. La conducta más adecuada es:',
      'Solicitar anticuerpos anti-TPO',
      'Solicitar ecografía cervical',
      'Solicitar TAC de cuello',
      'Solicitar niveles plasmáticos de tiroglobulina',
      'Solicitar niveles plasmáticos de calcitonina',
      'b',
      'Nódulo tiroideo: estudio inicial TSH + ecografía. Luego PAAF si >1 cm (Minsal) o según Tirrads. Si TSH baja: cintigrafía (hipercaptante = I131/cirugía; frío = PAAF).',
      'medium'
    ),
    (
      'Una paciente consulta por astenia. Trae un perfil bioquímico, en el que destaca una calcemia de 13,4 mg/dl, con fosfemia de 6,0 mg/dl, albuminemia de 3,0 g/dl. Se solicitan niveles plasmáticos de PTH, los que resultan bajos. El diagnóstico más probable es:',
      'Hipercalcemia ficticia',
      'Hipercalcemia maligna',
      'Hipervitaminosis D',
      'Hiperparatiroidismo secundario',
      'Hiperparatiroidismo primario',
      'b',
      'Hipercalcemia; corregida por albúmina sigue alta (14,2). PTH baja + hiperfosfemia = hipercalcemia maligna. Hiperparatiroidismo primario: PTH alta, fosfemia baja. Hipervitaminosis D menos frecuente.',
      'medium'
    ),
    (
      'Un paciente presenta un síndrome de Cushing. No utiliza ningún medicamento ni tiene antecedentes médicos de importancia. La conducta más adecuada es:',
      'Solicitar niveles plasmáticos de ACTH',
      'Solicitar cortisol plasmático basal',
      'Solicitar prueba de supresión corta con dexametasona',
      'Solicitar prueba de estimulación con ADH',
      'Solicitar ACTH urinaria',
      'c',
      'Inicio del estudio de Cushing: cortisol libre 24h, cortisol salival nocturno o supresión corta con dexametasona (Nugent). Se confirma con 2 alterados o 1 muy alterado. Luego ACTH y supresión larga para localización; después imagen suprarrenal o hipofisaria.',
      'medium'
    ),
    (
      'Una paciente de 50 años consulta por aumento de volumen de la glándula tiroides. Al examen físico se palpa un bocio difuso de tamaño moderado. Se solicita TSH que resulta 8,4 UI/L. ¿Cuál es el diagnóstico más probable?',
      'Tiroiditis de Hashimoto',
      'Tiroiditis de Quervain',
      'Tiroiditis de Riedel',
      'Enfermedad de Basedow Graves',
      'Cáncer de tiroides',
      'a',
      'Bocio difuso + hipotiroidismo = tiroiditis crónica de Hashimoto (causa más frecuente de bocio e hipotiroidismo). Pedir T4 libre y anti-TPO. Quervain: bocio doloroso + hiperT4. Riedel: bocio leñoso. EBG: hiperT4. Cáncer: nodular.',
      'medium'
    ),
    (
      'Una mujer de 30 años se realiza una radiografía de tórax, en contexto del estudio de un cuadro de dolor torácico, objetivándose una fractura del cuerpo vertebral, asociada a signos radiológicos de osteopenia, por lo que se decide solicitar una densitometría ósea que muestra un T-score de –3,0 y un Z-score de –2,4. El diagnóstico más probable es:',
      'Sana',
      'Osteopetrosis',
      'Osteopenia',
      'Osteoporosis primaria',
      'Osteoporosis secundaria',
      'e',
      'T-score ≤ -2,5 = osteoporosis. Z-score ≤ -2 = causa secundaria. Edad 30 años también orienta a secundaria. Fractura vertebral por fragilidad ya es diagnóstica de osteoporosis. Estudiar causa (PTH, calciuria, celiaquía, Cushing). En severa considerar anabólicos (teriparatida, romosozumab) o denosumab.',
      'medium'
    ),
    (
      'Una paciente lúpica, suspende sus medicamentos de manera brusca, evolucionando con marcado malestar, náuseas y ortostatismo. Al examen físico presenta taquicardia e hipotensión arterial. En la atención de urgencia, esta paciente debe recibir',
      'Corticoides endovenosos y suero fisiológico',
      'Suero glucosado endovenoso',
      'Desmopresina en spray nasal',
      'Insulina endovenosa',
      'Suero hipertónico endovenoso',
      'a',
      'Insuficiencia suprarrenal aguda por suspensión brusca de corticoides. Ante la sospecha: corticoides ev + cristaloides (suero fisiológico).',
      'medium'
    ),
    (
      'Un paciente con antecedente de cáncer de pulmón presenta, entre sus exámenes, una natremia de 129 mEq/L. No presenta síntomas y se ve de buen aspecto. La conducta más adecuada para el manejo de su alteración hidroelectrolítica es:',
      'Indicar un diurético tizídico',
      'Indicar un diurético de asa',
      'Restringir la ingesta de agua',
      'Aumentar la ingesta de sodio',
      'Administrar suero fisiológico endovenoso',
      'c',
      'SSIADH en contexto de cáncer pulmón. Hiponatremia asintomática >120 mEq/L en SSIADH (o con edema, IRC): restricción de agua <800 cc/día.',
      'medium'
    ),
    (
      '¿Cuál de las siguientes es una alteración más probable en un paciente con un macroadenoma no funcionante de hipófisis?',
      'Amaurosis',
      'Miosis',
      'Estrabismo convergente',
      'Hemianopsia homónima',
      'Hemianopsia heterónima bitemporal',
      'e',
      'Tumores hipofisarios comprimen el quiasma óptico → defectos bitemporales del campo (hemianopsia o cuadrantopsia bitemporal). Amaurosis: nervio óptico. Miosis: Horner. Homónima: cintilla/radiación óptica/occipital contralateral.',
      'medium'
    ),
    (
      'Una mujer de 29 años presenta amenorrea, con disminución del estradiol plasmático y aumento marcado de la FSH y LH. El diagnóstico más probable es:',
      'Alteración hipotalámica',
      'Hiperprolactinemia',
      'Anovulación crónica',
      'Falla ovárica prematura',
      'Síndrome de ovario poliquístico',
      'd',
      'Hipogonadismo hipergonadotrópico (FSH y LH altas) = origen ovárico. Menor de 40 años = falla ovárica prematura (menopausia precoz). Hipotalámico/hipofisiario = hipogonadotrópico.',
      'medium'
    ),
    (
      'Un paciente de 60 años se realiza una TSH como screening, la que resulta 7,5 UI/L. Está asintomático, su examen físico es normal y no presenta otras patologías conocidas. La conducta más adecuada es:',
      'Solicitar T4 libre y decidir conducta según resultado',
      'Solicitar T3 libre y decidir conducta según resultado',
      'Observar evolución, sin necesidad de tratamiento, ni control',
      'Iniciar levotiroxina',
      'Solicitar cintigrafía con yodo radiactivo',
      'a',
      'TSH elevada: confirmar con T4 libre (y repetir TSH). T4 libre normal = hipotiroidismo subclínico (observar si TSH <10). T4 libre baja = hipotiroidismo clínico → levotiroxina. Opcional anti-TPO. No T3, TRH ni tiroglobulina.',
      'medium'
    ),
    (
      'Un paciente psiquiátrico presenta un cuadro de polidipsia y poliuria, que ha ido en aumento, orinando cerca de 6 litros al día. Se solicita glicemia de ayuno que resulta 80 mg/dl. Su natremia basal es 140, con osmolaridad plasmática de 287 mOsm/L y osmolaridad urinaria: 170 mOsm/L. Se repiten los exámenes luego de varias horas sin ingerir agua y se constata natremia de 149 mEq/L, osmolaridad plasmática de 310 mOsm/L y osmolaridad urinaria de 180 mOsm/L. El diagnóstico más probable es:',
      'Diabetes insípida',
      'SSIADH',
      'Polidipsia psicógena',
      'Ingesta crónica de hidroclorotiazida',
      'Ingesta crónica de furosemida',
      'a',
      'Test de la sed: aparece hipernatremia con privación de agua y la orina se mantiene diluida (osm urinaria baja) = diabetes insípida. Antecedente psiquiátrico/litio puede causar DI. Polidipsia primaria no daría orina diluida tras privación.',
      'hard'
    ),
    (
      'Una paciente de 2 años, con antecedente de síndrome bronquial recurrente severo, en tratamiento con salbutamol y fluticasona inhalados y prednisona oral, con buena respuesta, es llevada a control médico, objetivándose leve sobrepeso y talla en percentil 8 para la edad, sin otras alteraciones. Se solicitan exámenes, entre los que destaca cortisol plasmático 0,1 ug/dL (valor normal: 4 a 22 ug/dl). ¿Cuál es el diagnóstico más probable?',
      'Hipocortisolismo farmacológico',
      'Enfermedad de Addison',
      'Hiperplasia suprarrenal congénita',
      'Enfermedad de Cushing',
      'Fibrosis quística',
      'a',
      'Prednisona (y otros corticoides sistémicos) suprime el eje hipotálamo-hipófisis-suprarrenal; es esperable cortisol y ACTH suprimidos. Al suspender, hacerlo de forma progresiva.',
      'medium'
    )
  ) AS q(stem, a, b, c, d, e, correct, explanation, diff)
  WHERE s.code = 'endocrinologia'
  RETURNING id
),
exam_2_4 AS (
  SELECT id FROM exams WHERE title = '2.4 Cuestionario Endocrinología' LIMIT 1
)
INSERT INTO exam_questions (exam_id, question_id, order_index)
SELECT
  e.id,
  ins.id,
  ROW_NUMBER() OVER (ORDER BY ins.id) AS order_index
FROM inserted ins
CROSS JOIN exam_2_4 e;

-- Confirmar
SELECT COUNT(*) AS preguntas_2_4
FROM exam_questions
WHERE exam_id = (SELECT id FROM exams WHERE title = '2.4 Cuestionario Endocrinología' LIMIT 1);
