import { Router } from "express";

// Instanciamos el router
const chatRouter = Router();

// Definimos la ruta para el home
chatRouter.get("/", (req, res) => {
  // Renderizo la vista del CHAT
  res.render("chat");
});

// Exportamos el router
export { chatRouter };
