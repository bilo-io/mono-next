-- #region Seed Tenants
INSERT INTO "tenants" ("name")
SELECT 'Tenant ' || g
FROM generate_series(1, 20) AS g;
-- #endregion

-- #region Seed Locations
INSERT INTO "locations" ("name", "tenantId", "address", "lat", "lon")
SELECT
  'Location ' || g,
  ((random() * 19)::int + 1),
  (floor(random() * 1000 + 1)::int || ' ' ||
   (ARRAY['Main St', 'Broadway', '5th Ave', 'Park Ave', 'Lexington Ave', 'Wall St'])[floor(random() * 6 + 1)] || ', New York, NY'),
  round(40.5 + (random() * 0.4)::numeric, 6),
  round(-74.2 + (random() * 0.4)::numeric, 6)
FROM generate_series(1, 100) AS g;
-- #endregion

-- #region Seed Users
INSERT INTO "users" ("name", "email", "password", "tenantId", "locationId")
SELECT
  'User ' || g,
  'user' || g || '@example.com',
  'hashedpassword' || g,
  ((random() * 19)::int + 1),
  ((random() * 99)::int + 1)
FROM generate_series(1, 100) AS g;
-- #endregion