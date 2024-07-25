import React, { FC } from 'react';
import { ModalProps, ModalTypes } from './Types';
import Button from '../Button/Button';
import { ThemeVariant } from '@/types/theme';

const Modal: FC<ModalProps> = ({ id, isVisible, type, onClose, onConfirm }) => {
  //return nothing when state variable set to false
  if (!isVisible) return null;

  //different types of modal could be implemented here in the future
  if (type == ModalTypes.QuitEligibility) {
    return (
      <article
        id={id}
        className="z-50 fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex flex-col justify-center items-center"
      >
        <div className="tablet:w-[736px] tablet:h-[307px] tablet:px-7 mobile:px-4 tablet:pt-7 mobile:pt-11 tablet:pb-[28px] mobile:pb-7 tablet:gap-7 mobile:gap-7 bg-white shadow inline-flex m-2 mobile:rounded-md tablet:rounded-none">
          <div className="w-full">
            <h1 className="text-secondary tablet:text-[32px] mobile:text-2xl font-semibold tablet:text-left mobile:text-center">
              Are you sure you want to quit?
            </h1>
            <p className="tablet:pt-[24px] mobile:pt-3 text-lg tablet:text-left font-normal mobile:text-center">
              Your progress is not saved and will be lost. Checking your eligibility will allow you
              to apply and start saving with your favourite brands in a few easy steps.
            </p>
            <div className="flex justify-end gap-2 tablet:mt-[11%] mobile:mt-[32px] mobile:flex-col-reverse tablet:flex-row">
              <Button
                id="modal_quit_button"
                variant={ThemeVariant.Tertiary}
                onClick={() => onClose()}
              >
                Quit
              </Button>
              <Button
                id="continue_button"
                variant={ThemeVariant.Primary}
                onClick={() => onConfirm()}
              >
                Back to checker
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
