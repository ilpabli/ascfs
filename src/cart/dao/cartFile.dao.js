import fs from "fs";

export default class CartFileDAO {
  constructor() {
    this.path = "./src/cart/dao/carts.json";
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([]));
      console.log("Cree el archivo vacio");
    }
    this.carts = [];
    this.loadCarts();
  }

  async addCart(newCart) {
    newCart.products = [];
    this.carts.push(newCart);
    await this.saveCarts();
    return newCart;
  }

  async getCartById(id) {
    return this.carts.find((cart) => cart._id === id);
  }

  async addToCart(cid, pid) {}

  async massiveAddToCart(cid, data) {}

  async delProductToCart(cid, pid) {}

  async updateProductToCart(cid, pid, newValue) {}

  async emptyCart(cid) {}

  async purchaseCart(cid) {}

  loadCarts() {
    try {
      const data = fs.readFileSync(this.path, "utf-8");
      this.carts = JSON.parse(data);
    } catch (error) {
      this.carts = [];
    }
  }

  async saveCarts() {
    const jsonData = JSON.stringify(this.carts, null, 2);
    try {
      await fs.promises.writeFile(this.path, jsonData, "utf-8");
    } catch (error) {
      throw new Error("Failed to save carts to filesystem.");
    }
  }
}
