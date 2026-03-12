-- ================================================
-- Migration 002: Seed Lessons — Diabetes (24 cápsulas)
-- Generated: 2026-03-12T19:35:28.782Z
-- Run in Supabase SQL editor AFTER schema.sql + 001_course_editions_and_lessons.sql
-- ================================================

-- Ensure unique constraint exists so ON CONFLICT works
ALTER TABLE lessons
  ADD CONSTRAINT IF NOT EXISTS lessons_specialty_order_unique
  UNIQUE (specialty_id, order_index);

-- Get specialty ID for diabetes
DO $$
DECLARE
  v_specialty_id INTEGER;
BEGIN
  SELECT id INTO v_specialty_id FROM specialties WHERE code = 'diabetes';
  IF v_specialty_id IS NULL THEN
    RAISE EXCEPTION 'Specialty "diabetes" not found. Run schema.sql first.';
  END IF;

  -- Insert / update 24 lessons for Diabetes
  -- ON CONFLICT: updates all AI fields if lesson already exists

  -- Cápsula 1: Clasificación y Diferenciación de los Tipos de Diabetes Mellitus
  INSERT INTO lessons (
    specialty_id, title, order_index, duration_seconds,
    txt_content, srt_content,
    ai_summary, ai_key_concepts, ai_mnemonics,
    ai_high_yield, ai_algorithms, ai_review_qs,
    ai_processed_at, is_available, is_free_preview
  ) VALUES (
    v_specialty_id,
    'Clasificación y Diferenciación de los Tipos de Diabetes Mellitus',
    1,
    592,
    'Hola, hola, vamos a empezar con este tema tan importante de diabetes. Vamos a ver los tipos de

diabetes y me refiero a los tipos de diabetes mellitus dado que la diabetes insípida se va

a ver en endocrinología en una clase totalmente diferente. Recordemos que uno de los tipos más

frecuentes que es solamente el 10% de las diabetes es la diabetes mellitus tipo 1.

Esta acuérdense que es autoinmune y que habitualmente afecta a los niños. Segundo

lugar está la diabetes mellitus tipo 2 que acuérdense que es causada por resistencia a

la insulina y que es la más frecuente en adultos. La obesidad tiene un rol bastante

importante en la fisiopatología de esta enfermedad en el sentido en que aumenta la resistencia a

la insulina y hace que finalmente se exprese esta diabetes. Aparte, hay otros tipos de

diabetes un poco más raros como la diabetes LADA que es la diabetes autoinmune latente de

los adultos que es igual a una diabetes 1 pero que aparece en una edad más tardía y

habitualmente es un poquito menos agresiva que la tipo 1 pero bastante más agresiva que la

tipo 2 y que es la clásica autoinmune de los adultos. Repito, igual a la tipo 1 pero en

adulto. Aparte de eso está la diabetes tipo MoDi que son unas diabetes genéticas habitualmente

se diagnostican antes de los 25 años siempre y cuando la persona se haga exámenes obviamente

de lo contrario se va a diagnosticar más tarde y que es característicamente autosómica dominante

y acuérdense que todas las enfermedades autosómicas dominantes afectan habitualmente

a todas las generaciones o sea lo más probable es que va a haber hermanos con diabetes, alguno

de los padres o de los tíos con diabetes etcétera. Aparte de esto están las diabetes del

embarazo por un lado la diabetes Melitus gestacional que la vamos a ver en detalle

más adelante que acuérdense que en el embarazo aumentan las hormonas de contrarregulación

y dentro de esas hormonas que son son muchas una de ellas es el lactógeno placentario y

todo este conjunto de hormonas de contrarregulación y en este caso específico el lactógeno

placentario generan una resistencia a la insulina que gatilla esta diabetes gestacional

o diabetes del embarazo. Aparte de esto tengo la diabetes pregestacional que se ve la misma

clase que la diabetes gestacional pero es aquella que se diagnosticó antes del embarazo

o bien que se diagnostica en las primeras 12 semanas del embarazo cumpliendo los criterios

de diabetes en alguien no embarazado. Repito esto lo vamos a ver con más detalles y que ahí

va a quedar un poco más claro y aparte de esas que son las más importantes las que hay

que saber con mayor detalle hay otras causas de diabetes como ejemplo fármaco dentro de eso

los corticoides acuérdense que el cortisol y los corticoides también son hormonas de

contrarregulación aparte de esto las cosas que dañan el páncreas la insulina se secreta

en los islotes del angerhans en las células beta de los islotes del angerhans del páncreas

así que una cirugía pancreática ejemplo una pancreatectomía un cáncer de páncreas

o bien incluso una pancreatitis que destruye el páncreas pueden generar una diabetes ya

sea transitoria en el caso de la pancreatitis o ya sea permanente en el sentido que si que el

daño es muy muy grande puede quedar con diabetes después también. Finalmente están las diabetes

de causa endocrina y todas las enfermedades endocrinas que aumenten las hormonas de

contrarregulación pueden desencadenar una diabetes también ejemplo la enfermedad de

Cushing y todos los síndromes de Cushing el hipertiroidismo lacromegalia etcétera ahora

cómo se diferencian cómo se hace una diabetes tipo 1 una diabetes tipo 2 por ejemplo

y la verdad es que se hace con la clínica no se hace con un examen en particular sino que con

la clínica y dentro de los parámetros a evaluar la edad es muy importante si es muy

joven diabetes 1 si es en cambio un adulto lo más probable que sea diabetes 2 el peso

acuérdense que la obesidad es habitualmente el desencadenante de la diabetes 2 o de la

expresión de los genes de predisposición a la diabetes en la diabetes 2 la severidad

mientras más severo más yo pienso en una diabetes autoinmune y la respuesta que tenga a

los hipoglicemiantes orales recordando que los hipoglicemiantes son la base del

tratamiento de la diabetes tipo 2 en cambio no sirven las diabetes autoinmune como en la

alada o en la tipo 1 si es muy severo si se instala muy rápido con mucha hiperglicemia

o con mucho daño órgano blanco así rápido o bien si es que debuta como una cetoacidosis

diabética o tiende a complicarse con cetoacidosis en ese caso lo más probable

es que sea de tipo autoinmune si es un niño va a ser una diabetes 1 si es que es un

adulto va a ser una diabetes lada segundo lugar si es que tiene muchos antecedentes

familiares eso puede ser de cualquiera de hecho los antecedentes familiares sugieren

más una tipo 2 pero si los familiares son flacos o sea no tienen obesidad uno dice esto

ya no es una diabetes 2 y si además son jóvenes y están todos con diabetes lo más

probable es que sea una de estas diabetes genéticas esta diabetes tipo modi que es

por resistencia a la insulina pero de índole genética ahora si es que tiene antecedentes

de otras enfermedades autoinmunes como hipotiroidismo o un vitíligo o alguna

cosa así y no responde a los hipoglicemiantes orales obviamente se sospecha una diabetes

lada que es de causa autoinmune y que al igual que la diabetes 1 no responde

a los hipoglicemiantes ahora si bien la clínica es lo más importante si existen

algunos exámenes que me pueden ayudar a complementar esta diferenciación dentro

de eso está el peptido c que lo vamos a ver que sirve también en las hipoglicemias pero

me sirve cuando yo tengo alguna duda respecto al tipo de diabetes en el sentido en que

refleja muy bien la insulina endógena los niveles plasmáticos de insulina son muy

erráticos sube rápido baja rápido en cambio el peptido c es más estable así que si

que está elevado quiere decir que hay una hipersecreción de insulina en el cuerpo del

paciente si es que está bajo en cambio lo más probable es que falta insulina por lo tanto va

a estar elevado en la diabetes tipo 2 en que como hay una resistencia a la insulina se eleva

la insulina y por lo tanto aumenta el peptido c y obviamente en todas las que se asocen a

resistencia a la insulina como la diabetes modi las por fármacos etcétera en cambio va a

estar disminuido en las diabetes tipo 1 la diabetes lada porque obviamente ahí se destruye

el páncreas endocrino que es el que produce la insulina y en las causas pancreáticas también

obviamente porque hay una hiposecreción de insulina aparte de eso yo puedo complementar

con anticuerpos existen distintos anticuerpos que al estar positivo me dicen hay una diabetes

de tipo autoinmunes los anticuerpos más importantes son los antigad los anti insulina

los anti IA2 que son los que tienen relación con la tirocinasa fosfato tipo 2 da lo mismo

el nombre pero sepan que que los T2 son los característicos o puede ser IA2 también

con las dos nomenclaturas y finalmente la del transportador de sin tipo 8 ahora insisto

no hay por qué saberlos todos basta con que sepan que hay anticuerpos que si es que están

positivos eso orienta muy fortemente una diabetes lada así que cuando se sospecha en

un adulto uno de los exámenes que hay que ir a pedir es el peptidose que la diabetes

lada va a estar bajo más los anticuerpos que van a estar positivos ahora finalmente

cuando yo sospecho una diabetes tipo modi la verdad es que existen exámenes genéticos

que dirigidamente van a buscar las mutaciones más frecuentes y eventualmente puedo confirmar

el diagnóstico de una diabetes modi y una vez que confirmo en un paciente esta alteración

genética lo más probable es que se estudie al resto de la familia que venga con hiperglicemia

también vamos a ver algunos casos como para ver si esto quedó claro en sentido en que las

preguntas de las pruebas habitualmente vienen con un caso clínico y el primero me dice 8

años hasta ello digo tiene lo más probable una diabetes tipo 1 que tiene baja de peso

polidipsia o sea tiene síntomas de diabetes que en la diabetes 1 suele ser más agresiva y

es más frecuente que haya síntomas más una licemia que está en 350 en este caso tiene el

diagnóstico de diabetes por cumplir con el criterio de síntomas más una licemia ya sea

de 1 o no mayor o igual a 200 así que hay una diabetes a los 8 años y una diabetes severa

sin ninguna duda es una diabetes mellitus tipo 1 el segundo caso me dice 45 años o sea ya

hasta ahí parece una diabetes tipo 2 que tiene un imc de 30 o sea está con obesidad hasta

ahí diabetes tipo 2 también la madre diabética acuérdense que si bien la modi en la que por

definición es genética la tipo 2 también tiene un componente genético muy muy importante

solo que no es solamente un gen sino que son múltiples genes que tienden a la resistencia

a la insulina y está con una licemia de 1 que está arriba de 126 así que si yo la repito

y me vuelve a dar 150 hago el diagnóstico de diabetes en este caso lo más probable es

que hay una diabetes tipo 2 en el caso que sigue 20 años una persona joven hipotiroidea

o sea viene con el antecedente de una enfermedad autoinmune acuérdense que el hipotiroidismo

habitualmente es por la tiroiditis de Hashimoto que es autoinmune tiene un imc de 23 o sea

normo peso una licemeda de ayuno en 300 demasiado alta uno dice alguien joven con

antecedente de autoinmunidad sin sobrepeso y con una licemia que está demasiado alta lo

más probable que sea una diabetes mellitus de tipo lada está autoinmune así que recordemos

número uno hay que pedirle los anticuerpos para confirmar y número dos una vez que

lo haya confirmado y mientras está en estudio la voy a manejar con insulina no con hipoglicemiantes

orales y la última también tiene 20 años tiene un imc de 23 o sea hasta ahí es alguien

joven normo peso una liceme',
    '1
00:00:03,380 --> 00:00:08,120
Hola, hola, vamos a empezar con este tema tan importante de diabetes. Vamos a ver los tipos de

2
00:00:08,120 --> 00:00:11,720
diabetes y me refiero a los tipos de diabetes mellitus dado que la diabetes insípida se va

3
00:00:11,720 --> 00:00:17,580
a ver en endocrinología en una clase totalmente diferente. Recordemos que uno de los tipos más

4
00:00:17,580 --> 00:00:22,180
frecuentes que es solamente el 10% de las diabetes es la diabetes mellitus tipo 1.

5
00:00:22,180 --> 00:00:26,420
Esta acuérdense que es autoinmune y que habitualmente afecta a los niños. Segundo

6
00:00:26,420 --> 00:00:30,500
lugar está la diabetes mellitus tipo 2 que acuérdense que es causada por resistencia a

7
00:00:30,500 --> 00:00:36,980
la insulina y que es la más frecuente en adultos. La obesidad tiene un rol bastante

8
00:00:36,980 --> 00:00:42,180
importante en la fisiopatología de esta enfermedad en el sentido en que aumenta la resistencia a

9
00:00:42,180 --> 00:00:46,020
la insulina y hace que finalmente se exprese esta diabetes. Aparte, hay otros tipos de

10
00:00:46,020 --> 00:00:50,620
diabetes un poco más raros como la diabetes LADA que es la diabetes autoinmune latente de

11
00:00:50,620 --> 00:00:54,940
los adultos que es igual a una diabetes 1 pero que aparece en una edad más tardía y

12
00:00:54,940 --> 00:00:59,300
habitualmente es un poquito menos agresiva que la tipo 1 pero bastante más agresiva que la

13
00:00:59,300 --> 00:01:05,100
tipo 2 y que es la clásica autoinmune de los adultos. Repito, igual a la tipo 1 pero en

14
00:01:05,100 --> 00:01:11,300
adulto. Aparte de eso está la diabetes tipo MoDi que son unas diabetes genéticas habitualmente

15
00:01:11,300 --> 00:01:15,740
se diagnostican antes de los 25 años siempre y cuando la persona se haga exámenes obviamente

16
00:01:15,740 --> 00:01:21,060
de lo contrario se va a diagnosticar más tarde y que es característicamente autosómica dominante

17
00:01:21,060 --> 00:01:25,300
y acuérdense que todas las enfermedades autosómicas dominantes afectan habitualmente

18
00:01:25,500 --> 00:01:31,060
a todas las generaciones o sea lo más probable es que va a haber hermanos con diabetes, alguno

19
00:01:31,060 --> 00:01:35,740
de los padres o de los tíos con diabetes etcétera. Aparte de esto están las diabetes del

20
00:01:35,740 --> 00:01:39,660
embarazo por un lado la diabetes Melitus gestacional que la vamos a ver en detalle

21
00:01:39,660 --> 00:01:44,460
más adelante que acuérdense que en el embarazo aumentan las hormonas de contrarregulación

22
00:01:44,460 --> 00:01:50,140
y dentro de esas hormonas que son son muchas una de ellas es el lactógeno placentario y

23
00:01:50,140 --> 00:01:54,420
todo este conjunto de hormonas de contrarregulación y en este caso específico el lactógeno

24
00:01:54,420 --> 00:01:59,540
placentario generan una resistencia a la insulina que gatilla esta diabetes gestacional

25
00:01:59,540 --> 00:02:04,980
o diabetes del embarazo. Aparte de esto tengo la diabetes pregestacional que se ve la misma

26
00:02:04,980 --> 00:02:10,620
clase que la diabetes gestacional pero es aquella que se diagnosticó antes del embarazo

27
00:02:10,620 --> 00:02:14,740
o bien que se diagnostica en las primeras 12 semanas del embarazo cumpliendo los criterios

28
00:02:14,740 --> 00:02:18,900
de diabetes en alguien no embarazado. Repito esto lo vamos a ver con más detalles y que ahí

29
00:02:18,900 --> 00:02:23,380
va a quedar un poco más claro y aparte de esas que son las más importantes las que hay

30
00:02:23,380 --> 00:02:28,220
que saber con mayor detalle hay otras causas de diabetes como ejemplo fármaco dentro de eso

31
00:02:28,220 --> 00:02:32,060
los corticoides acuérdense que el cortisol y los corticoides también son hormonas de

32
00:02:32,060 --> 00:02:37,620
contrarregulación aparte de esto las cosas que dañan el páncreas la insulina se secreta

33
00:02:37,620 --> 00:02:42,500
en los islotes del angerhans en las células beta de los islotes del angerhans del páncreas

34
00:02:42,500 --> 00:02:47,500
así que una cirugía pancreática ejemplo una pancreatectomía un cáncer de páncreas

35
00:02:47,500 --> 00:02:52,500
o bien incluso una pancreatitis que destruye el páncreas pueden generar una diabetes ya

36
00:02:52,500 --> 00:02:56,980
sea transitoria en el caso de la pancreatitis o ya sea permanente en el sentido que si que el

37
00:02:56,980 --> 00:03:02,940
daño es muy muy grande puede quedar con diabetes después también. Finalmente están las diabetes

38
00:03:02,940 --> 00:03:06,980
de causa endocrina y todas las enfermedades endocrinas que aumenten las hormonas de

39
00:03:06,980 --> 00:03:11,220
contrarregulación pueden desencadenar una diabetes también ejemplo la enfermedad de

40
00:03:11,220 --> 00:03:16,900
Cushing y todos los síndromes de Cushing el hipertiroidismo lacromegalia etcétera ahora

41
00:03:16,900 --> 00:03:21,300
cómo se diferencian cómo se hace una diabetes tipo 1 una diabetes tipo 2 por ejemplo

42
00:03:21,300 --> 00:03:26,460
y la verdad es que se hace con la clínica no se hace con un examen en particular sino que con

43
00:03:26,460 --> 00:03:31,820
la clínica y dentro de los parámetros a evaluar la edad es muy importante si es muy

44
00:03:31,820 --> 00:03:37,820
joven diabetes 1 si es en cambio un adulto lo más probable que sea diabetes 2 el peso

45
00:03:37,820 --> 00:03:43,100
acuérdense que la obesidad es habitualmente el desencadenante de la diabetes 2 o de la

46
00:03:43,100 --> 00:03:47,860
expresión de los genes de predisposición a la diabetes en la diabetes 2 la severidad

47
00:03:47,860 --> 00:03:51,700
mientras más severo más yo pienso en una diabetes autoinmune y la respuesta que tenga a

48
00:03:51,700 --> 00:03:56,500
los hipoglicemiantes orales recordando que los hipoglicemiantes son la base del

49
00:03:56,500 --> 00:04:00,980
tratamiento de la diabetes tipo 2 en cambio no sirven las diabetes autoinmune como en la

50
00:04:00,980 --> 00:04:08,580
alada o en la tipo 1 si es muy severo si se instala muy rápido con mucha hiperglicemia

51
00:04:08,580 --> 00:04:13,780
o con mucho daño órgano blanco así rápido o bien si es que debuta como una cetoacidosis

52
00:04:13,780 --> 00:04:18,580
diabética o tiende a complicarse con cetoacidosis en ese caso lo más probable

53
00:04:18,580 --> 00:04:22,980
es que sea de tipo autoinmune si es un niño va a ser una diabetes 1 si es que es un

54
00:04:22,980 --> 00:04:27,420
adulto va a ser una diabetes lada segundo lugar si es que tiene muchos antecedentes

55
00:04:27,420 --> 00:04:31,540
familiares eso puede ser de cualquiera de hecho los antecedentes familiares sugieren

56
00:04:31,540 --> 00:04:36,660
más una tipo 2 pero si los familiares son flacos o sea no tienen obesidad uno dice esto

57
00:04:36,660 --> 00:04:40,860
ya no es una diabetes 2 y si además son jóvenes y están todos con diabetes lo más

58
00:04:40,860 --> 00:04:46,420
probable es que sea una de estas diabetes genéticas esta diabetes tipo modi que es

59
00:04:46,420 --> 00:04:52,020
por resistencia a la insulina pero de índole genética ahora si es que tiene antecedentes

60
00:04:52,020 --> 00:04:55,400
de otras enfermedades autoinmunes como hipotiroidismo o un vitíligo o alguna

61
00:04:55,400 --> 00:04:59,260
cosa así y no responde a los hipoglicemiantes orales obviamente se sospecha una diabetes

62
00:04:59,260 --> 00:05:03,760
lada que es de causa autoinmune y que al igual que la diabetes 1 no responde

63
00:05:03,760 --> 00:05:09,380
a los hipoglicemiantes ahora si bien la clínica es lo más importante si existen

64
00:05:09,380 --> 00:05:14,060
algunos exámenes que me pueden ayudar a complementar esta diferenciación dentro

65
00:05:14,060 --> 00:05:18,260
de eso está el peptido c que lo vamos a ver que sirve también en las hipoglicemias pero

66
00:05:18,260 --> 00:05:22,660
me sirve cuando yo tengo alguna duda respecto al tipo de diabetes en el sentido en que

67
00:05:22,660 --> 00:05:27,780
refleja muy bien la insulina endógena los niveles plasmáticos de insulina son muy

68
00:05:27,780 --> 00:05:32,380
erráticos sube rápido baja rápido en cambio el peptido c es más estable así que si

69
00:05:32,380 --> 00:05:36,700
que está elevado quiere decir que hay una hipersecreción de insulina en el cuerpo del

70
00:05:36,700 --> 00:05:41,800
paciente si es que está bajo en cambio lo más probable es que falta insulina por lo tanto va

71
00:05:41,800 --> 00:05:46,940
a estar elevado en la diabetes tipo 2 en que como hay una resistencia a la insulina se eleva

72
00:05:46,940 --> 00:05:51,300
la insulina y por lo tanto aumenta el peptido c y obviamente en todas las que se asocen a

73
00:05:51,300 --> 00:05:55,700
resistencia a la insulina como la diabetes modi las por fármacos etcétera en cambio va a

74
00:05:55,700 --> 00:06:01,200
estar disminuido en las diabetes tipo 1 la diabetes lada porque obviamente ahí se destruye

75
00:06:01,200 --> 00:06:06,720
el páncreas endocrino que es el que produce la insulina y en las causas pancreáticas también

76
00:06:06,720 --> 00:06:11,360
obviamente porque hay una hiposecreción de insulina aparte de eso yo puedo complementar

77
00:06:11,360 --> 00:06:17,600
con anticuerpos existen distintos anticuerpos que al estar positivo me dicen hay una diabetes

78
00:06:17,600 --> 00:06:24,920
de tipo autoinmunes los anticuerpos más importantes son los antigad los anti insulina

79
00:06:25,120 --> 00:06:33,320
los anti IA2 que son los que tienen relación con la tirocinasa fosfato tipo 2 da lo mismo

80
00:06:33,320 --> 00:06:40,720
el nombre pero sepan que que los T2 son los característicos o puede ser IA2 también

81
00:06:40,720 --> 00:06:47,080
con las dos nomenclaturas y finalmente la del transportador de sin tipo 8 ahora insisto

82
00:06:47,080 --> 00:06:50,920
no hay por qué saberlos todos basta con que sepan que hay anticuerpos que si es que están

83
00:06:50,920 --> 00:06:54,800
positivos eso orienta muy fortemente una diabetes lada así que cuando se sospecha en

84
00:06:54,800 --> 00:06:58,600
un adulto uno de los exámenes que hay que ir a pedir es el peptidose que la diabetes

85
00:06:58,600 --> 00:07:03,520
lada va a estar bajo más los anticuerpos que van a estar positivos ahora finalmente

86
00:07:03,520 --> 00:07:09,320
cuando yo sospecho una diabetes tipo modi la verdad es que existen exámenes genéticos

87
00:07:09,320 --> 00:07:13,560
que dirigidamente van a buscar las mutaciones más frecuentes y eventualmente puedo confirmar

88
00:07:13,560 --> 00:07:18,520
el diagnóstico de una diabetes modi y una vez que confirmo en un paciente esta alteración

89
00:07:18,520 --> 00:07:22,760
genética lo más probable es que se estudie al resto de la familia que venga con hiperglicemia

90
00:07:22,760 --> 00:07:27,560
también vamos a ver algunos casos como para ver si esto quedó claro en sentido en que las

91
00:07:27,560 --> 00:07:31,880
preguntas de las pruebas habitualmente vienen con un caso clínico y el primero me dice 8

92
00:07:31,880 --> 00:07:36,760
años hasta ello digo tiene lo más probable una diabetes tipo 1 que tiene baja de peso

93
00:07:36,760 --> 00:07:43,360
polidipsia o sea tiene síntomas de diabetes que en la diabetes 1 suele ser más agresiva y

94
00:07:43,360 --> 00:07:48,520
es más frecuente que haya síntomas más una licemia que está en 350 en este caso tiene el

95
00:07:48,520 --> 00:07:53,920
diagnóstico de diabetes por cumplir con el criterio de síntomas más una licemia ya sea

96
00:07:53,920 --> 00:07:58,800
de 1 o no mayor o igual a 200 así que hay una diabetes a los 8 años y una diabetes severa

97
00:07:58,800 --> 00:08:04,920
sin ninguna duda es una diabetes mellitus tipo 1 el segundo caso me dice 45 años o sea ya

98
00:08:04,920 --> 00:08:10,320
hasta ahí parece una diabetes tipo 2 que tiene un imc de 30 o sea está con obesidad hasta

99
00:08:10,320 --> 00:08:17,080
ahí diabetes tipo 2 también la madre diabética acuérdense que si bien la modi en la que por

100
00:08:17,080 --> 00:08:21,400
definición es genética la tipo 2 también tiene un componente genético muy muy importante

101
00:08:21,400 --> 00:08:26,040
solo que no es solamente un gen sino que son múltiples genes que tienden a la resistencia

102
00:08:26,040 --> 00:08:32,160
a la insulina y está con una licemia de 1 que está arriba de 126 así que si yo la repito

103
00:08:32,160 --> 00:08:36,280
y me vuelve a dar 150 hago el diagnóstico de diabetes en este caso lo más probable es

104
00:08:36,280 --> 00:08:43,640
que hay una diabetes tipo 2 en el caso que sigue 20 años una persona joven hipotiroidea

105
00:08:43,640 --> 00:08:47,400
o sea viene con el antecedente de una enfermedad autoinmune acuérdense que el hipotiroidismo

106
00:08:47,400 --> 00:08:52,200
habitualmente es por la tiroiditis de Hashimoto que es autoinmune tiene un imc de 23 o sea

107
00:08:52,200 --> 00:08:58,040
normo peso una licemeda de ayuno en 300 demasiado alta uno dice alguien joven con

108
00:08:58,040 --> 00:09:03,680
antecedente de autoinmunidad sin sobrepeso y con una licemia que está demasiado alta lo

109
00:09:03,680 --> 00:09:08,400
más probable que sea una diabetes mellitus de tipo lada está autoinmune así que recordemos

110
00:09:08,400 --> 00:09:13,200
número uno hay que pedirle los anticuerpos para confirmar y número dos una vez que

111
00:09:13,200 --> 00:09:18,560
lo haya confirmado y mientras está en estudio la voy a manejar con insulina no con hipoglicemiantes

112
00:09:18,560 --> 00:09:24,080
orales y la última también tiene 20 años tiene un imc de 23 o sea hasta ahí es alguien

113
00:09:24,080 --> 00:09:28,480
joven normo peso una licemeda de ayuno que está en 150 o sea está elevada está

114
00:09:28,480 --> 00:09:33,120
en rango de diabetes hay que repetirla para confirmar pero no es algo tan terrible sus

115
00:09:33,120 --> 00:09:37,360
padres y primos son diabéticos y todos antes de los 40 años lo más probable es que aquí me

116
00:09:37,360 --> 00:09:42,480
están preguntando hasta diabetes modi la diabetes genética de la lada y de la modi lo único

117
00:09:42,480 --> 00:09:47,040
que hay que saber es identificarlos y saber que la lada es mala y que hay que manejarla

118
00:09:47,040 --> 00:09:52,360
con insulina y que la modi en cambio suele ser bastante benigna y anda bien con los

119
00:09:52,360 --> 00:09:56,120
hipoglicemiantes orales y bueno esa fue esta clase nos vemos los siguientes vídeos que estén bien',
    'Comenzamos esta serie sobre diabetes abordando uno de los temas fundamentales: los distintos tipos de diabetes mellitus. Es importante aclarar desde el inicio que en esta cápsula nos referimos exclusivamente a la diabetes mellitus, ya que la diabetes insípida es una entidad completamente diferente que se aborda en el módulo de endocrinología general.

El primer tipo que deben dominar es la **diabetes mellitus tipo 1**, que representa aproximadamente el 10% de todos los casos de diabetes. Su mecanismo es autoinmune: el sistema inmune destruye las células beta de los islotes de Langerhans en el páncreas, que son las responsables de producir insulina. Esta forma se presenta predominantemente en niños y adolescentes, con un debut generalmente brusco y severo.

El tipo más prevalente en la población adulta es la **diabetes mellitus tipo 2**, donde el mecanismo central es la resistencia a la insulina. La obesidad juega un papel fisiopatológico crítico: el exceso de tejido adiposo amplifica esta resistencia, lo que eventualmente supera la capacidad secretora del páncreas y desencadena la hiperglicemia mantenida. Es la forma que encontrarán con mayor frecuencia en la práctica clínica.',
    '["La DM tipo 1 es autoinmune, representa el 10% de los casos y se presenta en niños; la DM tipo 2 es por resistencia a la insulina, asociada a obesidad y es la más frecuente en adultos.","La LADA es una diabetes autoinmune del adulto, similar a la tipo 1 pero de curso más lento; no responde a hipoglicemiantes orales y se maneja con insulina.","La MODY es de origen genético con herencia autosómica dominante, afecta múltiples generaciones de personas jóvenes y delgadas, y suele responder bien a hipoglicemiantes orales.","El péptido C es el mejor marcador de producción endógena de insulina: elevado en resistencia insulínica (tipo 2, MODY), disminuido en formas autoinmunes y en daño pancreático.","Los anticuerpos anti-GAD, anti-insulina, anti-IA2 y anti-transportador de zinc tipo 8 confirman la etiología autoinmune; son clave para diagnosticar LADA en el adulto."]'::jsonb,
    '[{"para":"\"1-Autoinmune-Niño / 2-Resistencia-Adulto-Obeso\"","nemotecnia":"\"1-Autoinmune-Niño / 2-Resistencia-Adulto-Obeso\"","explicacion":"La tipo 1 destruye (autoinmune), la tipo 2 resiste (insulina). Con solo esas dos palabras clave recuerdan la esencia de cada tipo.\nLa tipo 1 destruye (autoinmune), la tipo 2 resiste (insulina). Con solo esas dos palabras clave recuerdan la esencia de cada tipo."},{"para":"\"LADA = La Adulta que no obedece\":","nemotecnia":"\"LADA = La Adulta que no obedece\":","explicacion":"Si un adulto con aspecto de diabetes tipo 2 no responde a los hipoglicemiantes orales, sospechen LADA. Pidan anticuerpos y esperen un péptido C bajo.Si un adulto con aspecto de diabetes tipo 2 no responde a los hipoglicemiantes orales, sospechen LADA. Pidan anticuerpos y esperen un péptido C bajo."},{"para":"\"MODY = Muchas Generaciones Delgadas Jóvenes\":","nemotecnia":"\"MODY = Muchas Generaciones Delgadas Jóvenes\":","explicacion":"Diabetes en múltiples generaciones, todos jóvenes y sin obesidad. Un gen dominante que se hereda de padres a hijos sin saltarse generaciones.Diabetes en múltiples generaciones, todos jóvenes y sin obesidad. Un gen dominante que se hereda de padres a hijos sin saltarse generaciones."}]'::jsonb,
    '["La DM tipo 1 es autoinmune, representa el 10% de los casos y se presenta en niños; la DM tipo 2 es por resistencia a la insulina, asociada a obesidad y es la más frecuente en adultos.","La LADA es una diabetes autoinmune del adulto, similar a la tipo 1 pero de curso más lento; no responde a hipoglicemiantes orales y se maneja con insulina.","La MODY es de origen genético con herencia autosómica dominante, afecta múltiples generaciones de personas jóvenes y delgadas, y suele responder bien a hipoglicemiantes orales."]'::jsonb,
    '[]'::jsonb,
    '[{"pregunta":"¿Cuál de las siguientes afirmaciones es correcta?","respuesta":"Respuesta correcta: C — La diabetes LADA comparte el mecanismo autoinmune de la tipo 1 pero aparece en adultos con un curso más indolente; al igual que la tipo 1, no responde a los hipoglicemiantes orales y su manejo es con insulina."}]'::jsonb,
    NOW(),
    TRUE,
    TRUE  -- first 3 free preview
  ) ON CONFLICT (specialty_id, order_index)
  DO UPDATE SET
    title            = EXCLUDED.title,
    duration_seconds = EXCLUDED.duration_seconds,
    txt_content      = EXCLUDED.txt_content,
    srt_content      = EXCLUDED.srt_content,
    ai_summary       = EXCLUDED.ai_summary,
    ai_key_concepts  = EXCLUDED.ai_key_concepts,
    ai_mnemonics     = EXCLUDED.ai_mnemonics,
    ai_high_yield    = EXCLUDED.ai_high_yield,
    ai_review_qs     = EXCLUDED.ai_review_qs,
    ai_processed_at  = NOW(),
    is_available     = TRUE;

  -- Cápsula 2: Diagnóstico de Diabetes Mellitus — Criterios, Screening y Estados Intermedios
  INSERT INTO lessons (
    specialty_id, title, order_index, duration_seconds,
    txt_content, srt_content,
    ai_summary, ai_key_concepts, ai_mnemonics,
    ai_high_yield, ai_algorithms, ai_review_qs,
    ai_processed_at, is_available, is_free_preview
  ) VALUES (
    v_specialty_id,
    'Diagnóstico de Diabetes Mellitus — Criterios, Screening y Estados Intermedios',
    2,
    663,
    'Hola, hola, ¿cómo están? Hablemos de cómo diagnosticar una diabetes, hay que saber los criterios, hay que saberlos bien y acuérdense de esto,

los criterios no me diferencian el tipo de diabetes, solamente me confirman que hay una diabetes mellitus y es la clínica, la severidad, los anticuerpos

y el resto de los antecedentes los que me orientan a si es una diabetes tipo 1 o tipo 2, etcétera.

Repito, esto solamente me dice si hay o no diabetes mellitus y no el tipo.

Ahora, los criterios que hay que saber es, número 1, que tenga dos licemias de yuno mayor o igual a

126 miligramos por decilitro, no es mayor o igual a 125, es 126, aprendedselo bien.

Número 2, el que tenga una glicemia mayor a 200 en un TTGO de 75 gramos a las dos horas, en ese caso se confirma también.

Y finalmente, que tenga una glicemia que da lo mismo si es de yuno o no, de hecho se describe como una glicemia aislada, cualquier glicemia

mayor a 200 pero que además de estar mayor a 200 tenga síntomas de diabetes, dígase, venga con mucha sed, con polidipsia,

que haga mucho pipí, con poliguria, que tenga mucha hambre y coma mucho, con polifagia y que aún así tenga baja de peso,

que es uno de los síntomas más frecuentes, o bien la visión borrosa acordándonos que la hiperglicemia eventualmente

altera un poco la refracción del ojo y hace que se vea borroso y lo mismo pasa también al corregir una diabetes

que lleva mucho tiempo, igualmente puede que tenga que cambiar los lentes a la persona diabética también.

Ahora, repito, si es que no tengo síntomas y tengo una glicemia de 300 por ejemplo, en ese caso lo que tengo que hacer

es repetirlo para ver si es que está en 300 de nuevo, pues cumplo con el primer criterio, con dos glicemias mayores y iguales a 126,

pero si es que tengo síntomas, ahí me basta una sola glicemia arriba de 200.

Ahora, ¿qué pasa cuando está con infección, cuando está con algo que lo puede descompensar,

ejemplo una neumonía, una piel nefrítica, una pancreatitis o cualquier cosa grave que venga con una reacción inflamatoria muy grande?

Pues en este caso no me sirve absolutamente ninguno de esos criterios porque algo que venga con una reacción inflamatoria muy grande

puede per se generar hiperglicemia porque hay gran resistencia a la insulina, eleva el cortisol, etcétera,

y en ese caso lo que me sirve es la hemoglobina glicosilada, si bien es un criterio que no se usa tanto en Chile,

si se usa en el mundo y es de elección en estos casos, en que hay un descompensante claro que puede producir hiperglicemia

y el corte en este caso para el diagnóstico es que sea mayor a 6,5%.

O sea, repito, la hemoglobina glicosilada sí me sirve para hacer el diagnóstico,

es un buen elemento para hacer el diagnóstico, pero generalmente se usa no como diagnóstico,

sino que como seguimiento, como control de la diabetes, pero sería de elección en dos situaciones,

número uno, cuando tengo una infección o algún otro descompensante claro,

y número dos, cuando yo sospecho que el paciente miente respecto a que me hace un ayuno más prolongado

de las 8 a 12 horas que se recomienda para poder tomar la glicemia de ayuno

y finalmente sale con una glicemia que está buena, pero solamente porque hizo un ayuno mucho más largo,

así que en ese caso la hemoglobina glicosilada dice la verdad porque ve no solamente lo que ha ocurrido en el último tiempo,

sino que lo que ha ocurrido en los últimos dos a tres meses.

Ahora, existen otros diagnósticos que se relacionan bastante con la diabetes,

pero que no son una diabetes propiamente tal, número uno, la resistencia a la insulina,

número dos, la glicemia de ayuno alterada y número tres, la intolerancia a la glucosa oral,

son tres diagnósticos cuyos criterios hay que saber igualmente porque hay que saber diferenciarlos de la diabetes,

la resistencia a la insulina se diagnostica con la prueba de HOMA, cuando es mayor a 2,6,

uno dice hay resistencia a la insulina y solamente para recordar la forma en que se calculaba

era la glicemia por la insulina dividido por 405.

Ahora, como multiplicar eso y dividir eso es difícil, eventualmente lo dividen por 400 nomás y ahí es más rápido.

Segundo lugar, la glicemia de ayuno alterada se define como glicemia de ayuno entre 100 a 125,

entonces fíjense, el normal es hasta 99, una vez que ya tiene 100 uno dice esto es una glicemia de ayuno alterada

y hasta 125, en el sentido en que desde 126 en adelante recién hablábamos de una diabetes.

Y finalmente la intolerancia a la glucosa oral que en este caso es cuando el T-tegioa a las dos horas

está menor a 200 pero desde 140 en adelante, se describe como desde 140 hasta 199,

en ese caso se habla de esta intolerancia a la glucosa oral.

Ahora, la glicemia de ayuno alterada y la intolerancia a la glucosa oral, estos últimos dos diagnósticos,

se los denomina como pre-diabetes en el sentido en que tienen un riesgo alto de evolucionar una diabetes.

Hay gente que no le gusta mucho ese concepto de pre-diabetes pero la mayoría de las guías internacionales

lo aceptan por su caso.

Ahora, ¿cómo se hace el screening de diabetes?

Acuérdense que se hace con glicemia de ayuno y habitualmente a todos los adultos en algún momento

se le hace una glicemia de ayuno, si tiene factores de riesgo cardiovascular con mayor razón todavía

o si es que tiene obesidad con mayor razón pero la regla general es que a todo adulto asintomático

y a toda persona asintomática hay que hacerle al menos una glicemia de ayuno en busca de diabetes.

Si es que me sale menor a 100 hasta 99,9 se dice es normal y no hay que hacer absolutamente nada más,

se descarta el diagnóstico de diabetes.

Si es que está entre 100 a 125, ahí la duda es, ¿tendrá una glicemia de ayuno alterada?

Porque está justamente con la glicemia de ayuno en ese rango de glicemia de ayuno alterada.

En la conducta es pedirle un TTGO, o sea, ir con un examen un poco más complejo que la simple glicemia de ayuno

y que quede bien claro, esto en la gente no embarazada, en las embarazadas lo vamos a ver después, esto cambia.

Y finalmente cuando me sale mayor o igual a 126, yo digo lo más probable es que tiene una diabetes,

así que lo que se hace es se repite y si vuelve a estar dentro de ese mismo rango,

pues se confirma el diagnóstico de diabetes.

Ahora, ¿qué pasa si al repetirlo me sale 80?

En ese caso se descarta la diabetes, se vuelve a lo que está más arriba ahí en que estaba menor a 100.

Ahora, una vez que yo pido el TTGO, que repito, el TTGO se pedía cuando la glicemia estaba entre 100 a 125,

en el momento en que yo lo pido, si lo miro a las dos horas y está menos de 140, pues está normal.

Si que está entre 140 a 199 a las dos horas, en ese caso hay una intolerancia a la glucosa oral,

y finalmente si está mayor o igual a 200, hago el diagnóstico de diabetes.

Fíjense, en este caso no requiere síntomas, el criterio con síntomas era cualquier glicemia,

ya sea de ayuno o no, más síntomas.

En cambio, el criterio del TTGO era simplemente que a las dos horas después de 75 gramos de glucosa,

estuviera de 200 o más.

Ahora, vamos con ejemplos, esta es la forma en que queda más fácil.

Me dicen que tiene 45 años que tiene glicemias de 130 y de 120.

Uno dice, ups, aquí está con una glicemia que estaba dentro del diagnóstico provisorio de diabetes,

estaba en 130, pero la segunda me salió en 120, así que la segunda salió menor a 126,

en ese caso ya no tengo una diabetes y lo que tengo que ir a hacer es ir a pedirle

un test de tolerancia a la glucosa oral por estar con estas glicemias entre 100 y 125.

Así que el diagnóstico hasta ahí es una glicemia de ayuno alterada

y la conducta es pídele un TTGO como para ver si es que hay una diabetes, si me da más de 200

o si es que hay una intolerancia a la glucosa oral o si simplemente tengo estas glicemias de ayuno alterada y nada más.

Si me da en este otro caso una glicemia de ayuno que está en 110, en ese caso hay que pedirle un TTGO,

se pide el TTGO, me sale 115 la basal que está dentro del rango de glicemia de ayuno alterada

y la poscarga me sale en 150, o sea entre 140 y 199,

lo que tiene es una glicemia de ayuno alterada por las glicemias basales entre 100 y 125

más una intolerancia a la glucosa oral por la glicemia poscarga entre 140 y 199.

Va quedando un poquito más claro.

El siguiente me dice obeso que tiene una glicemia de 98, o sea está normal, está menor a 100,

así que hasta ahí no hay diabetes ni glicemia de ayuno alterada ni nada,

más una insulina de 25, yo digo y ahí habrá resistencia a la insulina o no

y la verdad es que hay resistencia a la insulina y uno dice cómo voy a calcular el HOMA ahí

para que me den más de 2.6 y yo recomiendo que lo hagan de una manera sencilla, rápida.

Glicemia de 98 pues que sea glicemia de 100, insulina 25, dejémosla en 25 o si es que quieren

dejémosla en 20 y esto dividido por 400, uno dice 100 por 20 dividido por 400,

100 dividido por 400, un cuarto, un cuarto multiplicado por 20 da 5 y por 25 da 6, algo.

O sea uno dice claramente está arriba de 2.6.

Si no entendió esto, lo hace con la calculadora en mano y le va a quedar más claro,

pero acuérdense no perder mucho tiempo en hacer los cálculos en el UNACOM,

así que lo más fácil es hacer una matemática bien laxa,

100 por 25 o 100 por 20 dividido por 400 y me da claramente más de 2.6

sin saber el número exacto y yo digo hay resistencia a la insulina.

Difícil, pero sigamos.

Tengo un ttg o que la basal está en 90, eso está menor a 100, así que está absolutamente normal

y la postcarga está menor a 140, está en el límite, pero sigue estando menor a 140,

está también absolutamente normal, así que el diagnóstico es alguien sano al menos respecto a

el área de la diabetes y ese tipo de cosas porque puede que tenga otra enfermedad.

Tiene una licemia de ayuno de 300 y nada más, uno dice hasta ahí,

si tuviera síntomas en ese caso tendría diabetes,

pero si no tiene síntomas y me dan solamente esa información,

lo que ',
    '1
00:00:03,380 --> 00:00:09,960
Hola, hola, ¿cómo están? Hablemos de cómo diagnosticar una diabetes, hay que saber los criterios, hay que saberlos bien y acuérdense de esto,

2
00:00:09,960 --> 00:00:17,340
los criterios no me diferencian el tipo de diabetes, solamente me confirman que hay una diabetes mellitus y es la clínica, la severidad, los anticuerpos

3
00:00:17,340 --> 00:00:22,520
y el resto de los antecedentes los que me orientan a si es una diabetes tipo 1 o tipo 2, etcétera.

4
00:00:22,520 --> 00:00:26,500
Repito, esto solamente me dice si hay o no diabetes mellitus y no el tipo.

5
00:00:26,780 --> 00:00:31,380
Ahora, los criterios que hay que saber es, número 1, que tenga dos licemias de yuno mayor o igual a

6
00:00:31,380 --> 00:00:37,100
126 miligramos por decilitro, no es mayor o igual a 125, es 126, aprendedselo bien.

7
00:00:37,100 --> 00:00:45,500
Número 2, el que tenga una glicemia mayor a 200 en un TTGO de 75 gramos a las dos horas, en ese caso se confirma también.

8
00:00:45,500 --> 00:00:52,260
Y finalmente, que tenga una glicemia que da lo mismo si es de yuno o no, de hecho se describe como una glicemia aislada, cualquier glicemia

9
00:00:52,260 --> 00:01:00,140
mayor a 200 pero que además de estar mayor a 200 tenga síntomas de diabetes, dígase, venga con mucha sed, con polidipsia,

10
00:01:00,180 --> 00:01:06,060
que haga mucho pipí, con poliguria, que tenga mucha hambre y coma mucho, con polifagia y que aún así tenga baja de peso,

11
00:01:06,060 --> 00:01:12,900
que es uno de los síntomas más frecuentes, o bien la visión borrosa acordándonos que la hiperglicemia eventualmente

12
00:01:12,900 --> 00:01:19,700
altera un poco la refracción del ojo y hace que se vea borroso y lo mismo pasa también al corregir una diabetes

13
00:01:19,700 --> 00:01:24,820
que lleva mucho tiempo, igualmente puede que tenga que cambiar los lentes a la persona diabética también.

14
00:01:24,980 --> 00:01:31,340
Ahora, repito, si es que no tengo síntomas y tengo una glicemia de 300 por ejemplo, en ese caso lo que tengo que hacer

15
00:01:31,340 --> 00:01:38,140
es repetirlo para ver si es que está en 300 de nuevo, pues cumplo con el primer criterio, con dos glicemias mayores y iguales a 126,

16
00:01:38,140 --> 00:01:42,860
pero si es que tengo síntomas, ahí me basta una sola glicemia arriba de 200.

17
00:01:42,860 --> 00:01:47,780
Ahora, ¿qué pasa cuando está con infección, cuando está con algo que lo puede descompensar,

18
00:01:47,980 --> 00:01:55,860
ejemplo una neumonía, una piel nefrítica, una pancreatitis o cualquier cosa grave que venga con una reacción inflamatoria muy grande?

19
00:01:55,860 --> 00:02:02,740
Pues en este caso no me sirve absolutamente ninguno de esos criterios porque algo que venga con una reacción inflamatoria muy grande

20
00:02:02,740 --> 00:02:08,860
puede per se generar hiperglicemia porque hay gran resistencia a la insulina, eleva el cortisol, etcétera,

21
00:02:08,860 --> 00:02:15,180
y en ese caso lo que me sirve es la hemoglobina glicosilada, si bien es un criterio que no se usa tanto en Chile,

22
00:02:15,180 --> 00:02:21,460
si se usa en el mundo y es de elección en estos casos, en que hay un descompensante claro que puede producir hiperglicemia

23
00:02:21,460 --> 00:02:26,460
y el corte en este caso para el diagnóstico es que sea mayor a 6,5%.

24
00:02:26,460 --> 00:02:31,700
O sea, repito, la hemoglobina glicosilada sí me sirve para hacer el diagnóstico,

25
00:02:31,700 --> 00:02:36,060
es un buen elemento para hacer el diagnóstico, pero generalmente se usa no como diagnóstico,

26
00:02:36,060 --> 00:02:41,020
sino que como seguimiento, como control de la diabetes, pero sería de elección en dos situaciones,

27
00:02:41,020 --> 00:02:44,020
número uno, cuando tengo una infección o algún otro descompensante claro,

28
00:02:44,060 --> 00:02:50,060
y número dos, cuando yo sospecho que el paciente miente respecto a que me hace un ayuno más prolongado

29
00:02:50,060 --> 00:02:55,380
de las 8 a 12 horas que se recomienda para poder tomar la glicemia de ayuno

30
00:02:55,380 --> 00:03:00,700
y finalmente sale con una glicemia que está buena, pero solamente porque hizo un ayuno mucho más largo,

31
00:03:00,700 --> 00:03:06,740
así que en ese caso la hemoglobina glicosilada dice la verdad porque ve no solamente lo que ha ocurrido en el último tiempo,

32
00:03:06,740 --> 00:03:09,780
sino que lo que ha ocurrido en los últimos dos a tres meses.

33
00:03:10,260 --> 00:03:15,420
Ahora, existen otros diagnósticos que se relacionan bastante con la diabetes,

34
00:03:15,420 --> 00:03:19,820
pero que no son una diabetes propiamente tal, número uno, la resistencia a la insulina,

35
00:03:19,820 --> 00:03:25,900
número dos, la glicemia de ayuno alterada y número tres, la intolerancia a la glucosa oral,

36
00:03:25,900 --> 00:03:31,220
son tres diagnósticos cuyos criterios hay que saber igualmente porque hay que saber diferenciarlos de la diabetes,

37
00:03:31,820 --> 00:03:37,380
la resistencia a la insulina se diagnostica con la prueba de HOMA, cuando es mayor a 2,6,

38
00:03:37,420 --> 00:03:42,060
uno dice hay resistencia a la insulina y solamente para recordar la forma en que se calculaba

39
00:03:42,060 --> 00:03:46,100
era la glicemia por la insulina dividido por 405.

40
00:03:46,100 --> 00:03:53,140
Ahora, como multiplicar eso y dividir eso es difícil, eventualmente lo dividen por 400 nomás y ahí es más rápido.

41
00:03:53,620 --> 00:04:00,100
Segundo lugar, la glicemia de ayuno alterada se define como glicemia de ayuno entre 100 a 125,

42
00:04:00,100 --> 00:04:06,740
entonces fíjense, el normal es hasta 99, una vez que ya tiene 100 uno dice esto es una glicemia de ayuno alterada

43
00:04:06,780 --> 00:04:12,780
y hasta 125, en el sentido en que desde 126 en adelante recién hablábamos de una diabetes.

44
00:04:13,140 --> 00:04:18,660
Y finalmente la intolerancia a la glucosa oral que en este caso es cuando el T-tegioa a las dos horas

45
00:04:18,660 --> 00:04:25,900
está menor a 200 pero desde 140 en adelante, se describe como desde 140 hasta 199,

46
00:04:25,900 --> 00:04:28,900
en ese caso se habla de esta intolerancia a la glucosa oral.

47
00:04:29,220 --> 00:04:34,660
Ahora, la glicemia de ayuno alterada y la intolerancia a la glucosa oral, estos últimos dos diagnósticos,

48
00:04:34,820 --> 00:04:40,100
se los denomina como pre-diabetes en el sentido en que tienen un riesgo alto de evolucionar una diabetes.

49
00:04:40,340 --> 00:04:47,140
Hay gente que no le gusta mucho ese concepto de pre-diabetes pero la mayoría de las guías internacionales

50
00:04:47,140 --> 00:04:48,260
lo aceptan por su caso.

51
00:04:48,940 --> 00:04:51,380
Ahora, ¿cómo se hace el screening de diabetes?

52
00:04:51,380 --> 00:04:55,660
Acuérdense que se hace con glicemia de ayuno y habitualmente a todos los adultos en algún momento

53
00:04:55,660 --> 00:05:00,900
se le hace una glicemia de ayuno, si tiene factores de riesgo cardiovascular con mayor razón todavía

54
00:05:00,940 --> 00:05:06,700
o si es que tiene obesidad con mayor razón pero la regla general es que a todo adulto asintomático

55
00:05:06,700 --> 00:05:12,220
y a toda persona asintomática hay que hacerle al menos una glicemia de ayuno en busca de diabetes.

56
00:05:12,500 --> 00:05:18,100
Si es que me sale menor a 100 hasta 99,9 se dice es normal y no hay que hacer absolutamente nada más,

57
00:05:18,100 --> 00:05:19,780
se descarta el diagnóstico de diabetes.

58
00:05:20,060 --> 00:05:25,260
Si es que está entre 100 a 125, ahí la duda es, ¿tendrá una glicemia de ayuno alterada?

59
00:05:25,260 --> 00:05:29,260
Porque está justamente con la glicemia de ayuno en ese rango de glicemia de ayuno alterada.

60
00:05:29,700 --> 00:05:37,260
En la conducta es pedirle un TTGO, o sea, ir con un examen un poco más complejo que la simple glicemia de ayuno

61
00:05:37,260 --> 00:05:42,060
y que quede bien claro, esto en la gente no embarazada, en las embarazadas lo vamos a ver después, esto cambia.

62
00:05:42,060 --> 00:05:47,060
Y finalmente cuando me sale mayor o igual a 126, yo digo lo más probable es que tiene una diabetes,

63
00:05:47,060 --> 00:05:50,940
así que lo que se hace es se repite y si vuelve a estar dentro de ese mismo rango,

64
00:05:50,940 --> 00:05:53,100
pues se confirma el diagnóstico de diabetes.

65
00:05:53,100 --> 00:05:56,540
Ahora, ¿qué pasa si al repetirlo me sale 80?

66
00:05:56,580 --> 00:06:03,820
En ese caso se descarta la diabetes, se vuelve a lo que está más arriba ahí en que estaba menor a 100.

67
00:06:04,300 --> 00:06:11,300
Ahora, una vez que yo pido el TTGO, que repito, el TTGO se pedía cuando la glicemia estaba entre 100 a 125,

68
00:06:11,300 --> 00:06:17,220
en el momento en que yo lo pido, si lo miro a las dos horas y está menos de 140, pues está normal.

69
00:06:17,220 --> 00:06:22,940
Si que está entre 140 a 199 a las dos horas, en ese caso hay una intolerancia a la glucosa oral,

70
00:06:23,060 --> 00:06:26,660
y finalmente si está mayor o igual a 200, hago el diagnóstico de diabetes.

71
00:06:26,660 --> 00:06:32,140
Fíjense, en este caso no requiere síntomas, el criterio con síntomas era cualquier glicemia,

72
00:06:32,140 --> 00:06:34,300
ya sea de ayuno o no, más síntomas.

73
00:06:34,300 --> 00:06:40,020
En cambio, el criterio del TTGO era simplemente que a las dos horas después de 75 gramos de glucosa,

74
00:06:40,020 --> 00:06:42,540
estuviera de 200 o más.

75
00:06:42,540 --> 00:06:46,780
Ahora, vamos con ejemplos, esta es la forma en que queda más fácil.

76
00:06:46,780 --> 00:06:52,060
Me dicen que tiene 45 años que tiene glicemias de 130 y de 120.

77
00:06:52,060 --> 00:06:59,300
Uno dice, ups, aquí está con una glicemia que estaba dentro del diagnóstico provisorio de diabetes,

78
00:06:59,300 --> 00:07:04,820
estaba en 130, pero la segunda me salió en 120, así que la segunda salió menor a 126,

79
00:07:04,820 --> 00:07:09,140
en ese caso ya no tengo una diabetes y lo que tengo que ir a hacer es ir a pedirle

80
00:07:09,140 --> 00:07:14,060
un test de tolerancia a la glucosa oral por estar con estas glicemias entre 100 y 125.

81
00:07:14,060 --> 00:07:17,540
Así que el diagnóstico hasta ahí es una glicemia de ayuno alterada

82
00:07:17,620 --> 00:07:22,860
y la conducta es pídele un TTGO como para ver si es que hay una diabetes, si me da más de 200

83
00:07:22,860 --> 00:07:29,460
o si es que hay una intolerancia a la glucosa oral o si simplemente tengo estas glicemias de ayuno alterada y nada más.

84
00:07:29,460 --> 00:07:34,820
Si me da en este otro caso una glicemia de ayuno que está en 110, en ese caso hay que pedirle un TTGO,

85
00:07:34,820 --> 00:07:40,340
se pide el TTGO, me sale 115 la basal que está dentro del rango de glicemia de ayuno alterada

86
00:07:40,340 --> 00:07:45,020
y la poscarga me sale en 150, o sea entre 140 y 199,

87
00:07:45,020 --> 00:07:50,260
lo que tiene es una glicemia de ayuno alterada por las glicemias basales entre 100 y 125

88
00:07:50,260 --> 00:07:55,500
más una intolerancia a la glucosa oral por la glicemia poscarga entre 140 y 199.

89
00:07:55,500 --> 00:07:57,820
Va quedando un poquito más claro.

90
00:07:57,820 --> 00:08:02,620
El siguiente me dice obeso que tiene una glicemia de 98, o sea está normal, está menor a 100,

91
00:08:02,620 --> 00:08:05,940
así que hasta ahí no hay diabetes ni glicemia de ayuno alterada ni nada,

92
00:08:05,940 --> 00:08:11,100
más una insulina de 25, yo digo y ahí habrá resistencia a la insulina o no

93
00:08:11,140 --> 00:08:15,620
y la verdad es que hay resistencia a la insulina y uno dice cómo voy a calcular el HOMA ahí

94
00:08:15,620 --> 00:08:21,620
para que me den más de 2.6 y yo recomiendo que lo hagan de una manera sencilla, rápida.

95
00:08:21,620 --> 00:08:27,860
Glicemia de 98 pues que sea glicemia de 100, insulina 25, dejémosla en 25 o si es que quieren

96
00:08:27,860 --> 00:08:34,140
dejémosla en 20 y esto dividido por 400, uno dice 100 por 20 dividido por 400,

97
00:08:34,140 --> 00:08:42,620
100 dividido por 400, un cuarto, un cuarto multiplicado por 20 da 5 y por 25 da 6, algo.

98
00:08:42,620 --> 00:08:46,060
O sea uno dice claramente está arriba de 2.6.

99
00:08:46,060 --> 00:08:50,820
Si no entendió esto, lo hace con la calculadora en mano y le va a quedar más claro,

100
00:08:50,820 --> 00:08:56,820
pero acuérdense no perder mucho tiempo en hacer los cálculos en el UNACOM,

101
00:08:56,820 --> 00:09:00,060
así que lo más fácil es hacer una matemática bien laxa,

102
00:09:00,260 --> 00:09:05,940
100 por 25 o 100 por 20 dividido por 400 y me da claramente más de 2.6

103
00:09:05,940 --> 00:09:08,860
sin saber el número exacto y yo digo hay resistencia a la insulina.

104
00:09:08,860 --> 00:09:10,740
Difícil, pero sigamos.

105
00:09:10,740 --> 00:09:16,300
Tengo un ttg o que la basal está en 90, eso está menor a 100, así que está absolutamente normal

106
00:09:16,300 --> 00:09:21,820
y la postcarga está menor a 140, está en el límite, pero sigue estando menor a 140,

107
00:09:21,820 --> 00:09:26,940
está también absolutamente normal, así que el diagnóstico es alguien sano al menos respecto a

108
00:09:27,020 --> 00:09:31,620
el área de la diabetes y ese tipo de cosas porque puede que tenga otra enfermedad.

109
00:09:32,540 --> 00:09:36,620
Tiene una licemia de ayuno de 300 y nada más, uno dice hasta ahí,

110
00:09:36,620 --> 00:09:39,420
si tuviera síntomas en ese caso tendría diabetes,

111
00:09:39,420 --> 00:09:42,540
pero si no tiene síntomas y me dan solamente esa información,

112
00:09:42,540 --> 00:09:48,100
lo que tengo que hacer es justamente repetirla para ver si es que tiene diabetes o no.

113
00:09:48,100 --> 00:09:51,500
Lo más probable es que sí tenga en el sentido en que está arriba de 126

114
00:09:51,500 --> 00:09:54,820
y una licemia en ese rango es difícil que se vea en alguien sin diabetes,

115
00:09:54,860 --> 00:09:58,460
pero la conducta es repítala para estar seguro si es que tiene diabetes o no.

116
00:09:58,460 --> 00:10:02,380
Ahora, si tuviera síntomas no hay por qué repetirla, se hace el diagnóstico de inmediato.

117
00:10:02,380 --> 00:10:06,580
Ahora, si tuviera baja de peso más los otros síntomas de una diabetes

118
00:10:06,580 --> 00:10:10,500
y aparte de eso una licemia de 250 o una licemia de 200 o más,

119
00:10:10,500 --> 00:10:13,300
en ese caso sí se confirma el diagnóstico de diabetes,

120
00:10:13,300 --> 00:10:16,540
pero si me preguntan ahí diabetes tipo 1 o diabetes tipo 2,

121
00:10:16,540 --> 00:10:20,580
pues va a depender de la edad, de la severidad, de las otras cosas,

122
00:10:20,580 --> 00:10:23,580
si me dicen que es un niño, ninguna duda que es una diabetes tipo 1,

123
00:10:23,860 --> 00:10:27,940
si me dicen que es un adulto no obeso y que venga con baja de peso,

124
00:10:27,940 --> 00:10:30,420
pues hay que sospechar una diabetes lada,

125
00:10:30,420 --> 00:10:34,100
pero si es que viene con la obesidad y ha bajado algo de peso nomás,

126
00:10:34,100 --> 00:10:36,620
lo más probable es que sea una diabetes tipo 2.

127
00:10:36,620 --> 00:10:41,540
Ahora, la última tiene un paciente hospitalizado por una pilonefritis aguda,

128
00:10:41,540 --> 00:10:44,420
está descompensado y tiene una licemia de 240.

129
00:10:44,420 --> 00:10:47,660
En este caso, acuérdense, no puedo hacer el diagnóstico de diabetes

130
00:10:47,660 --> 00:10:49,780
porque no es un paciente que esté en reposo,

131
00:10:49,780 --> 00:10:52,100
sino que está con un descompensante y lo que hay que hacer

132
00:10:52,100 --> 00:10:55,900
es pedirle la hemoglobina glicosilada, la hemoglobina A1C

133
00:10:55,900 --> 00:10:58,900
y de esa manera voy a saber finalmente si es que tiene diabetes o no.

134
00:10:58,900 --> 00:11:01,860
Y espero que haya quedado claro porque esto se pregunta

135
00:11:01,860 --> 00:11:03,380
y en la vida real hay que saberlo también.

136
00:11:03,380 --> 00:11:05,380
Así que nos vemos en los siguientes videos.',
    'En esta cápsula abordaremos cómo se diagnostica una diabetes mellitus. Antes de entrar en los criterios, hay un principio fundamental que deben grabar: los criterios diagnósticos confirman la existencia de diabetes, pero no determinan el tipo. Para saber si es una tipo 1, tipo 2 o LADA, se necesita la clínica, los anticuerpos y el contexto del paciente. Los criterios solo responden a la pregunta: ¿hay diabetes o no?

El **primer criterio** es la presencia de dos glicemias de ayuno iguales o superiores a 126 mg/dL. Pongan especial atención en el número: no es 125, es 126. Este detalle suele aparecer en las preguntas del EUNACOM, así que aprendédselo bien.

El **segundo criterio** consiste en una glicemia igual o superior a 200 mg/dL a las dos horas en un test de tolerancia a la glucosa oral, conocido como TTGO, realizado con 75 gramos de glucosa. En este caso no se requieren síntomas; basta con ese valor a las dos horas post-carga.',
    '["Los tres criterios diagnósticos son: dos glicemias de ayuno ≥ 126 mg/dL; glicemia post-TTGO ≥ 200 mg/dL a las 2 horas; o glicemia ≥ 200 mg/dL en cualquier momento más síntomas clásicos.","Con síntomas basta una sola glicemia ≥ 200; sin síntomas, cualquier valor elevado debe confirmarse con una segunda determinación.","En contexto de infección u otra condición inflamatoria aguda, los criterios de glicemia no son válidos; el examen de elección para diagnóstico es la HbA1c ≥ 6,5%.","La glicemia de ayuno alterada (100–125 mg/dL) y la intolerancia a la glucosa oral (140–199 mg/dL post-TTGO) constituyen los estados de prediabetes.","La resistencia a la insulina se diagnostica con HOMA > 2,6 (glicemia × insulina / 405)."]'::jsonb,
    '[{"para":"\"126 empieza la diabetes, 100 empieza el problema\":","nemotecnia":"\"126 empieza la diabetes, 100 empieza el problema\":","explicacion":"Por debajo de 100 todo normal. Entre 100 y 125 hay glicemia alterada. Desde 126 ya es diabetes. El 126 es el número clave.\nPor debajo de 100 todo normal. Entre 100 y 125 hay glicemia alterada. Desde 126 ya es diabetes. El 126 es el número clave."},{"para":"\"Sin síntomas, no te fíes de uno solo — repite\":","nemotecnia":"\"Sin síntomas, no te fíes de uno solo — repite\":","explicacion":"Si no hay síntomas, siempre repite la glicemia antes de diagnosticar. Si hay síntomas, una glicemia ≥ 200 es suficiente.Si no hay síntomas, siempre repite la glicemia antes de diagnosticar. Si hay síntomas, una glicemia ≥ 200 es suficiente."},{"para":"\"Infección = HbA1c\":","nemotecnia":"\"Infección = HbA1c\":","explicacion":"Cuando el paciente tiene un descompensante claro como una infección, la glicemia miente. La hemoglobina glicosilada dice la verdad de los últimos 2-3 meses.Cuando el paciente tiene un descompensante claro como una infección, la glicemia miente. La hemoglobina glicosilada dice la verdad de los últimos 2-3 meses."}]'::jsonb,
    '["Los tres criterios diagnósticos son: dos glicemias de ayuno ≥ 126 mg/dL; glicemia post-TTGO ≥ 200 mg/dL a las 2 horas; o glicemia ≥ 200 mg/dL en cualquier momento más síntomas clásicos.","Con síntomas basta una sola glicemia ≥ 200; sin síntomas, cualquier valor elevado debe confirmarse con una segunda determinación.","En contexto de infección u otra condición inflamatoria aguda, los criterios de glicemia no son válidos; el examen de elección para diagnóstico es la HbA1c ≥ 6,5%."]'::jsonb,
    '[]'::jsonb,
    '[{"pregunta":"¿Cuál de las siguientes afirmaciones es correcta?","respuesta":"Respuesta correcta: C — En contexto de infección u otra condición inflamatoria que genera hiperglicemia por estrés, los criterios habituales de glicemia no son válidos para diagnosticar diabetes; la HbA1c ≥ 6,5% es el examen de elección en este escenario."}]'::jsonb,
    NOW(),
    TRUE,
    TRUE  -- first 3 free preview
  ) ON CONFLICT (specialty_id, order_index)
  DO UPDATE SET
    title            = EXCLUDED.title,
    duration_seconds = EXCLUDED.duration_seconds,
    txt_content      = EXCLUDED.txt_content,
    srt_content      = EXCLUDED.srt_content,
    ai_summary       = EXCLUDED.ai_summary,
    ai_key_concepts  = EXCLUDED.ai_key_concepts,
    ai_mnemonics     = EXCLUDED.ai_mnemonics,
    ai_high_yield    = EXCLUDED.ai_high_yield,
    ai_review_qs     = EXCLUDED.ai_review_qs,
    ai_processed_at  = NOW(),
    is_available     = TRUE;

  -- Cápsula 3: Diagnóstico de Diabetes en el Embarazo — Gestacional y Pregestacional
  INSERT INTO lessons (
    specialty_id, title, order_index, duration_seconds,
    txt_content, srt_content,
    ai_summary, ai_key_concepts, ai_mnemonics,
    ai_high_yield, ai_algorithms, ai_review_qs,
    ai_processed_at, is_available, is_free_preview
  ) VALUES (
    v_specialty_id,
    'Diagnóstico de Diabetes en el Embarazo — Gestacional y Pregestacional',
    3,
    519,
    'Hola, hola, ¿cómo están? Algo importante es que el diagnóstico de diabetes en el

embarazo cambia bastante, así que hay que tener mucho cuidado de ver si la

paciente está embarazada o no y de saber diferenciar los criterios de las

personas no embarazadas y de las personas embarazadas. Así que empecemos con este

concepto de diabetes mellitus gestacional, que lo vamos a

contrastar luego con la pregestacional. La diabetes mellitus gestacional es

una mujer que está embarazada y que cumple con alguno de estos criterios.

Número uno, que tenga dos glicemios de ayuno mayor o igual a 100. Ya no es 126, en este

caso es 100. Entonces fíjense, ya no existe la glicemia de ayuno alterada en

el embarazo. Derechamente es una diabetes mellitus gestacional.

Segundo lugar, que tenga un TTGO con 75 gramos que el basal me dé mayor o

igual a 100, o sea, una glicemia de ayuno mayor o igual a 100, o bien que esté

mayor o igual a 140 a las dos horas después de la carga con los 75

gramos. O sea, nuevamente acá no existe el diagnóstico de intolerancia a la

glucosa oral. Derechamente es una diabetes mellitus gestacional. O sea,

fíjense, en el embarazo no hay prediabetes. Derechamente hay diabetes y

la razón de eso es que con esos rangos de glicemia que son

relativamente buenos, al menos para las complicaciones propias de la

diabetes, ya puede haber complicaciones en el feto, en el

embarazo. Así que es importante hacer el diagnóstico y manejarlo.

Finalmente, el mismo criterio de alguien no embarazada, cierto, en el

cual avanzado el embarazo, después de las 12 semanas tenga una glicemia

mayor o igual a 200 más síntomas de diabetes, si bien es bien raro que se

diagnostique una diabetes gestacional por ese criterio. Lo más

frecuente es que sea por alguno de los otros dos. Ahora, ¿cuáles son los

criterios de una diabetes mellitus pregestacional? En este caso es o un

diagnóstico que se hizo antes de embarazarse, un diagnóstico previo, o

bien un diagnóstico que se hace siempre en las primeras semanas, en las

primeras 12 semanas de embarazo. Si se hace después uno ya no puede hablar

de diabetes pregestacional. Ahora, los criterios es o que se hizo el

diagnóstico previo, ese es el primero. El segundo es que tenga las dos

glicemias de ayuno mayor o igual a 126 en las primeras 12 semanas. Y el

último es que tenga una glicemia, ya sea de ayuno o no, mayor o igual a 200

más los síntomas, también dentro de las primeras 12 semanas. O sea, en

resumen, que o se haya diagnosticado antes del embarazo o se diagnostique la

primera parte del embarazo con los criterios para alguien no embarazada.

Repito, para los criterios de alguien no embarazada. Entonces la pregunta que

hay acá es ¿qué pasa si cumple con esos criterios pero los cumple después

de las 12 semanas? Ejemplo, las 30 semanas. En ese caso ya no es una

diabetes mellitus pregestacional, sino que sería una diabetes gestacional.

Veamos, como para que quede un poquito más claro, el screening. El screening en

el embarazo se hace igualmente con una glicemia de ayuno al inicio del

embarazo, así bien temprano en el embarazo. Y si me sale menor a 100, en

ese caso es normal, igual que en las personas no embarazadas, y no se hace

nada más, simplemente lo voy a controlar con un TTGO que se hace

más adelante, ya después de la segunda mitad del embarazo. Y si me

sale mayor o igual a 100, inmediatamente voy y lo repito. Ya no

ocurre eso que si estaba entre 100 o 125 se pedía un TTGO, en el sentido en

que acá con que esté mayor o igual a 100 ya hago el diagnóstico de

diabetes gestacional, así que derechamente voy y se repite.

Ahora, entre las 24 y las 28 semanas se pide un TTGO. En Chile la forma en

que se estudia es con el TTGO simple de 75 gramos, en otros países se

hace a veces con uno de 50 y se confirma con uno de 100 gramos, pero

quedémonos con lo más sencillo, con la de 75 gramos que es más fácil y

más práctico. Y si es que a las dos horas está menor a 140 la poscarga y

menor a 100 la basal, en ese caso yo digo está normal, no hay diabetes

gestacional. Si es que en cambio cualquiera de esos dos valores está o

mayor o igual a 140 o mayor o igual a 100, en el caso de la basal en ese

caso yo digo tiene una diabetes gestacional. O sea, fíjense, se

parece un poco a la de la gente no embarazada, pero no es igual, es

más tendiente hacer directamente el diagnóstico de una diabetes gestacional.

Ahora, el test de tolerancia se hace entre las 24 y las 28 semanas, pero si

tiene algún factor de riesgo que aumente la probabilidad de una

diabetes, ejemplo, viene con un feto grande para la

gestacional o con oligoamnios o con polihidramnios, en particular el

polihidramnios o con una diabetes melito gestacional en un embarazo

antes, en este caso yo derechamente voy a repetir el TTGO a las 33 semanas o en

un rango entre las 32 y 34 semanas y aplico exactamente los mismos valores

de corte para hacer el diagnóstico de diabetes gestacional.

Va a quedar esto más claro con ejemplos, ya vamos a ver distintos

valores de glicemia o del TTGO y vamos a ver qué pasa si la persona

no está embarazada, qué pasa si está embarazada con 8 semanas y qué

pasa si tiene 28 semanas y vamos a ver qué es bastante más complejo de

lo que uno piensa, así que mucho mucho cuidado de leer bien la edad gestacional

también, acuérdense que había una diferencia entre menor de 12 semanas o

mayor de 12 semanas, así que empecemos, tiene una glicemia de

yuno de 105, así de fácil, uno dice está en el caso de que fuera una

persona no embarazada tendría una glicemia de yuno alterada o al menos en

un diagnóstico provisorio de una glicemia de yuno alterada y la conducta

hay que pedirle un TTGO como para ir a ver si es que se confirma este

diagnóstico y ver además si es que hay una intolerancia a la glucosa oral o una

diabetes derechamente si es que me sale mayor a 200, o sea fíjense en

alguien no embarazada hay que pedirle un TTGO, si es que está embarazada en

cambio lo más probable es que tenga una diabetes mellitus gestacional

aunque tenga 8 semanas y sería gestacional porque está menor a

126 está en el rango de prediabetes en el rango de glicemia de yuno alterada

entre 100 y 125 y la conducta sería repetirla acuérdense en el embarazo más

de 100 o 100 o más derechamente se repite así que no hay que pedirle un

TTGO y si es que tuviera 28 semanas y le hago una glicemia de yuno en

primer lugar sería raro porque por el general uno le hace un TTGO a las

28 semanas y no una glicemia de yuno pero si se hiciera tendría

igualmente una diabetes gestacional y la conducta sería repetirlo para

confirmarlo o bien complementarlo con la glicemia poscarga que es lo que se

hace en el TTGO ahora si es que tengo una glicemia de yuno que está en 130

en alguien no embarazada estaría mayor o igual a 126 así que lo más

probable es que tenga una diabetes mellitus y el diagnóstico sería un

diagnóstico provisorio de diabetes mellitus y la conducta es repetirla

para ver si me sale igualmente arriba de 126 confirmo este

diagnóstico de diabetes si es que tiene ocho semanas en este caso estaría

igualmente arriba de 126 estaría en el rango de diagnóstico de diabetes en

alguien no embarazada y en este caso tiene menos de 12 semanas así que el

diagnóstico más probable sería una diabetes mellitus pregestacional y la

conducta sería igualmente repetirlo como si es que me sale nuevamente en

130 se confirma el diagnóstico de diabetes mellitus pregestacional en

cambio si tuviera 28 semanas si es que ya pasaron las 12 semanas el

diagnóstico ya no puede ser pregestacional y sería una diabetes

mellitus gestacional y habría que repetirlo también ya ven es un

poquito más difícil así que mucho mucho cuidado al leerlo en el caso de

que tenga un TTGO de 105 el basal y de 150 a las dos horas pos carga de

75 gramos si no está embarazada uno dice tengo una glicemia de yuno

alterada más una intolerancia a la glucosa oral tengo esas dos cosas y

obviamente es una prediabetes común y corriente pero si es que tiene ocho

semanas nuevamente sería raro haberle pedido un TTGO pero acuérdense en el

embarazo no existe ni la intolerancia a la glucosa oral ni la glicemia de

yuno alterada y el diagnóstico sería derechamente una diabetes mellitus

gestacional y si es que tuviera 28 semanas pues el diagnóstico sería

también una diabetes mellitus gestacional ahora la típica pregunta

es aquí a las ocho semanas por qué no es una diabetes pregestacional si

tienen menos de 12 semanas y la explicación es porque las glicemias no

están dentro de rango de una persona no embarazada está en 105 así que el

diagnóstico es una diabetes gestacional tanto a las 8 como a las

28 semanas por el rango difícil ya así que a revisarlo a

aprenderlo y a tener buena el análisis y el raciocinio al enfrentarse a

los pacientes con diabetes y embarazo que estén muy bien',
    '1
00:00:03,250 --> 00:00:07,330
Hola, hola, ¿cómo están? Algo importante es que el diagnóstico de diabetes en el

2
00:00:07,330 --> 00:00:11,970
embarazo cambia bastante, así que hay que tener mucho cuidado de ver si la

3
00:00:11,970 --> 00:00:15,330
paciente está embarazada o no y de saber diferenciar los criterios de las

4
00:00:15,330 --> 00:00:19,690
personas no embarazadas y de las personas embarazadas. Así que empecemos con este

5
00:00:19,690 --> 00:00:22,370
concepto de diabetes mellitus gestacional, que lo vamos a

6
00:00:22,370 --> 00:00:26,490
contrastar luego con la pregestacional. La diabetes mellitus gestacional es

7
00:00:26,490 --> 00:00:30,450
una mujer que está embarazada y que cumple con alguno de estos criterios.

8
00:00:30,450 --> 00:00:35,570
Número uno, que tenga dos glicemios de ayuno mayor o igual a 100. Ya no es 126, en este

9
00:00:35,570 --> 00:00:39,570
caso es 100. Entonces fíjense, ya no existe la glicemia de ayuno alterada en

10
00:00:39,570 --> 00:00:43,050
el embarazo. Derechamente es una diabetes mellitus gestacional.

11
00:00:43,050 --> 00:00:48,730
Segundo lugar, que tenga un TTGO con 75 gramos que el basal me dé mayor o

12
00:00:48,730 --> 00:00:53,570
igual a 100, o sea, una glicemia de ayuno mayor o igual a 100, o bien que esté

13
00:00:53,570 --> 00:00:58,650
mayor o igual a 140 a las dos horas después de la carga con los 75

14
00:00:58,650 --> 00:01:02,810
gramos. O sea, nuevamente acá no existe el diagnóstico de intolerancia a la

15
00:01:02,810 --> 00:01:06,410
glucosa oral. Derechamente es una diabetes mellitus gestacional. O sea,

16
00:01:06,410 --> 00:01:11,130
fíjense, en el embarazo no hay prediabetes. Derechamente hay diabetes y

17
00:01:11,130 --> 00:01:14,010
la razón de eso es que con esos rangos de glicemia que son

18
00:01:14,010 --> 00:01:17,210
relativamente buenos, al menos para las complicaciones propias de la

19
00:01:17,210 --> 00:01:20,090
diabetes, ya puede haber complicaciones en el feto, en el

20
00:01:20,090 --> 00:01:23,610
embarazo. Así que es importante hacer el diagnóstico y manejarlo.

21
00:01:24,170 --> 00:01:30,570
Finalmente, el mismo criterio de alguien no embarazada, cierto, en el

22
00:01:30,570 --> 00:01:35,130
cual avanzado el embarazo, después de las 12 semanas tenga una glicemia

23
00:01:35,130 --> 00:01:39,050
mayor o igual a 200 más síntomas de diabetes, si bien es bien raro que se

24
00:01:39,050 --> 00:01:42,810
diagnostique una diabetes gestacional por ese criterio. Lo más

25
00:01:42,810 --> 00:01:46,850
frecuente es que sea por alguno de los otros dos. Ahora, ¿cuáles son los

26
00:01:46,850 --> 00:01:51,690
criterios de una diabetes mellitus pregestacional? En este caso es o un

27
00:01:51,690 --> 00:01:54,930
diagnóstico que se hizo antes de embarazarse, un diagnóstico previo, o

28
00:01:54,930 --> 00:01:58,090
bien un diagnóstico que se hace siempre en las primeras semanas, en las

29
00:01:58,090 --> 00:02:01,770
primeras 12 semanas de embarazo. Si se hace después uno ya no puede hablar

30
00:02:01,770 --> 00:02:05,810
de diabetes pregestacional. Ahora, los criterios es o que se hizo el

31
00:02:05,810 --> 00:02:09,890
diagnóstico previo, ese es el primero. El segundo es que tenga las dos

32
00:02:09,890 --> 00:02:13,490
glicemias de ayuno mayor o igual a 126 en las primeras 12 semanas. Y el

33
00:02:13,490 --> 00:02:17,930
último es que tenga una glicemia, ya sea de ayuno o no, mayor o igual a 200

34
00:02:17,930 --> 00:02:20,930
más los síntomas, también dentro de las primeras 12 semanas. O sea, en

35
00:02:20,930 --> 00:02:25,530
resumen, que o se haya diagnosticado antes del embarazo o se diagnostique la

36
00:02:25,530 --> 00:02:29,530
primera parte del embarazo con los criterios para alguien no embarazada.

37
00:02:29,530 --> 00:02:34,890
Repito, para los criterios de alguien no embarazada. Entonces la pregunta que

38
00:02:34,890 --> 00:02:39,450
hay acá es ¿qué pasa si cumple con esos criterios pero los cumple después

39
00:02:39,450 --> 00:02:43,050
de las 12 semanas? Ejemplo, las 30 semanas. En ese caso ya no es una

40
00:02:43,050 --> 00:02:47,730
diabetes mellitus pregestacional, sino que sería una diabetes gestacional.

41
00:02:48,130 --> 00:02:52,450
Veamos, como para que quede un poquito más claro, el screening. El screening en

42
00:02:52,450 --> 00:02:55,450
el embarazo se hace igualmente con una glicemia de ayuno al inicio del

43
00:02:55,450 --> 00:02:59,450
embarazo, así bien temprano en el embarazo. Y si me sale menor a 100, en

44
00:02:59,450 --> 00:03:03,930
ese caso es normal, igual que en las personas no embarazadas, y no se hace

45
00:03:03,930 --> 00:03:07,370
nada más, simplemente lo voy a controlar con un TTGO que se hace

46
00:03:07,370 --> 00:03:11,610
más adelante, ya después de la segunda mitad del embarazo. Y si me

47
00:03:11,610 --> 00:03:15,730
sale mayor o igual a 100, inmediatamente voy y lo repito. Ya no

48
00:03:15,730 --> 00:03:19,810
ocurre eso que si estaba entre 100 o 125 se pedía un TTGO, en el sentido en

49
00:03:19,810 --> 00:03:22,450
que acá con que esté mayor o igual a 100 ya hago el diagnóstico de

50
00:03:22,450 --> 00:03:26,810
diabetes gestacional, así que derechamente voy y se repite.

51
00:03:26,810 --> 00:03:32,330
Ahora, entre las 24 y las 28 semanas se pide un TTGO. En Chile la forma en

52
00:03:32,330 --> 00:03:36,210
que se estudia es con el TTGO simple de 75 gramos, en otros países se

53
00:03:36,210 --> 00:03:39,930
hace a veces con uno de 50 y se confirma con uno de 100 gramos, pero

54
00:03:39,930 --> 00:03:44,170
quedémonos con lo más sencillo, con la de 75 gramos que es más fácil y

55
00:03:44,170 --> 00:03:51,410
más práctico. Y si es que a las dos horas está menor a 140 la poscarga y

56
00:03:51,410 --> 00:03:55,490
menor a 100 la basal, en ese caso yo digo está normal, no hay diabetes

57
00:03:55,490 --> 00:03:59,010
gestacional. Si es que en cambio cualquiera de esos dos valores está o

58
00:03:59,010 --> 00:04:03,290
mayor o igual a 140 o mayor o igual a 100, en el caso de la basal en ese

59
00:04:03,290 --> 00:04:06,650
caso yo digo tiene una diabetes gestacional. O sea, fíjense, se

60
00:04:06,650 --> 00:04:12,850
parece un poco a la de la gente no embarazada, pero no es igual, es

61
00:04:12,850 --> 00:04:16,930
más tendiente hacer directamente el diagnóstico de una diabetes gestacional.

62
00:04:16,930 --> 00:04:22,690
Ahora, el test de tolerancia se hace entre las 24 y las 28 semanas, pero si

63
00:04:22,690 --> 00:04:25,730
tiene algún factor de riesgo que aumente la probabilidad de una

64
00:04:25,730 --> 00:04:28,850
diabetes, ejemplo, viene con un feto grande para la

65
00:04:28,850 --> 00:04:33,530
gestacional o con oligoamnios o con polihidramnios, en particular el

66
00:04:33,530 --> 00:04:37,450
polihidramnios o con una diabetes melito gestacional en un embarazo

67
00:04:37,450 --> 00:04:44,170
antes, en este caso yo derechamente voy a repetir el TTGO a las 33 semanas o en

68
00:04:44,170 --> 00:04:49,010
un rango entre las 32 y 34 semanas y aplico exactamente los mismos valores

69
00:04:49,010 --> 00:04:52,250
de corte para hacer el diagnóstico de diabetes gestacional.

70
00:04:52,250 --> 00:04:56,010
Va a quedar esto más claro con ejemplos, ya vamos a ver distintos

71
00:04:56,010 --> 00:05:00,690
valores de glicemia o del TTGO y vamos a ver qué pasa si la persona

72
00:05:00,690 --> 00:05:04,050
no está embarazada, qué pasa si está embarazada con 8 semanas y qué

73
00:05:04,050 --> 00:05:08,170
pasa si tiene 28 semanas y vamos a ver qué es bastante más complejo de

74
00:05:08,170 --> 00:05:11,530
lo que uno piensa, así que mucho mucho cuidado de leer bien la edad gestacional

75
00:05:11,530 --> 00:05:15,450
también, acuérdense que había una diferencia entre menor de 12 semanas o

76
00:05:15,450 --> 00:05:18,610
mayor de 12 semanas, así que empecemos, tiene una glicemia de

77
00:05:18,610 --> 00:05:23,090
yuno de 105, así de fácil, uno dice está en el caso de que fuera una

78
00:05:23,090 --> 00:05:28,090
persona no embarazada tendría una glicemia de yuno alterada o al menos en

79
00:05:28,090 --> 00:05:31,610
un diagnóstico provisorio de una glicemia de yuno alterada y la conducta

80
00:05:32,050 --> 00:05:35,930
hay que pedirle un TTGO como para ir a ver si es que se confirma este

81
00:05:35,930 --> 00:05:41,810
diagnóstico y ver además si es que hay una intolerancia a la glucosa oral o una

82
00:05:41,810 --> 00:05:45,810
diabetes derechamente si es que me sale mayor a 200, o sea fíjense en

83
00:05:45,810 --> 00:05:50,290
alguien no embarazada hay que pedirle un TTGO, si es que está embarazada en

84
00:05:50,290 --> 00:05:54,530
cambio lo más probable es que tenga una diabetes mellitus gestacional

85
00:05:54,530 --> 00:05:58,730
aunque tenga 8 semanas y sería gestacional porque está menor a

86
00:05:59,650 --> 00:06:02,410
126 está en el rango de prediabetes en el rango de glicemia de yuno alterada

87
00:06:02,410 --> 00:06:07,410
entre 100 y 125 y la conducta sería repetirla acuérdense en el embarazo más

88
00:06:07,410 --> 00:06:11,210
de 100 o 100 o más derechamente se repite así que no hay que pedirle un

89
00:06:11,210 --> 00:06:16,770
TTGO y si es que tuviera 28 semanas y le hago una glicemia de yuno en

90
00:06:16,770 --> 00:06:20,330
primer lugar sería raro porque por el general uno le hace un TTGO a las

91
00:06:20,330 --> 00:06:23,890
28 semanas y no una glicemia de yuno pero si se hiciera tendría

92
00:06:23,890 --> 00:06:27,290
igualmente una diabetes gestacional y la conducta sería repetirlo para

93
00:06:27,290 --> 00:06:32,050
confirmarlo o bien complementarlo con la glicemia poscarga que es lo que se

94
00:06:32,050 --> 00:06:38,010
hace en el TTGO ahora si es que tengo una glicemia de yuno que está en 130

95
00:06:38,010 --> 00:06:42,050
en alguien no embarazada estaría mayor o igual a 126 así que lo más

96
00:06:42,050 --> 00:06:45,490
probable es que tenga una diabetes mellitus y el diagnóstico sería un

97
00:06:45,490 --> 00:06:48,890
diagnóstico provisorio de diabetes mellitus y la conducta es repetirla

98
00:06:48,890 --> 00:06:53,010
para ver si me sale igualmente arriba de 126 confirmo este

99
00:06:53,010 --> 00:06:56,970
diagnóstico de diabetes si es que tiene ocho semanas en este caso estaría

100
00:06:56,970 --> 00:07:01,810
igualmente arriba de 126 estaría en el rango de diagnóstico de diabetes en

101
00:07:01,810 --> 00:07:06,650
alguien no embarazada y en este caso tiene menos de 12 semanas así que el

102
00:07:06,650 --> 00:07:11,530
diagnóstico más probable sería una diabetes mellitus pregestacional y la

103
00:07:11,530 --> 00:07:16,130
conducta sería igualmente repetirlo como si es que me sale nuevamente en

104
00:07:16,130 --> 00:07:19,890
130 se confirma el diagnóstico de diabetes mellitus pregestacional en

105
00:07:19,890 --> 00:07:24,610
cambio si tuviera 28 semanas si es que ya pasaron las 12 semanas el

106
00:07:24,610 --> 00:07:27,330
diagnóstico ya no puede ser pregestacional y sería una diabetes

107
00:07:27,330 --> 00:07:30,610
mellitus gestacional y habría que repetirlo también ya ven es un

108
00:07:30,610 --> 00:07:35,050
poquito más difícil así que mucho mucho cuidado al leerlo en el caso de

109
00:07:35,050 --> 00:07:40,570
que tenga un TTGO de 105 el basal y de 150 a las dos horas pos carga de

110
00:07:40,570 --> 00:07:44,930
75 gramos si no está embarazada uno dice tengo una glicemia de yuno

111
00:07:44,930 --> 00:07:48,930
alterada más una intolerancia a la glucosa oral tengo esas dos cosas y

112
00:07:48,930 --> 00:07:52,890
obviamente es una prediabetes común y corriente pero si es que tiene ocho

113
00:07:52,890 --> 00:07:57,650
semanas nuevamente sería raro haberle pedido un TTGO pero acuérdense en el

114
00:07:57,650 --> 00:08:02,930
embarazo no existe ni la intolerancia a la glucosa oral ni la glicemia de

115
00:08:02,930 --> 00:08:06,050
yuno alterada y el diagnóstico sería derechamente una diabetes mellitus

116
00:08:06,050 --> 00:08:09,570
gestacional y si es que tuviera 28 semanas pues el diagnóstico sería

117
00:08:09,570 --> 00:08:13,290
también una diabetes mellitus gestacional ahora la típica pregunta

118
00:08:13,290 --> 00:08:17,450
es aquí a las ocho semanas por qué no es una diabetes pregestacional si

119
00:08:17,450 --> 00:08:20,970
tienen menos de 12 semanas y la explicación es porque las glicemias no

120
00:08:20,970 --> 00:08:26,210
están dentro de rango de una persona no embarazada está en 105 así que el

121
00:08:26,210 --> 00:08:29,930
diagnóstico es una diabetes gestacional tanto a las 8 como a las

122
00:08:29,930 --> 00:08:35,010
28 semanas por el rango difícil ya así que a revisarlo a

123
00:08:35,010 --> 00:08:39,850
aprenderlo y a tener buena el análisis y el raciocinio al enfrentarse a

124
00:08:39,850 --> 00:08:44,490
los pacientes con diabetes y embarazo que estén muy bien',
    'El diagnóstico de diabetes en el embarazo es uno de los temas que más confusión genera en el EUNACOM, y la razón es simple: los criterios cambian de manera significativa respecto a los de la persona no embarazada. Por ello, lo primero que deben hacer al enfrentar una pregunta sobre glicemia es determinar si la paciente está embarazada o no, y si lo está, en qué semana de gestación se encuentra.

Comencemos con la **diabetes mellitus gestacional**. Esta se define en una mujer embarazada que cumple con cualquiera de los siguientes criterios. El primero: dos glicemias de ayuno iguales o superiores a 100 mg/dL. Noten la diferencia con la población general: en el embarazo el umbral baja de 126 a 100 mg/dL. El segundo criterio es un TTGO de 75 gramos en el que la glicemia basal sea igual o superior a 100 mg/dL, o bien que a las dos horas la post-carga sea igual o superior a 140 mg/dL. El tercer criterio es igual al de la persona no embarazada: una glicemia igual o superior a 200 más síntomas, aunque este caso es menos frecuente.

Un concepto fundamental que deben retener: **en el embarazo no existe la prediabetes**. No hay glicemia de ayuno alterada ni intolerancia a la glucosa oral. Si los valores de glicemia alcanzan esos umbrales, el diagnóstico es directamente diabetes mellitus gestacional. La razón es clínica: con esos niveles de glicemia, que fuera del embarazo serían simplemente preocupantes, ya se pueden generar complicaciones fetales graves. Por ello el umbral diagnóstico es más estricto.',
    '["En el embarazo, la diabetes gestacional se diagnostica con glicemia de ayuno ≥ 100 mg/dL (en dos ocasiones) o post-TTGO a las 2 horas ≥ 140 mg/dL.","En el embarazo no existe prediabetes: si se alcanzan esos umbrales, el diagnóstico es directamente diabetes mellitus gestacional.","La diabetes pregestacional es aquella diagnosticada antes del embarazo o en las primeras 12 semanas usando criterios de persona no embarazada (glicemia ayuno ≥ 126 o cualquier glicemia ≥ 200 con síntomas).","Si el diagnóstico se hace después de las 12 semanas, aunque los valores sean equivalentes a los de una no embarazada, el diagnóstico es diabetes gestacional.","El TTGO se realiza entre semanas 24–28; se adelanta a semanas 32–34 en casos de macrosomía, polihidramnios, oligoamnios o antecedente de diabetes gestacional previa."]'::jsonb,
    '[{"para":"\"En el embarazo todo es más estricto: 100 en vez de 126, 140 en vez de 200\":","nemotecnia":"\"En el embarazo todo es más estricto: 100 en vez de 126, 140 en vez de 200\":","explicacion":"Los umbrales diagnósticos bajan en el embarazo porque el feto no tolera ni siquiera las glicemias que en adultos se consideran prediabetes.\nLos umbrales diagnósticos bajan en el embarazo porque el feto no tolera ni siquiera las glicemias que en adultos se consideran prediabetes."},{"para":"\"12 semanas = la frontera pregestacional\":","nemotecnia":"\"12 semanas = la frontera pregestacional\":","explicacion":"Si el diagnóstico se hace antes de las 12 semanas con criterios estándar, es pregestacional. Después de las 12 semanas, aunque sea idéntico el valor, ya es gestacional.Si el diagnóstico se hace antes de las 12 semanas con criterios estándar, es pregestacional. Después de las 12 semanas, aunque sea idéntico el valor, ya es gestacional."},{"para":"\"En el embarazo no hay zona gris — o es normal o es diabetes\":","nemotecnia":"\"En el embarazo no hay zona gris — o es normal o es diabetes\":","explicacion":"No hay glicemia alterada, no hay intolerancia a la glucosa. El embarazo te obliga a tomar una decisión clara.No hay glicemia alterada, no hay intolerancia a la glucosa. El embarazo te obliga a tomar una decisión clara."}]'::jsonb,
    '["En el embarazo, la diabetes gestacional se diagnostica con glicemia de ayuno ≥ 100 mg/dL (en dos ocasiones) o post-TTGO a las 2 horas ≥ 140 mg/dL.","En el embarazo no existe prediabetes: si se alcanzan esos umbrales, el diagnóstico es directamente diabetes mellitus gestacional.","La diabetes pregestacional es aquella diagnosticada antes del embarazo o en las primeras 12 semanas usando criterios de persona no embarazada (glicemia ayuno ≥ 126 o cualquier glicemia ≥ 200 con síntomas)."]'::jsonb,
    '[]'::jsonb,
    '[{"pregunta":"¿Cuál de las siguientes afirmaciones es correcta?","respuesta":"Respuesta correcta: C — En el embarazo los umbrales diagnósticos son más estrictos y no existe la categoría de prediabetes; una glicemia de ayuno ≥ 100 mg/dL (confirmada) corresponde directamente a diabetes mellitus gestacional."}]'::jsonb,
    NOW(),
    TRUE,
    TRUE  -- first 3 free preview
  ) ON CONFLICT (specialty_id, order_index)
  DO UPDATE SET
    title            = EXCLUDED.title,
    duration_seconds = EXCLUDED.duration_seconds,
    txt_content      = EXCLUDED.txt_content,
    srt_content      = EXCLUDED.srt_content,
    ai_summary       = EXCLUDED.ai_summary,
    ai_key_concepts  = EXCLUDED.ai_key_concepts,
    ai_mnemonics     = EXCLUDED.ai_mnemonics,
    ai_high_yield    = EXCLUDED.ai_high_yield,
    ai_review_qs     = EXCLUDED.ai_review_qs,
    ai_processed_at  = NOW(),
    is_available     = TRUE;

  -- Cápsula 4: Insulinoterapia — Tipos de Insulina, Características y Esquemas de Uso
  INSERT INTO lessons (
    specialty_id, title, order_index, duration_seconds,
    txt_content, srt_content,
    ai_summary, ai_key_concepts, ai_mnemonics,
    ai_high_yield, ai_algorithms, ai_review_qs,
    ai_processed_at, is_available, is_free_preview
  ) VALUES (
    v_specialty_id,
    'Insulinoterapia — Tipos de Insulina, Características y Esquemas de Uso',
    4,
    515,
    'Hablemos de la insulino terapia, al menos las cosas generales, ha avanzado mucho, cada día hay

insulinas más avanzadas, más complejas, así que como médico general es súper importante conocer

cuáles son estas, cómo se ajustan, etcétera. Así que empecemos con algo tan sencillo como los

tipos de insulina. La más frecuente o la más clásica es la insulina cristalina que también

se llama insulina común o insulina regular. En este caso es bastante barata y no solamente

que es barata, sino que tiene una acción muy rápida, habitualmente en 30 minutos ya empieza

a bajar la glicemia y tiene un peak habitualmente una hora y media a tres horas y media después.

La forma en que se administra habitualmente es antes de las comidas y obviamente una vez que

ya me administro mi insulina tengo que comer, de lo contrario voy a hacer una hipoglicemia en

algunos minutos después, pero es antes de desayuno, antes de almuerzo, antes de la cena,

dependiendo obviamente de las glicemias. En segundo lugar está la insulina NPH, que es una de

las insulinas lentas, es una insulina que viene mezclada con protamina y eso hace que se vaya

liberando de manera más lenta en la sangre y también es bastante barata, es buena de hecho,

se puede mezclar con la insulina cristalina, aunque es importante que en la jeringa se ponga

en primer lugar la NPH y luego la cristalina y que inmediatamente se inyecte, dura cerca de 12

horas o sea tiene una vida media bastante más larga y el peak que si lo tiene se logra entre

cuatro o seis horas después, o sea una insulina más lenta que se puede dar una o dos dosis al

día dado que dura 12 horas y eso va a depender de las comidas que esté consumiendo etcétera.

Ahora, aquí vuelvo al puede mezclarse en el sentido en que otras insulinas lentas,

las ultralentas como la insulina glargina por ejemplo, no se puede mezclar con las

insulinas rápidas y en segundo lugar la NPH no solamente se puede mezclar con la cristalina

sino que con algunas de las insulinas ultrarápidas también que las vamos a ver

ahora inmediatamente. Ahora, existen las insulinas ultrarápidas, existen las insulinas

ultralentas. Ambas son unas variantes de la insulina pero con algunas mutaciones

específicas y se hacen mediante tecnología de ADN recombinante y con producción en laboratorio

pero lo importante es que estas mutaciones hacen o que actúe y se absorba más rápido o que

actúe y se absorba y se libere de manera mucho más lenta. En el caso de las ultrarápidas

su efecto fíjense es 15 a 30 minutos después de haberla administrado o sea 15 minutos antes

de la insulina cristalina y tiene un PIC que es uno a tres horas después o sea fíjense media hora

antes que la insulina cristalina. Se dan también antes de las comidas pero como su efecto es más

rápido se puede dar junto con las comidas también y si se dan cuenta la diferencia con

la insulina cristalina no es tan grande así que en la práctica tiene un beneficio

bastante marginal. Ahora, sí me sirven en algunos casos bien específicos como ejemplo en

las bombas de insulina en las bombas de insulina que es algo nuevo que ha avanzado bastante que es

como un especie entre comillas de páncreas artificial desde el punto de vista endocrino en

ese caso se han hecho los estudios y estas máquinas con las insulinas ultrarápidas.

Ahora, las ultralentas hay que saberla está la insulina glargina el de temir y el de

en Chile la que más se usa de esas tres es la insulina glargina por si acaso hay que saber

esos tres nombres a diferencia de las de las ultrarápidas que dan más o menos lo mismo

aunque la más clásica es el lispro pero en el caso de las ultralentas hay que saberla en

particular hay que saber la insulina glargina sepan que duran 24 horas y esta una gran

diferencia con la NPH no tienen un PIC y al no venir con un PIC de acción habitualmente

tienen mucho menos hipoglicemia de hecho son muy infrecuentes las hipoglicemias en las

ultralentas en comparación con la NPH y ahí si habría un beneficio real entre una ultralenta

y una NPH en comparación con las ultrarápidas con la cristalina en que no hay un beneficio

sino marginal. Ahora, ¿qué insulina hay que usar? eso es algo que hay que saber y la

respuesta es depende depende de qué es lo que estemos manejando si que tengo una diabetes

tipo 1 la verdad es que se suele usar un esquema intensificado que se deja una dosis de ultralenta

habitualmente una vez al día aunque se puede dejar igualmente dos veces al día como para

dejarlo óptimo más refuerzos con insulina cristalina o insulina ultrarápida durante las

comidas habitualmente un poco antes de comer ahora la opción actual que ya la mencionamos

recién es la bomba de insulina las bombas de insulina son bien modernas se conectan al

teléfono y van midiendo en tiempo real la glicemia y liberando en tiempo real los

requerimientos de insulina que hay también y en ese caso usan de las insulinas ultrarápidas

y no la insulina cristalina ahora en el caso de la diabetes tipo 2 acuérdense que por el

general se maneja con hipoglicemiantes orales lo vamos a ver más adelante después o sea en

detalle después perdón y en este caso la forma en que se suele iniciar es con una

dosis de NPH en la noche una dosis de NPH nocturna ahora en algunas oportunidades hay

que avanzar a dos dosis una en la mañana y una en la noche una de las alternativas también es

dejar una sola dosis de ultra lenta que es más estable y en el caso de que me esté haciendo

hipoglicemias por ejemplo con las dos dosis pues me paso a una dosis de glargina por

ejemplo y en algunos casos cuando tengo bien controladas las glicemias pre comidas pero más

las pos comidas y esto lo vamos a ver con más detalle después se agregan además refuerzos

con insulina cristalina o con insulina ultrarápida en el caso de la diabetes 2

las ultrarápidas la verdad que no sirven así que no sirven más que la insulina cristalina así

que habitualmente se manejan con insulina cristalina cuando es que hay que indicarlas

que repito lo más frecuente es que solamente sea NPH una dosis y nada más o a lo más dos

dosis pero hay algunos casos en que sí se agrega ahora cuando estoy manejando un

estado hiperglicémico severo así ejemplo una glicemia arriba de 400 o una cetosidosis

diabética o un síndrome hiperglicémico hiperosmolar o sea una complicación hiperglicémica

severa en ese caso se va a manejar habitualmente con insulina cristalina y la forma habitual es

con bolos endovenoso y luego con goteo endovenoso o sea se le da una dosis relativamente

grande y luego queda con un goteo la dosis todas esas cosas las vamos a ver en la

clase respectiva cuando yo tengo un paciente diabético que está hospitalizado ejemplo una

diabetes tipo 2 hospitalizada la forma en que habitualmente se maneja es con insulina

cristalina en este caso en bolos cada seis horas ajustada por hemogluco test o sea repito los

pacientes diabéticos que están graves y que se hospitalizan por la razón que sea habitualmente

se cambia su esquema de lipoglicemiante o de lo que sea que tuvieran antes a insulina

cristalina cada seis horas ahora hay un par de excepciones número uno si es que tiene una

diabetes mellitus 2 y está súper bien y está hospitalizado por una razón totalmente diferente

una descompensación a algo no grave en ese caso lo puedo seguir manejando con los

hipoglicemiantes orales que traía desde antes pero si llega con algo grave en ese caso es con

la insulina cristalina sí o sí segundo lugar si está con una diabetes mellitus 1 la verdad

es que se mantiene su esquema de insulina basal y a eso se le agrega la insulina

cristalina cada seis horas ajustada por hemogluco test y tanto los hipoglicemiantes como la

insulina basal de la diabetes 1 van con un asterisco en el sentido en que hay que ajustarlo

muchas veces los pacientes que se hospitalizan cambian su dieta y de comer más abundante en

la casa van a comer esta comida del hospital cierto que puede ser un poco más hipocalórica

así que muchas veces hay que bajar la dosis en un tercio por ejemplo en algún rango así

y se va ajustando según las glicemias que vaya que vaya teniendo que hay que ir tomándolas

cada seis horas ahora solamente para tener una idea mental de cómo es un esquema intensificado

y que me sirve para entender luego los ajustes de la insulina terapia que vamos a ver después

acuérdense que se da una dosis de insulina gargina de una insulina ultra lenta y luego

de eso se dan estos tres picks con la insulina ultra rápida ya que son lo que

estaría ahí los tres de color azul sería como el pick de la acción de la insulina

ultra rápida o bien la insulina cristalina en el sentido en que recordemos que el esquema

intensificado puede ser con cualquiera de esas dos y bueno esa fue esta clase de ahí

vamos a ir viendo los ajustes que va a quedar un poquito más claro que estén bien',
    '1
00:00:03,470 --> 00:00:08,870
Hablemos de la insulino terapia, al menos las cosas generales, ha avanzado mucho, cada día hay

2
00:00:08,870 --> 00:00:14,830
insulinas más avanzadas, más complejas, así que como médico general es súper importante conocer

3
00:00:14,830 --> 00:00:19,430
cuáles son estas, cómo se ajustan, etcétera. Así que empecemos con algo tan sencillo como los

4
00:00:19,430 --> 00:00:24,950
tipos de insulina. La más frecuente o la más clásica es la insulina cristalina que también

5
00:00:24,950 --> 00:00:31,510
se llama insulina común o insulina regular. En este caso es bastante barata y no solamente

6
00:00:31,510 --> 00:00:36,370
que es barata, sino que tiene una acción muy rápida, habitualmente en 30 minutos ya empieza

7
00:00:36,370 --> 00:00:41,590
a bajar la glicemia y tiene un peak habitualmente una hora y media a tres horas y media después.

8
00:00:41,590 --> 00:00:47,390
La forma en que se administra habitualmente es antes de las comidas y obviamente una vez que

9
00:00:47,390 --> 00:00:51,470
ya me administro mi insulina tengo que comer, de lo contrario voy a hacer una hipoglicemia en

10
00:00:51,470 --> 00:00:56,630
algunos minutos después, pero es antes de desayuno, antes de almuerzo, antes de la cena,

11
00:00:56,630 --> 00:01:02,390
dependiendo obviamente de las glicemias. En segundo lugar está la insulina NPH, que es una de

12
00:01:02,390 --> 00:01:08,110
las insulinas lentas, es una insulina que viene mezclada con protamina y eso hace que se vaya

13
00:01:08,110 --> 00:01:14,270
liberando de manera más lenta en la sangre y también es bastante barata, es buena de hecho,

14
00:01:14,270 --> 00:01:19,710
se puede mezclar con la insulina cristalina, aunque es importante que en la jeringa se ponga

15
00:01:19,710 --> 00:01:26,870
en primer lugar la NPH y luego la cristalina y que inmediatamente se inyecte, dura cerca de 12

16
00:01:26,870 --> 00:01:32,390
horas o sea tiene una vida media bastante más larga y el peak que si lo tiene se logra entre

17
00:01:32,390 --> 00:01:36,830
cuatro o seis horas después, o sea una insulina más lenta que se puede dar una o dos dosis al

18
00:01:36,830 --> 00:01:43,550
día dado que dura 12 horas y eso va a depender de las comidas que esté consumiendo etcétera.

19
00:01:43,550 --> 00:01:49,310
Ahora, aquí vuelvo al puede mezclarse en el sentido en que otras insulinas lentas,

20
00:01:49,310 --> 00:01:52,590
las ultralentas como la insulina glargina por ejemplo, no se puede mezclar con las

21
00:01:52,590 --> 00:01:58,190
insulinas rápidas y en segundo lugar la NPH no solamente se puede mezclar con la cristalina

22
00:01:58,190 --> 00:02:02,030
sino que con algunas de las insulinas ultrarápidas también que las vamos a ver

23
00:02:02,030 --> 00:02:07,190
ahora inmediatamente. Ahora, existen las insulinas ultrarápidas, existen las insulinas

24
00:02:07,190 --> 00:02:14,030
ultralentas. Ambas son unas variantes de la insulina pero con algunas mutaciones

25
00:02:14,030 --> 00:02:20,430
específicas y se hacen mediante tecnología de ADN recombinante y con producción en laboratorio

26
00:02:20,430 --> 00:02:26,310
pero lo importante es que estas mutaciones hacen o que actúe y se absorba más rápido o que

27
00:02:26,310 --> 00:02:30,990
actúe y se absorba y se libere de manera mucho más lenta. En el caso de las ultrarápidas

28
00:02:30,990 --> 00:02:36,830
su efecto fíjense es 15 a 30 minutos después de haberla administrado o sea 15 minutos antes

29
00:02:37,270 --> 00:02:42,030
de la insulina cristalina y tiene un PIC que es uno a tres horas después o sea fíjense media hora

30
00:02:42,030 --> 00:02:49,110
antes que la insulina cristalina. Se dan también antes de las comidas pero como su efecto es más

31
00:02:49,110 --> 00:02:53,550
rápido se puede dar junto con las comidas también y si se dan cuenta la diferencia con

32
00:02:53,550 --> 00:02:57,830
la insulina cristalina no es tan grande así que en la práctica tiene un beneficio

33
00:02:57,830 --> 00:03:02,790
bastante marginal. Ahora, sí me sirven en algunos casos bien específicos como ejemplo en

34
00:03:02,790 --> 00:03:08,430
las bombas de insulina en las bombas de insulina que es algo nuevo que ha avanzado bastante que es

35
00:03:08,430 --> 00:03:13,750
como un especie entre comillas de páncreas artificial desde el punto de vista endocrino en

36
00:03:13,750 --> 00:03:19,190
ese caso se han hecho los estudios y estas máquinas con las insulinas ultrarápidas.

37
00:03:19,190 --> 00:03:27,030
Ahora, las ultralentas hay que saberla está la insulina glargina el de temir y el de

38
00:03:27,630 --> 00:03:32,670
en Chile la que más se usa de esas tres es la insulina glargina por si acaso hay que saber

39
00:03:32,670 --> 00:03:37,470
esos tres nombres a diferencia de las de las ultrarápidas que dan más o menos lo mismo

40
00:03:37,470 --> 00:03:42,990
aunque la más clásica es el lispro pero en el caso de las ultralentas hay que saberla en

41
00:03:42,990 --> 00:03:48,110
particular hay que saber la insulina glargina sepan que duran 24 horas y esta una gran

42
00:03:48,110 --> 00:03:54,030
diferencia con la NPH no tienen un PIC y al no venir con un PIC de acción habitualmente

43
00:03:54,030 --> 00:03:59,510
tienen mucho menos hipoglicemia de hecho son muy infrecuentes las hipoglicemias en las

44
00:03:59,510 --> 00:04:05,030
ultralentas en comparación con la NPH y ahí si habría un beneficio real entre una ultralenta

45
00:04:05,030 --> 00:04:10,030
y una NPH en comparación con las ultrarápidas con la cristalina en que no hay un beneficio

46
00:04:10,030 --> 00:04:14,750
sino marginal. Ahora, ¿qué insulina hay que usar? eso es algo que hay que saber y la

47
00:04:14,750 --> 00:04:18,750
respuesta es depende depende de qué es lo que estemos manejando si que tengo una diabetes

48
00:04:18,750 --> 00:04:26,470
tipo 1 la verdad es que se suele usar un esquema intensificado que se deja una dosis de ultralenta

49
00:04:26,470 --> 00:04:30,350
habitualmente una vez al día aunque se puede dejar igualmente dos veces al día como para

50
00:04:30,350 --> 00:04:37,510
dejarlo óptimo más refuerzos con insulina cristalina o insulina ultrarápida durante las

51
00:04:37,510 --> 00:04:43,230
comidas habitualmente un poco antes de comer ahora la opción actual que ya la mencionamos

52
00:04:43,230 --> 00:04:48,110
recién es la bomba de insulina las bombas de insulina son bien modernas se conectan al

53
00:04:48,110 --> 00:04:52,750
teléfono y van midiendo en tiempo real la glicemia y liberando en tiempo real los

54
00:04:52,750 --> 00:04:57,110
requerimientos de insulina que hay también y en ese caso usan de las insulinas ultrarápidas

55
00:04:57,110 --> 00:05:01,910
y no la insulina cristalina ahora en el caso de la diabetes tipo 2 acuérdense que por el

56
00:05:01,910 --> 00:05:06,590
general se maneja con hipoglicemiantes orales lo vamos a ver más adelante después o sea en

57
00:05:06,590 --> 00:05:10,630
detalle después perdón y en este caso la forma en que se suele iniciar es con una

58
00:05:10,630 --> 00:05:17,190
dosis de NPH en la noche una dosis de NPH nocturna ahora en algunas oportunidades hay

59
00:05:17,230 --> 00:05:22,750
que avanzar a dos dosis una en la mañana y una en la noche una de las alternativas también es

60
00:05:22,750 --> 00:05:27,830
dejar una sola dosis de ultra lenta que es más estable y en el caso de que me esté haciendo

61
00:05:27,830 --> 00:05:32,070
hipoglicemias por ejemplo con las dos dosis pues me paso a una dosis de glargina por

62
00:05:32,070 --> 00:05:37,550
ejemplo y en algunos casos cuando tengo bien controladas las glicemias pre comidas pero más

63
00:05:37,550 --> 00:05:42,390
las pos comidas y esto lo vamos a ver con más detalle después se agregan además refuerzos

64
00:05:42,390 --> 00:05:45,830
con insulina cristalina o con insulina ultrarápida en el caso de la diabetes 2

65
00:05:45,830 --> 00:05:51,030
las ultrarápidas la verdad que no sirven así que no sirven más que la insulina cristalina así

66
00:05:51,030 --> 00:05:55,910
que habitualmente se manejan con insulina cristalina cuando es que hay que indicarlas

67
00:05:55,910 --> 00:06:00,830
que repito lo más frecuente es que solamente sea NPH una dosis y nada más o a lo más dos

68
00:06:00,830 --> 00:06:06,190
dosis pero hay algunos casos en que sí se agrega ahora cuando estoy manejando un

69
00:06:06,190 --> 00:06:11,830
estado hiperglicémico severo así ejemplo una glicemia arriba de 400 o una cetosidosis

70
00:06:11,830 --> 00:06:16,870
diabética o un síndrome hiperglicémico hiperosmolar o sea una complicación hiperglicémica

71
00:06:16,870 --> 00:06:22,390
severa en ese caso se va a manejar habitualmente con insulina cristalina y la forma habitual es

72
00:06:22,390 --> 00:06:29,590
con bolos endovenoso y luego con goteo endovenoso o sea se le da una dosis relativamente

73
00:06:29,590 --> 00:06:33,410
grande y luego queda con un goteo la dosis todas esas cosas las vamos a ver en la

74
00:06:33,410 --> 00:06:39,070
clase respectiva cuando yo tengo un paciente diabético que está hospitalizado ejemplo una

75
00:06:39,070 --> 00:06:42,830
diabetes tipo 2 hospitalizada la forma en que habitualmente se maneja es con insulina

76
00:06:42,830 --> 00:06:48,790
cristalina en este caso en bolos cada seis horas ajustada por hemogluco test o sea repito los

77
00:06:48,790 --> 00:06:53,270
pacientes diabéticos que están graves y que se hospitalizan por la razón que sea habitualmente

78
00:06:53,270 --> 00:06:58,910
se cambia su esquema de lipoglicemiante o de lo que sea que tuvieran antes a insulina

79
00:06:58,910 --> 00:07:03,590
cristalina cada seis horas ahora hay un par de excepciones número uno si es que tiene una

80
00:07:03,590 --> 00:07:09,390
diabetes mellitus 2 y está súper bien y está hospitalizado por una razón totalmente diferente

81
00:07:09,390 --> 00:07:12,950
una descompensación a algo no grave en ese caso lo puedo seguir manejando con los

82
00:07:12,950 --> 00:07:17,630
hipoglicemiantes orales que traía desde antes pero si llega con algo grave en ese caso es con

83
00:07:17,630 --> 00:07:22,670
la insulina cristalina sí o sí segundo lugar si está con una diabetes mellitus 1 la verdad

84
00:07:22,670 --> 00:07:27,430
es que se mantiene su esquema de insulina basal y a eso se le agrega la insulina

85
00:07:27,430 --> 00:07:32,350
cristalina cada seis horas ajustada por hemogluco test y tanto los hipoglicemiantes como la

86
00:07:32,350 --> 00:07:37,190
insulina basal de la diabetes 1 van con un asterisco en el sentido en que hay que ajustarlo

87
00:07:37,190 --> 00:07:44,310
muchas veces los pacientes que se hospitalizan cambian su dieta y de comer más abundante en

88
00:07:44,310 --> 00:07:48,310
la casa van a comer esta comida del hospital cierto que puede ser un poco más hipocalórica

89
00:07:48,310 --> 00:07:53,990
así que muchas veces hay que bajar la dosis en un tercio por ejemplo en algún rango así

90
00:07:53,990 --> 00:08:00,150
y se va ajustando según las glicemias que vaya que vaya teniendo que hay que ir tomándolas

91
00:08:00,150 --> 00:08:06,790
cada seis horas ahora solamente para tener una idea mental de cómo es un esquema intensificado

92
00:08:06,790 --> 00:08:10,350
y que me sirve para entender luego los ajustes de la insulina terapia que vamos a ver después

93
00:08:10,350 --> 00:08:16,990
acuérdense que se da una dosis de insulina gargina de una insulina ultra lenta y luego

94
00:08:16,990 --> 00:08:22,390
de eso se dan estos tres picks con la insulina ultra rápida ya que son lo que

95
00:08:22,390 --> 00:08:27,230
estaría ahí los tres de color azul sería como el pick de la acción de la insulina

96
00:08:27,230 --> 00:08:31,190
ultra rápida o bien la insulina cristalina en el sentido en que recordemos que el esquema

97
00:08:31,190 --> 00:08:35,950
intensificado puede ser con cualquiera de esas dos y bueno esa fue esta clase de ahí

98
00:08:35,950 --> 00:08:38,750
vamos a ir viendo los ajustes que va a quedar un poquito más claro que estén bien',
    'La insulinoterapia ha evolucionado considerablemente en los últimos años. Como médicos generales, es fundamental que conozcan los distintos tipos de insulina disponibles, sus características cinéticas y los esquemas en que se utilizan, tanto en el manejo ambulatorio como en el paciente hospitalizado.

Comencemos con la **insulina cristalina**, también llamada insulina regular o insulina común. Es la insulina clásica por excelencia. Tiene un inicio de acción a los 30 minutos de su administración, un peak de acción entre la hora y media y las tres horas y media, y una duración total de aproximadamente 6 a 8 horas. Se administra subcutáneamente antes de las comidas: el paciente debe comer después de la inyección para evitar una hipoglicemia. Es económica y eficaz, y constituye la base del tratamiento en muchos esquemas.

La **insulina NPH** es una insulina de acción intermedia. Está formulada con protamina, lo que retrasa su absorción y prolonga su efecto hasta aproximadamente 12 horas. Su peak de acción ocurre entre las 4 y 6 horas post-administración. Una ventaja práctica importante: puede mezclarse en la misma jeringa con la insulina cristalina, e incluso con algunas insulinas ultrarápidas. Al mezclarlas, la regla es cargar primero la NPH y luego la cristalina, inyectando de inmediato tras la mezcla. Dado que dura 12 horas, puede administrarse una o dos veces al día según las necesidades del paciente.',
    '["La insulina cristalina tiene inicio a los 30 min y peak a 1,5–3,5 horas; la NPH tiene peak a 4–6 horas y dura 12 horas; las ultralentas duran 24 horas y no tienen peak.","La ausencia de peak de las insulinas ultralentas (glargina, detemir, degludec) se traduce en menor riesgo de hipoglicemia comparado con la NPH.","La insulina glargina NO puede mezclarse con otras insulinas en la misma jeringa; la NPH sí puede mezclarse con cristalina (cargar primero NPH, luego cristalina).","El esquema intensificado para DM1 consiste en una dosis basal de ultralenta más tres bolos preprandiales de insulina cristalina o ultrarápida.","El paciente diabético grave hospitalizado se maneja con insulina cristalina subcutánea cada 6 horas ajustada por hemoglucotest, independientemente de su tratamiento previo."]'::jsonb,
    '[{"para":"\"CRISTALINA = 30 minutos / NPH = 4-6 horas / GLARGINA = sin peak, 24 horas\"","nemotecnia":"\"CRISTALINA = 30 minutos / NPH = 4-6 horas / GLARGINA = sin peak, 24 horas\"","explicacion":"Tres insulinas, tres perfiles: la rápida llega en 30 min, la intermedia tiene peak a las 4-6 horas, la ultralenta no tiene peak y dura todo el día.\nTres insulinas, tres perfiles: la rápida llega en 30 min, la intermedia tiene peak a las 4-6 horas, la ultralenta no tiene peak y dura todo el día."},{"para":"\"NPH mezcla, Glargina NO mezcla\":","nemotecnia":"\"NPH mezcla, Glargina NO mezcla\":","explicacion":"La NPH es sociable, se puede mezclar. La glargina es solitaria: no se mezcla con nada.La NPH es sociable, se puede mezclar. La glargina es solitaria: no se mezcla con nada."},{"para":"\"Hospitalizado grave = Cristalina cada 6 horas\":","nemotecnia":"\"Hospitalizado grave = Cristalina cada 6 horas\":","explicacion":"Cuando el diabético se hospitaliza por algo serio, olviden el esquema que traía: insulina cristalina cada 6 horas ajustada por hemoglucotest es el estándar.Cuando el diabético se hospitaliza por algo serio, olviden el esquema que traía: insulina cristalina cada 6 horas ajustada por hemoglucotest es el estándar."}]'::jsonb,
    '["La insulina cristalina tiene inicio a los 30 min y peak a 1,5–3,5 horas; la NPH tiene peak a 4–6 horas y dura 12 horas; las ultralentas duran 24 horas y no tienen peak.","La ausencia de peak de las insulinas ultralentas (glargina, detemir, degludec) se traduce en menor riesgo de hipoglicemia comparado con la NPH.","La insulina glargina NO puede mezclarse con otras insulinas en la misma jeringa; la NPH sí puede mezclarse con cristalina (cargar primero NPH, luego cristalina)."]'::jsonb,
    '[]'::jsonb,
    '[{"pregunta":"¿Cuál de las siguientes afirmaciones sobre insulinoterapia es correcta?","respuesta":"Respuesta correcta: C — La insulina glargina, al carecer de peak de acción y tener duración de 24 horas, genera menos hipoglicemias que la NPH, cuyo peak a las 4–6 horas es el principal responsable de los episodios hipoglicémicos."}]'::jsonb,
    NOW(),
    TRUE,
    FALSE  -- first 3 free preview
  ) ON CONFLICT (specialty_id, order_index)
  DO UPDATE SET
    title            = EXCLUDED.title,
    duration_seconds = EXCLUDED.duration_seconds,
    txt_content      = EXCLUDED.txt_content,
    srt_content      = EXCLUDED.srt_content,
    ai_summary       = EXCLUDED.ai_summary,
    ai_key_concepts  = EXCLUDED.ai_key_concepts,
    ai_mnemonics     = EXCLUDED.ai_mnemonics,
    ai_high_yield    = EXCLUDED.ai_high_yield,
    ai_review_qs     = EXCLUDED.ai_review_qs,
    ai_processed_at  = NOW(),
    is_available     = TRUE;

  -- Cápsula 5: Ajustes de Insulinoterapia — Lógica Clínica y Casos Prácticos
  INSERT INTO lessons (
    specialty_id, title, order_index, duration_seconds,
    txt_content, srt_content,
    ai_summary, ai_key_concepts, ai_mnemonics,
    ai_high_yield, ai_algorithms, ai_review_qs,
    ai_processed_at, is_available, is_free_preview
  ) VALUES (
    v_specialty_id,
    'Ajustes de Insulinoterapia — Lógica Clínica y Casos Prácticos',
    5,
    553,
    'En este vídeo vamos a ver cómo ajustar la insulina terapia. Vamos a hacer hartos

ejercicios así que va a quedar clarísimo y empecemos al tiro con

algunos conceptos. Cuando el paciente hace mucha hipoglicemia, en ese caso o le

bajo la insulina o le agrego comida, son las dos formas de subir un poquito la

glucosa en la sangre. Si es que me hace en cambio hiperglicemia, que lo voy a

ver no por la hiperglicemia que no importa mucho una hiperglicemia

aislada, sino que por la hemoglobina licosilada que está alta, en ese

caso o le subo la insulina que es lo más frecuente o le bajo la

comida también. Y hay que acordarse aquí de un concepto que es que el

costo de un buen control metabólico en una diabetes son por un lado las

hipoglicemias y por otro lado el alza de peso. La insulina y los

hipoglicemiantes hacen que las personas suban de peso y aparte

tienen riesgos de hipoglicemia. Y es más, se dice una persona

diabética bien controlada va a tener al menos una hipoglicemia más o

menos importante en el año y puede que esto sea más, pero lo importante

de saber ajustar el tratamiento y los fármacos es justamente minimizar

estos riesgos tanto el de la hipoglicemia como el del alza de peso.

Ahora, para saber cómo ajustarlo lo importante es acordarse que la

insulina NPH, que es la insulina lenta y las insulinas ultra

lentas lo que determinan son las lisemias pre-prandiales, pero no

la inmediata, sino que la que va a medirse varias horas después.

Ejemplo, la NPH nocturna me determina la lisemia pre-desayuno y la

NPH de la mañana me determina la lisemia pre-almuerzo y la

precena. Y ahí espero que con eso quede más o menos claro.

En cambio, las insulinas rápidas como la insulina cristalina o las

ultrarápidas me determinan las lisemias post-prandiales, las

que son después de comer, habitualmente dos horas después de

comer. Algo importante es que esta lisemia post-prandial también

está determinada por la pre-prandial, o sea, si antes de

comer estaba con 500 de lisemia, no se le puede pedir que la

post-prandial esté normal, va a estar súper elevada también.

Y también dependen de la comida, en el sentido en que si se

come una ensalada va a subir un poquito, en cambio si se come

un pay de limón entero, obviamente eso va a subir mucho

más. Entonces, que quede bien claro de qué dependen las

pre-prandiales de las insulinas lentas y de qué dependen

las post-prandiales de las insulinas rápidas, de la

comida y de la lisemia pre-prandial también.

Ahora vamos con los casos y ahí va a quedar súper claro con

estos ejemplos, son varios ejemplos, así que espero de

verdad que quede claro. En caso uno es un diabético tipo uno

que está con un esquema intensificado, o sea, con una

ultra lenta más tres refuerzos de rápida,

ultrarápida, y me dan estas lisemias.

Y aparte de darme esas lisemias me dicen que está

con una hemoglobina glicosilada de 8%, o sea, hasta

arriba del 7%, está mal controlado y hay que ver cuáles

son las lisemias que están malas acá, y las que uno ve

malas son esas dos, la post de desayuno que está en 250,

está arriba de 180 o arriba de 130 según el corte que uno

dé, pero quedémonos aquí con 180 y la post almuerzo que

está en 190. O sea, en este caso tenemos solamente

dos lisemias post comida que están malas, así que lo

que hay que hacer es subirle la insulina rápida de ese

momento, la insulina cristalina pre-desayuno y pre-almuerzo

porque esas son las que me determinan las lisemias

post desayuno y post almuerzo. ¿Quedó claro? Vamos con el

caso dos. Diabético tipo 1, igualmente con esquema

intensificado, me dan esas lisemias y me dice que

tiene una hemoglobina A1C de 8%, o sea, está mal

controlado igualmente y acá tiene varias cosas que

están malas, están todas relativamente malas en el

sentido en que están las basales arriba de 100,

130 y las poscargas arriba de 180 o de 130,

de 180, eso lo vamos a ver después cuál es el

óptimo que lo más importante es la hemoglobina

glicosilada por ese caso, pero en este caso está todo

alto y lo que hay que hacer es arreglar en primer

lugar las pre comidas, así que dígase, súbale la

insulina ultra lenta, súbale la gargina y una vez

que se hayan arreglado las pre comidas, lo más

probable es que se arreglen las post comidas también

y si no se arreglan, pues ahí recién le ajustamos

la dosis de las insulinas rápidas, pero en este

caso por estar malas las basales, en ese caso lo

que hay que hacer es aumentar la dosis de la

insulina ultra lenta. El caso 3, diabético tipo 2

que solamente tiene una NPH nocturna, nada más y

está con estas glicemias y está con esa hemoglobina

glicosilada que está arriba de 7%, así que hay

que asumir que está mal controlado y en este

caso veo que las que están altas son

justamente la pre desayuno y la post desayuno,

o sea la pre y post prandial de la mañana, en

este caso la pre desayuno dependía de la NPH

nocturna, entonces aquí está con NPH nocturna,

pues le falta, hay que subirle la dosis de la

NPH nocturna y con eso seguramente se va a

arreglar también la glicemia post desayuno.

Vamos con el caso 4, espero que esté quedando

claro porque esto es importante, la diabetes

tipo 2 con dos dosis de NPH, así que tiene una

en la mañana y otra en la tarde y me dice que

está con esas glicemias y que está con la

hemoglobina glicosilada que está elevada, está

arriba de 7%, así que hay que ver qué es lo

que está elevado acá y lo alto son las

pre comidas y las post comidas del almuerzo

y de la cena, o sea la pre almuerzo y pre

cena de qué dependía, de la NPH de la

mañana, así que lo que hay que hacer es

elevar la dosis de la NPH de la mañana y

con eso seguramente se va a arreglar también

las post almuerzo y post cena, ahí queda más

claro. Vamos con el caso 5, diabetes tipo 1

que está con esquema intensificado, o sea

está con la alergina más las tres dosis de

rápida o ultra rápida, me dan esas glicemias

que están ahí, está bien controlado en el

sentido en que está con una hemoglobina

glicosilada menor a 7%, está en 6% y

además tiene buen peso, en este caso lo

que tiene son que antes del almuerzo, en

el pre almuerzo está con glicemias muy

bajitas en torno a 60 y aparte de eso

está con síntomas de hipoglicemia, uno

dice bueno tengo dos opciones, o le doy

un snack y le doy como una colación en

buen chileno, cierto, antes del almuerzo

como para que no llegue con la

glicemia tan baja en la mitad de la

mañana, ejemplo a las 11 a las 11

de la mañana, 11 y media de la

mañana según la hora a la que

almuerce, o bien podría también

bajarle la dosis de NPH de la

mañana o en el caso de que esté

con glargina, bajarle la glargina, pero

en este caso que está todo bien y que

está con buen peso, lo más fácil

seguramente va a ser darle un snack,

así que la respuesta es esa, en el

caso 5 que está con diabetes tipo 2

con dos dosis de NPH igualmente y que

está con esas glicemias que se ven

ahí y está con una hemoglobina que

está en 6,5%, uno dice ahí está

todo bien desde el punto de vista del

control metabólico, tengo un

poquito baja la NPH de, o sea la

la pre-desayuno, la glicemia de

ayuno que está determinada por la

NPH nocturna, en este caso yo podría

bajarle un poquito la NPH nocturna en

el sentido en que no lo voy a

despertar una hora antes como para

que se coma algo, y como está bien

controlado no hay ningún problema en

bajarle un poquito su insulina, la

otra opción sería el despertarlo en

la mitad de la noche como para que

coma algo, pero es absolutamente

impractico, así que lo correcto acá

que está bien controlado y que por

lo tanto no hay ningún problema en

bajarle un par de unidades la NPH

se baja nomás. Vamos con el penúltimo

caso, es un diabético de 80 años

acuérdense que a los 80 años el

objetivo de la hemoglobina

glicosilada ya no es 7% sino que es

menor a 8% y está en este caso con

dos dosis de NPH, me dan esas

glicemias, me dicen que está bien

controlado en el sentido en que está

con una hemoglobina glicosilada de

7,5%, está con hartas glicemias que

están altas, que no están dentro del

rango óptimo que están todas elevadas

pero lo que manda acá es la hemoglobina

glicosilada que está en 7,5% que

para los 80 años está impecable así

que lo que hago es no hacer

absolutamente ningún cambio, le digo

estamos bien, nos quedamos con esas

dosis de insulina NPH sin variarlas.

En el caso 8 me dicen un diabético

de 60 años que está igualmente con

dos dosis de NPH, en este caso me

dan esas glicemias, me dicen que está

con 8,5% de la hemoglobina glicosilada,

o sea está mal controlado, en este

caso tengo que hacerle algún ajuste y

las glicemias que están malas son la

post almuerzo y la post cena pero

fíjense que las precomidas, las tres

precomidas están buenas así que en

este caso no hay que cambiar las

dosis de NPH sino que hay que subirle

o agregarle en este caso la

insulina cristalina pre almuerzo y

pre cena. Y eso fue el último caso,

si no les quedó claro revíselo, esto es

importante y se preguntan bastante las

pruebas así que mucha suerte en

entenderlo y en aprender a ajustar la

insulina. Que estén bien.',
    '1
00:00:03,220 --> 00:00:07,180
En este vídeo vamos a ver cómo ajustar la insulina terapia. Vamos a hacer hartos

2
00:00:07,180 --> 00:00:10,620
ejercicios así que va a quedar clarísimo y empecemos al tiro con

3
00:00:10,620 --> 00:00:15,700
algunos conceptos. Cuando el paciente hace mucha hipoglicemia, en ese caso o le

4
00:00:15,700 --> 00:00:20,140
bajo la insulina o le agrego comida, son las dos formas de subir un poquito la

5
00:00:20,140 --> 00:00:23,940
glucosa en la sangre. Si es que me hace en cambio hiperglicemia, que lo voy a

6
00:00:23,940 --> 00:00:26,700
ver no por la hiperglicemia que no importa mucho una hiperglicemia

7
00:00:26,700 --> 00:00:30,060
aislada, sino que por la hemoglobina licosilada que está alta, en ese

8
00:00:30,060 --> 00:00:32,740
caso o le subo la insulina que es lo más frecuente o le bajo la

9
00:00:32,740 --> 00:00:37,220
comida también. Y hay que acordarse aquí de un concepto que es que el

10
00:00:37,220 --> 00:00:41,500
costo de un buen control metabólico en una diabetes son por un lado las

11
00:00:41,500 --> 00:00:46,460
hipoglicemias y por otro lado el alza de peso. La insulina y los

12
00:00:46,460 --> 00:00:49,100
hipoglicemiantes hacen que las personas suban de peso y aparte

13
00:00:49,100 --> 00:00:53,860
tienen riesgos de hipoglicemia. Y es más, se dice una persona

14
00:00:53,860 --> 00:00:58,460
diabética bien controlada va a tener al menos una hipoglicemia más o

15
00:00:58,460 --> 00:01:02,060
menos importante en el año y puede que esto sea más, pero lo importante

16
00:01:02,220 --> 00:01:06,940
de saber ajustar el tratamiento y los fármacos es justamente minimizar

17
00:01:07,220 --> 00:01:10,020
estos riesgos tanto el de la hipoglicemia como el del alza de peso.

18
00:01:10,540 --> 00:01:15,180
Ahora, para saber cómo ajustarlo lo importante es acordarse que la

19
00:01:15,180 --> 00:01:19,460
insulina NPH, que es la insulina lenta y las insulinas ultra

20
00:01:19,460 --> 00:01:24,020
lentas lo que determinan son las lisemias pre-prandiales, pero no

21
00:01:24,020 --> 00:01:29,020
la inmediata, sino que la que va a medirse varias horas después.

22
00:01:29,060 --> 00:01:34,500
Ejemplo, la NPH nocturna me determina la lisemia pre-desayuno y la

23
00:01:34,500 --> 00:01:38,740
NPH de la mañana me determina la lisemia pre-almuerzo y la

24
00:01:38,740 --> 00:01:41,700
precena. Y ahí espero que con eso quede más o menos claro.

25
00:01:42,180 --> 00:01:46,100
En cambio, las insulinas rápidas como la insulina cristalina o las

26
00:01:46,100 --> 00:01:49,900
ultrarápidas me determinan las lisemias post-prandiales, las

27
00:01:49,900 --> 00:01:53,180
que son después de comer, habitualmente dos horas después de

28
00:01:53,180 --> 00:01:56,980
comer. Algo importante es que esta lisemia post-prandial también

29
00:01:57,020 --> 00:02:00,260
está determinada por la pre-prandial, o sea, si antes de

30
00:02:00,260 --> 00:02:04,460
comer estaba con 500 de lisemia, no se le puede pedir que la

31
00:02:04,460 --> 00:02:06,660
post-prandial esté normal, va a estar súper elevada también.

32
00:02:07,060 --> 00:02:09,460
Y también dependen de la comida, en el sentido en que si se

33
00:02:09,460 --> 00:02:12,100
come una ensalada va a subir un poquito, en cambio si se come

34
00:02:12,100 --> 00:02:14,820
un pay de limón entero, obviamente eso va a subir mucho

35
00:02:14,820 --> 00:02:18,700
más. Entonces, que quede bien claro de qué dependen las

36
00:02:18,700 --> 00:02:22,500
pre-prandiales de las insulinas lentas y de qué dependen

37
00:02:22,500 --> 00:02:25,060
las post-prandiales de las insulinas rápidas, de la

38
00:02:25,100 --> 00:02:28,020
comida y de la lisemia pre-prandial también.

39
00:02:28,620 --> 00:02:31,740
Ahora vamos con los casos y ahí va a quedar súper claro con

40
00:02:31,780 --> 00:02:34,740
estos ejemplos, son varios ejemplos, así que espero de

41
00:02:34,740 --> 00:02:38,300
verdad que quede claro. En caso uno es un diabético tipo uno

42
00:02:38,300 --> 00:02:40,380
que está con un esquema intensificado, o sea, con una

43
00:02:40,380 --> 00:02:42,580
ultra lenta más tres refuerzos de rápida,

44
00:02:42,580 --> 00:02:45,460
ultrarápida, y me dan estas lisemias.

45
00:02:45,540 --> 00:02:47,700
Y aparte de darme esas lisemias me dicen que está

46
00:02:47,700 --> 00:02:50,180
con una hemoglobina glicosilada de 8%, o sea, hasta

47
00:02:50,180 --> 00:02:53,500
arriba del 7%, está mal controlado y hay que ver cuáles

48
00:02:53,500 --> 00:02:55,660
son las lisemias que están malas acá, y las que uno ve

49
00:02:55,660 --> 00:02:59,940
malas son esas dos, la post de desayuno que está en 250,

50
00:02:59,940 --> 00:03:04,180
está arriba de 180 o arriba de 130 según el corte que uno

51
00:03:04,180 --> 00:03:07,940
dé, pero quedémonos aquí con 180 y la post almuerzo que

52
00:03:07,940 --> 00:03:11,220
está en 190. O sea, en este caso tenemos solamente

53
00:03:11,220 --> 00:03:14,620
dos lisemias post comida que están malas, así que lo

54
00:03:14,620 --> 00:03:18,780
que hay que hacer es subirle la insulina rápida de ese

55
00:03:18,780 --> 00:03:21,980
momento, la insulina cristalina pre-desayuno y pre-almuerzo

56
00:03:21,980 --> 00:03:24,140
porque esas son las que me determinan las lisemias

57
00:03:24,140 --> 00:03:26,860
post desayuno y post almuerzo. ¿Quedó claro? Vamos con el

58
00:03:26,860 --> 00:03:30,140
caso dos. Diabético tipo 1, igualmente con esquema

59
00:03:30,140 --> 00:03:33,460
intensificado, me dan esas lisemias y me dice que

60
00:03:33,460 --> 00:03:38,140
tiene una hemoglobina A1C de 8%, o sea, está mal

61
00:03:38,140 --> 00:03:41,060
controlado igualmente y acá tiene varias cosas que

62
00:03:41,060 --> 00:03:43,900
están malas, están todas relativamente malas en el

63
00:03:43,900 --> 00:03:46,100
sentido en que están las basales arriba de 100,

64
00:03:46,100 --> 00:03:50,420
130 y las poscargas arriba de 180 o de 130,

65
00:03:50,420 --> 00:03:52,900
de 180, eso lo vamos a ver después cuál es el

66
00:03:52,900 --> 00:03:55,380
óptimo que lo más importante es la hemoglobina

67
00:03:55,380 --> 00:03:58,260
glicosilada por ese caso, pero en este caso está todo

68
00:03:58,260 --> 00:04:01,260
alto y lo que hay que hacer es arreglar en primer

69
00:04:01,260 --> 00:04:04,820
lugar las pre comidas, así que dígase, súbale la

70
00:04:04,820 --> 00:04:07,980
insulina ultra lenta, súbale la gargina y una vez

71
00:04:07,980 --> 00:04:09,700
que se hayan arreglado las pre comidas, lo más

72
00:04:09,700 --> 00:04:11,580
probable es que se arreglen las post comidas también

73
00:04:11,580 --> 00:04:14,980
y si no se arreglan, pues ahí recién le ajustamos

74
00:04:14,980 --> 00:04:19,340
la dosis de las insulinas rápidas, pero en este

75
00:04:19,340 --> 00:04:22,620
caso por estar malas las basales, en ese caso lo

76
00:04:22,620 --> 00:04:24,900
que hay que hacer es aumentar la dosis de la

77
00:04:24,900 --> 00:04:28,380
insulina ultra lenta. El caso 3, diabético tipo 2

78
00:04:28,380 --> 00:04:31,940
que solamente tiene una NPH nocturna, nada más y

79
00:04:31,940 --> 00:04:35,660
está con estas glicemias y está con esa hemoglobina

80
00:04:35,660 --> 00:04:38,620
glicosilada que está arriba de 7%, así que hay

81
00:04:38,620 --> 00:04:41,060
que asumir que está mal controlado y en este

82
00:04:41,060 --> 00:04:42,620
caso veo que las que están altas son

83
00:04:42,620 --> 00:04:47,300
justamente la pre desayuno y la post desayuno,

84
00:04:47,300 --> 00:04:50,980
o sea la pre y post prandial de la mañana, en

85
00:04:50,980 --> 00:04:54,100
este caso la pre desayuno dependía de la NPH

86
00:04:54,100 --> 00:04:56,980
nocturna, entonces aquí está con NPH nocturna,

87
00:04:56,980 --> 00:04:59,260
pues le falta, hay que subirle la dosis de la

88
00:04:59,260 --> 00:05:02,220
NPH nocturna y con eso seguramente se va a

89
00:05:02,220 --> 00:05:06,900
arreglar también la glicemia post desayuno.

90
00:05:06,900 --> 00:05:09,340
Vamos con el caso 4, espero que esté quedando

91
00:05:09,340 --> 00:05:12,460
claro porque esto es importante, la diabetes

92
00:05:12,460 --> 00:05:16,180
tipo 2 con dos dosis de NPH, así que tiene una

93
00:05:16,180 --> 00:05:19,700
en la mañana y otra en la tarde y me dice que

94
00:05:19,700 --> 00:05:22,180
está con esas glicemias y que está con la

95
00:05:22,180 --> 00:05:24,700
hemoglobina glicosilada que está elevada, está

96
00:05:24,700 --> 00:05:27,020
arriba de 7%, así que hay que ver qué es lo

97
00:05:27,020 --> 00:05:29,460
que está elevado acá y lo alto son las

98
00:05:29,460 --> 00:05:33,100
pre comidas y las post comidas del almuerzo

99
00:05:33,100 --> 00:05:36,340
y de la cena, o sea la pre almuerzo y pre

100
00:05:36,340 --> 00:05:38,380
cena de qué dependía, de la NPH de la

101
00:05:38,380 --> 00:05:39,740
mañana, así que lo que hay que hacer es

102
00:05:39,740 --> 00:05:42,060
elevar la dosis de la NPH de la mañana y

103
00:05:42,060 --> 00:05:44,740
con eso seguramente se va a arreglar también

104
00:05:44,780 --> 00:05:48,180
las post almuerzo y post cena, ahí queda más

105
00:05:48,180 --> 00:05:50,780
claro. Vamos con el caso 5, diabetes tipo 1

106
00:05:50,780 --> 00:05:52,980
que está con esquema intensificado, o sea

107
00:05:52,980 --> 00:05:54,980
está con la alergina más las tres dosis de

108
00:05:54,980 --> 00:05:58,620
rápida o ultra rápida, me dan esas glicemias

109
00:05:58,620 --> 00:06:00,860
que están ahí, está bien controlado en el

110
00:06:00,860 --> 00:06:02,900
sentido en que está con una hemoglobina

111
00:06:02,900 --> 00:06:05,340
glicosilada menor a 7%, está en 6% y

112
00:06:05,340 --> 00:06:08,460
además tiene buen peso, en este caso lo

113
00:06:08,460 --> 00:06:11,860
que tiene son que antes del almuerzo, en

114
00:06:11,860 --> 00:06:13,820
el pre almuerzo está con glicemias muy

115
00:06:13,820 --> 00:06:16,180
bajitas en torno a 60 y aparte de eso

116
00:06:16,180 --> 00:06:17,820
está con síntomas de hipoglicemia, uno

117
00:06:17,820 --> 00:06:20,540
dice bueno tengo dos opciones, o le doy

118
00:06:20,540 --> 00:06:25,820
un snack y le doy como una colación en

119
00:06:25,820 --> 00:06:28,820
buen chileno, cierto, antes del almuerzo

120
00:06:28,820 --> 00:06:29,900
como para que no llegue con la

121
00:06:29,900 --> 00:06:31,420
glicemia tan baja en la mitad de la

122
00:06:31,420 --> 00:06:33,260
mañana, ejemplo a las 11 a las 11

123
00:06:33,260 --> 00:06:34,340
de la mañana, 11 y media de la

124
00:06:34,340 --> 00:06:36,020
mañana según la hora a la que

125
00:06:36,020 --> 00:06:38,180
almuerce, o bien podría también

126
00:06:38,180 --> 00:06:40,820
bajarle la dosis de NPH de la

127
00:06:40,820 --> 00:06:42,660
mañana o en el caso de que esté

128
00:06:42,660 --> 00:06:44,620
con glargina, bajarle la glargina, pero

129
00:06:44,620 --> 00:06:46,340
en este caso que está todo bien y que

130
00:06:46,340 --> 00:06:47,860
está con buen peso, lo más fácil

131
00:06:47,860 --> 00:06:49,780
seguramente va a ser darle un snack,

132
00:06:49,780 --> 00:06:52,180
así que la respuesta es esa, en el

133
00:06:52,180 --> 00:06:54,300
caso 5 que está con diabetes tipo 2

134
00:06:54,300 --> 00:06:56,900
con dos dosis de NPH igualmente y que

135
00:06:56,900 --> 00:06:58,620
está con esas glicemias que se ven

136
00:06:58,620 --> 00:07:01,620
ahí y está con una hemoglobina que

137
00:07:01,620 --> 00:07:04,340
está en 6,5%, uno dice ahí está

138
00:07:04,340 --> 00:07:07,260
todo bien desde el punto de vista del

139
00:07:07,260 --> 00:07:08,980
control metabólico, tengo un

140
00:07:08,980 --> 00:07:12,540
poquito baja la NPH de, o sea la

141
00:07:13,100 --> 00:07:15,580
la pre-desayuno, la glicemia de

142
00:07:15,580 --> 00:07:17,580
ayuno que está determinada por la

143
00:07:17,580 --> 00:07:20,300
NPH nocturna, en este caso yo podría

144
00:07:20,300 --> 00:07:22,500
bajarle un poquito la NPH nocturna en

145
00:07:22,500 --> 00:07:24,140
el sentido en que no lo voy a

146
00:07:24,140 --> 00:07:25,540
despertar una hora antes como para

147
00:07:25,540 --> 00:07:27,380
que se coma algo, y como está bien

148
00:07:27,380 --> 00:07:28,820
controlado no hay ningún problema en

149
00:07:28,820 --> 00:07:31,260
bajarle un poquito su insulina, la

150
00:07:31,260 --> 00:07:35,260
otra opción sería el despertarlo en

151
00:07:35,260 --> 00:07:36,260
la mitad de la noche como para que

152
00:07:36,260 --> 00:07:37,260
coma algo, pero es absolutamente

153
00:07:37,260 --> 00:07:39,060
impractico, así que lo correcto acá

154
00:07:39,060 --> 00:07:40,460
que está bien controlado y que por

155
00:07:40,460 --> 00:07:42,420
lo tanto no hay ningún problema en

156
00:07:42,420 --> 00:07:44,980
bajarle un par de unidades la NPH

157
00:07:44,980 --> 00:07:48,060
se baja nomás. Vamos con el penúltimo

158
00:07:48,060 --> 00:07:50,180
caso, es un diabético de 80 años

159
00:07:50,180 --> 00:07:52,060
acuérdense que a los 80 años el

160
00:07:52,060 --> 00:07:54,140
objetivo de la hemoglobina

161
00:07:54,140 --> 00:07:56,540
glicosilada ya no es 7% sino que es

162
00:07:56,540 --> 00:07:58,860
menor a 8% y está en este caso con

163
00:07:58,860 --> 00:08:01,140
dos dosis de NPH, me dan esas

164
00:08:01,140 --> 00:08:03,060
glicemias, me dicen que está bien

165
00:08:03,060 --> 00:08:04,580
controlado en el sentido en que está

166
00:08:04,580 --> 00:08:06,980
con una hemoglobina glicosilada de

167
00:08:06,980 --> 00:08:09,980
7,5%, está con hartas glicemias que

168
00:08:09,980 --> 00:08:11,980
están altas, que no están dentro del

169
00:08:11,980 --> 00:08:13,780
rango óptimo que están todas elevadas

170
00:08:13,780 --> 00:08:17,020
pero lo que manda acá es la hemoglobina

171
00:08:17,020 --> 00:08:19,300
glicosilada que está en 7,5% que

172
00:08:19,300 --> 00:08:21,620
para los 80 años está impecable así

173
00:08:21,620 --> 00:08:22,780
que lo que hago es no hacer

174
00:08:22,780 --> 00:08:24,540
absolutamente ningún cambio, le digo

175
00:08:24,540 --> 00:08:26,900
estamos bien, nos quedamos con esas

176
00:08:26,900 --> 00:08:29,060
dosis de insulina NPH sin variarlas.

177
00:08:29,060 --> 00:08:31,860
En el caso 8 me dicen un diabético

178
00:08:31,860 --> 00:08:33,500
de 60 años que está igualmente con

179
00:08:33,500 --> 00:08:36,020
dos dosis de NPH, en este caso me

180
00:08:36,020 --> 00:08:37,940
dan esas glicemias, me dicen que está

181
00:08:37,980 --> 00:08:42,780
con 8,5% de la hemoglobina glicosilada,

182
00:08:42,780 --> 00:08:44,780
o sea está mal controlado, en este

183
00:08:44,780 --> 00:08:46,940
caso tengo que hacerle algún ajuste y

184
00:08:46,940 --> 00:08:48,260
las glicemias que están malas son la

185
00:08:48,260 --> 00:08:50,420
post almuerzo y la post cena pero

186
00:08:50,420 --> 00:08:52,700
fíjense que las precomidas, las tres

187
00:08:52,700 --> 00:08:54,820
precomidas están buenas así que en

188
00:08:54,820 --> 00:08:56,620
este caso no hay que cambiar las

189
00:08:56,620 --> 00:08:58,820
dosis de NPH sino que hay que subirle

190
00:08:58,820 --> 00:09:00,900
o agregarle en este caso la

191
00:09:00,900 --> 00:09:03,300
insulina cristalina pre almuerzo y

192
00:09:03,300 --> 00:09:05,780
pre cena. Y eso fue el último caso,

193
00:09:06,140 --> 00:09:08,660
si no les quedó claro revíselo, esto es

194
00:09:08,660 --> 00:09:10,420
importante y se preguntan bastante las

195
00:09:10,420 --> 00:09:12,260
pruebas así que mucha suerte en

196
00:09:12,260 --> 00:09:13,980
entenderlo y en aprender a ajustar la

197
00:09:13,980 --> 00:09:16,820
insulina. Que estén bien.',
    'Saber ajustar la insulinoterapia es una habilidad clínica esencial y uno de los temas que con mayor frecuencia aparece en el EUNACOM. La buena noticia es que tiene una lógica interna muy clara: si la entienden, no necesitan memorizar cada caso por separado.

Partamos por el principio básico: cuando un paciente diabético hace hipoglicemias frecuentes, la conducta es bajarle la dosis de insulina o, como alternativa, agregarle una colación en el momento en que la hipoglicemia ocurre. A la inversa, cuando el control metabólico es insuficiente —medido principalmente por la hemoglobina glicosilada elevada—, se sube la dosis de insulina o se reduce el aporte calórico. Recuerden que el precio de un buen control glucémico son las hipoglicemias y el alza de peso, efectos adversos inherentes a la insulinoterapia que hay que gestionar inteligentemente.

El concepto fundamental para ajustar correctamente es entender qué determina cada glicemia. Las **insulinas lentas** —NPH y ultralentas— determinan las glicemias preprandiales, pero no la inmediata siguiente, sino la de horas después. Concretamente: la NPH nocturna determina la glicemia preprandial del desayuno. La NPH de la mañana determina las glicemias preprandiales del almuerzo y la cena. Las **insulinas rápidas** —cristalina y ultrarápidas— determinan las glicemias postprandiales, es decir, las de dos horas después de cada comida. Sin embargo, hay que considerar que la glicemia postprandial también depende de la preprandial: si antes de comer la glicemia ya está muy alta, la postprandial también lo estará inevitablemente. Y por supuesto, depende de la composición de lo que se comió.',
    '["Las insulinas lentas (NPH, glargina) determinan las glicemias preprandiales; las insulinas rápidas (cristalina, ultrarápidas) determinan las glicemias postprandiales.","La NPH nocturna determina la glicemia preprandial del desayuno; la NPH matutina determina las preprandiales del almuerzo y cena.","Cuando tanto preprandiales como postprandiales están elevadas, se ajusta primero la insulina lenta (basal); solo si persisten postprandiales elevadas con preprandiales normales, se ajusta la insulina rápida.","En el paciente mayor de 75 años, el objetivo de HbA1c es < 8%; si está dentro de ese rango aunque tenga glicemias individuales altas, no se realizan cambios.","Hipoglicemias preprandiales bien controladas con buen estado nutricional pueden manejarse con una colación; hipoglicemias en control metabólico subóptimo obligan a bajar la dosis de insulina."]'::jsonb,
    '[{"para":"\"LENTA = PRE / RÁPIDA = POST\":","nemotecnia":"\"LENTA = PRE / RÁPIDA = POST\":","explicacion":"Las insulinas lentas controlan lo que viene ANTES de comer. Las rápidas controlan lo que viene DESPUÉS de comer. Esta asociación es la columna vertebral de todos los ajustes.\nLas insulinas lentas controlan lo que viene ANTES de comer. Las rápidas controlan lo que viene DESPUÉS de comer. Esta asociación es la columna vertebral de todos los ajustes."},{"para":"\"NPH NOCHE → Glicemia AYUNO / NPH MAÑANA → Glicemia ALMUERZO y CENA\":","nemotecnia":"\"NPH NOCHE → Glicemia AYUNO / NPH MAÑANA → Glicemia ALMUERZO y CENA\":","explicacion":"La insulina que se pone en la noche repercute en la mañana siguiente. La de la mañana repercute en la tarde y noche.La insulina que se pone en la noche repercute en la mañana siguiente. La de la mañana repercute en la tarde y noche."},{"para":"\"Primero arregla los CIMIENTOS (preprandiales), luego el TECHO (postprandiales)\":","nemotecnia":"\"Primero arregla los CIMIENTOS (preprandiales), luego el TECHO (postprandiales)\":","explicacion":"Siempre corrija el nivel basal antes de ajustar los bolos de comida. Si los cimientos están mal, el techo siempre estará mal también.Siempre corrija el nivel basal antes de ajustar los bolos de comida. Si los cimientos están mal, el techo siempre estará mal también."}]'::jsonb,
    '["Las insulinas lentas (NPH, glargina) determinan las glicemias preprandiales; las insulinas rápidas (cristalina, ultrarápidas) determinan las glicemias postprandiales.","La NPH nocturna determina la glicemia preprandial del desayuno; la NPH matutina determina las preprandiales del almuerzo y cena.","Cuando tanto preprandiales como postprandiales están elevadas, se ajusta primero la insulina lenta (basal); solo si persisten postprandiales elevadas con preprandiales normales, se ajusta la insulina rápida."]'::jsonb,
    '[]'::jsonb,
    '[{"pregunta":"¿Cuál de las siguientes afirmaciones es correcta?","respuesta":"Respuesta correcta: D — Cuando tanto las glicemias preprandiales como postprandiales están elevadas, la prioridad es corregir la insulina basal (ultralenta o NPH) que determina las preprandiales; al normalizarse estas, frecuentemente las postprandiales se corrigen también."}]'::jsonb,
    NOW(),
    TRUE,
    FALSE  -- first 3 free preview
  ) ON CONFLICT (specialty_id, order_index)
  DO UPDATE SET
    title            = EXCLUDED.title,
    duration_seconds = EXCLUDED.duration_seconds,
    txt_content      = EXCLUDED.txt_content,
    srt_content      = EXCLUDED.srt_content,
    ai_summary       = EXCLUDED.ai_summary,
    ai_key_concepts  = EXCLUDED.ai_key_concepts,
    ai_mnemonics     = EXCLUDED.ai_mnemonics,
    ai_high_yield    = EXCLUDED.ai_high_yield,
    ai_review_qs     = EXCLUDED.ai_review_qs,
    ai_processed_at  = NOW(),
    is_available     = TRUE;

  -- Cápsula 6: Objetivos del Manejo de la Diabetes Mellitus — Metas Metabólicas y Cardiovasculares
  INSERT INTO lessons (
    specialty_id, title, order_index, duration_seconds,
    txt_content, srt_content,
    ai_summary, ai_key_concepts, ai_mnemonics,
    ai_high_yield, ai_algorithms, ai_review_qs,
    ai_processed_at, is_available, is_free_preview
  ) VALUES (
    v_specialty_id,
    'Objetivos del Manejo de la Diabetes Mellitus — Metas Metabólicas y Cardiovasculares',
    6,
    382,
    'Hola, hola. Vamos a ver un tema muy corto pero importante, que cuáles son los objetivos de laboratorio o en general

en el manejo de una diabetes mellito. Y el objetivo hacia grandes rasgos, lo que uno busca

al tratar a un paciente diabético, es evitar las complicaciones agudas. Dígase, la cetoacidosis, el síndrome hiperglicémico, hiperosmolar,

la cipolisemia, y las complicaciones crónicas. Dígase, la retinopatía diabética, el pie diabético, la nefropatía diabética, la neuropatía diabética, etcétera.

Ese es como el objetivo clínico, el objetivo más importante, pero esto se traduce en los exámenes que uno pide,

en que tenga una hemoglobina glicosilada menor a 7%. ¿Y por qué menor a 7%? Porque bajo ese rango, la verdad es que no tiene complicaciones crónicas

y es muy raro que tenga complicaciones agudas, salvo obviamente la hipoglicemia, que acuérdense que el precio para un buen control metabólico

es hacer al menos alguna hipoglicemia al año. Ahora, este corte de menor a 7% cambia en algunos casos y cambia a ser un poquito más laxo,

a ser un poco más permisivo con las hiperglicemias, y el corte ahí queda en 8%, y eso se hace cuando el paciente está con mucha hipoglicemia.

Alguien que de verdad me hace hipoglicemias a cada rato, con síntomas neuroglucopénicos que eventualmente se ponen en peligro su vida,

uno dice, sumando y restando, mejor que quede con un control no tan estricto, con tal de que no haga las hipoglicemias.

Lo mismo ocurre con los niños muy pequeños, porque justamente son más desordenados con las comidas, con las insulinas,

y eventualmente tienen riesgo de hipoglicemia. Ahora, un niño que ya sigue las instrucciones bien y que aprende a manejar su diabetes uno bien,

que es lo más frecuente. Los niños pueden aprender perfectamente a manejar sus comidas, sus insulinas, y todas esas cosas ya quedan con el objetivo

de que sea menor a 7, pero un niño muy chico que todavía no sigue estas instrucciones uno se queda con el corte de menor a 8.

Cuando yo tengo un paciente que yo creo que va a vivir menos de 10 años, que tiene una expectativa de vida o de sobrevida menor a 10 años,

en ese caso igualmente el objetivo es 8% porque en 10 años no va a avanzar tanto ni la nefropatía, ni la retinopatía,

ni la neuropatía como para estar tan estricto, y en esta misma línea alguien mayor de 75 años a menos que esté demasiado bien

o alguien con comorbilidades muy severas que me hacen pensar que va a fallecer pronto, en esos casos igualmente el corte es 8%.

Dedicamos harto tiempo a esto, a la hemoglobina glicosilada porque ese es el objetivo más importante en el manejo de la diabetes,

en el control metabólico de la diabetes y acuérdense que se pide cada tres meses y cuando ya logra niveles estables

en el tiempo y que están dentro de rango puedo espaciarlo cada seis meses, pero en la práctica cada tres meses

hay que pedirle este examen y los pacientes le dicen el examen acusete o el examen chismoso en el sentido

en que cuenta la verdad de los últimos dos meses a diferencia de las glicemias que me hablan de las últimas horas nomás.

Ahora, el objetivo respecto a las glicemias, ya las preprandiales y las postprandiales no hay un valor único,

aquí yo pongo las preprandiales menor a 130 pero en algunas partes sale menor a 100 y las postprandiales menor a 180

y que en algunos lugares sale menor a 130 y menciono estos valores, las preprandiales menor a 100 a 130

y las postprandiales menor a 130 a 180 porque de una u otra forma me sirven para ajustar los niveles de insulina

o de los hipoglicemiantes orales en relación a tener una hemoglobina glicosilada alta

pero las glicemias malas con la hemoglobina glicosilada dentro de rango la verdad es que manda la hemoglobina glicosilada

y me da lo mismo que haya una postprandial en 190 por ejemplo.

Ahora, la presión arterial igualmente tiene un objetivo, no hay acuerdo en algunas partes sale menor a 130 a 80

en otras partes sale menor a 140 a 90 y la verdad es que si viene con nefropatía

ya sea como incipiente con una simple microalbuminuria ya me quedo con los 130 a 80.

La mayoría de las guías internacionales hablan del 130 a 80, la guía MSAL dependiendo cual de las guías

se queda con alguno de esos dos valores menor a 140 a 90 o menor a 130 a 80.

Ahora, como para los pacientes en la vida real lo ideal es intentar que estén menor a 130 a 80

sabiendo que uno ve el riesgo-beneficio con los farmas, con los costos, etcétera

eventualmente uno puede ser un poquito más permisivo siempre y cuando no tenga nefropatía

entonces que hay nefropatía ya sea falla renal o proteinuria en ese caso me quedo con ese rango que está ahí

de los 130 a 80, quedo claro.

Aparte de eso el perfil lipídico uno le exige los triliserios abajo de 150 idealmente bajo 100

el HDL que esté en rango normal digase en los hombres arriba de 40 y en las mujeres arriba de 50

acuérdense que el HDL bajo es una dislipidemia que aumenta levemente el riesgo cardiovascular

y los triliserios altos más el HDL bajo son las dos complicaciones clásicas desde el punto de vista lipídico

de la diabetes, pero lo más importante sigue siendo el manejo del colesterol LDL

ahora el colesterol LDL no se altera con la diabetes, eso es importante, la diabetes no me eleva

los niveles del LDL, pero el LDL es lo que me determina el riesgo cardiovascular

y en este caso los diabéticos tienen máximo riesgo cardiovascular así que se le pide que esté abajo de 70

ahora si que ya está con estatinas y anda relativamente bien y está entre 70 y 100

eventualmente me quedo tranquilo, pero lo ideal es si es que está arriba de 70

iniciar con estatinas de inmediato y en la práctica a los diabéticos se les inicia estatinas casi siempre

ahora, aparte dentro de los objetivos está el manejar los otros factores de riesgo cardiovascular

las otras enfermedades crónicas y dentro de eso que no fume, que haga dieta, que haga deporte

que maneje todas sus otras enfermedades, etcétera

pero lo más importante es la hemoglobina glicosilada y eso hay que saberlo bien sabiendo las excepciones

y nos vemos en el siguiente video, ahí vamos a ver un poco más del manejo de la diabetes 2

que estén bien',
    '1
00:00:03,340 --> 00:00:09,240
Hola, hola. Vamos a ver un tema muy corto pero importante, que cuáles son los objetivos de laboratorio o en general

2
00:00:09,380 --> 00:00:14,720
en el manejo de una diabetes mellito. Y el objetivo hacia grandes rasgos, lo que uno busca

3
00:00:14,720 --> 00:00:21,540
al tratar a un paciente diabético, es evitar las complicaciones agudas. Dígase, la cetoacidosis, el síndrome hiperglicémico, hiperosmolar,

4
00:00:22,340 --> 00:00:31,740
la cipolisemia, y las complicaciones crónicas. Dígase, la retinopatía diabética, el pie diabético, la nefropatía diabética, la neuropatía diabética, etcétera.

5
00:00:31,740 --> 00:00:39,340
Ese es como el objetivo clínico, el objetivo más importante, pero esto se traduce en los exámenes que uno pide,

6
00:00:39,340 --> 00:00:48,340
en que tenga una hemoglobina glicosilada menor a 7%. ¿Y por qué menor a 7%? Porque bajo ese rango, la verdad es que no tiene complicaciones crónicas

7
00:00:48,340 --> 00:00:54,940
y es muy raro que tenga complicaciones agudas, salvo obviamente la hipoglicemia, que acuérdense que el precio para un buen control metabólico

8
00:00:54,940 --> 00:01:05,140
es hacer al menos alguna hipoglicemia al año. Ahora, este corte de menor a 7% cambia en algunos casos y cambia a ser un poquito más laxo,

9
00:01:05,140 --> 00:01:14,940
a ser un poco más permisivo con las hiperglicemias, y el corte ahí queda en 8%, y eso se hace cuando el paciente está con mucha hipoglicemia.

10
00:01:14,940 --> 00:01:22,340
Alguien que de verdad me hace hipoglicemias a cada rato, con síntomas neuroglucopénicos que eventualmente se ponen en peligro su vida,

11
00:01:22,340 --> 00:01:28,740
uno dice, sumando y restando, mejor que quede con un control no tan estricto, con tal de que no haga las hipoglicemias.

12
00:01:28,740 --> 00:01:34,740
Lo mismo ocurre con los niños muy pequeños, porque justamente son más desordenados con las comidas, con las insulinas,

13
00:01:34,740 --> 00:01:41,940
y eventualmente tienen riesgo de hipoglicemia. Ahora, un niño que ya sigue las instrucciones bien y que aprende a manejar su diabetes uno bien,

14
00:01:41,940 --> 00:01:50,740
que es lo más frecuente. Los niños pueden aprender perfectamente a manejar sus comidas, sus insulinas, y todas esas cosas ya quedan con el objetivo

15
00:01:50,940 --> 00:01:57,940
de que sea menor a 7, pero un niño muy chico que todavía no sigue estas instrucciones uno se queda con el corte de menor a 8.

16
00:01:57,940 --> 00:02:05,340
Cuando yo tengo un paciente que yo creo que va a vivir menos de 10 años, que tiene una expectativa de vida o de sobrevida menor a 10 años,

17
00:02:05,340 --> 00:02:13,940
en ese caso igualmente el objetivo es 8% porque en 10 años no va a avanzar tanto ni la nefropatía, ni la retinopatía,

18
00:02:14,140 --> 00:02:22,140
ni la neuropatía como para estar tan estricto, y en esta misma línea alguien mayor de 75 años a menos que esté demasiado bien

19
00:02:22,140 --> 00:02:29,140
o alguien con comorbilidades muy severas que me hacen pensar que va a fallecer pronto, en esos casos igualmente el corte es 8%.

20
00:02:29,140 --> 00:02:37,140
Dedicamos harto tiempo a esto, a la hemoglobina glicosilada porque ese es el objetivo más importante en el manejo de la diabetes,

21
00:02:37,340 --> 00:02:44,340
en el control metabólico de la diabetes y acuérdense que se pide cada tres meses y cuando ya logra niveles estables

22
00:02:44,340 --> 00:02:49,340
en el tiempo y que están dentro de rango puedo espaciarlo cada seis meses, pero en la práctica cada tres meses

23
00:02:49,340 --> 00:02:55,340
hay que pedirle este examen y los pacientes le dicen el examen acusete o el examen chismoso en el sentido

24
00:02:55,340 --> 00:03:02,340
en que cuenta la verdad de los últimos dos meses a diferencia de las glicemias que me hablan de las últimas horas nomás.

25
00:03:02,540 --> 00:03:10,540
Ahora, el objetivo respecto a las glicemias, ya las preprandiales y las postprandiales no hay un valor único,

26
00:03:10,540 --> 00:03:19,540
aquí yo pongo las preprandiales menor a 130 pero en algunas partes sale menor a 100 y las postprandiales menor a 180

27
00:03:19,540 --> 00:03:27,540
y que en algunos lugares sale menor a 130 y menciono estos valores, las preprandiales menor a 100 a 130

28
00:03:27,740 --> 00:03:34,740
y las postprandiales menor a 130 a 180 porque de una u otra forma me sirven para ajustar los niveles de insulina

29
00:03:34,740 --> 00:03:40,740
o de los hipoglicemiantes orales en relación a tener una hemoglobina glicosilada alta

30
00:03:40,740 --> 00:03:47,740
pero las glicemias malas con la hemoglobina glicosilada dentro de rango la verdad es que manda la hemoglobina glicosilada

31
00:03:47,740 --> 00:03:51,740
y me da lo mismo que haya una postprandial en 190 por ejemplo.

32
00:03:51,940 --> 00:04:00,940
Ahora, la presión arterial igualmente tiene un objetivo, no hay acuerdo en algunas partes sale menor a 130 a 80

33
00:04:00,940 --> 00:04:06,940
en otras partes sale menor a 140 a 90 y la verdad es que si viene con nefropatía

34
00:04:06,940 --> 00:04:13,940
ya sea como incipiente con una simple microalbuminuria ya me quedo con los 130 a 80.

35
00:04:13,940 --> 00:04:18,940
La mayoría de las guías internacionales hablan del 130 a 80, la guía MSAL dependiendo cual de las guías

36
00:04:19,140 --> 00:04:24,140
se queda con alguno de esos dos valores menor a 140 a 90 o menor a 130 a 80.

37
00:04:24,140 --> 00:04:33,140
Ahora, como para los pacientes en la vida real lo ideal es intentar que estén menor a 130 a 80

38
00:04:33,140 --> 00:04:37,140
sabiendo que uno ve el riesgo-beneficio con los farmas, con los costos, etcétera

39
00:04:37,140 --> 00:04:42,140
eventualmente uno puede ser un poquito más permisivo siempre y cuando no tenga nefropatía

40
00:04:42,340 --> 00:04:47,340
entonces que hay nefropatía ya sea falla renal o proteinuria en ese caso me quedo con ese rango que está ahí

41
00:04:47,340 --> 00:04:50,340
de los 130 a 80, quedo claro.

42
00:04:50,340 --> 00:04:58,340
Aparte de eso el perfil lipídico uno le exige los triliserios abajo de 150 idealmente bajo 100

43
00:04:58,340 --> 00:05:05,340
el HDL que esté en rango normal digase en los hombres arriba de 40 y en las mujeres arriba de 50

44
00:05:05,340 --> 00:05:11,340
acuérdense que el HDL bajo es una dislipidemia que aumenta levemente el riesgo cardiovascular

45
00:05:11,540 --> 00:05:19,540
y los triliserios altos más el HDL bajo son las dos complicaciones clásicas desde el punto de vista lipídico

46
00:05:19,540 --> 00:05:24,540
de la diabetes, pero lo más importante sigue siendo el manejo del colesterol LDL

47
00:05:24,540 --> 00:05:31,540
ahora el colesterol LDL no se altera con la diabetes, eso es importante, la diabetes no me eleva

48
00:05:31,540 --> 00:05:36,540
los niveles del LDL, pero el LDL es lo que me determina el riesgo cardiovascular

49
00:05:36,740 --> 00:05:42,740
y en este caso los diabéticos tienen máximo riesgo cardiovascular así que se le pide que esté abajo de 70

50
00:05:42,740 --> 00:05:47,740
ahora si que ya está con estatinas y anda relativamente bien y está entre 70 y 100

51
00:05:47,740 --> 00:05:52,740
eventualmente me quedo tranquilo, pero lo ideal es si es que está arriba de 70

52
00:05:52,740 --> 00:05:58,740
iniciar con estatinas de inmediato y en la práctica a los diabéticos se les inicia estatinas casi siempre

53
00:05:58,740 --> 00:06:04,740
ahora, aparte dentro de los objetivos está el manejar los otros factores de riesgo cardiovascular

54
00:06:04,940 --> 00:06:09,940
las otras enfermedades crónicas y dentro de eso que no fume, que haga dieta, que haga deporte

55
00:06:09,940 --> 00:06:12,940
que maneje todas sus otras enfermedades, etcétera

56
00:06:12,940 --> 00:06:18,940
pero lo más importante es la hemoglobina glicosilada y eso hay que saberlo bien sabiendo las excepciones

57
00:06:18,940 --> 00:06:22,940
y nos vemos en el siguiente video, ahí vamos a ver un poco más del manejo de la diabetes 2

58
00:06:22,940 --> 00:06:23,940
que estén bien',
    'Tratar la diabetes sin tener claros los objetivos terapéuticos es como navegar sin rumbo. En esta cápsula veremos cuáles son las metas que deben perseguirse en el manejo del paciente diabético y bajo qué circunstancias esas metas se ajustan.

El objetivo clínico central es evitar las complicaciones de la diabetes. Las complicaciones agudas incluyen la cetoacidosis diabética, el síndrome hiperglicémico hiperosmolar y la hipoglicemia. Las complicaciones crónicas son las que dan forma a las secuelas de la enfermedad a largo plazo: retinopatía diabética, nefropatía diabética, neuropatía periférica, pie diabético y la macroangiopatía que acelera la enfermedad cardiovascular. Todas estas complicaciones se previenen o se retardan con un buen control metabólico sostenido en el tiempo.

Este control metabólico se mide fundamentalmente a través de la **hemoglobina glicosilada o HbA1c**. El objetivo estándar es mantenerla **por debajo del 7%**. Por debajo de ese umbral, las complicaciones crónicas son poco frecuentes y las complicaciones agudas son raras —con excepción de la hipoglicemia, que es el precio que se paga por un control estricto—. La HbA1c se solicita cada tres meses hasta lograr un control estable, y una vez alcanzado y mantenido, puede espaciarse a cada seis meses.',
    '["El objetivo principal del tratamiento es prevenir complicaciones agudas (cetoacidosis, hipoglicemia) y crónicas (retinopatía, nefropatía, neuropatía, pie diabético).","La HbA1c debe mantenerse < 7% en la mayoría de los pacientes; se acepta < 8% en pacientes con hipoglicemias frecuentes, niños pequeños, expectativa de vida < 10 años o mayores de 75 años.","La HbA1c se solicita cada 3 meses hasta lograr estabilidad; puede espaciarse a 6 meses con control sostenido. En caso de discordancia con glicemias individuales, manda la HbA1c.","La presión arterial objetivo en diabéticos es < 130/80 mmHg, especialmente con nefropatía (microalbuminuria o proteinuria).","El LDL objetivo es < 70 mg/dL; prácticamente todos los diabéticos deben recibir estatinas dado su riesgo cardiovascular máximo."]'::jsonb,
    '[{"para":"\"7% para los menores de 75, 8% para los mayores y los frágiles\":","nemotecnia":"\"7% para los menores de 75, 8% para los mayores y los frágiles\":","explicacion":"El corte para ajustar el objetivo de HbA1c es la edad de 75 años (o situaciones que reducen la expectativa de vida). Antes de los 75: meta de 7%. Después o en casos especiales: 8%.\nEl corte para ajustar el objetivo de HbA1c es la edad de 75 años (o situaciones que reducen la expectativa de vida). Antes de los 75: meta de 7%. Después o en casos especiales: 8%."},{"para":"\"LDL bajo 70 = estatinas siempre en el diabético\":","nemotecnia":"\"LDL bajo 70 = estatinas siempre en el diabético\":","explicacion":"Los diabéticos son de máximo riesgo cardiovascular. Aunque la diabetes no sube el LDL, el LDL alto en un diabético es letal. Estatinas de entrada si LDL ≥ 70.Los diabéticos son de máximo riesgo cardiovascular. Aunque la diabetes no sube el LDL, el LDL alto en un diabético es letal. Estatinas de entrada si LDL ≥ 70."},{"para":"\"HbA1c = el examen chismoso de los 3 meses\":","nemotecnia":"\"HbA1c = el examen chismoso de los 3 meses\":","explicacion":"No se puede mentir. Refleja los últimos 2-3 meses sin importar si hoy ayunó más. Es el juez final del control metabólico.No se puede mentir. Refleja los últimos 2-3 meses sin importar si hoy ayunó más. Es el juez final del control metabólico."}]'::jsonb,
    '["El objetivo principal del tratamiento es prevenir complicaciones agudas (cetoacidosis, hipoglicemia) y crónicas (retinopatía, nefropatía, neuropatía, pie diabético).","La HbA1c debe mantenerse < 7% en la mayoría de los pacientes; se acepta < 8% en pacientes con hipoglicemias frecuentes, niños pequeños, expectativa de vida < 10 años o mayores de 75 años.","La HbA1c se solicita cada 3 meses hasta lograr estabilidad; puede espaciarse a 6 meses con control sostenido. En caso de discordancia con glicemias individuales, manda la HbA1c."]'::jsonb,
    '[]'::jsonb,
    '[{"pregunta":"¿Cuál de las siguientes afirmaciones es correcta?","respuesta":"Respuesta correcta: C — En pacientes mayores de 75 años, con hipoglicemias frecuentes o con expectativa de vida menor a 10 años, el objetivo de HbA1c se relaja a < 8% para minimizar el riesgo de hipoglicemias sin pérdida significativa de beneficio a largo plazo."}]'::jsonb,
    NOW(),
    TRUE,
    FALSE  -- first 3 free preview
  ) ON CONFLICT (specialty_id, order_index)
  DO UPDATE SET
    title            = EXCLUDED.title,
    duration_seconds = EXCLUDED.duration_seconds,
    txt_content      = EXCLUDED.txt_content,
    srt_content      = EXCLUDED.srt_content,
    ai_summary       = EXCLUDED.ai_summary,
    ai_key_concepts  = EXCLUDED.ai_key_concepts,
    ai_mnemonics     = EXCLUDED.ai_mnemonics,
    ai_high_yield    = EXCLUDED.ai_high_yield,
    ai_review_qs     = EXCLUDED.ai_review_qs,
    ai_processed_at  = NOW(),
    is_available     = TRUE;

  -- Cápsula 7: Hipoglicemiantes Orales en Diabetes Mellitus Tipo 2 — Familias, Mecanismos e Indicaciones
  INSERT INTO lessons (
    specialty_id, title, order_index, duration_seconds,
    txt_content, srt_content,
    ai_summary, ai_key_concepts, ai_mnemonics,
    ai_high_yield, ai_algorithms, ai_review_qs,
    ai_processed_at, is_available, is_free_preview
  ) VALUES (
    v_specialty_id,
    'Hipoglicemiantes Orales en Diabetes Mellitus Tipo 2 — Familias, Mecanismos e Indicaciones',
    7,
    601,
    'Hola hola, ¿cómo están? Vamos a hablar de los hipolisimiantes orales en el tratamiento de la

diabetes 2, en el sentido que la diabetes 1, la diabetes autoinmune, no sirven en absoluto los

hipolisimiantes, pero en la diabetes 2 suelen ser el tratamiento de primera línea y hay muchos,

de hecho se dividen en los clásicos y en los nuevos, dentro de los clásicos están las

biguanidas con la clásica metformina, la sulfoniluria, de los cuales que más se usa es la

también llamada gliburida, las tiasolidinedionas o glitasonas y los inhibidores de la alfaglucosidasa

como la carbosa por ejemplo, y aparte de eso hay muchos nuevos como los inhibidores del DPP4,

de la dipeptilpeptidasa 4, los agonistas de GLP1 que son de el péptido simil al glucagón,

glucagón like péptido 1, los inhibidores de el transportador de glucosa renal tipo 2 y hay

otros más y lo importante en esta clase simplemente vamos a ver cuáles son,

cómo se llaman y cuáles son como sus indicaciones más generales y en otra clase

vamos a andar en el manejo de la diabetes 2 propiamente tal. Empecemos con las biguanidas,

ya dijimos que el más importante es la metformina y su mecanismo de acción es

disminuyendo la resistencia a la insulina o generando una mayor sensibilidad a la insulina.

La metformina es el único que hay que saber y sepan que es barata, es eficaz, es segura,

es buena, bonita y barata, pero tiene como reacción adversa a medicamentos,

habitualmente síntomas de índole gastrointestinal ya sea diarrea u otros síntomas

gastrointestinales como vómitos, náuseas, dolor abdominal. Ahora lo importante es que no

genera hipoglicemia y lo que dice ahí que es segura es justamente porque tiene un muy muy

bajo riesgo de hacer hipoglicemia y por lo mismo al ser buena, bonita y barata es el

tratamiento de primera línea en el manejo de la diabetes mellitus 2. Eso sí tiene algunas

contraindicaciones hay que saberlas que son la insuficiencia renal crónica con una crea

mayor a 1,5 o desde 1,5 en adelante o bien con un clínes menor a 30 ml minuto y segundo

lugar una insuficiencia cardíaca más o menos importante con con con falla cardíaca en ese

caso está absolutamente contraindicada igualmente la metformina. El segundo gran grupo de

hipoglicemia son las sulfonil urias, hay varias dentro de ellas pero la forma en que actúan

todas es siempre aumentando la secreción pancreatica de insulina así que requieren

que hay un páncreas que funcione relativamente bien. El más importante es la glivenclamida

o gliburida al menos ese es el que se sigue vendiendo, es barata, es eficaz pero tiene

riesgo de hipoglicemia y hay los subrayos en el sentido en que el riesgo más importante de

la glivenclamida y que ha hecho que hayan sido desplazados por otros fármacos es justamente

que hace mucha hipoglicemia y además hace que uno suba de peso más que la metformina. Aparte

de eso hay que saber que la glivenclamida no es el único, hay algunas como la glipicida

y el glimepiridae que tienen como algo bueno, que tienen menor riesgo de hipoglicemia y de

efectos adversos en general pero que tienen como cosa mala que son más caras así que en la

práctica cuando se usa una sulfoniluria suele ser la glivenclamida pero si es que tengo

un poquito más de plata eventualmente se puede dejar alguna de estas otras dos.

Suelen ser el tratamiento de segunda línea pero no siempre solamente cuando tengo

pocos recursos en el sentido en que ya les adelanto que si tengo más dinero debería

usar alguno de los nuevos hipoglicemiantes orales y segundo lugar siempre y cuando tenga

un bajo riesgo de hipoglicemia. Aparte de eso están las glitazonas al igual que las

biguanidas al igual que la metformina actúan disminuyendo la resistencia a la insulina,

el más frecuente es la pioglitazona aunque en general no se llaman glitazonas sino que

las tiazoladinidionas y aparte de esto de acá al igual que la metformina tienen un

bajo riesgo de hipoglicemia así que eventualmente son una alternativa para alguien que está

haciendo mucha hipoglicemia con algún otro fármaco pero tienen un poco mayor riesgo

cardiovascular y de insuficiencia cardíaca que otros hipoglicemiantes y eso ha hecho que

hayan caído hasta cierto punto en desuso y que solamente se usan por el diabetólogo en

algunos casos muy seleccionados así que en la práctica hay que saber que existen pero

que lo más probable es que se va a usar otro tipo de hipoglicemiantes. Aparte de esto

están los inhibidores de la dipeptilpeptidasa 4 acuérdense que la forma en que actúan es

estimulando el sistema GLP-1 o sea en cuanto a eso se parecen un poco a los agonistas del

GLP-1 que los vamos a ver después que a su vez aumenta la secreción de insulina son las que

se denominan o se llaman comúnmente también como gliptinas que incluye la cita gliptina

que es el más clásico la saxagliptina y la linagliptina esas son las tres pero si termina

en gliptina se están refiriendo a esta familia de medicamentos y en particular quiero que sepan

la cita gliptina son eficaces son más caros y no generan la hipoglicemia o al menos tienen

un riesgo mucho menor que la sulfoniluria así que son los de segunda línea actualmente

al menos según la guía Minsal se pueden usar igualmente otros fármacos de segunda línea

según las guías internacionales como cosa importante es siempre y cuando haya recursos

y también cuando hay un alto riesgo de hipoglicemia si es que hay un alto riesgo

de hipoglicemia en ese caso yo no puedo dejar glibinclamida y estoy obligado a dejar

o cita gliptina o algún otro fármaco ahora dentro de otra familia están los

inhibidores de la alfa gluconidasa que lo único que hay que saber es que existe la

acarbosa que ya no se usa porque es poco eficaz y finalmente en esta depositiva porque

falta una depositiva completa las meglitinidas dentro de las cuales la más importante es la

repaglinida y la nateglinida que son las famosas glinidas estas de acá hay que saber

que por regla general actúan de una manera muy similar a las sulfonilurias y que por

lo tanto tienen riesgo de hipoglicemia también eso sí tienen un poquito menos de riesgo que

la glibinclamida pero aún así las indicaciones de este fármaco suelen ser las mismas que

el de la sulfoniluria ya ahora veamos los últimos dos grupos los agonistas de la glp-1 que actúan

aumentando la producción de insulina y que hay que saber que son los famosos glutides o

incretinas también se llaman así que se incluye ahí el liraglutide el semaglutide y la

dulaglutide y aparte están los inhibidores del transportador de glucosa renal tipo 2 que en

este caso la forma en que actúan es generando glucosuria o sea es impide la reabsorción de

glucosa a nivel renal y se pierde azúcar a través de la orina lo cual por un lado

puede aumentar el riesgo de infección urinaria por ejemplo pero es bastante eficaz para

evitar las hiperglicemias muy severas de hecho son buenos fármaco y sepan que su nombre termina

habitualmente en glifosina y ahí está la empaglifosina la canaglifosina y la dapaglifosina

no hay por qué saber todos los nombres pero al menos empaglifosina, liraglutide y de antes

la citagliptina son tres nombres que yo recomiendo que sí se aprendan y que sepan

a qué familia pertenece a cada uno ahora estas dos familias las vamos a ver en conjunto

porque ambos son nuevos hipoglicemiantes y su beneficio son bien similares son eficaces son

buenos pero son caros ya son mucho más caros que la metformina y que la gliven clamida no

producen hipoglicemia o al menos tienen un riesgo mucho más bajo que el de la gliven clamida y

aparte estos son muy buenos o son mejores que todos los demás en el caso de que haya un

daño cardiovascular importante ejemplo una enfermedad arterial periférica enfermedad coronaria

o ese tipo de cosas y en el caso de que haya falla renal en particular si falla renal con

proteinuria con una macroalbuminuria en ese caso son mejores estos dos fármacos que la gliven

clamida por ejemplo ahora los inhibidores de el transportador del sglut2 son además buenos

en la insuficiencia cardiaca con falla cardiaca pero ya no son tan buenos en la insuficiencia

renal severa con una caída en el clín es muy importante y la razón está relacionado con su

mecanismo de acción dado que la empaglifocina por ejemplo actúa inhibiendo la reabsorción

de glucosa o sea generando glucosuria y si yo tengo una falla renal muy grande obviamente

va a ser poca la glucosa que se va a filtrar desde el principio así que actúa menos ahora

estos dos grupos en particular los agonistas glp1 son de segunda línea igualmente cuando

yo tengo recursos cuando tengo un alto riesgo de hipoglicemia igual que la citagliptina aunque

la guía de minzal elija los dpp4 a la citagliptina al menos como para comprarlo

en el sistema público ahora van a ser de elección estos dos grupos de acá cuando

tengo una enfermedad arterial la enfermedad arterial aterosclerótica en general ejemplo

una un aneurisma órtico abdominal enfermedad coronaria etcétera y también cuando tengo una

insuficiencia renal crónica con macroalbuminuria mayor a 300 o bien cuando hay insuficiencia

cardiaca que en ese caso los glu2 van a ser los más importantes y bueno arte información

con algunas cosas que son relativamente nuevas pero que vale la pena saber en el sentido en

que habiendo avanzado la tecnología y el tratamiento de los pacientes diabéticos tiene

que avanzar el conocimiento también para ajustarse y optimizar el manejo de estos

pacientes ahora lo más difícil es convencerlo que se tomen los remedios que estén bien',
    '1
00:00:03,250 --> 00:00:07,170
Hola hola, ¿cómo están? Vamos a hablar de los hipolisimiantes orales en el tratamiento de la

2
00:00:07,170 --> 00:00:12,450
diabetes 2, en el sentido que la diabetes 1, la diabetes autoinmune, no sirven en absoluto los

3
00:00:12,450 --> 00:00:16,750
hipolisimiantes, pero en la diabetes 2 suelen ser el tratamiento de primera línea y hay muchos,

4
00:00:16,750 --> 00:00:21,030
de hecho se dividen en los clásicos y en los nuevos, dentro de los clásicos están las

5
00:00:21,030 --> 00:00:26,390
biguanidas con la clásica metformina, la sulfoniluria, de los cuales que más se usa es la

6
00:00:27,390 --> 00:00:34,470
también llamada gliburida, las tiasolidinedionas o glitasonas y los inhibidores de la alfaglucosidasa

7
00:00:34,470 --> 00:00:40,990
como la carbosa por ejemplo, y aparte de eso hay muchos nuevos como los inhibidores del DPP4,

8
00:00:40,990 --> 00:00:48,910
de la dipeptilpeptidasa 4, los agonistas de GLP1 que son de el péptido simil al glucagón,

9
00:00:48,910 --> 00:00:57,390
glucagón like péptido 1, los inhibidores de el transportador de glucosa renal tipo 2 y hay

10
00:00:57,390 --> 00:01:02,070
otros más y lo importante en esta clase simplemente vamos a ver cuáles son,

11
00:01:02,070 --> 00:01:06,710
cómo se llaman y cuáles son como sus indicaciones más generales y en otra clase

12
00:01:06,710 --> 00:01:11,310
vamos a andar en el manejo de la diabetes 2 propiamente tal. Empecemos con las biguanidas,

13
00:01:11,310 --> 00:01:16,790
ya dijimos que el más importante es la metformina y su mecanismo de acción es

14
00:01:16,790 --> 00:01:22,630
disminuyendo la resistencia a la insulina o generando una mayor sensibilidad a la insulina.

15
00:01:22,630 --> 00:01:29,390
La metformina es el único que hay que saber y sepan que es barata, es eficaz, es segura,

16
00:01:29,390 --> 00:01:34,430
es buena, bonita y barata, pero tiene como reacción adversa a medicamentos,

17
00:01:34,430 --> 00:01:39,230
habitualmente síntomas de índole gastrointestinal ya sea diarrea u otros síntomas

18
00:01:39,230 --> 00:01:45,510
gastrointestinales como vómitos, náuseas, dolor abdominal. Ahora lo importante es que no

19
00:01:45,510 --> 00:01:50,710
genera hipoglicemia y lo que dice ahí que es segura es justamente porque tiene un muy muy

20
00:01:50,710 --> 00:01:56,030
bajo riesgo de hacer hipoglicemia y por lo mismo al ser buena, bonita y barata es el

21
00:01:56,030 --> 00:02:01,430
tratamiento de primera línea en el manejo de la diabetes mellitus 2. Eso sí tiene algunas

22
00:02:01,430 --> 00:02:06,110
contraindicaciones hay que saberlas que son la insuficiencia renal crónica con una crea

23
00:02:06,110 --> 00:02:12,510
mayor a 1,5 o desde 1,5 en adelante o bien con un clínes menor a 30 ml minuto y segundo

24
00:02:12,510 --> 00:02:17,870
lugar una insuficiencia cardíaca más o menos importante con con con falla cardíaca en ese

25
00:02:17,870 --> 00:02:24,590
caso está absolutamente contraindicada igualmente la metformina. El segundo gran grupo de

26
00:02:24,590 --> 00:02:30,910
hipoglicemia son las sulfonil urias, hay varias dentro de ellas pero la forma en que actúan

27
00:02:30,910 --> 00:02:35,610
todas es siempre aumentando la secreción pancreatica de insulina así que requieren

28
00:02:35,610 --> 00:02:40,070
que hay un páncreas que funcione relativamente bien. El más importante es la glivenclamida

29
00:02:40,070 --> 00:02:46,350
o gliburida al menos ese es el que se sigue vendiendo, es barata, es eficaz pero tiene

30
00:02:46,350 --> 00:02:52,190
riesgo de hipoglicemia y hay los subrayos en el sentido en que el riesgo más importante de

31
00:02:52,190 --> 00:02:56,150
la glivenclamida y que ha hecho que hayan sido desplazados por otros fármacos es justamente

32
00:02:56,150 --> 00:03:02,470
que hace mucha hipoglicemia y además hace que uno suba de peso más que la metformina. Aparte

33
00:03:02,470 --> 00:03:07,630
de eso hay que saber que la glivenclamida no es el único, hay algunas como la glipicida

34
00:03:07,630 --> 00:03:12,590
y el glimepiridae que tienen como algo bueno, que tienen menor riesgo de hipoglicemia y de

35
00:03:12,590 --> 00:03:17,230
efectos adversos en general pero que tienen como cosa mala que son más caras así que en la

36
00:03:17,230 --> 00:03:23,310
práctica cuando se usa una sulfoniluria suele ser la glivenclamida pero si es que tengo

37
00:03:23,310 --> 00:03:26,270
un poquito más de plata eventualmente se puede dejar alguna de estas otras dos.

38
00:03:26,270 --> 00:03:31,390
Suelen ser el tratamiento de segunda línea pero no siempre solamente cuando tengo

39
00:03:31,390 --> 00:03:36,590
pocos recursos en el sentido en que ya les adelanto que si tengo más dinero debería

40
00:03:36,590 --> 00:03:42,790
usar alguno de los nuevos hipoglicemiantes orales y segundo lugar siempre y cuando tenga

41
00:03:42,790 --> 00:03:47,430
un bajo riesgo de hipoglicemia. Aparte de eso están las glitazonas al igual que las

42
00:03:47,430 --> 00:03:51,390
biguanidas al igual que la metformina actúan disminuyendo la resistencia a la insulina,

43
00:03:51,390 --> 00:03:57,990
el más frecuente es la pioglitazona aunque en general no se llaman glitazonas sino que

44
00:03:57,990 --> 00:04:04,230
las tiazoladinidionas y aparte de esto de acá al igual que la metformina tienen un

45
00:04:04,230 --> 00:04:08,310
bajo riesgo de hipoglicemia así que eventualmente son una alternativa para alguien que está

46
00:04:08,310 --> 00:04:12,750
haciendo mucha hipoglicemia con algún otro fármaco pero tienen un poco mayor riesgo

47
00:04:12,750 --> 00:04:18,190
cardiovascular y de insuficiencia cardíaca que otros hipoglicemiantes y eso ha hecho que

48
00:04:18,190 --> 00:04:24,310
hayan caído hasta cierto punto en desuso y que solamente se usan por el diabetólogo en

49
00:04:24,310 --> 00:04:28,270
algunos casos muy seleccionados así que en la práctica hay que saber que existen pero

50
00:04:28,270 --> 00:04:33,150
que lo más probable es que se va a usar otro tipo de hipoglicemiantes. Aparte de esto

51
00:04:33,150 --> 00:04:38,910
están los inhibidores de la dipeptilpeptidasa 4 acuérdense que la forma en que actúan es

52
00:04:38,910 --> 00:04:47,230
estimulando el sistema GLP-1 o sea en cuanto a eso se parecen un poco a los agonistas del

53
00:04:47,230 --> 00:04:53,430
GLP-1 que los vamos a ver después que a su vez aumenta la secreción de insulina son las que

54
00:04:53,430 --> 00:04:58,550
se denominan o se llaman comúnmente también como gliptinas que incluye la cita gliptina

55
00:04:58,590 --> 00:05:04,870
que es el más clásico la saxagliptina y la linagliptina esas son las tres pero si termina

56
00:05:04,870 --> 00:05:09,230
en gliptina se están refiriendo a esta familia de medicamentos y en particular quiero que sepan

57
00:05:09,230 --> 00:05:15,790
la cita gliptina son eficaces son más caros y no generan la hipoglicemia o al menos tienen

58
00:05:15,790 --> 00:05:20,990
un riesgo mucho menor que la sulfoniluria así que son los de segunda línea actualmente

59
00:05:20,990 --> 00:05:26,510
al menos según la guía Minsal se pueden usar igualmente otros fármacos de segunda línea

60
00:05:26,510 --> 00:05:31,430
según las guías internacionales como cosa importante es siempre y cuando haya recursos

61
00:05:31,430 --> 00:05:36,230
y también cuando hay un alto riesgo de hipoglicemia si es que hay un alto riesgo

62
00:05:36,230 --> 00:05:42,470
de hipoglicemia en ese caso yo no puedo dejar glibinclamida y estoy obligado a dejar

63
00:05:42,470 --> 00:05:47,310
o cita gliptina o algún otro fármaco ahora dentro de otra familia están los

64
00:05:47,310 --> 00:05:51,830
inhibidores de la alfa gluconidasa que lo único que hay que saber es que existe la

65
00:05:51,830 --> 00:05:56,750
acarbosa que ya no se usa porque es poco eficaz y finalmente en esta depositiva porque

66
00:05:56,750 --> 00:06:04,150
falta una depositiva completa las meglitinidas dentro de las cuales la más importante es la

67
00:06:04,150 --> 00:06:09,590
repaglinida y la nateglinida que son las famosas glinidas estas de acá hay que saber

68
00:06:09,590 --> 00:06:14,150
que por regla general actúan de una manera muy similar a las sulfonilurias y que por

69
00:06:14,150 --> 00:06:18,950
lo tanto tienen riesgo de hipoglicemia también eso sí tienen un poquito menos de riesgo que

70
00:06:18,950 --> 00:06:26,710
la glibinclamida pero aún así las indicaciones de este fármaco suelen ser las mismas que

71
00:06:26,710 --> 00:06:34,230
el de la sulfoniluria ya ahora veamos los últimos dos grupos los agonistas de la glp-1 que actúan

72
00:06:34,230 --> 00:06:40,750
aumentando la producción de insulina y que hay que saber que son los famosos glutides o

73
00:06:40,750 --> 00:06:46,670
incretinas también se llaman así que se incluye ahí el liraglutide el semaglutide y la

74
00:06:46,670 --> 00:06:55,230
dulaglutide y aparte están los inhibidores del transportador de glucosa renal tipo 2 que en

75
00:06:55,230 --> 00:07:02,030
este caso la forma en que actúan es generando glucosuria o sea es impide la reabsorción de

76
00:07:02,030 --> 00:07:06,550
glucosa a nivel renal y se pierde azúcar a través de la orina lo cual por un lado

77
00:07:06,550 --> 00:07:11,230
puede aumentar el riesgo de infección urinaria por ejemplo pero es bastante eficaz para

78
00:07:11,230 --> 00:07:17,830
evitar las hiperglicemias muy severas de hecho son buenos fármaco y sepan que su nombre termina

79
00:07:17,830 --> 00:07:23,630
habitualmente en glifosina y ahí está la empaglifosina la canaglifosina y la dapaglifosina

80
00:07:23,630 --> 00:07:29,630
no hay por qué saber todos los nombres pero al menos empaglifosina, liraglutide y de antes

81
00:07:29,630 --> 00:07:33,430
la citagliptina son tres nombres que yo recomiendo que sí se aprendan y que sepan

82
00:07:33,430 --> 00:07:39,230
a qué familia pertenece a cada uno ahora estas dos familias las vamos a ver en conjunto

83
00:07:39,230 --> 00:07:44,670
porque ambos son nuevos hipoglicemiantes y su beneficio son bien similares son eficaces son

84
00:07:44,670 --> 00:07:51,510
buenos pero son caros ya son mucho más caros que la metformina y que la gliven clamida no

85
00:07:51,510 --> 00:07:56,750
producen hipoglicemia o al menos tienen un riesgo mucho más bajo que el de la gliven clamida y

86
00:07:56,750 --> 00:08:02,110
aparte estos son muy buenos o son mejores que todos los demás en el caso de que haya un

87
00:08:02,110 --> 00:08:07,750
daño cardiovascular importante ejemplo una enfermedad arterial periférica enfermedad coronaria

88
00:08:07,750 --> 00:08:12,110
o ese tipo de cosas y en el caso de que haya falla renal en particular si falla renal con

89
00:08:12,110 --> 00:08:19,350
proteinuria con una macroalbuminuria en ese caso son mejores estos dos fármacos que la gliven

90
00:08:19,350 --> 00:08:28,630
clamida por ejemplo ahora los inhibidores de el transportador del sglut2 son además buenos

91
00:08:28,630 --> 00:08:33,550
en la insuficiencia cardiaca con falla cardiaca pero ya no son tan buenos en la insuficiencia

92
00:08:33,550 --> 00:08:38,190
renal severa con una caída en el clín es muy importante y la razón está relacionado con su

93
00:08:38,190 --> 00:08:44,830
mecanismo de acción dado que la empaglifocina por ejemplo actúa inhibiendo la reabsorción

94
00:08:44,830 --> 00:08:49,590
de glucosa o sea generando glucosuria y si yo tengo una falla renal muy grande obviamente

95
00:08:49,590 --> 00:08:55,830
va a ser poca la glucosa que se va a filtrar desde el principio así que actúa menos ahora

96
00:08:55,830 --> 00:09:03,110
estos dos grupos en particular los agonistas glp1 son de segunda línea igualmente cuando

97
00:09:03,110 --> 00:09:09,030
yo tengo recursos cuando tengo un alto riesgo de hipoglicemia igual que la citagliptina aunque

98
00:09:09,030 --> 00:09:15,430
la guía de minzal elija los dpp4 a la citagliptina al menos como para comprarlo

99
00:09:15,430 --> 00:09:21,270
en el sistema público ahora van a ser de elección estos dos grupos de acá cuando

100
00:09:21,270 --> 00:09:27,830
tengo una enfermedad arterial la enfermedad arterial aterosclerótica en general ejemplo

101
00:09:28,030 --> 00:09:34,750
una un aneurisma órtico abdominal enfermedad coronaria etcétera y también cuando tengo una

102
00:09:34,750 --> 00:09:40,670
insuficiencia renal crónica con macroalbuminuria mayor a 300 o bien cuando hay insuficiencia

103
00:09:40,670 --> 00:09:46,470
cardiaca que en ese caso los glu2 van a ser los más importantes y bueno arte información

104
00:09:46,470 --> 00:09:51,790
con algunas cosas que son relativamente nuevas pero que vale la pena saber en el sentido en

105
00:09:51,790 --> 00:09:56,830
que habiendo avanzado la tecnología y el tratamiento de los pacientes diabéticos tiene

106
00:09:56,830 --> 00:10:01,790
que avanzar el conocimiento también para ajustarse y optimizar el manejo de estos

107
00:10:01,790 --> 00:10:06,070
pacientes ahora lo más difícil es convencerlo que se tomen los remedios que estén bien',
    'En el tratamiento de la diabetes mellitus tipo 2, los hipoglicemiantes orales ocupan un lugar central. Es fundamental recordar desde el inicio que estos fármacos no tienen ningún rol en la diabetes tipo 1 ni en las formas autoinmunes: son exclusivos de la diabetes tipo 2. En esta cápsula repasaremos las principales familias, sus mecanismos de acción, sus ventajas y desventajas, y cuándo elegir uno por sobre otro.

Comencemos con las **biguanidas**, representadas principalmente por la **metformina**. Su mecanismo consiste en disminuir la resistencia a la insulina, aumentando la sensibilidad de los tejidos a ella. La metformina es el estándar de oro del tratamiento de primera línea: es barata, eficaz, segura y tiene un excelente perfil a largo plazo. Sus efectos adversos más frecuentes son gastrointestinales —diarrea, náuseas, vómitos, dolor abdominal— y generalmente se reducen al iniciar con dosis bajas y aumentar progresivamente, o usando la formulación de liberación prolongada (metformina XR). La ventaja más relevante desde la perspectiva de seguridad es que prácticamente no genera hipoglicemia. Sus contraindicaciones son la insuficiencia renal con creatinina igual o mayor a 1,5 mg/dL o clearance menor a 30 mL/min, y la insuficiencia cardíaca moderada a severa, por riesgo de acidosis láctica.

Las **sulfonilureas** actúan estimulando la secreción pancreática de insulina, por lo que requieren un páncreas funcionante. La más usada en Chile es la **glibenclamida** (también llamada gliburida). Sus principales desventajas son el riesgo de hipoglicemia —que es real y significativo— y el alza de peso. Estas limitaciones han desplazado a las sulfonilureas del lugar de segunda línea en muchos contextos. Dentro de las sulfonilureas más modernas están la **glipizida** y el **glimepirida**, que tienen menor riesgo de hipoglicemia pero son más caras. Las sulfonilureas siguen siendo el segundo escalón cuando los recursos son limitados y el riesgo de hipoglicemia no es alto.',
    '["La metformina es el hipoglicemiante de primera línea en DM2: barata, eficaz, sin hipoglicemia; contraindicada en creatinina ≥ 1,5 mg/dL, clearance < 30 mL/min e insuficiencia cardíaca severa.","La glibenclamida (sulfonilurea) es eficaz y barata, pero tiene riesgo significativo de hipoglicemia y alza de peso; no usar en adultos mayores ni en pacientes con hipoglicemias previas.","Las gliptinas (sitagliptina) son el segundo escalón preferido cuando hay riesgo de hipoglicemia o recursos suficientes; los agonistas GLP-1 (liraglutide) y los iSGLT2 (empagliflozina) se prefieren en enfermedad cardiovascular o renal establecida.","Los iSGLT2 son de elección en insuficiencia cardíaca, pero pierden eficacia en insuficiencia renal avanzada; los agonistas GLP-1 funcionan bien incluso en insuficiencia renal moderada.","Los inhibidores de alfa-glucosidasa (acarbosa) están en desuso por baja eficacia; las glitazonas (pioglitazona) se evitan por riesgo cardiovascular y de insuficiencia cardíaca."]'::jsonb,
    '[{"para":"\"META-GLIP-GLP-SGLT2 = la escalera de la DM2\":","nemotecnia":"\"META-GLIP-GLP-SGLT2 = la escalera de la DM2\":","explicacion":"Metformina primero siempre. Si no basta, GLIP (gliptinas) o GLP-1. Si hay falla cardíaca o renal, SGLT2. Así se sube la escalera del tratamiento.\nMetformina primero siempre. Si no basta, GLIP (gliptinas) o GLP-1. Si hay falla cardíaca o renal, SGLT2. Así se sube la escalera del tratamiento."},{"para":"\"SGLT2 = Saca Glucosa por la orina / GLP1 = Genera más insulina y Less peso\":","nemotecnia":"\"SGLT2 = Saca Glucosa por la orina / GLP1 = Genera más insulina y Less peso\":","explicacion":"iSGLT2 actúa en el riñón, generando glucosuria. GLP-1 actúa en el páncreas y reduce el apetito. Dos mecanismos distintos, beneficios cardiovasculares similares.iSGLT2 actúa en el riñón, generando glucosuria. GLP-1 actúa en el páncreas y reduce el apetito. Dos mecanismos distintos, beneficios cardiovasculares similares."},{"para":"\"Glibenclamida = Barata pero Baja demasiado\":","nemotecnia":"\"Glibenclamida = Barata pero Baja demasiado\":","explicacion":"La sulfonilurea clásica baja la glucosa pero también baja demasiado (hipoglicemia). Cuidado con adultos mayores: en ellos puede ser peligrosa.La sulfonilurea clásica baja la glucosa pero también baja demasiado (hipoglicemia). Cuidado con adultos mayores: en ellos puede ser peligrosa."}]'::jsonb,
    '["La metformina es el hipoglicemiante de primera línea en DM2: barata, eficaz, sin hipoglicemia; contraindicada en creatinina ≥ 1,5 mg/dL, clearance < 30 mL/min e insuficiencia cardíaca severa.","La glibenclamida (sulfonilurea) es eficaz y barata, pero tiene riesgo significativo de hipoglicemia y alza de peso; no usar en adultos mayores ni en pacientes con hipoglicemias previas.","Las gliptinas (sitagliptina) son el segundo escalón preferido cuando hay riesgo de hipoglicemia o recursos suficientes; los agonistas GLP-1 (liraglutide) y los iSGLT2 (empagliflozina) se prefieren en enfermedad cardiovascular o renal establecida."]'::jsonb,
    '[]'::jsonb,
    '[{"pregunta":"¿Cuál de las siguientes afirmaciones es correcta?","respuesta":"Respuesta correcta: C — Los iSGLT2 tienen indicación preferente en insuficiencia cardíaca y nefropatía con macroalbuminuria, pero al depender de la filtración glomerular para actuar, pierden eficacia cuando la función renal está gravemente comprometida."}]'::jsonb,
    NOW(),
    TRUE,
    FALSE  -- first 3 free preview
  ) ON CONFLICT (specialty_id, order_index)
  DO UPDATE SET
    title            = EXCLUDED.title,
    duration_seconds = EXCLUDED.duration_seconds,
    txt_content      = EXCLUDED.txt_content,
    srt_content      = EXCLUDED.srt_content,
    ai_summary       = EXCLUDED.ai_summary,
    ai_key_concepts  = EXCLUDED.ai_key_concepts,
    ai_mnemonics     = EXCLUDED.ai_mnemonics,
    ai_high_yield    = EXCLUDED.ai_high_yield,
    ai_review_qs     = EXCLUDED.ai_review_qs,
    ai_processed_at  = NOW(),
    is_available     = TRUE;

  -- Cápsula 8: Tratamiento Escalonado de la Diabetes Mellitus Tipo 2 — Algoritmo y Casos Clínicos
  INSERT INTO lessons (
    specialty_id, title, order_index, duration_seconds,
    txt_content, srt_content,
    ai_summary, ai_key_concepts, ai_mnemonics,
    ai_high_yield, ai_algorithms, ai_review_qs,
    ai_processed_at, is_available, is_free_preview
  ) VALUES (
    v_specialty_id,
    'Tratamiento Escalonado de la Diabetes Mellitus Tipo 2 — Algoritmo y Casos Clínicos',
    8,
    678,
    'Hola, hola, ¿cómo están? Entremos de lleno al tratamiento de la diabetes mellitus 2. Hay que saber

todos los pasos que hipoglicemiantes dejar, cuándo dejar insulina, etcétera, así que empecemos al

tiro. Sepan que el paso número uno es cambiar el estilo de vida, digas hacer deporte, dejar de

fumar, hacer dieta, bajar de peso en el caso de que venga con sobrepeso o con obesidad y

además iniciar metformina desde el diagnóstico. Actualmente la recomendación es, parta con

metformina de entrada y, si me preguntan, ¿hay alguna excepción? Pues podría haber una excepción

como para la vida real, al menos, un paciente con una diabetes leve, que tiene que ser leve,

o sea con una hemoglobina glicosilada apenas por sobre el óptimo y que venga con un

estilo de vida que no sea muy saludable pero que esté dispuesto a cambiarlo a un estilo

de vida bien saludable con tal de ahorrarse los fármacos. Uno dice, bueno, ya intentémoslo

y si en tres meses anda bien, se queda sin fármacos, pero la inmensa mayoría de los

diabéticos tipo 2 empiezan no sólo con el cambio en estilo de vida, sino que con metformina de

entrada. Ahora, el segundo paso que es cuando no he logrado un control glicémico adecuado,

entendido como que no he logrado bajar la hemoglobina glicosilada bajo 7 o bajo el

objetivo de control según su edad y su comorbilidad, en ese caso el segundo paso

es aumentar la dosis de metformina y si de ejemplo estaba con 500 cada 8, lo subo a un

gramo cada 8 o si es que estaba con 500 en la mañana, intento con 8.50 cada 12 horas, etcétera.

Ahora, cuando no es suficiente con eso tampoco y la hemoglobina glicosilada sigue arriba del

rango, pues lo que se hace es agregar un segundo hipoglicemiante oral. Ahora,

¿qué hipoglicemiante oral? La verdad es que va a depender de una serie de cosas que

vamos a ver en un rato más, pero en general aquí me quedo con la metformina y agrego un

medicamento adicional y fíjense, llegué a la dosis máxima de metformina antes de agregar el

segundo hipoglicemiante. Luego de eso, se sigue aumentando la dosis de este segundo

hipoglicemiante, o sea, antes de pasar la insulina yo me quedo con dos hipoglicemiantes

en dosis máxima y al menos yo les recomiendo que se sepan las dosis máximas de los

hipoglicemiantes más usados. En el caso de la metformina, la dosis máxima es 3 gramos al día,

1 gramo cada 8 horas, pero sepan que entre 2 y 3 es poca la diferencia, así que eventualmente

si alguien está con más de 2 gramos, con menos de 3 y con la hemoglobina glicosilada muy alta,

no me sirve seguir subiendo, ahí lo más probable es que le voy a agregar un segundo

hipoglicemiante. Ahora, en el caso de la glidenclemida, la dosis máxima al día es

20 milígramos al día, dígase 10 milígramos cada 12 horas, y esa es la forma en que

habitualmente se da. Y finalmente la cita agliptina, la dosis máxima son 100 milígramos al día,

que habitualmente se da 50 milígramos cada 12 horas. Ahora, el siguiente paso, que estoy

con los dos hipoglicemiantes y que sigo todavía con la hemoglobina glicosilada arriba de 7%,

es agregar insulina, y la forma en que se empieza es con insulina NPH, una dosis,

habitualmente en la noche. Y la dosis que habitualmente se deja son 10 unidades,

10 unidades subcutáneas de NPH una vez en la noche, aunque esa dosis puede variar según el

peso del paciente y algunas otras cosas, pero es la más habitual. Luego de eso, el paso

6 es habitualmente aumentar la NPH nocturna, pero siempre y cuando las glicemias de yuno

sigan muy altas, en el sentido en que acuérdense que la glicemia de yuno dependía

de la NPH nocturna, de la NPH de varias horas antes. En cambio, cuando la glicemia de yuno

está buena, lo que se suele agregar en cambio es una dosis de NPH, pero en la mañana,

que en específico acuérdense que bajaba las glicemias pre almuerzo y presena,

así que se deja siempre y cuando estén la glicemia de yuno buena, pero la glicemia

pre almuerzo y presena elevada. Finalmente, en el tratamiento de la diabetes 2 también se

pueden agregar estos refuerzos de insulina cristalina y habitualmente se hacía cuando

la glicemia pos comida estaban muy altas, en cambio las glicemias pre comidas estaban

buenas, porque acuérdense que las pre comidas incidían en las pos comidas,

así que si tengo las pos comidas malas y las pre comidas malas, lo que hago es ajustar

las NPH, pero si es que tengo la pos comida mala con la pre comida buena,

en ese caso solamente me queda ajustar las insulinas rápidas. Como cosa adicional,

en vez de las NPH también se puede dejar la insulina glargina o alguna otra de las

insulinas ultra lenta como el de temir o el de gludec. Ahora, sigamos con el tratamiento

de la diabetes 2. ¿Qué pasa cuando alguien está con metformina pero tiene

intolerancia a la metformina, le da diarrea, le da náuseas o alguna cosa de ese tipo?

Dado que la metformina es buena, bonita y barata, la recomendación actual es

intenté cambiar la dosificación y espaciarla o bien dejar los medicamentos de liberación

prolongada como la metformina XR, ya sea de 850 XR o de un gramo XR, la más frecuente es

la de 850 XR de liberación retardada y en el caso en que los síntomas gastrointestinales

sigan, pues no queda más que cambiarse a otro hipoglicemiante. O sea, suspendo la metformina

y voy a indicar un hipoglicemiante distinto. Ahora, cuando está contraindicada la metformina,

ejemplo en la falla renal o en la insuficiencia cardíaca, en ese caso lo habitual es que

estén contraindicados muchos de los otros hipoglicemiantes también, pero hay algunos

que no y en ese caso dejo este otro hipoglicemiante, pero la alternativa

obviamente es dejar insulina también. Si se acuerdan para la falla cardíaca y

para la falla renal me servían los GLP-1, me servían los SGLUT-2 y en el caso de la

falla cardíaca lo que más servía eran los SGLUT-2, pero que quede bien claro,

no está ahí, pero es importante, la insulina es una opción perfectamente aceptable también.

Cuando la hemoglobina glicosilada está muy elevada, arriba de 9%, o bien está arriba de

7 a 8% según cuál sea el objetivo de control glicémico de ese paciente en

específico y además estoy con los dos hipoglicemiantes en dosis máxima, ahí ya no puedo seguir subiendo ni

agregando más porque el máximo son dos de estos hipoglicemiantes y habitualmente lo que se

hace acá es iniciar insulina nomás, la insulina NPH y de entrada voy a ir a manejarlo de esa

forma. Ahora, como una opción a la insulina en el caso de que esté arriba de 9% es dejar

algunos de estos fármacos antidiabéticos nuevos como los agonistas del GLP-1, el peptido

símil al glucagón tipo 1. Ahora, algo importante que se pregunta y que hay que saber es una vez

que parto la insulina NPH en la diabetes 2, ¿debo mantener o debo suspender los hipoglicemiantes

orales? Y veamos lo que ocurre en la práctica, en la práctica la metformina se suele mantener,

en cambio los otros se suelen suspender sabiendo que no hay evidencia que de una u otra forma

obligue a quitarlos o a mantenerlos, yo podría suspender ambos o podría mantener ambos pero en

la práctica lo que ocurre es lo que está ahí. Eso sí, la decisión más correcta debería ser en

base a los recursos que hay, acuérdense que algunos hipoglicemiantes son caros, son más

caros que la insulina, aparte de esto la polifarmacia, si es alguien que está con muchos

medicamentos eventualmente puede servir el eliminar alguno de la lista y el peso,

acordándonos que la insulina hace que uno suba más de peso y ejemplo mantener la metformina es

algo que evita un poco la subida de peso y respecto a los otros hipoglicemiantes orales

y el peso va a depender de cada uno de ellos dado que algunos hacen que uno suba más de peso

y otros hacen que suba menos. Ahora, respondiendo la gran pregunta ¿y qué hipoglicemiante le

dejo a un diabético tipo 2? La respuesta siempre va a ser metformina de primera línea,

es buena, bonita, barata, segura, tiene todas las características que a uno le gusta en un

medicamento pero acuérdense que está contraindicada en la falla renal con un

clírens menor a 30 y también está contraindicada en la insuficiencia cardíaca

severa en el sentido en que tiene riesgo de acidosis láctica, así que ahí está

absolutamente contraindicada y debe dejar o insulina u otro hipoglicemiante que no esté

contraindicado. ¿Y qué pasa con el segundo hipoglicemiante? ¿Cuál dejo? Pues lo ideal es que

quede con un inhibidor de la dipeptidasa 4 como la citagliptina o un agonista del

GLP-1 como el liraglutide, por ejemplo, que si se acuerdan eran las hincretinas,

el liraglutide y los otros glutides, pero en la vida real muchas veces no hay dinero,

no hay recursos en el sistema de salud, así que ahí lo que se deja habitualmente es

glivenclamida no más. Ya glivenclamida es eficaz, es barata y sí tiene estos

riesgos de hipoglicemia, así que obviamente cuando ya está alguien con

hipoglicemia ahí no le puedo dejar glivenclamida y habrá que conseguir

recursos de alguna parte para dejarle o la citagliptina o el liraglutide y

lo mismo ocurre en los pacientes que tienen un riesgo muy alto como

alguien de más de 75 años, nuevamente el riesgo de hipoglicemia es muy

alto, así que tampoco va a quedar con glivenclamida, hasta es posible que se

pueda suspender la glivenclamida que estaba tomando antes dado que el

control glicémico se vuelve menos estricto, pero si es que hay que

mantener alguna cosa pues le voy a dejar o la citagliptina o el liraglutide

o alguna cosa de ese tipo. Acuérdense que en el caso de la

insuficiencia renal crónica con albuminuria estaba contraindicada la

metformina y tenían buenos resultados los GLP-1 y los SGLUT-2 y de hecho los

los SGLUT-2 acuérdense que me disminuían la progresión de la falla

renal los GLP-1 igual pero los SGLUT-2 que eran los que actuaban

mediante la inducción de glucosuria no funcionaban tan bien cuando la

falla renal era muy muy severa, ejemplo en un clearance bajo 30 lo

más probable es',
    '1
00:00:03,280 --> 00:00:07,920
Hola, hola, ¿cómo están? Entremos de lleno al tratamiento de la diabetes mellitus 2. Hay que saber

2
00:00:07,920 --> 00:00:13,000
todos los pasos que hipoglicemiantes dejar, cuándo dejar insulina, etcétera, así que empecemos al

3
00:00:13,000 --> 00:00:18,760
tiro. Sepan que el paso número uno es cambiar el estilo de vida, digas hacer deporte, dejar de

4
00:00:18,760 --> 00:00:24,400
fumar, hacer dieta, bajar de peso en el caso de que venga con sobrepeso o con obesidad y

5
00:00:24,400 --> 00:00:30,280
además iniciar metformina desde el diagnóstico. Actualmente la recomendación es, parta con

6
00:00:30,280 --> 00:00:36,920
metformina de entrada y, si me preguntan, ¿hay alguna excepción? Pues podría haber una excepción

7
00:00:36,920 --> 00:00:41,400
como para la vida real, al menos, un paciente con una diabetes leve, que tiene que ser leve,

8
00:00:41,400 --> 00:00:47,640
o sea con una hemoglobina glicosilada apenas por sobre el óptimo y que venga con un

9
00:00:47,640 --> 00:00:51,680
estilo de vida que no sea muy saludable pero que esté dispuesto a cambiarlo a un estilo

10
00:00:51,680 --> 00:00:57,160
de vida bien saludable con tal de ahorrarse los fármacos. Uno dice, bueno, ya intentémoslo

11
00:00:57,160 --> 00:01:01,600
y si en tres meses anda bien, se queda sin fármacos, pero la inmensa mayoría de los

12
00:01:01,600 --> 00:01:06,400
diabéticos tipo 2 empiezan no sólo con el cambio en estilo de vida, sino que con metformina de

13
00:01:06,400 --> 00:01:13,080
entrada. Ahora, el segundo paso que es cuando no he logrado un control glicémico adecuado,

14
00:01:13,080 --> 00:01:18,080
entendido como que no he logrado bajar la hemoglobina glicosilada bajo 7 o bajo el

15
00:01:18,080 --> 00:01:22,440
objetivo de control según su edad y su comorbilidad, en ese caso el segundo paso

16
00:01:22,440 --> 00:01:27,600
es aumentar la dosis de metformina y si de ejemplo estaba con 500 cada 8, lo subo a un

17
00:01:27,600 --> 00:01:32,760
gramo cada 8 o si es que estaba con 500 en la mañana, intento con 8.50 cada 12 horas, etcétera.

18
00:01:32,760 --> 00:01:38,760
Ahora, cuando no es suficiente con eso tampoco y la hemoglobina glicosilada sigue arriba del

19
00:01:38,760 --> 00:01:42,800
rango, pues lo que se hace es agregar un segundo hipoglicemiante oral. Ahora,

20
00:01:42,800 --> 00:01:46,160
¿qué hipoglicemiante oral? La verdad es que va a depender de una serie de cosas que

21
00:01:46,160 --> 00:01:52,280
vamos a ver en un rato más, pero en general aquí me quedo con la metformina y agrego un

22
00:01:52,280 --> 00:01:58,000
medicamento adicional y fíjense, llegué a la dosis máxima de metformina antes de agregar el

23
00:01:58,000 --> 00:02:04,000
segundo hipoglicemiante. Luego de eso, se sigue aumentando la dosis de este segundo

24
00:02:04,000 --> 00:02:08,400
hipoglicemiante, o sea, antes de pasar la insulina yo me quedo con dos hipoglicemiantes

25
00:02:08,400 --> 00:02:13,040
en dosis máxima y al menos yo les recomiendo que se sepan las dosis máximas de los

26
00:02:13,040 --> 00:02:17,960
hipoglicemiantes más usados. En el caso de la metformina, la dosis máxima es 3 gramos al día,

27
00:02:17,960 --> 00:02:23,360
1 gramo cada 8 horas, pero sepan que entre 2 y 3 es poca la diferencia, así que eventualmente

28
00:02:23,360 --> 00:02:29,640
si alguien está con más de 2 gramos, con menos de 3 y con la hemoglobina glicosilada muy alta,

29
00:02:29,640 --> 00:02:34,000
no me sirve seguir subiendo, ahí lo más probable es que le voy a agregar un segundo

30
00:02:34,000 --> 00:02:38,280
hipoglicemiante. Ahora, en el caso de la glidenclemida, la dosis máxima al día es

31
00:02:38,280 --> 00:02:44,160
20 milígramos al día, dígase 10 milígramos cada 12 horas, y esa es la forma en que

32
00:02:44,160 --> 00:02:48,880
habitualmente se da. Y finalmente la cita agliptina, la dosis máxima son 100 milígramos al día,

33
00:02:48,880 --> 00:02:56,280
que habitualmente se da 50 milígramos cada 12 horas. Ahora, el siguiente paso, que estoy

34
00:02:56,280 --> 00:03:01,400
con los dos hipoglicemiantes y que sigo todavía con la hemoglobina glicosilada arriba de 7%,

35
00:03:01,400 --> 00:03:06,720
es agregar insulina, y la forma en que se empieza es con insulina NPH, una dosis,

36
00:03:06,720 --> 00:03:13,800
habitualmente en la noche. Y la dosis que habitualmente se deja son 10 unidades,

37
00:03:13,800 --> 00:03:19,440
10 unidades subcutáneas de NPH una vez en la noche, aunque esa dosis puede variar según el

38
00:03:19,440 --> 00:03:25,400
peso del paciente y algunas otras cosas, pero es la más habitual. Luego de eso, el paso

39
00:03:25,400 --> 00:03:31,000
6 es habitualmente aumentar la NPH nocturna, pero siempre y cuando las glicemias de yuno

40
00:03:31,000 --> 00:03:34,920
sigan muy altas, en el sentido en que acuérdense que la glicemia de yuno dependía

41
00:03:34,920 --> 00:03:40,520
de la NPH nocturna, de la NPH de varias horas antes. En cambio, cuando la glicemia de yuno

42
00:03:40,520 --> 00:03:47,680
está buena, lo que se suele agregar en cambio es una dosis de NPH, pero en la mañana,

43
00:03:47,680 --> 00:03:52,400
que en específico acuérdense que bajaba las glicemias pre almuerzo y presena,

44
00:03:52,400 --> 00:03:57,360
así que se deja siempre y cuando estén la glicemia de yuno buena, pero la glicemia

45
00:03:57,360 --> 00:04:02,560
pre almuerzo y presena elevada. Finalmente, en el tratamiento de la diabetes 2 también se

46
00:04:02,560 --> 00:04:07,840
pueden agregar estos refuerzos de insulina cristalina y habitualmente se hacía cuando

47
00:04:07,840 --> 00:04:13,280
la glicemia pos comida estaban muy altas, en cambio las glicemias pre comidas estaban

48
00:04:13,280 --> 00:04:17,720
buenas, porque acuérdense que las pre comidas incidían en las pos comidas,

49
00:04:17,720 --> 00:04:22,240
así que si tengo las pos comidas malas y las pre comidas malas, lo que hago es ajustar

50
00:04:22,240 --> 00:04:26,960
las NPH, pero si es que tengo la pos comida mala con la pre comida buena,

51
00:04:26,960 --> 00:04:31,840
en ese caso solamente me queda ajustar las insulinas rápidas. Como cosa adicional,

52
00:04:31,840 --> 00:04:38,280
en vez de las NPH también se puede dejar la insulina glargina o alguna otra de las

53
00:04:38,280 --> 00:04:44,160
insulinas ultra lenta como el de temir o el de gludec. Ahora, sigamos con el tratamiento

54
00:04:44,160 --> 00:04:48,960
de la diabetes 2. ¿Qué pasa cuando alguien está con metformina pero tiene

55
00:04:48,960 --> 00:04:53,480
intolerancia a la metformina, le da diarrea, le da náuseas o alguna cosa de ese tipo?

56
00:04:53,480 --> 00:04:57,960
Dado que la metformina es buena, bonita y barata, la recomendación actual es

57
00:04:57,960 --> 00:05:04,320
intenté cambiar la dosificación y espaciarla o bien dejar los medicamentos de liberación

58
00:05:04,320 --> 00:05:13,160
prolongada como la metformina XR, ya sea de 850 XR o de un gramo XR, la más frecuente es

59
00:05:13,160 --> 00:05:19,440
la de 850 XR de liberación retardada y en el caso en que los síntomas gastrointestinales

60
00:05:19,440 --> 00:05:25,520
sigan, pues no queda más que cambiarse a otro hipoglicemiante. O sea, suspendo la metformina

61
00:05:25,520 --> 00:05:32,000
y voy a indicar un hipoglicemiante distinto. Ahora, cuando está contraindicada la metformina,

62
00:05:32,000 --> 00:05:38,040
ejemplo en la falla renal o en la insuficiencia cardíaca, en ese caso lo habitual es que

63
00:05:38,040 --> 00:05:42,240
estén contraindicados muchos de los otros hipoglicemiantes también, pero hay algunos

64
00:05:42,240 --> 00:05:45,960
que no y en ese caso dejo este otro hipoglicemiante, pero la alternativa

65
00:05:45,960 --> 00:05:50,080
obviamente es dejar insulina también. Si se acuerdan para la falla cardíaca y

66
00:05:50,080 --> 00:05:56,520
para la falla renal me servían los GLP-1, me servían los SGLUT-2 y en el caso de la

67
00:05:56,520 --> 00:06:01,600
falla cardíaca lo que más servía eran los SGLUT-2, pero que quede bien claro,

68
00:06:01,600 --> 00:06:06,480
no está ahí, pero es importante, la insulina es una opción perfectamente aceptable también.

69
00:06:06,480 --> 00:06:13,280
Cuando la hemoglobina glicosilada está muy elevada, arriba de 9%, o bien está arriba de

70
00:06:13,280 --> 00:06:19,400
7 a 8% según cuál sea el objetivo de control glicémico de ese paciente en

71
00:06:19,440 --> 00:06:25,440
específico y además estoy con los dos hipoglicemiantes en dosis máxima, ahí ya no puedo seguir subiendo ni

72
00:06:25,440 --> 00:06:31,360
agregando más porque el máximo son dos de estos hipoglicemiantes y habitualmente lo que se

73
00:06:31,360 --> 00:06:38,440
hace acá es iniciar insulina nomás, la insulina NPH y de entrada voy a ir a manejarlo de esa

74
00:06:38,440 --> 00:06:45,640
forma. Ahora, como una opción a la insulina en el caso de que esté arriba de 9% es dejar

75
00:06:45,640 --> 00:06:53,040
algunos de estos fármacos antidiabéticos nuevos como los agonistas del GLP-1, el peptido

76
00:06:53,040 --> 00:07:00,200
símil al glucagón tipo 1. Ahora, algo importante que se pregunta y que hay que saber es una vez

77
00:07:00,200 --> 00:07:05,680
que parto la insulina NPH en la diabetes 2, ¿debo mantener o debo suspender los hipoglicemiantes

78
00:07:05,680 --> 00:07:11,240
orales? Y veamos lo que ocurre en la práctica, en la práctica la metformina se suele mantener,

79
00:07:11,240 --> 00:07:17,120
en cambio los otros se suelen suspender sabiendo que no hay evidencia que de una u otra forma

80
00:07:17,120 --> 00:07:22,520
obligue a quitarlos o a mantenerlos, yo podría suspender ambos o podría mantener ambos pero en

81
00:07:22,520 --> 00:07:27,720
la práctica lo que ocurre es lo que está ahí. Eso sí, la decisión más correcta debería ser en

82
00:07:27,720 --> 00:07:31,360
base a los recursos que hay, acuérdense que algunos hipoglicemiantes son caros, son más

83
00:07:31,360 --> 00:07:35,680
caros que la insulina, aparte de esto la polifarmacia, si es alguien que está con muchos

84
00:07:35,680 --> 00:07:41,800
medicamentos eventualmente puede servir el eliminar alguno de la lista y el peso,

85
00:07:41,800 --> 00:07:47,760
acordándonos que la insulina hace que uno suba más de peso y ejemplo mantener la metformina es

86
00:07:47,760 --> 00:07:53,080
algo que evita un poco la subida de peso y respecto a los otros hipoglicemiantes orales

87
00:07:53,080 --> 00:07:56,880
y el peso va a depender de cada uno de ellos dado que algunos hacen que uno suba más de peso

88
00:07:56,880 --> 00:08:02,720
y otros hacen que suba menos. Ahora, respondiendo la gran pregunta ¿y qué hipoglicemiante le

89
00:08:02,720 --> 00:08:07,600
dejo a un diabético tipo 2? La respuesta siempre va a ser metformina de primera línea,

90
00:08:07,600 --> 00:08:13,560
es buena, bonita, barata, segura, tiene todas las características que a uno le gusta en un

91
00:08:13,560 --> 00:08:18,400
medicamento pero acuérdense que está contraindicada en la falla renal con un

92
00:08:18,400 --> 00:08:22,800
clírens menor a 30 y también está contraindicada en la insuficiencia cardíaca

93
00:08:22,800 --> 00:08:26,840
severa en el sentido en que tiene riesgo de acidosis láctica, así que ahí está

94
00:08:26,840 --> 00:08:31,160
absolutamente contraindicada y debe dejar o insulina u otro hipoglicemiante que no esté

95
00:08:31,160 --> 00:08:37,080
contraindicado. ¿Y qué pasa con el segundo hipoglicemiante? ¿Cuál dejo? Pues lo ideal es que

96
00:08:37,080 --> 00:08:43,840
quede con un inhibidor de la dipeptidasa 4 como la citagliptina o un agonista del

97
00:08:43,840 --> 00:08:49,480
GLP-1 como el liraglutide, por ejemplo, que si se acuerdan eran las hincretinas,

98
00:08:49,480 --> 00:08:57,280
el liraglutide y los otros glutides, pero en la vida real muchas veces no hay dinero,

99
00:08:57,280 --> 00:09:01,200
no hay recursos en el sistema de salud, así que ahí lo que se deja habitualmente es

100
00:09:01,200 --> 00:09:06,360
glivenclamida no más. Ya glivenclamida es eficaz, es barata y sí tiene estos

101
00:09:06,360 --> 00:09:10,000
riesgos de hipoglicemia, así que obviamente cuando ya está alguien con

102
00:09:10,000 --> 00:09:13,840
hipoglicemia ahí no le puedo dejar glivenclamida y habrá que conseguir

103
00:09:13,840 --> 00:09:18,640
recursos de alguna parte para dejarle o la citagliptina o el liraglutide y

104
00:09:18,640 --> 00:09:21,680
lo mismo ocurre en los pacientes que tienen un riesgo muy alto como

105
00:09:21,680 --> 00:09:25,840
alguien de más de 75 años, nuevamente el riesgo de hipoglicemia es muy

106
00:09:25,840 --> 00:09:30,760
alto, así que tampoco va a quedar con glivenclamida, hasta es posible que se

107
00:09:30,760 --> 00:09:34,640
pueda suspender la glivenclamida que estaba tomando antes dado que el

108
00:09:34,640 --> 00:09:37,840
control glicémico se vuelve menos estricto, pero si es que hay que

109
00:09:37,840 --> 00:09:42,960
mantener alguna cosa pues le voy a dejar o la citagliptina o el liraglutide

110
00:09:42,960 --> 00:09:46,800
o alguna cosa de ese tipo. Acuérdense que en el caso de la

111
00:09:46,800 --> 00:09:52,120
insuficiencia renal crónica con albuminuria estaba contraindicada la

112
00:09:52,120 --> 00:09:58,160
metformina y tenían buenos resultados los GLP-1 y los SGLUT-2 y de hecho los

113
00:09:58,160 --> 00:10:03,680
los SGLUT-2 acuérdense que me disminuían la progresión de la falla

114
00:10:03,680 --> 00:10:09,280
renal los GLP-1 igual pero los SGLUT-2 que eran los que actuaban

115
00:10:09,280 --> 00:10:12,920
mediante la inducción de glucosuria no funcionaban tan bien cuando la

116
00:10:12,920 --> 00:10:17,280
falla renal era muy muy severa, ejemplo en un clearance bajo 30 lo

117
00:10:17,280 --> 00:10:22,320
más probable es que va a quedar con un GLP-1 más que con un SGLUT-2 y

118
00:10:22,320 --> 00:10:27,200
obviamente como alternativa en toda falla renal la insulina la insulina

119
00:10:27,200 --> 00:10:32,760
NPH siempre fue el manejo de la diabetes con falla renal pero

120
00:10:32,760 --> 00:10:36,280
actualmente estos medicamentos igualmente sirven. Si tiene un

121
00:10:36,280 --> 00:10:40,200
infarto previo tiene un riesgo cardiovascular muy alto la verdad que

122
00:10:40,200 --> 00:10:47,680
también va a quedar o con los blocadores del SGLUT-2 o con los

123
00:10:47,680 --> 00:10:53,560
agonistas del GLP-1 ya que dijimos que servían en particular para disminuir la

124
00:10:53,560 --> 00:10:56,600
progresión de la enfermedad cardiovascular y por supuesto la

125
00:10:56,600 --> 00:10:59,600
insulina es una buena opción también y finalmente en la falla

126
00:10:59,600 --> 00:11:02,720
cardiaca contraindicada la metformina contraindicada la glivia

127
00:11:02,720 --> 00:11:08,520
inclamida y aquí me servía más que los GLP-1 los SGLUT-2 y obviamente la

128
00:11:08,520 --> 00:11:13,440
insulina también así que fíjense muchos detalles veámoslos ahí de nuevo

129
00:11:13,440 --> 00:11:18,320
esos detalles sirven de una otra forma para optimizar el manejo del

130
00:11:18,320 --> 00:11:22,480
paciente diabético así que aprendérselo que estén bien',
    'En esta cápsula ponemos en práctica todo lo visto sobre hipoglicemiantes e insulina, ahora en el contexto del tratamiento escalonado de la diabetes mellitus tipo 2. Hay que saber no solo qué fármacos existen, sino cuándo avanzar al siguiente escalón, con qué dosis y qué hacer cuando aparecen complicaciones o situaciones especiales.

El punto de partida, el **primer paso**, es siempre doble: cambio de estilo de vida —dejar de fumar, hacer actividad física, adoptar una dieta saludable, bajar de peso si hay sobrepeso u obesidad— e inicio de **metformina** desde el diagnóstico. En la práctica existe una excepción muy acotada: un paciente con diabetes leve —HbA1c apenas sobre el objetivo— que esté muy motivado a cambiar su estilo de vida podría intentar tres meses solo con cambios dietéticos y de actividad. Pero esto es la excepción; la regla es metformina de entrada.

Si la HbA1c no llega al objetivo, el **segundo paso** es aumentar la dosis de metformina. La dosis máxima es de **3 gramos al día** —1 gramo cada 8 horas—, aunque entre 2 y 3 gramos la diferencia de eficacia es marginal, y si ya está con más de 2 gramos sin lograr el objetivo, probablemente convenga agregar un segundo fármaco.',
    '["El tratamiento de la DM2 se inicia siempre con cambios de estilo de vida más metformina; la dosis máxima de metformina es 3 g/día (1 g cada 8 horas).","Si con metformina en dosis máxima no se logra el objetivo, se agrega un segundo hipoglicemiante: gliptina (sitagliptina 100 mg/día) si hay recursos o riesgo de hipoglicemia; glibenclamida (máx. 20 mg/día) si hay restricción de recursos y bajo riesgo.","La insulina NPH nocturna (10 unidades de inicio) se indica cuando dos hipoglicemiantes en dosis máxima no logran el objetivo, o cuando HbA1c > 9% de entrada.","Al iniciar insulina en DM2, la práctica habitual es mantener metformina y suspender los otros hipoglicemiantes.","En enfermedad cardiovascular establecida o nefropatía con macroalbuminuria, se prefieren agonistas GLP-1 o iSGLT2 como segundo fármaco; en insuficiencia cardíaca, los iSGLT2 son los de mayor beneficio."]'::jsonb,
    '[{"para":"\"META → META MAX → SEGUNDA LÍNEA → NPH → NPH+CRISTALINA\":","nemotecnia":"\"META → META MAX → SEGUNDA LÍNEA → NPH → NPH+CRISTALINA\":","explicacion":"Esta secuencia de 5 pasos resume el algoritmo completo del tratamiento de la DM2. Cada flecha representa un escalón al que se llega cuando el anterior no logra el objetivo de HbA1c.\nEsta secuencia de 5 pasos resume el algoritmo completo del tratamiento de la DM2. Cada flecha representa un escalón al que se llega cuando el anterior no logra el objetivo de HbA1c."},{"para":"\"9% = insulina sin escalas\":","nemotecnia":"\"9% = insulina sin escalas\":","explicacion":"Si la HbA1c llega al 9%, no hay tiempo para jugar con hipoglicemiantes. Directo a la insulina NPH.Si la HbA1c llega al 9%, no hay tiempo para jugar con hipoglicemiantes. Directo a la insulina NPH."},{"para":"\"Cardio/Renal = GLP1 o SGLT2\":","nemotecnia":"\"Cardio/Renal = GLP1 o SGLT2\":","explicacion":"Cuando el diabético tiene daño cardiovascular o renal, la elección del segundo hipoglicemiante no es la glibenclamida: es GLP-1 o SGLT2.Cuando el diabético tiene daño cardiovascular o renal, la elección del segundo hipoglicemiante no es la glibenclamida: es GLP-1 o SGLT2."}]'::jsonb,
    '["El tratamiento de la DM2 se inicia siempre con cambios de estilo de vida más metformina; la dosis máxima de metformina es 3 g/día (1 g cada 8 horas).","Si con metformina en dosis máxima no se logra el objetivo, se agrega un segundo hipoglicemiante: gliptina (sitagliptina 100 mg/día) si hay recursos o riesgo de hipoglicemia; glibenclamida (máx. 20 mg/día) si hay restricción de recursos y bajo riesgo.","La insulina NPH nocturna (10 unidades de inicio) se indica cuando dos hipoglicemiantes en dosis máxima no logran el objetivo, o cuando HbA1c > 9% de entrada."]'::jsonb,
    '[]'::jsonb,
    '[{"pregunta":"¿Cuál de las siguientes afirmaciones sobre el tratamiento de la DM2 es correcta?","respuesta":"Respuesta correcta: D — Al agregar insulina NPH en DM2, la metformina se mantiene habitualmente por su efecto sinérgico y control de peso; los demás hipoglicemiantes (como la glibenclamida) se suspenden para simplificar el esquema y evitar hipoglicemias."}]'::jsonb,
    NOW(),
    TRUE,
    FALSE  -- first 3 free preview
  ) ON CONFLICT (specialty_id, order_index)
  DO UPDATE SET
    title            = EXCLUDED.title,
    duration_seconds = EXCLUDED.duration_seconds,
    txt_content      = EXCLUDED.txt_content,
    srt_content      = EXCLUDED.srt_content,
    ai_summary       = EXCLUDED.ai_summary,
    ai_key_concepts  = EXCLUDED.ai_key_concepts,
    ai_mnemonics     = EXCLUDED.ai_mnemonics,
    ai_high_yield    = EXCLUDED.ai_high_yield,
    ai_review_qs     = EXCLUDED.ai_review_qs,
    ai_processed_at  = NOW(),
    is_available     = TRUE;

  -- Cápsula 9: Tratamiento de la Diabetes en el Embarazo — Control Glucémico
  INSERT INTO lessons (
    specialty_id, title, order_index, duration_seconds,
    txt_content, srt_content,
    ai_summary, ai_key_concepts, ai_mnemonics,
    ai_high_yield, ai_algorithms, ai_review_qs,
    ai_processed_at, is_available, is_free_preview
  ) VALUES (
    v_specialty_id,
    'Tratamiento de la Diabetes en el Embarazo — Control Glucémico',
    9,
    318,
    'La diabetes en el embarazo se trata de manera diferente a las pacientes no embarazadas,

así que veamos acá, número uno, cuál es el objetivo metabólico en el embarazo que cambia,

en este caso son las glicemias, se pide que las precomidas, que las preprandiales estén en

ese rango menor a 90, en algunas partes sale 60 a 90, en otras sale 70 a 90,

pero lo importante es menor a 90 y que no haga hipoglicemia. Segundo lugar,

las glicemias postcomidas, el objetivo es que estén abajo de 120, en algunas partes

sale 100 a 120, en otras 80 a 120 y en otras 90 a 120, pero quedémonos con las preprandiales

menor a 90 y las postprandiales menor a 120. Fíjense, mucho más estricto de lo que soy

en una paciente no embarazada o en un hombre, y las razones son que un buen

control metabólico estricto disminuye el riesgo fetal y el riesgo en el embarazo,

y en este caso es una paciente embarazada. Ahora, la forma en que se controlan estas

glicemias es con controles con hemoglucotest bien seguido. Cuatro hemoglucotest al día

es lo ideal, algunos precomidas, otros postcomidas, y ahí se van alternando

en los distintos días de la semana en qué horario se va a medir su glicemia y se va

registrando, de manera que cada dos semanas va a control con su cartilla, con los promedios

de hemoglucotest, y con eso se decide qué ajuste hacer, si se pone insulina o no,

si se sube la dosis, si se baja, etcétera. Ahora, ¿y qué pasa con la hemoglobina

glicosilada? La hemoglobina A1C, que era la forma en la que habitualmente se hacía

el control en las personas diabéticas no embarazadas, y la verdad es que acá

no me sirve mucho, porque se demora mucho en alterarse. El embarazo en total dura

nueve meses, y esta se pide cada tres meses, y desde ahora hasta que pasen tres meses,

la guagua a lo mejor ya va, y con la guagua me refiero al bebé, ya va a haber nacido y va

a pesar seis kilos, así que no me sirve. Lo que uno hace es controlar con glicemia,

pero en la vida real, la verdad es que sí está indicado igual pedir la hemoglobina A1C

cada seis a ocho semanas como una forma de objetivar el control metabólico con algo que

sea menos lábil que las glicemias, pero la toma de decisiones, repito, se basa en

los controles de glicemia en la casa, con los hemoglocoteses de la casa. Ahora,

¿cuál es el tratamiento de la diabetes mellitus gestacional y de la diabetes mellitus

pregestacional? Por lo general, se parte siempre con dieta, una dieta bien estricta,

con harto control glicémico, y si no anda bien, pues insulina, directamente a la insulina,

y el esquema habitual es NPH, que es la forma en que se inicia, de hecho,

habitualmente quedan solamente con NPH y con eso andan bien, en una o dos dosis al día,

y en los casos en que vengan con un control glicémico no óptimo con la NPH, pues se puede

agregar la insulina cristalina. En el embarazo ya no es tan fácil llegar y meter ni las

ultra rápidas ni las ultra lentas porque hay menos estudios, aunque la verdad es que los

pocos estudios que hay dicen que sí son seguras, pero la argina, por ejemplo,

se recomienda no usarla en el embarazo porque todavía no está 100% clara su seguridad,

en cambio la NPH queda súper clara que no tiene ningún problema en el embarazo.

Ahora, ¿qué pasa con los hipoglicemiantes orales? ¿Se pueden dar en el embarazo o no?

Y la verdad es que la evidencia es súper clara, es contundente, es abundante y

dice que son seguros, pero solamente esos dos que están ahí, la metformina y la

glivenclamida o gliburida, son los dos medicamentos que se pueden dejar antes de

que se embarace, se pueden mantener en el embarazo, se pueden incluso iniciar durante

el embarazo, pero en la práctica las recomendaciones siempre son en el embarazo,

prefiera insulina, aunque sepa que esos dos hipoglicemiantes sí son seguros y

eventualmente se pueden mantener, así que es una decisión que se toma junto

con la paciente y con el médico tratante. Ahora, ¿qué pasa con alguien que es

diabética, todavía no es embarazado y se quiere embarazar? Pues dos cosas,

número uno, uno le dice ojalá no se embarace todavía, espere a estar con

un control glicémico óptimo, ya sea con los hipoglicemiantes o idealmente con

insulina para que se embarace ya con insulina y cuando tenga una hemoglobina

licosilada bajo 7%, ahora sí embarazarse, antes idealmente no. En el

caso del parto, hay que saber que el parto es un momento de estrés y

ustedes se acuerdan que el estrés puede inducir una hiperglicemia,

pero además es un momento de mucho consumo de energía y eso puede

inducir una hipoglicemia, así que hay riesgo de las dos cosas, de que se

escompense hacia arriba o hacia abajo y lo más frecuente es que haga

hipoglicemia, así que lo importante es que durante el parto no solamente que

se maneje con su insulina o con lo que sea que esté siendo

tratada en ese momento, sino que además debe controlarse muy

seguidamente con hemoglucotés y aparte de eso se va a ver la

necesidad de dejar la insulina cristalina o no. En la práctica muchas

veces no se requiere dejar nada de insulina porque el mismo útero se

lleva toda la glucosa, así que no alcanza a subir. Y bueno, eso fue todo,

nos vemos en el siguiente vídeo que vamos a ver el manejo obstétrico de

la diabetes gestacional. Que estén bien.',
    '1
00:00:03,250 --> 00:00:08,690
La diabetes en el embarazo se trata de manera diferente a las pacientes no embarazadas,

2
00:00:08,690 --> 00:00:13,970
así que veamos acá, número uno, cuál es el objetivo metabólico en el embarazo que cambia,

3
00:00:13,970 --> 00:00:19,650
en este caso son las glicemias, se pide que las precomidas, que las preprandiales estén en

4
00:00:19,650 --> 00:00:25,170
ese rango menor a 90, en algunas partes sale 60 a 90, en otras sale 70 a 90,

5
00:00:25,170 --> 00:00:29,450
pero lo importante es menor a 90 y que no haga hipoglicemia. Segundo lugar,

6
00:00:29,450 --> 00:00:34,410
las glicemias postcomidas, el objetivo es que estén abajo de 120, en algunas partes

7
00:00:34,410 --> 00:00:40,690
sale 100 a 120, en otras 80 a 120 y en otras 90 a 120, pero quedémonos con las preprandiales

8
00:00:40,690 --> 00:00:45,290
menor a 90 y las postprandiales menor a 120. Fíjense, mucho más estricto de lo que soy

9
00:00:45,290 --> 00:00:50,810
en una paciente no embarazada o en un hombre, y las razones son que un buen

10
00:00:50,810 --> 00:00:55,410
control metabólico estricto disminuye el riesgo fetal y el riesgo en el embarazo,

11
00:00:55,410 --> 00:01:01,010
y en este caso es una paciente embarazada. Ahora, la forma en que se controlan estas

12
00:01:01,010 --> 00:01:07,250
glicemias es con controles con hemoglucotest bien seguido. Cuatro hemoglucotest al día

13
00:01:07,250 --> 00:01:11,610
es lo ideal, algunos precomidas, otros postcomidas, y ahí se van alternando

14
00:01:11,610 --> 00:01:16,450
en los distintos días de la semana en qué horario se va a medir su glicemia y se va

15
00:01:16,450 --> 00:01:21,570
registrando, de manera que cada dos semanas va a control con su cartilla, con los promedios

16
00:01:21,570 --> 00:01:26,130
de hemoglucotest, y con eso se decide qué ajuste hacer, si se pone insulina o no,

17
00:01:26,130 --> 00:01:31,010
si se sube la dosis, si se baja, etcétera. Ahora, ¿y qué pasa con la hemoglobina

18
00:01:31,010 --> 00:01:35,050
glicosilada? La hemoglobina A1C, que era la forma en la que habitualmente se hacía

19
00:01:35,050 --> 00:01:39,090
el control en las personas diabéticas no embarazadas, y la verdad es que acá

20
00:01:39,090 --> 00:01:45,210
no me sirve mucho, porque se demora mucho en alterarse. El embarazo en total dura

21
00:01:45,210 --> 00:01:49,370
nueve meses, y esta se pide cada tres meses, y desde ahora hasta que pasen tres meses,

22
00:01:49,370 --> 00:01:54,290
la guagua a lo mejor ya va, y con la guagua me refiero al bebé, ya va a haber nacido y va

23
00:01:54,290 --> 00:02:00,330
a pesar seis kilos, así que no me sirve. Lo que uno hace es controlar con glicemia,

24
00:02:00,330 --> 00:02:05,310
pero en la vida real, la verdad es que sí está indicado igual pedir la hemoglobina A1C

25
00:02:05,310 --> 00:02:12,410
cada seis a ocho semanas como una forma de objetivar el control metabólico con algo que

26
00:02:12,410 --> 00:02:17,330
sea menos lábil que las glicemias, pero la toma de decisiones, repito, se basa en

27
00:02:17,330 --> 00:02:21,970
los controles de glicemia en la casa, con los hemoglocoteses de la casa. Ahora,

28
00:02:21,970 --> 00:02:25,810
¿cuál es el tratamiento de la diabetes mellitus gestacional y de la diabetes mellitus

29
00:02:25,810 --> 00:02:30,410
pregestacional? Por lo general, se parte siempre con dieta, una dieta bien estricta,

30
00:02:30,410 --> 00:02:36,050
con harto control glicémico, y si no anda bien, pues insulina, directamente a la insulina,

31
00:02:36,050 --> 00:02:41,450
y el esquema habitual es NPH, que es la forma en que se inicia, de hecho,

32
00:02:41,450 --> 00:02:46,290
habitualmente quedan solamente con NPH y con eso andan bien, en una o dos dosis al día,

33
00:02:46,290 --> 00:02:51,650
y en los casos en que vengan con un control glicémico no óptimo con la NPH, pues se puede

34
00:02:51,650 --> 00:02:57,370
agregar la insulina cristalina. En el embarazo ya no es tan fácil llegar y meter ni las

35
00:02:57,370 --> 00:03:01,010
ultra rápidas ni las ultra lentas porque hay menos estudios, aunque la verdad es que los

36
00:03:01,010 --> 00:03:05,250
pocos estudios que hay dicen que sí son seguras, pero la argina, por ejemplo,

37
00:03:05,250 --> 00:03:09,890
se recomienda no usarla en el embarazo porque todavía no está 100% clara su seguridad,

38
00:03:09,890 --> 00:03:14,010
en cambio la NPH queda súper clara que no tiene ningún problema en el embarazo.

39
00:03:14,690 --> 00:03:19,250
Ahora, ¿qué pasa con los hipoglicemiantes orales? ¿Se pueden dar en el embarazo o no?

40
00:03:19,250 --> 00:03:25,090
Y la verdad es que la evidencia es súper clara, es contundente, es abundante y

41
00:03:25,090 --> 00:03:29,450
dice que son seguros, pero solamente esos dos que están ahí, la metformina y la

42
00:03:29,450 --> 00:03:34,450
glivenclamida o gliburida, son los dos medicamentos que se pueden dejar antes de

43
00:03:34,450 --> 00:03:38,850
que se embarace, se pueden mantener en el embarazo, se pueden incluso iniciar durante

44
00:03:38,850 --> 00:03:43,490
el embarazo, pero en la práctica las recomendaciones siempre son en el embarazo,

45
00:03:43,490 --> 00:03:47,810
prefiera insulina, aunque sepa que esos dos hipoglicemiantes sí son seguros y

46
00:03:47,810 --> 00:03:52,250
eventualmente se pueden mantener, así que es una decisión que se toma junto

47
00:03:52,250 --> 00:03:58,090
con la paciente y con el médico tratante. Ahora, ¿qué pasa con alguien que es

48
00:03:58,090 --> 00:04:02,890
diabética, todavía no es embarazado y se quiere embarazar? Pues dos cosas,

49
00:04:02,890 --> 00:04:08,770
número uno, uno le dice ojalá no se embarace todavía, espere a estar con

50
00:04:08,770 --> 00:04:13,210
un control glicémico óptimo, ya sea con los hipoglicemiantes o idealmente con

51
00:04:13,210 --> 00:04:16,330
insulina para que se embarace ya con insulina y cuando tenga una hemoglobina

52
00:04:16,330 --> 00:04:21,890
licosilada bajo 7%, ahora sí embarazarse, antes idealmente no. En el

53
00:04:21,890 --> 00:04:27,250
caso del parto, hay que saber que el parto es un momento de estrés y

54
00:04:27,250 --> 00:04:31,010
ustedes se acuerdan que el estrés puede inducir una hiperglicemia,

55
00:04:31,010 --> 00:04:35,570
pero además es un momento de mucho consumo de energía y eso puede

56
00:04:35,570 --> 00:04:39,730
inducir una hipoglicemia, así que hay riesgo de las dos cosas, de que se

57
00:04:39,730 --> 00:04:42,650
escompense hacia arriba o hacia abajo y lo más frecuente es que haga

58
00:04:42,650 --> 00:04:47,170
hipoglicemia, así que lo importante es que durante el parto no solamente que

59
00:04:47,170 --> 00:04:52,290
se maneje con su insulina o con lo que sea que esté siendo

60
00:04:52,290 --> 00:04:56,850
tratada en ese momento, sino que además debe controlarse muy

61
00:04:56,850 --> 00:05:01,810
seguidamente con hemoglucotés y aparte de eso se va a ver la

62
00:05:01,810 --> 00:05:06,210
necesidad de dejar la insulina cristalina o no. En la práctica muchas

63
00:05:06,210 --> 00:05:09,970
veces no se requiere dejar nada de insulina porque el mismo útero se

64
00:05:09,970 --> 00:05:14,570
lleva toda la glucosa, así que no alcanza a subir. Y bueno, eso fue todo,

65
00:05:14,570 --> 00:05:18,930
nos vemos en el siguiente vídeo que vamos a ver el manejo obstétrico de

66
00:05:18,930 --> 00:05:23,010
la diabetes gestacional. Que estén bien.',
    'El manejo de la diabetes durante el embarazo exige una precisión especial. Los objetivos metabólicos son más estrictos que fuera del embarazo, el arsenal terapéutico es más limitado y las decisiones impactan directamente sobre dos pacientes al mismo tiempo: la madre y el feto.

Comencemos por los **objetivos glucémicos en el embarazo**. Las glicemias preprandiales deben mantenerse por debajo de 90 mg/dL; en algunas guías se menciona el rango de 60 a 90 o de 70 a 90, pero lo que deben retener es el tope de 90 mg/dL. Las glicemias postprandiales deben estar por debajo de 120 mg/dL, siendo el rango habitual de 80 a 120 o de 90 a 120 según la fuente. Como pueden ver, estos objetivos son considerablemente más estrictos que los de la persona no embarazada —donde los valores aceptables llegaban hasta 130-180 mg/dL postprandial—. Esta exigencia se justifica porque incluso niveles moderadamente elevados de glucosa pueden generar complicaciones fetales significativas.

La forma en que se monitoriza el control glucémico en el embarazo es mediante el **hemoglucotest domiciliario**, realizado idealmente cuatro veces al día, alternando mediciones preprandiales y postprandiales en distintos horarios a lo largo de la semana. La paciente registra estas mediciones en una cartilla y acude a control cada dos semanas con ese registro. En cada visita se revisan los promedios y se decide si ajustar el tratamiento.',
    '["Los objetivos glucémicos en el embarazo son más estrictos: preprandiales < 90 mg/dL y postprandiales < 120 mg/dL.","El monitoreo se realiza con 4 hemoglucotest diarios domiciliarios, con revisión cada 2 semanas; la HbA1c es un complemento, no la guía principal de decisiones.","El tratamiento comienza con dieta; si no se logran los objetivos, se pasa directamente a insulina NPH (una o dos dosis), con posibilidad de agregar cristalina si es necesario.","La insulina glargina debe evitarse en el embarazo por perfil de seguridad incompleto; la NPH es la de elección por su seguridad establecida.","Metformina y glibenclamida son seguras en el embarazo según la evidencia, pero la práctica estándar es preferir insulina; el embarazo debe planificarse con HbA1c < 7% previo a la concepción."]'::jsonb,
    '[{"para":"\"Embarazo: PRE < 90, POST < 120\":","nemotecnia":"\"Embarazo: PRE < 90, POST < 120\":","explicacion":"Dos números clave. Antes de comer: bajo 90. Después de comer: bajo 120. Mucho más estricto que fuera del embarazo.\nDos números clave. Antes de comer: bajo 90. Después de comer: bajo 120. Mucho más estricto que fuera del embarazo."},{"para":"\"NPH en embarazo, Glargina afuera\":","nemotecnia":"\"NPH en embarazo, Glargina afuera\":","explicacion":"En el embarazo, la insulina de elección es la NPH. La glargina se evita porque no está 100% validada su seguridad en gestantes.En el embarazo, la insulina de elección es la NPH. La glargina se evita porque no está 100% validada su seguridad en gestantes."},{"para":"\"4 hemoglucotest al día = los ojos del embarazo diabético\":","nemotecnia":"\"4 hemoglucotest al día = los ojos del embarazo diabético\":","explicacion":"La HbA1c llega tarde. El hemoglucotest cuatro veces al día es lo que permite ver en tiempo real el control y actuar rápido.La HbA1c llega tarde. El hemoglucotest cuatro veces al día es lo que permite ver en tiempo real el control y actuar rápido."}]'::jsonb,
    '["Los objetivos glucémicos en el embarazo son más estrictos: preprandiales < 90 mg/dL y postprandiales < 120 mg/dL.","El monitoreo se realiza con 4 hemoglucotest diarios domiciliarios, con revisión cada 2 semanas; la HbA1c es un complemento, no la guía principal de decisiones.","El tratamiento comienza con dieta; si no se logran los objetivos, se pasa directamente a insulina NPH (una o dos dosis), con posibilidad de agregar cristalina si es necesario."]'::jsonb,
    '[]'::jsonb,
    '[{"pregunta":"¿Cuál de las siguientes afirmaciones es correcta?","respuesta":"Respuesta correcta: D — El tratamiento de la diabetes en el embarazo sigue la secuencia: primero dieta, luego insulina NPH si no se logran los objetivos; la glargina se evita por datos de seguridad incompletos en la gestante."}]'::jsonb,
    NOW(),
    TRUE,
    FALSE  -- first 3 free preview
  ) ON CONFLICT (specialty_id, order_index)
  DO UPDATE SET
    title            = EXCLUDED.title,
    duration_seconds = EXCLUDED.duration_seconds,
    txt_content      = EXCLUDED.txt_content,
    srt_content      = EXCLUDED.srt_content,
    ai_summary       = EXCLUDED.ai_summary,
    ai_key_concepts  = EXCLUDED.ai_key_concepts,
    ai_mnemonics     = EXCLUDED.ai_mnemonics,
    ai_high_yield    = EXCLUDED.ai_high_yield,
    ai_review_qs     = EXCLUDED.ai_review_qs,
    ai_processed_at  = NOW(),
    is_available     = TRUE;

  -- Cápsula 10: Control Obstétrico de la Diabetes en el Embarazo — Complicaciones y Manejo
  INSERT INTO lessons (
    specialty_id, title, order_index, duration_seconds,
    txt_content, srt_content,
    ai_summary, ai_key_concepts, ai_mnemonics,
    ai_high_yield, ai_algorithms, ai_review_qs,
    ai_processed_at, is_available, is_free_preview
  ) VALUES (
    v_specialty_id,
    'Control Obstétrico de la Diabetes en el Embarazo — Complicaciones y Manejo',
    10,
    398,
    'Hola, hola. Veamos ahora el control obstétrico de la diabetes gestacional y pregestacional.

Sepan que los riesgos de la diabetes mellitus gestacional, de ahí vamos a ver lo de la

pregestacional, son muchos. Por un lado está la microzomía fetal, un bebé arriba de 4 kilos y

medio que obliga a ser una cesárea. Aparte de esto, el riesgo más importante, la hipoglicemia

neonatal, pero no es el único riesgo metabólico de el feto. También está la hipocalcemia

neonatal, así que mucho cuidado en un recién nacido hijo de madre diabética que al parecer

está con una hipoglicemia, pero el hemoglucotest o la glicemia le sale normal. Acuérdense que eso

puede ser un problema del calcio, así que hay que medirle calcio también. Aparte de esto de

acá, la distancia de hombros, al mismo peso un hijo de madre diabética tiene mayor riesgo

de distancia de hombros que un hijo de madre no diabética. Aparte de esto, la poliglobulia

neonatal, en el sentido en que la insulina fetal que se aumenta por la hipoglicemia materna

per se actúa como un factor de crecimiento de los glóbulos rojos, puede venir con poliglobulia,

que a su vez el exceso de glóbulos rojos puede agravarme la hipoglicemia, así que con

muchas frecuencias se ven las dos cosas al mismo tiempo. Y finalmente hay riesgos de

polihidroamnios en el sentido en que la hipoglicemia materna se traduce en hipoglicemia

fetal y eso se traduce en glucosuria y poliguria fetal con el polihidroamnios también. En el caso

de la diabetes gestacional y pregestacional también, además se agrega este riesgo del

distancia respiratorio a través de la enfermedad de membrana yalina. De hecho, la membrana

yalina es algo que se ve en los prematuros, más que en el hijo de madre diabética,

pero es clásico de los menores de 34 semanas. En cambio, cuando veo una membrana yalina después

de las 34 semanas, habitualmente se ve en contexto de un hijo de madre diabética y

obviamente si tienen menos de 34 semanas y aparte de eso tiene diabetes gestacional,

el riesgo es más alto a que si no tuviera diabetes gestacional. O sea, los riesgos son

múltiples e incluye el de membrana yalina, pero los dos más importantes que hay que saber

son la hipoglicemia y la macrosomía y acordarse de la hipocalcemia como la que se esconde debajo

de la que parecía hipoglicemia pero que no era. Ahora, en el caso de la diabetes mellitus

pregestacional tiene todos esos riesgos, todos, incluso un poquito más aumentado,

pero hay que agregarle el riesgo de malformaciones en el sentido en que una diabetes desde el

principio tiene efectivamente estos riesgos. Son distintos tipos de malformaciones pero

los más clásicos son los defectos del tubo neural, dígase la anencefalia, el meningocéle,

el mielo meningocéle y la de las disrafias espinales, dígase la espina bífida oculta

y la espina bífida evidente también. Finalmente, tiene riesgo de insuficiencia

placentaria en el sentido en que el exceso de azúcar durante la placentación o la implantación

de la placenta puede generar esta insuficiencia placentaria que a su vez se complica con

RCIU, con preeclampsia, etcétera, con oligoablio. Respecto al manejo obstétrico,

cuando se interrumpe una mujer embarazada con diabetes, la verdad es que no hay un

consenso pero se dice entre las 39 y las 41 semanas, desde esa edad hacia adelante

ya no vale la pena que siga embarazada porque no se gana nada en específico. Antes de las 39

semanas todavía uno dice esperemos que madure un poquito más. Lo habitual es que se interrumpan

a las 40 semanas pero se les suele ofrecer desde las 39 semanas si quieren interrumpirlo

y cuando ya cumplen 41 semanas igual que en cualquier embarazo la recomendación es

hay que interrumpirlo sí o sí. ¿Por qué vía de parto? La regla general es que la diabetes no

me contraindica el parto vaginal así que va por parto vaginal y la excepción es que tenga

una macrosomía con un peso mayor a 4 kilos 500. En algunas partes salía antes 4 kilos 200 en

las diabéticas pero la verdad es que actualmente el consenso que hay a nivel

internacional es 4 kilos y medio o más, es indicación necesaria no solamente en diabética

sino que en pacientes no diabéticas y la cesárea se planifica de manera electiva habitualmente

a las 39 semanas. Ahora en el caso de la diabetes mellitus pre-gestacional ahí uno

sí puede ser un poquito más laxo con el peso y ya desde los 4 kilos hasta 4 kilos y medio

dependiendo del tamaño de la mamá se puede evaluar a ser una cesárea electiva o sea repito

es parto vaginal salvo que pese más de 4 kilos y medio en que ahí es cesárea y en el caso de

la pregestacional ahí se puede bajar un poquito en este peso. Ahora aparte durante todo el

embarazo hay que prevenir estas malformaciones del tubo neural, los defectos del tubo neural

así que hay que dejarle ácido fólico no en la dosis habitual que se deja las embarazadas

que es de 0,4 miligramos al día sino que se deja una dosis 10 veces más alta, dígase 4 miligramos

al día de ácido fólico. Aparte de esto acuérdense al momento de atender a un recién nacido

de una madre diabética siempre hay que controlar glicemias, ya las glicemias se piden en este

caso a las dos horas y se va a pedir antes si es que tiene síntomas en cambio en los recién

nacidos hijos de una madre sin factores de riesgo no es obligatorio hacer una glicemia a menos claro

que haya algún síntoma. La glicemia a las dos horas es porque en ese momento es cuando se

logra habitualmente el nadir de la glicemia o sea el valor más bajo en promedio. En el

caso de la madre una vez que ya tuvo al bebé una vez que ya fue el parto igualmente

hay que controlarla con un ttgo más adelante habitualmente 6 a 12 semanas después cuando haya

finalizado el puerperio y la razón de esto es que tiene riesgo de desarrollar una diabetes

mellitus 2 acuérdense que la diabetes gestacional era causada por resistencia a la insulina

inducida por las hormonas de contra regulación en específico el lactógeno placentario pero en

este caso obviamente que haya desarrollado resistencia a la insulina en el embarazo aumenta

el riesgo de que tenga resistencia a la insulina después así que hay que asegurarse

que no tenga una diabetes 2 de base y bueno eso fue todo nos vemos en los siguientes vídeos',
    '1
00:00:03,120 --> 00:00:07,840
Hola, hola. Veamos ahora el control obstétrico de la diabetes gestacional y pregestacional.

2
00:00:07,840 --> 00:00:13,840
Sepan que los riesgos de la diabetes mellitus gestacional, de ahí vamos a ver lo de la

3
00:00:13,840 --> 00:00:19,960
pregestacional, son muchos. Por un lado está la microzomía fetal, un bebé arriba de 4 kilos y

4
00:00:19,960 --> 00:00:24,840
medio que obliga a ser una cesárea. Aparte de esto, el riesgo más importante, la hipoglicemia

5
00:00:24,840 --> 00:00:30,440
neonatal, pero no es el único riesgo metabólico de el feto. También está la hipocalcemia

6
00:00:30,440 --> 00:00:35,680
neonatal, así que mucho cuidado en un recién nacido hijo de madre diabética que al parecer

7
00:00:35,680 --> 00:00:40,920
está con una hipoglicemia, pero el hemoglucotest o la glicemia le sale normal. Acuérdense que eso

8
00:00:40,920 --> 00:00:45,800
puede ser un problema del calcio, así que hay que medirle calcio también. Aparte de esto de

9
00:00:45,800 --> 00:00:52,400
acá, la distancia de hombros, al mismo peso un hijo de madre diabética tiene mayor riesgo

10
00:00:52,400 --> 00:00:58,600
de distancia de hombros que un hijo de madre no diabética. Aparte de esto, la poliglobulia

11
00:00:58,600 --> 00:01:03,520
neonatal, en el sentido en que la insulina fetal que se aumenta por la hipoglicemia materna

12
00:01:03,520 --> 00:01:08,680
per se actúa como un factor de crecimiento de los glóbulos rojos, puede venir con poliglobulia,

13
00:01:08,680 --> 00:01:13,280
que a su vez el exceso de glóbulos rojos puede agravarme la hipoglicemia, así que con

14
00:01:13,280 --> 00:01:17,720
muchas frecuencias se ven las dos cosas al mismo tiempo. Y finalmente hay riesgos de

15
00:01:17,720 --> 00:01:23,160
polihidroamnios en el sentido en que la hipoglicemia materna se traduce en hipoglicemia

16
00:01:23,160 --> 00:01:31,600
fetal y eso se traduce en glucosuria y poliguria fetal con el polihidroamnios también. En el caso

17
00:01:31,600 --> 00:01:38,360
de la diabetes gestacional y pregestacional también, además se agrega este riesgo del

18
00:01:38,360 --> 00:01:44,360
distancia respiratorio a través de la enfermedad de membrana yalina. De hecho, la membrana

19
00:01:44,360 --> 00:01:48,480
yalina es algo que se ve en los prematuros, más que en el hijo de madre diabética,

20
00:01:48,480 --> 00:01:57,000
pero es clásico de los menores de 34 semanas. En cambio, cuando veo una membrana yalina después

21
00:01:57,000 --> 00:02:02,480
de las 34 semanas, habitualmente se ve en contexto de un hijo de madre diabética y

22
00:02:02,480 --> 00:02:06,800
obviamente si tienen menos de 34 semanas y aparte de eso tiene diabetes gestacional,

23
00:02:06,800 --> 00:02:11,800
el riesgo es más alto a que si no tuviera diabetes gestacional. O sea, los riesgos son

24
00:02:11,800 --> 00:02:16,080
múltiples e incluye el de membrana yalina, pero los dos más importantes que hay que saber

25
00:02:16,080 --> 00:02:22,120
son la hipoglicemia y la macrosomía y acordarse de la hipocalcemia como la que se esconde debajo

26
00:02:22,120 --> 00:02:27,320
de la que parecía hipoglicemia pero que no era. Ahora, en el caso de la diabetes mellitus

27
00:02:27,320 --> 00:02:31,840
pregestacional tiene todos esos riesgos, todos, incluso un poquito más aumentado,

28
00:02:31,840 --> 00:02:37,440
pero hay que agregarle el riesgo de malformaciones en el sentido en que una diabetes desde el

29
00:02:37,440 --> 00:02:41,960
principio tiene efectivamente estos riesgos. Son distintos tipos de malformaciones pero

30
00:02:41,960 --> 00:02:47,360
los más clásicos son los defectos del tubo neural, dígase la anencefalia, el meningocéle,

31
00:02:47,360 --> 00:02:54,240
el mielo meningocéle y la de las disrafias espinales, dígase la espina bífida oculta

32
00:02:54,240 --> 00:02:58,960
y la espina bífida evidente también. Finalmente, tiene riesgo de insuficiencia

33
00:02:58,960 --> 00:03:05,960
placentaria en el sentido en que el exceso de azúcar durante la placentación o la implantación

34
00:03:06,560 --> 00:03:13,640
de la placenta puede generar esta insuficiencia placentaria que a su vez se complica con

35
00:03:13,640 --> 00:03:21,160
RCIU, con preeclampsia, etcétera, con oligoablio. Respecto al manejo obstétrico,

36
00:03:21,160 --> 00:03:26,320
cuando se interrumpe una mujer embarazada con diabetes, la verdad es que no hay un

37
00:03:26,320 --> 00:03:32,480
consenso pero se dice entre las 39 y las 41 semanas, desde esa edad hacia adelante

38
00:03:32,480 --> 00:03:39,000
ya no vale la pena que siga embarazada porque no se gana nada en específico. Antes de las 39

39
00:03:39,000 --> 00:03:45,000
semanas todavía uno dice esperemos que madure un poquito más. Lo habitual es que se interrumpan

40
00:03:45,000 --> 00:03:54,120
a las 40 semanas pero se les suele ofrecer desde las 39 semanas si quieren interrumpirlo

41
00:03:54,120 --> 00:03:58,560
y cuando ya cumplen 41 semanas igual que en cualquier embarazo la recomendación es

42
00:03:58,600 --> 00:04:03,880
hay que interrumpirlo sí o sí. ¿Por qué vía de parto? La regla general es que la diabetes no

43
00:04:03,880 --> 00:04:08,800
me contraindica el parto vaginal así que va por parto vaginal y la excepción es que tenga

44
00:04:08,800 --> 00:04:15,640
una macrosomía con un peso mayor a 4 kilos 500. En algunas partes salía antes 4 kilos 200 en

45
00:04:15,640 --> 00:04:20,360
las diabéticas pero la verdad es que actualmente el consenso que hay a nivel

46
00:04:20,360 --> 00:04:25,880
internacional es 4 kilos y medio o más, es indicación necesaria no solamente en diabética

47
00:04:25,880 --> 00:04:31,960
sino que en pacientes no diabéticas y la cesárea se planifica de manera electiva habitualmente

48
00:04:31,960 --> 00:04:38,000
a las 39 semanas. Ahora en el caso de la diabetes mellitus pre-gestacional ahí uno

49
00:04:38,000 --> 00:04:45,000
sí puede ser un poquito más laxo con el peso y ya desde los 4 kilos hasta 4 kilos y medio

50
00:04:45,000 --> 00:04:50,560
dependiendo del tamaño de la mamá se puede evaluar a ser una cesárea electiva o sea repito

51
00:04:50,560 --> 00:04:57,080
es parto vaginal salvo que pese más de 4 kilos y medio en que ahí es cesárea y en el caso de

52
00:04:57,080 --> 00:05:03,880
la pregestacional ahí se puede bajar un poquito en este peso. Ahora aparte durante todo el

53
00:05:03,880 --> 00:05:09,840
embarazo hay que prevenir estas malformaciones del tubo neural, los defectos del tubo neural

54
00:05:09,840 --> 00:05:14,360
así que hay que dejarle ácido fólico no en la dosis habitual que se deja las embarazadas

55
00:05:14,360 --> 00:05:20,720
que es de 0,4 miligramos al día sino que se deja una dosis 10 veces más alta, dígase 4 miligramos

56
00:05:20,720 --> 00:05:28,160
al día de ácido fólico. Aparte de esto acuérdense al momento de atender a un recién nacido

57
00:05:28,160 --> 00:05:35,800
de una madre diabética siempre hay que controlar glicemias, ya las glicemias se piden en este

58
00:05:35,800 --> 00:05:41,840
caso a las dos horas y se va a pedir antes si es que tiene síntomas en cambio en los recién

59
00:05:41,880 --> 00:05:48,720
nacidos hijos de una madre sin factores de riesgo no es obligatorio hacer una glicemia a menos claro

60
00:05:48,720 --> 00:05:55,400
que haya algún síntoma. La glicemia a las dos horas es porque en ese momento es cuando se

61
00:05:55,400 --> 00:06:01,960
logra habitualmente el nadir de la glicemia o sea el valor más bajo en promedio. En el

62
00:06:01,960 --> 00:06:08,080
caso de la madre una vez que ya tuvo al bebé una vez que ya fue el parto igualmente

63
00:06:08,080 --> 00:06:13,880
hay que controlarla con un ttgo más adelante habitualmente 6 a 12 semanas después cuando haya

64
00:06:13,880 --> 00:06:19,400
finalizado el puerperio y la razón de esto es que tiene riesgo de desarrollar una diabetes

65
00:06:19,400 --> 00:06:24,360
mellitus 2 acuérdense que la diabetes gestacional era causada por resistencia a la insulina

66
00:06:24,360 --> 00:06:30,720
inducida por las hormonas de contra regulación en específico el lactógeno placentario pero en

67
00:06:30,720 --> 00:06:35,160
este caso obviamente que haya desarrollado resistencia a la insulina en el embarazo aumenta

68
00:06:35,160 --> 00:06:38,680
el riesgo de que tenga resistencia a la insulina después así que hay que asegurarse

69
00:06:38,680 --> 00:06:43,040
que no tenga una diabetes 2 de base y bueno eso fue todo nos vemos en los siguientes vídeos',
    'La diabetes durante el embarazo no solo representa un desafío metabólico: genera una constelación de complicaciones fetales y maternas que el médico debe conocer con precisión para anticiparlas, prevenirlas y manejarlas adecuadamente. En esta cápsula repasamos los riesgos asociados a la diabetes gestacional y pregestacional, y los aspectos clave del manejo obstétrico.

Comencemos con los riesgos de la **diabetes gestacional**. El más conocido es la **macrosomía fetal**: un peso al nacer superior a 4,5 kilos. La hiperglicemia materna atraviesa la placenta, estimula la producción de insulina fetal —que actúa como factor de crecimiento— y genera un feto grande, lo que puede complicar el parto vaginal y aumentar el riesgo de distocia de hombros.

La **hipoglicemia neonatal** es el riesgo metabólico más importante del recién nacido hijo de madre diabética. El mecanismo es el siguiente: el páncreas fetal, acostumbrado a trabajar en exceso para compensar la hiperglicemia materna, sigue secretando grandes cantidades de insulina al nacer. Al cortar el cordón umbilical, desaparece el aporte de glucosa materno, pero la insulina fetal sigue alta. Esto produce una caída brusca de la glicemia neonatal, habitualmente en las primeras 2 horas de vida, que corresponde al momento del nadir glucémico. Por esta razón, en todo recién nacido hijo de madre diabética se solicita una glicemia a las 2 horas de vida, y antes si hay síntomas.',
    '["Las complicaciones del hijo de madre con diabetes gestacional incluyen macrosomía, hipoglicemia neonatal (a las 2 horas de vida), hipocalcemia neonatal, distocia de hombros, poliglobulia y polihidramnios.","La diabetes pregestacional agrega riesgo de malformaciones del tubo neural (anencefalia, espina bífida), insuficiencia placentaria y enfermedad de membrana hialina en recién nacidos ≥ 34 semanas.","En todo recién nacido hijo de madre diabética se solicita glicemia a las 2 horas de vida; si parece hipoglicémico pero la glicemia es normal, descartar hipocalcemia.","La interrupción del embarazo se recomienda entre las 39 y 41 semanas; la vía es vaginal salvo macrosomía > 4,5 kg (cesárea electiva a las 39 semanas).","La mujer con diabetes pregestacional necesita ácido fólico 4 mg/día (dosis 10 veces mayor a la habitual) para prevenir defectos del tubo neural; postparto, toda mujer con diabetes gestacional debe realizarse TTGO a las 6–12 semanas."]'::jsonb,
    '[{"para":"\"HIMDB (Hijo de Madre DiaBética) = Hipoglicemia + Hipocalcemia + Hombros + Hematíes\":","nemotecnia":"\"HIMDB (Hijo de Madre DiaBética) = Hipoglicemia + Hipocalcemia + Hombros + Hematíes\":","explicacion":"Las cuatro H del recién nacido hijo de madre diabética: Hipoglicemia neonatal, Hipocalcemia, Hombros (distocia), Hematíes en exceso (poliglobulia). Más: macrosomía y polihidramnios.\nLas cuatro H del recién nacido hijo de madre diabética: Hipoglicemia neonatal, Hipocalcemia, Hombros (distocia), Hematíes en exceso (poliglobulia). Más: macrosomía y polihidramnios."},{"para":"\"Glicemia a las 2 HORAS en el recién nacido — ese es el nadir\":","nemotecnia":"\"Glicemia a las 2 HORAS en el recién nacido — ese es el nadir\":","explicacion":"El punto más bajo de la glicemia en el recién nacido hijo de madre diabética es a las 2 horas. Ahí se pide la glicemia, antes si hay síntomas.El punto más bajo de la glicemia en el recién nacido hijo de madre diabética es a las 2 horas. Ahí se pide la glicemia, antes si hay síntomas."},{"para":"\"4 mg de ácido fólico para la pregestacional = 10 veces más\":","nemotecnia":"\"4 mg de ácido fólico para la pregestacional = 10 veces más\":","explicacion":"La dosis habitual para toda embarazada es 0,4 mg. En la pregestacional se necesita 4 mg porque el riesgo de defectos del tubo neural es diez veces mayor.La dosis habitual para toda embarazada es 0,4 mg. En la pregestacional se necesita 4 mg porque el riesgo de defectos del tubo neural es diez veces mayor."}]'::jsonb,
    '["Las complicaciones del hijo de madre con diabetes gestacional incluyen macrosomía, hipoglicemia neonatal (a las 2 horas de vida), hipocalcemia neonatal, distocia de hombros, poliglobulia y polihidramnios.","La diabetes pregestacional agrega riesgo de malformaciones del tubo neural (anencefalia, espina bífida), insuficiencia placentaria y enfermedad de membrana hialina en recién nacidos ≥ 34 semanas.","En todo recién nacido hijo de madre diabética se solicita glicemia a las 2 horas de vida; si parece hipoglicémico pero la glicemia es normal, descartar hipocalcemia."]'::jsonb,
    '[]'::jsonb,
    '[{"pregunta":"¿Cuál de las siguientes afirmaciones es correcta?","respuesta":"Respuesta correcta: C — La diabetes pregestacional aumenta el riesgo de defectos del tubo neural, por lo que se indica ácido fólico a dosis de 4 mg/día (diez veces la dosis habitual), idealmente desde el período preconcepcional."}]'::jsonb,
    NOW(),
    TRUE,
    FALSE  -- first 3 free preview
  ) ON CONFLICT (specialty_id, order_index)
  DO UPDATE SET
    title            = EXCLUDED.title,
    duration_seconds = EXCLUDED.duration_seconds,
    txt_content      = EXCLUDED.txt_content,
    srt_content      = EXCLUDED.srt_content,
    ai_summary       = EXCLUDED.ai_summary,
    ai_key_concepts  = EXCLUDED.ai_key_concepts,
    ai_mnemonics     = EXCLUDED.ai_mnemonics,
    ai_high_yield    = EXCLUDED.ai_high_yield,
    ai_review_qs     = EXCLUDED.ai_review_qs,
    ai_processed_at  = NOW(),
    is_available     = TRUE;

  -- Cápsula 11: Indicaciones de Insulina en Diabetes — Cuándo, Para Quién y Con Qué Esquema
  INSERT INTO lessons (
    specialty_id, title, order_index, duration_seconds,
    txt_content, srt_content,
    ai_summary, ai_key_concepts, ai_mnemonics,
    ai_high_yield, ai_algorithms, ai_review_qs,
    ai_processed_at, is_available, is_free_preview
  ) VALUES (
    v_specialty_id,
    'Indicaciones de Insulina en Diabetes — Cuándo, Para Quién y Con Qué Esquema',
    11,
    242,
    'Hola, hola. Este va a ser un video muy corto en que vamos a recordar todas las indicaciones de

insulina y con qué insulina se deja en cada una de estas indicaciones. Así que empecemos.

Número uno, la diabetes mellitus tipo 1, la diabetes Lada, las autoinmunes. Por el general

siempre se manejan con insulina. ¿Y en qué esquema? Esquema intensificado, que si se

acuerdan era una dosis de ultralenta o como mínimo dos dosis de NPH. En la práctica es

una dosis de clargina más las tres dosis de insulina cristalina precomida. Segundo lugar,

en el caso de la cetosidosis diabética o el síndrome hiperglicémico hiperosmolar,

en ese caso que dejar la insulina cristalina habitualmente se deja un bolo, que la dosis

suele ser o de 10 unidades o de 0,1 unidad por kilo y luego queda con un goteo de esa

misma cantidad más o menos que se pasa cada hora hasta que se logra que la glicemia baje.

Aparte de esto, la diabetes tipo 2, acuérdense que había ciertas indicaciones. La más

importante era la hemoglobina licosilada arriba de 9%, ahí había que partir con

insulina de inmediato, o bien cuando estaba con dos hipoglicemiantes orales en dosis

máxima y la hemoglobina seguía arriba de 7 u 8% que era el objetivo del control

metabólico y obviamente cuando están contraindicados los hipoglicemiantes orales

como la insuficiencia cardiaca o en la falla renal con esos valores de corte,

una crea de 1,5 o más o bien un clearance menor a 30 ml minuto.

Y en este caso la diabetes dosis, ¿acuerdan qué insulina había que dejar? Era la insulina

NPH que podía ser una o dos dosis y en el caso de que siguiera con un mal control

metabólico de las glicemias posprandiales se agregaba la insulina cristalina.

Ahora como alternativa a la NPH está la insulina ultra lenta, la glargina se deja

en particular cuando había hipoglicemias, acuérdense que la NPH tenía un peak y por

lo tanto tenía un riesgo de hipoglicemia más alta que la ultra lenta que viene

sin peak y por lo tanto con un menor riesgo de hipoglicemia.

Ahora en el paciente hospitalizado, acuérdense, se dejaba insulina cristalina endovenosa

cada 6 horas ajustada por hemogluco test y más eventualmente sus medicamentos

de base también pero lo más importante en el diabético tipo 2 con una enfermedad

grave era el cambiarse completamente a insulina cristalina cada 6 horas más el hemogluco test

que me determina finalmente la dosis que se le va a administrar.

Ahora hay algunas otras indicaciones que vale la pena saber que no las vamos a ver

en ninguna de las otras dispositivas que son la diabetes causada por corticoides,

ejemplo alguien que está con lupus y está con prednisona y me desarrolla una

diabetes seguramente se va a manejar con insulina.

En el caso del embarazo, acuérdense que sí se podía usar la metformina,

sí se podía usar la glivenclamida pero el tratamiento de elección sigue siendo la insulina

que podría ser la NPH o la NPH más insulina cristalina.

Cuando está con glicemias demasiado elevadas, una glicemia arriba de 400,

si bien en la práctica muchas veces solamente se ajustan sus medicamentos,

la verdad es que lo correcto desde el punto de vista médico legal es

el hospitalizarlo y manejarlo con insulina al menos hasta lograr controlar esta

hiperglicemia que tiene riesgo de evolucionar a una complicación más grave

como un síndrome hiperglicémico o hiperosmolar por ejemplo.

Igualmente cuando está con síntomas de diabetes, los síntomas de diabetes

sugieren una enfermedad muy grave así que esté con baja de peso,

con poliurea, con polifagia, con polidipsia, con esas cosas.

De entrada va a empezar con insulina, eventualmente si se logra que se controle bien

me puedo cambiar a los hipoglicemiantes siempre y cuando sea una diabetes 2

porque los síntomas son más frecuentes la diabetes 1 que la diabetes 2.

Y finalmente la neuropatía dolorosa o la neuropatía amiotrófica son indicaciones

relativas de insulina en el sentido en que no regresa habitualmente la neuropatía

pero sí se puede lograr que se rebusca un poco el dolor junto con otros medicamentos

obviamente y se puede lograr que gane peso en el caso de la atrofe muscular.

Y bueno eso fue todo nos vemos en la siguiente clase que estén bien.',
    '1
00:00:03,280 --> 00:00:07,560
Hola, hola. Este va a ser un video muy corto en que vamos a recordar todas las indicaciones de

2
00:00:07,560 --> 00:00:11,720
insulina y con qué insulina se deja en cada una de estas indicaciones. Así que empecemos.

3
00:00:11,720 --> 00:00:16,480
Número uno, la diabetes mellitus tipo 1, la diabetes Lada, las autoinmunes. Por el general

4
00:00:16,480 --> 00:00:20,280
siempre se manejan con insulina. ¿Y en qué esquema? Esquema intensificado, que si se

5
00:00:20,280 --> 00:00:25,880
acuerdan era una dosis de ultralenta o como mínimo dos dosis de NPH. En la práctica es

6
00:00:25,880 --> 00:00:31,000
una dosis de clargina más las tres dosis de insulina cristalina precomida. Segundo lugar,

7
00:00:31,000 --> 00:00:35,120
en el caso de la cetosidosis diabética o el síndrome hiperglicémico hiperosmolar,

8
00:00:35,120 --> 00:00:40,120
en ese caso que dejar la insulina cristalina habitualmente se deja un bolo, que la dosis

9
00:00:40,120 --> 00:00:46,760
suele ser o de 10 unidades o de 0,1 unidad por kilo y luego queda con un goteo de esa

10
00:00:46,760 --> 00:00:52,240
misma cantidad más o menos que se pasa cada hora hasta que se logra que la glicemia baje.

11
00:00:52,240 --> 00:00:56,760
Aparte de esto, la diabetes tipo 2, acuérdense que había ciertas indicaciones. La más

12
00:00:56,760 --> 00:01:01,680
importante era la hemoglobina licosilada arriba de 9%, ahí había que partir con

13
00:01:01,680 --> 00:01:05,760
insulina de inmediato, o bien cuando estaba con dos hipoglicemiantes orales en dosis

14
00:01:05,760 --> 00:01:11,160
máxima y la hemoglobina seguía arriba de 7 u 8% que era el objetivo del control

15
00:01:11,160 --> 00:01:15,840
metabólico y obviamente cuando están contraindicados los hipoglicemiantes orales

16
00:01:15,840 --> 00:01:20,440
como la insuficiencia cardiaca o en la falla renal con esos valores de corte,

17
00:01:20,440 --> 00:01:25,920
una crea de 1,5 o más o bien un clearance menor a 30 ml minuto.

18
00:01:25,920 --> 00:01:30,160
Y en este caso la diabetes dosis, ¿acuerdan qué insulina había que dejar? Era la insulina

19
00:01:30,160 --> 00:01:35,880
NPH que podía ser una o dos dosis y en el caso de que siguiera con un mal control

20
00:01:35,880 --> 00:01:39,920
metabólico de las glicemias posprandiales se agregaba la insulina cristalina.

21
00:01:39,920 --> 00:01:45,640
Ahora como alternativa a la NPH está la insulina ultra lenta, la glargina se deja

22
00:01:45,640 --> 00:01:50,960
en particular cuando había hipoglicemias, acuérdense que la NPH tenía un peak y por

23
00:01:50,960 --> 00:01:55,120
lo tanto tenía un riesgo de hipoglicemia más alta que la ultra lenta que viene

24
00:01:55,120 --> 00:01:58,480
sin peak y por lo tanto con un menor riesgo de hipoglicemia.

25
00:01:58,480 --> 00:02:03,480
Ahora en el paciente hospitalizado, acuérdense, se dejaba insulina cristalina endovenosa

26
00:02:03,480 --> 00:02:08,280
cada 6 horas ajustada por hemogluco test y más eventualmente sus medicamentos

27
00:02:08,280 --> 00:02:12,080
de base también pero lo más importante en el diabético tipo 2 con una enfermedad

28
00:02:12,080 --> 00:02:18,240
grave era el cambiarse completamente a insulina cristalina cada 6 horas más el hemogluco test

29
00:02:18,240 --> 00:02:21,640
que me determina finalmente la dosis que se le va a administrar.

30
00:02:21,640 --> 00:02:25,920
Ahora hay algunas otras indicaciones que vale la pena saber que no las vamos a ver

31
00:02:25,920 --> 00:02:33,640
en ninguna de las otras dispositivas que son la diabetes causada por corticoides,

32
00:02:33,640 --> 00:02:37,440
ejemplo alguien que está con lupus y está con prednisona y me desarrolla una

33
00:02:37,440 --> 00:02:40,080
diabetes seguramente se va a manejar con insulina.

34
00:02:40,080 --> 00:02:43,680
En el caso del embarazo, acuérdense que sí se podía usar la metformina,

35
00:02:43,680 --> 00:02:48,080
sí se podía usar la glivenclamida pero el tratamiento de elección sigue siendo la insulina

36
00:02:48,080 --> 00:02:52,360
que podría ser la NPH o la NPH más insulina cristalina.

37
00:02:52,360 --> 00:02:56,800
Cuando está con glicemias demasiado elevadas, una glicemia arriba de 400,

38
00:02:56,800 --> 00:03:00,400
si bien en la práctica muchas veces solamente se ajustan sus medicamentos,

39
00:03:00,400 --> 00:03:03,800
la verdad es que lo correcto desde el punto de vista médico legal es

40
00:03:03,800 --> 00:03:09,040
el hospitalizarlo y manejarlo con insulina al menos hasta lograr controlar esta

41
00:03:09,080 --> 00:03:12,240
hiperglicemia que tiene riesgo de evolucionar a una complicación más grave

42
00:03:12,240 --> 00:03:16,080
como un síndrome hiperglicémico o hiperosmolar por ejemplo.

43
00:03:16,080 --> 00:03:20,000
Igualmente cuando está con síntomas de diabetes, los síntomas de diabetes

44
00:03:20,000 --> 00:03:23,320
sugieren una enfermedad muy grave así que esté con baja de peso,

45
00:03:23,320 --> 00:03:26,520
con poliurea, con polifagia, con polidipsia, con esas cosas.

46
00:03:26,520 --> 00:03:32,560
De entrada va a empezar con insulina, eventualmente si se logra que se controle bien

47
00:03:32,560 --> 00:03:36,120
me puedo cambiar a los hipoglicemiantes siempre y cuando sea una diabetes 2

48
00:03:36,160 --> 00:03:40,120
porque los síntomas son más frecuentes la diabetes 1 que la diabetes 2.

49
00:03:40,120 --> 00:03:45,120
Y finalmente la neuropatía dolorosa o la neuropatía amiotrófica son indicaciones

50
00:03:45,120 --> 00:03:52,800
relativas de insulina en el sentido en que no regresa habitualmente la neuropatía

51
00:03:52,800 --> 00:03:57,280
pero sí se puede lograr que se rebusca un poco el dolor junto con otros medicamentos

52
00:03:57,280 --> 00:04:02,360
obviamente y se puede lograr que gane peso en el caso de la atrofe muscular.

53
00:04:02,360 --> 00:04:05,360
Y bueno eso fue todo nos vemos en la siguiente clase que estén bien.',
    'En esta cápsula reunimos todas las indicaciones de insulinoterapia que deben conocer para el EUNACOM, organizadas por situación clínica. Este es un tema de integración: requiere que dominen lo aprendido en las cápsulas anteriores y lo apliquen de forma ordenada.

La primera y más clásica indicación es la **diabetes mellitus tipo 1 y la diabetes LADA**. Dado que ambas son de etiología autoinmune y destruyen las células beta pancreáticas, el páncreas no puede producir insulina suficiente y los hipoglicemiantes orales no sirven. El esquema estándar es el **esquema intensificado**: una dosis de insulina ultralenta —preferiblemente glargina— más tres dosis de insulina cristalina preprandiales. En la práctica, esto equivale a glargina una vez al día más insulina cristalina antes del desayuno, almuerzo y cena.

La segunda indicación corresponde a las **complicaciones hiperglicémicas agudas graves**: cetoacidosis diabética y síndrome hiperglicémico hiperosmolar. En estos casos se utiliza insulina cristalina endovenosa. La forma habitual es un bolo inicial —habitualmente 10 unidades o 0,1 unidades por kilogramo de peso— seguido de un goteo continuo de la misma dosis por hora, ajustado según la respuesta glucémica, hasta lograr la estabilización.',
    '["DM tipo 1 y LADA requieren siempre insulina en esquema intensificado (glargina + 3 dosis de cristalina preprandiales); los hipoglicemiantes orales no tienen ningún rol.","En cetoacidosis y síndrome hiperosmolar se usa insulina cristalina endovenosa: bolo inicial (10 U o 0,1 U/kg) seguido de goteo continuo.","En DM2, la insulina está indicada cuando HbA1c > 9%, cuando dos hipoglicemiantes en dosis máxima no logran el objetivo, o cuando los hipoglicemiantes están contraindicados (falla renal, falla cardíaca).","El paciente diabético grave hospitalizado se maneja con insulina cristalina subcutánea cada 6 horas ajustada por hemoglucotest.","La diabetes inducida por corticoides, la diabetes gestacional sin control con dieta, la hiperglicemia mayor a 400 mg/dL y los síntomas floridos de diabetes son indicaciones adicionales de insulina."]'::jsonb,
    '[{"para":"\"DM1 y LADA = SIEMPRE insulina, NUNCA orales\":","nemotecnia":"\"DM1 y LADA = SIEMPRE insulina, NUNCA orales\":","explicacion":"Las formas autoinmunes no tienen páncreas funcional. No hay ningún hipoglicemiante oral que funcione si no hay células beta. Solo la insulina puede reemplazar lo que el cuerpo ya no produce.\nLas formas autoinmunes no tienen páncreas funcional. No hay ningún hipoglicemiante oral que funcione si no hay células beta. Solo la insulina puede reemplazar lo que el cuerpo ya no produce."},{"para":"\"Cetoacidosis = bolo + goteo de cristalina EV\":","nemotecnia":"\"Cetoacidosis = bolo + goteo de cristalina EV\":","explicacion":"La emergencia hiperglicémica grave no se maneja con subcutáneo. Bolo endovenoso seguido de goteo hasta resolver.La emergencia hiperglicémica grave no se maneja con subcutáneo. Bolo endovenoso seguido de goteo hasta resolver."},{"para":"\"9% de HbA1c = insulina sin dilaciones\":","nemotecnia":"\"9% de HbA1c = insulina sin dilaciones\":","explicacion":"No importa cuántos hipoglicemiantes tenga o no tenga. Con HbA1c sobre 9%, la insulina es la única respuesta clínica correcta.No importa cuántos hipoglicemiantes tenga o no tenga. Con HbA1c sobre 9%, la insulina es la única respuesta clínica correcta."}]'::jsonb,
    '["DM tipo 1 y LADA requieren siempre insulina en esquema intensificado (glargina + 3 dosis de cristalina preprandiales); los hipoglicemiantes orales no tienen ningún rol.","En cetoacidosis y síndrome hiperosmolar se usa insulina cristalina endovenosa: bolo inicial (10 U o 0,1 U/kg) seguido de goteo continuo.","En DM2, la insulina está indicada cuando HbA1c > 9%, cuando dos hipoglicemiantes en dosis máxima no logran el objetivo, o cuando los hipoglicemiantes están contraindicados (falla renal, falla cardíaca)."]'::jsonb,
    '[]'::jsonb,
    '[{"pregunta":"¿Cuál de las siguientes afirmaciones sobre las indicaciones de insulina es correcta?","respuesta":"Respuesta correcta: B — Con clearance < 30 mL/min, la metformina y muchos hipoglicemiantes están contraindicados; sumado a HbA1c sobre el objetivo con dos fármacos en dosis máxima, la indicación de insulina NPH es clara."}]'::jsonb,
    NOW(),
    TRUE,
    FALSE  -- first 3 free preview
  ) ON CONFLICT (specialty_id, order_index)
  DO UPDATE SET
    title            = EXCLUDED.title,
    duration_seconds = EXCLUDED.duration_seconds,
    txt_content      = EXCLUDED.txt_content,
    srt_content      = EXCLUDED.srt_content,
    ai_summary       = EXCLUDED.ai_summary,
    ai_key_concepts  = EXCLUDED.ai_key_concepts,
    ai_mnemonics     = EXCLUDED.ai_mnemonics,
    ai_high_yield    = EXCLUDED.ai_high_yield,
    ai_review_qs     = EXCLUDED.ai_review_qs,
    ai_processed_at  = NOW(),
    is_available     = TRUE;

  -- Cápsula 12: Aplicación Clínica del Tratamiento de la Diabetes — Integración y Casos Prácticos
  INSERT INTO lessons (
    specialty_id, title, order_index, duration_seconds,
    txt_content, srt_content,
    ai_summary, ai_key_concepts, ai_mnemonics,
    ai_high_yield, ai_algorithms, ai_review_qs,
    ai_processed_at, is_available, is_free_preview
  ) VALUES (
    v_specialty_id,
    'Aplicación Clínica del Tratamiento de la Diabetes — Integración y Casos Prácticos',
    12,
    586,
    'Hola, hola. Vamos a ver si es que aprendieron o no el tratamiento de la

diabetes con varios ejercicios en los cuales, si es que no lo han aprendido

todavía, ahora ya es el momento en que se grave de manera definitiva. Así que

empecemos inmediatamente con el caso 1. Es un paciente de 68 años que está

con metformina 850 cada 8 horas. O sea, está con la dosis máxima ya de

metformina y está con una hemoglobina A1C de 8%. Uno dice, ¿qué edad tiene?

68 años. El objetivo debería ser 7% de hemoglobina glicosilada o menos,

así que en este caso hay que agregar un segundo hipoglicemiante. Ahora, ¿cuál

la Glivenklamida? Es el clásico en Chile cuando no hay recursos y no hay

un alto riesgo de hipoglicemia. Aquí a los 68 años ya hay algo de riesgo.

Así que lo ideal es que sea otro hipoglicemiante en la medida que el

bolsillo lo aguante o que los recursos del sistema público lo aguante.

El caso 2. 77 años. Acá ya tienen más de 75 años, así que el objetivo

de la hemoglobina glicosilada es menor a 8%. Está con metformina más Glivenklamida

que cada 12 horas ambos. La metformina está en 850 cada 12, así que todavía

se puede subir un poco más. La Glivenklamida está en 5 miligramos cada 12,

así que también se puede subir a 10 miligramos cada 12. Pero si se fijan

aquí está bien controlado y no solamente que está bien controlado,

sino que está demasiado bien controlado para tener 77 años. Así que la

conducta más adecuada va a ser suspenda la Glivenklamida y que su hemoglobina

glicosilada suba un poquito porque no pasa nada. Ahora, se podría también

cambiar a la metformina 850 tres veces al día y de esa manera puedo

suspender la Glivenklamida sin mayor problema. La otra forma de verlo es

es un adulto mayor, bastante mayor, así que per se la Glivenklamida me da

miedo. Así que incluso si es que hubiese estado con una hemoglobina

glicosilada ya más al límite, ejemplo en 7,5, igualmente suspender la

Glivenklamida y cambiarla por otro hipoglicemiante habría sido una buena

decisión. Vamos con el caso 3, 76 años, ya sabemos el objetivo de la

hemoglobina glicosilada va a ser menor a 8%, está con metformina

850 cada 8, así que está en el límite máximo y está por arriba del 8%,

está en 8,8%, así que debo agregar un segundo

hipoglicemiante, pero por tener 76 años no le puedo dejar Glivenklamida

por un alto riesgo de hipoglicemia, así que se la deja o citagliptina o

alguno de los GLP-1 o de los SGLUT-2. Vamos con el caso 4, 57 años, está con

metformina también tres veces al día en la dosis máxima, Glivenklamida

10 miligramos dos veces al día, así que está en dosis máxima también y

aún así está con una hemoglobina glicosilada arriba de 7%, que es el

objetivo a los 57 años, en los menores de 75 años, así que hay que avanzar

todavía más, pero como ya está con las dosis máximas de dos hipoglicemiantes

orales, lo único que me queda en este momento es agregar la insulina,

que acuérdense que se empieza con una dosis de NPH habitualmente en la

noche. Ahora, cuando yo parto la insulina, recuerden que lo habitual es

que se suspende la Glivenklamida o los hipoglicemiantes en general y se

suele mantener la metformina sabiendo que es aceptable mantenerlo

y suspenderlo. El caso 5, 48 años que está con metformina 8.50 cada 8,

nuevamente la dosis máxima de metformina, está con la hemoglobina

glicosilada en 10,8%, está arriba de 9%, está demasiado alta, ahí per se ya

tiene indicación de insulina, pero aparte me dicen que tiene antecedentes

de hipotiroidismo, o sea si se fijan es un paciente o una paciente

relativamente joven, aparte de eso con antecedentes de autoinmunidad y

con un control metabólico muy malo, hay que sospechar que no vaya a ser una

diabetes autoinmune del adulto, una diabetes lada, pero ya sabemos que la

conducta sí o sí es insulina y para confirmar que sea una diabetes lada

va a haber que pedirle el peptidocé, que debería estar bajo, más los

anticuerpos marcadores de autoinmunidad en la diabetes, digas

los anticuerpos antiinsulina, los antislote, los antigat, los anti el

transportador de zinc-8 y los anti la tirosinquinasa-2, ahora en el

caso 6 tiene 58 años, está con metformina 1 gramo cada

8 horas y que está en el límite máximo, la hemoglobina glicosilada está

arriba de 7%, así que está con un mal control y tuvo un infarto hace 6

meses, en este caso por estar la hemoglobina glicosilada arriba hay que

partirle un hipolisemigante adicional y por haber tenido un

infarto hace 6 meses hay que dejarle algunos de estos hipolisemigantes que

tienen mejor rendimiento cardiovascular, dígase el algún glp1 como

el liraglutide o algún esglut2 como por ejemplo la empaglifosina, así

que esa sería la respuesta en este caso, ahora además las estatinas, la

aspirina y todas las cosas del alto riesgo cardiovascular, en el caso 7

tiene 45 años, está con una hemoglobina a1c en 8% así que está por

arriba de lo aceptable, aparte de eso me dice que tiene artritis reumatoide y

con eso yo digo ya tiene autoinmunidad así que no vaya a ser una diabetes

slada, aunque la artritis reumatoide no se asocia tanto a diabetes slada

pero aún así hay que tener cuidado, está con prednisona y acuérdense que

los corticoides pudieran generarme diabetes también y con el metotexate

que es el tratamiento de la artritis reumatoide y su glicemia está en

200, está súper alto así que sin mucha duda hay una diabetes mal

controlada y se hace una segunda hemoglobina glicosilada que está ya en

el límite de 8,8%, no alcanza a ser 9% pero sea como sea, con toda

esa historia hay que partir la insulina sí o sí, por tres razones, número

uno porque está con corticoides, número dos porque puede ser una

diabetes slada y número tres porque el control metabólico está

especialmente malo aunque ese es un número un poquito más débil porque

el corte para que sigo sí sea insulina es 9% no 8,8 como está ahí. Vamos con

el caso 8, tiene 58 años, está con metformina en el límite máximo en un

gramo cada 8 horas, la hemoglobina glicosilada está en 6,8 así que está

bien controlado pero me dicen que tiene una crea de 1,3 miligramos por

decilitro, si se acuerdan la falla renal me contraindicaba la

metformina pero tenía que ser una crea de 1,5 o más, aquí está en 1,3 así

que no me la contraindica, yo digo está bien controlado pues que se quede con su

metformina en esa dosis no hay por qué hacer absolutamente ningún

cambio. Vamos con el caso nuevo, el caso nueve perdón, tiene 80 años, está

con metformina 8,50 cada 8 nuevamente la dosis máxima de metformina como

casi todos los ejemplos porque obviamente si está con una dosis más

baja de metformina hay que subirlo nomás, la glivenclamida está 5 miligramos

cada 12 así que en estricto rigor se podría subir hasta 10 miligramos cada 12

la hemoglobina A1C está en 8,8 entonces fíjense está demasiado alta de

hecho incluso está demasiado alta para tener 80 años en el sentido en que

a los 80 años uno exige que esté debajo de 8 pero puede estar

arriba de 7% y me dice que aparte tiene hipoglicemias con esto yo

digo tengo que quitarle sí o sí la glivenclamida porque ya me está

haciendo hipoglicemia, segundo lugar está muy mal controlado a pesar de

estar con dosis relativamente altas y que es un candidato a insulina así

que la respuesta acá sería suspender la glivenclamida cambiarlo por otro

hipoglicemiante que eventualmente ande bien como ejemplo la citaglutina

pero no está notado ahí pero en este caso en particular es muy probable

que requiere insulina también porque independientemente de que yo le

inicie un hipoglicemente distinto va a ser difícil estando ya con esas dosis

de esos medicamentos bajarla a menos de 8% pero aún así se puede intentar

dejarle la citaglutina, algún glp1 o un sglut2 y ver qué es lo que pasa

con la hemoglobina glicosilada antes de tomar una decisión. El caso 10

tiene 58 años está con metformina un gramo cada 8 horas también así

que la dosis máxima está con la hemoglobina glicosilada en 8,8 así que

está bajo 9 no tiene indicación de insulina todavía pero sí está muy

mal controlado y está con una crea de 1,8 como está con una crea tan

elevada arriba de 1,5 para empezar está absolutamente contraindicada la

metformina y lo más probable es que va a quedar con insulina. Ahora como

alternativa en lugar de iniciarle insulina que es la respuesta más

fácil es el suspender la metformina y cambiarlo por algunos de los

medicamentos que sí se puede dejar en contexto de una falla renal que si se

acuerdan eran los glp1 fundamentalmente y también me servían

los sglut2 pero no funcionaban de manera tan efectiva o eficaz en la

falla renal porque justamente funcionaban eliminando azúcar por

la orina así que en ese caso la insulina o los agonistas del glp1

van a ser la respuesta correcta. En el caso 11 65 años con una hemoglobina

glicosilada en 9,5 ya estamos muy mal así que obviamente hay que partirle

insulina y está con metformina 500 milígramos dos veces al día está

con una dosis muy bajita se podría subir pero por la hemoglobina arriba de

9% la respuesta es insulina sin ninguna duda así que quedaría con

insulina nph y la metformina se puede mantener sin ningún problema se

podría subir también un poquito la dosis a medida que voy ajustando la

dosis de insulina nph y bueno espero que hayan aprendido porque esto es lo

último que vamos a ver y de ahí directo a hacer hartos ejercicios en

las pruebas que estén bien.',
    '1
00:00:03,220 --> 00:00:06,260
Hola, hola. Vamos a ver si es que aprendieron o no el tratamiento de la

2
00:00:06,260 --> 00:00:09,540
diabetes con varios ejercicios en los cuales, si es que no lo han aprendido

3
00:00:09,540 --> 00:00:13,320
todavía, ahora ya es el momento en que se grave de manera definitiva. Así que

4
00:00:13,320 --> 00:00:17,980
empecemos inmediatamente con el caso 1. Es un paciente de 68 años que está

5
00:00:17,980 --> 00:00:23,120
con metformina 850 cada 8 horas. O sea, está con la dosis máxima ya de

6
00:00:23,120 --> 00:00:28,260
metformina y está con una hemoglobina A1C de 8%. Uno dice, ¿qué edad tiene?

7
00:00:28,260 --> 00:00:33,200
68 años. El objetivo debería ser 7% de hemoglobina glicosilada o menos,

8
00:00:33,200 --> 00:00:37,120
así que en este caso hay que agregar un segundo hipoglicemiante. Ahora, ¿cuál

9
00:00:37,120 --> 00:00:41,240
la Glivenklamida? Es el clásico en Chile cuando no hay recursos y no hay

10
00:00:41,240 --> 00:00:45,320
un alto riesgo de hipoglicemia. Aquí a los 68 años ya hay algo de riesgo.

11
00:00:45,320 --> 00:00:49,600
Así que lo ideal es que sea otro hipoglicemiante en la medida que el

12
00:00:49,600 --> 00:00:52,400
bolsillo lo aguante o que los recursos del sistema público lo aguante.

13
00:00:52,400 --> 00:00:57,600
El caso 2. 77 años. Acá ya tienen más de 75 años, así que el objetivo

14
00:00:58,200 --> 00:01:03,960
de la hemoglobina glicosilada es menor a 8%. Está con metformina más Glivenklamida

15
00:01:03,960 --> 00:01:09,480
que cada 12 horas ambos. La metformina está en 850 cada 12, así que todavía

16
00:01:09,480 --> 00:01:12,960
se puede subir un poco más. La Glivenklamida está en 5 miligramos cada 12,

17
00:01:12,960 --> 00:01:16,640
así que también se puede subir a 10 miligramos cada 12. Pero si se fijan

18
00:01:16,640 --> 00:01:19,760
aquí está bien controlado y no solamente que está bien controlado,

19
00:01:19,760 --> 00:01:24,480
sino que está demasiado bien controlado para tener 77 años. Así que la

20
00:01:24,520 --> 00:01:29,360
conducta más adecuada va a ser suspenda la Glivenklamida y que su hemoglobina

21
00:01:29,360 --> 00:01:33,080
glicosilada suba un poquito porque no pasa nada. Ahora, se podría también

22
00:01:33,080 --> 00:01:38,000
cambiar a la metformina 850 tres veces al día y de esa manera puedo

23
00:01:38,000 --> 00:01:41,800
suspender la Glivenklamida sin mayor problema. La otra forma de verlo es

24
00:01:41,800 --> 00:01:45,860
es un adulto mayor, bastante mayor, así que per se la Glivenklamida me da

25
00:01:45,860 --> 00:01:49,800
miedo. Así que incluso si es que hubiese estado con una hemoglobina

26
00:01:49,800 --> 00:01:54,480
glicosilada ya más al límite, ejemplo en 7,5, igualmente suspender la

27
00:01:54,480 --> 00:01:57,840
Glivenklamida y cambiarla por otro hipoglicemiante habría sido una buena

28
00:01:57,840 --> 00:02:02,400
decisión. Vamos con el caso 3, 76 años, ya sabemos el objetivo de la

29
00:02:02,400 --> 00:02:06,880
hemoglobina glicosilada va a ser menor a 8%, está con metformina

30
00:02:06,880 --> 00:02:11,640
850 cada 8, así que está en el límite máximo y está por arriba del 8%,

31
00:02:11,640 --> 00:02:15,840
está en 8,8%, así que debo agregar un segundo

32
00:02:15,840 --> 00:02:19,560
hipoglicemiante, pero por tener 76 años no le puedo dejar Glivenklamida

33
00:02:19,560 --> 00:02:23,480
por un alto riesgo de hipoglicemia, así que se la deja o citagliptina o

34
00:02:23,480 --> 00:02:30,080
alguno de los GLP-1 o de los SGLUT-2. Vamos con el caso 4, 57 años, está con

35
00:02:30,080 --> 00:02:33,400
metformina también tres veces al día en la dosis máxima, Glivenklamida

36
00:02:33,400 --> 00:02:36,960
10 miligramos dos veces al día, así que está en dosis máxima también y

37
00:02:36,960 --> 00:02:41,080
aún así está con una hemoglobina glicosilada arriba de 7%, que es el

38
00:02:41,080 --> 00:02:46,320
objetivo a los 57 años, en los menores de 75 años, así que hay que avanzar

39
00:02:46,320 --> 00:02:50,320
todavía más, pero como ya está con las dosis máximas de dos hipoglicemiantes

40
00:02:50,320 --> 00:02:54,280
orales, lo único que me queda en este momento es agregar la insulina,

41
00:02:54,280 --> 00:02:58,360
que acuérdense que se empieza con una dosis de NPH habitualmente en la

42
00:02:58,360 --> 00:03:02,080
noche. Ahora, cuando yo parto la insulina, recuerden que lo habitual es

43
00:03:02,080 --> 00:03:05,560
que se suspende la Glivenklamida o los hipoglicemiantes en general y se

44
00:03:05,560 --> 00:03:09,840
suele mantener la metformina sabiendo que es aceptable mantenerlo

45
00:03:09,840 --> 00:03:15,680
y suspenderlo. El caso 5, 48 años que está con metformina 8.50 cada 8,

46
00:03:15,680 --> 00:03:20,240
nuevamente la dosis máxima de metformina, está con la hemoglobina

47
00:03:20,240 --> 00:03:25,840
glicosilada en 10,8%, está arriba de 9%, está demasiado alta, ahí per se ya

48
00:03:25,840 --> 00:03:30,280
tiene indicación de insulina, pero aparte me dicen que tiene antecedentes

49
00:03:30,280 --> 00:03:34,960
de hipotiroidismo, o sea si se fijan es un paciente o una paciente

50
00:03:34,960 --> 00:03:39,160
relativamente joven, aparte de eso con antecedentes de autoinmunidad y

51
00:03:39,160 --> 00:03:42,520
con un control metabólico muy malo, hay que sospechar que no vaya a ser una

52
00:03:42,520 --> 00:03:46,000
diabetes autoinmune del adulto, una diabetes lada, pero ya sabemos que la

53
00:03:46,000 --> 00:03:49,960
conducta sí o sí es insulina y para confirmar que sea una diabetes lada

54
00:03:49,960 --> 00:03:53,560
va a haber que pedirle el peptidocé, que debería estar bajo, más los

55
00:03:53,560 --> 00:03:57,760
anticuerpos marcadores de autoinmunidad en la diabetes, digas

56
00:03:57,760 --> 00:04:01,800
los anticuerpos antiinsulina, los antislote, los antigat, los anti el

57
00:04:01,800 --> 00:04:10,920
transportador de zinc-8 y los anti la tirosinquinasa-2, ahora en el

58
00:04:10,920 --> 00:04:15,560
caso 6 tiene 58 años, está con metformina 1 gramo cada

59
00:04:15,560 --> 00:04:19,920
8 horas y que está en el límite máximo, la hemoglobina glicosilada está

60
00:04:19,920 --> 00:04:24,320
arriba de 7%, así que está con un mal control y tuvo un infarto hace 6

61
00:04:24,320 --> 00:04:28,880
meses, en este caso por estar la hemoglobina glicosilada arriba hay que

62
00:04:28,880 --> 00:04:33,760
partirle un hipolisemigante adicional y por haber tenido un

63
00:04:33,760 --> 00:04:37,640
infarto hace 6 meses hay que dejarle algunos de estos hipolisemigantes que

64
00:04:37,640 --> 00:04:43,480
tienen mejor rendimiento cardiovascular, dígase el algún glp1 como

65
00:04:43,480 --> 00:04:48,160
el liraglutide o algún esglut2 como por ejemplo la empaglifosina, así

66
00:04:48,160 --> 00:04:53,200
que esa sería la respuesta en este caso, ahora además las estatinas, la

67
00:04:53,200 --> 00:04:57,520
aspirina y todas las cosas del alto riesgo cardiovascular, en el caso 7

68
00:04:57,640 --> 00:05:02,760
tiene 45 años, está con una hemoglobina a1c en 8% así que está por

69
00:05:02,760 --> 00:05:07,840
arriba de lo aceptable, aparte de eso me dice que tiene artritis reumatoide y

70
00:05:07,840 --> 00:05:11,480
con eso yo digo ya tiene autoinmunidad así que no vaya a ser una diabetes

71
00:05:11,480 --> 00:05:15,600
slada, aunque la artritis reumatoide no se asocia tanto a diabetes slada

72
00:05:15,600 --> 00:05:19,400
pero aún así hay que tener cuidado, está con prednisona y acuérdense que

73
00:05:19,400 --> 00:05:23,160
los corticoides pudieran generarme diabetes también y con el metotexate

74
00:05:23,160 --> 00:05:26,880
que es el tratamiento de la artritis reumatoide y su glicemia está en

75
00:05:26,880 --> 00:05:33,440
200, está súper alto así que sin mucha duda hay una diabetes mal

76
00:05:33,440 --> 00:05:37,160
controlada y se hace una segunda hemoglobina glicosilada que está ya en

77
00:05:37,160 --> 00:05:43,080
el límite de 8,8%, no alcanza a ser 9% pero sea como sea, con toda

78
00:05:43,080 --> 00:05:47,040
esa historia hay que partir la insulina sí o sí, por tres razones, número

79
00:05:47,040 --> 00:05:51,840
uno porque está con corticoides, número dos porque puede ser una

80
00:05:51,840 --> 00:05:54,840
diabetes slada y número tres porque el control metabólico está

81
00:05:54,840 --> 00:05:58,360
especialmente malo aunque ese es un número un poquito más débil porque

82
00:05:58,360 --> 00:06:04,920
el corte para que sigo sí sea insulina es 9% no 8,8 como está ahí. Vamos con

83
00:06:04,920 --> 00:06:09,440
el caso 8, tiene 58 años, está con metformina en el límite máximo en un

84
00:06:09,440 --> 00:06:13,520
gramo cada 8 horas, la hemoglobina glicosilada está en 6,8 así que está

85
00:06:13,520 --> 00:06:17,800
bien controlado pero me dicen que tiene una crea de 1,3 miligramos por

86
00:06:17,800 --> 00:06:21,080
decilitro, si se acuerdan la falla renal me contraindicaba la

87
00:06:21,080 --> 00:06:26,240
metformina pero tenía que ser una crea de 1,5 o más, aquí está en 1,3 así

88
00:06:26,240 --> 00:06:30,000
que no me la contraindica, yo digo está bien controlado pues que se quede con su

89
00:06:30,000 --> 00:06:32,960
metformina en esa dosis no hay por qué hacer absolutamente ningún

90
00:06:32,960 --> 00:06:39,520
cambio. Vamos con el caso nuevo, el caso nueve perdón, tiene 80 años, está

91
00:06:39,520 --> 00:06:43,880
con metformina 8,50 cada 8 nuevamente la dosis máxima de metformina como

92
00:06:43,880 --> 00:06:46,520
casi todos los ejemplos porque obviamente si está con una dosis más

93
00:06:46,520 --> 00:06:50,200
baja de metformina hay que subirlo nomás, la glivenclamida está 5 miligramos

94
00:06:50,200 --> 00:06:53,840
cada 12 así que en estricto rigor se podría subir hasta 10 miligramos cada 12

95
00:06:53,840 --> 00:07:01,060
la hemoglobina A1C está en 8,8 entonces fíjense está demasiado alta de

96
00:07:01,060 --> 00:07:06,080
hecho incluso está demasiado alta para tener 80 años en el sentido en que

97
00:07:06,080 --> 00:07:10,480
a los 80 años uno exige que esté debajo de 8 pero puede estar

98
00:07:10,480 --> 00:07:14,640
arriba de 7% y me dice que aparte tiene hipoglicemias con esto yo

99
00:07:14,640 --> 00:07:20,600
digo tengo que quitarle sí o sí la glivenclamida porque ya me está

100
00:07:20,600 --> 00:07:24,640
haciendo hipoglicemia, segundo lugar está muy mal controlado a pesar de

101
00:07:24,640 --> 00:07:28,160
estar con dosis relativamente altas y que es un candidato a insulina así

102
00:07:28,160 --> 00:07:33,160
que la respuesta acá sería suspender la glivenclamida cambiarlo por otro

103
00:07:33,160 --> 00:07:37,240
hipoglicemiante que eventualmente ande bien como ejemplo la citaglutina

104
00:07:37,240 --> 00:07:41,560
pero no está notado ahí pero en este caso en particular es muy probable

105
00:07:42,000 --> 00:07:45,920
que requiere insulina también porque independientemente de que yo le

106
00:07:45,920 --> 00:07:51,840
inicie un hipoglicemente distinto va a ser difícil estando ya con esas dosis

107
00:07:51,840 --> 00:07:56,920
de esos medicamentos bajarla a menos de 8% pero aún así se puede intentar

108
00:07:56,920 --> 00:08:03,200
dejarle la citaglutina, algún glp1 o un sglut2 y ver qué es lo que pasa

109
00:08:03,200 --> 00:08:06,720
con la hemoglobina glicosilada antes de tomar una decisión. El caso 10

110
00:08:06,720 --> 00:08:10,720
tiene 58 años está con metformina un gramo cada 8 horas también así

111
00:08:10,720 --> 00:08:15,160
que la dosis máxima está con la hemoglobina glicosilada en 8,8 así que

112
00:08:15,160 --> 00:08:21,240
está bajo 9 no tiene indicación de insulina todavía pero sí está muy

113
00:08:21,240 --> 00:08:27,160
mal controlado y está con una crea de 1,8 como está con una crea tan

114
00:08:27,160 --> 00:08:30,960
elevada arriba de 1,5 para empezar está absolutamente contraindicada la

115
00:08:30,960 --> 00:08:35,320
metformina y lo más probable es que va a quedar con insulina. Ahora como

116
00:08:35,320 --> 00:08:39,760
alternativa en lugar de iniciarle insulina que es la respuesta más

117
00:08:39,760 --> 00:08:43,680
fácil es el suspender la metformina y cambiarlo por algunos de los

118
00:08:43,680 --> 00:08:48,280
medicamentos que sí se puede dejar en contexto de una falla renal que si se

119
00:08:48,280 --> 00:08:52,480
acuerdan eran los glp1 fundamentalmente y también me servían

120
00:08:52,480 --> 00:08:58,300
los sglut2 pero no funcionaban de manera tan efectiva o eficaz en la

121
00:08:58,300 --> 00:09:02,440
falla renal porque justamente funcionaban eliminando azúcar por

122
00:09:02,440 --> 00:09:08,320
la orina así que en ese caso la insulina o los agonistas del glp1

123
00:09:08,320 --> 00:09:14,680
van a ser la respuesta correcta. En el caso 11 65 años con una hemoglobina

124
00:09:14,680 --> 00:09:18,440
glicosilada en 9,5 ya estamos muy mal así que obviamente hay que partirle

125
00:09:18,440 --> 00:09:22,480
insulina y está con metformina 500 milígramos dos veces al día está

126
00:09:22,480 --> 00:09:25,960
con una dosis muy bajita se podría subir pero por la hemoglobina arriba de

127
00:09:25,960 --> 00:09:29,640
9% la respuesta es insulina sin ninguna duda así que quedaría con

128
00:09:29,640 --> 00:09:34,680
insulina nph y la metformina se puede mantener sin ningún problema se

129
00:09:34,720 --> 00:09:38,440
podría subir también un poquito la dosis a medida que voy ajustando la

130
00:09:38,440 --> 00:09:43,280
dosis de insulina nph y bueno espero que hayan aprendido porque esto es lo

131
00:09:43,280 --> 00:09:46,880
último que vamos a ver y de ahí directo a hacer hartos ejercicios en

132
00:09:46,880 --> 00:09:49,760
las pruebas que estén bien.',
    'Esta cápsula es de integración. Vamos a aplicar todo lo aprendido sobre el tratamiento de la diabetes a través de una serie de casos clínicos que reproducen el estilo de pregunta habitual del EUNACOM. El objetivo es que desarrollen el razonamiento clínico que les permita resolver estos escenarios con seguridad y rapidez.

**Caso 1.** Paciente de 68 años con metformina 850 mg cada 8 horas y hemoglobina glicosilada del 8%. Con metformina en dosis máxima y HbA1c sobre el objetivo de 7% que corresponde a su edad, la conducta es agregar un segundo hipoglicemiante. La pregunta es cuál. A los 68 años el riesgo de hipoglicemia empieza a ser relevante, por lo que si los recursos lo permiten, se prefiere una gliptina como la sitagliptina. Si no hay recursos disponibles, la glibenclamida es aceptable pero con vigilancia.

**Caso 2.** Paciente de 77 años en metformina 850 mg cada 12 horas más glibenclamida 5 mg cada 12 horas, con hemoglobina glicosilada del 6,5%. A los 77 años el objetivo de HbA1c es menor al 8%, no al 7%. Con HbA1c de 6,5%, este paciente está demasiado bien controlado para su edad: hay riesgo de hipoglicemia. La conducta más adecuada es **suspender la glibenclamida**. Se podría compensar subiendo la metformina a tres veces al día para mantener control, pero lo crítico es retirar el fármaco que genera hipoglicemia en un adulto mayor.',
    '["En mayores de 75 años el objetivo de HbA1c es < 8%; un control excesivamente estricto es tan peligroso como el mal control, por el riesgo de hipoglicemia.","La glibenclamida está contraindicada en adultos mayores, en pacientes con hipoglicemias previas y en falla renal o cardíaca grave.","Una HbA1c > 9% obliga a iniciar insulina independientemente del tratamiento previo; no se esperan más escalones de hipoglicemiantes.","En paciente joven con mal control + autoinmunidad (hipotiroidismo, artritis reumatoide) + diabetes resistente a metformina, siempre sospechar LADA y estudiar con péptido C y anticuerpos.","Creatinina ≥ 1,5 mg/dL o clearance < 30 mL/min contraindican la metformina; en ese contexto, la insulina o los agonistas GLP-1 son las alternativas más seguras."]'::jsonb,
    '[{"para":"\"HbA1c > 9% = insulina AHORA\":","nemotecnia":"\"HbA1c > 9% = insulina AHORA\":","explicacion":"No importa si está con uno o dos hipoglicemiantes, si recién fue diagnosticado o lleva años. Cuando la HbA1c supera el 9%, la insulina no admite demoras.\nNo importa si está con uno o dos hipoglicemiantes, si recién fue diagnosticado o lleva años. Cuando la HbA1c supera el 9%, la insulina no admite demoras."},{"para":"\"Adulto mayor + glibenclamida = alarma roja\":","nemotecnia":"\"Adulto mayor + glibenclamida = alarma roja\":","explicacion":"En mayores de 75 años la glibenclamida es peligrosa. Si la ven en un adulto mayor con buen control, suspendan. Si la ven con mal control, cambien a otra alternativa.En mayores de 75 años la glibenclamida es peligrosa. Si la ven en un adulto mayor con buen control, suspendan. Si la ven con mal control, cambien a otra alternativa."},{"para":"\"Autoinmunidad + joven + resistente a orales = ¡LADA!\":","nemotecnia":"\"Autoinmunidad + joven + resistente a orales = ¡LADA!\":","explicacion":"Cuando un adulto joven con otra enfermedad autoinmune no responde a la metformina y tiene hiperglicemia severa, no es una diabetes tipo 2 difícil de controlar: probablemente es una LADA. Pidan anticuerpos.Cuando un adulto joven con otra enfermedad autoinmune no responde a la metformina y tiene hiperglicemia severa, no es una diabetes tipo 2 difícil de controlar: probablemente es una LADA. Pidan anticuerpos."}]'::jsonb,
    '["En mayores de 75 años el objetivo de HbA1c es < 8%; un control excesivamente estricto es tan peligroso como el mal control, por el riesgo de hipoglicemia.","La glibenclamida está contraindicada en adultos mayores, en pacientes con hipoglicemias previas y en falla renal o cardíaca grave.","Una HbA1c > 9% obliga a iniciar insulina independientemente del tratamiento previo; no se esperan más escalones de hipoglicemiantes."]'::jsonb,
    '[]'::jsonb,
    '[{"pregunta":"¿Cuál de las siguientes afirmaciones es correcta?","respuesta":"Respuesta correcta: C — La combinación de edad joven, enfermedad autoinmune concomitante y diabetes severamente mal controlada resistente a metformina es el escenario clásico de diabetes LADA; la conducta inmediata es insulina, y el estudio con péptido C y anticuerpos confirma el diagnóstico."}]'::jsonb,
    NOW(),
    TRUE,
    FALSE  -- first 3 free preview
  ) ON CONFLICT (specialty_id, order_index)
  DO UPDATE SET
    title            = EXCLUDED.title,
    duration_seconds = EXCLUDED.duration_seconds,
    txt_content      = EXCLUDED.txt_content,
    srt_content      = EXCLUDED.srt_content,
    ai_summary       = EXCLUDED.ai_summary,
    ai_key_concepts  = EXCLUDED.ai_key_concepts,
    ai_mnemonics     = EXCLUDED.ai_mnemonics,
    ai_high_yield    = EXCLUDED.ai_high_yield,
    ai_review_qs     = EXCLUDED.ai_review_qs,
    ai_processed_at  = NOW(),
    is_available     = TRUE;

  -- Cápsula 13: Manejo de la Hipertensión Arterial en el Paciente Diabético
  INSERT INTO lessons (
    specialty_id, title, order_index, duration_seconds,
    txt_content, srt_content,
    ai_summary, ai_key_concepts, ai_mnemonics,
    ai_high_yield, ai_algorithms, ai_review_qs,
    ai_processed_at, is_available, is_free_preview
  ) VALUES (
    v_specialty_id,
    'Manejo de la Hipertensión Arterial en el Paciente Diabético',
    13,
    240,
    'Hola, hola. Veamos cómo se maneja la hipertensión en los diabéticos que hay

harta evidencia, hartas cosas que hay que tomar en consideración y sirve como

repaso para los anti hipertensivos también. Así que empecemos con cuál es

el objetivo de presión arterial en el diabético. Pues existen dos grandes

corrientes. Uno que dicen 130-80 que es la más aceptada a nivel

internacional y la otra que dice 140-90 que más de algún documento del

aquí en Chile sugiere el 140-90, pero hay otros que dicen 130-80. Así que subrayo

ese y quédense con ese valor si es que los obligan a elegir entre uno u otro.

Ahora, cuando hay nefropatía, ya sea la caída del clearance o ya sea la

microalbuminuria o macroalbuminuria o una proteínuria en un rango más

alto, cuando hay daño renal, en ese caso, el 130-80 es obligatorio. Ese

es el que hay que elegir. Segundo lugar, qué anti hipertensivo hay que

dejar y pues hay que saber cuáles son los beneficios y los daños que

puede generar en el paciente diabético cada una de las familias de

anti hipertensivos. Y empecemos con qué dice la evidencia. La evidencia

dice todos los anti hipertensivos sirven en la diabetes, pero hay que

tener cuidado con cuáles son los potenciales como efectos negativos. Y

segundo lugar, hay que tener alto cuidado con las comorbilidades porque

hay algunas veces en que tiene diabetes, pero aparte de eso tiene una

serie de otras enfermedades que me obligan a dejarle algún

anti hipertensivo que no le habría dejado a un diabético. Ejemplo, tengo

un paciente que tiene una falla cardíaca importante, seguramente le voy

a dejar un beta bloqueo, aunque no me gusta dejárselo a alguien que sea

diabético, pero con eso le voy a aumentar su sobrevía. Así que

nuevamente hay que meter en una balanza esta decisión. Pero vemos

cada una de las familias. Los YECA y los ARA2 suelen ser los de

elección en la diabetes. Ahora pongo en ese mismo cuadro al Diltiazem, a

los bloqueadores del calcio no dihidropiridínicos. ¿Por qué? Porque

tienen el efecto que es bueno en la diabetes de disminuir la

proteinuria, de disminuir la albuminuria y por lo tanto de

disminuir la progresión de la insuficiencia renal y de la

nefropatía diabética. Así que YECA y ARA2, cualquiera de los dos, son

el tratamiento de elección en el diabético con hipertensión, sabiendo

que el Diltiazem eventualmente me puede ayudar también. Segundo

lugar, las T-Acidas son buenas, se usan, pero aumentan la

resistencia a la insulina. Así que hay que saber que si le voy

a dejar una T-Acida a un diabético, eventualmente se me puede

descompensar del punto de vista metabólico. O bien, si

tengo un paciente diabético mal controlado, no le de una

T-Acida o un diurético, sino que busque otro medicamento.

En el caso del beta bloqueo sirve en la diabetes, pero

tiene lo malo que me ocultan los síntomas de hipoglicemia.

En específico, los síntomas simpático miméticos, que son

los iniciales, los que anteceden a los más graves, que

son los neuroglucopénicos, ¿cierto? Así que me da miedo

dejarle el Atenolol o algún otro beta bloqueante a un

diabético que tenga riesgo de hipoglicemia. Así que me va

quedando solamente el Amludipino, que es de la

familia de los bloqueadores del calcio sí dihidropiridínicos.

El Diltiazem y el Merapamilio son los no dihidropiridínicos.

El Amludipino, el Nifedipino, que casi no se usa.

Y el Nitrendipino, que casi no se usa tampoco, porque

ha sido desplazado por el Amludipino, que dura más.

No es ni bueno ni malo la diabetes.

Así que se puede dejar en la diabetes si es que

tengo que dejarle algo más.

Así que, ¿cuál es la conclusión?

¿Cuál es el resumen de todo esto?

Y que valía la pena explicarlo.

Así que por eso es que los obligué a dedicar algo de

tiempo a esto.

Pero la conclusión es deje que llegue aguardado.

Y si hay que agregar algo más, pues agrégale un bloqueador

de calcio.

Idealmente el Diltiazem si es que viene con albuminuria o

bien el Amludipino si es que viene sin albuminuria.

O si es que es más barato y está disponible.

Así que eso, que estén bien.',
    '1
00:00:03,220 --> 00:00:08,020
Hola, hola. Veamos cómo se maneja la hipertensión en los diabéticos que hay

2
00:00:08,020 --> 00:00:11,540
harta evidencia, hartas cosas que hay que tomar en consideración y sirve como

3
00:00:11,540 --> 00:00:15,700
repaso para los anti hipertensivos también. Así que empecemos con cuál es

4
00:00:15,700 --> 00:00:20,340
el objetivo de presión arterial en el diabético. Pues existen dos grandes

5
00:00:20,340 --> 00:00:24,300
corrientes. Uno que dicen 130-80 que es la más aceptada a nivel

6
00:00:24,300 --> 00:00:28,900
internacional y la otra que dice 140-90 que más de algún documento del

7
00:00:29,340 --> 00:00:34,540
aquí en Chile sugiere el 140-90, pero hay otros que dicen 130-80. Así que subrayo

8
00:00:34,540 --> 00:00:39,100
ese y quédense con ese valor si es que los obligan a elegir entre uno u otro.

9
00:00:39,100 --> 00:00:44,380
Ahora, cuando hay nefropatía, ya sea la caída del clearance o ya sea la

10
00:00:44,380 --> 00:00:49,380
microalbuminuria o macroalbuminuria o una proteínuria en un rango más

11
00:00:49,380 --> 00:00:53,860
alto, cuando hay daño renal, en ese caso, el 130-80 es obligatorio. Ese

12
00:00:53,860 --> 00:00:57,660
es el que hay que elegir. Segundo lugar, qué anti hipertensivo hay que

13
00:00:57,660 --> 00:01:03,100
dejar y pues hay que saber cuáles son los beneficios y los daños que

14
00:01:03,100 --> 00:01:05,860
puede generar en el paciente diabético cada una de las familias de

15
00:01:05,860 --> 00:01:10,260
anti hipertensivos. Y empecemos con qué dice la evidencia. La evidencia

16
00:01:10,260 --> 00:01:14,940
dice todos los anti hipertensivos sirven en la diabetes, pero hay que

17
00:01:14,940 --> 00:01:20,060
tener cuidado con cuáles son los potenciales como efectos negativos. Y

18
00:01:20,060 --> 00:01:23,020
segundo lugar, hay que tener alto cuidado con las comorbilidades porque

19
00:01:23,020 --> 00:01:26,460
hay algunas veces en que tiene diabetes, pero aparte de eso tiene una

20
00:01:26,460 --> 00:01:29,740
serie de otras enfermedades que me obligan a dejarle algún

21
00:01:29,740 --> 00:01:33,660
anti hipertensivo que no le habría dejado a un diabético. Ejemplo, tengo

22
00:01:33,660 --> 00:01:36,860
un paciente que tiene una falla cardíaca importante, seguramente le voy

23
00:01:36,860 --> 00:01:40,180
a dejar un beta bloqueo, aunque no me gusta dejárselo a alguien que sea

24
00:01:40,180 --> 00:01:43,180
diabético, pero con eso le voy a aumentar su sobrevía. Así que

25
00:01:43,180 --> 00:01:47,340
nuevamente hay que meter en una balanza esta decisión. Pero vemos

26
00:01:47,340 --> 00:01:51,660
cada una de las familias. Los YECA y los ARA2 suelen ser los de

27
00:01:51,660 --> 00:01:56,860
elección en la diabetes. Ahora pongo en ese mismo cuadro al Diltiazem, a

28
00:01:56,860 --> 00:02:01,060
los bloqueadores del calcio no dihidropiridínicos. ¿Por qué? Porque

29
00:02:01,060 --> 00:02:05,060
tienen el efecto que es bueno en la diabetes de disminuir la

30
00:02:05,060 --> 00:02:08,740
proteinuria, de disminuir la albuminuria y por lo tanto de

31
00:02:08,740 --> 00:02:11,220
disminuir la progresión de la insuficiencia renal y de la

32
00:02:11,220 --> 00:02:15,420
nefropatía diabética. Así que YECA y ARA2, cualquiera de los dos, son

33
00:02:15,420 --> 00:02:20,100
el tratamiento de elección en el diabético con hipertensión, sabiendo

34
00:02:20,140 --> 00:02:23,340
que el Diltiazem eventualmente me puede ayudar también. Segundo

35
00:02:23,340 --> 00:02:27,660
lugar, las T-Acidas son buenas, se usan, pero aumentan la

36
00:02:27,660 --> 00:02:29,940
resistencia a la insulina. Así que hay que saber que si le voy

37
00:02:29,940 --> 00:02:33,340
a dejar una T-Acida a un diabético, eventualmente se me puede

38
00:02:33,340 --> 00:02:35,580
descompensar del punto de vista metabólico. O bien, si

39
00:02:35,580 --> 00:02:40,420
tengo un paciente diabético mal controlado, no le de una

40
00:02:40,420 --> 00:02:44,620
T-Acida o un diurético, sino que busque otro medicamento.

41
00:02:44,620 --> 00:02:47,420
En el caso del beta bloqueo sirve en la diabetes, pero

42
00:02:47,460 --> 00:02:50,660
tiene lo malo que me ocultan los síntomas de hipoglicemia.

43
00:02:50,660 --> 00:02:54,860
En específico, los síntomas simpático miméticos, que son

44
00:02:54,860 --> 00:02:57,580
los iniciales, los que anteceden a los más graves, que

45
00:02:57,580 --> 00:03:01,460
son los neuroglucopénicos, ¿cierto? Así que me da miedo

46
00:03:01,460 --> 00:03:06,460
dejarle el Atenolol o algún otro beta bloqueante a un

47
00:03:06,460 --> 00:03:09,660
diabético que tenga riesgo de hipoglicemia. Así que me va

48
00:03:09,660 --> 00:03:12,740
quedando solamente el Amludipino, que es de la

49
00:03:12,740 --> 00:03:17,180
familia de los bloqueadores del calcio sí dihidropiridínicos.

50
00:03:17,180 --> 00:03:21,100
El Diltiazem y el Merapamilio son los no dihidropiridínicos.

51
00:03:21,100 --> 00:03:24,020
El Amludipino, el Nifedipino, que casi no se usa.

52
00:03:24,020 --> 00:03:27,020
Y el Nitrendipino, que casi no se usa tampoco, porque

53
00:03:27,020 --> 00:03:30,180
ha sido desplazado por el Amludipino, que dura más.

54
00:03:30,180 --> 00:03:31,580
No es ni bueno ni malo la diabetes.

55
00:03:31,580 --> 00:03:34,260
Así que se puede dejar en la diabetes si es que

56
00:03:34,260 --> 00:03:35,540
tengo que dejarle algo más.

57
00:03:35,540 --> 00:03:37,020
Así que, ¿cuál es la conclusión?

58
00:03:37,020 --> 00:03:38,980
¿Cuál es el resumen de todo esto?

59
00:03:38,980 --> 00:03:40,940
Y que valía la pena explicarlo.

60
00:03:40,940 --> 00:03:43,780
Así que por eso es que los obligué a dedicar algo de

61
00:03:43,780 --> 00:03:44,660
tiempo a esto.

62
00:03:44,700 --> 00:03:47,420
Pero la conclusión es deje que llegue aguardado.

63
00:03:47,420 --> 00:03:49,820
Y si hay que agregar algo más, pues agrégale un bloqueador

64
00:03:49,820 --> 00:03:50,620
de calcio.

65
00:03:50,620 --> 00:03:53,820
Idealmente el Diltiazem si es que viene con albuminuria o

66
00:03:53,820 --> 00:03:57,140
bien el Amludipino si es que viene sin albuminuria.

67
00:03:57,140 --> 00:04:00,220
O si es que es más barato y está disponible.

68
00:04:00,220 --> 00:04:02,460
Así que eso, que estén bien.',
    'En esta cápsula abordaremos uno de los temas más relevantes en el manejo del paciente diabético: el control de la presión arterial. Este tema, además de ser frecuente en el EUNACOM, sirve como excelente repaso de los antihipertensivos y sus implicancias metabólicas.

Lo primero que deben tener claro es cuál es el objetivo tensional en el diabético. Existen dos corrientes principales. La mayoría de las guías internacionales establece como meta una presión arterial menor a 130 sobre 80 mmHg, y es este valor el que deben privilegiar si los obliga a elegir. Sin embargo, algunos documentos nacionales mencionan el 140 sobre 90 como meta alternativa. La diferencia se zanja de la siguiente manera: cuando existe nefropatía diabética, ya sea en forma de microalbuminuria, macroalbuminuria, caída del clearance de creatinina o cualquier grado de daño renal, el objetivo es obligatoriamente 130 sobre 80. En ese contexto clínico, no hay discusión posible.

Pasemos ahora a elegir el antihipertensivo más adecuado. La evidencia disponible demuestra que todos los grupos farmacológicos son eficaces para reducir la presión arterial en el diabético. Sin embargo, cada familia tiene matices que debemos conocer para tomar decisiones clínicas inteligentes.',
    '["El objetivo de presión arterial en el diabético es menor a 130/80 mmHg, especialmente cuando existe nefropatía de cualquier grado.","Los IECA y ARA-2 son los antihipertensivos de elección en el diabético por su efecto antiproteinúrico y renoprotector.","El Diltiazem (bloqueador del calcio no dihidropiridínico) se suma a los IECA/ARA-2 cuando hay albuminuria; el Amlodipino es neutro y puede usarse como complemento sin albuminuria.","Las tiazidas aumentan la resistencia a la insulina; los betabloqueadores enmascaran los síntomas simpáticomiméticos de la hipoglicemia.","La elección del antihipertensivo siempre debe ponderarse según las comorbilidades: una insuficiencia cardíaca puede justificar el uso de betabloqueadores pese a sus desventajas metabólicas."]'::jsonb,
    '[{"para":"\"IECA protege el RIÑÓN, Amlodipino es NEUTRO, Tiazida SUBE azúcar, Beta ESCONDE hipoglicemia\"","nemotecnia":"\"IECA protege el RIÑÓN, Amlodipino es NEUTRO, Tiazida SUBE azúcar, Beta ESCONDE hipoglicemia\"","explicacion":"Orden de preferencia en diabético hipertenso: I-R-I-E (IECA → Refuerzo → IECA + Diltiazem/Amlodipino → Excepción betabloqueador).\nOrden de preferencia en diabético hipertenso: I-R-I-E (IECA → Refuerzo → IECA + Diltiazem/Amlodipino → Excepción betabloqueador)."},{"para":"\"ARA-2 y IECA = ALBÚMINA desaparece\"","nemotecnia":"\"ARA-2 y IECA = ALBÚMINA desaparece\"","explicacion":"Ambos reducen la proteinuria. Si hay albuminuria → agregar Diltiazem (no dihidropiridínico). Si no hay albuminuria → Amlodipino.Ambos reducen la proteinuria. Si hay albuminuria → agregar Diltiazem (no dihidropiridínico). Si no hay albuminuria → Amlodipino."},{"para":"\"Beta OJO: TAPA la alarma\"","nemotecnia":"\"Beta OJO: TAPA la alarma\"","explicacion":"El betabloqueador tapa los síntomas simpáticos (taquicardia, temblor, sudor) que avisan que viene la hipoglicemia. Sin alarma, el paciente cae directo al coma.El betabloqueador tapa los síntomas simpáticos (taquicardia, temblor, sudor) que avisan que viene la hipoglicemia. Sin alarma, el paciente cae directo al coma."}]'::jsonb,
    '["El objetivo de presión arterial en el diabético es menor a 130/80 mmHg, especialmente cuando existe nefropatía de cualquier grado.","Los IECA y ARA-2 son los antihipertensivos de elección en el diabético por su efecto antiproteinúrico y renoprotector.","El Diltiazem (bloqueador del calcio no dihidropiridínico) se suma a los IECA/ARA-2 cuando hay albuminuria; el Amlodipino es neutro y puede usarse como complemento sin albuminuria."]'::jsonb,
    '[]'::jsonb,
    '[{"pregunta":"¿Cuál de las siguientes afirmaciones es correcta respecto al manejo antihipertensivo en el paciente diabético?","respuesta":"Respuesta correcta: C — En presencia de nefropatía diabética (microalbuminuria, macroalbuminuria o caída del clearance), la meta tensional es obligatoriamente 130/80 mmHg, y los IECA o ARA-2 son de elección por su capacidad de reducir la proteinuria y frenar la progresión del daño renal."}]'::jsonb,
    NOW(),
    TRUE,
    FALSE  -- first 3 free preview
  ) ON CONFLICT (specialty_id, order_index)
  DO UPDATE SET
    title            = EXCLUDED.title,
    duration_seconds = EXCLUDED.duration_seconds,
    txt_content      = EXCLUDED.txt_content,
    srt_content      = EXCLUDED.srt_content,
    ai_summary       = EXCLUDED.ai_summary,
    ai_key_concepts  = EXCLUDED.ai_key_concepts,
    ai_mnemonics     = EXCLUDED.ai_mnemonics,
    ai_high_yield    = EXCLUDED.ai_high_yield,
    ai_review_qs     = EXCLUDED.ai_review_qs,
    ai_processed_at  = NOW(),
    is_available     = TRUE;

  -- Cápsula 14: Nefropatía Diabética — Diagnóstico y Manejo
  INSERT INTO lessons (
    specialty_id, title, order_index, duration_seconds,
    txt_content, srt_content,
    ai_summary, ai_key_concepts, ai_mnemonics,
    ai_high_yield, ai_algorithms, ai_review_qs,
    ai_processed_at, is_available, is_free_preview
  ) VALUES (
    v_specialty_id,
    'Nefropatía Diabética — Diagnóstico y Manejo',
    14,
    394,
    'Hola, hola, ¿cómo están? Hablemos de una de las complicaciones crónicas de la

diabetes, que es la nefropatía diabética. Hay que empezar por identificar la

definición. ¿Qué es una nefropatía diabética? Y es alguien diabético más

nefropatía, digase más albuminuria o más una insuficiencia renal crónica

entendiendo acá que la nefropatía diabética inicial es la que

se caracteriza solamente por la microalbuminuria o por una macroalbuminuria

que también puede ser, en particular la micro por su acaso, y en cambio la que

ya viene con una caída en el clearance, la que ya viene con una falla renal

propiamente tal, es la que se conoce como nefropatía diabética establecida.

El diagnóstico se hace midiendo justamente la albuminuria y la falla

renal y en el caso de la albuminuria se llama microalbuminuria cuando

hay entre 30 y 300 milígramos de albumina que se pierden por la orina

en el día, así que arriba de 30 ya hay una microalbuminuria y se llaman

macroalbuminuria cuando es mayor a 300 y acuérdense que cuando es más de 3

gramos de proteínas totales que se pierdan en el día uno ya habla de una

proteína en rango nefrótico, pero en este caso al menos la diferencia

entre micro y macroalbuminuria es la que está ahí. Arriba de 30 es micro,

abajo de 30 es normal y arriba de 300 es macroalbuminuria. Ahora la microalbuminuria

para medirla de esa forma hay que juntar orina de 24 horas que tiene

hartos errores en el sentido en que los pacientes no juntan bien el pipí

para poder someter los exámenes de laboratorio, así que muchas veces uno

utiliza una toma aislada que se mide la albuminuria y se mide la

creatininuria en concentraciones y se saca esta relación albuminuria

creatininuria que también se llama RAC, así como por la R de relación

albuminuria creatininuria RAC. En este caso suele ser más fácil y es lo que

se recomienda actualmente como el examen para determinar la cantidad de

albuminuria y se dice que un RAC mayor a 0,03 o mayor a 30 es

diagnóstico de una microalbuminuria. En este caso les pongo el 0,03 y el 30

porque muchas veces los informes vienen, los informes del examen me refiero

vienen con alguno de esos dos parámetros con el valor normal al lado

y va a depender qué unidad usen. En el caso de mayor a 0,03 va a ser

miligramos por decilitro de albumina dividido por miligramos por

decilitro de creatinina, en cambio en el RAC en el cual el corte es 30

miligramos por decilitro de albumina dividido por gramos por decilitro de

creatinina y en la vida real uno no se confunde en el sentido en que la

que viene con 30 viene sin decimales y la que viene con 0,03 viene con todos

los decimales así que es bien fácil de identificar. Esos valores hay que

sabérselos de memoria así que aprendérselos bien.

En el caso de la establecida se diagnostica con el clírens de

creatinina y obviamente desde el momento en que el clírens ya empieza a

caer de que la falla renal empieza a avanzar en sus etapas cierto uno ya

habla de una nefropatía diabética establecida con falla renal. Ahora

¿cuál es el tratamiento de la nefropatía diabética? Todas las cosas

generales, digase el manejo de la diabetes y con el contra

metabólico obviamente el manejo de la hipertensión arterial que en este

caso es muy importante de hecho importa más que mantenga presiones

arteriales dentro del rango menor a 130-80 que el manejo del control

metabólico para evitar la progresión sabiendo que ambas cosas sirven, el

manejo general de la insuficiencia renal crónica con todo lo que se va

a ver de manera específico en nefrología más el tratamiento de la

proteínuria en el sentido en que la microalbuminuria y luego la

albuminuria es un predictor de que va a evolucionar a falla renal pero

además se relaciona con la progresión de la falla renal y al

disminuir esta eliminación o pérdidas de las proteínas en orina se

consigue justamente evitar que esto siga avanzando y esto se hace con los

YECA que son el tratamiento de elección o bien con los ARA-2 y como

algo que me pueda ayudar cuando ya estoy en dosis máxima y quiero

agregar alguna cosa adicional puedo agregar los bloqueadores de calcio no

dihidro pyridínicos como el Diltia C. Así que en la práctica queda

con enalapril y luego de eso puede quedar con enalapril más Diltia C o

bien los ARA-2 puede quedar con el Losartan. Ahora qué pasa si yo tengo

alguien diabético pero viene no con una microalbuminuria o una

macroalbuminuria sino que viene con una proteínuria en rango nefrótico

arriba de 3 gramos al día ejemplo viene con 6 gramos al día en ese caso

yo voy a sospechar otra cosa voy a sospechar un síndrome nefrótico

primario en específico la glomerulopatía membranosa que se asocia

mucho a la diabetes justamente y lo que hay que hacer obviamente es el

solicitar una biopsia renal como para poder objetivar y diagnosticar y

confirmar que hay una glomerulopatía membranosa o nefropatía

membranosa o nefropatía extramembranosa todos son sinónimos

nefropatía o glomerulopatía membranosa o extramembranosa se asocia

la diabetes y si bien alguien puede decirme eso también es un tipo de

nefropatía diabética en general se le llama de manera diferente y la

nefropatía diabética en la microalbuminuria que era la inicial o

incipiente cierto y la falla renal no en con una proteína en rango

nefrótico quedó claro es importante no confundir la

glomerulopatía membranosa con la nefropatía diabética al menos como

concepto general dado que ambas se asocian a diabetes y finalmente qué

pasa si viene con un síndrome nefrítico o bien sin un síndrome

nefrítico pero con una glomerulone fritis en el examen de orina en el

sentido en que viene con una hematuria dismórfica pues lo que hay que

hacer es el estudio general de la glomerulone fritis o del síndrome

nefrítico que es ir a buscar la causa con los anticuerpos con los

distintos anticuerpos con el complemento los hana los hanka los

anti membrana basal los anti streptolicina o etcétera más la

biopsia ronal como para ver exactamente que glomerulone fritis es la que hay

ya pero como cosa importante los diabéticos tienen derecho a tener

síndrome nefrítico y a tener síndrome nefrótico y ahí lo importante es

estudiar el síndrome nefrítico y estudiar el síndrome nefrótico con

su respectiva biopsia que esté muy bien',
    '1
00:00:03,250 --> 00:00:06,530
Hola, hola, ¿cómo están? Hablemos de una de las complicaciones crónicas de la

2
00:00:06,530 --> 00:00:11,890
diabetes, que es la nefropatía diabética. Hay que empezar por identificar la

3
00:00:11,890 --> 00:00:15,870
definición. ¿Qué es una nefropatía diabética? Y es alguien diabético más

4
00:00:15,870 --> 00:00:20,270
nefropatía, digase más albuminuria o más una insuficiencia renal crónica

5
00:00:20,270 --> 00:00:25,410
entendiendo acá que la nefropatía diabética inicial es la que

6
00:00:25,410 --> 00:00:29,650
se caracteriza solamente por la microalbuminuria o por una macroalbuminuria

7
00:00:29,650 --> 00:00:33,810
que también puede ser, en particular la micro por su acaso, y en cambio la que

8
00:00:33,810 --> 00:00:36,690
ya viene con una caída en el clearance, la que ya viene con una falla renal

9
00:00:36,690 --> 00:00:40,770
propiamente tal, es la que se conoce como nefropatía diabética establecida.

10
00:00:40,770 --> 00:00:45,170
El diagnóstico se hace midiendo justamente la albuminuria y la falla

11
00:00:45,170 --> 00:00:50,290
renal y en el caso de la albuminuria se llama microalbuminuria cuando

12
00:00:50,290 --> 00:00:55,050
hay entre 30 y 300 milígramos de albumina que se pierden por la orina

13
00:00:55,050 --> 00:01:00,770
en el día, así que arriba de 30 ya hay una microalbuminuria y se llaman

14
00:01:00,770 --> 00:01:04,810
macroalbuminuria cuando es mayor a 300 y acuérdense que cuando es más de 3

15
00:01:04,810 --> 00:01:09,170
gramos de proteínas totales que se pierdan en el día uno ya habla de una

16
00:01:09,170 --> 00:01:12,650
proteína en rango nefrótico, pero en este caso al menos la diferencia

17
00:01:12,650 --> 00:01:18,370
entre micro y macroalbuminuria es la que está ahí. Arriba de 30 es micro,

18
00:01:18,410 --> 00:01:26,610
abajo de 30 es normal y arriba de 300 es macroalbuminuria. Ahora la microalbuminuria

19
00:01:26,610 --> 00:01:31,570
para medirla de esa forma hay que juntar orina de 24 horas que tiene

20
00:01:31,570 --> 00:01:37,370
hartos errores en el sentido en que los pacientes no juntan bien el pipí

21
00:01:37,370 --> 00:01:41,810
para poder someter los exámenes de laboratorio, así que muchas veces uno

22
00:01:41,810 --> 00:01:46,690
utiliza una toma aislada que se mide la albuminuria y se mide la

23
00:01:46,690 --> 00:01:51,090
creatininuria en concentraciones y se saca esta relación albuminuria

24
00:01:51,090 --> 00:01:55,810
creatininuria que también se llama RAC, así como por la R de relación

25
00:01:55,810 --> 00:02:00,610
albuminuria creatininuria RAC. En este caso suele ser más fácil y es lo que

26
00:02:00,610 --> 00:02:05,090
se recomienda actualmente como el examen para determinar la cantidad de

27
00:02:05,090 --> 00:02:11,010
albuminuria y se dice que un RAC mayor a 0,03 o mayor a 30 es

28
00:02:11,170 --> 00:02:17,010
diagnóstico de una microalbuminuria. En este caso les pongo el 0,03 y el 30

29
00:02:17,010 --> 00:02:22,690
porque muchas veces los informes vienen, los informes del examen me refiero

30
00:02:22,690 --> 00:02:25,650
vienen con alguno de esos dos parámetros con el valor normal al lado

31
00:02:25,650 --> 00:02:30,450
y va a depender qué unidad usen. En el caso de mayor a 0,03 va a ser

32
00:02:30,450 --> 00:02:33,650
miligramos por decilitro de albumina dividido por miligramos por

33
00:02:33,650 --> 00:02:38,770
decilitro de creatinina, en cambio en el RAC en el cual el corte es 30

34
00:02:38,930 --> 00:02:43,570
miligramos por decilitro de albumina dividido por gramos por decilitro de

35
00:02:43,570 --> 00:02:50,690
creatinina y en la vida real uno no se confunde en el sentido en que la

36
00:02:50,690 --> 00:02:55,330
que viene con 30 viene sin decimales y la que viene con 0,03 viene con todos

37
00:02:55,330 --> 00:02:59,650
los decimales así que es bien fácil de identificar. Esos valores hay que

38
00:02:59,650 --> 00:03:02,770
sabérselos de memoria así que aprendérselos bien.

39
00:03:02,770 --> 00:03:06,450
En el caso de la establecida se diagnostica con el clírens de

40
00:03:06,450 --> 00:03:09,210
creatinina y obviamente desde el momento en que el clírens ya empieza a

41
00:03:09,210 --> 00:03:13,210
caer de que la falla renal empieza a avanzar en sus etapas cierto uno ya

42
00:03:13,210 --> 00:03:18,130
habla de una nefropatía diabética establecida con falla renal. Ahora

43
00:03:18,130 --> 00:03:22,450
¿cuál es el tratamiento de la nefropatía diabética? Todas las cosas

44
00:03:22,450 --> 00:03:25,490
generales, digase el manejo de la diabetes y con el contra

45
00:03:25,490 --> 00:03:28,770
metabólico obviamente el manejo de la hipertensión arterial que en este

46
00:03:28,770 --> 00:03:33,730
caso es muy importante de hecho importa más que mantenga presiones

47
00:03:33,730 --> 00:03:38,690
arteriales dentro del rango menor a 130-80 que el manejo del control

48
00:03:38,690 --> 00:03:42,250
metabólico para evitar la progresión sabiendo que ambas cosas sirven, el

49
00:03:42,250 --> 00:03:45,530
manejo general de la insuficiencia renal crónica con todo lo que se va

50
00:03:45,530 --> 00:03:50,010
a ver de manera específico en nefrología más el tratamiento de la

51
00:03:50,010 --> 00:03:53,610
proteínuria en el sentido en que la microalbuminuria y luego la

52
00:03:53,610 --> 00:03:58,090
albuminuria es un predictor de que va a evolucionar a falla renal pero

53
00:03:58,090 --> 00:04:01,050
además se relaciona con la progresión de la falla renal y al

54
00:04:01,050 --> 00:04:07,210
disminuir esta eliminación o pérdidas de las proteínas en orina se

55
00:04:07,210 --> 00:04:10,450
consigue justamente evitar que esto siga avanzando y esto se hace con los

56
00:04:10,450 --> 00:04:15,650
YECA que son el tratamiento de elección o bien con los ARA-2 y como

57
00:04:15,650 --> 00:04:19,690
algo que me pueda ayudar cuando ya estoy en dosis máxima y quiero

58
00:04:19,690 --> 00:04:23,010
agregar alguna cosa adicional puedo agregar los bloqueadores de calcio no

59
00:04:23,010 --> 00:04:27,050
dihidro pyridínicos como el Diltia C. Así que en la práctica queda

60
00:04:27,050 --> 00:04:32,210
con enalapril y luego de eso puede quedar con enalapril más Diltia C o

61
00:04:32,210 --> 00:04:37,810
bien los ARA-2 puede quedar con el Losartan. Ahora qué pasa si yo tengo

62
00:04:37,810 --> 00:04:43,010
alguien diabético pero viene no con una microalbuminuria o una

63
00:04:43,010 --> 00:04:46,290
macroalbuminuria sino que viene con una proteínuria en rango nefrótico

64
00:04:46,290 --> 00:04:50,210
arriba de 3 gramos al día ejemplo viene con 6 gramos al día en ese caso

65
00:04:50,210 --> 00:04:54,690
yo voy a sospechar otra cosa voy a sospechar un síndrome nefrótico

66
00:04:54,730 --> 00:04:58,650
primario en específico la glomerulopatía membranosa que se asocia

67
00:04:58,650 --> 00:05:03,210
mucho a la diabetes justamente y lo que hay que hacer obviamente es el

68
00:05:03,210 --> 00:05:09,410
solicitar una biopsia renal como para poder objetivar y diagnosticar y

69
00:05:09,410 --> 00:05:14,970
confirmar que hay una glomerulopatía membranosa o nefropatía

70
00:05:14,970 --> 00:05:18,810
membranosa o nefropatía extramembranosa todos son sinónimos

71
00:05:18,810 --> 00:05:23,010
nefropatía o glomerulopatía membranosa o extramembranosa se asocia

72
00:05:23,050 --> 00:05:26,090
la diabetes y si bien alguien puede decirme eso también es un tipo de

73
00:05:26,090 --> 00:05:30,810
nefropatía diabética en general se le llama de manera diferente y la

74
00:05:30,810 --> 00:05:34,370
nefropatía diabética en la microalbuminuria que era la inicial o

75
00:05:34,370 --> 00:05:39,330
incipiente cierto y la falla renal no en con una proteína en rango

76
00:05:39,330 --> 00:05:42,810
nefrótico quedó claro es importante no confundir la

77
00:05:42,810 --> 00:05:47,690
glomerulopatía membranosa con la nefropatía diabética al menos como

78
00:05:47,690 --> 00:05:52,130
concepto general dado que ambas se asocian a diabetes y finalmente qué

79
00:05:52,130 --> 00:05:55,170
pasa si viene con un síndrome nefrítico o bien sin un síndrome

80
00:05:55,170 --> 00:06:01,250
nefrítico pero con una glomerulone fritis en el examen de orina en el

81
00:06:01,250 --> 00:06:05,370
sentido en que viene con una hematuria dismórfica pues lo que hay que

82
00:06:05,370 --> 00:06:08,090
hacer es el estudio general de la glomerulone fritis o del síndrome

83
00:06:08,090 --> 00:06:11,930
nefrítico que es ir a buscar la causa con los anticuerpos con los

84
00:06:11,930 --> 00:06:15,570
distintos anticuerpos con el complemento los hana los hanka los

85
00:06:15,570 --> 00:06:20,610
anti membrana basal los anti streptolicina o etcétera más la

86
00:06:20,650 --> 00:06:24,090
biopsia ronal como para ver exactamente que glomerulone fritis es la que hay

87
00:06:24,090 --> 00:06:28,650
ya pero como cosa importante los diabéticos tienen derecho a tener

88
00:06:28,650 --> 00:06:31,810
síndrome nefrítico y a tener síndrome nefrótico y ahí lo importante es

89
00:06:31,810 --> 00:06:34,570
estudiar el síndrome nefrítico y estudiar el síndrome nefrótico con

90
00:06:34,570 --> 00:06:38,570
su respectiva biopsia que esté muy bien',
    'En esta cápsula nos centraremos en la nefropatía diabética, una de las complicaciones crónicas más importantes de la diabetes mellitus y una causa frecuente de enfermedad renal crónica en nuestra población.

Comencemos con la definición precisa. Hablamos de nefropatía diabética cuando un paciente con diabetes presenta, además, signos de compromiso renal. Ese compromiso puede manifestarse de dos formas: como albuminuria o como insuficiencia renal crónica con caída del clearance de creatinina. La nefropatía diabética inicial, también llamada incipiente, se caracteriza únicamente por la presencia de microalbuminuria, que puede evolucionar a macroalbuminuria. La nefropatía diabética establecida, en cambio, ya implica una caída real del filtrado glomerular, es decir, falla renal propiamente tal.

En cuanto al diagnóstico, debemos medir la albuminuria y la función renal. La albuminuria se clasifica en microalbuminuria cuando la pérdida de albúmina por orina oscila entre 30 y 300 miligramos al día. Por encima de 300 miligramos diarios estamos ante una macroalbuminuria. Y cuando la proteinuria total supera los 3 gramos al día, hablamos de proteinuria en rango nefrótico, lo cual implica una situación diferente que abordaremos en un momento.',
    '["Microalbuminuria: pérdida de 30-300 mg de albúmina/día. RAC mayor a 30 mg/g (o mayor a 0,03 mg/mg) confirma el diagnóstico.","Nefropatía incipiente = solo microalbuminuria. Nefropatía establecida = caída del clearance de creatinina.","El control de la presión arterial (meta 130/80) importa más que el control glucémico para frenar la progresión.","IECA (o ARA-2) son el tratamiento de elección para reducir la proteinuria; el Diltiazem puede agregarse como complemento.","Proteinuria mayor a 3 g/día en diabético obliga a sospechar glomerulopatía membranosa y solicitar biopsia renal."]'::jsonb,
    '[{"para":"\"30-300 es MICRO, más de 300 es MACRO, más de 3.000 es NEFRÓTICO\"","nemotecnia":"\"30-300 es MICRO, más de 300 es MACRO, más de 3.000 es NEFRÓTICO\"","explicacion":"Tres cortes clave de la proteinuria diabética. Menor a 30 es normal, entre 30 y 300 microalbuminuria, sobre 300 macroalbuminuria, sobre 3 g/día sospecha nefrótico.\nTres cortes clave de la proteinuria diabética. Menor a 30 es normal, entre 30 y 300 microalbuminuria, sobre 300 macroalbuminuria, sobre 3 g/día sospecha nefrótico."},{"para":"\"RAC = 30 = MICRO\"","nemotecnia":"\"RAC = 30 = MICRO\"","explicacion":"RAC mayor a 30 mg/g de creatinina diagnostica microalbuminuria. El RAC es el examen de elección actual por ser práctico y reproducible.RAC mayor a 30 mg/g de creatinina diagnostica microalbuminuria. El RAC es el examen de elección actual por ser práctico y reproducible."},{"para":"\"IECA al RIÑÓN, Diltiazem al APOYO\"","nemotecnia":"\"IECA al RIÑÓN, Diltiazem al APOYO\"","explicacion":"IECA (o ARA-2) son primera línea para reducir la albuminuria. Diltiazem actúa como complemento cuando la proteinuria persiste con dosis máximas de IECA.IECA (o ARA-2) son primera línea para reducir la albuminuria. Diltiazem actúa como complemento cuando la proteinuria persiste con dosis máximas de IECA."}]'::jsonb,
    '["Microalbuminuria: pérdida de 30-300 mg de albúmina/día. RAC mayor a 30 mg/g (o mayor a 0,03 mg/mg) confirma el diagnóstico.","Nefropatía incipiente = solo microalbuminuria. Nefropatía establecida = caída del clearance de creatinina.","El control de la presión arterial (meta 130/80) importa más que el control glucémico para frenar la progresión."]'::jsonb,
    '[]'::jsonb,
    '[{"pregunta":"¿Cuál de las siguientes afirmaciones es correcta sobre el diagnóstico de nefropatía diabética?","respuesta":"Respuesta correcta: C — El RAC en muestra aislada mayor a 30 mg/g (o mayor a 0,03 mg/mg) diagnostica microalbuminuria y es el método actualmente recomendado por su practicidad. Una proteinuria mayor a 3 g/día obliga a sospechar glomerulopatía membranosa, no nefropatía diabética típica."}]'::jsonb,
    NOW(),
    TRUE,
    FALSE  -- first 3 free preview
  ) ON CONFLICT (specialty_id, order_index)
  DO UPDATE SET
    title            = EXCLUDED.title,
    duration_seconds = EXCLUDED.duration_seconds,
    txt_content      = EXCLUDED.txt_content,
    srt_content      = EXCLUDED.srt_content,
    ai_summary       = EXCLUDED.ai_summary,
    ai_key_concepts  = EXCLUDED.ai_key_concepts,
    ai_mnemonics     = EXCLUDED.ai_mnemonics,
    ai_high_yield    = EXCLUDED.ai_high_yield,
    ai_review_qs     = EXCLUDED.ai_review_qs,
    ai_processed_at  = NOW(),
    is_available     = TRUE;

  -- Cápsula 15: Retinopatía Diabética — Clasificación, Clínica y Manejo
  INSERT INTO lessons (
    specialty_id, title, order_index, duration_seconds,
    txt_content, srt_content,
    ai_summary, ai_key_concepts, ai_mnemonics,
    ai_high_yield, ai_algorithms, ai_review_qs,
    ai_processed_at, is_available, is_free_preview
  ) VALUES (
    v_specialty_id,
    'Retinopatía Diabética — Clasificación, Clínica y Manejo',
    15,
    527,
    'Hola, hola. Vamos a hablar de la retinopatía diabética, recordando que no solo que es una

complicación crónica de la diabetes, sino que además es una de las causas más frecuentes de

ceguera en los adultos después de las cataratas que son reversible y después de

glaucoma crónico también. De hecho, en algunas partes sale que es o la primera o

segunda causa de ceguera irreversible en muchos casos. Así que empecemos con el

screening. Todo paciente diabético tiene que hacerse un fondo de ojo por lo menos una

vez al año. En el caso de que esté todo bien, eventualmente se puede espaciar a

cada dos años. Y en el caso de que está alterado, con algún grado de retinopatía,

se va a hacer cada vez más corto, cada tres a seis meses, dependiendo de la severidad de

la retinopatía que se encuentre. Ahora, no solamente me hace el screening, sino que

además es diagnóstico. El fondo de ojo me objetiva y me confirma el diagnóstico de la

retinopatía. Y no solamente eso, sino que me dice qué tan severa es, qué grado de

complicación tiene, en qué lugar está el daño, etcétera. Pero que quede claro,

no es cualquier fondo de ojo, no es el fondo de ojo con el oftalmoscopio, sino que es un

fondo de ojo especial, con dilatación pupilar y con una cámara que finalmente

saca una foto que permite ver la retina completa. Su clasificación es en dos grandes

grupos. Por un lado, la retinopatía diabética no proliferativa. La otra, en cambio,

es la retinopatía diabética proliferativa. La no proliferativa empieza con la muerte de los

pericitos, que ahí va con el número cero, en el sentido en que no se ve en el fondo de

ojo. Eso, con suerte, se puede ver en un estudio histológico o en una autopsia, por ejemplo,

pero sepan que empieza con la muerte de estas células que son las que recubren al endotelio

de los capilares. Lo siguiente que ocurre acá es que empieza a exudar, a salir el contenido

desde el plasma sanguíneo hacia la retina y se ven como unos puntitos amarillos que se

llaman exudados serios. Luego de eso, algunos de los vasos sanguíneos se forman unas pequeñas

aneurismas que se llaman microaneurismas, que se ve como un puntito rojo. Luego de eso,

estos microaneurismas se pueden romper y se genera una microhemorragia, o bien se pueden

trombosar y se genera un microinfarto que también se llama como exudado algodonoso.

Así que los exudados serios son exudados reales, en cambio, los exudados algodonosos

no es un exudado real, sino que es un área de la retina que se infartó y que se pone

blanco. Luego de eso está la retinopatía diabética proliferativa, que es aquella en la

cual además se generan neovasos o vasos de neoformación o un crecimiento normal de los

vasos sanguíneos de la retina. Como quieran escucharlo, es la definición de la retinopatía

de tipo proliferativa. Ahora, dos conceptos importantes. Por regla general, nada de lo

que se ve ahí genera ningún síntoma, pero los exudados serios eventualmente cuando invaden

la mácula pueden generar un edema macular, que es una causa de ceguera por si acaso y que

se puede ver desde la retinopatía no proliferativa. Acuérdense que todo lo de la

no proliferativa se puede ver también en la proliferativa y de hecho el edema macular es

más frecuente en la proliferativa que en la no proliferativa, pero que quede claro se puede

ver desde el principio, desde que haya exudado serio y en el caso de los neovasos esos son

los que se rompen y que generan la famosa hemorragia vitria, que es el momento en

que subitamente se queda ciego un paciente diabético por culpa de la retinopatía diabética.

Vamos a ver los paros clínicos con algún detalle en un rato más. Ahora, de la retinopatía

diabética no proliferativa sepan que no tiene ningún síntoma, por regla general no hay ningún

síntoma hasta que haya un edema macular y su manejo es el tratamiento de la diabetes,

dígase el control metabólico que evita que vaya avanzando. En cambio, en el caso de la

proliferativa, cuando ya tengo los neovasos el riesgo de que esto avance, de que esto eventualmente

se rompa y se genere una hemorragia vitria es muy alto y si bien todavía no tengo ningún

síntoma eventualmente sí se puede romper y si voy a tener un síntoma, pero el síntoma es

que me quedo ciego así que no es algo que valga la pena esperar y su manejo por la

general es por un lado con fármacos, que los fármacos que se usan son los

antiangiogénicos por vía intravitria o los inhibidores de la angiogénesis por vía

intravitria, que el clásico es el ranivizumab, que son medicamentos bastante modernos,

pero que sirven más la fotocoagulación láser que lo que busca es identificar los vasos de

neofarmación y quemarlos antes de que se rompan y sangren y que si bien se mata

una zona de la retina y se puede perder un poco la visión en esa zona, la verdad es que

se evita que es sangre y que se pierda la visión en general. La fotocoagulación da miedo cuando

es cerca de la mácula en el sentido en que ahí puede quedar más ciego y eso lo menciono

porque el edema macular que si se acuerdan era una de las causas de ceguera, es una

disminución de la agudeza visual que no es de instalación tan súbita sino que aparece en

algunos días incluso puede ser en algunas semanas a medida que se van acumulando los

exudados serios en la mácula, se diagnostica justamente con el fondo de ojo que ve estos

exudados serios en la mácula, el manejo suele ser también los antiangiogénicos más la

fotocoagulación, pero advirtiéndole que vamos a fotocoagular cerca de la mácula y que si

bien esperamos que vea mejor, existe el riesgo de que eventualmente no recupere tanto la

visión si es que se fotocoagula la mácula. Aparte de eso está la hemorragia vitria que ya

es la última parte, su clínica hay que saberla, por el general es amaurosis súbita,

o sea que pierde la visión de un ojo o de una parte importante del campo visual de un

ojo de manera súbita y lo más característico es que se pierde el rojo pupilar, en el sentido

en que el rojo pupilar es el reflejo de la retina que al iluminarlo con el oftalmoscópio

o con alguna otra cosa refleja la luz y en este caso hay sangre entre medio así que se

pierde este rojo pupilar. El tratamiento de la hemorragia vitria por regla general es

simplemente observar a que se reabsorba pero en el caso de que sea muy grande o que no ande

bien eventualmente si se hace una cirugía que es la vitrectomía en que se saca el

humor vitrio y se reemplaza por alguna otra cosa y habitualmente la pregunta que uno se

hace es justamente hago una vitrectomía o no y eso va a depender si es que solamente

tiene un ojo o ambos ojos de el tamaño de la hemorragia vitria etcétera en el sentido

en que si es que pierde la visión de ambos ojos hay un incentivo a manejarlo más agresivamente.

Igualmente los antiangiogénicos y la fotocoagulación suele usarse en todo salvo en la retinopatía

diabética no proliferativa cuando no es severa, cuando ya está muy severa lleno de

micro hemorragia y de exudados y todas esas cosas eventualmente se usan igual pero en la

proliferativa es obligatorio en cambio usarlos igual que en el edema macular. Vamos aquí

con algunas fotos aquí se ve exudados serios son esos puntitos amarillos y en este caso

fíjense está justo arriba de la mácula así que está con un edema macular y si bien se

ve bastante sanita el resto de la retina la verdad es que el paciente seguramente está

viendo muy mal por el edema macular así que se va a ir de antiangiogénicos más fotocoagulación.

En este otro caso se ven varias cosas ahí hay unos poquitos exudados serios también como

para que los identifiquen puntitos amarillos aparte de eso se ven acá los microaneurismas

que hay múltiples son como puntitos rojos muy muy chiquititos aparte de esto de acá

se ven estas manchas rojas un poquito más grandes que ya son las micro hemorragias y

finalmente tengo esto que está acá que son los exudados algodonosos o micro infartos que ya

se ven como una mancha blanca un poquito más grande y fíjense todo esto si bien está lleno

de alteraciones no hay neobasos así que el diagnóstico sigue siendo una retinopatía

diabética no proliferativa porque aún no hay neobasos pero en este caso es severa.

En este otro caso de acá nuevamente tengo exudados serios en esa zona aparte de eso

tengo exudados algodonosos en esta otra zona de acá se ven algunas micro hemorragias repartidas

por todas partes se ven algunos micro aneurismas también pero no se alcanzan a ver bien en esta

imagen y finalmente en esa zona tengo los neobasos si se fijan se ve como un ovillo de

vasos sanguíneos en esa zona que es lo característico de los vasos de neofarmación

y es lo que define a la retinopatía diabética proliferativa así que en este

caso sí o sí se va a los antiangiogénicos seguramente más la fotocobulación y bueno

esa fue esta clase algo complicado pero no tanto así que esperamos que haya quedado clara que estén bien',
    '1
00:00:03,150 --> 00:00:07,870
Hola, hola. Vamos a hablar de la retinopatía diabética, recordando que no solo que es una

2
00:00:07,870 --> 00:00:11,630
complicación crónica de la diabetes, sino que además es una de las causas más frecuentes de

3
00:00:11,630 --> 00:00:15,830
ceguera en los adultos después de las cataratas que son reversible y después de

4
00:00:15,830 --> 00:00:20,150
glaucoma crónico también. De hecho, en algunas partes sale que es o la primera o

5
00:00:20,150 --> 00:00:25,710
segunda causa de ceguera irreversible en muchos casos. Así que empecemos con el

6
00:00:25,710 --> 00:00:29,950
screening. Todo paciente diabético tiene que hacerse un fondo de ojo por lo menos una

7
00:00:29,950 --> 00:00:34,870
vez al año. En el caso de que esté todo bien, eventualmente se puede espaciar a

8
00:00:34,870 --> 00:00:38,710
cada dos años. Y en el caso de que está alterado, con algún grado de retinopatía,

9
00:00:38,710 --> 00:00:44,390
se va a hacer cada vez más corto, cada tres a seis meses, dependiendo de la severidad de

10
00:00:44,390 --> 00:00:50,590
la retinopatía que se encuentre. Ahora, no solamente me hace el screening, sino que

11
00:00:50,590 --> 00:00:56,110
además es diagnóstico. El fondo de ojo me objetiva y me confirma el diagnóstico de la

12
00:00:56,110 --> 00:01:01,590
retinopatía. Y no solamente eso, sino que me dice qué tan severa es, qué grado de

13
00:01:01,590 --> 00:01:05,710
complicación tiene, en qué lugar está el daño, etcétera. Pero que quede claro,

14
00:01:05,710 --> 00:01:10,470
no es cualquier fondo de ojo, no es el fondo de ojo con el oftalmoscopio, sino que es un

15
00:01:10,470 --> 00:01:14,470
fondo de ojo especial, con dilatación pupilar y con una cámara que finalmente

16
00:01:14,470 --> 00:01:20,590
saca una foto que permite ver la retina completa. Su clasificación es en dos grandes

17
00:01:20,590 --> 00:01:24,750
grupos. Por un lado, la retinopatía diabética no proliferativa. La otra, en cambio,

18
00:01:24,750 --> 00:01:30,470
es la retinopatía diabética proliferativa. La no proliferativa empieza con la muerte de los

19
00:01:30,470 --> 00:01:34,990
pericitos, que ahí va con el número cero, en el sentido en que no se ve en el fondo de

20
00:01:34,990 --> 00:01:40,390
ojo. Eso, con suerte, se puede ver en un estudio histológico o en una autopsia, por ejemplo,

21
00:01:40,390 --> 00:01:45,710
pero sepan que empieza con la muerte de estas células que son las que recubren al endotelio

22
00:01:45,710 --> 00:01:55,470
de los capilares. Lo siguiente que ocurre acá es que empieza a exudar, a salir el contenido

23
00:01:55,470 --> 00:02:00,510
desde el plasma sanguíneo hacia la retina y se ven como unos puntitos amarillos que se

24
00:02:00,510 --> 00:02:07,390
llaman exudados serios. Luego de eso, algunos de los vasos sanguíneos se forman unas pequeñas

25
00:02:07,390 --> 00:02:12,030
aneurismas que se llaman microaneurismas, que se ve como un puntito rojo. Luego de eso,

26
00:02:12,270 --> 00:02:17,670
estos microaneurismas se pueden romper y se genera una microhemorragia, o bien se pueden

27
00:02:17,670 --> 00:02:23,230
trombosar y se genera un microinfarto que también se llama como exudado algodonoso.

28
00:02:23,230 --> 00:02:28,750
Así que los exudados serios son exudados reales, en cambio, los exudados algodonosos

29
00:02:28,750 --> 00:02:33,350
no es un exudado real, sino que es un área de la retina que se infartó y que se pone

30
00:02:33,350 --> 00:02:39,150
blanco. Luego de eso está la retinopatía diabética proliferativa, que es aquella en la

31
00:02:39,150 --> 00:02:45,510
cual además se generan neovasos o vasos de neoformación o un crecimiento normal de los

32
00:02:45,510 --> 00:02:50,310
vasos sanguíneos de la retina. Como quieran escucharlo, es la definición de la retinopatía

33
00:02:50,310 --> 00:02:55,110
de tipo proliferativa. Ahora, dos conceptos importantes. Por regla general, nada de lo

34
00:02:55,110 --> 00:03:00,910
que se ve ahí genera ningún síntoma, pero los exudados serios eventualmente cuando invaden

35
00:03:00,910 --> 00:03:06,510
la mácula pueden generar un edema macular, que es una causa de ceguera por si acaso y que

36
00:03:06,510 --> 00:03:11,190
se puede ver desde la retinopatía no proliferativa. Acuérdense que todo lo de la

37
00:03:11,190 --> 00:03:16,270
no proliferativa se puede ver también en la proliferativa y de hecho el edema macular es

38
00:03:16,270 --> 00:03:20,190
más frecuente en la proliferativa que en la no proliferativa, pero que quede claro se puede

39
00:03:20,190 --> 00:03:26,550
ver desde el principio, desde que haya exudado serio y en el caso de los neovasos esos son

40
00:03:26,550 --> 00:03:31,790
los que se rompen y que generan la famosa hemorragia vitria, que es el momento en

41
00:03:31,790 --> 00:03:37,670
que subitamente se queda ciego un paciente diabético por culpa de la retinopatía diabética.

42
00:03:37,670 --> 00:03:42,310
Vamos a ver los paros clínicos con algún detalle en un rato más. Ahora, de la retinopatía

43
00:03:42,310 --> 00:03:47,230
diabética no proliferativa sepan que no tiene ningún síntoma, por regla general no hay ningún

44
00:03:47,230 --> 00:03:52,630
síntoma hasta que haya un edema macular y su manejo es el tratamiento de la diabetes,

45
00:03:52,630 --> 00:03:57,670
dígase el control metabólico que evita que vaya avanzando. En cambio, en el caso de la

46
00:03:57,670 --> 00:04:02,310
proliferativa, cuando ya tengo los neovasos el riesgo de que esto avance, de que esto eventualmente

47
00:04:02,310 --> 00:04:07,470
se rompa y se genere una hemorragia vitria es muy alto y si bien todavía no tengo ningún

48
00:04:07,470 --> 00:04:13,190
síntoma eventualmente sí se puede romper y si voy a tener un síntoma, pero el síntoma es

49
00:04:13,190 --> 00:04:18,110
que me quedo ciego así que no es algo que valga la pena esperar y su manejo por la

50
00:04:18,110 --> 00:04:22,630
general es por un lado con fármacos, que los fármacos que se usan son los

51
00:04:22,630 --> 00:04:28,310
antiangiogénicos por vía intravitria o los inhibidores de la angiogénesis por vía

52
00:04:28,310 --> 00:04:34,270
intravitria, que el clásico es el ranivizumab, que son medicamentos bastante modernos,

53
00:04:34,270 --> 00:04:40,310
pero que sirven más la fotocoagulación láser que lo que busca es identificar los vasos de

54
00:04:40,310 --> 00:04:45,070
neofarmación y quemarlos antes de que se rompan y sangren y que si bien se mata

55
00:04:45,070 --> 00:04:49,510
una zona de la retina y se puede perder un poco la visión en esa zona, la verdad es que

56
00:04:49,510 --> 00:04:55,150
se evita que es sangre y que se pierda la visión en general. La fotocoagulación da miedo cuando

57
00:04:55,150 --> 00:04:59,710
es cerca de la mácula en el sentido en que ahí puede quedar más ciego y eso lo menciono

58
00:04:59,710 --> 00:05:06,190
porque el edema macular que si se acuerdan era una de las causas de ceguera, es una

59
00:05:06,190 --> 00:05:10,910
disminución de la agudeza visual que no es de instalación tan súbita sino que aparece en

60
00:05:10,910 --> 00:05:14,870
algunos días incluso puede ser en algunas semanas a medida que se van acumulando los

61
00:05:14,870 --> 00:05:20,670
exudados serios en la mácula, se diagnostica justamente con el fondo de ojo que ve estos

62
00:05:20,670 --> 00:05:26,310
exudados serios en la mácula, el manejo suele ser también los antiangiogénicos más la

63
00:05:26,310 --> 00:05:31,310
fotocoagulación, pero advirtiéndole que vamos a fotocoagular cerca de la mácula y que si

64
00:05:31,310 --> 00:05:36,830
bien esperamos que vea mejor, existe el riesgo de que eventualmente no recupere tanto la

65
00:05:36,830 --> 00:05:41,110
visión si es que se fotocoagula la mácula. Aparte de eso está la hemorragia vitria que ya

66
00:05:41,110 --> 00:05:46,710
es la última parte, su clínica hay que saberla, por el general es amaurosis súbita,

67
00:05:46,710 --> 00:05:52,470
o sea que pierde la visión de un ojo o de una parte importante del campo visual de un

68
00:05:52,470 --> 00:05:57,390
ojo de manera súbita y lo más característico es que se pierde el rojo pupilar, en el sentido

69
00:05:57,390 --> 00:06:02,510
en que el rojo pupilar es el reflejo de la retina que al iluminarlo con el oftalmoscópio

70
00:06:02,510 --> 00:06:06,950
o con alguna otra cosa refleja la luz y en este caso hay sangre entre medio así que se

71
00:06:06,950 --> 00:06:11,590
pierde este rojo pupilar. El tratamiento de la hemorragia vitria por regla general es

72
00:06:11,590 --> 00:06:17,430
simplemente observar a que se reabsorba pero en el caso de que sea muy grande o que no ande

73
00:06:17,430 --> 00:06:21,910
bien eventualmente si se hace una cirugía que es la vitrectomía en que se saca el

74
00:06:21,910 --> 00:06:26,550
humor vitrio y se reemplaza por alguna otra cosa y habitualmente la pregunta que uno se

75
00:06:26,550 --> 00:06:32,350
hace es justamente hago una vitrectomía o no y eso va a depender si es que solamente

76
00:06:32,350 --> 00:06:38,670
tiene un ojo o ambos ojos de el tamaño de la hemorragia vitria etcétera en el sentido

77
00:06:38,670 --> 00:06:44,270
en que si es que pierde la visión de ambos ojos hay un incentivo a manejarlo más agresivamente.

78
00:06:44,270 --> 00:06:51,670
Igualmente los antiangiogénicos y la fotocoagulación suele usarse en todo salvo en la retinopatía

79
00:06:51,670 --> 00:06:55,950
diabética no proliferativa cuando no es severa, cuando ya está muy severa lleno de

80
00:06:56,950 --> 00:07:03,550
micro hemorragia y de exudados y todas esas cosas eventualmente se usan igual pero en la

81
00:07:03,550 --> 00:07:08,590
proliferativa es obligatorio en cambio usarlos igual que en el edema macular. Vamos aquí

82
00:07:08,590 --> 00:07:13,230
con algunas fotos aquí se ve exudados serios son esos puntitos amarillos y en este caso

83
00:07:13,230 --> 00:07:17,790
fíjense está justo arriba de la mácula así que está con un edema macular y si bien se

84
00:07:17,790 --> 00:07:23,290
ve bastante sanita el resto de la retina la verdad es que el paciente seguramente está

85
00:07:23,290 --> 00:07:28,450
viendo muy mal por el edema macular así que se va a ir de antiangiogénicos más fotocoagulación.

86
00:07:28,450 --> 00:07:34,410
En este otro caso se ven varias cosas ahí hay unos poquitos exudados serios también como

87
00:07:34,410 --> 00:07:39,730
para que los identifiquen puntitos amarillos aparte de eso se ven acá los microaneurismas

88
00:07:39,730 --> 00:07:45,410
que hay múltiples son como puntitos rojos muy muy chiquititos aparte de esto de acá

89
00:07:45,410 --> 00:07:49,570
se ven estas manchas rojas un poquito más grandes que ya son las micro hemorragias y

90
00:07:49,610 --> 00:07:55,330
finalmente tengo esto que está acá que son los exudados algodonosos o micro infartos que ya

91
00:07:55,330 --> 00:07:59,530
se ven como una mancha blanca un poquito más grande y fíjense todo esto si bien está lleno

92
00:07:59,530 --> 00:08:03,850
de alteraciones no hay neobasos así que el diagnóstico sigue siendo una retinopatía

93
00:08:03,850 --> 00:08:08,690
diabética no proliferativa porque aún no hay neobasos pero en este caso es severa.

94
00:08:08,690 --> 00:08:15,050
En este otro caso de acá nuevamente tengo exudados serios en esa zona aparte de eso

95
00:08:15,050 --> 00:08:21,570
tengo exudados algodonosos en esta otra zona de acá se ven algunas micro hemorragias repartidas

96
00:08:21,570 --> 00:08:26,490
por todas partes se ven algunos micro aneurismas también pero no se alcanzan a ver bien en esta

97
00:08:26,490 --> 00:08:32,010
imagen y finalmente en esa zona tengo los neobasos si se fijan se ve como un ovillo de

98
00:08:32,010 --> 00:08:36,650
vasos sanguíneos en esa zona que es lo característico de los vasos de neofarmación

99
00:08:36,650 --> 00:08:41,930
y es lo que define a la retinopatía diabética proliferativa así que en este

100
00:08:41,970 --> 00:08:47,330
caso sí o sí se va a los antiangiogénicos seguramente más la fotocobulación y bueno

101
00:08:47,330 --> 00:08:52,610
esa fue esta clase algo complicado pero no tanto así que esperamos que haya quedado clara que estén bien',
    'En esta cápsula abordaremos la retinopatía diabética, una de las complicaciones crónicas más temidas de la diabetes mellitus. Deben saber que es una de las causas más frecuentes de ceguera en adultos, situándose entre la primera y segunda causa de ceguera irreversible en muchos contextos, solo por detrás de las cataratas, que son reversibles, y del glaucoma crónico.

Empecemos por el tamizaje. Todo paciente diabético debe realizarse un fondo de ojo al menos una vez al año. Si el resultado es completamente normal, el control puede espaciarse a cada dos años. Pero si ya existe algún grado de retinopatía, la periodicidad se acorta progresivamente: cada tres a seis meses, dependiendo de la severidad del hallazgo. Y ojo con esto: no hablamos de cualquier fondo de ojo. No es el examen con el oftalmoscopio de mano que hacemos a la cabecera del paciente. Es un examen especializado, con dilatación pupilar, realizado por un oftalmólogo que usa una cámara fotográfica que captura la retina completa. Este examen no solo hace el tamizaje, sino que también confirma el diagnóstico, estadifica la severidad y localiza el daño con precisión.

La clasificación de la retinopatía diabética se divide en dos grandes grupos: la retinopatía no proliferativa y la retinopatía proliferativa.',
    '["Fondo de ojo anual para todo diabético; con retinopatía presente, control cada 3-6 meses. El examen requiere dilatación pupilar y cámara fotográfica especializada.","Retinopatía no proliferativa: exudados serosos (amarillos) → microaneurismas (puntos rojos) → microhemorragias y exudados algodonosos (blancos, microinfartos).","Retinopatía proliferativa: presencia de neovasos. Riesgo de hemorragia vítrea con pérdida súbita de visión y ausencia del reflejo rojo pupilar.","Edema macular: exudados serosos en la mácula; pérdida gradual de visión central. Puede verse desde la etapa no proliferativa.","Tratamiento proliferativa y edema macular: antiangiogénicos intravítreos (ranibizumab) + fotocoagulación láser. Hemorragia vítrea: observación o vitrectomía."]'::jsonb,
    '[{"para":"\"PARES de la No Proliferativa: Seroso Amarillo → Aneurisma Rojo → Algodonoso Blanco\"","nemotecnia":"\"PARES de la No Proliferativa: Seroso Amarillo → Aneurisma Rojo → Algodonoso Blanco\"","explicacion":"Secuencia de lesiones en fondo de ojo: primero los exudados amarillos (plasma), luego los microaneurismas rojos, luego los infartos blancos (exudados algodonosos).\nSecuencia de lesiones en fondo de ojo: primero los exudados amarillos (plasma), luego los microaneurismas rojos, luego los infartos blancos (exudados algodonosos)."},{"para":"\"NEOVASOS = PROLIFERATIVA = PELIGRO de hemorragia SÚBITA\"","nemotecnia":"\"NEOVASOS = PROLIFERATIVA = PELIGRO de hemorragia SÚBITA\"","explicacion":"La presencia de neovasos define la retinopatía proliferativa. El riesgo es hemorragia vítrea → amaurosis súbita + pérdida del rojo pupilar.La presencia de neovasos define la retinopatía proliferativa. El riesgo es hemorragia vítrea → amaurosis súbita + pérdida del rojo pupilar."},{"para":"\"LÁSER quema neovasos, ANTI-VEGF los frena\"","nemotecnia":"\"LÁSER quema neovasos, ANTI-VEGF los frena\"","explicacion":"Fotocoagulación láser destruye los vasos anómalos. Ranibizumab (antiangiogénico) inhibe la formación de nuevos vasos. Ambos se usan en proliferativa y edema macular.Fotocoagulación láser destruye los vasos anómalos. Ranibizumab (antiangiogénico) inhibe la formación de nuevos vasos. Ambos se usan en proliferativa y edema macular."}]'::jsonb,
    '["Fondo de ojo anual para todo diabético; con retinopatía presente, control cada 3-6 meses. El examen requiere dilatación pupilar y cámara fotográfica especializada.","Retinopatía no proliferativa: exudados serosos (amarillos) → microaneurismas (puntos rojos) → microhemorragias y exudados algodonosos (blancos, microinfartos).","Retinopatía proliferativa: presencia de neovasos. Riesgo de hemorragia vítrea con pérdida súbita de visión y ausencia del reflejo rojo pupilar."]'::jsonb,
    '[]'::jsonb,
    '[{"pregunta":"¿Cuál de las siguientes afirmaciones sobre la retinopatía diabética es correcta?","respuesta":"Respuesta correcta: C — La hemorragia vítrea es la complicación más grave de la retinopatía proliferativa. Ocurre cuando un neovaso frágil se rompe y sangra hacia el vítreo, produciendo amaurosis súbita y pérdida del reflejo rojo pupilar. El edema macular puede ocurrir desde la etapa no proliferativa; los exudados algodonosos son microinfartos (blancos, no amarillos); el tamizaje requiere dilatación pupilar y equipo especializado."}]'::jsonb,
    NOW(),
    TRUE,
    FALSE  -- first 3 free preview
  ) ON CONFLICT (specialty_id, order_index)
  DO UPDATE SET
    title            = EXCLUDED.title,
    duration_seconds = EXCLUDED.duration_seconds,
    txt_content      = EXCLUDED.txt_content,
    srt_content      = EXCLUDED.srt_content,
    ai_summary       = EXCLUDED.ai_summary,
    ai_key_concepts  = EXCLUDED.ai_key_concepts,
    ai_mnemonics     = EXCLUDED.ai_mnemonics,
    ai_high_yield    = EXCLUDED.ai_high_yield,
    ai_review_qs     = EXCLUDED.ai_review_qs,
    ai_processed_at  = NOW(),
    is_available     = TRUE;

  -- Cápsula 16: Pie Diabético — Prevención, Clasificación y Manejo
  INSERT INTO lessons (
    specialty_id, title, order_index, duration_seconds,
    txt_content, srt_content,
    ai_summary, ai_key_concepts, ai_mnemonics,
    ai_high_yield, ai_algorithms, ai_review_qs,
    ai_processed_at, is_available, is_free_preview
  ) VALUES (
    v_specialty_id,
    'Pie Diabético — Prevención, Clasificación y Manejo',
    16,
    358,
    'Hola, hola. ¿Cómo están? Vamos a hablar del pie diabético, que es una de las complicaciones más

invalidantes de la diabetes, en el sentido en que eventualmente reduce la movilidad del paciente,

afecta psicológicamente. Así que es muy importante saber, no solamente que manejarlo,

sino que en particular prevenirlo. Sepan que es de las complicaciones que se pueden

evitar de mejor manera en la medida en que uno evalúe bien la sensibilidad,

la vascularización de los pies y obviamente que le haga mucho hincapié al paciente en manejar

adecuadamente su diabetes. Empecemos con cuál es la definición de un pie diabético y es un pie

en una persona con diabetes que tiene una úlcera, o sea que tiene una herida, o bien que tiene un

alto riesgo de hacer úlceras. Ejemplo que viene con una neuropatía, más cambios en la piel,

más deformación del pie, de las articulaciones, con artrósis, con todo ese tipo de cosas,

uno dice tiene un riesgo muy alto de evolucionar un pie diabético, eso sigue siendo pie diabético,

aunque no tenga la úlcera todavía. Ahora, la causa multifactorial, las cosas que más influyen

son la neuropatía por un lado, la vasculopatía, la esquemia, la falta de irrigación, y aparte

de eso obviamente la inmunodepresión que se asocia a los pacientes diabéticos. Su clasificación

va habitualmente del 1 al número 6, el número 0, bueno va del 0 al 6, el 0 es cuando todavía no

hay una úlcera pero sí tiene estos factores de riesgo que habíamos mencionado recién. Número

1 cuando hay una úlcera pero solamente cutánea, una úlcera que solamente llega hasta la piel,

el número 2 es cuando la úlcera ya se profundiza un poco más y llega a los tendones o a

los músculos, cuando ya hay una fasceitis necrotizante que en este caso suelen ser

polimicrobianas además, el grado 3 es cuando viene con formación de abscesos que hay que

drenar o cuando llega el hueso, de hecho la inmensa mayoría de las veces, las grados 3

vienen con osteomielitis y aquí el hueso viene en color rojo porque es lo que define

habitualmente el pronóstico o la respuesta al tratamiento en este caso, el grado 4 es cuando

ya viene con una gangrena localizada en alguna parte del pie y el grado 5 es cuando

ya viene con gangrena en todo el pie y que hay que amputar todo el pie. Ahora el manejo del

pie diabético número 1 es el manejo de los factores de riesgo y cuidar los pies, dígase el

manejar la dilipidemia, la diabetes, el tabaquismo, la hipertensión arterial, etcétera, cuidar los

pies con zapatos que sean blandos, adecuados, revisando los pies todos los días, con idas

al podólogo para que las uñas crezcan bien, para que no se formen las callosidades,

usar dispositivos de descarga, etcétera, cuidar los pies y aparte de eso, evaluar si requiere

revascularización en el caso de que haya una claudicación intermitente o una esquemia

crítica, hay que ir a evaluar los pulsos pedio, los pulsos tibiales e ir a ver si es que

eventualmente se requiere revascularizar para evitar que esto siga avanzando y salvarlo

de la amputación y finalmente si es que hay una úlcera y la úlcera se ve infectada,

eventualmente hay que dejarle antibióticos de amplio espectro en el sentido en que suelen

estar infectadas por múltiples bacterias de distinto tipo. Ahora, no siempre, hay veces

que hay una úlcera que no está infectada y ahí se dejan las curaciones pero sin antibiótico.

Ahora, ¿cuál es el manejo? Desde el momento en que ya viene con la afectación de los

tendones o del músculo, ya hay que entrar a una debididación que habitualmente es una

debididación quirúrgica, en este caso a diferencia de las escaras que muchas veces se

manejan con debididación química cuando no son tan profundas, en este caso en cambio se

prefiere la debididación quirúrgica y solamente cuando no hay un buen cirujano que sepa debidar

un pie diabético, en ese caso si se hace una debididación química con hidrogel o en alguna

cosa similar. Ahora, antes si solamente tengo una úlcera en la piel, obviamente el cuidado

general de las heridas más todo lo que se menciona ahí de cuidar los pies, de los

factores de riesgo, etcétera. Desde el momento en que ya tengo compromiso óseo o una gangrena

ya sea localizada o extensa, pues se maneja con amputación. Obviamente va a ser una

amputación más o menos grande dependiendo hasta dónde llegue el compromiso óseo y

dependiendo hasta dónde llegue la gangrena en el sentido que si es extensa se tiene que

sacar un pedazo más grande. Las como reglas de la amputación es número uno, intente

sacar lo menos posible pero lo suficiente para asegurarse de haber sacado toda la zona

infectada que ya no cicatrizó. Y número dos, intente salvar las articulaciones en el sentido

en que es más fácil una prótesis que mantenga una articulación con buena movilidad que una

que venga sin esta articulación. Como última cosa, dado que la osteomielitis, el compromiso

óseo es lo que determina si se amputa o no, es súper importante saber cómo es que yo veo

este compromiso óseo y se puede hacer de esas tres formas que aparecen ahí. Con la clínica,

si yo veo el hueso ahí lo palpo con el bisturí o con alguno de los elementos metálicos para

ir a ver una de estas heridas en el pie, yo digo ese es un hueso, veo las tradéculas óseas

y la pus saliendo de ahí y digo bueno no hay ninguna duda esto llega hasta el hueso y

amputar. Si es que no puedo pedir una radiografía que suele ser el examen inicial

es la evaluación del pie diabético y de las osteomielitis en general en búsqueda del

compromiso óseo, sabiendo que no es el más sensible, pero sí es muy rápido, es muy barato,

así que en la práctica se pide siempre. Y finalmente la resonancia magnética nuclear

es el mejor examen en el sentido en que es el más sensible y se pide cuando ni la clínica

ni la radiografía son categóricas, pero cualquiera de las tres que me muestre un

compromiso óseo lo más probable es que va a terminar en amputación, pero recuerden lo

importante es intentar evitar la amputación llegando a tiempo con estos pacientes. Así

que eso, voy a salvar los pie diabéticos que estén bien.',
    '1
00:00:03,340 --> 00:00:07,600
Hola, hola. ¿Cómo están? Vamos a hablar del pie diabético, que es una de las complicaciones más

2
00:00:07,600 --> 00:00:14,380
invalidantes de la diabetes, en el sentido en que eventualmente reduce la movilidad del paciente,

3
00:00:14,380 --> 00:00:18,780
afecta psicológicamente. Así que es muy importante saber, no solamente que manejarlo,

4
00:00:18,780 --> 00:00:23,780
sino que en particular prevenirlo. Sepan que es de las complicaciones que se pueden

5
00:00:23,780 --> 00:00:28,220
evitar de mejor manera en la medida en que uno evalúe bien la sensibilidad,

6
00:00:28,220 --> 00:00:34,780
la vascularización de los pies y obviamente que le haga mucho hincapié al paciente en manejar

7
00:00:34,780 --> 00:00:40,100
adecuadamente su diabetes. Empecemos con cuál es la definición de un pie diabético y es un pie

8
00:00:40,100 --> 00:00:45,340
en una persona con diabetes que tiene una úlcera, o sea que tiene una herida, o bien que tiene un

9
00:00:45,340 --> 00:00:52,460
alto riesgo de hacer úlceras. Ejemplo que viene con una neuropatía, más cambios en la piel,

10
00:00:52,460 --> 00:00:57,740
más deformación del pie, de las articulaciones, con artrósis, con todo ese tipo de cosas,

11
00:00:57,740 --> 00:01:02,260
uno dice tiene un riesgo muy alto de evolucionar un pie diabético, eso sigue siendo pie diabético,

12
00:01:02,260 --> 00:01:07,460
aunque no tenga la úlcera todavía. Ahora, la causa multifactorial, las cosas que más influyen

13
00:01:07,460 --> 00:01:15,460
son la neuropatía por un lado, la vasculopatía, la esquemia, la falta de irrigación, y aparte

14
00:01:15,460 --> 00:01:20,940
de eso obviamente la inmunodepresión que se asocia a los pacientes diabéticos. Su clasificación

15
00:01:20,940 --> 00:01:28,220
va habitualmente del 1 al número 6, el número 0, bueno va del 0 al 6, el 0 es cuando todavía no

16
00:01:28,220 --> 00:01:33,500
hay una úlcera pero sí tiene estos factores de riesgo que habíamos mencionado recién. Número

17
00:01:33,500 --> 00:01:37,340
1 cuando hay una úlcera pero solamente cutánea, una úlcera que solamente llega hasta la piel,

18
00:01:37,340 --> 00:01:43,060
el número 2 es cuando la úlcera ya se profundiza un poco más y llega a los tendones o a

19
00:01:43,060 --> 00:01:47,740
los músculos, cuando ya hay una fasceitis necrotizante que en este caso suelen ser

20
00:01:47,780 --> 00:01:52,860
polimicrobianas además, el grado 3 es cuando viene con formación de abscesos que hay que

21
00:01:52,860 --> 00:01:57,660
drenar o cuando llega el hueso, de hecho la inmensa mayoría de las veces, las grados 3

22
00:01:57,660 --> 00:02:03,580
vienen con osteomielitis y aquí el hueso viene en color rojo porque es lo que define

23
00:02:03,580 --> 00:02:10,300
habitualmente el pronóstico o la respuesta al tratamiento en este caso, el grado 4 es cuando

24
00:02:10,300 --> 00:02:15,500
ya viene con una gangrena localizada en alguna parte del pie y el grado 5 es cuando

25
00:02:15,500 --> 00:02:20,740
ya viene con gangrena en todo el pie y que hay que amputar todo el pie. Ahora el manejo del

26
00:02:20,740 --> 00:02:25,740
pie diabético número 1 es el manejo de los factores de riesgo y cuidar los pies, dígase el

27
00:02:25,740 --> 00:02:31,900
manejar la dilipidemia, la diabetes, el tabaquismo, la hipertensión arterial, etcétera, cuidar los

28
00:02:31,900 --> 00:02:38,380
pies con zapatos que sean blandos, adecuados, revisando los pies todos los días, con idas

29
00:02:38,380 --> 00:02:42,860
al podólogo para que las uñas crezcan bien, para que no se formen las callosidades,

30
00:02:43,180 --> 00:02:50,020
usar dispositivos de descarga, etcétera, cuidar los pies y aparte de eso, evaluar si requiere

31
00:02:50,020 --> 00:02:55,460
revascularización en el caso de que haya una claudicación intermitente o una esquemia

32
00:02:55,460 --> 00:03:00,460
crítica, hay que ir a evaluar los pulsos pedio, los pulsos tibiales e ir a ver si es que

33
00:03:00,460 --> 00:03:05,900
eventualmente se requiere revascularizar para evitar que esto siga avanzando y salvarlo

34
00:03:05,900 --> 00:03:11,020
de la amputación y finalmente si es que hay una úlcera y la úlcera se ve infectada,

35
00:03:11,060 --> 00:03:14,620
eventualmente hay que dejarle antibióticos de amplio espectro en el sentido en que suelen

36
00:03:14,620 --> 00:03:18,820
estar infectadas por múltiples bacterias de distinto tipo. Ahora, no siempre, hay veces

37
00:03:18,820 --> 00:03:22,780
que hay una úlcera que no está infectada y ahí se dejan las curaciones pero sin antibiótico.

38
00:03:22,780 --> 00:03:30,820
Ahora, ¿cuál es el manejo? Desde el momento en que ya viene con la afectación de los

39
00:03:30,820 --> 00:03:35,440
tendones o del músculo, ya hay que entrar a una debididación que habitualmente es una

40
00:03:35,440 --> 00:03:39,940
debididación quirúrgica, en este caso a diferencia de las escaras que muchas veces se

41
00:03:39,940 --> 00:03:44,460
manejan con debididación química cuando no son tan profundas, en este caso en cambio se

42
00:03:44,460 --> 00:03:49,900
prefiere la debididación quirúrgica y solamente cuando no hay un buen cirujano que sepa debidar

43
00:03:49,900 --> 00:03:54,300
un pie diabético, en ese caso si se hace una debididación química con hidrogel o en alguna

44
00:03:54,300 --> 00:03:59,220
cosa similar. Ahora, antes si solamente tengo una úlcera en la piel, obviamente el cuidado

45
00:03:59,220 --> 00:04:03,620
general de las heridas más todo lo que se menciona ahí de cuidar los pies, de los

46
00:04:03,620 --> 00:04:09,220
factores de riesgo, etcétera. Desde el momento en que ya tengo compromiso óseo o una gangrena

47
00:04:09,220 --> 00:04:14,660
ya sea localizada o extensa, pues se maneja con amputación. Obviamente va a ser una

48
00:04:14,660 --> 00:04:18,500
amputación más o menos grande dependiendo hasta dónde llegue el compromiso óseo y

49
00:04:18,500 --> 00:04:24,660
dependiendo hasta dónde llegue la gangrena en el sentido que si es extensa se tiene que

50
00:04:24,660 --> 00:04:29,780
sacar un pedazo más grande. Las como reglas de la amputación es número uno, intente

51
00:04:29,780 --> 00:04:35,500
sacar lo menos posible pero lo suficiente para asegurarse de haber sacado toda la zona

52
00:04:35,500 --> 00:04:41,140
infectada que ya no cicatrizó. Y número dos, intente salvar las articulaciones en el sentido

53
00:04:41,140 --> 00:04:48,180
en que es más fácil una prótesis que mantenga una articulación con buena movilidad que una

54
00:04:48,180 --> 00:04:54,700
que venga sin esta articulación. Como última cosa, dado que la osteomielitis, el compromiso

55
00:04:54,700 --> 00:04:59,340
óseo es lo que determina si se amputa o no, es súper importante saber cómo es que yo veo

56
00:04:59,340 --> 00:05:03,700
este compromiso óseo y se puede hacer de esas tres formas que aparecen ahí. Con la clínica,

57
00:05:03,700 --> 00:05:11,940
si yo veo el hueso ahí lo palpo con el bisturí o con alguno de los elementos metálicos para

58
00:05:11,940 --> 00:05:16,980
ir a ver una de estas heridas en el pie, yo digo ese es un hueso, veo las tradéculas óseas

59
00:05:16,980 --> 00:05:21,540
y la pus saliendo de ahí y digo bueno no hay ninguna duda esto llega hasta el hueso y

60
00:05:21,540 --> 00:05:25,900
amputar. Si es que no puedo pedir una radiografía que suele ser el examen inicial

61
00:05:25,900 --> 00:05:31,180
es la evaluación del pie diabético y de las osteomielitis en general en búsqueda del

62
00:05:31,180 --> 00:05:35,420
compromiso óseo, sabiendo que no es el más sensible, pero sí es muy rápido, es muy barato,

63
00:05:35,420 --> 00:05:39,820
así que en la práctica se pide siempre. Y finalmente la resonancia magnética nuclear

64
00:05:39,820 --> 00:05:44,580
es el mejor examen en el sentido en que es el más sensible y se pide cuando ni la clínica

65
00:05:44,580 --> 00:05:48,460
ni la radiografía son categóricas, pero cualquiera de las tres que me muestre un

66
00:05:48,460 --> 00:05:52,500
compromiso óseo lo más probable es que va a terminar en amputación, pero recuerden lo

67
00:05:52,500 --> 00:05:58,220
importante es intentar evitar la amputación llegando a tiempo con estos pacientes. Así

68
00:05:58,220 --> 00:06:00,300
que eso, voy a salvar los pie diabéticos que estén bien.',
    'El pie diabético es una de las complicaciones de la diabetes con mayor impacto en la calidad de vida del paciente. Genera limitación funcional, afectación psicológica y, en sus formas más graves, conduce a amputaciones. Lo que deben tener presente es que esta complicación es en gran medida prevenible, siempre que se evalúen adecuadamente la sensibilidad y la vascularización de los pies y se eduque al paciente sobre el cuidado cotidiano de sus extremidades.

Comencemos con la definición. El pie diabético se define como cualquier pie de un paciente con diabetes que tenga una úlcera activa, o bien que presente un alto riesgo de desarrollarla. Este último punto es importante: un paciente diabético con neuropatía periférica, alteraciones en la piel como hiperqueratosis o atrofia, deformidades articulares y disminución de la sensibilidad ya tiene pie diabético aunque no tenga una herida visible todavía.

La causa del pie diabético es multifactorial. Los tres pilares fisiopatológicos son la neuropatía periférica, la vasculopatía con isquemia, y la inmunosupresión relativa que acompaña a la diabetes crónica. La combinación de estos tres factores crea el escenario ideal para que una pequeña herida, que en una persona sana cicatriza en días, se convierta en una úlcera profunda infectada.',
    '["Pie diabético: úlcera activa o alto riesgo de úlcera en paciente diabético. Causas: neuropatía, vasculopatía e inmunosupresión.","Clasificación grados 0-5: grado 0 (riesgo sin úlcera), grado 1 (úlcera superficial), grado 2 (tendones/músculos), grado 3 (absceso/osteomielitis), grado 4 (gangrena localizada), grado 5 (gangrena total).","Prevención: control metabólico, cuidado del calzado, podología, evaluación vascular y revascularización cuando hay isquemia.","Desde grado 2: desbridamiento quirúrgico. Desde grado 3: amputación, intentando conservar la mayor cantidad de tejido viable y articulaciones.","Evaluación de osteomielitis: clínica directa, radiografía (inicial) y resonancia magnética (más sensible). Compromiso óseo confirmado = alta probabilidad de amputación."]'::jsonb,
    '[{"para":"\"0-Sin úlcera, 1-Piel, 2-Tendón, 3-Hueso/Absceso, 4-Gangrena Local, 5-Gangrena Total\"","nemotecnia":"\"0-Sin úlcera, 1-Piel, 2-Tendón, 3-Hueso/Absceso, 4-Gangrena Local, 5-Gangrena Total\"","explicacion":"Secuencia de los 6 grados del pie diabético. El grado 3 es el punto de inflexión: compromiso óseo = probable amputación.\nSecuencia de los 6 grados del pie diabético. El grado 3 es el punto de inflexión: compromiso óseo = probable amputación."},{"para":"\"NEUROPATÍA + VASCULOPATÍA + INMUNODEPRESIÓN = PIE DIABÉTICO\"","nemotecnia":"\"NEUROPATÍA + VASCULOPATÍA + INMUNODEPRESIÓN = PIE DIABÉTICO\"","explicacion":"Los tres pilares fisiopatológicos. Sin sensibilidad el paciente no siente la herida; sin irrigación no cicatriza; con inmunosupresión se infecta fácil.Los tres pilares fisiopatológicos. Sin sensibilidad el paciente no siente la herida; sin irrigación no cicatriza; con inmunosupresión se infecta fácil."},{"para":"\"RX primero, RMN si no es concluyente, CIRUJANO siempre\"","nemotecnia":"\"RX primero, RMN si no es concluyente, CIRUJANO siempre\"","explicacion":"Algoritmo de evaluación del compromiso óseo: clínica → radiografía → RMN. El desbridamiento es siempre quirúrgico en pie diabético.Algoritmo de evaluación del compromiso óseo: clínica → radiografía → RMN. El desbridamiento es siempre quirúrgico en pie diabético."}]'::jsonb,
    '["Pie diabético: úlcera activa o alto riesgo de úlcera en paciente diabético. Causas: neuropatía, vasculopatía e inmunosupresión.","Clasificación grados 0-5: grado 0 (riesgo sin úlcera), grado 1 (úlcera superficial), grado 2 (tendones/músculos), grado 3 (absceso/osteomielitis), grado 4 (gangrena localizada), grado 5 (gangrena total).","Prevención: control metabólico, cuidado del calzado, podología, evaluación vascular y revascularización cuando hay isquemia."]'::jsonb,
    '[]'::jsonb,
    '[{"pregunta":"¿Cuál de las siguientes afirmaciones sobre el pie diabético es correcta?","respuesta":"Respuesta correcta: C — El grado 3, con presencia de osteomielitis o absceso, es el que define el pronóstico y habitualmente termina en amputación. El desbridamiento quirúrgico es preferido sobre el químico en pie diabético; el pie en riesgo sin úlcera sí es grado 0; la radiografía simple es el examen inicial (no la RMN); y no todas las úlceras están infectadas."}]'::jsonb,
    NOW(),
    TRUE,
    FALSE  -- first 3 free preview
  ) ON CONFLICT (specialty_id, order_index)
  DO UPDATE SET
    title            = EXCLUDED.title,
    duration_seconds = EXCLUDED.duration_seconds,
    txt_content      = EXCLUDED.txt_content,
    srt_content      = EXCLUDED.srt_content,
    ai_summary       = EXCLUDED.ai_summary,
    ai_key_concepts  = EXCLUDED.ai_key_concepts,
    ai_mnemonics     = EXCLUDED.ai_mnemonics,
    ai_high_yield    = EXCLUDED.ai_high_yield,
    ai_review_qs     = EXCLUDED.ai_review_qs,
    ai_processed_at  = NOW(),
    is_available     = TRUE;

  -- Cápsula 17: Neuropatía Diabética — Formas Clínicas y Tratamiento
  INSERT INTO lessons (
    specialty_id, title, order_index, duration_seconds,
    txt_content, srt_content,
    ai_summary, ai_key_concepts, ai_mnemonics,
    ai_high_yield, ai_algorithms, ai_review_qs,
    ai_processed_at, is_available, is_free_preview
  ) VALUES (
    v_specialty_id,
    'Neuropatía Diabética — Formas Clínicas y Tratamiento',
    17,
    409,
    'Hola, hola, ¿cómo están? Hablemos de una de las complicaciones crónicas de la diabetes que es la

neuropatía diabética. Acá lo importante es conocer las clínicas de las distintas formas en

que se manifiestan las polineuropatías diabéticas. En primer lugar está la neuropatía

sensitiva o neuropatía sensitiva distalsimétrica o polineuropatía sensitiva y aquí hay que

recordar que hay una disminución de la sensibilidad. La sensibilidad que más se afecta

es la termalgésica y la vibratoria, aunque se puede afectar la sensibilidad táctil, fina,

la táctil, gruesa y toda la sensibilidad en general, pero la de la temperatura, la del dolor

y la de las vibraciones es la más frecuente y aquí es importante que se afecte la del dolor

en el sentido en que aumenta el riesgo de diabetes justamente porque se hace herida y

no le duele, no se da cuenta. En segundo lugar suele afectar la parte distal, empieza

como en calcetín que me afecta los pies pero eventualmente me puede afectar las manos

también y ahí uno habla de una distribución en guantes y calcetín o sea de predominio distal.

Aparte de esto puede venir no solamente con alteraciones sensitivas sino que con atrofia

muscular distal o con atrofia cutánea distal en el sentido en que si bien la parte sensitiva

es el núcleo de la clínica se afecta la parte motora también porque se afecta el nervio

periférico en general. En segundo lugar está la neuropatía dolorosa que puede venir con

toda la clínica sensitiva que vimos antes pero se agrega este dolor de características

urentes con alodinia y con hiperalgesia que es lo que se conoce en general como un dolor

de tipo neuropático. Recordemos que urente es que quema, que alodinia es que se genera

dolor con un estímulo generalmente no doloroso como ejemplo el roce y la hiperalgesia

es que se genera dolor con un estímulo habitualmente doloroso pero la intensidad

del dolor generado es mucho mayor al estímulo así ejemplo lo pellizco o lo pincho con algo y

le duele demasiado. Todas esas cosas sugieren dolor neuropático que se ve no solamente en

la neuropatía diabética sino que en otras neuropatías como ejemplo en la neuropatía

posherpética. Ahora la amiotrófica como su nombre lo dice viene con atrofia muscular y

no solamente la distal sino que habitualmente con atrofia más proximal dígase atrofia de los

cuadriceps de los músculos de la extremidad superior por ejemplo etcétera. Ahora no son

las únicas también están las neuropatías por atrapamiento que la más clásica es el

túnel carpiano o el síndrome de atrapamiento cubital en específico el túnel carpiano se

asocia fuertemente a diabetes por si acaso el cubital también un poquito aunque el

carpiano es el más frecuente y finalmente tengo las neuropatías de tipo cranial dentro de las

cuales asociadas a diabetes la más frecuente es la parálisis del tercer par o nervio o

culo motor y aparte de eso se pueden afectar los otros nervios o culo motores dígase el

cuarto que se llama igualmente el nervio troclear y el sexto que se llama el nervio

abducens o abducente. Ahora tercero cuarto y sexto todos son o culo motores pero el que

se llama o culo motor es el tercero por si acaso recordemos bien rápido la parálisis del tercer

par habitualmente viene con imposibilidad de ver hacia arriba hacia abajo y hacia medial así

que el ojo habitualmente se me va hacia lateral y se genera un poco de tosis más un poco de

midriasis eso lo vamos a ver con más detalle en neuro por si acaso pero solamente para

recordarlo. El cuarto par es la imposibilidad de ver hacia infero medial así que lo que se

me puede ir un poquito hacia atrás y el sexto par es imposibilidad de ver hacia lateral así

que habitualmente el ojo se me va un poquito hacia adentro. Ahora cómo se diagnostica la

neuropatía diabética el diagnóstico es absolutamente clínico y por eso es tan

importante conocer las clínicas y saber diferenciarlas ahora cuando me queda la

duda eventualmente si le puedo solicitar un examen que es la electromiografía que

evalúa el funcionamiento del nervio del nervio periférico y me confirma el diagnóstico pero que

quede bien claro el diagnóstico clínico habitualmente es el más importante el tratamiento

de la neuropatía diabética por la general es cuidar los pies eso es muy importante en el

sentido en que se complica con pie diabético segundo lugar el control metabólico el manejo

de la diabetes sabiendo que las neuropatías son algo irreversibles pero eventualmente esto

sí me puede ayudar a evitar la progresión y podría mejorar un poquito los síntomas finalmente

el manejo del dolor cuando viene con el dolor neuropático existen varios fármacos que son

eficaces en esto y son los moduladores del dolor no me sirve el paracetamol ni los

sáines ni los corticoides o sea no me sirven los analgésicos estándar sino que tengo

que usar estos moduladores del dolor neuropático o estabilizadores del nervio periférico dentro

de los cuales los más importantes actualmente son algunos antidepresivos duales como la

bellafaxina o la duloxetina que ambos actúan por varios neurotransmisores pero en particular

por la vía serotoninérgica que si se acuerdan eran de segunda línea en el tratamiento de la

depresión aparte de eso los clásicos moduladores del dolor neuropático gaba que

son la gaba pentina y la pregabalina y finalmente todavía se pueden usar los antidepresivos

triciclicos en dosis bajas son eficaces no hay diferencia entre los medicamentos que están

acá los tricíclicos son mucho más baratos que la bellafaxina pero acuérdense que no

se pueden usar en adulto mayor así que habitualmente están reservados a pacientes

jóvenes que pueden seguir esto y que tienen un bajo riesgo de cardio toxicidad por los triciclicos

ahora la otra pregunta que hay es le dejo insulina a una neuropatía diabética y la verdad

que no está demostrado que per se sea una indicación pero se suele dejar en la neuropatía

dolorosa y en la neuropatía amiotrófica en el sentido en que me sirve para ganar peso y

recuperar la atrofia muscular y eventualmente me acelera el control metabólico que me

podría disminuir un poco el dolor también sabiendo que lo fundamental van a ser estos

fármacos estabilizadores de la conducción nerviosa finalmente en el caso de las neuropatías

por atrapamiento ya sea en contexto de diabetes o por alguna otra razón por la general se

operan se descomprimen mediante una cirugía de liberación en el caso del túnel carpiano

se corta el retináculo flexor pero sepan que hay algunos casos en que responden bien a la

quinezioterapia más un buen control metabólico y sepan que en ese caso sí suele indicarse la

electromiografía como para estar seguro en qué lugar está el atrapamiento antes de ir a

descomprimir quirúrgicamente y bueno eso fue todo de este tema un tema corto pero importante',
    '1
00:00:03,150 --> 00:00:07,270
Hola, hola, ¿cómo están? Hablemos de una de las complicaciones crónicas de la diabetes que es la

2
00:00:07,270 --> 00:00:12,510
neuropatía diabética. Acá lo importante es conocer las clínicas de las distintas formas en

3
00:00:12,510 --> 00:00:18,030
que se manifiestan las polineuropatías diabéticas. En primer lugar está la neuropatía

4
00:00:18,030 --> 00:00:24,830
sensitiva o neuropatía sensitiva distalsimétrica o polineuropatía sensitiva y aquí hay que

5
00:00:24,830 --> 00:00:29,230
recordar que hay una disminución de la sensibilidad. La sensibilidad que más se afecta

6
00:00:29,230 --> 00:00:34,550
es la termalgésica y la vibratoria, aunque se puede afectar la sensibilidad táctil, fina,

7
00:00:34,550 --> 00:00:39,230
la táctil, gruesa y toda la sensibilidad en general, pero la de la temperatura, la del dolor

8
00:00:39,230 --> 00:00:43,870
y la de las vibraciones es la más frecuente y aquí es importante que se afecte la del dolor

9
00:00:43,870 --> 00:00:48,190
en el sentido en que aumenta el riesgo de diabetes justamente porque se hace herida y

10
00:00:48,190 --> 00:00:53,950
no le duele, no se da cuenta. En segundo lugar suele afectar la parte distal, empieza

11
00:00:53,950 --> 00:00:58,190
como en calcetín que me afecta los pies pero eventualmente me puede afectar las manos

12
00:00:58,190 --> 00:01:03,270
también y ahí uno habla de una distribución en guantes y calcetín o sea de predominio distal.

13
00:01:03,270 --> 00:01:07,950
Aparte de esto puede venir no solamente con alteraciones sensitivas sino que con atrofia

14
00:01:07,950 --> 00:01:14,190
muscular distal o con atrofia cutánea distal en el sentido en que si bien la parte sensitiva

15
00:01:14,190 --> 00:01:18,870
es el núcleo de la clínica se afecta la parte motora también porque se afecta el nervio

16
00:01:18,870 --> 00:01:24,350
periférico en general. En segundo lugar está la neuropatía dolorosa que puede venir con

17
00:01:24,350 --> 00:01:29,310
toda la clínica sensitiva que vimos antes pero se agrega este dolor de características

18
00:01:29,310 --> 00:01:34,990
urentes con alodinia y con hiperalgesia que es lo que se conoce en general como un dolor

19
00:01:34,990 --> 00:01:41,070
de tipo neuropático. Recordemos que urente es que quema, que alodinia es que se genera

20
00:01:41,070 --> 00:01:46,310
dolor con un estímulo generalmente no doloroso como ejemplo el roce y la hiperalgesia

21
00:01:46,310 --> 00:01:50,870
es que se genera dolor con un estímulo habitualmente doloroso pero la intensidad

22
00:01:50,870 --> 00:01:57,830
del dolor generado es mucho mayor al estímulo así ejemplo lo pellizco o lo pincho con algo y

23
00:01:57,830 --> 00:02:02,470
le duele demasiado. Todas esas cosas sugieren dolor neuropático que se ve no solamente en

24
00:02:02,470 --> 00:02:07,950
la neuropatía diabética sino que en otras neuropatías como ejemplo en la neuropatía

25
00:02:07,950 --> 00:02:15,830
posherpética. Ahora la amiotrófica como su nombre lo dice viene con atrofia muscular y

26
00:02:15,830 --> 00:02:21,390
no solamente la distal sino que habitualmente con atrofia más proximal dígase atrofia de los

27
00:02:21,390 --> 00:02:29,510
cuadriceps de los músculos de la extremidad superior por ejemplo etcétera. Ahora no son

28
00:02:29,510 --> 00:02:33,710
las únicas también están las neuropatías por atrapamiento que la más clásica es el

29
00:02:33,710 --> 00:02:38,790
túnel carpiano o el síndrome de atrapamiento cubital en específico el túnel carpiano se

30
00:02:38,790 --> 00:02:43,750
asocia fuertemente a diabetes por si acaso el cubital también un poquito aunque el

31
00:02:43,790 --> 00:02:49,790
carpiano es el más frecuente y finalmente tengo las neuropatías de tipo cranial dentro de las

32
00:02:49,790 --> 00:02:55,150
cuales asociadas a diabetes la más frecuente es la parálisis del tercer par o nervio o

33
00:02:55,150 --> 00:03:00,070
culo motor y aparte de eso se pueden afectar los otros nervios o culo motores dígase el

34
00:03:00,070 --> 00:03:06,670
cuarto que se llama igualmente el nervio troclear y el sexto que se llama el nervio

35
00:03:06,670 --> 00:03:12,470
abducens o abducente. Ahora tercero cuarto y sexto todos son o culo motores pero el que

36
00:03:12,510 --> 00:03:17,470
se llama o culo motor es el tercero por si acaso recordemos bien rápido la parálisis del tercer

37
00:03:17,470 --> 00:03:21,910
par habitualmente viene con imposibilidad de ver hacia arriba hacia abajo y hacia medial así

38
00:03:21,910 --> 00:03:27,670
que el ojo habitualmente se me va hacia lateral y se genera un poco de tosis más un poco de

39
00:03:27,670 --> 00:03:32,790
midriasis eso lo vamos a ver con más detalle en neuro por si acaso pero solamente para

40
00:03:32,790 --> 00:03:37,150
recordarlo. El cuarto par es la imposibilidad de ver hacia infero medial así que lo que se

41
00:03:37,150 --> 00:03:42,590
me puede ir un poquito hacia atrás y el sexto par es imposibilidad de ver hacia lateral así

42
00:03:42,590 --> 00:03:47,710
que habitualmente el ojo se me va un poquito hacia adentro. Ahora cómo se diagnostica la

43
00:03:47,710 --> 00:03:52,230
neuropatía diabética el diagnóstico es absolutamente clínico y por eso es tan

44
00:03:52,230 --> 00:03:56,630
importante conocer las clínicas y saber diferenciarlas ahora cuando me queda la

45
00:03:56,630 --> 00:04:01,630
duda eventualmente si le puedo solicitar un examen que es la electromiografía que

46
00:04:01,750 --> 00:04:07,310
evalúa el funcionamiento del nervio del nervio periférico y me confirma el diagnóstico pero que

47
00:04:07,310 --> 00:04:12,030
quede bien claro el diagnóstico clínico habitualmente es el más importante el tratamiento

48
00:04:12,030 --> 00:04:17,070
de la neuropatía diabética por la general es cuidar los pies eso es muy importante en el

49
00:04:17,070 --> 00:04:22,310
sentido en que se complica con pie diabético segundo lugar el control metabólico el manejo

50
00:04:22,310 --> 00:04:28,030
de la diabetes sabiendo que las neuropatías son algo irreversibles pero eventualmente esto

51
00:04:28,030 --> 00:04:34,110
sí me puede ayudar a evitar la progresión y podría mejorar un poquito los síntomas finalmente

52
00:04:34,110 --> 00:04:41,110
el manejo del dolor cuando viene con el dolor neuropático existen varios fármacos que son

53
00:04:41,110 --> 00:04:45,990
eficaces en esto y son los moduladores del dolor no me sirve el paracetamol ni los

54
00:04:45,990 --> 00:04:51,910
sáines ni los corticoides o sea no me sirven los analgésicos estándar sino que tengo

55
00:04:51,910 --> 00:04:59,430
que usar estos moduladores del dolor neuropático o estabilizadores del nervio periférico dentro

56
00:04:59,430 --> 00:05:04,030
de los cuales los más importantes actualmente son algunos antidepresivos duales como la

57
00:05:04,030 --> 00:05:10,590
bellafaxina o la duloxetina que ambos actúan por varios neurotransmisores pero en particular

58
00:05:10,590 --> 00:05:15,470
por la vía serotoninérgica que si se acuerdan eran de segunda línea en el tratamiento de la

59
00:05:15,470 --> 00:05:22,270
depresión aparte de eso los clásicos moduladores del dolor neuropático gaba que

60
00:05:22,270 --> 00:05:27,350
son la gaba pentina y la pregabalina y finalmente todavía se pueden usar los antidepresivos

61
00:05:27,350 --> 00:05:32,750
triciclicos en dosis bajas son eficaces no hay diferencia entre los medicamentos que están

62
00:05:32,750 --> 00:05:36,590
acá los tricíclicos son mucho más baratos que la bellafaxina pero acuérdense que no

63
00:05:36,590 --> 00:05:41,110
se pueden usar en adulto mayor así que habitualmente están reservados a pacientes

64
00:05:41,110 --> 00:05:46,590
jóvenes que pueden seguir esto y que tienen un bajo riesgo de cardio toxicidad por los triciclicos

65
00:05:46,590 --> 00:05:53,070
ahora la otra pregunta que hay es le dejo insulina a una neuropatía diabética y la verdad

66
00:05:53,070 --> 00:05:58,390
que no está demostrado que per se sea una indicación pero se suele dejar en la neuropatía

67
00:05:58,390 --> 00:06:05,390
dolorosa y en la neuropatía amiotrófica en el sentido en que me sirve para ganar peso y

68
00:06:05,390 --> 00:06:10,550
recuperar la atrofia muscular y eventualmente me acelera el control metabólico que me

69
00:06:10,550 --> 00:06:14,710
podría disminuir un poco el dolor también sabiendo que lo fundamental van a ser estos

70
00:06:14,710 --> 00:06:19,670
fármacos estabilizadores de la conducción nerviosa finalmente en el caso de las neuropatías

71
00:06:19,670 --> 00:06:25,190
por atrapamiento ya sea en contexto de diabetes o por alguna otra razón por la general se

72
00:06:25,190 --> 00:06:31,190
operan se descomprimen mediante una cirugía de liberación en el caso del túnel carpiano

73
00:06:31,190 --> 00:06:36,830
se corta el retináculo flexor pero sepan que hay algunos casos en que responden bien a la

74
00:06:37,590 --> 00:06:43,870
quinezioterapia más un buen control metabólico y sepan que en ese caso sí suele indicarse la

75
00:06:43,870 --> 00:06:49,030
electromiografía como para estar seguro en qué lugar está el atrapamiento antes de ir a

76
00:06:49,030 --> 00:06:54,470
descomprimir quirúrgicamente y bueno eso fue todo de este tema un tema corto pero importante',
    'La neuropatía diabética es otra de las complicaciones crónicas que deben dominar para el EUNACOM. Lo más importante aquí es conocer las distintas presentaciones clínicas, porque el diagnóstico es fundamentalmente clínico, y saber distinguir entre ellas es lo que les permitirá orientar el manejo correctamente.

Comenzamos con la forma más frecuente: la neuropatía sensitiva distal simétrica, también llamada polineuropatía sensitiva. La característica principal es la disminución de la sensibilidad, y la modalidad más afectada es la termalgésica, es decir la sensibilidad al dolor y a la temperatura, seguida de la vibratoria. La distribución es distal y simétrica: empieza en los pies, con una distribución en calcetín, y si avanza puede comprometer también las manos, adoptando la conocida distribución en guante y calcetín. Además de la afectación sensitiva, puede haber atrofia muscular distal y atrofia cutánea, porque el daño involucra al nervio periférico en su totalidad. Este déficit sensitivo, en especial la pérdida de la percepción del dolor, es el mecanismo central que explica por qué estos pacientes desarrollan pie diabético: se hacen heridas y no las sienten.

La neuropatía dolorosa comparte todas las características sensitivas de la forma anterior, pero se agrega un dolor de características neuropáticas. Este dolor se describe como urente, es decir, que quema. Además, el paciente presenta alodinia, que es dolor generado por estímulos normalmente no dolorosos como el roce de la ropa o las sábanas. Y presenta hiperalgesia, que es una respuesta dolorosa exagerada ante estímulos que habitualmente producen dolor leve. Este tipo de dolor no responde a los analgésicos convencionales como el paracetamol o los antiinflamatorios no esteroidales.',
    '["La neuropatía sensitiva distal simétrica es la forma más frecuente; afecta principalmente sensibilidad termalgésica y vibratoria en distribución en calcetín o guante-calcetín.","La neuropatía dolorosa agrega dolor urente, alodinia e hiperalgesia; no responde a analgésicos convencionales.","La neuropatía amiotrófica produce atrofia muscular proximal (cuádriceps, cintura escapular), a diferencia de la sensitiva que causa atrofia distal.","Las neuropatías craneales más frecuentes en diabetes: parálisis del III par (ptosis, midriasis, ojo hacia lateral), IV par y VI par oculomotores.","Tratamiento del dolor neuropático: duloxetina, venlafaxina, gabapentina, pregabalina, tricíclicos en dosis bajas (contraindicados en adulto mayor). Atrapamientos: cirugía de descompresión."]'::jsonb,
    '[{"para":"\"CALCETÍN y GUANTE: Sensitiva. PROX: Amiotrófica. DOLOR-QUEMA: Dolorosa. OJO-CAÍDO: Craneal\"","nemotecnia":"\"CALCETÍN y GUANTE: Sensitiva. PROX: Amiotrófica. DOLOR-QUEMA: Dolorosa. OJO-CAÍDO: Craneal\"","explicacion":"Las cuatro formas de neuropatía diabética: distribución distal (sensitiva), proximal (amiotrófica), dolor urente (dolorosa), parálisis ocular (craneal).\nLas cuatro formas de neuropatía diabética: distribución distal (sensitiva), proximal (amiotrófica), dolor urente (dolorosa), parálisis ocular (craneal)."},{"para":"\"GABA-DULOXETINA-TRICÍCLICO = el TRÍO del dolor neuropático\"","nemotecnia":"\"GABA-DULOXETINA-TRICÍCLICO = el TRÍO del dolor neuropático\"","explicacion":"Gabapentina/pregabalina + duloxetina/venlafaxina + tricíclicos (no en adulto mayor). Ningún AINE ni paracetamol funciona aquí.Gabapentina/pregabalina + duloxetina/venlafaxina + tricíclicos (no en adulto mayor). Ningún AINE ni paracetamol funciona aquí."},{"para":"\"III par: ojo AFUERA, párpado CAÍDO, pupila GRANDE\"","nemotecnia":"\"III par: ojo AFUERA, párpado CAÍDO, pupila GRANDE\"","explicacion":"Ptosis + midriasis + ojo desviado lateralmente = parálisis del nervio oculomotor (III par craneal). La más frecuente en neuropatía diabética craneal.Ptosis + midriasis + ojo desviado lateralmente = parálisis del nervio oculomotor (III par craneal). La más frecuente en neuropatía diabética craneal."}]'::jsonb,
    '["La neuropatía sensitiva distal simétrica es la forma más frecuente; afecta principalmente sensibilidad termalgésica y vibratoria en distribución en calcetín o guante-calcetín.","La neuropatía dolorosa agrega dolor urente, alodinia e hiperalgesia; no responde a analgésicos convencionales.","La neuropatía amiotrófica produce atrofia muscular proximal (cuádriceps, cintura escapular), a diferencia de la sensitiva que causa atrofia distal."]'::jsonb,
    '[]'::jsonb,
    '[{"pregunta":"¿Cuál de las siguientes afirmaciones sobre la neuropatía diabética es correcta?","respuesta":"Respuesta correcta: C — Los tricíclicos son eficaces en dosis bajas para el dolor neuropático, pero su cardiotoxicidad y perfil anticolinérgico los hace peligrosos en adultos mayores. El paracetamol no sirve para el dolor neuropático; la amiotrófica tiene atrofia proximal, no distal; el diagnóstico es clínico (la EMG es complementaria); y la parálisis del VI par produce desviación medial del ojo, no ptosis ni midriasis (eso es el III par)."}]'::jsonb,
    NOW(),
    TRUE,
    FALSE  -- first 3 free preview
  ) ON CONFLICT (specialty_id, order_index)
  DO UPDATE SET
    title            = EXCLUDED.title,
    duration_seconds = EXCLUDED.duration_seconds,
    txt_content      = EXCLUDED.txt_content,
    srt_content      = EXCLUDED.srt_content,
    ai_summary       = EXCLUDED.ai_summary,
    ai_key_concepts  = EXCLUDED.ai_key_concepts,
    ai_mnemonics     = EXCLUDED.ai_mnemonics,
    ai_high_yield    = EXCLUDED.ai_high_yield,
    ai_review_qs     = EXCLUDED.ai_review_qs,
    ai_processed_at  = NOW(),
    is_available     = TRUE;

  -- Cápsula 18: Cetoacidosis Diabética vs. Síndrome Hiperglicémico Hiperosmolar — Diagnóstico y Diferencias
  INSERT INTO lessons (
    specialty_id, title, order_index, duration_seconds,
    txt_content, srt_content,
    ai_summary, ai_key_concepts, ai_mnemonics,
    ai_high_yield, ai_algorithms, ai_review_qs,
    ai_processed_at, is_available, is_free_preview
  ) VALUES (
    v_specialty_id,
    'Cetoacidosis Diabética vs. Síndrome Hiperglicémico Hiperosmolar — Diagnóstico y Diferencias',
    18,
    512,
    'Hola, hola, ¿cómo están? Hablemos de las complicaciones agudas de la diabetes, en específico vamos a ver la cetoacidosis diabética y el síndrome hiperglicémico-hiperosmolar

que a ambos en la cultura popular o en el lenguaje de los pacientes hablan del coma diabético.

Ahora, el coma diabético puede ser también una hipoglicemia, así que, ¡harto cuidado!

Empecemos con las diferencias clínicas de ambas, si bien comparten muchas cosas, tienen algunas diferencias que vale la pena saber.

Antes sepan que la cetoacidosis suele ser mucho más frecuente en la diabetes tipo 1,

en cambio el síndrome hiperglicémico-hiperosmolar suele ser mucho más frecuente en la diabetes tipo 2.

Respecto a la clínica de la cetoacidosis, es muy frecuente la sintomatología gastrointestinal,

en específico el dolor abdominal, pero puede venir además con náuseas, con vómitos,

y es de hecho una de las causas de abdomen agudo, así como algo raro de origen metabólico,

así que mucho cuidado con los pacientes que vengan con dolor de guata, jóvenes,

con algo medio raro, medio hipotenso, puede ser eventualmente una cetoacidosis.

Segundo lugar, algo que no es tan frecuente, pero que es muy característico,

el aliento cetónico, un aliento como a manzana que se describe,

la respiración de Kussmaul, que es una respiración bien profunda,

que es una especie de compensación de la acidosis metabólica que se compensa respiratoriamente

intentando excretar más CO2 y de esa manera subir un poquito el pH que está muy bajo.

Aparte de esto, es frecuente que venga con compromisos de conciencia,

aunque eso no me hace la diferencia con el síndrome hiperglicémico-hiperosmolar,

y finalmente es muy frecuente que venga con mucha deshidratación.

Pero esto también se ve en el síndrome hiperglicémico-hiperosmolar,

que de hecho lo más frecuente es que viene con compromisos de conciencia,

ya sea con confusión, con coma, o bien con incluso signos focales,

cuando la hormonalidad es demasiado alta, incluso puede venir no solamente con este compromiso

de conciencia general, sino que con signos neurológico-focales como emiparesia, por ejemplo.

Así que mucho cuidado con un signo focal que va a sugerir un accidente vascular,

si es que viene con un hemoglucotés demasiado alto, eventualmente puede ser

un síndrome hiperglicémico-hiperosmolar también.

Aparte de esto, la deshidratación suele ser mucho mayor en este caso,

con una hormonalidad tan alta, eventualmente el paciente pierde mucho líquido a través de la orina

o se le sale de las células en general y es algo que puede afectarlo bastante.

Y finalmente, dada esta gran deshidratación, puede haber compromiso homodinámico también

con hipotensión, con taquicárbida.

Algo importante es que existen cuadros mixtos en que mezclan estas dos cosas,

incluso hay veces que se cumplen los criterios tanto de la cetoacidosis

como del síndrome hiperglicémico-hiperosmolar.

Y como otra cosa importante, ambas suelen venir con algún descompensante,

ejemplo una infección severa o alguna cosa así, que per se puede venir

con el compromiso de conciencia, con el compromiso hemodinámico,

así que hay que tener harto cuidado de no confundir la causa con la consecuencia.

Ejemplo, el accidente vascular puede generarme también un síndrome

hiperglicémico-hiperosmolar, así que aunque tenga el síndrome hiperglicémico-hiperosmolar

no puedo descartar el accidente vascular hasta que no haya pedido las imágenes

y haber hecho el manejo completo.

Siguiendo con esto, veamos los criterios diagnósticos que afortunadamente

son muy sencillos porque son iguales al nombre de la cetoacidosis diabética

y del síndrome hiperglicémico-hiperosmolar.

La parte ceto es que tenga cuerpos cetónicos que estén elevados

ya sea en sangre o en orina, habitualmente se miden en ambas partes

pero basta con que yo lo mida en una parte y que identifique esta cetonemia

como para ya cumplir con ese criterio.

En segundo lugar, que venga con acidosis y aquí sí no puede ser cualquier tipo de acidosis,

tiene que ser una acidosis importante con un pH menor a 7,3

de tipo metabólica, dígase con el bicarbonato bajo,

abajo de 15 y en algunas partes sale abajo de 18 mil equivalentes por litro

y con un anion gap que esté aumentado en el sentido en que las acidosis metabólicas

con anion gap normal habitualmente son por otras causas como por ejemplo

diarrea, por falla renal, por ese tipo de cosas, pero en este caso

como es por un ácido orgánico distinto, los cetoacidos, en ese caso

el anion gap aumenta. Acuérdense que el anion gap habitualmente refleja

la presencia de otro ácido orgánico, ejemplo acidosis láctica, acidosis alcohólica,

la cetoacidosis diabética, etc. Y finalmente la parte diabética

que es que tenga una glicemia arriba de 250, aunque en algunos lugares

aparece arriba de 200 y de hecho en pediatría el corte habitualmente

es arriba de 200, pero en resumen que haya cuerpos cetónicos,

que haya una acidosis metabólica con anion gap aumentado

arriba de 12 o al menos arriba de 10 y finalmente que venga con hiperglicemia

arriba de 200 que es lo característico de la diabetes. En el caso del síndrome

hiperglicémico-hiperosmolar debe ser hiperglicémico con una glicemia

arriba de 600 y segundo lugar debe ser hiperosmolar con una

osmolaridad plasmática arriba de 320 miliosmoles por litro.

Ahora, algo importante es que habitualmente si tengo una glicemia

arriba de 600 tengo una hiperosmolaridad de ese tipo, así que con que uno vea

la glicemia así de alta ya me puedo ahorrar eventualmente el calcular

la osmolaridad plasmática. Recuerden que hay cuadros mixtos que

algunas veces son incompletos para una o bien a veces son concordantes

con ambos, pero eso no importa mucho porque el manejo es el mismo

o casi el mismo que lo vamos a ver en su respectivo video.

Ahora, un pequeño recordatorio de fisiotatología antes de terminar

este video. Número uno, los cuerpos cetónicos que hay que saber son dos.

Uno es el ácido acetoacético o el acetoacetato y en segundo lugar

el ácido hidroxibutírico o hidroxibutirato. Esos son, lo ideal

es medir los dos en el sentido en que hay algunos cuadros de

cetoacidosis que elevan mucho más uno que el otro y si es que yo solamente

he medido uno eventualmente puedo tener un falso negativo.

Segundo lugar, la osmolaridad plasmática se calculaba con esa fórmula que está ahí

2 multiplicado por el sodio más la glicemia dividido por 18

y eso era porque el peso molecular de la glucosa es 180

así que como para llevarlo a los mil osmoles por litro se divide por 18

más el boom dividido por 2,8 porque el peso molecular de la urea

era 28. Ahora no importa tanto eso, la fórmula esa aprendásela de memoria

pero lo importante es que la osmolaridad plasmática efectiva

que es la que me interesa y la que yo tengo que calcular en este caso

no toma en cuenta la urea en el sentido en que la urea

es un componente apolar que pasa muy fácil la barrera celular

la membrana celular así que cuando sube mucho simplemente se va

hacia dentro de las células y se estabiliza la osmolaridad en ambos lados.

En cambio el sodio y los electrolitos que lo acompañan como el cloro

y el bicarbonato y la glicemia tienen más dificultades

para entrar y salir de las células y eso hace que determinen la osmolaridad

efectiva. Así que ya saben en el síndrome hiperglicémico

hiperosmolar tiene que ser mayor a 320 pero calculada de esa forma

solamente 2 por el sodio más la glicemia dividido por 18

recordándonos que si estaba arriba de 600 lo más probable es que estuviera

con la hiperosmolaridad igual. Finalmente el anion gap

como se calculaba esto? Se calculaba con el sodio menos el cloro

menos el bicarbonato en el sentido en que el sodio es el principal

cation o ion positivo en cambio el cloro y el bicarbonato

son los dos principales aniones digamos

los iones negativos y obviamente la diferencia entre el sodio

y los otros dos aniones va a ser el anion gap que va a estar ocupada por

otros ácidos por otros aniones que obviamente cuando hay presencia

de algún ácido orgánico esto aumenta y se aumenta el gap

así que aumenta el anion gap en estas acidosis causadas

por ácidos orgánicos en general. Y bueno así que acuérdense

la fisioterapia es algo que se puede olvidar pero hay que

recordarla aunque sea un poquito y vamos a ver en el siguiente video el manejo

específico de estas dos complicaciones del acetoacidosis y del síndrome hiperglicémico

que nos vemos.',
    '1
00:00:03,280 --> 00:00:11,280
Hola, hola, ¿cómo están? Hablemos de las complicaciones agudas de la diabetes, en específico vamos a ver la cetoacidosis diabética y el síndrome hiperglicémico-hiperosmolar

2
00:00:11,280 --> 00:00:17,280
que a ambos en la cultura popular o en el lenguaje de los pacientes hablan del coma diabético.

3
00:00:17,280 --> 00:00:21,280
Ahora, el coma diabético puede ser también una hipoglicemia, así que, ¡harto cuidado!

4
00:00:21,280 --> 00:00:28,280
Empecemos con las diferencias clínicas de ambas, si bien comparten muchas cosas, tienen algunas diferencias que vale la pena saber.

5
00:00:28,280 --> 00:00:32,280
Antes sepan que la cetoacidosis suele ser mucho más frecuente en la diabetes tipo 1,

6
00:00:32,280 --> 00:00:37,280
en cambio el síndrome hiperglicémico-hiperosmolar suele ser mucho más frecuente en la diabetes tipo 2.

7
00:00:37,280 --> 00:00:42,280
Respecto a la clínica de la cetoacidosis, es muy frecuente la sintomatología gastrointestinal,

8
00:00:42,280 --> 00:00:47,280
en específico el dolor abdominal, pero puede venir además con náuseas, con vómitos,

9
00:00:47,280 --> 00:00:53,280
y es de hecho una de las causas de abdomen agudo, así como algo raro de origen metabólico,

10
00:00:53,280 --> 00:00:57,280
así que mucho cuidado con los pacientes que vengan con dolor de guata, jóvenes,

11
00:00:57,280 --> 00:01:01,280
con algo medio raro, medio hipotenso, puede ser eventualmente una cetoacidosis.

12
00:01:01,280 --> 00:01:06,280
Segundo lugar, algo que no es tan frecuente, pero que es muy característico,

13
00:01:06,280 --> 00:01:10,280
el aliento cetónico, un aliento como a manzana que se describe,

14
00:01:10,280 --> 00:01:15,280
la respiración de Kussmaul, que es una respiración bien profunda,

15
00:01:15,280 --> 00:01:21,280
que es una especie de compensación de la acidosis metabólica que se compensa respiratoriamente

16
00:01:21,280 --> 00:01:28,280
intentando excretar más CO2 y de esa manera subir un poquito el pH que está muy bajo.

17
00:01:28,280 --> 00:01:31,280
Aparte de esto, es frecuente que venga con compromisos de conciencia,

18
00:01:31,280 --> 00:01:36,280
aunque eso no me hace la diferencia con el síndrome hiperglicémico-hiperosmolar,

19
00:01:36,280 --> 00:01:39,280
y finalmente es muy frecuente que venga con mucha deshidratación.

20
00:01:39,280 --> 00:01:43,280
Pero esto también se ve en el síndrome hiperglicémico-hiperosmolar,

21
00:01:43,280 --> 00:01:46,280
que de hecho lo más frecuente es que viene con compromisos de conciencia,

22
00:01:46,280 --> 00:01:51,280
ya sea con confusión, con coma, o bien con incluso signos focales,

23
00:01:51,280 --> 00:01:57,280
cuando la hormonalidad es demasiado alta, incluso puede venir no solamente con este compromiso

24
00:01:57,280 --> 00:02:01,280
de conciencia general, sino que con signos neurológico-focales como emiparesia, por ejemplo.

25
00:02:01,280 --> 00:02:06,280
Así que mucho cuidado con un signo focal que va a sugerir un accidente vascular,

26
00:02:06,280 --> 00:02:11,280
si es que viene con un hemoglucotés demasiado alto, eventualmente puede ser

27
00:02:11,280 --> 00:02:14,280
un síndrome hiperglicémico-hiperosmolar también.

28
00:02:14,280 --> 00:02:19,280
Aparte de esto, la deshidratación suele ser mucho mayor en este caso,

29
00:02:19,280 --> 00:02:26,280
con una hormonalidad tan alta, eventualmente el paciente pierde mucho líquido a través de la orina

30
00:02:26,280 --> 00:02:30,280
o se le sale de las células en general y es algo que puede afectarlo bastante.

31
00:02:30,280 --> 00:02:34,280
Y finalmente, dada esta gran deshidratación, puede haber compromiso homodinámico también

32
00:02:34,280 --> 00:02:36,280
con hipotensión, con taquicárbida.

33
00:02:36,280 --> 00:02:41,280
Algo importante es que existen cuadros mixtos en que mezclan estas dos cosas,

34
00:02:41,280 --> 00:02:45,280
incluso hay veces que se cumplen los criterios tanto de la cetoacidosis

35
00:02:45,280 --> 00:02:47,280
como del síndrome hiperglicémico-hiperosmolar.

36
00:02:47,280 --> 00:02:51,280
Y como otra cosa importante, ambas suelen venir con algún descompensante,

37
00:02:51,280 --> 00:02:55,280
ejemplo una infección severa o alguna cosa así, que per se puede venir

38
00:02:55,280 --> 00:02:59,280
con el compromiso de conciencia, con el compromiso hemodinámico,

39
00:02:59,280 --> 00:03:05,280
así que hay que tener harto cuidado de no confundir la causa con la consecuencia.

40
00:03:05,280 --> 00:03:09,280
Ejemplo, el accidente vascular puede generarme también un síndrome

41
00:03:09,280 --> 00:03:13,280
hiperglicémico-hiperosmolar, así que aunque tenga el síndrome hiperglicémico-hiperosmolar

42
00:03:13,280 --> 00:03:17,280
no puedo descartar el accidente vascular hasta que no haya pedido las imágenes

43
00:03:17,280 --> 00:03:19,280
y haber hecho el manejo completo.

44
00:03:19,280 --> 00:03:23,280
Siguiendo con esto, veamos los criterios diagnósticos que afortunadamente

45
00:03:23,280 --> 00:03:27,280
son muy sencillos porque son iguales al nombre de la cetoacidosis diabética

46
00:03:27,280 --> 00:03:30,280
y del síndrome hiperglicémico-hiperosmolar.

47
00:03:30,280 --> 00:03:35,280
La parte ceto es que tenga cuerpos cetónicos que estén elevados

48
00:03:35,280 --> 00:03:39,280
ya sea en sangre o en orina, habitualmente se miden en ambas partes

49
00:03:39,280 --> 00:03:43,280
pero basta con que yo lo mida en una parte y que identifique esta cetonemia

50
00:03:43,280 --> 00:03:45,280
como para ya cumplir con ese criterio.

51
00:03:45,280 --> 00:03:51,280
En segundo lugar, que venga con acidosis y aquí sí no puede ser cualquier tipo de acidosis,

52
00:03:51,280 --> 00:03:56,280
tiene que ser una acidosis importante con un pH menor a 7,3

53
00:03:56,280 --> 00:03:59,280
de tipo metabólica, dígase con el bicarbonato bajo,

54
00:03:59,280 --> 00:04:04,280
abajo de 15 y en algunas partes sale abajo de 18 mil equivalentes por litro

55
00:04:04,280 --> 00:04:10,280
y con un anion gap que esté aumentado en el sentido en que las acidosis metabólicas

56
00:04:10,280 --> 00:04:13,280
con anion gap normal habitualmente son por otras causas como por ejemplo

57
00:04:13,280 --> 00:04:17,280
diarrea, por falla renal, por ese tipo de cosas, pero en este caso

58
00:04:17,280 --> 00:04:22,280
como es por un ácido orgánico distinto, los cetoacidos, en ese caso

59
00:04:22,280 --> 00:04:26,280
el anion gap aumenta. Acuérdense que el anion gap habitualmente refleja

60
00:04:26,280 --> 00:04:33,280
la presencia de otro ácido orgánico, ejemplo acidosis láctica, acidosis alcohólica,

61
00:04:33,280 --> 00:04:38,280
la cetoacidosis diabética, etc. Y finalmente la parte diabética

62
00:04:38,280 --> 00:04:43,280
que es que tenga una glicemia arriba de 250, aunque en algunos lugares

63
00:04:43,280 --> 00:04:47,280
aparece arriba de 200 y de hecho en pediatría el corte habitualmente

64
00:04:47,280 --> 00:04:50,280
es arriba de 200, pero en resumen que haya cuerpos cetónicos,

65
00:04:50,280 --> 00:04:53,280
que haya una acidosis metabólica con anion gap aumentado

66
00:04:53,280 --> 00:04:58,280
arriba de 12 o al menos arriba de 10 y finalmente que venga con hiperglicemia

67
00:04:58,280 --> 00:05:02,280
arriba de 200 que es lo característico de la diabetes. En el caso del síndrome

68
00:05:02,280 --> 00:05:06,280
hiperglicémico-hiperosmolar debe ser hiperglicémico con una glicemia

69
00:05:06,280 --> 00:05:11,280
arriba de 600 y segundo lugar debe ser hiperosmolar con una

70
00:05:11,280 --> 00:05:15,280
osmolaridad plasmática arriba de 320 miliosmoles por litro.

71
00:05:15,280 --> 00:05:19,280
Ahora, algo importante es que habitualmente si tengo una glicemia

72
00:05:19,280 --> 00:05:24,280
arriba de 600 tengo una hiperosmolaridad de ese tipo, así que con que uno vea

73
00:05:24,280 --> 00:05:29,280
la glicemia así de alta ya me puedo ahorrar eventualmente el calcular

74
00:05:29,280 --> 00:05:34,280
la osmolaridad plasmática. Recuerden que hay cuadros mixtos que

75
00:05:34,280 --> 00:05:39,280
algunas veces son incompletos para una o bien a veces son concordantes

76
00:05:39,280 --> 00:05:43,280
con ambos, pero eso no importa mucho porque el manejo es el mismo

77
00:05:43,280 --> 00:05:47,280
o casi el mismo que lo vamos a ver en su respectivo video.

78
00:05:47,280 --> 00:05:52,280
Ahora, un pequeño recordatorio de fisiotatología antes de terminar

79
00:05:52,280 --> 00:05:56,280
este video. Número uno, los cuerpos cetónicos que hay que saber son dos.

80
00:05:56,280 --> 00:06:01,280
Uno es el ácido acetoacético o el acetoacetato y en segundo lugar

81
00:06:01,280 --> 00:06:06,280
el ácido hidroxibutírico o hidroxibutirato. Esos son, lo ideal

82
00:06:06,280 --> 00:06:10,280
es medir los dos en el sentido en que hay algunos cuadros de

83
00:06:10,280 --> 00:06:14,280
cetoacidosis que elevan mucho más uno que el otro y si es que yo solamente

84
00:06:14,280 --> 00:06:17,280
he medido uno eventualmente puedo tener un falso negativo.

85
00:06:17,280 --> 00:06:21,280
Segundo lugar, la osmolaridad plasmática se calculaba con esa fórmula que está ahí

86
00:06:21,280 --> 00:06:26,280
2 multiplicado por el sodio más la glicemia dividido por 18

87
00:06:26,280 --> 00:06:31,280
y eso era porque el peso molecular de la glucosa es 180

88
00:06:31,280 --> 00:06:35,280
así que como para llevarlo a los mil osmoles por litro se divide por 18

89
00:06:35,280 --> 00:06:39,280
más el boom dividido por 2,8 porque el peso molecular de la urea

90
00:06:39,280 --> 00:06:44,280
era 28. Ahora no importa tanto eso, la fórmula esa aprendásela de memoria

91
00:06:44,280 --> 00:06:48,280
pero lo importante es que la osmolaridad plasmática efectiva

92
00:06:48,280 --> 00:06:52,280
que es la que me interesa y la que yo tengo que calcular en este caso

93
00:06:52,280 --> 00:06:56,280
no toma en cuenta la urea en el sentido en que la urea

94
00:06:56,280 --> 00:07:00,280
es un componente apolar que pasa muy fácil la barrera celular

95
00:07:00,280 --> 00:07:04,280
la membrana celular así que cuando sube mucho simplemente se va

96
00:07:04,280 --> 00:07:08,280
hacia dentro de las células y se estabiliza la osmolaridad en ambos lados.

97
00:07:08,280 --> 00:07:12,280
En cambio el sodio y los electrolitos que lo acompañan como el cloro

98
00:07:12,280 --> 00:07:16,280
y el bicarbonato y la glicemia tienen más dificultades

99
00:07:16,280 --> 00:07:20,280
para entrar y salir de las células y eso hace que determinen la osmolaridad

100
00:07:20,280 --> 00:07:24,280
efectiva. Así que ya saben en el síndrome hiperglicémico

101
00:07:24,280 --> 00:07:28,280
hiperosmolar tiene que ser mayor a 320 pero calculada de esa forma

102
00:07:28,280 --> 00:07:32,280
solamente 2 por el sodio más la glicemia dividido por 18

103
00:07:32,280 --> 00:07:36,280
recordándonos que si estaba arriba de 600 lo más probable es que estuviera

104
00:07:36,280 --> 00:07:40,280
con la hiperosmolaridad igual. Finalmente el anion gap

105
00:07:40,280 --> 00:07:44,280
como se calculaba esto? Se calculaba con el sodio menos el cloro

106
00:07:44,280 --> 00:07:48,280
menos el bicarbonato en el sentido en que el sodio es el principal

107
00:07:48,280 --> 00:07:52,280
cation o ion positivo en cambio el cloro y el bicarbonato

108
00:07:52,280 --> 00:07:56,280
son los dos principales aniones digamos

109
00:07:56,280 --> 00:08:00,280
los iones negativos y obviamente la diferencia entre el sodio

110
00:08:00,280 --> 00:08:04,280
y los otros dos aniones va a ser el anion gap que va a estar ocupada por

111
00:08:04,280 --> 00:08:08,280
otros ácidos por otros aniones que obviamente cuando hay presencia

112
00:08:08,280 --> 00:08:12,280
de algún ácido orgánico esto aumenta y se aumenta el gap

113
00:08:12,280 --> 00:08:16,280
así que aumenta el anion gap en estas acidosis causadas

114
00:08:16,280 --> 00:08:20,280
por ácidos orgánicos en general. Y bueno así que acuérdense

115
00:08:20,280 --> 00:08:24,280
la fisioterapia es algo que se puede olvidar pero hay que

116
00:08:24,280 --> 00:08:28,280
recordarla aunque sea un poquito y vamos a ver en el siguiente video el manejo

117
00:08:28,280 --> 00:08:32,280
específico de estas dos complicaciones del acetoacidosis y del síndrome hiperglicémico

118
00:08:32,280 --> 00:08:34,280
que nos vemos.',
    'En esta cápsula analizaremos las dos grandes emergencias hiperglicémicas de la diabetes: la cetoacidosis diabética y el síndrome hiperglicémico hiperosmolar, conocidos popularmente como "coma diabético". Deben saber que el término coma diabético abarca también la hipoglicemia severa, así que no confundan ambos conceptos.

Lo primero que deben establecer es en qué tipo de diabetes aparece cada cuadro con mayor frecuencia. La cetoacidosis diabética es característica de la diabetes tipo 1, ya que su fisiopatología central es la ausencia de insulina. El síndrome hiperglicémico hiperosmolar, en cambio, es propio de la diabetes tipo 2.

Analicemos la presentación clínica de cada uno. La cetoacidosis debuta frecuentemente con síntomas gastrointestinales: dolor abdominal, náuseas y vómitos. Es una causa reconocida de abdomen agudo de origen metabólico, por lo que ante un paciente joven con dolor abdominal agudo, hipotensión y un cuadro clínico atípico, siempre hay que tener en mente esta posibilidad. Dos signos muy característicos de la cetoacidosis son el aliento cetónico, descrito como olor a manzana, y la respiración de Kussmaul, una respiración lenta, profunda y regular que representa la compensación respiratoria de la acidosis metabólica: el organismo intenta eliminar CO2 para subir el pH sanguíneo. También puede haber compromiso de conciencia y, de manera casi universal, una deshidratación significativa.',
    '["Cetoacidosis diabética: más frecuente en DM tipo 1. Clínica: dolor abdominal, vómitos, aliento cetónico, respiración de Kussmaul, deshidratación.","Síndrome hiperglicémico hiperosmolar (HGHO): más frecuente en DM tipo 2. Clínica: compromiso neurológico (confusión, coma, signos focales), deshidratación severa.","Diagnóstico CAD: cetonemia/cetonuria + pH menor a 7,3 + bicarbonato bajo + anión gap mayor a 12 + glicemia mayor a 250 mg/dL.","Diagnóstico HGHO: glicemia mayor a 600 mg/dL + osmolaridad efectiva mayor a 320 mOsm/L (fórmula: 2xNa + Glicemia/18).","Ambos cuadros se desencadenan por causas precipitantes (infecciones, infartos, AVE). Siempre buscar y tratar la causa subyacente."]'::jsonb,
    '[{"para":"\"CAD = CETO + ACIDO + DIABÉTICA\"","nemotecnia":"\"CAD = CETO + ACIDO + DIABÉTICA\"","explicacion":"- Cuerpos cetónicos elevados (acetoacetato + hidroxibutirato)\n- Cuerpos cetónicos elevados (acetoacetato + hidroxibutirato)\n- Acidosis metabólica: pH < 7,3 + bicarbonato bajo + anión gap > 12\n- Diabética: glicemia > 250 mg/dL"},{"para":"\"HGHO = HIPERGLIC (>600) + HIPEROSMOLAR (>320)\"","nemotecnia":"\"HGHO = HIPERGLIC (>600) + HIPEROSMOLAR (>320)\"","explicacion":"Glicemia mayor a 600 + osmolaridad efectiva mayor a 320. Si la glicemia supera 600, casi con seguridad la osmolaridad ya está alta. La fórmula: 2 x Na + (Glicemia ÷ 18).Glicemia mayor a 600 + osmolaridad efectiva mayor a 320. Si la glicemia supera 600, casi con seguridad la osmolaridad ya está alta. La fórmula: 2 x Na + (Glicemia ÷ 18)."},{"para":"\"KUSSMAUL quema CO2 para subir el pH\"","nemotecnia":"\"KUSSMAUL quema CO2 para subir el pH\"","explicacion":"Respiración profunda y lenta = el pulmón compensa la acidosis metabólica expirando más CO2. Si hay Kussmaul, hay cetoacidosis.Respiración profunda y lenta = el pulmón compensa la acidosis metabólica expirando más CO2. Si hay Kussmaul, hay cetoacidosis."}]'::jsonb,
    '["Cetoacidosis diabética: más frecuente en DM tipo 1. Clínica: dolor abdominal, vómitos, aliento cetónico, respiración de Kussmaul, deshidratación.","Síndrome hiperglicémico hiperosmolar (HGHO): más frecuente en DM tipo 2. Clínica: compromiso neurológico (confusión, coma, signos focales), deshidratación severa.","Diagnóstico CAD: cetonemia/cetonuria + pH menor a 7,3 + bicarbonato bajo + anión gap mayor a 12 + glicemia mayor a 250 mg/dL."]'::jsonb,
    '[]'::jsonb,
    '[{"pregunta":"¿Cuál de las siguientes afirmaciones diferencia correctamente la cetoacidosis diabética del síndrome hiperglicémico hiperosmolar?","respuesta":"Respuesta correcta: B — El HGHO se define por hiperglicemia mayor a 600 y osmolaridad efectiva mayor a 320, sin necesidad de acidosis ni cetonemia significativas. La cetoacidosis es de la DM tipo 1 (no tipo 2); la respiración de Kussmaul es de la cetoacidosis (no del HGHO); el anión gap en cetoacidosis está aumentado (no disminuido); y los cuerpos cetónicos son un criterio definitorio de la cetoacidosis."}]'::jsonb,
    NOW(),
    TRUE,
    FALSE  -- first 3 free preview
  ) ON CONFLICT (specialty_id, order_index)
  DO UPDATE SET
    title            = EXCLUDED.title,
    duration_seconds = EXCLUDED.duration_seconds,
    txt_content      = EXCLUDED.txt_content,
    srt_content      = EXCLUDED.srt_content,
    ai_summary       = EXCLUDED.ai_summary,
    ai_key_concepts  = EXCLUDED.ai_key_concepts,
    ai_mnemonics     = EXCLUDED.ai_mnemonics,
    ai_high_yield    = EXCLUDED.ai_high_yield,
    ai_review_qs     = EXCLUDED.ai_review_qs,
    ai_processed_at  = NOW(),
    is_available     = TRUE;

  -- Cápsula 19: Tratamiento de la Cetoacidosis Diabética y el Síndrome Hiperglicémico Hiperosmolar
  INSERT INTO lessons (
    specialty_id, title, order_index, duration_seconds,
    txt_content, srt_content,
    ai_summary, ai_key_concepts, ai_mnemonics,
    ai_high_yield, ai_algorithms, ai_review_qs,
    ai_processed_at, is_available, is_free_preview
  ) VALUES (
    v_specialty_id,
    'Tratamiento de la Cetoacidosis Diabética y el Síndrome Hiperglicémico Hiperosmolar',
    19,
    486,
    'Hola, hola, ¿cómo están? Veamos el tratamiento del acetoacidosis y del síndrome hiperlisémico-hiperhomolar

que les adelanto que en ambos es prácticamente igual, tiene unas poquitas diferencias,

pero en ambos casos se basa en cuatro pilares.

Número uno, dar suero fisiológico, reponer la bolemia, acuérdense que están muy deshidratados.

Número dos, la insulina, aquí le falta mucha insulina en ambos casos.

Número tres, el potasio, y ahí va con un asterisco porque es fundamental.

Si a mí se me olvida esto, si lo hago mal, puedo matar al paciente, así que mucho cuidado.

Y número cuatro, el bicarbonato, que vamos a ver que se deja en muy escasas ocasiones,

y solamente el acetoacidosis, pero que va dentro de los pilares igual.

Ahora, el suero fisiológico, harto suero, abundante y rápido.

Dígase, varios bolos de un litro o de 20cc por kilo, a pasar, tan rápido como pueda pasar,

hasta que se recupere el estado hemodinámico, hasta que se recupere la hipotensión arterial

o la taquicardia, el shock hipoblemico en el que se encuentra.

Ahora, luego eso puede cambiar un poco a medida que voy haciendo los distintos exámenes,

pero por el general, al menos se pasa un bolo rápido al principio y luego un bolo más por hora.

Así, 20cc por kilo por hora, y voy controlando en la medida de lo posible

con medición invasiva, así con un catéter venoso central,

o si no, al menos con la clínica.

Respecto a la insulina, se usa insulina cristalina, esa es la de elección,

y habitualmente se deja o 10 unidades, o bien, un poquito más preciso es dejar 0,1cc por kilo de peso,

eso es muy importante en los niños, pero aplique también a los adultos,

y lo más frecuente es que se deje un bolo, y luego queda con un goteo de la misma dosis,

de 0,1cc por kilo, que va a ir pasando cada hora,

y obviamente voy a ir ajustándolo luego a medida que voy recibiendo las glicemias de vuelta.

El potasio, hay que saber en primer lugar el rango normal,

y el rango normal para estos efectos es desde 3,3 hasta 5,3 mil equivalentes por litro,

y que quede bien claro, hay que saberlo, y hay que diferenciarlo del rango normal

en otros exámenes, el que sale que es desde 3,5 hasta 5,0

para efectos de la cetoacidosis y del síntrome hiperglicémico es desde 3,3 hasta 5,3,

si es que está por sobre 5,3, ejemplo 5,4, en ese caso no le doy potasio porque ya tiene suficiente,

y si le doy más eventualmente le puedo desencadenar una arritmia, así que nada más.

Si es que está normal, debo darle por dos razones, una porque el potasio total de este paciente está disminuido,

y segundo lugar porque la insulina baja la calemia, y eventualmente si es que le doy insulina sin darle potasio,

puede ser que haga una hipocalemia y me va a hacer una arritmia también, una torsión de punta y se va a morir.

Finalmente si es que está bajo, si es que está menor a 3,3, ejemplo 3, 2,9 o 3,2,

en ese caso le doy una dosis un poquito más alta del potasio, 2 a 3 gramos de KCl,

y en este caso está absolutamente contraindicada la insulina ya que de lo contrario se puede morir,

así que dos cosas importantes acá, número uno, el potasio siempre va en goteo,

el paciente le pasa un bolo de potasio endovenoso a un paciente, el paciente se muere ahí mismo y me hace un paro en asistolía,

así que acuérdense de que se inyecta en la bolsa de suero y no en la vía venosa directamente, harto cuidado.

Segundo lugar, yo no puedo darle ni insulina ni potasio hasta que no me haya llegado el resultado de los exámenes en específico,

hasta que no me haya llegado el resultado del potasio, porque si es que está alto no le doy potasio,

y si está bajo no le doy insulina y si lo hago mal eventualmente el paciente se puede morir, así que mucho cuidado con eso también.

Ahora, ¿qué es lo que sí le puedo dar desde el momento inicial sin tener ningún examen más que el hemogluco test?

Pues el suero fisiológico, ese va de entrada, hay que darlo y es como lo más urgente.

Ahora, el bicarbonato solamente se da cuando el pH está menor a 6,9, o sea cuando hay un acetoacidosis muy severa,

se define como severa con un pH menor a 7, así que en la práctica es raro que se dé el bicarbonato en la acetoacidosis

y habitualmente nunca se da en el síndrome hipelicémico hiperosmolar, así que hay una pequeña diferencia.

Lo que sí, hay que acordarse que la forma en que se da el bicarbonato puede ser ya sea con las ampollas de bicarbonato

que van directamente al suero o ya sea con un matras aparte que suele venir al 2 tercio molar 250cc en goteo

que esos son más o menos 160 o un poquito más de 150 mil equivalentes.

Finalmente, hay que hacer el tratamiento de la causa.

Acuérdense que tanto la acetoacidosis como el síndrome hipelicémico habitualmente son descompensaciones

por alguna otra enfermedad, en particular las infecciones, esas son la primera causa en ambas.

En un niño diabético mal manejado que se infecta con una neumonía, por ejemplo,

es muy frecuente que se desencadena una acetoacidosis

y lo mismo ocurre en los adultos mayores, por ejemplo, con el síndrome hipelicémico.

También un mal tratamiento, ya sea que lo abandonó o que no lo sigue bien, esa es la segunda causa

y finalmente es muy frecuente que se vea también en el debut de la diabetes.

Así no tenía idea que tenía diabetes hasta que llegó con un coma diabético a la urgencia.

Como cosa final, el infarto, el accidente vascular encefálico, etcétera,

así que no basta con hacer el manejo completo que hay que hacerlo,

aparte tengo que ir a pedirle un electrocardiograma, eventualmente un TAC de cerebro,

si es que viene con signos focales, etcétera.

O sea, es importante aquí actuar en busca de la causa para manejarla también.

Algunos detalles que son importantes en este manejo, si es que viene con hipernatremia o con hiponatremia

hay que hacer eventualmente algunos ajustes.

Si viene con hipernatremia, en primer lugar voy a manejar la volemia con suero fisiológico,

aunque el suero fisiológico me aumente la natremia, mientras venga hipovolémico,

la prioridad es la volemia, así que le doy igual nomás,

y luego de que la volemia ya se estabiliza, que la frecuencia cardiaca

y que la presión arterial está más o menos bien, en ese caso me voy a un suero no isotónico,

sino que hipotónico, que es el suero al medio que se llama, que es el NACL,

pero no al 0,9, sino que al 0,45%.

Y en el caso de que haya una hiponatremia, pues ahí le doy suero fisiológico sin miedo,

en el sentido en que tiende a elevar la natremia.

Cuando la glicemia no baja, a pesar de que estoy con la insulina, con el bolo y con el goteo,

y en una hora no me baja mínimo 50 milígramos por decilitro,

en ese caso yo digo, sabes qué, voy a duplicar la dosis de insulina,

y en vez de 0,1 milígramos por kilo, le voy a dar 0,2 milígramos por kilo en este siguiente goteo,

y ahí voy controlando y eventualmente la bajo después.

Lo otro, cuando al fin la glicemia baja de 200 y deja de cumplir el criterio

por ejemplo, en ese caso ya no le sigo dando el suero fisiológico,

sino que me cambio al suero glucosalino,

que habitualmente es como mitad de suero glucosado más mitad de suero fisiológico,

y ahí queda suero glucosalino, que se puede llamar también suero de NACL al 0,45%,

más suero glucosado al 2,5%.

Finalmente, los electronitos plasmáticos, la glicemia,

los gases venosos para ver el pH y el nitrógeno ureico como para ver la función renal,

se piden cada dos horas, o sea, no basta con manejarlo,

sino que tengo que estar ahí al lado de ese paciente que se me puede descompensar

en cualquier momento y hay que manejarlo así muy muy activamente.

Como última cosa, hay que pedir todos los exámenes en busca de la causa,

en el sentido en que ya sabemos el manejar el descompensante

es uno de los pilares fundamentales del manejo de estas complicaciones.

Y dentro de eso, hemograma y la proteína C reactiva en búsqueda de infecciones,

y obviamente electrocardiograma, etcétera.

Y bueno, eso fue todo, que estén bien.',
    '1
00:00:03,250 --> 00:00:08,450
Hola, hola, ¿cómo están? Veamos el tratamiento del acetoacidosis y del síndrome hiperlisémico-hiperhomolar

2
00:00:08,450 --> 00:00:12,150
que les adelanto que en ambos es prácticamente igual, tiene unas poquitas diferencias,

3
00:00:12,150 --> 00:00:15,250
pero en ambos casos se basa en cuatro pilares.

4
00:00:15,250 --> 00:00:20,050
Número uno, dar suero fisiológico, reponer la bolemia, acuérdense que están muy deshidratados.

5
00:00:20,050 --> 00:00:23,650
Número dos, la insulina, aquí le falta mucha insulina en ambos casos.

6
00:00:23,650 --> 00:00:27,950
Número tres, el potasio, y ahí va con un asterisco porque es fundamental.

7
00:00:27,950 --> 00:00:32,850
Si a mí se me olvida esto, si lo hago mal, puedo matar al paciente, así que mucho cuidado.

8
00:00:32,950 --> 00:00:39,250
Y número cuatro, el bicarbonato, que vamos a ver que se deja en muy escasas ocasiones,

9
00:00:39,250 --> 00:00:43,050
y solamente el acetoacidosis, pero que va dentro de los pilares igual.

10
00:00:43,050 --> 00:00:47,250
Ahora, el suero fisiológico, harto suero, abundante y rápido.

11
00:00:47,250 --> 00:00:52,850
Dígase, varios bolos de un litro o de 20cc por kilo, a pasar, tan rápido como pueda pasar,

12
00:00:52,850 --> 00:00:57,550
hasta que se recupere el estado hemodinámico, hasta que se recupere la hipotensión arterial

13
00:00:57,650 --> 00:01:03,150
o la taquicardia, el shock hipoblemico en el que se encuentra.

14
00:01:03,150 --> 00:01:08,350
Ahora, luego eso puede cambiar un poco a medida que voy haciendo los distintos exámenes,

15
00:01:08,350 --> 00:01:14,150
pero por el general, al menos se pasa un bolo rápido al principio y luego un bolo más por hora.

16
00:01:14,150 --> 00:01:20,850
Así, 20cc por kilo por hora, y voy controlando en la medida de lo posible

17
00:01:20,850 --> 00:01:24,350
con medición invasiva, así con un catéter venoso central,

18
00:01:24,950 --> 00:01:27,550
o si no, al menos con la clínica.

19
00:01:27,550 --> 00:01:32,550
Respecto a la insulina, se usa insulina cristalina, esa es la de elección,

20
00:01:32,550 --> 00:01:39,550
y habitualmente se deja o 10 unidades, o bien, un poquito más preciso es dejar 0,1cc por kilo de peso,

21
00:01:39,550 --> 00:01:43,550
eso es muy importante en los niños, pero aplique también a los adultos,

22
00:01:43,550 --> 00:01:47,550
y lo más frecuente es que se deje un bolo, y luego queda con un goteo de la misma dosis,

23
00:01:47,550 --> 00:01:51,550
de 0,1cc por kilo, que va a ir pasando cada hora,

24
00:01:51,750 --> 00:01:56,750
y obviamente voy a ir ajustándolo luego a medida que voy recibiendo las glicemias de vuelta.

25
00:01:56,750 --> 00:02:00,550
El potasio, hay que saber en primer lugar el rango normal,

26
00:02:00,550 --> 00:02:06,750
y el rango normal para estos efectos es desde 3,3 hasta 5,3 mil equivalentes por litro,

27
00:02:06,750 --> 00:02:10,950
y que quede bien claro, hay que saberlo, y hay que diferenciarlo del rango normal

28
00:02:10,950 --> 00:02:16,150
en otros exámenes, el que sale que es desde 3,5 hasta 5,0

29
00:02:16,150 --> 00:02:22,150
para efectos de la cetoacidosis y del síntrome hiperglicémico es desde 3,3 hasta 5,3,

30
00:02:22,150 --> 00:02:28,150
si es que está por sobre 5,3, ejemplo 5,4, en ese caso no le doy potasio porque ya tiene suficiente,

31
00:02:28,150 --> 00:02:33,150
y si le doy más eventualmente le puedo desencadenar una arritmia, así que nada más.

32
00:02:33,150 --> 00:02:39,150
Si es que está normal, debo darle por dos razones, una porque el potasio total de este paciente está disminuido,

33
00:02:39,150 --> 00:02:45,150
y segundo lugar porque la insulina baja la calemia, y eventualmente si es que le doy insulina sin darle potasio,

34
00:02:45,150 --> 00:02:50,150
puede ser que haga una hipocalemia y me va a hacer una arritmia también, una torsión de punta y se va a morir.

35
00:02:50,150 --> 00:02:56,150
Finalmente si es que está bajo, si es que está menor a 3,3, ejemplo 3, 2,9 o 3,2,

36
00:02:56,150 --> 00:03:02,150
en ese caso le doy una dosis un poquito más alta del potasio, 2 a 3 gramos de KCl,

37
00:03:02,150 --> 00:03:06,150
y en este caso está absolutamente contraindicada la insulina ya que de lo contrario se puede morir,

38
00:03:06,150 --> 00:03:12,150
así que dos cosas importantes acá, número uno, el potasio siempre va en goteo,

39
00:03:12,150 --> 00:03:18,150
el paciente le pasa un bolo de potasio endovenoso a un paciente, el paciente se muere ahí mismo y me hace un paro en asistolía,

40
00:03:18,150 --> 00:03:25,150
así que acuérdense de que se inyecta en la bolsa de suero y no en la vía venosa directamente, harto cuidado.

41
00:03:25,150 --> 00:03:33,150
Segundo lugar, yo no puedo darle ni insulina ni potasio hasta que no me haya llegado el resultado de los exámenes en específico,

42
00:03:33,150 --> 00:03:38,150
hasta que no me haya llegado el resultado del potasio, porque si es que está alto no le doy potasio,

43
00:03:38,150 --> 00:03:44,150
y si está bajo no le doy insulina y si lo hago mal eventualmente el paciente se puede morir, así que mucho cuidado con eso también.

44
00:03:44,150 --> 00:03:49,150
Ahora, ¿qué es lo que sí le puedo dar desde el momento inicial sin tener ningún examen más que el hemogluco test?

45
00:03:49,150 --> 00:03:55,150
Pues el suero fisiológico, ese va de entrada, hay que darlo y es como lo más urgente.

46
00:03:55,150 --> 00:04:03,150
Ahora, el bicarbonato solamente se da cuando el pH está menor a 6,9, o sea cuando hay un acetoacidosis muy severa,

47
00:04:04,150 --> 00:04:12,150
se define como severa con un pH menor a 7, así que en la práctica es raro que se dé el bicarbonato en la acetoacidosis

48
00:04:12,150 --> 00:04:17,150
y habitualmente nunca se da en el síndrome hipelicémico hiperosmolar, así que hay una pequeña diferencia.

49
00:04:17,150 --> 00:04:25,150
Lo que sí, hay que acordarse que la forma en que se da el bicarbonato puede ser ya sea con las ampollas de bicarbonato

50
00:04:25,150 --> 00:04:33,150
que van directamente al suero o ya sea con un matras aparte que suele venir al 2 tercio molar 250cc en goteo

51
00:04:33,150 --> 00:04:38,150
que esos son más o menos 160 o un poquito más de 150 mil equivalentes.

52
00:04:38,150 --> 00:04:42,150
Finalmente, hay que hacer el tratamiento de la causa.

53
00:04:42,150 --> 00:04:47,150
Acuérdense que tanto la acetoacidosis como el síndrome hipelicémico habitualmente son descompensaciones

54
00:04:47,150 --> 00:04:54,150
por alguna otra enfermedad, en particular las infecciones, esas son la primera causa en ambas.

55
00:04:54,150 --> 00:05:00,150
En un niño diabético mal manejado que se infecta con una neumonía, por ejemplo,

56
00:05:00,150 --> 00:05:05,150
es muy frecuente que se desencadena una acetoacidosis

57
00:05:05,150 --> 00:05:09,150
y lo mismo ocurre en los adultos mayores, por ejemplo, con el síndrome hipelicémico.

58
00:05:09,150 --> 00:05:16,150
También un mal tratamiento, ya sea que lo abandonó o que no lo sigue bien, esa es la segunda causa

59
00:05:16,150 --> 00:05:20,150
y finalmente es muy frecuente que se vea también en el debut de la diabetes.

60
00:05:20,150 --> 00:05:25,150
Así no tenía idea que tenía diabetes hasta que llegó con un coma diabético a la urgencia.

61
00:05:25,150 --> 00:05:31,150
Como cosa final, el infarto, el accidente vascular encefálico, etcétera,

62
00:05:31,150 --> 00:05:34,150
así que no basta con hacer el manejo completo que hay que hacerlo,

63
00:05:34,150 --> 00:05:39,150
aparte tengo que ir a pedirle un electrocardiograma, eventualmente un TAC de cerebro,

64
00:05:39,150 --> 00:05:41,150
si es que viene con signos focales, etcétera.

65
00:05:41,150 --> 00:05:45,150
O sea, es importante aquí actuar en busca de la causa para manejarla también.

66
00:05:45,150 --> 00:05:52,150
Algunos detalles que son importantes en este manejo, si es que viene con hipernatremia o con hiponatremia

67
00:05:52,150 --> 00:05:56,150
hay que hacer eventualmente algunos ajustes.

68
00:05:56,150 --> 00:06:02,150
Si viene con hipernatremia, en primer lugar voy a manejar la volemia con suero fisiológico,

69
00:06:02,150 --> 00:06:06,150
aunque el suero fisiológico me aumente la natremia, mientras venga hipovolémico,

70
00:06:06,150 --> 00:06:09,150
la prioridad es la volemia, así que le doy igual nomás,

71
00:06:09,150 --> 00:06:13,150
y luego de que la volemia ya se estabiliza, que la frecuencia cardiaca

72
00:06:13,150 --> 00:06:19,150
y que la presión arterial está más o menos bien, en ese caso me voy a un suero no isotónico,

73
00:06:19,150 --> 00:06:24,150
sino que hipotónico, que es el suero al medio que se llama, que es el NACL,

74
00:06:24,150 --> 00:06:27,150
pero no al 0,9, sino que al 0,45%.

75
00:06:27,150 --> 00:06:31,150
Y en el caso de que haya una hiponatremia, pues ahí le doy suero fisiológico sin miedo,

76
00:06:31,150 --> 00:06:34,150
en el sentido en que tiende a elevar la natremia.

77
00:06:34,150 --> 00:06:40,150
Cuando la glicemia no baja, a pesar de que estoy con la insulina, con el bolo y con el goteo,

78
00:06:40,150 --> 00:06:45,150
y en una hora no me baja mínimo 50 milígramos por decilitro,

79
00:06:45,150 --> 00:06:49,150
en ese caso yo digo, sabes qué, voy a duplicar la dosis de insulina,

80
00:06:49,150 --> 00:06:55,150
y en vez de 0,1 milígramos por kilo, le voy a dar 0,2 milígramos por kilo en este siguiente goteo,

81
00:06:55,150 --> 00:06:59,150
y ahí voy controlando y eventualmente la bajo después.

82
00:06:59,150 --> 00:07:04,150
Lo otro, cuando al fin la glicemia baja de 200 y deja de cumplir el criterio

83
00:07:05,150 --> 00:07:11,150
por ejemplo, en ese caso ya no le sigo dando el suero fisiológico,

84
00:07:11,150 --> 00:07:13,150
sino que me cambio al suero glucosalino,

85
00:07:13,150 --> 00:07:17,150
que habitualmente es como mitad de suero glucosado más mitad de suero fisiológico,

86
00:07:17,150 --> 00:07:23,150
y ahí queda suero glucosalino, que se puede llamar también suero de NACL al 0,45%,

87
00:07:23,150 --> 00:07:27,150
más suero glucosado al 2,5%.

88
00:07:27,150 --> 00:07:31,150
Finalmente, los electronitos plasmáticos, la glicemia,

89
00:07:31,150 --> 00:07:36,150
los gases venosos para ver el pH y el nitrógeno ureico como para ver la función renal,

90
00:07:36,150 --> 00:07:40,150
se piden cada dos horas, o sea, no basta con manejarlo,

91
00:07:40,150 --> 00:07:45,150
sino que tengo que estar ahí al lado de ese paciente que se me puede descompensar

92
00:07:45,150 --> 00:07:48,150
en cualquier momento y hay que manejarlo así muy muy activamente.

93
00:07:48,150 --> 00:07:52,150
Como última cosa, hay que pedir todos los exámenes en busca de la causa,

94
00:07:52,150 --> 00:07:56,150
en el sentido en que ya sabemos el manejar el descompensante

95
00:07:56,150 --> 00:07:59,150
es uno de los pilares fundamentales del manejo de estas complicaciones.

96
00:07:59,150 --> 00:08:04,150
Y dentro de eso, hemograma y la proteína C reactiva en búsqueda de infecciones,

97
00:08:04,150 --> 00:08:06,150
y obviamente electrocardiograma, etcétera.

98
00:08:06,150 --> 00:08:08,150
Y bueno, eso fue todo, que estén bien.',
    'En esta cápsula veremos el tratamiento de las dos grandes emergencias hiperglicémicas de la diabetes: la cetoacidosis y el síndrome hiperglicémico hiperosmolar. Les adelanto que el manejo de ambas es prácticamente idéntico y se sostiene sobre cuatro pilares fundamentales. El dominio de estos cuatro pilares, y en especial sus matices, es lo que marca la diferencia entre un manejo correcto y uno que puede costarle la vida al paciente.

El primer pilar es la reposición de volumen con suero fisiológico. Recuerden que estos pacientes llegan gravemente deshidratados. El suero fisiológico se administra rápido y en volúmenes generosos: bolos de un litro o de 20 mL por kilogramo de peso, tan rápido como sea posible, hasta recuperar el estado hemodinámico, normalizar la frecuencia cardíaca y la presión arterial. Luego, el ritmo de infusión se mantiene en torno a 20 mL por kilo por hora, con monitorización que idealmente incluye un catéter venoso central, o al menos la evaluación clínica frecuente.

El segundo pilar es la insulina. Se utiliza insulina cristalina, que es la de acción rápida. La dosis habitual es 0,1 unidades por kilo de peso, administrada inicialmente en bolo, seguida de un goteo continuo a la misma dosis por hora. Esta dosis se ajusta según las glicemias que se van obteniendo. Si en la primera hora la glicemia no baja al menos 50 miligramos por decilitro, se duplica la dosis a 0,2 unidades por kilo por hora.',
    '["Cuatro pilares del tratamiento: suero fisiológico (volumen), insulina cristalina, potasio y bicarbonato (solo en CAD severa con pH menor a 6,9).","Potasio: no administrar si mayor a 5,3. Reponer si está en rango normal (3,3-5,3). Si está bajo 3,3: reponer potasio primero y NO iniciar insulina.","El potasio siempre en goteo, nunca en bolo directo. Esperar resultado del potasio plasmático antes de dar insulina o potasio.","Lo único que se da desde el primer momento sin esperar exámenes es el suero fisiológico. Cuando glicemia baja de 200, cambiar a suero glucosalino.","Siempre buscar y tratar la causa precipitante: infección (la más frecuente), abandono del tratamiento, debut diabético, infarto, AVE."]'::jsonb,
    '[{"para":"\"SIPB = Suero, Insulina, Potasio, Bicarbonato\"","nemotecnia":"\"SIPB = Suero, Insulina, Potasio, Bicarbonato\"","explicacion":"Los 4 pilares del tratamiento. En ese orden de prioridad de inicio. Solo el Suero se puede dar sin esperar exámenes.\nLos 4 pilares del tratamiento. En ese orden de prioridad de inicio. Solo el Suero se puede dar sin esperar exámenes."},{"para":"\"K > 5,3 → NO K. K 3,3-5,3 → SÍ K. K < 3,3 → K primero, NO insulina\"","nemotecnia":"\"K > 5,3 → NO K. K 3,3-5,3 → SÍ K. K < 3,3 → K primero, NO insulina\"","explicacion":"La regla del potasio en tres niveles. El potasio siempre diluido en suero, nunca en bolo directo. Un bolo de potasio IV = paro cardíaco.La regla del potasio en tres niveles. El potasio siempre diluido en suero, nunca en bolo directo. Un bolo de potasio IV = paro cardíaco."},{"para":"\"pH < 6,9 → Bicarbonato. Solo en CAD, nunca en HGHO\"","nemotecnia":"\"pH < 6,9 → Bicarbonato. Solo en CAD, nunca en HGHO\"","explicacion":"El bicarbonato es la excepción, no la regla. Solo ante acidosis extrema en cetoacidosis. En hiperosmolar prácticamente no se usa.El bicarbonato es la excepción, no la regla. Solo ante acidosis extrema en cetoacidosis. En hiperosmolar prácticamente no se usa."}]'::jsonb,
    '["Cuatro pilares del tratamiento: suero fisiológico (volumen), insulina cristalina, potasio y bicarbonato (solo en CAD severa con pH menor a 6,9).","Potasio: no administrar si mayor a 5,3. Reponer si está en rango normal (3,3-5,3). Si está bajo 3,3: reponer potasio primero y NO iniciar insulina.","El potasio siempre en goteo, nunca en bolo directo. Esperar resultado del potasio plasmático antes de dar insulina o potasio."]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    NOW(),
    TRUE,
    FALSE  -- first 3 free preview
  ) ON CONFLICT (specialty_id, order_index)
  DO UPDATE SET
    title            = EXCLUDED.title,
    duration_seconds = EXCLUDED.duration_seconds,
    txt_content      = EXCLUDED.txt_content,
    srt_content      = EXCLUDED.srt_content,
    ai_summary       = EXCLUDED.ai_summary,
    ai_key_concepts  = EXCLUDED.ai_key_concepts,
    ai_mnemonics     = EXCLUDED.ai_mnemonics,
    ai_high_yield    = EXCLUDED.ai_high_yield,
    ai_review_qs     = EXCLUDED.ai_review_qs,
    ai_processed_at  = NOW(),
    is_available     = TRUE;

  -- Cápsula 20: Hipoglicemia — Generalidades, Clínica y Tratamiento
  INSERT INTO lessons (
    specialty_id, title, order_index, duration_seconds,
    txt_content, srt_content,
    ai_summary, ai_key_concepts, ai_mnemonics,
    ai_high_yield, ai_algorithms, ai_review_qs,
    ai_processed_at, is_available, is_free_preview
  ) VALUES (
    v_specialty_id,
    'Hipoglicemia — Generalidades, Clínica y Tratamiento',
    20,
    479,
    'Hola, hola, ¿cómo están? Uno de los temas que hay que saber es hipoglicemia, así que veamos las

generalidades, luego en otro vídeo vamos a hablar del estudio del enfrentamiento etiológico de las

mismas, pero sepan que la clínica de las hipoglicemias se subdivide en dos tipos de

síntomas, por un lado están los síntomas de tipo simpático-mimético, que habitualmente son

los iniciales y más leves, que se ven desde las hipoglicemias leves, y finalmente están los

síntomas neuroglucopénicos, que son aquellos más graves y que se ven en las hipoglicemias ya

con compromiso al sistema nervioso central y que son lo que define la severidad de la hipoglicemia.

Los simpático-mimético, la taquicardia, temblor, inquietud, suboración, activación

del sistema simpático en general, acuérdense que son los que se pueden ocultar por el

betabloqueo, por el atenolol, que hace poco deseable tener a un paciente diabético con

fármacos, por ejemplo, con este tipo de medicamento. Y los neuroglucopénicos,

que son los más severos, los más característicos son las convulsiones, la desorientación,

la agitación, el compromiso de conciencia, el actuar de alguna manera diferente a la habitual,

etcétera. Y obviamente, no solamente que son severos porque reflejan una glisemia menor,

sino que aparte porque dificultan el autotratamiento de la hipoglicemia por

parte del paciente, y eso es algo importante y que hace que finalmente requieran de atención,

sido sí. El diagnóstico de las hipoglicemias por el general se basa en la triada de Whipple,

en el sentido en que estos síntomas son relativamente inespecíficos, y exige tres cosas.

Número uno, que haya síntomas sugerentes de hipoglicemia. Número dos, que se objective

simultáneamente que hay una baja de la glisemia en contexto a estos síntomas. Y en

tercer lugar, que estos síntomas mejoren al mejorar la glisemia, al darle azúcar. De lo

contrario pueden ser, sin ningún problema, una crisis de pánico o alguna otra cosa de ese

tipo también. Así que, para estar seguro, obviamente hay que ver estas tres cosas ahora.

Obviamente en un paciente diabético con insulina o con hipoglicemiantes orales que me hace un

cuadro de este tipo en que se agita y luego compulsiona, ¿cierto? Hay que ir a descartar

hipoglicemia como la cosa más urgente. Ahora, ¿qué pasa si es que tiene estos síntomas,

pero yo le hago una elisemia o un hemogluco test y está absolutamente normal? Pues en ese

caso no era la hipoglicemia. Y dentro de las causas pueden ser todo el espectro psiquiátrico,

desde la crisis de angustia hasta los trastornos conversivos, más cualquier otra cosa que no es

hipoglicemia. Ahora, dentro de esas causas, acuérdense del hipertiroidismo, que puede de

una u otra forma verse similar a una hipoglicemia debido a que también tiene síntomas

simpático-miméticos y además los feochromocitomas que igualmente pueden venir con estos síntomas

simpático-miméticos. ¿Cuál es el punto de corte para hablar que en el laboratorio hay una

hipoglicemia? Y la verdad es que no hay consenso. Puede ser menor a 60 que es como lo clásico

que se enseña, menor a 55 que es lo que se ha dicho que tiene una mejor correlación con la

clínica y finalmente menor a 50 en el sentido en que una hipoglicemia aunque esté con

síntomas y que sea real, si está arriba de 50, es muy muy improbable que sea una hipoglicemia

severa, así que más o menos lo mismo que haya algo sobre ese valor. Pero la verdad es que no hay

consenso y no sólo eso, sino que realmente es muy variable de un paciente a otro. Ejemplo,

algunos pacientes con una diabetes que tiende a la hiperglicemia, cuando bajan de 60 ya

se pueden sentir mal y ya pueden hacer estos síntomas, incluso síntomas neuroglucopénicos.

Ahora, en el recién nacido, y esto lo vamos a ver en su respectiva clase, el corte es todavía

más bajo. Acuérdense que hasta 35, incluso 25 en algunas horas puede ser algo aguantable,

si es que el paciente está asintomático y los cortes clásicos son menor a 40 o a 35 en

las primeras 48 horas y menor a 45 o 50 después de las primeras 48 horas. Pero repito,

eso es muy variable y depende si es que tiene síntomas o no, y no lo vamos a ver

con ningún detalle en esta clase. Así que sigamos. El tratamiento de las hipoglicemias,

por lo general, va a depender si es que es leve o severa. Acordándonos que la diferencia

entre leve y severa no la da el nivel de glicemia, sino que la dan los síntomas.

Si es que viene con síntomas neuroglucopénicos, ya es severa. Así que cuando es leve,

por lo general, se le da un líquido azucarado, digamos, agua con azúcar,

una bebida no light, jugo de fruta, una cucharada de miel o si es que no tengo

nada, una cucharada de azúcar de mesa no más, pero hay que darle azúcar de absorción rápida,

idealmente disuelta en agua, y en cambio cuando es severa hay que darle un bolo de azúcar por

vía endovenosa. Habitualmente se le da glucosa que puede ir desde el 10% hasta el 50% y la

cantidad que se suele dar es más o menos 25 gramos en bolo endovenoso, dígase 250cc cuando

es al 10% o bien 50cc cuando es al 50%. La verdad es que con un poquito que yo le dé,

así 20cc al 20%, ya tiende a mejorar bastante, pero lo ideal es darle un bolo

que complete más o menos estos 25 gramos o un poquito menos, puede ser entre 12,5 y 25 gramos

en total. Como cosa importante, le puedo dar a una severa, igual un líquido azucarado si no

tengo nada más, y la verdad es que eventualmente sí se puede hacer cuando se amenaza su vida,

pero hay que tener mucho cuidado porque un paciente que está desorientado o eventualmente

en coma y puede que el manejo sea peor que la enfermedad en el sentido en que me puede hacer

ejemplo una neumonía aspirativa o alguna cosa de ese tipo, así que en una severa en la cual

yo no tengo glucosa disponible, mi alternativa más que eso es darle glucagón por vía

subcutánea, y de hecho es muy frecuente que los pacientes diabéticos tipo 1 por ejemplo,

que tienden a la hipoglicemia tengan en alguna parte guardado un lápiz o una jeringa con

glucagón en un caso de este tipo urgente. Ahora, cuando no mejora y sigue todavía con

la glicemia muy baja, se van repitiendo estos bolos, una vez que ya se logra una

normoglicemia, en ese caso me voy a pasar a un goteo igual y una vez que ya está bien y

que la glicemia está relativamente bien pues me puedo pasar a los líquidos azucarados también,

pero obviamente desde el momento que ya no esté comprometido de conciencia y que ya no tenga

riesgo de aspirar. Ahora, además debo controlarlo con hemoglucotés frecuentes, en el caso de una

glicemia leve no, me basta con el manejo y que se recupere clínicamente, pero en el caso

de una severa que es potencialmente letal, ahí estoy obligado sí o sí a controlarlo

con varios hemoglucotés y no solo eso, sino que aparte tengo que siempre ir a buscar y a manejar

la causa y eso no solamente aplica a la severa, aplica también a las leves que lo vamos a ver

con más detalles en otra diapositiva, en otra clase. Ahora, ¿qué pasa con las hipolisemias

que son generadas por gliva inclamida o por las sulfonilubrias en general? Hay que tener

harto cuidado porque suelen ser severas y no solamente severas sino que prolongadas

en el tiempo porque la vida media de la glivia inclamida de la sulfonilubria es bastante larga,

habitualmente es como de un día, así que obviamente no puedo llegar y manejarlo y mandarlo

para la casa de inmediato, sino que debo darle el bolo, el goteo, hacer los hemoglucotés

seriados con una frecuencia relativamente corta y finalmente debo dejarlo hospitalizado al

menos un día en observación completa y no lo mando para la casa hasta que no esté

completamente como estabilizado y obviamente tengo que ajustarle luego la dosis de su medicamento

para evitar que me haga una nueva hipoglicemia o bien tengo que cambiarle la glivia inclamida

por la citagliptina o por algún otro hipoglicemio antes que tenga menor riesgo

de hipoglicemia. Bueno, eso fue todo, en la siguiente clase vamos a hundar un poquito

más la etiología de las hipoglicemias. ¡Que estén bien!',
    '1
00:00:03,250 --> 00:00:07,530
Hola, hola, ¿cómo están? Uno de los temas que hay que saber es hipoglicemia, así que veamos las

2
00:00:07,530 --> 00:00:12,690
generalidades, luego en otro vídeo vamos a hablar del estudio del enfrentamiento etiológico de las

3
00:00:12,690 --> 00:00:17,490
mismas, pero sepan que la clínica de las hipoglicemias se subdivide en dos tipos de

4
00:00:17,490 --> 00:00:22,210
síntomas, por un lado están los síntomas de tipo simpático-mimético, que habitualmente son

5
00:00:22,210 --> 00:00:26,930
los iniciales y más leves, que se ven desde las hipoglicemias leves, y finalmente están los

6
00:00:26,930 --> 00:00:32,010
síntomas neuroglucopénicos, que son aquellos más graves y que se ven en las hipoglicemias ya

7
00:00:32,010 --> 00:00:37,730
con compromiso al sistema nervioso central y que son lo que define la severidad de la hipoglicemia.

8
00:00:37,730 --> 00:00:43,570
Los simpático-mimético, la taquicardia, temblor, inquietud, suboración, activación

9
00:00:43,570 --> 00:00:48,690
del sistema simpático en general, acuérdense que son los que se pueden ocultar por el

10
00:00:48,690 --> 00:00:53,810
betabloqueo, por el atenolol, que hace poco deseable tener a un paciente diabético con

11
00:00:53,810 --> 00:00:58,330
fármacos, por ejemplo, con este tipo de medicamento. Y los neuroglucopénicos,

12
00:00:58,330 --> 00:01:02,850
que son los más severos, los más característicos son las convulsiones, la desorientación,

13
00:01:02,850 --> 00:01:09,010
la agitación, el compromiso de conciencia, el actuar de alguna manera diferente a la habitual,

14
00:01:09,010 --> 00:01:15,050
etcétera. Y obviamente, no solamente que son severos porque reflejan una glisemia menor,

15
00:01:15,050 --> 00:01:19,450
sino que aparte porque dificultan el autotratamiento de la hipoglicemia por

16
00:01:19,450 --> 00:01:24,530
parte del paciente, y eso es algo importante y que hace que finalmente requieran de atención,

17
00:01:24,530 --> 00:01:29,810
sido sí. El diagnóstico de las hipoglicemias por el general se basa en la triada de Whipple,

18
00:01:29,810 --> 00:01:35,210
en el sentido en que estos síntomas son relativamente inespecíficos, y exige tres cosas.

19
00:01:35,210 --> 00:01:42,210
Número uno, que haya síntomas sugerentes de hipoglicemia. Número dos, que se objective

20
00:01:42,210 --> 00:01:46,850
simultáneamente que hay una baja de la glisemia en contexto a estos síntomas. Y en

21
00:01:46,850 --> 00:01:52,530
tercer lugar, que estos síntomas mejoren al mejorar la glisemia, al darle azúcar. De lo

22
00:01:52,530 --> 00:01:56,250
contrario pueden ser, sin ningún problema, una crisis de pánico o alguna otra cosa de ese

23
00:01:56,250 --> 00:02:00,690
tipo también. Así que, para estar seguro, obviamente hay que ver estas tres cosas ahora.

24
00:02:00,690 --> 00:02:06,210
Obviamente en un paciente diabético con insulina o con hipoglicemiantes orales que me hace un

25
00:02:06,210 --> 00:02:11,170
cuadro de este tipo en que se agita y luego compulsiona, ¿cierto? Hay que ir a descartar

26
00:02:11,170 --> 00:02:16,570
hipoglicemia como la cosa más urgente. Ahora, ¿qué pasa si es que tiene estos síntomas,

27
00:02:16,570 --> 00:02:22,330
pero yo le hago una elisemia o un hemogluco test y está absolutamente normal? Pues en ese

28
00:02:22,330 --> 00:02:26,530
caso no era la hipoglicemia. Y dentro de las causas pueden ser todo el espectro psiquiátrico,

29
00:02:26,530 --> 00:02:32,930
desde la crisis de angustia hasta los trastornos conversivos, más cualquier otra cosa que no es

30
00:02:32,930 --> 00:02:39,650
hipoglicemia. Ahora, dentro de esas causas, acuérdense del hipertiroidismo, que puede de

31
00:02:39,650 --> 00:02:45,730
una u otra forma verse similar a una hipoglicemia debido a que también tiene síntomas

32
00:02:45,730 --> 00:02:50,770
simpático-miméticos y además los feochromocitomas que igualmente pueden venir con estos síntomas

33
00:02:50,770 --> 00:02:56,410
simpático-miméticos. ¿Cuál es el punto de corte para hablar que en el laboratorio hay una

34
00:02:56,410 --> 00:03:01,330
hipoglicemia? Y la verdad es que no hay consenso. Puede ser menor a 60 que es como lo clásico

35
00:03:01,330 --> 00:03:06,810
que se enseña, menor a 55 que es lo que se ha dicho que tiene una mejor correlación con la

36
00:03:06,810 --> 00:03:12,250
clínica y finalmente menor a 50 en el sentido en que una hipoglicemia aunque esté con

37
00:03:12,250 --> 00:03:16,690
síntomas y que sea real, si está arriba de 50, es muy muy improbable que sea una hipoglicemia

38
00:03:16,690 --> 00:03:23,010
severa, así que más o menos lo mismo que haya algo sobre ese valor. Pero la verdad es que no hay

39
00:03:23,010 --> 00:03:27,850
consenso y no sólo eso, sino que realmente es muy variable de un paciente a otro. Ejemplo,

40
00:03:27,850 --> 00:03:32,690
algunos pacientes con una diabetes que tiende a la hiperglicemia, cuando bajan de 60 ya

41
00:03:32,690 --> 00:03:37,090
se pueden sentir mal y ya pueden hacer estos síntomas, incluso síntomas neuroglucopénicos.

42
00:03:37,370 --> 00:03:42,970
Ahora, en el recién nacido, y esto lo vamos a ver en su respectiva clase, el corte es todavía

43
00:03:42,970 --> 00:03:49,490
más bajo. Acuérdense que hasta 35, incluso 25 en algunas horas puede ser algo aguantable,

44
00:03:49,490 --> 00:03:55,610
si es que el paciente está asintomático y los cortes clásicos son menor a 40 o a 35 en

45
00:03:55,610 --> 00:04:02,490
las primeras 48 horas y menor a 45 o 50 después de las primeras 48 horas. Pero repito,

46
00:04:02,490 --> 00:04:06,570
eso es muy variable y depende si es que tiene síntomas o no, y no lo vamos a ver

47
00:04:06,570 --> 00:04:10,850
con ningún detalle en esta clase. Así que sigamos. El tratamiento de las hipoglicemias,

48
00:04:10,850 --> 00:04:15,330
por lo general, va a depender si es que es leve o severa. Acordándonos que la diferencia

49
00:04:15,330 --> 00:04:19,010
entre leve y severa no la da el nivel de glicemia, sino que la dan los síntomas.

50
00:04:19,010 --> 00:04:25,210
Si es que viene con síntomas neuroglucopénicos, ya es severa. Así que cuando es leve,

51
00:04:25,210 --> 00:04:29,490
por lo general, se le da un líquido azucarado, digamos, agua con azúcar,

52
00:04:29,490 --> 00:04:35,330
una bebida no light, jugo de fruta, una cucharada de miel o si es que no tengo

53
00:04:35,330 --> 00:04:41,370
nada, una cucharada de azúcar de mesa no más, pero hay que darle azúcar de absorción rápida,

54
00:04:41,370 --> 00:04:48,490
idealmente disuelta en agua, y en cambio cuando es severa hay que darle un bolo de azúcar por

55
00:04:48,490 --> 00:04:54,770
vía endovenosa. Habitualmente se le da glucosa que puede ir desde el 10% hasta el 50% y la

56
00:04:54,770 --> 00:05:00,970
cantidad que se suele dar es más o menos 25 gramos en bolo endovenoso, dígase 250cc cuando

57
00:05:00,970 --> 00:05:06,370
es al 10% o bien 50cc cuando es al 50%. La verdad es que con un poquito que yo le dé,

58
00:05:06,370 --> 00:05:12,490
así 20cc al 20%, ya tiende a mejorar bastante, pero lo ideal es darle un bolo

59
00:05:12,490 --> 00:05:18,850
que complete más o menos estos 25 gramos o un poquito menos, puede ser entre 12,5 y 25 gramos

60
00:05:18,850 --> 00:05:24,790
en total. Como cosa importante, le puedo dar a una severa, igual un líquido azucarado si no

61
00:05:24,790 --> 00:05:29,250
tengo nada más, y la verdad es que eventualmente sí se puede hacer cuando se amenaza su vida,

62
00:05:29,250 --> 00:05:33,250
pero hay que tener mucho cuidado porque un paciente que está desorientado o eventualmente

63
00:05:33,250 --> 00:05:39,010
en coma y puede que el manejo sea peor que la enfermedad en el sentido en que me puede hacer

64
00:05:39,010 --> 00:05:44,530
ejemplo una neumonía aspirativa o alguna cosa de ese tipo, así que en una severa en la cual

65
00:05:44,530 --> 00:05:49,290
yo no tengo glucosa disponible, mi alternativa más que eso es darle glucagón por vía

66
00:05:49,290 --> 00:05:54,530
subcutánea, y de hecho es muy frecuente que los pacientes diabéticos tipo 1 por ejemplo,

67
00:05:54,530 --> 00:06:00,810
que tienden a la hipoglicemia tengan en alguna parte guardado un lápiz o una jeringa con

68
00:06:00,810 --> 00:06:07,810
glucagón en un caso de este tipo urgente. Ahora, cuando no mejora y sigue todavía con

69
00:06:07,810 --> 00:06:13,250
la glicemia muy baja, se van repitiendo estos bolos, una vez que ya se logra una

70
00:06:13,250 --> 00:06:19,210
normoglicemia, en ese caso me voy a pasar a un goteo igual y una vez que ya está bien y

71
00:06:19,210 --> 00:06:24,890
que la glicemia está relativamente bien pues me puedo pasar a los líquidos azucarados también,

72
00:06:24,890 --> 00:06:28,890
pero obviamente desde el momento que ya no esté comprometido de conciencia y que ya no tenga

73
00:06:28,890 --> 00:06:34,450
riesgo de aspirar. Ahora, además debo controlarlo con hemoglucotés frecuentes, en el caso de una

74
00:06:34,450 --> 00:06:39,370
glicemia leve no, me basta con el manejo y que se recupere clínicamente, pero en el caso

75
00:06:39,370 --> 00:06:45,490
de una severa que es potencialmente letal, ahí estoy obligado sí o sí a controlarlo

76
00:06:45,490 --> 00:06:50,370
con varios hemoglucotés y no solo eso, sino que aparte tengo que siempre ir a buscar y a manejar

77
00:06:50,370 --> 00:06:56,130
la causa y eso no solamente aplica a la severa, aplica también a las leves que lo vamos a ver

78
00:06:56,130 --> 00:07:03,250
con más detalles en otra diapositiva, en otra clase. Ahora, ¿qué pasa con las hipolisemias

79
00:07:03,250 --> 00:07:07,450
que son generadas por gliva inclamida o por las sulfonilubrias en general? Hay que tener

80
00:07:07,450 --> 00:07:12,370
harto cuidado porque suelen ser severas y no solamente severas sino que prolongadas

81
00:07:12,370 --> 00:07:16,810
en el tiempo porque la vida media de la glivia inclamida de la sulfonilubria es bastante larga,

82
00:07:16,810 --> 00:07:24,170
habitualmente es como de un día, así que obviamente no puedo llegar y manejarlo y mandarlo

83
00:07:24,170 --> 00:07:28,690
para la casa de inmediato, sino que debo darle el bolo, el goteo, hacer los hemoglucotés

84
00:07:28,690 --> 00:07:36,410
seriados con una frecuencia relativamente corta y finalmente debo dejarlo hospitalizado al

85
00:07:36,410 --> 00:07:40,650
menos un día en observación completa y no lo mando para la casa hasta que no esté

86
00:07:40,690 --> 00:07:47,010
completamente como estabilizado y obviamente tengo que ajustarle luego la dosis de su medicamento

87
00:07:47,010 --> 00:07:51,330
para evitar que me haga una nueva hipoglicemia o bien tengo que cambiarle la glivia inclamida

88
00:07:51,330 --> 00:07:55,570
por la citagliptina o por algún otro hipoglicemio antes que tenga menor riesgo

89
00:07:55,570 --> 00:07:59,450
de hipoglicemia. Bueno, eso fue todo, en la siguiente clase vamos a hundar un poquito

90
00:07:59,450 --> 00:08:02,050
más la etiología de las hipoglicemias. ¡Que estén bien!',
    'En esta cápsula abordaremos las generalidades de la hipoglicemia, un tema de alto rendimiento en el EUNACOM. En la próxima cápsula profundizaremos en las causas y el estudio etiológico. Por ahora, empecemos por entender la clínica y el tratamiento.

La sintomatología de la hipoglicemia se organiza en dos grupos según su mecanismo y gravedad. El primer grupo son los síntomas simpáticomiméticos, que son los más precoces y los más leves. Aparecen cuando la glicemia comienza a descender y el sistema nervioso autónomo se activa para intentar compensar. Se manifiestan como taquicardia, temblor, inquietud, sudoración y una sensación general de activación autonómica. Estos síntomas son los que sirven de señal de alarma al paciente para que tome azúcar antes de que la situación empeore.

El segundo grupo son los síntomas neuroglucopénicos, que aparecen cuando la hipoglicemia ya es suficientemente profunda como para privar de glucosa al sistema nervioso central. Son los más graves y los más específicos: convulsiones, desorientación, agitación psicomotora, conducta inapropiada y compromiso de conciencia hasta llegar al coma. Estos síntomas no solo reflejan una caída más intensa de la glicemia, sino que además impiden que el propio paciente trate su hipoglicemia, porque ya no está en condiciones de reconocer su situación ni de ingerir azúcar por sus propios medios. Por esta razón, los pacientes que llegan a esta etapa necesitan tratamiento por vía parenteral.',
    '["Síntomas simpáticomiméticos (precoces, leves): taquicardia, temblor, sudoración. Se ocultan con betabloqueadores.","Síntomas neuroglucopénicos (tardíos, severos): convulsiones, desorientación, agitación, coma. Definen hipoglicemia severa.","Tríada de Whipple: síntomas + glicemia baja objetivada + resolución con azúcar. Las tres condiciones son necesarias para confirmar el diagnóstico.","Leve: azúcar oral (bebida azucarada, miel, azúcar de mesa). Severa: glucosa IV en bolo (25 g) o glucagón SC si no hay acceso venoso.","Hipoglicemia por sulfonilureas (glibenclamida): severa y prolongada (vida media ~24 h). Requiere hospitalización mínimo 24 horas y ajuste posterior del tratamiento."]'::jsonb,
    '[{"para":"\"SIMPATICO primero, NEUROGLUCO después\"","nemotecnia":"\"SIMPATICO primero, NEUROGLUCO después\"","explicacion":"Simpáticomiméticos = señal de alarma leve. Neuroglucopénicos = emergencia. Si hay betabloqueadores → el aviso no llega.\nSimpáticomiméticos = señal de alarma leve. Neuroglucopénicos = emergencia. Si hay betabloqueadores → el aviso no llega."},{"para":"\"WHIPPLE en 3: Síntomas + Glicemia baja + Mejora con azúcar\"","nemotecnia":"\"WHIPPLE en 3: Síntomas + Glicemia baja + Mejora con azúcar\"","explicacion":"Las tres condiciones de la tríada de Whipple. Si alguna falta, la hipoglicemia no está confirmada.Las tres condiciones de la tríada de Whipple. Si alguna falta, la hipoglicemia no está confirmada."},{"para":"\"GLIBENCLAMIDA = TODA LA NOCHE hospitalizado\"","nemotecnia":"\"GLIBENCLAMIDA = TODA LA NOCHE hospitalizado\"","explicacion":"Vida media larga (~24 h). La hipoglicemia vuelve. No se manda al paciente a casa. Se hospitaliza y se monitoriza por al menos un día.Vida media larga (~24 h). La hipoglicemia vuelve. No se manda al paciente a casa. Se hospitaliza y se monitoriza por al menos un día."}]'::jsonb,
    '["Síntomas simpáticomiméticos (precoces, leves): taquicardia, temblor, sudoración. Se ocultan con betabloqueadores.","Síntomas neuroglucopénicos (tardíos, severos): convulsiones, desorientación, agitación, coma. Definen hipoglicemia severa.","Tríada de Whipple: síntomas + glicemia baja objetivada + resolución con azúcar. Las tres condiciones son necesarias para confirmar el diagnóstico."]'::jsonb,
    '[]'::jsonb,
    '[{"pregunta":"¿Cuál de las siguientes afirmaciones sobre el tratamiento de la hipoglicemia es correcta?","respuesta":"Respuesta correcta: C — La glibenclamida tiene una vida media larga (~24 h), lo que hace que la hipoglicemia pueda recurrir tras la corrección inicial. El paciente debe permanecer hospitalizado en observación. La severidad la definen los síntomas (no el número); el glucagón SC es alternativa cuando no hay acceso venoso, no primera línea en leves; los simpáticomiméticos aparecen primero; y dar líquido azucarado oral a un paciente inconsciente causa broncoaspiración."}]'::jsonb,
    NOW(),
    TRUE,
    FALSE  -- first 3 free preview
  ) ON CONFLICT (specialty_id, order_index)
  DO UPDATE SET
    title            = EXCLUDED.title,
    duration_seconds = EXCLUDED.duration_seconds,
    txt_content      = EXCLUDED.txt_content,
    srt_content      = EXCLUDED.srt_content,
    ai_summary       = EXCLUDED.ai_summary,
    ai_key_concepts  = EXCLUDED.ai_key_concepts,
    ai_mnemonics     = EXCLUDED.ai_mnemonics,
    ai_high_yield    = EXCLUDED.ai_high_yield,
    ai_review_qs     = EXCLUDED.ai_review_qs,
    ai_processed_at  = NOW(),
    is_available     = TRUE;

  -- Cápsula 21: Causas y Estudio Etiológico de la Hipoglicemia
  INSERT INTO lessons (
    specialty_id, title, order_index, duration_seconds,
    txt_content, srt_content,
    ai_summary, ai_key_concepts, ai_mnemonics,
    ai_high_yield, ai_algorithms, ai_review_qs,
    ai_processed_at, is_available, is_free_preview
  ) VALUES (
    v_specialty_id,
    'Causas y Estudio Etiológico de la Hipoglicemia',
    21,
    487,
    'Hola, hola, ¿cómo están? Ya vimos cómo manejar una hipoglicemia y dentro de eso

había que buscar la causa y manejarla y en este caso vamos a ver justamente

cuáles son las causas y cómo se estudia etiológicamente una hipoglicemia.

Recordando que su clasificación más importante o más básica es dividirlas

en espontáneas, que son las que no son provocadas por ningún fármaco y

las provocadas que son en las cuales yo tengo una causa evidente

farmacológica detrás. Dentro de las espontáneas a su vez se

subdividen en reactivas y de ayuno. Las reactivas son las que ocurren

algunas horas después de comer, las de ayuno en cambio son las que ocurren

de algunas horas después de no comer. Ahora, lo más frecuente es que las

reactivas sean dos a cuatro horas después de haber comido alguna

comida de cualquier tipo y las de ayuno en cambio lo más frecuente es

que sean después de cuatro a seis horas de ayuno, incluso puede ser

algún ayuno más prolongado y que quede bien claro lo normal es

incluso en algunos ayunos de muchas horas de incluso de algunos días que

nunca se llega el corte de una hipoglicemia. Dentro de las espontáneas

la causa más frecuente de las reactivas es la resistencia a la

insulina. Hay un montón de otras causas pero esta es la más importante y

lo que ocurre acá fisiopatológicamente es más o menos lo

siguiente. Tengo a un paciente que tiene resistencia a la insulina, eso

hace que tienda a tener un exceso de insulina y mantener las

glicemias altas y le ocurre que se come algo de absorción muy rápida,

ejemplo un pay de limón, la insulina se le sube mucho, la glicemia se le

sube mucho, luego la insulina mete el azúcar dentro de las células y

finalmente le sobra insulina al punto que algunas horas después me hace

una alguna hipoglicemia ya sea con síntomas o no pero finalmente le

baja el azúcar más de lo que debería debido a este

hiperinsulinismo debido a la resistencia a la insulina. ¿Quedó más o

menos claro? Esperemos que sí. Las de ayuno en cambio las más frecuentes

son las causadas por un insulinoma, por algunos cánceres grandes que

simplemente se llevan todo el azúcar como por ejemplo un sarcoma muy

grande, un linfoma que esté diseminado y hay algunas más raras como las

autoinmunes con anticuerpos en contra de la insulina pero que en

vez de destruir a la insulina la la la protegen y hacen que dure más

tiempo o bien en contra del receptor de insulina y que actúan

como un anticuerpo pero actúa en el receptor como si fuera la insulina misma

y obviamente genera esta hipoglicemia. Dentro de las provocadas las más

frecuentes son por insulina y por los hipoglicemia anterzorales en

específico por las sulfonilurias, por la glivenclamida y por las

meticlinidas por las de esa familia que actuaban de una manera muy

similar a las sulfonilurias y a su vez las provocadas se

subdividen en las que son una reacción adversa a los medicamentos

en el tratamiento del paciente diabético y las que son facticias, las

que son de un paciente que no sabemos que está con la insulina que no

sabemos que está con el hipoglicemiante pero que aún así está

desencadenando estas hipoglicemias y las menciono estas aparte porque en

la clínica suelen manifestarse como una hipoglicemia espontánea si bien

son provocadas por estos fármacos el paciente no me cuenta así que

finalmente tengo que ser capaz de detectar estas hipoglicemias

facticias también con los antecedentes clínicos que eventualmente yo pueda

obtener desde el paciente ahora en el caso de las que son causadas por un

medicamento aparte de manejarlas luego de eso debo hacer un ajuste en el

tratamiento del paciente diabético nada más en cambio las espontáneas

es importante estudiarlas como para saber exactamente cuál es la causa

que hay detrás dentro de los exámenes que yo le pido a una

hipoglicemia espontánea habitualmente está el peptido C que si

se acuerdan refleja los niveles de insulina endógena o sea si es que yo

produzco más insulina el peptido C se eleva se pide además la insulina en el

sentido en que me refleja no solamente la insulina endógena sino

que la insulina exógena también ejemplo en una hipoglicemia facticia

por insulina eventualmente no me la detecta el peptido C pero si los

niveles de insulina plasmática y aparte de esto muchas veces cuando yo

identifico un desencadenante como las comidas o el ayuno por ejemplo yo puedo

hacer alguna prueba que intente repetir este desencadenante como para

poder objetivar la hipoglicemia en el examen de laboratorio

acuérdense que la treada de Whipple exigía no solamente los síntomas

sino que además el medir la glicemia y que estuviera baja y además que se

mejoraran estos síntomas con el azúcar ahora dentro de eso existen

dos pruebas una es la prueba de tolerancia a la comida mixta que es

justamente para buscar las hipoglicemias reactivas en el sentido en

que le doy un plato de comida que se prepara de una forma bien

estandarizada y voy siguiéndolo con hemogluco test o con glicemia durante

varias horas y veo si es que se produce efectivamente esta hipoglicemia

alguna hora después y lo otro que existe es la prueba de ayuno en la

cual yo lo someto a un ayuno de varias horas y voy midiendo

justamente las glicemias de manera de ver si es que se produce la hipoglicemia

o no ahora qué pasa con este test de tolerancia en la glucosa oral de

tipo prolongado que era el examen que habitualmente se pedía en las

hipoglicemias reactivas la verdad que actualmente ha sido desplazado por

la prueba de tolerancia a la comida mixta en el sentido en que esta

última prueba tiene menos falsos positivos que el test de tolerancia a

la glucosa alargado que es un poquito más artificial ahora aparte de esto de

acá como hay algunas otras causas como los insulinomas el cáncer etcétera

hay que pedirle exámenes generales en busca de alguna otra cosa que me

oriente a la etiología de esta hipoglicemia espontánea

vamos a ver un cuadro respecto al peptidoseya la insulina de

distintas causas de hipoglicemia de manera que nos las aprendamos y

podamos identificar un cuadro clínico si está con insulina exógena obviamente

el peptidosee va a estar bajo porque mide solamente la insulina endógena en

cambio la insulina plasmática si va a estar elevada así que ese va a ser

el clásico patrón de hiperinsulinismo pero con el peptidosee

bajo es por administración de insulina exógena en el caso de

las sulfonilubrias de la glivianclamida obviamente se induce una

liberación pancreática de insulina así que tanto el peptidosee como la

insulina van a estar ambos elevados en el caso del insulina igualmente hay un

tumor que está en el páncreas y que va liberando y produciendo insulina así

que nuevamente tanto el peptidosee como la insulina van a estar elevadas

entonces como hago para diferenciar una insulina facticia por

sulfonilubrias de un insulina bueno midiendo directamente niveles

plasmáticos de sulfonilubrias en sangre ahora la resistencia a la insulina

la reactiva obviamente hay un hiperinsulinismo y una hipersecreción

de insulina así que lo más probable es que el peptidosee y la insulina van a

estar altas ahora no siempre hay algunas veces en que están dentro de

rango normal por si acaso pero lo más frecuente es que todas estas

estén altas y finalmente las que son de ayuno por algo que se lleva

la glucosa como un cáncer por ejemplo en ese caso al no haber azúcar

seguramente no va a haber secreción de insulina tampoco y el peptidosee va a

estar bajo así que en este caso ambas van a estar bajas igual

eso es todo lo importante es saber reconocerlos pero seguramente no en

ese orden sino que al revés si es que yo les digo tiene la insulina

alta y el peptidosee bajo insulina exógena tiene la insulina alta y

el peptidosee alto pues cualquier cosa que genere secreción de insulina

las sulfoniluria, un insulinoma y las reactivas también y qué pasa si están

todos bajos pues en ese caso hay algo que se está llevando la glucosa por

cuenta propia como ejemplo un tumor así que ahí queda más o menos claro

y nos vemos en los siguientes vídeos que ya vamos a entrar a Dislipidemia

que estén bien',
    '1
00:00:03,310 --> 00:00:07,030
Hola, hola, ¿cómo están? Ya vimos cómo manejar una hipoglicemia y dentro de eso

2
00:00:07,030 --> 00:00:11,110
había que buscar la causa y manejarla y en este caso vamos a ver justamente

3
00:00:11,110 --> 00:00:14,350
cuáles son las causas y cómo se estudia etiológicamente una hipoglicemia.

4
00:00:14,350 --> 00:00:19,350
Recordando que su clasificación más importante o más básica es dividirlas

5
00:00:19,350 --> 00:00:23,270
en espontáneas, que son las que no son provocadas por ningún fármaco y

6
00:00:23,270 --> 00:00:27,730
las provocadas que son en las cuales yo tengo una causa evidente

7
00:00:27,730 --> 00:00:31,310
farmacológica detrás. Dentro de las espontáneas a su vez se

8
00:00:31,310 --> 00:00:35,230
subdividen en reactivas y de ayuno. Las reactivas son las que ocurren

9
00:00:35,230 --> 00:00:39,590
algunas horas después de comer, las de ayuno en cambio son las que ocurren

10
00:00:39,590 --> 00:00:43,550
de algunas horas después de no comer. Ahora, lo más frecuente es que las

11
00:00:43,550 --> 00:00:47,150
reactivas sean dos a cuatro horas después de haber comido alguna

12
00:00:47,150 --> 00:00:50,910
comida de cualquier tipo y las de ayuno en cambio lo más frecuente es

13
00:00:50,910 --> 00:00:54,630
que sean después de cuatro a seis horas de ayuno, incluso puede ser

14
00:00:54,630 --> 00:00:58,590
algún ayuno más prolongado y que quede bien claro lo normal es

15
00:00:58,590 --> 00:01:02,910
incluso en algunos ayunos de muchas horas de incluso de algunos días que

16
00:01:02,910 --> 00:01:06,870
nunca se llega el corte de una hipoglicemia. Dentro de las espontáneas

17
00:01:06,870 --> 00:01:09,790
la causa más frecuente de las reactivas es la resistencia a la

18
00:01:09,790 --> 00:01:13,550
insulina. Hay un montón de otras causas pero esta es la más importante y

19
00:01:13,550 --> 00:01:17,550
lo que ocurre acá fisiopatológicamente es más o menos lo

20
00:01:17,550 --> 00:01:21,190
siguiente. Tengo a un paciente que tiene resistencia a la insulina, eso

21
00:01:21,190 --> 00:01:25,270
hace que tienda a tener un exceso de insulina y mantener las

22
00:01:25,270 --> 00:01:29,390
glicemias altas y le ocurre que se come algo de absorción muy rápida,

23
00:01:29,390 --> 00:01:32,830
ejemplo un pay de limón, la insulina se le sube mucho, la glicemia se le

24
00:01:32,830 --> 00:01:37,470
sube mucho, luego la insulina mete el azúcar dentro de las células y

25
00:01:37,470 --> 00:01:42,270
finalmente le sobra insulina al punto que algunas horas después me hace

26
00:01:42,270 --> 00:01:47,050
una alguna hipoglicemia ya sea con síntomas o no pero finalmente le

27
00:01:47,050 --> 00:01:50,270
baja el azúcar más de lo que debería debido a este

28
00:01:50,270 --> 00:01:53,350
hiperinsulinismo debido a la resistencia a la insulina. ¿Quedó más o

29
00:01:53,350 --> 00:01:57,070
menos claro? Esperemos que sí. Las de ayuno en cambio las más frecuentes

30
00:01:57,070 --> 00:02:00,510
son las causadas por un insulinoma, por algunos cánceres grandes que

31
00:02:00,510 --> 00:02:04,670
simplemente se llevan todo el azúcar como por ejemplo un sarcoma muy

32
00:02:04,670 --> 00:02:08,790
grande, un linfoma que esté diseminado y hay algunas más raras como las

33
00:02:08,790 --> 00:02:12,910
autoinmunes con anticuerpos en contra de la insulina pero que en

34
00:02:12,910 --> 00:02:18,070
vez de destruir a la insulina la la la protegen y hacen que dure más

35
00:02:18,070 --> 00:02:21,630
tiempo o bien en contra del receptor de insulina y que actúan

36
00:02:21,670 --> 00:02:27,510
como un anticuerpo pero actúa en el receptor como si fuera la insulina misma

37
00:02:27,510 --> 00:02:31,670
y obviamente genera esta hipoglicemia. Dentro de las provocadas las más

38
00:02:31,670 --> 00:02:35,350
frecuentes son por insulina y por los hipoglicemia anterzorales en

39
00:02:35,350 --> 00:02:38,870
específico por las sulfonilurias, por la glivenclamida y por las

40
00:02:38,870 --> 00:02:42,510
meticlinidas por las de esa familia que actuaban de una manera muy

41
00:02:42,510 --> 00:02:46,470
similar a las sulfonilurias y a su vez las provocadas se

42
00:02:46,470 --> 00:02:50,030
subdividen en las que son una reacción adversa a los medicamentos

43
00:02:50,070 --> 00:02:53,630
en el tratamiento del paciente diabético y las que son facticias, las

44
00:02:53,630 --> 00:02:57,350
que son de un paciente que no sabemos que está con la insulina que no

45
00:02:57,350 --> 00:03:00,350
sabemos que está con el hipoglicemiante pero que aún así está

46
00:03:00,350 --> 00:03:05,950
desencadenando estas hipoglicemias y las menciono estas aparte porque en

47
00:03:05,950 --> 00:03:10,230
la clínica suelen manifestarse como una hipoglicemia espontánea si bien

48
00:03:10,230 --> 00:03:15,590
son provocadas por estos fármacos el paciente no me cuenta así que

49
00:03:15,590 --> 00:03:18,350
finalmente tengo que ser capaz de detectar estas hipoglicemias

50
00:03:18,350 --> 00:03:21,710
facticias también con los antecedentes clínicos que eventualmente yo pueda

51
00:03:21,710 --> 00:03:27,670
obtener desde el paciente ahora en el caso de las que son causadas por un

52
00:03:27,670 --> 00:03:31,350
medicamento aparte de manejarlas luego de eso debo hacer un ajuste en el

53
00:03:31,350 --> 00:03:34,670
tratamiento del paciente diabético nada más en cambio las espontáneas

54
00:03:34,670 --> 00:03:37,950
es importante estudiarlas como para saber exactamente cuál es la causa

55
00:03:37,950 --> 00:03:41,590
que hay detrás dentro de los exámenes que yo le pido a una

56
00:03:41,590 --> 00:03:44,910
hipoglicemia espontánea habitualmente está el peptido C que si

57
00:03:44,910 --> 00:03:49,190
se acuerdan refleja los niveles de insulina endógena o sea si es que yo

58
00:03:49,190 --> 00:03:54,630
produzco más insulina el peptido C se eleva se pide además la insulina en el

59
00:03:54,630 --> 00:03:58,390
sentido en que me refleja no solamente la insulina endógena sino

60
00:03:58,390 --> 00:04:02,550
que la insulina exógena también ejemplo en una hipoglicemia facticia

61
00:04:02,550 --> 00:04:06,430
por insulina eventualmente no me la detecta el peptido C pero si los

62
00:04:06,430 --> 00:04:11,470
niveles de insulina plasmática y aparte de esto muchas veces cuando yo

63
00:04:11,470 --> 00:04:16,150
identifico un desencadenante como las comidas o el ayuno por ejemplo yo puedo

64
00:04:16,150 --> 00:04:20,150
hacer alguna prueba que intente repetir este desencadenante como para

65
00:04:20,150 --> 00:04:24,350
poder objetivar la hipoglicemia en el examen de laboratorio

66
00:04:24,350 --> 00:04:27,870
acuérdense que la treada de Whipple exigía no solamente los síntomas

67
00:04:27,870 --> 00:04:32,390
sino que además el medir la glicemia y que estuviera baja y además que se

68
00:04:32,390 --> 00:04:37,870
mejoraran estos síntomas con el azúcar ahora dentro de eso existen

69
00:04:37,870 --> 00:04:43,070
dos pruebas una es la prueba de tolerancia a la comida mixta que es

70
00:04:43,070 --> 00:04:46,070
justamente para buscar las hipoglicemias reactivas en el sentido en

71
00:04:46,070 --> 00:04:51,910
que le doy un plato de comida que se prepara de una forma bien

72
00:04:51,910 --> 00:04:56,030
estandarizada y voy siguiéndolo con hemogluco test o con glicemia durante

73
00:04:56,030 --> 00:05:00,110
varias horas y veo si es que se produce efectivamente esta hipoglicemia

74
00:05:00,110 --> 00:05:04,470
alguna hora después y lo otro que existe es la prueba de ayuno en la

75
00:05:04,470 --> 00:05:08,990
cual yo lo someto a un ayuno de varias horas y voy midiendo

76
00:05:08,990 --> 00:05:12,550
justamente las glicemias de manera de ver si es que se produce la hipoglicemia

77
00:05:12,550 --> 00:05:16,990
o no ahora qué pasa con este test de tolerancia en la glucosa oral de

78
00:05:16,990 --> 00:05:21,710
tipo prolongado que era el examen que habitualmente se pedía en las

79
00:05:21,710 --> 00:05:25,430
hipoglicemias reactivas la verdad que actualmente ha sido desplazado por

80
00:05:25,430 --> 00:05:28,870
la prueba de tolerancia a la comida mixta en el sentido en que esta

81
00:05:28,870 --> 00:05:33,150
última prueba tiene menos falsos positivos que el test de tolerancia a

82
00:05:33,150 --> 00:05:39,510
la glucosa alargado que es un poquito más artificial ahora aparte de esto de

83
00:05:39,510 --> 00:05:42,990
acá como hay algunas otras causas como los insulinomas el cáncer etcétera

84
00:05:42,990 --> 00:05:46,510
hay que pedirle exámenes generales en busca de alguna otra cosa que me

85
00:05:46,510 --> 00:05:50,390
oriente a la etiología de esta hipoglicemia espontánea

86
00:05:50,390 --> 00:05:54,630
vamos a ver un cuadro respecto al peptidoseya la insulina de

87
00:05:54,630 --> 00:05:59,630
distintas causas de hipoglicemia de manera que nos las aprendamos y

88
00:05:59,630 --> 00:06:04,270
podamos identificar un cuadro clínico si está con insulina exógena obviamente

89
00:06:04,270 --> 00:06:08,750
el peptidosee va a estar bajo porque mide solamente la insulina endógena en

90
00:06:08,750 --> 00:06:13,510
cambio la insulina plasmática si va a estar elevada así que ese va a ser

91
00:06:13,510 --> 00:06:17,270
el clásico patrón de hiperinsulinismo pero con el peptidosee

92
00:06:17,270 --> 00:06:23,030
bajo es por administración de insulina exógena en el caso de

93
00:06:23,030 --> 00:06:27,750
las sulfonilubrias de la glivianclamida obviamente se induce una

94
00:06:27,750 --> 00:06:31,910
liberación pancreática de insulina así que tanto el peptidosee como la

95
00:06:31,910 --> 00:06:36,150
insulina van a estar ambos elevados en el caso del insulina igualmente hay un

96
00:06:36,150 --> 00:06:41,070
tumor que está en el páncreas y que va liberando y produciendo insulina así

97
00:06:41,070 --> 00:06:44,990
que nuevamente tanto el peptidosee como la insulina van a estar elevadas

98
00:06:44,990 --> 00:06:49,710
entonces como hago para diferenciar una insulina facticia por

99
00:06:49,710 --> 00:06:54,630
sulfonilubrias de un insulina bueno midiendo directamente niveles

100
00:06:54,630 --> 00:07:00,750
plasmáticos de sulfonilubrias en sangre ahora la resistencia a la insulina

101
00:07:00,750 --> 00:07:05,230
la reactiva obviamente hay un hiperinsulinismo y una hipersecreción

102
00:07:05,230 --> 00:07:09,310
de insulina así que lo más probable es que el peptidosee y la insulina van a

103
00:07:09,310 --> 00:07:13,070
estar altas ahora no siempre hay algunas veces en que están dentro de

104
00:07:13,070 --> 00:07:16,190
rango normal por si acaso pero lo más frecuente es que todas estas

105
00:07:16,190 --> 00:07:21,230
estén altas y finalmente las que son de ayuno por algo que se lleva

106
00:07:21,230 --> 00:07:26,470
la glucosa como un cáncer por ejemplo en ese caso al no haber azúcar

107
00:07:26,470 --> 00:07:29,990
seguramente no va a haber secreción de insulina tampoco y el peptidosee va a

108
00:07:29,990 --> 00:07:33,750
estar bajo así que en este caso ambas van a estar bajas igual

109
00:07:33,750 --> 00:07:37,710
eso es todo lo importante es saber reconocerlos pero seguramente no en

110
00:07:37,710 --> 00:07:41,390
ese orden sino que al revés si es que yo les digo tiene la insulina

111
00:07:41,390 --> 00:07:45,870
alta y el peptidosee bajo insulina exógena tiene la insulina alta y

112
00:07:45,870 --> 00:07:49,910
el peptidosee alto pues cualquier cosa que genere secreción de insulina

113
00:07:49,910 --> 00:07:56,190
las sulfoniluria, un insulinoma y las reactivas también y qué pasa si están

114
00:07:56,190 --> 00:08:01,150
todos bajos pues en ese caso hay algo que se está llevando la glucosa por

115
00:08:01,150 --> 00:08:04,390
cuenta propia como ejemplo un tumor así que ahí queda más o menos claro

116
00:08:04,390 --> 00:08:07,550
y nos vemos en los siguientes vídeos que ya vamos a entrar a Dislipidemia

117
00:08:07,550 --> 00:08:09,910
que estén bien',
    'Ya conocemos la clínica y el tratamiento de la hipoglicemia. En esta cápsula nos enfocaremos en entender sus causas y en cómo estudiar etiológicamente a un paciente que la presenta. Este es un tema de gran rendimiento para el EUNACOM porque permite integrar fisiología, clínica y laboratorio.

La clasificación más útil divide las hipoglicemias en dos grandes grupos: las provocadas y las espontáneas.

Las hipoglicemias provocadas son aquellas que tienen una causa farmacológica clara. Las más frecuentes son las producidas por insulina exógena y por los hipoglicemiantes orales secretagogos, en particular las sulfonilureas como la glibenclamida, y también las metiglinidas, que actúan de forma similar. Dentro de las provocadas existe una distinción importante: las que son reacciones adversas conocidas en el tratamiento del paciente diabético y, las que son facticias, es decir, hipoglicemias generadas por el consumo oculto de insulina o de hipoglicemiantes en un paciente que no reconoce estar usando estos fármacos. Estas últimas se presentan clínicamente como si fueran espontáneas y representan un desafío diagnóstico, porque el paciente no lo declara voluntariamente.',
    '["Hipoglicemia provocada: por insulina o hipoglicemiantes (sulfonilureas, metiglinidas). Puede ser reacción adversa o facticia (consumo oculto).","Hipoglicemia espontánea reactiva: 2-4 h poscomer. Causa más frecuente: resistencia a la insulina con hiperinsulinismo compensatorio.","Hipoglicemia espontánea de ayuno: 4-6 h o más. Causas: insulinoma, tumores grandes (sarcoma, linfoma), autoinmune (anticuerpos anti-insulina o anti-receptor).","Péptido C bajo + insulina alta = insulina exógena. Péptido C alto + insulina alta = secreción endógena (insulinoma, sulfonilureas, reactiva). Ambos bajos = tumor que consume glucosa.","Prueba de tolerancia a comida mixta (reactivas) y prueba de ayuno (de ayuno) son los métodos de provocación preferidos para objetivar la hipoglicemia."]'::jsonb,
    '[{"para":"\"REACTIVA = Come y baja (2-4 h). AYUNO = No come y baja (>4-6 h)\"","nemotecnia":"\"REACTIVA = Come y baja (2-4 h). AYUNO = No come y baja (>4-6 h)\"","explicacion":"El contexto temporal del episodio orienta inmediatamente al tipo de hipoglicemia. Reactiva va con hiperinsulinismo por resistencia; ayuno va con insulinoma o tumor.\nEl contexto temporal del episodio orienta inmediatamente al tipo de hipoglicemia. Reactiva va con hiperinsulinismo por resistencia; ayuno va con insulinoma o tumor."},{"para":"\"Péptido C BAJO + Insulina ALTA = Insulina EXÓGENA (facticia)\"","nemotecnia":"\"Péptido C BAJO + Insulina ALTA = Insulina EXÓGENA (facticia)\"","explicacion":"El péptido C solo mide insulina propia. Si no hay péptido C pero sí insulina = alguien se está pinchando insulina sin decirlo.El péptido C solo mide insulina propia. Si no hay péptido C pero sí insulina = alguien se está pinchando insulina sin decirlo."},{"para":"\"Los DOS altos = páncreas produce (insulinoma, sulfonilurea, reactiva). Los DOS bajos = tumor consume glucosa\"","nemotecnia":"\"Los DOS altos = páncreas produce (insulinoma, sulfonilurea, reactiva). Los DOS bajos = tumor consume glucosa\"","explicacion":"Cuando péptido C e insulina están ambos elevados, el páncreas está hipersecretando. Cuando ambos están bajos, hay consumo extrapancreático de glucosa.Cuando péptido C e insulina están ambos elevados, el páncreas está hipersecretando. Cuando ambos están bajos, hay consumo extrapancreático de glucosa."}]'::jsonb,
    '["Hipoglicemia provocada: por insulina o hipoglicemiantes (sulfonilureas, metiglinidas). Puede ser reacción adversa o facticia (consumo oculto).","Hipoglicemia espontánea reactiva: 2-4 h poscomer. Causa más frecuente: resistencia a la insulina con hiperinsulinismo compensatorio.","Hipoglicemia espontánea de ayuno: 4-6 h o más. Causas: insulinoma, tumores grandes (sarcoma, linfoma), autoinmune (anticuerpos anti-insulina o anti-receptor)."]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    NOW(),
    TRUE,
    FALSE  -- first 3 free preview
  ) ON CONFLICT (specialty_id, order_index)
  DO UPDATE SET
    title            = EXCLUDED.title,
    duration_seconds = EXCLUDED.duration_seconds,
    txt_content      = EXCLUDED.txt_content,
    srt_content      = EXCLUDED.srt_content,
    ai_summary       = EXCLUDED.ai_summary,
    ai_key_concepts  = EXCLUDED.ai_key_concepts,
    ai_mnemonics     = EXCLUDED.ai_mnemonics,
    ai_high_yield    = EXCLUDED.ai_high_yield,
    ai_review_qs     = EXCLUDED.ai_review_qs,
    ai_processed_at  = NOW(),
    is_available     = TRUE;

  -- Cápsula 22: Tratamiento de las Dislipidemias — Enfoque Práctico y Estratificación de Riesgo
  INSERT INTO lessons (
    specialty_id, title, order_index, duration_seconds,
    txt_content, srt_content,
    ai_summary, ai_key_concepts, ai_mnemonics,
    ai_high_yield, ai_algorithms, ai_review_qs,
    ai_processed_at, is_available, is_free_preview
  ) VALUES (
    v_specialty_id,
    'Tratamiento de las Dislipidemias — Enfoque Práctico y Estratificación de Riesgo',
    22,
    709,
    'Hola, hola, ¿cómo están? Hablemos del manejo de las dilipidemias y dentro de él vamos a ver qué

son las dilipidemias y todo ese tipo de cosas que son importantes más allá del manejo. Ahora,

a grandes rasgos, el tratamiento no farmacológico hay que indicarlo siempre. De hecho,

la vida sana, la dieta, el ejercicio, es algo que no solamente aplica a las

personas con enfermedades, sino que a todas las personas en general. En el caso de la

hipercolesterolemia LDL, que es la más mala de todas por su caso, habitualmente se le deja

una dieta baja en grasas saturadas, dado que no solamente el colesterol que se consume,

sino que en particular las grasas saturadas es lo que más eleva los niveles de LDL. Ahora,

hay que ir a buscar, además, dentro de otras causas secundarias, el hipotiroidismo. El

hipotiroidismo habitualmente se asocia a la hipercolesterolemia LDL al punto que alguien

con dilipidemia y un hipotiroidismo subclínico hay que tratar el hipotiroidismo

subclínico. Siguiendo acá, la hipertriliseridemia y la hipocolesterolemia HDL, o simplemente el

HDL bajo que se llama, habitualmente son causados por resistencia a la insulina,

así que si se le deja alguna dieta, es una dieta baja en azúcares refinados, baja en

carbohidratos de absorción rápida por el general. Como cosa importante, además, es muy

importante reducir el alcohol. De hecho, alguien con una hipertriliseridemia alta,

si es que está muy alta, no solamente que tiene riesgo de pancreatitis, sino que al estar con

consumo de alcohol que me eleva los triglicéridos, el consumo de alcohol per se me aumenta el

riesgo de pancreatitis también. Así que muchas veces la primera medida en alguien con

una hipertriliseridemia grave es suspender el alcohol, como la medida más urgente,

y además la hipertriliseridemia suele responder bastante mejor que las

hipercolesterolemia al cambio en el estilo de vida. De hecho, son como bien agradecidas

de que uno haga dieta, la verdad. Respecto a los fármacos que uno usa, pues la verdad es que

todos los fármacos hipolipemiantes sirven en todas las dilipidemias. Así que quede bien

claro, la evidencia dice que las estatinas, los fibratos, el ácido nicotínico, la resina,

el cetemib, etcétera, todos sirven para el manejo de todas las dilipidemias, para el

LDL alto, los triglicéridos altos y el HDL bajo. Hay algunos que sirven más para uno o

más para otros, pero sepan que la regla general es que las estatinas lo que más hacen es bajar

el LDL, aunque también tienen impacto en mejorar los triglicéridos y el HDL. Ahora,

cuando las estatinas no sirven o no son suficientes, ejemplo en una hipertriliseridemia

familiar o bien cuando están contraindicadas porque hacen una randomiólisis, por ejemplo,

en ese caso para el LDL sirve el cetemib. Acuérdense que el cetemib es un medicamento

que evita la absorción en específico del colesterol a nivel intestinal. No es lo

mismo que las resinas. Las resinas lo que hacen es absorber los lípidos en general y me las

bajan todas, pero el cetemib es específico para el colesterol LDL y de hecho su impacto

en los otros lípidos es bastante menor. Respecto a los triglicéridos lo que más

se usa son los fibratos, al menos como un medicamento específico para la hipertriliseridemia,

pero en la práctica, dado que la prioridad es el LDL, en la práctica la inmensa mayoría

de las hipertriliseridemias se manejan en verdad con estatinas manejando simultáneamente

el LDL, pero repito, los fibratos inciden mayormente en los triglicéridos, así que

serían de elección en una hipertriliseridemia muy severa, por ejemplo, que lo vamos a ver

ahora pronto. En el caso del HDL bajo lo que más sirve es la niacina, que es lo

mismo que el ácido nicotínico, pero sepan que en verdad no hay tanta evidencia respecto

a su utilidad, así que si bien mejoran los niveles de HDL y los elevan, que lo

bueno en este caso es que estén alto, la verdad es que no se ha demostrado que

eso sirva para algo desde el punto de vista clínico. Ahora, ¿cuál es la prioridad

del manejo de las dilipidemias en el sentido en que con mucha frecuencia no

solamente tiene un lípido malo, sino que varios de estos lípidos malos? Es el LDL,

el bajar el LDL es siempre lo más importante, así que habitualmente se maneja con

estatinas. Ahora, luego vienen los triglicéridos y finalmente el HDL, sabiendo que el

manejo del HDL habitualmente es el manejo de los otros lípidos, porque no hay

evidencia que manejarlo de manera específica sirva para algo. Hay una gran

excepción que son los triglicéridos arriba de 500, esto no tiene tanta

evidencia científica, de hecho hay gente que dice que aunque estén arriba de

500 hay que manejar el LDL igual, pero la recomendación más general es que

cuando están arriba de 500 hay que partir con fibratos porque ahí el

riesgo de la pancretitis sería un poquito más alto al riesgo de los

infartos a largo plazo del LDL. Ahora, cuando yo inicie un fármaco la

verdad es que va a depender de varias cosas, en el caso del LDL alto

de la hipercolesterolemia LDL, lo primero antes de ver si es que vaya a

partir un fármaco o no, es determinar el riesgo cardiovascular y eso se hace

con el score de Framingham viendo los distintos factores de riesgo,

cierto, y de esa manera se calcula finalmente cuál es su factor de

riesgo, cuál es su nivel de riesgo, perdón, y si es que tiene un riesgo

cardiovascular alto o muy alto, arriba de 20% de probabilidad de tener un

infarto de aquí a 10 años, eso se considera alto, o bien si es que es

moderado, entre 10 y 20%, o bien si es que es bajo, menor a 10% de riesgo de un

infarto de aquí a 10 años, es la forma en que yo voy a determinar el

objetivo de los niveles del LDL, de manera de determinar igualmente si es

que le dejo estatinas o no. Ahora, ¿se dejan estatinas sí o no? En el caso

del riesgo cardiovascular alto la verdad es que se dejan estatinas

siempre, independiente de los niveles de LDL, aunque los LDL estén muy

bajos, que sería muy raro que simultáneamente tuviera un riesgo

cardiovascular tan alto, pero en ese caso le dejo estatinas igual, sabiendo que

el óptimo ahí va a ser que tenga un LDL bajo 70. Si es que es moderado, la

verdad que lo más probable es que va a quedar con estatinas igual, en este

caso ya no es obligatorio, sino que se evalúa el riesgo beneficio con

el paciente, pero se le ofrece, y el objetivo ideal del LDL va a ser

bajo 100, bajo 130 sale en algunas partes, pero actualmente se se prefiere

dejar las estatinas nomás porque son baratas, son seguras, y la verdad es que

son bien toleradas por el paciente y disminuye el riesgo. Y finalmente, si

el riesgo cardiovascular es bajo, en ese caso las estatinas por el

general no se dan, a menos claro que el LDL está demasiado alto, arriba

de 190, ahí de entrada parto con estatinas, o bien cuando está arriba

de 160 después de tres meses de dieta. O sea, en resumen, las estatinas van

casi siempre en riesgo alto, en riesgo moderado, y en el riesgo bajo solamente

cuando está arriba de 60 y no responde, o cuando está arriba de 190.

Ese es como el gran resumen. Ahora, en el caso de los triliséridos altos,

por el general yo siempre empiezo con dieta y con el suspender el hábito

alcohólico, recordando que responde bastante bien, y si es que no anda

bien, pues ahí recién voy a ver si es que está arriba de 500, en ese caso le

dejo un fibrato, sabiendo que los fibratos que se usan habitualmente son

el genfibrocilo y el fenofibrato. En cambio, si es que está abajo de

500, por el general voy a ir a ver el LDL. Si es que el LDL está

alto, en ese caso manda el LDL, así que le voy a dejar estatinas. Así que

en resumen, número uno siempre es la intervención no farmacológica. Ahora,

obviamente, si es que ya hacía una buena dieta y no consumía tanto alcohol,

si está arriba de 500, voy directamente a los fibratos. Volvamos acá a la

arriba de 500. En general, el riesgo de pancreatitis empieza a disparar desde

500 hacia arriba, pero es muy raro si es que está bajo 1000 o bajo 1500,

la verdad. En cambio, arriba de 1000 o 1500, el riesgo ya es muchísimo más

alto, así que ahí incluso, si es que está arriba de 1500 o 1600, eventualmente

se hospitaliza y se maneja con insulina, en el sentido en que eso es algo que

baja también muy rápido la trigliceridemia. Siguiendo acá, ¿qué cosa

pasa si es que estuviera con triglicéridos menor a 500? O sea, uno

dice, hasta ahí al menos per se, no voy con los fibratos al tiro, con un

LDL que está normal, así que tampoco me da mucha gana de darle

estatina por el LDL y con un riesgo cardiovascular que está bajo, así que

tampoco tiene indicación de estatina ahí per se. Bueno, en ese caso evaluo si

luego hay fibratos o no. Si le dejo solamente dieta o si es que le dejo un

fibrato además en el caso de que no ande bien con la dieta. Dejando bien

claro esto, no hay tanta evidencia de que los fibratos disminuyan

efectivamente las complicaciones de la hipertrigliceridemia, así que se

dejan cuando hay riesgos de pancreatitis, pero desde el punto de

vista del riesgo cardiovascular, el impacto de los triglicéridos no es tan

grande y por lo mismo es que el LDL es la prioridad casi siempre. Un poquito

enredado, pero espero que seáis entendidos. Ahora, respecto al HDL

bajo, en ese caso no hay evidencia de que el manejo dirigido sirva para

algo, así que en la práctica lo que uno hace es manejar el LDL que es

lo más importante, los triglicéridos y obviamente la resistencia a la

insulina que suele ser la causa tanto de la hipertrigliceridemia como del

HDL bajo. Ahora, recuerden que el objetivo del HDL es que sea mayor a

50 en las mujeres y mayor a 40 en los hombres y a las personas que está

arriba de 60, por lo que la general es un factor protector, así que mucho

cuidado cuando alguien llega con o tengo el colesterol muy alto, porque

si es el colesterol total, la verdad queda absolutamente igual, lo que

importa en ese caso es ver cómo está el LDL, cómo ',
    '1
00:00:03,150 --> 00:00:07,910
Hola, hola, ¿cómo están? Hablemos del manejo de las dilipidemias y dentro de él vamos a ver qué

2
00:00:07,910 --> 00:00:12,270
son las dilipidemias y todo ese tipo de cosas que son importantes más allá del manejo. Ahora,

3
00:00:12,270 --> 00:00:16,630
a grandes rasgos, el tratamiento no farmacológico hay que indicarlo siempre. De hecho,

4
00:00:16,630 --> 00:00:20,190
la vida sana, la dieta, el ejercicio, es algo que no solamente aplica a las

5
00:00:20,190 --> 00:00:24,470
personas con enfermedades, sino que a todas las personas en general. En el caso de la

6
00:00:24,470 --> 00:00:30,310
hipercolesterolemia LDL, que es la más mala de todas por su caso, habitualmente se le deja

7
00:00:30,310 --> 00:00:35,270
una dieta baja en grasas saturadas, dado que no solamente el colesterol que se consume,

8
00:00:35,270 --> 00:00:41,750
sino que en particular las grasas saturadas es lo que más eleva los niveles de LDL. Ahora,

9
00:00:41,750 --> 00:00:46,070
hay que ir a buscar, además, dentro de otras causas secundarias, el hipotiroidismo. El

10
00:00:46,070 --> 00:00:51,830
hipotiroidismo habitualmente se asocia a la hipercolesterolemia LDL al punto que alguien

11
00:00:51,830 --> 00:00:55,750
con dilipidemia y un hipotiroidismo subclínico hay que tratar el hipotiroidismo

12
00:00:55,830 --> 00:01:03,550
subclínico. Siguiendo acá, la hipertriliseridemia y la hipocolesterolemia HDL, o simplemente el

13
00:01:03,550 --> 00:01:08,470
HDL bajo que se llama, habitualmente son causados por resistencia a la insulina,

14
00:01:08,470 --> 00:01:13,470
así que si se le deja alguna dieta, es una dieta baja en azúcares refinados, baja en

15
00:01:13,470 --> 00:01:18,390
carbohidratos de absorción rápida por el general. Como cosa importante, además, es muy

16
00:01:18,390 --> 00:01:22,710
importante reducir el alcohol. De hecho, alguien con una hipertriliseridemia alta,

17
00:01:22,910 --> 00:01:27,750
si es que está muy alta, no solamente que tiene riesgo de pancreatitis, sino que al estar con

18
00:01:27,750 --> 00:01:31,830
consumo de alcohol que me eleva los triglicéridos, el consumo de alcohol per se me aumenta el

19
00:01:31,830 --> 00:01:35,910
riesgo de pancreatitis también. Así que muchas veces la primera medida en alguien con

20
00:01:35,910 --> 00:01:41,750
una hipertriliseridemia grave es suspender el alcohol, como la medida más urgente,

21
00:01:41,750 --> 00:01:45,950
y además la hipertriliseridemia suele responder bastante mejor que las

22
00:01:45,950 --> 00:01:50,550
hipercolesterolemia al cambio en el estilo de vida. De hecho, son como bien agradecidas

23
00:01:50,550 --> 00:01:56,350
de que uno haga dieta, la verdad. Respecto a los fármacos que uno usa, pues la verdad es que

24
00:01:56,350 --> 00:02:01,790
todos los fármacos hipolipemiantes sirven en todas las dilipidemias. Así que quede bien

25
00:02:01,790 --> 00:02:06,950
claro, la evidencia dice que las estatinas, los fibratos, el ácido nicotínico, la resina,

26
00:02:06,950 --> 00:02:12,150
el cetemib, etcétera, todos sirven para el manejo de todas las dilipidemias, para el

27
00:02:12,150 --> 00:02:18,030
LDL alto, los triglicéridos altos y el HDL bajo. Hay algunos que sirven más para uno o

28
00:02:18,030 --> 00:02:24,430
más para otros, pero sepan que la regla general es que las estatinas lo que más hacen es bajar

29
00:02:24,430 --> 00:02:30,230
el LDL, aunque también tienen impacto en mejorar los triglicéridos y el HDL. Ahora,

30
00:02:30,230 --> 00:02:36,550
cuando las estatinas no sirven o no son suficientes, ejemplo en una hipertriliseridemia

31
00:02:36,550 --> 00:02:41,630
familiar o bien cuando están contraindicadas porque hacen una randomiólisis, por ejemplo,

32
00:02:41,630 --> 00:02:48,830
en ese caso para el LDL sirve el cetemib. Acuérdense que el cetemib es un medicamento

33
00:02:48,830 --> 00:02:53,670
que evita la absorción en específico del colesterol a nivel intestinal. No es lo

34
00:02:53,670 --> 00:02:59,510
mismo que las resinas. Las resinas lo que hacen es absorber los lípidos en general y me las

35
00:02:59,510 --> 00:03:04,990
bajan todas, pero el cetemib es específico para el colesterol LDL y de hecho su impacto

36
00:03:04,990 --> 00:03:10,550
en los otros lípidos es bastante menor. Respecto a los triglicéridos lo que más

37
00:03:10,550 --> 00:03:15,390
se usa son los fibratos, al menos como un medicamento específico para la hipertriliseridemia,

38
00:03:15,390 --> 00:03:21,750
pero en la práctica, dado que la prioridad es el LDL, en la práctica la inmensa mayoría

39
00:03:21,750 --> 00:03:26,670
de las hipertriliseridemias se manejan en verdad con estatinas manejando simultáneamente

40
00:03:26,670 --> 00:03:33,110
el LDL, pero repito, los fibratos inciden mayormente en los triglicéridos, así que

41
00:03:33,110 --> 00:03:36,910
serían de elección en una hipertriliseridemia muy severa, por ejemplo, que lo vamos a ver

42
00:03:36,910 --> 00:03:42,630
ahora pronto. En el caso del HDL bajo lo que más sirve es la niacina, que es lo

43
00:03:42,630 --> 00:03:47,350
mismo que el ácido nicotínico, pero sepan que en verdad no hay tanta evidencia respecto

44
00:03:47,350 --> 00:03:53,390
a su utilidad, así que si bien mejoran los niveles de HDL y los elevan, que lo

45
00:03:53,390 --> 00:03:57,630
bueno en este caso es que estén alto, la verdad es que no se ha demostrado que

46
00:03:57,630 --> 00:04:01,910
eso sirva para algo desde el punto de vista clínico. Ahora, ¿cuál es la prioridad

47
00:04:01,910 --> 00:04:06,230
del manejo de las dilipidemias en el sentido en que con mucha frecuencia no

48
00:04:06,230 --> 00:04:11,950
solamente tiene un lípido malo, sino que varios de estos lípidos malos? Es el LDL,

49
00:04:11,950 --> 00:04:17,270
el bajar el LDL es siempre lo más importante, así que habitualmente se maneja con

50
00:04:17,270 --> 00:04:23,710
estatinas. Ahora, luego vienen los triglicéridos y finalmente el HDL, sabiendo que el

51
00:04:23,710 --> 00:04:27,670
manejo del HDL habitualmente es el manejo de los otros lípidos, porque no hay

52
00:04:27,670 --> 00:04:32,070
evidencia que manejarlo de manera específica sirva para algo. Hay una gran

53
00:04:32,070 --> 00:04:36,350
excepción que son los triglicéridos arriba de 500, esto no tiene tanta

54
00:04:36,350 --> 00:04:40,950
evidencia científica, de hecho hay gente que dice que aunque estén arriba de

55
00:04:40,950 --> 00:04:46,270
500 hay que manejar el LDL igual, pero la recomendación más general es que

56
00:04:46,270 --> 00:04:49,630
cuando están arriba de 500 hay que partir con fibratos porque ahí el

57
00:04:49,630 --> 00:04:52,910
riesgo de la pancretitis sería un poquito más alto al riesgo de los

58
00:04:52,910 --> 00:04:57,510
infartos a largo plazo del LDL. Ahora, cuando yo inicie un fármaco la

59
00:04:57,510 --> 00:05:01,230
verdad es que va a depender de varias cosas, en el caso del LDL alto

60
00:05:01,230 --> 00:05:05,070
de la hipercolesterolemia LDL, lo primero antes de ver si es que vaya a

61
00:05:05,070 --> 00:05:09,830
partir un fármaco o no, es determinar el riesgo cardiovascular y eso se hace

62
00:05:09,830 --> 00:05:12,630
con el score de Framingham viendo los distintos factores de riesgo,

63
00:05:12,630 --> 00:05:16,470
cierto, y de esa manera se calcula finalmente cuál es su factor de

64
00:05:16,470 --> 00:05:21,150
riesgo, cuál es su nivel de riesgo, perdón, y si es que tiene un riesgo

65
00:05:21,150 --> 00:05:26,390
cardiovascular alto o muy alto, arriba de 20% de probabilidad de tener un

66
00:05:26,390 --> 00:05:30,470
infarto de aquí a 10 años, eso se considera alto, o bien si es que es

67
00:05:30,470 --> 00:05:35,910
moderado, entre 10 y 20%, o bien si es que es bajo, menor a 10% de riesgo de un

68
00:05:35,910 --> 00:05:38,990
infarto de aquí a 10 años, es la forma en que yo voy a determinar el

69
00:05:38,990 --> 00:05:44,350
objetivo de los niveles del LDL, de manera de determinar igualmente si es

70
00:05:44,350 --> 00:05:49,750
que le dejo estatinas o no. Ahora, ¿se dejan estatinas sí o no? En el caso

71
00:05:49,750 --> 00:05:53,030
del riesgo cardiovascular alto la verdad es que se dejan estatinas

72
00:05:53,030 --> 00:05:58,150
siempre, independiente de los niveles de LDL, aunque los LDL estén muy

73
00:05:58,150 --> 00:06:03,790
bajos, que sería muy raro que simultáneamente tuviera un riesgo

74
00:06:03,790 --> 00:06:08,230
cardiovascular tan alto, pero en ese caso le dejo estatinas igual, sabiendo que

75
00:06:08,230 --> 00:06:14,350
el óptimo ahí va a ser que tenga un LDL bajo 70. Si es que es moderado, la

76
00:06:14,350 --> 00:06:17,310
verdad que lo más probable es que va a quedar con estatinas igual, en este

77
00:06:17,310 --> 00:06:20,390
caso ya no es obligatorio, sino que se evalúa el riesgo beneficio con

78
00:06:20,390 --> 00:06:25,150
el paciente, pero se le ofrece, y el objetivo ideal del LDL va a ser

79
00:06:25,150 --> 00:06:31,350
bajo 100, bajo 130 sale en algunas partes, pero actualmente se se prefiere

80
00:06:31,350 --> 00:06:35,110
dejar las estatinas nomás porque son baratas, son seguras, y la verdad es que

81
00:06:35,110 --> 00:06:38,710
son bien toleradas por el paciente y disminuye el riesgo. Y finalmente, si

82
00:06:38,710 --> 00:06:42,870
el riesgo cardiovascular es bajo, en ese caso las estatinas por el

83
00:06:42,870 --> 00:06:46,990
general no se dan, a menos claro que el LDL está demasiado alto, arriba

84
00:06:46,990 --> 00:06:52,150
de 190, ahí de entrada parto con estatinas, o bien cuando está arriba

85
00:06:52,190 --> 00:06:56,830
de 160 después de tres meses de dieta. O sea, en resumen, las estatinas van

86
00:06:56,830 --> 00:07:01,630
casi siempre en riesgo alto, en riesgo moderado, y en el riesgo bajo solamente

87
00:07:01,630 --> 00:07:06,590
cuando está arriba de 60 y no responde, o cuando está arriba de 190.

88
00:07:06,590 --> 00:07:10,830
Ese es como el gran resumen. Ahora, en el caso de los triliséridos altos,

89
00:07:10,830 --> 00:07:15,750
por el general yo siempre empiezo con dieta y con el suspender el hábito

90
00:07:15,750 --> 00:07:19,630
alcohólico, recordando que responde bastante bien, y si es que no anda

91
00:07:19,670 --> 00:07:23,950
bien, pues ahí recién voy a ver si es que está arriba de 500, en ese caso le

92
00:07:23,950 --> 00:07:29,430
dejo un fibrato, sabiendo que los fibratos que se usan habitualmente son

93
00:07:29,430 --> 00:07:34,390
el genfibrocilo y el fenofibrato. En cambio, si es que está abajo de

94
00:07:34,390 --> 00:07:39,790
500, por el general voy a ir a ver el LDL. Si es que el LDL está

95
00:07:39,790 --> 00:07:44,750
alto, en ese caso manda el LDL, así que le voy a dejar estatinas. Así que

96
00:07:44,870 --> 00:07:49,670
en resumen, número uno siempre es la intervención no farmacológica. Ahora,

97
00:07:49,670 --> 00:07:53,710
obviamente, si es que ya hacía una buena dieta y no consumía tanto alcohol,

98
00:07:53,710 --> 00:07:58,950
si está arriba de 500, voy directamente a los fibratos. Volvamos acá a la

99
00:07:58,950 --> 00:08:02,910
arriba de 500. En general, el riesgo de pancreatitis empieza a disparar desde

100
00:08:02,910 --> 00:08:07,830
500 hacia arriba, pero es muy raro si es que está bajo 1000 o bajo 1500,

101
00:08:07,830 --> 00:08:11,910
la verdad. En cambio, arriba de 1000 o 1500, el riesgo ya es muchísimo más

102
00:08:11,910 --> 00:08:18,190
alto, así que ahí incluso, si es que está arriba de 1500 o 1600, eventualmente

103
00:08:18,190 --> 00:08:22,310
se hospitaliza y se maneja con insulina, en el sentido en que eso es algo que

104
00:08:22,310 --> 00:08:27,790
baja también muy rápido la trigliceridemia. Siguiendo acá, ¿qué cosa

105
00:08:27,790 --> 00:08:32,270
pasa si es que estuviera con triglicéridos menor a 500? O sea, uno

106
00:08:32,270 --> 00:08:36,870
dice, hasta ahí al menos per se, no voy con los fibratos al tiro, con un

107
00:08:36,870 --> 00:08:40,750
LDL que está normal, así que tampoco me da mucha gana de darle

108
00:08:40,750 --> 00:08:44,870
estatina por el LDL y con un riesgo cardiovascular que está bajo, así que

109
00:08:44,870 --> 00:08:50,350
tampoco tiene indicación de estatina ahí per se. Bueno, en ese caso evaluo si

110
00:08:50,350 --> 00:08:54,630
luego hay fibratos o no. Si le dejo solamente dieta o si es que le dejo un

111
00:08:54,630 --> 00:08:58,070
fibrato además en el caso de que no ande bien con la dieta. Dejando bien

112
00:08:58,070 --> 00:09:01,950
claro esto, no hay tanta evidencia de que los fibratos disminuyan

113
00:09:01,950 --> 00:09:05,590
efectivamente las complicaciones de la hipertrigliceridemia, así que se

114
00:09:05,590 --> 00:09:08,430
dejan cuando hay riesgos de pancreatitis, pero desde el punto de

115
00:09:08,430 --> 00:09:11,830
vista del riesgo cardiovascular, el impacto de los triglicéridos no es tan

116
00:09:11,830 --> 00:09:16,230
grande y por lo mismo es que el LDL es la prioridad casi siempre. Un poquito

117
00:09:16,230 --> 00:09:20,510
enredado, pero espero que seáis entendidos. Ahora, respecto al HDL

118
00:09:20,510 --> 00:09:26,830
bajo, en ese caso no hay evidencia de que el manejo dirigido sirva para

119
00:09:26,830 --> 00:09:31,270
algo, así que en la práctica lo que uno hace es manejar el LDL que es

120
00:09:31,270 --> 00:09:34,790
lo más importante, los triglicéridos y obviamente la resistencia a la

121
00:09:34,790 --> 00:09:38,430
insulina que suele ser la causa tanto de la hipertrigliceridemia como del

122
00:09:38,430 --> 00:09:43,990
HDL bajo. Ahora, recuerden que el objetivo del HDL es que sea mayor a

123
00:09:43,990 --> 00:09:47,790
50 en las mujeres y mayor a 40 en los hombres y a las personas que está

124
00:09:47,790 --> 00:09:52,630
arriba de 60, por lo que la general es un factor protector, así que mucho

125
00:09:52,630 --> 00:09:56,990
cuidado cuando alguien llega con o tengo el colesterol muy alto, porque

126
00:09:56,990 --> 00:10:00,790
si es el colesterol total, la verdad queda absolutamente igual, lo que

127
00:10:00,790 --> 00:10:04,570
importa en ese caso es ver cómo está el LDL, cómo está el

128
00:10:04,570 --> 00:10:08,390
triglicérido y cómo está el HDL, porque si es que yo tengo una

129
00:10:08,390 --> 00:10:13,670
hipercolesterolemia total a expensas solamente de HDL, eso es bueno, no es

130
00:10:13,670 --> 00:10:19,470
malo, sino que es un factor protector. Ahora, veamos el listado de las cosas

131
00:10:19,470 --> 00:10:24,550
que tienen un riesgo cardiovascular máximo o muy alto por el solo hecho

132
00:10:24,550 --> 00:10:27,670
de existir y son todas las cosas que se relacionan a enfermedad

133
00:10:27,670 --> 00:10:31,750
coronaria, dígase un infarto previo, o que se haya demostrado enfermedad

134
00:10:31,750 --> 00:10:34,870
coronaria en una coronareografía, en un test de esfuerzo, con una gina

135
00:10:34,870 --> 00:10:39,670
crónica, aunque no haya tenido un infarto previo, eso es número uno. Dos, todos

136
00:10:39,670 --> 00:10:43,230
los equivalentes coronarios que son las otras arterias que están enfermas,

137
00:10:43,230 --> 00:10:47,550
las otras arterias que están tapadas, dígase un anurisma de la horta

138
00:10:47,550 --> 00:10:51,390
abdominal, porque acuérdense que el anurisma órtico es causado

139
00:10:51,390 --> 00:10:54,470
habitualmente por una placa ateromatosa, lo mismo que la

140
00:10:54,470 --> 00:10:58,030
claudicación intermitente o la enfermedad arterial periférica, peor

141
00:10:58,030 --> 00:11:03,510
todavía si es que es una isquemia crítica, la enfermedad de las carótidas,

142
00:11:03,510 --> 00:11:08,030
la enfermedad carotidia, obviamente de causa arteriosclerótica, y

143
00:11:08,030 --> 00:11:11,430
finalmente la diabetes y la subrayo acá, porque la diabetes mellitus

144
00:11:11,430 --> 00:11:15,910
tiene un riesgo muy muy similar a haber tenido un infarto previo para el

145
00:11:15,910 --> 00:11:19,750
riesgo de tener uno de infarto, así que en la práctica, cualquiera que

146
00:11:19,750 --> 00:11:23,710
tenga cualquiera de esas cosas, va a quedar con estatina sí o sí, va a

147
00:11:23,710 --> 00:11:29,230
quedar con un objetivo de LDL de menos de 70, así que lo más probable es que

148
00:11:29,230 --> 00:11:33,390
va a quedar con una dosis de estatina relativamente alta, así ejemplo

149
00:11:33,390 --> 00:11:37,910
atorvastatina entre 40 y 80 milígramos al día, y va a quedar con

150
00:11:37,910 --> 00:11:41,430
aspirina obviamente para reducir el riesgo de infarto también, y bueno

151
00:11:41,430 --> 00:11:45,710
eso fue Dilipidemia al menos del manejo general, en otro vídeo vamos a ver

152
00:11:45,710 --> 00:11:49,150
algunos detalles o algunas cosas un poquito más específicas, así que ahí

153
00:11:49,150 --> 00:11:51,830
nos vemos, que estén bien.',
    'En esta cápsula abordaremos el manejo de las dislipidemias, un tema que combina epidemiología cardiovascular, farmacología y criterios de tratamiento basados en evidencia. Es un tema frecuente en el EUNACOM y requiere que dominen tanto los conceptos básicos como los umbrales específicos de intervención.

Comencemos con lo más fundamental: el tratamiento no farmacológico es siempre la base, independiente del tipo de dislipidemia y del riesgo cardiovascular del paciente. La dieta y el ejercicio se recomiendan a toda persona, no solo a quienes tienen patología. En la hipercolesterolemia con LDL elevado, la intervención dietética específica es reducir las grasas saturadas, que son el principal estímulo para la síntesis hepática de LDL. Y en este contexto, siempre hay que buscar causas secundarias: el hipotiroidismo es la causa secundaria más frecuente de hipercolesterolemia LDL, y un hipotiroidismo subclínico puede ser el responsable de una dislipidemia que no responde bien al tratamiento estándar.

En la hipertrigliceridemia y el HDL bajo, la causa más frecuente es la resistencia a la insulina. La dieta indicada aquí es baja en azúcares refinados y carbohidratos de absorción rápida. Además, la reducción del consumo de alcohol es una medida prioritaria, porque el alcohol eleva los triglicéridos de manera directa. De hecho, en alguien con triglicéridos muy elevados que consume alcohol regularmente, la primera medida terapéutica más urgente es suspender el alcohol.',
    '["La prioridad siempre es el LDL. Las estatinas son el fármaco de primera línea. LDL menor a 70 en riesgo alto; menor a 100 en riesgo moderado.","Fibratos (gemfibrozilo, fenofibrato) son la elección específica para triglicéridos elevados, especialmente sobre 500 mg/dL por riesgo de pancreatitis.","Riesgo cardiovascular alto (Framingham >20%): estatinas siempre. Riesgo moderado (10-20%): estatinas habitualmente. Riesgo bajo (<10%): solo si LDL >190 o >160 sin respuesta a dieta.","La diabetes es equivalente a haber tenido un infarto: riesgo cardiovascular máximo → estatinas siempre + objetivo LDL <70 + aspirina.","HDL bajo sin evidencia de beneficio clínico al tratarlo directamente. El objetivo es HDL >40 hombres y >50 mujeres. HDL alto es factor protector, no problema."]'::jsonb,
    '[{"para":"\"LDL primero SIEMPRE → ESTATINAS. TG >500 → FIBRATOS urgente. HDL bajo → trata lo demás\"","nemotecnia":"\"LDL primero SIEMPRE → ESTATINAS. TG >500 → FIBRATOS urgente. HDL bajo → trata lo demás\"","explicacion":"La jerarquía del manejo lipídico. No hay excepción al orden: LDL es la prioridad salvo triglicéridos mayores a 500 donde el riesgo de pancreatitis urge.\nLa jerarquía del manejo lipídico. No hay excepción al orden: LDL es la prioridad salvo triglicéridos mayores a 500 donde el riesgo de pancreatitis urge."},{"para":"\"DIABÉTICO = RIESGO MÁXIMO = ESTATINA + LDL<70 + ASPIRINA (sin calcular Framingham)\"","nemotecnia":"\"DIABÉTICO = RIESGO MÁXIMO = ESTATINA + LDL<70 + ASPIRINA (sin calcular Framingham)\"","explicacion":"La diabetes tiene el mismo riesgo que un infarto previo. No se necesita Framingham. Va directo a estatinas y objetivo estricto de LDL.La diabetes tiene el mismo riesgo que un infarto previo. No se necesita Framingham. Va directo a estatinas y objetivo estricto de LDL."},{"para":"\"FRAMINGHAM: >20% → estatina siempre. 10-20% → estatina probablemente. <10% → solo si LDL>190\"","nemotecnia":"\"FRAMINGHAM: >20% → estatina siempre. 10-20% → estatina probablemente. <10% → solo si LDL>190\"","explicacion":"Los tres niveles de riesgo cardiovascular y sus umbrales de tratamiento. Fácil de memorizar en tres rangos porcentuales.Los tres niveles de riesgo cardiovascular y sus umbrales de tratamiento. Fácil de memorizar en tres rangos porcentuales."}]'::jsonb,
    '["La prioridad siempre es el LDL. Las estatinas son el fármaco de primera línea. LDL menor a 70 en riesgo alto; menor a 100 en riesgo moderado.","Fibratos (gemfibrozilo, fenofibrato) son la elección específica para triglicéridos elevados, especialmente sobre 500 mg/dL por riesgo de pancreatitis.","Riesgo cardiovascular alto (Framingham >20%): estatinas siempre. Riesgo moderado (10-20%): estatinas habitualmente. Riesgo bajo (<10%): solo si LDL >190 o >160 sin respuesta a dieta."]'::jsonb,
    '[]'::jsonb,
    '[{"pregunta":"¿Cuál de las siguientes afirmaciones sobre el tratamiento de las dislipidemias es correcta?","respuesta":"Respuesta correcta: D — En riesgo cardiovascular bajo, las estatinas se indican cuando el LDL supera 190 mg/dL de entrada, o cuando supera 160 mg/dL tras tres meses de dieta sin respuesta. Un LDL de 200 sin respuesta a dieta es indicación. Los fibratos se indican con triglicéridos >500 (no 350); la niacina no tiene beneficio cardiovascular demostrado claro; el diabético siempre tiene indicación de estatinas independiente del LDL; y las estatinas actúan inhibiendo la HMG-CoA reductasa hepática (no absorción intestinal, que es el mecanismo del ezetimibe)."}]'::jsonb,
    NOW(),
    TRUE,
    FALSE  -- first 3 free preview
  ) ON CONFLICT (specialty_id, order_index)
  DO UPDATE SET
    title            = EXCLUDED.title,
    duration_seconds = EXCLUDED.duration_seconds,
    txt_content      = EXCLUDED.txt_content,
    srt_content      = EXCLUDED.srt_content,
    ai_summary       = EXCLUDED.ai_summary,
    ai_key_concepts  = EXCLUDED.ai_key_concepts,
    ai_mnemonics     = EXCLUDED.ai_mnemonics,
    ai_high_yield    = EXCLUDED.ai_high_yield,
    ai_review_qs     = EXCLUDED.ai_review_qs,
    ai_processed_at  = NOW(),
    is_available     = TRUE;

  -- Cápsula 23: Miopatía por Estatinas — Diagnóstico y Manejo
  INSERT INTO lessons (
    specialty_id, title, order_index, duration_seconds,
    txt_content, srt_content,
    ai_summary, ai_key_concepts, ai_mnemonics,
    ai_high_yield, ai_algorithms, ai_review_qs,
    ai_processed_at, is_available, is_free_preview
  ) VALUES (
    v_specialty_id,
    'Miopatía por Estatinas — Diagnóstico y Manejo',
    23,
    344,
    'Hola, hola. Hablemos de las miopatías por estatinas. Al menos en medicina siempre

nos enseñan que las estatinas tienen riesgos de mialgia, de randomiólisis, de cosas

relacionadas con los músculos, pero adelantemos que son bastante infrecuentes

y que por el general las estatinas son fármacos eficaces, que reducen la

mortalidad por infarto y por patología cardiovascular, y son

bastante seguras, pero sepan que hay dos tipos de miopatías o de síntomas

relacionados a daño muscular por estatinas. Por un lado están las no

severas, dígase miálgias, un poquito de debilidad, y con las secas que pueden

estar absolutamente normales o bien un poquito elevadas, y las otras son las

más severas, que la más importante son la randomiólisis y aparte de eso la

mionecrosis, que puede ser una especie de reacción inmune y que

en el caso de que esté mediada por estatinas, obviamente hay que suspenderlas

En estos dos casos suele venir con la seca muy elevada, y de hecho el solo

hecho que la seca esté muy elevada en contexto del uso de estatinas ya me

hace sospechar fuertemente que hay una complicación severa. Ahora, ¿cuál es

el manejo de esto? Número uno, buscar otra causa. Al menos en las no

severas yo tengo tiempo para buscar una causa antes de suspender las

estatinas, y en ese caso le puedo pedir una TCH en busca de hipotiroidismo,

que es una causa de miopatía bien frecuente, y los niveles de vitamina D

también, que si está bajo eso me puede generar mialgias, etcétera. Ahora, luego

de eso se suspende y veo si es que se mejoran los síntomas, porque si no se

mejoran nunca, obviamente era causado o por una enfermedad

autoinmune, por ejemplo una polimiositis, una polimiaje aromática,

o por alguna cosa que produzca dolor sin nada mucho más grave como

una fibromialgia. Así que es muy importante que antes de creerle al

paciente que la causa de su mialgia son las estatinas, se busque otra causa

y se vea que los síntomas desaparezcan al suspender el medicamento.

Ahora, una vez que se suspenden y que desaparecen lo ideal es iniciar una

estatina diferente, y dentro de esas la fluvastatina, la pravastatina y la

pitavastatina son las que tienen menos riesgo de mialgia por el

general, pero tienen un problema que si bien tienen un bajísimo riesgo de

mialgia no son tan potentes para bajar el LDL, así que muchas veces uno se

queda con la duda acá y si le dejo su bastatina mejor que tiene un poquito

menos de riesgo de mialgia, pero el impacto en el LDL es un poquito

mejor, así que tengo esas dos opciones y la última opción que hay

también es bajarle la dosis. Ejemplo, el sistema público a lo

mejor no haya suficientes recursos como para darle algo diferente a la

atorvastatina, así que en ese caso simplemente si estaba con 80 milígramos

se lo bajo a 40 milígramos y veo cómo va. En el caso de la recurrencia, a

pesar de haber hecho estas cosas, de haber cambiado por una estatina

distinta o haber bajado esta dosis, pues no me queda más que

cambiarme de medicamento al Estimide, que acuérdense que impedía la

absorción a nivel intestinal del LDL, así que sirve bastante, pero

recordando que es un poquito menos eficaz que las estatinas. Ahora, si es

que viene con una de estas complicaciones más severa, aquí estoy

obligado a suspender sí o sí y no lo puedo reiniciar, sino que por el

contrario hay que hacer el manejo de la rhabdomiólisis, de la

mionecrosis, en el caso de la rhabdomiólisis con todo el

manejo de la falla renal, con la hidratación con serofisiológico y

en la mionecrosis obviamente con corticoides endovenoso, etcétera, y

aparte de eso tengo que ver si no estará interactuando con algún

otro fármaco, dado que es muy infrecuente que haya una

rhabdomiólisis por estatina, así que igualmente hay que ver que

no haya alguna otra causa que sea evidente y ver con qué fármaco

pueda estar interactuando, y dentro de esto el ejemplo más

clásico son los fibratos, de hecho la típica pregunta es ¿puedo

yo mezclar una estatina con un fibrato? y la respuesta es, con

el higienfibroxilo no, en el sentido en que se dispara el

riesgo de rhabdomiólisis, pero sí se puede con el fenofibrato

con mucho cuidado y solamente se hace en casos de

hipercolesterolemia, con una hipertirolemia muy alta que

no baja suficientemente con la estatina sola, en este

caso que dice que después de suspender en el caso de una

complicación severa, pues el único fármaco que me queda

para seguir manejándolo es el escetimide, así que

finalmente el escetimide se deja en lugar de la estatina

cuando hay que suspenderla de manera definitiva, ya sea

porque tuvo una complicación severa o ya sea porque tuvo

una complicación no tan severa, pero que no hubo cómo

manejarla con otras estatinas o con una dosis más baja.

Ahora, la última cosa es, yo le pido secada de control a

los pacientes con estatinas que están sin ningún síntoma,

sin ninguna cosa, y la respuesta es no, solamente se

piden en los pacientes que tienen síntomas, que tienen

mialgia, que tienen alguna otra cosa o bien en los

pacientes que vienen con falla renal, en el sentido en

que ahí aumenta un poquito el riesgo, pero que quede bien

claro que andar pidiendo seca por pedirlas no está

indicado, aunque siempre sirve el tener una seca

basal antes de iniciar el tratamiento con estatinas

como para tener alguna idea general que no venga con

alguna otra miopatía, por ejemplo. Así que solo sí

síntomas, ese es el resumen. Y bueno, eso fue todo de esta

clase muy corta, así que nos vemos en el siguiente video.

Que estén bien.',
    '1
00:00:03,220 --> 00:00:08,020
Hola, hola. Hablemos de las miopatías por estatinas. Al menos en medicina siempre

2
00:00:08,020 --> 00:00:13,020
nos enseñan que las estatinas tienen riesgos de mialgia, de randomiólisis, de cosas

3
00:00:13,020 --> 00:00:16,900
relacionadas con los músculos, pero adelantemos que son bastante infrecuentes

4
00:00:16,900 --> 00:00:20,980
y que por el general las estatinas son fármacos eficaces, que reducen la

5
00:00:20,980 --> 00:00:24,300
mortalidad por infarto y por patología cardiovascular, y son

6
00:00:24,300 --> 00:00:29,700
bastante seguras, pero sepan que hay dos tipos de miopatías o de síntomas

7
00:00:29,700 --> 00:00:35,020
relacionados a daño muscular por estatinas. Por un lado están las no

8
00:00:35,020 --> 00:00:39,660
severas, dígase miálgias, un poquito de debilidad, y con las secas que pueden

9
00:00:39,660 --> 00:00:44,100
estar absolutamente normales o bien un poquito elevadas, y las otras son las

10
00:00:44,100 --> 00:00:48,700
más severas, que la más importante son la randomiólisis y aparte de eso la

11
00:00:48,700 --> 00:00:53,940
mionecrosis, que puede ser una especie de reacción inmune y que

12
00:00:53,940 --> 00:00:58,620
en el caso de que esté mediada por estatinas, obviamente hay que suspenderlas

13
00:00:59,420 --> 00:01:03,980
En estos dos casos suele venir con la seca muy elevada, y de hecho el solo

14
00:01:03,980 --> 00:01:08,820
hecho que la seca esté muy elevada en contexto del uso de estatinas ya me

15
00:01:08,820 --> 00:01:12,700
hace sospechar fuertemente que hay una complicación severa. Ahora, ¿cuál es

16
00:01:12,700 --> 00:01:17,600
el manejo de esto? Número uno, buscar otra causa. Al menos en las no

17
00:01:17,600 --> 00:01:21,540
severas yo tengo tiempo para buscar una causa antes de suspender las

18
00:01:21,540 --> 00:01:25,940
estatinas, y en ese caso le puedo pedir una TCH en busca de hipotiroidismo,

19
00:01:25,940 --> 00:01:29,460
que es una causa de miopatía bien frecuente, y los niveles de vitamina D

20
00:01:29,460 --> 00:01:34,460
también, que si está bajo eso me puede generar mialgias, etcétera. Ahora, luego

21
00:01:34,460 --> 00:01:38,420
de eso se suspende y veo si es que se mejoran los síntomas, porque si no se

22
00:01:38,420 --> 00:01:42,860
mejoran nunca, obviamente era causado o por una enfermedad

23
00:01:42,860 --> 00:01:46,820
autoinmune, por ejemplo una polimiositis, una polimiaje aromática,

24
00:01:46,820 --> 00:01:51,180
o por alguna cosa que produzca dolor sin nada mucho más grave como

25
00:01:51,180 --> 00:01:54,620
una fibromialgia. Así que es muy importante que antes de creerle al

26
00:01:54,620 --> 00:01:58,980
paciente que la causa de su mialgia son las estatinas, se busque otra causa

27
00:01:58,980 --> 00:02:05,060
y se vea que los síntomas desaparezcan al suspender el medicamento.

28
00:02:05,060 --> 00:02:09,740
Ahora, una vez que se suspenden y que desaparecen lo ideal es iniciar una

29
00:02:09,740 --> 00:02:15,380
estatina diferente, y dentro de esas la fluvastatina, la pravastatina y la

30
00:02:15,380 --> 00:02:19,100
pitavastatina son las que tienen menos riesgo de mialgia por el

31
00:02:19,100 --> 00:02:23,420
general, pero tienen un problema que si bien tienen un bajísimo riesgo de

32
00:02:23,420 --> 00:02:29,060
mialgia no son tan potentes para bajar el LDL, así que muchas veces uno se

33
00:02:29,060 --> 00:02:33,540
queda con la duda acá y si le dejo su bastatina mejor que tiene un poquito

34
00:02:33,540 --> 00:02:40,340
menos de riesgo de mialgia, pero el impacto en el LDL es un poquito

35
00:02:40,340 --> 00:02:43,740
mejor, así que tengo esas dos opciones y la última opción que hay

36
00:02:43,740 --> 00:02:47,220
también es bajarle la dosis. Ejemplo, el sistema público a lo

37
00:02:47,220 --> 00:02:52,740
mejor no haya suficientes recursos como para darle algo diferente a la

38
00:02:52,740 --> 00:02:56,860
atorvastatina, así que en ese caso simplemente si estaba con 80 milígramos

39
00:02:56,860 --> 00:03:02,140
se lo bajo a 40 milígramos y veo cómo va. En el caso de la recurrencia, a

40
00:03:02,140 --> 00:03:05,900
pesar de haber hecho estas cosas, de haber cambiado por una estatina

41
00:03:05,900 --> 00:03:09,500
distinta o haber bajado esta dosis, pues no me queda más que

42
00:03:09,500 --> 00:03:15,140
cambiarme de medicamento al Estimide, que acuérdense que impedía la

43
00:03:15,140 --> 00:03:19,540
absorción a nivel intestinal del LDL, así que sirve bastante, pero

44
00:03:19,700 --> 00:03:25,900
recordando que es un poquito menos eficaz que las estatinas. Ahora, si es

45
00:03:25,900 --> 00:03:29,580
que viene con una de estas complicaciones más severa, aquí estoy

46
00:03:29,580 --> 00:03:33,780
obligado a suspender sí o sí y no lo puedo reiniciar, sino que por el

47
00:03:33,780 --> 00:03:37,540
contrario hay que hacer el manejo de la rhabdomiólisis, de la

48
00:03:37,540 --> 00:03:40,260
mionecrosis, en el caso de la rhabdomiólisis con todo el

49
00:03:40,260 --> 00:03:43,380
manejo de la falla renal, con la hidratación con serofisiológico y

50
00:03:43,380 --> 00:03:47,780
en la mionecrosis obviamente con corticoides endovenoso, etcétera, y

51
00:03:47,900 --> 00:03:51,660
aparte de eso tengo que ver si no estará interactuando con algún

52
00:03:51,660 --> 00:03:54,940
otro fármaco, dado que es muy infrecuente que haya una

53
00:03:54,940 --> 00:03:58,780
rhabdomiólisis por estatina, así que igualmente hay que ver que

54
00:03:58,780 --> 00:04:02,940
no haya alguna otra causa que sea evidente y ver con qué fármaco

55
00:04:03,940 --> 00:04:07,380
pueda estar interactuando, y dentro de esto el ejemplo más

56
00:04:07,380 --> 00:04:12,340
clásico son los fibratos, de hecho la típica pregunta es ¿puedo

57
00:04:12,340 --> 00:04:15,660
yo mezclar una estatina con un fibrato? y la respuesta es, con

58
00:04:15,660 --> 00:04:19,100
el higienfibroxilo no, en el sentido en que se dispara el

59
00:04:19,100 --> 00:04:22,620
riesgo de rhabdomiólisis, pero sí se puede con el fenofibrato

60
00:04:22,620 --> 00:04:25,820
con mucho cuidado y solamente se hace en casos de

61
00:04:25,820 --> 00:04:29,180
hipercolesterolemia, con una hipertirolemia muy alta que

62
00:04:29,180 --> 00:04:33,900
no baja suficientemente con la estatina sola, en este

63
00:04:33,900 --> 00:04:37,420
caso que dice que después de suspender en el caso de una

64
00:04:37,420 --> 00:04:40,220
complicación severa, pues el único fármaco que me queda

65
00:04:40,220 --> 00:04:43,500
para seguir manejándolo es el escetimide, así que

66
00:04:43,580 --> 00:04:48,380
finalmente el escetimide se deja en lugar de la estatina

67
00:04:48,380 --> 00:04:51,340
cuando hay que suspenderla de manera definitiva, ya sea

68
00:04:51,340 --> 00:04:53,900
porque tuvo una complicación severa o ya sea porque tuvo

69
00:04:53,900 --> 00:04:56,780
una complicación no tan severa, pero que no hubo cómo

70
00:04:56,780 --> 00:04:59,180
manejarla con otras estatinas o con una dosis más baja.

71
00:05:00,220 --> 00:05:03,980
Ahora, la última cosa es, yo le pido secada de control a

72
00:05:03,980 --> 00:05:07,260
los pacientes con estatinas que están sin ningún síntoma,

73
00:05:07,260 --> 00:05:10,620
sin ninguna cosa, y la respuesta es no, solamente se

74
00:05:10,620 --> 00:05:13,580
piden en los pacientes que tienen síntomas, que tienen

75
00:05:13,580 --> 00:05:16,700
mialgia, que tienen alguna otra cosa o bien en los

76
00:05:16,700 --> 00:05:19,260
pacientes que vienen con falla renal, en el sentido en

77
00:05:19,260 --> 00:05:23,100
que ahí aumenta un poquito el riesgo, pero que quede bien

78
00:05:23,100 --> 00:05:26,780
claro que andar pidiendo seca por pedirlas no está

79
00:05:26,780 --> 00:05:30,540
indicado, aunque siempre sirve el tener una seca

80
00:05:30,540 --> 00:05:33,100
basal antes de iniciar el tratamiento con estatinas

81
00:05:33,100 --> 00:05:36,060
como para tener alguna idea general que no venga con

82
00:05:36,060 --> 00:05:39,340
alguna otra miopatía, por ejemplo. Así que solo sí

83
00:05:39,340 --> 00:05:42,620
síntomas, ese es el resumen. Y bueno, eso fue todo de esta

84
00:05:42,620 --> 00:05:44,620
clase muy corta, así que nos vemos en el siguiente video.

85
00:05:44,620 --> 00:05:45,100
Que estén bien.',
    'En esta cápsula abordaremos las miopatías asociadas al uso de estatinas. Es un tema que a menudo genera confusión porque existe la tendencia a sobredimensionar el riesgo muscular de estos fármacos. Empecemos por aclarar lo fundamental: las estatinas son medicamentos eficaces, seguros y bien tolerados que reducen la mortalidad cardiovascular. Las complicaciones musculares existen, pero son bastante infrecuentes. Dicho esto, saber reconocerlas y manejarlas es imprescindible.

Las miopatías por estatinas se dividen en dos grupos según su gravedad. Las formas no severas incluyen las mialgias, es decir, el dolor muscular sin evidencia de daño, una leve debilidad y puede acompañarse de niveles normales o ligeramente elevados de creatinkinasa, la CK o CPK. Las formas severas son las más peligrosas: la rabdomiólisis y la mionicrosis. En estas dos últimas la CK suele estar muy elevada, lo que en sí mismo ya es una señal de alarma significativa cuando aparece en el contexto del uso de estatinas.

Ante una miopatía no severa, lo primero no es suspender el fármaco de inmediato, sino buscar otras causas. Las más importantes a descartar son el hipotiroidismo, que es una causa frecuente de miopatía y que se evalúa con TSH, y el déficit de vitamina D, que puede generar dolor muscular. Si se descartan estas causas y la sospecha recae en la estatina, entonces sí se suspende el medicamento y se observa si los síntomas desaparecen. Si los síntomas persisten tras la suspensión, hay que considerar otras causas musculares como la polimiositis, la polimialgia reumática o la fibromialgia.',
    '["Miopatía no severa: mialgias, debilidad leve, CK normal o levemente elevada. Buscar otras causas (hipotiroidismo, déficit de vitamina D) antes de suspender.","Miopatía severa: rabdomiólisis o mionicrosis, CK muy elevada. Suspensión definitiva obligatoria. Manejo: hidratación (rabdomiólisis) o corticoides (mionicrosis).","Si la estatina causa miopatía no severa: cambiar a fluvastatina, pravastatina o pitavastatina (menor riesgo muscular), o reducir la dosis de la estatina actual.","Cuando ninguna estatina es tolerada: ezetimibe como alternativa. Menos potente, pero sin riesgo muscular.","No pedir CK de rutina. Solo con síntomas musculares o insuficiencia renal. Gemfibrozilo + estatina: evitar por riesgo de rabdomiólisis. Fenofibrato + estatina: posible con precaución."]'::jsonb,
    '[{"para":"\"SEVERA → SUSPENDE para siempre → EZETIMIBE. NO SEVERA → busca causa → cambia estatina o baja dosis\"","nemotecnia":"\"SEVERA → SUSPENDE para siempre → EZETIMIBE. NO SEVERA → busca causa → cambia estatina o baja dosis\"","explicacion":"El algoritmo de manejo en dos ramas. Las complicaciones severas cierran la puerta a las estatinas definitivamente. Las leves permiten re-intentar con otra opción.\nEl algoritmo de manejo en dos ramas. Las complicaciones severas cierran la puerta a las estatinas definitivamente. Las leves permiten re-intentar con otra opción."},{"para":"\"FLUVASTA-PRAVASTA-PITAVASTA = las TRES seguras para los músculos\"","nemotecnia":"\"FLUVASTA-PRAVASTA-PITAVASTA = las TRES seguras para los músculos\"","explicacion":"Las tres estatinas con menor miotoxicidad. Son menos potentes pero más seguras. Fácil: las tres terminan en -vastatin y no tienen la \"a\" de Atorva ni la \"o\" de Rosu.Las tres estatinas con menor miotoxicidad. Son menos potentes pero más seguras. Fácil: las tres terminan en -vastatin y no tienen la \"a\" de Atorva ni la \"o\" de Rosu."},{"para":"\"GEMFIBROZILO + ESTATINA = PELIGRO. FENOFIBRATO + ESTATINA = con CUIDADO\"","nemotecnia":"\"GEMFIBROZILO + ESTATINA = PELIGRO. FENOFIBRATO + ESTATINA = con CUIDADO\"","explicacion":"La regla de los fibratos: gemfibrozilo nunca con estatinas. Fenofibrato puede ser en casos muy seleccionados con monitorización estrecha.La regla de los fibratos: gemfibrozilo nunca con estatinas. Fenofibrato puede ser en casos muy seleccionados con monitorización estrecha."}]'::jsonb,
    '["Miopatía no severa: mialgias, debilidad leve, CK normal o levemente elevada. Buscar otras causas (hipotiroidismo, déficit de vitamina D) antes de suspender.","Miopatía severa: rabdomiólisis o mionicrosis, CK muy elevada. Suspensión definitiva obligatoria. Manejo: hidratación (rabdomiólisis) o corticoides (mionicrosis).","Si la estatina causa miopatía no severa: cambiar a fluvastatina, pravastatina o pitavastatina (menor riesgo muscular), o reducir la dosis de la estatina actual."]'::jsonb,
    '[]'::jsonb,
    '[{"pregunta":"¿Cuál de las siguientes afirmaciones sobre las miopatías por estatinas es correcta?","respuesta":"Respuesta correcta: C — Ante una miopatía no severa, se deben buscar primero causas alternativas como hipotiroidismo o déficit de vitamina D antes de atribuir los síntomas a la estatina y suspenderla. La CK no se pide de rutina; el fenofibrato puede usarse con cautela (no está absolutamente contraindicado); la rabdomiólisis implica suspensión definitiva (no reinicio); y el ezetimibe es alternativa, no primera línea (las estatinas son más potentes)."}]'::jsonb,
    NOW(),
    TRUE,
    FALSE  -- first 3 free preview
  ) ON CONFLICT (specialty_id, order_index)
  DO UPDATE SET
    title            = EXCLUDED.title,
    duration_seconds = EXCLUDED.duration_seconds,
    txt_content      = EXCLUDED.txt_content,
    srt_content      = EXCLUDED.srt_content,
    ai_summary       = EXCLUDED.ai_summary,
    ai_key_concepts  = EXCLUDED.ai_key_concepts,
    ai_mnemonics     = EXCLUDED.ai_mnemonics,
    ai_high_yield    = EXCLUDED.ai_high_yield,
    ai_review_qs     = EXCLUDED.ai_review_qs,
    ai_processed_at  = NOW(),
    is_available     = TRUE;

  -- Cápsula 24: Dislipidemias Genéticas — Reconocimiento Clínico y Manejo
  INSERT INTO lessons (
    specialty_id, title, order_index, duration_seconds,
    txt_content, srt_content,
    ai_summary, ai_key_concepts, ai_mnemonics,
    ai_high_yield, ai_algorithms, ai_review_qs,
    ai_processed_at, is_available, is_free_preview
  ) VALUES (
    v_specialty_id,
    'Dislipidemias Genéticas — Reconocimiento Clínico y Manejo',
    24,
    167,
    'Hola, hola, ¿cómo están? Vamos a ver un tema bien específico, pero hay que saber

identificar que son las dilipidemias de origen genético, que habitualmente hay

que reconocerlas por su clínica y que lo más importante es que son severas,

así ejemplo, un LDL arriba de 500, unos triglicéridos arriba de mil y tanto,

en ese caso inmediatamente se sospechan, segundo lugar suelen venir con

marcados antecedentes familiares porque suelen ser autosómicas dominantes,

es muy frecuente que los niveles de los lípidos son tan altos que viene con estas

manifestaciones cutáneas como los santomas o los antelasmas y finalmente es

muy frecuente que en su familia hay mucha gente que se haya infartado o que

haya venido con una enfermedad ateromatosa muy joven o bien el

mismo el mismo paciente se infarta a los 35-40 años, en ese caso yo

dirigidamente debo ir a buscar una de estas dilipidemias empezando con un

perfil lipídico, ahora el diagnóstico se hace con el perfil lipídico que me

objetiva que hay una dilipidemia más los distintos test genéticos yendo a

buscar la mutación específica de cada una de ésta, en el caso de la

hiper colesterolemia familiar se hacen unos test genéticos, en el caso de la

hipertrigliceridemia familiar se hacen unos test genéticos distintos

por su caso, el manejo de esto hay que saberlo a grandes rasgos es con

fármacos y no con uno sino que con bastantes fármacos, dígase estatinas en

altas dosis, ejemplo 80 miligramos de atropastatina al día más el

escetimibes, más las dos cosas, o sea de esa manera intento bajar a toda

costa el nivel de LDL, si yo lo consigo bajar el paciente anda bien

si es que no lo más probable es que se muere de infarto relativamente

joven, ahora una vez que ya diagnostico a un paciente hay que

pedirle al menos el perfil lipídico a toda la familia y

obviamente en los que esté alterado le hago el test genético en busca de la

causa genética también, aquí se ven los santomas en un niño por ejemplo

uno dice este es una guagua o un niño de pocos años con esas manchas

amarillas ahí o en las rodillas por ejemplo inmediatamente hay que

sospechar una dilipidemia genética, una dilipidemia hereditaria y hay que

ir a pedirle exámenes, en este caso en los ojos se ven esas manchas

amarillas que se llaman santelasmas y reflejan exactamente lo mismo y

finalmente está el arco senil que es ese anillo como poquito más claro

alrededor del iris que es característico de los adultos mayores

por si acaso no es algo anormal pero si es que ocurre en alguien muy

joven antes de los 40 o de los 50 años en ese caso hay que ir a pedirle

un perfil lipídico por si acaso no no vaya a ver alguna de estas

dilipidemia muy importante y bueno eso fue todo así que nos vemos en

los siguientes temas que estén bien',
    '1
00:00:02,960 --> 00:00:07,120
Hola, hola, ¿cómo están? Vamos a ver un tema bien específico, pero hay que saber

2
00:00:07,120 --> 00:00:12,080
identificar que son las dilipidemias de origen genético, que habitualmente hay

3
00:00:12,080 --> 00:00:15,640
que reconocerlas por su clínica y que lo más importante es que son severas,

4
00:00:15,640 --> 00:00:20,720
así ejemplo, un LDL arriba de 500, unos triglicéridos arriba de mil y tanto,

5
00:00:20,720 --> 00:00:24,860
en ese caso inmediatamente se sospechan, segundo lugar suelen venir con

6
00:00:24,860 --> 00:00:28,400
marcados antecedentes familiares porque suelen ser autosómicas dominantes,

7
00:00:28,960 --> 00:00:34,720
es muy frecuente que los niveles de los lípidos son tan altos que viene con estas

8
00:00:34,720 --> 00:00:39,400
manifestaciones cutáneas como los santomas o los antelasmas y finalmente es

9
00:00:39,400 --> 00:00:43,220
muy frecuente que en su familia hay mucha gente que se haya infartado o que

10
00:00:43,220 --> 00:00:48,320
haya venido con una enfermedad ateromatosa muy joven o bien el

11
00:00:48,320 --> 00:00:52,600
mismo el mismo paciente se infarta a los 35-40 años, en ese caso yo

12
00:00:52,600 --> 00:00:56,720
dirigidamente debo ir a buscar una de estas dilipidemias empezando con un

13
00:00:56,720 --> 00:01:01,000
perfil lipídico, ahora el diagnóstico se hace con el perfil lipídico que me

14
00:01:01,000 --> 00:01:05,760
objetiva que hay una dilipidemia más los distintos test genéticos yendo a

15
00:01:05,760 --> 00:01:10,840
buscar la mutación específica de cada una de ésta, en el caso de la

16
00:01:10,840 --> 00:01:15,400
hiper colesterolemia familiar se hacen unos test genéticos, en el caso de la

17
00:01:15,400 --> 00:01:18,920
hipertrigliceridemia familiar se hacen unos test genéticos distintos

18
00:01:18,920 --> 00:01:23,020
por su caso, el manejo de esto hay que saberlo a grandes rasgos es con

19
00:01:23,020 --> 00:01:27,900
fármacos y no con uno sino que con bastantes fármacos, dígase estatinas en

20
00:01:27,900 --> 00:01:32,780
altas dosis, ejemplo 80 miligramos de atropastatina al día más el

21
00:01:32,780 --> 00:01:37,740
escetimibes, más las dos cosas, o sea de esa manera intento bajar a toda

22
00:01:37,740 --> 00:01:42,020
costa el nivel de LDL, si yo lo consigo bajar el paciente anda bien

23
00:01:42,020 --> 00:01:44,740
si es que no lo más probable es que se muere de infarto relativamente

24
00:01:44,740 --> 00:01:49,140
joven, ahora una vez que ya diagnostico a un paciente hay que

25
00:01:49,140 --> 00:01:51,620
pedirle al menos el perfil lipídico a toda la familia y

26
00:01:51,620 --> 00:01:55,220
obviamente en los que esté alterado le hago el test genético en busca de la

27
00:01:55,220 --> 00:02:00,140
causa genética también, aquí se ven los santomas en un niño por ejemplo

28
00:02:00,140 --> 00:02:04,700
uno dice este es una guagua o un niño de pocos años con esas manchas

29
00:02:04,700 --> 00:02:08,420
amarillas ahí o en las rodillas por ejemplo inmediatamente hay que

30
00:02:08,420 --> 00:02:14,220
sospechar una dilipidemia genética, una dilipidemia hereditaria y hay que

31
00:02:14,220 --> 00:02:18,260
ir a pedirle exámenes, en este caso en los ojos se ven esas manchas

32
00:02:18,300 --> 00:02:23,100
amarillas que se llaman santelasmas y reflejan exactamente lo mismo y

33
00:02:23,100 --> 00:02:27,500
finalmente está el arco senil que es ese anillo como poquito más claro

34
00:02:27,500 --> 00:02:30,780
alrededor del iris que es característico de los adultos mayores

35
00:02:30,780 --> 00:02:34,500
por si acaso no es algo anormal pero si es que ocurre en alguien muy

36
00:02:34,500 --> 00:02:39,100
joven antes de los 40 o de los 50 años en ese caso hay que ir a pedirle

37
00:02:39,100 --> 00:02:43,020
un perfil lipídico por si acaso no no vaya a ver alguna de estas

38
00:02:43,020 --> 00:02:47,060
dilipidemia muy importante y bueno eso fue todo así que nos vemos en

39
00:02:47,060 --> 00:02:50,060
los siguientes temas que estén bien',
    'En esta cápsula abordaremos las dislipidemias de origen genético. Es un tema específico, pero muy relevante para el EUNACOM porque permite identificar en la clínica un grupo de pacientes con riesgo cardiovascular extremo que requieren un enfoque diagnóstico y terapéutico particular.

Las dislipidemias genéticas deben sospecharse cuando nos enfrentamos a valores de lípidos llamativamente elevados: piensen en un LDL por encima de 500 miligramos por decilitro o unos triglicéridos que superan los 1.000 o incluso 1.500 miligramos por decilitro. Estos valores no se alcanzan habitualmente con los factores ambientales o con la resistencia a la insulina. Cuando aparecen, hay que pensar en genética.

Un segundo elemento clave para la sospecha es el patrón familiar. La mayoría de estas enfermedades tienen transmisión autosómica dominante, lo que significa que con una sola copia del gen mutado el paciente ya desarrolla la enfermedad. Por eso, es muy frecuente encontrar múltiples familiares afectados en la misma generación y en generaciones anteriores. Cuando el paciente relata que su padre, un tío y un abuelo tuvieron infartos o murieron de causa cardiovascular a edades jóvenes, la sospecha de una dislipidemia genética debe ser alta.',
    '["Sospechar dislipidemia genética con LDL >500 mg/dL o triglicéridos >1.000 mg/dL, especialmente con historia familiar de enfermedad cardiovascular precoz.","Transmisión autosómica dominante en la mayoría. Múltiples familiares afectados en varias generaciones.","Manifestaciones cutáneas: xantomas (nódulos amarillentos en piel y tendones) y xantelasmas (depósitos en párpados). En niños o adultos jóvenes = alarma.","Arco corneal senil en menores de 40-50 años = señal de alarma → solicitar perfil lipídico.","Manejo: estatina en dosis máximas (atorvastatina 80 mg) + ezetimibe. Tamizaje de toda la familia con perfil lipídico y test genético en afectados."]'::jsonb,
    '[{"para":"\"LDL >500 o TG >1.000 + Familia infartada joven + Xantomas = GENÉTICA hasta demostrar lo contrario\"","nemotecnia":"\"LDL >500 o TG >1.000 + Familia infartada joven + Xantomas = GENÉTICA hasta demostrar lo contrario\"","explicacion":"La tríada de sospecha clínica. Valores extremos + historia familiar + depósitos lipídicos cutáneos = dislipidemia hereditaria.\nLa tríada de sospecha clínica. Valores extremos + historia familiar + depósitos lipídicos cutáneos = dislipidemia hereditaria."},{"para":"\"XANTOMA en rodilla o tendón = colesterol en piel. XANTELASMA = colesterol en párpado. ARCO joven = alarma lipídica\"","nemotecnia":"\"XANTOMA en rodilla o tendón = colesterol en piel. XANTELASMA = colesterol en párpado. ARCO joven = alarma lipídica\"","explicacion":"Los tres hallazgos físicos que deben disparar la sospecha. En adultos mayores el arco corneal es normal; en jóvenes es patológico.Los tres hallazgos físicos que deben disparar la sospecha. En adultos mayores el arco corneal es normal; en jóvenes es patológico."},{"para":"\"ATORVA 80 + EZETIMIBE = el DÚO máximo para bajar el LDL genético\"","nemotecnia":"\"ATORVA 80 + EZETIMIBE = el DÚO máximo para bajar el LDL genético\"","explicacion":"El tratamiento de la dislipidemia genética siempre es combinado: estatina de alta intensidad más ezetimibe. No basta con una estatina sola.El tratamiento de la dislipidemia genética siempre es combinado: estatina de alta intensidad más ezetimibe. No basta con una estatina sola."}]'::jsonb,
    '["Sospechar dislipidemia genética con LDL >500 mg/dL o triglicéridos >1.000 mg/dL, especialmente con historia familiar de enfermedad cardiovascular precoz.","Transmisión autosómica dominante en la mayoría. Múltiples familiares afectados en varias generaciones.","Manifestaciones cutáneas: xantomas (nódulos amarillentos en piel y tendones) y xantelasmas (depósitos en párpados). En niños o adultos jóvenes = alarma."]'::jsonb,
    '[]'::jsonb,
    '[{"pregunta":"¿Cuál de las siguientes situaciones clínicas debe hacer sospechar una dislipidemia de origen genético?","respuesta":"Respuesta correcta: C — El LDL de 520 mg/dL es un valor extremo que no se alcanza con causas adquiridas, los xantomas tendinosos en un adulto joven son patognomónicos de hipercolesterolemia familiar, y el infarto paterno a los 42 años confirma la historia familiar de enfermedad cardiovascular precoz. Las demás opciones tienen explicaciones adquiridas más probables: el arco corneal en 65 años es normal; la mujer de 55 tiene un perfil de síndrome metabólico; la hipercolesterolemia puede ser secundaria al hipotiroidismo; y la hipertrigliceridemia por alcohol es causa conocida."}]'::jsonb,
    NOW(),
    TRUE,
    FALSE  -- first 3 free preview
  ) ON CONFLICT (specialty_id, order_index)
  DO UPDATE SET
    title            = EXCLUDED.title,
    duration_seconds = EXCLUDED.duration_seconds,
    txt_content      = EXCLUDED.txt_content,
    srt_content      = EXCLUDED.srt_content,
    ai_summary       = EXCLUDED.ai_summary,
    ai_key_concepts  = EXCLUDED.ai_key_concepts,
    ai_mnemonics     = EXCLUDED.ai_mnemonics,
    ai_high_yield    = EXCLUDED.ai_high_yield,
    ai_review_qs     = EXCLUDED.ai_review_qs,
    ai_processed_at  = NOW(),
    is_available     = TRUE;

  RAISE NOTICE 'Diabetes lessons seeded: 24 lessons';
END $$;
