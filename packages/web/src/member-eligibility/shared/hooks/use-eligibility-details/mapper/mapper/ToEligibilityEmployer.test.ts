import * as target from './ToEligibilityEmployer';
import { EligibilityEmployer } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { buildTestServiceLayerEmployer } from '@/root/src/member-eligibility/shared/types/testing/BuildTestServiceLayerEmployer';

it('should map service layer type to eligibility type', () => {
  const result = target.toEligibilityEmployer(buildTestServiceLayerEmployer());

  expect(result).toEqual(<EligibilityEmployer>{
    id: '1',
    label: 'Employer 1',
    requiresJobTitle: true,
    requiresJobReference: false,
  });
});
