import { Logger } from '@aws-lambda-powertools/logger';
import { Tag } from '../../../models/tag';
import { TagService } from '../../../services/tagService';
import { Company, CompanyModel } from '../../../models/company';
import { validateBrand } from '../../../utils/validation';
import { CategoryService } from '../../../services/categoryService';
import { CompanyService } from '../../../services/companyService';
import {
  CompanyBothLogos,
  CompanyBothLogosModel,
  CompanyLargeLogo,
  CompanyLargeLogoModel,
  CompanySmallLogo,
  CompanySmallLogoModel,
  IsApproved,
  IsApprovedModel,
  UpdateCompanyDetails,
  UpdateCompanyModel,
} from './companyEventDetail';
import {
  deleteCompanyTagConnectionData,
  putCompanyDetails,
  fillCompanyTagConnectionData,
  putCompanyCategoryConnectionData,
  deleteCompanyCategoryConnectionData,
  fillCompanyDetails,
  putCompanyBrandConnectionData,
} from './companyHandlerUtil';
import { CompanyTag } from '../../../models/companyTag';
import { Convertor } from '../../../utils/convertor';
import { TransactionService } from '../../../services/transactionService';
import { CompanyCategoryService } from '../../../services/companyCategoryService';
import { CompanyCategory } from '../../../models/companyCategory';
import { v4 } from 'uuid';
import { CompanyTagService } from '../../../services/companyTagService';
import { filterUndefinedValues } from "../../../utils/filters";

interface EventDetail {
  brand: string;
  tags: string[];
  companyDetails: Company | UpdateCompanyDetails;
  businessCatId: number;
  IsApproved?: IsApproved;
  companySmallLogo: CompanySmallLogo;
  companyLargeLogo: CompanyLargeLogo;
  companyBothLogos: CompanyBothLogos;
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
  private companyCategoryService: CompanyCategoryService;
  private companyTagService: CompanyTagService;
  private transactionService: TransactionService;

  constructor() {
    this.validateEnvironmentVariables();
    this.tagService = new TagService(this.tagTable!, this.logger);
    this.categoryService = new CategoryService(this.categoryTable!, this.logger);
    this.companyService = new CompanyService(this.companyTable!, this.logger);
    this.companyCategoryService = new CompanyCategoryService(this.companyCategoryConnectionTable!, this.logger);
    this.companyTagService = new CompanyTagService(this.companyTagConnectionTable!, this.logger);
    this.transactionService = new TransactionService(this.logger);
  }

  public async handleCompanyCreate(event: any) {
    this.logger.info('Company create event started', { event });
    const transactionItem = [];
    const companyUuid = v4();
    const payload: EventDetail = event.detail;
    if (!validateBrand(payload.brand)) {
      this.logger.error('Invalid brand', { brand: payload.brand });
      throw new Error(`Invalid brand: ${payload.brand}`);
    }
    const company = this.validateCompanyDetails(payload.companyDetails as Company);
    transactionItem.push(
      putCompanyDetails(
        this.companyTable!,
        fillCompanyDetails(
          filterUndefinedValues(company),
          companyUuid,
          Convertor.legacyIdToString(payload.brand, payload.companyDetails.legacyId!),
        ),
      ),
    );

    this.validateBusinessCatId(payload.businessCatId);
    const categoryID = await this.categoryService.getCategoryIdByLegacyId(
      Convertor.legacyIdToString(payload.brand, payload.businessCatId),
    );

    if (!categoryID) {
      this.logger.error('Category not found', { legacyId: payload.businessCatId });
      throw new Error(`Category not found for businessCatId: ${payload.businessCatId}`);
    }

    transactionItem.push(
      putCompanyCategoryConnectionData(this.companyCategoryConnectionTable!, companyUuid, categoryID),
    );
    transactionItem.push(putCompanyBrandConnectionData(this.companyBrandConnectionTable!, companyUuid, payload.brand));

    let tags: Tag[] = [];
    if (payload.tags && payload.tags.length > 0) {
      try {
        tags = await this.tagService.getOrCreateTagsByNames(payload.tags);
      } catch (error) {
        this.logger.error('tag manager service failed', { error });
        throw error;
      }
    }

    if (tags && tags.length > 0) {
      const companyTagConnectionData = fillCompanyTagConnectionData(this.companyTagConnectionTable!, companyUuid, tags);
      transactionItem.push(...companyTagConnectionData);
    }

    try {
      await this.transactionService.writeTransaction(transactionItem);
    } catch (error) {
      this.logger.error('Company create Event, transactionalSave failed', { error });
      throw error;
    }
  }

