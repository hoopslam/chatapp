import { Avatar, Button } from "@material-ui/core";
import styled from "styled-components";
import * as EmailValidator from "email-validator";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import Chat from "../components/Chat";
import { useState } from "react";
import { useRouter } from "next/router";

const Sidebar = () => {
	const [avatarMenu, setAvatarMenu] = useState(false);
	const [user] = useAuthState(auth);
	const router = useRouter()

	const handleSignOut = () => {
		auth.signOut().then(() => router.push("/"))
	}

	//reference to the chats that contain the user's email
	const userChatRef = db.collection("chats").where("users", "array-contains", user.email);
	const [chatsSnapshot] = useCollection(userChatRef);

	const createChat = () => {
		const input = prompt("Please enter the email address of the user you wish to chat with");

		//Checks to see if user inputed a valid email
		if (!input || !EmailValidator.validate(input))
			return alert("Please enter a valid email address");

		//Checks to see if user didn't write own email
		if (input === user.email) return alert("Please enter someone else's email address");

		//Checks to see if user entered valid email format and if the chat doesn't already exists, create a new one
		if (EmailValidator.validate(input) && input !== user.email && !chatAlreadyExists(input)) {
			//Once validated, post the new chat into the DB "chats" collection
			db.collection("chats").add({
				users: [user.email, input],
			});
		}
	};

	//check in real time to see if that chat already exists on database
	const chatAlreadyExists = (recipientEmail) => {
		if (
			chatsSnapshot?.docs.find(
				(chat) => chat.data().users.find((user) => user === recipientEmail)?.length > 0
			)
		) {
			return true;
		} else return false;
	};

	return (
		<Container>
			<Header>
				<UserAvatar src={user.photoURL} onClick={()=> setAvatarMenu(!avatarMenu)} />
				{avatarMenu ? (
					<AvatarMenu>
						<Button onClick={handleSignOut}>Sign Out</Button>
					</AvatarMenu>
				) : null}
			</Header>

			<SidebarButton onClick={createChat}>Start A Chat</SidebarButton>

			{chatsSnapshot?.docs.map((chat) => (
				<Chat key={chat.id} id={chat.id} users={chat.data().users} />
			))}
		</Container>
	);
};

export default Sidebar;

const Container = styled.div`
	flex: 0.45;
	border-right: 1px solid whitesmoke;
	height: 100vh;
	min-width: 300px;
	max-width: 350px;
	overflow-y: scroll;

	::-webkit-scrollbar {
		display: none;
	}

	-ms-overflow-style: none;
	scrollbar-width: none;
`;

const Header = styled.div`
	display: flex;
	position: sticky;
	top: 0;
	background-color: white;
	z-index: 1;
	justify-content: space-between;
	align-items: center;
	padding: 15px;
	height: 80px;
	border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
	cursor: pointer;

	:hover {
		opacity: 0.8;
	}
`;

const AvatarMenu = styled.div`
	position: absolute;
	top: 70px;
	left: 10px;
	background-color: whitesmoke;
`;

const SidebarButton = styled(Button)`
	width: 100%;
	height: 80px;

	&&& {
		//increases specificity to override material-ui's default
		border-top: 2px solid whitesmoke;
		border-bottom: 2px solid whitesmoke;
		font-size: 1.3rem;
	}
`;
