import { Meta, StoryFn } from '@storybook/react';
import Toaster from './index';
import Toast from '../index';
import Button from '../../Button/index';
import { MouseEventHandler, ReactNode, useEffect, useRef, useState } from 'react';
import { faBee, faPlus, faTrash, faHeart, faAngry } from '@fortawesome/pro-regular-svg-icons';
import Typography from '../../Typography';
import useToaster from './useToaster';
import { ThemeVariant } from '../../../types';
import { ToastPosition, ToastStatus } from '../ToastTypes';

const lorem =
  'Lorem ipsum dolor sit amet consectetur. Ut condimentum aliquet quis odio erat in nec.';

const componentMeta: Meta<typeof Toaster> = {
  title: 'Component System/Toast/Toaster',
  component: Toaster,
  argTypes: {
    position: {
      options: Object.values(ToastPosition),
      control: {
        type: 'radio',
      },
    },
    pauseOnHover: {
      control: {
        type: 'boolean',
      },
    },
    duration: {
      options: [0, 1000, 2500, 5000, 7500, 10000],
      control: {
        type: 'radio',
      },
    },
  },
};

export default componentMeta;

interface ToasterStoryProps {
  position: ToastPosition;
  pauseOnHover: boolean;
  duration: number;
}

export const ToasterExample: StoryFn<ToasterStoryProps> = (args) => {
  const { position, pauseOnHover, duration } = args;
  const { openToast, timer } = useToaster();
  const [countDown, setCountDown] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | undefined>();

  useEffect(() => {
    clearInterval(intervalRef.current);
    if (!timer) {
      setCountDown(0);
      return;
    }

    intervalRef.current = setInterval(() => {
      const r = timer.getRemaining();
      setCountDown(Math.max(0, r / 1000));
    }, 250);
    return () => clearInterval(intervalRef.current);
  }, [timer]);

  const defaultToast = <Toast text={'Default toast'} status={ToastStatus.Default}></Toast>;

  const goodToast = (
    <Toast
      title={'Good toast'}
      text={'This is very good crispy toast'}
      status={ToastStatus.Success}
      pauseOnHover={pauseOnHover}
    >
      <Button variant={ThemeVariant.Tertiary} iconLeft={faPlus} slim>
        Butter
      </Button>
      <Button variant={ThemeVariant.Tertiary} iconLeft={faBee} slim>
        Honey
      </Button>
    </Toast>
  );

  const plainToast = (
    <Toast
      title={'Plain toast'}
      text={'Just plain dry toast no button options'}
      status={ToastStatus.Info}
      pauseOnHover={pauseOnHover}
    ></Toast>
  );

  const warningToast = (
    <Toast
      title={'Warning toast has Marmite'}
      text={lorem}
      status={ToastStatus.Warning}
      pauseOnHover={pauseOnHover}
    >
      <Button variant={ThemeVariant.Tertiary} iconLeft={faHeart} slim>
        LOVE
      </Button>
      <Button variant={ThemeVariant.Tertiary} iconLeft={faAngry} slim>
        HATE
      </Button>
    </Toast>
  );

  const badToast = (
    <Toast
      title={'Bad toast'}
      text={'This is burnt and not nice'}
      status={ToastStatus.Error}
      pauseOnHover={pauseOnHover}
    >
      <Button variant={ThemeVariant.Tertiary} iconLeft={faTrash} slim>
        Bin
      </Button>
    </Toast>
  );

  const infinteToast = (
    <Toast
      title={'Infinite toast'}
      text={'This toast will not timeout - ever'}
      status={ToastStatus.Error}
    />
  );

  const handleOpen: (toast: ReactNode, dur?: number) => MouseEventHandler<HTMLButtonElement> =
    (toast, dur = duration) =>
    (e) => {
      e.preventDefault();
      openToast(toast, { duration: dur, position });
    };

  return (
    <div>
      <Toaster></Toaster>
      <div className={'opacity-50 mb-4 min-h-[400px]'}>
        <Typography variant={'display-large-text'}>Toast</Typography>
        <Typography variant={'display-small-text'}>We love toast</Typography>
        <Typography variant={'body'}>
          Some random content for the toast to appear over the top of.
        </Typography>
        <Typography variant={'body'}>
          Toast: Sliced bread browned on both sides by exposure to radiant heat, such as a grill or
          fire.
        </Typography>
      </div>
      <p>
        Toast: <button onClick={handleOpen(defaultToast)}>Default</button> |{' '}
        <button onClick={handleOpen(goodToast)}>Success</button> |{' '}
        <button onClick={handleOpen(plainToast)}>Info</button> |{' '}
        <button onClick={handleOpen(warningToast)}>Warning</button> |{' '}
        <button onClick={handleOpen(badToast)}>Error</button> |{' '}
        <button onClick={handleOpen(infinteToast, 0)}>Infinite</button>
      </p>
      <pre>{countDown.toFixed(2)}s</pre>
    </div>
  );
};

ToasterExample.parameters = {
  controls: {
    exclude: /!(position|pauseOnHover)/g,
  },
};

ToasterExample.args = {
  position: ToastPosition.TopLeft,
  duration: 5000,
};
