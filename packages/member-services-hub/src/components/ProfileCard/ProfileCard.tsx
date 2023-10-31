import Button from '../Button/Button';
import { ThemeVariant } from '@/app/common/types/theme';
import {
  faArrowUpRightFromSquare,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/pro-regular-svg-icons';
import Image from 'next/image';
import * as React from 'react';
import { EditModalProps, ProfileCardProps } from './types';
import { FC, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cssUtil } from '@/app/common/utils/cssUtil';
import Link from 'next/link';

const ProfileCard: FC<ProfileCardProps> = ({
  user_name,
  user_ms_role,
  user_image,
  modal_button = true,
  data_pairs,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <article className=" w-[566px] min-h-auto p-10 bg-white rounded-lg border border-zinc-200 flex-col justify-start items-start gap-5 inline-flex">
      {modalOpen && <EditModal className=" fixed left-[695px] top-[250px]" />}
      <div className="self-stretch justify-between items-start inline-flex">
        <h1 className="text-shade-greyscale-grey-800 text-2xl font-semibold font-['Museo Sans'] leading-8 tracking-[.24px]">
          Personal Information
        </h1>
        {modal_button && modalOpen ? (
          <Button
            variant={ThemeVariant.Tertiary}
            id="edit_modal_button"
            className="h-9 text-center text-shade-greyscale-grey-500 text-sm font-normal font-['Museo Sans'] leading-[20px] tracking-[.07px] py-2 rounded-[5px] justify-end items-center gap-2.5 flex"
            iconRight={faChevronUp}
            onClick={() => setModalOpen(!modalOpen)}
          >
            Why can&apos;t I edit?
          </Button>
        ) : (
          <Button
            variant={ThemeVariant.Tertiary}
            id="edit_modal_button"
            className="h-9 text-center text-shade-greyscale-grey-500 text-sm font-normal font-['Museo Sans'] leading-5 tracking-[.07px] py-2 rounded-[5px] justify-end items-center gap-2.5 flex"
            iconRight={faChevronDown}
            onClick={() => setModalOpen(!modalOpen)}
          >
            Why can&apos;t I edit?
          </Button>
        )}
      </div>
      <hr className="self-stretch border-[0.5px] border-neutral-200" />
      <div className="justify-start items-center gap-7 inline-flex">
        <Image
          className="rounded-[10px]"
          src={user_image}
          alt="Profile Picture"
          height={106}
          width={106}
        />
        <div className="self-stretch py-2 flex-col justify-center items-start gap-px inline-flex">
          <h2 className="text-shade-greyscale-grey-800 text-base font-semibold font-['Museo Sans'] leading-6 tracking-[.08px]">
            {user_name}
          </h2>
          <h3 className="text-shade-greyscale-grey-500 text-sm font-normal font-['Museo Sans'] leading-4 tracking-[.07px]">
            {user_ms_role}{' '}
          </h3>
        </div>
      </div>
      <div className="self-stretch h-auto flex-col justify-start items-start gap-6 flex">
        {data_pairs?.map((pair) => (
          <div
            id={pair.label + '_data_pair'}
            key={pair.label + '_key'}
            className="self-stretch h-14 flex-col justify-start items-start gap-2 flex"
          >
            <h2 className="text-shade-greyscale-grey-800 text-base font-semibold font-['Museo Sans'] leading-6 tracking-[.08px]">
              {pair.label}
            </h2>
            <p className="self-stretch text-shade-greyscale-grey-600 text-base font-normal font-['Museo Sans'] leading-6 tracking-[.08px]">
              {pair.value}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
};

export default ProfileCard;

const EditModal: FC<EditModalProps> = ({ className, link }) => {
  return (
    <aside
      id="edit_modal"
      className={cssUtil([
        'z-10 w-[212px] h-[156px] py-2.5 bg-white rounded border border-zinc-200 flex-col items-start inline-flex',
        className ?? '',
      ])}
    >
      <div className="px-5 py-2 flex-col justify-center items-start inline-flex">
        <div className="self-stretch">
          <p className="text-neutral-700 text-sm font-normal font-['Museo Sans'] leading-5 tracking-tight">
            Account details are controlled as part of your Microsoft 365 account. If you would like
            to update them please do so from{' '}
          </p>
          <Link
            href={link ?? '/'}
            className="text-background-button-standard-primary-enabled-base text-sm font-normal font-['Museo Sans'] leading-5 tracking-tight"
          >
            here{' '}
            <FontAwesomeIcon
              className="w-2.5 h-2.5 relative bg-black bg-opacity-0"
              icon={faArrowUpRightFromSquare}
            />
          </Link>
        </div>
        <div className="w-2.5 h-2.5 relative bg-black bg-opacity-0" />
      </div>
    </aside>
  );
};
