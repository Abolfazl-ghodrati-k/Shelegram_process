import { Grid, GridItem, Tabs } from "@chakra-ui/react";
import SideBar from "./components/SideBar";
import Chat from "./components/Chat";
import { createContext, useState, useContext } from "react";
import useSocketSetup from "./Hooks/useSocketSetup";
import SocketConn from "./socket";
import AccountContext from "./Context/AccountContext";

export const FriendContext = createContext();
export const MessagesContext = createContext();
export const socketContext = createContext();

function Home() {
	const { User } = useContext(AccountContext);

	const [FriendList, setFriendList] = useState([]);
	const [Messages, setMessages] = useState([]);
	const [friendIndex, setfriendIndex] = useState(0);
	const [socket, setSocket] = useState(() => SocketConn(User));
	useSocketSetup(setFriendList, setMessages, socket);

	useEffect(() => {
		setSocket(() => SocketConn(User));
	}, [User]);

	return (
		<FriendContext.Provider value={{ FriendList, setFriendList }}>
			<socketContext.Provider value={{ socket }}>
				<Grid
					templateColumns={"repeat(10,1fr)"}
					as={Tabs}
					onChange={(index) => setFriendIndex(index)}
				>
					<GridItem colSpan={3} borderRight={"1px solid gray"}>
						<SideBar />
					</GridItem>
					<GridItem colSpan={7} maxH="95vh">
						<MessagesContext.Provider
							value={{ Messages, setMessages }}
						>
							<Chat userId={FriendList[friendIndex].userId} />
						</MessagesContext.Provider>
					</GridItem>
				</Grid>
			</socketContext.Provider>
		</FriendContext.Provider>
	);
}

export default Home;
