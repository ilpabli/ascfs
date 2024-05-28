import { ticketModel } from "../model/ticket.model.js";
import { clientModel } from "../../client/model/client.model.js";
import MailingService from "../../mailing/mailing.service.js";

export default class ProductMongoDAO {
  constructor() {
    this.model = ticketModel;
    this.mailingService = new MailingService();
  }

  async addTicket(ticket) {
    if (
      !ticket.ticket_id ||
      !ticket.job_data ||
      !ticket.number_ele_esc ||
      !ticket.description
    ) {
      const missingProperties = [];
      if (!ticket.ticket_id) missingProperties.push("ticket_id");
      if (!ticket.job_data) missingProperties.push("job_data");
      if (!ticket.number_ele_esc) missingProperties.push("number_ele_esc");
      if (!ticket.description) missingProperties.push("description");

      const errorMessage = `Missing required properties: ${missingProperties.join(
        ", "
      )}`;
      throw new Error(errorMessage);
    }
    const job = await clientModel.findOne({ job_number: ticket.job_data });
    if (!job) {
      throw new Error(`Job with job_number ${ticket.job_data} not found`);
    }
    ticket.job_data = job._id;
    return await this.model.create(ticket);
  }

  async getTickets(limit, page, query) {
    let options = { limit, page };
    let filter = {};
    if (query?.ticket_status) {
      filter.ticket_status = query.ticket_status;
    }
    return await this.model.find(filter, options);
  }

  async getTicketsforSocket() {
    return await this.model.find().lean();
  }

  async getTicketforId(id) {
    const ticket = await this.model.findOne({ ticket_id: id }).lean();
    if (!ticket) {
      throw new Error(`Ticket ${id} not found`);
    }
    return await this.model.findOne({ ticket_id: id }).lean();
  }

  async updateTicket(id, field) {
    return await this.model.updateOne({ ticket_id: id }, field);
  }

  async deleteTicket(ticketData) {
    const ticket = await this.model.findOne({ user: ticketData });
    if (!ticket) {
      throw new Error(`Ticket ${ticketData} not found`);
    }
    return this.model.deleteOne({ ticket_id: ticketData });
  }
}
