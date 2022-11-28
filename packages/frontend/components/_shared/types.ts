import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { PropsWithChildren } from "react";

export type InputFieldWrapperProps = PropsWithChildren & {
    icon?: IconDefinition | undefined;
    showRightIcon?: boolean;
    showErrorState?: boolean;
};

export interface StyledInputProps {
    error?: boolean;
    $spaceForIcon?: boolean;
}
