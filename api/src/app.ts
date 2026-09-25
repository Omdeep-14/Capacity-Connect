import express from "express";
import { errorHandler } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/trainer/trainer.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";

const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());

//routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/auth", authRoutes);
app.use("/api/trainer", userRoutes);
app.use("/api/admin", adminRoutes);

//Central error Handler
app.use(errorHandler);

export default app;
