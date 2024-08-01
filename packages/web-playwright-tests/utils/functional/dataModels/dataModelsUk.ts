import Chance from "chance";

const chance = new Chance();

class User {
  firstName: string;
  lastName: string;
  email: string;
  address: Address;
  birthDate: { day: string; month: string; year: string };
  mobileNumber: string;

  constructor() {
    this.firstName = chance.first();
    this.lastName = chance.last();
    this.email = generateRandomEmail(10);
    this.address = new Address();
    this.birthDate = generateRandomBirthDate();
    this.mobileNumber = generateUKMobileNumber();
  }
}

function generateRandomBirthDate(): {
  day: string;
  month: string;
  year: string;
} {
  const birthDate = chance.birthday({ type: "adult" }) as Date; // Cast to Date
  const day = String(birthDate.getDate()).padStart(2, "0");
  const month = String(birthDate.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const year = String(birthDate.getFullYear());
  return { day, month, year };
}

function generateRandomEmail(length: number): string {
  const randomPart = chance.string({
    length,
    pool: "abcdefghijklmnopqrstuvwxyz0123456789",
  });
  return `ecc9z.${randomPart}@inbox.testmail.app`;
}

function generateUKMobileNumber(): string {
  const mobileNumber = "07" + chance.string({ length: 9, pool: "0123456789" });
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
    this.country = "United Kingdom";
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
    "London",
    "Birmingham",
    "Leeds",
    "Glasgow",
    "Sheffield",
    "Bradford",
    "Liverpool",
    "Edinburgh",
    "Manchester",
    "Bristol",
  ];
  return chance.pickone(ukCities);
}

function generateUKCounty(): string {
  const ukCounties = [
    "Aberdeenshire",
    "Anglesey",
    "Angus",
    "Antrim",
    "Argyllshire",
    "Armagh",
    "Ayrshire",
    "Banffshire",
    "Bedfordshire",
    "Berkshire",
    "Berwickshire",
    "Blaenau Gwent",
    "Brecknockshire",
    "Bridgend",
    "Bristol",
    "Buckinghamshire",
    "Buteshire",
    "Caernarfonshire",
    "Caerphilly",
    "Caithness",
    "Cambridgeshire",
    "Cardiff",
    "Cardiganshire",
    "Carmarthenshire",
    "Ceredigion",
    "Cheshire",
    "City of Edinburgh",
    "City of London",
    "Clackmannanshire",
    "Cleveland",
    "Conwy",
    "Cornwall",
    "Cromartyshire",
    "Cumbria",
    "Denbighshire",
    "Derbyshire",
    "Devon",
    "Dorset",
    "Down",
    "Dumfriesshire",
    "Dunbartonshire",
    "Durham",
    "East Lothian",
    "East Riding of Yorkshire",
    "East Sussex",
    "Essex",
    "Fermanagh",
    "Fife",
    "Flintshire",
    "Glamorgan",
    "Glasgow",
    "Gloucestershire",
    "Greater London",
    "Greater Manchester",
    "Guernsey",
    "Gwynedd",
    "Hampshire",
    "Herefordshire",
    "Hertfordshire",
    "Inverness-shire",
    "Isle of Man",
    "Isle of Wight",
    "Jersey",
    "Kent",
    "Kincardineshire",
    "Kinross",
    "Kirkcudbrightshire",
    "Lanarkshire",
    "Lancashire",
    "Leicestershire",
    "Lincolnshire",
    "Londonderry",
    "Merioneth",
    "Merseyside",
    "Merthyr Tydfil",
    "Middlesex",
    "Midlothian",
    "Monmouthshire",
    "Montgomeryshire",
    "Morayshire",
    "Nairnshire",
    "Neath Port Talbot",
    "Newport",
    "Norfolk",
    "North Yorkshire",
    "Northamptonshire",
    "Northumberland",
    "Nottinghamshire",
    "Orkney",
    "Oxfordshire",
    "Peeblesshire",
    "Pembrokeshire",
    "Perthshire",
    "Powys",
    "Radnorshire",
    "Renfrewshire",
    "Rest of the World (outside UK)",
    "Rhondda-Cynon-Taff",
    "Ross-shire",
    "Roxburghshire",
    "Rutland",
    "Selkirkshire",
    "Shetland",
    "Shropshire",
    "Somerset",
    "South Yorkshire",
    "Staffordshire",
    "Stirlingshire",
    "Suffolk",
    "Surrey",
    "Sussex",
    "Sutherland",
    "Swansea",
    "Torfaen",
    "Tyne and Wear",
    "Tyrone",
    "Warwickshire",
    "West Lothian",
    "West Midlands",
    "West Sussex",
    "West Yorkshire",
    "Wigtownshire",
    "Wiltshire",
    "Worcestershire",
    "Wrexham",
  ];
  return chance.pickone(ukCounties);
}

function generateUKPostcode(): string {
  const postcodeArea =
    chance.character({ pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" }) +
    chance.character({ pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" }) +
    chance.integer({ min: 1, max: 9 });
  const postcodeDistrict =
    chance.integer({ min: 0, max: 9 }) +
    chance.character({ pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" });
  return `${postcodeArea} ${postcodeDistrict}`;
}

export { User, Address, generateRandomEmail };