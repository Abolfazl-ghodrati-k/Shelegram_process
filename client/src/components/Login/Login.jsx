import { VStack, ButtonGroup, Button, Heading } from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import TextField from "./TextField";
import { useNavigate } from "react-router-dom";
import { AccountContext } from "../../Context/AccountContext";
import { useContext } from "react";

function Login() {
	const navigate = useNavigate();
	const { setUser } = useContext(AccountContext);

	return (
		<Formik
			initialValues={{ username: "", password: "" }}
			validationSchema={Yup.object({
				username: Yup.string()
					.required("Username required")
					.min(6, "Username too short!")
					.max(28, "Username too long!"),
				password: Yup.string()
					.required("Password required")
					.min(6, "Password too short!")
					.max(28, "Password too long!"),
			})}
			onSubmit={(values, actions) => {
				const vals = { ...values };
				fetch("http://localhost:5050/auth/login", {
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},

					body: JSON.stringify(vals),
				})
					.catch((err) => {
						console.log(err);
					})
					.then((res) => {
						if (!res || !res.ok || res.status >= 400) {
							return;
						}
						return res.json();
					})
					.then((data) => {
						if (!data) return;
						setUser({ ...data });
						localStorage.setItem("token", data.token);
						navigate("/home");
					});
				actions.resetForm();
			}}
		>
			{(formik) => (
				<VStack
					as={"form"}
					w={{ base: "90%", md: "500px" }}
					m={"auto"}
					justify={"center"}
					h={"100vh"}
					spacing={"1rem"}
					onSubmit={(e) => {
						e.preventDefault();
						formik.handleSubmit();
					}}
				>
					<Heading>Log In</Heading>
					<TextField
						name="username"
						placeholder="Enter username"
						autoComplete="off"
						label={"username"}
					/>

					<TextField
						name="password"
						placeholder="Enter password"
						autoComplete="off"
						label={"password"}
						type="password"
					/>
					<ButtonGroup pt={"1rem"}>
						<Button colorScheme={"teal"} type="submit">
							Log In
						</Button>
						<Button
							onClick={() => {
								navigate("/register");
							}}
						>
							Create Acount
						</Button>
					</ButtonGroup>
				</VStack>
			)}
		</Formik>
	);
}

export default Login;
