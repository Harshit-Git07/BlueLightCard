import { serviceLayerUrl } from '@/root/src/member-eligibility/shared/constants/ServiceLayerUrl';
import { ServiceLayerEmployer } from '@/root/src/member-eligibility/shared/types/ServiceLayerEmployer';

export async function getEmployerFromServiceLayer(
  organisationId: string,
  employerId: string
): Promise<ServiceLayerEmployer | undefined> {
  try {
    const result = await fetch(`${serviceLayerUrl}/orgs/${organisationId}/employers/${employerId}`);
    const body = JSON.parse(await result.text());
    return body as ServiceLayerEmployer;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
