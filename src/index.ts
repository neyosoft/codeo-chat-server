import cors from "cors";
import http from "http";
import express from "express";
import { Server } from "socket.io";
import { UserInfo, UserPayload } from "./types/user";
import { nanoid } from "nanoid";

const app = express();
const server = http.createServer(app);
const port = process.env.PORT ?? 9900;

app.use(cors({ credentials: true }));

const io = new Server(server);

let userList: UserInfo[] = [];
let groups: string[] = [];

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
		if (!(user.name && user.phone)) return;
		const existingUserIndex = userList.findIndex((record) => record.phone === user.phone);

		if (existingUserIndex === -1) {
			userList.push({ ...user, id: socket.id });
		} else {
			userList.splice(existingUserIndex, 1, { ...user, id: socket.id });
		}

		io.emit("groups", groups);
		io.emit("user-list", userList);
	});

	socket.on("join", (name: string) => {
		socket.join(name);
	});

	socket.on("new-group", (name: string) => {
		groups.push(name);

		io.emit("groups", groups);
	});

	socket.on("group-message", ({ name, message }) => {
		const currentUser = userList.find((record) => record.id === socket.id);

		if (currentUser) {
			io.to(name).emit("new-group-chat", {
				message,
				group: name,
				id: nanoid(),
				name: currentUser.name,
				phone: currentUser.phone,
			});
		}
	});
});

server.listen(port, () => {
	console.log(`Codeo app listening on port http://localhost:${port}`);
});
