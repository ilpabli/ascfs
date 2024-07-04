import { ticketModel } from "../model/ticket.model.js";
import { clientModel } from "../../client/model/client.model.js";
import { userModel } from "../../user/model/user.model.js";
import { getGMTMinus3Date } from "../../utils/time.util.js";

export default class ProductMongoDAO {
  constructor() {
    this.model = ticketModel;
  }

  async addTicket(ticket, user) {
    try {
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
      if (user.user) {
        ticket.owner = user._id;
      }
      return await this.model.create(ticket);
    } catch (error) {
      throw error;
    }
  }

  async getTickets() {
    try {
      return await this.model
        .find()
        .lean()
        .populate("job_data")
        .populate({
          path: "assigned_to",
          select: "-password",
        })
        .populate({
          path: "owner",
          select: "user",
        });
    } catch (error) {
      throw error;
    }
  }

  async getTicketsFiltered(query) {
    try {
      let options = {};
      let filter = {};
      if (query?.ticket_status) {
        filter.ticket_status = query.ticket_status;
      }
      if (query?.assigned_to) {
        filter.assigned_to = query.assigned_to;
      }
      return await this.model
        .find(filter, options)
        .lean()
        .populate("job_data")
        .populate({
          path: "assigned_to",
          select: "-password",
        })
        .populate({
          path: "owner",
          select: "user",
        });
    } catch (error) {
      throw error;
    }
  }

  async getTicketsforSocket() {
    return await this.model
      .find({ status_ele_esc: "Fuera de servicio" })
      .lean()
      .populate("job_data")
      .populate({
        path: "assigned_to",
        select: "-password",
      })
      .populate({
        path: "owner",
        select: "user",
      });
  }

  async getTicketforId(id) {
    try {
      const ticket = await this.model.findOne({ ticket_id: id }).lean();
      if (!ticket) {
        throw new Error(`Ticket ${id} not found`);
      }
      return await this.model
        .findOne({ ticket_id: id })
        .lean()
        .populate("job_data")
        .populate({
          path: "assigned_to",
          select: "-password",
        })
        .populate({
          path: "owner",
          select: "user",
        });
    } catch (error) {
      throw error;
    }
  }

  async updateTicket(id, field) {
    try {
      return await this.model.updateOne({ ticket_id: id }, field);
    } catch (error) {
      throw error;
    }
  }

  async assignTicket(ticketId, assing) {
    try {
      if (assing.user === "refresh") {
        const ticket = await this.model.findOne({ ticket_id: ticketId }).lean();
        if (!ticket) {
          throw new Error(`Ticket ${ticketId} not found`);
        }
        const user = await userModel.findOne({ _id: ticket.assigned_to });
        if (!user) {
          throw new Error(`User not defined in ticket`);
        }
        const updatedUser = await userModel.findOneAndUpdate(
          { _id: user._id },
          { $pull: { tickets: ticket._id } },
          { new: true }
        );
        if (!updatedUser) {
          throw new Error(`Failed to update user ${user._id}`);
        }
        return await this.model.updateOne(
          { ticket_id: ticketId },
          { assigned_to: null, ticket_assignedAt: "", ticket_workingAt: "", ticket_status: "Abierto" }
        );
      }
    } catch (error) {
      throw error;
    }
    try {
      const user = await userModel.findOne({ user: assing.user });
      if (!user) {
        throw new Error(`User ${assing.user} not found`);
      }
      const ticket = await this.model.findOne({ ticket_id: ticketId }).lean();
      if (!ticket) {
        throw new Error(`Ticket ${ticketId} not found`);
      }
      user.tickets.push(ticket);
      await user.save();
      const gmtMinus3Date = getGMTMinus3Date();
      return await this.model.updateOne(
        { ticket_id: ticketId },
        { assigned_to: user._id, ticket_assignedAt: gmtMinus3Date }
      );
    } catch (error) {
      throw error;
    }
  }

  async workingTicket(ticketId, state, usr) {
    try {
      const ticket = await this.model.findOne({ ticket_id: ticketId }).populate({
        path: "assigned_to",
        select: "-password",
      }).lean()
      if (!ticket) {
        throw new Error(`Ticket ${ticketId} not found`);
      }
      const user = await userModel.findOne({ user: usr.user })
      if (!user) {
        throw new Error(`User ${usr.user} not found`);
      }

      const { ticket_workingAt, ticket_closedAt, solution, status_ele_esc, ticket_status } = state;
      const gmtMinus3Date = getGMTMinus3Date();
      const updateFields = {};
      if (ticket_workingAt !== undefined) updateFields.ticket_workingAt = gmtMinus3Date;
      if (ticket_closedAt !== undefined) updateFields.ticket_closedAt = gmtMinus3Date;
      if (solution !== undefined) updateFields.solution = solution;
      if (ticket_status !== undefined) updateFields.ticket_status = ticket_status;
      if (status_ele_esc !== undefined) updateFields.status_ele_esc = status_ele_esc;
      if (user.role === "admin" || user.role === "supervisor"){       
        return await this.model.updateOne({ _id: ticket._id }, updateFields);}
         else if (user.user === ticket.assigned_to.user){
          return await this.model.updateOne({ _id: ticket._id }, updateFields)
        }
        throw new Error(`Role o user not authorized`);
      ;
    } catch (error) {
      throw error;
    }
  }

  async deleteTicket(ticketId) {
    try {
      const ticket = await this.model.findOne({ ticket_id: ticketId });
      if (!ticket) {
        throw new Error(`Ticket ${ticketId} not found`);
      }
      const ticketAssigned = ticket.assigned_to;
      if ((ticket.assigned_to = !"")) {
        const user = await userModel.findOne({ user: ticketAssigned });
        if (!user) {
          return this.model.deleteOne({ ticket_id: ticketId });
        }
        const updatedUser = await userModel.findOneAndUpdate(
          { _id: user._id },
          { $pull: { tickets: ticket._id } },
          { new: true }
        );
        if (!updatedUser) {
          throw new Error(`Failed to update user ${user._id}`);
        }
      }
      return this.model.deleteOne({ ticket_id: ticketId });
    } catch (error) {
      throw error;
    }
  }
}
