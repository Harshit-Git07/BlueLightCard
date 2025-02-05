import { CompanySummary } from '@blc-mono/discovery/application/models/CompaniesResponse';

import { whenCompaniesIsCalledWith } from '../../helpers';

type CompaniesOpenSearchTestInput = {
  companyUUID: string;
  companyID: string;
  companyName: string;
  legacyCompanyID: number;
  testUserToken: string;
};

export function companiesOpenSearchTests({
  companyID,
  companyName,
  companyUUID,
  legacyCompanyID,
  testUserToken,
}: CompaniesOpenSearchTestInput) {
  it('should return all companies as a list', async () => {
    const expectedCompanyResult = {
      companyID,
      companyName,
      legacyCompanyID,
    };

    const result = await whenCompaniesIsCalledWith({ skipCache: 'true' }, { Authorization: `Bearer ${testUserToken}` });

    const resultBody = (await result.json()) as { data: CompanySummary[] };
    const companyResult = resultBody.data.find((company) => company.companyID === companyUUID);
    expect(companyResult).toStrictEqual(expectedCompanyResult);
  });
}
