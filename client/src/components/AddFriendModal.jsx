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
} from "@chakra-ui/react";
import TextField from "./Login/TextField";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useCallback, useContext } from "react";
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
							.required("Username required")
							.min(6, "Username too short!")
							.max(28, "Username too long!"),
					})}
					onSubmit={({ values }) => {
						socket.emit(
							"add_friend",
							values.friendName,
							({ done, errMsg, newUser }) => {
								if (!done) {
									seterror(
										errMsg
											? errMsg
											: "try again later bitch im busy"
									);
								} else {
									if (newUser) {
										setFriendList();
									}
									closeModal();
									return;
								}
							}
						);
					}}
				>
					<Form>
						<ModalBody w={"100%"}>
							<Header as="p" color="red.600">
								{error}
							</Header>
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
					</Form>
				</Formik>
			</ModalContent>
		</Modal>
	);
};

export default AddFriendModal;
