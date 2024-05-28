import { clientModel } from "../model/client.model.js";

export default class UserMongoDAO {
  constructor() {
    this.model = clientModel;
  }

  async getAll() {
    return await this.model.find().lean();
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
}
