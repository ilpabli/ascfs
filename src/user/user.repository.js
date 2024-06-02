export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAll() {
    return await this.dao.getAll();
  }

  async getAllFiltered() {
    return await this.dao.getAllFiltered();
  }

  async getAllTechnicians() {
    return await this.dao.getAllTechnicians();
  }

  async createUser(userData) {
    return await this.dao.createUser(userData);
  }

  async getByUser(user) {
    return await this.dao.getByUser(user);
  }

  async updateDate(uid) {
    return await this.dao.updateDate(uid);
  }

  async deleteUser(userData) {
    return await this.dao.deleteUser(userData);
  }

  async updateUser(id, field) {
    return await this.dao.updateUser(id, field);
  }
}
