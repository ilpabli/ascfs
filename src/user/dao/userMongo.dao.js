import { userModel } from "../model/user.model.js";
import { format } from "date-fns";

export default class UserMongoDAO {
  constructor() {
    this.model = userModel;
  }

  async getAll() {
    return await this.model.find().populate("tickets").lean();
  }

  async getAllFiltered() {
    const list = await this.model.find().populate("tickets").lean();
    const newList = [];
    list.forEach((eLe) => {
      const user = {
        _id: eLe._id,
        full_name: eLe.first_name + " " + eLe.last_name,
        user: eLe.user,
        role: eLe.role,
        last_connection: eLe.last_connection,
        email: eLe.email,
        tickets: eLe.tickets,
      };
      newList.push(user);
    });
    return newList;
  }

  async getAllTechnicians() {
    return await this.model
      .find({ role: "technician" })
      .populate("tickets")
      .lean();
  }

  async createUser(userData) {
    return await this.model.create(userData);
  }

  async getByUser(user) {
    if (!user) {
      throw new Error(`User ${id} not found`);
    }
    return await this.model.findOne({ user: user }).populate("tickets").lean();
  }

  async getById(uid) {
    if (!uid) {
      throw new Error(`User ${uid} not found`);
    }
    return await this.model.findOne({ _id: uid }).populate("tickets").lean();
  }

  async updateDate(uid) {
    const getGMTMinus3Date = () => {
      const date = new Date();
      date.setMinutes(date.getMinutes());
      return format(date, "HH:mm yyyy-MM-dd");
    };

    const gmtMinus3Date = getGMTMinus3Date();

    return await this.model.updateOne(
      { _id: uid },
      { last_connection: gmtMinus3Date }
    );
  }

  async deleteUser(userData) {
    const user = await this.model.findOne({ user: userData });
    if (!user) {
      throw new Error(`User ${id} not found`);
    }
    return this.model.deleteOne({ _id: user._id });
  }

  async updateUser(userData, field) {
    return await this.model.updateOne({ user: userData }, field);
  }
}
