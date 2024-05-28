// Importo express
import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import incializePassport from "./config/passport.config.js";
import enviroment from "./config/enviroment.js";
import { loggerMiddleware } from "./middleware/logger.middleware.js";

import { ticketsRouter } from "./ticket/ticket.router.js";
import { usersRouter } from "./user/user.router.js";
import { clientsRouter } from "./client/client.router.js";
import { chatRouter } from "./chat/chat.router.js";
import { initSocket } from "./chat/chat.socket.js";

// Creo la app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(enviroment.SECRET));
app.use(loggerMiddleware);

// Directorio publico para files statics
app.use(express.static("public"));

// Inicializo Passport
incializePassport();
app.use(passport.initialize());

// Routers
app.use("/api/tickets", ticketsRouter);
app.use("/api/users", usersRouter);
app.use("/api/clients", clientsRouter);
app.use("/chat", chatRouter);

// Arranco mi webServer en el port 8080
const webServer = app.listen(enviroment.PORT, () => {
  console.log(`Listen on ${enviroment.PORT}`);
});

// Inicialización de socket.io
const io = initSocket(webServer);
