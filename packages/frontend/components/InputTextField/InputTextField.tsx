import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";
import { Form } from "react-bootstrap";
import styled, { css } from "styled-components";
import { InputTextFieldProps } from "./types";

interface StyledInputTextProps {
    error?: boolean;
    spaceForIcon?: boolean;
}

const StyledInputTextContainer = styled.div`
    position: relative;
`;

const StyledInputTextIcon = styled(FontAwesomeIcon)`
    position: absolute;
    top: 50%;
    left: 0.8rem;
    transform: translateY(-50%);
`;

const StyledInputTextField = styled(Form.Control)<StyledInputTextProps>`
    ${props => props.spaceForIcon && css`padding-left: 2.1rem;`}
    ${props => props.error && css`border-color: var(--bs-danger) !important;`}
`;

const InputTextField: FC<InputTextFieldProps> = ({ icon, error, placeholder, type = "text" }) => {
    return (
        <StyledInputTextContainer>
            {icon &&
                <StyledInputTextIcon icon={icon} size="sm" />
            }
            <StyledInputTextField type={type} spaceForIcon={!!icon} error={error} placeholder={placeholder} />
        </StyledInputTextContainer>
    );
};

export default InputTextField;