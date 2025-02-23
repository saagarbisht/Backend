import db from "../lib/db.js";
import { comparePassword, encryptPassword } from "../utils/encrypt.js";
import response from "../utils/response.js";
import { createToken } from "../utils/token.js";

async function authRegister(req, res) {
  const { username, password } = req.body;
  try {
    const getUser = db.prepare(`SELECT * FROM user WHERE username = ?`);
    const user = getUser.get(username);
    if (user) {
      return response(res, 200, "user already exist", null, null);
    }
  } catch (error) {
    console.log('error occured in the authRegister function of "auth/regiter" route (checking data)');
    return response(res, 503, "Server Error", null, error.message);
  }
  const hashPassword = encryptPassword(password);
  try {
    const interUser = db.prepare(`INSERT INTO user (username, password) VALUES (?, ?)`);
    const userResult = interUser.run(username, hashPassword);

    const defaultTody = "Hello 😇 Add your first todo!";
    const insertTodo = db.prepare(`INSERT INTO todo (user_id, task, completed) VALUES (?, ?, ?)`);
    insertTodo.run(userResult.lastInsertRowid, defaultTody, 0);

    const token = createToken(userResult.lastInsertRowid, username);

    return response(res, 201, "user created successfully", { token }, null);
  } catch (error) {
    console.log('error occured in the authRegister function of "auth/regiter" route (inserting data)');
    return response(res, 503, "Server Error", null, error.message);
  }
};

async function authLogin(req, res) {
  const { username, password } = req.body;
  try {
    const getUser = db.prepare(`SELECT * FROM user WHERE username = ?`);
    const user = getUser.get(username);

    if (!user) {
      return response(res, 401, "invalid username", null, null);
    }

    const isPasswordValid = comparePassword(password, user.password);

    if (!isPasswordValid) {
      return response(res, 401, "invalid password", null, null);
    }

    const token = createToken(user.id, user.username);

    return response(res, 200, "user logged in successfully", { token }, null);

  } catch (error) {
    console.log('error occured in the authLogin function of "auth/login" route (checking user data)');
    return response(res, 503, "Server Error", null, error.message);
  }
};

export {
  authRegister,
  authLogin
}