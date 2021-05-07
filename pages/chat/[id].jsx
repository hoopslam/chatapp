import styled from "styled-components";
import Head from "next/head";
import Sidebar from "../../components/Sidebar";
import ChatScreen from "../../components/ChatScreen";
import {auth, db} from "../../firebase";
import getRecipientEmail from "../../lib/getRecipientEmail";
import { useAuthState } from "react-firebase-hooks/auth";

const ChatPage = ({chat, messages}) => {
    const [user] = useAuthState(auth);

    return (
        <Container>
            <Head>
                <title>Chat with {getRecipientEmail(chat.users, user)}</title>
            </Head>
            <Sidebar />
            <ChatContainer>
                <ChatScreen chat={chat} messages={messages}/>
            </ChatContainer>
        </Container>
    )
}

export default ChatPage;

//run before page is served to client
export async function getServerSideProps(context) {
    const ref = db.collection("chats").doc(context.query.id);

    //prepare the messages on the server
    const messagesRes = await ref.collection("messages").orderBy("timestamp", "asc").get();

    const messages = messagesRes.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })).map(messages => ({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime()
    }));

    //prepare the chats
    const chatRes = await ref.get();
    const chat = {
        id: chatRes.id,
        ...chatRes.data()
    }

    return {
        props: {  //stringify object to pass from server to client as props
            messages: JSON.stringify(messages),
            chat: chat,
        }
    }
}

const Container = styled.div`
    display: flex;
`;

const ChatContainer = styled.div`
    flex: 1;
    overflow: scroll;
    height: 100vh;
    
    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`