import { ServiceLayerOrganisation } from '@/root/src/member-eligibility/shared/types/ServiceLayerOrganisation';
import { serviceLayerUrl } from '@/root/src/member-eligibility/constants/ServiceLayerUrl';
import { fetchWithAuth } from '@/root/src/member-eligibility/shared/utils/FetchWithAuth';

export async function getOrganisations(): Promise<ServiceLayerOrganisation[] | undefined> {
  try {
    return await fetchWithAuth(`${serviceLayerUrl}/orgs`);
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
