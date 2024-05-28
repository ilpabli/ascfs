import { userModel } from "../model/user.model.js";

export default class UserMongoDAO {
  constructor() {
    this.model = userModel;
  }

  async getAll() {
    return await this.model.find().lean();
  }

  async getAllFiltered() {
    const list = await this.model.find();
    const newList = [];
    list.forEach((eLe) => {
      const user = {
        full_name: eLe.first_name + " " + eLe.last_name,
        user: eLe.user,
        role: eLe.role,
        last_connection: eLe.last_connection,
      };
      newList.push(user);
    });
    return newList;
  }

  async createUser(userData) {
    return await this.model.create(userData);
  }

  async getByUser(user) {
    return await this.model.findOne({ user: user }).populate("tickets").lean();
  }

  async updateDate(uid) {
    const getGMTMinus3Date = () => {
      const date = new Date();
      const gmtMinus3Offset = -3 * 60;
      date.setMinutes(date.getMinutes() + gmtMinus3Offset);
      return date;
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
