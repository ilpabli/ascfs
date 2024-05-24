// Importo express
import express from "express";
import handlerbars from "express-handlebars";
import cookieParser from "cookie-parser";
import passport from "passport";
import incializePassport from "./config/passport.config.js";
import enviroment from "./config/enviroment.js";
import { loggerMiddleware } from "./middleware/logger.middleware.js";

import { productsRouter } from "./product/product.router.js";
import { cartsRouter } from "./cart/cart.router.js";
import { chatRouter } from "./chat/chat.router.js";
import { viewsRouter } from "./view/views.router.js";
import { usersRouter } from "./user/user.router.js";
import { githubRouter } from "./github/github.router.js";
import { initSocket } from "./chat/chat.socket.js";

// Creo la app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(enviroment.SECRET));
app.use(loggerMiddleware);

// Set handlebars
app.engine("handlebars", handlerbars.engine());
app.set("views", "views/");
app.set("view engine", "handlebars");

// Directorio publico para files statics
app.use(express.static("public"));

// Inicializo Passport
incializePassport();
app.use(passport.initialize());

// Routers
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/chat", chatRouter);
app.use("/", viewsRouter);
app.use("/api/users", usersRouter);
app.use("/api/sessions", githubRouter);

// Arranco mi webServer en el port 8080
const webServer = app.listen(enviroment.PORT, () => {
  console.log(`Listen on ${enviroment.PORT}`);
});

// Inicialización de socket.io
const io = initSocket(webServer);
