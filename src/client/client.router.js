import { Router } from "express";
import ClientRepository from "./client.repository.js";
import { Clients } from "../config/factory.js";
import {
  generateToken,
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
    let listClients = await clientController.getAll();
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
