'use client';
import { JSX } from 'react';
import BrandLogo from '@brandasset/blclogo-blue.svg';
import { cssUtil } from '@/utils/cssUtil';
import { ThemeColorTokens, ThemeVariant } from '@/types/theme';

export const ClipboardCard = ({
  handleCopy,
  copied,
  error,
  buttonText,
}: {
  handleCopy: () => void;
  error: boolean;
  copied: boolean;
  buttonText: string;
}): JSX.Element => {
  const colorVariants: ThemeColorTokens = {
    [ThemeVariant.Primary]: {
      base: {
        bg: 'bg-[#000099]',
        text: 'text-[#ffffff]',
        hover: 'hover:bg-blue-800 ',
      },
    },
    [ThemeVariant.Secondary]: {
      base: {
        bg: 'bg-[#ffffff]',
        text: 'text-[#000099]',
        hover: 'hover:bg-slate-100',
      },
    },
  };

  const classes = cssUtil([
    copied
      ? `
        focus:outline-none  ${
          colorVariants[ThemeVariant.Secondary].base.hover
        } font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 font-semibold ml-px[7px] w-[343px] border-solid border-[#000099] border-[2px]
        ${colorVariants[ThemeVariant.Secondary].base.bg} ${
          colorVariants[ThemeVariant.Secondary].base.text
        }`
      : `
         focus:outline-none ${
           colorVariants[ThemeVariant.Primary].base.hover
         } font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 font-semibold ml-px[7px] w-[343px]
         ${colorVariants[ThemeVariant.Primary].base.bg} ${
          colorVariants[ThemeVariant.Primary].base.text
        }`,
  ]);

  return (
    <div className={'flex flex-col justify-center items-center max-w-[400px]'}>
      <div className={'flex flex-row justify-center items-center'}>
        <BrandLogo
          className={
            'flex flex-col justify-center text-palette-primary-base dark:text-palette-primary-dark'
          }
        />
      </div>
      <p className={'font-semibold text-[24px] text-center pb-[20px]'}>Your Code is Ready</p>
      <button onClick={handleCopy} className={classes}>
        {buttonText}
      </button>
      {error ? <p className={'text-[#8B0000FF]'}> failed to redirect or get code </p> : null}
      <p className={'text-center text-[#5A5B60] text-[20px] leading-[24px] font-semibold p-[5px]'}>
        you can paste it during checkout
      </p>
    </div>
  );
};
