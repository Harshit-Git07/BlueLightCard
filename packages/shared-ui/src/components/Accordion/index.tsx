import { AmplitudeArg } from '../../types';
import { FC, ReactNode, useEffect, useId, useRef, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import { offerSheetAtom } from '../OfferSheet/store';
import { useAtom, useAtomValue } from 'jotai';
import { focusableElements } from '../../constants';
import { accordionAtom } from './store';
import styles from './styles';

const getClasses = styles;

export type Props = {
  title: string;
  children: ReactNode;
  amplitudeDetails?: AmplitudeArg;
  groupId?: string;
  isOpenDefault?: boolean;
  openIcon?: IconDefinition;
  closeIcon?: IconDefinition;
};

const Accordion: FC<Props> = ({
  title,
  children,
  amplitudeDetails = undefined,
  groupId: providedGroupId = undefined,
  isOpenDefault = false,
  openIcon = faPlus,
  closeIcon = faMinus,
}) => {
  const accordionId: string = `accordion-${useId()}`;
  const [accordionGroups, setActiveAccordion] = useAtom(accordionAtom);
  const { amplitudeEvent } = useAtomValue(offerSheetAtom);
  const contentRef = useRef<HTMLDivElement>(null);
  const innerContentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(0);

  const fallbackId = useId();
  const groupId = providedGroupId ?? fallbackId;
  const isOpen: boolean = accordionGroups[groupId] === accordionId;
  const { accordionClasses, buttonClasses, titleClasses, contentWrapperClasses, contentClasses } =
    getClasses(isOpen, !!providedGroupId);

  const toggleFocusableElements = (makeFocusable: boolean) => {
    const elements = contentRef.current?.querySelectorAll(
      focusableElements.join(', ') + '[tabindex]:not([tabindex="-1"])',
    );
    elements?.forEach((element) => {
      if (makeFocusable) {
        (element as HTMLElement).removeAttribute('tabIndex');
      } else {
        (element as HTMLElement).setAttribute('tabIndex', '-1');
      }
    });
  };

  const updateHeight = useCallback(() => {
    if (isOpen && innerContentRef.current) {
      const newHeight = innerContentRef.current.offsetHeight;
      setHeight(newHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  const handleToggle = () => {
    setActiveAccordion({ ...accordionGroups, [groupId]: isOpen ? undefined : accordionId });

    if (!isOpen && amplitudeEvent && amplitudeDetails) {
      amplitudeEvent(amplitudeDetails);
    }
  };

  useEffect(() => {
    setActiveAccordion({ ...accordionGroups, [groupId]: isOpenDefault ? accordionId : undefined });
  }, []);

  useEffect(() => {
    updateHeight();
    toggleFocusableElements(isOpen);

    const handleResize = () => {
      updateHeight();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, updateHeight]);

  return (
    <div className={accordionClasses}>
      <button
        className={buttonClasses}
        onClick={handleToggle}
        aria-label={isOpen ? 'Hide content' : 'Expand content'}
        aria-expanded={isOpen}
        aria-controls={accordionId}
      >
        <span className={titleClasses}>{title}</span>
        <FontAwesomeIcon icon={isOpen ? closeIcon : openIcon} aria-hidden="true" />
      </button>
      <div
        id={accordionId}
        ref={contentRef}
        className={contentWrapperClasses}
        style={{ height: `${height}px` }}
        aria-hidden={!isOpen}
      >
        <div ref={innerContentRef} className={contentClasses} aria-hidden={!isOpen}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
