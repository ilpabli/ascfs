export default class ChatRepository {
  constructor(dao) {
    this.dao = dao;
  }
  async addMessage(newMessage) {
    return await this.dao.addMessage(newMessage);
  }
  async allMessage() {
    return await this.dao.allMessage();
  }
}
