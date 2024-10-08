import { Router } from "express";
import UserRepository from "./user.repository.js";
import { Users } from "../config/factory.js";
import passport from "passport";
import UserDTO from "./dto/user.dto.js";
import {
  generateToken,
  middlewarePassportJWT,
  authorizeRoles,
} from "../middleware/jwt.middleware.js";

const userController = new UserRepository(new Users());
const usersRouter = Router();

usersRouter.post("/", authorizeRoles(["admin"]), (req, res, next) => {
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
        img: user?.img,
        first_name: user?.first_name,
        last_name: user?.last_name,
      };
      const token = generateToken(userToken);
      return res
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
          path: "/",
          sameSite: "lax",
          secure: true,
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

usersRouter.post("/changepassword", middlewarePassportJWT, async (req, res) => {
  try {
    const updatePW = await userController.updatePassword(req.user, req.body);
    req.logger.info("Password Updated");
    res.status(200).json({
      message:
        "Password Actualizada con exito para el usuario " + req.user.user,
    });
  } catch (err) {
    res.status(500).send({ status: "error", error: err.message });
  }
});

usersRouter.post(
  "/resetpassword",
  middlewarePassportJWT,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      const refreshPassword = await userController.resetPassword(req.body.user);
      req.logger.info("Password Reset");
      res.status(200).json({
        message: "Password resteada con exito para el usuario " + req.body.user,
      });
    } catch (err) {
      res.status(500).send({ status: "error", error: err.message });
    }
  }
);

usersRouter.get(
  "/",
  middlewarePassportJWT,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      let limit = parseInt(req.query.limit) || 10;
      let page = parseInt(req.query.page) || 1;
      let query = req.query;
      const listUsers = await userController.getAllFiltered(limit, page, query);
      res.status(201).send(listUsers);
    } catch (err) {
      res.status(500).send({ status: "error", error: err.message });
    }
  }
);

usersRouter.get("/tickets", middlewarePassportJWT, async (req, res) => {
  try {
    const { user } = req.user;
    const tickets4Usr = await userController.getTicketsForUser(user);
    res.status(201).send(tickets4Usr.tickets);
  } catch (err) {
    res.status(500).send({ status: "error", error: err.message });
  }
});

usersRouter.get(
  "/technicians",
  middlewarePassportJWT,
  authorizeRoles(["admin", "supervisor"]),
  async (req, res) => {
    try {
      const listTechnicians = await userController.getAllTechnicians(req.query);
      res.status(201).send(listTechnicians);
    } catch (err) {
      res.status(500).send({ err });
    }
  }
);

usersRouter.get("/current", middlewarePassportJWT, async (req, res) => {
  try {
    const userDTO = UserDTO.fromUser(req.user);
    res.status(201).send(userDTO);
  } catch (err) {
    res.status(500).send({ status: "error", error: err.message });
  }
});

usersRouter.post("/logout", middlewarePassportJWT, async (req, res) => {
  const updateDate = await userController.updateDate(req.user._id);
  res
    .clearCookie("token")
    .send({ status: "success", message: "Usuario desconectado" });
});

usersRouter.get(
  "/:user",
  middlewarePassportJWT,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      const user = await userController.getByUser(req.params.user);
      const userDTO = UserDTO.fromUser(user);
      res.status(201).send(userDTO);
    } catch (err) {
      res.status(500).send({ status: "error", error: err.message });
    }
  }
);

usersRouter.delete(
  "/:user",
  middlewarePassportJWT,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      const delUser = await userController.deleteUser(req.params.user);
      req.logger.info("User Delete");
      res.status(200).json({
        status: "success",
        message: "Usuario borrado: " + req.params.user,
      });
    } catch (err) {
      req.logger.error("User not found");
      res.status(400).send({ status: "error", error: err.message });
    }
  }
);

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

usersRouter.put(
  "/:user",
  middlewarePassportJWT,
  authorizeRoles(["admin", "supervisor"]),
  async (req, res) => {
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
  }
);

export { usersRouter };
