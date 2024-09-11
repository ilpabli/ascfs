import { userModel } from "../model/user.model.js";
import { getDateGMT } from "../../utils/time.util.js";
import { comparePassword, hashPassword } from "../../utils/encript.util.js";

export default class UserMongoDAO {
  constructor() {
    this.model = userModel;
  }

  async getAll() {
    try {
      return await this.model
        .find()
        .sort({ first_name: 1 })
        .select("-password")
        .lean();
    } catch (error) {
      throw error;
    }
  }

  async getAllFiltered(limit, page, query) {
    try {
      let options = {
        lean: true,
        limit,
        page,
        select: "-password",
        sort: { first_name: 1 },
      };
      let filter = {};
      if (query?.role) {
        filter.role = query.role;
      }
      if (query?.first_name) {
        filter.first_name = { $regex: query.first_name, $options: "i" };
      }
      return await this.model.paginate(filter, options);
    } catch (error) {
      throw error;
    }
  }

  async getAllTechnicians(query) {
    try {
      const gmtMinus3 = getDateGMT();
      if (query?.last_location_update) {
        const numberSend = Number(query?.last_location_update);
        if (!isNaN(numberSend)) {
          const setHoursAgo = new Date(gmtMinus3 - numberSend * 60 * 60 * 1000);
          return await this.model
            .find({
              role: "technician",
              last_location_update: { $gte: setHoursAgo },
            })
            .sort({ user: 1 })
            .select("-password -tickets")
            .lean();
        }
        throw new Error(`The last location update query fail`);
      }
      return await this.model
        .find({ role: "technician" })
        .sort({ user: 1 })
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

  async updatePassword(userId, data) {
    try {
      const { currentPassword, newPassword } = data;

      if (!comparePassword(userId, currentPassword)) {
        throw new Error("La contraseña actual es incorrecta");
      }

      if (comparePassword(userId, newPassword)) {
        throw new Error("La nueva contraseña es igual a la actual");
      }

      const hashedPassword = hashPassword(newPassword);

      return this.model.updateOne(
        { user: userId.user },
        { password: hashedPassword }
      );
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(userId) {
    try {
      const hashedPassword = hashPassword(userId);
      return this.model.updateOne(
        { user: userId },
        { password: hashedPassword }
      );
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
      return await this.model.updateOne(
        { user: usr },
        { $set: location, last_location_update: gmtMinus3 }
      );
    } catch (error) {
      throw error;
    }
  }
}
