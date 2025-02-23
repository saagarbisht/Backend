import express, { json } from "express";
import pkg from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import authRouter from "./routes/auth.routes.js";
import todoRouter from "./routes/todo.routes.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";

const app = express();
const PORT = process.env.PORT || 3000;
const { urlencoded } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicPath = path.resolve(__dirname, "../public");

app.use(cors());
app.use(cookieParser());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(express.static(publicPath));


app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
})

app.use('/auth', authRouter);
app.use('/todo', authMiddleware, todoRouter);

app.get("*", (req, res) => {
  res.status(404).sendFile(path.join(publicPath, "not-found.html"));
})

app.listen(PORT, () => {
  console.log(`live at http://localhost:${PORT}/`);
});