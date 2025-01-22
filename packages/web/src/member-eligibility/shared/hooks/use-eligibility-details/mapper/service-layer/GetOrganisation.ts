import { ServiceLayerOrganisation } from '@/root/src/member-eligibility/shared/types/ServiceLayerOrganisation';
import { serviceLayerUrl } from '@/root/src/member-eligibility/constants/ServiceLayerUrl';
import { fetchWithAuth } from '@/root/src/member-eligibility/shared/utils/FetchWithAuth';

export async function getOrganisationFromServiceLayer(
  organisationId: string
): Promise<ServiceLayerOrganisation | undefined> {
  try {
    return await fetchWithAuth(`${serviceLayerUrl}/orgs/${organisationId}`);
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
