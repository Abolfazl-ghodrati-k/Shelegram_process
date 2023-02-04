import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalHeader,
	ModalFooter,
	ModalCloseButton,
} from "@chakra-ui/modal";
import {
	Button,
	Input,
	FormControl,
	FormErrorMessage,
	FormLabel,
	VStack,
} from "@chakra-ui/react";
import TextField from "./Login/TextField";
import { Formik } from "formik";
import * as Yup from "yup";
import { useCallback, useContext, useState, useEffect } from "react";
import { FriendContext } from "../Home";
import { socketContext } from "../Home";

const AddFriendModal = ({ isOpen, onClose }) => {
	const [error, seterror] = useState("");
	const { setFriendList } = useContext(FriendContext);
	const { socket } = useContext(socketContext);

	const closeModal = useCallback(() => {
		seterror("");
		onClose();
	}, [onClose]);

	return (
		<Modal isOpen={isOpen} onClose={closeModal}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Add a friend</ModalHeader>
				<ModalCloseButton />
				<Formik
					initialValues={{ friendName: "" }}
					validationSchema={Yup.object({
						friendName: Yup.string()
							.required("Friendname required")
							.min(6, "Friendname too short!")
							.max(28, "Friendname too long!"),
					})}
					onSubmit={(values) => {
						socket.emit(
							"add_friend",
							values.friendName,
							({ done, errMsg, newUser }) => {
								if (!done) {
									console.log("face a prob");
									seterror(
										errMsg
											? errMsg
											: "try again later bitch im busy"
									);
									setTimeout(() => {
										seterror("");
									}, 4000);
								} else {
									if (newUser) {
										setFriendList(prev => [...prev,newUser]);
										console.log(newUser);
									}
									closeModal();
									return;
								}
							}
						);
					}}
				>
					{(formik) => (
						<VStack
							as={"form"}
							w={{ base: "100%" }}
							justify={"center"}
							spacing={"1rem"}
							onSubmit={(e) => {
								e.preventDefault();
								formik.handleSubmit();
							}}
						>
							<ModalBody w={"100%"}>
								<p fontSize='sm' align="center" color="red" >
									{error}
								</p>
								<TextField
									name="friendName"
									label={"Friends name"}
									placeholder="enter your friends name"
								/>
							</ModalBody>
							<ModalFooter w={"100%"}>
								<Button colorScheme="blue" type="submit">
									Submit
								</Button>
							</ModalFooter>
						</VStack>
					)}
				</Formik>
			</ModalContent>
		</Modal>
	);
};

export default AddFriendModal;
