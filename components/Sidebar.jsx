import { Avatar, IconButton, Button } from "@material-ui/core";
import styled from "styled-components";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import * as EmailValidator from "email-validator";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";

const Sidebar = () => {
	const [user] = useAuthState(auth);

	//reference to the chats that contain the user's email
	const userChatRef = db.collection("chats").where("users", "array-contains", user.email);
	const [chatsSnapshot] = useCollection(userChatRef);

	const createChat = () => {
		const input = prompt("Please enter the email address of the user you wish to chat with");

		//Checks to see if user inputed a valid email
		if (!input || !EmailValidator.validate(input)) return alert("Please enter a valid email address");

		//Checks to see if user entered valid email format and if the chat doesn't already exists, create a new one
		if (EmailValidator.validate(input) && !chatAlreadyExists(input)) {
			//Once validated, post the new chat into the DB "chats" collection
			db.collection("chats").add({
				users: [user.email, input],
			});
		}
	};

	//check in real time to see if that chat already exists on database
	const chatAlreadyExists = (recipientEmail) =>
		{
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
				<UserAvatar onClick={() => auth.signOut()} />
				<IconsContainer>
					<IconButton>
						<ChatIcon />
					</IconButton>
					<IconButton>
						<MoreVertIcon />
					</IconButton>
				</IconsContainer>
			</Header>

			<Search>
				<SearchIcon />
				<SearchInput placeholder='Search chats' />
			</Search>

			<SidebarButton onClick={createChat}>Start a new chat</SidebarButton>
		</Container>
	);
};

export default Sidebar;

const Container = styled.div``;

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

const IconsContainer = styled.div``;

const Search = styled.div`
	display: flex;
	align-items: center;
	padding: 20px;
	border-radius: 2px;
`;

const SearchInput = styled.input`
	outline-width: 0;
	border: none;
	flex: 1;
`;

const SidebarButton = styled(Button)`
	width: 100%;

	&&& {
		//increases specificity to override material-ui's
		border: 1px solid whitesmoke;
	}
`;
