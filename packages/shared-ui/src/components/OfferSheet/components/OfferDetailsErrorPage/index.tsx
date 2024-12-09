import { useAtomValue } from 'jotai';
import { FC } from 'react';
import Button from '../../../Button';
import Heading from '../../../Heading';
import { offerSheetAtom } from '../../store';
import { ThemeVariant } from '../../../../types';
import amplitudeEvents from '../../../../utils/amplitude/events';
import { usePlatformAdapter } from '../../../../adapters';

const OfferDetailsErrorPage: FC = () => {
  const platformAdapter = usePlatformAdapter();
  const { offerMeta, amplitudeEvent } = useAtomValue(offerSheetAtom);

  const onButtonClick = () => {
    if (amplitudeEvent) {
      amplitudeEvent({
        event: amplitudeEvents.OFFER_VIEWED_ERROR,
        params: {
          offerId: offerMeta?.offerId,
          companyId: offerMeta?.companyId,
          companyName: offerMeta?.companyName,
        },
      });
    }
    platformAdapter.navigate(`/company?cid=${offerMeta?.companyId}`);
  };

  return (
    <div className="text-colour-onSurface dark:text-colour-onSurface-dark text-center mx-4 space-y-4">
      <Heading
        headingLevel="h2"
        className="text-colour-onSurface dark:text-colour-onSurface-dark font-typography-title-large font-typography-title-large-weight text-typography-title-large tracking-typography-title-large leading-typography-title-large"
      >
        Sorry, we couldn’t load your offer at the moment.
      </Heading>
      <p className="font-typography-body-light font-typography-body-light-weight text-typography-body-light tracking-typography-body-light leading-typography-body-light">
        Don’t worry, you can access it by clicking the button below.
      </p>
      <Button variant={ThemeVariant.Primary} onClick={onButtonClick} borderless>
        {offerMeta?.companyName}
      </Button>
    </div>
  );
};

export default OfferDetailsErrorPage;
