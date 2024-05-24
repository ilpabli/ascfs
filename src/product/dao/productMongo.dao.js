import { productModel } from "../model/product.model.js";
import MailingService from "../../mailing/mailing.service.js";

// Creo la clase Product Manager y la exporto de forma default
export default class ProductMongoDAO {
  constructor() {
    this.model = productModel;
    this.mailingService = new MailingService();
  }

  // Agrego products a mi DB
  async addProduct(product) {
    return await this.model.create(product);
  }

  // Busco en la DB todos los products y los devuelvo
  async getProducts(limit, page, query) {
    let options = { limit, page };
    let filter = {};
    if (query?.category) {
      filter.category = query.category;
    }
    if (query?.status) {
      filter.status = query.status;
      filter.stock = { $gt: 0 };
    }
    if (query?.sort) {
      options.sort = { price: query.sort };
    }
    return await this.model.find(filter, options);
  }

  async getProductsforView(limit, page, query) {
    let options = { lean: true, limit, page };
    let filter = {};
    if (query?.category) {
      filter.category = query.category;
    }
    if (query?.status) {
      filter.status = query.status;
      filter.stock = { $gt: 0 };
    }
    if (query?.sort) {
      options.sort = { price: query.sort };
    }
    return await this.model.paginate(filter, options);
  }

  async getProductsforSocket() {
    return await this.model.find().lean();
  }

  // Busco producto por ID
  async getProductById(id) {
    return await this.model.findOne({ _id: id }).lean();
  }

  // Actualizo un producto por ID
  async updateProduct(id, field) {
    return await this.model.updateOne({ _id: id }, field);
  }

  // Borro de la DB un ID
  async deleteProduct(id) {
    const product = await this.model.findOne({ _id: id }).lean();
    if (product.owner !== "admin") {
      const mailOptions = {
        from: "Delete Product <gonzalez.e.pablo@gmail.com>",
        to: product.owner,
        subject: "Se ha eliminado un producto de la base de datos",
        html: `Te damos aviso que el producto ${product.title} ha sido borrado de la DB.`,
      };
      this.mailingService.sendMail(mailOptions);
    }
    return this.model.deleteOne({ _id: id });
  }
}
