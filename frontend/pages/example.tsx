import ExampleLayout from "layout/example";
import { GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale ?? "en", ["common"])),
    }
  })

const ExamplePage: NextPage = () => {
    return <ExampleLayout></ExampleLayout>
};

export default ExamplePage;