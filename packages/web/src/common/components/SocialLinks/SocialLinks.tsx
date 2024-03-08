import Image from '@/components/Image/Image';

const SocialLinks: React.FC = () => {
  return (
    <div className="flex flex-col py-5 items-center rounded-lg bg-[#80ABFF4D] m-[0_auto] mb-5 max-w-[323px]">
      <div className="w-[265px] text-center font-['Museo Sans'] text-blue-900 text-base">
        <span className="font-medium leading-normal">Download the</span>{' '}
        <span className="font-bold leading-tight">Blue Light Card</span>
        <span className="font-medium leading-normal"> app for a better in-store experience.</span>
      </div>
      <div className="flex justify-between mt-4 gap-3">
        <a
          href="https://play.google.com/store/apps/details?id=com.bluelightcard.user&hl=en_GB"
          target="_blank"
          rel="noreferrer noopener"
        >
          <Image
            src="/assets/google-play-badge.png"
            alt="googlePlay"
            width={130}
            height={37}
            fill={false}
          ></Image>
        </a>
        <a
          href="https://itunes.apple.com/gb/app/blue-light-card/id689970073?mt=8"
          target="_blank"
          rel="noreferrer noopener"
        >
          <Image
            src="/assets/app-store-badge.png"
            alt="appleStore"
            width={130}
            height={37}
            fill={false}
          ></Image>
        </a>
      </div>
    </div>
  );
};

export default SocialLinks;
