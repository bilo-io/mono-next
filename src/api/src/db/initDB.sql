-- #region Tenants
DROP TABLE IF EXISTS "users";
DROP TABLE IF EXISTS "locations";
DROP TABLE IF EXISTS "tenants";

CREATE TABLE "tenants" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL
);
-- #endregion

-- #region Locations
CREATE TABLE "locations" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "tenantId" INTEGER NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
  "address" VARCHAR(255) NOT NULL,
  "lat" DOUBLE PRECISION NOT NULL,
  "lon" DOUBLE PRECISION NOT NULL
);
-- #endregion

-- #region Users
CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "email" VARCHAR(150) UNIQUE NOT NULL,
  "password" VARCHAR(200) NOT NULL,
  "tenantId" INTEGER REFERENCES "tenants"("id") ON DELETE SET NULL,
  "locationId" INTEGER REFERENCES "locations"("id") ON DELETE SET NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);
-- #endregion