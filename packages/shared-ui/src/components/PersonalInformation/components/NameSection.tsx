import { FC } from 'react';
import { copy } from '../copy';
import Button from '../../Button-V2';
import { ThemeVariant } from '../../../types';
import { zendeskUrl } from '..';
import useMemberId from '../../../hooks/useMemberId';
import useMemberProfileGet from '../../../hooks/useMemberProfileGet';
import TextInput from '../../MyAccountDuplicatedComponents/TextInput';

export const NameSection: FC = () => {
  const memberId = useMemberId();
  const { memberProfile } = useMemberProfileGet(memberId);

  return (
    <>
      <TextInput
        isDisabled
        name="Firstname"
        label={copy.nameSection.firstNameLabel}
        placeholder={memberProfile?.firstName ?? 'First name'}
      />
      <TextInput
        isDisabled
        name="Lastname"
        label={copy.nameSection.lastNameLabel}
        placeholder={memberProfile?.lastName ?? 'Last name'}
      />
      <Button
        variant={ThemeVariant.Tertiary}
        size={'Small'}
        className={'!justify-start !w-fit !px-0'}
        href={zendeskUrl}
        newTab
      >
        {copy.nameSection.buttonText}
      </Button>
    </>
  );
};
