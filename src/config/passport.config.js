import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import { Strategy, ExtractJwt } from "passport-jwt";
import UserRepository from "../user/user.repository.js";
import CartRepository from "../cart/cart.repository.js";
import { Users, Carts } from "./factory.js";
import enviroment from "./enviroment.js";
import { comparePassword, hashPassword } from "../utils/encript.util.js";
import { isValidToken } from "../middleware/jwt.middleware.js";

const LocalStrategy = local.Strategy;

const jwtStrategy = Strategy;
const jwtExtract = ExtractJwt;

const cartController = new CartRepository(new Carts());
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
    "github",
    new GitHubStrategy(
      {
        clientID: enviroment.GITID,
        clientSecret: enviroment.GITSECRET,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await userController.getByEmail(profile._json.email);
          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              email: profile._json.email,
              password: "",
              img: profile._json.avatar_url,
            };
            const newCart = await cartController.addCart({});
            user = await userController.createUser(newUser);
            user.cart.push(newCart._id);
            await user.save();
            done(null, user);
          } else {
            const updateDate = await userController.updateDate(user._id);
            done(null, user);
          }
        } catch (error) {
          done(error, false, { message: "Algo fallo en tu login con Github" });
        }
      }
    )
  );
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, img } = req.body;
        try {
          let user = await userController.getByEmail(username);
          if (user) {
            return done(null, false, {
              message: "El usuario ya existe en los registros",
            });
          }
          const newUser = {
            first_name,
            last_name,
            email: username,
            img,
            password: hashPassword(password),
          };
          const newCart = await cartController.addCart({});
          let createUser = await userController.createUser(newUser);
          createUser.cart.push(newCart._id);
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
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userController.getByEmail(username);
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
