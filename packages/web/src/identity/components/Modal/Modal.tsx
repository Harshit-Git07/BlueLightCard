import React, { FC } from 'react';
import { ModalProps, ModalTypes } from './Types';
import Button from '../Button/Button';
import { ThemeVariant } from '@/types/theme';
import Image from '@/components/Image/Image';

const Modal: FC<ModalProps> = ({ isVisible, type, onClose, onConfirm }) => {
  //return nothing when state variable set to false
  if (!isVisible) return null;

  //different types of modal could be implemented here in the future
  if (type == ModalTypes.QuitEligibility) {
    return (
      <article className="z-50 fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex flex-col justify-center items-center">
        <div className="w-[774px] h-[538px] px-12 py-[52px] bg-white shadow  gap-7 inline-flex">
          <div className="w-[50%] pe-[44px]">
            <Image
              src="/phone.png"
              alt="Image of a smartphone"
              aria-label="Phone displaying logos of various brands"
              responsive={false}
              width={350}
              height={485}
            />
          </div>
          <div className="w-[50%]">
            <div className="text-secondary text-4xl font-semibold">
              Are you sure you want to quit?
            </div>
            <div className="pt-[24px] text-lg">
              Check if you&apos;ll be accepted for a Blue Light card before you apply and start
              saving with your favourite brands today.
              <p className="font-semibold">Just two easy steps. That&apos;s it. Nice and simple.</p>
            </div>
            <div className="flex justify-end gap-2 mt-[46%]">
              <Button
                id="quit_button"
                variant={ThemeVariant.Tertiary}
                className="px-6 py-2 text-lg font-semibold"
                onClick={() => onClose()}
              >
                Quit
              </Button>
              <Button
                id="continue_button"
                variant={ThemeVariant.Primary}
                className="px-[40px] py-3.5 text-lg font-semibold"
                onClick={() => onConfirm()}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </article>
    );
  } else {
    return null;
  }
};
export default Modal;
