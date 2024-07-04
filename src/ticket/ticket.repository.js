export default class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async addTicket(ticket, user) {
    return await this.dao.addTicket(ticket, user);
  }

  async getTickets() {
    return await this.dao.getTickets();
  }

  async getTicketsFiltered(query) {
    return await this.dao.getTicketsFiltered(query);
  }

  async getTicketsforTech(user, query) {
    return await this.dao.getTicketsforTech(user, query);
  }

  async getTicketsforSocket() {
    return await this.dao.getTicketsforSocket();
  }

  async getTicketforId(id) {
    return await this.dao.getTicketforId(id);
  }

  async updateTicket(id, field) {
    return await this.dao.updateTicket(id, field);
  }

  async assignTicket(ticketId, assing) {
    return await this.dao.assignTicket(ticketId, assing);
  }

  async workingTicket(ticketId, state, user) {
    return await this.dao.workingTicket(ticketId, state, user);
  }

  async deleteTicket(ticketId) {
    return await this.dao.deleteTicket(ticketId);
  }
}
