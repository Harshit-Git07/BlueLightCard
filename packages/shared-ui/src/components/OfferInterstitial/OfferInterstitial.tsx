import Image from '../Image';
import LoadingSpinner from '../LoadingSpinner';

type InterstitialModalProps = {
  isOpen: boolean;
  imageSource: any;
  companyName: string | null;
  offerName: string | null;
};

const InterstitialModal = ({
  isOpen,
  imageSource,
  companyName,
  offerName,
}: InterstitialModalProps) => {
  if (!isOpen) return;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#00000088]">
      <div className="flex flex-col mx-5 bg-white rounded-lg text-center items-center pb-3 overflow-hidden">
        <Image
          src={imageSource || ''}
          alt={`${companyName ?? 'company'} logo`}
          responsive={true}
          className="!relative object-contain object-center shadow-[0_4px_12px_0_rgba(0,0,0,0.15)]"
        />

        <div className="px-4 pt-4 flex flex-col gap-y-3">
          <p className="font-semibold text-2xl pb-1">{offerName}</p>
          <span className="bg-[#000099] text-white py-2 px-4 w-full rounded-md font-sans font-bold text-base">
            Code copied!
          </span>
          <p className="text-colour-primary-light font-semibold text-[13px] pb-3">
            Simply paste your code at checkout to redeem
          </p>
          <p className="font-semibold text-center px-5">
            You are now being
            <br />
            redirected to {companyName}.
          </p>
        </div>
        <LoadingSpinner
          containerClassName={'my-4'}
          spinnerClassName={'w-[33px] h-[33px] text-[#384F9D]'}
        />
      </div>
    </div>
  );
};

export default InterstitialModal;
