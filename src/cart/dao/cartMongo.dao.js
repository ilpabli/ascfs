import { cartModel } from "../model/cart.model.js";
import { productModel } from "../../product/model/product.model.js";
import { ticketModel } from "../model/ticket.model.js";
import { userModel } from "../../user/model/user.model.js";
import CustomErrors from "../../utils/customErrors.js";
import { invalidTotalErrorInfo } from "../../utils/info.js";
import Errors from "../../utils/Errors.js";

// Creo la clase Cart Manager y la exporto de forma default
export default class CartMongoDAO {
  constructor() {
    this.model = cartModel;
  }
  // Agrego un carro vacio a mi DB
  async addCart(newCart) {
    newCart.products = [];
    return await this.model.create(newCart);
  }

  // Me traigo un carrito por id desde mi DB
  async getCartById(id) {
    return await this.model
      .findOne({ _id: id })
      .populate("products.product")
      .lean();
  }

  // Agrego a un carrito el id del producto que quiero
  async addToCart(cid, pid, owner) {
    const product = await productModel.findOne({ _id: pid });
    const cart = await this.model.findOne({ _id: cid });
    if (owner === product.owner) {
      CustomErrors.createError(
        "You cant add your products",
        invalidTotalErrorInfo(product.title),
        "You cant add your products",
        Errors.INVALID_TYPE
      );
    }
    const prodFind = await this.model.findOne(
      { _id: cid, "products.product": pid },
      { "products.$": 1 }
    );
    if (prodFind === null) {
      cart.products.push({ product: product, quantity: 1 });
      return cart.save();
    } else {
      return await this.model.findOneAndUpdate(
        { _id: cid, "products.product": pid },
        { $inc: { "products.$.quantity": 1 } },
        { new: true }
      );
    }
  }

  // Agrego a un carrito el id del producto que quiero
  async massiveAddToCart(cid, data) {
    for (let i = 0; i < data.length; i++) {
      const pid = data[i]._id;
      const quantity = parseInt(data[i].quantity) || 1;
      const product = await productModel.findOne({ _id: pid });
      const cart = await this.model.findOne({ _id: cid });
      const prodFind = await this.model.findOne(
        { _id: cid, "products.product": pid },
        { "products.$": 1 }
      );
      if (prodFind === null) {
        cart.products.push({ product: product, quantity: quantity });
        cart.save();
      } else {
        await this.model.findOneAndUpdate(
          { _id: cid, "products.product": pid },
          { $set: { "products.$.quantity": quantity } },
          { new: true }
        );
      }
    }
    return await this.model.findOne({ _id: cid });
  }

  async delProductToCart(cid, pid) {
    return await this.model.findByIdAndUpdate(
      cid,
      {
        $pull: { products: { product: pid } },
      },
      { new: true }
    );
  }

  async updateProductToCart(cid, pid, newValue) {
    return await this.model.findOneAndUpdate(
      { _id: cid, "products.product": pid },
      { $set: { "products.$.quantity": newValue.quantity } },
      { new: true }
    );
  }

  async emptyCart(cid) {
    const cart = await this.model.findOne({ _id: cid });
    cart.products = [];
    return cart.save();
  }

  async purchaseCart(cid) {
    const cart = await this.model
      .findOne({ _id: cid })
      .populate("products.product");
    const code = Math.random().toString(36).substring(2, 8);
    const user = await userModel.findOne({ cart: cid });
    let total = 0;
    for (const item of cart.products) {
      const productId = item.product._id;
      const quantity = item.quantity;
      const product = await productModel.findOne({ _id: productId });
      if (product.stock >= quantity) {
        product.stock -= quantity;
        await product.save();

        total += item.product.price * quantity;

        await this.model.findByIdAndUpdate(
          cid,
          {
            $pull: { products: { product: productId } },
          },
          { new: true }
        );
      }
    }
    await cart.save();
    if (total === 0) {
      CustomErrors.createError(
        "Total invalid",
        invalidTotalErrorInfo(total),
        "Total equals 0, cannot process!",
        Errors.INVALID_TYPE
      );
    }
    const ticket = { code: code, amount: total, purchaser: user.email };
    return await ticketModel.create(ticket);
  }

  async deleteCart(cid) {
    return this.model.deleteOne({ _id: cid });
  }
}
