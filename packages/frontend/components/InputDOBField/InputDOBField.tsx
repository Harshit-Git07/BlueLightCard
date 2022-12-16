import { FC, KeyboardEvent } from "react";
import InputTextField from "@/components/InputTextField/InputTextField";
import { InputDOBFieldProps } from "./types";
import { Col, Container, Row } from "react-bootstrap";

const maxDayNumber = 31;
const maxMonthNumber = 12;
const mapFieldToLengthProps = {
    dd: [2, 31],
    mm: [2, 12],
    yyyy: [4],
};

const InputDOBField: FC<InputDOBFieldProps> = ({ dd, mm, yyyy, onChange }) => {
    const defaultDate = new Date();
    const maxFallbackYear = defaultDate.getFullYear();

    mapFieldToLengthProps.yyyy.push(maxFallbackYear);

    const onKeyDown = (field: "dd" | "mm" | "yyyy", ev: KeyboardEvent<HTMLInputElement>) => {
        const value = (ev.currentTarget as HTMLInputElement)?.value;
        const lookAheadLen = value.length + 2;

        if (lookAheadLen > mapFieldToLengthProps[field][0]) {
            return ev.preventDefault();
        }
    };

    return (
        <Container>
            <Row>
                <Col>
                    <InputTextField
                        value={dd?.value}
                        error={dd?.error}
                        type="number"
                        min={0}
                        max={maxDayNumber}
                        placeholder={dd?.placeholder ?? "DD"}
                        onChange={onChange}
                        onKeyDown={(ev) => onKeyDown("dd", ev as any)}
                    />
                </Col>
                <Col>
                    <InputTextField
                        value={mm?.value}
                        error={mm?.error}
                        type="number"
                        min={0}
                        max={maxMonthNumber}
                        placeholder={mm?.placeholder ?? "MM"}
                        onChange={onChange}
                        onKeyDown={(ev) => onKeyDown("mm", ev as any)}
                    />
                </Col>
                <Col>
                    <InputTextField
                        value={yyyy?.value}
                        error={yyyy?.error}
                        type="number"
                        min={0}
                        max={maxFallbackYear}
                        placeholder={yyyy?.placeholder ?? "YYYY"}
                        onChange={onChange}
                        onKeyDown={(ev) => onKeyDown("yyyy", ev as any)}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default InputDOBField;
