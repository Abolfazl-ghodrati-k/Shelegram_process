import { HStack, Input, Button } from "@chakra-ui/react";
import { Formik } from "formik";
import React, { useContext } from "react";
import * as Yup from "yup";
import { MessagesContext } from "../Home";
import { socketContext } from "../Home";
import TextField from "./Login/TextField";

function ChatBox({ userId, username }) {
	const { socket } = useContext(socketContext);
	const { setMessages } = useContext(MessagesContext);

	return (
		<Formik
			initialValues={{ message: "" }}
			validationSchema={Yup.object({
				message: Yup.string().min(1).max(255),
			})}
			onSubmit={(values, actions) => {
				const message = {
					recieverName: username,
					to: userId,
					from: null,
					content: values.message,
				};
				socket.emit("dm", message, ({ done, errMsg, newMsg }) => {
					if (done) {
						setMessages((prev) => [newMsg, ...prev]);
					} else {
						alert("error occured");
					}
				});
				actions.resetForm();
			}}
		>
			{(formik) => (
				<HStack
					as={"form"}
					w="100%"
					pb="1rem"
					px="1.2em"
					align="center"
					onSubmit={(e) => {
						e.preventDefault();
						formik.handleSubmit();
					}}
				>
					<TextField
						name="message"
						placeholder={username}
						autoComplete="off"
					/>
					<Button type="submit" size="md" colorScheme="teal">
						Send
					</Button>
				</HStack>
			)}
		</Formik>
	);
}

export default ChatBox;
