import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import moment from "moment";

const Message = ({ user, message }) => {
	const [userLoggedIn] = useAuthState(auth);

	const MessageType = user === userLoggedIn.email ? Sender : Reciever;

	return (
		<Container>
			<MessageType>
				{message.message}
				<Timestamp>
					{message.timestamp ? moment(message.timestamp).format("LT") : "..."}
				</Timestamp>
			</MessageType>
		</Container>
	);
};

export default Message;

const Container = styled.div``;

const MessageElement = styled.p`
	width: fit-content;
	padding: 15px;
	border-radius: 8px;
	margin: 10px;
	min-width: 60px;
	padding-bottom: 26px;
	position: relative;
	text-align: right;
`;

const Sender = styled(MessageElement)`
	margin-left: auto;
	background-color: #B39DDB;
`;

const Reciever = styled(MessageElement)`
	background-color: #80DEEA;
	text-align: left;
`;

const Timestamp = styled.span`
	color: #424242;
	padding: 10px;
	font-size: 9px;
	position: absolute;
	bottom: 0;
	text-align: right;
	right: 0;
`;
