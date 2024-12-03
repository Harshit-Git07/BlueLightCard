import { serviceLayerUrl } from '@/root/src/member-eligibility/shared/constants/ServiceLayerUrl';
import { ServiceLayerOrganisation } from '@/root/src/member-eligibility/shared/types/ServiceLayerOrganisation';

export async function getOrganisationFromServiceLayer(
  organisationId: string
): Promise<ServiceLayerOrganisation | undefined> {
  try {
    const result = await fetch(`${serviceLayerUrl}/orgs/${organisationId}`);
    const body = JSON.parse(await result.text());
    return body as ServiceLayerOrganisation;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