  public async handleCompanyUpdate(event: any) {
    this.logger.info('Company update event started', { event });
    const payload: EventDetail = event.detail;

    if (!validateBrand(payload.brand)) {
      this.logger.error('Invalid brand', { brand: payload.brand });
      throw new Error(`Invalid brand: ${payload.brand}`);
    }

    if (this.isTransactionalUpdate(payload)) {
      await this.updateTransactionalAction(payload);
    } else {
      await this.updateNonTransactionalAction(payload);
    }
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
    if(companyDetailsPayload.legacyId) {
      companyDetailsPayload.legacyId = companyDetailsPayload.legacyId.toString();
    }else {
      this.logger.error('Invalid legacy company id', { payload: companyDetailsPayload });
      throw new Error('Invalid Data company legacyId is missing');
    }

    const result = CompanyModel.safeParse(companyDetailsPayload);
    if (!result.success) {
      this.logger.error('Invalid companyDetailsPayload', { payload: companyDetailsPayload });
      throw new Error('Invalid Data' + JSON.stringify(result.error));
    }
    return companyDetailsPayload;
  }

  private validateBusinessCatId(businessCatId: number) {
    if (!businessCatId){
      this.logger.error('Invalid businessCatId', { businessCatId });
      throw new Error(`Invalid businessCatId: ${businessCatId}`);
    }
  }

  private isTransactionalUpdate(payload: EventDetail) {
    return !payload.IsApproved && !payload.companySmallLogo && !payload.companyLargeLogo && !payload.companyBothLogos;
  }

  private async updateTags(tags: string[], companyId: string) {
    const payloadTags = await this.tagService.getOrCreateTagsByNames(tags);
    const companyTags = await this.companyTagService.findCompanyTagConnectionsByCompanyId(companyId);
    const tagsToBeDeleted: CompanyTag[] = companyTags.filter((tag) => !payloadTags.some((t) => t.id === tag.tagId));
    const tagsToBeAdded: Tag[] = payloadTags.filter((tag) => !companyTags.some((t) => t.tagId === tag.id));
    const deleteParams = deleteCompanyTagConnectionData(this.companyTagConnectionTable!, companyId, tagsToBeDeleted);
    const putParams = fillCompanyTagConnectionData(this.companyTagConnectionTable!, companyId, tagsToBeAdded);

    return {
      deleteParams,
      putParams,
    };
  }

  private async handleUpdateIsApproved(IsApproved: IsApproved, brand: string) {
    const validateIsApprove = IsApprovedModel.safeParse(IsApproved);
    if (validateIsApprove.success) {
      await this.companyService.updateIsApprovedByLegacyId(
        Convertor.legacyIdToString(brand, IsApproved.legacyCompanyId),
        IsApproved.isApproved,
      );
    } else {
      this.logger.error('Company Update IsApproved, Invalid Data', { payload: IsApproved });
      throw new Error('Company Update IsApproved, Invalid Data' + JSON.stringify(validateIsApprove.error));
    }
  }

  private async handleUpdateCompanySmallLogo(companySmallLogo: CompanySmallLogo, brand: string) {
    const validateCompanySmallLogo = CompanySmallLogoModel.safeParse(companySmallLogo);
    if (validateCompanySmallLogo.success) {
      await this.companyService.updateSmallLogoByLegacyId(
        Convertor.legacyIdToString(brand, companySmallLogo.legacyCompanyId),
        companySmallLogo.smallLogo,
      );
    } else {
      this.logger.error('Company Update Small Logo, Invalid Data', { payload: companySmallLogo });
      throw new Error('Company Update Small Logo, Invalid Data' + JSON.stringify(validateCompanySmallLogo.error));
    }
  }

  private async handleUpdateCompanyLargeLogo(companyLargeLogo: CompanyLargeLogo, brand: string) {
    const validateCompanyLargeLogo = CompanyLargeLogoModel.safeParse(companyLargeLogo);
    if (validateCompanyLargeLogo.success) {
      await this.companyService.updateLargeLogoByLegacyId(
        Convertor.legacyIdToString(brand, companyLargeLogo.legacyCompanyId),
        companyLargeLogo.largeLogo,
      );
    } else {
      this.logger.error('Company Update Large Logo, Invalid Data', { payload: companyLargeLogo });
      throw new Error('Company Update Large Logo, Invalid Data' + JSON.stringify(validateCompanyLargeLogo.error));
    }
  }

