-- Helper Functions for Random Data Generation

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
  last_names TEXT[] := ARRAY['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'García', 'Rodríguez', 'Martínez',
                             'Hernández', 'Lopez', 'González', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
                             'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sánchez', 'Clark', 'Lewis', 'Roberts', 'Walker',
                             'Young', 'King', 'Scott', 'Green', 'Adams', 'Baker', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Hall',
                             'Rivera', 'Campbell', 'Gonzalez', 'Flores', 'Morris', 'Murphy', 'Bailey', 'Cooper', 'Richardson'];
  first_name TEXT;
  last_name TEXT;
BEGIN
  first_name := first_names[floor(random() * array_length(first_names, 1) + 1)];
  last_name := last_names[floor(random() * array_length(last_names, 1) + 1)];
  RETURN first_name || ' ' || last_name;
END;
$$ LANGUAGE plpgsql;

-- Generate a random timestamp within the last week
CREATE OR REPLACE FUNCTION random_timestamp() RETURNS TIMESTAMP AS $$
DECLARE
  random_days INT;
BEGIN
  random_days := floor(random() * 7);
  RETURN now() - (random_days || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql;
