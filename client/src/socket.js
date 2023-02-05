import { io } from "socket.io-client";

const socket = (user) =>
	new io(process.env.REACT_APP_SEVER_URL, {
		autoConnect: false,
		withCredentials: true,
		transports: ['websocket'],
		query: {token: "Bearier " + user.token},
	});
export default socket;
