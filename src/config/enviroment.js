import dotenv from "dotenv";
import program from "./commander.js";

let path = ".env";
let ENVIROMENT = "development";

if (program.opts().mode === "prod") {
  ENVIROMENT = "production";
  console.log("Estas en modo Produccion");
} else {
  console.log("Estas en modo Developer");
}

dotenv.config({ path });

export default {
  PORT: process.env.PORT || 8080,
  DB: process.env.DB,
  SECRET: process.env.SECRET,
  PERSISTENCE: program.opts().db,
  ENVIROMENT: ENVIROMENT,
  FRONTEND_URL: process.env.FRONTEND_URL,
  MOBILE_URL: process.env.MOBILE_URL,
};
