UPDATE tracks
SET difficulty_level_id = (
  SELECT dl.id
  FROM difficulty_levels dl
  WHERE dl.name = tracks.level
    AND dl.location_id = tracks.location_id
)
WHERE difficulty_level_id IS NULL
  AND level IS NOT NULL
  AND location_id IS NOT NULL;
