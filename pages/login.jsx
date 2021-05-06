import styled from "styled-components";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import Head from "next/head";
import { Button, Typography } from "@material-ui/core";
import { auth, provider } from "../firebase";

const logoStyle = {
	fontSize: 120,
	color: "#00acc1",
	marginBottom: 50,
};

const Login = () => {
	const signIn = () => {
		auth.signInWithPopup(provider).catch(alert);
	};

	return (
		<Container>
			<Head>
				<title>Login</title>
			</Head>

			<LoginContainer>
				<Typography variant='h3' component="h1" gutterBottom color="textSecondary">
					Chat App
				</Typography>
				<ChatBubbleOutlineIcon style={logoStyle} />
				<Button onClick={signIn} variant='outlined' color="textSecondary">
					Sign in with Google
				</Button>
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
	align-items: center;
	padding: 100px;
	background-color: white;
	border-radius: 5px;
	box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`;
