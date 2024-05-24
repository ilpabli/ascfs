import fs from "fs";

export default class ChatFileDAO {
  constructor() {
    this.path = "./src/chat/dao/chats.json";
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([]));
      console.log("Cree el archivo vacio");
    }
    this.messages = [];
    this.loadMessages();
  }

  async addMessage(newMessage) {
    this.messages.push(newMessage);
    await this.saveMessages();
    return newMessage;
  }

  async allMessage() {
    return this.messages.map((message) => ({ ...message }));
  }

  loadMessages() {
    try {
      const data = fs.readFileSync(this.path, "utf-8");
      this.messages = JSON.parse(data);
    } catch (error) {
      // If the file doesn't exist or there's an error, assume an empty array
      this.messages = [];
    }
  }

  async saveMessages() {
    const jsonData = JSON.stringify(this.messages, null, 2);
    try {
      await fs.promises.writeFile(this.path, jsonData, "utf-8");
    } catch (error) {
      throw new Error("Failed to save messages to filesystem.");
    }
  }
}
