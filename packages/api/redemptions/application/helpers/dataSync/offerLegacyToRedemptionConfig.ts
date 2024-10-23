/**
 * the functions in this file convert legacy values to new redemption config values
 * it is highly likely that this file and the functions within it will become
 * redundant when the legacy system is deprecated, so will eventually be removed
 *
 * NOTE: there are some edge case offers in legacy that will not correctly meet the assessment criteria in these functions
 * these will be handled on a case by case basis by partnerships to correct the data in the legacy DB through admin
 * which will trigger the offer update event bridge and update the new stack redemption config
 */

import { redemptionsTable } from '@blc-mono/redemptions/libs/database/schema';

import { AffiliateConfigurationHelper } from '../affiliate/AffiliateConfiguration';
import { isSpotifyUrl } from '../isSpotifyUrl';

/**
 * vaultUrlHostname is used in legacy as an identifier
 * the value is stored in tblalloffers.OfferURL as either:
 * BLC_UK
 * http://thevault.bluelightcard.co.uk
 * https://thevault.bluelightcard.co.uk
 *
 * BLC_AU
 * http://thevault.bluelightcard.com.au
 * https://thevault.bluelightcard.com.au
 *
 * DDS_UK
 * http://thevault.defencediscountservice.co.uk
 * https://thevault.defencediscountservice.co.uk
 *
 * the vault URL identifier will not render in the browser window
 * the URL associated to a vault that will render in a browser window (vault link)
 * is stored in tblpromotions.link in legacy
 */
const vaultUrlHostnames = [
  'thevault.bluelightcard.co.uk',
  'thevault.bluelightcard.com.au',
  'thevault.defencediscountservice.co.uk',
];

type NewRedemption = typeof redemptionsTable.$inferInsert;

/**
 * uses legacy tblalloffers.OfferURL and tblalloffers.OfferCode to determine new stack redemptions.redemptionType
 * if offerURL VALID AND it is a vaultUrlHostname identifier OR spotify URL, then is 'vault'
 * if offerURL VALID AND it is NOT vaultUrlHostname identifier AND NOT spotify URL AND offerCode exists, then is 'generic'
 * if offerURL VALID AND it is NOT vaultUrlHostname identifier AND NOT spotify URL AND NO offerCode, then is 'preApplied'
 * if there is NO offerURL AND offerCode EXIST, then is 'generic'
 * if there is NO offerURL AND NO offerCode, then is 'showCard'
 *
 * @param offerUrl
 * @param offerCode
 */
export function parseRedemptionType(
  offerUrl: string | null,
  offerCode: string | null,
): Pick<NewRedemption, 'redemptionType'> {
  /**
   * vaultQR handled when vault created/updated
   */
  if (offerUrl) {
    const parsedUrl = getParsedUrl(offerUrl);
    if (parsedUrl !== null) {
      if (vaultUrlHostnames.includes(parsedUrl.hostname) || isSpotifyUrl(offerUrl)) {
        //online or in-store, codes stored DB.vaults/vaultBatches/vaultCodes
        return {
          redemptionType: 'vault',
        };
      }

      if (offerCode) {
        //online generic offer, code stored in DB.generics
        return {
          redemptionType: 'generic',
        };
      }

      //online only, discount already applied/EPP
      return {
        redemptionType: 'preApplied',
      };
    }
  }

  //handle offers without a URL
  if (offerCode) {
    //in-store generic offer, code stored in DB.generics
    return {
      redemptionType: 'generic',
    };
  }

  return {
    redemptionType: 'showCard',
  };
}

/**
 * uses legacy tblalloffers.OfferURL to determine new stack redemptions.connection
 * if offerURL VALID AND it is a vaultUrlHostname identifier, then is 'none'
 * if offerURL VALID AND it is a spotify URL, then is 'spotify'
 * if offerURL VALID AND it is an affiliate URL, then is 'affiliate' AND redemptions.affiliate is '[affiliate name]'
 * if offerURL VALID AND is NOT vaultUrlHostname identifier AND NOT spotify URL AND NOT affiliate URL, then is 'direct'
 * if there is NO offerURL OR offerURL is NOT VALID, then is 'none'
 *
 * @param offerUrl
 */
export function parseConnection(offerUrl: string | null): Pick<NewRedemption, 'connection'> {
  if (offerUrl) {
    const parsedUrl = getParsedUrl(offerUrl);
    if (parsedUrl !== null) {
      if (vaultUrlHostnames.includes(parsedUrl.hostname)) {
        return {
          connection: 'none',
        };
      }

      if (isSpotifyUrl(offerUrl)) {
        return {
          connection: 'spotify',
        };
      }

      const affiliateConfig = offerUrl && new AffiliateConfigurationHelper(offerUrl).getConfig();
      if (affiliateConfig !== null) {
        return {
          connection: 'affiliate',
        };
      }

      return {
        connection: 'direct',
      };
    }
  }

  return {
    connection: 'none',
  };
}

export function parseAffiliate(offerUrl: string | null): Pick<NewRedemption, 'affiliate'> {
  if (offerUrl) {
    const parsedUrl = getParsedUrl(offerUrl);
    if (parsedUrl !== null) {
      const affiliateConfig = new AffiliateConfigurationHelper(offerUrl).getConfig();
      if (affiliateConfig !== null) {
        return {
          affiliate: affiliateConfig.affiliate,
        };
      }
    }
  }
  return {
    affiliate: null,
  };
}

/**
 * uses legacy tblalloffers.OfferType to determine new stack redemptions.offerType
 * if offerType <= 4, then is 'online', else is 'in-store'
 *
 * this will have edge cases in legacy that will require partnerships to sort. legacy values as follows:
 * online offers (offerType 0) EDGE CASE: some are POS/show card
 * cashback offers (offerType 1) appear to be unused, but are still available to create in admin
 * gift card offers (offerType 2) appear all to be online
 * voucher offers (offerType 3) appear to be unused, but are still available to create in admin
 * own benefit offers (offerType 4) appear to be unused, but are still available to create in admin
 * high street card offers (offerType 5) EDGE CASE: some are online so can book or info for user
 * local offers (offerType 6) EDGE CASE: some are online so can book or info for user
 *
 * @param offerType
 */
export function parseOfferType(offerType: number): Pick<NewRedemption, 'offerType'> {
  if (offerType <= 4) {
    return {
      offerType: 'online',
    };
  }

  return {
    offerType: 'in-store',
  };
}

/**
 * uses legacy tblalloffers.OfferURL to determine new stack redemptions.url
 * if offerURL VALID, then is '[offerURL]', else null
 *
 * @param offerUrl
 */
export function parseOfferUrl(offerUrl: string | null): Pick<NewRedemption, 'url'> {
  if (offerUrl) {
    const parsedUrl = getParsedUrl(offerUrl);
    if (parsedUrl !== null) {
      return {
        url: offerUrl,
      };
    }
  }
  return {
    url: null,
  };
}

function getParsedUrl(offerUrl: string | null): URL | null {
  try {
    return offerUrl ? new URL(offerUrl) : null;
  } catch {
    return null;
  }
}
