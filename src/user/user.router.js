import { Router } from "express";
import UserRepository from "./user.repository.js";
import { Users } from "../config/factory.js";
import passport from "passport";
import {
  generateToken,
  isAdmin,
  middlewarePassportJWT,
} from "../middleware/jwt.middleware.js";

const userController = new UserRepository(new Users());
const usersRouter = Router();

usersRouter.post(
  "/",
  passport.authenticate("register", {
    failureRedirect: "/registerfail",
    failureMessage: false,
    session: false,
  }),
  async (req, res) => {
    res.send(req.user);
  }
);

usersRouter.post(
  "/auth",
  passport.authenticate("login", {
    failureRedirect: "/loginfail",
    session: false,
    failureMessage: false,
  }),
  async (req, res) => {
    const token = generateToken(req.user);
    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 60000,
      })
      .redirect("/products");
  }
);

usersRouter.post("/logout", middlewarePassportJWT, async (req, res) => {
  const updateDate = await userController.updateDate(req.user._id);
  res.clearCookie("token").redirect("/login");
});

usersRouter.delete("/:user", async (req, res) => {
  try {
    const delUser = await userController.deleteUser(req.params.user);
    req.logger.info("User Delete");
    res.status(200).json({ message: "Usuario borrado: " + req.params.user });
  } catch (err) {
    req.logger.error("User not found");
    res.status(400).send({ status: "error", error: err.message });
  }
});

usersRouter.put("/:user", async (req, res) => {
  try {
    const user = await userController.getByUser(req.params.user);
    if (req.user.role === "admin") {
      const updateUser = await userController.updateUser(
        req.params.user,
        req.body
      );
      req.logger.info("User Updated");
      res.status(201).send(updateUser);
    } else if (req.user.user === req.params.user) {
      const updateUser = await userController.updateUser(
        req.params.user,
        req.body
      );
      req.logger.info("Product Updated by owner");
      res.status(201).send(updateUser);
    } else {
      req.logger.warning("You dont have permissions");
      res.status(403).send("Permission denied");
    }
  } catch (err) {
    res.status(500).send({ err });
  }
});

usersRouter.get("/", async (req, res) => {
  const listUsers = await userController.getAllFiltered();
  try {
    res.status(201).send(listUsers);
  } catch (err) {
    res.status(500).send({ err });
  }
});

export { usersRouter };
