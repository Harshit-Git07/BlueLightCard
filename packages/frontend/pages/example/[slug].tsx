import ExampleLayout from "layout/example";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect } from "react";

/** Testing with SSG

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale ?? "en", ["common"])),
    }
});

export const getStaticPaths: GetStaticPaths = async () => ({
    paths: [{ params: { slug: "signup" } }],
    fallback: false,
});*/

const ExamplePage: NextPage = (props) => {
    const router = useRouter();
    console.info(props);
    useEffect(() => console.info(router.query), []);
    return <ExampleLayout></ExampleLayout>
};

export default ExamplePage;