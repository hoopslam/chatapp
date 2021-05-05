import { Avatar, IconButton, Button } from "@material-ui/core";
import styled from "styled-components";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import * as EmailValidator from "email-validator";

const createChat = () => {
    const input = pront('Please enter the email address of the user you wish to chat with');
    
    //Checks to see if user inputed something
    if (!input) return null;
    
    //Checks to see if user entered valid email format
    if (EmailValidator.validate(input)) {
        //Once validated, post the new chat into the DB "chats" collection
    }
}

const Sidebar = () => {
	return (
		<Container>
			<Header>
				<UserAvatar />
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

			<SidebarButton onClick={()=> createChat}>Start a new chat</SidebarButton>
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

	&&& { //increases specificity to override material-ui's
		border: 1px solid whitesmoke;
	}
`;
