import { companyFactory } from '@blc-mono/discovery/application/factories/CompanyFactory';
import { offerFactory } from '@blc-mono/discovery/application/factories/OfferFactory';
import { Offer } from '@blc-mono/discovery/application/models/Offer';
import {
  getCompanyById,
  insertCompany,
} from '@blc-mono/discovery/application/repositories/Company/service/CompanyService';
import { updateOfferInMenus } from '@blc-mono/discovery/application/repositories/Menu/service/MenuService';
import {
  getOffersByCompany,
  insertOffers,
} from '@blc-mono/discovery/application/repositories/Offer/service/OfferService';

import * as target from './CompanyEventHandler';
import { handleCompanyLocationsUpdateToCompanies } from './handleCompanyLocationsUpdateToCompanies';

jest.mock('@blc-mono/discovery/application/repositories/Offer/service/OfferService');
jest.mock('@blc-mono/discovery/application/repositories/Company/service/CompanyService');
jest.mock('@blc-mono/discovery/application/repositories/Menu/service/MenuService');
jest.mock('@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/CompanyLocationEventHandler');
jest.mock('@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/handleCompanyLocationsUpdateToCompanies');

const insertOffersMock = jest.mocked(insertOffers);
const insertCompanyMock = jest.mocked(insertCompany);
const getCompanyByIdMock = jest.mocked(getCompanyById);
const getOffersByCompanyMock = jest.mocked(getOffersByCompany);
const updateOfferInMenusMock = jest.mocked(updateOfferInMenus);
const handleCompanyLocationsUpdateToCompaniesMock = jest.mocked(handleCompanyLocationsUpdateToCompanies);

describe('CompanyEventHandler', () => {
  describe('handleCompanyUpdated', () => {
    beforeEach(() => {
      getOffersByCompanyMock.mockResolvedValue([]);
    });

    describe('no current company record and record is updated within company locations update', () => {
      it('should not insert new company record', async () => {
        handleCompanyLocationsUpdateToCompaniesMock.mockResolvedValue({ companyRecordUpdated: true });
        const newCompanyRecord = companyFactory.build();

        await target.handleCompanyUpdated(newCompanyRecord);
        expect(insertCompanyMock).not.toHaveBeenCalledWith();
      });

      describe('and record is not updated within company locations update', () => {
        it('should insert new company record and update no current offer records', async () => {
          handleCompanyLocationsUpdateToCompaniesMock.mockResolvedValue({ companyRecordUpdated: false });
          const newCompanyRecord = companyFactory.build();

          await target.handleCompanyUpdated(newCompanyRecord);

          expect(insertCompanyMock).toHaveBeenCalledWith(newCompanyRecord);
          expect(insertOffersMock).not.toHaveBeenCalled();
          expect(updateOfferInMenusMock).not.toHaveBeenCalled();
        });
      });
    });

    describe('and current company record exists', () => {
      const currentCompanyRecord = companyFactory.build({
        updatedAt: new Date(2022, 1, 1).toISOString(),
      });

      beforeEach(() => {
        getCompanyByIdMock.mockResolvedValue(currentCompanyRecord);
        handleCompanyLocationsUpdateToCompaniesMock.mockResolvedValue({ companyRecordUpdated: false });
      });

      it('should update company record if update record is newer version', async () => {
        const updateCompanyRecord = companyFactory.build({
          updatedAt: new Date(2022, 1, 2).toISOString(),
        });

        await target.handleCompanyUpdated(updateCompanyRecord);

        expect(insertCompanyMock).toHaveBeenCalledWith(updateCompanyRecord);
      });

      it('should not update company record if update record is not newer version', async () => {
        const updateCompanyRecord = companyFactory.build({
          updatedAt: new Date(2021, 12, 30).toISOString(),
        });

        await target.handleCompanyUpdated(updateCompanyRecord);

        expect(insertCompanyMock).not.toHaveBeenCalledWith(updateCompanyRecord);
      });

      describe('and offer records returned for company', () => {
        const offer = offerFactory.build({
          company: companyFactory.build({
            updatedAt: new Date(2021, 1, 1).toISOString(),
          }),
        });

        beforeEach(() => {
          getOffersByCompanyMock.mockResolvedValue([offer]);
        });

        it('should update offer records if company record is newer version', async () => {
          const updateCompanyRecord = companyFactory.build({
            updatedAt: new Date(2022, 1, 2).toISOString(),
          });
          const updateOfferRecord: Offer = {
            ...offer,
            company: updateCompanyRecord,
          };

          await target.handleCompanyUpdated(updateCompanyRecord);

          expect(insertOffersMock).toHaveBeenCalledWith([updateOfferRecord]);
          expect(updateOfferInMenusMock).toHaveBeenCalledWith(updateOfferRecord);
        });
      });
    });
  });
});
