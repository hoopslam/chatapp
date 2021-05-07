import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { Avatar, IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import { useCollection } from "react-firebase-hooks/firestore";
import MicIcon from "@material-ui/icons/Mic";
import { useState } from "react";
import Message from "./Message";
import firebase from "firebase";
import TimeAgo from "timeago-react";
import getRecipientEmail from "../lib/getRecipientEmail";

const ChatScreen = ({ chat, messages }) => {
	const [user] = useAuthState(auth);
	const [input, setInput] = useState("");
	const router = useRouter();
	const [messagesSnapshot] = useCollection(
		db
			.collection("chats")
			.doc(router.query.id)
			.collection("messages")
			.orderBy("timestamp", "asc")
	);

	const [recipientSnapshot] = useCollection(
		db.collection("users").where("email", "==", getRecipientEmail(chat.users, user))
	);

	const showMessages = () => {
		if (messagesSnapshot) {
			return messagesSnapshot.docs.map((message) => (
				<Message
					key={message.id}
					user={message.data().user}
					message={{
						...message.data(),
						timestamp: message.data().timestamp?.toDate().getTime(),
					}}
				/>
			));
		} else {
			return JSON.parse(messages).map((message) => (
				<Message key={message.id} user={message.user} message={message} />
			));
		}
	};

	const sendMessage = (e) => {
		e.preventDefault();

		//update the last online status based on user input
		db.collection("users").doc(user.uid).set(
			{
				lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
			},
			{ merge: true }
		);

		db.collection("chats").doc(router.query.id).collection("messages").add({
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			message: input,
			user: user.email,
			photoURL: user.photoURL,
		});

		setInput("");
	};

	const recipientEmail = getRecipientEmail(chat.users, user);
    const recipient = recipientSnapshot?.docs?.[0]?.data();

	return (
		<Container>
			<Header>
                {recipient ? (
                    <Avatar src={recipient?.photoURL} />
                ) : (
                    <Avatar>{recipientEmail[0]}</Avatar>
                )}

				<Avatar />
				<HeaderInformation>
					<h3>{recipientEmail}</h3>
                    {recipientSnapshot ? (
                        <p>Last active: {" "}
                        {recipient?.lastSeen?.toDate() ? (
                            <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                        ) : "Unavailable"}
                        </p>
                    ): (
                        <p>Loading Last Active...</p>
                    )}
				</HeaderInformation>
				<HeaderIcons>
					<IconButton>
						<AttachFileIcon />
					</IconButton>
					<IconButton>
						<MoreVertIcon />
					</IconButton>
				</HeaderIcons>
			</Header>
			<MessageContainer>
				{showMessages()}
				<EndOfMessage />
			</MessageContainer>
			<InputContainer>
				<InsertEmoticonIcon />
				<Input value={input} onChange={(e) => setInput(e.target.value)} />
				<button hidden disabled={!input} type='submit' onClick={sendMessage}>
					Send Message
				</button>
				<MicIcon />
			</InputContainer>
		</Container>
	);
};

export default ChatScreen;

const Container = styled.div``;

const Input = styled.input`
	flex: 1;
	outline: 0;
	border: none;
	border-radius: 10px;
	align-items: center;
	padding: 20px;
	margin-left: 15px;
	margin-right: 15px;
	background-color: whitesmoke;
`;

const InputContainer = styled.form`
	display: flex;
	align-items: center;
	padding: 10px;
	position: sticky;
	bottom: 0;
	background-color: white;
	z-index: 100;
`;

const Header = styled.div`
	position: sticky;
	background-color: white;
	z-index: 100;
	top: 0;
	display: flex;
	padding: 10px;
	height: 80px;
	align-items: center;
	border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
	flex: 1;
	margin-left: 15px;

	> h3 {
		margin-bottom: 3px;
	}

	> p {
		font-size: 14px;
		color: gray;
	}
`;

const EndOfMessage = styled.div``;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
	padding: 30px;
	background-color: whitesmoke;
	min-height: 90vh;
`;
