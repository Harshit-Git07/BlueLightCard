import { faEye } from "@fortawesome/pro-solid-svg-icons/faEye";
import { faEyeSlash } from "@fortawesome/pro-solid-svg-icons/faEyeSlash";
import { FC, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { InputTextFieldProps } from "./types";
import InputFieldWrapper from "@/components/_shared/InputFieldWrapper";
import { createStyledInputField } from "@/components/_shared/StyledInputField";

/**
 * The use of $prop are transient props, see the docs for more
 * https://styled-components.com/docs/api#transient-props
 */

const StyledInputTextField = createStyledInputField(Form.Control);

const InputTextField: FC<InputTextFieldProps> = ({
    icon,
    error,
    value,
    placeholder,
    passwordVisible,
    onChange,
    onTogglePasswordVisible,
    type = "text",
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const passwordToggleIcon = isPasswordVisible ? faEye : faEyeSlash;
    const onRightIconClick = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };
    useEffect(() => {
        if (onTogglePasswordVisible) {
            onTogglePasswordVisible(isPasswordVisible);
        }
    }, [onTogglePasswordVisible, isPasswordVisible]);
    return (
        <InputFieldWrapper
            icon={icon}
            showRightIcon={type === "password"}
            showSuccessState={!!value}
            iconRight={type === "password" ? passwordToggleIcon : undefined}
            showErrorState={error}
            onRightIconClick={onRightIconClick}
        >
            <StyledInputTextField
                type={type === "password" && passwordVisible ? "text" : type}
                $spaceForIcon={!!icon}
                error={error}
                placeholder={placeholder}
                onChange={onChange}
            />
        </InputFieldWrapper>
    );
};

export default InputTextField;
