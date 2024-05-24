import { Router } from "express";
import ProductRepository from "../product/product.repository.js";
import CartRepository from "../cart/cart.repository.js";
import UserRepository from "../user/user.repository.js";
import { Products, Carts, Users } from "../config/factory.js";
import {
  middlewarePassportJWT,
  isAuth,
  isValidToken,
} from "../middleware/jwt.middleware.js";
import { updateUser } from "../user/middleware/dto.middleware.js";

const productController = new ProductRepository(new Products());
const cartController = new CartRepository(new Carts());
const userController = new UserRepository(new Users());
const viewsRouter = Router();

viewsRouter.get(
  "/products",
  middlewarePassportJWT,
  updateUser,
  async (req, res) => {
    try {
      const user = req.user;
      let limit = parseInt(req.query.limit) || 10;
      let page = parseInt(req.query.page) || 1;
      let query = req.query;
      const listProducts = await productController.getProductsforView(
        limit,
        page,
        query
      );
      res.status(201).render("home", {
        listProducts,
        user,
        idcart: user.cart[0]._id,
        admin: user.role === "admin",
        premium: user.role === "premium",
        title: "Lista de productos",
      });
    } catch (err) {
      res.status(500).send({ err });
    }
  }
);

viewsRouter.get(
  "/products/:pid",
  middlewarePassportJWT,
  updateUser,
  async (req, res) => {
    try {
      const user = req.user;
      let pid = req.params.pid;
      const product = await productController.getProductById(pid);
      res.status(201).render("productbyid", {
        product,
        user,
        idcart: user.cart[0]._id,
        admin: user.role === "admin",
        premium: user.role === "premium",
        title: product.title,
      });
    } catch (err) {
      // si hay un error lo envio
      res.status(500).send({ err });
    }
  }
);

viewsRouter.get(
  "/carts/:cid",
  middlewarePassportJWT,
  updateUser,
  async (req, res) => {
    try {
      const user = req.user;
      let cid = req.params.cid;
      const cart = await cartController.getCartById(cid);
      res.status(201).render("cartbyid", {
        cart,
        user,
        idcart: user.cart[0]._id,
        admin: user.role === "admin",
        premium: user.role === "premium",
        title: "Carrito ID: " + cid,
      });
    } catch (err) {
      res.status(500).send({ err });
    }
  }
);

viewsRouter.get("/", middlewarePassportJWT, updateUser, (req, res) => {
  const user = req.user;
  res.render("index", {
    title: "Perfil de Usuario",
    user,
    idcart: user.cart[0]._id,
    admin: user.role === "admin",
    premium: user.role === "premium",
  });
});

viewsRouter.get(
  "/admin",
  middlewarePassportJWT,
  updateUser,
  async (req, res) => {
    try {
      const user = req.user;
      let limit = parseInt(req.query.limit) || 10;
      let page = parseInt(req.query.page) || 1;
      let query = req.query;
      const listProducts = await productController.getProductsforView(
        limit,
        page,
        query
      );
      res.status(201).render("admin", {
        listProducts,
        user,
        idcart: user.cart[0]._id,
        admin: user.role === "admin",
        premium: user.role === "premium",
        title: "Panel de administracion",
      });
    } catch (err) {
      res.status(500).send({ err });
    }
  }
);

viewsRouter.get(
  "/admin/users",
  middlewarePassportJWT,
  updateUser,
  async (req, res) => {
    try {
      const user = req.user;
      const listUsers = await userController.getAll();
      res.status(201).render("admin_users", {
        listUsers,
        user,
        idcart: user.cart[0]._id,
        admin: user.role === "admin",
        premium: user.role === "premium",
        title: "Panel de administracion de usuarios",
      });
    } catch (err) {
      res.status(500).send({ err });
    }
  }
);

viewsRouter.get("/register", isAuth, (req, res) => {
  res.render("register", {
    title: "Registrar Nuevo Usuario",
  });
});

viewsRouter.get("/registerfail", (req, res) => {
  res.render("error", {
    title: "Falla en el registro!",
    error: "Algo ocurrio durante el registro!",
    return: "/register",
  });
});

viewsRouter.get("/login", isAuth, (req, res) => {
  res.render("login", {
    title: "Inicio de Sesión",
  });
});

viewsRouter.get("/loginfail", (req, res) => {
  res.render("error", {
    title: "Falla en el login!",
    error: "Revisas los datos de logeo",
    return: "/login",
  });
});

viewsRouter.get("/requestpassword", isAuth, (req, res) => {
  res.render("requestpassword", {
    title: "Requerir modificar Contraseña",
  });
});

viewsRouter.get("/renewpassword", isAuth, async (req, res) => {
  const { token, email } = req.query;
  if (isValidToken(token)) {
    res.render("renewpassword", {
      title: "Nueva Contraseña",
      email,
      token,
    });
  } else {
    res.redirect("/requestpassword");
  }
});

viewsRouter.get("/renewfail", (req, res) => {
  res.render("error", {
    title: "Falla en el cambio de password!",
    error: "Seguramente tu password es igual a la anterior, intenta con otra.",
    return: "/",
  });
});

export { viewsRouter };
