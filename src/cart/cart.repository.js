export default class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  // Agrego un carro vacio a mi DB
  async addCart(newCart) {
    newCart.products = [];
    return await this.dao.addCart(newCart);
  }

  // Me traigo un carrito por id desde mi DB
  async getCartById(id) {
    return await this.dao.getCartById(id);
  }

  // Agrego a un carrito el id del producto que quiero
  async addToCart(cid, pid, owner) {
    return await this.dao.addToCart(cid, pid, owner);
  }

  // Agrego a un carrito el id del producto que quiero
  async massiveAddToCart(cid, data) {
    return await this.dao.massiveAddToCart(cid, data);
  }

  async delProductToCart(cid, pid) {
    return await this.dao.delProductToCart(cid, pid);
  }

  async updateProductToCart(cid, pid, newValue) {
    return await this.dao.updateProductToCart(cid, pid, newValue);
  }

  async emptyCart(cid) {
    return await this.dao.emptyCart(cid);
  }

  async deleteCart(cid) {
    return await this.dao.deleteCart(cid);
  }

  async purchaseCart(cid) {
    return await this.dao.purchaseCart(cid);
  }
}
