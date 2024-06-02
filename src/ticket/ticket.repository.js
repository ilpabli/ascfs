export default class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async addTicket(ticket) {
    return await this.dao.addTicket(ticket);
  }

  async getTickets() {
    return await this.dao.getTickets();
  }

  async getTicketsFiltered(limit, page, query) {
    return await this.dao.getTicketsFiltered(limit, page, query);
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

  async assingTicket(ticketId, assing) {
    return await this.dao.assingTicket(ticketId, assing);
  }

  async deleteTicket(ticketData) {
    return await this.dao.deleteTicket(ticketData);
  }
}
