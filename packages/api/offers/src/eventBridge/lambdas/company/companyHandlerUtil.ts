import { CompanyBrand } from '../../../models/companyBrand';
import { CompanyCategory } from '../../../models/companyCategory';
import { Tag } from '../../../models/tag';
import { CompanyTag } from '../../../models/companyTag';
import { Company } from '../../../models/company';

export function fillCompanyBrandConnectionData(companyUuid: string, brandId: string): CompanyBrand {
  return {
    companyId: companyUuid,
    brandId: brandId,
  };
}

export function putCompanyBrandConnectionData(tableName: string, companyUuid: string, brandId: string) {
  return {
    Put: {
      TableName: tableName,
      Item: fillCompanyBrandConnectionData(companyUuid, brandId),
    },
  };
}

export function fillCompanyCategoryConnectionData(companyUuid: string, categoryId: string): CompanyCategory {
  return {
    companyId: companyUuid,
    categoryId: categoryId,
  };
}

export function putCompanyCategoryConnectionData(tableName: string, companyUuid: string, categoryId: string) {
  return {
    Put: {
      TableName: tableName,
      Item: fillCompanyCategoryConnectionData(companyUuid, categoryId),
    },
  };
}

export function deleteCompanyCategoryConnectionData(tableName: string, companyUuid: string, categoryId: string) {
  return {
    Delete: {
      TableName: tableName,
      Key: { companyId: companyUuid, categoryId: categoryId },
    },
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

export function deleteCompanyTagConnectionData(
  tableName: string,
  companyUuid: string,
  companyTags: CompanyTag[],
): any[] {
  return companyTags.map((ct) => {
    return {
      Delete: {
        TableName: tableName,
        Key: { companyId: companyUuid, tagId: ct.tagId },
      },
    };
  });
}

export function fillCompanyDetails(companyDetails: Company, companyUuid: string, legacyId: string): Company {
  return {
    ...companyDetails,
    id: companyUuid,
    legacyId: legacyId,
  };
}

export function putCompanyDetails(tableName: string, companyDetails: Company): any {
  return {
    Put: {
      TableName: tableName,
      Item: companyDetails,
    },
  };
}
