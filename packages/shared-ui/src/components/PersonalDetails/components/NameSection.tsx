import { FC } from 'react';
import TextInput from '../../TextInput';
import { copy } from '../copy';
import Button from '../../Button-V2';
import { ThemeVariant } from '../../../types';
import { zendeskUrl } from '..';
import useMemberId from '../../../hooks/useMemberId';
import useMemberProfileGet from '../../../hooks/useMemberProfileGet';

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
        className={'!justify-start !px-0'}
        href={zendeskUrl}
      >
        {copy.nameSection.buttonText}
      </Button>
    </>
  );
};
