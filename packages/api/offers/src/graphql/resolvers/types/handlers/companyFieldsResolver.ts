import { Logger } from '@aws-lambda-powertools/logger'
import { getCategories } from './fields/categoryFieldResolver'
import { CompanyCategoryConnectionRepository } from '../../../../repositories/companyCategoryConnectionRepository'
import { getBrands } from './fields/brandFieldResolver'
import { CompanyBrandConnectionRepository } from '../../../../repositories/companyBrandConnectionRepository'
import * as console from 'console'

export class CompanyFieldsResolver {
  private readonly companyBrandConnectionTable = process.env.COMPANY_BRAND_CONNECTION_TABLE as string;
  private readonly companyCategoryConnectionTable = process.env.COMPANY_CATEGORY_CONNECTION_TABLE as string;

  constructor (private companyId: string, private categoryTable: string, private brandTable: string, private logger: Logger) {
    logger.info('CompanyFieldsResolver Started')
  }

  async resolveCategories () {
    this.logger.info('Company categories field resolver started')
    const companyCategoryResult = await new CompanyCategoryConnectionRepository(this.companyCategoryConnectionTable).getByCompanyId(this.companyId);
    if (this.checkIfEmpty(companyCategoryResult.Items)) {
      this.logger.error('Company categories connection not found for given company id', { companyId: this.companyId });
      throw new Error('Company categories connection not found')
    }
    const categoryIds = companyCategoryResult.Items?.map((item) => item.categoryId)
    return await getCategories(categoryIds, this.categoryTable, this.logger);
  }


  async resolveBrands () {
    this.logger.info('Company brands field resolver started')
    const companyBrandResult = await new CompanyBrandConnectionRepository(this.companyBrandConnectionTable).getByCompanyId(this.companyId);
    if (this.checkIfEmpty(companyBrandResult.Items)) {
      this.logger.error('Company brands connection not found for given company id', { companyId: this.companyId });
      throw new Error('Company brands connection not found')
    }
    const brandIds = companyBrandResult.Items?.map((item) => item.brandId)
    return await getBrands(brandIds, this.brandTable, this.logger)
  }

  private checkIfEmpty (items: any) {
    return items === null || (items != null && items.length === 0)
  }
}
