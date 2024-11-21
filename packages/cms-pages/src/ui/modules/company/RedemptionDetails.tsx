import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Date from '@/ui/Date';

interface GenericCode {
  code: string;
  offerUrl: string;
}

interface BallotProps {
  numberOfWinners: number;
  drawDate: string;
}

const GenericCodeComponent = ({ code, offerUrl }: GenericCode) => (
  <div>
    Use the code <b>{code}</b> and go to the <Link href={offerUrl}>offer.</Link>
  </div>
);

const VaultCodeComponent = () => (
  <div>
    <Button className="bg-green-500 text-lg font-bold p-2 hover:bg-green-600">
      Click here to request a code
    </Button>
  </div>
);

interface PreAppliedProps {
  offerUrl: string;
}

const PreAppliedComponent = ({ offerUrl }: PreAppliedProps) => (
  <div>
    This discount is pre-applied, just go to the <Link href={offerUrl}>offer.</Link>
  </div>
);

const ShowCardComponent = () => <div>Display your Bluelight card in store.</div>;

const DefaultComponent = () => <div>Redemption type not recognized</div>;

const BallotComponent = ({ numberOfWinners, drawDate }: BallotProps) => (
  <div>
    <Button className="bg-green-500 text-lg font-bold p-2 hover:bg-green-600">
      Click here to enter the ballot
    </Button>
    <br />
    There are {numberOfWinners} tickets available and the draw will take place on{' '}
    <Date value={drawDate} />
  </div>
);
interface RedemptionTypeProps {
  redemptionType: {
    offerType: string;
    offerUrl?: string;
    genericCode?: GenericCode;
    numberOfWinners?: number;
    drawDate?: string;
  };
}

export default function RedemptionType({ redemptionType }: RedemptionTypeProps) {
  let redemptionDetailComponent;

  const offerUrl = redemptionType?.offerUrl ?? '';
  const genericCodeDefault: GenericCode = { code: '', offerUrl: '' };
  const genericCode = redemptionType?.genericCode ?? genericCodeDefault;
  const numberOfWinners = redemptionType?.numberOfWinners ?? 10;
  const drawDate = redemptionType?.drawDate ?? '2030-01-31T12:00:00.000Z';
  switch (redemptionType?.offerType) {
    case 'generic-code':
      redemptionDetailComponent = (
        <GenericCodeComponent code={genericCode.code} offerUrl={genericCode.offerUrl} />
      );
      break;
    case 'vault-code':
      redemptionDetailComponent = <VaultCodeComponent />;
      break;
    case 'qr-code':
      redemptionDetailComponent = <VaultCodeComponent />;
      break;
    case 'pre-applied':
      redemptionDetailComponent = <PreAppliedComponent offerUrl={offerUrl} />;
      break;
    case 'show-card':
      redemptionDetailComponent = <ShowCardComponent />;
      break;
    case 'ticket-ballot':
      redemptionDetailComponent = (
        <BallotComponent numberOfWinners={numberOfWinners} drawDate={drawDate} />
      );
      break;
    default:
      redemptionDetailComponent = <DefaultComponent />;
  }
  return <>{redemptionDetailComponent}</>;
}
