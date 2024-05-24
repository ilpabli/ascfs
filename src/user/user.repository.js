export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAll() {
    return await this.dao.getAll();
  }

  async createUser(userData) {
    return await this.dao.createUser(userData);
  }
}
