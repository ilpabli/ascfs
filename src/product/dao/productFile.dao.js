import fs from "fs";

export default class ProductFileDAO {
  constructor() {
    this.path = "./src/product/dao/products.json";
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([]));
      console.log("Cree el archivo vacio");
    }
    this.path = this.products = [];
    this.loadProducts();
  }

  async addProduct(product) {
    const newProduct = { ...product, _id: Date.now().toString() };
    this.products.push(newProduct);
    await this.saveProducts();
    return newProduct;
  }

  async getProducts(limit, page, query) {}

  async getProductsforView(limit, page, query) {}

  async getProductsforSocket() {
    return this.products.map((product) => ({ ...product }));
  }

  async getProductById(id) {
    return this.products.find((product) => product._id === id);
  }

  async updateProduct(id, field) {
    const product = this.products.find((product) => product._id === id);
    if (!product) return null;

    Object.assign(product, field);
    await this.saveProducts();
    return product;
  }

  async deleteProduct(id) {
    const index = this.products.findIndex((product) => product._id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      await this.saveProducts();
    }
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, "utf-8");
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = [];
    }
  }

  async saveProducts() {
    const jsonData = JSON.stringify(this.products, null, 2);
    try {
      await fs.promises.writeFile(this.path, jsonData, "utf-8");
    } catch (error) {
      throw new Error("Failed to save products to filesystem.");
    }
  }
}
