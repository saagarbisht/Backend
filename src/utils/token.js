import jwt from "jsonwebtoken";

export const createToken = (userid, username) => {
  const token = jwt.sign({
    userid,
    username,
  }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" })
  return token;
}

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    return { userid: decoded.userid, error: null };
  } catch (error) {
    return { userid: null, error: "invalid token" };
  }
}