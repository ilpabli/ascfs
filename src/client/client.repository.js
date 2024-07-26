export default class ClientRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAll() {
    return await this.dao.getAll();
  }

  async getAllFiltered(limit, page, query) {
    return await this.dao.getAllFiltered(limit, page, query);
  }

  async createClient(clientData) {
    return await this.dao.createClient(clientData);
  }

  async getByJobNumber(jobNumber) {
    return await this.dao.getByJobNumber(jobNumber);
  }

  async updateClient(id, field) {
    return await this.dao.updateClient(id, field);
  }

  async deleteClient(jobNumber) {
    return await this.dao.deleteClient(jobNumber);
  }
}
