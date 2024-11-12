import { FC, useRef, useEffect } from 'react';
import { usePlatformAdapter } from '../../adapters';
import { useSharedUIConfig } from '../../providers';
import AmplitudeEvents from '../../utils/amplitude/events';
import Button from '../Button-V2';
import BrokenOfferSVG from './BrokenOfferSVG';
import Container from '../Container';
import Typography from '../Typography';

type Props = {
  page: string;
  messageText?: string;
  buttonText?: string;
  onButtonClick?(): void;
};

const ErrorState: FC<Props> = ({
  page,
  messageText = 'Oops! Something went wrong.',
  buttonText = 'Please try again',
  onButtonClick = () => window.location.reload(),
}) => {
  const config = useSharedUIConfig();
  const platformAdapter = usePlatformAdapter();
  const viewLogged = useRef<string>('');

  useEffect(() => {
    // only log a view once
    if (viewLogged.current === page) return;

    platformAdapter.logAnalyticsEvent(AmplitudeEvents.ERROR_STATE.VIEWED, {
      brand: config.globalConfig.brand,
      page_with_error: page,
    });
    viewLogged.current = page;
  }, [page]);

  const onCTAClick = () => {
    platformAdapter.logAnalyticsEvent(AmplitudeEvents.ERROR_STATE.CTA_CLICKED, {
      brand: config.globalConfig.brand,
      page_with_error: page,
    });

    onButtonClick();
  };

  return (
    <Container
      aria-live="polite"
      className="py-12 laptop:py-64"
      nestedClassName="w-full h-full flex flex-col flex-grow justify-center items-center gap-4"
    >
      <BrokenOfferSVG />

      <Typography variant="body">{messageText}</Typography>

      <Button size="Large" onClick={onCTAClick}>
        {buttonText}
      </Button>
    </Container>
  );
};

export default ErrorState;
