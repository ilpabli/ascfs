import passport from "passport";
import local from "passport-local";
import { Strategy, ExtractJwt } from "passport-jwt";
import UserRepository from "../user/user.repository.js";
import { Users } from "./factory.js";
import enviroment from "./enviroment.js";
import { comparePassword, hashPassword } from "../utils/encript.util.js";

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

const jwtOptions = {
  jwtFromRequest: jwtExtract.fromExtractors([
    jwtExtract.fromAuthHeaderAsBearerToken(),
    cookieExtractor,
  ]),
  secretOrKey: enviroment.SECRET,
};

const incializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "user" },
      async (req, username, password, done) => {
        const { first_name, last_name, img, email, role } = req.body;
        console.log(req.body);
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
    "jwt",
    new jwtStrategy(jwtOptions, async (payload, done) => {
      try {
        const user = await userController.getByUser(payload?.user);
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    })
  );
};

export default incializePassport;
