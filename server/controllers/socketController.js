const redisClient = require("../redis");
require("dotenv").config();
const { jwtVerify } = require("./jwt/jwtAuth");

module.exports.Authorization = (socket, next) => {
	const token = socket.handshake.query.token.split(" ")[1];
	if (token) {
		jwtVerify(token, process.env.JWT_SECRET)
			.then((decoded) => {
				socket.user = { ...decoded };
				next();
			})
			.catch((err) => {
				next(new Error("not authorized"));
			});
	} else {
		next(new Error("not Authorized"));
	}
};

module.exports.initializeUser = async (socket) => {
	socket.join(socket.user.userId);
	await redisClient.hset(
		`userid:${socket.user.username}`,
		"userId",
		socket.user.userId,
		"connected",
		true
	);
	const FriendList = await redisClient.lrange(
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
	console.log("disconnected");
	await redisClient.hset(
		`userid:${socket.user.username}`,
		"connected",
		false
	);
	const friendList = await redisClient.lrange(
		`friends:${socket.user.username}`,
		0,
		-1
	);
	const friendRooms = await parseFriendList(friendList).then((friends) =>
		friends.map((friend) => friend.userId)
	);

	socket.to(friendRooms).emit("connected", false, socket.user.username);
};

module.exports.AddFriend = async (socket, friendName, cb) => {
	const friend = await redisClient.hgetall(`userid:${friendName}`);
	if (friendName == socket.user.username) {
		cb({ done: false, errMsg: "cannot add self" });
		return;
	}
	if (!Object.keys(friend).length > 0) {
		cb({
			done: false,
			errMsg: "User Doesnt exist make sure your friend owns an account",
		});
		return;
	}

	const currentFriendList = await redisClient.lrange(
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
	while (newFriendList.length < friendList.length) {
		if (friendList.length > 0) {
			for (i in friendList) {
				const parsedFriend = friendList[i].split(".");
				const friendConnected = await redisClient.hget(
					`userid:${parsedFriend[0]}`,
					"connected"
				);
				newFriendList.push({
					username: parsedFriend[0],
					userId: parsedFriend[1],
					connected: friendConnected == "true",
				});
			}
		}
	}
	return newFriendList;
};

module.exports.dm = async (socket, message, cb) => {
	const parsedMessage = { ...message, from: socket.user.userId };
	const messageString = [
		parsedMessage.to,
		parsedMessage.from,
		parsedMessage.content,
	].join(".");
	var sender = socket.user;
	const senderUsername = socket.user.username;
	const recieverName = parsedMessage.recieverName;
	const recieverId = parsedMessage.to;
	const recieversFriends = await redisClient.lrange(
		`friends:${recieverName}`,
		0,
		-1
	);
	const parsedRecieversFriends = await parseFriendList(recieversFriends);
	var friend = {};
	parsedRecieversFriends.map((Friend) => {
		if (Friend.username == senderUsername) {
			friend = { ...Friend };
		}
	});

	if (!Object.keys(friend).length > 0) {
		console.log("adding friend");
		await redisClient.lpush(
			`friends:${recieverName}`,
			[socket.user.username, socket.user.userId].join(".")
		);
		// console.log(friend)
		parsedRecieversFriends.push({
			...sender,
			connected: true,
		});
		await redisClient.lpush(`chat:${message.to}`, messageString);
		await redisClient.lpush(`chat:${socket.user.userId}`, messageString);
		socket.to(recieverId).emit("friends", parsedRecieversFriends);
		const msgQuery = await redisClient.lrange(
			`chat:${message.to}`,
			0,
			-1
		);
		const messages = msgQuery.map((msgStr) => {
			const parsedStr = msgStr.split(".");
			return { to: parsedStr[0], from: parsedStr[1], content: parsedStr[2] };
		});
		if (messages && messages.length > 0) {
			socket.to(message.to).emit("messages", messages);
		}
        cb({done: true, newMsg: parsedMessage})

	} else {
		await redisClient.lpush(`chat:${message.to}`, messageString);
		await redisClient.lpush(`chat:${socket.user.userId}`, messageString);
		const msgQuery = await redisClient.lrange(
			`chat:${message.to}`,
			0,
			-1
		);
		const messages = msgQuery.map((msgStr) => {
			const parsedStr = msgStr.split(".");
			return { to: parsedStr[0], from: parsedStr[1], content: parsedStr[2] };
		});
		if (messages && messages.length > 0) {
			socket.to(message.to).emit("messages", messages);
		}
        cb({done: true, newMsg: parsedMessage})
	}
};
