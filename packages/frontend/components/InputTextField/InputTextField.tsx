import { FC } from "react";
import { Form } from "react-bootstrap";
import { InputTextFieldProps } from "./types";

const InputTextField: FC<InputTextFieldProps> = ({ type, required, onChange, placeholder }) => {
    return <Form.Control type={type} placeholder={placeholder} required={required} onChange={onChange} />
};

export default InputTextField;