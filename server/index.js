// server configuration
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const server = http.createServer(app);
const { Server } = require("socket.io");
const helmet = require("helmet");
const { corsConfig } = require("./controllers/serverController");
require("dotenv").config();
const io = new Server(server, {
	cors: {
		origin: ["http://127.0.0.1:5000"],
		credentials: true,
	},
});
// routers & controllers import section
const {
	Authorization,
	AddFriend,
	Disconnect,
	dm,
	initializeUser,
} = require("./controllers/socketController");
const authRouter = require("./routes/authRouter");
const { jwtVerify } = require("./controllers/jwt/jwtAuth");
// --------------------------------------------------------------------------
//                              app middleware
// --------------------------------------------------------------------------
app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json());
app.use("/auth", authRouter);
// --------------------------------------------------------------------------
//                              app running
// --------------------------------------------------------------------------

app.get("/", (req, res) => {
	res.send("hello user");
});
io.use(Authorization);
io.on("connection", (socket) => {
	initializeUser(socket);
	socket.on("add_friend", (friendName, cb) => {
		AddFriend(socket, friendName, cb);
	});
	socket.on("disconnect", Disconnect);
	socket.on("dm", (message) => dm(socket, message));
});

server.listen(5050, () => {
	console.log("listening on *:5050");
});
