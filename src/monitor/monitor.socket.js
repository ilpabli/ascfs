import { Server } from "socket.io";
import enviroment from "../config/enviroment.js";
import TicketRepository from "../ticket/ticket.repository.js";
import { Tickets } from "../config/factory.js";
import { ticketModel } from "../ticket/model/ticket.model.js";

export function initSocket(server) {
  const allowedOrigins = [
    enviroment.FRONTEND_URL,
    enviroment.WEBSOCKET_URL,
  ];
  const ticketController = new TicketRepository(new Tickets())
  const io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
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
