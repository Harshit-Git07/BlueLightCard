import { ServiceLayerEmployer } from '@/root/src/member-eligibility/shared/types/ServiceLayerEmployer';
import { serviceLayerUrl } from '@/root/src/member-eligibility/constants/ServiceLayerUrl';
import { fetchWithAuth } from '@/root/src/member-eligibility/shared/utils/FetchWithAuth';

export async function getEmployers(
  organisationId: string
): Promise<ServiceLayerEmployer[] | undefined> {
  try {
    const result = await fetchWithAuth(`${serviceLayerUrl}/orgs/${organisationId}/employers`);

    return result as ServiceLayerEmployer[];
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
