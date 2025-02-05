import { PromoCodeModel } from '@blc-mono/shared/models/members/promoCodeModel';
import { DynamoRow } from '@blc-mono/members/testdata/loaders/loader/databaseSeeder';
import { PromoCodeType } from '@blc-mono/shared/models/members/enums/PromoCodeType';
import {
  promoCodeKey,
  singleUsePromoCodeKey,
} from '@blc-mono/members/application/repositories/repository';

export type PromoCodeModelForDynamo = PromoCodeModel & DynamoRow;

export const promoCodeSingleUse: PromoCodeModelForDynamo[] = [
  // ORG_SKIP_BOTH
  buildPromoCode({
    parentId: '556f8b95-9d8c-426f-9dff-576c7e1c5e46',
    singleCodeId: '8394ce88-2791-4c39-9345-e19f3fa3c751',
    code: 'SINGLE_USE_SKIP_ALL',
  }),
  // EMPLOYER_SKIP_BOTH
  buildPromoCode({
    parentId: '389f65b8-2320-471d-b63d-704dcab40ee1',
    singleCodeId: '8394ce88-2791-4c39-9345-e19f3fa3c751',
    code: 'SINGLE_USE_SKIP_ALL',
  }),
];

interface PromoCodeModelBuilder
  extends Partial<
    Omit<
      PromoCodeModelForDynamo,
      'pk' | 'sk' | 'parentId' | 'singleCodeId' | 'code' | 'promoCodeType'
    >
  > {
  parentId: string;
  singleCodeId: string;
  code: string;
}

function buildPromoCode({
  parentId,
  singleCodeId,
  code,
  used = false,
  addedDate = '2021-09-07T12:21:17.000Z',
  ...multiUsePromoCode
}: PromoCodeModelBuilder): PromoCodeModelForDynamo {
  return {
    ...multiUsePromoCode,
    pk: promoCodeKey(parentId),
    parentId,
    sk: singleUsePromoCodeKey(singleCodeId),
    singleCodeId,
    code,
    used,
    addedDate,
    promoCodeType: PromoCodeType.SINGLE_USE,
  };
}
