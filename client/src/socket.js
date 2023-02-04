import { io } from "socket.io-client";

const socket = (user) =>
	new io("http://localhost:5050", {
		autoConnect: false,
		withCredentials: true,
		transports: ['websocket'],
		query: {token: "Bearier " + user.token},
	});
export default socket;
