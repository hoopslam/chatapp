import styled from "styled-components";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import Head from "next/head";
import { Button } from "@material-ui/core";

const Login = () => {
	return (
		<Container>
			<Head>
				<title>Login</title>
			</Head>

			<LoginContainer>
				<Logo />
				<Button variant='outlined'>Sign in with Google</Button>
			</LoginContainer>
		</Container>
	);
};

export default Login;

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
`;

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const Logo = styled(WhatsAppIcon)`
	&&& {
		height: 200px;
		width: 200px;
		margin-bottom: 50px;
        color: green;
	}
`;
