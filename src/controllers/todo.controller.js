import db from "../lib/db.js";
import response from "../utils/response.js";

async function getTodos(req, res) {
  try {
    const todoQuery = db.prepare(`SELECT * FROM todo WHERE user_id = ?`);
    const todos = todoQuery.all(req.userid);
    return response(res, 200, "all todos", todos, null);
  } catch (error) {
    console.log('error occured in getTodos functions of todo.controller.js of "/todos" route')
    return response(res, 504, "server error", null, null);
  }
};

async function postTodo(req, res) {
  const { task } = req.body;
  const userid = req.userid;
  if (!userid || !task) {
    console.log("error occured in postTodo function of todo.controller.js in '/todo' route (user id or task error)")
    return response(res, 504, "server error", null, null);
  }
  try {
    const todoQuery = db.prepare(`INSERT INTO todo (user_id, task, completed) VALUES (?, ?, ?)`);
    todoQuery.run(userid, task, 0);
    return response(res, 200, "todo added successfully", null, null);
  } catch (error) {
    console.log("error occured in postTodo function of todo.controller.js in '/todo' route (db error)")
    return response(res, 504, "server error", null, error);
  }

};

async function changeTodo(req, res) {
  const { id } = req.params;
  const { completed } = req.body;
  const userid = req.userid;
  if (!id || !completed || !userid) {
    console.log("error occured in changeTodo function of todo.controller.js in '/todo' route (id or task status error)");
    return response(res, 504, "server error", null, null);
  }
  try {
    const todoQuery = db.prepare(`UPDATE todo SET completed = ? WHERE user_id = ? AND id = ?`);
    todoQuery.run(completed, userid, id);
    return response(res, 200, "todo status changed", null, null)
  } catch (error) {
    console.log("error occured in changeTodo function of todo.controller.js in '/todo' route (db update error)")
    return response(res, 504, "server error", null, error);
  }
};

async function deleteTodo(req, res) {
  const { id } = req.params;
  const userid = req.userid;
  if (!id || !userid) {
    console.log("error occured in deleteTodo function of todo.controller.js in '/todo' route (todoid or userid error)");
    return response(res, 504, "server error", null, null);
  }
  try {
    const todoQuery = db.prepare(`DELETE FROM todo WHERE user_id = ? AND id = ?`);
    todoQuery.run(userid, id);
    return response(res, 200, "todo deleted successfully", null, null);
  } catch (error) {
    console.log("error occured in deleteTodo function of todo.controller.js in '/todo' route (db delete query error)");
    return response(res, 504, "server error", null, null);
  }
};

export {
  getTodos,
  postTodo,
  changeTodo,
  deleteTodo,
}