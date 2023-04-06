import { FC, useState } from 'react';
import { PillButtonProps, StyledPillButtonProps } from './types';
import ReactButton from 'react-bootstrap/Button';
import styled from 'styled-components';

const StyledPillButton = styled(ReactButton)<StyledPillButtonProps>`
  border-radius: 30px;
  color: var(
    ${(props) =>
      props.isSelected ? '--pill-buttons-selected-text-color' : '--pill-buttons-default-text-color'}
  );
  background-color: var(
    ${(props) =>
      props.isSelected ? '--pill-buttons-selected-color' : '--pill-buttons-default-color'}
  );
`;

const PillButtons: FC<PillButtonProps> = ({ pills }) => {
  const maxSelectableNumber = 2;
  const [isSelected, setIsSelected] = useState<string[]>([]);

  const handleClick = (pillKey: string) => {
    if (isSelected.length < maxSelectableNumber && !isSelected.includes(pillKey)) {
      setIsSelected([pillKey].concat(...isSelected));
    } else if (isSelected.includes(pillKey)) {
      setIsSelected(isSelected.filter((key) => key !== pillKey));
    }
  };

  return (
    <>
      {pills.map((pillText, index) => {
        const key = `pill_${index}`;
        const selected = isSelected.includes(key);
        const disabled = isSelected.length === maxSelectableNumber && !isSelected.includes(key);
        return (
          <StyledPillButton
            key={key}
            disabled={disabled}
            isSelected={selected}
            onClick={() => handleClick(key)}
          >
            {pillText}
          </StyledPillButton>
        );
      })}
    </>
  );
};

export default PillButtons;
