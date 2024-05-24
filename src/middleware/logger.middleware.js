import winston from "winston";
import enviroment from "../config/enviroment.js";

const customLevels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5,
};

const customColors = {
  fatal: "red",
  error: "red",
  warning: "yellow",
  info: "green",
  http: "cyan",
  debug: "blue",
};

let logger = winston.createLogger({
  levels: customLevels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize({ colors: customColors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: "errors.log", level: "error" }),
  ],
});

if (enviroment.ENVIROMENT === "production") {
  logger = winston.createLogger({
    levels: customLevels,
    transports: [
      new winston.transports.Console({
        level: "info",
        format: winston.format.combine(
          winston.format.colorize({ colors: customColors }),
          winston.format.simple()
        ),
      }),
      new winston.transports.File({ filename: "errors.log", level: "error" }),
    ],
  });
}

export const loggerMiddleware = (req, res, next) => {
  req.logger = logger;
  logger.http(
    `${req.method} - ${req.url} - [${req.ip}] - ${req.get(
      "user-agent"
    )} - ${new Date().toISOString()}`
  );
  next();
};
