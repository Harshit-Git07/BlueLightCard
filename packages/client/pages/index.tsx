import { GetStaticProps, NextPage } from "next"
import { Button } from "react-bootstrap";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		region: process.env.NEXT_APP_REGION ?? "uk",
		...(await serverSideTranslations(locale ?? "en"))
	}
});

const Home: NextPage<any> = ({ region }) => {
	const { t } = useTranslation("common");
	return (
		<main>
			<h1>{t(`heading.${region}`)}</h1>
			<Button variant="primary">Primary Button</Button>
		</main>
	);
}

export default Home;
