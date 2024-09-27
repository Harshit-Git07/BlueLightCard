import Chance from 'chance';

const chance = new Chance();

class User {
  firstName: string;
  lastName: string;
  email: string;
  address: Address;
  birthDate: { day: string; month: string; year: string };
  mobileNumber: string;
  employerType: string;
  employerName: string;
  jobTitleOrPosition: string;
  password: string;

  constructor() {
    this.firstName = chance.first();
    this.lastName = chance.last();
    this.email = generateRandomEmail(10);
    this.address = new Address();
    this.birthDate = generateRandomBirthDate();
    this.mobileNumber = generateAUSMobileNumber();
    this.employerType = 'Ambulance Services';
    this.employerName = 'Ambulance Victoria';
    this.jobTitleOrPosition = 'Staff';
    this.password = process.env.TESTMAIL_REGISTRATION_PASSWORD;
  }
}

function generateRandomEmail(length: number): string {
  const randomPart = chance.string({
    length,
    pool: 'abcdefghijklmnopqrstuvwxyz0123456789',
  });
  return `${process.env.TESTMAIL_NAMESPACE}.${randomPart}@inbox.testmail.app`;
}

class Address {
  line1: string;
  suburb: string;
  state: string;
  postCode: string;

  constructor() {
    this.line1 = generateAUSStreet();
    this.suburb = generateAUSSuburb();
    this.state = generateAUSState();
    this.postCode = generateAUSPostcode();
  }
}

//Helper AUS specific
function generateAUSStreet(): string {
  const streetNumber = chance.integer({ min: 1, max: 200 });
  const streetName = chance.street();
  return `${streetNumber} ${streetName}`;
}

function generateAUSSuburb(): string {
  const suburb = chance.city();
  return `${suburb}`;
}

function generateAUSState(): string {
  const state = [
    'Australian Capital Territory',
    'New South Wales',
    'Northern Territory',
    'Queensland',
    'South Australia',
    'Tasmania',
    'Victoria',
    'Western Australia',
  ];
  return chance.pickone(state);
}

function generateAUSPostcode(): string {
  const postCode = chance.integer({ min: 1000, max: 9999 });
  return `${postCode}`;
}

function generateRandomBirthDate(): {
  day: string;
  month: string;
  year: string;
} {
  const birthDate = chance.birthday({ type: 'adult' }) as Date;
  const day = String(birthDate.getDate()).padStart(2, '0');
  const month = String(birthDate.getMonth() + 1).padStart(2, '0');
  const year = String(birthDate.getFullYear());
  return { day, month, year };
}

export function generateAUSMobileNumber(): string {
  const mobileNumber = '04' + chance.string({ length: 8, pool: '0123456789' });
  return mobileNumber;
}

export { User, Address, generateRandomEmail };
