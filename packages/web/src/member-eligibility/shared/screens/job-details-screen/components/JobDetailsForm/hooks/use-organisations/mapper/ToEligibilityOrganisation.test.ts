import * as target from './ToEligibilityOrganisation';
import { EligibilityOrganisation } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { buildTestServiceLayerOrganisation } from '@/root/src/member-eligibility/shared/types/testing/BuildTestServiceLayerOrganisation';

it('should map service layer type to eligibility type', () => {
  const result = target.toEligibilityOrganisation(
    buildTestServiceLayerOrganisation({
      organisationId: '1',
      name: 'name',
    })
  );

  expect(result).toEqual(<EligibilityOrganisation>{
    id: '1',
    label: 'name',
  });
});
