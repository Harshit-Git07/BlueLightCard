import { Organisation } from '../../../../../api/types';
import { useGetOrganisation } from '../../../../../hooks/useGetOrganisation';

const getRequirements = (organisation: Organisation | null, employmentStatus: string) => {
  if (!organisation) return;
  if (employmentStatus === 'EMPLOYED') return organisation.employedIdRequirements;
  if (employmentStatus === 'RETIRED') return organisation.retiredIdRequirements;
  if (employmentStatus === 'VOLUNTEER') return organisation.volunteerIdRequirements;
};

const useSupportedDocs = (organisationId: string, employmentStatus: string) => {
  const { data: organisation } = useGetOrganisation(organisationId);
  const idRequirements = getRequirements(organisation ?? null, employmentStatus);
  const documents = idRequirements?.supportedDocuments ?? [];

  const mandatory = documents.find((doc) => doc.required);
  const supportingDocs = documents.filter((doc) => !doc.required);

  return {
    isDoubleId: Boolean(idRequirements && idRequirements?.minimumRequired > 1 && mandatory),
    mandatory,
    supportingDocs,
    documents,
  };
};

export default useSupportedDocs;
