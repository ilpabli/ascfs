import UserDTO from "../dto/user.dto.js";

function updateUser(req, res, next) {
  const userDTO = new UserDTO(req.user);
  req.user = userDTO;
  next();
}

export { updateUser };
