import { Logger } from '@aws-lambda-powertools/logger';
import { Tag } from '../../../models/tag';
import { TagService } from '../../../services/tagService';
import { Company, CompanyModel } from '../../../models/company';
import { validateBrand } from '../../../utils/validation';
import { CategoryService } from '../../../services/categoryService';
import { CompanyService } from '../../../services/companyService';

interface EventDetail {
  brand: string;
  tags: string[];
  companyDetails: Company;
  businessCatId: number;
}

export class CompanyHandler {
  private service: string = process.env.SERVICE as string;
  private categoryTable: string | undefined = (process.env.CATEGORY_TABLE_NAME as string) || undefined;
  private companyTable: string | undefined = (process.env.COMPANY_TABLE_NAME as string) || undefined;
  private companyBrandConnectionTable: string | undefined =
    (process.env.COMPANY_BRAND_CONNECTION_TABLE as string) || undefined;
  private companyCategoryConnectionTable: string | undefined =
    (process.env.COMPANY_CATEGORY_CONNECTION_TABLE as string) || undefined;
  private tagTable: string | undefined = (process.env.TAG_TABLE_NAME as string) || undefined;
  private companyTagConnectionTable: string | undefined =
    (process.env.COMPANY_TAG_CONNECTION_TABLE as string) || undefined;

  private logger = new Logger({ serviceName: `${this.service}-company-event` });
  private tagService: TagService;
  private categoryService: CategoryService;
  private companyService: CompanyService;

  constructor() {
    this.validateEnvironmentVariables();
    this.tagService = new TagService(this.tagTable!, this.logger);
    this.categoryService = new CategoryService(this.categoryTable!, this.logger);
    this.companyService = new CompanyService(
      {
        companyTable: this.companyTable,
        companyBrandConnectionTable: this.companyBrandConnectionTable,
        companyCategoryConnectionTable: this.companyCategoryConnectionTable,
        companyTagConnectionTable: this.companyTagConnectionTable,
      },
      this.logger,
    );
  }

  public async handleCompanyCreate(event: any) {
    this.logger.info('Company create event started', { event });
    const payload: EventDetail = event.detail;
    if (!validateBrand(payload.brand)) {
      this.logger.error('Invalid brand', { brand: payload.brand });
      throw new Error(`Invalid brand: ${payload.brand}`);
    }
    const company = this.validateCompanyDetails(payload.companyDetails);
    const categoryID = await this.categoryService.getCategoryIdByLegacyId(`${payload.brand}#${payload.businessCatId}`);
    let tags: Tag[] = [];
    if (payload.tags && payload.tags.length > 0) {
      try {
        tags = await this.tagService.getOrCreateTagsByNames(payload.tags);
      } catch (error) {
        this.logger.error('tag manager service failed', { error });
        throw error;
      }
    }
    const transactionParams = {
      categoryId: categoryID,
      brandId: payload.brand,
      companyDetails: company,
      tags: tags,
    };
    await this.companyService.transactionSaveForCompanyConnections(transactionParams);
  }

  private validateEnvironmentVariables() {
    if (
      !this.categoryTable ||
      !this.companyTable ||
      !this.companyBrandConnectionTable ||
      !this.companyCategoryConnectionTable ||
      !this.tagTable ||
      !this.companyTagConnectionTable
    ) {
      this.logger.info('Missing table name(s) in environment variables', {
        category: this.categoryTable,
        company: this.companyTable,
        tag: this.tagTable,
        companyBrandConnection: this.companyBrandConnectionTable,
        companyCategoryConnection: this.companyCategoryConnectionTable,
        companyTagConnection: this.companyTagConnectionTable,
      });
      throw new Error(`Missing table name(s) in environment variables: 
        category: ${this.categoryTable}, 
        company: ${this.companyTable}, 
        tag: ${this.tagTable},
        companyBrandConnection: ${this.companyBrandConnectionTable}, 
        companyCategoryConnection: ${this.companyCategoryConnectionTable},
        companyTagConnection: ${this.companyTagConnectionTable}`);
    }
  }
  private validateCompanyDetails(companyDetailsPayload: Company) {
    this.logger.info('CompanyDetails payload received', { companyDetailsPayload });
    const result = CompanyModel.safeParse(companyDetailsPayload);
    if (!result.success) {
      this.logger.error('Invalid companyDetailsPayload', { payload: companyDetailsPayload });
      throw new Error('Invalid Data' + JSON.stringify(result.error));
    }
    return companyDetailsPayload;
  }
}
