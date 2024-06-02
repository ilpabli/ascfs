import passport from "passport";
import local from "passport-local";
import { Strategy, ExtractJwt } from "passport-jwt";
import UserRepository from "../user/user.repository.js";
import { Users } from "./factory.js";
import enviroment from "./enviroment.js";
import { comparePassword, hashPassword } from "../utils/encript.util.js";
import { isValidToken } from "../middleware/jwt.middleware.js";

const LocalStrategy = local.Strategy;

const jwtStrategy = Strategy;
const jwtExtract = ExtractJwt;

const userController = new UserRepository(new Users());

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["token"];
  }
  return token;
};

const incializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "user" },
      async (req, username, password, done) => {
        const { first_name, last_name, img, email, role } = req.body;
        try {
          let user = await userController.getByUser(username);
          if (user) {
            return done(null, false, {
              message: "El usuario ya existe en los registros",
            });
          }
          const newUser = {
            first_name,
            last_name,
            user: username,
            password: hashPassword(password),
            img,
            role,
            email,
          };
          let createUser = await userController.createUser(newUser);
          await createUser.save();
          req.logger.info("User Created");

          return done(null, createUser);
        } catch (error) {
          return done("Error al obtener el usuario: " + error);
        }
      }
    )
  );
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "user" },
      async (username, password, done) => {
        try {
          const user = await userController.getByUser(username);
          if (!user) {
            return done(null, false, { message: "El usuario no existe" });
          }
          if (!comparePassword(user, password)) {
            return done(null, false, {
              message: "Algun dato del usuario es incorrecto",
            });
          }
          const updateDate = await userController.updateDate(user._id);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.use(
    "renewpassword",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
        passwordField: "newpassword",
      },
      async (req, username, newpassword, done) => {
        try {
          const token = req.body.token;
          if (!isValidToken(token)) {
            return done(null, false, {
              message: "El token que tenes asignado es invalido",
            });
          }
          const user = await userController.getByEmail(username);
          if (comparePassword(user, newpassword)) {
            return done(null, false, {
              message: "La password es identica a la anterior",
            });
          } else {
            const updatePw = await userController.updatePassword(
              username,
              hashPassword(newpassword)
            );
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.use(
    "jwt",
    new jwtStrategy(
      {
        jwtFromRequest: jwtExtract.fromExtractors([cookieExtractor]),
        secretOrKey: enviroment.SECRET,
      },
      (payload, done) => {
        done(null, payload);
      }
    ),
    async (payload, done) => {
      try {
        return done(null, payload);
      } catch (error) {
        done(error);
      }
    }
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userController.getById(id);
    done(null, user);
  });
};

export default incializePassport;
