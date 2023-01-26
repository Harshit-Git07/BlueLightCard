import { GetStaticProps, NextPage } from "next"
import { Button } from "react-bootstrap";

export const getStaticProps: GetStaticProps = async () => ({
	props: {
		test: "Hello World",
	},
});

const Home: NextPage<any> = ({ test }) => {
	return (
		<main>
			<Button variant="primary">Primary Button</Button>
		</main>
	);
}

export default Home;
