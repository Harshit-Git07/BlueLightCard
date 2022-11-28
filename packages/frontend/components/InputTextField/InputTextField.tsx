import { FC } from "react";
import { Form } from "react-bootstrap";
import styled, { css } from "styled-components";
import { InputTextFieldProps } from "./types";
import InputFieldWrapper from "@/components/_shared/InputFieldWrapper";
import { StyledInputProps } from "@/components/_shared/types";

/**
 * The use of $prop are transient props, see the docs for more
 * https://styled-components.com/docs/api#transient-props
 */

const StyledInputTextField = styled(Form.Control)<StyledInputProps>`
    ${(props) =>
        props.$spaceForIcon &&
        css`
            padding-left: 2.1rem;
        `}
    ${(props) =>
        props.error &&
        css`
            border-color: var(--bs-danger) !important;
        `}
`;

const InputTextField: FC<InputTextFieldProps> = ({
    icon,
    error,
    value,
    placeholder,
    onChange,
    type = "text",
}) => {
    const iconColor = value && !error ? "--bs-success" : "--bs-danger";
    return (
        <InputFieldWrapper icon={icon} showRightIcon={!!value} showErrorState={error}>
            <StyledInputTextField
                type={type}
                $spaceForIcon={!!icon}
                error={error}
                placeholder={placeholder}
                onChange={onChange}
            />
        </InputFieldWrapper>
    );
};

export default InputTextField;
