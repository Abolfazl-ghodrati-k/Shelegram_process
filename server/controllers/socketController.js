const redisClient = require("../redis");

module.exports.Authorization = (socket, next) => {
	const token = socket.handshake.auth.token
	jwt.verify(token, "dfdfbg455678678", (err, decoded) => {
		if (err) {
			socket.user = decoded
			next()
			return;
		}
		else {
			next(new Error("not Authorized!"))
		}
	});
};

module.exports.initializeUser = async (socket) => {
	// socket.user = { ...socket.request.session.user };
	socket.join(socket.user.userId);
	redisClient.hset(
		`userid: ${socket.user.username}`,
		"userId",
		socket.user.userId,
		"connected",
		true
	);
	const FriendList = await redisClient.client.lrange(
		`friends:${socket.user.username}`,
		0,
		-1
	);
	const parsedFriendList = await parseFriendList(FriendList);
	const friendRooms = parsedFriendList.map((friend) => friend.userId);
	if (friendRooms.length > 0)
		socket.to(friendRooms).emit("connected", true, socket.user.username);
	socket.emit("friends", parsedFriendList);
	const msgQuery = await redisClient.lrange(
		`chat:${socket.user.userId}`,
		0,
		-1
	);

	const messages = msgQuery.map((msgStr) => {
		const parsedStr = msgStr.split(".");
		return { to: parsedStr[0], from: parsedStr[1], content: parsedStr[2] };
	});

	if (messages && messages.length > 0) {
		socket.emit("messages", messages);
	}
};

module.exports.Disconnect = async (socket) => {
	await redisClient.hset(
		`userid:${socket.user.username}`,
		"connected",
		false
	);
	const friendList = await redisClient.lrange(
		`friends:${socket.user.username}`,
		0,
		1
	);

	const friendRooms = await parseFriendList(friendList).then((friends) =>
		friends.map((friend) => friend.userId)
	);
	socket.to(friendRooms).emit("connected", false, socket.user.username);
};

module.exports.AddFriend = async (socket, friendName, cb) => {
	const friend = await redisClient.hgetall(`userid:${friendName}`);
	if (!friend) {
		cb({ done: false, errMsg: "User Doesnt exist" });
		return;
	}
	if (friendName == socket.user.username) {
		cb({ done: false, errMsg: "cannot add self" });
		return;
	}
	const currentFriendList = await redisClient.client.lrange(
		`friends:${socket.user.username}`,
		0,
		-1
	);
	if (currentFriendList && currentFriendList.indexOf(friendName) !== -1) {
		cb({ done: false, errMsg: "friend already exsits" });
		return;
	}
	await redisClient.lpush(
		`friends:${socket.user.username}`,
		[friendName, friend.userId].join(".")
	);
	const newUser = {
		username: friendName,
		userId: friend.userId,
		connected: friend.connected,
	};
	cb({ done: true, newUser });
};

const parseFriendList = async (friendList) => {
	const newFriendList = [];
	for (let friend in friendList) {
		const parsedFriend = friend.split(".");
		const friendConnected = await redisClient.hget(
			`userid:${parsedFriend[0]}`,
			"connected"
		);
		newFriendList.push({
			username: parsedFriend[0],
			userId: parsedFriend[1],
			connected: friendConnected,
		});
	}
	return newFriendList;
};

module.exports.dm = async (socket, message) => {
	const parsedMessage = { ...message, from: socket.user.userId };
	const messageString = [
		parsedMessage.to,
		parsedMessage.from,
		parsedMessage.content,
	].join(".");
	await redisClient.lpush(`chat:${message.to}`, messageString);
	await redisClient.lpush(`chat:${socket.user.userId}`, messageString);

	socket.to(parsedMessage.to).emit("dm", parsedMessage);
};
