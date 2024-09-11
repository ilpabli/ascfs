import { clientModel } from "../model/client.model.js";

export default class UserMongoDAO {
  constructor() {
    this.model = clientModel;
  }

  async getAll() {
    return await this.model.find().lean();
  }

  async getAllFiltered(limit, page, query) {
    try {
      if (query.full) {
        return await this.model
          .find()
          .sort({ job_number: 1 })
          .select("-tickets")
          .lean();
      }
      if (page) {
        let options = {
          lean: true,
          limit,
          page,
          select: "-tickets",
          sort: { job_number: 1 },
        };
        let filter = {};
        if (query?.job_name) {
          filter.job_name = { $regex: query.job_name, $options: "i" };
        }
        return await this.model.paginate(filter, options);
      }
      return await this.model
        .find()
        .sort({ job_number: 1 })
        .select("-tickets")
        .lean();
    } catch (error) {
      throw error;
    }
  }

  async createClient(clientData) {
    if (
      !clientData.job_number ||
      !clientData.job_name ||
      !clientData.job_address
    ) {
      const missingProperties = [];
      if (!clientData.job_number) missingProperties.push("job_number");
      if (!clientData.job_name) missingProperties.push("job_name");
      if (!clientData.job_address) missingProperties.push("job_address");

      const errorMessage = `Missing required properties: ${missingProperties.join(
        ", "
      )}`;
      throw new Error(errorMessage);
    }
    return await this.model.create(clientData);
  }

  async getByJobNumber(jobNumber) {
    const job = await clientModel.findOne({ job_number: jobNumber });
    if (!job) {
      throw new Error(`Job number ${jobNumber} not found`);
    }
    return await this.model
      .findOne({ job_number: jobNumber })
      .populate("tickets")
      .lean();
  }

  async updateClient(jobNumber, field) {
    try {
      const job = await this.model.findOne({ job_number: jobNumber });
      if (!job) {
        throw new Error(`Client ${id} not found`);
      }
      return await this.model.updateOne({ _id: job._id }, field);
    } catch (error) {
      throw error;
    }
  }

  async deleteClient(jobNumber) {
    try {
      const job = await this.model.findOne({ job_number: jobNumber });
      if (!job) {
        throw new Error(`Client ${id} not found`);
      }
      return this.model.deleteOne({ _id: job._id });
    } catch (error) {
      throw error;
    }
  }
}
