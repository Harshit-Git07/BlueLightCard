import { SearchHit, SearchRequest, SearchResponse } from '@opensearch-project/opensearch/api/types';
import {
  MemberDocumentModel,
  MemberDocumentsSearchModel,
} from '@blc-mono/members/application/models/memberDocument';
import { logger } from '@blc-mono/members/application/middleware';

const PAGE_SIZE = 50;

export function buildOpenSearchRequest(filterParams: MemberDocumentsSearchModel): SearchRequest {
  const mustQueries: any[] = [];

  const filterParamsKeys = (
    Object.keys(filterParams) as (keyof MemberDocumentsSearchModel)[]
  ).filter((key) => key !== 'pageIndex' && key !== 'signupDateStart' && key !== 'signupDateEnd');

  filterParamsKeys.forEach((key) => {
    if (filterParams[key]) {
      mustQueries.push({ match: { [key]: filterParams[key] } });
    }
  });

  if (filterParams.signupDateStart || filterParams.signupDateEnd) {
    const rangeQuery: any = { range: { signupDate: {} } };
    if (filterParams.signupDateStart) {
      rangeQuery.range.signupDate.gte = filterParams.signupDateStart;
    }
    if (filterParams.signupDateEnd) {
      rangeQuery.range.signupDate.lte = filterParams.signupDateEnd;
    }
    mustQueries.push(rangeQuery);
  }

  const from = PAGE_SIZE * (filterParams.pageIndex - 1);

  return {
    body: {
      from,
      size: PAGE_SIZE,
      query: {
        bool: {
          must: mustQueries,
        },
      },
    },
  };
}

export function mapOpenSearchResultsToMemberDocuments(
  results: SearchResponse,
): MemberDocumentModel[] {
  if (!results.hits.hits) return [];

  return results.hits.hits
    .map((hit) => {
      const searchHit = hit as SearchHit<MemberDocumentModel>;

      if (!searchHit._source) {
        logger.debug(`No source found in search hit with ID: ${searchHit._id}`);
        return;
      }

      return {
        memberId: searchHit._source.memberId ?? '',
        firstName: searchHit._source.firstName,
        lastName: searchHit._source.lastName,
        email: searchHit._source.email,
        signupDate: searchHit._source.signupDate,
        organisationId: searchHit._source.organisationId,
        organisationName: searchHit._source.organisationName,
        employerId: searchHit._source.employerId,
        employerName: searchHit._source.employerName,
        userStatus: searchHit._source.userStatus,
        applicationId: searchHit._source.applicationId,
        startDate: searchHit._source.startDate,
        eligibilityStatus: searchHit._source.eligibilityStatus,
        paymentStatus: searchHit._source.paymentStatus,
        cardNumber: searchHit._source.cardNumber,
        expiryDate: searchHit._source.expiryDate,
        cardStatus: searchHit._source.cardStatus,
      };
    })
    .filter((item) => item !== undefined);
}
