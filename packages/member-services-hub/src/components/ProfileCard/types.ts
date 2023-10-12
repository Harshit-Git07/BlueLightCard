import { StaticImageData } from 'next/image';

export type ProfileCardProps = {
  user_name: string;
  user_image: string | StaticImageData;
  user_ms_role: string; //the role of the user in the in Member Services Team
  modal_button?: boolean;
  data_pairs: Array<{
    label: string;
    value: string;
  }>;
};

export type EditModalProps = {
  className?: string;
  link?: string;
};
