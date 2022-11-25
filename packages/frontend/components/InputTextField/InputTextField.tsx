import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/pro-solid-svg-icons";
import { FC } from "react";
import { Form } from "react-bootstrap";
import styled, { css } from "styled-components";
import { InputTextFieldProps } from "./types";

/**
 * The use of $prop are transient props, see the docs for more
 * https://styled-components.com/docs/api#transient-props
 */

interface StyledInputTextIconProps {
    error?: boolean;
    $iconPosition?: "left" | "right";
}

interface StyledInputTextProps {
    error?: boolean;
    $spaceForIcon?: boolean;
}

const StyledInputTextContainer = styled.div`
    position: relative;
`;

const StyledInputTextIcon = styled(FontAwesomeIcon)<StyledInputTextIconProps>`
    position: absolute;
    top: 50%;
    ${props => props.$iconPosition === "left" ? "left" : "right"}: 0.8rem;
    transform: translateY(-50%);
    ${props => props.error && css`color: var(--bs-danger);`}
`;

const StyledInputTextField = styled(Form.Control)<StyledInputTextProps>`
    ${props => props.$spaceForIcon && css`padding-left: 2.1rem;`}
    ${props => props.error && css`border-color: var(--bs-danger) !important;`}
`;

const InputTextField: FC<InputTextFieldProps> = ({ icon, error, placeholder, type = "text" }) => {
    return (
        <StyledInputTextContainer>
            {icon &&
                <StyledInputTextIcon icon={icon} $iconPosition="left" size="sm" />
            }
            <StyledInputTextField type={type} $spaceForIcon={!!icon} error={error} placeholder={placeholder} />
            {error && 
                <StyledInputTextIcon icon={faCircleExclamation} $iconPosition="right" error={error} size="sm" />
            }
        </StyledInputTextContainer>
    );
};

export default InputTextField;