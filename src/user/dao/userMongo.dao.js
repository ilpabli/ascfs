import { userModel } from "../model/user.model.js";

export default class UserMongoDAO {
  constructor() {
    this.model = userModel;
  }

  async getAll() {
    return await this.model.find().lean();
  }

  async createUser(userData) {
    return await this.model.create(userData);
  }
}
