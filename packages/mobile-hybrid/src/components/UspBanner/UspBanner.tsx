import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPercent } from '@fortawesome/pro-regular-svg-icons';
import { faGem } from '@fortawesome/pro-regular-svg-icons';
import { faHeart } from '@fortawesome/pro-regular-svg-icons';

const USPBanner = () => {
  const [fadeState, setFadeState] = useState('fade-in');

  const texts = [
    {
      uspLabel: 'Big discounts on 17,000+ brands',
      icon: faPercent,
    },
    {
      uspLabel: "Don't miss exclusive brand deals",
      icon: faGem,
    },
    {
      uspLabel: 'Join the savings revolution',
      icon: faHeart,
    },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState('fade-out');
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setFadeState('fade-in');
      }, 1000); //length of time between changing text
    }, 4000); // length of time text shows

    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <div className="bg-colour-primary-light flex justify-center items-center">
      <div className="text-white py-2 flex gap-x-2 flex-row items-center">
        <FontAwesomeIcon
          className={`text-center text-white items-center transition-opacity duration-1000 ease-in-out ${fadeState} w-4 h-4`}
          size="lg"
          icon={texts[currentIndex].icon}
        />
        <p className={`text-center transition-opacity duration-1000 ease-in-out ${fadeState}`}>
          {texts[currentIndex].uspLabel}
        </p>
      </div>
    </div>
  );
};

export default USPBanner;
