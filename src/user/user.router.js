import { Router } from "express";
import UserRepository from "./user.repository.js";
import { Users } from "../config/factory.js";
import passport from "passport";
import UserDTO from "./dto/user.dto.js";
import {
  generateToken,
  middlewarePassportJWT,
} from "../middleware/jwt.middleware.js";

const userController = new UserRepository(new Users());
const usersRouter = Router();

usersRouter.post("/", (req, res, next) => {
  passport.authenticate("register", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: info.message });
    }
    req.logIn(user, { session: false }, (err) => {
      if (err) {
        return next(err);
      }
      res.send(user);
    });
  })(req, res, next);
});

usersRouter.post("/auth", (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: info.message });
    }
    req.logIn(user, { session: false }, (err) => {
      if (err) {
        return next(err);
      }
      const userToken = {
        role: user?.role,
        user: user?.user,
      };
      const token = generateToken(userToken);
      return res
        .cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge: 30 * 24 * 60 * 60 * 1000,
          path: "/",
          domain: ".railway.app",
        })
        .status(200)
        .json({
          status: "success",
          user: userToken,
          token: token,
        });
    });
  })(req, res, next);
});

usersRouter.get("/", middlewarePassportJWT, async (req, res) => {
  try {
    const listUsers = await userController.getAllFiltered();
    res.status(201).send(listUsers);
  } catch (err) {
    res.status(500).send({ status: "error", error: err.message });
  }
});

usersRouter.get("/tickets", middlewarePassportJWT, async (req, res) => {
  try {
    const { user } = req.user;
    const tickets4Usr = await userController.getTicketsForUser(user);
    res.status(201).send(tickets4Usr.tickets);
  } catch (err) {
    res.status(500).send({ status: "error", error: err.message });
  }
});

usersRouter.get("/technicians", middlewarePassportJWT, async (req, res) => {
  try {
    const listTechnicians = await userController.getAllTechnicians(req.query);
    res.status(201).send(listTechnicians);
  } catch (err) {
    res.status(500).send({ err });
  }
});

usersRouter.get("/:user", middlewarePassportJWT, async (req, res) => {
  try {
    const user = await userController.getByUser(req.params.user);
    const userDTO = UserDTO.fromUser(user);
    res.status(201).send(userDTO);
  } catch (err) {
    res.status(500).send({ status: "error", error: err.message });
  }
});

usersRouter.delete("/:user", middlewarePassportJWT, async (req, res) => {
  try {
    const delUser = await userController.deleteUser(req.params.user);
    req.logger.info("User Delete");
    res.status(200).json({ message: "Usuario borrado: " + req.params.user });
  } catch (err) {
    req.logger.error("User not found");
    res.status(400).send({ status: "error", error: err.message });
  }
});

usersRouter.put("/:user/location", middlewarePassportJWT, async (req, res) => {
  try {
    if (req.params.user !== req.user.user) {
      throw new Error(
        "El usuario que intentas actualizar no es igual al de tu token"
      );
    }
    const updateUser = await userController.updateLocation(
      req.params.user,
      req.body
    );
    req.logger.info("Location Updated");
    res.status(201).send(updateUser);
  } catch (err) {
    res.status(500).send({ status: "error", error: err.message });
  }
});

usersRouter.put("/:user", middlewarePassportJWT, async (req, res) => {
  try {
    const updateUser = await userController.updateUser(
      req.params.user,
      req.body
    );
    req.logger.info("User Updated");
    res.status(201).send(updateUser);
  } catch (err) {
    res.status(500).send({ status: "error", error: err.message });
  }
});

export { usersRouter };
