import { ServiceLayerOrganisation } from '@/root/src/member-eligibility/shared/types/ServiceLayerOrganisation';
import { serviceLayerUrl } from '@/root/src/member-eligibility/shared/constants/ServiceLayerUrl';

export async function getOrganisations(): Promise<ServiceLayerOrganisation[] | undefined> {
  try {
    // TODO: This URL is temporary and will be replaced with the real one once staging etc has been deployed
    // TODO: Also I would hope that we would just use the platform SDK instead, but for now this is light touch
    const result = await fetch(`${serviceLayerUrl}/orgs`);
    const body = JSON.parse(await result.text());
    return body as ServiceLayerOrganisation[];
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
