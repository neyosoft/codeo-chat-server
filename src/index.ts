import cors from "cors";
import http from "http";
import express from "express";
import { handleSocket } from "./core/chat";

const app = express();
const server = http.createServer(app);
const port = process.env.PORT ?? 9900;

app.use(cors({ credentials: true }));

handleSocket(server);

app.get("/", (req, res) => {
	res.send("Welcome to Codeo server");
});

server.listen(port, () => {
	console.log(`Codeo app listening on port http://localhost:${port}`);
});
