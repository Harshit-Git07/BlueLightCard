import { FC } from 'react';
import { copy } from '../copy';
import Button from '../../Button-V2';
import { PlatformVariant, ThemeVariant } from '../../../types';
import useMemberProfileGet from '../../../hooks/useMemberProfileGet';
import TextInput from '../../MyAccountDuplicatedComponents/TextInput';
import { getBrandedSupportLink } from '../../../utils/getBrandedSupportLink';
import { usePlatformAdapter } from '../../../adapters';

export const NameSection: FC = () => {
  const { memberProfile } = useMemberProfileGet();

  const { platform, navigate } = usePlatformAdapter();
  const zendeskUrl = getBrandedSupportLink();

  const isMobile = platform === PlatformVariant.MobileHybrid;

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
        href={!isMobile ? zendeskUrl : ''}
        onClick={() => {
          if (isMobile) {
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
