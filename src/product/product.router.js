import { Router } from "express";
import ProductRepository from "./product.repository.js";
import { Products } from "../config/factory.js";
import {
  middlewarePassportJWT,
  isAdminoPremium,
} from "../middleware/jwt.middleware.js";

const productController = new ProductRepository(new Products());
const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  try {
    let limit = parseInt(req.query.limit) || 10;
    let page = parseInt(req.query.page) || 1;
    let query = req.query;
    let listProducts = await productController.getProducts(limit, page, query);
    res.status(201).send(listProducts);
  } catch (err) {
    res.status(500).send({ err });
  }
});

productsRouter.get("/:pid", async (req, res) => {
  try {
    let idFilter = await productController.getProductById(req.params.pid);
    res.status(201).send(idFilter);
  } catch (err) {
    res.status(500).send({ err });
  }
});

productsRouter.post(
  "/",
  middlewarePassportJWT,
  isAdminoPremium,
  async (req, res) => {
    try {
      if (req.user.role === "premium") {
        const newProduct = await productController.addProduct({
          ...req.body,
          owner: req.user.email,
        });
        req.logger.info("Product Created by premium user");
        res.status(201).send(newProduct);
      } else {
        const newProduct = await productController.addProduct(req.body);
        req.logger.info("Product Created");
        res.status(201).send(newProduct);
      }
    } catch (err) {
      console.log(err.cause);
      req.logger.error("One or more fields missing");
      res.status(400).send({ status: "error", error: err.name });
    }
  }
);

productsRouter.put(
  "/:pid",
  middlewarePassportJWT,
  isAdminoPremium,
  async (req, res) => {
    try {
      const product = await productController.getProductById(req.params.pid);
      if (req.user.role === "admin") {
        const updateProduct = await productController.updateProduct(
          req.params.pid,
          req.body
        );
        req.logger.info("Product Updated");
        res.status(201).send(updateProduct);
      } else if (product.owner === req.user.email) {
        const updateProduct = await productController.updateProduct(
          req.params.pid,
          req.body
        );
        req.logger.info("Product Updated by premium user");
        res.status(201).send(updateProduct);
      } else {
        req.logger.warning("You dont have permissions");
        res.status(403).send("Permission denied");
      }
    } catch (err) {
      res.status(500).send({ err });
    }
  }
);

productsRouter.delete(
  "/:pid",
  middlewarePassportJWT,
  isAdminoPremium,
  async (req, res) => {
    try {
      const product = await productController.getProductById(req.params.pid);
      if (req.user.role === "admin") {
        const deleteProduct = await productController.deleteProduct(
          req.params.pid
        );
        req.logger.warning("Product Deleted");
        res.status(204).send(deleteProduct);
      } else if (product.owner === req.user.email) {
        const deleteProduct = await productController.deleteProduct(
          req.params.pid
        );
        req.logger.warning("Product Deleted by premium user");
        res.status(204).send(deleteProduct);
      } else {
        req.logger.warning("You dont have permissions");
        res.status(403).send("Permission denied");
      }
    } catch (err) {
      res.status(500).send({ err });
    }
  }
);

export { productsRouter };
