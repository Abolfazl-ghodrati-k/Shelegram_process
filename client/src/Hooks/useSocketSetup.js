import { useContext, useEffect } from "react";
import { AccountContext } from "../Context/AccountContext";

export default function useSocketSetup( setFriendList, setMessages, socket) {
	const { setUser } = useContext(AccountContext);
	useEffect(() => {
		socket.connect();
		socket.on("friends", (FriendList) => {
			setFriendList(FriendList);
		});
		// socket.on("messages", (messages) => {
		// 	setMessages(messages);
		// });
		// socket.on("dm", (message) => {
		// 	setMessages((prev) => [message, ...prev]);
		// });
		socket.on("connected", (status, username) => {
			console.log(status,username)
			setFriendList((prev) => {
				return prev.map((friend) => {
					if (friend.username == username) {
						friend.connected = status;
					}
					return friend;
				});
			});
		});
		socket.on("connect_error", (err) => {
			console.log(err);
			setUser({ loggedIn: false });
		});
		return () => {
			socket.off("connect_error");
			socket.off("messages");
			socket.off("connected");
			socket.off("friends");
		};
	}, [setUser, setMessages, setFriendList, socket]);
}
