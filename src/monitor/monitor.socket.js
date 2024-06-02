import { Server } from "socket.io";
import TicketRepository from "../ticket/ticket.repository.js";
import { Tickets } from "../config/factory.js";
import { ticketModel } from "../ticket/model/ticket.model.js";

export function initSocket(server) {
  const ticketController = new TicketRepository(new Tickets())
  const io = new Server(server, {
    cors: {
      origin: "http://127.0.0.1:3000",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });
 const changeStream = ticketModel.watch();
 changeStream.on('change', async () => {
   io.emit('db-update', await ticketController.getTicketsforSocket());
 });
  io.on("connection", async (socket) => {
    console.log("Nuevo espectador conectado!");
    socket.emit("tickets", await ticketController.getTicketsforSocket());

    socket.on('disconnect', () => {
      console.log("Se ha desconectado un espectador!");
    });
  });
  return io;
}
