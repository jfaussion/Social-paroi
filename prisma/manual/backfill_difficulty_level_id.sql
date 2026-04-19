UPDATE public."Track" t
SET "difficultyLevelId" = (
  SELECT dl.id
  FROM public."difficulty_levels" dl
  WHERE dl.name = t.level
    AND dl."locationId" = t."locationId"
)
WHERE t."difficultyLevelId" IS NULL
  AND level IS NOT NULL
  AND t."locationId" IS NOT NULL;
