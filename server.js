import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import path from "path";

import routes from "./routes/userroutes.js";

dotenv.config();

const app = express();


app.use(express.json());

app.use(morgan("dev"));

// CORS
app.use(
  cors({
    origin:
      "http://localhost:5173",

    credentials: true,
  })
);


app.use("/api/routes", routes);


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB connected");

    app.listen(
      process.env.PORT,
      () => {
        console.log(
          `Server running on ${process.env.PORT}`
        );
      }
    );
  })
  .catch((err) => {
    console.log(err);
  });