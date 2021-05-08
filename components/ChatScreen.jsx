import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { Avatar} from "@material-ui/core";
import { useCollection } from "react-firebase-hooks/firestore";
import { useState, useRef } from "react";
import Message from "./Message";
import firebase from "firebase";
import TimeAgo from "timeago-react";
import getRecipientEmail from "../lib/getRecipientEmail";

const ChatScreen = ({ chat, messages }) => {
	const [user] = useAuthState(auth);
	const [input, setInput] = useState("");
	const router = useRouter();
    const endOfMessagesRef = useRef(null);
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

    const scrollToBottom = () => {
        endOfMessagesRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
        })
    }

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
        scrollToBottom();
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
			</Header>
			<MessageContainer>
				{showMessages()}
				<EndOfMessage ref={endOfMessagesRef}/>
			</MessageContainer>
			<InputContainer>
				<Input value={input} onChange={(e) => setInput(e.target.value)} />
				<button disabled={!input} type='submit' onClick={sendMessage}>
					Send Message
				</button>
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
	padding: 15px;
	margin-left: 15px;
	margin-right: 15px;
	background-color: whitesmoke;
	font-size: 1.2rem;
`;

const InputContainer = styled.form`
	display: flex;
	align-items: center;
	padding: 10px;
	position: sticky;
	bottom: 0;
	background-color: white;
	z-index: 100;

	button {
		padding: 15px;
		border: none;
		border-radius: 10px;
		background-color: #00ACC1;
		font-size: 1.2rem;
		color: whitesmoke;
		cursor: pointer;

		&:hover {
			background-color: #00BCD4;
		}
	}
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
        margin-top: 0;
	}
`;

const EndOfMessage = styled.div`
    margin-bottom: 50px;
`;

const MessageContainer = styled.div`
	padding: 30px;
	background-color: whitesmoke;
	min-height: 90vh;
`;
