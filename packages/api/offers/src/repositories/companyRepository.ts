import { DbHelper } from '../../../core/src/aws/dynamodb/dbhelper';
import { Company } from '../models/company';

export class CompanyRepository {
  constructor(private readonly tableName: string) {}

  async getById(companyId: string) {
    const params = {
      TableName: this.tableName,
      Key: {
        id: companyId,
      },
    };
    return await DbHelper.get(params);
  }

  async batchGetByIds(ids: string[]) {
    const params = {
      RequestItems: {
        [this.tableName]: {
          Keys: ids.map((id) => ({ id })),
        }
      }
    };

    return DbHelper.batchGet(params);
  }

  async getByLegacyId(legacyId: string) {
    const params = {
      TableName: this.tableName,
      IndexName: 'legacyId',
      KeyConditionExpression: 'legacyId = :legacyId',
      ExpressionAttributeValues: {
        ':legacyId': legacyId,
      },
    };
    return await DbHelper.query(params);
  }

  async save(company: Company) {
    const params = {
      TableName: this.tableName,
      Item: company,
    };
    return await DbHelper.save(params);
  }

  async updateIdApprovedField(companyId: string, isApproved: boolean) {
    const param = {
      TableName: this.tableName,
      Key: { id: companyId },
      UpdateExpression: 'SET isApproved = :isApproved',
      ExpressionAttributeValues: {
        ':isApproved': isApproved,
      },
    };
    return await DbHelper.update(param);
  }

  async updateCompanySmallLogo(companyId: string, companySmallLogo: string) {
    const param = {
      TableName: this.tableName,
      Key: { id: companyId },
      UpdateExpression: 'SET smallLogo = :smallLogo',
      ExpressionAttributeValues: {
        ':smallLogo': companySmallLogo,
      },
    };
    return await DbHelper.update(param);
  }

  async updateCompanyLargeLogo(companyId: string, companyLargeLogo: string) {
    const param = {
      TableName: this.tableName,
      Key: { id: companyId },
      UpdateExpression: 'SET largeLogo = :largeLogo',
      ExpressionAttributeValues: {
        ':largeLogo': companyLargeLogo,
      },
    };
    return await DbHelper.update(param);
  }

  async updateCompanyBothLogos(companyId: string, companyLargeLogo: string, companySmallLogo: string) {
    const param = {
      TableName: this.tableName,
      Key: { id: companyId },
      UpdateExpression: 'SET largeLogo = :largeLogo, smallLogo = :smallLogo',
      ExpressionAttributeValues: {
        ':largeLogo': companyLargeLogo,
        ':smallLogo': companySmallLogo,
      },
    };
    return await DbHelper.update(param);
  }

  async batchWrite(putRequests: any[]) {
    const params = {
      RequestItems: {
        [this.tableName]: putRequests,
      },
    }
    return await DbHelper.batchWrite(params);
  }
}
