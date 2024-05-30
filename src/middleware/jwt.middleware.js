import jwt from "jsonwebtoken";
import passport from "passport";
import enviroment from "../config/enviroment.js";

const privatekey = enviroment.SECRET;
const generateToken = (user) => {
  return jwt.sign(user, privatekey, { expiresIn: "12h" });
};
const isValidToken = (token) => {
  try {
    jwt.verify(token, privatekey);
    return true;
  } catch (err) {
    return false;
  }
};

const middlewarePassportJWT = async (req, res, next) => {
  try {
    passport.authenticate("jwt", { session: false }, (err, usr, info) => {
      if (err) {
        return next(err);
      }

      if (!usr) {
        return res.redirect("/login");
      }

      req.user = usr;
      next();
    })(req, res, next);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const isAuth = async (req, res, next) => {
  try {
    passport.authenticate("jwt", { session: false }, (err, usr, info) => {
      if (err) {
        return next(err);
      }
      if (usr) {
        return res.redirect("/");
      }
      next();
    })(req, res, next);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const isAdminoPremium = async (req, res, next) => {
  try {
    const userRole = req.user && req.user.role;
    if (userRole === "admin" || userRole === "premium") {
      next();
    } else {
      throw new Error("Acceso denegado. Debes ser administrador.");
    }
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const userRole = req.user && req.user.role;
    if (userRole === "admin") {
      next();
    } else {
      throw new Error("Acceso denegado. Debes ser administrador.");
    }
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

export {
  generateToken,
  isValidToken,
  middlewarePassportJWT,
  isAuth,
  isAdmin,
  isAdminoPremium,
};
