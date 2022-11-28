import { FC } from "react";
import InputFieldWrapper from "@/components/_shared/InputFieldWrapper";
import styled, { css } from "styled-components";
import { Form } from "react-bootstrap";
import { StyledInputProps } from "@/components/_shared/types";
import { InputSelectFieldProps } from "./types";

const StyledInputSelectField = styled(Form.Control)<StyledInputProps>`
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

const InputSelectField: FC<InputSelectFieldProps> = ({ options, defaultOption }) => {
    return (
        <InputFieldWrapper>
            <StyledInputSelectField>
                {defaultOption && <option>{defaultOption}</option>}
                {Object.keys(options).map((value) => (
                    <option key={value} value={value}>
                        {options[value]}
                    </option>
                ))}
            </StyledInputSelectField>
        </InputFieldWrapper>
    );
};

export default InputSelectField;
