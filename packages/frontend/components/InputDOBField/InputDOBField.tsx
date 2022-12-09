import { FC } from "react";
import InputTextField from "@/components/InputTextField/InputTextField";
import { InputDOBFieldProps } from "./types";
import { Col, Container, Row } from "react-bootstrap";

const InputDOBField: FC<InputDOBFieldProps> = ({ dd, mm, yyyy, onChange }) => {
    return (
        <Container>
            <Row>
                <Col>
                    <InputTextField
                        value={dd?.value}
                        error={dd?.error}
                        placeholder="DD"
                        onChange={onChange}
                    />
                </Col>
                <Col>
                    <InputTextField
                        value={mm?.value}
                        error={mm?.error}
                        placeholder="MM"
                        onChange={onChange}
                    />
                </Col>
                <Col>
                    <InputTextField
                        value={yyyy?.value}
                        error={yyyy?.error}
                        placeholder="YYYY"
                        onChange={onChange}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default InputDOBField;
