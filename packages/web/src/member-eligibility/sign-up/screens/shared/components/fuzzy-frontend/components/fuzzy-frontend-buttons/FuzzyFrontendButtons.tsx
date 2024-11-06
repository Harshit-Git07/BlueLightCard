import Button from '@bluelightcard/shared-ui/components/Button-V2';
import React, { FC, useMemo } from 'react';
import { useFuzzyFrontendListener } from '@/root/src/member-eligibility/sign-up/screens/shared/components/fuzzy-frontend/components/fuzzy-frontend-buttons/hooks/UseFuzzyFrontendListener';

interface Props {
  className?: string;
  buttons: FuzzyFrontendButtonProps[];
  putInFloatingDock?: boolean;
}

export interface FuzzyFrontendButtonProps {
  onClick: () => void;
  text: string;
}

export const FuzzyFrontendButtons: FC<Props> = ({ className, buttons, putInFloatingDock }) => {
  const hotkeyPressed = useFuzzyFrontendListener();

  const showButtons = useMemo(() => {
    if (!putInFloatingDock) return true;

    return hotkeyPressed;
  }, [hotkeyPressed, putInFloatingDock]);

  const floatingDockClassNames = useMemo(() => {
    if (!putInFloatingDock) return '';

    return 'fixed bottom-0 left-0 right-0';
  }, [putInFloatingDock]);

  const containerClassNames = useMemo(() => {
    return `${className} ${floatingDockClassNames} flex flex-col justify-center gap-2`;
  }, [className, floatingDockClassNames]);

  if (!showButtons) return null;

  return (
    <div className={containerClassNames}>
      {buttons.map((button, index) => (
        <Button
          data-testid={`next-button-${index + 1}`}
          key={button.text}
          onClick={button.onClick}
          size="Large"
          withoutHover
        >
          {button.text}
        </Button>
      ))}
    </div>
  );
};
