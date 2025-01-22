import { ServiceLayerEmployer } from '@/root/src/member-eligibility/shared/types/ServiceLayerEmployer';
import { serviceLayerUrl } from '@/root/src/member-eligibility/constants/ServiceLayerUrl';
import { fetchWithAuth } from '@/root/src/member-eligibility/shared/utils/FetchWithAuth';

export async function getEmployerFromServiceLayer(
  organisationId: string,
  employerId: string
): Promise<ServiceLayerEmployer | undefined> {
  try {
    return await fetchWithAuth(`${serviceLayerUrl}/orgs/${organisationId}/employers/${employerId}`);
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
