import cors from "cors";
import http from "http";
import express from "express";
import { Server } from "socket.io";
import { UserInfo, UserPayload } from "./types/user";

const app = express();
const server = http.createServer(app);
const port = process.env.PORT ?? 9900;

app.use(cors({ credentials: true }));

const io = new Server(server);

let userList: UserInfo[] = [];
let groups = [];

app.get("/", (req, res) => {
	res.send("Welcome to Codeo server");
});

io.on("connection", (socket) => {
	socket.on("disconnect", function () {
		const existingUserIndex = userList.findIndex((record) => record.id === socket.id);

		if (existingUserIndex !== -1) {
			userList.splice(existingUserIndex, 1);

			io.emit("user-list", userList);
		}
	});

	socket.on("setup", (user: UserPayload) => {
		const existingUserIndex = userList.findIndex((record) => record.phone === user.phone);

		if (existingUserIndex === -1) {
			userList.push({ ...user, id: socket.id });
		} else {
			userList.splice(existingUserIndex, 1, { ...user, id: socket.id });
		}

		io.emit("user-list", userList);
	});

	socket.on("join", (name: string) => {
		socket.join(name);
	});

	socket.on("group-message", ({ name, message }) => {
		const currentUser = userList.find((record) => record.id === socket.id);

		if (currentUser) {
			io.to(name).emit("new-group-chat", {
				message,
				name: currentUser.name,
				phone: currentUser.phone,
			});
		}
	});
});

server.listen(port, () => {
	console.log(`Codeo app listening on port http://localhost:${port}`);
});
