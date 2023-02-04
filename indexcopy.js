const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { instrument } = require("@socket.io/admin-ui");
const authRouter = require("./routes/authRouter");
const { corsConfig } = require("./controllers/serverController");
const { Authorization,AddFriend,Disconnect,dm,initializeUser } = require("./controllers/socketController");
require("dotenv").config();
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
	cors: ['*'],
	transports: ['websocket']
});
app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json());
app.use("/auth", authRouter);
instrument(io, {
	auth: false,
	mode: "development",
});

app.get("/", (req, res) => res.send("Hi"));
io.use(Authorization);
io.on("connection", (socket) => {
	console.log(socket);
   initializeUser(socket)
   socket.on("add_friend", (friendName, cb) => {
   	AddFriend(socket, friendName, cb);
   });
   socket.on("disconnect", Disconnect);
   socket.on("dm", (message) => dm(socket, message));
});

http.listen(5050)