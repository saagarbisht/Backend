import response from "../utils/response.js";
import { verifyToken } from "../utils/token.js";

export const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return response(res, 401, "unauthoized access", null, "no token provided");
  }
  const { userid, error } = verifyToken(token);

  if (error) {
    return response(res, 401, "unauthorized access", null, error)
  }
  req.userid = userid;
  next();
}
