// Importo la libreria FS
import fs from "fs";

// Creo la clase Product Manager y la exporto de forma default
export default class ProductManager {
  #id = 0;
  constructor() {
    // Uso this.path para definir la ruta del archivo
    this.path = "./src/dao/products.json";
    if (!fs.existsSync(this.path)) {
      // si no existe el file lo escribo con un array vacio
      fs.writeFileSync(this.path, JSON.stringify([]));
      console.log("Cree el archivo vacio");
    }
  }
  // Metodo para agregar productos
  async addProduct({
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  }) {
    try {
      // Me traigo mi array desde el file y lo guardo en una constante
      const totalProducts = await this.getProducts();
      // Creo una funcion para revisar si el campo esta vacio o es undefined
      function isEmpty(str) {
        return !str || str.length === 0;
      }
      // Reviso si esta repetido el code del producto
      let codeRepeat = totalProducts.filter((product) => product.code === code);
      if (codeRepeat.length > 0) {
        console.log("El code ingresado ya existe");
        return "El code ingresado ya existe";
      } else if (
        isEmpty(title) ||
        isEmpty(description) ||
        isEmpty(code) ||
        isEmpty(price) ||
        isEmpty(status) ||
        isEmpty(stock) ||
        isEmpty(category)
      ) {
        console.log("Te falta completar un campo");
        return "Te falta completar un campo";
      }
      const product = {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
      };
      // Si tengo ya productos, empiezo a sumar desde el ultimo id que tengo cargado en el file
      if (totalProducts.length > 0) {
        this.#id = totalProducts[totalProducts.length - 1]._id;
      }
      // Le agrego un id al product
      product.id = this.#getId();
      // Defino que status es true por defecto
      product.status = true;
      // Si no se define el thumnails le asigno un array vacio
      if (product.thumbnails == undefined) {
        product.thumbnails = [];
      }
      // Lo pusheo al array
      totalProducts.push(product);
      // Escribo de nuevo el archivo del array en mi json
      await fs.promises.writeFile(this.path, JSON.stringify(totalProducts));
      return product;
    } catch (err) {
      // Si hay error imprimo el error en consola
      console.log("No puedo agregar productos");
    }
  }

  #getId() {
    this.#id++;
    return this.#id;
  }

  // Metodo para traer todos los products de mi archivo.json
  async getProducts() {
    try {
      const totalProducts = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(totalProducts);
    } catch (err) {
      console.log("No puedo darte los productos");
    }
  }

  // Metodo para filtar productos por ID
  async getProductById(id) {
    try {
      const totalProducts = await this.getProducts();
      // Chequeo que el id exista en el array
      const findId = totalProducts.findIndex((eLe) => eLe.id === id);
      if (findId === -1) {
        console.log("ID Not Found!!!");
        return;
      } else {
        console.log("Found ID!!!");
        console.log(totalProducts[findId]);
        // retorno el ip encontrado para imprimir en express
        return totalProducts[findId];
      }
    } catch (err) {
      console.log("No puedo darte el ID");
    }
  }

  // Metodo para actualizar productos por id y definiendo las propiedades.
  async updateProduct(id, field) {
    try {
      // Me traigo mi array desde el file y lo guardo en una constante
      const totalProducts = await this.getProducts();
      // Chequeo que el id exista en el array
      const findId = totalProducts.findIndex((eLe) => eLe.id === id);
      if (findId === -1) {
        console.log("ID Not Found!!!");
        return;
      }
      // Me guardo en una constante el objeto que quiero modificar
      const product = totalProducts[findId];
      // Me guardo en una constante las propiedades que quiero modificar
      const fieldKeys = Object.keys(field);
      // Recorro el array con las propiedades que quiero modificar
      for (let i = 0; i < fieldKeys.length; i++) {
        const key = fieldKeys[i];
        // Si quiereren modificar el ID lo deniego, si esta todo ok imprimo el nuevo valor en la propiedad que corresponda
        if (key === "id") {
          console.log("Modifying the id is not allowed");
          return;
        } else if (product.hasOwnProperty(key)) {
          product[key] = field[key];
        }
      }
      console.log("Product update:", product);
      // Escribo de nuevo el archivo del array en mi json
      await fs.promises.writeFile(this.path, JSON.stringify(totalProducts));
      // Retorno el producto actualizado para mostrarlo
      return product;
    } catch (err) {
      // Si hay error imprimo el error en consola
      console.log("No puedo actualizar el producto");
    }
  }

  async deleteProduct(id) {
    try {
      // Me traigo mi array desde el file y lo guardo en una constante
      const totalProducts = await this.getProducts();
      // Chequeo que el id exista en el array
      const findId = totalProducts.findIndex((eLe) => eLe.id === id);
      if (findId === -1) {
        console.log("ID Not Found!!!");
        return;
      }
      // Imprimo un mensaje con el objeto borrado y con el motodo splice lo saco del array.
      console.log("Product delete:", totalProducts[findId]);
      totalProducts.splice(findId, 1);
      // Escribo de nuevo el archivo del array en mi json
      await fs.promises.writeFile(this.path, JSON.stringify(totalProducts));
      return `Product Delete`;
    } catch (err) {
      // Si hay error imprimo el error en consola
      console.log("No puedo borrar el producto");
    }
  }
}
