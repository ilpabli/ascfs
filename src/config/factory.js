import enviroment from "./enviroment.js";
import mongoose from "mongoose";

let Users;
let Products;
let Carts;
let Chats;
switch (enviroment.PERSISTENCE.toLowerCase()) {
  case "mongo":
    mongoose.connect(enviroment.DB);
    const { default: UserMongoDAO } = await import(
      "../user/dao/userMongo.dao.js"
    );
    Users = UserMongoDAO;
    const { default: ProductMongoDao } = await import(
      "../product/dao/productMongo.dao.js"
    );
    Products = ProductMongoDao;

    const { default: CartMongoDAO } = await import(
      "../cart/dao/cartMongo.dao.js"
    );
    Carts = CartMongoDAO;

    const { default: ChatMongoDAO } = await import(
      "../chat/dao/chatMongo.dao.js"
    );
    Chats = ChatMongoDAO;
    console.log("Configuracion MongoDB Cargada con exito");
    break;

  default:
    console.log("DB Invalida");
    break;
}

export { Users, Products, Carts, Chats };
