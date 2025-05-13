import express from "express";
import { testTable } from "./Model/index.js";
import bodyparser from "body-parser";
import AuthenticationRoutes from "./Routes/AuthRoutes.js";
import UserRoutes from "./Routes/userRoutes.js";
import ChatRoutes from "./Routes/ChatRoutes.js";
import MessagesRoutes from "./Routes/MessagesRoutes.js";
import cors from "cors";
import setupSocket from "./socket.js";
import notificationRoutes from "./Routes/NotificationRoutes.js"

// app configuration

const app = express();

// APP MIDDLEWARES
app.use(express.json());
app.use(bodyparser.json({ limit: "30mb", extended: true }));
app.use(bodyparser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
//////////////////

// Routes

app.use("/auth", AuthenticationRoutes);
app.use("/user", UserRoutes);
app.use("/chat", ChatRoutes);
app.use("/message", MessagesRoutes);
app.use("/notifications", notificationRoutes)

const server = app.listen(3000, testTable);

setupSocket(server);


