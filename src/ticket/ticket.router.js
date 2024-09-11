import { Router } from "express";
import TicketRepository from "./ticket.repository.js";
import { Tickets } from "../config/factory.js";
import {
  middlewarePassportJWT,
  authorizeRoles,
} from "../middleware/jwt.middleware.js";

const ticketController = new TicketRepository(new Tickets());
const ticketsRouter = Router();

ticketsRouter.post(
  "/",
  middlewarePassportJWT,
  authorizeRoles(["admin", "supervisor", "receptionist"]),
  async (req, res) => {
    try {
      const newTicket = await ticketController.addTicket(req.body, req.user);
      req.logger.info("Ticket Created");
      res.status(201).send(newTicket);
    } catch (err) {
      req.logger.error("One or more fields missing");
      res.status(400).send({ status: "error", error: err.message });
    }
  }
);

ticketsRouter.get("/", middlewarePassportJWT, async (req, res) => {
  try {
    let listTickets = await ticketController.getTicketsFiltered(req.query);
    res.status(201).send(listTickets);
  } catch (err) {
    req.logger.error("Error in get tickets");
    res.status(400).send({ status: "error", error: err.message });
  }
});

ticketsRouter.get("/search", middlewarePassportJWT, async (req, res) => {
  try {
    let searchTickets = await ticketController.getTicketsforSearch(req.body);
    res.status(201).send(searchTickets);
  } catch (err) {
    req.logger.error("Error in get search tickets");
    res.status(400).send({ status: "error", error: err.message });
  }
});

ticketsRouter.get("/:ticket", middlewarePassportJWT, async (req, res) => {
  try {
    let idFilter = await ticketController.getTicketforId(req.params.ticket);
    res.status(201).send(idFilter);
  } catch (err) {
    req.logger.error("Error in get ticket");
    res.status(400).send({ status: "error", error: err.message });
  }
});

ticketsRouter.put(
  "/:ticket",
  middlewarePassportJWT,
  authorizeRoles(["admin", "supervisor", "receptionist"]),
  async (req, res) => {
    try {
      const updateTicket = await ticketController.updateTicket(
        req.params.ticket,
        req.body
      );
      req.logger.info("Ticket Updated");
      res.status(201).send(updateTicket);
    } catch (err) {
      res.status(500).send({ status: "error", error: err.message });
    }
  }
);

ticketsRouter.put(
  "/assign/:ticket",
  middlewarePassportJWT,
  authorizeRoles(["admin", "supervisor"]),
  async (req, res) => {
    try {
      const updateTicket = await ticketController.assignTicket(
        req.params.ticket,
        req.body
      );
      req.logger.info("User Assigned");
      res.status(201).send(updateTicket);
    } catch (err) {
      res.status(500).send({ status: "error", error: err.message });
    }
  }
);

ticketsRouter.put(
  "/working/:ticket",
  middlewarePassportJWT,
  authorizeRoles(["admin", "supervisor", "technician"]),
  async (req, res) => {
    try {
      const workingTicket = await ticketController.workingTicket(
        req.params.ticket,
        req.body,
        req?.user
      );
      req.logger.info("Working Ticket");
      res.status(201).send(workingTicket);
    } catch (err) {
      console.log(err);
      res.status(500).send({ status: "error", error: err.message });
    }
  }
);

ticketsRouter.post(
  "/notes/:ticket",
  middlewarePassportJWT,
  authorizeRoles(["admin", "supervisor", "technician"]),
  async (req, res) => {
    try {
      const addNotes = await ticketController.addNotes(
        req.params.ticket,
        req.body.notes,
        req?.user
      );
      req.logger.info("Note add");
      res.status(201).send(addNotes);
    } catch (err) {
      console.log(err);
      res.status(500).send({ status: "error", error: err.message });
    }
  }
);

ticketsRouter.delete(
  "/:ticket",
  middlewarePassportJWT,
  authorizeRoles(["admin", "supervisor", "receptionist"]),
  async (req, res) => {
    try {
      const deleteTicket = await ticketController.deleteTicket(
        req.params.ticket
      );
      req.logger.warning("Ticket Deleted");
      res.status(204).send(deleteTicket);
    } catch (err) {
      res.status(500).send({ status: "error", error: err.message });
    }
  }
);

export { ticketsRouter };
