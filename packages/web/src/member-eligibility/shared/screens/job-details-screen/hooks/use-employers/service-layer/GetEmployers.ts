import { ServiceLayerEmployer } from '@/root/src/member-eligibility/shared/screens/job-details-screen/hooks/use-employers/types/ServiceLayerEmployer';

export async function getEmployers(
  organisationId: string
): Promise<ServiceLayerEmployer[] | undefined> {
  try {
    // TODO: This URL is temporary and will be replaced with the real one once staging etc has been deployed
    // TODO: Also I would hope that we would just use the platform SDK instead, but for now this is light touch
    const result = await fetch(
      `https://qqbvufuinh.execute-api.eu-west-2.amazonaws.com/v1/members/orgs/${organisationId}/employers`
    );
    const body = JSON.parse(await result.text());
    return body as ServiceLayerEmployer[];
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
