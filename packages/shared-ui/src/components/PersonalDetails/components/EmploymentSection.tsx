import { FC } from 'react';
import { PersonalDetailsFormState } from '../hooks/usePersonalDetailsState';
import { Dropdown, ThemeVariant } from '../../..';
import { copy } from '../copy';
import Button from '../../Button-V2';
import { zendeskUrl } from '..';
import { DropdownOption, DropdownOptions } from '../../Dropdown/types';
import { useGetEmployers } from '../../../hooks/useGetEmployers';
import useMemberId from '../../../hooks/useMemberId';
import useMemberProfileGet from '../../../hooks/useMemberProfileGet';
import { useGetOrganisation } from '../../../hooks/useGetOrganisation';

type EmploymentSectionProps = {
  divisionId: PersonalDetailsFormState['divisionId'];
  onDivisionChange: (division: DropdownOption) => void;
};
export const EmploymentSection: FC<EmploymentSectionProps> = ({ divisionId, onDivisionChange }) => {
  const memberId = useMemberId();
  const { memberProfile } = useMemberProfileGet(memberId);
  const { data: organisationDetails } = useGetOrganisation(memberProfile?.organisationId);
  const { isLoading: isLoadingEmployerDetails, data: employerDetails } = useGetEmployers(
    memberProfile?.organisationId,
  );

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
          className={'!justify-start !px-0'}
          href={zendeskUrl}
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
