import jwt from "jsonwebtoken";
import passport from "passport";
import enviroment from "../config/enviroment.js";

const privatekey = enviroment.SECRET;
const generateToken = (user) => {
  return jwt.sign(user, privatekey, { expiresIn: "30d" });
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
        return res
          .status(401)
          .clearCookie("token")
          .json({ status: "Unauthorized", message: "Token no valido!" });
      }

      req.user = usr;
      next();
    })(req, res, next);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const authorizeRoles = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userRole = req.user && req.user.role;
      if (allowedRoles.includes(userRole)) {
        next();
      } else {
        throw new Error("Access denied");
      }
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  };
};

export { generateToken, isValidToken, middlewarePassportJWT, authorizeRoles };
