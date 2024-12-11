import Link from 'next/link';
import { colours, fonts } from '../../../../tailwind/theme';
import Alert from '../../../Alert';
import React from 'react';
import { idVerificationText } from '../../IdVerificationConfig';

const IdVerificationFileUploadInfoBox = () => {
  return (
    <Alert
      title={idVerificationText.docsWillBeDeleted}
      variant={'Inline'}
      state={'Info'}
      isDismissable={false}
    >
      <Link href={'#privacy'} className={`${fonts.labelSemiBold} ${colours.textPrimary}`}>
        Read candidate privacy policy
      </Link>
    </Alert>
  );
};

export default IdVerificationFileUploadInfoBox;
