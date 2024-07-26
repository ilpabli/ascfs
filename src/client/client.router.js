import { Router } from "express";
import ClientRepository from "./client.repository.js";
import { Clients } from "../config/factory.js";
import { middlewarePassportJWT } from "../middleware/jwt.middleware.js";

const clientController = new ClientRepository(new Clients());
const clientsRouter = Router();

clientsRouter.post("/", middlewarePassportJWT, async (req, res) => {
  try {
    const newClient = await clientController.createClient(req.body);
    req.logger.info("Client Created");
    res.status(201).send(newClient);
  } catch (err) {
    req.logger.error("One or more fields missing");
    res.status(400).send({ status: "error", error: err.message });
  }
});

clientsRouter.get("/", middlewarePassportJWT, async (req, res) => {
  try {
    let limit = parseInt(req.query.limit) || 10;
    let page = parseInt(req.query.page);
    let query = req.query;
    let listClients = await clientController.getAllFiltered(limit, page, query);
    res.status(201).send(listClients);
  } catch (err) {
    res.status(500).send({ status: "error", error: err.message });
  }
});

clientsRouter.get("/:cid", middlewarePassportJWT, async (req, res) => {
  try {
    let idFilter = await clientController.getByJobNumber(req.params.cid);
    res.status(201).send(idFilter);
  } catch (err) {
    req.logger.error("Job not found");
    res.status(400).send({ status: "error", error: err.message });
  }
});

clientsRouter.delete("/:cid", middlewarePassportJWT, async (req, res) => {
  try {
    let client = await clientController.deleteClient(req.params.cid);
    res.status(201).send({ status: "success", message: "Client Delete" });
  } catch (err) {
    req.logger.error("Job not found");
    res.status(400).send({ status: "error", error: err.message });
  }
});

clientsRouter.put("/:client", middlewarePassportJWT, async (req, res) => {
  try {
    const updateClient = await clientController.updateClient(
      req.params.client,
      req.body
    );
    req.logger.info("Client Updated");
    res.status(201).send(updateClient);
  } catch (err) {
    res.status(500).send({ status: "error", error: err.message });
  }
});

export { clientsRouter };
