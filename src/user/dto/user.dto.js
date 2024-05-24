export default class UserDTO {
  constructor({ first_name, last_name, email, _id, role, cart, img }) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this._id = _id;
    this.role = role;
    this.cart = cart;
    this.img = img;
  }
}
