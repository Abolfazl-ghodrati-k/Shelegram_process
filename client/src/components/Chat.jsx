import React, { useContext, useRef, useEffect } from "react";
import { FriendContext } from "../Home";
import { MessagesContext } from "../Home";
import { Text, VStack } from "@chakra-ui/react";
import {TabPanels, TabPanel} from "@chakra-ui/tabs"
import ChatBox from "./ChatBox";

function Chat({ userId }) {
	const { FriendList } = useContext(FriendContext);
	const { Messages } = useContext(MessagesContext);
	const bottomDiv = useRef(null);
	useEffect(() => {
		// if (Messages[0].from == userId) {
			// bottomDiv?.current.scrollIntoView();
			console.log(bottomDiv)
		// }
		// else {
	
		// }
	},[]);
	return FriendList.length ? (
		<VStack h="100vh" justify="end">
			<TabPanels overflowY="scroll">
				{FriendList.map((friend) => (
					<VStack
						as={TabPanel}
						flexDir="column-reverse"
						key={`chat:${friend.username}`}
						w="100%"
					>
						<div ref={bottomDiv}></div>
						{Messages.filter(
							(msg) =>
								msg.to === friend.userId ||
								msg.from === friend.userId
						).map((message, index) => (
							<Text key={`msg:${index}`} fontSize="lg" bg>
								{message.content}
							</Text>
						))}
					</VStack>
				))}
				<ChatBox userId={userId} />
			</TabPanels>
		</VStack>
	) : null;
}

export default Chat;
