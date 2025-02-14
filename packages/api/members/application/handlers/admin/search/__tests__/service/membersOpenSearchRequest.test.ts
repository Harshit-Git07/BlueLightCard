import { MemberDocumentsSearchModel } from '@blc-mono/shared/models/members/memberDocument';
import { EligibilityStatus } from '@blc-mono/shared/models/members/enums/EligibilityStatus';
import { PaymentStatus } from '@blc-mono/shared/models/members/enums/PaymentStatus';
import {
  buildOpenSearchRequest,
  mapOpenSearchResultsToMemberDocuments,
} from '../../service/membersOpenSearchRequest';
import { CardStatus } from '@blc-mono/shared/models/members/enums/CardStatus';
import { SearchResponse } from '@opensearch-project/opensearch/api/types';

describe('Member Document Search', () => {
  describe('build OpenSearch request', () => {
    it('should build search request with all filter params', () => {
      const filterParams: MemberDocumentsSearchModel = {
        pageIndex: 1,
        pageSize: 50,
        memberId: 'memberId',
        organisationId: 'organisationId',
        employerId: 'employerId',
        applicationId: 'applicationId',
        userStatus: 'userStatus',
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'email',
        cardNumber: 'cardNumber',
        signupDateStart: 'signupDateStart',
        signupDateEnd: 'signupDateEnd',
        eligibilityStatus: EligibilityStatus.ELIGIBLE,
        paymentStatus: PaymentStatus.AWAITING_PAYMENT,
        cardStatus: CardStatus.CARD_EXPIRED,
      };

      const result = buildOpenSearchRequest(filterParams);

      expect(result).toEqual({
        body: {
          from: 0,
          size: 50,
          query: {
            bool: {
              must: [
                { match: { memberId: 'memberId' } },
                { match: { organisationId: 'organisationId' } },
                { match: { employerId: 'employerId' } },
                { match: { applicationId: 'applicationId' } },
                { match: { userStatus: 'userStatus' } },
                { match: { firstName: 'firstName' } },
                { match: { lastName: 'lastName' } },
                { match: { email: 'email' } },
                { match: { cardNumber: 'cardNumber' } },
                { match: { eligibilityStatus: 'ELIGIBLE' } },
                { match: { paymentStatus: 'AWAITING_PAYMENT' } },
                { match: { cardStatus: 'CARD_EXPIRED' } },
                {
                  range: {
                    signupDate: {
                      gte: 'signupDateStart',
                      lte: 'signupDateEnd',
                    },
                  },
                },
              ],
            },
          },
        },
      });
    });

    it('should not include must queries for empty filter params', () => {
      const filterParams: MemberDocumentsSearchModel = {
        pageIndex: 1,
        pageSize: 50,
        firstName: 'firstName',
      };

      const result = buildOpenSearchRequest(filterParams);

      expect(result).toEqual({
        body: {
          from: 0,
          size: 50,
          query: {
            bool: {
              must: [{ match: { firstName: 'firstName' } }],
            },
          },
        },
      });
    });

    it('should build search request with only signupDateStart when signupDateEnd undefined', () => {
      const filterParams: MemberDocumentsSearchModel = {
        pageIndex: 1,
        pageSize: 50,
        signupDateStart: 'signupDateStart',
      };

      const result = buildOpenSearchRequest(filterParams);

      expect(result).toEqual({
        body: {
          from: 0,
          size: 50,
          query: {
            bool: {
              must: [
                {
                  range: {
                    signupDate: {
                      gte: 'signupDateStart',
                    },
                  },
                },
              ],
            },
          },
        },
      });
    });

    it('should build search request with only signupDateEnd when signupDateStart undefined', () => {
      const filterParams: MemberDocumentsSearchModel = {
        pageIndex: 1,
        pageSize: 50,
        signupDateEnd: 'signupDateEnd',
      };

      const result = buildOpenSearchRequest(filterParams);

      expect(result).toEqual({
        body: {
          from: 0,
          size: 50,
          query: {
            bool: {
              must: [
                {
                  range: {
                    signupDate: {
                      lte: 'signupDateEnd',
                    },
                  },
                },
              ],
            },
          },
        },
      });
    });

    it('should determine page size from "pageIndex"', () => {
      const filterParams: MemberDocumentsSearchModel = {
        pageIndex: 2,
        pageSize: 50,
      };

      const result = buildOpenSearchRequest(filterParams);

      expect(result).toEqual({
        body: {
          from: 50,
          size: 50,
          query: {
            bool: {
              must: [],
            },
          },
        },
      });
    });
  });

  describe('mapOpenSearchResultsToMemberDocuments', () => {
    it('should map search results to member documents', () => {
      const results = {
        hits: {
          hits: [
            {
              _source: {
                memberId: 'memberId',
                firstName: 'firstName',
                lastName: 'lastName',
                email: 'email',
                signupDate: 'signupDate',
                organisationId: 'organisationId',
                organisationName: 'organisationName',
                employerId: 'employerId',
                employerName: 'employerName',
                userStatus: 'userStatus',
                applicationId: 'applicationId',
                startDate: 'startDate',
                eligibilityStatus: EligibilityStatus.ELIGIBLE,
                paymentStatus: PaymentStatus.AWAITING_PAYMENT,
                cardNumber: 'cardNumber',
                expiryDate: 'expiryDate',
                cardStatus: CardStatus.CARD_EXPIRED,
              },
            },
          ],
        },
      } as SearchResponse;

      const result = mapOpenSearchResultsToMemberDocuments(results);

      expect(result).toEqual([
        {
          memberId: 'memberId',
          firstName: 'firstName',
          lastName: 'lastName',
          email: 'email',
          signupDate: 'signupDate',
          organisationId: 'organisationId',
          organisationName: 'organisationName',
          employerId: 'employerId',
          employerName: 'employerName',
          userStatus: 'userStatus',
          applicationId: 'applicationId',
          startDate: 'startDate',
          eligibilityStatus: 'ELIGIBLE',
          paymentStatus: 'AWAITING_PAYMENT',
          cardNumber: 'cardNumber',
          cardStatus: 'CARD_EXPIRED',
          expiryDate: 'expiryDate',
        },
      ]);
    });

    it('should not map search results with no source', () => {
      const results = {
        hits: {
          hits: [
            {
              _id: 'memberId',
            },
          ],
        },
      } as SearchResponse;

      const result = mapOpenSearchResultsToMemberDocuments(results);

      expect(result).toEqual([]);
    });
  });
});
