import { FC } from 'react';
import { copy } from '../copy';
import Button from '../../Button-V2';
import { ThemeVariant } from '../../../types';
import useMemberId from '../../../hooks/useMemberId';
import useMemberProfileGet from '../../../hooks/useMemberProfileGet';
import TextInput from '../../MyAccountDuplicatedComponents/TextInput';
import { getBrandedSupportLink } from '../../../utils/getBrandedSupportLink';
import { usePlatformAdapter } from '../../../adapters';

export const NameSection: FC = () => {
  const memberId = useMemberId();
  const { memberProfile } = useMemberProfileGet(memberId);

  const { platform, navigate } = usePlatformAdapter();
  const zendeskUrl = getBrandedSupportLink();
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
        href={platform !== 'mobile-hybrid' ? zendeskUrl : ''}
        onClick={() => {
          if (platform === 'mobile-hybrid') {
            navigate('/chat');
          }
        }}
        newTab
      >
        {copy.nameSection.buttonText}
      </Button>
    </>
  );
};
