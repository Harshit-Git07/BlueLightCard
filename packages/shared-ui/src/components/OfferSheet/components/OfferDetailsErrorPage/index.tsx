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

    platformAdapter.navigate(
      `/offerdetails.php?cid=${offerMeta?.companyId}&oid=${offerMeta?.offerId}`,
    );
  };

  return (
    <div className="text-[#000099] text-center mx-4 space-y-4">
      <Heading headingLevel="h2" className="text-black">
        Error loading offer
      </Heading>
      <p className="text-base">You can still get to your offer by clicking the button below.</p>
      <Button variant={ThemeVariant.Primary} onClick={onButtonClick}>
        {offerMeta?.companyName}
      </Button>
    </div>
  );
};

export default OfferDetailsErrorPage;
