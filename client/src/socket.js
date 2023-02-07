import { io } from "socket.io-client";

const socket = (user) =>
	new io(import.meta.env.VITE_BACKEND_URL, {
		autoConnect: false,
		withCredentials: true,
		transports: ['websocket'],
		query: {token: "Bearier " + user.token},
	});
export default socket;
