import { RichtextModule } from '@bluelightcard/sanity-types';

export const convertStringToRichtextModule = (data: string): RichtextModule => {
  return {
    _type: 'richtext-module',
    content: [
      {
        _type: 'block',
        _key: '1',
        children: [
          {
            _type: 'span',
            _key: '1',
            text: data,
          },
        ],
      },
    ],
  };
};
