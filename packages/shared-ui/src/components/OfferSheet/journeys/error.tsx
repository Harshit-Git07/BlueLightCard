import { Amplitude, usePlatformAdapter } from '../../../../src/adapters';
import Heading from '../../Heading';
import Button from '../../Button';
import { ThemeVariant } from '../../../types';
import amplitudeEvents from '../../../utils/amplitude/events';

type ErrorProps = {
  companyName: string;
  companyId: number;
  offerId: number;
  amplitude?: Amplitude | null;
};

export default function ErrorPage({
  companyName,
  companyId,
  offerId,
  amplitude = undefined,
}: Readonly<ErrorProps>) {
  const platformAdapter = usePlatformAdapter();

  const onButtonClick = () => {
    platformAdapter.logAnalyticsEvent(
      amplitudeEvents.OFFER_VIEWED_ERROR,
      {
        offerId: offerId,
        companyId: companyId,
        companyName: companyName,
      },
      amplitude,
    );
    platformAdapter.navigate(`/offerdetails.php?cid=${companyId}`);
  };

  return (
    <div className="text-colour-onSurface dark:text-colour-onSurface-dark text-center mx-4 space-y-4 h-full">
      <Heading
        headingLevel="h2"
        className="text-colour-onSurface dark:text-colour-onSurface-dark font-typography-title-large font-typography-title-large-weight text-typography-title-large tracking-typography-title-large leading-typography-title-large"
      >
        Sorry, we couldn’t load your offer at the moment.
      </Heading>
      {companyName && (
        <>
          <p className="font-typography-body-light font-typography-body-light-weight text-typography-body-light tracking-typography-body-light leading-typography-body-light">
            Don’t worry, you can access it by clicking the button below.
          </p>
          <Button
            variant={ThemeVariant.Primary}
            onClick={onButtonClick}
            borderless
            data-testid={'_error_sheet_button'}
          >
            {companyName}
          </Button>
        </>
      )}
    </div>
  );
}
