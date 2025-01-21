import { FC } from 'react';
import { PersonalInfoFormState } from '../hooks/usePersonalInfoState';
import { getBrandedSupportLink, ThemeVariant, usePlatformAdapter } from '../../..';
import { copy } from '../copy';
import Button from '../../Button-V2';
import { useGetEmployers } from '../../../hooks/useGetEmployers';
import useMemberId from '../../../hooks/useMemberId';
import useMemberProfileGet from '../../../hooks/useMemberProfileGet';
import { useGetOrganisation } from '../../../hooks/useGetOrganisation';
import Dropdown from '../../MyAccountDuplicatedComponents/Dropdown';
import {
  DropdownOption,
  DropdownOptions,
} from '../../MyAccountDuplicatedComponents/Dropdown/types';

type EmploymentSectionProps = {
  divisionId: PersonalInfoFormState['divisionId'];
  onDivisionChange: (division: DropdownOption) => void;
};
export const EmploymentSection: FC<EmploymentSectionProps> = ({ divisionId, onDivisionChange }) => {
  const memberId = useMemberId();
  const { memberProfile } = useMemberProfileGet(memberId);
  const { data: organisationDetails } = useGetOrganisation(memberProfile?.organisationId);
  const { isLoading: isLoadingEmployerDetails, data: employerDetails } = useGetEmployers(
    memberProfile?.organisationId,
  );

  const { platform, navigate } = usePlatformAdapter();
  const zendeskUrl = getBrandedSupportLink();

  const divisionOptions: DropdownOptions =
    employerDetails && employerDetails?.length > 0
      ? employerDetails.map((employer) => ({ id: employer.employerId, label: employer.name }))
      : [];

  return (
    <>
      <div className="flex flex-col gap-2">
        <Dropdown
          options={[]}
          onChange={() => {}}
          isDisabled
          placeholder={organisationDetails?.name ?? copy.service.label}
          label={copy.service.label}
        />
        <Button
          variant={ThemeVariant.Tertiary}
          size={'Small'}
          className={'!justify-start w-fit !px-0'}
          href={platform !== 'mobile-hybrid' ? zendeskUrl : ''}
          onClick={() => {
            if (platform === 'mobile-hybrid') {
              navigate('/chat');
            }
          }}
          newTab
        >
          {copy.service.buttonText}
        </Button>
      </div>
      <Dropdown
        options={divisionOptions}
        value={divisionOptions.find((option) => option.id === divisionId.value)}
        onChange={onDivisionChange}
        isDisabled={isLoadingEmployerDetails || divisionId.disabled}
        placeholder={copy.division.placeholder}
        label={copy.division.label}
      />
    </>
  );
};
