import { redemptionsTable } from '@blc-mono/redemptions/libs/database/schema';

import { AffiliateConfigurationHelper } from './affiliateConfiguration';
import { isSpotifyUrl } from './isSpotifyUrl';

const vaultUrlHostname = 'thevault.bluelightcard.co.uk';
type NewRedemption = typeof redemptionsTable.$inferInsert;

export function parseRedemptionType(offerUrl: string, offerCode: string): Pick<NewRedemption, 'redemptionType'> {
  /**
   * vaultQR handled when vault created/updated
   */

  if (!offerUrl && !offerCode) {
    //in-store only - no offer URL or code
    return {
      redemptionType: 'showCard',
    };
  }

  const parsedUrl = getParsedUrl(offerUrl);
  if (parsedUrl !== null) {
    if (parsedUrl.hostname === vaultUrlHostname || isSpotifyUrl(offerUrl)) {
      //online or in-store, codes stored DB.vaults/vaultBatches/vaultCodes
      return {
        redemptionType: 'vault',
      };
    }

    if (parsedUrl.hostname !== vaultUrlHostname && offerCode) {
      //online generic offer, code stored in DB.generics
      return {
        redemptionType: 'generic',
      };
    }
  } else {
    if (offerCode) {
      //in-store generic offer, code stored in DB.generics
      return {
        redemptionType: 'generic',
      };
    }
  }

  //online only, discount already applied/EPP
  return {
    redemptionType: 'preApplied',
  };
}

export function parseConnection(offerUrl: string): Pick<NewRedemption, 'connection' | 'affiliate'> {
  if (!offerUrl) {
    return {
      connection: 'none',
    };
  }

  const parsedUrl = getParsedUrl(offerUrl);
  if (parsedUrl !== null) {
    if (parsedUrl.hostname === vaultUrlHostname) {
      return {
        connection: 'none',
      };
    }

    if (isSpotifyUrl(offerUrl)) {
      return {
        connection: 'spotify',
      };
    }

    const affiliateConfig = new AffiliateConfigurationHelper(offerUrl).getConfig();
    if (affiliateConfig !== null) {
      return {
        connection: 'affiliate',
        affiliate: affiliateConfig.affiliate,
      };
    }
  }

  return {
    connection: 'direct',
  };
}

export function parseOfferType(offerType: number, offerUrl: string): Pick<NewRedemption, 'offerType'> {
  /**
   * TODO: delete these comments when is all new stack
   *
   * offerType alone is unreliable to determine if the offer is online or in-store
   * in live we have:
   * online offers (offerType 0) some are POS/show card, example: https://www.bluelightcard.co.uk/offerdetails.php?cid=22907&oid=22511
   * cashback offers (offerType 1) appear to be unused, but are still available to create in admin
   * gift card offers (offerType 2) appear all to be online
   * voucher offers (offerType 3) appear to be unused, but are still available to create in admin
   * own benefit offers (offerType 4) appear to be unused, but are still available to create in admin
   * high street card offers (offerType 5) are not just POS/show card, some are online so can book, example: https://www.bluelightcard.co.uk/offerdetails.php?cid=14600
   * local offers (offerType 6) are not just POS/show card, some are online so can book, example: https://www.bluelightcard.co.uk/offerdetails.php?cid=31316&oid=31900
   *
   * any offer that is a vault has the offerUrl of: https://thevault.bluelightcard.co.uk (can be http://)
   * so logic is this:
   *
   * if the offerUrl will parse as a valid URL, then it is an online offer, unless it is a vault
   *
   * the vault URL will parse as it is a valid URL, so the extra condition is it must be offerType must be less than 4 (this is still fragile)
   * the only way to truly confirm that a vault is an online offer is to assess the link/linkId/promotionId when the vault is created
   * which will then overwrite this value
   *
   * and finally, if the offerUrl will not parse, then it is in-store
   */
  const parsedUrl = getParsedUrl(offerUrl);
  if (parsedUrl !== null) {
    if (parsedUrl.hostname !== vaultUrlHostname || (parsedUrl.hostname === vaultUrlHostname && offerType <= 4)) {
      return {
        offerType: 'online',
      };
    }
  }

  return {
    offerType: 'in-store',
  };
}

export function parseOfferUrl(offerUrl: string): Pick<NewRedemption, 'url'> {
  if (!offerUrl) {
    return {};
  }
  return {
    url: offerUrl,
  };
}

function getParsedUrl(offerUrl: string): URL | null {
  try {
    return new URL(offerUrl);
  } catch {
    return null;
  }
}
