import Link from 'next/link';
import { colours, fonts } from '../../../../../tailwind/theme';
import Alert from '../../../../Alert';
import { idVerificationText } from '../../IdVerificationConfig';
import { usePlatformAdapter } from '../../../../../adapters';
import { PlatformVariant } from '../../../../../types';
import { BRAND_WEB_URL } from '../../../../../constants';

const IdVerificationFileUploadInfoBox = () => {
  const { platform, navigateExternal } = usePlatformAdapter();
  const isMobile = platform === PlatformVariant.MobileHybrid;

  return (
    <Alert
      title={idVerificationText.docsWillBeDeleted}
      variant={'Inline'}
      state={'Info'}
      isDismissable={false}
    >
      <Link
        href={!isMobile ? '/privacy-notice.php' : ''}
        target={!isMobile ? '_blank' : undefined}
        className={`${fonts.labelSemiBold} ${colours.textPrimary}`}
        onClick={() => {
          if (isMobile) {
            navigateExternal(`https://${BRAND_WEB_URL}/privacy-notice.php`);
          }
        }}
      >
        Read candidate privacy policy
      </Link>
    </Alert>
  );
};

export default IdVerificationFileUploadInfoBox;
