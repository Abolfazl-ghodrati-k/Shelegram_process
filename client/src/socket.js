import { io } from "socket.io-client";

const socket = (user) =>
	new io("http://localhost:5050", {
		autoConnect: false,
		withCredentials: true,
		auth: {
			token: user.token,
		},
	});
export default socket;
