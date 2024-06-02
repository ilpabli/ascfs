import enviroment from "./enviroment.js";
import mongoose from "mongoose";

let Users;
let Tickets;
let Clients;
switch (enviroment.PERSISTENCE.toLowerCase()) {
  case "mongo":
    mongoose.connect(enviroment.DB);
    const { default: UserMongoDAO } = await import(
      "../user/dao/userMongo.dao.js"
    );
    Users = UserMongoDAO;

    const { default: TicketMongoDao } = await import(
      "../ticket/dao/ticketMongo.dao.js"
    );
    Tickets = TicketMongoDao;

    const { default: ClientMongoDao } = await import(
      "../client/dao/clientMongo.dao.js"
    );
    Clients = ClientMongoDao;
    console.log("Configuracion MongoDB Cargada con exito");
    break;

  default:
    console.log("DB Invalida");
    break;
}

export { Users, Tickets, Clients };
