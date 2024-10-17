import React, { useState, cloneElement } from 'react';
import { colours, fonts } from 'src/tailwind/theme';

export type FloatingPlaceholderProps = {
  text: string;
  targetId: string;
  children: React.ReactElement;
  isFieldDisabled: boolean;
};

/**
 * @param text {string} The placeholder text
 * @param targetId {string} The ID of the input that this placeholder is for. Use `useId` to ensure uniqueness when building multi-input forms
 * @param isFieldDisabled {boolean} whether or not the field this component wraps is disabled or not
 */
const FloatingPlaceholder: React.FC<FloatingPlaceholderProps> = ({
  text,
  targetId,
  children,
  isFieldDisabled,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    if (children.props.onFocus) {
      children.props.onFocus();
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(!!e.target.value);
    if (children.props.onBlur) {
      children.props.onBlur(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value);
    if (children.props.onChange) {
      children.props.onChange(e);
    }
  };

  const clonedChild = cloneElement(children, {
    onFocus: handleFocus,
    onBlur: handleBlur,
    onChange: handleChange,
    id: targetId,
  });

  const classes = {
    div: 'relative',
    label: `absolute left-[16px] transition-all duration-200 ease-in-out pointer-events-none ${fonts.body} ${isFieldDisabled ? colours.textOnSurfaceDisabled : colours.textOnSurfaceSubtle} ${isFocused || hasValue ? `top-[4px] text-xs ${fonts.bodyLight}` : 'top-1/2 -translate-y-1/2 py-[12px]'}`,
  };

  return (
    <div className={classes.div}>
      {clonedChild}
      <label
        htmlFor={targetId}
        className={classes.label}
        aria-hidden={isFieldDisabled}
        aria-disabled={isFieldDisabled}
      >
        {text}
      </label>
    </div>
  );
};

export default FloatingPlaceholder;
