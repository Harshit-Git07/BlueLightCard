import { Logger } from '@aws-lambda-powertools/logger';
import { Company } from '../models/company';
import { Tag } from '../models/tag';
import { v4 } from 'uuid';
import { filterUndefinedValues } from '../utils/filters';
import {
  fillCompanyBrandConnectionData,
  fillCompanyCategoryConnectionData,
  fillCompanyTagConnectionData,
} from '../eventBridge/lambdas/company/companyHandlerUtil';
import { DbHelper } from '@blc-mono/core/aws/dynamodb/dbhelper';

interface TableNames {
  companyTable?: string;
  companyBrandConnectionTable?: string;
  companyCategoryConnectionTable?: string;
  companyTagConnectionTable?: string;
}
interface TransactionParams {
  categoryId: string;
  brandId: string;
  companyDetails: Company;
  tags?: Tag[];
}

export class CompanyService {
  constructor(private readonly tableNames: TableNames, private readonly logger: Logger) {}

  public async transactionSaveForCompanyConnections(transactionParams: TransactionParams) {
    this.logger.info('transaction save started', { transactionParams });
    const companyUuid = v4();

    const params = {
      TransactItems: [
        {
          Put: {
            TableName: this.tableNames.companyTable,
            Item: {
              ...filterUndefinedValues(transactionParams.companyDetails),
              id: companyUuid,
              legacyId: `${transactionParams.brandId}#${transactionParams.companyDetails.legacyId}`,
            },
          },
        },
        {
          Put: {
            TableName: this.tableNames.companyBrandConnectionTable,
            Item: fillCompanyBrandConnectionData(companyUuid, transactionParams.brandId),
          },
        },
        {
          Put: {
            TableName: this.tableNames.companyCategoryConnectionTable,
            Item: fillCompanyCategoryConnectionData(companyUuid, transactionParams.categoryId),
          },
        },
      ],
    };

    if (transactionParams.tags && transactionParams.tags.length > 0) {
      const companyTagConnectionData = fillCompanyTagConnectionData(
        this.tableNames.companyTagConnectionTable!,
        companyUuid,
        transactionParams.tags,
      );
      params.TransactItems.push(...companyTagConnectionData);
    }

    try {
      await DbHelper.transactionalSave(params);
    } catch (error) {
      this.logger.error('transactionalSave failed', { error });
      throw error;
    }
  }
}
