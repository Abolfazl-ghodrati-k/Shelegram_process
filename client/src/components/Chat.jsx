import React, { useContext, useRef, useEffect } from "react";
import { FriendContext } from "../Home";
import { MessagesContext } from "../Home";
import { Text, VStack } from "@chakra-ui/react";
import { TabPanels, TabPanel } from "@chakra-ui/tabs";
import ChatBox from "./ChatBox";

function Chat({ userId, username }) {
	const { FriendList } = useContext(FriendContext);
	const { Messages } = useContext(MessagesContext);
	const bottomDiv = useRef();
	useEffect(() => {
		// if (Messages[0].from == userId) {
			if(bottomDiv.current){

				bottomDiv?.current.scrollIntoView();
			}
		// }
		// else {
		// }
	}, [Messages]);
	return FriendList.length ? (
		<VStack h="97vh" justify="end" mt="auto">
			<TabPanels overflowY="scroll" position="relative">
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
							<Text
								key={`msg:${index}`}
								fontSize={{base:"md", md:"lg"}}
								bg={
									message.from === friend.userId
										? "red"
										: "pink"
								}
								m={
									message.from === friend.userId
										? "10px auto 0 0 !important"
										: "10px 0 0 auto !important"
								}
								p="8px"
								borderRadius="10px"
							>
								{message.content}
							</Text>
						))}
					</VStack>
				))}
					<ChatBox userId={userId} username={username} />
			</TabPanels>
		</VStack>
	) : null;
}

export default Chat;
