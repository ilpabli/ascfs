import { Router } from "express";
import passport from "passport";
import { generateToken } from "../middleware/jwt.middleware.js";

const githubRouter = Router();

githubRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

githubRouter.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/loginfail",
    session: false,
    failureMessage: false,
  }),
  (req, res) => {
    const token = generateToken(req.user);
    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 60000,
      })
      .redirect("/products");
  }
);

export { githubRouter };
