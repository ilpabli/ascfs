import { messageModel } from "../model/message.model.js";

export default class ChatMongoDAO {
  constructor() {
    this.model = messageModel;
  }
  async addMessage(newMessage) {
    return await this.model.create(newMessage);
  }
  async allMessage() {
    return await this.model.find().lean();
  }
}
