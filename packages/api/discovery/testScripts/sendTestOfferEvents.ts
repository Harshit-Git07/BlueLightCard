import { Offer as SanityOffer } from '@bluelightcard/sanity-types';

import { buildTestSanityOffer } from '@blc-mono/discovery/testScripts/helpers/buildTestSanityOffer';
import { sendTestEvents } from '@blc-mono/discovery/testScripts/helpers/sendTestEvents';

const offers: SanityOffer[] = [buildTestSanityOffer(), buildTestSanityOffer()];

await sendTestEvents({ source: 'offer.updated', events: offers });
