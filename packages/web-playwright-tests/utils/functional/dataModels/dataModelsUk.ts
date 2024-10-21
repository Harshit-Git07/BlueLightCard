import Chance from 'chance';

const chance = new Chance();

class User {
  firstName: string;
  lastName: string;
  email: string;
  address: Address;
  birthDate: { day: string; month: string; year: string };
  mobileNumber: string;
  service: string;
  trustOrDivision: string;
  jobTitleOrPosition: string;
  password: string;

  constructor() {
    this.firstName = chance.first();
    this.lastName = chance.last();
    this.email = generateRandomEmail(10);
    this.address = new Address();
    this.birthDate = generateRandomBirthDate();
    this.mobileNumber = generateUKMobileNumber();
    this.service = 'Ambulance Service';
    this.trustOrDivision = 'Air Ambulance';
    this.jobTitleOrPosition = 'Manager';
    this.password = process.env.TESTMAIL_REGISTRATION_PASSWORD;
  }
}

function generateRandomBirthDate(): {
  day: string;
  month: string;
  year: string;
} {
  const birthDate = chance.birthday({ type: 'adult' }) as Date; // Cast to Date
  const day = String(birthDate.getDate()).padStart(2, '0');
  const month = String(birthDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = String(birthDate.getFullYear());
  return { day, month, year };
}

function generateRandomEmail(length: number): string {
  const randomPart = chance.string({
    length,
    pool: 'abcdefghijklmnopqrstuvwxyz0123456789',
  });
  //reference the inbox value in config
  return `${process.env.TESTMAIL_NAMESPACE}.${randomPart}@inbox.testmail.app`;
}

export function generateUKMobileNumber(): string {
  const mobileNumber = '07' + chance.string({ length: 9, pool: '0123456789' });
  return mobileNumber;
}

class Address {
  line1: string;
  city: string;
  county: string;
  postCode: string;
  country: string;

  constructor() {
    this.line1 = generateUKStreet();
    this.city = generateUKCity();
    this.county = generateUKCounty();
    this.postCode = generateUKPostcode();
    this.country = 'United Kingdom';
  }
}

// Helper functions to generate UK-specific data
function generateUKStreet(): string {
  const streetNumber = chance.integer({ min: 1, max: 200 });
  const streetName = chance.street();
  return `${streetNumber} ${streetName}`;
}

function generateUKCity(): string {
  const ukCities = [
    'London',
    'Birmingham',
    'Leeds',
    'Glasgow',
    'Sheffield',
    'Bradford',
    'Liverpool',
    'Edinburgh',
    'Manchester',
    'Bristol',
  ];
  return chance.pickone(ukCities);
}

function generateUKCounty(): string {
  const ukCounties = [
    'Aberdeenshire',
    'Anglesey',
    'Angus',
    'Antrim',
    'Argyllshire',
    'Armagh',
    'Ayrshire',
    'Banffshire',
    'Bedfordshire',
    'Berkshire',
    'Berwickshire',
    'Blaenau Gwent',
    'Brecknockshire',
    'Bridgend',
    'Bristol',
    'Buckinghamshire',
    'Buteshire',
    'Caernarfonshire',
    'Caerphilly',
    'Caithness',
    'Cambridgeshire',
    'Cardiff',
    'Cardiganshire',
    'Carmarthenshire',
    'Ceredigion',
    'Cheshire',
    'City of Edinburgh',
    'City of London',
    'Clackmannanshire',
    'Cleveland',
    'Conwy',
    'Cornwall',
    'Cromartyshire',
    'Cumbria',
    'Denbighshire',
    'Derbyshire',
    'Devon',
    'Dorset',
    'Down',
    'Dumfriesshire',
    'Dunbartonshire',
    'Durham',
    'East Lothian',
    'East Riding of Yorkshire',
    'East Sussex',
    'Essex',
    'Fermanagh',
    'Fife',
    'Flintshire',
    'Glamorgan',
    'Glasgow',
    'Gloucestershire',
    'Greater London',
    'Greater Manchester',
    'Guernsey',
    'Gwynedd',
    'Hampshire',
    'Herefordshire',
    'Hertfordshire',
    'Inverness-shire',
    'Isle of Man',
    'Isle of Wight',
    'Jersey',
    'Kent',
    'Kincardineshire',
    'Kinross',
    'Kirkcudbrightshire',
    'Lanarkshire',
    'Lancashire',
    'Leicestershire',
    'Lincolnshire',
    'Londonderry',
    'Merioneth',
    'Merseyside',
    'Merthyr Tydfil',
    'Middlesex',
    'Midlothian',
    'Monmouthshire',
    'Montgomeryshire',
    'Morayshire',
    'Nairnshire',
    'Neath Port Talbot',
    'Newport',
    'Norfolk',
    'North Yorkshire',
    'Northamptonshire',
    'Northumberland',
    'Nottinghamshire',
    'Orkney',
    'Oxfordshire',
    'Peeblesshire',
    'Pembrokeshire',
    'Perthshire',
    'Powys',
    'Radnorshire',
    'Renfrewshire',
    'Rest of the World (outside UK)',
    'Rhondda-Cynon-Taff',
    'Ross-shire',
    'Roxburghshire',
    'Rutland',
    'Selkirkshire',
    'Shetland',
    'Shropshire',
    'Somerset',
    'South Yorkshire',
    'Staffordshire',
    'Stirlingshire',
    'Suffolk',
    'Surrey',
    'Sussex',
    'Sutherland',
    'Swansea',
    'Torfaen',
    'Tyne and Wear',
    'Tyrone',
    'Warwickshire',
    'West Lothian',
    'West Midlands',
    'West Sussex',
    'West Yorkshire',
    'Wigtownshire',
    'Wiltshire',
    'Worcestershire',
    'Wrexham',
  ];
  return chance.pickone(ukCounties);
}

function generateUKPostcode(): string {
  const postcodeArea =
    chance.character({ pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' }) +
    chance.character({ pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' }) +
    chance.integer({ min: 1, max: 9 });
  const postcodeDistrict =
    chance.integer({ min: 0, max: 9 }) + chance.character({ pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' });
  return `${postcodeArea} ${postcodeDistrict}`;
}
function generateUKService(): { service: number; text: string } {
  const items = [
    { service: 0, text: "Airedale NHS Foundation Trust" },
    { service: 1, text: "Abbey Hospitals" },
    { service: 2, text: "Atos Healthcare" },
    { service: 3, text: "Aintree University Hospitals NHS Foundation Trust" },
    { service: 4, text: "Alder Hey Children's NHS Foundation Trust" },
    { service: 5, text: "Ashford and St Peter's Hospitals NHS Trust" },
    { service: 6, text: "Barking Havering and Redbridge University Hospitals NHS Trust" },
    { service: 7, text: "Baxter Healthcare" },
    { service: 8, text: "Barnsley Hospital NHS Foundation Trust" },
    { service: 9, text: "Bedford Hospital NHS Trust" },
    { service: 10, text: "Bridgewater Hospital (Manchester) Ltd" },
    { service: 11, text: "Bpas (Head Office)" },
    { service: 12, text: "Basildon and Thurrock University Hospitals NHS Foundation Trust" }
  ];

  const randomIndex = Math.floor(Math.random() * items.length);
  const selectedItem = items[randomIndex];

  return { service: selectedItem.service, text: selectedItem.text };
}



export { User, Address, generateRandomEmail, generateUKService };
