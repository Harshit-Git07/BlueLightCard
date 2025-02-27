import {
  QueryDslQueryContainer,
  SearchHit,
  SearchRequest,
  SearchResponse,
} from '@opensearch-project/opensearch/api/types';
import {
  MemberDocumentModel,
  MemberDocumentsSearchModel,
} from '@blc-mono/shared/models/members/memberDocument';
import { logger } from '@blc-mono/members/application/utils/logging/Logger';

export function buildOpenSearchRequest(filterParams: MemberDocumentsSearchModel): SearchRequest {
  const pageIndex = filterParams.pageIndex;
  const pageSize = filterParams.pageSize;
  const mustQueries: QueryDslQueryContainer[] = [];

  const filterParamsKeys = (
    Object.keys(filterParams) as (keyof MemberDocumentsSearchModel)[]
  ).filter(
    (key) =>
      key !== 'pageIndex' &&
      key !== 'signupDateStart' &&
      key !== 'signupDateEnd' &&
      key !== 'pageSize',
  );

  filterParamsKeys.forEach((key) => {
    if (filterParams[key]) {
      mustQueries.push({ match: { [key]: filterParams[key] } });
    }
  });

  if (filterParams.signupDateStart || filterParams.signupDateEnd) {
    mustQueries.push({
      range: {
        signupDate: {
          gte: filterParams.signupDateStart,
          lte: filterParams.signupDateEnd,
        },
      },
    });
  }

  const from = pageSize * (pageIndex - 1);

  return {
    body: {
      from,
      size: pageSize,
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
