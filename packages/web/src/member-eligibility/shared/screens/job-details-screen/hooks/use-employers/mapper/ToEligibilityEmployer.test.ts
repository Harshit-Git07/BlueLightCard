import * as target from './ToEligibilityEmployer';
import { EligibilityEmployer } from '@/root/src/member-eligibility/shared/screens/job-details-screen/hooks/use-employers/types/EligibilityEmployer';

it('should map service layer type to eligibility type', () => {
  const result = target.toEligibilityEmployer({
    employerId: '1',
    name: 'name',
  });

  expect(result).toEqual(<EligibilityEmployer>{
    id: '1',
    label: 'name',
  });
});
