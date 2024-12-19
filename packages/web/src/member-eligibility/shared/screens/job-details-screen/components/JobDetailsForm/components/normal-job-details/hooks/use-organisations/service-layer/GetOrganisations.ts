import { ServiceLayerOrganisation } from '@/root/src/member-eligibility/shared/types/ServiceLayerOrganisation';
import { serviceLayerUrl } from '@/root/src/member-eligibility/constants/ServiceLayerUrl';

export async function getOrganisations(): Promise<ServiceLayerOrganisation[] | undefined> {
  try {
    // TODO: I would hope that we would just use the platform SDK instead, but for now this is light touch
    const result = await fetch(`${serviceLayerUrl}/orgs`);
    const body = JSON.parse(await result.text());
    return body as ServiceLayerOrganisation[];
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
