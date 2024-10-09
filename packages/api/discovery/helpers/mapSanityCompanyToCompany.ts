import { AgeRestriction, Company as SanityCompany } from '@bluelightcard/sanity-types';

import { mapSanityTrustToTrust } from '@blc-mono/discovery/helpers/mapSanityTrustToTrust';

import { Company } from '../application/models/Company';

export const mapSanityCompanyToCompany = (sanityCompany: SanityCompany): Company => {
  const brandDetails = sanityCompany.brandCompanyDetails?.[0];

  if (!brandDetails) {
    throw new Error('Missing sanity field: brandCompanyDetails');
  }
  if (!brandDetails.companyName) {
    throw new Error('Missing sanity field: companyName');
  }
  if (!brandDetails.companyLogo?.default?.asset?.url) {
    throw new Error('Missing sanity field: companyLogo.default.asset.url');
  }
  if (!brandDetails.ageRestrictions) {
    throw new Error('Missing sanity field: ageRestrictions');
  }

  return {
    id: sanityCompany._id,
    legacyCompanyId: brandDetails.companyId,
    name: brandDetails.companyName,
    logo: brandDetails?.companyLogo?.default?.asset?.url,
    ageRestrictions: mapAgeRestrictions(brandDetails?.ageRestrictions),
    alsoKnownAs: sanityCompany.alsoKnownAs || [],
    includedTrusts: mapSanityTrustToTrust(sanityCompany.includedTrust),
    excludedTrusts: mapSanityTrustToTrust(sanityCompany.excludedTrust),
    categories:
      sanityCompany.categorySelection?.map((category) => ({
        id: category.categoryItem?.id ?? 0,
        name: category.categoryItem?.name ?? '',
        parentCategoryIds: [],
        level: category.category1?.level ?? 0,
        updatedAt: new Date().toISOString(),
      })) || [],
    local: sanityCompany.local || false,
    updatedAt: sanityCompany._updatedAt,
  };
};

const mapAgeRestrictions = (ageRestrictions: AgeRestriction[]): string => {
  if (ageRestrictions.length === 0) {
    return 'none';
  }
  return ageRestrictions.map((restriction) => restriction.name).join(', ');
};
