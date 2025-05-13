import { faker } from '@faker-js/faker';

const firstNames = [
  'James',
  'John',
  'Robert',
  'Michael',
  'William',
  'David',
  'Richard',
  'Joseph',
  'Charles',
  'Thomas',
  'Christopher',
  'Daniel',
  'Matthew',
  'Anthony',
  'Mark',
  'Donald',
  'Paul',
  'Steven',
  'Andrew',
  'Kenneth',
  // Add more names as required
];

const lastNames = [
  'Smith',
  'Johnson',
  'Williams',
  'Jones',
  'Brown',
  'Davis',
  'Miller',
  'Wilson',
  'Moore',
  'Taylor',
  'Anderson',
  'Thomas',
  'Jackson',
  'White',
  'Harris',
  'Martin',
  'Thompson',
  'Garcia',
  'Martinez',
  'Roberts',
  // Add more names as required
];

const streets = [
  'Main St',
  'High St',
  'King St',
  'Queen St',
  'Park Ave',
  'Elm St',
  'Maple Ave',
  'Oak St',
  'Pine St',
  'River Rd',
  // Add more street names as required
];

const suburbs = [
  'Greenwich',
  'Camden',
  'Islington',
  'Chelsea',
  'Kensington',
  'Hackney',
  'Clapham',
  'Fulham',
  'Shoreditch',
  'Peckham',
  'Morningside',
  'Plumstead',
  'Battersea',
  'Wandsworth',
  'Hampstead',
  'Brixton',
  'Ealing',
  'Dalston',
  'Croydon',
  'Greenwich',
  // Add more suburbs as required
];

const cities = [
  'London',
  'Cape Town',
  'New York',
  'Los Angeles',
  'San Francisco',
  'Paris',
  'Berlin',
  'Madrid',
  'Rome',
  'Sydney',
  // Add more cities as required
];

const zipCodes = [
  '10001',
  '20001',
  '30001',
  '40001',
  '50001',
  '60001',
  '70001',
  '80001',
  '90001',
  '11001',
  // Add more zip codes as required
];

export const generateBusinessName = (): string => {
  return `${faker.helpers.arrayElement(['Global', 'Tech', 'Solution', 'Enterprise', 'Group', 'Corp', 'Industries', 'Co'])} ${faker.word.adjective()}`;
};

export const generateUserDetails = () => {
  const firstName = generateFirstName();
  const lastName = generateLastName();
  const fullName = `${firstName} ${lastName}`;
  const userNumber = faker.number.int({ min: 1, max: 999 });
  const userName = `${firstName}.${lastName}${userNumber}`;

  return {
    firstName,
    lastName,
    fullName,
    userNumber,
    userName,
  };
};
export const generateUserName = (): string => {
  return `${faker.helpers.arrayElement(firstNames).toLowerCase()}.${faker.helpers.arrayElement(lastNames).toLowerCase()}${faker.number.int({ min: 1, max: 999 })}`;
};

export const generateFirstName = (): string => {
  return faker.helpers.arrayElement(firstNames);
};

export const generateLastName = (): string => {
  return faker.helpers.arrayElement(lastNames);
};

export const generateAddress = () => {
  const street = faker.helpers.arrayElement(streets);
  const suburb = faker.helpers.arrayElement(suburbs);
  const city = faker.helpers.arrayElement(cities);
  const zipCode = faker.helpers.arrayElement(zipCodes);
  return {
    street,
    suburb,
    fullAddress: `${street}, ${suburb}, ${city}, ${zipCode}`,
  };
};

export const generateDateString = (): string => {
  return new Date(
    faker.number.int({ min: 1000, max: 2025 }),
    faker.number.int({ min: 0, max: 11 }),
    faker.number.int({ min: 1, max: 31 }),
  ).toISOString();
};

export const generateLat = (): string => {
  const lat = faker.number.float({ min: -34.5, max: 51.5 });
  return lat.toFixed(4); // rounds to 4 decimal places
};

export const generateLon = (): string => {
  const lon = faker.number.float({ min: -18.5, max: 3.5 });
  return lon.toFixed(4); // rounds to 4 decimal places
};
