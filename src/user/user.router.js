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
  (req, res, next) => {
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
  }
);

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
      const token = generateToken(user);
      return res
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 12 * 60 * 60 * 1000,
        })
        .status(200)
        .json({
          status: "success",
          role: user?.role,
        });
    });
  })(req, res, next);
});

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

usersRouter.put("/:user", middlewarePassportJWT, async (req, res) => {
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

usersRouter.get("/technicians", async (req, res) => {
  const listTechnicians = await userController.getAllTechnicians();

  try {
    res.status(201).send(listTechnicians);
  } catch (err) {
    res.status(500).send({ err });
  }
});

usersRouter.get("/:user", async (req, res) => {
  const listUsers = await userController.getByUser(req.params.user);
  try {
    res.status(201).send(listUsers);
  } catch (err) {
    res.status(500).send({ err });
  }
});

export { usersRouter };
