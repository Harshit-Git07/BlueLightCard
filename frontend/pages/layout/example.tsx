import Example from "@/components/example";
import { FC } from "react";
import { useTranslation } from "next-i18next";
import styled from "styled-components";

const StyledExampleLayout = styled.div`
    padding: 10px;
    border: 1px solid;
`;

const ExampleLayout: FC = () => {
    const { t } = useTranslation("common");
    return (
        <StyledExampleLayout>
            <Example text={t("example-title")} buttonText={t("example-button-text")} />
        </StyledExampleLayout>
    );
};

export default ExampleLayout;