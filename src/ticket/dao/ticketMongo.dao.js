import { ticketModel } from "../model/ticket.model.js";
import { clientModel } from "../../client/model/client.model.js";
import { userModel } from "../../user/model/user.model.js";
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

  async getTickets() {
    return await this.model.find().lean().populate("job_data");
  }

  async getTicketsFiltered(limit, page, query) {
    let options = { limit, page };
    let filter = {};
    if (query?.ticket_status) {
      filter.ticket_status = query.ticket_status;
    }
    return await this.model.find(filter, options).lean().populate("job_data");
  }

  async getTicketsforSocket() {
    return await this.model.find({ status_ele_esc: 'Fuera de servicio' }).lean().populate("job_data");
  }

  async getTicketforId(id) {
    const ticket = await this.model.findOne({ ticket_id: id }).lean();
    if (!ticket) {
      throw new Error(`Ticket ${id} not found`);
    }
    return await this.model.findOne({ ticket_id: id }).lean().populate("job_data");
  }

  async updateTicket(id, field) {
    return await this.model.updateOne({ ticket_id: id }, field);
  }

  async assingTicket(ticketId, assing) {
    const user = await userModel.findOne({user: assing.user });
    if (!user) {
      throw new Error(`User ${assing.user} not found`);
    }
    const ticket = await this.model.findOne({ ticket_id: ticketId }).lean();
    if (!ticket) {
      throw new Error(`Ticket ${ticketId} not found`);
    }
    user.tickets.push(ticket);
    await user.save();
    return await this.model.updateOne(
      { ticket_id: ticketId },
      { assigned_to: user.user }
    );
  }

  async deleteTicket(ticketData) {
    const ticket = await this.model.findOne({ user: ticketData });
    if (!ticket) {
      throw new Error(`Ticket ${ticketData} not found`);
    }
    return this.model.deleteOne({ ticket_id: ticketData });
  }
}
