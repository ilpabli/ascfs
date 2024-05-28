import { Router } from "express";
import TicketRepository from "./ticket.repository.js";
import { Tickets } from "../config/factory.js";
import {
  middlewarePassportJWT,
  isAdminoPremium,
} from "../middleware/jwt.middleware.js";

const ticketController = new TicketRepository(new Tickets());
const ticketsRouter = Router();

ticketsRouter.post("/", async (req, res) => {
  try {
    const newTicket = await ticketController.addTicket(req.body);
    req.logger.info("Ticket Created");
    res.status(201).send(newTicket);
  } catch (err) {
    req.logger.error("One or more fields missing");
    res.status(400).send({ status: "error", error: err.message });
  }
});

ticketsRouter.get("/", async (req, res) => {
  try {
    let limit = parseInt(req.query.limit) || 10;
    let page = parseInt(req.query.page) || 1;
    let query = req.query;
    let listTickets = await ticketController.getTickets(limit, page, query);
    res.status(201).send(listTickets);
  } catch (err) {
    req.logger.error("Error in get tickets");
    res.status(400).send({ status: "error", error: err.message });
  }
});

ticketsRouter.get("/:ticket", async (req, res) => {
  try {
    let idFilter = await ticketController.getTicketforId(req.params.ticket);
    res.status(201).send(idFilter);
  } catch (err) {
    req.logger.error("Error in get ticket");
    res.status(400).send({ status: "error", error: err.message });
  }
});

ticketsRouter.put("/:ticket", async (req, res) => {
  try {
    const product = await ticketController.getTicketforId(req.params.ticket);
    if (req.user.role === "admin") {
      const updateTicket = await ticketController.updateTicket(
        req.params.ticket,
        req.body
      );
      req.logger.info("Ticket Updated");
      res.status(201).send(updateTicket);
    } else if (product.owner === req.user.email) {
      const updateTicket = await ticketController.updateProduct(
        req.params.ticket,
        req.body
      );
      req.logger.info("Product Updated by premium user");
      res.status(201).send(updateTicket);
    } else {
      req.logger.warning("You dont have permissions");
      res.status(403).send("Permission denied");
    }
  } catch (err) {
    res.status(500).send({ err });
  }
});

ticketsRouter.delete("/:ticket", async (req, res) => {
  try {
    const product = await ticketController.getTicketforId(req.params.ticket);
    if (req.user.role === "admin") {
      const deleteTicket = await ticketController.deleteProduct(
        req.params.ticket
      );
      req.logger.warning("Ticket Deleted");
      res.status(204).send(deleteTicket);
    } else if (req.user.role === "supervisor") {
      const deleteTicket = await ticketController.deleteProduct(
        req.params.ticket
      );
      req.logger.warning("Ticket Deleted");
      res.status(204).send(deleteTicket);
    } else {
      req.logger.warning("You dont have permissions");
      res.status(403).send("Permission denied");
    }
  } catch (err) {
    res.status(500).send({ err });
  }
});

export { ticketsRouter };
