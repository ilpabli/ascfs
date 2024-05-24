// Importo la libreria FS
import fs from "fs";

// Creo la clase Cart Manager y la exporto de forma default
export default class CartManager {
  #id = 0;
  constructor() {
    // Uso this.path para definir la ruta del archivo
    this.path = "./src/dao/carts.json";
    if (!fs.existsSync(this.path)) {
      // si no existe el file lo escribo con un array vacio
      fs.writeFileSync(this.path, JSON.stringify([]));
      console.log("Cree el archivo vacio");
    }
  }
  // Metodo para agregar carritos vacios
  async addCart() {
    try {
      // Me traigo mi array desde el file y lo guardo en una constante
      const totalCarts = await this.getCarts();
      const cart = {
        products: [],
      };
      // Si tengo ya carritos, empiezo a sumar desde el ultimo id que tengo cargado en el file
      if (totalCarts.length > 0) {
        this.#id = totalCarts[totalCarts.length - 1].id;
      }
      // Le agrego un id al carrito
      cart.id = this.#getId();
      // Lo pusheo al array
      totalCarts.push(cart);
      // Escribo de nuevo el archivo del array en mi json
      await fs.promises.writeFile(this.path, JSON.stringify(totalCarts));
      return cart;
    } catch (err) {
      // Si hay error imprimo el error en consola
      console.log("No puedo agregar el carrito");
    }
  }

  #getId() {
    this.#id++;
    return this.#id;
  }

  // Metodo para traer todos los carts de mi archivo.json
  async getCarts() {
    try {
      const totalCarts = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(totalCarts);
    } catch (err) {
      console.log("No puedo darte los carritos");
    }
  }

  // Metodo para filtrar carritos por id
  async getCartById(id) {
    try {
      const totalCarts = await this.getCarts();
      // Chequeo que el id exista en el array
      const findId = totalCarts.findIndex((eLe) => eLe.id === id);
      if (findId === -1) {
        console.log("ID Not Found!!!");
        return;
      } else {
        console.log("ID Cart Found!!!");
        console.log(totalCarts[findId].products);
        // retorno el contenido de products del carrito encontrado para imprimir en express
        return totalCarts[findId].products;
      }
    } catch (err) {
      console.log("No puedo darte el ID");
    }
  }

  async addToCart(cid, pid) {
    try {
      const totalCarts = await this.getCarts();
      // Chequeo que el id exista en el array
      const findId = totalCarts.findIndex((eLe) => eLe.id === parseInt(cid));
      if (findId === -1) {
        console.log("Cart ID Not Found!!!");
        return "Cart ID Not Found";
      }
      // Me guardo en una constante el objeto que quiero modificar
      const addprod = totalCarts[findId];
      // Si el array de productos de mi carrito esta vacio imprimo el primer producto
      if (addprod.products.length === 0) {
        addprod.products = [{ product: parseInt(pid), quantity: 1 }];
        // Entonces reviso si el producto esta o no en el carrito, dependiendo eso agrego un quantity mas o pusheo el producto nuevo al array
      } else {
        const findProduct = addprod.products.findIndex(
          (eLe) => eLe.product === parseInt(pid)
        );
        if (findProduct === -1) {
          addprod.products.push({ product: parseInt(pid), quantity: 1 });
        } else {
          addprod.products[findProduct].quantity++;
        }
      }
      // Escribo de nuevo el archivo del array en mi json
      await fs.promises.writeFile(this.path, JSON.stringify(totalCarts));
      return addprod.products;
    } catch (err) {
      // Si hay error imprimo el error en consola
      console.log("No puedo agregar el carrito");
    }
  }
}
