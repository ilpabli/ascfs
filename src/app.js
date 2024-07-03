import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import cors from "cors";
import incializePassport from "./config/passport.config.js";
import enviroment from "./config/enviroment.js";
import { loggerMiddleware } from "./middleware/logger.middleware.js";

import { ticketsRouter } from "./ticket/ticket.router.js";
import { usersRouter } from "./user/user.router.js";
import { clientsRouter } from "./client/client.router.js";
import { monitorRouter } from "./monitor/monitor.router.js";
import { initSocket } from "./monitor/monitor.socket.js";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: enviroment.FRONTEND_URL,
    preflightContinue: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(enviroment.SECRET));
app.use(loggerMiddleware);

app.use(express.static("public"));

incializePassport();
app.use(passport.initialize());

app.use("/api/tickets", ticketsRouter);
app.use("/api/users", usersRouter);
app.use("/api/clients", clientsRouter);
app.use("/monitor", monitorRouter);

const webServer = app.listen(enviroment.PORT, () => {
  console.log(`Listen on ${enviroment.PORT}`);
});

const io = initSocket(webServer);
