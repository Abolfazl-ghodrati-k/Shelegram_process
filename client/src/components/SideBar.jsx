import {
	Button,
	Divider,
	HStack,
	Heading,
	VStack,
	Text,
	Circle,
} from "@chakra-ui/react";
import { TabList, Tab } from "@chakra-ui/tabs";
import { ChatIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/react";
import { useContext, useState, useEffect } from "react";
import { FriendContext } from "../Home";
import AddFriendModal from "./AddFriendModal";
import { AccountContext } from "../Context/AccountContext";

function SideBar() {
	const { user } = useContext(AccountContext);
	const { FriendList } = useContext(FriendContext);
	const [loading, setloading] = useState(true);
	const { isOpen, onOpen, onClose } = useDisclosure();
	useEffect(() => {
		if (FriendList && FriendList.length > 0) {
			setloading(false);
		}
		setTimeout(() => {
           setloading(false)
		},10000)
	}, [FriendList]);

	return (
		<>
			<VStack py={"1.4rem"} h={"100vh"}>
				<Heading size="md" color="blue">
					{user.username}
				</Heading>
				<Divider />

				<HStack justify={"space-evenly"} w={"100%"}>
					<Heading size="md">Add Friend</Heading>
					<Button onClick={onOpen}>
						<ChatIcon />
					</Button>
				</HStack>
				<Divider />
				{(!loading && (FriendList && FriendList.length > 0)) ? (
					<VStack as={TabList}>
						<Heading size="sm" align="left">
							Friend's
						</Heading>
						{FriendList.map((friend) => (
							<HStack
								as={Tab}
								justify={"start"}
								w="100%"
								key={friend.username}
							>
								<Circle
									bg={`${
										friend.connected
											? "green.500"
											: "red.500"
									}`}
									w={"20px"}
									h={"20px"}
								/>
								<Text>{friend.username}</Text>
							</HStack>
						))}
					</VStack>
				) : ((FriendList && FriendList.length == 0) && !loading) ?(
					<Text fontSize="sm">
						No friends click Add Friend to Start conversation
					</Text>
				):(<Text>loading..</Text>)}
			</VStack>
			<AddFriendModal isOpen={isOpen} onClose={onClose} />
		</>
	);
}

export default SideBar;
