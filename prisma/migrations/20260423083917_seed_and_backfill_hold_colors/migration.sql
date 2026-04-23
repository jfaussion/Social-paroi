-- Insert 9 default colors for location_id = 1
INSERT INTO hold_colors (location_id, name, color, "order", created_at, updated_at) VALUES
  (1, 'Green',  '#22C55E', 1, NOW(), NOW()),
  (1, 'Red',    '#EF4444', 2, NOW(), NOW()),
  (1, 'Blue',   '#3B82F6', 3, NOW(), NOW()),
  (1, 'Yellow', '#EAB308', 4, NOW(), NOW()),
  (1, 'White',  '#F9FAFB', 5, NOW(), NOW()),
  (1, 'Black',  '#111827', 6, NOW(), NOW()),
  (1, 'Orange', '#F97316', 7, NOW(), NOW()),
  (1, 'Pink',   '#EC4899', 8, NOW(), NOW()),
  (1, 'Purple', '#A855F7', 9, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Backfill hold_color_id on tracks based on matching name
-- Track DB columns: "holdColor" (camelCase, mapped from holdColorLegacy), "locationId" (camelCase, no @map)
UPDATE "Track"
SET hold_color_id = hc.id
FROM hold_colors hc
WHERE LOWER("Track"."holdColor") = LOWER(hc.name)
  AND hc.location_id = "Track"."locationId";
