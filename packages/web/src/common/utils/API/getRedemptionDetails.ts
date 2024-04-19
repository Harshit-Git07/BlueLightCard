import axios from 'axios';
import { REDEMPTION_DETAILS_ENDPOINT } from '@/global-vars';
import { z } from 'zod';

export async function getRedemptionDetails(
  offerId: number,
  idToken: string
): Promise<string | null> {
  try {
    const response = await axios(`${REDEMPTION_DETAILS_ENDPOINT}?offerId=${offerId}`, {
      headers: { Authorization: `Bearer ${idToken}` },
    });
    const parsedResponse = z
      .object({
        data: z.object({
          redemptionType: z.enum(['generic', 'vault', 'vaultQR', 'showCard', 'preApplied']),
        }),
      })
      .parse(response.data);

    const redemptionType = parsedResponse.data.redemptionType;

    return redemptionType;
  } catch (error) {
    console.error('Error fetching redemption details:', error);
    return null;
  }
}
