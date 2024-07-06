export default class UserDTO {
  constructor({ first_name, last_name, email, _id, role, img, tickets, user }) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this._id = _id;
    this.role = role;
    this.img = img;
    this.tickets = tickets;
    this.user = user;
  }

  static fromUser(usr) {
    const { first_name, last_name, email, _id, role, img, tickets, user } = usr;
    return new UserDTO({
      first_name,
      last_name,
      email,
      _id,
      role,
      img,
      tickets,
      user,
    });
  }
}
