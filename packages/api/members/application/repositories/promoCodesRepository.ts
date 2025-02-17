import {
  QueryCommand,
  QueryCommandOutput,
  TransactWriteCommand,
  TransactWriteCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { PromoCodeModel } from '@blc-mono/shared/models/members/promoCodeModel';
import { PromoCodeType } from '@blc-mono/shared/models/members/enums/PromoCodeType';
import { ApplyPromoCodeApplicationModel } from '@blc-mono/shared/models/members/applicationModel';
import {
  applicationKey,
  memberKey,
  promoCodeKey,
  Repository,
} from '@blc-mono/members/application/repositories/base/repository';
import { defaultDynamoDbClient } from '@blc-mono/members/application/providers/DynamoDb';
import { memberProfilesTableName } from '@blc-mono/members/application/providers/Tables';

export class PromoCodesRepository extends Repository {
  constructor(dynamoDB = defaultDynamoDbClient) {
    super(dynamoDB);
  }

  async getMultiUseOrSingleUseChildPromoCode(promoCode: string): Promise<PromoCodeModel[] | null> {
    const queryCommand = new QueryCommand({
      TableName: memberProfilesTableName(),
      IndexName: 'PromoCodeIndex',
      KeyConditionExpression: 'code = :code',
      FilterExpression: 'sk = :multiCodeSk OR begins_with(sk, :singleCodeChildSk)',
      ExpressionAttributeValues: {
        ':code': promoCode,
        ':multiCodeSk': 'MULTI_USE',
        ':singleCodeChildSk': 'SINGLE_USE#',
      },
    });

    const queryResult = await this.dynamoDB.send(queryCommand);

    return await this.getValidatedResultAsModel(queryResult);
  }

  async getSingleUseParentPromoCode(promoCodeId: string): Promise<PromoCodeModel[] | null> {
    const params = {
      TableName: memberProfilesTableName(),
      KeyConditionExpression: 'pk = :pk AND sk = :singleCodeParentSk',
      ExpressionAttributeValues: {
        ':pk': promoCodeKey(promoCodeId),
        ':singleCodeParentSk': 'SINGLE_USE',
      },
    };

    const queryResult = await this.dynamoDB.send(new QueryCommand(params));

    return await this.getValidatedResultAsModel(queryResult);
  }

  async updatePromoCodeUsage(
    promoCodeType: PromoCodeType,
    parentPromoCodeId: string,
    memberId: string,
    applicationId: string,
    applyPromoCodeApplicationModel: ApplyPromoCodeApplicationModel,
    singlePromoCodeId?: string,
  ): Promise<void> {
    const currentDate = new Date().toISOString();
    const singleUseChildCodeUpdateParams = {
      Update: {
        TableName: memberProfilesTableName(),
        Key: {
          pk: promoCodeKey(parentPromoCodeId),
          sk: `SINGLE_USE#${singlePromoCodeId}`,
        },
        UpdateExpression: 'SET #used = :used, #usedDate = :usedDate',
        ExpressionAttributeNames: {
          '#used': 'used',
          '#usedDate': 'usedDate',
        },
        ExpressionAttributeValues: {
          ':used': true,
          ':usedDate': currentDate,
        },
      },
    };
    const parentCodeUpdateParams = {
      Update: {
        TableName: memberProfilesTableName(),
        Key: {
          pk: promoCodeKey(parentPromoCodeId),
          sk: promoCodeType,
        },
        UpdateExpression: `ADD currentUsages :increment`,
        ExpressionAttributeValues: {
          ':increment': 1,
        },
      },
    };

    const [updateExpression, expressionAttributeNames, expressionAttributeValues] =
      this.getPartialUpdateExpressionValues(applyPromoCodeApplicationModel);
    const applicationUpdateParams = {
      Update: {
        TableName: memberProfilesTableName(),
        Key: {
          pk: memberKey(memberId),
          sk: applicationKey(applicationId),
        },
        UpdateExpression: `SET ${updateExpression.join(', ')} `,
        ExpressionAttributeNames: {
          ...expressionAttributeNames,
        },
        ExpressionAttributeValues: {
          ...expressionAttributeValues,
        },
      },
    };

    const transactItems = [applicationUpdateParams, parentCodeUpdateParams];
    if (promoCodeType === PromoCodeType.SINGLE_USE) {
      transactItems.push(singleUseChildCodeUpdateParams);
    }

    const params: TransactWriteCommandInput = {
      TransactItems: transactItems,
    };

    await this.dynamoDB.send(new TransactWriteCommand(params));
  }

  private async getValidatedResultAsModel(
    queryResult: QueryCommandOutput,
  ): Promise<PromoCodeModel[] | null> {
    if (!queryResult.Items || queryResult.Items.length === 0) {
      return null;
    }

    return queryResult.Items.map((item) => {
      return PromoCodeModel.parse(item);
    });
  }
}
