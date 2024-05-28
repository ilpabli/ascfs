import { Router } from "express";
import ClientRepository from "./client.repository.js";
import { Clients } from "../config/factory.js";
import passport from "passport";
import {
  generateToken,
  isAdmin,
  middlewarePassportJWT,
} from "../middleware/jwt.middleware.js";

const clientController = new ClientRepository(new Clients());
const clientsRouter = Router();

clientsRouter.post("/", async (req, res) => {
  try {
    const newClient = await clientController.createClient(req.body);
    req.logger.info("Client Created");
    res.status(201).send(newClient);
  } catch (err) {
    req.logger.error("One or more fields missing");
    res.status(400).send({ status: "error", error: err.message });
  }
});

clientsRouter.get("/", async (req, res) => {
  try {
    let limit = parseInt(req.query.limit) || 10;
    let page = parseInt(req.query.page) || 1;
    let query = req.query;
    let listClients = await clientController.getAll(limit, page, query);
    res.status(201).send(listClients);
  } catch (err) {
    res.status(500).send({ err });
  }
});

clientsRouter.get("/:pid", async (req, res) => {
  try {
    let idFilter = await clientController.getByJobNumber(req.params.pid);
    res.status(201).send(idFilter);
  } catch (err) {
    req.logger.error("Job not found");
    res.status(400).send({ status: "error", error: err.message });
  }
});

export { clientsRouter };
