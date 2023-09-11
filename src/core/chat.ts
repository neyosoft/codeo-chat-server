import { nanoid } from "nanoid";
import { Server } from "socket.io";

import { UserInfo, UserPayload } from "../types/user";

let groups: string[] = [];
let userList: UserInfo[] = [];

export const handleSocket = (server: any) => {
	const io = new Server(server);

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

		socket.on("leave", (name: string) => {
			socket.leave(name);
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
};
