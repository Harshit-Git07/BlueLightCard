import { FC } from 'react';
import Button from '../Button-V2';
import BrokenOfferSVG from './BrokenOfferSVG';
import Container from '../Container';
import Typography from '../Typography';

type Props = {
  messageText?: string;
  buttonText?: string;
  onButtonClick?(): void;
};

const ErrorState: FC<Props> = ({
  messageText = 'Oops! Something went wrong.',
  buttonText = 'Please try again',
  onButtonClick = () => window.location.reload(),
}) => {
  return (
    <Container
      aria-live="polite"
      className="py-12 laptop:py-64"
      nestedClassName="w-full h-full flex flex-col flex-grow justify-center items-center gap-4"
    >
      <BrokenOfferSVG />

      <Typography variant="body">{messageText}</Typography>

      <Button size="Large" onClick={onButtonClick}>
        {buttonText}
      </Button>
    </Container>
  );
};

export default ErrorState;
