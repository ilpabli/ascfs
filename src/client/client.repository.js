export default class ClientRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAll() {
    return await this.dao.getAll();
  }

  async createClient(clientData) {
    return await this.dao.createClient(clientData);
  }

  async getByJobNumber(jobNumber) {
    return await this.dao.getByJobNumber(jobNumber);
  }
}
