import bcrypt from "bcryptjs";

export const encryptPassword = (password) => {
  return bcrypt.hashSync(password, 8);
}

export const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
}