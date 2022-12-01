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

function decider<T>(conditions: [boolean | undefined, T][]): T | undefined {
    return conditions.find((condition) => !!condition[0])?.[1];
}

const InputSharedWrapper: FC<InputFieldWrapperProps> = ({
    icon,
    iconRight,
    showRightIcon,
    showErrorState,
    showSuccessState,
    children,
    onRightIconClick,
}) => {
    const iconColor = decider([
        [showErrorState, "--bs-danger"],
        [showSuccessState, "--bs-success"],
        [!showErrorState || !showErrorState, "none"],
    ]);
    const _iconRight = decider([
        [showSuccessState, faCircleCheck],
        [showErrorState, faCircleExclamation],
        [showRightIcon && !!iconRight, iconRight],
    ]);
    return (
        <StyledInputContainer>
            {icon && <StyledInputTextIcon icon={icon} $iconPosition="left" size="sm" />}
            {children}
            {_iconRight && (
                <StyledInputTextIcon
                    icon={_iconRight}
                    $iconPosition="right"
                    color={iconColor}
                    role="button"
                    aria-label="toggle button"
                    onClick={onRightIconClick}
                />
            )}
        </StyledInputContainer>
    );
};

export default InputSharedWrapper;
