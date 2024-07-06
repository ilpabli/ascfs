import { Router } from "express";

// Instanciamos el router
const monitorRouter = Router();

// Definimos la ruta para el home
monitorRouter.get("/", (req, res) => {});

// Exportamos el router
export { monitorRouter };
