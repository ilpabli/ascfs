import { Server } from "socket.io";
import { Chats } from "../config/factory.js";
import ChatRepository from "./chat.repository.js";

// Función para inicializar el socket.io
export function initSocket(server) {
  const messageController = new ChatRepository(new Chats());
  const io = new Server(server);

  // Eventos de socket.io
  io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado!");
    // Envio los todos los mensajes a los clientes del chat nuevos
    socket.emit("messages", await messageController.allMessage());

    // Escucho los mensajes enviado por el cliente y se los propago a todos
    socket.on("message", async (message) => {
      // Agrego el mensaje a la db de messages
      await messageController.addMessage(message);
      // Propago el evento a todos los clientes conectados
      io.emit("messages", await messageController.allMessage());
    });

    socket.on("sayhello", (data) => {
      socket.broadcast.emit("connected", data);
    });
  });

  return io;
}
