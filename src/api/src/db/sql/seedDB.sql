-- Seed Data Script
-- #region Helper Functions for Random Data Generation

-- Generate random location name
CREATE OR REPLACE FUNCTION generate_location_name(p_index INT) RETURNS TEXT AS $$
DECLARE
  location_name TEXT;
BEGIN
  location_name := 'Location ' || p_index;
  RETURN location_name;
END;
$$ LANGUAGE plpgsql;

-- Generate random tenant name
CREATE OR REPLACE FUNCTION generate_tenant_name(p_index INT) RETURNS TEXT AS $$
DECLARE
  tenant_name TEXT;
BEGIN
  tenant_name := 'Tenant ' || p_index;
  RETURN tenant_name;
END;
$$ LANGUAGE plpgsql;

-- Generate random user name
CREATE OR REPLACE FUNCTION generate_user_name() RETURNS TEXT AS $$
DECLARE
  first_names TEXT[] := ARRAY['John', 'Jane', 'Alice', 'Bob', 'Michael', 'Emily', 'David', 'Sarah', 'James', 'Olivia',
                              'Liam', 'Sophia', 'Lucas', 'Mia', 'Ethan', 'Isabella', 'Alexander', 'Ava', 'Daniel', 'Charlotte',
                              'Henry', 'Amelia', 'Jackson', 'Harper', 'Sebastian', 'Eleanor', 'Gabriel', 'Lily', 'Samuel', 'Chloe',
                              'Matthew', 'Ella', 'Owen', 'Zoe', 'Joseph', 'Mila', 'Benjamin', 'Grace', 'Jack', 'Abigail', 'Daniel',
                              'Lucas', 'Victoria', 'Ryan', 'Landon', 'Natalie', 'Elijah', 'Scarlett', 'Mason', 'Luna', 'Luke',
                              'Chloe', 'Andrew', 'Leah', 'Jackson', 'Charlotte', 'Evan', 'Avery', 'Oliver', 'Ella', 'Madeline',
                              'Isaac', 'Amos', 'Archer', 'Abby', 'Beatrice', 'Max', 'Ruby', 'Noah', 'Clara', 'George', 'Levi'];
  last_names TEXT[] := ARRAY['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor',
                             'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Roberts',
                             'Walker', 'Young', 'Allen', 'King', 'Scott', 'Green', 'Adams', 'Baker', 'Nelson', 'Carter', 'Morris',
                             'Mitchell', 'Perez', 'Robinson', 'Garcia', 'Miller', 'Martinez', 'Evans', 'Gonzalez', 'Parker', 'Collins'];
  first_name TEXT;
  last_name TEXT;
BEGIN
  first_name := first_names[floor(random() * array_length(first_names, 1) + 1)];
  last_name := last_names[floor(random() * array_length(last_names, 1) + 1)];
  RETURN first_name || ' ' || last_name;
END;
$$ LANGUAGE plpgsql;

-- Generate random timestamp within the last 7 days
CREATE OR REPLACE FUNCTION random_timestamp() RETURNS TIMESTAMP WITH TIME ZONE AS $$
BEGIN
  RETURN NOW() - (random() * (INTERVAL '7 days'));
END;
$$ LANGUAGE plpgsql;

-- #endregion

-- #region Seed Parameters (Number of Entries)

-- Set the number of entries to insert into each table
DO $$
BEGIN
  -- Define the number of entries for each table
  -- You can modify this value to change the number of rows generated
  DECLARE
    num_tenants INT := 20;
    num_locations INT := 100;
    num_users INT := 100;
  BEGIN
    -- #region Seed Tenants
    INSERT INTO "tenants" ("name", "createdAt", "updatedAt")
    SELECT
      generate_tenant_name(g),
      random_timestamp(),
      random_timestamp()
    FROM generate_series(1, num_tenants) AS g;
    -- #endregion

    -- #region Seed Locations
    INSERT INTO "locations" ("name", "tenantId", "address", "lat", "lon", "createdAt", "updatedAt")
    SELECT
      generate_location_name(g),
      ((random() * num_tenants)::int + 1),
      (floor(random() * 1000 + 1)::int || ' ' ||
       (ARRAY['Main St', 'Broadway', '5th Ave', 'Park Ave', 'Lexington Ave', 'Wall St'])[floor(random() * 6 + 1)] || ', New York, NY'),
      round(40.5 + (random() * 0.4)::numeric, 6),
      round(-74.2 + (random() * 0.4)::numeric, 6),
      random_timestamp(),
      random_timestamp()
    FROM generate_series(1, num_locations) AS g;
    -- #endregion

    -- #region Seed Users
    INSERT INTO "users" ("name", "email", "password", "tenantId", "locationId", "createdAt", "updatedAt")
    SELECT
      generate_user_name(),
      'user' || g || '@example.com',
      'hashedpassword' || g,
      ((random() * num_tenants)::int + 1),
      ((random() * num_locations)::int + 1),
      random_timestamp(),
      random_timestamp()
    FROM generate_series(1, num_users) AS g;
    -- #endregion
  END;
END;
$$;
-- #endregion
