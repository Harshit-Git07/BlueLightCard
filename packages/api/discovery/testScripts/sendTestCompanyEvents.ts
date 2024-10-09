import { Company as SanityCompany } from '@bluelightcard/sanity-types';

import { buildTestSanityCompany } from '@blc-mono/discovery/testScripts/helpers/buildTestSanityCompany';
import { sendTestEvents } from '@blc-mono/discovery/testScripts/helpers/sendTestEvents';

const offers: SanityCompany[] = [buildTestSanityCompany()];

await sendTestEvents({ source: 'company.updated', events: offers });
