import { NextPage } from "next"
import { Button } from "react-bootstrap";
import { useTranslation } from "next-i18next";
import getI18nStaticProps from "utils/i18nStaticProps";

export const getStaticProps = getI18nStaticProps;

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