  private async handleUpdateCompanyBothLogos(companyBothLogos: CompanyBothLogos, brand: string) {
    const validateCompanyBothLogos = CompanyBothLogosModel.safeParse(companyBothLogos);
    if (validateCompanyBothLogos.success) {
      await this.companyService.updateBothLogosByLegacyId(
        Convertor.legacyIdToString(brand, companyBothLogos.legacyCompanyId),
        companyBothLogos.largeLogo,
        companyBothLogos.smallLogo,
      );
    } else {
      this.logger.error('Company Update Both Logos, Invalid Data', { payload: companyBothLogos });
      throw new Error('Company Update Both Logos, Invalid Data' + JSON.stringify(validateCompanyBothLogos.error));
    }
  }

  private async handleUpdateCompanyDetails(companyDetails: UpdateCompanyDetails, brand: string) {
    const validateCompanyDetails = UpdateCompanyModel.safeParse(companyDetails);
    if (validateCompanyDetails.success) {
      const mergedCompany = await this.companyService.mergeUpdatedToExistsCompanyDetails(
        Convertor.legacyIdToString(brand, companyDetails.legacyId!),
        companyDetails,
      );
      return putCompanyDetails(this.companyTable!, mergedCompany);
    } else {
      this.logger.error('Company Update, Invalid Company Data', { payload: companyDetails });
      throw new Error('Company Update, Invalid Company Data' + JSON.stringify(validateCompanyDetails.error));
    }
  }

  private async handleUpdateCategory(payload: EventDetail, existingCompanyId: string) {
    let categoryToAdd;
    let categoryToDelete;

    const categoryID = await this.categoryService.getCategoryIdByLegacyId(
      Convertor.legacyIdToString(payload.brand, payload.businessCatId),
    );

    if (!categoryID) {
      this.logger.error('Category not found', { legacyId: payload.businessCatId });
      throw new Error(`Category not found for businessCatId: ${payload.businessCatId}`);
    }

    const companyCategory = await this.companyCategoryService.getByCompanyIdCategoryId(categoryID, existingCompanyId);
    if (!companyCategory) {
      categoryToAdd = putCompanyCategoryConnectionData(
        this.companyCategoryConnectionTable!,
        existingCompanyId,
        categoryID,
      );
      const oldCompanyCategoryItems: CompanyCategory[] | undefined = await this.companyCategoryService.getByCompanyId(
        existingCompanyId,
      );
      if (oldCompanyCategoryItems) {
        categoryToDelete = deleteCompanyCategoryConnectionData(
          this.companyCategoryConnectionTable!,
          existingCompanyId,
          oldCompanyCategoryItems[0].categoryId,
        );
      } else {
        this.logger.error('CompanyCategory not found', { companyId: existingCompanyId });
        throw new Error(`CompanyCategory not found: companyId: ${existingCompanyId}`);
      }
    }

    return {
      categoryToAdd,
      categoryToDelete,
    };
  }

  private async updateTransactionalAction(payload: EventDetail) {
    const transactionItem = [];

    if (payload.companyDetails) {
      const newCompanyDetails = await this.handleUpdateCompanyDetails(
        payload.companyDetails as UpdateCompanyDetails,
        payload.brand,
      );
      transactionItem.push(newCompanyDetails);
    }

    const company = await this.companyService.getByLegacyId(
      Convertor.legacyIdToString(payload.brand, payload.companyDetails.legacyId!),
    );

    if (!company) {
      this.logger.error('Company not found', { legacyId: payload.companyDetails.legacyId });
      throw new Error(`Company not found: legacyId: ${payload.companyDetails.legacyId}`);
    }

    if (payload.businessCatId) {
      const categoryParams = await this.handleUpdateCategory(payload, company.id!);
      categoryParams.categoryToAdd && transactionItem.push(categoryParams.categoryToAdd);
      categoryParams.categoryToDelete && transactionItem.push(categoryParams.categoryToDelete);
    } else {
      this.logger.error('Invalid businessCatId', { payload });
      throw new Error(`Invalid businessCatId`);
    }

    if (payload.tags) {
      const tagsParam = await this.updateTags(payload.tags, company.id!);
      transactionItem.push(...tagsParam.deleteParams);
      transactionItem.push(...tagsParam.putParams);
    }

    await this.transactionService.writeTransaction(transactionItem);
  }

  private async updateNonTransactionalAction(payload: EventDetail) {
    if (payload.IsApproved) {
      await this.handleUpdateIsApproved(payload.IsApproved, payload.brand);
      return;
    }

    if (payload.companySmallLogo) {
      await this.handleUpdateCompanySmallLogo(payload.companySmallLogo, payload.brand);
      return;
    }

    if (payload.companyLargeLogo) {
      await this.handleUpdateCompanyLargeLogo(payload.companyLargeLogo, payload.brand);
      return;
    }

    if (payload.companyBothLogos) {
      await this.handleUpdateCompanyBothLogos(payload.companyBothLogos, payload.brand);
      return;
    }
  }
}
