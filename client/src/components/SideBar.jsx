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
import { useContext } from "react";
import { FriendContext } from "../Home";
import AddFriendModal from './AddFriendModal'




function SideBar() {
	const { FriendList } = useContext(FriendContext);
	const { isOpen, onOpen, onClose } = useDisclosure()
	return (
		<>
		<VStack py={"1.4rem"} h={"100vh"}>
			<HStack justify={"space-evenly"} w={"100%"}>
				<Heading size="md">Add Friend</Heading>
				<Button onClick={onOpen}>
					<ChatIcon />
				</Button>
			</HStack>
			<Divider />
			{(FriendList && FriendList.length > 0) ? (
				<VStack as={TabList}>
					{FriendList.map((friend) => (
					<HStack as={Tab} justify={"start"} w="100%" key={friend.username}>
						<Circle
							bg={`${friend.connected ? "green.500" : "red.500"}`}
							w={"20px"}
							h={"20px"}
						/>
						<Text>{friend.username}</Text>
					</HStack>
					))}
				</VStack>
			) : (
				<Text fontSize="sm">No friends click Add Friend to Start conversation</Text>
			)}
		</VStack>
		<AddFriendModal isOpen={isOpen} onClose={onClose}/>
		</>
	);
}

export default SideBar;
