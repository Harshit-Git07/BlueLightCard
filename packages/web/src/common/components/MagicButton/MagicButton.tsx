import React, { FC } from 'react';
import { MagicButtonProps } from './types';
import { ThemeVariant } from '@/types/theme';

const MagicButton: FC<MagicButtonProps> = ({
  variant = ThemeVariant.Primary,
  animate = false,
  disabled = false,
  clickable = true,
  onClick = undefined,
  className = '',
  transitionDurationMs = 300,
  children,
}) => {
  // This isn't whitelabelled. Designs dont have variables for this to be whitelabelled yet.
  const blcAnimatedBg = 'bg-gradient-to-b from-[#020369] from-25% to-75% to-[#98E5FF]';
  const bodyStyles = {
    primary: {
      animated:
        'text-white bg-gradient-to-b from-blue-700 to-shade-dukeblue-600 hover:opacity-90 transition-opacity duration-200',
      notAnimated:
        'text-white bg-gradient-to-b from-blue-700 to-shade-dukeblue-600 hover:opacity-90 transition-opacity duration-200',
      disabled: 'text-white bg-[#001B80] opacity-30',
    },
    secondary: {
      animated: 'text-[#020369] bg-white',
      notAnimated:
        'text-[#020369] bg-white border-2 border-[#020369] hover:bg-[#020369] hover:text-white transition-colors duration-200',
      disabled: 'text-[#001B80] bg-white border-2 border-[#001B80] opacity-30',
    },
  };

  return (
    <button
      className={`${className} relative text-blue-800 w-fit rounded-full overflow-hidden p-1 w-[21.4375] h-[3.75rem] ${
        disabled ? '' : clickable ? 'cursor-pointer' : 'cursor-default'
      }`}
      disabled={disabled}
      onClick={() => !disabled && onClick && onClick()}
    >
      {!disabled && animate && (
        <div className="absolute z-0 aspect-square min-w-[125%] min-h-[125%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex">
          <div className={`${blcAnimatedBg} h-full w-full animate-spin`}></div>
        </div>
      )}
      <div
        className={`relative py-2 px-4 rounded-full z-10 h-full w-full flex justify-center items-center transition-all font-['MuseoSans'] text-base font-bold leading-6 ${
          bodyStyles[variant][disabled ? 'disabled' : animate ? 'animated' : 'notAnimated']
        } ${disabled ? 'disabled' : animate ? 'animated' : 'notAnimated'}`}
        style={{ transitionDuration: `${transitionDurationMs}ms` }}
      >
        {children}
      </div>
    </button>
  );
};

export default MagicButton;
