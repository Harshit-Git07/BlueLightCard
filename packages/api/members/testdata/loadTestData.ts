import { loadProfiles } from '@blc-mono/members/testdata/loaders/loadProfiles';
import { loadOrganisations } from '@blc-mono/members/testdata/loaders/loadOrganisations';
import { loadEmployers } from '@blc-mono/members/testdata/loaders/loadEmployers';
import { loadCards } from '@blc-mono/members/testdata/loaders/loadCards';
import { loadApplications } from '@blc-mono/members/testdata/loaders/loadApplications';
import { loadPromoCodeMultiUse } from '@blc-mono/members/testdata/loaders/loadPromoCodeMultiUse';
import { loadPromoCodeSingleUse } from '@blc-mono/members/testdata/loaders/loadPromoCodeSingleUse';
import { loadIdRequirements } from '@blc-mono/members/testdata/loaders/loadIdRequirements';

async function loadTestData(): Promise<void> {
  await loadProfiles();
  await loadApplications();
  await loadCards();

  await loadOrganisations();
  await loadEmployers();
  await loadIdRequirements();

  await loadPromoCodeMultiUse();
  await loadPromoCodeSingleUse();
}

loadTestData()
  .then(() => {
    console.log('Seeding all test data completed');
  })
  .catch((error) => {
    console.error('Seeding all test data failed', error);
  });
