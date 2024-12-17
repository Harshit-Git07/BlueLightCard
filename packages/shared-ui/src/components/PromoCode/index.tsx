import React, { FC, useEffect, useMemo, useState } from 'react';
import { PromoCodeProps, PromoCodeVariant } from './types';
import PromoCodeSuccess from './components/PromoCodeSuccess';
import PromoCodeEntry from './components/PromoCodeEntry';

const PromoCode: FC<PromoCodeProps> = ({
  name,
  variant = 'default',
  value = '',
  maxChars,
  onChange,
  onKeyDown,
  onApply,
  onRemove,
  onStateChange,
  placeholder = 'Enter promo code',
  label = 'Add your promo code',
  errorMessage,
  infoMessage,
  icon = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(variant === 'open');
  const [currentVariant, setCurrentVariant] = useState<PromoCodeVariant>(variant);

  useEffect(() => {
    setCurrentVariant(variant);
    if (variant === 'open' || variant === 'error') {
      setIsOpen(true);
    }
  }, [variant]);

  const isInSuccessState = useMemo(() => {
    return currentVariant === 'success-skip-id' || currentVariant === 'success-skip-payment';
  }, []);

  const togglePromoCodeTextEntryVisability = () => {
    if (isInSuccessState) return;

    setIsOpen(!isOpen);
    const newVariant = !isOpen ? 'open' : 'default';
    setCurrentVariant(newVariant);
    onStateChange?.(newVariant);
  };

  const handleRemove = () => {
    onRemove?.();
    setCurrentVariant('default');
    onStateChange?.('default');
    setIsOpen(false);
  };

  const getOuterDivClasses = (variant: PromoCodeVariant) => {
    const baseClasses =
      'w-full max-w-[500px] border rounded-[4px] transition-all duration-300 ease-in-out';
    switch (variant) {
      case 'default':
        return `${baseClasses} bg-colour-surface-container dark:bg-colour-surface-container-dark border-colour-onSurface-outline dark:border-colour-onSurface-outline-dark`;
      case 'open':
        return `${baseClasses} border-colour-onSurface-outline dark:border-colour-onSurface-outline-dark`;
      case 'error':
        return `${baseClasses} bg-colour-surface-container dark:bg-colour-surface-container-dark border-colour-error dark:border-colour-error-dark`;
      case 'success-skip-id':
      case 'success-skip-payment':
        return `${baseClasses} bg-colour-success-bright dark:bg-colour-success-bright-dark border-colour-success dark:border-colour-success-dark`;
    }
  };

  return (
    <div className={`${getOuterDivClasses(currentVariant)} ${className}`}>
      {!isInSuccessState && (
        <PromoCodeEntry
          name={name}
          value={value}
          maxChars={maxChars}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onApply={onApply}
          placeholder={placeholder}
          label={label}
          errorMessage={errorMessage}
          infoMessage={infoMessage}
          icon={icon}
          isOpen={isOpen}
          currentVariant={currentVariant}
          onToggle={togglePromoCodeTextEntryVisability}
        />
      )}

      {isInSuccessState && (
        <PromoCodeSuccess value={value} onRemove={handleRemove} variant={variant} />
      )}
    </div>
  );
};

export default PromoCode;
