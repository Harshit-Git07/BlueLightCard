import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation, faCircleCheck } from "@fortawesome/pro-solid-svg-icons";
import { FC } from "react";
import styled from "styled-components";
import { InputFieldWrapperProps } from "./types";

interface StyledInputTextIconProps {
    color?: string;
    $iconPosition?: "left" | "right";
}

const StyledInputContainer = styled.div`
    position: relative;
`;

const StyledInputTextIcon = styled(FontAwesomeIcon)<StyledInputTextIconProps>`
    position: absolute;
    top: 50%;
    ${(props) => (props.$iconPosition === "left" ? "left" : "right")}: 0.8rem;
    transform: translateY(-50%);
    color: var(${(props) => props.color});
`;

const InputSharedWrapper: FC<InputFieldWrapperProps> = ({
    icon,
    showRightIcon,
    showErrorState,
    children,
}) => {
    const iconColor = showRightIcon && !showErrorState ? "--bs-success" : "--bs-danger";
    return (
        <StyledInputContainer>
            {icon && <StyledInputTextIcon icon={icon} $iconPosition="left" size="sm" />}
            {children}
            {(showRightIcon || showErrorState) && (
                <StyledInputTextIcon
                    icon={showRightIcon && !showErrorState ? faCircleCheck : faCircleExclamation}
                    $iconPosition="right"
                    color={iconColor}
                />
            )}
        </StyledInputContainer>
    );
};

export default InputSharedWrapper;
