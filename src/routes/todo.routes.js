import express from "express";
import { changeTodo, deleteTodo, getTodos, postTodo } from "../controllers/todo.controller.js";

const router = express.Router();

router.get("/", getTodos);
router.post("/", postTodo);
router.put("/:id", changeTodo);
router.delete("/:id", deleteTodo);


export default router;