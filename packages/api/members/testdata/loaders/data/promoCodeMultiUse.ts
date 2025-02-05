import { DynamoRow } from '@blc-mono/members/testdata/loaders/loader/databaseSeeder';
import { PromoCodeModel } from '@blc-mono/shared/models/members/promoCodeModel';
import { PromoCodeType } from '@blc-mono/shared/models/members/enums/PromoCodeType';
import { promoCodeKey } from '@blc-mono/members/application/repositories/repository';

export type PromoCodeModelForDynamo = PromoCodeModel & DynamoRow;

export const promoCodeMultiUse: PromoCodeModelForDynamo[] = [
  buildPromoCode({
    parentId: 'a5411a7f-315f-4445-80de-6a44a5ce8e4f',
    // Org: Promocode: Skip ID
    codeProvider: '455cd16d-06a1-4cf2-b6e6-159da32231d2',
    name: 'ORG_SKIP_ID',
    code: 'SKIP_ID',
  }),
  buildPromoCode({
    parentId: 'b970dcdc-e226-4927-9b8b-cdb518b5f34e',
    // Org: Promocode: Skip Payment
    codeProvider: '039253f9-2e19-4dd3-8256-bbcde2f3ae5c',
    name: 'ORG_SKIP_PAYMENT',
    code: 'SKIP_PAYMENT',
  }),
  buildPromoCode({
    parentId: '556f8b95-9d8c-426f-9dff-576c7e1c5e46',
    // Org: Promocode: Skip Both
    codeProvider: 'b23dc25f-6f8e-4c8f-949d-7fcd8aa81951',
    name: 'ORG_SKIP_BOTH',
    code: 'SKIP_BOTH',
  }),
  buildPromoCode({
    parentId: '27de4c16-f2ec-4b6f-8691-8d03566cb958',
    // Employer: Promocode: Skip ID
    codeProvider: 'fbdf3e19-19bd-495d-b82d-f6bf07540ba0',
    name: 'EMPLOYER_SKIP_ID',
    code: 'SKIP_ID',
  }),
  buildPromoCode({
    parentId: '765d9e8c-3507-4940-9068-1b06cee57b9b',
    // Employer: Promocode: Skip Payment
    codeProvider: '1a11d9d1-98cf-4dd8-8121-936e78dc2a84',
    name: 'EMPLOYER_SKIP_PAYMENT',
    code: 'SKIP_PAYMENT',
  }),
  buildPromoCode({
    parentId: '389f65b8-2320-471d-b63d-704dcab40ee1',
    // Employer: Promocode: Skip Both
    codeProvider: 'efe697c8-a3da-4230-91e3-c39d2f7356fb',
    name: 'EMPLOYER_SKIP_BOTH',
    code: 'SKIP_BOTH',
  }),
];

interface PromoCodeModelBuilder
  extends Partial<
    Omit<
      PromoCodeModelForDynamo,
      'pk' | 'sk' | 'parentId' | 'codeProvider' | 'name' | 'code' | 'promoCodeType'
    >
  > {
  parentId: string;
  codeProvider: string;
  name: string;
  code: string;
}

function buildPromoCode({
  parentId,
  codeProvider,
  name,
  code,
  description = 'Skip both',
  active = true,
  bypassVerification = true,
  bypassPayment = true,
  cardValidityTerm = 2,
  currentUsages = 345,
  maxUsages = 1000,
  createdDate = '2021-09-07T12:21:17.000Z',
  lastUpdatedDate = '2021-09-07T12:21:17.000Z',
  validityStartDate = '2021-09-07T12:21:17.000Z',
  validityEndDate = '2029-11-30T13:00:24.000Z',
  ...multiUsePromoCode
}: PromoCodeModelBuilder): PromoCodeModelForDynamo {
  return {
    ...multiUsePromoCode,
    pk: promoCodeKey(parentId),
    parentId,
    sk: 'MULTI_USE',
    codeProvider,
    name,
    code,
    description,
    active,
    bypassVerification,
    bypassPayment,
    cardValidityTerm,
    currentUsages,
    maxUsages,
    createdDate,
    lastUpdatedDate,
    validityStartDate,
    validityEndDate,
    promoCodeType: PromoCodeType.MULTI_USE,
  };
}
