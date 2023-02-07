import { VStack, ButtonGroup, Button, Heading, Text } from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import TextField from "./TextField";
import { useNavigate } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useContext, useEffect, useState } from "react";
import { AccountContext } from "../../Context/AccountContext";

function SignUp() {
	const navigate = useNavigate();
	const { setUser } = useContext(AccountContext);
	const [error, seterror] = useState("");
	const [loading, setloading] = useState(false);
	function setError(err) {
		if (err) {
			setloading(false);
			seterror(err.message);
		} else {
			setloading(false);
			seterror(
				"something went wrong, send your feedback to this email:\n abgkcode@gmail.com"
			);
		}
		setTimeout(() => {
			seterror("");
		}, 2000);
	}

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
				setloading(true);
				fetch(process.env.REACT_APP_BACKEND_URL+ "/auth/signup", {
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(vals),
				})
					.catch((err) => {
						console.log(err);
						setError(err);
						localStorage.removeItem("token");
						return;
					})
					.then((res) => {
						if (!res || !res.ok || res.status >= 400) {
							setError();
							localStorage.removeItem("token");
							return;
						}
						return res.json();
					})
					.then((data) => {
						if (!data) {
							setError();
							return;
						} else {
							console.log(`signing up :`, data);
							if (data.loggedIn) {
								setUser({ ...data });
								setloading(false);
								navigate("/home");
							} else {
								setError(data);
							}
						}
					});
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
					<Heading>Sign Up</Heading>
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
							{loading ? "Loading..." : "Sign Up"}
						</Button>
						<Button
							onClick={() => navigate("/")}
							leftIcon={<ArrowBackIcon />}
						>
							Back
						</Button>
					</ButtonGroup>
					<Text color="red.300" align="center" mt="15px">
						{error && error}
					</Text>
				</VStack>
			)}
		</Formik>
	);
}

export default SignUp;
