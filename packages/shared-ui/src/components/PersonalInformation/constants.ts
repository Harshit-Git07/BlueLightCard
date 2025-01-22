import { ProfileSchema } from '../CardVerificationAlerts/types';
import { TextCase, transformTextCases } from '../../utils/transformTextCase';
import { DropdownOptions } from '../Dropdown/types';
import { generateDropdownOptions } from '../MyAccountDuplicatedComponents/Dropdown/utils/generateDropdownOptions';
import { Gender } from '@blc-mono/shared/models/members/enums/Gender';

export const getFieldNameFromKey = (key: string) => {
  return key // E.g. 'phoneNumber'
    .split(/(?=[A-Z])|(?<=[a-z])(?=[A-Z])/) // Split by case => 'phone', 'Number'
    .map((word) => word.toLowerCase()) // 'phone', 'number'
    .join(' '); // 'phone number'
};

export const renderGenderValue = (gender?: string) =>
  gender
    ? transformTextCases(gender, [TextCase.CAPS_FIRST_LETTER_ONLY, TextCase.WITHOUT_UNDERSCORES])
    : '';

type GenderOptions<T = ProfileSchema['gender']> = T extends undefined ? never : T;
const genderOptions: Array<GenderOptions> = [
  Gender.FEMALE,
  Gender.MALE,
  Gender.OTHER,
  Gender.PREFER_NOT_TO_SAY,
] as const;
export const genderDropdownOptions: DropdownOptions = genderOptions.map((genderOption) => ({
  id: genderOption,
  label: renderGenderValue(genderOption),
}));

const statesAU = [
  'Australian Capital Territory',
  'New South Wales',
  'Northern Territory',
  'Queensland',
  'South Australia',
  'Tasmania',
  'Victoria',
  'Western Australia',
] as const;
export const statesAUDropdownOptions = generateDropdownOptions(statesAU);

const countiesUK = [
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
] as const;
export const countiesUKDropdownOptions = generateDropdownOptions(countiesUK);
