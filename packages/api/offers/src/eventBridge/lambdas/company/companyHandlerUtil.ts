import { CompanyBrand } from '../../../models/companyBrand';
import { CompanyCategory } from '../../../models/companyCategory';
import { Tag } from '../../../models/tag';

export function fillCompanyBrandConnectionData(companyUuid: string, brandId: string): CompanyBrand {
  return {
    companyId: companyUuid,
    brandId: brandId,
  };
}

export function fillCompanyCategoryConnectionData(companyUuid: string, categoryId: string): CompanyCategory {
  return {
    companyId: companyUuid,
    categoryId: categoryId,
  };
}

export function fillCompanyTagConnectionData(tableName: string, companyUuid: string, tags: Tag[]): any[] {
  return tags.map((tag) => {
    return {
      Put: {
        TableName: tableName,
        Item: { companyId: companyUuid, tagId: tag.id },
      },
    };
  });
}
