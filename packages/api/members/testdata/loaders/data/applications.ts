import { ApplicationModel } from '@blc-mono/shared/models/members/applicationModel';
import { DynamoRow } from '@blc-mono/members/testdata/loaders/loader/databaseSeeder';
import { EligibilityStatus } from '@blc-mono/shared/models/members/enums/EligibilityStatus';
import { ApplicationReason } from '@blc-mono/shared/models/members/enums/ApplicationReason';
import { PaymentStatus } from '@blc-mono/shared/models/members/enums/PaymentStatus';
import { applicationKey, memberKey } from '@blc-mono/members/application/repositories/repository';

type ApplicationModelForDynamo = ApplicationModel & DynamoRow;

export const applications: ApplicationModelForDynamo[] = [
  // neil.armstrong@instil.co
  buildApplication({
    memberId: '19921f4f-9d17-11ef-b68d-506b8d536548',
    applicationId: '1f5d801f-44b1-4961-8b4e-df1d8c0c8572',
  }),
  // marcmcgarry@bluelightcard.co.uk
  buildApplication({
    memberId: '825cb21b-5594-11ef-b68d-506b8d536548',
    applicationId: '03c8bae8-e30f-4f06-a432-55959a13adcf',
  }),
  // willsmith@bluelightcard.co.uk
  buildApplication({
    memberId: '56c292e4-a031-7027-0ccf-8c8cc152eb2d',
    applicationId: '5218fea8-8f7c-4fe5-a772-7d73f2592ce9',
  }),
  // muhammadshahrukh@bluelightcard.co.uk
  buildApplication({
    memberId: '11c998b8-de52-11ef-b2c8-506b8d536548',
    applicationId: 'ee4193b1-08b2-485b-8d5b-3261b0e8f1c0',
  }),
  // kevinoconnor@bluelightcard.co.uk
  buildApplication({
    memberId: 'de8e13c6-51f8-45be-b771-29f1bae35651',
    applicationId: '9dfd261e-4bd7-4da1-a167-6b5c0bdad4b9',
  }),
];

interface ApplicationModelBuilder
  extends Partial<Omit<ApplicationModelForDynamo, 'pk' | 'sk' | 'memberId' | 'applicationId'>> {
  memberId: string;
  applicationId: string;
}

function buildApplication({
  memberId,
  applicationId,
  startDate = '2023-10-02T22:21:22.648Z',
  eligibilityStatus = EligibilityStatus.INELIGIBLE,
  applicationReason = ApplicationReason.SIGNUP,
  paymentStatus = PaymentStatus.AWAITING_PAYMENT,
  ...application
}: ApplicationModelBuilder): ApplicationModelForDynamo {
  return {
    ...application,
    pk: memberKey(memberId),
    memberId,
    sk: applicationKey(applicationId),
    applicationId,
    startDate,
    eligibilityStatus,
    applicationReason,
    paymentStatus,
  };
}
