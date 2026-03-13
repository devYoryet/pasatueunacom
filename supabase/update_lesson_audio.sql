-- Update lesson 1 of diabetes specialty with audio file
UPDATE lessons
SET
  video_url = '/audio/diabetes-clasificacion.mp3',
  duration_seconds = 592
WHERE
  order_index = 1
  AND specialty_id = (
    SELECT id FROM specialties WHERE code = 'diabetes' LIMIT 1
  );
