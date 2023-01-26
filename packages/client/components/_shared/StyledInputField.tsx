import styled, { css } from "styled-components";
import { StyledInputProps } from "./types";

export const createStyledInputField = (bsComponent: any) => styled(bsComponent)<StyledInputProps>`
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
