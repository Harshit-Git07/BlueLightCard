import { ProfileModel } from '@blc-mono/shared/models/members/profileModel';
import { Gender } from '@blc-mono/shared/models/members/enums/Gender';
import { DynamoRow } from '@blc-mono/members/testdata/loaders/loader/databaseSeeder';
import { memberKey, PROFILE } from '@blc-mono/members/application/repositories/repository';

export type ProfileModelForDynamo = ProfileModel & DynamoRow;

export const profiles: ProfileModelForDynamo[] = [
  buildProfile({
    memberId: '19921f4f-9d17-11ef-b68d-506b8d536548',
    email: 'neil.armstrong@instil.co',
    firstName: 'Neil',
    lastName: 'Armstrong',
  }),
  buildProfile({
    memberId: '825cb21b-5594-11ef-b68d-506b8d536548',
    email: 'marcmcgarry@bluelightcard.co.uk',
    firstName: 'Marc',
    lastName: 'McGarry',
  }),
  buildProfile({
    memberId: '56c292e4-a031-7027-0ccf-8c8cc152eb2d',
    email: 'willsmith@bluelightcard.co.uk',
    firstName: 'Will',
    lastName: 'Smith',
  }),
  buildProfile({
    memberId: '4f0153b7-e2e9-11ef-bead-506b8df2a7a7',
    email: 'willsmith+newuser@bluelightcard.co.uk',
    firstName: 'Will',
    lastName: 'Smith',
  }),
  buildProfile({
    memberId: '11c998b8-de52-11ef-b2c8-506b8d536548',
    email: 'muhammadshahrukh@bluelightcard.co.uk',
    firstName: 'Muhammad',
    lastName: 'Shahrukh',
  }),
];

interface ProfileModelBuilder
  extends Partial<
    Omit<ProfileModelForDynamo, 'pk' | 'sk' | 'memberId' | 'email' | 'firstName' | 'lastName'>
  > {
  memberId: string;
  email: string;
  firstName: string;
  lastName: string;
}

function buildProfile({
  memberId,
  email,
  firstName,
  lastName,
  dateOfBirth = '1975-04-27',
  gender = Gender.MALE,
  phoneNumber = '07700853618',
  county = 'West Dunbartonshire',
  emailValidated = true,
  spareEmailValidated = false,
  signupDate = '2023-08-11T06:01:00.636Z',
  status = 'CONFIRMED',
  ...profile
}: ProfileModelBuilder): ProfileModelForDynamo {
  return {
    ...profile,
    pk: memberKey(memberId),
    memberId,
    sk: PROFILE,
    email,
    firstName,
    lastName,
    dateOfBirth,
    gender,
    phoneNumber,
    county,
    emailValidated,
    spareEmailValidated,
    signupDate,
    status,
  };
}
