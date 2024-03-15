import { OfferExclusionsProps } from './types';
import Image from '@/components/Image/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/pro-regular-svg-icons';
import IconListItem from '@/components/IconListItem/IconListItem';

const OfferExclusions: React.FC<OfferExclusionsProps> = ({
  exclusionsArr,
  navigateBack,
  openExclusionsDetails,
  iconSrc,
  text,
}) => {
  return (
    <div
      className={`${
        openExclusionsDetails === true ? 'float-left absolute top-2 bg-white' : 'translate-x-[110%]'
      } flex flex-col text-center text-wrap font-['MuseoSans'] transition-all duration-15000 w-full`}
    >
      <div className="text-left text-neutral-grey-400 cursor-pointer" onClick={navigateBack}>
        <FontAwesomeIcon icon={faChevronLeft} size="lg" />
      </div>
      <Image
        src={iconSrc}
        className="m-[8px_160px]"
        alt="items"
        width={25}
        height={20}
        fill={false}
      ></Image>
      <p className="text-base m-[8px_50px_0px_50px] max-w-[250px]">
        This offer is not valid on the following {text}:
      </p>
      <div className="ml-[31px] mt-6">
        {exclusionsArr.map((index) => {
          return (
            <div key={index} className="flex items-center gap-3 w-full">
              <IconListItem emoji={'🚫'} title={index} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OfferExclusions;
