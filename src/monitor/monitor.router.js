import { Router } from "express";

// Instanciamos el router
const monitorRouter = Router();

// Definimos la ruta para el home
monitorRouter.get("/", (req, res) => {
  // Renderizo la vista del CHAT
  res.render("chat");
});

// Exportamos el router
export { monitorRouter };
