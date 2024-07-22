import { userModel } from "../model/user.model.js";
import { getDateGMT } from "../../utils/time.util.js";

export default class UserMongoDAO {
  constructor() {
    this.model = userModel;
  }

  async getAll() {
    try {
      return await this.model.find().populate("tickets").lean();
    } catch (error) {
      throw error;
    }
  }

  async getAllFiltered() {
    try {
      const list = await this.model.find().populate("tickets").lean();
      const newList = [];
      list.forEach((eLe) => {
        const user = {
          _id: eLe._id,
          full_name: eLe.first_name + " " + eLe.last_name,
          user: eLe.user,
          role: eLe.role,
          img: eLe.img,
          last_connection: eLe.last_connection,
          email: eLe.email,
          tickets: eLe.tickets,
        };
        newList.push(user);
      });
      return newList;
    } catch (error) {
      throw error;
    }
  }

  async getAllTechnicians(query) {
    try {
      const gmtMinus3 = getDateGMT();
      if (query?.last_location_update === "12") {
        const twelveHoursAgo = new Date(gmtMinus3 - 12 * 60 * 60 * 1000);
        return await this.model
        .find({ 
          role: "technician",
          last_location_update: { $gte: twelveHoursAgo }
        })
        .select("-password -tickets")
        .lean();
      }
      return await this.model
        .find({ role: "technician" })
        .select("-password -tickets")
        .lean();
    } catch (error) {
      throw error;
    }
  }

  async createUser(userData) {
    try {
      return await this.model.create(userData);
    } catch (error) {
      throw error;
    }
  }

  async getByUser(user) {
    try {
      if (!user) {
        throw new Error(`User ${id} not found`);
      }
      return await this.model
        .findOne({ user: user })
        .populate("tickets")
        .lean();
    } catch (error) {
      throw error;
    }
  }

  async getTicketsForUser(usr) {
    try {
      if (!usr) {
        throw new Error(`User ${usr} not found`);
      }
      return await this.model
        .findOne({ user: usr })
        .select("-password")
        .lean()
        .populate({
          path: "tickets",
          match: { ticket_status: { $in: ["Abierto", "En proceso"] } },
          populate: "job_data",
        });
    } catch (error) {
      throw error;
    }
  }

  async getById(uid) {
    try {
      if (!uid) {
        throw new Error(`User ${uid} not found`);
      }
      return await this.model.findOne({ _id: uid }).populate("tickets").lean();
    } catch (error) {
      throw error;
    }
  }

  async updateDate(uid) {
    try {
      const gmtMinus3 = getDateGMT();
      return await this.model.updateOne(
        { _id: uid },
        { last_connection: gmtMinus3 }
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userData) {
    try {
      const user = await this.model.findOne({ user: userData });
      if (!user) {
        throw new Error(`User ${id} not found`);
      }
      return this.model.deleteOne({ _id: user._id });
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userData, field) {
    try {
      return await this.model.updateOne({ user: userData }, field);
    } catch (error) {
      throw error;
    }
  }

  async updateLocation(usr, location) {
    try {
      if (
        !location.gps_point ||
        typeof location.gps_point !== "object" ||
        !location.gps_point.hasOwnProperty("lat") ||
        !location.gps_point.hasOwnProperty("lng")
      ) {
        throw new Error(
          "gps_point debe ser un objeto con propiedades lat y lng"
        );
      }
      const gmtMinus3 = getDateGMT();
      return await this.model.updateOne({ user: usr },{ $set: location, last_location_update: gmtMinus3} );
    } catch (error) {
      throw error;
    }
  }
}
